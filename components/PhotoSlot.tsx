"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const LOCK_PHOTOS = process.env.NEXT_PUBLIC_LOCK_PHOTOS === "true";

interface PhotoSlotProps {
  slotId: string;
  caption?: string;
}

export default function PhotoSlot({ slotId, caption }: PhotoSlotProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load persisted photo on mount
  useEffect(() => {
    fetch(`/api/upload?slotId=${encodeURIComponent(slotId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.url) setPreview(data.url);
      })
      .catch(() => {});
  }, [slotId]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("La imagen no puede superar 8 MB.");
      return;
    }

    setError(null);
    setUploading(true);

    // Immediate local preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Reset input so the same file can be selected again later
    if (inputRef.current) inputRef.current.value = "";

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slotId", slotId);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Error al subir la imagen.");
      }
      const data = await res.json();
      setPreview(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen.");
      // Keep the local base64 preview so the user still sees something
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (LOCK_PHOTOS) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleClick = () => {
    if (LOCK_PHOTOS) return;
    inputRef.current?.click();
  };

  const isClickable = !LOCK_PHOTOS && !uploading;

  return (
    <div className="flex flex-col gap-2 h-full">
      <div
        className={`photo-slot relative flex-1 min-h-0 ${preview ? "has-photo" : ""} ${
          isClickable ? "cursor-pointer group" : "cursor-default"
        }`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); }}
        onDragEnter={(e) => { e.preventDefault(); }}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        aria-label={isClickable ? (preview ? "Cambiar foto" : "Subir foto") : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleChange}
          tabIndex={-1}
        />

        {preview ? (
          <>
            <Image
              src={preview}
              alt="Foto del momento"
              fill
              className={`object-cover transition-transform duration-500 ${isClickable ? "group-hover:scale-105" : ""}`}
              unoptimized={preview.startsWith("data:")}
            />
            {/* Hover overlay — only shown when not locked */}
            {!LOCK_PHOTOS && (
              <div className="absolute inset-0 bg-blush-500/0 group-hover:bg-blush-500/20 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1 text-xs text-blush-700 font-sans font-medium shadow-sm">
                  Cambiar foto
                </span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blush-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </>
        ) : (
          /* Empty slot — hidden entirely when locked */
          !LOCK_PHOTOS && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-blush-300 group-hover:text-blush-400 transition-colors duration-300">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-blush-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-xl">+</span>
                )}
              </div>
              <span className="font-sans text-xs text-center px-4">
                {uploading ? "Subiendo..." : "Añadir foto"}
              </span>
            </div>
          )
        )}
      </div>

      {error && (
        <p className="font-sans text-xs text-rose-400 text-center">{error}</p>
      )}
      {caption && (
        <p className="font-script text-sm text-blush-400 text-center leading-snug">{caption}</p>
      )}
    </div>
  );
}
