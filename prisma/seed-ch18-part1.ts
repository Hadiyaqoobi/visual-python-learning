import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 1: Chapter 18 structure + Lessons 18.1.1-18.1.2...\n");

  const chapter18 = await prisma.chapter.upsert({
    where: { number: 18 },
    update: {},
    create: {
      number: 18,
      title: "Dynamic Programming",
      description: "Master dynamic programming, one of the most powerful algorithm design techniques. Learn to transform exponential-time problems into polynomial-time solutions through memoization and tabulation.",
      objectives: [
        "Understand optimal substructure and overlapping subproblems",
        "Implement memoization (top-down DP)",
        "Implement tabulation (bottom-up DP)",
        "Solve classic DP problems (knapsack, LCS)",
        "Analyze and compare DP approaches",
      ],
      isPublished: true,
    },
  });
  console.log(`✅ Chapter ${chapter18.number}: ${chapter18.title}`);

  const section18_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter18.id, number: 18.1 } },
    update: {},
    create: {
      chapterId: chapter18.id,
      number: 18.1,
      title: "Introduction to Dynamic Programming",
      description: "Learn the core concepts of DP through the Fibonacci example.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section18_1.number}: ${section18_1.title}`);

  const section18_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter18.id, number: 18.2 } },
    update: {},
    create: {
      chapterId: chapter18.id,
      number: 18.2,
      title: "Classic DP Problems",
      description: "Apply DP to solve knapsack, LCS, and other classic problems.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section18_2.number}: ${section18_2.title}`);

  const lesson18_1_1 = await prisma.lesson.upsert({
    where: { slug: "intro-dynamic-programming" },
    update: {},
    create: {
      sectionId: section18_1.id,
      number: 18.11,
      title: "Introduction to Dynamic Programming",
      slug: "intro-dynamic-programming",
      objectives: [
        "Understand what dynamic programming is",
        "Identify optimal substructure",
        "Recognize overlapping subproblems",
        "See the connection to recursion",
      ],
      content: `# Introduction to Dynamic Programming

## What is Dynamic Programming?

Dynamic Programming (DP) is an optimization technique that:
1. Breaks a problem into **overlapping subproblems**
2. Solves each subproblem **once**
3. **Stores** results to avoid recomputation

**Result**: Exponential time → Polynomial time!

## Two Key Properties

### 1. Optimal Substructure
The optimal solution contains optimal solutions to subproblems.

Example: Shortest path A→C = (shortest A→B) + (shortest B→C)

### 2. Overlapping Subproblems
Same subproblems are solved multiple times.

Example: Computing fib(5) requires fib(4) AND fib(3), but fib(4) also requires fib(3)!

## DP vs Divide-and-Conquer

| Divide & Conquer | Dynamic Programming |
|------------------|---------------------|
| Subproblems independent | Subproblems overlap |
| No storage needed | Must store results |
| Example: Merge Sort | Example: Fibonacci |

## The Magic Formula

\`\`\`
DP = Recursion + Memoization
\`\`\`

Same recursive thinking, but **remember** what you've computed!`,
      codeExamples: JSON.stringify([
        {
          id: "exponential-problem",
          title: "The Problem: Exponential Time",
          code: "import time\n\ndef fib_naive(n):\n    \"\"\"Naive recursive Fibonacci - SLOW!\"\"\"\n    if n <= 1:\n        return n\n    return fib_naive(n-1) + fib_naive(n-2)\n\nprint('Naive Fibonacci (exponential time):')\nfor n in [10, 20, 30, 35]:\n    start = time.time()\n    result = fib_naive(n)\n    elapsed = time.time() - start\n    print(f'  fib({n}) = {result}, time: {elapsed:.3f}s')\n    if elapsed > 2:\n        print('  (Getting slow! Stopping here.)')\n        break",
          description: "Naive recursion is exponentially slow",
        },
        {
          id: "dp-solution",
          title: "The Solution: Dynamic Programming",
          code: "import time\n\ndef fib_dp(n, memo={}):\n    \"\"\"DP Fibonacci with memoization - FAST!\"\"\"\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fib_dp(n-1, memo) + fib_dp(n-2, memo)\n    return memo[n]\n\nprint('DP Fibonacci (polynomial time):')\nfor n in [10, 20, 30, 50, 100]:\n    start = time.time()\n    result = fib_dp(n)\n    elapsed = time.time() - start\n    print(f'  fib({n}) = {result}, time: {elapsed:.6f}s')\n\nprint('\\nInstant! Even fib(100) is fast.')",
          description: "DP makes it lightning fast",
        },
        {
          id: "counting-calls",
          title: "Visualizing the Difference",
          code: "call_count = 0\n\ndef fib_count(n):\n    global call_count\n    call_count += 1\n    if n <= 1:\n        return n\n    return fib_count(n-1) + fib_count(n-2)\n\ndef fib_dp_count(n, memo=None):\n    global call_count\n    if memo is None:\n        memo = {}\n    call_count += 1\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fib_dp_count(n-1, memo) + fib_dp_count(n-2, memo)\n    return memo[n]\n\nprint('Function calls comparison:')\nfor n in [10, 15, 20]:\n    call_count = 0\n    fib_count(n)\n    naive_calls = call_count\n    \n    call_count = 0\n    fib_dp_count(n)\n    dp_calls = call_count\n    \n    print(f'  n={n}: Naive={naive_calls:,} calls, DP={dp_calls} calls')",
          description: "Count function calls to see the difference",
        },
      ]),
      keyPoints: [
        "DP = Recursion + Memoization",
        "Optimal substructure: optimal solution uses optimal sub-solutions",
        "Overlapping subproblems: same subproblems solved repeatedly",
        "Memoization: store results to avoid recomputation",
        "Transforms exponential O(2ⁿ) to polynomial O(n)",
        "Key technique for optimization problems",
      ],
      hardwareDemo: "Watch call stack grow exponentially without DP. See cache hits with memoization.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson18_1_1.number}: ${lesson18_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson18_1_1.id,
        number: 1,
        title: "Identify Overlapping Subproblems",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Draw the recursion tree for fib(5). Identify which subproblems are computed multiple times.",
        starterCode: "def fib_trace(n, depth=0):\n    indent = '  ' * depth\n    print(f'{indent}fib({n})')\n    if n <= 1:\n        return n\n    return fib_trace(n-1, depth+1) + fib_trace(n-2, depth+1)\n\nprint('Recursion tree for fib(5):')\nprint('(Watch for repeated calls!)\\n')\nresult = fib_trace(5)\nprint(f'\\nResult: {result}')",
        solution: "def fib_trace(n, depth=0):\n    indent = '  ' * depth\n    print(f'{indent}fib({n})')\n    if n <= 1:\n        return n\n    return fib_trace(n-1, depth+1) + fib_trace(n-2, depth+1)\n\nprint('Recursion tree for fib(5):')\nprint('(Watch for repeated calls!)\\n')\nresult = fib_trace(5)\nprint(f'\\nResult: {result}')\nprint('\\nfib(3) computed 2 times!')\nprint('fib(2) computed 3 times!')\nprint('fib(1) computed 5 times!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Repeated calls visible", description: "Overlapping subproblems shown" }]),
        hints: ["fib(5) calls fib(4) and fib(3)", "fib(4) also calls fib(3)", "Same work done multiple times!"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson18_1_1.id,
        number: 2,
        title: "Count Redundant Calls",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Count how many times each fib(k) is called when computing fib(10).",
        starterCode: "from collections import defaultdict\n\ncall_counts = defaultdict(int)\n\ndef fib_count(n):\n    call_counts[n] += 1\n    if n <= 1:\n        return n\n    return fib_count(n-1) + fib_count(n-2)\n\nfib_count(10)\n\nprint('Call counts for fib(10):')\nfor k in sorted(call_counts.keys()):\n    print(f'  fib({k}): {call_counts[k]} times')\n\nprint(f'\\nTotal calls: {sum(call_counts.values())}')",
        solution: "from collections import defaultdict\n\ncall_counts = defaultdict(int)\n\ndef fib_count(n):\n    call_counts[n] += 1\n    if n <= 1:\n        return n\n    return fib_count(n-1) + fib_count(n-2)\n\nfib_count(10)\n\nprint('Call counts for fib(10):')\nfor k in sorted(call_counts.keys()):\n    print(f'  fib({k}): {call_counts[k]} times')\n\nprint(f'\\nTotal calls: {sum(call_counts.values())}')\nprint('\\nSmaller subproblems called WAY more often!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Call counts shown", description: "Redundancy quantified" }]),
        hints: ["Use defaultdict to count", "Smaller n values called more", "Total calls ~177 for fib(10)"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson18_1_1.id,
        number: 3,
        title: "Time Complexity Comparison",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Time naive vs DP Fibonacci for n=25, 30, 35. Show the dramatic difference.",
        starterCode: "import time\n\ndef fib_naive(n):\n    if n <= 1:\n        return n\n    return fib_naive(n-1) + fib_naive(n-2)\n\ndef fib_dp(n, memo={}):\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fib_dp(n-1, memo) + fib_dp(n-2, memo)\n    return memo[n]\n\nprint('n      Naive Time    DP Time')\nfor n in [25, 30, 35]:\n    # Time naive\n    start = time.time()\n    fib_naive(n)\n    naive_time = time.time() - start\n    \n    # Time DP (clear memo for fair comparison)\n    fib_dp.memo = {}\n    start = time.time()\n    fib_dp(n, {})\n    dp_time = time.time() - start\n    \n    print(f'{n}     {naive_time:.4f}s       {dp_time:.6f}s')",
        solution: "import time\n\ndef fib_naive(n):\n    if n <= 1:\n        return n\n    return fib_naive(n-1) + fib_naive(n-2)\n\ndef fib_dp(n, memo={}):\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fib_dp(n-1, memo) + fib_dp(n-2, memo)\n    return memo[n]\n\nprint('n      Naive Time    DP Time')\nfor n in [25, 30, 35]:\n    start = time.time()\n    fib_naive(n)\n    naive_time = time.time() - start\n    \n    start = time.time()\n    fib_dp(n, {})\n    dp_time = time.time() - start\n    \n    print(f'{n}     {naive_time:.4f}s       {dp_time:.6f}s')\n\nprint('\\nDP is millions of times faster!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Dramatic time difference", description: "DP speedup shown" }]),
        hints: ["Naive gets very slow around n=35", "DP stays instant", "Each +5 doubles naive time"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson18_1_1.id,
        number: 4,
        title: "Optimal Substructure",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show optimal substructure: shortest path from A to D uses shortest paths to intermediate nodes.",
        starterCode: "# Weighted graph\ngraph = {\n    'A': [('B', 1), ('C', 4)],\n    'B': [('C', 2), ('D', 5)],\n    'C': [('D', 1)],\n    'D': [],\n}\n\n# Optimal paths (precomputed for illustration)\nshortest = {\n    ('A', 'B'): (['A', 'B'], 1),\n    ('A', 'C'): (['A', 'B', 'C'], 3),  # Via B, not direct!\n    ('A', 'D'): (['A', 'B', 'C', 'D'], 4),\n    ('B', 'C'): (['B', 'C'], 2),\n    ('B', 'D'): (['B', 'C', 'D'], 3),\n    ('C', 'D'): (['C', 'D'], 1),\n}\n\nprint('Optimal Substructure Example:')\nprint('\\nShortest A→D uses optimal sub-paths:')\n\npath_ad, cost_ad = shortest[('A', 'D')]\nprint(f'  A→D: {\" → \".join(path_ad)} (cost {cost_ad})')\n\npath_ac, cost_ac = shortest[('A', 'C')]\nprint(f'  A→C: {\" → \".join(path_ac)} (cost {cost_ac})')\n\npath_cd, cost_cd = shortest[('C', 'D')]\nprint(f'  C→D: {\" → \".join(path_cd)} (cost {cost_cd})')\n\nprint(f'\\nOptimal A→D = Optimal A→C + Optimal C→D')\nprint(f'  {cost_ad} = {cost_ac} + {cost_cd}')",
        solution: "graph = {\n    'A': [('B', 1), ('C', 4)],\n    'B': [('C', 2), ('D', 5)],\n    'C': [('D', 1)],\n    'D': [],\n}\n\nshortest = {\n    ('A', 'B'): (['A', 'B'], 1),\n    ('A', 'C'): (['A', 'B', 'C'], 3),\n    ('A', 'D'): (['A', 'B', 'C', 'D'], 4),\n    ('B', 'C'): (['B', 'C'], 2),\n    ('B', 'D'): (['B', 'C', 'D'], 3),\n    ('C', 'D'): (['C', 'D'], 1),\n}\n\nprint('Optimal Substructure Example:')\nprint('\\nShortest A→D uses optimal sub-paths:')\n\npath_ad, cost_ad = shortest[('A', 'D')]\nprint(f'  A→D: {\" → \".join(path_ad)} (cost {cost_ad})')\n\npath_ac, cost_ac = shortest[('A', 'C')]\nprint(f'  A→C: {\" → \".join(path_ac)} (cost {cost_ac})')\n\npath_cd, cost_cd = shortest[('C', 'D')]\nprint(f'  C→D: {\" → \".join(path_cd)} (cost {cost_cd})')\n\nprint(f'\\nOptimal A→D = Optimal A→C + Optimal C→D')\nprint(f'  {cost_ad} = {cost_ac} + {cost_cd}')\nprint('\\nThis is optimal substructure!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Optimal substructure shown", description: "Sub-path optimality" }]),
        hints: ["Shortest A→D goes through optimal sub-paths", "4 = 3 + 1", "Optimal solution contains optimal sub-solutions"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson18_1_1.id,
        number: 5,
        title: "DP vs Divide-and-Conquer",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Compare Fibonacci (overlapping subproblems) with Merge Sort (independent subproblems).",
        starterCode: "# Fibonacci: overlapping subproblems\nfib_subproblems = []\n\ndef fib_track(n):\n    fib_subproblems.append(n)\n    if n <= 1:\n        return n\n    return fib_track(n-1) + fib_track(n-2)\n\nfib_track(6)\nprint('Fibonacci subproblems:')\nprint(f'  All: {fib_subproblems}')\nprint(f'  Unique: {set(fib_subproblems)}')\nprint(f'  Overlapping? {len(fib_subproblems) > len(set(fib_subproblems))}')\n\n# Merge sort: independent subproblems\nmerge_subproblems = []\n\ndef merge_sort_track(arr):\n    merge_subproblems.append(tuple(arr))\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort_track(arr[:mid])\n    right = merge_sort_track(arr[mid:])\n    return sorted(left + right)  # Simplified merge\n\nmerge_sort_track([5, 2, 8, 1, 9, 3])\nprint('\\nMerge Sort subproblems:')\nprint(f'  All: {merge_subproblems}')\nprint(f'  Unique: {set(merge_subproblems)}')\nprint(f'  Overlapping? {len(merge_subproblems) > len(set(merge_subproblems))}')",
        solution: "fib_subproblems = []\n\ndef fib_track(n):\n    fib_subproblems.append(n)\n    if n <= 1:\n        return n\n    return fib_track(n-1) + fib_track(n-2)\n\nfib_track(6)\nprint('Fibonacci subproblems:')\nprint(f'  All: {fib_subproblems}')\nprint(f'  Unique: {set(fib_subproblems)}')\nprint(f'  Overlapping? {len(fib_subproblems) > len(set(fib_subproblems))}')\n\nmerge_subproblems = []\n\ndef merge_sort_track(arr):\n    merge_subproblems.append(tuple(arr))\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort_track(arr[:mid])\n    right = merge_sort_track(arr[mid:])\n    return sorted(left + right)\n\nmerge_sort_track([5, 2, 8, 1, 9, 3])\nprint('\\nMerge Sort subproblems:')\nprint(f'  All: {merge_subproblems}')\nprint(f'  Unique: {set(merge_subproblems)}')\nprint(f'  Overlapping? {len(merge_subproblems) > len(set(merge_subproblems))}')\nprint('\\nFibonacci → Use DP')\nprint('Merge Sort → Divide-and-Conquer (no memoization needed)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Fib overlaps, MergeSort doesn't", description: "D&C vs DP" }]),
        hints: ["Fibonacci has repeats", "Merge sort subarrays are all different", "Overlapping = use DP"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 18.1.1`);

  const lesson18_1_2 = await prisma.lesson.upsert({
    where: { slug: "fibonacci-naive-vs-memoized" },
    update: {},
    create: {
      sectionId: section18_1.id,
      number: 18.12,
      title: "Fibonacci - Naive vs Memoized",
      slug: "fibonacci-naive-vs-memoized",
      objectives: [
        "Implement naive recursive Fibonacci",
        "Analyze exponential time complexity",
        "Add memoization to achieve linear time",
        "Understand cache hit/miss behavior",
      ],
      content: `# Fibonacci: Naive vs Memoized

## The Fibonacci Sequence

0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...

**Recurrence**: fib(n) = fib(n-1) + fib(n-2)
**Base cases**: fib(0) = 0, fib(1) = 1

## Naive Recursive Solution

\`\`\`python
def fib_naive(n):
    if n <= 1:
        return n
    return fib_naive(n-1) + fib_naive(n-2)
\`\`\`

**Time Complexity**: O(2ⁿ) - exponential!
**Why?** Each call spawns 2 more calls.

## The Recursion Tree Problem

\`\`\`
         fib(5)
        /      \\
    fib(4)     fib(3)
    /   \\      /   \\
 fib(3) fib(2) fib(2) fib(1)
  ...
\`\`\`

fib(3) is computed twice, fib(2) three times!

## Memoized Solution

\`\`\`python
def fib_memo(n, cache={}):
    if n in cache:
        return cache[n]
    if n <= 1:
        return n
    cache[n] = fib_memo(n-1, cache) + fib_memo(n-2, cache)
    return cache[n]
\`\`\`

**Time Complexity**: O(n) - linear!
**Why?** Each fib(k) computed only once.`,
      codeExamples: JSON.stringify([
        {
          id: "naive-fibonacci",
          title: "Naive Recursive Fibonacci",
          code: "def fib_naive(n):\n    \"\"\"O(2^n) time complexity\"\"\"\n    if n <= 1:\n        return n\n    return fib_naive(n-1) + fib_naive(n-2)\n\nprint('Naive Fibonacci:')\nfor n in range(15):\n    print(f'  fib({n}) = {fib_naive(n)}')\n\nprint('\\nWorks, but gets slow quickly...')",
          description: "Simple but exponentially slow",
        },
        {
          id: "memoized-fibonacci",
          title: "Memoized Fibonacci",
          code: "def fib_memo(n, cache=None):\n    \"\"\"O(n) time complexity with memoization\"\"\"\n    if cache is None:\n        cache = {}\n    \n    if n in cache:\n        print(f'  Cache HIT: fib({n})')\n        return cache[n]\n    \n    print(f'  Computing fib({n})')\n    if n <= 1:\n        result = n\n    else:\n        result = fib_memo(n-1, cache) + fib_memo(n-2, cache)\n    \n    cache[n] = result\n    return result\n\nprint('Memoized Fibonacci for fib(6):\\n')\nresult = fib_memo(6)\nprint(f'\\nResult: {result}')\nprint('\\nNotice: each value computed ONCE!')",
          description: "Linear time with caching",
        },
        {
          id: "side-by-side",
          title: "Side-by-Side Comparison",
          code: "import time\n\ndef fib_naive(n):\n    if n <= 1:\n        return n\n    return fib_naive(n-1) + fib_naive(n-2)\n\ndef fib_memo(n, cache={}):\n    if n in cache:\n        return cache[n]\n    if n <= 1:\n        return n\n    cache[n] = fib_memo(n-1, cache) + fib_memo(n-2, cache)\n    return cache[n]\n\nprint('Comparison (same results, different times):')\nprint('n      Result       Naive        Memoized')\n\nfor n in [10, 20, 30]:\n    # Naive\n    start = time.time()\n    result_naive = fib_naive(n)\n    time_naive = time.time() - start\n    \n    # Memoized (clear cache)\n    start = time.time()\n    result_memo = fib_memo(n, {})\n    time_memo = time.time() - start\n    \n    print(f'{n:2d}     {result_naive:10d}  {time_naive:.4f}s     {time_memo:.6f}s')",
          description: "Same results, vastly different performance",
        },
      ]),
      keyPoints: [
        "Naive Fibonacci: O(2ⁿ) exponential time",
        "Same subproblems computed over and over",
        "Memoization: store results in cache (dict)",
        "Check cache before computing",
        "Store result after computing",
        "Memoized Fibonacci: O(n) linear time",
      ],
      hardwareDemo: "Watch dictionary cache grow. See cache hits skip computation.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson18_1_2.number}: ${lesson18_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson18_1_2.id,
        number: 1,
        title: "Implement Naive Fibonacci",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Write the naive recursive Fibonacci function. Test with n=0 to 10.",
        starterCode: "def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n\nprint('Fibonacci sequence:')\nfor i in range(11):\n    print(f'  fib({i}) = {fib(i)}')",
        solution: "def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n\nprint('Fibonacci sequence:')\nfor i in range(11):\n    print(f'  fib({i}) = {fib(i)}')\n\nprint('\\n0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Correct Fibonacci values", description: "Naive implementation" }]),
        hints: ["Base cases: fib(0)=0, fib(1)=1", "Recursive: fib(n-1) + fib(n-2)", "Simple but slow for large n"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson18_1_2.id,
        number: 2,
        title: "Add Memoization",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Convert naive Fibonacci to memoized version using a dictionary cache.",
        starterCode: "def fib_memo(n, cache=None):\n    if cache is None:\n        cache = {}\n    \n    # Check cache first\n    if n in cache:\n        return cache[n]\n    \n    # Base cases\n    if n <= 1:\n        return n\n    \n    # Compute and store in cache\n    result = fib_memo(n-1, cache) + fib_memo(n-2, cache)\n    cache[n] = result\n    return result\n\nprint('Memoized Fibonacci:')\nfor i in range(11):\n    print(f'  fib({i}) = {fib_memo(i)}')\n\nprint('\\nNow try large values:')\nprint(f'  fib(50) = {fib_memo(50)}')\nprint(f'  fib(100) = {fib_memo(100)}')",
        solution: "def fib_memo(n, cache=None):\n    if cache is None:\n        cache = {}\n    \n    if n in cache:\n        return cache[n]\n    \n    if n <= 1:\n        return n\n    \n    result = fib_memo(n-1, cache) + fib_memo(n-2, cache)\n    cache[n] = result\n    return result\n\nprint('Memoized Fibonacci:')\nfor i in range(11):\n    print(f'  fib({i}) = {fib_memo(i)}')\n\nprint('\\nNow try large values:')\nprint(f'  fib(50) = {fib_memo(50)}')\nprint(f'  fib(100) = {fib_memo(100)}')\nprint('\\nInstant! Even for fib(100)!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Large fib values computed instantly", description: "Memoization works" }]),
        hints: ["Check cache before computing", "Store result after computing", "Pass cache to recursive calls"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson18_1_2.id,
        number: 3,
        title: "Track Cache Hits",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Modify memoized Fibonacci to count and display cache hits vs computations.",
        starterCode: "hits = 0\ncomputes = 0\n\ndef fib_track(n, cache=None):\n    global hits, computes\n    if cache is None:\n        cache = {}\n    \n    if n in cache:\n        hits += 1\n        return cache[n]\n    \n    computes += 1\n    if n <= 1:\n        result = n\n    else:\n        result = fib_track(n-1, cache) + fib_track(n-2, cache)\n    \n    cache[n] = result\n    return result\n\nresult = fib_track(20)\nprint(f'fib(20) = {result}')\nprint(f'Cache hits: {hits}')\nprint(f'Computations: {computes}')\nprint(f'Total calls: {hits + computes}')",
        solution: "hits = 0\ncomputes = 0\n\ndef fib_track(n, cache=None):\n    global hits, computes\n    if cache is None:\n        cache = {}\n    \n    if n in cache:\n        hits += 1\n        return cache[n]\n    \n    computes += 1\n    if n <= 1:\n        result = n\n    else:\n        result = fib_track(n-1, cache) + fib_track(n-2, cache)\n    \n    cache[n] = result\n    return result\n\nresult = fib_track(20)\nprint(f'fib(20) = {result}')\nprint(f'Cache hits: {hits}')\nprint(f'Computations: {computes}')\nprint(f'Total calls: {hits + computes}')\nprint('\\nOnly 21 unique computations for fib(20)!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "21 computations, 18 hits", description: "Cache efficiency" }]),
        hints: ["Increment hits when cache used", "Increment computes when calculating", "Should see ~n computations"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson18_1_2.id,
        number: 4,
        title: "Using @lru_cache Decorator",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Use Python's built-in @lru_cache decorator for automatic memoization.",
        starterCode: "from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n\nprint('Using @lru_cache decorator:')\nfor i in range(11):\n    print(f'  fib({i}) = {fib(i)}')\n\nprint(f'\\nfib(100) = {fib(100)}')\nprint(f'\\nCache info: {fib.cache_info()}')",
        solution: "from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n\nprint('Using @lru_cache decorator:')\nfor i in range(11):\n    print(f'  fib({i}) = {fib(i)}')\n\nprint(f'\\nfib(100) = {fib(100)}')\nprint(f'\\nCache info: {fib.cache_info()}')\nprint('\\n@lru_cache does memoization automatically!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Cache info shows hits/misses", description: "Built-in memoization" }]),
        hints: ["@lru_cache handles caching", "maxsize=None for unlimited cache", "cache_info() shows statistics"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson18_1_2.id,
        number: 5,
        title: "Compare Call Counts",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Compare total function calls for naive vs memoized for n=15, 20, 25.",
        starterCode: "naive_calls = 0\nmemo_calls = 0\n\ndef fib_naive(n):\n    global naive_calls\n    naive_calls += 1\n    if n <= 1:\n        return n\n    return fib_naive(n-1) + fib_naive(n-2)\n\ndef fib_memo(n, cache=None):\n    global memo_calls\n    memo_calls += 1\n    if cache is None:\n        cache = {}\n    if n in cache:\n        return cache[n]\n    if n <= 1:\n        return n\n    cache[n] = fib_memo(n-1, cache) + fib_memo(n-2, cache)\n    return cache[n]\n\nprint('Call count comparison:')\nprint('n      Naive Calls    Memo Calls    Ratio')\n\nfor n in [15, 20, 25]:\n    naive_calls = 0\n    memo_calls = 0\n    \n    fib_naive(n)\n    fib_memo(n, {})\n    \n    ratio = naive_calls / memo_calls\n    print(f'{n:2d}     {naive_calls:10,}    {memo_calls:10d}    {ratio:.0f}x')",
        solution: "naive_calls = 0\nmemo_calls = 0\n\ndef fib_naive(n):\n    global naive_calls\n    naive_calls += 1\n    if n <= 1:\n        return n\n    return fib_naive(n-1) + fib_naive(n-2)\n\ndef fib_memo(n, cache=None):\n    global memo_calls\n    memo_calls += 1\n    if cache is None:\n        cache = {}\n    if n in cache:\n        return cache[n]\n    if n <= 1:\n        return n\n    cache[n] = fib_memo(n-1, cache) + fib_memo(n-2, cache)\n    return cache[n]\n\nprint('Call count comparison:')\nprint('n      Naive Calls    Memo Calls    Ratio')\n\nfor n in [15, 20, 25]:\n    naive_calls = 0\n    memo_calls = 0\n    \n    fib_naive(n)\n    fib_memo(n, {})\n    \n    ratio = naive_calls / memo_calls\n    print(f'{n:2d}     {naive_calls:10,}    {memo_calls:10d}    {ratio:.0f}x')\n\nprint('\\nMemo is thousands of times more efficient!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Massive ratio difference", description: "Efficiency comparison" }]),
        hints: ["Naive calls grow exponentially", "Memo calls grow linearly (~2n)", "Ratio grows exponentially too"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 18.1.2`);

  console.log("\n✅ Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
