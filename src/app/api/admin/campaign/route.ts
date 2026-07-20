import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let campaign = await prisma.campaign.findUnique({
      where: { id: "referral-challenge-2026" },
    });

    if (!campaign) {
      campaign = await prisma.campaign.create({
        data: {
          id: "referral-challenge-2026",
          name: "Referral Challenge 2026",
          description: "The main referral challenge campaign",
          status: "ACTIVE",
          registrationEnabled: true,
          leaderboardVisible: true,
          goldReward: 10000,
          silverReward: 7000,
          bronzeReward: 5000,
        },
      });
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error("Admin campaign error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const campaign = await prisma.campaign.upsert({
      where: { id: "referral-challenge-2026" },
      update: {
        name: body.name,
        status: body.status,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        registrationEnabled: body.registrationEnabled,
        leaderboardVisible: body.leaderboardVisible,
        goldReward: body.goldReward,
        silverReward: body.silverReward,
        bronzeReward: body.bronzeReward,
      },
      create: {
        id: "referral-challenge-2026",
        name: body.name || "Referral Challenge 2026",
        status: body.status || "ACTIVE",
        registrationEnabled: body.registrationEnabled ?? true,
        leaderboardVisible: body.leaderboardVisible ?? true,
        goldReward: body.goldReward || 10000,
        silverReward: body.silverReward || 7000,
        bronzeReward: body.bronzeReward || 5000,
      },
    });

    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    console.error("Admin campaign PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
