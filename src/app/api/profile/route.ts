import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, state, school, instagram } = body;

    // Validate required fields
    if (!fullName || fullName.trim().length < 3) {
      return NextResponse.json({ error: "Full name must be at least 3 characters" }, { status: 400 });
    }
    if (!phone || phone.trim().length < 10) {
      return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 });
    }
    if (!state || state.trim().length === 0) {
      return NextResponse.json({ error: "State is required" }, { status: 400 });
    }
    if (!instagram || instagram.trim().length === 0) {
      return NextResponse.json({ error: "Instagram username is required" }, { status: 400 });
    }

    // Clean instagram username
    const cleanInstagram = instagram.replace(/^@/, "").replace(/\s/g, "").toLowerCase();

    // Check phone duplicate
    const existingPhone = await prisma.user.findFirst({
      where: { phone: phone.trim(), id: { not: session.user.id } },
    });
    if (existingPhone) {
      return NextResponse.json({ error: "This phone number is already in use" }, { status: 400 });
    }

    // Check instagram duplicate
    const existingInstagram = await prisma.profile.findFirst({
      where: { instagram: cleanInstagram, userId: { not: session.user.id } },
    });
    if (existingInstagram) {
      return NextResponse.json({ error: "This Instagram username is already taken" }, { status: 400 });
    }

    // Fetch current profile for audit log
    const currentProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });
    if (!currentProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Track changes
    const changes: { field: string; old: string; new: string }[] = [];
    if (fullName.trim() !== currentProfile.fullName) changes.push({ field: "fullName", old: currentProfile.fullName, new: fullName.trim() });
    if (cleanInstagram !== currentProfile.instagram) changes.push({ field: "instagram", old: currentProfile.instagram, new: cleanInstagram });
    if ((state || "").trim() !== currentProfile.state) changes.push({ field: "state", old: currentProfile.state, new: (state || "").trim() });
    if ((school || "").trim() !== currentProfile.school) changes.push({ field: "school", old: currentProfile.school, new: (school || "").trim() });

    // Update user phone
    await prisma.user.update({
      where: { id: session.user.id },
      data: { phone: phone.trim() },
    });

    // Update profile
    await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        fullName: fullName.trim(),
        instagram: cleanInstagram,
        state: (state || "").trim(),
        school: (school || "").trim(),
      },
    });

    // Write audit log
    if (changes.length > 0) {
      await prisma.profileAuditLog.create({
        data: {
          participantId: currentProfile.participantId,
          changedFields: changes.map((c) => c.field).join(", "),
          oldValue: JSON.stringify(Object.fromEntries(changes.map((c) => [c.field, c.old]))),
          newValue: JSON.stringify(Object.fromEntries(changes.map((c) => [c.field, c.new]))),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
