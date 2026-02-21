import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import AdminCustomers from "@/components/admin-customers";

export default async function AdminCustomersPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }

  const customers = await db.user.findMany({
    where: { role: "customer" },
    include: { orders: { select: { id: true } } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Clientes</h1>
      <AdminCustomers
        customers={customers.map((c) => ({
          id: c.id,
          email: c.email,
          name: c.name,
          blocked: c.blocked,
          orders: c.orders
        }))}
      />
    </section>
  );
}