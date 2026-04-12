"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function FinalLetter() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const paragraphs = [
    `Hedder, amorcito, chiquibubu (aunque no te lo he dicho últimamente). Ya cumplimos 3 años y además de escribirte esta carta digital, quiero que sea un tributo y una conmemoración a la gran persona que fuiste y eres.`,
  
    `Han pasado muchas cosas en estos 3 años, cosas muy buenas, y cosas muy malas, hemos tomado distancia, hemos cometido errores. Pero hemos aprendido de ellos, y lo más importante, has decidido quedarte, a seguir intentándolo, una y otra vez. Y mira hasta donde hemos llegado, ¡3 años!`,
  
    `Por todo esto, agradezco la persona que eres, tu forma de ser, tu alma. Son muy pocas personas las que han decidido, a pesar de que me equivoco (y muy probablemente lo seguiré haciendo), se han quedado. Y por esto, te lo agradeceré toda mi vida.`,
  
    `No sé lo que viene. Nadie lo sabe. Pero sé esto con la certeza de muy pocas cosas en la vida: quiero seguir escribiendo mi, nuestra historia contigo. Quiero que cada próximo capítulo de la vida te encuentre floreciendo, y que yo tenga el privilegio de estar bien cerca para ver tanto cómo floreces como los frutos que das.`,
  
    `Gracias por existir, por elegirme y en especial, por quedarte. Por cada versión de ti que he conocido y por todas las que faltan. Eres, en el sentido más profundo que conozco, mi persona.`,

    `PD: Se que tenemos muchos más recuerdos, la playa (las dos veces), el último matrimonio, y etc. Pero estos son especiales para mí. Porque fueron la primera vez que hicimos algo nuevo. `
  ];

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-32 px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blush-50/60 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-rose-50 rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="font-sans text-xs uppercase tracking-widest text-gold-500 mb-4">Para ti</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold italic text-blush-900 mb-6">
            Querida Hedder:
          </h2>
          <div className="divider-line max-w-xs mx-auto" />
        </motion.div>

        {/* Letter card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="glass-card rounded-3xl p-8 sm:p-12 book-shadow relative overflow-hidden"
        >
          {/* Paper lines */}
          <div className="absolute inset-0 letter-paper opacity-40 pointer-events-none rounded-3xl" aria-hidden />

          {/* Opening quote mark */}
          <div className="relative z-10">
            <span className="quote-mark font-serif text-blush-200 text-7xl leading-none float-left mr-1 -mt-2" aria-hidden>
              &ldquo;
            </span>

            <div className="space-y-6">
              {paragraphs.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.4 + i * 0.15 }}
                  className="font-serif text-base sm:text-lg text-blush-800 leading-8 relative z-10"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Signature */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1.4 }}
              className="mt-10 flex flex-col items-end gap-1"
            >
              <div className="h-px w-24 bg-blush-200 mb-3" />
              <p className="font-script text-2xl text-blush-500">Te amo muchisimo</p>
              <p className="font-script text-3xl text-blush-700">Tu noviecito, Javier </p>
              <p className="font-sans text-xs text-blush-300 mt-1 tracking-wide">
                5 de Mayo, 2026
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Closing ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-12 text-center"
        >
          <blockquote className="relative pl-5 border-l-2 border-blush-300">
              <span className="font-script text-lg sm:text-xl text-blush-600 italic leading-relaxed">
                &ldquo;Te amo más ayer, y menos que mañana. - Rakan &rdquo;
              </span>
            </blockquote>
          <div className="flex justify-center gap-3 mt-4 text-2xl">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              🌸
            </motion.span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
            >
              💛
            </motion.span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
            >
              🌸
            </motion.span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
