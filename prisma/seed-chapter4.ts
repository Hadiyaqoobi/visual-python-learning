import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Chapter 4: Functions, Scoping, and Abstraction...");

  // Create Chapter 4
  const chapter4 = await prisma.chapter.upsert({
    where: { number: 4 },
    update: {},
    create: {
      number: 4,
      title: "Functions, Scoping, and Abstraction",
      description: "Learn to write reusable code with functions, understand variable scope, and master recursion.",
      objectives: [
        "Define and call functions with parameters and return values",
        "Use keyword arguments and default parameter values",
        "Understand local vs global scope",
        "Write clear function specifications with docstrings",
        "Implement recursive algorithms",
        "Work with modules and imports",
      ],
      isPublished: true,
    },
  });

  console.log("✅ Created Chapter 4:", chapter4.title);

  // Create Sections
  const section4_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter4.id, number: 4.1 } },
    update: {},
    create: {
      chapterId: chapter4.id,
      number: 4.1,
      title: "Function Definitions",
      description: "Creating reusable blocks of code",
      order: 1,
    },
  });

  const section4_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter4.id, number: 4.2 } },
    update: {},
    create: {
      chapterId: chapter4.id,
      number: 4.2,
      title: "Arguments and Parameters",
      description: "Passing data to functions",
      order: 2,
    },
  });

  const section4_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter4.id, number: 4.3 } },
    update: {},
    create: {
      chapterId: chapter4.id,
      number: 4.3,
      title: "Scoping",
      description: "Where variables live and how long they last",
      order: 3,
    },
  });

  const section4_4 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter4.id, number: 4.4 } },
    update: {},
    create: {
      chapterId: chapter4.id,
      number: 4.4,
      title: "Specifications and Docstrings",
      description: "Documenting your functions",
      order: 4,
    },
  });

  const section4_5 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter4.id, number: 4.5 } },
    update: {},
    create: {
      chapterId: chapter4.id,
      number: 4.5,
      title: "Recursion",
      description: "Functions that call themselves",
      order: 5,
    },
  });

  const section4_6 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter4.id, number: 4.6 } },
    update: {},
    create: {
      chapterId: chapter4.id,
      number: 4.6,
      title: "Modules",
      description: "Organizing and reusing code",
      order: 6,
    },
  });

  // ==================== LESSON 4.1.1: Function Basics ====================
  const lesson4_1_1 = await prisma.lesson.upsert({
    where: { slug: "function-basics" },
    update: {},
    create: {
      sectionId: section4_1.id,
      number: 4.11,
      title: "Function Basics",
      slug: "function-basics",
      objectives: [
        "Understand what functions are and why they're useful",
        "Define functions using the def keyword",
        "Call functions and understand the flow of execution",
        "Use return statements to send values back",
      ],
      content: `# Function Basics

A **function** is a reusable block of code that performs a specific task. Functions are fundamental to writing clean, organized, maintainable programs.

## Why Use Functions?

1. **Reusability**: Write once, use many times
2. **Organization**: Break complex problems into smaller pieces
3. **Abstraction**: Hide complexity behind a simple interface
4. **Testing**: Easier to test small, focused functions

## Defining a Function

Use the \`def\` keyword:

\`\`\`python
def greet():
    print("Hello, World!")
\`\`\`

Structure:
- \`def\` - keyword that starts a function definition
- \`greet\` - the function's name
- \`()\` - parentheses for parameters (empty here)
- \`:\` - colon to start the body
- Indented code - the function body

## Calling a Function

To execute a function, **call** it by name with parentheses:

\`\`\`python
greet()  # Prints "Hello, World!"
greet()  # Can call as many times as you want
\`\`\`

## The return Statement

Functions can send a value back to the caller:

\`\`\`python
def square(x):
    return x * x

result = square(5)  # result is 25
\`\`\`

Without \`return\`, a function returns \`None\`:

\`\`\`python
def say_hello():
    print("Hello")
    # No return statement

result = say_hello()  # Prints "Hello"
print(result)         # None
\`\`\`

## Function Flow

When you call a function:
1. Execution jumps to the function body
2. Function code runs
3. If there's a \`return\`, that value goes back
4. Execution continues after the function call

## Hardware View

In Hardware Mode, watch:
- A new **stack frame** created when function is called
- Local variables stored in the stack frame
- The stack frame destroyed when function returns`,
      codeExamples: JSON.stringify([
        {
          id: "simple-function",
          title: "Simple Function",
          code: `def greet():
    print("Hello, World!")

# Call the function
greet()
greet()`,
          description: "Define and call a simple function",
        },
        {
          id: "function-return",
          title: "Function with Return",
          code: `def square(x):
    return x * x

# Use the returned value
result = square(5)
print(f"5 squared is {result}")

# Can use directly in expressions
print(f"10 squared is {square(10)}")`,
          description: "Functions can return values",
        },
        {
          id: "multiple-functions",
          title: "Multiple Functions",
          code: `def add(a, b):
    return a + b

def multiply(a, b):
    return a * b

# Use both functions
sum_result = add(3, 4)
product_result = multiply(3, 4)

print(f"3 + 4 = {sum_result}")
print(f"3 * 4 = {product_result}")`,
          description: "Define multiple related functions",
        },
        {
          id: "none-return",
          title: "Functions Without Return",
          code: `def print_header(title):
    print("=" * 30)
    print(title)
    print("=" * 30)

result = print_header("My Program")
print(f"Return value: {result}")  # None`,
          description: "Functions without return give None",
        },
      ]),
      keyPoints: [
        "Functions are defined with def keyword",
        "Call functions with parentheses: function_name()",
        "return sends a value back to the caller",
        "Without return, functions return None",
        "Functions enable code reuse and organization",
      ],
      hardwareDemo: "Watch the call stack grow when a function is called. A new stack frame is created to hold the function's local variables. When the function returns, the frame is destroyed.",
      estimatedTime: 18,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_1_1.id,
        number: 1,
        title: "Say Hello",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Define a function called `say_hello` that prints \"Hello!\". Then call it.",
        starterCode: `# Define the function
def say_hello():
    # Print Hello!
    
# Call the function
`,
        solution: `def say_hello():
    print("Hello!")
    
say_hello()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Hello!", description: "Should print Hello!" },
        ]),
        hints: [
          "Use print(\"Hello!\") in the function body",
          "Make sure to indent the print statement",
          "Call the function with say_hello()",
        ],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson4_1_1.id,
        number: 2,
        title: "Double It",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Define a function called `double` that takes a number and returns it multiplied by 2. Test it with the number 7.",
        starterCode: `def double(n):
    # Return n times 2
    
# Test it
result = double(7)
print(result)`,
        solution: `def double(n):
    return n * 2
    
result = double(7)
print(result)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "14", description: "double(7) should be 14" },
        ]),
        hints: [
          "Use return to send back the value",
          "return n * 2",
          "The * operator multiplies",
        ],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson4_1_1.id,
        number: 3,
        title: "Calculate Area",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Define a function `rectangle_area` that takes width and height parameters and returns the area. Calculate the area of a 5x3 rectangle.",
        starterCode: `def rectangle_area(width, height):
    # Return width times height
    
# Calculate area of 5x3 rectangle
area = rectangle_area(5, 3)
print(area)`,
        solution: `def rectangle_area(width, height):
    return width * height
    
area = rectangle_area(5, 3)
print(area)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "15", description: "5 * 3 = 15" },
        ]),
        hints: [
          "Area = width × height",
          "Use return width * height",
          "The function takes two parameters",
        ],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson4_1_1.id,
        number: 4,
        title: "Is Even",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Define a function `is_even` that returns True if a number is even, False otherwise. Test with 10 and 7.",
        starterCode: `def is_even(n):
    # Return True if n is divisible by 2
    
print(is_even(10))
print(is_even(7))`,
        solution: `def is_even(n):
    return n % 2 == 0
    
print(is_even(10))
print(is_even(7))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "True\nFalse", description: "10 is even, 7 is odd" },
        ]),
        hints: [
          "A number is even if n % 2 == 0",
          "% gives the remainder",
          "Return the boolean result directly",
        ],
        xpReward: 20,
        order: 4,
      },
    ],
  });

  console.log("✅ Created Lesson 4.1.1: Function Basics");

  // ==================== LESSON 4.1.2: Parameters and Arguments ====================
  const lesson4_1_2 = await prisma.lesson.upsert({
    where: { slug: "parameters-arguments" },
    update: {},
    create: {
      sectionId: section4_1.id,
      number: 4.12,
      title: "Parameters and Arguments",
      slug: "parameters-arguments",
      objectives: [
        "Distinguish between parameters and arguments",
        "Pass multiple arguments to functions",
        "Understand how values are passed to functions",
        "Return multiple values from functions",
      ],
      content: `# Parameters and Arguments

When working with functions, it's important to understand the difference between **parameters** and **arguments**.

## Parameters vs Arguments

- **Parameters**: Variables listed in the function definition
- **Arguments**: Actual values passed when calling the function

\`\`\`python
def greet(name):     # 'name' is a parameter
    print(f"Hello, {name}!")

greet("Alice")       # "Alice" is an argument
\`\`\`

## Multiple Parameters

Functions can have any number of parameters:

\`\`\`python
def introduce(name, age, city):
    print(f"I'm {name}, {age} years old, from {city}")

introduce("Bob", 25, "Boston")
\`\`\`

## Order Matters (Positional Arguments)

Arguments are matched to parameters by position:

\`\`\`python
def power(base, exponent):
    return base ** exponent

print(power(2, 3))  # 2³ = 8
print(power(3, 2))  # 3² = 9  (different!)
\`\`\`

## Returning Multiple Values

Python functions can return multiple values using tuples:

\`\`\`python
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([3, 1, 4, 1, 5, 9])
print(f"Min: {low}, Max: {high}")
\`\`\`

## Arguments Are Copied

When you pass an argument, its value is copied to the parameter:

\`\`\`python
def change_it(x):
    x = 100  # Changes local copy only
    print(f"Inside: {x}")

num = 5
change_it(num)
print(f"Outside: {num}")  # Still 5!
\`\`\`

## Hardware View

Watch the stack frame creation:
1. New frame created on the call stack
2. Argument values are copied into parameter slots
3. Function uses its own copies`,
      codeExamples: JSON.stringify([
        {
          id: "params-args",
          title: "Parameters vs Arguments",
          code: `def greet(name):  # 'name' is a parameter
    print(f"Hello, {name}!")

# These are arguments
greet("Alice")
greet("Bob")
greet("Charlie")`,
          description: "Parameters are placeholders, arguments are actual values",
        },
        {
          id: "multiple-params",
          title: "Multiple Parameters",
          code: `def describe_person(name, age, occupation):
    print(f"{name} is {age} years old")
    print(f"Works as: {occupation}")

describe_person("Alice", 30, "Engineer")
print()
describe_person("Bob", 25, "Designer")`,
          description: "Functions can take multiple parameters",
        },
        {
          id: "return-multiple",
          title: "Returning Multiple Values",
          code: `def calculate(a, b):
    sum_val = a + b
    diff_val = a - b
    prod_val = a * b
    return sum_val, diff_val, prod_val

s, d, p = calculate(10, 3)
print(f"Sum: {s}")
print(f"Difference: {d}")
print(f"Product: {p}")`,
          description: "Return multiple values with tuple unpacking",
        },
        {
          id: "args-copied",
          title: "Arguments Are Copied",
          code: `def try_to_change(x):
    print(f"Before: x = {x}")
    x = 999
    print(f"After: x = {x}")

original = 42
print(f"Original before call: {original}")
try_to_change(original)
print(f"Original after call: {original}")`,
          description: "The original value is not changed",
        },
      ]),
      keyPoints: [
        "Parameters are in the definition, arguments are in the call",
        "Arguments are matched to parameters by position",
        "Order matters for positional arguments",
        "Functions can return multiple values",
        "Argument values are copied to parameters",
      ],
      hardwareDemo: "See argument values copied into the new stack frame. The original variables outside the function are not affected when parameters are modified.",
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
        lessonId: lesson4_1_2.id,
        number: 1,
        title: "Personalized Greeting",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Define a function `greet` that takes a name parameter and prints \"Hello, [name]!\". Call it with \"Python\".",
        starterCode: `def greet(name):
    # Print Hello, name!
    
greet("Python")`,
        solution: `def greet(name):
    print(f"Hello, {name}!")
    
greet("Python")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Hello, Python!", description: "Should greet Python" },
        ]),
        hints: [
          "Use an f-string: f\"Hello, {name}!\"",
          "The parameter name holds the value passed",
          "print() displays the message",
        ],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson4_1_2.id,
        number: 2,
        title: "Power Function",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Define a function `power` that takes base and exponent parameters and returns base raised to the exponent. Calculate 2^8.",
        starterCode: `def power(base, exponent):
    # Return base to the power of exponent
    
result = power(2, 8)
print(result)`,
        solution: `def power(base, exponent):
    return base ** exponent
    
result = power(2, 8)
print(result)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "256", description: "2^8 = 256" },
        ]),
        hints: [
          "Use ** for exponentiation",
          "return base ** exponent",
          "2^8 = 256",
        ],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson4_1_2.id,
        number: 3,
        title: "Sum and Product",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Define a function `sum_and_product` that takes two numbers and returns both their sum and product. Test with 4 and 5.",
        starterCode: `def sum_and_product(a, b):
    # Return sum and product
    
s, p = sum_and_product(4, 5)
print(s)
print(p)`,
        solution: `def sum_and_product(a, b):
    return a + b, a * b
    
s, p = sum_and_product(4, 5)
print(s)
print(p)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "9\n20", description: "4+5=9, 4*5=20" },
        ]),
        hints: [
          "Return two values separated by comma",
          "return a + b, a * b",
          "Unpack with s, p = ...",
        ],
        xpReward: 20,
        order: 3,
      },
    ],
  });

  console.log("✅ Created Lesson 4.1.2: Parameters and Arguments");

  // ==================== LESSON 4.2.1: Keyword Arguments ====================
  const lesson4_2_1 = await prisma.lesson.upsert({
    where: { slug: "keyword-arguments" },
    update: {},
    create: {
      sectionId: section4_2.id,
      number: 4.21,
      title: "Keyword Arguments",
      slug: "keyword-arguments",
      objectives: [
        "Use keyword arguments when calling functions",
        "Understand when keyword arguments are helpful",
        "Mix positional and keyword arguments correctly",
        "Improve code readability with named arguments",
      ],
      content: `# Keyword Arguments

So far, we've used **positional arguments** - matched by position. Python also supports **keyword arguments** - matched by name.

## Positional vs Keyword

\`\`\`python
def greet(name, greeting):
    print(f"{greeting}, {name}!")

# Positional - order matters
greet("Alice", "Hello")  # Hello, Alice!

# Keyword - order doesn't matter
greet(greeting="Hi", name="Bob")  # Hi, Bob!
\`\`\`

## Why Use Keyword Arguments?

1. **Clarity**: Makes it clear what each argument means
2. **Flexibility**: Can provide arguments in any order
3. **Selective**: Can skip parameters that have defaults

## Mixing Positional and Keyword

You can mix them, but positional must come first:

\`\`\`python
def describe(name, age, city):
    print(f"{name}, {age}, from {city}")

# OK - positional first, then keyword
describe("Alice", city="Boston", age=25)

# ERROR - positional after keyword
# describe(name="Bob", 30, "NYC")  # SyntaxError!
\`\`\`

## When to Use Keywords

Keywords are especially useful when:
- Function has many parameters
- Some parameters are optional
- Meaning isn't obvious from position
- You want self-documenting code

\`\`\`python
# Confusing
connect("localhost", 5432, True, False, 30)

# Clear!
connect(host="localhost", port=5432, 
        ssl=True, debug=False, timeout=30)
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "keyword-basic",
          title: "Keyword Arguments",
          code: `def introduce(name, age, city):
    print(f"{name} is {age}, lives in {city}")

# All positional
introduce("Alice", 25, "Boston")

# All keyword (any order!)
introduce(city="NYC", name="Bob", age=30)

# Mixed (positional first)
introduce("Charlie", city="LA", age=22)`,
          description: "Different ways to call the same function",
        },
        {
          id: "clarity-example",
          title: "Keyword for Clarity",
          code: `def create_user(username, email, is_admin, is_active):
    print(f"User: {username}")
    print(f"Email: {email}")
    print(f"Admin: {is_admin}, Active: {is_active}")

# Confusing - what do True, False mean?
# create_user("alice", "a@b.com", True, False)

# Clear with keywords!
create_user("alice", "a@b.com", 
            is_admin=True, is_active=False)`,
          description: "Keywords make boolean arguments clear",
        },
        {
          id: "self-documenting",
          title: "Self-Documenting Code",
          code: `def draw_rectangle(x, y, width, height, filled):
    status = "filled" if filled else "outline"
    print(f"Rectangle at ({x}, {y})")
    print(f"Size: {width}x{height}, {status}")

# Very readable!
draw_rectangle(x=10, y=20, 
               width=100, height=50, 
               filled=True)`,
          description: "Keywords make code self-documenting",
        },
      ]),
      keyPoints: [
        "Keyword arguments use name=value syntax",
        "Order doesn't matter for keyword arguments",
        "Positional arguments must come before keywords",
        "Keywords improve readability for many parameters",
        "Especially useful for boolean flags",
      ],
      hardwareDemo: "Watch how both positional and keyword arguments end up in the same parameter slots in the stack frame - just matched differently!",
      estimatedTime: 12,
      difficulty: "BEGINNER",
      order: 3,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_2_1.id,
        number: 1,
        title: "Use Keywords",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Call the `greet` function using keyword arguments in reverse order (greeting first, then name).",
        starterCode: `def greet(name, greeting):
    print(f"{greeting}, {name}!")

# Call with keywords in reverse order
greet()`,
        solution: `def greet(name, greeting):
    print(f"{greeting}, {name}!")

greet(greeting="Hello", name="World")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Hello, World!", description: "Should print Hello, World!" },
        ]),
        hints: [
          "Use name=value syntax",
          "greet(greeting=\"...\", name=\"...\")",
          "Order doesn't matter with keywords",
        ],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson4_2_1.id,
        number: 2,
        title: "Mixed Arguments",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Call `describe` with \"Alice\" as positional, and age=25, city=\"Boston\" as keywords.",
        starterCode: `def describe(name, age, city):
    print(f"{name} is {age}, from {city}")

# Call with mixed arguments
describe()`,
        solution: `def describe(name, age, city):
    print(f"{name} is {age}, from {city}")

describe("Alice", age=25, city="Boston")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Alice is 25, from Boston", description: "Should describe Alice" },
        ]),
        hints: [
          "Positional first, keywords after",
          "\"Alice\" is positional",
          "age=25 and city=\"Boston\" are keywords",
        ],
        xpReward: 15,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 4.2.1: Keyword Arguments");

  // ==================== LESSON 4.2.2: Default Parameter Values ====================
  const lesson4_2_2 = await prisma.lesson.upsert({
    where: { slug: "default-parameters" },
    update: {},
    create: {
      sectionId: section4_2.id,
      number: 4.22,
      title: "Default Parameter Values",
      slug: "default-parameters",
      objectives: [
        "Define functions with default parameter values",
        "Make parameters optional",
        "Understand the order of parameters with defaults",
        "Avoid common pitfalls with mutable defaults",
      ],
      content: `# Default Parameter Values

You can give parameters **default values**. If the caller doesn't provide that argument, the default is used.

## Basic Defaults

\`\`\`python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Alice")           # Hello, Alice!
greet("Bob", "Hi")       # Hi, Bob!
greet("Charlie", greeting="Hey")  # Hey, Charlie!
\`\`\`

## Parameter Order Rule

Parameters with defaults must come AFTER parameters without:

\`\`\`python
# OK
def func(required, optional="default"):
    pass

# ERROR - default before non-default
# def func(optional="default", required):
#     pass
\`\`\`

## Multiple Defaults

\`\`\`python
def connect(host, port=5432, timeout=30):
    print(f"Connecting to {host}:{port}")
    print(f"Timeout: {timeout}s")

connect("localhost")              # Uses both defaults
connect("localhost", 3000)        # Custom port
connect("localhost", timeout=60)  # Custom timeout only
\`\`\`

## Why Use Defaults?

1. **Convenience**: Common cases need fewer arguments
2. **Backwards compatibility**: Add parameters without breaking existing code
3. **Sensible defaults**: Most users don't need to specify everything

## Warning: Mutable Defaults

Never use mutable objects (lists, dicts) as defaults:

\`\`\`python
# BAD - list is shared between calls!
def add_item(item, lst=[]):
    lst.append(item)
    return lst

# GOOD - use None and create inside
def add_item(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-default",
          title: "Basic Default Values",
          code: `def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

# Without optional argument
greet("Alice")

# With optional argument
greet("Bob", "Howdy")`,
          description: "Default value used when argument not provided",
        },
        {
          id: "multiple-defaults",
          title: "Multiple Defaults",
          code: `def make_coffee(size="medium", milk=False, sugar=0):
    print(f"Making {size} coffee")
    if milk:
        print("  + milk")
    if sugar > 0:
        print(f"  + {sugar} sugar(s)")

make_coffee()
print()
make_coffee("large", milk=True, sugar=2)`,
          description: "Multiple optional parameters",
        },
        {
          id: "skip-middle",
          title: "Skip Middle Parameters",
          code: `def connect(host, port=5432, ssl=False, timeout=30):
    print(f"Host: {host}, Port: {port}")
    print(f"SSL: {ssl}, Timeout: {timeout}")

# Skip port and ssl, just set timeout
connect("localhost", timeout=60)`,
          description: "Use keywords to skip some defaults",
        },
      ]),
      keyPoints: [
        "Default values make parameters optional",
        "Syntax: def func(param=default_value)",
        "Parameters with defaults must come last",
        "Use keywords to skip some optional parameters",
        "Never use mutable objects (lists, dicts) as defaults",
      ],
      hardwareDemo: "Watch how default values are used when arguments aren't provided. The default value is copied into the stack frame's parameter slot.",
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 4,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_2_2.id,
        number: 1,
        title: "Greeting with Default",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Define a function `greet` with name as required and greeting defaulting to \"Hello\". Call it twice: once with just name, once with both.",
        starterCode: `def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

# Call with just name
greet("Alice")
# Call with both
greet("Bob", "Hi")`,
        solution: `def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Alice")
greet("Bob", "Hi")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Hello, Alice!\nHi, Bob!", description: "Should greet both" },
        ]),
        hints: [
          "greeting=\"Hello\" sets the default",
          "First call uses default",
          "Second call overrides default",
        ],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson4_2_2.id,
        number: 2,
        title: "Power with Default",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Define a function `power` where base is required and exponent defaults to 2 (for squaring). Calculate 5² and 2⁸.",
        starterCode: `def power(base, exponent=2):
    # Return base to the exponent
    
print(power(5))      # 5^2 = 25
print(power(2, 8))   # 2^8 = 256`,
        solution: `def power(base, exponent=2):
    return base ** exponent
    
print(power(5))
print(power(2, 8))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "25\n256", description: "5²=25, 2⁸=256" },
        ]),
        hints: [
          "exponent=2 is the default",
          "power(5) uses exponent=2",
          "power(2, 8) overrides to 8",
        ],
        xpReward: 15,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 4.2.2: Default Parameter Values");

  // ==================== LESSON 4.3.1: Variable Scope ====================
  const lesson4_3_1 = await prisma.lesson.upsert({
    where: { slug: "variable-scope" },
    update: {},
    create: {
      sectionId: section4_3.id,
      number: 4.31,
      title: "Variable Scope",
      slug: "variable-scope",
      objectives: [
        "Understand local vs global scope",
        "Know Python's variable lookup rules (LEGB)",
        "Avoid common scope mistakes",
        "Use scope to write cleaner code",
      ],
      content: `# Variable Scope

**Scope** determines where a variable can be accessed. Understanding scope is crucial for writing correct functions.

## Local Scope

Variables created inside a function are **local** - they only exist inside that function:

\`\`\`python
def my_func():
    x = 10  # Local variable
    print(x)

my_func()  # Works: prints 10
# print(x)  # ERROR! x doesn't exist here
\`\`\`

## Global Scope

Variables created outside functions are **global** - accessible everywhere:

\`\`\`python
y = 20  # Global variable

def my_func():
    print(y)  # Can access global

my_func()  # Works: prints 20
print(y)   # Works: prints 20
\`\`\`

## Shadowing

A local variable can have the same name as a global - it "shadows" the global:

\`\`\`python
x = 100  # Global

def my_func():
    x = 5   # Local - shadows global
    print(x)  # 5 (local)

my_func()
print(x)    # 100 (global unchanged)
\`\`\`

## LEGB Rule

Python looks up variables in this order:
1. **L**ocal - inside current function
2. **E**nclosing - in outer function (for nested functions)
3. **G**lobal - at module level
4. **B**uilt-in - Python's built-in names

## Can't Modify Globals (By Default)

\`\`\`python
count = 0

def increment():
    count = count + 1  # ERROR!
    # Python thinks count is local, but it's not defined yet
\`\`\`

We'll learn about the \`global\` keyword later to fix this.`,
      codeExamples: JSON.stringify([
        {
          id: "local-scope",
          title: "Local Variables",
          code: `def calculate():
    result = 42  # Local to calculate()
    print(f"Inside: {result}")

calculate()
# print(result)  # Would cause NameError`,
          description: "Local variables only exist inside the function",
        },
        {
          id: "global-access",
          title: "Accessing Global Variables",
          code: `message = "Hello, Global!"  # Global

def show_message():
    print(message)  # Can read global

show_message()
print(message)`,
          description: "Functions can read global variables",
        },
        {
          id: "shadowing",
          title: "Variable Shadowing",
          code: `name = "Global Name"

def my_func():
    name = "Local Name"  # Shadows global
    print(f"Inside: {name}")

my_func()
print(f"Outside: {name}")  # Global unchanged`,
          description: "Local variables can shadow global ones",
        },
        {
          id: "legb-demo",
          title: "LEGB Lookup",
          code: `x = "global"

def outer():
    x = "enclosing"
    
    def inner():
        x = "local"
        print(f"inner sees: {x}")
    
    inner()
    print(f"outer sees: {x}")

outer()
print(f"module sees: {x}")`,
          description: "Each scope has its own x",
        },
      ]),
      keyPoints: [
        "Local variables exist only inside their function",
        "Global variables can be read from anywhere",
        "Local variables shadow global ones with same name",
        "LEGB: Local → Enclosing → Global → Built-in",
        "Modifying globals requires special handling",
      ],
      hardwareDemo: "Watch variables in different stack frames! Local variables appear and disappear with their function's frame. Global variables persist in the global memory area.",
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 5,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_3_1.id,
        number: 1,
        title: "Local Variable",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a function that defines a local variable `secret = 42` and prints it. Then print what happens if you try to access it outside.",
        starterCode: `def reveal_secret():
    secret = 42
    print(secret)

reveal_secret()
# The variable 'secret' only exists inside the function
print("Secret is local to the function")`,
        solution: `def reveal_secret():
    secret = 42
    print(secret)

reveal_secret()
print("Secret is local to the function")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "42\nSecret is local to the function", description: "Should work" },
        ]),
        hints: [
          "secret only exists inside reveal_secret",
          "The function prints 42",
          "We can't access secret outside",
        ],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson4_3_1.id,
        number: 2,
        title: "Global Access",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a global variable `message = \"Hello\"`. Write a function that prints it. Call the function and also print the message directly.",
        starterCode: `message = "Hello"

def show_message():
    # Print the global message
    
show_message()
print(message)`,
        solution: `message = "Hello"

def show_message():
    print(message)
    
show_message()
print(message)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Hello\nHello", description: "Both should print Hello" },
        ]),
        hints: [
          "Global variables can be read inside functions",
          "Just use print(message) inside the function",
          "Both print statements access the same global",
        ],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson4_3_1.id,
        number: 3,
        title: "Shadowing",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given global x = 100, create a function that sets local x = 5 and prints it. Then print global x to show it's unchanged.",
        starterCode: `x = 100

def shadow_x():
    x = 5
    print(x)

shadow_x()
print(x)`,
        solution: `x = 100

def shadow_x():
    x = 5
    print(x)

shadow_x()
print(x)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "5\n100", description: "Local 5, global 100" },
        ]),
        hints: [
          "Inside function, x = 5 creates local variable",
          "Global x is not affected",
          "Function prints 5, outside prints 100",
        ],
        xpReward: 20,
        order: 3,
      },
    ],
  });

  console.log("✅ Created Lesson 4.3.1: Variable Scope");

  // ==================== LESSON 4.4.1: Function Specifications ====================
  const lesson4_4_1 = await prisma.lesson.upsert({
    where: { slug: "function-specifications" },
    update: {},
    create: {
      sectionId: section4_4.id,
      number: 4.41,
      title: "Function Specifications",
      slug: "function-specifications",
      objectives: [
        "Write docstrings to document functions",
        "Describe assumptions and guarantees",
        "Use type hints for clarity",
        "Follow documentation best practices",
      ],
      content: `# Function Specifications

Good code tells you **what** it does, not just **how**. **Docstrings** are Python's way of documenting functions.

## What is a Docstring?

A docstring is a string that appears right after the function definition:

\`\`\`python
def square(x):
    """Return the square of x."""
    return x * x
\`\`\`

Triple quotes allow multi-line docstrings.

## Accessing Docstrings

\`\`\`python
print(square.__doc__)  # "Return the square of x."
help(square)          # Shows formatted documentation
\`\`\`

## What to Include

A good docstring describes:
1. **What** the function does (not how)
2. **Parameters**: what each parameter means
3. **Returns**: what value is returned
4. **Assumptions**: what must be true for it to work
5. **Side effects**: any changes made outside the function

## Docstring Format

\`\`\`python
def calculate_average(numbers):
    """
    Calculate the arithmetic mean of a list of numbers.
    
    Parameters:
        numbers: A non-empty list of numbers
        
    Returns:
        The arithmetic mean as a float
        
    Raises:
        ValueError: If numbers is empty
    """
    if len(numbers) == 0:
        raise ValueError("Cannot average empty list")
    return sum(numbers) / len(numbers)
\`\`\`

## Type Hints

Python 3.5+ supports type hints for even clearer documentation:

\`\`\`python
def greet(name: str, times: int = 1) -> str:
    """Return a greeting repeated times."""
    return (f"Hello, {name}! " * times).strip()
\`\`\`

Type hints don't enforce types, but help readers (and tools) understand your code.`,
      codeExamples: JSON.stringify([
        {
          id: "simple-docstring",
          title: "Simple Docstring",
          code: `def double(x):
    """Return twice the input value."""
    return x * 2

# Access the docstring
print(double.__doc__)
print()
print(f"double(5) = {double(5)}")`,
          description: "Basic one-line docstring",
        },
        {
          id: "detailed-docstring",
          title: "Detailed Docstring",
          code: `def find_max(numbers):
    """
    Find the maximum value in a list.
    
    Parameters:
        numbers: A non-empty list of numbers
        
    Returns:
        The largest number in the list
    """
    result = numbers[0]
    for num in numbers:
        if num > result:
            result = num
    return result

print(find_max.__doc__)
print(f"Max of [3, 7, 2, 9, 1]: {find_max([3, 7, 2, 9, 1])}")`,
          description: "Multi-line docstring with details",
        },
        {
          id: "type-hints",
          title: "Type Hints",
          code: `def repeat_string(text: str, times: int = 2) -> str:
    """Return text repeated times."""
    return text * times

# Type hints don't enforce, but document intent
print(repeat_string("Hello ", 3))
print(repeat_string("Hi "))  # Uses default`,
          description: "Function with type annotations",
        },
      ]),
      keyPoints: [
        "Docstrings document what a function does",
        "Place docstring right after def line",
        "Use triple quotes for multi-line docstrings",
        "Document parameters, return value, and assumptions",
        "Type hints add clarity: def func(x: int) -> str",
      ],
      hardwareDemo: "While docstrings don't affect execution, they're stored as metadata. Watch how Python stores the __doc__ attribute alongside the function object.",
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 6,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_4_1.id,
        number: 1,
        title: "Add Docstring",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add a docstring to the `add` function that says \"Return the sum of a and b.\"",
        starterCode: `def add(a, b):
    # Add a docstring here
    return a + b

print(add.__doc__)`,
        solution: `def add(a, b):
    """Return the sum of a and b."""
    return a + b

print(add.__doc__)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Return the sum of a and b.", description: "Should show docstring" },
        ]),
        hints: [
          "Use triple quotes: \"\"\"...",
          "Put it right after the def line",
          "Before the return statement",
        ],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson4_4_1.id,
        number: 2,
        title: "Document Parameters",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function `multiply` with a docstring that documents the parameters and return value.",
        starterCode: `def multiply(a, b):
    """
    Multiply two numbers.
    
    Parameters:
        a: First number
        b: Second number
        
    Returns:
        The product of a and b
    """
    return a * b

print(multiply(4, 5))`,
        solution: `def multiply(a, b):
    """
    Multiply two numbers.
    
    Parameters:
        a: First number
        b: Second number
        
    Returns:
        The product of a and b
    """
    return a * b

print(multiply(4, 5))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "20", description: "4 * 5 = 20" },
        ]),
        hints: [
          "The docstring is provided",
          "It documents Parameters and Returns",
          "Just run to verify it works",
        ],
        xpReward: 15,
        order: 2,
      },
    ],
  });

  console.log("✅ Created Lesson 4.4.1: Function Specifications");

  // ==================== LESSON 4.5.1: Introduction to Recursion ====================
  const lesson4_5_1 = await prisma.lesson.upsert({
    where: { slug: "intro-recursion" },
    update: {},
    create: {
      sectionId: section4_5.id,
      number: 4.51,
      title: "Introduction to Recursion",
      slug: "intro-recursion",
      objectives: [
        "Understand what recursion is",
        "Identify base cases and recursive cases",
        "Trace through recursive function calls",
        "Avoid infinite recursion",
      ],
      content: `# Introduction to Recursion

**Recursion** is when a function calls itself. It's a powerful technique for solving problems that can be broken into smaller, similar subproblems.

## A Simple Example

\`\`\`python
def countdown(n):
    if n <= 0:          # Base case
        print("Blastoff!")
    else:               # Recursive case
        print(n)
        countdown(n - 1)  # Call itself with smaller n

countdown(3)
# Output: 3, 2, 1, Blastoff!
\`\`\`

## Two Essential Parts

Every recursive function needs:

1. **Base Case**: When to STOP (no more recursion)
2. **Recursive Case**: Call yourself with a SMALLER problem

Without a base case → infinite recursion → crash!

## How It Works

When \`countdown(3)\` runs:
1. \`countdown(3)\`: prints 3, calls \`countdown(2)\`
2. \`countdown(2)\`: prints 2, calls \`countdown(1)\`
3. \`countdown(1)\`: prints 1, calls \`countdown(0)\`
4. \`countdown(0)\`: base case! prints "Blastoff!", returns
5. Each call returns, "unwinding" back up

## The Call Stack

Each recursive call creates a new stack frame:

\`\`\`
countdown(3) → countdown(2) → countdown(1) → countdown(0)
   ↓              ↓              ↓              ↓
   3              2              1          Blastoff!
\`\`\`

## Why Recursion?

Some problems are naturally recursive:
- Mathematical definitions (factorial, Fibonacci)
- Tree/graph traversal
- Divide and conquer algorithms
- Problems with self-similar structure

## Hardware View

This is where recursion shines in Hardware Mode! Watch the stack grow with each call, then shrink as calls return.`,
      codeExamples: JSON.stringify([
        {
          id: "countdown-recursive",
          title: "Recursive Countdown",
          code: `def countdown(n):
    if n <= 0:
        print("Blastoff!")
    else:
        print(n)
        countdown(n - 1)

countdown(5)`,
          description: "Simple recursive countdown",
        },
        {
          id: "sum-recursive",
          title: "Recursive Sum",
          code: `def sum_to_n(n):
    """Return sum of 1 + 2 + ... + n"""
    if n <= 0:
        return 0  # Base case
    else:
        return n + sum_to_n(n - 1)  # Recursive case

print(f"Sum 1 to 5: {sum_to_n(5)}")
print(f"Sum 1 to 10: {sum_to_n(10)}")`,
          description: "Calculate sum using recursion",
        },
        {
          id: "trace-recursion",
          title: "Tracing Recursion",
          code: `def factorial(n, depth=0):
    indent = "  " * depth
    print(f"{indent}factorial({n}) called")
    
    if n <= 1:
        print(f"{indent}Base case: return 1")
        return 1
    else:
        result = n * factorial(n - 1, depth + 1)
        print(f"{indent}Returning {n} * ... = {result}")
        return result

print(f"5! = {factorial(5)}")`,
          description: "See the recursive calls and returns",
        },
      ]),
      keyPoints: [
        "Recursion = function calling itself",
        "Must have a base case to stop",
        "Must make progress toward base case",
        "Each call creates a new stack frame",
        "Great for problems with self-similar structure",
      ],
      hardwareDemo: "PERFECT for Hardware Mode! Watch the call stack grow with each recursive call, then shrink as each call returns. See how each frame has its own copy of parameters.",
      estimatedTime: 20,
      difficulty: "INTERMEDIATE",
      order: 7,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_5_1.id,
        number: 1,
        title: "Identify the Parts",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "In this countdown function, identify and run it. Watch the base case and recursive case work together.",
        starterCode: `def countdown(n):
    # Base case: when to stop
    if n <= 0:
        print("Done!")
        return
    
    # Recursive case: do something and call self
    print(n)
    countdown(n - 1)

countdown(3)`,
        solution: `def countdown(n):
    if n <= 0:
        print("Done!")
        return
    
    print(n)
    countdown(n - 1)

countdown(3)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "3\n2\n1\nDone!", description: "Should countdown" },
        ]),
        hints: [
          "Base case: n <= 0 → print Done",
          "Recursive case: print n, call with n-1",
          "Each call has smaller n, approaching base case",
        ],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson4_5_1.id,
        number: 2,
        title: "Recursive Sum",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Complete the recursive function to calculate 1 + 2 + ... + n.",
        starterCode: `def sum_to_n(n):
    if n <= 0:
        return 0
    else:
        # Return n + sum of 1 to (n-1)
        return n + sum_to_n(n - 1)

print(sum_to_n(5))  # Should be 15`,
        solution: `def sum_to_n(n):
    if n <= 0:
        return 0
    else:
        return n + sum_to_n(n - 1)

print(sum_to_n(5))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "15", description: "1+2+3+4+5=15" },
        ]),
        hints: [
          "Sum to 5 = 5 + sum to 4",
          "Sum to 4 = 4 + sum to 3",
          "... until sum to 0 = 0",
        ],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson4_5_1.id,
        number: 3,
        title: "Count Down by 2",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a recursive function that counts down by 2s: 10, 8, 6, 4, 2, Done!",
        starterCode: `def countdown_by_2(n):
    if n <= 0:
        print("Done!")
    else:
        print(n)
        # Recursive call: subtract 2 instead of 1
        
countdown_by_2(10)`,
        solution: `def countdown_by_2(n):
    if n <= 0:
        print("Done!")
    else:
        print(n)
        countdown_by_2(n - 2)
        
countdown_by_2(10)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "10\n8\n6\n4\n2\nDone!", description: "Count by 2s" },
        ]),
        hints: [
          "Same structure as regular countdown",
          "Just subtract 2 instead of 1",
          "countdown_by_2(n - 2)",
        ],
        xpReward: 20,
        order: 3,
      },
    ],
  });

  console.log("✅ Created Lesson 4.5.1: Introduction to Recursion");

  // ==================== LESSON 4.5.2: Recursive Examples ====================
  const lesson4_5_2 = await prisma.lesson.upsert({
    where: { slug: "recursive-examples" },
    update: {},
    create: {
      sectionId: section4_5.id,
      number: 4.52,
      title: "Recursive Examples",
      slug: "recursive-examples",
      objectives: [
        "Implement factorial recursively",
        "Implement Fibonacci recursively",
        "Understand recursive efficiency",
        "Compare recursive vs iterative solutions",
      ],
      content: `# Recursive Examples

Let's implement classic recursive algorithms: factorial and Fibonacci.

## Factorial

**n! = n × (n-1) × (n-2) × ... × 1**

Mathematical definition:
- 0! = 1 (base case)
- n! = n × (n-1)! (recursive case)

\`\`\`python
def factorial(n):
    if n <= 1:
        return 1
    else:
        return n * factorial(n - 1)

print(factorial(5))  # 120
\`\`\`

Trace:
- factorial(5) = 5 × factorial(4)
- factorial(4) = 4 × factorial(3)
- factorial(3) = 3 × factorial(2)
- factorial(2) = 2 × factorial(1)
- factorial(1) = 1 (base case)
- Unwind: 2×1=2, 3×2=6, 4×6=24, 5×24=120

## Fibonacci

**0, 1, 1, 2, 3, 5, 8, 13, 21, ...**

Each number is the sum of the two before it:
- fib(0) = 0, fib(1) = 1 (base cases)
- fib(n) = fib(n-1) + fib(n-2) (recursive case)

\`\`\`python
def fib(n):
    if n <= 1:
        return n
    else:
        return fib(n - 1) + fib(n - 2)
\`\`\`

## Efficiency Warning!

The recursive Fibonacci is elegant but SLOW. It recalculates the same values many times:

fib(5) calls fib(4) and fib(3)
fib(4) calls fib(3) and fib(2)
fib(3) is calculated TWICE!

For fib(40), there are billions of redundant calls!

## Recursion vs Iteration

Most recursive solutions can be written iteratively:

\`\`\`python
# Iterative factorial
def factorial_iter(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result
\`\`\`

Choose based on clarity and efficiency needs.`,
      codeExamples: JSON.stringify([
        {
          id: "factorial-recursive",
          title: "Recursive Factorial",
          code: `def factorial(n):
    if n <= 1:
        return 1
    else:
        return n * factorial(n - 1)

for i in range(8):
    print(f"{i}! = {factorial(i)}")`,
          description: "Classic recursive factorial",
        },
        {
          id: "fibonacci-recursive",
          title: "Recursive Fibonacci",
          code: `def fib(n):
    if n <= 1:
        return n
    else:
        return fib(n - 1) + fib(n - 2)

print("Fibonacci sequence:")
for i in range(12):
    print(fib(i), end=" ")`,
          description: "Classic recursive Fibonacci",
        },
        {
          id: "compare-efficiency",
          title: "Efficiency Comparison",
          code: `# Count function calls for Fibonacci
call_count = 0

def fib_counted(n):
    global call_count
    call_count += 1
    if n <= 1:
        return n
    return fib_counted(n - 1) + fib_counted(n - 2)

for n in [5, 10, 15, 20]:
    call_count = 0
    result = fib_counted(n)
    print(f"fib({n}) = {result}, calls: {call_count}")`,
          description: "See how many calls are made",
        },
        {
          id: "factorial-both",
          title: "Recursive vs Iterative",
          code: `def factorial_rec(n):
    if n <= 1:
        return 1
    return n * factorial_rec(n - 1)

def factorial_iter(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

# Both give same result
print(f"Recursive: {factorial_rec(6)}")
print(f"Iterative: {factorial_iter(6)}")`,
          description: "Two ways to compute factorial",
        },
      ]),
      keyPoints: [
        "Factorial: n! = n × (n-1)!",
        "Fibonacci: fib(n) = fib(n-1) + fib(n-2)",
        "Recursive Fibonacci is elegant but inefficient",
        "Many recursive problems can be solved iteratively",
        "Choose based on clarity vs efficiency needs",
      ],
      hardwareDemo: "Watch the stack explode with Fibonacci! Each fib() call spawns two more calls. This perfectly illustrates why naive recursion can be expensive.",
      estimatedTime: 20,
      difficulty: "INTERMEDIATE",
      order: 8,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_5_2.id,
        number: 1,
        title: "Calculate 6!",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Use the recursive factorial function to calculate 6! (factorial of 6).",
        starterCode: `def factorial(n):
    if n <= 1:
        return 1
    else:
        return n * factorial(n - 1)

result = factorial(6)
print(result)`,
        solution: `def factorial(n):
    if n <= 1:
        return 1
    else:
        return n * factorial(n - 1)

result = factorial(6)
print(result)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "720", description: "6! = 720" },
        ]),
        hints: [
          "6! = 6 × 5 × 4 × 3 × 2 × 1",
          "6! = 720",
          "Just run the code",
        ],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson4_5_2.id,
        number: 2,
        title: "Fibonacci 10th",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Find the 10th Fibonacci number (index 10) using the recursive function.",
        starterCode: `def fib(n):
    if n <= 1:
        return n
    else:
        return fib(n - 1) + fib(n - 2)

result = fib(10)
print(result)`,
        solution: `def fib(n):
    if n <= 1:
        return n
    else:
        return fib(n - 1) + fib(n - 2)

result = fib(10)
print(result)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "55", description: "fib(10) = 55" },
        ]),
        hints: [
          "Sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55",
          "Index 10 is the 11th number (starting from 0)",
          "fib(10) = 55",
        ],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson4_5_2.id,
        number: 3,
        title: "Power Function",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a recursive function `power(base, exp)` that calculates base^exp. Use: base^0 = 1, base^n = base × base^(n-1).",
        starterCode: `def power(base, exp):
    if exp == 0:
        return 1
    else:
        # Return base times power(base, exp-1)
        
print(power(2, 8))   # Should be 256
print(power(3, 4))   # Should be 81`,
        solution: `def power(base, exp):
    if exp == 0:
        return 1
    else:
        return base * power(base, exp - 1)
        
print(power(2, 8))
print(power(3, 4))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "256\n81", description: "2^8=256, 3^4=81" },
        ]),
        hints: [
          "Base case: anything^0 = 1",
          "Recursive: base^n = base × base^(n-1)",
          "return base * power(base, exp - 1)",
        ],
        xpReward: 25,
        order: 3,
      },
    ],
  });

  console.log("✅ Created Lesson 4.5.2: Recursive Examples");

  // ==================== LESSON 4.6.1: Modules and Imports ====================
  const lesson4_6_1 = await prisma.lesson.upsert({
    where: { slug: "modules-imports" },
    update: {},
    create: {
      sectionId: section4_6.id,
      number: 4.61,
      title: "Modules and Imports",
      slug: "modules-imports",
      objectives: [
        "Understand what modules are",
        "Import modules and specific functions",
        "Use the standard library",
        "Know different import styles",
      ],
      content: `# Modules and Imports

A **module** is a file containing Python code that can be reused. Python's **standard library** has hundreds of useful modules.

## Importing a Module

\`\`\`python
import math

print(math.sqrt(16))   # 4.0
print(math.pi)         # 3.14159...
\`\`\`

Use dot notation: \`module.function\` or \`module.variable\`

## Importing Specific Items

\`\`\`python
from math import sqrt, pi

print(sqrt(16))  # No need for math. prefix
print(pi)
\`\`\`

## Import with Alias

\`\`\`python
import math as m

print(m.sqrt(16))  # Use shorter name
\`\`\`

## Common Standard Library Modules

- **math**: Mathematical functions (sqrt, sin, cos, etc.)
- **random**: Random number generation
- **datetime**: Date and time handling
- **os**: Operating system interaction
- **json**: JSON encoding/decoding

## Examples

### math module
\`\`\`python
import math
print(math.sqrt(25))    # 5.0
print(math.floor(3.7))  # 3
print(math.ceil(3.2))   # 4
\`\`\`

### random module
\`\`\`python
import random
print(random.randint(1, 10))    # Random int 1-10
print(random.choice(['a', 'b', 'c']))  # Random pick
\`\`\`

## Why Use Modules?

1. **Don't reinvent the wheel**: Use tested, optimized code
2. **Organization**: Keep related code together
3. **Namespace**: Avoid name collisions
4. **Sharing**: Share code across projects`,
      codeExamples: JSON.stringify([
        {
          id: "import-math",
          title: "Using math Module",
          code: `import math

print(f"√25 = {math.sqrt(25)}")
print(f"π = {math.pi:.4f}")
print(f"floor(3.7) = {math.floor(3.7)}")
print(f"ceil(3.2) = {math.ceil(3.2)}")`,
          description: "Mathematical functions from math module",
        },
        {
          id: "from-import",
          title: "Importing Specific Functions",
          code: `from math import sqrt, pi, pow

# No need for math. prefix
print(f"√16 = {sqrt(16)}")
print(f"π = {pi:.4f}")
print(f"2³ = {pow(2, 3)}")`,
          description: "Import just what you need",
        },
        {
          id: "random-module",
          title: "Random Module",
          code: `import random

# Random integer between 1 and 10
print(f"Random 1-10: {random.randint(1, 10)}")

# Random choice from list
colors = ["red", "green", "blue"]
print(f"Random color: {random.choice(colors)}")

# Random float between 0 and 1
print(f"Random float: {random.random():.4f}")`,
          description: "Generate random values",
        },
        {
          id: "alias-import",
          title: "Import with Alias",
          code: `import math as m
import random as r

print(f"√100 = {m.sqrt(100)}")
print(f"Random: {r.randint(1, 100)}")`,
          description: "Shorter names with aliases",
        },
      ]),
      keyPoints: [
        "Modules are reusable Python files",
        "import module - access with module.name",
        "from module import name - direct access",
        "import module as alias - shorter name",
        "Standard library has hundreds of useful modules",
      ],
      hardwareDemo: "Watch module code load into memory when imported. Python caches imported modules so they're only loaded once.",
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 9,
      isPublished: true,
    },
  });

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson4_6_1.id,
        number: 1,
        title: "Use math.sqrt",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Import the math module and calculate the square root of 144.",
        starterCode: `# Import math
import math

# Calculate sqrt of 144
result = 
print(result)`,
        solution: `import math

result = math.sqrt(144)
print(result)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "12.0", description: "√144 = 12" },
        ]),
        hints: [
          "Use math.sqrt() function",
          "math.sqrt(144)",
          "Result will be 12.0 (float)",
        ],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson4_6_1.id,
        number: 2,
        title: "Import Specific",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Import only pi from math and print it rounded to 4 decimal places.",
        starterCode: `# Import just pi from math
from math import pi

# Print pi with 4 decimal places
print(f"{pi:.4f}")`,
        solution: `from math import pi

print(f"{pi:.4f}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "3.1416", description: "Pi to 4 decimals" },
        ]),
        hints: [
          "from math import pi",
          "Now pi is available directly",
          ":.4f formats to 4 decimals",
        ],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson4_6_1.id,
        number: 3,
        title: "Random Number",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Import random and generate a random integer between 1 and 100. Print it.",
        starterCode: `import random

# Generate random int 1-100
number = 
print(number)`,
        solution: `import random

number = random.randint(1, 100)
print(number)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "", description: "Any number 1-100 is valid" },
        ]),
        hints: [
          "Use random.randint(low, high)",
          "Both endpoints are included",
          "random.randint(1, 100)",
        ],
        xpReward: 15,
        order: 3,
      },
    ],
  });

  console.log("✅ Created Lesson 4.6.1: Modules and Imports");

  // Summary
  const lessonCount = await prisma.lesson.count({ where: { section: { chapter: { number: 4 } } } });
  const exerciseCount = await prisma.exercise.count({ where: { lesson: { section: { chapter: { number: 4 } } } } });

  console.log("\n📊 Chapter 4 Summary:");
  console.log(`   Lessons: ${lessonCount}`);
  console.log(`   Exercises: ${exerciseCount}`);
  console.log("\n🌱 Chapter 4 seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
