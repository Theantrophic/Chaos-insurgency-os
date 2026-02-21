import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import AdminOrders from "@/components/admin-orders";

export default async function AdminOrdersPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }

  const orders = await db.order.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Pedidos</h1>
      <AdminOrders
        orders={orders.map((o) => ({
          id: o.id,
          status: o.status,
          total: o.total.toString(),
          paymentMethod: o.paymentMethod,
          user: { email: o.user.email }
        }))}
      />
    </section>
  );
}