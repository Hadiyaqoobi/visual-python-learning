import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Chapter 2...");

  // Create Chapter 2
  const chapter2 = await prisma.chapter.upsert({
    where: { number: 2 },
    update: {},
    create: {
      number: 2,
      title: "Introduction to Python",
      description: "Dive deeper into Python fundamentals including strings, input/output, character encoding, and function basics.",
      objectives: [
        "Master string creation and manipulation",
        "Handle user input and output effectively",
        "Understand character encoding concepts",
        "Use functions with arguments and defaults",
      ],
      isPublished: true,
    },
  });

  console.log("✅ Created Chapter 2:", chapter2.title);

  // Section 2.1: Strings
  const section2_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter2.id, number: 2.1 } },
    update: {},
    create: {
      chapterId: chapter2.id,
      number: 2.1,
      title: "Strings",
      description: "Understanding text data in Python",
      order: 1,
    },
  });

  // Section 2.2: Input and Output
  const section2_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter2.id, number: 2.2 } },
    update: {},
    create: {
      chapterId: chapter2.id,
      number: 2.2,
      title: "Input and Output",
      description: "Interacting with users through input and print",
      order: 2,
    },
  });

  // Section 2.3: Character Encoding
  const section2_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter2.id, number: 2.3 } },
    update: {},
    create: {
      chapterId: chapter2.id,
      number: 2.3,
      title: "Character Encoding",
      description: "How computers represent text",
      order: 3,
    },
  });

  // Section 2.4: More About Functions
  const section2_4 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter2.id, number: 2.4 } },
    update: {},
    create: {
      chapterId: chapter2.id,
      number: 2.4,
      title: "More About Functions",
      description: "Function arguments and defaults",
      order: 4,
    },
  });

  // ==================== LESSON 2.1.1: String Basics ====================
  const lesson2_1_1 = await prisma.lesson.upsert({
    where: { slug: "string-basics" },
    update: {},
    create: {
      sectionId: section2_1.id,
      number: 2.11,
      title: "String Basics",
      slug: "string-basics",
      objectives: [
        "Understand what strings are and why they matter",
        "Create strings using different quote styles",
        "Perform basic string operations (concatenation, repetition)",
        "See how strings are stored in memory",
      ],
      content: `# String Basics

Strings are one of the most important data types in Python. A **string** is a sequence of characters - letters, numbers, symbols, and spaces - that represents text.

## What is a String?

In Python, strings are used to store and manipulate text. Every time you see text in a program - a name, a message, a sentence - that's a string. Strings are **immutable**, meaning once created, they cannot be changed (more on this later).

## Creating Strings

Python gives you three ways to create strings:

### Single Quotes
\`\`\`python
name = 'Alice'
message = 'Hello, World!'
\`\`\`

### Double Quotes
\`\`\`python
name = "Bob"
message = "Python is fun!"
\`\`\`

Single and double quotes work identically. Choose one style and be consistent!

### Triple Quotes (for multi-line strings)
\`\`\`python
poem = '''Roses are red,
Violets are blue,
Python is awesome,
And so are you!'''
\`\`\`

Triple quotes preserve line breaks and are perfect for longer text.

## Why Multiple Quote Styles?

Having different quote styles lets you include quotes inside strings:

\`\`\`python
# Use double quotes to include single quotes
message = "It's a beautiful day!"

# Use single quotes to include double quotes
quote = 'She said, "Hello!"'
\`\`\`

## String Operations

### Concatenation (Joining Strings)

Use the \`+\` operator to join strings together:

\`\`\`python
first = "Hello"
second = "World"
result = first + " " + second  # "Hello World"
\`\`\`

### Repetition (Repeating Strings)

Use the \`*\` operator to repeat a string:

\`\`\`python
laugh = "Ha" * 3  # "HaHaHa"
line = "-" * 20   # "--------------------"
\`\`\`

## Strings in Memory

When you create a string, Python stores each character in a sequence in memory. In **Hardware Mode**, you'll see:

1. Memory is allocated for the string
2. Each character is stored at consecutive addresses
3. The variable name points to the start of this sequence

This is why strings are called **sequences** - they're ordered collections of characters, each with a position (index).`,
      codeExamples: JSON.stringify([
        {
          id: "create-strings",
          title: "Creating Strings",
          code: `# Three ways to create strings
name1 = 'Alice'
name2 = "Bob"
greeting = '''Hello,
World!'''

print(name1)
print(name2)
print(greeting)`,
          description: "Single quotes, double quotes, and triple quotes all create strings",
        },
        {
          id: "string-concat",
          title: "String Concatenation",
          code: `first_name = "John"
last_name = "Doe"
full_name = first_name + " " + last_name

print(full_name)
print("Hello, " + full_name + "!")`,
          description: "Use + to join strings together",
        },
        {
          id: "string-repeat",
          title: "String Repetition",
          code: `laugh = "Ha" * 3
line = "=" * 20

print(laugh)
print(line)`,
          description: "Use * to repeat strings multiple times",
        },
        {
          id: "quotes-inside",
          title: "Quotes Inside Strings",
          code: `# Single quote inside double quotes
message1 = "It's easy!"

# Double quote inside single quotes
message2 = 'She said, "Hi!"'

print(message1)
print(message2)`,
          description: "Mix quote styles to include quotes in strings",
        },
      ]),
      keyPoints: [
        "Strings are sequences of characters representing text",
        "Create strings with single quotes (''), double quotes (\"\"), or triple quotes (''' or \"\"\")",
        "Use + to concatenate (join) strings together",
        "Use * to repeat a string multiple times",
        "Strings are immutable - they cannot be changed after creation",
      ],
      hardwareDemo: "In Hardware Mode, watch how strings are stored in memory as a sequence of characters. Each character occupies a memory cell. When you concatenate strings, a NEW string is created in memory (strings are immutable).",
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });

  // Exercises for Lesson 2.1.1
  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson2_1_1.id,
        number: 1,
        title: "Create Your Name",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a variable called `my_name` that contains your name as a string, then print it.",
        starterCode: `# Create a string with your name
my_name = 

# Print it
print(my_name)`,
        solution: `my_name = "Hadi"
print(my_name)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Hadi", description: "Should print the name" },
        ]),
        hints: [
          "Use either single or double quotes around your name",
          "Example: my_name = \"Alice\"",
          "Don't forget the quotes - without them Python thinks it's a variable!",
        ],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson2_1_1.id,
        number: 2,
        title: "Build a Greeting",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create two variables: `greeting` with value \"Hello\" and `name` with value \"Python\". Then create a third variable `message` that concatenates them with a space and exclamation mark to make \"Hello Python!\"",
        starterCode: `# Create the parts
greeting = 
name = 

# Concatenate them
message = 

print(message)`,
        solution: `greeting = "Hello"
name = "Python"
message = greeting + " " + name + "!"
print(message)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Hello Python!", description: "Should print 'Hello Python!'" },
        ]),
        hints: [
          "Use the + operator to join strings",
          "Don't forget the space between words: \" \"",
          "Add the exclamation mark at the end: + \"!\"",
        ],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson2_1_1.id,
        number: 3,
        title: "Create a Pattern",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Use string repetition to create a line of 30 asterisks (*) and print it.",
        starterCode: `# Create a line of 30 asterisks
line = 

print(line)`,
        solution: `line = "*" * 30
print(line)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "******************************", description: "Should print 30 asterisks" },
        ]),
        hints: [
          "Use the * operator to repeat strings",
          "The format is: string * number",
          "\"*\" * 30 will repeat the asterisk 30 times",
        ],
        xpReward: 10,
        order: 3,
      },
      {
        lessonId: lesson2_1_1.id,
        number: 4,
        title: "Quote Challenge",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a string that contains this exact text (including the quotes): She said, \"It's amazing!\"\nStore it in a variable called `quote` and print it.",
        starterCode: `# Create a string with both types of quotes
quote = 

print(quote)`,
        solution: `quote = '''She said, "It's amazing!"'''
print(quote)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "She said, \"It's amazing!\"", description: "Should print the quote with both quote types" },
        ]),
        hints: [
          "This string has both single AND double quotes inside it",
          "Triple quotes can contain both single and double quotes",
          "Try using '''...''' to wrap the entire string",
        ],
        xpReward: 20,
        order: 4,
      },
    ],
  });

  console.log("✅ Created Lesson 2.1.1: String Basics with 4 exercises");

  // ==================== LESSON 2.1.2: String Indexing and Slicing ====================
  const lesson2_1_2 = await prisma.lesson.upsert({
    where: { slug: "string-indexing-slicing" },
    update: {},
    create: {
      sectionId: section2_1.id,
      number: 2.12,
      title: "String Indexing and Slicing",
      slug: "string-indexing-slicing",
      objectives: [
        "Access individual characters using indexing",
        "Use negative indices to count from the end",
        "Extract substrings using slicing",
        "Understand the slice notation [start:stop:step]",
      ],
      content: `# String Indexing and Slicing

Since strings are sequences, we can access individual characters and extract portions of strings. This is incredibly powerful for text processing!

## Indexing: Accessing Single Characters

Every character in a string has a position called an **index**. Python uses **zero-based indexing**, meaning the first character is at index 0.

\`\`\`python
text = "Python"
#       012345
\`\`\`

| Character | P | y | t | h | o | n |
|-----------|---|---|---|---|---|---|
| Index     | 0 | 1 | 2 | 3 | 4 | 5 |

Access characters using square brackets:

\`\`\`python
text = "Python"
print(text[0])  # 'P' - first character
print(text[1])  # 'y' - second character
print(text[5])  # 'n' - sixth character
\`\`\`

## Negative Indexing

Python also supports **negative indices** that count from the end:

\`\`\`python
text = "Python"
#      -6-5-4-3-2-1
\`\`\`

| Character | P  | y  | t  | h  | o  | n  |
|-----------|----|----|----|----|----|----|
| Negative  | -6 | -5 | -4 | -3 | -2 | -1 |

\`\`\`python
print(text[-1])  # 'n' - last character
print(text[-2])  # 'o' - second to last
print(text[-6])  # 'P' - first character
\`\`\`

## Slicing: Extracting Substrings

**Slicing** lets you extract a portion of a string using the notation \`[start:stop]\`:

\`\`\`python
text = "Python"
print(text[0:3])  # 'Pyt' - characters 0, 1, 2
print(text[2:5])  # 'tho' - characters 2, 3, 4
\`\`\`

**Important**: The \`stop\` index is **exclusive** - it's not included!

## Slice Shortcuts

You can omit \`start\` or \`stop\`:

\`\`\`python
text = "Python"
print(text[:3])   # 'Pyt' - from beginning to index 3
print(text[3:])   # 'hon' - from index 3 to end
print(text[:])    # 'Python' - entire string (copy)
\`\`\`

## Step Parameter

Add a third parameter for the **step** (how many to skip):

\`\`\`python
text = "Python"
print(text[::2])   # 'Pto' - every 2nd character
print(text[1::2])  # 'yhn' - every 2nd, starting at 1
print(text[::-1])  # 'nohtyP' - reverse the string!
\`\`\`

## Hardware View

In Hardware Mode, watch how Python calculates the memory address for each index. The CPU adds the index to the base address to find each character!`,
      codeExamples: JSON.stringify([
        {
          id: "basic-indexing",
          title: "Basic Indexing",
          code: `text = "Hello"

print("First character:", text[0])
print("Third character:", text[2])
print("Last character:", text[4])`,
          description: "Access individual characters by their position",
        },
        {
          id: "negative-indexing",
          title: "Negative Indexing",
          code: `word = "Python"

print("Last:", word[-1])
print("Second to last:", word[-2])
print("First:", word[-6])`,
          description: "Count backwards from the end with negative indices",
        },
        {
          id: "basic-slicing",
          title: "Basic Slicing",
          code: `text = "Hello World"

print(text[0:5])   # First 5 characters
print(text[6:11])  # Last 5 characters
print(text[:5])    # Shortcut for first 5
print(text[6:])    # Shortcut for rest`,
          description: "Extract portions of strings with [start:stop]",
        },
        {
          id: "step-slicing",
          title: "Slicing with Step",
          code: `text = "abcdefghij"

print(text[::2])    # Every 2nd character
print(text[1::2])   # Every 2nd, start at 1
print(text[::-1])   # Reverse the string!`,
          description: "Use step to skip characters or reverse",
        },
      ]),
      keyPoints: [
        "Indexing starts at 0 (zero-based indexing)",
        "Use [index] to access a single character",
        "Negative indices count from the end (-1 is last)",
        "Slicing [start:stop] extracts a substring (stop is exclusive)",
        "[::-1] reverses a string",
      ],
      hardwareDemo: "Watch the CPU calculate memory addresses! When you access text[3], Python takes the base address and adds 3 to find that character's location.",
      estimatedTime: 18,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });

  // Exercises for Lesson 2.1.2
  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson2_1_2.id,
        number: 1,
        title: "First and Last",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given the string \"Programming\", print the first character and the last character on separate lines.",
        starterCode: `word = "Programming"

# Print the first character

# Print the last character
`,
        solution: `word = "Programming"
print(word[0])
print(word[-1])`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "P\ng", description: "Should print P and g" },
        ]),
        hints: [
          "The first character is at index 0",
          "Use negative indexing for the last character",
          "word[-1] gives you the last character",
        ],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson2_1_2.id,
        number: 2,
        title: "Extract a Word",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "From the string \"Hello World\", extract just the word \"World\" using slicing and print it.",
        starterCode: `text = "Hello World"

# Extract "World" using slicing
word = 

print(word)`,
        solution: `text = "Hello World"
word = text[6:11]
print(word)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "World", description: "Should print World" },
        ]),
        hints: [
          "Count the positions: H(0) e(1) l(2) l(3) o(4) (5) W(6)...",
          "World starts at index 6",
          "You can also use text[6:] since World goes to the end",
        ],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson2_1_2.id,
        number: 3,
        title: "Reverse It",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Reverse the string \"Python\" using slicing so it prints \"nohtyP\".",
        starterCode: `original = "Python"

# Reverse using slicing
reversed_str = 

print(reversed_str)`,
        solution: `original = "Python"
reversed_str = original[::-1]
print(reversed_str)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "nohtyP", description: "Should print nohtyP" },
        ]),
        hints: [
          "Use the step parameter in slicing",
          "A negative step goes backwards",
          "[::-1] means: all characters, stepping by -1",
        ],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson2_1_2.id,
        number: 4,
        title: "Every Other Letter",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "From \"abcdefgh\", extract every other character starting from the first, to get \"aceg\".",
        starterCode: `text = "abcdefgh"

# Get every other character
result = 

print(result)`,
        solution: `text = "abcdefgh"
result = text[::2]
print(result)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "aceg", description: "Should print aceg" },
        ]),
        hints: [
          "Use the step parameter to skip characters",
          "Step of 2 means take every 2nd character",
          "[::2] starts at beginning, goes to end, steps by 2",
        ],
        xpReward: 15,
        order: 4,
      },
    ],
  });

  console.log("✅ Created Lesson 2.1.2: String Indexing and Slicing with 4 exercises");

  // Summary
  const lessonCount = await prisma.lesson.count({ where: { section: { chapter: { number: 2 } } } });
  const exerciseCount = await prisma.exercise.count({ where: { lesson: { section: { chapter: { number: 2 } } } } });

  console.log("\n📊 Chapter 2 Summary:");
  console.log(`   Lessons: ${lessonCount}`);
  console.log(`   Exercises: ${exerciseCount}`);
  console.log("\n🌱 Chapter 2 seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
