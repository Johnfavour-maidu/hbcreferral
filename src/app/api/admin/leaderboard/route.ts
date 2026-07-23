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
      where: {
        user: { role: "PARTICIPANT", isActive: true },
      },
      select: {
        userId: true,
        fullName: true,
        instagram: true,
        verifiedReferrals: true,
      },
      orderBy: [{ verifiedReferrals: "desc" }, { createdAt: "asc" }],
    });

    const leaderboard = profiles.map((p, index) => ({
      rank: index + 1,
      userId: p.userId,
      fullName: p.fullName,
      instagram: p.instagram,
      verifiedReferrals: p.verifiedReferrals,
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
