import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 6 Part 4: Lesson 6.3.1 (Assertions)...\n");

  const section6_3 = await prisma.section.findFirst({ where: { number: 6.3 } });
  if (!section6_3) throw new Error("Section 6.3 not found.");

  // ==================== LESSON 6.3.1 ====================
  const lesson6_3_1 = await prisma.lesson.upsert({
    where: { slug: "assertions" },
    update: {},
    create: {
      sectionId: section6_3.id,
      number: 6.31,
      title: "Assertions for Defensive Programming",
      slug: "assertions",
      objectives: [
        "Use assert statement syntax",
        "Check preconditions and postconditions",
        "Understand when to use assertions",
        "Know assertions vs exceptions",
      ],
      content: `# Assertions for Defensive Programming

## What Are Assertions?

Assertions are sanity checks that should ALWAYS be true:

\`\`\`python
assert condition, "error message"
\`\`\`

If condition is False, program crashes with AssertionError.

## Why Use Assertions?

1. **Catch bugs early**: Fail fast when assumptions are violated
2. **Document assumptions**: Code shows what must be true
3. **Debugging aid**: Find where things go wrong
4. **Self-checking code**: Verify internal logic

## Assertion Syntax

\`\`\`python
assert x > 0, "x must be positive"
assert len(items) > 0, "list cannot be empty"
assert isinstance(name, str), "name must be string"
\`\`\`

## Preconditions

Check at function START - what must be true for function to work:

\`\`\`python
def divide(a, b):
    assert b != 0, "divisor cannot be zero"
    return a / b
\`\`\`

## Postconditions

Check at function END - what must be true after function runs:

\`\`\`python
def square(n):
    result = n * n
    assert result >= 0, "square must be non-negative"
    return result
\`\`\`

## Assertions vs Exceptions

| Assertions | Exceptions |
|------------|------------|
| Programming errors | Expected failures |
| Should never happen | Might happen normally |
| Remove in production | Keep in production |
| Checks YOUR code | Handles USER input |

\`\`\`python
# Assertion: Bug if this fails
assert len(items) == len(prices), "lists must match"

# Exception: Expected user error
if not filename.endswith('.txt'):
    raise ValueError("File must be .txt")
\`\`\`

## Important: Assertions Can Be Disabled!

Running \`python -O script.py\` disables assertions. Never use for security or user input validation!`,
      codeExamples: JSON.stringify([
        {
          id: "basic-assert",
          title: "Basic Assertions",
          code: "# Simple assertions\nx = 10\nassert x > 0, \"x must be positive\"\nprint(\"x is positive ✓\")\n\n# With message\nname = \"Alice\"\nassert len(name) > 0, \"name cannot be empty\"\nprint(f\"name '{name}' is valid ✓\")\n\n# Without message (less helpful)\nage = 25\nassert age >= 0\nprint(f\"age {age} is valid ✓\")\n\n# Failing assertion\ntry:\n    value = -5\n    assert value >= 0, f\"value must be non-negative, got {value}\"\nexcept AssertionError as e:\n    print(f\"Assertion failed: {e}\")",
          description: "Basic assertion syntax",
        },
        {
          id: "preconditions",
          title: "Checking Preconditions",
          code: "def calculate_average(numbers):\n    \"\"\"Calculate average - requires non-empty list.\"\"\"\n    # Preconditions\n    assert numbers is not None, \"numbers cannot be None\"\n    assert len(numbers) > 0, \"numbers cannot be empty\"\n    assert all(isinstance(n, (int, float)) for n in numbers), \\\n        \"all elements must be numbers\"\n    \n    return sum(numbers) / len(numbers)\n\n# Valid calls\nprint(f\"Average: {calculate_average([1, 2, 3, 4, 5])}\")\nprint(f\"Average: {calculate_average([10.5, 20.5])}\")\n\n# Invalid calls (would fail assertion)\ntry:\n    calculate_average([])  # Empty list\nexcept AssertionError as e:\n    print(f\"Caught: {e}\")\n\ntry:\n    calculate_average([1, 'two', 3])  # Non-number\nexcept AssertionError as e:\n    print(f\"Caught: {e}\")",
          description: "Validating function inputs",
        },
        {
          id: "postconditions",
          title: "Checking Postconditions",
          code: "def binary_search(sorted_list, target):\n    \"\"\"Find target in sorted list, return index or -1.\"\"\"\n    # Precondition\n    assert sorted_list == sorted(sorted_list), \"list must be sorted\"\n    \n    left, right = 0, len(sorted_list) - 1\n    \n    while left <= right:\n        mid = (left + right) // 2\n        if sorted_list[mid] == target:\n            # Postcondition: found index must contain target\n            assert sorted_list[mid] == target, \"found wrong element!\"\n            return mid\n        elif sorted_list[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    \n    # Postcondition: if returning -1, target truly not in list\n    assert target not in sorted_list, \"missed the target!\"\n    return -1\n\ndata = [1, 3, 5, 7, 9, 11, 13]\nprint(f\"Index of 7: {binary_search(data, 7)}\")\nprint(f\"Index of 6: {binary_search(data, 6)}\")",
          description: "Validating function outputs",
        },
        {
          id: "assert-vs-exception",
          title: "Assertions vs Exceptions",
          code: "def process_file(filename, data):\n    # ASSERTION: Internal programming error check\n    # This should NEVER happen if code is correct\n    assert isinstance(data, list), \"BUG: data must be list\"\n    \n    # EXCEPTION: User input validation\n    # This MIGHT happen with bad user input\n    if not filename:\n        raise ValueError(\"Filename cannot be empty\")\n    \n    if not filename.endswith('.txt'):\n        raise ValueError(\"File must be .txt format\")\n    \n    # Process...\n    print(f\"Processing {filename} with {len(data)} items\")\n\n# Test exception (expected user error)\ntry:\n    process_file(\"data.csv\", [1, 2, 3])\nexcept ValueError as e:\n    print(f\"User error: {e}\")\n\n# Test assertion (programming bug)\ntry:\n    process_file(\"data.txt\", \"not a list\")  # BUG!\nexcept AssertionError as e:\n    print(f\"Bug detected: {e}\")\n\n# Valid call\nprocess_file(\"data.txt\", [1, 2, 3])",
          description: "When to use each",
        },
      ]),
      keyPoints: [
        "assert condition, message",
        "AssertionError if condition is False",
        "Preconditions: check at function start",
        "Postconditions: check at function end",
        "Use for programming errors, not user errors",
        "Assertions can be disabled (-O flag)",
        "Never use for security checks",
        "Exceptions for expected errors, assertions for bugs",
      ],
      hardwareDemo: "Watch assertion check. See AssertionError raised when condition fails.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson6_3_1.number}: ${lesson6_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson6_3_1.id,
        number: 1,
        title: "Write Basic Assert",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add an assertion to verify age is non-negative.",
        starterCode: "def create_user(name, age):\n    # Add assertion: age must be >= 0\n    \n    return {\"name\": name, \"age\": age}\n\nprint(create_user(\"Alice\", 25))\n# This should fail assertion:\n# print(create_user(\"Bob\", -5))",
        solution: "def create_user(name, age):\n    assert age >= 0, f\"age must be non-negative, got {age}\"\n    return {\"name\": name, \"age\": age}\n\nprint(create_user(\"Alice\", 25))\n\ntry:\n    print(create_user(\"Bob\", -5))\nexcept AssertionError as e:\n    print(f\"Assertion failed: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Assertion catches negative age", description: "Assert works" }]),
        hints: ["assert condition, message", "age >= 0 is the condition"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson6_3_1.id,
        number: 2,
        title: "Precondition Check",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add preconditions to verify inputs are valid.",
        starterCode: "def calculate_rectangle_area(width, height):\n    # Add preconditions:\n    # - width must be positive\n    # - height must be positive\n    \n    return width * height\n\nprint(calculate_rectangle_area(5, 3))\n# Should fail: print(calculate_rectangle_area(-1, 3))",
        solution: "def calculate_rectangle_area(width, height):\n    assert width > 0, f\"width must be positive, got {width}\"\n    assert height > 0, f\"height must be positive, got {height}\"\n    \n    return width * height\n\nprint(f\"Area: {calculate_rectangle_area(5, 3)}\")\n\ntry:\n    calculate_rectangle_area(-1, 3)\nexcept AssertionError as e:\n    print(f\"Precondition failed: {e}\")\n\ntry:\n    calculate_rectangle_area(5, 0)\nexcept AssertionError as e:\n    print(f\"Precondition failed: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Area: 15 and caught errors", description: "Preconditions work" }]),
        hints: ["Check both width > 0 and height > 0", "Include the bad value in message"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson6_3_1.id,
        number: 3,
        title: "Postcondition Check",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add a postcondition to verify the result makes sense.",
        starterCode: "def absolute_value(n):\n    if n < 0:\n        result = -n\n    else:\n        result = n\n    \n    # Add postcondition: result must be >= 0\n    \n    return result\n\nprint(absolute_value(5))\nprint(absolute_value(-5))\nprint(absolute_value(0))",
        solution: "def absolute_value(n):\n    if n < 0:\n        result = -n\n    else:\n        result = n\n    \n    # Postcondition\n    assert result >= 0, f\"result must be non-negative, got {result}\"\n    \n    return result\n\nprint(f\"|5| = {absolute_value(5)}\")\nprint(f\"|-5| = {absolute_value(-5)}\")\nprint(f\"|0| = {absolute_value(0)}\")\nprint(\"All postconditions passed! ✓\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All postconditions passed", description: "Postcondition works" }]),
        hints: ["Check result >= 0 before returning", "This catches bugs in your logic"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson6_3_1.id,
        number: 4,
        title: "Assert vs Exception",
        type: "MULTIPLE_CHOICE",
        difficulty: "INTERMEDIATE",
        prompt: "User enters a filename. Which should you use to check it's not empty?",
        starterCode: "",
        solution: "Exception (raise ValueError) - user input validation",
        testCases: JSON.stringify([
          { input: "Exception - user input validation", expectedOutput: "true", description: "Correct!" },
          { input: "Assertion - programming error", expectedOutput: "false", description: "Assertions are for bugs" },
          { input: "Neither - let it crash", expectedOutput: "false", description: "Bad practice" },
        ]),
        hints: ["Is this a bug or expected user behavior?", "Assertions can be disabled"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson6_3_1.id,
        number: 5,
        title: "Complete Function with Assertions",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Add both preconditions and postconditions to this function.",
        starterCode: "def find_average_positive(numbers):\n    \"\"\"Return average of positive numbers in list.\n    \n    Preconditions:\n    - numbers is a list\n    - numbers is not empty\n    \n    Postconditions:\n    - result is positive (since we only average positives)\n    \"\"\"\n    # Add preconditions here\n    \n    positives = [n for n in numbers if n > 0]\n    \n    if not positives:\n        return 0\n    \n    result = sum(positives) / len(positives)\n    \n    # Add postcondition here\n    \n    return result\n\nprint(find_average_positive([1, -2, 3, -4, 5]))",
        solution: "def find_average_positive(numbers):\n    # Preconditions\n    assert isinstance(numbers, list), \"numbers must be a list\"\n    assert len(numbers) > 0, \"numbers cannot be empty\"\n    \n    positives = [n for n in numbers if n > 0]\n    \n    if not positives:\n        return 0  # No postcondition needed - 0 is valid\n    \n    result = sum(positives) / len(positives)\n    \n    # Postcondition\n    assert result > 0, f\"average of positives must be positive, got {result}\"\n    \n    return result\n\nprint(f\"Average of positives: {find_average_positive([1, -2, 3, -4, 5])}\")\nprint(f\"No positives: {find_average_positive([-1, -2, -3])}\")\n\ntry:\n    find_average_positive([])\nexcept AssertionError as e:\n    print(f\"Precondition caught: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All assertions work", description: "Complete defensive function" }]),
        hints: ["isinstance(x, list) checks type", "Postcondition only when there are positives"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 6.3.1`);

  // Verify Chapter 6 is complete
  const chapter6 = await prisma.chapter.findFirst({
    where: { number: 6 },
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

  if (chapter6) {
    console.log("\n" + "=".repeat(60));
    console.log("📚 CHAPTER 6 COMPLETE!");
    console.log("=".repeat(60));
    
    let totalLessons = 0;
    let totalExercises = 0;
    
    for (const section of chapter6.sections) {
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

  // Show overall curriculum status
  const allChapters = await prisma.chapter.findMany({
    orderBy: { number: 'asc' },
    include: {
      sections: {
        include: {
          lessons: {
            include: { _count: { select: { exercises: true } } }
          }
        }
      }
    }
  });

  console.log("\n\n📊 FULL CURRICULUM STATUS:");
  console.log("═".repeat(65));
  
  let grandLessons = 0;
  let grandExercises = 0;
  
  for (const ch of allChapters) {
    let chLessons = 0;
    let chExercises = 0;
    for (const sec of ch.sections) {
      chLessons += sec.lessons.length;
      for (const les of sec.lessons) {
        chExercises += les._count.exercises;
      }
    }
    grandLessons += chLessons;
    grandExercises += chExercises;
    
    const status = chLessons > 0 ? '✅' : '⏳';
    console.log(`${status} Ch ${ch.number}: ${ch.title.substring(0, 40).padEnd(40)} | ${String(chLessons).padStart(2)} lessons, ${String(chExercises).padStart(3)} ex`);
  }
  
  console.log("─".repeat(65));
  console.log(`📈 GRAND TOTAL: ${grandLessons} lessons, ${grandExercises} exercises`);
  console.log("═".repeat(65));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
