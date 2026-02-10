import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth/jwt";

type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

async function requireAuth(request: NextRequest): Promise<{ userId: string } | null> {
  const token = request.cookies.get("session")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload?.userId || !payload.sessionId) return null;

  // Enforce server-side session validity (logout/revocation + expiry).
  const session = await prisma.session.findUnique({
    where: { id: payload.sessionId },
    select: { userId: true, expiresAt: true },
  });

  if (!session) return null;
  if (session.userId !== payload.userId) return null;
  if (session.expiresAt < new Date()) return null;

  return { userId: payload.userId };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;

    const lesson = await prisma.lesson.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: auth.userId,
          lessonId: lesson.id,
        },
      },
      select: {
        lessonId: true,
        status: true,
        startedAt: true,
        completedAt: true,
        timeSpent: true,
      },
    });

    return NextResponse.json({
      success: true,
      progress: progress ?? {
        lessonId: lesson.id,
        status: "NOT_STARTED" satisfies ProgressStatus,
        startedAt: null,
        completedAt: null,
        timeSpent: 0,
      },
    });
  } catch (error) {
    console.error("Lesson progress GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const lesson = await prisma.lesson.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const action = body?.action;
    const now = new Date();

    const existing = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: auth.userId,
          lessonId: lesson.id,
        },
      },
      select: { status: true, startedAt: true, timeSpent: true },
    });

    if (action === "start") {
      // Idempotent: do not regress COMPLETED -> IN_PROGRESS.
      if (existing?.status === "COMPLETED") {
        return NextResponse.json({ success: true, progress: existing });
      }

      const progress = await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: auth.userId,
            lessonId: lesson.id,
          },
        },
        update: {
          status: "IN_PROGRESS",
          startedAt: existing?.startedAt ?? now,
        },
        create: {
          userId: auth.userId,
          lessonId: lesson.id,
          status: "IN_PROGRESS",
          startedAt: now,
        },
        select: {
          lessonId: true,
          status: true,
          startedAt: true,
          completedAt: true,
          timeSpent: true,
        },
      });

      return NextResponse.json({ success: true, progress });
    }

    if (action === "complete") {
      const progress = await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: auth.userId,
            lessonId: lesson.id,
          },
        },
        update: {
          status: "COMPLETED",
          completedAt: now,
          startedAt: existing?.startedAt ?? now,
        },
        create: {
          userId: auth.userId,
          lessonId: lesson.id,
          status: "COMPLETED",
          startedAt: now,
          completedAt: now,
        },
        select: {
          lessonId: true,
          status: true,
          startedAt: true,
          completedAt: true,
          timeSpent: true,
        },
      });

      return NextResponse.json({ success: true, progress });
    }

    if (action === "add_time") {
      const deltaSeconds = Number(body?.timeSpentDeltaSeconds);
      if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) {
        return NextResponse.json(
          { error: "Invalid timeSpentDeltaSeconds" },
          { status: 400 }
        );
      }

      const progress = await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: auth.userId,
            lessonId: lesson.id,
          },
        },
        update: {
          timeSpent: (existing?.timeSpent ?? 0) + deltaSeconds,
          startedAt: existing?.startedAt ?? now,
          // If there's no record yet, treat time as starting the lesson.
          status: existing?.status ?? "IN_PROGRESS",
        },
        create: {
          userId: auth.userId,
          lessonId: lesson.id,
          status: "IN_PROGRESS",
          startedAt: now,
          timeSpent: deltaSeconds,
        },
        select: {
          lessonId: true,
          status: true,
          startedAt: true,
          completedAt: true,
          timeSpent: true,
        },
      });

      return NextResponse.json({ success: true, progress });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Lesson progress POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

