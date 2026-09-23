import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  orderItems,
  orders,
  products,
  subscribers,
} from "@/db/schema";
import { seedCategories, seedProducts, type SeedProduct } from "./seed-data";
import type { CategoryDTO, ProductDTO } from "./types";

/* =========================================================
   MAPPERS
========================================================= */

export function toCategoryDTO(row: typeof categories.$inferSelect): CategoryDTO {
  return {
    id: row.id,
    slug: row.slug,
    nameEn: row.nameEn,
    nameAr: row.nameAr,
    descriptionEn: row.descriptionEn,
    descriptionAr: row.descriptionAr,
    image: row.image,
    size:
      row.size === "large" || row.size === "wide" ? row.size : "normal",
    sortOrder: row.sortOrder,
  };
}

export function toProductDTO(row: typeof products.$inferSelect): ProductDTO {
  return {
    id: row.id,
    slug: row.slug,
    nameEn: row.nameEn,
    nameAr: row.nameAr,
    descriptionEn: row.descriptionEn,
    descriptionAr: row.descriptionAr,
    price: Number(row.price),
    compareAtPrice:
      row.compareAtPrice === null ? null : Number(row.compareAtPrice),
    image: row.image,
    gallery: row.gallery ?? [],
    amazonUrl: row.amazonUrl ?? "",
    categorySlug: row.categorySlug,
    badgeEn: row.badgeEn,
    badgeAr: row.badgeAr,
    rating: Number(row.rating),
    reviewsCount: row.reviewsCount,
    stock: row.stock,
    isFeatured: row.isFeatured,
    isActive: row.isActive,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : String(row.createdAt),
  };
}

/* =========================================================
   CATEGORIES
========================================================= */

export async function getCategories(): Promise<CategoryDTO[]> {
  const rows = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.id));
  return rows.map(toCategoryDTO);
}

export async function getCategoryBySlug(
  slug: string,
): Promise<CategoryDTO | null> {
  const [row] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return row ? toCategoryDTO(row) : null;
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({
      slug: products.categorySlug,
      count: sql<number>`count(*)::int`,
    })
    .from(products)
    .where(eq(products.isActive, true))
    .groupBy(products.categorySlug);

  return rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.slug] = row.count;
    return acc;
  }, {});
}

/* =========================================================
   PRODUCTS
========================================================= */

export type ProductQuery = {
  category?: string | null;
  search?: string | null;
  featured?: boolean;
  sort?: "featured" | "priceAsc" | "priceDesc" | "rating" | "newest";
  limit?: number;
};

export async function getProducts(
  query: ProductQuery = {},
): Promise<ProductDTO[]> {
  const conditions = [eq(products.isActive, true)];

  if (query.category && query.category !== "all") {
    conditions.push(eq(products.categorySlug, query.category));
  }

  if (query.featured) {
    conditions.push(eq(products.isFeatured, true));
  }

  if (query.search && query.search.trim().length > 0) {
    const term = `%${query.search.trim()}%`;
    conditions.push(
      or(
        ilike(products.nameEn, term),
        ilike(products.nameAr, term),
        ilike(products.descriptionEn, term),
        ilike(products.descriptionAr, term),
        ilike(products.categorySlug, term),
      )!,
    );
  }

  const orderBy = {
    featured: [desc(products.isFeatured), desc(products.createdAt)],
    priceAsc: [asc(products.price)],
    priceDesc: [desc(products.price)],
    rating: [desc(products.rating), desc(products.reviewsCount)],
    newest: [desc(products.createdAt)],
  }[query.sort ?? "featured"];

  let q = db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(...orderBy)
    .$dynamic();

  if (query.limit) q = q.limit(query.limit);

  const rows = await q;
  return rows.map(toProductDTO);
}

export async function getFeaturedProducts(
  limit = 8,
): Promise<ProductDTO[]> {
  return getProducts({ featured: true, limit });
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDTO | null> {
  const [row] = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);
  return row ? toProductDTO(row) : null;
}

export async function getRelatedProducts(
  slug: string,
  categorySlug: string,
  limit = 4,
): Promise<ProductDTO[]> {
  const rows = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        eq(products.categorySlug, categorySlug),
        sql`${products.slug} <> ${slug}`,
      ),
    )
    .orderBy(desc(products.isFeatured), desc(products.rating))
    .limit(limit);

  return rows.map(toProductDTO);
}

export async function getBestSellers(limit = 4): Promise<ProductDTO[]> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(desc(products.reviewsCount), desc(products.rating))
    .limit(limit);

  return rows.map(toProductDTO);
}

/* =========================================================
   SEEDING
========================================================= */

export async function seedCatalogue() {
  const existingCategories = await db
    .select({ id: categories.id })
    .from(categories)
    .limit(1);

  if (existingCategories.length === 0) {
    await db.insert(categories).values(seedCategories);
  }

  const existingProducts = await db
    .select({ id: products.id })
    .from(products)
    .limit(1);

  if (existingProducts.length > 0) {
    return { categories: seedCategories.length, products: 0, skipped: true };
  }

  const values: SeedProduct[] = seedProducts;
  await db.insert(products).values(
    values.map((product) => ({
      ...product,
      gallery: [product.image],
    })),
  );

  return { categories: seedCategories.length, products: values.length, skipped: false };
}

/* =========================================================
   ORDERS + NEWSLETTER
========================================================= */

export async function createOrder(input: {
  customerName: string;
  phone: string;
  address: string;
  city?: string;
  notes?: string;
  total: number;
  items: {
    slug: string;
    nameEn: string;
    nameAr: string;
    image: string;
    price: number;
    quantity: number;
  }[];
}) {
  const reference = `AL-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    Math.random() * 900 + 100,
  )}`;

  const [order] = await db
    .insert(orders)
    .values({
      reference,
      customerName: input.customerName,
      phone: input.phone,
      address: input.address,
      city: input.city ?? "",
      notes: input.notes ?? "",
      total: input.total,
    })
    .returning({ id: orders.id, reference: orders.reference });

  if (input.items.length > 0) {
    await db.insert(orderItems).values(
      input.items.map((item) => ({
        orderId: order.id,
        productSlug: item.slug,
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
    );
  }

  return order;
}

export async function getRecentOrders(limit = 8) {
  const rows = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(limit);

  return rows.map((row) => ({
    id: row.id,
    reference: row.reference,
    customerName: row.customerName,
    phone: row.phone,
    total: Number(row.total),
    status: row.status,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : String(row.createdAt),
  }));
}

export async function addSubscriber(email: string) {
  const normalized = email.trim().toLowerCase();
  const [existing] = await db
    .select({ id: subscribers.id })
    .from(subscribers)
    .where(eq(subscribers.email, normalized))
    .limit(1);

  if (existing) return { created: false };

  await db.insert(subscribers).values({ email: normalized });
  return { created: true };
}
