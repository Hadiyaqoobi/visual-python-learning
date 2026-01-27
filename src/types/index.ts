// User Types
export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  emailVerified: boolean;
  currentChapter: number;
  totalXp: number;
  streak: number;
  lastActiveAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Chapter Types
export interface Chapter {
  id: number;
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
  isPublished: boolean;
}

// Exercise Types
export interface Exercise {
  id: string;
  chapterId: number;
  slug: string;
  title: string;
  description: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
  hints: string[] | null;
  xpReward: number;
  orderIndex: number;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description: string;
}

// Python Execution Types
export interface ExecutionResult {
  success: boolean;
  output: string;
  error: string | null;
  executionTime: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
