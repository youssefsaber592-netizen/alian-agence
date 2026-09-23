"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CornerDownLeft, Search, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/utils";
import type { ProductDTO } from "@/lib/types";

const RECENT_KEY = "alian:recent";
const QUICK = ["holders", "bathroom", "kitchen", "decor", "tissue-boxes"];

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t, lang, pick } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RECENT_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setRecent(Array.isArray(parsed) ? parsed.slice(0, 5) : []);
    } catch {
      setRecent([]);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setCursor(0);
      const id = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    const id = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products?q=${encodeURIComponent(query.trim())}&limit=8`,
          { signal: controller.signal },
        );
        const data = (await res.json()) as { products?: ProductDTO[] };
        setResults(data.products ?? []);
        setCursor(0);
      } catch {
        /* aborted or offline */
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(id);
    };
  }, [query, open]);

  const remember = (term: string) => {
    const value = term.trim();
    if (value.length < 2) return;
    const next = [value, ...recent.filter((item) => item !== value)].slice(0, 5);
    setRecent(next);
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const showResults = query.trim().length >= 2;

  const chips = useMemo(
    () =>
      recent.length > 0
        ? recent
        : lang === "ar"
          ? ["منظم", "طقم حمام", "مزهرية"]
          : ["organizer", "bath set", "vase"],
    [recent, lang],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    }
    if (event.key === "Enter" && results[cursor]) {
      remember(query);
      window.location.href = `/products/${results[cursor].slug}`;
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-24 sm:pt-32"
        >
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_40px_120px_-30px_rgb(2_32_71/0.55)]"
          >
            {/* input */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <Search className="h-5 w-5 shrink-0 text-sky-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("search.placeholder")}
                className="w-full bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label={t("search.close")}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[58vh] overflow-y-auto p-3">
              {!showResults ? (
                <div className="p-3">
                  <p className="px-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                    {recent.length > 0
                      ? lang === "ar"
                        ? "بحث سابق"
                        : "Recent"
                      : lang === "ar"
                        ? "مقترحات"
                        : "Suggestions"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {chips.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setQuery(chip)}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  <p className="mt-6 px-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                    {t("nav.categories")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {QUICK.map((slug) => (
                      <Link
                        key={slug}
                        href={`/category/${slug}`}
                        onClick={onClose}
                        className="rounded-full bg-slate-950 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-sky-600"
                      >
                        {slug.replace(/-/g, " ")}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : loading ? (
                <div className="space-y-2 p-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="skeleton-shimmer h-16 rounded-2xl"
                    />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm font-semibold text-slate-500">
                  {t("search.empty")}
                </p>
              ) : (
                <ul className="space-y-1">
                  {results.map((product, index) => (
                    <li key={product.slug}>
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={() => {
                          remember(query);
                          onClose();
                        }}
                        onMouseEnter={() => setCursor(index)}
                        className={cnRow(index === cursor)}
                      >
                        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          <Image
                            src={product.image}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-extrabold text-slate-900">
                            {pick(product.nameEn, product.nameAr)}
                          </span>
                          <span className="block truncate text-xs font-medium text-slate-400">
                            {product.categorySlug.replace(/-/g, " ")}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-extrabold text-sky-700">
                          {formatPrice(product.price, lang)}
                        </span>
                        {index === cursor ? (
                          <CornerDownLeft className="h-4 w-4 shrink-0 text-slate-300" />
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3 text-[11px] font-bold text-slate-400">
              <span>{t("search.hint")}</span>
              <span className="hidden sm:inline">
                {results.length} {t("search.results")}
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function cnRow(active: boolean) {
  return [
    "flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors",
    active ? "bg-sky-50 ring-1 ring-sky-200" : "hover:bg-slate-50",
  ].join(" ");
}
