import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';
import { validateMilestoneSubmission } from '@/lib/validation/milestone-validator';

// GET - Get user's progress for a project
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectSlug = searchParams.get('projectSlug');

    if (!projectSlug) {
      const progress = await prisma.userProjectProgress.findMany({
        where: { userId: payload.userId },
        include: {
          project: {
            include: { milestones: true }
          }
        }
      });
      return NextResponse.json({ progress });
    }

    const project = await prisma.guidedProject.findUnique({
      where: { slug: projectSlug },
      include: { milestones: { orderBy: { order: 'asc' } } }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const userProgress = await prisma.userProjectProgress.findUnique({
      where: {
        userId_projectId: {
          userId: payload.userId,
          projectId: project.id
        }
      }
    });

    // Get completed milestones (submissions)
    const submissions = await prisma.milestoneSubmission.findMany({
      where: {
        userId: payload.userId,
        projectId: project.id
      },
      select: { chapterNumber: true }
    });
    const completedChapters = submissions.map(s => s.chapterNumber);

    const totalMilestones = project.milestones.length;
    const currentMilestone = userProgress?.currentMilestone || 1;
    const completedMilestones = completedChapters.length;
    const percentComplete = Math.round((completedMilestones / totalMilestones) * 100);

    return NextResponse.json({
      projectId: project.id,
      projectSlug: project.slug,
      totalMilestones,
      currentMilestone,
      completedMilestones,
      completedChapters,
      percentComplete,
      status: userProgress?.status || 'NOT_STARTED',
      startedAt: userProgress?.startedAt,
      completedAt: userProgress?.completedAt
    });
  } catch (error) {
    console.error('Progress GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Start a project or mark milestone complete
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { projectSlug, action, milestoneChapter, proof } = body;

    const project = await prisma.guidedProject.findUnique({
      where: { slug: projectSlug },
      include: { milestones: { orderBy: { order: 'asc' } } }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (action === 'start') {
      const progress = await prisma.userProjectProgress.upsert({
        where: {
          userId_projectId: {
            userId: payload.userId,
            projectId: project.id
          }
        },
        update: {
          status: 'IN_PROGRESS',
          startedAt: new Date()
        },
        create: {
          userId: payload.userId,
          projectId: project.id,
          currentMilestone: project.milestones[0]?.chapterNumber || 1,
          status: 'IN_PROGRESS',
          startedAt: new Date()
        }
      });

      return NextResponse.json({ message: 'Project started', progress });
    }

    if (action === 'complete_milestone') {
      const milestone = project.milestones.find(m => m.chapterNumber === milestoneChapter);
      if (!milestone) {
        return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
      }

      // Check if already submitted
      const existingSubmission = await prisma.milestoneSubmission.findFirst({
        where: {
          userId: payload.userId,
          projectId: project.id,
          chapterNumber: milestoneChapter
        }
      });

      if (existingSubmission) {
        return NextResponse.json({ error: 'Milestone already completed' }, { status: 400 });
      }

      // ============ AUTOMATED VALIDATION ============
      console.log('Validating chapter:', milestoneChapter);
      console.log('Code length:', proof?.code?.length || 0);
      
      const validation = validateMilestoneSubmission(
        milestoneChapter,
        proof?.code || null,
        proof?.output || null
      );

      console.log('Validation result:', validation);

      if (!validation.isValid) {
        return NextResponse.json({
          error: 'Validation failed',
          validationErrors: validation.errors,
          validationWarnings: validation.warnings
        }, { status: 400 });
      }
      // ============================================

      // Save the submission with proof
      await prisma.milestoneSubmission.create({
        data: {
          userId: payload.userId,
          projectId: project.id,
          milestoneId: milestone.id,
          chapterNumber: milestoneChapter,
          code: proof?.code || null,
          output: proof?.output || null
        }
      });

      // Find next milestone
      const currentIndex = project.milestones.findIndex(m => m.chapterNumber === milestoneChapter);
      const nextMilestone = project.milestones[currentIndex + 1];
      const isLastMilestone = !nextMilestone;

      // Update progress
      const progress = await prisma.userProjectProgress.upsert({
        where: {
          userId_projectId: {
            userId: payload.userId,
            projectId: project.id
          }
        },
        update: {
          currentMilestone: nextMilestone ? nextMilestone.chapterNumber : milestoneChapter,
          status: isLastMilestone ? 'COMPLETED' : 'IN_PROGRESS',
          completedAt: isLastMilestone ? new Date() : null
        },
        create: {
          userId: payload.userId,
          projectId: project.id,
          currentMilestone: nextMilestone ? nextMilestone.chapterNumber : milestoneChapter,
          status: isLastMilestone ? 'COMPLETED' : 'IN_PROGRESS',
          startedAt: new Date(),
          completedAt: isLastMilestone ? new Date() : null
        }
      });

      // Award XP
      await prisma.user.update({
        where: { id: payload.userId },
        data: { totalXp: { increment: 50 } }
      });

      return NextResponse.json({
        message: isLastMilestone ? 'Project completed!' : 'Milestone completed!',
        progress,
        xpEarned: 50,
        isProjectComplete: isLastMilestone,
        nextMilestone: nextMilestone?.chapterNumber || null,
        validationWarnings: validation.warnings
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Progress POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
