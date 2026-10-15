"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Headphones,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal, staggerChild, staggerParent } from "../ui/primitives";

export function TrustBar() {
  const { pick } = useLanguage();

  const features = [
    {
      icon: Truck,
      en: "Fast Delivery",
      ar: "شحن سريع",
      descEn: "Dispatched within 24 hours",
      descAr: "بنجهز طلبك خلال ٢٤ ساعة",
    },
    {
      icon: ShieldCheck,
      en: "Trusted Quality",
      ar: "جودة تستحق الثقة",
      descEn: "Every product hand-checked",
      descAr: "كل منتج بيتم فحصه بعناية",
    },
    {
      icon: RotateCcw,
      en: "Easy Returns",
      ar: "تجربة سهلة",
      descEn: "7-day returns, no questions",
      descAr: "إرجاع خلال ٧ أيام بسهولة",
    },
    {
      icon: Headphones,
      en: "Real Support",
      ar: "دعم حقيقي",
      descEn: "We reply on WhatsApp daily",
      descAr: "بنرد على واتساب كل يوم",
    },
  ];

  return (
    <section className="relative z-10 border-y border-slate-200/80 bg-white">
      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mx-auto grid max-w-7xl grid-cols-2 divide-slate-100 sm:divide-x lg:grid-cols-4"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.en}
            variants={staggerChild}
            className="group flex items-center gap-3.5 border-slate-100 px-4 py-6 sm:px-6 sm:py-7 lg:gap-4 lg:px-7 [&:nth-child(odd)]:border-e lg:[&:nth-child(odd)]:border-e-0"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-600 transition-all duration-500 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white sm:h-12 sm:w-12">
              <feature.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-xs font-extrabold text-slate-950 sm:text-sm">
                {pick(feature.en, feature.ar)}
              </h3>
              <p className="mt-1 hidden text-[11px] font-semibold leading-5 text-slate-500 sm:block">
                {pick(feature.descEn, feature.descAr)}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal y={16} className="border-t border-slate-100 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            <span className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-emerald-500" />
              {pick("100% authentic products", "منتجات أصلية ١٠٠٪")}
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-sky-500" />
              {pick("Secure payment", "دفع آمن")}
            </span>
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-indigo-500" />
              {pick("Nationwide delivery", "توصيل لكل المحافظات")}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
