import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findFirst({ where: { id, active: true } });
  if (!product) return notFound();

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">{product.title}</h1>
      <p className="text-slate-600">{product.description}</p>
      <p className="text-2xl font-semibold">{formatCurrency(product.price.toString())}</p>
      <p className="text-sm text-slate-500">SKU: {product.sku}</p>
      <p className="text-sm text-slate-500">Stock disponible: {product.stock}</p>
    </section>
  );
}