import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

export default async function AdminAnalyticsPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }

  const [orders, products, users] = await Promise.all([
    db.order.findMany({ include: { items: true } }),
    db.product.findMany(),
    db.user.findMany({ where: { role: "customer" }, include: { orders: true } })
  ]);

  const revenueByMethod = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.paymentMethod] = (acc[order.paymentMethod] ?? 0) + Number(order.total);
    return acc;
  }, {});

  const productSales = new Map<string, number>();
  for (const order of orders) {
    for (const item of order.items) {
      productSales.set(item.productId, (productSales.get(item.productId) ?? 0) + item.quantity);
    }
  }

  const topProducts = products
    .map((p) => ({ title: p.title, units: productSales.get(p.id) ?? 0 }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  const recurrent = users.filter((u) => u.orders.length > 1).length;

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Analitica</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="kivo-card">
          <h2 className="font-semibold">Ingresos por metodo de pago</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {Object.entries(revenueByMethod).map(([method, value]) => (
              <li key={method} className="flex justify-between"><span>{method}</span><span>${value.toFixed(2)}</span></li>
            ))}
          </ul>
        </article>
        <article className="kivo-card">
          <h2 className="font-semibold">Productos mas vendidos</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {topProducts.map((p) => (
              <li key={p.title} className="flex justify-between"><span>{p.title}</span><span>{p.units} uds</span></li>
            ))}
          </ul>
        </article>
      </div>
      <article className="kivo-card text-sm">
        <p>Clientes nuevos: {users.length - recurrent}</p>
        <p>Clientes recurrentes: {recurrent}</p>
      </article>
    </section>
  );
}