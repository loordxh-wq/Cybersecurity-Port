import { Archivo } from "next/font/google";

// Editorial display face for Concept B only (Latin). Hebrew and Arabic fall back to IBM Plex.
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});
