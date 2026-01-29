import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 8 Part 1: Structure + Lessons 8.1.1-8.1.2...\n");

  // Create Chapter 8
  let chapter8 = await prisma.chapter.findFirst({ where: { number: 8 } });
  if (!chapter8) {
    chapter8 = await prisma.chapter.create({
      data: {
        number: 8,
        title: "Classes and Object-Oriented Programming",
        description: "Master OOP - the dominant programming paradigm. Learn to create classes, objects, and use inheritance to build organized, reusable code.",
        objectives: [
          "Understand classes as blueprints for objects",
          "Create classes with __init__ and instance methods",
          "Use inheritance to extend functionality",
          "Apply encapsulation and special methods",
        ],
        isPublished: true,
      },
    });
  }
  console.log(`✅ Chapter ${chapter8.number}: ${chapter8.title}`);

  // Create Sections
  const section8_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter8.id, number: 8.1 } },
    update: {},
    create: { chapterId: chapter8.id, number: 8.1, title: "Classes and Objects", description: "Fundamentals of OOP.", order: 1 },
  });
  console.log(`  📂 Section ${section8_1.number}: ${section8_1.title}`);

  const section8_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter8.id, number: 8.2 } },
    update: {},
    create: { chapterId: chapter8.id, number: 8.2, title: "Inheritance", description: "Extending classes.", order: 2 },
  });
  console.log(`  📂 Section ${section8_2.number}: ${section8_2.title}`);

  const section8_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter8.id, number: 8.3 } },
    update: {},
    create: { chapterId: chapter8.id, number: 8.3, title: "Encapsulation and Special Methods", description: "Advanced OOP features.", order: 3 },
  });
  console.log(`  📂 Section ${section8_3.number}: ${section8_3.title}`);

  const section8_4 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter8.id, number: 8.4 } },
    update: {},
    create: { chapterId: chapter8.id, number: 8.4, title: "Advanced Topics", description: "Generators and design principles.", order: 4 },
  });
  console.log(`  📂 Section ${section8_4.number}: ${section8_4.title}`);

  // ==================== LESSON 8.1.1 ====================
  const lesson8_1_1 = await prisma.lesson.upsert({
    where: { slug: "intro-classes-objects" },
    update: {},
    create: {
      sectionId: section8_1.id,
      number: 8.11,
      title: "Introduction to Classes and Objects",
      slug: "intro-classes-objects",
      objectives: [
        "Understand what objects are (data + behavior)",
        "Understand what classes are (templates)",
        "Know why OOP matters",
        "See real-world class examples",
      ],
      content: `# Introduction to Classes and Objects

## Everything in Python is an Object!

You've been using objects all along:

\`\`\`python
name = "Alice"          # str object
numbers = [1, 2, 3]     # list object
print(type(name))       # <class 'str'>
\`\`\`

## What is an Object?

An object combines:
- **Data** (attributes): What it knows
- **Behavior** (methods): What it can do

\`\`\`python
# A string object
name = "alice"
# Data: the characters "alice"
# Behavior: .upper(), .split(), .replace(), etc.
print(name.upper())  # "ALICE"
\`\`\`

## What is a Class?

A **class** is a blueprint/template for creating objects.

Think of it like:
- **Class**: Cookie cutter
- **Object**: Individual cookie

\`\`\`
Class: Dog
├── Data: name, age, breed
└── Behavior: bark(), eat(), sleep()

Objects:
├── fido (name="Fido", age=3, breed="Labrador")
├── rex (name="Rex", age=5, breed="German Shepherd")
└── spot (name="Spot", age=1, breed="Beagle")
\`\`\`

## Why OOP?

1. **Organization**: Group related data and functions
2. **Reuse**: Create many objects from one class
3. **Abstraction**: Hide complexity behind simple interface
4. **Modeling**: Represent real-world entities naturally

## Real-World Examples

| Class | Data (Attributes) | Behavior (Methods) |
|-------|------------------|-------------------|
| BankAccount | balance, owner | deposit(), withdraw() |
| Car | color, speed, fuel | accelerate(), brake() |
| User | name, email, password | login(), logout() |
| Rectangle | width, height | area(), perimeter() |`,
      codeExamples: JSON.stringify([
        {
          id: "objects-everywhere",
          title: "Objects Are Everywhere",
          code: "# Strings are objects\nname = \"alice\"\nprint(f\"Type: {type(name)}\")\nprint(f\"Upper: {name.upper()}\")\nprint(f\"Has data: '{name}'\")\nprint(f\"Has methods: {[m for m in dir(name) if not m.startswith('_')][:5]}...\")\n\nprint()\n\n# Lists are objects\nnumbers = [3, 1, 4, 1, 5]\nprint(f\"Type: {type(numbers)}\")\nprint(f\"Data: {numbers}\")\nnumbers.sort()  # Method!\nprint(f\"After sort: {numbers}\")\n\nprint()\n\n# Even integers are objects!\nx = 42\nprint(f\"Type: {type(x)}\")\nprint(f\"Bit length: {x.bit_length()}\")  # Method on int!",
          description: "Everything in Python is an object",
        },
        {
          id: "class-concept",
          title: "The Class Concept",
          code: "# Think of a class as a blueprint\n# Here's a simple preview (we'll learn the syntax next)\n\nclass Dog:\n    \"\"\"A simple Dog class.\"\"\"\n    \n    def __init__(self, name, age):\n        self.name = name  # Data\n        self.age = age    # Data\n    \n    def bark(self):       # Behavior\n        return f\"{self.name} says Woof!\"\n    \n    def describe(self):   # Behavior\n        return f\"{self.name} is {self.age} years old\"\n\n# Create objects (instances) from the class\nfido = Dog(\"Fido\", 3)\nrex = Dog(\"Rex\", 5)\n\n# Each object has its own data\nprint(fido.describe())\nprint(rex.describe())\n\n# Each object has the same behaviors\nprint(fido.bark())\nprint(rex.bark())",
          description: "Classes are blueprints for objects",
        },
        {
          id: "why-oop",
          title: "Why OOP Matters",
          code: "# WITHOUT classes - scattered data and functions\nuser1_name = \"Alice\"\nuser1_email = \"alice@example.com\"\nuser1_balance = 100\n\nuser2_name = \"Bob\"\nuser2_email = \"bob@example.com\"\nuser2_balance = 50\n\ndef get_user_info(name, email, balance):\n    return f\"{name} ({email}): ${balance}\"\n\n# Messy! Data can get out of sync!\n\nprint(\"Without OOP:\")\nprint(get_user_info(user1_name, user1_email, user1_balance))\n\nprint()\n\n# WITH classes - organized!\nclass User:\n    def __init__(self, name, email, balance):\n        self.name = name\n        self.email = email\n        self.balance = balance\n    \n    def info(self):\n        return f\"{self.name} ({self.email}): ${self.balance}\"\n\nuser1 = User(\"Alice\", \"alice@example.com\", 100)\nuser2 = User(\"Bob\", \"bob@example.com\", 50)\n\nprint(\"With OOP:\")\nprint(user1.info())\nprint(user2.info())",
          description: "OOP organizes code better",
        },
        {
          id: "real-world",
          title: "Real-World Modeling",
          code: "# Classes model real-world entities naturally\n\nclass BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n    \n    def deposit(self, amount):\n        self.balance += amount\n        return f\"Deposited ${amount}. New balance: ${self.balance}\"\n    \n    def withdraw(self, amount):\n        if amount > self.balance:\n            return \"Insufficient funds!\"\n        self.balance -= amount\n        return f\"Withdrew ${amount}. New balance: ${self.balance}\"\n\n# Create and use accounts\nalice_account = BankAccount(\"Alice\", 1000)\nbob_account = BankAccount(\"Bob\", 500)\n\nprint(alice_account.deposit(200))\nprint(alice_account.withdraw(150))\nprint(bob_account.withdraw(600))  # Insufficient!\nprint(bob_account.withdraw(100))",
          description: "Modeling real-world entities",
        },
      ]),
      keyPoints: [
        "Everything in Python is an object",
        "Objects combine data (attributes) and behavior (methods)",
        "A class is a blueprint/template for objects",
        "Objects are instances of a class",
        "OOP organizes related data and functions together",
        "Multiple objects from same class, different data",
        "Classes model real-world entities naturally",
        "str, list, int are all classes!",
      ],
      hardwareDemo: "See class as template in memory. Watch multiple objects created with own data.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson8_1_1.number}: ${lesson8_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_1_1.id,
        number: 1,
        title: "Identify Object Parts",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "In `name = 'alice'; name.upper()`, what is `upper()`?",
        starterCode: "",
        solution: "A method (behavior) of the string object",
        testCases: JSON.stringify([
          { input: "A method (behavior)", expectedOutput: "true", description: "Correct!" },
          { input: "An attribute (data)", expectedOutput: "false", description: "Attributes store data" },
          { input: "A class", expectedOutput: "false", description: "Classes are blueprints" },
        ]),
        hints: ["Methods are what objects can DO", "upper() performs an action"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson8_1_1.id,
        number: 2,
        title: "Class vs Object",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "If Dog is a class and fido = Dog('Fido'), what is fido?",
        starterCode: "",
        solution: "An object (instance) of the Dog class",
        testCases: JSON.stringify([
          { input: "An object (instance)", expectedOutput: "true", description: "Correct!" },
          { input: "A class", expectedOutput: "false", description: "Dog is the class" },
          { input: "A method", expectedOutput: "false", description: "Methods are behaviors" },
        ]),
        hints: ["Classes are blueprints", "Objects are created FROM classes"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson8_1_1.id,
        number: 3,
        title: "Explore Built-in Objects",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Use type() to show that strings and lists are objects of classes.",
        starterCode: "name = \"Alice\"\nnumbers = [1, 2, 3]\n\n# Print the type of each\n",
        solution: "name = \"Alice\"\nnumbers = [1, 2, 3]\n\nprint(f\"name is type: {type(name)}\")\nprint(f\"numbers is type: {type(numbers)}\")\n\n# They're classes!\nprint(f\"\\nname is instance of str: {isinstance(name, str)}\")\nprint(f\"numbers is instance of list: {isinstance(numbers, list)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "<class 'str'> and <class 'list'>", description: "Types shown" }]),
        hints: ["type(variable) shows the class", "Everything is an object of some class"],
        xpReward: 10,
        order: 3,
      },
      {
        lessonId: lesson8_1_1.id,
        number: 4,
        title: "Data vs Behavior",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a list and demonstrate both its data and a method (behavior).",
        starterCode: "# Create a list (data)\nfruits = [\"apple\", \"banana\", \"cherry\"]\n\n# Show the data\n\n# Use a method (behavior) - try append or sort\n\n# Show the data again\n",
        solution: "fruits = [\"apple\", \"banana\", \"cherry\"]\n\n# Show the data\nprint(f\"Data: {fruits}\")\n\n# Use a method (behavior)\nfruits.append(\"date\")\nprint(f\"After append: {fruits}\")\n\nfruits.sort()\nprint(f\"After sort: {fruits}\")\n\n# Data changed by behavior!\nprint(f\"\\nObject has data: {fruits}\")\nprint(f\"Object has methods: append, sort, etc.\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Data shown and modified by methods", description: "Data + behavior demonstrated" }]),
        hints: ["Data is what's IN the list", "Methods like append() change it"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson8_1_1.id,
        number: 5,
        title: "Design a Class Concept",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Think of a real-world object. List what data and methods it would have (as comments).",
        starterCode: "# Design a class concept (no code yet, just planning)\n# Pick something: Book, Car, Student, Game, etc.\n\n# Class name: ???\n\n# Data (attributes) it would have:\n# - ???\n# - ???\n# - ???\n\n# Behaviors (methods) it would have:\n# - ???\n# - ???\n# - ???",
        solution: "# Design a class concept\n\n# Class name: Book\n\n# Data (attributes) it would have:\n# - title (string)\n# - author (string)\n# - pages (integer)\n# - current_page (integer)\n\n# Behaviors (methods) it would have:\n# - read(num_pages) - advance current_page\n# - bookmark() - save current position\n# - info() - display book details\n\nprint(\"Class: Book\")\nprint(\"Data: title, author, pages, current_page\")\nprint(\"Methods: read(), bookmark(), info()\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Class design shown", description: "Thoughtful design" }]),
        hints: ["Think: what would this object KNOW?", "Think: what could this object DO?"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 8.1.1`);

  // ==================== LESSON 8.1.2 ====================
  const lesson8_1_2 = await prisma.lesson.upsert({
    where: { slug: "defining-first-class" },
    update: {},
    create: {
      sectionId: section8_1.id,
      number: 8.12,
      title: "Defining Your First Class",
      slug: "defining-first-class",
      objectives: [
        "Use the class keyword",
        "Follow naming conventions",
        "Understand class body structure",
        "Create instances of a class",
      ],
      content: `# Defining Your First Class

## The class Keyword

\`\`\`python
class ClassName:
    \"\"\"Docstring describing the class.\"\"\"
    pass  # Class body
\`\`\`

## Naming Conventions

- **Classes**: CapWords (PascalCase)
  - \`BankAccount\`, \`ShoppingCart\`, \`UserProfile\`
- **Methods/Variables**: snake_case
  - \`get_balance\`, \`user_name\`, \`total_price\`

\`\`\`python
class MyClass:      # CapWords
    def my_method(self):  # snake_case
        my_variable = 10   # snake_case
\`\`\`

## Simplest Class

\`\`\`python
class Dog:
    pass  # Empty class body

# Create instances
fido = Dog()
rex = Dog()

print(type(fido))  # <class '__main__.Dog'>
\`\`\`

## Adding Attributes Directly

\`\`\`python
class Dog:
    pass

fido = Dog()
fido.name = "Fido"  # Add attribute after creation
fido.age = 3

print(f"{fido.name} is {fido.age}")
\`\`\`

Note: This works but isn't the best practice. We'll learn \`__init__\` next!

## Creating Multiple Instances

\`\`\`python
class Dog:
    pass

dog1 = Dog()
dog2 = Dog()
dog3 = Dog()

# Each is a separate object
print(dog1 is dog2)  # False - different objects!
\`\`\`

Each instance has its own identity and can have its own data.`,
      codeExamples: JSON.stringify([
        {
          id: "basic-class",
          title: "Basic Class Definition",
          code: "# Simplest possible class\nclass Dog:\n    \"\"\"A simple Dog class.\"\"\"\n    pass\n\n# Create instances (objects)\nfido = Dog()\nrex = Dog()\n\n# Check their types\nprint(f\"fido type: {type(fido)}\")\nprint(f\"rex type: {type(rex)}\")\n\n# They're different objects\nprint(f\"\\nfido is rex: {fido is rex}\")\nprint(f\"Same class: {type(fido) == type(rex)}\")",
          description: "Defining an empty class",
        },
        {
          id: "adding-attributes",
          title: "Adding Attributes to Instances",
          code: "class Person:\n    \"\"\"A Person class.\"\"\"\n    pass\n\n# Create instances\nalice = Person()\nbob = Person()\n\n# Add attributes to each instance\nalice.name = \"Alice\"\nalice.age = 25\n\nbob.name = \"Bob\"\nbob.age = 30\n\n# Each instance has its own data\nprint(f\"{alice.name} is {alice.age} years old\")\nprint(f\"{bob.name} is {bob.age} years old\")\n\n# Instances are independent\nalice.age = 26  # Only changes alice!\nprint(f\"\\nAfter alice's birthday:\")\nprint(f\"{alice.name}: {alice.age}\")\nprint(f\"{bob.name}: {bob.age}\")",
          description: "Adding attributes dynamically",
        },
        {
          id: "naming-conventions",
          title: "Naming Conventions",
          code: "# GOOD naming\nclass BankAccount:    # CapWords for class\n    pass\n\nclass ShoppingCart:   # CapWords\n    pass\n\nclass UserProfile:    # CapWords\n    pass\n\n# Create instances with snake_case names\nmy_account = BankAccount()\nshopping_cart = ShoppingCart()\nuser_profile = UserProfile()\n\n# Add attributes with snake_case\nmy_account.account_number = \"12345\"\nmy_account.current_balance = 1000\n\nprint(f\"Account: {my_account.account_number}\")\nprint(f\"Balance: ${my_account.current_balance}\")\n\n# BAD naming (don't do this!)\n# class bank_account:  # Wrong: should be CapWords\n# class bankaccount:   # Wrong: no separation",
          description: "Following Python naming conventions",
        },
        {
          id: "multiple-instances",
          title: "Multiple Independent Instances",
          code: "class Car:\n    \"\"\"A Car class.\"\"\"\n    pass\n\n# Create multiple cars\ncar1 = Car()\ncar2 = Car()\ncar3 = Car()\n\n# Give each different data\ncar1.make = \"Toyota\"\ncar1.model = \"Camry\"\ncar1.year = 2020\n\ncar2.make = \"Honda\"\ncar2.model = \"Civic\"\ncar2.year = 2022\n\ncar3.make = \"Ford\"\ncar3.model = \"Mustang\"\ncar3.year = 2021\n\n# Each car is independent\ncars = [car1, car2, car3]\nfor car in cars:\n    print(f\"{car.year} {car.make} {car.model}\")\n\n# They're all Car instances\nprint(f\"\\nAll are Cars: {all(isinstance(c, Car) for c in cars)}\")",
          description: "Creating many objects from one class",
        },
      ]),
      keyPoints: [
        "class ClassName: defines a new class",
        "Class names use CapWords (PascalCase)",
        "Method/variable names use snake_case",
        "pass creates empty class body",
        "ClassName() creates an instance",
        "Each instance is a separate object",
        "Attributes can be added to instances",
        "Docstrings document what class represents",
      ],
      hardwareDemo: "See class definition in memory. Watch instances created as separate objects.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson8_1_2.number}: ${lesson8_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_1_2.id,
        number: 1,
        title: "Create Empty Class",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Define an empty class called Book and create an instance called my_book.",
        starterCode: "# Define Book class\n\n# Create instance called my_book\n\nprint(type(my_book))",
        solution: "class Book:\n    \"\"\"A Book class.\"\"\"\n    pass\n\nmy_book = Book()\n\nprint(type(my_book))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "<class '__main__.Book'>", description: "Class defined" }]),
        hints: ["class ClassName: pass", "instance = ClassName()"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson8_1_2.id,
        number: 2,
        title: "Add Attributes",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a Book class, make an instance, and add title and author attributes.",
        starterCode: "class Book:\n    pass\n\n# Create instance\nmy_book = Book()\n\n# Add title and author attributes\n\n# Print them\n",
        solution: "class Book:\n    pass\n\nmy_book = Book()\n\nmy_book.title = \"Python Crash Course\"\nmy_book.author = \"Eric Matthes\"\n\nprint(f\"Title: {my_book.title}\")\nprint(f\"Author: {my_book.author}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Title and author printed", description: "Attributes added" }]),
        hints: ["object.attribute = value", "Access with object.attribute"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson8_1_2.id,
        number: 3,
        title: "Multiple Instances",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a Student class with two instances having different names and grades.",
        starterCode: "class Student:\n    pass\n\n# Create two students with different data\n\n# Print each student's info\n",
        solution: "class Student:\n    pass\n\nstudent1 = Student()\nstudent1.name = \"Alice\"\nstudent1.grade = 95\n\nstudent2 = Student()\nstudent2.name = \"Bob\"\nstudent2.grade = 87\n\nprint(f\"{student1.name}: {student1.grade}\")\nprint(f\"{student2.name}: {student2.grade}\")\n\n# They're independent\nprint(f\"\\nSame object? {student1 is student2}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Two students with different data", description: "Independent instances" }]),
        hints: ["Create two separate instances", "Each can have different attribute values"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson8_1_2.id,
        number: 4,
        title: "Fix Naming",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Fix the naming conventions in this code.",
        starterCode: "# Fix the naming conventions\nclass shopping_cart:  # Wrong!\n    pass\n\nMyCart = shopping_cart()  # Wrong!\nMyCart.TotalPrice = 100   # Wrong!",
        solution: "class ShoppingCart:  # CapWords for class\n    pass\n\nmy_cart = ShoppingCart()  # snake_case for variable\nmy_cart.total_price = 100  # snake_case for attribute\n\nprint(f\"Cart total: ${my_cart.total_price}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Cart total: $100", description: "Naming fixed" }]),
        hints: ["Classes use CapWords", "Variables use snake_case"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson8_1_2.id,
        number: 5,
        title: "Build a Simple Class",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a Rectangle class, make two instances with different dimensions.",
        starterCode: "# Create Rectangle class\n\n# Create two rectangles with different widths and heights\n\n# Print dimensions of each\n",
        solution: "class Rectangle:\n    \"\"\"A Rectangle with width and height.\"\"\"\n    pass\n\nrect1 = Rectangle()\nrect1.width = 10\nrect1.height = 5\n\nrect2 = Rectangle()\nrect2.width = 7\nrect2.height = 3\n\nprint(f\"Rectangle 1: {rect1.width} x {rect1.height}\")\nprint(f\"Rectangle 2: {rect2.width} x {rect2.height}\")\n\n# Calculate areas manually (we'll add methods later!)\nprint(f\"\\nArea 1: {rect1.width * rect1.height}\")\nprint(f\"Area 2: {rect2.width * rect2.height}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Two rectangles with dimensions", description: "Class created" }]),
        hints: ["Create class with pass", "Add width and height to each instance"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 8.1.2`);

  console.log("\n✅ Chapter 8 Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
