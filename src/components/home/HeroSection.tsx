"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Counter, Marquee, useSpotlight } from "../ui/primitives";

const TILES = [
  { image: "/images/hero/tile-holders.jpg", en: "Holders & Organizers", ar: "الحوامل والمنظمات" },
  { image: "/images/hero/tile-women.jpg", en: "Women's Accessories", ar: "إكسسوارات حريمي" },
  { image: "/images/hero/tile-bathroom.jpg", en: "Bathroom Accessories", ar: "مستلزمات الحمام" },
  { image: "/images/hero/tile-kitchen.jpg", en: "Kitchen Supplies", ar: "أدوات المطبخ" },
  { image: "/images/hero/tile-tissue.jpg", en: "Tissue Boxes", ar: "علب المناديل" },
  { image: "/images/hero/tile-decor.jpg", en: "Modern Décor", ar: "ديكورات حديثة" },
];

const STATS = [
  { value: 240, suffix: "+", en: "Curated products", ar: "منتج مختار" },
  { value: 500, suffix: "+", en: "Happy customers", ar: "عميل سعيد" },
  { value: 4.9, suffix: "/5", en: "Average rating", ar: "متوسط التقييم", decimals: 1 },
  { value: 24, suffix: "h", en: "Dispatch time", ar: "زمن التجهيز" },
];

const wordFade = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function HeroSection() {
  const { t, lang, isArabic, pick } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;
  const { ref, background, onPointerMove } = useSpotlight<HTMLDivElement>();

  const headline = isArabic
    ? ["صُمم", "ليعكس", "ذوقك"]
    : ["Elevate", "Your"];
  const accent = isArabic ? "مع ALIAN AGENCY" : "Lifestyle";

  return (
    <section
      id="hero"
      ref={ref}
      onPointerMove={onPointerMove}
      className="relative flex min-h-[88vh] items-center overflow-hidden bg-ink-950 pt-28 pb-16 sm:min-h-[92vh] sm:pt-32"
    >
      {/* moving imagery */}
      <div className="absolute inset-0 overflow-hidden">
        <Marquee duration={64} className="h-full w-full" pauseOnHover={false}>
          {TILES.map((tile, index) => (
            <div
              key={`${tile.en}-${index}`}
              className="relative me-4 h-[46vh] w-[220px] shrink-0 overflow-hidden rounded-3xl border border-white/10 sm:me-5 sm:h-[52vh] sm:w-[300px] lg:h-[58vh] lg:w-[380px]"
            >
              <Image
                src={tile.image}
                alt={pick(tile.en, tile.ar)}
                fill
                priority={index < 3}
                sizes="380px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
            </div>
          ))}
        </Marquee>

        <motion.div style={{ background }} className="pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-ink-950/72" />
        <div className="pointer-events-none absolute inset-0 mesh-glow opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.07] mix-blend-soft-light" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f6f8fb] to-transparent" />
      </div>

      {/* floating cards */}
      <motion.div
        initial={{ opacity: 0, x: isArabic ? 60 : -60 }}
        animate={{ opacity: 1, x: 0, y: [0, -12, 0] }}
        transition={{
          opacity: { duration: 0.8, delay: 0.5 },
          x: { duration: 0.8, delay: 0.5 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute start-6 top-[26%] z-20 hidden items-center gap-3 rounded-2xl border border-white/15 bg-white/8 p-3.5 shadow-2xl backdrop-blur-xl lg:flex xl:start-14"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500/20 text-sky-300">
          <Zap className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="text-xs font-extrabold text-white">
            {pick("2026 Exclusive Collection", "تشكيلة ٢٠٢٦ الحصرية")}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-sky-200/80">
            {pick("Curated for you", "اختيارات مميزة لك")}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: isArabic ? -60 : 60 }}
        animate={{ opacity: 1, x: 0, y: [0, 14, 0] }}
        transition={{
          opacity: { duration: 0.8, delay: 0.7 },
          x: { duration: 0.8, delay: 0.7 },
          y: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute end-6 bottom-[30%] z-20 hidden items-center gap-3 rounded-2xl border border-white/15 bg-white/8 p-3.5 shadow-2xl backdrop-blur-xl lg:flex xl:end-14"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/20 text-amber-300">
          <Star className="h-5 w-5 fill-amber-300" />
        </span>
        <div className="leading-tight">
          <p className="text-xs font-extrabold text-white">
            {pick("4.9 / 5 from 2,400 reviews", "٤.٩ / ٥ من ٢٤٠٠ تقييم")}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-amber-200/80">
            {pick("Quality • Style • Simplicity", "جودة • أناقة • بساطة")}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="absolute bottom-[18%] start-1/2 z-20 hidden -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/15 bg-white/8 px-4 py-2.5 text-[11px] font-bold text-white backdrop-blur-xl md:flex"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        {pick("38 people are shopping right now", "٣٨ شخص بيتسوقوا حاليًا")}
      </motion.div>

      {/* content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-[11px] font-bold text-white shadow-2xl backdrop-blur-xl sm:px-5 sm:py-2.5 sm:text-xs"
          >
            <Sparkles className="h-4 w-4 text-sky-300" />
            {pick("Curated selection • Quality you can trust", "اختيارات مميزة • جودة تستحق الثقة")}
            <span className="hidden h-3 w-px bg-white/25 sm:block" />
            <span className="hidden text-sky-200 sm:block">
              {pick("New season 2026", "موسم ٢٠٢٦ الجديد")}
            </span>
          </motion.div>

          <h1 className="mt-7 text-4xl font-extrabold leading-[1.12] tracking-tight text-white drop-shadow-2xl sm:text-5xl md:text-6xl lg:text-[78px]">
            <span className={isArabic ? "font-display" : ""}>
              {headline.map((word, index) => (
                <motion.span
                  key={word}
                  custom={index}
                  variants={wordFade}
                  initial="hidden"
                  animate="show"
                  className="inline-block whitespace-pre me-3"
                >
                  {word}
                </motion.span>
              ))}
            </span>

            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="text-gradient mt-3 block sm:mt-4"
            >
              {accent}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-slate-200/90 drop-shadow-lg sm:mt-7 sm:text-base sm:leading-9 lg:text-lg"
          >
            {pick(
              "We curate high-quality home and lifestyle products with a modern edge — so every corner of your space feels intentional, warm and unmistakably yours.",
              "بنختار لك منتجات منزل وحياة بتصاميم حديثة وجودة عالية، علشان كل ركن في مساحتك يحس بالدفى والذوق.",
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4"
          >
            <a
              href="#categories"
              className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-white px-7 py-4 text-sm font-extrabold text-slate-950 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-sky-500/25 sm:w-auto sm:px-8"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-sky-100 to-cyan-100 transition-transform duration-500 group-hover:translate-x-0" />
              <span className="relative z-10">{t("nav.categories")}</span>
              <Arrow className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <Link
              href="/products"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/25 bg-white/8 px-7 py-4 text-sm font-extrabold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/15 sm:w-auto sm:px-8"
            >
              <ShoppingBag className="h-4 w-4 text-sky-300" />
              {t("nav.products")}
            </Link>
          </motion.div>

          {/* trust micro-copy */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.95 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] font-bold text-slate-300/80"
          >
            {[
              { icon: PackageCheck, label: pick("Free delivery over EGP 500", "توصيل مجاني أكثر من ٥٠٠ ج.م") },
              { icon: Zap, label: pick("24h dispatch", "تجهيز خلال ٢٤ ساعة") },
              { icon: Star, label: pick("7-day easy returns", "إرجاع سهل ٧ أيام") },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-2">
                <item.icon className="h-3.5 w-3.5 text-sky-400" />
                {item.label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* stats strip */}
        <motion.dl
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/12 bg-white/8 backdrop-blur-xl sm:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div key={stat.en} className="px-5 py-6 text-center">
              <dd className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                <Counter
                  to={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                />
              </dd>
              <dt className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                {pick(stat.en, stat.ar)}
              </dt>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/50 sm:flex"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
          {pick("Discover more", "اكتشف المزيد")}
        </span>
        <span className="relative h-9 w-px overflow-hidden bg-white/25">
          <motion.span
            className="absolute inset-x-0 top-0 h-3 bg-sky-300"
            animate={{ y: [0, 34, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>

      <span className="sr-only">{lang === "ar" ? "القسم الرئيسي" : "Hero"}</span>
    </section>
  );
}
