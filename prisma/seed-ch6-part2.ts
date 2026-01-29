import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 6 Part 2: Lessons 6.1.3-6.1.4...\n");

  const section6_1 = await prisma.section.findFirst({ where: { number: 6.1 } });
  if (!section6_1) throw new Error("Section 6.1 not found.");

  // ==================== LESSON 6.1.3 ====================
  const lesson6_1_3 = await prisma.lesson.upsert({
    where: { slug: "black-box-testing" },
    update: {},
    create: {
      sectionId: section6_1.id,
      number: 6.13,
      title: "Black-Box Testing",
      slug: "black-box-testing",
      objectives: [
        "Understand black-box testing concept",
        "Write tests from specifications only",
        "Ignore implementation details",
        "Design input/output test pairs",
      ],
      content: `# Black-Box Testing

## What Is Black-Box Testing?

Test the **specification**, not the implementation.

You treat the function as a "black box" - you can't see inside:
- You know WHAT it should do (specification)
- You DON'T know HOW it does it (implementation)

## Why Black-Box Testing?

1. **Tests the contract**: Does function do what it promises?
2. **Implementation-independent**: Tests work even if code changes
3. **Finds specification bugs**: When spec is unclear or wrong
4. **Anyone can write tests**: Don't need to read the code

## How to Black-Box Test

Given a specification:
\`\`\`
Function: is_prime(n)
Input: Integer n >= 2
Output: True if n is prime, False otherwise
\`\`\`

Create tests from spec alone:
\`\`\`python
# Prime numbers
is_prime(2)   # True (smallest prime)
is_prime(17)  # True (prime)

# Non-prime numbers  
is_prime(4)   # False (2*2)
is_prime(15)  # False (3*5)

# Boundary
is_prime(2)   # True (minimum valid input)
\`\`\`

## Input Space Partitioning

Divide inputs into categories, test each:

For \`is_prime(n)\`:
- Small primes: 2, 3, 5, 7
- Larger primes: 11, 13, 17, 97
- Small composites: 4, 6, 8, 9
- Larger composites: 100, 121
- Edge: 2 (smallest), 1 (invalid?)

## Black-Box Limitations

- Can't test internal error handling
- May miss code paths
- Relies on good specification

That's why we also need glass-box testing!`,
      codeExamples: JSON.stringify([
        {
          id: "black-box-concept",
          title: "Black-Box Testing Concept",
          code: "# SPECIFICATION:\n# Function: calculate_shipping(weight, distance)\n# Input: weight in kg (>0), distance in km (>0)\n# Output: shipping cost in dollars\n# Rules: $0.50 per kg + $0.10 per km\n\n# We write tests from SPEC ONLY (don't look at code!)\n\ndef test_shipping():\n    # We don't know the implementation\n    # We only know the specification\n    \n    # Normal cases\n    assert calculate_shipping(10, 100) == 10 * 0.50 + 100 * 0.10  # $15\n    assert calculate_shipping(5, 50) == 5 * 0.50 + 50 * 0.10      # $7.50\n    \n    # Boundary cases\n    assert calculate_shipping(1, 1) == 0.50 + 0.10               # $0.60\n    \n    print(\"All black-box tests pass!\")\n\n# Implementation (tester doesn't see this)\ndef calculate_shipping(weight, distance):\n    return weight * 0.50 + distance * 0.10\n\ntest_shipping()",
          description: "Testing from specification only",
        },
        {
          id: "input-partitioning",
          title: "Input Space Partitioning",
          code: "# SPECIFICATION:\n# Function: letter_grade(score)\n# Input: score 0-100\n# Output: 'A' (90-100), 'B' (80-89), 'C' (70-79), \n#         'D' (60-69), 'F' (0-59)\n\n# Partition the input space:\n# - A range: 90-100\n# - B range: 80-89  \n# - C range: 70-79\n# - D range: 60-69\n# - F range: 0-59\n# - Boundaries: 90, 80, 70, 60, 0, 100\n\ndef letter_grade(score):\n    if score >= 90: return 'A'\n    if score >= 80: return 'B'\n    if score >= 70: return 'C'\n    if score >= 60: return 'D'\n    return 'F'\n\n# Tests from each partition\nprint(\"Testing each partition:\")\nassert letter_grade(95) == 'A'   # Middle of A\nassert letter_grade(85) == 'B'   # Middle of B\nassert letter_grade(75) == 'C'   # Middle of C\nassert letter_grade(65) == 'D'   # Middle of D\nassert letter_grade(55) == 'F'   # Middle of F\nprint(\"  Partitions: ✓\")\n\n# Boundary tests\nassert letter_grade(90) == 'A'   # A boundary\nassert letter_grade(89) == 'B'   # Just below A\nassert letter_grade(80) == 'B'   # B boundary\nassert letter_grade(70) == 'C'   # C boundary\nassert letter_grade(60) == 'D'   # D boundary\nassert letter_grade(59) == 'F'   # Just below D\nprint(\"  Boundaries: ✓\")",
          description: "Partitioning input space",
        },
        {
          id: "spec-driven",
          title: "Specification-Driven Tests",
          code: "# SPECIFICATION:\n# Function: fizzbuzz(n)\n# Input: positive integer n\n# Output:\n#   - 'FizzBuzz' if divisible by both 3 and 5\n#   - 'Fizz' if divisible by 3 only\n#   - 'Buzz' if divisible by 5 only\n#   - str(n) otherwise\n\ndef fizzbuzz(n):\n    if n % 15 == 0: return 'FizzBuzz'\n    if n % 3 == 0: return 'Fizz'\n    if n % 5 == 0: return 'Buzz'\n    return str(n)\n\n# Tests derived from specification\nprint(\"FizzBuzz black-box tests:\")\n\n# Divisible by both 3 and 5\nassert fizzbuzz(15) == 'FizzBuzz'\nassert fizzbuzz(30) == 'FizzBuzz'\nprint(\"  Divisible by 3 and 5: ✓\")\n\n# Divisible by 3 only\nassert fizzbuzz(3) == 'Fizz'\nassert fizzbuzz(9) == 'Fizz'\nprint(\"  Divisible by 3 only: ✓\")\n\n# Divisible by 5 only\nassert fizzbuzz(5) == 'Buzz'\nassert fizzbuzz(10) == 'Buzz'\nprint(\"  Divisible by 5 only: ✓\")\n\n# Neither\nassert fizzbuzz(1) == '1'\nassert fizzbuzz(7) == '7'\nprint(\"  Neither: ✓\")",
          description: "Tests from specification rules",
        },
        {
          id: "implementation-independent",
          title: "Implementation Independence",
          code: "# Two different implementations, SAME specification\n# Black-box tests work for both!\n\n# Implementation 1: Using loop\ndef is_prime_v1(n):\n    if n < 2:\n        return False\n    for i in range(2, n):\n        if n % i == 0:\n            return False\n    return True\n\n# Implementation 2: Optimized (check up to sqrt)\ndef is_prime_v2(n):\n    if n < 2:\n        return False\n    if n == 2:\n        return True\n    if n % 2 == 0:\n        return False\n    i = 3\n    while i * i <= n:\n        if n % i == 0:\n            return False\n        i += 2\n    return True\n\n# Same black-box tests work for BOTH!\ndef test_is_prime(func):\n    assert func(2) == True\n    assert func(17) == True\n    assert func(4) == False\n    assert func(1) == False\n    return True\n\nprint(f\"v1 passes: {test_is_prime(is_prime_v1)}\")\nprint(f\"v2 passes: {test_is_prime(is_prime_v2)}\")\nprint(\"\\nSame tests, different implementations!\")",
          description: "Tests work across implementations",
        },
      ]),
      keyPoints: [
        "Black-box: test specification, not implementation",
        "Treat function as opaque box",
        "Write tests from documentation only",
        "Partition input space into categories",
        "Test each partition and boundaries",
        "Tests survive implementation changes",
        "Anyone can write black-box tests",
        "Combine with glass-box for complete coverage",
      ],
      hardwareDemo: "See tests run without viewing implementation. Watch pass/fail based on spec.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson6_1_3.number}: ${lesson6_1_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson6_1_3.id,
        number: 1,
        title: "Black-Box Concept",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "In black-box testing, what do you base your tests on?",
        starterCode: "",
        solution: "The function's specification (what it should do)",
        testCases: JSON.stringify([
          { input: "The function's specification", expectedOutput: "true", description: "Correct!" },
          { input: "The function's code", expectedOutput: "false", description: "That's glass-box" },
          { input: "Random inputs", expectedOutput: "false", description: "Tests should be systematic" },
        ]),
        hints: ["Black-box = can't see inside", "You only know the inputs and expected outputs"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson6_1_3.id,
        number: 2,
        title: "Write Black-Box Tests",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write black-box tests for: absolute_value(n) returns the absolute value of n.",
        starterCode: "# SPECIFICATION:\n# Function: absolute_value(n)\n# Input: Any number n\n# Output: |n| (non-negative)\n\ndef absolute_value(n):\n    # Implementation hidden - write tests from spec!\n    return abs(n)\n\n# Write tests based ONLY on specification\n",
        solution: "def absolute_value(n):\n    return abs(n)\n\n# Tests from specification\n# Positive numbers - return as-is\nassert absolute_value(5) == 5\nassert absolute_value(100) == 100\nprint(\"Positive: ✓\")\n\n# Negative numbers - return positive\nassert absolute_value(-5) == 5\nassert absolute_value(-100) == 100\nprint(\"Negative: ✓\")\n\n# Zero - special case\nassert absolute_value(0) == 0\nprint(\"Zero: ✓\")\n\n# Floats\nassert absolute_value(-3.14) == 3.14\nprint(\"Float: ✓\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All tests pass", description: "Black-box tests" }]),
        hints: ["Test positive, negative, zero", "Only use the specification"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson6_1_3.id,
        number: 3,
        title: "Partition Input Space",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Partition inputs and test: clamp(n, low, high) returns n clamped to range [low, high].",
        starterCode: "# SPECIFICATION:\n# clamp(n, low, high)\n# Returns: low if n < low\n#          high if n > high  \n#          n if low <= n <= high\n\ndef clamp(n, low, high):\n    return max(low, min(n, high))\n\n# Partition: below range, in range, above range\n# Write tests for each partition\n",
        solution: "def clamp(n, low, high):\n    return max(low, min(n, high))\n\n# Partition 1: Below range\nassert clamp(-5, 0, 10) == 0\nassert clamp(-100, 0, 10) == 0\nprint(\"Below range: ✓\")\n\n# Partition 2: In range\nassert clamp(5, 0, 10) == 5\nassert clamp(0, 0, 10) == 0  # At low boundary\nassert clamp(10, 0, 10) == 10  # At high boundary\nprint(\"In range: ✓\")\n\n# Partition 3: Above range\nassert clamp(15, 0, 10) == 10\nassert clamp(100, 0, 10) == 10\nprint(\"Above range: ✓\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All partitions tested", description: "Partitioning done" }]),
        hints: ["Three partitions: below, in, above", "Test boundaries too"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson6_1_3.id,
        number: 4,
        title: "Test from Spec Only",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write tests for this spec WITHOUT looking at implementation details.",
        starterCode: "# SPECIFICATION:\n# count_vowels(s)\n# Input: string s\n# Output: count of vowels (a, e, i, o, u) - case insensitive\n\ndef count_vowels(s):\n    # Don't look at this!\n    return sum(1 for c in s.lower() if c in 'aeiou')\n\n# Write comprehensive black-box tests\n",
        solution: "def count_vowels(s):\n    return sum(1 for c in s.lower() if c in 'aeiou')\n\n# Normal cases\nassert count_vowels(\"hello\") == 2  # e, o\nassert count_vowels(\"world\") == 1  # o\nprint(\"Normal: ✓\")\n\n# All vowels\nassert count_vowels(\"aeiou\") == 5\nassert count_vowels(\"AEIOU\") == 5  # Case insensitive\nprint(\"All vowels: ✓\")\n\n# No vowels\nassert count_vowels(\"xyz\") == 0\nassert count_vowels(\"rhythm\") == 0\nprint(\"No vowels: ✓\")\n\n# Empty string\nassert count_vowels(\"\") == 0\nprint(\"Empty: ✓\")\n\n# Mixed case\nassert count_vowels(\"HeLLo\") == 2\nprint(\"Mixed case: ✓\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All tests pass", description: "Comprehensive tests" }]),
        hints: ["Test with vowels, without vowels", "Test case insensitivity", "Test empty string"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson6_1_3.id,
        number: 5,
        title: "Implementation Independent",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write tests that work for ANY correct implementation of max_of_three(a, b, c).",
        starterCode: "# SPECIFICATION:\n# max_of_three(a, b, c)\n# Returns the largest of three numbers\n\n# Two different implementations\ndef max_v1(a, b, c):\n    return max(a, b, c)\n\ndef max_v2(a, b, c):\n    if a >= b and a >= c: return a\n    if b >= c: return b\n    return c\n\n# Write tests that pass for BOTH\ndef run_tests(func):\n    # Your tests here\n    pass\n\nrun_tests(max_v1)\nrun_tests(max_v2)",
        solution: "def max_v1(a, b, c):\n    return max(a, b, c)\n\ndef max_v2(a, b, c):\n    if a >= b and a >= c: return a\n    if b >= c: return b\n    return c\n\ndef run_tests(func):\n    # First is max\n    assert func(5, 3, 1) == 5\n    # Second is max\n    assert func(1, 5, 3) == 5\n    # Third is max\n    assert func(1, 3, 5) == 5\n    # All equal\n    assert func(5, 5, 5) == 5\n    # Two equal (max)\n    assert func(5, 5, 3) == 5\n    # Negative numbers\n    assert func(-1, -5, -3) == -1\n    print(f\"{func.__name__}: All tests pass ✓\")\n\nrun_tests(max_v1)\nrun_tests(max_v2)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Both pass", description: "Implementation independent" }]),
        hints: ["Max could be in any position", "Test when values are equal", "Test negatives"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 6.1.3`);

  // ==================== LESSON 6.1.4 ====================
  const lesson6_1_4 = await prisma.lesson.upsert({
    where: { slug: "glass-box-testing" },
    update: {},
    create: {
      sectionId: section6_1.id,
      number: 6.14,
      title: "Glass-Box Testing",
      slug: "glass-box-testing",
      objectives: [
        "Understand glass-box (white-box) testing",
        "Achieve code path coverage",
        "Test all branches and conditions",
        "Complement black-box testing",
      ],
      content: `# Glass-Box Testing

## What Is Glass-Box Testing?

Test based on the **code structure** itself.

You CAN see inside the box:
- Examine the implementation
- Test each code path
- Ensure all branches execute

Also called: white-box testing, structural testing

## Why Glass-Box Testing?

1. **Code coverage**: Ensure all code runs
2. **Branch coverage**: Test all if/else paths
3. **Find dead code**: Code that never executes
4. **Complement black-box**: Different perspective

## Types of Coverage

### Statement Coverage
Every line executes at least once.

### Branch Coverage
Every branch (if/else) taken at least once.

\`\`\`python
def foo(x):
    if x > 0:      # Branch 1
        return "positive"
    else:          # Branch 2
        return "non-positive"

# Need tests for BOTH branches
foo(5)   # Tests branch 1
foo(-5)  # Tests branch 2
\`\`\`

### Path Coverage
Every possible path through code tested.

\`\`\`python
def bar(a, b):
    if a > 0:     # Decision 1
        x = 1
    else:
        x = 2
    if b > 0:     # Decision 2
        y = 1
    else:
        y = 2
    return x + y

# 4 paths: (a>0,b>0), (a>0,b≤0), (a≤0,b>0), (a≤0,b≤0)
\`\`\`

## Glass-Box Process

1. Read the code
2. Identify all branches/paths
3. Write tests to cover each
4. Verify coverage achieved`,
      codeExamples: JSON.stringify([
        {
          id: "branch-coverage",
          title: "Branch Coverage",
          code: "def categorize_age(age):\n    if age < 0:\n        return \"invalid\"\n    elif age < 13:\n        return \"child\"\n    elif age < 20:\n        return \"teenager\"\n    elif age < 65:\n        return \"adult\"\n    else:\n        return \"senior\"\n\n# Glass-box: test EACH branch\nprint(\"Testing each branch:\")\n\nassert categorize_age(-5) == \"invalid\"   # Branch 1\nprint(\"  invalid: ✓\")\n\nassert categorize_age(10) == \"child\"     # Branch 2\nprint(\"  child: ✓\")\n\nassert categorize_age(15) == \"teenager\"  # Branch 3\nprint(\"  teenager: ✓\")\n\nassert categorize_age(30) == \"adult\"     # Branch 4\nprint(\"  adult: ✓\")\n\nassert categorize_age(70) == \"senior\"    # Branch 5\nprint(\"  senior: ✓\")\n\nprint(\"\\n100% branch coverage!\")",
          description: "Testing every branch",
        },
        {
          id: "path-coverage",
          title: "Path Coverage",
          code: "def process(a, b):\n    result = 0\n    \n    if a > 0:        # Decision 1\n        result += 10\n    else:\n        result += 1\n    \n    if b > 0:        # Decision 2\n        result *= 2\n    else:\n        result *= 3\n    \n    return result\n\n# 4 possible paths through code\nprint(\"Testing all paths:\")\n\n# Path 1: a>0, b>0\nassert process(1, 1) == (10) * 2  # 20\nprint(\"  Path (T,T): ✓\")\n\n# Path 2: a>0, b≤0\nassert process(1, -1) == (10) * 3  # 30\nprint(\"  Path (T,F): ✓\")\n\n# Path 3: a≤0, b>0\nassert process(-1, 1) == (1) * 2  # 2\nprint(\"  Path (F,T): ✓\")\n\n# Path 4: a≤0, b≤0\nassert process(-1, -1) == (1) * 3  # 3\nprint(\"  Path (F,F): ✓\")\n\nprint(\"\\n100% path coverage!\")",
          description: "Testing every path",
        },
        {
          id: "loop-coverage",
          title: "Loop Coverage",
          code: "def find_first_negative(numbers):\n    \"\"\"Return index of first negative, or -1 if none.\"\"\"\n    for i, num in enumerate(numbers):\n        if num < 0:\n            return i\n    return -1\n\n# Glass-box: test loop scenarios\nprint(\"Loop coverage tests:\")\n\n# Loop never executes (empty list)\nassert find_first_negative([]) == -1\nprint(\"  Empty list (0 iterations): ✓\")\n\n# Loop executes once, found\nassert find_first_negative([-5]) == 0\nprint(\"  Single negative (1 iter, found): ✓\")\n\n# Loop executes once, not found\nassert find_first_negative([5]) == -1\nprint(\"  Single positive (1 iter, not found): ✓\")\n\n# Loop executes multiple times, found early\nassert find_first_negative([1, -2, 3]) == 1\nprint(\"  Found in middle: ✓\")\n\n# Loop executes all iterations, found at end\nassert find_first_negative([1, 2, -3]) == 2\nprint(\"  Found at end: ✓\")\n\n# Loop completes, none found\nassert find_first_negative([1, 2, 3]) == -1\nprint(\"  None found: ✓\")",
          description: "Testing loop iterations",
        },
        {
          id: "combining-approaches",
          title: "Combining Black-Box and Glass-Box",
          code: "def is_leap_year(year):\n    \"\"\"Check if year is a leap year.\"\"\"\n    # Divisible by 4\n    # BUT not by 100\n    # UNLESS also by 400\n    if year % 400 == 0:\n        return True\n    if year % 100 == 0:\n        return False\n    if year % 4 == 0:\n        return True\n    return False\n\nprint(\"BLACK-BOX tests (from spec):\")\nassert is_leap_year(2024) == True   # Typical leap year\nassert is_leap_year(2023) == False  # Non-leap year\nprint(\"  Typical cases: ✓\")\n\nprint(\"\\nGLASS-BOX tests (from code):\")\nassert is_leap_year(2000) == True   # Branch 1: div by 400\nassert is_leap_year(1900) == False  # Branch 2: div by 100 not 400\nassert is_leap_year(2024) == True   # Branch 3: div by 4 not 100\nassert is_leap_year(2023) == False  # Branch 4: not div by 4\nprint(\"  All branches: ✓\")\n\nprint(\"\\nCombined approach = thorough testing!\")",
          description: "Both approaches together",
        },
      ]),
      keyPoints: [
        "Glass-box: test based on code structure",
        "Statement coverage: every line runs",
        "Branch coverage: every if/else path",
        "Path coverage: every combination",
        "Test loop: zero, one, many iterations",
        "Complements black-box testing",
        "Helps find dead code",
        "Requires reading implementation",
      ],
      hardwareDemo: "Highlight code lines as tests run. Show coverage percentage grow.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 4,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson6_1_4.number}: ${lesson6_1_4.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson6_1_4.id,
        number: 1,
        title: "Glass-Box Concept",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "What does glass-box testing examine?",
        starterCode: "",
        solution: "The actual code implementation",
        testCases: JSON.stringify([
          { input: "The actual code implementation", expectedOutput: "true", description: "Correct!" },
          { input: "Only the specification", expectedOutput: "false", description: "That's black-box" },
          { input: "User feedback", expectedOutput: "false", description: "That's user testing" },
        ]),
        hints: ["Glass = you can see through it", "You look at the code"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson6_1_4.id,
        number: 2,
        title: "Branch Coverage",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write tests to achieve 100% branch coverage.",
        starterCode: "def sign(n):\n    if n > 0:\n        return \"positive\"\n    elif n < 0:\n        return \"negative\"\n    else:\n        return \"zero\"\n\n# Write tests to cover ALL branches\n",
        solution: "def sign(n):\n    if n > 0:\n        return \"positive\"\n    elif n < 0:\n        return \"negative\"\n    else:\n        return \"zero\"\n\n# Branch 1: n > 0\nassert sign(5) == \"positive\"\nprint(\"Branch 1 (positive): ✓\")\n\n# Branch 2: n < 0\nassert sign(-5) == \"negative\"\nprint(\"Branch 2 (negative): ✓\")\n\n# Branch 3: n == 0\nassert sign(0) == \"zero\"\nprint(\"Branch 3 (zero): ✓\")\n\nprint(\"\\n100% branch coverage!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "100% branch coverage", description: "All branches" }]),
        hints: ["Three branches: positive, negative, zero", "Need one test per branch"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson6_1_4.id,
        number: 3,
        title: "Path Coverage",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write tests for all 4 paths through this function.",
        starterCode: "def classify(x, y):\n    result = \"\"\n    if x > 0:\n        result += \"X+\"\n    else:\n        result += \"X-\"\n    if y > 0:\n        result += \"Y+\"\n    else:\n        result += \"Y-\"\n    return result\n\n# 4 paths: (x>0,y>0), (x>0,y≤0), (x≤0,y>0), (x≤0,y≤0)\n",
        solution: "def classify(x, y):\n    result = \"\"\n    if x > 0:\n        result += \"X+\"\n    else:\n        result += \"X-\"\n    if y > 0:\n        result += \"Y+\"\n    else:\n        result += \"Y-\"\n    return result\n\n# Path 1: x>0, y>0\nassert classify(1, 1) == \"X+Y+\"\nprint(\"Path (T,T): ✓\")\n\n# Path 2: x>0, y≤0\nassert classify(1, -1) == \"X+Y-\"\nprint(\"Path (T,F): ✓\")\n\n# Path 3: x≤0, y>0\nassert classify(-1, 1) == \"X-Y+\"\nprint(\"Path (F,T): ✓\")\n\n# Path 4: x≤0, y≤0\nassert classify(-1, -1) == \"X-Y-\"\nprint(\"Path (F,F): ✓\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All 4 paths", description: "Path coverage" }]),
        hints: ["2 decisions = 4 paths", "Test all combinations of True/False"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson6_1_4.id,
        number: 4,
        title: "Loop Coverage",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write tests for loop scenarios: 0, 1, and many iterations.",
        starterCode: "def sum_until_negative(numbers):\n    \"\"\"Sum numbers until negative found.\"\"\"\n    total = 0\n    for num in numbers:\n        if num < 0:\n            break\n        total += num\n    return total\n\n# Test: empty, single, multiple, with/without negative\n",
        solution: "def sum_until_negative(numbers):\n    total = 0\n    for num in numbers:\n        if num < 0:\n            break\n        total += num\n    return total\n\n# 0 iterations (empty)\nassert sum_until_negative([]) == 0\nprint(\"0 iterations: ✓\")\n\n# 1 iteration, no break\nassert sum_until_negative([5]) == 5\nprint(\"1 iteration (no break): ✓\")\n\n# 1 iteration, immediate break\nassert sum_until_negative([-1]) == 0\nprint(\"1 iteration (break): ✓\")\n\n# Many iterations, no break\nassert sum_until_negative([1, 2, 3]) == 6\nprint(\"Many iterations (no break): ✓\")\n\n# Many iterations, break in middle\nassert sum_until_negative([1, 2, -1, 4]) == 3\nprint(\"Many iterations (break): ✓\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All loop scenarios", description: "Loop coverage" }]),
        hints: ["Empty = 0 iterations", "Test break condition too"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson6_1_4.id,
        number: 5,
        title: "Find Untested Branch",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "These tests miss a branch. Find and add the missing test.",
        starterCode: "def validate_password(pwd):\n    if len(pwd) < 8:\n        return \"too short\"\n    if len(pwd) > 20:\n        return \"too long\"\n    if not any(c.isdigit() for c in pwd):\n        return \"needs digit\"\n    return \"valid\"\n\n# Existing tests (incomplete!)\nassert validate_password(\"short\") == \"too short\"\nassert validate_password(\"abcdefghij\") == \"needs digit\"\nassert validate_password(\"password123\") == \"valid\"\n\n# Which branch is NOT tested? Add test!\n",
        solution: "def validate_password(pwd):\n    if len(pwd) < 8:\n        return \"too short\"\n    if len(pwd) > 20:\n        return \"too long\"\n    if not any(c.isdigit() for c in pwd):\n        return \"needs digit\"\n    return \"valid\"\n\n# Branch 1: too short\nassert validate_password(\"short\") == \"too short\"\nprint(\"too short: ✓\")\n\n# Branch 2: too long - MISSING!\nassert validate_password(\"a\" * 25) == \"too long\"\nprint(\"too long: ✓\")\n\n# Branch 3: needs digit\nassert validate_password(\"abcdefghij\") == \"needs digit\"\nprint(\"needs digit: ✓\")\n\n# Branch 4: valid\nassert validate_password(\"password123\") == \"valid\"\nprint(\"valid: ✓\")\n\nprint(\"\\nNow 100% branch coverage!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "too long branch tested", description: "Found missing" }]),
        hints: ["Count the branches", "Which return statement has no test?"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 6.1.4`);

  console.log("\n✅ Chapter 6 Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
