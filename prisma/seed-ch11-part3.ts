import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 11 Part 3: Lessons 11.3.1-11.4.1 (Final)...\n");

  const section11_3 = await prisma.section.findFirst({ where: { number: 11.3 } });
  const section11_4 = await prisma.section.findFirst({ where: { number: 11.4 } });
  if (!section11_3 || !section11_4) throw new Error("Sections not found.");

  // ==================== LESSON 11.3.1 ====================
  const lesson11_3_1 = await prisma.lesson.upsert({
    where: { slug: "subclassing-builtins" },
    update: {},
    create: {
      sectionId: section11_3.id,
      number: 11.31,
      title: "Subclassing Built-in Types",
      slug: "subclassing-builtins",
      objectives: [
        "Extend list with custom behavior",
        "Extend dict with custom behavior",
        "Know when subclassing is appropriate",
        "Understand limitations and alternatives",
      ],
      content: `# Subclassing Built-in Types

## Why Extend Built-ins?

Sometimes you need a list or dict with **extra capabilities**:
- List that tracks statistics
- Dict with default values
- List that validates items

## Subclassing List

\`\`\`python
class TrackedList(list):
    """List that tracks additions."""
    
    def __init__(self, *args):
        super().__init__(*args)
        self.add_count = 0
    
    def append(self, item):
        self.add_count += 1
        super().append(item)
\`\`\`

## Subclassing Dict

\`\`\`python
class DefaultDict(dict):
    """Dict with default value for missing keys."""
    
    def __init__(self, default, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.default = default
    
    def __missing__(self, key):
        return self.default
\`\`\`

## Key Methods to Override

### For list:
- \`append()\`, \`extend()\`, \`insert()\`
- \`__setitem__()\`, \`__getitem__()\`

### For dict:
- \`__setitem__()\`, \`__getitem__()\`
- \`__missing__()\` - called when key not found

## When to Subclass vs Compose

**Subclass when**: You want an "enhanced version" that IS-A list/dict

**Compose when**: You need list/dict internally but different interface

\`\`\`python
# Composition: Stack uses list internally
class Stack:
    def __init__(self):
        self._items = []  # Has-a list
    
    def push(self, item):
        self._items.append(item)
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "tracked-list",
          title: "List That Tracks Statistics",
          code: "class TrackedList(list):\n    \"\"\"List that tracks statistics.\"\"\"\n    \n    def __init__(self, *args):\n        super().__init__(*args)\n        self.append_count = 0\n        self.access_count = 0\n    \n    def append(self, item):\n        self.append_count += 1\n        super().append(item)\n    \n    def __getitem__(self, index):\n        self.access_count += 1\n        return super().__getitem__(index)\n    \n    def stats(self):\n        return {\n            'length': len(self),\n            'appends': self.append_count,\n            'accesses': self.access_count\n        }\n\n# Use it\ndata = TrackedList([1, 2, 3])\ndata.append(4)\ndata.append(5)\nprint(f\"First: {data[0]}\")\nprint(f\"Last: {data[-1]}\")\nprint(f\"Sum: {data[0] + data[1] + data[2]}\")\n\nprint(f\"\\nStats: {data.stats()}\")",
          description: "Track list usage patterns",
        },
        {
          id: "validated-list",
          title: "List That Validates Items",
          code: "class PositiveList(list):\n    \"\"\"List that only accepts positive numbers.\"\"\"\n    \n    def _validate(self, value):\n        if not isinstance(value, (int, float)):\n            raise TypeError(f\"Expected number, got {type(value).__name__}\")\n        if value <= 0:\n            raise ValueError(f\"Value must be positive, got {value}\")\n    \n    def append(self, value):\n        self._validate(value)\n        super().append(value)\n    \n    def __setitem__(self, index, value):\n        self._validate(value)\n        super().__setitem__(index, value)\n    \n    def extend(self, values):\n        for v in values:\n            self._validate(v)\n        super().extend(values)\n\n# Test it\nnums = PositiveList()\nnums.append(5)\nnums.append(10)\nprint(f\"List: {nums}\")\n\ntry:\n    nums.append(-3)\nexcept ValueError as e:\n    print(f\"Error: {e}\")\n\ntry:\n    nums.append(\"hello\")\nexcept TypeError as e:\n    print(f\"Error: {e}\")",
          description: "Enforce constraints on list items",
        },
        {
          id: "custom-dict",
          title: "Dict with Custom Behavior",
          code: "class CaseInsensitiveDict(dict):\n    \"\"\"Dict with case-insensitive string keys.\"\"\"\n    \n    def _normalize(self, key):\n        if isinstance(key, str):\n            return key.lower()\n        return key\n    \n    def __setitem__(self, key, value):\n        super().__setitem__(self._normalize(key), value)\n    \n    def __getitem__(self, key):\n        return super().__getitem__(self._normalize(key))\n    \n    def __contains__(self, key):\n        return super().__contains__(self._normalize(key))\n    \n    def get(self, key, default=None):\n        return super().get(self._normalize(key), default)\n\n# Test it\nconfig = CaseInsensitiveDict()\nconfig['Name'] = 'Alice'\nconfig['AGE'] = 25\n\nprint(f\"config['name'] = {config['name']}\")\nprint(f\"config['NAME'] = {config['NAME']}\")\nprint(f\"config['Age'] = {config['Age']}\")\nprint(f\"'age' in config: {'age' in config}\")",
          description: "Case-insensitive dictionary",
        },
        {
          id: "counter-dict",
          title: "Dict That Counts",
          code: "class CounterDict(dict):\n    \"\"\"Dict that auto-initializes missing keys to 0.\"\"\"\n    \n    def __missing__(self, key):\n        self[key] = 0\n        return 0\n    \n    def increment(self, key, amount=1):\n        self[key] += amount\n\n# Use for counting\nword_count = CounterDict()\n\ntext = \"the quick brown fox jumps over the lazy dog the fox\"\nfor word in text.split():\n    word_count.increment(word)\n\nprint(\"Word counts:\")\nfor word, count in sorted(word_count.items(), key=lambda x: -x[1]):\n    print(f\"  {word}: {count}\")\n\n# Compare to collections.Counter\nfrom collections import Counter\nprint(f\"\\nSame as Counter: {dict(word_count) == dict(Counter(text.split()))}\")",
          description: "Auto-initializing counter dictionary",
        },
      ]),
      keyPoints: [
        "Subclass list/dict to add behavior",
        "Call super().__init__() in __init__",
        "Override methods like append, __setitem__",
        "__missing__ handles missing dict keys",
        "Can add validation logic",
        "Can track usage statistics",
        "Consider composition as alternative",
        "Built-in collections module has useful variants",
      ],
      hardwareDemo: "Show custom list/dict in action. Compare to standard types.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson11_3_1.number}: ${lesson11_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson11_3_1.id,
        number: 1,
        title: "Bounded List",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a list subclass with a maximum length.",
        starterCode: "class BoundedList(list):\n    \"\"\"List with maximum length.\"\"\"\n    \n    def __init__(self, max_length, *args):\n        pass\n    \n    def append(self, item):\n        pass\n\n# Test\nbounded = BoundedList(3)\nbounded.append(1)\nbounded.append(2)\nbounded.append(3)\nprint(bounded)  # [1, 2, 3]\nbounded.append(4)  # Should raise error",
        solution: "class BoundedList(list):\n    def __init__(self, max_length, *args):\n        super().__init__(*args)\n        self.max_length = max_length\n    \n    def append(self, item):\n        if len(self) >= self.max_length:\n            raise ValueError(f\"List is full (max {self.max_length})\")\n        super().append(item)\n\nbounded = BoundedList(3)\nbounded.append(1)\nbounded.append(2)\nbounded.append(3)\nprint(bounded)\n\ntry:\n    bounded.append(4)\nexcept ValueError as e:\n    print(f\"Error: {e}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[1, 2, 3]\\nError", description: "Bounded correctly" }]),
        hints: ["Check length before appending", "Raise ValueError if full"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson11_3_1.id,
        number: 2,
        title: "History List",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a list that tracks all removed items.",
        starterCode: "class HistoryList(list):\n    \"\"\"List that remembers removed items.\"\"\"\n    \n    def __init__(self, *args):\n        pass\n    \n    def pop(self, index=-1):\n        pass\n    \n    def get_history(self):\n        pass\n\n# Test\nhl = HistoryList([1, 2, 3, 4, 5])\nhl.pop()\nhl.pop(0)\nprint(f\"Current: {hl}\")\nprint(f\"History: {hl.get_history()}\")",
        solution: "class HistoryList(list):\n    def __init__(self, *args):\n        super().__init__(*args)\n        self._history = []\n    \n    def pop(self, index=-1):\n        item = super().pop(index)\n        self._history.append(item)\n        return item\n    \n    def get_history(self):\n        return self._history.copy()\n\nhl = HistoryList([1, 2, 3, 4, 5])\nhl.pop()\nhl.pop(0)\nprint(f\"Current: {hl}\")\nprint(f\"History: {hl.get_history()}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Current: [2, 3, 4]\\nHistory: [5, 1]", description: "History tracked" }]),
        hints: ["Store removed items in _history", "Override pop method"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson11_3_1.id,
        number: 3,
        title: "Default Dict",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a dict subclass that returns a default for missing keys.",
        starterCode: "class DefaultDict(dict):\n    \"\"\"Dict that returns default for missing keys.\"\"\"\n    \n    def __init__(self, default_value, *args, **kwargs):\n        pass\n    \n    def __missing__(self, key):\n        pass\n\n# Test\ncounts = DefaultDict(0)\ncounts['a'] += 1\ncounts['a'] += 1\ncounts['b'] += 1\nprint(counts['a'])  # 2\nprint(counts['b'])  # 1\nprint(counts['c'])  # 0 (default)",
        solution: "class DefaultDict(dict):\n    def __init__(self, default_value, *args, **kwargs):\n        super().__init__(*args, **kwargs)\n        self.default_value = default_value\n    \n    def __missing__(self, key):\n        return self.default_value\n\ncounts = DefaultDict(0)\ncounts['a'] += 1\ncounts['a'] += 1\ncounts['b'] += 1\nprint(counts['a'])\nprint(counts['b'])\nprint(counts['c'])",
        testCases: JSON.stringify([{ input: "", expectedOutput: "2\\n1\\n0", description: "Default works" }]),
        hints: ["__missing__ is called for missing keys", "Store default in instance variable"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson11_3_1.id,
        number: 4,
        title: "Stats List",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a list that provides statistical methods (mean, min, max, sum).",
        starterCode: "class StatsList(list):\n    \"\"\"List with statistical methods.\"\"\"\n    \n    def mean(self):\n        pass\n    \n    def sum(self):\n        pass\n    \n    def min(self):\n        pass\n    \n    def max(self):\n        pass\n\n# Test\ndata = StatsList([10, 20, 30, 40, 50])\nprint(f\"Sum: {data.sum()}\")\nprint(f\"Mean: {data.mean()}\")\nprint(f\"Min: {data.min()}\")\nprint(f\"Max: {data.max()}\")",
        solution: "class StatsList(list):\n    def sum(self):\n        return sum(self)\n    \n    def mean(self):\n        if len(self) == 0:\n            return 0\n        return self.sum() / len(self)\n    \n    def min(self):\n        if len(self) == 0:\n            return None\n        return min(self)\n    \n    def max(self):\n        if len(self) == 0:\n            return None\n        return max(self)\n\ndata = StatsList([10, 20, 30, 40, 50])\nprint(f\"Sum: {data.sum()}\")\nprint(f\"Mean: {data.mean()}\")\nprint(f\"Min: {data.min()}\")\nprint(f\"Max: {data.max()}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Sum: 150\\nMean: 30.0", description: "Stats work" }]),
        hints: ["Use built-in sum(), min(), max()", "Handle empty list case"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson11_3_1.id,
        number: 5,
        title: "Expiring Dict",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a dict where items expire after a certain number of accesses.",
        starterCode: "class ExpiringDict(dict):\n    \"\"\"Dict where items expire after max_accesses reads.\"\"\"\n    \n    def __init__(self, max_accesses=3):\n        pass\n    \n    def __setitem__(self, key, value):\n        pass\n    \n    def __getitem__(self, key):\n        pass\n\n# Test\ned = ExpiringDict(max_accesses=2)\ned['secret'] = 'password123'\nprint(ed['secret'])  # Access 1\nprint(ed['secret'])  # Access 2\nprint(ed.get('secret', 'EXPIRED'))  # Should be expired",
        solution: "class ExpiringDict(dict):\n    def __init__(self, max_accesses=3):\n        super().__init__()\n        self.max_accesses = max_accesses\n        self._access_counts = {}\n    \n    def __setitem__(self, key, value):\n        super().__setitem__(key, value)\n        self._access_counts[key] = 0\n    \n    def __getitem__(self, key):\n        if key not in self:\n            raise KeyError(key)\n        \n        self._access_counts[key] += 1\n        \n        if self._access_counts[key] >= self.max_accesses:\n            value = super().__getitem__(key)\n            del self[key]\n            del self._access_counts[key]\n            return value\n        \n        return super().__getitem__(key)\n\ned = ExpiringDict(max_accesses=2)\ned['secret'] = 'password123'\nprint(ed['secret'])\nprint(ed['secret'])\nprint(ed.get('secret', 'EXPIRED'))",
        testCases: JSON.stringify([{ input: "", expectedOutput: "password123\\npassword123\\nEXPIRED", description: "Expiry works" }]),
        hints: ["Track access count per key", "Delete key when limit reached"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 11.3.1`);

  // ==================== LESSON 11.3.2 ====================
  const lesson11_3_2 = await prisma.lesson.upsert({
    where: { slug: "advanced-oop-patterns" },
    update: {},
    create: {
      sectionId: section11_3.id,
      number: 11.32,
      title: "Advanced OOP Patterns",
      slug: "advanced-oop-patterns",
      objectives: [
        "Understand composition vs inheritance",
        "Know basics of multiple inheritance",
        "Understand duck typing",
        "Apply Pythonic OOP patterns",
      ],
      content: `# Advanced OOP Patterns

## Composition vs Inheritance

### Inheritance: "IS-A" relationship
\`\`\`python
class Dog(Animal):  # Dog IS AN Animal
    pass
\`\`\`

### Composition: "HAS-A" relationship
\`\`\`python
class Car:
    def __init__(self):
        self.engine = Engine()  # Car HAS AN Engine
\`\`\`

### When to Use Which?

**Prefer composition when**:
- You need flexibility
- The relationship isn't truly "is-a"
- You want to change behavior at runtime

**Use inheritance when**:
- There's a clear "is-a" relationship
- You're extending existing behavior
- You want polymorphism

## Duck Typing

"If it walks like a duck and quacks like a duck, it's a duck."

Python doesn't check types—it checks **behavior**:

\`\`\`python
def process(items):
    for item in items:  # Doesn't care about type
        print(item)     # Just needs to be iterable

process([1, 2, 3])      # List works
process((1, 2, 3))      # Tuple works
process("abc")          # String works
\`\`\`

## Multiple Inheritance

Python supports inheriting from multiple classes:

\`\`\`python
class FlyingFish(Fish, Flying):
    pass
\`\`\`

### Method Resolution Order (MRO)
Python uses C3 linearization to determine which method to call:

\`\`\`python
FlyingFish.__mro__  # Shows the order
\`\`\`

⚠️ **Use sparingly**—can get confusing!`,
      codeExamples: JSON.stringify([
        {
          id: "composition",
          title: "Composition Example",
          code: "class Engine:\n    def __init__(self, horsepower):\n        self.horsepower = horsepower\n        self.running = False\n    \n    def start(self):\n        self.running = True\n        print(f\"Engine started ({self.horsepower}hp)\")\n    \n    def stop(self):\n        self.running = False\n        print(\"Engine stopped\")\n\nclass Car:\n    \"\"\"Car HAS-A Engine (composition).\"\"\"\n    \n    def __init__(self, make, model, horsepower):\n        self.make = make\n        self.model = model\n        self.engine = Engine(horsepower)  # Composition\n    \n    def start(self):\n        print(f\"Starting {self.make} {self.model}...\")\n        self.engine.start()\n    \n    def stop(self):\n        self.engine.stop()\n        print(f\"{self.make} {self.model} stopped\")\n\n# Use it\nmy_car = Car(\"Toyota\", \"Camry\", 200)\nmy_car.start()\nprint(f\"Engine running: {my_car.engine.running}\")\nmy_car.stop()",
          description: "Car composed of Engine",
        },
        {
          id: "duck-typing",
          title: "Duck Typing in Action",
          code: "def calculate_total(items):\n    \"\"\"Works with anything that's iterable and has numeric items.\"\"\"\n    total = 0\n    for item in items:\n        total += item\n    return total\n\n# Works with list\nprint(f\"List: {calculate_total([1, 2, 3, 4, 5])}\")\n\n# Works with tuple\nprint(f\"Tuple: {calculate_total((10, 20, 30))}\")\n\n# Works with set\nprint(f\"Set: {calculate_total({5, 10, 15})}\")\n\n# Works with generator\nprint(f\"Generator: {calculate_total(x**2 for x in range(5))}\")\n\n# Works with custom class that implements __iter__\nclass Wallet:\n    def __init__(self):\n        self.bills = [1, 5, 10, 20]\n    \n    def __iter__(self):\n        return iter(self.bills)\n\nwallet = Wallet()\nprint(f\"Wallet: {calculate_total(wallet)}\")\n\nprint(\"\\nDuck typing: If it iterates, we can sum it!\")",
          description: "Behavior matters, not type",
        },
        {
          id: "multiple-inheritance",
          title: "Multiple Inheritance",
          code: "class Swimmer:\n    def swim(self):\n        return \"Swimming!\"\n\nclass Flyer:\n    def fly(self):\n        return \"Flying!\"\n\nclass Walker:\n    def walk(self):\n        return \"Walking!\"\n\n# Multiple inheritance\nclass Duck(Swimmer, Flyer, Walker):\n    def quack(self):\n        return \"Quack!\"\n\nclass Penguin(Swimmer, Walker):\n    pass\n\nclass Sparrow(Flyer, Walker):\n    pass\n\n# Test\nduck = Duck()\nprint(f\"Duck can: {duck.swim()}, {duck.fly()}, {duck.walk()}, {duck.quack()}\")\n\npenguin = Penguin()\nprint(f\"Penguin can: {penguin.swim()}, {penguin.walk()}\")\n\n# Method Resolution Order\nprint(f\"\\nDuck MRO: {[c.__name__ for c in Duck.__mro__]}\")",
          description: "Inheriting from multiple classes",
        },
        {
          id: "mixin-pattern",
          title: "Mixin Pattern",
          code: "class JSONMixin:\n    \"\"\"Mixin that adds JSON serialization.\"\"\"\n    def to_json(self):\n        import json\n        return json.dumps(self.__dict__)\n\nclass PrintableMixin:\n    \"\"\"Mixin that adds pretty printing.\"\"\"\n    def pretty_print(self):\n        print(f\"=== {self.__class__.__name__} ===\")\n        for key, value in self.__dict__.items():\n            print(f\"  {key}: {value}\")\n\nclass Person(JSONMixin, PrintableMixin):\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\nclass Product(JSONMixin, PrintableMixin):\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n\n# Both classes get JSON and pretty print!\nperson = Person(\"Alice\", 30)\nprint(person.to_json())\nperson.pretty_print()\n\nprint()\n\nproduct = Product(\"Laptop\", 999)\nprint(product.to_json())\nproduct.pretty_print()",
          description: "Mixins add reusable functionality",
        },
      ]),
      keyPoints: [
        "Composition: object HAS-A component",
        "Inheritance: object IS-A type",
        "Prefer composition for flexibility",
        "Duck typing: behavior > type",
        "Multiple inheritance is possible but complex",
        "MRO determines method resolution",
        "Mixins add reusable functionality",
        "Python is flexible—choose what fits",
      ],
      hardwareDemo: "Show composition vs inheritance side by side. Demonstrate duck typing.",
      estimatedTime: 30,
      difficulty: "ADVANCED",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson11_3_2.number}: ${lesson11_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson11_3_2.id,
        number: 1,
        title: "Composition Design",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Design a Computer class using composition (has CPU, Memory, Storage).",
        starterCode: "class CPU:\n    def __init__(self, cores, speed_ghz):\n        self.cores = cores\n        self.speed = speed_ghz\n\nclass Memory:\n    def __init__(self, gb):\n        self.gb = gb\n\nclass Storage:\n    def __init__(self, gb, ssd=True):\n        self.gb = gb\n        self.ssd = ssd\n\nclass Computer:\n    \"\"\"Computer composed of CPU, Memory, Storage.\"\"\"\n    pass\n\n# Test\npc = Computer(\n    CPU(8, 3.5),\n    Memory(16),\n    Storage(512, ssd=True)\n)\npc.specs()",
        solution: "class CPU:\n    def __init__(self, cores, speed_ghz):\n        self.cores = cores\n        self.speed = speed_ghz\n\nclass Memory:\n    def __init__(self, gb):\n        self.gb = gb\n\nclass Storage:\n    def __init__(self, gb, ssd=True):\n        self.gb = gb\n        self.ssd = ssd\n\nclass Computer:\n    def __init__(self, cpu, memory, storage):\n        self.cpu = cpu\n        self.memory = memory\n        self.storage = storage\n    \n    def specs(self):\n        storage_type = \"SSD\" if self.storage.ssd else \"HDD\"\n        print(f\"CPU: {self.cpu.cores} cores @ {self.cpu.speed}GHz\")\n        print(f\"Memory: {self.memory.gb}GB\")\n        print(f\"Storage: {self.storage.gb}GB {storage_type}\")\n\npc = Computer(\n    CPU(8, 3.5),\n    Memory(16),\n    Storage(512, ssd=True)\n)\npc.specs()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Specs printed", description: "Composition works" }]),
        hints: ["Computer stores CPU, Memory, Storage as attributes", "specs() accesses component properties"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson11_3_2.id,
        number: 2,
        title: "Duck Typing Function",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function that works with any object that has a 'name' attribute.",
        starterCode: "def greet_all(entities):\n    \"\"\"Greet anything with a 'name' attribute.\"\"\"\n    pass\n\nclass Person:\n    def __init__(self, name):\n        self.name = name\n\nclass Pet:\n    def __init__(self, name, species):\n        self.name = name\n        self.species = species\n\nclass Company:\n    def __init__(self, name):\n        self.name = name\n\n# Test with mixed types\nentities = [Person(\"Alice\"), Pet(\"Fluffy\", \"cat\"), Company(\"Acme Inc\")]\ngreet_all(entities)",
        solution: "def greet_all(entities):\n    for entity in entities:\n        print(f\"Hello, {entity.name}!\")\n\nclass Person:\n    def __init__(self, name):\n        self.name = name\n\nclass Pet:\n    def __init__(self, name, species):\n        self.name = name\n        self.species = species\n\nclass Company:\n    def __init__(self, name):\n        self.name = name\n\nentities = [Person(\"Alice\"), Pet(\"Fluffy\", \"cat\"), Company(\"Acme Inc\")]\ngreet_all(entities)\n\nprint(\"\\nDuck typing: All have 'name', all work!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Hello to all", description: "Duck typing works" }]),
        hints: ["Just access .name", "Don't check types"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson11_3_2.id,
        number: 3,
        title: "Create a Mixin",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a ComparableMixin that adds comparison methods based on a 'value' attribute.",
        starterCode: "class ComparableMixin:\n    \"\"\"Mixin that adds <, >, ==, etc. based on self.value\"\"\"\n    pass\n\nclass Score(ComparableMixin):\n    def __init__(self, points):\n        self.value = points\n\nclass Temperature(ComparableMixin):\n    def __init__(self, degrees):\n        self.value = degrees\n\n# Test\ns1, s2 = Score(85), Score(90)\nprint(f\"Score 85 < 90: {s1 < s2}\")\nprint(f\"Score 85 == 90: {s1 == s2}\")\n\nt1, t2 = Temperature(72), Temperature(72)\nprint(f\"Temp 72 == 72: {t1 == t2}\")",
        solution: "class ComparableMixin:\n    def __lt__(self, other):\n        return self.value < other.value\n    \n    def __le__(self, other):\n        return self.value <= other.value\n    \n    def __gt__(self, other):\n        return self.value > other.value\n    \n    def __ge__(self, other):\n        return self.value >= other.value\n    \n    def __eq__(self, other):\n        return self.value == other.value\n\nclass Score(ComparableMixin):\n    def __init__(self, points):\n        self.value = points\n\nclass Temperature(ComparableMixin):\n    def __init__(self, degrees):\n        self.value = degrees\n\ns1, s2 = Score(85), Score(90)\nprint(f\"Score 85 < 90: {s1 < s2}\")\nprint(f\"Score 85 == 90: {s1 == s2}\")\n\nt1, t2 = Temperature(72), Temperature(72)\nprint(f\"Temp 72 == 72: {t1 == t2}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "True\\nFalse\\nTrue", description: "Mixin adds comparisons" }]),
        hints: ["Implement __lt__, __eq__, etc.", "Compare self.value to other.value"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson11_3_2.id,
        number: 4,
        title: "Multiple Inheritance",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a SmartPhone class that inherits from Phone, Camera, and Computer.",
        starterCode: "class Phone:\n    def call(self, number):\n        return f\"Calling {number}...\"\n\nclass Camera:\n    def take_photo(self):\n        return \"Click! Photo taken.\"\n\nclass Computer:\n    def browse_web(self, url):\n        return f\"Loading {url}...\"\n\nclass SmartPhone:\n    \"\"\"Inherits from Phone, Camera, Computer.\"\"\"\n    pass\n\n# Test\niphone = SmartPhone()\nprint(iphone.call(\"555-1234\"))\nprint(iphone.take_photo())\nprint(iphone.browse_web(\"google.com\"))",
        solution: "class Phone:\n    def call(self, number):\n        return f\"Calling {number}...\"\n\nclass Camera:\n    def take_photo(self):\n        return \"Click! Photo taken.\"\n\nclass Computer:\n    def browse_web(self, url):\n        return f\"Loading {url}...\"\n\nclass SmartPhone(Phone, Camera, Computer):\n    def __init__(self, model=\"Generic\"):\n        self.model = model\n    \n    def __str__(self):\n        return f\"SmartPhone ({self.model})\"\n\niphone = SmartPhone(\"iPhone\")\nprint(iphone.call(\"555-1234\"))\nprint(iphone.take_photo())\nprint(iphone.browse_web(\"google.com\"))\nprint(f\"MRO: {[c.__name__ for c in SmartPhone.__mro__]}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All methods work", description: "Multiple inheritance" }]),
        hints: ["List all parent classes in class definition", "SmartPhone(Phone, Camera, Computer)"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson11_3_2.id,
        number: 5,
        title: "Composition vs Inheritance",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement the same functionality using both composition and inheritance, compare.",
        starterCode: "# Logger functionality to add to classes\n\n# INHERITANCE approach\nclass LoggerBase:\n    def log(self, message):\n        print(f\"[LOG] {message}\")\n\nclass OrderInheritance(LoggerBase):\n    pass\n\n# COMPOSITION approach\nclass Logger:\n    def log(self, message):\n        print(f\"[LOG] {message}\")\n\nclass OrderComposition:\n    pass\n\n# Implement both and compare",
        solution: "# INHERITANCE approach\nclass LoggerBase:\n    def log(self, message):\n        print(f\"[LOG] {message}\")\n\nclass OrderInheritance(LoggerBase):\n    def __init__(self, order_id):\n        self.order_id = order_id\n    \n    def process(self):\n        self.log(f\"Processing order {self.order_id}\")\n        # ... do work ...\n        self.log(f\"Order {self.order_id} complete\")\n\n# COMPOSITION approach\nclass Logger:\n    def log(self, message):\n        print(f\"[LOG] {message}\")\n\nclass OrderComposition:\n    def __init__(self, order_id):\n        self.order_id = order_id\n        self.logger = Logger()  # Composition\n    \n    def process(self):\n        self.logger.log(f\"Processing order {self.order_id}\")\n        # ... do work ...\n        self.logger.log(f\"Order {self.order_id} complete\")\n\nprint(\"Inheritance:\")\norder1 = OrderInheritance(\"001\")\norder1.process()\n\nprint(\"\\nComposition:\")\norder2 = OrderComposition(\"002\")\norder2.process()\n\nprint(\"\\nComposition is more flexible:\")\nprint(\"- Can swap logger at runtime\")\nprint(\"- Order doesn't 'IS-A' Logger\")\nprint(\"- Better separation of concerns\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Both work", description: "Comparison shown" }]),
        hints: ["Inheritance: Order IS-A Logger", "Composition: Order HAS-A Logger"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 11.3.2`);

  // ==================== LESSON 11.4.1 ====================
  const lesson11_4_1 = await prisma.lesson.upsert({
    where: { slug: "putting-together-plotting-classes" },
    update: {},
    create: {
      sectionId: section11_4.id,
      number: 11.41,
      title: "Putting It Together",
      slug: "putting-together-plotting-classes",
      objectives: [
        "Combine classes with visualization",
        "Build complete data analysis workflow",
        "Create reusable plotting classes",
        "Apply all chapter concepts",
      ],
      content: `# Putting It Together

## The Complete Workflow

1. **Design classes** to model your data
2. **Load/generate data** into objects
3. **Process data** using class methods
4. **Visualize** using matplotlib
5. **Iterate** and refine

## Example: Stock Portfolio Analyzer

We'll create:
- \`Stock\` class with price history
- \`Portfolio\` class that holds stocks
- Methods for analysis
- Visualization of performance

## Design Principles

### 1. Separate Data from Visualization
\`\`\`python
class Stock:
    def __init__(self, symbol, prices):
        self.symbol = symbol
        self.prices = prices
    
    def returns(self):
        # Data processing method
        pass
    
    def plot(self, ax):
        # Visualization method (takes axes)
        pass
\`\`\`

### 2. Make Classes Reusable
- Accept matplotlib axes as parameter
- Don't hard-code figure sizes
- Return data for further processing

### 3. Use Properties for Computed Values
\`\`\`python
@property
def average_price(self):
    return sum(self.prices) / len(self.prices)
\`\`\`

## Best Practices

- Keep classes focused (single responsibility)
- Add docstrings
- Validate input data
- Make visualization optional/configurable`,
      codeExamples: JSON.stringify([
        {
          id: "stock-class",
          title: "Stock Class with Plotting",
          code: "import matplotlib.pyplot as plt\n\nclass Stock:\n    \"\"\"Stock with price history and analysis.\"\"\"\n    \n    def __init__(self, symbol, prices):\n        self.symbol = symbol\n        self.prices = prices\n    \n    @property\n    def current_price(self):\n        return self.prices[-1]\n    \n    @property\n    def average_price(self):\n        return sum(self.prices) / len(self.prices)\n    \n    def daily_returns(self):\n        \"\"\"Calculate daily percentage returns.\"\"\"\n        returns = []\n        for i in range(1, len(self.prices)):\n            ret = (self.prices[i] - self.prices[i-1]) / self.prices[i-1] * 100\n            returns.append(ret)\n        return returns\n    \n    def plot(self, ax=None):\n        \"\"\"Plot price history.\"\"\"\n        if ax is None:\n            fig, ax = plt.subplots(figsize=(10, 5))\n        \n        days = list(range(1, len(self.prices) + 1))\n        ax.plot(days, self.prices, label=self.symbol, linewidth=2)\n        ax.set_xlabel('Day')\n        ax.set_ylabel('Price ($)')\n        ax.set_title(f'{self.symbol} Price History')\n        ax.legend()\n        ax.grid(True, alpha=0.3)\n        return ax\n\n# Test\nimport random\nrandom.seed(42)\nprices = [100]\nfor _ in range(29):\n    prices.append(prices[-1] * (1 + random.uniform(-0.03, 0.04)))\n\nstock = Stock('ACME', prices)\nprint(f\"Symbol: {stock.symbol}\")\nprint(f\"Current: ${stock.current_price:.2f}\")\nprint(f\"Average: ${stock.average_price:.2f}\")\nstock.plot()\nplt.show()",
          description: "Complete Stock class",
        },
        {
          id: "portfolio-class",
          title: "Portfolio with Multiple Stocks",
          code: "import matplotlib.pyplot as plt\nimport random\n\nclass Stock:\n    def __init__(self, symbol, prices):\n        self.symbol = symbol\n        self.prices = prices\n    \n    @property\n    def total_return(self):\n        return (self.prices[-1] - self.prices[0]) / self.prices[0] * 100\n\nclass Portfolio:\n    \"\"\"Portfolio of multiple stocks.\"\"\"\n    \n    def __init__(self):\n        self.stocks = []\n    \n    def add_stock(self, stock):\n        self.stocks.append(stock)\n    \n    def total_value(self, shares_per_stock=1):\n        return sum(s.prices[-1] * shares_per_stock for s in self.stocks)\n    \n    def plot_comparison(self):\n        \"\"\"Plot all stocks normalized to 100.\"\"\"\n        fig, ax = plt.subplots(figsize=(12, 6))\n        \n        for stock in self.stocks:\n            # Normalize to start at 100\n            normalized = [p / stock.prices[0] * 100 for p in stock.prices]\n            days = list(range(1, len(normalized) + 1))\n            ax.plot(days, normalized, label=f\"{stock.symbol} ({stock.total_return:+.1f}%)\", linewidth=2)\n        \n        ax.axhline(y=100, color='gray', linestyle='--', alpha=0.5)\n        ax.set_xlabel('Day')\n        ax.set_ylabel('Normalized Value (Start = 100)')\n        ax.set_title('Portfolio Performance Comparison')\n        ax.legend()\n        ax.grid(True, alpha=0.3)\n        return fig, ax\n\n# Create portfolio\nrandom.seed(42)\nportfolio = Portfolio()\n\nfor symbol, trend in [('TECH', 0.02), ('BANK', -0.005), ('RETAIL', 0.01)]:\n    prices = [100]\n    for _ in range(29):\n        prices.append(prices[-1] * (1 + trend + random.uniform(-0.02, 0.02)))\n    portfolio.add_stock(Stock(symbol, prices))\n\nportfolio.plot_comparison()\nplt.tight_layout()\nplt.show()",
          description: "Portfolio manages multiple stocks",
        },
        {
          id: "data-analyzer",
          title: "Complete Data Analyzer Class",
          code: "import matplotlib.pyplot as plt\n\nclass DataAnalyzer:\n    \"\"\"Reusable data analysis and visualization.\"\"\"\n    \n    def __init__(self, data, labels=None):\n        self.data = data\n        self.labels = labels or list(range(len(data)))\n    \n    @property\n    def mean(self):\n        return sum(self.data) / len(self.data)\n    \n    @property\n    def min(self):\n        return min(self.data)\n    \n    @property\n    def max(self):\n        return max(self.data)\n    \n    def summary(self):\n        print(f\"Count: {len(self.data)}\")\n        print(f\"Mean: {self.mean:.2f}\")\n        print(f\"Min: {self.min:.2f}\")\n        print(f\"Max: {self.max:.2f}\")\n    \n    def plot_line(self, ax=None, **kwargs):\n        if ax is None:\n            fig, ax = plt.subplots(figsize=(10, 5))\n        ax.plot(self.labels, self.data, **kwargs)\n        ax.axhline(y=self.mean, color='red', linestyle='--', label=f'Mean: {self.mean:.1f}')\n        ax.legend()\n        ax.grid(True, alpha=0.3)\n        return ax\n    \n    def plot_bar(self, ax=None, **kwargs):\n        if ax is None:\n            fig, ax = plt.subplots(figsize=(10, 5))\n        ax.bar(self.labels, self.data, **kwargs)\n        ax.axhline(y=self.mean, color='red', linestyle='--')\n        return ax\n\n# Use it\nmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']\nsales = [100, 120, 115, 140, 155, 170]\n\nanalyzer = DataAnalyzer(sales, months)\nanalyzer.summary()\n\nfig, axes = plt.subplots(1, 2, figsize=(14, 5))\nanalyzer.plot_line(axes[0], color='blue', marker='o')\naxes[0].set_title('Line Plot')\nanalyzer.plot_bar(axes[1], color='steelblue')\naxes[1].set_title('Bar Chart')\nplt.tight_layout()\nplt.show()",
          description: "Reusable analyzer class",
        },
        {
          id: "complete-workflow",
          title: "Complete Analysis Workflow",
          code: "import matplotlib.pyplot as plt\nimport random\n\nclass SalesData:\n    \"\"\"Sales data with analysis and visualization.\"\"\"\n    \n    def __init__(self, product_name):\n        self.product_name = product_name\n        self.monthly_sales = {}\n    \n    def add_month(self, month, sales):\n        self.monthly_sales[month] = sales\n    \n    def generate_report(self):\n        \"\"\"Print text summary.\"\"\"\n        total = sum(self.monthly_sales.values())\n        avg = total / len(self.monthly_sales)\n        best_month = max(self.monthly_sales, key=self.monthly_sales.get)\n        \n        print(f\"=== {self.product_name} Sales Report ===\")\n        print(f\"Total Sales: ${total:,}\")\n        print(f\"Average Monthly: ${avg:,.0f}\")\n        print(f\"Best Month: {best_month} (${self.monthly_sales[best_month]:,})\")\n    \n    def create_dashboard(self):\n        \"\"\"Create visual dashboard.\"\"\"\n        months = list(self.monthly_sales.keys())\n        values = list(self.monthly_sales.values())\n        avg = sum(values) / len(values)\n        \n        fig, axes = plt.subplots(1, 2, figsize=(14, 5))\n        \n        # Line trend\n        axes[0].plot(months, values, 'b-o', linewidth=2, markersize=8)\n        axes[0].axhline(y=avg, color='red', linestyle='--', label=f'Avg: ${avg:,.0f}')\n        axes[0].set_ylabel('Sales ($)')\n        axes[0].set_title(f'{self.product_name} Monthly Trend')\n        axes[0].legend()\n        axes[0].grid(True, alpha=0.3)\n        \n        # Bar comparison\n        colors = ['green' if v >= avg else 'red' for v in values]\n        axes[1].bar(months, values, color=colors, alpha=0.7)\n        axes[1].axhline(y=avg, color='black', linestyle='--')\n        axes[1].set_ylabel('Sales ($)')\n        axes[1].set_title('Above/Below Average')\n        \n        plt.suptitle(f'{self.product_name} Sales Dashboard', fontsize=14, fontweight='bold')\n        plt.tight_layout()\n        return fig\n\n# Complete workflow\nrandom.seed(42)\nproduct = SalesData(\"Widget Pro\")\n\nfor month in ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']:\n    product.add_month(month, random.randint(80, 150) * 1000)\n\nproduct.generate_report()\nprint()\nproduct.create_dashboard()\nplt.show()",
          description: "Full data analysis workflow",
        },
      ]),
      keyPoints: [
        "Combine classes with matplotlib",
        "Separate data logic from visualization",
        "Accept axes as parameter for flexibility",
        "Use properties for computed values",
        "Create dashboards with subplots",
        "Add summary/report methods",
        "Make classes reusable",
        "Complete workflow: load → process → visualize",
      ],
      hardwareDemo: "Build complete analysis tool from scratch. Show interactive dashboard creation.",
      estimatedTime: 35,
      difficulty: "ADVANCED",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson11_4_1.number}: ${lesson11_4_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson11_4_1.id,
        number: 1,
        title: "Temperature Tracker",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a TemperatureTracker class with data storage and plotting.",
        starterCode: "import matplotlib.pyplot as plt\n\nclass TemperatureTracker:\n    \"\"\"Track and visualize temperatures.\"\"\"\n    \n    def __init__(self, location):\n        pass\n    \n    def add_reading(self, day, temp):\n        pass\n    \n    @property\n    def average(self):\n        pass\n    \n    def plot(self):\n        pass\n\n# Test\ntracker = TemperatureTracker(\"Boston\")\nfor day, temp in [(1, 45), (2, 48), (3, 52), (4, 49), (5, 55)]:\n    tracker.add_reading(day, temp)\n\nprint(f\"Average: {tracker.average}°F\")\ntracker.plot()",
        solution: "import matplotlib.pyplot as plt\n\nclass TemperatureTracker:\n    def __init__(self, location):\n        self.location = location\n        self.readings = {}  # day -> temp\n    \n    def add_reading(self, day, temp):\n        self.readings[day] = temp\n    \n    @property\n    def average(self):\n        if not self.readings:\n            return 0\n        return sum(self.readings.values()) / len(self.readings)\n    \n    def plot(self):\n        days = list(self.readings.keys())\n        temps = list(self.readings.values())\n        \n        fig, ax = plt.subplots(figsize=(10, 5))\n        ax.plot(days, temps, 'r-o', linewidth=2)\n        ax.axhline(y=self.average, color='blue', linestyle='--', label=f'Avg: {self.average:.1f}°F')\n        ax.set_xlabel('Day')\n        ax.set_ylabel('Temperature (°F)')\n        ax.set_title(f'{self.location} Temperature')\n        ax.legend()\n        ax.grid(True, alpha=0.3)\n        plt.show()\n\ntracker = TemperatureTracker(\"Boston\")\nfor day, temp in [(1, 45), (2, 48), (3, 52), (4, 49), (5, 55)]:\n    tracker.add_reading(day, temp)\n\nprint(f\"Average: {tracker.average}°F\")\ntracker.plot()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Average and plot", description: "Tracker works" }]),
        hints: ["Store readings in dict", "Property for average", "Plot method creates figure"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson11_4_1.id,
        number: 2,
        title: "Grade Book",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a GradeBook class that stores student grades and visualizes them.",
        starterCode: "import matplotlib.pyplot as plt\n\nclass GradeBook:\n    \"\"\"Track student grades with visualization.\"\"\"\n    \n    def __init__(self, course_name):\n        pass\n    \n    def add_grade(self, student, grade):\n        pass\n    \n    def class_average(self):\n        pass\n    \n    def plot_grades(self):\n        \"\"\"Bar chart of grades.\"\"\"\n        pass\n\n# Test\ngb = GradeBook(\"Python 101\")\nfor student, grade in [('Alice', 92), ('Bob', 85), ('Carol', 78), ('Dave', 95), ('Eve', 88)]:\n    gb.add_grade(student, grade)\n\nprint(f\"Class average: {gb.class_average()}\")\ngb.plot_grades()",
        solution: "import matplotlib.pyplot as plt\n\nclass GradeBook:\n    def __init__(self, course_name):\n        self.course_name = course_name\n        self.grades = {}\n    \n    def add_grade(self, student, grade):\n        self.grades[student] = grade\n    \n    def class_average(self):\n        if not self.grades:\n            return 0\n        return sum(self.grades.values()) / len(self.grades)\n    \n    def plot_grades(self):\n        students = list(self.grades.keys())\n        grades = list(self.grades.values())\n        avg = self.class_average()\n        \n        colors = ['green' if g >= avg else 'orange' for g in grades]\n        \n        fig, ax = plt.subplots(figsize=(10, 5))\n        bars = ax.bar(students, grades, color=colors)\n        ax.axhline(y=avg, color='red', linestyle='--', label=f'Average: {avg:.1f}')\n        \n        for bar, grade in zip(bars, grades):\n            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,\n                    str(grade), ha='center', fontweight='bold')\n        \n        ax.set_ylabel('Grade')\n        ax.set_title(f'{self.course_name} Grades')\n        ax.legend()\n        ax.set_ylim(0, 105)\n        plt.show()\n\ngb = GradeBook(\"Python 101\")\nfor student, grade in [('Alice', 92), ('Bob', 85), ('Carol', 78), ('Dave', 95), ('Eve', 88)]:\n    gb.add_grade(student, grade)\n\nprint(f\"Class average: {gb.class_average()}\")\ngb.plot_grades()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Average and bar chart", description: "GradeBook works" }]),
        hints: ["Color bars above/below average differently", "Add grade labels on bars"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson11_4_1.id,
        number: 3,
        title: "Expense Tracker",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create an ExpenseTracker with multiple categories and pie chart.",
        starterCode: "import matplotlib.pyplot as plt\n\nclass ExpenseTracker:\n    \"\"\"Track expenses by category.\"\"\"\n    \n    def __init__(self):\n        pass\n    \n    def add_expense(self, category, amount):\n        pass\n    \n    def total(self):\n        pass\n    \n    def by_category(self):\n        \"\"\"Return dict of category totals.\"\"\"\n        pass\n    \n    def plot_breakdown(self):\n        \"\"\"Pie chart of expenses.\"\"\"\n        pass\n\n# Test\ntracker = ExpenseTracker()\nexpenses = [\n    ('Food', 150), ('Food', 75), ('Transport', 50),\n    ('Entertainment', 100), ('Utilities', 120), ('Food', 80)\n]\nfor cat, amt in expenses:\n    tracker.add_expense(cat, amt)\n\nprint(f\"Total: ${tracker.total()}\")\nprint(f\"By category: {tracker.by_category()}\")\ntracker.plot_breakdown()",
        solution: "import matplotlib.pyplot as plt\n\nclass ExpenseTracker:\n    def __init__(self):\n        self.expenses = []  # List of (category, amount)\n    \n    def add_expense(self, category, amount):\n        self.expenses.append((category, amount))\n    \n    def total(self):\n        return sum(amt for _, amt in self.expenses)\n    \n    def by_category(self):\n        totals = {}\n        for cat, amt in self.expenses:\n            totals[cat] = totals.get(cat, 0) + amt\n        return totals\n    \n    def plot_breakdown(self):\n        by_cat = self.by_category()\n        categories = list(by_cat.keys())\n        amounts = list(by_cat.values())\n        \n        fig, axes = plt.subplots(1, 2, figsize=(14, 5))\n        \n        # Pie chart\n        axes[0].pie(amounts, labels=categories, autopct='%1.1f%%')\n        axes[0].set_title('Expense Breakdown')\n        \n        # Bar chart\n        colors = plt.cm.Set3(range(len(categories)))\n        axes[1].bar(categories, amounts, color=colors)\n        axes[1].set_ylabel('Amount ($)')\n        axes[1].set_title(f'Total: ${self.total()}')\n        \n        for i, (cat, amt) in enumerate(by_cat.items()):\n            axes[1].text(i, amt + 5, f'${amt}', ha='center')\n        \n        plt.tight_layout()\n        plt.show()\n\ntracker = ExpenseTracker()\nexpenses = [\n    ('Food', 150), ('Food', 75), ('Transport', 50),\n    ('Entertainment', 100), ('Utilities', 120), ('Food', 80)\n]\nfor cat, amt in expenses:\n    tracker.add_expense(cat, amt)\n\nprint(f\"Total: ${tracker.total()}\")\nprint(f\"By category: {tracker.by_category()}\")\ntracker.plot_breakdown()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Total, breakdown, and charts", description: "Expense tracker works" }]),
        hints: ["Aggregate by category", "Pie for proportions, bar for comparison"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson11_4_1.id,
        number: 4,
        title: "Fitness Tracker",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a FitnessTracker that tracks workouts and creates a dashboard.",
        starterCode: "import matplotlib.pyplot as plt\n\nclass FitnessTracker:\n    \"\"\"Track workouts with visualization.\"\"\"\n    \n    def __init__(self, user_name):\n        pass\n    \n    def log_workout(self, date, workout_type, duration_min, calories):\n        pass\n    \n    def weekly_summary(self):\n        pass\n    \n    def create_dashboard(self):\n        \"\"\"2x2 dashboard: duration trend, calories trend, \n           workout types pie, summary stats.\"\"\"\n        pass\n\n# Test",
        solution: "import matplotlib.pyplot as plt\n\nclass FitnessTracker:\n    def __init__(self, user_name):\n        self.user_name = user_name\n        self.workouts = []  # List of dicts\n    \n    def log_workout(self, date, workout_type, duration_min, calories):\n        self.workouts.append({\n            'date': date,\n            'type': workout_type,\n            'duration': duration_min,\n            'calories': calories\n        })\n    \n    def weekly_summary(self):\n        total_duration = sum(w['duration'] for w in self.workouts)\n        total_calories = sum(w['calories'] for w in self.workouts)\n        return {\n            'workouts': len(self.workouts),\n            'total_minutes': total_duration,\n            'total_calories': total_calories,\n            'avg_duration': total_duration / len(self.workouts) if self.workouts else 0\n        }\n    \n    def create_dashboard(self):\n        dates = [w['date'] for w in self.workouts]\n        durations = [w['duration'] for w in self.workouts]\n        calories = [w['calories'] for w in self.workouts]\n        \n        # Count by type\n        types = {}\n        for w in self.workouts:\n            types[w['type']] = types.get(w['type'], 0) + 1\n        \n        fig, axes = plt.subplots(2, 2, figsize=(12, 10))\n        \n        # Duration trend\n        axes[0, 0].plot(dates, durations, 'b-o')\n        axes[0, 0].set_title('Duration Trend')\n        axes[0, 0].set_ylabel('Minutes')\n        axes[0, 0].tick_params(axis='x', rotation=45)\n        \n        # Calories trend\n        axes[0, 1].plot(dates, calories, 'r-o')\n        axes[0, 1].set_title('Calories Burned')\n        axes[0, 1].set_ylabel('Calories')\n        axes[0, 1].tick_params(axis='x', rotation=45)\n        \n        # Workout types\n        axes[1, 0].pie(types.values(), labels=types.keys(), autopct='%1.0f%%')\n        axes[1, 0].set_title('Workout Types')\n        \n        # Summary stats\n        axes[1, 1].axis('off')\n        summary = self.weekly_summary()\n        text = f\"\"\"Summary for {self.user_name}\n        \nTotal Workouts: {summary['workouts']}\nTotal Minutes: {summary['total_minutes']}\nTotal Calories: {summary['total_calories']}\nAvg Duration: {summary['avg_duration']:.0f} min\"\"\"\n        axes[1, 1].text(0.1, 0.5, text, fontsize=14, family='monospace')\n        \n        plt.suptitle(f\"{self.user_name}'s Fitness Dashboard\", fontsize=14, fontweight='bold')\n        plt.tight_layout()\n        plt.show()\n\n# Test\nft = FitnessTracker(\"Alice\")\nft.log_workout('Mon', 'Running', 30, 300)\nft.log_workout('Tue', 'Weights', 45, 200)\nft.log_workout('Wed', 'Running', 35, 350)\nft.log_workout('Thu', 'Yoga', 60, 150)\nft.log_workout('Fri', 'Running', 40, 400)\n\nprint(ft.weekly_summary())\nft.create_dashboard()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Complete dashboard", description: "Fitness tracker works" }]),
        hints: ["Store workouts as list of dicts", "Create 2x2 subplot dashboard"],
        xpReward: 25,
        order: 4,
      },
      {
        lessonId: lesson11_4_1.id,
        number: 5,
        title: "Complete Analysis Tool",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a reusable DataAnalyzer class that works with any numeric data.",
        starterCode: "import matplotlib.pyplot as plt\n\nclass DataAnalyzer:\n    \"\"\"Reusable data analysis with flexible visualization.\"\"\"\n    \n    def __init__(self, name, x_data, y_data, x_label='X', y_label='Y'):\n        pass\n    \n    # Add: mean, min, max properties\n    # Add: summary() method\n    # Add: plot_line(), plot_bar(), plot_scatter() methods\n    # Add: full_report() that creates dashboard\n\n# Test with sales data\nmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']\nsales = [100, 120, 115, 140, 155, 170]\n\nanalyzer = DataAnalyzer('Sales Analysis', months, sales, 'Month', 'Sales ($K)')\nanalyzer.full_report()",
        solution: "import matplotlib.pyplot as plt\n\nclass DataAnalyzer:\n    def __init__(self, name, x_data, y_data, x_label='X', y_label='Y'):\n        self.name = name\n        self.x_data = x_data\n        self.y_data = y_data\n        self.x_label = x_label\n        self.y_label = y_label\n    \n    @property\n    def mean(self):\n        return sum(self.y_data) / len(self.y_data)\n    \n    @property\n    def min(self):\n        return min(self.y_data)\n    \n    @property\n    def max(self):\n        return max(self.y_data)\n    \n    def summary(self):\n        return {\n            'count': len(self.y_data),\n            'mean': self.mean,\n            'min': self.min,\n            'max': self.max,\n            'range': self.max - self.min\n        }\n    \n    def plot_line(self, ax=None, **kwargs):\n        if ax is None:\n            fig, ax = plt.subplots()\n        ax.plot(self.x_data, self.y_data, **kwargs)\n        ax.axhline(y=self.mean, color='red', linestyle='--', alpha=0.5)\n        ax.set_xlabel(self.x_label)\n        ax.set_ylabel(self.y_label)\n        return ax\n    \n    def plot_bar(self, ax=None, **kwargs):\n        if ax is None:\n            fig, ax = plt.subplots()\n        ax.bar(self.x_data, self.y_data, **kwargs)\n        ax.axhline(y=self.mean, color='red', linestyle='--', alpha=0.5)\n        ax.set_xlabel(self.x_label)\n        ax.set_ylabel(self.y_label)\n        return ax\n    \n    def full_report(self):\n        fig, axes = plt.subplots(2, 2, figsize=(12, 10))\n        \n        # Line plot\n        self.plot_line(axes[0, 0], marker='o', color='blue')\n        axes[0, 0].set_title('Trend')\n        axes[0, 0].grid(True, alpha=0.3)\n        \n        # Bar chart\n        self.plot_bar(axes[0, 1], color='steelblue')\n        axes[0, 1].set_title('Comparison')\n        \n        # Distribution (histogram-like with bars)\n        axes[1, 0].hist(self.y_data, bins=5, color='green', edgecolor='black')\n        axes[1, 0].set_title('Distribution')\n        axes[1, 0].set_xlabel(self.y_label)\n        axes[1, 0].set_ylabel('Frequency')\n        \n        # Summary text\n        axes[1, 1].axis('off')\n        summary = self.summary()\n        text = f\"\"\"=== {self.name} ===\n\nCount: {summary['count']}\nMean: {summary['mean']:.2f}\nMin: {summary['min']:.2f}\nMax: {summary['max']:.2f}\nRange: {summary['range']:.2f}\"\"\"\n        axes[1, 1].text(0.1, 0.5, text, fontsize=14, family='monospace',\n                        verticalalignment='center')\n        \n        plt.suptitle(self.name, fontsize=16, fontweight='bold')\n        plt.tight_layout()\n        plt.show()\n\nmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']\nsales = [100, 120, 115, 140, 155, 170]\n\nanalyzer = DataAnalyzer('Sales Analysis', months, sales, 'Month', 'Sales ($K)')\nanalyzer.full_report()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Complete dashboard", description: "Full analyzer works" }]),
        hints: ["Accept axes parameter for flexibility", "Create comprehensive dashboard"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 11.4.1`);

  // Verify Chapter 11 is complete
  const chapter11 = await prisma.chapter.findFirst({
    where: { number: 11 },
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

  if (chapter11) {
    console.log("\n" + "=".repeat(60));
    console.log("📚 CHAPTER 11 COMPLETE!");
    console.log("=".repeat(60));
    
    let totalLessons = 0;
    let totalExercises = 0;
    
    for (const section of chapter11.sections) {
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
