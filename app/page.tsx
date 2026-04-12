import dynamic from "next/dynamic";
import Cover from "@/components/Cover";
import MomentSection from "@/components/MomentSection";
import FinalLetter from "@/components/FinalLetter";
import DevFooter from "@/components/DevFooter";

// Petals rendered client-side only (avoids SSR mismatch)
const FloatingPetals = dynamic(() => import("@/components/FloatingPetals"), { ssr: false });

// Ornamental separator between sections
function Ornament({ symbol = "✦" }: { symbol?: string }) {
  return (
    <div className="flex items-center justify-center gap-4 py-4 px-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-blush-200 max-w-xs" />
      <span className="text-blush-300 text-sm">{symbol}</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-blush-200 max-w-xs" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <FloatingPetals />

      {/* ──────────────────── COVER ──────────────────── */}
      <Cover />

      {/* Story intro */}
      <section className="py-10 px-6 text-center max-w-xl mx-auto">
        <p className="font-serif italic text-blush-600 text-lg sm:text-xl leading-relaxed">
          Cada recuerdo es un capitulo de nuestras vidas.<br />
          Nuestro primer capitulo oficial, fue bastante aesthetic.
        </p>
      </section>

      <Ornament symbol="🌸" />

      {/* ──────────────────── CAPÍTULO 1: CAFÉ HOLLEY ──────────────────── */}
      <MomentSection
        id="cafe-holley"
        chapterNumber={1}
        year="2023"
        title="Nuestro primer 'café'"
        location="Providencia, 2023"
        description="A pesar de que no fue una cita como la de los demás, este recuerdo tiene un lugar especial en mi corazón. El parque y el cerro, junto con el jardín japones me llenan de recuerdos sobre como tuvimos nuestro primer momento oficial nuestro."
        quote="Conozco un café aesthetic que te gustaría."
        photoCaptions={["Ese día", "Nosotros", "El reflejo de nosotros"]}
        accentColor="rose"
      />

      <Ornament />

      {/* ──────────────────── CAPÍTULO 2: PRIMER MATRIMONIO ──────────────────── */}
      <MomentSection
        id="primer-matrimonio"
        chapterNumber={2}
        year="2024"
        title="Nuestro Primer Matrimonio"
        location="Concon, 2024"
        description="Ver al Martín llorar por la situación tambien me llegó. Un dia cargado de emociones, de situaciones y de recuerdos. De como bailamos Dancing Queen como si fuera la última canción que fueramos a bailar."
        quote="Puedes besar a la novia."
        photoCaptions={["El outfit", "Nosotros", "Con nuestro estilo"]}
        reversed
        accentColor="gold"
      />

      <Ornament />

      {/* ──────────────────── CAPÍTULO 3: TORRES DEL PARQUE ──────────────────── */}
      <MomentSection
        id="torres-parque-cantalao"
        chapterNumber={3}
        year="2025"
        title="Torres del Parque Cantalao"
        location="Parque Cantalao, 2025"
        description="Deberiamos volver a hacer trekking, de hecho. Vivir esos momentos de adrenalina, en donde estabamos a un paso de algo potencialmente trágico, junto a ti. De cierta forma, estar contigo me hizo más fuerte, para lograr ver Santiago contigo."
        quote="Lo más lindo del lugar, a pesar de estar con un paisaje, siempre fuiste tú."
        photoCaptions={["Metido en una base militar", "Nosotros", "Mi paisaje favorito"]}
        accentColor="rose"
      />

      <Ornament />

      {/* ──────────────────── CAPÍTULO 4: CADA DÍA ──────────────────── */}
      <MomentSection
        id="cada-dia"
        chapterNumber={4}
        year="2023 — hoy"
        title="Cada Día Contigo"
        location="En cualquier lugar donde estés tú"
        description="A fin de cuentas, a pesar de nuestras peleas, cada dia contigo hace que mi vida sea especial. Me siento realmente afortunado de tenerte en mi vida. Te amo."
        quote="Cada día contigo hace mi vida más especial."
        photoCaptions={["Un día cualquiera", "Y otro más", "Y así, siempre"]}
        reversed
        accentColor="gold"
      />

      <Ornament symbol="💛" />

      {/* ──────────────────── CARTA FINAL ──────────────────── */}
      <FinalLetter />

    </main>
  );
}
