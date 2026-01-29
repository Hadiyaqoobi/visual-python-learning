import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 10 Part 2: Lessons 10.2.1-10.2.4...\n");

  const section10_2 = await prisma.section.findFirst({ where: { number: 10.2 } });
  if (!section10_2) throw new Error("Section 10.2 not found.");

  // ==================== LESSON 10.2.1 ====================
  const lesson10_2_1 = await prisma.lesson.upsert({
    where: { slug: "intro-sorting" },
    update: {},
    create: {
      sectionId: section10_2.id,
      number: 10.21,
      title: "Introduction to Sorting",
      slug: "intro-sorting",
      objectives: [
        "Understand why sorting is important",
        "Know the sorting problem definition",
        "Distinguish in-place vs creating new list",
        "Understand stability in sorting",
      ],
      content: `# Introduction to Sorting

## Why Sorting Matters

Sorting is one of the **most fundamental operations** in computer science:

1. **Enables binary search** - O(log n) instead of O(n)
2. **Finds duplicates easily** - adjacent after sorting
3. **Organized output** - reports, displays, rankings
4. **Data analysis** - medians, percentiles, ranges

## The Sorting Problem

**Input**: A sequence of n elements [a₁, a₂, ..., aₙ]
**Output**: A permutation where a'₁ ≤ a'₂ ≤ ... ≤ a'ₙ

\`\`\`python
[3, 1, 4, 1, 5, 9] → [1, 1, 3, 4, 5, 9]
\`\`\`

## In-Place vs New List

**In-place sorting**: Modifies the original list
- Uses O(1) extra space
- Original data is changed

\`\`\`python
items.sort()  # In-place
\`\`\`

**Creating new list**: Returns sorted copy
- Uses O(n) extra space
- Original preserved

\`\`\`python
sorted_items = sorted(items)  # New list
\`\`\`

## Stability

A **stable** sort preserves the relative order of equal elements.

\`\`\`
Input:  [(Alice, 85), (Bob, 90), (Carol, 85)]
Sort by score:

Stable:   [(Alice, 85), (Carol, 85), (Bob, 90)]
          Alice was before Carol, still is

Unstable: [(Carol, 85), (Alice, 85), (Bob, 90)]
          Order of 85s might change
\`\`\`

Python's sort is **stable**.

## Comparison-Based Sorting

Most sorts compare elements pairwise:
- "Is a < b?"
- Lower bound: O(n log n) comparisons required

We'll learn O(n²) and O(n log n) algorithms.`,
      codeExamples: JSON.stringify([
        {
          id: "why-sort",
          title: "Why Sorting Enables Faster Operations",
          code: "import time\n\ndef find_duplicates_unsorted(items):\n    \"\"\"O(n²) - check all pairs.\"\"\"\n    dups = []\n    for i in range(len(items)):\n        for j in range(i + 1, len(items)):\n            if items[i] == items[j] and items[i] not in dups:\n                dups.append(items[i])\n    return dups\n\ndef find_duplicates_sorted(items):\n    \"\"\"O(n) - check adjacent pairs in sorted list.\"\"\"\n    sorted_items = sorted(items)  # O(n log n)\n    dups = []\n    for i in range(len(sorted_items) - 1):\n        if sorted_items[i] == sorted_items[i+1]:\n            if not dups or dups[-1] != sorted_items[i]:\n                dups.append(sorted_items[i])\n    return dups\n\n# Compare performance\nn = 1000\nitems = list(range(n)) + list(range(n // 2))  # Some duplicates\n\nstart = time.time()\nresult1 = find_duplicates_unsorted(items)\nt1 = time.time() - start\n\nstart = time.time()\nresult2 = find_duplicates_sorted(items)\nt2 = time.time() - start\n\nprint(f\"Unsorted approach: {t1:.4f}s\")\nprint(f\"Sorted approach: {t2:.4f}s\")\nprint(f\"Speedup: {t1/t2:.1f}x\")\nprint(f\"Both found {len(result1)} duplicates\")",
          description: "Sorting enables efficient operations",
        },
        {
          id: "in-place-vs-new",
          title: "In-Place vs Creating New List",
          code: "# Original list\noriginal = [5, 2, 8, 1, 9]\nprint(f\"Original: {original}\")\nprint(f\"Original id: {id(original)}\")\nprint()\n\n# Method 1: sorted() - creates NEW list\nsorted_copy = sorted(original)\nprint(f\"sorted(original): {sorted_copy}\")\nprint(f\"Original unchanged: {original}\")\nprint(f\"Different object: {id(sorted_copy) != id(original)}\")\nprint()\n\n# Method 2: .sort() - modifies IN PLACE\nto_sort = [5, 2, 8, 1, 9]\nprint(f\"Before .sort(): {to_sort}\")\nresult = to_sort.sort()  # Returns None!\nprint(f\"After .sort(): {to_sort}\")\nprint(f\".sort() returns: {result}\")\nprint()\n\n# Key difference\nprint(\"Summary:\")\nprint(\"  sorted(list) → new list, original unchanged\")\nprint(\"  list.sort() → None, original modified\")",
          description: "Two ways to sort in Python",
        },
        {
          id: "stability",
          title: "Understanding Sort Stability",
          code: "# Students with (name, score)\nstudents = [\n    (\"Alice\", 85),\n    (\"Bob\", 90),\n    (\"Carol\", 85),\n    (\"Dave\", 92),\n    (\"Eve\", 85),\n]\n\nprint(\"Original order:\")\nfor s in students:\n    print(f\"  {s[0]}: {s[1]}\")\n\n# Sort by score\nsorted_by_score = sorted(students, key=lambda s: s[1])\n\nprint(\"\\nSorted by score (stable sort):\")\nfor s in sorted_by_score:\n    print(f\"  {s[0]}: {s[1]}\")\n\nprint(\"\\nNote: Alice, Carol, Eve all have 85\")\nprint(\"Their relative order is PRESERVED (stable)\")\nprint(\"Alice was before Carol was before Eve\")\nprint(\"After sorting, they're still in that order\")",
          description: "Stable sorts preserve relative order",
        },
        {
          id: "sorting-complexity",
          title: "Sorting Algorithm Complexities",
          code: "import time\nimport random\n\ndef bubble_sort(items):\n    \"\"\"O(n²) - simple but slow.\"\"\"\n    arr = items.copy()\n    n = len(arr)\n    for i in range(n):\n        for j in range(n - 1 - i):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n\n# Compare O(n²) bubble sort vs O(n log n) built-in\nprint(f\"{'Size':>8} {'Bubble O(n²)':>15} {'sorted() O(n log n)':>20}\")\nprint(\"-\" * 48)\n\nfor size in [100, 500, 1000, 2000]:\n    items = [random.randint(0, 10000) for _ in range(size)]\n    \n    start = time.time()\n    bubble_sort(items)\n    t_bubble = time.time() - start\n    \n    start = time.time()\n    sorted(items)\n    t_sorted = time.time() - start\n    \n    print(f\"{size:>8} {t_bubble:>15.4f}s {t_sorted:>20.6f}s\")\n\nprint(\"\\nBuilt-in sorted() uses Timsort: O(n log n)\")",
          description: "O(n²) vs O(n log n) performance",
        },
      ]),
      keyPoints: [
        "Sorting enables binary search and efficient operations",
        "In-place (.sort()) vs new list (sorted())",
        "Stable sort preserves order of equal elements",
        "Python's built-in sort is stable",
        "Comparison sorts need at least O(n log n)",
        "Simple sorts: O(n²), efficient sorts: O(n log n)",
        "sorted() returns new list, preserves original",
        ".sort() modifies in place, returns None",
      ],
      hardwareDemo: "Compare unsorted vs sorted duplicate finding. Show stability with equal elements.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson10_2_1.number}: ${lesson10_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_2_1.id,
        number: 1,
        title: "sorted() vs .sort()",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Demonstrate the difference between sorted() and .sort().",
        starterCode: "numbers = [3, 1, 4, 1, 5, 9]\n\n# Use sorted() and show original is unchanged\n\n# Use .sort() and show original is modified",
        solution: "numbers = [3, 1, 4, 1, 5, 9]\nprint(f\"Original: {numbers}\")\n\n# sorted() - creates new list\nresult = sorted(numbers)\nprint(f\"sorted() result: {result}\")\nprint(f\"Original after sorted(): {numbers}\")\n\n# .sort() - modifies in place\nnumbers2 = [3, 1, 4, 1, 5, 9]\nresult2 = numbers2.sort()\nprint(f\"\\n.sort() returns: {result2}\")\nprint(f\"List after .sort(): {numbers2}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Difference demonstrated", description: "Both shown" }]),
        hints: ["sorted() returns new list", ".sort() returns None"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson10_2_1.id,
        number: 2,
        title: "Verify Stability",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show that Python's sort is stable by sorting objects with equal keys.",
        starterCode: "# Create items with duplicate values\nitems = [\n    {\"name\": \"first\", \"value\": 5},\n    {\"name\": \"second\", \"value\": 3},\n    {\"name\": \"third\", \"value\": 5},\n    {\"name\": \"fourth\", \"value\": 3},\n]\n\n# Sort by value and show items with same value keep original order",
        solution: "items = [\n    {\"name\": \"first\", \"value\": 5},\n    {\"name\": \"second\", \"value\": 3},\n    {\"name\": \"third\", \"value\": 5},\n    {\"name\": \"fourth\", \"value\": 3},\n]\n\nprint(\"Original order:\")\nfor item in items:\n    print(f\"  {item['name']}: {item['value']}\")\n\nsorted_items = sorted(items, key=lambda x: x['value'])\n\nprint(\"\\nAfter sorting by value:\")\nfor item in sorted_items:\n    print(f\"  {item['name']}: {item['value']}\")\n\nprint(\"\\nStability check:\")\nprint(\"  Items with value 3: second, fourth (original order preserved)\")\nprint(\"  Items with value 5: first, third (original order preserved)\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Stability demonstrated", description: "Order preserved" }]),
        hints: ["Sort by 'value' key", "Check order of items with same value"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson10_2_1.id,
        number: 3,
        title: "Custom Sort Key",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Sort a list of strings by length, then alphabetically for same length.",
        starterCode: "words = [\"apple\", \"pie\", \"banana\", \"cat\", \"dog\", \"elephant\"]\n\n# Sort by length (primary), then alphabetically (secondary)\n# Hint: Use a tuple as key",
        solution: "words = [\"apple\", \"pie\", \"banana\", \"cat\", \"dog\", \"elephant\"]\n\nprint(f\"Original: {words}\")\n\n# Sort by (length, word) - length primary, word secondary\nsorted_words = sorted(words, key=lambda w: (len(w), w))\n\nprint(f\"Sorted by length, then alphabetically: {sorted_words}\")\n\n# Verify\nprint(\"\\nBreakdown:\")\nfor word in sorted_words:\n    print(f\"  '{word}' - length {len(word)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "cat, dog, pie, apple, banana, elephant", description: "Multi-key sort" }]),
        hints: ["key=lambda w: (len(w), w)", "Tuple comparison is lexicographic"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson10_2_1.id,
        number: 4,
        title: "Reverse Sorting",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Sort numbers in descending order using both sorted() and .sort().",
        starterCode: "numbers = [3, 1, 4, 1, 5, 9, 2, 6]\n\n# Sort descending with sorted()\n\n# Sort descending with .sort()",
        solution: "numbers = [3, 1, 4, 1, 5, 9, 2, 6]\n\n# sorted() with reverse\ndesc_sorted = sorted(numbers, reverse=True)\nprint(f\"sorted() descending: {desc_sorted}\")\nprint(f\"Original unchanged: {numbers}\")\n\n# .sort() with reverse\nnumbers2 = numbers.copy()\nnumbers2.sort(reverse=True)\nprint(f\".sort() descending: {numbers2}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[9, 6, 5, 4, 3, 2, 1, 1]", description: "Descending order" }]),
        hints: ["Use reverse=True parameter", "Works for both sorted() and .sort()"],
        xpReward: 10,
        order: 4,
      },
      {
        lessonId: lesson10_2_1.id,
        number: 5,
        title: "Why Sorting Helps",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Find the median efficiently using sorting.",
        starterCode: "def find_median_unsorted(items):\n    \"\"\"Find median without sorting - complex!\"\"\"\n    # This is actually hard to do efficiently without sorting\n    pass\n\ndef find_median_sorted(items):\n    \"\"\"Find median using sorting - simple!\"\"\"\n    pass\n\nnumbers = [7, 3, 9, 1, 5, 8, 2, 6, 4]\nprint(f\"Median: {find_median_sorted(numbers)}\")",
        solution: "def find_median_sorted(items):\n    \"\"\"Find median using sorting - O(n log n).\"\"\"\n    sorted_items = sorted(items)\n    n = len(sorted_items)\n    mid = n // 2\n    \n    if n % 2 == 1:\n        return sorted_items[mid]\n    else:\n        return (sorted_items[mid - 1] + sorted_items[mid]) / 2\n\nnumbers = [7, 3, 9, 1, 5, 8, 2, 6, 4]\nprint(f\"Numbers: {numbers}\")\nprint(f\"Sorted: {sorted(numbers)}\")\nprint(f\"Median: {find_median_sorted(numbers)}\")\n\n# Even length example\neven_numbers = [3, 1, 4, 1, 5, 9]\nprint(f\"\\nEven list: {even_numbers}\")\nprint(f\"Sorted: {sorted(even_numbers)}\")\nprint(f\"Median: {find_median_sorted(even_numbers)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Median: 5", description: "Median found" }]),
        hints: ["Sort first", "Middle element for odd length", "Average of two middle for even"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 10.2.1`);

  // ==================== LESSON 10.2.2 ====================
  const lesson10_2_2 = await prisma.lesson.upsert({
    where: { slug: "selection-sort" },
    update: {},
    create: {
      sectionId: section10_2.id,
      number: 10.22,
      title: "Selection Sort",
      slug: "selection-sort",
      objectives: [
        "Understand selection sort algorithm",
        "Implement selection sort in Python",
        "Analyze its O(n²) complexity",
        "Know when simple sorts are appropriate",
      ],
      content: `# Selection Sort

## The Algorithm

Selection sort repeatedly finds the **minimum element** and moves it to the front:

1. Find minimum in unsorted portion
2. Swap it with first unsorted element
3. Move boundary of sorted portion
4. Repeat until all sorted

## Visual Example

\`\`\`
[64, 25, 12, 22, 11]  Find min (11), swap with first
[11, 25, 12, 22, 64]  Find min in rest (12), swap
[11, 12, 25, 22, 64]  Find min in rest (22), swap
[11, 12, 22, 25, 64]  Find min in rest (25), already in place
[11, 12, 22, 25, 64]  Done!
\`\`\`

## Implementation

\`\`\`python
def selection_sort(items):
    n = len(items)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if items[j] < items[min_idx]:
                min_idx = j
        items[i], items[min_idx] = items[min_idx], items[i]
    return items
\`\`\`

## Complexity Analysis

- **Comparisons**: n-1 + n-2 + ... + 1 = n(n-1)/2 = O(n²)
- **Swaps**: Exactly n-1 swaps
- **Time**: O(n²) always (best = worst = average)
- **Space**: O(1) - in-place

## Characteristics

✅ **Advantages**:
- Simple to understand and implement
- In-place (O(1) extra space)
- Minimal swaps (good when swaps are expensive)

❌ **Disadvantages**:
- O(n²) - slow for large lists
- Not stable (equal elements may be reordered)
- Always O(n²), even if already sorted`,
      codeExamples: JSON.stringify([
        {
          id: "basic-selection",
          title: "Basic Selection Sort",
          code: "def selection_sort(items):\n    \"\"\"Sort items in-place using selection sort.\"\"\"\n    n = len(items)\n    \n    for i in range(n):\n        # Find minimum element in remaining unsorted array\n        min_idx = i\n        for j in range(i + 1, n):\n            if items[j] < items[min_idx]:\n                min_idx = j\n        \n        # Swap the found minimum with first unsorted element\n        items[i], items[min_idx] = items[min_idx], items[i]\n    \n    return items\n\n# Test\nnumbers = [64, 25, 12, 22, 11]\nprint(f\"Before: {numbers}\")\nselection_sort(numbers)\nprint(f\"After: {numbers}\")",
          description: "Standard selection sort implementation",
        },
        {
          id: "selection-visualized",
          title: "Selection Sort Visualized",
          code: "def selection_sort_visual(items):\n    \"\"\"Selection sort with step-by-step visualization.\"\"\"\n    arr = items.copy()\n    n = len(arr)\n    \n    for i in range(n):\n        min_idx = i\n        \n        # Find minimum\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        \n        # Visualize\n        sorted_part = str(arr[:i])\n        current = f\"[{arr[i]}]\"\n        rest = str(arr[i+1:])\n        min_val = arr[min_idx]\n        \n        print(f\"Step {i+1}: {arr}\")\n        print(f\"  Sorted: {arr[:i]}, Looking at: {arr[i]}, Min found: {min_val}\")\n        \n        # Swap\n        if min_idx != i:\n            arr[i], arr[min_idx] = arr[min_idx], arr[i]\n            print(f\"  Swap {arr[min_idx]} and {arr[i]} → {arr}\")\n        else:\n            print(f\"  No swap needed\")\n        print()\n    \n    return arr\n\nprint(\"Selection Sort Visualization:\")\nprint(\"=\" * 50)\nselection_sort_visual([64, 25, 12, 22, 11])",
          description: "Step-by-step visualization",
        },
        {
          id: "selection-counted",
          title: "Counting Operations",
          code: "def selection_sort_counted(items):\n    \"\"\"Count comparisons and swaps.\"\"\"\n    arr = items.copy()\n    n = len(arr)\n    comparisons = 0\n    swaps = 0\n    \n    for i in range(n):\n        min_idx = i\n        for j in range(i + 1, n):\n            comparisons += 1\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        \n        if min_idx != i:\n            arr[i], arr[min_idx] = arr[min_idx], arr[i]\n            swaps += 1\n    \n    return arr, comparisons, swaps\n\n# Test with different sizes\nprint(f\"{'Size':>6} {'Comparisons':>15} {'n(n-1)/2':>12} {'Swaps':>8}\")\nprint(\"-\" * 45)\n\nfor size in [5, 10, 20, 50, 100]:\n    items = list(range(size, 0, -1))  # Worst case: reverse sorted\n    _, comps, swaps = selection_sort_counted(items)\n    expected = size * (size - 1) // 2\n    print(f\"{size:>6} {comps:>15} {expected:>12} {swaps:>8}\")\n\nprint(\"\\nComparisons always = n(n-1)/2 = O(n²)\")\nprint(\"Swaps always ≤ n-1\")",
          description: "O(n²) comparisons demonstrated",
        },
        {
          id: "selection-timing",
          title: "Selection Sort Performance",
          code: "import time\nimport random\n\ndef selection_sort(items):\n    arr = items.copy()\n    n = len(arr)\n    for i in range(n):\n        min_idx = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\nprint(\"Selection Sort Performance (O(n²)):\")\nprint(f\"{'Size':>8} {'Time':>12} {'Ratio':>10}\")\nprint(\"-\" * 35)\n\nprev_time = None\nfor size in [500, 1000, 2000, 4000]:\n    items = [random.randint(0, 10000) for _ in range(size)]\n    \n    start = time.time()\n    selection_sort(items)\n    elapsed = time.time() - start\n    \n    ratio = elapsed / prev_time if prev_time else 1.0\n    print(f\"{size:>8} {elapsed:>12.4f}s {ratio:>10.2f}x\")\n    prev_time = elapsed\n\nprint(\"\\nWhen n doubles, time ~quadruples (O(n²))\")",
          description: "Observing O(n²) growth",
        },
      ]),
      keyPoints: [
        "Find minimum, swap to front, repeat",
        "Time: O(n²) always - same for all inputs",
        "Space: O(1) - in-place sorting",
        "Exactly n-1 swaps maximum",
        "Simple but slow for large data",
        "Not stable - may reorder equals",
        "Good when swaps are expensive",
        "Useful for teaching, not production",
      ],
      hardwareDemo: "Watch selection sort find minimum each pass. Count comparisons growing quadratically.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson10_2_2.number}: ${lesson10_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_2_2.id,
        number: 1,
        title: "Implement Selection Sort",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write selection sort that sorts a list in-place.",
        starterCode: "def selection_sort(items):\n    \"\"\"Sort items in-place using selection sort.\"\"\"\n    pass\n\nnums = [64, 34, 25, 12, 22, 11, 90]\nselection_sort(nums)\nprint(nums)  # [11, 12, 22, 25, 34, 64, 90]",
        solution: "def selection_sort(items):\n    n = len(items)\n    for i in range(n):\n        min_idx = i\n        for j in range(i + 1, n):\n            if items[j] < items[min_idx]:\n                min_idx = j\n        items[i], items[min_idx] = items[min_idx], items[i]\n\nnums = [64, 34, 25, 12, 22, 11, 90]\nselection_sort(nums)\nprint(nums)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[11, 12, 22, 25, 34, 64, 90]", description: "Sorted correctly" }]),
        hints: ["Outer loop: position to fill", "Inner loop: find minimum", "Swap after finding min"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson10_2_2.id,
        number: 2,
        title: "Count Operations",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Modify selection sort to count comparisons and swaps.",
        starterCode: "def selection_sort_counted(items):\n    \"\"\"Return (sorted_items, comparisons, swaps).\"\"\"\n    pass\n\nnums = [5, 3, 8, 1, 2]\nsorted_nums, comps, swaps = selection_sort_counted(nums)\nprint(f\"Sorted: {sorted_nums}\")\nprint(f\"Comparisons: {comps}, Swaps: {swaps}\")",
        solution: "def selection_sort_counted(items):\n    arr = items.copy()\n    n = len(arr)\n    comparisons = 0\n    swaps = 0\n    \n    for i in range(n):\n        min_idx = i\n        for j in range(i + 1, n):\n            comparisons += 1\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        if min_idx != i:\n            arr[i], arr[min_idx] = arr[min_idx], arr[i]\n            swaps += 1\n    \n    return arr, comparisons, swaps\n\nnums = [5, 3, 8, 1, 2]\nsorted_nums, comps, swaps = selection_sort_counted(nums)\nprint(f\"Sorted: {sorted_nums}\")\nprint(f\"Comparisons: {comps}, Swaps: {swaps}\")\nprint(f\"Expected comparisons: {5*4//2} = n(n-1)/2\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "10 comparisons", description: "Counts correct" }]),
        hints: ["Count each comparison in inner loop", "Count swaps only when needed"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson10_2_2.id,
        number: 3,
        title: "Selection Sort Descending",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Modify selection sort to sort in descending order.",
        starterCode: "def selection_sort_desc(items):\n    \"\"\"Sort items in descending order.\"\"\"\n    pass\n\nnums = [3, 1, 4, 1, 5, 9, 2, 6]\nselection_sort_desc(nums)\nprint(nums)  # [9, 6, 5, 4, 3, 2, 1, 1]",
        solution: "def selection_sort_desc(items):\n    n = len(items)\n    for i in range(n):\n        max_idx = i  # Find maximum instead\n        for j in range(i + 1, n):\n            if items[j] > items[max_idx]:  # > instead of <\n                max_idx = j\n        items[i], items[max_idx] = items[max_idx], items[i]\n\nnums = [3, 1, 4, 1, 5, 9, 2, 6]\nselection_sort_desc(nums)\nprint(nums)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[9, 6, 5, 4, 3, 2, 1, 1]", description: "Descending order" }]),
        hints: ["Find maximum instead of minimum", "Change < to >"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson10_2_2.id,
        number: 4,
        title: "Verify O(n²)",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Time selection sort on different sizes and verify quadratic growth.",
        starterCode: "import time\nimport random\n\ndef selection_sort(items):\n    arr = items.copy()\n    n = len(arr)\n    for i in range(n):\n        min_idx = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\n# Time for sizes 500, 1000, 2000, 4000\n# Show that doubling n quadruples time",
        solution: "import time\nimport random\n\ndef selection_sort(items):\n    arr = items.copy()\n    n = len(arr)\n    for i in range(n):\n        min_idx = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\nprint(f\"{'Size':>6} {'Time (s)':>12} {'Ratio':>10}\")\nprint(\"-\" * 32)\n\nprev_time = None\nfor size in [500, 1000, 2000, 4000]:\n    items = [random.randint(0, 10000) for _ in range(size)]\n    \n    start = time.time()\n    selection_sort(items)\n    elapsed = time.time() - start\n    \n    ratio = elapsed / prev_time if prev_time else 1.0\n    print(f\"{size:>6} {elapsed:>12.4f} {ratio:>10.2f}x\")\n    prev_time = elapsed\n\nprint(\"\\nRatio ~4x when size doubles → O(n²) confirmed\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Ratio ~4x", description: "O(n²) verified" }]),
        hints: ["Time increases ~4x when n doubles", "2² = 4"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson10_2_2.id,
        number: 5,
        title: "Find k Smallest",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Use partial selection sort to find k smallest elements efficiently.",
        starterCode: "def k_smallest(items, k):\n    \"\"\"Return k smallest elements using partial selection sort.\n    Only do k passes instead of n passes.\n    \"\"\"\n    pass\n\nnums = [64, 25, 12, 22, 11, 90, 5, 33]\nprint(k_smallest(nums, 3))  # [5, 11, 12]",
        solution: "def k_smallest(items, k):\n    arr = items.copy()\n    n = len(arr)\n    \n    # Only need k passes to find k smallest\n    for i in range(min(k, n)):\n        min_idx = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    \n    return arr[:k]\n\nnums = [64, 25, 12, 22, 11, 90, 5, 33]\nprint(f\"Original: {nums}\")\nprint(f\"3 smallest: {k_smallest(nums, 3)}\")\nprint(f\"5 smallest: {k_smallest(nums, 5)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[5, 11, 12]", description: "k smallest found" }]),
        hints: ["Only do k iterations of outer loop", "Return first k elements"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 10.2.2`);

  // ==================== LESSON 10.2.3 ====================
  const lesson10_2_3 = await prisma.lesson.upsert({
    where: { slug: "merge-sort" },
    update: {},
    create: {
      sectionId: section10_2.id,
      number: 10.23,
      title: "Merge Sort",
      slug: "merge-sort",
      objectives: [
        "Understand divide and conquer sorting",
        "Implement merge sort in Python",
        "Analyze its O(n log n) complexity",
        "Know why merge sort is efficient",
      ],
      content: `# Merge Sort

## Divide and Conquer

Merge sort uses the **divide and conquer** strategy:

1. **Divide**: Split list into two halves
2. **Conquer**: Recursively sort each half
3. **Combine**: Merge the sorted halves

## Visual Example

\`\`\`
[38, 27, 43, 3, 9, 82, 10]
        Split
[38, 27, 43, 3]    [9, 82, 10]
    Split              Split
[38, 27] [43, 3]   [9, 82] [10]
  Split    Split     Split
[38][27] [43][3]  [9][82] [10]
  Merge    Merge    Merge
[27, 38] [3, 43]  [9, 82] [10]
    Merge            Merge
[3, 27, 38, 43]   [9, 10, 82]
        Merge
[3, 9, 10, 27, 38, 43, 82]
\`\`\`

## The Merge Operation

Merging two sorted lists into one sorted list:

\`\`\`python
def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
\`\`\`

## Complexity Analysis

- **Time**: O(n log n) - always!
  - log n levels of recursion
  - n work at each level (merging)
- **Space**: O(n) - needs temporary arrays
- **Stable**: Yes - equal elements stay in order

## Characteristics

✅ **Advantages**:
- Guaranteed O(n log n) - no bad cases
- Stable sort
- Good for linked lists
- Parallelizable

❌ **Disadvantages**:
- O(n) extra space
- Not in-place
- Overhead for small lists`,
      codeExamples: JSON.stringify([
        {
          id: "basic-merge-sort",
          title: "Basic Merge Sort",
          code: "def merge_sort(items):\n    \"\"\"Sort using merge sort algorithm.\"\"\"\n    # Base case: already sorted\n    if len(items) <= 1:\n        return items\n    \n    # Divide\n    mid = len(items) // 2\n    left = merge_sort(items[:mid])\n    right = merge_sort(items[mid:])\n    \n    # Conquer (merge)\n    return merge(left, right)\n\ndef merge(left, right):\n    \"\"\"Merge two sorted lists into one sorted list.\"\"\"\n    result = []\n    i = j = 0\n    \n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    \n    # Add remaining elements\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\n# Test\nnumbers = [38, 27, 43, 3, 9, 82, 10]\nprint(f\"Before: {numbers}\")\nsorted_nums = merge_sort(numbers)\nprint(f\"After: {sorted_nums}\")",
          description: "Standard merge sort implementation",
        },
        {
          id: "merge-visualized",
          title: "Merge Sort Visualized",
          code: "def merge_sort_visual(items, depth=0):\n    \"\"\"Merge sort with visualization.\"\"\"\n    indent = \"  \" * depth\n    print(f\"{indent}merge_sort({items})\")\n    \n    if len(items) <= 1:\n        print(f\"{indent}  → base case: {items}\")\n        return items\n    \n    mid = len(items) // 2\n    print(f\"{indent}  split into {items[:mid]} and {items[mid:]}\")\n    \n    left = merge_sort_visual(items[:mid], depth + 1)\n    right = merge_sort_visual(items[mid:], depth + 1)\n    \n    result = merge(left, right)\n    print(f\"{indent}  merge {left} + {right} = {result}\")\n    return result\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\nprint(\"Merge Sort Visualization:\")\nprint(\"=\" * 50)\nmerge_sort_visual([38, 27, 43, 3])",
          description: "See the recursion and merging",
        },
        {
          id: "merge-complexity",
          title: "Verifying O(n log n)",
          code: "import time\nimport random\n\ndef merge_sort(items):\n    if len(items) <= 1:\n        return items\n    mid = len(items) // 2\n    left = merge_sort(items[:mid])\n    right = merge_sort(items[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\nprint(f\"{'Size':>8} {'Time':>12} {'Ratio':>10} {'Expected':>10}\")\nprint(\"-\" * 45)\n\nprev_time = None\nfor size in [1000, 2000, 4000, 8000, 16000]:\n    items = [random.randint(0, 100000) for _ in range(size)]\n    \n    start = time.time()\n    merge_sort(items)\n    elapsed = time.time() - start\n    \n    if prev_time:\n        ratio = elapsed / prev_time\n        # For O(n log n), when n doubles: 2n·log(2n) / n·log(n) ≈ 2·(1 + 1/log(n))\n        expected = 2.0 * (1 + 1/(size//2).bit_length())\n        print(f\"{size:>8} {elapsed:>12.4f}s {ratio:>10.2f}x {expected:>10.2f}x\")\n    else:\n        print(f\"{size:>8} {elapsed:>12.4f}s\")\n    prev_time = elapsed\n\nprint(\"\\nRatio ~2x (slightly more) when doubling → O(n log n)\")",
          description: "O(n log n) growth demonstrated",
        },
        {
          id: "compare-to-selection",
          title: "Merge Sort vs Selection Sort",
          code: "import time\nimport random\n\ndef selection_sort(items):\n    arr = items.copy()\n    n = len(arr)\n    for i in range(n):\n        min_idx = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\ndef merge_sort(items):\n    if len(items) <= 1:\n        return items\n    mid = len(items) // 2\n    return merge(merge_sort(items[:mid]), merge_sort(items[mid:]))\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\nprint(f\"{'Size':>6} {'Selection O(n²)':>18} {'Merge O(n log n)':>18} {'Speedup':>10}\")\nprint(\"-\" * 55)\n\nfor size in [500, 1000, 2000, 4000]:\n    items = [random.randint(0, 10000) for _ in range(size)]\n    \n    start = time.time()\n    selection_sort(items)\n    t_sel = time.time() - start\n    \n    start = time.time()\n    merge_sort(items)\n    t_merge = time.time() - start\n    \n    speedup = t_sel / t_merge\n    print(f\"{size:>6} {t_sel:>18.4f}s {t_merge:>18.4f}s {speedup:>10.1f}x\")",
          description: "Dramatic difference for large data",
        },
      ]),
      keyPoints: [
        "Divide and conquer: split, sort halves, merge",
        "Time: O(n log n) always - guaranteed",
        "Space: O(n) - needs extra arrays",
        "Stable: preserves order of equals",
        "log n levels × n work per level",
        "Much faster than O(n²) for large n",
        "Merge operation is O(n)",
        "Base case: single element is sorted",
      ],
      hardwareDemo: "Watch recursive splitting and merging. Compare timing to selection sort.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson10_2_3.number}: ${lesson10_2_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_2_3.id,
        number: 1,
        title: "Implement Merge",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write the merge function that combines two sorted lists.",
        starterCode: "def merge(left, right):\n    \"\"\"Merge two sorted lists into one sorted list.\"\"\"\n    pass\n\nprint(merge([1, 3, 5], [2, 4, 6]))  # [1, 2, 3, 4, 5, 6]\nprint(merge([1, 5, 9], [2, 3]))     # [1, 2, 3, 5, 9]",
        solution: "def merge(left, right):\n    result = []\n    i = j = 0\n    \n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    \n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\nprint(merge([1, 3, 5], [2, 4, 6]))\nprint(merge([1, 5, 9], [2, 3]))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[1, 2, 3, 4, 5, 6]", description: "Merge works" }]),
        hints: ["Two pointers, one for each list", "Compare and append smaller", "Extend with remaining"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson10_2_3.id,
        number: 2,
        title: "Implement Merge Sort",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write the complete merge sort function using recursion.",
        starterCode: "def merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\ndef merge_sort(items):\n    \"\"\"Sort using merge sort.\"\"\"\n    pass\n\nprint(merge_sort([64, 34, 25, 12, 22, 11, 90]))",
        solution: "def merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\ndef merge_sort(items):\n    if len(items) <= 1:\n        return items\n    \n    mid = len(items) // 2\n    left = merge_sort(items[:mid])\n    right = merge_sort(items[mid:])\n    return merge(left, right)\n\nprint(merge_sort([64, 34, 25, 12, 22, 11, 90]))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[11, 12, 22, 25, 34, 64, 90]", description: "Merge sort works" }]),
        hints: ["Base case: len <= 1", "Split at middle", "Recursively sort halves, then merge"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson10_2_3.id,
        number: 3,
        title: "Count Merge Operations",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Modify merge sort to count total comparisons.",
        starterCode: "def merge_sort_counted(items):\n    \"\"\"Return (sorted_list, comparison_count).\"\"\"\n    pass\n\nresult, comps = merge_sort_counted([5, 2, 8, 1, 9, 3, 7, 4, 6])\nprint(f\"Sorted: {result}\")\nprint(f\"Comparisons: {comps}\")",
        solution: "def merge_sort_counted(items):\n    if len(items) <= 1:\n        return items, 0\n    \n    mid = len(items) // 2\n    left, left_comps = merge_sort_counted(items[:mid])\n    right, right_comps = merge_sort_counted(items[mid:])\n    \n    merged, merge_comps = merge_counted(left, right)\n    total_comps = left_comps + right_comps + merge_comps\n    \n    return merged, total_comps\n\ndef merge_counted(left, right):\n    result = []\n    i = j = 0\n    comparisons = 0\n    \n    while i < len(left) and j < len(right):\n        comparisons += 1\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    \n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result, comparisons\n\nresult, comps = merge_sort_counted([5, 2, 8, 1, 9, 3, 7, 4, 6])\nprint(f\"Sorted: {result}\")\nprint(f\"Comparisons: {comps}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Sorted with comparison count", description: "Counting works" }]),
        hints: ["Return tuple from each function", "Sum comparisons from left, right, and merge"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson10_2_3.id,
        number: 4,
        title: "Time Comparison",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Compare merge sort timing to selection sort for various sizes.",
        starterCode: "import time\nimport random\n\n# Implement both sorts and compare timing\n# for sizes 500, 1000, 2000, 4000",
        solution: "import time\nimport random\n\ndef selection_sort(items):\n    arr = items.copy()\n    n = len(arr)\n    for i in range(n):\n        min_idx = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\ndef merge_sort(items):\n    if len(items) <= 1:\n        return items\n    mid = len(items) // 2\n    return merge(merge_sort(items[:mid]), merge_sort(items[mid:]))\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\nprint(f\"{'Size':>6} {'Selection':>12} {'Merge':>12} {'Speedup':>10}\")\nprint(\"-\" * 45)\n\nfor size in [500, 1000, 2000, 4000]:\n    items = [random.randint(0, 10000) for _ in range(size)]\n    \n    start = time.time()\n    selection_sort(items)\n    t_sel = time.time() - start\n    \n    start = time.time()\n    merge_sort(items)\n    t_merge = time.time() - start\n    \n    speedup = t_sel / t_merge\n    print(f\"{size:>6} {t_sel:>12.4f}s {t_merge:>12.4f}s {speedup:>10.1f}x\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Merge sort much faster", description: "Performance compared" }]),
        hints: ["Time both algorithms", "Calculate speedup ratio"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson10_2_3.id,
        number: 5,
        title: "Bottom-Up Merge Sort",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement iterative (bottom-up) merge sort without recursion.",
        starterCode: "def merge(items, left, mid, right):\n    \"\"\"Merge items[left:mid+1] and items[mid+1:right+1].\"\"\"\n    pass\n\ndef merge_sort_iterative(items):\n    \"\"\"Non-recursive merge sort.\"\"\"\n    pass\n\nnums = [64, 34, 25, 12, 22, 11, 90]\nresult = merge_sort_iterative(nums)\nprint(result)",
        solution: "def merge_sort_iterative(items):\n    arr = items.copy()\n    n = len(arr)\n    \n    # Start with size 1, double each iteration\n    size = 1\n    while size < n:\n        # Merge adjacent subarrays of current size\n        for start in range(0, n, 2 * size):\n            mid = min(start + size, n)\n            end = min(start + 2 * size, n)\n            \n            # Merge arr[start:mid] and arr[mid:end]\n            merged = []\n            i, j = start, mid\n            while i < mid and j < end:\n                if arr[i] <= arr[j]:\n                    merged.append(arr[i])\n                    i += 1\n                else:\n                    merged.append(arr[j])\n                    j += 1\n            merged.extend(arr[i:mid])\n            merged.extend(arr[j:end])\n            \n            # Copy back\n            arr[start:end] = merged\n        \n        size *= 2\n    \n    return arr\n\nnums = [64, 34, 25, 12, 22, 11, 90]\nresult = merge_sort_iterative(nums)\nprint(result)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[11, 12, 22, 25, 34, 64, 90]", description: "Iterative merge sort works" }]),
        hints: ["Start with pairs, then groups of 4, 8, etc.", "Double the size each pass"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 10.2.3`);

  // ==================== LESSON 10.2.4 ====================
  const lesson10_2_4 = await prisma.lesson.upsert({
    where: { slug: "comparing-sorting" },
    update: {},
    create: {
      sectionId: section10_2.id,
      number: 10.24,
      title: "Comparing Sorting Algorithms",
      slug: "comparing-sorting",
      objectives: [
        "Compare different sorting algorithms",
        "Know when to use each algorithm",
        "Understand Python's Timsort",
        "Make informed sorting decisions",
      ],
      content: `# Comparing Sorting Algorithms

## Algorithm Comparison

| Algorithm | Time (Avg) | Time (Worst) | Space | Stable |
|-----------|------------|--------------|-------|--------|
| Selection | O(n²) | O(n²) | O(1) | No |
| Insertion | O(n²) | O(n²) | O(1) | Yes |
| Merge | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n²) | O(log n) | No |
| Timsort | O(n log n) | O(n log n) | O(n) | Yes |

## Python's Built-in: Timsort

Python uses **Timsort**, a hybrid algorithm:

- Combines merge sort and insertion sort
- O(n log n) worst case
- O(n) for nearly-sorted data
- Stable
- Used by sorted() and list.sort()

\`\`\`python
# Just use the built-in!
sorted_list = sorted(items)
items.sort()
\`\`\`

## When to Use What

**Small lists (n < 50)**:
→ Use anything, even O(n²) is fine
→ Insertion sort often fastest due to low overhead

**Large lists**:
→ Use O(n log n) algorithms
→ Python's built-in is usually best

**Nearly sorted data**:
→ Insertion sort: O(n)
→ Timsort: O(n)

**Need stability**:
→ Merge sort or Timsort
→ NOT selection sort or quicksort

**Memory constrained**:
→ In-place algorithms: selection, insertion, quicksort
→ NOT merge sort

## Practical Advice

1. **Use Python's built-in** - highly optimized
2. **Know the basics** - for interviews and understanding
3. **Profile if needed** - measure, don't guess`,
      codeExamples: JSON.stringify([
        {
          id: "all-sorts-comparison",
          title: "All Sorting Algorithms Compared",
          code: "import time\nimport random\n\ndef selection_sort(items):\n    arr = items.copy()\n    for i in range(len(arr)):\n        min_idx = i\n        for j in range(i + 1, len(arr)):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\ndef insertion_sort(items):\n    arr = items.copy()\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr\n\ndef merge_sort(items):\n    if len(items) <= 1:\n        return items\n    mid = len(items) // 2\n    left = merge_sort(items[:mid])\n    right = merge_sort(items[mid:])\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\nsize = 2000\nitems = [random.randint(0, 10000) for _ in range(size)]\n\nprint(f\"Sorting {size} random items:\")\nprint(f\"{'Algorithm':<15} {'Time':>12}\")\nprint(\"-\" * 30)\n\nfor name, func in [(\"Selection\", selection_sort), \n                    (\"Insertion\", insertion_sort),\n                    (\"Merge\", merge_sort),\n                    (\"Python sorted()\", sorted)]:\n    start = time.time()\n    func(items)\n    elapsed = time.time() - start\n    print(f\"{name:<15} {elapsed:>12.4f}s\")",
          description: "Compare all algorithms",
        },
        {
          id: "nearly-sorted",
          title: "Performance on Nearly Sorted Data",
          code: "import time\nimport random\n\ndef insertion_sort(items):\n    arr = items.copy()\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr\n\ndef selection_sort(items):\n    arr = items.copy()\n    for i in range(len(arr)):\n        min_idx = i\n        for j in range(i + 1, len(arr)):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\nsize = 2000\n\n# Random data\nrandom_data = [random.randint(0, 10000) for _ in range(size)]\n\n# Nearly sorted: only 5% elements swapped\nnearly_sorted = list(range(size))\nfor _ in range(size // 20):\n    i, j = random.randint(0, size-1), random.randint(0, size-1)\n    nearly_sorted[i], nearly_sorted[j] = nearly_sorted[j], nearly_sorted[i]\n\nprint(f\"{'Data Type':<15} {'Insertion':>12} {'Selection':>12}\")\nprint(\"-\" * 42)\n\nfor name, data in [(\"Random\", random_data), (\"Nearly Sorted\", nearly_sorted)]:\n    start = time.time()\n    insertion_sort(data)\n    t_ins = time.time() - start\n    \n    start = time.time()\n    selection_sort(data)\n    t_sel = time.time() - start\n    \n    print(f\"{name:<15} {t_ins:>12.4f}s {t_sel:>12.4f}s\")\n\nprint(\"\\nInsertion sort excels on nearly-sorted data!\")",
          description: "Some algorithms adapt to input",
        },
        {
          id: "python-builtin",
          title: "Python's Built-in is Fast",
          code: "import time\nimport random\n\ndef merge_sort(items):\n    if len(items) <= 1:\n        return items\n    mid = len(items) // 2\n    left = merge_sort(items[:mid])\n    right = merge_sort(items[mid:])\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\nprint(\"Python's sorted() vs Our merge_sort():\")\nprint(f\"{'Size':>10} {'Our Merge':>15} {'Python sorted()':>18} {'Ratio':>10}\")\nprint(\"-\" * 58)\n\nfor size in [1000, 5000, 10000, 50000]:\n    items = [random.randint(0, 100000) for _ in range(size)]\n    \n    start = time.time()\n    merge_sort(items)\n    t_merge = time.time() - start\n    \n    start = time.time()\n    sorted(items)\n    t_builtin = time.time() - start\n    \n    ratio = t_merge / t_builtin\n    print(f\"{size:>10} {t_merge:>15.4f}s {t_builtin:>18.6f}s {ratio:>10.1f}x\")\n\nprint(\"\\nPython's Timsort is highly optimized C code!\")",
          description: "Always prefer built-in for real work",
        },
        {
          id: "choosing-algorithm",
          title: "Choosing the Right Algorithm",
          code: "def recommend_sort(n, nearly_sorted, need_stable, memory_constrained):\n    \"\"\"Recommend sorting approach based on constraints.\"\"\"\n    print(f\"\\nScenario: n={n}, nearly_sorted={nearly_sorted}, \"\n          f\"stable={need_stable}, memory_constrained={memory_constrained}\")\n    \n    # Small lists\n    if n < 50:\n        print(\"  → Any algorithm works, but Python's sorted() is simplest\")\n        return\n    \n    # Memory constrained\n    if memory_constrained:\n        if nearly_sorted:\n            print(\"  → Insertion sort: O(1) space, O(n) for nearly sorted\")\n        else:\n            print(\"  → Quicksort (in-place): O(log n) space, O(n log n) avg\")\n        return\n    \n    # Need stability\n    if need_stable:\n        print(\"  → Python's sorted() (Timsort): stable, O(n log n)\")\n        return\n    \n    # Nearly sorted\n    if nearly_sorted:\n        print(\"  → Python's sorted() (Timsort): O(n) for nearly sorted!\")\n        return\n    \n    # General case\n    print(\"  → Python's sorted(): highly optimized, always O(n log n)\")\n\n# Test different scenarios\nrecommend_sort(n=20, nearly_sorted=False, need_stable=False, memory_constrained=False)\nrecommend_sort(n=10000, nearly_sorted=True, need_stable=False, memory_constrained=False)\nrecommend_sort(n=10000, nearly_sorted=False, need_stable=True, memory_constrained=False)\nrecommend_sort(n=10000, nearly_sorted=False, need_stable=False, memory_constrained=True)",
          description: "Making the right choice",
        },
      ]),
      keyPoints: [
        "O(n²) sorts: simple, good for small n",
        "O(n log n) sorts: efficient for large n",
        "Python's Timsort is hybrid and excellent",
        "Insertion sort shines on nearly-sorted data",
        "Stability matters for complex sorts",
        "Use Python's sorted() for real work",
        "Learn algorithms for understanding/interviews",
        "Profile before optimizing",
      ],
      hardwareDemo: "Race all algorithms. Show how Timsort adapts to different input patterns.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 4,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson10_2_4.number}: ${lesson10_2_4.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_2_4.id,
        number: 1,
        title: "Choose the Algorithm",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "You have 100,000 random numbers. Which should you use?",
        starterCode: "",
        solution: "Python's sorted() - optimized O(n log n) Timsort",
        testCases: JSON.stringify([
          { input: "sorted()", expectedOutput: "true", description: "Correct!" },
          { input: "Selection sort", expectedOutput: "false", description: "O(n²) too slow for 100k items" },
          { input: "Insertion sort", expectedOutput: "false", description: "O(n²) too slow for random data" },
        ]),
        hints: ["100,000 is large", "O(n²) would be very slow", "Python's built-in is optimized"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson10_2_4.id,
        number: 2,
        title: "Nearly Sorted Advantage",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Demonstrate that insertion sort beats selection sort on nearly-sorted data.",
        starterCode: "import time\n\ndef insertion_sort(items):\n    arr = items.copy()\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr\n\ndef selection_sort(items):\n    arr = items.copy()\n    for i in range(len(arr)):\n        min_idx = i\n        for j in range(i + 1, len(arr)):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\n# Create nearly sorted list (sorted with few swaps)\n# Compare both algorithms",
        solution: "import time\nimport random\n\ndef insertion_sort(items):\n    arr = items.copy()\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr\n\ndef selection_sort(items):\n    arr = items.copy()\n    for i in range(len(arr)):\n        min_idx = i\n        for j in range(i + 1, len(arr)):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\n# Nearly sorted: sorted list with 2% swapped\nnearly_sorted = list(range(2000))\nfor _ in range(40):  # 2% of 2000\n    i, j = random.randint(0, 1999), random.randint(0, 1999)\n    nearly_sorted[i], nearly_sorted[j] = nearly_sorted[j], nearly_sorted[i]\n\nstart = time.time()\ninsertion_sort(nearly_sorted)\nt_ins = time.time() - start\n\nstart = time.time()\nselection_sort(nearly_sorted)\nt_sel = time.time() - start\n\nprint(f\"Nearly sorted data (2000 items, 2% swapped):\")\nprint(f\"Insertion sort: {t_ins:.4f}s\")\nprint(f\"Selection sort: {t_sel:.4f}s\")\nprint(f\"Insertion is {t_sel/t_ins:.1f}x faster!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Insertion faster", description: "Advantage shown" }]),
        hints: ["Create sorted list with few swaps", "Time both algorithms"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson10_2_4.id,
        number: 3,
        title: "Stability Test",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show that selection sort is NOT stable but Python's sorted is.",
        starterCode: "# Create list of (value, original_index) pairs with duplicates\n# Sort by value and check if original order of equals is preserved",
        solution: "# Stability test with (value, original_index) pairs\nitems = [(3, 'first'), (1, 'a'), (3, 'second'), (1, 'b'), (3, 'third')]\n\nprint(\"Original:\")\nfor item in items:\n    print(f\"  {item}\")\n\n# Python's sorted (stable)\npy_sorted = sorted(items, key=lambda x: x[0])\nprint(\"\\nPython sorted (STABLE):\")\nfor item in py_sorted:\n    print(f\"  {item}\")\n\n# Selection sort (NOT stable)\ndef selection_sort(items, key=lambda x: x):\n    arr = items.copy()\n    for i in range(len(arr)):\n        min_idx = i\n        for j in range(i + 1, len(arr)):\n            if key(arr[j]) < key(arr[min_idx]):\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\nsel_sorted = selection_sort(items, key=lambda x: x[0])\nprint(\"\\nSelection sort (NOT stable):\")\nfor item in sel_sorted:\n    print(f\"  {item}\")\n\nprint(\"\\nNote: Python keeps 'first', 'second', 'third' in original order\")\nprint(\"Selection sort may reorder them\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Stability difference shown", description: "Stable vs unstable" }]),
        hints: ["Use tuple with original position", "Sort by first element only"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson10_2_4.id,
        number: 4,
        title: "Complete Comparison",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a comprehensive comparison of all sorting algorithms on different data.",
        starterCode: "import time\nimport random\n\n# Implement selection, insertion, merge sorts\n# Compare on: random data, sorted data, reverse sorted data\n# For size 1000",
        solution: "import time\nimport random\n\ndef selection_sort(items):\n    arr = items.copy()\n    for i in range(len(arr)):\n        min_idx = i\n        for j in range(i + 1, len(arr)):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\ndef insertion_sort(items):\n    arr = items.copy()\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr\n\ndef merge_sort(items):\n    if len(items) <= 1:\n        return items\n    mid = len(items) // 2\n    left, right = merge_sort(items[:mid]), merge_sort(items[mid:])\n    result, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    return result + left[i:] + right[j:]\n\nsize = 1000\nrandom_data = [random.randint(0, 10000) for _ in range(size)]\nsorted_data = list(range(size))\nreverse_data = list(range(size, 0, -1))\n\nalgorithms = [('Selection', selection_sort), ('Insertion', insertion_sort),\n              ('Merge', merge_sort), ('Python', sorted)]\n\nprint(f\"{'Algorithm':<12} {'Random':>10} {'Sorted':>10} {'Reverse':>10}\")\nprint(\"-\" * 45)\n\nfor name, func in algorithms:\n    times = []\n    for data in [random_data, sorted_data, reverse_data]:\n        start = time.time()\n        func(data)\n        times.append(time.time() - start)\n    print(f\"{name:<12} {times[0]:>10.4f} {times[1]:>10.4f} {times[2]:>10.4f}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Full comparison table", description: "All compared" }]),
        hints: ["Test random, sorted, reverse", "Time each combination"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson10_2_4.id,
        number: 5,
        title: "Algorithm Recommender",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write a function that recommends the best sorting approach for given constraints.",
        starterCode: "def recommend_sort(n, data_type, need_stable, memory_limit):\n    \"\"\"\n    n: number of items\n    data_type: 'random', 'nearly_sorted', 'reverse'\n    need_stable: True/False\n    memory_limit: 'low' (O(1)), 'medium' (O(log n)), 'high' (O(n))\n    \n    Return recommendation and reason.\n    \"\"\"\n    pass\n\nprint(recommend_sort(50, 'random', False, 'high'))\nprint(recommend_sort(100000, 'nearly_sorted', True, 'high'))\nprint(recommend_sort(10000, 'random', False, 'low'))",
        solution: "def recommend_sort(n, data_type, need_stable, memory_limit):\n    # Small lists\n    if n < 100:\n        return \"Any algorithm works. Use Python's sorted() for simplicity.\"\n    \n    # Nearly sorted data\n    if data_type == 'nearly_sorted':\n        if memory_limit == 'low':\n            return \"Insertion sort: O(n) for nearly sorted, O(1) space\"\n        return \"Python's sorted() (Timsort): O(n) for nearly sorted\"\n    \n    # Need stability\n    if need_stable:\n        if memory_limit == 'low':\n            return \"Insertion sort: stable, O(1) space, but O(n²)\"\n        return \"Python's sorted() (Timsort): stable, O(n log n)\"\n    \n    # Memory constrained\n    if memory_limit == 'low':\n        return \"Quicksort (in-place): O(log n) space, O(n log n) avg\"\n    \n    # Default: use built-in\n    return \"Python's sorted(): highly optimized O(n log n) Timsort\"\n\nprint(recommend_sort(50, 'random', False, 'high'))\nprint(recommend_sort(100000, 'nearly_sorted', True, 'high'))\nprint(recommend_sort(10000, 'random', False, 'low'))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Smart recommendations", description: "Good advice" }]),
        hints: ["Consider each constraint", "Timsort handles most cases well"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 10.2.4`);

  console.log("\n✅ Chapter 10 Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
