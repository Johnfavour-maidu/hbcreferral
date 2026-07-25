import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "participants";

    let data: any[] = [];
    const filename = type;

    switch (type) {
      case "participants":
        const users = await prisma.user.findMany({
          where: { role: "PARTICIPANT" },
          include: { profile: true },
          orderBy: { createdAt: "desc" },
        });
        data = users.map((u) => ({
          name: u.profile?.fullName || "",
          email: u.email,
          phone: u.phone,
          instagram: u.profile?.instagram || "",
          state: u.profile?.state || "",
          referrals: u.profile?.totalReferrals || 0,
          verified: u.profile?.verifiedReferrals || 0,
          status: u.isActive ? "Active" : "Suspended",
          joined: u.createdAt.toISOString(),
        }));
        break;

      case "leaderboard":
        const profiles = await prisma.profile.findMany({
          orderBy: { verifiedReferrals: "desc" },
          include: { user: { select: { isActive: true } } },
        });
        data = profiles.filter((p) => p.user.isActive).map((p, i) => ({
          rank: i + 1,
          name: p.fullName,
          state: p.state,
          total: p.totalReferrals,
          verified: p.verifiedReferrals,
        }));
        break;

      case "referrals":
        const referrals = await prisma.referral.findMany({
          orderBy: { createdAt: "desc" },
          include: {
            referrer: { include: { profile: { select: { fullName: true, instagram: true } } } },
          },
        });
        data = referrals.map((r) => ({
          referrer_name: r.referrer.profile?.fullName || "",
          referrer_username: r.referrer.profile?.instagram || "",
          referred_instagram: r.referredInstagram || "",
          status: r.status,
          created: r.createdAt.toISOString(),
          verified: r.verifiedAt?.toISOString() || "",
        }));
        break;
    }

    if (data.length === 0) {
      return new NextResponse("No data", { status: 200 });
    }
    const headers = Object.keys(data[0]);
    const csv = [headers.join(","), ...data.map((row) => headers.map((h) => `"${String(row[h]).replace(/"/g, '""')}"`).join(","))].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}.csv"`,
      },
    });
  } catch (error) {
    console.error("Admin export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
