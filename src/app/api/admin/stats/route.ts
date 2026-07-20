import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalParticipants = await prisma.user.count({
      where: { role: "PARTICIPANT", isActive: true },
    });

    const verifiedReferrals = await prisma.referral.count({
      where: { status: "VERIFIED" },
    });

    const pendingVerifications = await prisma.referral.count({
      where: { status: "PENDING" },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRegistrations = await prisma.user.count({
      where: { createdAt: { gte: today } },
    });

    const totalReferrals = await prisma.referral.count();

    const topReferrer = await prisma.profile.findFirst({
      orderBy: { verifiedReferrals: "desc" },
      select: { fullName: true, verifiedReferrals: true },
    });

    const dailyGrowth = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await prisma.user.count({
        where: {
          createdAt: { gte: date, lt: nextDate },
        },
      });

      dailyGrowth.push({
        date: date.toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
        count,
      });
    }

    const verificationRate = totalReferrals > 0
      ? Math.round((verifiedReferrals / totalReferrals) * 100)
      : 0;

    return NextResponse.json({
      totalParticipants,
      verifiedReferrals,
      pendingVerifications,
      todayRegistrations,
      totalReferrals,
      topReferrer: topReferrer?.fullName || "",
      dailyGrowth,
      verificationRate,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
