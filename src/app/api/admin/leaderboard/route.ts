import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profiles = await prisma.profile.findMany({
      include: {
        user: { select: { participantStatus: true, role: true } },
      },
      orderBy: [
        { verifiedReferrals: "desc" },
        { totalReferrals: "desc" },
        { createdAt: "asc" },
      ],
    });

    const leaderboard = profiles
      .filter((p) => p.user.role !== "ADMIN")
      .map((p, index) => ({
        rank: index + 1,
        userId: p.userId,
        fullName: p.fullName || "N/A",
        totalReferrals: p.totalReferrals,
        verifiedReferrals: p.verifiedReferrals,
        status: p.user.participantStatus,
      }));

    return Response.json({ leaderboard });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
