import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 5 Part 2: Lessons 5.2.2-5.2.3...\n");

  const section5_2 = await prisma.section.findFirst({ where: { number: 5.2 } });
  if (!section5_2) throw new Error("Section 5.2 not found.");

  // ==================== LESSON 5.2.2 ====================
  const lesson5_2_2 = await prisma.lesson.upsert({
    where: { slug: "list-methods" },
    update: {},
    create: {
      sectionId: section5_2.id,
      number: 5.22,
      title: "List Methods",
      slug: "list-methods",
      objectives: [
        "Use append, extend, and insert to add items",
        "Use remove, pop, and clear to delete items",
        "Use sort and reverse to reorder",
        "Understand methods modify list in place",
      ],
      content: `# List Methods

## Adding Items

**append(item)** - Add single item to end:
\`\`\`python
fruits = ["apple"]
fruits.append("banana")  # ["apple", "banana"]
\`\`\`

**extend(iterable)** - Add multiple items:
\`\`\`python
fruits.extend(["cherry", "date"])
# ["apple", "banana", "cherry", "date"]
\`\`\`

**insert(index, item)** - Add at specific position:
\`\`\`python
fruits.insert(1, "blueberry")
# ["apple", "blueberry", "banana", ...]
\`\`\`

## Removing Items

**remove(value)** - Remove first occurrence:
\`\`\`python
numbers = [1, 2, 3, 2]
numbers.remove(2)  # [1, 3, 2]
\`\`\`

**pop([index])** - Remove and return (default: last):
\`\`\`python
last = numbers.pop()    # Returns and removes last
first = numbers.pop(0)  # Returns and removes first
\`\`\`

**clear()** - Remove all items:
\`\`\`python
numbers.clear()  # []
\`\`\`

## Reordering

**sort()** - Sort in place:
\`\`\`python
nums = [3, 1, 4, 1, 5]
nums.sort()  # [1, 1, 3, 4, 5]
nums.sort(reverse=True)  # [5, 4, 3, 1, 1]
\`\`\`

**reverse()** - Reverse in place:
\`\`\`python
nums.reverse()  # Reverses order
\`\`\`

## Other Useful Methods

- **index(value)** - Find position of value
- **count(value)** - Count occurrences
- **copy()** - Create shallow copy

## Important: Methods Modify In Place!

Most list methods return \`None\` and modify the list directly.`,
      codeExamples: JSON.stringify([
        {
          id: "adding-items",
          title: "Adding Items to Lists",
          code: "# Start with empty list\nfruits = []\nprint(f\"Start: {fruits}\")\n\n# append: Add single item\nfruits.append(\"apple\")\nfruits.append(\"banana\")\nprint(f\"After appends: {fruits}\")\n\n# extend: Add multiple items\nmore = [\"cherry\", \"date\"]\nfruits.extend(more)\nprint(f\"After extend: {fruits}\")\n\n# insert: Add at position\nfruits.insert(0, \"apricot\")  # At beginning\nprint(f\"After insert at 0: {fruits}\")\n\nfruits.insert(2, \"blueberry\")  # At index 2\nprint(f\"After insert at 2: {fruits}\")\n\n# Note: append vs extend\nnums = [1, 2]\nnums.append([3, 4])  # Adds LIST as single item!\nprint(f\"\\nappend list: {nums}\")\n\nnums2 = [1, 2]\nnums2.extend([3, 4])  # Adds ITEMS from list\nprint(f\"extend list: {nums2}\")",
          description: "Methods for adding items",
        },
        {
          id: "removing-items",
          title: "Removing Items from Lists",
          code: "numbers = [10, 20, 30, 40, 50, 20]\nprint(f\"Original: {numbers}\")\n\n# remove: Remove by value (first occurrence)\nnumbers.remove(20)\nprint(f\"After remove(20): {numbers}\")\n\n# pop: Remove and return\nlast = numbers.pop()  # Remove last\nprint(f\"Popped: {last}, List: {numbers}\")\n\nfirst = numbers.pop(0)  # Remove at index\nprint(f\"Popped index 0: {first}, List: {numbers}\")\n\n# clear: Remove all\ntemp = [1, 2, 3]\ntemp.clear()\nprint(f\"\\nAfter clear: {temp}\")\n\n# Be careful with remove - ValueError if not found!\ntest = [1, 2, 3]\n# test.remove(99)  # ValueError: 99 not in list",
          description: "Methods for removing items",
        },
        {
          id: "sorting-reversing",
          title: "Sorting and Reversing",
          code: "numbers = [3, 1, 4, 1, 5, 9, 2, 6]\nprint(f\"Original: {numbers}\")\n\n# sort: Ascending order\nnumbers.sort()\nprint(f\"Sorted: {numbers}\")\n\n# sort: Descending order\nnumbers.sort(reverse=True)\nprint(f\"Sorted descending: {numbers}\")\n\n# reverse: Reverse current order\nnumbers.reverse()\nprint(f\"Reversed: {numbers}\")\n\n# Sorting strings\nwords = [\"banana\", \"Apple\", \"cherry\"]\nwords.sort()  # Case-sensitive!\nprint(f\"\\nSorted words: {words}\")\n\nwords.sort(key=str.lower)  # Case-insensitive\nprint(f\"Case-insensitive: {words}\")\n\n# IMPORTANT: sort() returns None!\nresult = [3, 1, 2].sort()\nprint(f\"\\nsort() returns: {result}\")  # None!",
          description: "Reordering lists",
        },
        {
          id: "other-methods",
          title: "Other Useful Methods",
          code: "numbers = [10, 20, 30, 20, 40, 20]\n\n# index: Find position\npos = numbers.index(30)\nprint(f\"Position of 30: {pos}\")\n\n# index with start position\npos2 = numbers.index(20, 2)  # Start searching at index 2\nprint(f\"Position of 20 after index 2: {pos2}\")\n\n# count: Count occurrences\ncount = numbers.count(20)\nprint(f\"Count of 20: {count}\")\n\n# copy: Create shallow copy\noriginal = [1, 2, 3]\ncopy_list = original.copy()\ncopy_list[0] = 99\nprint(f\"\\nOriginal: {original}\")\nprint(f\"Copy: {copy_list}\")\n\n# len, min, max, sum (built-in functions)\ndata = [5, 2, 8, 1, 9]\nprint(f\"\\nLength: {len(data)}\")\nprint(f\"Min: {min(data)}\")\nprint(f\"Max: {max(data)}\")\nprint(f\"Sum: {sum(data)}\")",
          description: "Finding, counting, copying",
        },
      ]),
      keyPoints: [
        "append(item): Add to end",
        "extend(list): Add all items from list",
        "insert(i, item): Add at position",
        "remove(value): Remove first occurrence",
        "pop(): Remove and return last (or at index)",
        "sort(): Sort in place",
        "reverse(): Reverse in place",
        "Most methods return None (modify in place)",
      ],
      hardwareDemo: "Watch list grow with append. See items shift with insert. Watch sort reorder in place.",
      estimatedTime: 30,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson5_2_2.number}: ${lesson5_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_2_2.id,
        number: 1,
        title: "Build with Append",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Start with empty list. Use append to add 'red', 'green', 'blue'. Print result.",
        starterCode: "colors = []\n\n# Add colors using append\n\nprint(colors)",
        solution: "colors = []\n\ncolors.append(\"red\")\ncolors.append(\"green\")\ncolors.append(\"blue\")\n\nprint(colors)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "['red', 'green', 'blue']", description: "Colors added" }]),
        hints: ["Call append for each color", "append modifies the list"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_2_2.id,
        number: 2,
        title: "Remove Item",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given list [1, 2, 3, 4, 5], remove the value 3 and print the result.",
        starterCode: "numbers = [1, 2, 3, 4, 5]\n\n# Remove 3\n\nprint(numbers)",
        solution: "numbers = [1, 2, 3, 4, 5]\n\nnumbers.remove(3)\n\nprint(numbers)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[1, 2, 4, 5]", description: "3 removed" }]),
        hints: ["Use remove(value)", "Removes by value, not index"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson5_2_2.id,
        number: 3,
        title: "Pop and Use",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given stack = [1, 2, 3, 4, 5], pop the last item, print what was popped, then print remaining list.",
        starterCode: "stack = [1, 2, 3, 4, 5]\n\n# Pop last and print both\n",
        solution: "stack = [1, 2, 3, 4, 5]\n\npopped = stack.pop()\nprint(f\"Popped: {popped}\")\nprint(f\"Remaining: {stack}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Popped: 5\\nRemaining: [1, 2, 3, 4]", description: "Pop works" }]),
        hints: ["pop() returns the removed item", "Store in variable to use it"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson5_2_2.id,
        number: 4,
        title: "Sort Numbers",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Sort [64, 25, 12, 22, 11] in ascending order, print, then sort descending and print again.",
        starterCode: "numbers = [64, 25, 12, 22, 11]\n\n# Sort ascending, print\n\n# Sort descending, print\n",
        solution: "numbers = [64, 25, 12, 22, 11]\n\nnumbers.sort()\nprint(f\"Ascending: {numbers}\")\n\nnumbers.sort(reverse=True)\nprint(f\"Descending: {numbers}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Ascending: [11, 12, 22, 25, 64]\\nDescending: [64, 25, 22, 12, 11]", description: "Both sorts work" }]),
        hints: ["sort() for ascending", "sort(reverse=True) for descending"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson5_2_2.id,
        number: 5,
        title: "Insert at Position",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Given [1, 2, 4, 5], insert 3 at the correct position to make [1, 2, 3, 4, 5].",
        starterCode: "numbers = [1, 2, 4, 5]\n\n# Insert 3 at correct position\n\nprint(numbers)",
        solution: "numbers = [1, 2, 4, 5]\n\nnumbers.insert(2, 3)  # Insert 3 at index 2\n\nprint(numbers)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[1, 2, 3, 4, 5]", description: "3 inserted correctly" }]),
        hints: ["insert(index, value)", "Index 2 means before current item at index 2"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 5.2.2`);

  // ==================== LESSON 5.2.3 ====================
  const lesson5_2_3 = await prisma.lesson.upsert({
    where: { slug: "aliasing-cloning" },
    update: {},
    create: {
      sectionId: section5_2.id,
      number: 5.23,
      title: "Aliasing and Cloning",
      slug: "aliasing-cloning",
      objectives: [
        "Understand aliasing - multiple names for same list",
        "Recognize aliasing bugs",
        "Create true copies with slicing or copy()",
        "Know shallow vs deep copy difference",
      ],
      content: `# Aliasing and Cloning

## The Aliasing Problem

When you assign a list to another variable, you create an **alias** - two names for the SAME list!

\`\`\`python
original = [1, 2, 3]
alias = original  # NOT a copy!

alias[0] = 99
print(original)  # [99, 2, 3] - Changed too!
\`\`\`

Both \`original\` and \`alias\` point to the same list in memory.

## Why This Happens

Lists are **reference types**. The variable holds a reference (pointer) to the list, not the list itself.

\`\`\`
original ──────┐
               │
               ▼
            [1, 2, 3]  (in memory)
               ▲
               │
alias ─────────┘
\`\`\`

## Creating True Copies

**Method 1: Slicing**
\`\`\`python
copy = original[:]
\`\`\`

**Method 2: copy() method**
\`\`\`python
copy = original.copy()
\`\`\`

**Method 3: list() constructor**
\`\`\`python
copy = list(original)
\`\`\`

## Checking Identity

Use \`is\` to check if two names refer to same object:

\`\`\`python
a = [1, 2, 3]
b = a        # Alias
c = a[:]     # Copy

print(a is b)  # True (same object)
print(a is c)  # False (different objects)
print(a == c)  # True (equal values)
\`\`\`

## Shallow vs Deep Copy

Shallow copy: Copies list, but nested objects are still shared!

\`\`\`python
original = [[1, 2], [3, 4]]
shallow = original[:]
shallow[0][0] = 99
print(original)  # [[99, 2], [3, 4]] - Inner list affected!
\`\`\`

Deep copy: Copies everything recursively.
\`\`\`python
import copy
deep = copy.deepcopy(original)
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "aliasing-problem",
          title: "The Aliasing Problem",
          code: "# Creating an alias (NOT a copy!)\noriginal = [1, 2, 3, 4, 5]\nalias = original  # Both point to SAME list\n\nprint(f\"Original: {original}\")\nprint(f\"Alias: {alias}\")\nprint(f\"Same object? {original is alias}\")  # True!\n\n# Modify through alias\nalias[0] = 99\nalias.append(6)\n\nprint(f\"\\nAfter modifying alias:\")\nprint(f\"Original: {original}\")  # Changed!\nprint(f\"Alias: {alias}\")\n\n# This catches many beginners by surprise!",
          description: "How aliasing causes unexpected changes",
        },
        {
          id: "creating-copies",
          title: "Creating True Copies",
          code: "original = [1, 2, 3, 4, 5]\n\n# Method 1: Slicing\ncopy1 = original[:]\n\n# Method 2: copy() method\ncopy2 = original.copy()\n\n# Method 3: list() constructor\ncopy3 = list(original)\n\n# Verify they're independent\ncopy1[0] = 100\ncopy2[0] = 200\ncopy3[0] = 300\n\nprint(f\"Original: {original}\")  # Unchanged!\nprint(f\"Copy 1: {copy1}\")\nprint(f\"Copy 2: {copy2}\")\nprint(f\"Copy 3: {copy3}\")\n\n# Check identity\nprint(f\"\\noriginal is copy1? {original is copy1}\")  # False\nprint(f\"original == copy1? {original == [1,2,3,4,5]}\")  # True (equal values)",
          description: "Three ways to copy a list",
        },
        {
          id: "is-vs-equals",
          title: "is vs == (Identity vs Equality)",
          code: "a = [1, 2, 3]\nb = a          # Alias - same object\nc = [1, 2, 3]  # New list - different object, same values\nd = a[:]       # Copy - different object, same values\n\nprint(\"Comparing a, b, c, d:\")\nprint(f\"a = {a}\")\nprint(f\"b = {b}\")\nprint(f\"c = {c}\")\nprint(f\"d = {d}\")\n\nprint(f\"\\na is b: {a is b}\")  # True (same object)\nprint(f\"a is c: {a is c}\")  # False (different objects)\nprint(f\"a is d: {a is d}\")  # False (different objects)\n\nprint(f\"\\na == b: {a == b}\")  # True (equal values)\nprint(f\"a == c: {a == c}\")  # True (equal values)\nprint(f\"a == d: {a == d}\")  # True (equal values)\n\n# is checks IDENTITY (same object)\n# == checks EQUALITY (same values)",
          description: "Identity vs equality comparison",
        },
        {
          id: "shallow-deep",
          title: "Shallow vs Deep Copy",
          code: "import copy\n\n# Nested list\noriginal = [[1, 2], [3, 4], [5, 6]]\n\n# Shallow copy - outer list copied, inner lists shared\nshallow = original[:]\n\n# Deep copy - everything copied\ndeep = copy.deepcopy(original)\n\nprint(\"Before modification:\")\nprint(f\"Original: {original}\")\n\n# Modify inner list through shallow copy\nshallow[0][0] = 99\n\nprint(\"\\nAfter shallow[0][0] = 99:\")\nprint(f\"Original: {original}\")  # Inner list affected!\nprint(f\"Shallow: {shallow}\")\nprint(f\"Deep: {deep}\")  # Not affected\n\n# Shallow copy danger with nested structures\nprint(f\"\\noriginal[0] is shallow[0]: {original[0] is shallow[0]}\")  # True!\nprint(f\"original[0] is deep[0]: {original[0] is deep[0]}\")  # False",
          description: "When shallow copy isn't enough",
        },
      ]),
      keyPoints: [
        "Assignment creates ALIAS, not copy",
        "Aliases point to same object in memory",
        "Modify one alias = changes all aliases",
        "Copy with [:], .copy(), or list()",
        "'is' checks identity (same object)",
        "'==' checks equality (same values)",
        "Shallow copy: nested objects still shared",
        "Use copy.deepcopy() for nested structures",
      ],
      hardwareDemo: "See two variables point to same memory. Watch copy create new memory block.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson5_2_3.number}: ${lesson5_2_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_2_3.id,
        number: 1,
        title: "Spot the Alias",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Predict output: a = [1,2,3]; b = a; b[0] = 99; print(a)",
        starterCode: "a = [1, 2, 3]\nb = a\nb[0] = 99\n\n# What will a be?\nprint(a)",
        solution: "a = [1, 2, 3]\nb = a  # b is alias of a!\nb[0] = 99\n\nprint(a)  # [99, 2, 3] - a changed too!",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[99, 2, 3]", description: "Aliasing effect" }]),
        hints: ["b = a creates alias, not copy", "Both point to same list"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_2_3.id,
        number: 2,
        title: "Create True Copy",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a TRUE copy of original so modifying copy doesn't affect original.",
        starterCode: "original = [1, 2, 3]\n\n# Create a true copy (not alias)\ncopy = # Your code here\n\ncopy[0] = 99\nprint(f\"Original: {original}\")  # Should still be [1, 2, 3]\nprint(f\"Copy: {copy}\")",
        solution: "original = [1, 2, 3]\n\ncopy = original[:]  # or original.copy()\n\ncopy[0] = 99\nprint(f\"Original: {original}\")\nprint(f\"Copy: {copy}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Original: [1, 2, 3]", description: "Original unchanged" }]),
        hints: ["Use [:] or .copy()", "This creates new list object"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson5_2_3.id,
        number: 3,
        title: "is vs ==",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given a=[1,2,3], b=a, c=[1,2,3], print whether each pair passes 'is' and '==' tests.",
        starterCode: "a = [1, 2, 3]\nb = a\nc = [1, 2, 3]\n\n# Test is and == for a,b and a,c\n",
        solution: "a = [1, 2, 3]\nb = a\nc = [1, 2, 3]\n\nprint(f\"a is b: {a is b}\")  # True\nprint(f\"a == b: {a == b}\")  # True\nprint(f\"a is c: {a is c}\")  # False\nprint(f\"a == c: {a == c}\")  # True",
        testCases: JSON.stringify([{ input: "", expectedOutput: "is True, == True, is False, == True", description: "Identity vs equality" }]),
        hints: ["'is' checks same object", "'==' checks same values"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson5_2_3.id,
        number: 4,
        title: "Function Side Effect",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "This function has a bug - it modifies the original list! Fix it.",
        starterCode: "def double_values(lst):\n    \"\"\"Return new list with values doubled.\"\"\"\n    for i in range(len(lst)):\n        lst[i] = lst[i] * 2\n    return lst\n\noriginal = [1, 2, 3]\nresult = double_values(original)\nprint(f\"Original: {original}\")  # Should be [1, 2, 3]\nprint(f\"Result: {result}\")",
        solution: "def double_values(lst):\n    \"\"\"Return new list with values doubled.\"\"\"\n    result = lst[:]  # Make copy first!\n    for i in range(len(result)):\n        result[i] = result[i] * 2\n    return result\n\noriginal = [1, 2, 3]\nresult = double_values(original)\nprint(f\"Original: {original}\")\nprint(f\"Result: {result}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Original: [1, 2, 3]\\nResult: [2, 4, 6]", description: "Original preserved" }]),
        hints: ["Copy the list at start of function", "Work on copy, not original"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson5_2_3.id,
        number: 5,
        title: "Deep Copy Needed",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a deep copy of nested list so inner lists are also independent.",
        starterCode: "import copy\n\noriginal = [[1, 2], [3, 4]]\n\n# Create deep copy\ndeep = # Your code\n\ndeep[0][0] = 99\nprint(f\"Original: {original}\")  # Should be [[1, 2], [3, 4]]\nprint(f\"Deep: {deep}\")",
        solution: "import copy\n\noriginal = [[1, 2], [3, 4]]\n\ndeep = copy.deepcopy(original)\n\ndeep[0][0] = 99\nprint(f\"Original: {original}\")\nprint(f\"Deep: {deep}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Original: [[1, 2], [3, 4]]", description: "Deep copy works" }]),
        hints: ["import copy module", "Use copy.deepcopy()"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 5.2.3`);

  console.log("\n✅ Chapter 5 Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
