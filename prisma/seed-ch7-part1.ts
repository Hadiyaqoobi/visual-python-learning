import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 7 Part 1: Structure + Lessons 7.1.1-7.1.2...\n");

  // Create Chapter 7
  let chapter7 = await prisma.chapter.findFirst({ where: { number: 7 } });
  if (!chapter7) {
    chapter7 = await prisma.chapter.create({
      data: {
        number: 7,
        title: "Exceptions and Error Handling",
        description: "Handle errors gracefully with exceptions. Learn try/except blocks, raising exceptions, and building robust programs that don't crash.",
        objectives: [
          "Understand what exceptions are and why they matter",
          "Use try/except blocks to handle errors",
          "Raise exceptions to signal errors",
          "Create custom exceptions for domain-specific errors",
        ],
        isPublished: true,
      },
    });
  }
  console.log(`✅ Chapter ${chapter7.number}: ${chapter7.title}`);

  // Create Sections
  const section7_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter7.id, number: 7.1 } },
    update: {},
    create: { chapterId: chapter7.id, number: 7.1, title: "Handling Exceptions", description: "Catching and managing errors.", order: 1 },
  });
  console.log(`  📂 Section ${section7_1.number}: ${section7_1.title}`);

  const section7_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter7.id, number: 7.2 } },
    update: {},
    create: { chapterId: chapter7.id, number: 7.2, title: "Raising Exceptions", description: "Signaling errors in your code.", order: 2 },
  });
  console.log(`  📂 Section ${section7_2.number}: ${section7_2.title}`);

  const section7_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter7.id, number: 7.3 } },
    update: {},
    create: { chapterId: chapter7.id, number: 7.3, title: "Advanced Exception Handling", description: "Custom exceptions and best practices.", order: 3 },
  });
  console.log(`  📂 Section ${section7_3.number}: ${section7_3.title}`);

  // ==================== LESSON 7.1.1 ====================
  const lesson7_1_1 = await prisma.lesson.upsert({
    where: { slug: "understanding-exceptions" },
    update: {},
    create: {
      sectionId: section7_1.id,
      number: 7.11,
      title: "Understanding Exceptions",
      slug: "understanding-exceptions",
      objectives: [
        "Understand what exceptions are",
        "Know why exceptions are better than error codes",
        "Recognize common exception types",
        "See when Python raises exceptions",
      ],
      content: `# Understanding Exceptions

## What Are Exceptions?

Exceptions are **error signals** that interrupt normal program flow.

\`\`\`python
result = 10 / 0  # ZeroDivisionError!
\`\`\`

When Python encounters an error, it "raises" an exception. If not handled, the program crashes.

## Why Exceptions?

### Without Exceptions (Old Way)
\`\`\`python
def divide(a, b):
    if b == 0:
        return None  # Error? Or valid result?
    return a / b

result = divide(10, 0)
if result is None:
    print("Error!")  # Easy to forget this check!
\`\`\`

### With Exceptions (Better)
\`\`\`python
def divide(a, b):
    return a / b  # Raises exception if b == 0

try:
    result = divide(10, 0)
except ZeroDivisionError:
    print("Cannot divide by zero!")
\`\`\`

**Exceptions are better because:**
- Can't be ignored silently
- Separate error handling from normal code
- Provide detailed error information
- Propagate up the call stack automatically

## Common Exception Types

| Exception | When Raised |
|-----------|-------------|
| ZeroDivisionError | Division by zero |
| ValueError | Invalid value |
| TypeError | Wrong type |
| IndexError | List index out of range |
| KeyError | Dict key not found |
| FileNotFoundError | File doesn't exist |
| AttributeError | Object lacks attribute |

## The Exception Hierarchy

\`\`\`
BaseException
└── Exception
    ├── ValueError
    ├── TypeError
    ├── IndexError
    ├── KeyError
    └── ... (many more)
\`\`\`

Most exceptions inherit from \`Exception\`.`,
      codeExamples: JSON.stringify([
        {
          id: "exception-basics",
          title: "What Happens When Exceptions Occur",
          code: "# Normal code runs fine\nprint(\"Starting...\")\nx = 10\ny = 2\nprint(f\"{x} / {y} = {x / y}\")\n\n# But what if something goes wrong?\nprint(\"\\nNow with an error:\")\ntry:\n    x = 10\n    y = 0\n    print(f\"{x} / {y} = {x / y}\")  # This raises exception!\n    print(\"This line never runs\")    # Skipped!\nexcept ZeroDivisionError:\n    print(\"Caught a division by zero error!\")\n\nprint(\"\\nProgram continues after handling exception\")",
          description: "Exceptions interrupt normal flow",
        },
        {
          id: "common-exceptions",
          title: "Common Exception Types",
          code: "# ValueError - right type, wrong value\ntry:\n    num = int(\"hello\")  # Can't convert to int!\nexcept ValueError as e:\n    print(f\"ValueError: {e}\")\n\n# TypeError - wrong type for operation\ntry:\n    result = \"5\" + 3  # Can't add string and int!\nexcept TypeError as e:\n    print(f\"TypeError: {e}\")\n\n# IndexError - list index out of range\ntry:\n    items = [1, 2, 3]\n    print(items[10])  # Index doesn't exist!\nexcept IndexError as e:\n    print(f\"IndexError: {e}\")\n\n# KeyError - dict key not found\ntry:\n    data = {\"name\": \"Alice\"}\n    print(data[\"age\"])  # Key doesn't exist!\nexcept KeyError as e:\n    print(f\"KeyError: {e}\")",
          description: "Different types of exceptions",
        },
        {
          id: "without-handling",
          title: "What Happens Without Exception Handling",
          code: "def process_data(items):\n    \"\"\"Process a list of items.\"\"\"\n    total = 0\n    for item in items:\n        total += item\n    return total / len(items)\n\n# Works fine with valid data\nprint(f\"Average: {process_data([1, 2, 3, 4, 5])}\")\n\n# But crashes without handling!\nprint(\"\\nAbout to crash...\")\ntry:\n    # This would crash the program if not caught\n    result = process_data([])  # Empty list!\nexcept ZeroDivisionError:\n    print(\"Caught the crash! Empty list has no average.\")\n\nprint(\"Program survived!\")",
          description: "Unhandled exceptions crash programs",
        },
        {
          id: "exception-info",
          title: "Exception Information",
          code: "# Exceptions carry useful information\n\ntry:\n    numbers = [1, 2, 3]\n    print(numbers[10])\nexcept IndexError as e:\n    print(f\"Exception type: {type(e).__name__}\")\n    print(f\"Exception message: {e}\")\n    print(f\"Exception args: {e.args}\")\n\nprint()\n\ntry:\n    int(\"not a number\")\nexcept ValueError as e:\n    print(f\"Exception type: {type(e).__name__}\")\n    print(f\"Exception message: {e}\")\n\n# The 'as e' part captures the exception object\n# This lets you access the error details",
          description: "Accessing exception details",
        },
      ]),
      keyPoints: [
        "Exceptions are error signals that interrupt program flow",
        "Unhandled exceptions crash the program",
        "Exceptions are better than error codes",
        "Common types: ValueError, TypeError, IndexError, KeyError",
        "Use 'as e' to capture exception details",
        "Exceptions propagate up until handled",
        "Exception hierarchy: most inherit from Exception",
        "Exceptions provide detailed error information",
      ],
      hardwareDemo: "Watch exception propagate up call stack. See program counter jump to handler.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson7_1_1.number}: ${lesson7_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson7_1_1.id,
        number: 1,
        title: "Identify Exception Type",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "What exception does `int('hello')` raise?",
        starterCode: "",
        solution: "ValueError",
        testCases: JSON.stringify([
          { input: "ValueError", expectedOutput: "true", description: "Correct!" },
          { input: "TypeError", expectedOutput: "false", description: "Type is correct (str), value is wrong" },
          { input: "SyntaxError", expectedOutput: "false", description: "Syntax is fine" },
        ]),
        hints: ["The type (string) is valid for int()", "The value 'hello' can't be converted"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson7_1_1.id,
        number: 2,
        title: "Trigger an Exception",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Write code that causes a ZeroDivisionError, then catch it and print a message.",
        starterCode: "# Cause and catch ZeroDivisionError\n",
        solution: "try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Cannot divide by zero!", description: "Exception caught" }]),
        hints: ["Division by 0 causes ZeroDivisionError", "Use try/except"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson7_1_1.id,
        number: 3,
        title: "Access Exception Message",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Catch a KeyError and print the actual error message.",
        starterCode: "data = {\"name\": \"Alice\"}\n\n# Try to access data[\"age\"] and print the error message\n",
        solution: "data = {\"name\": \"Alice\"}\n\ntry:\n    print(data[\"age\"])\nexcept KeyError as e:\n    print(f\"Key not found: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Key not found: 'age'", description: "Message captured" }]),
        hints: ["Use 'as e' to capture exception", "Print the exception with f-string"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson7_1_1.id,
        number: 4,
        title: "What Gets Skipped?",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add print statements to see which lines run when exception occurs.",
        starterCode: "try:\n    print(\"Line 1\")\n    x = 1 / 0\n    print(\"Line 2\")  # Does this run?\nexcept ZeroDivisionError:\n    print(\"Line 3\")\n\nprint(\"Line 4\")",
        solution: "try:\n    print(\"Line 1\")  # Runs\n    x = 1 / 0         # Exception here!\n    print(\"Line 2\")  # SKIPPED\nexcept ZeroDivisionError:\n    print(\"Line 3\")  # Runs (handler)\n\nprint(\"Line 4\")      # Runs (after try/except)\n\n# Output: Line 1, Line 3, Line 4\n# Line 2 is skipped because exception occurred",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Line 1\\nLine 3\\nLine 4", description: "Correct flow" }]),
        hints: ["Exception stops code in try block", "Jumps to except, then continues after"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson7_1_1.id,
        number: 5,
        title: "Exception Hierarchy",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Show that catching Exception also catches ValueError and TypeError.",
        starterCode: "# Demonstrate that Exception catches multiple types\n",
        solution: "# All these inherit from Exception\n\n# Catch ValueError with Exception\ntry:\n    int(\"hello\")\nexcept Exception as e:\n    print(f\"Caught ValueError via Exception: {type(e).__name__}\")\n\n# Catch TypeError with Exception\ntry:\n    \"5\" + 3\nexcept Exception as e:\n    print(f\"Caught TypeError via Exception: {type(e).__name__}\")\n\n# Catch ZeroDivisionError with Exception\ntry:\n    1 / 0\nexcept Exception as e:\n    print(f\"Caught ZeroDivisionError via Exception: {type(e).__name__}\")\n\nprint(\"\\nException is the parent class - catches all!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All caught via Exception", description: "Hierarchy demonstrated" }]),
        hints: ["Exception is parent of most errors", "Child exceptions are caught by parent handler"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 7.1.1`);

  // ==================== LESSON 7.1.2 ====================
  const lesson7_1_2 = await prisma.lesson.upsert({
    where: { slug: "try-except-blocks" },
    update: {},
    create: {
      sectionId: section7_1.id,
      number: 7.12,
      title: "Try/Except Blocks",
      slug: "try-except-blocks",
      objectives: [
        "Write try/except blocks",
        "Handle specific exception types",
        "Access exception information",
        "Use multiple except clauses",
      ],
      content: `# Try/Except Blocks

## Basic Syntax

\`\`\`python
try:
    # Code that might raise exception
    risky_operation()
except ExceptionType:
    # Handle the exception
    handle_error()
\`\`\`

## How It Works

1. Python executes code in \`try\` block
2. If exception occurs, remaining \`try\` code is skipped
3. Python looks for matching \`except\` clause
4. If found, handler runs; if not, exception propagates

## Catching Specific Exceptions

\`\`\`python
try:
    value = int(input("Enter number: "))
except ValueError:
    print("That's not a valid number!")
\`\`\`

## Accessing Exception Details

Use \`as\` to capture the exception:

\`\`\`python
try:
    x = 1 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")
\`\`\`

## Multiple Except Clauses

\`\`\`python
try:
    # Risky code
    data = get_data()
    result = process(data)
except ValueError:
    print("Invalid value")
except TypeError:
    print("Wrong type")
except Exception as e:
    print(f"Unexpected error: {e}")
\`\`\`

## Order Matters!

Put specific exceptions before general ones:

\`\`\`python
# WRONG - Exception catches everything first!
except Exception:
    ...
except ValueError:  # Never reached!
    ...

# RIGHT - Specific first
except ValueError:
    ...
except Exception:
    ...
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-try-except",
          title: "Basic Try/Except",
          code: "# Without try/except - crashes!\n# result = 10 / 0  # ZeroDivisionError!\n\n# With try/except - handled gracefully\ntry:\n    result = 10 / 0\n    print(f\"Result: {result}\")\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero!\")\n    result = 0\n\nprint(f\"Program continues with result = {result}\")\n\n# Another example\ntry:\n    number = int(\"not a number\")\nexcept ValueError:\n    print(\"Invalid input - using default\")\n    number = 0\n\nprint(f\"Number is: {number}\")",
          description: "Basic exception handling",
        },
        {
          id: "capture-exception",
          title: "Capturing Exception Details",
          code: "# Capture exception with 'as'\ntry:\n    items = [1, 2, 3]\n    print(items[10])\nexcept IndexError as error:\n    print(f\"Error type: {type(error).__name__}\")\n    print(f\"Error message: {error}\")\n\nprint()\n\n# Useful for logging\ntry:\n    result = int(\"abc\")\nexcept ValueError as e:\n    print(f\"Conversion failed: {e}\")\n    # In real code: log the error\n    # logger.error(f\"Failed to convert: {e}\")\n\nprint()\n\n# Can also get more details\ntry:\n    data = {\"a\": 1}\n    value = data[\"b\"]\nexcept KeyError as e:\n    print(f\"Missing key: {e}\")\n    print(f\"Available keys: {list(data.keys())}\")",
          description: "Accessing error information",
        },
        {
          id: "multiple-except",
          title: "Multiple Except Clauses",
          code: "def safe_divide(a, b):\n    \"\"\"Divide a by b with error handling.\"\"\"\n    try:\n        return a / b\n    except ZeroDivisionError:\n        print(\"Error: Cannot divide by zero\")\n        return None\n    except TypeError:\n        print(\"Error: Both arguments must be numbers\")\n        return None\n\n# Test different errors\nprint(f\"10 / 2 = {safe_divide(10, 2)}\")\nprint(f\"10 / 0 = {safe_divide(10, 0)}\")\nprint(f\"'10' / 2 = {safe_divide('10', 2)}\")\n\nprint(\"\\n--- Another example ---\")\n\ndef get_item(data, key):\n    try:\n        return data[key]\n    except KeyError:\n        print(f\"Key '{key}' not found\")\n        return None\n    except TypeError:\n        print(\"Data must be a dictionary\")\n        return None\n\nprint(get_item({\"a\": 1}, \"a\"))    # Works\nprint(get_item({\"a\": 1}, \"b\"))    # KeyError\nprint(get_item(\"not a dict\", 0))  # TypeError",
          description: "Handling different exceptions",
        },
        {
          id: "catch-multiple-types",
          title: "Catching Multiple Types Together",
          code: "# Catch multiple exception types with one handler\ndef convert_to_int(value):\n    try:\n        return int(value)\n    except (ValueError, TypeError) as e:\n        print(f\"Conversion failed: {e}\")\n        return 0\n\nprint(convert_to_int(\"42\"))      # Works: 42\nprint(convert_to_int(\"hello\"))   # ValueError\nprint(convert_to_int([1, 2]))    # TypeError\nprint(convert_to_int(None))      # TypeError\n\nprint(\"\\n--- Order matters! ---\")\n\n# Specific before general\ntry:\n    x = int(\"abc\")\nexcept ValueError:\n    print(\"Caught ValueError specifically\")\nexcept Exception:\n    print(\"Caught something else\")\n\n# If we reversed the order, ValueError handler\n# would never run because Exception catches it first",
          description: "Multiple types in one handler",
        },
      ]),
      keyPoints: [
        "try: contains code that might fail",
        "except: handles the exception",
        "Use 'as e' to capture exception details",
        "Multiple except clauses for different types",
        "Specific exceptions before general ones",
        "Tuple syntax: except (Type1, Type2)",
        "Unhandled exceptions propagate up",
        "Code after except continues normally",
      ],
      hardwareDemo: "Watch try block execute. See jump to except when error occurs.",
      estimatedTime: 30,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson7_1_2.number}: ${lesson7_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson7_1_2.id,
        number: 1,
        title: "Basic Try/Except",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Wrap the division in try/except to handle division by zero.",
        starterCode: "def divide(a, b):\n    # Add try/except\n    return a / b\n\nprint(divide(10, 2))\nprint(divide(10, 0))  # Should not crash!",
        solution: "def divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        print(\"Cannot divide by zero!\")\n        return None\n\nprint(divide(10, 2))\nprint(divide(10, 0))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "5.0\\nCannot divide by zero!\\nNone", description: "Exception handled" }]),
        hints: ["Wrap a/b in try block", "Catch ZeroDivisionError"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson7_1_2.id,
        number: 2,
        title: "Capture Error Message",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Catch the exception and print the actual error message.",
        starterCode: "try:\n    numbers = [1, 2, 3]\n    print(numbers[10])\nexcept IndexError:\n    # Print the actual error message\n    print(\"An error occurred\")",
        solution: "try:\n    numbers = [1, 2, 3]\n    print(numbers[10])\nexcept IndexError as e:\n    print(f\"Error: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Error: list index out of range", description: "Message captured" }]),
        hints: ["Add 'as e' after IndexError", "Print e in f-string"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson7_1_2.id,
        number: 3,
        title: "Multiple Exception Types",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Handle both ValueError and TypeError separately.",
        starterCode: "def safe_int(value):\n    \"\"\"Convert value to int safely.\"\"\"\n    # Handle ValueError: invalid string\n    # Handle TypeError: can't convert type\n    return int(value)\n\nprint(safe_int(\"42\"))\nprint(safe_int(\"hello\"))\nprint(safe_int([1, 2]))",
        solution: "def safe_int(value):\n    try:\n        return int(value)\n    except ValueError:\n        print(f\"Cannot convert '{value}' to integer\")\n        return 0\n    except TypeError:\n        print(f\"Cannot convert {type(value).__name__} to integer\")\n        return 0\n\nprint(safe_int(\"42\"))\nprint(safe_int(\"hello\"))\nprint(safe_int([1, 2]))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "42 then two 0s with messages", description: "Both types handled" }]),
        hints: ["Two separate except blocks", "Different message for each type"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson7_1_2.id,
        number: 4,
        title: "Tuple Exception Handler",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Catch ValueError and TypeError with a single except clause using tuple syntax.",
        starterCode: "def convert(value):\n    \"\"\"Convert to int, catching multiple error types.\"\"\"\n    # Use except (Type1, Type2) syntax\n    return int(value)\n\nprint(convert(\"hello\"))\nprint(convert(None))",
        solution: "def convert(value):\n    try:\n        return int(value)\n    except (ValueError, TypeError) as e:\n        print(f\"Conversion error: {e}\")\n        return 0\n\nprint(convert(\"hello\"))\nprint(convert(None))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Both caught with one handler", description: "Tuple syntax works" }]),
        hints: ["except (ValueError, TypeError)", "Same handler for both"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson7_1_2.id,
        number: 5,
        title: "Safe Dictionary Access",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create get_nested that safely accesses nested dictionary keys.",
        starterCode: "def get_nested(data, keys):\n    \"\"\"Get nested value: get_nested(d, ['a', 'b']) = d['a']['b']\n    Return None if any key missing.\n    \"\"\"\n    # Navigate through keys with exception handling\n    pass\n\ndata = {\"user\": {\"name\": \"Alice\", \"age\": 25}}\nprint(get_nested(data, [\"user\", \"name\"]))  # Alice\nprint(get_nested(data, [\"user\", \"email\"])) # None\nprint(get_nested(data, [\"admin\", \"name\"])) # None",
        solution: "def get_nested(data, keys):\n    try:\n        result = data\n        for key in keys:\n            result = result[key]\n        return result\n    except (KeyError, TypeError):\n        return None\n\ndata = {\"user\": {\"name\": \"Alice\", \"age\": 25}}\nprint(get_nested(data, [\"user\", \"name\"]))\nprint(get_nested(data, [\"user\", \"email\"]))\nprint(get_nested(data, [\"admin\", \"name\"]))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Alice\\nNone\\nNone", description: "Safe nested access" }]),
        hints: ["Loop through keys", "Catch KeyError and TypeError"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 7.1.2`);

  console.log("\n✅ Chapter 7 Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
