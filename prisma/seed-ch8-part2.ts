import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 8 Part 2: Lessons 8.1.3-8.1.5...\n");

  const section8_1 = await prisma.section.findFirst({ where: { number: 8.1 } });
  if (!section8_1) throw new Error("Section 8.1 not found.");

  // ==================== LESSON 8.1.3 ====================
  const lesson8_1_3 = await prisma.lesson.upsert({
    where: { slug: "init-constructor" },
    update: {},
    create: {
      sectionId: section8_1.id,
      number: 8.13,
      title: "The __init__ Constructor",
      slug: "init-constructor",
      objectives: [
        "Understand what __init__ does",
        "Use self to reference the instance",
        "Create instance variables in __init__",
        "Pass arguments when creating objects",
      ],
      content: `# The __init__ Constructor

## What is __init__?

\`__init__\` is a **special method** that runs automatically when you create an object.

\`\`\`python
class Dog:
    def __init__(self):
        print("A new dog is born!")

fido = Dog()  # Prints: "A new dog is born!"
\`\`\`

## The self Parameter

\`self\` refers to **the instance being created**:

\`\`\`python
class Dog:
    def __init__(self):
        self.name = "Unknown"  # self = this specific dog

fido = Dog()
print(fido.name)  # "Unknown"
\`\`\`

## Passing Arguments to __init__

\`\`\`python
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

fido = Dog("Fido", 3)  # Arguments passed to __init__
rex = Dog("Rex", 5)
\`\`\`

## Instance Variables

Variables created with \`self.variable\` are **instance variables**:
- Belong to that specific object
- Persist for the object's lifetime
- Each instance has its own copy

\`\`\`python
class Dog:
    def __init__(self, name):
        self.name = name    # Instance variable
        self.tricks = []    # Each dog has own list!
\`\`\`

## Default Values

\`\`\`python
class Dog:
    def __init__(self, name, age=1):
        self.name = name
        self.age = age

puppy = Dog("Spot")      # age defaults to 1
adult = Dog("Rex", 5)    # age is 5
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-init",
          title: "Basic __init__",
          code: "class Dog:\n    def __init__(self):\n        print(\"__init__ is running!\")\n        self.name = \"Unknown\"\n        self.age = 0\n\n# __init__ runs automatically when we create object\nprint(\"Creating dog1...\")\ndog1 = Dog()\nprint(f\"Name: {dog1.name}, Age: {dog1.age}\")\n\nprint(\"\\nCreating dog2...\")\ndog2 = Dog()\nprint(f\"Name: {dog2.name}, Age: {dog2.age}\")",
          description: "__init__ runs on object creation",
        },
        {
          id: "init-with-args",
          title: "__init__ with Arguments",
          code: "class Dog:\n    def __init__(self, name, age):\n        print(f\"Creating dog: {name}, {age} years old\")\n        self.name = name  # Store argument as instance variable\n        self.age = age\n\n# Pass arguments when creating objects\nfido = Dog(\"Fido\", 3)\nrex = Dog(\"Rex\", 5)\nspot = Dog(\"Spot\", 1)\n\nprint(f\"\\n{fido.name} is {fido.age}\")\nprint(f\"{rex.name} is {rex.age}\")\nprint(f\"{spot.name} is {spot.age}\")",
          description: "Passing data to __init__",
        },
        {
          id: "self-explained",
          title: "Understanding self",
          code: "class Dog:\n    def __init__(self, name):\n        # 'self' is the specific object being created\n        print(f\"self is: {self}\")\n        self.name = name\n\n# When we create fido, self refers to fido\nprint(\"Creating fido:\")\nfido = Dog(\"Fido\")\nprint(f\"fido is: {fido}\")\nprint(f\"Same object? {fido.name}\")\n\nprint()\n\n# When we create rex, self refers to rex\nprint(\"Creating rex:\")\nrex = Dog(\"Rex\")\nprint(f\"rex is: {rex}\")\n\n# self always refers to the instance being worked on\nprint(f\"\\nfido.name: {fido.name}\")\nprint(f\"rex.name: {rex.name}\")",
          description: "self refers to the instance",
        },
        {
          id: "default-values",
          title: "Default Parameter Values",
          code: "class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n        print(f\"Created account for {owner} with ${balance}\")\n\n# Can omit balance (uses default)\naccount1 = BankAccount(\"Alice\")\n\n# Or provide balance\naccount2 = BankAccount(\"Bob\", 1000)\naccount3 = BankAccount(\"Carol\", 500)\n\nprint(f\"\\n{account1.owner}: ${account1.balance}\")\nprint(f\"{account2.owner}: ${account2.balance}\")\nprint(f\"{account3.owner}: ${account3.balance}\")",
          description: "Using default values in __init__",
        },
      ]),
      keyPoints: [
        "__init__ runs automatically when object created",
        "self refers to the instance being created",
        "self.variable creates instance variable",
        "Arguments after self become constructor parameters",
        "Each instance gets its own copy of instance variables",
        "Use default values for optional parameters",
        "__init__ initializes, doesn't create the object",
        "self is always the first parameter",
      ],
      hardwareDemo: "Watch __init__ execute. See self point to new object. Watch instance variables created.",
      estimatedTime: 30,
      difficulty: "BEGINNER",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson8_1_3.number}: ${lesson8_1_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_1_3.id,
        number: 1,
        title: "Write __init__",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add an __init__ that takes name and sets self.name.",
        starterCode: "class Cat:\n    # Add __init__ with name parameter\n    pass\n\nwhiskers = Cat(\"Whiskers\")\nprint(f\"Cat's name: {whiskers.name}\")",
        solution: "class Cat:\n    def __init__(self, name):\n        self.name = name\n\nwhiskers = Cat(\"Whiskers\")\nprint(f\"Cat's name: {whiskers.name}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Cat's name: Whiskers", description: "__init__ works" }]),
        hints: ["def __init__(self, name):", "self.name = name"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson8_1_3.id,
        number: 2,
        title: "Multiple Parameters",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a Book class with __init__ taking title and author.",
        starterCode: "class Book:\n    # __init__ with title and author\n    pass\n\nbook = Book(\"1984\", \"George Orwell\")\nprint(f\"{book.title} by {book.author}\")",
        solution: "class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n\nbook = Book(\"1984\", \"George Orwell\")\nprint(f\"{book.title} by {book.author}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "1984 by George Orwell", description: "Both attributes set" }]),
        hints: ["def __init__(self, title, author):", "Set both as self.attributes"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson8_1_3.id,
        number: 3,
        title: "Default Value",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create Player class with name (required) and score (default 0).",
        starterCode: "class Player:\n    # __init__ with name and score (default 0)\n    pass\n\np1 = Player(\"Alice\")       # score = 0\np2 = Player(\"Bob\", 100)    # score = 100\n\nprint(f\"{p1.name}: {p1.score}\")\nprint(f\"{p2.name}: {p2.score}\")",
        solution: "class Player:\n    def __init__(self, name, score=0):\n        self.name = name\n        self.score = score\n\np1 = Player(\"Alice\")\np2 = Player(\"Bob\", 100)\n\nprint(f\"{p1.name}: {p1.score}\")\nprint(f\"{p2.name}: {p2.score}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Alice: 0\\nBob: 100", description: "Default works" }]),
        hints: ["def __init__(self, name, score=0):", "Default value after ="],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson8_1_3.id,
        number: 4,
        title: "Initialize with Calculation",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create Rectangle with width and height, calculating area in __init__.",
        starterCode: "class Rectangle:\n    def __init__(self, width, height):\n        # Store width, height, AND calculate area\n        pass\n\nrect = Rectangle(5, 3)\nprint(f\"Size: {rect.width}x{rect.height}\")\nprint(f\"Area: {rect.area}\")",
        solution: "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.area = width * height\n\nrect = Rectangle(5, 3)\nprint(f\"Size: {rect.width}x{rect.height}\")\nprint(f\"Area: {rect.area}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Size: 5x3\\nArea: 15", description: "Area calculated" }]),
        hints: ["Store width and height", "Calculate area: width * height"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson8_1_3.id,
        number: 5,
        title: "Initialize Collection",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create ShoppingCart with owner and empty items list.",
        starterCode: "class ShoppingCart:\n    def __init__(self, owner):\n        # Set owner and create empty items list\n        pass\n\ncart = ShoppingCart(\"Alice\")\nprint(f\"Owner: {cart.owner}\")\nprint(f\"Items: {cart.items}\")\n\n# Add items manually for now\ncart.items.append(\"Apple\")\ncart.items.append(\"Bread\")\nprint(f\"After shopping: {cart.items}\")",
        solution: "class ShoppingCart:\n    def __init__(self, owner):\n        self.owner = owner\n        self.items = []  # Each cart has its own list!\n\ncart = ShoppingCart(\"Alice\")\nprint(f\"Owner: {cart.owner}\")\nprint(f\"Items: {cart.items}\")\n\ncart.items.append(\"Apple\")\ncart.items.append(\"Bread\")\nprint(f\"After shopping: {cart.items}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Empty list then items added", description: "List initialized" }]),
        hints: ["self.items = []", "Each instance gets its own empty list"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 8.1.3`);

  // ==================== LESSON 8.1.4 ====================
  const lesson8_1_4 = await prisma.lesson.upsert({
    where: { slug: "instance-methods" },
    update: {},
    create: {
      sectionId: section8_1.id,
      number: 8.14,
      title: "Instance Methods",
      slug: "instance-methods",
      objectives: [
        "Define methods inside classes",
        "Use self to access instance data",
        "Call methods on objects",
        "Methods that modify object state",
      ],
      content: `# Instance Methods

## What Are Instance Methods?

Methods are functions defined inside a class:

\`\`\`python
class Dog:
    def __init__(self, name):
        self.name = name
    
    def bark(self):  # Instance method
        return f"{self.name} says Woof!"
\`\`\`

## The self Parameter

**Every instance method takes self as first parameter**:

\`\`\`python
def bark(self):  # self = the dog calling this method
    return f"{self.name} says Woof!"
\`\`\`

When you call \`fido.bark()\`, Python passes \`fido\` as \`self\`.

## Calling Methods

\`\`\`python
fido = Dog("Fido")
print(fido.bark())  # "Fido says Woof!"

# Equivalent to:
print(Dog.bark(fido))  # Same thing!
\`\`\`

## Accessing Instance Data

Methods access instance variables through self:

\`\`\`python
class BankAccount:
    def __init__(self, balance):
        self.balance = balance
    
    def get_balance(self):
        return self.balance  # Access via self
\`\`\`

## Methods That Modify State

\`\`\`python
class BankAccount:
    def deposit(self, amount):
        self.balance += amount  # Modify via self
\`\`\`

## Methods Calling Other Methods

\`\`\`python
class BankAccount:
    def transfer(self, amount, other_account):
        self.withdraw(amount)           # Call own method
        other_account.deposit(amount)   # Call other's method
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-methods",
          title: "Basic Instance Methods",
          code: "class Dog:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def bark(self):\n        \"\"\"Make the dog bark.\"\"\"\n        return f\"{self.name} says Woof!\"\n    \n    def describe(self):\n        \"\"\"Describe the dog.\"\"\"\n        return f\"{self.name} is {self.age} years old\"\n\n# Create dogs and call methods\nfido = Dog(\"Fido\", 3)\nrex = Dog(\"Rex\", 5)\n\nprint(fido.bark())\nprint(rex.bark())\nprint()\nprint(fido.describe())\nprint(rex.describe())",
          description: "Methods access instance data via self",
        },
        {
          id: "methods-modify-state",
          title: "Methods That Modify State",
          code: "class Counter:\n    def __init__(self):\n        self.count = 0\n    \n    def increment(self):\n        self.count += 1\n    \n    def decrement(self):\n        self.count -= 1\n    \n    def reset(self):\n        self.count = 0\n    \n    def get_count(self):\n        return self.count\n\n# Use the counter\ncounter = Counter()\nprint(f\"Initial: {counter.get_count()}\")\n\ncounter.increment()\ncounter.increment()\ncounter.increment()\nprint(f\"After 3 increments: {counter.get_count()}\")\n\ncounter.decrement()\nprint(f\"After decrement: {counter.get_count()}\")\n\ncounter.reset()\nprint(f\"After reset: {counter.get_count()}\")",
          description: "Methods that change object state",
        },
        {
          id: "methods-with-params",
          title: "Methods with Parameters",
          code: "class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n    \n    def deposit(self, amount):\n        \"\"\"Add money to account.\"\"\"\n        if amount > 0:\n            self.balance += amount\n            return f\"Deposited ${amount}. Balance: ${self.balance}\"\n        return \"Invalid amount\"\n    \n    def withdraw(self, amount):\n        \"\"\"Remove money from account.\"\"\"\n        if amount > self.balance:\n            return f\"Insufficient funds! Balance: ${self.balance}\"\n        self.balance -= amount\n        return f\"Withdrew ${amount}. Balance: ${self.balance}\"\n\naccount = BankAccount(\"Alice\", 100)\nprint(account.deposit(50))\nprint(account.withdraw(30))\nprint(account.withdraw(200))  # Too much!",
          description: "Methods with additional parameters",
        },
        {
          id: "methods-calling-methods",
          title: "Methods Calling Other Methods",
          code: "class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n    \n    def deposit(self, amount):\n        self.balance += amount\n    \n    def withdraw(self, amount):\n        if amount <= self.balance:\n            self.balance -= amount\n            return True\n        return False\n    \n    def transfer(self, amount, other_account):\n        \"\"\"Transfer money to another account.\"\"\"\n        if self.withdraw(amount):  # Call own method\n            other_account.deposit(amount)  # Call other's method\n            return f\"Transferred ${amount} to {other_account.owner}\"\n        return \"Transfer failed - insufficient funds\"\n\nalice = BankAccount(\"Alice\", 100)\nbob = BankAccount(\"Bob\", 50)\n\nprint(f\"Before: Alice=${alice.balance}, Bob=${bob.balance}\")\nprint(alice.transfer(30, bob))\nprint(f\"After: Alice=${alice.balance}, Bob=${bob.balance}\")",
          description: "Methods can call other methods",
        },
      ]),
      keyPoints: [
        "Methods are functions inside a class",
        "self is always the first parameter",
        "self refers to the instance calling the method",
        "Access instance data via self.variable",
        "Modify state via self.variable = value",
        "Call with object.method(args)",
        "Methods can have additional parameters",
        "Methods can call other methods via self",
      ],
      hardwareDemo: "Watch method call. See self bound to calling object. Watch state change.",
      estimatedTime: 30,
      difficulty: "BEGINNER",
      order: 4,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson8_1_4.number}: ${lesson8_1_4.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_1_4.id,
        number: 1,
        title: "Add a Method",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add a greet() method that returns 'Hello, I am {name}'.",
        starterCode: "class Person:\n    def __init__(self, name):\n        self.name = name\n    \n    # Add greet method\n\nperson = Person(\"Alice\")\nprint(person.greet())",
        solution: "class Person:\n    def __init__(self, name):\n        self.name = name\n    \n    def greet(self):\n        return f\"Hello, I am {self.name}\"\n\nperson = Person(\"Alice\")\nprint(person.greet())",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Hello, I am Alice", description: "Method works" }]),
        hints: ["def greet(self):", "Access name via self.name"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson8_1_4.id,
        number: 2,
        title: "Method with Parameter",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add an add_score(points) method that increases the player's score.",
        starterCode: "class Player:\n    def __init__(self, name):\n        self.name = name\n        self.score = 0\n    \n    # Add add_score method\n\nplayer = Player(\"Alice\")\nplayer.add_score(10)\nplayer.add_score(5)\nprint(f\"{player.name}: {player.score}\")",
        solution: "class Player:\n    def __init__(self, name):\n        self.name = name\n        self.score = 0\n    \n    def add_score(self, points):\n        self.score += points\n\nplayer = Player(\"Alice\")\nplayer.add_score(10)\nplayer.add_score(5)\nprint(f\"{player.name}: {player.score}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Alice: 15", description: "Score increased" }]),
        hints: ["def add_score(self, points):", "self.score += points"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson8_1_4.id,
        number: 3,
        title: "Method Returns Value",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add area() and perimeter() methods to Rectangle.",
        starterCode: "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    \n    # Add area() method\n    \n    # Add perimeter() method\n\nrect = Rectangle(5, 3)\nprint(f\"Area: {rect.area()}\")\nprint(f\"Perimeter: {rect.perimeter()}\")",
        solution: "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    \n    def area(self):\n        return self.width * self.height\n    \n    def perimeter(self):\n        return 2 * (self.width + self.height)\n\nrect = Rectangle(5, 3)\nprint(f\"Area: {rect.area()}\")\nprint(f\"Perimeter: {rect.perimeter()}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Area: 15\\nPerimeter: 16", description: "Both methods work" }]),
        hints: ["Area = width * height", "Perimeter = 2 * (width + height)"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson8_1_4.id,
        number: 4,
        title: "Method Modifies State",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add deposit() and withdraw() methods to BankAccount.",
        starterCode: "class BankAccount:\n    def __init__(self, balance=0):\n        self.balance = balance\n    \n    # Add deposit(amount) - increases balance\n    \n    # Add withdraw(amount) - decreases if enough funds\n\naccount = BankAccount(100)\naccount.deposit(50)\nprint(f\"After deposit: ${account.balance}\")\naccount.withdraw(30)\nprint(f\"After withdraw: ${account.balance}\")",
        solution: "class BankAccount:\n    def __init__(self, balance=0):\n        self.balance = balance\n    \n    def deposit(self, amount):\n        self.balance += amount\n    \n    def withdraw(self, amount):\n        if amount <= self.balance:\n            self.balance -= amount\n\naccount = BankAccount(100)\naccount.deposit(50)\nprint(f\"After deposit: ${account.balance}\")\naccount.withdraw(30)\nprint(f\"After withdraw: ${account.balance}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "After deposit: $150\\nAfter withdraw: $120", description: "Both methods work" }]),
        hints: ["deposit: self.balance += amount", "withdraw: check balance first"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson8_1_4.id,
        number: 5,
        title: "Complete Todo List",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create TodoList with add_task(), complete_task(), and show_tasks() methods.",
        starterCode: "class TodoList:\n    def __init__(self):\n        self.tasks = []  # List of {\"task\": str, \"done\": bool}\n    \n    # Add add_task(task) - adds new task\n    \n    # Add complete_task(index) - marks task as done\n    \n    # Add show_tasks() - displays all tasks\n\ntodo = TodoList()\ntodo.add_task(\"Learn Python\")\ntodo.add_task(\"Build project\")\ntodo.show_tasks()\nprint()\ntodo.complete_task(0)\ntodo.show_tasks()",
        solution: "class TodoList:\n    def __init__(self):\n        self.tasks = []\n    \n    def add_task(self, task):\n        self.tasks.append({\"task\": task, \"done\": False})\n    \n    def complete_task(self, index):\n        if 0 <= index < len(self.tasks):\n            self.tasks[index][\"done\"] = True\n    \n    def show_tasks(self):\n        for i, t in enumerate(self.tasks):\n            status = \"✓\" if t[\"done\"] else \" \"\n            print(f\"[{status}] {i}. {t['task']}\")\n\ntodo = TodoList()\ntodo.add_task(\"Learn Python\")\ntodo.add_task(\"Build project\")\ntodo.show_tasks()\nprint()\ntodo.complete_task(0)\ntodo.show_tasks()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Tasks shown with completion status", description: "Todo list works" }]),
        hints: ["Store tasks as dicts with task and done", "complete_task changes done to True"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 8.1.4`);

  // ==================== LESSON 8.1.5 ====================
  const lesson8_1_5 = await prisma.lesson.upsert({
    where: { slug: "instance-variables" },
    update: {},
    create: {
      sectionId: section8_1.id,
      number: 8.15,
      title: "Instance Variables",
      slug: "instance-variables",
      objectives: [
        "Understand instance variables belong to objects",
        "See each instance has independent data",
        "Know instance variables persist",
        "Distinguish from local variables",
      ],
      content: `# Instance Variables

## What Are Instance Variables?

Variables created with \`self.variable\` that belong to a specific object:

\`\`\`python
class Dog:
    def __init__(self, name):
        self.name = name  # Instance variable
\`\`\`

## Each Instance Has Its Own Copy

\`\`\`python
fido = Dog("Fido")
rex = Dog("Rex")

fido.name  # "Fido"
rex.name   # "Rex" - different!
\`\`\`

They're completely independent!

## Instance vs Local Variables

\`\`\`python
class Example:
    def __init__(self, value):
        self.value = value  # Instance variable - persists!
    
    def process(self):
        temp = self.value * 2  # Local variable - gone after method
        self.result = temp     # Instance variable - persists!
        return temp
\`\`\`

## Instance Variables Persist

\`\`\`python
class Counter:
    def __init__(self):
        self.count = 0  # Persists for object's lifetime
    
    def increment(self):
        self.count += 1  # Modifies persistent variable

c = Counter()
c.increment()
c.increment()
print(c.count)  # 2 - value persisted!
\`\`\`

## Adding Instance Variables Later

You can add instance variables anytime:

\`\`\`python
class Dog:
    def __init__(self, name):
        self.name = name
    
    def learn_trick(self, trick):
        # Creates new instance variable if doesn't exist
        if not hasattr(self, 'tricks'):
            self.tricks = []
        self.tricks.append(trick)
\`\`\`

Best practice: Initialize all in \`__init__\`!`,
      codeExamples: JSON.stringify([
        {
          id: "independent-instances",
          title: "Each Instance is Independent",
          code: "class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n    \n    def deposit(self, amount):\n        self.balance += amount\n\n# Create two accounts\nalice = BankAccount(\"Alice\", 100)\nbob = BankAccount(\"Bob\", 50)\n\nprint(\"Initial:\")\nprint(f\"  Alice: ${alice.balance}\")\nprint(f\"  Bob: ${bob.balance}\")\n\n# Modify only Alice's account\nalice.deposit(200)\n\nprint(\"\\nAfter Alice deposits $200:\")\nprint(f\"  Alice: ${alice.balance}\")  # Changed!\nprint(f\"  Bob: ${bob.balance}\")       # Unchanged!",
          description: "Changes to one don't affect others",
        },
        {
          id: "persistent-data",
          title: "Instance Variables Persist",
          code: "class GameCharacter:\n    def __init__(self, name):\n        self.name = name\n        self.health = 100\n        self.level = 1\n        self.experience = 0\n    \n    def take_damage(self, amount):\n        self.health -= amount\n        print(f\"{self.name} took {amount} damage! Health: {self.health}\")\n    \n    def gain_exp(self, amount):\n        self.experience += amount\n        print(f\"{self.name} gained {amount} XP! Total: {self.experience}\")\n        if self.experience >= 100:\n            self.level_up()\n    \n    def level_up(self):\n        self.level += 1\n        self.experience -= 100\n        print(f\"{self.name} leveled up to {self.level}!\")\n\nhero = GameCharacter(\"Hero\")\nhero.take_damage(20)\nhero.gain_exp(50)\nhero.gain_exp(60)  # Triggers level up!\nprint(f\"\\nFinal stats: Level {hero.level}, {hero.health} HP\")",
          description: "Data persists across method calls",
        },
        {
          id: "local-vs-instance",
          title: "Local vs Instance Variables",
          code: "class Calculator:\n    def __init__(self):\n        self.result = 0  # Instance variable - persists\n    \n    def add(self, x, y):\n        temp = x + y      # Local variable - temporary!\n        self.result = temp  # Store in instance variable\n        return temp\n    \n    def show_last_result(self):\n        # Can access self.result (instance variable)\n        # Cannot access temp (local, doesn't exist here)\n        return self.result\n\ncalc = Calculator()\n\nprint(f\"Add 5 + 3: {calc.add(5, 3)}\")\nprint(f\"Last result: {calc.show_last_result()}\")\n\nprint(f\"\\nAdd 10 + 20: {calc.add(10, 20)}\")\nprint(f\"Last result: {calc.show_last_result()}\")\n\n# temp is gone, but self.result persists",
          description: "Local variables vs instance variables",
        },
        {
          id: "mutable-instance-vars",
          title: "Mutable Instance Variables",
          code: "class ShoppingCart:\n    def __init__(self, owner):\n        self.owner = owner\n        self.items = []  # Mutable instance variable\n        self.total = 0\n    \n    def add_item(self, name, price):\n        self.items.append({\"name\": name, \"price\": price})\n        self.total += price\n    \n    def show_cart(self):\n        print(f\"{self.owner}'s cart:\")\n        for item in self.items:\n            print(f\"  - {item['name']}: ${item['price']}\")\n        print(f\"Total: ${self.total}\")\n\n# Each cart has its own items list\nalice_cart = ShoppingCart(\"Alice\")\nbob_cart = ShoppingCart(\"Bob\")\n\nalice_cart.add_item(\"Book\", 15)\nalice_cart.add_item(\"Pen\", 2)\n\nbob_cart.add_item(\"Laptop\", 800)\n\nalice_cart.show_cart()\nprint()\nbob_cart.show_cart()",
          description: "Lists as instance variables",
        },
      ]),
      keyPoints: [
        "Instance variables belong to specific objects",
        "Created with self.variable = value",
        "Each instance has its own copy",
        "Changes to one don't affect others",
        "Persist for object's lifetime",
        "Local variables only exist during method call",
        "Best practice: initialize all in __init__",
        "Can be any type including lists/dicts",
      ],
      hardwareDemo: "See separate memory for each instance. Watch variables persist across calls.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 5,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson8_1_5.number}: ${lesson8_1_5.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_1_5.id,
        number: 1,
        title: "Independent Instances",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create two Dog instances and show they have independent name attributes.",
        starterCode: "class Dog:\n    def __init__(self, name):\n        self.name = name\n\n# Create two dogs\n\n# Change one dog's name\n\n# Print both to show independence",
        solution: "class Dog:\n    def __init__(self, name):\n        self.name = name\n\ndog1 = Dog(\"Fido\")\ndog2 = Dog(\"Rex\")\n\nprint(f\"Before: {dog1.name}, {dog2.name}\")\n\ndog1.name = \"Buddy\"\n\nprint(f\"After changing dog1: {dog1.name}, {dog2.name}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "dog2.name unchanged", description: "Independence shown" }]),
        hints: ["Change only dog1.name", "dog2.name should be unchanged"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson8_1_5.id,
        number: 2,
        title: "Persistent State",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create Counter class showing state persists across method calls.",
        starterCode: "class Counter:\n    def __init__(self):\n        self.count = 0\n    \n    def increment(self):\n        self.count += 1\n\n# Create counter and call increment multiple times\n# Show count persists",
        solution: "class Counter:\n    def __init__(self):\n        self.count = 0\n    \n    def increment(self):\n        self.count += 1\n\ncounter = Counter()\nprint(f\"Initial: {counter.count}\")\n\ncounter.increment()\nprint(f\"After 1st increment: {counter.count}\")\n\ncounter.increment()\ncounter.increment()\nprint(f\"After 2 more increments: {counter.count}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "0, 1, 3", description: "Count persists" }]),
        hints: ["Each increment adds to persistent count", "Value carries over between calls"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson8_1_5.id,
        number: 3,
        title: "List Instance Variable",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create Notebook class with pages list that persists.",
        starterCode: "class Notebook:\n    def __init__(self):\n        self.pages = []\n    \n    def add_page(self, content):\n        # Add content to pages\n        pass\n    \n    def show_pages(self):\n        # Print all pages\n        pass\n\nnb = Notebook()\nnb.add_page(\"Page 1 content\")\nnb.add_page(\"Page 2 content\")\nnb.show_pages()",
        solution: "class Notebook:\n    def __init__(self):\n        self.pages = []\n    \n    def add_page(self, content):\n        self.pages.append(content)\n    \n    def show_pages(self):\n        for i, page in enumerate(self.pages, 1):\n            print(f\"Page {i}: {page}\")\n\nnb = Notebook()\nnb.add_page(\"Page 1 content\")\nnb.add_page(\"Page 2 content\")\nnb.show_pages()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Both pages shown", description: "List persists" }]),
        hints: ["self.pages.append(content)", "enumerate for page numbers"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson8_1_5.id,
        number: 4,
        title: "Two Independent Lists",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show that two Notebook instances have independent pages lists.",
        starterCode: "class Notebook:\n    def __init__(self, owner):\n        self.owner = owner\n        self.pages = []\n    \n    def add_page(self, content):\n        self.pages.append(content)\n\n# Create two notebooks\n# Add different pages to each\n# Show they're independent",
        solution: "class Notebook:\n    def __init__(self, owner):\n        self.owner = owner\n        self.pages = []\n    \n    def add_page(self, content):\n        self.pages.append(content)\n\nalice_nb = Notebook(\"Alice\")\nbob_nb = Notebook(\"Bob\")\n\nalice_nb.add_page(\"Alice's notes\")\nalice_nb.add_page(\"More notes\")\n\nbob_nb.add_page(\"Bob's stuff\")\n\nprint(f\"{alice_nb.owner}'s pages: {alice_nb.pages}\")\nprint(f\"{bob_nb.owner}'s pages: {bob_nb.pages}\")\nprint(f\"\\nIndependent: {alice_nb.pages is not bob_nb.pages}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Different pages in each", description: "Lists independent" }]),
        hints: ["Each notebook has own pages list", "Adding to one doesn't affect other"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson8_1_5.id,
        number: 5,
        title: "Track History",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create Calculator that tracks history of operations.",
        starterCode: "class Calculator:\n    def __init__(self):\n        self.result = 0\n        self.history = []\n    \n    def add(self, n):\n        # Add n to result, record in history\n        pass\n    \n    def subtract(self, n):\n        # Subtract n from result, record in history\n        pass\n    \n    def show_history(self):\n        # Show all operations\n        pass\n\ncalc = Calculator()\ncalc.add(10)\ncalc.subtract(3)\ncalc.add(5)\ncalc.show_history()\nprint(f\"Final result: {calc.result}\")",
        solution: "class Calculator:\n    def __init__(self):\n        self.result = 0\n        self.history = []\n    \n    def add(self, n):\n        self.result += n\n        self.history.append(f\"+ {n} = {self.result}\")\n    \n    def subtract(self, n):\n        self.result -= n\n        self.history.append(f\"- {n} = {self.result}\")\n    \n    def show_history(self):\n        print(\"History:\")\n        for op in self.history:\n            print(f\"  {op}\")\n\ncalc = Calculator()\ncalc.add(10)\ncalc.subtract(3)\ncalc.add(5)\ncalc.show_history()\nprint(f\"Final result: {calc.result}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "History and result: 12", description: "History tracked" }]),
        hints: ["Append operation string to history", "Include result in string"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 8.1.5`);

  console.log("\n✅ Chapter 8 Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
