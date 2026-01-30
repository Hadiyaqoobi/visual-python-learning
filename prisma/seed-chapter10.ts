import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Chapter 10: Algorithms and Data Structures...");

  // Create Chapter 10
  const chapter10 = await prisma.chapter.upsert({
    where: { number: 10 },
    update: {},
    create: {
      number: 10,
      title: "Some Simple Algorithms and Data Structures",
      description: "Learn fundamental algorithms for searching and sorting, and understand how hash tables enable fast lookups.",
      objectives: [
        "Implement and analyze linear and binary search",
        "Understand and implement selection and merge sort",
        "Compare algorithm efficiency",
        "Understand hash tables and hash functions",
        "Know how Python dictionaries work internally",
      ],
      isPublished: true,
    },
  });

  console.log("✅ Created Chapter 10:", chapter10.title);

  // Create Sections
  const section10_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter10.id, number: 10.1 } },
    update: {},
    create: {
      chapterId: chapter10.id,
      number: 10.1,
      title: "Search Algorithms",
      description: "Finding elements efficiently",
      order: 1,
    },
  });

  const section10_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter10.id, number: 10.2 } },
    update: {},
    create: {
      chapterId: chapter10.id,
      number: 10.2,
      title: "Sorting Algorithms",
      description: "Organizing data efficiently",
      order: 2,
    },
  });

  const section10_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter10.id, number: 10.3 } },
    update: {},
    create: {
      chapterId: chapter10.id,
      number: 10.3,
      title: "Hash Tables",
      description: "Fast key-value lookups",
      order: 3,
    },
  });

  // ==================== LESSON 10.1.1: Linear Search ====================
  const lesson10_1_1 = await prisma.lesson.upsert({
    where: { slug: "linear-search" },
    update: {},
    create: {
      sectionId: section10_1.id,
      number: 10.11,
      title: "Linear Search",
      slug: "linear-search",
      objectives: [
        "Implement linear search algorithm",
        "Understand when linear search is appropriate",
        "Analyze linear search complexity",
        "Handle search failures gracefully",
      ],
      content: `# Linear Search

**Linear search** (or sequential search) checks each element one by one until finding the target or reaching the end.

## The Algorithm

\`\`\`python
def linear_search(lst, target):
    for i in range(len(lst)):
        if lst[i] == target:
            return i  # Found!
    return -1  # Not found
\`\`\`

## How It Works

1. Start at the first element
2. Compare current element with target
3. If match, return the index
4. If no match, move to next element
5. If end reached, return -1 (not found)

## Complexity Analysis

- **Best case**: O(1) - target is first element
- **Worst case**: O(n) - target is last or not present
- **Average case**: O(n/2) = O(n)

## When to Use Linear Search

✅ **Use when**:
- List is small
- List is unsorted
- You only search once
- You need the first occurrence

❌ **Avoid when**:
- List is large AND sorted (use binary search)
- Searching repeatedly (consider sorting first)

## Variations

\`\`\`python
# Find all occurrences
def find_all(lst, target):
    indices = []
    for i, item in enumerate(lst):
        if item == target:
            indices.append(i)
    return indices

# Search with condition
def find_first_even(lst):
    for i, item in enumerate(lst):
        if item % 2 == 0:
            return i
    return -1
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-linear-search",
          title: "Basic Linear Search",
          code: `def linear_search(lst, target):
    """Return index of target, or -1 if not found"""
    for i in range(len(lst)):
        if lst[i] == target:
            return i
    return -1

numbers = [4, 2, 7, 1, 9, 3, 6, 5, 8]

print(f"Search for 7: index {linear_search(numbers, 7)}")
print(f"Search for 1: index {linear_search(numbers, 1)}")
print(f"Search for 10: index {linear_search(numbers, 10)}")`,
          description: "Simple linear search implementation",
        },
        {
          id: "linear-search-steps",
          title: "Linear Search with Step Count",
          code: `def linear_search_verbose(lst, target):
    """Linear search that shows its work"""
    comparisons = 0
    
    for i in range(len(lst)):
        comparisons += 1
        print(f"  Step {comparisons}: checking index {i}, value {lst[i]}")
        
        if lst[i] == target:
            print(f"  Found at index {i}!")
            return i, comparisons
    
    print(f"  Not found after {comparisons} comparisons")
    return -1, comparisons

numbers = [4, 2, 7, 1, 9, 3, 6]

print("Searching for 9:")
linear_search_verbose(numbers, 9)`,
          description: "Watch the search process",
        },
        {
          id: "find-all",
          title: "Find All Occurrences",
          code: `def find_all(lst, target):
    """Return list of all indices where target appears"""
    indices = []
    for i in range(len(lst)):
        if lst[i] == target:
            indices.append(i)
    return indices

numbers = [1, 3, 5, 3, 7, 3, 9, 3]

result = find_all(numbers, 3)
print(f"3 found at indices: {result}")
print(f"Found {len(result)} occurrences")`,
          description: "Find all matching elements",
        },
      ]),
      keyPoints: [
        "Check each element from start to end",
        "Return index when found, -1 when not",
        "Time complexity: O(n)",
        "Works on any list (sorted or unsorted)",
        "Simple but not efficient for large sorted lists",
      ],
      hardwareDemo: "Watch the search pointer move through the array. See each comparison and how the search stops when the target is found.",
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_1_1.id,
        number: 1,
        title: "Implement Linear Search",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Complete the linear search function to find the target in the list.",
        starterCode: `def linear_search(lst, target):
    for i in range(len(lst)):
        if lst[i] == target:
            return i
    return -1

numbers = [5, 2, 8, 1, 9]
print(linear_search(numbers, 8))
print(linear_search(numbers, 7))`,
        solution: `def linear_search(lst, target):
    for i in range(len(lst)):
        if lst[i] == target:
            return i
    return -1

numbers = [5, 2, 8, 1, 9]
print(linear_search(numbers, 8))
print(linear_search(numbers, 7))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "2\n-1", description: "Found at 2, not found returns -1" },
        ]),
        hints: ["Loop through indices", "Compare lst[i] with target", "Return i when found, -1 at end"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson10_1_1.id,
        number: 2,
        title: "Count Comparisons",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Modify linear search to also return the number of comparisons made.",
        starterCode: `def linear_search_counted(lst, target):
    comparisons = 0
    for i in range(len(lst)):
        comparisons += 1
        if lst[i] == target:
            return i, comparisons
    return -1, comparisons

numbers = list(range(100))
idx, comps = linear_search_counted(numbers, 50)
print(f"Found at index {idx} after {comps} comparisons")`,
        solution: `def linear_search_counted(lst, target):
    comparisons = 0
    for i in range(len(lst)):
        comparisons += 1
        if lst[i] == target:
            return i, comparisons
    return -1, comparisons

numbers = list(range(100))
idx, comps = linear_search_counted(numbers, 50)
print(f"Found at index {idx} after {comps} comparisons")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Found at index 50 after 51 comparisons", description: "Counts comparisons" },
        ]),
        hints: ["Add comparisons counter", "Increment before each comparison", "Return both index and count"],
        xpReward: 20,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 10.1.1: Linear Search");

  // ==================== LESSON 10.1.2: Binary Search ====================
  const lesson10_1_2 = await prisma.lesson.upsert({
    where: { slug: "binary-search-algo" },
    update: {},
    create: {
      sectionId: section10_1.id,
      number: 10.12,
      title: "Binary Search",
      slug: "binary-search-algo",
      objectives: [
        "Implement binary search algorithm",
        "Understand the sorted list requirement",
        "Analyze O(log n) complexity",
        "Choose between iterative and recursive versions",
      ],
      content: `# Binary Search

**Binary search** finds elements in a sorted list by repeatedly halving the search space.

## The Algorithm

\`\`\`python
def binary_search(sorted_lst, target):
    low = 0
    high = len(sorted_lst) - 1
    
    while low <= high:
        mid = (low + high) // 2
        
        if sorted_lst[mid] == target:
            return mid
        elif sorted_lst[mid] < target:
            low = mid + 1  # Search right half
        else:
            high = mid - 1  # Search left half
    
    return -1
\`\`\`

## How It Works

1. Look at the middle element
2. If it's the target, done!
3. If target is larger, search right half
4. If target is smaller, search left half
5. Repeat until found or no elements left

## Why It's Fast

Each step eliminates HALF the remaining elements:
- 1000 elements → 500 → 250 → 125 → 62 → 31 → 15 → 7 → 3 → 1
- Only ~10 steps for 1000 elements!

## Complexity

- **Best case**: O(1) - target is in the middle
- **Worst case**: O(log n) - target at end or not present
- **Average case**: O(log n)

## REQUIREMENT: Sorted List!

Binary search ONLY works on sorted lists:
\`\`\`python
# Works
binary_search([1, 2, 3, 4, 5], 3)  ✓

# Doesn't work correctly!
binary_search([5, 2, 8, 1, 9], 8)  ✗
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "iterative-binary",
          title: "Iterative Binary Search",
          code: `def binary_search(sorted_lst, target):
    low = 0
    high = len(sorted_lst) - 1
    
    while low <= high:
        mid = (low + high) // 2
        
        if sorted_lst[mid] == target:
            return mid
        elif sorted_lst[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    
    return -1

numbers = list(range(0, 100, 2))  # [0, 2, 4, ..., 98]

print(f"Searching for 42: index {binary_search(numbers, 42)}")
print(f"Searching for 7: index {binary_search(numbers, 7)}")`,
          description: "Standard iterative implementation",
        },
        {
          id: "binary-search-verbose",
          title: "Binary Search Step by Step",
          code: `def binary_search_verbose(sorted_lst, target):
    low, high = 0, len(sorted_lst) - 1
    step = 0
    
    while low <= high:
        step += 1
        mid = (low + high) // 2
        print(f"Step {step}: low={low}, high={high}, mid={mid}, value={sorted_lst[mid]}")
        
        if sorted_lst[mid] == target:
            print(f"Found at index {mid}!")
            return mid
        elif sorted_lst[mid] < target:
            print(f"  {sorted_lst[mid]} < {target}, search right")
            low = mid + 1
        else:
            print(f"  {sorted_lst[mid]} > {target}, search left")
            high = mid - 1
    
    return -1

numbers = list(range(100))
binary_search_verbose(numbers, 73)`,
          description: "Watch the halving process",
        },
        {
          id: "recursive-binary",
          title: "Recursive Binary Search",
          code: `def binary_search_recursive(sorted_lst, target, low=0, high=None):
    if high is None:
        high = len(sorted_lst) - 1
    
    if low > high:
        return -1
    
    mid = (low + high) // 2
    
    if sorted_lst[mid] == target:
        return mid
    elif sorted_lst[mid] < target:
        return binary_search_recursive(sorted_lst, target, mid + 1, high)
    else:
        return binary_search_recursive(sorted_lst, target, low, mid - 1)

numbers = list(range(100))
print(f"Found 42 at: {binary_search_recursive(numbers, 42)}")`,
          description: "Recursive version",
        },
      ]),
      keyPoints: [
        "Only works on SORTED lists",
        "Halves search space each step",
        "Time complexity: O(log n)",
        "Much faster than linear for large sorted lists",
        "Can be iterative or recursive",
      ],
      hardwareDemo: "Watch the search range shrink by half each step. See low, mid, and high pointers move, eliminating half the elements each time.",
      estimatedTime: 20,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_1_2.id,
        number: 1,
        title: "Implement Binary Search",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Complete the binary search implementation.",
        starterCode: `def binary_search(sorted_lst, target):
    low = 0
    high = len(sorted_lst) - 1
    
    while low <= high:
        mid = (low + high) // 2
        
        if sorted_lst[mid] == target:
            return mid
        elif sorted_lst[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    
    return -1

numbers = list(range(0, 20))
print(binary_search(numbers, 7))
print(binary_search(numbers, 15))
print(binary_search(numbers, 25))`,
        solution: `def binary_search(sorted_lst, target):
    low = 0
    high = len(sorted_lst) - 1
    
    while low <= high:
        mid = (low + high) // 2
        
        if sorted_lst[mid] == target:
            return mid
        elif sorted_lst[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    
    return -1

numbers = list(range(0, 20))
print(binary_search(numbers, 7))
print(binary_search(numbers, 15))
print(binary_search(numbers, 25))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "7\n15\n-1", description: "Binary search works" },
        ]),
        hints: ["Initialize low=0, high=len-1", "Calculate mid each iteration", "Adjust low or high based on comparison"],
        xpReward: 25,
        order: 1,
      },
      {
        lessonId: lesson10_1_2.id,
        number: 2,
        title: "Count Steps",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Count how many steps binary search takes for different list sizes.",
        starterCode: `def binary_search_steps(size, target):
    lst = list(range(size))
    low, high = 0, size - 1
    steps = 0
    
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        if lst[mid] == target:
            return steps
        elif lst[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return steps

for size in [100, 1000, 10000, 100000]:
    steps = binary_search_steps(size, size - 1)
    print(f"Size {size}: {steps} steps")`,
        solution: `def binary_search_steps(size, target):
    lst = list(range(size))
    low, high = 0, size - 1
    steps = 0
    
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        if lst[mid] == target:
            return steps
        elif lst[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return steps

for size in [100, 1000, 10000, 100000]:
    steps = binary_search_steps(size, size - 1)
    print(f"Size {size}: {steps} steps")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Size 100: 7 steps\nSize 1000: 10 steps\nSize 10000: 14 steps\nSize 100000: 17 steps", description: "Logarithmic growth" },
        ]),
        hints: ["Add step counter", "Compare steps to log₂(size)", "Notice slow growth"],
        xpReward: 20,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 10.1.2: Binary Search");

  // ==================== LESSON 10.1.3: Search Complexity Analysis ====================
  const lesson10_1_3 = await prisma.lesson.upsert({
    where: { slug: "search-complexity" },
    update: {},
    create: {
      sectionId: section10_1.id,
      number: 10.13,
      title: "Search Complexity Analysis",
      slug: "search-complexity",
      objectives: [
        "Compare linear and binary search complexity",
        "Understand when to use each algorithm",
        "Analyze the cost of sorting before searching",
        "Make informed algorithm choices",
      ],
      content: `# Search Complexity Analysis

Let's compare linear and binary search rigorously.

## Side-by-Side Comparison

| Aspect | Linear Search | Binary Search |
|--------|---------------|---------------|
| Time Complexity | O(n) | O(log n) |
| Requires Sorted | No | Yes |
| Space Complexity | O(1) | O(1) |
| Implementation | Simple | Moderate |

## Concrete Numbers

For n = 1,000,000:
- Linear search: up to 1,000,000 comparisons
- Binary search: up to 20 comparisons

## The Sorting Question

Binary search needs a sorted list. Is it worth sorting first?

**Sort once, search many times**:
- Sorting: O(n log n)
- k searches after sorting: O(k log n)
- Total: O(n log n + k log n)

**vs. Linear search k times**:
- Total: O(k × n)

**Break-even point**: When k × n > n log n + k log n

For n = 1000: worth sorting if you search more than ~10 times!

## Decision Guide

1. **Small list (< 100)**: Linear search is fine
2. **Unsorted, single search**: Linear search
3. **Sorted list, any size**: Binary search
4. **Multiple searches**: Sort first, then binary search

## Python's Built-in Options

\`\`\`python
# Linear search
if target in lst:  # O(n)
    idx = lst.index(target)

# For sorted lists
import bisect
idx = bisect.bisect_left(sorted_lst, target)  # O(log n)
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "compare-searches",
          title: "Compare Search Algorithms",
          code: `def linear_search(lst, target):
    comparisons = 0
    for i in range(len(lst)):
        comparisons += 1
        if lst[i] == target:
            return i, comparisons
    return -1, comparisons

def binary_search(sorted_lst, target):
    comparisons = 0
    low, high = 0, len(sorted_lst) - 1
    while low <= high:
        comparisons += 1
        mid = (low + high) // 2
        if sorted_lst[mid] == target:
            return mid, comparisons
        elif sorted_lst[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1, comparisons

# Compare for different sizes
for size in [100, 1000, 10000]:
    lst = list(range(size))
    target = size - 1  # Worst case
    
    _, linear_comps = linear_search(lst, target)
    _, binary_comps = binary_search(lst, target)
    
    print(f"Size {size}: Linear={linear_comps}, Binary={binary_comps}")`,
          description: "See the dramatic difference",
        },
        {
          id: "sort-then-search",
          title: "Sort Once, Search Many",
          code: `import random
import time

def multiple_linear_searches(lst, targets):
    total_comps = 0
    for target in targets:
        for item in lst:
            total_comps += 1
            if item == target:
                break
    return total_comps

def sort_then_binary(lst, targets):
    sorted_lst = sorted(lst)  # O(n log n)
    total_comps = len(lst)  # Approximate sort comparisons
    
    for target in targets:
        low, high = 0, len(sorted_lst) - 1
        while low <= high:
            total_comps += 1
            mid = (low + high) // 2
            if sorted_lst[mid] == target:
                break
            elif sorted_lst[mid] < target:
                low = mid + 1
            else:
                high = mid - 1
    return total_comps

n = 1000
k = 100  # Number of searches
lst = list(range(n))
random.shuffle(lst)
targets = random.choices(range(n), k=k)

linear = multiple_linear_searches(lst, targets)
binary = sort_then_binary(lst, targets)

print(f"{k} searches on {n} elements:")
print(f"Linear: {linear:,} comparisons")
print(f"Sort+Binary: {binary:,} comparisons")`,
          description: "Compare strategies for multiple searches",
        },
      ]),
      keyPoints: [
        "Linear: O(n), Binary: O(log n)",
        "Binary requires sorted input",
        "For multiple searches, sort first",
        "Small lists: linear is acceptable",
        "Large sorted lists: always use binary",
      ],
      hardwareDemo: "See comparison counters for both algorithms. Watch how binary search stays low while linear search climbs with size.",
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_1_3.id,
        number: 1,
        title: "Compare Algorithms",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Compare the number of steps for linear vs binary search.",
        starterCode: `import math

def compare_searches(n):
    linear_worst = n
    binary_worst = math.ceil(math.log2(n + 1))
    ratio = linear_worst / binary_worst
    return linear_worst, binary_worst, ratio

print("Size      | Linear | Binary | Ratio")
print("-" * 40)
for size in [100, 1000, 10000, 100000, 1000000]:
    lin, bin, ratio = compare_searches(size)
    print(f"{size:>9} | {lin:>6} | {bin:>6} | {ratio:>5.0f}x")`,
        solution: `import math

def compare_searches(n):
    linear_worst = n
    binary_worst = math.ceil(math.log2(n + 1))
    ratio = linear_worst / binary_worst
    return linear_worst, binary_worst, ratio

print("Size      | Linear | Binary | Ratio")
print("-" * 40)
for size in [100, 1000, 10000, 100000, 1000000]:
    lin, bin, ratio = compare_searches(size)
    print(f"{size:>9} | {lin:>6} | {bin:>6} | {ratio:>5.0f}x")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Size      | Linear | Binary | Ratio\n----------------------------------------\n      100 |    100 |      7 |    14x\n     1000 |   1000 |     10 |   100x\n    10000 |  10000 |     14 |   714x\n   100000 | 100000 |     17 |  5882x\n  1000000 | 1000000 |     20 | 50000x", description: "Shows dramatic difference" },
        ]),
        hints: ["log₂ gives binary search steps", "Ratio shows how many times faster", "Difference grows with size"],
        xpReward: 20,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 10.1.3: Search Complexity Analysis");

  // ==================== LESSON 10.2.1: Sorting Introduction ====================
  const lesson10_2_1 = await prisma.lesson.upsert({
    where: { slug: "sorting-intro" },
    update: {},
    create: {
      sectionId: section10_2.id,
      number: 10.21,
      title: "Sorting Introduction",
      slug: "sorting-intro",
      objectives: [
        "Understand why sorting is important",
        "Know the basics of sorting algorithms",
        "Understand stability in sorting",
        "Compare in-place vs out-of-place sorting",
      ],
      content: `# Sorting Introduction

Sorting is one of the most fundamental operations in computer science.

## Why Sorting Matters

1. **Enables binary search** - O(n) → O(log n)
2. **Finds duplicates** easily
3. **Organizes data** for humans
4. **Enables merge operations**

## Sorting Basics

**Input**: Unsorted sequence [5, 2, 8, 1, 9]
**Output**: Sorted sequence [1, 2, 5, 8, 9]

## Key Properties

### Comparison-Based
Most sorting algorithms compare pairs of elements:
\`\`\`python
if a > b:
    swap(a, b)
\`\`\`

### Stable vs Unstable

**Stable**: Equal elements keep their relative order
**Unstable**: Equal elements may be reordered

\`\`\`python
# Original: [(3, 'a'), (1, 'b'), (3, 'c')]
# Stable sort by first element:   [(1, 'b'), (3, 'a'), (3, 'c')]
# Unstable might give:            [(1, 'b'), (3, 'c'), (3, 'a')]
\`\`\`

### In-Place vs Out-of-Place

**In-place**: Uses O(1) extra space (modifies original)
**Out-of-place**: Creates new sorted list

## Complexity Lower Bound

Any comparison-based sort must be at least O(n log n).

| Algorithm | Average | Worst | Space | Stable |
|-----------|---------|-------|-------|--------|
| Selection | O(n²) | O(n²) | O(1) | No |
| Insertion | O(n²) | O(n²) | O(1) | Yes |
| Merge | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n²) | O(log n) | No |`,
      codeExamples: JSON.stringify([
        {
          id: "python-sorting",
          title: "Python's Built-in Sorting",
          code: `# sorted() returns new list
original = [5, 2, 8, 1, 9]
sorted_list = sorted(original)
print(f"Original: {original}")
print(f"Sorted: {sorted_list}")

# .sort() modifies in place
numbers = [5, 2, 8, 1, 9]
numbers.sort()
print(f"After .sort(): {numbers}")

# Reverse sorting
numbers = [5, 2, 8, 1, 9]
print(f"Descending: {sorted(numbers, reverse=True)}")`,
          description: "Python's O(n log n) Timsort",
        },
        {
          id: "stability-demo",
          title: "Sorting Stability",
          code: `# Sort students by grade, keeping name order for same grades
students = [
    ("Alice", 85),
    ("Bob", 90),
    ("Charlie", 85),
    ("David", 90),
]

# Python's sort is stable
sorted_students = sorted(students, key=lambda x: x[1])

print("Sorted by grade (stable):")
for name, grade in sorted_students:
    print(f"  {name}: {grade}")

# Alice comes before Charlie (both 85)
# Bob comes before David (both 90)`,
          description: "Stable sort preserves order",
        },
        {
          id: "custom-sorting",
          title: "Custom Sorting Keys",
          code: `words = ["banana", "Apple", "cherry", "Date"]

# Default (case-sensitive)
print(f"Default: {sorted(words)}")

# Case-insensitive
print(f"Case-insensitive: {sorted(words, key=str.lower)}")

# By length
print(f"By length: {sorted(words, key=len)}")

# By length, then alphabetically
print(f"Length then alpha: {sorted(words, key=lambda w: (len(w), w.lower()))}")`,
          description: "Sort with custom criteria",
        },
      ]),
      keyPoints: [
        "Sorting enables efficient searching",
        "Comparison-based sorts are O(n log n) minimum",
        "Stable sorts preserve order of equal elements",
        "In-place sorts use O(1) extra space",
        "Python's sorted() uses Timsort - O(n log n), stable",
      ],
      hardwareDemo: "Watch elements being compared and swapped. See how different algorithms move elements into sorted position.",
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 4,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_2_1.id,
        number: 1,
        title: "Python Sorting",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Use Python's sorting to sort numbers ascending and descending.",
        starterCode: `numbers = [64, 34, 25, 12, 22, 11, 90]

# Sort ascending
ascending = sorted(numbers)
print(f"Ascending: {ascending}")

# Sort descending
descending = sorted(numbers, reverse=True)
print(f"Descending: {descending}")`,
        solution: `numbers = [64, 34, 25, 12, 22, 11, 90]

ascending = sorted(numbers)
print(f"Ascending: {ascending}")

descending = sorted(numbers, reverse=True)
print(f"Descending: {descending}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Ascending: [11, 12, 22, 25, 34, 64, 90]\nDescending: [90, 64, 34, 25, 22, 12, 11]", description: "Both sorts work" },
        ]),
        hints: ["sorted() returns new list", "reverse=True for descending", "Original list unchanged"],
        xpReward: 10,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 10.2.1: Sorting Introduction");

  // ==================== LESSON 10.2.2: Selection Sort ====================
  const lesson10_2_2 = await prisma.lesson.upsert({
    where: { slug: "selection-sort" },
    update: {},
    create: {
      sectionId: section10_2.id,
      number: 10.22,
      title: "Selection Sort",
      slug: "selection-sort",
      objectives: [
        "Implement selection sort",
        "Understand the algorithm's approach",
        "Analyze O(n²) complexity",
        "Know when selection sort is appropriate",
      ],
      content: `# Selection Sort

**Selection sort** repeatedly finds the minimum element and moves it to the sorted portion.

## The Algorithm

1. Find the minimum element in unsorted portion
2. Swap it with the first unsorted element
3. Move the boundary between sorted/unsorted
4. Repeat until fully sorted

## Visual Example

\`\`\`
[64, 25, 12, 22, 11] → Find min (11)
[11, 25, 12, 22, 64] → Swap with first
[11, 25, 12, 22, 64] → Find min in rest (12)
[11, 12, 25, 22, 64] → Swap with second
[11, 12, 25, 22, 64] → Find min in rest (22)
[11, 12, 22, 25, 64] → Swap with third
[11, 12, 22, 25, 64] → Find min in rest (25)
[11, 12, 22, 25, 64] → Already in place
[11, 12, 22, 25, 64] → Done!
\`\`\`

## Implementation

\`\`\`python
def selection_sort(lst):
    for i in range(len(lst)):
        min_idx = i
        for j in range(i + 1, len(lst)):
            if lst[j] < lst[min_idx]:
                min_idx = j
        lst[i], lst[min_idx] = lst[min_idx], lst[i]
\`\`\`

## Complexity

- **Time**: O(n²) always (even if already sorted!)
- **Space**: O(1) - in-place
- **Comparisons**: n(n-1)/2

## When to Use

- Very small lists
- When memory writes are expensive (minimal swaps)
- Educational purposes`,
      codeExamples: JSON.stringify([
        {
          id: "selection-sort-impl",
          title: "Selection Sort Implementation",
          code: `def selection_sort(lst):
    arr = lst.copy()
    n = len(arr)
    
    for i in range(n):
        # Find minimum in unsorted portion
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        
        # Swap with first unsorted element
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    
    return arr

numbers = [64, 34, 25, 12, 22, 11, 90]
sorted_numbers = selection_sort(numbers)
print(f"Original: {numbers}")
print(f"Sorted: {sorted_numbers}")`,
          description: "Standard selection sort",
        },
        {
          id: "selection-sort-visual",
          title: "Selection Sort Visualized",
          code: `def selection_sort_visual(lst):
    arr = lst.copy()
    n = len(arr)
    
    for i in range(n):
        print(f"Pass {i + 1}: {arr}")
        print(f"  Sorted portion: {arr[:i]}")
        print(f"  Finding min in: {arr[i:]}")
        
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        
        print(f"  Min found: {arr[min_idx]} at index {min_idx}")
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
        print(f"  After swap: {arr}")
        print()
    
    return arr

numbers = [64, 25, 12, 22, 11]
selection_sort_visual(numbers)`,
          description: "Watch each step",
        },
        {
          id: "count-operations",
          title: "Counting Operations",
          code: `def selection_sort_counted(lst):
    arr = lst.copy()
    comparisons = 0
    swaps = 0
    
    for i in range(len(arr)):
        min_idx = i
        for j in range(i + 1, len(arr)):
            comparisons += 1
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            swaps += 1
    
    return arr, comparisons, swaps

for size in [10, 50, 100]:
    lst = list(range(size, 0, -1))  # Worst case
    _, comps, swaps = selection_sort_counted(lst)
    theoretical = size * (size - 1) // 2
    print(f"n={size}: {comps} comparisons (theory: {theoretical}), {swaps} swaps")`,
          description: "Verify O(n²) complexity",
        },
      ]),
      keyPoints: [
        "Find minimum, swap to front, repeat",
        "Time complexity: O(n²) always",
        "Space complexity: O(1) - in-place",
        "Minimal swaps (at most n)",
        "Simple but inefficient for large lists",
      ],
      hardwareDemo: "Watch the minimum-finding scan, then the swap. See the sorted portion grow from left to right.",
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 5,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_2_2.id,
        number: 1,
        title: "Implement Selection Sort",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Complete the selection sort implementation.",
        starterCode: `def selection_sort(lst):
    arr = lst.copy()
    n = len(arr)
    
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    
    return arr

numbers = [64, 34, 25, 12, 22, 11, 90]
print(selection_sort(numbers))`,
        solution: `def selection_sort(lst):
    arr = lst.copy()
    n = len(arr)
    
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    
    return arr

numbers = [64, 34, 25, 12, 22, 11, 90]
print(selection_sort(numbers))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "[11, 12, 22, 25, 34, 64, 90]", description: "Sorted correctly" },
        ]),
        hints: ["Find minimum in remaining portion", "Track min_idx, not min value", "Swap at end of inner loop"],
        xpReward: 25,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 10.2.2: Selection Sort");

  // ==================== LESSON 10.2.3: Merge Sort ====================
  const lesson10_2_3 = await prisma.lesson.upsert({
    where: { slug: "merge-sort" },
    update: {},
    create: {
      sectionId: section10_2.id,
      number: 10.23,
      title: "Merge Sort",
      slug: "merge-sort",
      objectives: [
        "Implement merge sort",
        "Understand divide and conquer strategy",
        "Analyze O(n log n) complexity",
        "Implement the merge operation",
      ],
      content: `# Merge Sort

**Merge sort** uses divide and conquer: split, sort halves, merge.

## The Strategy

1. **Divide**: Split list into two halves
2. **Conquer**: Recursively sort each half
3. **Combine**: Merge sorted halves

## Visual Example

\`\`\`
[38, 27, 43, 3, 9, 82, 10]
        ↓ Split
[38, 27, 43, 3]    [9, 82, 10]
    ↓                   ↓
[38, 27] [43, 3]  [9, 82] [10]
    ↓       ↓        ↓      ↓
[38][27] [43][3] [9][82]  [10]
    ↓       ↓        ↓
 [27, 38] [3, 43] [9, 82]
      ↓           ↓
  [3, 27, 38, 43] [9, 10, 82]
            ↓
   [3, 9, 10, 27, 38, 43, 82]
\`\`\`

## The Merge Operation

The key insight: merging two sorted lists is O(n):

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

## Complexity

- **Time**: O(n log n) always
- **Space**: O(n) for the merged arrays
- **Stable**: Yes (equal elements keep order)

## Why O(n log n)?

- log n levels of splitting
- O(n) work at each level (merging)
- Total: O(n log n)`,
      codeExamples: JSON.stringify([
        {
          id: "merge-sort-impl",
          title: "Merge Sort Implementation",
          code: `def merge_sort(lst):
    # Base case
    if len(lst) <= 1:
        return lst
    
    # Divide
    mid = len(lst) // 2
    left = merge_sort(lst[:mid])
    right = merge_sort(lst[mid:])
    
    # Conquer (merge)
    return merge(left, right)

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

numbers = [38, 27, 43, 3, 9, 82, 10]
print(f"Original: {numbers}")
print(f"Sorted: {merge_sort(numbers)}")`,
          description: "Complete merge sort",
        },
        {
          id: "merge-visual",
          title: "Merge Operation Visualized",
          code: `def merge_visual(left, right):
    print(f"Merging {left} and {right}")
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            print(f"  Take {left[i]} from left")
            result.append(left[i])
            i += 1
        else:
            print(f"  Take {right[j]} from right")
            result.append(right[j])
            j += 1
    
    if i < len(left):
        print(f"  Append remaining left: {left[i:]}")
        result.extend(left[i:])
    if j < len(right):
        print(f"  Append remaining right: {right[j:]}")
        result.extend(right[j:])
    
    print(f"Result: {result}")
    return result

merge_visual([1, 3, 5], [2, 4, 6])`,
          description: "Watch the merge process",
        },
        {
          id: "merge-sort-steps",
          title: "Merge Sort with Step Count",
          code: `def merge_sort_counted(lst, depth=0):
    indent = "  " * depth
    print(f"{indent}merge_sort({lst})")
    
    if len(lst) <= 1:
        return lst, 0
    
    mid = len(lst) // 2
    left, left_ops = merge_sort_counted(lst[:mid], depth + 1)
    right, right_ops = merge_sort_counted(lst[mid:], depth + 1)
    
    # Merge
    merged = []
    i = j = 0
    merge_ops = 0
    
    while i < len(left) and j < len(right):
        merge_ops += 1
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    
    merged.extend(left[i:])
    merged.extend(right[j:])
    
    total_ops = left_ops + right_ops + merge_ops
    print(f"{indent}→ {merged}")
    return merged, total_ops

numbers = [5, 2, 8, 1, 9, 3]
result, ops = merge_sort_counted(numbers)
print(f"Total comparisons: {ops}")`,
          description: "See the recursion tree",
        },
      ]),
      keyPoints: [
        "Divide and conquer: split, sort, merge",
        "Time complexity: O(n log n) always",
        "Space complexity: O(n) extra",
        "Stable sort",
        "Guaranteed performance (unlike quicksort)",
      ],
      hardwareDemo: "Watch the list split into smaller pieces, then merge back together. See how sorted subarrays combine.",
      estimatedTime: 22,
      difficulty: "INTERMEDIATE",
      order: 6,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_2_3.id,
        number: 1,
        title: "Implement Merge",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement the merge function that combines two sorted lists.",
        starterCode: `def merge(left, right):
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

print(merge([1, 3, 5], [2, 4, 6]))
print(merge([1, 2], [3, 4, 5, 6]))`,
        solution: `def merge(left, right):
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

print(merge([1, 3, 5], [2, 4, 6]))
print(merge([1, 2], [3, 4, 5, 6]))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "[1, 2, 3, 4, 5, 6]\n[1, 2, 3, 4, 5, 6]", description: "Merge works correctly" },
        ]),
        hints: ["Compare front elements", "Append smaller one", "Don't forget remaining elements"],
        xpReward: 25,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 10.2.3: Merge Sort");

  // ==================== LESSON 10.2.4: Comparing Sorting Algorithms ====================
  const lesson10_2_4 = await prisma.lesson.upsert({
    where: { slug: "comparing-sorts" },
    update: {},
    create: {
      sectionId: section10_2.id,
      number: 10.24,
      title: "Comparing Sorting Algorithms",
      slug: "comparing-sorts",
      objectives: [
        "Compare different sorting algorithms",
        "Understand time-space tradeoffs",
        "Choose the right sort for the situation",
        "Know what Python's sort uses",
      ],
      content: `# Comparing Sorting Algorithms

Different sorts excel in different situations.

## Summary Table

| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Selection | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Timsort | O(n) | O(n log n) | O(n log n) | O(n) | Yes |

## When to Use What

### Selection Sort
- Very small lists (n < 20)
- When swaps are expensive

### Insertion Sort
- Nearly sorted data (adaptive!)
- Small lists
- Online sorting (data arrives over time)

### Merge Sort
- Need guaranteed O(n log n)
- Need stable sort
- External sorting (files)

### Quick Sort
- General purpose (usually fastest)
- When average case matters more than worst

### Python's Timsort
- Best of both worlds
- Hybrid of merge sort + insertion sort
- Optimized for real-world data

## Practical Advice

1. **Use Python's built-in**: \`sorted()\` or \`.sort()\`
2. **Don't reinvent**: Built-in is highly optimized
3. **Know the algorithms**: For interviews and understanding`,
      codeExamples: JSON.stringify([
        {
          id: "timing-sorts",
          title: "Timing Different Sorts",
          code: `import time
import random

def selection_sort(lst):
    arr = lst.copy()
    for i in range(len(arr)):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

def merge_sort(lst):
    if len(lst) <= 1:
        return lst
    mid = len(lst) // 2
    left = merge_sort(lst[:mid])
    right = merge_sort(lst[mid:])
    return merge(left, right)

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

# Compare on 1000 elements
n = 1000
data = [random.randint(1, 10000) for _ in range(n)]

start = time.time()
selection_sort(data.copy())
sel_time = time.time() - start

start = time.time()
merge_sort(data.copy())
merge_time = time.time() - start

start = time.time()
sorted(data.copy())
py_time = time.time() - start

print(f"Sorting {n} elements:")
print(f"Selection sort: {sel_time:.4f}s")
print(f"Merge sort: {merge_time:.4f}s")
print(f"Python sorted(): {py_time:.6f}s")`,
          description: "Compare actual performance",
        },
        {
          id: "nearly-sorted",
          title: "Nearly Sorted Data",
          code: `import time

def insertion_sort(lst):
    arr = lst.copy()
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

# Nearly sorted data
n = 1000
nearly_sorted = list(range(n))
# Swap a few pairs
for _ in range(10):
    i = n // 2
    nearly_sorted[i], nearly_sorted[i+1] = nearly_sorted[i+1], nearly_sorted[i]

start = time.time()
insertion_sort(nearly_sorted.copy())
ins_time = time.time() - start

start = time.time()
sorted(nearly_sorted.copy())
py_time = time.time() - start

print(f"Nearly sorted {n} elements:")
print(f"Insertion sort: {ins_time:.4f}s")
print(f"Python sorted(): {py_time:.6f}s")
print("Insertion sort is fast for nearly sorted data!")`,
          description: "Some sorts adapt to input",
        },
      ]),
      keyPoints: [
        "O(n²) sorts: simple but slow for large data",
        "O(n log n) sorts: efficient for large data",
        "Insertion sort is fast for nearly sorted data",
        "Python's Timsort is highly optimized",
        "Usually just use sorted() or .sort()",
      ],
      hardwareDemo: "Compare operation counts for different sorts on the same data. See how O(n²) diverges from O(n log n) as size grows.",
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 7,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_2_4.id,
        number: 1,
        title: "Compare Operations",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate theoretical operations for each sort on different sizes.",
        starterCode: `import math

def compare_theoretical(n):
    selection = n * n
    merge = n * math.ceil(math.log2(n))
    return selection, merge

print("Size    | Selection O(n²) | Merge O(n log n)")
print("-" * 50)
for n in [100, 1000, 10000]:
    sel, mer = compare_theoretical(n)
    print(f"{n:>7} | {sel:>15,} | {mer:>15,}")`,
        solution: `import math

def compare_theoretical(n):
    selection = n * n
    merge = n * math.ceil(math.log2(n))
    return selection, merge

print("Size    | Selection O(n²) | Merge O(n log n)")
print("-" * 50)
for n in [100, 1000, 10000]:
    sel, mer = compare_theoretical(n)
    print(f"{n:>7} | {sel:>15,} | {mer:>15,}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Size    | Selection O(n²) | Merge O(n log n)\n--------------------------------------------------\n    100 |          10,000 |             700\n  1,000 |       1,000,000 |          10,000\n 10,000 |     100,000,000 |         140,000", description: "Shows complexity difference" },
        ]),
        hints: ["n² grows fast", "n log n grows slowly", "Huge difference at n=10000"],
        xpReward: 20,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 10.2.4: Comparing Sorting Algorithms");

  // ==================== LESSON 10.3.1: Hash Tables Introduction ====================
  const lesson10_3_1 = await prisma.lesson.upsert({
    where: { slug: "hash-tables-intro" },
    update: {},
    create: {
      sectionId: section10_3.id,
      number: 10.31,
      title: "Hash Tables Introduction",
      slug: "hash-tables-intro",
      objectives: [
        "Understand what hash tables are",
        "Know why hash tables are fast",
        "Understand key-value storage",
        "See the connection to Python dictionaries",
      ],
      content: `# Hash Tables Introduction

**Hash tables** provide near-instant O(1) lookup, insertion, and deletion.

## The Problem

How can we find data instantly without searching?

**Array approach**: Know the index → instant access
**But**: Keys aren't always integers 0, 1, 2, ...

## The Solution: Hash Tables

Convert any key to an array index using a **hash function**:

\`\`\`
key → hash function → index → value
\`\`\`

## How It Works

1. Take a key (e.g., "alice")
2. Hash it to get a number (e.g., 2)
3. Store/retrieve at that index

\`\`\`python
# Conceptually:
table = [None] * 10
index = hash("alice") % 10  # e.g., 2
table[index] = "Alice's data"
\`\`\`

## Why O(1)?

- Computing hash: O(1)
- Array access: O(1)
- Total: O(1)!

Compare to:
- List search: O(n)
- Binary search: O(log n)

## Python Dictionaries ARE Hash Tables

\`\`\`python
# This uses a hash table internally!
person = {"name": "Alice", "age": 30}
print(person["name"])  # O(1) lookup
\`\`\`

## The Challenge: Collisions

What if two keys hash to the same index?
→ That's called a **collision**, and we'll handle it soon.`,
      codeExamples: JSON.stringify([
        {
          id: "hash-concept",
          title: "Hash Table Concept",
          code: `# Simple hash table concept
class SimpleHashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [None] * size
    
    def _hash(self, key):
        # Simple hash: sum of character codes mod size
        return sum(ord(c) for c in str(key)) % self.size
    
    def put(self, key, value):
        index = self._hash(key)
        print(f"put('{key}'): hash={index}")
        self.table[index] = (key, value)
    
    def get(self, key):
        index = self._hash(key)
        if self.table[index]:
            return self.table[index][1]
        return None

ht = SimpleHashTable()
ht.put("name", "Alice")
ht.put("age", 30)
print(f"get('name'): {ht.get('name')}")`,
          description: "Basic hash table structure",
        },
        {
          id: "python-dict-speed",
          title: "Python Dict Speed",
          code: `import time

# Create large dict and list
n = 100000
my_dict = {f"key_{i}": i for i in range(n)}
my_list = list(range(n))

# Dict lookup (hash table) - O(1)
start = time.time()
for _ in range(1000):
    _ = my_dict["key_99999"]
dict_time = time.time() - start

# List search - O(n)
start = time.time()
for _ in range(1000):
    _ = 99999 in my_list
list_time = time.time() - start

print(f"1000 dict lookups: {dict_time:.4f}s")
print(f"1000 list searches: {list_time:.4f}s")
print(f"Dict is {list_time/dict_time:.0f}x faster!")`,
          description: "Hash tables are much faster",
        },
        {
          id: "python-hash",
          title: "Python's hash() Function",
          code: `# Python has built-in hash()
print(f"hash('hello'): {hash('hello')}")
print(f"hash('world'): {hash('world')}")
print(f"hash(42): {hash(42)}")
print(f"hash((1, 2, 3)): {hash((1, 2, 3))}")

# Same string always gives same hash
print(f"\\nhash('test') == hash('test'): {hash('test') == hash('test')}")

# Lists can't be hashed (they're mutable)
try:
    hash([1, 2, 3])
except TypeError as e:
    print(f"\\nCan't hash list: {e}")`,
          description: "Python's built-in hashing",
        },
      ]),
      keyPoints: [
        "Hash tables provide O(1) average lookup",
        "Hash function converts keys to array indices",
        "Python dicts are hash tables",
        "Much faster than searching lists",
        "Only hashable (immutable) keys allowed",
      ],
      hardwareDemo: "Watch the hash function compute an index, then see instant access to that memory location.",
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 8,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_3_1.id,
        number: 1,
        title: "Hash Function",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement a simple hash function that maps strings to indices.",
        starterCode: `def simple_hash(key, table_size):
    """Hash a string key to an index 0 to table_size-1"""
    total = sum(ord(c) for c in key)
    return total % table_size

# Test the hash function
keys = ["apple", "banana", "cherry", "date"]
for key in keys:
    index = simple_hash(key, 10)
    print(f"'{key}' -> index {index}")`,
        solution: `def simple_hash(key, table_size):
    total = sum(ord(c) for c in key)
    return total % table_size

keys = ["apple", "banana", "cherry", "date"]
for key in keys:
    index = simple_hash(key, 10)
    print(f"'{key}' -> index {index}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "'apple' -> index 0\n'banana' -> index 9\n'cherry' -> index 3\n'date' -> index 0", description: "Hash function works" },
        ]),
        hints: ["Sum character codes with ord()", "Use modulo for table size", "Same key always gives same index"],
        xpReward: 20,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 10.3.1: Hash Tables Introduction");

  // ==================== LESSON 10.3.2: Hash Functions ====================
  const lesson10_3_2 = await prisma.lesson.upsert({
    where: { slug: "hash-functions" },
    update: {},
    create: {
      sectionId: section10_3.id,
      number: 10.32,
      title: "Hash Functions",
      slug: "hash-functions",
      objectives: [
        "Understand properties of good hash functions",
        "Know common hash function techniques",
        "Understand hash distribution",
        "Know Python's hashing approach",
      ],
      content: `# Hash Functions

A **hash function** maps keys to array indices. Good hash functions are crucial!

## Properties of Good Hash Functions

1. **Deterministic**: Same key → same hash (always)
2. **Fast**: O(1) to compute
3. **Uniform**: Distributes keys evenly
4. **Minimize collisions**: Different keys → different hashes (ideally)

## Simple Hash Techniques

### Division Method
\`\`\`python
def hash_division(key, size):
    return key % size
\`\`\`

### String Hashing
\`\`\`python
def hash_string(s, size):
    h = 0
    for char in s:
        h = (h * 31 + ord(char)) % size
    return h
\`\`\`

The multiplier (31) helps spread out similar strings.

## Why Distribution Matters

Bad distribution → many collisions → slow lookups!

\`\`\`python
# Bad hash: always returns 0
def bad_hash(key, size):
    return 0  # Everything goes to index 0!
\`\`\`

## Python's Hash Function

Python uses sophisticated hashing:
- Integers hash to themselves (mostly)
- Strings use SipHash (security + distribution)
- Custom objects can define \`__hash__\`

\`\`\`python
hash("hello")  # Large integer
hash(42)       # 42
\`\`\`

## Hash Table Size

Common practice: use prime number size
- Helps distribute keys more evenly
- Reduces patterns in collision behavior`,
      codeExamples: JSON.stringify([
        {
          id: "hash-distribution",
          title: "Hash Distribution",
          code: `def hash_string(s, size):
    """Better hash using polynomial rolling"""
    h = 0
    for char in s:
        h = (h * 31 + ord(char)) % size
    return h

# Check distribution
size = 10
buckets = [0] * size

words = ["apple", "banana", "cherry", "date", "elderberry",
         "fig", "grape", "honeydew", "kiwi", "lemon"]

print("Word → Index")
for word in words:
    idx = hash_string(word, size)
    buckets[idx] += 1
    print(f"{word:12} → {idx}")

print(f"\\nBucket counts: {buckets}")`,
          description: "See how keys distribute",
        },
        {
          id: "good-vs-bad",
          title: "Good vs Bad Hash",
          code: `def bad_hash(key, size):
    """Terrible hash - always same bucket!"""
    return 0

def okay_hash(key, size):
    """Simple but works"""
    return sum(ord(c) for c in key) % size

def good_hash(key, size):
    """Better distribution"""
    h = 0
    for c in key:
        h = (h * 31 + ord(c)) % size
    return h

words = ["cat", "act", "tac", "dog", "god"]
size = 10

print("Word | Bad | Okay | Good")
for word in words:
    print(f"{word:4} | {bad_hash(word, size):3} | {okay_hash(word, size):4} | {good_hash(word, size):4}")

# Note: "cat", "act", "tac" are anagrams - okay_hash gives same value!`,
          description: "Compare hash quality",
        },
        {
          id: "python-hashing",
          title: "Python's Built-in Hashing",
          code: `# Integers hash to themselves (usually)
print(f"hash(42) = {hash(42)}")
print(f"hash(-1) = {hash(-1)}")

# Strings get complex hashes
print(f"hash('a') = {hash('a')}")
print(f"hash('b') = {hash('b')}")
print(f"hash('hello') = {hash('hello')}")

# Tuples can be hashed
print(f"hash((1, 2, 3)) = {hash((1, 2, 3))}")

# Custom class with __hash__
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __hash__(self):
        return hash((self.x, self.y))

p = Point(3, 4)
print(f"hash(Point(3,4)) = {hash(p)}")`,
          description: "Python's hash function",
        },
      ]),
      keyPoints: [
        "Good hashes are deterministic and uniform",
        "Polynomial hashing handles similar strings well",
        "Poor distribution leads to many collisions",
        "Prime table sizes help distribution",
        "Python objects need __hash__ to be dictionary keys",
      ],
      hardwareDemo: "Watch hash values being computed. See how good hash functions spread keys across buckets while bad ones cluster.",
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 9,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_3_2.id,
        number: 1,
        title: "Better Hash Function",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement polynomial hash that handles anagrams differently.",
        starterCode: `def poly_hash(s, size):
    """Polynomial rolling hash"""
    h = 0
    for char in s:
        h = (h * 31 + ord(char)) % size
    return h

# Test with anagrams
anagrams = ["cat", "act", "tac"]
for word in anagrams:
    print(f"'{word}' -> {poly_hash(word, 100)}")`,
        solution: `def poly_hash(s, size):
    h = 0
    for char in s:
        h = (h * 31 + ord(char)) % size
    return h

anagrams = ["cat", "act", "tac"]
for word in anagrams:
    print(f"'{word}' -> {poly_hash(word, 100)}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "'cat' -> 98260\n'act' -> 96352\n'tac' -> 14", description: "Different hashes for anagrams" },
        ]),
        hints: ["Multiply by 31 each iteration", "Position matters now", "Anagrams get different values"],
        xpReward: 20,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 10.3.2: Hash Functions");

  // ==================== LESSON 10.3.3: Collision Handling ====================
  const lesson10_3_3 = await prisma.lesson.upsert({
    where: { slug: "collision-handling" },
    update: {},
    create: {
      sectionId: section10_3.id,
      number: 10.33,
      title: "Collision Handling",
      slug: "collision-handling",
      objectives: [
        "Understand why collisions occur",
        "Implement chaining for collision resolution",
        "Understand open addressing",
        "Know the impact of load factor",
      ],
      content: `# Collision Handling

A **collision** occurs when two different keys hash to the same index.

## Why Collisions Are Inevitable

Pigeonhole principle: If you have more keys than slots, collisions MUST happen.

Even with fewer keys, probability of collision is high (birthday paradox).

## Strategy 1: Chaining

Store multiple items at each index using a linked list:

\`\`\`
Index 0: → ("apple", 1) → ("date", 4)
Index 1: → ("banana", 2)
Index 2: → ("cherry", 3)
\`\`\`

### Chaining Operations
- **Insert**: Hash key, append to list at that index
- **Find**: Hash key, search the list
- **Delete**: Hash key, remove from list

### Chaining Performance
- Average list length: n/m (load factor)
- With good hash: O(1) average
- Worst case: O(n) if all keys collide

## Strategy 2: Open Addressing

Find another empty slot when collision occurs:

### Linear Probing
Try index, index+1, index+2, ...

### Quadratic Probing
Try index, index+1², index+2², ...

### Double Hashing
Try index, index+hash2(key), index+2*hash2(key), ...

## Load Factor

\`\`\`
load factor = n/m = items / table size
\`\`\`

- Low load factor (< 0.5): Few collisions, fast
- High load factor (> 0.75): Many collisions, slow

Solution: **Resize** (double table size) when load factor gets high.`,
      codeExamples: JSON.stringify([
        {
          id: "chaining-impl",
          title: "Hash Table with Chaining",
          code: `class HashTableChaining:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]
        self.count = 0
    
    def _hash(self, key):
        return hash(key) % self.size
    
    def put(self, key, value):
        index = self._hash(key)
        # Check if key exists
        for i, (k, v) in enumerate(self.table[index]):
            if k == key:
                self.table[index][i] = (key, value)
                return
        # Add new key-value pair
        self.table[index].append((key, value))
        self.count += 1
    
    def get(self, key):
        index = self._hash(key)
        for k, v in self.table[index]:
            if k == key:
                return v
        return None
    
    def show(self):
        for i, bucket in enumerate(self.table):
            if bucket:
                print(f"Index {i}: {bucket}")

ht = HashTableChaining(5)
ht.put("apple", 1)
ht.put("banana", 2)
ht.put("cherry", 3)
ht.put("date", 4)
ht.put("elderberry", 5)

ht.show()
print(f"get('cherry'): {ht.get('cherry')}")`,
          description: "Chaining resolves collisions with lists",
        },
        {
          id: "linear-probing",
          title: "Linear Probing",
          code: `class HashTableLinearProbing:
    def __init__(self, size=10):
        self.size = size
        self.keys = [None] * size
        self.values = [None] * size
    
    def _hash(self, key):
        return hash(key) % self.size
    
    def put(self, key, value):
        index = self._hash(key)
        original = index
        
        while self.keys[index] is not None:
            if self.keys[index] == key:
                self.values[index] = value
                return
            index = (index + 1) % self.size  # Linear probe
            if index == original:
                raise Exception("Hash table full!")
        
        self.keys[index] = key
        self.values[index] = value
        print(f"put('{key}'): hash={original}, stored at {index}")
    
    def get(self, key):
        index = self._hash(key)
        original = index
        
        while self.keys[index] is not None:
            if self.keys[index] == key:
                return self.values[index]
            index = (index + 1) % self.size
            if index == original:
                break
        return None

ht = HashTableLinearProbing(7)
ht.put("apple", 1)
ht.put("banana", 2)
ht.put("cherry", 3)`,
          description: "Linear probing finds next empty slot",
        },
        {
          id: "load-factor",
          title: "Load Factor Impact",
          code: `import random
import time

class SimpleHashTable:
    def __init__(self, size):
        self.size = size
        self.table = [[] for _ in range(size)]
        self.count = 0
    
    def put(self, key, value):
        index = hash(key) % self.size
        self.table[index].append((key, value))
        self.count += 1
    
    def get(self, key):
        index = hash(key) % self.size
        for k, v in self.table[index]:
            if k == key:
                return v
        return None
    
    def avg_chain_length(self):
        non_empty = [len(b) for b in self.table if b]
        return sum(non_empty) / len(non_empty) if non_empty else 0

# Compare different load factors
for size in [100, 50, 20, 10]:
    ht = SimpleHashTable(size)
    for i in range(50):
        ht.put(f"key_{i}", i)
    
    load = ht.count / size
    avg_chain = ht.avg_chain_length()
    print(f"Size {size:3}, Load {load:.2f}: avg chain = {avg_chain:.2f}")`,
          description: "Higher load = longer chains",
        },
      ]),
      keyPoints: [
        "Collisions are inevitable with hashing",
        "Chaining: store lists at each index",
        "Open addressing: find next empty slot",
        "Load factor affects performance",
        "Resize when load factor > 0.75",
      ],
      hardwareDemo: "Watch collisions occur and see how chaining stores multiple items at one index, or how probing finds the next empty slot.",
      estimatedTime: 20,
      difficulty: "INTERMEDIATE",
      order: 10,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_3_3.id,
        number: 1,
        title: "Implement Chaining",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Complete the hash table with chaining.",
        starterCode: `class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]
    
    def _hash(self, key):
        return hash(key) % self.size
    
    def put(self, key, value):
        index = self._hash(key)
        for i, (k, v) in enumerate(self.table[index]):
            if k == key:
                self.table[index][i] = (key, value)
                return
        self.table[index].append((key, value))
    
    def get(self, key):
        index = self._hash(key)
        for k, v in self.table[index]:
            if k == key:
                return v
        return None

ht = HashTable(5)
ht.put("a", 1)
ht.put("b", 2)
ht.put("c", 3)
print(ht.get("a"))
print(ht.get("b"))
print(ht.get("d"))`,
        solution: `class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]
    
    def _hash(self, key):
        return hash(key) % self.size
    
    def put(self, key, value):
        index = self._hash(key)
        for i, (k, v) in enumerate(self.table[index]):
            if k == key:
                self.table[index][i] = (key, value)
                return
        self.table[index].append((key, value))
    
    def get(self, key):
        index = self._hash(key)
        for k, v in self.table[index]:
            if k == key:
                return v
        return None

ht = HashTable(5)
ht.put("a", 1)
ht.put("b", 2)
ht.put("c", 3)
print(ht.get("a"))
print(ht.get("b"))
print(ht.get("d"))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "1\n2\nNone", description: "Chaining works" },
        ]),
        hints: ["Each bucket is a list", "Search list for key on get", "Append to list on put"],
        xpReward: 30,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 10.3.3: Collision Handling");

  // ==================== LESSON 10.3.4: Python Dictionaries ====================
  const lesson10_3_4 = await prisma.lesson.upsert({
    where: { slug: "python-dict-impl" },
    update: {},
    create: {
      sectionId: section10_3.id,
      number: 10.34,
      title: "Python Dictionaries Implementation",
      slug: "python-dict-impl",
      objectives: [
        "Understand how Python dicts work internally",
        "Know the requirements for dictionary keys",
        "Understand dictionary ordering",
        "Use dictionaries effectively",
      ],
      content: `# Python Dictionaries Implementation

Python's \`dict\` is a highly optimized hash table implementation.

## Internal Structure

Python 3.7+ dictionaries:
1. **Hash table** for fast lookup
2. **Compact array** to store entries
3. **Maintains insertion order**

## Key Requirements

To be a dictionary key, an object must be:
1. **Hashable**: Has \`__hash__\` method
2. **Immutable**: Hash shouldn't change

\`\`\`python
# These work as keys (immutable)
d[42] = "int"
d["hello"] = "string"
d[(1, 2)] = "tuple"

# These DON'T work (mutable)
d[[1, 2]] = "list"  # Error!
d[{1, 2}] = "set"   # Error!
\`\`\`

## Performance

| Operation | Average | Worst |
|-----------|---------|-------|
| Get | O(1) | O(n) |
| Set | O(1) | O(n) |
| Delete | O(1) | O(n) |
| Iterate | O(n) | O(n) |

Worst case only with pathological hash collisions.

## Memory Usage

Dicts are memory-efficient but not free:
- Each entry: key, value, hash
- Table overhead: ~30% empty for performance

## When to Use Dicts

✅ **Perfect for**:
- Fast key-value lookup
- Counting occurrences
- Grouping data
- Caching/memoization

❌ **Not ideal for**:
- Ordered sequences (use list)
- Small fixed structures (use tuple/namedtuple)`,
      codeExamples: JSON.stringify([
        {
          id: "dict-operations",
          title: "Dictionary Operations",
          code: `# All O(1) average time!

# Create
d = {"a": 1, "b": 2, "c": 3}

# Get
print(f"d['a'] = {d['a']}")
print(f"d.get('z', 'default') = {d.get('z', 'default')}")

# Set
d["d"] = 4
print(f"After adding 'd': {d}")

# Delete
del d["a"]
print(f"After deleting 'a': {d}")

# Check membership
print(f"'b' in d: {'b' in d}")
print(f"'a' in d: {'a' in d}")`,
          description: "O(1) dictionary operations",
        },
        {
          id: "hashable-keys",
          title: "What Can Be Keys?",
          code: `# Hashable types work as keys
d = {}

d[42] = "integer key"
d["hello"] = "string key"
d[(1, 2, 3)] = "tuple key"
d[frozenset([1, 2])] = "frozenset key"

print("Valid keys added successfully")
for key in d:
    print(f"  {type(key).__name__}: {key}")

# Unhashable types fail
try:
    d[[1, 2]] = "list key"
except TypeError as e:
    print(f"\\nCannot use list: {e}")

try:
    d[{1, 2}] = "set key"
except TypeError as e:
    print(f"Cannot use set: {e}")`,
          description: "Keys must be hashable",
        },
        {
          id: "dict-patterns",
          title: "Common Dictionary Patterns",
          code: `# Counting
words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
print(f"Counts: {counts}")

# Grouping
students = [
    ("Alice", "A"),
    ("Bob", "B"),
    ("Charlie", "A"),
    ("David", "B"),
]
by_grade = {}
for name, grade in students:
    if grade not in by_grade:
        by_grade[grade] = []
    by_grade[grade].append(name)
print(f"By grade: {by_grade}")

# Caching (memoization)
cache = {}
def expensive_computation(n):
    if n in cache:
        return cache[n]
    result = n ** 2  # Pretend this is slow
    cache[n] = result
    return result`,
          description: "Practical dictionary uses",
        },
      ]),
      keyPoints: [
        "Python dicts are hash tables",
        "O(1) average for get/set/delete",
        "Keys must be hashable (immutable)",
        "Maintains insertion order (Python 3.7+)",
        "Perfect for counting, grouping, caching",
      ],
      hardwareDemo: "See Python's optimized hash table structure. Watch how dictionary operations access the hash table and resolve collisions.",
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 11,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_3_4.id,
        number: 1,
        title: "Word Counter",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use a dictionary to count word occurrences.",
        starterCode: `def count_words(text):
    words = text.lower().split()
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts

text = "the quick brown fox jumps over the lazy dog the fox"
result = count_words(text)
for word, count in sorted(result.items()):
    print(f"{word}: {count}")`,
        solution: `def count_words(text):
    words = text.lower().split()
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts

text = "the quick brown fox jumps over the lazy dog the fox"
result = count_words(text)
for word, count in sorted(result.items()):
    print(f"{word}: {count}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "brown: 1\ndog: 1\nfox: 2\njumps: 1\nlazy: 1\nover: 1\nquick: 1\nthe: 3", description: "Counts words correctly" },
        ]),
        hints: ["Split text into words", "Use .get(word, 0) for default", "Increment count for each word"],
        xpReward: 20,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 10.3.4: Python Dictionaries");

  // Summary
  const lessonCount = await prisma.lesson.count({ where: { section: { chapter: { number: 10 } } } });
  const exerciseCount = await prisma.exercise.count({ where: { lesson: { section: { chapter: { number: 10 } } } } });

  console.log("\n📊 Chapter 10 Summary:");
  console.log(`   Lessons: ${lessonCount}`);
  console.log(`   Exercises: ${exerciseCount}`);
  console.log("\n🌱 Chapter 10 seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
