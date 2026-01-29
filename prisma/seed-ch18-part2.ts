import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 2: Lessons 18.1.3-18.1.4 (Memoization and When to Use DP)...\n");

  const section18_1 = await prisma.section.findFirst({ where: { number: 18.1 } });
  if (!section18_1) throw new Error("Section 18.1 not found. Run part 1 first.");

  const lesson18_1_3 = await prisma.lesson.upsert({
    where: { slug: "memoization-technique" },
    update: {},
    create: {
      sectionId: section18_1.id,
      number: 18.13,
      title: "Memoization Technique",
      slug: "memoization-technique",
      objectives: [
        "Master the memoization pattern",
        "Apply memoization to different problems",
        "Use dictionary vs list for caching",
        "Handle multi-parameter memoization",
      ],
      content: `# Memoization Technique

## The Pattern

\`\`\`python
def solve(params, memo=None):
    if memo is None:
        memo = {}
    
    # 1. Check cache
    key = make_key(params)
    if key in memo:
        return memo[key]
    
    # 2. Base case
    if is_base_case(params):
        return base_value
    
    # 3. Recursive computation
    result = combine(solve(subproblem1, memo),
                     solve(subproblem2, memo))
    
    # 4. Store in cache
    memo[key] = result
    return result
\`\`\`

## Key Design Decisions

### 1. Cache Key
- Single parameter: use the parameter directly
- Multiple parameters: use tuple (a, b, c)
- Complex objects: convert to hashable form

### 2. Cache Structure
- **Dictionary**: Flexible keys, sparse access
- **List**: Integer indices, dense access

### 3. Cache Scope
- Function default argument (persistent)
- Pass as parameter (fresh each call)
- Global variable (explicit control)

## Common Patterns

| Problem | Key | Structure |
|---------|-----|-----------|
| Fibonacci | n | dict or list |
| Grid paths | (row, col) | dict |
| String problems | (i, j) | dict |
| Knapsack | (item, capacity) | dict |`,
      codeExamples: JSON.stringify([
        {
          id: "basic-memoization",
          title: "Basic Memoization Pattern",
          code: "def solve(n, memo=None):\n    # Initialize cache\n    if memo is None:\n        memo = {}\n    \n    # Check cache\n    if n in memo:\n        print(f'  Cache hit: n={n}')\n        return memo[n]\n    \n    print(f'  Computing: n={n}')\n    \n    # Base case\n    if n <= 1:\n        return n\n    \n    # Recursive computation\n    result = solve(n-1, memo) + solve(n-2, memo)\n    \n    # Store in cache\n    memo[n] = result\n    return result\n\nprint('Computing solve(6):\\n')\nresult = solve(6)\nprint(f'\\nResult: {result}')",
          description: "The standard memoization pattern",
        },
        {
          id: "multi-param-memo",
          title: "Multi-Parameter Memoization",
          code: "def grid_paths(row, col, memo=None):\n    \"\"\"Count paths from (0,0) to (row,col) moving right or down\"\"\"\n    if memo is None:\n        memo = {}\n    \n    # Tuple key for multiple parameters\n    key = (row, col)\n    if key in memo:\n        return memo[key]\n    \n    # Base cases\n    if row == 0 or col == 0:\n        return 1\n    \n    # Recursive: come from above or left\n    result = grid_paths(row-1, col, memo) + grid_paths(row, col-1, memo)\n    \n    memo[key] = result\n    return result\n\nprint('Grid paths (unique routes from corner to corner):')\nfor size in [(2, 2), (3, 3), (5, 5), (10, 10)]:\n    paths = grid_paths(size[0], size[1])\n    print(f'  {size[0]+1}x{size[1]+1} grid: {paths} paths')",
          description: "Use tuple as cache key for multiple parameters",
        },
        {
          id: "list-vs-dict",
          title: "List vs Dictionary Cache",
          code: "# List cache - good for dense integer indices\ndef fib_list(n):\n    cache = [None] * (n + 1)\n    \n    def helper(k):\n        if cache[k] is not None:\n            return cache[k]\n        if k <= 1:\n            result = k\n        else:\n            result = helper(k-1) + helper(k-2)\n        cache[k] = result\n        return result\n    \n    return helper(n)\n\n# Dict cache - good for sparse or non-integer keys\ndef fib_dict(n, cache=None):\n    if cache is None:\n        cache = {}\n    if n in cache:\n        return cache[n]\n    if n <= 1:\n        return n\n    cache[n] = fib_dict(n-1, cache) + fib_dict(n-2, cache)\n    return cache[n]\n\nprint('Both give same results:')\nfor n in [10, 20, 30]:\n    print(f'  fib({n}): list={fib_list(n)}, dict={fib_dict(n)}')",
          description: "Choose cache structure based on keys",
        },
      ]),
      keyPoints: [
        "Check cache before computing",
        "Store result after computing",
        "Use tuple for multi-parameter keys",
        "Dict for sparse/flexible, list for dense",
        "Initialize cache properly (None check)",
        "@lru_cache for simple cases",
      ],
      hardwareDemo: "Watch dictionary grow with cached results. See key lookups in hash table.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson18_1_3.number}: ${lesson18_1_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson18_1_3.id,
        number: 1,
        title: "Basic Memoization Template",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Complete the memoization template for a function that computes sum of 1 to n recursively.",
        starterCode: "def sum_to_n(n, memo=None):\n    # Initialize cache\n    if memo is None:\n        memo = {}\n    \n    # Check cache\n    if n in memo:\n        return memo[n]\n    \n    # Base case\n    if n <= 0:\n        return 0\n    \n    # Recursive computation\n    result = n + sum_to_n(n-1, memo)\n    \n    # Store in cache\n    memo[n] = result\n    return result\n\nprint('Sum 1 to n:')\nfor n in [5, 10, 100, 1000]:\n    print(f'  sum(1..{n}) = {sum_to_n(n)}')",
        solution: "def sum_to_n(n, memo=None):\n    if memo is None:\n        memo = {}\n    \n    if n in memo:\n        return memo[n]\n    \n    if n <= 0:\n        return 0\n    \n    result = n + sum_to_n(n-1, memo)\n    \n    memo[n] = result\n    return result\n\nprint('Sum 1 to n:')\nfor n in [5, 10, 100, 1000]:\n    print(f'  sum(1..{n}) = {sum_to_n(n)}')\n\nprint('\\nMemoization prevents stack overflow for large n!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Correct sums computed", description: "Basic memoization" }]),
        hints: ["Check cache first", "Compute if not in cache", "Store before returning"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson18_1_3.id,
        number: 2,
        title: "Grid Paths with Memoization",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Count unique paths in a grid from top-left to bottom-right (only right and down moves). Use memoization.",
        starterCode: "def count_paths(rows, cols, memo=None):\n    if memo is None:\n        memo = {}\n    \n    key = (rows, cols)\n    if key in memo:\n        return memo[key]\n    \n    # Base: single row or column = 1 path\n    if rows == 1 or cols == 1:\n        return 1\n    \n    # Recursive: from above + from left\n    result = count_paths(rows-1, cols, memo) + count_paths(rows, cols-1, memo)\n    \n    memo[key] = result\n    return result\n\nprint('Unique paths in grid:')\nfor r, c in [(2, 2), (3, 3), (4, 4), (10, 10)]:\n    print(f'  {r}x{c} grid: {count_paths(r, c)} paths')",
        solution: "def count_paths(rows, cols, memo=None):\n    if memo is None:\n        memo = {}\n    \n    key = (rows, cols)\n    if key in memo:\n        return memo[key]\n    \n    if rows == 1 or cols == 1:\n        return 1\n    \n    result = count_paths(rows-1, cols, memo) + count_paths(rows, cols-1, memo)\n    \n    memo[key] = result\n    return result\n\nprint('Unique paths in grid:')\nfor r, c in [(2, 2), (3, 3), (4, 4), (10, 10)]:\n    print(f'  {r}x{c} grid: {count_paths(r, c)} paths')\n\nprint('\\nTuple (rows, cols) is the cache key')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "2x2=2, 3x3=6, 4x4=20", description: "Grid paths computed" }]),
        hints: ["Key is tuple (rows, cols)", "Base case: 1 row or 1 col", "Recursive: sum of two subproblems"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson18_1_3.id,
        number: 3,
        title: "Climbing Stairs",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Count ways to climb n stairs if you can take 1 or 2 steps at a time. Use memoization.",
        starterCode: "def climb_stairs(n, memo=None):\n    if memo is None:\n        memo = {}\n    \n    if n in memo:\n        return memo[n]\n    \n    # Base cases\n    if n <= 0:\n        return 0\n    if n == 1:\n        return 1\n    if n == 2:\n        return 2\n    \n    # Take 1 step or 2 steps\n    result = climb_stairs(n-1, memo) + climb_stairs(n-2, memo)\n    \n    memo[n] = result\n    return result\n\nprint('Ways to climb stairs:')\nfor n in range(1, 11):\n    print(f'  {n} stairs: {climb_stairs(n)} ways')",
        solution: "def climb_stairs(n, memo=None):\n    if memo is None:\n        memo = {}\n    \n    if n in memo:\n        return memo[n]\n    \n    if n <= 0:\n        return 0\n    if n == 1:\n        return 1\n    if n == 2:\n        return 2\n    \n    result = climb_stairs(n-1, memo) + climb_stairs(n-2, memo)\n    \n    memo[n] = result\n    return result\n\nprint('Ways to climb stairs:')\nfor n in range(1, 11):\n    print(f'  {n} stairs: {climb_stairs(n)} ways')\n\nprint('\\nThis is Fibonacci shifted by 1!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "1,2,3,5,8,13,21,34,55,89", description: "Stair climbing" }]),
        hints: ["f(n) = f(n-1) + f(n-2)", "1 stair: 1 way", "2 stairs: 2 ways (1+1 or 2)"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson18_1_3.id,
        number: 4,
        title: "Coin Change (Count Ways)",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Count ways to make change for amount using given coins. Use memoization with (amount, coin_index) as key.",
        starterCode: "def count_change(amount, coins, index=0, memo=None):\n    if memo is None:\n        memo = {}\n    \n    key = (amount, index)\n    if key in memo:\n        return memo[key]\n    \n    # Base cases\n    if amount == 0:\n        return 1  # One way: use no more coins\n    if amount < 0 or index >= len(coins):\n        return 0  # No way\n    \n    # Include current coin + Exclude current coin\n    include = count_change(amount - coins[index], coins, index, memo)\n    exclude = count_change(amount, coins, index + 1, memo)\n    \n    result = include + exclude\n    memo[key] = result\n    return result\n\ncoins = [1, 5, 10, 25]\nprint('Ways to make change:')\nfor amount in [5, 10, 25, 50, 100]:\n    ways = count_change(amount, coins)\n    print(f'  ${amount/100:.2f}: {ways} ways')",
        solution: "def count_change(amount, coins, index=0, memo=None):\n    if memo is None:\n        memo = {}\n    \n    key = (amount, index)\n    if key in memo:\n        return memo[key]\n    \n    if amount == 0:\n        return 1\n    if amount < 0 or index >= len(coins):\n        return 0\n    \n    include = count_change(amount - coins[index], coins, index, memo)\n    exclude = count_change(amount, coins, index + 1, memo)\n    \n    result = include + exclude\n    memo[key] = result\n    return result\n\ncoins = [1, 5, 10, 25]\nprint('Ways to make change:')\nfor amount in [5, 10, 25, 50, 100]:\n    ways = count_change(amount, coins)\n    print(f'  ${amount/100:.2f}: {ways} ways')\n\nprint('\\nKey: (remaining_amount, current_coin_index)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Change combinations counted", description: "Coin change DP" }]),
        hints: ["Key is (amount, index)", "Include: use coin again", "Exclude: move to next coin"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson18_1_3.id,
        number: 5,
        title: "Min Coins (Optimization)",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Find minimum number of coins to make amount. Return -1 if impossible.",
        starterCode: "def min_coins(amount, coins, memo=None):\n    if memo is None:\n        memo = {}\n    \n    if amount in memo:\n        return memo[amount]\n    \n    # Base cases\n    if amount == 0:\n        return 0\n    if amount < 0:\n        return float('inf')\n    \n    # Try each coin, take minimum\n    min_count = float('inf')\n    for coin in coins:\n        result = min_coins(amount - coin, coins, memo)\n        if result != float('inf'):\n            min_count = min(min_count, result + 1)\n    \n    memo[amount] = min_count\n    return min_count\n\ncoins = [1, 5, 10, 25]\nprint('Minimum coins needed:')\nfor amount in [11, 15, 30, 63]:\n    result = min_coins(amount, coins)\n    result_str = str(result) if result != float('inf') else 'impossible'\n    print(f'  {amount} cents: {result_str} coins')",
        solution: "def min_coins(amount, coins, memo=None):\n    if memo is None:\n        memo = {}\n    \n    if amount in memo:\n        return memo[amount]\n    \n    if amount == 0:\n        return 0\n    if amount < 0:\n        return float('inf')\n    \n    min_count = float('inf')\n    for coin in coins:\n        result = min_coins(amount - coin, coins, memo)\n        if result != float('inf'):\n            min_count = min(min_count, result + 1)\n    \n    memo[amount] = min_count\n    return min_count\n\ncoins = [1, 5, 10, 25]\nprint('Minimum coins needed:')\nfor amount in [11, 15, 30, 63]:\n    result = min_coins(amount, coins)\n    result_str = str(result) if result != float('inf') else 'impossible'\n    print(f'  {amount} cents: {result_str} coins')\n\nprint('\\nOptimization: find min, not count!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Minimum coins found", description: "Optimization DP" }]),
        hints: ["Try each coin denomination", "Take minimum of all options", "Use inf for impossible"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 18.1.3`);

  const lesson18_1_4 = await prisma.lesson.upsert({
    where: { slug: "when-to-use-dp" },
    update: {},
    create: {
      sectionId: section18_1.id,
      number: 18.14,
      title: "When to Use DP (Problem Characteristics)",
      slug: "when-to-use-dp",
      objectives: [
        "Identify problems suitable for DP",
        "Recognize DP problem patterns",
        "Distinguish DP from other techniques",
        "Know common DP problem types",
      ],
      content: `# When to Use Dynamic Programming

## Two Key Questions

1. **Optimal substructure?**
   Can the optimal solution be built from optimal sub-solutions?

2. **Overlapping subproblems?**
   Are the same subproblems solved multiple times?

If YES to both → Use DP!

## Red Flags for DP

- "Find the **minimum/maximum**..."
- "Count the **number of ways**..."
- "Is it **possible** to..."
- "Find the **longest/shortest**..."

## Common DP Problem Types

| Type | Example |
|------|---------|
| Sequence | Longest increasing subsequence |
| Grid | Unique paths, minimum path sum |
| String | Edit distance, LCS |
| Knapsack | 0/1 knapsack, subset sum |
| Decision | House robber, stock trading |

## DP vs Greedy

| DP | Greedy |
|----|--------|
| Consider all options | Take best local choice |
| Guaranteed optimal | May not be optimal |
| Higher complexity | Lower complexity |
| Use when greedy fails | Use when greedy works |

## DP vs Divide-and-Conquer

| DP | D&C |
|----|-----|
| Overlapping subproblems | Independent subproblems |
| Store results | No storage needed |
| Fibonacci, knapsack | Merge sort, quicksort |`,
      codeExamples: JSON.stringify([
        {
          id: "identify-dp",
          title: "Identifying DP Problems",
          code: "# Question: Can we solve this with DP?\n\n# Example 1: Minimum coins to make change\n# - Optimal substructure? YES - min coins for N uses min coins for N-coin\n# - Overlapping subproblems? YES - same amounts computed repeatedly\n# → USE DP!\n\n# Example 2: Find maximum element in array\n# - Optimal substructure? YES\n# - Overlapping subproblems? NO - each element checked once\n# → NO DP needed (simple iteration)\n\n# Example 3: Sort an array (merge sort)\n# - Optimal substructure? YES\n# - Overlapping subproblems? NO - subarrays are different\n# → Use Divide & Conquer, not DP\n\n# Example 4: Longest common subsequence\n# - Optimal substructure? YES - LCS(i,j) uses LCS of shorter prefixes\n# - Overlapping subproblems? YES - same prefixes compared repeatedly\n# → USE DP!\n\nprint('DP Checklist:')\nprint('1. Can we break into subproblems? (optimal substructure)')\nprint('2. Do subproblems repeat? (overlapping subproblems)')\nprint('3. If both YES → Use DP!')",
          description: "How to identify DP problems",
        },
        {
          id: "problem-patterns",
          title: "Common DP Patterns",
          code: "# Pattern 1: Linear sequence\n# \"Find minimum/maximum ending at position i\"\n# State: dp[i]\n# Example: Max subarray, climbing stairs\n\n# Pattern 2: Two sequences\n# \"Compare two strings/arrays\"\n# State: dp[i][j] for positions in both\n# Example: LCS, edit distance\n\n# Pattern 3: Grid\n# \"Find path through 2D grid\"\n# State: dp[row][col]\n# Example: Unique paths, min path sum\n\n# Pattern 4: Subset/Knapsack\n# \"Select items with constraints\"\n# State: dp[item][capacity]\n# Example: 0/1 knapsack, subset sum\n\n# Pattern 5: Interval\n# \"Optimal over a range [i,j]\"\n# State: dp[i][j] for interval\n# Example: Matrix chain, palindrome partition\n\nprint('Common DP Patterns:')\npatterns = [\n    ('Linear', 'dp[i]', 'Climbing stairs, max subarray'),\n    ('Two sequence', 'dp[i][j]', 'LCS, edit distance'),\n    ('Grid', 'dp[row][col]', 'Unique paths'),\n    ('Knapsack', 'dp[item][cap]', '0/1 knapsack'),\n    ('Interval', 'dp[i][j]', 'Matrix chain'),\n]\n\nfor name, state, example in patterns:\n    print(f'  {name}: {state} - {example}')",
          description: "Recognize common DP patterns",
        },
        {
          id: "dp-vs-greedy",
          title: "DP vs Greedy: When Each Works",
          code: "# Coin change: When greedy works vs fails\n\ndef greedy_coins(amount, coins):\n    coins_sorted = sorted(coins, reverse=True)\n    count = 0\n    for coin in coins_sorted:\n        while amount >= coin:\n            amount -= coin\n            count += 1\n    return count if amount == 0 else -1\n\ndef dp_coins(amount, coins, memo=None):\n    if memo is None:\n        memo = {}\n    if amount in memo:\n        return memo[amount]\n    if amount == 0:\n        return 0\n    if amount < 0:\n        return float('inf')\n    \n    result = float('inf')\n    for coin in coins:\n        sub = dp_coins(amount - coin, coins, memo)\n        result = min(result, sub + 1)\n    memo[amount] = result\n    return result\n\n# Standard coins: greedy works!\ncoins1 = [1, 5, 10, 25]\namount1 = 30\nprint(f'Standard coins {coins1}, amount={amount1}:')\nprint(f'  Greedy: {greedy_coins(amount1, coins1)} coins')\nprint(f'  DP: {dp_coins(amount1, coins1)} coins')\n\n# Weird coins: greedy fails!\ncoins2 = [1, 3, 4]\namount2 = 6\nprint(f'\\nWeird coins {coins2}, amount={amount2}:')\nprint(f'  Greedy: {greedy_coins(amount2, coins2)} coins (4+1+1)')\nprint(f'  DP: {dp_coins(amount2, coins2)} coins (3+3)')\nprint('  Greedy is suboptimal!')",
          description: "Greedy can fail, DP always finds optimal",
        },
      ]),
      keyPoints: [
        "DP needs: optimal substructure + overlapping subproblems",
        "Keywords: minimum, maximum, count ways, possible",
        "Common patterns: sequence, grid, knapsack, interval",
        "DP vs Greedy: DP guaranteed optimal, greedy may not be",
        "DP vs D&C: DP has overlapping subproblems",
        "When in doubt, check for repeated subproblems",
      ],
      hardwareDemo: "Compare recursion trees with and without overlapping subproblems.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 4,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson18_1_4.number}: ${lesson18_1_4.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson18_1_4.id,
        number: 1,
        title: "Identify DP Problems",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "For each problem, determine if DP is appropriate. Print 'DP' or 'Not DP' with reason.",
        starterCode: "problems = [\n    ('Find max element in array', False, 'No overlapping subproblems'),\n    ('Count ways to climb n stairs (1 or 2 steps)', True, 'Same stair counts repeated'),\n    ('Sort an array', False, 'Subarrays are independent'),\n    ('Minimum coins for change', True, 'Same amounts computed repeatedly'),\n    ('Binary search', False, 'Each subproblem is unique'),\n    ('Longest common subsequence', True, 'Same prefixes compared repeatedly'),\n]\n\nprint('DP Problem Identification:')\nprint('='*60)\n\nfor problem, is_dp, reason in problems:\n    status = 'DP' if is_dp else 'Not DP'\n    print(f'\\n{problem}')\n    print(f'  → {status}: {reason}')",
        solution: "problems = [\n    ('Find max element in array', False, 'No overlapping subproblems'),\n    ('Count ways to climb n stairs (1 or 2 steps)', True, 'Same stair counts repeated'),\n    ('Sort an array', False, 'Subarrays are independent'),\n    ('Minimum coins for change', True, 'Same amounts computed repeatedly'),\n    ('Binary search', False, 'Each subproblem is unique'),\n    ('Longest common subsequence', True, 'Same prefixes compared repeatedly'),\n]\n\nprint('DP Problem Identification:')\nprint('='*60)\n\nfor problem, is_dp, reason in problems:\n    status = 'DP' if is_dp else 'Not DP'\n    print(f'\\n{problem}')\n    print(f'  → {status}: {reason}')\n\nprint('\\n' + '='*60)\nprint('Key: Look for OVERLAPPING subproblems!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Problems classified", description: "DP identification" }]),
        hints: ["DP needs overlapping subproblems", "Sorting has independent subproblems", "Counting problems often use DP"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson18_1_4.id,
        number: 2,
        title: "Spot the Pattern",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Match each problem to its DP pattern (Linear, Grid, Knapsack, Two-sequence).",
        starterCode: "patterns = {\n    'Linear': 'State depends on previous elements in sequence',\n    'Grid': 'Navigate 2D array from corner to corner',\n    'Knapsack': 'Select items with capacity constraint',\n    'Two-sequence': 'Compare/align two strings or arrays',\n}\n\nproblems = [\n    ('Unique paths in grid', 'Grid'),\n    ('Longest increasing subsequence', 'Linear'),\n    ('0/1 Knapsack', 'Knapsack'),\n    ('Edit distance between strings', 'Two-sequence'),\n    ('Maximum subarray sum', 'Linear'),\n    ('Subset sum', 'Knapsack'),\n    ('Longest common subsequence', 'Two-sequence'),\n    ('Minimum path sum in grid', 'Grid'),\n]\n\nprint('Problem → Pattern Matching:')\nprint()\nfor problem, pattern in problems:\n    print(f'  {problem}')\n    print(f'    → {pattern}: {patterns[pattern]}')\n    print()",
        solution: "patterns = {\n    'Linear': 'State depends on previous elements in sequence',\n    'Grid': 'Navigate 2D array from corner to corner',\n    'Knapsack': 'Select items with capacity constraint',\n    'Two-sequence': 'Compare/align two strings or arrays',\n}\n\nproblems = [\n    ('Unique paths in grid', 'Grid'),\n    ('Longest increasing subsequence', 'Linear'),\n    ('0/1 Knapsack', 'Knapsack'),\n    ('Edit distance between strings', 'Two-sequence'),\n    ('Maximum subarray sum', 'Linear'),\n    ('Subset sum', 'Knapsack'),\n    ('Longest common subsequence', 'Two-sequence'),\n    ('Minimum path sum in grid', 'Grid'),\n]\n\nprint('Problem → Pattern Matching:')\nprint()\nfor problem, pattern in problems:\n    print(f'  {problem}')\n    print(f'    → {pattern}: {patterns[pattern]}')\n    print()\n\nprint('Recognizing patterns helps design solutions!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Problems matched to patterns", description: "Pattern recognition" }]),
        hints: ["Grid: row, col state", "Knapsack: item, capacity", "Two-sequence: compare positions"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson18_1_4.id,
        number: 3,
        title: "Greedy vs DP Decision",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show a problem where greedy fails but DP succeeds: making change with coins [1, 3, 4] for amount 6.",
        starterCode: "def greedy_coins(amount, coins):\n    coins_sorted = sorted(coins, reverse=True)\n    result = []\n    remaining = amount\n    for coin in coins_sorted:\n        while remaining >= coin:\n            result.append(coin)\n            remaining -= coin\n    return result if remaining == 0 else None\n\ndef dp_coins(amount, coins, memo=None):\n    if memo is None:\n        memo = {}\n    if amount in memo:\n        return memo[amount]\n    if amount == 0:\n        return []\n    if amount < 0:\n        return None\n    \n    best = None\n    for coin in coins:\n        sub = dp_coins(amount - coin, coins, memo)\n        if sub is not None:\n            candidate = sub + [coin]\n            if best is None or len(candidate) < len(best):\n                best = candidate\n    \n    memo[amount] = best\n    return best\n\ncoins = [1, 3, 4]\namount = 6\n\nprint(f'Coins: {coins}, Amount: {amount}')\nprint()\ngreedy_result = greedy_coins(amount, coins)\nprint(f'Greedy: {greedy_result} ({len(greedy_result)} coins)')\n\ndp_result = dp_coins(amount, coins)\nprint(f'DP: {dp_result} ({len(dp_result)} coins)')\nprint()\nprint('Greedy picks 4 first, then needs 1+1')\nprint('DP finds optimal: 3+3')",
        solution: "def greedy_coins(amount, coins):\n    coins_sorted = sorted(coins, reverse=True)\n    result = []\n    remaining = amount\n    for coin in coins_sorted:\n        while remaining >= coin:\n            result.append(coin)\n            remaining -= coin\n    return result if remaining == 0 else None\n\ndef dp_coins(amount, coins, memo=None):\n    if memo is None:\n        memo = {}\n    if amount in memo:\n        return memo[amount]\n    if amount == 0:\n        return []\n    if amount < 0:\n        return None\n    \n    best = None\n    for coin in coins:\n        sub = dp_coins(amount - coin, coins, memo)\n        if sub is not None:\n            candidate = sub + [coin]\n            if best is None or len(candidate) < len(best):\n                best = candidate\n    \n    memo[amount] = best\n    return best\n\ncoins = [1, 3, 4]\namount = 6\n\nprint(f'Coins: {coins}, Amount: {amount}')\nprint()\ngreedy_result = greedy_coins(amount, coins)\nprint(f'Greedy: {greedy_result} ({len(greedy_result)} coins)')\n\ndp_result = dp_coins(amount, coins)\nprint(f'DP: {dp_result} ({len(dp_result)} coins)')\nprint()\nprint('Greedy picks 4 first, then needs 1+1')\nprint('DP finds optimal: 3+3')\nprint('\\nUse DP when greedy might miss optimal!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Greedy: 3 coins, DP: 2 coins", description: "Greedy fails" }]),
        hints: ["Greedy picks largest first", "4+1+1 = 3 coins", "3+3 = 2 coins (better!)"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson18_1_4.id,
        number: 4,
        title: "Verify Overlapping Subproblems",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "For the stair climbing problem, count how many times each subproblem is solved without memoization.",
        starterCode: "from collections import defaultdict\n\ncall_counts = defaultdict(int)\n\ndef climb_naive(n):\n    call_counts[n] += 1\n    if n <= 1:\n        return 1\n    if n == 2:\n        return 2\n    return climb_naive(n-1) + climb_naive(n-2)\n\nresult = climb_naive(10)\n\nprint(f'climb(10) = {result} ways')\nprint(f'\\nSubproblem call counts (without memoization):')\nfor k in sorted(call_counts.keys()):\n    print(f'  climb({k}): called {call_counts[k]} times')\n\nprint(f'\\nTotal calls: {sum(call_counts.values())}')\nprint('\\nSame subproblems solved many times!')\nprint('This proves overlapping subproblems exist → USE DP!')",
        solution: "from collections import defaultdict\n\ncall_counts = defaultdict(int)\n\ndef climb_naive(n):\n    call_counts[n] += 1\n    if n <= 1:\n        return 1\n    if n == 2:\n        return 2\n    return climb_naive(n-1) + climb_naive(n-2)\n\nresult = climb_naive(10)\n\nprint(f'climb(10) = {result} ways')\nprint(f'\\nSubproblem call counts (without memoization):')\nfor k in sorted(call_counts.keys()):\n    print(f'  climb({k}): called {call_counts[k]} times')\n\nprint(f'\\nTotal calls: {sum(call_counts.values())}')\nprint('\\nSame subproblems solved many times!')\nprint('This proves overlapping subproblems exist → USE DP!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Subproblems repeated many times", description: "Overlapping proven" }]),
        hints: ["Count each call", "Smaller subproblems called more", "With DP, each called only once"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson18_1_4.id,
        number: 5,
        title: "DP Problem Checklist",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a function that analyzes a recursive function and determines if DP would help.",
        starterCode: "def analyze_for_dp(problem_name, has_optimal_substructure, has_overlapping, \n                    naive_calls, memoized_calls):\n    print(f'=== Analysis: {problem_name} ===')\n    print()\n    \n    print('Checklist:')\n    print(f'  [{\"+\" if has_optimal_substructure else \"-\"}] Optimal substructure')\n    print(f'  [{\"+\" if has_overlapping else \"-\"}] Overlapping subproblems')\n    print()\n    \n    use_dp = has_optimal_substructure and has_overlapping\n    print(f'Recommendation: {\"USE DP!\" if use_dp else \"DP not needed\"}')\n    \n    if use_dp:\n        speedup = naive_calls / memoized_calls\n        print(f'\\nPotential speedup:')\n        print(f'  Naive calls: {naive_calls:,}')\n        print(f'  Memoized calls: {memoized_calls}')\n        print(f'  Speedup: {speedup:.0f}x faster!')\n    print()\n\n# Analyze Fibonacci\nanalyze_for_dp('Fibonacci', True, True, 177, 11)  # fib(10)\n\n# Analyze Binary Search\nanalyze_for_dp('Binary Search', True, False, 4, 4)  # Not improved by DP\n\n# Analyze Unique Grid Paths\nanalyze_for_dp('Grid Paths', True, True, 252, 25)  # 5x5 grid",
        solution: "def analyze_for_dp(problem_name, has_optimal_substructure, has_overlapping, \n                    naive_calls, memoized_calls):\n    print(f'=== Analysis: {problem_name} ===')\n    print()\n    \n    print('Checklist:')\n    print(f'  [{\"+\" if has_optimal_substructure else \"-\"}] Optimal substructure')\n    print(f'  [{\"+\" if has_overlapping else \"-\"}] Overlapping subproblems')\n    print()\n    \n    use_dp = has_optimal_substructure and has_overlapping\n    print(f'Recommendation: {\"USE DP!\" if use_dp else \"DP not needed\"}')\n    \n    if use_dp:\n        speedup = naive_calls / memoized_calls\n        print(f'\\nPotential speedup:')\n        print(f'  Naive calls: {naive_calls:,}')\n        print(f'  Memoized calls: {memoized_calls}')\n        print(f'  Speedup: {speedup:.0f}x faster!')\n    print()\n\nanalyze_for_dp('Fibonacci', True, True, 177, 11)\nanalyze_for_dp('Binary Search', True, False, 4, 4)\nanalyze_for_dp('Grid Paths', True, True, 252, 25)\n\nprint('Use this checklist to decide if DP helps!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Analysis for 3 problems", description: "DP decision framework" }]),
        hints: ["Both conditions must be true", "Binary search: no overlap", "Grid paths: lots of overlap"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 18.1.4`);

  console.log("\n✅ Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
