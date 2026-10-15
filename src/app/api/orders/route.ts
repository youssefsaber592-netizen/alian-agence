import { NextResponse } from "next/server";
import { createOrder, getRecentOrders } from "@/lib/data";

export const dynamic = "force-dynamic";

type OrderItem = {
  slug: string;
  nameEn: string;
  nameAr: string;
  image: string;
  price: number;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      customerName?: string;
      phone?: string;
      address?: string;
      city?: string;
      notes?: string;
      items?: OrderItem[];
    };

    const items = Array.isArray(body.items) ? body.items : [];

    if (!body.customerName?.trim() || !body.phone?.trim() || !body.address?.trim()) {
      return NextResponse.json(
        { error: "customerName, phone and address are required" },
        { status: 400 },
      );
    }

    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const total = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );

    const order = await createOrder({
      customerName: body.customerName.trim(),
      phone: body.phone.trim(),
      address: body.address.trim(),
      city: body.city?.trim() ?? "",
      notes: body.notes?.trim() ?? "",
      total,
      items: items.map((item) => ({
        slug: item.slug,
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        image: item.image,
        price: Number(item.price),
        quantity: Math.max(1, Number(item.quantity) || 1),
      })),
    });

    return NextResponse.json({ reference: order.reference }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const orders = await getRecentOrders(10);
  return NextResponse.json({ orders });
}
