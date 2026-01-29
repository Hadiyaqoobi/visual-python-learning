import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 4 Part 4: Lessons 4.4.1-4.5.1...\n");

  const section4_4 = await prisma.section.findFirst({ where: { number: 4.4 } });
  const section4_5 = await prisma.section.findFirst({ where: { number: 4.5 } });
  if (!section4_4 || !section4_5) throw new Error("Sections not found.");

  // ==================== LESSON 4.4.1 ====================
  const lesson4_4_1 = await prisma.lesson.upsert({
    where: { slug: "docstrings-specifications" },
    update: {},
    create: {
      sectionId: section4_4.id,
      number: 4.41,
      title: "Docstrings and Specifications",
      slug: "docstrings-specifications",
      objectives: [
        "Write docstrings to document functions",
        "Specify function inputs, outputs, and behavior",
        "Access docstrings with help() and __doc__",
        "Follow documentation conventions",
      ],
      content: `# Docstrings and Specifications

## Why Document Functions?

Functions need documentation for:
- Other programmers (including future you!)
- Understanding what function does without reading code
- Knowing how to use the function correctly
- Automatic documentation generation

## Docstrings

A **docstring** is a string literal right after the function definition:

\`\`\`python
def square(n):
    """Return the square of n."""
    return n ** 2
\`\`\`

Triple quotes allow multi-line docstrings.

## What to Document

A good specification includes:
1. **Summary**: What the function does (one line)
2. **Parameters**: Name, type, and description
3. **Returns**: Type and description
4. **Examples** (optional): How to use it

## Docstring Formats

**Simple (one-liner):**
\`\`\`python
def double(n):
    """Return n multiplied by 2."""
    return n * 2
\`\`\`

**Google style:**
\`\`\`python
def divide(a, b):
    """Divide a by b.
    
    Args:
        a: The dividend (number).
        b: The divisor (non-zero number).
    
    Returns:
        The quotient a/b.
    
    Raises:
        ValueError: If b is zero.
    """
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b
\`\`\`

## Accessing Docstrings

\`\`\`python
help(square)        # Shows docstring
print(square.__doc__)  # Direct access
\`\`\`

## Specification as Contract

Think of the docstring as a **contract**:
- User promises to provide valid inputs
- Function promises to return correct output

This is the foundation of reliable software!`,
      codeExamples: JSON.stringify([
        {
          id: "simple-docstring",
          title: "Simple Docstrings",
          code: "def square(n):\n    \"\"\"Return the square of n.\"\"\"\n    return n ** 2\n\ndef greet(name):\n    \"\"\"Print a greeting to name.\"\"\"\n    print(f\"Hello, {name}!\")\n\ndef is_even(n):\n    \"\"\"Return True if n is even, False otherwise.\"\"\"\n    return n % 2 == 0\n\n# Access docstrings\nprint(\"square docstring:\")\nprint(square.__doc__)\nprint()\nprint(\"is_even docstring:\")\nhelp(is_even)",
          description: "One-line docstrings",
        },
        {
          id: "detailed-docstring",
          title: "Detailed Docstrings",
          code: "def calculate_tip(bill_amount, tip_percent=18):\n    \"\"\"Calculate tip amount for a bill.\n    \n    Args:\n        bill_amount: The total bill in dollars.\n        tip_percent: Tip percentage (default 18).\n    \n    Returns:\n        The tip amount in dollars.\n    \n    Example:\n        >>> calculate_tip(100, 20)\n        20.0\n    \"\"\"\n    return bill_amount * (tip_percent / 100)\n\n# Use the function\nprint(f\"Tip on $50 at 18%: ${calculate_tip(50)}\")\nprint(f\"Tip on $100 at 20%: ${calculate_tip(100, 20)}\")\n\nprint(\"\\nDocumentation:\")\nhelp(calculate_tip)",
          description: "Multi-line docstrings with details",
        },
        {
          id: "specification-contract",
          title: "Specification as Contract",
          code: "def find_max(numbers):\n    \"\"\"Find the maximum value in a list.\n    \n    Args:\n        numbers: A non-empty list of comparable items.\n    \n    Returns:\n        The largest item in the list.\n    \n    Raises:\n        ValueError: If numbers is empty.\n    \n    Note:\n        Does not modify the input list.\n    \"\"\"\n    if not numbers:\n        raise ValueError(\"Cannot find max of empty list\")\n    \n    max_val = numbers[0]\n    for num in numbers[1:]:\n        if num > max_val:\n            max_val = num\n    return max_val\n\nprint(find_max([3, 1, 4, 1, 5, 9]))  # 9\nprint(find_max([-5, -2, -10]))       # -2",
          description: "Documenting preconditions and behavior",
        },
        {
          id: "accessing-docs",
          title: "Accessing Documentation",
          code: "def celsius_to_fahrenheit(celsius):\n    \"\"\"Convert Celsius to Fahrenheit.\n    \n    Args:\n        celsius: Temperature in Celsius.\n    \n    Returns:\n        Temperature in Fahrenheit.\n    \n    Formula: F = C * 9/5 + 32\n    \"\"\"\n    return celsius * 9/5 + 32\n\n# Different ways to access docstring\nprint(\"Method 1: __doc__ attribute\")\nprint(celsius_to_fahrenheit.__doc__)\n\nprint(\"\\nMethod 2: help() function\")\nhelp(celsius_to_fahrenheit)\n\n# Even built-in functions have docstrings\nprint(\"\\nBuilt-in len() docstring:\")\nprint(len.__doc__)",
          description: "Ways to access documentation",
        },
      ]),
      keyPoints: [
        "Docstrings document functions",
        "Use triple quotes for docstrings",
        "Place immediately after def line",
        "Include: summary, args, returns",
        "Access with help() or __doc__",
        "Docstring is a contract with users",
        "Document preconditions and edge cases",
        "Good docs make code maintainable",
      ],
      hardwareDemo: "See docstring stored with function object. Watch help() retrieve and format it.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson4_4_1.number}: ${lesson4_4_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_4_1.id,
        number: 1,
        title: "Add Docstring",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add a one-line docstring to this function.",
        starterCode: "def cube(n):\n    # Add docstring here\n    return n ** 3\n\nprint(cube(3))\nprint(cube.__doc__)",
        solution: "def cube(n):\n    \"\"\"Return the cube of n.\"\"\"\n    return n ** 3\n\nprint(cube(3))\nprint(cube.__doc__)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "27\\nReturn the cube of n.", description: "Docstring present" }]),
        hints: ["Triple quotes after def line", "Describe what function returns"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson4_4_1.id,
        number: 2,
        title: "Document Parameters",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a detailed docstring for this function including Args and Returns.",
        starterCode: "def rectangle_area(width, height):\n    # Add detailed docstring\n    return width * height\n\nhelp(rectangle_area)",
        solution: "def rectangle_area(width, height):\n    \"\"\"Calculate the area of a rectangle.\n    \n    Args:\n        width: The width of the rectangle.\n        height: The height of the rectangle.\n    \n    Returns:\n        The area (width * height).\n    \"\"\"\n    return width * height\n\nhelp(rectangle_area)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Shows formatted docstring", description: "Detailed docs" }]),
        hints: ["Use Args: section for parameters", "Use Returns: section for return value"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson4_4_1.id,
        number: 3,
        title: "Document with Example",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a docstring for is_positive(n) that includes an example.",
        starterCode: "def is_positive(n):\n    # Add docstring with example\n    return n > 0\n\nprint(is_positive(5))\nprint(is_positive(-3))",
        solution: "def is_positive(n):\n    \"\"\"Check if a number is positive.\n    \n    Args:\n        n: A number to check.\n    \n    Returns:\n        True if n > 0, False otherwise.\n    \n    Example:\n        >>> is_positive(5)\n        True\n        >>> is_positive(-3)\n        False\n    \"\"\"\n    return n > 0\n\nprint(is_positive(5))\nprint(is_positive(-3))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "True\\nFalse", description: "With example" }]),
        hints: ["Add Example: section", "Show input and expected output"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson4_4_1.id,
        number: 4,
        title: "Full Specification",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write a complete docstring for safe_divide including error handling.",
        starterCode: "def safe_divide(a, b):\n    # Full docstring: summary, args, returns, raises\n    if b == 0:\n        raise ValueError(\"Cannot divide by zero\")\n    return a / b\n\nprint(safe_divide(10, 2))",
        solution: "def safe_divide(a, b):\n    \"\"\"Safely divide a by b.\n    \n    Args:\n        a: The dividend (numerator).\n        b: The divisor (denominator).\n    \n    Returns:\n        The result of a / b.\n    \n    Raises:\n        ValueError: If b is zero.\n    \"\"\"\n    if b == 0:\n        raise ValueError(\"Cannot divide by zero\")\n    return a / b\n\nprint(safe_divide(10, 2))\nhelp(safe_divide)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "5.0 and docstring", description: "Complete spec" }]),
        hints: ["Add Raises: section for exceptions", "Document what causes the error"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson4_4_1.id,
        number: 5,
        title: "Read Built-in Docs",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Print the docstrings for len, sum, and max built-in functions.",
        starterCode: "# Print docstrings for len, sum, max\n",
        solution: "print(\"len:\")\nprint(len.__doc__)\nprint(\"\\nsum:\")\nprint(sum.__doc__)\nprint(\"\\nmax:\")\nprint(max.__doc__)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Built-in docstrings", description: "Shows docs" }]),
        hints: ["Use function.__doc__", "All built-ins have docstrings"],
        xpReward: 10,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 4.4.1`);

  // ==================== LESSON 4.5.1 ====================
  const lesson4_5_1 = await prisma.lesson.upsert({
    where: { slug: "recursion-basics" },
    update: {},
    create: {
      sectionId: section4_5.id,
      number: 4.51,
      title: "Introduction to Recursion",
      slug: "recursion-basics",
      objectives: [
        "Understand recursion - functions calling themselves",
        "Identify base cases and recursive cases",
        "Trace recursive function execution",
        "Implement simple recursive functions",
      ],
      content: `# Introduction to Recursion

## What Is Recursion?

**Recursion** is when a function calls itself.

\`\`\`python
def countdown(n):
    if n <= 0:
        print("Blastoff!")
    else:
        print(n)
        countdown(n - 1)  # Function calls itself!
\`\`\`

## Two Essential Parts

Every recursive function needs:

1. **Base case**: When to STOP (no recursion)
2. **Recursive case**: When to continue (calls itself with simpler input)

\`\`\`python
def factorial(n):
    if n == 0:           # Base case
        return 1
    else:                # Recursive case
        return n * factorial(n - 1)
\`\`\`

## How Recursion Works

Each call creates a new stack frame:

\`\`\`
factorial(4)
  → 4 * factorial(3)
       → 3 * factorial(2)
            → 2 * factorial(1)
                 → 1 * factorial(0)
                      → returns 1
                 → returns 1 * 1 = 1
            → returns 2 * 1 = 2
       → returns 3 * 2 = 6
  → returns 4 * 6 = 24
\`\`\`

## The Classic Example: Factorial

n! = n × (n-1) × (n-2) × ... × 1
- 5! = 5 × 4 × 3 × 2 × 1 = 120
- 0! = 1 (by definition)

Recursive definition:
- 0! = 1 (base case)
- n! = n × (n-1)! (recursive case)

## Without Base Case = Infinite Loop!

\`\`\`python
def bad_recursion(n):
    return bad_recursion(n - 1)  # No base case!
    # RecursionError: maximum recursion depth exceeded
\`\`\`

## When to Use Recursion

Good for:
- Problems with recursive structure (trees, nested data)
- Mathematical definitions (factorial, fibonacci)
- Divide-and-conquer algorithms

Often iterative solutions (loops) are more efficient in Python.`,
      codeExamples: JSON.stringify([
        {
          id: "countdown-recursion",
          title: "Countdown with Recursion",
          code: "def countdown(n):\n    \"\"\"Count down from n to 0, then print Blastoff!\"\"\"\n    if n <= 0:           # Base case\n        print(\"Blastoff!\")\n    else:                # Recursive case\n        print(n)\n        countdown(n - 1)  # Call with smaller number\n\nprint(\"Counting down from 5:\")\ncountdown(5)",
          description: "Simple recursive countdown",
        },
        {
          id: "factorial",
          title: "Factorial Function",
          code: "def factorial(n):\n    \"\"\"Return n! (n factorial).\n    \n    Base case: 0! = 1\n    Recursive: n! = n * (n-1)!\n    \"\"\"\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n - 1)\n\n# Test it\nfor i in range(6):\n    print(f\"{i}! = {factorial(i)}\")\n\n# Trace factorial(4)\nprint(\"\\nTrace of factorial(4):\")\nprint(\"factorial(4) = 4 * factorial(3)\")\nprint(\"            = 4 * 3 * factorial(2)\")\nprint(\"            = 4 * 3 * 2 * factorial(1)\")\nprint(\"            = 4 * 3 * 2 * 1 * factorial(0)\")\nprint(\"            = 4 * 3 * 2 * 1 * 1 = 24\")",
          description: "Classic recursive factorial",
        },
        {
          id: "sum-recursion",
          title: "Sum with Recursion",
          code: "def sum_to(n):\n    \"\"\"Return sum of 1 + 2 + ... + n.\"\"\"\n    if n == 0:           # Base case\n        return 0\n    else:                # Recursive case\n        return n + sum_to(n - 1)\n\ndef sum_list(lst):\n    \"\"\"Return sum of all elements in list.\"\"\"\n    if len(lst) == 0:    # Base case: empty list\n        return 0\n    else:                # Recursive case\n        return lst[0] + sum_list(lst[1:])\n\nprint(f\"sum_to(5) = {sum_to(5)}\")  # 15\nprint(f\"sum_to(10) = {sum_to(10)}\")  # 55\n\nprint(f\"\\nsum_list([1,2,3,4]) = {sum_list([1,2,3,4])}\")  # 10",
          description: "Summing with recursion",
        },
        {
          id: "trace-recursion",
          title: "Tracing Recursion",
          code: "def factorial_traced(n, depth=0):\n    \"\"\"Factorial with trace output.\"\"\"\n    indent = \"  \" * depth\n    print(f\"{indent}factorial({n}) called\")\n    \n    if n == 0:\n        print(f\"{indent}Base case: returning 1\")\n        return 1\n    else:\n        result = n * factorial_traced(n - 1, depth + 1)\n        print(f\"{indent}Returning {n} * ... = {result}\")\n        return result\n\nprint(\"Tracing factorial(4):\")\nresult = factorial_traced(4)\nprint(f\"\\nFinal result: {result}\")",
          description: "Visualizing recursive calls",
        },
      ]),
      keyPoints: [
        "Recursion: function calls itself",
        "Must have BASE CASE (when to stop)",
        "Must have RECURSIVE CASE (simpler subproblem)",
        "Each call creates new stack frame",
        "Without base case → infinite recursion",
        "Recursive case must progress toward base case",
        "Good for naturally recursive problems",
        "Can be less efficient than iteration in Python",
      ],
      hardwareDemo: "Watch stack frames pile up during recursion. See them pop off as calls return.",
      estimatedTime: 35,
      difficulty: "ADVANCED",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson4_5_1.number}: ${lesson4_5_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_5_1.id,
        number: 1,
        title: "Recursive Countdown",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a recursive function countdown(n) that prints n down to 1, then 'Done!'",
        starterCode: "def countdown(n):\n    # Base case: n <= 0\n    # Recursive case: print n, call countdown(n-1)\n    pass\n\ncountdown(5)",
        solution: "def countdown(n):\n    if n <= 0:\n        print(\"Done!\")\n    else:\n        print(n)\n        countdown(n - 1)\n\ncountdown(5)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "5\\n4\\n3\\n2\\n1\\nDone!", description: "Counts down" }]),
        hints: ["Base case: when n <= 0, print Done!", "Recursive case: print n, call countdown(n-1)"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson4_5_1.id,
        number: 2,
        title: "Factorial",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write recursive factorial(n). Remember: 0! = 1, n! = n * (n-1)!",
        starterCode: "def factorial(n):\n    # Base case: n == 0 returns 1\n    # Recursive: n * factorial(n-1)\n    pass\n\nprint(factorial(5))  # Should be 120",
        solution: "def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n - 1)\n\nprint(factorial(5))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "120", description: "5! = 120" }]),
        hints: ["Base case: if n == 0, return 1", "Recursive: return n * factorial(n-1)"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson4_5_1.id,
        number: 3,
        title: "Sum to N",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write recursive sum_to(n) that returns 1 + 2 + ... + n.",
        starterCode: "def sum_to(n):\n    # Base case: n == 0 returns 0\n    # Recursive: n + sum_to(n-1)\n    pass\n\nprint(sum_to(10))  # Should be 55",
        solution: "def sum_to(n):\n    if n == 0:\n        return 0\n    else:\n        return n + sum_to(n - 1)\n\nprint(sum_to(10))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "55", description: "1+2+...+10 = 55" }]),
        hints: ["Base: sum_to(0) = 0", "Recursive: n + sum_to(n-1)"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson4_5_1.id,
        number: 4,
        title: "Power Function",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write recursive power(base, exp) to calculate base^exp. Use: base^0 = 1, base^n = base * base^(n-1)",
        starterCode: "def power(base, exp):\n    # Base case: exp == 0 returns 1\n    # Recursive: base * power(base, exp-1)\n    pass\n\nprint(power(2, 10))  # Should be 1024",
        solution: "def power(base, exp):\n    if exp == 0:\n        return 1\n    else:\n        return base * power(base, exp - 1)\n\nprint(power(2, 10))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "1024", description: "2^10 = 1024" }]),
        hints: ["Base case: any number to power 0 is 1", "Recursive: multiply base by power(base, exp-1)"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson4_5_1.id,
        number: 5,
        title: "Trace the Recursion",
        type: "MULTIPLE_CHOICE",
        difficulty: "ADVANCED",
        prompt: "How many times is factorial() called when computing factorial(4)?",
        starterCode: "",
        solution: "5 times: factorial(4), factorial(3), factorial(2), factorial(1), factorial(0)",
        testCases: JSON.stringify([
          { input: "4", expectedOutput: "false", description: "Misses base case call" },
          { input: "5", expectedOutput: "true", description: "Correct!" },
          { input: "6", expectedOutput: "false", description: "Too many" },
        ]),
        hints: ["Count: factorial(4) calls factorial(3) calls...", "Don't forget factorial(0) - the base case"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 4.5.1`);

  console.log("\n✅ Chapter 4 Part 4 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
