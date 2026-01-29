import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 3 Part 3: Lessons 3.3.1-3.3.2...\n");

  const section3_3 = await prisma.section.findFirst({ where: { number: 3.3 } });
  if (!section3_3) throw new Error("Section 3.3 not found.");

  // ==================== LESSON 3.3.1 ====================
  const lesson3_3_1 = await prisma.lesson.upsert({
    where: { slug: "approximate-solutions-epsilon" },
    update: {},
    create: {
      sectionId: section3_3.id,
      number: 3.31,
      title: "Approximate Solutions and Epsilon",
      slug: "approximate-solutions-epsilon",
      objectives: [
        "Understand why exact solutions don't always exist",
        "Use epsilon for acceptable error tolerance",
        "Implement approximate solution finding",
        "Choose appropriate epsilon values",
      ],
      content: `# Approximate Solutions and Epsilon

## Why Approximate?

Many problems don't have exact answers:
- Square root of 2 is irrational (1.41421356...)
- Pi is transcendental (3.14159265...)
- Some equations have no closed-form solution

Even when exact answers exist, floating-point has limited precision.

## Epsilon (ε): The Tolerance

**Epsilon** is the acceptable error - how close is "close enough."

\`\`\`python
epsilon = 0.01  # Accept answers within 0.01 of exact
\`\`\`

Instead of checking:
\`\`\`python
if guess == answer:  # Rarely works with floats!
\`\`\`

Check:
\`\`\`python
if abs(guess - answer) < epsilon:  # Close enough!
\`\`\`

## Finding Square Root Approximately

**Problem**: Find x where x² ≈ 25

**Approach**: Try values, check if x² is close to 25

\`\`\`python
target = 25
epsilon = 0.01
guess = 0.0
step = 0.001

while abs(guess**2 - target) >= epsilon:
    guess += step

print(f"Square root ≈ {guess}")
\`\`\`

## Choosing Epsilon

| Epsilon | Meaning | Use Case |
|---------|---------|----------|
| 0.1 | Within 0.1 | Quick estimate |
| 0.01 | Within 0.01 | General use |
| 0.0001 | Within 0.0001 | High precision |
| 1e-10 | Very precise | Scientific |

**Tradeoff**: Smaller epsilon = more accurate but slower

## The Problem with Small Steps

Exhaustive search with small steps is SLOW:
- Finding √25 with step=0.0001 takes ~50,000 iterations!
- Finding √2 is even worse

**Solution**: Bisection search (next lesson) - much faster!`,
      codeExamples: JSON.stringify([
        {
          id: "epsilon-concept",
          title: "Understanding Epsilon",
          code: "# Why we need epsilon\ntarget = 2\n\n# Exact check fails with floats\nguess = 1.41421356\nprint(f\"guess^2 = {guess**2}\")\nprint(f\"guess^2 == 2? {guess**2 == 2}\")  # False!\n\n# Epsilon check works\nepsilon = 0.0001\ndifference = abs(guess**2 - target)\nprint(f\"\\nDifference: {difference}\")\nprint(f\"Within epsilon? {difference < epsilon}\")  # True!\n\n# The abs() function\nprint(f\"\\nabs(-5) = {abs(-5)}\")\nprint(f\"abs(5) = {abs(5)}\")\nprint(f\"abs(3-7) = {abs(3-7)}\")",
          description: "Why epsilon is needed",
        },
        {
          id: "exhaustive-sqrt",
          title: "Finding Square Root (Exhaustive)",
          code: "# Find square root of 25 using exhaustive enumeration\ntarget = 25\nepsilon = 0.01\nstep = 0.01\nguess = 0.0\nnum_guesses = 0\n\nwhile abs(guess**2 - target) >= epsilon:\n    guess += step\n    num_guesses += 1\n\nprint(f\"Square root of {target} is approximately {guess:.4f}\")\nprint(f\"Verification: {guess:.4f}^2 = {guess**2:.4f}\")\nprint(f\"Number of guesses: {num_guesses}\")",
          description: "Exhaustive square root search",
        },
        {
          id: "epsilon-tradeoff",
          title: "Epsilon Tradeoff",
          code: "# Compare different epsilon values\ntarget = 25\nstep = 0.001\n\nfor epsilon in [0.1, 0.01, 0.001]:\n    guess = 0.0\n    num_guesses = 0\n    \n    while abs(guess**2 - target) >= epsilon:\n        guess += step\n        num_guesses += 1\n    \n    error = abs(guess**2 - target)\n    print(f\"epsilon={epsilon}: guess={guess:.4f}, \"\n          f\"error={error:.6f}, guesses={num_guesses}\")\n\n# Smaller epsilon = more accurate but more guesses",
          description: "Trading accuracy for speed",
        },
        {
          id: "when-no-solution",
          title: "Handling No Solution",
          code: "# What if no solution in search space?\ntarget = 25\nepsilon = 0.01\nstep = 0.1\nguess = 0.0\nmax_guess = 10  # Search limit\n\nwhile guess <= max_guess:\n    if abs(guess**2 - target) < epsilon:\n        print(f\"Found: {guess}\")\n        break\n    guess += step\nelse:\n    # This runs if while completes without break\n    print(\"No solution found in search space\")\n\n# Try with unreachable target\nprint(\"\\nSearching for sqrt(200) up to 10:\")\nguess = 0.0\nwhile guess <= max_guess:\n    if abs(guess**2 - 200) < epsilon:\n        print(f\"Found: {guess}\")\n        break\n    guess += step\nelse:\n    print(\"No solution found (sqrt(200) > 10)\")",
          description: "When solution isn't found",
        },
      ]),
      keyPoints: [
        "Many problems have no exact solution",
        "Epsilon = acceptable error tolerance",
        "Check: abs(guess - answer) < epsilon",
        "Smaller epsilon = more accurate but slower",
        "abs() returns absolute value (always positive)",
        "Exhaustive search can be very slow",
        "Always handle 'no solution found' case",
        "Bisection search is much faster (next lesson)",
      ],
      hardwareDemo: "Watch guess increment slowly toward answer. See iteration count grow.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson3_3_1.number}: ${lesson3_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson3_3_1.id,
        number: 1,
        title: "Check with Epsilon",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Check if 1.414 squared is approximately 2 (within epsilon=0.01).",
        starterCode: "guess = 1.414\ntarget = 2\nepsilon = 0.01\n\n# Check if guess^2 is close to target\n",
        solution: "guess = 1.414\ntarget = 2\nepsilon = 0.01\n\ndifference = abs(guess**2 - target)\nprint(f\"guess^2 = {guess**2}\")\nprint(f\"Difference from target: {difference}\")\nprint(f\"Close enough? {difference < epsilon}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Close enough? True", description: "1.414^2 ≈ 2" }]),
        hints: ["Calculate guess**2", "Find difference with abs()", "Compare to epsilon"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson3_3_1.id,
        number: 2,
        title: "Find Square Root of 16",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find the square root of 16 using exhaustive enumeration with step=0.1 and epsilon=0.01.",
        starterCode: "target = 16\nepsilon = 0.01\nstep = 0.1\nguess = 0.0\n\n# Find square root\n",
        solution: "target = 16\nepsilon = 0.01\nstep = 0.1\nguess = 0.0\n\nwhile abs(guess**2 - target) >= epsilon:\n    guess += step\n\nprint(f\"Square root of {target} is approximately {guess}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "approximately 4.0", description: "sqrt(16) = 4" }]),
        hints: ["Use while loop", "Condition: abs(guess**2 - target) >= epsilon", "Increment guess each iteration"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson3_3_1.id,
        number: 3,
        title: "Count Iterations",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find sqrt(49) with step=0.01. Count and print how many guesses it takes.",
        starterCode: "target = 49\nepsilon = 0.01\nstep = 0.01\nguess = 0.0\nnum_guesses = 0\n\n# Find sqrt and count iterations\n",
        solution: "target = 49\nepsilon = 0.01\nstep = 0.01\nguess = 0.0\nnum_guesses = 0\n\nwhile abs(guess**2 - target) >= epsilon:\n    guess += step\n    num_guesses += 1\n\nprint(f\"sqrt({target}) ≈ {guess}\")\nprint(f\"Took {num_guesses} guesses\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "≈ 7.0\\nTook ~700 guesses", description: "About 700 iterations" }]),
        hints: ["Increment counter inside loop", "Print count after loop", "Should be around 700"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson3_3_1.id,
        number: 4,
        title: "Compare Epsilon Values",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Find sqrt(10) using epsilon values 0.1, 0.01, and 0.001. Compare accuracy and iteration count.",
        starterCode: "target = 10\nstep = 0.001\n\n# Try different epsilon values\n",
        solution: "target = 10\nstep = 0.001\n\nfor epsilon in [0.1, 0.01, 0.001]:\n    guess = 0.0\n    count = 0\n    while abs(guess**2 - target) >= epsilon:\n        guess += step\n        count += 1\n    print(f\"epsilon={epsilon}: sqrt≈{guess:.4f}, iterations={count}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Three results showing tradeoff", description: "Accuracy vs speed" }]),
        hints: ["Loop through epsilon values", "Reset guess and count for each", "Compare results"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson3_3_1.id,
        number: 5,
        title: "Cube Root Approximation",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Find the approximate cube root of 27 using epsilon=0.001 and step=0.01.",
        starterCode: "target = 27\nepsilon = 0.001\nstep = 0.01\n\n# Find cube root (x^3 ≈ target)\n",
        solution: "target = 27\nepsilon = 0.001\nstep = 0.01\nguess = 0.0\n\nwhile abs(guess**3 - target) >= epsilon:\n    guess += step\n\nprint(f\"Cube root of {target} ≈ {guess:.4f}\")\nprint(f\"Verification: {guess:.4f}^3 = {guess**3:.4f}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "≈ 3.0", description: "Cube root of 27 is 3" }]),
        hints: ["Similar to square root", "Use guess**3 instead of guess**2", "Check against target"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 3.3.1`);

  // ==================== LESSON 3.3.2 ====================
  const lesson3_3_2 = await prisma.lesson.upsert({
    where: { slug: "bisection-search" },
    update: {},
    create: {
      sectionId: section3_3.id,
      number: 3.32,
      title: "Bisection Search Algorithm",
      slug: "bisection-search",
      objectives: [
        "Understand the bisection (binary search) concept",
        "Implement bisection search for finding roots",
        "Compare efficiency with exhaustive enumeration",
        "Know when bisection search applies",
      ],
      content: `# Bisection Search Algorithm

## The Key Insight

Instead of checking every value (exhaustive), **cut the search space in half** each time!

**Guessing game analogy:**
- "I'm thinking of a number 1-100"
- Bad strategy: Guess 1, 2, 3, 4... (up to 100 guesses)
- Good strategy: Guess 50, then 25 or 75, etc. (max 7 guesses!)

## How Bisection Works

1. Start with a range [low, high] containing the answer
2. Guess the middle: mid = (low + high) / 2
3. If guess is too low: search upper half [mid, high]
4. If guess is too high: search lower half [low, mid]
5. Repeat until close enough

## Example: Finding √25

\`\`\`
Search space: [0, 25]
mid = 12.5, 12.5² = 156.25 (too high!) → [0, 12.5]
mid = 6.25, 6.25² = 39.06 (too high!) → [0, 6.25]
mid = 3.125, 3.125² = 9.77 (too low!) → [3.125, 6.25]
mid = 4.6875, 4.6875² = 21.97 (too low!) → [4.6875, 6.25]
mid = 5.46875, 5.46875² = 29.91 (too high!) → [4.6875, 5.46875]
...continues until close enough...
\`\`\`

Only ~15 iterations vs ~500 for exhaustive!

## The Algorithm

\`\`\`python
low = 0
high = x
while abs(guess**2 - x) >= epsilon:
    guess = (low + high) / 2
    if guess**2 < x:
        low = guess
    else:
        high = guess
\`\`\`

## Why It's Fast

Each iteration **halves** the search space:
- After 1 iteration: half the space
- After 10 iterations: 1/1024 of space
- After 20 iterations: 1/1,000,000 of space

**Logarithmic** complexity: O(log n) vs O(n) for exhaustive.

## Requirements for Bisection

1. Search space must be **ordered** (sorted)
2. You can tell if guess is too high or too low
3. Answer exists within initial range`,
      codeExamples: JSON.stringify([
        {
          id: "bisection-sqrt",
          title: "Bisection Square Root",
          code: "# Find square root using bisection search\nx = 25\nepsilon = 0.001\nlow = 0\nhigh = x\nguess = (low + high) / 2\nnum_guesses = 0\n\nwhile abs(guess**2 - x) >= epsilon:\n    num_guesses += 1\n    print(f\"Guess {num_guesses}: {guess:.4f} (range: [{low:.4f}, {high:.4f}])\")\n    \n    if guess**2 < x:\n        low = guess   # Answer is higher\n    else:\n        high = guess  # Answer is lower\n    guess = (low + high) / 2\n\nprint(f\"\\nSquare root of {x} ≈ {guess:.6f}\")\nprint(f\"Only {num_guesses} guesses needed!\")",
          description: "Bisection search for square root",
        },
        {
          id: "compare-methods",
          title: "Bisection vs Exhaustive",
          code: "import time\n\nx = 12345\nepsilon = 0.001\n\n# Exhaustive enumeration\nstart = time.time()\nguess = 0.0\nstep = 0.001\nexhaustive_count = 0\nwhile abs(guess**2 - x) >= epsilon and guess <= x:\n    guess += step\n    exhaustive_count += 1\nexhaustive_time = time.time() - start\n\n# Bisection search\nstart = time.time()\nlow, high = 0, x\nguess = (low + high) / 2\nbisection_count = 0\nwhile abs(guess**2 - x) >= epsilon:\n    bisection_count += 1\n    if guess**2 < x:\n        low = guess\n    else:\n        high = guess\n    guess = (low + high) / 2\nbisection_time = time.time() - start\n\nprint(f\"Finding sqrt({x}):\")\nprint(f\"Exhaustive: {exhaustive_count} iterations\")\nprint(f\"Bisection:  {bisection_count} iterations\")\nprint(f\"Bisection is {exhaustive_count // bisection_count}x faster!\")",
          description: "Comparing the two methods",
        },
        {
          id: "bisection-trace",
          title: "Tracing Bisection",
          code: "# Detailed trace of bisection\nx = 50\nepsilon = 0.5\nlow = 0\nhigh = x\n\nprint(f\"Finding sqrt({x})\")\nprint(f\"Initial range: [{low}, {high}]\")\nprint()\n\nfor iteration in range(10):  # Max 10 iterations\n    guess = (low + high) / 2\n    square = guess ** 2\n    error = abs(square - x)\n    \n    print(f\"Step {iteration + 1}:\")\n    print(f\"  guess = ({low:.2f} + {high:.2f}) / 2 = {guess:.2f}\")\n    print(f\"  guess^2 = {square:.2f}\")\n    print(f\"  error = {error:.4f}\")\n    \n    if error < epsilon:\n        print(f\"  Close enough! Done.\")\n        break\n    elif square < x:\n        print(f\"  Too low, search [{guess:.2f}, {high:.2f}]\")\n        low = guess\n    else:\n        print(f\"  Too high, search [{low:.2f}, {guess:.2f}]\")\n        high = guess\n    print()",
          description: "Step-by-step bisection",
        },
        {
          id: "bisection-function",
          title: "Bisection as Function",
          code: "def sqrt_bisection(x, epsilon=0.001):\n    \"\"\"Find square root using bisection search.\"\"\"\n    if x < 0:\n        return None  # No real square root of negative\n    \n    low = 0\n    high = max(1, x)  # Handle x < 1\n    guess = (low + high) / 2\n    \n    while abs(guess**2 - x) >= epsilon:\n        if guess**2 < x:\n            low = guess\n        else:\n            high = guess\n        guess = (low + high) / 2\n    \n    return guess\n\n# Test it\nfor num in [4, 25, 2, 0.25, 12345]:\n    result = sqrt_bisection(num)\n    print(f\"sqrt({num}) ≈ {result:.6f}\")",
          description: "Reusable bisection function",
        },
      ]),
      keyPoints: [
        "Bisection halves search space each iteration",
        "Much faster than exhaustive: O(log n) vs O(n)",
        "Start with range [low, high] containing answer",
        "Guess middle: (low + high) / 2",
        "Adjust low or high based on guess result",
        "Requires ordered search space",
        "Must be able to tell if guess is too high/low",
        "20 iterations covers 1 million values!",
      ],
      hardwareDemo: "Watch search space shrink by half each iteration. Compare counter with exhaustive.",
      estimatedTime: 35,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson3_3_2.number}: ${lesson3_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson3_3_2.id,
        number: 1,
        title: "Bisection sqrt(100)",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use bisection search to find the square root of 100 with epsilon=0.01.",
        starterCode: "x = 100\nepsilon = 0.01\nlow = 0\nhigh = x\n\n# Implement bisection search\n",
        solution: "x = 100\nepsilon = 0.01\nlow = 0\nhigh = x\nguess = (low + high) / 2\n\nwhile abs(guess**2 - x) >= epsilon:\n    if guess**2 < x:\n        low = guess\n    else:\n        high = guess\n    guess = (low + high) / 2\n\nprint(f\"sqrt({x}) ≈ {guess}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "≈ 10.0", description: "sqrt(100) = 10" }]),
        hints: ["Start with low=0, high=100", "Guess middle each time", "Adjust low or high based on guess²"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson3_3_2.id,
        number: 2,
        title: "Count Bisection Steps",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find sqrt(10000) with bisection. Count iterations and compare to what exhaustive would need.",
        starterCode: "x = 10000\nepsilon = 0.001\n\n# Bisection with counter\n",
        solution: "x = 10000\nepsilon = 0.001\nlow = 0\nhigh = x\nguess = (low + high) / 2\ncount = 0\n\nwhile abs(guess**2 - x) >= epsilon:\n    count += 1\n    if guess**2 < x:\n        low = guess\n    else:\n        high = guess\n    guess = (low + high) / 2\n\nprint(f\"sqrt({x}) ≈ {guess}\")\nprint(f\"Bisection: {count} iterations\")\nprint(f\"Exhaustive would need ~{int(100/0.001)} iterations!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "~20-25 iterations", description: "Very few iterations" }]),
        hints: ["Add counter variable", "Compare to step size calculation"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson3_3_2.id,
        number: 3,
        title: "Bisection for Small Numbers",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find sqrt(0.25) using bisection. Note: for x<1, the square root is LARGER than x!",
        starterCode: "x = 0.25\nepsilon = 0.001\n\n# Hint: high should be 1, not x, when x < 1\n",
        solution: "x = 0.25\nepsilon = 0.001\nlow = 0\nhigh = max(1, x)  # Important for x < 1!\nguess = (low + high) / 2\n\nwhile abs(guess**2 - x) >= epsilon:\n    if guess**2 < x:\n        low = guess\n    else:\n        high = guess\n    guess = (low + high) / 2\n\nprint(f\"sqrt({x}) ≈ {guess}\")\nprint(f\"Verification: {guess}^2 = {guess**2}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "≈ 0.5", description: "sqrt(0.25) = 0.5" }]),
        hints: ["sqrt(0.25) = 0.5 which is > 0.25", "Set high = 1 for numbers less than 1"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson3_3_2.id,
        number: 4,
        title: "Bisection Function",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a function bisection_sqrt(x, epsilon) that returns the square root. Handle x < 1 correctly.",
        starterCode: "def bisection_sqrt(x, epsilon=0.001):\n    # Implement bisection search\n    pass\n\n# Test\nprint(bisection_sqrt(25))\nprint(bisection_sqrt(2))\nprint(bisection_sqrt(0.25))",
        solution: "def bisection_sqrt(x, epsilon=0.001):\n    if x < 0:\n        return None\n    low = 0\n    high = max(1, x)\n    guess = (low + high) / 2\n    \n    while abs(guess**2 - x) >= epsilon:\n        if guess**2 < x:\n            low = guess\n        else:\n            high = guess\n        guess = (low + high) / 2\n    return guess\n\nprint(f\"sqrt(25) = {bisection_sqrt(25)}\")\nprint(f\"sqrt(2) = {bisection_sqrt(2)}\")\nprint(f\"sqrt(0.25) = {bisection_sqrt(0.25)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "5.0, 1.414, 0.5", description: "All correct" }]),
        hints: ["Handle x < 1 with max(1, x)", "Return the guess", "Handle negative input"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson3_3_2.id,
        number: 5,
        title: "Cube Root with Bisection",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Adapt bisection search to find cube roots. Test with 27 and 8.",
        starterCode: "def bisection_cuberoot(x, epsilon=0.001):\n    # Find cube root using bisection\n    pass\n\nprint(bisection_cuberoot(27))\nprint(bisection_cuberoot(8))",
        solution: "def bisection_cuberoot(x, epsilon=0.001):\n    if x >= 0:\n        low = 0\n        high = max(1, x)\n    else:\n        low = x\n        high = 0\n    guess = (low + high) / 2\n    \n    while abs(guess**3 - x) >= epsilon:\n        if guess**3 < x:\n            low = guess\n        else:\n            high = guess\n        guess = (low + high) / 2\n    return guess\n\nprint(f\"cuberoot(27) = {bisection_cuberoot(27)}\")\nprint(f\"cuberoot(8) = {bisection_cuberoot(8)}\")\nprint(f\"cuberoot(-8) = {bisection_cuberoot(-8)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "3.0, 2.0, -2.0", description: "Cube roots" }]),
        hints: ["Change guess**2 to guess**3", "Cube roots of negatives exist!", "Adjust range for negatives"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 3.3.2`);

  console.log("\n✅ Chapter 3 Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
