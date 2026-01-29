import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 7 Part 4: Lesson 7.3.1 (Final)...\n");

  const section7_3 = await prisma.section.findFirst({ where: { number: 7.3 } });
  if (!section7_3) throw new Error("Section 7.3 not found.");

  // ==================== LESSON 7.3.1 ====================
  const lesson7_3_1 = await prisma.lesson.upsert({
    where: { slug: "assertions-vs-exceptions" },
    update: {},
    create: {
      sectionId: section7_3.id,
      number: 7.31,
      title: "Assertions vs Exceptions",
      slug: "assertions-vs-exceptions",
      objectives: [
        "Know when to use assertions vs exceptions",
        "Use assertions for programmer errors",
        "Use exceptions for runtime errors",
        "Understand assertions can be disabled",
      ],
      content: `# Assertions vs Exceptions

## The Key Difference

| Assertions | Exceptions |
|------------|------------|
| Programmer errors | Runtime errors |
| Should **never** happen | **Might** happen |
| Bugs in code | Invalid user input |
| Can be disabled | Always active |
| Development tool | Production tool |

## When to Use Assertions

**Internal invariants** - things that should ALWAYS be true:

\`\`\`python
def calculate_average(numbers):
    assert len(numbers) > 0, "BUG: called with empty list"
    return sum(numbers) / len(numbers)
\`\`\`

**Postconditions** - verify your own code works:

\`\`\`python
def square(n):
    result = n * n
    assert result >= 0, "BUG: square should never be negative"
    return result
\`\`\`

## When to Use Exceptions

**User input** - users make mistakes:

\`\`\`python
def set_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative")
\`\`\`

**External resources** - files, networks can fail:

\`\`\`python
def read_config(filename):
    if not os.path.exists(filename):
        raise FileNotFoundError(f"Config file not found: {filename}")
\`\`\`

## Assertions Can Be Disabled!

\`\`\`bash
python -O script.py  # Assertions are REMOVED!
\`\`\`

**Never use assertions for:**
- Input validation
- Security checks
- Anything that should run in production

## Rule of Thumb

- **assert**: "This should never happen if my code is correct"
- **raise**: "This might happen and needs to be handled"`,
      codeExamples: JSON.stringify([
        {
          id: "when-assert",
          title: "When to Use Assertions",
          code: "# Assertions for PROGRAMMER errors (bugs)\n\ndef binary_search(sorted_list, target):\n    \"\"\"Search requires sorted list - programmer's responsibility.\"\"\"\n    # Precondition: list must be sorted\n    assert sorted_list == sorted(sorted_list), \\\n        \"BUG: binary_search requires sorted list\"\n    \n    left, right = 0, len(sorted_list) - 1\n    \n    while left <= right:\n        mid = (left + right) // 2\n        \n        # Internal invariant: mid should always be valid\n        assert 0 <= mid < len(sorted_list), \\\n            f\"BUG: mid={mid} out of bounds\"\n        \n        if sorted_list[mid] == target:\n            return mid\n        elif sorted_list[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    \n    return -1\n\n# Correct usage\nprint(binary_search([1, 3, 5, 7, 9], 5))  # 2\n\n# Bug in calling code (would trigger assertion)\n# print(binary_search([5, 3, 1], 3))  # AssertionError!",
          description: "Assertions catch programmer mistakes",
        },
        {
          id: "when-exception",
          title: "When to Use Exceptions",
          code: "# Exceptions for RUNTIME errors (expected failures)\n\ndef get_user_age():\n    \"\"\"Get age from user - users make mistakes!\"\"\"\n    while True:\n        try:\n            age_str = input(\"Enter your age: \") or \"25\"  # Default for demo\n            age = int(age_str)\n            \n            # User input validation - use EXCEPTION\n            if age < 0:\n                raise ValueError(\"Age cannot be negative\")\n            if age > 150:\n                raise ValueError(\"Age seems unrealistic\")\n            \n            return age\n            \n        except ValueError as e:\n            print(f\"Invalid input: {e}\")\n            print(\"Please try again.\")\n            break  # For demo, just break\n\ndef read_user_file(filename):\n    \"\"\"Read file - files might not exist!\"\"\"\n    # File operations - use EXCEPTION\n    try:\n        with open(filename) as f:\n            return f.read()\n    except FileNotFoundError:\n        raise FileNotFoundError(f\"User file '{filename}' not found\")\n    except PermissionError:\n        raise PermissionError(f\"Cannot read '{filename}' - permission denied\")\n\nage = get_user_age()\nprint(f\"Age: {age}\")",
          description: "Exceptions handle expected failures",
        },
        {
          id: "disabled-danger",
          title: "The Danger of Disabled Assertions",
          code: "# DANGEROUS: Using assertion for security!\ndef login_BAD(username, password, users):\n    \"\"\"BAD: Assertion for security check!\"\"\"\n    assert username in users, \"User not found\"\n    assert users[username] == password, \"Wrong password\"\n    return True\n\n# When run with python -O, assertions are REMOVED!\n# The function would return True for ANY input!\n\n# CORRECT: Using exceptions for security\ndef login_GOOD(username, password, users):\n    \"\"\"GOOD: Exceptions for security check.\"\"\"\n    if username not in users:\n        raise ValueError(\"User not found\")\n    if users[username] != password:\n        raise ValueError(\"Wrong password\")\n    return True\n\nusers = {\"alice\": \"secret123\"}\n\n# Test the good version\ntry:\n    login_GOOD(\"bob\", \"wrong\", users)\nexcept ValueError as e:\n    print(f\"Login failed: {e}\")\n\ntry:\n    result = login_GOOD(\"alice\", \"secret123\", users)\n    print(f\"Login successful: {result}\")\nexcept ValueError as e:\n    print(f\"Login failed: {e}\")",
          description: "Never use assertions for security",
        },
        {
          id: "combined-usage",
          title: "Using Both Together",
          code: "class Stack:\n    \"\"\"Stack implementation showing both assert and raise.\"\"\"\n    \n    def __init__(self, max_size):\n        # Programmer error if max_size invalid\n        assert max_size > 0, \"BUG: max_size must be positive\"\n        \n        self._items = []\n        self._max_size = max_size\n    \n    def push(self, item):\n        # Runtime error - stack might be full (user's problem)\n        if len(self._items) >= self._max_size:\n            raise OverflowError(\"Stack is full\")\n        \n        self._items.append(item)\n        \n        # Postcondition - verify our code is correct\n        assert len(self._items) <= self._max_size, \\\n            \"BUG: stack exceeded max size\"\n    \n    def pop(self):\n        # Runtime error - stack might be empty (user's problem)\n        if not self._items:\n            raise IndexError(\"Stack is empty\")\n        \n        item = self._items.pop()\n        \n        # Postcondition\n        assert len(self._items) >= 0, \"BUG: negative stack size\"\n        \n        return item\n\n# Usage\nstack = Stack(3)\nstack.push(1)\nstack.push(2)\nstack.push(3)\n\ntry:\n    stack.push(4)  # OverflowError - handled normally\nexcept OverflowError as e:\n    print(f\"Expected error: {e}\")\n\nprint(f\"Popped: {stack.pop()}\")",
          description: "Combining both approaches",
        },
      ]),
      keyPoints: [
        "Assertions: programmer errors (bugs)",
        "Exceptions: runtime errors (expected failures)",
        "Assertions can be disabled with -O flag",
        "Never use assert for user input validation",
        "Never use assert for security checks",
        "assert: 'This should never happen'",
        "raise: 'This might happen, handle it'",
        "Both can be used together appropriately",
      ],
      hardwareDemo: "Show assertion removed with -O flag. See exception always present.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson7_3_1.number}: ${lesson7_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson7_3_1.id,
        number: 1,
        title: "Assert or Raise?",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "User enters their email address. How should you validate it?",
        starterCode: "",
        solution: "raise ValueError if invalid (user input = exception)",
        testCases: JSON.stringify([
          { input: "raise ValueError", expectedOutput: "true", description: "Correct!" },
          { input: "assert email contains @", expectedOutput: "false", description: "Assertions can be disabled!" },
          { input: "Return None", expectedOutput: "false", description: "Errors should be explicit" },
        ]),
        hints: ["User input is a runtime error", "Assertions can be disabled"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson7_3_1.id,
        number: 2,
        title: "Internal Invariant",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add assertion to verify internal invariant: mid should always be between left and right.",
        starterCode: "def binary_search(items, target):\n    left, right = 0, len(items) - 1\n    \n    while left <= right:\n        mid = (left + right) // 2\n        \n        # Add assertion: mid should be between left and right\n        \n        if items[mid] == target:\n            return mid\n        elif items[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    \n    return -1\n\nprint(binary_search([1, 3, 5, 7, 9], 5))",
        solution: "def binary_search(items, target):\n    left, right = 0, len(items) - 1\n    \n    while left <= right:\n        mid = (left + right) // 2\n        \n        # Internal invariant\n        assert left <= mid <= right, \\\n            f\"BUG: mid={mid} not between left={left} and right={right}\"\n        \n        if items[mid] == target:\n            return mid\n        elif items[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    \n    return -1\n\nprint(binary_search([1, 3, 5, 7, 9], 5))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "2", description: "Search works with assertion" }]),
        hints: ["assert condition, message", "left <= mid <= right"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson7_3_1.id,
        number: 3,
        title: "Fix the Security Bug",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "This code uses assertions for security. Fix it to use exceptions.",
        starterCode: "def transfer_money(from_account, to_account, amount, accounts):\n    \"\"\"Transfer money between accounts.\"\"\"\n    # BUG: Using assertions for security!\n    assert from_account in accounts, \"Account not found\"\n    assert accounts[from_account] >= amount, \"Insufficient funds\"\n    assert amount > 0, \"Invalid amount\"\n    \n    accounts[from_account] -= amount\n    accounts[to_account] = accounts.get(to_account, 0) + amount\n\naccounts = {\"alice\": 100, \"bob\": 50}\ntry:\n    transfer_money(\"alice\", \"bob\", 30, accounts)\n    print(f\"Transfer successful: {accounts}\")\n    transfer_money(\"alice\", \"bob\", 100, accounts)  # Should fail\nexcept ValueError as e:\n    print(f\"Transfer failed: {e}\")",
        solution: "def transfer_money(from_account, to_account, amount, accounts):\n    \"\"\"Transfer money between accounts.\"\"\"\n    # Fixed: Using exceptions for security\n    if from_account not in accounts:\n        raise ValueError(f\"Account '{from_account}' not found\")\n    if amount <= 0:\n        raise ValueError(\"Amount must be positive\")\n    if accounts[from_account] < amount:\n        raise ValueError(\"Insufficient funds\")\n    \n    accounts[from_account] -= amount\n    accounts[to_account] = accounts.get(to_account, 0) + amount\n\naccounts = {\"alice\": 100, \"bob\": 50}\ntry:\n    transfer_money(\"alice\", \"bob\", 30, accounts)\n    print(f\"Transfer successful: {accounts}\")\n    transfer_money(\"alice\", \"bob\", 100, accounts)\nexcept ValueError as e:\n    print(f\"Transfer failed: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Success then Insufficient funds", description: "Security fixed" }]),
        hints: ["Replace assert with if/raise", "Use ValueError for validation"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson7_3_1.id,
        number: 4,
        title: "Combined Approach",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Add both assertions (for bugs) and exceptions (for user errors) appropriately.",
        starterCode: "def divide_list(numbers, divisor):\n    \"\"\"\n    Divide all numbers in list by divisor.\n    \n    - numbers must be a list (programmer provides this)\n    - divisor comes from user input (might be invalid)\n    \"\"\"\n    # Add assertion for: numbers must be a list (programmer error)\n    # Add exception for: divisor == 0 (user error)\n    # Add assertion for: result should have same length (postcondition)\n    \n    result = [n / divisor for n in numbers]\n    return result\n\n# Test\nnums = [10, 20, 30]\nprint(divide_list(nums, 2))\ntry:\n    print(divide_list(nums, 0))\nexcept ZeroDivisionError as e:\n    print(f\"User error: {e}\")",
        solution: "def divide_list(numbers, divisor):\n    # Assertion: programmer error if not a list\n    assert isinstance(numbers, list), \\\n        f\"BUG: numbers must be list, got {type(numbers).__name__}\"\n    \n    # Exception: user error if divisor is 0\n    if divisor == 0:\n        raise ZeroDivisionError(\"Cannot divide by zero\")\n    \n    result = [n / divisor for n in numbers]\n    \n    # Assertion: postcondition - same length\n    assert len(result) == len(numbers), \\\n        \"BUG: result length doesn't match input\"\n    \n    return result\n\nnums = [10, 20, 30]\nprint(divide_list(nums, 2))\ntry:\n    print(divide_list(nums, 0))\nexcept ZeroDivisionError as e:\n    print(f\"User error: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[5.0, 10.0, 15.0]\\nUser error", description: "Both used correctly" }]),
        hints: ["assert for internal checks", "raise for user input", "Postcondition verifies output"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson7_3_1.id,
        number: 5,
        title: "Design Decision",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement a function using the right tool (assert vs raise) for each validation.",
        starterCode: "def process_order(order, inventory):\n    \"\"\"\n    Process a customer order.\n    \n    Validations needed:\n    1. order must be a dict (programmer provides this) -> ???\n    2. order must have 'item' key (user input) -> ???\n    3. item must exist in inventory (runtime check) -> ???\n    4. order['quantity'] must be positive (user input) -> ???\n    5. inventory must have enough stock (runtime check) -> ???\n    6. After processing, inventory[item] >= 0 (our code correctness) -> ???\n    \"\"\"\n    pass\n\ninventory = {\"apple\": 10, \"banana\": 5}\n\ntest_orders = [\n    {\"item\": \"apple\", \"quantity\": 3},   # Valid\n    {\"quantity\": 5},                      # Missing item\n    {\"item\": \"orange\", \"quantity\": 1},   # Item not in inventory\n    {\"item\": \"banana\", \"quantity\": 10},  # Not enough stock\n]\n\nfor order in test_orders:\n    try:\n        result = process_order(order, inventory)\n        print(f\"✓ Processed: {result}\")\n    except (ValueError, KeyError) as e:\n        print(f\"✗ {type(e).__name__}: {e}\")",
        solution: "def process_order(order, inventory):\n    # 1. Programmer error - should always be dict\n    assert isinstance(order, dict), \"BUG: order must be dict\"\n    \n    # 2. User input - might forget 'item'\n    if \"item\" not in order:\n        raise KeyError(\"Order must include 'item'\")\n    \n    item = order[\"item\"]\n    \n    # 3. Runtime - item might not exist\n    if item not in inventory:\n        raise ValueError(f\"Item '{item}' not in inventory\")\n    \n    quantity = order.get(\"quantity\", 1)\n    \n    # 4. User input - might be invalid\n    if quantity <= 0:\n        raise ValueError(\"Quantity must be positive\")\n    \n    # 5. Runtime - might not have enough\n    if inventory[item] < quantity:\n        raise ValueError(f\"Only {inventory[item]} {item}(s) in stock\")\n    \n    # Process the order\n    inventory[item] -= quantity\n    \n    # 6. Postcondition - our code should be correct\n    assert inventory[item] >= 0, \"BUG: inventory went negative\"\n    \n    return {\"item\": item, \"quantity\": quantity, \"remaining\": inventory[item]}\n\ninventory = {\"apple\": 10, \"banana\": 5}\n\ntest_orders = [\n    {\"item\": \"apple\", \"quantity\": 3},\n    {\"quantity\": 5},\n    {\"item\": \"orange\", \"quantity\": 1},\n    {\"item\": \"banana\", \"quantity\": 10},\n]\n\nfor order in test_orders:\n    try:\n        result = process_order(order, inventory)\n        print(f\"✓ Processed: {result}\")\n    except (ValueError, KeyError) as e:\n        print(f\"✗ {type(e).__name__}: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "One success, three handled errors", description: "Correct tool for each" }]),
        hints: ["assert for programmer bugs", "raise for user/runtime errors", "Postcondition with assert"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 7.3.1`);

  // Verify Chapter 7 is complete
  const chapter7 = await prisma.chapter.findFirst({
    where: { number: 7 },
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

  if (chapter7) {
    console.log("\n" + "=".repeat(60));
    console.log("📚 CHAPTER 7 COMPLETE!");
    console.log("=".repeat(60));
    
    let totalLessons = 0;
    let totalExercises = 0;
    
    for (const section of chapter7.sections) {
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
