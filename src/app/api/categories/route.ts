import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getCategories, getCategoryCounts } from "@/lib/data";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const [rows, counts] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
  ]);

  return NextResponse.json({ categories: rows, counts });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;

  const nameEn = String(body.nameEn ?? "").trim();
  const nameAr = String(body.nameAr ?? "").trim();

  if (!nameEn || !nameAr) {
    return NextResponse.json(
      { error: "nameEn and nameAr are required" },
      { status: 400 },
    );
  }

  const slug = String(body.slug ?? "").trim() || slugify(nameEn);

  const [row] = await db
    .insert(categories)
    .values({
      slug,
      nameEn,
      nameAr,
      descriptionEn: String(body.descriptionEn ?? ""),
      descriptionAr: String(body.descriptionAr ?? ""),
      image:
        String(body.image ?? "").trim() || "/images/categories/decor.jpg",
      size:
        body.size === "large" || body.size === "wide"
          ? body.size
          : "normal",
      sortOrder: Number(body.sortOrder ?? 99),
      link: body.link ? String(body.link) : null,
    })
    .returning();

  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder));

  return NextResponse.json({ category: row, categories: rows.length }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as Record<string, unknown> & { slug?: string };
  const slug = String(body.slug ?? "").trim();
  if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (body.nameEn !== undefined) patch.nameEn = String(body.nameEn).trim();
  if (body.nameAr !== undefined) patch.nameAr = String(body.nameAr).trim();
  if (body.descriptionEn !== undefined) patch.descriptionEn = String(body.descriptionEn);
  if (body.descriptionAr !== undefined) patch.descriptionAr = String(body.descriptionAr);
  if (body.image !== undefined) patch.image = String(body.image).trim() || "/images/categories/decor.jpg";
  if (body.size !== undefined) patch.size = body.size === "large" || body.size === "wide" ? body.size : "normal";
  if (body.sortOrder !== undefined) patch.sortOrder = Number(body.sortOrder);
  if (body.link !== undefined) patch.link = body.link ? String(body.link) : null;

  const [row] = await db.update(categories).set(patch).where(eq(categories.slug, slug)).returning();
  if (!row) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  return NextResponse.json({ category: row });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 });
  await db.delete(categories).where(eq(categories.slug, slug));
  return NextResponse.json({ ok: true });
}
