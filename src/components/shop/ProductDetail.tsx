"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import type { CategoryDTO, ProductDTO } from "@/lib/types";
import { ProductCard } from "../ProductCard";
import { Reveal, Stars } from "../ui/primitives";

const WISHLIST_KEY = "alian:wishlist";

export function ProductDetailView({
  product,
  category,
  related,
}: {
  product: ProductDTO;
  category: CategoryDTO | null;
  related: ProductDTO[];
}) {
  const { t, lang, isArabic, pick } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;
  const [quantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [wished, setWished] = useState(false);

  const name = pick(product.nameEn, product.nameAr);
  const off = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock <= 0;

  const gallery = useMemo(() => {
    const list = [product.image, ...(product.gallery ?? [])].filter(Boolean);
    if (category && !list.includes(category.image)) list.push(category.image);
    return Array.from(new Set(list));
  }, [product.image, product.gallery, category]);

  const toggleWishlist = () => {
    setWished((current) => {
      try {
        const raw = window.localStorage.getItem(WISHLIST_KEY);
        const list: string[] = raw ? JSON.parse(raw) : [];
        const next = current
          ? list.filter((slug) => slug !== product.slug)
          : Array.from(new Set([...list, product.slug]));
        window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return !current;
    });
  };



  const assurances = [
    { icon: Truck, label: pick("24h dispatch", "تجهيز خلال ٢٤ ساعة") },
    { icon: RotateCcw, label: pick("7-day returns", "إرجاع خلال ٧ أيام") },
    { icon: ShieldCheck, label: pick("Secure payment", "دفع آمن") },
  ];

  const tabs = [
    {
      title: pick("Description", "الوصف"),
      body: pick(product.descriptionEn, product.descriptionAr),
    },
    {
      title: pick("Details", "التفاصيل"),
      body: pick(
        `SKU ${product.slug.toUpperCase()} • Category: ${category?.nameEn ?? product.categorySlug} • Rating ${product.rating.toFixed(1)} from ${product.reviewsCount} verified reviews.`,
        `كود المنتج ${product.slug.toUpperCase()} • القسم: ${category?.nameAr ?? product.categorySlug} • التقييم ${product.rating.toFixed(1)} من ${product.reviewsCount} تقييم موثق.`,
      ),
    },
    {
      title: pick("Shipping & returns", "الشحن والإرجاع"),
      body: t("product.shippingBody"),
    },
  ];

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-24">
      {/* breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 pt-10 text-[11px] font-bold text-slate-400">
        <Link href="/" className="transition-colors hover:text-sky-600">
          {t("nav.home")}
        </Link>
        <span>/</span>
        <Link href="/products" className="transition-colors hover:text-sky-600">
          {t("nav.products")}
        </Link>
        <span>/</span>
        {category ? (
          <>
            <Link
              href={`/category/${category.slug}`}
              className="transition-colors hover:text-sky-600"
            >
              {pick(category.nameEn, category.nameAr)}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span className="text-slate-900">{name}</span>
      </nav>

      <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="group relative aspect-square overflow-hidden rounded-[32px] border border-slate-200 bg-white"
          >
            <Image
              src={gallery[activeImage] ?? product.image}
              alt={name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
            />

            <div className="pointer-events-none absolute start-4 top-4 flex flex-col gap-2">
              {product.badgeEn || product.badgeAr ? (
                <span className="rounded-full bg-slate-950/85 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  {pick(product.badgeEn ?? "", product.badgeAr ?? "")}
                </span>
              ) : null}
              {off > 0 ? (
                <span className="rounded-full bg-rose-500 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">
                  -{off}%
                </span>
              ) : null}
            </div>
          </motion.div>

          {gallery.length > 1 ? (
            <div className="mt-3 flex gap-3">
              {gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`${name} ${index + 1}`}
                  className={cn(
                    "relative h-20 w-20 overflow-hidden rounded-2xl border-2 bg-slate-100 transition-all duration-300 hover:-translate-y-0.5",
                    activeImage === index
                      ? "border-sky-500 shadow-lg shadow-sky-500/20"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* info */}
        <div>
          {category ? (
            <Link
              href={`/category/${category.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-sky-700 transition-colors hover:bg-sky-100"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {pick(category.nameEn, category.nameAr)}
            </Link>
          ) : null}

          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-[40px]">
            {name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-2">
              <Stars rating={product.rating} size={16} />
              <span className="text-xs font-extrabold text-slate-900">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                ({product.reviewsCount} {t("product.reviews")})
              </span>
            </span>

            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-extrabold",
                soldOut
                  ? "bg-rose-50 text-rose-600"
                  : product.stock <= 10
                    ? "bg-amber-50 text-amber-600"
                    : "bg-emerald-50 text-emerald-600",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  soldOut
                    ? "bg-rose-500"
                    : product.stock <= 10
                      ? "bg-amber-500"
                      : "bg-emerald-500",
                )}
              />
              {soldOut
                ? t("product.outOfStock")
                : product.stock <= 10
                  ? `${t("product.lowStock")} (${product.stock})`
                  : t("product.inStock")}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              {formatPrice(product.price, lang)}
            </span>
            {product.compareAtPrice ? (
              <>
                <span className="text-base font-bold text-slate-400 line-through">
                  {formatPrice(product.compareAtPrice, lang)}
                </span>
                <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-extrabold text-rose-600">
                  {pick(`Save ${formatPrice(product.compareAtPrice - product.price, lang)}`, `وفّر ${formatPrice(product.compareAtPrice - product.price, lang)}`)}
                </span>
              </>
            ) : null}
          </div>

          <p className="mt-5 text-sm leading-7 text-slate-600">
            {pick(product.descriptionEn, product.descriptionAr)}
          </p>

          {/* Amazon purchase link */}
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={product.amazonUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-4 text-sm font-extrabold transition-all duration-300 hover:-translate-y-0.5 shadow-xl",
                product.amazonUrl ? "bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-amber-400/25 hover:shadow-amber-400/40" : "bg-slate-200 text-slate-500 pointer-events-none",
              )}
            >
              <span>Amazon</span>
              <span className="text-xs">↗</span>
            </a>
          </div>

          {/* assurances */}
          <ul className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {assurances.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50 px-3.5 py-3 text-[11px] font-bold text-slate-600"
              >
                <item.icon className="h-4 w-4 shrink-0 text-sky-500" />
                {item.label}
              </li>
            ))}
          </ul>

          {/* tabs */}
          <div className="mt-9 overflow-hidden rounded-[28px] border border-slate-200 bg-white">
            <div className="flex border-b border-slate-100">
              {tabs.map((tab, index) => (
                <button
                  key={tab.title}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "relative flex-1 px-3 py-4 text-[11px] font-extrabold uppercase tracking-[0.12em] transition-colors sm:text-xs",
                    activeTab === index
                      ? "text-sky-700"
                      : "text-slate-400 hover:text-slate-700",
                  )}
                >
                  {tab.title}
                  {activeTab === index ? (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
                    />
                  ) : null}
                </button>
              ))}
            </div>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 text-sm leading-7 text-slate-600"
            >
              {tabs[activeTab].body}
            </motion.div>
          </div>

          <Link
            href="/products"
            className="mt-7 inline-flex items-center gap-2 text-xs font-extrabold text-slate-500 transition-colors hover:text-sky-600"
          >
            <Arrow className="h-4 w-4 rotate-180" />
            {t("product.back")}
          </Link>
        </div>
      </div>

      {/* related */}
      {related.length > 0 ? (
        <section className="mt-20">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="h-1.5 w-9 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-600">
                    {pick("Complete the look", "كمّل الشكل")}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                  {t("product.related")}
                </h2>
              </div>

              <Link
                href="/products"
                className="group inline-flex items-center gap-2 text-sm font-extrabold text-slate-900 transition-colors hover:text-sky-600"
              >
                {t("common.viewAll")}
                <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {related.map((item, index) => (
              <ProductCard key={item.slug} product={item} index={index} />
            ))}
          </div>
        </section>
      ) : null}

      <p className="mt-10 flex items-center gap-2 text-[11px] font-bold text-slate-400">
        <Package className="h-3.5 w-3.5" />
        {t("product.sku")}: {product.slug}
      </p>
    </div>
  );
}
