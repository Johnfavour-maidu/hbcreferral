import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId") || "referral-challenge-2026";
    const limit = parseInt(searchParams.get("limit") || "100");

    const [leaderboard, totalParticipants, lastEntry] = await Promise.all([
      prisma.leaderboard.findMany({
        where: { campaignId, verifiedRefs: { gt: 0 } },
        orderBy: [{ verifiedRefs: "desc" }, { score: "asc" }],
        take: limit,
        include: {
          user: {
            include: {
              profile: {
                select: {
                  fullName: true,
                  instagram: true,
                  participantId: true,
                },
              },
            },
          },
        },
      }),
      prisma.leaderboard.count({
        where: { campaignId, verifiedRefs: { gt: 0 } },
      }),
      prisma.leaderboard.findFirst({
        where: { campaignId },
        orderBy: { updatedAt: "desc" },
        select: { updatedAt: true },
      }),
    ]);

    const formatted = leaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      fullName: (entry as any).user?.profile?.fullName || "Anonymous",
      instagram: (entry as any).user?.profile?.instagram || "",
      participantId: (entry as any).user?.profile?.participantId || "",
      totalReferrals: entry.totalRefs,
      verifiedReferrals: entry.verifiedRefs,
    }));

    return NextResponse.json({
      leaderboard: formatted,
      totalParticipants,
      lastUpdated: lastEntry?.updatedAt || new Date().toISOString(),
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
