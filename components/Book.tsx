"use client";

import { useState, useMemo, useEffect, CSSProperties } from "react";

// ─── Types ────────────────────────────────────────────────────
interface Chapter {
  id: string;
  num: number;
  year: string;
  title: string;
  location: string;
  description: string;
  quote: string;
  captions: string[];
  photos: string[];
  accent: string;
}

type PageDef =
  | { kind: "cover" }
  | { kind: "dedication" }
  | { kind: "index" }
  | { kind: "opener"; ch: Chapter }
  | { kind: "photos"; ch: Chapter }
  | { kind: "text"; ch: Chapter }
  | { kind: "letter1" }
  | { kind: "letter2" }
  | { kind: "closing" }
  | { kind: "blank" }
  | { kind: "endpaper" };

interface LeafData {
  front: PageDef;
  back: PageDef;
}

type Phase =
  | "closed-front"
  | "opening"
  | "open"
  | "closing"
  | "closed-back"
  | "opening-back"
  | "closing-back";

type AnimState = { dir: "next" | "prev"; leaf: number } | null;

// ─── Constants ────────────────────────────────────────────────
const FLIP_MS = 1100;
const FLIP_EASE = "cubic-bezier(.36, .08, .22, 1)";

// ─── Data ─────────────────────────────────────────────────────
const CHAPTERS: Chapter[] = [
  {
    id: "cafe-holley",
    num: 1,
    year: "2023",
    title: "Nuestro primer 'café'",
    location: "Providencia, 2023",
    description:
      "A pesar de que no fue una cita como la de los demás, este recuerdo tiene un lugar especial en mi corazón. El parque y el cerro, junto con el jardín japonés me llenan de recuerdos sobre cómo tuvimos nuestro primer momento oficial nuestro. Mirando hacia atras, estabamos muy jovenes, inocentes y... Distintos. Algo que el paso del tiempo nos ha demostrado que, a pesar de todo lo que ocurren dentro de 3 años, podemos (y seguiremos!) estando juntos. Es curioso porque si ves las fotos, puedes ver incluso como se esta recuperandome el corte en la ceja.",
    quote: "Conozco un café aesthetic que te gustaría.",
    captions: ["Ese día", "Nosotros", "El reflejo de nosotros"],
    photos: [
      "/uploads/cafe-holley-1.jpg",
      "/uploads/cafe-holley-2.jpg",
      "/uploads/cafe-holley-3.jpg",
    ],
    accent: "#b5472a",
  },
  {
    id: "primer-matrimonio",
    num: 2,
    year: "2024",
    title: "Nuestro Primer Matrimonio",
    location: "Concón, 2024",
    description:
      "Ver al Martín llorar por la situación también me llegó. Un día cargado de emociones, de situaciones y de recuerdos. De cómo bailamos Dancing Queen como si fuera la última canción que fuéramos a bailar. De inolvidables momentos, fotos y chascarros que dejaron una marca (y espero que a ti tambien) muy agradable dentro de tu corazón, espero que podamos vivir un momento así de especial juntos, eventualmente, cuando logremos tener todo lo que alguna vez quisimos. Sin perdernos nunca en los jamáses de la vida.",
    quote: "Puedes besar a la novia.",
    captions: ["El outfit", "Nosotros", "Con nuestro estilo"],
    photos: [
      "/uploads/primer-matrimonio-1.jpg",
      "/uploads/primer-matrimonio-2.jpg",
      "/uploads/primer-matrimonio-3.jpg",
    ],
    accent: "#b8860b",
  },
  {
    id: "torres",
    num: 3,
    year: "2025",
    title: "Torres del Parque Cantalao",
    location: "Parque Cantalao, 2025",
    description:
      "Deberíamos volver a hacer trekking, de hecho. Vivir esos momentos de adrenalina, en donde estábamos a un paso de algo potencialmente trágico, junto a ti. De cierta forma, estar contigo me hizo más fuerte, para lograr ver Santiago contigo. Esas vistas hermosas de la ciudad entera, ignorando el smog. Fueron una gran recompensa final, aunque la recompensa nunca fueron las vistas, si no vivir esto junto a ti. Espero que de verdad, tengamos más aventuras juntos! Es lo que deseo que sea nuestra historia. Una aventura sin fin (y sin rumbo).",
    quote: "Lo más lindo del lugar, a pesar de estar con un paisaje, siempre fuiste tú.",
    captions: ["Metido en una base militar", "Nosotros", "Mi paisaje favorito"],
    photos: [
      "/uploads/torres-parque-cantalao-1.jpg",
      "/uploads/torres-parque-cantalao-2.jpg",
      "/uploads/torres-parque-cantalao-3.jpg",
    ],
    accent: "#5a7a3a",
  },
  {
    id: "cada-dia",
    num: 4,
    year: "2023 — hoy",
    title: "Cada Día Contigo",
    location: "En cualquier lugar donde estés tú",
    description:
      "A fin de cuentas, a pesar de nuestras peleas, cada día contigo hace que mi vida sea especial. Me siento realmente afortunado de tenerte en mi vida. Verte despertar en las mañanas, irte a buscar a la cama del lado porque no podiamos quedarnos dormidos juntos, pero despues cuando sale el sol, no poder despegarnos del otro. Es lo que me encanta de ti, de nosotros, y de mi vida cuando llegaste. Que nuestras vidas sigan así, un rumbo sin destino, el cual lo vivamos juntos, en el bien y en el mal, con todo lo bueno y lo malo. Porque a pesar de todo, te prefiero y te preferiré a ti siempre. Te amo.",
    quote: "Cada día contigo hace mi vida más especial.",
    captions: ["Un día cualquiera", "Y otro más", "Y así, siempre"],
    photos: [
      "/uploads/cada-dia-1.jpg",
      "/uploads/cada-dia-2.jpg",
      "/uploads/cada-dia-3.jpg",
    ],
    accent: "#8b1e2b",
  },
];

const LETTER = [
  "Hedder, amorcito, chiquibubu (aunque no te lo he dicho últimamente). Ya cumplimos 3 años y además de escribirte esta carta digital, quiero que sea un tributo y una conmemoración a la gran persona que fuiste, eres y serás.",
  "Han pasado muchas cosas en estos 3 años, cosas muy buenas, y cosas muy malas, hemos tomado distancia, hemos cometido errores. Pero hemos aprendido de ellos, y lo más importante, has decidido quedarte, a seguir intentándolo, una y otra vez. Y mira hasta donde hemos llegado, ¡3 años!",
  "Por todo esto, agradezco la persona que eres, tu forma de ser, tu alma. Son muy pocas personas las que han decidido, a pesar de que me equívoco (y muy probablemente lo seguiré haciendo), se han quedado. Y por esto, te lo agradeceré toda mi vida.",
  "No sé lo que viene. Nadie lo sabe. Pero sé esto con la certeza de muy pocas cosas en la vida: quiero seguir escribiendo mi... nuestra historia contigo. Quiero que cada próximo capítulo de la vida te encuentre floreciendo, y que yo tenga el privilegio de estar bien cerca para ver tanto cómo floreces como los frutos que das.",
  "Gracias por existir, por elegirme y en especial, por quedarte. Por cada versión de ti que he conocido y por todas las que faltan. Eres, en el sentido más profundo que conozco, mi persona, mi razón unica y mi alma favorita.",
  "PD: Sé que tenemos muchos más recuerdos, la playa (las dos veces), el último matrimonio, y etc. Pero estos son especiales para mí. Porque fueron los recuerdos más vividos que tengo contigo, y que nunca, con el paso de los años se me olvidarán.",
];

// ─── Days counter ─────────────────────────────────────────────
function useDaysTogether() {
  return useMemo(() => {
    const start = new Date("2023-05-05");
    const now = new Date();
    let y = now.getFullYear() - start.getFullYear();
    let m = now.getMonth() - start.getMonth();
    let d = now.getDate() - start.getDate();
    if (d < 0) {
      m--;
      d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (m < 0) {
      y--;
      m += 12;
    }
    const total = Math.floor((now.getTime() - start.getTime()) / 86400000);
    return { y, m, d, total };
  }, []);
}

// ─── Page layouts ─────────────────────────────────────────────
function CoverPage() {
  const { y, m, d, total } = useDaysTogether();
  return (
    <div
      style={{
        height: "100%",
        background:
          "linear-gradient(165deg, #8b5e3c 0%, #5a3a22 50%, #3d2414 100%)",
        color: "#f4ebd4",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 24,
          border: "1px double rgba(244,235,212,0.35)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 32,
          border: "1px solid rgba(244,235,212,0.18)",
          pointerEvents: "none",
        }}
      />
      {(["tl", "tr", "bl", "br"] as const).map((k) => {
        const isTop = k[0] === "t";
        const isLeft = k[1] === "l";
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              top: isTop ? 42 : undefined,
              bottom: !isTop ? 42 : undefined,
              left: isLeft ? 42 : undefined,
              right: !isLeft ? 42 : undefined,
              width: 22,
              height: 22,
              borderTop: isTop ? "1px solid #c9a97a" : "none",
              borderBottom: !isTop ? "1px solid #c9a97a" : "none",
              borderLeft: isLeft ? "1px solid #c9a97a" : "none",
              borderRight: !isLeft ? "1px solid #c9a97a" : "none",
              opacity: 0.6,
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px 40px",
        }}
      >
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: 5,
            color: "#c9a97a",
            textTransform: "uppercase",
          }}
        >
          Vol. III · MMXXVI
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 13,
              fontFamily: '"JetBrains Mono", monospace',
              letterSpacing: 6,
              color: "#c9a97a",
              marginBottom: 22,
            }}
          >
            EL LIBRO DE
          </div>
          <div
            style={{
              fontSize: 68,
              fontStyle: "italic",
              fontFamily: '"Cormorant Garamond", serif',
              lineHeight: 0.9,
              letterSpacing: -1,
            }}
          >
            Hedder
          </div>
          <div
            style={{
              width: 60,
              height: 1,
              background: "#c9a97a",
              margin: "22px auto",
            }}
          />
          <div
            style={{
              fontSize: 20,
              fontStyle: "italic",
              fontFamily: '"Cormorant Garamond", serif',
              color: "#e8d9bf",
              lineHeight: 1.3,
            }}
          >
            Una historia que comenzó
            <br />
            con un café y que no
            <br />
            ha dejado de escribirse.
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              gap: 22,
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            {[
              { v: y, l: "años" },
              { v: m, l: "meses" },
              { v: d, l: "días" },
            ].map((x, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 34,
                    fontFamily: '"Cormorant Garamond", serif',
                    fontStyle: "italic",
                    color: "#f4ebd4",
                    lineHeight: 1,
                  }}
                >
                  {x.v}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    fontFamily: '"JetBrains Mono", monospace',
                    letterSpacing: 3,
                    color: "#c9a97a",
                    marginTop: 4,
                    textTransform: "uppercase",
                  }}
                >
                  {x.l}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 10,
              fontFamily: '"JetBrains Mono", monospace',
              letterSpacing: 2,
              color: "#a88c64",
            }}
          >
            {total.toLocaleString("es-CL")} días juntos · y contando
          </div>
        </div>
      </div>
    </div>
  );
}

function DedicationPage() {
  return (
    <div
      style={{
        height: "100%",
        padding: "70px 50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "#3d2817",
      }}
    >
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 9,
          letterSpacing: 4,
          color: "#8a6d4a",
          marginBottom: 30,
        }}
      >
        — DEDICATORIA —
      </div>
      <div
        style={{
          fontSize: 22,
          fontStyle: "italic",
          fontFamily: '"Cormorant Garamond", serif',
          lineHeight: 1.45,
        }}
      >
        Para Hedder Alissa,
        <br />
        que decidió quedarse.
        <br />
        Y por quedarse,
        <br />
        lo cambió todo.
      </div>
      <div
        style={{
          width: 40,
          height: 1,
          background: "#8a6d4a",
          margin: "36px 0",
        }}
      />
      <div
        style={{
          fontSize: 14,
          fontFamily: '"Caveat", cursive',
          color: "#8b1e2b",
        }}
      >
        — J.
      </div>
    </div>
  );
}

function IndexPage() {
  return (
    <div
      style={{
        height: "100%",
        padding: "60px 48px",
        color: "#3d2817",
        position: "relative",
      }}
    >
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 9,
          letterSpacing: 4,
          color: "#8a6d4a",
          marginBottom: 8,
        }}
      >
        ÍNDICE
      </div>
      <div
        style={{
          fontSize: 32,
          fontStyle: "italic",
          fontFamily: '"Cormorant Garamond", serif',
          lineHeight: 1,
        }}
      >
        Nuestros capítulos
      </div>
      <div
        style={{ width: 30, height: 1, background: "#8a6d4a", margin: "20px 0 28px" }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {CHAPTERS.map((c) => (
          <div
            key={c.id}
            style={{ display: "flex", alignItems: "baseline", gap: 12 }}
          >
            <div
              style={{
                fontSize: 32,
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: "italic",
                color: c.accent,
                lineHeight: 1,
                minWidth: 28,
              }}
            >
              {(["I", "II", "III", "IV"] as const)[c.num - 1]}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 15,
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: "italic",
                  lineHeight: 1.15,
                }}
              >
                {c.title}
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontFamily: '"JetBrains Mono", monospace',
                  letterSpacing: 2,
                  color: "#8a6d4a",
                  marginTop: 2,
                }}
              >
                {c.location}
              </div>
            </div>
            <div
              style={{
                borderBottom: "1px dotted #8a6d4a",
                flex: 1,
                alignSelf: "flex-end",
                marginBottom: 4,
              }}
            />
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                color: "#8a6d4a",
              }}
            >
              {c.year.split(" ")[0]}
            </div>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            marginTop: 6,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: "italic",
              color: "#8a6d4a",
              minWidth: 28,
            }}
          >
            ♥
          </div>
          <div
            style={{
              flex: 1,
              fontSize: 15,
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: "italic",
            }}
          >
            Carta final
          </div>
          <div
            style={{
              borderBottom: "1px dotted #8a6d4a",
              flex: 1,
              alignSelf: "flex-end",
              marginBottom: 4,
            }}
          />
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: "#8a6d4a",
            }}
          >
            hoy
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 44,
          left: 48,
          right: 48,
          textAlign: "center",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 9,
          letterSpacing: 3,
          color: "#8a6d4a",
        }}
      >
        cuatro capítulos · una carta · tres años
      </div>
    </div>
  );
}

function ChapterOpener({ ch }: { ch: Chapter }) {
  const rom = (["I", "II", "III", "IV"] as const)[ch.num - 1];
  return (
    <div
      style={{
        height: "100%",
        position: "relative",
        color: "#3d2817",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 220,
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: "italic",
            color: ch.accent,
            opacity: 0.13,
            lineHeight: 0.8,
            letterSpacing: -6,
          }}
        >
          {rom}
        </div>
      </div>
      <div
        style={{
          position: "relative",
          height: "100%",
          padding: "60px 44px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9,
            letterSpacing: 5,
            color: ch.accent,
            textTransform: "uppercase",
          }}
        >
          Capítulo {rom}
        </div>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9,
            letterSpacing: 3,
            color: "#8a6d4a",
            marginTop: 4,
          }}
        >
          {ch.year}
        </div>
        <div
          style={{
            width: 40,
            height: 1,
            background: ch.accent,
            margin: "24px 0",
          }}
        />
        <div
          style={{
            fontSize: 34,
            fontStyle: "italic",
            fontFamily: '"Cormorant Garamond", serif',
            lineHeight: 1.05,
            color: "#2d1f14",
          }}
        >
          {ch.title}
        </div>
        <div
          style={{
            fontSize: 12,
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: 2,
            color: "#8a6d4a",
            marginTop: 14,
          }}
        >
          📍 {ch.location}
        </div>
      </div>
    </div>
  );
}

function ChapterPhotos({ ch }: { ch: Chapter }) {
  return (
    <div
      style={{
        height: "100%",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "relative",
      }}
    >
      <div
        style={{
          flex: 2,
          position: "relative",
          background: "#f4ebd4",
          overflow: "hidden",
          boxShadow: "0 3px 10px rgba(61,40,23,0.25)",
          border: "6px solid #fff",
        }}
      >
        <img
          src={ch.photos[0]}
          alt={ch.captions[0]}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 10,
            fontFamily: '"Caveat", cursive',
            fontSize: 18,
            color: "#fff",
            textShadow: "0 1px 4px rgba(0,0,0,0.6)",
          }}
        >
          {ch.captions[0]}
        </div>
      </div>
      <div style={{ flex: 3, display: "flex", gap: 14 }}>
        {([1, 2] as const).map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              position: "relative",
              background: "#f4ebd4",
              overflow: "hidden",
              boxShadow: "0 3px 10px rgba(61,40,23,0.25)",
              border: "6px solid #fff",
              transform: `rotate(${i === 1 ? -1 : 1}deg)`,
            }}
          >
            <img
              src={ch.photos[i]}
              alt={ch.captions[i]}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 6,
                left: 8,
                fontFamily: '"Caveat", cursive',
                fontSize: 15,
                color: "#fff",
                textShadow: "0 1px 3px rgba(0,0,0,0.7)",
              }}
            >
              {ch.captions[i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChapterText({ ch }: { ch: Chapter }) {
  return (
    <div
      style={{
        height: "100%",
        padding: "50px 44px",
        color: "#3d2817",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 9,
          letterSpacing: 4,
          color: ch.accent,
          textTransform: "uppercase",
        }}
      >
        — el recuerdo —
      </div>
      <div
        style={{
          fontSize: 14,
          fontFamily: '"Cormorant Garamond", serif',
          color: "#3d2817",
          lineHeight: 1.65,
          marginTop: 22,
          textAlign: "justify",
        }}
      >
        <span
          style={{
            float: "left",
            fontSize: 46,
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: "italic",
            color: ch.accent,
            lineHeight: 0.85,
            paddingRight: 6,
            paddingTop: 3,
          }}
        >
          {ch.description.charAt(0)}
        </span>
        {ch.description.slice(1)}
      </div>

      <div style={{ flex: 1 }} />

      <div
        style={{
          borderTop: `1px solid ${ch.accent}`,
          paddingTop: 18,
          marginTop: 24,
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: 3,
            color: "#8a6d4a",
          }}
        >
          LO QUE DIJIMOS
        </div>
        <div
          style={{
            fontSize: 22,
            fontStyle: "italic",
            fontFamily: '"Cormorant Garamond", serif',
            color: ch.accent,
            marginTop: 8,
            lineHeight: 1.2,
          }}
        >
          &ldquo;{ch.quote}&rdquo;
        </div>
      </div>
    </div>
  );
}

function LetterPage1() {
  return (
    <div
      style={{
        height: "100%",
        padding: "50px 44px",
        color: "#3d2817",
        position: "relative",
        background:
          "linear-gradient(0deg, transparent 0, transparent 31px, rgba(138,109,74,0.08) 31px, rgba(138,109,74,0.08) 32px)",
        backgroundSize: "100% 32px",
        backgroundPositionY: 50,
      }}
    >
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 9,
          letterSpacing: 4,
          color: "#8a6d4a",
        }}
      >
        — PARA TI —
      </div>
      <div
        style={{
          fontSize: 32,
          fontStyle: "italic",
          fontFamily: '"Cormorant Garamond", serif',
          marginTop: 8,
          lineHeight: 1,
        }}
      >
        Querida Hedder,
      </div>
      <div
        style={{
          width: 30,
          height: 1,
          background: "#8b1e2b",
          margin: "18px 0 20px",
        }}
      />
      <div
        style={{
          fontSize: 13,
          fontFamily: '"Cormorant Garamond", serif',
          color: "#3d2817",
          lineHeight: 1.75,
          textAlign: "justify",
        }}
      >
        <span
          style={{
            float: "left",
            fontSize: 54,
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: "italic",
            color: "#8b1e2b",
            lineHeight: 0.85,
            paddingRight: 6,
          }}
        >
          {LETTER[0].charAt(0)}
        </span>
        {LETTER[0].slice(1)}
        <p style={{ margin: "14px 0 0" }}>{LETTER[1]}</p>
        <p style={{ margin: "14px 0 0" }}>{LETTER[2]}</p>
      </div>
    </div>
  );
}

function LetterPage2() {
  return (
    <div
      style={{
        height: "100%",
        padding: "50px 44px",
        color: "#3d2817",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(0deg, transparent 0, transparent 31px, rgba(138,109,74,0.08) 31px, rgba(138,109,74,0.08) 32px)",
        backgroundSize: "100% 32px",
        backgroundPositionY: 50,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontFamily: '"Cormorant Garamond", serif',
          color: "#3d2817",
          lineHeight: 1.75,
          textAlign: "justify",
        }}
      >
        <p style={{ margin: 0 }}>{LETTER[3]}</p>
        <p style={{ margin: "14px 0 0" }}>{LETTER[4]}</p>
        <p
          style={{
            margin: "14px 0 0",
            fontSize: 12,
            color: "#6b5038",
            fontStyle: "italic",
          }}
        >
          {LETTER[5]}
        </p>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ textAlign: "right", marginTop: 28 }}>
        <div
          style={{
            width: 80,
            height: 1,
            background: "#8a6d4a",
            marginLeft: "auto",
            marginBottom: 8,
          }}
        />
        <div
          style={{
            fontSize: 22,
            fontFamily: '"Caveat", cursive',
            color: "#8b1e2b",
          }}
        >
          Te amo muchísimo,
        </div>
        <div
          style={{
            fontSize: 30,
            fontFamily: '"Homemade Apple", "Caveat", cursive',
            color: "#3d2817",
            lineHeight: 1.1,
            marginTop: 4,
          }}
        >
          Tu noviecito, Javier
        </div>
        <div
          style={{
            fontSize: 9,
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: 3,
            color: "#8a6d4a",
            marginTop: 10,
          }}
        >
          5 · MAYO · 2026
        </div>
      </div>
    </div>
  );
}

function ClosingPage() {
  return (
    <div
      style={{
        height: "100%",
        background: "linear-gradient(165deg, #5a3a22 0%, #2d1f14 100%)",
        color: "#f4ebd4",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 24,
          border: "1px double rgba(244,235,212,0.3)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: 6,
            color: "#c9a97a",
          }}
        >
          — FIN —
        </div>
        <div
          style={{
            fontSize: 90,
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: "italic",
            color: "#c9a97a",
            lineHeight: 1,
            margin: "30px 0 20px",
          }}
        >
          ∞
        </div>
        <div
          style={{
            fontSize: 26,
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: "italic",
            lineHeight: 1.2,
          }}
        >
          Y apenas
          <br />
          empezamos.
        </div>
        <div
          style={{ width: 40, height: 1, background: "#c9a97a", margin: "30px 0" }}
        />
        <div
          style={{
            fontSize: 13,
            fontStyle: "italic",
            fontFamily: '"Cormorant Garamond", serif',
            color: "#e8d9bf",
            lineHeight: 1.4,
            maxWidth: 260,
          }}
        >
          &ldquo;Te amo más que ayer,
          <br />
          y menos que mañana.&rdquo;
        </div>
        <div
          style={{
            fontSize: 9,
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: 2,
            color: "#a88c64",
            marginTop: 12,
          }}
        >
          — Rakan
        </div>
      </div>
    </div>
  );
}

// ─── Spread builder ───────────────────────────────────────────
type Spread = [PageDef, PageDef];

function buildSpreads(): Spread[] {
  const spreads: Spread[] = [
    [{ kind: "cover" }, { kind: "dedication" }],
    [{ kind: "index" }, { kind: "opener", ch: CHAPTERS[0] }],
  ];
  for (let i = 0; i < CHAPTERS.length; i++) {
    const ch = CHAPTERS[i];
    const next = CHAPTERS[i + 1];
    spreads.push([{ kind: "photos", ch }, { kind: "text", ch }]);
    if (next) spreads.push([{ kind: "blank" }, { kind: "opener", ch: next }]);
  }
  spreads.push([{ kind: "letter1" }, { kind: "letter2" }]);
  spreads.push([{ kind: "endpaper" }, { kind: "closing" }]);
  return spreads;
}

function renderPage(p: PageDef | null): JSX.Element | null {
  if (!p) return null;
  switch (p.kind) {
    case "cover":
      return <CoverPage />;
    case "dedication":
      return <DedicationPage />;
    case "index":
      return <IndexPage />;
    case "opener":
      return <ChapterOpener ch={p.ch} />;
    case "photos":
      return <ChapterPhotos ch={p.ch} />;
    case "text":
      return <ChapterText ch={p.ch} />;
    case "letter1":
      return <LetterPage1 />;
    case "letter2":
      return <LetterPage2 />;
    case "closing":
      return <ClosingPage />;
    case "blank":
      return <div style={{ height: "100%", background: "#f4ebd4" }} />;
    case "endpaper":
      return (
        <div
          style={{
            height: "100%",
            background:
              "repeating-linear-gradient(45deg, #e8d9bf 0 14px, #d4c09a 14px 15px)",
            position: "relative",
          }}
        >
          Y continuamos...
          <div
            style={{
              position: "absolute",
              inset: 40,
              border: "1px solid rgba(138,109,74,0.4)",
            }}
          />
        </div>
      );
    default:
      return null;
  }
}

// ─── Sub-components ───────────────────────────────────────────
function PageCurveShade({
  phase,
  dir,
}: {
  phase: "front" | "back";
  dir: "open" | "close" | "next" | "prev";
}) {
  const animName =
    phase === "front"
      ? dir === "open" || dir === "next"
        ? "curveFrontOpen"
        : "curveFrontClose"
      : dir === "open" || dir === "next"
      ? "curveBackOpen"
      : "curveBackClose";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background:
          phase === "front"
            ? "linear-gradient(90deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.32) 90%, rgba(0,0,0,0.5) 100%)"
            : "linear-gradient(270deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.32) 90%, rgba(0,0,0,0.5) 100%)",
        mixBlendMode: "multiply",
        animation: `${animName} ${FLIP_MS}ms ${FLIP_EASE} both`,
      }}
    />
  );
}

function PageStackEdge({
  side,
  thickness,
}: {
  side: "left" | "right";
  thickness: number;
}) {
  const n = Math.min(thickness, 6);
  if (n <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 3,
        bottom: 3,
        left: side === "left" ? -1 : undefined,
        right: side === "right" ? -1 : undefined,
        width: n * 1.3,
        background:
          "repeating-linear-gradient(90deg, #e8d9bf 0, #d4c09a 1px, #e8d9bf 2px)",
        boxShadow:
          side === "left"
            ? "inset 2px 0 3px rgba(61,40,23,0.3)"
            : "inset -2px 0 3px rgba(61,40,23,0.3)",
        zIndex: 0,
      }}
    />
  );
}

function PageCorner({ side }: { side: "l" | "r" }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: side === "l" ? 0 : undefined,
        right: side === "r" ? 0 : undefined,
        width: 24,
        height: 24,
        background:
          "linear-gradient(135deg, transparent 50%, rgba(138,109,74,0.18) 50%)",
        pointerEvents: "none",
      }}
    />
  );
}

function ClosedCover({
  side,
  pageW,
  pageH,
  bookW,
  page,
}: {
  side: "front" | "back";
  pageW: number;
  pageH: number;
  bookW: number;
  page: PageDef;
}) {
  const leftOffset = (bookW - pageW) / 2;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: leftOffset,
        width: pageW,
        height: pageH,
        animation: "coverSettle .55s ease-out",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          right: side === "front" ? -8 : undefined,
          left: side === "back" ? -8 : undefined,
          width: 10,
          background:
            "repeating-linear-gradient(90deg, #e8d9bf 0, #c9ad82 1.5px, #e8d9bf 2.5px)",
          boxShadow:
            side === "front"
              ? "inset -3px 0 4px rgba(61,40,23,0.4)"
              : "inset 3px 0 4px rgba(61,40,23,0.4)",
          borderRadius: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#f4ebd4",
          overflow: "hidden",
          boxShadow:
            "0 24px 55px rgba(0,0,0,0.55), 0 0 0 1px rgba(61,40,23,0.3)",
        }}
      >
        {renderPage(page)}
      </div>
    </div>
  );
}

function CoverLeaf({
  pageW,
  pageH,
  frontPage,
  backPage,
  dir,
}: {
  pageW: number;
  pageH: number;
  frontPage: PageDef;
  backPage: PageDef;
  dir: "open" | "close";
}) {
  const [rot, setRot] = useState(dir === "open" ? 0 : -180);
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setRot(dir === "open" ? -180 : 0))
    );
    return () => cancelAnimationFrame(id);
  }, [dir]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: pageW + 6,
        width: pageW,
        height: pageH,
        transformStyle: "preserve-3d",
        transformOrigin: "left center",
        transform: `rotateY(${rot}deg)`,
        transition: `transform ${FLIP_MS}ms ${FLIP_EASE}`,
        zIndex: 800,
        willChange: "transform",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#f4ebd4",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          overflow: "hidden",
          boxShadow: "inset 14px 0 22px -14px rgba(61,40,23,0.45)",
        }}
      >
        {renderPage(frontPage)}
        <PageCurveShade phase="front" dir={dir} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#f4ebd4",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          overflow: "hidden",
          transform: "rotateY(180deg)",
          boxShadow: "inset -14px 0 22px -14px rgba(61,40,23,0.45)",
        }}
      >
        {renderPage(backPage)}
        <PageCurveShade phase="back" dir={dir} />
      </div>
    </div>
  );
}

function BackCoverLeaf({
  pageW,
  pageH,
  frontPage,
  backPage,
  dir,
}: {
  pageW: number;
  pageH: number;
  frontPage: PageDef;
  backPage: PageDef;
  dir: "open" | "close";
}) {
  const [rot, setRot] = useState(dir === "close" ? 0 : -180);
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setRot(dir === "close" ? -180 : 0))
    );
    return () => cancelAnimationFrame(id);
  }, [dir]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: pageW + 6,
        width: pageW,
        height: pageH,
        transformStyle: "preserve-3d",
        transformOrigin: "left center",
        transform: `rotateY(${rot}deg)`,
        transition: `transform ${FLIP_MS}ms ${FLIP_EASE}`,
        zIndex: 800,
        willChange: "transform",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#f4ebd4",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          overflow: "hidden",
          boxShadow: "inset 14px 0 22px -14px rgba(61,40,23,0.45)",
        }}
      >
        {renderPage(frontPage)}
        <PageCurveShade phase="front" dir={dir} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#f4ebd4",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          overflow: "hidden",
          transform: "rotateY(180deg)",
          boxShadow: "inset -14px 0 22px -14px rgba(61,40,23,0.45)",
        }}
      >
        {renderPage(backPage)}
        <PageCurveShade phase="back" dir={dir} />
      </div>
    </div>
  );
}

function Leaf({
  leaf,
  rot,
  zIndex,
  turning,
  pageW,
  pageH,
  dir,
}: {
  leaf: LeafData;
  rot: number;
  zIndex: number;
  turning: boolean;
  pageW: number;
  pageH: number;
  dir: "next" | "prev" | null;
}) {
  const [live, setLive] = useState(rot);

  useEffect(() => {
    if (turning && dir) {
      const start = dir === "next" ? 0 : -180;
      setLive(start);
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setLive(rot))
      );
      return () => cancelAnimationFrame(id);
    } else {
      setLive(rot);
    }
  }, [turning, dir, rot]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        width: pageW,
        height: pageH,
        transformStyle: "preserve-3d",
        transformOrigin: "left center",
        transform: `rotateY(${live}deg)`,
        transition: turning ? `transform ${FLIP_MS}ms ${FLIP_EASE}` : "none",
        zIndex,
        willChange: turning ? "transform" : "auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#f4ebd4",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          overflow: "hidden",
          boxShadow:
            "inset 14px 0 22px -14px rgba(61,40,23,0.45), 0 0 1px rgba(0,0,0,0.2)",
        }}
      >
        {renderPage(leaf.front)}
        <PageCorner side="r" />
        {turning && (
          <PageCurveShade
            phase="front"
            dir={dir === "next" ? "open" : "close"}
          />
        )}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#f4ebd4",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          overflow: "hidden",
          transform: "rotateY(180deg)",
          boxShadow: "inset -14px 0 22px -14px rgba(61,40,23,0.45)",
        }}
      >
        {renderPage(leaf.back)}
        <PageCorner side="l" />
        {turning && (
          <PageCurveShade
            phase="back"
            dir={dir === "next" ? "open" : "close"}
          />
        )}
      </div>
    </div>
  );
}

// ─── Nav styles ───────────────────────────────────────────────
const navBtn: CSSProperties = {
  background: "rgba(201,169,122,0.12)",
  border: "1px solid #c9a97a",
  color: "#e8d9bf",
  width: 42,
  height: 42,
  cursor: "pointer",
  fontSize: 20,
  fontFamily: "serif",
  transition: "background .15s",
};

const pageNum: CSSProperties = {
  color: "#c9a97a",
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 11,
  letterSpacing: 3,
  fontVariantNumeric: "tabular-nums",
  minWidth: 90,
  textAlign: "center",
};

// ─── Mobile book ──────────────────────────────────────────────
function BookMobile({ spreads }: { spreads: Spread[] }) {
  const flat = useMemo(
    () =>
      spreads
        .flat()
        .filter((p) => p.kind !== "blank" && p.kind !== "endpaper"),
    [spreads]
  );
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(false);

  const change = (d: number) => {
    const n = Math.max(0, Math.min(flat.length - 1, idx + d));
    if (n === idx) return;
    setFade(true);
    setTimeout(() => {
      setIdx(n);
      setFade(false);
    }, 200);
  };

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") change(1);
      if (e.key === "ArrowLeft") change(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [idx]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          aspectRatio: "1 / 1.45",
          position: "relative",
          background: "#f4ebd4",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.4), inset 0 0 0 1px #a88c64",
          overflow: "hidden",
          opacity: fade ? 0 : 1,
          transition: "opacity .2s",
        }}
      >
        {renderPage(flat[idx])}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <button onClick={() => change(-1)} disabled={idx === 0} style={navBtn}>
          ‹
        </button>
        <div style={pageNum}>
          {String(idx + 1).padStart(2, "0")}{" "}
          <span style={{ opacity: 0.4 }}>/</span>{" "}
          {String(flat.length).padStart(2, "0")}
        </div>
        <button
          onClick={() => change(1)}
          disabled={idx === flat.length - 1}
          style={navBtn}
        >
          ›
        </button>
      </div>
    </div>
  );
}

// ─── Desktop book ─────────────────────────────────────────────
function BookDesktop({ spreads }: { spreads: Spread[] }) {
  const leaves = useMemo<LeafData[]>(() => {
    const pages = spreads.flat();
    const inner = pages.slice(1, -1);
    const out: LeafData[] = [];
    for (let i = 0; i < inner.length; i += 2) {
      out.push({ front: inner[i], back: inner[i + 1] ?? { kind: "blank" } });
    }
    return out;
  }, [spreads]);

  const [phase, setPhase] = useState<Phase>("closed-front");
  const [turned, setTurned] = useState(0);
  const [anim, setAnim] = useState<AnimState>(null);
  const total = leaves.length;

  const go = (d: number) => {
    if (anim || phase === "opening" || phase === "closing") return;

    if (phase === "closed-front") {
      if (d > 0) {
        setPhase("opening");
        setTimeout(() => {
          setPhase("open");
          setTurned(0);
        }, FLIP_MS);
      }
      return;
    }
    if (phase === "closed-back") {
      if (d < 0) {
        setPhase("opening-back");
        setTimeout(() => {
          setPhase("open");
          setTurned(total);
        }, FLIP_MS);
      }
      return;
    }

    const next = turned + d;
    if (next > total) {
      setPhase("closing");
      setTimeout(() => setPhase("closed-back"), FLIP_MS);
      return;
    }
    if (next < 0) {
      setPhase("closing-back");
      setTimeout(() => setPhase("closed-front"), FLIP_MS);
      return;
    }

    const leafIdx = d > 0 ? turned : turned - 1;
    setAnim({ dir: d > 0 ? "next" : "prev", leaf: leafIdx });
    setTimeout(() => {
      setTurned(next);
      setAnim(null);
    }, FLIP_MS);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turned, anim, phase]);

  const PAGE_W = 440;
  const PAGE_H = 620;
  const isClosed = phase === "closed-front" || phase === "closed-back";
  const isOpening = phase === "opening" || phase === "opening-back";
  const isClosingPhase = phase === "closing" || phase === "closing-back";
  const openW = PAGE_W * 2 + 6;

  const coverPage = spreads[0][0];
  const backPage = spreads[spreads.length - 1][1];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}
    >
      <div
        style={{
          width: openW,
          height: PAGE_H,
          position: "relative",
          perspective: 2800,
          perspectiveOrigin: "50% 40%",
          transition: `filter ${FLIP_MS}ms ${FLIP_EASE}`,
          filter: "drop-shadow(0 22px 50px rgba(0,0,0,0.55))",
        }}
      >
        {phase === "closed-front" && (
          <ClosedCover
            side="front"
            pageW={PAGE_W}
            pageH={PAGE_H}
            bookW={openW}
            page={coverPage}
          />
        )}

        {phase === "closed-back" && (
          <ClosedCover
            side="back"
            pageW={PAGE_W}
            pageH={PAGE_H}
            bookW={openW}
            page={backPage}
          />
        )}

        {!isClosed && (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                opacity: isOpening ? 0 : 1,
                transition: `opacity ${FLIP_MS * 0.4}ms ease-out ${FLIP_MS * 0.15}ms`,
              }}
            >
              <div
                style={{
                  flex: 1,
                  background: "#e8d9bf",
                  boxShadow: "inset -8px 0 16px -8px rgba(61,40,23,0.4)",
                }}
              />
              <div
                style={{
                  width: 6,
                  background:
                    "linear-gradient(90deg, #1a0e05, #3d2817, #1a0e05)",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  flex: 1,
                  background: "#e8d9bf",
                  boxShadow: "inset 8px 0 16px -8px rgba(61,40,23,0.4)",
                }}
              />
            </div>

            <PageStackEdge side="left" thickness={turned} />
            <PageStackEdge side="right" thickness={total - turned} />

            {phase === "open" &&
              leaves.map((leaf, i) => {
                const isTurning = anim !== null && anim.leaf === i;
                let rot = 0;
                let z = 0;
                if (isTurning) {
                  rot = anim!.dir === "next" ? -180 : 0;
                  z = 500;
                } else if (i < turned) {
                  rot = -180;
                  z = 100 + i;
                } else {
                  z = 100 + (total - i);
                }
                return (
                  <Leaf
                    key={i}
                    leaf={leaf}
                    rot={rot}
                    zIndex={z}
                    turning={isTurning}
                    pageW={PAGE_W}
                    pageH={PAGE_H}
                    dir={isTurning ? anim!.dir : null}
                  />
                );
              })}

            {(phase === "opening" || phase === "closing-back") && (
              <CoverLeaf
                pageW={PAGE_W}
                pageH={PAGE_H}
                frontPage={coverPage}
                backPage={spreads[0][1]}
                dir={phase === "opening" ? "open" : "close"}
              />
            )}

            {(phase === "opening-back" || phase === "closing") && (
              <BackCoverLeaf
                pageW={PAGE_W}
                pageH={PAGE_H}
                frontPage={spreads[spreads.length - 1][0]}
                backPage={backPage}
                dir={phase === "opening-back" ? "open" : "close"}
              />
            )}

            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "50%",
                width: 14,
                transform: "translateX(-50%)",
                background:
                  "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 1000,
                opacity: isOpening ? 0 : 1,
                transition: `opacity ${FLIP_MS * 0.5}ms ease-out ${FLIP_MS * 0.2}ms`,
              }}
            />
          </>
        )}

        <button
          onClick={() => go(-1)}
          disabled={
            phase === "closed-front" ||
            anim !== null ||
            isOpening ||
            isClosingPhase
          }
          style={{
            position: "absolute",
            top: 0,
            left: -60,
            width: 54,
            height: "100%",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#c9a97a",
            fontSize: 32,
            fontFamily: "serif",
            opacity: phase === "closed-front" ? 0.15 : 0.7,
            zIndex: 2000,
          }}
        >
          ‹
        </button>
        <button
          onClick={() => go(1)}
          disabled={
            phase === "closed-back" ||
            anim !== null ||
            isOpening ||
            isClosingPhase
          }
          style={{
            position: "absolute",
            top: 0,
            right: -60,
            width: 54,
            height: "100%",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#c9a97a",
            fontSize: 32,
            fontFamily: "serif",
            opacity: phase === "closed-back" ? 0.15 : 0.7,
            zIndex: 2000,
          }}
        >
          ›
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <button
          onClick={() => go(-1)}
          disabled={
            phase === "closed-front" ||
            anim !== null ||
            isOpening ||
            isClosingPhase
          }
          style={navBtn}
        >
          ‹
        </button>
        <div style={pageNum}>
          {phase === "closed-front"
            ? "— cerrado —"
            : phase === "closed-back"
            ? "— fin —"
            : `${String(Math.min(turned * 2 + 1, total * 2)).padStart(2, "0")} / ${String(total * 2).padStart(2, "0")}`}
        </div>
        <button
          onClick={() => go(1)}
          disabled={
            phase === "closed-back" ||
            anim !== null ||
            isOpening ||
            isClosingPhase
          }
          style={navBtn}
        >
          ›
        </button>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────
export default function Book() {
  const spreads = useMemo(() => buildSpreads(), []);
  return (
    <>
      <div className="desktop-only">
        <BookDesktop spreads={spreads} />
      </div>
      <div className="mobile-only">
        <BookMobile spreads={spreads} />
      </div>
    </>
  );
}
