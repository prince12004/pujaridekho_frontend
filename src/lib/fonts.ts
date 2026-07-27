import { Cinzel, Inter, Noto_Sans_Devanagari, Poppins } from "next/font/google";

/**
 * Font role assignment for the PujariDekho design system:
 * - Cinzel   -> large display headings (temple-inscription feel)
 * - Poppins  -> UI-bold accents: nav, buttons, stat numbers, eyebrows
 * - Inter    -> body copy, paragraphs, form fields
 * - Noto Sans Devanagari -> Hindi headings/labels (e.g. "पूजा हो तो")
 */

export const fontCinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

export const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const fontInter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const fontDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-devanagari",
  display: "swap",
});

export const fontVariables = [
  fontCinzel.variable,
  fontPoppins.variable,
  fontInter.variable,
  fontDevanagari.variable,
].join(" ");
