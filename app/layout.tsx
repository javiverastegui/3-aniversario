import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  JetBrains_Mono,
  Caveat,
  Homemade_Apple,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "500", "700"],
  display: "swap",
});

const homemadeApple = Homemade_Apple({
  subsets: ["latin"],
  variable: "--font-homemade",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "El Libro de Nosotros · Hedder & Javier",
  description: "Una historia de amor escrita en cada momento que hemos compartido.",
  openGraph: {
    title: "El Libro de Nosotros · Hedder & Javier",
    description: "Una historia de amor escrita en cada momento que hemos compartido.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${jetbrains.variable} ${caveat.variable} ${homemadeApple.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
