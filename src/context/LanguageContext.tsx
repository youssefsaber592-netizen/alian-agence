"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/types";
import { translate, type TranslationKey } from "@/lib/i18n";

const STORAGE_KEY = "alian:lang";

type LanguageValue = {
  lang: Locale;
  dir: "rtl" | "ltr";
  isArabic: boolean;
  setLang: (lang: Locale) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
  pick: (en: string, ar: string) => string;
};

const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Arabic is the SSR default; a stored preference is applied after mount so
  // the server and client markup always match on first paint.
  const [lang, setLangState] = useState<Locale>("ar");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ar" || stored === "en") {
      setLangState(stored);
      return;
    }
    if (window.navigator.language?.toLowerCase().startsWith("en")) {
      setLangState("en");
    }
  }, []);

  const setLang = useCallback((next: Locale) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — keep in-memory only */
    }
  }, []);

  const toggleLang = useCallback(
    () => setLang(lang === "ar" ? "en" : "ar"),
    [lang, setLang],
  );

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const value = useMemo<LanguageValue>(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      isArabic: lang === "ar",
      setLang,
      toggleLang,
      t: (key: TranslationKey) => translate(key, lang),
      pick: (en: string, ar: string) => (lang === "ar" ? ar : en),
    }),
    [lang, setLang, toggleLang],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
