"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Database,
  ExternalLink,
  LayoutGrid,
  Loader2,
  Package,
  Pencil,
  Plus,
  Receipt,
  Save,
  Star,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn, formatPrice } from "@/lib/utils";
import { seedCategories, seedProducts } from "@/lib/seed-data";
import type { CategoryDTO, ProductDTO } from "@/lib/types";

type OrderRow = {
  id: number;
  reference: string;
  customerName: string;
  phone: string;
  total: number;
  status: string;
  createdAt: string;
};

type FormState = {
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: string;
  compareAtPrice: string;
  categorySlug: string;
  image: string;
  badgeEn: string;
  badgeAr: string;
  stock: string;
  isFeatured: boolean;
  isActive: boolean;
  amazonUrl: string;
};

const EMPTY_FORM: FormState = {
  slug: "",
  nameEn: "",
  nameAr: "",
  descriptionEn: "",
  descriptionAr: "",
  price: "",
  compareAtPrice: "",
  categorySlug: seedCategories[0]?.slug ?? "decor",
  image: seedProducts[0]?.image ?? "/images/placeholder.jpg",
  badgeEn: "",
  badgeAr: "",
  stock: "25",
  isFeatured: false,
  isActive: true,
  amazonUrl: "https://www.amazon.eg/dp/",
};

const IMAGE_OPTIONS = Array.from(
  new Set([
    ...seedCategories.map((category) => category.image),
    ...seedProducts.map((product) => product.image),
  ]),
);

function formatImageUrl(url: string | undefined | null): string {
  if (!url) return "/images/placeholder.jpg";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }
  return `/${url}`;
}

export function AdminDashboard({
  initialProducts,
  categories: initialCategories,
  initialOrders,
}: {
  initialProducts: ProductDTO[];
  categories: CategoryDTO[];
  initialOrders: OrderRow[];
}) {
  const { lang, isArabic, pick } = useLanguage();
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [orders] = useState(initialOrders);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [catForm, setCatForm] = useState({
    slug: "",
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    image: "",
    size: "normal" as "normal" | "large" | "wide",
    sortOrder: "99",
    link: "",
  });
  const [catBusy, setCatBusy] = useState(false);
  const [catMessage, setCatMessage] = useState<string | null>(null);

  const revenue = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders],
  );

  const visible = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (product) =>
        product.nameEn.toLowerCase().includes(term) ||
        product.nameAr.includes(term) ||
        product.categorySlug.includes(term),
    );
  }, [products, filter]);

  const reloadAll = async () => {
    try {
      const [resProd, resCat] = await Promise.all([
        fetch("/api/products?limit=200"),
        fetch("/api/categories"),
      ]);
      const dataProd = await resProd.json();
      const dataCat = await resCat.json();

      if (dataProd.products) setProducts(dataProd.products);
      if (Array.isArray(dataCat)) setCategories(dataCat);
      else if (dataCat.categories) setCategories(dataCat.categories);
    } catch {
      // ignore
    }
  };

  const seed = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = (await res.json()) as { products?: number; skipped?: boolean };
      setMessage(
        data.skipped
          ? pick("Catalogue already contains products.", "الكتالوج فيه منتجات بالفعل.")
          : pick(`Loaded ${data.products ?? 0} products.`, `تم تحميل ${data.products ?? 0} منتج.`),
      );
      await reloadAll();
    } finally {
      setBusy(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    const payload = {
      ...form,
      image: formatImageUrl(form.image),
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock) || 0,
    };

    try {
      const res = await fetch(
        editing ? `/api/products/${editing}` : "/api/products",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setMessage(data.error ?? pick("Could not save product.", "لم يتم حفظ المنتج."));
        return;
      }

      setMessage(pick("Product saved successfully.", "تم حفظ المنتج بنجاح."));
      setEditing(null);
      setForm(EMPTY_FORM);
      await reloadAll();
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (product: ProductDTO) => {
    setEditing(product.slug);
    setForm({
      slug: product.slug,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      descriptionEn: product.descriptionEn,
      descriptionAr: product.descriptionAr,
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
      categorySlug: product.categorySlug,
      image: product.image,
      badgeEn: product.badgeEn ?? "",
      badgeAr: product.badgeAr ?? "",
      stock: String(product.stock),
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      amazonUrl: product.amazonUrl ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (slug: string) => {
    if (!window.confirm(pick("Delete this product?", "هل تريد حذف هذا المنتج؟"))) return;
    setBusy(true);
    await fetch(`/api/products/${slug}`, { method: "DELETE" });
    await reloadAll();
    setBusy(false);
  };

  const toggleFeatured = async (product: ProductDTO) => {
    await fetch(`/api/products/${product.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !product.isFeatured }),
    });
    await reloadAll();
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatBusy(true);
    setCatMessage(null);
    try {
      const payload = {
        ...catForm,
        image: formatImageUrl(catForm.image),
        sortOrder: Number(catForm.sortOrder),
      };
      const url = catForm.slug ? `/api/categories?slug=${catForm.slug}` : `/api/categories`;
      const method = catForm.slug ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setCatMessage(data.error ?? "Error");
      } else {
        setCatMessage(pick("Category saved successfully.", "تم حفظ القسم بنجاح."));
        setCatForm({
          slug: "",
          nameEn: "",
          nameAr: "",
          descriptionEn: "",
          descriptionAr: "",
          image: "",
          size: "normal",
          sortOrder: "99",
          link: "",
        });
        await reloadAll();
      }
    } finally {
      setCatBusy(false);
    }
  };

  const stats = [
    {
      icon: Package,
      label: pick("Products", "المنتجات"),
      value: String(products.length),
      tone: "from-sky-500 to-cyan-500",
    },
    {
      icon: LayoutGrid,
      label: pick("Categories", "الأقسام"),
      value: String(categories.length),
      tone: "from-indigo-500 to-violet-500",
    },
    
    
  ];

  const field =
    "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10";
  const label =
    "mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500";

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-sky-700">
            <BadgeCheck className="h-3.5 w-3.5" />
            {pick("System Admin", "إدارة النظام")}
          </span>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
            {pick("Store Control Panel", "لوحة تحكم المتجر")}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
            {pick(
              "Manage catalogue products, categories and store activity seamlessly with live cloud updates.",
              "إدارة منتجات الكتالوج، الأقسام، ونشاط المتجر بسلاسة مع التحديث المباشر للبيانات.",
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          

          <Link
            href="/products"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-2.5 text-xs font-extrabold text-white transition-all hover:bg-sky-600 shadow-sm"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {pick("Live Store", "عرض المتجر")}
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-md",
                  stat.tone,
                )}
              >
                <stat.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 font-display text-2xl font-extrabold text-slate-950">
              {stat.value}
            </p>
            <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {message ? (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm font-bold text-emerald-800 shadow-sm"
        >
          {message}
        </motion.div>
      ) : null}

      {/* Product Form & Product Table */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Product Form */}
        <form
          onSubmit={submit}
          className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-5 lg:sticky lg:top-28"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-950">
              {editing ? <Pencil className="h-4 w-4 text-sky-500" /> : <Plus className="h-4 w-4 text-sky-500" />}
              {editing ? pick("Edit Product", "تعديل المنتج") : pick("Add Product", "إضافة منتج جديد")}
            </h2>
            {editing ? (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm(EMPTY_FORM);
                }}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3.5">
            <div className="col-span-2 sm:col-span-1">
              <label className={label} htmlFor="nameEn">
                {pick("Name (EN)", "الاسم (إنجليزي)")}
              </label>
              <input
                id="nameEn"
                required
                value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                className={field}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className={label} htmlFor="nameAr">
                {pick("Name (AR)", "الاسم (عربي)")}
              </label>
              <input
                id="nameAr"
                required
                dir="rtl"
                value={form.nameAr}
                onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                className={field}
              />
            </div>

            <div className="col-span-2">
              <label className={label} htmlFor="descEn">
                {pick("Description (EN)", "الوصف (إنجليزي)")}
              </label>
              <textarea
                id="descEn"
                rows={2}
                value={form.descriptionEn}
                onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                className={cn(field, "resize-none")}
              />
            </div>

            <div className="col-span-2">
              <label className={label} htmlFor="descAr">
                {pick("Description (AR)", "الوصف (عربي)")}
              </label>
              <textarea
                id="descAr"
                rows={2}
                dir="rtl"
                value={form.descriptionAr}
                onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                className={cn(field, "resize-none")}
              />
            </div>

            <div>
              <label className={label} htmlFor="price">
                {pick("Price", "السعر")}
              </label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="compareAt">
                {pick("Compare at", "قبل الخصم")}
              </label>
              <input
                id="compareAt"
                type="number"
                min="0"
                step="0.01"
                value={form.compareAtPrice}
                onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
                className={field}
              />
            </div>

            <div>
              <label className={label} htmlFor="category">
                {pick("Category", "القسم")}
              </label>
              <select
                id="category"
                value={form.categorySlug}
                onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
                className={field}
              >
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {isArabic ? category.nameAr : category.nameEn}
                  </option>
                ))}
              </select>
            </div>
            

            <div className="col-span-2">
              <label className={label} htmlFor="image">
                {pick("Image URL", "مسار / رابط الصورة")}
              </label>
              <input
                id="image"
                list="image-options"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className={field}
              />
              <datalist id="image-options">
                {IMAGE_OPTIONS.map((image) => (
                  <option key={image} value={image} />
                ))}
              </datalist>
            </div>

            <div className="col-span-2">
              <label className={label} htmlFor="amazonUrl">
                {pick("Amazon URL", "رابط أمازون")}
              </label>
              <input
                id="amazonUrl"
                value={form.amazonUrl}
                onChange={(e) => setForm({ ...form, amazonUrl: e.target.value })}
                className={field}
              />
            </div>

            <div>
              <label className={label} htmlFor="badgeEn">
                {pick("Badge (EN)", "الشارة ( etc: new , unique إنجليزي)")}
              </label>
              <input
                id="badgeEn"
                value={form.badgeEn}
                onChange={(e) => setForm({ ...form, badgeEn: e.target.value })}
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="badgeAr">
                {pick("Badge (AR)", "الشارة ( عربي مثل : جديد, مميز )")}
              </label>
              <input
                id="badgeAr"
                dir="rtl"
                value={form.badgeAr}
                onChange={(e) => setForm({ ...form, badgeAr: e.target.value })}
                className={field}
              />
            </div>

            <label className="col-span-2 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="h-4 w-4 accent-sky-600 rounded"
              />
              <span className="text-xs font-bold text-slate-700">
                {pick("Featured on homepage", "منتج مميز في الرئيسية")}
              </span>
            </label>

            <label className="col-span-2 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="h-4 w-4 accent-sky-600 rounded"
              />
              <span className="text-xs font-bold text-slate-700">
                {pick("Visible in store", "ظاهر في المتجر")}
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-extrabold text-white transition-all hover:bg-sky-600 shadow-sm disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {pick("Save Product", "حفظ المنتج")}
          </button>
        </form>

        {/* Product Table */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between bg-slate-50/30">
              <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-950">
                <Package className="h-4 w-4 text-sky-500" />
                {pick("Products Catalogue", "قائمة المنتجات")}
                <span className="rounded-full bg-slate-200/60 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                  {products.length}
                </span>
              </h2>

              <input
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder={pick("Filter products…", "ابحث في المنتجات…")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 sm:w-56"
              />
            </div>

            <div className="divide-y divide-slate-100">
              {visible.length === 0 ? (
                <p className="px-5 py-12 text-center text-sm font-semibold text-slate-400">
                  {pick("No products found.", "لا توجد منتجات حالياً.")}
                </p>
              ) : (
                visible.map((product) => (
                  <div
                    key={product.slug}
                    className="flex items-center gap-3.5 p-4 transition-colors hover:bg-slate-50/80"
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/60">
                      <Image
                        src={formatImageUrl(product.image)}
                        alt={product.nameAr || product.nameEn}
                        fill
                        sizes="56px"
                        className="object-cover"
                        unoptimized
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="block truncate text-sm font-extrabold text-slate-950 hover:text-sky-600 transition-colors"
                      >
                        {isArabic ? product.nameAr : product.nameEn}
                      </Link>
                      <span className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-400">
                        <span className="text-slate-700 font-extrabold">{formatPrice(product.price, lang)}</span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">
                          {product.categorySlug}
                        </span>
                        <span>{product.stock} {pick("in stock", "في المخزون")}</span>
                        {!product.isActive ? (
                          <span className="rounded-md bg-rose-50 px-2 py-0.5 text-rose-600 font-extrabold">
                            {pick("Hidden", "مخفي")}
                          </span>
                        ) : null}
                      </span>
                    </span>

                    <span className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(product)}
                        title={pick("Toggle Featured", "تمييز المنتج")}
                        className={cn(
                          "grid h-9 w-9 place-items-center rounded-xl transition-colors",
                          product.isFeatured
                            ? "bg-amber-50 text-amber-500 border border-amber-200/60"
                            : "text-slate-300 hover:bg-slate-100 hover:text-amber-500",
                        )}
                      >
                        <Star className={cn("h-4 w-4", product.isFeatured && "fill-current")} />
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        title={pick("Edit", "تعديل")}
                        className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {product.amazonUrl ? (
                        <a
                          href={product.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Amazon Link"
                          className="grid h-9 w-9 place-items-center rounded-xl text-amber-600 hover:bg-amber-50 transition-colors font-extrabold text-[10px]"
                        >
                          AMZ
                        </a>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => remove(product.slug)}
                        title={pick("Delete", "حذف")}
                        className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          
        </div>
      </div>

      {/* Categories Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-5 sm:p-6 bg-slate-50/30 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-950">
              <LayoutGrid className="h-5 w-5 text-sky-500" />
              {pick("Categories Management", "إدارة الأقسام")}
              <span className="rounded-full bg-slate-200/60 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                {categories.length}
              </span>
            </h2>
          </div>
        </div>

        {/* Category Form */}
        <form onSubmit={handleCategorySubmit} className="p-6 border-b border-slate-100 bg-slate-50/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. اسم القسم بالإنجليزية */}
            <div>
              <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                {pick("Category Name (EN)", "اسم القسم (إنجليزي) - يظهر كعنوان رئيسي")}
              </label>
              <input
                value={catForm.nameEn}
                onChange={(e) => setCatForm({ ...catForm, nameEn: e.target.value })}
                placeholder={pick("e.g. Bathroom", "مثال: Bathroom")}
                className={field}
                required
              />
            </div>

            {/* 2. اسم القسم بالعربية */}
            <div>
              <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                {pick("Category Name (AR)", "اسم القسم (عربي) - يظهر للعملاء بالعربي")}
              </label>
              <input
                value={catForm.nameAr}
                onChange={(e) => setCatForm({ ...catForm, nameAr: e.target.value })}
                placeholder={pick("e.g. مستلزمات الحمام", "مثال: مستلزمات الحمام")}
                dir="rtl"
                className={field}
                required
              />
            </div>

            {/* 3. رابط الصورة */}
            <div>
              <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                {pick("Image URL", "رابط الصورة (URL المباشر لصورة القسم)")}
              </label>
              <input
                value={catForm.image}
                onChange={(e) => setCatForm({ ...catForm, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className={field}
              />
            </div>

            {/* 4. الوصف بالإنجليزية */}
            <div>
              <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                {pick("Description (EN)", "الوصف المختصر (إنجليزي)")}
              </label>
              <input
                value={catForm.descriptionEn}
                onChange={(e) => setCatForm({ ...catForm, descriptionEn: e.target.value })}
                placeholder={pick("Short subtitle in EN", "وصف قصير بالإنجليزية")}
                className={field}
              />
            </div>

            {/* 5. الوصف بالعربية */}
            <div>
              <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                {pick("Description (AR)", "الوصف المختصر (عربي) - يظهر تحت العنوان")}
              </label>
              <input
                value={catForm.descriptionAr}
                onChange={(e) => setCatForm({ ...catForm, descriptionAr: e.target.value })}
                placeholder={pick("Short subtitle in AR", "وصف قصير بالعربية")}
                dir="rtl"
                className={field}
              />
            </div>

            {/* 6. حجم الكارد وترتيب العرض */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                  {pick("Grid Size", "حجم الكارد (Bento Grid)")}
                </label>
                <select
                  value={catForm.size}
                  onChange={(e) => setCatForm({ ...catForm, size: e.target.value as "normal" | "large" | "wide" })}
                  className={field}
                >
                  <option value="normal">Normal (عادي)</option>
                  <option value="large">Large (كبير)</option>
                  <option value="wide">Wide (عريض)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                  {pick("Sort Order", "الترتيب (الأرقام الأقل أولاً)")}
                </label>
                <input
                  value={catForm.sortOrder}
                  onChange={(e) => setCatForm({ ...catForm, sortOrder: e.target.value })}
                  placeholder="99"
                  className={field}
                />
              </div>
            </div>

          </div>

          <div className="mt-4 flex items-center justify-between">
            {catMessage ? <p className="text-xs font-bold text-emerald-600">{catMessage}</p> : <span />}
            <button
              type="submit"
              disabled={catBusy}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-2.5 text-xs font-extrabold text-white transition-all hover:bg-sky-600 disabled:opacity-60 shadow-sm"
            >
              {catBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : catForm.slug ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {catForm.slug ? pick("Update Category", "تحديث القسم") : pick("Save Category", "حفظ القسم")}
            </button>
          </div>
        </form>

        {/* Categories List */}
        <div className="divide-y divide-slate-100">
          {categories.map((cat) => (
            <div key={cat.slug} className="flex items-center gap-3.5 p-4 transition-colors hover:bg-slate-50/80">
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/60">
                <Image
                  src={formatImageUrl(cat.image)}
                  alt={cat.nameAr || cat.nameEn}
                  fill
                  sizes="48px"
                  className="object-cover"
                  unoptimized
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-slate-950 truncate">{isArabic ? cat.nameAr : cat.nameEn}</p>
                <p className="text-xs text-slate-400 font-medium truncate">{cat.descriptionEn || cat.descriptionAr} • <span className="font-semibold text-slate-600">{cat.size}</span></p>
              </div>
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                #{cat.sortOrder}
              </span>
              <button
                type="button"
                onClick={() => {
                  setCatForm({
                    slug: cat.slug,
                    nameEn: cat.nameEn,
                    nameAr: cat.nameAr,
                    descriptionEn: cat.descriptionEn,
                    descriptionAr: cat.descriptionAr,
                    image: cat.image,
                    size: cat.size as "normal" | "large" | "wide",
                    sortOrder: String(cat.sortOrder),
                    link: (cat as any).link ?? "",
                  });
                  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                }}
                aria-label="Edit"
                className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm(pick("Delete category?", "هل تريد حذف هذا القسم؟"))) return;
                  setCatBusy(true);
                  await fetch(`/api/categories?slug=${cat.slug}`, { method: "DELETE" });
                  setCatBusy(false);
                  await reloadAll();
                }}
                aria-label="Delete"
                className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}