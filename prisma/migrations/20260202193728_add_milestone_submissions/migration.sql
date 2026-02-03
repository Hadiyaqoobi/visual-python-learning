-- CreateTable
CREATE TABLE "MilestoneSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "code" TEXT,
    "output" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MilestoneSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MilestoneSubmission_userId_projectId_idx" ON "MilestoneSubmission"("userId", "projectId");

-- AddForeignKey
ALTER TABLE "MilestoneSubmission" ADD CONSTRAINT "MilestoneSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestoneSubmission" ADD CONSTRAINT "MilestoneSubmission_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "GuidedProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestoneSubmission" ADD CONSTRAINT "MilestoneSubmission_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "ProjectMilestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
