const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("💪 ADDING EXERCISES TO NEW LESSONS");
  console.log("===================================\n");

  // Helper to add exercises
  async function addExercises(slug, exercises) {
    const lesson = await prisma.lesson.findUnique({ where: { slug } });
    if (!lesson) {
      console.log(`  ⚠️ Lesson not found: ${slug}`);
      return 0;
    }
    
    let added = 0;
    for (const ex of exercises) {
      try {
        await prisma.exercise.create({
          data: {
            lessonId: lesson.id,
            ...ex
          }
        });
        added++;
      } catch (e) {
        // Skip duplicates
      }
    }
    console.log(`  ✅ ${lesson.title}: ${added} exercises`);
    return added;
  }

  let totalAdded = 0;

  // ============================================================
  // CHAPTER 2: WHILE LOOPS
  // ============================================================
  console.log("📝 Chapter 2: While Loops");
  
  totalAdded += await addExercises('while-loops', [
    {
      number: 1,
      title: "Countdown Timer",
      prompt: "Write a while loop that counts down from 10 to 1, then prints 'Liftoff!'",
      type: "CODE",
      difficulty: "BEGINNER",
      xpReward: 10,
      order: 1,
      starterCode: `# Count down from 10 to 1
count = 10

# Write your while loop here

print("Liftoff!")`,
      solution: `count = 10
while count >= 1:
    print(count)
    count -= 1
print("Liftoff!")`,
      hints: ["Start with count = 10", "Loop while count >= 1", "Don't forget to decrement!"]
    },
    {
      number: 2,
      title: "Sum Until Negative",
      prompt: "Write a program that keeps asking for numbers and sums them. Stop when user enters a negative number.",
      type: "CODE",
      difficulty: "BEGINNER",
      xpReward: 15,
      order: 2,
      starterCode: `total = 0
# Keep asking for numbers until negative
# Hint: Use a while loop with a condition

print(f"Sum: {total}")`,
      solution: `total = 0
num = int(input("Enter a number (negative to stop): "))
while num >= 0:
    total += num
    num = int(input("Enter a number (negative to stop): "))
print(f"Sum: {total}")`,
      hints: ["Get input before the loop", "Check if number is >= 0", "Get new input inside loop"]
    },
    {
      number: 3,
      title: "Guess the Number",
      prompt: "Complete the guessing game. Keep asking until they guess correctly (the secret is 7).",
      type: "CODE",
      difficulty: "BEGINNER",
      xpReward: 15,
      order: 3,
      starterCode: `secret = 7
guess = 0

# Write while loop - keep going until guess equals secret
# Give hints: "Too low!" or "Too high!"

print("You got it!")`,
      solution: `secret = 7
guess = int(input("Guess the number: "))
while guess != secret:
    if guess < secret:
        print("Too low!")
    else:
        print("Too high!")
    guess = int(input("Guess again: "))
print("You got it!")`,
      hints: ["Loop while guess != secret", "Use if/else for hints"]
    },
    {
      number: 4,
      title: "Break vs Continue",
      prompt: "What does this code print?",
      type: "PREDICT_OUTPUT",
      difficulty: "BEGINNER",
      xpReward: 10,
      order: 4,
      starterCode: `i = 0
while i < 5:
    i += 1
    if i == 3:
        continue
    print(i)`,
      solution: "1\n2\n4\n5",
      hints: ["continue skips the rest of the loop body", "3 is skipped but loop continues"]
    },
    {
      number: 5,
      title: "Password Validator",
      prompt: "Keep asking for password until it's at least 8 characters. Use a while loop.",
      type: "CODE",
      difficulty: "INTERMEDIATE",
      xpReward: 20,
      order: 5,
      starterCode: `# Ask for password until valid (8+ characters)
password = ""

# Your while loop here

print("Password accepted!")`,
      solution: `password = input("Enter password (8+ chars): ")
while len(password) < 8:
    print("Too short!")
    password = input("Enter password (8+ chars): ")
print("Password accepted!")`,
      hints: ["Check len(password) < 8", "Keep asking inside the loop"]
    }
  ]);

  // ============================================================
  // CHAPTER 4: MODULES & FILES
  // ============================================================
  console.log("\n📝 Chapter 4: Modules & Files");

  totalAdded += await addExercises('introduction-to-modules', [
    {
      number: 1,
      title: "Import Math",
      prompt: "Import the math module and calculate the square root of 144",
      type: "CODE",
      difficulty: "BEGINNER",
      xpReward: 10,
      order: 1,
      starterCode: `# Import math module

# Calculate square root of 144
result = 

print(result)  # Should print 12.0`,
      solution: `import math
result = math.sqrt(144)
print(result)`,
      hints: ["Use import math", "Use math.sqrt()"]
    },
    {
      number: 2,
      title: "From Import",
      prompt: "Import only randint from random module and generate a number between 1 and 100",
      type: "CODE",
      difficulty: "BEGINNER",
      xpReward: 10,
      order: 2,
      starterCode: `# Import only randint from random

# Generate random number 1-100
number = 

print(number)`,
      solution: `from random import randint
number = randint(1, 100)
print(number)`,
      hints: ["Use from random import randint", "Call randint(1, 100) directly"]
    },
    {
      number: 3,
      title: "Import with Alias",
      prompt: "Import datetime as dt and print today's date",
      type: "CODE",
      difficulty: "BEGINNER",
      xpReward: 10,
      order: 3,
      starterCode: `# Import datetime as dt

# Print today's date
today = 

print(today)`,
      solution: `import datetime as dt
today = dt.date.today()
print(today)`,
      hints: ["Use import datetime as dt", "Use dt.date.today()"]
    },
    {
      number: 4,
      title: "Which Import?",
      prompt: "Which import style lets you use sqrt(16) without a prefix?",
      type: "MULTIPLE_CHOICE",
      difficulty: "BEGINNER",
      xpReward: 5,
      order: 4,
      starterCode: null,
      solution: "from math import sqrt",
      hints: ["from...import brings names directly into namespace"]
    },
    {
      number: 5,
      title: "Standard Library",
      prompt: "Use the os module to get the current working directory",
      type: "CODE",
      difficulty: "BEGINNER",
      xpReward: 10,
      order: 5,
      starterCode: `# Import os and get current directory

cwd = 

print(f"Current directory: {cwd}")`,
      solution: `import os
cwd = os.getcwd()
print(f"Current directory: {cwd}")`,
      hints: ["Use os.getcwd()"]
    }
  ]);

  totalAdded += await addExercises('creating-your-own-modules', [
    {
      number: 1,
      title: "__name__ Check",
      prompt: "What is __name__ when a module is imported (not run directly)?",
      type: "MULTIPLE_CHOICE",
      difficulty: "BEGINNER",
      xpReward: 5,
      order: 1,
      starterCode: null,
      solution: "The module's filename (without .py)",
      hints: ["It's only '__main__' when run directly"]
    },
    {
      number: 2,
      title: "Main Guard",
      prompt: "Write the if statement that checks if a module is being run directly",
      type: "FILL_BLANK",
      difficulty: "BEGINNER",
      xpReward: 10,
      order: 2,
      starterCode: `# Fill in the condition
if ______:
    print("Running directly!")
    main()`,
      solution: `if __name__ == "__main__":
    print("Running directly!")
    main()`,
      hints: ["Check if __name__ equals '__main__'"]
    },
    {
      number: 3,
      title: "Module Docstring",
      prompt: "Where should a module's docstring be placed?",
      type: "MULTIPLE_CHOICE",
      difficulty: "BEGINNER",
      xpReward: 5,
      order: 3,
      starterCode: null,
      solution: "At the very top of the file, before any code",
      hints: ["It's the first thing in the file"]
    }
  ]);

  totalAdded += await addExercises('reading-and-writing-files', [
    {
      number: 1,
      title: "Read Entire File",
      prompt: "Read the entire contents of 'data.txt' using a with statement",
      type: "CODE",
      difficulty: "BEGINNER",
      xpReward: 10,
      order: 1,
      starterCode: `# Read entire file content


print(content)`,
      solution: `with open('data.txt', 'r') as f:
    content = f.read()
print(content)`,
      hints: ["Use with open(...) as f:", "Use f.read() for entire file"]
    },
    {
      number: 2,
      title: "Write to File",
      prompt: "Write 'Hello, World!' to a file called 'output.txt'",
      type: "CODE",
      difficulty: "BEGINNER",
      xpReward: 10,
      order: 2,
      starterCode: `# Write to output.txt

`,
      solution: `with open('output.txt', 'w') as f:
    f.write('Hello, World!')`,
      hints: ["Use 'w' mode for writing", "Use f.write()"]
    },
    {
      number: 3,
      title: "File Modes",
      prompt: "Which mode opens a file for appending (adding to end)?",
      type: "MULTIPLE_CHOICE",
      difficulty: "BEGINNER",
      xpReward: 5,
      order: 3,
      starterCode: null,
      solution: "'a'",
      hints: ["'w' overwrites, 'r' reads, 'a' appends"]
    },
    {
      number: 4,
      title: "Read Lines",
      prompt: "Read a file line by line and print each line (stripped of whitespace)",
      type: "CODE",
      difficulty: "BEGINNER",
      xpReward: 15,
      order: 4,
      starterCode: `# Read and print each line from 'data.txt'

`,
      solution: `with open('data.txt', 'r') as f:
    for line in f:
        print(line.strip())`,
      hints: ["Iterate directly over the file object", "Use .strip() to remove \\n"]
    },
    {
      number: 5,
      title: "Why with Statement?",
      prompt: "What's the main advantage of using 'with open()' instead of just 'open()'?",
      type: "MULTIPLE_CHOICE",
      difficulty: "BEGINNER",
      xpReward: 5,
      order: 5,
      starterCode: null,
      solution: "Automatically closes the file, even if an error occurs",
      hints: ["Think about what happens if there's an exception"]
    }
  ]);

  totalAdded += await addExercises('working-with-csv-files', [
    {
      number: 1,
      title: "Read CSV with DictReader",
      prompt: "Read 'employees.csv' and print each person's name and salary",
      type: "CODE",
      difficulty: "INTERMEDIATE",
      xpReward: 15,
      order: 1,
      starterCode: `import csv

# Read employees.csv (columns: name, age, salary)
# Print: "Name: X, Salary: Y" for each row

`,
      solution: `import csv
with open('employees.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(f"Name: {row['name']}, Salary: {row['salary']}")`,
      hints: ["Use csv.DictReader", "Access columns like row['name']"]
    },
    {
      number: 2,
      title: "Write CSV",
      prompt: "Write a list of dictionaries to a CSV file with headers",
      type: "CODE",
      difficulty: "INTERMEDIATE",
      xpReward: 20,
      order: 2,
      starterCode: `import csv

data = [
    {'name': 'Alice', 'score': 95},
    {'name': 'Bob', 'score': 87}
]

# Write to 'scores.csv' with headers

`,
      solution: `import csv
data = [
    {'name': 'Alice', 'score': 95},
    {'name': 'Bob', 'score': 87}
]
with open('scores.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'score'])
    writer.writeheader()
    writer.writerows(data)`,
      hints: ["Use csv.DictWriter", "Call writeheader() first", "Use newline=''"]
    }
  ]);

  totalAdded += await addExercises('working-with-json', [
    {
      number: 1,
      title: "Parse JSON String",
      prompt: "Parse this JSON string and print the name",
      type: "CODE",
      difficulty: "BEGINNER",
      xpReward: 10,
      order: 1,
      starterCode: `import json

json_str = '{"name": "Alice", "age": 30}'

# Parse and print the name

`,
      solution: `import json
json_str = '{"name": "Alice", "age": 30}'
data = json.loads(json_str)
print(data['name'])`,
      hints: ["Use json.loads() for strings", "Access like a dictionary"]
    },
    {
      number: 2,
      title: "JSON to File",
      prompt: "Save a dictionary to 'config.json' with nice formatting",
      type: "CODE",
      difficulty: "BEGINNER",
      xpReward: 15,
      order: 2,
      starterCode: `import json

config = {'theme': 'dark', 'font_size': 14}

# Save to config.json with indent=2

`,
      solution: `import json
config = {'theme': 'dark', 'font_size': 14}
with open('config.json', 'w') as f:
    json.dump(config, f, indent=2)`,
      hints: ["Use json.dump() for files", "Use indent=2 for pretty printing"]
    },
    {
      number: 3,
      title: "load vs loads",
      prompt: "What's the difference between json.load() and json.loads()?",
      type: "MULTIPLE_CHOICE",
      difficulty: "BEGINNER",
      xpReward: 5,
      order: 3,
      starterCode: null,
      solution: "load() reads from a file, loads() parses a string",
      hints: ["The 's' stands for 'string'"]
    }
  ]);

  // ============================================================
  // CHAPTER 6: TESTING
  // ============================================================
  console.log("\n📝 Chapter 6: Testing");

  totalAdded += await addExercises('unittest-framework', [
    {
      number: 1,
      title: "Write a Test Case",
      prompt: "Write a test that checks if multiply(3, 4) returns 12",
      type: "CODE",
      difficulty: "INTERMEDIATE",
      xpReward: 15,
      order: 1,
      starterCode: `import unittest

def multiply(a, b):
    return a * b

class TestMultiply(unittest.TestCase):
    def test_positive(self):
        # Write your assertion here
        pass`,
      solution: `import unittest

def multiply(a, b):
    return a * b

class TestMultiply(unittest.TestCase):
    def test_positive(self):
        self.assertEqual(multiply(3, 4), 12)`,
      hints: ["Use self.assertEqual(actual, expected)"]
    },
    {
      number: 2,
      title: "Test for Exception",
      prompt: "Write a test that verifies divide(1, 0) raises ZeroDivisionError",
      type: "CODE",
      difficulty: "INTERMEDIATE",
      xpReward: 20,
      order: 2,
      starterCode: `import unittest

def divide(a, b):
    return a / b

class TestDivide(unittest.TestCase):
    def test_zero_division(self):
        # Test that divide(1, 0) raises ZeroDivisionError
        pass`,
      solution: `import unittest

def divide(a, b):
    return a / b

class TestDivide(unittest.TestCase):
    def test_zero_division(self):
        with self.assertRaises(ZeroDivisionError):
            divide(1, 0)`,
      hints: ["Use self.assertRaises() as a context manager"]
    },
    {
      number: 3,
      title: "Which Assertion?",
      prompt: "Which assertion checks if a value is in a list?",
      type: "MULTIPLE_CHOICE",
      difficulty: "BEGINNER",
      xpReward: 5,
      order: 3,
      starterCode: null,
      solution: "assertIn()",
      hints: ["It's like 'in' keyword as an assertion"]
    }
  ]);

  totalAdded += await addExercises('pytest-introduction', [
    {
      number: 1,
      title: "Simple pytest Test",
      prompt: "Write a pytest test that checks add(2, 3) == 5",
      type: "CODE",
      difficulty: "BEGINNER",
      xpReward: 10,
      order: 1,
      starterCode: `def add(a, b):
    return a + b

# Write a test function (must start with test_)
`,
      solution: `def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5`,
      hints: ["Function name must start with test_", "Just use assert"]
    },
    {
      number: 2,
      title: "pytest Fixture",
      prompt: "Create a fixture that returns a sample list [1, 2, 3, 4, 5]",
      type: "CODE",
      difficulty: "INTERMEDIATE",
      xpReward: 15,
      order: 2,
      starterCode: `import pytest

# Create a fixture called 'sample_list'


def test_sum(sample_list):
    assert sum(sample_list) == 15`,
      solution: `import pytest

@pytest.fixture
def sample_list():
    return [1, 2, 3, 4, 5]

def test_sum(sample_list):
    assert sum(sample_list) == 15`,
      hints: ["Use @pytest.fixture decorator", "Return the data from the fixture"]
    },
    {
      number: 3,
      title: "Parametrized Test",
      prompt: "Use @pytest.mark.parametrize to test add() with multiple inputs",
      type: "CODE",
      difficulty: "INTERMEDIATE",
      xpReward: 20,
      order: 3,
      starterCode: `import pytest

def add(a, b):
    return a + b

# Test with: (1,1,2), (2,3,5), (0,0,0)
`,
      solution: `import pytest

def add(a, b):
    return a + b

@pytest.mark.parametrize("a,b,expected", [
    (1, 1, 2),
    (2, 3, 5),
    (0, 0, 0),
])
def test_add(a, b, expected):
    assert add(a, b) == expected`,
      hints: ["Use @pytest.mark.parametrize", "First arg is param names as string"]
    }
  ]);

  // ============================================================
  // CHAPTER 7: CONTEXT MANAGERS & LOGGING
  // ============================================================
  console.log("\n📝 Chapter 7: Context Managers & Logging");

  totalAdded += await addExercises('context-managers', [
    {
      number: 1,
      title: "Create a Timer Context Manager",
      prompt: "Create a context manager that prints how long a block took to execute",
      type: "CODE",
      difficulty: "INTERMEDIATE",
      xpReward: 25,
      order: 1,
      starterCode: `from contextlib import contextmanager
import time

@contextmanager
def timer():
    # Start timing
    
    yield
    
    # Print elapsed time

# Test it
with timer():
    time.sleep(1)`,
      solution: `from contextlib import contextmanager
import time

@contextmanager
def timer():
    start = time.time()
    yield
    elapsed = time.time() - start
    print(f"Took {elapsed:.2f} seconds")

with timer():
    time.sleep(1)`,
      hints: ["Record start time before yield", "Calculate elapsed after yield"]
    },
    {
      number: 2,
      title: "Context Manager Methods",
      prompt: "What two methods must a class implement to be a context manager?",
      type: "MULTIPLE_CHOICE",
      difficulty: "BEGINNER",
      xpReward: 5,
      order: 2,
      starterCode: null,
      solution: "__enter__ and __exit__",
      hints: ["Think about entering and exiting the 'with' block"]
    }
  ]);

  totalAdded += await addExercises('logging-in-python', [
    {
      number: 1,
      title: "Basic Logging Setup",
      prompt: "Set up logging to show DEBUG level messages with timestamps",
      type: "CODE",
      difficulty: "BEGINNER",
      xpReward: 15,
      order: 1,
      starterCode: `import logging

# Configure logging with DEBUG level and format showing time

logging.debug("This is a debug message")
logging.info("This is info")`,
      solution: `import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

logging.debug("This is a debug message")
logging.info("This is info")`,
      hints: ["Use logging.basicConfig()", "Set level=logging.DEBUG"]
    },
    {
      number: 2,
      title: "Log Levels Order",
      prompt: "Put these log levels in order from least to most severe: ERROR, DEBUG, WARNING, INFO, CRITICAL",
      type: "MULTIPLE_CHOICE",
      difficulty: "BEGINNER",
      xpReward: 5,
      order: 2,
      starterCode: null,
      solution: "DEBUG, INFO, WARNING, ERROR, CRITICAL",
      hints: ["DEBUG is for detailed diagnostic info (least severe)"]
    }
  ]);

  // ============================================================
  // CHAPTER 8: ADVANCED OOP
  // ============================================================
  console.log("\n📝 Chapter 8: Advanced OOP");

  totalAdded += await addExercises('dataclasses', [
    {
      number: 1,
      title: "Create a Dataclass",
      prompt: "Create a Product dataclass with name (str), price (float), and quantity (int, default 0)",
      type: "CODE",
      difficulty: "BEGINNER",
      xpReward: 15,
      order: 1,
      starterCode: `from dataclasses import dataclass

# Create Product dataclass


# Test
p = Product("Widget", 9.99)
print(p)`,
      solution: `from dataclasses import dataclass

@dataclass
class Product:
    name: str
    price: float
    quantity: int = 0

p = Product("Widget", 9.99)
print(p)`,
      hints: ["Use @dataclass decorator", "Type hints are required"]
    },
    {
      number: 2,
      title: "Frozen Dataclass",
      prompt: "What does frozen=True do in a dataclass?",
      type: "MULTIPLE_CHOICE",
      difficulty: "BEGINNER",
      xpReward: 5,
      order: 2,
      starterCode: null,
      solution: "Makes the dataclass immutable (can't modify after creation)",
      hints: ["Think about what 'frozen' means"]
    }
  ]);

  totalAdded += await addExercises('properties-and-descriptors', [
    {
      number: 1,
      title: "Create a Property",
      prompt: "Create a Circle class with a radius property that can't be negative",
      type: "CODE",
      difficulty: "INTERMEDIATE",
      xpReward: 20,
      order: 1,
      starterCode: `class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    # Add @property for radius
    # Add @radius.setter that raises ValueError if negative

c = Circle(5)
print(c.radius)  # 5
c.radius = -1    # Should raise ValueError`,
      solution: `class Circle:
    def __init__(self, radius):
        self.radius = radius  # Uses the setter
    
    @property
    def radius(self):
        return self._radius
    
    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value

c = Circle(5)
print(c.radius)`,
      hints: ["Use @property for getter", "Use @radius.setter for setter"]
    },
    {
      number: 2,
      title: "Computed Property",
      prompt: "Add a read-only 'area' property to the Circle class",
      type: "CODE",
      difficulty: "INTERMEDIATE",
      xpReward: 15,
      order: 2,
      starterCode: `import math

class Circle:
    def __init__(self, radius):
        self.radius = radius
    
    # Add read-only area property
    
c = Circle(5)
print(c.area)  # Should print ~78.54`,
      solution: `import math

class Circle:
    def __init__(self, radius):
        self.radius = radius
    
    @property
    def area(self):
        return math.pi * self.radius ** 2

c = Circle(5)
print(c.area)`,
      hints: ["Just @property, no setter = read-only"]
    }
  ]);

  totalAdded += await addExercises('class-and-static-methods', [
    {
      number: 1,
      title: "Alternative Constructor",
      prompt: "Add a class method 'from_string' that creates a Person from 'name,age' string",
      type: "CODE",
      difficulty: "INTERMEDIATE",
      xpReward: 20,
      order: 1,
      starterCode: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    # Add from_string class method

p = Person.from_string("Alice,30")
print(p.name, p.age)  # Alice 30`,
      solution: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    @classmethod
    def from_string(cls, s):
        name, age = s.split(',')
        return cls(name, int(age))

p = Person.from_string("Alice,30")
print(p.name, p.age)`,
      hints: ["Use @classmethod", "First param is cls", "Return cls(...)"]
    },
    {
      number: 2,
      title: "Static Method",
      prompt: "When should you use @staticmethod instead of @classmethod?",
      type: "MULTIPLE_CHOICE",
      difficulty: "BEGINNER",
      xpReward: 5,
      order: 2,
      starterCode: null,
      solution: "When the method doesn't need access to class or instance",
      hints: ["Static methods are just utility functions in a class"]
    }
  ]);

  totalAdded += await addExercises('abstract-base-classes', [
    {
      number: 1,
      title: "Create an Abstract Class",
      prompt: "Create an abstract Animal class with an abstract 'speak' method",
      type: "CODE",
      difficulty: "INTERMEDIATE",
      xpReward: 20,
      order: 1,
      starterCode: `from abc import ABC, abstractmethod

# Create abstract Animal class with abstract speak() method


class Dog(Animal):
    def speak(self):
        return "Woof!"

d = Dog()
print(d.speak())`,
      solution: `from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return "Woof!"

d = Dog()
print(d.speak())`,
      hints: ["Inherit from ABC", "Use @abstractmethod decorator"]
    }
  ]);

  // ============================================================
  // CHAPTER 13: HYPOTHESIS TESTING
  // ============================================================
  console.log("\n📝 Chapter 13: Hypothesis Testing");

  totalAdded += await addExercises('hypothesis-testing-introduction', [
    {
      number: 1,
      title: "Null Hypothesis",
      prompt: "For testing if a new drug is effective, what is the null hypothesis?",
      type: "MULTIPLE_CHOICE",
      difficulty: "BEGINNER",
      xpReward: 5,
      order: 1,
      starterCode: null,
      solution: "The drug has no effect",
      hints: ["Null hypothesis = nothing special is happening"]
    },
    {
      number: 2,
      title: "Coin Fairness Test",
      prompt: "You flip a coin 100 times and get 65 heads. Test if the coin is fair (α=0.05)",
      type: "CODE",
      difficulty: "INTERMEDIATE",
      xpReward: 20,
      order: 2,
      starterCode: `from scipy import stats

heads = 65
n = 100

# Perform binomial test for p=0.5
result = 

print(f"p-value: {result.pvalue:.4f}")
if result.pvalue < 0.05:
    print("Reject H0: Coin appears biased")
else:
    print("Cannot reject H0: Coin appears fair")`,
      solution: `from scipy import stats

heads = 65
n = 100

result = stats.binomtest(heads, n=n, p=0.5)

print(f"p-value: {result.pvalue:.4f}")
if result.pvalue < 0.05:
    print("Reject H0: Coin appears biased")
else:
    print("Cannot reject H0: Coin appears fair")`,
      hints: ["Use stats.binomtest()", "p=0.5 for fair coin"]
    },
    {
      number: 3,
      title: "P-Value Interpretation",
      prompt: "What does a p-value of 0.03 mean?",
      type: "MULTIPLE_CHOICE",
      difficulty: "BEGINNER",
      xpReward: 5,
      order: 3,
      starterCode: null,
      solution: "If H0 is true, there's a 3% chance of seeing data this extreme",
      hints: ["P-value is NOT the probability H0 is true!"]
    }
  ]);

  totalAdded += await addExercises('common-statistical-tests', [
    {
      number: 1,
      title: "One-Sample T-Test",
      prompt: "Test if the mean of sample differs from 100",
      type: "CODE",
      difficulty: "INTERMEDIATE",
      xpReward: 20,
      order: 1,
      starterCode: `from scipy import stats
import numpy as np

sample = [98, 102, 105, 97, 103, 99, 101, 104]

# Perform one-sample t-test against mean of 100
result = 

print(f"t-statistic: {result.statistic:.3f}")
print(f"p-value: {result.pvalue:.4f}")`,
      solution: `from scipy import stats
import numpy as np

sample = [98, 102, 105, 97, 103, 99, 101, 104]

result = stats.ttest_1samp(sample, popmean=100)

print(f"t-statistic: {result.statistic:.3f}")
print(f"p-value: {result.pvalue:.4f}")`,
      hints: ["Use stats.ttest_1samp()", "Second arg is popmean"]
    },
    {
      number: 2,
      title: "Two-Sample T-Test",
      prompt: "Test if two groups have different means",
      type: "CODE",
      difficulty: "INTERMEDIATE",
      xpReward: 20,
      order: 2,
      starterCode: `from scipy import stats

group_a = [85, 90, 88, 92, 87]
group_b = [78, 82, 80, 85, 79]

# Perform independent two-sample t-test
result = 

print(f"p-value: {result.pvalue:.4f}")`,
      solution: `from scipy import stats

group_a = [85, 90, 88, 92, 87]
group_b = [78, 82, 80, 85, 79]

result = stats.ttest_ind(group_a, group_b)

print(f"p-value: {result.pvalue:.4f}")`,
      hints: ["Use stats.ttest_ind() for independent samples"]
    },
    {
      number: 3,
      title: "Which Test?",
      prompt: "You want to compare scores BEFORE and AFTER training for the SAME people. Which test?",
      type: "MULTIPLE_CHOICE",
      difficulty: "BEGINNER",
      xpReward: 5,
      order: 3,
      starterCode: null,
      solution: "Paired t-test (ttest_rel)",
      hints: ["Same subjects measured twice = paired"]
    }
  ]);

  // ============================================================
  // SUMMARY
  // ============================================================
  const totalExercises = await prisma.exercise.count();
  
  console.log("\n" + "=".repeat(50));
  console.log("🎉 EXERCISES ADDED SUCCESSFULLY!");
  console.log("=".repeat(50));
  console.log(`New exercises added: ${totalAdded}`);
  console.log(`Total exercises in database: ${totalExercises}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
