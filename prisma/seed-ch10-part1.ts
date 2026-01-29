import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 10 Part 1: Structure + Lessons 10.1.1-10.1.3...\n");

  // Create Chapter 10
  let chapter10 = await prisma.chapter.findFirst({ where: { number: 10 } });
  if (!chapter10) {
    chapter10 = await prisma.chapter.create({
      data: {
        number: 10,
        title: "Some Simple Algorithms and Data Structures",
        description: "Master classic algorithms and data structures - search, sort, and hash tables. These building blocks appear everywhere in software and interviews.",
        objectives: [
          "Implement linear and binary search",
          "Understand sorting algorithms and their tradeoffs",
          "Use hash tables for O(1) lookups",
          "Choose the right data structure for each problem",
        ],
        isPublished: true,
      },
    });
  }
  console.log(`✅ Chapter ${chapter10.number}: ${chapter10.title}`);

  // Create Sections
  const section10_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter10.id, number: 10.1 } },
    update: {},
    create: { chapterId: chapter10.id, number: 10.1, title: "Search Algorithms", description: "Finding elements efficiently.", order: 1 },
  });
  console.log(`  📂 Section ${section10_1.number}: ${section10_1.title}`);

  const section10_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter10.id, number: 10.2 } },
    update: {},
    create: { chapterId: chapter10.id, number: 10.2, title: "Sorting Algorithms", description: "Organizing data efficiently.", order: 2 },
  });
  console.log(`  📂 Section ${section10_2.number}: ${section10_2.title}`);

  const section10_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter10.id, number: 10.3 } },
    update: {},
    create: { chapterId: chapter10.id, number: 10.3, title: "Hash-Based Structures", description: "Fast lookups with hashing.", order: 3 },
  });
  console.log(`  📂 Section ${section10_3.number}: ${section10_3.title}`);

  const section10_4 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter10.id, number: 10.4 } },
    update: {},
    create: { chapterId: chapter10.id, number: 10.4, title: "Choosing Data Structures", description: "Making informed choices.", order: 4 },
  });
  console.log(`  📂 Section ${section10_4.number}: ${section10_4.title}`);

  // ==================== LESSON 10.1.1 ====================
  const lesson10_1_1 = await prisma.lesson.upsert({
    where: { slug: "linear-search" },
    update: {},
    create: {
      sectionId: section10_1.id,
      number: 10.11,
      title: "Linear Search Algorithm",
      slug: "linear-search",
      objectives: [
        "Understand linear search algorithm",
        "Implement linear search in Python",
        "Analyze its O(n) complexity",
        "Know when linear search is appropriate",
      ],
      content: `# Linear Search Algorithm

## The Simplest Search

Linear search checks **each element one by one** until it finds the target or reaches the end.

\`\`\`python
def linear_search(items, target):
    for i, item in enumerate(items):
        if item == target:
            return i  # Found at index i
    return -1  # Not found
\`\`\`

## How It Works

\`\`\`
Looking for 7 in [3, 1, 4, 1, 5, 9, 2, 6, 7, 3]

Step 1: Check index 0 → 3 ≠ 7, continue
Step 2: Check index 1 → 1 ≠ 7, continue
Step 3: Check index 2 → 4 ≠ 7, continue
...
Step 9: Check index 8 → 7 = 7, FOUND! Return 8
\`\`\`

## Complexity Analysis

- **Best case**: O(1) - target is first element
- **Worst case**: O(n) - target is last or not present
- **Average case**: O(n/2) = O(n)

## When to Use Linear Search

✅ **Good for**:
- Small lists (< 100 items)
- Unsorted data
- One-time searches
- Finding ALL occurrences

❌ **Bad for**:
- Large sorted lists (use binary search)
- Repeated searches on same data
- Performance-critical applications

## Variations

\`\`\`python
# Find all occurrences
def find_all(items, target):
    return [i for i, item in enumerate(items) if item == target]

# Find with condition
def find_if(items, condition):
    for i, item in enumerate(items):
        if condition(item):
            return i
    return -1
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-linear",
          title: "Basic Linear Search",
          code: "def linear_search(items, target):\n    \"\"\"Find target in items, return index or -1.\"\"\"\n    for i in range(len(items)):\n        if items[i] == target:\n            return i\n    return -1\n\n# Test it\nnumbers = [64, 34, 25, 12, 22, 11, 90]\n\nprint(f\"List: {numbers}\")\nprint(f\"Search for 22: index {linear_search(numbers, 22)}\")\nprint(f\"Search for 11: index {linear_search(numbers, 11)}\")\nprint(f\"Search for 100: index {linear_search(numbers, 100)}\")",
          description: "Simple linear search implementation",
        },
        {
          id: "linear-with-count",
          title: "Linear Search with Step Counter",
          code: "def linear_search_counted(items, target):\n    \"\"\"Return (index, steps) to show work done.\"\"\"\n    steps = 0\n    for i in range(len(items)):\n        steps += 1\n        if items[i] == target:\n            return i, steps\n    return -1, steps\n\n# Demonstrate O(n) complexity\nimport random\n\nfor size in [10, 100, 1000]:\n    items = list(range(size))\n    \n    # Best case: first element\n    idx, steps = linear_search_counted(items, 0)\n    print(f\"n={size:4}, Best case (first): {steps} steps\")\n    \n    # Worst case: last element\n    idx, steps = linear_search_counted(items, size - 1)\n    print(f\"n={size:4}, Worst case (last): {steps} steps\")\n    \n    # Average: middle\n    idx, steps = linear_search_counted(items, size // 2)\n    print(f\"n={size:4}, Average (middle): {steps} steps\")\n    print()",
          description: "Counting comparisons to see O(n)",
        },
        {
          id: "find-all",
          title: "Finding All Occurrences",
          code: "def find_all_indices(items, target):\n    \"\"\"Find ALL positions where target appears.\"\"\"\n    indices = []\n    for i, item in enumerate(items):\n        if item == target:\n            indices.append(i)\n    return indices\n\n# Alternative using list comprehension\ndef find_all_compact(items, target):\n    return [i for i, item in enumerate(items) if item == target]\n\n# Test with duplicates\nnumbers = [1, 5, 3, 5, 2, 5, 8, 5, 9]\nprint(f\"List: {numbers}\")\nprint(f\"All indices of 5: {find_all_indices(numbers, 5)}\")\nprint(f\"All indices of 2: {find_all_indices(numbers, 2)}\")\nprint(f\"All indices of 7: {find_all_indices(numbers, 7)}\")",
          description: "Find all matches, not just first",
        },
        {
          id: "find-with-condition",
          title: "Finding with Custom Condition",
          code: "def find_if(items, condition):\n    \"\"\"Find first item matching condition.\"\"\"\n    for i, item in enumerate(items):\n        if condition(item):\n            return i, item\n    return -1, None\n\n# Test with various conditions\npeople = [\n    {\"name\": \"Alice\", \"age\": 25},\n    {\"name\": \"Bob\", \"age\": 30},\n    {\"name\": \"Carol\", \"age\": 28},\n    {\"name\": \"Dave\", \"age\": 35},\n]\n\n# Find first person over 30\nidx, person = find_if(people, lambda p: p[\"age\"] > 30)\nprint(f\"First person over 30: {person}\")\n\n# Find first person whose name starts with 'C'\nidx, person = find_if(people, lambda p: p[\"name\"].startswith(\"C\"))\nprint(f\"First name starting with C: {person}\")\n\n# Find first person exactly 40 (not found)\nidx, person = find_if(people, lambda p: p[\"age\"] == 40)\nprint(f\"Person age 40: {person}\")",
          description: "Flexible search with predicates",
        },
      ]),
      keyPoints: [
        "Check each element sequentially",
        "Return index when found, -1 if not",
        "Complexity: O(n) - linear in list size",
        "Works on any list (sorted or not)",
        "Simple to implement and understand",
        "Best for small lists or one-time searches",
        "Can find all occurrences easily",
        "Can search with custom conditions",
      ],
      hardwareDemo: "Watch linear search check each element. Count comparisons. See O(n) growth.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson10_1_1.number}: ${lesson10_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_1_1.id,
        number: 1,
        title: "Implement Linear Search",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Write a linear search function that returns the index or -1.",
        starterCode: "def linear_search(items, target):\n    \"\"\"Return index of target, or -1 if not found.\"\"\"\n    pass\n\n# Test\nprint(linear_search([5, 3, 8, 1, 9], 8))  # Should be 2\nprint(linear_search([5, 3, 8, 1, 9], 7))  # Should be -1",
        solution: "def linear_search(items, target):\n    for i in range(len(items)):\n        if items[i] == target:\n            return i\n    return -1\n\nprint(linear_search([5, 3, 8, 1, 9], 8))\nprint(linear_search([5, 3, 8, 1, 9], 7))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "2\\n-1", description: "Search works" }]),
        hints: ["Loop through indices", "Return i when found", "Return -1 after loop"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson10_1_1.id,
        number: 2,
        title: "Count Comparisons",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Modify linear search to also return the number of comparisons made.",
        starterCode: "def linear_search_counted(items, target):\n    \"\"\"Return (index, comparisons).\"\"\"\n    pass\n\nresult = linear_search_counted([1, 2, 3, 4, 5], 3)\nprint(f\"Found at index {result[0]} after {result[1]} comparisons\")",
        solution: "def linear_search_counted(items, target):\n    comparisons = 0\n    for i in range(len(items)):\n        comparisons += 1\n        if items[i] == target:\n            return i, comparisons\n    return -1, comparisons\n\nresult = linear_search_counted([1, 2, 3, 4, 5], 3)\nprint(f\"Found at index {result[0]} after {result[1]} comparisons\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "index 2 after 3 comparisons", description: "Counting works" }]),
        hints: ["Add a counter variable", "Increment before comparison", "Return tuple"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson10_1_1.id,
        number: 3,
        title: "Find All Occurrences",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function that returns ALL indices where target appears.",
        starterCode: "def find_all(items, target):\n    \"\"\"Return list of all indices where target found.\"\"\"\n    pass\n\nprint(find_all([1, 2, 3, 2, 4, 2], 2))  # [1, 3, 5]\nprint(find_all([1, 2, 3, 4, 5], 9))     # []",
        solution: "def find_all(items, target):\n    indices = []\n    for i in range(len(items)):\n        if items[i] == target:\n            indices.append(i)\n    return indices\n\nprint(find_all([1, 2, 3, 2, 4, 2], 2))\nprint(find_all([1, 2, 3, 4, 5], 9))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[1, 3, 5]\\n[]", description: "All found" }]),
        hints: ["Create empty list for results", "Append each matching index", "Don't stop at first match"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson10_1_1.id,
        number: 4,
        title: "Search with Condition",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write find_first that takes a condition function and returns first matching item.",
        starterCode: "def find_first(items, condition):\n    \"\"\"Return (index, item) for first item where condition(item) is True.\"\"\"\n    pass\n\nnumbers = [1, 4, 7, 10, 13, 16]\nresult = find_first(numbers, lambda x: x > 8)\nprint(f\"First > 8: index={result[0]}, value={result[1]}\")",
        solution: "def find_first(items, condition):\n    for i, item in enumerate(items):\n        if condition(item):\n            return i, item\n    return -1, None\n\nnumbers = [1, 4, 7, 10, 13, 16]\nresult = find_first(numbers, lambda x: x > 8)\nprint(f\"First > 8: index={result[0]}, value={result[1]}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "index=3, value=10", description: "Condition works" }]),
        hints: ["Use enumerate for index and item", "Call condition(item)", "Return tuple"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson10_1_1.id,
        number: 5,
        title: "Measure Complexity",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Demonstrate O(n) complexity by timing searches on increasing list sizes.",
        starterCode: "import time\n\ndef linear_search(items, target):\n    for i, item in enumerate(items):\n        if item == target:\n            return i\n    return -1\n\n# Time searches on lists of size 10000, 50000, 100000\n# Search for element that's NOT in the list (worst case)",
        solution: "import time\n\ndef linear_search(items, target):\n    for i, item in enumerate(items):\n        if item == target:\n            return i\n    return -1\n\nprint(f\"{'Size':>10} {'Time (ms)':>12} {'Ratio':>10}\")\nprint(\"-\" * 35)\n\nprev_time = None\nfor size in [10000, 50000, 100000, 200000]:\n    items = list(range(size))\n    target = -1  # Not in list = worst case\n    \n    start = time.time()\n    for _ in range(10):  # Average over 10 runs\n        linear_search(items, target)\n    elapsed = (time.time() - start) / 10 * 1000  # ms\n    \n    ratio = elapsed / prev_time if prev_time else 1.0\n    print(f\"{size:>10} {elapsed:>12.2f} {ratio:>10.2f}x\")\n    prev_time = elapsed\n\nprint(\"\\nWhen size doubles, time ~doubles → O(n)\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Time grows linearly", description: "O(n) demonstrated" }]),
        hints: ["Time worst case (not found)", "Average multiple runs", "Compare ratios"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 10.1.1`);

  // ==================== LESSON 10.1.2 ====================
  const lesson10_1_2 = await prisma.lesson.upsert({
    where: { slug: "binary-search" },
    update: {},
    create: {
      sectionId: section10_1.id,
      number: 10.12,
      title: "Binary Search Algorithm",
      slug: "binary-search",
      objectives: [
        "Understand divide and conquer approach",
        "Implement binary search in Python",
        "Analyze its O(log n) complexity",
        "Know that it requires sorted data",
      ],
      content: `# Binary Search Algorithm

## Divide and Conquer

Binary search **halves the search space** each step by checking the middle element.

\`\`\`python
def binary_search(items, target):
    left, right = 0, len(items) - 1
    while left <= right:
        mid = (left + right) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\`

## How It Works

\`\`\`
Looking for 7 in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

Step 1: mid=4 → items[4]=5 < 7 → search right half
        [1, 2, 3, 4, 5, |6, 7, 8, 9, 10|]
        
Step 2: mid=7 → items[7]=8 > 7 → search left half
        [|6, 7|, 8, 9, 10]
        
Step 3: mid=5 → items[5]=6 < 7 → search right
        [6, |7|]
        
Step 4: mid=6 → items[6]=7 = 7 → FOUND!
\`\`\`

Only 4 steps for 10 items! Linear would need up to 10.

## Complexity Analysis

- **Best case**: O(1) - target is middle element
- **Worst case**: O(log n) - target at end or not present
- **Average case**: O(log n)

With 1,000,000 items: only ~20 comparisons!

## Critical Requirement

⚠️ **Binary search requires SORTED data!**

If data isn't sorted, binary search gives **wrong results**.

## When to Use Binary Search

✅ **Use when**:
- Data is already sorted
- Searching multiple times (sort once, search many)
- Large datasets

❌ **Don't use when**:
- Data is unsorted and searched only once
- Data changes frequently
- List is very small (overhead not worth it)`,
      codeExamples: JSON.stringify([
        {
          id: "basic-binary",
          title: "Basic Binary Search",
          code: "def binary_search(items, target):\n    \"\"\"Find target in sorted items, return index or -1.\"\"\"\n    left, right = 0, len(items) - 1\n    \n    while left <= right:\n        mid = (left + right) // 2\n        \n        if items[mid] == target:\n            return mid\n        elif items[mid] < target:\n            left = mid + 1  # Search right half\n        else:\n            right = mid - 1  # Search left half\n    \n    return -1\n\n# Test it (list must be sorted!)\nnumbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]\n\nprint(f\"Sorted list: {numbers}\")\nprint(f\"Search for 7: index {binary_search(numbers, 7)}\")\nprint(f\"Search for 15: index {binary_search(numbers, 15)}\")\nprint(f\"Search for 8: index {binary_search(numbers, 8)}\")",
          description: "Standard binary search implementation",
        },
        {
          id: "binary-visualized",
          title: "Binary Search Visualized",
          code: "def binary_search_visual(items, target):\n    \"\"\"Show each step of binary search.\"\"\"\n    left, right = 0, len(items) - 1\n    step = 0\n    \n    while left <= right:\n        step += 1\n        mid = (left + right) // 2\n        \n        # Visualize current state\n        viz = \"\"\n        for i, item in enumerate(items):\n            if i == mid:\n                viz += f\"[{item}]\"\n            elif left <= i <= right:\n                viz += f\" {item} \"\n            else:\n                viz += \" . \"\n        \n        print(f\"Step {step}: {viz}\")\n        print(f\"        left={left}, mid={mid}, right={right}, items[mid]={items[mid]}\")\n        \n        if items[mid] == target:\n            print(f\"        FOUND at index {mid}!\")\n            return mid\n        elif items[mid] < target:\n            print(f\"        {items[mid]} < {target}, search right\")\n            left = mid + 1\n        else:\n            print(f\"        {items[mid]} > {target}, search left\")\n            right = mid - 1\n        print()\n    \n    print(f\"Not found after {step} steps\")\n    return -1\n\nnumbers = [1, 3, 5, 7, 9, 11, 13, 15]\nprint(f\"Searching for 11 in {numbers}:\\n\")\nbinary_search_visual(numbers, 11)",
          description: "Step-by-step visualization",
        },
        {
          id: "binary-counted",
          title: "Counting Binary Search Steps",
          code: "def binary_search_counted(items, target):\n    \"\"\"Return (index, comparisons).\"\"\"\n    left, right = 0, len(items) - 1\n    comparisons = 0\n    \n    while left <= right:\n        comparisons += 1\n        mid = (left + right) // 2\n        \n        if items[mid] == target:\n            return mid, comparisons\n        elif items[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    \n    return -1, comparisons\n\n# Compare to linear search\nimport math\n\nprint(f\"{'Size':>10} {'Binary':>10} {'Linear':>10} {'log₂(n)':>10}\")\nprint(\"-\" * 45)\n\nfor size in [10, 100, 1000, 10000, 100000, 1000000]:\n    items = list(range(size))\n    target = -1  # Worst case: not found\n    \n    _, binary_ops = binary_search_counted(items, target)\n    linear_ops = size  # Would check all\n    log_n = math.ceil(math.log2(size + 1))\n    \n    print(f\"{size:>10,} {binary_ops:>10} {linear_ops:>10,} {log_n:>10}\")\n\nprint(\"\\nBinary: O(log n), Linear: O(n)\")",
          description: "Binary search is dramatically faster",
        },
        {
          id: "recursive-binary",
          title: "Recursive Binary Search",
          code: "def binary_search_recursive(items, target, left=None, right=None):\n    \"\"\"Recursive implementation of binary search.\"\"\"\n    if left is None:\n        left = 0\n    if right is None:\n        right = len(items) - 1\n    \n    # Base case: not found\n    if left > right:\n        return -1\n    \n    mid = (left + right) // 2\n    \n    # Base case: found\n    if items[mid] == target:\n        return mid\n    \n    # Recursive case\n    if items[mid] < target:\n        return binary_search_recursive(items, target, mid + 1, right)\n    else:\n        return binary_search_recursive(items, target, left, mid - 1)\n\n# Test\nnumbers = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]\n\nfor target in [10, 1, 20, 15]:\n    result = binary_search_recursive(numbers, target)\n    status = f\"found at {result}\" if result != -1 else \"not found\"\n    print(f\"Search for {target}: {status}\")",
          description: "Recursive implementation",
        },
      ]),
      keyPoints: [
        "Halves search space each step",
        "Requires SORTED data",
        "Complexity: O(log n) - logarithmic",
        "1M items → only ~20 comparisons",
        "Compare middle, eliminate half",
        "left, right pointers track search range",
        "Can be iterative or recursive",
        "Much faster than linear for large sorted data",
      ],
      hardwareDemo: "Watch binary search eliminate half each step. Compare to linear search visually.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson10_1_2.number}: ${lesson10_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_1_2.id,
        number: 1,
        title: "Implement Binary Search",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a binary search function for sorted lists.",
        starterCode: "def binary_search(items, target):\n    \"\"\"Return index of target in sorted items, or -1.\"\"\"\n    pass\n\nsorted_list = [1, 3, 5, 7, 9, 11, 13, 15]\nprint(binary_search(sorted_list, 7))   # 3\nprint(binary_search(sorted_list, 8))   # -1",
        solution: "def binary_search(items, target):\n    left, right = 0, len(items) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if items[mid] == target:\n            return mid\n        elif items[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nsorted_list = [1, 3, 5, 7, 9, 11, 13, 15]\nprint(binary_search(sorted_list, 7))\nprint(binary_search(sorted_list, 8))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "3\\n-1", description: "Binary search works" }]),
        hints: ["Use left and right pointers", "Calculate mid = (left + right) // 2", "Adjust left or right based on comparison"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson10_1_2.id,
        number: 2,
        title: "Count Steps",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Modify binary search to return step count too.",
        starterCode: "def binary_search_steps(items, target):\n    \"\"\"Return (index, steps).\"\"\"\n    pass\n\nitems = list(range(0, 100, 2))  # 0, 2, 4, ..., 98\nidx, steps = binary_search_steps(items, 50)\nprint(f\"Found 50 at index {idx} in {steps} steps\")",
        solution: "def binary_search_steps(items, target):\n    left, right = 0, len(items) - 1\n    steps = 0\n    while left <= right:\n        steps += 1\n        mid = (left + right) // 2\n        if items[mid] == target:\n            return mid, steps\n        elif items[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1, steps\n\nitems = list(range(0, 100, 2))\nidx, steps = binary_search_steps(items, 50)\nprint(f\"Found 50 at index {idx} in {steps} steps\")\nprint(f\"List has {len(items)} items, log₂({len(items)}) ≈ {len(items).bit_length()}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "~6 steps for 50 items", description: "Steps counted" }]),
        hints: ["Add steps counter", "Increment each iteration", "Return tuple"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson10_1_2.id,
        number: 3,
        title: "Recursive Version",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement binary search recursively.",
        starterCode: "def binary_search_recursive(items, target, left=0, right=None):\n    \"\"\"Recursive binary search.\"\"\"\n    if right is None:\n        right = len(items) - 1\n    # Implement recursively\n    pass\n\nitems = [10, 20, 30, 40, 50, 60, 70]\nprint(binary_search_recursive(items, 40))  # 3\nprint(binary_search_recursive(items, 35))  # -1",
        solution: "def binary_search_recursive(items, target, left=0, right=None):\n    if right is None:\n        right = len(items) - 1\n    \n    if left > right:\n        return -1\n    \n    mid = (left + right) // 2\n    if items[mid] == target:\n        return mid\n    elif items[mid] < target:\n        return binary_search_recursive(items, target, mid + 1, right)\n    else:\n        return binary_search_recursive(items, target, left, mid - 1)\n\nitems = [10, 20, 30, 40, 50, 60, 70]\nprint(binary_search_recursive(items, 40))\nprint(binary_search_recursive(items, 35))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "3\\n-1", description: "Recursive works" }]),
        hints: ["Base case: left > right → -1", "Base case: found → return mid", "Recursive: narrow range"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson10_1_2.id,
        number: 4,
        title: "Find Insert Position",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write function that returns where to insert a value to keep list sorted.",
        starterCode: "def find_insert_position(sorted_items, value):\n    \"\"\"Return index where value should be inserted.\"\"\"\n    pass\n\nitems = [1, 3, 5, 7, 9]\nprint(f\"Insert 4: position {find_insert_position(items, 4)}\")  # 2\nprint(f\"Insert 0: position {find_insert_position(items, 0)}\")  # 0\nprint(f\"Insert 10: position {find_insert_position(items, 10)}\")  # 5",
        solution: "def find_insert_position(sorted_items, value):\n    left, right = 0, len(sorted_items)\n    while left < right:\n        mid = (left + right) // 2\n        if sorted_items[mid] < value:\n            left = mid + 1\n        else:\n            right = mid\n    return left\n\nitems = [1, 3, 5, 7, 9]\nprint(f\"Insert 4: position {find_insert_position(items, 4)}\")\nprint(f\"Insert 0: position {find_insert_position(items, 0)}\")\nprint(f\"Insert 10: position {find_insert_position(items, 10)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "2, 0, 5", description: "Insert positions correct" }]),
        hints: ["Use left < right (not <=)", "right = len(items) initially", "Return left at end"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson10_1_2.id,
        number: 5,
        title: "Compare to Linear",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Compare binary and linear search performance on large data.",
        starterCode: "import time\n\ndef linear_search(items, target):\n    for i, item in enumerate(items):\n        if item == target:\n            return i\n    return -1\n\ndef binary_search(items, target):\n    # Implement\n    pass\n\n# Compare for sizes 10000, 100000, 1000000\n# Search for element not in list (worst case)",
        solution: "import time\n\ndef linear_search(items, target):\n    for i, item in enumerate(items):\n        if item == target:\n            return i\n    return -1\n\ndef binary_search(items, target):\n    left, right = 0, len(items) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if items[mid] == target:\n            return mid\n        elif items[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nprint(f\"{'Size':>10} {'Linear':>12} {'Binary':>12} {'Speedup':>10}\")\nprint(\"-\" * 48)\n\nfor size in [10000, 100000, 1000000]:\n    items = list(range(size))\n    target = -1\n    \n    start = time.time()\n    linear_search(items, target)\n    t_linear = time.time() - start\n    \n    start = time.time()\n    binary_search(items, target)\n    t_binary = time.time() - start\n    \n    speedup = t_linear / t_binary if t_binary > 0 else float('inf')\n    print(f\"{size:>10,} {t_linear:>12.6f} {t_binary:>12.6f} {speedup:>10.0f}x\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Binary much faster", description: "Dramatic speedup" }]),
        hints: ["Time worst case for both", "Calculate speedup ratio"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 10.1.2`);

  // ==================== LESSON 10.1.3 ====================
  const lesson10_1_3 = await prisma.lesson.upsert({
    where: { slug: "search-comparison" },
    update: {},
    create: {
      sectionId: section10_1.id,
      number: 10.13,
      title: "Search Comparison",
      slug: "search-comparison",
      objectives: [
        "Compare linear and binary search performance",
        "Know when to use each algorithm",
        "Understand the cost of sorting",
        "Make informed algorithm choices",
      ],
      content: `# Search Comparison

## Linear vs Binary Search

| Aspect | Linear Search | Binary Search |
|--------|--------------|---------------|
| Complexity | O(n) | O(log n) |
| Requires sorted | No | Yes |
| 1M items | ~1M comparisons | ~20 comparisons |
| Implementation | Simple | Moderate |

## When to Use Each

### Use Linear Search When:
- Data is **unsorted**
- List is **small** (< ~100 items)
- Searching **only once**
- Need to find **all occurrences**
- Data changes **frequently**

### Use Binary Search When:
- Data is **already sorted**
- List is **large** (> ~100 items)
- Searching **multiple times**
- Only need **first occurrence**

## The Sorting Cost Tradeoff

Sorting costs O(n log n). Is it worth it?

\`\`\`
Single search:
  Linear: O(n)
  Sort + Binary: O(n log n) + O(log n) = O(n log n)
  → Linear wins!

k searches:
  Linear: O(k × n)
  Sort + Binary: O(n log n) + O(k × log n)
  → Binary wins when k is large!
\`\`\`

## Break-Even Point

Sort once, search multiple times becomes worth it when:

\`\`\`
k × n > n log n + k × log n
\`\`\`

For n = 10,000: Break-even at about k = 14 searches.

## Python's Built-in Options

\`\`\`python
# Linear search
if target in items:  # O(n)
    index = items.index(target)  # O(n) again

# Binary search (sorted data)
import bisect
index = bisect.bisect_left(items, target)  # O(log n)
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "side-by-side",
          title: "Side-by-Side Comparison",
          code: "import time\n\ndef linear_search(items, target):\n    for i, item in enumerate(items):\n        if item == target:\n            return i\n    return -1\n\ndef binary_search(items, target):\n    left, right = 0, len(items) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if items[mid] == target:\n            return mid\n        elif items[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\n# Compare on same sorted data\nprint(\"Searching sorted list (worst case: not found)\")\nprint(f\"{'Size':>10} {'Linear':>12} {'Binary':>12} {'Ratio':>10}\")\nprint(\"-\" * 48)\n\nfor size in [100, 1000, 10000, 100000]:\n    items = list(range(size))\n    target = -1\n    \n    # Time linear\n    start = time.time()\n    for _ in range(100):\n        linear_search(items, target)\n    t_linear = (time.time() - start) / 100\n    \n    # Time binary\n    start = time.time()\n    for _ in range(10000):\n        binary_search(items, target)\n    t_binary = (time.time() - start) / 10000\n    \n    ratio = t_linear / t_binary\n    print(f\"{size:>10,} {t_linear*1000:>12.3f}ms {t_binary*1000:>12.6f}ms {ratio:>10.0f}x\")",
          description: "Direct performance comparison",
        },
        {
          id: "sorting-cost",
          title: "The Cost of Sorting",
          code: "import time\nimport random\n\ndef linear_search(items, target):\n    for i, item in enumerate(items):\n        if item == target:\n            return i\n    return -1\n\ndef binary_search(items, target):\n    left, right = 0, len(items) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if items[mid] == target:\n            return mid\n        elif items[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nn = 10000\nunsorted_items = [random.randint(0, n*10) for _ in range(n)]\nsorted_items = sorted(unsorted_items)\n\nprint(f\"List size: {n}\")\nprint()\n\n# Time sorting\nstart = time.time()\nsorted(unsorted_items.copy())\nsort_time = time.time() - start\nprint(f\"Sorting cost: {sort_time*1000:.2f}ms\")\nprint()\n\n# Single search comparison\nprint(\"Single search:\")\ntarget = -1\n\nstart = time.time()\nlinear_search(unsorted_items, target)\nt_linear = time.time() - start\nprint(f\"  Linear on unsorted: {t_linear*1000:.3f}ms\")\n\nstart = time.time()\nbinary_search(sorted_items, target)\nt_binary = time.time() - start\nprint(f\"  Binary on sorted: {t_binary*1000:.4f}ms\")\nprint(f\"  Sort + Binary: {(sort_time + t_binary)*1000:.3f}ms\")\nprint(f\"  → Linear wins for single search!\")",
          description: "Sorting overhead analysis",
        },
        {
          id: "break-even",
          title: "Finding the Break-Even Point",
          code: "import time\nimport random\n\ndef linear_search(items, target):\n    return target in items\n\ndef binary_search(items, target):\n    left, right = 0, len(items) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if items[mid] == target:\n            return True\n        elif items[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return False\n\nn = 10000\nunsorted = [random.randint(0, n*10) for _ in range(n)]\ntargets = [random.randint(0, n*10) for _ in range(100)]\n\nprint(f\"List size: {n}\")\nprint(f\"Testing with various numbers of searches...\")\nprint()\nprint(f\"{'Searches':>10} {'Linear':>12} {'Sort+Binary':>12} {'Winner':>10}\")\nprint(\"-\" * 50)\n\nfor num_searches in [1, 5, 10, 20, 50, 100]:\n    # Linear: k searches at O(n) each\n    start = time.time()\n    for target in targets[:num_searches]:\n        linear_search(unsorted, target)\n    t_linear = time.time() - start\n    \n    # Binary: O(n log n) sort + k searches at O(log n)\n    start = time.time()\n    sorted_items = sorted(unsorted)\n    for target in targets[:num_searches]:\n        binary_search(sorted_items, target)\n    t_binary = time.time() - start\n    \n    winner = \"Linear\" if t_linear < t_binary else \"Binary\"\n    print(f\"{num_searches:>10} {t_linear*1000:>12.2f}ms {t_binary*1000:>12.2f}ms {winner:>10}\")",
          description: "When sorting becomes worth it",
        },
        {
          id: "python-builtins",
          title: "Python's Built-in Search Tools",
          code: "import bisect\nimport time\n\n# Create sorted list\nsorted_items = list(range(0, 100000, 2))  # Even numbers\n\n# Using 'in' operator - O(n)\nstart = time.time()\nfor _ in range(100):\n    50000 in sorted_items\nt_in = (time.time() - start) / 100\n\n# Using index() - O(n)\nstart = time.time()\nfor _ in range(100):\n    sorted_items.index(50000)\nt_index = (time.time() - start) / 100\n\n# Using bisect - O(log n)\nstart = time.time()\nfor _ in range(10000):\n    idx = bisect.bisect_left(sorted_items, 50000)\n    found = idx < len(sorted_items) and sorted_items[idx] == 50000\nt_bisect = (time.time() - start) / 10000\n\nprint(\"Python search options for sorted lists:\")\nprint(f\"  'in' operator: {t_in*1000:.4f}ms (O(n))\")\nprint(f\"  list.index(): {t_index*1000:.4f}ms (O(n))\")\nprint(f\"  bisect: {t_bisect*1000:.6f}ms (O(log n))\")\nprint(f\"\\nbisect is {t_in/t_bisect:.0f}x faster than 'in'!\")\nprint(\"\\nFor sorted data, use bisect module.\")",
          description: "Using Python's bisect module",
        },
      ]),
      keyPoints: [
        "Linear: O(n), works on any list",
        "Binary: O(log n), requires sorted",
        "Sorting costs O(n log n)",
        "Single search: linear usually wins",
        "Multiple searches: sort+binary wins",
        "Break-even depends on list size",
        "Python bisect module for binary search",
        "Consider data update frequency",
      ],
      hardwareDemo: "Race both algorithms. Show break-even point graphically.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson10_1_3.number}: ${lesson10_1_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_1_3.id,
        number: 1,
        title: "Choose the Algorithm",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "You need to search an unsorted list of 50 items ONCE. Which algorithm?",
        starterCode: "",
        solution: "Linear search - sorting for one search wastes time",
        testCases: JSON.stringify([
          { input: "Linear search", expectedOutput: "true", description: "Correct!" },
          { input: "Binary search", expectedOutput: "false", description: "Would need to sort first" },
        ]),
        hints: ["Data is unsorted", "Only searching once", "Sorting costs O(n log n)"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson10_1_3.id,
        number: 2,
        title: "Multiple Searches",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "You have 100,000 unsorted items and need to search 1000 times. Which approach?",
        starterCode: "",
        solution: "Sort once, then binary search - O(n log n) + 1000×O(log n) << 1000×O(n)",
        testCases: JSON.stringify([
          { input: "Sort + binary", expectedOutput: "true", description: "Correct!" },
          { input: "Linear each time", expectedOutput: "false", description: "Would be 1000×100000 operations" },
        ]),
        hints: ["1000 searches is a lot", "Sorting cost is paid only once", "Binary search is O(log n) each"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson10_1_3.id,
        number: 3,
        title: "Calculate Break-Even",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find approximately how many searches make sorting worthwhile for n=10000.",
        starterCode: "import time\nimport random\n\ndef linear_search(items, target):\n    return target in items\n\ndef binary_search(sorted_items, target):\n    left, right = 0, len(sorted_items) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if sorted_items[mid] == target:\n            return True\n        elif sorted_items[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return False\n\nn = 10000\ndata = [random.randint(0, n*10) for _ in range(n)]\n\n# Find break-even point",
        solution: "import time\nimport random\n\ndef linear_search(items, target):\n    return target in items\n\ndef binary_search(sorted_items, target):\n    left, right = 0, len(sorted_items) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if sorted_items[mid] == target:\n            return True\n        elif sorted_items[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return False\n\nn = 10000\ndata = [random.randint(0, n*10) for _ in range(n)]\ntargets = [random.randint(0, n*10) for _ in range(100)]\n\nprint(\"Finding break-even point...\")\nfor k in [1, 5, 10, 15, 20, 30]:\n    # Linear approach\n    start = time.time()\n    for t in targets[:k]:\n        linear_search(data, t)\n    t_linear = time.time() - start\n    \n    # Sort + binary approach\n    start = time.time()\n    sorted_data = sorted(data)\n    for t in targets[:k]:\n        binary_search(sorted_data, t)\n    t_binary = time.time() - start\n    \n    winner = \"Linear\" if t_linear < t_binary else \"Binary\"\n    print(f\"k={k:2}: Linear={t_linear*1000:.2f}ms, Binary={t_binary*1000:.2f}ms → {winner}\")\n\nprint(\"\\nBreak-even is around 10-20 searches for n=10000\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Break-even identified", description: "Analysis complete" }]),
        hints: ["Time both approaches for increasing k", "Find where binary becomes faster"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson10_1_3.id,
        number: 4,
        title: "Use bisect Module",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use Python's bisect module for efficient sorted list search.",
        starterCode: "import bisect\n\ndef binary_search_bisect(sorted_items, target):\n    \"\"\"Use bisect to find target. Return index or -1.\"\"\"\n    pass\n\nitems = [1, 3, 5, 7, 9, 11, 13, 15]\nprint(binary_search_bisect(items, 7))   # 3\nprint(binary_search_bisect(items, 8))   # -1",
        solution: "import bisect\n\ndef binary_search_bisect(sorted_items, target):\n    idx = bisect.bisect_left(sorted_items, target)\n    if idx < len(sorted_items) and sorted_items[idx] == target:\n        return idx\n    return -1\n\nitems = [1, 3, 5, 7, 9, 11, 13, 15]\nprint(binary_search_bisect(items, 7))\nprint(binary_search_bisect(items, 8))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "3\\n-1", description: "bisect works" }]),
        hints: ["bisect_left finds insert position", "Check if item at position equals target"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson10_1_3.id,
        number: 5,
        title: "Complete Comparison",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a function that recommends the best search strategy based on parameters.",
        starterCode: "def recommend_search(n, num_searches, is_sorted):\n    \"\"\"\n    Return recommendation: 'linear', 'binary', or 'sort_then_binary'\n    with explanation.\n    \"\"\"\n    pass\n\n# Test cases\nprint(recommend_search(50, 1, False))\nprint(recommend_search(100000, 1000, False))\nprint(recommend_search(100000, 1, True))",
        solution: "def recommend_search(n, num_searches, is_sorted):\n    # Rough cost estimates\n    linear_cost = n * num_searches\n    sort_cost = n * (n.bit_length())  # ~n log n\n    binary_per_search = n.bit_length()  # ~log n\n    binary_cost = binary_per_search * num_searches\n    sort_binary_cost = sort_cost + binary_cost\n    \n    if is_sorted:\n        return f\"binary - data already sorted, O(log n) per search\"\n    \n    if n < 100:\n        return f\"linear - small list ({n} items), overhead not worth it\"\n    \n    if num_searches == 1:\n        return f\"linear - single search, sorting cost O(n log n) > O(n)\"\n    \n    if sort_binary_cost < linear_cost:\n        return f\"sort_then_binary - {num_searches} searches justifies O(n log n) sort\"\n    else:\n        return f\"linear - {num_searches} searches not enough to justify sorting\"\n\nprint(recommend_search(50, 1, False))\nprint(recommend_search(100000, 1000, False))\nprint(recommend_search(100000, 1, True))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Appropriate recommendations", description: "Smart choices" }]),
        hints: ["Consider: is data sorted?", "Consider: how many searches?", "Compare costs"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 10.1.3`);

  console.log("\n✅ Chapter 10 Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
