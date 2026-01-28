import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionCookie, verifyToken } from "@/lib/auth/jwt";

export async function GET() {
  try {
    const token = await getSessionCookie();
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      );
    }

    // Check if session exists and is not expired
    const session = await db.session.findUnique({
      where: { id: payload.sessionId },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: "Session expired" },
        { status: 401 }
      );
    }

    // Get user data with fields that exist in our schema
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        totalXp: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: { user } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
