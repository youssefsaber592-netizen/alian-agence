import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CURRENCY = { en: "EGP", ar: "ج.م" } as const;

export function formatPrice(value: number, lang: Locale = "en") {
  const amount = Number.isInteger(value)
    ? String(value)
    : value.toFixed(2).replace(/\.00$/, "");

  return lang === "ar" ? `${amount} ${CURRENCY.ar}` : `${CURRENCY.en} ${amount}`;
}

export function discountPercent(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
