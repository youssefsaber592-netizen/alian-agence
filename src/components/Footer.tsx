"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { seedCategories } from "@/lib/seed-data";
import { cn } from "@/lib/utils";

/* Brand glyphs — inline so the footer never depends on icon-package coverage. */
function InstagramGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.2h2.5l.4-2.9h-2.9V9.05c0-.84.24-1.42 1.46-1.42H16.5V5.05c-.28-.04-1.24-.12-2.36-.12-2.34 0-3.94 1.42-3.94 4.04v2.26H7.7v2.9h2.5V21h3.3Z" />
    </svg>
  );
}

function XGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.3 3h3.02l-6.6 7.54L21 21h-5.3l-4.14-5.42L6.7 21H3.68l6.86-7.84L3 3h5.3l3.86 5.1L17.3 3Zm-1.06 16.2h1.67L7.84 4.71H6.05l10.19 14.49Z" />
    </svg>
  );
}

function YoutubeGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.85 12 4.85 12 4.85s-6 0-7.7.45A2.7 2.7 0 0 0 2.4 7.2C2 8.9 2 12 2 12s0 3.1.4 4.8a2.7 2.7 0 0 0 1.9 1.9c1.7.45 7.7.45 7.7.45s6 0 7.7-.45a2.7 2.7 0 0 0 1.9-1.9c.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8ZM10.1 15.1V8.9l5.2 3.1-5.2 3.1Z" />
    </svg>
  );
}

const SOCIALS = [
  { icon: InstagramGlyph, href: "https://instagram.com", label: "Instagram" },
  { icon: FacebookGlyph, href: "https://facebook.com", label: "Facebook" },
  { icon: XGlyph, href: "https://twitter.com", label: "X" },
  { icon: YoutubeGlyph, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
  const { t, lang, isArabic, pick } = useLanguage();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  const subscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    setState("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { status?: string; error?: string };

      if (!res.ok) {
        setState("error");
        setMessage(t("newsletter.invalid"));
        return;
      }

      setState("done");
      setMessage(
        data.status === "duplicate"
          ? t("newsletter.duplicate")
          : t("newsletter.success"),
      );
      setEmail("");
    } catch {
      setState("error");
      setMessage(t("newsletter.invalid"));
    }
  };

  const columns = [
    {
      title: isArabic ? "المتجر" : "Shop",
      links: [
        { label: t("nav.products"), href: "/products" },
        { label: t("nav.categories"), href: "/#categories" },
        { label: isArabic ? "الأكثر مبيعًا" : "Bestsellers", href: "/products?sort=rating" },
        { label: isArabic ? "وصل حديثًا" : "New arrivals", href: "/products?sort=newest" },
      ],
    },
    {
      title: isArabic ? "المساعدة" : "Help",
      links: [
        { label: t("product.shipping"), href: "/products" },
        { label: t("nav.reviews"), href: "/#reviews" },
        { label: isArabic ? "الأسئلة الشائعة" : "FAQ", href: "/#why" },
        { label: t("nav.admin"), href: "/admin" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink-950 text-slate-300">
      <div className="pointer-events-none absolute inset-0 mesh-glow opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06] mix-blend-soft-light" />

      {/* newsletter */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1.5 text-[11px] font-bold text-sky-300">
              <Sparkles className="h-3.5 w-3.5" />
              {t("newsletter.title")}
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {isArabic
                ? "خليك أول من يعرف بالتشكيلات الجديدة"
                : "Be first to know about new drops"}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
              {t("newsletter.body")}
            </p>
          </div>

          <form onSubmit={subscribe} className="lg:justify-self-end lg:w-full lg:max-w-md">
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t("newsletter.placeholder")}
                  className="w-full rounded-full border border-white/15 bg-white/8 py-3.5 pe-4 ps-11 text-sm font-semibold text-white outline-none transition-colors placeholder:text-slate-500 focus:border-sky-400/60 focus:bg-white/12"
                />
              </div>
              <button
                type="submit"
                disabled={state === "loading"}
                className="group flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50 disabled:opacity-70"
              >
                {state === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {t("newsletter.subscribe")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
            <p
              className={cn(
                "mt-2.5 text-xs font-semibold",
                state === "error" ? "text-rose-400" : "text-slate-500",
              )}
            >
              {message ?? t("newsletter.privacy")}
            </p>
          </form>
        </div>
      </div>

      {/* links */}
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-sky-700 shadow-lg shadow-sky-500/25">
              <span className="font-display text-lg font-extrabold text-white">
                A
              </span>
            </span>
            <div className="leading-none">
              <p className="text-base font-extrabold text-white">ALIAN AGENCY</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-sky-400">
                {t("brand.tagline")}
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
            {isArabic
              ? "متجر إلكتروني بيختار منتجات منزل وإكسسوارات بتصاميم عصرية وجودة عالية، عشان تخلي كل تفصيلة في بيتك أوف ذوقك."
              : "An online store curating modern home and lifestyle products with a real eye for design, quality and detail."}
          </p>

          <ul className="mt-6 space-y-2.5 text-sm font-semibold text-slate-400">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-sky-400" />
              <span dir="ltr">+20 100 000 0000</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-sky-400" />
              <span dir="ltr">hello@alian.agency</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-sky-400" />
              {isArabic ? "القاهرة، مصر" : "Cairo, Egypt"}
            </li>
          </ul>

          <div className="mt-6 flex gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={social.label}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/6 text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-400/50 hover:bg-sky-500/15 hover:text-sky-300"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white">
              {column.title}
            </h3>
            <ul className="mt-4 space-y-3 text-sm font-semibold text-slate-400">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-sky-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white">
            {t("nav.categories")}
          </h3>
          <ul className="mt-4 space-y-3 text-sm font-semibold text-slate-400">
            {seedCategories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="transition-colors hover:text-sky-300"
                >
                  {pick(category.nameEn, category.nameAr)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* bottom */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-center sm:flex-row sm:text-start lg:px-8">
          <p className="text-xs font-semibold text-slate-500">
            © {new Date().getFullYear()} ALIAN AGENCY.{" "}
            {isArabic ? "كل الحقوق محفوظة." : "All rights reserved."}
          </p>

          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              {isArabic ? "دفع آمن" : "Secure checkout"}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              Visa
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              Mastercard
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              {lang === "ar" ? "محفظة" : "Wallet"}
            </span>
          </div>
        </div>
      </div>

      <motion.div
        className="pointer-events-none absolute -bottom-40 start-1/2 h-80 w-[520px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl"
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </footer>
  );
}
