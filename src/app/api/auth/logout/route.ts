import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionCookie, deleteSessionCookie, verifyToken } from "@/lib/auth/jwt";

export async function POST() {
  try {
    const token = await getSessionCookie();

    if (token) {
      const payload = await verifyToken(token);

      if (payload?.sessionId) {
        // Delete session from database
        await db.session.delete({
          where: { id: payload.sessionId },
        }).catch(() => {
          // Session might already be deleted, ignore error
        });
      }

      // Clear the cookie
      await deleteSessionCookie();
    }

    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);

    // Still try to clear the cookie even if there's an error
    await deleteSessionCookie();

    return NextResponse.json(
      { success: true, message: "Logged out" },
      { status: 200 }
    );
  }
}
