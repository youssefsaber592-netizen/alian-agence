import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getProductBySlug, getRelatedProducts, toProductDTO } from "@/lib/data";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const related = await getRelatedProducts(slug, product.categorySlug, 4);

  return NextResponse.json({ product, related });
}

export async function PATCH(request: Request, { params }: Params) {
  const { slug } = await params;
  const body = (await request.json()) as Record<string, unknown>;

  const patch: Record<string, unknown> = {};

  if (typeof body.nameEn === "string") patch.nameEn = body.nameEn.trim();
  if (typeof body.nameAr === "string") patch.nameAr = body.nameAr.trim();
  if (typeof body.descriptionEn === "string")
    patch.descriptionEn = body.descriptionEn;
  if (typeof body.descriptionAr === "string")
    patch.descriptionAr = body.descriptionAr;
  if (body.price !== undefined) patch.price = Number(body.price);
  if (body.compareAtPrice !== undefined)
    patch.compareAtPrice = body.compareAtPrice ? Number(body.compareAtPrice) : null;
  if (typeof body.image === "string" && body.image.trim()) {
    patch.image = body.image.trim();
    patch.gallery = [body.image.trim()];
  }
  if (typeof body.categorySlug === "string")
    patch.categorySlug = body.categorySlug;
  if (body.badgeEn !== undefined) patch.badgeEn = body.badgeEn || null;
  if (body.badgeAr !== undefined) patch.badgeAr = body.badgeAr || null;
  if (body.rating !== undefined) patch.rating = Number(body.rating);
  if (body.stock !== undefined) patch.stock = Number(body.stock);
  if (body.isFeatured !== undefined) patch.isFeatured = Boolean(body.isFeatured);
  if (body.isActive !== undefined) patch.isActive = Boolean(body.isActive);
  if (typeof body.slug === "string" && body.slug.trim()) {
    const nextSlug = slugify(body.slug) || body.slug.trim();
    patch.slug = nextSlug;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const [row] = await db
    .update(products)
    .set(patch)
    .where(and(eq(products.slug, slug)))
    .returning();

  if (!row) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product: toProductDTO(row) });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { slug } = await params;
  await db.delete(products).where(eq(products.slug, slug));
  return NextResponse.json({ ok: true });
}
