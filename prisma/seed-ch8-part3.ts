import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 8 Part 3: Lessons 8.2.1-8.2.2...\n");

  const section8_2 = await prisma.section.findFirst({ where: { number: 8.2 } });
  if (!section8_2) throw new Error("Section 8.2 not found.");

  // ==================== LESSON 8.2.1 ====================
  const lesson8_2_1 = await prisma.lesson.upsert({
    where: { slug: "inheritance-basics" },
    update: {},
    create: {
      sectionId: section8_2.id,
      number: 8.21,
      title: "Inheritance Basics",
      slug: "inheritance-basics",
      objectives: [
        "Understand parent and child classes",
        "Inherit attributes and methods",
        "Extend functionality in child classes",
        "Recognize is-a relationships",
      ],
      content: `# Inheritance Basics

## What is Inheritance?

A class can **inherit** from another class, gaining its attributes and methods:

\`\`\`python
class Animal:        # Parent class
    def speak(self):
        return "Some sound"

class Dog(Animal):   # Child class inherits from Animal
    pass

fido = Dog()
fido.speak()  # Works! Inherited from Animal
\`\`\`

## Parent and Child Classes

- **Parent** (base/superclass): The class being inherited from
- **Child** (derived/subclass): The class that inherits

\`\`\`python
class Parent:
    # Parent stuff
    pass

class Child(Parent):  # Note the (Parent) syntax!
    # Child stuff (plus everything from Parent)
    pass
\`\`\`

## The "is-a" Relationship

Inheritance models **is-a** relationships:
- A Dog **is an** Animal
- A Car **is a** Vehicle
- A Student **is a** Person

\`\`\`python
class Vehicle:
    pass

class Car(Vehicle):    # Car IS A Vehicle
    pass

class Motorcycle(Vehicle):  # Motorcycle IS A Vehicle
    pass
\`\`\`

## What Gets Inherited?

Child classes inherit:
- All methods from parent
- All attributes from parent

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        return "Some sound"

class Dog(Animal):
    pass  # Gets __init__ and speak automatically!

fido = Dog("Fido")  # Uses Animal's __init__
print(fido.name)    # "Fido" - inherited attribute
print(fido.speak()) # "Some sound" - inherited method
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-inheritance",
          title: "Basic Inheritance",
          code: "class Animal:\n    \"\"\"Base class for all animals.\"\"\"\n    \n    def __init__(self, name):\n        self.name = name\n    \n    def speak(self):\n        return f\"{self.name} makes a sound\"\n    \n    def describe(self):\n        return f\"I am {self.name}\"\n\n# Dog inherits from Animal\nclass Dog(Animal):\n    pass  # Empty - but inherits everything!\n\n# Cat also inherits from Animal\nclass Cat(Animal):\n    pass\n\n# Create instances\nfido = Dog(\"Fido\")\nwhiskers = Cat(\"Whiskers\")\n\n# Both have inherited methods\nprint(fido.describe())\nprint(fido.speak())\nprint()\nprint(whiskers.describe())\nprint(whiskers.speak())",
          description: "Child classes inherit parent methods",
        },
        {
          id: "extending-parent",
          title: "Extending the Parent Class",
          code: "class Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def speak(self):\n        return \"Some sound\"\n\nclass Dog(Animal):\n    # Add NEW method not in parent\n    def fetch(self):\n        return f\"{self.name} fetches the ball!\"\n    \n    def wag_tail(self):\n        return f\"{self.name} wags tail happily!\"\n\nclass Cat(Animal):\n    # Different new methods\n    def purr(self):\n        return f\"{self.name} purrs contentedly\"\n    \n    def scratch(self):\n        return f\"{self.name} scratches the furniture!\"\n\nfido = Dog(\"Fido\")\nwhiskers = Cat(\"Whiskers\")\n\n# Inherited methods\nprint(fido.speak())\nprint(whiskers.speak())\n\nprint()\n\n# New methods specific to each\nprint(fido.fetch())\nprint(fido.wag_tail())\nprint()\nprint(whiskers.purr())\nprint(whiskers.scratch())",
          description: "Adding new methods to child classes",
        },
        {
          id: "is-a-relationship",
          title: "The is-a Relationship",
          code: "class Vehicle:\n    def __init__(self, brand):\n        self.brand = brand\n    \n    def start(self):\n        return f\"{self.brand} starting...\"\n\nclass Car(Vehicle):\n    def __init__(self, brand, doors):\n        self.brand = brand\n        self.doors = doors\n    \n    def honk(self):\n        return \"Beep beep!\"\n\nclass Motorcycle(Vehicle):\n    def wheelie(self):\n        return \"Doing a wheelie!\"\n\n# Create vehicles\nmy_car = Car(\"Toyota\", 4)\nmy_bike = Motorcycle(\"Harley\")\n\n# Check relationships\nprint(f\"my_car is a Car: {isinstance(my_car, Car)}\")\nprint(f\"my_car is a Vehicle: {isinstance(my_car, Vehicle)}\")\nprint(f\"my_bike is a Motorcycle: {isinstance(my_bike, Motorcycle)}\")\nprint(f\"my_bike is a Vehicle: {isinstance(my_bike, Vehicle)}\")\nprint(f\"my_car is a Motorcycle: {isinstance(my_car, Motorcycle)}\")\n\nprint()\n\n# Both can start (inherited)\nprint(my_car.start())\nprint(my_bike.start())",
          description: "isinstance() checks inheritance",
        },
        {
          id: "inheritance-hierarchy",
          title: "Inheritance Hierarchy",
          code: "# Multi-level hierarchy\nclass Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def breathe(self):\n        return f\"{self.name} is breathing\"\n\nclass Mammal(Animal):\n    def feed_young(self):\n        return f\"{self.name} feeds milk to young\"\n\nclass Dog(Mammal):\n    def bark(self):\n        return f\"{self.name} barks: Woof!\"\n\n# Dog inherits from Mammal, which inherits from Animal\nfido = Dog(\"Fido\")\n\nprint(\"Dog has access to:\")\nprint(f\"  From Animal: {fido.breathe()}\")\nprint(f\"  From Mammal: {fido.feed_young()}\")\nprint(f\"  From Dog: {fido.bark()}\")\n\nprint()\nprint(f\"Fido is Animal: {isinstance(fido, Animal)}\")\nprint(f\"Fido is Mammal: {isinstance(fido, Mammal)}\")\nprint(f\"Fido is Dog: {isinstance(fido, Dog)}\")",
          description: "Multi-level inheritance",
        },
      ]),
      keyPoints: [
        "class Child(Parent): inherits from Parent",
        "Child gets all parent's methods and attributes",
        "Inheritance models 'is-a' relationships",
        "Child can add new methods",
        "isinstance() checks inheritance chain",
        "Multiple levels of inheritance possible",
        "Parent class = base/superclass",
        "Child class = derived/subclass",
      ],
      hardwareDemo: "See child class link to parent. Watch method lookup traverse hierarchy.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson8_2_1.number}: ${lesson8_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_2_1.id,
        number: 1,
        title: "Create Child Class",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a Cat class that inherits from Animal.",
        starterCode: "class Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def speak(self):\n        return f\"{self.name} makes a sound\"\n\n# Create Cat class that inherits from Animal\n\nwhiskers = Cat(\"Whiskers\")\nprint(whiskers.speak())",
        solution: "class Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def speak(self):\n        return f\"{self.name} makes a sound\"\n\nclass Cat(Animal):\n    pass\n\nwhiskers = Cat(\"Whiskers\")\nprint(whiskers.speak())",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Whiskers makes a sound", description: "Inheritance works" }]),
        hints: ["class Cat(Animal):", "pass for empty body"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson8_2_1.id,
        number: 2,
        title: "Add Child Method",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add a meow() method to Cat that returns '{name} says Meow!'",
        starterCode: "class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Cat(Animal):\n    # Add meow method\n    pass\n\nwhiskers = Cat(\"Whiskers\")\nprint(whiskers.meow())",
        solution: "class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Cat(Animal):\n    def meow(self):\n        return f\"{self.name} says Meow!\"\n\nwhiskers = Cat(\"Whiskers\")\nprint(whiskers.meow())",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Whiskers says Meow!", description: "New method works" }]),
        hints: ["def meow(self):", "Use self.name in return"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson8_2_1.id,
        number: 3,
        title: "Multiple Children",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create Dog and Cat classes from Animal, each with unique methods.",
        starterCode: "class Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def eat(self):\n        return f\"{self.name} is eating\"\n\n# Create Dog with bark() method\n\n# Create Cat with meow() method\n\nfido = Dog(\"Fido\")\nwhiskers = Cat(\"Whiskers\")\n\nprint(fido.eat())      # Inherited\nprint(fido.bark())     # Dog only\nprint(whiskers.eat())  # Inherited\nprint(whiskers.meow()) # Cat only",
        solution: "class Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def eat(self):\n        return f\"{self.name} is eating\"\n\nclass Dog(Animal):\n    def bark(self):\n        return f\"{self.name} says Woof!\"\n\nclass Cat(Animal):\n    def meow(self):\n        return f\"{self.name} says Meow!\"\n\nfido = Dog(\"Fido\")\nwhiskers = Cat(\"Whiskers\")\n\nprint(fido.eat())\nprint(fido.bark())\nprint(whiskers.eat())\nprint(whiskers.meow())",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Both eat, unique sounds", description: "Both children work" }]),
        hints: ["Both inherit from Animal", "Each adds unique method"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson8_2_1.id,
        number: 4,
        title: "Check Inheritance",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use isinstance() to verify inheritance relationships.",
        starterCode: "class Vehicle:\n    pass\n\nclass Car(Vehicle):\n    pass\n\nclass Bicycle(Vehicle):\n    pass\n\nmy_car = Car()\nmy_bike = Bicycle()\n\n# Check: is my_car a Car? a Vehicle? a Bicycle?\n# Check: is my_bike a Bicycle? a Vehicle? a Car?",
        solution: "class Vehicle:\n    pass\n\nclass Car(Vehicle):\n    pass\n\nclass Bicycle(Vehicle):\n    pass\n\nmy_car = Car()\nmy_bike = Bicycle()\n\nprint(\"my_car checks:\")\nprint(f\"  is Car: {isinstance(my_car, Car)}\")\nprint(f\"  is Vehicle: {isinstance(my_car, Vehicle)}\")\nprint(f\"  is Bicycle: {isinstance(my_car, Bicycle)}\")\n\nprint(\"\\nmy_bike checks:\")\nprint(f\"  is Bicycle: {isinstance(my_bike, Bicycle)}\")\nprint(f\"  is Vehicle: {isinstance(my_bike, Vehicle)}\")\nprint(f\"  is Car: {isinstance(my_bike, Car)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "True/False checks correct", description: "isinstance works" }]),
        hints: ["isinstance(obj, Class)", "Child is instance of parent too"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson8_2_1.id,
        number: 5,
        title: "Three-Level Hierarchy",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create Animal -> Mammal -> Dog hierarchy with methods at each level.",
        starterCode: "# Animal: breathe()\n# Mammal(Animal): nurse()\n# Dog(Mammal): bark()\n\n# Create all three classes\n\nfido = Dog(\"Fido\")\nprint(fido.breathe())  # From Animal\nprint(fido.nurse())    # From Mammal\nprint(fido.bark())     # From Dog",
        solution: "class Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def breathe(self):\n        return f\"{self.name} is breathing\"\n\nclass Mammal(Animal):\n    def nurse(self):\n        return f\"{self.name} nurses young with milk\"\n\nclass Dog(Mammal):\n    def bark(self):\n        return f\"{self.name} says Woof!\"\n\nfido = Dog(\"Fido\")\nprint(fido.breathe())\nprint(fido.nurse())\nprint(fido.bark())",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All three methods work", description: "Three-level inheritance" }]),
        hints: ["Mammal(Animal)", "Dog(Mammal)", "Each level adds method"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 8.2.1`);

  // ==================== LESSON 8.2.2 ====================
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
        "Understand polymorphism basics",
        "Extend parent behavior with super()",
      ],
      content: `# Method Overriding

## What is Method Overriding?

Child class provides its **own version** of a parent method:

\`\`\`python
class Animal:
    def speak(self):
        return "Some sound"

class Dog(Animal):
    def speak(self):  # Override!
        return "Woof!"
\`\`\`

## Why Override Methods?

- Specialize behavior for child class
- Replace generic with specific
- Customize inherited functionality

\`\`\`python
fido = Dog("Fido")
fido.speak()  # "Woof!" - uses Dog's version
\`\`\`

## The super() Function

Call the **parent's version** of a method:

\`\`\`python
class Dog(Animal):
    def speak(self):
        parent_sound = super().speak()  # Call parent
        return f"{parent_sound}... Woof!"
\`\`\`

## Common super() Use: __init__

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)  # Call parent's __init__
        self.breed = breed      # Add new attribute
\`\`\`

## Polymorphism

Same method name, different behavior based on type:

\`\`\`python
animals = [Dog("Fido"), Cat("Whiskers"), Cow("Bessie")]

for animal in animals:
    print(animal.speak())  # Each speaks differently!
\`\`\`

This is **polymorphism** - same interface, different implementation.`,
      codeExamples: JSON.stringify([
        {
          id: "basic-override",
          title: "Basic Method Overriding",
          code: "class Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def speak(self):\n        return f\"{self.name} makes a sound\"\n\nclass Dog(Animal):\n    def speak(self):  # Override parent's speak\n        return f\"{self.name} says Woof!\"\n\nclass Cat(Animal):\n    def speak(self):  # Override parent's speak\n        return f\"{self.name} says Meow!\"\n\nclass Cow(Animal):\n    def speak(self):  # Override parent's speak\n        return f\"{self.name} says Moo!\"\n\n# Each class has its own speak()\nfido = Dog(\"Fido\")\nwhiskers = Cat(\"Whiskers\")\nbessie = Cow(\"Bessie\")\n\nprint(fido.speak())\nprint(whiskers.speak())\nprint(bessie.speak())",
          description: "Each child overrides speak()",
        },
        {
          id: "super-init",
          title: "Using super() in __init__",
          code: "class Animal:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def describe(self):\n        return f\"{self.name}, {self.age} years old\"\n\nclass Dog(Animal):\n    def __init__(self, name, age, breed):\n        # Call parent's __init__ first\n        super().__init__(name, age)\n        # Then add dog-specific attribute\n        self.breed = breed\n    \n    def describe(self):\n        # Can also use super() here\n        basic = super().describe()\n        return f\"{basic}, {self.breed}\"\n\nfido = Dog(\"Fido\", 3, \"Labrador\")\n\nprint(f\"Name: {fido.name}\")    # From Animal\nprint(f\"Age: {fido.age}\")      # From Animal\nprint(f\"Breed: {fido.breed}\")  # From Dog\nprint(f\"\\n{fido.describe()}\")",
          description: "super().__init__() for initialization",
        },
        {
          id: "extend-with-super",
          title: "Extending Parent Behavior",
          code: "class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n    \n    def deposit(self, amount):\n        self.balance += amount\n        return f\"Deposited ${amount}\"\n\nclass SavingsAccount(BankAccount):\n    def __init__(self, owner, balance=0, interest_rate=0.02):\n        super().__init__(owner, balance)  # Parent init\n        self.interest_rate = interest_rate\n    \n    def deposit(self, amount):\n        # Call parent's deposit first\n        result = super().deposit(amount)\n        # Then add interest calculation\n        return f\"{result} (Earning {self.interest_rate*100}% interest)\"\n    \n    def add_interest(self):\n        interest = self.balance * self.interest_rate\n        self.balance += interest\n        return f\"Added ${interest:.2f} interest\"\n\naccount = SavingsAccount(\"Alice\", 1000, 0.05)\nprint(account.deposit(500))\nprint(account.add_interest())\nprint(f\"Balance: ${account.balance:.2f}\")",
          description: "Extend parent behavior with super()",
        },
        {
          id: "polymorphism",
          title: "Polymorphism in Action",
          code: "class Shape:\n    def __init__(self, name):\n        self.name = name\n    \n    def area(self):\n        return 0\n    \n    def describe(self):\n        return f\"{self.name}: area = {self.area()}\"\n\nclass Rectangle(Shape):\n    def __init__(self, width, height):\n        super().__init__(\"Rectangle\")\n        self.width = width\n        self.height = height\n    \n    def area(self):\n        return self.width * self.height\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        super().__init__(\"Circle\")\n        self.radius = radius\n    \n    def area(self):\n        import math\n        return math.pi * self.radius ** 2\n\n# Polymorphism: same interface, different behavior\nshapes = [\n    Rectangle(4, 5),\n    Circle(3),\n    Rectangle(10, 2),\n]\n\nprint(\"All shapes:\")\nfor shape in shapes:\n    print(f\"  {shape.describe():.2f}\" if isinstance(shape.area(), float) else f\"  {shape.describe()}\")\n\n# Same method call, different results!\ntotal_area = sum(s.area() for s in shapes)\nprint(f\"\\nTotal area: {total_area:.2f}\")",
          description: "Same method, different implementations",
        },
      ]),
      keyPoints: [
        "Override: child redefines parent method",
        "Child's method replaces parent's",
        "super() calls parent's version",
        "super().__init__() for parent initialization",
        "super().method() to extend behavior",
        "Polymorphism: same interface, different behavior",
        "Override to specialize generic behavior",
        "super() maintains inheritance chain",
      ],
      hardwareDemo: "See method lookup find child version first. Watch super() jump to parent.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson8_2_2.number}: ${lesson8_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_2_2.id,
        number: 1,
        title: "Override Method",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Override the speak() method in Dog to return 'Woof!'",
        starterCode: "class Animal:\n    def speak(self):\n        return \"Some sound\"\n\nclass Dog(Animal):\n    # Override speak to return \"Woof!\"\n    pass\n\nfido = Dog()\nprint(fido.speak())",
        solution: "class Animal:\n    def speak(self):\n        return \"Some sound\"\n\nclass Dog(Animal):\n    def speak(self):\n        return \"Woof!\"\n\nfido = Dog()\nprint(fido.speak())",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Woof!", description: "Method overridden" }]),
        hints: ["Define speak(self) in Dog", "Return different string"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson8_2_2.id,
        number: 2,
        title: "Use super().__init__",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use super().__init__() to initialize parent, then add breed.",
        starterCode: "class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        # Call parent's __init__\n        # Add self.breed\n        pass\n\nfido = Dog(\"Fido\", \"Labrador\")\nprint(f\"{fido.name} is a {fido.breed}\")",
        solution: "class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)\n        self.breed = breed\n\nfido = Dog(\"Fido\", \"Labrador\")\nprint(f\"{fido.name} is a {fido.breed}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Fido is a Labrador", description: "super() init works" }]),
        hints: ["super().__init__(name)", "Then self.breed = breed"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson8_2_2.id,
        number: 3,
        title: "Extend with super()",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Override greet() to add 'Nice to meet you!' after parent's greeting.",
        starterCode: "class Person:\n    def __init__(self, name):\n        self.name = name\n    \n    def greet(self):\n        return f\"Hello, I'm {self.name}\"\n\nclass FriendlyPerson(Person):\n    def greet(self):\n        # Get parent's greeting, add to it\n        pass\n\nfp = FriendlyPerson(\"Alice\")\nprint(fp.greet())  # Should print both parts",
        solution: "class Person:\n    def __init__(self, name):\n        self.name = name\n    \n    def greet(self):\n        return f\"Hello, I'm {self.name}\"\n\nclass FriendlyPerson(Person):\n    def greet(self):\n        parent_greeting = super().greet()\n        return f\"{parent_greeting}. Nice to meet you!\"\n\nfp = FriendlyPerson(\"Alice\")\nprint(fp.greet())",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Hello, I'm Alice. Nice to meet you!", description: "Extended greeting" }]),
        hints: ["super().greet() gets parent's version", "Concatenate with new text"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson8_2_2.id,
        number: 4,
        title: "Polymorphism",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create Dog, Cat, Bird classes each overriding speak(), then loop through list.",
        starterCode: "class Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def speak(self):\n        return \"...\"\n\n# Create Dog (Woof!), Cat (Meow!), Bird (Tweet!)\n\nanimals = [Dog(\"Fido\"), Cat(\"Whiskers\"), Bird(\"Tweety\")]\nfor animal in animals:\n    print(f\"{animal.name}: {animal.speak()}\")",
        solution: "class Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def speak(self):\n        return \"...\"\n\nclass Dog(Animal):\n    def speak(self):\n        return \"Woof!\"\n\nclass Cat(Animal):\n    def speak(self):\n        return \"Meow!\"\n\nclass Bird(Animal):\n    def speak(self):\n        return \"Tweet!\"\n\nanimals = [Dog(\"Fido\"), Cat(\"Whiskers\"), Bird(\"Tweety\")]\nfor animal in animals:\n    print(f\"{animal.name}: {animal.speak()}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Each animal speaks differently", description: "Polymorphism works" }]),
        hints: ["Each class overrides speak()", "Same loop works for all"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson8_2_2.id,
        number: 5,
        title: "Complete Override Pattern",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create Employee class extending Person, overriding __init__ and describe().",
        starterCode: "class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def describe(self):\n        return f\"{self.name}, {self.age} years old\"\n\nclass Employee(Person):\n    # __init__ takes name, age, job_title\n    # describe() adds job title to parent's description\n    pass\n\nemp = Employee(\"Alice\", 30, \"Engineer\")\nprint(emp.describe())",
        solution: "class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def describe(self):\n        return f\"{self.name}, {self.age} years old\"\n\nclass Employee(Person):\n    def __init__(self, name, age, job_title):\n        super().__init__(name, age)\n        self.job_title = job_title\n    \n    def describe(self):\n        basic = super().describe()\n        return f\"{basic}, works as {self.job_title}\"\n\nemp = Employee(\"Alice\", 30, \"Engineer\")\nprint(emp.describe())",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Alice, 30 years old, works as Engineer", description: "Complete override" }]),
        hints: ["super().__init__ for parent attributes", "super().describe() for parent string"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 8.2.2`);

  console.log("\n✅ Chapter 8 Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
