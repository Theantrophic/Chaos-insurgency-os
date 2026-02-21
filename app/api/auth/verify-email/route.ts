import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const token = req.nextUrl.searchParams.get("token");

  if (!email || !token) {
    return NextResponse.redirect(new URL("/login?verified=0", req.url));
  }

  const record = await db.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: email,
        token
      }
    }
  }).catch(() => null);

  if (!record || record.expires < new Date()) {
    return NextResponse.redirect(new URL("/login?verified=0", req.url));
  }

  await db.$transaction([
    db.user.updateMany({ where: { email }, data: { emailVerified: new Date() } }),
    db.verificationToken.delete({ where: { identifier_token: { identifier: email, token } } })
  ]);

  return NextResponse.redirect(new URL("/login?verified=1", req.url));
}