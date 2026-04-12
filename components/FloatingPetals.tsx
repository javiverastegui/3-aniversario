"use client";

import { useEffect, useState } from "react";

interface Petal {
  id: number;
  left: string;
  size: string;
  duration: string;
  delay: string;
  emoji: string;
  opacity: number;
}

const PETAL_EMOJIS = ["🌸", "🌺", "✨", "💛", "🌼", "💕", "🌷"];

export default function FloatingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const generated: Petal[] = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${0.8 + Math.random() * 0.8}rem`,
      duration: `${7 + Math.random() * 8}s`,
      delay: `${Math.random() * 10}s`,
      emoji: PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)],
      opacity: 0.4 + Math.random() * 0.5,
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="absolute petal select-none"
          style={{
            left: petal.left,
            fontSize: petal.size,
            animationDuration: petal.duration,
            animationDelay: petal.delay,
            opacity: petal.opacity,
            top: 0,
          }}
        >
          {petal.emoji}
        </span>
      ))}
    </div>
  );
}
