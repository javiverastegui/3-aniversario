"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ChapterDividerProps {
  number: number;
  title: string;
  year: string;
}

export default function ChapterDivider({ number, title, year }: ChapterDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative py-16 sm:py-24 flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Background blob */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
        <div className="w-64 h-64 bg-gold-100 rounded-full opacity-40 blur-3xl" />
      </div>

      {/* Chapter number watermark */}
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="absolute font-serif font-bold text-blush-100 select-none pointer-events-none"
        style={{ fontSize: "clamp(6rem, 20vw, 14rem)", lineHeight: 1 }}
        aria-hidden
      >
        {number}
      </motion.span>

      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-sans text-xs uppercase tracking-[0.25em] text-gold-500 mb-3"
        >
          Capítulo {number}  ·  {year}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-3xl sm:text-5xl font-bold italic text-blush-800 mb-6"
        >
          {title}
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="divider-line max-w-xs mx-auto"
        />
      </div>
    </div>
  );
}
