import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 2: Lessons 17.1.3-17.1.4 (Greedy and Brute Force)...\n");

  const section17_1 = await prisma.section.findFirst({ where: { number: 17.1 } });
  if (!section17_1) throw new Error("Section 17.1 not found. Run part 1 first.");

  const lesson17_1_3 = await prisma.lesson.upsert({
    where: { slug: "greedy-algorithms-knapsack" },
    update: {},
    create: {
      sectionId: section17_1.id,
      number: 17.13,
      title: "Greedy Algorithms for Knapsack",
      slug: "greedy-algorithms-knapsack",
      objectives: [
        "Understand the greedy approach",
        "Implement greedy by value, weight, and density",
        "Compare different greedy strategies",
        "Know when greedy fails to find optimal",
      ],
      content: `# Greedy Algorithms for Knapsack

## What is a Greedy Algorithm?

Make the **locally best choice** at each step, hoping for a globally good solution.

Simple, fast, but not always optimal!

## Greedy Strategies for Knapsack

**1. Greedy by Value**
Take highest-value items first.

**2. Greedy by Weight**
Take lightest items first (fit more items).

**3. Greedy by Density (Value/Weight)**
Take highest value-per-weight items first.

## Algorithm (Greedy by Density)

\`\`\`
1. Sort items by value/weight (descending)
2. For each item in sorted order:
   - If it fits, take it
   - If not, skip it
3. Return selected items
\`\`\`

## Time Complexity

- Sorting: O(n log n)
- Selection: O(n)
- **Total: O(n log n)** - Very fast!

## The Catch

Greedy doesn't always find the **optimal** solution!
But it's fast and often finds a **good** solution.`,
      codeExamples: JSON.stringify([
        {
          id: "greedy-density",
          title: "Greedy by Density",
          code: "def greedy_knapsack(items, capacity):\n    # Sort by value/weight ratio (descending)\n    sorted_items = sorted(items, \n                          key=lambda x: x['value']/x['weight'],\n                          reverse=True)\n    \n    selected = []\n    total_weight = 0\n    total_value = 0\n    \n    for item in sorted_items:\n        if total_weight + item['weight'] <= capacity:\n            selected.append(item['name'])\n            total_weight += item['weight']\n            total_value += item['value']\n    \n    return selected, total_value, total_weight\n\nitems = [\n    {'name': 'A', 'weight': 4, 'value': 40},\n    {'name': 'B', 'weight': 3, 'value': 45},\n    {'name': 'C', 'weight': 2, 'value': 36},\n    {'name': 'D', 'weight': 1, 'value': 10},\n]\n\nselected, value, weight = greedy_knapsack(items, 6)\nprint(f'Selected: {selected}')\nprint(f'Total value: {value}')\nprint(f'Total weight: {weight}')",
          description: "Take items with best value/weight ratio",
        },
        {
          id: "compare-strategies",
          title: "Compare Greedy Strategies",
          code: "def greedy_by_value(items, capacity):\n    sorted_items = sorted(items, key=lambda x: x['value'], reverse=True)\n    selected, weight = [], 0\n    for item in sorted_items:\n        if weight + item['weight'] <= capacity:\n            selected.append(item['name'])\n            weight += item['weight']\n    return selected, sum(items[ord(n)-ord('A')]['value'] for n in selected)\n\ndef greedy_by_weight(items, capacity):\n    sorted_items = sorted(items, key=lambda x: x['weight'])\n    selected, weight = [], 0\n    for item in sorted_items:\n        if weight + item['weight'] <= capacity:\n            selected.append(item['name'])\n            weight += item['weight']\n    return selected, sum(items[ord(n)-ord('A')]['value'] for n in selected)\n\nitems = [\n    {'name': 'A', 'weight': 5, 'value': 100},\n    {'name': 'B', 'weight': 3, 'value': 70},\n    {'name': 'C', 'weight': 2, 'value': 50},\n    {'name': 'D', 'weight': 1, 'value': 10},\n]\n\nprint('Capacity = 6')\nprint(f'By value:  {greedy_by_value(items, 6)}')\nprint(f'By weight: {greedy_by_weight(items, 6)}')",
          description: "Different strategies give different results",
        },
        {
          id: "greedy-fails",
          title: "When Greedy Fails",
          code: "# Example where greedy is NOT optimal\nitems = [\n    {'name': 'A', 'weight': 5, 'value': 60},   # density 12\n    {'name': 'B', 'weight': 3, 'value': 50},   # density 16.7 (best!)\n    {'name': 'C', 'weight': 3, 'value': 50},   # density 16.7\n]\ncapacity = 6\n\n# Greedy by density picks B first, then can't fit A or C\n# Gets B only = value 50\n\n# But optimal is A + something that fits... or B + C!\n# B + C = value 100!\n\nprint('Items: A(w=5,v=60), B(w=3,v=50), C(w=3,v=50)')\nprint('Capacity: 6')\nprint()\nprint('Greedy by density:')\nprint('  Picks B (density 16.7), then nothing else fits')\nprint('  Value: 50')\nprint()\nprint('Optimal: B + C')\nprint('  Weight: 3 + 3 = 6')\nprint('  Value: 50 + 50 = 100')\nprint()\nprint('Greedy missed the optimal by 50!')",
          description: "Greedy can miss optimal solution",
        },
      ]),
      keyPoints: [
        "Greedy: make locally best choice at each step",
        "Greedy by density often works well",
        "Time complexity: O(n log n) - very fast",
        "Greedy does NOT guarantee optimal solution",
        "Use when speed matters more than perfection",
        "Good for approximation when optimal is too slow",
      ],
      hardwareDemo: "Watch sorting comparison operations. See item selection decisions.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson17_1_3.number}: ${lesson17_1_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson17_1_3.id,
        number: 1,
        title: "Greedy by Value",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement greedy algorithm that takes highest-value items first. Test with capacity=7.",
        starterCode: "def greedy_by_value(items, capacity):\n    sorted_items = sorted(items, key=lambda x: x['value'], reverse=True)\n    selected = []\n    total_weight = 0\n    \n    for item in sorted_items:\n        if total_weight + item['weight'] <= capacity:\n            selected.append(item['name'])\n            total_weight += item['weight']\n    \n    total_value = sum(i['value'] for i in items if i['name'] in selected)\n    return selected, total_value\n\nitems = [\n    {'name': 'A', 'weight': 3, 'value': 30},\n    {'name': 'B', 'weight': 4, 'value': 50},\n    {'name': 'C', 'weight': 2, 'value': 20},\n    {'name': 'D', 'weight': 5, 'value': 60},\n]\n\nselected, value = greedy_by_value(items, 7)\nprint(f'Selected: {selected}')\nprint(f'Total value: {value}')",
        solution: "def greedy_by_value(items, capacity):\n    sorted_items = sorted(items, key=lambda x: x['value'], reverse=True)\n    selected = []\n    total_weight = 0\n    \n    for item in sorted_items:\n        if total_weight + item['weight'] <= capacity:\n            selected.append(item['name'])\n            total_weight += item['weight']\n    \n    total_value = sum(i['value'] for i in items if i['name'] in selected)\n    return selected, total_value\n\nitems = [\n    {'name': 'A', 'weight': 3, 'value': 30},\n    {'name': 'B', 'weight': 4, 'value': 50},\n    {'name': 'C', 'weight': 2, 'value': 20},\n    {'name': 'D', 'weight': 5, 'value': 60},\n]\n\nselected, value = greedy_by_value(items, 7)\nprint(f'Selected: {selected}')\nprint(f'Total value: {value}')\nprint('\\nTakes D (60) first, then C (20) fits')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "D, C selected, value=80", description: "Greedy by value" }]),
        hints: ["Sort by value descending", "D has highest value (60)", "After D (w=5), only C (w=2) fits"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson17_1_3.id,
        number: 2,
        title: "Greedy by Density",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement greedy algorithm that takes highest value/weight ratio items first. Test with capacity=8.",
        starterCode: "def greedy_by_density(items, capacity):\n    # Add density to each item\n    for item in items:\n        item['density'] = item['value'] / item['weight']\n    \n    sorted_items = sorted(items, key=lambda x: x['density'], reverse=True)\n    selected = []\n    total_weight = 0\n    total_value = 0\n    \n    for item in sorted_items:\n        if total_weight + item['weight'] <= capacity:\n            selected.append(item['name'])\n            total_weight += item['weight']\n            total_value += item['value']\n    \n    return selected, total_value, total_weight\n\nitems = [\n    {'name': 'A', 'weight': 4, 'value': 40},   # density 10\n    {'name': 'B', 'weight': 2, 'value': 30},   # density 15\n    {'name': 'C', 'weight': 3, 'value': 36},   # density 12\n    {'name': 'D', 'weight': 5, 'value': 50},   # density 10\n]\n\nselected, value, weight = greedy_by_density(items, 8)\nprint(f'Selected: {selected}')\nprint(f'Value: {value}, Weight: {weight}')",
        solution: "def greedy_by_density(items, capacity):\n    for item in items:\n        item['density'] = item['value'] / item['weight']\n    \n    sorted_items = sorted(items, key=lambda x: x['density'], reverse=True)\n    selected = []\n    total_weight = 0\n    total_value = 0\n    \n    for item in sorted_items:\n        if total_weight + item['weight'] <= capacity:\n            selected.append(item['name'])\n            total_weight += item['weight']\n            total_value += item['value']\n    \n    return selected, total_value, total_weight\n\nitems = [\n    {'name': 'A', 'weight': 4, 'value': 40},\n    {'name': 'B', 'weight': 2, 'value': 30},\n    {'name': 'C', 'weight': 3, 'value': 36},\n    {'name': 'D', 'weight': 5, 'value': 50},\n]\n\nselected, value, weight = greedy_by_density(items, 8)\nprint(f'Selected: {selected}')\nprint(f'Value: {value}, Weight: {weight}')\nprint('\\nOrder: B(15), C(12), A(10), D(10)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "B, C, A? selected", description: "Greedy by density" }]),
        hints: ["B has highest density (15)", "Then C (12), then try A or D", "Check what fits in capacity 8"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson17_1_3.id,
        number: 3,
        title: "Compare All Strategies",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Run all 3 greedy strategies (value, weight, density) on same items. Compare results.",
        starterCode: "items = [\n    {'name': 'A', 'weight': 4, 'value': 80},\n    {'name': 'B', 'weight': 3, 'value': 45},\n    {'name': 'C', 'weight': 2, 'value': 40},\n    {'name': 'D', 'weight': 1, 'value': 15},\n]\ncapacity = 6\n\ndef greedy(items, capacity, key_func, reverse=True):\n    sorted_items = sorted(items, key=key_func, reverse=reverse)\n    selected, weight, value = [], 0, 0\n    for item in sorted_items:\n        if weight + item['weight'] <= capacity:\n            selected.append(item['name'])\n            weight += item['weight']\n            value += item['value']\n    return selected, value\n\nprint(f'Capacity: {capacity}')\nprint(f\"By value:   {greedy(items, capacity, lambda x: x['value'])}\")\nprint(f\"By weight:  {greedy(items, capacity, lambda x: x['weight'], False)}\")\nprint(f\"By density: {greedy(items, capacity, lambda x: x['value']/x['weight'])}\")",
        solution: "items = [\n    {'name': 'A', 'weight': 4, 'value': 80},\n    {'name': 'B', 'weight': 3, 'value': 45},\n    {'name': 'C', 'weight': 2, 'value': 40},\n    {'name': 'D', 'weight': 1, 'value': 15},\n]\ncapacity = 6\n\ndef greedy(items, capacity, key_func, reverse=True):\n    sorted_items = sorted(items, key=key_func, reverse=reverse)\n    selected, weight, value = [], 0, 0\n    for item in sorted_items:\n        if weight + item['weight'] <= capacity:\n            selected.append(item['name'])\n            weight += item['weight']\n            value += item['value']\n    return selected, value\n\nprint(f'Capacity: {capacity}')\nprint(f\"By value:   {greedy(items, capacity, lambda x: x['value'])}\")\nprint(f\"By weight:  {greedy(items, capacity, lambda x: x['weight'], False)}\")\nprint(f\"By density: {greedy(items, capacity, lambda x: x['value']/x['weight'])}\")\nprint('\\nDifferent strategies can give different results!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "3 different results", description: "Strategy comparison" }]),
        hints: ["Value: A first (80)", "Weight: D, C, B order", "Density: A (20), C (20), B (15), D (15)"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson17_1_3.id,
        number: 4,
        title: "Find Greedy Failure Case",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Show a case where greedy by density fails. Items: A(w=6,v=30), B(w=3,v=14), C(w=3,v=14). Capacity=6.",
        starterCode: "items = [\n    {'name': 'A', 'weight': 6, 'value': 30},  # density 5\n    {'name': 'B', 'weight': 3, 'value': 14},  # density 4.67\n    {'name': 'C', 'weight': 3, 'value': 14},  # density 4.67\n]\ncapacity = 6\n\n# Greedy by density\nfor item in items:\n    item['density'] = item['value'] / item['weight']\n\nsorted_items = sorted(items, key=lambda x: x['density'], reverse=True)\ngreedy_selected = []\ngreedy_weight = 0\ngreedy_value = 0\n\nfor item in sorted_items:\n    if greedy_weight + item['weight'] <= capacity:\n        greedy_selected.append(item['name'])\n        greedy_weight += item['weight']\n        greedy_value += item['value']\n\nprint('Greedy by density:')\nprint(f'  Selected: {greedy_selected}')\nprint(f'  Value: {greedy_value}')\n\nprint('\\nOptimal (B + C):')\nprint(f'  Selected: [B, C]')\nprint(f'  Value: 28')\nprint(f'\\nGreedy got {greedy_value}, optimal is 28!')",
        solution: "items = [\n    {'name': 'A', 'weight': 6, 'value': 30},\n    {'name': 'B', 'weight': 3, 'value': 14},\n    {'name': 'C', 'weight': 3, 'value': 14},\n]\ncapacity = 6\n\nfor item in items:\n    item['density'] = item['value'] / item['weight']\n\nsorted_items = sorted(items, key=lambda x: x['density'], reverse=True)\ngreedy_selected = []\ngreedy_weight = 0\ngreedy_value = 0\n\nfor item in sorted_items:\n    if greedy_weight + item['weight'] <= capacity:\n        greedy_selected.append(item['name'])\n        greedy_weight += item['weight']\n        greedy_value += item['value']\n\nprint('Greedy by density:')\nprint(f'  Selected: {greedy_selected}')\nprint(f'  Value: {greedy_value}')\n\nprint('\\nOptimal (B + C):')\nprint(f'  Selected: [B, C]')\nprint(f'  Value: 28')\nprint(f'\\nGreedy got {greedy_value}, optimal is 28!')\nprint('Greedy fails because A blocks B+C!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Greedy=30, Optimal=28... wait", description: "Greedy analysis" }]),
        hints: ["A has highest density (5)", "Greedy takes A, fills capacity", "But B+C together = 28, A alone = 30"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson17_1_3.id,
        number: 5,
        title: "Greedy with Trace",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement greedy by density with step-by-step trace showing each decision.",
        starterCode: "def greedy_with_trace(items, capacity):\n    for item in items:\n        item['density'] = item['value'] / item['weight']\n    \n    sorted_items = sorted(items, key=lambda x: x['density'], reverse=True)\n    \n    print('Items sorted by density:')\n    for item in sorted_items:\n        print(f\"  {item['name']}: density={item['density']:.2f}\")\n    print()\n    \n    selected = []\n    remaining_cap = capacity\n    total_value = 0\n    \n    for item in sorted_items:\n        if item['weight'] <= remaining_cap:\n            print(f\"✓ Take {item['name']} (w={item['weight']}, v={item['value']})\")\n            selected.append(item['name'])\n            remaining_cap -= item['weight']\n            total_value += item['value']\n            print(f\"  Remaining capacity: {remaining_cap}\")\n        else:\n            print(f\"✗ Skip {item['name']} (w={item['weight']} > {remaining_cap})\")\n    \n    return selected, total_value\n\nitems = [\n    {'name': 'A', 'weight': 3, 'value': 60},\n    {'name': 'B', 'weight': 2, 'value': 50},\n    {'name': 'C', 'weight': 4, 'value': 70},\n    {'name': 'D', 'weight': 1, 'value': 10},\n]\n\nprint('=== Greedy Knapsack (capacity=5) ===\\n')\nselected, value = greedy_with_trace(items, 5)\nprint(f'\\nFinal: {selected}, value={value}')",
        solution: "def greedy_with_trace(items, capacity):\n    for item in items:\n        item['density'] = item['value'] / item['weight']\n    \n    sorted_items = sorted(items, key=lambda x: x['density'], reverse=True)\n    \n    print('Items sorted by density:')\n    for item in sorted_items:\n        print(f\"  {item['name']}: density={item['density']:.2f}\")\n    print()\n    \n    selected = []\n    remaining_cap = capacity\n    total_value = 0\n    \n    for item in sorted_items:\n        if item['weight'] <= remaining_cap:\n            print(f\"✓ Take {item['name']} (w={item['weight']}, v={item['value']})\")\n            selected.append(item['name'])\n            remaining_cap -= item['weight']\n            total_value += item['value']\n            print(f\"  Remaining capacity: {remaining_cap}\")\n        else:\n            print(f\"✗ Skip {item['name']} (w={item['weight']} > {remaining_cap})\")\n    \n    return selected, total_value\n\nitems = [\n    {'name': 'A', 'weight': 3, 'value': 60},\n    {'name': 'B', 'weight': 2, 'value': 50},\n    {'name': 'C', 'weight': 4, 'value': 70},\n    {'name': 'D', 'weight': 1, 'value': 10},\n]\n\nprint('=== Greedy Knapsack (capacity=5) ===\\n')\nselected, value = greedy_with_trace(items, 5)\nprint(f'\\nFinal: {selected}, value={value}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Step-by-step trace", description: "Traced execution" }]),
        hints: ["Print each decision", "Show remaining capacity", "Mark taken vs skipped"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 17.1.3`);

  const lesson17_1_4 = await prisma.lesson.upsert({
    where: { slug: "brute-force-vs-greedy" },
    update: {},
    create: {
      sectionId: section17_1.id,
      number: 17.14,
      title: "Brute Force vs Greedy Tradeoffs",
      slug: "brute-force-vs-greedy",
      objectives: [
        "Implement brute force exhaustive search",
        "Compare brute force and greedy results",
        "Understand time-quality tradeoffs",
        "Know when to use each approach",
      ],
      content: `# Brute Force vs Greedy Tradeoffs

## Brute Force (Exhaustive Search)

Check **every** possible combination, keep the best feasible one.

**Pros**: Guarantees optimal solution
**Cons**: Exponential time O(2ⁿ)

## Algorithm

\`\`\`
For each subset of items:
    If total weight <= capacity:
        If total value > best so far:
            Update best solution
Return best solution
\`\`\`

## Generating All Subsets

Use binary counting: numbers 0 to 2ⁿ-1 represent all subsets.

Example (3 items):
- 0 = 000 = {}
- 1 = 001 = {A}
- 2 = 010 = {B}
- 3 = 011 = {A, B}
- ...

## The Tradeoff

| Approach | Time | Quality |
|----------|------|---------|
| Greedy | O(n log n) | Good, not optimal |
| Brute Force | O(2ⁿ) | Optimal |

## When to Use What

- **n ≤ 20**: Brute force is feasible
- **n > 30**: Brute force too slow, use greedy
- **Need optimal**: Must use brute force (or dynamic programming)
- **Need fast**: Use greedy, accept approximation`,
      codeExamples: JSON.stringify([
        {
          id: "brute-force",
          title: "Brute Force Knapsack",
          code: "def brute_force_knapsack(items, capacity):\n    n = len(items)\n    best_value = 0\n    best_selection = []\n    \n    # Try all 2^n subsets\n    for i in range(2**n):\n        selection = []\n        total_weight = 0\n        total_value = 0\n        \n        for j in range(n):\n            if i & (1 << j):  # Item j is in subset\n                selection.append(j)\n                total_weight += items[j]['weight']\n                total_value += items[j]['value']\n        \n        # Check if feasible and better\n        if total_weight <= capacity and total_value > best_value:\n            best_value = total_value\n            best_selection = selection\n    \n    return best_selection, best_value\n\nitems = [\n    {'name': 'A', 'weight': 3, 'value': 60},\n    {'name': 'B', 'weight': 2, 'value': 40},\n    {'name': 'C', 'weight': 4, 'value': 70},\n    {'name': 'D', 'weight': 1, 'value': 15},\n]\n\nselection, value = brute_force_knapsack(items, 5)\nprint(f'Optimal selection: {[items[i][\"name\"] for i in selection]}')\nprint(f'Optimal value: {value}')",
          description: "Try all combinations to find optimum",
        },
        {
          id: "compare-methods",
          title: "Compare Brute Force vs Greedy",
          code: "def brute_force(items, capacity):\n    n = len(items)\n    best_val, best_sel = 0, []\n    for i in range(2**n):\n        sel, wt, val = [], 0, 0\n        for j in range(n):\n            if i & (1<<j):\n                sel.append(j)\n                wt += items[j]['weight']\n                val += items[j]['value']\n        if wt <= capacity and val > best_val:\n            best_val, best_sel = val, sel\n    return [items[i]['name'] for i in best_sel], best_val\n\ndef greedy(items, capacity):\n    sorted_items = sorted(enumerate(items), \n                          key=lambda x: x[1]['value']/x[1]['weight'],\n                          reverse=True)\n    sel, wt, val = [], 0, 0\n    for idx, item in sorted_items:\n        if wt + item['weight'] <= capacity:\n            sel.append(item['name'])\n            wt += item['weight']\n            val += item['value']\n    return sel, val\n\nitems = [\n    {'name': 'A', 'weight': 6, 'value': 30},\n    {'name': 'B', 'weight': 3, 'value': 14},\n    {'name': 'C', 'weight': 3, 'value': 14},\n]\n\nprint('Capacity = 6')\nprint(f'Brute force: {brute_force(items, 6)}')\nprint(f'Greedy:      {greedy(items, 6)}')",
          description: "Side-by-side comparison",
        },
        {
          id: "timing-comparison",
          title: "Time Comparison",
          code: "import time\n\ndef brute_force(n):\n    count = 0\n    for i in range(2**n):\n        count += 1  # Simulate work\n    return count\n\ndef greedy(n):\n    items = list(range(n))\n    items.sort()  # O(n log n)\n    return len(items)\n\nprint('n     Brute Force    Greedy')\nfor n in [10, 15, 18, 20]:\n    start = time.time()\n    brute_force(n)\n    bf_time = time.time() - start\n    \n    start = time.time()\n    for _ in range(1000):  # Run greedy 1000x to measure\n        greedy(n)\n    g_time = (time.time() - start) / 1000\n    \n    print(f'{n:2d}    {bf_time:.4f}s        {g_time:.6f}s')",
          description: "Time grows exponentially for brute force",
        },
      ]),
      keyPoints: [
        "Brute force: O(2ⁿ) time, optimal solution",
        "Greedy: O(n log n) time, approximate solution",
        "Use bitmask to generate all subsets",
        "n ≤ 20: brute force feasible",
        "n > 30: greedy or other approximations",
        "Always compare results when possible",
      ],
      hardwareDemo: "Watch exponential loop iterations. Compare to linear greedy passes.",
      estimatedTime: 30,
      difficulty: "ADVANCED",
      order: 4,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson17_1_4.number}: ${lesson17_1_4.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson17_1_4.id,
        number: 1,
        title: "Generate All Subsets",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Generate all 8 subsets of items ['A', 'B', 'C'] using bitmask technique. Print each subset.",
        starterCode: "items = ['A', 'B', 'C']\nn = len(items)\n\nprint(f'All {2**n} subsets of {items}:')\nfor i in range(2**n):\n    subset = []\n    for j in range(n):\n        if i & (1 << j):\n            subset.append(items[j])\n    print(f'  {i}: {subset}')",
        solution: "items = ['A', 'B', 'C']\nn = len(items)\n\nprint(f'All {2**n} subsets of {items}:')\nfor i in range(2**n):\n    subset = []\n    for j in range(n):\n        if i & (1 << j):\n            subset.append(items[j])\n    print(f'  {i}: {subset}')\n\nprint('\\nBitmask trick: bit j set means include item j')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "8 subsets listed", description: "All subsets generated" }]),
        hints: ["2^3 = 8 subsets", "i & (1 << j) checks if bit j is set", "0 = empty, 7 = all items"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson17_1_4.id,
        number: 2,
        title: "Brute Force Knapsack",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement brute force knapsack for items A(w=2,v=30), B(w=3,v=40), C(w=4,v=50), D(w=5,v=60). Capacity=8.",
        starterCode: "items = [\n    {'name': 'A', 'weight': 2, 'value': 30},\n    {'name': 'B', 'weight': 3, 'value': 40},\n    {'name': 'C', 'weight': 4, 'value': 50},\n    {'name': 'D', 'weight': 5, 'value': 60},\n]\ncapacity = 8\n\nbest_value = 0\nbest_items = []\n\nfor i in range(2**len(items)):\n    selected = []\n    weight = 0\n    value = 0\n    \n    for j in range(len(items)):\n        if i & (1 << j):\n            selected.append(items[j]['name'])\n            weight += items[j]['weight']\n            value += items[j]['value']\n    \n    if weight <= capacity and value > best_value:\n        best_value = value\n        best_items = selected\n\nprint(f'Optimal selection: {best_items}')\nprint(f'Optimal value: {best_value}')",
        solution: "items = [\n    {'name': 'A', 'weight': 2, 'value': 30},\n    {'name': 'B', 'weight': 3, 'value': 40},\n    {'name': 'C', 'weight': 4, 'value': 50},\n    {'name': 'D', 'weight': 5, 'value': 60},\n]\ncapacity = 8\n\nbest_value = 0\nbest_items = []\n\nfor i in range(2**len(items)):\n    selected = []\n    weight = 0\n    value = 0\n    \n    for j in range(len(items)):\n        if i & (1 << j):\n            selected.append(items[j]['name'])\n            weight += items[j]['weight']\n            value += items[j]['value']\n    \n    if weight <= capacity and value > best_value:\n        best_value = value\n        best_items = selected\n\nprint(f'Optimal selection: {best_items}')\nprint(f'Optimal value: {best_value}')\nprint(f'Checked {2**len(items)} combinations')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Optimal found", description: "Brute force works" }]),
        hints: ["Check all 16 subsets", "Keep track of best feasible", "A+B+C or B+D might be optimal"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson17_1_4.id,
        number: 3,
        title: "Compare Brute Force and Greedy",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Run both algorithms on same items. Show case where they differ.",
        starterCode: "items = [\n    {'name': 'A', 'weight': 6, 'value': 30},\n    {'name': 'B', 'weight': 3, 'value': 14},\n    {'name': 'C', 'weight': 3, 'value': 14},\n]\ncapacity = 6\n\n# Brute force\nbest_bf = ([], 0)\nfor i in range(2**len(items)):\n    sel, wt, val = [], 0, 0\n    for j in range(len(items)):\n        if i & (1<<j):\n            sel.append(items[j]['name'])\n            wt += items[j]['weight']\n            val += items[j]['value']\n    if wt <= capacity and val > best_bf[1]:\n        best_bf = (sel, val)\n\n# Greedy by density\nsorted_items = sorted(items, key=lambda x: x['value']/x['weight'], reverse=True)\ngreedy_sel, greedy_wt, greedy_val = [], 0, 0\nfor item in sorted_items:\n    if greedy_wt + item['weight'] <= capacity:\n        greedy_sel.append(item['name'])\n        greedy_wt += item['weight']\n        greedy_val += item['value']\n\nprint(f'Brute force: {best_bf}')\nprint(f'Greedy:      {(greedy_sel, greedy_val)}')\nprint(f'Same result? {best_bf[1] == greedy_val}')",
        solution: "items = [\n    {'name': 'A', 'weight': 6, 'value': 30},\n    {'name': 'B', 'weight': 3, 'value': 14},\n    {'name': 'C', 'weight': 3, 'value': 14},\n]\ncapacity = 6\n\nbest_bf = ([], 0)\nfor i in range(2**len(items)):\n    sel, wt, val = [], 0, 0\n    for j in range(len(items)):\n        if i & (1<<j):\n            sel.append(items[j]['name'])\n            wt += items[j]['weight']\n            val += items[j]['value']\n    if wt <= capacity and val > best_bf[1]:\n        best_bf = (sel, val)\n\nsorted_items = sorted(items, key=lambda x: x['value']/x['weight'], reverse=True)\ngreedy_sel, greedy_wt, greedy_val = [], 0, 0\nfor item in sorted_items:\n    if greedy_wt + item['weight'] <= capacity:\n        greedy_sel.append(item['name'])\n        greedy_wt += item['weight']\n        greedy_val += item['value']\n\nprint(f'Brute force: {best_bf}')\nprint(f'Greedy:      {(greedy_sel, greedy_val)}')\nprint(f'Same result? {best_bf[1] == greedy_val}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Results compared", description: "Comparison shown" }]),
        hints: ["Brute force finds true optimal", "Greedy picks A (highest density)", "B+C together may beat A"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson17_1_4.id,
        number: 4,
        title: "Time Comparison",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Measure time for brute force with n=10, 15, 18 items. Show exponential growth.",
        starterCode: "import time\n\ndef brute_force_time(n):\n    # Simulate checking all subsets\n    for i in range(2**n):\n        _ = bin(i).count('1')  # Some work\n\nprint('n     Subsets       Time')\nfor n in [10, 15, 18]:\n    start = time.time()\n    brute_force_time(n)\n    elapsed = time.time() - start\n    print(f'{n:2d}    {2**n:10,}    {elapsed:.3f}s')",
        solution: "import time\n\ndef brute_force_time(n):\n    for i in range(2**n):\n        _ = bin(i).count('1')\n\nprint('n     Subsets       Time')\nfor n in [10, 15, 18]:\n    start = time.time()\n    brute_force_time(n)\n    elapsed = time.time() - start\n    print(f'{n:2d}    {2**n:10,}    {elapsed:.3f}s')\n\nprint('\\nTime roughly doubles for each +1 to n!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Exponential time growth", description: "O(2^n) demonstrated" }]),
        hints: ["2^15 = 32,768", "2^18 = 262,144", "Time grows exponentially"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson17_1_4.id,
        number: 5,
        title: "Best of Both",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write function that uses brute force if n<=15, else greedy. Test with n=10 and n=20.",
        starterCode: "import random\n\ndef smart_knapsack(items, capacity):\n    n = len(items)\n    \n    if n <= 15:\n        # Brute force\n        best_val, best_sel = 0, []\n        for i in range(2**n):\n            sel, wt, val = [], 0, 0\n            for j in range(n):\n                if i & (1<<j):\n                    sel.append(j)\n                    wt += items[j]['weight']\n                    val += items[j]['value']\n            if wt <= capacity and val > best_val:\n                best_val, best_sel = val, sel\n        return 'brute_force', best_sel, best_val\n    else:\n        # Greedy\n        sorted_idx = sorted(range(n), \n                           key=lambda i: items[i]['value']/items[i]['weight'],\n                           reverse=True)\n        sel, wt, val = [], 0, 0\n        for i in sorted_idx:\n            if wt + items[i]['weight'] <= capacity:\n                sel.append(i)\n                wt += items[i]['weight']\n                val += items[i]['value']\n        return 'greedy', sel, val\n\n# Test with n=10\nitems10 = [{'weight': random.randint(1,10), 'value': random.randint(10,100)} for _ in range(10)]\nprint(f'n=10: {smart_knapsack(items10, 30)}')\n\n# Test with n=20\nitems20 = [{'weight': random.randint(1,10), 'value': random.randint(10,100)} for _ in range(20)]\nprint(f'n=20: {smart_knapsack(items20, 50)}')",
        solution: "import random\n\ndef smart_knapsack(items, capacity):\n    n = len(items)\n    \n    if n <= 15:\n        best_val, best_sel = 0, []\n        for i in range(2**n):\n            sel, wt, val = [], 0, 0\n            for j in range(n):\n                if i & (1<<j):\n                    sel.append(j)\n                    wt += items[j]['weight']\n                    val += items[j]['value']\n            if wt <= capacity and val > best_val:\n                best_val, best_sel = val, sel\n        return 'brute_force', best_sel, best_val\n    else:\n        sorted_idx = sorted(range(n), \n                           key=lambda i: items[i]['value']/items[i]['weight'],\n                           reverse=True)\n        sel, wt, val = [], 0, 0\n        for i in sorted_idx:\n            if wt + items[i]['weight'] <= capacity:\n                sel.append(i)\n                wt += items[i]['weight']\n                val += items[i]['value']\n        return 'greedy', sel, val\n\nitems10 = [{'weight': random.randint(1,10), 'value': random.randint(10,100)} for _ in range(10)]\nprint(f'n=10: {smart_knapsack(items10, 30)}')\n\nitems20 = [{'weight': random.randint(1,10), 'value': random.randint(10,100)} for _ in range(20)]\nprint(f'n=20: {smart_knapsack(items20, 50)}')\n\nprint('\\nSmart: optimal when feasible, fast otherwise!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Brute for n=10, greedy for n=20", description: "Adaptive algorithm" }]),
        hints: ["Check n to decide algorithm", "n<=15: brute force feasible", "n>15: use greedy approximation"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 17.1.4`);

  console.log("\n✅ Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
