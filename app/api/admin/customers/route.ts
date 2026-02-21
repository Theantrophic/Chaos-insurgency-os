import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

export async function GET() {
  const admin = await requireAdmin().catch(() => null);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customers = await db.user.findMany({
    where: { role: "customer" },
    include: { orders: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ customers });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin().catch(() => null);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId, blocked } = await req.json();
  const customer = await db.user.update({ where: { id: userId }, data: { blocked: Boolean(blocked) } });
  return NextResponse.json({ success: true, customer });
}