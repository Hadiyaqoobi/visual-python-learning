import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Chapter 7: Exceptions and Assertions...");

  // Create Chapter 7
  const chapter7 = await prisma.chapter.upsert({
    where: { number: 7 },
    update: {},
    create: {
      number: 7,
      title: "Exceptions and Assertions",
      description: "Learn to handle errors gracefully with exceptions, raise your own exceptions, and use assertions for defensive programming.",
      objectives: [
        "Handle exceptions with try/except blocks",
        "Understand different exception types",
        "Use else and finally clauses appropriately",
        "Raise exceptions to signal errors",
        "Create custom exception classes",
        "Use assertions effectively for debugging",
      ],
      isPublished: true,
    },
  });

  console.log("✅ Created Chapter 7:", chapter7.title);

  // Create Sections
  const section7_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter7.id, number: 7.1 } },
    update: {},
    create: {
      chapterId: chapter7.id,
      number: 7.1,
      title: "Handling Exceptions",
      description: "Catching and handling errors gracefully",
      order: 1,
    },
  });

  const section7_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter7.id, number: 7.2 } },
    update: {},
    create: {
      chapterId: chapter7.id,
      number: 7.2,
      title: "Raising Exceptions",
      description: "Signaling errors in your code",
      order: 2,
    },
  });

  const section7_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter7.id, number: 7.3 } },
    update: {},
    create: {
      chapterId: chapter7.id,
      number: 7.3,
      title: "Assertions Revisited",
      description: "Using assertions for debugging and validation",
      order: 3,
    },
  });

  // ==================== LESSON 7.1.1: Introduction to Exceptions ====================
  const lesson7_1_1 = await prisma.lesson.upsert({
    where: { slug: "intro-exceptions" },
    update: {},
    create: {
      sectionId: section7_1.id,
      number: 7.11,
      title: "Introduction to Exceptions",
      slug: "intro-exceptions",
      objectives: [
        "Understand what exceptions are",
        "Recognize common exception types",
        "Know when exceptions occur",
        "Read and interpret error messages",
      ],
      content: `# Introduction to Exceptions

An **exception** is an error that occurs during program execution. When Python encounters an error, it "raises" an exception.

## What Happens Without Handling

\`\`\`python
print(10 / 0)  # ZeroDivisionError!
# Program crashes here
print("This never runs")
\`\`\`

## Common Exception Types

| Exception | When It Occurs |
|-----------|----------------|
| \`ZeroDivisionError\` | Division by zero |
| \`TypeError\` | Wrong type for operation |
| \`ValueError\` | Right type, wrong value |
| \`IndexError\` | List index out of range |
| \`KeyError\` | Dictionary key not found |
| \`FileNotFoundError\` | File doesn't exist |
| \`NameError\` | Variable not defined |
| \`AttributeError\` | Object has no such attribute |

## Anatomy of an Error Message

\`\`\`
Traceback (most recent call last):
  File "example.py", line 5, in <module>
    result = numbers[10]
IndexError: list index out of range
\`\`\`

Reading from bottom up:
1. **Exception type**: IndexError
2. **Message**: list index out of range
3. **Location**: File, line number, code

## Why Handle Exceptions?

- Prevent crashes
- Provide user-friendly error messages
- Recover gracefully from errors
- Clean up resources (close files, etc.)

## The Big Picture

Exceptions separate "normal" code from error-handling code, making both clearer.`,
      codeExamples: JSON.stringify([
        {
          id: "common-exceptions",
          title: "Common Exceptions",
          code: `# These would crash if not handled:

# ZeroDivisionError
# print(10 / 0)

# TypeError
# print("age: " + 25)  # Can't concatenate str and int

# IndexError
numbers = [1, 2, 3]
# print(numbers[10])  # Index out of range

# KeyError
person = {"name": "Alice"}
# print(person["age"])  # Key doesn't exist

# ValueError
# int("hello")  # Can't convert to int

print("Examples of exceptions (commented out to prevent crashes)")`,
          description: "Different types of exceptions",
        },
        {
          id: "error-message",
          title: "Reading Error Messages",
          code: `def get_element(lst, index):
    return lst[index]

def process_data(data):
    return get_element(data, 10)

# This will show a traceback
numbers = [1, 2, 3]
try:
    result = process_data(numbers)
except IndexError as e:
    print("Error occurred!")
    print(f"Exception type: {type(e).__name__}")
    print(f"Message: {e}")`,
          description: "Understanding error information",
        },
        {
          id: "without-handling",
          title: "Without Exception Handling",
          code: `def divide(a, b):
    return a / b

# Safe division
print(f"10 / 2 = {divide(10, 2)}")

# This would crash without handling:
# print(f"10 / 0 = {divide(10, 0)}")

print("Program continues only if no exception...")`,
          description: "Unhandled exceptions crash the program",
        },
      ]),
      keyPoints: [
        "Exceptions are errors that occur during execution",
        "Unhandled exceptions crash the program",
        "Each exception type indicates a specific error",
        "Error messages show type, message, and location",
        "Handling exceptions prevents crashes",
      ],
      hardwareDemo: "Watch the program counter jump when an exception occurs. See how execution stops at the error point and the stack unwinds.",
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
        lessonId: lesson7_1_1.id,
        number: 1,
        title: "Identify the Exception",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Run this code to see what exception occurs, then print the exception type.",
        starterCode: `numbers = [1, 2, 3]

try:
    print(numbers[10])
except Exception as e:
    print(f"Exception type: {type(e).__name__}")`,
        solution: `numbers = [1, 2, 3]

try:
    print(numbers[10])
except Exception as e:
    print(f"Exception type: {type(e).__name__}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Exception type: IndexError", description: "Identifies IndexError" },
        ]),
        hints: ["Index 10 is out of range", "List only has indices 0, 1, 2", "This causes IndexError"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson7_1_1.id,
        number: 2,
        title: "Predict the Exception",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "What exception will this code raise? Run to verify.",
        starterCode: `try:
    result = int("hello")
except Exception as e:
    print(f"Exception: {type(e).__name__}")
    print(f"Message: {e}")`,
        solution: `try:
    result = int("hello")
except Exception as e:
    print(f"Exception: {type(e).__name__}")
    print(f"Message: {e}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Exception: ValueError\nMessage: invalid literal for int() with base 10: 'hello'", description: "Shows ValueError" },
        ]),
        hints: ["'hello' can't become an integer", "int() expects numeric strings", "This is a ValueError"],
        xpReward: 15,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 7.1.1: Introduction to Exceptions");

  // ==================== LESSON 7.1.2: Try/Except Blocks ====================
  const lesson7_1_2 = await prisma.lesson.upsert({
    where: { slug: "try-except" },
    update: {},
    create: {
      sectionId: section7_1.id,
      number: 7.12,
      title: "Try/Except Blocks",
      slug: "try-except",
      objectives: [
        "Write basic try/except blocks",
        "Handle specific exception types",
        "Access exception information",
        "Continue program execution after errors",
      ],
      content: `# Try/Except Blocks

The \`try/except\` block lets you handle exceptions gracefully instead of crashing.

## Basic Syntax

\`\`\`python
try:
    # Code that might raise an exception
    risky_operation()
except:
    # Code to handle the exception
    print("Something went wrong")
\`\`\`

## Catching Specific Exceptions

\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
\`\`\`

## Accessing the Exception Object

\`\`\`python
try:
    result = int("hello")
except ValueError as e:
    print(f"Error: {e}")
\`\`\`

## Program Flow

\`\`\`python
print("Before try")
try:
    print("Inside try")
    x = 1 / 0  # Exception here
    print("This won't run")
except ZeroDivisionError:
    print("In except block")
print("After try/except")
\`\`\`

Output:
\`\`\`
Before try
Inside try
In except block
After try/except
\`\`\`

## Best Practices

1. **Catch specific exceptions**, not bare \`except:\`
2. **Keep try blocks small** - only the risky code
3. **Don't silence errors** - at least log them
4. **Handle at the right level** - where you can do something useful

## Bare Except (Avoid!)

\`\`\`python
# BAD - catches everything, even Ctrl+C!
try:
    risky_code()
except:
    pass

# BETTER - catch specific or Exception
try:
    risky_code()
except Exception as e:
    print(f"Error: {e}")
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-try-except",
          title: "Basic Try/Except",
          code: `def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("Error: Cannot divide by zero!")
        return None

print(safe_divide(10, 2))
print(safe_divide(10, 0))
print(safe_divide(8, 4))`,
          description: "Handle division by zero",
        },
        {
          id: "exception-info",
          title: "Accessing Exception Info",
          code: `def parse_int(text):
    try:
        return int(text)
    except ValueError as e:
        print(f"Could not parse '{text}'")
        print(f"Error details: {e}")
        return None

print(parse_int("42"))
print(parse_int("hello"))
print(parse_int("3.14"))`,
          description: "Get error message from exception",
        },
        {
          id: "program-continues",
          title: "Program Continues",
          code: `numbers = ["1", "two", "3", "four", "5"]
total = 0

for item in numbers:
    try:
        num = int(item)
        total += num
        print(f"Added {num}")
    except ValueError:
        print(f"Skipping '{item}' - not a number")

print(f"Total: {total}")`,
          description: "Keep going after errors",
        },
      ]),
      keyPoints: [
        "try block contains code that might fail",
        "except block handles the exception",
        "Catch specific exceptions when possible",
        "Use 'as e' to access the exception object",
        "Program continues after handled exception",
      ],
      hardwareDemo: "Watch execution jump from the try block to the except block when an exception occurs. See the program counter skip over the remaining try code.",
      estimatedTime: 18,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson7_1_2.id,
        number: 1,
        title: "Safe Division",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Complete the try/except to handle ZeroDivisionError and return 0 if division fails.",
        starterCode: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return 0

print(safe_divide(10, 2))
print(safe_divide(10, 0))`,
        solution: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return 0

print(safe_divide(10, 2))
print(safe_divide(10, 0))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "5.0\n0", description: "Handles division by zero" },
        ]),
        hints: ["try: return a / b", "except ZeroDivisionError:", "Return 0 in except block"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson7_1_2.id,
        number: 2,
        title: "Safe List Access",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function that safely gets a list item, returning None if index is out of range.",
        starterCode: `def safe_get(lst, index):
    try:
        return lst[index]
    except IndexError:
        return None

numbers = [10, 20, 30]
print(safe_get(numbers, 1))
print(safe_get(numbers, 10))`,
        solution: `def safe_get(lst, index):
    try:
        return lst[index]
    except IndexError:
        return None

numbers = [10, 20, 30]
print(safe_get(numbers, 1))
print(safe_get(numbers, 10))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "20\nNone", description: "Returns None for bad index" },
        ]),
        hints: ["try to access lst[index]", "Catch IndexError", "Return None in except"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson7_1_2.id,
        number: 3,
        title: "Parse Numbers",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Sum only the valid integers from a list of strings, skipping invalid ones.",
        starterCode: `def sum_valid_numbers(items):
    total = 0
    for item in items:
        try:
            total += int(item)
        except ValueError:
            pass  # Skip invalid items
    return total

data = ["10", "hello", "20", "world", "30"]
print(sum_valid_numbers(data))`,
        solution: `def sum_valid_numbers(items):
    total = 0
    for item in items:
        try:
            total += int(item)
        except ValueError:
            pass
    return total

data = ["10", "hello", "20", "world", "30"]
print(sum_valid_numbers(data))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "60", description: "Sums 10 + 20 + 30 = 60" },
        ]),
        hints: ["Try to convert each item to int", "Catch ValueError for non-numbers", "pass skips to next item"],
        xpReward: 20,
        order: 3,
      },
    ],
  });

  console.log("✅ Created Lesson 7.1.2: Try/Except Blocks");

  // ==================== LESSON 7.1.3: Exception Types ====================
  const lesson7_1_3 = await prisma.lesson.upsert({
    where: { slug: "exception-types" },
    update: {},
    create: {
      sectionId: section7_1.id,
      number: 7.13,
      title: "Exception Types",
      slug: "exception-types",
      objectives: [
        "Know the common built-in exception types",
        "Choose the right exception to catch",
        "Understand the exception hierarchy",
        "Use Exception as a catch-all",
      ],
      content: `# Exception Types

Python has many built-in exception types. Knowing them helps you write better error handling.

## Common Exceptions

### ValueError
Right type, wrong value:
\`\`\`python
int("hello")  # Can't convert to int
list.remove(x)  # x not in list
\`\`\`

### TypeError
Wrong type for operation:
\`\`\`python
"hello" + 5  # Can't add str and int
len(42)  # int has no len
\`\`\`

### IndexError
Sequence index out of range:
\`\`\`python
lst = [1, 2, 3]
lst[10]  # Only indices 0, 1, 2 exist
\`\`\`

### KeyError
Dictionary key not found:
\`\`\`python
d = {"a": 1}
d["b"]  # Key "b" doesn't exist
\`\`\`

### AttributeError
Object doesn't have attribute:
\`\`\`python
"hello".append("!")  # Strings don't have append
\`\`\`

### FileNotFoundError
File doesn't exist:
\`\`\`python
open("nonexistent.txt")
\`\`\`

## Exception Hierarchy

All exceptions inherit from \`BaseException\`:

\`\`\`
BaseException
├── SystemExit
├── KeyboardInterrupt
└── Exception
    ├── ValueError
    ├── TypeError
    ├── IndexError
    ├── KeyError
    └── ... many more
\`\`\`

Catching \`Exception\` catches most errors (but not KeyboardInterrupt).

## Choosing What to Catch

- Catch the most specific exception possible
- Use \`Exception\` only as a fallback
- Never catch \`BaseException\` (blocks Ctrl+C)`,
      codeExamples: JSON.stringify([
        {
          id: "exception-examples",
          title: "Common Exception Examples",
          code: `def demonstrate_exceptions():
    exceptions = []
    
    # ValueError
    try:
        int("abc")
    except ValueError as e:
        exceptions.append(("ValueError", str(e)))
    
    # TypeError
    try:
        "hello" + 5
    except TypeError as e:
        exceptions.append(("TypeError", str(e)))
    
    # IndexError
    try:
        [1, 2, 3][10]
    except IndexError as e:
        exceptions.append(("IndexError", str(e)))
    
    # KeyError
    try:
        {"a": 1}["b"]
    except KeyError as e:
        exceptions.append(("KeyError", str(e)))
    
    for exc_type, msg in exceptions:
        print(f"{exc_type}: {msg}")

demonstrate_exceptions()`,
          description: "See different exception types",
        },
        {
          id: "specific-vs-general",
          title: "Specific vs General Catching",
          code: `def process_data(data, index):
    try:
        value = data[index]
        return int(value)
    except IndexError:
        print("Index out of range")
        return None
    except ValueError:
        print("Could not convert to int")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

data = ["10", "hello", "30"]
print(process_data(data, 0))  # Works
print(process_data(data, 1))  # ValueError
print(process_data(data, 10)) # IndexError`,
          description: "Handle different exceptions differently",
        },
      ]),
      keyPoints: [
        "ValueError: right type, wrong value",
        "TypeError: wrong type for operation",
        "IndexError: sequence index out of range",
        "KeyError: dictionary key not found",
        "Catch specific exceptions when possible",
        "Exception catches most errors",
      ],
      hardwareDemo: "See different exception types being raised. Watch how Python determines which exception class to create based on the error.",
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 3,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson7_1_3.id,
        number: 1,
        title: "Match Exception Types",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add the correct exception types to handle each error case.",
        starterCode: `def safe_operation(data, key):
    try:
        value = data[key]
        return int(value)
    except KeyError:
        return "Key not found"
    except ValueError:
        return "Cannot convert to int"

data = {"a": "10", "b": "hello"}
print(safe_operation(data, "a"))
print(safe_operation(data, "b"))
print(safe_operation(data, "c"))`,
        solution: `def safe_operation(data, key):
    try:
        value = data[key]
        return int(value)
    except KeyError:
        return "Key not found"
    except ValueError:
        return "Cannot convert to int"

data = {"a": "10", "b": "hello"}
print(safe_operation(data, "a"))
print(safe_operation(data, "b"))
print(safe_operation(data, "c"))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "10\nCannot convert to int\nKey not found", description: "Handles both exception types" },
        ]),
        hints: ["Missing key = KeyError", "Bad int conversion = ValueError", "Each needs its own except"],
        xpReward: 20,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 7.1.3: Exception Types");

  // ==================== LESSON 7.1.4: Multiple Except Clauses ====================
  const lesson7_1_4 = await prisma.lesson.upsert({
    where: { slug: "multiple-except" },
    update: {},
    create: {
      sectionId: section7_1.id,
      number: 7.14,
      title: "Multiple Except Clauses",
      slug: "multiple-except",
      objectives: [
        "Handle multiple exception types",
        "Combine exceptions in one handler",
        "Order except clauses correctly",
        "Use exception groups effectively",
      ],
      content: `# Multiple Except Clauses

You can handle different exceptions with different except blocks.

## Multiple Handlers

\`\`\`python
try:
    risky_operation()
except ValueError:
    print("Bad value")
except TypeError:
    print("Wrong type")
except Exception as e:
    print(f"Other error: {e}")
\`\`\`

## Handling Multiple Types Together

\`\`\`python
try:
    risky_operation()
except (ValueError, TypeError) as e:
    print(f"Value or type error: {e}")
\`\`\`

## Order Matters!

Exceptions are checked top to bottom. Put specific ones first:

\`\`\`python
# WRONG - Exception catches everything first!
try:
    risky()
except Exception:
    print("General")
except ValueError:  # Never reached!
    print("Value error")

# RIGHT - specific first
try:
    risky()
except ValueError:
    print("Value error")
except Exception:
    print("General")
\`\`\`

## Complete Example

\`\`\`python
def process_item(data, index):
    try:
        item = data[index]
        return int(item) * 2
    except IndexError:
        return "Index out of range"
    except ValueError:
        return "Cannot convert to number"
    except TypeError:
        return "Invalid data type"
    except Exception as e:
        return f"Unknown error: {e}"
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "multiple-handlers",
          title: "Multiple Exception Handlers",
          code: `def convert_and_double(value):
    try:
        num = int(value)
        return num * 2
    except ValueError:
        return "Cannot convert to integer"
    except TypeError:
        return "Invalid type provided"

print(convert_and_double("5"))
print(convert_and_double("hello"))
print(convert_and_double(None))`,
          description: "Different handlers for different errors",
        },
        {
          id: "combined-handler",
          title: "Combined Exception Handler",
          code: `def safe_access(container, key):
    try:
        return container[key]
    except (KeyError, IndexError, TypeError) as e:
        print(f"Access error ({type(e).__name__}): {e}")
        return None

print(safe_access({"a": 1}, "b"))  # KeyError
print(safe_access([1, 2, 3], 10))  # IndexError
print(safe_access(None, 0))        # TypeError`,
          description: "One handler for multiple types",
        },
        {
          id: "order-matters",
          title: "Exception Order",
          code: `def demonstrate_order(value):
    try:
        return int(value)
    except ValueError:
        return "ValueError caught"
    except Exception:
        return "Exception caught"

# ValueError is more specific, caught first
print(demonstrate_order("hello"))

# If we swap the order, Exception would catch everything!`,
          description: "Specific exceptions before general",
        },
      ]),
      keyPoints: [
        "Multiple except blocks handle different types",
        "Combine types with tuple: except (A, B)",
        "Order matters - specific before general",
        "Exception catches most errors (use as fallback)",
      ],
      hardwareDemo: "Watch Python check each except clause in order until it finds a match. See how the exception type is compared against each handler.",
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 4,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson7_1_4.id,
        number: 1,
        title: "Handle Multiple Types",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Handle both KeyError and IndexError with appropriate messages.",
        starterCode: `def get_value(container, key):
    try:
        return container[key]
    except KeyError:
        return "Key not found in dictionary"
    except IndexError:
        return "Index out of range"

print(get_value({"a": 1}, "b"))
print(get_value([1, 2, 3], 10))`,
        solution: `def get_value(container, key):
    try:
        return container[key]
    except KeyError:
        return "Key not found in dictionary"
    except IndexError:
        return "Index out of range"

print(get_value({"a": 1}, "b"))
print(get_value([1, 2, 3], 10))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Key not found in dictionary\nIndex out of range", description: "Both handled correctly" },
        ]),
        hints: ["Dict missing key = KeyError", "List bad index = IndexError", "Each needs separate handler"],
        xpReward: 20,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 7.1.4: Multiple Except Clauses");

  // ==================== LESSON 7.1.5: Else and Finally ====================
  const lesson7_1_5 = await prisma.lesson.upsert({
    where: { slug: "else-finally" },
    update: {},
    create: {
      sectionId: section7_1.id,
      number: 7.15,
      title: "Else and Finally Clauses",
      slug: "else-finally",
      objectives: [
        "Use else for code that runs when no exception occurs",
        "Use finally for cleanup code that always runs",
        "Understand the complete try/except/else/finally structure",
        "Apply these clauses appropriately",
      ],
      content: `# Else and Finally Clauses

The complete exception handling structure includes \`else\` and \`finally\`.

## The else Clause

Runs only if NO exception occurred:

\`\`\`python
try:
    result = 10 / 2
except ZeroDivisionError:
    print("Division error")
else:
    print(f"Success! Result: {result}")
\`\`\`

## The finally Clause

ALWAYS runs, exception or not:

\`\`\`python
try:
    file = open("data.txt")
    data = file.read()
except FileNotFoundError:
    print("File not found")
finally:
    print("Cleanup code runs no matter what")
\`\`\`

## Why Use finally?

- Close files
- Release resources
- Clean up connections
- Restore state

## Complete Structure

\`\`\`python
try:
    # Risky code
    result = risky_operation()
except SomeError:
    # Handle error
    print("Error occurred")
else:
    # No error occurred
    print(f"Success: {result}")
finally:
    # Always runs
    print("Cleaning up...")
\`\`\`

## Execution Order

1. try block runs
2. If exception: except block runs
3. If no exception: else block runs
4. finally ALWAYS runs last

## finally vs else

- **else**: "If nothing went wrong, do this"
- **finally**: "Do this no matter what"`,
      codeExamples: JSON.stringify([
        {
          id: "else-clause",
          title: "Using else Clause",
          code: `def divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Cannot divide by zero!")
        return None
    else:
        print(f"Division successful: {a}/{b} = {result}")
        return result

divide(10, 2)
print()
divide(10, 0)`,
          description: "else runs only on success",
        },
        {
          id: "finally-clause",
          title: "Using finally Clause",
          code: `def read_number_from_string(s):
    print(f"Attempting to parse: '{s}'")
    try:
        num = int(s)
        return num
    except ValueError:
        print("  Error: Invalid number")
        return None
    finally:
        print("  Cleanup complete")

print(f"Result: {read_number_from_string('42')}")
print()
print(f"Result: {read_number_from_string('hello')}")`,
          description: "finally always runs",
        },
        {
          id: "complete-structure",
          title: "Complete Try/Except/Else/Finally",
          code: `def process_value(value):
    print(f"Processing: {value}")
    try:
        result = 100 / value
    except ZeroDivisionError:
        print("  except: Division by zero!")
        result = None
    except TypeError:
        print("  except: Invalid type!")
        result = None
    else:
        print(f"  else: Success! Result = {result}")
    finally:
        print("  finally: Done processing")
    return result

process_value(5)
print()
process_value(0)`,
          description: "All clauses working together",
        },
      ]),
      keyPoints: [
        "else: runs only if no exception occurred",
        "finally: always runs (cleanup code)",
        "Order: try → except OR else → finally",
        "Use else for success-only code",
        "Use finally for cleanup (files, connections)",
      ],
      hardwareDemo: "Watch the execution flow through all clauses. See how finally executes regardless of which path (success or exception) was taken.",
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 5,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson7_1_5.id,
        number: 1,
        title: "Add Finally",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add a finally clause that prints 'Operation complete' after the try/except.",
        starterCode: `def safe_divide(a, b):
    try:
        result = a / b
        print(f"Result: {result}")
    except ZeroDivisionError:
        print("Error: Division by zero")
    finally:
        print("Operation complete")

safe_divide(10, 2)
print()
safe_divide(10, 0)`,
        solution: `def safe_divide(a, b):
    try:
        result = a / b
        print(f"Result: {result}")
    except ZeroDivisionError:
        print("Error: Division by zero")
    finally:
        print("Operation complete")

safe_divide(10, 2)
print()
safe_divide(10, 0)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Result: 5.0\nOperation complete\n\nError: Division by zero\nOperation complete", description: "Finally always runs" },
        ]),
        hints: ["finally: block after except", "Runs in both success and error cases", "Print message in finally"],
        xpReward: 20,
        order: 1,
      },
      {
        lessonId: lesson7_1_5.id,
        number: 2,
        title: "Use Else Clause",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add an else clause that prints 'Conversion successful' only when no error occurs.",
        starterCode: `def parse_int(s):
    try:
        num = int(s)
    except ValueError:
        print("Invalid integer")
        return None
    else:
        print("Conversion successful")
        return num

print(parse_int("42"))
print(parse_int("hello"))`,
        solution: `def parse_int(s):
    try:
        num = int(s)
    except ValueError:
        print("Invalid integer")
        return None
    else:
        print("Conversion successful")
        return num

print(parse_int("42"))
print(parse_int("hello"))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Conversion successful\n42\nInvalid integer\nNone", description: "Else only on success" },
        ]),
        hints: ["else: comes after except", "Only runs if no exception", "Return in else block"],
        xpReward: 20,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 7.1.5: Else and Finally");

  // ==================== LESSON 7.2.1: Raising Exceptions ====================
  const lesson7_2_1 = await prisma.lesson.upsert({
    where: { slug: "raising-exceptions" },
    update: {},
    create: {
      sectionId: section7_2.id,
      number: 7.21,
      title: "Raising Exceptions",
      slug: "raising-exceptions",
      objectives: [
        "Raise exceptions with the raise statement",
        "Choose appropriate exception types",
        "Add meaningful error messages",
        "Re-raise exceptions when needed",
      ],
      content: `# Raising Exceptions

You can raise exceptions in your own code to signal errors.

## The raise Statement

\`\`\`python
raise ValueError("Age must be positive")
\`\`\`

## When to Raise

Raise exceptions when:
- Function receives invalid arguments
- Operation cannot be completed
- Unexpected state is detected

## Example: Input Validation

\`\`\`python
def set_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative")
    if age > 150:
        raise ValueError("Age seems unrealistic")
    return age
\`\`\`

## Choosing Exception Types

- \`ValueError\`: Invalid value for the type
- \`TypeError\`: Wrong type provided
- \`RuntimeError\`: General runtime error
- Custom exceptions for domain-specific errors

## Re-raising Exceptions

Sometimes you want to log an error, then let it propagate:

\`\`\`python
try:
    risky_operation()
except ValueError as e:
    print(f"Logging error: {e}")
    raise  # Re-raise the same exception
\`\`\`

## raise vs return

- **raise**: Something went WRONG
- **return None**: Operation completed but no result

\`\`\`python
def find_item(lst, item):
    for i, x in enumerate(lst):
        if x == item:
            return i
    return None  # Not found is normal, not an error

def get_required_item(lst, item):
    for i, x in enumerate(lst):
        if x == item:
            return i
    raise ValueError(f"Required item '{item}' not found")
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-raise",
          title: "Basic raise Statement",
          code: `def calculate_square_root(n):
    if n < 0:
        raise ValueError("Cannot calculate square root of negative number")
    return n ** 0.5

print(calculate_square_root(16))

try:
    print(calculate_square_root(-4))
except ValueError as e:
    print(f"Error: {e}")`,
          description: "Raise exception for invalid input",
        },
        {
          id: "validation",
          title: "Input Validation",
          code: `def create_user(name, age):
    if not isinstance(name, str):
        raise TypeError("Name must be a string")
    if not name.strip():
        raise ValueError("Name cannot be empty")
    if not isinstance(age, int):
        raise TypeError("Age must be an integer")
    if age < 0 or age > 150:
        raise ValueError("Age must be between 0 and 150")
    
    return {"name": name, "age": age}

print(create_user("Alice", 30))

try:
    create_user("", 25)
except ValueError as e:
    print(f"Validation error: {e}")`,
          description: "Validate all inputs",
        },
        {
          id: "reraise",
          title: "Re-raising Exceptions",
          code: `def process_data(data):
    try:
        result = int(data)
        return result * 2
    except ValueError:
        print(f"Warning: Could not process '{data}'")
        raise  # Re-raise for caller to handle

try:
    process_data("hello")
except ValueError as e:
    print(f"Caller caught: {e}")`,
          description: "Log then re-raise",
        },
      ]),
      keyPoints: [
        "raise ExceptionType('message') signals an error",
        "Choose exception type matching the error",
        "Validate inputs at function start",
        "Use raise (bare) to re-raise current exception",
        "raise for errors, return None for 'not found'",
      ],
      hardwareDemo: "Watch the raise statement create an exception object and trigger the stack unwinding process as Python searches for a handler.",
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 6,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson7_2_1.id,
        number: 1,
        title: "Validate Positive",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Complete the function to raise ValueError if the number is not positive.",
        starterCode: `def require_positive(n):
    if n <= 0:
        raise ValueError("Number must be positive")
    return n

try:
    print(require_positive(5))
    print(require_positive(-3))
except ValueError as e:
    print(f"Error: {e}")`,
        solution: `def require_positive(n):
    if n <= 0:
        raise ValueError("Number must be positive")
    return n

try:
    print(require_positive(5))
    print(require_positive(-3))
except ValueError as e:
    print(f"Error: {e}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "5\nError: Number must be positive", description: "Raises for non-positive" },
        ]),
        hints: ["Check if n <= 0", "raise ValueError(...)", "Include descriptive message"],
        xpReward: 20,
        order: 1,
      },
      {
        lessonId: lesson7_2_1.id,
        number: 2,
        title: "Validate Range",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Raise ValueError if percentage is not between 0 and 100 (inclusive).",
        starterCode: `def set_percentage(value):
    if value < 0 or value > 100:
        raise ValueError("Percentage must be between 0 and 100")
    return value

try:
    print(set_percentage(50))
    print(set_percentage(150))
except ValueError as e:
    print(f"Error: {e}")`,
        solution: `def set_percentage(value):
    if value < 0 or value > 100:
        raise ValueError("Percentage must be between 0 and 100")
    return value

try:
    print(set_percentage(50))
    print(set_percentage(150))
except ValueError as e:
    print(f"Error: {e}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "50\nError: Percentage must be between 0 and 100", description: "Validates range" },
        ]),
        hints: ["Check if < 0 or > 100", "raise ValueError", "0 and 100 are valid"],
        xpReward: 20,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 7.2.1: Raising Exceptions");

  // ==================== LESSON 7.2.2: Custom Exceptions ====================
  const lesson7_2_2 = await prisma.lesson.upsert({
    where: { slug: "custom-exceptions" },
    update: {},
    create: {
      sectionId: section7_2.id,
      number: 7.22,
      title: "Custom Exceptions",
      slug: "custom-exceptions",
      objectives: [
        "Create custom exception classes",
        "Inherit from appropriate base classes",
        "Add custom attributes to exceptions",
        "Know when custom exceptions are useful",
      ],
      content: `# Custom Exceptions

You can create your own exception types for domain-specific errors.

## Creating a Custom Exception

\`\`\`python
class InsufficientFundsError(Exception):
    pass
\`\`\`

That's it! Inherit from \`Exception\` and you have a new exception type.

## Using Custom Exceptions

\`\`\`python
class InsufficientFundsError(Exception):
    pass

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError("Not enough money")
    return balance - amount
\`\`\`

## Adding Custom Attributes

\`\`\`python
class InsufficientFundsError(Exception):
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        self.deficit = amount - balance
        message = f"Cannot withdraw {amount}, only {balance} available"
        super().__init__(message)
\`\`\`

## When to Use Custom Exceptions

- Domain-specific errors (InsufficientFundsError, InvalidEmailError)
- Need to attach extra data to the exception
- Want callers to handle your errors specifically
- Building a library or API

## Naming Convention

End exception names with "Error":
- \`ValidationError\`
- \`AuthenticationError\`
- \`NetworkError\`

## Exception Hierarchy for Libraries

\`\`\`python
class MyLibraryError(Exception):
    '''Base for all library exceptions'''
    pass

class ConfigError(MyLibraryError):
    pass

class NetworkError(MyLibraryError):
    pass
\`\`\`

Users can catch \`MyLibraryError\` to handle all library errors.`,
      codeExamples: JSON.stringify([
        {
          id: "simple-custom",
          title: "Simple Custom Exception",
          code: `class NegativeNumberError(Exception):
    pass

def square_root(n):
    if n < 0:
        raise NegativeNumberError(f"Cannot compute sqrt of {n}")
    return n ** 0.5

try:
    print(square_root(16))
    print(square_root(-4))
except NegativeNumberError as e:
    print(f"Caught custom exception: {e}")`,
          description: "Basic custom exception",
        },
        {
          id: "exception-with-data",
          title: "Exception with Custom Data",
          code: `class InsufficientFundsError(Exception):
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        self.shortfall = amount - balance
        super().__init__(f"Need {amount}, have {balance}")

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(balance, amount)
    return balance - amount

try:
    withdraw(100, 150)
except InsufficientFundsError as e:
    print(f"Error: {e}")
    print(f"Short by: {e.shortfall}")`,
          description: "Attach extra information",
        },
        {
          id: "exception-hierarchy",
          title: "Exception Hierarchy",
          code: `class BankError(Exception):
    '''Base class for bank exceptions'''
    pass

class InsufficientFundsError(BankError):
    pass

class AccountLockedError(BankError):
    pass

# Catch all bank errors
try:
    raise AccountLockedError("Account suspended")
except BankError as e:
    print(f"Bank error: {type(e).__name__}: {e}")`,
          description: "Organized exception hierarchy",
        },
      ]),
      keyPoints: [
        "Inherit from Exception to create custom exceptions",
        "Use __init__ to add custom attributes",
        "Name exceptions ending with 'Error'",
        "Create hierarchies for related exceptions",
        "Custom exceptions make code more readable",
      ],
      hardwareDemo: "Watch custom exception objects being created with their custom attributes. See how they propagate up the call stack just like built-in exceptions.",
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 7,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson7_2_2.id,
        number: 1,
        title: "Create Custom Exception",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create an InvalidAgeError exception and use it in the validate_age function.",
        starterCode: `class InvalidAgeError(Exception):
    pass

def validate_age(age):
    if age < 0 or age > 150:
        raise InvalidAgeError(f"Invalid age: {age}")
    return age

try:
    print(validate_age(25))
    print(validate_age(200))
except InvalidAgeError as e:
    print(f"Error: {e}")`,
        solution: `class InvalidAgeError(Exception):
    pass

def validate_age(age):
    if age < 0 or age > 150:
        raise InvalidAgeError(f"Invalid age: {age}")
    return age

try:
    print(validate_age(25))
    print(validate_age(200))
except InvalidAgeError as e:
    print(f"Error: {e}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "25\nError: Invalid age: 200", description: "Custom exception works" },
        ]),
        hints: ["class InvalidAgeError(Exception): pass", "raise InvalidAgeError(...)", "Catch with except InvalidAgeError"],
        xpReward: 25,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 7.2.2: Custom Exceptions");

  // ==================== LESSON 7.3.1: Assertions in Detail ====================
  const lesson7_3_1 = await prisma.lesson.upsert({
    where: { slug: "assertions-detail" },
    update: {},
    create: {
      sectionId: section7_3.id,
      number: 7.31,
      title: "Assertions in Detail",
      slug: "assertions-detail",
      objectives: [
        "Use assertions for debugging",
        "Understand when assertions are disabled",
        "Know the difference between assertions and exceptions",
        "Apply assertions appropriately",
      ],
      content: `# Assertions in Detail

We covered assertions briefly in Chapter 6. Let's dive deeper.

## Assertion Syntax

\`\`\`python
assert condition, "Error message"
\`\`\`

Equivalent to:
\`\`\`python
if not condition:
    raise AssertionError("Error message")
\`\`\`

## Assertions Can Be Disabled!

Running Python with \`-O\` (optimize) disables assertions:

\`\`\`bash
python -O script.py  # Assertions don't run!
\`\`\`

This means: **Never use assertions for data validation!**

## Assertions vs Exceptions

| Use Case | Use |
|----------|-----|
| Checking user input | Exception |
| Validating API arguments | Exception |
| Programming errors (bugs) | Assertion |
| Invariants that should never fail | Assertion |

## Good Uses for Assertions

\`\`\`python
def binary_search(sorted_list, target):
    # This should always be true if caller follows contract
    assert sorted_list == sorted(sorted_list), "List must be sorted"
    # ... rest of function
\`\`\`

## Bad Uses for Assertions

\`\`\`python
# DON'T DO THIS - user input should use exceptions
def set_age(age):
    assert age >= 0, "Age must be positive"  # WRONG!
    
# DO THIS INSTEAD
def set_age(age):
    if age < 0:
        raise ValueError("Age must be positive")  # RIGHT!
\`\`\`

## Assertions for Debugging

\`\`\`python
def process_data(items):
    assert len(items) > 0, "Bug: items should not be empty here"
    
    result = []
    for item in items:
        processed = transform(item)
        assert processed is not None, f"Bug: transform returned None for {item}"
        result.append(processed)
    
    assert len(result) == len(items), "Bug: lost items during processing"
    return result
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "assert-vs-exception",
          title: "Assertion vs Exception",
          code: `# WRONG: using assertion for user input
def bad_set_age(age):
    assert age >= 0, "Age must be non-negative"
    return age

# RIGHT: using exception for user input
def good_set_age(age):
    if age < 0:
        raise ValueError("Age must be non-negative")
    return age

# Assertions are for catching programmer errors
def process_sorted_list(items):
    # This is a programmer error if list isn't sorted
    assert items == sorted(items), "Bug: expected sorted list"
    return items

print(good_set_age(25))`,
          description: "When to use each",
        },
        {
          id: "debug-assertions",
          title: "Debugging with Assertions",
          code: `def calculate_average(numbers):
    # Sanity checks
    assert isinstance(numbers, list), "Bug: expected list"
    assert len(numbers) > 0, "Bug: empty list"
    
    total = sum(numbers)
    count = len(numbers)
    
    # Check intermediate result
    assert count > 0, "Bug: count should be positive"
    
    result = total / count
    
    # Verify output is reasonable
    assert min(numbers) <= result <= max(numbers), "Bug: average out of range"
    
    return result

print(calculate_average([10, 20, 30]))`,
          description: "Assertions catch bugs during development",
        },
        {
          id: "invariant-checking",
          title: "Checking Invariants",
          code: `class BankAccount:
    def __init__(self, initial_balance):
        self.balance = initial_balance
        self._check_invariant()
    
    def _check_invariant(self):
        assert self.balance >= 0, "Bug: balance went negative"
    
    def deposit(self, amount):
        self.balance += amount
        self._check_invariant()
    
    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount
        self._check_invariant()

account = BankAccount(100)
account.deposit(50)
print(f"Balance: {account.balance}")`,
          description: "Invariants that should always be true",
        },
      ]),
      keyPoints: [
        "Assertions can be disabled with -O flag",
        "Use exceptions for user input validation",
        "Use assertions for programming error detection",
        "Assertions are for things that should NEVER happen",
        "Good for checking invariants during development",
      ],
      hardwareDemo: "Watch assertions check conditions during execution. See how AssertionError is raised when a condition fails, with the error message displayed.",
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 8,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson7_3_1.id,
        number: 1,
        title: "Add Debug Assertions",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add assertions to verify the function's assumptions and results.",
        starterCode: `def find_average(numbers):
    # Add assertion: numbers should not be empty
    assert len(numbers) > 0, "Bug: empty list"
    
    total = sum(numbers)
    average = total / len(numbers)
    
    # Add assertion: average should be within range of numbers
    assert min(numbers) <= average <= max(numbers), "Bug: average out of range"
    
    return average

print(find_average([10, 20, 30, 40]))`,
        solution: `def find_average(numbers):
    assert len(numbers) > 0, "Bug: empty list"
    
    total = sum(numbers)
    average = total / len(numbers)
    
    assert min(numbers) <= average <= max(numbers), "Bug: average out of range"
    
    return average

print(find_average([10, 20, 30, 40]))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "25.0", description: "Calculates average correctly" },
        ]),
        hints: ["Check len(numbers) > 0", "Average must be between min and max", "These catch programmer errors"],
        xpReward: 20,
        order: 1,
      },
      {
        lessonId: lesson7_3_1.id,
        number: 2,
        title: "Choose Assert or Raise",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use raise ValueError for user input (amount), assert for internal bug checks.",
        starterCode: `def process_payment(amount, items):
    # User input - use exception
    if amount <= 0:
        raise ValueError("Amount must be positive")
    
    # Internal check - use assertion
    assert len(items) > 0, "Bug: items list should not be empty here"
    
    return f"Processing payment of {amount} for {len(items)} items"

try:
    print(process_payment(100, ["item1", "item2"]))
    print(process_payment(-50, ["item1"]))
except ValueError as e:
    print(f"Error: {e}")`,
        solution: `def process_payment(amount, items):
    if amount <= 0:
        raise ValueError("Amount must be positive")
    
    assert len(items) > 0, "Bug: items list should not be empty here"
    
    return f"Processing payment of {amount} for {len(items)} items"

try:
    print(process_payment(100, ["item1", "item2"]))
    print(process_payment(-50, ["item1"]))
except ValueError as e:
    print(f"Error: {e}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Processing payment of 100 for 2 items\nError: Amount must be positive", description: "Correct error handling" },
        ]),
        hints: ["User provides amount - use raise", "items should never be empty if code is correct - use assert", "Exceptions for user errors, assertions for bugs"],
        xpReward: 25,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 7.3.1: Assertions in Detail");

  // Summary
  const lessonCount = await prisma.lesson.count({ where: { section: { chapter: { number: 7 } } } });
  const exerciseCount = await prisma.exercise.count({ where: { lesson: { section: { chapter: { number: 7 } } } } });

  console.log("\n📊 Chapter 7 Summary:");
  console.log(`   Lessons: ${lessonCount}`);
  console.log(`   Exercises: ${exerciseCount}`);
  console.log("\n🌱 Chapter 7 seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
