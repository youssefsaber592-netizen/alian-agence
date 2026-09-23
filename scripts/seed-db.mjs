/**
 * One-off database seeding helper.
 *
 * Loads the demo catalogue and sections straight into PostgreSQL
 * using the `pg` driver (no build step required):
 *
 *   node --experimental-strip-types scripts/seed-db.mjs
 *
 * The running app also exposes the same logic through POST /api/admin/seed.
 */
import dotenv from 'dotenv';
dotenv.config();
import pg from "pg";

const { seedCategories, seedProducts } = await import(
  "../src/lib/seed-data.ts"
);

// Initial seed data for homepage sections
const seedSections = [
  {
    titleEn: "Main Hero Showcase",
    titleAr: "الواجهة الرئيسية للمتجر",
    subtitleEn: "Discover our latest home and kitchen essentials",
    subtitleAr: "اكتشف أحدث مستلزمات المنزل والمطبخ العصري",
    badgeEn: "NEW COLLECTION",
    badgeAr: "تشكيلة جديدة",
    type: "hero",
    targetCategorySlug: null,
    imageUrl: null,
    sortOrder: 1,
    isActive: true,
  },
  {
    titleEn: "Explore Categories",
    titleAr: "تسوق حسب القسم",
    subtitleEn: "Find products for every room",
    subtitleAr: "أدوات ومستلزمات متخصصة لكل ركن في المنزل",
    badgeEn: "CATEGORIES",
    badgeAr: "الأقسام",
    type: "category_grid",
    targetCategorySlug: null,
    imageUrl: null,
    sortOrder: 2,
    isActive: true,
  },
  {
    titleEn: "Promo Banner",
    titleAr: "عروض خاصة",
    subtitleEn: "Exclusive deals on selected items",
    subtitleAr: "خصومات حصرية على منتجات مختارة",
    badgeEn: "PROMO",
    badgeAr: "عرض خاص",
    type: "banner",
    targetCategorySlug: null,
    imageUrl: null,
    sortOrder: 3,
    isActive: true,
  },
  {
    titleEn: "Featured Products",
    titleAr: "المنتجات الأكثر طلباً",
    subtitleEn: "Top picked items this week",
    subtitleAr: "المنتجات الأعلى تقييماً من عملائنا",
    badgeEn: "HOT DEALS",
    badgeAr: "🔥 الأكثر مبيعاً",
    type: "featured_products",
    targetCategorySlug: null,
    imageUrl: null,
    sortOrder: 4,
    isActive: true,
  },
  {
    titleEn: "Why Choose Us",
    titleAr: "لماذا نحن",
    subtitleEn: "Quality and trust guaranteed",
    subtitleAr: "الجودة والضمان في مكان واحد",
    badgeEn: "TRUST",
    badgeAr: "ثقة وثبات",
    type: "why_us",
    targetCategorySlug: null,
    imageUrl: null,
    sortOrder: 5,
    isActive: true,
  },
  {
    titleEn: "Customer Reviews",
    titleAr: "آراء العملاء",
    subtitleEn: "What our shoppers say about us",
    subtitleAr: "تقييمات وتجارب عملائنا الحقيقيين",
    badgeEn: "REVIEWS",
    badgeAr: "تقييمات",
    type: "reviews",
    targetCategorySlug: null,
    imageUrl: null,
    sortOrder: 6,
    isActive: true,
  },
  {
    titleEn: "Final Call to Action",
    titleAr: "انضم إلينا الآن",
    subtitleEn: "Stay updated with our newsletter",
    subtitleAr: "اشترك معنا للحصول على أحدث العروض",
    badgeEn: "JOIN US",
    badgeAr: "اشترك الان",
    type: "cta",
    targetCategorySlug: null,
    imageUrl: null,
    sortOrder: 7,
    isActive: true,
  },
];

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

const pool = new pg.Pool({ connectionString });
const client = await pool.connect();

try {
  await client.query("begin");
  await client.query("delete from order_items");
  await client.query("delete from orders");
  await client.query("delete from products");
  await client.query("delete from categories");
  await client.query("delete from sections");

  for (const category of seedCategories) {
    await client.query(
      `insert into categories
         (slug, name_en, name_ar, description_en, description_ar, image, size, sort_order)
       values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        category.slug,
        category.nameEn,
        category.nameAr,
        category.descriptionEn,
        category.descriptionAr,
        category.image,
        category.size,
        category.sortOrder,
      ],
    );
  }

  for (const product of seedProducts) {
    await client.query(
      `insert into products
         (slug, name_en, name_ar, description_en, description_ar, price, compare_at_price,
          image, gallery, category_slug, badge_en, badge_ar, rating, reviews_count,
          stock, is_featured, is_active, amazon_url)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
      [
        product.slug,
        product.nameEn,
        product.nameAr,
        product.descriptionEn,
        product.descriptionAr,
        product.price,
        product.compareAtPrice,
        product.image,
        [product.image],
        product.categorySlug,
        product.badgeEn,
        product.badgeAr,
        product.rating,
        product.reviewsCount,
        product.stock,
        product.isFeatured,
        true,
        product.amazonUrl,
      ],
    );
  }

  for (const section of seedSections) {
    await client.query(
      `insert into sections
         (title_en, title_ar, subtitle_en, subtitle_ar, badge_en, badge_ar,
          type, target_category_slug, image_url, sort_order, is_active)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        section.titleEn,
        section.titleAr,
        section.subtitleEn,
        section.subtitleAr,
        section.badgeEn,
        section.badgeAr,
        section.type,
        section.targetCategorySlug,
        section.imageUrl,
        section.sortOrder,
        section.isActive,
      ],
    );
  }

  await client.query("commit");

  const categoriesCount = await client.query("select count(*)::int as n from categories");
  const productsCount = await client.query("select count(*)::int as n from products");
  const sectionsCount = await client.query("select count(*)::int as n from sections");

  console.log(
    `Seeded ${categoriesCount.rows[0].n} categories, ${productsCount.rows[0].n} products, and ${sectionsCount.rows[0].n} homepage sections.`,
  );
} catch (error) {
  await client.query("rollback");
  console.error(error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}