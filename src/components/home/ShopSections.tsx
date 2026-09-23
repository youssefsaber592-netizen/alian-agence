"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Layers, ShoppingBag, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import type { CategoryDTO, ProductDTO } from "@/lib/types";
import { ProductCard } from "../ProductCard";
import { Countdown, Reveal, staggerChild, staggerParent } from "../ui/primitives";

/* =========================================================
   SECTION HEADER
========================================================= */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "start",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  align?: "start" | "center";
}) {
  const { isArabic } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
      )}
    >
      <div className={cn(align === "center" && "mx-auto max-w-2xl")}>
        <div
          className={cn(
            "mb-3.5 flex items-center gap-2.5",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-1.5 w-9 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-600">
            {eyebrow}
          </span>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-[38px] sm:leading-[1.15]">
          {title}
        </h2>

        {description ? (
          <p className="mt-3.5 max-w-xl text-sm leading-7 text-slate-500 sm:text-[15px]">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
        >
          {action.label}
          <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      ) : null}
    </div>
  );
}

/* =========================================================
   CATEGORIES — bento grid
========================================================= */

export function CategoriesSection({
  categories,
  counts,
}: {
  categories: CategoryDTO[];
  counts: Record<string, number>;
}) {
  const { isArabic, pick, t } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section
      id="categories"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 lg:px-8 lg:py-24"
    >
      <Reveal>
        <SectionHeading
          eyebrow={pick("Shop by category", "تسوق حسب القسم")}
          title={pick("Find what fits your space", "اكتشف ما يناسبك")}
          description={pick(
            "Six carefully curated categories — from bathroom sets that feel like a spa to desk organisers that keep your mornings calm.",
            "ستة أقسام مختارة بعناية — من أطقم الحمام اللي تحسك بفندق، للمنظمات اللي تخلي صباحك هادي.",
          )}
          action={{ label: t("common.viewAll"), href: "/products" }}
        />
      </Reveal>

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-11 grid auto-rows-[200px] grid-cols-1 gap-4 sm:auto-rows-[224px] md:grid-cols-2 md:gap-5 lg:grid-cols-4"
      >
        {categories.map((category) => {
          const isLarge = category.size === "large";
          const isWide = category.size === "wide";
          const name = pick(category.nameEn, category.nameAr);

          return (
            <motion.div
              key={category.slug}
              variants={staggerChild}
              className={cn(
                "group relative overflow-hidden rounded-[28px]",
                isLarge && "md:col-span-2 md:row-span-2",
                isWide && "md:col-span-2",
              )}
            >
              <Link href={`/category/${category.slug}`} className="block h-full w-full">
                <Image
                  src={category.image}
                  alt={name}
                  fill
                  sizes={
                    isLarge
                      ? "(max-width: 768px) 100vw, 50vw"
                      : isWide
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 100vw, 25vw"
                  }
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.12]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
                <div className="absolute inset-0 bg-sky-950/0 transition-colors duration-500 group-hover:bg-sky-950/15" />
                <div className="absolute inset-0 border border-white/10 transition-colors duration-500 group-hover:border-sky-300/40 rounded-[28px]" />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
                        <Layers className="h-3 w-3" />
                        {counts[category.slug] ?? 0}{" "}
                        {pick("items", "منتج")}
                      </span>

                      <h3
                        className={cn(
                          "mt-3 font-extrabold text-white transition-colors duration-300 group-hover:text-sky-300",
                          isLarge
                            ? "text-2xl sm:text-3xl"
                            : "text-lg sm:text-xl",
                        )}
                      >
                        {name}
                      </h3>

                      <p
                        className={cn(
                          "mt-2 max-w-sm text-xs leading-6 text-white/70 sm:text-[13px]",
                          !isLarge && !isWide && "hidden sm:block",
                        )}
                      >
                        {pick(category.descriptionEn, category.descriptionAr)}
                      </p>
                    </div>

                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-all duration-500 group-hover:border-sky-400 group-hover:bg-sky-500">
                      <Arrow className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

/* =========================================================
   PROMO BANNER + COUNTDOWN
========================================================= */

export function PromoBanner() {
  const { pick, t, isArabic } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section className="px-6 pb-20 lg:px-8">
      <Reveal y={34}>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-ink-950 px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute -end-24 -top-28 h-72 w-72 rounded-full bg-sky-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-36 -start-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06] mix-blend-soft-light" />

          <div className="relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-sky-300">
                <Sparkles className="h-3.5 w-3.5" />
                {pick("Season offer", "عرض الموسم")}
              </span>

              <h2 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-[40px]">
                {pick(
                  "Make every corner reflect your style.",
                  "خلي كل ركن في بيتك يعبر عن ذوقك.",
                )}
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-[15px]">
                {pick(
                  "Up to 25% off selected bathroom, kitchen and décor pieces — while stock lasts.",
                  "خصم يصل إلى ٢٥٪ على قطع مختارة من الحمام والمطبخ والديكور — لفترة محدودة.",
                )}
              </p>

              <Countdown
                className="mt-7"
                labels={{
                  days: pick("days", "يوم"),
                  hours: pick("hrs", "ساعة"),
                  minutes: pick("min", "دقيقة"),
                  seconds: pick("sec", "ثانية"),
                }}
              />
            </div>

            <Link
              href="/products"
              className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-extrabold text-slate-950 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-sky-50"
            >
              <ShoppingBag className="h-4 w-4" />
              {pick("Shop the offer", "تسوق العرض")}
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* =========================================================
   FEATURED PRODUCTS
========================================================= */

export function FeaturedProducts({ products }: { products: ProductDTO[] }) {
  const { pick, t, isArabic } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  if (products.length === 0) {
    return (
      <section id="products" className="scroll-mt-24 bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                {pick("No products yet", "لا توجد منتجات حاليًا")}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {pick("Products will be added soon.", "سيتم إضافة المنتجات قريبًا.")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="scroll-mt-24 bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={pick("Featured products", "المنتجات المميزة")}
            title={pick("Top choices this week", "الأكثر طلبًا هذا الأسبوع")}
            description={pick(
              "Handpicked pieces with the highest ratings — the ones our customers keep coming back for.",
              "قطع مختارة بأعلى التقييمات — اللي عملاءنا بيرجعولها تاني.",
            )}
            action={{ label: t("common.viewAll"), href: "/products" }}
          />
        </Reveal>

        <div className="mt-11 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {products.slice(0, 8).map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              index={index}
              priority={index < 4}
            />
          ))}
        </div>

        {products.length > 8 ? (
          <div className="mt-12 flex justify-center">
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-extrabold text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
            >
              <ShoppingBag className="h-4 w-4" />
              {pick("View all products", "عرض جميع المنتجات")}
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
