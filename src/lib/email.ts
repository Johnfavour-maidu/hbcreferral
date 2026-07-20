import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    await resend.emails.send({
      from: "Hearts by Charming <noreply@heartsbycharming.org>",
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email send error:", error);
  }
}

export async function sendWelcomeEmail(name: string, email: string, referralCode: string, referralLink: string) {
  await sendEmail({
    to: email,
    subject: "Welcome to Hearts by Charming Referral Challenge!",
    html: `
      <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; background: #FFF8EF; padding: 40px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #5B2D90; font-size: 28px;">Welcome to Hearts by Charming! 💜</h1>
        </div>
        <p style="color: #4A2E1F; font-size: 16px; line-height: 1.8;">Hi ${name},</p>
        <p style="color: #4A2E1F; font-size: 16px; line-height: 1.8;">
          You've successfully joined the Hearts by Charming Referral Challenge 2026! We're thrilled to have you on board.
        </p>
        <div style="background: #5B2D90; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
          <p style="color: #C89A2B; font-size: 14px; margin-bottom: 8px;">YOUR REFERRAL CODE</p>
          <p style="color: #FFF8EF; font-size: 32px; font-weight: bold; letter-spacing: 4px;">${referralCode}</p>
        </div>
        <div style="background: #F5E6D0; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="color: #4A2E1F; font-size: 14px; margin-bottom: 8px;">SHARE YOUR LINK</p>
          <p style="color: #5B2D90; font-size: 16px; font-weight: 600; word-break: break-all;">${referralLink}</p>
        </div>
        <p style="color: #4A2E1F; font-size: 16px; line-height: 1.8;">
          Share your unique link with friends and earn rewards for every verified referral!
        </p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #5B2D90; color: #FFF8EF; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Go to Dashboard</a>
        </div>
      </div>
    `,
  });
}

export async function sendReferralVerifiedEmail(name: string, email: string, count: number) {
  await sendEmail({
    to: email,
    subject: "Your Referral Has Been Verified! 🎉",
    html: `
      <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; background: #FFF8EF; padding: 40px;">
        <h1 style="color: #5B2D90; font-size: 28px; text-align: center;">Referral Verified! 🎉</h1>
        <p style="color: #4A2E1F; font-size: 16px; line-height: 1.8;">Hi ${name},</p>
        <p style="color: #4A2E1F; font-size: 16px; line-height: 1.8;">
          Great news! One of your referrals has been verified. You now have <strong>${count}</strong> verified referral${count !== 1 ? "s" : ""}.
        </p>
        <p style="color: #4A2E1F; font-size: 16px; line-height: 1.8;">Keep sharing to earn more rewards!</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #C89A2B; color: #FFF8EF; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Dashboard</a>
        </div>
      </div>
    `,
  });
}

export async function sendLeaderboardUpdateEmail(name: string, email: string, position: number) {
  await sendEmail({
    to: email,
    subject: `You've moved to Position #${position}! 🏆`,
    html: `
      <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; background: #FFF8EF; padding: 40px;">
        <h1 style="color: #5B2D90; font-size: 28px; text-align: center;">Leaderboard Update 🏆</h1>
        <p style="color: #4A2E1F; font-size: 16px; line-height: 1.8;">Hi ${name},</p>
        <p style="color: #4A2E1F; font-size: 16px; line-height: 1.8;">
          Amazing! You've moved to <strong>Position #${position}</strong> on the leaderboard!
        </p>
        <p style="color: #4A2E1F; font-size: 16px; line-height: 1.8;">Keep it up!</p>
      </div>
    `,
  });
}

export async function sendRewardWinnerEmail(name: string, email: string, reward: string, amount: number) {
  await sendEmail({
    to: email,
    subject: `Congratulations! You've Won ${reward}! 🏅`,
    html: `
      <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; background: #FFF8EF; padding: 40px;">
        <h1 style="color: #C89A2B; font-size: 28px; text-align: center;">Congratulations! 🏅</h1>
        <p style="color: #4A2E1F; font-size: 16px; line-height: 1.8;">Hi ${name},</p>
        <p style="color: #4A2E1F; font-size: 16px; line-height: 1.8;">
          You've earned the <strong>${reward}</strong> reward worth <strong>₦${amount.toLocaleString()}</strong>!
        </p>
        <p style="color: #4A2E1F; font-size: 16px; line-height: 1.8;">We'll be in touch with details on how to claim your reward.</p>
      </div>
    `,
  });
}
