import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/security";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const hashedToken = hashToken(token);
  const reset = await db.passwordResetToken.findUnique({ where: { token: hashedToken } });
  if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
    return NextResponse.json({ error: "Token invalid or expired" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.$transaction([
    db.user.update({ where: { id: reset.userId }, data: { passwordHash } }),
    db.passwordResetToken.update({ where: { id: reset.id }, data: { usedAt: new Date() } })
  ]);

  return NextResponse.json({ success: true });
}