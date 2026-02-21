import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import AdminProducts from "@/components/admin-products";

export default async function AdminProductsPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }

  const products = await db.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Productos</h1>
      <AdminProducts
        initialProducts={products.map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price.toString(),
          stock: p.stock,
          active: p.active,
          sku: p.sku
        }))}
      />
    </section>
  );
}