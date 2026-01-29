import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 2: Lessons 24.1.3-24.2.2...\n");

  const section24_1 = await prisma.section.findFirst({ where: { number: 24.1 } });
  const section24_2 = await prisma.section.findFirst({ where: { number: 24.2 } });
  if (!section24_1 || !section24_2) throw new Error("Sections not found. Run part 1 first.");

  // Lesson 24.1.3
  const lesson24_1_3 = await prisma.lesson.upsert({
    where: { slug: "array-broadcasting" },
    update: {},
    create: {
      sectionId: section24_1.id,
      number: 24.13,
      title: "Array Broadcasting",
      slug: "array-broadcasting",
      objectives: [
        "Understand broadcasting rules",
        "Apply operations between different-shaped arrays",
        "Avoid explicit loops with broadcasting",
        "Recognize broadcasting errors",
      ],
      content: `# Array Broadcasting

## What Is Broadcasting?

NumPy's ability to operate on arrays of **different shapes**.

Smaller array is "broadcast" across the larger one.

## Simple Example

\`\`\`python
# Scalar broadcasts to all elements
arr = np.array([1, 2, 3])
arr + 10  # [11, 12, 13]

# Row broadcasts across matrix
matrix = np.array([[1, 2, 3],
                   [4, 5, 6]])
row = np.array([10, 20, 30])
matrix + row  # Each row gets [10, 20, 30] added
\`\`\`

## Broadcasting Rules

1. Compare shapes from **right to left**
2. Dimensions match if:
   - They are equal, OR
   - One of them is 1
3. Missing dimensions are treated as 1

## Examples

\`\`\`
(3, 4) + (4,)    → (3, 4)  ✓ OK
(3, 4) + (3, 1)  → (3, 4)  ✓ OK
(3, 4) + (3,)    → ERROR   ✗ 4 ≠ 3
(3, 1) + (1, 4)  → (3, 4)  ✓ Both broadcast
\`\`\`

## Why Broadcasting Matters

- Avoid explicit loops
- Memory efficient (no copies)
- Enables vectorized operations
- Essential for data science`,
      codeExamples: JSON.stringify([
        {
          id: "scalar-broadcast",
          title: "Scalar Broadcasting",
          code: "# Scalar broadcasting - simplest case\n\narr = [1, 2, 3, 4, 5]\n\n# Scalar broadcasts to all elements\nresult_add = [x + 10 for x in arr]  # In NumPy: arr + 10\nresult_mult = [x * 2 for x in arr]  # In NumPy: arr * 2\n\nprint('SCALAR BROADCASTING')\nprint('=' * 45)\nprint(f'arr = {arr}')\nprint(f'\\narr + 10 = {result_add}')\nprint(f'arr * 2  = {result_mult}')\n\nprint('\\nWhat happens:')\nprint('  10 is \"broadcast\" to [10, 10, 10, 10, 10]')\nprint('  Then element-wise addition occurs')\nprint('\\n💡 NumPy does this without creating the expanded array!')\nprint('   Memory efficient and fast')",
          description: "Scalar broadcasts to all elements",
        },
        {
          id: "row-broadcast",
          title: "Row Broadcasting Across Matrix",
          code: "# Row broadcasting across a matrix\n\nmatrix = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\nrow = [10, 20, 30]\n\n# Row broadcasts across each row of matrix\nresult = [[m + r for m, r in zip(matrix_row, row)] for matrix_row in matrix]\n\nprint('ROW BROADCASTING')\nprint('=' * 50)\nprint('Matrix (3x3):')\nfor r in matrix:\n    print(f'  {r}')\nprint(f'\\nRow to add: {row}')\n\nprint('\\nResult (matrix + row):')\nfor r in result:\n    print(f'  {r}')\n\nprint('\\nBroadcasting visualization:')\nprint('  [1, 2, 3]   +  [10, 20, 30]  =  [11, 22, 33]')\nprint('  [4, 5, 6]   +  [10, 20, 30]  =  [14, 25, 36]')\nprint('  [7, 8, 9]   +  [10, 20, 30]  =  [17, 28, 39]')\nprint('\\n💡 Row is reused for each matrix row')",
          description: "Broadcast row across matrix",
        },
        {
          id: "broadcast-rules",
          title: "Broadcasting Rules",
          code: "def check_broadcast(shape1, shape2):\n    \"\"\"Check if two shapes can broadcast\"\"\"\n    # Pad shorter shape with 1s on left\n    len_diff = abs(len(shape1) - len(shape2))\n    if len(shape1) < len(shape2):\n        shape1 = (1,) * len_diff + shape1\n    else:\n        shape2 = (1,) * len_diff + shape2\n    \n    result_shape = []\n    for s1, s2 in zip(shape1, shape2):\n        if s1 == s2:\n            result_shape.append(s1)\n        elif s1 == 1:\n            result_shape.append(s2)\n        elif s2 == 1:\n            result_shape.append(s1)\n        else:\n            return None  # Cannot broadcast\n    \n    return tuple(result_shape)\n\nprint('BROADCASTING RULES')\nprint('=' * 55)\nprint('Rule: Compare shapes right-to-left')\nprint('      Dimensions match if equal or one is 1\\n')\n\nexamples = [\n    ((3, 4), (4,)),\n    ((3, 4), (3, 1)),\n    ((3, 4), (1, 4)),\n    ((3, 4), (3,)),    # Error\n    ((5, 3, 4), (3, 4)),\n    ((3, 1), (1, 4)),\n]\n\nprint(f'{\"Shape 1\":>12} {\"Shape 2\":>12} {\"Result\":>15}')\nprint('-' * 45)\nfor s1, s2 in examples:\n    result = check_broadcast(s1, s2)\n    if result:\n        print(f'{str(s1):>12} {str(s2):>12} {str(result):>15} ✓')\n    else:\n        print(f'{str(s1):>12} {str(s2):>12} {\"ERROR\":>15} ✗')",
          description: "Understand broadcasting rules",
        },
      ]),
      keyPoints: [
        "Broadcasting: operate on different-shaped arrays",
        "Scalar broadcasts to all elements",
        "Rows broadcast across matrix rows",
        "Compare shapes right-to-left",
        "Dimensions match if equal or one is 1",
        "No memory copy - very efficient",
      ],
      hardwareDemo: "Watch broadcasting expand arrays virtually. See no actual memory copy.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson24_1_3.number}: ${lesson24_1_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson24_1_3.id,
        number: 1,
        title: "Scalar Broadcasting",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Practice scalar broadcasting operations.",
        starterCode: "# Scalar broadcasting\narr = [10, 20, 30, 40, 50]\n\n# Operations with scalar\nadd_5 = [x + 5 for x in arr]\nmult_2 = [x * 2 for x in arr]\ndiv_10 = [x / 10 for x in arr]\nsub_mean = [x - 30 for x in arr]  # Subtract mean\n\nprint('SCALAR BROADCASTING')\nprint('=' * 40)\nprint(f'arr = {arr}')\nprint(f'\\narr + 5   = {add_5}')\nprint(f'arr * 2   = {mult_2}')\nprint(f'arr / 10  = {div_10}')\nprint(f'arr - 30  = {sub_mean}')\n\nprint('\\n💡 Scalar is broadcast to match array shape')",
        solution: "# Scalar broadcast",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Operations shown", description: "Scalar broadcasting" }]),
        hints: ["Scalar applies to all elements", "No loop needed in NumPy", "Very common operation"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson24_1_3.id,
        number: 2,
        title: "Row-wise Operations",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Broadcast a row across a matrix.",
        starterCode: "# Row broadcasting\nmatrix = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\nrow = [100, 200, 300]\n\n# Add row to each matrix row\nresult_add = [[m + r for m, r in zip(mat_row, row)] for mat_row in matrix]\n\n# Multiply each row by row\nresult_mult = [[m * r for m, r in zip(mat_row, row)] for mat_row in matrix]\n\nprint('ROW BROADCASTING')\nprint('=' * 45)\nprint('Matrix:')\nfor r in matrix:\n    print(f'  {r}')\nprint(f'Row: {row}')\n\nprint('\\nMatrix + Row:')\nfor r in result_add:\n    print(f'  {r}')\n\nprint('\\nMatrix * Row:')\nfor r in result_mult:\n    print(f'  {r}')",
        solution: "# Row broadcast",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Broadcast results", description: "Row broadcasting" }]),
        hints: ["Row applies to each matrix row", "Use zip for element-wise", "Common for normalizing"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson24_1_3.id,
        number: 3,
        title: "Column Broadcasting",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Broadcast a column across a matrix.",
        starterCode: "# Column broadcasting\nmatrix = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\ncolumn = [10, 20, 30]  # Will be broadcast as column\n\n# Add column to each matrix column\n# column[i] adds to all elements in row i\nresult = [[m + column[i] for m in matrix[i]] for i in range(len(matrix))]\n\nprint('COLUMN BROADCASTING')\nprint('=' * 45)\nprint('Matrix:')\nfor r in matrix:\n    print(f'  {r}')\nprint(f'Column: {column} (applied vertically)')\n\nprint('\\nMatrix + Column:')\nfor r in result:\n    print(f'  {r}')\n\nprint('\\nVisualization:')\nprint('  [1,2,3] + 10 = [11,12,13]')\nprint('  [4,5,6] + 20 = [24,25,26]')\nprint('  [7,8,9] + 30 = [37,38,39]')\n\nprint('\\n💡 In NumPy: matrix + column.reshape(3,1)')",
        solution: "# Column broadcast",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Column broadcast", description: "Column broadcasting" }]),
        hints: ["Column value applies to entire row", "Each row gets different value", "Reshape to (n,1) in NumPy"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson24_1_3.id,
        number: 4,
        title: "Check Broadcast Compatibility",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Determine if two shapes can broadcast together.",
        starterCode: "def can_broadcast(shape1, shape2):\n    \"\"\"Check if shapes can broadcast\"\"\"\n    # Pad to same length\n    max_len = max(len(shape1), len(shape2))\n    s1 = (1,) * (max_len - len(shape1)) + tuple(shape1)\n    s2 = (1,) * (max_len - len(shape2)) + tuple(shape2)\n    \n    # Check each dimension\n    for d1, d2 in zip(s1, s2):\n        if d1 != d2 and d1 != 1 and d2 != 1:\n            return False\n    return True\n\ndef result_shape(shape1, shape2):\n    \"\"\"Get resulting shape after broadcast\"\"\"\n    max_len = max(len(shape1), len(shape2))\n    s1 = (1,) * (max_len - len(shape1)) + tuple(shape1)\n    s2 = (1,) * (max_len - len(shape2)) + tuple(shape2)\n    return tuple(max(d1, d2) for d1, d2 in zip(s1, s2))\n\ntest_cases = [\n    ((5,), (5,)),\n    ((5,), (1,)),\n    ((3, 4), (4,)),\n    ((3, 4), (3, 1)),\n    ((3, 4), (3,)),\n    ((2, 3, 4), (3, 4)),\n    ((2, 3, 4), (2, 1, 4)),\n]\n\nprint('BROADCAST COMPATIBILITY')\nprint('=' * 55)\nprint(f'{\"Shape 1\":>12} {\"Shape 2\":>12} {\"Compatible\":>12} {\"Result\":>12}')\nprint('-' * 55)\n\nfor s1, s2 in test_cases:\n    compat = can_broadcast(s1, s2)\n    res = result_shape(s1, s2) if compat else 'N/A'\n    mark = '✓' if compat else '✗'\n    print(f'{str(s1):>12} {str(s2):>12} {mark:>12} {str(res):>12}')",
        solution: "# Compatibility checked",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Compatibility table", description: "Check broadcast" }]),
        hints: ["Compare right-to-left", "1 matches anything", "Unequal non-1 fails"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson24_1_3.id,
        number: 5,
        title: "Normalize Data with Broadcasting",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use broadcasting to normalize matrix columns (z-score).",
        starterCode: "import math\n\n# Data matrix: rows are samples, columns are features\ndata = [\n    [70, 150, 30],\n    [80, 180, 25],\n    [65, 140, 35],\n    [90, 200, 28],\n]\nfeatures = ['Height', 'Weight', 'Age']\n\n# Calculate column means\ncol_means = [sum(row[i] for row in data) / len(data) for i in range(3)]\n\n# Calculate column stds\ncol_stds = []\nfor i in range(3):\n    variance = sum((row[i] - col_means[i])**2 for row in data) / len(data)\n    col_stds.append(math.sqrt(variance))\n\n# Normalize: (x - mean) / std\nnormalized = [[(row[i] - col_means[i]) / col_stds[i] for i in range(3)] for row in data]\n\nprint('NORMALIZE WITH BROADCASTING')\nprint('=' * 55)\nprint('Original data:')\nprint(f'  {features}')\nfor row in data:\n    print(f'  {row}')\n\nprint(f'\\nColumn means: {[round(m, 1) for m in col_means]}')\nprint(f'Column stds:  {[round(s, 1) for s in col_stds]}')\n\nprint('\\nNormalized (z-score):')\nfor row in normalized:\n    print(f'  [{row[0]:>6.2f}, {row[1]:>6.2f}, {row[2]:>6.2f}]')\n\nprint('\\n💡 NumPy: (data - data.mean(axis=0)) / data.std(axis=0)')",
        solution: "# Data normalized",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Normalized data", description: "Normalize with broadcast" }]),
        hints: ["Calculate mean per column", "Calculate std per column", "(x - mean) / std"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 24.1.3`);

  // Lesson 24.1.4
  const lesson24_1_4 = await prisma.lesson.upsert({
    where: { slug: "numpy-performance-tips" },
    update: {},
    create: {
      sectionId: section24_1.id,
      number: 24.14,
      title: "NumPy for Performance",
      slug: "numpy-performance-tips",
      objectives: [
        "Avoid common performance pitfalls",
        "Use views vs copies appropriately",
        "Optimize memory access patterns",
        "Profile and improve NumPy code",
      ],
      content: `# NumPy Performance Tips

## Golden Rules

1. **Avoid Python loops** over NumPy arrays
2. **Use vectorized operations** whenever possible
3. **Preallocate arrays** instead of growing them
4. **Use views** instead of copies when possible

## Views vs Copies

\`\`\`python
# View: shares memory with original
view = arr[::2]  # Every other element
view[0] = 99     # Changes arr too!

# Copy: independent data
copy = arr.copy()
copy[0] = 99     # arr unchanged
\`\`\`

## Memory Layout

\`\`\`python
# Row-major (C order) - default
# Accessing row-by-row is fast

# Column-major (Fortran order)
# Accessing column-by-column is fast
\`\`\`

## Common Pitfalls

❌ Growing arrays in a loop
❌ Converting to/from Python lists
❌ Unnecessary copies
❌ Wrong access pattern for memory layout

## Optimization Checklist

✅ Replace loops with vectorized operations
✅ Use appropriate dtype (int32 vs int64)
✅ Preallocate result arrays
✅ Use in-place operations when possible
✅ Profile before optimizing`,
      codeExamples: JSON.stringify([
        {
          id: "loop-vs-vectorized",
          title: "Loop vs Vectorized",
          code: "import time\n\ndef loop_approach(data):\n    \"\"\"Slow: Python loop\"\"\"\n    result = []\n    for x in data:\n        result.append(x ** 2 + 2 * x + 1)\n    return result\n\ndef vectorized_approach(data):\n    \"\"\"Fast: Vectorized (simulated)\"\"\"\n    # In NumPy: data ** 2 + 2 * data + 1\n    return [x ** 2 + 2 * x + 1 for x in data]\n\n# Test\ndata = list(range(100000))\n\nprint('LOOP vs VECTORIZED')\nprint('=' * 50)\n\nstart = time.time()\nresult1 = loop_approach(data)\nloop_time = (time.time() - start) * 1000\nprint(f'Loop approach: {loop_time:.2f}ms')\n\nstart = time.time()\nresult2 = vectorized_approach(data)\nvec_time = (time.time() - start) * 1000\nprint(f'List comprehension: {vec_time:.2f}ms')\n\nprint(f'\\nSpeedup: {loop_time/vec_time:.1f}x')\nprint(f'\\n💡 Real NumPy vectorization: ~{loop_time/50:.2f}ms')\nprint('   (Additional 20-50x speedup)')",
          description: "Compare loop vs vectorized",
        },
        {
          id: "preallocate",
          title: "Preallocate vs Grow",
          code: "import time\n\ndef grow_array(n):\n    \"\"\"Slow: Grow array dynamically\"\"\"\n    result = []\n    for i in range(n):\n        result.append(i ** 2)\n    return result\n\ndef preallocate_array(n):\n    \"\"\"Fast: Preallocate\"\"\"\n    result = [0] * n  # Preallocate\n    for i in range(n):\n        result[i] = i ** 2\n    return result\n\nn = 100000\n\nprint('PREALLOCATE vs GROW')\nprint('=' * 50)\n\nstart = time.time()\nresult1 = grow_array(n)\ngrow_time = (time.time() - start) * 1000\nprint(f'Growing array: {grow_time:.2f}ms')\n\nstart = time.time()\nresult2 = preallocate_array(n)\nprealloc_time = (time.time() - start) * 1000\nprint(f'Preallocated:  {prealloc_time:.2f}ms')\n\nprint(f'\\nSpeedup: {grow_time/prealloc_time:.1f}x')\nprint('\\n💡 Why preallocating helps:')\nprint('   Growing array → repeated memory reallocation')\nprint('   Preallocated → single allocation, direct writes')",
          description: "Preallocate for performance",
        },
        {
          id: "inplace",
          title: "In-place Operations",
          code: "# In-place operations save memory\n\n# Regular: creates new array\na = [1, 2, 3, 4, 5]\nb = [x * 2 for x in a]  # New list created\n\n# In-place: modifies existing\nc = [1, 2, 3, 4, 5]\nfor i in range(len(c)):\n    c[i] *= 2  # Modifies c directly\n\nprint('IN-PLACE OPERATIONS')\nprint('=' * 50)\n\nprint('Regular operation:')\nprint(f'  a = [1, 2, 3, 4, 5]')\nprint(f'  b = [x * 2 for x in a]')\nprint(f'  a is unchanged: {[1,2,3,4,5]}')\nprint(f'  b is new list: {[2,4,6,8,10]}')\n\nprint('\\nIn-place operation:')\nprint(f'  c = [1, 2, 3, 4, 5]')\nprint(f'  c[i] *= 2 for each i')\nprint(f'  c is modified: {c}')\n\nprint('\\n💡 NumPy in-place operators:')\nprint('   arr += 10   instead of   arr = arr + 10')\nprint('   arr *= 2    instead of   arr = arr * 2')\nprint('   np.add(a, b, out=a)  # Explicit output array')",
          description: "Save memory with in-place operations",
        },
      ]),
      keyPoints: [
        "Avoid Python loops over NumPy arrays",
        "Preallocate arrays, don't grow them",
        "Use in-place operations to save memory",
        "Understand views vs copies",
        "Match memory layout to access pattern",
        "Profile before optimizing",
      ],
      hardwareDemo: "Watch memory allocation patterns. See reallocation cost vs preallocation.",
      estimatedTime: 25,
      difficulty: "ADVANCED",
      order: 4,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson24_1_4.number}: ${lesson24_1_4.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson24_1_4.id,
        number: 1,
        title: "Replace Loop with Vectorization",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Convert a loop-based computation to vectorized form.",
        starterCode: "import time\n\n# Loop version\ndef compute_loop(data):\n    result = []\n    for x in data:\n        if x > 0:\n            result.append(x ** 0.5)\n        else:\n            result.append(0)\n    return result\n\n# Vectorized version (simulated)\ndef compute_vectorized(data):\n    # NumPy: np.where(data > 0, np.sqrt(data), 0)\n    return [x ** 0.5 if x > 0 else 0 for x in data]\n\ndata = list(range(-1000, 1000))\n\nprint('VECTORIZE THE LOOP')\nprint('=' * 45)\n\nstart = time.time()\nresult1 = compute_loop(data)\nloop_time = (time.time() - start) * 1000\nprint(f'Loop version: {loop_time:.3f}ms')\n\nstart = time.time()\nresult2 = compute_vectorized(data)\nvec_time = (time.time() - start) * 1000\nprint(f'Vectorized: {vec_time:.3f}ms')\n\nprint(f'\\n💡 NumPy equivalent:')\nprint('   np.where(data > 0, np.sqrt(data), 0)')",
        solution: "# Vectorized version",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Both work", description: "Vectorize loop" }]),
        hints: ["Use np.where for conditions", "Avoid explicit loops", "One expression for all"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson24_1_4.id,
        number: 2,
        title: "Preallocate Array",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Optimize code by preallocating the result array.",
        starterCode: "import time\n\ndef fibonacci_grow(n):\n    \"\"\"Growing list - inefficient\"\"\"\n    fib = [0, 1]\n    for i in range(2, n):\n        fib.append(fib[i-1] + fib[i-2])\n    return fib\n\ndef fibonacci_prealloc(n):\n    \"\"\"Preallocated - efficient\"\"\"\n    fib = [0] * n\n    fib[0], fib[1] = 0, 1\n    for i in range(2, n):\n        fib[i] = fib[i-1] + fib[i-2]\n    return fib\n\nn = 10000\n\nprint('PREALLOCATION OPTIMIZATION')\nprint('=' * 45)\n\nstart = time.time()\nresult1 = fibonacci_grow(n)\ngrow_time = (time.time() - start) * 1000\nprint(f'Growing list: {grow_time:.3f}ms')\n\nstart = time.time()\nresult2 = fibonacci_prealloc(n)\nprealloc_time = (time.time() - start) * 1000\nprint(f'Preallocated: {prealloc_time:.3f}ms')\n\nprint(f'\\nSpeedup: {grow_time/prealloc_time:.2f}x')\nprint(f'Results match: {result1[:10] == result2[:10]}')",
        solution: "# Preallocation is faster",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Speedup shown", description: "Preallocate" }]),
        hints: ["Allocate full size upfront", "Use index assignment", "Avoid append()"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson24_1_4.id,
        number: 3,
        title: "Avoid Unnecessary Copies",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Identify and avoid unnecessary data copies.",
        starterCode: "import sys\n\n# Original data\noriginal = list(range(1000))\n\nprint('AVOIDING UNNECESSARY COPIES')\nprint('=' * 50)\n\n# Bad: Multiple copies\ndef bad_approach(data):\n    step1 = [x for x in data]      # Copy 1\n    step2 = [x * 2 for x in step1] # Copy 2\n    step3 = [x + 1 for x in step2] # Copy 3\n    return step3\n\n# Good: Single pass\ndef good_approach(data):\n    return [x * 2 + 1 for x in data]  # One pass\n\nresult_bad = bad_approach(original)\nresult_good = good_approach(original)\n\nprint('Bad approach (3 copies):')\nprint('  step1 = [x for x in data]')\nprint('  step2 = [x * 2 for x in step1]')\nprint('  step3 = [x + 1 for x in step2]')\n\nprint('\\nGood approach (1 pass):')\nprint('  result = [x * 2 + 1 for x in data]')\n\nprint(f'\\nResults equal: {result_bad == result_good}')\nprint('\\n💡 NumPy: Combine operations, use in-place when possible')",
        solution: "# Copies minimized",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Optimized", description: "Avoid copies" }]),
        hints: ["Combine operations", "Fewer intermediate results", "Single pass is best"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson24_1_4.id,
        number: 4,
        title: "Memory-Efficient Operations",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use generators and in-place operations for memory efficiency.",
        starterCode: "import sys\n\n# Memory comparison\ndata_size = 10000\n\n# Full list in memory\nfull_list = [i ** 2 for i in range(data_size)]\nlist_memory = sys.getsizeof(full_list)\n\n# Generator (lazy evaluation)\ndef squares_generator(n):\n    for i in range(n):\n        yield i ** 2\n\ngen = squares_generator(data_size)\ngen_memory = sys.getsizeof(gen)\n\nprint('MEMORY-EFFICIENT OPERATIONS')\nprint('=' * 50)\n\nprint(f'List of {data_size} squares:')\nprint(f'  Memory: {list_memory:,} bytes')\n\nprint(f'\\nGenerator for {data_size} squares:')\nprint(f'  Memory: {gen_memory:,} bytes')\n\nprint(f'\\nMemory saved: {list_memory - gen_memory:,} bytes ({(1-gen_memory/list_memory)*100:.1f}%)')\n\nprint('\\n💡 NumPy in-place operations:')\nprint('   arr += 5      # Modifies arr directly')\nprint('   arr *= 2      # No new array created')\nprint('   np.sqrt(arr, out=arr)  # Explicit in-place')",
        solution: "# Memory efficient",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Memory comparison", description: "Memory efficiency" }]),
        hints: ["Generators are lazy", "In-place saves memory", "NumPy += is in-place"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson24_1_4.id,
        number: 5,
        title: "Performance Profiling",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Profile code to identify performance bottlenecks.",
        starterCode: "import time\n\ndef profile(func, *args, runs=5):\n    \"\"\"Simple profiler\"\"\"\n    times = []\n    for _ in range(runs):\n        start = time.time()\n        result = func(*args)\n        times.append((time.time() - start) * 1000)\n    return min(times), sum(times)/len(times), max(times)\n\n# Functions to profile\ndef method1(data):\n    \"\"\"Loop with append\"\"\"\n    result = []\n    for x in data:\n        result.append(x ** 2)\n    return result\n\ndef method2(data):\n    \"\"\"List comprehension\"\"\"\n    return [x ** 2 for x in data]\n\ndef method3(data):\n    \"\"\"Map function\"\"\"\n    return list(map(lambda x: x ** 2, data))\n\ndata = list(range(50000))\n\nprint('PERFORMANCE PROFILING')\nprint('=' * 55)\nprint(f'Data size: {len(data):,} elements')\nprint(f'Runs: 5 (reporting min/avg/max)\\n')\n\nprint(f'{\"Method\":<20} {\"Min\":>10} {\"Avg\":>10} {\"Max\":>10}')\nprint('-' * 55)\n\nfor name, func in [('Loop + append', method1), \n                   ('List comprehension', method2),\n                   ('Map + lambda', method3)]:\n    min_t, avg_t, max_t = profile(func, data)\n    print(f'{name:<20} {min_t:>10.2f} {avg_t:>10.2f} {max_t:>10.2f} ms')\n\nprint('\\n💡 Always profile before optimizing!')\nprint('   Focus on actual bottlenecks, not assumptions.')",
        solution: "# Performance profiled",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Profile results", description: "Profile code" }]),
        hints: ["Run multiple times", "Report min/avg/max", "Find actual bottleneck"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 24.1.4`);

  // Lesson 24.2.1
  const lesson24_2_1 = await prisma.lesson.upsert({
    where: { slug: "introduction-to-pandas" },
    update: {},
    create: {
      sectionId: section24_2.id,
      number: 24.21,
      title: "Introduction to Pandas",
      slug: "introduction-to-pandas",
      objectives: [
        "Understand what Pandas is and why it's essential",
        "Know the difference between Series and DataFrame",
        "Create DataFrames from various sources",
        "Perform basic data exploration",
      ],
      content: `# Introduction to Pandas

## What Is Pandas?

The **essential** library for data manipulation in Python.

- Built on top of NumPy
- Handles labeled, tabular data
- Powerful data cleaning and transformation
- Used in virtually every data science project

## Core Data Structures

### Series
A 1D labeled array (like a column).
\`\`\`python
s = pd.Series([1, 2, 3], index=['a', 'b', 'c'])
\`\`\`

### DataFrame
A 2D labeled table (like a spreadsheet).
\`\`\`python
df = pd.DataFrame({
    'name': ['Alice', 'Bob'],
    'age': [25, 30]
})
\`\`\`

## Creating DataFrames

\`\`\`python
# From dictionary
df = pd.DataFrame({'col1': [1,2], 'col2': [3,4]})

# From CSV
df = pd.read_csv('data.csv')

# From Excel
df = pd.read_excel('data.xlsx')
\`\`\`

## Basic Exploration

\`\`\`python
df.head()      # First 5 rows
df.tail()      # Last 5 rows
df.info()      # Column types, non-null counts
df.describe()  # Statistics for numeric columns
df.shape       # (rows, columns)
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "series-basics",
          title: "Pandas Series (Simulated)",
          code: "# Simulating Pandas Series\nclass SimpleSeries:\n    def __init__(self, data, index=None):\n        self.data = list(data)\n        self.index = index if index else list(range(len(data)))\n    \n    def __repr__(self):\n        lines = [f'{idx}    {val}' for idx, val in zip(self.index, self.data)]\n        return '\\n'.join(lines)\n    \n    def sum(self):\n        return sum(self.data)\n    \n    def mean(self):\n        return sum(self.data) / len(self.data)\n\n# Create a Series\ns = SimpleSeries([10, 20, 30, 40], index=['a', 'b', 'c', 'd'])\n\nprint('PANDAS SERIES')\nprint('=' * 40)\nprint('A labeled 1D array\\n')\nprint(s)\nprint(f'\\nSum: {s.sum()}')\nprint(f'Mean: {s.mean()}')\n\nprint('\\n💡 Real Pandas syntax:')\nprint('   s = pd.Series([10, 20, 30, 40], index=[\"a\", \"b\", \"c\", \"d\"])')\nprint('   s.sum(), s.mean(), s[\"b\"]')",
          description: "Understand Pandas Series",
        },
        {
          id: "dataframe-basics",
          title: "Pandas DataFrame (Simulated)",
          code: "# Simulating Pandas DataFrame\nclass SimpleDataFrame:\n    def __init__(self, data):\n        self.columns = list(data.keys())\n        self.data = data\n        self.shape = (len(list(data.values())[0]), len(self.columns))\n    \n    def head(self, n=5):\n        result = {col: self.data[col][:n] for col in self.columns}\n        return result\n    \n    def __repr__(self):\n        # Header\n        header = '   ' + '  '.join(f'{col:>10}' for col in self.columns)\n        lines = [header]\n        # Rows\n        n_rows = len(self.data[self.columns[0]])\n        for i in range(min(n_rows, 5)):\n            row = f'{i}  ' + '  '.join(f'{self.data[col][i]:>10}' for col in self.columns)\n            lines.append(row)\n        return '\\n'.join(lines)\n\n# Create DataFrame\ndf = SimpleDataFrame({\n    'name': ['Alice', 'Bob', 'Charlie', 'Diana'],\n    'age': [25, 30, 35, 28],\n    'salary': [50000, 60000, 70000, 55000]\n})\n\nprint('PANDAS DATAFRAME')\nprint('=' * 50)\nprint('A labeled 2D table\\n')\nprint(df)\nprint(f'\\nShape: {df.shape} (rows, columns)')\nprint(f'Columns: {df.columns}')\n\nprint('\\n💡 Real Pandas syntax:')\nprint('   df = pd.DataFrame({\"name\": [...], \"age\": [...]})')\nprint('   df.head(), df.shape, df.columns')",
          description: "Understand Pandas DataFrame",
        },
        {
          id: "exploration",
          title: "Data Exploration",
          code: "# Simulating data exploration functions\n\ndata = {\n    'product': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],\n    'price': [10, 25, 15, 30, 20, 35, 45, 50],\n    'quantity': [100, 50, 75, 25, 60, 40, 30, 20],\n    'category': ['X', 'Y', 'X', 'Y', 'X', 'Y', 'Z', 'Z']\n}\n\ndef head(data, n=5):\n    return {k: v[:n] for k, v in data.items()}\n\ndef describe(data):\n    numeric_cols = [k for k, v in data.items() if isinstance(v[0], (int, float))]\n    stats = {}\n    for col in numeric_cols:\n        values = data[col]\n        stats[col] = {\n            'count': len(values),\n            'mean': sum(values) / len(values),\n            'min': min(values),\n            'max': max(values)\n        }\n    return stats\n\nprint('DATA EXPLORATION')\nprint('=' * 55)\n\nprint('\\ndf.head(3):')\nfor k, v in head(data, 3).items():\n    print(f'  {k}: {v}')\n\nprint('\\ndf.describe() for numeric columns:')\nstats = describe(data)\nfor col, s in stats.items():\n    print(f'  {col}: count={s[\"count\"]}, mean={s[\"mean\"]:.1f}, min={s[\"min\"]}, max={s[\"max\"]}')\n\nprint('\\n💡 Real Pandas exploration:')\nprint('   df.head(), df.tail(), df.info(), df.describe()')",
          description: "Explore your data",
        },
      ]),
      keyPoints: [
        "Pandas: essential for data manipulation",
        "Series: 1D labeled array (column)",
        "DataFrame: 2D labeled table (spreadsheet)",
        "read_csv(), read_excel() load data",
        "head(), info(), describe() for exploration",
        "Built on NumPy, adds labels and functionality",
      ],
      hardwareDemo: "See DataFrame memory layout. Watch column-based operations.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson24_2_1.number}: ${lesson24_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson24_2_1.id,
        number: 1,
        title: "Create a DataFrame",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a DataFrame from a dictionary of data.",
        starterCode: "# Creating a DataFrame (simulated)\n\ndef create_dataframe(data):\n    \"\"\"Create DataFrame-like structure from dict\"\"\"\n    columns = list(data.keys())\n    n_rows = len(data[columns[0]])\n    return {'columns': columns, 'data': data, 'shape': (n_rows, len(columns))}\n\ndef display(df):\n    cols = df['columns']\n    data = df['data']\n    print('   ' + '  '.join(f'{c:>10}' for c in cols))\n    for i in range(df['shape'][0]):\n        print(f'{i}  ' + '  '.join(f'{data[c][i]:>10}' for c in cols))\n\n# Create employee data\nemployees = create_dataframe({\n    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],\n    'department': ['Sales', 'IT', 'IT', 'HR', 'Sales'],\n    'salary': [50000, 60000, 55000, 45000, 52000],\n    'years': [3, 5, 2, 7, 4]\n})\n\nprint('EMPLOYEE DATAFRAME')\nprint('=' * 55)\ndisplay(employees)\nprint(f'\\nShape: {employees[\"shape\"]}')\nprint(f'Columns: {employees[\"columns\"]}')",
        solution: "# DataFrame created",
        testCases: JSON.stringify([{ input: "", expectedOutput: "DataFrame shown", description: "Create DataFrame" }]),
        hints: ["Use dictionary with column names as keys", "Values are lists of same length", "Display in table format"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson24_2_1.id,
        number: 2,
        title: "Explore Data Structure",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Implement basic exploration functions for a DataFrame.",
        starterCode: "# Data exploration functions\n\ndata = {\n    'city': ['NYC', 'LA', 'Chicago', 'Houston', 'Phoenix'],\n    'population': [8336817, 3979576, 2693976, 2320268, 1680992],\n    'area_sqmi': [302.6, 468.7, 227.3, 670.6, 517.9]\n}\n\ndef head(data, n=5):\n    return {k: v[:n] for k, v in data.items()}\n\ndef tail(data, n=5):\n    return {k: v[-n:] for k, v in data.items()}\n\ndef info(data):\n    print('DataFrame Info:')\n    print(f'  Rows: {len(list(data.values())[0])}')\n    print(f'  Columns: {len(data)}')\n    for col, values in data.items():\n        dtype = type(values[0]).__name__\n        non_null = sum(1 for v in values if v is not None)\n        print(f'    {col}: {dtype}, {non_null} non-null')\n\nprint('DATA EXPLORATION')\nprint('=' * 50)\n\nprint('\\nhead(2):')\nfor k, v in head(data, 2).items():\n    print(f'  {k}: {v}')\n\nprint('\\ntail(2):')\nfor k, v in tail(data, 2).items():\n    print(f'  {k}: {v}')\n\nprint('\\ninfo():')\ninfo(data)",
        solution: "# Exploration functions",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Data explored", description: "Explore data" }]),
        hints: ["head() gets first n rows", "tail() gets last n rows", "info() shows structure"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson24_2_1.id,
        number: 3,
        title: "Calculate Statistics",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement describe() to calculate statistics for numeric columns.",
        starterCode: "import math\n\ndata = {\n    'name': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],\n    'value': [23, 45, 12, 67, 34, 89, 56, 78, 43, 21],\n    'count': [5, 8, 3, 12, 7, 15, 9, 11, 6, 4]\n}\n\ndef describe(data):\n    \"\"\"Calculate statistics for numeric columns\"\"\"\n    stats = {}\n    for col, values in data.items():\n        if not isinstance(values[0], (int, float)):\n            continue\n        n = len(values)\n        mean = sum(values) / n\n        sorted_v = sorted(values)\n        median = sorted_v[n//2] if n % 2 else (sorted_v[n//2-1] + sorted_v[n//2]) / 2\n        variance = sum((x - mean)**2 for x in values) / n\n        std = math.sqrt(variance)\n        stats[col] = {\n            'count': n,\n            'mean': mean,\n            'std': std,\n            'min': min(values),\n            '25%': sorted_v[n//4],\n            '50%': median,\n            '75%': sorted_v[3*n//4],\n            'max': max(values)\n        }\n    return stats\n\nprint('DESCRIBE() - STATISTICAL SUMMARY')\nprint('=' * 55)\n\nstats = describe(data)\nprint(f'{\"\":>8}', end='')\nfor col in stats:\n    print(f'{col:>12}', end='')\nprint()\n\nfor metric in ['count', 'mean', 'std', 'min', '25%', '50%', '75%', 'max']:\n    print(f'{metric:>8}', end='')\n    for col in stats:\n        val = stats[col][metric]\n        print(f'{val:>12.2f}' if isinstance(val, float) else f'{val:>12}', end='')\n    print()",
        solution: "# describe() implemented",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Statistics table", description: "Calculate statistics" }]),
        hints: ["Only numeric columns", "Calculate common stats", "Include percentiles"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson24_2_1.id,
        number: 4,
        title: "Access Columns and Rows",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Access specific columns and rows from a DataFrame.",
        starterCode: "# Accessing data\ndata = {\n    'product': ['Laptop', 'Phone', 'Tablet', 'Watch', 'Headphones'],\n    'price': [999, 699, 449, 299, 149],\n    'stock': [50, 200, 100, 150, 300]\n}\n\ndef get_column(data, col_name):\n    \"\"\"Get a single column (like df['column'])\"\"\"\n    return data[col_name]\n\ndef get_row(data, index):\n    \"\"\"Get a single row (like df.iloc[index])\"\"\"\n    return {col: values[index] for col, values in data.items()}\n\ndef get_rows(data, start, end):\n    \"\"\"Get row slice (like df.iloc[start:end])\"\"\"\n    return {col: values[start:end] for col, values in data.items()}\n\nprint('ACCESSING DATA')\nprint('=' * 50)\n\nprint('\\nColumn access: df[\"price\"]')\nprint(f'  {get_column(data, \"price\")}')\n\nprint('\\nRow access: df.iloc[0]')\nprint(f'  {get_row(data, 0)}')\n\nprint('\\nRow slice: df.iloc[1:3]')\nsliced = get_rows(data, 1, 3)\nfor col, vals in sliced.items():\n    print(f'  {col}: {vals}')\n\nprint('\\n💡 Pandas syntax:')\nprint('   df[\"price\"]        # Column by name')\nprint('   df.iloc[0]         # Row by position')\nprint('   df.loc[0]          # Row by label')",
        solution: "# Data accessed",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Access patterns", description: "Access data" }]),
        hints: ["Column: use column name", "Row: use index", "Slice: start:end"],
        xpReward: 10,
        order: 4,
      },
      {
        lessonId: lesson24_2_1.id,
        number: 5,
        title: "Data Types and Missing Values",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Check data types and handle missing values.",
        starterCode: "# Data with mixed types and missing values\ndata = {\n    'id': [1, 2, 3, 4, 5],\n    'name': ['Alice', 'Bob', None, 'Diana', 'Eve'],\n    'score': [85.5, None, 72.0, 90.5, None],\n    'passed': [True, True, False, True, False]\n}\n\ndef dtypes(data):\n    \"\"\"Get data types for each column\"\"\"\n    types = {}\n    for col, values in data.items():\n        non_null = [v for v in values if v is not None]\n        types[col] = type(non_null[0]).__name__ if non_null else 'unknown'\n    return types\n\ndef count_null(data):\n    \"\"\"Count null values per column\"\"\"\n    return {col: sum(1 for v in values if v is None) \n            for col, values in data.items()}\n\ndef dropna(data):\n    \"\"\"Remove rows with any null values\"\"\"\n    n_rows = len(list(data.values())[0])\n    valid_rows = [i for i in range(n_rows) \n                  if all(data[col][i] is not None for col in data)]\n    return {col: [values[i] for i in valid_rows] for col, values in data.items()}\n\nprint('DATA TYPES AND MISSING VALUES')\nprint('=' * 50)\n\nprint('\\nData types:')\nfor col, dtype in dtypes(data).items():\n    print(f'  {col}: {dtype}')\n\nprint('\\nNull counts:')\nfor col, count in count_null(data).items():\n    print(f'  {col}: {count} null values')\n\nprint('\\nAfter dropna():')\ncleaned = dropna(data)\nprint(f'  Rows: {len(list(data.values())[0])} → {len(list(cleaned.values())[0])}')",
        solution: "# Types and nulls handled",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Types and nulls", description: "Data types" }]),
        hints: ["Check type of first non-null", "Count None values", "dropna removes null rows"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 24.2.1`);

  // Lesson 24.2.2
  const lesson24_2_2 = await prisma.lesson.upsert({
    where: { slug: "dataframes-and-series" },
    update: {},
    create: {
      sectionId: section24_2.id,
      number: 24.22,
      title: "DataFrames and Series",
      slug: "dataframes-and-series",
      objectives: [
        "Work with Series operations",
        "Manipulate DataFrame columns",
        "Add, remove, and modify columns",
        "Apply functions to data",
      ],
      content: `# DataFrames and Series Operations

## Series Operations

\`\`\`python
# Arithmetic
s + 10, s * 2, s ** 2

# String operations
s.str.lower(), s.str.contains('x')

# Aggregations
s.sum(), s.mean(), s.max()
\`\`\`

## Column Operations

\`\`\`python
# Select column (returns Series)
df['column']

# Select multiple columns
df[['col1', 'col2']]

# Add new column
df['new'] = df['a'] + df['b']

# Remove column
df.drop('column', axis=1)
\`\`\`

## Apply Functions

\`\`\`python
# Apply to column
df['col'].apply(lambda x: x * 2)

# Apply to row
df.apply(lambda row: row['a'] + row['b'], axis=1)

# Map values
df['col'].map({'old': 'new'})
\`\`\`

## Common Operations

\`\`\`python
# Sort
df.sort_values('column')
df.sort_values(['col1', 'col2'], ascending=[True, False])

# Unique values
df['col'].unique()
df['col'].nunique()  # count of unique

# Value counts
df['col'].value_counts()
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "column-operations",
          title: "Column Operations",
          code: "# Column operations (simulated)\ndata = {\n    'name': ['Alice', 'Bob', 'Charlie'],\n    'age': [25, 30, 35],\n    'salary': [50000, 60000, 70000]\n}\n\n# Add new column\ndata['bonus'] = [s * 0.1 for s in data['salary']]\n\n# Calculate derived column\ndata['total_comp'] = [s + b for s, b in zip(data['salary'], data['bonus'])]\n\nprint('COLUMN OPERATIONS')\nprint('=' * 60)\n\nprint('\\nOriginal + derived columns:')\ncols = list(data.keys())\nprint('   ' + '  '.join(f'{c:>10}' for c in cols))\nfor i in range(len(data['name'])):\n    row = [data[c][i] for c in cols]\n    print(f'{i}  ' + '  '.join(f'{v:>10}' for v in row))\n\nprint('\\n💡 Pandas syntax:')\nprint('   df[\"bonus\"] = df[\"salary\"] * 0.1')\nprint('   df[\"total_comp\"] = df[\"salary\"] + df[\"bonus\"]')",
          description: "Add and calculate columns",
        },
        {
          id: "apply-functions",
          title: "Apply Functions",
          code: "# Apply functions to data\ndata = {\n    'name': ['alice', 'bob', 'charlie'],\n    'score': [75, 85, 92]\n}\n\n# Apply to column - capitalize names\ndata['name_upper'] = [n.upper() for n in data['name']]\n\n# Apply function - grade based on score\ndef get_grade(score):\n    if score >= 90: return 'A'\n    if score >= 80: return 'B'\n    if score >= 70: return 'C'\n    return 'F'\n\ndata['grade'] = [get_grade(s) for s in data['score']]\n\nprint('APPLY FUNCTIONS')\nprint('=' * 50)\n\nfor col in data:\n    print(f'{col:>12}: {data[col]}')\n\nprint('\\n💡 Pandas syntax:')\nprint('   df[\"name\"].str.upper()')\nprint('   df[\"score\"].apply(get_grade)')\nprint('   df[\"score\"].apply(lambda x: \"Pass\" if x >= 70 else \"Fail\")')",
          description: "Apply custom functions",
        },
        {
          id: "sorting-unique",
          title: "Sorting and Unique Values",
          code: "# Sorting and unique values\ndata = {\n    'product': ['A', 'B', 'C', 'D', 'E', 'F'],\n    'category': ['X', 'Y', 'X', 'Y', 'X', 'Z'],\n    'price': [30, 25, 40, 35, 20, 45]\n}\n\n# Sort by price\nindices = sorted(range(len(data['price'])), key=lambda i: data['price'][i])\nsorted_by_price = {col: [data[col][i] for i in indices] for col in data}\n\n# Unique values\nunique_categories = list(set(data['category']))\n\n# Value counts\nfrom collections import Counter\nvalue_counts = Counter(data['category'])\n\nprint('SORTING AND UNIQUE VALUES')\nprint('=' * 50)\n\nprint('\\nSorted by price:')\nfor i in range(len(sorted_by_price['product'])):\n    print(f'  {sorted_by_price[\"product\"][i]}: ${sorted_by_price[\"price\"][i]}')\n\nprint(f'\\nUnique categories: {unique_categories}')\nprint(f'Number of unique: {len(unique_categories)}')\n\nprint(f'\\nValue counts for category:')\nfor cat, count in value_counts.most_common():\n    print(f'  {cat}: {count}')\n\nprint('\\n💡 Pandas syntax:')\nprint('   df.sort_values(\"price\")')\nprint('   df[\"category\"].unique()')\nprint('   df[\"category\"].value_counts()')",
          description: "Sort and find unique values",
        },
      ]),
      keyPoints: [
        "Series: 1D operations (+, -, str methods)",
        "Add columns: df['new'] = ...",
        "apply(): custom function to each element",
        "sort_values(): sort by columns",
        "unique(): distinct values",
        "value_counts(): frequency of values",
      ],
      hardwareDemo: "Watch column operations vectorize. See apply transform each row.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson24_2_2.number}: ${lesson24_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson24_2_2.id,
        number: 1,
        title: "Add Calculated Columns",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add new columns based on calculations from existing columns.",
        starterCode: "# Sales data\ndata = {\n    'product': ['Laptop', 'Phone', 'Tablet', 'Watch'],\n    'price': [999, 699, 449, 299],\n    'quantity': [50, 200, 100, 150]\n}\n\n# Add revenue column (price * quantity)\ndata['revenue'] = [p * q for p, q in zip(data['price'], data['quantity'])]\n\n# Add tax column (10% of revenue)\ndata['tax'] = [r * 0.10 for r in data['revenue']]\n\n# Add net revenue\ndata['net_revenue'] = [r - t for r, t in zip(data['revenue'], data['tax'])]\n\nprint('CALCULATED COLUMNS')\nprint('=' * 70)\n\ncols = list(data.keys())\nprint('  '.join(f'{c:>12}' for c in cols))\nprint('-' * 70)\nfor i in range(len(data['product'])):\n    row = [data[c][i] for c in cols]\n    formatted = [f'{v:>12}' if isinstance(v, str) else f'{v:>12,.0f}' for v in row]\n    print('  '.join(formatted))\n\nprint(f'\\nTotal revenue: ${sum(data[\"revenue\"]):,.0f}')\nprint(f'Total tax: ${sum(data[\"tax\"]):,.0f}')",
        solution: "# Columns calculated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "New columns added", description: "Calculated columns" }]),
        hints: ["Multiply columns element-wise", "Chain calculations", "Can reference new columns"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson24_2_2.id,
        number: 2,
        title: "Apply Custom Functions",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use apply() to transform data with custom functions.",
        starterCode: "# Student data\ndata = {\n    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],\n    'score': [92, 78, 85, 65, 88]\n}\n\n# Function to assign letter grade\ndef letter_grade(score):\n    if score >= 90: return 'A'\n    if score >= 80: return 'B'\n    if score >= 70: return 'C'\n    if score >= 60: return 'D'\n    return 'F'\n\n# Function to check pass/fail\ndef pass_fail(score):\n    return 'Pass' if score >= 70 else 'Fail'\n\n# Apply functions\ndata['grade'] = [letter_grade(s) for s in data['score']]\ndata['status'] = [pass_fail(s) for s in data['score']]\ndata['curved_score'] = [min(100, s + 5) for s in data['score']]  # 5 point curve\n\nprint('APPLYING CUSTOM FUNCTIONS')\nprint('=' * 55)\n\nfor col in data:\n    print(f'{col:>12}: {data[col]}')\n\nprint('\\n💡 Pandas: df[\"grade\"] = df[\"score\"].apply(letter_grade)')",
        solution: "# Functions applied",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Transformed data", description: "Apply functions" }]),
        hints: ["Define function first", "Apply to create new column", "Can use lambda too"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson24_2_2.id,
        number: 3,
        title: "Sort and Rank Data",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Sort DataFrame by one or more columns and add ranking.",
        starterCode: "# Competition results\ndata = {\n    'athlete': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],\n    'country': ['USA', 'GBR', 'USA', 'CAN', 'GBR'],\n    'score': [9.5, 9.7, 9.3, 9.8, 9.6]\n}\n\n# Sort by score descending\nindices = sorted(range(len(data['score'])), key=lambda i: -data['score'][i])\nsorted_data = {col: [data[col][i] for i in indices] for col in data}\n\n# Add rank\nsorted_data['rank'] = list(range(1, len(sorted_data['athlete']) + 1))\n\n# Add medal\ndef get_medal(rank):\n    if rank == 1: return '🥇'\n    if rank == 2: return '🥈'\n    if rank == 3: return '🥉'\n    return ''\n\nsorted_data['medal'] = [get_medal(r) for r in sorted_data['rank']]\n\nprint('SORTED AND RANKED DATA')\nprint('=' * 55)\n\nprint(f'{\"Rank\":>6} {\"Athlete\":>10} {\"Country\":>10} {\"Score\":>8} {\"Medal\":>6}')\nprint('-' * 45)\nfor i in range(len(sorted_data['athlete'])):\n    print(f'{sorted_data[\"rank\"][i]:>6} {sorted_data[\"athlete\"][i]:>10} '\n          f'{sorted_data[\"country\"][i]:>10} {sorted_data[\"score\"][i]:>8.1f} '\n          f'{sorted_data[\"medal\"][i]:>6}')",
        solution: "# Sorted and ranked",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Ranked results", description: "Sort and rank" }]),
        hints: ["Sort indices first", "Reorder all columns", "Add rank as new column"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson24_2_2.id,
        number: 4,
        title: "Value Counts and Unique",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Analyze categorical data with unique values and value counts.",
        starterCode: "from collections import Counter\n\n# Survey data\ndata = {\n    'respondent': list(range(1, 21)),\n    'age_group': ['18-25', '26-35', '18-25', '36-45', '26-35', \n                  '18-25', '26-35', '46+', '26-35', '18-25',\n                  '36-45', '18-25', '26-35', '36-45', '18-25',\n                  '46+', '26-35', '18-25', '36-45', '26-35'],\n    'rating': [5, 4, 5, 3, 4, 5, 4, 3, 4, 5,\n               4, 5, 3, 4, 5, 2, 4, 5, 4, 3]\n}\n\n# Unique values\nunique_ages = list(set(data['age_group']))\nunique_ratings = sorted(set(data['rating']))\n\n# Value counts\nage_counts = Counter(data['age_group'])\nrating_counts = Counter(data['rating'])\n\nprint('VALUE COUNTS AND UNIQUE')\nprint('=' * 50)\n\nprint(f'\\nUnique age groups: {unique_ages}')\nprint(f'Number of unique: {len(unique_ages)}')\n\nprint('\\nAge group distribution:')\nfor age, count in sorted(age_counts.items()):\n    pct = count / len(data['age_group']) * 100\n    bar = '█' * int(pct / 5)\n    print(f'  {age:>6}: {count:>3} ({pct:>5.1f}%) {bar}')\n\nprint('\\nRating distribution:')\nfor rating in unique_ratings:\n    count = rating_counts[rating]\n    bar = '★' * count\n    print(f'  {rating}: {bar} ({count})')",
        solution: "# Analysis complete",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Distributions shown", description: "Value counts" }]),
        hints: ["set() for unique", "Counter for counts", "Calculate percentages"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson24_2_2.id,
        number: 5,
        title: "String Operations",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Perform string operations on text columns.",
        starterCode: "# Customer data with text\ndata = {\n    'full_name': ['John Smith', 'Jane Doe', 'Bob Johnson', 'Alice Williams'],\n    'email': ['john@GMAIL.com', 'jane@yahoo.COM', 'bob@gmail.com', 'ALICE@outlook.com'],\n    'phone': ['555-1234', '555-5678', '555-9012', '555-3456']\n}\n\n# String operations\n\n# Extract first name\ndata['first_name'] = [name.split()[0] for name in data['full_name']]\n\n# Extract last name\ndata['last_name'] = [name.split()[-1] for name in data['full_name']]\n\n# Normalize email (lowercase)\ndata['email_clean'] = [e.lower() for e in data['email']]\n\n# Check email domain\ndata['domain'] = [e.split('@')[1].lower() for e in data['email']]\n\n# Format phone\ndata['phone_formatted'] = ['(' + p[:3] + ') ' + p[4:] for p in data['phone']]\n\nprint('STRING OPERATIONS')\nprint('=' * 65)\n\nfor col in ['full_name', 'first_name', 'last_name']:\n    print(f'{col:>15}: {data[col]}')\n\nprint()\nfor col in ['email', 'email_clean', 'domain']:\n    print(f'{col:>15}: {data[col]}')\n\nprint('\\n💡 Pandas: df[\"email\"].str.lower(), df[\"name\"].str.split()')",
        solution: "# String operations",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Text processed", description: "String operations" }]),
        hints: ["split() for words", "lower() to normalize", "Use string indexing"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 24.2.2`);

  console.log("\n✅ Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
