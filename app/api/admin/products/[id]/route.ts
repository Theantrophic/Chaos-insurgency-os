import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin().catch(() => null);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json();

  const product = await db.product.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      price: body.price,
      compareAtPrice: body.compareAtPrice,
      stock: body.stock,
      active: body.active,
      images: body.images,
      variants: body.variants
    }
  });

  await db.adminLog.create({
    data: { adminId: admin.id, action: "update", entity: "product", entityId: id }
  });

  return NextResponse.json({ success: true, product });
}

export async function DELETE(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin().catch(() => null);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  await db.product.delete({ where: { id } });
  await db.adminLog.create({
    data: { adminId: admin.id, action: "delete", entity: "product", entityId: id }
  });

  return NextResponse.json({ success: true });
}