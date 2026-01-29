import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 8 Part 5: Lessons 8.4.1-8.4.3 (Final)...\n");

  const section8_4 = await prisma.section.findFirst({ where: { number: 8.4 } });
  if (!section8_4) throw new Error("Section 8.4 not found.");

  // ==================== LESSON 8.4.1 ====================
  const lesson8_4_1 = await prisma.lesson.upsert({
    where: { slug: "generators-yield" },
    update: {},
    create: {
      sectionId: section8_4.id,
      number: 8.41,
      title: "Generators and yield",
      slug: "generators-yield",
      objectives: [
        "Understand generators vs regular functions",
        "Use yield to produce values lazily",
        "Know memory benefits of generators",
        "Iterate over generator objects",
      ],
      content: `# Generators and yield

## What is a Generator?

A function that **yields** values one at a time instead of returning all at once:

\`\`\`python
def count_up(n):
    i = 0
    while i < n:
        yield i  # Produces value, pauses here
        i += 1
\`\`\`

## yield vs return

| return | yield |
|--------|-------|
| Returns once, function ends | Can yield many times |
| All values at once | One value at a time |
| Uses memory for all | Uses memory for one |
| List: [1, 2, 3, ...] | Generator object |

## Why Use Generators?

**Memory efficiency** - don't need all values at once:

\`\`\`python
# Bad: Creates list of 1 million items in memory
def get_squares_list(n):
    return [x**2 for x in range(n)]

# Good: Generates one at a time
def get_squares_gen(n):
    for x in range(n):
        yield x**2
\`\`\`

## Using Generators

\`\`\`python
gen = count_up(3)  # Creates generator object

print(next(gen))   # 0 - first yield
print(next(gen))   # 1 - second yield
print(next(gen))   # 2 - third yield
# next(gen) would raise StopIteration

# Or use in for loop
for num in count_up(3):
    print(num)
\`\`\`

## Generator Expressions

Like list comprehensions but lazy:

\`\`\`python
squares_list = [x**2 for x in range(1000)]  # List in memory
squares_gen = (x**2 for x in range(1000))   # Generator
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-generator",
          title: "Basic Generator",
          code: "def count_up(n):\n    \"\"\"Generate numbers from 0 to n-1.\"\"\"\n    print(\"Generator starting\")\n    i = 0\n    while i < n:\n        print(f\"  About to yield {i}\")\n        yield i\n        print(f\"  Resumed after yielding {i}\")\n        i += 1\n    print(\"Generator finished\")\n\n# Create generator object\ngen = count_up(3)\nprint(f\"Generator object: {gen}\")\nprint()\n\n# Get values one at a time\nprint(f\"First: {next(gen)}\")\nprint(f\"Second: {next(gen)}\")\nprint(f\"Third: {next(gen)}\")\n\n# No more values\ntry:\n    next(gen)\nexcept StopIteration:\n    print(\"StopIteration raised!\")",
          description: "How yield pauses and resumes",
        },
        {
          id: "memory-efficiency",
          title: "Memory Efficiency",
          code: "import sys\n\n# List approach - stores everything in memory\ndef squares_list(n):\n    return [x**2 for x in range(n)]\n\n# Generator approach - one at a time\ndef squares_gen(n):\n    for x in range(n):\n        yield x**2\n\n# Compare memory usage\nn = 10000\n\nlst = squares_list(n)\ngen = squares_gen(n)\n\nprint(f\"List size: {sys.getsizeof(lst):,} bytes\")\nprint(f\"Generator size: {sys.getsizeof(gen):,} bytes\")\n\n# Both can be iterated\nprint(f\"\\nSum from list: {sum(lst)}\")\nprint(f\"Sum from generator: {sum(squares_gen(n))}\")\n\n# For huge datasets, generators are essential\nprint(f\"\\nGenerator for 1 million items: {sys.getsizeof(squares_gen(1000000)):,} bytes\")",
          description: "Generators save memory",
        },
        {
          id: "practical-generator",
          title: "Practical Generator Example",
          code: "def read_large_file(lines):\n    \"\"\"Simulate reading a large file line by line.\"\"\"\n    for i, line in enumerate(lines):\n        yield f\"Line {i}: {line}\"\n\ndef filter_lines(lines, keyword):\n    \"\"\"Generator that filters lines containing keyword.\"\"\"\n    for line in lines:\n        if keyword.lower() in line.lower():\n            yield line\n\n# Simulate a large file\nlog_lines = [\n    \"INFO: System started\",\n    \"ERROR: Connection failed\",\n    \"INFO: User logged in\",\n    \"ERROR: Database timeout\",\n    \"WARNING: Low memory\",\n    \"ERROR: File not found\",\n]\n\n# Chain generators - very memory efficient!\nprint(\"All errors:\")\nfor line in filter_lines(log_lines, \"ERROR\"):\n    print(f\"  {line}\")\n\nprint(\"\\nProcessing with line numbers:\")\nfor processed in read_large_file(log_lines[:3]):\n    print(f\"  {processed}\")",
          description: "Generators for data processing",
        },
        {
          id: "generator-expressions",
          title: "Generator Expressions",
          code: "# List comprehension (creates list)\nsquares_list = [x**2 for x in range(5)]\nprint(f\"List: {squares_list}\")\nprint(f\"Type: {type(squares_list)}\")\n\n# Generator expression (creates generator)\nsquares_gen = (x**2 for x in range(5))\nprint(f\"\\nGenerator: {squares_gen}\")\nprint(f\"Type: {type(squares_gen)}\")\n\n# Use the generator\nprint(f\"\\nIterating generator:\")\nfor sq in squares_gen:\n    print(f\"  {sq}\")\n\n# Generator expressions in functions\nnumbers = [1, 2, 3, 4, 5]\n\n# These are equivalent but generator is more efficient\nsum_list = sum([x**2 for x in numbers])  # Creates list first\nsum_gen = sum(x**2 for x in numbers)     # No intermediate list!\n\nprint(f\"\\nSum (list): {sum_list}\")\nprint(f\"Sum (gen): {sum_gen}\")",
          description: "Generator expressions vs list comprehensions",
        },
      ]),
      keyPoints: [
        "yield produces values one at a time",
        "Generator pauses at yield, resumes on next()",
        "Memory efficient - only one value in memory",
        "Use for large datasets or infinite sequences",
        "for loop automatically calls next()",
        "StopIteration signals end of generator",
        "Generator expressions: (x for x in iterable)",
        "Can only iterate once through a generator",
      ],
      hardwareDemo: "See generator pause at yield. Watch minimal memory usage vs list.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson8_4_1.number}: ${lesson8_4_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_4_1.id,
        number: 1,
        title: "First Generator",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Write a generator that yields numbers 1 to n.",
        starterCode: "def count_to(n):\n    # Yield 1, 2, 3, ... n\n    pass\n\nfor num in count_to(5):\n    print(num)",
        solution: "def count_to(n):\n    i = 1\n    while i <= n:\n        yield i\n        i += 1\n\nfor num in count_to(5):\n    print(num)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "1\\n2\\n3\\n4\\n5", description: "Generator works" }]),
        hints: ["Use while loop", "yield i then increment"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson8_4_1.id,
        number: 2,
        title: "Generator vs List",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create both a list and generator for squares, compare with sum().",
        starterCode: "# List comprehension for squares of 1-5\nsquares_list = # Your code\n\n# Generator expression for squares of 1-5\nsquares_gen = # Your code\n\nprint(f\"List: {squares_list}\")\nprint(f\"Sum from generator: {sum(squares_gen)}\")",
        solution: "squares_list = [x**2 for x in range(1, 6)]\nsquares_gen = (x**2 for x in range(1, 6))\n\nprint(f\"List: {squares_list}\")\nprint(f\"Sum from generator: {sum(squares_gen)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[1, 4, 9, 16, 25] and 55", description: "Both work" }]),
        hints: ["[x**2 for x] for list", "(x**2 for x) for generator"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson8_4_1.id,
        number: 3,
        title: "Fibonacci Generator",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a generator that yields the first n Fibonacci numbers.",
        starterCode: "def fibonacci(n):\n    \"\"\"Yield first n Fibonacci numbers.\"\"\"\n    # 0, 1, 1, 2, 3, 5, 8, ...\n    pass\n\nfor fib in fibonacci(10):\n    print(fib, end=\" \")",
        solution: "def fibonacci(n):\n    a, b = 0, 1\n    count = 0\n    while count < n:\n        yield a\n        a, b = b, a + b\n        count += 1\n\nfor fib in fibonacci(10):\n    print(fib, end=\" \")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "0 1 1 2 3 5 8 13 21 34", description: "Fibonacci works" }]),
        hints: ["Start with a=0, b=1", "yield a, then a,b = b,a+b"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson8_4_1.id,
        number: 4,
        title: "Filter Generator",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a generator that yields only even numbers from an iterable.",
        starterCode: "def evens(iterable):\n    \"\"\"Yield only even numbers from iterable.\"\"\"\n    pass\n\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nfor even in evens(numbers):\n    print(even, end=\" \")",
        solution: "def evens(iterable):\n    for num in iterable:\n        if num % 2 == 0:\n            yield num\n\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nfor even in evens(numbers):\n    print(even, end=\" \")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "2 4 6 8 10", description: "Filter works" }]),
        hints: ["Loop through iterable", "yield only if num % 2 == 0"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson8_4_1.id,
        number: 5,
        title: "Infinite Generator",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write an infinite generator that yields powers of 2. Use it to get first 10.",
        starterCode: "def powers_of_two():\n    \"\"\"Infinite generator: 1, 2, 4, 8, 16, ...\"\"\"\n    pass\n\n# Get first 10 powers of 2\ngen = powers_of_two()\nresult = [next(gen) for _ in range(10)]\nprint(result)",
        solution: "def powers_of_two():\n    n = 0\n    while True:  # Infinite loop!\n        yield 2 ** n\n        n += 1\n\ngen = powers_of_two()\nresult = [next(gen) for _ in range(10)]\nprint(result)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[1, 2, 4, 8, 16, 32, 64, 128, 256, 512]", description: "Infinite generator" }]),
        hints: ["while True for infinite", "yield 2**n then increment n"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 8.4.1`);

  // ==================== LESSON 8.4.2 ====================
  const lesson8_4_2 = await prisma.lesson.upsert({
    where: { slug: "class-design-principles" },
    update: {},
    create: {
      sectionId: section8_4.id,
      number: 8.42,
      title: "Class Design Principles",
      slug: "class-design-principles",
      objectives: [
        "Apply single responsibility principle",
        "Understand cohesion and coupling",
        "Know when to create a new class",
        "Choose between classes and functions",
      ],
      content: `# Class Design Principles

## Single Responsibility Principle (SRP)

A class should have **one reason to change**:

\`\`\`python
# BAD: Does too many things
class User:
    def __init__(self, name):
        self.name = name
    def save_to_database(self): ...
    def send_email(self): ...
    def generate_report(self): ...

# GOOD: Single responsibility
class User:
    def __init__(self, name):
        self.name = name

class UserRepository:
    def save(self, user): ...

class EmailService:
    def send(self, user, message): ...
\`\`\`

## Cohesion

How related are the methods/data in a class?

**High cohesion** (good): Methods work with same data
**Low cohesion** (bad): Unrelated methods grouped together

\`\`\`python
# High cohesion - all about rectangles
class Rectangle:
    def __init__(self, w, h):
        self.width, self.height = w, h
    def area(self): ...
    def perimeter(self): ...
    def scale(self, factor): ...
\`\`\`

## Coupling

How dependent are classes on each other?

**Loose coupling** (good): Classes work independently
**Tight coupling** (bad): Changes ripple everywhere

## When to Create a Class

Create a class when:
- Grouping related data and behavior
- Need multiple instances with same structure
- Modeling a real-world entity
- Need to maintain state over time

Use functions when:
- Stateless transformation
- One-off operation
- Simple utility

## Class vs Functions

| Use Class | Use Function |
|-----------|-------------|
| Has state | Stateless |
| Multiple instances | Single operation |
| Identity matters | Just transform data |
| Complex behavior | Simple computation |`,
      codeExamples: JSON.stringify([
        {
          id: "single-responsibility",
          title: "Single Responsibility Principle",
          code: "# BAD: UserManager does too many things\nclass UserManagerBad:\n    def __init__(self):\n        self.users = []\n    \n    def add_user(self, name, email):\n        self.users.append({\"name\": name, \"email\": email})\n    \n    def send_welcome_email(self, user):  # Email responsibility\n        print(f\"Sending email to {user['email']}\")\n    \n    def save_to_file(self, filename):     # File responsibility\n        print(f\"Saving to {filename}\")\n    \n    def generate_report(self):            # Report responsibility\n        print(\"Generating report...\")\n\n# GOOD: Separate responsibilities\nclass User:\n    def __init__(self, name, email):\n        self.name = name\n        self.email = email\n\nclass UserRepository:\n    def __init__(self):\n        self.users = []\n    \n    def add(self, user):\n        self.users.append(user)\n    \n    def save(self, filename):\n        print(f\"Saving {len(self.users)} users to {filename}\")\n\nclass EmailService:\n    def send_welcome(self, user):\n        print(f\"Welcome email to {user.email}\")\n\n# Usage\nrepo = UserRepository()\nemail = EmailService()\n\nuser = User(\"Alice\", \"alice@example.com\")\nrepo.add(user)\nemail.send_welcome(user)\nrepo.save(\"users.txt\")",
          description: "Each class has one job",
        },
        {
          id: "high-cohesion",
          title: "High Cohesion",
          code: "# HIGH COHESION: All methods relate to circle calculations\nclass Circle:\n    def __init__(self, radius):\n        self.radius = radius\n    \n    def area(self):\n        import math\n        return math.pi * self.radius ** 2\n    \n    def circumference(self):\n        import math\n        return 2 * math.pi * self.radius\n    \n    def diameter(self):\n        return 2 * self.radius\n    \n    def scale(self, factor):\n        self.radius *= factor\n\n# All methods work with self.radius - highly cohesive!\nc = Circle(5)\nprint(f\"Radius: {c.radius}\")\nprint(f\"Area: {c.area():.2f}\")\nprint(f\"Circumference: {c.circumference():.2f}\")\nc.scale(2)\nprint(f\"After scaling: radius = {c.radius}\")",
          description: "All methods work together",
        },
        {
          id: "loose-coupling",
          title: "Loose Coupling",
          code: "# LOOSE COUPLING: Classes don't depend on each other's internals\n\nclass OrderItem:\n    def __init__(self, name, price, quantity):\n        self.name = name\n        self.price = price\n        self.quantity = quantity\n    \n    def total(self):\n        return self.price * self.quantity\n\nclass Order:\n    def __init__(self):\n        self.items = []\n    \n    def add_item(self, item):  # Takes any object with total() method\n        self.items.append(item)\n    \n    def total(self):\n        return sum(item.total() for item in self.items)\n\nclass Receipt:\n    def print_order(self, order):  # Takes any object with items and total()\n        print(\"Receipt:\")\n        for item in order.items:\n            print(f\"  {item.name}: ${item.total():.2f}\")\n        print(f\"Total: ${order.total():.2f}\")\n\n# Classes work together but aren't tightly bound\norder = Order()\norder.add_item(OrderItem(\"Book\", 15.00, 2))\norder.add_item(OrderItem(\"Pen\", 2.50, 3))\n\nreceipt = Receipt()\nreceipt.print_order(order)",
          description: "Classes interact through interfaces",
        },
        {
          id: "class-vs-function",
          title: "When to Use Class vs Function",
          code: "# USE FUNCTION: Stateless transformation\ndef calculate_tax(amount, rate=0.08):\n    return amount * rate\n\nprint(f\"Tax on $100: ${calculate_tax(100):.2f}\")\n\n# USE CLASS: Needs to maintain state\nclass ShoppingCart:\n    def __init__(self):\n        self.items = []  # State!\n    \n    def add(self, item, price):\n        self.items.append({\"item\": item, \"price\": price})\n    \n    def total(self):\n        return sum(i[\"price\"] for i in self.items)\n    \n    def clear(self):\n        self.items = []\n\ncart = ShoppingCart()\ncart.add(\"Book\", 20)\ncart.add(\"Coffee\", 5)\nprint(f\"Cart total: ${cart.total()}\")\nprint(f\"With tax: ${cart.total() + calculate_tax(cart.total()):.2f}\")\n\n# The cart maintains state between operations\n# The tax function just computes and returns",
          description: "Choose based on state needs",
        },
      ]),
      keyPoints: [
        "Single Responsibility: one reason to change",
        "High cohesion: related methods/data together",
        "Loose coupling: minimize dependencies",
        "Create class for state + behavior",
        "Use functions for stateless operations",
        "Small, focused classes are better",
        "Classes model entities, functions transform data",
        "If class has unrelated methods, split it",
      ],
      hardwareDemo: "Compare tightly vs loosely coupled code. See ripple effects of changes.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson8_4_2.number}: ${lesson8_4_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_4_2.id,
        number: 1,
        title: "Identify SRP Violation",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "Which class violates Single Responsibility Principle?",
        starterCode: "# A: class Calculator: add(), subtract(), multiply()\n# B: class User: login(), save_to_db(), send_email(), generate_pdf()\n# C: class Rectangle: area(), perimeter(), scale()",
        solution: "B: User does authentication, database, email, AND reports",
        testCases: JSON.stringify([
          { input: "B", expectedOutput: "true", description: "Correct!" },
          { input: "A", expectedOutput: "false", description: "Calculator is focused" },
          { input: "C", expectedOutput: "false", description: "Rectangle is focused" },
        ]),
        hints: ["Count distinct responsibilities", "Each should have ONE job"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson8_4_2.id,
        number: 2,
        title: "Split Responsibilities",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Split this class into separate classes with single responsibilities.",
        starterCode: "# BAD: Does too much\nclass BlogPost:\n    def __init__(self, title, content):\n        self.title = title\n        self.content = content\n    \n    def save_to_database(self):\n        print(f\"Saving '{self.title}' to database\")\n    \n    def send_notification(self, email):\n        print(f\"Notifying {email} about '{self.title}'\")\n\n# Refactor into separate classes",
        solution: "class BlogPost:\n    def __init__(self, title, content):\n        self.title = title\n        self.content = content\n\nclass BlogRepository:\n    def save(self, post):\n        print(f\"Saving '{post.title}' to database\")\n\nclass NotificationService:\n    def notify(self, email, post):\n        print(f\"Notifying {email} about '{post.title}'\")\n\n# Usage\npost = BlogPost(\"Hello World\", \"My first post\")\nrepo = BlogRepository()\nnotifier = NotificationService()\n\nrepo.save(post)\nnotifier.notify(\"reader@example.com\", post)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Three separate classes", description: "Responsibilities split" }]),
        hints: ["BlogPost: just data", "Repository: database ops", "Service: notifications"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson8_4_2.id,
        number: 3,
        title: "Class or Function?",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement: area calculator (function) and Counter that tracks count (class).",
        starterCode: "# Implement as FUNCTION (stateless)\ndef calculate_rectangle_area(width, height):\n    pass\n\n# Implement as CLASS (needs state)\nclass Counter:\n    pass\n\n# Test\nprint(f\"Area: {calculate_rectangle_area(5, 3)}\")\n\nc = Counter()\nc.increment()\nc.increment()\nprint(f\"Count: {c.get_count()}\")",
        solution: "def calculate_rectangle_area(width, height):\n    return width * height\n\nclass Counter:\n    def __init__(self):\n        self._count = 0\n    \n    def increment(self):\n        self._count += 1\n    \n    def get_count(self):\n        return self._count\n\nprint(f\"Area: {calculate_rectangle_area(5, 3)}\")\n\nc = Counter()\nc.increment()\nc.increment()\nprint(f\"Count: {c.get_count()}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Area: 15\\nCount: 2", description: "Both work" }]),
        hints: ["Function: just compute and return", "Class: maintain state between calls"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson8_4_2.id,
        number: 4,
        title: "High Cohesion",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a Timer class where all methods relate to timing.",
        starterCode: "class Timer:\n    \"\"\"All methods should work with time tracking.\"\"\"\n    \n    def __init__(self):\n        self._start_time = None\n        self._elapsed = 0\n    \n    # Add: start(), stop(), reset(), get_elapsed()\n\nimport time\n\nt = Timer()\nt.start()\ntime.sleep(0.1)  # Wait 0.1 seconds\nt.stop()\nprint(f\"Elapsed: {t.get_elapsed():.2f}s\")\nt.reset()\nprint(f\"After reset: {t.get_elapsed()}s\")",
        solution: "import time\n\nclass Timer:\n    def __init__(self):\n        self._start_time = None\n        self._elapsed = 0\n    \n    def start(self):\n        self._start_time = time.time()\n    \n    def stop(self):\n        if self._start_time:\n            self._elapsed += time.time() - self._start_time\n            self._start_time = None\n    \n    def reset(self):\n        self._start_time = None\n        self._elapsed = 0\n    \n    def get_elapsed(self):\n        if self._start_time:\n            return self._elapsed + (time.time() - self._start_time)\n        return self._elapsed\n\nt = Timer()\nt.start()\ntime.sleep(0.1)\nt.stop()\nprint(f\"Elapsed: {t.get_elapsed():.2f}s\")\nt.reset()\nprint(f\"After reset: {t.get_elapsed()}s\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "~0.10s then 0s", description: "Timer works" }]),
        hints: ["All methods work with time", "Track start_time and elapsed"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson8_4_2.id,
        number: 5,
        title: "Design a System",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Design a library system with Book, Library (repository), and separate functions for search.",
        starterCode: "# Design with SRP in mind:\n# - Book: just data\n# - Library: manages collection\n# - search function: stateless search\n\n# Implement the system\n\n# Test\nlibrary = Library()\nlibrary.add(Book(\"1984\", \"Orwell\"))\nlibrary.add(Book(\"Brave New World\", \"Huxley\"))\nlibrary.add(Book(\"Fahrenheit 451\", \"Bradbury\"))\n\nprint(f\"Total books: {library.count()}\")\nresults = search_by_author(library.get_all(), \"Orwell\")\nprint(f\"Books by Orwell: {[b.title for b in results]}\")",
        solution: "class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n    \n    def __repr__(self):\n        return f\"Book('{self.title}')\"\n\nclass Library:\n    def __init__(self):\n        self._books = []\n    \n    def add(self, book):\n        self._books.append(book)\n    \n    def count(self):\n        return len(self._books)\n    \n    def get_all(self):\n        return self._books.copy()\n\ndef search_by_author(books, author):\n    return [b for b in books if author.lower() in b.author.lower()]\n\nlibrary = Library()\nlibrary.add(Book(\"1984\", \"Orwell\"))\nlibrary.add(Book(\"Brave New World\", \"Huxley\"))\nlibrary.add(Book(\"Fahrenheit 451\", \"Bradbury\"))\n\nprint(f\"Total books: {library.count()}\")\nresults = search_by_author(library.get_all(), \"Orwell\")\nprint(f\"Books by Orwell: {[b.title for b in results]}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "3 books, Orwell search works", description: "Clean design" }]),
        hints: ["Book is just data", "Library manages collection", "Search is stateless function"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 8.4.2`);

  // ==================== LESSON 8.4.3 ====================
  const lesson8_4_3 = await prisma.lesson.upsert({
    where: { slug: "practical-oop-examples" },
    update: {},
    create: {
      sectionId: section8_4.id,
      number: 8.43,
      title: "Practical OOP Examples",
      slug: "practical-oop-examples",
      objectives: [
        "Build complete class implementations",
        "Model real-world entities effectively",
        "Apply OOP best practices",
        "Combine concepts learned",
      ],
      content: `# Practical OOP Examples

## Building Complete Classes

Let's put together everything we've learned:
- \`__init__\` for initialization
- Instance methods for behavior
- Encapsulation for protection
- Special methods for Pythonic behavior
- Inheritance when appropriate

## Example: Bank Account System

\`\`\`python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance
        self._transactions = []
    
    def deposit(self, amount): ...
    def withdraw(self, amount): ...
    def __str__(self): ...
\`\`\`

## Example: Card Game

\`\`\`python
class Card:
    def __init__(self, suit, rank): ...
    def __str__(self): ...
    def __lt__(self, other): ...

class Deck:
    def __init__(self): ...
    def shuffle(self): ...
    def deal(self): ...
\`\`\`

## Best Practices Summary

1. **Keep classes focused** (single responsibility)
2. **Use encapsulation** (protect internal state)
3. **Implement special methods** (Pythonic behavior)
4. **Inherit judiciously** (prefer composition)
5. **Document with docstrings**
6. **Validate in setters**
7. **Initialize all attributes in __init__**`,
      codeExamples: JSON.stringify([
        {
          id: "complete-bank",
          title: "Complete Bank Account",
          code: "class BankAccount:\n    \"\"\"A bank account with transaction history.\"\"\"\n    \n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self._balance = balance\n        self._transactions = []\n        if balance > 0:\n            self._transactions.append(f\"Initial deposit: ${balance}\")\n    \n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError(\"Deposit must be positive\")\n        self._balance += amount\n        self._transactions.append(f\"Deposit: ${amount}\")\n        return self._balance\n    \n    def withdraw(self, amount):\n        if amount <= 0:\n            raise ValueError(\"Withdrawal must be positive\")\n        if amount > self._balance:\n            raise ValueError(\"Insufficient funds\")\n        self._balance -= amount\n        self._transactions.append(f\"Withdrawal: ${amount}\")\n        return self._balance\n    \n    def get_balance(self):\n        return self._balance\n    \n    def get_history(self):\n        return self._transactions.copy()\n    \n    def __str__(self):\n        return f\"{self.owner}'s account: ${self._balance}\"\n    \n    def __repr__(self):\n        return f\"BankAccount('{self.owner}', {self._balance})\"\n\n# Usage\naccount = BankAccount(\"Alice\", 100)\naccount.deposit(50)\naccount.withdraw(30)\nprint(account)\nprint(f\"History: {account.get_history()}\")",
          description: "Full-featured bank account",
        },
        {
          id: "card-deck",
          title: "Card and Deck Classes",
          code: "import random\n\nclass Card:\n    SUITS = ['♠', '♥', '♦', '♣']\n    RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']\n    \n    def __init__(self, suit, rank):\n        self.suit = suit\n        self.rank = rank\n    \n    def __str__(self):\n        return f\"{self.rank}{self.suit}\"\n    \n    def __repr__(self):\n        return f\"Card('{self.suit}', '{self.rank}')\"\n    \n    def __lt__(self, other):\n        return self.RANKS.index(self.rank) < self.RANKS.index(other.rank)\n\nclass Deck:\n    def __init__(self):\n        self.cards = [Card(s, r) for s in Card.SUITS for r in Card.RANKS]\n    \n    def shuffle(self):\n        random.shuffle(self.cards)\n    \n    def deal(self):\n        if not self.cards:\n            raise ValueError(\"No cards left!\")\n        return self.cards.pop()\n    \n    def __len__(self):\n        return len(self.cards)\n\n# Usage\ndeck = Deck()\nprint(f\"New deck: {len(deck)} cards\")\ndeck.shuffle()\nhand = [deck.deal() for _ in range(5)]\nprint(f\"Your hand: {[str(c) for c in hand]}\")\nhand.sort()\nprint(f\"Sorted: {[str(c) for c in hand]}\")",
          description: "Playing card system",
        },
        {
          id: "todo-system",
          title: "Todo List System",
          code: "from datetime import datetime\n\nclass Task:\n    def __init__(self, title, priority=1):\n        self.title = title\n        self.priority = priority\n        self.completed = False\n        self.created_at = datetime.now()\n    \n    def complete(self):\n        self.completed = True\n    \n    def __str__(self):\n        status = '✓' if self.completed else ' '\n        return f\"[{status}] ({self.priority}) {self.title}\"\n    \n    def __lt__(self, other):\n        return self.priority > other.priority  # Higher priority first\n\nclass TodoList:\n    def __init__(self, name):\n        self.name = name\n        self._tasks = []\n    \n    def add(self, title, priority=1):\n        task = Task(title, priority)\n        self._tasks.append(task)\n        return task\n    \n    def complete(self, index):\n        self._tasks[index].complete()\n    \n    def pending(self):\n        return [t for t in self._tasks if not t.completed]\n    \n    def show(self):\n        print(f\"=== {self.name} ===\")\n        for i, task in enumerate(sorted(self._tasks)):\n            print(f\"{i}. {task}\")\n\n# Usage\ntodo = TodoList(\"My Tasks\")\ntodo.add(\"Buy groceries\", 2)\ntodo.add(\"Call mom\", 3)\ntodo.add(\"Read book\", 1)\ntodo.complete(0)\ntodo.show()\nprint(f\"\\nPending: {len(todo.pending())} tasks\")",
          description: "Task management system",
        },
        {
          id: "inventory-system",
          title: "Inventory System",
          code: "class Product:\n    def __init__(self, sku, name, price):\n        self.sku = sku\n        self.name = name\n        self.price = price\n    \n    def __repr__(self):\n        return f\"Product({self.sku}, '{self.name}', {self.price})\"\n    \n    def __eq__(self, other):\n        return isinstance(other, Product) and self.sku == other.sku\n\nclass Inventory:\n    def __init__(self):\n        self._stock = {}  # sku -> {product, quantity}\n    \n    def add_product(self, product, quantity):\n        if product.sku in self._stock:\n            self._stock[product.sku]['quantity'] += quantity\n        else:\n            self._stock[product.sku] = {'product': product, 'quantity': quantity}\n    \n    def remove_product(self, sku, quantity):\n        if sku not in self._stock:\n            raise ValueError(f\"Product {sku} not in inventory\")\n        if self._stock[sku]['quantity'] < quantity:\n            raise ValueError(\"Insufficient stock\")\n        self._stock[sku]['quantity'] -= quantity\n    \n    def get_quantity(self, sku):\n        return self._stock.get(sku, {}).get('quantity', 0)\n    \n    def total_value(self):\n        return sum(\n            item['product'].price * item['quantity']\n            for item in self._stock.values()\n        )\n    \n    def show(self):\n        print(\"Inventory:\")\n        for sku, item in self._stock.items():\n            p = item['product']\n            q = item['quantity']\n            print(f\"  {sku}: {p.name} x{q} @ ${p.price} = ${p.price*q}\")\n        print(f\"Total value: ${self.total_value()}\")\n\n# Usage\ninv = Inventory()\ninv.add_product(Product(\"A001\", \"Widget\", 10), 50)\ninv.add_product(Product(\"A002\", \"Gadget\", 25), 20)\ninv.remove_product(\"A001\", 10)\ninv.show()",
          description: "Inventory management",
        },
      ]),
      keyPoints: [
        "Combine __init__, methods, and special methods",
        "Use encapsulation to protect state",
        "Implement __str__ and __repr__ for usability",
        "Add __eq__ and __lt__ when needed",
        "Validate inputs in methods",
        "Keep transaction/history logs when useful",
        "Separate data classes from manager classes",
        "Test edge cases (empty, invalid input)",
      ],
      hardwareDemo: "Build complete class step by step. See all OOP concepts working together.",
      estimatedTime: 35,
      difficulty: "ADVANCED",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson8_4_3.number}: ${lesson8_4_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_4_3.id,
        number: 1,
        title: "Build a Contact",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a Contact class with name, email, and phone. Include __str__ and __eq__.",
        starterCode: "class Contact:\n    # __init__ with name, email, phone\n    # __str__ returning 'Name <email>'\n    # __eq__ comparing by email\n    pass\n\nc1 = Contact(\"Alice\", \"alice@mail.com\", \"555-1234\")\nc2 = Contact(\"Alice Smith\", \"alice@mail.com\", \"555-9999\")\nc3 = Contact(\"Bob\", \"bob@mail.com\", \"555-5678\")\n\nprint(c1)\nprint(f\"c1 == c2: {c1 == c2}\")\nprint(f\"c1 == c3: {c1 == c3}\")",
        solution: "class Contact:\n    def __init__(self, name, email, phone):\n        self.name = name\n        self.email = email\n        self.phone = phone\n    \n    def __str__(self):\n        return f\"{self.name} <{self.email}>\"\n    \n    def __eq__(self, other):\n        if not isinstance(other, Contact):\n            return False\n        return self.email == other.email\n\nc1 = Contact(\"Alice\", \"alice@mail.com\", \"555-1234\")\nc2 = Contact(\"Alice Smith\", \"alice@mail.com\", \"555-9999\")\nc3 = Contact(\"Bob\", \"bob@mail.com\", \"555-5678\")\n\nprint(c1)\nprint(f\"c1 == c2: {c1 == c2}\")\nprint(f\"c1 == c3: {c1 == c3}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Alice <alice@mail.com>\\nTrue\\nFalse", description: "Contact works" }]),
        hints: ["__str__ for display", "__eq__ compares emails"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson8_4_3.id,
        number: 2,
        title: "Build a Counter with History",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create Counter that tracks count and history of operations.",
        starterCode: "class Counter:\n    # __init__: count=0, history=[]\n    # increment(): add 1, record in history\n    # decrement(): subtract 1, record\n    # get_history(): return copy of history\n    pass\n\nc = Counter()\nc.increment()\nc.increment()\nc.decrement()\nprint(f\"Count: {c.count}\")\nprint(f\"History: {c.get_history()}\")",
        solution: "class Counter:\n    def __init__(self):\n        self.count = 0\n        self._history = []\n    \n    def increment(self):\n        self.count += 1\n        self._history.append(f\"increment -> {self.count}\")\n    \n    def decrement(self):\n        self.count -= 1\n        self._history.append(f\"decrement -> {self.count}\")\n    \n    def get_history(self):\n        return self._history.copy()\n\nc = Counter()\nc.increment()\nc.increment()\nc.decrement()\nprint(f\"Count: {c.count}\")\nprint(f\"History: {c.get_history()}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Count: 1 with history", description: "History tracked" }]),
        hints: ["Record each operation", "Return copy of history"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson8_4_3.id,
        number: 3,
        title: "Build a Playlist",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create Song and Playlist classes with add, remove, and shuffle.",
        starterCode: "import random\n\nclass Song:\n    # title, artist, duration (seconds)\n    # __str__: \"Title - Artist (MM:SS)\"\n    pass\n\nclass Playlist:\n    # name, list of songs\n    # add(song), remove(index), shuffle()\n    # total_duration(), __len__\n    pass\n\nplaylist = Playlist(\"My Mix\")\nplaylist.add(Song(\"Song A\", \"Artist 1\", 180))\nplaylist.add(Song(\"Song B\", \"Artist 2\", 240))\nplaylist.add(Song(\"Song C\", \"Artist 1\", 200))\n\nprint(f\"Playlist: {playlist.name} ({len(playlist)} songs)\")\nprint(f\"Total duration: {playlist.total_duration()}s\")\nfor song in playlist.songs:\n    print(f\"  {song}\")",
        solution: "import random\n\nclass Song:\n    def __init__(self, title, artist, duration):\n        self.title = title\n        self.artist = artist\n        self.duration = duration\n    \n    def __str__(self):\n        mins, secs = divmod(self.duration, 60)\n        return f\"{self.title} - {self.artist} ({mins}:{secs:02d})\"\n\nclass Playlist:\n    def __init__(self, name):\n        self.name = name\n        self.songs = []\n    \n    def add(self, song):\n        self.songs.append(song)\n    \n    def remove(self, index):\n        if 0 <= index < len(self.songs):\n            self.songs.pop(index)\n    \n    def shuffle(self):\n        random.shuffle(self.songs)\n    \n    def total_duration(self):\n        return sum(s.duration for s in self.songs)\n    \n    def __len__(self):\n        return len(self.songs)\n\nplaylist = Playlist(\"My Mix\")\nplaylist.add(Song(\"Song A\", \"Artist 1\", 180))\nplaylist.add(Song(\"Song B\", \"Artist 2\", 240))\nplaylist.add(Song(\"Song C\", \"Artist 1\", 200))\n\nprint(f\"Playlist: {playlist.name} ({len(playlist)} songs)\")\nprint(f\"Total duration: {playlist.total_duration()}s\")\nfor song in playlist.songs:\n    print(f\"  {song}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Playlist with songs", description: "Playlist works" }]),
        hints: ["Song formats duration as MM:SS", "Playlist has __len__"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson8_4_3.id,
        number: 4,
        title: "Build a Grade Book",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create Student and GradeBook with grades and averages.",
        starterCode: "class Student:\n    # name, list of grades\n    # add_grade(grade), average(), __str__\n    pass\n\nclass GradeBook:\n    # list of students\n    # add_student(student), get_honor_roll() (avg >= 90)\n    # class_average()\n    pass\n\ngb = GradeBook()\n\nalice = Student(\"Alice\")\nalice.add_grade(95)\nalice.add_grade(88)\nalice.add_grade(92)\n\nbob = Student(\"Bob\")\nbob.add_grade(78)\nbob.add_grade(85)\nbob.add_grade(80)\n\ngb.add_student(alice)\ngb.add_student(bob)\n\nprint(f\"Class average: {gb.class_average():.1f}\")\nprint(f\"Honor roll: {[s.name for s in gb.get_honor_roll()]}\")",
        solution: "class Student:\n    def __init__(self, name):\n        self.name = name\n        self.grades = []\n    \n    def add_grade(self, grade):\n        self.grades.append(grade)\n    \n    def average(self):\n        if not self.grades:\n            return 0\n        return sum(self.grades) / len(self.grades)\n    \n    def __str__(self):\n        return f\"{self.name}: {self.average():.1f}\"\n\nclass GradeBook:\n    def __init__(self):\n        self.students = []\n    \n    def add_student(self, student):\n        self.students.append(student)\n    \n    def get_honor_roll(self):\n        return [s for s in self.students if s.average() >= 90]\n    \n    def class_average(self):\n        if not self.students:\n            return 0\n        return sum(s.average() for s in self.students) / len(self.students)\n\ngb = GradeBook()\n\nalice = Student(\"Alice\")\nalice.add_grade(95)\nalice.add_grade(88)\nalice.add_grade(92)\n\nbob = Student(\"Bob\")\nbob.add_grade(78)\nbob.add_grade(85)\nbob.add_grade(80)\n\ngb.add_student(alice)\ngb.add_student(bob)\n\nprint(f\"Class average: {gb.class_average():.1f}\")\nprint(f\"Honor roll: {[s.name for s in gb.get_honor_roll()]}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Class average and honor roll", description: "GradeBook works" }]),
        hints: ["Student tracks own grades", "GradeBook aggregates students"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson8_4_3.id,
        number: 5,
        title: "Build Complete System",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Build a simple shopping cart system with Product, CartItem, and Cart.",
        starterCode: "class Product:\n    # sku, name, price\n    # __str__, __eq__ (by sku)\n    pass\n\nclass CartItem:\n    # product, quantity\n    # total(), __str__\n    pass\n\nclass Cart:\n    # items list\n    # add(product, qty), remove(sku), total()\n    # __len__, show()\n    pass\n\n# Test\np1 = Product(\"A001\", \"Widget\", 10.00)\np2 = Product(\"A002\", \"Gadget\", 25.00)\n\ncart = Cart()\ncart.add(p1, 3)\ncart.add(p2, 2)\ncart.add(p1, 2)  # Should increase quantity\ncart.show()\nprint(f\"Total: ${cart.total():.2f}\")",
        solution: "class Product:\n    def __init__(self, sku, name, price):\n        self.sku = sku\n        self.name = name\n        self.price = price\n    \n    def __str__(self):\n        return f\"{self.name} (${self.price})\"\n    \n    def __eq__(self, other):\n        return isinstance(other, Product) and self.sku == other.sku\n\nclass CartItem:\n    def __init__(self, product, quantity):\n        self.product = product\n        self.quantity = quantity\n    \n    def total(self):\n        return self.product.price * self.quantity\n    \n    def __str__(self):\n        return f\"{self.product.name} x{self.quantity} = ${self.total():.2f}\"\n\nclass Cart:\n    def __init__(self):\n        self.items = []  # List of CartItems\n    \n    def add(self, product, qty):\n        for item in self.items:\n            if item.product == product:\n                item.quantity += qty\n                return\n        self.items.append(CartItem(product, qty))\n    \n    def remove(self, sku):\n        self.items = [i for i in self.items if i.product.sku != sku]\n    \n    def total(self):\n        return sum(item.total() for item in self.items)\n    \n    def __len__(self):\n        return sum(item.quantity for item in self.items)\n    \n    def show(self):\n        print(\"Shopping Cart:\")\n        for item in self.items:\n            print(f\"  {item}\")\n\np1 = Product(\"A001\", \"Widget\", 10.00)\np2 = Product(\"A002\", \"Gadget\", 25.00)\n\ncart = Cart()\ncart.add(p1, 3)\ncart.add(p2, 2)\ncart.add(p1, 2)\ncart.show()\nprint(f\"Total: ${cart.total():.2f}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Widget x5, Gadget x2, $100.00", description: "Complete system" }]),
        hints: ["Check if product already in cart", "CartItem holds product + quantity"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 8.4.3`);

  // Verify Chapter 8 is complete
  const chapter8 = await prisma.chapter.findFirst({
    where: { number: 8 },
    include: {
      sections: {
        orderBy: { number: 'asc' },
        include: {
          lessons: {
            orderBy: { number: 'asc' },
            include: { _count: { select: { exercises: true } } }
          }
        }
      }
    }
  });

  if (chapter8) {
    console.log("\n" + "=".repeat(60));
    console.log("📚 CHAPTER 8 COMPLETE!");
    console.log("=".repeat(60));
    
    let totalLessons = 0;
    let totalExercises = 0;
    
    for (const section of chapter8.sections) {
      console.log(`\n📂 Section ${section.number}: ${section.title}`);
      for (const lesson of section.lessons) {
        console.log(`   📝 ${lesson.number}: ${lesson.title} (${lesson._count.exercises} exercises)`);
        totalLessons++;
        totalExercises += lesson._count.exercises;
      }
    }
    
    console.log("\n" + "-".repeat(60));
    console.log(`✅ TOTAL: ${totalLessons} lessons, ${totalExercises} exercises`);
    console.log("=".repeat(60));
  }

  // Show overall curriculum status
  const allChapters = await prisma.chapter.findMany({
    orderBy: { number: 'asc' },
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

  console.log("\n\n📊 FULL CURRICULUM STATUS:");
  console.log("═".repeat(65));
  
  let grandLessons = 0;
  let grandExercises = 0;
  
  for (const ch of allChapters) {
    let chLessons = 0;
    let chExercises = 0;
    for (const sec of ch.sections) {
      chLessons += sec.lessons.length;
      for (const les of sec.lessons) {
        chExercises += les._count.exercises;
      }
    }
    grandLessons += chLessons;
    grandExercises += chExercises;
    
    const status = chLessons > 0 ? '✅' : '⏳';
    console.log(`${status} Ch ${ch.number}: ${ch.title.substring(0, 40).padEnd(40)} | ${String(chLessons).padStart(2)} lessons, ${String(chExercises).padStart(3)} ex`);
  }
  
  console.log("─".repeat(65));
  console.log(`📈 GRAND TOTAL: ${grandLessons} lessons, ${grandExercises} exercises`);
  console.log("═".repeat(65));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
