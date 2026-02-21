import { NextRequest, NextResponse } from "next/server";
import { productSchema } from "@/lib/validators";
import { db } from "@/lib/db";
import { generateSku } from "@/lib/utils";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await db.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const sku = generateSku(data.title);

  const product = await db.product.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      stock: data.stock,
      active: data.active,
      images: data.images,
      variants: data.variants,
      sku,
      createdById: admin.id
    }
  });

  await db.adminLog.create({
    data: {
      adminId: admin.id,
      action: "create",
      entity: "product",
      entityId: product.id
    }
  });

  return NextResponse.json({ success: true, product }, { status: 201 });
}