import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const lesson = await db.lesson.findUnique({
      where: { slug },
      include: {
        exercises: {
          orderBy: { order: "asc" },
        },
        section: {
          include: {
            chapter: {
              select: {
                id: true,
                number: true,
                title: true,
              },
            },
            lessons: {
              where: { isPublished: true },
              orderBy: { order: "asc" },
              select: {
                id: true,
                number: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Find previous and next lessons
    const allLessons = lesson.section.lessons;
    const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    return NextResponse.json({
      ...lesson,
      codeExamples: JSON.parse(lesson.codeExamples as string || "[]"),
      prevLesson,
      nextLesson,
    });
  } catch (error) {
    console.error("Failed to fetch lesson:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}
