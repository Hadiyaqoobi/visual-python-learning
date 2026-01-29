import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 10 Part 3: Lessons 10.3.1-10.4.1 (Final)...\n");

  const section10_3 = await prisma.section.findFirst({ where: { number: 10.3 } });
  const section10_4 = await prisma.section.findFirst({ where: { number: 10.4 } });
  if (!section10_3 || !section10_4) throw new Error("Sections not found.");

  // ==================== LESSON 10.3.1 ====================
  const lesson10_3_1 = await prisma.lesson.upsert({
    where: { slug: "hash-tables-intro" },
    update: {},
    create: {
      sectionId: section10_3.id,
      number: 10.31,
      title: "Hash Tables Introduction",
      slug: "hash-tables-intro",
      objectives: [
        "Understand hash table concept",
        "Know how hash functions work",
        "Understand collision handling",
        "Know O(1) average lookup time",
      ],
      content: `# Hash Tables Introduction

## The Problem Hash Tables Solve

How do we look up data **instantly** by key?

- List lookup by index: O(1) ✅
- List search by value: O(n) ❌
- **Hash table lookup: O(1)** ✅

## How Hash Tables Work

1. **Hash function**: Converts key to array index
2. **Store**: Put value at that index
3. **Retrieve**: Hash the key, look at that index

\`\`\`
"alice" → hash("alice") → 42 → array[42] = data
\`\`\`

## Hash Functions

A hash function converts any key to a number:

\`\`\`python
hash("hello")  # → 4234612340987
hash(42)       # → 42
hash((1, 2))   # → 3713081631934410656
\`\`\`

Good hash functions:
- Same input → same output (deterministic)
- Distribute values evenly
- Fast to compute

## Collisions

What if two keys hash to same index?

\`\`\`
hash("alice") % 10 = 5
hash("bob") % 10 = 5  # Collision!
\`\`\`

**Solutions**:
1. **Chaining**: Store list at each index
2. **Open addressing**: Find next empty slot

## Complexity

| Operation | Average | Worst |
|-----------|---------|-------|
| Insert | O(1) | O(n) |
| Lookup | O(1) | O(n) |
| Delete | O(1) | O(n) |

Worst case happens with many collisions (rare with good hash function).`,
      codeExamples: JSON.stringify([
        {
          id: "hash-basics",
          title: "Understanding Hash Functions",
          code: "# Python's built-in hash function\nprint(\"Python hash() examples:\")\nprint(f\"hash('hello') = {hash('hello')}\")\nprint(f\"hash('world') = {hash('world')}\")\nprint(f\"hash(42) = {hash(42)}\")\nprint(f\"hash((1, 2, 3)) = {hash((1, 2, 3))}\")\n\n# Same input always gives same output\nprint(f\"\\nhash('test') == hash('test'): {hash('test') == hash('test')}\")\n\n# Converting to array index using modulo\narray_size = 10\nprint(f\"\\nConverting to index (array size {array_size}):\")\nfor key in ['alice', 'bob', 'carol', 'dave']:\n    index = hash(key) % array_size\n    print(f\"  '{key}' → index {index}\")",
          description: "How hash functions work",
        },
        {
          id: "simple-hash-table",
          title: "Simple Hash Table Implementation",
          code: "class SimpleHashTable:\n    \"\"\"Basic hash table with chaining.\"\"\"\n    \n    def __init__(self, size=10):\n        self.size = size\n        self.buckets = [[] for _ in range(size)]  # List of lists\n    \n    def _hash(self, key):\n        return hash(key) % self.size\n    \n    def put(self, key, value):\n        index = self._hash(key)\n        bucket = self.buckets[index]\n        \n        # Update if key exists\n        for i, (k, v) in enumerate(bucket):\n            if k == key:\n                bucket[i] = (key, value)\n                return\n        \n        # Add new key-value pair\n        bucket.append((key, value))\n    \n    def get(self, key):\n        index = self._hash(key)\n        bucket = self.buckets[index]\n        \n        for k, v in bucket:\n            if k == key:\n                return v\n        raise KeyError(key)\n    \n    def show(self):\n        for i, bucket in enumerate(self.buckets):\n            if bucket:\n                print(f\"  [{i}]: {bucket}\")\n\n# Test it\nht = SimpleHashTable(5)\nht.put('alice', 100)\nht.put('bob', 200)\nht.put('carol', 300)\n\nprint(\"Hash table contents:\")\nht.show()\nprint(f\"\\nGet 'bob': {ht.get('bob')}\")",
          description: "Building a hash table from scratch",
        },
        {
          id: "collision-demo",
          title: "Demonstrating Collisions",
          code: "class HashTableWithStats:\n    def __init__(self, size=5):\n        self.size = size\n        self.buckets = [[] for _ in range(size)]\n        self.collisions = 0\n    \n    def _hash(self, key):\n        return hash(key) % self.size\n    \n    def put(self, key, value):\n        index = self._hash(key)\n        bucket = self.buckets[index]\n        \n        if bucket:  # Collision!\n            self.collisions += 1\n            print(f\"  Collision! '{key}' hashes to index {index} (already has {len(bucket)} items)\")\n        \n        bucket.append((key, value))\n    \n    def show_distribution(self):\n        print(\"\\nBucket distribution:\")\n        for i, bucket in enumerate(self.buckets):\n            bar = '█' * len(bucket)\n            print(f\"  [{i}] {bar} ({len(bucket)} items)\")\n\n# Small table = more collisions\nht = HashTableWithStats(size=5)\nnames = ['alice', 'bob', 'carol', 'dave', 'eve', 'frank', 'grace', 'henry']\n\nprint(\"Adding items to small hash table:\")\nfor name in names:\n    ht.put(name, len(name))\n\nht.show_distribution()\nprint(f\"\\nTotal collisions: {ht.collisions}\")",
          description: "Seeing collisions in action",
        },
        {
          id: "o1-lookup",
          title: "O(1) Lookup Speed",
          code: "import time\n\n# Compare list search vs hash table lookup\ndef time_lookups(n):\n    # Create data\n    items = [f\"item_{i}\" for i in range(n)]\n    target = f\"item_{n-1}\"  # Last item (worst case for list)\n    \n    # List search - O(n)\n    start = time.time()\n    for _ in range(1000):\n        target in items\n    list_time = time.time() - start\n    \n    # Dict lookup - O(1)\n    item_dict = {item: True for item in items}\n    start = time.time()\n    for _ in range(1000):\n        target in item_dict\n    dict_time = time.time() - start\n    \n    return list_time, dict_time\n\nprint(f\"{'Size':>10} {'List O(n)':>12} {'Dict O(1)':>12} {'Speedup':>10}\")\nprint(\"-\" * 48)\n\nfor n in [100, 1000, 10000, 100000]:\n    list_t, dict_t = time_lookups(n)\n    speedup = list_t / dict_t\n    print(f\"{n:>10} {list_t:>12.4f}s {dict_t:>12.4f}s {speedup:>10.0f}x\")\n\nprint(\"\\nDict lookup stays constant while list grows!\")",
          description: "Hash tables are blazing fast",
        },
      ]),
      keyPoints: [
        "Hash function converts key to array index",
        "Average lookup: O(1) - constant time!",
        "Collisions: when two keys hash to same index",
        "Chaining: store multiple items at same index",
        "Good hash functions distribute evenly",
        "Python dict is a hash table",
        "Much faster than list search for large data",
        "Trade memory for speed",
      ],
      hardwareDemo: "Visualize hash function mapping keys to indices. Show collision handling.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson10_3_1.number}: ${lesson10_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_3_1.id,
        number: 1,
        title: "Hash to Index",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Write a function that converts any key to an array index.",
        starterCode: "def key_to_index(key, array_size):\n    \"\"\"Convert key to array index (0 to array_size-1).\"\"\"\n    pass\n\n# Test\nprint(key_to_index('alice', 10))\nprint(key_to_index('bob', 10))\nprint(key_to_index(42, 10))",
        solution: "def key_to_index(key, array_size):\n    return hash(key) % array_size\n\nprint(key_to_index('alice', 10))\nprint(key_to_index('bob', 10))\nprint(key_to_index(42, 10))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Indices 0-9", description: "Hash to index works" }]),
        hints: ["Use hash() function", "Use modulo % to constrain range"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson10_3_1.id,
        number: 2,
        title: "Implement Put and Get",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Complete the hash table with put() and get() methods.",
        starterCode: "class HashTable:\n    def __init__(self, size=10):\n        self.size = size\n        self.buckets = [[] for _ in range(size)]\n    \n    def _hash(self, key):\n        return hash(key) % self.size\n    \n    def put(self, key, value):\n        \"\"\"Store key-value pair.\"\"\"\n        pass\n    \n    def get(self, key):\n        \"\"\"Retrieve value by key.\"\"\"\n        pass\n\nht = HashTable()\nht.put('name', 'Alice')\nht.put('age', 25)\nprint(ht.get('name'))  # Alice\nprint(ht.get('age'))   # 25",
        solution: "class HashTable:\n    def __init__(self, size=10):\n        self.size = size\n        self.buckets = [[] for _ in range(size)]\n    \n    def _hash(self, key):\n        return hash(key) % self.size\n    \n    def put(self, key, value):\n        index = self._hash(key)\n        bucket = self.buckets[index]\n        for i, (k, v) in enumerate(bucket):\n            if k == key:\n                bucket[i] = (key, value)\n                return\n        bucket.append((key, value))\n    \n    def get(self, key):\n        index = self._hash(key)\n        for k, v in self.buckets[index]:\n            if k == key:\n                return v\n        raise KeyError(key)\n\nht = HashTable()\nht.put('name', 'Alice')\nht.put('age', 25)\nprint(ht.get('name'))\nprint(ht.get('age'))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Alice\\n25", description: "Put and get work" }]),
        hints: ["put: find bucket, update or append", "get: find bucket, search for key"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson10_3_1.id,
        number: 3,
        title: "Count Collisions",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Modify hash table to count collisions when inserting.",
        starterCode: "class HashTableWithCollisions:\n    def __init__(self, size=10):\n        self.size = size\n        self.buckets = [[] for _ in range(size)]\n        self.collision_count = 0\n    \n    def put(self, key, value):\n        \"\"\"Insert and count if collision occurs.\"\"\"\n        pass\n\nht = HashTableWithCollisions(size=5)  # Small to force collisions\nfor name in ['alice', 'bob', 'carol', 'dave', 'eve', 'frank']:\n    ht.put(name, len(name))\nprint(f\"Collisions: {ht.collision_count}\")",
        solution: "class HashTableWithCollisions:\n    def __init__(self, size=10):\n        self.size = size\n        self.buckets = [[] for _ in range(size)]\n        self.collision_count = 0\n    \n    def put(self, key, value):\n        index = hash(key) % self.size\n        bucket = self.buckets[index]\n        \n        if bucket:  # Bucket not empty = collision\n            self.collision_count += 1\n        \n        bucket.append((key, value))\n\nht = HashTableWithCollisions(size=5)\nfor name in ['alice', 'bob', 'carol', 'dave', 'eve', 'frank']:\n    ht.put(name, len(name))\nprint(f\"Collisions: {ht.collision_count}\")\nprint(f\"Items: 6, Buckets: 5, so at least 1 collision expected\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Collisions counted", description: "Collision tracking" }]),
        hints: ["Check if bucket is non-empty before inserting", "Increment counter on collision"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson10_3_1.id,
        number: 4,
        title: "Compare List vs Hash",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Time list search vs hash table lookup for different sizes.",
        starterCode: "import time\n\n# Create list and dict with n items\n# Time searching for last item (worst case for list)\n# Compare times for n = 1000, 10000, 100000",
        solution: "import time\n\ndef compare_lookup(n):\n    # Create data structures\n    items_list = list(range(n))\n    items_dict = {i: True for i in range(n)}\n    target = n - 1  # Last item\n    \n    # Time list search\n    start = time.time()\n    for _ in range(100):\n        target in items_list\n    list_time = (time.time() - start) / 100\n    \n    # Time dict lookup\n    start = time.time()\n    for _ in range(10000):\n        target in items_dict\n    dict_time = (time.time() - start) / 10000\n    \n    return list_time, dict_time\n\nprint(f\"{'Size':>10} {'List':>12} {'Dict':>12} {'Speedup':>10}\")\nprint(\"-\" * 48)\n\nfor n in [1000, 10000, 100000]:\n    lt, dt = compare_lookup(n)\n    print(f\"{n:>10} {lt*1000:>12.3f}ms {dt*1000:>12.4f}ms {lt/dt:>10.0f}x\")\n\nprint(\"\\nList: O(n), Dict: O(1)\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Dict much faster", description: "Speed comparison" }]),
        hints: ["Time 'in' operator for both", "Calculate speedup ratio"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson10_3_1.id,
        number: 5,
        title: "Add Delete Method",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Add a delete() method to the hash table.",
        starterCode: "class HashTable:\n    def __init__(self, size=10):\n        self.size = size\n        self.buckets = [[] for _ in range(size)]\n    \n    def put(self, key, value):\n        index = hash(key) % self.size\n        bucket = self.buckets[index]\n        for i, (k, v) in enumerate(bucket):\n            if k == key:\n                bucket[i] = (key, value)\n                return\n        bucket.append((key, value))\n    \n    def get(self, key):\n        index = hash(key) % self.size\n        for k, v in self.buckets[index]:\n            if k == key:\n                return v\n        raise KeyError(key)\n    \n    def delete(self, key):\n        \"\"\"Remove key from hash table.\"\"\"\n        pass\n\nht = HashTable()\nht.put('a', 1)\nht.put('b', 2)\nprint(ht.get('a'))  # 1\nht.delete('a')\ntry:\n    ht.get('a')\nexcept KeyError:\n    print(\"'a' deleted successfully\")",
        solution: "class HashTable:\n    def __init__(self, size=10):\n        self.size = size\n        self.buckets = [[] for _ in range(size)]\n    \n    def put(self, key, value):\n        index = hash(key) % self.size\n        bucket = self.buckets[index]\n        for i, (k, v) in enumerate(bucket):\n            if k == key:\n                bucket[i] = (key, value)\n                return\n        bucket.append((key, value))\n    \n    def get(self, key):\n        index = hash(key) % self.size\n        for k, v in self.buckets[index]:\n            if k == key:\n                return v\n        raise KeyError(key)\n    \n    def delete(self, key):\n        index = hash(key) % self.size\n        bucket = self.buckets[index]\n        for i, (k, v) in enumerate(bucket):\n            if k == key:\n                del bucket[i]\n                return\n        raise KeyError(key)\n\nht = HashTable()\nht.put('a', 1)\nht.put('b', 2)\nprint(ht.get('a'))\nht.delete('a')\ntry:\n    ht.get('a')\nexcept KeyError:\n    print(\"'a' deleted successfully\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "1\\n'a' deleted", description: "Delete works" }]),
        hints: ["Find the bucket", "Search for key", "Use del to remove"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 10.3.1`);

  // ==================== LESSON 10.3.2 ====================
  const lesson10_3_2 = await prisma.lesson.upsert({
    where: { slug: "python-dictionaries" },
    update: {},
    create: {
      sectionId: section10_3.id,
      number: 10.32,
      title: "Python Dictionaries as Hash Tables",
      slug: "python-dictionaries",
      objectives: [
        "Understand dict is a hash table",
        "Know dict time complexities",
        "Use dict for O(1) lookups",
        "Know what can be dict keys",
      ],
      content: `# Python Dictionaries as Hash Tables

## Dict is a Hash Table

Python's \`dict\` is a highly optimized hash table:

\`\`\`python
user = {'name': 'Alice', 'age': 25}
user['name']     # O(1) lookup
user['email'] = 'a@b.c'  # O(1) insert
del user['age']  # O(1) delete
\`\`\`

## Time Complexities

| Operation | Average | Worst |
|-----------|---------|-------|
| d[key] | O(1) | O(n) |
| d[key] = value | O(1) | O(n) |
| key in d | O(1) | O(n) |
| del d[key] | O(1) | O(n) |
| len(d) | O(1) | O(1) |

Worst case is extremely rare with Python's hash function.

## What Can Be Dict Keys?

Keys must be **hashable** (immutable):

✅ **Valid keys**: strings, numbers, tuples (of hashables)
❌ **Invalid keys**: lists, dicts, sets

\`\`\`python
d = {}
d['string'] = 1      # ✅
d[42] = 2            # ✅
d[(1, 2)] = 3        # ✅
d[[1, 2]] = 4        # ❌ TypeError!
\`\`\`

## Common Dict Patterns

\`\`\`python
# Counting
counts = {}
for item in items:
    counts[item] = counts.get(item, 0) + 1

# Grouping
groups = {}
for item in items:
    key = get_key(item)
    groups.setdefault(key, []).append(item)

# Caching/Memoization
cache = {}
def expensive_func(x):
    if x not in cache:
        cache[x] = compute(x)
    return cache[x]
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "dict-speed",
          title: "Dict O(1) Operations",
          code: "import time\n\n# Create large dict\nn = 1000000\ndata = {f\"key_{i}\": i for i in range(n)}\n\n# All operations are O(1)!\noperations = [\n    (\"Lookup\", lambda: data[\"key_999999\"]),\n    (\"Insert\", lambda: data.update({\"new_key\": 123})),\n    (\"Check membership\", lambda: \"key_500000\" in data),\n    (\"Get with default\", lambda: data.get(\"missing\", 0)),\n]\n\nprint(f\"Dict with {n:,} items:\")\nprint(f\"{'Operation':<20} {'Time':>15}\")\nprint(\"-\" * 38)\n\nfor name, op in operations:\n    start = time.time()\n    for _ in range(100000):\n        op()\n    elapsed = (time.time() - start) / 100000\n    print(f\"{name:<20} {elapsed*1000000:>12.2f} μs\")\n\nprint(\"\\nAll operations are constant time!\")",
          description: "Dict operations are O(1)",
        },
        {
          id: "hashable-keys",
          title: "What Can Be Dict Keys",
          code: "# Valid keys (hashable/immutable)\nd = {}\n\n# Strings\nd['name'] = 'Alice'\nprint(f\"String key: d['name'] = {d['name']}\")\n\n# Numbers\nd[42] = 'answer'\nd[3.14] = 'pi'\nprint(f\"Number keys: d[42] = {d[42]}, d[3.14] = {d[3.14]}\")\n\n# Tuples (of hashables)\nd[(0, 0)] = 'origin'\nd[('x', 'y')] = 'coordinates'\nprint(f\"Tuple key: d[(0, 0)] = {d[(0, 0)]}\")\n\n# Invalid keys (unhashable/mutable)\nprint(\"\\nInvalid keys:\")\ntry:\n    d[[1, 2, 3]] = 'list'  # Lists are mutable\nexcept TypeError as e:\n    print(f\"  List as key: {e}\")\n\ntry:\n    d[{'a': 1}] = 'dict'  # Dicts are mutable\nexcept TypeError as e:\n    print(f\"  Dict as key: {e}\")\n\nprint(\"\\nRule: Keys must be immutable (hashable)\")",
          description: "Only hashable types can be keys",
        },
        {
          id: "counting-pattern",
          title: "Dict for Counting",
          code: "# Count word frequencies\ntext = \"the quick brown fox jumps over the lazy dog the fox\"\nwords = text.split()\n\n# Method 1: Manual counting\ncounts = {}\nfor word in words:\n    if word in counts:\n        counts[word] += 1\n    else:\n        counts[word] = 1\n\nprint(\"Method 1 (manual):\")\nprint(counts)\n\n# Method 2: Using get()\ncounts2 = {}\nfor word in words:\n    counts2[word] = counts2.get(word, 0) + 1\n\nprint(\"\\nMethod 2 (get):\")\nprint(counts2)\n\n# Method 3: Using collections.Counter\nfrom collections import Counter\ncounts3 = Counter(words)\n\nprint(\"\\nMethod 3 (Counter):\")\nprint(dict(counts3))\nprint(f\"Most common: {counts3.most_common(3)}\")",
          description: "Counting with dictionaries",
        },
        {
          id: "grouping-pattern",
          title: "Dict for Grouping",
          code: "# Group students by grade\nstudents = [\n    ('Alice', 'A'),\n    ('Bob', 'B'),\n    ('Carol', 'A'),\n    ('Dave', 'C'),\n    ('Eve', 'B'),\n    ('Frank', 'A'),\n]\n\n# Method 1: Manual grouping\nby_grade = {}\nfor name, grade in students:\n    if grade not in by_grade:\n        by_grade[grade] = []\n    by_grade[grade].append(name)\n\nprint(\"Method 1 (manual):\")\nfor grade, names in sorted(by_grade.items()):\n    print(f\"  Grade {grade}: {names}\")\n\n# Method 2: Using setdefault\nby_grade2 = {}\nfor name, grade in students:\n    by_grade2.setdefault(grade, []).append(name)\n\nprint(\"\\nMethod 2 (setdefault):\")\nprint(by_grade2)\n\n# Method 3: Using defaultdict\nfrom collections import defaultdict\nby_grade3 = defaultdict(list)\nfor name, grade in students:\n    by_grade3[grade].append(name)\n\nprint(\"\\nMethod 3 (defaultdict):\")\nprint(dict(by_grade3))",
          description: "Grouping with dictionaries",
        },
      ]),
      keyPoints: [
        "Python dict is an optimized hash table",
        "O(1) average for lookup, insert, delete",
        "Keys must be hashable (immutable)",
        "Strings, numbers, tuples can be keys",
        "Lists, dicts, sets cannot be keys",
        "Use get() for safe lookups with default",
        "Use setdefault() for grouping patterns",
        "Counter and defaultdict for common patterns",
      ],
      hardwareDemo: "Compare dict vs list lookup speeds. Show hashable vs unhashable types.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson10_3_2.number}: ${lesson10_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_3_2.id,
        number: 1,
        title: "Word Frequency",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Count word frequencies using a dictionary.",
        starterCode: "def word_count(text):\n    \"\"\"Return dict of word frequencies.\"\"\"\n    pass\n\nresult = word_count(\"the cat sat on the mat the cat\")\nprint(result)",
        solution: "def word_count(text):\n    counts = {}\n    for word in text.split():\n        counts[word] = counts.get(word, 0) + 1\n    return counts\n\nresult = word_count(\"the cat sat on the mat the cat\")\nprint(result)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "{'the': 3, 'cat': 2, ...}", description: "Counts correct" }]),
        hints: ["Split text into words", "Use get(word, 0) for default"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson10_3_2.id,
        number: 2,
        title: "Group by Key",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Group items by their first letter.",
        starterCode: "def group_by_first_letter(words):\n    \"\"\"Return dict mapping first letter to list of words.\"\"\"\n    pass\n\nwords = ['apple', 'banana', 'apricot', 'blueberry', 'cherry', 'avocado']\nresult = group_by_first_letter(words)\nprint(result)",
        solution: "def group_by_first_letter(words):\n    groups = {}\n    for word in words:\n        first = word[0]\n        groups.setdefault(first, []).append(word)\n    return groups\n\nwords = ['apple', 'banana', 'apricot', 'blueberry', 'cherry', 'avocado']\nresult = group_by_first_letter(words)\nprint(result)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "{'a': [...], 'b': [...], 'c': [...]}", description: "Grouped correctly" }]),
        hints: ["Get first letter with word[0]", "Use setdefault for list creation"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson10_3_2.id,
        number: 3,
        title: "Two Sum with Dict",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find two numbers that sum to target using a dict for O(n) solution.",
        starterCode: "def two_sum(nums, target):\n    \"\"\"Return indices of two numbers that sum to target.\n    Use dict for O(n) solution instead of O(n²) brute force.\n    \"\"\"\n    pass\n\nprint(two_sum([2, 7, 11, 15], 9))  # [0, 1] (2 + 7 = 9)\nprint(two_sum([3, 2, 4], 6))       # [1, 2] (2 + 4 = 6)",
        solution: "def two_sum(nums, target):\n    seen = {}  # value -> index\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return None\n\nprint(two_sum([2, 7, 11, 15], 9))\nprint(two_sum([3, 2, 4], 6))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[0, 1]\\n[1, 2]", description: "Two sum works" }]),
        hints: ["Store number -> index in dict", "For each num, check if target-num is in dict"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson10_3_2.id,
        number: 4,
        title: "Valid Dict Keys",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function that tests if something can be a dict key.",
        starterCode: "def can_be_key(value):\n    \"\"\"Return True if value can be a dict key.\"\"\"\n    pass\n\ntest_values = ['hello', 42, (1, 2), [1, 2], {'a': 1}, {1, 2}]\nfor val in test_values:\n    print(f\"{str(val):<15} can be key: {can_be_key(val)}\")",
        solution: "def can_be_key(value):\n    try:\n        {value: None}\n        return True\n    except TypeError:\n        return False\n\ntest_values = ['hello', 42, (1, 2), [1, 2], {'a': 1}, {1, 2}]\nfor val in test_values:\n    print(f\"{str(val):<15} can be key: {can_be_key(val)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "True, True, True, False, False, False", description: "Key check works" }]),
        hints: ["Try using it as a dict key", "Catch TypeError if unhashable"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson10_3_2.id,
        number: 5,
        title: "Memoization with Dict",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Use a dict to cache expensive fibonacci calculations.",
        starterCode: "def fib_slow(n):\n    \"\"\"Slow O(2^n) fibonacci.\"\"\"\n    if n <= 1:\n        return n\n    return fib_slow(n-1) + fib_slow(n-2)\n\ndef fib_cached(n, cache={}):\n    \"\"\"O(n) fibonacci using dict cache.\"\"\"\n    pass\n\nimport time\n\n# Compare for n=30\nstart = time.time()\nresult1 = fib_slow(30)\nt1 = time.time() - start\n\nstart = time.time()\nresult2 = fib_cached(30)\nt2 = time.time() - start\n\nprint(f\"fib_slow(30) = {result1}, time: {t1:.3f}s\")\nprint(f\"fib_cached(30) = {result2}, time: {t2:.6f}s\")",
        solution: "def fib_slow(n):\n    if n <= 1:\n        return n\n    return fib_slow(n-1) + fib_slow(n-2)\n\ndef fib_cached(n, cache={}):\n    if n in cache:\n        return cache[n]\n    if n <= 1:\n        return n\n    cache[n] = fib_cached(n-1, cache) + fib_cached(n-2, cache)\n    return cache[n]\n\nimport time\n\nstart = time.time()\nresult1 = fib_slow(30)\nt1 = time.time() - start\n\nstart = time.time()\nresult2 = fib_cached(30)\nt2 = time.time() - start\n\nprint(f\"fib_slow(30) = {result1}, time: {t1:.3f}s\")\nprint(f\"fib_cached(30) = {result2}, time: {t2:.6f}s\")\nprint(f\"Speedup: {t1/t2:.0f}x\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Massive speedup", description: "Cache works" }]),
        hints: ["Check if n in cache first", "Store result before returning"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 10.3.2`);

  // ==================== LESSON 10.3.3 ====================
  const lesson10_3_3 = await prisma.lesson.upsert({
    where: { slug: "sets-hash-structures" },
    update: {},
    create: {
      sectionId: section10_3.id,
      number: 10.33,
      title: "Sets and Hash-based Data Structures",
      slug: "sets-hash-structures",
      objectives: [
        "Understand sets as hash tables",
        "Use sets for O(1) membership testing",
        "Perform set operations efficiently",
        "Choose between list, dict, and set",
      ],
      content: `# Sets and Hash-based Structures

## Sets are Hash Tables Too

Python \`set\` is a hash table that stores only keys (no values):

\`\`\`python
seen = {1, 2, 3}
4 in seen  # O(1) lookup
seen.add(4)  # O(1) insert
seen.remove(2)  # O(1) delete
\`\`\`

## Set Time Complexities

| Operation | Average | Worst |
|-----------|---------|-------|
| x in s | O(1) | O(n) |
| s.add(x) | O(1) | O(n) |
| s.remove(x) | O(1) | O(n) |
| len(s) | O(1) | O(1) |

## Set Operations

\`\`\`python
a = {1, 2, 3}
b = {2, 3, 4}

a | b   # Union: {1, 2, 3, 4}
a & b   # Intersection: {2, 3}
a - b   # Difference: {1}
a ^ b   # Symmetric diff: {1, 4}
\`\`\`

## When to Use Sets

**Use set when**:
- Need fast membership testing
- Need to remove duplicates
- Need set operations (union, intersection)
- Don't need key-value pairs

**Use dict when**:
- Need to associate values with keys
- Need to count or group

**Use list when**:
- Need to maintain order
- Need duplicates
- Need index access`,
      codeExamples: JSON.stringify([
        {
          id: "set-vs-list",
          title: "Set vs List Membership Testing",
          code: "import time\n\nn = 100000\n\n# Create list and set\nitems_list = list(range(n))\nitems_set = set(range(n))\n\n# Test membership for items NOT in collection (worst case)\ntargets = list(range(n, n + 1000))\n\n# Time list membership\nstart = time.time()\nfor t in targets:\n    t in items_list\nlist_time = time.time() - start\n\n# Time set membership\nstart = time.time()\nfor t in targets:\n    t in items_set\nset_time = time.time() - start\n\nprint(f\"Checking 1000 items in collection of {n:,}:\")\nprint(f\"  List (O(n)): {list_time:.3f}s\")\nprint(f\"  Set (O(1)):  {set_time:.6f}s\")\nprint(f\"  Speedup: {list_time/set_time:.0f}x\")",
          description: "Set membership is O(1)",
        },
        {
          id: "remove-duplicates",
          title: "Removing Duplicates",
          code: "# Original list with duplicates\nitems = [1, 5, 2, 1, 9, 1, 5, 7, 2, 8, 5]\nprint(f\"Original: {items}\")\nprint(f\"Length: {len(items)}\")\n\n# Method 1: Convert to set (loses order)\nunique_set = set(items)\nprint(f\"\\nSet (no order): {unique_set}\")\n\n# Method 2: Preserve order (Python 3.7+)\nunique_ordered = list(dict.fromkeys(items))\nprint(f\"Ordered unique: {unique_ordered}\")\n\n# Method 3: Manual with seen set\ndef unique_preserve_order(items):\n    seen = set()\n    result = []\n    for item in items:\n        if item not in seen:\n            seen.add(item)\n            result.append(item)\n    return result\n\nprint(f\"Manual ordered: {unique_preserve_order(items)}\")",
          description: "Multiple ways to remove duplicates",
        },
        {
          id: "set-operations",
          title: "Set Operations",
          code: "# Two sets of students\nmath_students = {'Alice', 'Bob', 'Carol', 'Dave'}\nscience_students = {'Carol', 'Dave', 'Eve', 'Frank'}\n\nprint(f\"Math: {math_students}\")\nprint(f\"Science: {science_students}\")\nprint()\n\n# Union: students in EITHER class\nprint(f\"Any class (union): {math_students | science_students}\")\n\n# Intersection: students in BOTH classes\nprint(f\"Both classes (intersection): {math_students & science_students}\")\n\n# Difference: only in math\nprint(f\"Only math: {math_students - science_students}\")\n\n# Symmetric difference: in one but not both\nprint(f\"Exactly one class: {math_students ^ science_students}\")\n\n# Subset/superset\nprint(f\"\\nIs {{'Carol', 'Dave'}} subset of math? {{'Carol', 'Dave'} <= math_students}\")",
          description: "Set operations are fast and expressive",
        },
        {
          id: "practical-set",
          title: "Practical Set Usage",
          code: "# Finding common elements (efficient)\ndef common_elements(list1, list2):\n    \"\"\"O(n + m) using sets vs O(n*m) with lists.\"\"\"\n    return list(set(list1) & set(list2))\n\nlist_a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nlist_b = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14]\nprint(f\"Common: {common_elements(list_a, list_b)}\")\n\n# Has duplicates check (O(n))\ndef has_duplicates(items):\n    return len(items) != len(set(items))\n\nprint(f\"\\n[1,2,3,4] has duplicates: {has_duplicates([1,2,3,4])}\")\nprint(f\"[1,2,2,4] has duplicates: {has_duplicates([1,2,2,4])}\")\n\n# Seen before tracking\ndef first_duplicate(items):\n    seen = set()\n    for item in items:\n        if item in seen:\n            return item\n        seen.add(item)\n    return None\n\nprint(f\"\\nFirst duplicate in [2,1,3,5,3,2]: {first_duplicate([2,1,3,5,3,2])}\")",
          description: "Real-world set applications",
        },
      ]),
      keyPoints: [
        "Set is a hash table with keys only",
        "O(1) membership testing (x in s)",
        "Automatically removes duplicates",
        "Set operations: union, intersection, difference",
        "Use | & - ^ operators or methods",
        "Sets are unordered",
        "Elements must be hashable",
        "Great for membership testing and dedup",
      ],
      hardwareDemo: "Compare set vs list membership testing. Visualize set operations.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson10_3_3.number}: ${lesson10_3_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_3_3.id,
        number: 1,
        title: "Remove Duplicates",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Remove duplicates from a list using a set.",
        starterCode: "def remove_duplicates(items):\n    \"\"\"Return list with duplicates removed.\"\"\"\n    pass\n\nprint(remove_duplicates([1, 2, 2, 3, 3, 3, 4]))",
        solution: "def remove_duplicates(items):\n    return list(set(items))\n\nprint(remove_duplicates([1, 2, 2, 3, 3, 3, 4]))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Unique values only", description: "Duplicates removed" }]),
        hints: ["Convert to set", "Convert back to list"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson10_3_3.id,
        number: 2,
        title: "Find Common Elements",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Find elements that appear in both lists using set intersection.",
        starterCode: "def common(list1, list2):\n    \"\"\"Return elements in both lists.\"\"\"\n    pass\n\nprint(common([1, 2, 3, 4], [3, 4, 5, 6]))",
        solution: "def common(list1, list2):\n    return list(set(list1) & set(list2))\n\nprint(common([1, 2, 3, 4], [3, 4, 5, 6]))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[3, 4]", description: "Intersection found" }]),
        hints: ["Convert both to sets", "Use & for intersection"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson10_3_3.id,
        number: 3,
        title: "Check for Duplicates",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write an O(n) function to check if list has any duplicates.",
        starterCode: "def has_duplicates(items):\n    \"\"\"Return True if any element appears more than once.\"\"\"\n    pass\n\nprint(has_duplicates([1, 2, 3, 4]))  # False\nprint(has_duplicates([1, 2, 2, 4]))  # True",
        solution: "def has_duplicates(items):\n    return len(items) != len(set(items))\n\n# Alternative: early exit\ndef has_duplicates_fast(items):\n    seen = set()\n    for item in items:\n        if item in seen:\n            return True\n        seen.add(item)\n    return False\n\nprint(has_duplicates([1, 2, 3, 4]))\nprint(has_duplicates([1, 2, 2, 4]))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "False\\nTrue", description: "Duplicate check works" }]),
        hints: ["Compare lengths", "Set removes duplicates automatically"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson10_3_3.id,
        number: 4,
        title: "Set Operations",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement functions for union, intersection, and difference.",
        starterCode: "def set_union(a, b):\n    pass\n\ndef set_intersection(a, b):\n    pass\n\ndef set_difference(a, b):\n    pass\n\na = [1, 2, 3]\nb = [2, 3, 4]\nprint(f\"Union: {set_union(a, b)}\")\nprint(f\"Intersection: {set_intersection(a, b)}\")\nprint(f\"Difference: {set_difference(a, b)}\")",
        solution: "def set_union(a, b):\n    return list(set(a) | set(b))\n\ndef set_intersection(a, b):\n    return list(set(a) & set(b))\n\ndef set_difference(a, b):\n    return list(set(a) - set(b))\n\na = [1, 2, 3]\nb = [2, 3, 4]\nprint(f\"Union: {set_union(a, b)}\")\nprint(f\"Intersection: {set_intersection(a, b)}\")\nprint(f\"Difference: {set_difference(a, b)}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Union, intersection, difference", description: "Operations work" }]),
        hints: ["Use | for union", "Use & for intersection", "Use - for difference"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson10_3_3.id,
        number: 5,
        title: "First Duplicate",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Find the first element that appears twice, using O(n) time.",
        starterCode: "def first_duplicate(items):\n    \"\"\"Return first element that appears twice, or None.\"\"\"\n    pass\n\nprint(first_duplicate([2, 1, 5, 3, 6, 2, 3, 1]))  # 2\nprint(first_duplicate([1, 2, 3, 4, 5]))  # None",
        solution: "def first_duplicate(items):\n    seen = set()\n    for item in items:\n        if item in seen:\n            return item\n        seen.add(item)\n    return None\n\nprint(first_duplicate([2, 1, 5, 3, 6, 2, 3, 1]))\nprint(first_duplicate([1, 2, 3, 4, 5]))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "2\\nNone", description: "First duplicate found" }]),
        hints: ["Track seen items in set", "Return immediately when seen again"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 10.3.3`);

  // ==================== LESSON 10.4.1 ====================
  const lesson10_4_1 = await prisma.lesson.upsert({
    where: { slug: "choosing-data-structures" },
    update: {},
    create: {
      sectionId: section10_4.id,
      number: 10.41,
      title: "Choosing Data Structures",
      slug: "choosing-data-structures",
      objectives: [
        "Compare list, dict, and set tradeoffs",
        "Choose best structure for each problem",
        "Understand performance implications",
        "Make informed design decisions",
      ],
      content: `# Choosing Data Structures

## The Three Main Structures

| Structure | Lookup | Insert | Delete | Order | Duplicates |
|-----------|--------|--------|--------|-------|------------|
| List | O(n) | O(1)* | O(n) | Yes | Yes |
| Dict | O(1) | O(1) | O(1) | Yes** | Keys: No |
| Set | O(1) | O(1) | O(1) | No | No |

*O(1) for append, O(n) for insert at position
**Python 3.7+ preserves insertion order

## Decision Guide

### Use List When:
- Need to maintain order
- Need index access (items[i])
- Allow duplicates
- Iterating through all items
- Small collections

### Use Dict When:
- Need key-value associations
- Need fast lookup by key
- Counting occurrences
- Caching/memoization
- Grouping data

### Use Set When:
- Only need membership testing
- Need to remove duplicates
- Need set operations (union, intersection)
- Don't need values, just keys

## Real Examples

| Problem | Best Choice | Why |
|---------|-------------|-----|
| Shopping cart items | List | Order matters, duplicates OK |
| User settings | Dict | Key-value pairs |
| Unique visitors | Set | Fast membership, no dups |
| Word count | Dict | word → count mapping |
| Seen items | Set | Just track membership |
| Queue | List (deque) | Order, access from both ends |`,
      codeExamples: JSON.stringify([
        {
          id: "comparison-demo",
          title: "Performance Comparison",
          code: "import time\n\nn = 100000\n\n# Create all three structures\nitems_list = list(range(n))\nitems_dict = {i: True for i in range(n)}\nitems_set = set(range(n))\n\n# Test membership for non-existent item (worst case)\ntarget = -1\n\nprint(f\"Membership test for {n:,} items:\")\nprint(f\"{'Structure':<10} {'Time':>15}\")\nprint(\"-\" * 28)\n\n# List - O(n)\nstart = time.time()\nfor _ in range(100):\n    target in items_list\nt_list = (time.time() - start) / 100\nprint(f\"{'List':<10} {t_list*1000:>12.3f} ms\")\n\n# Dict - O(1)\nstart = time.time()\nfor _ in range(100000):\n    target in items_dict\nt_dict = (time.time() - start) / 100000\nprint(f\"{'Dict':<10} {t_dict*1000:>12.6f} ms\")\n\n# Set - O(1)\nstart = time.time()\nfor _ in range(100000):\n    target in items_set\nt_set = (time.time() - start) / 100000\nprint(f\"{'Set':<10} {t_set*1000:>12.6f} ms\")\n\nprint(f\"\\nList is {t_list/t_set:.0f}x slower than set!\")",
          description: "Concrete performance numbers",
        },
        {
          id: "right-choice",
          title: "Choosing the Right Structure",
          code: "# Problem 1: Track unique visitors\nprint(\"Problem 1: Track unique visitors\")\nprint(\"  Best: SET - need uniqueness, fast membership\")\nvisitors = set()\nvisitors.add('user_1')\nvisitors.add('user_2')\nvisitors.add('user_1')  # Duplicate ignored\nprint(f\"  Visitors: {visitors}\")\n\n# Problem 2: Count word frequencies\nprint(\"\\nProblem 2: Count word frequencies\")\nprint(\"  Best: DICT - need word → count mapping\")\ntext = \"the quick brown fox jumps over the lazy dog\"\ncounts = {}\nfor word in text.split():\n    counts[word] = counts.get(word, 0) + 1\nprint(f\"  Counts: {counts}\")\n\n# Problem 3: Maintain order of tasks\nprint(\"\\nProblem 3: Task queue\")\nprint(\"  Best: LIST - need order, index access\")\ntasks = ['email', 'call', 'meeting']\ntasks.append('report')\ncurrent = tasks.pop(0)\nprint(f\"  Doing: {current}, Remaining: {tasks}\")\n\n# Problem 4: Quick lookup by ID\nprint(\"\\nProblem 4: User lookup by ID\")\nprint(\"  Best: DICT - need O(1) lookup by key\")\nusers = {'u1': 'Alice', 'u2': 'Bob', 'u3': 'Carol'}\nprint(f\"  User u2: {users['u2']}\")",
          description: "Match problem to structure",
        },
        {
          id: "conversion",
          title: "Converting Between Structures",
          code: "# Starting data\ndata = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]\nprint(f\"Original list: {data}\")\n\n# List → Set (removes duplicates)\nunique = set(data)\nprint(f\"As set: {unique}\")\n\n# Set → List\nback_to_list = list(unique)\nprint(f\"Back to list: {back_to_list}\")\n\n# List → Dict (with index as key)\nindexed = {i: v for i, v in enumerate(data)}\nprint(f\"Indexed dict: {indexed}\")\n\n# List → Dict (count occurrences)\nfrom collections import Counter\ncounts = dict(Counter(data))\nprint(f\"Count dict: {counts}\")\n\n# Dict keys → List\nkeys = list(counts.keys())\nprint(f\"Keys as list: {keys}\")\n\n# Dict values → List\nvalues = list(counts.values())\nprint(f\"Values as list: {values}\")",
          description: "Moving between structures",
        },
        {
          id: "combined-usage",
          title: "Using Multiple Structures Together",
          code: "# Problem: Find duplicate emails efficiently\n# and count how many times each appears\n\nemails = [\n    'alice@example.com',\n    'bob@example.com',\n    'alice@example.com',\n    'carol@example.com',\n    'bob@example.com',\n    'alice@example.com',\n]\n\n# Use SET for quick duplicate detection\nseen = set()\nduplicates = set()\n\nfor email in emails:\n    if email in seen:\n        duplicates.add(email)\n    seen.add(email)\n\nprint(f\"All unique: {seen}\")\nprint(f\"Duplicates: {duplicates}\")\n\n# Use DICT for counting\ncounts = {}\nfor email in emails:\n    counts[email] = counts.get(email, 0) + 1\n\nprint(f\"\\nCounts: {counts}\")\n\n# Use LIST for ordered results\nsorted_by_count = sorted(counts.items(), key=lambda x: x[1], reverse=True)\nprint(f\"Most frequent: {sorted_by_count}\")",
          description: "Combining structures for complex problems",
        },
      ]),
      keyPoints: [
        "List: ordered, allows duplicates, O(n) search",
        "Dict: key-value, O(1) lookup, keys unique",
        "Set: values only, O(1) lookup, no duplicates",
        "Use list for ordered sequences",
        "Use dict for key-value mapping",
        "Use set for membership testing",
        "Can convert between structures",
        "Often use multiple structures together",
      ],
      hardwareDemo: "Compare operations on all three structures. Show memory usage differences.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson10_4_1.number}: ${lesson10_4_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson10_4_1.id,
        number: 1,
        title: "Choose Structure",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "You need to track which users have logged in today (no duplicates needed). Best structure?",
        starterCode: "",
        solution: "Set - fast membership test, automatic dedup",
        testCases: JSON.stringify([
          { input: "Set", expectedOutput: "true", description: "Correct!" },
          { input: "List", expectedOutput: "false", description: "Would have duplicates, slow lookup" },
          { input: "Dict", expectedOutput: "false", description: "Don't need values, just membership" },
        ]),
        hints: ["Just tracking membership", "No values needed", "No duplicates wanted"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson10_4_1.id,
        number: 2,
        title: "Implement Efficiently",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write an efficient function to find elements in list1 but not in list2.",
        starterCode: "def only_in_first(list1, list2):\n    \"\"\"Return elements in list1 that are not in list2.\n    Must be O(n + m), not O(n * m).\n    \"\"\"\n    pass\n\nprint(only_in_first([1, 2, 3, 4, 5], [3, 4, 5, 6, 7]))",
        solution: "def only_in_first(list1, list2):\n    set2 = set(list2)  # O(m)\n    return [x for x in list1 if x not in set2]  # O(n)\n\nprint(only_in_first([1, 2, 3, 4, 5], [3, 4, 5, 6, 7]))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[1, 2]", description: "Efficient difference" }]),
        hints: ["Convert list2 to set for O(1) lookup", "Then iterate list1 checking against set"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson10_4_1.id,
        number: 3,
        title: "Best Structure Analysis",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "For each problem, state the best data structure and why.",
        starterCode: "problems = [\n    \"Store a shopping cart with items and quantities\",\n    \"Check if a username is already taken\",\n    \"Maintain a history of commands in order\",\n    \"Map student IDs to their grades\",\n]\n\n# For each problem, print best structure and reason",
        solution: "problems_solutions = [\n    (\"Store a shopping cart with items and quantities\",\n     \"DICT\", \"Need item → quantity mapping\"),\n    (\"Check if a username is already taken\",\n     \"SET\", \"Just membership testing, O(1) lookup\"),\n    (\"Maintain a history of commands in order\",\n     \"LIST\", \"Need to preserve order\"),\n    (\"Map student IDs to their grades\",\n     \"DICT\", \"Need ID → grade mapping\"),\n]\n\nfor problem, structure, reason in problems_solutions:\n    print(f\"Problem: {problem}\")\n    print(f\"  Best: {structure}\")\n    print(f\"  Why: {reason}\")\n    print()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Correct analysis", description: "Good reasoning" }]),
        hints: ["Consider what operations are needed", "Consider if order matters", "Consider if values are needed"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson10_4_1.id,
        number: 4,
        title: "Combined Solution",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Find the most frequent element efficiently using appropriate structures.",
        starterCode: "def most_frequent(items):\n    \"\"\"Return the element that appears most often.\n    Use dict for counting, return result efficiently.\n    \"\"\"\n    pass\n\nprint(most_frequent(['a', 'b', 'a', 'c', 'b', 'a']))",
        solution: "def most_frequent(items):\n    # Use DICT for counting - O(n)\n    counts = {}\n    for item in items:\n        counts[item] = counts.get(item, 0) + 1\n    \n    # Find max - O(k) where k is unique items\n    max_item = None\n    max_count = 0\n    for item, count in counts.items():\n        if count > max_count:\n            max_count = count\n            max_item = item\n    \n    return max_item\n\nprint(most_frequent(['a', 'b', 'a', 'c', 'b', 'a']))\nprint(f\"Should be 'a' (appears 3 times)\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "a", description: "Most frequent found" }]),
        hints: ["Dict for counting", "Iterate dict to find max"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson10_4_1.id,
        number: 5,
        title: "Data Structure Recommender",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write a function that recommends the best data structure based on requirements.",
        starterCode: "def recommend_structure(need_order, need_values, need_unique, need_fast_lookup):\n    \"\"\"\n    Recommend best Python data structure.\n    \n    need_order: must maintain insertion order\n    need_values: need key-value pairs\n    need_unique: no duplicates allowed\n    need_fast_lookup: O(1) lookup required\n    \n    Return: 'list', 'dict', or 'set' with explanation\n    \"\"\"\n    pass\n\nprint(recommend_structure(True, False, False, False))\nprint(recommend_structure(False, True, True, True))\nprint(recommend_structure(False, False, True, True))",
        solution: "def recommend_structure(need_order, need_values, need_unique, need_fast_lookup):\n    if need_values:\n        return \"dict - need key-value associations\"\n    \n    if need_fast_lookup and need_unique:\n        return \"set - O(1) lookup, automatic uniqueness\"\n    \n    if need_fast_lookup and not need_unique:\n        return \"dict with dummy values - O(1) lookup, allows 'duplicates' via values\"\n    \n    if need_order:\n        return \"list - maintains insertion order\"\n    \n    if need_unique:\n        return \"set - automatic uniqueness\"\n    \n    return \"list - general purpose, most flexible\"\n\nprint(recommend_structure(True, False, False, False))\nprint(recommend_structure(False, True, True, True))\nprint(recommend_structure(False, False, True, True))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Appropriate recommendations", description: "Smart advice" }]),
        hints: ["Check most constraining requirements first", "Dict for values, set for membership"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 10.4.1`);

  // Verify Chapter 10 is complete
  const chapter10 = await prisma.chapter.findFirst({
    where: { number: 10 },
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

  if (chapter10) {
    console.log("\n" + "=".repeat(60));
    console.log("📚 CHAPTER 10 COMPLETE!");
    console.log("=".repeat(60));
    
    let totalLessons = 0;
    let totalExercises = 0;
    
    for (const section of chapter10.sections) {
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
