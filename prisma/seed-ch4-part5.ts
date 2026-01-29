import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 4 Part 5: Lesson 4.5.2 (Fibonacci & Recursion Patterns)...\n");

  const section4_5 = await prisma.section.findFirst({ where: { number: 4.5 } });
  if (!section4_5) throw new Error("Section 4.5 not found.");

  // ==================== LESSON 4.5.2 ====================
  const lesson4_5_2 = await prisma.lesson.upsert({
    where: { slug: "fibonacci-recursion-patterns" },
    update: {},
    create: {
      sectionId: section4_5.id,
      number: 4.52,
      title: "Fibonacci and Recursion Patterns",
      slug: "fibonacci-recursion-patterns",
      objectives: [
        "Implement Fibonacci recursively",
        "Understand multiple recursive calls",
        "Compare recursive vs iterative solutions",
        "Recognize recursion efficiency issues",
      ],
      content: `# Fibonacci and Recursion Patterns

## The Fibonacci Sequence

0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...

Each number is the sum of the two before it:
- fib(0) = 0
- fib(1) = 1
- fib(n) = fib(n-1) + fib(n-2)

## Recursive Implementation

\`\`\`python
def fib(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fib(n-1) + fib(n-2)
\`\`\`

Beautiful and matches the definition!

## The Efficiency Problem

fib(5) calls:
\`\`\`
fib(5)
├── fib(4)
│   ├── fib(3)
│   │   ├── fib(2)
│   │   │   ├── fib(1)
│   │   │   └── fib(0)
│   │   └── fib(1)
│   └── fib(2)
│       ├── fib(1)
│       └── fib(0)
└── fib(3)
    ├── fib(2)
    │   ├── fib(1)
    │   └── fib(0)
    └── fib(1)
\`\`\`

fib(2) is computed 3 times! This gets worse exponentially.

## Iterative Alternative

\`\`\`python
def fib_iterative(n):
    if n <= 1:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr
\`\`\`

Much faster! O(n) vs O(2^n).

## When Recursion Shines

Recursion is great for:
- **Tree structures** (file systems, HTML/XML)
- **Divide and conquer** (merge sort, quick sort)
- **Problems with recursive definitions**
- **Backtracking** (puzzles, mazes)

## Recursion vs Iteration

| Recursion | Iteration |
|-----------|-----------|
| Elegant for recursive problems | Usually faster |
| Uses stack space | Uses constant space |
| Can hit recursion limit | No depth limit |
| Natural for trees | Natural for sequences |`,
      codeExamples: JSON.stringify([
        {
          id: "fibonacci-recursive",
          title: "Recursive Fibonacci",
          code: "def fib(n):\n    \"\"\"Return nth Fibonacci number (recursive).\"\"\"\n    if n == 0:\n        return 0\n    elif n == 1:\n        return 1\n    else:\n        return fib(n - 1) + fib(n - 2)\n\n# Print first 10 Fibonacci numbers\nprint(\"Fibonacci sequence:\")\nfor i in range(10):\n    print(f\"fib({i}) = {fib(i)}\")\n\n# Note: Gets slow for larger n\n# fib(35) takes several seconds!",
          description: "Classic recursive Fibonacci",
        },
        {
          id: "fibonacci-iterative",
          title: "Iterative Fibonacci (Efficient)",
          code: "def fib_iterative(n):\n    \"\"\"Return nth Fibonacci number (iterative).\"\"\"\n    if n <= 1:\n        return n\n    \n    prev, curr = 0, 1\n    for _ in range(2, n + 1):\n        prev, curr = curr, prev + curr\n    return curr\n\n# Much faster!\nprint(\"Iterative Fibonacci:\")\nfor i in range(10):\n    print(f\"fib({i}) = {fib_iterative(i)}\")\n\n# Can handle large numbers\nprint(f\"\\nfib(50) = {fib_iterative(50)}\")\nprint(f\"fib(100) = {fib_iterative(100)}\")",
          description: "Efficient iterative version",
        },
        {
          id: "count-calls",
          title: "Counting Recursive Calls",
          code: "call_count = 0\n\ndef fib_counted(n):\n    \"\"\"Fibonacci that counts calls.\"\"\"\n    global call_count\n    call_count += 1\n    \n    if n == 0:\n        return 0\n    elif n == 1:\n        return 1\n    else:\n        return fib_counted(n - 1) + fib_counted(n - 2)\n\n# See how many calls for different n\nfor n in [5, 10, 15, 20, 25]:\n    call_count = 0\n    result = fib_counted(n)\n    print(f\"fib({n}) = {result}, calls: {call_count}\")\n\n# Calls grow exponentially!",
          description: "Demonstrating exponential calls",
        },
        {
          id: "recursion-patterns",
          title: "Other Recursion Patterns",
          code: "def reverse_string(s):\n    \"\"\"Reverse a string recursively.\"\"\"\n    if len(s) <= 1:\n        return s\n    return reverse_string(s[1:]) + s[0]\n\ndef count_digits(n):\n    \"\"\"Count digits in a number recursively.\"\"\"\n    n = abs(n)\n    if n < 10:\n        return 1\n    return 1 + count_digits(n // 10)\n\ndef is_palindrome(s):\n    \"\"\"Check if string is palindrome recursively.\"\"\"\n    if len(s) <= 1:\n        return True\n    if s[0] != s[-1]:\n        return False\n    return is_palindrome(s[1:-1])\n\nprint(f\"reverse('hello') = {reverse_string('hello')}\")\nprint(f\"count_digits(12345) = {count_digits(12345)}\")\nprint(f\"is_palindrome('racecar') = {is_palindrome('racecar')}\")\nprint(f\"is_palindrome('hello') = {is_palindrome('hello')}\")",
          description: "More recursive patterns",
        },
      ]),
      keyPoints: [
        "Fibonacci: fib(n) = fib(n-1) + fib(n-2)",
        "Recursive Fibonacci is elegant but slow",
        "Multiple recursive calls cause repeated work",
        "Iterative version is much faster",
        "Recursion good for trees and divide-conquer",
        "Iteration better for simple sequences",
        "Python has recursion limit (~1000 calls)",
        "Choose approach based on problem structure",
      ],
      hardwareDemo: "Watch call tree expand for Fibonacci. See same values computed multiple times.",
      estimatedTime: 30,
      difficulty: "ADVANCED",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson4_5_2.number}: ${lesson4_5_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_5_2.id,
        number: 1,
        title: "Recursive Fibonacci",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write the recursive Fibonacci function. Test with fib(10).",
        starterCode: "def fib(n):\n    # Base cases: n==0 returns 0, n==1 returns 1\n    # Recursive: fib(n-1) + fib(n-2)\n    pass\n\nprint(fib(10))  # Should be 55",
        solution: "def fib(n):\n    if n == 0:\n        return 0\n    elif n == 1:\n        return 1\n    else:\n        return fib(n - 1) + fib(n - 2)\n\nprint(fib(10))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "55", description: "fib(10) = 55" }]),
        hints: ["Two base cases: n==0 and n==1", "Recursive case adds two previous fibs"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson4_5_2.id,
        number: 2,
        title: "Iterative Fibonacci",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write iterative fib_iter(n) that's efficient. Test with n=50.",
        starterCode: "def fib_iter(n):\n    # Use loop instead of recursion\n    pass\n\nprint(fib_iter(50))  # Should work instantly",
        solution: "def fib_iter(n):\n    if n <= 1:\n        return n\n    prev, curr = 0, 1\n    for _ in range(2, n + 1):\n        prev, curr = curr, prev + curr\n    return curr\n\nprint(fib_iter(50))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "12586269025", description: "Large fib" }]),
        hints: ["Track prev and curr", "Update both each iteration", "Loop n-1 times"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson4_5_2.id,
        number: 3,
        title: "Reverse String",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write recursive reverse_string(s) that reverses a string.",
        starterCode: "def reverse_string(s):\n    # Base case: len <= 1\n    # Recursive: reverse rest + first char\n    pass\n\nprint(reverse_string(\"hello\"))  # olleh",
        solution: "def reverse_string(s):\n    if len(s) <= 1:\n        return s\n    return reverse_string(s[1:]) + s[0]\n\nprint(reverse_string(\"hello\"))\nprint(reverse_string(\"Python\"))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "olleh", description: "Reversed" }]),
        hints: ["Base: empty or single char returns as-is", "Recursive: reverse tail, add first to end"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson4_5_2.id,
        number: 4,
        title: "Palindrome Check",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write recursive is_palindrome(s) that returns True if s reads same forwards and backwards.",
        starterCode: "def is_palindrome(s):\n    # Base case: len <= 1 is palindrome\n    # Check first == last, then recurse on middle\n    pass\n\nprint(is_palindrome(\"racecar\"))  # True\nprint(is_palindrome(\"hello\"))    # False",
        solution: "def is_palindrome(s):\n    if len(s) <= 1:\n        return True\n    if s[0] != s[-1]:\n        return False\n    return is_palindrome(s[1:-1])\n\nprint(is_palindrome(\"racecar\"))\nprint(is_palindrome(\"hello\"))\nprint(is_palindrome(\"a])\nprint(is_palindrome(\"\"))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "True\\nFalse", description: "Detects palindromes" }]),
        hints: ["Base: 0 or 1 chars is palindrome", "If first != last, not palindrome", "Recurse on middle portion"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson4_5_2.id,
        number: 5,
        title: "Sum of Digits",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write recursive sum_digits(n) that returns sum of all digits. Example: sum_digits(1234) = 10",
        starterCode: "def sum_digits(n):\n    # Base case: single digit\n    # Recursive: last digit + sum_digits(rest)\n    pass\n\nprint(sum_digits(1234))  # 10\nprint(sum_digits(9999))  # 36",
        solution: "def sum_digits(n):\n    n = abs(n)  # Handle negative\n    if n < 10:\n        return n\n    return (n % 10) + sum_digits(n // 10)\n\nprint(sum_digits(1234))\nprint(sum_digits(9999))\nprint(sum_digits(12345))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "10\\n36", description: "Digit sums" }]),
        hints: ["n % 10 gives last digit", "n // 10 removes last digit", "Base case: single digit"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 4.5.2`);

  // Verify Chapter 4 is complete
  const chapter4 = await prisma.chapter.findFirst({
    where: { number: 4 },
    include: {
      sections: {
        orderBy: { number: 'asc' },
        include: {
          lessons: {
            orderBy: { number: 'asc' },
            include: { _count: { select: { exercises: true } } }
          }
        }
      }
    }
  });

  if (chapter4) {
    console.log("\n" + "=".repeat(60));
    console.log("📚 CHAPTER 4 COMPLETE!");
    console.log("=".repeat(60));
    
    let totalLessons = 0;
    let totalExercises = 0;
    
    for (const section of chapter4.sections) {
      console.log(`\n📂 Section ${section.number}: ${section.title}`);
      for (const lesson of section.lessons) {
        console.log(`   📝 ${lesson.number}: ${lesson.title} (${lesson._count.exercises} exercises)`);
        totalLessons++;
        totalExercises += lesson._count.exercises;
      }
    }
    
    console.log("\n" + "-".repeat(60));
    console.log(`✅ TOTAL: ${totalLessons} lessons, ${totalExercises} exercises`);
    console.log("=".repeat(60));
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
