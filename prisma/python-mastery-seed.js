const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🐍 PYTHON MASTERY CURRICULUM UPGRADE");
  console.log("=====================================\n");

  // ============================================================
  // PART 1: ADD WHILE LOOPS TO CHAPTER 2
  // ============================================================
  console.log("📝 Part 1: Adding While Loops to Chapter 2...");
  
  const ch2Section = await prisma.section.findFirst({
    where: { chapter: { number: 2 } },
    orderBy: { order: 'desc' }
  });

  if (ch2Section) {
    await prisma.lesson.upsert({
      where: { slug: 'while-loops' },
      update: {},
      create: {
        sectionId: ch2Section.id,
        slug: 'while-loops',
        title: 'While Loops - Repeating Until a Condition',
        order: 11,
        estimatedTime: 20,
        difficulty: 'BEGINNER',
        isPublished: true,
        objectives: [
          'Understand when to use while loops vs for loops',
          'Write while loops with proper termination conditions',
          'Avoid infinite loops',
          'Use break and continue statements'
        ],
        keyPoints: ['while condition:', 'infinite loops', 'break', 'continue', 'sentinel values'],
        content: `# While Loops - Repeating Until a Condition

While loops repeat code **until a condition becomes False**. Unlike for loops which iterate a fixed number of times, while loops are perfect when you don't know how many iterations you'll need.

## Basic Syntax
\`\`\`python
count = 0
while count < 5:
    print(f"Count is {count}")
    count += 1  # Don't forget to update!
\`\`\`

## When to Use While vs For
- **FOR**: Known iterations, iterating sequences
- **WHILE**: Unknown iterations, waiting for condition

## Break and Continue
\`\`\`python
while True:
    user_input = input("Enter 'quit' to exit: ")
    if user_input == 'quit':
        break  # Exit the loop
    print(f"You entered: {user_input}")
\`\`\`

## Sentinel-Controlled Loops
\`\`\`python
total = 0
number = int(input("Number (-1 to stop): "))
while number != -1:
    total += number
    number = int(input("Number (-1 to stop): "))
print(f"Sum: {total}")
\`\`\``,
        codeExamples: JSON.stringify([])
      }
    });
    console.log("  ✅ Added: While Loops lesson");
  }

  // ============================================================
  // PART 2: ADD MODULES & FILES TO CHAPTER 4
  // ============================================================
  console.log("\n📝 Part 2: Adding Modules & Files to Chapter 4...");

  const ch4Section = await prisma.section.findFirst({
    where: { chapter: { number: 4 } },
    orderBy: { order: 'desc' }
  });

  if (ch4Section) {
    const maxOrder = await prisma.lesson.findFirst({
      where: { sectionId: ch4Section.id },
      orderBy: { order: 'desc' }
    });
    let order = (maxOrder?.order || 9) + 1;

    const modulesLessons = [
      {
        slug: 'introduction-to-modules',
        title: 'Introduction to Modules',
        content: `# Introduction to Modules

Modules let you organize code into separate files and reuse code across projects.

## Importing Modules
\`\`\`python
import math
print(math.sqrt(16))  # 4.0

from math import sqrt, pi
print(sqrt(16))  # No prefix needed

import math as m
print(m.sqrt(16))
\`\`\`

## Standard Library Highlights
\`\`\`python
import random
random.randint(1, 10)

import datetime
datetime.date.today()

import os
os.getcwd()

import sys
sys.path
\`\`\``
      },
      {
        slug: 'creating-your-own-modules',
        title: 'Creating Your Own Modules',
        content: `# Creating Your Own Modules

Any Python file is a module! Create \`my_utils.py\`:
\`\`\`python
# my_utils.py
def greet(name):
    return f"Hello, {name}!"

PI = 3.14159
\`\`\`

Use it:
\`\`\`python
import my_utils
print(my_utils.greet("World"))
\`\`\`

## The __name__ Variable
\`\`\`python
if __name__ == "__main__":
    # Only runs when executed directly
    print("Running tests...")
\`\`\``
      },
      {
        slug: 'packages-and-project-structure',
        title: 'Packages and Project Structure',
        content: `# Packages and Project Structure

A package is a directory with \`__init__.py\`:
\`\`\`
my_package/
├── __init__.py
├── module1.py
└── module2.py
\`\`\`

## Professional Structure
\`\`\`
project/
├── README.md
├── requirements.txt
├── src/
│   └── my_package/
├── tests/
└── docs/
\`\`\`

## requirements.txt
\`\`\`
numpy>=1.20.0
pandas==2.0.0
requests>=2.25.0
\`\`\`
Install: \`pip install -r requirements.txt\``
      },
      {
        slug: 'reading-and-writing-files',
        title: 'Reading and Writing Files',
        content: `# Reading and Writing Files

## Always Use \`with\` Statement
\`\`\`python
with open('data.txt', 'r') as file:
    content = file.read()
# File automatically closed

with open('output.txt', 'w') as file:
    file.write("Hello!")
\`\`\`

## File Modes
- 'r': Read (default)
- 'w': Write (overwrites)
- 'a': Append
- 'rb'/'wb': Binary

## Reading Methods
\`\`\`python
content = file.read()       # Entire file
line = file.readline()      # One line
lines = file.readlines()    # List of lines

for line in file:           # Memory efficient
    print(line.strip())
\`\`\`

## pathlib (Modern)
\`\`\`python
from pathlib import Path
path = Path('data/file.txt')
print(path.exists())
print(path.suffix)  # .txt
\`\`\``
      },
      {
        slug: 'working-with-csv-files',
        title: 'Working with CSV Files',
        content: `# Working with CSV Files

## Reading CSV
\`\`\`python
import csv

with open('data.csv', 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(row['name'], row['age'])
\`\`\`

## Writing CSV
\`\`\`python
import csv

data = [
    {'name': 'Alice', 'age': 30},
    {'name': 'Bob', 'age': 25}
]

with open('output.csv', 'w', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=['name', 'age'])
    writer.writeheader()
    writer.writerows(data)
\`\`\``
      },
      {
        slug: 'working-with-json',
        title: 'Working with JSON Files',
        content: `# Working with JSON Files

## Reading JSON
\`\`\`python
import json

with open('data.json', 'r') as file:
    data = json.load(file)
print(data['name'])
\`\`\`

## Writing JSON
\`\`\`python
import json

data = {'name': 'Alice', 'skills': ['Python', 'SQL']}

with open('output.json', 'w') as file:
    json.dump(data, file, indent=2)
\`\`\`

## JSON ↔ String
\`\`\`python
json_str = json.dumps(data)  # To string
data = json.loads(json_str)  # From string
\`\`\``
      }
    ];

    for (const lesson of modulesLessons) {
      await prisma.lesson.upsert({
        where: { slug: lesson.slug },
        update: {},
        create: {
          sectionId: ch4Section.id,
          slug: lesson.slug,
          title: lesson.title,
          order: order++,
          estimatedTime: 25,
          difficulty: 'BEGINNER',
          isPublished: true,
          objectives: [],
          keyPoints: [],
          content: lesson.content,
          codeExamples: JSON.stringify([])
        }
      });
      console.log(`  ✅ Added: ${lesson.title}`);
    }
  }

  // ============================================================
  // PART 3: ADD TESTING TO CHAPTER 6
  // ============================================================
  console.log("\n📝 Part 3: Adding Testing Framework lessons...");

  const ch6Section = await prisma.section.findFirst({
    where: { chapter: { number: 6 } }
  });

  if (ch6Section) {
    const maxOrder6 = await prisma.lesson.findFirst({
      where: { sectionId: ch6Section.id },
      orderBy: { order: 'desc' }
    });
    let order6 = (maxOrder6?.order || 8) + 1;

    await prisma.lesson.upsert({
      where: { slug: 'unittest-framework' },
      update: {},
      create: {
        sectionId: ch6Section.id,
        slug: 'unittest-framework',
        title: 'Unit Testing with unittest',
        order: order6++,
        estimatedTime: 30,
        difficulty: 'INTERMEDIATE',
        isPublished: true,
        objectives: [],
        keyPoints: [],
        content: `# Unit Testing with unittest

\`\`\`python
import unittest

def add(a, b):
    return a + b

class TestAddFunction(unittest.TestCase):
    def test_positive(self):
        self.assertEqual(add(2, 3), 5)
    
    def test_negative(self):
        self.assertEqual(add(-1, -1), -2)

if __name__ == '__main__':
    unittest.main()
\`\`\`

## Common Assertions
- assertEqual(a, b)
- assertTrue(x) / assertFalse(x)
- assertRaises(Error)
- assertIn(a, b)

## Run: \`python -m unittest test_module.py\``,
        codeExamples: JSON.stringify([])
      }
    });
    console.log("  ✅ Added: unittest lesson");

    await prisma.lesson.upsert({
      where: { slug: 'pytest-introduction' },
      update: {},
      create: {
        sectionId: ch6Section.id,
        slug: 'pytest-introduction',
        title: 'Testing with pytest',
        order: order6++,
        estimatedTime: 30,
        difficulty: 'INTERMEDIATE',
        isPublished: true,
        objectives: [],
        keyPoints: [],
        content: `# Testing with pytest

## Simple Syntax - No Classes Needed!
\`\`\`python
def test_add():
    assert add(2, 3) == 5

def test_subtract():
    assert subtract(5, 3) == 2
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

## Parametrized Tests
\`\`\`python
@pytest.mark.parametrize("a,b,expected", [
    (2, 3, 5),
    (0, 0, 0),
    (-1, 1, 0),
])
def test_add(a, b, expected):
    assert add(a, b) == expected
\`\`\`

## Run: \`pytest -v\``,
        codeExamples: JSON.stringify([])
      }
    });
    console.log("  ✅ Added: pytest lesson");
  }

  // ============================================================
  // PART 4: ADD CONTEXT MANAGERS TO CHAPTER 7
  // ============================================================
  console.log("\n📝 Part 4: Adding Context Managers & Logging...");

  const ch7Section = await prisma.section.findFirst({
    where: { chapter: { number: 7 } }
  });

  if (ch7Section) {
    const maxOrder7 = await prisma.lesson.findFirst({
      where: { sectionId: ch7Section.id },
      orderBy: { order: 'desc' }
    });
    let order7 = (maxOrder7?.order || 8) + 1;

    await prisma.lesson.upsert({
      where: { slug: 'context-managers' },
      update: {},
      create: {
        sectionId: ch7Section.id,
        slug: 'context-managers',
        title: 'Context Managers and the with Statement',
        order: order7++,
        estimatedTime: 25,
        difficulty: 'INTERMEDIATE',
        isPublished: true,
        objectives: [],
        keyPoints: [],
        content: `# Context Managers

Automatically handle setup and cleanup!

\`\`\`python
# Without context manager - RISKY
file = open('data.txt')
content = file.read()
# Error here? File never closes!
file.close()

# With context manager - SAFE
with open('data.txt') as file:
    content = file.read()
# Automatically closed!
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
    # Your code here
    pass
\`\`\``,
        codeExamples: JSON.stringify([])
      }
    });
    console.log("  ✅ Added: Context Managers lesson");

    await prisma.lesson.upsert({
      where: { slug: 'logging-in-python' },
      update: {},
      create: {
        sectionId: ch7Section.id,
        slug: 'logging-in-python',
        title: 'Logging - Professional Debugging',
        order: order7++,
        estimatedTime: 25,
        difficulty: 'INTERMEDIATE',
        isPublished: true,
        objectives: [],
        keyPoints: [],
        content: `# Logging > print()

\`\`\`python
import logging

logging.basicConfig(level=logging.DEBUG)

logging.debug("Debug info")
logging.info("General info")
logging.warning("Warning!")
logging.error("Error occurred")
logging.critical("Critical failure!")
\`\`\`

## Log to File
\`\`\`python
logging.basicConfig(
    filename='app.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
\`\`\``,
        codeExamples: JSON.stringify([])
      }
    });
    console.log("  ✅ Added: Logging lesson");
  }

  // ============================================================
  // PART 5: ADD ADVANCED OOP TO CHAPTER 8
  // ============================================================
  console.log("\n📝 Part 5: Adding Advanced OOP...");

  const ch8Section = await prisma.section.findFirst({
    where: { chapter: { number: 8 } }
  });

  if (ch8Section) {
    const maxOrder8 = await prisma.lesson.findFirst({
      where: { sectionId: ch8Section.id },
      orderBy: { order: 'desc' }
    });
    let order8 = (maxOrder8?.order || 12) + 1;

    await prisma.lesson.upsert({
      where: { slug: 'dataclasses' },
      update: {},
      create: {
        sectionId: ch8Section.id,
        slug: 'dataclasses',
        title: 'Dataclasses - Modern Data Containers',
        order: order8++,
        estimatedTime: 25,
        difficulty: 'INTERMEDIATE',
        isPublished: true,
        objectives: [],
        keyPoints: [],
        content: `# Dataclasses

Auto-generate __init__, __repr__, __eq__!

\`\`\`python
from dataclasses import dataclass

@dataclass
class Person:
    name: str
    age: int
    email: str

person = Person("Alice", 30, "alice@email.com")
print(person)  # Person(name='Alice', age=30, ...)
\`\`\`

## Defaults & Immutability
\`\`\`python
from dataclasses import dataclass, field

@dataclass(frozen=True)  # Immutable!
class Point:
    x: float = 0.0
    y: float = 0.0
\`\`\``,
        codeExamples: JSON.stringify([])
      }
    });
    console.log("  ✅ Added: Dataclasses lesson");

    await prisma.lesson.upsert({
      where: { slug: 'properties-and-descriptors' },
      update: {},
      create: {
        sectionId: ch8Section.id,
        slug: 'properties-and-descriptors',
        title: 'Properties - Controlled Attribute Access',
        order: order8++,
        estimatedTime: 25,
        difficulty: 'INTERMEDIATE',
        isPublished: true,
        objectives: [],
        keyPoints: [],
        content: `# Properties

Add validation to attribute access:

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

account = BankAccount()
account.balance = 100   # Calls setter
print(account.balance)  # Calls getter
\`\`\``,
        codeExamples: JSON.stringify([])
      }
    });
    console.log("  ✅ Added: Properties lesson");

    await prisma.lesson.upsert({
      where: { slug: 'class-and-static-methods' },
      update: {},
      create: {
        sectionId: ch8Section.id,
        slug: 'class-and-static-methods',
        title: 'Class Methods and Static Methods',
        order: order8++,
        estimatedTime: 25,
        difficulty: 'INTERMEDIATE',
        isPublished: true,
        objectives: [],
        keyPoints: [],
        content: `# Class & Static Methods

\`\`\`python
class Pizza:
    def __init__(self, ingredients):
        self.ingredients = ingredients
    
    @classmethod
    def margherita(cls):
        return cls(['mozzarella', 'tomatoes'])
    
    @staticmethod
    def is_vegetarian(ingredients):
        return 'meat' not in ingredients

# Usage
pizza = Pizza.margherita()  # Alternative constructor
Pizza.is_vegetarian(['cheese'])  # True
\`\`\``,
        codeExamples: JSON.stringify([])
      }
    });
    console.log("  ✅ Added: Class/Static Methods lesson");

    await prisma.lesson.upsert({
      where: { slug: 'abstract-base-classes' },
      update: {},
      create: {
        sectionId: ch8Section.id,
        slug: 'abstract-base-classes',
        title: 'Abstract Base Classes',
        order: order8++,
        estimatedTime: 25,
        difficulty: 'INTERMEDIATE',
        isPublished: true,
        objectives: [],
        keyPoints: [],
        content: `# Abstract Base Classes

Define interfaces that subclasses MUST implement:

\`\`\`python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass
    
    @abstractmethod
    def perimeter(self):
        pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return 3.14 * self.radius ** 2
    
    def perimeter(self):
        return 2 * 3.14 * self.radius

# Shape() would raise TypeError!
circle = Circle(5)
print(circle.area())
\`\`\``,
        codeExamples: JSON.stringify([])
      }
    });
    console.log("  ✅ Added: Abstract Base Classes lesson");
  }

  // ============================================================
  // PART 6: ADD HYPOTHESIS TESTING TO CHAPTER 13
  // ============================================================
  console.log("\n📝 Part 6: Adding Hypothesis Testing...");

  const ch13Section = await prisma.section.findFirst({
    where: { chapter: { number: 13 } }
  });

  if (ch13Section) {
    const maxOrder13 = await prisma.lesson.findFirst({
      where: { sectionId: ch13Section.id },
      orderBy: { order: 'desc' }
    });
    let order13 = (maxOrder13?.order || 6) + 1;

    const hypothesisLessons = [
      {
        slug: 'hypothesis-testing-introduction',
        title: 'Introduction to Hypothesis Testing',
        content: `# Hypothesis Testing

Is this result real or just luck?

## The Framework
1. **Null Hypothesis (H₀)**: Nothing special happening
2. **Alternative (H₁)**: Something IS happening
3. **Calculate p-value**: How likely is our data if H₀ true?
4. **Decide**: p < 0.05? Reject H₀

\`\`\`python
from scipy import stats

# Is this coin fair?
heads = 65  # out of 100 flips
result = stats.binomtest(heads, n=100, p=0.5)
print(f"p-value: {result.pvalue:.4f}")

if result.pvalue < 0.05:
    print("Coin appears biased!")
\`\`\``
      },
      {
        slug: 'p-values-explained',
        title: 'P-Values Explained',
        content: `# P-Values

**P-value**: Probability of data this extreme IF H₀ is true.

NOT the probability H₀ is true!

\`\`\`python
from scipy import stats
import numpy as np

# One-sample t-test
sample = [52, 48, 55, 51, 49, 53, 50, 54]
result = stats.ttest_1samp(sample, popmean=50)
print(f"p-value: {result.pvalue:.4f}")
\`\`\`

| P-value | Evidence |
|---------|----------|
| < 0.01 | Strong |
| 0.01-0.05 | Moderate |
| > 0.10 | Weak/None |`
      },
      {
        slug: 'types-of-errors',
        title: 'Type I and Type II Errors',
        content: `# Type I & II Errors

|  | H₀ True | H₀ False |
|--|---------|----------|
| Reject H₀ | Type I (α) | ✓ |
| Keep H₀ | ✓ | Type II (β) |

**Type I (False Positive)**: Crying wolf
**Type II (False Negative)**: Missing real effect

**Power = 1 - β** = Correctly rejecting false H₀

Increase power:
- Larger sample
- Larger effect
- Higher α (trade-off!)`
      },
      {
        slug: 'common-statistical-tests',
        title: 'Common Statistical Tests',
        content: `# Statistical Tests Cheatsheet

\`\`\`python
from scipy import stats

# One-sample t-test
stats.ttest_1samp(sample, popmean=50)

# Two-sample t-test (independent)
stats.ttest_ind(group_a, group_b)

# Paired t-test (same subjects)
stats.ttest_rel(before, after)

# Chi-square (categorical)
stats.chi2_contingency(observed_table)

# ANOVA (3+ groups)
stats.f_oneway(group1, group2, group3)
\`\`\``
      }
    ];

    for (const lesson of hypothesisLessons) {
      await prisma.lesson.upsert({
        where: { slug: lesson.slug },
        update: {},
        create: {
          sectionId: ch13Section.id,
          slug: lesson.slug,
          title: lesson.title,
          order: order13++,
          estimatedTime: 30,
          difficulty: 'INTERMEDIATE',
          isPublished: true,
          objectives: [],
          keyPoints: [],
          content: lesson.content,
          codeExamples: JSON.stringify([])
        }
      });
      console.log(`  ✅ Added: ${lesson.title}`);
    }
  }

  // ============================================================
  // SUMMARY
  // ============================================================
  const totalLessons = await prisma.lesson.count();
  
  console.log("\n" + "=".repeat(50));
  console.log("🎉 PYTHON MASTERY UPGRADE COMPLETE!");
  console.log("=".repeat(50));
  console.log(`Total lessons: ${totalLessons}`);
  console.log("\n✅ Added:");
  console.log("   • While Loops (Ch 2)");
  console.log("   • Modules & Files (6 lessons, Ch 4)");
  console.log("   • Testing: unittest & pytest (Ch 6)");
  console.log("   • Context Managers & Logging (Ch 7)");
  console.log("   • Dataclasses, Properties, ABCs (Ch 8)");
  console.log("   • Hypothesis Testing (4 lessons, Ch 13)");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
