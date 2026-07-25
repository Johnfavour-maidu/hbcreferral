import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendReferralApprovedEmail, sendReferralRejectedEmail } from "@/lib/email";

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
      referredInstagram: v.referredInstagram,
      followsPage: v.followsPage,
      likedPost: v.likedPost,
      commentedPost: v.commentedPost,
      commentText: v.commentText,
      status: v.status,
      createdAt: v.createdAt.toISOString(),
    }));

    return NextResponse.json({ verifications: formatted });
  } catch (error) {
    console.error("Admin verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, action, followsPage, likedPost, commentedPost } = body;

    const referral = await prisma.referral.findUnique({ where: { id } });
    if (!referral) {
      return NextResponse.json({ error: "Referral not found" }, { status: 404 });
    }

    const previousStatus = referral.status;

    if (action === "revoke" && previousStatus === "VERIFIED") {
      const profile = await prisma.profile.findFirst({ where: { userId: referral.referrerId } });
      if (profile) {
        await prisma.profile.update({
          where: { id: profile.id },
          data: {
            verifiedReferrals: { decrement: 1 },
            pendingReferrals: { increment: 1 },
          },
        });
      }

      await prisma.referral.update({
        where: { id },
        data: { status: "REJECTED", verifiedAt: null, verifiedBy: session.user.id },
      });

      await prisma.verificationLog.create({
        data: {
          userId: referral.referrerId,
          action: "APPROVAL_REVOKED",
          performedBy: session.user.id,
          details: `Referral approval revoked (was VERIFIED)`,
        },
      });

      await prisma.adminAuditLog.create({
        data: {
          adminId: session.user.id,
          adminEmail: session.user.email || "",
          action: "REFERRAL_APPROVAL_REVOKED",
          targetType: "REFERRAL",
          targetId: id,
          details: `Revoked approval for referral @${referral.referredInstagram} (was VERIFIED, now REJECTED)`,
        },
      });

      return NextResponse.json({ success: true });
    }

    if (action === "reverse" && previousStatus === "VERIFIED") {
      const profile = await prisma.profile.findFirst({ where: { userId: referral.referrerId } });
      if (profile) {
        await prisma.profile.update({
          where: { id: profile.id },
          data: {
            verifiedReferrals: { decrement: 1 },
            pendingReferrals: { increment: 1 },
          },
        });
      }

      await prisma.referral.update({
        where: { id },
        data: { status: "PENDING", verifiedAt: null, verifiedBy: null },
      });

      await prisma.verificationLog.create({
        data: {
          userId: referral.referrerId,
          action: "APPROVAL_REVERSED",
          performedBy: session.user.id,
          details: `Referral reversed to pending (was VERIFIED)`,
        },
      });

      await prisma.adminAuditLog.create({
        data: {
          adminId: session.user.id,
          adminEmail: session.user.email || "",
          action: "REFERRAL_REVERSED_TO_PENDING",
          targetType: "REFERRAL",
          targetId: id,
          details: `Reversed referral @${referral.referredInstagram} to PENDING (was VERIFIED)`,
        },
      });

      return NextResponse.json({ success: true });
    }

    const updateData: Record<string, unknown> = {
      status: action === "approve" ? "VERIFIED" : "REJECTED",
      verifiedAt: action === "approve" ? new Date() : null,
      verifiedBy: session.user.id,
    };

    if (followsPage !== undefined) updateData.followsPage = followsPage;
    if (likedPost !== undefined) updateData.likedPost = likedPost;
    if (commentedPost !== undefined) updateData.commentedPost = commentedPost;

    await prisma.referral.update({ where: { id }, data: updateData });

    const profile = await prisma.profile.findFirst({ where: { userId: referral.referrerId } });

    if (action === "approve" && profile) {
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

      const referrerUser = await prisma.user.findUnique({ where: { id: referral.referrerId }, select: { email: true } });
      if (referrerUser?.email) {
        sendReferralApprovedEmail({
          email: referrerUser.email,
          fullName: profile.fullName,
          referredInstagram: referral.referredInstagram,
        }).catch(console.error);
      }
    } else if (action === "reject" && profile) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: { pendingReferrals: { decrement: 1 } },
      });

      await prisma.notification.create({
        data: {
          userId: referral.referrerId,
          title: "Referral rejected.",
          message: `See admin notes for details.`,
          type: "verification",
        },
      });

      const referrerUser = await prisma.user.findUnique({ where: { id: referral.referrerId }, select: { email: true } });
      if (referrerUser?.email) {
        sendReferralRejectedEmail({
          email: referrerUser.email,
          fullName: profile.fullName,
          referredInstagram: referral.referredInstagram,
        }).catch(console.error);
      }
    }

    await prisma.verificationLog.create({
      data: {
        userId: referral.referrerId,
        action: action === "approve" ? "APPROVED" : "REJECTED",
        performedBy: session.user.id,
        details: `Referral ${action === "approve" ? "approved" : "rejected"} (was ${previousStatus})`,
      },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: session.user.id,
        adminEmail: session.user.email || "",
        action: action === "approve" ? "REFERRAL_APPROVED" : "REFERRAL_REJECTED",
        targetType: "REFERRAL",
        targetId: id,
        details: `Referral @${referral.referredInstagram} ${action === "approve" ? "approved" : "rejected"} (was ${previousStatus})`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin verify PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
