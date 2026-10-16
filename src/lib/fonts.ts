import { Archivo, IBM_Plex_Sans, IBM_Plex_Sans_Arabic, IBM_Plex_Sans_Hebrew, JetBrains_Mono } from "next/font/google";

// One type family across all three scripts. next/font self-hosts the files and
// generates size-adjusted fallbacks, so there is no layout shift or flash.
export const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex",
});

export const plexHebrew = IBM_Plex_Sans_Hebrew({
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex-hebrew",
  preload: false,
});

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex-arabic",
  preload: false,
});

export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains",
  preload: false,
});

// Cyber Command display face (Latin, variable width). Hebrew and Arabic display text uses IBM Plex.
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

export const fontVariables = [plex.variable, plexHebrew.variable, plexArabic.variable, jetbrains.variable, archivo.variable].join(" ");
