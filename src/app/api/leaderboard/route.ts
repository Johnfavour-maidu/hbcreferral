import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId") || "referral-challenge-2026";

    const profiles = await prisma.profile.findMany({
      where: {
        user: { role: "PARTICIPANT", isActive: true },
      },
      select: {
        userId: true,
        fullName: true,
        instagram: true,
        participantId: true,
        verifiedReferrals: true,
      },
      orderBy: [{ verifiedReferrals: "desc" }, { createdAt: "asc" }],
    });

    const formatted = profiles.map((p, index) => ({
      rank: index + 1,
      userId: p.userId,
      fullName: p.fullName,
      instagram: p.instagram,
      participantId: p.participantId,
      verifiedReferrals: p.verifiedReferrals,
    }));

    return NextResponse.json({
      leaderboard: formatted,
      totalParticipants: profiles.length,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
