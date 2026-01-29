import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 6 Part 1: Structure + Lessons 6.1.1-6.1.2...\n");

  // Clean existing Chapter 6
  const existingCh6 = await prisma.chapter.findFirst({ where: { number: 6 } });
  if (existingCh6) {
    const sections = await prisma.section.findMany({ where: { chapterId: existingCh6.id } });
    for (const section of sections) {
      const lessons = await prisma.lesson.findMany({ where: { sectionId: section.id } });
      for (const lesson of lessons) {
        await prisma.exercise.deleteMany({ where: { lessonId: lesson.id } });
      }
      await prisma.lesson.deleteMany({ where: { sectionId: section.id } });
    }
    await prisma.section.deleteMany({ where: { chapterId: existingCh6.id } });
    console.log("🧹 Cleaned existing Chapter 6");
  }

  // Create Chapter 6
  let chapter6 = await prisma.chapter.findFirst({ where: { number: 6 } });
  if (!chapter6) {
    chapter6 = await prisma.chapter.create({
      data: {
        number: 6,
        title: "Testing and Debugging",
        description: "Learn systematic approaches to finding and fixing bugs. Master test case design, debugging strategies, and defensive programming with assertions.",
        objectives: [
          "Design effective test cases",
          "Apply black-box and glass-box testing",
          "Debug systematically using scientific method",
          "Use assertions for defensive programming",
        ],
        isPublished: true,
      },
    });
  }
  console.log(`✅ Chapter ${chapter6.number}: ${chapter6.title}`);

  // Create Sections
  const section6_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter6.id, number: 6.1 } },
    update: {},
    create: { chapterId: chapter6.id, number: 6.1, title: "Testing", description: "Systematic testing approaches.", order: 1 },
  });
  console.log(`  📂 Section ${section6_1.number}: ${section6_1.title}`);

  const section6_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter6.id, number: 6.2 } },
    update: {},
    create: { chapterId: chapter6.id, number: 6.2, title: "Debugging", description: "Finding and fixing bugs.", order: 2 },
  });
  console.log(`  📂 Section ${section6_2.number}: ${section6_2.title}`);

  const section6_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter6.id, number: 6.3 } },
    update: {},
    create: { chapterId: chapter6.id, number: 6.3, title: "Defensive Programming", description: "Assertions and error prevention.", order: 3 },
  });
  console.log(`  📂 Section ${section6_3.number}: ${section6_3.title}`);

  // ==================== LESSON 6.1.1 ====================
  const lesson6_1_1 = await prisma.lesson.upsert({
    where: { slug: "why-testing-matters" },
    update: {},
    create: {
      sectionId: section6_1.id,
      number: 6.11,
      title: "Why Testing Matters",
      slug: "why-testing-matters",
      objectives: [
        "Understand why all programs have bugs",
        "Recognize testing vs debugging difference",
        "Value testing as essential practice",
        "See testing as confidence builder",
      ],
      content: `# Why Testing Matters

## All Programs Have Bugs

Even the best programmers write buggy code:
- Typos and syntax errors
- Logic errors (wrong algorithm)
- Edge cases not considered
- Misunderstanding requirements

**Djikstra's famous quote**: "Testing can show the presence of bugs, but not their absence."

## Testing vs Debugging

**Testing**: Running code to find bugs
**Debugging**: Fixing bugs once found

Testing comes BEFORE debugging. You can't fix what you haven't found!

## Why Test?

### 1. Find Bugs Early
Bugs found early are cheap to fix:
- During coding: Minutes to fix
- During testing: Hours to fix
- In production: Days/weeks + reputation damage

### 2. Confidence, Not Hope
Without testing: "I hope it works"
With testing: "I know it handles these cases"

### 3. Prevent Regression
When you change code, tests verify you didn't break existing functionality.

### 4. Documentation
Tests show how code should be used and what it should do.

## The Cost of Not Testing

\`\`\`python
def calculate_discount(price, percent):
    return price - (price * percent)

# Looks fine, but...
calculate_discount(100, 50)   # Returns 50... but 50% should be 50!
calculate_discount(100, 0.50) # Returns 50, correct!
# Bug: percent should be 0-1, not 0-100
\`\`\`

Simple test would have caught this immediately.

## Testing Mindset

Think like an adversary:
- What inputs might break this?
- What assumptions am I making?
- What's the weirdest valid input?`,
      codeExamples: JSON.stringify([
        {
          id: "simple-bug",
          title: "A Simple Bug",
          code: "def is_even(n):\n    \"\"\"Check if number is even.\"\"\"\n    return n % 2 == 0  # Looks correct!\n\n# Let's test it\nprint(f\"is_even(4): {is_even(4)}\")   # True ✓\nprint(f\"is_even(5): {is_even(5)}\")   # False ✓\nprint(f\"is_even(0): {is_even(0)}\")   # True ✓\n\n# But what about...\nprint(f\"is_even(-4): {is_even(-4)}\") # True ✓ (works!)\nprint(f\"is_even(4.0): {is_even(4.0)}\") # True (float!)\n# Testing reveals what inputs work",
          description: "Testing reveals edge cases",
        },
        {
          id: "bug-cost",
          title: "Cost of Not Testing",
          code: "def calculate_average(numbers):\n    \"\"\"Calculate average of a list.\"\"\"\n    total = sum(numbers)\n    return total / len(numbers)\n\n# Works for normal cases\nprint(calculate_average([1, 2, 3, 4, 5]))  # 3.0 ✓\n\n# But what about edge cases?\n# print(calculate_average([]))  # ZeroDivisionError!\n\n# A test would have caught this!\n# Fixed version:\ndef calculate_average_safe(numbers):\n    if not numbers:\n        return 0  # Or raise ValueError\n    return sum(numbers) / len(numbers)\n\nprint(calculate_average_safe([]))  # 0 (safe!)",
          description: "Edge cases cause crashes",
        },
        {
          id: "testing-gives-confidence",
          title: "Testing Gives Confidence",
          code: "def factorial(n):\n    \"\"\"Calculate n! (n factorial).\"\"\"\n    if n < 0:\n        raise ValueError(\"n must be non-negative\")\n    if n == 0:\n        return 1\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n    return result\n\n# Comprehensive tests give confidence\ntest_cases = [\n    (0, 1),      # Base case\n    (1, 1),      # Simple case\n    (5, 120),    # Normal case\n    (10, 3628800), # Larger case\n]\n\nprint(\"Running tests...\")\nall_passed = True\nfor n, expected in test_cases:\n    result = factorial(n)\n    status = \"✓\" if result == expected else \"✗\"\n    if result != expected:\n        all_passed = False\n    print(f\"  factorial({n}) = {result} {status}\")\n\nprint(f\"\\nAll tests passed: {all_passed}\")",
          description: "Tests verify correctness",
        },
        {
          id: "regression-testing",
          title: "Preventing Regression",
          code: "# Original function\ndef greet(name):\n    return f\"Hello, {name}!\"\n\n# Tests for original\nassert greet(\"Alice\") == \"Hello, Alice!\"\nassert greet(\"Bob\") == \"Hello, Bob!\"\nprint(\"Original tests pass ✓\")\n\n# Now we \"improve\" it... but introduce bug\ndef greet_v2(name):\n    # Added feature: handle empty name\n    if not name:\n        return \"Hello, stranger!\"\n    return f\"Hello {name}!\"  # Oops! Missing comma\n\n# Old tests catch the regression!\ntry:\n    assert greet_v2(\"Alice\") == \"Hello, Alice!\"\nexcept AssertionError:\n    print(\"Regression detected! 'Hello Alice!' != 'Hello, Alice!'\")\n\n# Tests protected us from breaking change!",
          description: "Tests catch regression bugs",
        },
      ]),
      keyPoints: [
        "All programs have bugs - testing finds them",
        "Testing finds bugs, debugging fixes them",
        "Bugs found early are cheaper to fix",
        "Testing gives confidence, not just hope",
        "Tests prevent regression (breaking existing code)",
        "Tests serve as documentation",
        "Think adversarially when testing",
        "Test edge cases, not just happy path",
      ],
      hardwareDemo: "Watch test cases execute. See pass/fail status accumulate.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson6_1_1.number}: ${lesson6_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson6_1_1.id,
        number: 1,
        title: "Find the Bug",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "This function should return True if a number is positive. Find the bug by testing.",
        starterCode: "def is_positive(n):\n    return n > 1  # Bug here!\n\n# Test with various inputs to find the bug\nprint(is_positive(5))   # Expected: True\nprint(is_positive(1))   # Expected: True - what does it return?\nprint(is_positive(0))   # Expected: False\nprint(is_positive(-3))  # Expected: False",
        solution: "def is_positive(n):\n    return n > 0  # Fixed: > 0, not > 1\n\nprint(is_positive(5))   # True ✓\nprint(is_positive(1))   # True ✓ (was False with bug!)\nprint(is_positive(0))   # False ✓\nprint(is_positive(-3))  # False ✓",
        testCases: JSON.stringify([{ input: "", expectedOutput: "True\\nTrue\\nFalse\\nFalse", description: "All cases correct" }]),
        hints: ["Test with 1 - is it positive?", "The bug is in the comparison"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson6_1_1.id,
        number: 2,
        title: "Test Edge Cases",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Write tests for this function. What happens with empty list?",
        starterCode: "def get_first(items):\n    return items[0]\n\n# Test normal case\nprint(get_first([1, 2, 3]))  # Works!\n\n# What about edge cases?\n# Test: empty list\n# Test: single item",
        solution: "def get_first(items):\n    return items[0]\n\n# Normal case\nprint(get_first([1, 2, 3]))  # 1 ✓\n\n# Single item\nprint(get_first([42]))  # 42 ✓\n\n# Empty list - this crashes!\ntry:\n    print(get_first([]))\nexcept IndexError as e:\n    print(f\"Bug found! Empty list causes: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Finds the empty list bug", description: "Edge case found" }]),
        hints: ["Try an empty list []", "What error do you get?"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson6_1_1.id,
        number: 3,
        title: "Write Simple Tests",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write 4 test cases for this absolute value function.",
        starterCode: "def absolute(n):\n    if n < 0:\n        return -n\n    return n\n\n# Write 4 tests: positive, negative, zero, and one edge case\n",
        solution: "def absolute(n):\n    if n < 0:\n        return -n\n    return n\n\n# Test positive\nassert absolute(5) == 5, \"Positive failed\"\nprint(\"Positive: ✓\")\n\n# Test negative\nassert absolute(-5) == 5, \"Negative failed\"\nprint(\"Negative: ✓\")\n\n# Test zero\nassert absolute(0) == 0, \"Zero failed\"\nprint(\"Zero: ✓\")\n\n# Test large negative\nassert absolute(-1000000) == 1000000, \"Large negative failed\"\nprint(\"Large negative: ✓\")\n\nprint(\"\\nAll tests passed!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All tests passed!", description: "Tests written" }]),
        hints: ["Use assert value == expected", "Test positive, negative, zero"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson6_1_1.id,
        number: 4,
        title: "Testing vs Hoping",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "What's the main difference between testing and debugging?",
        starterCode: "",
        solution: "Testing finds bugs, debugging fixes them",
        testCases: JSON.stringify([
          { input: "Testing finds bugs, debugging fixes them", expectedOutput: "true", description: "Correct!" },
          { input: "They are the same thing", expectedOutput: "false", description: "No, they're different" },
          { input: "Debugging finds bugs, testing fixes them", expectedOutput: "false", description: "Backwards" },
        ]),
        hints: ["Think about the order of operations", "First find, then fix"],
        xpReward: 10,
        order: 4,
      },
      {
        lessonId: lesson6_1_1.id,
        number: 5,
        title: "Test the Discount",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Test this discount function. Find and fix the bug.",
        starterCode: "def apply_discount(price, discount_percent):\n    \"\"\"Apply discount to price. discount_percent is 0-100.\"\"\"\n    return price - (price * discount_percent)\n\n# Test cases\nprint(apply_discount(100, 10))  # Should be 90 (10% off)\nprint(apply_discount(100, 50))  # Should be 50 (50% off)\n# What's wrong?",
        solution: "def apply_discount(price, discount_percent):\n    \"\"\"Apply discount to price. discount_percent is 0-100.\"\"\"\n    return price - (price * discount_percent / 100)  # Fixed!\n\n# Test cases\nprint(apply_discount(100, 10))  # 90.0 ✓\nprint(apply_discount(100, 50))  # 50.0 ✓\nprint(apply_discount(100, 0))   # 100.0 ✓ (no discount)\nprint(apply_discount(100, 100)) # 0.0 ✓ (free!)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "90.0\\n50.0", description: "Discount works" }]),
        hints: ["10% of 100 should be 10, not 1000", "Need to divide by 100"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 6.1.1`);

  // ==================== LESSON 6.1.2 ====================
  const lesson6_1_2 = await prisma.lesson.upsert({
    where: { slug: "designing-test-cases" },
    update: {},
    create: {
      sectionId: section6_1.id,
      number: 6.12,
      title: "Designing Test Cases",
      slug: "designing-test-cases",
      objectives: [
        "Design tests for boundary conditions",
        "Create normal case tests",
        "Identify edge cases",
        "Test both success and failure paths",
      ],
      content: `# Designing Test Cases

## What Makes a Good Test Suite?

A good test suite:
- Covers normal cases (typical usage)
- Checks boundary conditions (edges)
- Tests edge cases (unusual but valid)
- Verifies error handling (invalid inputs)

## Categories of Test Cases

### 1. Normal Cases
Typical, expected inputs:
\`\`\`python
# For a function that finds max
find_max([3, 1, 4, 1, 5])  # Normal list
find_max([10, 20, 30])      # Another normal list
\`\`\`

### 2. Boundary Conditions
At the edges of valid input:
\`\`\`python
find_max([42])     # Single element (minimum valid)
find_max([1, 1])   # All same values
\`\`\`

### 3. Edge Cases
Unusual but valid inputs:
\`\`\`python
find_max([-5, -3, -10])  # All negative
find_max([0, 0, 0])      # All zeros
find_max([1000000])      # Very large
\`\`\`

### 4. Error Cases
Invalid inputs (should fail gracefully):
\`\`\`python
find_max([])      # Empty list - should handle!
find_max(None)    # None input
find_max("abc")   # Wrong type
\`\`\`

## The ZOMBIES Acronym

- **Z**ero: Empty collections, zero values
- **O**ne: Single element, single character
- **M**any: Multiple items (normal case)
- **B**oundary: At limits (min/max values)
- **I**nterface: Wrong types, None
- **E**xceptions: Error conditions
- **S**imple: Start with simplest case

## Boundary Testing

For numeric inputs, test:
- Minimum valid value
- Maximum valid value
- Just below minimum
- Just above maximum
- Zero (often special)`,
      codeExamples: JSON.stringify([
        {
          id: "test-categories",
          title: "Categories of Test Cases",
          code: "def find_max(numbers):\n    \"\"\"Find maximum value in list.\"\"\"\n    if not numbers:\n        raise ValueError(\"Empty list\")\n    return max(numbers)\n\n# NORMAL CASES\nprint(\"Normal cases:\")\nprint(f\"  [3,1,4,1,5]: {find_max([3,1,4,1,5])}\")  # 5\nprint(f\"  [10,20,30]: {find_max([10,20,30])}\")    # 30\n\n# BOUNDARY CONDITIONS\nprint(\"\\nBoundary cases:\")\nprint(f\"  [42] (single): {find_max([42])}\")       # 42\nprint(f\"  [5,5,5] (same): {find_max([5,5,5])}\")   # 5\n\n# EDGE CASES\nprint(\"\\nEdge cases:\")\nprint(f\"  [-5,-3,-10]: {find_max([-5,-3,-10])}\") # -3\nprint(f\"  [0]: {find_max([0])}\")                  # 0\n\n# ERROR CASES\nprint(\"\\nError cases:\")\ntry:\n    find_max([])\nexcept ValueError as e:\n    print(f\"  []: Caught error - {e}\")",
          description: "Testing all categories",
        },
        {
          id: "zombies",
          title: "ZOMBIES Test Method",
          code: "def count_items(items, target):\n    \"\"\"Count occurrences of target in items.\"\"\"\n    return items.count(target)\n\nprint(\"Testing with ZOMBIES:\")\n\n# Z - Zero\nprint(f\"Zero (empty): {count_items([], 'x')}\")  # 0\n\n# O - One\nprint(f\"One (single): {count_items(['a'], 'a')}\")  # 1\nprint(f\"One (no match): {count_items(['a'], 'b')}\")  # 0\n\n# M - Many\nprint(f\"Many: {count_items(['a','b','a','c','a'], 'a')}\")  # 3\n\n# B - Boundary\nprint(f\"Boundary (all same): {count_items(['x','x','x'], 'x')}\")  # 3\n\n# I - Interface (different types work?)\nprint(f\"Interface (ints): {count_items([1,2,1,3], 1)}\")  # 2\n\n# E - Exceptions (what should fail?)\n# count_items(None, 'x')  # Would raise AttributeError\n\n# S - Simple (start here)\nprint(f\"Simple: {count_items([1], 1)}\")  # 1",
          description: "ZOMBIES testing method",
        },
        {
          id: "boundary-testing",
          title: "Boundary Testing",
          code: "def is_valid_percentage(value):\n    \"\"\"Check if value is valid percentage (0-100).\"\"\"\n    return 0 <= value <= 100\n\nprint(\"Boundary testing for percentage:\")\n\n# Inside boundaries\nprint(f\"  50 (middle): {is_valid_percentage(50)}\")    # True\n\n# At boundaries\nprint(f\"  0 (min): {is_valid_percentage(0)}\")         # True\nprint(f\"  100 (max): {is_valid_percentage(100)}\")     # True\n\n# Just outside boundaries\nprint(f\"  -1 (below min): {is_valid_percentage(-1)}\") # False\nprint(f\"  101 (above max): {is_valid_percentage(101)}\") # False\n\n# Edge values\nprint(f\"  0.001 (tiny): {is_valid_percentage(0.001)}\") # True\nprint(f\"  99.999 (almost max): {is_valid_percentage(99.999)}\") # True",
          description: "Testing at boundaries",
        },
        {
          id: "comprehensive-suite",
          title: "Building a Test Suite",
          code: "def calculate_grade(score):\n    \"\"\"Convert score (0-100) to letter grade.\"\"\"\n    if score < 0 or score > 100:\n        raise ValueError(\"Score must be 0-100\")\n    if score >= 90: return 'A'\n    if score >= 80: return 'B'\n    if score >= 70: return 'C'\n    if score >= 60: return 'D'\n    return 'F'\n\ndef run_tests():\n    tests = [\n        # (input, expected, description)\n        (95, 'A', 'High A'),\n        (90, 'A', 'Boundary A'),\n        (89, 'B', 'Just below A'),\n        (80, 'B', 'Boundary B'),\n        (75, 'C', 'Middle C'),\n        (70, 'C', 'Boundary C'),\n        (60, 'D', 'Boundary D'),\n        (59, 'F', 'Just below D'),\n        (0, 'F', 'Zero'),\n        (100, 'A', 'Perfect'),\n    ]\n    \n    passed = 0\n    for score, expected, desc in tests:\n        result = calculate_grade(score)\n        status = '✓' if result == expected else '✗'\n        if result == expected:\n            passed += 1\n        print(f\"  {status} {desc}: {score} -> {result}\")\n    \n    print(f\"\\nPassed: {passed}/{len(tests)}\")\n\nrun_tests()",
          description: "Complete test suite",
        },
      ]),
      keyPoints: [
        "Test normal cases (typical usage)",
        "Test boundaries (min, max, edges)",
        "Test edge cases (unusual but valid)",
        "Test error cases (invalid input)",
        "Use ZOMBIES: Zero, One, Many, Boundary, Interface, Exceptions, Simple",
        "Boundary testing catches off-by-one errors",
        "Think adversarially - how could this break?",
        "Start simple, add complexity",
      ],
      hardwareDemo: "See test suite execute. Watch coverage of different paths.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson6_1_2.number}: ${lesson6_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson6_1_2.id,
        number: 1,
        title: "Identify Test Categories",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "For a function that finds the minimum value in a list, which is a BOUNDARY test case?",
        starterCode: "",
        solution: "A list with exactly one element",
        testCases: JSON.stringify([
          { input: "A list with 10 numbers", expectedOutput: "false", description: "Normal case" },
          { input: "A list with exactly one element", expectedOutput: "true", description: "Correct - boundary!" },
          { input: "An empty list", expectedOutput: "false", description: "Error case" },
        ]),
        hints: ["Boundary = at the edge of valid input", "What's the minimum valid list size?"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson6_1_2.id,
        number: 2,
        title: "Design Test Cases",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write test cases for is_palindrome(s) covering normal, boundary, and edge cases.",
        starterCode: "def is_palindrome(s):\n    return s == s[::-1]\n\n# Write tests for:\n# - Normal case (obvious palindrome)\n# - Normal case (not palindrome)\n# - Boundary (empty string)\n# - Boundary (single char)\n# - Edge (all same chars)\n",
        solution: "def is_palindrome(s):\n    return s == s[::-1]\n\n# Normal cases\nassert is_palindrome(\"racecar\") == True\nassert is_palindrome(\"hello\") == False\nprint(\"Normal cases: ✓\")\n\n# Boundary cases\nassert is_palindrome(\"\") == True  # Empty\nassert is_palindrome(\"a\") == True  # Single char\nprint(\"Boundary cases: ✓\")\n\n# Edge cases\nassert is_palindrome(\"aaa\") == True  # All same\nassert is_palindrome(\"ab\") == False  # Two different\nprint(\"Edge cases: ✓\")\n\nprint(\"\\nAll tests passed!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All tests passed!", description: "Tests cover categories" }]),
        hints: ["Palindrome reads same forwards and backwards", "Empty string is technically a palindrome"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson6_1_2.id,
        number: 3,
        title: "Boundary Testing",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write boundary tests for a function that validates ages (0-150).",
        starterCode: "def is_valid_age(age):\n    return 0 <= age <= 150\n\n# Write boundary tests:\n# At minimum (0)\n# At maximum (150)\n# Just below minimum (-1)\n# Just above maximum (151)\n",
        solution: "def is_valid_age(age):\n    return 0 <= age <= 150\n\n# At boundaries\nassert is_valid_age(0) == True, \"0 should be valid\"\nassert is_valid_age(150) == True, \"150 should be valid\"\nprint(\"At boundaries: ✓\")\n\n# Just outside boundaries\nassert is_valid_age(-1) == False, \"-1 should be invalid\"\nassert is_valid_age(151) == False, \"151 should be invalid\"\nprint(\"Outside boundaries: ✓\")\n\n# Also test typical values\nassert is_valid_age(25) == True\nassert is_valid_age(100) == True\nprint(\"Normal values: ✓\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All boundary tests pass", description: "Boundaries tested" }]),
        hints: ["Test exactly at 0 and 150", "Test -1 and 151"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson6_1_2.id,
        number: 4,
        title: "ZOMBIES Test",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Apply ZOMBIES testing to sum_list(numbers).",
        starterCode: "def sum_list(numbers):\n    if not numbers:\n        return 0\n    return sum(numbers)\n\n# Apply ZOMBIES:\n# Z - Zero\n# O - One\n# M - Many\n# B - Boundary\n# I - Interface (types)\n# E - Exceptions\n# S - Simple\n",
        solution: "def sum_list(numbers):\n    if not numbers:\n        return 0\n    return sum(numbers)\n\n# Z - Zero (empty)\nassert sum_list([]) == 0\nprint(\"Z (Zero): ✓\")\n\n# O - One element\nassert sum_list([5]) == 5\nprint(\"O (One): ✓\")\n\n# M - Many elements\nassert sum_list([1, 2, 3, 4, 5]) == 15\nprint(\"M (Many): ✓\")\n\n# B - Boundary (all zeros, negatives)\nassert sum_list([0, 0, 0]) == 0\nassert sum_list([-1, -2, -3]) == -6\nprint(\"B (Boundary): ✓\")\n\n# I - Interface (floats work?)\nassert sum_list([1.5, 2.5]) == 4.0\nprint(\"I (Interface): ✓\")\n\n# S - Simple\nassert sum_list([1, 1]) == 2\nprint(\"S (Simple): ✓\")\n\nprint(\"\\nZOMBIES complete!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "ZOMBIES complete!", description: "All ZOMBIES tested" }]),
        hints: ["Zero = empty list", "One = single element", "Many = normal list"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson6_1_2.id,
        number: 5,
        title: "Find Missing Test",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "These tests are incomplete. What important case is missing? Add it.",
        starterCode: "def divide(a, b):\n    return a / b\n\n# Existing tests\nassert divide(10, 2) == 5\nassert divide(9, 3) == 3\nassert divide(-6, 2) == -3\nassert divide(0, 5) == 0\n\n# What's missing? Add the test!\n",
        solution: "def divide(a, b):\n    if b == 0:\n        raise ValueError(\"Cannot divide by zero\")\n    return a / b\n\nassert divide(10, 2) == 5\nassert divide(9, 3) == 3\nassert divide(-6, 2) == -3\nassert divide(0, 5) == 0\n\n# Missing: division by zero!\ntry:\n    divide(5, 0)\n    print(\"ERROR: Should have raised exception!\")\nexcept (ValueError, ZeroDivisionError):\n    print(\"Division by zero test: ✓\")\n\nprint(\"All tests complete!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Division by zero test", description: "Found missing case" }]),
        hints: ["What happens when b is 0?", "This is a critical error case"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 6.1.2`);

  console.log("\n✅ Chapter 6 Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
