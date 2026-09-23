import { Alexandria, Cairo, Kufam, Manrope } from "next/font/google";

export const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});

export const kufam = Kufam({
  subsets: ["arabic"],
  weight: ["700", "800"],
  variable: "--font-kufam",
  display: "swap",
});

export const alexandria = Alexandria({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-alexandria",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const fontVariables = [
  cairo.variable,
  kufam.variable,
  alexandria.variable,
  manrope.variable,
].join(" ");
