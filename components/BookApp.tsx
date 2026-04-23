"use client";

import { useState, useMemo, useEffect } from "react";
import Book from "./Book";

function Petals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 14,
        duration: 16 + Math.random() * 14,
        char: (["✦", "❀", "✿"] as const)[i % 3],
      })),
    []
  );
  return (
    <>
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: p.left + "%",
            animationDelay: `-${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.char}
        </span>
      ))}
    </>
  );
}

function EasterEgg() {
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    let clicks = 0;
    let t: ReturnType<typeof setTimeout> | null = null;

    const onClick = (e: MouseEvent) => {
      clicks += 1;
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        clicks = 0;
      }, 500);
      if (clicks >= 3) {
        clicks = 0;
        const id = Math.random();
        setHearts((h) => [...h, { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => setHearts((h) => h.filter((x) => x.id !== id)), 2400);
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
      {hearts.map((h) => (
        <div
          key={h.id}
          style={{
            position: "absolute",
            left: h.x - 12,
            top: h.y - 12,
            fontSize: 28,
            color: "#b5472a",
            animation: "floatup 2.4s ease-out forwards",
          }}
        >
          ♥
        </div>
      ))}
    </div>
  );
}

export default function BookApp() {
  return (
    <div className="desk">
      <Petals />
      <EasterEgg />
      <div className="book-title">
        <div className="vol">— Vol. III · MMXXVI —</div>
        <div className="heading">El Libro de Nosotros</div>
        <div className="sub">hedder &amp; javier · tres años</div>
      </div>
      <Book />
      <div className="book-hint">← → para pasar página · 3 clicks ♥</div>
    </div>
  );
}
