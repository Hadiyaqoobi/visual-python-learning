import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 3 Part 4: Lessons 3.4.1-3.4.2...\n");

  const section3_4 = await prisma.section.findFirst({ where: { number: 3.4 } });
  if (!section3_4) throw new Error("Section 3.4 not found.");

  // ==================== LESSON 3.4.1 ====================
  const lesson3_4_1 = await prisma.lesson.upsert({
    where: { slug: "floating-point-representation" },
    update: {},
    create: {
      sectionId: section3_4.id,
      number: 3.41,
      title: "Floating Point Representation",
      slug: "floating-point-representation",
      objectives: [
        "Understand how computers store decimal numbers",
        "Recognize floating point limitations",
        "See why some numbers can't be represented exactly",
        "Avoid common floating point pitfalls",
      ],
      content: `# Floating Point Representation

## The Surprise

Try this in Python:

\`\`\`python
print(0.1 + 0.2)  # 0.30000000000000004 (not 0.3!)
\`\`\`

Why? Computers store numbers in **binary**, and some decimals can't be represented exactly.

## Binary vs Decimal

**Decimal** (base 10): Uses digits 0-9
- 0.5 = 5/10 ✓ exact
- 0.1 = 1/10 ✓ exact

**Binary** (base 2): Uses digits 0-1
- 0.5 = 1/2 = 0.1₂ ✓ exact
- 0.1 = 1/10 = 0.0001100110011...₂ (repeating!) ✗

Just like 1/3 = 0.333... never ends in decimal, 1/10 never ends in binary!

## How Floats Are Stored

Python floats use 64 bits (IEEE 754 standard):
- 1 bit: sign (+/-)
- 11 bits: exponent
- 52 bits: fraction (mantissa)

This gives about **15-17 significant digits** of precision.

## Numbers That ARE Exact

Powers of 2 and their combinations:
\`\`\`python
0.5    # 1/2 - exact
0.25   # 1/4 - exact
0.125  # 1/8 - exact
0.75   # 1/2 + 1/4 - exact
\`\`\`

## Numbers That AREN'T Exact

Most decimal fractions:
\`\`\`python
0.1    # Not exact
0.2    # Not exact
0.3    # Not exact
\`\`\`

## Practical Impact

\`\`\`python
# Accumulating errors
total = 0.0
for i in range(10):
    total += 0.1
print(total)  # 0.9999999999999999 (not 1.0!)
\`\`\`

This matters for:
- Financial calculations
- Scientific computing
- Comparisons (never use == with floats)`,
      codeExamples: JSON.stringify([
        {
          id: "float-surprise",
          title: "Floating Point Surprises",
          code: "# The classic surprise\nprint(\"0.1 + 0.2 =\", 0.1 + 0.2)\nprint(\"Expected: 0.3\")\nprint(\"Equal?\", 0.1 + 0.2 == 0.3)  # False!\n\n# More surprises\nprint(\"\\n0.1 + 0.1 + 0.1 =\", 0.1 + 0.1 + 0.1)\nprint(\"0.3 =\", 0.3)\n\n# Accumulation error\ntotal = 0.0\nfor i in range(10):\n    total += 0.1\nprint(f\"\\n0.1 added 10 times = {total}\")\nprint(f\"Expected: 1.0\")",
          description: "Common floating point surprises",
        },
        {
          id: "exact-vs-inexact",
          title: "Exact vs Inexact Representations",
          code: "# Powers of 2 are exact\nprint(\"Exact (powers of 2):\")\nprint(f\"0.5 = {0.5}\")\nprint(f\"0.25 = {0.25}\")\nprint(f\"0.125 = {0.125}\")\nprint(f\"0.5 + 0.25 = {0.5 + 0.25}\")  # 0.75 exact\n\n# Most decimals are not exact\nprint(\"\\nInexact (decimal fractions):\")\nprint(f\"0.1 = {0.1:.20f}\")\nprint(f\"0.2 = {0.2:.20f}\")\nprint(f\"0.3 = {0.3:.20f}\")\n\n# The representation\nprint(f\"\\n0.1 stored as: {0.1:.55f}\")",
          description: "Which numbers are exact",
        },
        {
          id: "precision-limits",
          title: "Precision Limits",
          code: "# About 15-17 significant digits\nprint(\"Precision demonstration:\")\n\n# Adding small to large loses precision\nbig = 1e15  # 1,000,000,000,000,000\nsmall = 1.0\n\nprint(f\"big = {big}\")\nprint(f\"big + 1 = {big + small}\")\nprint(f\"big + 0.1 = {big + 0.1}\")  # 0.1 lost!\n\n# Very close numbers\na = 1.0000000000000001\nb = 1.0000000000000002\nprint(f\"\\na = {a}\")\nprint(f\"b = {b}\")\nprint(f\"a == b? {a == b}\")  # Might be True!",
          description: "Limits of float precision",
        },
        {
          id: "practical-issues",
          title: "Practical Issues",
          code: "# Money calculations - BAD with floats\nprice = 0.10\nquantity = 3\ntotal = price * quantity\nprint(f\"$0.10 x 3 = ${total}\")  # Not exactly 0.30!\n\n# Better: use integers (cents)\nprice_cents = 10\ntotal_cents = price_cents * 3\nprint(f\"10 cents x 3 = {total_cents} cents = ${total_cents/100}\")\n\n# Or use Decimal module for financial\nfrom decimal import Decimal\nprice = Decimal('0.10')\ntotal = price * 3\nprint(f\"Using Decimal: ${total}\")  # Exact!",
          description: "Real-world floating point issues",
        },
      ]),
      keyPoints: [
        "Computers store numbers in binary, not decimal",
        "Many decimal fractions can't be represented exactly",
        "0.1 + 0.2 != 0.3 due to representation errors",
        "Powers of 2 (0.5, 0.25, 0.125) ARE exact",
        "Floats have ~15-17 significant digits",
        "Errors accumulate with repeated operations",
        "Never use == to compare floats",
        "Use Decimal module for financial calculations",
      ],
      hardwareDemo: "See binary representation of floats. Watch how 0.1 becomes repeating binary.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson3_4_1.number}: ${lesson3_4_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson3_4_1.id,
        number: 1,
        title: "Float Surprise",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Calculate 0.1 + 0.2 and print whether it equals 0.3. Explain why.",
        starterCode: "# Calculate and compare\nresult = 0.1 + 0.2\n\nprint(f\"0.1 + 0.2 = {result}\")\nprint(f\"Equal to 0.3? {result == 0.3}\")",
        solution: "result = 0.1 + 0.2\n\nprint(f\"0.1 + 0.2 = {result}\")\nprint(f\"Equal to 0.3? {result == 0.3}\")\nprint(\"\\nWhy? 0.1 and 0.2 can't be represented exactly in binary!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Equal to 0.3? False", description: "Shows inequality" }]),
        hints: ["Just run the code and observe", "The result won't be exactly 0.3"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson3_4_1.id,
        number: 2,
        title: "Accumulation Error",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add 0.1 to itself 10 times using a loop. Print the result and compare to 1.0.",
        starterCode: "# Add 0.1 ten times\ntotal = 0.0\n\nfor i in range(10):\n    total += 0.1\n\nprint(f\"Result: {total}\")\nprint(f\"Equal to 1.0? {total == 1.0}\")",
        solution: "total = 0.0\n\nfor i in range(10):\n    total += 0.1\n\nprint(f\"Result: {total}\")\nprint(f\"Equal to 1.0? {total == 1.0}\")\nprint(f\"Difference: {abs(total - 1.0)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Not exactly 1.0", description: "Shows accumulation error" }]),
        hints: ["Use a for loop with range(10)", "The result will be close but not equal to 1.0"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson3_4_1.id,
        number: 3,
        title: "Exact vs Inexact",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show that 0.5 + 0.25 is exactly 0.75, but 0.1 + 0.2 is not exactly 0.3.",
        starterCode: "# Compare exact and inexact\n",
        solution: "# Powers of 2 are exact\nresult1 = 0.5 + 0.25\nprint(f\"0.5 + 0.25 = {result1}\")\nprint(f\"Exactly 0.75? {result1 == 0.75}\")  # True!\n\n# Decimal fractions are not\nresult2 = 0.1 + 0.2\nprint(f\"\\n0.1 + 0.2 = {result2}\")\nprint(f\"Exactly 0.3? {result2 == 0.3}\")  # False!",
        testCases: JSON.stringify([{ input: "", expectedOutput: "0.75 True, 0.3 False", description: "Shows difference" }]),
        hints: ["0.5 and 0.25 are powers of 2 (exact)", "0.1 and 0.2 are not (inexact)"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson3_4_1.id,
        number: 4,
        title: "See the Real Value",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Print 0.1 with 25 decimal places to see its actual stored value.",
        starterCode: "# Print 0.1 with many decimal places\n",
        solution: "print(\"0.1 stored as:\")\nprint(f\"{0.1:.25f}\")\n\nprint(\"\\n0.2 stored as:\")\nprint(f\"{0.2:.25f}\")\n\nprint(\"\\n0.1 + 0.2 stored as:\")\nprint(f\"{0.1 + 0.2:.25f}\")\n\nprint(\"\\n0.3 stored as:\")\nprint(f\"{0.3:.25f}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Shows extended decimals", description: "Reveals true values" }]),
        hints: ["Use :.25f format specifier", "Compare 0.1+0.2 to 0.3"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson3_4_1.id,
        number: 5,
        title: "Money Calculation",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Calculate the total for 7 items at $0.10 each. Show the float problem and fix it using integer cents.",
        starterCode: "# Problem with floats for money\n",
        solution: "# Float method (problematic)\nprice = 0.10\nquantity = 7\nfloat_total = price * quantity\nprint(f\"Float: $0.10 x 7 = ${float_total}\")\n\n# Integer cents method (correct)\nprice_cents = 10\ntotal_cents = price_cents * quantity\nprint(f\"Cents: 10 x 7 = {total_cents} cents = ${total_cents / 100}\")\n\n# Using Decimal (best)\nfrom decimal import Decimal\nprice_dec = Decimal('0.10')\ntotal_dec = price_dec * quantity\nprint(f\"Decimal: $0.10 x 7 = ${total_dec}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Shows float vs correct", description: "Money calculation" }]),
        hints: ["Float will show imprecision", "Cents as integers avoid the problem", "Decimal module is best for money"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 3.4.1`);

  // ==================== LESSON 3.4.2 ====================
  const lesson3_4_2 = await prisma.lesson.upsert({
    where: { slug: "comparing-floats" },
    update: {},
    create: {
      sectionId: section3_4.id,
      number: 3.42,
      title: "Comparing Floating Point Numbers",
      slug: "comparing-floats",
      objectives: [
        "Understand why == fails with floats",
        "Use epsilon-based comparison correctly",
        "Implement proper float comparison functions",
        "Know when floats are safe to compare directly",
      ],
      content: `# Comparing Floating Point Numbers

## The Problem with ==

Never use \`==\` to compare floats:

\`\`\`python
0.1 + 0.2 == 0.3  # False!
\`\`\`

Due to representation errors, mathematically equal values may not be bitwise equal.

## The Solution: Epsilon Comparison

Instead of checking equality, check if values are "close enough":

\`\`\`python
def almost_equal(a, b, epsilon=1e-9):
    return abs(a - b) < epsilon

almost_equal(0.1 + 0.2, 0.3)  # True!
\`\`\`

## Choosing Epsilon

The right epsilon depends on your needs:

| Epsilon | Use Case |
|---------|----------|
| 1e-3 | Rough comparison |
| 1e-6 | General purpose |
| 1e-9 | High precision |
| 1e-15 | Near machine precision |

## Relative vs Absolute Comparison

**Absolute**: Good for small numbers
\`\`\`python
abs(a - b) < epsilon
\`\`\`

**Relative**: Better for varying magnitudes
\`\`\`python
abs(a - b) / max(abs(a), abs(b)) < epsilon
\`\`\`

## Python's math.isclose()

Python 3.5+ provides a built-in solution:

\`\`\`python
import math
math.isclose(0.1 + 0.2, 0.3)  # True!
\`\`\`

It handles both absolute and relative tolerance.

## When == IS Safe

- Comparing to exact values like 0.0, 0.5, 0.25
- After assignment (a = b; a == b is True)
- With integers stored in floats (1.0 == 1.0)`,
      codeExamples: JSON.stringify([
        {
          id: "why-equal-fails",
          title: "Why == Fails",
          code: "# Direct comparison fails\na = 0.1 + 0.2\nb = 0.3\n\nprint(f\"a = {a}\")\nprint(f\"b = {b}\")\nprint(f\"a == b? {a == b}\")  # False!\n\n# The actual difference\ndiff = abs(a - b)\nprint(f\"\\nDifference: {diff}\")\nprint(f\"Very small, but not zero!\")\n\n# More examples\nprint(f\"\\n0.1 * 3 == 0.3? {0.1 * 3 == 0.3}\")  # False\nprint(f\"1.1 + 2.2 == 3.3? {1.1 + 2.2 == 3.3}\")  # False",
          description: "Why direct comparison fails",
        },
        {
          id: "epsilon-comparison",
          title: "Epsilon-Based Comparison",
          code: "def almost_equal(a, b, epsilon=1e-9):\n    \"\"\"Check if two floats are approximately equal.\"\"\"\n    return abs(a - b) < epsilon\n\n# Now it works!\na = 0.1 + 0.2\nb = 0.3\n\nprint(f\"a == b? {a == b}\")  # False\nprint(f\"almost_equal(a, b)? {almost_equal(a, b)}\")  # True!\n\n# More tests\nprint(f\"\\nalmost_equal(0.1 * 3, 0.3)? {almost_equal(0.1 * 3, 0.3)}\")\nprint(f\"almost_equal(1.1 + 2.2, 3.3)? {almost_equal(1.1 + 2.2, 3.3)}\")\n\n# With custom epsilon\nprint(f\"\\nalmost_equal(1.0, 1.001, 0.01)? {almost_equal(1.0, 1.001, 0.01)}\")\nprint(f\"almost_equal(1.0, 1.001, 0.0001)? {almost_equal(1.0, 1.001, 0.0001)}\")",
          description: "Using epsilon for comparison",
        },
        {
          id: "math-isclose",
          title: "Using math.isclose()",
          code: "import math\n\n# Python's built-in solution\na = 0.1 + 0.2\nb = 0.3\n\nprint(f\"math.isclose(a, b)? {math.isclose(a, b)}\")  # True!\n\n# It has both absolute and relative tolerance\nprint(f\"\\nmath.isclose(1000.0, 1000.001)? {math.isclose(1000.0, 1000.001)}\")\nprint(f\"math.isclose(0.001, 0.002)? {math.isclose(0.001, 0.002)}\")\n\n# Custom tolerances\nprint(f\"\\nWith rel_tol=0.1 (10%):\")\nprint(f\"math.isclose(10, 11, rel_tol=0.1)? {math.isclose(10, 11, rel_tol=0.1)}\")\n\nprint(f\"\\nWith abs_tol=0.5:\")\nprint(f\"math.isclose(0, 0.4, abs_tol=0.5)? {math.isclose(0, 0.4, abs_tol=0.5)}\")",
          description: "Python's built-in isclose()",
        },
        {
          id: "safe-comparisons",
          title: "When == Is Safe",
          code: "# Safe: Comparing to exact values\nprint(\"Safe comparisons:\")\nprint(f\"0.5 == 0.5? {0.5 == 0.5}\")  # True - exact\nprint(f\"0.25 == 0.25? {0.25 == 0.25}\")  # True - exact\n\n# Safe: After direct assignment\na = 3.14159\nb = a\nprint(f\"a == b after b = a? {a == b}\")  # True\n\n# Safe: Integers as floats\nprint(f\"5.0 == 5.0? {5.0 == 5.0}\")  # True\n\n# UNSAFE: After calculation\nprint(f\"\\nUnsafe comparisons:\")\nprint(f\"0.1 + 0.2 == 0.3? {0.1 + 0.2 == 0.3}\")  # False!\nprint(f\"0.1 * 10 == 1.0? {0.1 * 10 == 1.0}\")  # False!",
          description: "When direct comparison works",
        },
      ]),
      keyPoints: [
        "Never use == to compare calculated floats",
        "Use abs(a - b) < epsilon instead",
        "math.isclose() is the best built-in option",
        "Epsilon should match your precision needs",
        "Relative tolerance better for varying magnitudes",
        "== IS safe for exact values (0.5, 0.25) and after assignment",
        "Always use epsilon in loops with float conditions",
      ],
      hardwareDemo: "See actual bit patterns of 'equal' floats. Watch comparison fail then succeed with epsilon.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson3_4_2.number}: ${lesson3_4_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson3_4_2.id,
        number: 1,
        title: "Show the Problem",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Demonstrate that 0.1 * 10 does not equal 1.0 using ==.",
        starterCode: "# Show that 0.1 * 10 != 1.0\n",
        solution: "result = 0.1 * 10\nprint(f\"0.1 * 10 = {result}\")\nprint(f\"Equal to 1.0? {result == 1.0}\")\nprint(f\"Difference: {abs(result - 1.0)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Equal to 1.0? False", description: "Shows inequality" }]),
        hints: ["Multiply 0.1 by 10", "Compare with ==", "It will be False!"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson3_4_2.id,
        number: 2,
        title: "Write almost_equal",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function almost_equal(a, b, epsilon) that returns True if a and b are within epsilon of each other.",
        starterCode: "def almost_equal(a, b, epsilon=1e-9):\n    # Return True if a and b are close enough\n    pass\n\n# Test\nprint(almost_equal(0.1 + 0.2, 0.3))  # Should be True\nprint(almost_equal(1.0, 2.0))        # Should be False",
        solution: "def almost_equal(a, b, epsilon=1e-9):\n    return abs(a - b) < epsilon\n\nprint(almost_equal(0.1 + 0.2, 0.3))  # True\nprint(almost_equal(1.0, 2.0))        # False\nprint(almost_equal(1.0, 1.0000000001))  # True",
        testCases: JSON.stringify([{ input: "", expectedOutput: "True\\nFalse", description: "Function works" }]),
        hints: ["Calculate abs(a - b)", "Compare to epsilon", "Return the boolean result"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson3_4_2.id,
        number: 3,
        title: "Use math.isclose",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use math.isclose() to compare 1.1 + 2.2 with 3.3, and compare 0.1 * 3 with 0.3.",
        starterCode: "import math\n\n# Use math.isclose() for comparisons\n",
        solution: "import math\n\nresult1 = 1.1 + 2.2\nprint(f\"1.1 + 2.2 = {result1}\")\nprint(f\"Close to 3.3? {math.isclose(result1, 3.3)}\")\n\nresult2 = 0.1 * 3\nprint(f\"\\n0.1 * 3 = {result2}\")\nprint(f\"Close to 0.3? {math.isclose(result2, 0.3)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Close to 3.3? True", description: "isclose works" }]),
        hints: ["Import math first", "Call math.isclose(a, b)", "It returns True or False"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson3_4_2.id,
        number: 4,
        title: "Fix the Loop",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "This loop should stop when x reaches 1.0, but it doesn't. Fix it using epsilon comparison.",
        starterCode: "# This loop never stops! (Don't run as-is)\n# x = 0.0\n# while x != 1.0:\n#     x += 0.1\n#     print(x)\n\n# Fix it:\nx = 0.0\nepsilon = 1e-9\n# Your fixed loop here\n",
        solution: "x = 0.0\nepsilon = 1e-9\n\nwhile abs(x - 1.0) >= epsilon:\n    x += 0.1\n    print(f\"x = {x:.10f}\")\n\nprint(f\"\\nLoop ended! x = {x}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Loop ends at ~1.0", description: "Loop terminates" }]),
        hints: ["Don't use x != 1.0", "Use abs(x - 1.0) >= epsilon instead", "Loop will now terminate properly"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson3_4_2.id,
        number: 5,
        title: "Relative Comparison",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write a function relatively_close(a, b, rel_tol) that checks if a and b are within rel_tol percent of each other.",
        starterCode: "def relatively_close(a, b, rel_tol=0.01):\n    # Check if difference is within rel_tol of the larger value\n    pass\n\n# Test: 100 and 101 within 2%?\nprint(relatively_close(100, 101, 0.02))  # True\nprint(relatively_close(100, 101, 0.005)) # False",
        solution: "def relatively_close(a, b, rel_tol=0.01):\n    if a == 0 and b == 0:\n        return True\n    return abs(a - b) / max(abs(a), abs(b)) < rel_tol\n\nprint(relatively_close(100, 101, 0.02))   # True (1% diff < 2%)\nprint(relatively_close(100, 101, 0.005))  # False (1% diff > 0.5%)\nprint(relatively_close(1000, 1001, 0.01)) # True",
        testCases: JSON.stringify([{ input: "", expectedOutput: "True\\nFalse", description: "Relative comparison" }]),
        hints: ["Calculate relative difference", "Divide by the larger magnitude", "Compare to rel_tol"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 3.4.2`);

  console.log("\n✅ Chapter 3 Part 4 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
