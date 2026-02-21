import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

export default async function AdminIndexPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }

  const [orders, customers, products] = await Promise.all([
    db.order.findMany(),
    db.user.findMany({ where: { role: "customer" } }),
    db.product.findMany()
  ]);

  const totalSales = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const salesToday = orders.filter((o) => o.createdAt >= today).reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Panel Admin</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <article className="kivo-card"><p className="text-sm text-slate-500">Ventas totales</p><p className="mt-2 text-2xl font-semibold">${totalSales.toFixed(2)}</p></article>
        <article className="kivo-card"><p className="text-sm text-slate-500">Ventas hoy</p><p className="mt-2 text-2xl font-semibold">${salesToday.toFixed(2)}</p></article>
        <article className="kivo-card"><p className="text-sm text-slate-500">Clientes</p><p className="mt-2 text-2xl font-semibold">{customers.length}</p></article>
        <article className="kivo-card"><p className="text-sm text-slate-500">Productos</p><p className="mt-2 text-2xl font-semibold">{products.length}</p></article>
      </div>
      <div className="flex gap-3 text-sm">
        <Link href="/admin/products" className="kivo-button">Gestion de productos</Link>
        <Link href="/admin/orders" className="kivo-button">Gestion de pedidos</Link>
        <Link href="/admin/customers" className="kivo-button">Gestion de clientes</Link>
        <Link href="/admin/analytics" className="kivo-button">Analitica</Link>
      </div>
    </section>
  );
}