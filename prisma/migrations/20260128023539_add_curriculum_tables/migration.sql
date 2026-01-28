/*
  Warnings:

  - You are about to drop the `chapter_progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chapters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exercise_attempts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exercises` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lessons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('CODE', 'MULTIPLE_CHOICE', 'TEXT_RESPONSE', 'FILL_BLANK', 'FIX_BUG', 'PREDICT_OUTPUT');

-- CreateEnum
CREATE TYPE "AchievementCategory" AS ENUM ('PROGRESS', 'STREAK', 'MASTERY', 'EXPLORATION', 'SOCIAL');

-- DropForeignKey
ALTER TABLE "chapter_progress" DROP CONSTRAINT "chapter_progress_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "chapter_progress" DROP CONSTRAINT "chapter_progress_userId_fkey";

-- DropForeignKey
ALTER TABLE "exercise_attempts" DROP CONSTRAINT "exercise_attempts_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "exercise_attempts" DROP CONSTRAINT "exercise_attempts_userId_fkey";

-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropTable
DROP TABLE "chapter_progress";

-- DropTable
DROP TABLE "chapters";

-- DropTable
DROP TABLE "exercise_attempts";

-- DropTable
DROP TABLE "exercises";

-- DropTable
DROP TABLE "lessons";

-- DropTable
DROP TABLE "sessions";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "totalXp" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "objectives" TEXT[],
    "imageUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "number" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "number" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "objectives" TEXT[],
    "content" TEXT NOT NULL,
    "codeExamples" JSONB NOT NULL,
    "keyPoints" TEXT[],
    "hardwareDemo" TEXT,
    "estimatedTime" INTEGER NOT NULL DEFAULT 15,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'BEGINNER',
    "order" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "type" "ExerciseType" NOT NULL DEFAULT 'CODE',
    "starterCode" TEXT,
    "solution" TEXT,
    "hints" TEXT[],
    "testCases" JSONB,
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'BEGINNER',
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "code" TEXT,
    "response" TEXT,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "feedback" TEXT,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExerciseAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "category" "AchievementCategory" NOT NULL DEFAULT 'PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_token_idx" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_number_key" ON "Chapter"("number");

-- CreateIndex
CREATE INDEX "Chapter_number_idx" ON "Chapter"("number");

-- CreateIndex
CREATE INDEX "Section_chapterId_idx" ON "Section"("chapterId");

-- CreateIndex
CREATE INDEX "Section_order_idx" ON "Section"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Section_chapterId_number_key" ON "Section"("chapterId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");

-- CreateIndex
CREATE INDEX "Lesson_sectionId_idx" ON "Lesson"("sectionId");

-- CreateIndex
CREATE INDEX "Lesson_slug_idx" ON "Lesson"("slug");

-- CreateIndex
CREATE INDEX "Lesson_order_idx" ON "Lesson"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_sectionId_number_key" ON "Lesson"("sectionId", "number");

-- CreateIndex
CREATE INDEX "Exercise_lessonId_idx" ON "Exercise"("lessonId");

-- CreateIndex
CREATE INDEX "Exercise_order_idx" ON "Exercise"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_lessonId_number_key" ON "Exercise"("lessonId", "number");

-- CreateIndex
CREATE INDEX "LessonProgress_userId_idx" ON "LessonProgress"("userId");

-- CreateIndex
CREATE INDEX "LessonProgress_lessonId_idx" ON "LessonProgress"("lessonId");

-- CreateIndex
CREATE INDEX "LessonProgress_status_idx" ON "LessonProgress"("status");

-- CreateIndex
CREATE UNIQUE INDEX "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "ExerciseAttempt_userId_idx" ON "ExerciseAttempt"("userId");

-- CreateIndex
CREATE INDEX "ExerciseAttempt_exerciseId_idx" ON "ExerciseAttempt"("exerciseId");

-- CreateIndex
CREATE INDEX "ExerciseAttempt_userId_exerciseId_idx" ON "ExerciseAttempt"("userId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_code_key" ON "Achievement"("code");

-- CreateIndex
CREATE INDEX "Achievement_code_idx" ON "Achievement"("code");

-- CreateIndex
CREATE INDEX "UserAchievement_userId_idx" ON "UserAchievement"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseAttempt" ADD CONSTRAINT "ExerciseAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseAttempt" ADD CONSTRAINT "ExerciseAttempt_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
