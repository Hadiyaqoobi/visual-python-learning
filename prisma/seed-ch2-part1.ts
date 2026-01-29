import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 2 Part 1: Structure + Lessons 2.1.1-2.1.2...\n");

  // Find Chapter 2 (should already exist from initial seed)
  let chapter2 = await prisma.chapter.findFirst({ where: { number: 2 } });
  
  if (!chapter2) {
    chapter2 = await prisma.chapter.create({
      data: {
        number: 2,
        title: "Introduction to Python",
        description: "Master strings, input/output, and create your first interactive programs. Learn text processing fundamentals that you'll use in every Python project.",
        objectives: [
          "Create and manipulate strings with different quote styles",
          "Use string operations: concatenation, repetition, and slicing",
          "Apply string methods for text processing",
          "Get user input and format output",
          "Understand string immutability",
        ],
        isPublished: true,
      },
    });
  }
  console.log(`✅ Chapter ${chapter2.number}: ${chapter2.title}`);

  // Section 2.1: Strings
  const section2_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter2.id, number: 2.1 } },
    update: {},
    create: {
      chapterId: chapter2.id,
      number: 2.1,
      title: "Strings",
      description: "Understanding Python's text data type.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section2_1.number}: ${section2_1.title}`);

  // Section 2.2: Input and Output
  const section2_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter2.id, number: 2.2 } },
    update: {},
    create: {
      chapterId: chapter2.id,
      number: 2.2,
      title: "Input and Output",
      description: "Interactive programs with user input and formatted output.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section2_2.number}: ${section2_2.title}`);

  // Section 2.3: Character Encoding
  const section2_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter2.id, number: 2.3 } },
    update: {},
    create: {
      chapterId: chapter2.id,
      number: 2.3,
      title: "Character Encoding",
      description: "How computers represent text as numbers.",
      order: 3,
    },
  });
  console.log(`  📂 Section ${section2_3.number}: ${section2_3.title}`);

  // ==================== LESSON 2.1.1 ====================
  const lesson2_1_1 = await prisma.lesson.upsert({
    where: { slug: "string-basics" },
    update: {},
    create: {
      sectionId: section2_1.id,
      number: 2.11,
      title: "String Basics - Creating and Printing Strings",
      slug: "string-basics",
      objectives: [
        "Create strings using single, double, and triple quotes",
        "Understand strings as sequences of characters",
        "Use escape sequences for special characters",
        "Print strings and check their type",
      ],
      content: `# String Basics

## What Are Strings?

Strings are Python's **text data type** - sequences of characters used to represent text.

Everything textual in programming is a string:
- Names: \`"Alice"\`, \`"Bob"\`
- Messages: \`"Hello, World!"\`
- Data: \`"alice@email.com"\`, \`"123 Main St"\`
- Commands: \`"quit"\`, \`"save"\`

In Python, strings have type \`str\` (short for string). They are:
- **Ordered**: Characters have positions (0, 1, 2...)
- **Immutable**: Cannot be changed after creation
- **Versatile**: Can contain any text, including emojis and multiple languages

**Important**: Strings are NOT numbers!
- \`"123"\` is text (type \`str\`)
- \`123\` is a number (type \`int\`)
- They look similar but work differently!

## Creating Strings with Quotes

Python offers three quoting styles, giving you flexibility:

### Single Quotes: \`'text'\`
The most common style. Clean and simple.

\`\`\`python
name = 'Alice'
city = 'Boston'
message = 'She said "Welcome!"'  # Can contain double quotes
\`\`\`

### Double Quotes: \`"text"\`
Functionally identical to single quotes. Choose one style and be consistent.

\`\`\`python
name = "Bob"
greeting = "It's a beautiful day"  # Can contain apostrophes
\`\`\`

### Triple Quotes: \`'''text'''\` or \`"""text"""\`
For multi-line strings. Preserves line breaks and formatting.

\`\`\`python
poem = '''Roses are red,
Violets are blue,
Python is great,
And so are you!'''
\`\`\`

**When to use each:**
- Default: Single or double (pick one, be consistent)
- Contains apostrophe: Use double quotes
- Contains both quote types: Use triple quotes
- Multi-line text: Use triple quotes

## Escape Sequences

The backslash \`\\\` creates special characters:

| Sequence | Meaning |
|----------|---------|
| \`\\n\` | Newline (line break) |
| \`\\t\` | Tab (horizontal spacing) |
| \`\\'\` | Single quote |
| \`\\"\` | Double quote |
| \`\\\\\` | Backslash itself |

\`\`\`python
print("Line 1\\nLine 2")  # Prints on two lines
print("Name:\\tAlice")     # Tab between
print('It\\'s working')    # Escaped quote
\`\`\`

**Key insight**: Escape sequences count as ONE character!
- \`len("\\n")\` returns \`1\`, not \`2\`

## String Assignment and Type

Assign strings to variables just like numbers:

\`\`\`python
name = "Alice"
city = "Boston"
print(type(name))  # <class 'str'>
\`\`\`

You can reassign variables, but you cannot modify the string itself:

\`\`\`python
message = "Hello"
message = "Goodbye"  # OK - reassigning variable
message[0] = 'h'     # ERROR - strings are immutable!
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "quote-styles",
          title: "Creating Strings with Different Quotes",
          code: `# Single quotes - most common
name = 'Alice'
city = 'Boston'
print(name)  # Alice
print(city)  # Boston

# Double quotes - same result
name2 = "Bob"
city2 = "New York"
print(name2)  # Bob

# Quotes inside strings
quote1 = "He said 'hello'"           # Double outside, single inside
quote2 = 'She said "goodbye"'        # Single outside, double inside
quote3 = '''He said "It's working"'''  # Triple allows both!

print(quote1)  # He said 'hello'
print(quote2)  # She said "goodbye"
print(quote3)  # He said "It's working"

# Triple quotes for multi-line
address = '''123 Main Street
Boston, MA 02101
United States'''

print(address)
# 123 Main Street
# Boston, MA 02101
# United States`,
          description: "Different ways to create strings",
        },
        {
          id: "escape-sequences",
          title: "Escape Characters",
          code: `# Newline - creates line break
print("First line\\nSecond line")
# Output:
# First line
# Second line

# Tab - creates horizontal spacing
print("Name:\\tAlice\\nAge:\\t25")
# Output:
# Name:   Alice
# Age:    25

# Quote escaping
message = 'It\\'s a nice day'
print(message)  # It's a nice day

# Backslash itself (need two)
path = "C:\\\\Users\\\\Alice\\\\Documents"
print(path)  # C:\\Users\\Alice\\Documents

# Multiple escapes together
formatted = "Column1\\tColumn2\\nValue1\\tValue2"
print(formatted)
# Column1    Column2
# Value1     Value2

# Escape sequences are ONE character
print(len("\\n"))  # 1 (not 2!)
print(len("\\t"))  # 1`,
          description: "Special characters with backslash",
        },
        {
          id: "type-checking",
          title: "String Variables and Type Checking",
          code: `# Creating string variables
first_name = "John"
last_name = "Doe"
age_string = "25"  # This is TEXT, not a number!

# Check types
print(type(first_name))  # <class 'str'>
print(type(age_string))  # <class 'str'>
print(type(25))          # <class 'int'>

# Strings vs numbers - DIFFERENT!
number_as_string = "123"
actual_number = 123

print(number_as_string + number_as_string)  # "123123" (text joined)
print(actual_number + actual_number)        # 246 (math)

# Convert between types
converted = int(number_as_string)
print(converted + 1)  # 124

# Empty string is valid
empty = ""
print(f"Empty string: '{empty}'")
print(f"Length: {len(empty)}")  # 0`,
          description: "Working with string variables",
        },
        {
          id: "multiline-strings",
          title: "Multi-line Strings",
          code: `# Using \\n for new lines
bio = "Name: Alice\\nAge: 30\\nJob: Developer"
print(bio)
# Name: Alice
# Age: 30
# Job: Developer

# Triple quotes preserve formatting
formatted_bio = """Name: Alice
Age: 30
Occupation: Developer
Skills:
  - Python
  - JavaScript
  - SQL"""

print(formatted_bio)

# Long strings can span multiple code lines
# Use parentheses - Python joins them automatically
long_message = ("This is a very long message "
                "that spans multiple lines in code "
                "but is still one string")
print(long_message)
# This is a very long message that spans multiple lines in code but is still one string

# Combining approaches
name = "Alice"
intro = f"""Welcome!
Your name is: {name}
Enjoy your stay."""
print(intro)`,
          description: "Creating multi-line strings",
        },
      ]),
      keyPoints: [
        "Strings are text data (type `str`)",
        "Three quote styles: 'single', \"double\", '''triple'''",
        "Triple quotes for multi-line strings",
        "Escape sequences: \\n (newline), \\t (tab), \\' \\\" (quotes)",
        "Escape sequences count as ONE character",
        "Strings are immutable (cannot change after creation)",
        "\"123\" (string) is different from 123 (integer)",
        "Check type with type(string)",
      ],
      hardwareDemo: "Watch strings stored in memory as character sequences. See how escape sequences become single characters.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson2_1_1.number}: ${lesson2_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson2_1_1.id,
        number: 1,
        title: "Create String Variables",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create three string variables: `first_name`, `last_name`, and `city`. Assign your own values and print each on a separate line.",
        starterCode: `# Create your string variables here
first_name = 
last_name = 
city = 

# Print each variable
`,
        solution: `first_name = "John"
last_name = "Doe"
city = "Boston"

print(first_name)
print(last_name)
print(city)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Three lines of output", description: "Should print three strings" },
        ]),
        hints: ["Use quotes around text values", "Each variable on its own line", "Use print() to display"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson2_1_1.id,
        number: 2,
        title: "Multi-line Poem",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a multi-line string using triple quotes containing a short poem (at least 2 lines). Then print it.",
        starterCode: `# Create a multi-line poem using triple quotes
poem = 

# Print the poem
`,
        solution: `poem = '''Roses are red
Violets are blue
Python is awesome
And so are you!'''

print(poem)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Multiple lines", description: "Output should have line breaks" },
        ]),
        hints: ["Start and end with ''' or \"\"\"", "Just press Enter for new lines", "No \\n needed inside triple quotes"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson2_1_1.id,
        number: 3,
        title: "Quotes Inside Quotes",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a string containing both a single quote AND a double quote. The text should be: He said \"It's perfect!\" Try at least two different approaches.",
        starterCode: `# Approach 1: Use triple quotes
quote1 = 

# Approach 2: Use escape sequences
quote2 = 

print(quote1)
print(quote2)`,
        solution: `# Approach 1: Triple quotes allow both
quote1 = '''He said "It's perfect!"'''

# Approach 2: Escape the double quotes
quote2 = "He said \\"It's perfect!\\""

print(quote1)
print(quote2)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "He said \"It's perfect!\"", description: "Both should print the same" },
        ]),
        hints: ["Triple quotes can contain both ' and \"", "Or escape with backslash: \\\" and \\'", "Both approaches should give same output"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson2_1_1.id,
        number: 4,
        title: "Escape Sequence Table",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use escape sequences to print this table (use \\t for tabs and \\n for newlines):\nName:\tAlice\nAge:\t25\nCity:\tBoston\n\nDo it in a SINGLE print statement with one string.",
        starterCode: `# Create the table using escape sequences
info = 

print(info)`,
        solution: `info = "Name:\\tAlice\\nAge:\\t25\\nCity:\\tBoston"
print(info)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Name:\tAlice\nAge:\t25\nCity:\tBoston", description: "Formatted table" },
        ]),
        hints: ["\\t creates a tab", "\\n creates a new line", "Combine them in one string"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson2_1_1.id,
        number: 5,
        title: "Text Box",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "WITHOUT using triple quotes, create a single string variable that prints this box:\n+-----+\n|     |\n+-----+\n\nUse only \\n for newlines. Store in variable `box` and print it.",
        starterCode: `# Create the box using \\n for newlines
box = 

print(box)`,
        solution: `box = "+-----+\\n|     |\\n+-----+"
print(box)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "+-----+\n|     |\n+-----+", description: "Three-line box" },
        ]),
        hints: ["Top line: +-----+", "Middle line: |     | (5 spaces)", "Bottom line: +-----+", "Connect with \\n"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 2.1.1`);

  // ==================== LESSON 2.1.2 ====================
  const lesson2_1_2 = await prisma.lesson.upsert({
    where: { slug: "string-operations" },
    update: {},
    create: {
      sectionId: section2_1.id,
      number: 2.12,
      title: "String Operations - Concatenation, Repetition, and Length",
      slug: "string-operations",
      objectives: [
        "Concatenate strings with the + operator",
        "Repeat strings with the * operator",
        "Find string length with len()",
        "Combine operations in expressions",
      ],
      content: `# String Operations

## Concatenation with +

**Concatenation** means joining strings together to form a longer string.

\`\`\`python
"Hello" + "World"     # "HelloWorld"
"Hello" + " " + "World"  # "Hello World"
\`\`\`

**Important rules:**
- BOTH operands must be strings
- No automatic spaces are added
- Creates a NEW string (original strings unchanged)
- Cannot mix strings and numbers directly

\`\`\`python
# This causes an error!
"Score: " + 85  # TypeError!

# Must convert number to string first
"Score: " + str(85)  # "Score: 85"
\`\`\`

**Common uses:**
- Building messages: \`"Hello, " + name + "!"\`
- Combining data: \`first_name + " " + last_name\`
- Creating formatted output

## Repetition with *

**Repetition** duplicates a string N times.

\`\`\`python
"Ha" * 3        # "HaHaHa"
"=" * 40        # "========================================"
3 * "Ho"        # "HoHoHo" (order doesn't matter)
\`\`\`

**Rules:**
- One operand must be string, one must be integer
- \`"Hi" * 3\` works ✅
- \`"Hi" * 3.5\` doesn't work ❌ (must be int)
- \`"Hi" * "Ho"\` doesn't work ❌

**Edge cases:**
- \`"text" * 0\` = \`""\` (empty string)
- \`"text" * 1\` = \`"text"\` (unchanged)
- \`"text" * -1\` = \`""\` (negative treated as 0)

**Common uses:**
- Creating separators: \`print("=" * 50)\`
- Progress bars: \`"#" * filled + "-" * empty\`
- Decorative patterns

## String Length with len()

The \`len()\` function returns the number of characters in a string.

\`\`\`python
len("Hello")      # 5
len("")           # 0 (empty string)
len("Hi there!")  # 9 (spaces and punctuation count!)
len("\\n")        # 1 (escape sequences are ONE character)
\`\`\`

**What counts as a character:**
- Letters, digits, spaces
- Punctuation marks
- Escape sequences (\\n, \\t = 1 character each)

**Common uses:**
- Validation: \`if len(password) < 8:\`
- Formatting: Calculate padding needed
- Limits: Enforce max length (tweets, forms)

## Combining Operations

You can mix concatenation, repetition, and len():

\`\`\`python
# Create a centered header
title = "Welcome"
padding = "=" * 20
header = padding + " " + title + " " + padding

# Separator matching text length
text = "Hello World"
separator = "-" * len(text)
\`\`\`

**Operator precedence:**
- \`*\` before \`+\` (just like arithmetic!)
- \`"Hi" + "!" * 3\` = \`"Hi!!!"\` (not \`"Hi!Hi!Hi!"\`)
- Use parentheses for clarity: \`("Hi" + "!") * 3\` = \`"Hi!Hi!Hi!"\``,
      codeExamples: JSON.stringify([
        {
          id: "concatenation-basics",
          title: "Concatenation Basics",
          code: `# Simple concatenation
first = "Hello"
second = "World"
combined = first + second
print(combined)  # HelloWorld (no space!)

# Adding space explicitly
with_space = first + " " + second
print(with_space)  # Hello World

# Building full name
first_name = "John"
middle = "Q"
last_name = "Public"
full_name = first_name + " " + middle + ". " + last_name
print(full_name)  # John Q. Public

# ERROR: mixing types
age = 25
# bio = "Age: " + age  # TypeError!
bio = "Age: " + str(age)  # Must convert to string
print(bio)  # Age: 25

# Concatenating many strings
sentence = "The" + " " + "quick" + " " + "brown" + " " + "fox"
print(sentence)  # The quick brown fox`,
          description: "Joining strings together",
        },
        {
          id: "repetition-patterns",
          title: "Repetition Patterns",
          code: `# Creating separators
print("=" * 50)
print("Welcome to Python!")
print("=" * 50)

# Simple patterns
stars = "*" * 10
print(stars)  # **********

# Progress bar
filled = 7
empty = 3
bar = "#" * filled + "-" * empty
print(f"Progress: [{bar}]")  # Progress: [#######---]

# Building a box
top = "+" + "-" * 10 + "+"
middle = "|" + " " * 10 + "|"
bottom = "+" + "-" * 10 + "+"
print(top)     # +----------+
print(middle)  # |          |
print(bottom)  # +----------+

# Order doesn't matter
print("Ha" * 3)  # HaHaHa
print(3 * "Ha")  # HaHaHa (same result)`,
          description: "Repeating strings",
        },
        {
          id: "using-len",
          title: "Using len()",
          code: `# Basic length
name = "Alice"
print(f"'{name}' has {len(name)} characters")  # 5

# Empty string
empty = ""
print(f"Empty string length: {len(empty)}")  # 0

# Spaces count!
with_spaces = "   Alice   "
print(f"With spaces: {len(with_spaces)}")  # 11

# Escape sequences count as 1
print(len("\\n"))  # 1 (not 2!)
print(len("\\t"))  # 1
print(len("Hello\\nWorld"))  # 11 (5 + 1 + 5)

# Validation example
password = "secret"
if len(password) < 8:
    needed = 8 - len(password)
    print(f"Too short! Need {needed} more characters")
else:
    print("Password accepted")

# Calculate padding
text = "Title"
total_width = 20
padding_each_side = (total_width - len(text)) // 2
centered = " " * padding_each_side + text
print(f"|{centered}|")`,
          description: "Measuring string length",
        },
        {
          id: "combining-operations",
          title: "Combining All Operations",
          code: `# Header with dynamic sizing
title = "Python Course"
width = 50
equals_per_side = (width - len(title) - 2) // 2
header = "=" * equals_per_side + " " + title + " " + "=" * equals_per_side
print(header)
# ================= Python Course =================

# Score visualization
name = "Alice"
score = 85
bar_length = score // 5  # 5 points per #
bar = "#" * bar_length + "-" * (20 - bar_length)
print(f"{name}: [{bar}] {score}%")
# Alice: [#################---] 85%

# Section separator that matches text
section = "Introduction"
print()
print(section)
print("-" * len(section))
# Introduction
# ------------

# Operator precedence
print("Hi" + "!" * 3)      # Hi!!! (* first)
print(("Hi" + "!") * 3)    # Hi!Hi!Hi! (parentheses change order)`,
          description: "Combining concatenation, repetition, and len()",
        },
      ]),
      keyPoints: [
        "Concatenation (+): Joins strings into new string",
        "Repetition (*): Duplicates string N times",
        "len(): Returns integer count of characters",
        "Must convert numbers to strings: str(number)",
        "Spaces must be added explicitly",
        "Operator precedence: * before + (use parentheses!)",
        "All operations create NEW strings (immutability)",
        "Empty string has length 0",
      ],
      hardwareDemo: "Watch string concatenation allocate new memory. See how original strings remain unchanged.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson2_1_2.number}: ${lesson2_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson2_1_2.id,
        number: 1,
        title: "Join Words",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create variables `first = 'Hello'` and `second = 'World'`. Concatenate them with a space between and store in `result`. Print the result.",
        starterCode: `first = 'Hello'
second = 'World'

# Concatenate with space between
result = 

print(result)`,
        solution: `first = 'Hello'
second = 'World'

result = first + ' ' + second

print(result)  # Hello World`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Hello World", description: "Words joined with space" },
        ]),
        hints: ["Use + to join strings", "Add ' ' between them", "Three things: first + space + second"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson2_1_2.id,
        number: 2,
        title: "Repeat String",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a variable `word = 'Python'` and repeat it 5 times. Print the result.",
        starterCode: `word = 'Python'

# Repeat word 5 times
result = 

print(result)`,
        solution: `word = 'Python'

result = word * 5

print(result)  # PythonPythonPythonPythonPython`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "PythonPythonPythonPythonPython", description: "Word repeated 5 times" },
        ]),
        hints: ["Use * with an integer", "string * number repeats the string", "5 copies of 'Python'"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson2_1_2.id,
        number: 3,
        title: "Personal Greeting",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a greeting that includes a name and age. Given `name = 'Alice'` and `age = 25`, create the string `'Hello, Alice! You are 25 years old.'` using concatenation. Remember to convert the number!",
        starterCode: `name = 'Alice'
age = 25

# Build the greeting (remember: age is an integer!)
greeting = 

print(greeting)`,
        solution: `name = 'Alice'
age = 25

greeting = 'Hello, ' + name + '! You are ' + str(age) + ' years old.'

print(greeting)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Hello, Alice! You are 25 years old.", description: "Complete greeting" },
        ]),
        hints: ["Use str(age) to convert number to string", "Don't forget spaces and punctuation", "Build it piece by piece"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson2_1_2.id,
        number: 4,
        title: "Make Separator Function",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a function `make_separator(width, char)` that returns a separator string. Example: `make_separator(20, '=')` returns `'===================='`.",
        starterCode: `def make_separator(width, char):
    # Return char repeated width times
    

# Test it
print(make_separator(20, '='))
print(make_separator(15, '-'))
print(make_separator(10, '*'))`,
        solution: `def make_separator(width, char):
    return char * width

print(make_separator(20, '='))  # ====================
print(make_separator(15, '-'))  # ---------------
print(make_separator(10, '*'))  # **********`,
        testCases: JSON.stringify([
          { input: "20, '='", expectedOutput: "====================", description: "20 equals signs" },
          { input: "15, '-'", expectedOutput: "---------------", description: "15 dashes" },
        ]),
        hints: ["Use the * operator", "char * width gives you width copies", "Return the result"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson2_1_2.id,
        number: 5,
        title: "Auto-sizing Box",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a function `make_box(text)` that returns the text in a box that automatically sizes to fit:\n```\n+-------+\n| Hello |\n+-------+\n```\nThe box should work for any text. Use len() to calculate the width.",
        starterCode: `def make_box(text):
    # Calculate width needed
    # Build top, middle, bottom
    # Return combined with newlines
    

# Test with different text
print(make_box("Hello"))
print()
print(make_box("Python is great!"))`,
        solution: `def make_box(text):
    width = len(text) + 2  # text + 2 spaces
    top = '+' + '-' * width + '+'
    middle = '| ' + text + ' |'
    bottom = '+' + '-' * width + '+'
    return top + '\\n' + middle + '\\n' + bottom

print(make_box("Hello"))
# +-------+
# | Hello |
# +-------+

print()
print(make_box("Python is great!"))
# +------------------+
# | Python is great! |
# +------------------+`,
        testCases: JSON.stringify([
          { input: "'Hello'", expectedOutput: "+-------+\n| Hello |\n+-------+", description: "Box around Hello" },
          { input: "'Hi'", expectedOutput: "+----+\n| Hi |\n+----+", description: "Box around Hi" },
        ]),
        hints: ["Width = len(text) + 2 (for the spaces)", "Top/bottom: + then dashes then +", "Middle: | space text space |", "Join with \\n"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 2.1.2`);

  console.log("\n✅ Chapter 2 Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
