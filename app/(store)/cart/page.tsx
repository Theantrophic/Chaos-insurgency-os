import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import CheckoutClient from "@/components/checkout-client";

export default async function CartPage() {
  const products = await db.product.findMany({ where: { active: true, stock: { gt: 0 } }, orderBy: { createdAt: "desc" } });

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Carrito / Checkout rapido</h1>
      {products.length === 0 ? (
        <div className="kivo-card text-sm text-slate-600">No hay productos activos aun.</div>
      ) : (
        <div className="kivo-card">
          <ul className="space-y-3">
            {products.map((p) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <span>{p.title}</span>
                <span>{formatCurrency(p.price.toString())}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <CheckoutClient products={products.map((p) => ({ id: p.id, title: p.title }))} />
    </section>
  );
}