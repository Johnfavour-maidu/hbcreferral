import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, instagram } = body;

    if (!code || !instagram) {
      return NextResponse.json({ error: "Missing code or instagram" }, { status: 400 });
    }

    const normalizedInstagram = instagram.startsWith("@") ? instagram : `@${instagram}`;

    const referrerProfile = await prisma.profile.findFirst({
      where: { referralCode: code },
      select: { userId: true, instagram: true },
    });

    if (!referrerProfile) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    if (normalizedInstagram.toLowerCase() === referrerProfile.instagram?.toLowerCase()) {
      return NextResponse.json({ error: "You cannot refer yourself" }, { status: 400 });
    }

    const existingParticipant = await prisma.profile.findFirst({
      where: {
        instagram: {
          equals: normalizedInstagram,
          mode: "insensitive",
        },
      },
    });

    if (existingParticipant) {
      return NextResponse.json({ error: "This user is already a registered participant" }, { status: 400 });
    }

    const existing = await prisma.referral.findFirst({
      where: {
        referredInstagram: normalizedInstagram,
        campaignId: "referral-challenge-2026",
      },
    });

    if (existing) {
      return NextResponse.json({ error: "This username has already been invited by another participant" }, { status: 400 });
    }

    const referral = await prisma.referral.create({
      data: {
        referrerId: referrerProfile.userId,
        referredInstagram: normalizedInstagram,
        campaignId: "referral-challenge-2026",
        status: "PENDING",
      },
    });

    await prisma.profile.update({
      where: { userId: referrerProfile.userId },
      data: {
        totalReferrals: { increment: 1 },
        pendingReferrals: { increment: 1 },
      },
    });

    await prisma.notification.create({
      data: {
        userId: referrerProfile.userId,
        title: "New Referral!",
        message: `${normalizedInstagram} was referred by you and is pending verification.`,
        type: "referral",
      },
    });

    return NextResponse.json({ success: true, referralId: referral.id });
  } catch (error) {
    console.error("Challenge submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
