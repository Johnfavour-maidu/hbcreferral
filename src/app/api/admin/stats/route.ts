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

    const dailyRegistrations = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await prisma.user.count({
        where: {
          role: "PARTICIPANT",
          createdAt: { gte: date, lt: nextDate },
        },
      });

      dailyRegistrations.push({
        date: date.toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
        count,
      });
    }

    const dailyReferrals = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const verified = await prisma.referral.count({
        where: { status: "VERIFIED", createdAt: { gte: date, lt: nextDate } },
      });
      const pending = await prisma.referral.count({
        where: { status: "PENDING", createdAt: { gte: date, lt: nextDate } },
      });

      dailyReferrals.push({
        date: date.toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
        verified,
        pending,
      });
    }

    const recentParticipants = await prisma.profile.findMany({
      take: 6,
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
        participantId: true,
        fullName: true,
        school: true,
        verifiedReferrals: true,
      },
    });

    const campaign = await prisma.campaign.findUnique({
      where: { id: "referral-challenge-2026" },
    });

    let daysRemaining = 0;
    if (campaign?.endDate) {
      const now = new Date();
      const end = new Date(campaign.endDate);
      daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    }

    const recentActivity: { type: string; message: string; timestamp: string }[] = [];

    const latestUsers = await prisma.user.findMany({
      where: { role: "PARTICIPANT" },
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { createdAt: true, profile: { select: { fullName: true } } },
    });
    latestUsers.forEach((u) => {
      recentActivity.push({
        type: "registration",
        message: `${u.profile?.fullName || "Someone"} registered`,
        timestamp: u.createdAt.toISOString(),
      });
    });

    const latestVerified = await prisma.referral.findMany({
      where: { status: "VERIFIED" },
      take: 2,
      orderBy: { verifiedAt: "desc" },
      select: {
        verifiedAt: true,
        referrer: { select: { profile: { select: { fullName: true } } } },
      },
    });
    latestVerified.forEach((r) => {
      if (r.verifiedAt) {
        recentActivity.push({
          type: "verified",
          message: `Referral verified for ${r.referrer?.profile?.fullName || "someone"}`,
          timestamp: r.verifiedAt.toISOString(),
        });
      }
    });

    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      totalParticipants,
      verifiedReferrals,
      pendingVerifications,
      rejectedReferrals,
      todayRegistrations,
      totalReferrals,
      topReferrer: topReferrer?.fullName || "",
      topReferrerCount: topReferrer?.verifiedReferrals || 0,
      activeSchools: activeSchools.length,
      statesCovered: statesCovered.length,
      dailyRegistrations,
      dailyReferrals,
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
      campaign: campaign
        ? {
            name: campaign.name,
            status: campaign.status,
            startDate: campaign.startDate?.toISOString() || null,
            endDate: campaign.endDate?.toISOString() || null,
            daysRemaining,
            registrationEnabled: campaign.registrationEnabled,
            leaderboardVisible: campaign.leaderboardVisible,
          }
        : null,
      recentActivity: recentActivity.slice(0, 5),
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
