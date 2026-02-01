const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🐍 COMPLETE PYTHON MASTERY SEED");
  console.log("================================\n");

  // ============================================================
  // CHAPTER 2: WHILE LOOPS
  // ============================================================
  console.log("📝 Chapter 2: Adding While Loops...");
  
  const ch2Section = await prisma.section.findFirst({
    where: { chapter: { number: 2 } },
    orderBy: { order: 'desc' }
  });

  if (ch2Section) {
    const whileLesson = await prisma.lesson.create({
      data: {
        sectionId: ch2Section.id,
        number: 2.9,
        slug: 'while-loops-iteration',
        title: 'While Loops - Repeating Until a Condition',
        order: 15,
        estimatedTime: 20,
        difficulty: 'BEGINNER',
        isPublished: true,
        objectives: ['Use while loops', 'Avoid infinite loops', 'Use break and continue'],
        keyPoints: ['while condition:', 'infinite loops', 'break', 'continue'],
        content: `# While Loops

While loops repeat code **until a condition becomes False**.

## Basic Syntax
\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

## When to Use While vs For
- **FOR**: Known iterations, sequences
- **WHILE**: Unknown iterations, waiting for condition

## Break and Continue
\`\`\`python
while True:
    cmd = input("Command: ")
    if cmd == 'quit':
        break
    print(f"Running: {cmd}")
\`\`\`

## Avoid Infinite Loops!
Always ensure your condition eventually becomes False.`,
        codeExamples: []
      }
    });
    console.log("  ✅ Created: While Loops lesson");

    await prisma.exercise.createMany({
      data: [
        {
          lessonId: whileLesson.id, number: 1, order: 1,
          title: "Countdown",
          prompt: "Write a while loop counting from 10 to 1, then print 'Liftoff!'",
          type: "CODE", difficulty: "BEGINNER", xpReward: 10,
          starterCode: "count = 10\n# Your while loop here\nprint('Liftoff!')",
          solution: "count = 10\nwhile count >= 1:\n    print(count)\n    count -= 1\nprint('Liftoff!')",
          hints: ["Loop while count >= 1", "Decrement count each iteration"]
        },
        {
          lessonId: whileLesson.id, number: 2, order: 2,
          title: "Guess the Number",
          prompt: "Keep asking for guesses until they guess 7",
          type: "CODE", difficulty: "BEGINNER", xpReward: 15,
          starterCode: "secret = 7\nguess = 0\n# Keep asking until correct",
          solution: "secret = 7\nguess = int(input('Guess: '))\nwhile guess != secret:\n    print('Try again')\n    guess = int(input('Guess: '))\nprint('Correct!')",
          hints: ["Loop while guess != secret"]
        },
        {
          lessonId: whileLesson.id, number: 3, order: 3,
          title: "Break Output",
          prompt: "What does this print?\ni = 0\nwhile i < 5:\n    i += 1\n    if i == 3: continue\n    print(i)",
          type: "PREDICT_OUTPUT", difficulty: "BEGINNER", xpReward: 10,
          starterCode: null,
          solution: "1\n2\n4\n5",
          hints: ["continue skips 3"]
        }
      ]
    });
    console.log("  ✅ Added 3 exercises");
  }

  // ============================================================
  // CHAPTER 4: MODULES & FILES
  // ============================================================
  console.log("\n📝 Chapter 4: Adding Modules & Files...");

  const ch4Section = await prisma.section.findFirst({
    where: { chapter: { number: 4 } },
    orderBy: { order: 'desc' }
  });

  if (ch4Section) {
    // Lesson 1: Modules
    const modulesLesson = await prisma.lesson.create({
      data: {
        sectionId: ch4Section.id,
        number: 4.10,
        slug: 'python-modules-intro',
        title: 'Introduction to Modules',
        order: 20, estimatedTime: 25, difficulty: 'BEGINNER', isPublished: true,
        objectives: ['Import modules', 'Use standard library'],
        keyPoints: ['import', 'from...import', 'as alias'],
        content: `# Modules

## Importing
\`\`\`python
import math
print(math.sqrt(16))

from math import sqrt, pi
print(sqrt(16))

import math as m
print(m.pi)
\`\`\`

## Standard Library
\`\`\`python
import random
import datetime
import os
import json
\`\`\``,
        codeExamples: []
      }
    });
    console.log("  ✅ Created: Modules lesson");

    await prisma.exercise.createMany({
      data: [
        {
          lessonId: modulesLesson.id, number: 1, order: 1,
          title: "Import Math",
          prompt: "Import math and calculate sqrt(144)",
          type: "CODE", difficulty: "BEGINNER", xpReward: 10,
          starterCode: "# Import math\n\nresult = \nprint(result)",
          solution: "import math\nresult = math.sqrt(144)\nprint(result)",
          hints: ["Use math.sqrt()"]
        },
        {
          lessonId: modulesLesson.id, number: 2, order: 2,
          title: "From Import",
          prompt: "Import only randint from random",
          type: "CODE", difficulty: "BEGINNER", xpReward: 10,
          starterCode: "# Import randint only\n\nnum = randint(1, 100)\nprint(num)",
          solution: "from random import randint\nnum = randint(1, 100)\nprint(num)",
          hints: ["from random import randint"]
        }
      ]
    });
    console.log("  ✅ Added 2 exercises");

    // Lesson 2: Creating Modules
    const createModLesson = await prisma.lesson.create({
      data: {
        sectionId: ch4Section.id,
        number: 4.11,
        slug: 'creating-modules-python',
        title: 'Creating Your Own Modules',
        order: 21, estimatedTime: 20, difficulty: 'BEGINNER', isPublished: true,
        objectives: ['Create modules', 'Use __name__'],
        keyPoints: ['__name__', '__main__', 'docstrings'],
        content: `# Creating Modules

Any .py file is a module!

## my_utils.py
\`\`\`python
def greet(name):
    return f"Hello, {name}!"

PI = 3.14159
\`\`\`

## Using It
\`\`\`python
import my_utils
print(my_utils.greet("World"))
\`\`\`

## The __name__ Guard
\`\`\`python
if __name__ == "__main__":
    # Only runs when executed directly
    main()
\`\`\``,
        codeExamples: []
      }
    });
    console.log("  ✅ Created: Creating Modules lesson");

    await prisma.exercise.create({
      data: {
        lessonId: createModLesson.id, number: 1, order: 1,
        title: "__name__ Value",
        prompt: "What is __name__ when a module is imported?",
        type: "MULTIPLE_CHOICE", difficulty: "BEGINNER", xpReward: 5,
        starterCode: null,
        solution: "The module's name (not '__main__')",
        hints: ["Only '__main__' when run directly"]
      }
    });
    console.log("  ✅ Added 1 exercise");

    // Lesson 3: Files
    const filesLesson = await prisma.lesson.create({
      data: {
        sectionId: ch4Section.id,
        number: 4.12,
        slug: 'reading-writing-files-python',
        title: 'Reading and Writing Files',
        order: 22, estimatedTime: 25, difficulty: 'BEGINNER', isPublished: true,
        objectives: ['Read files', 'Write files', 'Use with statement'],
        keyPoints: ['open()', 'with statement', 'read/write modes'],
        content: `# File I/O

## Always Use with Statement
\`\`\`python
with open('data.txt', 'r') as f:
    content = f.read()
# File auto-closed!

with open('output.txt', 'w') as f:
    f.write("Hello!")
\`\`\`

## Modes
- 'r': Read
- 'w': Write (overwrites)
- 'a': Append

## Reading
\`\`\`python
content = f.read()      # Entire file
line = f.readline()     # One line
for line in f:          # Iterate lines
    print(line.strip())
\`\`\``,
        codeExamples: []
      }
    });
    console.log("  ✅ Created: Files lesson");

    await prisma.exercise.createMany({
      data: [
        {
          lessonId: filesLesson.id, number: 1, order: 1,
          title: "Read File",
          prompt: "Read entire contents of 'data.txt'",
          type: "CODE", difficulty: "BEGINNER", xpReward: 10,
          starterCode: "# Read file\n\nprint(content)",
          solution: "with open('data.txt', 'r') as f:\n    content = f.read()\nprint(content)",
          hints: ["Use with open()"]
        },
        {
          lessonId: filesLesson.id, number: 2, order: 2,
          title: "Write File",
          prompt: "Write 'Hello World' to 'output.txt'",
          type: "CODE", difficulty: "BEGINNER", xpReward: 10,
          starterCode: "# Write to file",
          solution: "with open('output.txt', 'w') as f:\n    f.write('Hello World')",
          hints: ["Use 'w' mode"]
        },
        {
          lessonId: filesLesson.id, number: 3, order: 3,
          title: "Why with?",
          prompt: "Main advantage of 'with open()' over just 'open()'?",
          type: "MULTIPLE_CHOICE", difficulty: "BEGINNER", xpReward: 5,
          starterCode: null,
          solution: "Auto-closes file even if error occurs",
          hints: ["Think about exceptions"]
        }
      ]
    });
    console.log("  ✅ Added 3 exercises");

    // Lesson 4: CSV
    const csvLesson = await prisma.lesson.create({
      data: {
        sectionId: ch4Section.id,
        number: 4.13,
        slug: 'csv-files-python',
        title: 'Working with CSV Files',
        order: 23, estimatedTime: 20, difficulty: 'INTERMEDIATE', isPublished: true,
        objectives: ['Read CSV', 'Write CSV', 'Use DictReader'],
        keyPoints: ['csv module', 'DictReader', 'DictWriter'],
        content: `# CSV Files

## Reading
\`\`\`python
import csv

with open('data.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row['name'], row['age'])
\`\`\`

## Writing
\`\`\`python
import csv

data = [{'name': 'Alice', 'age': 30}]

with open('out.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'age'])
    writer.writeheader()
    writer.writerows(data)
\`\`\``,
        codeExamples: []
      }
    });
    console.log("  ✅ Created: CSV lesson");

    await prisma.exercise.create({
      data: {
        lessonId: csvLesson.id, number: 1, order: 1,
        title: "Read CSV",
        prompt: "Read 'people.csv' and print each name",
        type: "CODE", difficulty: "INTERMEDIATE", xpReward: 15,
        starterCode: "import csv\n\n# Read and print names",
        solution: "import csv\nwith open('people.csv', 'r') as f:\n    reader = csv.DictReader(f)\n    for row in reader:\n        print(row['name'])",
        hints: ["Use csv.DictReader"]
      }
    });
    console.log("  ✅ Added 1 exercise");

    // Lesson 5: JSON
    const jsonLesson = await prisma.lesson.create({
      data: {
        sectionId: ch4Section.id,
        number: 4.14,
        slug: 'json-files-python',
        title: 'Working with JSON Files',
        order: 24, estimatedTime: 20, difficulty: 'BEGINNER', isPublished: true,
        objectives: ['Parse JSON', 'Write JSON'],
        keyPoints: ['json module', 'load/dump', 'loads/dumps'],
        content: `# JSON Files

## Reading
\`\`\`python
import json

with open('data.json', 'r') as f:
    data = json.load(f)
print(data['name'])
\`\`\`

## Writing
\`\`\`python
import json

data = {'name': 'Alice', 'age': 30}

with open('out.json', 'w') as f:
    json.dump(data, f, indent=2)
\`\`\`

## String Conversion
\`\`\`python
json_str = json.dumps(data)  # To string
data = json.loads(json_str)  # From string
\`\`\``,
        codeExamples: []
      }
    });
    console.log("  ✅ Created: JSON lesson");

    await prisma.exercise.createMany({
      data: [
        {
          lessonId: jsonLesson.id, number: 1, order: 1,
          title: "Parse JSON String",
          prompt: "Parse '{\"name\": \"Bob\"}' and print the name",
          type: "CODE", difficulty: "BEGINNER", xpReward: 10,
          starterCode: "import json\n\njson_str = '{\"name\": \"Bob\"}'\n# Parse and print name",
          solution: "import json\njson_str = '{\"name\": \"Bob\"}'\ndata = json.loads(json_str)\nprint(data['name'])",
          hints: ["Use json.loads() for strings"]
        },
        {
          lessonId: jsonLesson.id, number: 2, order: 2,
          title: "load vs loads",
          prompt: "Difference between json.load() and json.loads()?",
          type: "MULTIPLE_CHOICE", difficulty: "BEGINNER", xpReward: 5,
          starterCode: null,
          solution: "load() reads file, loads() parses string",
          hints: ["'s' = string"]
        }
      ]
    });
    console.log("  ✅ Added 2 exercises");
  }

  // ============================================================
  // CHAPTER 6: TESTING
  // ============================================================
  console.log("\n📝 Chapter 6: Adding Testing...");

  const ch6Section = await prisma.section.findFirst({
    where: { chapter: { number: 6 } },
    orderBy: { order: 'desc' }
  });

  if (ch6Section) {
    const unittestLesson = await prisma.lesson.create({
      data: {
        sectionId: ch6Section.id,
        number: 6.9,
        slug: 'unittest-python-testing',
        title: 'Unit Testing with unittest',
        order: 20, estimatedTime: 30, difficulty: 'INTERMEDIATE', isPublished: true,
        objectives: ['Write unit tests', 'Use assertions'],
        keyPoints: ['TestCase', 'assertEqual', 'assertRaises'],
        content: `# unittest Framework

\`\`\`python
import unittest

def add(a, b):
    return a + b

class TestAdd(unittest.TestCase):
    def test_positive(self):
        self.assertEqual(add(2, 3), 5)
    
    def test_negative(self):
        self.assertEqual(add(-1, -1), -2)

if __name__ == '__main__':
    unittest.main()
\`\`\`

## Assertions
- assertEqual(a, b)
- assertTrue(x) / assertFalse(x)
- assertRaises(Error)
- assertIn(a, b)

## Run
\`python -m unittest test_file.py\``,
        codeExamples: []
      }
    });
    console.log("  ✅ Created: unittest lesson");

    await prisma.exercise.createMany({
      data: [
        {
          lessonId: unittestLesson.id, number: 1, order: 1,
          title: "Write a Test",
          prompt: "Test that multiply(3, 4) returns 12",
          type: "CODE", difficulty: "INTERMEDIATE", xpReward: 15,
          starterCode: "import unittest\n\ndef multiply(a, b):\n    return a * b\n\nclass TestMultiply(unittest.TestCase):\n    def test_basic(self):\n        # Your assertion",
          solution: "import unittest\n\ndef multiply(a, b):\n    return a * b\n\nclass TestMultiply(unittest.TestCase):\n    def test_basic(self):\n        self.assertEqual(multiply(3, 4), 12)",
          hints: ["Use self.assertEqual()"]
        },
        {
          lessonId: unittestLesson.id, number: 2, order: 2,
          title: "Test Exception",
          prompt: "Test that divide(1, 0) raises ZeroDivisionError",
          type: "CODE", difficulty: "INTERMEDIATE", xpReward: 20,
          starterCode: "import unittest\n\ndef divide(a, b):\n    return a / b\n\nclass TestDivide(unittest.TestCase):\n    def test_zero(self):\n        # Test for exception",
          solution: "import unittest\n\ndef divide(a, b):\n    return a / b\n\nclass TestDivide(unittest.TestCase):\n    def test_zero(self):\n        with self.assertRaises(ZeroDivisionError):\n            divide(1, 0)",
          hints: ["Use with self.assertRaises()"]
        }
      ]
    });
    console.log("  ✅ Added 2 exercises");

    const pytestLesson = await prisma.lesson.create({
      data: {
        sectionId: ch6Section.id,
        number: 6.10,
        slug: 'pytest-python-testing',
        title: 'Testing with pytest',
        order: 21, estimatedTime: 30, difficulty: 'INTERMEDIATE', isPublished: true,
        objectives: ['Write pytest tests', 'Use fixtures'],
        keyPoints: ['assert', 'fixtures', 'parametrize'],
        content: `# pytest

## Simple - No Classes!
\`\`\`python
def test_add():
    assert add(2, 3) == 5
\`\`\`

## Fixtures
\`\`\`python
import pytest

@pytest.fixture
def sample_data():
    return [1, 2, 3, 4, 5]

def test_sum(sample_data):
    assert sum(sample_data) == 15
\`\`\`

## Parametrize
\`\`\`python
@pytest.mark.parametrize("a,b,expected", [
    (2, 3, 5),
    (0, 0, 0),
])
def test_add(a, b, expected):
    assert add(a, b) == expected
\`\`\`

## Run: \`pytest -v\``,
        codeExamples: []
      }
    });
    console.log("  ✅ Created: pytest lesson");

    await prisma.exercise.createMany({
      data: [
        {
          lessonId: pytestLesson.id, number: 1, order: 1,
          title: "Simple Test",
          prompt: "Write pytest test for add(2, 3) == 5",
          type: "CODE", difficulty: "BEGINNER", xpReward: 10,
          starterCode: "def add(a, b):\n    return a + b\n\n# Write test",
          solution: "def add(a, b):\n    return a + b\n\ndef test_add():\n    assert add(2, 3) == 5",
          hints: ["Just use assert"]
        },
        {
          lessonId: pytestLesson.id, number: 2, order: 2,
          title: "Create Fixture",
          prompt: "Create a fixture returning [1,2,3,4,5]",
          type: "CODE", difficulty: "INTERMEDIATE", xpReward: 15,
          starterCode: "import pytest\n\n# Create fixture\n\ndef test_sum(sample):\n    assert sum(sample) == 15",
          solution: "import pytest\n\n@pytest.fixture\ndef sample():\n    return [1, 2, 3, 4, 5]\n\ndef test_sum(sample):\n    assert sum(sample) == 15",
          hints: ["Use @pytest.fixture"]
        }
      ]
    });
    console.log("  ✅ Added 2 exercises");
  }

  // ============================================================
  // CHAPTER 7: CONTEXT MANAGERS & LOGGING
  // ============================================================
  console.log("\n📝 Chapter 7: Adding Context Managers & Logging...");

  const ch7Section = await prisma.section.findFirst({
    where: { chapter: { number: 7 } },
    orderBy: { order: 'desc' }
  });

  if (ch7Section) {
    const contextLesson = await prisma.lesson.create({
      data: {
        sectionId: ch7Section.id,
        number: 7.9,
        slug: 'context-managers-python',
        title: 'Context Managers and with Statement',
        order: 20, estimatedTime: 25, difficulty: 'INTERMEDIATE', isPublished: true,
        objectives: ['Use context managers', 'Create custom ones'],
        keyPoints: ['with statement', '__enter__', '__exit__', 'contextlib'],
        content: `# Context Managers

Auto-handle setup and cleanup!

## The Problem
\`\`\`python
f = open('data.txt')
content = f.read()
# Error here? File never closes!
f.close()
\`\`\`

## The Solution
\`\`\`python
with open('data.txt') as f:
    content = f.read()
# Auto-closed!
\`\`\`

## Create Your Own
\`\`\`python
from contextlib import contextmanager

@contextmanager
def timer():
    import time
    start = time.time()
    yield
    print(f"Took {time.time()-start:.2f}s")

with timer():
    # Your code
    pass
\`\`\``,
        codeExamples: []
      }
    });
    console.log("  ✅ Created: Context Managers lesson");

    await prisma.exercise.createMany({
      data: [
        {
          lessonId: contextLesson.id, number: 1, order: 1,
          title: "Timer Context Manager",
          prompt: "Create a timer that prints elapsed time",
          type: "CODE", difficulty: "INTERMEDIATE", xpReward: 25,
          starterCode: "from contextlib import contextmanager\nimport time\n\n@contextmanager\ndef timer():\n    # Your code\n    yield",
          solution: "from contextlib import contextmanager\nimport time\n\n@contextmanager\ndef timer():\n    start = time.time()\n    yield\n    print(f'Took {time.time()-start:.2f}s')",
          hints: ["Record time before yield, print after"]
        },
        {
          lessonId: contextLesson.id, number: 2, order: 2,
          title: "Magic Methods",
          prompt: "What 2 methods make a class a context manager?",
          type: "MULTIPLE_CHOICE", difficulty: "BEGINNER", xpReward: 5,
          starterCode: null,
          solution: "__enter__ and __exit__",
          hints: ["Enter and exit the with block"]
        }
      ]
    });
    console.log("  ✅ Added 2 exercises");

    const loggingLesson = await prisma.lesson.create({
      data: {
        sectionId: ch7Section.id,
        number: 7.10,
        slug: 'logging-python',
        title: 'Logging - Professional Debugging',
        order: 21, estimatedTime: 25, difficulty: 'INTERMEDIATE', isPublished: true,
        objectives: ['Use logging module', 'Configure levels'],
        keyPoints: ['logging', 'levels', 'basicConfig'],
        content: `# Logging > print()

\`\`\`python
import logging

logging.basicConfig(level=logging.DEBUG)

logging.debug("Debug info")
logging.info("General info")
logging.warning("Warning!")
logging.error("Error!")
logging.critical("Critical!")
\`\`\`

## Levels (low to high)
DEBUG → INFO → WARNING → ERROR → CRITICAL

## With Format
\`\`\`python
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
\`\`\``,
        codeExamples: []
      }
    });
    console.log("  ✅ Created: Logging lesson");

    await prisma.exercise.createMany({
      data: [
        {
          lessonId: loggingLesson.id, number: 1, order: 1,
          title: "Setup Logging",
          prompt: "Configure logging with DEBUG level and timestamps",
          type: "CODE", difficulty: "BEGINNER", xpReward: 15,
          starterCode: "import logging\n\n# Configure logging\n\nlogging.info('Test')",
          solution: "import logging\n\nlogging.basicConfig(\n    level=logging.DEBUG,\n    format='%(asctime)s - %(levelname)s - %(message)s'\n)\n\nlogging.info('Test')",
          hints: ["Use basicConfig with level and format"]
        },
        {
          lessonId: loggingLesson.id, number: 2, order: 2,
          title: "Level Order",
          prompt: "Order from least to most severe: ERROR, DEBUG, WARNING, INFO",
          type: "MULTIPLE_CHOICE", difficulty: "BEGINNER", xpReward: 5,
          starterCode: null,
          solution: "DEBUG, INFO, WARNING, ERROR",
          hints: ["DEBUG is least severe"]
        }
      ]
    });
    console.log("  ✅ Added 2 exercises");
  }

  // ============================================================
  // CHAPTER 8: ADVANCED OOP
  // ============================================================
  console.log("\n📝 Chapter 8: Adding Advanced OOP...");

  const ch8Section = await prisma.section.findFirst({
    where: { chapter: { number: 8 } },
    orderBy: { order: 'desc' }
  });

  if (ch8Section) {
    const dataclassLesson = await prisma.lesson.create({
      data: {
        sectionId: ch8Section.id,
        number: 8.13,
        slug: 'dataclasses-python',
        title: 'Dataclasses - Modern Data Containers',
        order: 20, estimatedTime: 25, difficulty: 'INTERMEDIATE', isPublished: true,
        objectives: ['Use dataclasses', 'Set defaults'],
        keyPoints: ['@dataclass', 'field()', 'frozen'],
        content: `# Dataclasses

Auto-generate __init__, __repr__, __eq__!

\`\`\`python
from dataclasses import dataclass

@dataclass
class Person:
    name: str
    age: int
    email: str = ""

p = Person("Alice", 30)
print(p)  # Person(name='Alice', age=30, email='')
\`\`\`

## Immutable
\`\`\`python
@dataclass(frozen=True)
class Point:
    x: float
    y: float
\`\`\``,
        codeExamples: []
      }
    });
    console.log("  ✅ Created: Dataclasses lesson");

    await prisma.exercise.create({
      data: {
        lessonId: dataclassLesson.id, number: 1, order: 1,
        title: "Create Dataclass",
        prompt: "Create Product dataclass with name, price, quantity=0",
        type: "CODE", difficulty: "BEGINNER", xpReward: 15,
        starterCode: "from dataclasses import dataclass\n\n# Create Product\n\np = Product('Widget', 9.99)\nprint(p)",
        solution: "from dataclasses import dataclass\n\n@dataclass\nclass Product:\n    name: str\n    price: float\n    quantity: int = 0\n\np = Product('Widget', 9.99)\nprint(p)",
        hints: ["Use @dataclass decorator"]
      }
    });
    console.log("  ✅ Added 1 exercise");

    const propsLesson = await prisma.lesson.create({
      data: {
        sectionId: ch8Section.id,
        number: 8.14,
        slug: 'properties-python',
        title: 'Properties - Controlled Attribute Access',
        order: 21, estimatedTime: 25, difficulty: 'INTERMEDIATE', isPublished: true,
        objectives: ['Use @property', 'Add validation'],
        keyPoints: ['@property', 'getter', 'setter'],
        content: `# Properties

\`\`\`python
class BankAccount:
    def __init__(self):
        self._balance = 0
    
    @property
    def balance(self):
        return self._balance
    
    @balance.setter
    def balance(self, value):
        if value < 0:
            raise ValueError("Cannot be negative")
        self._balance = value

acc = BankAccount()
acc.balance = 100   # Calls setter
print(acc.balance)  # Calls getter
\`\`\``,
        codeExamples: []
      }
    });
    console.log("  ✅ Created: Properties lesson");

    await prisma.exercise.create({
      data: {
        lessonId: propsLesson.id, number: 1, order: 1,
        title: "Validated Property",
        prompt: "Add radius property that can't be negative",
        type: "CODE", difficulty: "INTERMEDIATE", xpReward: 20,
        starterCode: "class Circle:\n    def __init__(self, radius):\n        self._radius = radius\n    \n    # Add property",
        solution: "class Circle:\n    def __init__(self, radius):\n        self.radius = radius\n    \n    @property\n    def radius(self):\n        return self._radius\n    \n    @radius.setter\n    def radius(self, value):\n        if value < 0:\n            raise ValueError('Negative')\n        self._radius = value",
        hints: ["Use @property and @radius.setter"]
      }
    });
    console.log("  ✅ Added 1 exercise");

    const abcLesson = await prisma.lesson.create({
      data: {
        sectionId: ch8Section.id,
        number: 8.15,
        slug: 'abstract-classes-python',
        title: 'Abstract Base Classes',
        order: 22, estimatedTime: 25, difficulty: 'INTERMEDIATE', isPublished: true,
        objectives: ['Create ABCs', 'Define interfaces'],
        keyPoints: ['ABC', 'abstractmethod'],
        content: `# Abstract Base Classes

Define interfaces subclasses MUST implement:

\`\`\`python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return 3.14 * self.radius ** 2

# Shape() - Error! Can't instantiate
c = Circle(5)
print(c.area())
\`\`\``,
        codeExamples: []
      }
    });
    console.log("  ✅ Created: ABC lesson");

    await prisma.exercise.create({
      data: {
        lessonId: abcLesson.id, number: 1, order: 1,
        title: "Create Abstract Class",
        prompt: "Create abstract Animal with abstract speak()",
        type: "CODE", difficulty: "INTERMEDIATE", xpReward: 20,
        starterCode: "from abc import ABC, abstractmethod\n\n# Create Animal ABC\n\nclass Dog(Animal):\n    def speak(self):\n        return 'Woof!'",
        solution: "from abc import ABC, abstractmethod\n\nclass Animal(ABC):\n    @abstractmethod\n    def speak(self):\n        pass\n\nclass Dog(Animal):\n    def speak(self):\n        return 'Woof!'",
        hints: ["Inherit from ABC, use @abstractmethod"]
      }
    });
    console.log("  ✅ Added 1 exercise");
  }

  // ============================================================
  // CHAPTER 13: HYPOTHESIS TESTING
  // ============================================================
  console.log("\n📝 Chapter 13: Adding Hypothesis Testing...");

  const ch13Section = await prisma.section.findFirst({
    where: { chapter: { number: 13 } },
    orderBy: { order: 'desc' }
  });

  if (ch13Section) {
    const hypoIntroLesson = await prisma.lesson.create({
      data: {
        sectionId: ch13Section.id,
        number: 13.7,
        slug: 'hypothesis-testing-intro',
        title: 'Introduction to Hypothesis Testing',
        order: 20, estimatedTime: 30, difficulty: 'INTERMEDIATE', isPublished: true,
        objectives: ['Understand hypothesis testing', 'Interpret p-values'],
        keyPoints: ['null hypothesis', 'p-value', 'significance'],
        content: `# Hypothesis Testing

Is this result real or just luck?

## Framework
1. **Null Hypothesis (H₀)**: Nothing special
2. **Alternative (H₁)**: Something IS happening
3. **Calculate p-value**
4. **Decide**: p < 0.05? Reject H₀

## Example
\`\`\`python
from scipy import stats

# 65 heads out of 100 flips - biased?
result = stats.binomtest(65, n=100, p=0.5)
print(f"p-value: {result.pvalue:.4f}")

if result.pvalue < 0.05:
    print("Coin appears biased!")
\`\`\`

P-value = probability of data this extreme IF H₀ true
(NOT probability H₀ is true!)`,
        codeExamples: []
      }
    });
    console.log("  ✅ Created: Hypothesis Testing Intro");

    await prisma.exercise.createMany({
      data: [
        {
          lessonId: hypoIntroLesson.id, number: 1, order: 1,
          title: "Null Hypothesis",
          prompt: "For testing if a drug works, what's the null hypothesis?",
          type: "MULTIPLE_CHOICE", difficulty: "BEGINNER", xpReward: 5,
          starterCode: null,
          solution: "The drug has no effect",
          hints: ["H₀ = nothing special"]
        },
        {
          lessonId: hypoIntroLesson.id, number: 2, order: 2,
          title: "Coin Test",
          prompt: "Test if 65 heads in 100 flips indicates bias",
          type: "CODE", difficulty: "INTERMEDIATE", xpReward: 20,
          starterCode: "from scipy import stats\n\nheads = 65\nn = 100\n\n# Binomial test\nresult = \n\nprint(f'p-value: {result.pvalue:.4f}')",
          solution: "from scipy import stats\n\nheads = 65\nn = 100\n\nresult = stats.binomtest(heads, n=n, p=0.5)\n\nprint(f'p-value: {result.pvalue:.4f}')",
          hints: ["Use stats.binomtest()"]
        }
      ]
    });
    console.log("  ✅ Added 2 exercises");

    const statsTestsLesson = await prisma.lesson.create({
      data: {
        sectionId: ch13Section.id,
        number: 13.8,
        slug: 'common-stats-tests',
        title: 'Common Statistical Tests',
        order: 21, estimatedTime: 30, difficulty: 'INTERMEDIATE', isPublished: true,
        objectives: ['Choose appropriate test', 'Perform t-tests'],
        keyPoints: ['t-test', 'chi-square', 'ANOVA'],
        content: `# Statistical Tests

## One-Sample T-Test
\`\`\`python
from scipy import stats
sample = [98, 102, 105, 97, 103]
result = stats.ttest_1samp(sample, popmean=100)
\`\`\`

## Two-Sample T-Test
\`\`\`python
group_a = [85, 90, 88]
group_b = [78, 82, 80]
result = stats.ttest_ind(group_a, group_b)
\`\`\`

## Paired T-Test
\`\`\`python
before = [65, 70, 72]
after = [70, 75, 78]
result = stats.ttest_rel(before, after)
\`\`\``,
        codeExamples: []
      }
    });
    console.log("  ✅ Created: Statistical Tests");

    await prisma.exercise.createMany({
      data: [
        {
          lessonId: statsTestsLesson.id, number: 1, order: 1,
          title: "One-Sample T-Test",
          prompt: "Test if sample mean differs from 100",
          type: "CODE", difficulty: "INTERMEDIATE", xpReward: 20,
          starterCode: "from scipy import stats\n\nsample = [98, 102, 105, 97, 103]\n\n# t-test\nresult = \n\nprint(f'p-value: {result.pvalue:.4f}')",
          solution: "from scipy import stats\n\nsample = [98, 102, 105, 97, 103]\n\nresult = stats.ttest_1samp(sample, popmean=100)\n\nprint(f'p-value: {result.pvalue:.4f}')",
          hints: ["Use stats.ttest_1samp()"]
        },
        {
          lessonId: statsTestsLesson.id, number: 2, order: 2,
          title: "Which Test?",
          prompt: "Same people measured before/after. Which test?",
          type: "MULTIPLE_CHOICE", difficulty: "BEGINNER", xpReward: 5,
          starterCode: null,
          solution: "Paired t-test (ttest_rel)",
          hints: ["Same subjects = paired"]
        }
      ]
    });
    console.log("  ✅ Added 2 exercises");
  }

  // ============================================================
  // SUMMARY
  // ============================================================
  const totalLessons = await prisma.lesson.count();
  const totalExercises = await prisma.exercise.count();

  console.log("\n" + "=".repeat(50));
  console.log("🎉 COMPLETE SEED FINISHED!");
  console.log("=".repeat(50));
  console.log(`Total lessons: ${totalLessons}`);
  console.log(`Total exercises: ${totalExercises}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
