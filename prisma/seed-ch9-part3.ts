import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 9 Part 3: Lessons 9.3.1-9.3.3 (Final)...\n");

  const section9_3 = await prisma.section.findFirst({ where: { number: 9.3 } });
  if (!section9_3) throw new Error("Section 9.3 not found.");

  // ==================== LESSON 9.3.1 ====================
  const lesson9_3_1 = await prisma.lesson.upsert({
    where: { slug: "comparing-algorithm-efficiency" },
    update: {},
    create: {
      sectionId: section9_3.id,
      number: 9.31,
      title: "Comparing Algorithm Efficiency",
      slug: "comparing-algorithm-efficiency",
      objectives: [
        "Compare algorithms solving the same problem",
        "Choose the best algorithm for a situation",
        "Understand tradeoffs between algorithms",
        "Know when a slower algorithm might be preferred",
      ],
      content: `# Comparing Algorithm Efficiency

## Same Problem, Different Approaches

Many problems have multiple solutions with different complexities:

**Finding duplicates:**
- Brute force: O(n²)
- Using sorting: O(n log n)
- Using hash set: O(n)

## How to Compare

1. **Determine complexity of each**
2. **Consider the typical input size**
3. **Factor in constant overhead**
4. **Consider memory usage**

## Complexity Comparison Table

| n | O(log n) | O(n) | O(n log n) | O(n²) |
|---|----------|------|------------|-------|
| 10 | 3 | 10 | 33 | 100 |
| 100 | 7 | 100 | 664 | 10,000 |
| 1,000 | 10 | 1,000 | 9,966 | 1,000,000 |
| 1,000,000 | 20 | 1M | 20M | 1 trillion |

## When "Worse" is Actually Better

Sometimes a higher complexity is preferable:

1. **Small inputs**: O(n²) insertion sort beats O(n log n) quicksort for n < 20
2. **Simplicity**: Simple O(n²) code vs complex O(n log n) code
3. **Memory**: O(1) space O(n²) vs O(n) space O(n)
4. **Setup cost**: O(n²) might be faster if O(n) requires expensive preprocessing

## Real-World Decision Making

\`\`\`
If n < 100: Almost anything works
If n < 10,000: O(n²) might be acceptable
If n > 100,000: Must be O(n log n) or better
If n > 10,000,000: Need O(n) or O(log n)
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "duplicate-comparison",
          title: "Three Ways to Find Duplicates",
          code: "import time\n\ndef has_duplicate_brute(items):\n    \"\"\"O(n²) - check all pairs.\"\"\"\n    for i in range(len(items)):\n        for j in range(i + 1, len(items)):\n            if items[i] == items[j]:\n                return True\n    return False\n\ndef has_duplicate_sort(items):\n    \"\"\"O(n log n) - sort then check neighbors.\"\"\"\n    sorted_items = sorted(items)\n    for i in range(len(sorted_items) - 1):\n        if sorted_items[i] == sorted_items[i + 1]:\n            return True\n    return False\n\ndef has_duplicate_set(items):\n    \"\"\"O(n) - use hash set.\"\"\"\n    seen = set()\n    for item in items:\n        if item in seen:\n            return True\n        seen.add(item)\n    return False\n\n# Compare performance\nprint(f\"{'n':>6} {'O(n²)':>12} {'O(n log n)':>12} {'O(n)':>12}\")\nprint(\"-\" * 45)\n\nfor n in [100, 500, 1000, 2000]:\n    items = list(range(n))  # No duplicates (worst case)\n    \n    start = time.time()\n    has_duplicate_brute(items)\n    t1 = time.time() - start\n    \n    start = time.time()\n    has_duplicate_sort(items)\n    t2 = time.time() - start\n    \n    start = time.time()\n    has_duplicate_set(items)\n    t3 = time.time() - start\n    \n    print(f\"{n:>6} {t1:>12.5f} {t2:>12.5f} {t3:>12.5f}\")",
          description: "Same problem, vastly different performance",
        },
        {
          id: "search-comparison",
          title: "Linear vs Binary Search",
          code: "import time\nimport random\n\ndef linear_search(items, target):\n    \"\"\"O(n) - check each item.\"\"\"\n    for i, item in enumerate(items):\n        if item == target:\n            return i\n    return -1\n\ndef binary_search(sorted_items, target):\n    \"\"\"O(log n) - requires sorted input.\"\"\"\n    left, right = 0, len(sorted_items) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if sorted_items[mid] == target:\n            return mid\n        elif sorted_items[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\n# Compare with different sizes\nprint(\"Searching for worst-case (not found):\")\nprint(f\"{'n':>10} {'Linear O(n)':>15} {'Binary O(log n)':>18} {'Speedup':>10}\")\nprint(\"-\" * 55)\n\nfor n in [1000, 10000, 100000, 1000000]:\n    items = list(range(n))\n    target = -1  # Not in list\n    \n    start = time.time()\n    for _ in range(100):\n        linear_search(items, target)\n    t_linear = (time.time() - start) / 100\n    \n    start = time.time()\n    for _ in range(100):\n        binary_search(items, target)\n    t_binary = (time.time() - start) / 100\n    \n    speedup = t_linear / t_binary if t_binary > 0 else float('inf')\n    print(f\"{n:>10,} {t_linear:>15.6f} {t_binary:>18.6f} {speedup:>10.0f}x\")",
          description: "Binary search is dramatically faster",
        },
        {
          id: "when-worse-better",
          title: "When Simpler is Better",
          code: "import time\n\ndef insertion_sort(items):\n    \"\"\"O(n²) but simple and fast for small n.\"\"\"\n    result = items.copy()\n    for i in range(1, len(result)):\n        key = result[i]\n        j = i - 1\n        while j >= 0 and result[j] > key:\n            result[j + 1] = result[j]\n            j -= 1\n        result[j + 1] = key\n    return result\n\ndef merge_sort(items):\n    \"\"\"O(n log n) but has overhead.\"\"\"\n    if len(items) <= 1:\n        return items\n    mid = len(items) // 2\n    left = merge_sort(items[:mid])\n    right = merge_sort(items[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\nimport random\n\nprint(\"Small n: O(n²) can beat O(n log n)!\")\nprint(f\"{'n':>6} {'Insertion O(n²)':>18} {'Merge O(n log n)':>18} {'Winner':>10}\")\nprint(\"-\" * 55)\n\nfor n in [5, 10, 20, 50, 100, 500]:\n    items = [random.randint(0, 1000) for _ in range(n)]\n    \n    start = time.time()\n    for _ in range(1000):\n        insertion_sort(items)\n    t_ins = time.time() - start\n    \n    start = time.time()\n    for _ in range(1000):\n        merge_sort(items)\n    t_merge = time.time() - start\n    \n    winner = \"Insertion\" if t_ins < t_merge else \"Merge\"\n    print(f\"{n:>6} {t_ins:>18.4f} {t_merge:>18.4f} {winner:>10}\")",
          description: "Simple algorithms can win for small inputs",
        },
        {
          id: "choosing-algorithm",
          title: "Decision Framework",
          code: "def recommend_search(n, is_sorted, search_count):\n    \"\"\"Recommend search algorithm based on context.\"\"\"\n    print(f\"\\nScenario: {n:,} items, sorted={is_sorted}, searches={search_count:,}\")\n    \n    if not is_sorted and search_count == 1:\n        print(\"  → Linear search O(n)\")\n        print(\"    Reason: Sorting would cost O(n log n) for just one search\")\n    elif not is_sorted and search_count > 1:\n        sort_cost = n * 10  # Approximate n log n\n        linear_cost = n * search_count\n        binary_cost = sort_cost + search_count * 20  # log n per search\n        \n        if binary_cost < linear_cost:\n            print(f\"  → Sort once O(n log n), then binary search O(log n)\")\n            print(f\"    Sort cost: ~{sort_cost:,}, Search cost: ~{search_count * 20:,}\")\n            print(f\"    Total: ~{binary_cost:,} vs linear: ~{linear_cost:,}\")\n        else:\n            print(f\"  → Linear search O(n) each time\")\n            print(f\"    Total: ~{linear_cost:,} vs sort+binary: ~{binary_cost:,}\")\n    elif is_sorted:\n        print(\"  → Binary search O(log n)\")\n        print(f\"    Only ~{n.bit_length()} comparisons per search!\")\n\nrecommend_search(n=1000, is_sorted=False, search_count=1)\nrecommend_search(n=1000, is_sorted=False, search_count=100)\nrecommend_search(n=1000000, is_sorted=True, search_count=1000)",
          description: "Context determines best algorithm",
        },
      ]),
      keyPoints: [
        "Same problem can have multiple solutions",
        "Compare Big O complexity first",
        "Consider typical input size",
        "Factor in constant overhead for small n",
        "Consider memory usage too",
        "Simpler algorithm might win for small n",
        "Context matters: one-time vs repeated",
        "Profile with real data when in doubt",
      ],
      hardwareDemo: "Race different algorithms side by side. See crossover points where faster Big O wins.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson9_3_1.number}: ${lesson9_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson9_3_1.id,
        number: 1,
        title: "Choose the Algorithm",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "For searching 1 million sorted items once, which is best?",
        starterCode: "",
        solution: "Binary search O(log n) - only ~20 comparisons",
        testCases: JSON.stringify([
          { input: "Binary search", expectedOutput: "true", description: "Correct!" },
          { input: "Linear search", expectedOutput: "false", description: "Would need up to 1M comparisons" },
          { input: "Sort then search", expectedOutput: "false", description: "Already sorted!" },
        ]),
        hints: ["Data is already sorted", "log₂(1,000,000) ≈ 20"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson9_3_1.id,
        number: 2,
        title: "Compare Two Approaches",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Compare O(n²) and O(n) approaches to finding if a list contains duplicates.",
        starterCode: "import time\n\ndef has_dup_n2(items):\n    # O(n²): compare all pairs\n    pass\n\ndef has_dup_n(items):\n    # O(n): use a set\n    pass\n\n# Compare for n = 1000",
        solution: "import time\n\ndef has_dup_n2(items):\n    for i in range(len(items)):\n        for j in range(i + 1, len(items)):\n            if items[i] == items[j]:\n                return True\n    return False\n\ndef has_dup_n(items):\n    seen = set()\n    for item in items:\n        if item in seen:\n            return True\n        seen.add(item)\n    return False\n\nn = 1000\nitems = list(range(n))  # No duplicates\n\nstart = time.time()\nhas_dup_n2(items)\nt1 = time.time() - start\n\nstart = time.time()\nhas_dup_n(items)\nt2 = time.time() - start\n\nprint(f\"O(n²): {t1:.4f}s\")\nprint(f\"O(n):  {t2:.6f}s\")\nprint(f\"Ratio: {t1/t2:.0f}x faster with O(n)\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "O(n) much faster", description: "Comparison shown" }]),
        hints: ["Nested loops for O(n²)", "Set for O(n)"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson9_3_1.id,
        number: 3,
        title: "Find the Crossover",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find at what n the O(n log n) algorithm beats O(n²).",
        starterCode: "import time\nimport random\n\ndef sort_n2(items):\n    \"\"\"Bubble sort O(n²).\"\"\"\n    arr = items.copy()\n    n = len(arr)\n    for i in range(n):\n        for j in range(n - 1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\ndef sort_nlogn(items):\n    \"\"\"Python's built-in O(n log n).\"\"\"\n    return sorted(items)\n\n# Find where built-in becomes faster\n# Test n = 10, 20, 50, 100, 200",
        solution: "import time\nimport random\n\ndef sort_n2(items):\n    arr = items.copy()\n    n = len(arr)\n    for i in range(n):\n        for j in range(n - 1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\ndef sort_nlogn(items):\n    return sorted(items)\n\nprint(f\"{'n':>6} {'Bubble O(n²)':>15} {'Sorted O(n log n)':>18} {'Winner':>10}\")\nprint(\"-\" * 55)\n\nfor n in [10, 20, 50, 100, 200, 500]:\n    items = [random.randint(0, 1000) for _ in range(n)]\n    \n    start = time.time()\n    for _ in range(100):\n        sort_n2(items)\n    t1 = (time.time() - start) / 100\n    \n    start = time.time()\n    for _ in range(100):\n        sort_nlogn(items)\n    t2 = (time.time() - start) / 100\n    \n    winner = \"Bubble\" if t1 < t2 else \"Sorted\"\n    print(f\"{n:>6} {t1:>15.6f} {t2:>18.6f} {winner:>10}\")\n\nprint(\"\\nCrossover point depends on implementation overhead.\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Crossover identified", description: "Crossover found" }]),
        hints: ["Time both for increasing n", "Built-in has low overhead"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson9_3_1.id,
        number: 4,
        title: "Recommend Algorithm",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write a function that recommends search strategy based on context.",
        starterCode: "def recommend_search_strategy(n, is_sorted, num_searches):\n    \"\"\"\n    Return recommendation based on:\n    - n: number of items\n    - is_sorted: whether data is already sorted\n    - num_searches: how many searches will be performed\n    \"\"\"\n    pass\n\n# Test cases\nprint(recommend_search_strategy(100, False, 1))\nprint(recommend_search_strategy(100000, False, 1000))\nprint(recommend_search_strategy(1000000, True, 1))",
        solution: "def recommend_search_strategy(n, is_sorted, num_searches):\n    if is_sorted:\n        return f\"Binary search: ~{n.bit_length()} ops per search, {n.bit_length() * num_searches} total\"\n    \n    # Cost of sorting: n log n\n    sort_cost = n * (n.bit_length())\n    # Linear search cost: n per search\n    linear_total = n * num_searches\n    # Binary after sort: sort once + log n per search\n    binary_total = sort_cost + (n.bit_length() * num_searches)\n    \n    if num_searches == 1:\n        return f\"Linear search: ~{n} ops (sorting for 1 search not worth it)\"\n    elif binary_total < linear_total:\n        return f\"Sort then binary: ~{binary_total:,} ops (vs linear: ~{linear_total:,})\"\n    else:\n        return f\"Linear search: ~{linear_total:,} ops (sort overhead too high)\"\n\nprint(recommend_search_strategy(100, False, 1))\nprint(recommend_search_strategy(100000, False, 1000))\nprint(recommend_search_strategy(1000000, True, 1))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Appropriate recommendations", description: "Smart recommendations" }]),
        hints: ["Compare total costs", "Sorting is O(n log n) upfront cost"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson9_3_1.id,
        number: 5,
        title: "Real-World Tradeoff",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Compare memory-efficient O(n²) vs fast O(n) with extra memory for sum pairs.",
        starterCode: "def find_pair_n2(items, target):\n    \"\"\"O(n²) time, O(1) space - check all pairs.\"\"\"\n    pass\n\ndef find_pair_n(items, target):\n    \"\"\"O(n) time, O(n) space - use hash set.\"\"\"\n    pass\n\n# Compare both approaches for n=1000, target=999",
        solution: "import time\n\ndef find_pair_n2(items, target):\n    \"\"\"O(n²) time, O(1) space.\"\"\"\n    for i in range(len(items)):\n        for j in range(i + 1, len(items)):\n            if items[i] + items[j] == target:\n                return (items[i], items[j])\n    return None\n\ndef find_pair_n(items, target):\n    \"\"\"O(n) time, O(n) space.\"\"\"\n    seen = set()\n    for num in items:\n        complement = target - num\n        if complement in seen:\n            return (complement, num)\n        seen.add(num)\n    return None\n\nn = 1000\nitems = list(range(n))\ntarget = 999  # 0 + 999, 1 + 998, etc.\n\nstart = time.time()\nresult1 = find_pair_n2(items, target)\nt1 = time.time() - start\n\nstart = time.time()\nresult2 = find_pair_n(items, target)\nt2 = time.time() - start\n\nprint(f\"O(n²) approach:\")\nprint(f\"  Time: {t1:.4f}s\")\nprint(f\"  Space: O(1) - no extra memory\")\nprint(f\"  Result: {result1}\")\nprint()\nprint(f\"O(n) approach:\")\nprint(f\"  Time: {t2:.6f}s\")\nprint(f\"  Space: O(n) - stores seen numbers\")\nprint(f\"  Result: {result2}\")\nprint()\nprint(f\"Speed improvement: {t1/t2:.0f}x faster\")\nprint(f\"Memory tradeoff: Uses O(n) extra space\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Time/space tradeoff shown", description: "Tradeoff demonstrated" }]),
        hints: ["Hash set gives O(1) lookup", "But requires O(n) extra space"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 9.3.1`);

  // ==================== LESSON 9.3.2 ====================
  const lesson9_3_2 = await prisma.lesson.upsert({
    where: { slug: "space-complexity" },
    update: {},
    create: {
      sectionId: section9_3.id,
      number: 9.32,
      title: "Space Complexity",
      slug: "space-complexity",
      objectives: [
        "Understand space complexity concept",
        "Analyze memory usage of algorithms",
        "Know common space complexities",
        "Understand time-space tradeoffs",
      ],
      content: `# Space Complexity

## What is Space Complexity?

Space complexity measures **memory usage** as input grows.

Like time complexity, we use Big O notation:
- O(1): Constant space - same memory regardless of input
- O(n): Linear space - memory grows with input
- O(n²): Quadratic space - memory grows with square of input

## Counting Memory Usage

\`\`\`python
def example(n):
    x = 1           # O(1) - single variable
    arr = [0] * n   # O(n) - array of n elements
    matrix = [[0] * n for _ in range(n)]  # O(n²)
\`\`\`

## O(1) Space - In-Place Operations

\`\`\`python
def reverse_in_place(items):
    left, right = 0, len(items) - 1
    while left < right:
        items[left], items[right] = items[right], items[left]
        left += 1
        right -= 1
    # Only uses a few variables - O(1) space!
\`\`\`

## O(n) Space - Creating New Structures

\`\`\`python
def reverse_copy(items):
    return items[::-1]  # Creates new list - O(n) space
\`\`\`

## Time-Space Tradeoff

Often you can trade space for time:

| Approach | Time | Space |
|----------|------|-------|
| Recalculate each time | Slower | O(1) |
| Cache/memoize results | Faster | O(n) |

## Auxiliary Space vs Total Space

- **Total space**: All memory used
- **Auxiliary space**: Extra memory beyond input

Usually we care about **auxiliary space**.`,
      codeExamples: JSON.stringify([
        {
          id: "space-basics",
          title: "Understanding Space Complexity",
          code: "import sys\n\ndef constant_space(n):\n    \"\"\"O(1) space - same memory for any n.\"\"\"\n    total = 0\n    for i in range(n):\n        total += i\n    return total\n\ndef linear_space(n):\n    \"\"\"O(n) space - creates list of n items.\"\"\"\n    items = list(range(n))\n    return sum(items)\n\ndef quadratic_space(n):\n    \"\"\"O(n²) space - creates n×n matrix.\"\"\"\n    matrix = [[0] * n for _ in range(n)]\n    return matrix\n\n# Compare memory usage\nprint(\"Space complexity comparison:\")\nfor n in [100, 1000, 10000]:\n    # O(1): just a few variables\n    const_mem = sys.getsizeof(0) * 3  # total, i, n\n    \n    # O(n): list of n integers\n    lin_mem = sys.getsizeof(list(range(n)))\n    \n    # O(n²): n×n matrix\n    if n <= 1000:  # Don't create huge matrices\n        quad_mem = sys.getsizeof([[0]*n for _ in range(n)])\n    else:\n        quad_mem = n * n * 28  # Approximate\n    \n    print(f\"n={n:5}: O(1)={const_mem:>8} bytes, O(n)={lin_mem:>10,} bytes, O(n²)≈{quad_mem:>12,} bytes\")",
          description: "Different space complexities",
        },
        {
          id: "in-place-vs-copy",
          title: "In-Place vs Creating Copy",
          code: "def reverse_in_place(items):\n    \"\"\"O(1) auxiliary space - modifies original.\"\"\"\n    left, right = 0, len(items) - 1\n    while left < right:\n        items[left], items[right] = items[right], items[left]\n        left += 1\n        right -= 1\n    return items  # Same list, modified\n\ndef reverse_copy(items):\n    \"\"\"O(n) auxiliary space - creates new list.\"\"\"\n    return items[::-1]  # New list\n\n# Demonstrate difference\noriginal = [1, 2, 3, 4, 5]\nprint(f\"Original: {original}\")\nprint(f\"Original id: {id(original)}\")\n\n# Copy approach\ncopy_result = reverse_copy(original)\nprint(f\"\\nreverse_copy result: {copy_result}\")\nprint(f\"Original unchanged: {original}\")\nprint(f\"Different objects: {id(original) != id(copy_result)}\")\n\n# In-place approach\ninplace_result = reverse_in_place(original)\nprint(f\"\\nreverse_in_place result: {inplace_result}\")\nprint(f\"Original modified: {original}\")\nprint(f\"Same object: {id(original) == id(inplace_result)}\")",
          description: "O(1) in-place vs O(n) copy",
        },
        {
          id: "time-space-tradeoff",
          title: "Time-Space Tradeoff",
          code: "import time\n\ndef fib_no_cache(n):\n    \"\"\"O(2^n) time, O(n) space (call stack).\"\"\"\n    if n <= 1:\n        return n\n    return fib_no_cache(n-1) + fib_no_cache(n-2)\n\ndef fib_with_cache(n, cache=None):\n    \"\"\"O(n) time, O(n) space (cache + call stack).\"\"\"\n    if cache is None:\n        cache = {}\n    if n in cache:\n        return cache[n]\n    if n <= 1:\n        return n\n    cache[n] = fib_with_cache(n-1, cache) + fib_with_cache(n-2, cache)\n    return cache[n]\n\ndef fib_iterative(n):\n    \"\"\"O(n) time, O(1) space - optimal!\"\"\"\n    if n <= 1:\n        return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b\n\nn = 30\nprint(f\"Computing fib({n}):\")\n\nstart = time.time()\nresult1 = fib_no_cache(n)\nt1 = time.time() - start\nprint(f\"  No cache: {result1}, Time: {t1:.4f}s, Space: O(n) call stack\")\n\nstart = time.time()\nresult2 = fib_with_cache(n)\nt2 = time.time() - start\nprint(f\"  With cache: {result2}, Time: {t2:.6f}s, Space: O(n) cache\")\n\nstart = time.time()\nresult3 = fib_iterative(n)\nt3 = time.time() - start\nprint(f\"  Iterative: {result3}, Time: {t3:.6f}s, Space: O(1)\")\n\nprint(f\"\\nCache gave {t1/t2:.0f}x speedup!\")\nprint(\"Iterative: same speed as cache but O(1) space!\")",
          description: "Trading space for time",
        },
        {
          id: "analyze-real-code",
          title: "Analyzing Real Code",
          code: "def analyze_space(name, description, space):\n    print(f\"{name}:\")\n    print(f\"  {description}\")\n    print(f\"  Space: {space}\")\n    print()\n\n# Example 1: Finding maximum\ndef find_max(items):\n    max_val = items[0]  # One variable\n    for item in items:   # One variable (item)\n        if item > max_val:\n            max_val = item\n    return max_val\n\nanalyze_space(\n    \"find_max\",\n    \"Uses only a few variables regardless of input size\",\n    \"O(1) - constant\"\n)\n\n# Example 2: Creating histogram\ndef create_histogram(items):\n    counts = {}  # Dict grows with unique items\n    for item in items:\n        counts[item] = counts.get(item, 0) + 1\n    return counts\n\nanalyze_space(\n    \"create_histogram\",\n    \"Dict can grow up to n entries (if all unique)\",\n    \"O(n) - linear\"\n)\n\n# Example 3: All pairs\ndef all_pairs(items):\n    pairs = []\n    for i in items:\n        for j in items:\n            pairs.append((i, j))\n    return pairs\n\nanalyze_space(\n    \"all_pairs\",\n    \"Creates list with n² pairs\",\n    \"O(n²) - quadratic\"\n)",
          description: "Analyzing space in practice",
        },
      ]),
      keyPoints: [
        "Space complexity measures memory growth",
        "O(1): constant - few variables",
        "O(n): linear - array/dict of n items",
        "O(n²): quadratic - 2D matrix",
        "In-place algorithms: O(1) auxiliary space",
        "Copying data: adds O(n) space",
        "Time-space tradeoff: cache for speed",
        "Usually count auxiliary (extra) space",
      ],
      hardwareDemo: "Visualize memory allocation. Show in-place vs copy operations in memory.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson9_3_2.number}: ${lesson9_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson9_3_2.id,
        number: 1,
        title: "Identify Space Complexity",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "What's the space complexity of: `result = [x*2 for x in items]`?",
        starterCode: "",
        solution: "O(n) - creates new list with n elements",
        testCases: JSON.stringify([
          { input: "O(n)", expectedOutput: "true", description: "Correct!" },
          { input: "O(1)", expectedOutput: "false", description: "Creates a new list" },
          { input: "O(n²)", expectedOutput: "false", description: "Only n elements, not n²" },
        ]),
        hints: ["New list is created", "Same size as input"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson9_3_2.id,
        number: 2,
        title: "O(1) Space Solution",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function to double all values IN PLACE (O(1) space).",
        starterCode: "def double_values(items):\n    \"\"\"Double each value in-place. O(1) auxiliary space.\"\"\"\n    # Don't create new list!\n    pass\n\ntest = [1, 2, 3, 4, 5]\ndouble_values(test)\nprint(test)  # Should be [2, 4, 6, 8, 10]",
        solution: "def double_values(items):\n    \"\"\"Double each value in-place. O(1) auxiliary space.\"\"\"\n    for i in range(len(items)):\n        items[i] *= 2\n\ntest = [1, 2, 3, 4, 5]\nprint(f\"Before: {test}\")\ndouble_values(test)\nprint(f\"After: {test}\")\nprint(\"\\nSpace: O(1) - only uses index variable i\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[2, 4, 6, 8, 10]", description: "In-place modification" }]),
        hints: ["Modify items[i] directly", "Don't create new list"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson9_3_2.id,
        number: 3,
        title: "Analyze Space Usage",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Analyze and label the space complexity of each function.",
        starterCode: "def func_a(n):\n    total = 0\n    for i in range(n):\n        total += i\n    return total\n\ndef func_b(n):\n    return list(range(n))\n\ndef func_c(n):\n    return [[0] * n for _ in range(n)]\n\n# Print space complexity for each",
        solution: "def func_a(n):\n    total = 0\n    for i in range(n):\n        total += i\n    return total\n\ndef func_b(n):\n    return list(range(n))\n\ndef func_c(n):\n    return [[0] * n for _ in range(n)]\n\nprint(\"Space complexity analysis:\")\nprint()\nprint(\"func_a: O(1)\")\nprint(\"  - Only uses 'total' and 'i' variables\")\nprint(\"  - Same memory regardless of n\")\nprint()\nprint(\"func_b: O(n)\")\nprint(\"  - Creates list with n elements\")\nprint(\"  - Memory grows linearly with n\")\nprint()\nprint(\"func_c: O(n²)\")\nprint(\"  - Creates n lists, each with n elements\")\nprint(\"  - Total: n × n = n² elements\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "O(1), O(n), O(n²)", description: "Correct analysis" }]),
        hints: ["Count data structures created", "Matrix is n×n"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson9_3_2.id,
        number: 4,
        title: "Time-Space Tradeoff",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement two versions: one fast with cache, one memory-efficient without.",
        starterCode: "def factorial_cached(n, cache={}):\n    \"\"\"O(n) time, O(n) space - uses cache.\"\"\"\n    pass\n\ndef factorial_no_cache(n):\n    \"\"\"O(n) time, O(1) space - no cache.\"\"\"\n    pass\n\n# Compare both for n = 10",
        solution: "import time\n\ndef factorial_cached(n, cache={}):\n    \"\"\"O(n) time for first call, O(1) for cached. O(n) space.\"\"\"\n    if n in cache:\n        return cache[n]\n    if n <= 1:\n        return 1\n    cache[n] = n * factorial_cached(n - 1, cache)\n    return cache[n]\n\ndef factorial_no_cache(n):\n    \"\"\"O(n) time always. O(1) space.\"\"\"\n    result = 1\n    for i in range(2, n + 1):\n        result *= i\n    return result\n\nprint(\"First call (no cache advantage):\")\nfor n in [10, 100, 500]:\n    start = time.time()\n    r1 = factorial_cached(n, {})\n    t1 = time.time() - start\n    \n    start = time.time()\n    r2 = factorial_no_cache(n)\n    t2 = time.time() - start\n    \n    print(f\"n={n}: cached={t1:.6f}s, no_cache={t2:.6f}s\")\n\nprint(\"\\nCached version: O(n) space for cache\")\nprint(\"No-cache version: O(1) space, just one variable\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Both work, different space", description: "Tradeoff shown" }]),
        hints: ["Cache stores previous results", "Iterative needs only result variable"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson9_3_2.id,
        number: 5,
        title: "Optimize Space",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Rewrite this O(n) space function to use O(1) space.",
        starterCode: "def running_sum_extra_space(items):\n    \"\"\"O(n) space - creates new list.\"\"\"\n    result = []\n    total = 0\n    for item in items:\n        total += item\n        result.append(total)\n    return result\n\ndef running_sum_in_place(items):\n    \"\"\"O(1) space - modify in place.\"\"\"\n    pass\n\ntest = [1, 2, 3, 4, 5]\nprint(running_sum_extra_space(test.copy()))\nrunning_sum_in_place(test)\nprint(test)",
        solution: "def running_sum_extra_space(items):\n    \"\"\"O(n) space - creates new list.\"\"\"\n    result = []\n    total = 0\n    for item in items:\n        total += item\n        result.append(total)\n    return result\n\ndef running_sum_in_place(items):\n    \"\"\"O(1) space - modify in place.\"\"\"\n    for i in range(1, len(items)):\n        items[i] += items[i - 1]\n    return items\n\ntest1 = [1, 2, 3, 4, 5]\ntest2 = [1, 2, 3, 4, 5]\n\nprint(f\"Original: {test1}\")\nprint(f\"Extra space result: {running_sum_extra_space(test1.copy())}\")\nprint(f\"Original unchanged: {test1}\")\nprint()\nrunning_sum_in_place(test2)\nprint(f\"In-place result: {test2}\")\nprint(\"\\nIn-place: O(1) auxiliary space!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[1, 3, 6, 10, 15]", description: "Same result, less space" }]),
        hints: ["Add previous element to current", "items[i] += items[i-1]"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 9.3.2`);

  // ==================== LESSON 9.3.3 ====================
  const lesson9_3_3 = await prisma.lesson.upsert({
    where: { slug: "best-average-worst-case" },
    update: {},
    create: {
      sectionId: section9_3.id,
      number: 9.33,
      title: "Best, Average, Worst Case",
      slug: "best-average-worst-case",
      objectives: [
        "Understand best, average, and worst case",
        "Know which case Big O typically describes",
        "Analyze algorithms for different cases",
        "Make informed algorithm choices",
      ],
      content: `# Best, Average, and Worst Case

## The Three Cases

For the same algorithm, performance can vary based on input:

- **Best case**: Fastest possible execution
- **Average case**: Typical execution
- **Worst case**: Slowest possible execution

## Example: Linear Search

\`\`\`python
def linear_search(items, target):
    for i, item in enumerate(items):
        if item == target:
            return i
    return -1
\`\`\`

- **Best case**: Target is first element → O(1)
- **Average case**: Target is in middle → O(n/2) = O(n)
- **Worst case**: Target not in list → O(n)

## Which Case Does Big O Describe?

By convention, **Big O usually means worst case**.

Why? Because we want **guarantees**:
- "This algorithm will NEVER take longer than O(n²)"
- Worst case is the safe upper bound

## Notation

- **O (Big O)**: Upper bound (worst case)
- **Ω (Big Omega)**: Lower bound (best case)
- **Θ (Big Theta)**: Tight bound (average case)

In practice, most people just use Big O for everything.

## Why Worst Case Matters

1. **Guarantees**: Know the maximum time
2. **Security**: Attackers might craft worst-case inputs
3. **Reliability**: System must handle all inputs
4. **Planning**: Resource allocation needs upper bounds`,
      codeExamples: JSON.stringify([
        {
          id: "three-cases-search",
          title: "Linear Search: All Three Cases",
          code: "def linear_search_counted(items, target):\n    \"\"\"Return (found, comparisons).\"\"\"\n    for i, item in enumerate(items):\n        if item == target:\n            return True, i + 1\n    return False, len(items)\n\nn = 1000\nitems = list(range(n))\n\n# Best case: target is first\nfound, ops = linear_search_counted(items, 0)\nprint(f\"Best case (first element):\")\nprint(f\"  Target: 0, Found: {found}, Comparisons: {ops}\")\nprint(f\"  Complexity: O(1)\")\n\n# Average case: target is in middle\nfound, ops = linear_search_counted(items, n // 2)\nprint(f\"\\nAverage case (middle element):\")\nprint(f\"  Target: {n//2}, Found: {found}, Comparisons: {ops}\")\nprint(f\"  Complexity: O(n/2) = O(n)\")\n\n# Worst case: target not found\nfound, ops = linear_search_counted(items, -1)\nprint(f\"\\nWorst case (not found):\")\nprint(f\"  Target: -1, Found: {found}, Comparisons: {ops}\")\nprint(f\"  Complexity: O(n)\")\n\nprint(f\"\\nBig O reports worst case: O(n)\")",
          description: "Same algorithm, different inputs",
        },
        {
          id: "quicksort-cases",
          title: "Quicksort: When Worst Case Hits",
          code: "def quicksort_counted(items):\n    \"\"\"Quicksort that counts comparisons.\"\"\"\n    comparisons = [0]  # Use list to allow modification in nested function\n    \n    def sort(arr):\n        if len(arr) <= 1:\n            return arr\n        pivot = arr[0]  # Bad pivot choice for sorted input!\n        left = []\n        right = []\n        for x in arr[1:]:\n            comparisons[0] += 1\n            if x < pivot:\n                left.append(x)\n            else:\n                right.append(x)\n        return sort(left) + [pivot] + sort(right)\n    \n    result = sort(items)\n    return result, comparisons[0]\n\nimport random\n\nn = 100\n\n# Average case: random order\nrandom_items = list(range(n))\nrandom.shuffle(random_items)\n_, avg_ops = quicksort_counted(random_items)\n\n# Worst case: already sorted!\nsorted_items = list(range(n))\n_, worst_ops = quicksort_counted(sorted_items)\n\nprint(f\"Quicksort with n={n}:\")\nprint(f\"  Random input: {avg_ops} comparisons\")\nprint(f\"  Already sorted: {worst_ops} comparisons\")\nprint(f\"  Ratio: {worst_ops/avg_ops:.1f}x worse!\")\nprint()\nprint(f\"Average case: O(n log n) ≈ {n * n.bit_length()}\")\nprint(f\"Worst case: O(n²) = {n * n}\")\nprint(f\"\\nThis is why good pivot selection matters!\")",
          description: "Quicksort degrades on sorted input",
        },
        {
          id: "hash-table-cases",
          title: "Hash Table: Usually O(1), Sometimes O(n)",
          code: "import time\n\nclass SimpleHashTable:\n    \"\"\"Hash table demonstrating best and worst cases.\"\"\"\n    \n    def __init__(self, size=10):\n        self.size = size\n        self.buckets = [[] for _ in range(size)]\n        self.lookups = 0\n    \n    def _hash(self, key):\n        return hash(key) % self.size\n    \n    def insert(self, key, value):\n        bucket = self.buckets[self._hash(key)]\n        bucket.append((key, value))\n    \n    def get(self, key):\n        bucket = self.buckets[self._hash(key)]\n        self.lookups = 0\n        for k, v in bucket:\n            self.lookups += 1\n            if k == key:\n                return v, self.lookups\n        return None, self.lookups\n\n# Good case: keys spread across buckets\nht_good = SimpleHashTable(100)\nfor i in range(100):\n    ht_good.insert(f\"key_{i}\", i)\n\nval, ops = ht_good.get(\"key_50\")\nprint(f\"Good distribution:\")\nprint(f\"  Looking up 'key_50': found {val}, comparisons: {ops}\")\nprint(f\"  Complexity: O(1)\")\n\n# Bad case: all keys hash to same bucket\nclass BadHashTable(SimpleHashTable):\n    def _hash(self, key):\n        return 0  # Everything goes to bucket 0!\n\nht_bad = BadHashTable(100)\nfor i in range(100):\n    ht_bad.insert(f\"key_{i}\", i)\n\nval, ops = ht_bad.get(\"key_99\")  # Last item\nprint(f\"\\nAll same bucket (pathological):\")\nprint(f\"  Looking up 'key_99': found {val}, comparisons: {ops}\")\nprint(f\"  Complexity: O(n)\")\n\nprint(f\"\\nHash tables: O(1) average, O(n) worst case\")",
          description: "Hash collisions cause O(n) worst case",
        },
        {
          id: "making-decisions",
          title: "Using Case Analysis for Decisions",
          code: "def analyze_algorithm(name, best, avg, worst):\n    print(f\"{name}:\")\n    print(f\"  Best case:    {best}\")\n    print(f\"  Average case: {avg}\")\n    print(f\"  Worst case:   {worst}\")\n    print()\n\nprint(\"Algorithm Case Analysis:\")\nprint(\"=\" * 40)\nprint()\n\nanalyze_algorithm(\n    \"Linear Search\",\n    \"O(1) - first element\",\n    \"O(n) - middle element\",\n    \"O(n) - not found\"\n)\n\nanalyze_algorithm(\n    \"Binary Search\",\n    \"O(1) - middle element\",\n    \"O(log n)\",\n    \"O(log n) - not found\"\n)\n\nanalyze_algorithm(\n    \"Quicksort\",\n    \"O(n log n) - good pivots\",\n    \"O(n log n)\",\n    \"O(n²) - bad pivots (sorted input)\"\n)\n\nanalyze_algorithm(\n    \"Hash Table Lookup\",\n    \"O(1) - no collision\",\n    \"O(1) - few collisions\",\n    \"O(n) - all collisions\"\n)\n\nprint(\"Decision Guide:\")\nprint(\"-\" * 40)\nprint(\"• If worst case is rare and avg is good: Often acceptable\")\nprint(\"• If worst case is common: Find better algorithm\")\nprint(\"• For security: Always assume worst case\")\nprint(\"• For user-facing: Consider average case\")",
          description: "Making informed choices",
        },
      ]),
      keyPoints: [
        "Best case: fastest possible (lucky input)",
        "Average case: typical performance",
        "Worst case: slowest possible",
        "Big O usually means worst case",
        "Worst case provides guarantees",
        "Average case for typical usage planning",
        "Some algorithms have same best/worst (binary search)",
        "Others vary widely (quicksort: n log n vs n²)",
      ],
      hardwareDemo: "Run algorithm with best, average, worst inputs. Visualize performance differences.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson9_3_3.number}: ${lesson9_3_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson9_3_3.id,
        number: 1,
        title: "Identify the Case",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "Linear search finds target at index 0. Which case is this?",
        starterCode: "",
        solution: "Best case - found immediately, O(1)",
        testCases: JSON.stringify([
          { input: "Best case", expectedOutput: "true", description: "Correct!" },
          { input: "Average case", expectedOutput: "false", description: "Average is middle" },
          { input: "Worst case", expectedOutput: "false", description: "Worst is not found" },
        ]),
        hints: ["First element = minimum work", "Only 1 comparison needed"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson9_3_3.id,
        number: 2,
        title: "Demonstrate All Cases",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show best, average, and worst case for linear search.",
        starterCode: "def linear_search(items, target):\n    ops = 0\n    for i, item in enumerate(items):\n        ops += 1\n        if item == target:\n            return i, ops\n    return -1, ops\n\nitems = list(range(100))\n\n# Show best case (target = ?)\n# Show average case (target = ?)\n# Show worst case (target = ?)",
        solution: "def linear_search(items, target):\n    ops = 0\n    for i, item in enumerate(items):\n        ops += 1\n        if item == target:\n            return i, ops\n    return -1, ops\n\nitems = list(range(100))\n\n# Best case: first element\nidx, ops = linear_search(items, 0)\nprint(f\"Best case (target=0): index={idx}, ops={ops}\")\n\n# Average case: middle element\nidx, ops = linear_search(items, 50)\nprint(f\"Average case (target=50): index={idx}, ops={ops}\")\n\n# Worst case: not found\nidx, ops = linear_search(items, -1)\nprint(f\"Worst case (target=-1): index={idx}, ops={ops}\")\n\nprint(f\"\\nBest: O(1), Average: O(n/2)=O(n), Worst: O(n)\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "1, 51, 100 operations", description: "All cases shown" }]),
        hints: ["Best: target at index 0", "Worst: target not in list"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson9_3_3.id,
        number: 3,
        title: "Binary Search Cases",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show that binary search has similar best and worst case.",
        starterCode: "def binary_search(items, target):\n    ops = 0\n    left, right = 0, len(items) - 1\n    while left <= right:\n        ops += 1\n        mid = (left + right) // 2\n        if items[mid] == target:\n            return mid, ops\n        elif items[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1, ops\n\nitems = list(range(1000))\n\n# Test best, average, worst cases",
        solution: "def binary_search(items, target):\n    ops = 0\n    left, right = 0, len(items) - 1\n    while left <= right:\n        ops += 1\n        mid = (left + right) // 2\n        if items[mid] == target:\n            return mid, ops\n        elif items[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1, ops\n\nitems = list(range(1000))\nmid_val = items[len(items) // 2]\n\n# Best case: middle element\nidx, ops = binary_search(items, mid_val)\nprint(f\"Best case (middle): index={idx}, ops={ops}\")\n\n# Average case: some element\nidx, ops = binary_search(items, 750)\nprint(f\"Average case (750): index={idx}, ops={ops}\")\n\n# Worst case: not found\nidx, ops = binary_search(items, -1)\nprint(f\"Worst case (not found): index={idx}, ops={ops}\")\n\nprint(f\"\\nAll cases: O(log n) ≈ {1000.bit_length()} operations\")\nprint(\"Binary search is consistent!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All ~10 operations", description: "Consistent O(log n)" }]),
        hints: ["log₂(1000) ≈ 10", "Even worst case is fast"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson9_3_3.id,
        number: 4,
        title: "Insertion Sort Cases",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Show insertion sort's best case (sorted) vs worst case (reverse sorted).",
        starterCode: "def insertion_sort(items):\n    arr = items.copy()\n    ops = 0\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            ops += 1\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr, ops\n\nn = 100\n# Test with sorted, random, and reverse sorted",
        solution: "import random\n\ndef insertion_sort(items):\n    arr = items.copy()\n    ops = 0\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            ops += 1\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr, ops\n\nn = 100\n\n# Best case: already sorted\nsorted_list = list(range(n))\n_, best_ops = insertion_sort(sorted_list)\nprint(f\"Best case (already sorted): {best_ops} operations\")\n\n# Average case: random order\nrandom_list = list(range(n))\nrandom.shuffle(random_list)\n_, avg_ops = insertion_sort(random_list)\nprint(f\"Average case (random): {avg_ops} operations\")\n\n# Worst case: reverse sorted\nreverse_list = list(range(n, 0, -1))\n_, worst_ops = insertion_sort(reverse_list)\nprint(f\"Worst case (reverse sorted): {worst_ops} operations\")\n\nprint(f\"\\nBest: O(n) ≈ {n}\")\nprint(f\"Worst: O(n²) = {n*n}\")\nprint(f\"\\nInsertion sort is great for nearly-sorted data!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Huge difference between cases", description: "Case variation shown" }]),
        hints: ["Sorted: no swaps needed", "Reverse: maximum swaps"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson9_3_3.id,
        number: 5,
        title: "Algorithm Selection",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Given a scenario, recommend which algorithm to use based on case analysis.",
        starterCode: "def recommend_sort(data_description):\n    \"\"\"\n    Recommend sorting algorithm based on data characteristics.\n    Consider: nearly sorted, random, reverse sorted\n    Algorithms: insertion sort, merge sort\n    \"\"\"\n    pass\n\n# Test scenarios\nscenarios = [\n    \"1000 items, completely random\",\n    \"1000 items, almost sorted (few out of place)\",\n    \"1000 items, reverse sorted\",\n]\n\nfor scenario in scenarios:\n    print(f\"{scenario}:\")\n    # recommend_sort(scenario)",
        solution: "def recommend_sort(data_type, n):\n    print(f\"\\nData: {data_type}, n={n}\")\n    \n    if data_type == \"nearly_sorted\":\n        print(\"  Recommendation: Insertion Sort\")\n        print(\"  Reason: O(n) for nearly sorted (best case)\")\n        print(f\"  Expected ops: ~{n} to ~{n*10}\")\n    elif data_type == \"random\":\n        print(\"  Recommendation: Merge Sort\")\n        print(\"  Reason: Guaranteed O(n log n)\")\n        print(f\"  Expected ops: ~{n * n.bit_length()}\")\n    elif data_type == \"reverse_sorted\":\n        print(\"  Recommendation: Merge Sort\")\n        print(\"  Reason: Insertion sort would be O(n²)!\")\n        print(f\"  Merge: ~{n * n.bit_length()} vs Insertion: ~{n*n}\")\n    elif data_type == \"small\":\n        print(\"  Recommendation: Insertion Sort\")\n        print(\"  Reason: Low overhead, simple code\")\n        print(\"  Even O(n²) is fast for small n\")\n\nprint(\"Algorithm Selection Based on Case Analysis:\")\nprint(\"=\" * 50)\n\nrecommend_sort(\"nearly_sorted\", 1000)\nrecommend_sort(\"random\", 1000)\nrecommend_sort(\"reverse_sorted\", 1000)\nrecommend_sort(\"small\", 20)\n\nprint(\"\\n\" + \"=\" * 50)\nprint(\"Key insight: Know your data to pick the best algorithm!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Smart recommendations", description: "Good analysis" }]),
        hints: ["Nearly sorted → insertion sort", "Unknown/random → merge sort"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 9.3.3`);

  // Verify Chapter 9 is complete
  const chapter9 = await prisma.chapter.findFirst({
    where: { number: 9 },
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

  if (chapter9) {
    console.log("\n" + "=".repeat(60));
    console.log("📚 CHAPTER 9 COMPLETE!");
    console.log("=".repeat(60));
    
    let totalLessons = 0;
    let totalExercises = 0;
    
    for (const section of chapter9.sections) {
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

  // Show overall curriculum status
  const allChapters = await prisma.chapter.findMany({
    orderBy: { number: 'asc' },
    include: {
      sections: {
        include: {
          lessons: {
            include: { _count: { select: { exercises: true } } }
          }
        }
      }
    }
  });

  console.log("\n\n📊 FULL CURRICULUM STATUS:");
  console.log("═".repeat(65));
  
  let grandLessons = 0;
  let grandExercises = 0;
  
  for (const ch of allChapters) {
    let chLessons = 0;
    let chExercises = 0;
    for (const sec of ch.sections) {
      chLessons += sec.lessons.length;
      for (const les of sec.lessons) {
        chExercises += les._count.exercises;
      }
    }
    grandLessons += chLessons;
    grandExercises += chExercises;
    
    const status = chLessons > 0 ? '✅' : '⏳';
    console.log(`${status} Ch ${ch.number}: ${ch.title.substring(0, 40).padEnd(40)} | ${String(chLessons).padStart(2)} lessons, ${String(chExercises).padStart(3)} ex`);
  }
  
  console.log("─".repeat(65));
  console.log(`📈 GRAND TOTAL: ${grandLessons} lessons, ${grandExercises} exercises`);
  console.log("═".repeat(65));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
