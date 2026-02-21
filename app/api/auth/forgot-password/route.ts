import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashToken, rateLimit } from "@/lib/security";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const gate = rateLimit(`forgot:${ip}`, 6, 60_000);
  if (!gate.success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const { email } = await req.json();
  if (!email) return NextResponse.json({ success: true });

  const user = await db.user.findUnique({ where: { email: String(email).toLowerCase() } });
  if (!user) return NextResponse.json({ success: true });

  const raw = randomBytes(32).toString("hex");
  const token = hashToken(raw);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await db.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt }
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${raw}`;
  console.log("Password reset link:", resetUrl);

  return NextResponse.json({ success: true });
}