import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, PackageOpen } from "lucide-react";
import {
  getCategories,
  getCategoryBySlug,
  getCategoryCounts,
  getProducts,
} from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return { title: category.nameEn, description: category.descriptionEn };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [category, products, categories, counts] = await Promise.all([
    getCategoryBySlug(slug),
    getProducts({ category: slug, sort: "featured" }),
    getCategories(),
    getCategoryCounts(),
  ]);

  if (!category) notFound();

  const isLarge = category.size === "large" || category.size === "wide";

  return (
    <main className="min-h-screen bg-[#f6f8fb] pt-28 sm:pt-32">
      {/* banner */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-ink-950">
          <Image
            src={category.image}
            alt={category.nameEn}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/30" />
          <div className="pointer-events-none absolute inset-0 mesh-glow opacity-60" />

          <div className="relative px-6 py-14 sm:px-10 lg:px-14 lg:py-16">
            <nav className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
              <Link href="/" className="transition-colors hover:text-sky-300">
                Home
              </Link>
              <span>/</span>
              <Link href="/products" className="transition-colors hover:text-sky-300">
                Shop
              </Link>
              <span>/</span>
              <span className="text-white">{category.nameEn}</span>
            </nav>

            <div className="mt-6 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-sky-300 backdrop-blur-md">
                <ArrowRight className="h-3.5 w-3.5" />
                {counts[category.slug] ?? 0} items
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-[42px]">
                {category.nameEn}
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-[15px]">
                {category.descriptionEn}
              </p>

              <p dir="rtl" className="mt-4 font-body-ar text-sm leading-7 text-slate-400">
                {category.nameAr} — {category.descriptionAr}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* category switcher */}
      <section className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => {
            const active = item.slug === category.slug;
            return (
              <Link
                key={item.slug}
                href={`/category/${item.slug}`}
                className={
                  active
                    ? "shrink-0 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-extrabold text-white"
                    : "shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 transition-colors hover:border-sky-300 hover:text-sky-700"
                }
              >
                {item.nameEn}
              </Link>
            );
          })}
        </div>
      </section>

      {/* products */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {products.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-200 bg-white px-6 py-20 text-center">
            <PackageOpen className="mx-auto h-10 w-10 text-slate-300" />
            <h2 className="mt-4 text-lg font-extrabold text-slate-900">
              {category.nameEn} is being restocked
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {category.descriptionEn}
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-extrabold text-white"
            >
              Browse all products
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div
            className={
              isLarge
                ? "grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6"
                : "grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6"
            }
          >
            {products.map((product, index) => (
              <ProductCard
                key={product.slug}
                product={product}
                index={index}
                priority={index < 4}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
