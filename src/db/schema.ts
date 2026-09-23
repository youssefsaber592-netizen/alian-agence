import { relations, sql } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/* =========================================================
   CATEGORIES
========================================================= */

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionAr: text("description_ar").notNull().default(""),
  image: text("image").notNull(),
  /** "normal" | "large" | "wide" — drives the bento grid layout on the homepage */
  size: text("size").notNull().default("normal"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* =========================================================
   PRODUCTS
========================================================= */

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    nameEn: text("name_en").notNull(),
    nameAr: text("name_ar").notNull(),
    descriptionEn: text("description_en").notNull().default(""),
    descriptionAr: text("description_ar").notNull().default(""),
    price: doublePrecision("price").notNull(),
    compareAtPrice: doublePrecision("compare_at_price"),
    image: text("image").notNull(),
    gallery: text("gallery")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    // ربط الـ Foreign Key بـ categories.slug مع Cascade عند التحديث
    categorySlug: text("category_slug")
      .notNull()
      .default("decor")
      .references(() => categories.slug, { onDelete: "restrict", onUpdate: "cascade" }),
    badgeEn: text("badge_en"),
    badgeAr: text("badge_ar"),
    rating: doublePrecision("rating").notNull().default(4.8),
    reviewsCount: integer("reviews_count").notNull().default(0),
    stock: integer("stock").notNull().default(25),
    isFeatured: boolean("is_featured").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    amazonUrl: text("amazon_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("products_category_idx").on(table.categorySlug),
    index("products_featured_idx").on(table.isFeatured),
  ],
);

/* =========================================================
   SECTIONS (DYNAMIC HOMEPAGE LAYOUT)
========================================================= */

export const sections = pgTable(
  "sections",
  {
    id: serial("id").primaryKey(),
    titleEn: text("title_en").notNull(),
    titleAr: text("title_ar").notNull(),
    subtitleEn: text("subtitle_en").notNull().default(""),
    subtitleAr: text("subtitle_ar").notNull().default(""),
    badgeEn: text("badge_en"),
    badgeAr: text("badge_ar"),
    /**
     * Controls layout type to prevent collisions:
     * "hero" | "category_grid" | "featured_products" | "banner"
     */
    type: text("type").notNull().default("featured_products"),
    // ربط اختياري مع categories.slug
    targetCategorySlug: text("target_category_slug").references(
      () => categories.slug,
      { onDelete: "set null", onUpdate: "cascade" }
    ),
    imageUrl: text("image_url"),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("sections_type_idx").on(table.type),
    index("sections_active_idx").on(table.isActive),
  ],
);

/* =========================================================
   ORDERS
========================================================= */

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull().default(""),
  notes: text("notes").notNull().default(""),
  total: doublePrecision("total").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productSlug: text("product_slug").notNull(),
    nameEn: text("name_en").notNull(),
    nameAr: text("name_ar").notNull(),
    image: text("image").notNull(),
    price: doublePrecision("price").notNull(),
    quantity: integer("quantity").notNull().default(1),
  },
  (table) => [index("order_items_order_idx").on(table.orderId)],
);

/* =========================================================
   NEWSLETTER
========================================================= */

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* =========================================================
   RELATIONS
========================================================= */

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
  sections: many(sections),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categorySlug],
    references: [categories.slug],
  }),
}));

export const sectionsRelations = relations(sections, ({ one }) => ({
  targetCategory: one(categories, {
    fields: [sections.targetCategorySlug],
    references: [categories.slug],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

/* =========================================================
   TYPES
========================================================= */

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Section = typeof sections.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;