import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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

    // Calculate stats for each chapter
    const chaptersWithStats = chapters.map((chapter) => {
      const totalLessons = chapter.sections.reduce(
        (acc, section) => acc + section.lessons.length,
        0
      );

      return {
        ...chapter,
        totalLessons,
        completedLessons: 0,
        progressPercent: 0,
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
