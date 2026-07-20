import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
      },
    });

    if (!user?.profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const leaderboardEntry = await prisma.leaderboard.findFirst({
      where: { userId: session.user.id, campaignId: "referral-challenge-2026" },
    });

    const totalParticipants = await prisma.user.count({
      where: { role: "PARTICIPANT", isActive: true },
    });

    return NextResponse.json({
      profile: user.profile,
      leaderboardPosition: leaderboardEntry?.rank || totalParticipants,
      totalParticipants,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
