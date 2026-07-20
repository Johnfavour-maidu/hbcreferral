import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dailySignups = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await prisma.user.count({
        where: { createdAt: { gte: date, lt: nextDate } },
      });

      dailySignups.push({
        date: date.toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
        count,
      });
    }

    const topReferrers = await prisma.profile.findMany({
      orderBy: { verifiedReferrals: "desc" },
      take: 10,
      select: { fullName: true, verifiedReferrals: true },
    });

    const topSchools = await prisma.profile.groupBy({
      by: ["school"],
      _count: { school: true },
      orderBy: { _count: { school: "desc" } },
      take: 10,
    });

    const topStates = await prisma.profile.groupBy({
      by: ["state"],
      _count: { state: true },
      orderBy: { _count: { state: "desc" } },
      take: 10,
    });

    const totalSignups = await prisma.user.count({ where: { role: "PARTICIPANT" } });
    const totalVerified = await prisma.referral.count({ where: { status: "VERIFIED" } });
    const totalReferrals = await prisma.referral.count();

    return NextResponse.json({
      dailySignups,
      topReferrers: topReferrers.map((r) => ({ name: r.fullName, count: r.verifiedReferrals })),
      topSchools: topSchools.map((s) => ({ name: s.school, count: s._count.school })),
      topStates: topStates.map((s) => ({ name: s.state, count: s._count.state })),
      referralConversion: totalReferrals > 0 ? Math.round((totalVerified / totalReferrals) * 100) : 0,
      totalSignups,
      totalVerified,
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
