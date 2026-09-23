import { NextResponse } from "next/server";
import { db } from "@/db";
import { sections } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

// GET: Fetch all homepage sections ordered by sortOrder
export async function GET() {
  try {
    const data = await db
      .select()
      .from(sections)
      .orderBy(asc(sections.sortOrder));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 },
    );
  }
}

// POST: Add a new section without layout conflicts
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newSection = await db.insert(sections).values({
      titleEn: body.titleEn,
      titleAr: body.titleAr,
      subtitleEn: body.descriptionEn || "",
      subtitleAr: body.descriptionAr || "",
      badgeEn: body.badgeEn || null,
      badgeAr: body.badgeAr || null,
      imageUrl: body.image || null,
      targetCategorySlug: body.targetCategorySlug || null,
      type: body.type || "featured_products",
    }).returning();

    return NextResponse.json(newSection[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create section" }, { status: 500 });
  }
}

// PUT: Update existing section details
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing section ID" },
        { status: 400 },
      );
    }

    const updated = await db
      .update(sections)
      .set(updateData)
      .where(eq(sections.id, Number(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a section by ID
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing section ID" },
        { status: 400 },
      );
    }

    await db.delete(sections).where(eq(sections.id, Number(id)));
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 },
    );
  }
}