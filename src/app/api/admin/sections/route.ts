import { NextResponse } from "next/server";
import { db } from "@/db"; // اضبط مسار ملف الـ db لديك
import { sections } from "@/db/schema";
import { eq } from "drizzle-orm";

// 1. جلب كل السكاشن
export async function GET() {
  try {
    const allSections = await db.select().from(sections).orderBy(sections.sortOrder);
    return NextResponse.json(allSections);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 });
  }
}

// 2. إضافة سيكشن جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const [newSection] = await db.insert(sections).values({
      titleEn: body.titleEn,
      titleAr: body.titleAr,
      subtitleEn: body.subtitleEn || "",
      subtitleAr: body.subtitleAr || "",
      badgeEn: body.badgeEn || null,
      badgeAr: body.badgeAr || null,
      type: body.type || "featured_products",
      targetCategorySlug: body.targetCategorySlug || null,
      imageUrl: body.imageUrl || null,
      sortOrder: Number(body.sortOrder) || 0,
      isActive: body.isActive ?? true,
    }).returning();

    return NextResponse.json(newSection);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create section" }, { status: 500 });
  }
}