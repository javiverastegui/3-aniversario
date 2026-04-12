"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import PhotoSlot from "./PhotoSlot";

interface MomentSectionProps {
  id: string;
  chapterNumber: number;
  year: string;
  title: string;
  location?: string;
  description: string;
  quote?: string;
  photoCaptions?: [string, string, string];
  reversed?: boolean;
  accentColor?: "rose" | "gold";
}

export default function MomentSection({
  id,
  chapterNumber,
  year,
  title,
  location,
  description,
  quote,
  photoCaptions = ["El instante", "Un recuerdo", "Siempre"],
  reversed = false,
  accentColor = "rose",
}: MomentSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const textVariants = {
    hidden: { opacity: 0, x: reversed ? 40 : -40 },
    visible: { opacity: 1, x: 0 },
  };

  const photosVariants = {
    hidden: { opacity: 0, x: reversed ? -40 : 40 },
    visible: { opacity: 1, x: 0 },
  };

  const isGold = accentColor === "gold";

  return (
    <section
      id={id}
      ref={ref}
      className="relative py-16 sm:py-24 px-6 overflow-hidden"
    >
      {/* Blob decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className={`absolute ${reversed ? "right-0 -translate-x-1/4" : "left-0 translate-x-1/4"} top-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-20 ${
            isGold ? "bg-gold-200" : "bg-blush-200"
          }`}
        />
      </div>

      <div
        className={`relative z-10 max-w-5xl mx-auto flex flex-col ${
          reversed ? "lg:flex-row-reverse" : "lg:flex-row"
        } gap-12 items-center`}
      >
        {/* Text content */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 min-w-0"
        >
          {/* Chapter badge */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-serif text-sm font-bold ${
                isGold ? "bg-gold-400" : "bg-blush-400"
              }`}
            >
              {chapterNumber}
            </span>
            <span
              className={`font-sans text-xs uppercase tracking-widest ${
                isGold ? "text-gold-600" : "text-blush-500"
              }`}
            >
              {year}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold italic text-blush-900 mb-2 leading-tight">
            {title}
          </h2>

          {location && (
            <p
              className={`font-sans text-sm mb-6 flex items-center gap-1 ${
                isGold ? "text-gold-600" : "text-blush-400"
              }`}
            >
              <span>📍</span>
              <span>{location}</span>
            </p>
          )}

          {/* Divider */}
          <div
            className={`h-px mb-6 max-w-xs ${
              isGold
                ? "bg-gradient-to-r from-gold-300 to-transparent"
                : "bg-gradient-to-r from-blush-300 to-transparent"
            }`}
          />

          {/* Description */}
          <p className="font-sans text-base sm:text-lg text-blush-800 leading-relaxed mb-8 font-light">
            {description}
          </p>

          {/* Quote */}
          {quote && (
            <blockquote className="relative pl-5 border-l-2 border-blush-300">
              <span className="font-script text-lg sm:text-xl text-blush-600 italic leading-relaxed">
                &ldquo;{quote}&rdquo;
              </span>
            </blockquote>
          )}
        </motion.div>

        {/* Photos grid */}
        <motion.div
          variants={photosVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="flex-1 min-w-0 w-full"
        >
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {/* Large center photo */}
            <div className="col-span-1 flex flex-col gap-3">
              <div className="flex-1">
                <PhotoSlot
                  slotId={`${id}-1`}
                  caption={photoCaptions[0]}
                />
              </div>
            </div>

            {/* Right column: two stacked */}
            <div className="col-span-2 grid grid-rows-2 gap-3">
              <div className="row-span-1 h-40 sm:h-52">
                <div className="h-full">
                  <PhotoSlot
                    slotId={`${id}-2`}
                    caption={photoCaptions[1]}
                  />
                </div>
              </div>
              <div className="row-span-1 h-40 sm:h-52">
                <div className="h-full">
                  <PhotoSlot
                    slotId={`${id}-3`}
                    caption={photoCaptions[2]}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
