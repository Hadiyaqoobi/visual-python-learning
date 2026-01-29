import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Chapter 8: Classes and Object-Oriented Programming...");

  // Create Chapter 8
  const chapter8 = await prisma.chapter.upsert({
    where: { number: 8 },
    update: {},
    create: {
      number: 8,
      title: "Classes and Object-Oriented Programming",
      description: "Master object-oriented programming with classes, inheritance, encapsulation, and generators.",
      objectives: [
        "Define classes with attributes and methods",
        "Understand __init__ constructors and self",
        "Use inheritance to create class hierarchies",
        "Override methods in subclasses",
        "Apply encapsulation principles",
        "Create generators with yield",
      ],
      isPublished: true,
    },
  });

  console.log("✅ Created Chapter 8:", chapter8.title);

  // Create Sections
  const section8_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter8.id, number: 8.1 } },
    update: {},
    create: {
      chapterId: chapter8.id,
      number: 8.1,
      title: "Classes and Objects",
      description: "Creating and using classes",
      order: 1,
    },
  });

  const section8_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter8.id, number: 8.2 } },
    update: {},
    create: {
      chapterId: chapter8.id,
      number: 8.2,
      title: "Inheritance",
      description: "Building class hierarchies",
      order: 2,
    },
  });

  const section8_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter8.id, number: 8.3 } },
    update: {},
    create: {
      chapterId: chapter8.id,
      number: 8.3,
      title: "Encapsulation",
      description: "Information hiding and properties",
      order: 3,
    },
  });

  const section8_4 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter8.id, number: 8.4 } },
    update: {},
    create: {
      chapterId: chapter8.id,
      number: 8.4,
      title: "Generators",
      description: "Lazy evaluation with yield",
      order: 4,
    },
  });

  // ==================== LESSON 8.1.1: Introduction to Classes ====================
  const lesson8_1_1 = await prisma.lesson.upsert({
    where: { slug: "intro-classes" },
    update: {},
    create: {
      sectionId: section8_1.id,
      number: 8.11,
      title: "Introduction to Classes",
      slug: "intro-classes",
      objectives: [
        "Understand what classes and objects are",
        "Know the difference between class and instance",
        "Recognize built-in types as classes",
        "Understand why OOP is useful",
      ],
      content: `# Introduction to Classes

**Object-Oriented Programming (OOP)** is a way of organizing code around objects that contain both data and behavior.

## What is a Class?

A **class** is a blueprint for creating objects. It defines:
- **Attributes**: Data the object holds
- **Methods**: Actions the object can perform

## What is an Object?

An **object** (or instance) is a specific thing created from a class.

\`\`\`python
# str is a class
# "hello" is an object (instance) of that class
greeting = "hello"
\`\`\`

## Real-World Analogy

- **Class**: Cookie cutter (the template)
- **Object**: Actual cookie (made from template)

You can make many cookies from one cutter, and each cookie is separate.

## You've Been Using Classes!

\`\`\`python
# list is a class
my_list = [1, 2, 3]  # my_list is an instance

# str is a class
my_str = "hello"  # my_str is an instance

# All objects have methods from their class
my_list.append(4)  # append is a list method
my_str.upper()     # upper is a str method
\`\`\`

## Why OOP?

1. **Organization**: Group related data and functions
2. **Reusability**: Define once, use many times
3. **Abstraction**: Hide complexity behind simple interfaces
4. **Modeling**: Represent real-world concepts naturally

## Creating Your Own Classes

Soon you'll create your own classes like:
- \`Person\` with name and age
- \`BankAccount\` with balance
- \`Rectangle\` with width and height`,
      codeExamples: JSON.stringify([
        {
          id: "built-in-classes",
          title: "Built-in Types Are Classes",
          code: `# str is a class
name = "Alice"
print(f"Type of name: {type(name)}")
print(f"Is instance of str: {isinstance(name, str)}")

# list is a class
numbers = [1, 2, 3]
print(f"Type of numbers: {type(numbers)}")

# int is a class
age = 25
print(f"Type of age: {type(age)}")`,
          description: "Every value is an object of some class",
        },
        {
          id: "objects-have-methods",
          title: "Objects Have Methods",
          code: `# String methods
text = "hello world"
print(text.upper())
print(text.title())
print(text.split())

# List methods
items = [3, 1, 4, 1, 5]
items.sort()
print(items)
items.append(9)
print(items)`,
          description: "Methods come from the object's class",
        },
        {
          id: "multiple-instances",
          title: "Multiple Instances",
          code: `# Each string is a separate object
str1 = "hello"
str2 = "world"
str3 = "hello"

# Different objects, same class
print(f"str1 is str2: {str1 is str2}")
print(f"str1 == str3: {str1 == str3}")

# Each has its own data
print(f"str1.upper(): {str1.upper()}")
print(f"str2.upper(): {str2.upper()}")`,
          description: "Many objects from one class",
        },
      ]),
      keyPoints: [
        "A class is a blueprint for creating objects",
        "An object (instance) is created from a class",
        "Objects have attributes (data) and methods (behavior)",
        "Built-in types like str, list, int are classes",
        "OOP helps organize and reuse code",
      ],
      hardwareDemo: "Watch objects being created in heap memory. Each object has its own memory location and stores its own data, but shares the class definition.",
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_1_1.id,
        number: 1,
        title: "Identify the Class",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Use type() to print what class each value belongs to.",
        starterCode: `name = "Bob"
age = 30
scores = [85, 90, 78]

print(type(name))
print(type(age))
print(type(scores))`,
        solution: `name = "Bob"
age = 30
scores = [85, 90, 78]

print(type(name))
print(type(age))
print(type(scores))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "<class 'str'>\n<class 'int'>\n<class 'list'>", description: "Shows class types" },
        ]),
        hints: ["type() returns the class", "str, int, list are all classes", "Each value is an instance"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson8_1_1.id,
        number: 2,
        title: "Use Object Methods",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Call methods on the string object: upper(), lower(), and title().",
        starterCode: `text = "hello world"

print(text.upper())
print(text.lower())
print(text.title())`,
        solution: `text = "hello world"

print(text.upper())
print(text.lower())
print(text.title())`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "HELLO WORLD\nhello world\nHello World", description: "String methods work" },
        ]),
        hints: ["Methods are called with dot notation", "text.method()", "These return new strings"],
        xpReward: 10,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 8.1.1: Introduction to Classes");

  // ==================== LESSON 8.1.2: Defining Classes ====================
  const lesson8_1_2 = await prisma.lesson.upsert({
    where: { slug: "defining-classes" },
    update: {},
    create: {
      sectionId: section8_1.id,
      number: 8.12,
      title: "Defining Classes",
      slug: "defining-classes",
      objectives: [
        "Define a simple class",
        "Create instances of a class",
        "Understand the class keyword",
        "Add attributes to instances",
      ],
      content: `# Defining Classes

Let's create our own classes!

## Basic Class Definition

\`\`\`python
class Dog:
    pass  # Empty class for now
\`\`\`

That's it! \`class\` keyword, name (capitalized), colon, body.

## Creating Instances

\`\`\`python
my_dog = Dog()  # Create an instance
your_dog = Dog()  # Create another instance
\`\`\`

Each call to \`Dog()\` creates a new object.

## Adding Attributes

You can add attributes to instances:

\`\`\`python
my_dog = Dog()
my_dog.name = "Rex"
my_dog.age = 3

print(my_dog.name)  # Rex
print(my_dog.age)   # 3
\`\`\`

## Each Instance is Separate

\`\`\`python
dog1 = Dog()
dog1.name = "Rex"

dog2 = Dog()
dog2.name = "Buddy"

print(dog1.name)  # Rex
print(dog2.name)  # Buddy
\`\`\`

## Class Naming Convention

- Use **CamelCase** for class names: \`Dog\`, \`BankAccount\`, \`PersonInfo\`
- Use **snake_case** for variables: \`my_dog\`, \`bank_account\`

## Checking Type

\`\`\`python
my_dog = Dog()
print(type(my_dog))        # <class '__main__.Dog'>
print(isinstance(my_dog, Dog))  # True
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-class",
          title: "Basic Class Definition",
          code: `class Dog:
    pass

# Create instances
dog1 = Dog()
dog2 = Dog()

print(f"dog1 type: {type(dog1)}")
print(f"dog2 type: {type(dog2)}")
print(f"Same object? {dog1 is dog2}")`,
          description: "Define a simple class",
        },
        {
          id: "add-attributes",
          title: "Adding Attributes",
          code: `class Person:
    pass

# Create and configure instance
alice = Person()
alice.name = "Alice"
alice.age = 30
alice.city = "Boston"

print(f"Name: {alice.name}")
print(f"Age: {alice.age}")
print(f"City: {alice.city}")`,
          description: "Add data to objects",
        },
        {
          id: "multiple-instances",
          title: "Multiple Instances",
          code: `class Car:
    pass

car1 = Car()
car1.brand = "Toyota"
car1.year = 2020

car2 = Car()
car2.brand = "Honda"
car2.year = 2022

print(f"Car 1: {car1.brand} ({car1.year})")
print(f"Car 2: {car2.brand} ({car2.year})")`,
          description: "Each instance has its own data",
        },
      ]),
      keyPoints: [
        "Define class with: class ClassName:",
        "Create instance with: ClassName()",
        "Add attributes with: obj.attribute = value",
        "Each instance has its own attributes",
        "Use CamelCase for class names",
      ],
      hardwareDemo: "Watch each instance being created in heap memory. See how different instances have different memory addresses and store different attribute values.",
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_1_2.id,
        number: 1,
        title: "Create a Class",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Define a Book class and create an instance with title and author attributes.",
        starterCode: `class Book:
    pass

# Create instance and add attributes
my_book = Book()
my_book.title = "Python Basics"
my_book.author = "John Doe"

print(f"Title: {my_book.title}")
print(f"Author: {my_book.author}")`,
        solution: `class Book:
    pass

my_book = Book()
my_book.title = "Python Basics"
my_book.author = "John Doe"

print(f"Title: {my_book.title}")
print(f"Author: {my_book.author}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Title: Python Basics\nAuthor: John Doe", description: "Book created with attributes" },
        ]),
        hints: ["Define class with class Book:", "Create instance with Book()", "Add attributes with dot notation"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson8_1_2.id,
        number: 2,
        title: "Two Instances",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create two Student instances with different names and grades.",
        starterCode: `class Student:
    pass

student1 = Student()
student1.name = "Alice"
student1.grade = 95

student2 = Student()
student2.name = "Bob"
student2.grade = 87

print(f"{student1.name}: {student1.grade}")
print(f"{student2.name}: {student2.grade}")`,
        solution: `class Student:
    pass

student1 = Student()
student1.name = "Alice"
student1.grade = 95

student2 = Student()
student2.name = "Bob"
student2.grade = 87

print(f"{student1.name}: {student1.grade}")
print(f"{student2.name}: {student2.grade}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Alice: 95\nBob: 87", description: "Two separate students" },
        ]),
        hints: ["Each Student() creates new instance", "Assign different attributes to each", "They don't share data"],
        xpReward: 15,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 8.1.2: Defining Classes");

  // ==================== LESSON 8.1.3: __init__ Constructor ====================
  const lesson8_1_3 = await prisma.lesson.upsert({
    where: { slug: "init-constructor" },
    update: {},
    create: {
      sectionId: section8_1.id,
      number: 8.13,
      title: "The __init__ Constructor",
      slug: "init-constructor",
      objectives: [
        "Understand the __init__ method",
        "Initialize attributes when creating objects",
        "Use self to refer to the instance",
        "Define required and optional parameters",
      ],
      content: `# The __init__ Constructor

Instead of adding attributes after creation, we can initialize them automatically.

## The __init__ Method

\`__init__\` is called automatically when you create an instance:

\`\`\`python
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

rex = Dog("Rex", 3)  # __init__ is called
print(rex.name)  # Rex
\`\`\`

## What is self?

\`self\` is a reference to the current instance:

\`\`\`python
class Dog:
    def __init__(self, name):
        self.name = name  # self.name is the instance's attribute
                          # name is the parameter
\`\`\`

When you call \`Dog("Rex")\`:
- Python creates a new Dog object
- Passes it as \`self\` to \`__init__\`
- You use \`self\` to set up the object

## Required vs Optional Parameters

\`\`\`python
class Person:
    def __init__(self, name, age=0):  # age has default
        self.name = name
        self.age = age

alice = Person("Alice", 30)   # Both provided
baby = Person("Baby")         # age defaults to 0
\`\`\`

## Benefits of __init__

1. Objects are always properly initialized
2. Can't forget to set required attributes
3. Cleaner, more organized code
4. Clear what data the class needs`,
      codeExamples: JSON.stringify([
        {
          id: "basic-init",
          title: "Basic __init__",
          code: `class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

# Create dogs - __init__ called automatically
rex = Dog("Rex", 3)
buddy = Dog("Buddy", 5)

print(f"{rex.name} is {rex.age} years old")
print(f"{buddy.name} is {buddy.age} years old")`,
          description: "Initialize attributes in __init__",
        },
        {
          id: "default-values",
          title: "Default Parameter Values",
          code: `class Rectangle:
    def __init__(self, width, height=None):
        self.width = width
        # If height not given, make it a square
        self.height = height if height else width

square = Rectangle(5)
rect = Rectangle(4, 6)

print(f"Square: {square.width}x{square.height}")
print(f"Rectangle: {rect.width}x{rect.height}")`,
          description: "Optional parameters with defaults",
        },
        {
          id: "self-explained",
          title: "Understanding self",
          code: `class Counter:
    def __init__(self, start=0):
        print(f"Creating counter, self is: {self}")
        self.value = start

c1 = Counter(10)
c2 = Counter(20)

print(f"c1.value = {c1.value}")
print(f"c2.value = {c2.value}")`,
          description: "self refers to each instance",
        },
      ]),
      keyPoints: [
        "__init__ is called when creating an instance",
        "self is a reference to the instance being created",
        "Use self.attribute = value to set attributes",
        "Parameters after self are passed when creating",
        "Can have default values for optional attributes",
      ],
      hardwareDemo: "Watch __init__ being called automatically. See self pointing to the newly created object in memory, and attributes being stored in the object's memory space.",
      estimatedTime: 18,
      difficulty: "BEGINNER",
      order: 3,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_1_3.id,
        number: 1,
        title: "Write __init__",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Complete the Person class with an __init__ that takes name and age.",
        starterCode: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

alice = Person("Alice", 30)
print(f"{alice.name} is {alice.age} years old")`,
        solution: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

alice = Person("Alice", 30)
print(f"{alice.name} is {alice.age} years old")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Alice is 30 years old", description: "Person initialized correctly" },
        ]),
        hints: ["def __init__(self, name, age):", "self.name = name", "self.age = age"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson8_1_3.id,
        number: 2,
        title: "Default Value",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a BankAccount class where balance defaults to 0.",
        starterCode: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

acc1 = BankAccount("Alice", 100)
acc2 = BankAccount("Bob")

print(f"{acc1.owner}: {acc1.balance}")
print(f"{acc2.owner}: {acc2.balance}")`,
        solution: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

acc1 = BankAccount("Alice", 100)
acc2 = BankAccount("Bob")

print(f"{acc1.owner}: {acc1.balance}")
print(f"{acc2.owner}: {acc2.balance}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Alice: 100\nBob: 0", description: "Default balance works" },
        ]),
        hints: ["balance=0 sets default", "Alice provides balance", "Bob uses default 0"],
        xpReward: 20,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 8.1.3: __init__ Constructor");

  // ==================== LESSON 8.1.4: Instance Methods ====================
  const lesson8_1_4 = await prisma.lesson.upsert({
    where: { slug: "instance-methods" },
    update: {},
    create: {
      sectionId: section8_1.id,
      number: 8.14,
      title: "Instance Methods",
      slug: "instance-methods",
      objectives: [
        "Define methods in a class",
        "Understand how self works in methods",
        "Call methods on instances",
        "Access and modify attributes in methods",
      ],
      content: `# Instance Methods

Methods are functions that belong to a class and operate on instances.

## Defining Methods

\`\`\`python
class Dog:
    def __init__(self, name):
        self.name = name
    
    def bark(self):
        print(f"{self.name} says Woof!")
    
    def greet(self, other_dog):
        print(f"{self.name} greets {other_dog.name}")
\`\`\`

## Calling Methods

\`\`\`python
rex = Dog("Rex")
rex.bark()  # Rex says Woof!
\`\`\`

When you call \`rex.bark()\`:
- Python passes \`rex\` as \`self\` automatically
- The method can access \`self.name\`

## Methods Can Take Parameters

\`\`\`python
class BankAccount:
    def __init__(self, balance=0):
        self.balance = balance
    
    def deposit(self, amount):
        self.balance += amount
    
    def withdraw(self, amount):
        if amount <= self.balance:
            self.balance -= amount
            return True
        return False
\`\`\`

## Methods Can Return Values

\`\`\`python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)
\`\`\`

## self is Always First

Every instance method takes \`self\` as the first parameter:
\`\`\`python
def method(self, other_params):
    # self lets you access the instance
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-methods",
          title: "Basic Methods",
          code: `class Dog:
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed
    
    def bark(self):
        print(f"{self.name} says Woof!")
    
    def describe(self):
        print(f"{self.name} is a {self.breed}")

rex = Dog("Rex", "German Shepherd")
rex.bark()
rex.describe()`,
          description: "Methods using self",
        },
        {
          id: "methods-with-params",
          title: "Methods with Parameters",
          code: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
    
    def deposit(self, amount):
        self.balance += amount
        print(f"Deposited {amount}. Balance: {self.balance}")
    
    def withdraw(self, amount):
        if amount <= self.balance:
            self.balance -= amount
            print(f"Withdrew {amount}. Balance: {self.balance}")
        else:
            print("Insufficient funds!")

account = BankAccount("Alice", 100)
account.deposit(50)
account.withdraw(30)
account.withdraw(200)`,
          description: "Methods that modify state",
        },
        {
          id: "methods-return",
          title: "Methods with Return Values",
          code: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def is_square(self):
        return self.width == self.height

r1 = Rectangle(4, 5)
r2 = Rectangle(3, 3)

print(f"r1 area: {r1.area()}, square: {r1.is_square()}")
print(f"r2 area: {r2.area()}, square: {r2.is_square()}")`,
          description: "Methods that return values",
        },
      ]),
      keyPoints: [
        "Methods are functions defined inside a class",
        "First parameter is always self",
        "Call with: instance.method()",
        "self gives access to instance attributes",
        "Methods can modify attributes and return values",
      ],
      hardwareDemo: "Watch method calls create stack frames. See how self is automatically passed, pointing to the object in heap memory.",
      estimatedTime: 18,
      difficulty: "BEGINNER",
      order: 4,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_1_4.id,
        number: 1,
        title: "Add a Method",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add an introduce method that prints 'Hi, I'm [name] and I'm [age] years old'.",
        starterCode: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        print(f"Hi, I'm {self.name} and I'm {self.age} years old")

alice = Person("Alice", 30)
alice.introduce()`,
        solution: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        print(f"Hi, I'm {self.name} and I'm {self.age} years old")

alice = Person("Alice", 30)
alice.introduce()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Hi, I'm Alice and I'm 30 years old", description: "introduce method works" },
        ]),
        hints: ["def introduce(self):", "Use self.name and self.age", "Use f-string for formatting"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson8_1_4.id,
        number: 2,
        title: "Counter Class",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a Counter class with increment, decrement, and get_value methods.",
        starterCode: `class Counter:
    def __init__(self, start=0):
        self.value = start
    
    def increment(self):
        self.value += 1
    
    def decrement(self):
        self.value -= 1
    
    def get_value(self):
        return self.value

c = Counter(5)
c.increment()
c.increment()
c.decrement()
print(c.get_value())`,
        solution: `class Counter:
    def __init__(self, start=0):
        self.value = start
    
    def increment(self):
        self.value += 1
    
    def decrement(self):
        self.value -= 1
    
    def get_value(self):
        return self.value

c = Counter(5)
c.increment()
c.increment()
c.decrement()
print(c.get_value())`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "6", description: "Counter: 5 + 1 + 1 - 1 = 6" },
        ]),
        hints: ["increment adds 1 to self.value", "decrement subtracts 1", "get_value returns self.value"],
        xpReward: 25,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 8.1.4: Instance Methods");

  // ==================== LESSON 8.1.5: Special Methods ====================
  const lesson8_1_5 = await prisma.lesson.upsert({
    where: { slug: "special-methods" },
    update: {},
    create: {
      sectionId: section8_1.id,
      number: 8.15,
      title: "Special Methods",
      slug: "special-methods",
      objectives: [
        "Understand __str__ and __repr__",
        "Implement comparison methods",
        "Know common special methods",
        "Customize object behavior",
      ],
      content: `# Special Methods

Special methods (also called "dunder" or "magic" methods) let you customize how objects behave.

## __str__ - String Representation

Called by \`print()\` and \`str()\`:

\`\`\`python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __str__(self):
        return f"Person({self.name}, {self.age})"

alice = Person("Alice", 30)
print(alice)  # Person(Alice, 30)
\`\`\`

## __repr__ - Developer Representation

For debugging, should be unambiguous:

\`\`\`python
def __repr__(self):
    return f"Person(name='{self.name}', age={self.age})"
\`\`\`

## __eq__ - Equality

Customize \`==\` comparison:

\`\`\`python
def __eq__(self, other):
    return self.name == other.name and self.age == other.age
\`\`\`

## __len__ - Length

For \`len()\` function:

\`\`\`python
class Playlist:
    def __init__(self, songs):
        self.songs = songs
    
    def __len__(self):
        return len(self.songs)
\`\`\`

## Common Special Methods

| Method | Purpose |
|--------|---------|
| \`__str__\` | str() and print() |
| \`__repr__\` | repr() and debugging |
| \`__eq__\` | == comparison |
| \`__lt__\` | < comparison |
| \`__len__\` | len() function |
| \`__add__\` | + operator |`,
      codeExamples: JSON.stringify([
        {
          id: "str-repr",
          title: "__str__ and __repr__",
          code: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __str__(self):
        return f"({self.x}, {self.y})"
    
    def __repr__(self):
        return f"Point(x={self.x}, y={self.y})"

p = Point(3, 4)
print(f"str: {str(p)}")
print(f"repr: {repr(p)}")
print(f"print: {p}")`,
          description: "String representations",
        },
        {
          id: "eq-method",
          title: "__eq__ for Equality",
          code: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __eq__(self, other):
        if not isinstance(other, Person):
            return False
        return self.name == other.name and self.age == other.age

p1 = Person("Alice", 30)
p2 = Person("Alice", 30)
p3 = Person("Bob", 25)

print(f"p1 == p2: {p1 == p2}")
print(f"p1 == p3: {p1 == p3}")`,
          description: "Custom equality comparison",
        },
        {
          id: "len-method",
          title: "__len__ for Length",
          code: `class TodoList:
    def __init__(self):
        self.items = []
    
    def add(self, item):
        self.items.append(item)
    
    def __len__(self):
        return len(self.items)
    
    def __str__(self):
        return f"TodoList with {len(self)} items"

todos = TodoList()
todos.add("Learn Python")
todos.add("Build projects")
todos.add("Get job")

print(f"Length: {len(todos)}")
print(todos)`,
          description: "Custom length function",
        },
      ]),
      keyPoints: [
        "__str__ defines print() output",
        "__repr__ is for debugging representation",
        "__eq__ customizes == comparison",
        "__len__ enables len() on your objects",
        "Special methods customize object behavior",
      ],
      hardwareDemo: "Watch Python call special methods automatically. See how print() triggers __str__ and == triggers __eq__.",
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 5,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_1_5.id,
        number: 1,
        title: "Add __str__",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add __str__ to Book class to print 'Title by Author'.",
        starterCode: `class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author
    
    def __str__(self):
        return f"{self.title} by {self.author}"

book = Book("1984", "George Orwell")
print(book)`,
        solution: `class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author
    
    def __str__(self):
        return f"{self.title} by {self.author}"

book = Book("1984", "George Orwell")
print(book)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "1984 by George Orwell", description: "__str__ works" },
        ]),
        hints: ["def __str__(self):", "Return a formatted string", "Use self.title and self.author"],
        xpReward: 20,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 8.1.5: Special Methods");

  // ==================== LESSON 8.2.1: Inheritance Basics ====================
  const lesson8_2_1 = await prisma.lesson.upsert({
    where: { slug: "inheritance-basics" },
    update: {},
    create: {
      sectionId: section8_2.id,
      number: 8.21,
      title: "Inheritance Basics",
      slug: "inheritance-basics",
      objectives: [
        "Understand inheritance concept",
        "Create a subclass from a parent class",
        "Inherit methods and attributes",
        "Know when to use inheritance",
      ],
      content: `# Inheritance Basics

**Inheritance** lets a class inherit attributes and methods from another class.

## Terminology

- **Parent class** (base/super class): The class being inherited from
- **Child class** (derived/sub class): The class that inherits

## Basic Syntax

\`\`\`python
class Animal:  # Parent class
    def speak(self):
        print("Some sound")

class Dog(Animal):  # Child class inherits from Animal
    pass

rex = Dog()
rex.speak()  # Inherited from Animal!
\`\`\`

## Adding to the Child

\`\`\`python
class Animal:
    def eat(self):
        print("Eating...")

class Dog(Animal):
    def bark(self):
        print("Woof!")

rex = Dog()
rex.eat()   # Inherited
rex.bark()  # Dog-specific
\`\`\`

## Why Use Inheritance?

1. **Code reuse**: Don't repeat common code
2. **Hierarchy**: Model "is-a" relationships
3. **Specialization**: Customize behavior in children

## "Is-A" Relationship

Use inheritance when child "is a" parent:
- Dog is an Animal ✓
- Rectangle is a Shape ✓
- Car is a Vehicle ✓

Don't use for "has-a":
- Car has an Engine (use composition instead)`,
      codeExamples: JSON.stringify([
        {
          id: "basic-inheritance",
          title: "Basic Inheritance",
          code: `class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        print(f"{self.name} makes a sound")

class Dog(Animal):
    pass  # Inherits everything from Animal

class Cat(Animal):
    pass

rex = Dog("Rex")
whiskers = Cat("Whiskers")

rex.speak()      # Inherited from Animal
whiskers.speak() # Inherited from Animal`,
          description: "Child classes inherit from parent",
        },
        {
          id: "adding-methods",
          title: "Adding Child-Specific Methods",
          code: `class Vehicle:
    def __init__(self, brand):
        self.brand = brand
    
    def start(self):
        print(f"{self.brand} is starting...")

class Car(Vehicle):
    def honk(self):
        print("Beep beep!")

class Motorcycle(Vehicle):
    def wheelie(self):
        print("Doing a wheelie!")

car = Car("Toyota")
car.start()  # Inherited
car.honk()   # Car-specific

bike = Motorcycle("Harley")
bike.start()    # Inherited
bike.wheelie()  # Motorcycle-specific`,
          description: "Each child can add its own methods",
        },
        {
          id: "isinstance-check",
          title: "Checking Types",
          code: `class Animal:
    pass

class Dog(Animal):
    pass

class Cat(Animal):
    pass

rex = Dog()

print(f"Is rex a Dog? {isinstance(rex, Dog)}")
print(f"Is rex an Animal? {isinstance(rex, Animal)}")
print(f"Is rex a Cat? {isinstance(rex, Cat)}")`,
          description: "isinstance checks inheritance too",
        },
      ]),
      keyPoints: [
        "Syntax: class Child(Parent):",
        "Child inherits all parent methods and attributes",
        "Child can add its own methods",
        "Use for 'is-a' relationships",
        "isinstance() checks inheritance chain",
      ],
      hardwareDemo: "Watch how child objects have access to parent methods. See the method lookup going up the inheritance chain.",
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 6,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_2_1.id,
        number: 1,
        title: "Create Child Class",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a Square class that inherits from Shape and has its own area method.",
        starterCode: `class Shape:
    def __init__(self, color):
        self.color = color
    
    def describe(self):
        print(f"A {self.color} shape")

class Square(Shape):
    def __init__(self, color, side):
        super().__init__(color)
        self.side = side
    
    def area(self):
        return self.side * self.side

sq = Square("red", 5)
sq.describe()
print(f"Area: {sq.area()}")`,
        solution: `class Shape:
    def __init__(self, color):
        self.color = color
    
    def describe(self):
        print(f"A {self.color} shape")

class Square(Shape):
    def __init__(self, color, side):
        super().__init__(color)
        self.side = side
    
    def area(self):
        return self.side * self.side

sq = Square("red", 5)
sq.describe()
print(f"Area: {sq.area()}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "A red shape\nArea: 25", description: "Inheritance works" },
        ]),
        hints: ["class Square(Shape):", "super().__init__ calls parent __init__", "Add self.side for Square"],
        xpReward: 25,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 8.2.1: Inheritance Basics");

  // ==================== LESSON 8.2.2: Method Overriding ====================
  const lesson8_2_2 = await prisma.lesson.upsert({
    where: { slug: "method-overriding" },
    update: {},
    create: {
      sectionId: section8_2.id,
      number: 8.22,
      title: "Method Overriding",
      slug: "method-overriding",
      objectives: [
        "Override parent methods in child classes",
        "Use super() to call parent methods",
        "Extend parent behavior",
        "Know when to override vs extend",
      ],
      content: `# Method Overriding

A child class can **override** a parent method by defining it with the same name.

## Basic Override

\`\`\`python
class Animal:
    def speak(self):
        print("Some sound")

class Dog(Animal):
    def speak(self):  # Override
        print("Woof!")

class Cat(Animal):
    def speak(self):  # Override
        print("Meow!")

Dog().speak()  # Woof!
Cat().speak()  # Meow!
\`\`\`

## Using super()

\`super()\` lets you call the parent's method:

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)  # Call parent's __init__
        self.breed = breed
\`\`\`

## Extending vs Replacing

**Replace**: Completely different behavior
\`\`\`python
def speak(self):
    print("Woof!")
\`\`\`

**Extend**: Add to parent behavior
\`\`\`python
def speak(self):
    super().speak()  # Do parent's action
    print("(wags tail)")  # Plus more
\`\`\`

## When to Use super()

- In \`__init__\` to initialize parent attributes
- When you want parent behavior plus more
- When calling overridden method from child`,
      codeExamples: JSON.stringify([
        {
          id: "basic-override",
          title: "Basic Override",
          code: `class Animal:
    def speak(self):
        print("Some generic sound")
    
    def move(self):
        print("Moving...")

class Dog(Animal):
    def speak(self):  # Override
        print("Woof!")
    # move() is inherited unchanged

class Cat(Animal):
    def speak(self):  # Override
        print("Meow!")

rex = Dog()
rex.speak()  # Overridden
rex.move()   # Inherited

whiskers = Cat()
whiskers.speak()  # Overridden`,
          description: "Override specific methods",
        },
        {
          id: "super-init",
          title: "super() in __init__",
          code: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

class Employee(Person):
    def __init__(self, name, age, employee_id):
        super().__init__(name, age)  # Initialize parent attributes
        self.employee_id = employee_id

emp = Employee("Alice", 30, "E123")
print(f"Name: {emp.name}")
print(f"Age: {emp.age}")
print(f"ID: {emp.employee_id}")`,
          description: "Call parent __init__ with super()",
        },
        {
          id: "extend-method",
          title: "Extending a Method",
          code: `class Logger:
    def log(self, message):
        print(f"LOG: {message}")

class TimestampLogger(Logger):
    def log(self, message):
        from datetime import datetime
        timestamp = datetime.now().strftime("%H:%M:%S")
        super().log(f"[{timestamp}] {message}")

logger = TimestampLogger()
logger.log("Application started")
logger.log("Processing data")`,
          description: "Add to parent behavior",
        },
      ]),
      keyPoints: [
        "Override by defining method with same name",
        "super() calls the parent class method",
        "Use super().__init__() to initialize parent",
        "Can replace entirely or extend parent behavior",
        "Polymorphism: same method name, different behavior",
      ],
      hardwareDemo: "Watch method lookup find the child's version first. See super() explicitly calling up to the parent method.",
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 7,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_2_2.id,
        number: 1,
        title: "Override speak()",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Override the speak method in Dog to print 'Woof!' and in Cat to print 'Meow!'.",
        starterCode: `class Animal:
    def speak(self):
        print("Some sound")

class Dog(Animal):
    def speak(self):
        print("Woof!")

class Cat(Animal):
    def speak(self):
        print("Meow!")

Dog().speak()
Cat().speak()`,
        solution: `class Animal:
    def speak(self):
        print("Some sound")

class Dog(Animal):
    def speak(self):
        print("Woof!")

class Cat(Animal):
    def speak(self):
        print("Meow!")

Dog().speak()
Cat().speak()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Woof!\nMeow!", description: "Both overridden" },
        ]),
        hints: ["Define speak in each child", "Same method name overrides parent", "Each prints different message"],
        xpReward: 20,
        order: 1,
      },
      {
        lessonId: lesson8_2_2.id,
        number: 2,
        title: "Use super()",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use super() to call parent's __init__ in the Student class.",
        starterCode: `class Person:
    def __init__(self, name):
        self.name = name

class Student(Person):
    def __init__(self, name, grade):
        super().__init__(name)
        self.grade = grade

s = Student("Alice", "A")
print(f"{s.name}: {s.grade}")`,
        solution: `class Person:
    def __init__(self, name):
        self.name = name

class Student(Person):
    def __init__(self, name, grade):
        super().__init__(name)
        self.grade = grade

s = Student("Alice", "A")
print(f"{s.name}: {s.grade}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Alice: A", description: "super() initializes parent" },
        ]),
        hints: ["super().__init__(name) calls Person.__init__", "Then add self.grade", "Parent sets name, child adds grade"],
        xpReward: 20,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 8.2.2: Method Overriding");

  // ==================== LESSON 8.3.1: Encapsulation ====================
  const lesson8_3_1 = await prisma.lesson.upsert({
    where: { slug: "encapsulation" },
    update: {},
    create: {
      sectionId: section8_3.id,
      number: 8.31,
      title: "Encapsulation",
      slug: "encapsulation",
      objectives: [
        "Understand encapsulation principle",
        "Use naming conventions for private attributes",
        "Hide implementation details",
        "Provide controlled access to data",
      ],
      content: `# Encapsulation

**Encapsulation** means hiding internal details and providing controlled access.

## Why Encapsulate?

1. **Protection**: Prevent invalid states
2. **Flexibility**: Can change implementation later
3. **Simplicity**: Users see simple interface

## Python's Approach

Python uses **conventions**, not strict enforcement:

- \`name\`: Public (use freely)
- \`_name\`: Protected (internal use hint)
- \`__name\`: Private (name mangling)

## The Underscore Convention

\`\`\`python
class BankAccount:
    def __init__(self, balance):
        self._balance = balance  # "Please don't access directly"
    
    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
    
    def get_balance(self):
        return self._balance
\`\`\`

## Name Mangling (__name)

\`\`\`python
class Secret:
    def __init__(self):
        self.__hidden = "secret"

s = Secret()
# print(s.__hidden)  # AttributeError!
print(s._Secret__hidden)  # Works but don't do this!
\`\`\`

Python mangles \`__hidden\` to \`_Secret__hidden\`.

## Best Practice

Use single underscore \`_\` for internal attributes, and provide methods for access:

\`\`\`python
class Person:
    def __init__(self, name, age):
        self._name = name
        self._age = age
    
    def get_age(self):
        return self._age
    
    def set_age(self, age):
        if 0 <= age <= 150:
            self._age = age
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "without-encapsulation",
          title: "Without Encapsulation",
          code: `class BankAccount:
    def __init__(self, balance):
        self.balance = balance  # Public - anyone can change

account = BankAccount(100)
account.balance = -500  # Uh oh! Invalid state!
print(f"Balance: {account.balance}")  # -500`,
          description: "Unprotected attributes can be misused",
        },
        {
          id: "with-encapsulation",
          title: "With Encapsulation",
          code: `class BankAccount:
    def __init__(self, balance):
        self._balance = balance  # Protected by convention
    
    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            return True
        return False
    
    def withdraw(self, amount):
        if 0 < amount <= self._balance:
            self._balance -= amount
            return True
        return False
    
    def get_balance(self):
        return self._balance

account = BankAccount(100)
account.deposit(50)
print(f"Balance: {account.get_balance()}")`,
          description: "Controlled access through methods",
        },
        {
          id: "name-mangling",
          title: "Name Mangling",
          code: `class Secret:
    def __init__(self):
        self.public = "anyone can see"
        self._protected = "please don't access directly"
        self.__private = "Python mangles this name"
    
    def reveal(self):
        return self.__private

s = Secret()
print(f"public: {s.public}")
print(f"_protected: {s._protected}")
print(f"via method: {s.reveal()}")
# print(s.__private)  # Would cause AttributeError`,
          description: "Different levels of privacy",
        },
      ]),
      keyPoints: [
        "Encapsulation hides internal details",
        "_name convention means 'internal use'",
        "__name triggers name mangling",
        "Provide methods for controlled access",
        "Python relies on conventions, not enforcement",
      ],
      hardwareDemo: "See how encapsulated attributes are stored in memory. Watch method calls validate data before storing it.",
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 8,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_3_1.id,
        number: 1,
        title: "Add Validation",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Make _age protected and add set_age that validates age is 0-150.",
        starterCode: `class Person:
    def __init__(self, name, age):
        self._name = name
        self._age = age
    
    def get_age(self):
        return self._age
    
    def set_age(self, age):
        if 0 <= age <= 150:
            self._age = age

p = Person("Alice", 30)
p.set_age(35)
print(p.get_age())
p.set_age(-5)  # Should be rejected
print(p.get_age())`,
        solution: `class Person:
    def __init__(self, name, age):
        self._name = name
        self._age = age
    
    def get_age(self):
        return self._age
    
    def set_age(self, age):
        if 0 <= age <= 150:
            self._age = age

p = Person("Alice", 30)
p.set_age(35)
print(p.get_age())
p.set_age(-5)
print(p.get_age())`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "35\n35", description: "Invalid age rejected" },
        ]),
        hints: ["Use _age (underscore prefix)", "set_age checks if 0 <= age <= 150", "Only set if valid"],
        xpReward: 20,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 8.3.1: Encapsulation");

  // ==================== LESSON 8.3.2: Properties ====================
  const lesson8_3_2 = await prisma.lesson.upsert({
    where: { slug: "properties" },
    update: {},
    create: {
      sectionId: section8_3.id,
      number: 8.32,
      title: "Properties and Decorators",
      slug: "properties",
      objectives: [
        "Use @property decorator",
        "Create getters and setters elegantly",
        "Make computed attributes",
        "Validate data with property setters",
      ],
      content: `# Properties and Decorators

The \`@property\` decorator lets you use methods like attributes.

## Basic Property

\`\`\`python
class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        return self._radius

c = Circle(5)
print(c.radius)  # Looks like attribute, calls method!
\`\`\`

## Property with Setter

\`\`\`python
class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        return self._radius
    
    @radius.setter
    def radius(self, value):
        if value > 0:
            self._radius = value

c = Circle(5)
c.radius = 10  # Calls setter!
\`\`\`

## Computed Properties

Properties can compute values:

\`\`\`python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    @property
    def area(self):
        return self.width * self.height

r = Rectangle(4, 5)
print(r.area)  # 20 - no parentheses needed!
\`\`\`

## Why Properties?

1. Cleaner syntax: \`obj.value\` instead of \`obj.get_value()\`
2. Add validation later without changing API
3. Computed attributes look like regular ones`,
      codeExamples: JSON.stringify([
        {
          id: "basic-property",
          title: "Basic @property",
          code: `class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius
    
    @property
    def celsius(self):
        return self._celsius
    
    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32

temp = Temperature(25)
print(f"{temp.celsius}°C = {temp.fahrenheit}°F")`,
          description: "Computed property",
        },
        {
          id: "property-setter",
          title: "Property with Setter",
          code: `class Person:
    def __init__(self, name, age):
        self._name = name
        self._age = age
    
    @property
    def age(self):
        return self._age
    
    @age.setter
    def age(self, value):
        if 0 <= value <= 150:
            self._age = value
        else:
            print(f"Invalid age: {value}")

p = Person("Alice", 30)
print(f"Age: {p.age}")
p.age = 35
print(f"Age: {p.age}")
p.age = -5  # Invalid`,
          description: "Validate in setter",
        },
        {
          id: "rectangle-properties",
          title: "Rectangle with Properties",
          code: `class Rectangle:
    def __init__(self, width, height):
        self._width = width
        self._height = height
    
    @property
    def width(self):
        return self._width
    
    @width.setter
    def width(self, value):
        if value > 0:
            self._width = value
    
    @property
    def area(self):
        return self._width * self._height
    
    @property
    def perimeter(self):
        return 2 * (self._width + self._height)

r = Rectangle(4, 5)
print(f"Area: {r.area}")
print(f"Perimeter: {r.perimeter}")`,
          description: "Multiple properties",
        },
      ]),
      keyPoints: [
        "@property makes method look like attribute",
        "@name.setter allows assignment with validation",
        "Computed properties calculate on access",
        "Clean syntax: obj.property instead of obj.get_property()",
        "Can add validation without changing usage",
      ],
      hardwareDemo: "Watch @property methods being called automatically when accessing attribute-like syntax. See validation happen in setters.",
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 9,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_3_2.id,
        number: 1,
        title: "Add Property",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add an area property to the Square class.",
        starterCode: `class Square:
    def __init__(self, side):
        self._side = side
    
    @property
    def side(self):
        return self._side
    
    @property
    def area(self):
        return self._side * self._side

s = Square(5)
print(f"Side: {s.side}")
print(f"Area: {s.area}")`,
        solution: `class Square:
    def __init__(self, side):
        self._side = side
    
    @property
    def side(self):
        return self._side
    
    @property
    def area(self):
        return self._side * self._side

s = Square(5)
print(f"Side: {s.side}")
print(f"Area: {s.area}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Side: 5\nArea: 25", description: "Properties work" },
        ]),
        hints: ["@property decorator", "def area(self):", "return self._side * self._side"],
        xpReward: 20,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 8.3.2: Properties");

  // ==================== LESSON 8.4.1: Generators ====================
  const lesson8_4_1 = await prisma.lesson.upsert({
    where: { slug: "generators" },
    update: {},
    create: {
      sectionId: section8_4.id,
      number: 8.41,
      title: "Generators and yield",
      slug: "generators",
      objectives: [
        "Understand what generators are",
        "Use yield to create generators",
        "Know when generators are useful",
        "Compare generators to lists",
      ],
      content: `# Generators and yield

A **generator** is a function that produces a sequence of values lazily (one at a time).

## Regular Function vs Generator

\`\`\`python
# Regular function - returns all at once
def get_numbers():
    return [1, 2, 3, 4, 5]

# Generator - yields one at a time
def generate_numbers():
    yield 1
    yield 2
    yield 3
    yield 4
    yield 5
\`\`\`

## yield Keyword

\`yield\` produces a value and pauses the function:

\`\`\`python
def countdown(n):
    while n > 0:
        yield n
        n -= 1

for num in countdown(5):
    print(num)
\`\`\`

## Why Use Generators?

1. **Memory efficient**: Don't store entire sequence
2. **Lazy evaluation**: Compute values only when needed
3. **Infinite sequences**: Can represent endless data

## Generator vs List

\`\`\`python
# List - all in memory
numbers = [x**2 for x in range(1000000)]  # Uses lots of memory

# Generator - one at a time
numbers = (x**2 for x in range(1000000))  # Uses minimal memory
\`\`\`

## How Generators Work

1. Call generator function → get generator object
2. Call \`next()\` or iterate → runs until \`yield\`
3. \`yield\` returns value, pauses function
4. Next call resumes from where it paused`,
      codeExamples: JSON.stringify([
        {
          id: "basic-generator",
          title: "Basic Generator",
          code: `def count_up_to(n):
    i = 1
    while i <= n:
        yield i
        i += 1

# Use in for loop
print("Counting to 5:")
for num in count_up_to(5):
    print(num)`,
          description: "Generator yields values one at a time",
        },
        {
          id: "generator-memory",
          title: "Memory Efficiency",
          code: `def fibonacci_generator(limit):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b

# Generates values on demand
print("Fibonacci numbers under 100:")
for fib in fibonacci_generator(100):
    print(fib, end=" ")`,
          description: "No list stored in memory",
        },
        {
          id: "next-function",
          title: "Using next()",
          code: `def simple_generator():
    print("First yield")
    yield 1
    print("Second yield")
    yield 2
    print("Third yield")
    yield 3

gen = simple_generator()
print(f"Got: {next(gen)}")
print(f"Got: {next(gen)}")
print(f"Got: {next(gen)}")`,
          description: "See how yield pauses and resumes",
        },
      ]),
      keyPoints: [
        "yield produces values one at a time",
        "Generator pauses between yields",
        "Memory efficient - doesn't store all values",
        "Use for large or infinite sequences",
        "Iterate with for loop or next()",
      ],
      hardwareDemo: "Watch the generator pause at each yield. See how only the current value is in memory, not the entire sequence.",
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 10,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_4_1.id,
        number: 1,
        title: "Create Generator",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a generator that yields even numbers from 2 to n.",
        starterCode: `def even_numbers(n):
    i = 2
    while i <= n:
        yield i
        i += 2

for num in even_numbers(10):
    print(num)`,
        solution: `def even_numbers(n):
    i = 2
    while i <= n:
        yield i
        i += 2

for num in even_numbers(10):
    print(num)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "2\n4\n6\n8\n10", description: "Even numbers generated" },
        ]),
        hints: ["Start at 2", "yield i in loop", "Increment by 2"],
        xpReward: 25,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 8.4.1: Generators");

  // ==================== LESSON 8.4.2: Generator Expressions ====================
  const lesson8_4_2 = await prisma.lesson.upsert({
    where: { slug: "generator-expressions" },
    update: {},
    create: {
      sectionId: section8_4.id,
      number: 8.42,
      title: "Generator Expressions",
      slug: "generator-expressions",
      objectives: [
        "Write generator expressions",
        "Compare to list comprehensions",
        "Use generators with functions",
        "Chain generators together",
      ],
      content: `# Generator Expressions

Generator expressions are like list comprehensions, but create generators.

## Syntax

\`\`\`python
# List comprehension - square brackets
squares_list = [x**2 for x in range(10)]

# Generator expression - parentheses
squares_gen = (x**2 for x in range(10))
\`\`\`

## Memory Comparison

\`\`\`python
import sys

# List uses memory for all elements
list_comp = [x for x in range(10000)]
print(f"List size: {sys.getsizeof(list_comp)} bytes")

# Generator uses minimal memory
gen_exp = (x for x in range(10000))
print(f"Generator size: {sys.getsizeof(gen_exp)} bytes")
\`\`\`

## Using with Functions

Many functions accept generators directly:

\`\`\`python
# Sum of squares (no list created!)
total = sum(x**2 for x in range(1000))

# Any/All with generator
has_even = any(x % 2 == 0 for x in numbers)
all_positive = all(x > 0 for x in numbers)
\`\`\`

## When to Use Which

- **List**: Need to iterate multiple times, need indexing
- **Generator**: Large data, iterate once, memory matters

## Note: Generators Exhaust

Generators can only be iterated once:

\`\`\`python
gen = (x for x in range(3))
list(gen)  # [0, 1, 2]
list(gen)  # [] - exhausted!
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "gen-vs-list",
          title: "Generator vs List Comprehension",
          code: `# List comprehension
squares_list = [x**2 for x in range(5)]
print(f"List: {squares_list}")
print(f"Type: {type(squares_list)}")

# Generator expression
squares_gen = (x**2 for x in range(5))
print(f"Generator: {squares_gen}")
print(f"Type: {type(squares_gen)}")

# Convert generator to list
print(f"As list: {list(squares_gen)}")`,
          description: "[] makes list, () makes generator",
        },
        {
          id: "gen-with-functions",
          title: "Generators with Functions",
          code: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Sum of squares (generator inside sum)
total = sum(x**2 for x in numbers)
print(f"Sum of squares: {total}")

# Any even number?
has_even = any(x % 2 == 0 for x in numbers)
print(f"Has even: {has_even}")

# All positive?
all_pos = all(x > 0 for x in numbers)
print(f"All positive: {all_pos}")`,
          description: "No intermediate list needed",
        },
        {
          id: "generator-exhaustion",
          title: "Generator Exhaustion",
          code: `gen = (x for x in range(5))

print("First iteration:")
for x in gen:
    print(x, end=" ")

print("\\n\\nSecond iteration:")
for x in gen:
    print(x, end=" ")  # Nothing prints!

print("(Generator exhausted)")`,
          description: "Can only iterate once",
        },
      ]),
      keyPoints: [
        "Generator expression: (expr for x in iterable)",
        "Uses less memory than list comprehension",
        "Works directly with sum(), any(), all(), etc.",
        "Can only iterate once (exhausts)",
        "Use when you don't need to keep all values",
      ],
      hardwareDemo: "Compare memory usage between list and generator. See how the generator produces values on-demand without storing them all.",
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 11,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_4_2.id,
        number: 1,
        title: "Sum with Generator",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate sum of cubes from 1 to 10 using a generator expression.",
        starterCode: `# Sum of cubes: 1^3 + 2^3 + ... + 10^3
total = sum(x**3 for x in range(1, 11))
print(total)`,
        solution: `total = sum(x**3 for x in range(1, 11))
print(total)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "3025", description: "Sum of cubes" },
        ]),
        hints: ["sum() accepts generator", "x**3 for cubing", "range(1, 11) for 1-10"],
        xpReward: 20,
        order: 1,
      },
    ],
  });

  console.log("✅ Created Lesson 8.4.2: Generator Expressions");

  // Summary
  const lessonCount = await prisma.lesson.count({ where: { section: { chapter: { number: 8 } } } });
  const exerciseCount = await prisma.exercise.count({ where: { lesson: { section: { chapter: { number: 8 } } } } });

  console.log("\n📊 Chapter 8 Summary:");
  console.log(`   Lessons: ${lessonCount}`);
  console.log(`   Exercises: ${exerciseCount}`);
  console.log("\n🌱 Chapter 8 seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
