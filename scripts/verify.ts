import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ include: { profile: true } });
  console.log("Users:", users.length);
  users.forEach(u => console.log(" -", u.profile?.fullName, "|", u.email, "|", u.role));

  const referrals = await prisma.referral.findMany();
  console.log("Referrals:", referrals.length);

  const campaigns = await prisma.campaign.findMany();
  console.log("Campaigns:", campaigns.length);

  const notifications = await prisma.notification.findMany();
  console.log("Notifications:", notifications.length);
}

main()
  .finally(() => prisma.$disconnect());
