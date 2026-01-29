import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 9 Part 2: Lessons 9.2.1-9.2.3...\n");

  const section9_2 = await prisma.section.findFirst({ where: { number: 9.2 } });
  if (!section9_2) throw new Error("Section 9.2 not found.");

  // ==================== LESSON 9.2.1 ====================
  const lesson9_2_1 = await prisma.lesson.upsert({
    where: { slug: "intro-big-o" },
    update: {},
    create: {
      sectionId: section9_2.id,
      number: 9.21,
      title: "Introduction to Big O Notation",
      slug: "intro-big-o",
      objectives: [
        "Understand what Big O notation represents",
        "Read and write Big O expressions",
        "Know that Big O describes upper bound growth",
        "Simplify expressions to Big O",
      ],
      content: `# Introduction to Big O Notation

## What is Big O?

Big O notation describes the **growth rate** of an algorithm's resource usage (usually time or space) as input size increases.

\`\`\`
O(n)     → Linear growth
O(n²)    → Quadratic growth
O(log n) → Logarithmic growth
O(1)     → Constant (no growth)
\`\`\`

## Reading Big O

"O" stands for "Order of" - the **order of growth**.

- **O(n)**: "Order n" or "Linear"
- **O(n²)**: "Order n squared" or "Quadratic"
- **O(1)**: "Order 1" or "Constant"

## What Big O Tells Us

Big O describes **worst-case upper bound** - the algorithm will **never** grow faster than this rate.

If algorithm is O(n²), we know:
- With 10 items: At most ~100 operations
- With 100 items: At most ~10,000 operations
- With 1000 items: At most ~1,000,000 operations

## Simplification Rules

1. **Drop constants**: O(2n) → O(n)
2. **Drop lower-order terms**: O(n² + n) → O(n²)
3. **Keep only the dominant term**

\`\`\`
3n² + 5n + 100  →  O(n²)
2n + 500        →  O(n)
50              →  O(1)
\`\`\`

## Why Drop Constants?

Because we care about **growth rate**, not exact speed.

O(2n) and O(100n) both grow **linearly**. At large n, the difference between them is tiny compared to O(n) vs O(n²).`,
      codeExamples: JSON.stringify([
        {
          id: "big-o-basics",
          title: "Big O Basics",
          code: "# O(1) - Constant: Same time regardless of n\ndef get_first(items):\n    return items[0] if items else None\n\n# O(n) - Linear: Time grows with n\ndef find_item(items, target):\n    for item in items:\n        if item == target:\n            return True\n    return False\n\n# O(n²) - Quadratic: Time grows with n²\ndef has_duplicate(items):\n    for i in range(len(items)):\n        for j in range(i + 1, len(items)):\n            if items[i] == items[j]:\n                return True\n    return False\n\n# Demonstrate growth\nimport time\n\nfor n in [100, 1000, 10000]:\n    items = list(range(n))\n    \n    start = time.time()\n    get_first(items)\n    t1 = time.time() - start\n    \n    start = time.time()\n    find_item(items, -1)  # Worst case: not found\n    t2 = time.time() - start\n    \n    print(f\"n={n:5}: O(1)={t1:.6f}s, O(n)={t2:.5f}s\")",
          description: "Different Big O complexities",
        },
        {
          id: "simplification",
          title: "Simplifying to Big O",
          code: "def show_simplification(expression, n_values):\n    \"\"\"Show how expression simplifies at scale.\"\"\"\n    print(f\"Expression: {expression}\")\n    print(f\"{'n':>8} {'Full Value':>15} {'Dominant Term':>15} {'Ratio':>10}\")\n    print(\"-\" * 50)\n    \n    for n in n_values:\n        # Example: 3n² + 5n + 100\n        full = 3*n*n + 5*n + 100\n        dominant = 3*n*n  # The n² term\n        ratio = dominant / full * 100\n        print(f\"{n:>8} {full:>15,} {dominant:>15,} {ratio:>9.1f}%\")\n\nshow_simplification(\"3n² + 5n + 100\", [10, 100, 1000, 10000])\n\nprint(\"\\nAs n grows, n² dominates → O(n²)\")\nprint(\"\\nSimplification rules:\")\nprint(\"  3n² + 5n + 100  →  O(n²)\")\nprint(\"  Drop coefficient 3\")\nprint(\"  Drop lower terms 5n and 100\")",
          description: "How to simplify expressions",
        },
        {
          id: "drop-constants",
          title: "Why We Drop Constants",
          code: "import time\n\ndef work_1x(n):\n    \"\"\"O(n) with coefficient 1.\"\"\"\n    for i in range(n):\n        pass\n\ndef work_10x(n):\n    \"\"\"O(n) with coefficient 10.\"\"\"\n    for i in range(n):\n        for _ in range(10):  # 10x more work per item\n            pass\n\ndef work_squared(n):\n    \"\"\"O(n²).\"\"\"\n    for i in range(n):\n        for j in range(n):\n            pass\n\nprint(\"Comparing O(n), O(10n), and O(n²):\")\nprint(f\"{'n':>6} {'O(n)':>12} {'O(10n)':>12} {'O(n²)':>12}\")\nprint(\"-\" * 45)\n\nfor n in [100, 500, 1000]:\n    start = time.time()\n    work_1x(n)\n    t1 = time.time() - start\n    \n    start = time.time()\n    work_10x(n)\n    t2 = time.time() - start\n    \n    start = time.time()\n    work_squared(n)\n    t3 = time.time() - start\n    \n    print(f\"{n:>6} {t1:>12.6f} {t2:>12.6f} {t3:>12.6f}\")\n\nprint(\"\\nO(n) and O(10n) are similar - both LINEAR\")\nprint(\"O(n²) grows MUCH faster - different category!\")",
          description: "Constants don't change growth category",
        },
        {
          id: "formal-meaning",
          title: "What Big O Formally Means",
          code: "def is_bounded_by(f_n, g_n, n_values, constant=10):\n    \"\"\"\n    Check if f(n) ≤ c * g(n) for large n.\n    This is the formal definition of Big O.\n    \"\"\"\n    print(f\"Is f(n) ≤ {constant} * g(n)?\")\n    for n in n_values:\n        f = f_n(n)\n        g = g_n(n)\n        bounded = f <= constant * g\n        print(f\"  n={n:4}: f(n)={f:>8}, {constant}*g(n)={constant*g:>8}, bounded={bounded}\")\n\n# Example: Is 3n + 100 in O(n)?\nprint(\"Is 3n + 100 in O(n)?\")\nprint(\"We need: 3n + 100 ≤ c * n for some constant c and large n\")\nprint()\n\nis_bounded_by(\n    f_n=lambda n: 3*n + 100,\n    g_n=lambda n: n,\n    n_values=[10, 100, 1000],\n    constant=4  # 3n + 100 ≤ 4n when n ≥ 100\n)\n\nprint(\"\\nYes! For c=4 and n≥100, 3n+100 ≤ 4n\")\nprint(\"So 3n+100 is O(n)\")",
          description: "The formal definition",
        },
      ]),
      keyPoints: [
        "Big O describes growth rate as n → ∞",
        "O(1) constant, O(n) linear, O(n²) quadratic",
        "Drop constants: O(2n) → O(n)",
        "Drop lower terms: O(n² + n) → O(n²)",
        "Keep only the dominant term",
        "Big O is an upper bound guarantee",
        "Describes worst-case behavior",
        "Used universally in tech interviews",
      ],
      hardwareDemo: "Visualize how different Big O functions grow. Show simplification happening.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson9_2_1.number}: ${lesson9_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson9_2_1.id,
        number: 1,
        title: "Simplify to Big O",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "Simplify 5n² + 3n + 1000 to Big O notation.",
        starterCode: "",
        solution: "O(n²)",
        testCases: JSON.stringify([
          { input: "O(n²)", expectedOutput: "true", description: "Correct!" },
          { input: "O(5n²)", expectedOutput: "false", description: "Drop the coefficient" },
          { input: "O(n² + 3n)", expectedOutput: "false", description: "Drop lower terms" },
        ]),
        hints: ["Drop constants (5)", "Drop lower-order terms (3n, 1000)"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson9_2_1.id,
        number: 2,
        title: "Identify Big O",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Label each function with its Big O complexity.",
        starterCode: "def func_a(n):\n    return n * 2  # O(?)\n\ndef func_b(items):\n    for item in items:  # O(?)\n        print(item)\n\ndef func_c(items):\n    for i in items:     # O(?)\n        for j in items:\n            print(i, j)\n\n# Print the Big O for each",
        solution: "def func_a(n):\n    return n * 2\n\ndef func_b(items):\n    for item in items:\n        print(item)\n\ndef func_c(items):\n    for i in items:\n        for j in items:\n            print(i, j)\n\nprint(\"func_a: O(1) - just one operation\")\nprint(\"func_b: O(n) - loops through n items\")\nprint(\"func_c: O(n²) - nested loops, n × n\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "O(1), O(n), O(n²)", description: "Correct labels" }]),
        hints: ["func_a: one operation", "func_b: one loop", "func_c: nested loops"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson9_2_1.id,
        number: 3,
        title: "Compare Growth",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show how O(n) and O(n²) differ as n grows.",
        starterCode: "def compare_growth(n):\n    linear = n\n    quadratic = n * n\n    # Return both and the ratio\n\n# Print table for n = 10, 100, 1000, 10000",
        solution: "def compare_growth(n):\n    linear = n\n    quadratic = n * n\n    ratio = quadratic / linear\n    return linear, quadratic, ratio\n\nprint(f\"{'n':>6} {'O(n)':>10} {'O(n²)':>15} {'Ratio':>10}\")\nprint(\"-\" * 45)\n\nfor n in [10, 100, 1000, 10000]:\n    lin, quad, ratio = compare_growth(n)\n    print(f\"{n:>6} {lin:>10,} {quad:>15,} {ratio:>10.0f}x\")\n\nprint(\"\\nRatio equals n because n²/n = n\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Ratio grows with n", description: "Growth compared" }]),
        hints: ["Ratio = quadratic / linear", "Should equal n"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson9_2_1.id,
        number: 4,
        title: "Simplification Practice",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write function that shows why lower terms don't matter.",
        starterCode: "def analyze(n):\n    \"\"\"For f(n) = n² + 100n, show n² dominates.\"\"\"\n    full = n*n + 100*n\n    dominant = n*n\n    # Calculate percentage that n² contributes\n    # Return both values and percentage\n\n# Test for n = 10, 100, 1000",
        solution: "def analyze(n):\n    full = n*n + 100*n\n    dominant = n*n\n    percentage = (dominant / full) * 100\n    return full, dominant, percentage\n\nprint(f\"{'n':>6} {'n² + 100n':>15} {'n²':>12} {'n² %':>10}\")\nprint(\"-\" * 45)\n\nfor n in [10, 100, 1000, 10000]:\n    full, dom, pct = analyze(n)\n    print(f\"{n:>6} {full:>15,} {dom:>12,} {pct:>9.1f}%\")\n\nprint(\"\\nAs n grows, n² approaches 100% → O(n²)\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "n² approaches 100%", description: "Dominance shown" }]),
        hints: ["percentage = (dominant/full) * 100", "Should approach 100%"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson9_2_1.id,
        number: 5,
        title: "Multiple Simplifications",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Simplify multiple expressions and verify at large n.",
        starterCode: "expressions = [\n    (\"2n + 50\", lambda n: 2*n + 50),\n    (\"n² + n + 1\", lambda n: n*n + n + 1),\n    (\"3n³ + n²\", lambda n: 3*n**3 + n*n),\n    (\"100\", lambda n: 100),\n]\n\n# For each, compute value at n=1000\n# State the Big O simplification\n# Show which term dominates",
        solution: "expressions = [\n    (\"2n + 50\", lambda n: 2*n + 50, \"O(n)\", lambda n: 2*n),\n    (\"n² + n + 1\", lambda n: n*n + n + 1, \"O(n²)\", lambda n: n*n),\n    (\"3n³ + n²\", lambda n: 3*n**3 + n*n, \"O(n³)\", lambda n: 3*n**3),\n    (\"100\", lambda n: 100, \"O(1)\", lambda n: 100),\n]\n\nn = 1000\nprint(f\"At n = {n}:\")\nprint(f\"{'Expression':<15} {'Value':>15} {'Big O':<8} {'Dominant':>15} {'%':>8}\")\nprint(\"-\" * 65)\n\nfor name, func, big_o, dominant in expressions:\n    val = func(n)\n    dom_val = dominant(n)\n    pct = (dom_val / val) * 100 if val > 0 else 100\n    print(f\"{name:<15} {val:>15,} {big_o:<8} {dom_val:>15,} {pct:>7.1f}%\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All simplifications correct", description: "Multiple expressions" }]),
        hints: ["Dominant term is the largest", "Percentage shows dominance"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 9.2.1`);

  // ==================== LESSON 9.2.2 ====================
  const lesson9_2_2 = await prisma.lesson.upsert({
    where: { slug: "common-complexity-classes" },
    update: {},
    create: {
      sectionId: section9_2.id,
      number: 9.22,
      title: "Common Complexity Classes",
      slug: "common-complexity-classes",
      objectives: [
        "Know the most common complexity classes",
        "Recognize code patterns for each class",
        "Understand the hierarchy of complexities",
        "Know real-world examples of each",
      ],
      content: `# Common Complexity Classes

## The Hierarchy (Best to Worst)

\`\`\`
O(1)      < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ)
constant    logarithmic  linear  log-linear   quadratic  cubic  exponential
   ✅          ✅          ✅        ✅           ⚠️        ⚠️       ❌
\`\`\`

## O(1) - Constant Time

**Operations don't depend on input size.**

\`\`\`python
def get_first(items):
    return items[0]

def access_dict(d, key):
    return d[key]
\`\`\`

Examples: Array access, dictionary lookup, stack push/pop

## O(log n) - Logarithmic

**Problem size halves each step.**

\`\`\`python
def binary_search(sorted_items, target):
    left, right = 0, len(sorted_items) - 1
    while left <= right:
        mid = (left + right) // 2
        if sorted_items[mid] == target:
            return mid
        elif sorted_items[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\`

Examples: Binary search, balanced tree operations

## O(n) - Linear

**Touch each element once.**

\`\`\`python
def find_max(items):
    max_val = items[0]
    for item in items:
        if item > max_val:
            max_val = item
    return max_val
\`\`\`

Examples: Linear search, sum of array, counting

## O(n log n) - Log-Linear

**Efficient sorting algorithms.**

Examples: Merge sort, quicksort (average), heapsort

## O(n²) - Quadratic

**Nested loops over all pairs.**

\`\`\`python
def bubble_sort(items):
    for i in range(len(items)):
        for j in range(len(items) - 1):
            if items[j] > items[j+1]:
                items[j], items[j+1] = items[j+1], items[j]
\`\`\`

Examples: Bubble sort, checking all pairs, simple matrix operations`,
      codeExamples: JSON.stringify([
        {
          id: "all-classes",
          title: "All Common Complexity Classes",
          code: "import math\n\ndef o_1(n):\n    \"\"\"O(1) - Constant.\"\"\"\n    return 1\n\ndef o_log_n(n):\n    \"\"\"O(log n) - Logarithmic.\"\"\"\n    return int(math.log2(n)) if n > 0 else 0\n\ndef o_n(n):\n    \"\"\"O(n) - Linear.\"\"\"\n    return n\n\ndef o_n_log_n(n):\n    \"\"\"O(n log n) - Log-linear.\"\"\"\n    return int(n * math.log2(n)) if n > 0 else 0\n\ndef o_n_squared(n):\n    \"\"\"O(n²) - Quadratic.\"\"\"\n    return n * n\n\n# Compare operation counts\nprint(f\"{'n':>8} {'O(1)':>8} {'O(log n)':>10} {'O(n)':>10} {'O(n log n)':>12} {'O(n²)':>12}\")\nprint(\"-\" * 65)\n\nfor n in [10, 100, 1000, 10000]:\n    print(f\"{n:>8} {o_1(n):>8} {o_log_n(n):>10} {o_n(n):>10,} \"\n          f\"{o_n_log_n(n):>12,} {o_n_squared(n):>12,}\")",
          description: "Comparing all common classes",
        },
        {
          id: "log-n-explained",
          title: "Why O(log n) is So Fast",
          code: "def binary_search_steps(n):\n    \"\"\"Count steps to search n items with binary search.\"\"\"\n    steps = 0\n    left, right = 0, n - 1\n    while left <= right:\n        steps += 1\n        mid = (left + right) // 2\n        # Simulate: target in upper half\n        left = mid + 1\n    return steps\n\nprint(\"Binary search steps (O(log n)):\")\nprint(f\"{'Items':>12} {'Steps':>8} {'log₂(n)':>10}\")\nprint(\"-\" * 35)\n\nfor n in [10, 100, 1000, 10000, 100000, 1000000]:\n    steps = binary_search_steps(n)\n    log_n = n.bit_length()  # Approximates log₂(n)\n    print(f\"{n:>12,} {steps:>8} {log_n:>10}\")\n\nprint(\"\\n1 million items → only 20 steps!\")\nprint(\"Each step eliminates HALF the remaining items.\")",
          description: "Logarithmic is incredibly efficient",
        },
        {
          id: "n-log-n",
          title: "O(n log n) - The Sorting Sweet Spot",
          code: "import math\n\ndef compare_sorting_complexity(n):\n    \"\"\"Compare O(n²) vs O(n log n) sorting.\"\"\"\n    n_squared = n * n\n    n_log_n = int(n * math.log2(n))\n    ratio = n_squared / n_log_n\n    return n_squared, n_log_n, ratio\n\nprint(\"Sorting algorithms comparison:\")\nprint(\"O(n²) = Bubble sort, Selection sort\")\nprint(\"O(n log n) = Merge sort, Quick sort\")\nprint()\nprint(f\"{'n':>10} {'O(n²)':>15} {'O(n log n)':>15} {'Ratio':>10}\")\nprint(\"-\" * 55)\n\nfor n in [100, 1000, 10000, 100000]:\n    n2, nlogn, ratio = compare_sorting_complexity(n)\n    print(f\"{n:>10,} {n2:>15,} {nlogn:>15,} {ratio:>10.0f}x\")\n\nprint(\"\\nFor 100,000 items:\")\nprint(f\"  Bubble sort: 10 billion operations\")\nprint(f\"  Merge sort: 1.6 million operations\")\nprint(f\"  That's 6,000x faster!\")",
          description: "Why efficient sorting matters",
        },
        {
          id: "practical-examples",
          title: "Real Code Examples",
          code: "# O(1) - Dictionary lookup\ndef get_user(users_dict, user_id):\n    return users_dict.get(user_id)  # Hash table = O(1)\n\n# O(log n) - Binary search\ndef find_in_sorted(sorted_list, target):\n    left, right = 0, len(sorted_list) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if sorted_list[mid] == target:\n            return mid\n        elif sorted_list[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\n# O(n) - Find maximum\ndef find_max(items):\n    return max(items)  # Single pass\n\n# O(n²) - Find duplicates (naive)\ndef has_duplicate_naive(items):\n    for i in range(len(items)):\n        for j in range(i + 1, len(items)):\n            if items[i] == items[j]:\n                return True\n    return False\n\n# O(n) - Find duplicates (smart)\ndef has_duplicate_smart(items):\n    seen = set()\n    for item in items:\n        if item in seen:\n            return True\n        seen.add(item)\n    return False\n\n# Demonstrate\nitems = list(range(1000))\nprint(f\"get_user: O(1)\")\nprint(f\"find_in_sorted: O(log n) = ~{1000.bit_length()} steps\")\nprint(f\"find_max: O(n) = ~{len(items)} steps\")\nprint(f\"has_duplicate_naive: O(n²) = ~{len(items)**2} steps\")\nprint(f\"has_duplicate_smart: O(n) = ~{len(items)} steps\")",
          description: "Complexity in real code",
        },
      ]),
      keyPoints: [
        "O(1): constant - instant, always fast",
        "O(log n): logarithmic - halves problem each step",
        "O(n): linear - touch each element once",
        "O(n log n): log-linear - efficient sorting",
        "O(n²): quadratic - nested loops, gets slow",
        "O(2ⁿ): exponential - avoid if possible",
        "Higher complexity = slower at scale",
        "Choose lowest complexity that solves problem",
      ],
      hardwareDemo: "Run algorithms of each class. Visualize operation counts growing at different rates.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson9_2_2.number}: ${lesson9_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson9_2_2.id,
        number: 1,
        title: "Rank Complexities",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "Which is the correct order from fastest to slowest?",
        starterCode: "",
        solution: "O(1) < O(log n) < O(n) < O(n²)",
        testCases: JSON.stringify([
          { input: "O(1) < O(log n) < O(n) < O(n²)", expectedOutput: "true", description: "Correct!" },
          { input: "O(log n) < O(1) < O(n) < O(n²)", expectedOutput: "false", description: "O(1) is fastest" },
          { input: "O(1) < O(n) < O(log n) < O(n²)", expectedOutput: "false", description: "O(log n) < O(n)" },
        ]),
        hints: ["Constant < Logarithmic < Linear < Quadratic"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson9_2_2.id,
        number: 2,
        title: "Identify Complexity",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Match each function to its Big O complexity.",
        starterCode: "def func_a(items):\n    return items[0]\n\ndef func_b(items):\n    for item in items:\n        print(item)\n\ndef func_c(items):\n    for i in items:\n        for j in items:\n            print(i + j)\n\ndef func_d(items):  # Binary search pattern\n    left, right = 0, len(items) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        left = mid + 1\n    return mid\n\n# Print complexity for each",
        solution: "print(\"func_a: O(1) - single array access\")\nprint(\"func_b: O(n) - single loop through n items\")\nprint(\"func_c: O(n²) - nested loops\")\nprint(\"func_d: O(log n) - halves search space each iteration\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "O(1), O(n), O(n²), O(log n)", description: "Correct identification" }]),
        hints: ["Count the loops", "Binary search is O(log n)"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson9_2_2.id,
        number: 3,
        title: "Visualize Growth",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a table showing operation counts for all classes at different n values.",
        starterCode: "import math\n\ndef operations(n):\n    # Return dict with counts for each complexity\n    pass\n\n# Print table for n = 10, 100, 1000",
        solution: "import math\n\ndef operations(n):\n    return {\n        'O(1)': 1,\n        'O(log n)': int(math.log2(n)) if n > 0 else 0,\n        'O(n)': n,\n        'O(n log n)': int(n * math.log2(n)) if n > 0 else 0,\n        'O(n²)': n * n,\n    }\n\nprint(f\"{'n':>6} {'O(1)':>6} {'O(log n)':>10} {'O(n)':>8} {'O(n log n)':>12} {'O(n²)':>12}\")\nprint(\"-\" * 60)\n\nfor n in [10, 100, 1000, 10000]:\n    ops = operations(n)\n    print(f\"{n:>6} {ops['O(1)']:>6} {ops['O(log n)']:>10} {ops['O(n)']:>8,} \"\n          f\"{ops['O(n log n)']:>12,} {ops['O(n²)']:>12,}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Table showing growth", description: "Growth visualized" }]),
        hints: ["log2(n) for O(log n)", "n * log2(n) for O(n log n)"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson9_2_2.id,
        number: 4,
        title: "Time the Classes",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Actually time O(n) vs O(n²) operations to see the difference.",
        starterCode: "import time\n\ndef linear_work(n):\n    for i in range(n):\n        pass\n\ndef quadratic_work(n):\n    for i in range(n):\n        for j in range(n):\n            pass\n\n# Time both for n = 100, 500, 1000, 2000\n# Show the ratio grows",
        solution: "import time\n\ndef linear_work(n):\n    for i in range(n):\n        pass\n\ndef quadratic_work(n):\n    for i in range(n):\n        for j in range(n):\n            pass\n\nprint(f\"{'n':>6} {'O(n)':>12} {'O(n²)':>12} {'Ratio':>10}\")\nprint(\"-\" * 45)\n\nfor n in [100, 500, 1000, 2000]:\n    start = time.time()\n    linear_work(n)\n    t_linear = time.time() - start\n    \n    start = time.time()\n    quadratic_work(n)\n    t_quad = time.time() - start\n    \n    ratio = t_quad / t_linear if t_linear > 0 else 0\n    print(f\"{n:>6} {t_linear:>12.6f} {t_quad:>12.6f} {ratio:>10.0f}x\")\n\nprint(\"\\nRatio ≈ n because O(n²)/O(n) = n\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Ratio grows with n", description: "Timing confirmed" }]),
        hints: ["Ratio should approximately equal n", "Quadratic grows much faster"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson9_2_2.id,
        number: 5,
        title: "Binary Search Power",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Show how few steps binary search needs even for huge inputs.",
        starterCode: "def binary_search_steps(n):\n    \"\"\"Count maximum steps for binary search on n items.\"\"\"\n    # Implement step counter\n    pass\n\n# Test for n = 100, 10000, 1000000, 1000000000\n# Compare to linear search steps",
        solution: "def binary_search_steps(n):\n    steps = 0\n    left, right = 0, n - 1\n    while left <= right:\n        steps += 1\n        mid = (left + right) // 2\n        left = mid + 1  # Worst case: always go right\n    return steps\n\nprint(f\"{'n':>15} {'Binary (log n)':>15} {'Linear (n)':>15} {'Speedup':>12}\")\nprint(\"-\" * 60)\n\nfor n in [100, 10000, 1000000, 1000000000]:\n    binary = binary_search_steps(n)\n    linear = n\n    speedup = linear // binary\n    print(f\"{n:>15,} {binary:>15} {linear:>15,} {speedup:>12,}x\")\n\nprint(\"\\nWith 1 billion items:\")\nprint(f\"  Linear search: up to 1,000,000,000 comparisons\")\nprint(f\"  Binary search: only 30 comparisons!\")\nprint(f\"  That's 33 million times faster!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Massive speedup shown", description: "Log n power demonstrated" }]),
        hints: ["Each iteration halves the space", "log₂(1 billion) ≈ 30"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 9.2.2`);

  // ==================== LESSON 9.2.3 ====================
  const lesson9_2_3 = await prisma.lesson.upsert({
    where: { slug: "analyzing-simple-code" },
    update: {},
    create: {
      sectionId: section9_2.id,
      number: 9.23,
      title: "Analyzing Simple Code",
      slug: "analyzing-simple-code",
      objectives: [
        "Analyze loops to determine complexity",
        "Handle sequential code sections",
        "Analyze nested loops",
        "Apply analysis to real functions",
      ],
      content: `# Analyzing Simple Code

## Basic Rules for Analysis

### Rule 1: Sequential Statements
Add complexities, keep the largest:

\`\`\`python
def example(items):
    x = 1              # O(1)
    for i in items:    # O(n)
        print(i)
    for j in items:    # O(n)
        print(j)
# Total: O(1) + O(n) + O(n) = O(n)
\`\`\`

### Rule 2: Nested Loops
Multiply complexities:

\`\`\`python
for i in range(n):      # O(n)
    for j in range(n):  # × O(n)
        print(i, j)
# Total: O(n) × O(n) = O(n²)
\`\`\`

### Rule 3: Conditionals
Take the worst case:

\`\`\`python
if condition:
    # O(n) operation
else:
    # O(n²) operation
# Total: O(n²) (worst case)
\`\`\`

## Analyzing Loops

**Simple loop**: O(n)
\`\`\`python
for i in range(n):  # Runs n times
    x += 1          # O(1) each
# Total: n × O(1) = O(n)
\`\`\`

**Nested loop**: O(n²)
\`\`\`python
for i in range(n):      # n times
    for j in range(n):  # n times each
        x += 1          # O(1)
# Total: n × n × O(1) = O(n²)
\`\`\`

**Loop with reducing range**: O(n²)
\`\`\`python
for i in range(n):
    for j in range(i):  # 0 + 1 + 2 + ... + (n-1)
        x += 1
# Total: n(n-1)/2 = O(n²)
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "sequential-analysis",
          title: "Analyzing Sequential Code",
          code: "def sequential_example(items):\n    \"\"\"Analyze this function's complexity.\"\"\"\n    n = len(items)\n    \n    # Section 1: O(1)\n    total = 0\n    max_val = items[0]\n    \n    # Section 2: O(n)\n    for item in items:\n        total += item\n    \n    # Section 3: O(n)\n    for item in items:\n        if item > max_val:\n            max_val = item\n    \n    return total, max_val\n\n# Analysis:\n# O(1) + O(n) + O(n) = O(2n + 1) = O(n)\n\nprint(\"Analysis of sequential_example:\")\nprint(\"  Section 1: O(1) - constant operations\")\nprint(\"  Section 2: O(n) - loop through all items\")\nprint(\"  Section 3: O(n) - another loop\")\nprint(\"  Total: O(1) + O(n) + O(n) = O(n)\")\nprint(\"  Simplified: O(n)\")",
          description: "Sequential sections add up",
        },
        {
          id: "nested-loop-analysis",
          title: "Analyzing Nested Loops",
          code: "def nested_example(n):\n    \"\"\"Count operations in nested loops.\"\"\"\n    count = 0\n    for i in range(n):        # Outer: n iterations\n        for j in range(n):    # Inner: n iterations EACH\n            count += 1        # O(1)\n    return count\n\n# Test to verify\nfor n in [10, 100, 1000]:\n    ops = nested_example(n)\n    expected = n * n\n    print(f\"n={n:4}: operations={ops:>10,}, n²={expected:>10,}, match={ops==expected}\")\n\nprint(\"\\nAnalysis:\")\nprint(\"  Outer loop: runs n times\")\nprint(\"  Inner loop: runs n times FOR EACH outer iteration\")\nprint(\"  Total: n × n = n²\")\nprint(\"  Complexity: O(n²)\")",
          description: "Nested loops multiply",
        },
        {
          id: "triangular-loop",
          title: "Analyzing Triangular Loops",
          code: "def triangular_example(n):\n    \"\"\"Inner loop depends on outer loop variable.\"\"\"\n    count = 0\n    for i in range(n):\n        for j in range(i):  # j goes from 0 to i-1\n            count += 1\n    return count\n\nprint(\"Triangular loop analysis:\")\nfor n in [5, 10, 100]:\n    ops = triangular_example(n)\n    # Sum of 0+1+2+...+(n-1) = n(n-1)/2\n    expected = n * (n - 1) // 2\n    print(f\"n={n:3}: ops={ops:>5}, formula n(n-1)/2={expected:>5}\")\n\nprint(\"\\nBreakdown for n=5:\")\nprint(\"  i=0: j loops 0 times\")\nprint(\"  i=1: j loops 1 time\")\nprint(\"  i=2: j loops 2 times\")\nprint(\"  i=3: j loops 3 times\")\nprint(\"  i=4: j loops 4 times\")\nprint(\"  Total: 0+1+2+3+4 = 10 = 5×4/2\")\nprint(\"\\nn(n-1)/2 ≈ n²/2 → O(n²)\")",
          description: "Variable inner loops still O(n²)",
        },
        {
          id: "practical-analysis",
          title: "Analyzing Real Functions",
          code: "def analyze_function(items):\n    \"\"\"A more complex function to analyze.\"\"\"\n    n = len(items)\n    result = []\n    \n    # Part A: O(n)\n    for item in items:\n        result.append(item * 2)\n    \n    # Part B: O(n²)\n    for i in range(n):\n        for j in range(i + 1, n):\n            if result[i] > result[j]:\n                result[i], result[j] = result[j], result[i]\n    \n    # Part C: O(n)\n    total = 0\n    for item in result:\n        total += item\n    \n    return total\n\nprint(\"Complexity analysis:\")\nprint(\"\")\nprint(\"Part A: Single loop → O(n)\")\nprint(\"Part B: Nested loop → O(n²)\")\nprint(\"Part C: Single loop → O(n)\")\nprint(\"\")\nprint(\"Total: O(n) + O(n²) + O(n) = O(n² + 2n)\")\nprint(\"Simplified: O(n²)\")\nprint(\"\")\nprint(\"The O(n²) part dominates!\")",
          description: "Combining analysis techniques",
        },
      ]),
      keyPoints: [
        "Sequential: add complexities, keep largest",
        "Nested loops: multiply complexities",
        "Conditionals: use worst case",
        "Simple loop over n items: O(n)",
        "Nested loops over n items: O(n²)",
        "Triangular loops: still O(n²)",
        "Constants and lower terms: drop them",
        "Focus on the dominant term",
      ],
      hardwareDemo: "Step through code counting operations. Build up to final Big O.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson9_2_3.number}: ${lesson9_2_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson9_2_3.id,
        number: 1,
        title: "Analyze Simple Loop",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "What's the Big O of this function? Explain why.",
        starterCode: "def mystery(items):\n    total = 0\n    for item in items:\n        total += item\n    return total\n\n# What's the Big O? Explain.",
        solution: "def mystery(items):\n    total = 0          # O(1)\n    for item in items: # O(n) - loops through all items\n        total += item  # O(1) per iteration\n    return total       # O(1)\n\nprint(\"Analysis:\")\nprint(\"  - Initialization: O(1)\")\nprint(\"  - Loop: runs n times\")\nprint(\"  - Each iteration: O(1)\")\nprint(\"  - Return: O(1)\")\nprint(\"\")\nprint(\"Total: O(1) + n×O(1) + O(1) = O(n)\")\nprint(\"\")\nprint(\"Complexity: O(n) - LINEAR\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "O(n)", description: "Correct analysis" }]),
        hints: ["Count how many times the loop runs", "n items → n iterations"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson9_2_3.id,
        number: 2,
        title: "Analyze Nested Loop",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "What's the Big O of this nested loop?",
        starterCode: "def mystery(n):\n    count = 0\n    for i in range(n):\n        for j in range(n):\n            count += 1\n    return count\n\n# What's the Big O? Verify by testing.",
        solution: "def mystery(n):\n    count = 0\n    for i in range(n):     # n iterations\n        for j in range(n): # n iterations each\n            count += 1     # O(1)\n    return count\n\nprint(\"Analysis:\")\nprint(\"  - Outer loop: n iterations\")\nprint(\"  - Inner loop: n iterations PER outer\")\nprint(\"  - Total: n × n = n²\")\nprint(\"\")\nprint(\"Complexity: O(n²) - QUADRATIC\")\nprint(\"\")\nprint(\"Verification:\")\nfor n in [10, 100, 1000]:\n    result = mystery(n)\n    print(f\"  n={n:4}: count={result:>10,}, n²={n*n:>10,}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "O(n²)", description: "Correct analysis" }]),
        hints: ["Multiply loop iterations", "n × n = n²"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson9_2_3.id,
        number: 3,
        title: "Sequential Sections",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Analyze this function with multiple sequential parts.",
        starterCode: "def process(items):\n    n = len(items)\n    \n    # Part A\n    for i in items:\n        print(i)\n    \n    # Part B\n    for i in items:\n        for j in items:\n            print(i, j)\n    \n    # Part C\n    return items[0] if items else None\n\n# Analyze each part and give total Big O",
        solution: "def process(items):\n    n = len(items)\n    \n    # Part A: O(n) - single loop\n    for i in items:\n        print(i)\n    \n    # Part B: O(n²) - nested loops\n    for i in items:\n        for j in items:\n            print(i, j)\n    \n    # Part C: O(1) - constant\n    return items[0] if items else None\n\nprint(\"Analysis:\")\nprint(\"  Part A: O(n) - single loop\")\nprint(\"  Part B: O(n²) - nested loops\")\nprint(\"  Part C: O(1) - array access\")\nprint(\"\")\nprint(\"Total: O(n) + O(n²) + O(1)\")\nprint(\"     = O(n² + n + 1)\")\nprint(\"     = O(n²)\")\nprint(\"\")\nprint(\"The O(n²) dominates → Complexity is O(n²)\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "O(n²)", description: "Dominant term identified" }]),
        hints: ["Analyze each part separately", "Take the largest (dominant) term"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson9_2_3.id,
        number: 4,
        title: "Triangular Loop",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Analyze this loop where inner depends on outer.",
        starterCode: "def pairs(items):\n    n = len(items)\n    count = 0\n    for i in range(n):\n        for j in range(i + 1, n):  # Note: starts at i+1\n            count += 1\n    return count\n\n# How many operations? What's the Big O?",
        solution: "def pairs(items):\n    n = len(items)\n    count = 0\n    for i in range(n):\n        for j in range(i + 1, n):\n            count += 1\n    return count\n\nprint(\"Operation count for different n:\")\nfor n in [5, 10, 100]:\n    items = list(range(n))\n    count = pairs(items)\n    formula = n * (n - 1) // 2\n    print(f\"  n={n:3}: count={count:>5}, n(n-1)/2={formula:>5}\")\n\nprint(\"\")\nprint(\"Analysis:\")\nprint(\"  When i=0: j goes from 1 to n-1 → (n-1) iterations\")\nprint(\"  When i=1: j goes from 2 to n-1 → (n-2) iterations\")\nprint(\"  ...\")\nprint(\"  When i=n-2: j goes from n-1 to n-1 → 1 iteration\")\nprint(\"  When i=n-1: j loops 0 times\")\nprint(\"\")\nprint(\"  Total: (n-1) + (n-2) + ... + 1 + 0\")\nprint(\"       = n(n-1)/2\")\nprint(\"       = (n² - n) / 2\")\nprint(\"       = O(n²)\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "O(n²)", description: "Triangular still quadratic" }]),
        hints: ["Sum of 1+2+...+(n-1) = n(n-1)/2", "n(n-1)/2 ≈ n²/2 → O(n²)"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson9_2_3.id,
        number: 5,
        title: "Complex Function Analysis",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Analyze this realistic function with multiple parts.",
        starterCode: "def find_pairs_with_sum(items, target):\n    \"\"\"Find all pairs that sum to target.\"\"\"\n    n = len(items)\n    pairs = []\n    \n    # Check all pairs\n    for i in range(n):\n        for j in range(i + 1, n):\n            if items[i] + items[j] == target:\n                pairs.append((items[i], items[j]))\n    \n    # Sort results\n    pairs.sort()\n    \n    return pairs\n\n# Analyze complexity of each part\n# What's the overall complexity?",
        solution: "def find_pairs_with_sum(items, target):\n    n = len(items)\n    pairs = []\n    \n    # Part 1: Check all pairs - O(n²)\n    for i in range(n):\n        for j in range(i + 1, n):\n            if items[i] + items[j] == target:\n                pairs.append((items[i], items[j]))\n    \n    # Part 2: Sort results - O(k log k) where k = number of pairs\n    # Worst case: k = n²/2, so O(n² log n)\n    pairs.sort()\n    \n    return pairs\n\nprint(\"Detailed Analysis:\")\nprint(\"\")\nprint(\"Part 1: Nested loops checking pairs\")\nprint(\"  - Outer: n iterations\")\nprint(\"  - Inner: varies but total = n(n-1)/2\")\nprint(\"  - Complexity: O(n²)\")\nprint(\"\")\nprint(\"Part 2: Sorting the results\")\nprint(\"  - Number of pairs k: 0 to n(n-1)/2\")\nprint(\"  - Sort complexity: O(k log k)\")\nprint(\"  - Worst case k ≈ n²: O(n² log n²) = O(n² log n)\")\nprint(\"\")\nprint(\"Total: O(n²) + O(n² log n)\")\nprint(\"     = O(n² log n)\")\nprint(\"\")\nprint(\"But typically: few pairs found → O(n²) dominates\")\nprint(\"Practical complexity: O(n²)\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "O(n²) or O(n² log n)", description: "Realistic analysis" }]),
        hints: ["Analyze nested loop first", "Consider sort complexity on output size"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 9.2.3`);

  console.log("\n✅ Chapter 9 Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
