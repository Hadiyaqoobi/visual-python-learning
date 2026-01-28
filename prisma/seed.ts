import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ==================== CHAPTER 1 ====================
  const chapter1 = await prisma.chapter.upsert({
    where: { number: 1 },
    update: {},
    create: {
      number: 1,
      title: "Getting Started",
      description: "Introduction to computation and Python basics. Learn what computation means, how to work with Python objects and expressions, and write your first programs.",
      objectives: [
        "Understand what computation and programming mean",
        "Learn Python's basic data types and operators",
        "Master variables and assignment",
        "Write simple branching programs with conditionals",
      ],
      imageUrl: "/images/chapters/ch1-getting-started.png",
      isPublished: true,
    },
  });

  console.log("✅ Created Chapter 1:", chapter1.title);

  // ==================== SECTION 1.1 ====================
  const section1_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter1.id, number: 1.1 } },
    update: {},
    create: {
      chapterId: chapter1.id,
      number: 1.1,
      title: "The Notion of Computation",
      description: "What is computation and why does it matter?",
      order: 1,
    },
  });

  // Lesson 1.1.1
  await prisma.lesson.upsert({
    where: { slug: "what-is-computation" },
    update: {},
    create: {
      sectionId: section1_1.id,
      number: 1.1,
      title: "What is Computation?",
      slug: "what-is-computation",
      objectives: [
        "Understand what computation means",
        "Distinguish declarative from imperative knowledge",
        "Recognize the role of algorithms in programming",
      ],
      content: `# What is Computation?

Computation is the process of using a computer to perform calculations, process data, and solve problems. But what does that really mean?

## Declarative vs Imperative Knowledge

**Declarative knowledge** is knowledge about facts - statements of truth. For example:
- "The square root of 25 is 5"
- "Water boils at 100°C"

**Imperative knowledge** is knowledge about how to do something - a recipe or procedure. For example:
- "To find a square root, start with a guess and repeatedly improve it"
- "To boil water, heat it until bubbles form"

## Why This Matters

Computers are fundamentally **imperative** machines. They don't "know" facts - they follow instructions. When you write a program, you're writing a set of instructions (an **algorithm**) that tells the computer exactly what steps to take.

## Your First Python Program

Let's start with the classic first program:

\`\`\`python
print("Hello, World!")
\`\`\`

This single line tells the computer to display the text "Hello, World!" on the screen. Simple, but it's computation!`,
      codeExamples: JSON.stringify([
        {
          id: "hello-world",
          title: "Hello World",
          code: 'print("Hello, World!")',
          description: "The classic first program",
        },
        {
          id: "simple-calc",
          title: "Simple Calculation",
          code: "result = 5 + 3\nprint(result)",
          description: "Computation in action - the CPU calculates 5 + 3",
        },
      ]),
      keyPoints: [
        "Computation is following instructions to process data",
        "Declarative knowledge = facts, Imperative knowledge = procedures",
        "Programs are written instructions (algorithms) for computers",
        "Python executes your instructions line by line",
      ],
      hardwareDemo: "Show how print() sends data through the CPU to output. Demonstrate the Fetch-Decode-Execute cycle for a simple calculation.",
      estimatedTime: 10,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });

  // ==================== SECTION 1.2 ====================
  const section1_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter1.id, number: 1.2 } },
    update: {},
    create: {
      chapterId: chapter1.id,
      number: 1.2,
      title: "Python Basics",
      description: "Objects, expressions, variables, and assignment",
      order: 2,
    },
  });

  // Lesson 1.2.1 - Objects and Types
  const lesson1_2_1 = await prisma.lesson.upsert({
    where: { slug: "objects-and-types" },
    update: {},
    create: {
      sectionId: section1_2.id,
      number: 1.21,
      title: "Objects and Types",
      slug: "objects-and-types",
      objectives: [
        "Understand that everything in Python is an object",
        "Learn the basic data types: int, float, str, bool",
        "Use the type() function to check types",
      ],
      content: `# Objects and Types

In Python, **everything is an object**. Numbers, text, even your code - all objects!

## What is an Object?

An object is a piece of data with:
1. A **type** - what kind of data it is
2. A **value** - the actual data

## Python's Basic Types

| Type | Description | Examples |
|------|-------------|----------|
| \`int\` | Whole numbers | \`5\`, \`-17\`, \`0\` |
| \`float\` | Decimal numbers | \`3.14\`, \`-0.5\`, \`2.0\` |
| \`str\` | Text (strings) | \`"Hello"\`, \`'Python'\` |
| \`bool\` | True or False | \`True\`, \`False\` |

## Checking Types

Use the \`type()\` function to see what type something is:

\`\`\`python
type(42)        # <class 'int'>
type(3.14)      # <class 'float'>
type("Hello")   # <class 'str'>
type(True)      # <class 'bool'>
\`\`\`

## Watch in Hardware Mode

When you create an object, watch how:
1. The CPU processes the value
2. Memory is allocated
3. The type is stored alongside the value`,
      codeExamples: JSON.stringify([
        {
          id: "type-examples",
          title: "Checking Types",
          code: 'print(type(42))\nprint(type(3.14))\nprint(type("Hello"))\nprint(type(True))',
          description: "See the type of different values",
        },
        {
          id: "int-examples",
          title: "Integer Examples",
          code: "age = 25\ncount = -5\nzero = 0\nprint(age, count, zero)",
          description: "Integers are whole numbers",
        },
        {
          id: "float-examples",
          title: "Float Examples", 
          code: "price = 19.99\ntemperature = -2.5\nprint(price, temperature)",
          description: "Floats are decimal numbers",
        },
      ]),
      keyPoints: [
        "Everything in Python is an object with a type and value",
        "int = whole numbers, float = decimal numbers",
        "str = text in quotes, bool = True or False",
        "Use type() to check what type something is",
      ],
      hardwareDemo: "Show how different types are stored in memory. Integers vs floats use different memory representations.",
      estimatedTime: 12,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });

  // Add exercises for lesson 1.2.1
  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson1_2_1.id,
        number: 1,
        title: "Identify the Type",
        prompt: "What type is the value `42`? Use the type() function to check.",
        type: "CODE",
        starterCode: "# Check the type of 42\nresult = type(42)\nprint(result)",
        solution: "result = type(42)\nprint(result)",
        hints: ["Use the type() function", "Pass 42 as the argument"],
        testCases: JSON.stringify([
          { input: "", expectedOutput: "<class 'int'>" },
        ]),
        xpReward: 10,
        difficulty: "BEGINNER",
        order: 1,
      },
      {
        lessonId: lesson1_2_1.id,
        number: 2,
        title: "Create Different Types",
        prompt: "Create four variables: an integer, a float, a string, and a boolean. Then print each one.",
        type: "CODE",
        starterCode: "# Create your variables here\nmy_int = \nmy_float = \nmy_str = \nmy_bool = \n\n# Print them\nprint(my_int, my_float, my_str, my_bool)",
        solution: 'my_int = 10\nmy_float = 3.14\nmy_str = "Hello"\nmy_bool = True\nprint(my_int, my_float, my_str, my_bool)',
        hints: [
          "Integers are whole numbers like 10 or -5",
          "Floats have decimal points like 3.14",
          "Strings need quotes around them",
          "Booleans are True or False (capitalized!)",
        ],
        testCases: JSON.stringify([
          { input: "", expectedOutput: "10 3.14 Hello True", isHidden: false },
        ]),
        xpReward: 15,
        difficulty: "BEGINNER",
        order: 2,
      },
      {
        lessonId: lesson1_2_1.id,
        number: 3,
        title: "Predict the Type",
        prompt: "What will `type(3.0)` return? Think carefully - 3.0 looks like a whole number!",
        type: "PREDICT_OUTPUT",
        starterCode: "# What does this print?\nprint(type(3.0))",
        solution: "<class 'float'>",
        hints: ["Look at whether there's a decimal point", "3.0 has a .0 at the end"],
        testCases: JSON.stringify([
          { input: "", expectedOutput: "<class 'float'>" },
        ]),
        xpReward: 10,
        difficulty: "BEGINNER",
        order: 3,
      },
    ],
  });

  // Lesson 1.2.2 - Expressions and Operators
  const lesson1_2_2 = await prisma.lesson.upsert({
    where: { slug: "expressions-and-operators" },
    update: {},
    create: {
      sectionId: section1_2.id,
      number: 1.22,
      title: "Expressions and Operators",
      slug: "expressions-and-operators",
      objectives: [
        "Write arithmetic expressions using operators",
        "Understand operator precedence",
        "Use comparison and logical operators",
      ],
      content: `# Expressions and Operators

An **expression** is code that produces a value. The simplest expressions are just values like \`5\` or \`"hello"\`. More interesting expressions use **operators** to combine values.

## Arithmetic Operators

| Operator | Name | Example | Result |
|----------|------|---------|--------|
| \`+\` | Addition | \`5 + 3\` | \`8\` |
| \`-\` | Subtraction | \`10 - 4\` | \`6\` |
| \`*\` | Multiplication | \`3 * 4\` | \`12\` |
| \`/\` | Division | \`15 / 4\` | \`3.75\` |
| \`//\` | Floor Division | \`15 // 4\` | \`3\` |
| \`%\` | Modulo (remainder) | \`15 % 4\` | \`3\` |
| \`**\` | Exponentiation | \`2 ** 3\` | \`8\` |

## Operator Precedence

Python follows math rules (PEMDAS):
1. Parentheses \`()\`
2. Exponents \`**\`
3. Multiplication/Division \`* / // %\`
4. Addition/Subtraction \`+ -\`

\`\`\`python
result = 2 + 3 * 4    # 14, not 20!
result = (2 + 3) * 4  # 20
\`\`\`

## Watch the ALU Work!

In Hardware Mode, watch the ALU (Arithmetic Logic Unit) perform calculations. Each operation goes through Fetch → Decode → Execute!`,
      codeExamples: JSON.stringify([
        {
          id: "arithmetic",
          title: "Arithmetic Operations",
          code: "print(5 + 3)\nprint(10 - 4)\nprint(3 * 4)\nprint(15 / 4)",
          description: "Basic math operations",
        },
        {
          id: "precedence",
          title: "Operator Precedence",
          code: "# Without parentheses\nprint(2 + 3 * 4)\n\n# With parentheses\nprint((2 + 3) * 4)",
          description: "Multiplication before addition",
        },
        {
          id: "division-types",
          title: "Division Types",
          code: "print(15 / 4)   # Regular division\nprint(15 // 4)  # Floor division\nprint(15 % 4)   # Remainder",
          description: "Different ways to divide",
        },
      ]),
      keyPoints: [
        "Expressions are code that produces a value",
        "Arithmetic operators: + - * / // % **",
        "Follow PEMDAS for operator precedence",
        "Use parentheses to control order of operations",
      ],
      hardwareDemo: "Show ALU performing each arithmetic operation. Highlight how the CPU fetches operands, executes the operation, and stores the result.",
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 3,
      isPublished: true,
    },
  });

  // Add exercises for lesson 1.2.2
  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson1_2_2.id,
        number: 1,
        title: "Calculate the Sum",
        prompt: "Write an expression that calculates 25 + 17 and prints the result.",
        type: "CODE",
        starterCode: "# Calculate and print 25 + 17\n",
        solution: "print(25 + 17)",
        hints: ["Use the + operator", "Use print() to show the result"],
        testCases: JSON.stringify([{ input: "", expectedOutput: "42" }]),
        xpReward: 10,
        difficulty: "BEGINNER",
        order: 1,
      },
      {
        lessonId: lesson1_2_2.id,
        number: 2,
        title: "Operator Precedence",
        prompt: "What does `10 + 5 * 2` equal? Write code to check your prediction.",
        type: "PREDICT_OUTPUT",
        starterCode: "# Predict first, then run!\nprint(10 + 5 * 2)",
        solution: "20",
        hints: ["Remember: multiplication before addition", "5 * 2 = 10, then 10 + 10"],
        testCases: JSON.stringify([{ input: "", expectedOutput: "20" }]),
        xpReward: 10,
        difficulty: "BEGINNER",
        order: 2,
      },
      {
        lessonId: lesson1_2_2.id,
        number: 3,
        title: "Use Parentheses",
        prompt: "Modify the expression so that addition happens BEFORE multiplication: `10 + 5 * 2` should equal 30.",
        type: "CODE",
        starterCode: "# Add parentheses to make this equal 30\nresult = 10 + 5 * 2\nprint(result)",
        solution: "result = (10 + 5) * 2\nprint(result)",
        hints: ["Wrap the addition in parentheses", "(10 + 5) will be calculated first"],
        testCases: JSON.stringify([{ input: "", expectedOutput: "30" }]),
        xpReward: 15,
        difficulty: "BEGINNER",
        order: 3,
      },
      {
        lessonId: lesson1_2_2.id,
        number: 4,
        title: "Floor Division vs Regular",
        prompt: "What's the difference between 17 / 5 and 17 // 5? Print both to find out.",
        type: "CODE",
        starterCode: "# Print regular division\nprint(17 / 5)\n\n# Print floor division\nprint(17 // 5)",
        solution: "print(17 / 5)\nprint(17 // 5)",
        hints: ["/ gives a decimal result", "// rounds down to nearest integer"],
        testCases: JSON.stringify([{ input: "", expectedOutput: "3.4\n3" }]),
        xpReward: 10,
        difficulty: "BEGINNER",
        order: 4,
      },
    ],
  });

  // Lesson 1.2.3 - Variables and Assignment
  const lesson1_2_3 = await prisma.lesson.upsert({
    where: { slug: "variables-and-assignment" },
    update: {},
    create: {
      sectionId: section1_2.id,
      number: 1.23,
      title: "Variables and Assignment",
      slug: "variables-and-assignment",
      objectives: [
        "Create variables using assignment statements",
        "Understand how variables point to values in memory",
        "Update variable values",
      ],
      content: `# Variables and Assignment

A **variable** is a name that refers to a value stored in memory. Think of it as a label attached to a box containing data.

## Creating Variables

Use the **assignment operator** \`=\` to create a variable:

\`\`\`python
age = 25
name = "Alice"
is_student = True
\`\`\`

## How Variables Work in Memory

When you write \`x = 5\`:
1. Python creates an integer object with value 5
2. Allocates memory for it (e.g., address 0x1000)
3. Makes the name \`x\` point to that memory location

**In Hardware Mode**, watch the variable name become a label pointing to a memory address!

## Updating Variables

You can change what a variable points to:

\`\`\`python
x = 5       # x points to 5
x = 10      # now x points to 10
x = x + 1   # x points to 11
\`\`\`

## Variables Don't Copy, They Reference

\`\`\`python
a = 5
b = a       # b points to the same 5 as a
print(a, b) # 5 5
\`\`\`

Watch in Hardware Mode to see both variables pointing to the same memory!`,
      codeExamples: JSON.stringify([
        {
          id: "create-vars",
          title: "Creating Variables",
          code: 'age = 25\nname = "Alice"\nis_student = True\n\nprint(age)\nprint(name)\nprint(is_student)',
          description: "Assign values to variable names",
        },
        {
          id: "update-vars",
          title: "Updating Variables",
          code: "x = 5\nprint(x)\n\nx = 10\nprint(x)\n\nx = x + 1\nprint(x)",
          description: "Variables can be reassigned",
        },
        {
          id: "var-reference",
          title: "Variables Reference Values",
          code: "a = 100\nb = a\nprint(a, b)\n\na = 200\nprint(a, b)  # b still points to 100!",
          description: "Assignment creates references, not copies",
        },
      ]),
      keyPoints: [
        "Variables are names that point to values in memory",
        "Use = to assign a value to a variable",
        "Variables can be reassigned to new values",
        "Assignment creates a reference, not a copy",
      ],
      hardwareDemo: "Show memory allocation when variables are created. Demonstrate how variable names map to memory addresses. Show what happens when variables are updated.",
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 4,
      isPublished: true,
    },
  });

  // Add exercises for lesson 1.2.3
  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson1_2_3.id,
        number: 1,
        title: "Create Your Variables",
        prompt: "Create three variables: `my_age` (your age as an integer), `my_name` (your name as a string), and `is_learning` (set to True). Print all three.",
        type: "CODE",
        starterCode: "# Create your variables\n\n\n# Print them\n",
        solution: 'my_age = 25\nmy_name = "Hadi"\nis_learning = True\nprint(my_age, my_name, is_learning)',
        hints: ["Use = to assign values", "Strings need quotes", "True is capitalized"],
        testCases: JSON.stringify([{ input: "", expectedOutput: "25 Hadi True" }]),
        xpReward: 15,
        difficulty: "BEGINNER",
        order: 1,
      },
      {
        lessonId: lesson1_2_3.id,
        number: 2,
        title: "Update a Variable",
        prompt: "Create a variable `count` with value 1. Then update it to 2, then to 3. Print after each update.",
        type: "CODE",
        starterCode: "# Start with count = 1\n\n# Print, then update and print again\n",
        solution: "count = 1\nprint(count)\ncount = 2\nprint(count)\ncount = 3\nprint(count)",
        hints: ["Create the variable first", "Then reassign it with ="],
        testCases: JSON.stringify([{ input: "", expectedOutput: "1\n2\n3" }]),
        xpReward: 15,
        difficulty: "BEGINNER",
        order: 2,
      },
      {
        lessonId: lesson1_2_3.id,
        number: 3,
        title: "Increment a Variable",
        prompt: "Create a variable `score` starting at 0. Add 10 to it three times. Print the final score.",
        type: "CODE",
        starterCode: "score = 0\n\n# Add 10 three times\n\n\n\nprint(score)",
        solution: "score = 0\nscore = score + 10\nscore = score + 10\nscore = score + 10\nprint(score)",
        hints: ["Use score = score + 10", "Do this three times"],
        testCases: JSON.stringify([{ input: "", expectedOutput: "30" }]),
        xpReward: 15,
        difficulty: "BEGINNER",
        order: 3,
      },
    ],
  });

  // ==================== SECTION 1.3 ====================
  const section1_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter1.id, number: 1.3 } },
    update: {},
    create: {
      chapterId: chapter1.id,
      number: 1.3,
      title: "Branching Programs",
      description: "Conditional statements and control flow",
      order: 3,
    },
  });

  // Lesson 1.3.1 - Conditional Statements
  const lesson1_3_1 = await prisma.lesson.upsert({
    where: { slug: "conditional-statements" },
    update: {},
    create: {
      sectionId: section1_3.id,
      number: 1.31,
      title: "Conditional Statements",
      slug: "conditional-statements",
      objectives: [
        "Write if statements to make decisions",
        "Use comparison operators",
        "Add else and elif branches",
      ],
      content: `# Conditional Statements

So far, our programs run every line from top to bottom. But what if we want to make decisions? That's where **conditional statements** come in.

## The if Statement

\`\`\`python
if condition:
    # code runs if condition is True
\`\`\`

Example:
\`\`\`python
age = 18
if age >= 18:
    print("You can vote!")
\`\`\`

## Comparison Operators

| Operator | Meaning |
|----------|---------|
| \`==\` | Equal to |
| \`!=\` | Not equal to |
| \`<\` | Less than |
| \`>\` | Greater than |
| \`<=\` | Less than or equal |
| \`>=\` | Greater than or equal |

## if-else

\`\`\`python
if condition:
    # runs if True
else:
    # runs if False
\`\`\`

## if-elif-else

\`\`\`python
if condition1:
    # runs if condition1 is True
elif condition2:
    # runs if condition2 is True
else:
    # runs if both are False
\`\`\`

## Indentation Matters!

Python uses indentation (spaces) to group code. Always indent with 4 spaces inside if/else blocks.`,
      codeExamples: JSON.stringify([
        {
          id: "simple-if",
          title: "Simple if Statement",
          code: 'age = 18\nif age >= 18:\n    print("You can vote!")',
          description: "Basic if statement",
        },
        {
          id: "if-else",
          title: "if-else Statement",
          code: 'temperature = 35\nif temperature > 30:\n    print("It\'s hot!")\nelse:\n    print("It\'s not too hot.")',
          description: "Two possible paths",
        },
        {
          id: "if-elif-else",
          title: "if-elif-else Statement",
          code: 'score = 85\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelse:\n    print("Need improvement")',
          description: "Multiple conditions",
        },
      ]),
      keyPoints: [
        "if statements let programs make decisions",
        "Comparison operators: == != < > <= >=",
        "Use else for an alternative path",
        "Use elif for multiple conditions",
        "Indentation (4 spaces) is required!",
      ],
      hardwareDemo: "Show how the CPU evaluates the condition and decides which branch to execute. Watch the Program Counter jump over skipped code.",
      estimatedTime: 20,
      difficulty: "BEGINNER",
      order: 5,
      isPublished: true,
    },
  });

  // Add exercises for lesson 1.3.1
  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson1_3_1.id,
        number: 1,
        title: "Check if Positive",
        prompt: 'Write code that prints "Positive" if the number is greater than 0.',
        type: "CODE",
        starterCode: 'number = 5\n\n# Write your if statement\n',
        solution: 'number = 5\nif number > 0:\n    print("Positive")',
        hints: ["Use if number > 0:", "Don't forget to indent the print!"],
        testCases: JSON.stringify([{ input: "", expectedOutput: "Positive" }]),
        xpReward: 10,
        difficulty: "BEGINNER",
        order: 1,
      },
      {
        lessonId: lesson1_3_1.id,
        number: 2,
        title: "Positive or Negative",
        prompt: 'Write code that prints "Positive" if number > 0, otherwise prints "Not positive".',
        type: "CODE",
        starterCode: 'number = -3\n\n# Write your if-else statement\n',
        solution: 'number = -3\nif number > 0:\n    print("Positive")\nelse:\n    print("Not positive")',
        hints: ["Use if and else", "Each branch needs its own print"],
        testCases: JSON.stringify([{ input: "", expectedOutput: "Not positive" }]),
        xpReward: 15,
        difficulty: "BEGINNER",
        order: 2,
      },
      {
        lessonId: lesson1_3_1.id,
        number: 3,
        title: "Grade Calculator",
        prompt: "Write code that prints the letter grade: A (>=90), B (>=80), C (>=70), F (below 70).",
        type: "CODE",
        starterCode: 'score = 75\n\n# Write your if-elif-else statement\n',
        solution: 'score = 75\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelse:\n    print("F")',
        hints: ["Start with the highest grade", "Use elif for each grade", "else handles F"],
        testCases: JSON.stringify([{ input: "", expectedOutput: "C" }]),
        xpReward: 20,
        difficulty: "BEGINNER",
        order: 3,
      },
    ],
  });

  // ==================== ACHIEVEMENTS ====================
  await prisma.achievement.createMany({
    skipDuplicates: true,
    data: [
      {
        code: "first_lesson",
        title: "First Steps",
        description: "Complete your first lesson",
        iconUrl: "🎯",
        xpReward: 50,
        category: "PROGRESS",
      },
      {
        code: "first_exercise",
        title: "Problem Solver",
        description: "Complete your first exercise",
        iconUrl: "✅",
        xpReward: 25,
        category: "PROGRESS",
      },
      {
        code: "chapter_1_complete",
        title: "Chapter 1 Master",
        description: "Complete all lessons in Chapter 1",
        iconUrl: "🏆",
        xpReward: 200,
        category: "PROGRESS",
      },
      {
        code: "perfect_exercise",
        title: "Perfect Score",
        description: "Get an exercise right on the first try",
        iconUrl: "⭐",
        xpReward: 30,
        category: "MASTERY",
      },
      {
        code: "streak_3",
        title: "On a Roll",
        description: "Maintain a 3-day learning streak",
        iconUrl: "🔥",
        xpReward: 75,
        category: "STREAK",
      },
      {
        code: "streak_7",
        title: "Week Warrior",
        description: "Maintain a 7-day learning streak",
        iconUrl: "💪",
        xpReward: 150,
        category: "STREAK",
      },
      {
        code: "hardware_explorer",
        title: "Hardware Explorer",
        description: "Use Hardware Mode for the first time",
        iconUrl: "🖥️",
        xpReward: 25,
        category: "EXPLORATION",
      },
    ],
  });

  console.log("✅ Created achievements");

  // Count what we created
  const chapterCount = await prisma.chapter.count();
  const sectionCount = await prisma.section.count();
  const lessonCount = await prisma.lesson.count();
  const exerciseCount = await prisma.exercise.count();
  const achievementCount = await prisma.achievement.count();

  console.log("\n📊 Seed Summary:");
  console.log(`   Chapters: ${chapterCount}`);
  console.log(`   Sections: ${sectionCount}`);
  console.log(`   Lessons: ${lessonCount}`);
  console.log(`   Exercises: ${exerciseCount}`);
  console.log(`   Achievements: ${achievementCount}`);
  console.log("\n🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
