import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 4 Part 1: Structure + Lessons 4.1.1-4.1.2...\n");

  // Find or create Chapter 4
  let chapter4 = await prisma.chapter.findFirst({ where: { number: 4 } });
  
  if (!chapter4) {
    chapter4 = await prisma.chapter.create({
      data: {
        number: 4,
        title: "Functions, Scoping, and Abstraction",
        description: "Master functions to write modular, reusable code. Learn parameters, return values, scope, and recursion - the foundation of software engineering.",
        objectives: [
          "Define and call functions",
          "Use parameters and return values",
          "Understand variable scope",
          "Write function specifications",
          "Implement recursive solutions",
        ],
        isPublished: true,
      },
    });
  }
  console.log(`✅ Chapter ${chapter4.number}: ${chapter4.title}`);

  // Create Sections
  const section4_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter4.id, number: 4.1 } },
    update: {},
    create: {
      chapterId: chapter4.id,
      number: 4.1,
      title: "Function Definitions",
      description: "Creating and calling functions.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section4_1.number}: ${section4_1.title}`);

  const section4_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter4.id, number: 4.2 } },
    update: {},
    create: {
      chapterId: chapter4.id,
      number: 4.2,
      title: "Parameters and Arguments",
      description: "Passing data to functions.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section4_2.number}: ${section4_2.title}`);

  const section4_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter4.id, number: 4.3 } },
    update: {},
    create: {
      chapterId: chapter4.id,
      number: 4.3,
      title: "Scoping",
      description: "Variable visibility and lifetime.",
      order: 3,
    },
  });
  console.log(`  📂 Section ${section4_3.number}: ${section4_3.title}`);

  const section4_4 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter4.id, number: 4.4 } },
    update: {},
    create: {
      chapterId: chapter4.id,
      number: 4.4,
      title: "Specifications and Docstrings",
      description: "Documenting function behavior.",
      order: 4,
    },
  });
  console.log(`  📂 Section ${section4_4.number}: ${section4_4.title}`);

  const section4_5 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter4.id, number: 4.5 } },
    update: {},
    create: {
      chapterId: chapter4.id,
      number: 4.5,
      title: "Recursion",
      description: "Functions that call themselves.",
      order: 5,
    },
  });
  console.log(`  📂 Section ${section4_5.number}: ${section4_5.title}`);

  // ==================== LESSON 4.1.1 ====================
  const lesson4_1_1 = await prisma.lesson.upsert({
    where: { slug: "function-basics" },
    update: {},
    create: {
      sectionId: section4_1.id,
      number: 4.11,
      title: "Function Basics - Defining and Calling",
      slug: "function-basics",
      objectives: [
        "Define functions using def keyword",
        "Call functions to execute their code",
        "Understand function structure",
        "Write simple functions without parameters",
      ],
      content: `# Function Basics

## What Are Functions?

Functions are **named blocks of reusable code**.

Think of a function like a recipe:
- Has a name ("make_coffee")
- Has steps (the code inside)
- Can use the recipe multiple times
- Same steps produce same result

## Why Functions?

- **Reusability**: Write once, use many times
- **Organization**: Group related code together
- **Abstraction**: Hide complexity behind a name
- **Testing**: Test each function independently
- **Maintenance**: Change code in one place

## Two Parts: Definition and Call

**Definition** - Creating the function:
\`\`\`python
def greet():
    print("Hello!")
\`\`\`

**Call** - Using the function:
\`\`\`python
greet()  # Executes the function
\`\`\`

You must define a function BEFORE calling it!

## Function Definition Syntax

\`\`\`python
def function_name():
    # Function body (indented)
    # Code that runs when called
\`\`\`

**Parts:**
- \`def\` keyword: Starts definition
- \`function_name\`: Descriptive name (lowercase_with_underscores)
- \`()\`: Parentheses (will hold parameters later)
- \`:\`: Colon (required!)
- Indented body: Code that executes

## Naming Conventions

- Use lowercase letters
- Separate words with underscores
- Make names descriptive: \`calculate_tax\`, \`print_report\`
- Use verb + noun: \`get_input\`, \`find_maximum\`

## What Happens When You Call a Function

1. Program jumps to function definition
2. Executes the function body
3. Returns to where it was called
4. Continues with next line`,
      codeExamples: JSON.stringify([
        {
          id: "simple-function",
          title: "Simple Function",
          code: "def say_hello():\n    \"\"\"Print a greeting message.\"\"\"\n    print(\"Hello!\")\n    print(\"Welcome to Python!\")\n\n# Call the function\nsay_hello()\n\n# Can call multiple times\nprint(\"\\nCalling again:\")\nsay_hello()",
          description: "Basic function definition and calls",
        },
        {
          id: "organization",
          title: "Functions for Organization",
          code: "def print_header():\n    \"\"\"Print program header.\"\"\"\n    print(\"=\" * 40)\n    print(\"    Python Calculator\")\n    print(\"=\" * 40)\n\ndef print_menu():\n    \"\"\"Print menu options.\"\"\"\n    print(\"\\nOptions:\")\n    print(\"1. Add\")\n    print(\"2. Subtract\")\n    print(\"3. Quit\")\n\ndef print_footer():\n    \"\"\"Print goodbye message.\"\"\"\n    print(\"\\nThank you!\")\n    print(\"=\" * 40)\n\n# Use functions to structure program\nprint_header()\nprint_menu()\nprint_footer()",
          description: "Organizing code with functions",
        },
        {
          id: "local-computation",
          title: "Function with Local Computation",
          code: "def count_to_five():\n    \"\"\"Count from 1 to 5.\"\"\"\n    for i in range(1, 6):\n        print(i, end=\" \")\n    print()  # Newline\n\ndef print_squares():\n    \"\"\"Print squares of 1 to 5.\"\"\"\n    for n in range(1, 6):\n        square = n ** 2\n        print(f\"{n} squared = {square}\")\n\nprint(\"Counting:\")\ncount_to_five()\n\nprint(\"\\nSquares:\")\nprint_squares()",
          description: "Functions with internal logic",
        },
        {
          id: "functions-calling-functions",
          title: "Functions Calling Functions",
          code: "def print_line():\n    \"\"\"Print a separator line.\"\"\"\n    print(\"-\" * 30)\n\ndef print_boxed_message():\n    \"\"\"Print message in a box.\"\"\"\n    print_line()\n    print(\"  Welcome to Python!\")\n    print_line()\n\ndef show_program_info():\n    \"\"\"Display program information.\"\"\"\n    print_boxed_message()\n    print(\"Version: 1.0\")\n    print(\"Author: Student\")\n    print_line()\n\n# One call runs everything\nshow_program_info()",
          description: "Functions calling other functions",
        },
      ]),
      keyPoints: [
        "Functions are reusable code blocks",
        "Definition: def function_name():",
        "Call: function_name()",
        "Define BEFORE calling",
        "Use descriptive names (verb + noun)",
        "Indentation defines the function body",
        "Can call same function multiple times",
        "Functions can call other functions",
      ],
      hardwareDemo: "Watch stack frame created when function called. See program counter jump to function code.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson4_1_1.number}: ${lesson4_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_1_1.id,
        number: 1,
        title: "First Function",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Define a function called print_hello() that prints 'Hello, World!'. Then call it.",
        starterCode: "# Define print_hello function\n\n\n# Call the function\n",
        solution: "def print_hello():\n    print(\"Hello, World!\")\n\nprint_hello()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Hello, World!", description: "Prints greeting" }]),
        hints: ["Start with def print_hello():", "Indent the print statement", "Call with print_hello()"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson4_1_1.id,
        number: 2,
        title: "Multiple Calls",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a function print_stars() that prints a line of 10 asterisks. Call it 3 times.",
        starterCode: "# Define function\n\n\n# Call it 3 times\n",
        solution: "def print_stars():\n    print(\"*\" * 10)\n\nprint_stars()\nprint_stars()\nprint_stars()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Three lines of stars", description: "Prints 3 lines" }]),
        hints: ["Use \"*\" * 10 to create stars", "Call the function three separate times"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson4_1_1.id,
        number: 3,
        title: "Countdown Function",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function countdown() that counts from 5 to 1 and then prints 'Blastoff!'",
        starterCode: "# Define countdown function\n\n\n# Call it\n",
        solution: "def countdown():\n    for i in range(5, 0, -1):\n        print(i)\n    print(\"Blastoff!\")\n\ncountdown()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "5\\n4\\n3\\n2\\n1\\nBlastoff!", description: "Countdown complete" }]),
        hints: ["Use range(5, 0, -1) to count down", "Print 'Blastoff!' after the loop"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson4_1_1.id,
        number: 4,
        title: "Functions Calling Functions",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create print_separator() that prints 30 dashes. Then create print_title() that calls print_separator(), prints 'MY PROGRAM', then calls print_separator() again.",
        starterCode: "# Define print_separator\n\n\n# Define print_title (uses print_separator)\n\n\n# Call print_title\n",
        solution: "def print_separator():\n    print(\"-\" * 30)\n\ndef print_title():\n    print_separator()\n    print(\"MY PROGRAM\")\n    print_separator()\n\nprint_title()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Bordered title", description: "Title with separators" }]),
        hints: ["Define print_separator first", "Call print_separator() inside print_title()"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson4_1_1.id,
        number: 5,
        title: "Multiplication Table Function",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a function print_sevens_table() that prints the 7 times table from 7x1 to 7x10.",
        starterCode: "# Define function for 7's multiplication table\n\n\n# Call it\n",
        solution: "def print_sevens_table():\n    print(\"7 Times Table\")\n    print(\"-\" * 15)\n    for i in range(1, 11):\n        print(f\"7 x {i} = {7 * i}\")\n\nprint_sevens_table()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "7x1=7 through 7x10=70", description: "Complete table" }]),
        hints: ["Loop from 1 to 10", "Calculate 7 * i each iteration", "Use f-string for formatting"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 4.1.1`);

  // ==================== LESSON 4.1.2 ====================
  const lesson4_1_2 = await prisma.lesson.upsert({
    where: { slug: "parameters-and-arguments" },
    update: {},
    create: {
      sectionId: section4_1.id,
      number: 4.12,
      title: "Parameters and Arguments",
      slug: "parameters-and-arguments",
      objectives: [
        "Define functions with parameters",
        "Pass arguments when calling functions",
        "Understand the difference between parameters and arguments",
        "Use multiple parameters",
      ],
      content: `# Parameters and Arguments

## Making Functions Flexible

So far, our functions do the exact same thing every time. But what if we want:
- \`greet("Alice")\` → "Hello, Alice!"
- \`greet("Bob")\` → "Hello, Bob!"

**Parameters** let functions accept input data!

## Parameters vs Arguments

- **Parameter**: Variable in function definition (placeholder)
- **Argument**: Actual value passed when calling

\`\`\`python
def greet(name):      # 'name' is a PARAMETER
    print(f"Hello, {name}!")

greet("Alice")        # "Alice" is an ARGUMENT
\`\`\`

## Defining Functions with Parameters

\`\`\`python
def function_name(parameter1, parameter2):
    # Use parameters in the body
\`\`\`

Parameters are like variables that get their values when the function is called.

## How It Works

\`\`\`python
def square(n):
    result = n ** 2
    print(f"{n} squared is {result}")

square(5)  # n becomes 5 → prints "5 squared is 25"
square(3)  # n becomes 3 → prints "3 squared is 9"
\`\`\`

Each call:
1. Argument value is assigned to parameter
2. Function body executes with that value
3. Function ends, parameter disappears

## Multiple Parameters

\`\`\`python
def add(a, b):
    print(f"{a} + {b} = {a + b}")

add(3, 5)    # a=3, b=5 → "3 + 5 = 8"
add(10, 20)  # a=10, b=20 → "10 + 20 = 30"
\`\`\`

Arguments are assigned to parameters **in order** (positional).

## Parameters Are Local

Parameters only exist inside the function:

\`\`\`python
def greet(name):
    print(f"Hello, {name}")

greet("Alice")
print(name)  # Error! 'name' doesn't exist here
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "single-parameter",
          title: "Single Parameter",
          code: "def greet(name):\n    \"\"\"Greet a person by name.\"\"\"\n    print(f\"Hello, {name}!\")\n    print(f\"Nice to meet you, {name}.\")\n\n# Call with different arguments\ngreet(\"Alice\")\nprint()\ngreet(\"Bob\")\nprint()\ngreet(\"Charlie\")",
          description: "Function with one parameter",
        },
        {
          id: "multiple-parameters",
          title: "Multiple Parameters",
          code: "def introduce(name, age, city):\n    \"\"\"Introduce a person.\"\"\"\n    print(f\"This is {name}.\")\n    print(f\"They are {age} years old.\")\n    print(f\"They live in {city}.\")\n\n# Arguments match parameters in order\nintroduce(\"Alice\", 25, \"Boston\")\nprint()\nintroduce(\"Bob\", 30, \"New York\")",
          description: "Function with multiple parameters",
        },
        {
          id: "calculations",
          title: "Parameters for Calculations",
          code: "def calculate_area(width, height):\n    \"\"\"Calculate and print rectangle area.\"\"\"\n    area = width * height\n    print(f\"Rectangle {width} x {height}\")\n    print(f\"Area: {area} square units\")\n\ncalculate_area(5, 3)\nprint()\ncalculate_area(10, 7)\nprint()\ncalculate_area(4, 4)  # Square!",
          description: "Using parameters in calculations",
        },
        {
          id: "flexible-function",
          title: "Flexible Separator Function",
          code: "def print_separator(char, length):\n    \"\"\"Print a separator line.\"\"\"\n    print(char * length)\n\ndef print_boxed(message, border_char, width):\n    \"\"\"Print message in a box.\"\"\"\n    print_separator(border_char, width)\n    # Center the message\n    padding = (width - len(message)) // 2\n    print(border_char + \" \" * (padding-1) + message + \" \" * (padding-1) + border_char)\n    print_separator(border_char, width)\n\nprint_boxed(\"Welcome!\", \"*\", 20)\nprint()\nprint_boxed(\"Python\", \"#\", 30)",
          description: "Parameters make functions flexible",
        },
      ]),
      keyPoints: [
        "Parameters are placeholders in function definition",
        "Arguments are actual values passed when calling",
        "Arguments assigned to parameters in order",
        "Multiple parameters separated by commas",
        "Parameters only exist inside the function",
        "Same function, different arguments = different results",
        "Number of arguments must match parameters",
      ],
      hardwareDemo: "Watch argument values copied to parameter variables in stack frame.",
      estimatedTime: 30,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson4_1_2.number}: ${lesson4_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_1_2.id,
        number: 1,
        title: "Personalized Greeting",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a function greet(name) that prints 'Hello, [name]!'. Call it with 'Alice' and 'Bob'.",
        starterCode: "# Define greet function with name parameter\n\n\n# Call with 'Alice' and 'Bob'\n",
        solution: "def greet(name):\n    print(f\"Hello, {name}!\")\n\ngreet(\"Alice\")\ngreet(\"Bob\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Hello, Alice!\\nHello, Bob!", description: "Two greetings" }]),
        hints: ["Parameter goes in parentheses: def greet(name):", "Use f-string with {name}"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson4_1_2.id,
        number: 2,
        title: "Square a Number",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a function print_square(n) that prints '[n] squared is [n*n]'. Test with 5 and 12.",
        starterCode: "# Define print_square function\n\n\n# Test with 5 and 12\n",
        solution: "def print_square(n):\n    print(f\"{n} squared is {n * n}\")\n\nprint_square(5)\nprint_square(12)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "5 squared is 25\\n12 squared is 144", description: "Two squares" }]),
        hints: ["Calculate n * n or n ** 2", "Use f-string to format output"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson4_1_2.id,
        number: 3,
        title: "Two Parameters",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create add_numbers(a, b) that prints '[a] + [b] = [sum]'. Test with (3, 5) and (10, 20).",
        starterCode: "# Define add_numbers with two parameters\n\n\n# Test calls\n",
        solution: "def add_numbers(a, b):\n    print(f\"{a} + {b} = {a + b}\")\n\nadd_numbers(3, 5)\nadd_numbers(10, 20)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "3 + 5 = 8\\n10 + 20 = 30", description: "Two additions" }]),
        hints: ["Two parameters: def add_numbers(a, b):", "Calculate a + b inside function"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson4_1_2.id,
        number: 4,
        title: "Custom Separator",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create print_line(char, count) that prints the character repeated count times. Test with ('=', 20) and ('*', 10).",
        starterCode: "# Define print_line with char and count\n\n\n# Test calls\n",
        solution: "def print_line(char, count):\n    print(char * count)\n\nprint_line(\"=\", 20)\nprint_line(\"*\", 10)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "====================\\n**********", description: "Two lines" }]),
        hints: ["Use char * count", "Arguments in order: char first, count second"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson4_1_2.id,
        number: 5,
        title: "Person Introduction",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create introduce(name, age, job) that prints a 3-line introduction. Test with your own examples.",
        starterCode: "# Define introduce with 3 parameters\n\n\n# Test with sample data\n",
        solution: "def introduce(name, age, job):\n    print(f\"Name: {name}\")\n    print(f\"Age: {age}\")\n    print(f\"Occupation: {job}\")\n    print()  # Blank line between people\n\nintroduce(\"Alice\", 28, \"Engineer\")\nintroduce(\"Bob\", 35, \"Teacher\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Formatted introductions", description: "Multi-line output" }]),
        hints: ["Three parameters separated by commas", "Print each piece of info on its own line"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 4.1.2`);

  console.log("\n✅ Chapter 4 Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
