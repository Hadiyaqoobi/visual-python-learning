const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("📝 EXPANDING CHAPTER 1 EXERCISES");
  console.log("=".repeat(50));

  // Get all Chapter 1 lessons
  const lessons = await prisma.lesson.findMany({
    where: { section: { chapter: { number: 1 } } },
    orderBy: { order: 'asc' }
  });

  // Delete existing exercises for clean slate
  for (const lesson of lessons) {
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id } });
  }

  // ============================================================
  // LESSON 1: What is Computation?
  // ============================================================
  const lesson1 = lessons.find(l => l.slug === 'what-is-computation');
  if (lesson1) {
    console.log("\n📚 Lesson 1: What is Computation?");
    
    await prisma.exercise.createMany({
      data: [
        // WARM-UP (3)
        {
          lessonId: lesson1.id,
          number: 1,
          order: 1,
          title: "Your First Python Command",
          prompt: "Use the print() function to display 'Hello, World!' on the screen. This is traditionally the first program everyone writes!",
          type: "CODE",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: "# Type your first Python command below\n",
          solution: "print('Hello, World!')",
          hints: [
            "The print() function displays text on the screen",
            "Text must be surrounded by quotes (single ' or double \")",
            "The complete command is: print('Hello, World!')"
          ]
        },
        {
          lessonId: lesson1.id,
          number: 2,
          order: 2,
          title: "Print Your Name",
          prompt: "Use print() to display your name. Replace 'YourName' with your actual name.",
          type: "CODE",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: "# Print your name\nprint('YourName')",
          solution: "print('Alice')  # or any name",
          hints: [
            "Just change 'YourName' to your actual name",
            "Keep the quotes around your name",
            "Example: print('Alice') or print('Bob')"
          ]
        },
        {
          lessonId: lesson1.id,
          number: 3,
          order: 3,
          title: "Simple Calculation",
          prompt: "Python can work as a calculator. What will print(2 + 3) output?",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: "print(2 + 3)",
          solution: "5",
          hints: [
            "Python evaluates the expression inside print() first",
            "2 + 3 equals 5",
            "The output is simply: 5"
          ]
        },
        // CORE PRACTICE (5)
        {
          lessonId: lesson1.id,
          number: 4,
          order: 4,
          title: "Multiple Print Statements",
          prompt: "Write code that prints three lines:\nLine 1: 'Python'\nLine 2: 'is'\nLine 3: 'awesome'",
          type: "CODE",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "# Print three lines\n",
          solution: "print('Python')\nprint('is')\nprint('awesome')",
          hints: [
            "You need three separate print() statements",
            "Each print() creates a new line automatically",
            "print('Python')\\nprint('is')\\nprint('awesome')"
          ]
        },
        {
          lessonId: lesson1.id,
          number: 5,
          order: 5,
          title: "Computation vs Storage",
          prompt: "Which of these is an example of COMPUTATION (not just storage)?\nA) Saving a file to disk\nB) Calculating 15 * 7\nC) Storing your password\nD) Writing data to memory",
          type: "MULTIPLE_CHOICE",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: null,
          solution: "B) Calculating 15 * 7",
          hints: [
            "Computation means performing operations on data",
            "Storage just keeps data without changing it",
            "Calculation involves transforming data (multiplication)"
          ]
        },
        {
          lessonId: lesson1.id,
          number: 6,
          order: 6,
          title: "Print with Numbers",
          prompt: "Print the result of 10 multiplied by 5. Use the * operator for multiplication.",
          type: "CODE",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "# Print 10 times 5\n",
          solution: "print(10 * 5)",
          hints: [
            "Use * for multiplication in Python",
            "Put the calculation inside print()",
            "print(10 * 5) will output 50"
          ]
        },
        {
          lessonId: lesson1.id,
          number: 7,
          order: 7,
          title: "Algorithm Definition",
          prompt: "What is an algorithm?\nA) A type of computer\nB) A step-by-step procedure to solve a problem\nC) A programming language\nD) A computer chip",
          type: "MULTIPLE_CHOICE",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: null,
          solution: "B) A step-by-step procedure to solve a problem",
          hints: [
            "Think of a recipe - it's a series of steps",
            "Algorithms are instructions, not hardware",
            "An algorithm is a step-by-step procedure to solve a problem"
          ]
        },
        {
          lessonId: lesson1.id,
          number: 8,
          order: 8,
          title: "Order of Operations",
          prompt: "What does print(2 + 3 * 4) output? Remember math order of operations!",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "print(2 + 3 * 4)",
          solution: "14",
          hints: [
            "Python follows standard math order (PEMDAS)",
            "Multiplication happens before addition",
            "3 * 4 = 12, then 2 + 12 = 14"
          ]
        },
        // CHALLENGE (3)
        {
          lessonId: lesson1.id,
          number: 9,
          order: 9,
          title: "Forcing Order with Parentheses",
          prompt: "Modify this expression so it outputs 20 instead of 14:\nprint(2 + 3 * 4)",
          type: "CODE",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "# Change this to output 20\nprint(2 + 3 * 4)",
          solution: "print((2 + 3) * 4)",
          hints: [
            "Parentheses force operations to happen first",
            "You want 2 + 3 to happen before multiplication",
            "Wrap (2 + 3) in parentheses: print((2 + 3) * 4)"
          ]
        },
        {
          lessonId: lesson1.id,
          number: 10,
          order: 10,
          title: "Input and Output",
          prompt: "A program that takes a number and doubles it demonstrates which concepts?\nA) Only input\nB) Only output\nC) Only computation\nD) Input, computation, AND output",
          type: "MULTIPLE_CHOICE",
          difficulty: "INTERMEDIATE",
          xpReward: 10,
          starterCode: null,
          solution: "D) Input, computation, AND output",
          hints: [
            "The program receives a number (input)",
            "It doubles the number (computation)",
            "It shows the result (output) - all three!"
          ]
        },
        {
          lessonId: lesson1.id,
          number: 11,
          order: 11,
          title: "Complex Expression",
          prompt: "What is the output of: print((10 - 4) * (3 + 2))?",
          type: "PREDICT_OUTPUT",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "print((10 - 4) * (3 + 2))",
          solution: "30",
          hints: [
            "Evaluate each parenthesis first",
            "(10 - 4) = 6 and (3 + 2) = 5",
            "6 * 5 = 30"
          ]
        },
        // REAL-WORLD (3)
        {
          lessonId: lesson1.id,
          number: 12,
          order: 12,
          title: "Calculate Total Price",
          prompt: "A coffee costs $4 and you want to buy 3. Print the total cost.",
          type: "CODE",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "# Calculate total cost of 3 coffees at $4 each\n",
          solution: "print(4 * 3)",
          hints: [
            "Total = price × quantity",
            "4 dollars × 3 coffees",
            "print(4 * 3) outputs 12"
          ]
        },
        {
          lessonId: lesson1.id,
          number: 13,
          order: 13,
          title: "Rectangle Area",
          prompt: "Calculate the area of a rectangle with width 8 and height 5. Print the result.",
          type: "CODE",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "# Area = width * height\n",
          solution: "print(8 * 5)",
          hints: [
            "Area of rectangle = width × height",
            "8 × 5 = 40",
            "print(8 * 5)"
          ]
        },
        {
          lessonId: lesson1.id,
          number: 14,
          order: 14,
          title: "Temperature Conversion Intro",
          prompt: "To convert 32°F to Celsius: (F - 32) × 5/9. What does print((32 - 32) * 5 / 9) output?",
          type: "PREDICT_OUTPUT",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "print((32 - 32) * 5 / 9)",
          solution: "0.0",
          hints: [
            "First: 32 - 32 = 0",
            "Then: 0 * 5 / 9 = 0",
            "Output is 0.0 (decimal because of division)"
          ]
        }
      ]
    });
    console.log("  ✅ Added 14 exercises");
  }

  // ============================================================
  // LESSON 2: Objects and Types
  // ============================================================
  const lesson2 = lessons.find(l => l.slug === 'objects-and-types');
  if (lesson2) {
    console.log("\n📚 Lesson 2: Objects and Types");
    
    await prisma.exercise.createMany({
      data: [
        // WARM-UP (3)
        {
          lessonId: lesson2.id,
          number: 1,
          order: 1,
          title: "Identify Integer",
          prompt: "What type is the value 42?",
          type: "MULTIPLE_CHOICE",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: null,
          solution: "int (integer)",
          hints: [
            "42 is a whole number",
            "Whole numbers without decimals are integers",
            "The type is int (integer)"
          ]
        },
        {
          lessonId: lesson2.id,
          number: 2,
          order: 2,
          title: "Identify Float",
          prompt: "What type is the value 3.14?",
          type: "MULTIPLE_CHOICE",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: null,
          solution: "float",
          hints: [
            "3.14 has a decimal point",
            "Numbers with decimals are floating-point",
            "The type is float"
          ]
        },
        {
          lessonId: lesson2.id,
          number: 3,
          order: 3,
          title: "Identify String",
          prompt: "What type is the value 'Hello'?",
          type: "MULTIPLE_CHOICE",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: null,
          solution: "str (string)",
          hints: [
            "'Hello' is text in quotes",
            "Text values are called strings",
            "The type is str (string)"
          ]
        },
        // CORE PRACTICE (5)
        {
          lessonId: lesson2.id,
          number: 4,
          order: 4,
          title: "Check Type with type()",
          prompt: "Use the type() function to check the type of 100. Print the result.",
          type: "CODE",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "# Check the type of 100\n",
          solution: "print(type(100))",
          hints: [
            "type() returns the type of a value",
            "Put 100 inside type()",
            "print(type(100)) shows <class 'int'>"
          ]
        },
        {
          lessonId: lesson2.id,
          number: 5,
          order: 5,
          title: "String vs Number",
          prompt: "What is the difference between 42 and '42'?",
          type: "MULTIPLE_CHOICE",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: null,
          solution: "42 is an integer (number), '42' is a string (text)",
          hints: [
            "Look at the quotes around '42'",
            "Quotes make it text, not a number",
            "42 can do math, '42' is just text characters"
          ]
        },
        {
          lessonId: lesson2.id,
          number: 6,
          order: 6,
          title: "Boolean Type",
          prompt: "What type is the value True?",
          type: "MULTIPLE_CHOICE",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: null,
          solution: "bool (boolean)",
          hints: [
            "True and False are special values",
            "They represent yes/no, on/off",
            "The type is bool (boolean)"
          ]
        },
        {
          lessonId: lesson2.id,
          number: 7,
          order: 7,
          title: "Type of Expression Result",
          prompt: "What is the output of: print(type(10 / 2))?",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "print(type(10 / 2))",
          solution: "<class 'float'>",
          hints: [
            "Division in Python always returns a float",
            "Even 10 / 2 = 5.0, not 5",
            "The type is float"
          ]
        },
        {
          lessonId: lesson2.id,
          number: 8,
          order: 8,
          title: "Integer Division Type",
          prompt: "What is the output of: print(type(10 // 2))? Note the double slash!",
          type: "PREDICT_OUTPUT",
          difficulty: "INTERMEDIATE",
          xpReward: 10,
          starterCode: "print(type(10 // 2))",
          solution: "<class 'int'>",
          hints: [
            "// is integer division (floor division)",
            "It always returns an integer",
            "10 // 2 = 5 (int), not 5.0"
          ]
        },
        // CHALLENGE (3)
        {
          lessonId: lesson2.id,
          number: 9,
          order: 9,
          title: "Type Conversion to Integer",
          prompt: "Convert the string '123' to an integer and print it. Use int().",
          type: "CODE",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "# Convert '123' to integer\ntext = '123'\n",
          solution: "text = '123'\nprint(int(text))",
          hints: [
            "int() converts values to integers",
            "int('123') returns the number 123",
            "print(int(text)) or print(int('123'))"
          ]
        },
        {
          lessonId: lesson2.id,
          number: 10,
          order: 10,
          title: "Type Conversion to String",
          prompt: "Convert the number 456 to a string and print its type. Use str().",
          type: "CODE",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "# Convert 456 to string and print its type\n",
          solution: "print(type(str(456)))",
          hints: [
            "str() converts values to strings",
            "str(456) returns '456'",
            "print(type(str(456))) shows <class 'str'>"
          ]
        },
        {
          lessonId: lesson2.id,
          number: 11,
          order: 11,
          title: "Float to Int Conversion",
          prompt: "What does print(int(3.9)) output?",
          type: "PREDICT_OUTPUT",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "print(int(3.9))",
          solution: "3",
          hints: [
            "int() truncates (cuts off) the decimal part",
            "It does NOT round - it just removes decimals",
            "int(3.9) = 3 (not 4)"
          ]
        },
        // REAL-WORLD (3)
        {
          lessonId: lesson2.id,
          number: 12,
          order: 12,
          title: "User Age Input",
          prompt: "If a user enters their age as text '25', how would you convert it to a number for calculations?",
          type: "CODE",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "age_text = '25'\n# Convert to number and add 1 for next birthday\n",
          solution: "age_text = '25'\nage = int(age_text)\nprint(age + 1)",
          hints: [
            "User input comes as text (string)",
            "Use int() to convert to number",
            "int('25') + 1 = 26"
          ]
        },
        {
          lessonId: lesson2.id,
          number: 13,
          order: 13,
          title: "Price Display",
          prompt: "A price is stored as 19.99. Print it as part of a message: 'Price: $19.99'. Use str() to convert.",
          type: "CODE",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "price = 19.99\n# Print: Price: $19.99\n",
          solution: "price = 19.99\nprint('Price: $' + str(price))",
          hints: [
            "You can't directly add string and number",
            "Convert the number to string first",
            "'Price: $' + str(price)"
          ]
        },
        {
          lessonId: lesson2.id,
          number: 14,
          order: 14,
          title: "Data Type Validation",
          prompt: "Write code that checks if '42.5' can be converted to a float. Print the type after conversion.",
          type: "CODE",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "value = '42.5'\n# Convert and show type\n",
          solution: "value = '42.5'\nresult = float(value)\nprint(type(result))",
          hints: [
            "Use float() to convert string to float",
            "float('42.5') returns 42.5",
            "Then use type() to check"
          ]
        }
      ]
    });
    console.log("  ✅ Added 14 exercises");
  }

  // ============================================================
  // LESSON 3: Expressions and Operators
  // ============================================================
  const lesson3 = lessons.find(l => l.slug === 'expressions-and-operators');
  if (lesson3) {
    console.log("\n📚 Lesson 3: Expressions and Operators");
    
    await prisma.exercise.createMany({
      data: [
        // WARM-UP (3)
        {
          lessonId: lesson3.id,
          number: 1,
          order: 1,
          title: "Basic Addition",
          prompt: "What is the output of: print(15 + 7)?",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: "print(15 + 7)",
          solution: "22",
          hints: [
            "Simple addition",
            "15 + 7 = ?",
            "The answer is 22"
          ]
        },
        {
          lessonId: lesson3.id,
          number: 2,
          order: 2,
          title: "Basic Subtraction",
          prompt: "What is the output of: print(100 - 37)?",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: "print(100 - 37)",
          solution: "63",
          hints: [
            "Simple subtraction",
            "100 - 37 = ?",
            "The answer is 63"
          ]
        },
        {
          lessonId: lesson3.id,
          number: 3,
          order: 3,
          title: "Basic Multiplication",
          prompt: "What is the output of: print(8 * 6)?",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: "print(8 * 6)",
          solution: "48",
          hints: [
            "Use * for multiplication",
            "8 × 6 = ?",
            "The answer is 48"
          ]
        },
        // CORE PRACTICE (5)
        {
          lessonId: lesson3.id,
          number: 4,
          order: 4,
          title: "Division Operator",
          prompt: "What is the output of: print(20 / 4)?",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "print(20 / 4)",
          solution: "5.0",
          hints: [
            "Division always returns a float",
            "Even when it divides evenly",
            "20 / 4 = 5.0 (not 5)"
          ]
        },
        {
          lessonId: lesson3.id,
          number: 5,
          order: 5,
          title: "Integer Division",
          prompt: "What is the output of: print(17 // 5)?",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "print(17 // 5)",
          solution: "3",
          hints: [
            "// is integer (floor) division",
            "17 ÷ 5 = 3 remainder 2",
            "// gives just the quotient: 3"
          ]
        },
        {
          lessonId: lesson3.id,
          number: 6,
          order: 6,
          title: "Modulo Operator",
          prompt: "What is the output of: print(17 % 5)?",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "print(17 % 5)",
          solution: "2",
          hints: [
            "% gives the remainder",
            "17 ÷ 5 = 3 remainder 2",
            "17 % 5 = 2"
          ]
        },
        {
          lessonId: lesson3.id,
          number: 7,
          order: 7,
          title: "Exponentiation",
          prompt: "What is the output of: print(2 ** 5)?",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "print(2 ** 5)",
          solution: "32",
          hints: [
            "** is the power/exponent operator",
            "2 ** 5 means 2^5 (2 to the 5th power)",
            "2 × 2 × 2 × 2 × 2 = 32"
          ]
        },
        {
          lessonId: lesson3.id,
          number: 8,
          order: 8,
          title: "Combined Expression",
          prompt: "What is the output of: print(10 + 5 * 2)?",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "print(10 + 5 * 2)",
          solution: "20",
          hints: [
            "Remember order of operations (PEMDAS)",
            "Multiplication before addition",
            "5 * 2 = 10, then 10 + 10 = 20"
          ]
        },
        // CHALLENGE (4)
        {
          lessonId: lesson3.id,
          number: 9,
          order: 9,
          title: "Check if Even",
          prompt: "Write an expression that prints True if 24 is even, False otherwise. Hint: even numbers have no remainder when divided by 2.",
          type: "CODE",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "# Check if 24 is even\n",
          solution: "print(24 % 2 == 0)",
          hints: [
            "Use modulo % to check remainder",
            "Even numbers: number % 2 equals 0",
            "24 % 2 == 0 gives True"
          ]
        },
        {
          lessonId: lesson3.id,
          number: 10,
          order: 10,
          title: "Complex Calculation",
          prompt: "What is the output of: print((8 + 2) ** 2 / 5)?",
          type: "PREDICT_OUTPUT",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "print((8 + 2) ** 2 / 5)",
          solution: "20.0",
          hints: [
            "Parentheses first: 8 + 2 = 10",
            "Exponent next: 10 ** 2 = 100",
            "Division last: 100 / 5 = 20.0"
          ]
        },
        {
          lessonId: lesson3.id,
          number: 11,
          order: 11,
          title: "Negative Numbers",
          prompt: "What is the output of: print(-5 ** 2)?",
          type: "PREDICT_OUTPUT",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "print(-5 ** 2)",
          solution: "-25",
          hints: [
            "Exponent has higher precedence than negation",
            "5 ** 2 = 25, then apply negative",
            "-(5**2) = -25, NOT (-5)**2 = 25"
          ]
        },
        {
          lessonId: lesson3.id,
          number: 12,
          order: 12,
          title: "String Repetition",
          prompt: "What is the output of: print('Ha' * 3)?",
          type: "PREDICT_OUTPUT",
          difficulty: "INTERMEDIATE",
          xpReward: 10,
          starterCode: "print('Ha' * 3)",
          solution: "HaHaHa",
          hints: [
            "* can repeat strings!",
            "'Ha' repeated 3 times",
            "HaHaHa"
          ]
        },
        // REAL-WORLD (3)
        {
          lessonId: lesson3.id,
          number: 13,
          order: 13,
          title: "Calculate Tip",
          prompt: "A meal costs $45. Calculate and print a 20% tip. (Hint: 20% = 0.20)",
          type: "CODE",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "meal_cost = 45\n# Calculate 20% tip\n",
          solution: "meal_cost = 45\ntip = meal_cost * 0.20\nprint(tip)",
          hints: [
            "20% means multiply by 0.20",
            "45 * 0.20 = 9.0",
            "Or: 45 * 20 / 100"
          ]
        },
        {
          lessonId: lesson3.id,
          number: 14,
          order: 14,
          title: "Time Conversion",
          prompt: "Given 150 minutes, calculate hours and remaining minutes using // and %. Print both values.",
          type: "CODE",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "total_minutes = 150\n# Calculate hours and remaining minutes\n",
          solution: "total_minutes = 150\nhours = total_minutes // 60\nminutes = total_minutes % 60\nprint(hours)\nprint(minutes)",
          hints: [
            "// gives whole hours (150 // 60 = 2)",
            "% gives remaining minutes (150 % 60 = 30)",
            "150 minutes = 2 hours and 30 minutes"
          ]
        },
        {
          lessonId: lesson3.id,
          number: 15,
          order: 15,
          title: "Compound Interest",
          prompt: "Calculate the value of $1000 after 3 years at 5% annual interest. Formula: principal * (1 + rate) ** years",
          type: "CODE",
          difficulty: "INTERMEDIATE",
          xpReward: 20,
          starterCode: "principal = 1000\nrate = 0.05\nyears = 3\n# Calculate final amount\n",
          solution: "principal = 1000\nrate = 0.05\nyears = 3\nfinal = principal * (1 + rate) ** years\nprint(final)",
          hints: [
            "Use the compound interest formula",
            "1000 * (1.05) ** 3",
            "1000 * 1.157625 = 1157.625"
          ]
        }
      ]
    });
    console.log("  ✅ Added 15 exercises");
  }

  // ============================================================
  // LESSON 4: Variables and Assignment
  // ============================================================
  const lesson4 = lessons.find(l => l.slug === 'variables-and-assignment');
  if (lesson4) {
    console.log("\n📚 Lesson 4: Variables and Assignment");
    
    await prisma.exercise.createMany({
      data: [
        // WARM-UP (3)
        {
          lessonId: lesson4.id,
          number: 1,
          order: 1,
          title: "Create a Variable",
          prompt: "Create a variable called 'age' and assign it the value 25. Then print it.",
          type: "CODE",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: "# Create age variable\n",
          solution: "age = 25\nprint(age)",
          hints: [
            "Use = to assign values",
            "variable_name = value",
            "age = 25"
          ]
        },
        {
          lessonId: lesson4.id,
          number: 2,
          order: 2,
          title: "String Variable",
          prompt: "Create a variable called 'name' with the value 'Python'. Print it.",
          type: "CODE",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: "# Create name variable\n",
          solution: "name = 'Python'\nprint(name)",
          hints: [
            "Strings need quotes",
            "name = 'Python'",
            "Then print(name)"
          ]
        },
        {
          lessonId: lesson4.id,
          number: 3,
          order: 3,
          title: "Variable Value",
          prompt: "What is the output of this code?\nx = 10\nprint(x)",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: "x = 10\nprint(x)",
          solution: "10",
          hints: [
            "x is assigned the value 10",
            "print(x) displays the value of x",
            "Output is 10"
          ]
        },
        // CORE PRACTICE (5)
        {
          lessonId: lesson4.id,
          number: 4,
          order: 4,
          title: "Variable Reassignment",
          prompt: "What is the output?\nx = 5\nx = 10\nprint(x)",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "x = 5\nx = 10\nprint(x)",
          solution: "10",
          hints: [
            "Variables can be reassigned",
            "x first becomes 5, then 10",
            "The latest value is 10"
          ]
        },
        {
          lessonId: lesson4.id,
          number: 5,
          order: 5,
          title: "Using Variables in Calculations",
          prompt: "What is the output?\na = 7\nb = 3\nprint(a + b)",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "a = 7\nb = 3\nprint(a + b)",
          solution: "10",
          hints: [
            "Variables hold values",
            "a is 7, b is 3",
            "7 + 3 = 10"
          ]
        },
        {
          lessonId: lesson4.id,
          number: 6,
          order: 6,
          title: "Multiple Assignment",
          prompt: "Assign x, y, z to 1, 2, 3 in one line. Print their sum.",
          type: "CODE",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "# Assign x, y, z in one line\n\nprint(x + y + z)",
          solution: "x, y, z = 1, 2, 3\nprint(x + y + z)",
          hints: [
            "Python allows multiple assignment",
            "x, y, z = 1, 2, 3",
            "Sum is 6"
          ]
        },
        {
          lessonId: lesson4.id,
          number: 7,
          order: 7,
          title: "Variable Naming",
          prompt: "Which variable name is INVALID?\nA) my_var\nB) myVar\nC) 2nd_var\nD) _private",
          type: "MULTIPLE_CHOICE",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: null,
          solution: "C) 2nd_var",
          hints: [
            "Variable names cannot start with a number",
            "They can start with letters or underscore",
            "2nd_var starts with 2, which is invalid"
          ]
        },
        {
          lessonId: lesson4.id,
          number: 8,
          order: 8,
          title: "Augmented Assignment",
          prompt: "What is the output?\ncount = 5\ncount += 3\nprint(count)",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "count = 5\ncount += 3\nprint(count)",
          solution: "8",
          hints: [
            "+= means 'add and reassign'",
            "count += 3 is same as count = count + 3",
            "5 + 3 = 8"
          ]
        },
        // CHALLENGE (3)
        {
          lessonId: lesson4.id,
          number: 9,
          order: 9,
          title: "Swap Variables",
          prompt: "Swap the values of a and b without using a third variable. Print both after swapping.",
          type: "CODE",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "a = 10\nb = 20\n# Swap a and b\n\nprint(a)  # Should print 20\nprint(b)  # Should print 10",
          solution: "a = 10\nb = 20\na, b = b, a\nprint(a)\nprint(b)",
          hints: [
            "Python allows simultaneous assignment",
            "a, b = b, a swaps them",
            "This is a Python-specific trick!"
          ]
        },
        {
          lessonId: lesson4.id,
          number: 10,
          order: 10,
          title: "Variable Reference",
          prompt: "What is the output?\nx = 5\ny = x\nx = 10\nprint(y)",
          type: "PREDICT_OUTPUT",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "x = 5\ny = x\nx = 10\nprint(y)",
          solution: "5",
          hints: [
            "y = x copies the VALUE, not a reference",
            "When y = x, y becomes 5",
            "Changing x later doesn't affect y"
          ]
        },
        {
          lessonId: lesson4.id,
          number: 11,
          order: 11,
          title: "Self-Reference Calculation",
          prompt: "What is the output?\nn = 1\nn = n + n\nn = n + n\nprint(n)",
          type: "PREDICT_OUTPUT",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "n = 1\nn = n + n\nn = n + n\nprint(n)",
          solution: "4",
          hints: [
            "n starts at 1",
            "n = n + n: 1 + 1 = 2",
            "n = n + n: 2 + 2 = 4"
          ]
        },
        // REAL-WORLD (4)
        {
          lessonId: lesson4.id,
          number: 12,
          order: 12,
          title: "Shopping Cart",
          prompt: "Create variables for item_price (29.99) and quantity (3). Calculate and print the total.",
          type: "CODE",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "# Create variables and calculate total\n",
          solution: "item_price = 29.99\nquantity = 3\ntotal = item_price * quantity\nprint(total)",
          hints: [
            "Create two variables for price and quantity",
            "Multiply them for total",
            "29.99 * 3 = 89.97"
          ]
        },
        {
          lessonId: lesson4.id,
          number: 13,
          order: 13,
          title: "Temperature Tracker",
          prompt: "Store morning temperature as 68, afternoon as 75. Calculate and print the average.",
          type: "CODE",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "# Store temperatures and calculate average\n",
          solution: "morning = 68\nafternoon = 75\naverage = (morning + afternoon) / 2\nprint(average)",
          hints: [
            "Create two temperature variables",
            "Average = sum / count",
            "(68 + 75) / 2 = 71.5"
          ]
        },
        {
          lessonId: lesson4.id,
          number: 14,
          order: 14,
          title: "Bank Balance Update",
          prompt: "Start with balance = 1000. Deposit 250, then withdraw 100. Print final balance using += and -=.",
          type: "CODE",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "balance = 1000\n# Deposit 250\n# Withdraw 100\nprint(balance)",
          solution: "balance = 1000\nbalance += 250\nbalance -= 100\nprint(balance)",
          hints: [
            "+= adds to the variable",
            "-= subtracts from the variable",
            "1000 + 250 - 100 = 1150"
          ]
        },
        {
          lessonId: lesson4.id,
          number: 15,
          order: 15,
          title: "User Profile",
          prompt: "Create variables: username ('coder123'), email ('coder@email.com'), login_count (5). Increment login_count and print all.",
          type: "CODE",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "# Create user profile variables\n\n# Increment login count\n\n# Print all\n",
          solution: "username = 'coder123'\nemail = 'coder@email.com'\nlogin_count = 5\nlogin_count += 1\nprint(username)\nprint(email)\nprint(login_count)",
          hints: [
            "Create three variables with given values",
            "Use += 1 to increment login_count",
            "Print each variable"
          ]
        }
      ]
    });
    console.log("  ✅ Added 15 exercises");
  }

  // ============================================================
  // LESSON 5: Conditional Statements
  // ============================================================
  const lesson5 = lessons.find(l => l.slug === 'conditional-statements');
  if (lesson5) {
    console.log("\n📚 Lesson 5: Conditional Statements");
    
    await prisma.exercise.createMany({
      data: [
        // WARM-UP (3)
        {
          lessonId: lesson5.id,
          number: 1,
          order: 1,
          title: "Simple If",
          prompt: "What is the output?\nx = 10\nif x > 5:\n    print('Big')",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: "x = 10\nif x > 5:\n    print('Big')",
          solution: "Big",
          hints: [
            "Check: is 10 > 5?",
            "Yes, so the if block runs",
            "Output: Big"
          ]
        },
        {
          lessonId: lesson5.id,
          number: 2,
          order: 2,
          title: "If Not True",
          prompt: "What is the output?\nx = 3\nif x > 5:\n    print('Big')",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: "x = 3\nif x > 5:\n    print('Big')",
          solution: "(nothing/empty)",
          hints: [
            "Check: is 3 > 5?",
            "No, so the if block is skipped",
            "Nothing is printed"
          ]
        },
        {
          lessonId: lesson5.id,
          number: 3,
          order: 3,
          title: "Simple If-Else",
          prompt: "What is the output?\nage = 15\nif age >= 18:\n    print('Adult')\nelse:\n    print('Minor')",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 5,
          starterCode: "age = 15\nif age >= 18:\n    print('Adult')\nelse:\n    print('Minor')",
          solution: "Minor",
          hints: [
            "Is 15 >= 18? No",
            "So else block runs",
            "Output: Minor"
          ]
        },
        // CORE PRACTICE (5)
        {
          lessonId: lesson5.id,
          number: 4,
          order: 4,
          title: "Write an If Statement",
          prompt: "Write code that prints 'Positive' if number is greater than 0.",
          type: "CODE",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "number = 7\n# Your if statement here\n",
          solution: "number = 7\nif number > 0:\n    print('Positive')",
          hints: [
            "Use if condition:",
            "Check if number > 0",
            "Don't forget the colon and indentation"
          ]
        },
        {
          lessonId: lesson5.id,
          number: 5,
          order: 5,
          title: "If-Else Statement",
          prompt: "Write code that prints 'Pass' if score >= 60, otherwise 'Fail'.",
          type: "CODE",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "score = 75\n# Your if-else here\n",
          solution: "score = 75\nif score >= 60:\n    print('Pass')\nelse:\n    print('Fail')",
          hints: [
            "Use if-else structure",
            "if score >= 60: ... else: ...",
            "Remember indentation"
          ]
        },
        {
          lessonId: lesson5.id,
          number: 6,
          order: 6,
          title: "If-Elif-Else",
          prompt: "What is the output?\ngrade = 85\nif grade >= 90:\n    print('A')\nelif grade >= 80:\n    print('B')\nelse:\n    print('C')",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "grade = 85\nif grade >= 90:\n    print('A')\nelif grade >= 80:\n    print('B')\nelse:\n    print('C')",
          solution: "B",
          hints: [
            "85 >= 90? No",
            "85 >= 80? Yes!",
            "Output: B"
          ]
        },
        {
          lessonId: lesson5.id,
          number: 7,
          order: 7,
          title: "Equality Check",
          prompt: "What is the output?\ncolor = 'red'\nif color == 'blue':\n    print('Sky')\nelse:\n    print('Not sky')",
          type: "PREDICT_OUTPUT",
          difficulty: "BEGINNER",
          xpReward: 10,
          starterCode: "color = 'red'\nif color == 'blue':\n    print('Sky')\nelse:\n    print('Not sky')",
          solution: "Not sky",
          hints: [
            "== checks equality",
            "'red' == 'blue'? No",
            "else block runs"
          ]
        },
        {
          lessonId: lesson5.id,
          number: 8,
          order: 8,
          title: "Multiple Conditions with and",
          prompt: "What is the output?\nage = 25\nhas_license = True\nif age >= 18 and has_license:\n    print('Can drive')\nelse:\n    print('Cannot drive')",
          type: "PREDICT_OUTPUT",
          difficulty: "INTERMEDIATE",
          xpReward: 10,
          starterCode: "age = 25\nhas_license = True\nif age >= 18 and has_license:\n    print('Can drive')\nelse:\n    print('Cannot drive')",
          solution: "Can drive",
          hints: [
            "'and' requires BOTH conditions True",
            "25 >= 18? Yes. has_license? Yes.",
            "Both True, so 'Can drive'"
          ]
        },
        // CHALLENGE (4)
        {
          lessonId: lesson5.id,
          number: 9,
          order: 9,
          title: "Grade Calculator",
          prompt: "Write a complete grade calculator:\n90-100: A\n80-89: B\n70-79: C\n60-69: D\nBelow 60: F",
          type: "CODE",
          difficulty: "INTERMEDIATE",
          xpReward: 20,
          starterCode: "score = 73\n# Print the letter grade\n",
          solution: "score = 73\nif score >= 90:\n    print('A')\nelif score >= 80:\n    print('B')\nelif score >= 70:\n    print('C')\nelif score >= 60:\n    print('D')\nelse:\n    print('F')",
          hints: [
            "Use if-elif-elif-elif-else",
            "Start with highest grade first",
            "Each elif catches the next range"
          ]
        },
        {
          lessonId: lesson5.id,
          number: 10,
          order: 10,
          title: "Nested Conditionals",
          prompt: "What is the output?\nnum = 15\nif num > 10:\n    if num < 20:\n        print('Teen')\n    else:\n        print('Big')\nelse:\n    print('Small')",
          type: "PREDICT_OUTPUT",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "num = 15\nif num > 10:\n    if num < 20:\n        print('Teen')\n    else:\n        print('Big')\nelse:\n    print('Small')",
          solution: "Teen",
          hints: [
            "15 > 10? Yes, enter first if",
            "15 < 20? Yes, enter nested if",
            "Output: Teen"
          ]
        },
        {
          lessonId: lesson5.id,
          number: 11,
          order: 11,
          title: "Or Condition",
          prompt: "Write code that prints 'Weekend' if day is 'Saturday' or 'Sunday', else 'Weekday'.",
          type: "CODE",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "day = 'Saturday'\n# Your code here\n",
          solution: "day = 'Saturday'\nif day == 'Saturday' or day == 'Sunday':\n    print('Weekend')\nelse:\n    print('Weekday')",
          hints: [
            "'or' requires at least ONE condition True",
            "Check both Saturday and Sunday",
            "day == 'Saturday' or day == 'Sunday'"
          ]
        },
        {
          lessonId: lesson5.id,
          number: 12,
          order: 12,
          title: "Not Operator",
          prompt: "What is the output?\nis_raining = False\nif not is_raining:\n    print('Go outside')\nelse:\n    print('Stay inside')",
          type: "PREDICT_OUTPUT",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "is_raining = False\nif not is_raining:\n    print('Go outside')\nelse:\n    print('Stay inside')",
          solution: "Go outside",
          hints: [
            "'not' flips True/False",
            "not False = True",
            "Condition is True, so 'Go outside'"
          ]
        },
        // REAL-WORLD (4)
        {
          lessonId: lesson5.id,
          number: 13,
          order: 13,
          title: "Ticket Pricing",
          prompt: "Movie tickets: Children (under 12): $8, Adults (12-64): $12, Seniors (65+): $10. Write code to print the price.",
          type: "CODE",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "age = 45\n# Print ticket price\n",
          solution: "age = 45\nif age < 12:\n    print(8)\nelif age < 65:\n    print(12)\nelse:\n    print(10)",
          hints: [
            "Check age ranges in order",
            "Under 12, then under 65, then 65+",
            "Use if-elif-else"
          ]
        },
        {
          lessonId: lesson5.id,
          number: 14,
          order: 14,
          title: "Login Validation",
          prompt: "Check if username is 'admin' AND password is 'secret123'. Print 'Access granted' or 'Access denied'.",
          type: "CODE",
          difficulty: "INTERMEDIATE",
          xpReward: 15,
          starterCode: "username = 'admin'\npassword = 'secret123'\n# Check login\n",
          solution: "username = 'admin'\npassword = 'secret123'\nif username == 'admin' and password == 'secret123':\n    print('Access granted')\nelse:\n    print('Access denied')",
          hints: [
            "Both conditions must be True",
            "Use 'and' to combine checks",
            "== for string comparison"
          ]
        },
        {
          lessonId: lesson5.id,
          number: 15,
          order: 15,
          title: "Shipping Calculator",
          prompt: "Free shipping if order >= 50 OR customer is premium member. Print 'Free shipping' or the $5.99 fee.",
          type: "CODE",
          difficulty: "INTERMEDIATE",
          xpReward: 20,
          starterCode: "order_total = 35\nis_premium = True\n# Calculate shipping\n",
          solution: "order_total = 35\nis_premium = True\nif order_total >= 50 or is_premium:\n    print('Free shipping')\nelse:\n    print(5.99)",
          hints: [
            "Either condition gives free shipping",
            "Use 'or' to combine",
            "35 < 50 but is_premium is True, so free"
          ]
        }
      ]
    });
    console.log("  ✅ Added 15 exercises");
  }

  // Summary
  const totalExercises = await prisma.exercise.count({
    where: { lesson: { section: { chapter: { number: 1 } } } }
  });
  
  console.log("\n" + "=".repeat(50));
  console.log(`✅ Chapter 1 now has ${totalExercises} exercises!`);
  console.log("=".repeat(50));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
