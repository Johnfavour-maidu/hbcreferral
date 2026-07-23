import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const participants = await prisma.user.findMany({
      where: { role: "PARTICIPANT" },
      include: { profile: true },
      orderBy: { createdAt: "desc" },
    });

    const formatted = participants.map((p) => ({
      id: p.id,
      participantId: p.profile?.participantId || "",
      fullName: p.profile?.fullName || "",
      email: p.email,
      phone: p.phone,
      instagram: p.profile?.instagram || "",
      state: p.profile?.state || "",
      school: p.profile?.school || "",
      referralCode: p.profile?.referralCode || "",
      totalReferrals: p.profile?.totalReferrals || 0,
      verifiedReferrals: p.profile?.verifiedReferrals || 0,
      isActive: p.isActive,
      createdAt: p.createdAt.toISOString(),
    }));

    return NextResponse.json({ participants: formatted });
  } catch (error) {
    console.error("Admin participants error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Participant ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete participant error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
