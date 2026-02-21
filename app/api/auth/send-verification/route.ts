import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawToken = randomBytes(24).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await db.verificationToken.create({
    data: {
      identifier: session.user.email,
      token: rawToken,
      expires
    }
  });

  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?email=${encodeURIComponent(session.user.email)}&token=${rawToken}`;
  console.log("Verify email link:", verifyUrl);

  return NextResponse.json({ success: true });
}