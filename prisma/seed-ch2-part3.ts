import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 2 Part 3: Lessons 2.1.5-2.1.6...\n");

  const section2_1 = await prisma.section.findFirst({ where: { number: 2.1 } });
  if (!section2_1) throw new Error("Section 2.1 not found.");

  // ==================== LESSON 2.1.5 ====================
  const lesson2_1_5 = await prisma.lesson.upsert({
    where: { slug: "string-methods-part2" },
    update: {},
    create: {
      sectionId: section2_1.id,
      number: 2.15,
      title: "String Methods Part 2 - Find, Replace, Split, Join",
      slug: "string-methods-part2",
      objectives: [
        "Find substrings with find(), index(), count()",
        "Replace text with replace()",
        "Split strings into lists with split()",
        "Join lists into strings with join()",
      ],
      content: `# String Methods Part 2

## Finding Substrings

### find() and rfind()

Search for a substring and return its position:

\`\`\`python
text = "Hello World"
text.find("World")   # 6 (starting index)
text.find("Python")  # -1 (not found)
text.rfind("o")      # 7 (rightmost 'o')
\`\`\`

**find() returns -1 if not found** (no error).

### index() and rindex()

Same as find(), but **raises ValueError if not found**:

\`\`\`python
text = "Hello"
text.index("l")      # 2
text.index("x")      # ValueError!
\`\`\`

**Use find() when substring might not exist. Use index() when it MUST exist.**

### count()

Count occurrences of a substring:

\`\`\`python
text = "banana"
text.count("a")   # 3
text.count("na")  # 2
text.count("x")   # 0
\`\`\`

## Replacing Text

### replace()

Replace occurrences of a substring:

\`\`\`python
text = "Hello World"
text.replace("World", "Python")  # "Hello Python"
text.replace("l", "L")           # "HeLLo WorLd" (all occurrences)
\`\`\`

**Limit replacements with third argument:**

\`\`\`python
"aaa".replace("a", "b", 2)  # "bba" (only first 2)
\`\`\`

**Remember**: Returns NEW string. Original unchanged!

## Splitting Strings

### split()

Split string into a **list** of parts:

\`\`\`python
text = "apple,banana,cherry"
text.split(",")  # ["apple", "banana", "cherry"]

sentence = "Hello World"
sentence.split()  # ["Hello", "World"] (splits on whitespace)
\`\`\`

**Default split() splits on any whitespace** (spaces, tabs, newlines) and removes empty strings.

### splitlines()

Split on line breaks:

\`\`\`python
text = "Line1\\nLine2\\nLine3"
text.splitlines()  # ["Line1", "Line2", "Line3"]
\`\`\`

## Joining Strings

### join()

Opposite of split - combine list into string:

\`\`\`python
words = ["Hello", "World"]
" ".join(words)   # "Hello World"
",".join(words)   # "Hello,World"
"".join(words)    # "HelloWorld"
\`\`\`

**Syntax**: \`separator.join(list)\`

The string you call join() on becomes the separator!

\`\`\`python
"-".join(["2024", "01", "15"])  # "2024-01-15"
"\\n".join(["Line1", "Line2"])   # "Line1\\nLine2"
\`\`\`

## Checking Content

### in operator

Check if substring exists:

\`\`\`python
"World" in "Hello World"  # True
"Python" in "Hello World" # False
\`\`\`

### isdigit(), isalpha(), isalnum()

Check string content:

\`\`\`python
"123".isdigit()    # True (all digits)
"abc".isalpha()    # True (all letters)
"abc123".isalnum() # True (letters and/or digits)
"ab c".isalpha()   # False (space isn't a letter)
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "find-methods",
          title: "Finding Substrings",
          code: `text = "Hello World, Hello Python"

# find() - returns position or -1
print(text.find("Hello"))     # 0 (first occurrence)
print(text.find("Python"))    # 19
print(text.find("Java"))      # -1 (not found)

# rfind() - search from right
print(text.rfind("Hello"))    # 13 (last occurrence)

# index() - raises error if not found
print(text.index("World"))    # 6
# text.index("Java")          # ValueError!

# count() - count occurrences
print(text.count("Hello"))    # 2
print(text.count("o"))        # 4
print(text.count("xyz"))      # 0

# Practical: check before using
search = "Python"
pos = text.find(search)
if pos != -1:
    print(f"Found '{search}' at position {pos}")
else:
    print(f"'{search}' not found")

# Find with start position
print(text.find("o"))         # 4 (first 'o')
print(text.find("o", 5))      # 7 (first 'o' after position 5)`,
          description: "Searching within strings",
        },
        {
          id: "replace-method",
          title: "Replacing Text",
          code: `# Basic replace
text = "Hello World"
new_text = text.replace("World", "Python")
print(new_text)  # Hello Python
print(text)      # Hello World (unchanged!)

# Replace all occurrences
text2 = "banana"
print(text2.replace("a", "o"))  # bonono

# Limit replacements
text3 = "aaa bbb aaa"
print(text3.replace("a", "X"))     # XXX bbb XXX (all)
print(text3.replace("a", "X", 2))  # XXa bbb aaa (first 2)

# Practical: clean data
phone = "(555) 123-4567"
clean_phone = phone.replace("(", "").replace(")", "").replace("-", "").replace(" ", "")
print(clean_phone)  # 5551234567

# Practical: simple template
template = "Hello {name}, welcome to {place}!"
message = template.replace("{name}", "Alice").replace("{place}", "Python")
print(message)  # Hello Alice, welcome to Python!`,
          description: "Replacing substrings",
        },
        {
          id: "split-method",
          title: "Splitting Strings",
          code: `# Split on delimiter
csv_line = "apple,banana,cherry"
fruits = csv_line.split(",")
print(fruits)  # ['apple', 'banana', 'cherry']

# Split on whitespace (default)
sentence = "Hello   World"
words = sentence.split()  # Splits on ANY whitespace
print(words)  # ['Hello', 'World']

# Split with explicit space
words2 = sentence.split(" ")  # Keeps empty strings
print(words2)  # ['Hello', '', '', 'World']

# Limit splits
data = "a-b-c-d-e"
print(data.split("-"))      # ['a', 'b', 'c', 'd', 'e']
print(data.split("-", 2))   # ['a', 'b', 'c-d-e'] (only 2 splits)

# splitlines() for multi-line
text = """Line 1
Line 2
Line 3"""
lines = text.splitlines()
print(lines)  # ['Line 1', 'Line 2', 'Line 3']

# Practical: parse CSV
row = "John,25,Engineer"
name, age, job = row.split(",")
print(f"{name} is a {age}-year-old {job}")`,
          description: "Breaking strings into lists",
        },
        {
          id: "join-method",
          title: "Joining Lists into Strings",
          code: `# Basic join
words = ["Hello", "World"]
sentence = " ".join(words)
print(sentence)  # "Hello World"

# Different separators
print(",".join(words))    # "Hello,World"
print("-".join(words))    # "Hello-World"
print("".join(words))     # "HelloWorld"
print("\\n".join(words))   # "Hello\\nWorld" (two lines)

# Join numbers (must convert to strings!)
numbers = [1, 2, 3, 4, 5]
# "-".join(numbers)  # TypeError!
number_strings = [str(n) for n in numbers]
result = "-".join(number_strings)
print(result)  # "1-2-3-4-5"

# Practical: create path
parts = ["home", "user", "documents"]
path = "/".join(parts)
print(path)  # "home/user/documents"

# Practical: format date
date_parts = ["2024", "01", "15"]
print("-".join(date_parts))  # "2024-01-15"
print("/".join(date_parts))  # "2024/01/15"

# Round-trip: split then join
original = "a,b,c,d"
parts = original.split(",")
back = ",".join(parts)
print(original == back)  # True`,
          description: "Combining lists into strings",
        },
      ]),
      keyPoints: [
        "find() returns -1 if not found; index() raises error",
        "rfind(), rindex() search from right",
        "count() counts occurrences",
        "replace(old, new) replaces ALL occurrences",
        "replace(old, new, count) limits replacements",
        "split() breaks string into list",
        "split() with no argument splits on whitespace",
        "join() combines list into string: separator.join(list)",
        "in operator: 'sub' in 'string' returns True/False",
      ],
      hardwareDemo: "Watch split() create list of new string objects. See join() allocate new combined string.",
      estimatedTime: 35,
      difficulty: "INTERMEDIATE",
      order: 5,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson2_1_5.number}: ${lesson2_1_5.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson2_1_5.id,
        number: 1,
        title: "Count Characters",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given `text = 'Mississippi'`, count how many times the letter 'i' appears and how many times 'ss' appears.",
        starterCode: `text = 'Mississippi'

# Count 'i'
count_i = 

# Count 'ss'
count_ss = 

print(f"Letter 'i' appears {count_i} times")
print(f"'ss' appears {count_ss} times")`,
        solution: `text = 'Mississippi'

count_i = text.count('i')
count_ss = text.count('ss')

print(f"Letter 'i' appears {count_i} times")  # 4
print(f"'ss' appears {count_ss} times")       # 2`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "4 times\n2 times", description: "Correct counts" },
        ]),
        hints: ["Use the count() method", "text.count('i') counts letter i", "count() works with substrings too"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson2_1_5.id,
        number: 2,
        title: "Replace Words",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given `text = 'I love cats. Cats are great.'`, replace all occurrences of 'cats' and 'Cats' with 'dogs' and 'Dogs' respectively.",
        starterCode: `text = 'I love cats. Cats are great.'

# Replace cats with dogs (case-sensitive!)
result = 

print(result)`,
        solution: `text = 'I love cats. Cats are great.'

result = text.replace('cats', 'dogs').replace('Cats', 'Dogs')

print(result)  # I love dogs. Dogs are great.`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "I love dogs. Dogs are great.", description: "Both replaced" },
        ]),
        hints: ["replace() is case-sensitive", "Chain two replace() calls", "Replace 'cats' and 'Cats' separately"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson2_1_5.id,
        number: 3,
        title: "Parse CSV Line",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given a CSV line `data = 'Alice,25,Engineer,Boston'`, split it and print each field with its label: Name, Age, Job, City.",
        starterCode: `data = 'Alice,25,Engineer,Boston'

# Split the data
parts = 

# Assign to variables
name = 
age = 
job = 
city = 

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Job: {job}")
print(f"City: {city}")`,
        solution: `data = 'Alice,25,Engineer,Boston'

parts = data.split(',')

name = parts[0]
age = parts[1]
job = parts[2]
city = parts[3]

# Or unpack directly:
# name, age, job, city = data.split(',')

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Job: {job}")
print(f"City: {city}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Name: Alice\nAge: 25", description: "Fields extracted" },
        ]),
        hints: ["Split on comma: split(',')", "Result is a list", "Access by index: parts[0], parts[1], etc."],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson2_1_5.id,
        number: 4,
        title: "Create Path",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function `make_path(parts)` that takes a list of folder names and joins them with '/' to create a file path. Example: `make_path(['home', 'user', 'docs'])` returns `'home/user/docs'`.",
        starterCode: `def make_path(parts):
    # Join parts with '/'
    

# Test cases
print(make_path(['home', 'user', 'docs']))
print(make_path(['var', 'log', 'app.log']))
print(make_path(['single']))`,
        solution: `def make_path(parts):
    return '/'.join(parts)

print(make_path(['home', 'user', 'docs']))     # home/user/docs
print(make_path(['var', 'log', 'app.log']))    # var/log/app.log
print(make_path(['single']))                    # single`,
        testCases: JSON.stringify([
          { input: "['home', 'user', 'docs']", expectedOutput: "home/user/docs", description: "Three parts" },
          { input: "['single']", expectedOutput: "single", description: "Single part" },
        ]),
        hints: ["Use join() method", "Call it on the separator: '/'.join(...)", "The list goes inside join()"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson2_1_5.id,
        number: 5,
        title: "Word Analyzer",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write a function `analyze_text(text)` that returns a dictionary with: 'words' (count), 'chars' (count without spaces), and 'unique_words' (count of unique words, case-insensitive).",
        starterCode: `def analyze_text(text):
    # Calculate statistics
    
    
    return {
        'words': word_count,
        'chars': char_count,
        'unique_words': unique_count
    }

# Test
result = analyze_text("Hello World hello")
print(result)
# Should be: {'words': 3, 'chars': 15, 'unique_words': 2}`,
        solution: `def analyze_text(text):
    words = text.split()
    word_count = len(words)
    char_count = len(text.replace(' ', ''))
    unique_words = len(set(word.lower() for word in words))
    
    return {
        'words': word_count,
        'chars': char_count,
        'unique_words': unique_words
    }

result = analyze_text("Hello World hello")
print(result)  # {'words': 3, 'chars': 15, 'unique_words': 2}`,
        testCases: JSON.stringify([
          { input: "'Hello World hello'", expectedOutput: "{'words': 3, 'chars': 15, 'unique_words': 2}", description: "Basic analysis" },
        ]),
        hints: ["split() gives list of words", "len() counts items", "set() removes duplicates", "Convert to lower for case-insensitive unique"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 2.1.5`);

  // ==================== LESSON 2.1.6 ====================
  const lesson2_1_6 = await prisma.lesson.upsert({
    where: { slug: "string-immutability" },
    update: {},
    create: {
      sectionId: section2_1.id,
      number: 2.16,
      title: "String Immutability",
      slug: "string-immutability",
      objectives: [
        "Understand that strings cannot be changed after creation",
        "Learn why immutability matters",
        "Work around immutability with reassignment",
        "Recognize immutability errors",
      ],
      content: `# String Immutability

## What Is Immutability?

**Immutable** means "cannot be changed after creation."

Strings in Python are immutable. Once created, you cannot modify the characters inside.

\`\`\`python
text = "Hello"
text[0] = "h"  # TypeError: 'str' object does not support item assignment
\`\`\`

## Why Can't I Change Characters?

This is a **design decision** in Python. It provides:

1. **Safety**: Strings can't be accidentally corrupted
2. **Efficiency**: Python can optimize memory for identical strings
3. **Hashability**: Strings can be dictionary keys
4. **Thread safety**: Multiple parts of program can share strings safely

## Methods Return NEW Strings

Every string method creates a new string:

\`\`\`python
text = "hello"
result = text.upper()

print(text)    # "hello" - UNCHANGED!
print(result)  # "HELLO" - new string
\`\`\`

The original \`text\` is never modified. \`upper()\` creates and returns a new string.

## Working Around Immutability

### Reassignment

Assign the result back to the same variable:

\`\`\`python
text = "hello"
text = text.upper()  # Reassign to same variable
print(text)  # "HELLO"
\`\`\`

This doesn't change the original string - it creates a new one and points the variable to it.

### Building Strings Piece by Piece

For multiple modifications, build a new string:

\`\`\`python
# Method 1: Concatenation (slow for many operations)
result = ""
for char in "hello":
    result = result + char.upper()

# Method 2: List then join (faster)
chars = list("hello")  # Convert to list (mutable!)
chars[0] = "H"         # Modify the list
result = "".join(chars) # Convert back to string
\`\`\`

### Replace Instead of Modify

\`\`\`python
text = "Hello World"
# Can't do: text[0] = "h"

# Instead, use replace or slicing:
text = "h" + text[1:]  # "hello World"
# Or
text = text.replace("H", "h", 1)  # "hello World"
\`\`\`

## Memory Visualization

\`\`\`
text = "Hello"

Memory:
  text → [H][e][l][l][o]  (Address 1000)

text = text.upper()

Memory:
  text → [H][E][L][L][O]  (Address 2000) ← NEW string!
         [H][e][l][l][o]  (Address 1000) ← Old string (may be garbage collected)
\`\`\`

## Common Mistakes

\`\`\`python
# Mistake 1: Forgetting to assign result
text = "hello"
text.upper()      # Creates "HELLO" but throws it away!
print(text)       # Still "hello"!

# Fix:
text = text.upper()

# Mistake 2: Trying to modify in place
name = "alice"
name[0] = "A"     # TypeError!

# Fix:
name = "A" + name[1:]
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "immutability-demo",
          title: "Demonstrating Immutability",
          code: `# Strings cannot be modified
text = "Hello"

# This causes an error:
# text[0] = "h"  # TypeError: 'str' object does not support item assignment

# Methods return NEW strings
original = "hello"
upper_version = original.upper()

print(f"Original: {original}")     # hello (unchanged!)
print(f"Upper: {upper_version}")   # HELLO (new string)

# The id() function shows memory address
print(f"Original ID: {id(original)}")
print(f"Upper ID: {id(upper_version)}")
# Different IDs = different objects in memory!

# Variables can be reassigned
text = "hello"
print(f"Before: {text}, ID: {id(text)}")

text = text.upper()  # Reassigning variable to new string
print(f"After: {text}, ID: {id(text)}")
# Different ID - it's a completely new string object!`,
          description: "Understanding immutability",
        },
        {
          id: "common-mistake",
          title: "Common Immutability Mistakes",
          code: `# MISTAKE 1: Forgetting to save the result
name = "alice"
name.upper()      # This does nothing useful!
print(name)       # Still "alice"

# FIX: Assign the result
name = "alice"
name = name.upper()
print(name)       # "ALICE"

# MISTAKE 2: Multiple methods without chaining
text = "  hello world  "
text.strip()      # Lost!
text.title()      # Also lost!
print(text)       # Still "  hello world  "

# FIX: Chain or reassign each step
text = "  hello world  "
text = text.strip().title()
print(text)       # "Hello World"

# MISTAKE 3: Thinking replace modifies original
message = "Hello World"
message.replace("World", "Python")
print(message)    # Still "Hello World"!

# FIX:
message = "Hello World"
message = message.replace("World", "Python")
print(message)    # "Hello Python"`,
          description: "Avoiding common mistakes",
        },
        {
          id: "workarounds",
          title: "Working Around Immutability",
          code: `# Approach 1: Reassignment
text = "hello"
text = "H" + text[1:]  # Replace first character
print(text)  # "Hello"

# Approach 2: Convert to list (lists are mutable!)
original = "hello"
char_list = list(original)  # ['h', 'e', 'l', 'l', 'o']
char_list[0] = 'H'          # Modify list
char_list[2] = 'L'          # Modify another
result = ''.join(char_list) # Back to string
print(result)  # "HeLlo"

# Approach 3: Build with join (efficient for many parts)
parts = []
for i, char in enumerate("hello"):
    if i == 0:
        parts.append(char.upper())
    else:
        parts.append(char)
result = ''.join(parts)
print(result)  # "Hello"

# Approach 4: Use replace
text = "hello world"
text = text.replace("world", "Python")
print(text)  # "hello Python"

# Approach 5: Slicing to reconstruct
text = "Hello World"
# Change character at index 6
text = text[:6] + "P" + text[7:]  # Replace 'W' with 'P'
print(text)  # "Hello Porld"`,
          description: "Strategies for modifying strings",
        },
        {
          id: "why-immutability",
          title: "Why Immutability Is Good",
          code: `# Benefit 1: String interning (memory optimization)
a = "hello"
b = "hello"
print(a is b)  # True! Python reuses the same object

# Benefit 2: Safe to share
def process(text):
    # Can't accidentally modify the caller's string
    result = text.upper()
    return result

original = "hello"
processed = process(original)
print(original)   # "hello" - safe!
print(processed)  # "HELLO"

# Benefit 3: Can be dictionary keys
# (mutable objects can't be dict keys)
word_counts = {}
word_counts["hello"] = 5
word_counts["world"] = 3
print(word_counts)

# Benefit 4: Predictable behavior
text = "constant"
# You can always trust that 'text' contains "constant"
# No other code can change it out from under you

# Compare to lists (mutable):
my_list = [1, 2, 3]
def bad_function(lst):
    lst[0] = 999  # Modifies the original!

bad_function(my_list)
print(my_list)  # [999, 2, 3] - Changed!`,
          description: "Benefits of immutability",
        },
      ]),
      keyPoints: [
        "Strings are immutable - cannot be changed after creation",
        "string[0] = 'x' raises TypeError",
        "All string methods return NEW strings",
        "Must assign result: text = text.upper()",
        "Forgetting to assign is a common bug",
        "Convert to list for character-level modifications",
        "Use slicing and concatenation to 'modify' strings",
        "Immutability provides safety and efficiency",
      ],
      hardwareDemo: "Watch string methods allocate new memory. See old string remain unchanged. Visualize garbage collection of unreferenced strings.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 6,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson2_1_6.number}: ${lesson2_1_6.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson2_1_6.id,
        number: 1,
        title: "Spot the Bug",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "What's wrong with this code?\n```python\nname = 'alice'\nname.upper()\nprint(name)\n```\nIt prints 'alice' instead of 'ALICE'.",
        starterCode: "",
        solution: "The result of name.upper() is not saved. Fix: name = name.upper()",
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Result not assigned", description: "Identify the bug" },
        ]),
        hints: ["String methods return NEW strings", "The original is unchanged", "You must assign the result"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson2_1_6.id,
        number: 2,
        title: "Fix the Mutation Error",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "This code tries to change the first letter to uppercase but causes an error. Fix it WITHOUT using the capitalize() method.",
        starterCode: `name = 'alice'

# This causes TypeError:
# name[0] = 'A'

# Fix it using slicing and concatenation:
name = 

print(name)  # Should print 'Alice'`,
        solution: `name = 'alice'

name = 'A' + name[1:]

print(name)  # Alice`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Alice", description: "First letter capitalized" },
        ]),
        hints: ["Can't modify strings directly", "Create a new string instead", "Concatenate 'A' with name[1:]"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson2_1_6.id,
        number: 3,
        title: "Method Chain Fix",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "This code should clean and format a name but doesn't work. Fix it so it outputs 'John Smith'.",
        starterCode: `name = '   john smith   '

# Bug: Results not saved!
name.strip()
name.title()

print(name)  # Currently prints '   john smith   '`,
        solution: `name = '   john smith   '

name = name.strip().title()

print(name)  # John Smith`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "John Smith", description: "Name cleaned and formatted" },
        ]),
        hints: ["Chain the methods together", "Assign result back to name", "text = text.strip().title()"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson2_1_6.id,
        number: 4,
        title: "Replace Character at Index",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function `replace_at(text, index, new_char)` that returns a new string with the character at `index` replaced with `new_char`. Handle negative indices too.",
        starterCode: `def replace_at(text, index, new_char):
    # Return new string with character replaced
    

# Test cases
print(replace_at('hello', 0, 'H'))   # Hello
print(replace_at('hello', -1, 'O'))  # hellO
print(replace_at('world', 2, 'R'))   # woRld`,
        solution: `def replace_at(text, index, new_char):
    # Handle negative indices by converting to positive
    if index < 0:
        index = len(text) + index
    return text[:index] + new_char + text[index + 1:]

print(replace_at('hello', 0, 'H'))   # Hello
print(replace_at('hello', -1, 'O'))  # hellO
print(replace_at('world', 2, 'R'))   # woRld`,
        testCases: JSON.stringify([
          { input: "'hello', 0, 'H'", expectedOutput: "Hello", description: "First character" },
          { input: "'hello', -1, 'O'", expectedOutput: "hellO", description: "Last character" },
        ]),
        hints: ["Use slicing: text[:index] + new_char + text[index+1:]", "Negative indices work with slicing", "Convert negative to positive for clarity"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson2_1_6.id,
        number: 5,
        title: "Censor Words",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write a function `censor(text, word)` that replaces all occurrences of `word` with asterisks (*) of the same length. Make it case-insensitive but preserve the original case pattern.",
        starterCode: `def censor(text, word):
    # Replace word with asterisks (case-insensitive)
    

# Test cases
print(censor('Hello World', 'world'))      # Hello *****
print(censor('Bad BAD bad', 'bad'))        # *** *** ***
print(censor('Nothing to censor', 'xyz'))  # Nothing to censor`,
        solution: `def censor(text, word):
    result = text
    word_lower = word.lower()
    asterisks = '*' * len(word)
    
    # Find and replace all case variants
    i = 0
    while i < len(result):
        if result[i:i+len(word)].lower() == word_lower:
            result = result[:i] + asterisks + result[i+len(word):]
        i += 1
    return result

# Alternative using replace (simpler but less precise):
def censor_simple(text, word):
    import re
    return re.sub(word, '*' * len(word), text, flags=re.IGNORECASE)

print(censor('Hello World', 'world'))      # Hello *****
print(censor('Bad BAD bad', 'bad'))        # *** *** ***
print(censor('Nothing to censor', 'xyz'))  # Nothing to censor`,
        testCases: JSON.stringify([
          { input: "'Hello World', 'world'", expectedOutput: "Hello *****", description: "Case insensitive" },
          { input: "'Bad BAD bad', 'bad'", expectedOutput: "*** *** ***", description: "Multiple occurrences" },
        ]),
        hints: ["Create asterisks: '*' * len(word)", "Case-insensitive: compare lowercase versions", "Build new string as you find matches"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 2.1.6`);

  console.log("\n✅ Chapter 2 Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
