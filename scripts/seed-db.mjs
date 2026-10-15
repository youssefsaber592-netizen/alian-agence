/**
 * One-off database seeding helper.
 *
 * Loads the demo catalogue from `src/lib/seed-data.ts` straight into PostgreSQL
 * using the `pg` driver (no build step required):
 *
 *   node --experimental-strip-types scripts/seed-db.mjs
 *
 * The running app also exposes the same logic through POST /api/admin/seed.
 */

import pg from "pg";

const { seedCategories, seedProducts } = await import(
  "../src/lib/seed-data.ts"
);

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

  await client.query("commit");

  const categories = await client.query("select count(*)::int as n from categories");
  const products = await client.query("select count(*)::int as n from products");

  console.log(
    `Seeded ${categories.rows[0].n} categories and ${products.rows[0].n} products.`,
  );
} catch (error) {
  await client.query("rollback");
  console.error(error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
