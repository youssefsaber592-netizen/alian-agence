import {
  getCategories,
  getCategoryCounts,
  getFeaturedProducts,
} from "@/lib/data";
import { CategoriesSection, FeaturedProducts, PromoBanner } from "@/components/home/ShopSections";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { FinalCta, ReviewsSection, WhySection } from "@/components/home/StorySections";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, counts, featured] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
    getFeaturedProducts(8),
  ]);

  return (
    <main className="overflow-hidden bg-[#f6f8fb]">
      <HeroSection />
      <TrustBar />
      <CategoriesSection categories={categories} counts={counts} />
      <PromoBanner />
      <FeaturedProducts products={featured} />
      <WhySection />
      <ReviewsSection />
      <FinalCta />
    </main>
  );
}
