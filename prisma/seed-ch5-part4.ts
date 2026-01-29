import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 5 Part 4: Lessons 5.4.1-5.5.1...\n");

  const section5_4 = await prisma.section.findFirst({ where: { number: 5.4 } });
  const section5_5 = await prisma.section.findFirst({ where: { number: 5.5 } });
  if (!section5_4 || !section5_5) throw new Error("Sections not found.");

  // ==================== LESSON 5.4.1 ====================
  const lesson5_4_1 = await prisma.lesson.upsert({
    where: { slug: "sets-basics" },
    update: {},
    create: {
      sectionId: section5_4.id,
      number: 5.41,
      title: "Sets - Unique Collections",
      slug: "sets-basics",
      objectives: [
        "Create sets and understand uniqueness",
        "Add and remove elements",
        "Use set operations (union, intersection, difference)",
        "Know when to use sets vs lists",
      ],
      content: `# Sets - Unique Collections

## What Are Sets?

Sets are **unordered** collections of **unique** elements.

\`\`\`python
numbers = {1, 2, 3, 3, 3}  # {1, 2, 3} - duplicates removed!
\`\`\`

## Key Properties

- **Unordered**: No indices, no guaranteed order
- **Unique**: Each element appears only once
- **Mutable**: Can add/remove elements
- **Fast membership**: O(1) lookup with \`in\`

## Creating Sets

\`\`\`python
# Literal (note: {} is empty dict, not set!)
colors = {"red", "green", "blue"}

# Empty set
empty = set()

# From list (removes duplicates!)
unique = set([1, 2, 2, 3, 3, 3])  # {1, 2, 3}
\`\`\`

## Basic Operations

\`\`\`python
s = {1, 2, 3}
s.add(4)      # Add element
s.remove(2)   # Remove (KeyError if missing)
s.discard(9)  # Remove (no error if missing)
len(s)        # Number of elements
3 in s        # Membership test (fast!)
\`\`\`

## Set Operations

\`\`\`python
a = {1, 2, 3}
b = {2, 3, 4}

a | b   # Union: {1, 2, 3, 4}
a & b   # Intersection: {2, 3}
a - b   # Difference: {1}
a ^ b   # Symmetric difference: {1, 4}
\`\`\`

## When to Use Sets

- Remove duplicates from list
- Fast membership testing
- Mathematical set operations
- Track "seen" items`,
      codeExamples: JSON.stringify([
        {
          id: "set-creation",
          title: "Creating Sets",
          code: "# Set literal\ncolors = {\"red\", \"green\", \"blue\"}\nprint(f\"Colors: {colors}\")\n\n# Duplicates automatically removed\nnumbers = {1, 2, 2, 3, 3, 3, 4, 4, 4, 4}\nprint(f\"Numbers: {numbers}\")  # {1, 2, 3, 4}\n\n# Empty set (not {}!)\nempty = set()\nprint(f\"Empty set: {empty}\")\nprint(f\"Type of {'{}'}: {type({})}\" )  # dict!\n\n# From list - removes duplicates\nwith_dupes = [1, 2, 2, 3, 1, 4, 2, 5]\nunique = set(with_dupes)\nprint(f\"\\nList: {with_dupes}\")\nprint(f\"Set: {unique}\")",
          description: "Different ways to create sets",
        },
        {
          id: "set-operations",
          title: "Add, Remove, and Membership",
          code: "fruits = {\"apple\", \"banana\"}\nprint(f\"Start: {fruits}\")\n\n# Add element\nfruits.add(\"cherry\")\nprint(f\"After add: {fruits}\")\n\n# Add duplicate (no effect)\nfruits.add(\"apple\")\nprint(f\"Add duplicate: {fruits}\")\n\n# Remove (raises KeyError if missing)\nfruits.remove(\"banana\")\nprint(f\"After remove: {fruits}\")\n\n# Discard (no error if missing)\nfruits.discard(\"mango\")  # No error!\nprint(f\"After discard: {fruits}\")\n\n# Membership test (very fast!)\nprint(f\"\\n'apple' in fruits: {'apple' in fruits}\")\nprint(f\"'mango' in fruits: {'mango' in fruits}\")",
          description: "Modifying sets and membership",
        },
        {
          id: "set-math",
          title: "Set Operations",
          code: "a = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\n\nprint(f\"A: {a}\")\nprint(f\"B: {b}\")\n\n# Union - all elements from both\nprint(f\"\\nA | B (union): {a | b}\")\n\n# Intersection - elements in both\nprint(f\"A & B (intersection): {a & b}\")\n\n# Difference - in A but not B\nprint(f\"A - B (difference): {a - b}\")\n\n# Symmetric difference - in one but not both\nprint(f\"A ^ B (symmetric diff): {a ^ b}\")\n\n# Subset/superset\nsmall = {1, 2}\nbig = {1, 2, 3, 4, 5}\nprint(f\"\\n{small} subset of {big}? {small <= big}\")\nprint(f\"{big} superset of {small}? {big >= small}\")",
          description: "Mathematical set operations",
        },
        {
          id: "set-practical",
          title: "Practical Set Uses",
          code: "# Remove duplicates from list\nnames = [\"Alice\", \"Bob\", \"Alice\", \"Carol\", \"Bob\"]\nunique_names = list(set(names))\nprint(f\"Unique names: {unique_names}\")\n\n# Fast membership testing\nvalid_commands = {\"start\", \"stop\", \"pause\", \"resume\"}\nuser_input = \"stop\"\nif user_input in valid_commands:\n    print(f\"'{user_input}' is valid\")\n\n# Find common elements\nmy_skills = {\"python\", \"javascript\", \"sql\"}\njob_requires = {\"python\", \"java\", \"sql\"}\nmatching = my_skills & job_requires\nprint(f\"\\nMatching skills: {matching}\")\nmissing = job_requires - my_skills\nprint(f\"Skills to learn: {missing}\")",
          description: "Real-world set applications",
        },
      ]),
      keyPoints: [
        "Sets contain unique elements only",
        "Unordered - no indexing",
        "Create with {items} or set()",
        "Empty set is set(), not {}",
        "add(), remove(), discard() for modification",
        "| union, & intersection, - difference",
        "Very fast membership testing",
        "Great for removing duplicates",
      ],
      hardwareDemo: "See hash table structure. Watch duplicates rejected.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson5_4_1.number}: ${lesson5_4_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_4_1.id,
        number: 1,
        title: "Remove Duplicates",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given a list with duplicates, create a set to get unique values.",
        starterCode: "numbers = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]\n\n# Create set of unique numbers\n",
        solution: "numbers = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]\n\nunique = set(numbers)\nprint(f\"Unique: {unique}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "{1, 2, 3, 4}", description: "Duplicates removed" }]),
        hints: ["Use set() constructor", "Pass the list to set()"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_4_1.id,
        number: 2,
        title: "Add to Set",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Start with empty set. Add 'apple', 'banana', 'apple' (duplicate). Print result.",
        starterCode: "fruits = set()\n\n# Add items\n\nprint(fruits)",
        solution: "fruits = set()\n\nfruits.add(\"apple\")\nfruits.add(\"banana\")\nfruits.add(\"apple\")  # Duplicate ignored\n\nprint(fruits)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "{'apple', 'banana'}", description: "Only unique items" }]),
        hints: ["Use .add() method", "Duplicates are ignored"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson5_4_1.id,
        number: 3,
        title: "Set Intersection",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find common elements between two sets of skills.",
        starterCode: "my_skills = {\"python\", \"javascript\", \"sql\", \"html\"}\njob_skills = {\"python\", \"java\", \"sql\", \"aws\"}\n\n# Find common skills\n",
        solution: "my_skills = {\"python\", \"javascript\", \"sql\", \"html\"}\njob_skills = {\"python\", \"java\", \"sql\", \"aws\"}\n\ncommon = my_skills & job_skills\nprint(f\"Common skills: {common}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "{'python', 'sql'}", description: "Intersection found" }]),
        hints: ["Use & for intersection", "Returns elements in both sets"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson5_4_1.id,
        number: 4,
        title: "Set Difference",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find which job skills you're missing.",
        starterCode: "my_skills = {\"python\", \"javascript\", \"sql\"}\njob_requires = {\"python\", \"java\", \"sql\", \"docker\"}\n\n# Find missing skills\n",
        solution: "my_skills = {\"python\", \"javascript\", \"sql\"}\njob_requires = {\"python\", \"java\", \"sql\", \"docker\"}\n\nmissing = job_requires - my_skills\nprint(f\"Skills to learn: {missing}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "{'java', 'docker'}", description: "Difference found" }]),
        hints: ["Use - for difference", "job_requires - my_skills"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson5_4_1.id,
        number: 5,
        title: "Count Unique Words",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Count how many unique words are in a sentence.",
        starterCode: "sentence = \"the cat sat on the mat and the cat was happy\"\n\n# Count unique words\n",
        solution: "sentence = \"the cat sat on the mat and the cat was happy\"\n\nwords = sentence.split()\nunique_words = set(words)\nprint(f\"Total words: {len(words)}\")\nprint(f\"Unique words: {len(unique_words)}\")\nprint(f\"Words: {unique_words}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Unique count and words", description: "Unique words found" }]),
        hints: ["Split sentence into words", "Convert to set for uniqueness"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 5.4.1`);

  // ==================== LESSON 5.5.1 ====================
  const lesson5_5_1 = await prisma.lesson.upsert({
    where: { slug: "list-comprehensions" },
    update: {},
    create: {
      sectionId: section5_5.id,
      number: 5.51,
      title: "List Comprehensions",
      slug: "list-comprehensions",
      objectives: [
        "Create lists with comprehension syntax",
        "Add conditions to filter elements",
        "Transform elements during creation",
        "Know when to use comprehensions vs loops",
      ],
      content: `# List Comprehensions

## What Are List Comprehensions?

A concise way to create lists:

\`\`\`python
# Traditional loop
squares = []
for x in range(5):
    squares.append(x**2)

# Comprehension (same result!)
squares = [x**2 for x in range(5)]
\`\`\`

## Basic Syntax

\`\`\`python
[expression for item in iterable]
\`\`\`

Examples:
\`\`\`python
[x*2 for x in range(5)]      # [0, 2, 4, 6, 8]
[s.upper() for s in words]   # Uppercase all
[len(w) for w in words]      # Length of each
\`\`\`

## With Condition (Filtering)

\`\`\`python
[expression for item in iterable if condition]
\`\`\`

Examples:
\`\`\`python
[x for x in range(10) if x % 2 == 0]  # [0, 2, 4, 6, 8]
[w for w in words if len(w) > 3]       # Words longer than 3
\`\`\`

## With Transformation and Condition

\`\`\`python
[x**2 for x in range(10) if x % 2 == 0]
# [0, 4, 16, 36, 64]
\`\`\`

## Why Comprehensions?

- **Concise**: One line vs multiple
- **Readable**: Once you know the syntax
- **Fast**: Optimized internally
- **Pythonic**: Idiomatic Python style

## When NOT to Use

- Complex logic (use regular loop)
- Side effects needed (printing, etc.)
- More than ~2 conditions (gets unreadable)`,
      codeExamples: JSON.stringify([
        {
          id: "basic-comprehension",
          title: "Basic List Comprehensions",
          code: "# Traditional way\nsquares_loop = []\nfor x in range(6):\n    squares_loop.append(x**2)\nprint(f\"Loop: {squares_loop}\")\n\n# Comprehension way\nsquares_comp = [x**2 for x in range(6)]\nprint(f\"Comp: {squares_comp}\")\n\n# More examples\ndoubles = [n * 2 for n in range(5)]\nprint(f\"\\nDoubles: {doubles}\")\n\nwords = [\"hello\", \"world\", \"python\"]\nupper = [w.upper() for w in words]\nprint(f\"Uppercase: {upper}\")\n\nlengths = [len(w) for w in words]\nprint(f\"Lengths: {lengths}\")",
          description: "Basic comprehension syntax",
        },
        {
          id: "with-condition",
          title: "Comprehensions with Filtering",
          code: "# Filter with if\nnumbers = range(10)\nevens = [x for x in numbers if x % 2 == 0]\nprint(f\"Evens: {evens}\")\n\nodds = [x for x in numbers if x % 2 != 0]\nprint(f\"Odds: {odds}\")\n\n# Filter strings\nwords = [\"apple\", \"be\", \"cat\", \"dog\", \"elephant\"]\nlong_words = [w for w in words if len(w) > 3]\nprint(f\"\\nLong words: {long_words}\")\n\n# Multiple conditions\nnums = range(20)\nfiltered = [x for x in nums if x % 2 == 0 if x % 3 == 0]\nprint(f\"Divisible by 2 and 3: {filtered}\")",
          description: "Adding conditions to filter",
        },
        {
          id: "transform-filter",
          title: "Transform AND Filter",
          code: "# Square only even numbers\nnumbers = range(10)\neven_squares = [x**2 for x in numbers if x % 2 == 0]\nprint(f\"Even squares: {even_squares}\")\n\n# Uppercase long words\nwords = [\"hi\", \"hello\", \"hey\", \"greetings\"]\nresult = [w.upper() for w in words if len(w) > 3]\nprint(f\"Long words upper: {result}\")\n\n# Convert and filter\ndata = [\"1\", \"2\", \"three\", \"4\", \"five\"]\nnumbers = [int(x) for x in data if x.isdigit()]\nprint(f\"Numbers only: {numbers}\")",
          description: "Combining transformation and filtering",
        },
        {
          id: "practical-examples",
          title: "Practical Comprehension Examples",
          code: "# Extract data from list of dicts\npeople = [\n    {\"name\": \"Alice\", \"age\": 25},\n    {\"name\": \"Bob\", \"age\": 30},\n    {\"name\": \"Carol\", \"age\": 35}\n]\nnames = [p[\"name\"] for p in people]\nprint(f\"Names: {names}\")\n\n# Filter by condition\nadults = [p[\"name\"] for p in people if p[\"age\"] >= 30]\nprint(f\"30+: {adults}\")\n\n# File processing example\nlines = [\"  hello  \", \"world\", \"  python  \"]\ncleaned = [line.strip() for line in lines]\nprint(f\"\\nCleaned: {cleaned}\")\n\n# Flatten nested structure\nnested = [[1, 2], [3, 4], [5, 6]]\nflat = [num for sublist in nested for num in sublist]\nprint(f\"Flattened: {flat}\")",
          description: "Real-world comprehension uses",
        },
      ]),
      keyPoints: [
        "Syntax: [expression for item in iterable]",
        "With filter: [expr for item in iter if cond]",
        "More concise than loops",
        "Faster than equivalent loop",
        "Very Pythonic style",
        "Avoid for complex logic",
        "Can nest (but keep readable)",
        "Works with any iterable",
      ],
      hardwareDemo: "Compare loop vs comprehension execution. See optimized internal iteration.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson5_5_1.number}: ${lesson5_5_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_5_1.id,
        number: 1,
        title: "Squares Comprehension",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a list of squares [1, 4, 9, 16, 25] using a list comprehension.",
        starterCode: "# Create squares of 1-5 using comprehension\nsquares = \n\nprint(squares)",
        solution: "squares = [x**2 for x in range(1, 6)]\n\nprint(squares)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[1, 4, 9, 16, 25]", description: "Squares list" }]),
        hints: ["[expression for x in range()]", "x**2 for square"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_5_1.id,
        number: 2,
        title: "Filter Evens",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Use comprehension to get even numbers from 0-20.",
        starterCode: "# Get even numbers 0-20\nevens = \n\nprint(evens)",
        solution: "evens = [x for x in range(21) if x % 2 == 0]\n\nprint(evens)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[0, 2, 4, ..., 20]", description: "Even numbers" }]),
        hints: ["Add if condition at end", "x % 2 == 0 checks even"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson5_5_1.id,
        number: 3,
        title: "Uppercase Words",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Convert all words to uppercase using comprehension.",
        starterCode: "words = [\"hello\", \"world\", \"python\"]\n\n# Uppercase all words\nupper = \n\nprint(upper)",
        solution: "words = [\"hello\", \"world\", \"python\"]\n\nupper = [w.upper() for w in words]\n\nprint(upper)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "['HELLO', 'WORLD', 'PYTHON']", description: "All uppercase" }]),
        hints: ["Apply .upper() to each word", "[w.upper() for w in words]"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson5_5_1.id,
        number: 4,
        title: "Filter and Transform",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Get squares of only the even numbers from 1-10.",
        starterCode: "# Squares of even numbers 1-10\nresult = \n\nprint(result)",
        solution: "result = [x**2 for x in range(1, 11) if x % 2 == 0]\n\nprint(result)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[4, 16, 36, 64, 100]", description: "Even squares" }]),
        hints: ["Combine expression and condition", "Filter first, then transform"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson5_5_1.id,
        number: 5,
        title: "Extract from Dicts",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Extract names of people who are 25 or older.",
        starterCode: "people = [\n    {\"name\": \"Alice\", \"age\": 22},\n    {\"name\": \"Bob\", \"age\": 25},\n    {\"name\": \"Carol\", \"age\": 30}\n]\n\n# Get names of people 25+\nnames = \n\nprint(names)",
        solution: "people = [\n    {\"name\": \"Alice\", \"age\": 22},\n    {\"name\": \"Bob\", \"age\": 25},\n    {\"name\": \"Carol\", \"age\": 30}\n]\n\nnames = [p[\"name\"] for p in people if p[\"age\"] >= 25]\n\nprint(names)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "['Bob', 'Carol']", description: "Filtered names" }]),
        hints: ["p[\"name\"] extracts name", "p[\"age\"] >= 25 filters"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 5.5.1`);

  console.log("\n✅ Chapter 5 Part 4 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
