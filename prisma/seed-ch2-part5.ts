import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 2 Part 5: Lesson 2.3.1 (Character Encoding)...\n");

  const section2_3 = await prisma.section.findFirst({ where: { number: 2.3 } });
  if (!section2_3) throw new Error("Section 2.3 not found.");

  // ==================== LESSON 2.3.1 ====================
  const lesson2_3_1 = await prisma.lesson.upsert({
    where: { slug: "character-encoding" },
    update: {},
    create: {
      sectionId: section2_3.id,
      number: 2.31,
      title: "Character Encoding",
      slug: "character-encoding",
      objectives: [
        "Understand how computers represent text as numbers",
        "Know the basics of ASCII and Unicode",
        "Use ord() and chr() functions",
        "Appreciate why encoding matters",
      ],
      content: `# Character Encoding

## How Computers Store Text

Computers only understand numbers. To store text, each character is assigned a unique number.

**Character encoding** is the system that maps characters to numbers.

## ASCII - The Original Standard

ASCII (American Standard Code for Information Interchange) was created in the 1960s.

- Uses numbers 0-127
- Covers English letters, digits, punctuation
- 'A' = 65, 'B' = 66, ... 'Z' = 90
- 'a' = 97, 'b' = 98, ... 'z' = 122
- '0' = 48, '1' = 49, ... '9' = 57

**Limitation**: Only 128 characters - no accents, no other alphabets!

## Unicode - The Modern Standard

Unicode was created to represent ALL writing systems.

- Over 140,000 characters
- Covers every language, plus emojis!
- 'A' = 65 (same as ASCII for compatibility)
- '中' = 20013
- '🐍' = 128013

Python 3 uses Unicode by default - you can use any character!

## Python Functions

### ord() - Character to Number

\`\`\`python
ord('A')  # 65
ord('a')  # 97
ord('0')  # 48
ord('🐍')  # 128013
\`\`\`

### chr() - Number to Character

\`\`\`python
chr(65)   # 'A'
chr(97)   # 'a'
chr(128013)  # '🐍'
\`\`\`

## Why This Matters

1. **Sorting**: 'Apple' comes before 'banana' because 'A' (65) < 'b' (98)
2. **Comparison**: Characters are compared by their numeric values
3. **Encryption**: Many ciphers work by shifting character codes
4. **Data Processing**: Understanding encoding prevents garbled text`,
      codeExamples: JSON.stringify([
        {
          id: "ord-chr-basics",
          title: "ord() and chr() Functions",
          code: "# ord() - get the numeric code for a character\nprint(ord('A'))  # 65\nprint(ord('Z'))  # 90\nprint(ord('a'))  # 97\nprint(ord('z'))  # 122\nprint(ord('0'))  # 48\nprint(ord(' '))  # 32 (space)\n\n# chr() - get the character for a numeric code\nprint(chr(65))   # A\nprint(chr(90))   # Z\nprint(chr(97))   # a\nprint(chr(48))   # 0\n\n# They are inverses\nprint(chr(ord('A')))  # A\nprint(ord(chr(65)))   # 65",
          description: "Converting between characters and codes",
        },
        {
          id: "ascii-table",
          title: "Exploring ASCII",
          code: "# Print uppercase letters with their codes\nprint(\"Uppercase letters:\")\nfor i in range(65, 91):  # A-Z\n    print(f\"{chr(i)} = {i}\")\n\nprint(\"\\nLowercase letters:\")\nfor i in range(97, 103):  # a-f (just a sample)\n    print(f\"{chr(i)} = {i}\")\n\nprint(\"\\nDigits:\")\nfor i in range(48, 58):  # 0-9\n    print(f\"{chr(i)} = {i}\")\n\n# The difference between upper and lower is always 32\nprint(\"\\nUpper to lower difference:\")\nprint(f\"'A' ({ord('A')}) + 32 = {ord('A') + 32} = '{chr(ord('A') + 32)}'\")",
          description: "Exploring ASCII values",
        },
        {
          id: "case-conversion",
          title: "Manual Case Conversion",
          code: "# Convert uppercase to lowercase manually\ndef to_lower(char):\n    if 'A' <= char <= 'Z':\n        return chr(ord(char) + 32)\n    return char\n\n# Convert lowercase to uppercase manually\ndef to_upper(char):\n    if 'a' <= char <= 'z':\n        return chr(ord(char) - 32)\n    return char\n\n# Test\nprint(to_lower('H'))  # h\nprint(to_lower('e'))  # e (already lower)\nprint(to_upper('w'))  # W\n\n# Convert entire string\ntext = \"Hello World\"\nlower_text = ''.join(to_lower(c) for c in text)\nprint(lower_text)  # hello world",
          description: "Case conversion using character codes",
        },
        {
          id: "unicode-examples",
          title: "Unicode Characters",
          code: "# Python 3 supports Unicode natively\nprint(\"Hello, World!\")\nprint(\"Bonjour, monde!\")\nprint(\"Hola, mundo!\")\nprint(\"Hallo, Welt!\")\n\n# Asian characters\nprint(\"Chinese: \" + chr(20013) + chr(25991))  # Some Chinese\nprint(\"Japanese: \" + chr(12371) + chr(12435) + chr(12395) + chr(12385) + chr(12399))\n\n# Emojis are Unicode too!\nprint(\"Snake: \" + chr(128013))  # snake emoji\nprint(\"Python: \" + chr(128013) + \" is fun!\")\n\n# Get codes for emoji\nprint(f\"Snake emoji code: {ord(chr(128013))}\")",
          description: "Working with Unicode characters",
        },
      ]),
      keyPoints: [
        "Computers store text as numbers",
        "ASCII: original standard, 0-127, English only",
        "Unicode: modern standard, 140,000+ characters",
        "ord(char) returns numeric code",
        "chr(code) returns character",
        "Uppercase A-Z: 65-90",
        "Lowercase a-z: 97-122",
        "Difference between upper/lower case: 32",
        "Python 3 uses Unicode by default",
      ],
      hardwareDemo: "Watch characters stored as numbers in memory. See ASCII table visualization.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson2_3_1.number}: ${lesson2_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson2_3_1.id,
        number: 1,
        title: "Character Codes",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Print the ASCII codes for 'A', 'a', '0', and ' ' (space).",
        starterCode: "# Print ASCII codes for these characters\n",
        solution: "print(ord('A'))  # 65\nprint(ord('a'))  # 97\nprint(ord('0'))  # 48\nprint(ord(' '))  # 32",
        testCases: JSON.stringify([{ input: "", expectedOutput: "65\n97\n48\n32", description: "ASCII codes" }]),
        hints: ["Use ord() function", "Pass the character in quotes"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson2_3_1.id,
        number: 2,
        title: "Codes to Characters",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Convert these codes to characters and print them: 72, 101, 108, 108, 111 (spells a word!).",
        starterCode: "# Convert codes to characters\ncodes = [72, 101, 108, 108, 111]\n",
        solution: "codes = [72, 101, 108, 108, 111]\nfor code in codes:\n    print(chr(code), end=\"\")\nprint()  # Hello",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Hello", description: "Codes spell Hello" }]),
        hints: ["Use chr() function", "Use end='' to print on same line"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson2_3_1.id,
        number: 3,
        title: "Print Alphabet",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use a loop with chr() to print all uppercase letters A-Z on one line.",
        starterCode: "# Print A-Z using chr() and a loop\n# Hint: 'A' is 65, 'Z' is 90\n",
        solution: "for code in range(65, 91):\n    print(chr(code), end=\"\")\nprint()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", description: "Full alphabet" }]),
        hints: ["A is 65, Z is 90", "Use range(65, 91)", "chr() converts code to letter"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson2_3_1.id,
        number: 4,
        title: "Manual is_upper",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function is_upper(char) that returns True if the character is uppercase (A-Z), without using the built-in isupper() method.",
        starterCode: "def is_upper(char):\n    # Check if char is between 'A' and 'Z' using ord()\n    \n\n# Test\nprint(is_upper('A'))  # True\nprint(is_upper('a'))  # False\nprint(is_upper('Z'))  # True\nprint(is_upper('5'))  # False",
        solution: "def is_upper(char):\n    return 65 <= ord(char) <= 90\n\nprint(is_upper('A'))  # True\nprint(is_upper('a'))  # False\nprint(is_upper('Z'))  # True\nprint(is_upper('5'))  # False",
        testCases: JSON.stringify([
          { input: "'A'", expectedOutput: "True", description: "A is uppercase" },
          { input: "'a'", expectedOutput: "False", description: "a is not uppercase" },
        ]),
        hints: ["Uppercase A-Z have codes 65-90", "Use ord() to get the code", "Check if code is in range"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson2_3_1.id,
        number: 5,
        title: "Caesar Cipher",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement a simple Caesar cipher that shifts each letter by 3 positions. 'A' becomes 'D', 'Z' becomes 'C' (wraps around). Only shift letters, leave other characters unchanged.",
        starterCode: "def caesar_encrypt(text, shift=3):\n    result = \"\"\n    for char in text:\n        # Shift letters, wrap around, leave others unchanged\n        pass\n    return result\n\n# Test\nprint(caesar_encrypt(\"ABC\"))   # DEF\nprint(caesar_encrypt(\"XYZ\"))   # ABC (wraps)\nprint(caesar_encrypt(\"Hello, World!\"))  # Khoor, Zruog!",
        solution: "def caesar_encrypt(text, shift=3):\n    result = \"\"\n    for char in text:\n        if 'A' <= char <= 'Z':\n            new_code = (ord(char) - 65 + shift) % 26 + 65\n            result += chr(new_code)\n        elif 'a' <= char <= 'z':\n            new_code = (ord(char) - 97 + shift) % 26 + 97\n            result += chr(new_code)\n        else:\n            result += char\n    return result\n\nprint(caesar_encrypt(\"ABC\"))   # DEF\nprint(caesar_encrypt(\"XYZ\"))   # ABC\nprint(caesar_encrypt(\"Hello, World!\"))  # Khoor, Zruog!",
        testCases: JSON.stringify([
          { input: "\"ABC\"", expectedOutput: "DEF", description: "Simple shift" },
          { input: "\"XYZ\"", expectedOutput: "ABC", description: "Wrap around" },
        ]),
        hints: ["Use % 26 to wrap around", "Handle upper and lower separately", "Leave non-letters unchanged"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 2.3.1`);

  // Verify Chapter 2 is complete
  const chapter2 = await prisma.chapter.findFirst({
    where: { number: 2 },
    include: {
      sections: {
        include: {
          lessons: {
            include: { _count: { select: { exercises: true } } }
          }
        }
      }
    }
  });

  if (chapter2) {
    console.log("\n" + "=".repeat(55));
    console.log("📚 CHAPTER 2 COMPLETE!");
    console.log("=".repeat(55));
    
    let totalLessons = 0;
    let totalExercises = 0;
    
    for (const section of chapter2.sections) {
      console.log(`\n📂 Section ${section.number}: ${section.title}`);
      for (const lesson of section.lessons) {
        console.log(`   📝 ${lesson.number}: ${lesson.title} (${lesson._count.exercises} exercises)`);
        totalLessons++;
        totalExercises += lesson._count.exercises;
      }
    }
    
    console.log("\n" + "-".repeat(55));
    console.log(`Total: ${totalLessons} lessons, ${totalExercises} exercises`);
    console.log("=".repeat(55));
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
