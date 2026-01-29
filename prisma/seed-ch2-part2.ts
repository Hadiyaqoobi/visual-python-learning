import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 2 Part 2: Lessons 2.1.3-2.1.4...\n");

  const section2_1 = await prisma.section.findFirst({ where: { number: 2.1 } });
  if (!section2_1) throw new Error("Section 2.1 not found. Run part 1 first.");

  // ==================== LESSON 2.1.3 ====================
  const lesson2_1_3 = await prisma.lesson.upsert({
    where: { slug: "string-indexing-slicing" },
    update: {},
    create: {
      sectionId: section2_1.id,
      number: 2.13,
      title: "String Indexing and Slicing",
      slug: "string-indexing-slicing",
      objectives: [
        "Access individual characters using indexing",
        "Use positive and negative indices",
        "Extract substrings using slicing",
        "Understand slice parameters: start, stop, step",
      ],
      content: `# String Indexing and Slicing

## Strings Are Sequences

Strings are **ordered sequences** of characters. Each character has a position number called an **index**.

\`\`\`
String:  P  y  t  h  o  n
Index:   0  1  2  3  4  5
        -6 -5 -4 -3 -2 -1  (negative indices)
\`\`\`

## Indexing: Accessing Single Characters

Use square brackets \`[]\` with an index to get one character:

\`\`\`python
text = "Python"
text[0]   # 'P' - first character
text[1]   # 'y' - second character
text[5]   # 'n' - last character (index 5)
\`\`\`

**Key rule**: Indexing starts at 0, not 1!

### Negative Indexing

Negative indices count from the end:

\`\`\`python
text = "Python"
text[-1]  # 'n' - last character
text[-2]  # 'o' - second to last
text[-6]  # 'P' - first character (same as text[0])
\`\`\`

**Why negative indexing?**
- Easy access to end: \`text[-1]\` always gets last character
- No need to know length: Works regardless of string size
- Common pattern: \`filename[-4:]\` gets file extension

### Index Errors

Accessing an index that doesn't exist raises an error:

\`\`\`python
text = "Python"  # length 6, valid indices: 0-5 or -6 to -1
text[6]   # IndexError! (only goes to 5)
text[100] # IndexError!
\`\`\`

## Slicing: Extracting Substrings

Slicing extracts a **portion** of a string using \`[start:stop]\`:

\`\`\`python
text = "Python"
text[0:3]   # "Pyt" - characters 0, 1, 2 (stop NOT included!)
text[2:5]   # "tho" - characters 2, 3, 4
\`\`\`

**Critical rule**: The stop index is **NOT included**!

### Slice Shortcuts

Omit start or stop for convenience:

\`\`\`python
text = "Python"
text[:3]   # "Pyt" - from beginning to index 3 (exclusive)
text[3:]   # "hon" - from index 3 to end
text[:]    # "Python" - entire string (copy)
\`\`\`

### Slice with Step

Add a third parameter for step size: \`[start:stop:step]\`

\`\`\`python
text = "Python"
text[0:6:2]  # "Pto" - every 2nd character
text[::2]    # "Pto" - same, using defaults
text[::-1]   # "nohtyP" - REVERSE the string!
\`\`\`

**Negative step** reverses direction:
- \`text[::-1]\` is the classic Python string reversal trick!

### Slicing Never Causes Errors

Unlike indexing, slicing handles out-of-range gracefully:

\`\`\`python
text = "Hi"
text[0:100]  # "Hi" - just returns what exists
text[50:100] # "" - empty string (nothing in that range)
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "indexing-basics",
          title: "Basic Indexing",
          code: `text = "Python"

# Positive indices (from start)
print(text[0])  # P - first character
print(text[1])  # y - second character
print(text[5])  # n - sixth character (last)

# Negative indices (from end)
print(text[-1])  # n - last character
print(text[-2])  # o - second to last
print(text[-6])  # P - first character

# Getting first and last
word = "Hello"
first = word[0]
last = word[-1]
print(f"First: {first}, Last: {last}")  # First: H, Last: o

# Index must be within range
# text[6]  # IndexError! Index out of range
# text[100]  # IndexError!

# Check length before accessing
if len(text) > 3:
    print(text[3])  # Safe access`,
          description: "Accessing individual characters",
        },
        {
          id: "slicing-basics",
          title: "Basic Slicing",
          code: `text = "Python Programming"

# Basic slices [start:stop]
print(text[0:6])   # "Python" - chars 0,1,2,3,4,5
print(text[7:18])  # "Programming"

# Remember: stop is NOT included!
print(text[0:1])   # "P" - just one character

# Omitting start or stop
print(text[:6])    # "Python" - from beginning
print(text[7:])    # "Programming" - to end
print(text[:])     # "Python Programming" - entire copy

# Negative indices in slices
print(text[-11:])  # "Programming" - last 11 chars
print(text[:-12])  # "Python" - all but last 12

# Combining positive and negative
print(text[0:-12])  # "Python"
print(text[-11:-1]) # "Programmin" (not including last)`,
          description: "Extracting substrings",
        },
        {
          id: "slice-step",
          title: "Slicing with Step",
          code: `text = "Python"

# Every 2nd character
print(text[::2])   # "Pto" (P-t-o)
print(text[1::2])  # "yhn" (y-h-n)

# Every 3rd character
alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
print(alphabet[::3])  # "ADGJMPSVY"

# REVERSE a string with [::-1]
print(text[::-1])     # "nohtyP"

# Reverse with step
print(text[::-2])     # "nhy" (reverse, every 2nd)

# Practical: Check if palindrome
word = "radar"
is_palindrome = word == word[::-1]
print(f"'{word}' is palindrome: {is_palindrome}")  # True

word2 = "hello"
is_palindrome2 = word2 == word2[::-1]
print(f"'{word2}' is palindrome: {is_palindrome2}")  # False`,
          description: "Using step parameter",
        },
        {
          id: "practical-slicing",
          title: "Practical Slicing Examples",
          code: `# Extract parts of data
email = "alice@example.com"
at_pos = email.find("@")  # Find @ position
username = email[:at_pos]
domain = email[at_pos+1:]
print(f"Username: {username}")  # alice
print(f"Domain: {domain}")      # example.com

# File extension
filename = "document.pdf"
extension = filename[-3:]
print(f"Extension: {extension}")  # pdf

# Or more robust (find last dot)
filename2 = "my.file.name.txt"
dot_pos = filename2.rfind(".")
extension2 = filename2[dot_pos+1:]
print(f"Extension: {extension2}")  # txt

# First and last name
full_name = "John Smith"
space_pos = full_name.find(" ")
first_name = full_name[:space_pos]
last_name = full_name[space_pos+1:]
print(f"First: {first_name}, Last: {last_name}")

# Truncate with ellipsis
long_text = "This is a very long sentence that needs truncating"
max_length = 20
if len(long_text) > max_length:
    truncated = long_text[:max_length-3] + "..."
    print(truncated)  # "This is a very lo..."`,
          description: "Real-world slicing patterns",
        },
      ]),
      keyPoints: [
        "Indexing starts at 0, not 1",
        "Negative indices count from end: -1 is last character",
        "Slicing: [start:stop] - stop is NOT included",
        "Omit start to begin from 0, omit stop to go to end",
        "Step parameter: [start:stop:step]",
        "Reverse string with [::-1]",
        "Indexing out of range raises IndexError",
        "Slicing out of range returns empty string (no error)",
      ],
      hardwareDemo: "Watch index calculation map to memory addresses. See how slicing creates new string objects.",
      estimatedTime: 30,
      difficulty: "BEGINNER",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson2_1_3.number}: ${lesson2_1_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson2_1_3.id,
        number: 1,
        title: "First and Last",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given the string `word = 'Programming'`, extract and print the first character and the last character on separate lines.",
        starterCode: `word = 'Programming'

# Get first character
first = 

# Get last character  
last = 

print(first)
print(last)`,
        solution: `word = 'Programming'

first = word[0]
last = word[-1]

print(first)  # P
print(last)   # g`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "P\ng", description: "First and last characters" },
        ]),
        hints: ["First character is at index 0", "Last character is at index -1", "Use square brackets []"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson2_1_3.id,
        number: 2,
        title: "Extract Substring",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given `text = 'Hello World'`, use slicing to extract just the word 'Hello' (first 5 characters) and just 'World' (last 5 characters).",
        starterCode: `text = 'Hello World'

# Extract 'Hello' (first 5 characters)
hello = 

# Extract 'World' (last 5 characters)
world = 

print(hello)
print(world)`,
        solution: `text = 'Hello World'

hello = text[:5]    # or text[0:5]
world = text[-5:]   # or text[6:]

print(hello)  # Hello
print(world)  # World`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Hello\nWorld", description: "Two words extracted" },
        ]),
        hints: ["[:5] gets first 5 characters", "[-5:] gets last 5 characters", "Remember: stop index is NOT included"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson2_1_3.id,
        number: 3,
        title: "Every Other Character",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given `text = 'abcdefghij'`, use slicing with step to print: (1) every 2nd character, (2) every 3rd character, (3) the string reversed.",
        starterCode: `text = 'abcdefghij'

# Every 2nd character
every_second = 

# Every 3rd character
every_third = 

# Reversed
reversed_text = 

print(every_second)
print(every_third)
print(reversed_text)`,
        solution: `text = 'abcdefghij'

every_second = text[::2]    # acegi
every_third = text[::3]     # adgj
reversed_text = text[::-1]  # jihgfedcba

print(every_second)
print(every_third)
print(reversed_text)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "acegi\nadgj\njihgfedcba", description: "Step slicing" },
        ]),
        hints: ["[::2] means start to end, step 2", "[::3] means start to end, step 3", "[::-1] reverses (step -1)"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson2_1_3.id,
        number: 4,
        title: "Palindrome Checker",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function `is_palindrome(word)` that returns True if the word reads the same forwards and backwards, False otherwise. Use slicing to reverse. Test with 'radar' (True) and 'hello' (False).",
        starterCode: `def is_palindrome(word):
    # Compare word with its reverse
    

# Test cases
print(is_palindrome('radar'))   # Should be True
print(is_palindrome('hello'))   # Should be False
print(is_palindrome('level'))   # Should be True
print(is_palindrome('python'))  # Should be False`,
        solution: `def is_palindrome(word):
    return word == word[::-1]

print(is_palindrome('radar'))   # True
print(is_palindrome('hello'))   # False
print(is_palindrome('level'))   # True
print(is_palindrome('python'))  # False`,
        testCases: JSON.stringify([
          { input: "'radar'", expectedOutput: "True", description: "radar is palindrome" },
          { input: "'hello'", expectedOutput: "False", description: "hello is not palindrome" },
        ]),
        hints: ["Reverse with [::-1]", "Compare original to reversed", "Return the comparison result"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson2_1_3.id,
        number: 5,
        title: "Extract File Extension",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write a function `get_extension(filename)` that extracts and returns the file extension (without the dot). Use slicing. Handle filenames like 'document.pdf', 'image.png', 'archive.tar.gz' (return 'gz').",
        starterCode: `def get_extension(filename):
    # Find the last dot and extract everything after it
    

# Test cases
print(get_extension('document.pdf'))    # pdf
print(get_extension('image.png'))       # png
print(get_extension('archive.tar.gz'))  # gz
print(get_extension('README'))          # (empty or handle no extension)`,
        solution: `def get_extension(filename):
    dot_pos = filename.rfind('.')
    if dot_pos == -1:
        return ''  # No extension
    return filename[dot_pos + 1:]

print(get_extension('document.pdf'))    # pdf
print(get_extension('image.png'))       # png
print(get_extension('archive.tar.gz'))  # gz
print(get_extension('README'))          # (empty string)`,
        testCases: JSON.stringify([
          { input: "'document.pdf'", expectedOutput: "pdf", description: "Simple extension" },
          { input: "'archive.tar.gz'", expectedOutput: "gz", description: "Double extension" },
        ]),
        hints: ["Use rfind('.') to find the LAST dot", "rfind returns -1 if not found", "Slice from dot_pos + 1 to end"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 2.1.3`);

  // ==================== LESSON 2.1.4 ====================
  const lesson2_1_4 = await prisma.lesson.upsert({
    where: { slug: "string-methods-part1" },
    update: {},
    create: {
      sectionId: section2_1.id,
      number: 2.14,
      title: "String Methods Part 1 - Case and Whitespace",
      slug: "string-methods-part1",
      objectives: [
        "Use case conversion methods: upper(), lower(), title(), capitalize()",
        "Remove whitespace with strip(), lstrip(), rstrip()",
        "Check string properties with startswith(), endswith()",
        "Understand method syntax: object.method()",
      ],
      content: `# String Methods Part 1

## What Are Methods?

Methods are **functions that belong to objects**. Strings have many built-in methods.

**Syntax**: \`string.method()\`

\`\`\`python
name = "alice"
name.upper()  # "ALICE" - calling upper() method on name
\`\`\`

**Key difference from functions:**
- Function: \`len(name)\` - function takes string as argument
- Method: \`name.upper()\` - method is called ON the string

**Important**: Methods return NEW strings. The original is unchanged (immutability)!

\`\`\`python
name = "alice"
result = name.upper()
print(name)    # "alice" - unchanged!
print(result)  # "ALICE" - new string
\`\`\`

## Case Conversion Methods

### upper() and lower()

Convert entire string to uppercase or lowercase:

\`\`\`python
text = "Hello World"
text.upper()  # "HELLO WORLD"
text.lower()  # "hello world"
\`\`\`

**Common uses:**
- Case-insensitive comparison: \`input.lower() == "yes"\`
- Normalizing data before processing
- Creating consistent output

### title() and capitalize()

\`\`\`python
text = "hello world"
text.title()       # "Hello World" - Each Word Capitalized
text.capitalize()  # "Hello world" - Only first letter
\`\`\`

### swapcase()

Swaps uppercase to lowercase and vice versa:

\`\`\`python
"Hello World".swapcase()  # "hELLO wORLD"
\`\`\`

## Whitespace Methods

### strip(), lstrip(), rstrip()

Remove leading/trailing whitespace (spaces, tabs, newlines):

\`\`\`python
text = "   hello   "
text.strip()   # "hello" - both sides
text.lstrip()  # "hello   " - left only
text.rstrip()  # "   hello" - right only
\`\`\`

**Why strip matters:**
- User input often has extra spaces
- File data may have trailing newlines
- \`"  yes  " != "yes"\` but \`"  yes  ".strip() == "yes"\`

### Removing specific characters

Pass characters to remove:

\`\`\`python
"...hello...".strip(".")      # "hello"
"xxxhelloyyy".strip("xy")     # "hello"
"###title###".strip("#")      # "title"
\`\`\`

## Checking Methods

### startswith() and endswith()

Check if string starts or ends with specific text:

\`\`\`python
filename = "document.pdf"
filename.endswith(".pdf")   # True
filename.endswith(".txt")   # False
filename.startswith("doc")  # True
\`\`\`

**Very useful for:**
- Checking file types
- Validating input format
- Processing specific patterns

### Check multiple options with tuple

\`\`\`python
filename = "image.png"
filename.endswith((".jpg", ".png", ".gif"))  # True - any match
\`\`\`

## Method Chaining

Call multiple methods in sequence:

\`\`\`python
text = "   HELLO WORLD   "
result = text.strip().lower()  # "hello world"

# Step by step:
# text.strip() -> "HELLO WORLD"
# "HELLO WORLD".lower() -> "hello world"
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "case-methods",
          title: "Case Conversion Methods",
          code: `text = "Hello World"

# Basic conversions
print(text.upper())      # HELLO WORLD
print(text.lower())      # hello world
print(text.title())      # Hello World (already is)
print(text.capitalize()) # Hello world (only first char)
print(text.swapcase())   # hELLO wORLD

# Original unchanged!
print(text)  # Hello World

# Practical: case-insensitive comparison
user_input = "YES"
if user_input.lower() == "yes":
    print("User said yes!")

# Practical: normalize names
name = "jOHN sMITH"
proper_name = name.title()
print(proper_name)  # John Smith

# Practical: create constants
constant = "database_connection".upper()
print(constant)  # DATABASE_CONNECTION`,
          description: "Converting string case",
        },
        {
          id: "strip-methods",
          title: "Whitespace Handling",
          code: `# Basic strip
text = "   hello world   "
print(f"Original: '{text}'")
print(f"strip():  '{text.strip()}'")   # 'hello world'
print(f"lstrip(): '{text.lstrip()}'")  # 'hello world   '
print(f"rstrip(): '{text.rstrip()}'")  # '   hello world'

# Stripping specific characters
dotted = "...hello..."
print(dotted.strip("."))  # hello

padded = "###title###"
print(padded.strip("#"))  # title

# Multiple characters to strip
mixed = "xyxHELLOyxy"
print(mixed.strip("xy"))  # HELLO

# Practical: clean user input
user_input = "   yes   \\n"
clean = user_input.strip()
print(f"Cleaned: '{clean}'")  # 'yes'

# Practical: clean file lines
lines = ["  line 1  \\n", "  line 2  \\n", "  line 3  \\n"]
cleaned = [line.strip() for line in lines]
print(cleaned)  # ['line 1', 'line 2', 'line 3']`,
          description: "Removing whitespace and characters",
        },
        {
          id: "checking-methods",
          title: "Checking String Properties",
          code: `# startswith and endswith
filename = "report_2024.pdf"

print(filename.endswith(".pdf"))     # True
print(filename.endswith(".txt"))     # False
print(filename.startswith("report")) # True
print(filename.startswith("data"))   # False

# Check multiple extensions
image = "photo.jpg"
is_image = image.endswith((".jpg", ".png", ".gif", ".bmp"))
print(f"Is image file: {is_image}")  # True

# Practical: file type filtering
files = ["doc.pdf", "img.png", "data.csv", "photo.jpg"]
pdfs = [f for f in files if f.endswith(".pdf")]
images = [f for f in files if f.endswith((".png", ".jpg"))]
print(f"PDFs: {pdfs}")      # ['doc.pdf']
print(f"Images: {images}")  # ['img.png', 'photo.jpg']

# Check URL protocol
url = "https://example.com"
if url.startswith("https://"):
    print("Secure connection")
elif url.startswith("http://"):
    print("Insecure connection")`,
          description: "Checking start and end patterns",
        },
        {
          id: "method-chaining",
          title: "Method Chaining",
          code: `# Chain multiple methods
text = "   HELLO WORLD   "

# Step by step
stripped = text.strip()       # "HELLO WORLD"
lowered = stripped.lower()    # "hello world"
print(lowered)

# Same thing, chained
result = text.strip().lower()
print(result)  # "hello world"

# Longer chains
messy = "   jOHN   sMITH   "
clean_name = messy.strip().title()
print(clean_name)  # "John   Smith"

# Practical: normalize user input
def normalize_input(user_input):
    return user_input.strip().lower()

print(normalize_input("   YES   "))  # "yes"
print(normalize_input("No\\n"))       # "no"

# Practical: clean and check
filename = "   Document.PDF   "
clean = filename.strip()
is_pdf = clean.lower().endswith(".pdf")
print(f"'{clean}' is PDF: {is_pdf}")  # True`,
          description: "Combining multiple methods",
        },
      ]),
      keyPoints: [
        "Methods use dot syntax: string.method()",
        "Methods return NEW strings (original unchanged)",
        "upper(), lower() - convert entire string",
        "title() - Capitalize Each Word",
        "capitalize() - Capitalize first letter only",
        "strip() removes whitespace from both ends",
        "lstrip(), rstrip() - left or right only",
        "startswith(), endswith() - check patterns",
        "Method chaining: text.strip().lower()",
      ],
      hardwareDemo: "Watch method calls create new string objects. See original string unchanged in memory.",
      estimatedTime: 30,
      difficulty: "BEGINNER",
      order: 4,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson2_1_4.number}: ${lesson2_1_4.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson2_1_4.id,
        number: 1,
        title: "Shout and Whisper",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given `message = 'Hello World'`, create two versions: `shouting` (all uppercase) and `whispering` (all lowercase). Print both.",
        starterCode: `message = 'Hello World'

# Create uppercase version
shouting = 

# Create lowercase version
whispering = 

print(shouting)
print(whispering)`,
        solution: `message = 'Hello World'

shouting = message.upper()
whispering = message.lower()

print(shouting)    # HELLO WORLD
print(whispering)  # hello world`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "HELLO WORLD\nhello world", description: "Upper and lower" },
        ]),
        hints: ["Use .upper() for shouting", "Use .lower() for whispering", "Don't forget parentheses ()"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson2_1_4.id,
        number: 2,
        title: "Clean User Input",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given messy user input `user_input = '   YES   '`, clean it up by removing whitespace AND converting to lowercase. Store in `clean_input`.",
        starterCode: `user_input = '   YES   '

# Clean: remove whitespace and make lowercase
clean_input = 

print(f"Original: '{user_input}'")
print(f"Cleaned: '{clean_input}'")`,
        solution: `user_input = '   YES   '

clean_input = user_input.strip().lower()

print(f"Original: '{user_input}'")
print(f"Cleaned: '{clean_input}'")  # 'yes'`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Cleaned: 'yes'", description: "Stripped and lowercased" },
        ]),
        hints: ["Chain .strip() and .lower()", "Order doesn't matter for these two", "Result should be 'yes'"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson2_1_4.id,
        number: 3,
        title: "Name Formatter",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function `format_name(name)` that takes a messy name like '   jOHN sMITH   ' and returns it properly formatted as 'John Smith'.",
        starterCode: `def format_name(name):
    # Strip whitespace and convert to title case
    

# Test cases
print(format_name('   jOHN sMITH   '))  # John Smith
print(format_name('ALICE JONES'))        # Alice Jones
print(format_name('bob'))                # Bob`,
        solution: `def format_name(name):
    return name.strip().title()

print(format_name('   jOHN sMITH   '))  # John Smith
print(format_name('ALICE JONES'))        # Alice Jones
print(format_name('bob'))                # Bob`,
        testCases: JSON.stringify([
          { input: "'   jOHN sMITH   '", expectedOutput: "John Smith", description: "Messy name cleaned" },
          { input: "'bob'", expectedOutput: "Bob", description: "Single name capitalized" },
        ]),
        hints: ["Strip first to remove whitespace", "Then use title() for proper capitalization", "Chain the methods"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson2_1_4.id,
        number: 4,
        title: "File Type Checker",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function `is_image(filename)` that returns True if the filename ends with .jpg, .png, or .gif (case-insensitive). Test with 'photo.JPG', 'doc.pdf', 'image.PNG'.",
        starterCode: `def is_image(filename):
    # Check if file ends with image extensions (case-insensitive)
    

# Test cases
print(is_image('photo.JPG'))   # True
print(is_image('doc.pdf'))     # False
print(is_image('image.PNG'))   # True
print(is_image('pic.gif'))     # True`,
        solution: `def is_image(filename):
    return filename.lower().endswith(('.jpg', '.png', '.gif'))

print(is_image('photo.JPG'))   # True
print(is_image('doc.pdf'))     # False
print(is_image('image.PNG'))   # True
print(is_image('pic.gif'))     # True`,
        testCases: JSON.stringify([
          { input: "'photo.JPG'", expectedOutput: "True", description: "JPG uppercase" },
          { input: "'doc.pdf'", expectedOutput: "False", description: "PDF not image" },
        ]),
        hints: ["Convert to lowercase first for case-insensitive", "Use endswith() with a tuple", "Tuple: ('.jpg', '.png', '.gif')"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson2_1_4.id,
        number: 5,
        title: "Input Validator",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write a function `get_yes_no(prompt)` that keeps asking the user until they enter 'yes' or 'no' (case-insensitive, ignore whitespace). Return the cleaned answer ('yes' or 'no').",
        starterCode: `def get_yes_no(prompt):
    while True:
        answer = input(prompt)
        # Clean the answer and check if it's yes or no
        
        
# Uncomment to test (requires user input)
# result = get_yes_no("Continue? (yes/no): ")
# print(f"You chose: {result}")`,
        solution: `def get_yes_no(prompt):
    while True:
        answer = input(prompt).strip().lower()
        if answer in ('yes', 'no'):
            return answer
        print("Please enter 'yes' or 'no'")

# Test (requires user input)
# result = get_yes_no("Continue? (yes/no): ")
# print(f"You chose: {result}")`,
        testCases: JSON.stringify([
          { input: "Simulated: '  YES  '", expectedOutput: "yes", description: "Accepts messy yes" },
        ]),
        hints: ["Use strip().lower() to clean input", "Check if answer is in ('yes', 'no')", "Loop until valid input"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 2.1.4`);

  console.log("\n✅ Chapter 2 Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
