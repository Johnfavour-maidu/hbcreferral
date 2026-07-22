import { NextResponse } from "next/server";
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

    const rejectedReferrals = await prisma.referral.count({
      where: { status: "REJECTED" },
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

    const activeSchools = await prisma.profile.findMany({
      select: { school: true },
      distinct: ["school"],
    });

    const statesCovered = await prisma.profile.findMany({
      select: { state: true },
      distinct: ["state"],
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

    const recentParticipants = await prisma.profile.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        participantId: true,
        fullName: true,
        state: true,
        school: true,
        totalReferrals: true,
        verifiedReferrals: true,
        createdAt: true,
      },
    });

    const pendingItems = await prisma.referral.findMany({
      where: { status: "PENDING" },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        referredEmail: true,
        referredInstagram: true,
        referrer: {
          select: {
            profile: {
              select: { fullName: true },
            },
          },
        },
        createdAt: true,
        status: true,
      },
    });

    const topReferrers = await prisma.profile.findMany({
      take: 5,
      orderBy: { verifiedReferrals: "desc" },
      select: {
        fullName: true,
        school: true,
        verifiedReferrals: true,
      },
    });

    const topStatesRaw = await prisma.profile.groupBy({
      by: ["state"],
      _count: { state: true },
      orderBy: { _count: { state: "desc" } },
      take: 5,
    });
    const topStates = topStatesRaw.map((s) => ({
      name: s.state,
      count: s._count.state,
    }));

    return NextResponse.json({
      totalParticipants,
      verifiedReferrals,
      pendingVerifications,
      rejectedReferrals,
      todayRegistrations,
      totalReferrals,
      topReferrer: topReferrer?.fullName || "",
      activeSchools: activeSchools.length,
      statesCovered: statesCovered.length,
      dailyGrowth,
      verificationRate,
      recentParticipants,
      pendingVerificationsList: pendingItems.map((p) => ({
        id: p.id,
        referredEmail: p.referredEmail,
        referredInstagram: p.referredInstagram,
        referrerName: p.referrer?.profile?.fullName || "Unknown",
        createdAt: p.createdAt.toISOString(),
        status: p.status,
      })),
      topReferrers,
      topStates,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
