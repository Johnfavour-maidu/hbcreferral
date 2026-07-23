import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const profile = await prisma.profile.findFirst({
    where: { referralCode: code },
    select: {
      fullName: true,
      instagram: true,
    },
  });

  if (!profile) {
    return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
  }

  return NextResponse.json({
    referrer: {
      fullName: profile.fullName,
      instagram: profile.instagram,
    },
  });
}
