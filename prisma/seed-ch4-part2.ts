import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 4 Part 2: Lessons 4.1.3-4.2.1...\n");

  const section4_1 = await prisma.section.findFirst({ where: { number: 4.1 } });
  const section4_2 = await prisma.section.findFirst({ where: { number: 4.2 } });
  if (!section4_1 || !section4_2) throw new Error("Sections not found.");

  // ==================== LESSON 4.1.3 ====================
  const lesson4_1_3 = await prisma.lesson.upsert({
    where: { slug: "return-values" },
    update: {},
    create: {
      sectionId: section4_1.id,
      number: 4.13,
      title: "Return Values",
      slug: "return-values",
      objectives: [
        "Use return to send values back from functions",
        "Capture return values in variables",
        "Understand None as default return",
        "Write functions that compute and return results",
      ],
      content: `# Return Values

## From Printing to Returning

So far, our functions **print** results. But often we want to **use** the result:

\`\`\`python
# Printing - can't use the result
def add_print(a, b):
    print(a + b)

add_print(3, 5)  # Prints 8, but we can't save it!

# Returning - can use the result
def add_return(a, b):
    return a + b

result = add_return(3, 5)  # result = 8
print(result * 2)          # Can use it! Prints 16
\`\`\`

## The return Statement

\`return\` sends a value back to the caller:

\`\`\`python
def square(n):
    return n ** 2

x = square(5)  # x = 25
\`\`\`

**What happens:**
1. Function computes n ** 2 (25)
2. \`return\` sends 25 back
3. 25 replaces the function call
4. x = 25

## return Ends the Function

Code after \`return\` doesn't execute:

\`\`\`python
def example():
    return 42
    print("This never runs!")  # Unreachable!
\`\`\`

## Functions Without return

Functions without \`return\` (or with bare \`return\`) return \`None\`:

\`\`\`python
def greet(name):
    print(f"Hello, {name}")

result = greet("Alice")  # Prints greeting
print(result)            # None
\`\`\`

## Using Return Values

Return values can be:
- Stored in variables
- Used in expressions
- Passed to other functions
- Used in conditions

\`\`\`python
def double(n):
    return n * 2

x = double(5)           # Store: x = 10
print(double(3) + 1)    # Expression: 7
double(double(2))       # Nested: double(4) = 8
if double(3) > 5:       # Condition
    print("Yes!")
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-return",
          title: "Basic Return",
          code: "def square(n):\n    \"\"\"Return the square of n.\"\"\"\n    return n ** 2\n\ndef cube(n):\n    \"\"\"Return the cube of n.\"\"\"\n    return n ** 3\n\n# Capture return values\nx = square(5)\ny = cube(3)\n\nprint(f\"5 squared = {x}\")\nprint(f\"3 cubed = {y}\")\n\n# Use directly in expressions\nprint(f\"4 squared + 2 cubed = {square(4) + cube(2)}\")",
          description: "Returning computed values",
        },
        {
          id: "return-vs-print",
          title: "Return vs Print",
          code: "# Print version - can't reuse result\ndef add_print(a, b):\n    print(a + b)\n\n# Return version - result is usable\ndef add_return(a, b):\n    return a + b\n\nprint(\"Print version:\")\nadd_print(3, 5)  # Prints 8\n# result = add_print(3, 5) * 2  # Error! None * 2\n\nprint(\"\\nReturn version:\")\nresult = add_return(3, 5)\nprint(f\"Result: {result}\")\nprint(f\"Result * 2: {result * 2}\")\nprint(f\"Direct use: {add_return(10, 20) + 5}\")",
          description: "Why return is more useful than print",
        },
        {
          id: "multiple-uses",
          title: "Using Return Values",
          code: "def calculate_tax(amount, rate):\n    \"\"\"Calculate tax on amount.\"\"\"\n    return amount * rate\n\ndef calculate_total(subtotal, tax_rate):\n    \"\"\"Calculate total with tax.\"\"\"\n    tax = calculate_tax(subtotal, tax_rate)\n    return subtotal + tax\n\n# Use in calculations\nsubtotal = 100\ntax_rate = 0.08\n\ntax = calculate_tax(subtotal, tax_rate)\ntotal = calculate_total(subtotal, tax_rate)\n\nprint(f\"Subtotal: ${subtotal}\")\nprint(f\"Tax: ${tax}\")\nprint(f\"Total: ${total}\")",
          description: "Functions returning values for calculations",
        },
        {
          id: "return-early",
          title: "Early Return",
          code: "def absolute_value(n):\n    \"\"\"Return absolute value of n.\"\"\"\n    if n < 0:\n        return -n  # Exit early for negative\n    return n       # Positive or zero\n\ndef letter_grade(score):\n    \"\"\"Convert score to letter grade.\"\"\"\n    if score >= 90:\n        return 'A'\n    if score >= 80:\n        return 'B'\n    if score >= 70:\n        return 'C'\n    if score >= 60:\n        return 'D'\n    return 'F'\n\nprint(f\"abs(-5) = {absolute_value(-5)}\")\nprint(f\"abs(5) = {absolute_value(5)}\")\nprint(f\"\\nGrade for 85: {letter_grade(85)}\")\nprint(f\"Grade for 72: {letter_grade(72)}\")",
          description: "Using return for early exit",
        },
      ]),
      keyPoints: [
        "return sends a value back to the caller",
        "Without return, function returns None",
        "return immediately exits the function",
        "Return values can be stored, used in expressions, passed to functions",
        "Print shows output; return gives usable data",
        "Functions that return values are more flexible",
        "Can return any type: numbers, strings, lists, etc.",
      ],
      hardwareDemo: "Watch return value travel back through stack. See it replace the function call.",
      estimatedTime: 30,
      difficulty: "BEGINNER",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson4_1_3.number}: ${lesson4_1_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_1_3.id,
        number: 1,
        title: "Return Double",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a function double(n) that returns n * 2. Test by printing double(5) and double(12).",
        starterCode: "# Define double function\n\n\n# Test it\n",
        solution: "def double(n):\n    return n * 2\n\nprint(double(5))\nprint(double(12))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "10\\n24", description: "Doubled values" }]),
        hints: ["Use return n * 2", "Call function inside print()"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson4_1_3.id,
        number: 2,
        title: "Calculate Area",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create rectangle_area(width, height) that returns the area. Store result and print it.",
        starterCode: "# Define rectangle_area\n\n\n# Calculate and print area of 5 x 3 rectangle\n",
        solution: "def rectangle_area(width, height):\n    return width * height\n\narea = rectangle_area(5, 3)\nprint(f\"Area: {area}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Area: 15", description: "Correct area" }]),
        hints: ["Return width * height", "Store result in variable"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson4_1_3.id,
        number: 3,
        title: "Using Return in Expression",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create add(a, b) and multiply(a, b) that return results. Calculate add(3, 4) * multiply(2, 5).",
        starterCode: "# Define both functions\n\n\n# Calculate add(3, 4) * multiply(2, 5)\n",
        solution: "def add(a, b):\n    return a + b\n\ndef multiply(a, b):\n    return a * b\n\nresult = add(3, 4) * multiply(2, 5)\nprint(f\"Result: {result}\")  # 7 * 10 = 70",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Result: 70", description: "(3+4) * (2*5) = 70" }]),
        hints: ["Both functions need return", "Use results directly in expression"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson4_1_3.id,
        number: 4,
        title: "Is Even",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create is_even(n) that returns True if n is even, False otherwise. Test with 4 and 7.",
        starterCode: "# Define is_even\n\n\n# Test with 4 and 7\n",
        solution: "def is_even(n):\n    return n % 2 == 0\n\nprint(f\"4 is even: {is_even(4)}\")\nprint(f\"7 is even: {is_even(7)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "4 is even: True\\n7 is even: False", description: "Correct booleans" }]),
        hints: ["n % 2 == 0 is True for even numbers", "Return the boolean directly"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson4_1_3.id,
        number: 5,
        title: "Celsius to Fahrenheit",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create celsius_to_fahrenheit(c) that returns the Fahrenheit value. Formula: F = C * 9/5 + 32. Test with 0, 100, and 25.",
        starterCode: "# Define conversion function\n\n\n# Test with 0, 100, and 25\n",
        solution: "def celsius_to_fahrenheit(c):\n    return c * 9/5 + 32\n\nprint(f\"0°C = {celsius_to_fahrenheit(0)}°F\")\nprint(f\"100°C = {celsius_to_fahrenheit(100)}°F\")\nprint(f\"25°C = {celsius_to_fahrenheit(25)}°F\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "32, 212, 77", description: "Correct conversions" }]),
        hints: ["Formula: c * 9/5 + 32", "Return the calculated value"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 4.1.3`);

  // ==================== LESSON 4.2.1 ====================
  const lesson4_2_1 = await prisma.lesson.upsert({
    where: { slug: "keyword-arguments-defaults" },
    update: {},
    create: {
      sectionId: section4_2.id,
      number: 4.21,
      title: "Keyword Arguments and Default Values",
      slug: "keyword-arguments-defaults",
      objectives: [
        "Use keyword arguments for clarity",
        "Define parameters with default values",
        "Mix positional and keyword arguments",
        "Understand the rules for default parameters",
      ],
      content: `# Keyword Arguments and Default Values

## Positional vs Keyword Arguments

**Positional**: Arguments matched by position
\`\`\`python
def greet(name, greeting):
    print(f"{greeting}, {name}!")

greet("Alice", "Hello")  # name="Alice", greeting="Hello"
\`\`\`

**Keyword**: Arguments specified by name
\`\`\`python
greet(name="Alice", greeting="Hello")  # Same result
greet(greeting="Hi", name="Bob")       # Order doesn't matter!
\`\`\`

## Why Keyword Arguments?

1. **Clarity**: Makes code self-documenting
2. **Flexibility**: Can specify in any order
3. **Skip defaults**: Only provide what you need

## Default Parameter Values

Parameters can have default values:

\`\`\`python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Alice")           # Uses default: "Hello, Alice!"
greet("Bob", "Hi")       # Overrides: "Hi, Bob!"
greet("Carol", greeting="Hey")  # Keyword: "Hey, Carol!"
\`\`\`

## Rules for Defaults

**Required parameters must come before defaults:**
\`\`\`python
# ✓ Correct
def func(required, optional="default"):
    pass

# ✗ Wrong - SyntaxError!
def func(optional="default", required):
    pass
\`\`\`

## Mixing Positional and Keyword

\`\`\`python
def describe(name, age, city="Unknown"):
    print(f"{name}, {age}, from {city}")

describe("Alice", 25)              # Positional + default
describe("Bob", 30, "NYC")         # All positional
describe("Carol", age=28)          # Mixed
describe(name="Dan", age=35, city="LA")  # All keyword
\`\`\`

**Rule**: Positional arguments must come before keyword arguments in calls.`,
      codeExamples: JSON.stringify([
        {
          id: "keyword-clarity",
          title: "Keyword Arguments for Clarity",
          code: "def create_user(name, age, email, active):\n    print(f\"Creating user: {name}\")\n    print(f\"  Age: {age}\")\n    print(f\"  Email: {email}\")\n    print(f\"  Active: {active}\")\n\n# Positional - what does True mean?\ncreate_user(\"Alice\", 25, \"alice@email.com\", True)\n\nprint()\n\n# Keyword - much clearer!\ncreate_user(\n    name=\"Bob\",\n    age=30,\n    email=\"bob@email.com\",\n    active=False\n)",
          description: "Keywords make code clearer",
        },
        {
          id: "default-values",
          title: "Default Parameter Values",
          code: "def greet(name, greeting=\"Hello\", punctuation=\"!\"):\n    print(f\"{greeting}, {name}{punctuation}\")\n\n# Use all defaults\ngreet(\"Alice\")  # Hello, Alice!\n\n# Override greeting\ngreet(\"Bob\", \"Hi\")  # Hi, Bob!\n\n# Override punctuation with keyword\ngreet(\"Carol\", punctuation=\"?\")  # Hello, Carol?\n\n# Override both\ngreet(\"Dan\", \"Hey\", \"...\")  # Hey, Dan...",
          description: "Parameters with default values",
        },
        {
          id: "practical-defaults",
          title: "Practical Use of Defaults",
          code: "def print_separator(char=\"-\", length=40):\n    print(char * length)\n\ndef format_price(amount, currency=\"$\", decimals=2):\n    return f\"{currency}{amount:.{decimals}f}\"\n\n# Using defaults\nprint_separator()          # ----------------------------------------\nprint_separator(\"=\")       # ========================================\nprint_separator(\"*\", 20)   # ********************\n\nprint()\nprint(format_price(19.99))           # $19.99\nprint(format_price(100, \"€\"))        # €100.00\nprint(format_price(50, decimals=0))  # $50",
          description: "Defaults make functions flexible",
        },
        {
          id: "mixing-args",
          title: "Mixing Positional and Keyword",
          code: "def order_item(item, quantity, size=\"medium\", extra=None):\n    print(f\"Order: {quantity}x {size} {item}\")\n    if extra:\n        print(f\"  Extra: {extra}\")\n\n# All positional\norder_item(\"coffee\", 2, \"large\", \"sugar\")\n\n# Positional + defaults\norder_item(\"tea\", 1)\n\n# Positional + keyword\norder_item(\"latte\", 1, extra=\"vanilla\")\n\n# Mixed (positional must come first)\norder_item(\"mocha\", 3, size=\"small\")",
          description: "Combining argument styles",
        },
      ]),
      keyPoints: [
        "Positional arguments: matched by position",
        "Keyword arguments: specified by name",
        "Keywords can be in any order",
        "Default values: parameter=default",
        "Required parameters before defaults",
        "Positional args before keyword args in calls",
        "Defaults make functions more flexible",
        "Keywords improve code readability",
      ],
      hardwareDemo: "Watch arguments bind to parameters. See defaults used when argument not provided.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson4_2_1.number}: ${lesson4_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_2_1.id,
        number: 1,
        title: "Keyword Arguments",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Call the greet function using keyword arguments in different orders.",
        starterCode: "def greet(name, message):\n    print(f\"{message}, {name}!\")\n\n# Call with keywords (name first)\n\n# Call with keywords (message first)\n",
        solution: "def greet(name, message):\n    print(f\"{message}, {name}!\")\n\ngreet(name=\"Alice\", message=\"Hello\")\ngreet(message=\"Hi\", name=\"Bob\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Hello, Alice!\\nHi, Bob!", description: "Both work" }]),
        hints: ["Use parameter=value syntax", "Order doesn't matter with keywords"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson4_2_1.id,
        number: 2,
        title: "Default Greeting",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create greet(name, greeting='Hello') with a default. Call with just name, then with both.",
        starterCode: "# Define greet with default greeting\n\n\n# Call with just name\n\n# Call with both arguments\n",
        solution: "def greet(name, greeting=\"Hello\"):\n    print(f\"{greeting}, {name}!\")\n\ngreet(\"Alice\")  # Uses default\ngreet(\"Bob\", \"Hi\")  # Override default",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Hello, Alice!\\nHi, Bob!", description: "Default and override" }]),
        hints: ["Default: greeting=\"Hello\"", "Can override by passing second argument"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson4_2_1.id,
        number: 3,
        title: "Power Function",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create power(base, exponent=2) that returns base raised to exponent. Default should square.",
        starterCode: "# Define power with default exponent=2\n\n\n# Test: power(5) should be 25\n# Test: power(2, 10) should be 1024\n",
        solution: "def power(base, exponent=2):\n    return base ** exponent\n\nprint(power(5))      # 25 (5 squared)\nprint(power(2, 10))  # 1024 (2^10)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "25\\n1024", description: "Default and custom exponent" }]),
        hints: ["Default exponent=2 means squaring", "Return base ** exponent"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson4_2_1.id,
        number: 4,
        title: "Format Price",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create format_price(amount, symbol='$', decimals=2) that returns formatted price string.",
        starterCode: "# Define format_price with defaults\n\n\n# Test: format_price(19.99) -> '$19.99'\n# Test: format_price(100, '€') -> '€100.00'\n# Test: format_price(50, decimals=0) -> '$50'\n",
        solution: "def format_price(amount, symbol=\"$\", decimals=2):\n    return f\"{symbol}{amount:.{decimals}f}\"\n\nprint(format_price(19.99))\nprint(format_price(100, \"€\"))\nprint(format_price(50, decimals=0))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "$19.99\\n€100.00\\n$50", description: "Various formats" }]),
        hints: ["f-string with :.{decimals}f", "Can skip middle argument with keyword"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson4_2_1.id,
        number: 5,
        title: "Create User Profile",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create make_profile(name, age, city='Unknown', active=True) that returns a formatted string.",
        starterCode: "# Define make_profile\n\n\n# Test with various argument combinations\n",
        solution: "def make_profile(name, age, city=\"Unknown\", active=True):\n    status = \"Active\" if active else \"Inactive\"\n    return f\"{name}, {age}, {city} - {status}\"\n\nprint(make_profile(\"Alice\", 25))\nprint(make_profile(\"Bob\", 30, \"NYC\"))\nprint(make_profile(\"Carol\", 28, active=False))\nprint(make_profile(name=\"Dan\", age=35, city=\"LA\", active=True))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Various profiles", description: "Flexible function" }]),
        hints: ["Required params first, then defaults", "Use ternary for status string"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 4.2.1`);

  console.log("\n✅ Chapter 4 Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
