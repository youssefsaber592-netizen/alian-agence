"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Gem,
  Heart,
  Quote,
  ShoppingBag,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Counter, Reveal, Stars, staggerChild, staggerParent } from "../ui/primitives";
import { SectionHeading } from "./ShopSections";

/* =========================================================
   WHY ALIAN STORE
========================================================= */

const WHY = [
  {
    icon: Wand2,
    en: { title: "Modern designs", text: "We choose products that bring a modern, elegant touch to your space — never generic, always considered." },
    ar: { title: "تصميمات عصرية", text: "بنختار منتجات تضيف لمسة أنيقة وعصرية لمساحتك — مش منتجات عامة، لكن اختيارات مدروسة." },
  },
  {
    icon: Gem,
    en: { title: "Carefully selected", text: "Not just more products — a shortlist with real value, checked for quality before it reaches the store." },
    ar: { title: "اختيارات بعناية", text: "مش مجرد منتجات كثيرة، لكن قائمة قصيرة ليها قيمة فعلية واتتم فحصها قبل ما توصل." },
  },
  {
    icon: Heart,
    en: { title: "A trusted experience", text: "Clear prices, honest stock levels and a checkout that takes seconds — shopping should feel calm." },
    ar: { title: "تجربة موثوقة", text: "أسعار واضحة ومخزون حقيقي وطلب بيخلص في ثواني — التسوق لازم يكون مريح." },
  },
];

const NUMBERS = [
  { value: 240, suffix: "+", en: "Products in store", ar: "منتج في المتجر" },
  { value: 500, suffix: "+", en: "Orders delivered", ar: "طلب تم توصيله" },
  { value: 98, suffix: "%", en: "Would buy again", ar: "هيشتري تاني" },
];

export function WhySection() {
  const { pick, t } = useLanguage();

  return (
    <section id="why" className="scroll-mt-24 bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={pick("Why ALIAN STORE?", "لماذا ALIAN STORE؟")}
            title={pick("More than just a store", "أكثر من مجرد متجر")}
            description={pick(
              "We are building a calmer way to shop online — fewer, better products, and an experience that respects your time.",
              "بنبني طريقة أهدأ للتسوق أونلاين — منتجات أقل وأفضل، وتجربة بتحترم وقتك.",
            )}
          />
        </Reveal>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {WHY.map((feature) => (
            <motion.article
              key={feature.en.title}
              variants={staggerChild}
              className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-sky-200 hover:shadow-[0_30px_60px_-30px_rgb(2_32_71/0.3)]"
            >
              <span className="pointer-events-none absolute -end-10 -top-10 h-28 w-28 rounded-full bg-sky-50 transition-transform duration-700 group-hover:scale-150" />

              <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/25">
                <feature.icon className="h-6 w-6" />
              </span>

              <h3 className="relative mt-6 text-lg font-extrabold text-slate-950">
                {pick(feature.en.title, feature.ar.title)}
              </h3>

              <p className="relative mt-3 text-sm leading-7 text-slate-500">
                {pick(feature.en.text, feature.ar.text)}
              </p>

              <span className="relative mt-5 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-sky-600">
                <CheckCircle2 className="h-4 w-4" />
                {pick("Part of the ALIAN experience", "جزء من تجربة ALIAN")}
              </span>
            </motion.article>
          ))}
        </motion.div>

        {/* numbers */}
        <motion.dl
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3"
        >
          {NUMBERS.map((item) => (
            <div
              key={item.en}
              className="rounded-[28px] border border-slate-200 bg-white px-6 py-7 text-center"
            >
              <dd className="font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                <Counter to={item.value} suffix={item.suffix} />
              </dd>
              <dt className="mt-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                {pick(item.en, item.ar)}
              </dt>
            </div>
          ))}
        </motion.dl>

        <p className="sr-only">{t("nav.about")}</p>
      </div>
    </section>
  );
}

/* =========================================================
   REVIEWS
========================================================= */

const REVIEWS = [
  {
    en: "The marble bathroom set genuinely looks like a hotel. Packaging was beautiful and delivery was next-day.",
    ar: "طقم الحمام الرخامي شكله فندقي بجد. التغليف كان جميل والتوصيل كان في اليوم اللي بعده.",
    name: { en: "Nour A.", ar: "نور أ." },
    role: { en: "Verified customer", ar: "عميلة موثقة" },
  },
  {
    en: "I ordered the desk organiser and two décor pieces. Everything matched the photos exactly — rare these days.",
    ar: "طلبت منظم المكتب وقطعتين ديكور. كل حاجة جت مطابقة للصور بالظبط — وحاجة نادرة.",
    name: { en: "Karim S.", ar: "كريم س." },
    role: { en: "Verified customer", ar: "عميل موثق" },
  },
  {
    en: "The store is easy to browse and the product pages are clear. Support replied on WhatsApp in minutes.",
    ar: "المتجر سهل في التصفح وصفحات المنتج واضحة. خدمة العملاء ردت عليّ على واتساب في دقايق.",
    name: { en: "Mariam H.", ar: "مريم ح." },
    role: { en: "Verified customer", ar: "عميلة موثقة" },
  },
];

export function ReviewsSection() {
  const { pick } = useLanguage();

  return (
    <section id="reviews" className="scroll-mt-24 bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={pick("Customer reviews", "آراء عملائنا")}
            title={pick("What our customers say", "تجارب حقيقية من عملائنا")}
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* rating summary */}
          <Reveal className="lg:col-span-4">
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] bg-ink-950 p-8 text-white">
              <div className="pointer-events-none absolute inset-0 mesh-glow opacity-70" />
              <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06] mix-blend-soft-light" />

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-sky-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  {pick("Overall rating", "التقييم العام")}
                </span>

                <p className="mt-6 font-display text-6xl font-extrabold leading-none">
                  4.9
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <Stars rating={4.9} size={18} />
                  <span className="text-xs font-bold text-slate-400">
                    {pick("2,480 reviews", "٢٤٨٠ تقييم")}
                  </span>
                </div>
              </div>

              <div className="relative mt-8 space-y-2.5">
                {[
                  { stars: 5, pct: 86 },
                  { stars: 4, pct: 10 },
                  { stars: 3, pct: 3 },
                  { stars: 2, pct: 1 },
                ].map((row) => (
                  <div key={row.stars} className="flex items-center gap-3">
                    <span className="w-8 text-[11px] font-bold text-slate-400">
                      {row.stars}★
                    </span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/12">
                      <motion.span
                        className="block h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-400"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${row.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </span>
                    <span className="w-9 text-end text-[11px] font-bold text-slate-400">
                      {row.pct}%
                    </span>
                  </div>
                ))}
              </div>

              <p className="relative mt-8 text-xs font-semibold leading-6 text-slate-400">
                {pick(
                  "Ratings come from verified orders placed through ALIAN STORE.",
                  "التقييمات جاية من طلبات موثقة تمت عبر ALIAN STORE.",
                )}
              </p>
            </div>
          </Reveal>

          {/* review cards */}
          <div className="grid gap-5 lg:col-span-8 sm:grid-cols-2">
            {REVIEWS.map((review, index) => (
              <Reveal
                key={review.name.en}
                delay={index * 0.08}
                className={index === 2 ? "sm:col-span-2" : ""}
              >
                <figure className="flex h-full flex-col rounded-[28px] border border-slate-200 bg-slate-50 p-7 transition-colors duration-500 hover:border-sky-200 hover:bg-white">
                  <Quote className="h-6 w-6 text-sky-300" />

                  <div className="mt-4 flex gap-1">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  <blockquote className="mt-4 flex-1 text-sm leading-7 text-slate-600">
                    “{pick(review.en, review.ar)}”
                  </blockquote>

                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-slate-900 to-slate-700 text-xs font-extrabold text-white">
                      {pick(review.name.en[0], review.name.ar[0])}
                    </span>
                    <span>
                      <span className="block text-sm font-extrabold text-slate-950">
                        {pick(review.name.en, review.name.ar)}
                      </span>
                      <span className="block text-[11px] font-semibold text-slate-400">
                        {pick(review.role.en, review.role.ar)}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FINAL CTA
========================================================= */

export function FinalCta() {
  const { pick, t, isArabic } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section className="px-6 pb-20 lg:px-8 lg:pb-24">
      <Reveal y={30}>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 px-6 py-14 text-center sm:px-10 lg:px-20 lg:py-20">
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06] mix-blend-soft-light" />

          <div className="relative mx-auto max-w-2xl">
            <motion.span
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/8 text-sky-300 backdrop-blur-md"
            >
              <Sparkles className="h-7 w-7" />
            </motion.span>

            <h2 className="mt-6 text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-[40px]">
              {pick("Ready to discover your favourites?", "جاهز تكتشف اختياراتك؟")}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-[15px]">
              {pick(
                "Browse the full ALIAN catalogue and find the piece that finishes your space.",
                "استكشف كل منتجات ALIAN واختار القطعة اللي تكمل مساحتك.",
              )}
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-extrabold text-slate-950 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-sky-50"
              >
                <ShoppingBag className="h-4 w-4" />
                {pick("Start shopping", "ابدأ التسوق")}
                <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/#categories"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/8 px-7 py-4 text-sm font-extrabold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/50"
              >
                {t("nav.categories")}
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
