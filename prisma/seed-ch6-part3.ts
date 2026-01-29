import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 6 Part 3: Lessons 6.2.1-6.2.3...\n");

  const section6_2 = await prisma.section.findFirst({ where: { number: 6.2 } });
  if (!section6_2) throw new Error("Section 6.2 not found.");

  // ==================== LESSON 6.2.1 ====================
  const lesson6_2_1 = await prisma.lesson.upsert({
    where: { slug: "debugging-mindset" },
    update: {},
    create: {
      sectionId: section6_2.id,
      number: 6.21,
      title: "The Debugging Mindset",
      slug: "debugging-mindset",
      objectives: [
        "Approach debugging systematically",
        "Apply scientific method to bugs",
        "Use binary search to isolate problems",
        "Stay calm and methodical",
      ],
      content: `# The Debugging Mindset

## Bugs Are Not Personal Failures

Every programmer creates bugs. It's part of the process.

The question isn't "Will I create bugs?" but "How efficiently can I find and fix them?"

## The Scientific Method for Debugging

1. **Observe**: What exactly is happening?
2. **Hypothesize**: What might cause this?
3. **Experiment**: Test your hypothesis
4. **Analyze**: Was the hypothesis correct?
5. **Repeat**: Refine and try again

## Systematic vs Random Debugging

**Random** (bad):
- Change random things
- Hope it works
- No understanding of cause

**Systematic** (good):
- Form hypothesis
- Test one thing at a time
- Understand the root cause

## Binary Search for Bugs

When bug could be anywhere, divide and conquer:

1. Add check at middle of code
2. Is data correct at middle point?
3. If yes: bug is in second half
4. If no: bug is in first half
5. Repeat until isolated

## Key Questions to Ask

- What did I expect to happen?
- What actually happened?
- When did it last work?
- What changed since then?
- What are the inputs when it fails?
- Where does the data become wrong?

## Rubber Duck Debugging

Explain your code line-by-line to an inanimate object. Often you'll find the bug while explaining!`,
      codeExamples: JSON.stringify([
        {
          id: "scientific-method",
          title: "Scientific Method Applied",
          code: "def calculate_average(numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total / len(numbers)\n\n# BUG: Getting wrong answer\nresult = calculate_average([10, 20, 30])\nprint(f\"Result: {result}\")  # Expect 20, getting... 20?\n\n# Actually works! Let's try edge case:\n# result = calculate_average([])  # ZeroDivisionError!\n\n# SCIENTIFIC METHOD:\n# 1. Observe: Crashes on empty list\n# 2. Hypothesize: Division by zero when len=0\n# 3. Experiment: Check len before dividing\n# 4. Analyze: Hypothesis confirmed!\n\ndef calculate_average_fixed(numbers):\n    if not numbers:\n        return 0  # Handle empty case\n    total = sum(numbers)\n    return total / len(numbers)\n\nprint(f\"Fixed empty: {calculate_average_fixed([])}\")",
          description: "Applying scientific method",
        },
        {
          id: "binary-search-debug",
          title: "Binary Search Debugging",
          code: "def process_data(data):\n    # Step 1: Clean data\n    cleaned = [x.strip() for x in data]\n    \n    # Step 2: Convert to numbers\n    numbers = [int(x) for x in cleaned]\n    \n    # Step 3: Filter positives\n    positives = [n for n in numbers if n > 0]\n    \n    # Step 4: Calculate result\n    return sum(positives) / len(positives)\n\n# Bug somewhere! Use binary search:\ndata = [\"  10  \", \"20\", \"-5\", \"30\"]\n\n# Check middle point (after step 2)\ncleaned = [x.strip() for x in data]\nprint(f\"After step 1: {cleaned}\")  # Looks good\n\nnumbers = [int(x) for x in cleaned]\nprint(f\"After step 2: {numbers}\")  # Looks good\n\npositives = [n for n in numbers if n > 0]\nprint(f\"After step 3: {positives}\")  # [10, 20, 30] - good!\n\nresult = sum(positives) / len(positives)\nprint(f\"Result: {result}\")  # 20.0 - correct!\n\n# Binary search helped isolate each step",
          description: "Dividing code to find bug",
        },
        {
          id: "systematic-approach",
          title: "Systematic vs Random",
          code: "# BUGGY CODE\ndef find_largest(items):\n    largest = 0  # Bug: assumes positive numbers!\n    for item in items:\n        if item > largest:\n            largest = item\n    return largest\n\n# RANDOM approach (bad):\n# \"Maybe I need >= instead of >?\"\n# \"Let me try items[0] instead?\"\n# \"What if I sort first?\"\n\n# SYSTEMATIC approach (good):\nprint(\"Testing find_largest:\")\nprint(f\"  [3,1,4]: {find_largest([3,1,4])}\")  # 4 ✓\nprint(f\"  [1,2,3]: {find_largest([1,2,3])}\")  # 3 ✓\nprint(f\"  [-1,-2,-3]: {find_largest([-1,-2,-3])}\")  # 0? Bug!\n\n# Hypothesis: Starting with 0 fails for all-negative\n# Fix: Start with first element\n\ndef find_largest_fixed(items):\n    if not items:\n        return None\n    largest = items[0]  # Start with actual element\n    for item in items[1:]:\n        if item > largest:\n            largest = item\n    return largest\n\nprint(f\"\\nFixed [-1,-2,-3]: {find_largest_fixed([-1,-2,-3])}\")",
          description: "Systematic bug hunting",
        },
        {
          id: "key-questions",
          title: "Asking the Right Questions",
          code: "def buggy_function(data):\n    \"\"\"Process user data - has a bug!\"\"\"\n    result = []\n    for item in data:\n        processed = item.upper()  # Bug: assumes strings!\n        result.append(processed)\n    return result\n\n# When bug appears, ask:\nprint(\"Debugging questions:\")\nprint(\"1. What did I expect?\")\nprint(\"   -> List of uppercase strings\")\nprint(\"2. What actually happened?\")\nprint(\"   -> AttributeError on some inputs\")\nprint(\"3. What inputs cause failure?\")\n\ntry:\n    buggy_function([\"hello\", 123, \"world\"])\nexcept AttributeError as e:\n    print(f\"4. Error: {e}\")\n    print(\"5. Hypothesis: Non-strings cause error\")\n\n# Fix based on understanding\ndef fixed_function(data):\n    result = []\n    for item in data:\n        processed = str(item).upper()\n        result.append(processed)\n    return result\n\nprint(f\"\\nFixed: {fixed_function(['hello', 123, 'world'])}\")",
          description: "Asking diagnostic questions",
        },
      ]),
      keyPoints: [
        "Bugs are normal - not personal failures",
        "Use scientific method: observe, hypothesize, test",
        "Be systematic, not random",
        "Binary search isolates bug location",
        "Ask: expected vs actual, what changed?",
        "Test one hypothesis at a time",
        "Understand root cause before fixing",
        "Rubber duck debugging often helps",
      ],
      hardwareDemo: "Step through code watching values. See where data goes wrong.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson6_2_1.number}: ${lesson6_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson6_2_1.id,
        number: 1,
        title: "Scientific Method",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "What's the first step in scientific debugging?",
        starterCode: "",
        solution: "Observe what is actually happening",
        testCases: JSON.stringify([
          { input: "Observe what is actually happening", expectedOutput: "true", description: "Correct!" },
          { input: "Change random code", expectedOutput: "false", description: "That's random debugging" },
          { input: "Ask someone else to fix it", expectedOutput: "false", description: "Not systematic" },
        ]),
        hints: ["Scientific method starts with observation", "What IS happening vs what SHOULD happen"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson6_2_1.id,
        number: 2,
        title: "Form a Hypothesis",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "This code has a bug. Form a hypothesis and fix it.",
        starterCode: "def count_words(sentence):\n    return len(sentence.split(' '))\n\n# Bug: Some sentences give wrong count\nprint(count_words(\"hello world\"))        # 2 ✓\nprint(count_words(\"hello  world\"))       # 3? Should be 2!\nprint(count_words(\"  hello world  \"))    # 4? Should be 2!\n\n# What's your hypothesis?\n# Fix the function:",
        solution: "def count_words(sentence):\n    # Hypothesis: Extra spaces create empty strings\n    # Fix: Use split() without argument (handles multiple spaces)\n    return len(sentence.split())\n\nprint(count_words(\"hello world\"))        # 2 ✓\nprint(count_words(\"hello  world\"))       # 2 ✓\nprint(count_words(\"  hello world  \"))    # 2 ✓\n\nprint(\"\\nHypothesis: split(' ') keeps empty strings\")\nprint(\"Fix: split() without argument handles whitespace\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All return 2", description: "Bug fixed" }]),
        hints: ["What does split(' ') return for 'a  b'?", "Try split() without argument"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson6_2_1.id,
        number: 3,
        title: "Binary Search Debug",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use binary search debugging - add prints at middle points to find where data goes wrong.",
        starterCode: "def process_scores(raw_scores):\n    # Step 1: Parse strings to ints\n    scores = [int(s) for s in raw_scores]\n    # Step 2: Remove failing scores (below 60)\n    passing = [s for s in scores if s > 60]\n    # Step 3: Calculate average\n    average = sum(passing) / len(passing)\n    return average\n\n# Bug: Getting wrong answer\nraw = [\"85\", \"45\", \"90\", \"72\"]\n# Expected passing: 85, 90, 72 -> avg = 82.33\n# Add debug prints between steps to find issue\n",
        solution: "def process_scores(raw_scores):\n    # Step 1\n    scores = [int(s) for s in raw_scores]\n    print(f\"After step 1: {scores}\")\n    \n    # Step 2 - BUG FOUND: > 60 excludes 60!\n    passing = [s for s in scores if s >= 60]  # Fixed: >= not >\n    print(f\"After step 2: {passing}\")\n    \n    # Step 3\n    if not passing:\n        return 0\n    average = sum(passing) / len(passing)\n    print(f\"Average: {average}\")\n    return average\n\nraw = [\"85\", \"45\", \"90\", \"72\"]\nresult = process_scores(raw)\nprint(f\"\\nBug was: s > 60 excludes score of 60\")\nprint(f\"Fix: s >= 60\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Debug prints show step-by-step", description: "Binary search applied" }]),
        hints: ["Print after each step", "Which step produces unexpected output?"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson6_2_1.id,
        number: 4,
        title: "Ask the Right Questions",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Debug this function by answering the diagnostic questions in comments.",
        starterCode: "def get_initials(full_name):\n    parts = full_name.split()\n    initials = \"\"\n    for part in parts:\n        initials += part[0]\n    return initials\n\n# Works: get_initials(\"John Doe\") -> \"JD\"\n# Fails: get_initials(\"\") -> ???\n\n# Answer these questions:\n# 1. What do I expect for empty string?\n# 2. What actually happens?\n# 3. Why does it happen?\n# 4. How do I fix it?\n",
        solution: "def get_initials(full_name):\n    # Q1: Expect \"\" for empty input\n    # Q2: Actually returns \"\" (works!) but...\n    # Try: get_initials(\"  \") - also works\n    # BUT: get_initials(None) -> AttributeError!\n    \n    # Q3: None has no .split() method\n    # Q4: Add input validation\n    \n    if not full_name or not full_name.strip():\n        return \"\"\n    \n    parts = full_name.split()\n    initials = \"\"\n    for part in parts:\n        initials += part[0]\n    return initials\n\n# Test cases\nprint(f\"'John Doe': {get_initials('John Doe')}\")\nprint(f\"Empty: '{get_initials('')}'\")\nprint(f\"Spaces: '{get_initials('   ')}'\")\nprint(f\"None: '{get_initials(None)}'\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All cases handled", description: "Questions answered" }]),
        hints: ["What if input is None?", "What if input is only spaces?"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson6_2_1.id,
        number: 5,
        title: "Rubber Duck Debug",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Explain this code line by line (in comments). Find the bug while explaining.",
        starterCode: "def reverse_words(sentence):\n    words = sentence.split()\n    reversed_words = []\n    for i in range(len(words)):\n        reversed_words.append(words[i])\n    return ' '.join(reversed_words)\n\n# Expected: \"hello world\" -> \"world hello\"\n# Actual: \"hello world\" -> \"hello world\"\n\n# Explain each line to find the bug:\n",
        solution: "def reverse_words(sentence):\n    # Line 1: Split sentence into list of words\n    words = sentence.split()\n    # words = [\"hello\", \"world\"]\n    \n    # Line 2: Create empty list for result\n    reversed_words = []\n    \n    # Line 3-4: Loop through words... wait!\n    # We loop forward (0, 1, 2...) but should go backward!\n    # BUG FOUND: Should iterate in reverse\n    \n    for i in range(len(words) - 1, -1, -1):  # Fixed!\n        reversed_words.append(words[i])\n    \n    # Line 5: Join back into string\n    return ' '.join(reversed_words)\n\nprint(reverse_words(\"hello world\"))\nprint(reverse_words(\"one two three\"))\n\n# Rubber duck debugging found it!\n# Original loop went 0,1,2 instead of 2,1,0",
        testCases: JSON.stringify([{ input: "", expectedOutput: "world hello", description: "Bug found by explaining" }]),
        hints: ["Explain the loop to yourself", "Which direction should it go?"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 6.2.1`);

  // ==================== LESSON 6.2.2 ====================
  const lesson6_2_2 = await prisma.lesson.upsert({
    where: { slug: "print-debugging" },
    update: {},
    create: {
      sectionId: section6_2.id,
      number: 6.22,
      title: "Print Debugging",
      slug: "print-debugging",
      objectives: [
        "Use print statements strategically",
        "Track variable values through execution",
        "Format debug output clearly",
        "Know when to remove debug prints",
      ],
      content: `# Print Debugging

## The Simplest Debugging Tool

\`print()\` is your first debugging tool. Simple but effective!

## Strategic Print Placement

Don't print randomly. Print at key points:

1. **Function entry**: Parameters received
2. **Before decisions**: Values being compared
3. **Inside loops**: Iteration values
4. **After calculations**: Intermediate results
5. **Function exit**: Return value

## Effective Debug Prints

**Bad** (hard to read):
\`\`\`python
print(x)
print(y)
print(result)
\`\`\`

**Good** (labeled and clear):
\`\`\`python
print(f"DEBUG: x = {x}")
print(f"DEBUG: y = {y}")
print(f"DEBUG: result = {result}")
\`\`\`

**Better** (with context):
\`\`\`python
print(f"DEBUG calculate_tax: income={income}, rate={rate}")
print(f"DEBUG: calculated tax = {tax}")
\`\`\`

## Debug Print Patterns

**Loop debugging**:
\`\`\`python
for i, item in enumerate(items):
    print(f"DEBUG loop[{i}]: item={item}")
\`\`\`

**Conditional debugging**:
\`\`\`python
print(f"DEBUG: checking if {value} > {threshold}")
if value > threshold:
    print("DEBUG: condition was TRUE")
\`\`\`

## Cleaning Up

Always remove debug prints when done:
- They clutter output
- May expose sensitive data
- Slow down production code

Use "DEBUG:" prefix to find them easily!`,
      codeExamples: JSON.stringify([
        {
          id: "strategic-placement",
          title: "Strategic Print Placement",
          code: "def calculate_grade(scores):\n    print(f\"DEBUG entry: scores = {scores}\")  # Entry\n    \n    if not scores:\n        print(\"DEBUG: empty list, returning None\")\n        return None\n    \n    total = sum(scores)\n    print(f\"DEBUG: total = {total}\")  # After calculation\n    \n    average = total / len(scores)\n    print(f\"DEBUG: average = {average}\")  # After calculation\n    \n    # Before decision\n    print(f\"DEBUG: checking grade for average {average}\")\n    if average >= 90:\n        grade = 'A'\n    elif average >= 80:\n        grade = 'B'\n    else:\n        grade = 'C'\n    \n    print(f\"DEBUG exit: returning {grade}\")  # Exit\n    return grade\n\nresult = calculate_grade([85, 90, 78])",
          description: "Placing prints at key points",
        },
        {
          id: "loop-debugging",
          title: "Debugging Loops",
          code: "def find_duplicates(items):\n    seen = set()\n    duplicates = []\n    \n    for i, item in enumerate(items):\n        print(f\"DEBUG loop[{i}]: item='{item}', seen={seen}\")\n        \n        if item in seen:\n            print(f\"DEBUG: '{item}' is duplicate!\")\n            duplicates.append(item)\n        else:\n            print(f\"DEBUG: '{item}' is new, adding to seen\")\n            seen.add(item)\n    \n    print(f\"DEBUG: final duplicates = {duplicates}\")\n    return duplicates\n\nresult = find_duplicates(['a', 'b', 'a', 'c', 'b'])\nprint(f\"\\nResult: {result}\")",
          description: "Tracing loop execution",
        },
        {
          id: "formatted-output",
          title: "Clear Formatted Output",
          code: "def process_order(items, discount_code):\n    print(\"=\" * 40)\n    print(\"DEBUG: process_order started\")\n    print(f\"  items: {items}\")\n    print(f\"  discount_code: '{discount_code}'\")\n    print(\"=\" * 40)\n    \n    subtotal = sum(items)\n    print(f\"DEBUG: subtotal = ${subtotal:.2f}\")\n    \n    # Check discount\n    discount_rates = {'SAVE10': 0.10, 'SAVE20': 0.20}\n    rate = discount_rates.get(discount_code, 0)\n    print(f\"DEBUG: discount rate = {rate*100}%\")\n    \n    discount = subtotal * rate\n    total = subtotal - discount\n    \n    print(f\"DEBUG: discount amount = ${discount:.2f}\")\n    print(f\"DEBUG: final total = ${total:.2f}\")\n    print(\"=\" * 40)\n    \n    return total\n\nprocess_order([10.00, 25.00, 15.00], 'SAVE10')",
          description: "Formatting debug output",
        },
        {
          id: "conditional-debug",
          title: "Debugging Conditions",
          code: "def validate_user(username, password, age):\n    print(f\"DEBUG: Validating user '{username}'\")\n    \n    # Check each condition\n    print(f\"DEBUG: len(username)={len(username)}, need >= 3\")\n    if len(username) < 3:\n        print(\"DEBUG: FAILED - username too short\")\n        return False\n    print(\"DEBUG: username length OK\")\n    \n    print(f\"DEBUG: len(password)={len(password)}, need >= 8\")\n    if len(password) < 8:\n        print(\"DEBUG: FAILED - password too short\")\n        return False\n    print(\"DEBUG: password length OK\")\n    \n    print(f\"DEBUG: age={age}, need >= 18\")\n    if age < 18:\n        print(\"DEBUG: FAILED - too young\")\n        return False\n    print(\"DEBUG: age OK\")\n    \n    print(\"DEBUG: All checks passed!\")\n    return True\n\nvalidate_user(\"Jo\", \"password123\", 20)",
          description: "Tracking conditional logic",
        },
      ]),
      keyPoints: [
        "Print at entry, exit, and key points",
        "Label prints clearly: print(f\"DEBUG: x={x}\")",
        "Include context: variable names and values",
        "Debug loops with enumerate and index",
        "Show decision values before if statements",
        "Use separators for clarity",
        "Always remove debug prints when done",
        "Use 'DEBUG:' prefix for easy finding",
      ],
      hardwareDemo: "Watch debug output stream. See values change through execution.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson6_2_2.number}: ${lesson6_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson6_2_2.id,
        number: 1,
        title: "Add Debug Prints",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add debug prints to track why this function returns wrong value.",
        starterCode: "def sum_evens(numbers):\n    total = 0\n    for num in numbers:\n        if num % 2 == 0:\n            total += num\n    return total\n\n# Getting wrong answer - add debug prints\nresult = sum_evens([1, 2, 3, 4, 5, 6])\nprint(f\"Result: {result}\")  # Should be 12 (2+4+6)",
        solution: "def sum_evens(numbers):\n    print(f\"DEBUG entry: numbers = {numbers}\")\n    total = 0\n    for num in numbers:\n        print(f\"DEBUG: checking {num}, is even: {num % 2 == 0}\")\n        if num % 2 == 0:\n            total += num\n            print(f\"DEBUG: added {num}, total now {total}\")\n    print(f\"DEBUG exit: returning {total}\")\n    return total\n\nresult = sum_evens([1, 2, 3, 4, 5, 6])\nprint(f\"Result: {result}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "DEBUG statements show flow", description: "Prints added" }]),
        hints: ["Print at entry with parameters", "Print each number being checked", "Print when adding to total"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson6_2_2.id,
        number: 2,
        title: "Debug a Loop",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add debug prints to find why this loop doesn't work correctly.",
        starterCode: "def count_greater(numbers, threshold):\n    count = 0\n    for num in numbers:\n        if num > threshold:\n            count + 1  # Bug here!\n    return count\n\n# Expected: 3 numbers > 5, but getting 0\nresult = count_greater([3, 7, 2, 9, 5, 8], 5)\nprint(f\"Result: {result}\")",
        solution: "def count_greater(numbers, threshold):\n    print(f\"DEBUG: numbers={numbers}, threshold={threshold}\")\n    count = 0\n    for i, num in enumerate(numbers):\n        print(f\"DEBUG [{i}]: num={num}, count before={count}\")\n        if num > threshold:\n            print(f\"DEBUG: {num} > {threshold}, incrementing\")\n            count += 1  # Fixed: was count + 1 (no assignment!)\n            print(f\"DEBUG: count after = {count}\")\n    print(f\"DEBUG: returning {count}\")\n    return count\n\nresult = count_greater([3, 7, 2, 9, 5, 8], 5)\nprint(f\"Result: {result}\")\n# Debug prints revealed count wasn't changing!",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Result: 3", description: "Bug found and fixed" }]),
        hints: ["Print count before and after increment", "Is count actually changing?"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson6_2_2.id,
        number: 3,
        title: "Debug Conditions",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add prints to see why the wrong branch executes.",
        starterCode: "def get_ticket_price(age, is_student):\n    if age < 12:\n        return 5.00\n    elif is_student:\n        return 8.00\n    elif age > 65:\n        return 7.00\n    else:\n        return 12.00\n\n# 70 year old getting $12 instead of $7!\nprint(get_ticket_price(70, False))",
        solution: "def get_ticket_price(age, is_student):\n    print(f\"DEBUG: age={age}, is_student={is_student}\")\n    \n    print(f\"DEBUG: checking age < 12: {age} < 12 = {age < 12}\")\n    if age < 12:\n        print(\"DEBUG: returning child price\")\n        return 5.00\n    \n    print(f\"DEBUG: checking is_student: {is_student}\")\n    if is_student:  # Fixed: was elif, but logic is fine\n        print(\"DEBUG: returning student price\")\n        return 8.00\n    \n    print(f\"DEBUG: checking age > 65: {age} > 65 = {age > 65}\")\n    if age > 65:  # This should trigger for 70!\n        print(\"DEBUG: returning senior price\")\n        return 7.00\n    \n    print(\"DEBUG: returning adult price\")\n    return 12.00\n\nprint(f\"Price: ${get_ticket_price(70, False)}\")\n# Debug shows logic is actually correct!",
        testCases: JSON.stringify([{ input: "", expectedOutput: "7.00", description: "Condition traced" }]),
        hints: ["Print each condition being checked", "Print which branch is taken"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson6_2_2.id,
        number: 4,
        title: "Format Debug Output",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Improve these debug prints to be clear and organized.",
        starterCode: "def calculate_bill(items, tax_rate, tip_percent):\n    print(items)\n    print(tax_rate)\n    subtotal = sum(items)\n    print(subtotal)\n    tax = subtotal * tax_rate\n    print(tax)\n    total = subtotal + tax\n    tip = total * tip_percent\n    print(tip)\n    return total + tip\n\ncalculate_bill([10.50, 15.00, 8.25], 0.08, 0.18)",
        solution: "def calculate_bill(items, tax_rate, tip_percent):\n    print(\"=\" * 40)\n    print(\"DEBUG: calculate_bill\")\n    print(f\"  items: {items}\")\n    print(f\"  tax_rate: {tax_rate*100}%\")\n    print(f\"  tip_percent: {tip_percent*100}%\")\n    print(\"-\" * 40)\n    \n    subtotal = sum(items)\n    print(f\"DEBUG: subtotal = ${subtotal:.2f}\")\n    \n    tax = subtotal * tax_rate\n    print(f\"DEBUG: tax = ${tax:.2f}\")\n    \n    total = subtotal + tax\n    print(f\"DEBUG: total with tax = ${total:.2f}\")\n    \n    tip = total * tip_percent\n    print(f\"DEBUG: tip = ${tip:.2f}\")\n    \n    final = total + tip\n    print(f\"DEBUG: final total = ${final:.2f}\")\n    print(\"=\" * 40)\n    \n    return final\n\nresult = calculate_bill([10.50, 15.00, 8.25], 0.08, 0.18)\nprint(f\"\\nFinal bill: ${result:.2f}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Formatted debug output", description: "Clean formatting" }]),
        hints: ["Add labels to every print", "Use separators", "Format currency with :.2f"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson6_2_2.id,
        number: 5,
        title: "Find and Remove",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "This code has debug prints that should be removed. Find them all using the DEBUG: pattern.",
        starterCode: "def process_names(names):\n    print(f\"DEBUG: received {len(names)} names\")\n    result = []\n    for name in names:\n        print(f\"DEBUG: processing '{name}'\")\n        cleaned = name.strip().title()\n        print(f\"DEBUG: cleaned to '{cleaned}'\")\n        if cleaned:\n            result.append(cleaned)\n    print(f\"DEBUG: returning {result}\")\n    return result\n\n# Remove all debug prints for production\nnames = [\"  alice  \", \"BOB\", \"  charlie\"]\nprint(process_names(names))",
        solution: "def process_names(names):\n    # All DEBUG prints removed for production\n    result = []\n    for name in names:\n        cleaned = name.strip().title()\n        if cleaned:\n            result.append(cleaned)\n    return result\n\nnames = [\"  alice  \", \"BOB\", \"  charlie\"]\nprint(process_names(names))\n\n# Tip: Search for 'DEBUG:' to find all debug prints\n# In VS Code: Ctrl+F, search \"DEBUG:\"\n# Or use: grep -n \"DEBUG\" filename.py",
        testCases: JSON.stringify([{ input: "", expectedOutput: "['Alice', 'Bob', 'Charlie']", description: "Clean output" }]),
        hints: ["Search for 'DEBUG:'", "Remove all print statements with DEBUG"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 6.2.2`);

  // ==================== LESSON 6.2.3 ====================
  const lesson6_2_3 = await prisma.lesson.upsert({
    where: { slug: "common-python-bugs" },
    update: {},
    create: {
      sectionId: section6_2.id,
      number: 6.23,
      title: "Common Python Bugs",
      slug: "common-python-bugs",
      objectives: [
        "Recognize common Python errors",
        "Understand error messages",
        "Fix typical bugs quickly",
        "Avoid common mistakes",
      ],
      content: `# Common Python Bugs

## Reading Error Messages

Error messages tell you:
1. **Type of error** (NameError, TypeError, etc.)
2. **Location** (file and line number)
3. **Description** (what went wrong)

## Common Errors and Fixes

### NameError
**Cause**: Variable not defined
\`\`\`python
print(message)  # NameError: name 'message' is not defined
\`\`\`
**Fix**: Define variable first, check spelling

### TypeError
**Cause**: Wrong type for operation
\`\`\`python
"5" + 3  # TypeError: can only concatenate str to str
\`\`\`
**Fix**: Convert types: int("5") + 3

### IndexError
**Cause**: Index out of range
\`\`\`python
items = [1, 2, 3]
items[5]  # IndexError: list index out of range
\`\`\`
**Fix**: Check list length first

### KeyError
**Cause**: Dictionary key doesn't exist
\`\`\`python
d = {"a": 1}
d["b"]  # KeyError: 'b'
\`\`\`
**Fix**: Use d.get("b") or check "b" in d

### IndentationError
**Cause**: Inconsistent indentation
**Fix**: Use consistent 4 spaces

### AttributeError
**Cause**: Object doesn't have that attribute
\`\`\`python
x = 5
x.append(3)  # AttributeError: 'int' has no attribute 'append'
\`\`\`
**Fix**: Check the object's type`,
      codeExamples: JSON.stringify([
        {
          id: "name-error",
          title: "NameError - Undefined Variable",
          code: "# PROBLEM\ntry:\n    print(message)  # Variable not defined!\nexcept NameError as e:\n    print(f\"Error: {e}\")\n\n# COMMON CAUSES:\n# 1. Typo in variable name\n# 2. Variable defined in different scope\n# 3. Forgot to define variable\n\n# FIXES:\nmessage = \"Hello\"  # Define first\nprint(message)\n\n# Watch for typos:\nusername = \"Alice\"\n# print(usernme)  # NameError: typo!\nprint(username)  # Correct",
          description: "Fixing NameError",
        },
        {
          id: "type-error",
          title: "TypeError - Wrong Types",
          code: "# PROBLEM: Can't add string and int\ntry:\n    result = \"5\" + 3\nexcept TypeError as e:\n    print(f\"Error: {e}\")\n\n# FIXES:\nresult = int(\"5\") + 3   # Convert string to int\nprint(f\"int() fix: {result}\")\n\nresult = \"5\" + str(3)   # Convert int to string\nprint(f\"str() fix: {result}\")\n\n# PROBLEM: Can't iterate over int\ntry:\n    for x in 5:\n        print(x)\nexcept TypeError as e:\n    print(f\"Error: {e}\")\n\n# FIX:\nfor x in range(5):\n    print(x, end=\" \")",
          description: "Fixing TypeError",
        },
        {
          id: "index-key-error",
          title: "IndexError and KeyError",
          code: "# IndexError\nitems = [1, 2, 3]\n\ntry:\n    print(items[10])  # Out of range!\nexcept IndexError as e:\n    print(f\"IndexError: {e}\")\n\n# FIX: Check bounds\nidx = 10\nif idx < len(items):\n    print(items[idx])\nelse:\n    print(f\"Index {idx} out of range\")\n\n# KeyError\nuser = {\"name\": \"Alice\", \"age\": 25}\n\ntry:\n    print(user[\"email\"])  # Key doesn't exist!\nexcept KeyError as e:\n    print(f\"KeyError: {e}\")\n\n# FIXES:\nprint(user.get(\"email\", \"No email\"))  # Default value\n\nif \"email\" in user:  # Check first\n    print(user[\"email\"])\nelse:\n    print(\"No email found\")",
          description: "Fixing IndexError and KeyError",
        },
        {
          id: "other-errors",
          title: "Other Common Errors",
          code: "# AttributeError\ntry:\n    x = 5\n    x.append(3)  # int has no append!\nexcept AttributeError as e:\n    print(f\"AttributeError: {e}\")\n\n# FIX: Use correct type\nx = [5]\nx.append(3)\nprint(f\"Fixed: {x}\")\n\n# ZeroDivisionError\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError as e:\n    print(f\"ZeroDivisionError: {e}\")\n\n# FIX: Check before dividing\ndivisor = 0\nif divisor != 0:\n    result = 10 / divisor\nelse:\n    result = 0\n    print(\"Cannot divide by zero\")\n\n# ValueError\ntry:\n    num = int(\"hello\")  # Can't convert!\nexcept ValueError as e:\n    print(f\"ValueError: {e}\")",
          description: "Fixing other common errors",
        },
      ]),
      keyPoints: [
        "NameError: Variable not defined (typo? scope?)",
        "TypeError: Wrong type for operation",
        "IndexError: List index out of bounds",
        "KeyError: Dict key doesn't exist",
        "AttributeError: Object lacks that method/property",
        "ZeroDivisionError: Division by zero",
        "ValueError: Right type, wrong value",
        "Read error messages - they tell you what's wrong!",
      ],
      hardwareDemo: "See different error types and their stack traces.",
      estimatedTime: 30,
      difficulty: "BEGINNER",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson6_2_3.number}: ${lesson6_2_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson6_2_3.id,
        number: 1,
        title: "Fix NameError",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Fix the NameError in this code.",
        starterCode: "def greet_user():\n    greeting = \"Hello\"\n    name = \"Alice\"\n    print(greetting + \" \" + name)  # NameError!\n\ngreet_user()",
        solution: "def greet_user():\n    greeting = \"Hello\"\n    name = \"Alice\"\n    print(greeting + \" \" + name)  # Fixed typo: greetting -> greeting\n\ngreet_user()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Hello Alice", description: "Typo fixed" }]),
        hints: ["Check spelling carefully", "Compare variable names"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson6_2_3.id,
        number: 2,
        title: "Fix TypeError",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Fix the TypeError - we want to add numbers, not concatenate strings.",
        starterCode: "price = \"25\"\nquantity = \"3\"\ntotal = price * quantity  # This won't give 75!\nprint(f\"Total: {total}\")",
        solution: "price = \"25\"\nquantity = \"3\"\ntotal = int(price) * int(quantity)  # Convert to int first\nprint(f\"Total: {total}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Total: 75", description: "Types fixed" }]),
        hints: ["Strings can't be multiplied mathematically", "Use int() to convert"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson6_2_3.id,
        number: 3,
        title: "Fix IndexError",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Fix the IndexError by checking bounds.",
        starterCode: "def get_item(items, index):\n    return items[index]  # Crashes on bad index!\n\nmy_list = [10, 20, 30]\nprint(get_item(my_list, 5))",
        solution: "def get_item(items, index):\n    if 0 <= index < len(items):\n        return items[index]\n    else:\n        return None  # Or raise custom error\n\nmy_list = [10, 20, 30]\nresult = get_item(my_list, 5)\nprint(f\"Result: {result}\")\nprint(f\"Valid index: {get_item(my_list, 1)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Result: None", description: "Bounds checked" }]),
        hints: ["Check if index is within range", "0 <= index < len(items)"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson6_2_3.id,
        number: 4,
        title: "Fix KeyError",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Fix the KeyError using .get() with a default value.",
        starterCode: "def get_user_email(user):\n    return user[\"email\"]  # KeyError if no email!\n\nuser1 = {\"name\": \"Alice\", \"email\": \"alice@mail.com\"}\nuser2 = {\"name\": \"Bob\"}  # No email!\n\nprint(get_user_email(user1))\nprint(get_user_email(user2))  # Crashes!",
        solution: "def get_user_email(user):\n    return user.get(\"email\", \"No email provided\")\n\nuser1 = {\"name\": \"Alice\", \"email\": \"alice@mail.com\"}\nuser2 = {\"name\": \"Bob\"}\n\nprint(get_user_email(user1))\nprint(get_user_email(user2))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "alice@mail.com\\nNo email provided", description: "KeyError fixed" }]),
        hints: ["Use dict.get(key, default)", "Returns default if key missing"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson6_2_3.id,
        number: 5,
        title: "Identify Error Type",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Run each line, identify the error type, and fix it.",
        starterCode: "# Each line has a different bug. Fix them all!\n\n# Bug 1:\n# result = \"10\" + 5\n\n# Bug 2:\n# items = [1, 2, 3]\n# print(items[3])\n\n# Bug 3:\n# data = {\"a\": 1}\n# print(data[\"b\"])\n\n# Bug 4:\n# print(undefined_var)\n",
        solution: "# Bug 1: TypeError - can't add str and int\nresult = int(\"10\") + 5\nprint(f\"Bug 1 fixed: {result}\")\n\n# Bug 2: IndexError - index 3 doesn't exist\nitems = [1, 2, 3]\nprint(f\"Bug 2 fixed: {items[-1]}\")  # Use -1 for last\n\n# Bug 3: KeyError - key 'b' doesn't exist\ndata = {\"a\": 1}\nprint(f\"Bug 3 fixed: {data.get('b', 'default')}\")\n\n# Bug 4: NameError - variable not defined\nundefined_var = \"Now defined!\"\nprint(f\"Bug 4 fixed: {undefined_var}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All 4 bugs fixed", description: "All errors identified and fixed" }]),
        hints: ["TypeError: type conversion needed", "IndexError: check bounds", "KeyError: use .get()", "NameError: define the variable"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 6.2.3`);

  console.log("\n✅ Chapter 6 Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
