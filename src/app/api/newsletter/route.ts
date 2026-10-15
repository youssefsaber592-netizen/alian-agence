import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/data";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = (body.email ?? "").trim().toLowerCase();

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const result = await addSubscriber(email);

    return NextResponse.json({
      status: result.created ? "subscribed" : "duplicate",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
