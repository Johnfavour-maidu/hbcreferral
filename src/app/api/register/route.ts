import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateReferralCode, generateReferralLink, generateParticipantId } from "@/lib/referral";
import { registerSchema } from "@/lib/validations";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    const normalizedInstagram = validated.instagram.startsWith("@")
      ? validated.instagram
      : `@${validated.instagram}`;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validated.email },
          { phone: validated.phone },
        ],
      },
    });

    if (existingUser) {
      const field = existingUser.email === validated.email ? "email" : "phone number";
      return NextResponse.json(
        { error: `This ${field} is already registered` },
        { status: 400 }
      );
    }

    const existingInstagram = await prisma.profile.findFirst({
      where: { instagram: normalizedInstagram },
    });

    if (existingInstagram) {
      return NextResponse.json(
        { error: "This Instagram username is already registered" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(validated.password, 12);
    const referralCode = await generateReferralCode();
    const referralLink = generateReferralLink(referralCode);
    const participantId = await generateParticipantId();

    let referredById: string | undefined;
    if (validated.referredBy) {
      const referrerProfile = await prisma.profile.findFirst({
        where: { referralCode: validated.referredBy },
      });
      if (referrerProfile) {
        referredById = referrerProfile.userId;
      }
    }

    const user = await prisma.user.create({
      data: {
        email: validated.email,
        phone: validated.phone,
        passwordHash,
        profile: {
          create: {
            participantId,
            fullName: validated.fullName,
            instagram: normalizedInstagram,
            state: validated.state || "",
            referralCode,
            referralLink,
          },
        },
      },
      include: { profile: true },
    });

    if (referredById && referredById !== user.id) {
      await prisma.referral.create({
        data: {
          referrerId: referredById,
          referredById: user.id,
          referredEmail: validated.email,
          referredPhone: validated.phone,
          referredInstagram: normalizedInstagram,
          campaignId: "referral-challenge-2026",
          status: "PENDING",
        },
      });

      await prisma.profile.update({
        where: { userId: referredById },
        data: {
          totalReferrals: { increment: 1 },
          pendingReferrals: { increment: 1 },
        },
      });

      await prisma.notification.create({
        data: {
          userId: referredById,
          title: "New referral received!",
          message: `Instagram: ${normalizedInstagram}\nStatus: Pending Verification`,
          type: "referral",
        },
      });
    }

    sendWelcomeEmail({
      email: validated.email,
      fullName: validated.fullName,
      participantId,
      referralCode,
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.profile?.fullName,
        participantId: user.profile?.participantId,
        referralCode: user.profile?.referralCode,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
