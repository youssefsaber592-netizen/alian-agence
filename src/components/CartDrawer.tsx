"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn, formatPrice } from "@/lib/utils";

const FREE_SHIPPING = 500;

export function CartDrawer() {
  const { t, lang, isArabic, pick } = useLanguage();
  const { lines, subtotal, count, isOpen, close, remove, setQuantity, clear } =
    useCart();

  const [checkout, setCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) {
      setCheckout(false);
      setReference(null);
      setError(null);
    }
  }, [isOpen]);

  const shipping = subtotal >= FREE_SHIPPING || subtotal === 0 ? 0 : 45;
  const total = subtotal + shipping;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING) * 100);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!form.customerName.trim() || !form.phone.trim() || !form.address.trim()) {
      setError(t("checkout.required"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          total,
          items: lines.map((line) => ({
            slug: line.slug,
            nameEn: line.nameEn,
            nameAr: line.nameAr,
            image: line.image,
            price: line.price,
            quantity: line.quantity,
          })),
        }),
      });

      const data = (await res.json()) as { reference?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? t("checkout.required"));
        return;
      }

      setReference(data.reference ?? "AL-000000");
      clear();
    } catch {
      setError(t("checkout.required"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80]"
        >
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={close}
          />

          <motion.aside
            initial={{ x: isArabic ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isArabic ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
            aria-label={t("cart.title")}
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-50 text-sky-600">
                  <ShoppingBag className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-slate-950">
                    {t("cart.title")}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400">
                    {count} {t("shop.results")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={t("search.close")}
                className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {reference ? (
              /* success */
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14 }}
                  className="grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-500"
                >
                  <CheckCircle2 className="h-10 w-10" />
                </motion.span>
                <h3 className="text-xl font-extrabold text-slate-950">
                  {t("checkout.success")}
                </h3>
                <p className="text-sm leading-6 text-slate-500">
                  {t("checkout.successBody")}
                </p>
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                    {t("checkout.reference")}
                  </p>
                  <p className="mt-1 font-display text-lg font-extrabold text-slate-950">
                    {reference}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="mt-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-extrabold text-white"
                >
                  {t("cart.continue")}
                </button>
              </div>
            ) : lines.length === 0 ? (
              /* empty */
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                  <ShoppingBag className="h-7 w-7" />
                </span>
                <h3 className="text-base font-extrabold text-slate-950">
                  {t("cart.empty")}
                </h3>
                <p className="text-sm text-slate-500">{t("cart.emptyHint")}</p>
                <Link
                  href="/products"
                  onClick={close}
                  className="mt-3 rounded-full bg-slate-950 px-6 py-3 text-sm font-extrabold text-white"
                >
                  {t("cart.continue")}
                </Link>
              </div>
            ) : (
              <>
                {/* free shipping progress */}
                <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                  <p className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                    <Truck className="h-3.5 w-3.5 text-sky-500" />
                    {subtotal >= FREE_SHIPPING
                      ? lang === "ar"
                        ? "مبروك! التوصيل مجاني 🎉"
                        : "Nice — free delivery unlocked 🎉"
                      : lang === "ar"
                        ? `فاضل ${formatPrice(FREE_SHIPPING - subtotal, lang)} للتوصيل المجاني`
                        : `${formatPrice(FREE_SHIPPING - subtotal, lang)} away from free delivery`}
                  </p>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>

                {/* lines */}
                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                  {lines.map((line) => (
                    <motion.div
                      key={line.slug}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-3"
                    >
                      <Link
                        href={`/products/${line.slug}`}
                        onClick={close}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100"
                      >
                        <Image
                          src={line.image}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${line.slug}`}
                          onClick={close}
                          className="block truncate text-sm font-extrabold text-slate-950"
                        >
                          {pick(line.nameEn, line.nameAr)}
                        </Link>
                        <p className="mt-0.5 text-xs font-bold text-sky-700">
                          {formatPrice(line.price, lang)}
                        </p>

                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 rounded-full border border-slate-200 p-1">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(line.slug, line.quantity - 1)
                              }
                              aria-label={t("cart.decrease")}
                              className="grid h-6 w-6 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-extrabold tabular-nums text-slate-900">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(line.slug, line.quantity + 1)
                              }
                              aria-label={t("cart.increase")}
                              className="grid h-6 w-6 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => remove(line.slug)}
                            aria-label={t("cart.remove")}
                            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* summary */}
                <div className="border-t border-slate-100 bg-white px-5 py-4">
                  {checkout ? (
                    <form onSubmit={submit} className="space-y-2.5">
                      <p className="text-sm font-extrabold text-slate-950">
                        {t("checkout.title")}
                      </p>
                      <input
                        value={form.customerName}
                        onChange={(e) =>
                          setForm({ ...form, customerName: e.target.value })
                        }
                        placeholder={t("checkout.name")}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold outline-none transition-colors focus:border-sky-400"
                      />
                      <div className="grid grid-cols-2 gap-2.5">
                        <input
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                          placeholder={t("checkout.phone")}
                          inputMode="tel"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold outline-none transition-colors focus:border-sky-400"
                        />
                        <input
                          value={form.city}
                          onChange={(e) =>
                            setForm({ ...form, city: e.target.value })
                          }
                          placeholder={t("checkout.city")}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold outline-none transition-colors focus:border-sky-400"
                        />
                      </div>
                      <input
                        value={form.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                        placeholder={t("checkout.address")}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold outline-none transition-colors focus:border-sky-400"
                      />
                      <textarea
                        value={form.notes}
                        onChange={(e) =>
                          setForm({ ...form, notes: e.target.value })
                        }
                        placeholder={t("checkout.notes")}
                        rows={2}
                        className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold outline-none transition-colors focus:border-sky-400"
                      />

                      {error ? (
                        <p className="text-xs font-bold text-rose-500">{error}</p>
                      ) : null}

                      <button
                        type="submit"
                        disabled={submitting}
                        className={cn(
                          "flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold text-white transition-all",
                          submitting
                            ? "bg-slate-400"
                            : "bg-slate-950 hover:bg-sky-600",
                        )}
                      >
                        {submitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : null}
                        {t("checkout.place")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckout(false)}
                        className="w-full rounded-full px-4 py-2 text-xs font-bold text-slate-400 transition-colors hover:text-slate-900"
                      >
                        {t("admin.cancel")}
                      </button>
                    </form>
                  ) : (
                    <>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between font-semibold text-slate-500">
                          <span>{t("cart.subtotal")}</span>
                          <span className="text-slate-900">
                            {formatPrice(subtotal, lang)}
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold text-slate-500">
                          <span>{t("cart.shipping")}</span>
                          <span
                            className={cn(
                              shipping === 0 ? "text-emerald-600" : "text-slate-900",
                            )}
                          >
                            {shipping === 0
                              ? t("cart.free")
                              : formatPrice(shipping, lang)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-slate-200 pt-2.5 text-base font-extrabold text-slate-950">
                          <span>{t("cart.total")}</span>
                          <span>{formatPrice(total, lang)}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCheckout(true)}
                        className="mt-4 w-full rounded-full bg-slate-950 px-6 py-3.5 text-sm font-extrabold text-white transition-colors hover:bg-sky-600"
                      >
                        {t("cart.checkout")}
                      </button>
                      <p className="mt-2.5 text-center text-[11px] font-semibold text-slate-400">
                        {t("cart.freeShipNote")}
                      </p>
                    </>
                  )}
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
