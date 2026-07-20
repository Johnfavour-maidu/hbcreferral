import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const referrals = await prisma.referral.findMany({
      where: { referrerId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        referredUser: {
          include: {
            profile: { select: { fullName: true, instagram: true } },
          },
        },
      },
    });

    const formatted = referrals.map((r) => ({
      id: r.id,
      fullName: r.referredUser?.profile?.fullName || "Unknown",
      instagram: r.referredUser?.profile?.instagram || r.referredInstagram,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({ referrals: formatted });
  } catch (error) {
    console.error("Referrals API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
