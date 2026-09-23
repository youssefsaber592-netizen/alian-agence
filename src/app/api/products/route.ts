import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import {
  getProducts,
  seedCatalogue,
  toProductDTO,
} from "@/lib/data";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const featured = searchParams.get("featured") === "1";
  const sort = searchParams.get("sort") as
    | "featured"
    | "priceAsc"
    | "priceDesc"
    | "rating"
    | "newest"
    | null;
  const limit = Number(searchParams.get("limit")) || undefined;

  const rows = await getProducts({
    category,
    search: q,
    featured,
    sort: sort ?? undefined,
    limit,
  });

  return NextResponse.json({
    products: rows,
    total: rows.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const nameEn = String(body.nameEn ?? "").trim();
    const nameAr = String(body.nameAr ?? "").trim();

    if (!nameEn || !nameAr) {
      return NextResponse.json(
        { error: "nameEn and nameAr are required" },
        { status: 400 },
      );
    }

    const price = Number(body.price ?? 0);
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "price must be a positive number" },
        { status: 400 },
      );
    }

    const slug =
      String(body.slug ?? "").trim() || slugify(nameEn) || `product-${Date.now()}`;

    const [existing] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 409 },
      );
    }

    const image = String(body.image ?? "").trim() || "/images/products/decor-1.jpg";

    const [row] = await db
      .insert(products)
      .values({
        slug,
        nameEn,
        nameAr,
        descriptionEn: String(body.descriptionEn ?? ""),
        descriptionAr: String(body.descriptionAr ?? ""),
        price,
        compareAtPrice: body.compareAtPrice
          ? Number(body.compareAtPrice)
          : null,
        image,
        gallery: [image],
        categorySlug:
          String(body.categorySlug ?? "").trim() || "decor",
        badgeEn: body.badgeEn ? String(body.badgeEn) : null,
        badgeAr: body.badgeAr ? String(body.badgeAr) : null,
        rating: Number(body.rating ?? 4.8),
        reviewsCount: Number(body.reviewsCount ?? 0),
        stock: Number(body.stock ?? 25),
        isFeatured: Boolean(body.isFeatured),
        isActive: body.isActive === undefined ? true : Boolean(body.isActive),
      })
      .returning();

    return NextResponse.json({ product: toProductDTO(row) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  await db.delete(products).where(eq(products.id, id));
  return NextResponse.json({ ok: true });
}

export async function PUT() {
  await seedCatalogue();
  const rows = await getProducts({ limit: 200 });
  const cats = await db.select().from(categories);
  return NextResponse.json({
    ok: true,
    products: rows.length,
    categories: cats.length,
  });
}
