// Curriculum Types for Frontend Use

export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type ExerciseType = "CODE" | "MULTIPLE_CHOICE" | "TEXT_RESPONSE" | "FILL_BLANK" | "FIX_BUG" | "PREDICT_OUTPUT";
export type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

// Code Example structure
export interface CodeExample {
  id: string;
  title: string;
  code: string;
  description?: string;
  highlightLines?: number[];
}

// Test Case structure for exercises
export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  description?: string;
}

// Chapter with sections
export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  objectives: string[];
  imageUrl?: string;
  isPublished: boolean;
  sections: Section[];
}

// Chapter summary (for listing)
export interface ChapterSummary {
  id: string;
  number: number;
  title: string;
  description: string;
  imageUrl?: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
}

// Section with lessons
export interface Section {
  id: string;
  chapterId: string;
  number: number;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

// Full lesson data
export interface Lesson {
  id: string;
  sectionId: string;
  number: number;
  title: string;
  slug: string;
  objectives: string[];
  content: string;
  codeExamples: CodeExample[];
  keyPoints: string[];
  hardwareDemo?: string;
  estimatedTime: number;
  difficulty: Difficulty;
  order: number;
  isPublished: boolean;
  exercises: Exercise[];
}

// Lesson summary (for navigation)
export interface LessonSummary {
  id: string;
  number: number;
  title: string;
  slug: string;
  estimatedTime: number;
  difficulty: Difficulty;
  status: ProgressStatus;
  exerciseCount: number;
  completedExercises: number;
}

// Exercise data
export interface Exercise {
  id: string;
  lessonId: string;
  number: number;
  title: string;
  prompt: string;
  type: ExerciseType;
  starterCode?: string;
  solution?: string;
  hints: string[];
  testCases?: TestCase[];
  xpReward: number;
  difficulty: Difficulty;
  order: number;
}

// User progress on a lesson
export interface LessonProgress {
  lessonId: string;
  status: ProgressStatus;
  startedAt?: Date;
  completedAt?: Date;
  timeSpent: number;
}

// User attempt on an exercise
export interface ExerciseAttempt {
  id: string;
  exerciseId: string;
  code?: string;
  response?: string;
  isCorrect: boolean;
  xpEarned: number;
  feedback?: string;
  attemptNumber: number;
  createdAt: Date;
}

// Navigation structure for sidebar
export interface ChapterNavigation {
  chapters: {
    id: string;
    number: number;
    title: string;
    sections: {
      id: string;
      number: number;
      title: string;
      lessons: {
        id: string;
        number: number;
        title: string;
        slug: string;
        status: ProgressStatus;
      }[];
    }[];
  }[];
}

// User stats
export interface UserStats {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  exercisesCompleted: number;
  totalTimeSpent: number; // seconds
  chaptersCompleted: number;
}

export default {
  Difficulty,
  ExerciseType,
  ProgressStatus,
};
