import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create campaign
  await prisma.campaign.upsert({
    where: { id: "referral-challenge-2026" },
    update: {},
    create: {
      id: "referral-challenge-2026",
      name: "Referral Challenge 2026",
      description: "The main Hearts by Charming referral challenge campaign",
      status: "ACTIVE",
      registrationEnabled: true,
      leaderboardVisible: true,
      goldReward: 20000,
      silverReward: 15000,
      bronzeReward: 10000,
    },
  });
  console.log("Campaign created");

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@heartsbycharming.org" },
    update: {},
    create: {
      email: "admin@heartsbycharming.org",
      phone: "+2348000000000",
      passwordHash: adminPassword,
      role: "ADMIN",
      profile: {
        create: {
          participantId: "HBC000000",
          fullName: "Admin User",
          instagram: "@heartsbycharming",
          state: "Lagos",
          referralCode: "HBC-ADMIN0",
          referralLink: "https://heartsbycharming.org/r/HBC-ADMIN0",
        },
      },
    },
  });
  console.log("Admin user created");

  // Create sample participants
  const sampleUsers = [
    { name: "Mary Johnson", email: "mary@example.com", phone: "+2348012345678", instagram: "@mary_j", state: "Lagos", code: "HBC-MARY1", pid: "HBC000001" },
    { name: "David Chen", email: "david@example.com", phone: "+2348012345679", instagram: "@david_c", state: "Abuja", code: "HBC-DAVI2", pid: "HBC000002" },
    { name: "Sarah Williams", email: "sarah@example.com", phone: "+2348012345680", instagram: "@sarah_w", state: "Rivers", code: "HBC-SARA3", pid: "HBC000003" },
    { name: "James Brown", email: "james@example.com", phone: "+2348012345681", instagram: "@james_b", state: "Oyo", code: "HBC-JAME4", pid: "HBC000004" },
    { name: "Grace Adekunle", email: "grace@example.com", phone: "+2348012345682", instagram: "@grace_a", state: "Ogun", code: "HBC-GRAC5", pid: "HBC000005" },
  ];

  const participantPassword = await bcrypt.hash("Participant@1", 12);

  for (const user of sampleUsers) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        phone: user.phone,
        passwordHash: participantPassword,
        role: "PARTICIPANT",
        profile: {
          create: {
            participantId: user.pid,
            fullName: user.name,
            instagram: user.instagram,
            state: user.state,
            referralCode: user.code,
            referralLink: `https://heartsbycharming.org/r/${user.code}`,
          },
        },
      },
      include: { profile: true },
    });
    console.log(`Participant created: ${user.name}`);
  }

  // Create some referrals
  const participants = await prisma.user.findMany({
    where: { role: "PARTICIPANT" },
    include: { profile: true },
  });

  if (participants.length >= 3) {
    const referrer = participants[0];
    const referred = participants[1];

    if (referrer.profile && referred) {
      await prisma.referral.upsert({
        where: { referredById: referred.id },
        update: {},
        create: {
          referrerId: referrer.id,
          referredById: referred.id,
          referredEmail: referred.email,
          referredPhone: referred.phone,
          referredInstagram: referred.profile?.instagram || "",
          campaignId: "referral-challenge-2026",
          status: "VERIFIED",
          verifiedAt: new Date(),
          verifiedBy: admin.id,
        },
      });

      await prisma.profile.update({
        where: { id: referrer.profile.id },
        data: {
          totalReferrals: 1,
          verifiedReferrals: 1,
        },
      });

      console.log("Sample referral created");
    }
  }

  // Create notifications
  for (const user of participants.slice(0, 2)) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Welcome!",
        message: "Welcome to Hearts by Charming Referral Challenge 2026!",
        type: "info",
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "New Referral",
        message: "Someone joined using your referral link!",
        type: "referral",
      },
    });
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
