import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Chapter 5: Structured Types, Mutability, and Higher-Order Functions...");

  // Create Chapter 5
  const chapter5 = await prisma.chapter.upsert({
    where: { number: 5 },
    update: {},
    create: {
      number: 5,
      title: "Structured Types, Mutability, and Higher-Order Functions",
      description: "Master Python's built-in data structures including tuples, lists, dictionaries, and sets. Understand mutability and learn functional programming concepts.",
      objectives: [
        "Work with tuples and understand immutability",
        "Master lists and understand mutability and aliasing",
        "Use dictionaries for key-value storage",
        "Apply set operations for unique collections",
        "Write list comprehensions for elegant code",
        "Use higher-order functions and lambdas",
      ],
      isPublished: true,
    },
  });

  console.log("✅ Created Chapter 5:", chapter5.title);

  // Create Sections
  const section5_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter5.id, number: 5.1 } },
    update: {},
    create: {
      chapterId: chapter5.id,
      number: 5.1,
      title: "Tuples",
      description: "Immutable sequences of values",
      order: 1,
    },
  });

  const section5_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter5.id, number: 5.2 } },
    update: {},
    create: {
      chapterId: chapter5.id,
      number: 5.2,
      title: "Lists and Mutability",
      description: "Mutable sequences and their behavior",
      order: 2,
    },
  });

  const section5_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter5.id, number: 5.3 } },
    update: {},
    create: {
      chapterId: chapter5.id,
      number: 5.3,
      title: "Functions as Objects",
      description: "Treating functions as first-class citizens",
      order: 3,
    },
  });

  const section5_4 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter5.id, number: 5.4 } },
    update: {},
    create: {
      chapterId: chapter5.id,
      number: 5.4,
      title: "Dictionaries",
      description: "Key-value mappings",
      order: 4,
    },
  });

  const section5_5 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter5.id, number: 5.5 } },
    update: {},
    create: {
      chapterId: chapter5.id,
      number: 5.5,
      title: "Sets",
      description: "Unordered collections of unique elements",
      order: 5,
    },
  });

  const section5_6 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter5.id, number: 5.6 } },
    update: {},
    create: {
      chapterId: chapter5.id,
      number: 5.6,
      title: "Comprehensions and Higher-Order Functions",
      description: "Elegant ways to create and transform collections",
      order: 6,
    },
  });

  // ==================== LESSON 5.1.1: Introduction to Tuples ====================
  const lesson5_1_1 = await prisma.lesson.upsert({
    where: { slug: "intro-tuples" },
    update: {},
    create: {
      sectionId: section5_1.id,
      number: 5.11,
      title: "Introduction to Tuples",
      slug: "intro-tuples",
      objectives: [
        "Create tuples using parentheses and commas",
        "Access tuple elements by index",
        "Understand tuple immutability",
        "Use tuples for fixed collections",
      ],
      content: `# Introduction to Tuples

A **tuple** is an ordered, immutable sequence of elements. Once created, a tuple cannot be changed.

## Creating Tuples

Use parentheses (or just commas):

\`\`\`python
# With parentheses
point = (3, 4)
rgb = (255, 128, 0)

# Without parentheses (comma makes it a tuple)
coords = 10, 20, 30

# Single element tuple (needs trailing comma!)
single = (42,)  # This is a tuple
not_tuple = (42)  # This is just 42
\`\`\`

## Accessing Elements

Use indexing (just like strings):

\`\`\`python
point = (3, 4, 5)
print(point[0])   # 3
print(point[-1])  # 5
print(point[1:])  # (4, 5)
\`\`\`

## Tuples Are Immutable

You CANNOT modify a tuple after creation:

\`\`\`python
point = (3, 4)
# point[0] = 10  # ERROR! TypeError

# Create a new tuple instead
point = (10, point[1])  # (10, 4)
\`\`\`

## Why Use Tuples?

1. **Safety**: Can't accidentally modify data
2. **Performance**: Slightly faster than lists
3. **Dictionary keys**: Tuples can be dict keys (lists can't)
4. **Multiple return values**: Functions return tuples
5. **Unpacking**: Easy to extract values

## Common Operations

\`\`\`python
t = (1, 2, 3, 2, 1)
len(t)       # 5
t.count(2)   # 2 (how many 2s)
t.index(3)   # 2 (position of 3)
2 in t       # True
\`\`\`

## Hardware View

In memory, tuples are stored as contiguous blocks. Their immutability means the memory layout is fixed at creation.`,
      codeExamples: JSON.stringify([
        {
          id: "create-tuples",
          title: "Creating Tuples",
          code: `# Different ways to create tuples
point = (3, 4)
rgb_color = (255, 128, 0)
mixed = (1, "hello", 3.14, True)

# Single element needs comma
single = (42,)
not_tuple = (42)

print(f"point: {point}, type: {type(point)}")
print(f"single: {single}, type: {type(single)}")
print(f"not_tuple: {not_tuple}, type: {type(not_tuple)}")`,
          description: "Various ways to create tuples",
        },
        {
          id: "tuple-indexing",
          title: "Accessing Tuple Elements",
          code: `coords = (10, 20, 30, 40, 50)

print(f"First: {coords[0]}")
print(f"Last: {coords[-1]}")
print(f"Slice [1:4]: {coords[1:4]}")
print(f"Length: {len(coords)}")`,
          description: "Index and slice tuples like strings",
        },
        {
          id: "tuple-immutable",
          title: "Tuples Are Immutable",
          code: `point = (3, 4)
print(f"Original: {point}")

# Can't modify - this would error:
# point[0] = 10

# Instead, create a new tuple
point = (10, point[1])
print(f"New tuple: {point}")`,
          description: "Tuples cannot be modified in place",
        },
        {
          id: "tuple-operations",
          title: "Tuple Operations",
          code: `t = (1, 2, 3, 2, 1)

print(f"Length: {len(t)}")
print(f"Count of 2: {t.count(2)}")
print(f"Index of 3: {t.index(3)}")
print(f"2 in tuple: {2 in t}")
print(f"Concatenate: {t + (4, 5)}")`,
          description: "Common operations on tuples",
        },
      ]),
      keyPoints: [
        "Tuples are ordered, immutable sequences",
        "Create with parentheses: (1, 2, 3)",
        "Single element needs comma: (42,)",
        "Access elements with indexing: t[0]",
        "Cannot modify after creation",
        "Use count() and index() methods",
      ],
      hardwareDemo: "Watch tuple elements stored in contiguous memory. Notice that unlike lists, tuples don't need extra space for growth since they can't change.",
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
        lessonId: lesson5_1_1.id,
        number: 1,
        title: "Create a Point",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a tuple called `point` with values (5, 10) and print it.",
        starterCode: `# Create a tuple
point = 

print(point)`,
        solution: `point = (5, 10)
print(point)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "(5, 10)", description: "Should print the tuple" },
        ]),
        hints: ["Use parentheses: (5, 10)", "Assign to variable point", "Print shows the tuple"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_1_1.id,
        number: 2,
        title: "Access Second Element",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given the tuple `colors = ('red', 'green', 'blue')`, print the second element.",
        starterCode: `colors = ('red', 'green', 'blue')

# Print the second element (index 1)
print()`,
        solution: `colors = ('red', 'green', 'blue')
print(colors[1])`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "green", description: "Second element is green" },
        ]),
        hints: ["Indexing starts at 0", "Second element is at index 1", "colors[1]"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson5_1_1.id,
        number: 3,
        title: "Count Occurrences",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Count how many times 5 appears in the tuple `numbers = (1, 5, 3, 5, 7, 5, 9)`.",
        starterCode: `numbers = (1, 5, 3, 5, 7, 5, 9)

# Count how many 5s
count = 
print(count)`,
        solution: `numbers = (1, 5, 3, 5, 7, 5, 9)
count = numbers.count(5)
print(count)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "3", description: "5 appears 3 times" },
        ]),
        hints: ["Use the count() method", "numbers.count(5)", "Returns how many times 5 appears"],
        xpReward: 15,
        order: 3,
      },
    ],
  });

  console.log("✅ Created Lesson 5.1.1: Introduction to Tuples");

  // ==================== LESSON 5.1.2: Tuple Unpacking ====================
  const lesson5_1_2 = await prisma.lesson.upsert({
    where: { slug: "tuple-unpacking" },
    update: {},
    create: {
      sectionId: section5_1.id,
      number: 5.12,
      title: "Tuple Operations and Unpacking",
      slug: "tuple-unpacking",
      objectives: [
        "Unpack tuples into individual variables",
        "Use tuple unpacking in loops",
        "Swap variables using tuple unpacking",
        "Handle multiple return values",
      ],
      content: `# Tuple Operations and Unpacking

**Tuple unpacking** is one of Python's most elegant features - it lets you assign tuple elements to multiple variables at once.

## Basic Unpacking

\`\`\`python
point = (3, 4)
x, y = point  # Unpacking!
print(x)  # 3
print(y)  # 4
\`\`\`

The number of variables must match the tuple length.

## Swapping Variables

One of the coolest uses - swap without a temp variable:

\`\`\`python
a = 10
b = 20
a, b = b, a  # Swap!
print(a, b)  # 20 10
\`\`\`

## Unpacking in Loops

Perfect for iterating over pairs:

\`\`\`python
points = [(1, 2), (3, 4), (5, 6)]
for x, y in points:
    print(f"x={x}, y={y}")
\`\`\`

## Extended Unpacking (Python 3)

Use \`*\` to capture remaining elements:

\`\`\`python
first, *rest = (1, 2, 3, 4, 5)
print(first)  # 1
print(rest)   # [2, 3, 4, 5]

first, *middle, last = (1, 2, 3, 4, 5)
print(first)   # 1
print(middle)  # [2, 3, 4]
print(last)    # 5
\`\`\`

## Multiple Return Values

Functions often return tuples:

\`\`\`python
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([3, 1, 4, 1, 5])
print(f"Min: {low}, Max: {high}")
\`\`\`

## Ignoring Values

Use \`_\` for values you don't need:

\`\`\`python
name, _, age = ("Alice", "ignored", 30)
print(name, age)  # Alice 30
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-unpack",
          title: "Basic Unpacking",
          code: `point = (10, 20)
x, y = point

print(f"x = {x}")
print(f"y = {y}")`,
          description: "Assign tuple elements to variables",
        },
        {
          id: "swap-variables",
          title: "Swapping Variables",
          code: `a = "first"
b = "second"

print(f"Before: a={a}, b={b}")

a, b = b, a  # Swap in one line!

print(f"After: a={a}, b={b}")`,
          description: "Elegant variable swapping",
        },
        {
          id: "loop-unpack",
          title: "Unpacking in Loops",
          code: `students = [
    ("Alice", 95),
    ("Bob", 87),
    ("Charlie", 92)
]

for name, score in students:
    print(f"{name} scored {score}")`,
          description: "Unpack tuples while iterating",
        },
        {
          id: "extended-unpack",
          title: "Extended Unpacking",
          code: `numbers = (1, 2, 3, 4, 5)

first, *rest = numbers
print(f"First: {first}, Rest: {rest}")

first, *middle, last = numbers
print(f"First: {first}, Middle: {middle}, Last: {last}")`,
          description: "Capture multiple elements with *",
        },
      ]),
      keyPoints: [
        "Unpacking assigns tuple elements to variables",
        "Number of variables must match tuple length",
        "Swap with: a, b = b, a",
        "Use in for loops: for x, y in pairs",
        "Extended unpacking: first, *rest = tuple",
        "Use _ for ignored values",
      ],
      hardwareDemo: "Watch values flow from tuple memory slots into individual variable locations during unpacking.",
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_1_2.id,
        number: 1,
        title: "Unpack Coordinates",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Unpack the tuple `coords = (100, 200)` into variables `x` and `y`, then print both.",
        starterCode: `coords = (100, 200)

# Unpack into x and y

print(x)
print(y)`,
        solution: `coords = (100, 200)
x, y = coords
print(x)
print(y)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "100\n200", description: "Should print x and y" },
        ]),
        hints: ["x, y = coords", "Left side matches tuple structure", "Two variables for two elements"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_1_2.id,
        number: 2,
        title: "Swap Numbers",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Swap the values of `a` and `b` using tuple unpacking, then print both.",
        starterCode: `a = 5
b = 10

# Swap a and b

print(a)
print(b)`,
        solution: `a = 5
b = 10
a, b = b, a
print(a)
print(b)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "10\n5", description: "Values should be swapped" },
        ]),
        hints: ["Use: a, b = b, a", "Right side creates tuple (b, a)", "Then unpacks into a, b"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson5_1_2.id,
        number: 3,
        title: "Loop Through Pairs",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Print each person's name and age from the list of tuples.",
        starterCode: `people = [("Alice", 25), ("Bob", 30), ("Charlie", 35)]

for name, age in people:
    print(f"{name} is {age}")`,
        solution: `people = [("Alice", 25), ("Bob", 30), ("Charlie", 35)]

for name, age in people:
    print(f"{name} is {age}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Alice is 25\nBob is 30\nCharlie is 35", description: "Should print all people" },
        ]),
        hints: ["Unpack in the for loop", "for name, age in people", "Each tuple becomes name, age"],
        xpReward: 15,
        order: 3,
      },
    ],
  });

  console.log("✅ Created Lesson 5.1.2: Tuple Unpacking");

  // ==================== LESSON 5.2.1: Introduction to Lists ====================
  const lesson5_2_1 = await prisma.lesson.upsert({
    where: { slug: "intro-lists" },
    update: {},
    create: {
      sectionId: section5_2.id,
      number: 5.21,
      title: "Introduction to Lists",
      slug: "intro-lists",
      objectives: [
        "Create lists using square brackets",
        "Access and modify list elements",
        "Understand that lists are mutable",
        "Use common list operations",
      ],
      content: `# Introduction to Lists

A **list** is an ordered, **mutable** sequence. Unlike tuples, lists can be changed after creation.

## Creating Lists

Use square brackets:

\`\`\`python
numbers = [1, 2, 3, 4, 5]
names = ["Alice", "Bob", "Charlie"]
mixed = [1, "hello", 3.14, True]
empty = []
\`\`\`

## Accessing Elements

Same indexing as tuples and strings:

\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])   # "apple"
print(fruits[-1])  # "cherry"
print(fruits[1:])  # ["banana", "cherry"]
\`\`\`

## Lists Are Mutable!

You CAN modify list elements:

\`\`\`python
fruits = ["apple", "banana", "cherry"]
fruits[0] = "apricot"  # Replace first element
print(fruits)  # ["apricot", "banana", "cherry"]
\`\`\`

## Common Operations

\`\`\`python
nums = [1, 2, 3]

# Add elements
nums.append(4)       # [1, 2, 3, 4]
nums.insert(0, 0)    # [0, 1, 2, 3, 4]

# Remove elements
nums.remove(2)       # Remove first 2
nums.pop()           # Remove & return last
nums.pop(0)          # Remove & return first

# Other operations
len(nums)            # Length
nums.reverse()       # Reverse in place
nums.sort()          # Sort in place
\`\`\`

## List vs Tuple

| Feature | List | Tuple |
|---------|------|-------|
| Syntax | [1, 2, 3] | (1, 2, 3) |
| Mutable | Yes | No |
| Use when | Data may change | Data should not change |`,
      codeExamples: JSON.stringify([
        {
          id: "create-lists",
          title: "Creating Lists",
          code: `numbers = [1, 2, 3, 4, 5]
names = ["Alice", "Bob", "Charlie"]
mixed = [1, "hello", True, 3.14]
empty = []

print(f"Numbers: {numbers}")
print(f"Names: {names}")
print(f"Mixed: {mixed}")
print(f"Empty: {empty}")`,
          description: "Different types of lists",
        },
        {
          id: "list-indexing",
          title: "Accessing Elements",
          code: `fruits = ["apple", "banana", "cherry", "date"]

print(f"First: {fruits[0]}")
print(f"Last: {fruits[-1]}")
print(f"Slice [1:3]: {fruits[1:3]}")
print(f"Length: {len(fruits)}")`,
          description: "Index and slice lists",
        },
        {
          id: "list-mutable",
          title: "Lists Are Mutable",
          code: `colors = ["red", "green", "blue"]
print(f"Original: {colors}")

colors[0] = "yellow"  # Modify element
print(f"Modified: {colors}")

colors.append("purple")  # Add element
print(f"Extended: {colors}")`,
          description: "Lists can be changed",
        },
        {
          id: "list-operations",
          title: "Common Operations",
          code: `nums = [3, 1, 4, 1, 5]

print(f"Original: {nums}")
print(f"Length: {len(nums)}")
print(f"Sum: {sum(nums)}")
print(f"Min: {min(nums)}")
print(f"Max: {max(nums)}")

nums.sort()
print(f"Sorted: {nums}")`,
          description: "Useful list operations",
        },
      ]),
      keyPoints: [
        "Lists use square brackets: [1, 2, 3]",
        "Lists are mutable - can be changed",
        "Access with indexing: list[0]",
        "Modify with assignment: list[0] = value",
        "append() adds to end, insert() adds at position",
        "remove() and pop() remove elements",
      ],
      hardwareDemo: "Watch how lists are stored in memory. When you modify an element, the memory location stays the same but the value changes - this is mutability!",
      estimatedTime: 18,
      difficulty: "BEGINNER",
      order: 3,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_2_1.id,
        number: 1,
        title: "Create a List",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a list called `fruits` with \"apple\", \"banana\", \"cherry\" and print it.",
        starterCode: `# Create the list
fruits = 

print(fruits)`,
        solution: `fruits = ["apple", "banana", "cherry"]
print(fruits)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "['apple', 'banana', 'cherry']", description: "Should print the list" },
        ]),
        hints: ["Use square brackets", "[\"apple\", \"banana\", \"cherry\"]", "Strings need quotes"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_2_1.id,
        number: 2,
        title: "Modify an Element",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Change the first element of `numbers` from 1 to 10, then print the list.",
        starterCode: `numbers = [1, 2, 3, 4, 5]

# Change first element to 10

print(numbers)`,
        solution: `numbers = [1, 2, 3, 4, 5]
numbers[0] = 10
print(numbers)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "[10, 2, 3, 4, 5]", description: "First element changed" },
        ]),
        hints: ["Use index assignment", "numbers[0] = 10", "Index 0 is the first element"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson5_2_1.id,
        number: 3,
        title: "Add to List",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add \"orange\" to the end of the fruits list using append(), then print.",
        starterCode: `fruits = ["apple", "banana"]

# Add orange to the end

print(fruits)`,
        solution: `fruits = ["apple", "banana"]
fruits.append("orange")
print(fruits)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "['apple', 'banana', 'orange']", description: "Orange added" },
        ]),
        hints: ["Use append() method", "fruits.append(\"orange\")", "append adds to the end"],
        xpReward: 10,
        order: 3,
      },
      {
        lessonId: lesson5_2_1.id,
        number: 4,
        title: "Sum a List",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Calculate and print the sum of all numbers in the list.",
        starterCode: `numbers = [10, 20, 30, 40]

# Calculate the sum
total = 
print(total)`,
        solution: `numbers = [10, 20, 30, 40]
total = sum(numbers)
print(total)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "100", description: "Sum is 100" },
        ]),
        hints: ["Use the sum() function", "sum(numbers)", "Returns total of all elements"],
        xpReward: 10,
        order: 4,
      },
    ],
  });

  console.log("✅ Created Lesson 5.2.1: Introduction to Lists");

  // ==================== LESSON 5.2.2: List Methods ====================
  const lesson5_2_2 = await prisma.lesson.upsert({
    where: { slug: "list-methods" },
    update: {},
    create: {
      sectionId: section5_2.id,
      number: 5.22,
      title: "List Operations and Methods",
      slug: "list-methods",
      objectives: [
        "Use essential list methods (append, extend, insert)",
        "Remove elements with remove, pop, and del",
        "Sort and reverse lists",
        "Search lists with index and count",
      ],
      content: `# List Operations and Methods

Lists have many powerful methods for adding, removing, and organizing elements.

## Adding Elements

\`\`\`python
nums = [1, 2, 3]

nums.append(4)        # Add to end: [1, 2, 3, 4]
nums.insert(0, 0)     # Add at index: [0, 1, 2, 3, 4]
nums.extend([5, 6])   # Add multiple: [0, 1, 2, 3, 4, 5, 6]
\`\`\`

## Removing Elements

\`\`\`python
nums = [1, 2, 3, 2, 4]

nums.remove(2)   # Remove first 2: [1, 3, 2, 4]
last = nums.pop()  # Remove & return last: 4
first = nums.pop(0)  # Remove & return at index: 1
del nums[0]      # Delete at index
nums.clear()     # Remove all
\`\`\`

## Sorting

\`\`\`python
nums = [3, 1, 4, 1, 5]

nums.sort()              # Sort ascending in place
nums.sort(reverse=True)  # Sort descending
nums.reverse()           # Reverse order

# Non-destructive sorting
sorted_nums = sorted(nums)  # Returns new list
\`\`\`

## Searching

\`\`\`python
nums = [1, 2, 3, 2, 1]

nums.index(2)    # First index of 2: 1
nums.count(1)    # How many 1s: 2
2 in nums        # Is 2 in list? True
\`\`\`

## Concatenation and Repetition

\`\`\`python
a = [1, 2]
b = [3, 4]

c = a + b      # [1, 2, 3, 4]
d = a * 3      # [1, 2, 1, 2, 1, 2]
\`\`\`

## Important: In-Place vs New List

- **In-place**: Modifies original (sort, reverse, append)
- **New list**: Returns new list (sorted, + operator)`,
      codeExamples: JSON.stringify([
        {
          id: "adding-elements",
          title: "Adding Elements",
          code: `nums = [1, 2, 3]
print(f"Original: {nums}")

nums.append(4)
print(f"After append(4): {nums}")

nums.insert(0, 0)
print(f"After insert(0, 0): {nums}")

nums.extend([5, 6])
print(f"After extend([5,6]): {nums}")`,
          description: "Different ways to add elements",
        },
        {
          id: "removing-elements",
          title: "Removing Elements",
          code: `nums = [1, 2, 3, 2, 4, 5]
print(f"Original: {nums}")

nums.remove(2)  # Remove first 2
print(f"After remove(2): {nums}")

last = nums.pop()  # Remove last
print(f"Popped {last}, now: {nums}")

del nums[0]  # Delete first
print(f"After del nums[0]: {nums}")`,
          description: "Different ways to remove elements",
        },
        {
          id: "sorting",
          title: "Sorting Lists",
          code: `nums = [3, 1, 4, 1, 5, 9, 2, 6]

nums.sort()
print(f"Sorted ascending: {nums}")

nums.sort(reverse=True)
print(f"Sorted descending: {nums}")

# sorted() returns new list, doesn't modify original
original = [3, 1, 4]
new_sorted = sorted(original)
print(f"Original: {original}")
print(f"New sorted: {new_sorted}")`,
          description: "Sort lists in place or create sorted copy",
        },
        {
          id: "searching",
          title: "Searching in Lists",
          code: `fruits = ["apple", "banana", "cherry", "banana"]

print(f"Index of 'banana': {fruits.index('banana')}")
print(f"Count of 'banana': {fruits.count('banana')}")
print(f"'cherry' in list: {'cherry' in fruits}")
print(f"'grape' in list: {'grape' in fruits}")`,
          description: "Find elements in lists",
        },
      ]),
      keyPoints: [
        "append() adds to end, insert() adds at position",
        "extend() adds multiple elements from another list",
        "remove() deletes by value, pop() by index",
        "sort() modifies in place, sorted() returns new list",
        "index() finds position, count() counts occurrences",
        "in operator checks membership",
      ],
      hardwareDemo: "Watch memory allocation change as the list grows and shrinks. See how sort() rearranges elements in the same memory location.",
      estimatedTime: 18,
      difficulty: "BEGINNER",
      order: 4,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_2_2.id,
        number: 1,
        title: "Extend a List",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add [4, 5, 6] to the end of nums using extend(), then print.",
        starterCode: `nums = [1, 2, 3]

# Add 4, 5, 6 using extend

print(nums)`,
        solution: `nums = [1, 2, 3]
nums.extend([4, 5, 6])
print(nums)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "[1, 2, 3, 4, 5, 6]", description: "List extended" },
        ]),
        hints: ["Use extend() method", "nums.extend([4, 5, 6])", "Pass a list to extend"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_2_2.id,
        number: 2,
        title: "Sort Descending",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Sort the numbers in descending order (largest first) and print.",
        starterCode: `nums = [5, 2, 8, 1, 9]

# Sort in descending order

print(nums)`,
        solution: `nums = [5, 2, 8, 1, 9]
nums.sort(reverse=True)
print(nums)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "[9, 8, 5, 2, 1]", description: "Sorted descending" },
        ]),
        hints: ["Use sort() with reverse=True", "nums.sort(reverse=True)", "Modifies list in place"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson5_2_2.id,
        number: 3,
        title: "Find and Remove",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find the index of \"banana\" and then remove it from the list.",
        starterCode: `fruits = ["apple", "banana", "cherry"]

# Find index of banana
idx = 

# Remove banana

print(fruits)`,
        solution: `fruits = ["apple", "banana", "cherry"]
idx = fruits.index("banana")
fruits.remove("banana")
print(fruits)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "['apple', 'cherry']", description: "Banana removed" },
        ]),
        hints: ["Use index() to find position", "Use remove() to delete by value", "Or use pop(idx) to remove by index"],
        xpReward: 20,
        order: 3,
      },
    ],
  });

  console.log("✅ Created Lesson 5.2.2: List Methods");

  // ==================== LESSON 5.2.3: Mutability and Aliasing ====================
  const lesson5_2_3 = await prisma.lesson.upsert({
    where: { slug: "mutability-aliasing" },
    update: {},
    create: {
      sectionId: section5_2.id,
      number: 5.23,
      title: "Mutability and Aliasing",
      slug: "mutability-aliasing",
      objectives: [
        "Understand the difference between mutable and immutable",
        "Recognize aliasing and its consequences",
        "Avoid common mutation bugs",
        "Know when two variables share the same object",
      ],
      content: `# Mutability and Aliasing

Understanding mutability and aliasing is crucial for avoiding subtle bugs in Python.

## Mutable vs Immutable

**Immutable**: Cannot be changed after creation
- int, float, bool, str, tuple

**Mutable**: Can be changed after creation
- list, dict, set

## The Aliasing Problem

When you assign a list to another variable, both refer to the SAME list:

\`\`\`python
a = [1, 2, 3]
b = a          # b is an ALIAS for a
b.append(4)    # Modifies the shared list
print(a)       # [1, 2, 3, 4] - a changed too!
\`\`\`

This doesn't happen with immutable types:

\`\`\`python
x = 5
y = x          # y gets a copy of the value
y = y + 1      # Creates new int, doesn't change x
print(x)       # 5 - unchanged
\`\`\`

## Checking Identity

Use \`is\` to check if two variables are the same object:

\`\`\`python
a = [1, 2, 3]
b = a
c = [1, 2, 3]  # Different list, same contents

print(a == c)  # True - same values
print(a is c)  # False - different objects
print(a is b)  # True - same object
\`\`\`

## id() Function

\`id()\` returns an object's unique identifier (memory address):

\`\`\`python
a = [1, 2, 3]
b = a
print(id(a) == id(b))  # True - same object
\`\`\`

## Why This Matters

Aliasing can cause unexpected behavior:

\`\`\`python
def add_item(item, lst):
    lst.append(item)  # Modifies the original!
    
my_list = [1, 2, 3]
add_item(4, my_list)
print(my_list)  # [1, 2, 3, 4] - changed!
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "aliasing-demo",
          title: "Aliasing Demonstration",
          code: `a = [1, 2, 3]
b = a  # b is an alias for a

print(f"a: {a}")
print(f"b: {b}")
print(f"Same object? {a is b}")

b.append(4)  # Modify through b

print(f"a after b.append(4): {a}")
print(f"b after b.append(4): {b}")`,
          description: "Two variables, one list",
        },
        {
          id: "immutable-no-alias",
          title: "Immutable Types Don't Alias",
          code: `x = 10
y = x

print(f"x: {x}, y: {y}")

y = y + 5  # Creates new int

print(f"x after y change: {x}")
print(f"y after y change: {y}")`,
          description: "Immutable types are safe from aliasing",
        },
        {
          id: "identity-check",
          title: "Checking Identity",
          code: `a = [1, 2, 3]
b = a              # Same object
c = [1, 2, 3]      # Different object, same values

print(f"a == b: {a == b}")  # Same values
print(f"a is b: {a is b}")  # Same object

print(f"a == c: {a == c}")  # Same values
print(f"a is c: {a is c}")  # Different objects`,
          description: "== vs is comparison",
        },
        {
          id: "function-mutation",
          title: "Mutation in Functions",
          code: `def add_exclamation(words):
    for i in range(len(words)):
        words[i] = words[i] + "!"
    # No return needed - modifies original

messages = ["Hello", "World"]
print(f"Before: {messages}")

add_exclamation(messages)
print(f"After: {messages}")`,
          description: "Functions can modify mutable arguments",
        },
      ]),
      keyPoints: [
        "Mutable: lists, dicts, sets (can change)",
        "Immutable: ints, strings, tuples (cannot change)",
        "Assignment creates an alias, not a copy",
        "a is b checks same object; a == b checks same value",
        "id() returns object's memory address",
        "Functions can modify mutable arguments",
      ],
      hardwareDemo: "PERFECT for visualization! Watch two variables point to the SAME memory location. See how changing one affects the other because they share memory.",
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
        lessonId: lesson5_2_3.id,
        number: 1,
        title: "Predict the Output",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "What will this print? Run to verify your prediction.",
        starterCode: `a = [1, 2, 3]
b = a
b[0] = 99
print(a)`,
        solution: `a = [1, 2, 3]
b = a
b[0] = 99
print(a)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "[99, 2, 3]", description: "a is modified through b" },
        ]),
        hints: ["b is an alias for a", "They share the same list", "Changing b changes a too"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson5_2_3.id,
        number: 2,
        title: "Check Identity",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create two lists with same values. Check if they're equal (==) and identical (is).",
        starterCode: `list1 = [1, 2, 3]
list2 = [1, 2, 3]

print(list1 == list2)  # Same values?
print(list1 is list2)  # Same object?`,
        solution: `list1 = [1, 2, 3]
list2 = [1, 2, 3]

print(list1 == list2)
print(list1 is list2)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "True\nFalse", description: "Equal but not identical" },
        ]),
        hints: ["Same values means ==  is True", "Different objects means is is False", "Two separate lists were created"],
        xpReward: 15,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 5.2.3: Mutability and Aliasing");

  // ==================== LESSON 5.2.4: List Cloning ====================
  const lesson5_2_4 = await prisma.lesson.upsert({
    where: { slug: "list-cloning" },
    update: {},
    create: {
      sectionId: section5_2.id,
      number: 5.24,
      title: "List Cloning",
      slug: "list-cloning",
      objectives: [
        "Create independent copies of lists",
        "Understand shallow vs deep copying",
        "Use slicing, list(), and copy() for cloning",
        "Know when to use deep copy",
      ],
      content: `# List Cloning

To avoid aliasing problems, you need to create a **copy** of a list, not an alias.

## Shallow Copy Methods

### 1. Slicing
\`\`\`python
original = [1, 2, 3]
copy = original[:]
\`\`\`

### 2. list() Constructor
\`\`\`python
copy = list(original)
\`\`\`

### 3. copy() Method
\`\`\`python
copy = original.copy()
\`\`\`

All three create a new list with the same elements.

## Verifying Independence

\`\`\`python
original = [1, 2, 3]
copy = original[:]

copy.append(4)
print(original)  # [1, 2, 3] - unchanged!
print(copy)      # [1, 2, 3, 4]
\`\`\`

## Shallow vs Deep Copy

**Shallow copy**: Copies the list, but nested objects are still shared.

\`\`\`python
original = [[1, 2], [3, 4]]
shallow = original[:]

shallow[0][0] = 99  # Modifies nested list!
print(original)  # [[99, 2], [3, 4]] - changed!
\`\`\`

**Deep copy**: Copies everything, including nested objects.

\`\`\`python
import copy
original = [[1, 2], [3, 4]]
deep = copy.deepcopy(original)

deep[0][0] = 99
print(original)  # [[1, 2], [3, 4]] - unchanged!
\`\`\`

## When to Use What

- **Simple lists**: Shallow copy is fine
- **Nested lists/dicts**: Use deep copy
- **Large data**: Consider if copy is necessary`,
      codeExamples: JSON.stringify([
        {
          id: "shallow-copy",
          title: "Shallow Copy Methods",
          code: `original = [1, 2, 3, 4, 5]

# Three ways to copy
copy1 = original[:]
copy2 = list(original)
copy3 = original.copy()

# Verify they're independent
copy1.append(6)
print(f"Original: {original}")
print(f"Copy1: {copy1}")
print(f"Same object? {original is copy1}")`,
          description: "Different ways to create a shallow copy",
        },
        {
          id: "shallow-problem",
          title: "Shallow Copy Problem",
          code: `original = [[1, 2], [3, 4]]
shallow = original[:]

print(f"Original: {original}")
print(f"Shallow: {shallow}")

# Modify nested list
shallow[0][0] = 99

print(f"After change:")
print(f"Original: {original}")  # Also changed!
print(f"Shallow: {shallow}")`,
          description: "Shallow copy shares nested objects",
        },
        {
          id: "deep-copy",
          title: "Deep Copy Solution",
          code: `import copy

original = [[1, 2], [3, 4]]
deep = copy.deepcopy(original)

print(f"Original: {original}")

# Modify nested list
deep[0][0] = 99

print(f"After change:")
print(f"Original: {original}")  # Unchanged!
print(f"Deep: {deep}")`,
          description: "Deep copy is fully independent",
        },
      ]),
      keyPoints: [
        "[:] slice creates a shallow copy",
        "list() and .copy() also create shallow copies",
        "Shallow copy: outer list copied, inner objects shared",
        "Deep copy: everything copied (use copy.deepcopy())",
        "For simple lists, shallow copy is sufficient",
      ],
      hardwareDemo: "Watch new memory being allocated for the copy. With shallow copy, see how nested lists still point to shared memory. With deep copy, see completely independent memory.",
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 6,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_2_4.id,
        number: 1,
        title: "Make a Copy",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create an independent copy of the list using slicing. Modify the copy and show original is unchanged.",
        starterCode: `original = [1, 2, 3]

# Create a copy using slicing
copy = 

copy.append(4)
print(original)
print(copy)`,
        solution: `original = [1, 2, 3]
copy = original[:]
copy.append(4)
print(original)
print(copy)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "[1, 2, 3]\n[1, 2, 3, 4]", description: "Original unchanged" },
        ]),
        hints: ["Use [:] to copy", "original[:] copies all elements", "Now they're independent"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson5_2_4.id,
        number: 2,
        title: "Deep Copy",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use deep copy for a nested list. Modify the copy's nested list and show original is unchanged.",
        starterCode: `import copy

original = [[1, 2], [3, 4]]
deep = copy.deepcopy(original)

# Modify the copy's nested list
deep[0][0] = 99

print(original)
print(deep)`,
        solution: `import copy

original = [[1, 2], [3, 4]]
deep = copy.deepcopy(original)
deep[0][0] = 99

print(original)
print(deep)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "[[1, 2], [3, 4]]\n[[99, 2], [3, 4]]", description: "Original unchanged with deep copy" },
        ]),
        hints: ["import copy module", "copy.deepcopy() copies everything", "Nested objects are also copied"],
        xpReward: 20,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 5.2.4: List Cloning");

  // ==================== LESSON 5.4.1: Introduction to Dictionaries ====================
  const lesson5_4_1 = await prisma.lesson.upsert({
    where: { slug: "intro-dictionaries" },
    update: {},
    create: {
      sectionId: section5_4.id,
      number: 5.41,
      title: "Introduction to Dictionaries",
      slug: "intro-dictionaries",
      objectives: [
        "Create dictionaries with key-value pairs",
        "Access and modify dictionary values",
        "Add and remove key-value pairs",
        "Understand when to use dictionaries",
      ],
      content: `# Introduction to Dictionaries

A **dictionary** is a collection of key-value pairs. Instead of numeric indices, you access values by their keys.

## Creating Dictionaries

\`\`\`python
# Using curly braces
person = {"name": "Alice", "age": 30, "city": "Boston"}

# Using dict()
person = dict(name="Alice", age=30, city="Boston")

# Empty dictionary
empty = {}
\`\`\`

## Accessing Values

\`\`\`python
person = {"name": "Alice", "age": 30}

print(person["name"])   # "Alice"
print(person.get("age"))  # 30
print(person.get("job", "Unknown"))  # "Unknown" (default)
\`\`\`

## Modifying Dictionaries

\`\`\`python
person = {"name": "Alice", "age": 30}

# Update existing key
person["age"] = 31

# Add new key
person["city"] = "Boston"

# Remove key
del person["city"]
# or
removed = person.pop("age")
\`\`\`

## Keys and Values

- **Keys**: Must be immutable (strings, numbers, tuples)
- **Values**: Can be anything

\`\`\`python
# Keys must be immutable
valid = {
    "name": "Alice",
    42: "answer",
    (1, 2): "tuple key"
}

# Lists can't be keys (they're mutable)
# invalid = {[1, 2]: "list key"}  # Error!
\`\`\`

## When to Use Dictionaries

- Storing related data with meaningful names
- Fast lookup by key (O(1) average)
- Counting occurrences
- Caching/memoization`,
      codeExamples: JSON.stringify([
        {
          id: "create-dict",
          title: "Creating Dictionaries",
          code: `# Dictionary with curly braces
student = {
    "name": "Alice",
    "age": 20,
    "major": "Computer Science",
    "gpa": 3.8
}

print(student)
print(f"Name: {student['name']}")
print(f"GPA: {student['gpa']}")`,
          description: "Create and access a dictionary",
        },
        {
          id: "modify-dict",
          title: "Modifying Dictionaries",
          code: `person = {"name": "Bob", "age": 25}
print(f"Original: {person}")

# Update
person["age"] = 26
print(f"After update: {person}")

# Add
person["city"] = "NYC"
print(f"After add: {person}")

# Remove
del person["city"]
print(f"After delete: {person}")`,
          description: "Update, add, and remove entries",
        },
        {
          id: "safe-access",
          title: "Safe Access with get()",
          code: `person = {"name": "Alice", "age": 30}

# Using [] raises error if key missing
# print(person["job"])  # KeyError!

# Using get() returns None or default
print(person.get("job"))  # None
print(person.get("job", "Unemployed"))  # "Unemployed"
print(person.get("name", "Unknown"))  # "Alice"`,
          description: "Use get() for safe access",
        },
        {
          id: "dict-counting",
          title: "Counting with Dictionaries",
          code: `words = ["apple", "banana", "apple", "cherry", "banana", "apple"]

counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1

print(counts)`,
          description: "Count occurrences using a dictionary",
        },
      ]),
      keyPoints: [
        "Dictionaries store key-value pairs",
        "Create with {key: value} or dict()",
        "Access with dict[key] or dict.get(key)",
        "get() is safer - returns None if key missing",
        "Keys must be immutable (strings, numbers, tuples)",
        "Great for fast lookup by key",
      ],
      hardwareDemo: "Watch how dictionaries use hash tables internally. See how keys are hashed to find storage locations, enabling fast O(1) lookups.",
      estimatedTime: 18,
      difficulty: "BEGINNER",
      order: 7,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_4_1.id,
        number: 1,
        title: "Create a Dictionary",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a dictionary `book` with keys 'title', 'author', 'year' and print it.",
        starterCode: `# Create a book dictionary
book = {
    "title": "Python Basics",
    "author": "John Doe",
    "year": 2023
}

print(book)`,
        solution: `book = {
    "title": "Python Basics",
    "author": "John Doe",
    "year": 2023
}
print(book)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "{'title': 'Python Basics', 'author': 'John Doe', 'year': 2023}", description: "Dictionary created" },
        ]),
        hints: ["Use curly braces {}", "Format: key: value", "Separate pairs with commas"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_4_1.id,
        number: 2,
        title: "Access and Update",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Print the person's age, then update it to 31 and print the whole dictionary.",
        starterCode: `person = {"name": "Alice", "age": 30, "city": "Boston"}

# Print the age

# Update age to 31

# Print the dictionary`,
        solution: `person = {"name": "Alice", "age": 30, "city": "Boston"}
print(person["age"])
person["age"] = 31
print(person)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "30\n{'name': 'Alice', 'age': 31, 'city': 'Boston'}", description: "Age accessed and updated" },
        ]),
        hints: ["Access with person[\"age\"]", "Update with person[\"age\"] = 31", "Print shows updated dict"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson5_4_1.id,
        number: 3,
        title: "Safe Access",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use get() to access 'job' key with default 'Unknown' since it doesn't exist.",
        starterCode: `person = {"name": "Bob", "age": 25}

# Use get() with default value
job = 
print(job)`,
        solution: `person = {"name": "Bob", "age": 25}
job = person.get("job", "Unknown")
print(job)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Unknown", description: "Default value returned" },
        ]),
        hints: ["Use .get(key, default)", "person.get(\"job\", \"Unknown\")", "Returns default if key missing"],
        xpReward: 15,
        order: 3,
      },
    ],
  });

  console.log("✅ Created Lesson 5.4.1: Introduction to Dictionaries");

  // ==================== LESSON 5.4.2: Dictionary Methods ====================
  const lesson5_4_2 = await prisma.lesson.upsert({
    where: { slug: "dict-methods" },
    update: {},
    create: {
      sectionId: section5_4.id,
      number: 5.42,
      title: "Dictionary Methods and Iteration",
      slug: "dict-methods",
      objectives: [
        "Use keys(), values(), and items() methods",
        "Iterate over dictionaries",
        "Check for key existence",
        "Merge and update dictionaries",
      ],
      content: `# Dictionary Methods and Iteration

Dictionaries have powerful methods for accessing and iterating over their contents.

## keys(), values(), items()

\`\`\`python
person = {"name": "Alice", "age": 30, "city": "Boston"}

person.keys()    # dict_keys(['name', 'age', 'city'])
person.values()  # dict_values(['Alice', 30, 'Boston'])
person.items()   # dict_items([('name', 'Alice'), ...])
\`\`\`

## Iterating Over Dictionaries

\`\`\`python
# Iterate over keys (default)
for key in person:
    print(key)

# Iterate over values
for value in person.values():
    print(value)

# Iterate over key-value pairs
for key, value in person.items():
    print(f"{key}: {value}")
\`\`\`

## Checking for Keys

\`\`\`python
person = {"name": "Alice", "age": 30}

"name" in person      # True
"job" in person       # False
"Alice" in person     # False (checks keys, not values)
"Alice" in person.values()  # True
\`\`\`

## Merging Dictionaries

\`\`\`python
dict1 = {"a": 1, "b": 2}
dict2 = {"c": 3, "d": 4}

# Method 1: update()
dict1.update(dict2)  # Modifies dict1

# Method 2: ** unpacking (Python 3.5+)
merged = {**dict1, **dict2}

# Method 3: | operator (Python 3.9+)
merged = dict1 | dict2
\`\`\`

## Other Useful Methods

\`\`\`python
person.clear()     # Remove all items
person.copy()      # Shallow copy
person.setdefault("job", "Engineer")  # Set if missing
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "keys-values-items",
          title: "keys(), values(), items()",
          code: `person = {"name": "Alice", "age": 30, "city": "Boston"}

print("Keys:", list(person.keys()))
print("Values:", list(person.values()))
print("Items:", list(person.items()))`,
          description: "Access keys, values, or both",
        },
        {
          id: "iterate-dict",
          title: "Iterating Over Dictionary",
          code: `scores = {"Alice": 95, "Bob": 87, "Charlie": 92}

print("Names and scores:")
for name, score in scores.items():
    print(f"  {name}: {score}")

print(f"\\nTotal: {sum(scores.values())}")
print(f"Average: {sum(scores.values()) / len(scores):.1f}")`,
          description: "Loop through dictionary entries",
        },
        {
          id: "check-keys",
          title: "Checking for Keys",
          code: `inventory = {"apples": 50, "bananas": 30, "oranges": 25}

items_to_check = ["apples", "grapes", "bananas"]

for item in items_to_check:
    if item in inventory:
        print(f"{item}: {inventory[item]} in stock")
    else:
        print(f"{item}: not in stock")`,
          description: "Check if keys exist before accessing",
        },
        {
          id: "merge-dicts",
          title: "Merging Dictionaries",
          code: `defaults = {"color": "blue", "size": "medium"}
user_prefs = {"color": "red", "font": "Arial"}

# Merge with update
settings = defaults.copy()
settings.update(user_prefs)
print(f"Merged: {settings}")

# User prefs override defaults
print(f"Color is: {settings['color']}")`,
          description: "Combine dictionaries",
        },
      ]),
      keyPoints: [
        "keys() returns all keys, values() all values",
        "items() returns (key, value) tuples",
        "Iterate with: for key, value in dict.items()",
        "Check membership with: key in dict",
        "update() merges another dict into this one",
        "setdefault() sets value only if key missing",
      ],
      hardwareDemo: "Watch iteration over dictionary entries. See how Python traverses the hash table to yield each key-value pair.",
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 8,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_4_2.id,
        number: 1,
        title: "Print All Keys",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Print all the keys in the dictionary on separate lines.",
        starterCode: `person = {"name": "Alice", "age": 30, "city": "Boston"}

for key in person.keys():
    print(key)`,
        solution: `person = {"name": "Alice", "age": 30, "city": "Boston"}
for key in person.keys():
    print(key)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "name\nage\ncity", description: "All keys printed" },
        ]),
        hints: ["Use .keys() method", "Loop with: for key in dict.keys()", "Or just: for key in dict"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_4_2.id,
        number: 2,
        title: "Sum Values",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate and print the sum of all values in the scores dictionary.",
        starterCode: `scores = {"math": 90, "english": 85, "science": 92}

# Calculate sum of all scores
total = 
print(total)`,
        solution: `scores = {"math": 90, "english": 85, "science": 92}
total = sum(scores.values())
print(total)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "267", description: "Sum is 267" },
        ]),
        hints: ["Use .values() to get values", "sum() adds them up", "sum(scores.values())"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson5_4_2.id,
        number: 3,
        title: "Format Output",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Print each person's name and score in format: 'Name: Score'",
        starterCode: `grades = {"Alice": 95, "Bob": 87, "Charlie": 92}

for name, score in grades.items():
    print(f"{name}: {score}")`,
        solution: `grades = {"Alice": 95, "Bob": 87, "Charlie": 92}
for name, score in grades.items():
    print(f"{name}: {score}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Alice: 95\nBob: 87\nCharlie: 92", description: "Formatted output" },
        ]),
        hints: ["Use .items() for key-value pairs", "Unpack in loop: for name, score", "f-string for formatting"],
        xpReward: 15,
        order: 3,
      },
    ],
  });

  console.log("✅ Created Lesson 5.4.2: Dictionary Methods");

  // ==================== LESSON 5.5.1: Sets ====================
  const lesson5_5_1 = await prisma.lesson.upsert({
    where: { slug: "sets" },
    update: {},
    create: {
      sectionId: section5_5.id,
      number: 5.51,
      title: "Sets and Set Operations",
      slug: "sets",
      objectives: [
        "Create sets and understand their properties",
        "Use set operations (union, intersection, difference)",
        "Remove duplicates from collections",
        "Know when to use sets vs lists",
      ],
      content: `# Sets and Set Operations

A **set** is an unordered collection of unique elements. Sets are perfect for membership testing and removing duplicates.

## Creating Sets

\`\`\`python
fruits = {"apple", "banana", "cherry"}
numbers = set([1, 2, 3, 2, 1])  # {1, 2, 3} - duplicates removed!
empty = set()  # Note: {} creates empty dict, not set!
\`\`\`

## Set Properties

- **Unordered**: No indexing (can't do set[0])
- **Unique**: Duplicates automatically removed
- **Mutable**: Can add/remove elements
- **Elements must be immutable**: No lists as elements

## Basic Operations

\`\`\`python
s = {1, 2, 3}
s.add(4)        # Add element
s.remove(2)     # Remove (error if missing)
s.discard(5)    # Remove (no error if missing)
3 in s          # Membership test
\`\`\`

## Set Operations

\`\`\`python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

a | b   # Union: {1, 2, 3, 4, 5, 6}
a & b   # Intersection: {3, 4}
a - b   # Difference: {1, 2}
a ^ b   # Symmetric difference: {1, 2, 5, 6}
\`\`\`

## Common Use Cases

\`\`\`python
# Remove duplicates
nums = [1, 2, 2, 3, 3, 3]
unique = list(set(nums))  # [1, 2, 3]

# Fast membership testing
valid_users = {"alice", "bob", "charlie"}
if username in valid_users:
    print("Access granted")
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "create-sets",
          title: "Creating Sets",
          code: `# From literal
colors = {"red", "green", "blue"}
print(f"Colors: {colors}")

# From list (removes duplicates)
numbers = set([1, 2, 2, 3, 3, 3, 4])
print(f"Numbers: {numbers}")

# Empty set
empty = set()
print(f"Empty: {empty}, type: {type(empty)}")`,
          description: "Different ways to create sets",
        },
        {
          id: "set-operations",
          title: "Set Operations",
          code: `a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(f"a: {a}")
print(f"b: {b}")
print(f"Union (a | b): {a | b}")
print(f"Intersection (a & b): {a & b}")
print(f"Difference (a - b): {a - b}")
print(f"Symmetric diff (a ^ b): {a ^ b}")`,
          description: "Union, intersection, difference",
        },
        {
          id: "remove-duplicates",
          title: "Removing Duplicates",
          code: `# List with duplicates
names = ["Alice", "Bob", "Alice", "Charlie", "Bob", "Alice"]
print(f"Original: {names}")
print(f"Count: {len(names)}")

# Remove duplicates
unique = list(set(names))
print(f"Unique: {unique}")
print(f"Count: {len(unique)}")`,
          description: "Use sets to remove duplicates",
        },
        {
          id: "membership-test",
          title: "Fast Membership Testing",
          code: `# Set lookup is O(1) - very fast!
valid_codes = {"ABC", "DEF", "GHI", "JKL"}

codes_to_check = ["ABC", "XYZ", "GHI", "MMM"]

for code in codes_to_check:
    if code in valid_codes:
        print(f"{code}: Valid")
    else:
        print(f"{code}: Invalid")`,
          description: "Sets are fast for membership tests",
        },
      ]),
      keyPoints: [
        "Sets store unique elements only",
        "Create with {1, 2, 3} or set()",
        "Empty set: set() (not {})",
        "Union |, Intersection &, Difference -",
        "Great for removing duplicates",
        "Fast O(1) membership testing",
      ],
      hardwareDemo: "Watch how sets use hashing for fast lookups. See duplicates being automatically eliminated when creating a set.",
      estimatedTime: 18,
      difficulty: "BEGINNER",
      order: 9,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_5_1.id,
        number: 1,
        title: "Remove Duplicates",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Remove duplicates from the list using a set, then print the unique values.",
        starterCode: `numbers = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]

# Convert to set to remove duplicates
unique = 
print(unique)`,
        solution: `numbers = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]
unique = set(numbers)
print(unique)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "{1, 2, 3, 4}", description: "Duplicates removed" },
        ]),
        hints: ["Use set() constructor", "set(numbers)", "Automatically removes duplicates"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_5_1.id,
        number: 2,
        title: "Find Common Elements",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find elements that appear in both sets using intersection.",
        starterCode: `set1 = {1, 2, 3, 4, 5}
set2 = {4, 5, 6, 7, 8}

# Find common elements
common = 
print(common)`,
        solution: `set1 = {1, 2, 3, 4, 5}
set2 = {4, 5, 6, 7, 8}
common = set1 & set2
print(common)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "{4, 5}", description: "Common elements found" },
        ]),
        hints: ["Use & for intersection", "set1 & set2", "Returns elements in both sets"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson5_5_1.id,
        number: 3,
        title: "Combine Sets",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a union of both sets (all unique elements from both).",
        starterCode: `evens = {2, 4, 6, 8}
primes = {2, 3, 5, 7}

# Create union of both sets
combined = 
print(combined)`,
        solution: `evens = {2, 4, 6, 8}
primes = {2, 3, 5, 7}
combined = evens | primes
print(combined)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "{2, 3, 4, 5, 6, 7, 8}", description: "Union created" },
        ]),
        hints: ["Use | for union", "evens | primes", "Returns all unique elements"],
        xpReward: 15,
        order: 3,
      },
    ],
  });

  console.log("✅ Created Lesson 5.5.1: Sets");

  // ==================== LESSON 5.6.1: List Comprehensions ====================
  const lesson5_6_1 = await prisma.lesson.upsert({
    where: { slug: "list-comprehensions" },
    update: {},
    create: {
      sectionId: section5_6.id,
      number: 5.61,
      title: "List Comprehensions",
      slug: "list-comprehensions",
      objectives: [
        "Write list comprehensions for concise list creation",
        "Add conditions to filter elements",
        "Use nested comprehensions",
        "Know when comprehensions are appropriate",
      ],
      content: `# List Comprehensions

**List comprehensions** provide a concise way to create lists. They're one of Python's most powerful and elegant features.

## Basic Syntax

\`\`\`python
[expression for item in iterable]
\`\`\`

## Compare: Loop vs Comprehension

\`\`\`python
# Traditional loop
squares = []
for x in range(5):
    squares.append(x ** 2)

# List comprehension
squares = [x ** 2 for x in range(5)]
# [0, 1, 4, 9, 16]
\`\`\`

## With Condition (Filtering)

\`\`\`python
[expression for item in iterable if condition]
\`\`\`

\`\`\`python
# Only even squares
even_squares = [x ** 2 for x in range(10) if x % 2 == 0]
# [0, 4, 16, 36, 64]
\`\`\`

## Multiple Operations

\`\`\`python
# Transform strings
words = ["hello", "world", "python"]
upper = [word.upper() for word in words]
# ["HELLO", "WORLD", "PYTHON"]

# Extract data
names = [person["name"] for person in people]
\`\`\`

## Nested Comprehensions

\`\`\`python
# Flatten a 2D list
matrix = [[1, 2], [3, 4], [5, 6]]
flat = [num for row in matrix for num in row]
# [1, 2, 3, 4, 5, 6]
\`\`\`

## When to Use

✅ Simple transformations and filtering
✅ When the logic fits in one line
❌ Complex logic (use regular loop)
❌ Side effects (printing, modifying external state)`,
      codeExamples: JSON.stringify([
        {
          id: "basic-comprehension",
          title: "Basic List Comprehension",
          code: `# Squares of 0-9
squares = [x ** 2 for x in range(10)]
print(f"Squares: {squares}")

# Double each number
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print(f"Doubled: {doubled}")`,
          description: "Simple transformations",
        },
        {
          id: "filtered-comprehension",
          title: "With Condition",
          code: `# Only positive numbers
numbers = [-2, -1, 0, 1, 2, 3]
positive = [n for n in numbers if n > 0]
print(f"Positive: {positive}")

# Only even numbers, squared
even_squares = [x ** 2 for x in range(10) if x % 2 == 0]
print(f"Even squares: {even_squares}")`,
          description: "Filter with if condition",
        },
        {
          id: "string-comprehension",
          title: "String Operations",
          code: `words = ["hello", "world", "python", "code"]

upper = [w.upper() for w in words]
print(f"Uppercase: {upper}")

lengths = [len(w) for w in words]
print(f"Lengths: {lengths}")

long_words = [w for w in words if len(w) > 4]
print(f"Long words: {long_words}")`,
          description: "Transform and filter strings",
        },
        {
          id: "compare-loop",
          title: "Loop vs Comprehension",
          code: `# Traditional loop
loop_result = []
for i in range(1, 6):
    loop_result.append(i ** 3)
print(f"Loop: {loop_result}")

# Equivalent comprehension
comp_result = [i ** 3 for i in range(1, 6)]
print(f"Comprehension: {comp_result}")

# Same result, comprehension is more Pythonic`,
          description: "See the difference",
        },
      ]),
      keyPoints: [
        "Syntax: [expression for item in iterable]",
        "Add filter: [expr for item in iter if condition]",
        "More concise than traditional loops",
        "Great for simple transformations",
        "Use regular loops for complex logic",
      ],
      hardwareDemo: "Watch the list being built element by element. See how comprehensions evaluate the expression for each item and optionally filter.",
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 10,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_6_1.id,
        number: 1,
        title: "Squares Comprehension",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a list of squares from 1 to 5 using a list comprehension.",
        starterCode: `# Create [1, 4, 9, 16, 25] using comprehension
squares = 
print(squares)`,
        solution: `squares = [x ** 2 for x in range(1, 6)]
print(squares)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "[1, 4, 9, 16, 25]", description: "Squares 1-5" },
        ]),
        hints: ["[expression for x in range]", "[x ** 2 for x in range(1, 6)]", "range(1, 6) gives 1-5"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson5_6_1.id,
        number: 2,
        title: "Filter Even Numbers",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Extract only even numbers from the list using a comprehension.",
        starterCode: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Get only even numbers
evens = 
print(evens)`,
        solution: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = [n for n in numbers if n % 2 == 0]
print(evens)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "[2, 4, 6, 8, 10]", description: "Even numbers only" },
        ]),
        hints: ["Add if condition at end", "[n for n in numbers if ...]", "n % 2 == 0 tests for even"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson5_6_1.id,
        number: 3,
        title: "Uppercase Words",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Convert all words to uppercase using a comprehension.",
        starterCode: `words = ["apple", "banana", "cherry"]

# Convert to uppercase
upper = 
print(upper)`,
        solution: `words = ["apple", "banana", "cherry"]
upper = [w.upper() for w in words]
print(upper)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "['APPLE', 'BANANA', 'CHERRY']", description: "All uppercase" },
        ]),
        hints: ["Apply .upper() to each word", "[w.upper() for w in words]", "Transform each element"],
        xpReward: 15,
        order: 3,
      },
    ],
  });

  console.log("✅ Created Lesson 5.6.1: List Comprehensions");

  // ==================== LESSON 5.6.2: Higher-Order Functions ====================
  const lesson5_6_2 = await prisma.lesson.upsert({
    where: { slug: "higher-order-functions" },
    update: {},
    create: {
      sectionId: section5_6.id,
      number: 5.62,
      title: "Higher-Order Functions and Lambdas",
      slug: "higher-order-functions",
      objectives: [
        "Understand functions as first-class objects",
        "Use map() and filter() built-in functions",
        "Write lambda expressions for simple functions",
        "Know when to use lambdas vs regular functions",
      ],
      content: `# Higher-Order Functions and Lambdas

**Higher-order functions** take functions as arguments or return functions. Combined with **lambdas** (anonymous functions), they enable powerful functional programming.

## Functions as Objects

In Python, functions are objects - you can pass them around:

\`\`\`python
def square(x):
    return x ** 2

# Pass function to another function
numbers = [1, 2, 3, 4]
result = list(map(square, numbers))  # [1, 4, 9, 16]
\`\`\`

## map()

Apply a function to every element:

\`\`\`python
map(function, iterable)
\`\`\`

\`\`\`python
numbers = [1, 2, 3, 4]
squares = list(map(lambda x: x ** 2, numbers))
# [1, 4, 9, 16]
\`\`\`

## filter()

Keep elements where function returns True:

\`\`\`python
filter(function, iterable)
\`\`\`

\`\`\`python
numbers = [1, 2, 3, 4, 5, 6]
evens = list(filter(lambda x: x % 2 == 0, numbers))
# [2, 4, 6]
\`\`\`

## Lambda Expressions

Anonymous functions for simple operations:

\`\`\`python
lambda arguments: expression
\`\`\`

\`\`\`python
# Traditional function
def add(a, b):
    return a + b

# Equivalent lambda
add = lambda a, b: a + b

add(3, 4)  # 7
\`\`\`

## When to Use Lambdas

✅ Simple, one-line functions
✅ Used once (e.g., as argument to map/filter)
✅ Sorting with custom key

❌ Complex logic
❌ Multiple statements
❌ Needs documentation

## Sorting with Key

\`\`\`python
students = [("Alice", 85), ("Bob", 92), ("Charlie", 78)]
# Sort by score (second element)
sorted_students = sorted(students, key=lambda x: x[1])
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "map-example",
          title: "Using map()",
          code: `numbers = [1, 2, 3, 4, 5]

# Square each number
squares = list(map(lambda x: x ** 2, numbers))
print(f"Squares: {squares}")

# Convert to strings
strings = list(map(str, numbers))
print(f"Strings: {strings}")`,
          description: "Apply function to each element",
        },
        {
          id: "filter-example",
          title: "Using filter()",
          code: `numbers = range(1, 11)

# Keep only even numbers
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(f"Evens: {evens}")

# Keep numbers > 5
big = list(filter(lambda x: x > 5, numbers))
print(f"Greater than 5: {big}")`,
          description: "Filter elements by condition",
        },
        {
          id: "lambda-basics",
          title: "Lambda Expressions",
          code: `# Simple lambdas
double = lambda x: x * 2
add = lambda a, b: a + b
is_even = lambda x: x % 2 == 0

print(f"double(5): {double(5)}")
print(f"add(3, 4): {add(3, 4)}")
print(f"is_even(6): {is_even(6)}")`,
          description: "Create simple anonymous functions",
        },
        {
          id: "sort-with-key",
          title: "Custom Sorting",
          code: `students = [
    {"name": "Alice", "grade": 85},
    {"name": "Bob", "grade": 92},
    {"name": "Charlie", "grade": 78}
]

# Sort by grade
by_grade = sorted(students, key=lambda s: s["grade"])
print("By grade:")
for s in by_grade:
    print(f"  {s['name']}: {s['grade']}")`,
          description: "Sort with lambda as key function",
        },
      ]),
      keyPoints: [
        "Functions are first-class objects in Python",
        "map() applies function to all elements",
        "filter() keeps elements where function returns True",
        "Lambda: lambda args: expression",
        "Lambdas are best for simple, one-time functions",
        "Use key parameter for custom sorting",
      ],
      hardwareDemo: "Watch functions being passed as arguments. See how map() and filter() iterate through elements, calling the provided function for each one.",
      estimatedTime: 20,
      difficulty: "INTERMEDIATE",
      order: 11,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_6_2.id,
        number: 1,
        title: "Double with map",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use map() with a lambda to double each number in the list.",
        starterCode: `numbers = [1, 2, 3, 4, 5]

# Use map with lambda to double
doubled = 
print(list(doubled))`,
        solution: `numbers = [1, 2, 3, 4, 5]
doubled = map(lambda x: x * 2, numbers)
print(list(doubled))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "[2, 4, 6, 8, 10]", description: "All doubled" },
        ]),
        hints: ["map(function, list)", "lambda x: x * 2", "Convert to list for printing"],
        xpReward: 20,
        order: 1,
      },
      {
        lessonId: lesson5_6_2.id,
        number: 2,
        title: "Filter Positive",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use filter() with a lambda to keep only positive numbers.",
        starterCode: `numbers = [-3cat >> prisma/seed-chapter5.ts << 'ENDOFFILE'
, -2, -1, 0, 1, 2, 3]

# Use filter with lambda
positive = 
print(list(positive))`,
        solution: `numbers = [-3, -2, -1, 0, 1, 2, 3]
positive = filter(lambda x: x > 0, numbers)
print(list(positive))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "[1, 2, 3]", description: "Only positive numbers" },
        ]),
        hints: ["filter(function, list)", "lambda x: x > 0", "Keeps where True"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson5_6_2.id,
        number: 3,
        title: "Sort by Length",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Sort the words by their length (shortest first) using sorted() with a lambda key.",
        starterCode: `words = ["python", "is", "awesome", "and", "fun"]

# Sort by length using lambda
sorted_words = 
print(sorted_words)`,
        solution: `words = ["python", "is", "awesome", "and", "fun"]
sorted_words = sorted(words, key=lambda w: len(w))
print(sorted_words)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "['is', 'and', 'fun', 'python', 'awesome']", description: "Sorted by length" },
        ]),
        hints: ["sorted(list, key=function)", "key=lambda w: len(w)", "Returns length for comparison"],
        xpReward: 20,
        order: 3,
      },
    ],
  });

  console.log("✅ Created Lesson 5.6.2: Higher-Order Functions");

  // Summary
  const lessonCount = await prisma.lesson.count({ where: { section: { chapter: { number: 5 } } } });
  const exerciseCount = await prisma.exercise.count({ where: { lesson: { section: { chapter: { number: 5 } } } } });

  console.log("\n📊 Chapter 5 Summary:");
  console.log(`   Lessons: ${lessonCount}`);
  console.log(`   Exercises: ${exerciseCount}`);
  console.log("\n🌱 Chapter 5 seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
