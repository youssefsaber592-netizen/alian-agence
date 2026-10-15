"use client";

import { memo, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { seedCategories } from "@/lib/seed-data";
import type { ProductDTO } from "@/lib/types";
import { Stars } from "./ui/primitives";

function categoryLabel(slug: string, lang: "en" | "ar") {
  const match = seedCategories.find((category) => category.slug === slug);
  if (match) return lang === "ar" ? match.nameAr : match.nameEn;
  return slug.replace(/-/g, " ");
}

const WISHLIST_KEY = "alian:wishlist";

function readWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed.filter((v) => typeof v === "string") as string[]) : [];
  } catch {
    return [];
  }
}

function ProductCardComponent({
  product,
  index = 0,
  priority = false,
  className,
}: {
  product: ProductDTO;
  index?: number;
  priority?: boolean;
  className?: string;
}) {
  const { t, lang, isArabic, pick } = useLanguage();
  const [wished, setWished] = useState(() =>
    readWishlist().includes(product.slug),
  );
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const id = window.setTimeout(() => setJustAdded(false), 1600);
    return () => window.clearTimeout(id);
  }, [justAdded]);

  const toggleWishlist = useCallback(() => {
    setWished((current) => {
      const next = current
        ? readWishlist().filter((slug) => slug !== product.slug)
        : [...readWishlist(), product.slug];
      try {
        window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return !current;
    });
  }, [product.slug]);

  const name = pick(product.nameEn, product.nameAr);
  const badge = pick(product.badgeEn ?? "", product.badgeAr ?? "");
  const off = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= 10;

  const handleBuy = () => {
    if (product.amazonUrl) {
      window.open(product.amazonUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group card-hover-lift relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white hover:-translate-y-1.5 hover:border-sky-200 hover:shadow-[0_28px_60px_-24px_rgb(2_32_71/0.28)]",
        soldOut && "opacity-80",
        className,
      )}
    >
      {/* media */}
      <div className="relative aspect-4/5 overflow-hidden bg-slate-100">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.09]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
        </Link>

        {/* badges */}
        <div className="pointer-events-none absolute start-4 top-4 flex flex-col items-start gap-2">
          {badge ? (
            <span className="rounded-full bg-slate-950/85 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              {badge}
            </span>
          ) : null}
          {off > 0 ? (
            <span className="rounded-full bg-rose-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white shadow-lg shadow-rose-500/30">
              -{off}%
            </span>
          ) : null}
        </div>

        {/* wishlist */}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={t("product.wishlist")}
          aria-pressed={wished}
          className={cn(
            "absolute end-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-110",
            wished
              ? "border-rose-200 bg-rose-500 text-white"
              : "border-white/40 bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500",
          )}
        >
          <Heart className={cn("h-4 w-4", wished && "fill-current")} />
        </button>

        {/* buy now — Amazon */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-3 opacity-0 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100 max-md:translate-y-0 max-md:opacity-100">
          <a
            href={product.amazonUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-extrabold shadow-xl transition-all duration-300 hover:-translate-y-0.5",
              soldOut ? "pointer-events-none bg-slate-200 text-slate-500" : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/25",
            )}
          >
            {soldOut ? (
              t("product.outOfStock")
            ) : (
              <>
                <span>Amazon</span>
                <span className="text-xs">↗</span>
              </>
            )}
          </a>
        </div>

        {soldOut ? (
          <div className="absolute inset-0 grid place-items-center bg-slate-950/45">
            <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-extrabold text-slate-900">
              {t("product.outOfStock")}
            </span>
          </div>
        ) : null}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-[10px] font-extrabold uppercase tracking-[0.18em] text-sky-600">
            {categoryLabel(product.categorySlug, lang)}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
            <span className="font-medium text-slate-300">
              ({product.reviewsCount})
            </span>
          </span>
        </div>

        <h3 className="mt-2.5 text-[15px] font-extrabold leading-6 text-slate-950">
          <Link
            href={`/products/${product.slug}`}
            className="transition-colors hover:text-sky-700"
          >
            {name}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-500">
          {pick(product.descriptionEn, product.descriptionAr)}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-extrabold tracking-tight text-slate-950">
              {formatPrice(product.price, lang)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-xs font-semibold text-slate-400 line-through">
                {formatPrice(product.compareAtPrice, lang)}
              </span>
            ) : null}
          </div>

          {lowStock ? (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold text-amber-600">
              {t("product.lowStock")}
            </span>
          ) : (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-600">
              {t("product.inStock")}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Stars rating={product.rating} />
          <span className="text-[11px] font-medium text-slate-400">
            {product.reviewsCount} {t("product.reviews")}
          </span>
        </div>
      </div>

      <span className="sr-only">
        {isArabic ? "تفاصيل المنتج" : "View product details"}
      </span>
    </motion.article>
  );
}

export const ProductCard = memo(ProductCardComponent);
