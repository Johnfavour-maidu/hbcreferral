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
      referralCode: p.profile?.referralCode || "",
      totalReferrals: p.profile?.totalReferrals || 0,
      verifiedReferrals: p.profile?.verifiedReferrals || 0,
      isActive: p.isActive,
      participantStatus: p.participantStatus,
      createdAt: p.createdAt.toISOString(),
    }));

    return NextResponse.json({ participants: formatted });
  } catch (error) {
    console.error("Admin participants error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json({ error: "ID and action are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, participantStatus: true } });
    if (!user) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }

    if (action === "suspend") {
      await prisma.user.update({
        where: { id },
        data: { participantStatus: "SUSPENDED", isActive: false },
      });
      await prisma.adminAuditLog.create({
        data: {
          adminId: session.user.id,
          adminEmail: session.user.email || "",
          action: "PARTICIPANT_SUSPENDED",
          targetType: "USER",
          targetId: id,
          details: `Suspended participant ${user.email}`,
        },
      });
      return NextResponse.json({ success: true, message: "Participant suspended" });
    }

    if (action === "restore") {
      await prisma.user.update({
        where: { id },
        data: { participantStatus: "ACTIVE", isActive: true },
      });
      await prisma.adminAuditLog.create({
        data: {
          adminId: session.user.id,
          adminEmail: session.user.email || "",
          action: "PARTICIPANT_RESTORED",
          targetType: "USER",
          targetId: id,
          details: `Restored participant ${user.email}`,
        },
      });
      return NextResponse.json({ success: true, message: "Participant restored" });
    }

    if (action === "softDelete") {
      await prisma.user.update({
        where: { id },
        data: { participantStatus: "DELETED", isActive: false },
      });
      await prisma.adminAuditLog.create({
        data: {
          adminId: session.user.id,
          adminEmail: session.user.email || "",
          action: "PARTICIPANT_DELETED",
          targetType: "USER",
          targetId: id,
          details: `Soft deleted participant ${user.email}`,
        },
      });
      return NextResponse.json({ success: true, message: "Participant moved to recycle bin" });
    }

    if (action === "permanentDelete") {
      await prisma.adminAuditLog.create({
        data: {
          adminId: session.user.id,
          adminEmail: session.user.email || "",
          action: "PARTICIPANT_PERMANENTLY_DELETED",
          targetType: "USER",
          targetId: id,
          details: `Permanently deleted participant ${user.email}`,
        },
      });
      await prisma.user.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "Participant permanently deleted" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin participants PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete participant error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
