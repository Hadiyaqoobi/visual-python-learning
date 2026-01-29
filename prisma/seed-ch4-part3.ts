import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 4 Part 3: Lessons 4.3.1-4.3.2...\n");

  const section4_3 = await prisma.section.findFirst({ where: { number: 4.3 } });
  if (!section4_3) throw new Error("Section 4.3 not found.");

  // ==================== LESSON 4.3.1 ====================
  const lesson4_3_1 = await prisma.lesson.upsert({
    where: { slug: "local-and-global-scope" },
    update: {},
    create: {
      sectionId: section4_3.id,
      number: 4.31,
      title: "Local and Global Scope",
      slug: "local-and-global-scope",
      objectives: [
        "Understand local variables inside functions",
        "Understand global variables outside functions",
        "Know the LEGB rule for name lookup",
        "Avoid common scoping mistakes",
      ],
      content: `# Local and Global Scope

## What Is Scope?

**Scope** determines where a variable can be accessed.

- **Local scope**: Inside a function
- **Global scope**: Outside all functions

## Local Variables

Variables created inside a function are **local**:

\`\`\`python
def my_function():
    x = 10  # Local variable
    print(x)

my_function()  # Works: prints 10
print(x)       # Error! x doesn't exist here
\`\`\`

Local variables:
- Created when function runs
- Destroyed when function ends
- Only accessible inside that function

## Global Variables

Variables created outside functions are **global**:

\`\`\`python
message = "Hello"  # Global variable

def greet():
    print(message)  # Can READ global

greet()  # Prints "Hello"
print(message)  # Also works
\`\`\`

## The LEGB Rule

Python looks for names in this order:
1. **L**ocal: Inside current function
2. **E**nclosing: In outer functions (nested)
3. **G**lobal: At module level
4. **B**uilt-in: Python's built-in names

\`\`\`python
x = "global"

def outer():
    x = "enclosing"
    
    def inner():
        x = "local"
        print(x)  # "local" (L)
    
    inner()

outer()
\`\`\`

## Same Name, Different Variables

Local variables **shadow** global ones:

\`\`\`python
x = 10  # Global x

def func():
    x = 20  # Local x (different variable!)
    print(x)  # 20

func()
print(x)  # Still 10! Global unchanged
\`\`\`

## Parameters Are Local

Function parameters are local variables:

\`\`\`python
def square(n):  # n is local
    return n ** 2

square(5)
print(n)  # Error! n doesn't exist here
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "local-scope",
          title: "Local Variables",
          code: "def calculate():\n    # These are LOCAL variables\n    a = 5\n    b = 10\n    result = a + b\n    print(f\"Inside function: {result}\")\n    return result\n\nvalue = calculate()\nprint(f\"Returned value: {value}\")\n\n# These would cause errors:\n# print(a)  # NameError: a is not defined\n# print(b)  # NameError: b is not defined\n# print(result)  # NameError: result is not defined",
          description: "Local variables only exist inside function",
        },
        {
          id: "global-scope",
          title: "Global Variables",
          code: "# Global variables\nPI = 3.14159\nAPP_NAME = \"Calculator\"\n\ndef circle_area(radius):\n    # Can READ global PI\n    return PI * radius ** 2\n\ndef show_info():\n    # Can READ global APP_NAME\n    print(f\"App: {APP_NAME}\")\n    print(f\"PI value: {PI}\")\n\nshow_info()\nprint(f\"\\nArea of radius 5: {circle_area(5):.2f}\")\nprint(f\"\\nGlobals still accessible: {PI}, {APP_NAME}\")",
          description: "Reading global variables from functions",
        },
        {
          id: "shadowing",
          title: "Variable Shadowing",
          code: "x = 100  # Global x\n\ndef func1():\n    x = 50  # Local x (shadows global)\n    print(f\"func1's x: {x}\")\n\ndef func2():\n    x = 25  # Different local x\n    print(f\"func2's x: {x}\")\n\ndef func3():\n    # No local x, uses global\n    print(f\"func3 sees global x: {x}\")\n\nprint(f\"Global x: {x}\")\nfunc1()\nfunc2()\nfunc3()\nprint(f\"Global x unchanged: {x}\")",
          description: "Local variables shadow global ones",
        },
        {
          id: "legb-demo",
          title: "LEGB Rule in Action",
          code: "x = \"global\"\n\ndef outer():\n    x = \"enclosing\"\n    \n    def inner():\n        x = \"local\"\n        print(f\"Inner sees: {x}\")  # local\n    \n    inner()\n    print(f\"Outer sees: {x}\")  # enclosing\n\nouter()\nprint(f\"Module sees: {x}\")  # global\n\n# Built-in example\nprint(f\"\\nlen is built-in: {len}\")\nprint(f\"len('hello') = {len('hello')}\")",
          description: "Demonstrating LEGB lookup order",
        },
      ]),
      keyPoints: [
        "Local variables: created inside functions",
        "Global variables: created outside functions",
        "Local variables destroyed when function ends",
        "Functions can READ global variables",
        "Local variables shadow globals with same name",
        "Parameters are local variables",
        "LEGB: Local → Enclosing → Global → Built-in",
        "Each function has its own local scope",
      ],
      hardwareDemo: "Watch local variables appear in stack frame. See them disappear when function returns.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson4_3_1.number}: ${lesson4_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_3_1.id,
        number: 1,
        title: "Local Variable",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a function that uses a local variable. Show that the variable doesn't exist outside.",
        starterCode: "def create_message():\n    # Create local variable\n    pass\n\ncreate_message()\n# Try to print the local variable (it won't work)\n",
        solution: "def create_message():\n    msg = \"Hello from function!\"\n    print(msg)\n\ncreate_message()\n# print(msg)  # This would cause NameError!\nprint(\"msg only exists inside the function\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Hello from function!", description: "Local variable used" }]),
        hints: ["Create a variable inside the function", "The variable won't exist outside"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson4_3_1.id,
        number: 2,
        title: "Read Global",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a global variable TAX_RATE = 0.08. Write a function that uses it to calculate tax.",
        starterCode: "# Global variable\nTAX_RATE = 0.08\n\ndef calculate_tax(amount):\n    # Use global TAX_RATE\n    pass\n\nprint(calculate_tax(100))",
        solution: "TAX_RATE = 0.08\n\ndef calculate_tax(amount):\n    return amount * TAX_RATE\n\nprint(f\"Tax on $100: ${calculate_tax(100)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Tax on $100: $8.0", description: "Uses global" }]),
        hints: ["Function can read TAX_RATE directly", "No special syntax needed to read globals"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson4_3_1.id,
        number: 3,
        title: "Shadowing",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create global x = 10. Create a function with local x = 20. Show both values.",
        starterCode: "x = 10  # Global\n\ndef show_x():\n    # Create local x\n    pass\n\n# Show function's x and global x\n",
        solution: "x = 10  # Global\n\ndef show_x():\n    x = 20  # Local (shadows global)\n    print(f\"Inside function, x = {x}\")\n\nshow_x()\nprint(f\"Outside function, x = {x}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Inside: 20, Outside: 10", description: "Different values" }]),
        hints: ["Local x is a different variable", "Global x is unchanged"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson4_3_1.id,
        number: 4,
        title: "Multiple Functions Same Name",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create two functions, each with a local variable called 'count'. Show they're independent.",
        starterCode: "def count_up():\n    # Local count\n    pass\n\ndef count_down():\n    # Different local count\n    pass\n\ncount_up()\ncount_down()",
        solution: "def count_up():\n    count = 0\n    for i in range(3):\n        count += 1\n        print(f\"Up: {count}\")\n\ndef count_down():\n    count = 10\n    for i in range(3):\n        count -= 1\n        print(f\"Down: {count}\")\n\ncount_up()\nprint()\ncount_down()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Independent counts", description: "No interference" }]),
        hints: ["Each function has its own 'count'", "They don't affect each other"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson4_3_1.id,
        number: 5,
        title: "LEGB Prediction",
        type: "MULTIPLE_CHOICE",
        difficulty: "ADVANCED",
        prompt: "What does this print?\n\nx = 'A'\ndef outer():\n    x = 'B'\n    def inner():\n        print(x)\n    inner()\nouter()",
        starterCode: "",
        solution: "B - inner() looks for x locally (not found), then in enclosing scope (finds 'B')",
        testCases: JSON.stringify([
          { input: "A", expectedOutput: "false", description: "Wrong - that's global" },
          { input: "B", expectedOutput: "true", description: "Correct - enclosing scope" },
          { input: "Error", expectedOutput: "false", description: "Wrong - x is found" },
        ]),
        hints: ["LEGB: Local, Enclosing, Global, Built-in", "inner() has no local x", "Check enclosing (outer) next"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 4.3.1`);

  // ==================== LESSON 4.3.2 ====================
  const lesson4_3_2 = await prisma.lesson.upsert({
    where: { slug: "global-keyword" },
    update: {},
    create: {
      sectionId: section4_3.id,
      number: 4.32,
      title: "The global Keyword",
      slug: "global-keyword",
      objectives: [
        "Modify global variables from functions",
        "Use the global keyword correctly",
        "Understand when to use (and avoid) global",
        "Know alternatives to global variables",
      ],
      content: `# The global Keyword

## The Problem: Modifying Globals

Functions can READ globals, but assignment creates a LOCAL:

\`\`\`python
count = 0

def increment():
    count = count + 1  # Error! Local 'count' used before assignment

increment()
\`\`\`

Python sees \`count = ...\` and creates a local variable. But \`count + 1\` tries to read it before it's assigned!

## The Solution: global Keyword

\`global\` tells Python to use the global variable:

\`\`\`python
count = 0

def increment():
    global count  # Use global count
    count = count + 1

increment()
print(count)  # 1
\`\`\`

## When to Use global

Use sparingly! Valid cases:
- Configuration settings
- Counters for debugging
- Simple scripts

## Why Avoid global?

Global variables cause problems:
- Hard to track changes (any function could modify)
- Hard to test (function depends on external state)
- Hard to reuse (function needs specific global)
- Bugs from unexpected modifications

## Better Alternatives

**Instead of global, use:**

1. **Parameters and return values:**
\`\`\`python
def increment(count):
    return count + 1

count = 0
count = increment(count)
\`\`\`

2. **Classes (later chapter):**
\`\`\`python
class Counter:
    def __init__(self):
        self.count = 0
    def increment(self):
        self.count += 1
\`\`\`

## Constants Are OK

Global CONSTANTS (don't change) are fine:
\`\`\`python
PI = 3.14159
MAX_SIZE = 100
TAX_RATE = 0.08
\`\`\`

Use ALL_CAPS to indicate constants.`,
      codeExamples: JSON.stringify([
        {
          id: "global-problem",
          title: "The Problem Without global",
          code: "total = 0\n\ndef add_to_total(value):\n    # This creates a LOCAL total, doesn't modify global!\n    total = total + value  # UnboundLocalError!\n\n# Uncomment to see error:\n# add_to_total(10)\n\n# What actually happens:\ndef add_wrong(value):\n    total = value  # Creates LOCAL total\n    print(f\"Local total: {total}\")\n\nadd_wrong(10)\nprint(f\"Global total unchanged: {total}\")",
          description: "Why we need the global keyword",
        },
        {
          id: "global-solution",
          title: "Using global Keyword",
          code: "count = 0\n\ndef increment():\n    global count  # Tell Python to use global\n    count = count + 1\n    print(f\"Count is now: {count}\")\n\ndef reset():\n    global count\n    count = 0\n    print(\"Count reset to 0\")\n\nprint(f\"Initial: {count}\")\nincrement()\nincrement()\nincrement()\nprint(f\"After increments: {count}\")\nreset()\nprint(f\"After reset: {count}\")",
          description: "Correctly modifying global variables",
        },
        {
          id: "better-approach",
          title: "Better Alternative: Parameters and Returns",
          code: "# Instead of using global...\n\ndef increment(count):\n    \"\"\"Return incremented count.\"\"\"\n    return count + 1\n\ndef add(count, value):\n    \"\"\"Return count plus value.\"\"\"\n    return count + value\n\n# Usage - explicit flow of data\ncount = 0\nprint(f\"Start: {count}\")\n\ncount = increment(count)\nprint(f\"After increment: {count}\")\n\ncount = add(count, 10)\nprint(f\"After adding 10: {count}\")\n\ncount = increment(increment(increment(count)))\nprint(f\"After 3 more increments: {count}\")",
          description: "Parameters and returns instead of global",
        },
        {
          id: "constants-ok",
          title: "Global Constants Are Fine",
          code: "# Constants (don't change) - ALL_CAPS convention\nTAX_RATE = 0.08\nDISCOUNT_RATE = 0.10\nMAX_ITEMS = 100\n\ndef calculate_total(subtotal, apply_discount=False):\n    \"\"\"Calculate total with tax and optional discount.\"\"\"\n    if apply_discount:\n        subtotal = subtotal * (1 - DISCOUNT_RATE)\n    tax = subtotal * TAX_RATE\n    return subtotal + tax\n\ndef is_valid_order(item_count):\n    \"\"\"Check if order size is valid.\"\"\"\n    return 0 < item_count <= MAX_ITEMS\n\nprint(f\"Total for $100: ${calculate_total(100):.2f}\")\nprint(f\"Total with discount: ${calculate_total(100, True):.2f}\")\nprint(f\"Valid order of 50 items? {is_valid_order(50)}\")\nprint(f\"Valid order of 150 items? {is_valid_order(150)}\")",
          description: "Using global constants properly",
        },
      ]),
      keyPoints: [
        "Assignment in function creates local variable",
        "global keyword lets function modify global",
        "Put global at start of function",
        "Avoid global when possible",
        "Better: use parameters and return values",
        "Global constants (ALL_CAPS) are acceptable",
        "Global variables make code harder to test/debug",
        "Each function should be self-contained",
      ],
      hardwareDemo: "See global declaration prevent local variable creation. Watch global memory location change.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson4_3_2.number}: ${lesson4_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_3_2.id,
        number: 1,
        title: "Use global",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Fix this code using global so increment() actually changes the global count.",
        starterCode: "count = 0\n\ndef increment():\n    # Fix this function\n    count = count + 1\n\nincrement()\nincrement()\nprint(f\"Count: {count}\")  # Should print 2",
        solution: "count = 0\n\ndef increment():\n    global count\n    count = count + 1\n\nincrement()\nincrement()\nprint(f\"Count: {count}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Count: 2", description: "Global modified" }]),
        hints: ["Add 'global count' at start of function", "Then the assignment modifies global"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson4_3_2.id,
        number: 2,
        title: "Counter with Reset",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a global counter with increment() and reset() functions using global.",
        starterCode: "counter = 0\n\ndef increment():\n    pass\n\ndef reset():\n    pass\n\n# Test\nincrement()\nincrement()\nprint(f\"After 2 increments: {counter}\")\nreset()\nprint(f\"After reset: {counter}\")",
        solution: "counter = 0\n\ndef increment():\n    global counter\n    counter += 1\n\ndef reset():\n    global counter\n    counter = 0\n\nincrement()\nincrement()\nprint(f\"After 2 increments: {counter}\")\nreset()\nprint(f\"After reset: {counter}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "After 2 increments: 2\\nAfter reset: 0", description: "Counter works" }]),
        hints: ["Both functions need global counter", "reset() sets counter to 0"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson4_3_2.id,
        number: 3,
        title: "Better Without Global",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Rewrite this to NOT use global - use parameters and returns instead.",
        starterCode: "# Original (uses global - bad)\n# total = 0\n# def add_to_total(value):\n#     global total\n#     total = total + value\n\n# Better version - no global!\ndef add(current_total, value):\n    pass\n\n# Usage\ntotal = 0\ntotal = add(total, 10)\ntotal = add(total, 5)\nprint(f\"Total: {total}\")  # Should be 15",
        solution: "def add(current_total, value):\n    return current_total + value\n\ntotal = 0\ntotal = add(total, 10)\ntotal = add(total, 5)\nprint(f\"Total: {total}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Total: 15", description: "No global needed" }]),
        hints: ["Function takes current value as parameter", "Returns new value", "Assign result back to variable"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson4_3_2.id,
        number: 4,
        title: "Constants Usage",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create constants for tax rate (0.07) and tip rate (0.18). Write functions to calculate each.",
        starterCode: "# Define constants\n\n\ndef calculate_tax(amount):\n    pass\n\ndef calculate_tip(amount):\n    pass\n\nbill = 50\nprint(f\"Tax: ${calculate_tax(bill):.2f}\")\nprint(f\"Tip: ${calculate_tip(bill):.2f}\")",
        solution: "TAX_RATE = 0.07\nTIP_RATE = 0.18\n\ndef calculate_tax(amount):\n    return amount * TAX_RATE\n\ndef calculate_tip(amount):\n    return amount * TIP_RATE\n\nbill = 50\nprint(f\"Tax: ${calculate_tax(bill):.2f}\")\nprint(f\"Tip: ${calculate_tip(bill):.2f}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Tax: $3.50\\nTip: $9.00", description: "Constants used" }]),
        hints: ["Use ALL_CAPS for constants", "Functions can read constants directly"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson4_3_2.id,
        number: 5,
        title: "Spot the Bug",
        type: "MULTIPLE_CHOICE",
        difficulty: "ADVANCED",
        prompt: "What's wrong with this code?\n\nscore = 0\ndef add_points(points):\n    score += points\nadd_points(10)",
        starterCode: "",
        solution: "UnboundLocalError - 'score += points' creates local, which is read before assignment. Need 'global score'.",
        testCases: JSON.stringify([
          { input: "Works fine", expectedOutput: "false", description: "No, it errors" },
          { input: "UnboundLocalError", expectedOutput: "true", description: "Correct!" },
          { input: "TypeError", expectedOutput: "false", description: "Wrong error type" },
        ]),
        hints: ["score += points is same as score = score + points", "Assignment creates local variable", "Local 'score' is read before assigned"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 4.3.2`);

  console.log("\n✅ Chapter 4 Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
