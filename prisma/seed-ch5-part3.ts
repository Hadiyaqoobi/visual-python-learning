import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 5 Part 3: Lessons 5.3.1-5.3.2...\n");

  const section5_3 = await prisma.section.findFirst({ where: { number: 5.3 } });
  if (!section5_3) throw new Error("Section 5.3 not found.");

  // ==================== LESSON 5.3.1 ====================
  const lesson5_3_1 = await prisma.lesson.upsert({
    where: { slug: "dictionaries-basics" },
    update: {},
    create: {
      sectionId: section5_3.id,
      number: 5.31,
      title: "Dictionary Basics",
      slug: "dictionaries-basics",
      objectives: [
        "Create dictionaries with key-value pairs",
        "Access, add, and modify values",
        "Understand dictionary keys must be immutable",
        "Use dictionaries for lookups",
      ],
      content: `# Dictionary Basics

## What Are Dictionaries?

Dictionaries store **key-value pairs**. Like a real dictionary: word → definition.

\`\`\`python
person = {
    "name": "Alice",
    "age": 25,
    "city": "Boston"
}
\`\`\`

## Why Dictionaries?

- **Fast lookup** by key (O(1) average)
- **Meaningful keys** instead of numeric indices
- **Flexible structure** - add/remove keys anytime

## Creating Dictionaries

\`\`\`python
# Literal syntax
scores = {"Alice": 95, "Bob": 87}

# Empty dictionary
empty = {}

# dict() constructor
person = dict(name="Alice", age=25)
\`\`\`

## Accessing Values

Use the key in square brackets:

\`\`\`python
person = {"name": "Alice", "age": 25}
print(person["name"])  # "Alice"
print(person["age"])   # 25
\`\`\`

**KeyError** if key doesn't exist:
\`\`\`python
person["job"]  # KeyError!
\`\`\`

Use \`.get()\` for safe access:
\`\`\`python
person.get("job")        # None (no error)
person.get("job", "N/A") # "N/A" (default)
\`\`\`

## Adding and Modifying

\`\`\`python
person["job"] = "Engineer"  # Add new key
person["age"] = 26          # Modify existing
\`\`\`

## Key Requirements

Keys must be **immutable** (hashable):
- ✓ Strings, numbers, tuples
- ✗ Lists, dictionaries, sets`,
      codeExamples: JSON.stringify([
        {
          id: "dict-creation",
          title: "Creating Dictionaries",
          code: "# Dictionary literal\nperson = {\n    \"name\": \"Alice\",\n    \"age\": 25,\n    \"city\": \"Boston\"\n}\nprint(f\"Person: {person}\")\n\n# Empty dictionary\nempty = {}\nprint(f\"Empty: {empty}\")\n\n# Using dict() constructor\nscores = dict(math=95, science=87, english=92)\nprint(f\"Scores: {scores}\")\n\n# From list of tuples\nitems = [(\"a\", 1), (\"b\", 2), (\"c\", 3)]\nd = dict(items)\nprint(f\"From tuples: {d}\")\n\n# Mixed key types (all immutable)\nmixed = {\n    \"name\": \"Test\",\n    42: \"answer\",\n    (0, 0): \"origin\"\n}\nprint(f\"Mixed keys: {mixed}\")",
          description: "Different ways to create dictionaries",
        },
        {
          id: "dict-access",
          title: "Accessing Values",
          code: "student = {\n    \"name\": \"Bob\",\n    \"grade\": \"A\",\n    \"score\": 95\n}\n\n# Access with []\nprint(f\"Name: {student['name']}\")\nprint(f\"Grade: {student['grade']}\")\n\n# KeyError for missing keys\n# print(student[\"age\"])  # KeyError!\n\n# Safe access with .get()\nage = student.get(\"age\")\nprint(f\"Age (missing): {age}\")  # None\n\nage = student.get(\"age\", 0)\nprint(f\"Age (default 0): {age}\")  # 0\n\n# Check if key exists\nprint(f\"\\n'name' in student: {'name' in student}\")\nprint(f\"'age' in student: {'age' in student}\")",
          description: "Accessing dictionary values safely",
        },
        {
          id: "dict-modify",
          title: "Adding and Modifying",
          code: "# Start with basic dict\nperson = {\"name\": \"Alice\"}\nprint(f\"Start: {person}\")\n\n# Add new keys\nperson[\"age\"] = 25\nperson[\"city\"] = \"Boston\"\nprint(f\"After adding: {person}\")\n\n# Modify existing value\nperson[\"age\"] = 26\nprint(f\"After modifying: {person}\")\n\n# Delete key\ndel person[\"city\"]\nprint(f\"After delete: {person}\")\n\n# pop() - remove and return\nage = person.pop(\"age\")\nprint(f\"Popped age: {age}\")\nprint(f\"After pop: {person}\")\n\n# pop() with default (no KeyError)\njob = person.pop(\"job\", \"N/A\")\nprint(f\"Popped job (missing): {job}\")",
          description: "Modifying dictionaries",
        },
        {
          id: "dict-use-case",
          title: "Practical Dictionary Use",
          code: "# Word frequency counter\ntext = \"the cat sat on the mat the cat was happy\"\nword_count = {}\n\nfor word in text.split():\n    if word in word_count:\n        word_count[word] += 1\n    else:\n        word_count[word] = 1\n\nprint(\"Word counts:\")\nfor word, count in word_count.items():\n    print(f\"  {word}: {count}\")\n\n# Lookup table\ngrade_points = {\"A\": 4.0, \"B\": 3.0, \"C\": 2.0, \"D\": 1.0, \"F\": 0.0}\n\ngrades = [\"A\", \"B\", \"A\", \"C\", \"B\"]\ntotal = sum(grade_points[g] for g in grades)\naverage = total / len(grades)\nprint(f\"\\nGPA: {average:.2f}\")",
          description: "Real-world dictionary applications",
        },
      ]),
      keyPoints: [
        "Dictionaries store key-value pairs",
        "Syntax: {key: value, key: value}",
        "Access with dict[key] or dict.get(key)",
        "Add/modify: dict[key] = value",
        "Delete: del dict[key] or dict.pop(key)",
        "Keys must be immutable (strings, numbers, tuples)",
        "Use 'in' to check if key exists",
        "Fast O(1) lookup by key",
      ],
      hardwareDemo: "See hash table structure. Watch key hash to bucket location.",
      estimatedTime: 30,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson5_3_1.number}: ${lesson5_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_3_1.id,
        number: 1,
        title: "Create Dictionary",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a dictionary with your name, age, and favorite color. Print each value.",
        starterCode: "# Create person dictionary\n",
        solution: "person = {\n    \"name\": \"Alice\",\n    \"age\": 25,\n    \"color\": \"blue\"\n}\n\nprint(f\"Name: {person['name']}\")\nprint(f\"Age: {person['age']}\")\nprint(f\"Color: {person['color']}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Name, age, and color printed", description: "Dict created" }]),
        hints: ["Use curly braces {}", "Format: key: value"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_3_1.id,
        number: 2,
        title: "Safe Access",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Use .get() to safely access 'email' from a person dict (which doesn't have email). Return 'N/A' as default.",
        starterCode: "person = {\"name\": \"Bob\", \"age\": 30}\n\n# Safely get email with default\nemail = \n\nprint(f\"Email: {email}\")",
        solution: "person = {\"name\": \"Bob\", \"age\": 30}\n\nemail = person.get(\"email\", \"N/A\")\n\nprint(f\"Email: {email}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Email: N/A", description: "Default returned" }]),
        hints: ["Use .get(key, default)", "Returns default if key missing"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson5_3_1.id,
        number: 3,
        title: "Add and Modify",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Start with scores = {'math': 85}. Add 'science': 90, then change 'math' to 95. Print final dict.",
        starterCode: "scores = {\"math\": 85}\n\n# Add science, modify math\n\nprint(scores)",
        solution: "scores = {\"math\": 85}\n\nscores[\"science\"] = 90\nscores[\"math\"] = 95\n\nprint(scores)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "{'math': 95, 'science': 90}", description: "Modified correctly" }]),
        hints: ["dict[key] = value adds or modifies", "Same syntax for both operations"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson5_3_1.id,
        number: 4,
        title: "Check Key Exists",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given a dict, check if 'phone' exists. If yes, print it. If no, print 'No phone number'.",
        starterCode: "contact = {\"name\": \"Alice\", \"email\": \"alice@mail.com\"}\n\n# Check for phone and print appropriate message\n",
        solution: "contact = {\"name\": \"Alice\", \"email\": \"alice@mail.com\"}\n\nif \"phone\" in contact:\n    print(f\"Phone: {contact['phone']}\")\nelse:\n    print(\"No phone number\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "No phone number", description: "Key not found" }]),
        hints: ["Use 'in' to check membership", "if key in dict:"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson5_3_1.id,
        number: 5,
        title: "Letter Counter",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Count occurrences of each letter in 'hello' using a dictionary.",
        starterCode: "text = \"hello\"\nletter_count = {}\n\n# Count each letter\n\nprint(letter_count)",
        solution: "text = \"hello\"\nletter_count = {}\n\nfor letter in text:\n    if letter in letter_count:\n        letter_count[letter] += 1\n    else:\n        letter_count[letter] = 1\n\nprint(letter_count)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "{'h': 1, 'e': 1, 'l': 2, 'o': 1}", description: "Letters counted" }]),
        hints: ["Loop through each letter", "Check if key exists before incrementing"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 5.3.1`);

  // ==================== LESSON 5.3.2 ====================
  const lesson5_3_2 = await prisma.lesson.upsert({
    where: { slug: "dictionary-methods-iteration" },
    update: {},
    create: {
      sectionId: section5_3.id,
      number: 5.32,
      title: "Dictionary Methods and Iteration",
      slug: "dictionary-methods-iteration",
      objectives: [
        "Use keys(), values(), and items() methods",
        "Iterate over dictionaries effectively",
        "Use update() to merge dictionaries",
        "Apply common dictionary patterns",
      ],
      content: `# Dictionary Methods and Iteration

## Getting Keys, Values, Items

\`\`\`python
person = {"name": "Alice", "age": 25}

person.keys()   # dict_keys(['name', 'age'])
person.values() # dict_values(['Alice', 25])
person.items()  # dict_items([('name', 'Alice'), ('age', 25)])
\`\`\`

## Iterating Over Dictionaries

**Keys only** (default):
\`\`\`python
for key in person:
    print(key)
\`\`\`

**Values only**:
\`\`\`python
for value in person.values():
    print(value)
\`\`\`

**Keys and values** (most common):
\`\`\`python
for key, value in person.items():
    print(f"{key}: {value}")
\`\`\`

## Useful Methods

**update()** - Merge dictionaries:
\`\`\`python
d1 = {"a": 1}
d1.update({"b": 2, "c": 3})
# d1 is now {"a": 1, "b": 2, "c": 3}
\`\`\`

**setdefault()** - Get or set default:
\`\`\`python
d.setdefault("key", default_value)
\`\`\`

**clear()** - Remove all items

## Dictionary Comprehension

\`\`\`python
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
\`\`\`

## Common Patterns

**Counting**:
\`\`\`python
from collections import Counter
counts = Counter(items)
\`\`\`

**Grouping**:
\`\`\`python
groups = {}
for item in items:
    key = get_group(item)
    groups.setdefault(key, []).append(item)
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "keys-values-items",
          title: "Keys, Values, and Items",
          code: "student = {\n    \"name\": \"Alice\",\n    \"grade\": \"A\",\n    \"score\": 95\n}\n\n# Get all keys\nprint(\"Keys:\", list(student.keys()))\n\n# Get all values\nprint(\"Values:\", list(student.values()))\n\n# Get all key-value pairs\nprint(\"Items:\", list(student.items()))\n\n# Check length\nprint(f\"\\nNumber of entries: {len(student)}\")",
          description: "Accessing keys, values, and items",
        },
        {
          id: "iteration",
          title: "Iterating Over Dictionaries",
          code: "scores = {\"Alice\": 95, \"Bob\": 87, \"Carol\": 92}\n\n# Iterate over keys (default)\nprint(\"Keys:\")\nfor name in scores:\n    print(f\"  {name}\")\n\n# Iterate over values\nprint(\"\\nValues:\")\nfor score in scores.values():\n    print(f\"  {score}\")\n\n# Iterate over key-value pairs (most useful!)\nprint(\"\\nKey-Value pairs:\")\nfor name, score in scores.items():\n    print(f\"  {name}: {score}\")\n\n# Calculate average\naverage = sum(scores.values()) / len(scores)\nprint(f\"\\nAverage score: {average:.1f}\")",
          description: "Different ways to iterate",
        },
        {
          id: "update-merge",
          title: "Updating and Merging",
          code: "# Start with base dict\nperson = {\"name\": \"Alice\", \"age\": 25}\nprint(f\"Original: {person}\")\n\n# Update with another dict\nperson.update({\"city\": \"Boston\", \"age\": 26})\nprint(f\"After update: {person}\")\n\n# Python 3.9+ merge operator\nd1 = {\"a\": 1, \"b\": 2}\nd2 = {\"c\": 3, \"d\": 4}\nmerged = d1 | d2  # New dict\nprint(f\"\\nMerged: {merged}\")\n\n# setdefault - get or set\ncounts = {}\ncounts.setdefault(\"apple\", 0)\ncounts[\"apple\"] += 1\nprint(f\"\\nCounts: {counts}\")",
          description: "Merging and updating dictionaries",
        },
        {
          id: "dict-comprehension",
          title: "Dictionary Comprehension",
          code: "# Create dict from computation\nsquares = {x: x**2 for x in range(6)}\nprint(f\"Squares: {squares}\")\n\n# Filter while creating\neven_squares = {x: x**2 for x in range(10) if x % 2 == 0}\nprint(f\"Even squares: {even_squares}\")\n\n# Transform existing dict\nprices = {\"apple\": 1.00, \"banana\": 0.50, \"orange\": 0.75}\ntax_prices = {item: price * 1.1 for item, price in prices.items()}\nprint(f\"\\nWith tax: {tax_prices}\")\n\n# Swap keys and values\noriginal = {\"a\": 1, \"b\": 2, \"c\": 3}\nswapped = {v: k for k, v in original.items()}\nprint(f\"Swapped: {swapped}\")",
          description: "Creating dictionaries with comprehensions",
        },
      ]),
      keyPoints: [
        "keys() returns all keys",
        "values() returns all values",
        "items() returns key-value tuples",
        "for key, value in dict.items() is common pattern",
        "update() merges another dict in",
        "setdefault() gets or sets default value",
        "Dict comprehension: {k: v for ...}",
        "Can use | to merge dicts (Python 3.9+)",
      ],
      hardwareDemo: "Watch iteration step through hash table buckets.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson5_3_2.number}: ${lesson5_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_3_2.id,
        number: 1,
        title: "Print All Items",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Iterate over the dictionary and print each key-value pair on its own line.",
        starterCode: "person = {\"name\": \"Alice\", \"age\": 25, \"city\": \"Boston\"}\n\n# Print each key: value\n",
        solution: "person = {\"name\": \"Alice\", \"age\": 25, \"city\": \"Boston\"}\n\nfor key, value in person.items():\n    print(f\"{key}: {value}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "name: Alice\\nage: 25\\ncity: Boston", description: "All items printed" }]),
        hints: ["Use .items() to get key-value pairs", "for key, value in dict.items()"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_3_2.id,
        number: 2,
        title: "Sum Values",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Calculate the sum of all values in the scores dictionary.",
        starterCode: "scores = {\"math\": 85, \"science\": 92, \"english\": 78}\n\n# Calculate sum of scores\n",
        solution: "scores = {\"math\": 85, \"science\": 92, \"english\": 78}\n\ntotal = sum(scores.values())\nprint(f\"Total: {total}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Total: 255", description: "Sum calculated" }]),
        hints: ["Use .values() to get all values", "sum() works on the values"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson5_3_2.id,
        number: 3,
        title: "Merge Dictionaries",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Merge defaults into settings (settings values should override defaults).",
        starterCode: "defaults = {\"color\": \"blue\", \"size\": \"medium\", \"sound\": True}\nsettings = {\"color\": \"red\"}\n\n# Merge so settings overrides defaults\n",
        solution: "defaults = {\"color\": \"blue\", \"size\": \"medium\", \"sound\": True}\nsettings = {\"color\": \"red\"}\n\nfinal = defaults.copy()\nfinal.update(settings)\nprint(final)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "color: red, size: medium, sound: True", description: "Merged correctly" }]),
        hints: ["Copy defaults first", "Update with settings to override"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson5_3_2.id,
        number: 4,
        title: "Dict Comprehension",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a dictionary mapping numbers 1-5 to their cubes using comprehension.",
        starterCode: "# Create {1: 1, 2: 8, 3: 27, 4: 64, 5: 125}\ncubes = \n\nprint(cubes)",
        solution: "cubes = {x: x**3 for x in range(1, 6)}\n\nprint(cubes)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "{1: 1, 2: 8, 3: 27, 4: 64, 5: 125}", description: "Cubes dict" }]),
        hints: ["{key: value for x in range()}", "x**3 for cube"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson5_3_2.id,
        number: 5,
        title: "Find Max Value Key",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Find the key with the highest value in the scores dictionary.",
        starterCode: "scores = {\"Alice\": 85, \"Bob\": 92, \"Carol\": 78, \"Dan\": 95}\n\n# Find who has highest score\n",
        solution: "scores = {\"Alice\": 85, \"Bob\": 92, \"Carol\": 78, \"Dan\": 95}\n\ntop_scorer = max(scores, key=scores.get)\nprint(f\"Top scorer: {top_scorer} with {scores[top_scorer]}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Top scorer: Dan with 95", description: "Found max" }]),
        hints: ["max() can take a key function", "scores.get returns value for comparison"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 5.3.2`);

  console.log("\n✅ Chapter 5 Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
