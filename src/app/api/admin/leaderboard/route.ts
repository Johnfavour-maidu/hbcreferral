import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profiles = await prisma.profile.findMany({
      orderBy: { verifiedReferrals: "desc" },
      include: { user: { select: { isActive: true } } },
    });

    const leaderboard = profiles
      .filter((p) => p.user.isActive)
      .map((p, index) => ({
        rank: index + 1,
        fullName: p.fullName,
        totalReferrals: p.totalReferrals,
        verifiedReferrals: p.verifiedReferrals,
        state: p.state,
      }));

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("Admin leaderboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
