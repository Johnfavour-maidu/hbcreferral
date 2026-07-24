import { NextResponse } from "next/server";
import { Resend } from "resend";
import prisma from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({
        message: "If an account exists for this email address, a verification code has been sent.",
      });
    }

    const recentOTP = await prisma.passwordResetOTP.findFirst({
      where: {
        email: normalizedEmail,
        createdAt: { gte: new Date(Date.now() - 60 * 1000) },
      },
      orderBy: { createdAt: "desc" },
    });

    if (recentOTP) {
      return NextResponse.json(
        { error: "Please wait 60 seconds before requesting another code." },
        { status: 429 }
      );
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.passwordResetOTP.create({
      data: {
        email: normalizedEmail,
        otp,
        expiresAt,
      },
    });

    await resend.emails.send({
      from: "Hearts by Charming <onboarding@resend.dev>",
      to: normalizedEmail,
      subject: "Hearts by Charming Password Reset Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background-color:#FFF8EF;font-family:Georgia,'Times New Roman',serif;">
          <div style="max-width:480px;margin:0 auto;padding:48px 24px;">
            <div style="text-align:center;margin-bottom:32px;">
              <h1 style="font-size:22px;font-weight:700;color:#2D2118;margin:0 0 4px;">Hearts by Charming</h1>
              <p style="font-size:12px;color:#A08060;margin:0;">Referral Challenge 2026</p>
            </div>
            <div style="background:#fff;border:1.5px solid #E7D8C6;border-radius:16px;padding:32px 28px;">
              <h2 style="font-size:18px;font-weight:700;color:#2D2118;margin:0 0 12px;text-align:center;">Password Reset Code</h2>
              <p style="font-size:14px;color:#7B5B43;margin:0 0 24px;text-align:center;">Hello,</p>
              <p style="font-size:14px;color:#7B5B43;margin:0 0 8px;text-align:center;">Your password reset code is:</p>
              <div style="text-align:center;margin:20px 0;">
                <span style="display:inline-block;font-size:32px;font-weight:800;color:#C89A2B;letter-spacing:8px;background:#FEF3C7;padding:12px 28px;border-radius:12px;">${otp}</span>
              </div>
              <p style="font-size:13px;color:#A08060;margin:24px 0 0;text-align:center;">This code expires in <strong>10 minutes</strong>.</p>
              <p style="font-size:13px;color:#A08060;margin:8px 0 0;text-align:center;">If you did not request this password reset, you can safely ignore this email.</p>
            </div>
            <p style="font-size:11px;color:#A08060;text-align:center;margin-top:24px;">&copy; ${new Date().getFullYear()} Hearts by Charming. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      message: "If an account exists for this email address, a verification code has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
