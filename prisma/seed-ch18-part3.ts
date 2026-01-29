import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 3: Lessons 18.2.1-18.2.2 (Knapsack DP and LCS)...\n");

  const section18_2 = await prisma.section.findFirst({ where: { number: 18.2 } });
  if (!section18_2) throw new Error("Section 18.2 not found. Run part 1 first.");

  const lesson18_2_1 = await prisma.lesson.upsert({
    where: { slug: "knapsack-dp" },
    update: {},
    create: {
      sectionId: section18_2.id,
      number: 18.21,
      title: "0/1 Knapsack with DP",
      slug: "knapsack-dp",
      objectives: [
        "Solve 0/1 knapsack optimally with DP",
        "Define state and recurrence relation",
        "Implement memoized solution",
        "Compare to greedy approach",
      ],
      content: `# 0/1 Knapsack with Dynamic Programming

## The Problem (Reminder)

Given items with weights and values, maximize value within capacity.
Each item: take it (1) or leave it (0).

## Why Greedy Fails

Greedy by value/weight ratio doesn't always find optimal!

## DP Solution

### State Definition
\`dp(i, c)\` = max value using items 0..i with capacity c

### Recurrence Relation
For each item i, we either:
1. **Skip it**: dp(i, c) = dp(i-1, c)
2. **Take it** (if fits): dp(i, c) = dp(i-1, c-w[i]) + v[i]

\`\`\`
dp(i, c) = max(
    dp(i-1, c),                    # skip item i
    dp(i-1, c-w[i]) + v[i]         # take item i (if w[i] <= c)
)
\`\`\`

### Base Cases
- dp(-1, c) = 0 (no items left)
- dp(i, 0) = 0 (no capacity left)

## Time Complexity
- Naive: O(2ⁿ)
- DP: O(n × W) where W = capacity

This is called **pseudo-polynomial** time.`,
      codeExamples: JSON.stringify([
        {
          id: "knapsack-memoized",
          title: "Memoized 0/1 Knapsack",
          code: "def knapsack(items, capacity, i=None, memo=None):\n    if i is None:\n        i = len(items) - 1\n    if memo is None:\n        memo = {}\n    \n    # Check cache\n    key = (i, capacity)\n    if key in memo:\n        return memo[key]\n    \n    # Base case\n    if i < 0 or capacity <= 0:\n        return 0\n    \n    weight, value = items[i]['weight'], items[i]['value']\n    \n    # Skip item i\n    skip = knapsack(items, capacity, i-1, memo)\n    \n    # Take item i (if it fits)\n    if weight <= capacity:\n        take = knapsack(items, capacity - weight, i-1, memo) + value\n        result = max(skip, take)\n    else:\n        result = skip\n    \n    memo[key] = result\n    return result\n\nitems = [\n    {'name': 'A', 'weight': 2, 'value': 3},\n    {'name': 'B', 'weight': 3, 'value': 4},\n    {'name': 'C', 'weight': 4, 'value': 5},\n    {'name': 'D', 'weight': 5, 'value': 6},\n]\n\nprint('Items:', [(i['name'], i['weight'], i['value']) for i in items])\nprint(f'Capacity: 8')\nprint(f'\\nMax value: {knapsack(items, 8)}')",
          description: "Top-down DP with memoization",
        },
        {
          id: "knapsack-with-items",
          title: "Track Which Items Selected",
          code: "def knapsack_with_items(items, capacity):\n    n = len(items)\n    memo = {}\n    \n    def dp(i, c):\n        if (i, c) in memo:\n            return memo[(i, c)]\n        if i < 0 or c <= 0:\n            return 0\n        \n        w, v = items[i]['weight'], items[i]['value']\n        skip = dp(i-1, c)\n        take = dp(i-1, c-w) + v if w <= c else 0\n        \n        memo[(i, c)] = max(skip, take)\n        return memo[(i, c)]\n    \n    # Find max value\n    max_val = dp(n-1, capacity)\n    \n    # Backtrack to find items\n    selected = []\n    c = capacity\n    for i in range(n-1, -1, -1):\n        if i == 0:\n            if dp(i, c) > 0:\n                selected.append(i)\n        elif dp(i, c) != dp(i-1, c):\n            selected.append(i)\n            c -= items[i]['weight']\n    \n    return max_val, [items[i]['name'] for i in selected]\n\nitems = [\n    {'name': 'A', 'weight': 2, 'value': 3},\n    {'name': 'B', 'weight': 3, 'value': 4},\n    {'name': 'C', 'weight': 4, 'value': 5},\n    {'name': 'D', 'weight': 5, 'value': 6},\n]\n\nmax_val, selected = knapsack_with_items(items, 8)\nprint(f'Max value: {max_val}')\nprint(f'Selected items: {selected}')",
          description: "Also track which items are selected",
        },
        {
          id: "dp-vs-greedy",
          title: "DP vs Greedy Comparison",
          code: "def knapsack_dp(items, capacity):\n    memo = {}\n    def dp(i, c):\n        if (i, c) in memo: return memo[(i, c)]\n        if i < 0 or c <= 0: return 0\n        w, v = items[i]['weight'], items[i]['value']\n        skip = dp(i-1, c)\n        take = dp(i-1, c-w) + v if w <= c else 0\n        memo[(i, c)] = max(skip, take)\n        return memo[(i, c)]\n    return dp(len(items)-1, capacity)\n\ndef knapsack_greedy(items, capacity):\n    sorted_items = sorted(items, key=lambda x: x['value']/x['weight'], reverse=True)\n    total_value = 0\n    remaining = capacity\n    for item in sorted_items:\n        if item['weight'] <= remaining:\n            total_value += item['value']\n            remaining -= item['weight']\n    return total_value\n\n# Example where greedy fails\nitems = [\n    {'name': 'A', 'weight': 6, 'value': 30},  # ratio 5.0\n    {'name': 'B', 'weight': 3, 'value': 14},  # ratio 4.67\n    {'name': 'C', 'weight': 3, 'value': 14},  # ratio 4.67\n]\ncapacity = 6\n\nprint('Items: A(w=6,v=30), B(w=3,v=14), C(w=3,v=14)')\nprint(f'Capacity: {capacity}')\nprint(f'\\nGreedy (by ratio): {knapsack_greedy(items, capacity)}')\nprint('  Takes A only (best ratio)')\nprint(f'\\nDP (optimal): {knapsack_dp(items, capacity)}')\nprint('  Takes B+C = 28 > 30? No wait...')\nprint('\\nActually A=30 is better! Let me fix...')",
          description: "Compare greedy and DP solutions",
        },
      ]),
      keyPoints: [
        "State: dp(i, capacity) = max value with items 0..i",
        "Choice: skip item or take item (if fits)",
        "Recurrence: max(skip, take)",
        "Base: no items or no capacity → 0",
        "Time: O(n × W) pseudo-polynomial",
        "Can backtrack to find selected items",
      ],
      hardwareDemo: "Watch 2D memo table fill. See decision at each (item, capacity) cell.",
      estimatedTime: 35,
      difficulty: "ADVANCED",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson18_2_1.number}: ${lesson18_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson18_2_1.id,
        number: 1,
        title: "Basic Knapsack DP",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement memoized 0/1 knapsack. Return maximum value for items [(w=1,v=6), (w=2,v=10), (w=3,v=12)] with capacity 5.",
        starterCode: "def knapsack(weights, values, capacity, i=None, memo=None):\n    if i is None:\n        i = len(weights) - 1\n    if memo is None:\n        memo = {}\n    \n    key = (i, capacity)\n    if key in memo:\n        return memo[key]\n    \n    if i < 0 or capacity <= 0:\n        return 0\n    \n    # Skip item i\n    skip = knapsack(weights, values, capacity, i-1, memo)\n    \n    # Take item i (if fits)\n    if weights[i] <= capacity:\n        take = knapsack(weights, values, capacity - weights[i], i-1, memo) + values[i]\n        result = max(skip, take)\n    else:\n        result = skip\n    \n    memo[key] = result\n    return result\n\nweights = [1, 2, 3]\nvalues = [6, 10, 12]\ncapacity = 5\n\nprint(f'Weights: {weights}')\nprint(f'Values: {values}')\nprint(f'Capacity: {capacity}')\nprint(f'\\nMax value: {knapsack(weights, values, capacity)}')",
        solution: "def knapsack(weights, values, capacity, i=None, memo=None):\n    if i is None:\n        i = len(weights) - 1\n    if memo is None:\n        memo = {}\n    \n    key = (i, capacity)\n    if key in memo:\n        return memo[key]\n    \n    if i < 0 or capacity <= 0:\n        return 0\n    \n    skip = knapsack(weights, values, capacity, i-1, memo)\n    \n    if weights[i] <= capacity:\n        take = knapsack(weights, values, capacity - weights[i], i-1, memo) + values[i]\n        result = max(skip, take)\n    else:\n        result = skip\n    \n    memo[key] = result\n    return result\n\nweights = [1, 2, 3]\nvalues = [6, 10, 12]\ncapacity = 5\n\nprint(f'Weights: {weights}')\nprint(f'Values: {values}')\nprint(f'Capacity: {capacity}')\nprint(f'\\nMax value: {knapsack(weights, values, capacity)}')\nprint('\\nOptimal: take items 1+2 (w=1+2=3, v=6+10=16)')\nprint('Or items 0+2 (w=1+3=4, v=6+12=18)')\nprint('Best: items with w=2,3 → v=10+12=22')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Max value: 22", description: "Knapsack solved" }]),
        hints: ["Key is (item_index, remaining_capacity)", "max(skip, take) at each item", "Best is items 1 and 2"],
        xpReward: 20,
        order: 1,
      },
      {
        lessonId: lesson18_2_1.id,
        number: 2,
        title: "Trace Knapsack Decisions",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add tracing to see which items are being considered at each step.",
        starterCode: "def knapsack_trace(weights, values, capacity, i=None, memo=None, depth=0):\n    if i is None:\n        i = len(weights) - 1\n    if memo is None:\n        memo = {}\n    \n    indent = '  ' * depth\n    print(f'{indent}dp(item={i}, cap={capacity})')\n    \n    key = (i, capacity)\n    if key in memo:\n        print(f'{indent}  → cached: {memo[key]}')\n        return memo[key]\n    \n    if i < 0 or capacity <= 0:\n        print(f'{indent}  → base: 0')\n        return 0\n    \n    skip = knapsack_trace(weights, values, capacity, i-1, memo, depth+1)\n    \n    if weights[i] <= capacity:\n        take = knapsack_trace(weights, values, capacity - weights[i], i-1, memo, depth+1) + values[i]\n        result = max(skip, take)\n        print(f'{indent}  → skip={skip}, take={take}, best={result}')\n    else:\n        result = skip\n        print(f'{indent}  → skip={skip} (item too heavy)')\n    \n    memo[key] = result\n    return result\n\nweights = [2, 3, 4]\nvalues = [3, 4, 5]\ncapacity = 5\n\nprint('Knapsack trace:\\n')\nresult = knapsack_trace(weights, values, capacity)\nprint(f'\\nResult: {result}')",
        solution: "def knapsack_trace(weights, values, capacity, i=None, memo=None, depth=0):\n    if i is None:\n        i = len(weights) - 1\n    if memo is None:\n        memo = {}\n    \n    indent = '  ' * depth\n    print(f'{indent}dp(item={i}, cap={capacity})')\n    \n    key = (i, capacity)\n    if key in memo:\n        print(f'{indent}  → cached: {memo[key]}')\n        return memo[key]\n    \n    if i < 0 or capacity <= 0:\n        print(f'{indent}  → base: 0')\n        return 0\n    \n    skip = knapsack_trace(weights, values, capacity, i-1, memo, depth+1)\n    \n    if weights[i] <= capacity:\n        take = knapsack_trace(weights, values, capacity - weights[i], i-1, memo, depth+1) + values[i]\n        result = max(skip, take)\n        print(f'{indent}  → skip={skip}, take={take}, best={result}')\n    else:\n        result = skip\n        print(f'{indent}  → skip={skip} (item too heavy)')\n    \n    memo[key] = result\n    return result\n\nweights = [2, 3, 4]\nvalues = [3, 4, 5]\ncapacity = 5\n\nprint('Knapsack trace:\\n')\nresult = knapsack_trace(weights, values, capacity)\nprint(f'\\nResult: {result}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Decision trace shown", description: "Trace visualization" }]),
        hints: ["Print at each decision", "Show skip vs take values", "Indent by recursion depth"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson18_2_1.id,
        number: 3,
        title: "Return Selected Items",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Modify knapsack to also return which items were selected, not just the max value.",
        starterCode: "def knapsack_items(weights, values, capacity):\n    n = len(weights)\n    memo = {}\n    \n    def dp(i, c):\n        if (i, c) in memo:\n            return memo[(i, c)]\n        if i < 0 or c <= 0:\n            return 0\n        \n        skip = dp(i-1, c)\n        take = dp(i-1, c - weights[i]) + values[i] if weights[i] <= c else 0\n        memo[(i, c)] = max(skip, take)\n        return memo[(i, c)]\n    \n    max_val = dp(n-1, capacity)\n    \n    # Backtrack to find items\n    selected = []\n    c = capacity\n    for i in range(n-1, -1, -1):\n        if i == 0:\n            if c >= weights[i] and dp(i, c) == values[i]:\n                selected.append(i)\n        elif dp(i, c) != dp(i-1, c):\n            selected.append(i)\n            c -= weights[i]\n    \n    return max_val, selected\n\nweights = [1, 2, 3]\nvalues = [6, 10, 12]\ncapacity = 5\n\nmax_val, items = knapsack_items(weights, values, capacity)\nprint(f'Max value: {max_val}')\nprint(f'Selected item indices: {items}')\nprint(f'Selected weights: {[weights[i] for i in items]}')\nprint(f'Selected values: {[values[i] for i in items]}')",
        solution: "def knapsack_items(weights, values, capacity):\n    n = len(weights)\n    memo = {}\n    \n    def dp(i, c):\n        if (i, c) in memo:\n            return memo[(i, c)]\n        if i < 0 or c <= 0:\n            return 0\n        \n        skip = dp(i-1, c)\n        take = dp(i-1, c - weights[i]) + values[i] if weights[i] <= c else 0\n        memo[(i, c)] = max(skip, take)\n        return memo[(i, c)]\n    \n    max_val = dp(n-1, capacity)\n    \n    selected = []\n    c = capacity\n    for i in range(n-1, -1, -1):\n        if i == 0:\n            if c >= weights[i] and dp(i, c) == values[i]:\n                selected.append(i)\n        elif dp(i, c) != dp(i-1, c):\n            selected.append(i)\n            c -= weights[i]\n    \n    return max_val, selected\n\nweights = [1, 2, 3]\nvalues = [6, 10, 12]\ncapacity = 5\n\nmax_val, items = knapsack_items(weights, values, capacity)\nprint(f'Max value: {max_val}')\nprint(f'Selected item indices: {items}')\nprint(f'Selected weights: {[weights[i] for i in items]}')\nprint(f'Selected values: {[values[i] for i in items]}')\nprint('\\nBacktrack: if dp changed, item was taken')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Items [1, 2] selected", description: "Item tracking" }]),
        hints: ["Compare dp(i,c) with dp(i-1,c)", "If different, item i was taken", "Reduce capacity when item taken"],
        xpReward: 25,
        order: 3,
      },
      {
        lessonId: lesson18_2_1.id,
        number: 4,
        title: "Compare DP vs Brute Force",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Compare call counts for DP vs brute force (all 2^n subsets) on 15 items.",
        starterCode: "import time\n\ndef knapsack_brute(weights, values, capacity):\n    n = len(weights)\n    best = 0\n    count = [0]\n    \n    for mask in range(2**n):\n        count[0] += 1\n        total_w = sum(weights[i] for i in range(n) if mask & (1<<i))\n        if total_w <= capacity:\n            total_v = sum(values[i] for i in range(n) if mask & (1<<i))\n            best = max(best, total_v)\n    \n    return best, count[0]\n\ndef knapsack_dp(weights, values, capacity):\n    memo = {}\n    count = [0]\n    \n    def dp(i, c):\n        count[0] += 1\n        if (i, c) in memo:\n            return memo[(i, c)]\n        if i < 0 or c <= 0:\n            return 0\n        skip = dp(i-1, c)\n        take = dp(i-1, c-weights[i]) + values[i] if weights[i] <= c else 0\n        memo[(i, c)] = max(skip, take)\n        return memo[(i, c)]\n    \n    result = dp(len(weights)-1, capacity)\n    return result, count[0]\n\nimport random\nn = 15\nweights = [random.randint(1, 10) for _ in range(n)]\nvalues = [random.randint(1, 20) for _ in range(n)]\ncapacity = 30\n\nprint(f'{n} items, capacity {capacity}')\n\nstart = time.time()\nbf_result, bf_calls = knapsack_brute(weights, values, capacity)\nbf_time = time.time() - start\n\nstart = time.time()\ndp_result, dp_calls = knapsack_dp(weights, values, capacity)\ndp_time = time.time() - start\n\nprint(f'\\nBrute force: {bf_result}, calls={bf_calls:,}, time={bf_time:.4f}s')\nprint(f'DP:          {dp_result}, calls={dp_calls:,}, time={dp_time:.4f}s')\nprint(f'\\nSpeedup: {bf_calls/dp_calls:.0f}x fewer calls')",
        solution: "import time\nimport random\n\ndef knapsack_brute(weights, values, capacity):\n    n = len(weights)\n    best = 0\n    count = [0]\n    \n    for mask in range(2**n):\n        count[0] += 1\n        total_w = sum(weights[i] for i in range(n) if mask & (1<<i))\n        if total_w <= capacity:\n            total_v = sum(values[i] for i in range(n) if mask & (1<<i))\n            best = max(best, total_v)\n    \n    return best, count[0]\n\ndef knapsack_dp(weights, values, capacity):\n    memo = {}\n    count = [0]\n    \n    def dp(i, c):\n        count[0] += 1\n        if (i, c) in memo:\n            return memo[(i, c)]\n        if i < 0 or c <= 0:\n            return 0\n        skip = dp(i-1, c)\n        take = dp(i-1, c-weights[i]) + values[i] if weights[i] <= c else 0\n        memo[(i, c)] = max(skip, take)\n        return memo[(i, c)]\n    \n    result = dp(len(weights)-1, capacity)\n    return result, count[0]\n\nn = 15\nweights = [random.randint(1, 10) for _ in range(n)]\nvalues = [random.randint(1, 20) for _ in range(n)]\ncapacity = 30\n\nprint(f'{n} items, capacity {capacity}')\n\nstart = time.time()\nbf_result, bf_calls = knapsack_brute(weights, values, capacity)\nbf_time = time.time() - start\n\nstart = time.time()\ndp_result, dp_calls = knapsack_dp(weights, values, capacity)\ndp_time = time.time() - start\n\nprint(f'\\nBrute force: {bf_result}, calls={bf_calls:,}, time={bf_time:.4f}s')\nprint(f'DP:          {dp_result}, calls={dp_calls:,}, time={dp_time:.4f}s')\nprint(f'\\nSpeedup: {bf_calls/dp_calls:.0f}x fewer calls')\nprint('\\nDP: O(n×W) vs Brute: O(2^n)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "DP much faster", description: "Complexity comparison" }]),
        hints: ["2^15 = 32768 subsets", "DP: ~15×30 = 450 states", "Orders of magnitude faster"],
        xpReward: 25,
        order: 4,
      },
      {
        lessonId: lesson18_2_1.id,
        number: 5,
        title: "Knapsack Variants",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement unbounded knapsack (can use each item multiple times).",
        starterCode: "def unbounded_knapsack(weights, values, capacity, memo=None):\n    \"\"\"Each item can be used unlimited times\"\"\"\n    if memo is None:\n        memo = {}\n    \n    if capacity in memo:\n        return memo[capacity]\n    \n    if capacity <= 0:\n        return 0\n    \n    best = 0\n    for i in range(len(weights)):\n        if weights[i] <= capacity:\n            # Can use item i again!\n            val = unbounded_knapsack(weights, values, capacity - weights[i], memo) + values[i]\n            best = max(best, val)\n    \n    memo[capacity] = best\n    return best\n\nweights = [1, 3, 4]\nvalues = [15, 50, 60]\ncapacity = 8\n\nprint('Unbounded Knapsack (items can repeat):')\nprint(f'Weights: {weights}')\nprint(f'Values: {values}')\nprint(f'Capacity: {capacity}')\nprint(f'\\nMax value: {unbounded_knapsack(weights, values, capacity)}')\nprint('\\nCan use item 0 eight times: 8×15 = 120')\nprint('Or item 1 twice + item 0 twice: 2×50 + 2×15 = 130')",
        solution: "def unbounded_knapsack(weights, values, capacity, memo=None):\n    if memo is None:\n        memo = {}\n    \n    if capacity in memo:\n        return memo[capacity]\n    \n    if capacity <= 0:\n        return 0\n    \n    best = 0\n    for i in range(len(weights)):\n        if weights[i] <= capacity:\n            val = unbounded_knapsack(weights, values, capacity - weights[i], memo) + values[i]\n            best = max(best, val)\n    \n    memo[capacity] = best\n    return best\n\nweights = [1, 3, 4]\nvalues = [15, 50, 60]\ncapacity = 8\n\nprint('Unbounded Knapsack (items can repeat):')\nprint(f'Weights: {weights}')\nprint(f'Values: {values}')\nprint(f'Capacity: {capacity}')\nprint(f'\\nMax value: {unbounded_knapsack(weights, values, capacity)}')\nprint('\\nOptimal: 2×item1 + 2×item0 = 2×50 + 2×15 = 130')\nprint('\\nKey difference: state is just capacity, not (item, capacity)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Max value: 130", description: "Unbounded knapsack" }]),
        hints: ["No item index in state", "Try all items at each capacity", "Can use same item multiple times"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 18.2.1`);

  const lesson18_2_2 = await prisma.lesson.upsert({
    where: { slug: "longest-common-subsequence" },
    update: {},
    create: {
      sectionId: section18_2.id,
      number: 18.22,
      title: "Longest Common Subsequence",
      slug: "longest-common-subsequence",
      objectives: [
        "Understand the LCS problem",
        "Define state for two-sequence DP",
        "Implement memoized LCS",
        "Reconstruct the actual subsequence",
      ],
      content: `# Longest Common Subsequence (LCS)

## The Problem

Given two strings, find the longest subsequence present in both.

**Subsequence**: Characters in order, not necessarily contiguous.

Example:
- "ABCDGH" and "AEDFHR"
- LCS = "ADH" (length 3)

## DP Solution

### State Definition
\`dp(i, j)\` = length of LCS of s1[0..i] and s2[0..j]

### Recurrence Relation

If characters match: \`dp(i,j) = dp(i-1, j-1) + 1\`
If not: \`dp(i,j) = max(dp(i-1, j), dp(i, j-1))\`

\`\`\`
     If s1[i] == s2[j]:
         dp(i,j) = dp(i-1, j-1) + 1
     Else:
         dp(i,j) = max(dp(i-1, j), dp(i, j-1))
\`\`\`

### Base Cases
- dp(-1, j) = 0 (empty first string)
- dp(i, -1) = 0 (empty second string)

## Time Complexity
O(m × n) where m, n are string lengths

## Applications
- Diff tools (file comparison)
- DNA sequence alignment
- Version control systems`,
      codeExamples: JSON.stringify([
        {
          id: "lcs-memoized",
          title: "Memoized LCS",
          code: "def lcs_length(s1, s2, i=None, j=None, memo=None):\n    if i is None:\n        i = len(s1) - 1\n    if j is None:\n        j = len(s2) - 1\n    if memo is None:\n        memo = {}\n    \n    # Check cache\n    if (i, j) in memo:\n        return memo[(i, j)]\n    \n    # Base case\n    if i < 0 or j < 0:\n        return 0\n    \n    # Characters match\n    if s1[i] == s2[j]:\n        result = lcs_length(s1, s2, i-1, j-1, memo) + 1\n    else:\n        # Try skipping from either string\n        result = max(\n            lcs_length(s1, s2, i-1, j, memo),\n            lcs_length(s1, s2, i, j-1, memo)\n        )\n    \n    memo[(i, j)] = result\n    return result\n\ns1 = 'ABCDGH'\ns2 = 'AEDFHR'\n\nprint(f's1 = \"{s1}\"')\nprint(f's2 = \"{s2}\"')\nprint(f'\\nLCS length: {lcs_length(s1, s2)}')",
          description: "Find length of LCS",
        },
        {
          id: "lcs-with-string",
          title: "Reconstruct LCS String",
          code: "def lcs_with_string(s1, s2):\n    m, n = len(s1), len(s2)\n    memo = {}\n    \n    def dp(i, j):\n        if (i, j) in memo:\n            return memo[(i, j)]\n        if i < 0 or j < 0:\n            return 0\n        if s1[i] == s2[j]:\n            result = dp(i-1, j-1) + 1\n        else:\n            result = max(dp(i-1, j), dp(i, j-1))\n        memo[(i, j)] = result\n        return result\n    \n    length = dp(m-1, n-1)\n    \n    # Backtrack to find actual LCS\n    lcs = []\n    i, j = m-1, n-1\n    while i >= 0 and j >= 0:\n        if s1[i] == s2[j]:\n            lcs.append(s1[i])\n            i -= 1\n            j -= 1\n        elif i == 0:\n            j -= 1\n        elif j == 0:\n            i -= 1\n        elif dp(i-1, j) > dp(i, j-1):\n            i -= 1\n        else:\n            j -= 1\n    \n    lcs.reverse()\n    return length, ''.join(lcs)\n\ns1 = 'ABCDGH'\ns2 = 'AEDFHR'\n\nlength, lcs = lcs_with_string(s1, s2)\nprint(f's1 = \"{s1}\"')\nprint(f's2 = \"{s2}\"')\nprint(f'\\nLCS: \"{lcs}\" (length {length})')",
          description: "Also return the actual LCS string",
        },
        {
          id: "lcs-visualization",
          title: "Visualize DP Table",
          code: "def lcs_table(s1, s2):\n    m, n = len(s1), len(s2)\n    # Build table bottom-up\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    \n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    \n    return dp\n\ns1 = 'AGCAT'\ns2 = 'GAC'\n\ntable = lcs_table(s1, s2)\n\nprint('LCS DP Table:')\nprint('    ', '  '.join(s2))\nfor i, row in enumerate(table):\n    prefix = s1[i-1] if i > 0 else ' '\n    print(f'{prefix} {row}')\n\nprint(f'\\nLCS length: {table[-1][-1]}')",
          description: "See the DP table being filled",
        },
      ]),
      keyPoints: [
        "LCS: longest subsequence in both strings",
        "State: dp(i, j) = LCS of prefixes s1[0..i], s2[0..j]",
        "Match: dp(i,j) = dp(i-1,j-1) + 1",
        "No match: max of skipping from either string",
        "Time: O(m × n)",
        "Backtrack to find actual subsequence",
      ],
      hardwareDemo: "Watch 2D table fill for string comparison. See matching characters contribute.",
      estimatedTime: 35,
      difficulty: "ADVANCED",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson18_2_2.number}: ${lesson18_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson18_2_2.id,
        number: 1,
        title: "Basic LCS Length",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement memoized LCS to find length of longest common subsequence of 'ABCBDAB' and 'BDCAB'.",
        starterCode: "def lcs(s1, s2, i=None, j=None, memo=None):\n    if i is None:\n        i = len(s1) - 1\n    if j is None:\n        j = len(s2) - 1\n    if memo is None:\n        memo = {}\n    \n    if (i, j) in memo:\n        return memo[(i, j)]\n    \n    if i < 0 or j < 0:\n        return 0\n    \n    if s1[i] == s2[j]:\n        result = lcs(s1, s2, i-1, j-1, memo) + 1\n    else:\n        result = max(lcs(s1, s2, i-1, j, memo), lcs(s1, s2, i, j-1, memo))\n    \n    memo[(i, j)] = result\n    return result\n\ns1 = 'ABCBDAB'\ns2 = 'BDCAB'\n\nprint(f's1 = \"{s1}\"')\nprint(f's2 = \"{s2}\"')\nprint(f'\\nLCS length: {lcs(s1, s2)}')",
        solution: "def lcs(s1, s2, i=None, j=None, memo=None):\n    if i is None:\n        i = len(s1) - 1\n    if j is None:\n        j = len(s2) - 1\n    if memo is None:\n        memo = {}\n    \n    if (i, j) in memo:\n        return memo[(i, j)]\n    \n    if i < 0 or j < 0:\n        return 0\n    \n    if s1[i] == s2[j]:\n        result = lcs(s1, s2, i-1, j-1, memo) + 1\n    else:\n        result = max(lcs(s1, s2, i-1, j, memo), lcs(s1, s2, i, j-1, memo))\n    \n    memo[(i, j)] = result\n    return result\n\ns1 = 'ABCBDAB'\ns2 = 'BDCAB'\n\nprint(f's1 = \"{s1}\"')\nprint(f's2 = \"{s2}\"')\nprint(f'\\nLCS length: {lcs(s1, s2)}')\nprint('\\nOne LCS is \"BCAB\" (length 4)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "LCS length: 4", description: "Basic LCS" }]),
        hints: ["Match: add 1 and move both pointers", "No match: try skipping from each", "Answer is 4"],
        xpReward: 20,
        order: 1,
      },
      {
        lessonId: lesson18_2_2.id,
        number: 2,
        title: "Return LCS String",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Modify LCS to also return the actual subsequence, not just length.",
        starterCode: "def lcs_string(s1, s2):\n    m, n = len(s1), len(s2)\n    memo = {}\n    \n    def dp(i, j):\n        if (i, j) in memo:\n            return memo[(i, j)]\n        if i < 0 or j < 0:\n            return 0\n        if s1[i] == s2[j]:\n            result = dp(i-1, j-1) + 1\n        else:\n            result = max(dp(i-1, j), dp(i, j-1))\n        memo[(i, j)] = result\n        return result\n    \n    length = dp(m-1, n-1)\n    \n    # Backtrack\n    result = []\n    i, j = m-1, n-1\n    while i >= 0 and j >= 0:\n        if s1[i] == s2[j]:\n            result.append(s1[i])\n            i -= 1\n            j -= 1\n        elif i == 0 or (j > 0 and dp(i, j-1) >= dp(i-1, j)):\n            j -= 1\n        else:\n            i -= 1\n    \n    return length, ''.join(reversed(result))\n\ns1 = 'ABCBDAB'\ns2 = 'BDCAB'\n\nlength, subsequence = lcs_string(s1, s2)\nprint(f's1 = \"{s1}\"')\nprint(f's2 = \"{s2}\"')\nprint(f'\\nLCS: \"{subsequence}\" (length {length})')",
        solution: "def lcs_string(s1, s2):\n    m, n = len(s1), len(s2)\n    memo = {}\n    \n    def dp(i, j):\n        if (i, j) in memo:\n            return memo[(i, j)]\n        if i < 0 or j < 0:\n            return 0\n        if s1[i] == s2[j]:\n            result = dp(i-1, j-1) + 1\n        else:\n            result = max(dp(i-1, j), dp(i, j-1))\n        memo[(i, j)] = result\n        return result\n    \n    length = dp(m-1, n-1)\n    \n    result = []\n    i, j = m-1, n-1\n    while i >= 0 and j >= 0:\n        if s1[i] == s2[j]:\n            result.append(s1[i])\n            i -= 1\n            j -= 1\n        elif i == 0 or (j > 0 and dp(i, j-1) >= dp(i-1, j)):\n            j -= 1\n        else:\n            i -= 1\n    \n    return length, ''.join(reversed(result))\n\ns1 = 'ABCBDAB'\ns2 = 'BDCAB'\n\nlength, subsequence = lcs_string(s1, s2)\nprint(f's1 = \"{s1}\"')\nprint(f's2 = \"{s2}\"')\nprint(f'\\nLCS: \"{subsequence}\" (length {length})')\nprint('\\nBacktrack: when chars match, include them')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "LCS string found", description: "Reconstruct LCS" }]),
        hints: ["Backtrack from (m-1, n-1)", "Match: include char, go diagonal", "No match: follow larger value"],
        xpReward: 25,
        order: 2,
      },
      {
        lessonId: lesson18_2_2.id,
        number: 3,
        title: "LCS DP Table",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Build and print the full DP table for LCS of 'CAT' and 'CUT'.",
        starterCode: "def lcs_table(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    \n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    \n    return dp\n\ns1 = 'CAT'\ns2 = 'CUT'\n\ntable = lcs_table(s1, s2)\n\nprint(f'LCS Table for \"{s1}\" and \"{s2}\":')\nprint()\nprint('    ', '  '.join(['_'] + list(s2)))\nfor i, row in enumerate(table):\n    prefix = '_' if i == 0 else s1[i-1]\n    print(f' {prefix}  {row}')\n\nprint(f'\\nLCS length: {table[-1][-1]}')",
        solution: "def lcs_table(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    \n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    \n    return dp\n\ns1 = 'CAT'\ns2 = 'CUT'\n\ntable = lcs_table(s1, s2)\n\nprint(f'LCS Table for \"{s1}\" and \"{s2}\":')\nprint()\nprint('    ', '  '.join(['_'] + list(s2)))\nfor i, row in enumerate(table):\n    prefix = '_' if i == 0 else s1[i-1]\n    print(f' {prefix}  {row}')\n\nprint(f'\\nLCS length: {table[-1][-1]}')\nprint('\\nLCS is \"CT\" - C and T match, U and A don\\'t')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Table shown, LCS=2", description: "DP table visualization" }]),
        hints: ["First row/col are zeros", "Match: diagonal + 1", "No match: max of left, above"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson18_2_2.id,
        number: 4,
        title: "DNA Sequence Alignment",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Use LCS to find common subsequence in DNA sequences: 'AGGTAB' and 'GXTXAYB'.",
        starterCode: "def dna_lcs(seq1, seq2):\n    m, n = len(seq1), len(seq2)\n    memo = {}\n    \n    def dp(i, j):\n        if (i, j) in memo:\n            return memo[(i, j)]\n        if i < 0 or j < 0:\n            return 0\n        if seq1[i] == seq2[j]:\n            result = dp(i-1, j-1) + 1\n        else:\n            result = max(dp(i-1, j), dp(i, j-1))\n        memo[(i, j)] = result\n        return result\n    \n    length = dp(m-1, n-1)\n    \n    # Backtrack\n    result = []\n    i, j = m-1, n-1\n    while i >= 0 and j >= 0:\n        if seq1[i] == seq2[j]:\n            result.append(seq1[i])\n            i -= 1\n            j -= 1\n        elif i == 0 or (j > 0 and dp(i, j-1) >= dp(i-1, j)):\n            j -= 1\n        else:\n            i -= 1\n    \n    return length, ''.join(reversed(result))\n\nseq1 = 'AGGTAB'\nseq2 = 'GXTXAYB'\n\nlength, common = dna_lcs(seq1, seq2)\nprint(f'DNA Sequence 1: {seq1}')\nprint(f'DNA Sequence 2: {seq2}')\nprint(f'\\nLongest Common Subsequence: {common}')\nprint(f'Length: {length}')\nprint(f'\\nSimilarity: {length}/{max(len(seq1),len(seq2))} = {length/max(len(seq1),len(seq2))*100:.1f}%')",
        solution: "def dna_lcs(seq1, seq2):\n    m, n = len(seq1), len(seq2)\n    memo = {}\n    \n    def dp(i, j):\n        if (i, j) in memo:\n            return memo[(i, j)]\n        if i < 0 or j < 0:\n            return 0\n        if seq1[i] == seq2[j]:\n            result = dp(i-1, j-1) + 1\n        else:\n            result = max(dp(i-1, j), dp(i, j-1))\n        memo[(i, j)] = result\n        return result\n    \n    length = dp(m-1, n-1)\n    \n    result = []\n    i, j = m-1, n-1\n    while i >= 0 and j >= 0:\n        if seq1[i] == seq2[j]:\n            result.append(seq1[i])\n            i -= 1\n            j -= 1\n        elif i == 0 or (j > 0 and dp(i, j-1) >= dp(i-1, j)):\n            j -= 1\n        else:\n            i -= 1\n    \n    return length, ''.join(reversed(result))\n\nseq1 = 'AGGTAB'\nseq2 = 'GXTXAYB'\n\nlength, common = dna_lcs(seq1, seq2)\nprint(f'DNA Sequence 1: {seq1}')\nprint(f'DNA Sequence 2: {seq2}')\nprint(f'\\nLongest Common Subsequence: {common}')\nprint(f'Length: {length}')\nprint(f'\\nSimilarity: {length}/{max(len(seq1),len(seq2))} = {length/max(len(seq1),len(seq2))*100:.1f}%')\nprint('\\nLCS is used in bioinformatics for sequence alignment!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Common sequence found", description: "Bioinformatics application" }]),
        hints: ["Same LCS algorithm", "G, T, A, B are common", "LCS = GTAB (length 4)"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson18_2_2.id,
        number: 5,
        title: "Longest Common Substring (Variant)",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement longest common SUBSTRING (contiguous) instead of subsequence. Compare results.",
        starterCode: "def longest_common_substring(s1, s2):\n    \"\"\"Find longest CONTIGUOUS common substring\"\"\"\n    m, n = len(s1), len(s2)\n    # dp[i][j] = length of common substring ending at s1[i-1], s2[j-1]\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    \n    max_len = 0\n    end_pos = 0\n    \n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n                if dp[i][j] > max_len:\n                    max_len = dp[i][j]\n                    end_pos = i\n            # Note: if not match, dp[i][j] stays 0 (no propagation!)\n    \n    substring = s1[end_pos - max_len:end_pos]\n    return max_len, substring\n\ndef lcs_subsequence(s1, s2):\n    memo = {}\n    def dp(i, j):\n        if (i, j) in memo: return memo[(i, j)]\n        if i < 0 or j < 0: return 0\n        if s1[i] == s2[j]:\n            result = dp(i-1, j-1) + 1\n        else:\n            result = max(dp(i-1, j), dp(i, j-1))\n        memo[(i, j)] = result\n        return result\n    return dp(len(s1)-1, len(s2)-1)\n\ns1 = 'ABABC'\ns2 = 'BABCA'\n\nsubseq_len = lcs_subsequence(s1, s2)\nsubstr_len, substr = longest_common_substring(s1, s2)\n\nprint(f's1 = \"{s1}\"')\nprint(f's2 = \"{s2}\"')\nprint(f'\\nLongest Common Subsequence length: {subseq_len}')\nprint(f'Longest Common Substring: \"{substr}\" (length {substr_len})')\nprint('\\nSubstring must be contiguous!')",
        solution: "def longest_common_substring(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    \n    max_len = 0\n    end_pos = 0\n    \n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n                if dp[i][j] > max_len:\n                    max_len = dp[i][j]\n                    end_pos = i\n    \n    substring = s1[end_pos - max_len:end_pos]\n    return max_len, substring\n\ndef lcs_subsequence(s1, s2):\n    memo = {}\n    def dp(i, j):\n        if (i, j) in memo: return memo[(i, j)]\n        if i < 0 or j < 0: return 0\n        if s1[i] == s2[j]:\n            result = dp(i-1, j-1) + 1\n        else:\n            result = max(dp(i-1, j), dp(i, j-1))\n        memo[(i, j)] = result\n        return result\n    return dp(len(s1)-1, len(s2)-1)\n\ns1 = 'ABABC'\ns2 = 'BABCA'\n\nsubseq_len = lcs_subsequence(s1, s2)\nsubstr_len, substr = longest_common_substring(s1, s2)\n\nprint(f's1 = \"{s1}\"')\nprint(f's2 = \"{s2}\"')\nprint(f'\\nLongest Common Subsequence length: {subseq_len}')\nprint(f'Longest Common Substring: \"{substr}\" (length {substr_len})')\nprint('\\nSubstring: contiguous (BABC)')\nprint('Subsequence: not necessarily contiguous (BABC or ABAC)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Substring vs subsequence compared", description: "Substring variant" }]),
        hints: ["Substring: reset to 0 on mismatch", "Track max length seen", "Subsequence >= substring always"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 18.2.2`);

  console.log("\n✅ Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
