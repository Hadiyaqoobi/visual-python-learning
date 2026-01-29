import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 9 Part 1: Structure + Lessons 9.1.1-9.1.2...\n");

  // Create Chapter 9
  let chapter9 = await prisma.chapter.findFirst({ where: { number: 9 } });
  if (!chapter9) {
    chapter9 = await prisma.chapter.create({
      data: {
        number: 9,
        title: "A Simplistic Introduction to Algorithmic Complexity",
        description: "Learn to analyze algorithm efficiency with Big O notation. Understand why some code is fast and other code is slow - essential for technical interviews and writing scalable software.",
        objectives: [
          "Understand why algorithm complexity matters",
          "Use Big O notation to describe efficiency",
          "Analyze code to determine its complexity",
          "Compare algorithms and choose wisely",
        ],
        isPublished: true,
      },
    });
  }
  console.log(`✅ Chapter ${chapter9.number}: ${chapter9.title}`);

  // Create Sections
  const section9_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter9.id, number: 9.1 } },
    update: {},
    create: { chapterId: chapter9.id, number: 9.1, title: "Understanding Efficiency", description: "Why speed matters.", order: 1 },
  });
  console.log(`  📂 Section ${section9_1.number}: ${section9_1.title}`);

  const section9_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter9.id, number: 9.2 } },
    update: {},
    create: { chapterId: chapter9.id, number: 9.2, title: "Big O Notation", description: "The language of complexity.", order: 2 },
  });
  console.log(`  📂 Section ${section9_2.number}: ${section9_2.title}`);

  const section9_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter9.id, number: 9.3 } },
    update: {},
    create: { chapterId: chapter9.id, number: 9.3, title: "Comparing and Analyzing", description: "Practical complexity analysis.", order: 3 },
  });
  console.log(`  📂 Section ${section9_3.number}: ${section9_3.title}`);

  // ==================== LESSON 9.1.1 ====================
  const lesson9_1_1 = await prisma.lesson.upsert({
    where: { slug: "why-complexity-matters" },
    update: {},
    create: {
      sectionId: section9_1.id,
      number: 9.11,
      title: "Why Complexity Matters",
      slug: "why-complexity-matters",
      objectives: [
        "See dramatic performance differences between algorithms",
        "Understand scalability and why it matters",
        "Recognize that correct code isn't always good code",
        "Motivate the need for complexity analysis",
      ],
      content: `# Why Complexity Matters

## The Fundamental Question

Two algorithms solve the same problem. Both give correct answers. But:

- **Algorithm A**: Finishes in 1 second
- **Algorithm B**: Finishes in 10 hours

Which would you choose? Obviously A! But how do you know which is which?

## A Real Example

Finding a number in a list:

\`\`\`python
# Method 1: Check each item
def linear_search(items, target):
    for item in items:
        if item == target:
            return True
    return False

# Method 2: Binary search (sorted list)
def binary_search(items, target):
    left, right = 0, len(items) - 1
    while left <= right:
        mid = (left + right) // 2
        if items[mid] == target:
            return True
        elif items[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return False
\`\`\`

With 1 million items:
- Linear search: Up to 1,000,000 comparisons
- Binary search: Only 20 comparisons!

**That's 50,000x faster!**

## Scalability: The Hidden Danger

Code that works fine today might fail tomorrow:

| Items | Fast Algorithm | Slow Algorithm |
|-------|---------------|----------------|
| 100 | 0.001 sec | 0.01 sec |
| 1,000 | 0.01 sec | 1 sec |
| 10,000 | 0.1 sec | 100 sec |
| 100,000 | 1 sec | 3 hours |
| 1,000,000 | 10 sec | 12 days |

The slow algorithm works fine at small scale but becomes **impossible** at large scale.

## Why This Matters to You

1. **User Experience**: Users won't wait for slow code
2. **Resource Costs**: Slow code uses more CPU/memory
3. **Technical Interviews**: "What's the complexity?" is asked constantly
4. **Career Growth**: Senior developers optimize, juniors just make it work`,
      codeExamples: JSON.stringify([
        {
          id: "dramatic-difference",
          title: "Dramatic Performance Difference",
          code: "import time\n\n# Method 1: Check every pair (slow)\ndef has_duplicate_slow(items):\n    for i in range(len(items)):\n        for j in range(i + 1, len(items)):\n            if items[i] == items[j]:\n                return True\n    return False\n\n# Method 2: Use a set (fast)\ndef has_duplicate_fast(items):\n    seen = set()\n    for item in items:\n        if item in seen:\n            return True\n        seen.add(item)\n    return False\n\n# Test with different sizes\nfor size in [100, 1000, 5000]:\n    items = list(range(size))  # No duplicates (worst case)\n    \n    start = time.time()\n    has_duplicate_slow(items)\n    slow_time = time.time() - start\n    \n    start = time.time()\n    has_duplicate_fast(items)\n    fast_time = time.time() - start\n    \n    ratio = slow_time / fast_time if fast_time > 0 else float('inf')\n    print(f\"Size {size:5}: Slow={slow_time:.4f}s, Fast={fast_time:.6f}s, Ratio={ratio:.0f}x\")",
          description: "Same problem, vastly different speed",
        },
        {
          id: "scalability-demo",
          title: "Scalability Problem",
          code: "import time\n\ndef sum_pairs_slow(n):\n    \"\"\"Count pairs - O(n²) operations.\"\"\"\n    count = 0\n    for i in range(n):\n        for j in range(n):\n            count += 1\n    return count\n\ndef sum_pairs_fast(n):\n    \"\"\"Count pairs - O(1) operation.\"\"\"\n    return n * n  # Same result, calculated directly!\n\n# Watch how slow version scales\nprint(\"Slow algorithm scaling:\")\nfor n in [100, 500, 1000, 2000, 4000]:\n    start = time.time()\n    result = sum_pairs_slow(n)\n    elapsed = time.time() - start\n    print(f\"  n={n:4}: {elapsed:.4f}s\")\n\nprint(\"\\nFast algorithm (all instant):\")\nfor n in [100, 500, 1000, 2000, 4000, 100000, 1000000]:\n    start = time.time()\n    result = sum_pairs_fast(n)\n    elapsed = time.time() - start\n    print(f\"  n={n:7}: {elapsed:.6f}s\")",
          description: "Slow version gets exponentially slower",
        },
        {
          id: "real-world-impact",
          title: "Real-World Impact",
          code: "import time\n\ndef find_max_slow(items):\n    \"\"\"Find max by checking all pairs.\"\"\"\n    if not items:\n        return None\n    max_val = items[0]\n    for i in items:\n        is_max = True\n        for j in items:\n            if j > i:\n                is_max = False\n                break\n        if is_max:\n            return i\n    return max_val\n\ndef find_max_fast(items):\n    \"\"\"Find max in single pass.\"\"\"\n    if not items:\n        return None\n    max_val = items[0]\n    for item in items:\n        if item > max_val:\n            max_val = item\n    return max_val\n\n# Both give correct answer!\nitems = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]\nprint(f\"Slow result: {find_max_slow(items)}\")\nprint(f\"Fast result: {find_max_fast(items)}\")\nprint(\"Both correct!\\n\")\n\n# But performance differs dramatically\nitems = list(range(2000))\n\nstart = time.time()\nfind_max_slow(items)\nslow = time.time() - start\n\nstart = time.time()\nfind_max_fast(items)\nfast = time.time() - start\n\nprint(f\"With 2000 items:\")\nprint(f\"  Slow: {slow:.4f}s\")\nprint(f\"  Fast: {fast:.6f}s\")\nprint(f\"  Ratio: {slow/fast:.0f}x faster!\")",
          description: "Correct doesn't mean efficient",
        },
        {
          id: "growth-rates",
          title: "Understanding Growth Rates",
          code: "# Simulate operation counts at different scales\ndef operation_counts(n):\n    return {\n        'constant O(1)': 1,\n        'logarithmic O(log n)': int(n.bit_length()),\n        'linear O(n)': n,\n        'n log n O(n log n)': int(n * n.bit_length()),\n        'quadratic O(n²)': n * n,\n        'cubic O(n³)': n * n * n,\n    }\n\nprint(\"Operations needed at different scales:\")\nprint(f\"{'Algorithm':<20} {'n=10':>10} {'n=100':>10} {'n=1000':>12} {'n=10000':>14}\")\nprint(\"-\" * 70)\n\nfor name in ['constant O(1)', 'logarithmic O(log n)', 'linear O(n)', \n             'n log n O(n log n)', 'quadratic O(n²)']:\n    counts = [operation_counts(n)[name] for n in [10, 100, 1000, 10000]]\n    print(f\"{name:<20} {counts[0]:>10,} {counts[1]:>10,} {counts[2]:>12,} {counts[3]:>14,}\")\n\nprint(\"\\nNotice: Quadratic grows MUCH faster than linear!\")",
          description: "How different algorithms scale",
        },
      ]),
      keyPoints: [
        "Correct code isn't necessarily good code",
        "Performance can differ by factors of 1000x+",
        "Small data hides scalability problems",
        "Algorithm choice matters more as data grows",
        "Understanding complexity is essential for interviews",
        "Fast algorithms enable better user experiences",
        "Slow code costs real money (compute resources)",
        "This chapter teaches you to analyze and compare",
      ],
      hardwareDemo: "Run slow vs fast algorithms. Watch operation counts grow at different rates.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson9_1_1.number}: ${lesson9_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson9_1_1.id,
        number: 1,
        title: "Predict the Faster",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "Which is faster for finding a name in 1 million sorted names?",
        starterCode: "# A: Check each name one by one\n# B: Binary search (check middle, eliminate half each time)",
        solution: "B: Binary search - only ~20 checks vs up to 1,000,000",
        testCases: JSON.stringify([
          { input: "B", expectedOutput: "true", description: "Correct!" },
          { input: "A", expectedOutput: "false", description: "Linear search checks each one" },
        ]),
        hints: ["Binary search eliminates half each time", "log₂(1,000,000) ≈ 20"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson9_1_1.id,
        number: 2,
        title: "Count Operations",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Count how many comparisons each function makes.",
        starterCode: "def search_a(items, target):\n    count = 0\n    for item in items:\n        count += 1\n        if item == target:\n            return count\n    return count\n\ndef search_b(items, target):\n    count = 0\n    for i, item in enumerate(items):\n        for j, other in enumerate(items):\n            count += 1\n    return count\n\nitems = list(range(10))\nprint(f\"search_a comparisons: {search_a(items, 5)}\")\nprint(f\"search_b comparisons: {search_b(items, 5)}\")",
        solution: "def search_a(items, target):\n    count = 0\n    for item in items:\n        count += 1\n        if item == target:\n            return count\n    return count\n\ndef search_b(items, target):\n    count = 0\n    for i, item in enumerate(items):\n        for j, other in enumerate(items):\n            count += 1\n    return count\n\nitems = list(range(10))\nprint(f\"search_a comparisons: {search_a(items, 5)}\")\nprint(f\"search_b comparisons: {search_b(items, 5)}\")\nprint(f\"\\nsearch_a: {search_a(items, 5)} (linear)\")\nprint(f\"search_b: {search_b(items, 5)} (quadratic: 10×10=100)\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "6 vs 100 comparisons", description: "Counted operations" }]),
        hints: ["search_a: one loop", "search_b: nested loops"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson9_1_1.id,
        number: 3,
        title: "Time Comparison",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Time both functions and compute the ratio.",
        starterCode: "import time\n\ndef slow_sum(n):\n    total = 0\n    for i in range(n):\n        for j in range(n):\n            total += 1\n    return total\n\ndef fast_sum(n):\n    return n * n\n\nn = 1000\n# Time slow_sum\n# Time fast_sum\n# Print both times and the ratio",
        solution: "import time\n\ndef slow_sum(n):\n    total = 0\n    for i in range(n):\n        for j in range(n):\n            total += 1\n    return total\n\ndef fast_sum(n):\n    return n * n\n\nn = 1000\n\nstart = time.time()\nresult1 = slow_sum(n)\nslow_time = time.time() - start\n\nstart = time.time()\nresult2 = fast_sum(n)\nfast_time = time.time() - start\n\nprint(f\"Slow: {slow_time:.4f}s, result={result1}\")\nprint(f\"Fast: {fast_time:.6f}s, result={result2}\")\nprint(f\"Same result: {result1 == result2}\")\nprint(f\"Ratio: {slow_time/fast_time:.0f}x faster\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Ratio shows huge difference", description: "Timing measured" }]),
        hints: ["Use time.time() before and after", "Divide slow by fast for ratio"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson9_1_1.id,
        number: 4,
        title: "Scalability Test",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show how a nested loop's time grows as n increases.",
        starterCode: "import time\n\ndef nested_work(n):\n    count = 0\n    for i in range(n):\n        for j in range(n):\n            count += 1\n    return count\n\n# Test with n = 100, 200, 400, 800\n# Show how time grows (should roughly 4x each time)",
        solution: "import time\n\ndef nested_work(n):\n    count = 0\n    for i in range(n):\n        for j in range(n):\n            count += 1\n    return count\n\nprint(\"Scalability test (n² growth):\")\nprev_time = None\nfor n in [100, 200, 400, 800]:\n    start = time.time()\n    nested_work(n)\n    elapsed = time.time() - start\n    \n    if prev_time:\n        ratio = elapsed / prev_time\n        print(f\"n={n:4}: {elapsed:.4f}s (grew {ratio:.1f}x)\")\n    else:\n        print(f\"n={n:4}: {elapsed:.4f}s\")\n    prev_time = elapsed\n\nprint(\"\\nNotice: Doubling n roughly quadruples the time!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Time roughly 4x each doubling", description: "Quadratic growth shown" }]),
        hints: ["When n doubles, n² quadruples", "Track ratio between runs"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson9_1_1.id,
        number: 5,
        title: "Choose the Algorithm",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Given two search functions, determine which to use for large data.",
        starterCode: "import time\n\ndef search_linear(items, target):\n    \"\"\"Check each item.\"\"\"\n    for item in items:\n        if item == target:\n            return True\n    return False\n\ndef search_set(items, target):\n    \"\"\"Convert to set, then check.\"\"\"\n    item_set = set(items)\n    return target in item_set\n\n# Test with small data (100 items)\n# Test with large data (100000 items)\n# Which is better for each case?",
        solution: "import time\n\ndef search_linear(items, target):\n    for item in items:\n        if item == target:\n            return True\n    return False\n\ndef search_set(items, target):\n    item_set = set(items)\n    return target in item_set\n\nprint(\"Small data (100 items):\")\nitems_small = list(range(100))\n\nstart = time.time()\nfor _ in range(1000):  # Multiple searches\n    search_linear(items_small, 99)\nlinear_time = time.time() - start\n\nstart = time.time()\nfor _ in range(1000):\n    search_set(items_small, 99)\nset_time = time.time() - start\n\nprint(f\"  Linear: {linear_time:.4f}s\")\nprint(f\"  Set: {set_time:.4f}s\")\n\nprint(\"\\nLarge data (100000 items):\")\nitems_large = list(range(100000))\n\nstart = time.time()\nfor _ in range(100):\n    search_linear(items_large, 99999)\nlinear_time = time.time() - start\n\nstart = time.time()\nfor _ in range(100):\n    search_set(items_large, 99999)\nset_time = time.time() - start\n\nprint(f\"  Linear: {linear_time:.4f}s\")\nprint(f\"  Set: {set_time:.4f}s\")\nprint(\"\\nConclusion: Set conversion has overhead but wins at scale!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Set wins at large scale", description: "Algorithm choice matters" }]),
        hints: ["Set has O(n) creation but O(1) lookup", "Linear is O(n) each time"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 9.1.1`);

  // ==================== LESSON 9.1.2 ====================
  const lesson9_1_2 = await prisma.lesson.upsert({
    where: { slug: "measuring-efficiency" },
    update: {},
    create: {
      sectionId: section9_1.id,
      number: 9.12,
      title: "Measuring Algorithm Efficiency",
      slug: "measuring-efficiency",
      objectives: [
        "Count operations instead of timing",
        "Understand why timing is unreliable",
        "Focus on growth rate, not exact counts",
        "Identify the dominant term",
      ],
      content: `# Measuring Algorithm Efficiency

## Why Not Just Time It?

Timing is unreliable because it depends on:
- Computer speed
- Other running programs
- Programming language
- Input data specifics

We need a **machine-independent** measure!

## Counting Operations

Instead of timing, count the **fundamental operations**:

\`\`\`python
def find_max(items):
    max_val = items[0]      # 1 operation
    for item in items:      # n iterations
        if item > max_val:  # 1 comparison per iteration
            max_val = item  # sometimes 1 assignment
    return max_val          # 1 operation
\`\`\`

Total: Approximately **n** comparisons (the dominant cost).

## Focus on Growth Rate

We care about **how operations grow with input size**:

| n | n operations | n² operations |
|---|--------------|---------------|
| 10 | 10 | 100 |
| 100 | 100 | 10,000 |
| 1000 | 1,000 | 1,000,000 |

The **growth rate** tells us how the algorithm scales.

## The Dominant Term

When counting operations, the **largest term dominates**:

\`\`\`
f(n) = n² + 5n + 100
\`\`\`

For large n:
- n=10: 100 + 50 + 100 = 250 (n² is 40%)
- n=100: 10000 + 500 + 100 = 10600 (n² is 94%)
- n=1000: 1000000 + 5000 + 100 = 1005100 (n² is 99.5%)

As n grows, **n² dominates**. We ignore the rest!

## Constants Don't Matter (Much)

\`\`\`
2n vs 100n
\`\`\`

Both grow **linearly**. At large scale, the difference between 2n and 100n is tiny compared to n² vs n.`,
      codeExamples: JSON.stringify([
        {
          id: "counting-operations",
          title: "Counting Operations",
          code: "def find_max_counted(items):\n    \"\"\"Find max while counting operations.\"\"\"\n    operations = 0\n    \n    max_val = items[0]\n    operations += 1  # assignment\n    \n    for item in items:\n        operations += 1  # comparison\n        if item > max_val:\n            max_val = item\n            operations += 1  # assignment\n    \n    return max_val, operations\n\n# Test with different sizes\nfor size in [10, 100, 1000]:\n    items = list(range(size))\n    result, ops = find_max_counted(items)\n    print(f\"n={size:4}: {ops} operations (roughly n={size})\")\n\nprint(\"\\nOperations grow linearly with input size!\")",
          description: "Counting operations explicitly",
        },
        {
          id: "dominant-term",
          title: "Finding the Dominant Term",
          code: "def calculate_terms(n):\n    \"\"\"Show how different terms contribute.\"\"\"\n    constant = 100\n    linear = 5 * n\n    quadratic = n * n\n    total = quadratic + linear + constant\n    \n    return {\n        'constant': constant,\n        'linear': linear,\n        'quadratic': quadratic,\n        'total': total,\n        'quadratic_pct': (quadratic / total) * 100\n    }\n\nprint(\"How n² dominates as n grows:\")\nprint(f\"{'n':>6} {'constant':>10} {'linear':>10} {'quadratic':>12} {'total':>12} {'n² %':>8}\")\nprint(\"-\" * 60)\n\nfor n in [10, 50, 100, 500, 1000]:\n    terms = calculate_terms(n)\n    print(f\"{n:>6} {terms['constant']:>10} {terms['linear']:>10} \"\n          f\"{terms['quadratic']:>12,} {terms['total']:>12,} {terms['quadratic_pct']:>7.1f}%\")\n\nprint(\"\\nAs n grows, n² becomes nearly 100% of the total!\")",
          description: "Largest term dominates",
        },
        {
          id: "constants-matter-less",
          title: "Constants Matter Less at Scale",
          code: "import time\n\ndef fast_linear(items):\n    \"\"\"Does n operations.\"\"\"\n    total = 0\n    for item in items:\n        total += item\n    return total\n\ndef slow_linear(items):\n    \"\"\"Does 10n operations (10x more work per item).\"\"\"\n    total = 0\n    for item in items:\n        for _ in range(10):  # 10x more work\n            total += item // 10\n    return total\n\ndef quadratic(items):\n    \"\"\"Does n² operations.\"\"\"\n    total = 0\n    for i in items:\n        for j in items:\n            total += 1\n    return total\n\n# Compare at different scales\nprint(\"Comparing: fast_linear (n), slow_linear (10n), quadratic (n²)\")\nprint(f\"{'n':>6} {'fast':>10} {'slow(10x)':>10} {'quadratic':>12}\")\nprint(\"-\" * 45)\n\nfor n in [100, 500, 1000]:\n    items = list(range(n))\n    \n    start = time.time()\n    fast_linear(items)\n    fast = time.time() - start\n    \n    start = time.time()\n    slow_linear(items)\n    slow = time.time() - start\n    \n    start = time.time()\n    quadratic(items)\n    quad = time.time() - start\n    \n    print(f\"{n:>6} {fast:>10.5f} {slow:>10.5f} {quad:>12.5f}\")\n\nprint(\"\\n10x constant difference is NOTHING compared to n² growth!\")",
          description: "Growth rate matters more than constants",
        },
        {
          id: "timing-unreliable",
          title: "Why Timing is Unreliable",
          code: "import time\n\ndef simple_work(n):\n    total = 0\n    for i in range(n):\n        total += i\n    return total\n\n# Run the same code multiple times\nn = 100000\ntimes = []\n\nprint(\"Running same code 10 times:\")\nfor run in range(10):\n    start = time.time()\n    simple_work(n)\n    elapsed = time.time() - start\n    times.append(elapsed)\n    print(f\"  Run {run+1}: {elapsed:.6f}s\")\n\nprint(f\"\\nMin: {min(times):.6f}s\")\nprint(f\"Max: {max(times):.6f}s\")\nprint(f\"Variation: {(max(times)/min(times) - 1) * 100:.1f}%\")\nprint(\"\\nTiming varies! That's why we count operations instead.\")",
          description: "Same code, different times",
        },
      ]),
      keyPoints: [
        "Timing depends on hardware and environment",
        "Counting operations is machine-independent",
        "Focus on growth rate, not exact counts",
        "The largest term dominates as n grows",
        "Constants become irrelevant at scale",
        "n² grows much faster than n",
        "We simplify to the dominant term",
        "This leads to Big O notation",
      ],
      hardwareDemo: "Count operations visually. Show how dominant term takes over at large n.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson9_1_2.number}: ${lesson9_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson9_1_2.id,
        number: 1,
        title: "Count Loop Operations",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add operation counting to this function.",
        starterCode: "def sum_list(items):\n    total = 0\n    for item in items:\n        total += item\n    return total\n\n# Modify to also return operation count\n# Test with different sizes",
        solution: "def sum_list(items):\n    operations = 0\n    total = 0\n    operations += 1  # initialization\n    \n    for item in items:\n        total += item\n        operations += 1  # addition\n    \n    return total, operations\n\nfor n in [10, 100, 1000]:\n    items = list(range(n))\n    result, ops = sum_list(items)\n    print(f\"n={n:4}: {ops} operations\")\n\nprint(\"\\nOperations ≈ n (linear growth)\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Operations grow with n", description: "Counting works" }]),
        hints: ["Add operations counter", "Increment for each operation"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson9_1_2.id,
        number: 2,
        title: "Identify Dominant Term",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "For f(n) = 3n² + 100n + 500, what's the dominant term as n → ∞?",
        starterCode: "",
        solution: "n² - it grows fastest",
        testCases: JSON.stringify([
          { input: "n²", expectedOutput: "true", description: "Correct!" },
          { input: "100n", expectedOutput: "false", description: "Linear grows slower than quadratic" },
          { input: "500", expectedOutput: "false", description: "Constant doesn't grow at all" },
        ]),
        hints: ["Which term grows fastest?", "Compare 3×1000² vs 100×1000"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson9_1_2.id,
        number: 3,
        title: "Calculate Growth",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate and compare n, n², and n³ for different values of n.",
        starterCode: "def compare_growth(n):\n    # Return n, n², n³\n    pass\n\n# Print table for n = 10, 50, 100\nprint(f\"{'n':>5} {'n':>10} {'n²':>12} {'n³':>15}\")\nfor n in [10, 50, 100]:\n    # Print the values",
        solution: "def compare_growth(n):\n    return n, n**2, n**3\n\nprint(f\"{'n':>5} {'n':>10} {'n²':>12} {'n³':>15}\")\nprint(\"-\" * 45)\nfor n in [10, 50, 100]:\n    linear, quad, cubic = compare_growth(n)\n    print(f\"{n:>5} {linear:>10,} {quad:>12,} {cubic:>15,}\")\n\nprint(\"\\nNotice: n³ grows MUCH faster than n²!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Growth comparison table", description: "Growth shown" }]),
        hints: ["n**2 for squared", "Use :, for comma formatting"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson9_1_2.id,
        number: 4,
        title: "Dominant Term Percentage",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show what percentage each term contributes to total.",
        starterCode: "def analyze_terms(n):\n    \"\"\"For f(n) = n² + 10n + 50\"\"\"\n    quadratic = n * n\n    linear = 10 * n\n    constant = 50\n    total = quadratic + linear + constant\n    \n    # Calculate percentages\n    # Return dict with term values and percentages\n\nfor n in [10, 100, 1000]:\n    result = analyze_terms(n)\n    # Print percentages",
        solution: "def analyze_terms(n):\n    quadratic = n * n\n    linear = 10 * n\n    constant = 50\n    total = quadratic + linear + constant\n    \n    return {\n        'total': total,\n        'quad_pct': (quadratic / total) * 100,\n        'linear_pct': (linear / total) * 100,\n        'const_pct': (constant / total) * 100,\n    }\n\nprint(f\"{'n':>6} {'n² %':>10} {'10n %':>10} {'50 %':>10}\")\nprint(\"-\" * 40)\nfor n in [10, 100, 1000]:\n    r = analyze_terms(n)\n    print(f\"{n:>6} {r['quad_pct']:>9.1f}% {r['linear_pct']:>9.1f}% {r['const_pct']:>9.1f}%\")\n\nprint(\"\\nn² dominates as n grows!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "n² approaches 100%", description: "Percentages shown" }]),
        hints: ["Divide each term by total", "Multiply by 100 for percentage"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson9_1_2.id,
        number: 5,
        title: "Compare Algorithms",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Compare two algorithms by counting operations, not timing.",
        starterCode: "def algo_a(n):\n    \"\"\"Count operations.\"\"\"\n    ops = 0\n    for i in range(n):\n        ops += 1\n    return ops\n\ndef algo_b(n):\n    \"\"\"Count operations.\"\"\"\n    ops = 0\n    for i in range(n):\n        for j in range(n):\n            ops += 1\n    return ops\n\n# Compare at n = 10, 100, 1000\n# Which is better? By how much?",
        solution: "def algo_a(n):\n    ops = 0\n    for i in range(n):\n        ops += 1\n    return ops\n\ndef algo_b(n):\n    ops = 0\n    for i in range(n):\n        for j in range(n):\n            ops += 1\n    return ops\n\nprint(f\"{'n':>6} {'Algo A':>10} {'Algo B':>12} {'B/A ratio':>12}\")\nprint(\"-\" * 45)\n\nfor n in [10, 100, 1000]:\n    a_ops = algo_a(n)\n    b_ops = algo_b(n)\n    ratio = b_ops / a_ops\n    print(f\"{n:>6} {a_ops:>10,} {b_ops:>12,} {ratio:>12.0f}x\")\n\nprint(\"\\nAlgo A is O(n), Algo B is O(n²)\")\nprint(\"The ratio equals n because n²/n = n\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Ratio grows with n", description: "Comparison complete" }]),
        hints: ["A does n operations", "B does n² operations", "Ratio = n²/n = n"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 9.1.2`);

  console.log("\n✅ Chapter 9 Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
