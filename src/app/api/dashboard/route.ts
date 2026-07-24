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
      select: {
        email: true,
        phone: true,
        profile: true,
      },
    });

    if (!user?.profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const totalParticipants = await prisma.user.count({
      where: { role: "PARTICIPANT", isActive: true },
    });

    let leaderboardPosition: number | null = null;
    if (user.profile.verifiedReferrals > 0) {
      const rank = await prisma.profile.count({
        where: {
          verifiedReferrals: { gt: user.profile.verifiedReferrals },
          user: { role: "PARTICIPANT", isActive: true },
        },
      });
      leaderboardPosition = rank + 1;
    }

    return NextResponse.json({
      profile: {
        ...user.profile,
        email: user.email,
        phone: user.phone,
      },
      leaderboardPosition,
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
