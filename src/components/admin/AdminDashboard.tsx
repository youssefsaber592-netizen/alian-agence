"use client";

import { useState } from "react";
import {
  Package,
  Layers,
  Plus,
  Pencil,
  Trash2,
  Save,
  Loader2,
  ImageIcon,
  CheckCircle2,
  LayoutGrid,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

// Default home sections defined in HomePage fallback logic
const DEFAULT_HOMEPAGE_SECTIONS = [
  { id: 101, type: "hero", titleAr: "واجهة البداية (Hero & TrustBar)", subtitleAr: "الشعار وشريط الثقة الرئيسي", isActive: true },
  { id: 102, type: "category_grid", titleAr: "شبكة الأقسام (Categories)", subtitleAr: "أقسام المتجر الرئيسية (مستلزمات حمام، مطبخ، ديكورات...)", isActive: true },
  { id: 103, type: "banner", titleAr: "بانر العروض (Promo Banner)", subtitleAr: "بانر التخفيضات والإعلانات", isActive: true },
  { id: 104, type: "featured_products", titleAr: "المنتجات المميزة (Featured Products)", subtitleAr: "عرض أبرز المنتجات في المتجر", isActive: true },
  { id: 105, type: "why_us", titleAr: "لماذا تختارنا (Why Us)", subtitleAr: "مميزات الشراء والخدمة", isActive: true },
  { id: 106, type: "reviews", titleAr: "آراء العملاء (Reviews)", subtitleAr: "تقييمات وتجارب المشترين", isActive: true },
  { id: 107, type: "cta", titleAr: "الدعوة الأخيرة للشراء (Final CTA)", subtitleAr: "زر الإجراء النهائي أسفل الصفحة", isActive: true },
];

export function AdminDashboard({
  initialProducts = [],
  categories = [],
  initialOrders = [],
  initialSections = [],
}: {
  initialProducts: any[];
  categories: any[];
  initialOrders?: any[];
  initialSections: any[];
}) {
  // Active Tab state: "products" or "sections"
  const [activeTab, setActiveTab] = useState<"products" | "sections">("products");

  const [products, setProducts] = useState(initialProducts);

  // If DB sections are empty, automatically fallback to the active default homepage layout
  const [sections, setSections] = useState(
    initialSections && initialSections.length > 0
      ? initialSections
      : DEFAULT_HOMEPAGE_SECTIONS
  );

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Section Form state corresponding to HomePage switch-case types
  const emptySectionForm = {
    titleEn: "",
    titleAr: "",
    subtitleEn: "",
    subtitleAr: "",
    badgeEn: "",
    badgeAr: "",
    type: "featured_products",
    targetCategorySlug: "",
    imageUrl: "",
    sortOrder: 0,
    isActive: true,
  };

  const [sectionForm, setSectionForm] = useState(emptySectionForm);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);

  // Reusable Tailwind classes for form styling
  const field =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500";
  const label =
    "mb-1 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-400";

  // --- ACCURATE REAL-TIME ANALYTICS CALCULATIONS ---
  const totalProducts = products.length;
  const totalSections = sections.length;
  const totalOrders = initialOrders?.length || 0;

  // Calculate total revenue from actual orders
  const totalRevenue =
    initialOrders?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;

  // Calculate total inventory financial value based on (price * stock)
  const totalInventoryValue = products.reduce(
    (sum, prod) => sum + (Number(prod.price) || 0) * (Number(prod.stock) || 0),
    0
  );

  // Count products out of stock
  const outOfStockProducts = products.filter((p) => Number(p.stock) === 0).length;

  // Map section types to readable Arabic titles
  const getSectionTypeLabel = (type: string) => {
    switch (type) {
      case "hero":
        return "واجهة هيرو (Hero + TrustBar)";
      case "category_grid":
        return "شبكة الأقسام (Categories)";
      case "banner":
        return "بانر إعلاني (Promo Banner)";
      case "featured_products":
        return "منتجات مميزة (Featured Products)";
      case "why_us":
        return "لماذا نحن (Why Us)";
      case "reviews":
        return "آراء العملاء (Reviews)";
      case "cta":
        return "دعوة للتفاعل (Final CTA)";
      default:
        return type;
    }
  };

  // Handle section submission (Create / Update)
  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);

    try {
      const url = editingSectionId
        ? `/api/admin/sections/${editingSectionId}`
        : "/api/admin/sections";
      const method = editingSectionId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionForm),
      });

      if (res.ok) {
        const savedSection = await res.json();
        if (editingSectionId) {
          setSections((prev) =>
            prev.map((s) => (s.id === editingSectionId ? savedSection : s))
          );
          setMessage("تم تحديث السيكشن بنجاح ورؤيته متاحة الآن في الهوم!");
        } else {
          setSections((prev) => [...prev, savedSection]);
          setMessage("تم إضافة السيكشن بنجاح إلى الصفحة الرئيسية!");
        }
        setSectionForm(emptySectionForm);
        setEditingSectionId(null);
      }
    } catch {
      setMessage("حدث خطأ أثناء حفظ السيكشن.");
    } finally {
      setBusy(false);
    }
  };

  // Handle section deletion
  const handleDeleteSection = async (id: number) => {
    if (!confirm("هل أنت تأكد من حذف هذا السيكشن من الصفحة الرئيسية؟")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/sections/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSections((prev) => prev.filter((s) => s.id !== id));
        setMessage("تم حذف السيكشن بنجاح.");
      } else {
        // Optimistic delete UI update if using default static fallback
        setSections((prev) => prev.filter((s) => s.id !== id));
        setMessage("تم إزالة السيكشن من العرض.");
      }
    } catch {
      setMessage("فشل حذف السيكشن.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" dir="rtl">
      {/* =========================================================
          ANALYTICS & OVERVIEW SECTION
      ========================================================= */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 mb-8">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              إجمالي المبيعات
            </span>
            <div className="rounded-lg bg-emerald-50 p-1.5">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">
            {totalRevenue.toLocaleString()}{" "}
            <span className="text-xs font-bold text-slate-400">ج.م</span>
          </p>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              عدد الطلبات
            </span>
            <div className="rounded-lg bg-blue-50 p-1.5">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">
            {totalOrders} <span className="text-xs font-bold text-slate-400">طلب</span>
          </p>
        </div>

        {/* Total Products */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-sky-600 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              إجمالي المنتجات
            </span>
            <div className="rounded-lg bg-sky-50 p-1.5">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">
            {totalProducts}{" "}
            <span className="text-xs font-bold text-slate-400">منتج</span>
          </p>
        </div>

        {/* Total Sections (Syncs accurately with default fallback or DB sections) */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-purple-600 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              السكاشن النشطة
            </span>
            <div className="rounded-lg bg-purple-50 p-1.5">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">
            {totalSections}{" "}
            <span className="text-xs font-bold text-slate-400">سيكشن</span>
          </p>
        </div>

        {/* Inventory Total Value */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              قيمة البضاعة
            </span>
            <div className="rounded-lg bg-amber-50 p-1.5">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">
            {totalInventoryValue.toLocaleString()}{" "}
            <span className="text-xs font-bold text-slate-400">ج.م</span>
          </p>
        </div>

        {/* Out Of Stock Count */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              منتجات نفدت
            </span>
            <div className="rounded-lg bg-rose-50 p-1.5">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">
            {outOfStockProducts}{" "}
            <span className="text-xs font-bold text-slate-400">منتج</span>
          </p>
        </div>
      </div>

      {/* =========================================================
          HEADER & NAVIGATION TABS
      ========================================================= */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-950">لوحة تحكم المتجر</h1>
          <p className="mt-1 text-xs font-bold text-slate-500">
            إدارة كاملة للمنتجات وسكاشن الصفحة الرئيسية مع تزامن فوري في الموقع.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${
              activeTab === "products"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Package className="h-4 w-4" />
            إدارة المنتجات ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("sections")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${
              activeTab === "sections"
                ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Layers className="h-4 w-4" />
            إدارة سكاشن الهوم ({sections.length})
          </button>
        </div>
      </div>

      {/* Status Notification */}
      {message && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </div>
      )}

      {/* =========================================================
          TAB 1: PRODUCTS MANAGEMENT
      ========================================================= */}
      {activeTab === "products" && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Products List */}
          <div className="lg:col-span-7">
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-extrabold text-slate-900 mb-4">
                المنتجات الحالية ({products.length})
              </h2>
              <div className="space-y-3">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 p-3 hover:border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt=""
                        className="h-12 w-12 rounded-xl object-cover bg-slate-50"
                      />
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">
                          {prod.nameAr}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400">
                          {prod.price} ج.م | المخزون: {prod.stock}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Product Placeholder */}
          <div className="lg:col-span-5">
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4 text-sky-500" /> منتج جديد
              </h2>
              <p className="text-xs text-slate-400 font-bold">
                فورمة إضافة وتعديل المنتجات...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: SECTIONS MANAGEMENT
      ========================================================= */}
      {activeTab === "sections" && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Active Sections List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-purple-600" /> سكاشن الهوم المعروضة حالياً
                </h2>
                <span className="rounded-full bg-purple-50 px-3 py-1 text-[11px] font-extrabold text-purple-700">
                  {sections.length} سكاشن نشطة
                </span>
              </div>

              <div className="space-y-3">
                {sections.map((sec) => (
                  <div
                    key={sec.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4 hover:border-purple-200 transition-colors bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded-xl bg-slate-100 flex-shrink-0">
                        {sec.imageUrl ? (
                          <img
                            src={sec.imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-300">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-extrabold text-slate-900">
                            {sec.titleAr || getSectionTypeLabel(sec.type)}
                          </h3>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold text-slate-600">
                            {getSectionTypeLabel(sec.type)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] font-bold text-slate-400 line-clamp-1">
                          {sec.subtitleAr || "سيكشن ديناميكي معروض في الصفحة الرئيسية"}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setEditingSectionId(sec.id);
                          setSectionForm({
                            titleEn: sec.titleEn || "",
                            titleAr: sec.titleAr || "",
                            subtitleEn: sec.subtitleEn || "",
                            subtitleAr: sec.subtitleAr || "",
                            badgeEn: sec.badgeEn || "",
                            badgeAr: sec.badgeAr || "",
                            type: sec.type || "featured_products",
                            targetCategorySlug: sec.targetCategorySlug || "",
                            imageUrl: sec.imageUrl || "",
                            sortOrder: sec.sortOrder || 0,
                            isActive: sec.isActive ?? true,
                          });
                        }}
                        className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 hover:bg-purple-50 hover:text-purple-600"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(sec.id)}
                        className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* New / Edit Section Form Card */}
          <div className="lg:col-span-5">
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Plus className="h-4 w-4 text-purple-600" />
                  {editingSectionId ? "تعديل السيكشن" : "إضافة سيكشن جديد للهوم"}
                </h2>
                {editingSectionId && (
                  <button
                    onClick={() => {
                      setEditingSectionId(null);
                      setSectionForm(emptySectionForm);
                    }}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-600"
                  >
                    إلغاء
                  </button>
                )}
              </div>

              <form onSubmit={handleSectionSubmit} className="space-y-3.5">
                {/* Section Type selection matching HomePage switch-case */}
                <div>
                  <label className={label}>نوع السيكشن في الهوم</label>
                  <select
                    value={sectionForm.type}
                    onChange={(e) =>
                      setSectionForm({ ...sectionForm, type: e.target.value })
                    }
                    className={field}
                  >
                    <option value="featured_products">منتجات مميزة (Featured Products)</option>
                    <option value="hero">واجهة هيرو (Hero + TrustBar)</option>
                    <option value="category_grid">شبكة الأقسام (Category Grid)</option>
                    <option value="banner">بانر إعلاني (Promo Banner)</option>
                    <option value="why_us">لماذا نحن (Why Us)</option>
                    <option value="reviews">آراء العملاء (Reviews)</option>
                    <option value="cta">دعوة للتفاعل (Final CTA)</option>
                  </select>
                </div>

                {/* Section Titles */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className={label}>العنوان (إنجليزي)</label>
                    <input
                      value={sectionForm.titleEn}
                      onChange={(e) =>
                        setSectionForm({ ...sectionForm, titleEn: e.target.value })
                      }
                      placeholder="e.g. Featured Products"
                      className={field}
                    />
                  </div>
                  <div>
                    <label className={label}>العنوان (عربي)</label>
                    <input
                      value={sectionForm.titleAr}
                      onChange={(e) =>
                        setSectionForm({ ...sectionForm, titleAr: e.target.value })
                      }
                      placeholder="مثال: مستلزمات الحمام"
                      className={field}
                    />
                  </div>
                </div>

                {/* Subtitles */}
                <div>
                  <label className={label}>الوصف الفرعي (عربي)</label>
                  <input
                    value={sectionForm.subtitleAr}
                    onChange={(e) =>
                      setSectionForm({ ...sectionForm, subtitleAr: e.target.value })
                    }
                    placeholder="وصف مختصر يظهر مع السيكشن"
                    className={field}
                  />
                </div>

                {/* Category Link (Optional) */}
                <div>
                  <label className={label}>ربط بقسم معين (اختياري)</label>
                  <select
                    value={sectionForm.targetCategorySlug}
                    onChange={(e) =>
                      setSectionForm({
                        ...sectionForm,
                        targetCategorySlug: e.target.value,
                      })
                    }
                    className={field}
                  >
                    <option value="">جميع الأقسام / عام</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cover Image URL */}
                <div>
                  <label className={label}>صورة الغلاف (Image URL)</label>
                  <input
                    value={sectionForm.imageUrl}
                    onChange={(e) =>
                      setSectionForm({ ...sectionForm, imageUrl: e.target.value })
                    }
                    placeholder="images/sections/bathroom.jpg"
                    className={field}
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {editingSectionId ? "حفظ التعديلات" : "إضافة السيكشن للهوم"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}