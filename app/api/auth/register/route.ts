import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/security";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const gate = rateLimit(`register:${ip}`, 10, 60_000);
  if (!gate.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (process.env.RECAPTCHA_SECRET_KEY) {
    const form = new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: body.captchaToken ?? ""
    });

    const verify = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: form
    }).then((r) => r.json());

    if (!verify.success) {
      return NextResponse.json({ error: "Captcha validation failed" }, { status: 400 });
    }
  }

  const email = parsed.data.email.toLowerCase();
  const exists = await db.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const role = process.env.ADMIN_EMAIL?.toLowerCase() === email ? "admin" : "customer";

  await db.user.create({
    data: {
      email,
      name: parsed.data.name,
      passwordHash,
      role
    }
  });

  return NextResponse.json({ success: true });
}