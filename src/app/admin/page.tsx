import type { Metadata } from "next";
import { getCategories, getProducts, getRecentOrders } from "@/lib/data";
import { AdminPageClient } from "@/components/admin/AdminClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Store dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const [products, categories, orders] = await Promise.all([
    getProducts({ limit: 200, sort: "newest" }).catch(() => []),
    getCategories().catch(() => []),
    getRecentOrders(10).catch(() => []),
  ]);

  return (
    <AdminPageClient
      initialProducts={products}
      categories={categories}
      initialOrders={orders}
    />
  );
}
