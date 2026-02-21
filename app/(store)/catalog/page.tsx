import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export default async function CatalogPage() {
  const products = await db.product.findMany({
    where: { active: true, stock: { gt: 0 } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Catalogo</h1>
      {products.length === 0 ? (
        <div className="kivo-card text-sm text-slate-600">No hay productos visibles todavia.</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.id} className="kivo-card">
              <h2 className="font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-slate-600 line-clamp-3">{p.description}</p>
              <p className="mt-4 text-lg font-semibold">{formatCurrency(p.price.toString())}</p>
              <Link href={`/catalog/${p.id}`} className="mt-4 inline-block text-sm text-kivo-purple">Ver detalle</Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}