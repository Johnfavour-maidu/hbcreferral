import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId") || "referral-challenge-2026";
    const limit = parseInt(searchParams.get("limit") || "100");

    const leaderboard = await prisma.leaderboard.findMany({
      where: { campaignId },
      orderBy: [{ verifiedRefs: "desc" }, { totalRefs: "desc" }],
      take: limit,
      include: {
        user: {
          include: {
            profile: {
              select: {
                fullName: true,
                instagram: true,
              },
            },
          },
        },
      },
    });

    const formatted = leaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      fullName: entry.user.profile?.fullName || "Anonymous",
      totalReferrals: entry.totalRefs,
      verifiedReferrals: entry.verifiedRefs,
    }));

    return NextResponse.json({ leaderboard: formatted });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
