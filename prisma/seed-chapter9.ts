import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Chapter 9: Algorithmic Complexity...");

  // Create Chapter 9
  const chapter9 = await prisma.chapter.upsert({
    where: { number: 9 },
    update: {},
    create: {
      number: 9,
      title: "A Simplistic Introduction to Algorithmic Complexity",
      description: "Learn to analyze algorithm efficiency using Big O notation and understand the importance of choosing the right algorithm.",
      objectives: [
        "Understand why algorithm efficiency matters",
        "Use Big O notation to describe complexity",
        "Recognize common complexity classes",
        "Analyze code to determine its complexity",
        "Choose appropriate algorithms for different situations",
      ],
      isPublished: true,
    },
  });

  console.log("✅ Created Chapter 9:", chapter9.title);

  // Create Sections
  const section9_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter9.id, number: 9.1 } },
    update: {},
    create: {
      chapterId: chapter9.id,
      number: 9.1,
      title: "Thinking About Computational Complexity",
      description: "Why efficiency matters and how to think about it",
      order: 1,
    },
  });

  const section9_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter9.id, number: 9.2 } },
    update: {},
    create: {
      chapterId: chapter9.id,
      number: 9.2,
      title: "Asymptotic Notation",
      description: "Big O and analyzing growth rates",
      order: 2,
    },
  });

  const section9_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter9.id, number: 9.3 } },
    update: {},
    create: {
      chapterId: chapter9.id,
      number: 9.3,
      title: "Important Complexity Classes",
      description: "Common patterns and their implications",
      order: 3,
    },
  });

  // ==================== LESSON 9.1.1: Why Complexity Matters ====================
  const lesson9_1_1 = await prisma.lesson.upsert({
    where: { slug: "why-complexity-matters" },
    update: {},
    create: {
      sectionId: section9_1.id,
      number: 9.11,
      title: "Why Complexity Matters",
      slug: "why-complexity-matters",
      objectives: [
        "Understand why algorithm efficiency is important",
        "See how small differences become huge at scale",
        "Recognize that not all correct solutions are equal",
        "Think about scalability",
      ],
      content: `# Why Complexity Matters

Two programs can produce the same correct output, but one might take seconds while the other takes years.

## A Simple Example

Find if a number is in a list:

**Approach 1**: Check every element
\`\`\`python
def find_linear(lst, target):
    for item in lst:
        if item == target:
            return True
    return False
\`\`\`

**Approach 2**: If sorted, use binary search
\`\`\`python
def find_binary(sorted_lst, target):
    low, high = 0, len(sorted_lst) - 1
    while low <= high:
        mid = (low + high) // 2
        if sorted_lst[mid] == target:
            return True
        elif sorted_lst[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return False
\`\`\`

## The Difference at Scale

| List Size | Linear Search | Binary Search |
|-----------|---------------|---------------|
| 100 | 100 checks | 7 checks |
| 10,000 | 10,000 checks | 14 checks |
| 1,000,000 | 1,000,000 checks | 20 checks |
| 1,000,000,000 | 1,000,000,000 checks | 30 checks |

## Real-World Impact

- Google searches billions of pages in < 1 second
- Bad algorithms make applications unusable
- Efficient algorithms save computing resources (and money!)

## The Key Question

> "How does the running time grow as the input size grows?"

This is what **algorithmic complexity** measures.`,
      codeExamples: JSON.stringify([
        {
          id: "linear-vs-binary",
          title: "Linear vs Binary Search",
          code: `def linear_search(lst, target):
    steps = 0
    for item in lst:
        steps += 1
        if item == target:
            return steps
    return steps

def binary_search(sorted_lst, target):
    steps = 0
    low, high = 0, len(sorted_lst) - 1
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        if sorted_lst[mid] == target:
            return steps
        elif sorted_lst[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return steps

# Compare for different sizes
for size in [100, 1000, 10000]:
    lst = list(range(size))
    target = size - 1  # Worst case: last element
    
    linear_steps = linear_search(lst, target)
    binary_steps = binary_search(lst, target)
    
    print(f"Size {size}: Linear={linear_steps}, Binary={binary_steps}")`,
          description: "Count steps for each approach",
        },
        {
          id: "timing-difference",
          title: "Timing the Difference",
          code: `import time

def slow_sum(n):
    """Sum 1 to n by adding one at a time"""
    total = 0
    for i in range(1, n + 1):
        total += i
    return total

def fast_sum(n):
    """Sum 1 to n using formula"""
    return n * (n + 1) // 2

n = 10000000

start = time.time()
result1 = slow_sum(n)
slow_time = time.time() - start

start = time.time()
result2 = fast_sum(n)
fast_time = time.time() - start

print(f"Slow sum: {slow_time:.4f} seconds")
print(f"Fast sum: {fast_time:.6f} seconds")
print(f"Same result: {result1 == result2}")`,
          description: "Same result, very different time",
        },
      ]),
      keyPoints: [
        "Correct isn't enough - efficiency matters",
        "Small differences become huge at scale",
        "Algorithm choice can mean seconds vs years",
        "Complexity measures how time grows with input",
        "Always think: 'What if input is 1000x larger?'",
      ],
      hardwareDemo: "Watch the step counter for both algorithms. See how linear search counts up to n, while binary search only counts to log(n).",
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
        lessonId: lesson9_1_1.id,
        number: 1,
        title: "Count Operations",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Run this code to see how many operations each approach uses for different input sizes.",
        starterCode: `def count_linear(n):
    """Count operations in linear search pattern"""
    count = 0
    for i in range(n):
        count += 1
    return count

def count_binary_pattern(n):
    """Count operations in binary search pattern"""
    count = 0
    remaining = n
    while remaining > 1:
        count += 1
        remaining = remaining // 2
    return count

for n in [10, 100, 1000, 10000]:
    linear = count_linear(n)
    binary = count_binary_pattern(n)
    print(f"n={n}: Linear={linear}, Binary-pattern={binary}")`,
        solution: `def count_linear(n):
    count = 0
    for i in range(n):
        count += 1
    return count

def count_binary_pattern(n):
    count = 0
    remaining = n
    while remaining > 1:
        count += 1
        remaining = remaining // 2
    return count

for n in [10, 100, 1000, 10000]:
    linear = count_linear(n)
    binary = count_binary_pattern(n)
    print(f"n={n}: Linear={linear}, Binary-pattern={binary}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "n=10: Linear=10, Binary-pattern=3\nn=100: Linear=100, Binary-pattern=6\nn=1000: Linear=1000, Binary-pattern=9\nn=10000: Linear=10000, Binary-pattern=13", description: "Shows growth difference" },
        ]),
        hints: ["Linear grows with n", "Binary pattern grows much slower", "Notice the huge difference at n=10000"],
        xpReward: 15,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 9.1.1: Why Complexity Matters");

  // ==================== LESSON 9.1.2: Measuring Algorithm Efficiency ====================
  const lesson9_1_2 = await prisma.lesson.upsert({
    where: { slug: "measuring-efficiency" },
    update: {},
    create: {
      sectionId: section9_1.id,
      number: 9.12,
      title: "Measuring Algorithm Efficiency",
      slug: "measuring-efficiency",
      objectives: [
        "Understand different ways to measure efficiency",
        "Know why we count operations instead of time",
        "Consider best, worst, and average cases",
        "Think about space as well as time",
      ],
      content: `# Measuring Algorithm Efficiency

How do we objectively compare algorithms?

## Why Not Just Time It?

Timing is problematic:
- Different computers = different times
- Same computer, different loads = different times
- Implementation details affect time
- Language choice affects time

## Count Operations Instead

Count the fundamental operations:
- Comparisons
- Assignments
- Arithmetic operations
- Array accesses

This is independent of hardware!

## Best, Worst, and Average Cases

\`\`\`python
def find(lst, target):
    for i, item in enumerate(lst):
        if item == target:
            return i
    return -1
\`\`\`

- **Best case**: Target is first element → 1 comparison
- **Worst case**: Target is last or not there → n comparisons
- **Average case**: About n/2 comparisons

We usually focus on **worst case** - it's guaranteed.

## Time vs Space

**Time complexity**: How many operations?
**Space complexity**: How much memory?

Sometimes you trade one for the other:
- Caching: More space, less time
- Recomputing: Less space, more time

## The Input Size: n

We express complexity in terms of input size **n**:
- For a list: n = number of elements
- For a string: n = number of characters
- For a number: n = number of digits (or the number itself)`,
      codeExamples: JSON.stringify([
        {
          id: "counting-operations",
          title: "Counting Operations",
          code: `def sum_list(numbers):
    total = 0        # 1 assignment
    for num in numbers:  # n iterations
        total += num     # 1 add + 1 assign per iteration
    return total     # 1 return

# For n=5: 1 + 5*(2) + 1 = 12 operations
# For n=100: 1 + 100*(2) + 1 = 202 operations
# Pattern: approximately 2n operations

numbers = [1, 2, 3, 4, 5]
result = sum_list(numbers)
print(f"Sum: {result}")
print(f"Operations: approximately {2 * len(numbers)}")`,
          description: "Count each operation",
        },
        {
          id: "best-worst-average",
          title: "Best, Worst, Average Cases",
          code: `def find_element(lst, target):
    comparisons = 0
    for i, item in enumerate(lst):
        comparisons += 1
        if item == target:
            return i, comparisons
    return -1, comparisons

numbers = list(range(100))

# Best case: target is first
_, best = find_element(numbers, 0)

# Worst case: target is last
_, worst = find_element(numbers, 99)

# Average case: target in middle
_, average = find_element(numbers, 50)

print(f"Best case: {best} comparisons")
print(f"Worst case: {worst} comparisons")
print(f"Average case: {average} comparisons")`,
          description: "Same algorithm, different scenarios",
        },
        {
          id: "space-time-tradeoff",
          title: "Space-Time Tradeoff",
          code: `# Approach 1: Recompute each time (less space, more time)
def fibonacci_recompute(n):
    if n <= 1:
        return n
    return fibonacci_recompute(n-1) + fibonacci_recompute(n-2)

# Approach 2: Cache results (more space, less time)
def fibonacci_cached(n, cache={}):
    if n in cache:
        return cache[n]
    if n <= 1:
        return n
    cache[n] = fibonacci_cached(n-1, cache) + fibonacci_cached(n-2, cache)
    return cache[n]

import time

n = 30
start = time.time()
result1 = fibonacci_recompute(n)
time1 = time.time() - start

start = time.time()
result2 = fibonacci_cached(n)
time2 = time.time() - start

print(f"Recompute: {time1:.4f}s")
print(f"Cached: {time2:.6f}s")`,
          description: "Trade space for time",
        },
      ]),
      keyPoints: [
        "Count operations, not wall-clock time",
        "Focus on worst case (guaranteed upper bound)",
        "Express in terms of input size n",
        "Consider both time and space complexity",
        "Sometimes trade space for time or vice versa",
      ],
      hardwareDemo: "Watch operation counter increment. See how best/worst cases take different numbers of steps for the same algorithm.",
      estimatedTime: 18,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson9_1_2.id,
        number: 1,
        title: "Count the Operations",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add operation counting to see how many steps the function takes.",
        starterCode: `def find_max(numbers):
    operations = 0
    
    max_val = numbers[0]
    operations += 1  # assignment
    
    for num in numbers[1:]:
        operations += 1  # comparison
        if num > max_val:
            max_val = num
            operations += 1  # assignment
    
    return max_val, operations

numbers = [3, 7, 2, 9, 1, 5, 8, 4, 6]
result, ops = find_max(numbers)
print(f"Max: {result}")
print(f"Operations: {ops}")`,
        solution: `def find_max(numbers):
    operations = 0
    
    max_val = numbers[0]
    operations += 1
    
    for num in numbers[1:]:
        operations += 1
        if num > max_val:
            max_val = num
            operations += 1
    
    return max_val, operations

numbers = [3, 7, 2, 9, 1, 5, 8, 4, 6]
result, ops = find_max(numbers)
print(f"Max: {result}")
print(f"Operations: {ops}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Max: 9\nOperations: 11", description: "Operations counted" },
        ]),
        hints: ["Count assignments and comparisons", "Loop runs n-1 times", "Conditional assignment only sometimes"],
        xpReward: 20,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 9.1.2: Measuring Algorithm Efficiency");

  // ==================== LESSON 9.2.1: Introduction to Big O ====================
  const lesson9_2_1 = await prisma.lesson.upsert({
    where: { slug: "intro-big-o" },
    update: {},
    create: {
      sectionId: section9_2.id,
      number: 9.21,
      title: "Introduction to Big O",
      slug: "intro-big-o",
      objectives: [
        "Understand Big O notation",
        "Know why we drop constants and lower terms",
        "Read and write Big O expressions",
        "Compare algorithms using Big O",
      ],
      content: `# Introduction to Big O

**Big O notation** describes how an algorithm's time (or space) grows as input size grows.

## The Notation

O(f(n)) means "order of f(n)" or "grows like f(n)"

Examples:
- O(1) - constant time
- O(n) - linear time
- O(n²) - quadratic time
- O(log n) - logarithmic time

## Why Drop Constants?

\`\`\`python
# Both are O(n):
# 2n + 5 operations → O(n)
# 100n + 1000 operations → O(n)
\`\`\`

Why? At large n, constants don't matter:
- n = 1,000,000: 2n = 2,000,000 vs 100n = 100,000,000
- But n² = 1,000,000,000,000 dwarfs both!

## Drop Lower-Order Terms

\`\`\`python
# n² + n + 1 → O(n²)
# n dominates at large n
\`\`\`

At n = 1000:
- n² = 1,000,000
- n = 1,000 (0.1% of n²)
- 1 = 1 (basically nothing)

## How to Find Big O

1. Count operations in terms of n
2. Drop constants
3. Keep only highest-order term

Example:
\`\`\`python
for i in range(n):      # n times
    for j in range(n):  # n times
        print(i, j)     # 1 operation

# n * n * 1 = n² → O(n²)
\`\`\`

## Comparing Big O

O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)`,
      codeExamples: JSON.stringify([
        {
          id: "constant-time",
          title: "O(1) - Constant Time",
          code: `def get_first(lst):
    return lst[0]  # Always 1 operation

def get_last(lst):
    return lst[-1]  # Always 1 operation

# Doesn't matter if list has 10 or 10 million items
small = list(range(10))
large = list(range(10000000))

print(f"First of small: {get_first(small)}")
print(f"First of large: {get_first(large)}")
# Both take the same time!`,
          description: "Same time regardless of size",
        },
        {
          id: "linear-time",
          title: "O(n) - Linear Time",
          code: `def find_sum(numbers):
    total = 0
    for num in numbers:  # n iterations
        total += num     # 1 operation each
    return total

# Time grows linearly with size
for size in [100, 1000, 10000]:
    lst = list(range(size))
    result = find_sum(lst)
    print(f"Sum of {size} numbers: {result}")`,
          description: "Time proportional to input size",
        },
        {
          id: "quadratic-time",
          title: "O(n²) - Quadratic Time",
          code: `def all_pairs(lst):
    count = 0
    for i in range(len(lst)):
        for j in range(len(lst)):
            count += 1
    return count

# Time grows as square of size
for size in [10, 100, 1000]:
    lst = list(range(size))
    pairs = all_pairs(lst)
    print(f"n={size}: {pairs} pairs (n²={size**2})")`,
          description: "Time grows with square of input",
        },
      ]),
      keyPoints: [
        "Big O describes growth rate, not exact count",
        "Drop constants: 2n → O(n)",
        "Drop lower terms: n² + n → O(n²)",
        "Focus on behavior as n gets large",
        "O(1) < O(log n) < O(n) < O(n²) < O(2ⁿ)",
      ],
      hardwareDemo: "Watch how operations scale with different Big O classes. See the dramatic difference between O(n) and O(n²) as n grows.",
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson9_2_1.id,
        number: 1,
        title: "Identify Big O",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "This function is O(n). Run it to see linear growth.",
        starterCode: `def linear_example(n):
    count = 0
    for i in range(n):
        count += 1
    return count

# See linear growth
for n in [10, 100, 1000]:
    ops = linear_example(n)
    print(f"n={n}: {ops} operations")`,
        solution: `def linear_example(n):
    count = 0
    for i in range(n):
        count += 1
    return count

for n in [10, 100, 1000]:
    ops = linear_example(n)
    print(f"n={n}: {ops} operations")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "n=10: 10 operations\nn=100: 100 operations\nn=1000: 1000 operations", description: "Linear growth shown" },
        ]),
        hints: ["One loop through n items", "Each iteration is constant work", "Total: n operations = O(n)"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson9_2_1.id,
        number: 2,
        title: "Quadratic Growth",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "This function is O(n²). See how fast it grows.",
        starterCode: `def quadratic_example(n):
    count = 0
    for i in range(n):
        for j in range(n):
            count += 1
    return count

for n in [10, 50, 100]:
    ops = quadratic_example(n)
    print(f"n={n}: {ops} operations")`,
        solution: `def quadratic_example(n):
    count = 0
    for i in range(n):
        for j in range(n):
            count += 1
    return count

for n in [10, 50, 100]:
    ops = quadratic_example(n)
    print(f"n={n}: {ops} operations")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "n=10: 100 operations\nn=50: 2500 operations\nn=100: 10000 operations", description: "Quadratic growth" },
        ]),
        hints: ["Nested loops: n * n", "10² = 100, 50² = 2500", "Grows much faster than linear"],
        xpReward: 20,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 9.2.1: Introduction to Big O");

  // ==================== LESSON 9.2.2: Common Complexity Classes ====================
  const lesson9_2_2 = await prisma.lesson.upsert({
    where: { slug: "common-complexity" },
    update: {},
    create: {
      sectionId: section9_2.id,
      number: 9.22,
      title: "Common Complexity Classes",
      slug: "common-complexity",
      objectives: [
        "Recognize the main complexity classes",
        "Know typical examples of each class",
        "Understand the growth rate differences",
        "Choose appropriate algorithms based on complexity",
      ],
      content: `# Common Complexity Classes

Here are the most important complexity classes, from fastest to slowest.

## O(1) - Constant

Time doesn't depend on input size:
- Array access by index
- Hash table lookup
- Push/pop from stack

## O(log n) - Logarithmic

Cuts problem in half each step:
- Binary search
- Balanced tree operations
- Finding digits in a number

## O(n) - Linear

Process each element once:
- Simple search
- Sum of array
- Find maximum

## O(n log n) - Linearithmic

Efficient sorting territory:
- Merge sort
- Quick sort (average)
- Heap sort

## O(n²) - Quadratic

Nested loops over data:
- Bubble sort
- Selection sort
- Comparing all pairs

## O(2ⁿ) - Exponential

Doubles with each input:
- Naive Fibonacci
- Power set generation
- Some brute force solutions

## Growth Comparison (n = 1000)

| Complexity | Operations |
|------------|------------|
| O(1) | 1 |
| O(log n) | ~10 |
| O(n) | 1,000 |
| O(n log n) | ~10,000 |
| O(n²) | 1,000,000 |
| O(2ⁿ) | More than atoms in universe! |`,
      codeExamples: JSON.stringify([
        {
          id: "compare-all",
          title: "Compare All Classes",
          code: `import math

def show_growth(n):
    print(f"For n = {n}:")
    print(f"  O(1):       1")
    print(f"  O(log n):   {int(math.log2(n))}")
    print(f"  O(n):       {n}")
    print(f"  O(n log n): {int(n * math.log2(n))}")
    print(f"  O(n²):      {n**2}")
    if n <= 20:
        print(f"  O(2^n):     {2**n}")
    else:
        print(f"  O(2^n):     (too large!)")

show_growth(10)
print()
show_growth(100)
print()
show_growth(1000)`,
          description: "See how each class grows",
        },
        {
          id: "practical-examples",
          title: "Practical Examples",
          code: `# O(1) - Constant
def get_middle(lst):
    return lst[len(lst) // 2]

# O(n) - Linear
def find_max(lst):
    max_val = lst[0]
    for x in lst:
        if x > max_val:
            max_val = x
    return max_val

# O(n²) - Quadratic
def has_duplicates_slow(lst):
    for i in range(len(lst)):
        for j in range(i + 1, len(lst)):
            if lst[i] == lst[j]:
                return True
    return False

# O(n) - Linear (better duplicate check!)
def has_duplicates_fast(lst):
    seen = set()
    for x in lst:
        if x in seen:
            return True
        seen.add(x)
    return False

data = list(range(1000))
print(f"Max: {find_max(data)}")
print(f"Has duplicates (slow): {has_duplicates_slow(data)}")
print(f"Has duplicates (fast): {has_duplicates_fast(data)}")`,
          description: "Real code examples of each class",
        },
      ]),
      keyPoints: [
        "O(1): instant, regardless of size",
        "O(log n): very fast, grows slowly",
        "O(n): reasonable for most sizes",
        "O(n²): problematic for large inputs",
        "O(2ⁿ): only for tiny inputs",
      ],
      hardwareDemo: "Visualize growth curves for each complexity class. Watch how O(n²) explodes compared to O(n).",
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 4,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson9_2_2.id,
        number: 1,
        title: "Match the Complexity",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Run this to see operations count for each complexity class.",
        starterCode: `import math

n = 1000

# Calculate operations for each class
constant = 1
logarithmic = int(math.log2(n))
linear = n
linearithmic = int(n * math.log2(n))
quadratic = n * n

print(f"n = {n}")
print(f"O(1):       {constant:,}")
print(f"O(log n):   {logarithmic:,}")
print(f"O(n):       {linear:,}")
print(f"O(n log n): {linearithmic:,}")
print(f"O(n²):      {quadratic:,}")`,
        solution: `import math

n = 1000

constant = 1
logarithmic = int(math.log2(n))
linear = n
linearithmic = int(n * math.log2(n))
quadratic = n * n

print(f"n = {n}")
print(f"O(1):       {constant:,}")
print(f"O(log n):   {logarithmic:,}")
print(f"O(n):       {linear:,}")
print(f"O(n log n): {linearithmic:,}")
print(f"O(n²):      {quadratic:,}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "n = 1000\nO(1):       1\nO(log n):   9\nO(n):       1,000\nO(n log n): 9,965\nO(n²):      1,000,000", description: "Growth comparison" },
        ]),
        hints: ["log₂(1000) ≈ 10", "n² = 1,000,000", "See the huge difference"],
        xpReward: 20,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 9.2.2: Common Complexity Classes");

  // ==================== LESSON 9.2.3: Analyzing Code Complexity ====================
  const lesson9_2_3 = await prisma.lesson.upsert({
    where: { slug: "analyzing-complexity" },
    update: {},
    create: {
      sectionId: section9_2.id,
      number: 9.23,
      title: "Analyzing Code Complexity",
      slug: "analyzing-complexity",
      objectives: [
        "Analyze loops to determine complexity",
        "Handle nested loops",
        "Analyze sequences of operations",
        "Identify the dominant term",
      ],
      content: `# Analyzing Code Complexity

Learn to look at code and determine its Big O complexity.

## Rule 1: Simple Loops

A loop running n times is O(n):
\`\`\`python
for i in range(n):  # O(n)
    print(i)
\`\`\`

## Rule 2: Nested Loops

Multiply the complexities:
\`\`\`python
for i in range(n):      # O(n)
    for j in range(n):  # O(n)
        print(i, j)
# Total: O(n) × O(n) = O(n²)
\`\`\`

## Rule 3: Sequential Operations

Add complexities, keep largest:
\`\`\`python
for i in range(n):  # O(n)
    print(i)

for j in range(n):  # O(n)
    for k in range(n):  # O(n)
        print(j, k)
# Total: O(n) + O(n²) = O(n²)
\`\`\`

## Rule 4: Halving = log n

\`\`\`python
while n > 1:
    n = n // 2  # O(log n)
\`\`\`

## Examples

\`\`\`python
# O(n)
for x in lst:
    print(x)

# O(n²)
for x in lst:
    for y in lst:
        print(x, y)

# O(n)
for x in lst:
    print(x)
for y in lst:
    print(y)
# O(n) + O(n) = O(n)
\`\`\`

## Watch Out For

- Loop variable doesn't always run n times
- Function calls have their own complexity
- Built-in operations have complexity too`,
      codeExamples: JSON.stringify([
        {
          id: "analyze-loops",
          title: "Analyzing Loops",
          code: `def example1(n):
    """Single loop: O(n)"""
    count = 0
    for i in range(n):
        count += 1
    return count

def example2(n):
    """Nested loops: O(n²)"""
    count = 0
    for i in range(n):
        for j in range(n):
            count += 1
    return count

def example3(n):
    """Sequential O(n) + O(n²) = O(n²)"""
    count = 0
    for i in range(n):
        count += 1
    for i in range(n):
        for j in range(n):
            count += 1
    return count

n = 100
print(f"O(n): {example1(n)}")
print(f"O(n²): {example2(n)}")
print(f"O(n)+O(n²)=O(n²): {example3(n)}")`,
          description: "Count operations for each pattern",
        },
        {
          id: "halving-pattern",
          title: "The Halving Pattern",
          code: `def halving_loop(n):
    """O(log n) - halves each time"""
    count = 0
    while n > 1:
        count += 1
        n = n // 2
    return count

for size in [10, 100, 1000, 10000]:
    steps = halving_loop(size)
    print(f"n={size}: {steps} steps")`,
          description: "Halving gives O(log n)",
        },
        {
          id: "tricky-loops",
          title: "Tricky Loop Analysis",
          code: `def triangular_loop(n):
    """Inner loop depends on outer: O(n²)"""
    count = 0
    for i in range(n):
        for j in range(i):  # j goes 0 to i-1
            count += 1
    return count

# 0 + 1 + 2 + ... + (n-1) = n(n-1)/2 = O(n²)
for n in [10, 100]:
    ops = triangular_loop(n)
    formula = n * (n - 1) // 2
    print(f"n={n}: {ops} ops (formula: {formula})")`,
          description: "Not always n×n, but still O(n²)",
        },
      ]),
      keyPoints: [
        "Simple loop over n: O(n)",
        "Nested loops: multiply complexities",
        "Sequential code: add, keep largest",
        "Halving pattern: O(log n)",
        "Look at worst case iterations",
      ],
      hardwareDemo: "Step through loops and count operations. See how nested loops multiply and sequential operations add.",
      estimatedTime: 20,
      difficulty: "INTERMEDIATE",
      order: 5,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson9_2_3.id,
        number: 1,
        title: "What's the Complexity?",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "This code has nested loops. What's its complexity? Run to verify.",
        starterCode: `def mystery(n):
    count = 0
    for i in range(n):
        for j in range(n):
            for k in range(n):
                count += 1
    return count

# Three nested loops = O(n³)
for n in [5, 10, 20]:
    ops = mystery(n)
    cube = n ** 3
    print(f"n={n}: {ops} ops (n³={cube})")`,
        solution: `def mystery(n):
    count = 0
    for i in range(n):
        for j in range(n):
            for k in range(n):
                count += 1
    return count

for n in [5, 10, 20]:
    ops = mystery(n)
    cube = n ** 3
    print(f"n={n}: {ops} ops (n³={cube})")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "n=5: 125 ops (n³=125)\nn=10: 1000 ops (n³=1000)\nn=20: 8000 ops (n³=8000)", description: "O(n³) confirmed" },
        ]),
        hints: ["Three nested loops", "n × n × n = n³", "O(n³) complexity"],
        xpReward: 20,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 9.2.3: Analyzing Code Complexity");

  // ==================== LESSON 9.3.1: Constant and Logarithmic ====================
  const lesson9_3_1 = await prisma.lesson.upsert({
    where: { slug: "constant-logarithmic" },
    update: {},
    create: {
      sectionId: section9_3.id,
      number: 9.31,
      title: "Constant and Logarithmic Time",
      slug: "constant-logarithmic",
      objectives: [
        "Recognize O(1) operations",
        "Understand O(log n) and why it's fast",
        "Know examples of each complexity",
        "Appreciate the power of halving",
      ],
      content: `# Constant and Logarithmic Time

The fastest complexity classes - aim for these when possible!

## O(1) - Constant Time

The operation takes the same time regardless of input size.

**Examples**:
\`\`\`python
# Array access
arr[0]
arr[1000000]

# Dictionary lookup
d["key"]

# Stack push/pop
stack.append(x)
stack.pop()

# Math operations
x + y
x * y
\`\`\`

## O(log n) - Logarithmic Time

Each step eliminates half the remaining work.

**The Math**: log₂(n) is "how many times can you halve n?"
- log₂(8) = 3 (8→4→2→1)
- log₂(1024) = 10
- log₂(1,000,000) ≈ 20

**Examples**:
- Binary search
- Balanced tree operations
- Finding number of digits

## Binary Search: The Classic O(log n)

\`\`\`python
def binary_search(sorted_list, target):
    low, high = 0, len(sorted_list) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if sorted_list[mid] == target:
            return mid
        elif sorted_list[mid] < target:
            low = mid + 1  # Eliminate left half
        else:
            high = mid - 1  # Eliminate right half
    
    return -1
\`\`\`

Each iteration eliminates HALF the remaining elements!

## Why Log n is Amazing

For a billion elements:
- Linear search: up to 1,000,000,000 checks
- Binary search: only ~30 checks!`,
      codeExamples: JSON.stringify([
        {
          id: "constant-examples",
          title: "O(1) Operations",
          code: `# All these are O(1) - instant!

# List access by index
numbers = list(range(1000000))
print(f"First: {numbers[0]}")
print(f"Last: {numbers[-1]}")
print(f"Middle: {numbers[500000]}")

# Dictionary lookup
data = {"key1": "value1", "key2": "value2"}
print(f"Lookup: {data.get('key1')}")

# Stack operations
stack = []
stack.append(1)  # O(1)
stack.append(2)  # O(1)
stack.pop()      # O(1)`,
          description: "Constant time operations",
        },
        {
          id: "binary-search-steps",
          title: "Binary Search Steps",
          code: `def binary_search_verbose(arr, target):
    low, high = 0, len(arr) - 1
    steps = 0
    
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        print(f"Step {steps}: searching [{low}:{high}], mid={mid}")
        
        if arr[mid] == target:
            print(f"Found at index {mid}!")
            return mid, steps
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    
    return -1, steps

arr = list(range(100))
index, steps = binary_search_verbose(arr, 73)
print(f"Total steps: {steps}")`,
          description: "Watch binary search eliminate half each step",
        },
        {
          id: "log-growth",
          title: "Logarithmic Growth",
          code: `import math

print("Input Size → Steps needed (log₂ n):")
print("-" * 40)

for n in [10, 100, 1000, 10000, 100000, 1000000]:
    steps = math.ceil(math.log2(n))
    print(f"n = {n:>10,} → {steps:>3} steps")`,
          description: "Log n grows incredibly slowly",
        },
      ]),
      keyPoints: [
        "O(1): same time regardless of input size",
        "O(log n): halving the problem each step",
        "Binary search is the classic O(log n) algorithm",
        "log₂(1 billion) ≈ 30",
        "Always prefer O(1) and O(log n) when possible",
      ],
      hardwareDemo: "Watch binary search eliminate half the search space each step. Count how few steps it takes even for large arrays.",
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 6,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson9_3_1.id,
        number: 1,
        title: "Binary Search Steps",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Count how many steps binary search takes for different sizes.",
        starterCode: `def binary_search_count(size, target):
    arr = list(range(size))
    low, high = 0, size - 1
    steps = 0
    
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        if arr[mid] == target:
            return steps
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return steps

for size in [100, 10000, 1000000]:
    steps = binary_search_count(size, size - 1)
    print(f"Size {size:>10}: {steps} steps")`,
        solution: `def binary_search_count(size, target):
    arr = list(range(size))
    low, high = 0, size - 1
    steps = 0
    
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        if arr[mid] == target:
            return steps
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return steps

for size in [100, 10000, 1000000]:
    steps = binary_search_count(size, size - 1)
    print(f"Size {size:>10}: {steps} steps")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Size        100: 7 steps\nSize      10000: 14 steps\nSize    1000000: 20 steps", description: "Logarithmic growth" },
        ]),
        hints: ["100 → ~7 steps", "1,000,000 → ~20 steps", "Grows very slowly!"],
        xpReward: 20,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 9.3.1: Constant and Logarithmic");

  // ==================== LESSON 9.3.2: Linear and Polynomial ====================
  const lesson9_3_2 = await prisma.lesson.upsert({
    where: { slug: "linear-polynomial" },
    update: {},
    create: {
      sectionId: section9_3.id,
      number: 9.32,
      title: "Linear and Polynomial Time",
      slug: "linear-polynomial",
      objectives: [
        "Understand O(n) linear algorithms",
        "Recognize O(n²) and O(n³) patterns",
        "Know when polynomial is acceptable",
        "Identify optimization opportunities",
      ],
      content: `# Linear and Polynomial Time

These are common, practical complexity classes.

## O(n) - Linear Time

Process each element once:
\`\`\`python
def find_max(lst):
    max_val = lst[0]
    for x in lst:  # n iterations
        if x > max_val:
            max_val = x
    return max_val
\`\`\`

**Examples**:
- Finding min/max
- Summing elements
- Linear search
- Single pass through data

## O(n log n) - Linearithmic

The "sorting sweet spot":
\`\`\`python
sorted(lst)  # O(n log n)
\`\`\`

**Examples**:
- Merge sort
- Quick sort (average)
- Heap sort

## O(n²) - Quadratic

Usually means nested loops:
\`\`\`python
def all_pairs(lst):
    for i in range(len(lst)):
        for j in range(len(lst)):
            process(lst[i], lst[j])
\`\`\`

**Examples**:
- Bubble sort
- Selection sort
- Naive duplicate finding
- Simple matrix operations

## When Polynomial Is OK

- O(n): Almost always fine
- O(n log n): Fine for reasonable n
- O(n²): OK for n < 10,000 or so
- O(n³): Only for small n (< 1000)

## Red Flags

If your n could be large AND you have nested loops, look for a better algorithm!`,
      codeExamples: JSON.stringify([
        {
          id: "linear-examples",
          title: "O(n) Linear Examples",
          code: `def find_sum(lst):
    total = 0
    for x in lst:  # O(n)
        total += x
    return total

def find_max(lst):
    max_val = lst[0]
    for x in lst:  # O(n)
        if x > max_val:
            max_val = x
    return max_val

def linear_search(lst, target):
    for i, x in enumerate(lst):  # O(n)
        if x == target:
            return i
    return -1

data = list(range(1, 101))
print(f"Sum: {find_sum(data)}")
print(f"Max: {find_max(data)}")
print(f"Find 50: index {linear_search(data, 50)}")`,
          description: "Single loop = O(n)",
        },
        {
          id: "quadratic-examples",
          title: "O(n²) Quadratic Examples",
          code: `def bubble_sort(lst):
    """O(n²) sorting algorithm"""
    arr = lst.copy()
    n = len(arr)
    comparisons = 0
    
    for i in range(n):
        for j in range(n - 1 - i):
            comparisons += 1
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    
    return arr, comparisons

data = [64, 34, 25, 12, 22, 11, 90]
sorted_data, comps = bubble_sort(data)
print(f"Sorted: {sorted_data}")
print(f"Comparisons: {comps}")
print(f"For n={len(data)}: n²={len(data)**2}")`,
          description: "Nested loops = O(n²)",
        },
        {
          id: "compare-sorting",
          title: "O(n²) vs O(n log n) Sorting",
          code: `import time
import random

def selection_sort(lst):
    """O(n²)"""
    arr = lst.copy()
    for i in range(len(arr)):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

# Compare with Python's built-in sort (O(n log n))
n = 5000
data = [random.randint(1, 10000) for _ in range(n)]

start = time.time()
selection_sort(data.copy())
slow_time = time.time() - start

start = time.time()
sorted(data.copy())  # O(n log n)
fast_time = time.time() - start

print(f"Selection sort (O(n²)): {slow_time:.4f}s")
print(f"Built-in sort (O(n log n)): {fast_time:.6f}s")`,
          description: "Big difference at scale",
        },
      ]),
      keyPoints: [
        "O(n): process each element once",
        "O(n log n): efficient sorting algorithms",
        "O(n²): usually nested loops",
        "O(n²) is often improvable to O(n) or O(n log n)",
        "Watch for nested loops in your code",
      ],
      hardwareDemo: "Compare step counts between O(n) and O(n²) algorithms. See how the gap widens as n increases.",
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 7,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson9_3_2.id,
        number: 1,
        title: "Linear vs Quadratic",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Compare O(n) and O(n²) operations counts.",
        starterCode: `def linear_ops(n):
    count = 0
    for i in range(n):
        count += 1
    return count

def quadratic_ops(n):
    count = 0
    for i in range(n):
        for j in range(n):
            count += 1
    return count

for n in [10, 100, 1000]:
    lin = linear_ops(n)
    quad = quadratic_ops(n)
    print(f"n={n}: O(n)={lin}, O(n²)={quad}")`,
        solution: `def linear_ops(n):
    count = 0
    for i in range(n):
        count += 1
    return count

def quadratic_ops(n):
    count = 0
    for i in range(n):
        for j in range(n):
            count += 1
    return count

for n in [10, 100, 1000]:
    lin = linear_ops(n)
    quad = quadratic_ops(n)
    print(f"n={n}: O(n)={lin}, O(n²)={quad}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "n=10: O(n)=10, O(n²)=100\nn=100: O(n)=100, O(n²)=10000\nn=1000: O(n)=1000, O(n²)=1000000", description: "Shows growth difference" },
        ]),
        hints: ["O(n) grows linearly", "O(n²) grows much faster", "At n=1000: 1000 vs 1,000,000"],
        xpReward: 20,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 9.3.2: Linear and Polynomial");

  // ==================== LESSON 9.3.3: Exponential Time ====================
  const lesson9_3_3 = await prisma.lesson.upsert({
    where: { slug: "exponential-time" },
    update: {},
    create: {
      sectionId: section9_3.id,
      number: 9.33,
      title: "Exponential Time and When to Avoid",
      slug: "exponential-time",
      objectives: [
        "Understand O(2ⁿ) exponential growth",
        "Recognize exponential algorithms",
        "Know when exponential is unavoidable",
        "Identify ways to improve exponential algorithms",
      ],
      content: `# Exponential Time and When to Avoid

Exponential algorithms become impractical very quickly.

## O(2ⁿ) - Exponential Growth

Doubles with each increase in n:

| n | 2ⁿ |
|---|-----|
| 10 | 1,024 |
| 20 | 1,048,576 |
| 30 | 1,073,741,824 |
| 40 | 1,099,511,627,776 |
| 50 | > 1 quadrillion |

## Classic Example: Naive Fibonacci

\`\`\`python
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)  # Two recursive calls!
\`\`\`

This is O(2ⁿ) - completely recalculates subproblems.

## Power Set Generation

Generate all subsets of a set:
- Set of 3 elements: 8 subsets
- Set of 10 elements: 1024 subsets
- Set of 20 elements: 1,048,576 subsets

## When Exponential Happens

1. **Brute force** - trying all possibilities
2. **Recursive doubling** - like naive Fibonacci
3. **Combinatorial problems** - all subsets, permutations

## How to Avoid/Improve

1. **Memoization** - cache results (Fibonacci: O(2ⁿ) → O(n))
2. **Dynamic programming** - build up from smaller subproblems
3. **Pruning** - eliminate impossible branches early
4. **Approximation** - accept "good enough" instead of optimal

## Sometimes Unavoidable

Some problems are inherently exponential (NP-hard):
- Traveling salesman
- Boolean satisfiability
- Many optimization problems

For these, use heuristics or accept small inputs.`,
      codeExamples: JSON.stringify([
        {
          id: "exponential-growth",
          title: "Exponential Growth",
          code: `print("Exponential growth (2^n):")
print("-" * 35)

for n in range(1, 21):
    value = 2 ** n
    print(f"2^{n:2} = {value:>10,}")
    if n == 10:
        print("... already over a thousand!")
    if n == 20:
        print("... over a million!")`,
          description: "See how fast 2ⁿ grows",
        },
        {
          id: "naive-fibonacci",
          title: "Naive Fibonacci (O(2ⁿ))",
          code: `import time

def fib_slow(n):
    """O(2^n) - terribly slow!"""
    if n <= 1:
        return n
    return fib_slow(n - 1) + fib_slow(n - 2)

def fib_fast(n, memo={}):
    """O(n) - with memoization"""
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_fast(n - 1, memo) + fib_fast(n - 2, memo)
    return memo[n]

# Compare times
n = 30

start = time.time()
result_slow = fib_slow(n)
time_slow = time.time() - start

start = time.time()
result_fast = fib_fast(n)
time_fast = time.time() - start

print(f"fib({n}) = {result_slow}")
print(f"Naive (O(2^n)): {time_slow:.4f}s")
print(f"Memoized (O(n)): {time_fast:.6f}s")`,
          description: "Memoization fixes exponential",
        },
        {
          id: "power-set",
          title: "Power Set (All Subsets)",
          code: `def power_set(s):
    """Generate all subsets - O(2^n)"""
    result = [[]]
    for elem in s:
        result += [subset + [elem] for subset in result]
    return result

# Small sets are OK
small = [1, 2, 3]
subsets = power_set(small)
print(f"Set: {small}")
print(f"Number of subsets: {len(subsets)}")
print(f"Subsets: {subsets}")
print()

# Count for larger sets
for n in range(1, 11):
    count = 2 ** n
    print(f"Set of {n} elements: {count} subsets")`,
          description: "2ⁿ subsets for n elements",
        },
      ]),
      keyPoints: [
        "O(2ⁿ) doubles with each input increase",
        "Becomes impractical very quickly (n > 30)",
        "Naive Fibonacci is the classic example",
        "Memoization can fix many exponential algorithms",
        "Some problems are inherently exponential",
      ],
      hardwareDemo: "Watch the call count explode for naive Fibonacci. See how memoization dramatically reduces calls.",
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
        lessonId: lesson9_3_3.id,
        number: 1,
        title: "Exponential Growth",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "See how quickly 2ⁿ becomes unmanageable.",
        starterCode: `# Calculate 2^n for various n
for n in [5, 10, 15, 20, 25, 30]:
    result = 2 ** n
    print(f"2^{n} = {result:,}")`,
        solution: `for n in [5, 10, 15, 20, 25, 30]:
    result = 2 ** n
    print(f"2^{n} = {result:,}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "2^5 = 32\n2^10 = 1,024\n2^15 = 32,768\n2^20 = 1,048,576\n2^25 = 33,554,432\n2^30 = 1,073,741,824", description: "Exponential growth shown" },
        ]),
        hints: ["Doubles each time", "2^30 is over a billion", "Imagine 2^50!"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson9_3_3.id,
        number: 2,
        title: "Fix with Memoization",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Compare naive vs memoized Fibonacci to see the speedup.",
        starterCode: `import time

call_count = 0

def fib_naive(n):
    global call_count
    call_count += 1
    if n <= 1:
        return n
    return fib_naive(n-1) + fib_naive(n-2)

def fib_memo(n, cache={}):
    if n in cache:
        return cache[n]
    if n <= 1:
        return n
    cache[n] = fib_memo(n-1, cache) + fib_memo(n-2, cache)
    return cache[n]

n = 25
call_count = 0
result = fib_naive(n)
print(f"Naive fib({n}): {result}")
print(f"Function calls: {call_count:,}")

print(f"Memoized fib({n}): {fib_memo(n)}")`,
        solution: `import time

call_count = 0

def fib_naive(n):
    global call_count
    call_count += 1
    if n <= 1:
        return n
    return fib_naive(n-1) + fib_naive(n-2)

def fib_memo(n, cache={}):
    if n in cache:
        return cache[n]
    if n <= 1:
        return n
    cache[n] = fib_memo(n-1, cache) + fib_memo(n-2, cache)
    return cache[n]

n = 25
call_count = 0
result = fib_naive(n)
print(f"Naive fib({n}): {result}")
print(f"Function calls: {call_count:,}")

print(f"Memoized fib({n}): {fib_memo(n)}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Naive fib(25): 75025\nFunction calls: 242,785\nMemoized fib(25): 75025", description: "Shows call count difference" },
        ]),
        hints: ["Naive makes ~240k calls", "Memoized makes only ~50", "Cache prevents recalculation"],
        xpReward: 25,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 9.3.3: Exponential Time");

  // Summary
  const lessonCount = await prisma.lesson.count({ where: { section: { chapter: { number: 9 } } } });
  const exerciseCount = await prisma.exercise.count({ where: { lesson: { section: { chapter: { number: 9 } } } } });

  console.log("\n📊 Chapter 9 Summary:");
  console.log(`   Lessons: ${lessonCount}`);
  console.log(`   Exercises: ${exerciseCount}`);
  console.log("\n🌱 Chapter 9 seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
