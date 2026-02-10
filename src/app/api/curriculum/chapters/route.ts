import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth/jwt";

export async function GET() {
  try {
    // Optional auth: curriculum content can be fetched without auth, but progress stats are user-specific.
    let userId: string | null = null;
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("session")?.value;
      if (token) {
        const payload = await verifyToken(token);
        if (payload?.userId && payload.sessionId) {
          const session = await prisma.session.findUnique({
            where: { id: payload.sessionId },
            select: { userId: true, expiresAt: true },
          });
          if (
            session &&
            session.userId === payload.userId &&
            session.expiresAt >= new Date()
          ) {
            userId = payload.userId;
          }
        }
      }
    } catch {
      userId = null;
    }

    const chapters = await prisma.chapter.findMany({
      where: { isPublished: true },
      orderBy: { number: "asc" },
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { order: "asc" },
              select: {
                id: true,
                number: true,
                title: true,
                slug: true,
                estimatedTime: true,
                difficulty: true,
              },
            },
          },
        },
      },
    });

    const completedLessonIds = new Set<string>();
    if (userId) {
      const completed = await prisma.lessonProgress.findMany({
        where: { userId, status: "COMPLETED" },
        select: { lessonId: true },
      });
      for (const row of completed) completedLessonIds.add(row.lessonId);
    }

    // Calculate stats for each chapter
    const chaptersWithStats = chapters.map((chapter) => {
      const totalLessons = chapter.sections.reduce(
        (acc, section) => acc + section.lessons.length,
        0
      );

      const completedLessons = userId
        ? chapter.sections.reduce((acc, section) => {
            return (
              acc +
              section.lessons.reduce(
                (lAcc, lesson) => lAcc + (completedLessonIds.has(lesson.id) ? 1 : 0),
                0
              )
            );
          }, 0)
        : 0;

      return {
        ...chapter,
        totalLessons,
        completedLessons,
        progressPercent:
          totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      };
    });

    return NextResponse.json(chaptersWithStats);
  } catch (error) {
    console.error("Failed to fetch chapters:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapters" },
      { status: 500 }
    );
  }
}
