"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  ListFilter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn, formatPrice } from "@/lib/utils";
import type { CategoryDTO, ProductDTO } from "@/lib/types";
import { ProductCard } from "../ProductCard";

const SORTS = ["featured", "priceAsc", "priceDesc", "rating", "newest"] as const;

export function ShopView({
  products,
  categories,
  counts,
  activeCategory,
  activeSort,
  query,
}: {
  products: ProductDTO[];
  categories: CategoryDTO[];
  counts: Record<string, number>;
  activeCategory: string;
  activeSort: string;
  query: string;
}) {
  const { t, lang, isArabic, pick } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  const [term, setTerm] = useState(query);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => setTerm(query), [query]);

  /* push filter changes into the URL so the server can re-query */
  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    });
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const id = window.setTimeout(() => {
      const current = searchParams.get("q") ?? "";
      if (term.trim() === current) return;
      update({ q: term.trim() || null });
    }, 350);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const total = products.length;
  const cheapest = products.length
    ? Math.min(...products.map((product) => product.price))
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-24">
      {/* heading */}
      <div className="pt-10">
        <nav className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
          <Link href="/" className="transition-colors hover:text-sky-600">
            {t("nav.home")}
          </Link>
          <span>/</span>
          <span className="text-slate-900">{t("nav.products")}</span>
        </nav>

        <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-[40px] sm:leading-[1.12]">
              {t("shop.title")}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
              {t("shop.subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600">
              {total} {t("shop.results")}
            </span>
            {total > 0 ? (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-extrabold text-emerald-700">
                {pick("From", "يبدأ من")} {formatPrice(cheapest, lang)}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* toolbar */}
      <div className="sticky top-[76px] z-30 mt-8 -mx-2 px-2 py-3">
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/85 p-3 shadow-[0_18px_50px_-30px_rgb(2_32_71/0.35)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          {/* category pills */}
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            <button
              type="button"
              onClick={() => update({ category: null })}
              className={cn(
                "shrink-0 rounded-full px-4 py-2.5 text-xs font-extrabold transition-all duration-300",
                !activeCategory || activeCategory === "all"
                  ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700",
              )}
            >
              {t("shop.all")}
            </button>

            {categories.map((category) => {
              const active = activeCategory === category.slug;
              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() =>
                    update({ category: active ? null : category.slug })
                  }
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-extrabold transition-all duration-300",
                    active
                      ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700",
                  )}
                >
                  {pick(category.nameEn, category.nameAr)}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                      active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {counts[category.slug] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {/* search */}
            <div className="relative flex-1 lg:w-64">
              <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pe-9 ps-10 text-xs font-bold text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400"
              />
              {term ? (
                <button
                  type="button"
                  onClick={() => setTerm("")}
                  aria-label={t("shop.clear")}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-900"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>

            {/* sort */}
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute start-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <select
                value={activeSort}
                onChange={(event) =>
                  update({ sort: event.target.value === "featured" ? null : event.target.value })
                }
                aria-label={t("shop.sort")}
                className="appearance-none rounded-full border border-slate-200 bg-white py-2.5 pe-8 ps-9 text-xs font-extrabold text-slate-700 outline-none transition-colors focus:border-sky-400"
              >
                {SORTS.map((sort) => (
                  <option key={sort} value={sort}>
                    {t(`shop.sort.${sort}` as never)}
                  </option>
                ))}
              </select>
            </div>

            {/* view toggle */}
            <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white p-1 sm:flex">
              {[
                { mode: "grid", icon: LayoutGrid },
                { mode: "list", icon: ListFilter },
              ].map((option) => (
                <button
                  key={option.mode}
                  type="button"
                  onClick={() => setView(option.mode as "grid" | "list")}
                  aria-label={option.mode}
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full transition-colors",
                    view === option.mode
                      ? "bg-slate-950 text-white"
                      : "text-slate-400 hover:text-slate-900",
                  )}
                >
                  <option.icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* results */}
      {total === 0 ? (
        <div className="mt-10 rounded-[28px] border border-dashed border-slate-200 bg-white px-6 py-20 text-center">
          <Search className="mx-auto h-9 w-9 text-slate-300" />
          <h3 className="mt-4 text-lg font-extrabold text-slate-900">
            {t("shop.empty")}
          </h3>
          <p className="mt-2 text-sm text-slate-500">{t("shop.emptyHint")}</p>
          <button
            type="button"
            onClick={() => {
              setTerm("");
              router.push(pathname);
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-extrabold text-white"
          >
            {t("shop.clear")}
            <Arrow className="h-4 w-4" />
          </button>
        </div>
      ) : view === "grid" ? (
        <motion.div
          key={`${activeCategory}-${activeSort}`}
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6"
        >
          {products.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              index={index}
              priority={index < 4}
            />
          ))}
        </motion.div>
      ) : (
        <div className="mt-8 divide-y divide-slate-100 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50 sm:p-5"
            >
              <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold text-slate-950">
                  {pick(product.nameEn, product.nameAr)}
                </span>
                <span className="mt-1 line-clamp-1 block text-xs text-slate-500">
                  {pick(product.descriptionEn, product.descriptionAr)}
                </span>
              </span>
              <span className="shrink-0 text-sm font-extrabold text-slate-950">
                {formatPrice(product.price, lang)}
              </span>
              <Arrow className="h-4 w-4 shrink-0 text-slate-300" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
