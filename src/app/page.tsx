import { db } from "@/db";
import { sections } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import {
  getCategories,
  getCategoryCounts,
  getFeaturedProducts,
} from "@/lib/data";
import {
  CategoriesSection,
  FeaturedProducts,
  PromoBanner,
} from "@/components/home/ShopSections";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import {
  FinalCta,
  ReviewsSection,
  WhySection,
} from "@/components/home/StorySections";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch data and dynamic sections in parallel
  const [categories, counts, featured, activeSections] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
    getFeaturedProducts(8),
    db
      .select()
      .from(sections)
      .where(eq(sections.isActive, true))
      .orderBy(asc(sections.sortOrder)),
  ]);

  // Fallback layout if no dynamic sections exist in database
  if (!activeSections || activeSections.length === 0) {
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

  return (
    <main className="overflow-hidden bg-[#f6f8fb]">
      {activeSections.map((sec) => {
        switch (sec.type) {
          case "hero":
            return (
              <div key={sec.id}>
                <HeroSection />
                <TrustBar />
              </div>
            );

          case "category_grid":
            return (
              <CategoriesSection
                key={sec.id}
                categories={categories}
                counts={counts}
              />
            );

          case "banner":
            return <PromoBanner key={sec.id} />;

          case "featured_products":
            return <FeaturedProducts key={sec.id} products={featured} />;

          case "why_us":
            return <WhySection key={sec.id} />;

          case "reviews":
            return <ReviewsSection key={sec.id} />;

          case "cta":
            return <FinalCta key={sec.id} />;

          default:
            return null;
        }
      })}
    </main>
  );
} 