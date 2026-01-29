import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 2 Part 4: Lessons 2.2.1-2.2.3...\n");

  const section2_2 = await prisma.section.findFirst({ where: { number: 2.2 } });
  if (!section2_2) throw new Error("Section 2.2 not found.");

  // ==================== LESSON 2.2.1 ====================
  const lesson2_2_1 = await prisma.lesson.upsert({
    where: { slug: "output-with-print" },
    update: {},
    create: {
      sectionId: section2_2.id,
      number: 2.21,
      title: "Output with print()",
      slug: "output-with-print",
      objectives: [
        "Use print() to display output",
        "Print multiple values with separators",
        "Control line endings with end parameter",
        "Format output for readability",
      ],
      content: `# Output with print()

## The print() Function

\`print()\` displays output to the screen (console/terminal).

\`\`\`python
print("Hello, World!")  # Hello, World!
print(42)               # 42
print(3.14)             # 3.14
\`\`\`

## Printing Multiple Values

Separate values with commas - print() adds spaces automatically:

\`\`\`python
name = "Alice"
age = 25
print("Name:", name, "Age:", age)
# Output: Name: Alice Age: 25
\`\`\`

## The sep Parameter

Control what goes BETWEEN values:

\`\`\`python
print("a", "b", "c")              # a b c (default: space)
print("a", "b", "c", sep="-")     # a-b-c
print("a", "b", "c", sep="")      # abc (no separator)
\`\`\`

## The end Parameter

Control what goes AT THE END:

\`\`\`python
print("Hello")     # Ends with newline (default)
print("World")     # On new line

print("Hello", end=" ")  # Ends with space instead
print("World")           # Same line: Hello World
\`\`\`

## Empty print()

\`print()\` with no arguments prints a blank line.`,
      codeExamples: JSON.stringify([
        {
          id: "print-basics",
          title: "Basic print() Usage",
          code: "# Print different types\nprint(\"Hello, World!\")      # String\nprint(42)                   # Integer\nprint(3.14159)              # Float\nprint(True)                 # Boolean\n\n# Print variables\nname = \"Alice\"\nage = 25\n\nprint(name)\nprint(age)\n\n# Print multiple values\nprint(\"Name:\", name)\nprint(\"Age:\", age, \"years old\")",
          description: "Printing values and variables",
        },
        {
          id: "sep-parameter",
          title: "Using sep Parameter",
          code: "# Default separator is space\nprint(\"a\", \"b\", \"c\")  # a b c\n\n# Custom separators\nprint(\"a\", \"b\", \"c\", sep=\"-\")     # a-b-c\nprint(\"a\", \"b\", \"c\", sep=\" | \")   # a | b | c\nprint(\"a\", \"b\", \"c\", sep=\"\")      # abc\n\n# Practical: Create CSV line\nname, age, city = \"Alice\", 25, \"Boston\"\nprint(name, age, city, sep=\",\")  # Alice,25,Boston\n\n# Practical: Format date\nprint(\"2024\", \"01\", \"15\", sep=\"-\")  # 2024-01-15",
          description: "Controlling separator between values",
        },
        {
          id: "end-parameter",
          title: "Using end Parameter",
          code: "# Default end is newline\nprint(\"Hello\")\nprint(\"World\")\n# Output:\n# Hello\n# World\n\n# Custom end - same line\nprint(\"Hello\", end=\" \")\nprint(\"World\")\n# Output: Hello World\n\n# Building output piece by piece\nprint(\"Progress: \", end=\"\")\nfor i in range(5):\n    print(\"#\", end=\"\")\nprint(\" Complete!\")\n# Output: Progress: ##### Complete!",
          description: "Controlling line endings",
        },
        {
          id: "formatted-output",
          title: "Formatted Output Examples",
          code: "# Simple table with tabs\nprint(\"Name\\tAge\\tCity\")\nprint(\"-\" * 24)\nprint(\"Alice\\t25\\tBoston\")\nprint(\"Bob\\t30\\tNew York\")\n\n# Box drawing\nwidth = 30\nprint(\"+\" + \"-\" * width + \"+\")\nprint(\"|\" + \"Welcome!\".center(width) + \"|\")\nprint(\"+\" + \"-\" * width + \"+\")",
          description: "Creating formatted output",
        },
      ]),
      keyPoints: [
        "print() displays output to the screen",
        "Multiple values separated by commas",
        "Default separator is space",
        "sep parameter: change what goes between values",
        "end parameter: change what goes at end (default: newline)",
        "print() with no arguments prints blank line",
        "flush=True forces immediate output",
      ],
      hardwareDemo: "Watch print() send characters to output buffer.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson2_2_1.number}: ${lesson2_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson2_2_1.id,
        number: 1,
        title: "Print Multiple Values",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given variables name = 'Alice', age = 25, and city = 'Boston', print them all on one line with labels.",
        starterCode: "name = 'Alice'\nage = 25\ncity = 'Boston'\n\n# Print: Name: Alice Age: 25 City: Boston\n",
        solution: "name = 'Alice'\nage = 25\ncity = 'Boston'\n\nprint(\"Name:\", name, \"Age:\", age, \"City:\", city)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Name: Alice Age: 25 City: Boston", description: "All on one line" }]),
        hints: ["Use commas between values", "print() adds spaces automatically"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson2_2_1.id,
        number: 2,
        title: "Custom Separator",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Print the words 'apple', 'banana', 'cherry' separated by ' | ' (space-pipe-space).",
        starterCode: "# Print: apple | banana | cherry\n",
        solution: "print(\"apple\", \"banana\", \"cherry\", sep=\" | \")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "apple | banana | cherry", description: "Pipe separated" }]),
        hints: ["Use the sep parameter", "sep=' | ' sets the separator"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson2_2_1.id,
        number: 3,
        title: "Same Line Output",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use multiple print statements but output everything on ONE line: 'Hello World!'",
        starterCode: "# Use two print statements but output on one line\n",
        solution: "print(\"Hello\", end=\" \")\nprint(\"World!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Hello World!", description: "Single line output" }]),
        hints: ["Use end parameter on first print", "end=' ' ends with space instead of newline"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson2_2_1.id,
        number: 4,
        title: "Create CSV Line",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given data, print it as a CSV (comma-separated) line: Alice,25,Boston",
        starterCode: "name = 'Alice'\nage = 25\ncity = 'Boston'\n\n# Print as CSV: Alice,25,Boston\n",
        solution: "name = 'Alice'\nage = 25\ncity = 'Boston'\n\nprint(name, age, city, sep=\",\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Alice,25,Boston", description: "CSV format" }]),
        hints: ["Use sep parameter", "sep=',' makes comma-separated"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson2_2_1.id,
        number: 5,
        title: "Print a Simple Table",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Print a table with headers and data using tabs for alignment.",
        starterCode: "# Print table with tab-separated columns\n",
        solution: "print(\"Name\", \"Age\", \"City\", sep=\"\\t\")\nprint(\"----\", \"---\", \"----\", sep=\"\\t\")\nprint(\"Alice\", \"25\", \"Boston\", sep=\"\\t\")\nprint(\"Bob\", \"30\", \"NYC\", sep=\"\\t\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Table with headers and data", description: "Formatted table" }]),
        hints: ["Use \\t for tabs", "sep='\\t' between columns"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 2.2.1`);

  // ==================== LESSON 2.2.2 ====================
  const lesson2_2_2 = await prisma.lesson.upsert({
    where: { slug: "input-function" },
    update: {},
    create: {
      sectionId: section2_2.id,
      number: 2.22,
      title: "Getting Input from Users",
      slug: "input-function",
      objectives: [
        "Use input() to get user input",
        "Understand that input() always returns a string",
        "Convert input to numbers with int() and float()",
        "Handle input errors gracefully",
      ],
      content: `# Getting Input from Users

## The input() Function

\`input()\` pauses the program and waits for the user to type something:

\`\`\`python
name = input("Enter your name: ")
print("Hello,", name)
\`\`\`

The text inside \`input()\` is the **prompt** - shown to the user.

## Input ALWAYS Returns a String

This is crucial to remember:

\`\`\`python
age = input("Enter your age: ")  # User types: 25
print(type(age))  # <class 'str'> - It's "25" not 25!
\`\`\`

## Converting Input to Numbers

Use \`int()\` or \`float()\` to convert:

\`\`\`python
age = int(input("Enter your age: "))
price = float(input("Enter price: "))
\`\`\`

## Common Patterns

\`\`\`python
# Get and clean input
name = input("Name: ").strip()

# Get with default
color = input("Color (Enter for blue): ") or "blue"
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-input",
          title: "Basic Input",
          code: "# Simple string input\nname = input(\"Enter your name: \")\nprint(\"Hello, \" + name + \"!\")\n\n# Input always returns a string\nage_str = input(\"Enter your age: \")\nprint(\"You entered:\", age_str)\nprint(\"Type:\", type(age_str))  # <class 'str'>",
          description: "Getting text input from users",
        },
        {
          id: "converting-input",
          title: "Converting Input to Numbers",
          code: "# Convert to integer\nage = int(input(\"Enter your age: \"))\nprint(\"Next year you'll be\", age + 1)\n\n# Convert to float for decimals\nprice = float(input(\"Enter price: $\"))\ntax = price * 0.08\ntotal = price + tax\nprint(\"Total with tax: $\" + str(round(total, 2)))",
          description: "Converting input to numeric types",
        },
        {
          id: "input-patterns",
          title: "Common Input Patterns",
          code: "# Clean whitespace from input\nname = input(\"Enter name: \").strip()\nprint(\"Clean name: '\" + name + \"'\")\n\n# Convert to lowercase for comparison\nanswer = input(\"Continue? (yes/no): \").strip().lower()\nif answer == \"yes\":\n    print(\"Continuing...\")\n\n# Provide default value\ncolor = input(\"Favorite color (Enter for blue): \").strip() or \"blue\"\nprint(\"Color:\", color)",
          description: "Useful input patterns",
        },
        {
          id: "interactive-program",
          title: "Simple Interactive Program",
          code: "# Simple calculator\nprint(\"=== Simple Calculator ===\")\n\nnum1 = float(input(\"Enter first number: \"))\nnum2 = float(input(\"Enter second number: \"))\n\nprint(\"Operations: +, -, *, /\")\nop = input(\"Enter operation: \").strip()\n\nif op == \"+\":\n    result = num1 + num2\nelif op == \"-\":\n    result = num1 - num2\nelif op == \"*\":\n    result = num1 * num2\nelif op == \"/\":\n    result = num1 / num2 if num2 != 0 else \"Error\"\nelse:\n    result = \"Unknown operation\"\n\nprint(\"Result:\", result)",
          description: "Building an interactive program",
        },
      ]),
      keyPoints: [
        "input(prompt) displays prompt and waits for user",
        "input() ALWAYS returns a string",
        "Convert to int: int(input(...))",
        "Convert to float: float(input(...))",
        "Invalid conversion raises ValueError",
        "Clean input with .strip()",
        "Use 'or' for default values",
      ],
      hardwareDemo: "Watch program pause waiting for keyboard input.",
      estimatedTime: 30,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson2_2_2.number}: ${lesson2_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson2_2_2.id,
        number: 1,
        title: "Greeting Program",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Ask the user for their name and print a personalized greeting.",
        starterCode: "# Ask for name and greet\n",
        solution: "name = input(\"Enter your name: \")\nprint(\"Hello, \" + name + \"! Nice to meet you.\")",
        testCases: JSON.stringify([{ input: "Alice", expectedOutput: "Hello, Alice! Nice to meet you.", description: "Personalized greeting" }]),
        hints: ["Use input() to get the name", "Use concatenation to build greeting"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson2_2_2.id,
        number: 2,
        title: "Age Next Year",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Ask the user for their age, then tell them how old they'll be next year.",
        starterCode: "# Get age and calculate next year\n",
        solution: "age = int(input(\"Enter your age: \"))\nprint(\"Next year you'll be\", age + 1)",
        testCases: JSON.stringify([{ input: "25", expectedOutput: "Next year you'll be 26", description: "Age calculation" }]),
        hints: ["input() returns a string", "Use int() to convert"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson2_2_2.id,
        number: 3,
        title: "Rectangle Area",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Ask for the width and height of a rectangle, then calculate and display the area.",
        starterCode: "# Get width and height, calculate area\n",
        solution: "width = float(input(\"Enter width: \"))\nheight = float(input(\"Enter height: \"))\narea = width * height\nprint(\"Area:\", area)",
        testCases: JSON.stringify([{ input: "5\\n3", expectedOutput: "Area: 15.0", description: "Rectangle area" }]),
        hints: ["Use float() for decimal support", "Area = width * height"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson2_2_2.id,
        number: 4,
        title: "Temperature Converter",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Ask for a temperature in Celsius and convert it to Fahrenheit. Formula: F = C * 9/5 + 32",
        starterCode: "# Celsius to Fahrenheit converter\n",
        solution: "celsius = float(input(\"Enter temperature in Celsius: \"))\nfahrenheit = celsius * 9/5 + 32\nprint(str(celsius) + \" C = \" + str(fahrenheit) + \" F\")",
        testCases: JSON.stringify([{ input: "0", expectedOutput: "0.0 C = 32.0 F", description: "Freezing point" }]),
        hints: ["Use float() for temperature", "Formula: F = C * 9/5 + 32"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson2_2_2.id,
        number: 5,
        title: "Tip Calculator",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a tip calculator: ask for bill amount and tip percentage, then show tip amount and total.",
        starterCode: "# Tip calculator\nprint(\"=== Tip Calculator ===\")\n",
        solution: "print(\"=== Tip Calculator ===\")\nbill = float(input(\"Enter bill amount: $\"))\ntip_percent = float(input(\"Enter tip percentage: \"))\n\ntip_amount = bill * (tip_percent / 100)\ntotal = bill + tip_amount\n\nprint(\"Tip amount: $\" + str(round(tip_amount, 2)))\nprint(\"Total: $\" + str(round(total, 2)))",
        testCases: JSON.stringify([{ input: "50\\n20", expectedOutput: "Tip: $10.0\\nTotal: $60.0", description: "20% tip" }]),
        hints: ["Tip = bill * (percent / 100)", "Use round() for currency"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 2.2.2`);

  // ==================== LESSON 2.2.3 ====================
  const lesson2_2_3 = await prisma.lesson.upsert({
    where: { slug: "string-formatting-fstrings" },
    update: {},
    create: {
      sectionId: section2_2.id,
      number: 2.23,
      title: "String Formatting with f-strings",
      slug: "string-formatting-fstrings",
      objectives: [
        "Use f-strings for clean string formatting",
        "Embed expressions inside f-strings",
        "Format numbers with precision and alignment",
        "Compare f-strings with other formatting methods",
      ],
      content: `# String Formatting with f-strings

## What Are f-strings?

F-strings (formatted string literals) are the modern way to format strings in Python.

\`\`\`python
name = "Alice"
age = 25
print(f"Hello, {name}! You are {age} years old.")
\`\`\`

## Number Formatting

### Decimal Places
\`\`\`python
pi = 3.14159265
f"{pi:.2f}"   # "3.14" - 2 decimal places
\`\`\`

### Thousands Separator
\`\`\`python
big = 1234567
f"{big:,}"    # "1,234,567"
\`\`\`

### Percentages
\`\`\`python
ratio = 0.75
f"{ratio:.1%}"  # "75.0%"
\`\`\`

## Width and Alignment

\`\`\`python
name = "Bob"
f"{name:10}"    # "Bob       " - 10 chars, left-aligned
f"{name:>10}"   # "       Bob" - right-aligned
f"{name:^10}"   # "   Bob    " - centered
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "fstring-basics",
          title: "f-string Basics",
          code: "# Basic variable insertion\nname = \"Alice\"\nage = 25\n\n# Old way (concatenation)\nmessage1 = \"Hello, \" + name + \"! You are \" + str(age) + \".\"\nprint(message1)\n\n# New way (f-string) - much cleaner!\nmessage2 = f\"Hello, {name}! You are {age}.\"\nprint(message2)\n\n# Expressions inside braces\nx = 10\ny = 5\nprint(f\"{x} + {y} = {x + y}\")\nprint(f\"{x} * {y} = {x * y}\")",
          description: "Basic f-string usage",
        },
        {
          id: "number-formatting",
          title: "Formatting Numbers",
          code: "# Decimal places\npi = 3.14159265\nprint(f\"Pi: {pi}\")        # 3.14159265\nprint(f\"Pi: {pi:.2f}\")    # 3.14\nprint(f\"Pi: {pi:.4f}\")    # 3.1416\n\n# Thousands separator\npopulation = 8336817\nprint(f\"Population: {population}\")      # 8336817\nprint(f\"Population: {population:,}\")    # 8,336,817\n\n# Currency\nprice = 1234.5\nprint(f\"Price: ${price:,.2f}\")  # $1,234.50\n\n# Percentages\nratio = 0.756\nprint(f\"Complete: {ratio:.1%}\")  # 75.6%",
          description: "Formatting numeric values",
        },
        {
          id: "alignment-width",
          title: "Width and Alignment",
          code: "# Width specification\nname = \"Bob\"\nprint(f\"|{name}|\")       # |Bob|\nprint(f\"|{name:10}|\")    # |Bob       | (10 wide, left)\nprint(f\"|{name:>10}|\")   # |       Bob| (right-aligned)\nprint(f\"|{name:^10}|\")   # |   Bob    | (centered)\n\n# Fill character\nprint(f\"|{name:*<10}|\")  # |Bob*******| (fill with *)\nprint(f\"|{name:*>10}|\")  # |*******Bob|\nprint(f\"|{name:*^10}|\")  # |***Bob****|\n\n# Numbers with width\nnum = 42\nprint(f\"|{num:5}|\")      # |   42| (right by default)\nprint(f\"|{num:05}|\")     # |00042| (zero-padded)",
          description: "Controlling width and alignment",
        },
        {
          id: "practical-formatting",
          title: "Practical Formatting Examples",
          code: "# Receipt\nprint(\"=\" * 30)\nprint(f\"{'RECEIPT':^30}\")\nprint(\"=\" * 30)\n\nitems = [\n    (\"Coffee\", 4.50),\n    (\"Sandwich\", 8.99),\n    (\"Cookie\", 2.25),\n]\n\nfor item, price in items:\n    print(f\"{item:<15} ${price:>6.2f}\")\n\nsubtotal = sum(price for _, price in items)\ntax = subtotal * 0.08\ntotal = subtotal + tax\n\nprint(\"-\" * 30)\nprint(f\"{'Subtotal:':<15} ${subtotal:>6.2f}\")\nprint(f\"{'Tax (8%):':<15} ${tax:>6.2f}\")\nprint(f\"{'TOTAL:':<15} ${total:>6.2f}\")",
          description: "Real-world formatting examples",
        },
      ]),
      keyPoints: [
        "f-strings use f before the quote: f\"text\"",
        "Anything in {} is evaluated as Python",
        "Decimal places: {value:.2f}",
        "Thousands: {value:,}",
        "Percentage: {value:.1%}",
        "Width: {value:10}",
        "Alignment: < (left), > (right), ^ (center)",
        "Fill: {value:*^10}",
      ],
      hardwareDemo: "Watch f-string evaluate expressions and format output.",
      estimatedTime: 35,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson2_2_3.number}: ${lesson2_2_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson2_2_3.id,
        number: 1,
        title: "Basic f-string",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Use an f-string to print: 'My name is Alice and I am 25 years old.'",
        starterCode: "name = \"Alice\"\nage = 25\n\n# Use f-string to create the message\nmessage = \n\nprint(message)",
        solution: "name = \"Alice\"\nage = 25\n\nmessage = f\"My name is {name} and I am {age} years old.\"\n\nprint(message)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "My name is Alice and I am 25 years old.", description: "f-string output" }]),
        hints: ["Start with f before the quote", "Use {variable} to insert values"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson2_2_3.id,
        number: 2,
        title: "Format Currency",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Format the price as currency with 2 decimal places and thousands separator: $1,234.50",
        starterCode: "price = 1234.5\n\n# Format as $1,234.50\nformatted = \n\nprint(formatted)",
        solution: "price = 1234.5\n\nformatted = f\"${price:,.2f}\"\n\nprint(formatted)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "$1,234.50", description: "Currency format" }]),
        hints: [":,.2f combines comma separator and 2 decimals", "Put $ outside the {}"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson2_2_3.id,
        number: 3,
        title: "Aligned Table Row",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Print a table row with name left-aligned (15 chars) and score right-aligned (8 chars, 1 decimal).",
        starterCode: "name = \"Alice\"\nscore = 92.5\n\n# Format: name (15 left), score (8 right, 1 decimal)\nrow = \n\nprint(row)",
        solution: "name = \"Alice\"\nscore = 92.5\n\nrow = f\"{name:<15}{score:>8.1f}\"\n\nprint(row)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Alice           92.5", description: "Aligned row" }]),
        hints: ["< for left-align, > for right-align", ".1f for one decimal"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson2_2_3.id,
        number: 4,
        title: "Percentage Display",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Display progress as a percentage. Given 45 out of 60 items, show '75.0% complete'.",
        starterCode: "completed = 45\ntotal = 60\n\n# Calculate ratio and format as percentage\nratio = completed / total\nresult = \n\nprint(result)",
        solution: "completed = 45\ntotal = 60\n\nratio = completed / total\nresult = f\"{ratio:.1%} complete\"\n\nprint(result)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "75.0% complete", description: "Percentage format" }]),
        hints: [":.1% formats as percentage with 1 decimal", "% is added automatically"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson2_2_3.id,
        number: 5,
        title: "Formatted Receipt",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a simple receipt showing item name (left, 20 chars) and price (right, 10 chars, 2 decimals).",
        starterCode: "items = [\n    (\"Coffee\", 4.50),\n    (\"Sandwich\", 8.99),\n    (\"Cookie\", 2.25),\n]\n\n# Print each item formatted, then print total\n",
        solution: "items = [\n    (\"Coffee\", 4.50),\n    (\"Sandwich\", 8.99),\n    (\"Cookie\", 2.25),\n]\n\nprint(f\"{'Item':<20}{'Price':>10}\")\nprint(\"-\" * 30)\n\ntotal = 0\nfor name, price in items:\n    print(f\"{name:<20}${price:>9.2f}\")\n    total += price\n\nprint(\"-\" * 30)\nprint(f\"{'Total':<20}${total:>9.2f}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Formatted receipt", description: "Receipt format" }]),
        hints: ["Loop through items", "Accumulate total", "Use consistent widths"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 2.2.3`);

  console.log("\n✅ Chapter 2 Part 4 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
