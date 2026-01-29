import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 5 Part 1: Structure + Lessons 5.1.1-5.2.1...\n");

  // Find or create Chapter 5
  let chapter5 = await prisma.chapter.findFirst({ where: { number: 5 } });
  
  if (!chapter5) {
    chapter5 = await prisma.chapter.create({
      data: {
        number: 5,
        title: "Structured Types and Mutability",
        description: "Master compound data structures: tuples, lists, dictionaries, and sets. Understand mutability, aliasing, and higher-order functions.",
        objectives: [
          "Work with tuples and lists",
          "Understand mutability and aliasing",
          "Use dictionaries and sets effectively",
          "Apply list comprehensions",
          "Use higher-order functions like map and filter",
        ],
        isPublished: true,
      },
    });
  }
  console.log(`✅ Chapter ${chapter5.number}: ${chapter5.title}`);

  // Create Sections
  const section5_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter5.id, number: 5.1 } },
    update: {},
    create: { chapterId: chapter5.id, number: 5.1, title: "Tuples", description: "Immutable sequences.", order: 1 },
  });
  console.log(`  📂 Section ${section5_1.number}: ${section5_1.title}`);

  const section5_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter5.id, number: 5.2 } },
    update: {},
    create: { chapterId: chapter5.id, number: 5.2, title: "Lists and Mutability", description: "Mutable sequences and their behavior.", order: 2 },
  });
  console.log(`  📂 Section ${section5_2.number}: ${section5_2.title}`);

  const section5_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter5.id, number: 5.3 } },
    update: {},
    create: { chapterId: chapter5.id, number: 5.3, title: "Dictionaries", description: "Key-value data structures.", order: 3 },
  });
  console.log(`  📂 Section ${section5_3.number}: ${section5_3.title}`);

  const section5_4 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter5.id, number: 5.4 } },
    update: {},
    create: { chapterId: chapter5.id, number: 5.4, title: "Sets", description: "Unordered collections of unique elements.", order: 4 },
  });
  console.log(`  📂 Section ${section5_4.number}: ${section5_4.title}`);

  const section5_5 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter5.id, number: 5.5 } },
    update: {},
    create: { chapterId: chapter5.id, number: 5.5, title: "List Comprehensions", description: "Concise list creation.", order: 5 },
  });
  console.log(`  📂 Section ${section5_5.number}: ${section5_5.title}`);

  const section5_6 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter5.id, number: 5.6 } },
    update: {},
    create: { chapterId: chapter5.id, number: 5.6, title: "Higher-Order Functions", description: "Functions as objects.", order: 6 },
  });
  console.log(`  📂 Section ${section5_6.number}: ${section5_6.title}`);

  // ==================== LESSON 5.1.1 ====================
  const lesson5_1_1 = await prisma.lesson.upsert({
    where: { slug: "tuples-basics" },
    update: {},
    create: {
      sectionId: section5_1.id,
      number: 5.11,
      title: "Tuples - Immutable Sequences",
      slug: "tuples-basics",
      objectives: [
        "Create and access tuples",
        "Understand tuple immutability",
        "Use tuple packing and unpacking",
        "Know when to use tuples vs lists",
      ],
      content: `# Tuples - Immutable Sequences

## What Are Tuples?

Tuples are **ordered, immutable** sequences.

\`\`\`python
point = (3, 4)
person = ("Alice", 25, "Engineer")
single = (42,)  # Note comma for single-element tuple
empty = ()
\`\`\`

## Tuples vs Lists

| Tuples | Lists |
|--------|-------|
| Immutable (can't change) | Mutable (can change) |
| Use () | Use [] |
| Faster, less memory | More flexible |
| Hashable (can be dict keys) | Not hashable |

## Accessing Elements

Same as lists - indexing and slicing:

\`\`\`python
coords = (10, 20, 30)
x = coords[0]      # 10
last = coords[-1]  # 30
first_two = coords[:2]  # (10, 20)
\`\`\`

## Immutability

Cannot modify tuples after creation:

\`\`\`python
point = (3, 4)
point[0] = 5  # TypeError! Can't modify tuple
\`\`\`

## Tuple Packing and Unpacking

**Packing**: Creating tuple from values
\`\`\`python
point = 3, 4  # Parentheses optional
\`\`\`

**Unpacking**: Extracting values into variables
\`\`\`python
x, y = point  # x=3, y=4
name, age, job = ("Alice", 25, "Engineer")
\`\`\`

## Common Uses

- Return multiple values from functions
- Dictionary keys (lists can't be keys)
- Fixed collections that shouldn't change
- Coordinates, RGB colors, database records`,
      codeExamples: JSON.stringify([
        {
          id: "tuple-basics",
          title: "Creating and Accessing Tuples",
          code: "# Creating tuples\npoint = (3, 4)\nperson = (\"Alice\", 25, \"Engineer\")\nmixed = (1, \"hello\", 3.14, True)\n\n# Single element needs comma\nsingle = (42,)  # Tuple\nnot_tuple = (42)  # Just integer 42!\n\nprint(f\"Point: {point}\")\nprint(f\"Person: {person}\")\nprint(f\"Single element tuple: {single}\")\nprint(f\"Type: {type(single)}\")\n\n# Accessing elements\nprint(f\"\\nFirst coordinate: {point[0]}\")\nprint(f\"Name: {person[0]}\")\nprint(f\"Last item: {person[-1]}\")\n\n# Slicing\nprint(f\"First two: {person[:2]}\")",
          description: "Basic tuple operations",
        },
        {
          id: "tuple-immutability",
          title: "Tuple Immutability",
          code: "coords = (10, 20, 30)\nprint(f\"Original: {coords}\")\n\n# This would cause an error:\n# coords[0] = 99  # TypeError!\n\n# Can't add or remove either:\n# coords.append(40)  # AttributeError!\n\n# But can create NEW tuple\nnew_coords = coords + (40, 50)\nprint(f\"New tuple: {new_coords}\")\nprint(f\"Original unchanged: {coords}\")\n\n# Can reassign variable to new tuple\ncoords = (100, 200, 300)\nprint(f\"Reassigned: {coords}\")",
          description: "Understanding immutability",
        },
        {
          id: "tuple-unpacking",
          title: "Tuple Packing and Unpacking",
          code: "# Packing - creating tuple\npoint = 3, 4, 5  # Parentheses optional\nprint(f\"Packed: {point}\")\n\n# Unpacking - extracting values\nx, y, z = point\nprint(f\"Unpacked: x={x}, y={y}, z={z}\")\n\n# Practical: Multiple return values\ndef get_min_max(numbers):\n    return min(numbers), max(numbers)\n\ndata = [5, 2, 8, 1, 9]\nminimum, maximum = get_min_max(data)\nprint(f\"\\nMin: {minimum}, Max: {maximum}\")\n\n# Swap variables elegantly\na, b = 10, 20\nprint(f\"Before swap: a={a}, b={b}\")\na, b = b, a  # Tuple unpacking!\nprint(f\"After swap: a={a}, b={b}\")",
          description: "Packing and unpacking tuples",
        },
        {
          id: "tuple-uses",
          title: "Practical Tuple Uses",
          code: "# As dictionary keys (lists can't do this!)\nlocations = {\n    (40.7128, -74.0060): \"New York\",\n    (34.0522, -118.2437): \"Los Angeles\",\n    (51.5074, -0.1278): \"London\"\n}\n\ncoords = (40.7128, -74.0060)\nprint(f\"City at {coords}: {locations[coords]}\")\n\n# RGB colors\nred = (255, 0, 0)\ngreen = (0, 255, 0)\nblue = (0, 0, 255)\n\ndef describe_color(rgb):\n    r, g, b = rgb\n    return f\"R={r}, G={g}, B={b}\"\n\nprint(f\"\\nRed: {describe_color(red)}\")\n\n# Database-style records\nemployees = [\n    (\"Alice\", \"Engineering\", 75000),\n    (\"Bob\", \"Marketing\", 65000),\n    (\"Carol\", \"Engineering\", 80000),\n]\n\nfor name, dept, salary in employees:\n    print(f\"{name}: {dept}, ${salary}\")",
          description: "Real-world tuple applications",
        },
      ]),
      keyPoints: [
        "Tuples use parentheses: (1, 2, 3)",
        "Tuples are IMMUTABLE - cannot change",
        "Single element needs comma: (42,)",
        "Indexing and slicing like lists",
        "Packing: point = 3, 4",
        "Unpacking: x, y = point",
        "Can be dictionary keys (lists cannot)",
        "Use for fixed collections, return values",
      ],
      hardwareDemo: "See tuple stored as fixed array. Attempt to modify shows protection.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson5_1_1.number}: ${lesson5_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_1_1.id,
        number: 1,
        title: "Create Tuple",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a tuple called 'point' with coordinates (10, 20). Print the x and y values separately.",
        starterCode: "# Create point tuple and print coordinates\n",
        solution: "point = (10, 20)\nprint(f\"x = {point[0]}\")\nprint(f\"y = {point[1]}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "x = 10\\ny = 20", description: "Coordinates printed" }]),
        hints: ["Use parentheses for tuple", "Index with [0] and [1]"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_1_1.id,
        number: 2,
        title: "Tuple Unpacking",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given person = ('Alice', 25, 'NYC'), unpack into name, age, city variables and print each.",
        starterCode: "person = ('Alice', 25, 'NYC')\n\n# Unpack and print\n",
        solution: "person = ('Alice', 25, 'NYC')\n\nname, age, city = person\nprint(f\"Name: {name}\")\nprint(f\"Age: {age}\")\nprint(f\"City: {city}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Name: Alice\\nAge: 25\\nCity: NYC", description: "Unpacked correctly" }]),
        hints: ["name, age, city = person", "Three variables for three values"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson5_1_1.id,
        number: 3,
        title: "Return Multiple Values",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function divide_with_remainder(a, b) that returns both quotient and remainder as a tuple.",
        starterCode: "def divide_with_remainder(a, b):\n    # Return (quotient, remainder)\n    pass\n\nq, r = divide_with_remainder(17, 5)\nprint(f\"17 / 5 = {q} remainder {r}\")",
        solution: "def divide_with_remainder(a, b):\n    return a // b, a % b\n\nq, r = divide_with_remainder(17, 5)\nprint(f\"17 / 5 = {q} remainder {r}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "17 / 5 = 3 remainder 2", description: "Correct division" }]),
        hints: ["// for integer division", "% for remainder", "Return both separated by comma"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson5_1_1.id,
        number: 4,
        title: "Swap Variables",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use tuple unpacking to swap the values of a and b in one line.",
        starterCode: "a = 10\nb = 20\nprint(f\"Before: a={a}, b={b}\")\n\n# Swap using tuple unpacking\n\nprint(f\"After: a={a}, b={b}\")",
        solution: "a = 10\nb = 20\nprint(f\"Before: a={a}, b={b}\")\n\na, b = b, a\n\nprint(f\"After: a={a}, b={b}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Before: a=10, b=20\\nAfter: a=20, b=10", description: "Swapped" }]),
        hints: ["a, b = b, a", "Right side is evaluated first, then assigned"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson5_1_1.id,
        number: 5,
        title: "Tuple as Dict Key",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a dictionary mapping (row, col) tuples to chess piece names. Add entries for (0,0)='Rook' and (0,4)='King'. Look up what's at (0,4).",
        starterCode: "# Create chess board dictionary\n",
        solution: "chess_board = {\n    (0, 0): 'Rook',\n    (0, 4): 'King'\n}\n\nprint(f\"Piece at (0, 4): {chess_board[(0, 4)]}\")\nprint(f\"Piece at (0, 0): {chess_board[(0, 0)]}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Piece at (0, 4): King", description: "Lookup works" }]),
        hints: ["Tuples can be dictionary keys", "Use tuple directly: dict[(row, col)]"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 5.1.1`);

  // ==================== LESSON 5.2.1 ====================
  const lesson5_2_1 = await prisma.lesson.upsert({
    where: { slug: "lists-introduction" },
    update: {},
    create: {
      sectionId: section5_2.id,
      number: 5.21,
      title: "Introduction to Lists",
      slug: "lists-introduction",
      objectives: [
        "Create and manipulate lists",
        "Understand list mutability",
        "Use basic list operations",
        "Know the difference from tuples",
      ],
      content: `# Introduction to Lists

## What Are Lists?

Lists are **ordered, mutable** collections of items.

\`\`\`python
numbers = [1, 2, 3, 4, 5]
names = ["Alice", "Bob", "Charlie"]
mixed = [1, "hello", 3.14, True]
empty = []
\`\`\`

## Lists Are Mutable!

Unlike strings and tuples, lists CAN be changed:

\`\`\`python
numbers = [1, 2, 3]
numbers[0] = 99  # Works!
print(numbers)   # [99, 2, 3]
\`\`\`

This is the KEY difference from tuples!

## Basic Operations

**Indexing** (same as tuples/strings):
\`\`\`python
fruits = ["apple", "banana", "cherry"]
first = fruits[0]   # "apple"
last = fruits[-1]   # "cherry"
\`\`\`

**Slicing**:
\`\`\`python
numbers = [0, 1, 2, 3, 4, 5]
first_three = numbers[:3]  # [0, 1, 2]
\`\`\`

**Concatenation**:
\`\`\`python
[1, 2] + [3, 4]  # [1, 2, 3, 4]
\`\`\`

**Repetition**:
\`\`\`python
[0] * 5  # [0, 0, 0, 0, 0]
\`\`\`

**Membership**:
\`\`\`python
3 in [1, 2, 3]  # True
\`\`\`

## Why Lists Matter

Lists unlock real programming power:
- Store collections of any size
- Build data incrementally
- Process items in loops
- Implement algorithms`,
      codeExamples: JSON.stringify([
        {
          id: "list-creation",
          title: "Creating and Accessing Lists",
          code: "# Creating lists\nnumbers = [10, 20, 30, 40, 50]\nnames = [\"Alice\", \"Bob\", \"Charlie\"]\nmixed = [1, \"hello\", 3.14, True]\nempty = []\n\nprint(f\"Numbers: {numbers}\")\nprint(f\"Names: {names}\")\nprint(f\"Mixed types: {mixed}\")\nprint(f\"Empty list: {empty}\")\n\n# Indexing\nprint(f\"\\nFirst number: {numbers[0]}\")\nprint(f\"Last name: {names[-1]}\")\n\n# Slicing\nprint(f\"First 3 numbers: {numbers[:3]}\")\nprint(f\"Middle: {numbers[1:4]}\")\n\n# Length and membership\nprint(f\"\\nList has {len(numbers)} items\")\nprint(f\"Is 30 in list? {30 in numbers}\")",
          description: "Basic list operations",
        },
        {
          id: "list-mutability",
          title: "Lists Are Mutable",
          code: "# Lists CAN be changed\nscores = [85, 90, 78, 92, 88]\nprint(f\"Original: {scores}\")\n\n# Modify single item\nscores[2] = 95\nprint(f\"Changed index 2: {scores}\")\n\n# Modify slice\nscores[0:2] = [100, 100]\nprint(f\"Changed first two: {scores}\")\n\n# Compare with tuple (immutable)\ncoords = (10, 20)\n# coords[0] = 99  # TypeError! Can't modify tuple\n\n# Compare with string (immutable)\ntext = \"Hello\"\n# text[0] = 'h'  # TypeError! Can't modify string\n\nprint(\"\\nLists are mutable - tuples and strings are not!\")",
          description: "Understanding mutability",
        },
        {
          id: "list-operations",
          title: "List Operations",
          code: "# Concatenation\nlist1 = [1, 2, 3]\nlist2 = [4, 5, 6]\ncombined = list1 + list2\nprint(f\"Concatenated: {combined}\")\n\n# Repetition\nzeros = [0] * 5\nprint(f\"Repeated: {zeros}\")\n\npattern = [1, 2] * 3\nprint(f\"Pattern: {pattern}\")\n\n# Length\nprint(f\"\\nLength of combined: {len(combined)}\")\n\n# Membership\nprint(f\"Is 3 in combined? {3 in combined}\")\nprint(f\"Is 99 in combined? {99 in combined}\")\n\n# Iteration\nprint(\"\\nIterating:\")\nfor item in combined:\n    print(item, end=\" \")",
          description: "Common list operations",
        },
        {
          id: "list-vs-tuple",
          title: "Lists vs Tuples",
          code: "# List - mutable\nmy_list = [1, 2, 3]\nmy_list[0] = 99\nmy_list.append(4)\nprint(f\"Modified list: {my_list}\")\n\n# Tuple - immutable\nmy_tuple = (1, 2, 3)\n# my_tuple[0] = 99  # Error!\n# my_tuple.append(4)  # Error!\nprint(f\"Tuple unchanged: {my_tuple}\")\n\n# When to use each:\n# - List: When you need to modify\n# - Tuple: For fixed data, dict keys, function returns\n\n# Lists can't be dict keys\n# bad_dict = {[1, 2]: \"value\"}  # TypeError!\n\n# Tuples can be dict keys\ngood_dict = {(1, 2): \"value\"}\nprint(f\"\\nTuple as key works: {good_dict}\")",
          description: "Choosing between lists and tuples",
        },
      ]),
      keyPoints: [
        "Lists use square brackets: [1, 2, 3]",
        "Lists are MUTABLE - can be changed",
        "Indexing: list[0], list[-1]",
        "Slicing: list[1:3]",
        "Concatenation: list1 + list2",
        "Repetition: [0] * 5",
        "Membership: item in list",
        "Can contain any types, even mixed",
      ],
      hardwareDemo: "See list as array of references. Watch values change in place when modified.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson5_2_1.number}: ${lesson5_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_2_1.id,
        number: 1,
        title: "Create and Access",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a list of 5 numbers. Print the first, last, and middle items.",
        starterCode: "# Create list and access elements\n",
        solution: "numbers = [10, 20, 30, 40, 50]\nprint(f\"First: {numbers[0]}\")\nprint(f\"Last: {numbers[-1]}\")\nprint(f\"Middle: {numbers[2]}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "First: 10\\nLast: 50\\nMiddle: 30", description: "Correct access" }]),
        hints: ["First is index 0", "Last is index -1", "Middle of 5 items is index 2"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_2_1.id,
        number: 2,
        title: "Modify List",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create list [1, 2, 3, 4, 5]. Change the third item (index 2) to 99. Print the result.",
        starterCode: "numbers = [1, 2, 3, 4, 5]\n\n# Change third item to 99\n\nprint(numbers)",
        solution: "numbers = [1, 2, 3, 4, 5]\n\nnumbers[2] = 99\n\nprint(numbers)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[1, 2, 99, 4, 5]", description: "Item changed" }]),
        hints: ["Third item is index 2", "Assign with numbers[2] = 99"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson5_2_1.id,
        number: 3,
        title: "Concatenate Lists",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create two lists: [1, 2, 3] and [4, 5, 6]. Combine them into one list and print it.",
        starterCode: "list1 = [1, 2, 3]\nlist2 = [4, 5, 6]\n\n# Combine and print\n",
        solution: "list1 = [1, 2, 3]\nlist2 = [4, 5, 6]\n\ncombined = list1 + list2\nprint(combined)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[1, 2, 3, 4, 5, 6]", description: "Combined" }]),
        hints: ["Use + to concatenate", "Creates new list"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson5_2_1.id,
        number: 4,
        title: "List Slicing",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], use slicing to get: first 3, last 3, and middle 4.",
        starterCode: "numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]\n\n# Get slices\n",
        solution: "numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]\n\nfirst_three = numbers[:3]\nlast_three = numbers[-3:]\nmiddle_four = numbers[3:7]\n\nprint(f\"First 3: {first_three}\")\nprint(f\"Last 3: {last_three}\")\nprint(f\"Middle 4: {middle_four}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[0,1,2], [7,8,9], [3,4,5,6]", description: "Correct slices" }]),
        hints: ["[:3] for first 3", "[-3:] for last 3", "[3:7] for indices 3-6"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson5_2_1.id,
        number: 5,
        title: "Build List from Input",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write code that creates a list of squares [1, 4, 9, 16, 25] using a loop.",
        starterCode: "# Build list of first 5 squares\nsquares = []\n\n# Use loop to build\n\nprint(squares)",
        solution: "squares = []\n\nfor i in range(1, 6):\n    squares.append(i ** 2)\n\nprint(squares)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[1, 4, 9, 16, 25]", description: "Squares list" }]),
        hints: ["Start with empty list", "Use append() to add items", "Loop from 1 to 5"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 5.2.1`);

  console.log("\n✅ Chapter 5 Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
