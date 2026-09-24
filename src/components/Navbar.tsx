"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutGrid,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "./SearchOverlay";

const NAV_LINKS = [
  { href: "/", key: "nav.home" },
  { href: "/#categories", key: "nav.categories" },
  { href: "/products", key: "nav.products" },
  { href: "/#why", key: "nav.about" },
  { href: "/#reviews", key: "nav.reviews" },
] as const;

export function Navbar() {
  const { t, lang, toggleLang, isArabic } = useLanguage();
  const [clickCount, setClickCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [barVisible, setBarVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* announcement bar */}
        <AnimatePresence initial={false}>
          {barVisible ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden border-b border-white/10 bg-ink-950/95 backdrop-blur-md"
            >
              <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <p className="flex items-center gap-2 text-[11px] font-semibold text-sky-100/90">
                  <Truck className="h-3.5 w-3.5 text-sky-400" />
                  <span className="hidden sm:inline">
                    {isArabic
                      ? "توصيل مجاني للطلبات أكثر من ٥٠٠ ج.م • استرجاع سهل خلال ٧ أيام"
                      : "Free delivery over EGP 500 • Easy 7-day returns"}
                  </span>
                  <span className="sm:hidden">
                    {isArabic ? "توصيل مجاني" : "Free delivery"}
                  </span>
                </p>

                <div className="flex items-center gap-3">
                  <span className="hidden items-center gap-1.5 text-[11px] font-semibold text-amber-200/90 md:flex">
                    <Sparkles className="h-3.5 w-3.5" />
                    {isArabic ? "تشكيلة ٢٠٢٦ متاحة الآن" : "2026 collection is live"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBarVisible(false)}
                    aria-label="Dismiss"
                    className="rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* main bar */}
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "transition-all duration-500",
            solid
              ? "border-b border-slate-200/70 bg-white/85 shadow-[0_10px_40px_-24px_rgb(2_32_71/0.35)] backdrop-blur-xl"
              : "border-b border-transparent bg-transparent",
          )}
        >
          <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6 lg:px-8">
            {/* logo */}
            <Link
              href="/"
              className={cn(
                "group flex items-center gap-3",
                solid ? "text-slate-950" : "text-white",
              )}
            >
              <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-sky-700 shadow-lg shadow-sky-500/30 transition-transform duration-500 group-hover:rotate-6">
                <span className="font-display text-lg font-extrabold text-white">
                  A
                </span>
                <span className="absolute inset-0 bg-grain opacity-25 mix-blend-overlay" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[15px] font-extrabold tracking-tight">
                  ALIAN
                </span>
                <span
                  className={cn(
                    "text-[9px] font-bold uppercase tracking-[0.34em]",
                    solid ? "text-sky-600" : "text-sky-300",
                  )}
                >
                  AGENCE
                </span>
              </span>
            </Link>

            {/* desktop links */}
            <div
              className={cn(
                "hidden items-center gap-8 lg:flex",
                solid ? "text-slate-600" : "text-white/85",
              )}
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className={cn(
                    "underline-sweep relative text-sm font-bold transition-colors hover:text-sky-500",
                    solid ? "" : "drop-shadow",
                  )}
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>

            {/* actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label={t("nav.search")}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-full border px-3 text-xs font-bold transition-all duration-300",
                  solid
                    ? "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700"
                    : "border-white/20 bg-white/10 text-white hover:bg-white/20",
                )}
                onDoubleClick={() => window.open("/admin", "_self")}
              >
                <Search className="h-4 w-4" />
                <span className="hidden xl:inline">{t("nav.search")}</span>
              </button>

              {/* language switch */}
              <button
                type="button"
                onClick={toggleLang}
                aria-label="Switch language"
                className={cn(
                  "relative flex h-10 items-center gap-1 rounded-full border p-1 text-[11px] font-extrabold transition-colors",
                  solid
                    ? "border-slate-200 bg-white text-slate-500"
                    : "border-white/20 bg-white/10 text-white/80",
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 h-8 w-[38px] rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 shadow transition-all duration-300",
                    isArabic ? "start-1" : "start-[42px]",
                  )}
                />
                <span
                  className={cn(
                    "relative z-10 w-[38px] py-2 text-center transition-colors",
                    isArabic ? "text-white" : "text-slate-400",
                  )}
                >
                  ع
                </span>
                <span
                  className={cn(
                    "relative z-10 w-[38px] py-2 text-center transition-colors",
                    !isArabic ? "text-white" : "text-white/55",
                  )}
                >
                  EN
                </span>
              </button>

              {/* admin access — double-click search opens dashboard */}
              <button
                type="button"
                onClick={() => {
                  const c = clickCount + 1;
                  setClickCount(c);
                  if (c >= 2) {
                    setClickCount(0);
                    window.open("/admin", "_self");
                  }
                  setTimeout(() => setClickCount(0), 600);
                }}
                aria-label="Admin"
                title="Double-click to open dashboard"
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border text-xs font-extrabold transition-all hover:scale-105",
                  solid ? "border-sky-300 bg-white text-sky-700" : "border-white/25 bg-white/10 text-white hover:bg-white/20",
                )}
              >
                <Sparkles className="h-4 w-4" />
              </button>

              {/* mobile menu */}
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={t("nav.menu")}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:hidden",
                  solid
                    ? "border-slate-200 bg-white text-slate-900"
                    : "border-white/20 bg-white/10 text-white",
                )}
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </nav>
        </motion.div>
      </header>

      {/* mobile sheet */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: isArabic ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isArabic ? "-100%" : "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="absolute inset-y-0 end-0 flex w-[86%] max-w-sm flex-col bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-950">
                  <LayoutGrid className="h-4 w-4 text-sky-600" />
                  <span className="text-sm font-extrabold">{t("nav.menu")}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label={t("search.close")}
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-8 flex flex-col">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.key}
                    initial={{ opacity: 0, x: isArabic ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * index + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between border-b border-slate-100 py-4 text-lg font-extrabold text-slate-900"
                    >
                      {t(link.key)}
                      <span className="text-xs font-bold text-sky-500">0{index + 1}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-extrabold text-white"
              >
                <LayoutGrid className="h-4 w-4" />
                {t("nav.admin")}
              </Link>

              <p className="mt-auto pt-8 text-xs font-semibold text-slate-400">
                {isArabic ? "ALIAN AGENCE — أسلوب حياة عصري" : "ALIAN AGENCE — modern living, curated."}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
