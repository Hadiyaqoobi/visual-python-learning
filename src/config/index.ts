export const config = {
  app: {
    name: "Visual Python Learning",
    description: "Learn Python programming with visual execution",
    version: "0.1.0",
  },
  auth: {
    sessionDurationDays: 7,
    passwordMinLength: 8,
    saltRounds: 12,
  },
  python: {
    maxExecutionTimeMs: 10000,
    maxOutputLength: 10000,
  },
  curriculum: {
    totalChapters: 24,
    xpPerExercise: {
      BEGINNER: 10,
      INTERMEDIATE: 25,
      ADVANCED: 50,
    },
  },
} as const;

export default config;
