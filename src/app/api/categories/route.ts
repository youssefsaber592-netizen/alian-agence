import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
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
    })
    .returning();

  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder));

  return NextResponse.json({ category: row, categories: rows.length }, { status: 201 });
}
