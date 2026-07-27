import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { applyRateLimit } from "@/lib/api-rate-limit";

export async function POST(request: Request) {
  const rateLimitResponse = applyRateLimit(request, "reset-password");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { email, otp, newPassword, confirmPassword } = await request.json();

    if (!email || !otp || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json({ error: "Password must contain an uppercase letter" }, { status: 400 });
    }

    if (!/[a-z]/.test(newPassword)) {
      return NextResponse.json({ error: "Password must contain a lowercase letter" }, { status: 400 });
    }

    if (!/[0-9]/.test(newPassword)) {
      return NextResponse.json({ error: "Password must contain a number" }, { status: 400 });
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      return NextResponse.json({ error: "Password must contain a special character" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otpHash = crypto.createHash("sha256").update(otp.trim()).digest("hex");

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

    if (new Date() > record.expiresAt) {
      return NextResponse.json({ error: "Verification code has expired." }, { status: 400 });
    }

    if (!crypto.timingSafeEqual(Buffer.from(record.otp), Buffer.from(otpHash))) {
      return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    await prisma.passwordResetOTP.updateMany({
      where: { email: normalizedEmail, used: false },
      data: { used: true },
    });

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
