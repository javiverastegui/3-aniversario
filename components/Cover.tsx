"use client";

import { motion } from "framer-motion";

const startDate = new Date("2023-05-05");

function getYearsMonthsDays() {
  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}

function getDaysTogether() {
  const now = new Date();
  const diff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function Cover() {
  const { years, months, days } = getYearsMonthsDays();
  const totalDays = getDaysTogether();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blush-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blush-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Opening date tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-blush-200 rounded-full px-5 py-2 mb-8 shadow-sm"
        >
          <span className="text-blush-500 text-sm">✦</span>
          <span className="font-sans text-blush-600 text-sm tracking-widest uppercase font-medium">
            5 de Mayo, 2023
          </span>
          <span className="text-blush-500 text-sm">✦</span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold italic mb-4 leading-tight"
        >
          <span className="text-gradient-romantic">Hedder</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="font-script text-2xl sm:text-3xl text-blush-400 mb-2"
        >
          Alissa Espinoza Arrigada
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="divider-line my-8 max-w-xs mx-auto"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="font-serif text-xl sm:text-2xl italic text-blush-700 mb-12 leading-relaxed"
        >
          Una historia que comenzó con un café<br className="hidden sm:block" /> y que no ha dejado de escribirse.
        </motion.p>

        {/* Counter grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-12"
        >
          {[
            { value: years, label: years === 1 ? "año" : "años" },
            { value: months, label: months === 1 ? "mes" : "meses" },
            { value: days, label: days === 1 ? "día" : "días" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="glass-card rounded-2xl py-4 px-3 flex flex-col items-center"
            >
              <span className="font-serif text-4xl font-bold text-gradient-rose leading-none">
                {value}
              </span>
              <span className="font-sans text-xs text-blush-400 uppercase tracking-widest mt-1">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Total days */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="font-sans text-sm text-blush-400 mb-16"
        >
          {totalDays.toLocaleString("es-CL")} días juntos y contando
        </motion.p>

        {/* Scroll prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="flex flex-col items-center gap-2"
        >
          <p className="font-sans text-xs text-blush-300 uppercase tracking-widest">
            Desplaza para leer nuestra historia
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-blush-300 text-lg"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
