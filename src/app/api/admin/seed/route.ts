import { NextResponse } from "next/server";
import { seedCatalogue } from "@/lib/data";

export const dynamic = "force-dynamic";

/** Loads the demo catalogue (categories + products) when the database is empty. */
export async function POST() {
  try {
    const result = await seedCatalogue();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
