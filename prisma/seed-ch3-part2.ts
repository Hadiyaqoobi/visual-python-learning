import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 3 Part 2: Lessons 3.2.2-3.2.3...\n");

  const section3_2 = await prisma.section.findFirst({ where: { number: 3.2 } });
  if (!section3_2) throw new Error("Section 3.2 not found.");

  // ==================== LESSON 3.2.2 ====================
  const lesson3_2_2 = await prisma.lesson.upsert({
    where: { slug: "range-function-detail" },
    update: {},
    create: {
      sectionId: section3_2.id,
      number: 3.22,
      title: "The range() Function in Detail",
      slug: "range-function-detail",
      objectives: [
        "Master all three forms of range()",
        "Use negative steps for counting backwards",
        "Convert range to list when needed",
        "Understand range as a lazy sequence",
      ],
      content: `# The range() Function in Detail

## Three Forms of range()

### Form 1: range(stop)
Generates numbers from 0 to stop-1:

\`\`\`python
range(5)  # 0, 1, 2, 3, 4
\`\`\`

Use when: "Do this N times"

### Form 2: range(start, stop)
Generates numbers from start to stop-1:

\`\`\`python
range(3, 8)  # 3, 4, 5, 6, 7
range(1, 6)  # 1, 2, 3, 4, 5
\`\`\`

Use when: Starting from non-zero value

### Form 3: range(start, stop, step)
Generates with custom increment:

\`\`\`python
range(0, 10, 2)   # 0, 2, 4, 6, 8
range(1, 10, 3)   # 1, 4, 7
range(10, 0, -1)  # 10, 9, 8, ..., 1
\`\`\`

Use when: Skip values or count backwards

## Negative Step (Counting Down)

Step can be negative to count backwards:

\`\`\`python
range(10, 0, -1)   # 10 down to 1
range(100, 0, -10) # 100, 90, 80, ..., 10
range(5, -1, -1)   # 5, 4, 3, 2, 1, 0
\`\`\`

**Important**: When step is negative, start must be > stop!

## range() Returns a Range Object

\`range()\` doesn't create a list - it's a "lazy" sequence:

\`\`\`python
r = range(1000000)  # Instant! Doesn't store million numbers
print(r)            # range(0, 1000000)
\`\`\`

Convert to list if needed:
\`\`\`python
list(range(5))  # [0, 1, 2, 3, 4]
\`\`\`

## Common Patterns

\`\`\`python
# Count from 1 (not 0)
range(1, n+1)

# Even numbers
range(0, n, 2)

# Odd numbers
range(1, n, 2)

# Countdown
range(n, 0, -1)

# Every 5th number
range(0, n, 5)
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "range-forms",
          title: "Three Forms of range()",
          code: "# Form 1: range(stop) - starts at 0\nprint(\"range(5):\")\nfor i in range(5):\n    print(i, end=\" \")  # 0 1 2 3 4\nprint()\n\n# Form 2: range(start, stop)\nprint(\"\\nrange(3, 8):\")\nfor i in range(3, 8):\n    print(i, end=\" \")  # 3 4 5 6 7\nprint()\n\n# Form 3: range(start, stop, step)\nprint(\"\\nrange(0, 10, 2):\")\nfor i in range(0, 10, 2):\n    print(i, end=\" \")  # 0 2 4 6 8\nprint()",
          description: "All three forms of range()",
        },
        {
          id: "negative-step",
          title: "Counting Backwards",
          code: "# Countdown from 10 to 1\nprint(\"Countdown:\")\nfor i in range(10, 0, -1):\n    print(i, end=\" \")\nprint(\"Blastoff!\")\n\n# Count down by 10s\nprint(\"\\nBy tens:\")\nfor i in range(100, 0, -10):\n    print(i, end=\" \")\nprint()\n\n# Include zero in countdown\nprint(\"\\nIncluding zero:\")\nfor i in range(5, -1, -1):  # stop at -1 to include 0\n    print(i, end=\" \")\nprint()",
          description: "Using negative step",
        },
        {
          id: "range-object",
          title: "Range as Object",
          code: "# range() creates a range object, not a list\nr = range(5)\nprint(f\"Type: {type(r)}\")\nprint(f\"Object: {r}\")\n\n# Convert to list when needed\nnum_list = list(range(5))\nprint(f\"As list: {num_list}\")\n\n# Range is memory efficient\nbig_range = range(1000000)  # Instant!\nprint(f\"\\nBig range created: {big_range}\")\nprint(f\"Length: {len(big_range)}\")\nprint(f\"First: {big_range[0]}, Last: {big_range[-1]}\")\n# Doesn't store all million numbers!",
          description: "Understanding range objects",
        },
        {
          id: "common-patterns",
          title: "Common range() Patterns",
          code: "n = 10\n\n# Count from 1 to n\nprint(\"1 to n:\", list(range(1, n+1)))\n\n# Even numbers up to n\nprint(\"Evens:\", list(range(0, n+1, 2)))\n\n# Odd numbers up to n\nprint(\"Odds:\", list(range(1, n+1, 2)))\n\n# Multiples of 3\nprint(\"Mult of 3:\", list(range(0, n+1, 3)))\n\n# Countdown\nprint(\"Countdown:\", list(range(n, 0, -1)))\n\n# Reverse a range\nprint(\"Reversed:\", list(range(n-1, -1, -1)))",
          description: "Useful range patterns",
        },
      ]),
      keyPoints: [
        "range(stop): 0 to stop-1",
        "range(start, stop): start to stop-1",
        "range(start, stop, step): custom increment",
        "Negative step counts backwards",
        "With negative step, start must be > stop",
        "range() is lazy (doesn't store all values)",
        "Convert to list with list(range(...))",
        "Stop value is NEVER included",
      ],
      hardwareDemo: "See how range generates numbers on-demand rather than storing them all.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson3_2_2.number}: ${lesson3_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson3_2_2.id,
        number: 1,
        title: "Odd Numbers",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Print all odd numbers from 1 to 19 using range() with step.",
        starterCode: "# Print odd numbers 1 to 19\n",
        solution: "for i in range(1, 20, 2):\n    print(i)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "1 3 5 7 9 11 13 15 17 19", description: "Odd numbers" }]),
        hints: ["Start at 1 (first odd)", "Step by 2", "Stop at 20 (exclusive)"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson3_2_2.id,
        number: 2,
        title: "Countdown by 5",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Count down from 50 to 0 by 5s (50, 45, 40, ..., 5, 0).",
        starterCode: "# Countdown from 50 to 0 by 5s\n",
        solution: "for i in range(50, -1, -5):\n    print(i)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "50 45 40 ... 5 0", description: "Countdown by 5" }]),
        hints: ["Start at 50", "Stop at -1 to include 0", "Step is -5"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson3_2_2.id,
        number: 3,
        title: "Multiples of 7",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Print all multiples of 7 from 7 to 70 (inclusive).",
        starterCode: "# Multiples of 7 from 7 to 70\n",
        solution: "for i in range(7, 71, 7):\n    print(i)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "7 14 21 28 35 42 49 56 63 70", description: "Multiples of 7" }]),
        hints: ["Start at 7", "Stop at 71 to include 70", "Step by 7"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson3_2_2.id,
        number: 4,
        title: "Alphabet Positions",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Print numbers 65 to 90 (ASCII codes for A-Z), and show which letter each represents.",
        starterCode: "# Print ASCII codes and letters A-Z\n",
        solution: "for code in range(65, 91):\n    print(f\"{code} = {chr(code)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "65 = A\\n66 = B\\n...\\n90 = Z", description: "ASCII codes" }]),
        hints: ["A is ASCII 65, Z is ASCII 90", "Use chr() to convert code to letter", "range(65, 91) gives 65-90"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson3_2_2.id,
        number: 5,
        title: "Sum of Squares",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Calculate the sum of squares from 1 to 10: 1² + 2² + 3² + ... + 10²",
        starterCode: "# Sum of squares 1^2 + 2^2 + ... + 10^2\n",
        solution: "total = 0\nfor i in range(1, 11):\n    total += i ** 2\n    print(f\"{i}^2 = {i**2}, running total = {total}\")\nprint(f\"\\nSum of squares: {total}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Sum of squares: 385", description: "Sum is 385" }]),
        hints: ["Use accumulator pattern", "Square each number: i ** 2", "Add to running total"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 3.2.2`);

  // ==================== LESSON 3.2.3 ====================
  const lesson3_2_3 = await prisma.lesson.upsert({
    where: { slug: "nested-loops" },
    update: {},
    create: {
      sectionId: section3_2.id,
      number: 3.23,
      title: "Nested Loops",
      slug: "nested-loops",
      objectives: [
        "Understand loops inside loops",
        "Trace execution of nested loops",
        "Use nested loops for 2D patterns",
        "Recognize when nested loops are needed",
      ],
      content: `# Nested Loops

## What Are Nested Loops?

A **nested loop** is a loop inside another loop.

\`\`\`python
for i in range(3):      # Outer loop
    for j in range(2):  # Inner loop
        print(f"i={i}, j={j}")
\`\`\`

## How Nested Loops Execute

The inner loop completes ALL its iterations for EACH iteration of the outer loop.

\`\`\`
Outer i=0:
    Inner j=0: print
    Inner j=1: print
Outer i=1:
    Inner j=0: print
    Inner j=1: print
Outer i=2:
    Inner j=0: print
    Inner j=1: print
\`\`\`

**Total iterations**: outer × inner = 3 × 2 = 6

## Common Use Cases

### 1. 2D Patterns (Grids)
\`\`\`python
for row in range(3):
    for col in range(4):
        print("*", end="")
    print()  # New line after each row
\`\`\`
Output:
\`\`\`
****
****
****
\`\`\`

### 2. Multiplication Tables
\`\`\`python
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i}x{j}={i*j}", end=" ")
    print()
\`\`\`

### 3. Searching Pairs
\`\`\`python
for a in range(5):
    for b in range(5):
        if a + b == 5:
            print(f"{a} + {b} = 5")
\`\`\`

## Triangle Patterns

Vary the inner loop based on outer loop:

\`\`\`python
for row in range(5):
    for col in range(row + 1):
        print("*", end="")
    print()
\`\`\`
Output:
\`\`\`
*
**
***
****
*****
\`\`\`

## Performance Note

Nested loops multiply iterations. Be careful with large ranges:
- 2 loops of 1000 = 1,000,000 iterations
- 3 loops of 100 = 1,000,000 iterations`,
      codeExamples: JSON.stringify([
        {
          id: "basic-nested",
          title: "Basic Nested Loop",
          code: "# Nested loop execution order\nprint(\"Tracing nested loops:\")\nfor i in range(3):      # Outer: 0, 1, 2\n    print(f\"Outer loop: i = {i}\")\n    for j in range(2):  # Inner: 0, 1\n        print(f\"  Inner loop: j = {j}\")\n    print(\"  (inner loop complete)\")\nprint(\"Done!\")\n\n# Count total iterations\ncount = 0\nfor i in range(3):\n    for j in range(2):\n        count += 1\nprint(f\"\\nTotal iterations: {count}\")  # 6",
          description: "Understanding execution order",
        },
        {
          id: "rectangle-pattern",
          title: "Rectangle Pattern",
          code: "# Print a rectangle of stars\nrows = 4\ncols = 6\n\nprint(f\"Rectangle {rows}x{cols}:\")\nfor row in range(rows):\n    for col in range(cols):\n        print(\"*\", end=\"\")\n    print()  # New line after each row\n\n# With numbers instead\nprint(\"\\nWith position numbers:\")\nfor row in range(3):\n    for col in range(4):\n        print(f\"({row},{col})\", end=\" \")\n    print()",
          description: "Creating rectangular patterns",
        },
        {
          id: "triangle-pattern",
          title: "Triangle Patterns",
          code: "# Right triangle\nprint(\"Right triangle:\")\nfor row in range(5):\n    for col in range(row + 1):\n        print(\"*\", end=\"\")\n    print()\n\n# Inverted triangle\nprint(\"\\nInverted triangle:\")\nfor row in range(5):\n    for col in range(5 - row):\n        print(\"*\", end=\"\")\n    print()\n\n# Number triangle\nprint(\"\\nNumber triangle:\")\nfor row in range(1, 6):\n    for col in range(1, row + 1):\n        print(col, end=\"\")\n    print()",
          description: "Creating triangle patterns",
        },
        {
          id: "multiplication-table",
          title: "Multiplication Table",
          code: "# Full multiplication table\nprint(\"Multiplication Table (1-5):\")\nprint()\n\n# Header row\nprint(\"  |\", end=\"\")\nfor j in range(1, 6):\n    print(f\"{j:4}\", end=\"\")\nprint()\nprint(\"-\" * 25)\n\n# Table body\nfor i in range(1, 6):\n    print(f\"{i} |\", end=\"\")\n    for j in range(1, 6):\n        print(f\"{i*j:4}\", end=\"\")\n    print()",
          description: "Formatted multiplication table",
        },
      ]),
      keyPoints: [
        "Nested loop = loop inside another loop",
        "Inner loop completes fully for each outer iteration",
        "Total iterations = outer × inner",
        "Use for 2D patterns, grids, tables",
        "Inner loop range can depend on outer variable",
        "Be careful: large nested loops are slow",
        "Indent carefully - each loop needs its own level",
        "print() with no args creates new line",
      ],
      hardwareDemo: "Watch outer and inner loop counters. See inner reset when outer increments.",
      estimatedTime: 35,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson3_2_3.number}: ${lesson3_2_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson3_2_3.id,
        number: 1,
        title: "Count Iterations",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "How many times does 'Hello' print? Write nested loops and count.",
        starterCode: "# Count how many times inner code runs\ncount = 0\nfor i in range(4):\n    for j in range(3):\n        count += 1\n        print(\"Hello\")\n\nprint(f\"Total: {count}\")",
        solution: "count = 0\nfor i in range(4):\n    for j in range(3):\n        count += 1\n        print(\"Hello\")\n\nprint(f\"Total: {count}\")  # 12",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Total: 12", description: "4 x 3 = 12" }]),
        hints: ["Outer loop runs 4 times", "Inner loop runs 3 times for each outer", "4 × 3 = ?"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson3_2_3.id,
        number: 2,
        title: "Rectangle of Stars",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Print a 5x8 rectangle of asterisks (5 rows, 8 columns).",
        starterCode: "# Print 5 rows, 8 columns of *\n",
        solution: "for row in range(5):\n    for col in range(8):\n        print(\"*\", end=\"\")\n    print()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "5 rows of 8 stars each", description: "5x8 rectangle" }]),
        hints: ["Outer loop for rows", "Inner loop for columns", "print() after inner loop for new line"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson3_2_3.id,
        number: 3,
        title: "Right Triangle",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Print a right triangle with 6 rows using asterisks.",
        starterCode: "# Right triangle with 6 rows\n# *\n# **\n# ***\n# etc.\n",
        solution: "for row in range(1, 7):\n    for col in range(row):\n        print(\"*\", end=\"\")\n    print()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "*\\n**\\n***\\n****\\n*****\\n******", description: "Triangle" }]),
        hints: ["Row 1 has 1 star, row 2 has 2, etc.", "Inner loop runs 'row' times", "range(row) gives 0 to row-1"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson3_2_3.id,
        number: 4,
        title: "Number Grid",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Print a 4x4 grid showing row*column values (multiplication table style).",
        starterCode: "# 4x4 multiplication grid\n",
        solution: "for row in range(1, 5):\n    for col in range(1, 5):\n        print(f\"{row * col:4}\", end=\"\")\n    print()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "4x4 grid of products", description: "Multiplication grid" }]),
        hints: ["Loop rows 1-4, cols 1-4", "Print row * col", "Use formatting for alignment"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson3_2_3.id,
        number: 5,
        title: "Find All Pairs",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Find all pairs of numbers (a, b) where a and b are between 1-10 and a + b = 12.",
        starterCode: "# Find pairs where a + b = 12\n",
        solution: "print(\"Pairs where a + b = 12:\")\nfor a in range(1, 11):\n    for b in range(1, 11):\n        if a + b == 12:\n            print(f\"{a} + {b} = 12\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "2+10, 3+9, 4+8, etc.", description: "All pairs summing to 12" }]),
        hints: ["Nested loops for a and b", "Check if a + b == 12", "Print matching pairs"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 3.2.3`);

  console.log("\n✅ Chapter 3 Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
