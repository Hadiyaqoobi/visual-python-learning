import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 1: Chapter 17 structure + Lessons 17.1.1-17.1.2...\n");

  const chapter17 = await prisma.chapter.upsert({
    where: { number: 17 },
    update: {},
    create: {
      number: 17,
      title: "Knapsack and Graph Optimization Problems",
      description: "Learn fundamental optimization techniques including the knapsack problem, greedy algorithms, and graph-based algorithms like DFS, BFS, and shortest path finding.",
      objectives: [
        "Understand optimization problem structure",
        "Implement greedy and exhaustive algorithms",
        "Represent graphs in Python",
        "Traverse graphs with DFS and BFS",
        "Find shortest paths in graphs",
      ],
      isPublished: true,
    },
  });
  console.log(`✅ Chapter ${chapter17.number}: ${chapter17.title}`);

  const section17_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter17.id, number: 17.1 } },
    update: {},
    create: {
      chapterId: chapter17.id,
      number: 17.1,
      title: "The Knapsack Problem",
      description: "Learn optimization through the classic knapsack problem.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section17_1.number}: ${section17_1.title}`);

  const section17_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter17.id, number: 17.2 } },
    update: {},
    create: {
      chapterId: chapter17.id,
      number: 17.2,
      title: "Graph Theory Fundamentals",
      description: "Represent and traverse graphs with DFS and BFS.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section17_2.number}: ${section17_2.title}`);

  const section17_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter17.id, number: 17.3 } },
    update: {},
    create: {
      chapterId: chapter17.id,
      number: 17.3,
      title: "Shortest Path Algorithms",
      description: "Find optimal paths through weighted graphs.",
      order: 3,
    },
  });
  console.log(`  📂 Section ${section17_3.number}: ${section17_3.title}`);

  const lesson17_1_1 = await prisma.lesson.upsert({
    where: { slug: "intro-optimization-problems" },
    update: {},
    create: {
      sectionId: section17_1.id,
      number: 17.11,
      title: "Introduction to Optimization Problems",
      slug: "intro-optimization-problems",
      objectives: [
        "Understand what optimization problems are",
        "Identify objective functions and constraints",
        "Recognize optimization problems in real life",
        "Understand feasibility vs optimality",
      ],
      content: `# Introduction to Optimization Problems

## What is Optimization?

Finding the **best** solution among many possible solutions.

**Components:**
1. **Decision variables**: What we can control
2. **Objective function**: What we want to maximize or minimize
3. **Constraints**: Rules that limit our choices

## Example: Planning a Road Trip

- **Variables**: Which cities to visit
- **Objective**: Maximize sights seen
- **Constraints**: Limited time and budget

## Feasible vs Optimal Solutions

**Feasible**: Satisfies all constraints
**Optimal**: Best feasible solution (maximizes/minimizes objective)

Many feasible solutions exist, but we want THE BEST one!

## Types of Optimization

| Type | Example |
|------|---------|
| Maximization | Maximize profit |
| Minimization | Minimize cost |
| Constrained | Limited budget |
| Unconstrained | No restrictions |

## Why It's Hard

With n items, there can be 2ⁿ possible combinations!
- 10 items → 1,024 combinations
- 20 items → 1,048,576 combinations
- 30 items → over 1 billion!`,
      codeExamples: JSON.stringify([
        {
          id: "simple-optimization",
          title: "Simple Optimization Example",
          code: "# Maximize: value = 3x + 2y\n# Constraint: x + y <= 10, x >= 0, y >= 0\n\nbest_value = 0\nbest_x, best_y = 0, 0\n\n# Try all integer combinations\nfor x in range(11):\n    for y in range(11):\n        if x + y <= 10:  # Feasible?\n            value = 3*x + 2*y\n            if value > best_value:\n                best_value = value\n                best_x, best_y = x, y\n\nprint(f'Best solution: x={best_x}, y={best_y}')\nprint(f'Maximum value: {best_value}')",
          description: "Find best x,y to maximize 3x+2y",
        },
        {
          id: "counting-solutions",
          title: "Counting Possible Solutions",
          code: "# With n items, each can be included or not\n# That's 2^n combinations!\n\nprint('Items    Combinations')\nfor n in range(1, 21):\n    combinations = 2 ** n\n    if combinations < 1_000_000:\n        print(f'{n:5d}    {combinations:,}')\n    else:\n        print(f'{n:5d}    {combinations:,} (too many to check!)')",
          description: "Exponential growth of solution space",
        },
        {
          id: "real-world-example",
          title: "Real-World: Investment Portfolio",
          code: "# Choose investments to maximize return\n# Constraint: total investment <= $10,000\n\ninvestments = [\n    {'name': 'Stock A', 'cost': 3000, 'return': 400},\n    {'name': 'Stock B', 'cost': 4000, 'return': 500},\n    {'name': 'Stock C', 'cost': 5000, 'return': 650},\n    {'name': 'Bond D', 'cost': 2000, 'return': 200},\n]\n\nbudget = 10000\n\nprint('Investment Optimization Problem:')\nprint(f'Budget: ${budget}')\nprint('\\nOptions:')\nfor inv in investments:\n    roi = inv['return'] / inv['cost'] * 100\n    print(f\"  {inv['name']}: ${inv['cost']} → ${inv['return']} return ({roi:.1f}% ROI)\")\n\nprint('\\nGoal: Which investments maximize total return?')",
          description: "Optimization in finance",
        },
      ]),
      keyPoints: [
        "Optimization finds the best solution among many",
        "Objective function defines what to maximize/minimize",
        "Constraints limit which solutions are feasible",
        "Solution space grows exponentially with problem size",
        "Feasible ≠ Optimal (good enough vs best)",
        "Real problems: scheduling, budgeting, routing",
      ],
      hardwareDemo: "Watch solution space enumeration. See objective function evaluation for each candidate.",
      estimatedTime: 20,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson17_1_1.number}: ${lesson17_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson17_1_1.id,
        number: 1,
        title: "Identify Optimization Components",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "For a meal planning problem (maximize nutrition, budget constraint), print the objective function and constraint.",
        starterCode: "# Meal planning optimization\n\nprint('=== Meal Planning Optimization ===')\nprint('\\nObjective: Maximize total nutrition score')\nprint('Constraint: Total cost <= $50 weekly budget')\nprint('Decision variables: Which meals to prepare')\n\n# Example meals\nmeals = [\n    {'name': 'Salad', 'nutrition': 8, 'cost': 5},\n    {'name': 'Pasta', 'nutrition': 6, 'cost': 4},\n    {'name': 'Steak', 'nutrition': 9, 'cost': 15},\n]\n\nprint('\\nAvailable meals:')\nfor m in meals:\n    print(f\"  {m['name']}: nutrition={m['nutrition']}, cost=${m['cost']}\")",
        solution: "# Meal planning optimization\n\nprint('=== Meal Planning Optimization ===')\nprint('\\nObjective: Maximize total nutrition score')\nprint('Constraint: Total cost <= $50 weekly budget')\nprint('Decision variables: Which meals to prepare')\n\nmeals = [\n    {'name': 'Salad', 'nutrition': 8, 'cost': 5},\n    {'name': 'Pasta', 'nutrition': 6, 'cost': 4},\n    {'name': 'Steak', 'nutrition': 9, 'cost': 15},\n]\n\nprint('\\nAvailable meals:')\nfor m in meals:\n    print(f\"  {m['name']}: nutrition={m['nutrition']}, cost=${m['cost']}\")\n\nprint('\\nThis is an optimization problem!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Objective and constraint identified", description: "Problem structure" }]),
        hints: ["What do we want to maximize?", "What limits our choices?", "What can we decide?"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson17_1_1.id,
        number: 2,
        title: "Count Solution Space",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Calculate and print how many possible subsets exist for 5, 10, 15, and 20 items (2^n for each).",
        starterCode: "print('Number of possible subsets (2^n):')\nprint('Items    Subsets')\n\nfor n in [5, 10, 15, 20]:\n    subsets = 2 ** n\n    print(f'{n:5d}    {subsets:,}')",
        solution: "print('Number of possible subsets (2^n):')\nprint('Items    Subsets')\n\nfor n in [5, 10, 15, 20]:\n    subsets = 2 ** n\n    print(f'{n:5d}    {subsets:,}')\n\nprint('\\nGrows exponentially - checking all is impractical!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "5→32, 10→1024, 15→32768, 20→1048576", description: "Exponential growth" }]),
        hints: ["2^5 = 32", "2^10 = 1024", "This is exponential growth"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson17_1_1.id,
        number: 3,
        title: "Simple 2-Variable Optimization",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Maximize profit = 5x + 3y subject to x + y <= 8, x >= 0, y >= 0. Find optimal x, y by trying all integer combinations.",
        starterCode: "best_profit = 0\nbest_x, best_y = 0, 0\n\nfor x in range(9):  # 0 to 8\n    for y in range(9):\n        if x + y <= 8:  # Constraint\n            profit = 5*x + 3*y\n            if profit > best_profit:\n                best_profit = profit\n                best_x, best_y = x, y\n\nprint(f'Optimal: x={best_x}, y={best_y}')\nprint(f'Maximum profit: {best_profit}')",
        solution: "best_profit = 0\nbest_x, best_y = 0, 0\n\nfor x in range(9):\n    for y in range(9):\n        if x + y <= 8:\n            profit = 5*x + 3*y\n            if profit > best_profit:\n                best_profit = profit\n                best_x, best_y = x, y\n\nprint(f'Optimal: x={best_x}, y={best_y}')\nprint(f'Maximum profit: {best_profit}')\nprint('\\nAll of x is used (higher coefficient)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "x=8, y=0, profit=40", description: "Correct optimum" }]),
        hints: ["x has higher profit (5 vs 3)", "Use all capacity for x", "Check: 5×8 + 3×0 = 40"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson17_1_1.id,
        number: 4,
        title: "Feasibility Check",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given items with weights [3, 4, 5, 2] and capacity 10, enumerate all 16 subsets and count how many are feasible (total weight <= 10).",
        starterCode: "weights = [3, 4, 5, 2]\ncapacity = 10\n\nfeasible_count = 0\n\n# Generate all 2^4 = 16 subsets\nfor i in range(16):\n    # Convert i to binary to determine which items to include\n    subset = []\n    total_weight = 0\n    for j in range(4):\n        if i & (1 << j):  # Bit j is set\n            subset.append(j)\n            total_weight += weights[j]\n    \n    if total_weight <= capacity:\n        feasible_count += 1\n        print(f'Items {subset}: weight={total_weight} ✓')\n\nprint(f'\\nFeasible subsets: {feasible_count} out of 16')",
        solution: "weights = [3, 4, 5, 2]\ncapacity = 10\n\nfeasible_count = 0\n\nfor i in range(16):\n    subset = []\n    total_weight = 0\n    for j in range(4):\n        if i & (1 << j):\n            subset.append(j)\n            total_weight += weights[j]\n    \n    if total_weight <= capacity:\n        feasible_count += 1\n        print(f'Items {subset}: weight={total_weight} ✓')\n\nprint(f'\\nFeasible subsets: {feasible_count} out of 16')\nprint('Not all subsets are feasible!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Feasible count shown", description: "Feasibility enumeration" }]),
        hints: ["Use bitmask to generate subsets", "Check if total weight <= capacity", "Some subsets exceed capacity"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson17_1_1.id,
        number: 5,
        title: "Time Complexity Demo",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Measure time to enumerate all subsets for n=10, 15, 18, 20 items. Show how time grows exponentially.",
        starterCode: "import time\n\ndef enumerate_subsets(n):\n    count = 0\n    for i in range(2**n):\n        count += 1  # Just counting\n    return count\n\nprint('n     Subsets       Time (sec)')\nfor n in [10, 15, 18, 20]:\n    start = time.time()\n    count = enumerate_subsets(n)\n    elapsed = time.time() - start\n    print(f'{n:2d}    {count:10,}    {elapsed:.4f}')",
        solution: "import time\n\ndef enumerate_subsets(n):\n    count = 0\n    for i in range(2**n):\n        count += 1\n    return count\n\nprint('n     Subsets       Time (sec)')\nfor n in [10, 15, 18, 20]:\n    start = time.time()\n    count = enumerate_subsets(n)\n    elapsed = time.time() - start\n    print(f'{n:2d}    {count:10,}    {elapsed:.4f}')\n\nprint('\\nTime grows exponentially with n!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Time increases rapidly", description: "Exponential time" }]),
        hints: ["Each +5 items = ~32x more work", "n=20 has ~1 million subsets", "This is O(2^n) complexity"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 17.1.1`);

  const lesson17_1_2 = await prisma.lesson.upsert({
    where: { slug: "knapsack-problem" },
    update: {},
    create: {
      sectionId: section17_1.id,
      number: 17.12,
      title: "The Knapsack Problem",
      slug: "knapsack-problem",
      objectives: [
        "Understand the 0/1 knapsack problem",
        "Define items with weight and value",
        "Express knapsack as an optimization problem",
        "Recognize real-world knapsack scenarios",
      ],
      content: `# The Knapsack Problem

## Problem Statement

You have a knapsack with limited capacity.
You have items, each with a weight and value.
**Goal**: Maximize total value without exceeding capacity.

## 0/1 Knapsack

"0/1" means each item is either:
- **0**: Not included
- **1**: Included

No partial items! Take it or leave it.

## Formal Definition

Given:
- n items with weights w₁, w₂, ..., wₙ
- Values v₁, v₂, ..., vₙ  
- Knapsack capacity W

**Maximize**: Σ(vᵢ × xᵢ) where xᵢ ∈ {0, 1}
**Subject to**: Σ(wᵢ × xᵢ) ≤ W

## Classic Example

| Item | Weight | Value |
|------|--------|-------|
| Gold | 5 | 100 |
| Silver | 3 | 70 |
| Bronze | 2 | 40 |
| Iron | 1 | 10 |

Capacity = 6. What do we take?

## Real-World Applications

- **Cargo loading**: Max value in truck
- **Budget allocation**: Best projects within budget
- **Memory management**: Best data to cache
- **Cutting stock**: Minimize waste when cutting`,
      codeExamples: JSON.stringify([
        {
          id: "knapsack-setup",
          title: "Setting Up a Knapsack Problem",
          code: "# Define items as list of dictionaries\nitems = [\n    {'name': 'Gold', 'weight': 5, 'value': 100},\n    {'name': 'Silver', 'weight': 3, 'value': 70},\n    {'name': 'Bronze', 'weight': 2, 'value': 40},\n    {'name': 'Iron', 'weight': 1, 'value': 10},\n]\n\ncapacity = 6\n\nprint('Knapsack Problem:')\nprint(f'Capacity: {capacity}')\nprint('\\nItems:')\nfor item in items:\n    ratio = item['value'] / item['weight']\n    print(f\"  {item['name']}: w={item['weight']}, v={item['value']}, v/w={ratio:.1f}\")",
          description: "Define items and capacity",
        },
        {
          id: "item-class",
          title: "Using a Class for Items",
          code: "class Item:\n    def __init__(self, name, weight, value):\n        self.name = name\n        self.weight = weight\n        self.value = value\n    \n    def value_per_weight(self):\n        return self.value / self.weight\n    \n    def __repr__(self):\n        return f'{self.name}(w={self.weight}, v={self.value})'\n\n# Create items\nitems = [\n    Item('Laptop', 3, 2000),\n    Item('Camera', 1, 1500),\n    Item('Book', 2, 100),\n    Item('Phone', 1, 800),\n]\n\nprint('Items sorted by value/weight ratio:')\nfor item in sorted(items, key=lambda x: x.value_per_weight(), reverse=True):\n    print(f'  {item}: ratio={item.value_per_weight():.0f}')",
          description: "Object-oriented item representation",
        },
        {
          id: "real-world-knapsack",
          title: "Real-World: Packing for Trip",
          code: "# Packing for a hiking trip\n# Backpack capacity: 15 kg\n\nitems = [\n    {'name': 'Tent', 'weight': 4, 'value': 10},  # Essential\n    {'name': 'Sleeping bag', 'weight': 2, 'value': 9},\n    {'name': 'Food', 'weight': 5, 'value': 8},\n    {'name': 'Water', 'weight': 3, 'value': 10},  # Essential\n    {'name': 'Camera', 'weight': 1, 'value': 5},\n    {'name': 'Book', 'weight': 1, 'value': 2},\n    {'name': 'First aid', 'weight': 1, 'value': 7},\n]\n\ncapacity = 15\n\nprint(f'Backpack capacity: {capacity} kg')\nprint(f'Total weight of all items: {sum(i[\"weight\"] for i in items)} kg')\nprint('\\nMust choose wisely - can\\'t take everything!')\n\ntotal_possible_value = sum(i['value'] for i in items)\nprint(f'Total possible value: {total_possible_value}')",
          description: "Practical packing problem",
        },
      ]),
      keyPoints: [
        "0/1 Knapsack: include item fully or not at all",
        "Each item has weight and value",
        "Goal: maximize value within weight capacity",
        "Value/weight ratio helps identify good items",
        "Real applications: cargo, budgets, memory",
        "NP-hard problem - no fast exact algorithm for large n",
      ],
      hardwareDemo: "Watch item data structures in memory. See weight and value comparisons.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson17_1_2.number}: ${lesson17_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson17_1_2.id,
        number: 1,
        title: "Create Item List",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a list of 4 items with name, weight, and value. Print each item's value-to-weight ratio.",
        starterCode: "items = [\n    {'name': 'Diamond', 'weight': 1, 'value': 500},\n    {'name': 'Gold bar', 'weight': 5, 'value': 400},\n    {'name': 'Silver', 'weight': 3, 'value': 150},\n    {'name': 'Copper', 'weight': 4, 'value': 80},\n]\n\nprint('Item          Weight  Value   Ratio')\nfor item in items:\n    ratio = item['value'] / item['weight']\n    print(f\"{item['name']:12s}  {item['weight']:5d}  {item['value']:5d}   {ratio:.1f}\")",
        solution: "items = [\n    {'name': 'Diamond', 'weight': 1, 'value': 500},\n    {'name': 'Gold bar', 'weight': 5, 'value': 400},\n    {'name': 'Silver', 'weight': 3, 'value': 150},\n    {'name': 'Copper', 'weight': 4, 'value': 80},\n]\n\nprint('Item          Weight  Value   Ratio')\nfor item in items:\n    ratio = item['value'] / item['weight']\n    print(f\"{item['name']:12s}  {item['weight']:5d}  {item['value']:5d}   {ratio:.1f}\")\n\nprint('\\nHigher ratio = more value per unit weight')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "4 items with ratios", description: "Item list created" }]),
        hints: ["ratio = value / weight", "Diamond has ratio 500", "Higher ratio = better"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson17_1_2.id,
        number: 2,
        title: "Check Feasibility",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given items and capacity=10, check if selection [0, 1, 3] (items at indices 0, 1, 3) is feasible.",
        starterCode: "items = [\n    {'name': 'A', 'weight': 4, 'value': 40},\n    {'name': 'B', 'weight': 5, 'value': 50},\n    {'name': 'C', 'weight': 6, 'value': 60},\n    {'name': 'D', 'weight': 3, 'value': 30},\n]\n\ncapacity = 10\nselection = [0, 1, 3]  # Items A, B, D\n\ntotal_weight = sum(items[i]['weight'] for i in selection)\ntotal_value = sum(items[i]['value'] for i in selection)\n\nprint(f'Selected items: {[items[i][\"name\"] for i in selection]}')\nprint(f'Total weight: {total_weight}')\nprint(f'Total value: {total_value}')\nprint(f'Capacity: {capacity}')\nprint(f'Feasible: {total_weight <= capacity}')",
        solution: "items = [\n    {'name': 'A', 'weight': 4, 'value': 40},\n    {'name': 'B', 'weight': 5, 'value': 50},\n    {'name': 'C', 'weight': 6, 'value': 60},\n    {'name': 'D', 'weight': 3, 'value': 30},\n]\n\ncapacity = 10\nselection = [0, 1, 3]\n\ntotal_weight = sum(items[i]['weight'] for i in selection)\ntotal_value = sum(items[i]['value'] for i in selection)\n\nprint(f'Selected items: {[items[i][\"name\"] for i in selection]}')\nprint(f'Total weight: {total_weight}')\nprint(f'Total value: {total_value}')\nprint(f'Capacity: {capacity}')\nprint(f'Feasible: {total_weight <= capacity}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Feasible: False (weight=12)", description: "Infeasible selection" }]),
        hints: ["Sum weights of selected items", "4 + 5 + 3 = 12", "12 > 10, so not feasible"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson17_1_2.id,
        number: 3,
        title: "Item Class",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create an Item class with name, weight, value, and a method density() that returns value/weight. Create 3 items and print their densities.",
        starterCode: "class Item:\n    def __init__(self, name, weight, value):\n        self.name = name\n        self.weight = weight\n        self.value = value\n    \n    def density(self):\n        return self.value / self.weight\n    \n    def __str__(self):\n        return f'{self.name}(w={self.weight}, v={self.value})'\n\nitems = [\n    Item('Gem', 1, 200),\n    Item('Gold', 4, 400),\n    Item('Art', 3, 180),\n]\n\nprint('Items and densities:')\nfor item in items:\n    print(f'  {item}: density={item.density():.1f}')",
        solution: "class Item:\n    def __init__(self, name, weight, value):\n        self.name = name\n        self.weight = weight\n        self.value = value\n    \n    def density(self):\n        return self.value / self.weight\n    \n    def __str__(self):\n        return f'{self.name}(w={self.weight}, v={self.value})'\n\nitems = [\n    Item('Gem', 1, 200),\n    Item('Gold', 4, 400),\n    Item('Art', 3, 180),\n]\n\nprint('Items and densities:')\nfor item in items:\n    print(f'  {item}: density={item.density():.1f}')\n\nprint('\\nGem has highest density (200/1=200)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Densities: 200, 100, 60", description: "Class works correctly" }]),
        hints: ["density() returns value/weight", "__str__ for nice printing", "Gem: 200/1 = 200"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson17_1_2.id,
        number: 4,
        title: "Evaluate a Solution",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write function evaluate(items, selection, capacity) that returns (total_value, is_feasible). Test with selection [0, 2].",
        starterCode: "def evaluate(items, selection, capacity):\n    total_weight = sum(items[i]['weight'] for i in selection)\n    total_value = sum(items[i]['value'] for i in selection)\n    is_feasible = total_weight <= capacity\n    return total_value, is_feasible\n\nitems = [\n    {'name': 'A', 'weight': 3, 'value': 60},\n    {'name': 'B', 'weight': 4, 'value': 70},\n    {'name': 'C', 'weight': 2, 'value': 35},\n    {'name': 'D', 'weight': 5, 'value': 80},\n]\n\ncapacity = 7\nselection = [0, 2]  # Items A and C\n\nvalue, feasible = evaluate(items, selection, capacity)\nprint(f'Selection: {[items[i][\"name\"] for i in selection]}')\nprint(f'Total value: {value}')\nprint(f'Feasible: {feasible}')",
        solution: "def evaluate(items, selection, capacity):\n    total_weight = sum(items[i]['weight'] for i in selection)\n    total_value = sum(items[i]['value'] for i in selection)\n    is_feasible = total_weight <= capacity\n    return total_value, is_feasible\n\nitems = [\n    {'name': 'A', 'weight': 3, 'value': 60},\n    {'name': 'B', 'weight': 4, 'value': 70},\n    {'name': 'C', 'weight': 2, 'value': 35},\n    {'name': 'D', 'weight': 5, 'value': 80},\n]\n\ncapacity = 7\nselection = [0, 2]\n\nvalue, feasible = evaluate(items, selection, capacity)\nprint(f'Selection: {[items[i][\"name\"] for i in selection]}')\nprint(f'Total value: {value}')\nprint(f'Feasible: {feasible}')\nprint(f'Weight: 3+2=5, which is <= 7')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Value=95, Feasible=True", description: "Evaluation function works" }]),
        hints: ["Sum weights and values", "Compare total weight to capacity", "Return tuple (value, feasible)"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson17_1_2.id,
        number: 5,
        title: "Sort by Density",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Sort items by value/weight ratio (highest first). This ordering is useful for greedy algorithms.",
        starterCode: "items = [\n    {'name': 'A', 'weight': 4, 'value': 40},   # ratio 10\n    {'name': 'B', 'weight': 2, 'value': 50},   # ratio 25\n    {'name': 'C', 'weight': 3, 'value': 45},   # ratio 15\n    {'name': 'D', 'weight': 5, 'value': 100},  # ratio 20\n]\n\n# Add density to each item\nfor item in items:\n    item['density'] = item['value'] / item['weight']\n\n# Sort by density (highest first)\nsorted_items = sorted(items, key=lambda x: x['density'], reverse=True)\n\nprint('Items sorted by density (value/weight):')\nfor item in sorted_items:\n    print(f\"  {item['name']}: density={item['density']:.1f}\")",
        solution: "items = [\n    {'name': 'A', 'weight': 4, 'value': 40},\n    {'name': 'B', 'weight': 2, 'value': 50},\n    {'name': 'C', 'weight': 3, 'value': 45},\n    {'name': 'D', 'weight': 5, 'value': 100},\n]\n\nfor item in items:\n    item['density'] = item['value'] / item['weight']\n\nsorted_items = sorted(items, key=lambda x: x['density'], reverse=True)\n\nprint('Items sorted by density (value/weight):')\nfor item in sorted_items:\n    print(f\"  {item['name']}: density={item['density']:.1f}\")\n\nprint('\\nGreedy would pick B first (highest density)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "B, D, C, A order", description: "Sorted by density" }]),
        hints: ["density = value / weight", "B: 50/2=25 (highest)", "Use sorted() with key"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 17.1.2`);

  console.log("\n✅ Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
