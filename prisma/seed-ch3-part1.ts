import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 3 Part 1: Structure + Lessons 3.1.1, 3.2.1...\n");

  // Find or create Chapter 3
  let chapter3 = await prisma.chapter.findFirst({ where: { number: 3 } });
  
  if (!chapter3) {
    chapter3 = await prisma.chapter.create({
      data: {
        number: 3,
        title: "Some Simple Numerical Programs",
        description: "Learn iteration with for loops, algorithmic problem-solving, and efficient numerical methods including exhaustive enumeration, bisection search, and Newton-Raphson.",
        objectives: [
          "Master for loops and iteration patterns",
          "Understand exhaustive enumeration algorithms",
          "Implement bisection search for efficiency",
          "Work with floating point numbers correctly",
          "Apply Newton-Raphson method for finding roots",
        ],
        isPublished: true,
      },
    });
  }
  console.log(`✅ Chapter ${chapter3.number}: ${chapter3.title}`);

  // Create Sections
  const section3_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter3.id, number: 3.1 } },
    update: {},
    create: {
      chapterId: chapter3.id,
      number: 3.1,
      title: "Exhaustive Enumeration",
      description: "Solving problems by systematically testing all possibilities.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section3_1.number}: ${section3_1.title}`);

  const section3_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter3.id, number: 3.2 } },
    update: {},
    create: {
      chapterId: chapter3.id,
      number: 3.2,
      title: "For Loops",
      description: "Repeating code with for loops and range().",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section3_2.number}: ${section3_2.title}`);

  const section3_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter3.id, number: 3.3 } },
    update: {},
    create: {
      chapterId: chapter3.id,
      number: 3.3,
      title: "Approximate Solutions and Bisection Search",
      description: "Finding approximate answers efficiently.",
      order: 3,
    },
  });
  console.log(`  📂 Section ${section3_3.number}: ${section3_3.title}`);

  const section3_4 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter3.id, number: 3.4 } },
    update: {},
    create: {
      chapterId: chapter3.id,
      number: 3.4,
      title: "Working with Floats",
      description: "Understanding floating point representation and precision.",
      order: 4,
    },
  });
  console.log(`  📂 Section ${section3_4.number}: ${section3_4.title}`);

  const section3_5 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter3.id, number: 3.5 } },
    update: {},
    create: {
      chapterId: chapter3.id,
      number: 3.5,
      title: "Newton-Raphson",
      description: "Fast root finding using calculus-based iteration.",
      order: 5,
    },
  });
  console.log(`  📂 Section ${section3_5.number}: ${section3_5.title}`);

  // ==================== LESSON 3.2.1 ====================
  const lesson3_2_1 = await prisma.lesson.upsert({
    where: { slug: "introduction-to-for-loops" },
    update: {},
    create: {
      sectionId: section3_2.id,
      number: 3.21,
      title: "Introduction to For Loops",
      slug: "introduction-to-for-loops",
      objectives: [
        "Understand for loop syntax and structure",
        "Use for loops to repeat operations",
        "Iterate over range() function",
        "Recognize when to use for loops",
      ],
      content: `# Introduction to For Loops

## What Is a For Loop?

Loops execute code multiple times - essential for any non-trivial program.

Python has two types of loops:
- **for loops**: Iterate over a sequence (count-controlled)
- **while loops**: Continue while condition is true (condition-controlled)

For loops are the most common because they're clearer and less error-prone.

## Basic Syntax

\`\`\`python
for variable in sequence:
    # Code to repeat
    # Indented block
\`\`\`

Example:
\`\`\`python
for i in range(5):
    print(i)
# Prints: 0, 1, 2, 3, 4
\`\`\`

## How It Works

1. Get next value from sequence
2. Assign to loop variable
3. Execute indented block
4. Repeat until sequence exhausted

## The range() Function

\`range()\` generates sequences of numbers:

**range(stop)**: 0 to stop-1
\`\`\`python
range(5)  # 0, 1, 2, 3, 4
\`\`\`

**range(start, stop)**: start to stop-1
\`\`\`python
range(3, 8)  # 3, 4, 5, 6, 7
\`\`\`

**range(start, stop, step)**: custom increment
\`\`\`python
range(0, 10, 2)  # 0, 2, 4, 6, 8 (even numbers)
range(10, 0, -1) # 10, 9, 8, ..., 1 (countdown)
\`\`\`

**Key insight**: The stop value is NEVER included!

## Loop Variable

The loop variable changes each iteration:

\`\`\`python
for i in range(5):
    print(f"Iteration {i}")
    print(f"Square: {i**2}")
\`\`\`

Common names: i, j, k (traditional) or descriptive names like count, num, index.

## Indentation Matters!

- Indented code = inside loop (repeats)
- Non-indented code = after loop (runs once)

\`\`\`python
for i in range(3):
    print("Inside loop")  # Runs 3 times
print("After loop")       # Runs once
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-for-loop",
          title: "Basic For Loop",
          code: "# Simple for loop\nprint(\"Counting to 5:\")\nfor i in range(5):\n    print(i)\n\n# Output: 0, 1, 2, 3, 4\n# Note: range(5) means 0 to 4, not 1 to 5!\n\n# Counting 1 to 5\nprint(\"\\nCounting 1 to 5:\")\nfor i in range(1, 6):  # 6 is exclusive\n    print(i)",
          description: "Simple counting loops",
        },
        {
          id: "loop-calculations",
          title: "Using Loop Variable in Calculations",
          code: "# Calculating squares\nprint(\"Number : Square\")\nfor n in range(1, 11):\n    square = n ** 2\n    print(f\"{n:6d} : {square}\")\n\n# Summing numbers 1 to 100\ntotal = 0\nfor i in range(1, 101):\n    total = total + i  # or total += i\n\nprint(f\"\\nSum of 1 to 100: {total}\")  # 5050",
          description: "Calculations inside loops",
        },
        {
          id: "range-patterns",
          title: "Different range() Patterns",
          code: "# Every other number (even)\nprint(\"Even numbers 0-20:\")\nfor i in range(0, 21, 2):\n    print(i, end=\" \")\nprint()\n\n# Countdown\nprint(\"\\nCountdown from 10:\")\nfor i in range(10, 0, -1):\n    print(i, end=\" \")\nprint(\"\\nBlastoff!\")\n\n# Every third number\nprint(\"\\nEvery third (0-30):\")\nfor i in range(0, 31, 3):\n    print(i, end=\" \")",
          description: "Various range() patterns",
        },
        {
          id: "building-results",
          title: "Building Results with Loops",
          code: "# Calculate factorial (5! = 5*4*3*2*1)\nn = 5\nfactorial = 1\nfor i in range(1, n + 1):\n    factorial = factorial * i\n    print(f\"{i}! = {factorial}\")\n\nprint(f\"\\nFinal: {n}! = {factorial}\")\n\n# Multiplication table\nnumber = 7\nprint(f\"\\nMultiplication table for {number}:\")\nfor i in range(1, 11):\n    print(f\"{number} x {i} = {number * i}\")",
          description: "Accumulating results",
        },
      ]),
      keyPoints: [
        "for loops repeat code for each item in sequence",
        "Syntax: for variable in sequence: (colon required!)",
        "Indentation defines loop body (4 spaces)",
        "range(N): generates 0 to N-1",
        "range(start, stop): start to stop-1",
        "range(start, stop, step): custom increment",
        "Loop variable changes each iteration",
        "Stop value is NEVER included in range()",
      ],
      hardwareDemo: "Watch the loop variable change in memory each iteration. See program counter jump back to loop start.",
      estimatedTime: 30,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson3_2_1.number}: ${lesson3_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson3_2_1.id,
        number: 1,
        title: "Count to 10",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Write a for loop that prints numbers 1 to 10 (inclusive).",
        starterCode: "# Print numbers 1 to 10\n",
        solution: "for i in range(1, 11):\n    print(i)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "1\\n2\\n3\\n4\\n5\\n6\\n7\\n8\\n9\\n10", description: "Numbers 1-10" }]),
        hints: ["range(1, 11) gives 1 to 10", "Remember: stop value is exclusive"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson3_2_1.id,
        number: 2,
        title: "Even Numbers",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Print all even numbers from 0 to 20 using range() with step parameter.",
        starterCode: "# Print even numbers 0 to 20\n",
        solution: "for i in range(0, 21, 2):\n    print(i)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "0 2 4 6 8 10 12 14 16 18 20", description: "Even numbers" }]),
        hints: ["Use step of 2", "range(0, 21, 2) steps by 2"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson3_2_1.id,
        number: 3,
        title: "Sum 1 to 100",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate the sum of all numbers from 1 to 100 using a for loop. Print the result.",
        starterCode: "# Sum numbers 1 to 100\ntotal = 0\n",
        solution: "total = 0\nfor i in range(1, 101):\n    total += i\nprint(f\"Sum: {total}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Sum: 5050", description: "Sum equals 5050" }]),
        hints: ["Start with total = 0", "Add each number: total += i", "Print after the loop"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson3_2_1.id,
        number: 4,
        title: "Countdown",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Print a countdown from 10 to 1, then print 'Blastoff!'. Use range() with negative step.",
        starterCode: "# Countdown from 10 to 1\n",
        solution: "for i in range(10, 0, -1):\n    print(i)\nprint(\"Blastoff!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "10\\n9\\n8\\n7\\n6\\n5\\n4\\n3\\n2\\n1\\nBlastoff!", description: "Countdown" }]),
        hints: ["range(10, 0, -1) counts down", "Blastoff! is after the loop (not indented)"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson3_2_1.id,
        number: 5,
        title: "Multiplication Table",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Ask the user for a number, then print its multiplication table from 1 to 12.",
        starterCode: "# Get number and print multiplication table\nnumber = int(input(\"Enter a number: \"))\n",
        solution: "number = int(input(\"Enter a number: \"))\nprint(f\"Multiplication table for {number}:\")\nfor i in range(1, 13):\n    print(f\"{number} x {i} = {number * i}\")",
        testCases: JSON.stringify([{ input: "7", expectedOutput: "7 x 1 = 7\\n...\\n7 x 12 = 84", description: "Table for 7" }]),
        hints: ["Loop from 1 to 12", "Multiply number by loop variable", "Use f-string for formatting"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 3.2.1`);

  // ==================== LESSON 3.1.1 ====================
  const lesson3_1_1 = await prisma.lesson.upsert({
    where: { slug: "exhaustive-enumeration" },
    update: {},
    create: {
      sectionId: section3_1.id,
      number: 3.11,
      title: "Exhaustive Enumeration",
      slug: "exhaustive-enumeration",
      objectives: [
        "Understand the guess-and-check approach",
        "Implement exhaustive search algorithms",
        "Use break to exit loops early",
        "Recognize when exhaustive search is appropriate",
      ],
      content: `# Exhaustive Enumeration

## The Guess-and-Check Approach

**Exhaustive enumeration** means systematically trying all possibilities until you find a solution.

### Algorithm:
1. Generate a guess
2. Check if guess is correct
3. If yes: Done! Return answer
4. If no: Try next guess
5. Repeat until solution found

### Example: Find cube root of 27
- Guess 1: 1³ = 1 (not 27)
- Guess 2: 2³ = 8 (not 27)
- Guess 3: 3³ = 27 ✓ Found it!

## Why Use Exhaustive Enumeration?

**Advantages:**
- Simple to implement
- Guaranteed to find solution (if it exists)
- No complex mathematics needed

**Limitations:**
- Can be slow for large search spaces
- Better algorithms exist for many problems

## Implementation Pattern

\`\`\`python
for guess in range(start, end):
    if guess_is_correct:
        print(f"Found: {guess}")
        break  # Exit loop early
\`\`\`

## The break Statement

\`break\` immediately exits the current loop:

\`\`\`python
for i in range(100):
    if i == 5:
        break  # Stop looping
    print(i)
# Prints: 0, 1, 2, 3, 4 (stops at 5)
\`\`\`

## Handling "Not Found" Cases

Use a flag variable or else clause:

\`\`\`python
found = False
for guess in range(100):
    if guess ** 2 == target:
        found = True
        break

if not found:
    print("No solution exists")
\`\`\`

## When to Use Exhaustive Enumeration

**Good for:**
- Small search spaces (hundreds of possibilities)
- When correctness matters more than speed
- Simple problems with clear conditions

**Bad for:**
- Huge search spaces (millions of values)
- Time-critical applications
- Problems where better algorithms exist`,
      codeExamples: JSON.stringify([
        {
          id: "cube-root",
          title: "Finding Cube Root",
          code: "# Find cube root of 27\ntarget = 27\n\nprint(f\"Finding cube root of {target}...\")\n\nfor guess in range(target + 1):\n    if guess ** 3 == target:\n        print(f\"Cube root of {target} is {guess}\")\n        break\n    if guess ** 3 > target:\n        print(f\"No integer cube root for {target}\")\n        break\n\n# Output: Cube root of 27 is 3",
          description: "Finding integer cube root",
        },
        {
          id: "perfect-squares",
          title: "Finding Perfect Squares",
          code: "# Find all perfect squares less than 100\nprint(\"Perfect squares less than 100:\")\ncount = 0\n\nfor num in range(1, 100):\n    # Check if num is a perfect square\n    root = int(num ** 0.5)\n    if root * root == num:\n        print(f\"{num} = {root}^2\")\n        count += 1\n\nprint(f\"\\nTotal: {count} perfect squares\")",
          description: "Finding perfect squares",
        },
        {
          id: "divisibility",
          title: "Finding Divisors",
          code: "# Find all divisors of a number\nnumber = 36\n\nprint(f\"Divisors of {number}:\")\ndivisors = []\n\nfor guess in range(1, number + 1):\n    if number % guess == 0:  # No remainder = divisor\n        divisors.append(guess)\n        print(f\"{number} / {guess} = {number // guess}\")\n\nprint(f\"\\nAll divisors: {divisors}\")",
          description: "Finding all divisors",
        },
        {
          id: "search-with-break",
          title: "Search with Early Exit",
          code: "# Find first number whose square exceeds 1000\nprint(\"Finding smallest n where n^2 > 1000...\")\n\nfor n in range(1, 1000):\n    square = n ** 2\n    if square > 1000:\n        print(f\"Found: {n}\")\n        print(f\"{n}^2 = {square}\")\n        break\n\n# Without break, would check all 1000 numbers\n# With break, stops at 32 (32^2 = 1024)",
          description: "Using break for efficiency",
        },
      ]),
      keyPoints: [
        "Exhaustive enumeration: try all possibilities",
        "Simple but can be slow for large spaces",
        "Use for loop to iterate through guesses",
        "Check condition with if statement",
        "break exits loop when solution found",
        "Guaranteed to find solution if it exists",
        "Good for small search spaces",
        "Handle 'not found' case explicitly",
      ],
      hardwareDemo: "Watch each guess being tested. See counter increment until solution found.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson3_1_1.number}: ${lesson3_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson3_1_1.id,
        number: 1,
        title: "Find Cube Root",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Find the integer cube root of 64 using exhaustive enumeration.",
        starterCode: "# Find cube root of 64\ntarget = 64\n",
        solution: "target = 64\nfor guess in range(target + 1):\n    if guess ** 3 == target:\n        print(f\"Cube root of {target} is {guess}\")\n        break",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Cube root of 64 is 4", description: "Finds 4" }]),
        hints: ["Try values 0, 1, 2, ... until guess**3 equals target", "Use break when found"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson3_1_1.id,
        number: 2,
        title: "Divisible by 3 and 5",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find all numbers between 1 and 50 that are divisible by BOTH 3 and 5.",
        starterCode: "# Find numbers divisible by both 3 and 5\n",
        solution: "for num in range(1, 51):\n    if num % 3 == 0 and num % 5 == 0:\n        print(num)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "15\\n30\\n45", description: "Finds 15, 30, 45" }]),
        hints: ["Use % (modulo) to check divisibility", "num % 3 == 0 means divisible by 3", "Use 'and' to check both conditions"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson3_1_1.id,
        number: 3,
        title: "Smallest Square Over 1000",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find the smallest positive integer whose square is greater than 1000.",
        starterCode: "# Find smallest n where n^2 > 1000\n",
        solution: "for n in range(1, 1000):\n    if n ** 2 > 1000:\n        print(f\"Answer: {n} (because {n}^2 = {n**2})\")\n        break",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Answer: 32", description: "32 squared is 1024" }]),
        hints: ["Start from 1, check each square", "Stop as soon as you find one (use break)"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson3_1_1.id,
        number: 4,
        title: "Find All Divisors",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find and print all divisors of 48.",
        starterCode: "# Find all divisors of 48\nnumber = 48\n",
        solution: "number = 48\nprint(f\"Divisors of {number}:\")\nfor i in range(1, number + 1):\n    if number % i == 0:\n        print(i)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "1, 2, 3, 4, 6, 8, 12, 16, 24, 48", description: "All divisors" }]),
        hints: ["A divisor divides evenly (no remainder)", "Check number % i == 0", "Loop from 1 to number"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson3_1_1.id,
        number: 5,
        title: "Pythagorean Triples",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Find all Pythagorean triples (a, b, c) where a, b, c are all less than or equal to 20 and a² + b² = c².",
        starterCode: "# Find Pythagorean triples where a, b, c <= 20\n",
        solution: "print(\"Pythagorean triples (a^2 + b^2 = c^2):\")\nfor a in range(1, 21):\n    for b in range(a, 21):  # b >= a to avoid duplicates\n        for c in range(b, 21):  # c >= b\n            if a**2 + b**2 == c**2:\n                print(f\"{a}^2 + {b}^2 = {c}^2  ({a}, {b}, {c})\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "3, 4, 5 and others", description: "Multiple triples" }]),
        hints: ["Use three nested loops for a, b, c", "Check if a² + b² = c²", "Start b from a to avoid duplicates"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 3.1.1`);

  console.log("\n✅ Chapter 3 Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
