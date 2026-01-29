import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 7 Part 2: Lessons 7.1.3-7.1.5...\n");

  const section7_1 = await prisma.section.findFirst({ where: { number: 7.1 } });
  if (!section7_1) throw new Error("Section 7.1 not found.");

  // ==================== LESSON 7.1.3 ====================
  const lesson7_1_3 = await prisma.lesson.upsert({
    where: { slug: "specific-exception-types" },
    update: {},
    create: {
      sectionId: section7_1.id,
      number: 7.13,
      title: "Specific Exception Types",
      slug: "specific-exception-types",
      objectives: [
        "Know when each exception type occurs",
        "Handle ValueError for invalid values",
        "Handle TypeError for wrong types",
        "Handle collection errors (Index, Key)",
      ],
      content: `# Specific Exception Types

## ValueError

Raised when function receives **right type, wrong value**:

\`\`\`python
int("hello")    # ValueError: invalid literal
int("12.5")     # ValueError: invalid literal
math.sqrt(-1)   # ValueError: math domain error
\`\`\`

**When to expect**: User input conversion, math operations, parsing.

## TypeError

Raised when operation applied to **wrong type**:

\`\`\`python
"5" + 3         # TypeError: can only concatenate str
len(42)         # TypeError: object has no len()
"hello"[1.5]    # TypeError: indices must be integers
\`\`\`

**When to expect**: Mixed type operations, wrong argument types.

## IndexError

Raised when **sequence index out of range**:

\`\`\`python
items = [1, 2, 3]
items[10]       # IndexError: list index out of range
items[-10]      # IndexError: list index out of range
\`\`\`

**When to expect**: List/string access, loops with wrong range.

## KeyError

Raised when **dictionary key not found**:

\`\`\`python
data = {"a": 1}
data["b"]       # KeyError: 'b'
\`\`\`

**When to expect**: Dict access, JSON parsing, config files.

## FileNotFoundError

Raised when **file doesn't exist**:

\`\`\`python
open("nonexistent.txt")  # FileNotFoundError
\`\`\`

**When to expect**: File operations, reading config.

## AttributeError

Raised when **object lacks attribute/method**:

\`\`\`python
x = 5
x.append(3)     # AttributeError: 'int' has no attribute 'append'
\`\`\`

**When to expect**: Wrong variable type, typos in method names.`,
      codeExamples: JSON.stringify([
        {
          id: "value-error",
          title: "ValueError Examples",
          code: "# ValueError: right type, wrong value\n\n# Converting invalid strings\ndef safe_int_convert(s):\n    try:\n        return int(s)\n    except ValueError:\n        print(f\"Cannot convert '{s}' to integer\")\n        return None\n\nprint(safe_int_convert(\"42\"))     # Works\nprint(safe_int_convert(\"42.5\"))   # ValueError (has decimal)\nprint(safe_int_convert(\"hello\"))  # ValueError\nprint(safe_int_convert(\"\"))       # ValueError (empty)\n\n# Math operations\nimport math\n\ndef safe_sqrt(n):\n    try:\n        return math.sqrt(n)\n    except ValueError:\n        print(f\"Cannot take square root of {n}\")\n        return None\n\nprint(f\"\\nsqrt(16) = {safe_sqrt(16)}\")\nprint(f\"sqrt(-1) = {safe_sqrt(-1)}\")",
          description: "Handling ValueError",
        },
        {
          id: "type-error",
          title: "TypeError Examples",
          code: "# TypeError: wrong type for operation\n\n# String + number\ndef concat_items(a, b):\n    try:\n        return a + b\n    except TypeError as e:\n        print(f\"Cannot add {type(a).__name__} and {type(b).__name__}\")\n        return str(a) + str(b)  # Convert both to string\n\nprint(concat_items(\"Hello \", \"World\"))  # Works\nprint(concat_items(\"Count: \", 42))      # TypeError, then fixed\nprint(concat_items(10, 20))             # Works (int + int)\n\n# Wrong argument type\ndef get_length(item):\n    try:\n        return len(item)\n    except TypeError:\n        print(f\"{type(item).__name__} has no length\")\n        return None\n\nprint(f\"\\nLength of 'hello': {get_length('hello')}\")\nprint(f\"Length of [1,2,3]: {get_length([1,2,3])}\")\nprint(f\"Length of 42: {get_length(42)}\")",
          description: "Handling TypeError",
        },
        {
          id: "collection-errors",
          title: "IndexError and KeyError",
          code: "# IndexError: index out of range\ndef safe_get_index(items, index):\n    try:\n        return items[index]\n    except IndexError:\n        print(f\"Index {index} out of range (list has {len(items)} items)\")\n        return None\n\nnumbers = [10, 20, 30]\nprint(safe_get_index(numbers, 1))   # 20\nprint(safe_get_index(numbers, 10))  # IndexError\nprint(safe_get_index(numbers, -1))  # 30 (negative works!)\n\nprint()\n\n# KeyError: key not found\ndef safe_get_key(data, key, default=None):\n    try:\n        return data[key]\n    except KeyError:\n        print(f\"Key '{key}' not found\")\n        return default\n\nuser = {\"name\": \"Alice\", \"age\": 25}\nprint(safe_get_key(user, \"name\"))   # Alice\nprint(safe_get_key(user, \"email\"))  # KeyError\nprint(safe_get_key(user, \"email\", \"N/A\"))  # Returns default",
          description: "Handling collection errors",
        },
        {
          id: "file-attribute-errors",
          title: "FileNotFoundError and AttributeError",
          code: "# FileNotFoundError\ndef read_file(filename):\n    try:\n        with open(filename) as f:\n            return f.read()\n    except FileNotFoundError:\n        print(f\"File '{filename}' not found\")\n        return None\n\ncontent = read_file(\"nonexistent.txt\")\nprint(f\"Content: {content}\")\n\nprint()\n\n# AttributeError\ndef call_method(obj, method_name):\n    try:\n        method = getattr(obj, method_name)\n        return method()\n    except AttributeError:\n        print(f\"{type(obj).__name__} has no method '{method_name}'\")\n        return None\n\nprint(call_method(\"hello\", \"upper\"))   # HELLO\nprint(call_method(\"hello\", \"append\"))  # AttributeError\nprint(call_method([1,2,3], \"pop\"))     # 3\nprint(call_method(42, \"pop\"))          # AttributeError",
          description: "File and attribute errors",
        },
      ]),
      keyPoints: [
        "ValueError: right type, wrong value",
        "TypeError: wrong type for operation",
        "IndexError: list/string index out of range",
        "KeyError: dictionary key not found",
        "FileNotFoundError: file doesn't exist",
        "AttributeError: object lacks method/property",
        "Match handler to expected error type",
        "Use specific exceptions for clear handling",
      ],
      hardwareDemo: "See different exceptions raised. Watch handler selection based on type.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson7_1_3.number}: ${lesson7_1_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson7_1_3.id,
        number: 1,
        title: "Handle ValueError",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Write safe_float() that converts string to float, returning 0.0 on failure.",
        starterCode: "def safe_float(s):\n    # Convert to float, return 0.0 if ValueError\n    pass\n\nprint(safe_float(\"3.14\"))   # 3.14\nprint(safe_float(\"hello\"))  # 0.0\nprint(safe_float(\"\"))       # 0.0",
        solution: "def safe_float(s):\n    try:\n        return float(s)\n    except ValueError:\n        return 0.0\n\nprint(safe_float(\"3.14\"))\nprint(safe_float(\"hello\"))\nprint(safe_float(\"\"))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "3.14\\n0.0\\n0.0", description: "ValueError handled" }]),
        hints: ["try: float(s)", "except ValueError: return 0.0"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson7_1_3.id,
        number: 2,
        title: "Handle TypeError",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Write safe_multiply that handles type mismatches.",
        starterCode: "def safe_multiply(a, b):\n    # Multiply a * b, handle TypeError\n    pass\n\nprint(safe_multiply(3, 4))      # 12\nprint(safe_multiply(\"3\", 4))   # Should handle gracefully",
        solution: "def safe_multiply(a, b):\n    try:\n        return a * b\n    except TypeError:\n        print(f\"Cannot multiply {type(a).__name__} and {type(b).__name__}\")\n        return None\n\nprint(safe_multiply(3, 4))\nprint(safe_multiply(\"3\", 4))  # Actually works! Repeats string\nprint(safe_multiply(\"3\", \"4\"))  # TypeError",
        testCases: JSON.stringify([{ input: "", expectedOutput: "12 and handles error", description: "TypeError handled" }]),
        hints: ["String * int actually works (repeats)", "String * string raises TypeError"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson7_1_3.id,
        number: 3,
        title: "Handle IndexError",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write get_element that returns element at index, or default if out of range.",
        starterCode: "def get_element(items, index, default=None):\n    # Return items[index] or default if IndexError\n    pass\n\nnums = [10, 20, 30]\nprint(get_element(nums, 1))        # 20\nprint(get_element(nums, 10))       # None\nprint(get_element(nums, 10, -1))   # -1",
        solution: "def get_element(items, index, default=None):\n    try:\n        return items[index]\n    except IndexError:\n        return default\n\nnums = [10, 20, 30]\nprint(get_element(nums, 1))\nprint(get_element(nums, 10))\nprint(get_element(nums, 10, -1))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "20\\nNone\\n-1", description: "IndexError handled" }]),
        hints: ["try items[index]", "except IndexError: return default"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson7_1_3.id,
        number: 4,
        title: "Handle KeyError",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write get_user_info that safely accesses nested user data.",
        starterCode: "def get_user_info(user, field):\n    \"\"\"Get user field, return 'Unknown' if not found.\"\"\"\n    pass\n\nuser = {\"name\": \"Alice\", \"profile\": {\"city\": \"Boston\"}}\nprint(get_user_info(user, \"name\"))    # Alice\nprint(get_user_info(user, \"email\"))   # Unknown",
        solution: "def get_user_info(user, field):\n    try:\n        return user[field]\n    except KeyError:\n        return \"Unknown\"\n\nuser = {\"name\": \"Alice\", \"profile\": {\"city\": \"Boston\"}}\nprint(get_user_info(user, \"name\"))\nprint(get_user_info(user, \"email\"))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Alice\\nUnknown", description: "KeyError handled" }]),
        hints: ["try user[field]", "except KeyError: return 'Unknown'"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson7_1_3.id,
        number: 5,
        title: "Match Exception to Scenario",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write process_input that handles multiple exception types with appropriate messages.",
        starterCode: "def process_input(data, index, key):\n    \"\"\"\n    Access data[index][key] and convert to int.\n    Handle: IndexError, KeyError, ValueError, TypeError\n    \"\"\"\n    pass\n\ndata = [{\"value\": \"42\"}, {\"value\": \"hello\"}, {\"other\": \"10\"}]\nprint(process_input(data, 0, \"value\"))  # 42\nprint(process_input(data, 10, \"value\")) # IndexError\nprint(process_input(data, 1, \"value\"))  # ValueError (can't convert 'hello')\nprint(process_input(data, 2, \"value\"))  # KeyError",
        solution: "def process_input(data, index, key):\n    try:\n        item = data[index]\n        value = item[key]\n        return int(value)\n    except IndexError:\n        print(f\"Index {index} out of range\")\n        return None\n    except KeyError:\n        print(f\"Key '{key}' not found\")\n        return None\n    except ValueError:\n        print(f\"Cannot convert to integer\")\n        return None\n    except TypeError:\n        print(f\"Invalid type encountered\")\n        return None\n\ndata = [{\"value\": \"42\"}, {\"value\": \"hello\"}, {\"other\": \"10\"}]\nprint(process_input(data, 0, \"value\"))\nprint(process_input(data, 10, \"value\"))\nprint(process_input(data, 1, \"value\"))\nprint(process_input(data, 2, \"value\"))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "42 and three handled errors", description: "All types handled" }]),
        hints: ["Multiple except clauses", "One for each error type"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 7.1.3`);

  // ==================== LESSON 7.1.4 ====================
  const lesson7_1_4 = await prisma.lesson.upsert({
    where: { slug: "multiple-except-clauses" },
    update: {},
    create: {
      sectionId: section7_1.id,
      number: 7.14,
      title: "Multiple Except Clauses",
      slug: "multiple-except-clauses",
      objectives: [
        "Handle different exceptions differently",
        "Order exceptions from specific to general",
        "Use catch-all exceptions carefully",
        "Combine exception handling strategies",
      ],
      content: `# Multiple Except Clauses

## Why Multiple Handlers?

Different errors need different responses:
- **ValueError**: Ask user to re-enter
- **FileNotFoundError**: Use default file
- **PermissionError**: Ask for different file

## Ordering: Specific Before General

\`\`\`python
try:
    risky_code()
except ValueError:      # Specific first
    handle_value_error()
except TypeError:       # Another specific
    handle_type_error()
except Exception:       # General last (catch-all)
    handle_other()
\`\`\`

**Why?** Python checks handlers top-to-bottom. \`Exception\` catches almost everything!

## The Catch-All Handler

\`\`\`python
except Exception as e:
    print(f"Unexpected error: {e}")
    # Log it, notify admin, etc.
\`\`\`

**Use sparingly!** Catching everything can hide bugs.

## Bare Except (Avoid!)

\`\`\`python
except:  # Catches EVERYTHING including KeyboardInterrupt
    pass  # Very dangerous!
\`\`\`

This catches even system exits. Almost never use this!

## Re-raising Exceptions

Handle partially, then re-raise:

\`\`\`python
except ValueError as e:
    log_error(e)  # Log it
    raise         # Re-raise same exception
\`\`\`

## Combining Tuple and Multiple

\`\`\`python
try:
    risky_code()
except (ValueError, TypeError):
    handle_input_errors()
except FileNotFoundError:
    handle_file_error()
except Exception:
    handle_unexpected()
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "order-matters",
          title: "Order Matters",
          code: "# WRONG ORDER - Exception catches everything!\ndef bad_order(value):\n    try:\n        return int(value)\n    except Exception:  # Too general - first!\n        print(\"General handler\")\n        return -1\n    except ValueError:  # Never reached!\n        print(\"Value error\")\n        return 0\n\nprint(f\"bad_order result: {bad_order('hello')}\")\n\nprint()\n\n# RIGHT ORDER - Specific first\ndef good_order(value):\n    try:\n        return int(value)\n    except ValueError:  # Specific first\n        print(\"Value error - invalid string\")\n        return 0\n    except Exception as e:  # General last\n        print(f\"Unexpected: {e}\")\n        return -1\n\nprint(f\"good_order result: {good_order('hello')}\")",
          description: "Why order matters",
        },
        {
          id: "different-handlers",
          title: "Different Responses for Different Errors",
          code: "def read_config(filename):\n    \"\"\"Read config file with appropriate error handling.\"\"\"\n    try:\n        with open(filename) as f:\n            data = f.read()\n            return int(data.strip())\n    except FileNotFoundError:\n        print(f\"Config file '{filename}' not found, using default\")\n        return 100  # Default value\n    except PermissionError:\n        print(f\"Cannot read '{filename}' - permission denied\")\n        return None\n    except ValueError:\n        print(f\"Config file contains invalid data\")\n        return None\n\n# Test different scenarios\nprint(f\"Result: {read_config('nonexistent.txt')}\")\n\n# Create a test file\nwith open('/tmp/test_config.txt', 'w') as f:\n    f.write('42')\nprint(f\"Result: {read_config('/tmp/test_config.txt')}\")\n\nwith open('/tmp/bad_config.txt', 'w') as f:\n    f.write('not a number')\nprint(f\"Result: {read_config('/tmp/bad_config.txt')}\")",
          description: "Different handling strategies",
        },
        {
          id: "catch-all",
          title: "Using Catch-All Carefully",
          code: "import traceback\n\ndef process_data(data):\n    \"\"\"Process data with comprehensive error handling.\"\"\"\n    try:\n        # Multiple operations that could fail\n        value = data[\"value\"]\n        number = int(value)\n        result = 100 / number\n        return result\n    \n    except KeyError:\n        print(\"Missing 'value' key\")\n        return None\n    \n    except ValueError:\n        print(\"'value' is not a valid number\")\n        return None\n    \n    except ZeroDivisionError:\n        print(\"'value' cannot be zero\")\n        return None\n    \n    except Exception as e:\n        # Catch-all for truly unexpected errors\n        print(f\"Unexpected error: {type(e).__name__}: {e}\")\n        # In production, you'd log the full traceback\n        return None\n\n# Test various inputs\ntest_cases = [\n    {\"value\": \"10\"},      # Works: 10.0\n    {\"other\": \"10\"},      # KeyError\n    {\"value\": \"hello\"},   # ValueError\n    {\"value\": \"0\"},       # ZeroDivisionError\n]\n\nfor data in test_cases:\n    print(f\"Input: {data} -> Result: {process_data(data)}\")\n    print()",
          description: "Catch-all as safety net",
        },
        {
          id: "re-raising",
          title: "Re-raising Exceptions",
          code: "def validate_and_process(value):\n    \"\"\"Validate, log errors, but re-raise for caller to handle.\"\"\"\n    try:\n        number = int(value)\n        if number < 0:\n            raise ValueError(\"Number must be non-negative\")\n        return number * 2\n    \n    except ValueError as e:\n        print(f\"LOG: Invalid value '{value}': {e}\")\n        raise  # Re-raise the same exception\n\ndef main():\n    \"\"\"Top-level function handles exceptions from below.\"\"\"\n    try:\n        result = validate_and_process(\"42\")\n        print(f\"Success: {result}\")\n        \n        result = validate_and_process(\"hello\")\n        print(f\"Success: {result}\")\n        \n    except ValueError:\n        print(\"Main caught the re-raised exception!\")\n        print(\"Taking recovery action...\")\n\nmain()",
          description: "Re-raising after logging",
        },
      ]),
      keyPoints: [
        "Specific exceptions before general ones",
        "Exception catches almost everything",
        "Different errors may need different handling",
        "Use catch-all (Exception) sparingly",
        "Avoid bare except: - too dangerous",
        "raise re-raises current exception",
        "Log unexpected errors before handling",
        "Tuple syntax: except (Type1, Type2)",
      ],
      hardwareDemo: "Watch exception matching. See first matching handler execute.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 4,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson7_1_4.number}: ${lesson7_1_4.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson7_1_4.id,
        number: 1,
        title: "Fix the Order",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Fix the exception order so ValueError gets its own handler.",
        starterCode: "def convert(value):\n    try:\n        return int(value)\n    except Exception:      # Problem: too general first!\n        return \"unknown error\"\n    except ValueError:\n        return \"invalid value\"\n\nprint(convert(\"hello\"))  # Should print 'invalid value'",
        solution: "def convert(value):\n    try:\n        return int(value)\n    except ValueError:     # Specific first!\n        return \"invalid value\"\n    except Exception:\n        return \"unknown error\"\n\nprint(convert(\"hello\"))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "invalid value", description: "Order fixed" }]),
        hints: ["Put ValueError before Exception", "Specific before general"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson7_1_4.id,
        number: 2,
        title: "Multiple Handlers",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add handlers for ValueError, TypeError, and a catch-all.",
        starterCode: "def safe_operation(a, b):\n    \"\"\"Divide a by b with comprehensive handling.\"\"\"\n    try:\n        return int(a) / int(b)\n    # Add handlers for:\n    # - ValueError (bad conversion)\n    # - TypeError (wrong types)\n    # - ZeroDivisionError (b is 0)\n    # - catch-all for unexpected\n\nprint(safe_operation(\"10\", \"2\"))\nprint(safe_operation(\"ten\", \"2\"))\nprint(safe_operation(\"10\", \"0\"))",
        solution: "def safe_operation(a, b):\n    try:\n        return int(a) / int(b)\n    except ValueError:\n        print(\"Cannot convert to number\")\n        return None\n    except TypeError:\n        print(\"Wrong type provided\")\n        return None\n    except ZeroDivisionError:\n        print(\"Cannot divide by zero\")\n        return None\n    except Exception as e:\n        print(f\"Unexpected error: {e}\")\n        return None\n\nprint(safe_operation(\"10\", \"2\"))\nprint(safe_operation(\"ten\", \"2\"))\nprint(safe_operation(\"10\", \"0\"))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "5.0 and two handled errors", description: "All handlers work" }]),
        hints: ["Four except blocks", "Specific before general"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson7_1_4.id,
        number: 3,
        title: "Re-raise Exception",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Log the error then re-raise it for the caller.",
        starterCode: "def validate(value):\n    \"\"\"Validate and log errors, but re-raise.\"\"\"\n    try:\n        if not value:\n            raise ValueError(\"Value cannot be empty\")\n        return value.upper()\n    except ValueError as e:\n        # Print log message then re-raise\n        pass\n\ntry:\n    validate(\"\")\nexcept ValueError:\n    print(\"Caller caught the exception!\")",
        solution: "def validate(value):\n    try:\n        if not value:\n            raise ValueError(\"Value cannot be empty\")\n        return value.upper()\n    except ValueError as e:\n        print(f\"LOG: Validation failed: {e}\")\n        raise  # Re-raise\n\ntry:\n    validate(\"\")\nexcept ValueError:\n    print(\"Caller caught the exception!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "LOG message then caller caught", description: "Re-raise works" }]),
        hints: ["Print log message", "Use bare 'raise' to re-raise"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson7_1_4.id,
        number: 4,
        title: "Tuple Exception Handler",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Handle ValueError and TypeError together, but KeyError separately.",
        starterCode: "def get_value(data, key):\n    \"\"\"Get value and convert to int.\"\"\"\n    try:\n        return int(data[key])\n    # Handle ValueError and TypeError together\n    # Handle KeyError separately\n\nprint(get_value({\"a\": \"42\"}, \"a\"))   # 42\nprint(get_value({\"a\": \"hi\"}, \"a\"))   # ValueError\nprint(get_value({\"a\": \"42\"}, \"b\"))   # KeyError",
        solution: "def get_value(data, key):\n    try:\n        return int(data[key])\n    except (ValueError, TypeError) as e:\n        print(f\"Conversion error: {e}\")\n        return None\n    except KeyError:\n        print(f\"Key '{key}' not found\")\n        return None\n\nprint(get_value({\"a\": \"42\"}, \"a\"))\nprint(get_value({\"a\": \"hi\"}, \"a\"))\nprint(get_value({\"a\": \"42\"}, \"b\"))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "42, conversion error, key not found", description: "Grouped handlers" }]),
        hints: ["except (Type1, Type2)", "Separate except for KeyError"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson7_1_4.id,
        number: 5,
        title: "Production Error Handler",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create robust error handling that logs all errors but returns user-friendly messages.",
        starterCode: "def process_user_data(user_id, data):\n    \"\"\"\n    Process user data with production-quality error handling.\n    - Log technical details\n    - Return user-friendly messages\n    \"\"\"\n    try:\n        user = data[user_id]\n        score = int(user[\"score\"])\n        return f\"User score: {score}\"\n    # Add comprehensive handlers\n\ndata = {\n    1: {\"score\": \"100\"},\n    2: {\"score\": \"invalid\"},\n    3: {\"name\": \"Bob\"},  # Missing score\n}\nprint(process_user_data(1, data))\nprint(process_user_data(2, data))\nprint(process_user_data(3, data))\nprint(process_user_data(99, data))",
        solution: "def process_user_data(user_id, data):\n    try:\n        user = data[user_id]\n        score = int(user[\"score\"])\n        return f\"User score: {score}\"\n    except KeyError as e:\n        print(f\"LOG: Missing key {e} for user {user_id}\")\n        return \"Error: User or field not found\"\n    except ValueError as e:\n        print(f\"LOG: Invalid score format for user {user_id}: {e}\")\n        return \"Error: Invalid score format\"\n    except Exception as e:\n        print(f\"LOG: Unexpected error for user {user_id}: {type(e).__name__}: {e}\")\n        return \"Error: An unexpected error occurred\"\n\ndata = {\n    1: {\"score\": \"100\"},\n    2: {\"score\": \"invalid\"},\n    3: {\"name\": \"Bob\"},\n}\nprint(process_user_data(1, data))\nprint(process_user_data(2, data))\nprint(process_user_data(3, data))\nprint(process_user_data(99, data))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Technical logs + friendly messages", description: "Production quality" }]),
        hints: ["Log technical details", "Return simple messages to user", "Catch-all at end"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 7.1.4`);

  // ==================== LESSON 7.1.5 ====================
  const lesson7_1_5 = await prisma.lesson.upsert({
    where: { slug: "else-and-finally" },
    update: {},
    create: {
      sectionId: section7_1.id,
      number: 7.15,
      title: "Else and Finally Clauses",
      slug: "else-and-finally",
      objectives: [
        "Use else for success-only code",
        "Use finally for cleanup code",
        "Understand when each runs",
        "Combine all clauses effectively",
      ],
      content: `# Else and Finally Clauses

## The Complete Structure

\`\`\`python
try:
    risky_code()
except SomeError:
    handle_error()
else:
    success_code()    # Only if NO exception
finally:
    cleanup_code()    # ALWAYS runs
\`\`\`

## The else Clause

Runs only if **no exception** occurred:

\`\`\`python
try:
    result = int(user_input)
except ValueError:
    print("Invalid input")
else:
    print(f"Success! Got {result}")  # Only runs if no error
\`\`\`

**Why else instead of putting code in try?**
- Makes intent clear
- Code in try should only be "risky" code
- Prevents accidentally catching exceptions from success code

## The finally Clause

**ALWAYS runs**, whether or not exception occurred:

\`\`\`python
try:
    f = open("file.txt")
    data = f.read()
except FileNotFoundError:
    print("File not found")
finally:
    f.close()  # Always close the file!
\`\`\`

**Use cases**:
- Close files
- Release locks
- Close network connections
- Clean up resources

## When Each Runs

| Scenario | try | except | else | finally |
|----------|-----|--------|------|---------|
| No exception | ✓ | | ✓ | ✓ |
| Exception caught | ✓ | ✓ | | ✓ |
| Exception not caught | ✓ | | | ✓ |

**finally runs even with return!**`,
      codeExamples: JSON.stringify([
        {
          id: "else-clause",
          title: "The else Clause",
          code: "def convert_and_double(value):\n    \"\"\"Convert to int and double - show else usage.\"\"\"\n    try:\n        number = int(value)\n    except ValueError:\n        print(f\"Cannot convert '{value}'\")\n        return None\n    else:\n        # Only runs if conversion succeeded\n        print(f\"Conversion successful!\")\n        doubled = number * 2\n        return doubled\n\nprint(f\"Result: {convert_and_double('21')}\")\nprint()\nprint(f\"Result: {convert_and_double('hello')}\")\n\n# Without else, we'd have to do:\n# try:\n#     number = int(value)\n#     doubled = number * 2  # Bug: If THIS raises exception,\n#     return doubled        # it gets caught too!\n# except ValueError: ...",
          description: "Using else for success code",
        },
        {
          id: "finally-clause",
          title: "The finally Clause",
          code: "def read_file(filename):\n    \"\"\"Read file with guaranteed cleanup.\"\"\"\n    f = None\n    try:\n        f = open(filename)\n        content = f.read()\n        return content\n    except FileNotFoundError:\n        print(f\"File not found: {filename}\")\n        return None\n    finally:\n        # ALWAYS runs - cleanup guaranteed!\n        if f:\n            print(\"Closing file...\")\n            f.close()\n        print(\"Finally block completed\")\n\n# Test with existing file\nwith open('/tmp/test.txt', 'w') as f:\n    f.write('Hello!')\n\nprint(\"--- Reading existing file ---\")\nresult = read_file('/tmp/test.txt')\nprint(f\"Content: {result}\")\n\nprint(\"\\n--- Reading non-existent file ---\")\nresult = read_file('/tmp/nonexistent.txt')\nprint(f\"Content: {result}\")",
          description: "Using finally for cleanup",
        },
        {
          id: "finally-with-return",
          title: "Finally Runs Even with Return",
          code: "def test_finally():\n    try:\n        print(\"In try\")\n        return \"returned from try\"\n    finally:\n        print(\"Finally still runs!\")\n\nresult = test_finally()\nprint(f\"Result: {result}\")\n\nprint()\n\ndef test_finally_exception():\n    try:\n        print(\"In try\")\n        raise ValueError(\"oops\")\n    except ValueError:\n        print(\"In except\")\n        return \"returned from except\"\n    finally:\n        print(\"Finally still runs!\")\n\nresult = test_finally_exception()\nprint(f\"Result: {result}\")",
          description: "Finally always executes",
        },
        {
          id: "complete-structure",
          title: "Complete Try/Except/Else/Finally",
          code: "def process_file(filename):\n    \"\"\"Demonstrate complete exception handling structure.\"\"\"\n    f = None\n    try:\n        print(\"1. Attempting to open file...\")\n        f = open(filename)\n        print(\"2. Reading content...\")\n        content = f.read()\n        \n    except FileNotFoundError:\n        print(\"EXCEPT: File not found!\")\n        return None\n    \n    else:\n        # Only if try succeeded completely\n        print(\"ELSE: File read successfully!\")\n        line_count = len(content.split('\\n'))\n        return line_count\n    \n    finally:\n        # Always runs\n        print(\"FINALLY: Cleaning up...\")\n        if f:\n            f.close()\n        print(\"FINALLY: Done.\")\n\n# Create test file\nwith open('/tmp/test.txt', 'w') as f:\n    f.write('Line 1\\nLine 2\\nLine 3')\n\nprint(\"=== Success case ===\")\nresult = process_file('/tmp/test.txt')\nprint(f\"Lines: {result}\")\n\nprint(\"\\n=== Failure case ===\")\nresult = process_file('/tmp/nope.txt')\nprint(f\"Lines: {result}\")",
          description: "All four clauses working together",
        },
      ]),
      keyPoints: [
        "else: runs only if no exception",
        "finally: ALWAYS runs (cleanup)",
        "finally runs even with return",
        "finally runs even if exception not caught",
        "Use else to separate success code from risky code",
        "Use finally for cleanup (close files, etc.)",
        "Order: try -> except -> else -> finally",
        "With statement often replaces try/finally for files",
      ],
      hardwareDemo: "Trace execution through all clauses. See finally run in all scenarios.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 5,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson7_1_5.number}: ${lesson7_1_5.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson7_1_5.id,
        number: 1,
        title: "Add else Clause",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add an else clause that prints 'Conversion successful!' only when no error.",
        starterCode: "def safe_convert(value):\n    try:\n        result = int(value)\n    except ValueError:\n        print(\"Invalid value\")\n        return None\n    # Add else clause\n    return result\n\nprint(safe_convert(\"42\"))\nprint(safe_convert(\"hello\"))",
        solution: "def safe_convert(value):\n    try:\n        result = int(value)\n    except ValueError:\n        print(\"Invalid value\")\n        return None\n    else:\n        print(\"Conversion successful!\")\n        return result\n\nprint(safe_convert(\"42\"))\nprint(safe_convert(\"hello\"))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Conversion successful!\\n42\\nInvalid value\\nNone", description: "else works" }]),
        hints: ["else goes after except", "Runs only if no exception"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson7_1_5.id,
        number: 2,
        title: "Add finally Clause",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add a finally clause that always prints 'Operation complete'.",
        starterCode: "def divide(a, b):\n    try:\n        result = a / b\n        return result\n    except ZeroDivisionError:\n        print(\"Cannot divide by zero\")\n        return None\n    # Add finally\n\nprint(divide(10, 2))\nprint(divide(10, 0))",
        solution: "def divide(a, b):\n    try:\n        result = a / b\n        return result\n    except ZeroDivisionError:\n        print(\"Cannot divide by zero\")\n        return None\n    finally:\n        print(\"Operation complete\")\n\nprint(divide(10, 2))\nprint(divide(10, 0))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "'Operation complete' appears both times", description: "finally always runs" }]),
        hints: ["finally goes after except", "Runs regardless of exception"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson7_1_5.id,
        number: 3,
        title: "What Runs When?",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Predict and verify which blocks run in each scenario.",
        starterCode: "def test(value):\n    try:\n        print(\"TRY\")\n        result = 10 / value\n    except ZeroDivisionError:\n        print(\"EXCEPT\")\n        return \"error\"\n    else:\n        print(\"ELSE\")\n        return \"success\"\n    finally:\n        print(\"FINALLY\")\n\nprint(\"--- Test with 2 ---\")\nprint(f\"Result: {test(2)}\")\n\nprint(\"\\n--- Test with 0 ---\")\nprint(f\"Result: {test(0)}\")",
        solution: "def test(value):\n    try:\n        print(\"TRY\")\n        result = 10 / value\n    except ZeroDivisionError:\n        print(\"EXCEPT\")\n        return \"error\"\n    else:\n        print(\"ELSE\")\n        return \"success\"\n    finally:\n        print(\"FINALLY\")\n\n# With 2: TRY -> ELSE -> FINALLY -> success\n# With 0: TRY -> EXCEPT -> FINALLY -> error\n\nprint(\"--- Test with 2 ---\")\nprint(f\"Result: {test(2)}\")\n\nprint(\"\\n--- Test with 0 ---\")\nprint(f\"Result: {test(0)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Correct execution order shown", description: "Order verified" }]),
        hints: ["Success: try->else->finally", "Error: try->except->finally"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson7_1_5.id,
        number: 4,
        title: "File with Cleanup",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function that reads a file and guarantees the file is closed.",
        starterCode: "def count_lines(filename):\n    \"\"\"Count lines in file. Return -1 if file not found.\"\"\"\n    f = None\n    # Use try/except/finally to:\n    # - Open and read file\n    # - Handle FileNotFoundError\n    # - Always close file in finally\n    pass\n\n# Create test file\nwith open('/tmp/lines.txt', 'w') as f:\n    f.write('one\\ntwo\\nthree')\n\nprint(count_lines('/tmp/lines.txt'))   # 3\nprint(count_lines('/tmp/nope.txt'))    # -1",
        solution: "def count_lines(filename):\n    f = None\n    try:\n        f = open(filename)\n        content = f.read()\n        return len(content.split('\\n'))\n    except FileNotFoundError:\n        return -1\n    finally:\n        if f:\n            f.close()\n\nwith open('/tmp/lines.txt', 'w') as f:\n    f.write('one\\ntwo\\nthree')\n\nprint(count_lines('/tmp/lines.txt'))\nprint(count_lines('/tmp/nope.txt'))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "3\\n-1", description: "File handling correct" }]),
        hints: ["Check if f exists before closing", "finally ensures cleanup"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson7_1_5.id,
        number: 5,
        title: "Complete Structure",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement a function using try/except/else/finally for database-like operations.",
        starterCode: "# Simulated database\ndb = {\"connected\": False, \"data\": {}}\n\ndef db_operation(key, value):\n    \"\"\"\n    1. Connect to DB (try)\n    2. Handle connection errors (except)\n    3. Store data if connected (else)\n    4. Always disconnect (finally)\n    \"\"\"\n    pass\n\ndb_operation(\"user\", \"Alice\")\nprint(f\"Data: {db['data']}\")\nprint(f\"Connected: {db['connected']}\")",
        solution: "db = {\"connected\": False, \"data\": {}}\n\ndef db_operation(key, value):\n    try:\n        print(\"Connecting to database...\")\n        db[\"connected\"] = True\n        # Simulate potential error\n        if key is None:\n            raise ValueError(\"Key cannot be None\")\n    \n    except ValueError as e:\n        print(f\"Error: {e}\")\n    \n    else:\n        print(f\"Storing {key} = {value}\")\n        db[\"data\"][key] = value\n    \n    finally:\n        print(\"Disconnecting...\")\n        db[\"connected\"] = False\n\ndb_operation(\"user\", \"Alice\")\nprint(f\"Data: {db['data']}\")\nprint(f\"Connected: {db['connected']}\")\n\nprint()\ndb_operation(None, \"test\")  # Error case\nprint(f\"Connected: {db['connected']}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Data stored, always disconnected", description: "Complete structure" }]),
        hints: ["try: connect", "except: handle error", "else: do work", "finally: disconnect"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 7.1.5`);

  console.log("\n✅ Chapter 7 Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
