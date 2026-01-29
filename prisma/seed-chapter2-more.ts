import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Adding more Chapter 2 lessons...");

  // Get section references
  const section2_1 = await prisma.section.findFirst({ where: { number: 2.1 } });
  const section2_2 = await prisma.section.findFirst({ where: { number: 2.2 } });

  if (!section2_1 || !section2_2) {
    throw new Error("Sections not found. Run seed-chapter2.ts first.");
  }

  // ==================== LESSON 2.1.3: String Methods ====================
  const lesson2_1_3 = await prisma.lesson.upsert({
    where: { slug: "string-methods" },
    update: {},
    create: {
      sectionId: section2_1.id,
      number: 2.13,
      title: "String Methods",
      slug: "string-methods",
      objectives: [
        "Use common string methods to transform text",
        "Search within strings using find() and in",
        "Split and join strings",
        "Understand method chaining",
      ],
      content: `# String Methods

Python strings come with dozens of built-in **methods** - functions that belong to string objects. These methods make text processing powerful and easy!

## What is a Method?

A method is a function that belongs to an object. You call it using dot notation:

\`\`\`python
text = "hello"
result = text.upper()  # Calling the upper() method
print(result)  # "HELLO"
\`\`\`

## Case Conversion Methods

\`\`\`python
text = "Hello World"

print(text.upper())      # "HELLO WORLD"
print(text.lower())      # "hello world"
print(text.title())      # "Hello World"
print(text.capitalize()) # "Hello world"
print(text.swapcase())   # "hELLO wORLD"
\`\`\`

## Search Methods

### find() - Find Position of Substring

\`\`\`python
text = "Hello World"
print(text.find("World"))  # 6 (index where "World" starts)
print(text.find("xyz"))    # -1 (not found)
\`\`\`

### in - Check if Substring Exists

\`\`\`python
text = "Hello World"
print("World" in text)     # True
print("xyz" in text)       # False
\`\`\`

### count() - Count Occurrences

\`\`\`python
text = "banana"
print(text.count("a"))     # 3
print(text.count("na"))    # 2
\`\`\`

## Modification Methods

### replace() - Replace Substrings

\`\`\`python
text = "Hello World"
new_text = text.replace("World", "Python")
print(new_text)  # "Hello Python"
\`\`\`

### strip() - Remove Whitespace

\`\`\`python
text = "   Hello   "
print(text.strip())   # "Hello" (both sides)
print(text.lstrip())  # "Hello   " (left only)
print(text.rstrip())  # "   Hello" (right only)
\`\`\`

## Split and Join

### split() - Break String into List

\`\`\`python
text = "apple,banana,cherry"
fruits = text.split(",")
print(fruits)  # ['apple', 'banana', 'cherry']
\`\`\`

### join() - Combine List into String

\`\`\`python
words = ["Hello", "World"]
sentence = " ".join(words)
print(sentence)  # "Hello World"
\`\`\`

## Method Chaining

You can chain multiple methods together:

\`\`\`python
text = "  HELLO world  "
result = text.strip().lower().title()
print(result)  # "Hello World"
\`\`\`

## Remember: Strings are Immutable!

Methods don't change the original string - they return a NEW string:

\`\`\`python
text = "hello"
text.upper()      # Returns "HELLO" but doesn't change text
print(text)       # Still "hello"

text = text.upper()  # Must reassign to keep the change
print(text)          # Now "HELLO"
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "case-methods",
          title: "Case Conversion",
          code: `text = "heLLo WoRLd"

print(text.upper())
print(text.lower())
print(text.title())
print(text.capitalize())`,
          description: "Change the case of letters in a string",
        },
        {
          id: "search-methods",
          title: "Searching in Strings",
          code: `text = "Python is awesome"

print("is" in text)
print(text.find("is"))
print(text.count("o"))`,
          description: "Find and count substrings",
        },
        {
          id: "replace-strip",
          title: "Replace and Strip",
          code: `text = "  Hello World  "

print(text.strip())
print(text.replace("World", "Python"))`,
          description: "Clean up and modify strings",
        },
        {
          id: "split-join",
          title: "Split and Join",
          code: `# Split a string
csv = "apple,banana,cherry"
fruits = csv.split(",")
print(fruits)

# Join back together
result = " - ".join(fruits)
print(result)`,
          description: "Break apart and combine strings",
        },
      ]),
      keyPoints: [
        "Methods are functions called on objects using dot notation",
        "upper(), lower(), title() change case",
        "find() returns index, 'in' returns True/False",
        "replace() substitutes substrings",
        "split() breaks strings, join() combines them",
        "Strings are immutable - methods return NEW strings",
      ],
      hardwareDemo: "Watch memory allocation when methods create new strings. The original string stays unchanged while new memory is allocated for the result.",
      estimatedTime: 20,
      difficulty: "BEGINNER",
      order: 3,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson2_1_3.id,
        number: 1,
        title: "Shout It Out",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Convert the string \"hello world\" to uppercase and print it.",
        starterCode: `text = "hello world"

# Convert to uppercase
result = 

print(result)`,
        solution: `text = "hello world"
result = text.upper()
print(result)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "HELLO WORLD", description: "Should print uppercase" },
        ]),
        hints: ["Use the upper() method", "Call it with text.upper()", "Don't forget the parentheses!"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson2_1_3.id,
        number: 2,
        title: "Find the Word",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Find the position of \"Python\" in the string \"I love Python programming\" and print it.",
        starterCode: `text = "I love Python programming"

# Find the position of "Python"
position = 

print(position)`,
        solution: `text = "I love Python programming"
position = text.find("Python")
print(position)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "7", description: "Python starts at index 7" },
        ]),
        hints: ["Use the find() method", "text.find(\"Python\") returns the starting index", "Remember: indexing starts at 0"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson2_1_3.id,
        number: 3,
        title: "Replace Words",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Replace \"bad\" with \"good\" in the string \"This is a bad day\" and print the result.",
        starterCode: `text = "This is a bad day"

# Replace "bad" with "good"
new_text = 

print(new_text)`,
        solution: `text = "This is a bad day"
new_text = text.replace("bad", "good")
print(new_text)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "This is a good day", description: "Should replace bad with good" },
        ]),
        hints: ["Use the replace() method", "Format: text.replace(old, new)", "Pass both strings as arguments"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson2_1_3.id,
        number: 4,
        title: "Split and Count",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Split the string \"apple,banana,orange,grape\" by commas, then print how many fruits there are.",
        starterCode: `text = "apple,banana,orange,grape"

# Split by comma
fruits = 

# Print the count
print(len(fruits))`,
        solution: `text = "apple,banana,orange,grape"
fruits = text.split(",")
print(len(fruits))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "4", description: "Should print 4" },
        ]),
        hints: ["Use split(\",\") to break by commas", "split() returns a list", "Use len() to count items in a list"],
        xpReward: 20,
        order: 4,
      },
    ],
  });

  console.log("✅ Created Lesson 2.1.3: String Methods");

  // ==================== LESSON 2.2.1: The print() Function ====================
  const lesson2_2_1 = await prisma.lesson.upsert({
    where: { slug: "print-function" },
    update: {},
    create: {
      sectionId: section2_2.id,
      number: 2.21,
      title: "The print() Function",
      slug: "print-function",
      objectives: [
        "Master the print() function and its parameters",
        "Use sep and end parameters for formatting",
        "Print multiple values in one statement",
        "Create formatted output",
      ],
      content: `# The print() Function

The \`print()\` function is your primary way to display output in Python. While it seems simple, it has powerful features!

## Basic Printing

\`\`\`python
print("Hello, World!")
print(42)
print(3.14)
print(True)
\`\`\`

## Printing Multiple Values

Pass multiple arguments separated by commas:

\`\`\`python
name = "Alice"
age = 25
print("Name:", name, "Age:", age)
# Output: Name: Alice Age: 25
\`\`\`

By default, values are separated by spaces.

## The sep Parameter

Change the separator between values:

\`\`\`python
print("apple", "banana", "cherry")
# Output: apple banana cherry

print("apple", "banana", "cherry", sep=", ")
# Output: apple, banana, cherry

print("apple", "banana", "cherry", sep=" | ")
# Output: apple | banana | cherry

print(2024, 1, 15, sep="-")
# Output: 2024-1-15
\`\`\`

## The end Parameter

By default, print() adds a newline at the end. Change this with \`end\`:

\`\`\`python
print("Hello", end=" ")
print("World!")
# Output: Hello World! (on one line)

print("Loading", end="...")
print("Done!")
# Output: Loading...Done!
\`\`\`

## Printing Without Arguments

An empty print() just creates a blank line:

\`\`\`python
print("Line 1")
print()
print("Line 3")
\`\`\`

## Combining sep and end

\`\`\`python
print("a", "b", "c", sep="-", end="!\\n")
# Output: a-b-c!
\`\`\`

## Printing Special Characters

Use escape sequences for special characters:

\`\`\`python
print("Line 1\\nLine 2")     # \\n = newline
print("Tab\\tSeparated")     # \\t = tab
print("She said \\"Hi\\"")   # \\" = quote
print("Path: C:\\\\Users")   # \\\\ = backslash
\`\`\`

## Hardware Connection

When you print, data flows from your program through the CPU to the output stream. In Hardware Mode, watch the data travel through the system!`,
      codeExamples: JSON.stringify([
        {
          id: "basic-print",
          title: "Basic Printing",
          code: `print("Hello, World!")
print(42)
print(3.14)
print(True)`,
          description: "Print different types of values",
        },
        {
          id: "multiple-values",
          title: "Multiple Values",
          code: `name = "Python"
version = 3.12
print("Language:", name, "Version:", version)`,
          description: "Print multiple values with automatic spacing",
        },
        {
          id: "sep-parameter",
          title: "Custom Separator",
          code: `print("apple", "banana", "cherry", sep=", ")
print(2024, 12, 25, sep="/")
print("*", "*", "*", sep="---")`,
          description: "Change how values are separated",
        },
        {
          id: "end-parameter",
          title: "Custom Ending",
          code: `print("Loading", end="... ")
print("Done!")
print()
print("Hello", end="!")
print()`,
          description: "Control what comes at the end",
        },
      ]),
      keyPoints: [
        "print() displays output to the console",
        "Multiple values are separated by spaces by default",
        "sep parameter changes the separator",
        "end parameter changes the line ending (default is newline)",
        "Use escape sequences for special characters (\\n, \\t, etc.)",
      ],
      hardwareDemo: "Watch data flow from your program through the CPU to the output stream. Each character travels through the system to appear on screen.",
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 4,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson2_2_1.id,
        number: 1,
        title: "Print Your Info",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Print your name and age on the same line, like: \"Alice 25\"",
        starterCode: `name = "Alice"
age = 25

# Print name and age
`,
        solution: `name = "Alice"
age = 25
print(name, age)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Alice 25", description: "Should print name and age" },
        ]),
        hints: ["Pass multiple values to print()", "Values are automatically separated by spaces", "print(name, age) prints both"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson2_2_1.id,
        number: 2,
        title: "Date Format",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Print a date in the format \"2024/12/25\" using the sep parameter with year=2024, month=12, day=25.",
        starterCode: `year = 2024
month = 12
day = 25

# Print as date with / separator
`,
        solution: `year = 2024
month = 12
day = 25
print(year, month, day, sep="/")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "2024/12/25", description: "Should print formatted date" },
        ]),
        hints: ["Use the sep parameter", "sep=\"/\" will put slashes between values", "print(year, month, day, sep=\"/\")"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson2_2_1.id,
        number: 3,
        title: "Same Line Printing",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Print \"Hello \" and \"World!\" using two separate print statements, but they should appear on the same line as \"Hello World!\"",
        starterCode: `# Print Hello and World on the same line
print("Hello", end=" ")
`,
        solution: `print("Hello", end=" ")
print("World!")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Hello World!", description: "Both on same line" },
        ]),
        hints: ["Use end=\" \" on the first print", "This replaces the newline with a space", "The second print continues on that line"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson2_2_1.id,
        number: 4,
        title: "Build a Path",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Print a file path \"C:\\Users\\Alice\\Documents\" using the proper escape sequence for backslashes.",
        starterCode: `# Print the file path with backslashes
`,
        solution: `print("C:\\\\Users\\\\Alice\\\\Documents")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "C:\\Users\\Alice\\Documents", description: "Should show backslashes" },
        ]),
        hints: ["Backslash is a special character", "Use \\\\ to print a single backslash", "Each \\\\ becomes one \\"],
        xpReward: 20,
        order: 4,
      },
    ],
  });

  console.log("✅ Created Lesson 2.2.1: The print() Function");

  // ==================== LESSON 2.2.2: The input() Function ====================
  const lesson2_2_2 = await prisma.lesson.upsert({
    where: { slug: "input-function" },
    update: {},
    create: {
      sectionId: section2_2.id,
      number: 2.22,
      title: "The input() Function",
      slug: "input-function",
      objectives: [
        "Get user input with the input() function",
        "Understand that input() always returns a string",
        "Convert input to numbers with int() and float()",
        "Build interactive programs",
      ],
      content: `# The input() Function

The \`input()\` function lets your program receive data from the user. This makes programs interactive!

## Basic Input

\`\`\`python
name = input("What is your name? ")
print("Hello,", name)
\`\`\`

When this runs:
1. Python displays "What is your name? "
2. Program waits for user to type something
3. User presses Enter
4. Their input is stored in \`name\`

## Input Always Returns a String!

This is crucial to understand:

\`\`\`python
age = input("Enter your age: ")
print(type(age))  # <class 'str'>
\`\`\`

Even if the user types \`25\`, it's stored as the string \`"25"\`, not the number \`25\`!

## Converting Input to Numbers

### For Whole Numbers: int()

\`\`\`python
age_str = input("Enter your age: ")
age = int(age_str)  # Convert string to integer

# Or combine into one line:
age = int(input("Enter your age: "))
\`\`\`

### For Decimal Numbers: float()

\`\`\`python
price = float(input("Enter the price: "))
\`\`\`

## Why This Matters

Without conversion, math won't work as expected:

\`\`\`python
# WRONG - string concatenation!
num = input("Enter a number: ")  # User enters 5
result = num + num  # "55" (string + string)

# RIGHT - numeric addition!
num = int(input("Enter a number: "))  # User enters 5
result = num + num  # 10 (integer + integer)
\`\`\`

## Building Interactive Programs

\`\`\`python
# Simple calculator
num1 = float(input("First number: "))
num2 = float(input("Second number: "))
sum = num1 + num2
print("Sum:", sum)
\`\`\`

## Input Without a Prompt

You can call input() without a message:

\`\`\`python
print("Enter your name:")
name = input()  # Just waits for input
\`\`\`

## Important Notes

1. **input() pauses the program** until user presses Enter
2. **Always returns a string** - convert if you need numbers
3. **The prompt is optional** but usually helpful
4. **No validation** - user could enter anything!

## Note About This Platform

In our browser-based IDE, \`input()\` may not work interactively. For exercises, we'll provide test values or use different approaches.`,
      codeExamples: JSON.stringify([
        {
          id: "basic-input",
          title: "Basic Input",
          code: `# Note: In this platform, we simulate input
name = "Alice"  # Simulated input
print("Hello,", name)

# In a real Python environment:
# name = input("What is your name? ")`,
          description: "Getting text input from user",
        },
        {
          id: "input-type",
          title: "Input is Always String",
          code: `# Simulating user entering "25"
age_str = "25"
print("Type:", type(age_str))
print("Value:", age_str)

# String math (concatenation)
print(age_str + age_str)  # "2525" not 50!`,
          description: "Understanding that input returns strings",
        },
        {
          id: "convert-int",
          title: "Converting to Integer",
          code: `# Simulating user entering "25"
age_str = "25"
age = int(age_str)

print("As string:", age_str, "Type:", type(age_str))
print("As integer:", age, "Type:", type(age))
print("Math works:", age + age)`,
          description: "Convert string input to integer",
        },
        {
          id: "simple-calc",
          title: "Simple Calculator",
          code: `# Simulated input
num1 = float("10.5")
num2 = float("3.5")

print("Number 1:", num1)
print("Number 2:", num2)
print("Sum:", num1 + num2)
print("Product:", num1 * num2)`,
          description: "Using converted numbers for calculations",
        },
      ]),
      keyPoints: [
        "input() pauses the program and waits for user input",
        "input() ALWAYS returns a string, even for numbers",
        "Use int() to convert to whole numbers",
        "Use float() to convert to decimal numbers",
        "Always convert before doing math with user input",
      ],
      hardwareDemo: "Watch how string data flows from input, through type conversion functions, and into memory as a different type.",
      estimatedTime: 18,
      difficulty: "BEGINNER",
      order: 5,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson2_2_2.id,
        number: 1,
        title: "String to Integer",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Convert the string \"42\" to an integer and print it along with its type.",
        starterCode: `text = "42"

# Convert to integer
number = 

print("Value:", number)
print("Type:", type(number))`,
        solution: `text = "42"
number = int(text)
print("Value:", number)
print("Type:", type(number))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Value: 42\nType: <class 'int'>", description: "Should convert and show type" },
        ]),
        hints: ["Use int() to convert", "int(text) converts string to integer", "type() shows the data type"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson2_2_2.id,
        number: 2,
        title: "Add User Numbers",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given two strings representing numbers (\"15\" and \"27\"), convert them to integers and print their sum.",
        starterCode: `num1_str = "15"
num2_str = "27"

# Convert and add
num1 = 
num2 = 
total = 

print(total)`,
        solution: `num1_str = "15"
num2_str = "27"
num1 = int(num1_str)
num2 = int(num2_str)
total = num1 + num2
print(total)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "42", description: "Should print 42" },
        ]),
        hints: ["Convert each string with int()", "Then add the integers", "Without conversion, + would concatenate: \"1527\""],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson2_2_2.id,
        number: 3,
        title: "Calculate Average",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given three test score strings (\"85\", \"90\", \"78\"), convert them to numbers and print their average.",
        starterCode: `score1_str = "85"
score2_str = "90"
score3_str = "78"

# Convert to numbers

# Calculate average
average = 

print(average)`,
        solution: `score1_str = "85"
score2_str = "90"
score3_str = "78"
score1 = float(score1_str)
score2 = float(score2_str)
score3 = float(score3_str)
average = (score1 + score2 + score3) / 3
print(average)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "84.33333333333333", description: "Should print average" },
        ]),
        hints: ["Convert each score with float() or int()", "Average = sum divided by count", "Use parentheses: (a + b + c) / 3"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson2_2_2.id,
        number: 4,
        title: "Price Calculator",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given a price string \"19.99\" and quantity string \"3\", calculate and print the total cost.",
        starterCode: `price_str = "19.99"
quantity_str = "3"

# Convert and calculate
price = 
quantity = 
total = 

print(total)`,
        solution: `price_str = "19.99"
quantity_str = "3"
price = float(price_str)
quantity = int(quantity_str)
total = price * quantity
print(total)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "59.97", description: "Should print 59.97" },
        ]),
        hints: ["Price needs float() for decimals", "Quantity can use int()", "Multiply price by quantity"],
        xpReward: 20,
        order: 4,
      },
    ],
  });

  console.log("✅ Created Lesson 2.2.2: The input() Function");

  // Summary
  const lessonCount = await prisma.lesson.count({ where: { section: { chapter: { number: 2 } } } });
  const exerciseCount = await prisma.exercise.count({ where: { lesson: { section: { chapter: { number: 2 } } } } });

  console.log("\n📊 Chapter 2 Updated:");
  console.log(`   Total Lessons: ${lessonCount}`);
  console.log(`   Total Exercises: ${exerciseCount}`);
  console.log("\n🌱 Additional lessons added!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
