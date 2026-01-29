import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 3 Part 5: Lessons 3.5.1-3.5.2 (Newton-Raphson)...\n");

  const section3_5 = await prisma.section.findFirst({ where: { number: 3.5 } });
  if (!section3_5) throw new Error("Section 3.5 not found.");

  // ==================== LESSON 3.5.1 ====================
  const lesson3_5_1 = await prisma.lesson.upsert({
    where: { slug: "newton-raphson-method" },
    update: {},
    create: {
      sectionId: section3_5.id,
      number: 3.51,
      title: "Newton-Raphson Method",
      slug: "newton-raphson-method",
      objectives: [
        "Understand the Newton-Raphson algorithm",
        "Apply the method to find square roots",
        "See why it converges so quickly",
        "Implement the algorithm in Python",
      ],
      content: `# Newton-Raphson Method

## A Faster Approach

Newton-Raphson is much faster than bisection for finding roots of equations.

**Key idea**: Use calculus to make better guesses.

## The Formula

To find where f(x) = 0, iterate:

\`\`\`
x_new = x_old - f(x_old) / f'(x_old)
\`\`\`

Where f'(x) is the derivative of f(x).

## Finding Square Roots

To find √k, we want x where x² = k, or x² - k = 0.

- f(x) = x² - k
- f'(x) = 2x

The formula becomes:
\`\`\`
x_new = x_old - (x_old² - k) / (2 * x_old)
\`\`\`

Which simplifies to:
\`\`\`
x_new = (x_old + k / x_old) / 2
\`\`\`

## Why It's Fast

Newton-Raphson has **quadratic convergence**:
- Each iteration roughly doubles the correct digits
- 5 iterations often gives 15+ digits of accuracy!

Compare:
- Exhaustive: ~100,000 iterations
- Bisection: ~50 iterations
- Newton-Raphson: ~5 iterations

## The Algorithm

\`\`\`python
guess = k / 2  # Start with reasonable guess
while abs(guess**2 - k) >= epsilon:
    guess = (guess + k / guess) / 2
\`\`\`

## Geometric Interpretation

Each iteration finds where the tangent line crosses zero - a better approximation than halving the interval.`,
      codeExamples: JSON.stringify([
        {
          id: "newton-sqrt",
          title: "Newton-Raphson Square Root",
          code: "# Find square root using Newton-Raphson\nk = 25\nepsilon = 0.0001\nguess = k / 2  # Initial guess\nnum_iterations = 0\n\nprint(f\"Finding sqrt({k})\")\nprint(f\"Initial guess: {guess}\")\nprint()\n\nwhile abs(guess**2 - k) >= epsilon:\n    num_iterations += 1\n    old_guess = guess\n    guess = (guess + k / guess) / 2\n    print(f\"Iteration {num_iterations}: {old_guess:.10f} -> {guess:.10f}\")\n\nprint(f\"\\nResult: sqrt({k}) = {guess}\")\nprint(f\"Only {num_iterations} iterations!\")",
          description: "Newton-Raphson for square roots",
        },
        {
          id: "newton-derivation",
          title: "Understanding the Formula",
          code: "# The Newton-Raphson formula for sqrt(k)\n# f(x) = x^2 - k  (want to find where this = 0)\n# f'(x) = 2x\n# x_new = x_old - f(x_old)/f'(x_old)\n#       = x_old - (x_old^2 - k)/(2*x_old)\n#       = (2*x_old^2 - x_old^2 + k)/(2*x_old)\n#       = (x_old^2 + k)/(2*x_old)\n#       = (x_old + k/x_old)/2\n\nk = 10\nguess = k\n\nprint(\"Showing formula equivalence:\")\nfor i in range(5):\n    # Long form\n    f_x = guess**2 - k\n    f_prime = 2 * guess\n    long_form = guess - f_x / f_prime\n    \n    # Short form\n    short_form = (guess + k / guess) / 2\n    \n    print(f\"guess={guess:.6f}: long={long_form:.6f}, short={short_form:.6f}\")\n    guess = short_form",
          description: "How the formula is derived",
        },
        {
          id: "newton-function",
          title: "Newton-Raphson Function",
          code: "def newton_sqrt(k, epsilon=1e-10):\n    \"\"\"Find square root using Newton-Raphson.\"\"\"\n    if k < 0:\n        return None  # No real square root of negative\n    if k == 0:\n        return 0\n    \n    guess = k / 2 if k > 1 else 1  # Better initial guess\n    iterations = 0\n    \n    while abs(guess**2 - k) >= epsilon:\n        guess = (guess + k / guess) / 2\n        iterations += 1\n        if iterations > 100:  # Safety limit\n            break\n    \n    return guess, iterations\n\n# Test with various numbers\nfor num in [4, 25, 2, 0.25, 12345, 0.0001]:\n    result, iters = newton_sqrt(num)\n    print(f\"sqrt({num}) = {result:.10f} ({iters} iterations)\")",
          description: "Reusable Newton-Raphson function",
        },
        {
          id: "quadratic-convergence",
          title: "Watching Convergence",
          code: "# See how fast Newton-Raphson converges\nimport math\n\nk = 2  # sqrt(2) is irrational - good test\ntrue_sqrt = math.sqrt(k)\nguess = k\n\nprint(f\"Finding sqrt({k})\")\nprint(f\"True value: {true_sqrt}\")\nprint()\nprint(\"Iteration | Guess          | Error\")\nprint(\"-\" * 45)\n\nfor i in range(8):\n    error = abs(guess - true_sqrt)\n    print(f\"{i:9} | {guess:.12f} | {error:.2e}\")\n    guess = (guess + k / guess) / 2\n\n# Notice error drops rapidly - roughly squares each time!",
          description: "Observing quadratic convergence",
        },
      ]),
      keyPoints: [
        "Newton-Raphson uses calculus for faster convergence",
        "Formula: x_new = x_old - f(x)/f'(x)",
        "For sqrt: x_new = (x_old + k/x_old) / 2",
        "Quadratic convergence: doubles correct digits each step",
        "Much faster than exhaustive or bisection",
        "Typically converges in 5-10 iterations",
        "Needs a reasonable initial guess",
        "Can fail if derivative is zero",
      ],
      hardwareDemo: "Watch guess improve dramatically each iteration. See error decrease quadratically.",
      estimatedTime: 35,
      difficulty: "ADVANCED",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson3_5_1.number}: ${lesson3_5_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson3_5_1.id,
        number: 1,
        title: "Newton sqrt(100)",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use Newton-Raphson to find sqrt(100). Print each iteration.",
        starterCode: "k = 100\nepsilon = 0.0001\nguess = k / 2\n\n# Newton-Raphson iterations\n",
        solution: "k = 100\nepsilon = 0.0001\nguess = k / 2\ncount = 0\n\nwhile abs(guess**2 - k) >= epsilon:\n    count += 1\n    guess = (guess + k / guess) / 2\n    print(f\"Iteration {count}: guess = {guess}\")\n\nprint(f\"\\nsqrt({k}) = {guess}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "= 10.0 in ~5 iterations", description: "Finds 10" }]),
        hints: ["Formula: guess = (guess + k/guess) / 2", "Check abs(guess**2 - k) >= epsilon", "Should converge quickly!"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson3_5_1.id,
        number: 2,
        title: "Count Iterations",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find sqrt(12345) using Newton-Raphson. Count iterations and compare mentally to bisection (~40 iterations).",
        starterCode: "k = 12345\nepsilon = 1e-10\n\n# Find sqrt and count iterations\n",
        solution: "k = 12345\nepsilon = 1e-10\nguess = k / 2\ncount = 0\n\nwhile abs(guess**2 - k) >= epsilon:\n    guess = (guess + k / guess) / 2\n    count += 1\n\nprint(f\"sqrt({k}) = {guess}\")\nprint(f\"Newton-Raphson: {count} iterations\")\nprint(f\"Bisection would need: ~40 iterations\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "~7-10 iterations", description: "Very few iterations" }]),
        hints: ["Same formula as before", "Count iterations", "Should be much fewer than 40!"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson3_5_1.id,
        number: 3,
        title: "Newton Function",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a function newton_sqrt(k, epsilon) that returns the square root using Newton-Raphson.",
        starterCode: "def newton_sqrt(k, epsilon=1e-10):\n    # Implement Newton-Raphson\n    pass\n\n# Test\nprint(newton_sqrt(25))\nprint(newton_sqrt(2))\nprint(newton_sqrt(0.25))",
        solution: "def newton_sqrt(k, epsilon=1e-10):\n    if k < 0:\n        return None\n    if k == 0:\n        return 0\n    guess = k / 2 if k > 1 else 1\n    while abs(guess**2 - k) >= epsilon:\n        guess = (guess + k / guess) / 2\n    return guess\n\nprint(f\"sqrt(25) = {newton_sqrt(25)}\")\nprint(f\"sqrt(2) = {newton_sqrt(2)}\")\nprint(f\"sqrt(0.25) = {newton_sqrt(0.25)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "5.0, 1.414..., 0.5", description: "All correct" }]),
        hints: ["Handle edge cases (0, negative)", "Good initial guess for k < 1", "Return the final guess"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson3_5_1.id,
        number: 4,
        title: "Watch Convergence",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Find sqrt(2) and print the error at each iteration. Observe how error decreases.",
        starterCode: "import math\n\nk = 2\ntrue_sqrt = math.sqrt(k)\nguess = k\n\n# Print error at each iteration\n",
        solution: "import math\n\nk = 2\ntrue_sqrt = math.sqrt(k)\nguess = k\n\nprint(\"Iteration | Error\")\nfor i in range(8):\n    error = abs(guess - true_sqrt)\n    print(f\"{i:9} | {error:.2e}\")\n    guess = (guess + k / guess) / 2\n\nprint(f\"\\nFinal: {guess}\")\nprint(f\"True:  {true_sqrt}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Error decreases rapidly", description: "Shows convergence" }]),
        hints: ["Use math.sqrt for true value", "Calculate error = abs(guess - true)", "Error roughly squares (halves exponent) each step"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson3_5_1.id,
        number: 5,
        title: "Cube Root Newton",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Adapt Newton-Raphson for cube roots. For f(x) = x³ - k, the formula is: x_new = (2*x_old + k/x_old²) / 3",
        starterCode: "def newton_cuberoot(k, epsilon=1e-10):\n    # Newton-Raphson for cube root\n    # x_new = (2*x_old + k/x_old^2) / 3\n    pass\n\nprint(newton_cuberoot(27))\nprint(newton_cuberoot(8))\nprint(newton_cuberoot(-8))",
        solution: "def newton_cuberoot(k, epsilon=1e-10):\n    if k == 0:\n        return 0\n    # Handle negative numbers\n    sign = 1 if k > 0 else -1\n    k = abs(k)\n    guess = k / 3\n    \n    while abs(guess**3 - k) >= epsilon:\n        guess = (2 * guess + k / (guess**2)) / 3\n    \n    return sign * guess\n\nprint(f\"cuberoot(27) = {newton_cuberoot(27)}\")\nprint(f\"cuberoot(8) = {newton_cuberoot(8)}\")\nprint(f\"cuberoot(-8) = {newton_cuberoot(-8)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "3.0, 2.0, -2.0", description: "Cube roots" }]),
        hints: ["Formula: (2*x + k/x²) / 3", "Cube roots of negatives exist", "Handle sign separately"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 3.5.1`);

  // ==================== LESSON 3.5.2 ====================
  const lesson3_5_2 = await prisma.lesson.upsert({
    where: { slug: "algorithm-efficiency-comparison" },
    update: {},
    create: {
      sectionId: section3_5.id,
      number: 3.52,
      title: "Comparing Algorithm Efficiency",
      slug: "algorithm-efficiency-comparison",
      objectives: [
        "Compare exhaustive, bisection, and Newton-Raphson",
        "Understand Big-O notation basics",
        "See practical performance differences",
        "Choose the right algorithm for the problem",
      ],
      content: `# Comparing Algorithm Efficiency

## The Three Approaches

We've learned three ways to find square roots:

1. **Exhaustive Enumeration**: Try every value
2. **Bisection Search**: Halve the search space
3. **Newton-Raphson**: Use calculus for smart guesses

## Complexity Comparison

| Algorithm | Iterations for √1,000,000 | Big-O |
|-----------|---------------------------|-------|
| Exhaustive | ~1,000,000 | O(n) |
| Bisection | ~40 | O(log n) |
| Newton-Raphson | ~10 | O(log log n) |

## Big-O Notation (Preview)

Big-O describes how algorithms scale:

- **O(n)**: Linear - double input, double time
- **O(log n)**: Logarithmic - double input, +1 step
- **O(log log n)**: Even better!

## When to Use Each

**Exhaustive Enumeration**:
- Simple problems
- Small search spaces
- When simplicity matters more than speed

**Bisection Search**:
- Ordered search spaces
- Can determine "too high" or "too low"
- Good balance of simplicity and speed

**Newton-Raphson**:
- When you have the derivative
- Need maximum speed
- Smooth functions with good initial guess

## The Tradeoff

- Exhaustive: Simplest to implement
- Bisection: Good balance
- Newton-Raphson: Fastest but most complex

Choose based on your needs!`,
      codeExamples: JSON.stringify([
        {
          id: "compare-all-three",
          title: "Comparing All Three Methods",
          code: "import time\n\ndef exhaustive_sqrt(k, step=0.001, epsilon=0.01):\n    guess = 0.0\n    count = 0\n    while abs(guess**2 - k) >= epsilon and guess <= k:\n        guess += step\n        count += 1\n    return guess, count\n\ndef bisection_sqrt(k, epsilon=0.01):\n    low, high = 0, max(1, k)\n    guess = (low + high) / 2\n    count = 0\n    while abs(guess**2 - k) >= epsilon:\n        if guess**2 < k:\n            low = guess\n        else:\n            high = guess\n        guess = (low + high) / 2\n        count += 1\n    return guess, count\n\ndef newton_sqrt(k, epsilon=0.01):\n    guess = k / 2 if k > 1 else 1\n    count = 0\n    while abs(guess**2 - k) >= epsilon:\n        guess = (guess + k / guess) / 2\n        count += 1\n    return guess, count\n\n# Compare\nk = 10000\nprint(f\"Finding sqrt({k}):\\n\")\n\nfor name, func in [('Exhaustive', exhaustive_sqrt), \n                   ('Bisection', bisection_sqrt),\n                   ('Newton-Raphson', newton_sqrt)]:\n    result, iters = func(k)\n    print(f\"{name:15}: {result:.6f} in {iters} iterations\")",
          description: "Side-by-side comparison",
        },
        {
          id: "scaling-comparison",
          title: "How They Scale",
          code: "def bisection_sqrt(k, epsilon=1e-6):\n    low, high = 0, max(1, k)\n    guess = (low + high) / 2\n    count = 0\n    while abs(guess**2 - k) >= epsilon:\n        if guess**2 < k: low = guess\n        else: high = guess\n        guess = (low + high) / 2\n        count += 1\n    return count\n\ndef newton_sqrt(k, epsilon=1e-6):\n    guess = k / 2 if k > 1 else 1\n    count = 0\n    while abs(guess**2 - k) >= epsilon:\n        guess = (guess + k / guess) / 2\n        count += 1\n    return count\n\nprint(\"How iterations scale with problem size:\")\nprint(f\"{'k':>12} | {'Bisection':>10} | {'Newton':>10}\")\nprint(\"-\" * 40)\n\nfor k in [100, 10000, 1000000, 100000000]:\n    bi = bisection_sqrt(k)\n    nw = newton_sqrt(k)\n    print(f\"{k:>12} | {bi:>10} | {nw:>10}\")\n\nprint(\"\\nNotice: Bisection grows slowly, Newton barely grows!\")",
          description: "Scaling with problem size",
        },
        {
          id: "time-comparison",
          title: "Actual Time Comparison",
          code: "import time\n\ndef time_function(func, k, runs=1000):\n    start = time.time()\n    for _ in range(runs):\n        func(k)\n    return (time.time() - start) / runs * 1000  # ms\n\ndef bisection(k):\n    low, high = 0, max(1, k)\n    guess = (low + high) / 2\n    while abs(guess**2 - k) >= 1e-10:\n        if guess**2 < k: low = guess\n        else: high = guess\n        guess = (low + high) / 2\n    return guess\n\ndef newton(k):\n    guess = k / 2 if k > 1 else 1\n    while abs(guess**2 - k) >= 1e-10:\n        guess = (guess + k / guess) / 2\n    return guess\n\nk = 123456789\nprint(f\"Timing sqrt({k}) over 1000 runs:\\n\")\n\nbi_time = time_function(bisection, k)\nnw_time = time_function(newton, k)\n\nprint(f\"Bisection:     {bi_time:.4f} ms\")\nprint(f\"Newton-Raphson: {nw_time:.4f} ms\")\nprint(f\"\\nNewton is {bi_time/nw_time:.1f}x faster!\")",
          description: "Measuring actual time",
        },
        {
          id: "choosing-algorithm",
          title: "Choosing the Right Algorithm",
          code: "# Decision guide for square root algorithms\n\ndef recommend_algorithm(problem_size, precision_needed, simplicity_preference):\n    \"\"\"\n    Recommend an algorithm based on requirements.\n    \n    problem_size: 'small', 'medium', 'large'\n    precision_needed: 'low', 'medium', 'high'\n    simplicity_preference: 'simple', 'moderate', 'complex_ok'\n    \"\"\"\n    \n    if simplicity_preference == 'simple' and problem_size == 'small':\n        return \"Exhaustive - simple and good enough\"\n    \n    if problem_size == 'large' or precision_needed == 'high':\n        return \"Newton-Raphson - fastest convergence\"\n    \n    return \"Bisection - good balance\"\n\n# Examples\nprint(\"Algorithm Recommendations:\\n\")\n\nscenarios = [\n    ('small', 'low', 'simple'),\n    ('medium', 'medium', 'moderate'),\n    ('large', 'high', 'complex_ok'),\n    ('large', 'low', 'simple'),\n]\n\nfor size, prec, simp in scenarios:\n    rec = recommend_algorithm(size, prec, simp)\n    print(f\"Size: {size}, Precision: {prec}, Simplicity: {simp}\")\n    print(f\"  -> {rec}\\n\")",
          description: "Choosing the right approach",
        },
      ]),
      keyPoints: [
        "Exhaustive: O(n) - simple but slow",
        "Bisection: O(log n) - good balance",
        "Newton-Raphson: O(log log n) - fastest",
        "Doubling problem size: exhaustive doubles, bisection +1, Newton +0.1",
        "Simpler isn't always worse - consider total development time",
        "Newton requires derivative - not always available",
        "Bisection works on any ordered space",
        "Real choice depends on problem constraints",
      ],
      hardwareDemo: "Run all three algorithms. Watch iteration counters race. See Newton win decisively.",
      estimatedTime: 30,
      difficulty: "ADVANCED",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson3_5_2.number}: ${lesson3_5_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson3_5_2.id,
        number: 1,
        title: "Count All Three",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find sqrt(625) using all three methods. Count and compare iterations.",
        starterCode: "k = 625\nepsilon = 0.01\n\n# Exhaustive (step=0.1)\n\n# Bisection\n\n# Newton-Raphson\n\n# Compare counts\n",
        solution: "k = 625\nepsilon = 0.01\n\n# Exhaustive\nguess = 0.0\nex_count = 0\nwhile abs(guess**2 - k) >= epsilon:\n    guess += 0.1\n    ex_count += 1\n\n# Bisection\nlow, high = 0, k\nguess = (low + high) / 2\nbi_count = 0\nwhile abs(guess**2 - k) >= epsilon:\n    if guess**2 < k: low = guess\n    else: high = guess\n    guess = (low + high) / 2\n    bi_count += 1\n\n# Newton\nguess = k / 2\nnw_count = 0\nwhile abs(guess**2 - k) >= epsilon:\n    guess = (guess + k / guess) / 2\n    nw_count += 1\n\nprint(f\"Exhaustive: {ex_count} iterations\")\nprint(f\"Bisection:  {bi_count} iterations\")\nprint(f\"Newton:     {nw_count} iterations\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "~250, ~15, ~5", description: "Clear difference" }]),
        hints: ["Exhaustive with step=0.1", "Bisection halves range", "Newton uses the formula"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson3_5_2.id,
        number: 2,
        title: "Scaling Test",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Compare bisection and Newton iterations for k = 100, 10000, 1000000. See how they scale.",
        starterCode: "# Compare scaling\nfor k in [100, 10000, 1000000]:\n    # Count bisection iterations\n    # Count Newton iterations\n    # Print comparison\n    pass",
        solution: "for k in [100, 10000, 1000000]:\n    # Bisection\n    low, high = 0, k\n    guess = (low + high) / 2\n    bi = 0\n    while abs(guess**2 - k) >= 1e-6:\n        if guess**2 < k: low = guess\n        else: high = guess\n        guess = (low + high) / 2\n        bi += 1\n    \n    # Newton\n    guess = k / 2\n    nw = 0\n    while abs(guess**2 - k) >= 1e-6:\n        guess = (guess + k / guess) / 2\n        nw += 1\n    \n    print(f\"k={k:>10}: Bisection={bi:>3}, Newton={nw:>3}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Newton barely increases", description: "Shows scaling" }]),
        hints: ["Same epsilon for fair comparison", "Newton iterations barely change", "Bisection grows slowly but steadily"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson3_5_2.id,
        number: 3,
        title: "Best Choice Quiz",
        type: "MULTIPLE_CHOICE",
        difficulty: "INTERMEDIATE",
        prompt: "You need to find square roots of millions of numbers quickly in a scientific application. Which algorithm should you use?",
        starterCode: "",
        solution: "Newton-Raphson - fastest for repeated calculations when speed matters",
        testCases: JSON.stringify([
          { input: "A) Exhaustive", expectedOutput: "false", description: "Too slow" },
          { input: "B) Bisection", expectedOutput: "false", description: "Good but not fastest" },
          { input: "C) Newton-Raphson", expectedOutput: "true", description: "Correct - fastest" },
        ]),
        hints: ["Scientific = need speed", "Millions of calculations", "Newton is fastest per calculation"],
        xpReward: 10,
        order: 3,
      },
      {
        lessonId: lesson3_5_2.id,
        number: 4,
        title: "Create Comparison Function",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a function compare_methods(k) that runs all three and returns a dict with iteration counts.",
        starterCode: "def compare_methods(k, epsilon=0.01):\n    \"\"\"Return dict with iteration counts for each method.\"\"\"\n    pass\n\nresult = compare_methods(400)\nprint(result)",
        solution: "def compare_methods(k, epsilon=0.01):\n    # Exhaustive\n    guess, ex = 0.0, 0\n    while abs(guess**2 - k) >= epsilon:\n        guess += 0.1\n        ex += 1\n    \n    # Bisection\n    low, high = 0, max(1, k)\n    guess = (low + high) / 2\n    bi = 0\n    while abs(guess**2 - k) >= epsilon:\n        if guess**2 < k: low = guess\n        else: high = guess\n        guess = (low + high) / 2\n        bi += 1\n    \n    # Newton\n    guess = k / 2 if k > 1 else 1\n    nw = 0\n    while abs(guess**2 - k) >= epsilon:\n        guess = (guess + k / guess) / 2\n        nw += 1\n    \n    return {'exhaustive': ex, 'bisection': bi, 'newton': nw}\n\nresult = compare_methods(400)\nprint(result)",
        testCases: JSON.stringify([{ input: "400", expectedOutput: "dict with counts", description: "Returns comparison" }]),
        hints: ["Track count for each method", "Return dictionary", "Use consistent epsilon"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson3_5_2.id,
        number: 5,
        title: "Visualize Convergence",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "For k=50, print each guess for both bisection and Newton side by side to visualize convergence.",
        starterCode: "k = 50\nepsilon = 0.001\n\n# Track both methods' guesses and print side by side\n",
        solution: "k = 50\nepsilon = 0.001\n\n# Initialize both\nbi_low, bi_high = 0, k\nbi_guess = (bi_low + bi_high) / 2\nnw_guess = k / 2\n\nprint(f\"Finding sqrt({k})\")\nprint(f\"{'Step':>4} | {'Bisection':>12} | {'Newton':>12}\")\nprint(\"-\" * 35)\n\nstep = 0\nwhile abs(bi_guess**2 - k) >= epsilon or abs(nw_guess**2 - k) >= epsilon:\n    step += 1\n    \n    # Bisection step\n    if abs(bi_guess**2 - k) >= epsilon:\n        if bi_guess**2 < k: bi_low = bi_guess\n        else: bi_high = bi_guess\n        bi_guess = (bi_low + bi_high) / 2\n    \n    # Newton step\n    if abs(nw_guess**2 - k) >= epsilon:\n        nw_guess = (nw_guess + k / nw_guess) / 2\n    \n    print(f\"{step:>4} | {bi_guess:>12.6f} | {nw_guess:>12.6f}\")\n    \n    if step > 20: break\n\nprint(f\"\\nTrue sqrt(50) = 7.071067...\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Side by side comparison", description: "Visual comparison" }]),
        hints: ["Track both guesses", "Update each if not converged", "Newton converges faster visually"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 3.5.2`);

  // Verify Chapter 3 is complete
  const chapter3 = await prisma.chapter.findFirst({
    where: { number: 3 },
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

  if (chapter3) {
    console.log("\n" + "=".repeat(60));
    console.log("📚 CHAPTER 3 COMPLETE!");
    console.log("=".repeat(60));
    
    let totalLessons = 0;
    let totalExercises = 0;
    
    for (const section of chapter3.sections) {
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
