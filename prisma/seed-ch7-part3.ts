import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 7 Part 3: Lessons 7.2.1-7.2.2...\n");

  const section7_2 = await prisma.section.findFirst({ where: { number: 7.2 } });
  if (!section7_2) throw new Error("Section 7.2 not found.");

  // ==================== LESSON 7.2.1 ====================
  const lesson7_2_1 = await prisma.lesson.upsert({
    where: { slug: "raising-exceptions" },
    update: {},
    create: {
      sectionId: section7_2.id,
      number: 7.21,
      title: "Raising Exceptions",
      slug: "raising-exceptions",
      objectives: [
        "Use raise to signal errors",
        "Choose appropriate exception types",
        "Write helpful error messages",
        "Know when to raise vs return",
      ],
      content: `# Raising Exceptions

## The raise Statement

Signal an error condition:

\`\`\`python
raise ValueError("Age cannot be negative")
\`\`\`

When raised, exception propagates up until caught.

## Why Raise Exceptions?

Instead of returning error values:

\`\`\`python
# Bad: Caller might forget to check
def get_age(data):
    if "age" not in data:
        return -1  # Error? Or valid age of -1?

# Good: Can't be ignored
def get_age(data):
    if "age" not in data:
        raise KeyError("Missing 'age' field")
    return data["age"]
\`\`\`

## Choosing Exception Types

Match the type to the error:

| Error | Exception Type |
|-------|---------------|
| Invalid value | ValueError |
| Wrong type | TypeError |
| Missing key | KeyError |
| Index out of range | IndexError |
| Invalid operation | RuntimeError |
| Not implemented | NotImplementedError |

## Writing Good Error Messages

\`\`\`python
# Bad: Unhelpful
raise ValueError("invalid")

# Good: Specific and actionable
raise ValueError(f"Age must be 0-150, got {age}")
\`\`\`

Include:
- What was expected
- What was received
- How to fix it (if possible)

## raise vs return

- **return**: Normal result (even if "no result")
- **raise**: Something went wrong

\`\`\`python
def find_user(user_id):
    user = database.get(user_id)
    if user is None:
        raise ValueError(f"User {user_id} not found")
    return user
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-raise",
          title: "Basic raise Statement",
          code: "def set_age(age):\n    \"\"\"Set age with validation.\"\"\"\n    if age < 0:\n        raise ValueError(\"Age cannot be negative\")\n    if age > 150:\n        raise ValueError(\"Age cannot exceed 150\")\n    print(f\"Age set to {age}\")\n    return age\n\n# Valid age\nset_age(25)\n\n# Invalid ages\ntry:\n    set_age(-5)\nexcept ValueError as e:\n    print(f\"Error: {e}\")\n\ntry:\n    set_age(200)\nexcept ValueError as e:\n    print(f\"Error: {e}\")",
          description: "Raising exceptions for invalid input",
        },
        {
          id: "choose-type",
          title: "Choosing Exception Types",
          code: "def process_data(data):\n    \"\"\"Process data with appropriate exception types.\"\"\"\n    \n    # TypeError: wrong type\n    if not isinstance(data, dict):\n        raise TypeError(f\"Expected dict, got {type(data).__name__}\")\n    \n    # KeyError: missing required key\n    if \"id\" not in data:\n        raise KeyError(\"Missing required field 'id'\")\n    \n    # ValueError: invalid value\n    if data[\"id\"] < 0:\n        raise ValueError(f\"ID must be positive, got {data['id']}\")\n    \n    return f\"Processed: {data['id']}\"\n\n# Test each error type\ntest_cases = [\n    {\"id\": 42},           # Valid\n    \"not a dict\",         # TypeError\n    {\"name\": \"Alice\"},    # KeyError\n    {\"id\": -5},           # ValueError\n]\n\nfor data in test_cases:\n    try:\n        print(process_data(data))\n    except (TypeError, KeyError, ValueError) as e:\n        print(f\"{type(e).__name__}: {e}\")",
          description: "Different exceptions for different errors",
        },
        {
          id: "good-messages",
          title: "Writing Helpful Error Messages",
          code: "def validate_email(email):\n    \"\"\"Validate email with helpful error messages.\"\"\"\n    if not isinstance(email, str):\n        raise TypeError(\n            f\"Email must be a string, got {type(email).__name__}\"\n        )\n    \n    if not email:\n        raise ValueError(\"Email cannot be empty\")\n    \n    if \"@\" not in email:\n        raise ValueError(\n            f\"Email must contain '@', got '{email}'\"\n        )\n    \n    if email.count(\"@\") > 1:\n        raise ValueError(\n            f\"Email must have exactly one '@', found {email.count('@')}\"\n        )\n    \n    local, domain = email.split(\"@\")\n    if not domain or \".\" not in domain:\n        raise ValueError(\n            f\"Invalid domain '{domain}' - must contain '.'\"\n        )\n    \n    return True\n\n# Test with various inputs\ntest_emails = [\n    \"user@example.com\",   # Valid\n    \"\",                    # Empty\n    \"no-at-sign\",         # Missing @\n    \"two@@signs\",         # Multiple @\n    \"user@nodot\",         # Invalid domain\n]\n\nfor email in test_emails:\n    try:\n        validate_email(email)\n        print(f\"✓ '{email}' is valid\")\n    except ValueError as e:\n        print(f\"✗ {e}\")",
          description: "Specific, actionable error messages",
        },
        {
          id: "raise-vs-return",
          title: "raise vs return",
          code: "# BAD: Using return for errors\ndef find_user_bad(users, user_id):\n    for user in users:\n        if user[\"id\"] == user_id:\n            return user\n    return None  # Error? Or user is None?\n\n# GOOD: Using raise for errors\ndef find_user_good(users, user_id):\n    for user in users:\n        if user[\"id\"] == user_id:\n            return user\n    raise ValueError(f\"User {user_id} not found\")\n\nusers = [\n    {\"id\": 1, \"name\": \"Alice\"},\n    {\"id\": 2, \"name\": \"Bob\"},\n]\n\n# Bad way - easy to forget check\nuser = find_user_bad(users, 99)\nif user:  # What if we forget this check?\n    print(user[\"name\"])\n\n# Good way - can't ignore the error\ntry:\n    user = find_user_good(users, 99)\n    print(user[\"name\"])\nexcept ValueError as e:\n    print(f\"Error: {e}\")",
          description: "When to raise vs return",
        },
      ]),
      keyPoints: [
        "raise ExceptionType(message) signals error",
        "Match exception type to error kind",
        "Write specific, helpful error messages",
        "Include what was expected vs received",
        "raise for errors, return for normal results",
        "Exceptions can't be silently ignored",
        "Exceptions propagate until caught",
        "Common types: ValueError, TypeError, KeyError",
      ],
      hardwareDemo: "Watch raise create exception object. See it propagate up call stack.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson7_2_1.number}: ${lesson7_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson7_2_1.id,
        number: 1,
        title: "Basic raise",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add validation that raises ValueError if percentage is not 0-100.",
        starterCode: "def set_percentage(value):\n    # Raise ValueError if not 0-100\n    return value\n\nprint(set_percentage(50))\ntry:\n    set_percentage(150)\nexcept ValueError as e:\n    print(f\"Caught: {e}\")",
        solution: "def set_percentage(value):\n    if value < 0 or value > 100:\n        raise ValueError(f\"Percentage must be 0-100, got {value}\")\n    return value\n\nprint(set_percentage(50))\ntry:\n    set_percentage(150)\nexcept ValueError as e:\n    print(f\"Caught: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "50\\nCaught: Percentage must be 0-100", description: "Validation works" }]),
        hints: ["Check if value < 0 or value > 100", "Include the bad value in message"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson7_2_1.id,
        number: 2,
        title: "Choose Exception Type",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Raise TypeError for non-string, ValueError for empty string.",
        starterCode: "def validate_name(name):\n    # TypeError if not string\n    # ValueError if empty\n    return name.strip()\n\nprint(validate_name(\"  Alice  \"))\ntry:\n    validate_name(123)\nexcept TypeError as e:\n    print(f\"TypeError: {e}\")\ntry:\n    validate_name(\"\")\nexcept ValueError as e:\n    print(f\"ValueError: {e}\")",
        solution: "def validate_name(name):\n    if not isinstance(name, str):\n        raise TypeError(f\"Name must be string, got {type(name).__name__}\")\n    if not name.strip():\n        raise ValueError(\"Name cannot be empty\")\n    return name.strip()\n\nprint(validate_name(\"  Alice  \"))\ntry:\n    validate_name(123)\nexcept TypeError as e:\n    print(f\"TypeError: {e}\")\ntry:\n    validate_name(\"\")\nexcept ValueError as e:\n    print(f\"ValueError: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Alice then both errors", description: "Correct types raised" }]),
        hints: ["isinstance(name, str) checks type", "name.strip() handles whitespace"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson7_2_1.id,
        number: 3,
        title: "Helpful Message",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write validate_password with specific error messages for each rule.",
        starterCode: "def validate_password(password):\n    \"\"\"Password must be:\n    - At least 8 characters\n    - Contain at least one digit\n    \"\"\"\n    # Add validation with helpful messages\n    return True\n\ntest_passwords = [\"secret\", \"longenough\", \"valid123\"]\nfor pwd in test_passwords:\n    try:\n        validate_password(pwd)\n        print(f\"✓ '{pwd}' is valid\")\n    except ValueError as e:\n        print(f\"✗ {e}\")",
        solution: "def validate_password(password):\n    if len(password) < 8:\n        raise ValueError(\n            f\"Password must be at least 8 characters, got {len(password)}\"\n        )\n    if not any(c.isdigit() for c in password):\n        raise ValueError(\n            \"Password must contain at least one digit\"\n        )\n    return True\n\ntest_passwords = [\"secret\", \"longenough\", \"valid123\"]\nfor pwd in test_passwords:\n    try:\n        validate_password(pwd)\n        print(f\"✓ '{pwd}' is valid\")\n    except ValueError as e:\n        print(f\"✗ {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Two failures, one success", description: "Messages are helpful" }]),
        hints: ["len(password) for length", "any(c.isdigit() for c in password)"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson7_2_1.id,
        number: 4,
        title: "raise vs return",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Convert this function from return-based to exception-based error handling.",
        starterCode: "def divide_bad(a, b):\n    \"\"\"Returns None on error - easy to miss!\"\"\"\n    if b == 0:\n        return None\n    return a / b\n\n# Convert to use exceptions instead\ndef divide_good(a, b):\n    pass\n\n# Test\ntry:\n    print(divide_good(10, 2))\n    print(divide_good(10, 0))\nexcept ZeroDivisionError as e:\n    print(f\"Error: {e}\")",
        solution: "def divide_bad(a, b):\n    if b == 0:\n        return None\n    return a / b\n\ndef divide_good(a, b):\n    if b == 0:\n        raise ZeroDivisionError(\"Cannot divide by zero\")\n    return a / b\n\ntry:\n    print(divide_good(10, 2))\n    print(divide_good(10, 0))\nexcept ZeroDivisionError as e:\n    print(f\"Error: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "5.0\\nError: Cannot divide by zero", description: "Uses exceptions" }]),
        hints: ["raise instead of return None", "ZeroDivisionError is appropriate"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson7_2_1.id,
        number: 5,
        title: "Complete Validation",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write validate_user that checks all fields with appropriate exceptions.",
        starterCode: "def validate_user(user):\n    \"\"\"\n    Validate user dict:\n    - Must be a dict (TypeError)\n    - Must have 'name' key (KeyError)\n    - 'name' must be non-empty string (ValueError)\n    - If 'age' present, must be 0-150 (ValueError)\n    \"\"\"\n    pass\n\ntest_cases = [\n    {\"name\": \"Alice\", \"age\": 25},  # Valid\n    \"not a dict\",                    # TypeError\n    {\"age\": 25},                     # KeyError\n    {\"name\": \"\"},                    # ValueError\n    {\"name\": \"Bob\", \"age\": -5},     # ValueError\n]\n\nfor user in test_cases:\n    try:\n        validate_user(user)\n        print(f\"✓ Valid: {user}\")\n    except (TypeError, KeyError, ValueError) as e:\n        print(f\"✗ {type(e).__name__}: {e}\")",
        solution: "def validate_user(user):\n    if not isinstance(user, dict):\n        raise TypeError(f\"User must be dict, got {type(user).__name__}\")\n    \n    if \"name\" not in user:\n        raise KeyError(\"Missing required field 'name'\")\n    \n    if not isinstance(user[\"name\"], str) or not user[\"name\"].strip():\n        raise ValueError(\"Name must be non-empty string\")\n    \n    if \"age\" in user:\n        age = user[\"age\"]\n        if not isinstance(age, int) or age < 0 or age > 150:\n            raise ValueError(f\"Age must be 0-150, got {age}\")\n    \n    return True\n\ntest_cases = [\n    {\"name\": \"Alice\", \"age\": 25},\n    \"not a dict\",\n    {\"age\": 25},\n    {\"name\": \"\"},\n    {\"name\": \"Bob\", \"age\": -5},\n]\n\nfor user in test_cases:\n    try:\n        validate_user(user)\n        print(f\"✓ Valid: {user}\")\n    except (TypeError, KeyError, ValueError) as e:\n        print(f\"✗ {type(e).__name__}: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "One valid, four errors", description: "Complete validation" }]),
        hints: ["Check type first", "Check required keys", "Validate values last"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 7.2.1`);

  // ==================== LESSON 7.2.2 ====================
  const lesson7_2_2 = await prisma.lesson.upsert({
    where: { slug: "custom-exceptions" },
    update: {},
    create: {
      sectionId: section7_2.id,
      number: 7.22,
      title: "Custom Exceptions",
      slug: "custom-exceptions",
      objectives: [
        "Create custom exception classes",
        "Inherit from Exception properly",
        "Add custom attributes to exceptions",
        "Know when to create custom exceptions",
      ],
      content: `# Custom Exceptions

## Why Custom Exceptions?

Built-in exceptions are generic. Custom exceptions:
- Have **meaningful names** for your domain
- Can carry **extra information**
- Allow **specific handling** of your errors

## Creating Custom Exceptions

Simple custom exception:

\`\`\`python
class ValidationError(Exception):
    """Raised when validation fails."""
    pass
\`\`\`

Usage:
\`\`\`python
raise ValidationError("Invalid email format")
\`\`\`

## Naming Conventions

- End with **Error** or **Exception**
- Be specific: \`InsufficientFundsError\`, not \`BankError\`
- Match your domain: \`InvalidMoveError\` for a game

## Adding Custom Attributes

\`\`\`python
class ValidationError(Exception):
    def __init__(self, message, field_name):
        super().__init__(message)
        self.field_name = field_name

try:
    raise ValidationError("Invalid email", "email")
except ValidationError as e:
    print(f"Error in field '{e.field_name}': {e}")
\`\`\`

## Exception Hierarchies

Create a base exception for your application:

\`\`\`python
class AppError(Exception):
    """Base exception for our app."""
    pass

class ValidationError(AppError):
    pass

class DatabaseError(AppError):
    pass
\`\`\`

Catch all app errors: \`except AppError\`

## When to Create Custom Exceptions

- Error is **specific to your domain**
- Need to **carry extra data**
- Want to **distinguish** from built-in errors
- Building a **library** for others to use`,
      codeExamples: JSON.stringify([
        {
          id: "simple-custom",
          title: "Simple Custom Exception",
          code: "class InsufficientFundsError(Exception):\n    \"\"\"Raised when account has insufficient funds.\"\"\"\n    pass\n\nclass Account:\n    def __init__(self, balance):\n        self.balance = balance\n    \n    def withdraw(self, amount):\n        if amount > self.balance:\n            raise InsufficientFundsError(\n                f\"Cannot withdraw ${amount}, only ${self.balance} available\"\n            )\n        self.balance -= amount\n        return amount\n\n# Usage\naccount = Account(100)\n\ntry:\n    account.withdraw(50)\n    print(f\"Withdrew $50, balance: ${account.balance}\")\n    \n    account.withdraw(100)  # Too much!\nexcept InsufficientFundsError as e:\n    print(f\"Transaction failed: {e}\")",
          description: "Basic custom exception",
        },
        {
          id: "custom-attributes",
          title: "Custom Exception with Attributes",
          code: "class ValidationError(Exception):\n    \"\"\"Raised when validation fails.\"\"\"\n    \n    def __init__(self, message, field, value=None):\n        super().__init__(message)\n        self.field = field\n        self.value = value\n\ndef validate_user(data):\n    if not data.get(\"email\"):\n        raise ValidationError(\n            \"Email is required\",\n            field=\"email\"\n        )\n    \n    email = data[\"email\"]\n    if \"@\" not in email:\n        raise ValidationError(\n            \"Invalid email format\",\n            field=\"email\",\n            value=email\n        )\n    \n    age = data.get(\"age\")\n    if age is not None and age < 0:\n        raise ValidationError(\n            \"Age must be non-negative\",\n            field=\"age\",\n            value=age\n        )\n\n# Usage with attribute access\ntest_data = [\n    {\"email\": \"test@example.com\", \"age\": 25},\n    {\"email\": \"\"},\n    {\"email\": \"invalid-email\"},\n    {\"email\": \"test@test.com\", \"age\": -5},\n]\n\nfor data in test_data:\n    try:\n        validate_user(data)\n        print(f\"✓ Valid: {data}\")\n    except ValidationError as e:\n        print(f\"✗ Field '{e.field}': {e}\")\n        if e.value is not None:\n            print(f\"  Got value: {e.value}\")",
          description: "Exception with extra data",
        },
        {
          id: "exception-hierarchy",
          title: "Exception Hierarchy",
          code: "# Base exception for our app\nclass GameError(Exception):\n    \"\"\"Base exception for game errors.\"\"\"\n    pass\n\n# Specific game errors\nclass InvalidMoveError(GameError):\n    \"\"\"Raised when a move is invalid.\"\"\"\n    def __init__(self, message, position=None):\n        super().__init__(message)\n        self.position = position\n\nclass GameOverError(GameError):\n    \"\"\"Raised when game is already over.\"\"\"\n    pass\n\nclass OutOfBoundsError(GameError):\n    \"\"\"Raised when position is out of bounds.\"\"\"\n    pass\n\n# Game logic\ndef make_move(board, position):\n    if position < 0 or position > 8:\n        raise OutOfBoundsError(f\"Position must be 0-8, got {position}\")\n    if board[position] != \" \":\n        raise InvalidMoveError(\"Position already taken\", position)\n    return True\n\n# Can catch all game errors or specific ones\nboard = [\" \"] * 9\nboard[4] = \"X\"  # Center taken\n\nmoves = [4, 10, 0]\nfor pos in moves:\n    try:\n        make_move(board, pos)\n        print(f\"Move to {pos} succeeded\")\n    except InvalidMoveError as e:\n        print(f\"Invalid: {e} (position {e.position})\")\n    except OutOfBoundsError as e:\n        print(f\"Out of bounds: {e}\")\n    except GameError as e:\n        print(f\"Game error: {e}\")",
          description: "Hierarchy of custom exceptions",
        },
        {
          id: "when-to-use",
          title: "When to Use Custom Exceptions",
          code: "# GOOD: Domain-specific exception with extra info\nclass APIError(Exception):\n    def __init__(self, message, status_code, response=None):\n        super().__init__(message)\n        self.status_code = status_code\n        self.response = response\n\ndef call_api(endpoint):\n    # Simulated API call\n    if endpoint == \"/users\":\n        return {\"users\": []}\n    elif endpoint == \"/error\":\n        raise APIError(\n            \"Server error\",\n            status_code=500,\n            response={\"error\": \"Internal error\"}\n        )\n    else:\n        raise APIError(\n            \"Not found\",\n            status_code=404\n        )\n\nendpoints = [\"/users\", \"/unknown\", \"/error\"]\n\nfor endpoint in endpoints:\n    try:\n        result = call_api(endpoint)\n        print(f\"✓ {endpoint}: {result}\")\n    except APIError as e:\n        print(f\"✗ {endpoint}: {e.status_code} - {e}\")\n        if e.response:\n            print(f\"  Response: {e.response}\")",
          description: "Practical custom exception use",
        },
      ]),
      keyPoints: [
        "Inherit from Exception class",
        "Name ends with Error or Exception",
        "Call super().__init__(message)",
        "Add custom attributes in __init__",
        "Create hierarchy with base app exception",
        "Use for domain-specific errors",
        "Carry extra data (field name, code, etc.)",
        "Keep exceptions simple and focused",
      ],
      hardwareDemo: "See custom exception class inherit from Exception. Watch custom attributes stored.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson7_2_2.number}: ${lesson7_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson7_2_2.id,
        number: 1,
        title: "Simple Custom Exception",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create NegativeNumberError and use it in a square root function.",
        starterCode: "# Create NegativeNumberError\n\nimport math\n\ndef safe_sqrt(n):\n    # Raise NegativeNumberError if n < 0\n    return math.sqrt(n)\n\nprint(safe_sqrt(16))\ntry:\n    safe_sqrt(-4)\nexcept NegativeNumberError as e:\n    print(f\"Error: {e}\")",
        solution: "class NegativeNumberError(Exception):\n    \"\"\"Raised when a negative number is not allowed.\"\"\"\n    pass\n\nimport math\n\ndef safe_sqrt(n):\n    if n < 0:\n        raise NegativeNumberError(f\"Cannot take square root of {n}\")\n    return math.sqrt(n)\n\nprint(safe_sqrt(16))\ntry:\n    safe_sqrt(-4)\nexcept NegativeNumberError as e:\n    print(f\"Error: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "4.0\\nError: Cannot take square root of -4", description: "Custom exception works" }]),
        hints: ["class Name(Exception): pass", "raise NegativeNumberError(message)"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson7_2_2.id,
        number: 2,
        title: "Exception with Attribute",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create RangeError with min_val, max_val, and actual attributes.",
        starterCode: "class RangeError(Exception):\n    # Add min_val, max_val, actual attributes\n    pass\n\ndef validate_score(score):\n    if score < 0 or score > 100:\n        raise RangeError(\n            f\"Score out of range\",\n            min_val=0,\n            max_val=100,\n            actual=score\n        )\n    return score\n\ntry:\n    validate_score(150)\nexcept RangeError as e:\n    print(f\"Error: {e}\")\n    print(f\"Range: {e.min_val}-{e.max_val}, got: {e.actual}\")",
        solution: "class RangeError(Exception):\n    def __init__(self, message, min_val, max_val, actual):\n        super().__init__(message)\n        self.min_val = min_val\n        self.max_val = max_val\n        self.actual = actual\n\ndef validate_score(score):\n    if score < 0 or score > 100:\n        raise RangeError(\n            f\"Score out of range\",\n            min_val=0,\n            max_val=100,\n            actual=score\n        )\n    return score\n\ntry:\n    validate_score(150)\nexcept RangeError as e:\n    print(f\"Error: {e}\")\n    print(f\"Range: {e.min_val}-{e.max_val}, got: {e.actual}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Error with range info", description: "Attributes accessible" }]),
        hints: ["def __init__(self, message, min_val, max_val, actual)", "super().__init__(message)"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson7_2_2.id,
        number: 3,
        title: "Exception Hierarchy",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create BankError base with InsufficientFundsError and InvalidAccountError.",
        starterCode: "# Create hierarchy:\n# BankError (base)\n#   InsufficientFundsError\n#   InvalidAccountError\n\nclass BankError(Exception):\n    pass\n\n# Add the two specific errors\n\ndef withdraw(account_id, amount, accounts):\n    if account_id not in accounts:\n        raise InvalidAccountError(f\"Account {account_id} not found\")\n    if accounts[account_id] < amount:\n        raise InsufficientFundsError(\n            f\"Need ${amount}, have ${accounts[account_id]}\"\n        )\n    accounts[account_id] -= amount\n    return amount\n\naccounts = {\"A001\": 100}\n\nfor acc, amt in [(\"A001\", 50), (\"A001\", 100), (\"A002\", 10)]:\n    try:\n        withdraw(acc, amt, accounts)\n        print(f\"Withdrew ${amt} from {acc}\")\n    except BankError as e:\n        print(f\"{type(e).__name__}: {e}\")",
        solution: "class BankError(Exception):\n    pass\n\nclass InsufficientFundsError(BankError):\n    pass\n\nclass InvalidAccountError(BankError):\n    pass\n\ndef withdraw(account_id, amount, accounts):\n    if account_id not in accounts:\n        raise InvalidAccountError(f\"Account {account_id} not found\")\n    if accounts[account_id] < amount:\n        raise InsufficientFundsError(\n            f\"Need ${amount}, have ${accounts[account_id]}\"\n        )\n    accounts[account_id] -= amount\n    return amount\n\naccounts = {\"A001\": 100}\n\nfor acc, amt in [(\"A001\", 50), (\"A001\", 100), (\"A002\", 10)]:\n    try:\n        withdraw(acc, amt, accounts)\n        print(f\"Withdrew ${amt} from {acc}\")\n    except BankError as e:\n        print(f\"{type(e).__name__}: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "One success, two errors", description: "Hierarchy works" }]),
        hints: ["class SpecificError(BankError): pass", "BankError catches all"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson7_2_2.id,
        number: 4,
        title: "HTTP-like Errors",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create HTTPError with status_code, then NotFoundError(404) and ServerError(500).",
        starterCode: "class HTTPError(Exception):\n    # Add status_code attribute\n    pass\n\nclass NotFoundError(HTTPError):\n    # status_code = 404\n    pass\n\nclass ServerError(HTTPError):\n    # status_code = 500\n    pass\n\ndef fetch(url):\n    if \"missing\" in url:\n        raise NotFoundError(f\"Resource not found: {url}\")\n    if \"error\" in url:\n        raise ServerError(f\"Server error for: {url}\")\n    return f\"Content of {url}\"\n\nurls = [\"/page\", \"/missing\", \"/error\"]\nfor url in urls:\n    try:\n        print(fetch(url))\n    except HTTPError as e:\n        print(f\"HTTP {e.status_code}: {e}\")",
        solution: "class HTTPError(Exception):\n    status_code = 0\n    \n    def __init__(self, message):\n        super().__init__(message)\n\nclass NotFoundError(HTTPError):\n    status_code = 404\n\nclass ServerError(HTTPError):\n    status_code = 500\n\ndef fetch(url):\n    if \"missing\" in url:\n        raise NotFoundError(f\"Resource not found: {url}\")\n    if \"error\" in url:\n        raise ServerError(f\"Server error for: {url}\")\n    return f\"Content of {url}\"\n\nurls = [\"/page\", \"/missing\", \"/error\"]\nfor url in urls:\n    try:\n        print(fetch(url))\n    except HTTPError as e:\n        print(f\"HTTP {e.status_code}: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Content, 404, 500", description: "HTTP errors work" }]),
        hints: ["Class attribute: status_code = 404", "Subclasses inherit from HTTPError"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson7_2_2.id,
        number: 5,
        title: "Complete Error System",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Build a complete error system for a shopping cart.",
        starterCode: "# Create:\n# CartError (base)\n#   EmptyCartError\n#   ItemNotFoundError (with item_name attribute)\n#   InvalidQuantityError (with quantity attribute)\n\n# Then implement:\ndef checkout(cart):\n    \"\"\"Validate cart and return total.\"\"\"\n    pass\n\n# Test\ntest_carts = [\n    [],                                    # Empty\n    [{\"name\": \"Book\", \"qty\": 0}],         # Invalid qty\n    [{\"name\": \"Book\", \"qty\": 2, \"price\": 10}],  # Valid\n]\n\nfor cart in test_carts:\n    try:\n        total = checkout(cart)\n        print(f\"Total: ${total}\")\n    except CartError as e:\n        print(f\"{type(e).__name__}: {e}\")",
        solution: "class CartError(Exception):\n    pass\n\nclass EmptyCartError(CartError):\n    pass\n\nclass ItemNotFoundError(CartError):\n    def __init__(self, message, item_name):\n        super().__init__(message)\n        self.item_name = item_name\n\nclass InvalidQuantityError(CartError):\n    def __init__(self, message, quantity):\n        super().__init__(message)\n        self.quantity = quantity\n\ndef checkout(cart):\n    if not cart:\n        raise EmptyCartError(\"Cannot checkout empty cart\")\n    \n    total = 0\n    for item in cart:\n        if item.get(\"qty\", 0) <= 0:\n            raise InvalidQuantityError(\n                f\"Invalid quantity for {item.get('name', 'unknown')}\",\n                quantity=item.get(\"qty\")\n            )\n        if \"price\" not in item:\n            raise ItemNotFoundError(\n                f\"Missing price for item\",\n                item_name=item.get(\"name\")\n            )\n        total += item[\"price\"] * item[\"qty\"]\n    return total\n\ntest_carts = [\n    [],\n    [{\"name\": \"Book\", \"qty\": 0}],\n    [{\"name\": \"Book\", \"qty\": 2, \"price\": 10}],\n]\n\nfor cart in test_carts:\n    try:\n        total = checkout(cart)\n        print(f\"Total: ${total}\")\n    except CartError as e:\n        print(f\"{type(e).__name__}: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "EmptyCart, InvalidQty, Total:$20", description: "Complete system" }]),
        hints: ["Base CartError", "Specific errors with attributes", "Check each validation"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 7.2.2`);

  console.log("\n✅ Chapter 7 Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
