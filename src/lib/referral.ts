import prisma from "./prisma";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCode(length: number = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return code;
}

export async function generateReferralCode(): Promise<string> {
  let code: string;
  let attempts = 0;

  do {
    code = `HBC-${generateCode(5)}`;
    attempts++;
    if (attempts > 100) {
      code = `HBC-${generateCode(6)}`;
      break;
    }
  } while (
    await prisma.profile.findFirst({ where: { referralCode: code } })
  );

  return code;
}

export function generateReferralLink(code: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://heartsbycharming.org";
  return `${base}/r/${code}`;
}

export async function validateReferralCode(code: string) {
  const profile = await prisma.profile.findUnique({
    where: { referralCode: code },
    include: { user: { select: { id: true, isActive: true } } },
  });

  if (!profile || !profile.user.isActive) return null;

  return {
    userId: profile.userId,
    fullName: profile.fullName,
    code: profile.referralCode,
  };
}

export async function createReferral(
  referrerProfileId: string,
  referredUserId: string,
  referredEmail: string,
  referredPhone: string,
  referredInstagram: string,
  campaignId: string = "referral-challenge-2026"
) {
  const existingReferral = await prisma.referral.findFirst({
    where: {
      OR: [
        { referredById: referredUserId },
        { referredEmail },
        { referredPhone },
        { referredInstagram },
      ],
    },
  });

  if (existingReferral) {
    throw new Error("This user has already been referred or registered");
  }

  const referrerProfile = await prisma.profile.findUnique({
    where: { id: referrerProfileId },
  });

  if (!referrerProfile || referrerProfile.userId === referredUserId) {
    throw new Error("Cannot refer yourself");
  }

  return prisma.$transaction(async (tx) => {
    const referral = await tx.referral.create({
      data: {
        referrerId: referrerProfile.userId,
        referredById: referredUserId,
        referredEmail,
        referredPhone,
        referredInstagram,
        campaignId,
        status: "PENDING",
      },
    });

    await tx.profile.update({
      where: { id: referrerProfileId },
      data: {
        totalReferrals: { increment: 1 },
        pendingReferrals: { increment: 1 },
      },
    });

    await tx.notification.create({
      data: {
        userId: referrerProfile.userId,
        title: "New Referral!",
        message: `Someone joined using your referral link!`,
        type: "referral",
      },
    });

    return referral;
  });
}

export async function verifyReferral(
  referralId: string,
  adminId: string,
  approved: boolean,
  reason?: string
) {
  return prisma.$transaction(async (tx) => {
    const referral = await tx.referral.findUnique({
      where: { id: referralId },
    });

    if (!referral || referral.status !== "PENDING") {
      throw new Error("Invalid referral");
    }

    const updatedReferral = await tx.referral.update({
      where: { id: referralId },
      data: {
        status: approved ? "VERIFIED" : "REJECTED",
        verifiedAt: approved ? new Date() : null,
        verifiedBy: adminId,
        rejectionReason: approved ? null : reason,
      },
    });

    const profile = await tx.profile.findFirst({
      where: { userId: referral.referrerId },
    });

    if (profile) {
      await tx.profile.update({
        where: { id: profile.id },
        data: {
          verifiedReferrals: approved
            ? { increment: 1 }
            : profile.verifiedReferrals,
          pendingReferrals: { decrement: 1 },
        },
      });

      if (approved) {
        await tx.notification.create({
          data: {
            userId: referral.referrerId,
            title: "Referral Verified!",
            message: `A referral has been verified. Keep going!`,
            type: "verification",
          },
        });
      }
    }

    await tx.verificationLog.create({
      data: {
        userId: referral.referrerId,
        action: approved ? "APPROVED" : "REJECTED",
        performedBy: adminId,
        details: reason || `Referral ${approved ? "approved" : "rejected"}`,
      },
    });

    return updatedReferral;
  });
}
