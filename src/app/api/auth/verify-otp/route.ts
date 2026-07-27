import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.trim();

    const record = await prisma.passwordResetOTP.findFirst({
      where: {
        email: normalizedEmail,
        used: false,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
    }

    if (record.attemptCount >= 5) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new code." },
        { status: 429 }
      );
    }

    if (new Date() > record.expiresAt) {
      return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 });
    }

    if (!crypto.timingSafeEqual(Buffer.from(record.otp), Buffer.from(normalizedOtp))) {
      await prisma.passwordResetOTP.update({
        where: { id: record.id },
        data: { attemptCount: { increment: 1 } },
      });

      const remaining = 5 - (record.attemptCount + 1);
      if (remaining <= 0) {
        return NextResponse.json(
          { error: "Too many failed attempts. Please request a new code." },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: `Invalid verification code. ${remaining} attempts remaining.` },
        { status: 400 }
      );
    }

    await prisma.passwordResetOTP.update({
      where: { id: record.id },
      data: { used: true },
    });

    return NextResponse.json({ message: "OTP verified successfully.", email: normalizedEmail });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
