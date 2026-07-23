import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const verifications = await prisma.referral.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        referrer: {
          include: { profile: { select: { fullName: true } } },
        },
        referredUser: {
          include: { profile: { select: { fullName: true, instagram: true } } },
        },
      },
    });

    const formatted = verifications.map((v) => ({
      id: v.id,
      referrerName: v.referrer.profile?.fullName || "Unknown",
      referredName: v.referredUser?.profile?.fullName || "Unknown",
      referredInstagram: v.referredUser?.profile?.instagram || v.referredInstagram,
      status: v.status,
      createdAt: v.createdAt.toISOString(),
    }));

    return NextResponse.json({ verifications: formatted });
  } catch (error) {
    console.error("Admin verify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, action } = body;

    const referral = await prisma.referral.findUnique({ where: { id } });
    if (!referral) {
      return NextResponse.json({ error: "Referral not found" }, { status: 404 });
    }

    const updated = await prisma.referral.update({
      where: { id },
      data: {
        status: action === "approve" ? "VERIFIED" : "REJECTED",
        verifiedAt: action === "approve" ? new Date() : null,
        verifiedBy: session.user.id,
      },
    });

    if (action === "approve") {
      const profile = await prisma.profile.findFirst({
        where: { userId: referral.referrerId },
      });

      if (profile) {
        await prisma.profile.update({
          where: { id: profile.id },
          data: {
            verifiedReferrals: { increment: 1 },
            pendingReferrals: { decrement: 1 },
          },
        });

        await prisma.notification.create({
          data: {
            userId: referral.referrerId,
            title: "Congratulations!",
            message: `Your referral @${referral.referredInstagram.replace("@", "")} has been approved.`,
            type: "verification",
          },
        });
      }
    } else {
      const profile = await prisma.profile.findFirst({
        where: { userId: referral.referrerId },
      });

      if (profile) {
        await prisma.profile.update({
          where: { id: profile.id },
          data: {
            pendingReferrals: { decrement: 1 },
          },
        });

        await prisma.notification.create({
          data: {
            userId: referral.referrerId,
            title: "Referral rejected.",
            message: `See admin notes for details.`,
            type: "verification",
          },
        });
      }
    }

    await prisma.verificationLog.create({
      data: {
        userId: referral.referrerId,
        action: action === "approve" ? "APPROVED" : "REJECTED",
        performedBy: session.user.id,
        details: `Referral ${action === "approve" ? "approved" : "rejected"}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin verify PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
