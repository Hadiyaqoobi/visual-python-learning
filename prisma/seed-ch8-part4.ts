import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 8 Part 4: Lessons 8.3.1-8.3.2...\n");

  const section8_3 = await prisma.section.findFirst({ where: { number: 8.3 } });
  if (!section8_3) throw new Error("Section 8.3 not found.");

  // ==================== LESSON 8.3.1 ====================
  const lesson8_3_1 = await prisma.lesson.upsert({
    where: { slug: "encapsulation" },
    update: {},
    create: {
      sectionId: section8_3.id,
      number: 8.31,
      title: "Encapsulation and Information Hiding",
      slug: "encapsulation",
      objectives: [
        "Understand encapsulation concept",
        "Use underscore conventions for privacy",
        "Create getter and setter methods",
        "Know why hiding implementation matters",
      ],
      content: `# Encapsulation and Information Hiding

## What is Encapsulation?

**Bundling data with methods** that operate on it, and **restricting direct access**:

\`\`\`python
class BankAccount:
    def __init__(self, balance):
        self._balance = balance  # "Private" - don't access directly!
    
    def get_balance(self):       # Controlled access
        return self._balance
\`\`\`

## Why Hide Implementation?

1. **Prevent invalid states**: Can't set negative balance
2. **Change implementation**: Without breaking code that uses class
3. **Add validation**: Check values before setting
4. **Control access**: Read-only attributes

## Python's Privacy Conventions

Python uses **naming conventions** (not enforcement):

| Convention | Meaning |
|------------|---------|
| \`name\` | Public - use freely |
| \`_name\` | Protected - internal use |
| \`__name\` | Private - name mangling |

\`\`\`python
class Example:
    def __init__(self):
        self.public = 1      # Anyone can access
        self._protected = 2  # "Please don't touch"
        self.__private = 3   # Name-mangled
\`\`\`

## Getters and Setters

Control how attributes are accessed and modified:

\`\`\`python
class Person:
    def __init__(self, age):
        self._age = age
    
    def get_age(self):
        return self._age
    
    def set_age(self, value):
        if value < 0:
            raise ValueError("Age cannot be negative")
        self._age = value
\`\`\`

## Name Mangling (__double_underscore)

\`__name\` becomes \`_ClassName__name\`:

\`\`\`python
class Example:
    def __init__(self):
        self.__secret = 42

e = Example()
# e.__secret  # AttributeError!
e._Example__secret  # Works (but don't do this!)
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "why-encapsulate",
          title: "Why Encapsulation Matters",
          code: "# WITHOUT encapsulation - dangerous!\nclass BankAccountBad:\n    def __init__(self, balance):\n        self.balance = balance  # Public!\n\nbad = BankAccountBad(100)\nbad.balance = -1000  # No validation! Invalid state!\nprint(f\"Bad balance: {bad.balance}\")\n\nprint()\n\n# WITH encapsulation - safe!\nclass BankAccountGood:\n    def __init__(self, balance):\n        self._balance = balance  # Protected\n    \n    def get_balance(self):\n        return self._balance\n    \n    def deposit(self, amount):\n        if amount > 0:\n            self._balance += amount\n    \n    def withdraw(self, amount):\n        if 0 < amount <= self._balance:\n            self._balance -= amount\n            return True\n        return False\n\ngood = BankAccountGood(100)\n# good._balance = -1000  # Possible, but convention says don't!\nprint(f\"Deposit $50: {good.deposit(50)}\")\nprint(f\"Balance: {good.get_balance()}\")\nprint(f\"Withdraw $200: {good.withdraw(200)}\")",
          description: "Encapsulation prevents invalid states",
        },
        {
          id: "privacy-conventions",
          title: "Privacy Naming Conventions",
          code: "class Example:\n    def __init__(self):\n        self.public = \"Anyone can access me\"\n        self._protected = \"Please don't access directly\"\n        self.__private = \"I'm name-mangled\"\n    \n    def show_all(self):\n        print(f\"Public: {self.public}\")\n        print(f\"Protected: {self._protected}\")\n        print(f\"Private: {self.__private}\")\n\ne = Example()\n\n# All technically accessible in Python\nprint(\"Accessing from outside:\")\nprint(f\"  public: {e.public}\")\nprint(f\"  _protected: {e._protected}\")  # Works, but don't!\n\n# Private is name-mangled\ntry:\n    print(e.__private)\nexcept AttributeError as err:\n    print(f\"  __private: AttributeError - {err}\")\n\n# Can still access with mangled name (but really don't!)\nprint(f\"  _Example__private: {e._Example__private}\")\n\nprint(\"\\nFrom inside the class:\")\ne.show_all()",
          description: "Understanding privacy conventions",
        },
        {
          id: "getters-setters",
          title: "Getters and Setters",
          code: "class Person:\n    def __init__(self, name, age):\n        self._name = name\n        self._age = age\n    \n    # Getter for name (read-only)\n    def get_name(self):\n        return self._name\n    \n    # Getter for age\n    def get_age(self):\n        return self._age\n    \n    # Setter for age with validation\n    def set_age(self, value):\n        if not isinstance(value, int):\n            raise TypeError(\"Age must be an integer\")\n        if value < 0:\n            raise ValueError(\"Age cannot be negative\")\n        if value > 150:\n            raise ValueError(\"Age seems unrealistic\")\n        self._age = value\n\nperson = Person(\"Alice\", 25)\nprint(f\"Name: {person.get_name()}\")\nprint(f\"Age: {person.get_age()}\")\n\nperson.set_age(26)\nprint(f\"After birthday: {person.get_age()}\")\n\ntry:\n    person.set_age(-5)\nexcept ValueError as e:\n    print(f\"Error: {e}\")",
          description: "Controlled access with getters/setters",
        },
        {
          id: "practical-encapsulation",
          title: "Practical Encapsulation",
          code: "class Temperature:\n    \"\"\"Temperature that can be accessed in C or F.\"\"\"\n    \n    def __init__(self, celsius):\n        self._celsius = celsius  # Store internally as Celsius\n    \n    def get_celsius(self):\n        return self._celsius\n    \n    def set_celsius(self, value):\n        if value < -273.15:  # Absolute zero\n            raise ValueError(\"Temperature below absolute zero!\")\n        self._celsius = value\n    \n    def get_fahrenheit(self):\n        return self._celsius * 9/5 + 32\n    \n    def set_fahrenheit(self, value):\n        celsius = (value - 32) * 5/9\n        self.set_celsius(celsius)  # Reuse validation!\n\ntemp = Temperature(25)\nprint(f\"Celsius: {temp.get_celsius()}°C\")\nprint(f\"Fahrenheit: {temp.get_fahrenheit()}°F\")\n\ntemp.set_fahrenheit(100)\nprint(f\"\\nAfter setting to 100°F:\")\nprint(f\"Celsius: {temp.get_celsius():.1f}°C\")\nprint(f\"Fahrenheit: {temp.get_fahrenheit():.1f}°F\")",
          description: "Real-world encapsulation example",
        },
      ]),
      keyPoints: [
        "Encapsulation bundles data with methods",
        "_name convention means 'protected'",
        "__name uses name mangling",
        "Python doesn't enforce privacy",
        "Getters provide controlled read access",
        "Setters allow validation before changes",
        "Hide implementation to prevent invalid states",
        "Conventions rely on programmer discipline",
      ],
      hardwareDemo: "See _protected vs __mangled names in memory. Watch getter/setter validation.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson8_3_1.number}: ${lesson8_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_3_1.id,
        number: 1,
        title: "Add Getter",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add a get_balance() getter method for the protected _balance.",
        starterCode: "class BankAccount:\n    def __init__(self, balance):\n        self._balance = balance\n    \n    # Add get_balance() method\n\naccount = BankAccount(100)\nprint(f\"Balance: ${account.get_balance()}\")",
        solution: "class BankAccount:\n    def __init__(self, balance):\n        self._balance = balance\n    \n    def get_balance(self):\n        return self._balance\n\naccount = BankAccount(100)\nprint(f\"Balance: ${account.get_balance()}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Balance: $100", description: "Getter works" }]),
        hints: ["def get_balance(self):", "return self._balance"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson8_3_1.id,
        number: 2,
        title: "Add Setter with Validation",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add set_age() that rejects negative ages.",
        starterCode: "class Person:\n    def __init__(self, age):\n        self._age = age\n    \n    def get_age(self):\n        return self._age\n    \n    # Add set_age with validation\n\nperson = Person(25)\nprint(f\"Age: {person.get_age()}\")\nperson.set_age(30)\nprint(f\"New age: {person.get_age()}\")\ntry:\n    person.set_age(-5)\nexcept ValueError as e:\n    print(f\"Error: {e}\")",
        solution: "class Person:\n    def __init__(self, age):\n        self._age = age\n    \n    def get_age(self):\n        return self._age\n    \n    def set_age(self, value):\n        if value < 0:\n            raise ValueError(\"Age cannot be negative\")\n        self._age = value\n\nperson = Person(25)\nprint(f\"Age: {person.get_age()}\")\nperson.set_age(30)\nprint(f\"New age: {person.get_age()}\")\ntry:\n    person.set_age(-5)\nexcept ValueError as e:\n    print(f\"Error: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "25, 30, then error", description: "Validation works" }]),
        hints: ["if value < 0: raise ValueError", "Otherwise set self._age"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson8_3_1.id,
        number: 3,
        title: "Protected Attribute",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a Counter with _count that can only increase (no decrease method).",
        starterCode: "class Counter:\n    def __init__(self):\n        self._count = 0\n    \n    # Add get_count()\n    # Add increment()\n    # No decrement - count only goes up!\n\nc = Counter()\nc.increment()\nc.increment()\nprint(f\"Count: {c.get_count()}\")",
        solution: "class Counter:\n    def __init__(self):\n        self._count = 0\n    \n    def get_count(self):\n        return self._count\n    \n    def increment(self):\n        self._count += 1\n\nc = Counter()\nc.increment()\nc.increment()\nprint(f\"Count: {c.get_count()}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Count: 2", description: "Can only increase" }]),
        hints: ["No setter for direct changes", "increment() is the only way to change"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson8_3_1.id,
        number: 4,
        title: "Name Mangling",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create class with __secret and show it can't be accessed directly.",
        starterCode: "class Secret:\n    def __init__(self):\n        self.__secret = \"hidden\"\n    \n    def reveal(self):\n        return self.__secret\n\ns = Secret()\nprint(f\"Via method: {s.reveal()}\")\n\n# Try direct access (should fail)\ntry:\n    print(s.__secret)\nexcept AttributeError as e:\n    print(f\"Direct access failed: {e}\")\n\n# Show the mangled name\nprint(f\"Mangled name: {s._Secret__secret}\")",
        solution: "class Secret:\n    def __init__(self):\n        self.__secret = \"hidden\"\n    \n    def reveal(self):\n        return self.__secret\n\ns = Secret()\nprint(f\"Via method: {s.reveal()}\")\n\ntry:\n    print(s.__secret)\nexcept AttributeError as e:\n    print(f\"Direct access failed: {e}\")\n\nprint(f\"Mangled name: {s._Secret__secret}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Method works, direct fails, mangled works", description: "Name mangling shown" }]),
        hints: ["__name becomes _ClassName__name", "Still accessible but discouraged"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson8_3_1.id,
        number: 5,
        title: "Complete Encapsulation",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create Product with price that can't be negative or set below cost.",
        starterCode: "class Product:\n    def __init__(self, name, cost, price):\n        self._name = name\n        self._cost = cost\n        self._price = price\n    \n    def get_name(self):\n        return self._name\n    \n    def get_price(self):\n        return self._price\n    \n    def set_price(self, value):\n        # Price must be positive AND >= cost\n        pass\n    \n    def get_profit(self):\n        return self._price - self._cost\n\np = Product(\"Widget\", 10, 25)\nprint(f\"{p.get_name()}: ${p.get_price()} (profit: ${p.get_profit()})\")\n\np.set_price(30)\nprint(f\"New price: ${p.get_price()}\")\n\ntry:\n    p.set_price(5)  # Below cost!\nexcept ValueError as e:\n    print(f\"Error: {e}\")",
        solution: "class Product:\n    def __init__(self, name, cost, price):\n        self._name = name\n        self._cost = cost\n        self._price = price\n    \n    def get_name(self):\n        return self._name\n    \n    def get_price(self):\n        return self._price\n    \n    def set_price(self, value):\n        if value < 0:\n            raise ValueError(\"Price cannot be negative\")\n        if value < self._cost:\n            raise ValueError(f\"Price cannot be below cost (${self._cost})\")\n        self._price = value\n    \n    def get_profit(self):\n        return self._price - self._cost\n\np = Product(\"Widget\", 10, 25)\nprint(f\"{p.get_name()}: ${p.get_price()} (profit: ${p.get_profit()})\")\n\np.set_price(30)\nprint(f\"New price: ${p.get_price()}\")\n\ntry:\n    p.set_price(5)\nexcept ValueError as e:\n    print(f\"Error: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Price validated against cost", description: "Business logic in setter" }]),
        hints: ["Check both negative and below cost", "Include cost in error message"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 8.3.1`);

  // ==================== LESSON 8.3.2 ====================
  const lesson8_3_2 = await prisma.lesson.upsert({
    where: { slug: "special-methods" },
    update: {},
    create: {
      sectionId: section8_3.id,
      number: 8.32,
      title: "Special Methods",
      slug: "special-methods",
      objectives: [
        "Implement __str__ for string representation",
        "Implement __repr__ for debugging",
        "Implement __eq__ for equality",
        "Use comparison methods __lt__, __gt__",
      ],
      content: `# Special Methods (Magic/Dunder Methods)

## What Are Special Methods?

Methods with double underscores that Python calls automatically:

\`\`\`python
print(obj)      # Calls obj.__str__()
obj1 == obj2    # Calls obj1.__eq__(obj2)
len(obj)        # Calls obj.__len__()
\`\`\`

## __str__ - Human-Readable String

Called by \`print()\` and \`str()\`:

\`\`\`python
class Person:
    def __init__(self, name):
        self.name = name
    
    def __str__(self):
        return f"Person: {self.name}"

print(Person("Alice"))  # "Person: Alice"
\`\`\`

## __repr__ - Developer String

For debugging, unambiguous representation:

\`\`\`python
def __repr__(self):
    return f"Person('{self.name}')"

# Shows in debugger, interactive shell, lists
\`\`\`

Rule: If possible, __repr__ should return string that recreates object.

## __eq__ - Equality Comparison

Customize what \`==\` means:

\`\`\`python
def __eq__(self, other):
    if not isinstance(other, Person):
        return False
    return self.name == other.name
\`\`\`

## Comparison Methods

| Method | Operator |
|--------|----------|
| __eq__ | == |
| __ne__ | != |
| __lt__ | < |
| __le__ | <= |
| __gt__ | > |
| __ge__ | >= |

\`\`\`python
def __lt__(self, other):
    return self.age < other.age
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "str-repr",
          title: "__str__ and __repr__",
          code: "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    \n    def __str__(self):\n        \"\"\"Human-readable string.\"\"\"\n        return f\"Point at ({self.x}, {self.y})\"\n    \n    def __repr__(self):\n        \"\"\"Developer/debug string.\"\"\"\n        return f\"Point({self.x}, {self.y})\"\n\np = Point(3, 4)\n\n# __str__ used by print()\nprint(f\"str: {p}\")\nprint(f\"str(): {str(p)}\")\n\n# __repr__ used in interactive mode and lists\nprint(f\"repr: {repr(p)}\")\n\n# In a list, __repr__ is used\npoints = [Point(1, 2), Point(3, 4)]\nprint(f\"\\nList of points: {points}\")",
          description: "__str__ for users, __repr__ for developers",
        },
        {
          id: "equality",
          title: "__eq__ for Equality",
          code: "class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def __eq__(self, other):\n        \"\"\"Two persons are equal if same name and age.\"\"\"\n        if not isinstance(other, Person):\n            return False\n        return self.name == other.name and self.age == other.age\n    \n    def __repr__(self):\n        return f\"Person('{self.name}', {self.age})\"\n\np1 = Person(\"Alice\", 30)\np2 = Person(\"Alice\", 30)\np3 = Person(\"Bob\", 30)\n\n# Without __eq__, these would compare by identity (memory address)\nprint(f\"p1 == p2: {p1 == p2}\")  # True - same name and age\nprint(f\"p1 == p3: {p1 == p3}\")  # False - different name\nprint(f\"p1 is p2: {p1 is p2}\")  # False - different objects\n\n# Works with 'in' operator too\npeople = [p1, p3]\nprint(f\"\\np2 in people: {p2 in people}\")  # True! (equals p1)",
          description: "Custom equality comparison",
        },
        {
          id: "comparison-methods",
          title: "Comparison Methods",
          code: "class Student:\n    def __init__(self, name, gpa):\n        self.name = name\n        self.gpa = gpa\n    \n    def __repr__(self):\n        return f\"Student('{self.name}', {self.gpa})\"\n    \n    def __eq__(self, other):\n        return self.gpa == other.gpa\n    \n    def __lt__(self, other):\n        return self.gpa < other.gpa\n    \n    def __le__(self, other):\n        return self.gpa <= other.gpa\n    \n    def __gt__(self, other):\n        return self.gpa > other.gpa\n    \n    def __ge__(self, other):\n        return self.gpa >= other.gpa\n\nalice = Student(\"Alice\", 3.8)\nbob = Student(\"Bob\", 3.5)\ncarol = Student(\"Carol\", 3.8)\n\nprint(f\"alice > bob: {alice > bob}\")\nprint(f\"alice == carol: {alice == carol}\")\nprint(f\"bob < alice: {bob < alice}\")\n\n# Now we can sort!\nstudents = [alice, bob, carol]\nstudents.sort()  # Uses __lt__\nprint(f\"\\nSorted by GPA: {students}\")",
          description: "Making objects sortable",
        },
        {
          id: "complete-class",
          title: "Complete Special Methods Example",
          code: "class Money:\n    def __init__(self, dollars, cents=0):\n        self.total_cents = dollars * 100 + cents\n    \n    def __str__(self):\n        dollars = self.total_cents // 100\n        cents = self.total_cents % 100\n        return f\"${dollars}.{cents:02d}\"\n    \n    def __repr__(self):\n        dollars = self.total_cents // 100\n        cents = self.total_cents % 100\n        return f\"Money({dollars}, {cents})\"\n    \n    def __eq__(self, other):\n        if not isinstance(other, Money):\n            return False\n        return self.total_cents == other.total_cents\n    \n    def __lt__(self, other):\n        return self.total_cents < other.total_cents\n    \n    def __add__(self, other):\n        return Money(0, self.total_cents + other.total_cents)\n\nm1 = Money(10, 50)   # $10.50\nm2 = Money(5, 75)    # $5.75\nm3 = Money(10, 50)   # $10.50\n\nprint(f\"m1 = {m1}\")\nprint(f\"m2 = {m2}\")\nprint(f\"m1 == m3: {m1 == m3}\")\nprint(f\"m1 > m2: {m1 > m2}\")\nprint(f\"m1 + m2 = {m1 + m2}\")",
          description: "Full featured class with special methods",
        },
      ]),
      keyPoints: [
        "__str__: human-readable string (print)",
        "__repr__: developer string (debugging)",
        "__eq__: customize == comparison",
        "__lt__, __gt__: comparison operators",
        "Check isinstance() in __eq__",
        "Implement __lt__ for sorting",
        "__add__ for + operator",
        "Special methods make objects Pythonic",
      ],
      hardwareDemo: "See Python call __str__ when printing. Watch __eq__ during comparison.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson8_3_2.number}: ${lesson8_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson8_3_2.id,
        number: 1,
        title: "Add __str__",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add __str__ to return 'Book: {title} by {author}'",
        starterCode: "class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n    \n    # Add __str__\n\nbook = Book(\"1984\", \"Orwell\")\nprint(book)",
        solution: "class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n    \n    def __str__(self):\n        return f\"Book: {self.title} by {self.author}\"\n\nbook = Book(\"1984\", \"Orwell\")\nprint(book)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Book: 1984 by Orwell", description: "__str__ works" }]),
        hints: ["def __str__(self):", "Return formatted string"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson8_3_2.id,
        number: 2,
        title: "Add __repr__",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add __repr__ that returns valid Python code to recreate the object.",
        starterCode: "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    \n    # Add __repr__ returning \"Point(x, y)\"\n\np = Point(3, 4)\nprint(repr(p))\nprint([Point(1, 2), Point(3, 4)])",
        solution: "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    \n    def __repr__(self):\n        return f\"Point({self.x}, {self.y})\"\n\np = Point(3, 4)\nprint(repr(p))\nprint([Point(1, 2), Point(3, 4)])",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Point(3, 4)", description: "__repr__ works" }]),
        hints: ["def __repr__(self):", "Return string that looks like constructor call"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson8_3_2.id,
        number: 3,
        title: "Implement __eq__",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add __eq__ so two Products are equal if they have the same id.",
        starterCode: "class Product:\n    def __init__(self, id, name):\n        self.id = id\n        self.name = name\n    \n    # Add __eq__ comparing by id\n\np1 = Product(1, \"Apple\")\np2 = Product(1, \"Red Apple\")  # Same id!\np3 = Product(2, \"Banana\")\n\nprint(f\"p1 == p2: {p1 == p2}\")  # True (same id)\nprint(f\"p1 == p3: {p1 == p3}\")  # False",
        solution: "class Product:\n    def __init__(self, id, name):\n        self.id = id\n        self.name = name\n    \n    def __eq__(self, other):\n        if not isinstance(other, Product):\n            return False\n        return self.id == other.id\n\np1 = Product(1, \"Apple\")\np2 = Product(1, \"Red Apple\")\np3 = Product(2, \"Banana\")\n\nprint(f\"p1 == p2: {p1 == p2}\")\nprint(f\"p1 == p3: {p1 == p3}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "True\\nFalse", description: "__eq__ works" }]),
        hints: ["Check isinstance first", "Compare self.id == other.id"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson8_3_2.id,
        number: 4,
        title: "Make Sortable",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add __lt__ to Student so students can be sorted by grade.",
        starterCode: "class Student:\n    def __init__(self, name, grade):\n        self.name = name\n        self.grade = grade\n    \n    def __repr__(self):\n        return f\"{self.name}:{self.grade}\"\n    \n    # Add __lt__ to compare by grade\n\nstudents = [Student(\"Alice\", 85), Student(\"Bob\", 92), Student(\"Carol\", 78)]\nstudents.sort()\nprint(students)",
        solution: "class Student:\n    def __init__(self, name, grade):\n        self.name = name\n        self.grade = grade\n    \n    def __repr__(self):\n        return f\"{self.name}:{self.grade}\"\n    \n    def __lt__(self, other):\n        return self.grade < other.grade\n\nstudents = [Student(\"Alice\", 85), Student(\"Bob\", 92), Student(\"Carol\", 78)]\nstudents.sort()\nprint(students)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[Carol:78, Alice:85, Bob:92]", description: "Sort works" }]),
        hints: ["def __lt__(self, other):", "Compare grades"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson8_3_2.id,
        number: 5,
        title: "Complete Special Methods",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create Rectangle with __str__, __repr__, __eq__, and __lt__ (by area).",
        starterCode: "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    \n    def area(self):\n        return self.width * self.height\n    \n    # Add __str__: \"WxH rectangle\"\n    # Add __repr__: \"Rectangle(W, H)\"\n    # Add __eq__: same width AND height\n    # Add __lt__: by area\n\nr1 = Rectangle(4, 5)\nr2 = Rectangle(4, 5)\nr3 = Rectangle(10, 2)\n\nprint(r1)\nprint(repr(r1))\nprint(f\"r1 == r2: {r1 == r2}\")\nprint(f\"r1 < r3: {r1 < r3}\")\n\nrects = [Rectangle(3, 3), Rectangle(2, 5), Rectangle(4, 2)]\nrects.sort()\nprint([r.area() for r in rects])",
        solution: "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    \n    def area(self):\n        return self.width * self.height\n    \n    def __str__(self):\n        return f\"{self.width}x{self.height} rectangle\"\n    \n    def __repr__(self):\n        return f\"Rectangle({self.width}, {self.height})\"\n    \n    def __eq__(self, other):\n        if not isinstance(other, Rectangle):\n            return False\n        return self.width == other.width and self.height == other.height\n    \n    def __lt__(self, other):\n        return self.area() < other.area()\n\nr1 = Rectangle(4, 5)\nr2 = Rectangle(4, 5)\nr3 = Rectangle(10, 2)\n\nprint(r1)\nprint(repr(r1))\nprint(f\"r1 == r2: {r1 == r2}\")\nprint(f\"r1 < r3: {r1 < r3}\")\n\nrects = [Rectangle(3, 3), Rectangle(2, 5), Rectangle(4, 2)]\nrects.sort()\nprint([r.area() for r in rects])",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All special methods work", description: "Complete class" }]),
        hints: ["__eq__ checks both dimensions", "__lt__ compares self.area() < other.area()"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 8.3.2`);

  console.log("\n✅ Chapter 8 Part 4 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
