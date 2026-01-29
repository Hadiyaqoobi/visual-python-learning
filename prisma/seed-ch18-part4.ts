import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 4: Lessons 18.2.3-18.2.4 (Tabulation and DP Design)...\n");

  const section18_2 = await prisma.section.findFirst({ where: { number: 18.2 } });
  if (!section18_2) throw new Error("Section 18.2 not found. Run part 1 first.");

  const lesson18_2_3 = await prisma.lesson.upsert({
    where: { slug: "tabulation-vs-memoization" },
    update: {},
    create: {
      sectionId: section18_2.id,
      number: 18.23,
      title: "Tabulation vs Memoization",
      slug: "tabulation-vs-memoization",
      objectives: [
        "Understand top-down vs bottom-up DP",
        "Convert memoized solution to tabulation",
        "Compare space/time tradeoffs",
        "Optimize space with rolling arrays",
      ],
      content: `# Tabulation vs Memoization

## Two DP Approaches

### Memoization (Top-Down)
- Start from the problem, recurse down
- Cache results as you compute
- Only compute needed subproblems

### Tabulation (Bottom-Up)
- Start from base cases, build up
- Fill table iteratively
- Compute all subproblems

## Comparison

| Aspect | Memoization | Tabulation |
|--------|-------------|------------|
| Direction | Top-down | Bottom-up |
| Style | Recursive | Iterative |
| Overhead | Function calls | None |
| Subproblems | Only needed | All |
| Debugging | Harder | Easier |

## Fibonacci Example

**Memoization:**
\`\`\`python
def fib(n, memo={}):
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]
\`\`\`

**Tabulation:**
\`\`\`python
def fib(n):
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
\`\`\`

## Space Optimization

Often you only need previous few values:
\`\`\`python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
\`\`\`

O(n) → O(1) space!`,
      codeExamples: JSON.stringify([
        {
          id: "fib-both-ways",
          title: "Fibonacci: Both Approaches",
          code: "# Memoization (Top-Down)\ndef fib_memo(n, cache=None):\n    if cache is None:\n        cache = {}\n    if n in cache:\n        return cache[n]\n    if n <= 1:\n        return n\n    cache[n] = fib_memo(n-1, cache) + fib_memo(n-2, cache)\n    return cache[n]\n\n# Tabulation (Bottom-Up)\ndef fib_tab(n):\n    if n <= 1:\n        return n\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]\n\n# Space-Optimized\ndef fib_opt(n):\n    if n <= 1:\n        return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b\n\nprint('Fibonacci comparison:')\nfor n in [10, 20, 30]:\n    print(f'  fib({n}): memo={fib_memo(n)}, tab={fib_tab(n)}, opt={fib_opt(n)}')\n\nprint('\\nAll give same results!')",
          description: "Three ways to compute Fibonacci",
        },
        {
          id: "knapsack-tabulation",
          title: "Knapsack: Tabulation",
          code: "def knapsack_tab(weights, values, capacity):\n    n = len(weights)\n    # dp[i][c] = max value with first i items and capacity c\n    dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n    \n    for i in range(1, n + 1):\n        for c in range(capacity + 1):\n            # Skip item i-1\n            dp[i][c] = dp[i-1][c]\n            # Take item i-1 if it fits\n            if weights[i-1] <= c:\n                take = dp[i-1][c - weights[i-1]] + values[i-1]\n                dp[i][c] = max(dp[i][c], take)\n    \n    return dp[n][capacity]\n\nweights = [1, 2, 3]\nvalues = [6, 10, 12]\ncapacity = 5\n\nprint('Knapsack with Tabulation:')\nprint(f'Weights: {weights}')\nprint(f'Values: {values}')\nprint(f'Capacity: {capacity}')\nprint(f'\\nMax value: {knapsack_tab(weights, values, capacity)}')",
          description: "Bottom-up knapsack",
        },
        {
          id: "space-optimization",
          title: "Space Optimization",
          code: "# Full 2D table: O(n × W) space\ndef knapsack_2d(weights, values, capacity):\n    n = len(weights)\n    dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for c in range(capacity + 1):\n            dp[i][c] = dp[i-1][c]\n            if weights[i-1] <= c:\n                dp[i][c] = max(dp[i][c], dp[i-1][c-weights[i-1]] + values[i-1])\n    return dp[n][capacity]\n\n# 1D optimization: O(W) space\ndef knapsack_1d(weights, values, capacity):\n    dp = [0] * (capacity + 1)\n    for i in range(len(weights)):\n        # Traverse backwards to avoid using updated values\n        for c in range(capacity, weights[i] - 1, -1):\n            dp[c] = max(dp[c], dp[c - weights[i]] + values[i])\n    return dp[capacity]\n\nweights = [1, 2, 3]\nvalues = [6, 10, 12]\ncapacity = 5\n\nprint(f'2D approach: {knapsack_2d(weights, values, capacity)}')\nprint(f'1D approach: {knapsack_1d(weights, values, capacity)}')\nprint('\\nSame result, but 1D uses O(W) instead of O(n×W) space!')",
          description: "Reduce space from O(n×W) to O(W)",
        },
      ]),
      keyPoints: [
        "Memoization: top-down, recursive, lazy",
        "Tabulation: bottom-up, iterative, eager",
        "Tabulation avoids recursion overhead",
        "Often can optimize space with rolling array",
        "1D array: traverse backwards to preserve old values",
        "Both have same time complexity",
      ],
      hardwareDemo: "Watch table fill row by row. See space reuse with 1D array.",
      estimatedTime: 30,
      difficulty: "ADVANCED",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson18_2_3.number}: ${lesson18_2_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson18_2_3.id,
        number: 1,
        title: "Fibonacci Tabulation",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Convert memoized Fibonacci to tabulation (iterative with array).",
        starterCode: "def fib_tabulation(n):\n    if n <= 1:\n        return n\n    \n    dp = [0] * (n + 1)\n    dp[0] = 0\n    dp[1] = 1\n    \n    for i in range(2, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    \n    return dp[n]\n\nprint('Fibonacci with Tabulation:')\nfor n in range(11):\n    print(f'  fib({n}) = {fib_tabulation(n)}')",
        solution: "def fib_tabulation(n):\n    if n <= 1:\n        return n\n    \n    dp = [0] * (n + 1)\n    dp[0] = 0\n    dp[1] = 1\n    \n    for i in range(2, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    \n    return dp[n]\n\nprint('Fibonacci with Tabulation:')\nfor n in range(11):\n    print(f'  fib({n}) = {fib_tabulation(n)}')\n\nprint('\\nIterative, no recursion needed!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "0,1,1,2,3,5,8,13,21,34,55", description: "Tabulation works" }]),
        hints: ["Build dp array bottom-up", "dp[0]=0, dp[1]=1", "dp[i] = dp[i-1] + dp[i-2]"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson18_2_3.id,
        number: 2,
        title: "Space-Optimized Fibonacci",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Optimize Fibonacci to use O(1) space instead of O(n).",
        starterCode: "def fib_optimized(n):\n    if n <= 1:\n        return n\n    \n    prev2 = 0  # fib(i-2)\n    prev1 = 1  # fib(i-1)\n    \n    for i in range(2, n + 1):\n        current = prev1 + prev2\n        prev2 = prev1\n        prev1 = current\n    \n    return prev1\n\nprint('Space-Optimized Fibonacci:')\nfor n in [10, 20, 50, 100]:\n    print(f'  fib({n}) = {fib_optimized(n)}')\n\nprint('\\nOnly stores 2 values instead of n!')",
        solution: "def fib_optimized(n):\n    if n <= 1:\n        return n\n    \n    prev2 = 0\n    prev1 = 1\n    \n    for i in range(2, n + 1):\n        current = prev1 + prev2\n        prev2 = prev1\n        prev1 = current\n    \n    return prev1\n\nprint('Space-Optimized Fibonacci:')\nfor n in [10, 20, 50, 100]:\n    print(f'  fib({n}) = {fib_optimized(n)}')\n\nprint('\\nOnly stores 2 values instead of n!')\nprint('O(n) time, O(1) space!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Large fib values computed", description: "O(1) space" }]),
        hints: ["Only need previous 2 values", "Shift: prev2=prev1, prev1=current", "No array needed"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson18_2_3.id,
        number: 3,
        title: "Grid Paths Tabulation",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Convert grid paths from memoization to tabulation.",
        starterCode: "def grid_paths_tab(rows, cols):\n    dp = [[0] * cols for _ in range(rows)]\n    \n    # Base case: first row and column all 1s\n    for i in range(rows):\n        dp[i][0] = 1\n    for j in range(cols):\n        dp[0][j] = 1\n    \n    # Fill table\n    for i in range(1, rows):\n        for j in range(1, cols):\n            dp[i][j] = dp[i-1][j] + dp[i][j-1]\n    \n    return dp[rows-1][cols-1]\n\nprint('Grid Paths with Tabulation:')\nfor r, c in [(2, 2), (3, 3), (4, 4), (5, 5)]:\n    print(f'  {r}x{c} grid: {grid_paths_tab(r, c)} paths')",
        solution: "def grid_paths_tab(rows, cols):\n    dp = [[0] * cols for _ in range(rows)]\n    \n    for i in range(rows):\n        dp[i][0] = 1\n    for j in range(cols):\n        dp[0][j] = 1\n    \n    for i in range(1, rows):\n        for j in range(1, cols):\n            dp[i][j] = dp[i-1][j] + dp[i][j-1]\n    \n    return dp[rows-1][cols-1]\n\nprint('Grid Paths with Tabulation:')\nfor r, c in [(2, 2), (3, 3), (4, 4), (5, 5)]:\n    print(f'  {r}x{c} grid: {grid_paths_tab(r, c)} paths')\n\nprint('\\nNo recursion, just fill 2D table!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "2,6,20,70 paths", description: "Grid tabulation" }]),
        hints: ["First row/col: only 1 way", "Each cell: sum of above + left", "Bottom-right has answer"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson18_2_3.id,
        number: 4,
        title: "Knapsack 1D Optimization",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement knapsack with 1D array instead of 2D. Traverse backwards to preserve values.",
        starterCode: "def knapsack_1d(weights, values, capacity):\n    dp = [0] * (capacity + 1)\n    \n    for i in range(len(weights)):\n        # MUST go backwards to not use same item twice!\n        for c in range(capacity, weights[i] - 1, -1):\n            dp[c] = max(dp[c], dp[c - weights[i]] + values[i])\n    \n    return dp[capacity]\n\nweights = [2, 3, 4, 5]\nvalues = [3, 4, 5, 6]\ncapacity = 8\n\nprint('1D Knapsack:')\nprint(f'Weights: {weights}')\nprint(f'Values: {values}')\nprint(f'Capacity: {capacity}')\nprint(f'\\nMax value: {knapsack_1d(weights, values, capacity)}')\nprint('\\nWhy backwards? Forward would use updated dp[c-w]')\nprint('which means using same item multiple times!')",
        solution: "def knapsack_1d(weights, values, capacity):\n    dp = [0] * (capacity + 1)\n    \n    for i in range(len(weights)):\n        for c in range(capacity, weights[i] - 1, -1):\n            dp[c] = max(dp[c], dp[c - weights[i]] + values[i])\n    \n    return dp[capacity]\n\nweights = [2, 3, 4, 5]\nvalues = [3, 4, 5, 6]\ncapacity = 8\n\nprint('1D Knapsack:')\nprint(f'Weights: {weights}')\nprint(f'Values: {values}')\nprint(f'Capacity: {capacity}')\nprint(f'\\nMax value: {knapsack_1d(weights, values, capacity)}')\nprint('\\nWhy backwards? Forward would use updated dp[c-w]')\nprint('which means using same item multiple times!')\nprint('\\nSpace: O(W) instead of O(n×W)!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Max value computed", description: "1D optimization" }]),
        hints: ["Backwards: range(cap, w-1, -1)", "Prevents reusing same item", "dp[c-w] stays from previous row"],
        xpReward: 25,
        order: 4,
      },
      {
        lessonId: lesson18_2_3.id,
        number: 5,
        title: "Compare All Approaches",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Compare memoization, tabulation, and optimized versions for climbing stairs problem.",
        starterCode: "import time\nimport sys\n\n# Increase recursion limit for memo version\nsys.setrecursionlimit(2000)\n\ndef stairs_memo(n, cache=None):\n    if cache is None:\n        cache = {}\n    if n in cache:\n        return cache[n]\n    if n <= 2:\n        return n\n    cache[n] = stairs_memo(n-1, cache) + stairs_memo(n-2, cache)\n    return cache[n]\n\ndef stairs_tab(n):\n    if n <= 2:\n        return n\n    dp = [0] * (n + 1)\n    dp[1], dp[2] = 1, 2\n    for i in range(3, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]\n\ndef stairs_opt(n):\n    if n <= 2:\n        return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b\n\nn = 1000\n\nprint(f'Climbing {n} stairs:')\n\nstart = time.time()\nresult1 = stairs_memo(n)\ntime1 = time.time() - start\n\nstart = time.time()\nresult2 = stairs_tab(n)\ntime2 = time.time() - start\n\nstart = time.time()\nresult3 = stairs_opt(n)\ntime3 = time.time() - start\n\nprint(f'\\nMemoization: {time1:.6f}s')\nprint(f'Tabulation:  {time2:.6f}s')\nprint(f'Optimized:   {time3:.6f}s')\nprint(f'\\nAll return same result: {result1 == result2 == result3}')\nprint(f'\\nSpace: Memo=O(n), Tab=O(n), Opt=O(1)')",
        solution: "import time\nimport sys\n\nsys.setrecursionlimit(2000)\n\ndef stairs_memo(n, cache=None):\n    if cache is None:\n        cache = {}\n    if n in cache:\n        return cache[n]\n    if n <= 2:\n        return n\n    cache[n] = stairs_memo(n-1, cache) + stairs_memo(n-2, cache)\n    return cache[n]\n\ndef stairs_tab(n):\n    if n <= 2:\n        return n\n    dp = [0] * (n + 1)\n    dp[1], dp[2] = 1, 2\n    for i in range(3, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]\n\ndef stairs_opt(n):\n    if n <= 2:\n        return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b\n\nn = 1000\n\nprint(f'Climbing {n} stairs:')\n\nstart = time.time()\nresult1 = stairs_memo(n)\ntime1 = time.time() - start\n\nstart = time.time()\nresult2 = stairs_tab(n)\ntime2 = time.time() - start\n\nstart = time.time()\nresult3 = stairs_opt(n)\ntime3 = time.time() - start\n\nprint(f'\\nMemoization: {time1:.6f}s')\nprint(f'Tabulation:  {time2:.6f}s')\nprint(f'Optimized:   {time3:.6f}s')\nprint(f'\\nAll return same result: {result1 == result2 == result3}')\nprint(f'\\nSpace: Memo=O(n), Tab=O(n), Opt=O(1)')\nprint('\\nTabulation fastest (no recursion overhead)')\nprint('Optimized best for space!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All approaches compared", description: "Full comparison" }]),
        hints: ["Tabulation often fastest", "Optimized uses least space", "All give same answer"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 18.2.3`);

  const lesson18_2_4 = await prisma.lesson.upsert({
    where: { slug: "dp-design-process" },
    update: {},
    create: {
      sectionId: section18_2.id,
      number: 18.24,
      title: "DP Design Process",
      slug: "dp-design-process",
      objectives: [
        "Follow systematic DP design steps",
        "Define state clearly",
        "Write recurrence relation",
        "Handle base cases properly",
      ],
      content: `# DP Design Process

## The 5-Step Framework

### Step 1: Define the Subproblem
What is dp(i) or dp(i, j)?
- Be precise about what it represents
- Include all parameters needed

### Step 2: Write the Recurrence
How does dp(i) relate to smaller subproblems?
- Consider all choices at each step
- Combine results appropriately

### Step 3: Identify Base Cases
When can we answer directly?
- Empty input, zero capacity, etc.
- These stop the recursion

### Step 4: Determine Computation Order
For tabulation: which cells first?
- Dependencies must be computed before

### Step 5: Extract Answer
Where is the final answer?
- Usually dp(n) or dp(n-1, m-1)

## Example: Edit Distance

**Problem**: Minimum edits to transform s1 to s2

**Step 1**: dp(i, j) = min edits for s1[0..i] → s2[0..j]

**Step 2**: 
\`\`\`
If s1[i] == s2[j]: dp(i,j) = dp(i-1, j-1)
Else: dp(i,j) = 1 + min(
    dp(i-1, j),    # delete
    dp(i, j-1),    # insert
    dp(i-1, j-1)   # replace
)
\`\`\`

**Step 3**: dp(0, j) = j, dp(i, 0) = i

**Step 4**: Fill row by row, left to right

**Step 5**: Answer at dp(m, n)`,
      codeExamples: JSON.stringify([
        {
          id: "edit-distance",
          title: "Edit Distance (Levenshtein)",
          code: "def edit_distance(s1, s2):\n    m, n = len(s1), len(s2)\n    \n    # Step 1: dp[i][j] = min edits for s1[0..i-1] → s2[0..j-1]\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    \n    # Step 3: Base cases\n    for i in range(m + 1):\n        dp[i][0] = i  # delete all from s1\n    for j in range(n + 1):\n        dp[0][j] = j  # insert all into s1\n    \n    # Step 2 & 4: Fill table\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1]  # No edit needed\n            else:\n                dp[i][j] = 1 + min(\n                    dp[i-1][j],    # Delete from s1\n                    dp[i][j-1],    # Insert into s1\n                    dp[i-1][j-1]   # Replace\n                )\n    \n    # Step 5: Answer\n    return dp[m][n]\n\nprint('Edit Distance Examples:')\npairs = [('kitten', 'sitting'), ('sunday', 'saturday'), ('abc', 'abc')]\nfor s1, s2 in pairs:\n    dist = edit_distance(s1, s2)\n    print(f'  \"{s1}\" → \"{s2}\": {dist} edits')",
          description: "Classic DP problem following the framework",
        },
        {
          id: "max-subarray",
          title: "Maximum Subarray (Kadane's)",
          code: "def max_subarray(nums):\n    \"\"\"\n    Step 1: dp[i] = max sum of subarray ENDING at index i\n    Step 2: dp[i] = max(nums[i], dp[i-1] + nums[i])\n            Either start fresh or extend previous\n    Step 3: dp[0] = nums[0]\n    Step 4: Left to right\n    Step 5: max(dp)\n    \"\"\"\n    n = len(nums)\n    dp = [0] * n\n    dp[0] = nums[0]\n    \n    for i in range(1, n):\n        dp[i] = max(nums[i], dp[i-1] + nums[i])\n    \n    return max(dp)\n\nnums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nprint(f'Array: {nums}')\nprint(f'Max subarray sum: {max_subarray(nums)}')\nprint('\\nSubarray [4, -1, 2, 1] has sum 6')",
          description: "Design process for max subarray",
        },
        {
          id: "design-template",
          title: "DP Design Template",
          code: "def dp_template(problem_input):\n    \"\"\"\n    DP Design Process Template\n    \"\"\"\n    # Step 1: Define what dp represents\n    # dp[i] = ... OR dp[i][j] = ...\n    \n    # Step 3: Base cases\n    # dp[0] = ... OR dp[0][0] = ...\n    \n    # Step 2 & 4: Recurrence + Fill order\n    # for i in range(...):\n    #     dp[i] = f(dp[i-1], ...)\n    \n    # Step 5: Return answer\n    # return dp[n] OR dp[m][n]\n    pass\n\nprint('DP Design Checklist:')\nprint('1. Define subproblem: What does dp[i] represent?')\nprint('2. Write recurrence: How does dp[i] depend on smaller?')\nprint('3. Base cases: What are dp[0], dp[1], etc.?')\nprint('4. Computation order: Which cells depend on which?')\nprint('5. Extract answer: Where is the final result?')\nprint()\nprint('Common mistakes:')\nprint('- Off-by-one errors in indices')\nprint('- Missing base cases')\nprint('- Wrong computation order (dependencies not ready)')",
          description: "Template to follow for any DP problem",
        },
      ]),
      keyPoints: [
        "Step 1: Define subproblem precisely",
        "Step 2: Write recurrence relation",
        "Step 3: Identify all base cases",
        "Step 4: Determine fill order (dependencies)",
        "Step 5: Know where answer is",
        "Practice the framework on many problems",
      ],
      hardwareDemo: "Walk through each step of framework. See state definition and transitions.",
      estimatedTime: 30,
      difficulty: "ADVANCED",
      order: 4,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson18_2_4.number}: ${lesson18_2_4.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson18_2_4.id,
        number: 1,
        title: "Design: House Robber",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Apply DP framework: Rob houses but can't rob adjacent. Array is money in each house.",
        starterCode: "def house_robber(houses):\n    \"\"\"\n    Step 1: dp[i] = max money robbing houses 0..i\n    Step 2: dp[i] = max(dp[i-1], dp[i-2] + houses[i])\n            Either skip house i OR rob it (can't rob i-1)\n    Step 3: dp[0] = houses[0], dp[1] = max(houses[0], houses[1])\n    Step 4: Left to right\n    Step 5: dp[n-1]\n    \"\"\"\n    if not houses:\n        return 0\n    if len(houses) == 1:\n        return houses[0]\n    \n    n = len(houses)\n    dp = [0] * n\n    dp[0] = houses[0]\n    dp[1] = max(houses[0], houses[1])\n    \n    for i in range(2, n):\n        dp[i] = max(dp[i-1], dp[i-2] + houses[i])\n    \n    return dp[n-1]\n\nhouses = [2, 7, 9, 3, 1]\nprint(f'Houses: {houses}')\nprint(f'Max robbery: ${house_robber(houses)}')\nprint('\\nRob houses 0, 2, 4: $2 + $9 + $1 = $12')\nprint('Or houses 1, 3: $7 + $3 = $10')\nprint('Best: houses 0, 2: $2 + $9 = $11? No wait...')",
        solution: "def house_robber(houses):\n    if not houses:\n        return 0\n    if len(houses) == 1:\n        return houses[0]\n    \n    n = len(houses)\n    dp = [0] * n\n    dp[0] = houses[0]\n    dp[1] = max(houses[0], houses[1])\n    \n    for i in range(2, n):\n        dp[i] = max(dp[i-1], dp[i-2] + houses[i])\n    \n    return dp[n-1]\n\nhouses = [2, 7, 9, 3, 1]\nprint(f'Houses: {houses}')\nprint(f'Max robbery: ${house_robber(houses)}')\nprint('\\nDP trace:')\nprint('  dp[0] = 2')\nprint('  dp[1] = max(2, 7) = 7')\nprint('  dp[2] = max(7, 2+9) = 11')\nprint('  dp[3] = max(11, 7+3) = 11')\nprint('  dp[4] = max(11, 11+1) = 12')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Max: $12", description: "House robber solved" }]),
        hints: ["Can't rob adjacent houses", "Either skip current or rob it", "If rob, add to i-2 result"],
        xpReward: 20,
        order: 1,
      },
      {
        lessonId: lesson18_2_4.id,
        number: 2,
        title: "Design: Coin Change Min",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Apply framework: Find minimum coins to make amount.",
        starterCode: "def min_coins(coins, amount):\n    \"\"\"\n    Step 1: dp[a] = min coins needed for amount a\n    Step 2: dp[a] = min(dp[a - coin] + 1) for each coin\n    Step 3: dp[0] = 0\n    Step 4: From 1 to amount\n    Step 5: dp[amount]\n    \"\"\"\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    \n    for a in range(1, amount + 1):\n        for coin in coins:\n            if coin <= a and dp[a - coin] != float('inf'):\n                dp[a] = min(dp[a], dp[a - coin] + 1)\n    \n    return dp[amount] if dp[amount] != float('inf') else -1\n\ncoins = [1, 5, 10, 25]\namount = 63\n\nprint(f'Coins: {coins}')\nprint(f'Amount: {amount}')\nprint(f'Min coins: {min_coins(coins, amount)}')\nprint('\\n63 = 25 + 25 + 10 + 1 + 1 + 1 = 6 coins')",
        solution: "def min_coins(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    \n    for a in range(1, amount + 1):\n        for coin in coins:\n            if coin <= a and dp[a - coin] != float('inf'):\n                dp[a] = min(dp[a], dp[a - coin] + 1)\n    \n    return dp[amount] if dp[amount] != float('inf') else -1\n\ncoins = [1, 5, 10, 25]\namount = 63\n\nprint(f'Coins: {coins}')\nprint(f'Amount: {amount}')\nprint(f'Min coins: {min_coins(coins, amount)}')\nprint('\\n63 = 25 + 25 + 10 + 1 + 1 + 1 = 6 coins')\nprint('\\nDP finds optimal even when greedy fails!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Min coins: 6", description: "Coin change design" }]),
        hints: ["dp[0] = 0 (zero amount needs zero coins)", "Try each coin at each amount", "Take minimum across all coins"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson18_2_4.id,
        number: 3,
        title: "Design: Longest Increasing Subsequence",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Apply framework: Find length of longest strictly increasing subsequence.",
        starterCode: "def lis(nums):\n    \"\"\"\n    Step 1: dp[i] = length of LIS ending at index i\n    Step 2: dp[i] = max(dp[j] + 1) for all j < i where nums[j] < nums[i]\n    Step 3: dp[i] = 1 for all i (single element)\n    Step 4: Left to right, checking all previous\n    Step 5: max(dp)\n    \"\"\"\n    if not nums:\n        return 0\n    \n    n = len(nums)\n    dp = [1] * n  # Each element is a subsequence of length 1\n    \n    for i in range(1, n):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    \n    return max(dp)\n\nnums = [10, 9, 2, 5, 3, 7, 101, 18]\nprint(f'Array: {nums}')\nprint(f'LIS length: {lis(nums)}')\nprint('\\nOne LIS: [2, 3, 7, 18] or [2, 3, 7, 101]')",
        solution: "def lis(nums):\n    if not nums:\n        return 0\n    \n    n = len(nums)\n    dp = [1] * n\n    \n    for i in range(1, n):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    \n    return max(dp)\n\nnums = [10, 9, 2, 5, 3, 7, 101, 18]\nprint(f'Array: {nums}')\nprint(f'LIS length: {lis(nums)}')\nprint('\\nOne LIS: [2, 3, 7, 18] or [2, 3, 7, 101]')\nprint('\\nTime: O(n²), can be optimized to O(n log n)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "LIS length: 4", description: "LIS design" }]),
        hints: ["dp[i] = LIS ending at i", "Check all j < i where nums[j] < nums[i]", "Answer is max of all dp values"],
        xpReward: 25,
        order: 3,
      },
      {
        lessonId: lesson18_2_4.id,
        number: 4,
        title: "Design: Partition Equal Subset",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Apply framework: Can array be partitioned into two subsets with equal sum?",
        starterCode: "def can_partition(nums):\n    \"\"\"\n    Step 1: dp[s] = True if subset with sum s exists\n    Step 2: dp[s] = dp[s] OR dp[s - num] for each num\n    Step 3: dp[0] = True\n    Step 4: For each num, update possible sums\n    Step 5: dp[total // 2]\n    \"\"\"\n    total = sum(nums)\n    if total % 2 != 0:\n        return False\n    \n    target = total // 2\n    dp = [False] * (target + 1)\n    dp[0] = True\n    \n    for num in nums:\n        # Go backwards to avoid using same number twice\n        for s in range(target, num - 1, -1):\n            dp[s] = dp[s] or dp[s - num]\n    \n    return dp[target]\n\ntest_cases = [\n    [1, 5, 11, 5],  # 11 = 1+5+5, 11 = 11\n    [1, 2, 3, 5],   # sum=11, odd, impossible\n    [1, 2, 3, 4],   # 5 = 1+4, 5 = 2+3\n]\n\nfor nums in test_cases:\n    result = can_partition(nums)\n    print(f'{nums}: {result}')",
        solution: "def can_partition(nums):\n    total = sum(nums)\n    if total % 2 != 0:\n        return False\n    \n    target = total // 2\n    dp = [False] * (target + 1)\n    dp[0] = True\n    \n    for num in nums:\n        for s in range(target, num - 1, -1):\n            dp[s] = dp[s] or dp[s - num]\n    \n    return dp[target]\n\ntest_cases = [\n    [1, 5, 11, 5],\n    [1, 2, 3, 5],\n    [1, 2, 3, 4],\n]\n\nfor nums in test_cases:\n    result = can_partition(nums)\n    print(f'{nums}: {result}')\n\nprint('\\nThis is subset sum problem!')\nprint('If can make sum = total/2, partition exists')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "True, False, True", description: "Partition design" }]),
        hints: ["Reduce to: can we make sum = total/2?", "This is subset sum problem", "Use 1D DP with backwards traversal"],
        xpReward: 25,
        order: 4,
      },
      {
        lessonId: lesson18_2_4.id,
        number: 5,
        title: "Apply Framework to New Problem",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Solve: Given staircase cost[i], find min cost to reach top. Can climb 1 or 2 steps. Start at step 0 or 1.",
        starterCode: "def min_cost_stairs(cost):\n    \"\"\"\n    Apply the 5-step framework:\n    \n    Step 1: dp[i] = min cost to reach step i\n    Step 2: dp[i] = cost[i] + min(dp[i-1], dp[i-2])\n    Step 3: dp[0] = cost[0], dp[1] = cost[1]\n    Step 4: From step 2 to n-1\n    Step 5: min(dp[n-1], dp[n-2]) (can jump from either to top)\n    \"\"\"\n    n = len(cost)\n    if n <= 1:\n        return 0\n    \n    dp = [0] * n\n    dp[0] = cost[0]\n    dp[1] = cost[1]\n    \n    for i in range(2, n):\n        dp[i] = cost[i] + min(dp[i-1], dp[i-2])\n    \n    # Can reach top from last or second-to-last step\n    return min(dp[n-1], dp[n-2])\n\ncost = [10, 15, 20]\nprint(f'Cost: {cost}')\nprint(f'Min cost: {min_cost_stairs(cost)}')\nprint('Start at step 1 (cost 15), jump 2 to top')\n\ncost2 = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]\nprint(f'\\nCost: {cost2}')\nprint(f'Min cost: {min_cost_stairs(cost2)}')",
        solution: "def min_cost_stairs(cost):\n    n = len(cost)\n    if n <= 1:\n        return 0\n    \n    dp = [0] * n\n    dp[0] = cost[0]\n    dp[1] = cost[1]\n    \n    for i in range(2, n):\n        dp[i] = cost[i] + min(dp[i-1], dp[i-2])\n    \n    return min(dp[n-1], dp[n-2])\n\ncost = [10, 15, 20]\nprint(f'Cost: {cost}')\nprint(f'Min cost: {min_cost_stairs(cost)}')\nprint('Start at step 1 (cost 15), jump 2 to top')\n\ncost2 = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]\nprint(f'\\nCost: {cost2}')\nprint(f'Min cost: {min_cost_stairs(cost2)}')\nprint('\\nFramework works for new problems!')\nprint('Key: define state clearly, write recurrence!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "15, then 6", description: "Framework applied" }]),
        hints: ["Must pay cost[i] to stand on step i", "Can reach step i from i-1 or i-2", "Top is past last step"],
        xpReward: 30,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 18.2.4`);

  console.log("\n✅ Part 4 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
