"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const START_DATE = new Date("2023-05-05T00:00:00");

function formatUptime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

function getDaysTogether() {
  return Math.floor((Date.now() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
}

export default function DevFooter() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [uptime, setUptime] = useState("");
  const [days, setDays] = useState(0);

  useEffect(() => {
    const tick = () => {
      const diff = Date.now() - START_DATE.getTime();
      setUptime(formatUptime(diff));
      setDays(getDaysTogether());
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const tags = [
    { key: "project", value: '"hedder-alissa-v3"' },
    { key: "branch", value: '"main"' },
    { key: "status", value: '"💚 running"' },
    { key: "started", value: '"2023-05-05T00:00:00"' },
    { key: "uptime", value: uptime ? `"${uptime}"` : '"calculating..."' },
    { key: "days_together", value: days ? `${days}` : "..." },
    { key: "commits", value: '"∞"' },
    { key: "conflicts_resolved", value: '"todos"' },
    { key: "merge_strategy", value: '"amor"' },
    { key: "dependencies", value: '["café", "risas", "tiempo", "paciencia"]' },
    { key: "maintainer", value: '"@javiverastegui"' },
    { key: "license", value: '"MIT — Más que Infinito Tuyo"' },
  ];

  return (
    <footer ref={ref} className="relative py-16 sm:py-20 px-6 overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-blush-900" aria-hidden />
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blush-500 to-transparent" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blush-700 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gold-600 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-gold-400" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="font-sans text-xs text-blush-400 tracking-widest">
            relationship.config.ts
          </span>
        </motion.div>

        {/* Code block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="bg-blush-950/80 border border-blush-700/40 rounded-2xl p-6 sm:p-8 font-mono text-sm shadow-2xl overflow-x-auto"
          style={{ background: "rgba(15, 5, 10, 0.85)" }}
        >
          <div className="text-blush-500 mb-2 text-xs">// 3 años no es un número. Es una decisión que se renueva cada mañana.</div>
          <div className="text-blush-300 mb-1">
            <span className="text-gold-400">const</span>{" "}
            <span className="text-blush-200">relationship</span>{" "}
            <span className="text-blush-400">=</span>{" "}
            <span className="text-gold-400">{"{"}</span>
          </div>

          {tags.map(({ key, value }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
              className="pl-6 flex gap-2 text-xs sm:text-sm leading-7"
            >
              <span className="text-blush-400">{key}</span>
              <span className="text-blush-600">:</span>
              <span className={`${value.startsWith('"') ? "text-green-400" : value.startsWith("[") ? "text-orange-300" : "text-gold-300"}`}>
                {value}
              </span>
              <span className="text-blush-600">,</span>
            </motion.div>
          ))}

          <div className="text-gold-400 mt-1">{"}"}</div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-4 pt-4 border-t border-blush-800/60 text-xs text-blush-500"
          >
            <span className="text-blush-600">$ </span>
            <span className="text-blush-300">git log --oneline -1</span>
            <br />
            <span className="text-green-500">✓</span>{" "}
            <span className="text-blush-400">commit </span>
            <span className="text-gold-400">3año5may</span>{" "}
            <span className="text-blush-500 italic">— &quot;merge: tú y yo, sin conflictos pendientes&quot;</span>
          </motion.div>
        </motion.div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-8 text-center"
        >
          <p className="font-sans text-xs text-blush-600 tracking-widest uppercase mb-2">
            Hecho con código, pero sobre todo con amor
          </p>
          <p className="font-script text-lg text-blush-400">
            Para Hedder · 5 de Mayo de 2023 ~ siempre
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
