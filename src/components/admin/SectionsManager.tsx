"use client";

import { useState } from "react";
import type { Section } from "@/db/schema";
import { Plus, Edit2, Trash2, Layers, CheckCircle2, XCircle } from "lucide-react";

interface SectionsManagerProps {
  initialSections?: Section[];
}

export default function SectionsManager({ initialSections = [] }: SectionsManagerProps) {
  const [sectionsList, setSectionsList] = useState<Section[]>(initialSections);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    titleAr: "",
    titleEn: "",
    subtitleAr: "",
    subtitleEn: "",
    badgeAr: "",
    badgeEn: "",
    type: "featured_products",
    targetCategorySlug: "",
    imageUrl: "",
    sortOrder: 0,
    isActive: true,
  });

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/sections");
      const data = await res.json();
      if (Array.isArray(data)) setSectionsList(data);
    } catch (err) {
      console.error("Error fetching sections:", err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      titleAr: "",
      titleEn: "",
      subtitleAr: "",
      subtitleEn: "",
      badgeAr: "",
      badgeEn: "",
      type: "featured_products",
      targetCategorySlug: "",
      imageUrl: "",
      sortOrder: 0,
      isActive: true,
    });
  };

  const handleEdit = (sec: Section) => {
    setEditingId(sec.id);
    setFormData({
      titleAr: sec.titleAr,
      titleEn: sec.titleEn,
      subtitleAr: sec.subtitleAr || "",
      subtitleEn: sec.subtitleEn || "",
      badgeAr: sec.badgeAr || "",
      badgeEn: sec.badgeEn || "",
      type: sec.type,
      targetCategorySlug: sec.targetCategorySlug || "",
      imageUrl: sec.imageUrl || "",
      sortOrder: sec.sortOrder,
      isActive: sec.isActive,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const method = editingId ? "PUT" : "POST";
    const payload = editingId ? { ...formData, id: editingId } : formData;

    try {
      const res = await fetch("/api/sections", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        resetForm();
        await fetchSections();
      }
    } catch (err) {
      console.error("Error saving section:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت تأكد من حذف هذا السكشن؟")) return;
    try {
      const res = await fetch(`/api/sections?id=${id}`, { method: "DELETE" });
      if (res.ok) await fetchSections();
    } catch (err) {
      console.error("Error deleting section:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 dir-rtl">
      {/* القائمة اليسرى: عرض السكاشن الحالية بنفس ديزاين كروت المنتجات */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">سكاشن المتجر ({sectionsList.length})</h3>
          </div>
        </div>

        <div className="space-y-3">
          {sectionsList.map((sec) => (
            <div
              key={sec.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#f8fafc] border border-gray-100 hover:border-gray-200 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 shadow-sm">
                  {sec.sortOrder}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-gray-800">{sec.titleAr}</h4>
                    {sec.badgeAr && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {sec.badgeAr}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{sec.type} • {sec.titleEn}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${sec.isActive ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 bg-gray-100'}`}>
                  {sec.isActive ? "ظاهر" : "مخفي"}
                </span>
                <button
                  onClick={() => handleEdit(sec)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(sec.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* الجزء الأيمن: نموذج إضافة/تعديل السكشن المدمج نفس ديزاين "منتج جديد" */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-base">
            {editingId ? "تعديل سكشن" : "+ سكشن جديد"}
          </h3>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              إلغاء التعديل
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* الاسم بالإنجليزية والعربية */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">الاسم (إنجليزي)</label>
              <input
                type="text"
                required
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-black transition"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">الاسم (عربي)</label>
              <input
                type="text"
                required
                value={formData.titleAr}
                onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-black transition"
              />
            </div>
          </div>

          {/* الوصف بالعربية والإنجليزية */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">الوصف (إنجليزي)</label>
              <input
                type="text"
                value={formData.subtitleEn}
                onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-black transition"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">الوصف (عربي)</label>
              <input
                type="text"
                value={formData.subtitleAr}
                onChange={(e) => setFormData({ ...formData, subtitleAr: e.target.value })}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-black transition"
              />
            </div>
          </div>

          {/* نوع السكشن والترتيب */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">نوع السكشن</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-black transition"
              >
                <option value="featured_products">منتجات مميزة</option>
                <option value="category_grid">شبكة الأقسام</option>
                <option value="banner">بنر إعلاني</option>
                <option value="hero">واجهة الهيرو</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">الترتيب</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-black transition"
              />
            </div>
          </div>

          {/* الشارة بالإنجليزية والعربية */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">الشارة (إنجليزي)</label>
              <input
                type="text"
                value={formData.badgeEn}
                onChange={(e) => setFormData({ ...formData, badgeEn: e.target.value })}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-black transition"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">الشارة (عربي)</label>
              <input
                type="text"
                value={formData.badgeAr}
                onChange={(e) => setFormData({ ...formData, badgeAr: e.target.value })}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-black transition"
              />
            </div>
          </div>

          {/* Checkboxes بنفس نمط الصفحة */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded text-black focus:ring-black w-4 h-4"
              />
              ظاهر في المتجر
            </label>
          </div>

          {/* زر الحفظ بنفس اللون الأسود الممتد والشكل العريض */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-bold py-3 rounded-2xl hover:bg-gray-800 transition text-xs shadow-md mt-4"
          >
            {editingId ? "تحديث السكشن" : "حفظ السكشن"}
          </button>
        </form>
      </div>
    </div>
  );
}