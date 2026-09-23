import { NextResponse } from "next/server";
import { db } from "@/db";
import { sections } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
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
      .where(eq(sections.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    await db.delete(sections).where(eq(sections.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete section" }, { status: 500 });
  }
}