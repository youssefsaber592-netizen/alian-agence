import type { Metadata } from "next";
import { getCategories, getCategoryCounts, getProducts } from "@/lib/data";
import { ShopView } from "@/components/shop/ShopView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop all products",
  description:
    "Browse the full ALIAN STORE catalogue — holders, accessories, bathroom sets, kitchen tools, tissue boxes and modern décor.",
};

type PageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    q?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const [products, categories, counts] = await Promise.all([
    getProducts({
      category: params.category ?? null,
      sort: (params.sort as "featured" | "priceAsc" | "priceDesc" | "rating" | "newest") ?? "featured",
      search: params.q ?? null,
    }),
    getCategories(),
    getCategoryCounts(),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f8fb] pt-28 sm:pt-32">
      <ShopView
        products={products}
        categories={categories}
        counts={counts}
        activeCategory={params.category ?? "all"}
        activeSort={params.sort ?? "featured"}
        query={params.q ?? ""}
      />
    </main>
  );
}
