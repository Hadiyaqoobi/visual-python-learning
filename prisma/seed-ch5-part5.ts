import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 5 Part 5: Lessons 5.6.1-5.6.2 (Higher-Order Functions)...\n");

  const section5_6 = await prisma.section.findFirst({ where: { number: 5.6 } });
  if (!section5_6) throw new Error("Section 5.6 not found.");

  // ==================== LESSON 5.6.1 ====================
  const lesson5_6_1 = await prisma.lesson.upsert({
    where: { slug: "functions-as-objects" },
    update: {},
    create: {
      sectionId: section5_6.id,
      number: 5.61,
      title: "Functions as Objects",
      slug: "functions-as-objects",
      objectives: [
        "Understand functions are first-class objects",
        "Assign functions to variables",
        "Pass functions as arguments",
        "Return functions from functions",
      ],
      content: `# Functions as Objects

## First-Class Functions

In Python, functions are **first-class objects**:
- Can be assigned to variables
- Can be passed as arguments
- Can be returned from functions
- Can be stored in data structures

## Assigning Functions to Variables

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

say_hi = greet  # No parentheses! Assign function itself
print(say_hi("Alice"))  # "Hello, Alice!"
\`\`\`

## Passing Functions as Arguments

\`\`\`python
def apply_twice(func, value):
    return func(func(value))

def double(x):
    return x * 2

result = apply_twice(double, 5)  # double(double(5)) = 20
\`\`\`

## Returning Functions

\`\`\`python
def make_multiplier(n):
    def multiplier(x):
        return x * n
    return multiplier

triple = make_multiplier(3)
print(triple(10))  # 30
\`\`\`

## Functions in Data Structures

\`\`\`python
operations = {
    "add": lambda a, b: a + b,
    "sub": lambda a, b: a - b,
}
result = operations["add"](5, 3)  # 8
\`\`\`

## Why This Matters

- Enables **higher-order functions** (map, filter, etc.)
- Foundation for **functional programming**
- Creates flexible, reusable code
- Used extensively in callbacks and decorators`,
      codeExamples: JSON.stringify([
        {
          id: "assign-functions",
          title: "Assigning Functions to Variables",
          code: "def greet(name):\n    return f\"Hello, {name}!\"\n\ndef farewell(name):\n    return f\"Goodbye, {name}!\"\n\n# Assign function to variable\nsay = greet  # No parentheses!\nprint(say(\"Alice\"))\n\n# Reassign to different function\nsay = farewell\nprint(say(\"Alice\"))\n\n# Functions have attributes\nprint(f\"\\nFunction name: {greet.__name__}\")\nprint(f\"Type: {type(greet)}\")",
          description: "Functions can be assigned like any value",
        },
        {
          id: "pass-functions",
          title: "Passing Functions as Arguments",
          code: "def apply_operation(func, a, b):\n    \"\"\"Apply a function to two values.\"\"\"\n    return func(a, b)\n\ndef add(x, y):\n    return x + y\n\ndef multiply(x, y):\n    return x * y\n\n# Pass different functions\nresult1 = apply_operation(add, 5, 3)\nprint(f\"add(5, 3) = {result1}\")\n\nresult2 = apply_operation(multiply, 5, 3)\nprint(f\"multiply(5, 3) = {result2}\")\n\n# Apply twice\ndef apply_twice(func, value):\n    return func(func(value))\n\ndef double(x):\n    return x * 2\n\nprint(f\"\\ndouble twice: {apply_twice(double, 5)}\")",
          description: "Functions as arguments to other functions",
        },
        {
          id: "return-functions",
          title: "Returning Functions",
          code: "def make_multiplier(n):\n    \"\"\"Return a function that multiplies by n.\"\"\"\n    def multiplier(x):\n        return x * n\n    return multiplier\n\n# Create specific multipliers\ndouble = make_multiplier(2)\ntriple = make_multiplier(3)\ntimes_ten = make_multiplier(10)\n\nprint(f\"double(5) = {double(5)}\")\nprint(f\"triple(5) = {triple(5)}\")\nprint(f\"times_ten(5) = {times_ten(5)}\")\n\n# The inner function \"remembers\" n (closure)\nprint(f\"\\ndouble(7) = {double(7)}\")",
          description: "Factory functions that return functions",
        },
        {
          id: "functions-in-structures",
          title: "Functions in Data Structures",
          code: "# Dictionary of operations\noperations = {\n    \"+\": lambda a, b: a + b,\n    \"-\": lambda a, b: a - b,\n    \"*\": lambda a, b: a * b,\n    \"/\": lambda a, b: a / b if b != 0 else None\n}\n\n# Use like a calculator\ndef calculate(a, op, b):\n    if op in operations:\n        return operations[op](a, b)\n    return None\n\nprint(f\"10 + 5 = {calculate(10, '+', 5)}\")\nprint(f\"10 - 5 = {calculate(10, '-', 5)}\")\nprint(f\"10 * 5 = {calculate(10, '*', 5)}\")\nprint(f\"10 / 5 = {calculate(10, '/', 5)}\")\n\n# List of functions\ntransforms = [str.upper, str.lower, str.title]\ntext = \"hello world\"\nfor func in transforms:\n    print(f\"{func.__name__}: {func(text)}\")",
          description: "Storing functions in collections",
        },
      ]),
      keyPoints: [
        "Functions are first-class objects in Python",
        "Can assign functions to variables",
        "Can pass functions as arguments",
        "Can return functions from functions",
        "Can store functions in lists/dicts",
        "No parentheses when passing function itself",
        "Enables higher-order programming",
        "Foundation for map, filter, decorators",
      ],
      hardwareDemo: "See function object in memory. Watch reference passed to another function.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson5_6_1.number}: ${lesson5_6_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_6_1.id,
        number: 1,
        title: "Assign Function",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Assign the len function to a variable called 'length'. Use it to get length of 'hello'.",
        starterCode: "# Assign len to length variable\n\n\n# Use length to get length of 'hello'\n",
        solution: "length = len\n\nresult = length(\"hello\")\nprint(f\"Length: {result}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Length: 5", description: "Function assigned" }]),
        hints: ["No parentheses: length = len", "Then call length('hello')"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_6_1.id,
        number: 2,
        title: "Pass Function",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write apply_to_list(func, lst) that applies func to each item and returns new list.",
        starterCode: "def apply_to_list(func, lst):\n    # Apply func to each item\n    pass\n\ndef square(x):\n    return x ** 2\n\nnumbers = [1, 2, 3, 4, 5]\nresult = apply_to_list(square, numbers)\nprint(result)",
        solution: "def apply_to_list(func, lst):\n    return [func(item) for item in lst]\n\ndef square(x):\n    return x ** 2\n\nnumbers = [1, 2, 3, 4, 5]\nresult = apply_to_list(square, numbers)\nprint(result)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[1, 4, 9, 16, 25]", description: "Function applied" }]),
        hints: ["Loop through list", "Call func(item) for each"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson5_6_1.id,
        number: 3,
        title: "Function Factory",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create make_adder(n) that returns a function adding n to its argument.",
        starterCode: "def make_adder(n):\n    # Return a function that adds n\n    pass\n\nadd_5 = make_adder(5)\nadd_10 = make_adder(10)\n\nprint(add_5(3))   # Should be 8\nprint(add_10(3))  # Should be 13",
        solution: "def make_adder(n):\n    def adder(x):\n        return x + n\n    return adder\n\nadd_5 = make_adder(5)\nadd_10 = make_adder(10)\n\nprint(add_5(3))\nprint(add_10(3))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "8\\n13", description: "Adders work" }]),
        hints: ["Define inner function", "Return the inner function"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson5_6_1.id,
        number: 4,
        title: "Operation Dictionary",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a dict mapping 'double', 'triple', 'square' to appropriate functions. Test each.",
        starterCode: "# Create operations dictionary\noperations = {\n    # Your code\n}\n\n# Test with value 5\nfor name, func in operations.items():\n    print(f\"{name}(5) = {func(5)}\")",
        solution: "operations = {\n    \"double\": lambda x: x * 2,\n    \"triple\": lambda x: x * 3,\n    \"square\": lambda x: x ** 2\n}\n\nfor name, func in operations.items():\n    print(f\"{name}(5) = {func(5)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "double(5) = 10\\ntriple(5) = 15\\nsquare(5) = 25", description: "All operations work" }]),
        hints: ["Use lambda for short functions", "Map string keys to functions"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson5_6_1.id,
        number: 5,
        title: "Apply Twice",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write apply_n_times(func, value, n) that applies func to value n times.",
        starterCode: "def apply_n_times(func, value, n):\n    # Apply func n times\n    pass\n\ndef double(x):\n    return x * 2\n\nprint(apply_n_times(double, 2, 4))  # 2->4->8->16->32",
        solution: "def apply_n_times(func, value, n):\n    result = value\n    for _ in range(n):\n        result = func(result)\n    return result\n\ndef double(x):\n    return x * 2\n\nprint(apply_n_times(double, 2, 4))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "32", description: "Applied 4 times" }]),
        hints: ["Start with value", "Apply func n times in loop"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 5.6.1`);

  // ==================== LESSON 5.6.2 ====================
  const lesson5_6_2 = await prisma.lesson.upsert({
    where: { slug: "map-filter-lambda" },
    update: {},
    create: {
      sectionId: section5_6.id,
      number: 5.62,
      title: "Map, Filter, and Lambda",
      slug: "map-filter-lambda",
      objectives: [
        "Use map() to transform sequences",
        "Use filter() to select elements",
        "Write lambda expressions for short functions",
        "Choose between comprehensions and map/filter",
      ],
      content: `# Map, Filter, and Lambda

## Lambda Expressions

Anonymous (unnamed) functions for simple operations:

\`\`\`python
# Regular function
def double(x):
    return x * 2

# Lambda equivalent
double = lambda x: x * 2
\`\`\`

Syntax: \`lambda arguments: expression\`

## The map() Function

Apply a function to every item:

\`\`\`python
numbers = [1, 2, 3, 4, 5]
squared = map(lambda x: x**2, numbers)
print(list(squared))  # [1, 4, 9, 16, 25]
\`\`\`

## The filter() Function

Keep items that pass a test:

\`\`\`python
numbers = [1, 2, 3, 4, 5, 6]
evens = filter(lambda x: x % 2 == 0, numbers)
print(list(evens))  # [2, 4, 6]
\`\`\`

## map + filter Together

\`\`\`python
# Square only even numbers
numbers = range(10)
result = map(lambda x: x**2, filter(lambda x: x % 2 == 0, numbers))
\`\`\`

## Comprehension Equivalents

\`\`\`python
# map equivalent
[x**2 for x in numbers]

# filter equivalent
[x for x in numbers if x % 2 == 0]

# map + filter equivalent
[x**2 for x in numbers if x % 2 == 0]
\`\`\`

## When to Use What

- **Lambda**: One-off simple functions
- **map/filter**: Functional style, chaining
- **Comprehensions**: Most Pythonic, readable`,
      codeExamples: JSON.stringify([
        {
          id: "lambda-basics",
          title: "Lambda Expressions",
          code: "# Regular function vs lambda\ndef add_regular(a, b):\n    return a + b\n\nadd_lambda = lambda a, b: a + b\n\nprint(f\"Regular: {add_regular(3, 5)}\")\nprint(f\"Lambda: {add_lambda(3, 5)}\")\n\n# Lambda use cases\nsquare = lambda x: x ** 2\nis_even = lambda x: x % 2 == 0\nfull_name = lambda first, last: f\"{first} {last}\"\n\nprint(f\"\\nsquare(5) = {square(5)}\")\nprint(f\"is_even(4) = {is_even(4)}\")\nprint(f\"full_name('John', 'Doe') = {full_name('John', 'Doe')}\")",
          description: "Creating lambda expressions",
        },
        {
          id: "map-function",
          title: "Using map()",
          code: "numbers = [1, 2, 3, 4, 5]\n\n# Square all numbers\nsquared = map(lambda x: x**2, numbers)\nprint(f\"Squared: {list(squared)}\")\n\n# Convert to strings\nstrings = map(str, numbers)\nprint(f\"Strings: {list(strings)}\")\n\n# With named function\ndef celsius_to_fahrenheit(c):\n    return c * 9/5 + 32\n\ntemps_c = [0, 10, 20, 30, 40]\ntemps_f = map(celsius_to_fahrenheit, temps_c)\nprint(f\"\\nFahrenheit: {list(temps_f)}\")\n\n# map with multiple iterables\na = [1, 2, 3]\nb = [10, 20, 30]\nsums = map(lambda x, y: x + y, a, b)\nprint(f\"Pairwise sums: {list(sums)}\")",
          description: "Transforming with map()",
        },
        {
          id: "filter-function",
          title: "Using filter()",
          code: "numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n\n# Keep even numbers\nevens = filter(lambda x: x % 2 == 0, numbers)\nprint(f\"Evens: {list(evens)}\")\n\n# Keep numbers > 5\nbig = filter(lambda x: x > 5, numbers)\nprint(f\"Greater than 5: {list(big)}\")\n\n# Filter strings\nwords = [\"apple\", \"be\", \"cat\", \"door\", \"elephant\"]\nlong_words = filter(lambda w: len(w) > 3, words)\nprint(f\"\\nLong words: {list(long_words)}\")\n\n# Remove empty strings\nitems = [\"hello\", \"\", \"world\", \"\", \"python\"]\nnon_empty = filter(None, items)  # None removes falsy\nprint(f\"Non-empty: {list(non_empty)}\")",
          description: "Filtering with filter()",
        },
        {
          id: "combining-map-filter",
          title: "Combining map and filter",
          code: "numbers = range(1, 11)\n\n# Square only even numbers\nresult = map(\n    lambda x: x**2,\n    filter(lambda x: x % 2 == 0, numbers)\n)\nprint(f\"Squared evens: {list(result)}\")\n\n# Comprehension equivalent (often clearer!)\nresult2 = [x**2 for x in numbers if x % 2 == 0]\nprint(f\"Comprehension: {result2}\")\n\n# Processing data\npeople = [\n    {\"name\": \"Alice\", \"age\": 25},\n    {\"name\": \"Bob\", \"age\": 17},\n    {\"name\": \"Carol\", \"age\": 30}\n]\n\n# Names of adults\nadult_names = map(\n    lambda p: p[\"name\"],\n    filter(lambda p: p[\"age\"] >= 18, people)\n)\nprint(f\"\\nAdult names: {list(adult_names)}\")",
          description: "Chaining map and filter",
        },
      ]),
      keyPoints: [
        "Lambda: lambda args: expression",
        "map(func, iterable) transforms each item",
        "filter(func, iterable) keeps items where func is True",
        "Both return iterators (use list() to see)",
        "Can chain: map(f, filter(g, items))",
        "Comprehensions often clearer in Python",
        "Lambda for one-off functions only",
        "Named functions better for complex logic",
      ],
      hardwareDemo: "Watch map/filter lazily process items. See lambda execute inline.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson5_6_2.number}: ${lesson5_6_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson5_6_2.id,
        number: 1,
        title: "Write Lambda",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Write a lambda that cubes a number. Test it with 3.",
        starterCode: "# Lambda that cubes\ncube = \n\nprint(cube(3))  # Should be 27",
        solution: "cube = lambda x: x ** 3\n\nprint(cube(3))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "27", description: "Cube works" }]),
        hints: ["lambda x: expression", "x ** 3 for cube"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson5_6_2.id,
        number: 2,
        title: "Map Squares",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Use map() and lambda to square all numbers in [1, 2, 3, 4, 5].",
        starterCode: "numbers = [1, 2, 3, 4, 5]\n\n# Use map to square\nsquared = \n\nprint(list(squared))",
        solution: "numbers = [1, 2, 3, 4, 5]\n\nsquared = map(lambda x: x**2, numbers)\n\nprint(list(squared))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[1, 4, 9, 16, 25]", description: "Squared" }]),
        hints: ["map(function, iterable)", "Use lambda for the function"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson5_6_2.id,
        number: 3,
        title: "Filter Positives",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use filter() to keep only positive numbers from [-3, -1, 0, 2, 5, -4, 8].",
        starterCode: "numbers = [-3, -1, 0, 2, 5, -4, 8]\n\n# Filter positive only\npositives = \n\nprint(list(positives))",
        solution: "numbers = [-3, -1, 0, 2, 5, -4, 8]\n\npositives = filter(lambda x: x > 0, numbers)\n\nprint(list(positives))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[2, 5, 8]", description: "Positives only" }]),
        hints: ["filter(function, iterable)", "x > 0 for positive"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson5_6_2.id,
        number: 4,
        title: "Map and Filter",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Double only the even numbers from 1-10 using map and filter.",
        starterCode: "numbers = range(1, 11)\n\n# Double evens only\nresult = \n\nprint(list(result))",
        solution: "numbers = range(1, 11)\n\nresult = map(lambda x: x * 2, filter(lambda x: x % 2 == 0, numbers))\n\nprint(list(result))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[4, 8, 12, 16, 20]", description: "Doubled evens" }]),
        hints: ["Filter first, then map", "Chain: map(..., filter(...))"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson5_6_2.id,
        number: 5,
        title: "Sort with Lambda",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Sort people by age using sorted() with a lambda key.",
        starterCode: "people = [\n    {\"name\": \"Carol\", \"age\": 35},\n    {\"name\": \"Alice\", \"age\": 25},\n    {\"name\": \"Bob\", \"age\": 30}\n]\n\n# Sort by age\nsorted_people = \n\nfor p in sorted_people:\n    print(f\"{p['name']}: {p['age']}\")",
        solution: "people = [\n    {\"name\": \"Carol\", \"age\": 35},\n    {\"name\": \"Alice\", \"age\": 25},\n    {\"name\": \"Bob\", \"age\": 30}\n]\n\nsorted_people = sorted(people, key=lambda p: p[\"age\"])\n\nfor p in sorted_people:\n    print(f\"{p['name']}: {p['age']}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Alice: 25\\nBob: 30\\nCarol: 35", description: "Sorted by age" }]),
        hints: ["sorted(list, key=function)", "Lambda extracts age for comparison"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 5.6.2`);

  // Verify Chapter 5 is complete
  const chapter5 = await prisma.chapter.findFirst({
    where: { number: 5 },
    include: {
      sections: {
        orderBy: { number: 'asc' },
        include: {
          lessons: {
            orderBy: { number: 'asc' },
            include: { _count: { select: { exercises: true } } }
          }
        }
      }
    }
  });

  if (chapter5) {
    console.log("\n" + "=".repeat(60));
    console.log("📚 CHAPTER 5 COMPLETE!");
    console.log("=".repeat(60));
    
    let totalLessons = 0;
    let totalExercises = 0;
    
    for (const section of chapter5.sections) {
      console.log(`\n📂 Section ${section.number}: ${section.title}`);
      for (const lesson of section.lessons) {
        console.log(`   📝 ${lesson.number}: ${lesson.title} (${lesson._count.exercises} exercises)`);
        totalLessons++;
        totalExercises += lesson._count.exercises;
      }
    }
    
    console.log("\n" + "-".repeat(60));
    console.log(`✅ TOTAL: ${totalLessons} lessons, ${totalExercises} exercises`);
    console.log("=".repeat(60));
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
