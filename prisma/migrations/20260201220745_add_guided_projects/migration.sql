-- CreateTable
CREATE TABLE "GuidedProject" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "imageUrl" TEXT,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'BEGINNER',
    "estimatedHours" INTEGER NOT NULL DEFAULT 20,
    "technologies" TEXT[],
    "prerequisites" TEXT[],
    "learningOutcomes" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuidedProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMilestone" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "objectives" TEXT[],
    "instructions" TEXT NOT NULL,
    "starterCode" TEXT,
    "solutionCode" TEXT,
    "hints" TEXT[],
    "testInstructions" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProjectProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "currentMilestone" INTEGER NOT NULL DEFAULT 1,
    "currentCode" TEXT,
    "status" "ProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProjectProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuidedProject_slug_key" ON "GuidedProject"("slug");

-- CreateIndex
CREATE INDEX "GuidedProject_slug_idx" ON "GuidedProject"("slug");

-- CreateIndex
CREATE INDEX "GuidedProject_order_idx" ON "GuidedProject"("order");

-- CreateIndex
CREATE INDEX "ProjectMilestone_projectId_idx" ON "ProjectMilestone"("projectId");

-- CreateIndex
CREATE INDEX "ProjectMilestone_order_idx" ON "ProjectMilestone"("order");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMilestone_projectId_chapterNumber_key" ON "ProjectMilestone"("projectId", "chapterNumber");

-- CreateIndex
CREATE INDEX "UserProjectProgress_userId_idx" ON "UserProjectProgress"("userId");

-- CreateIndex
CREATE INDEX "UserProjectProgress_projectId_idx" ON "UserProjectProgress"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProjectProgress_userId_projectId_key" ON "UserProjectProgress"("userId", "projectId");

-- AddForeignKey
ALTER TABLE "ProjectMilestone" ADD CONSTRAINT "ProjectMilestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "GuidedProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjectProgress" ADD CONSTRAINT "UserProjectProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjectProgress" ADD CONSTRAINT "UserProjectProgress_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "GuidedProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
