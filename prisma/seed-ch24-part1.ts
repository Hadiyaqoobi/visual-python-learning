import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 1: Chapter 24 structure + Lessons 24.1.1-24.1.2...\n");
  console.log("🎉 FINAL CHAPTER OF THE CURRICULUM! 🎉\n");

  const chapter24 = await prisma.chapter.upsert({
    where: { number: 24 },
    update: {},
    create: {
      number: 24,
      title: "Working with Large Data Sets",
      description: "Master professional data science tools. Learn NumPy for fast numerical computation and Pandas for powerful data manipulation - the foundation of Python data science.",
      objectives: [
        "Understand why NumPy is essential for performance",
        "Master NumPy arrays and vectorized operations",
        "Learn Pandas DataFrames for data manipulation",
        "Apply data cleaning and transformation techniques",
        "Build complete data analysis pipelines",
      ],
      isPublished: true,
    },
  });
  console.log(`✅ Chapter ${chapter24.number}: ${chapter24.title}`);

  const section24_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter24.id, number: 24.1 } },
    update: {},
    create: {
      chapterId: chapter24.id,
      number: 24.1,
      title: "NumPy Fundamentals",
      description: "Fast numerical computing with arrays.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section24_1.number}: ${section24_1.title}`);

  const section24_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter24.id, number: 24.2 } },
    update: {},
    create: {
      chapterId: chapter24.id,
      number: 24.2,
      title: "Pandas for Data Analysis",
      description: "DataFrames and powerful data manipulation.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section24_2.number}: ${section24_2.title}`);

  const section24_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter24.id, number: 24.3 } },
    update: {},
    create: {
      chapterId: chapter24.id,
      number: 24.3,
      title: "Real Data Pipelines",
      description: "Complete data analysis workflows.",
      order: 3,
    },
  });
  console.log(`  📂 Section ${section24_3.number}: ${section24_3.title}`);

  // Lesson 24.1.1
  const lesson24_1_1 = await prisma.lesson.upsert({
    where: { slug: "why-numpy-performance" },
    update: {},
    create: {
      sectionId: section24_1.id,
      number: 24.11,
      title: "Why NumPy? Performance Revolution",
      slug: "why-numpy-performance",
      objectives: [
        "Understand why Python lists are slow",
        "See NumPy's massive performance advantage",
        "Understand memory layout differences",
        "Know when to use NumPy vs lists",
      ],
      content: `# Why NumPy?

## The Problem with Python Lists

Python lists are **flexible** but **slow**:
- Each element is a full Python object
- Elements scattered in memory
- Type checking on every operation
- Loop overhead for element-wise operations

## NumPy: Speed Through Simplicity

NumPy arrays are **fast** because:
- **Contiguous memory**: Elements stored together
- **Fixed type**: No type checking needed
- **Vectorized operations**: C-level loops
- **SIMD**: Single Instruction, Multiple Data

## Performance Comparison

| Operation (1M elements) | Python List | NumPy |
|------------------------|-------------|-------|
| Sum | ~50ms | ~1ms |
| Element-wise multiply | ~200ms | ~2ms |
| Mean | ~80ms | ~1ms |

**NumPy is 50-100x faster!**

## Memory Layout

\`\`\`
Python List:           NumPy Array:
┌───┐                  ┌───┬───┬───┬───┬───┐
│ → │──→ [obj1]        │ 1 │ 2 │ 3 │ 4 │ 5 │
├───┤                  └───┴───┴───┴───┴───┘
│ → │──→ [obj2]        Contiguous memory!
├───┤
│ → │──→ [obj3]
└───┘
Scattered pointers
\`\`\`

## When to Use NumPy

✅ Numerical computations
✅ Large datasets (>1000 elements)
✅ Mathematical operations
✅ Scientific computing
✅ Machine learning

## When Lists Are Fine

✅ Small data (<100 elements)
✅ Mixed types needed
✅ Frequent appending
✅ Non-numerical data`,
      codeExamples: JSON.stringify([
        {
          id: "performance-comparison",
          title: "Performance: Lists vs NumPy",
          code: "import time\n\n# Simulate NumPy-like operations with pure Python\n# (In real code, you'd use: import numpy as np)\n\ndef python_sum(data):\n    return sum(data)\n\ndef python_multiply(data, factor):\n    return [x * factor for x in data]\n\ndef python_mean(data):\n    return sum(data) / len(data)\n\n# Create test data\nsize = 100000\ndata = list(range(size))\n\nprint('PERFORMANCE COMPARISON')\nprint('=' * 50)\nprint(f'Data size: {size:,} elements\\n')\n\n# Sum\nstart = time.time()\nresult = python_sum(data)\nlist_time = (time.time() - start) * 1000\nprint(f'Sum:')\nprint(f'  Python list: {list_time:.2f}ms')\nprint(f'  NumPy would be: ~{list_time/50:.2f}ms (50x faster)')\n\n# Multiply\nstart = time.time()\nresult = python_multiply(data, 2)\nlist_time = (time.time() - start) * 1000\nprint(f'\\nMultiply by 2:')\nprint(f'  Python list: {list_time:.2f}ms')\nprint(f'  NumPy would be: ~{list_time/100:.2f}ms (100x faster)')\n\nprint('\\n💡 NumPy achieves this through:')\nprint('   • Contiguous memory layout')\nprint('   • C-level loops (no Python overhead)')\nprint('   • Vectorized operations')",
          description: "Compare Python list vs NumPy performance",
        },
        {
          id: "memory-layout",
          title: "Memory Layout Visualization",
          code: "print('MEMORY LAYOUT: Lists vs NumPy Arrays')\nprint('=' * 55)\n\nprint('\\nPython List [1, 2, 3, 4, 5]:')\nprint('┌─────────────────────────────────────────────┐')\nprint('│ List object                                 │')\nprint('│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐             │')\nprint('│ │ → │ │ → │ │ → │ │ → │ │ → │  (pointers)  │')\nprint('│ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘             │')\nprint('└───┼─────┼─────┼─────┼─────┼───────────────┘')\nprint('    ↓     ↓     ↓     ↓     ↓')\nprint('  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐')\nprint('  │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │  (scattered in memory)')\nprint('  └───┘ └───┘ └───┘ └───┘ └───┘')\nprint('  Each is a full Python int object (~28 bytes each!)')\n\nprint('\\n\\nNumPy Array np.array([1, 2, 3, 4, 5]):')\nprint('┌─────────────────────────────────────────────┐')\nprint('│ Array object (metadata)                     │')\nprint('│ dtype: int64, shape: (5,), strides: (8,)   │')\nprint('└─────────────────────────────────────────────┘')\nprint('              │')\nprint('              ↓')\nprint('┌─────┬─────┬─────┬─────┬─────┐')\nprint('│  1  │  2  │  3  │  4  │  5  │  (contiguous, 8 bytes each)')\nprint('└─────┴─────┴─────┴─────┴─────┘')\nprint('Raw numbers, packed together in memory!')\n\nprint('\\n💡 Why contiguous memory is faster:')\nprint('   • CPU cache loads chunks of memory')\nprint('   • Contiguous = one cache load gets many elements')\nprint('   • Scattered = many cache misses (slow!)')",
          description: "Visualize memory layout differences",
        },
        {
          id: "vectorization",
          title: "Vectorization Concept",
          code: "print('VECTORIZATION: The Key to Speed')\nprint('=' * 55)\n\nprint('\\nPython Loop Approach:')\nprint('─' * 40)\nprint('data = [1, 2, 3, 4, 5]')\nprint('result = []')\nprint('for x in data:      # Python interpreter overhead')\nprint('    result.append(x * 2)  # Type check, method call')\nprint()\nprint('Each iteration:')\nprint('  1. Check loop condition (Python)')\nprint('  2. Get next element (Python)')\nprint('  3. Type check x (Python)')\nprint('  4. Multiply (finally, actual work!)')\nprint('  5. Append to result (Python)')\n\nprint('\\n\\nNumPy Vectorized Approach:')\nprint('─' * 40)\nprint('data = np.array([1, 2, 3, 4, 5])')\nprint('result = data * 2  # One operation!')\nprint()\nprint('What happens internally:')\nprint('  1. NumPy sees: multiply array by scalar')\nprint('  2. Calls optimized C function')\nprint('  3. C loop processes ALL elements')\nprint('  4. No Python overhead per element!')\n\nprint('\\n💡 Rule: Avoid Python loops over NumPy arrays!')\nprint('   Use vectorized operations instead.')",
          description: "Understand vectorization",
        },
      ]),
      keyPoints: [
        "Python lists: flexible but slow (scattered memory)",
        "NumPy arrays: fast (contiguous memory, C loops)",
        "50-100x speedup for numerical operations",
        "Vectorization: operate on entire arrays at once",
        "Avoid Python loops over large numerical data",
        "NumPy is foundation of data science ecosystem",
      ],
      hardwareDemo: "Watch memory access patterns. See cache efficiency of contiguous vs scattered.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson24_1_1.number}: ${lesson24_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson24_1_1.id,
        number: 1,
        title: "List vs Array Performance",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Compare performance of list operations vs simulated NumPy operations.",
        starterCode: "import time\n\n# Simulating the performance difference\ndef list_operation(data):\n    \"\"\"Python list: loop over each element\"\"\"\n    result = []\n    for x in data:\n        result.append(x * 2 + 1)\n    return result\n\ndef vectorized_concept(data):\n    \"\"\"Conceptual vectorized operation\"\"\"\n    # In real NumPy: np.array(data) * 2 + 1\n    # This simulates what happens internally (but still in Python)\n    return [x * 2 + 1 for x in data]  # List comp is faster than loop\n\n# Test\nsize = 50000\ndata = list(range(size))\n\nprint('PERFORMANCE COMPARISON')\nprint('=' * 45)\nprint(f'Processing {size:,} elements\\n')\n\n# List operation\nstart = time.time()\nresult1 = list_operation(data)\ntime1 = (time.time() - start) * 1000\nprint(f'Explicit loop: {time1:.2f}ms')\n\n# \"Vectorized\" (list comprehension)\nstart = time.time()\nresult2 = vectorized_concept(data)\ntime2 = (time.time() - start) * 1000\nprint(f'List comprehension: {time2:.2f}ms')\n\nprint(f'\\n💡 Real NumPy would be ~{time1/50:.2f}ms')\nprint('   (50-100x faster than Python loops)')",
        solution: "# Performance compared",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Times shown", description: "Compare performance" }]),
        hints: ["Time each operation", "Use large data size", "Note the difference"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson24_1_1.id,
        number: 2,
        title: "Memory Size Comparison",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Compare memory usage of Python lists vs conceptual NumPy arrays.",
        starterCode: "import sys\n\n# Python list memory\npy_list = [1, 2, 3, 4, 5]\nlist_size = sys.getsizeof(py_list)\nelement_size = sys.getsizeof(py_list[0])\ntotal_list = list_size + len(py_list) * element_size\n\nprint('MEMORY COMPARISON')\nprint('=' * 50)\nprint(f'\\nPython List [1, 2, 3, 4, 5]:')\nprint(f'  List container: {list_size} bytes')\nprint(f'  Each int object: {element_size} bytes')\nprint(f'  Total: {total_list} bytes')\n\n# NumPy array (simulated)\n# Real NumPy int64 array: 5 elements * 8 bytes + small overhead\nnumpy_size = 5 * 8 + 96  # 96 bytes typical array overhead\n\nprint(f'\\nNumPy Array (int64):')\nprint(f'  Array overhead: ~96 bytes')\nprint(f'  Data: 5 × 8 = 40 bytes')\nprint(f'  Total: ~{numpy_size} bytes')\n\nprint(f'\\nMemory savings: {total_list - numpy_size} bytes ({(1 - numpy_size/total_list)*100:.0f}%)')\nprint('\\n💡 For 1 million elements:')\nprint(f'   Python list: ~{1000000 * 28 / 1e6:.0f} MB')\nprint(f'   NumPy int64: ~{1000000 * 8 / 1e6:.0f} MB')",
        solution: "# Memory compared",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Sizes shown", description: "Memory comparison" }]),
        hints: ["Use sys.getsizeof", "Include object overhead", "NumPy is more compact"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson24_1_1.id,
        number: 3,
        title: "Identify Vectorization Opportunities",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Identify which operations can be vectorized.",
        starterCode: "operations = [\n    {\n        'name': 'Add 10 to each element',\n        'loop': 'for i in range(len(data)): result[i] = data[i] + 10',\n        'vectorized': 'data + 10',\n        'can_vectorize': True\n    },\n    {\n        'name': 'Sum all elements',\n        'loop': 'total = 0; for x in data: total += x',\n        'vectorized': 'np.sum(data)',\n        'can_vectorize': True\n    },\n    {\n        'name': 'Filter values > 5',\n        'loop': '[x for x in data if x > 5]',\n        'vectorized': 'data[data > 5]',\n        'can_vectorize': True\n    },\n    {\n        'name': 'Append to list',\n        'loop': 'data.append(new_value)',\n        'vectorized': 'N/A - arrays are fixed size',\n        'can_vectorize': False\n    },\n    {\n        'name': 'Matrix multiplication',\n        'loop': 'nested loops (O(n³))',\n        'vectorized': 'np.dot(A, B) or A @ B',\n        'can_vectorize': True\n    },\n]\n\nprint('VECTORIZATION OPPORTUNITIES')\nprint('=' * 60)\n\nfor op in operations:\n    status = '✓ Vectorize!' if op['can_vectorize'] else '✗ Use loop'\n    print(f'\\n{op[\"name\"]}:')\n    print(f'  Loop: {op[\"loop\"]}')\n    print(f'  NumPy: {op[\"vectorized\"]}')\n    print(f'  → {status}')\n\nprint('\\n💡 Rule of thumb:')\nprint('   If operation applies uniformly to all elements → Vectorize!')\nprint('   If size changes or complex logic → May need loops')",
        solution: "# Vectorization opportunities identified",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Operations listed", description: "Vectorization" }]),
        hints: ["Element-wise ops vectorize", "Aggregations vectorize", "Dynamic sizing doesn't"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson24_1_1.id,
        number: 4,
        title: "When to Use Lists vs NumPy",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Classify scenarios as better for lists or NumPy.",
        starterCode: "scenarios = [\n    ('Calculating mean of 1 million numbers', 'numpy'),\n    ('Storing 10 user names', 'list'),\n    ('Image processing (pixel manipulation)', 'numpy'),\n    ('Building a shopping cart (add/remove items)', 'list'),\n    ('Scientific simulation with matrices', 'numpy'),\n    ('Parsing JSON with mixed types', 'list'),\n    ('Machine learning feature vectors', 'numpy'),\n    ('Storing 5 configuration values', 'list'),\n    ('Financial time series analysis', 'numpy'),\n    ('Queue of tasks to process', 'list'),\n]\n\nprint('LISTS vs NUMPY: WHEN TO USE WHICH')\nprint('=' * 55)\n\nprint('\\n{:<45} {:>10}'.format('Scenario', 'Best Tool'))\nprint('-' * 55)\n\nfor scenario, best in scenarios:\n    icon = '📊' if best == 'numpy' else '📝'\n    print(f'{icon} {scenario:<43} {best.upper():>10}')\n\nprint('\\n📊 NumPy wins when:')\nprint('   • Large numerical data')\nprint('   • Mathematical operations')\nprint('   • Performance critical')\n\nprint('\\n📝 Lists win when:')\nprint('   • Small data (<100 elements)')\nprint('   • Mixed types')\nprint('   • Frequent size changes')\nprint('   • Non-numerical data')",
        solution: "# Scenarios classified",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Classifications shown", description: "Lists vs NumPy" }]),
        hints: ["Large numerical = NumPy", "Small/mixed = list", "Think about operations"],
        xpReward: 10,
        order: 4,
      },
      {
        lessonId: lesson24_1_1.id,
        number: 5,
        title: "Performance Scaling",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show how performance difference scales with data size.",
        starterCode: "import time\n\ndef measure_sum(size):\n    data = list(range(size))\n    start = time.time()\n    total = sum(data)\n    return (time.time() - start) * 1000\n\nprint('PERFORMANCE SCALING')\nprint('=' * 55)\nprint('\\nHow operation time grows with data size:')\nprint('(Python list sum vs theoretical NumPy)\\n')\n\nprint(f'{\"Size\":>12} {\"Python (ms)\":>12} {\"NumPy (est)\":>12} {\"Speedup\":>10}')\nprint('-' * 50)\n\nfor size in [1000, 10000, 100000, 1000000]:\n    py_time = measure_sum(size)\n    np_time = py_time / 50  # NumPy typically 50x faster\n    speedup = py_time / np_time\n    print(f'{size:>12,} {py_time:>12.2f} {np_time:>12.2f} {speedup:>10.0f}x')\n\nprint('\\n💡 Key insight:')\nprint('   Python time grows linearly with size')\nprint('   NumPy time also grows linearly BUT')\nprint('   The constant factor is ~50-100x smaller!')\nprint('\\n   For 1M elements: seconds vs milliseconds')",
        solution: "# Scaling demonstrated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Scaling table", description: "Performance scaling" }]),
        hints: ["Test multiple sizes", "Calculate speedup", "Show linear scaling"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 24.1.1`);

  // Lesson 24.1.2
  const lesson24_1_2 = await prisma.lesson.upsert({
    where: { slug: "numpy-arrays-operations" },
    update: {},
    create: {
      sectionId: section24_1.id,
      number: 24.12,
      title: "NumPy Arrays and Operations",
      slug: "numpy-arrays-operations",
      objectives: [
        "Create NumPy arrays in various ways",
        "Understand array attributes",
        "Perform element-wise operations",
        "Use universal functions (ufuncs)",
      ],
      content: `# NumPy Arrays and Operations

## Creating Arrays

\`\`\`python
import numpy as np

# From list
arr = np.array([1, 2, 3, 4, 5])

# Zeros and ones
zeros = np.zeros(5)
ones = np.ones((3, 4))  # 3x4 matrix

# Range
arr = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]

# Linspace
arr = np.linspace(0, 1, 5)  # [0, 0.25, 0.5, 0.75, 1]

# Random
arr = np.random.rand(5)  # Uniform [0, 1)
arr = np.random.randn(5)  # Normal distribution
\`\`\`

## Array Attributes

\`\`\`python
arr.shape    # Dimensions: (rows, cols)
arr.dtype    # Data type: int64, float64, etc.
arr.ndim     # Number of dimensions
arr.size     # Total number of elements
\`\`\`

## Element-wise Operations

\`\`\`python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

a + b    # [5, 7, 9]
a * b    # [4, 10, 18]
a ** 2   # [1, 4, 9]
a > 2    # [False, False, True]
\`\`\`

## Universal Functions (ufuncs)

\`\`\`python
np.sqrt(arr)    # Square root
np.exp(arr)     # Exponential
np.log(arr)     # Natural log
np.sin(arr)     # Sine
np.sum(arr)     # Sum all
np.mean(arr)    # Average
np.std(arr)     # Standard deviation
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "array-creation",
          title: "Creating NumPy Arrays (Simulated)",
          code: "# Simulating NumPy array concepts\n# In real code: import numpy as np\n\nclass SimpleArray:\n    \"\"\"Simplified NumPy array for learning\"\"\"\n    def __init__(self, data, dtype='float64'):\n        self.data = list(data)\n        self.dtype = dtype\n        self.shape = (len(self.data),)\n        self.ndim = 1\n        self.size = len(self.data)\n    \n    def __repr__(self):\n        return f'array({self.data})'\n\n# Creating arrays\nprint('CREATING NUMPY ARRAYS')\nprint('=' * 50)\n\n# From list\narr1 = SimpleArray([1, 2, 3, 4, 5])\nprint(f'From list: {arr1}')\nprint(f'  shape: {arr1.shape}, dtype: {arr1.dtype}')\n\n# Zeros (simulated)\nzeros = SimpleArray([0.0] * 5)\nprint(f'\\nZeros: {zeros}')\n\n# Ones\nones = SimpleArray([1.0] * 5)\nprint(f'Ones: {ones}')\n\n# Arange (simulated)\narange = SimpleArray(list(range(0, 10, 2)))\nprint(f'\\nArange(0, 10, 2): {arange}')\n\n# Linspace (simulated)\nlinspace = SimpleArray([i/4 for i in range(5)])\nprint(f'Linspace(0, 1, 5): {linspace}')\n\nprint('\\n💡 Real NumPy syntax:')\nprint('   np.array([1,2,3])')\nprint('   np.zeros(5)')\nprint('   np.arange(0, 10, 2)')\nprint('   np.linspace(0, 1, 5)')",
          description: "Different ways to create arrays",
        },
        {
          id: "elementwise",
          title: "Element-wise Operations",
          code: "# Simulating NumPy element-wise operations\n\ndef array_add(a, b):\n    return [x + y for x, y in zip(a, b)]\n\ndef array_multiply(a, b):\n    return [x * y for x, y in zip(a, b)]\n\ndef array_scalar_multiply(a, scalar):\n    return [x * scalar for x in a]\n\ndef array_power(a, power):\n    return [x ** power for x in a]\n\ndef array_compare(a, value):\n    return [x > value for x in a]\n\n# Operations\na = [1, 2, 3, 4, 5]\nb = [10, 20, 30, 40, 50]\n\nprint('ELEMENT-WISE OPERATIONS')\nprint('=' * 50)\nprint(f'a = {a}')\nprint(f'b = {b}')\nprint()\n\nprint(f'a + b     = {array_add(a, b)}')\nprint(f'a * b     = {array_multiply(a, b)}')\nprint(f'a * 2     = {array_scalar_multiply(a, 2)}')\nprint(f'a ** 2    = {array_power(a, 2)}')\nprint(f'a > 2     = {array_compare(a, 2)}')\n\nprint('\\n💡 NumPy syntax (much cleaner!):')\nprint('   a + b')\nprint('   a * b')\nprint('   a * 2')\nprint('   a ** 2')\nprint('   a > 2')",
          description: "Operations apply to all elements",
        },
        {
          id: "ufuncs",
          title: "Universal Functions",
          code: "import math\n\n# Simulating NumPy ufuncs\ndef np_sqrt(arr):\n    return [math.sqrt(x) for x in arr]\n\ndef np_exp(arr):\n    return [math.exp(x) for x in arr]\n\ndef np_sum(arr):\n    return sum(arr)\n\ndef np_mean(arr):\n    return sum(arr) / len(arr)\n\ndef np_std(arr):\n    mean = np_mean(arr)\n    variance = sum((x - mean) ** 2 for x in arr) / len(arr)\n    return math.sqrt(variance)\n\ndef np_max(arr):\n    return max(arr)\n\ndef np_min(arr):\n    return min(arr)\n\n# Demo\narr = [1, 4, 9, 16, 25]\n\nprint('UNIVERSAL FUNCTIONS (ufuncs)')\nprint('=' * 50)\nprint(f'arr = {arr}')\nprint()\n\nprint('Math functions (applied to each element):')\nprint(f'  np.sqrt(arr) = {[round(x, 2) for x in np_sqrt(arr)]}')\n\nprint('\\nAggregation functions:')\nprint(f'  np.sum(arr)  = {np_sum(arr)}')\nprint(f'  np.mean(arr) = {np_mean(arr)}')\nprint(f'  np.std(arr)  = {np_std(arr):.2f}')\nprint(f'  np.max(arr)  = {np_max(arr)}')\nprint(f'  np.min(arr)  = {np_min(arr)}')\n\nprint('\\n💡 ufuncs are vectorized and FAST!')\nprint('   No Python loop overhead')",
          description: "NumPy universal functions",
        },
      ]),
      keyPoints: [
        "np.array(), np.zeros(), np.ones(), np.arange()",
        "shape, dtype, ndim, size attributes",
        "Operations apply element-wise automatically",
        "Scalar operations broadcast to all elements",
        "ufuncs: sqrt, exp, log, sin, cos, sum, mean, std",
        "No explicit loops needed!",
      ],
      hardwareDemo: "Watch element-wise operations process array in parallel.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson24_1_2.number}: ${lesson24_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson24_1_2.id,
        number: 1,
        title: "Create Arrays Multiple Ways",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Practice creating arrays using different methods.",
        starterCode: "# Simulating NumPy array creation\n\nprint('ARRAY CREATION METHODS')\nprint('=' * 45)\n\n# 1. From list\nfrom_list = [1, 2, 3, 4, 5]\nprint(f'From list: {from_list}')\n\n# 2. Zeros\nzeros = [0.0] * 5\nprint(f'Zeros(5): {zeros}')\n\n# 3. Ones\nones = [1.0] * 4\nprint(f'Ones(4): {ones}')\n\n# 4. Arange (like range)\narange = list(range(0, 10, 2))\nprint(f'Arange(0, 10, 2): {arange}')\n\n# 5. Linspace (evenly spaced)\ndef linspace(start, stop, num):\n    step = (stop - start) / (num - 1)\n    return [start + i * step for i in range(num)]\n\nlin = linspace(0, 1, 5)\nprint(f'Linspace(0, 1, 5): {[round(x, 2) for x in lin]}')\n\nprint('\\n💡 Real NumPy equivalents:')\nprint('   np.array([1,2,3,4,5])')\nprint('   np.zeros(5)')\nprint('   np.ones(4)')\nprint('   np.arange(0, 10, 2)')\nprint('   np.linspace(0, 1, 5)')",
        solution: "# Arrays created",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All methods shown", description: "Array creation" }]),
        hints: ["list() for basic", "* n for repeated values", "range for sequence"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson24_1_2.id,
        number: 2,
        title: "Element-wise Math",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Perform element-wise mathematical operations on arrays.",
        starterCode: "# Element-wise operations\n\na = [1, 2, 3, 4, 5]\nb = [5, 4, 3, 2, 1]\n\n# Add arrays\nadd_result = [x + y for x, y in zip(a, b)]\n\n# Multiply arrays\nmult_result = [x * y for x, y in zip(a, b)]\n\n# Scalar operations\nscalar_add = [x + 10 for x in a]\nscalar_mult = [x * 2 for x in a]\n\n# Power\npower_result = [x ** 2 for x in a]\n\nprint('ELEMENT-WISE MATH')\nprint('=' * 45)\nprint(f'a = {a}')\nprint(f'b = {b}')\nprint()\nprint(f'a + b = {add_result}')\nprint(f'a * b = {mult_result}')\nprint(f'a + 10 = {scalar_add}')\nprint(f'a * 2 = {scalar_mult}')\nprint(f'a ** 2 = {power_result}')\n\nprint('\\n💡 In NumPy, just write: a + b, a * 2, etc.')\nprint('   No list comprehension needed!')",
        solution: "# Element-wise operations",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Operations shown", description: "Element-wise math" }]),
        hints: ["Use zip for two arrays", "List comp for operations", "NumPy makes this simple"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson24_1_2.id,
        number: 3,
        title: "Aggregation Functions",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement common NumPy aggregation functions.",
        starterCode: "import math\n\ndef np_sum(arr):\n    return sum(arr)\n\ndef np_mean(arr):\n    return sum(arr) / len(arr)\n\ndef np_std(arr):\n    mean = np_mean(arr)\n    variance = sum((x - mean) ** 2 for x in arr) / len(arr)\n    return math.sqrt(variance)\n\ndef np_min(arr):\n    return min(arr)\n\ndef np_max(arr):\n    return max(arr)\n\ndef np_argmax(arr):\n    return arr.index(max(arr))\n\ndef np_argmin(arr):\n    return arr.index(min(arr))\n\n# Test\ndata = [23, 45, 12, 67, 34, 89, 56]\n\nprint('AGGREGATION FUNCTIONS')\nprint('=' * 45)\nprint(f'data = {data}')\nprint()\nprint(f'np.sum(data)    = {np_sum(data)}')\nprint(f'np.mean(data)   = {np_mean(data):.2f}')\nprint(f'np.std(data)    = {np_std(data):.2f}')\nprint(f'np.min(data)    = {np_min(data)}')\nprint(f'np.max(data)    = {np_max(data)}')\nprint(f'np.argmax(data) = {np_argmax(data)} (index of max)')\nprint(f'np.argmin(data) = {np_argmin(data)} (index of min)')",
        solution: "# Aggregation functions",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All aggregations", description: "Aggregation" }]),
        hints: ["sum(), mean are basic", "std needs variance first", "argmax returns index"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson24_1_2.id,
        number: 4,
        title: "Boolean Indexing",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use boolean conditions to filter arrays.",
        starterCode: "# Boolean indexing (NumPy-style filtering)\n\ndata = [23, 45, 12, 67, 34, 89, 56, 11, 78]\n\n# Create boolean mask\nmask_greater_50 = [x > 50 for x in data]\nmask_even = [x % 2 == 0 for x in data]\nmask_range = [20 <= x <= 60 for x in data]\n\n# Apply mask (filter)\ndef apply_mask(data, mask):\n    return [x for x, m in zip(data, mask) if m]\n\nprint('BOOLEAN INDEXING')\nprint('=' * 50)\nprint(f'data = {data}')\nprint()\n\nprint(f'data > 50:     {mask_greater_50}')\nprint(f'Filtered:      {apply_mask(data, mask_greater_50)}')\nprint()\nprint(f'data % 2 == 0: {mask_even}')\nprint(f'Even numbers:  {apply_mask(data, mask_even)}')\nprint()\nprint(f'20 <= x <= 60: {mask_range}')\nprint(f'In range:      {apply_mask(data, mask_range)}')\n\nprint('\\n💡 NumPy syntax (much cleaner):')\nprint('   data[data > 50]')\nprint('   data[data % 2 == 0]')\nprint('   data[(data >= 20) & (data <= 60)]')",
        solution: "# Boolean indexing",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Filtered arrays", description: "Boolean indexing" }]),
        hints: ["Create boolean mask", "Use zip to apply", "NumPy does this in one step"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson24_1_2.id,
        number: 5,
        title: "Statistical Analysis",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Perform a complete statistical analysis of a dataset.",
        starterCode: "import math\n\ndef statistics(data):\n    \"\"\"Calculate comprehensive statistics\"\"\"\n    n = len(data)\n    mean = sum(data) / n\n    \n    sorted_data = sorted(data)\n    median = sorted_data[n // 2] if n % 2 else (sorted_data[n//2 - 1] + sorted_data[n//2]) / 2\n    \n    variance = sum((x - mean) ** 2 for x in data) / n\n    std = math.sqrt(variance)\n    \n    return {\n        'count': n,\n        'mean': mean,\n        'median': median,\n        'std': std,\n        'min': min(data),\n        'max': max(data),\n        'range': max(data) - min(data)\n    }\n\n# Sample data: exam scores\nscores = [78, 82, 90, 67, 88, 95, 72, 85, 91, 76, 84, 89, 93, 71, 87]\n\nstats = statistics(scores)\n\nprint('STATISTICAL ANALYSIS')\nprint('=' * 45)\nprint(f'Exam Scores: {scores[:5]}... ({len(scores)} total)')\nprint()\nprint('Statistics:')\nprint(f'  Count:  {stats[\"count\"]}')\nprint(f'  Mean:   {stats[\"mean\"]:.2f}')\nprint(f'  Median: {stats[\"median\"]}')\nprint(f'  Std:    {stats[\"std\"]:.2f}')\nprint(f'  Min:    {stats[\"min\"]}')\nprint(f'  Max:    {stats[\"max\"]}')\nprint(f'  Range:  {stats[\"range\"]}')\n\nprint('\\n💡 NumPy makes this trivial:')\nprint('   np.mean(scores), np.median(scores), np.std(scores)')",
        solution: "# Complete statistics",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All stats shown", description: "Statistics" }]),
        hints: ["Calculate each stat", "Median needs sorted data", "NumPy has all these built-in"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 24.1.2`);

  console.log("\n✅ Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
