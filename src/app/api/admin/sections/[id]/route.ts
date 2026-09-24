import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sections } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sectionId = Number(id);

  try {
    const body = await request.json();

    const [updated] = await db
      .update(sections)
      .set({
        titleEn: body.titleEn,
        titleAr: body.titleAr,
        subtitleEn: body.subtitleEn,
        subtitleAr: body.subtitleAr,
        badgeEn: body.badgeEn,
        badgeAr: body.badgeAr,
        type: body.type,
        targetCategorySlug: body.targetCategorySlug,
        imageUrl: body.imageUrl,
        isActive: body.isActive,
      })
      .where(eq(sections.id, sectionId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sectionId = Number(id);

  try {
    await db.delete(sections).where(eq(sections.id, sectionId));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete section" }, { status: 500 });
  }
}