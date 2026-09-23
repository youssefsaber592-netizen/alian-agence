import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data";
import { ProductDetailView } from "@/components/shop/ProductDetail";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.nameEn,
    description: product.descriptionEn,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [category, related] = await Promise.all([
    getCategoryBySlug(product.categorySlug),
    getRelatedProducts(slug, product.categorySlug, 4),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f8fb] pt-28 sm:pt-32">
      <ProductDetailView
        key={product.slug}
        product={product}
        category={category}
        related={related}
      />
    </main>
  );
}
