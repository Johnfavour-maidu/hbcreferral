import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Hearts by Charming <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hbcreferral.vercel.app";

export async function sendWelcomeEmail({
  email,
  fullName,
  participantId,
  referralCode,
}: {
  email: string;
  fullName: string;
  participantId: string;
  referralCode: string;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to Hearts by Charming Referral Campaign!",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; background: #FFF8EF; margin: 0; padding: 40px 20px;">
          <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 16px; border: 1px solid #E7D8C6; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #4A2E1F, #6B3F2A); padding: 32px; text-align: center;">
              <h1 style="color: #FFF8EF; font-size: 22px; margin: 0;">Hearts by Charming</h1>
              <p style="color: #C89A2B; font-size: 13px; margin: 6px 0 0;">Referral Campaign 2026</p>
            </div>
            <div style="padding: 32px;">
              <h2 style="color: #2D2118; font-size: 20px; margin: 0 0 16px;">Welcome, ${fullName}! 👋</h2>
              <p style="color: #7B5B43; font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
                Thank you for joining the Hearts by Charming Referral Campaign. You're now part of an exclusive community competing to win amazing cash prizes.
              </p>
              <div style="background: #FFF8EF; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                <p style="color: #7B5B43; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px;">Your Participant ID</p>
                <p style="color: #C89A2B; font-size: 18px; font-weight: 800; margin: 0;">${participantId}</p>
              </div>
              <div style="background: #FFF8EF; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <p style="color: #7B5B43; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px;">Your Referral Code</p>
                <p style="color: #C89A2B; font-size: 18px; font-weight: 800; margin: 0;">${referralCode}</p>
              </div>
              <a href="${APP_URL}/dashboard" style="display: block; text-align: center; background: #C89A2B; color: white; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 600; font-size: 14px;">
                Go to Dashboard
              </a>
            </div>
            <div style="padding: 16px 32px; border-top: 1px solid #F0EBE3; text-align: center;">
              <p style="color: #A08060; font-size: 11px; margin: 0;">© 2026 Hearts by Charming. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

export async function sendReferralApprovedEmail({
  email,
  fullName,
  referredInstagram,
}: {
  email: string;
  fullName: string;
  referredInstagram: string;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Your Referral Has Been Approved! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; background: #FFF8EF; margin: 0; padding: 40px 20px;">
          <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 16px; border: 1px solid #E7D8C6; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #4A2E1F, #6B3F2A); padding: 32px; text-align: center;">
              <h1 style="color: #FFF8EF; font-size: 22px; margin: 0;">Hearts by Charming</h1>
              <p style="color: #C89A2B; font-size: 13px; margin: 6px 0 0;">Referral Campaign 2026</p>
            </div>
            <div style="padding: 32px;">
              <h2 style="color: #2D2118; font-size: 20px; margin: 0 0 16px;">Congratulations, ${fullName}! 🎉</h2>
              <p style="color: #7B5B43; font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
                Great news! Your referral <strong>@${referredInstagram.replace("@", "")}</strong> has been verified and approved by our team.
              </p>
              <div style="background: #DCFCE7; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center;">
                <p style="color: #16A34A; font-size: 14px; font-weight: 700; margin: 0;">+1 Verified Referral</p>
              </div>
              <p style="color: #7B5B43; font-size: 14px; line-height: 1.7; margin: 0 0 24px;">
                Keep sharing your referral link to climb the leaderboard and win bigger prizes!
              </p>
              <a href="${APP_URL}/dashboard" style="display: block; text-align: center; background: #C89A2B; color: white; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 600; font-size: 14px;">
                View Dashboard
              </a>
            </div>
            <div style="padding: 16px 32px; border-top: 1px solid #F0EBE3; text-align: center;">
              <p style="color: #A08060; font-size: 11px; margin: 0;">© 2026 Hearts by Charming. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Failed to send referral approved email:", error);
  }
}

export async function sendReferralRejectedEmail({
  email,
  fullName,
  referredInstagram,
}: {
  email: string;
  fullName: string;
  referredInstagram: string;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Referral Update - Action Required",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; background: #FFF8EF; margin: 0; padding: 40px 20px;">
          <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 16px; border: 1px solid #E7D8C6; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #4A2E1F, #6B3F2A); padding: 32px; text-align: center;">
              <h1 style="color: #FFF8EF; font-size: 22px; margin: 0;">Hearts by Charming</h1>
              <p style="color: #C89A2B; font-size: 13px; margin: 6px 0 0;">Referral Campaign 2026</p>
            </div>
            <div style="padding: 32px;">
              <h2 style="color: #2D2118; font-size: 20px; margin: 0 0 16px;">Referral Update</h2>
              <p style="color: #7B5B43; font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
                Hi ${fullName}, your referral <strong>@${referredInstagram.replace("@", "")}</strong> was not approved. This may be because the challenge steps were not completed correctly.
              </p>
              <div style="background: #FEE2E2; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <p style="color: #DC2626; font-size: 13px; font-weight: 600; margin: 0;">Please ensure your referrals:</p>
                <ul style="color: #7B5B43; font-size: 13px; margin: 8px 0 0; padding-left: 20px; line-height: 1.8;">
                  <li>Follow @heartsbycharming on Instagram</li>
                  <li>Like the specified post</li>
                  <li>Comment with "Referred by @yourusername"</li>
                </ul>
              </div>
              <a href="${APP_URL}/dashboard" style="display: block; text-align: center; background: #C89A2B; color: white; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 600; font-size: 14px;">
                View Dashboard
              </a>
            </div>
            <div style="padding: 16px 32px; border-top: 1px solid #F0EBE3; text-align: center;">
              <p style="color: #A08060; font-size: 11px; margin: 0;">© 2026 Hearts by Charming. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Failed to send referral rejected email:", error);
  }
}
