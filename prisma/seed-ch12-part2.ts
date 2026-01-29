import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 2: Lessons 12.1.2 and 12.1.3 (Random Walks)...\n");

  const section12_1 = await prisma.section.findFirst({
    where: { number: 12.1 },
  });
  if (!section12_1) throw new Error("Section 12.1 not found. Run part 1 first.");

  const lesson12_1_2 = await prisma.lesson.upsert({
    where: { slug: "random-walks-1d" },
    update: {},
    create: {
      sectionId: section12_1.id,
      number: 12.12,
      title: "Random Walks - 1D",
      slug: "random-walks-1d",
      objectives: [
        "Understand the concept of a random walk",
        "Implement a simple 1D random walk",
        "Track random walk paths",
        "Understand statistical properties of random walks",
      ],
      content: `# Random Walks - 1D

A **random walk** is a path of random steps. Imagine a person so disoriented that each step is in a random direction!

## 1D Random Walk

- Start at position 0
- Each step: flip coin → heads (+1) or tails (-1)
- Repeat N times

\`\`\`python
import random

position = 0
for _ in range(100):
    step = random.choice([-1, 1])
    position += step
print(f"Final position: {position}")
\`\`\`

## Applications

Random walks model:
- Stock prices
- Particle diffusion (Brownian motion)
- Animal foraging
- Website navigation

## Statistical Properties

After N steps:
- **Expected position**: 0 (steps cancel out)
- **Expected distance from origin**: √N (not N!)

100 steps → expect ~10 units from origin (√100 = 10)

## Tracking the Path

\`\`\`python
def random_walk_1d(num_steps):
    positions = [0]  # Start at origin
    for _ in range(num_steps):
        step = random.choice([-1, 1])
        positions.append(positions[-1] + step)
    return positions
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "simple-walk",
          title: "Simple 1D Walk",
          code: `import random

position = 0
for i in range(10):
    step = random.choice([-1, 1])
    position += step
    print(f"Step {i+1}: position = {position}")

print(f"Final: {position}")`,
          description: "Basic 1D random walk",
        },
        {
          id: "track-path",
          title: "Track Full Path",
          code: `import random

def random_walk_1d(num_steps):
    positions = [0]
    for _ in range(num_steps):
        step = random.choice([-1, 1])
        positions.append(positions[-1] + step)
    return positions

path = random_walk_1d(20)
print(f"Path: {path}")
print(f"Final: {path[-1]}")`,
          description: "Recording the entire path",
        },
        {
          id: "multiple-walks",
          title: "Multiple Walks",
          code: `import random

for walk in range(5):
    position = 0
    for _ in range(100):
        position += random.choice([-1, 1])
    print(f"Walk {walk+1}: final = {position}")`,
          description: "Each walk ends differently",
        },
      ]),
      keyPoints: [
        "Random walk: path of random steps",
        "1D: each step is +1 or -1 randomly",
        "Expected final position: 0",
        "Expected distance from origin: √N",
        "Track path with a list of positions",
      ],
      hardwareDemo: "Watch position variable change in memory as steps are taken.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson12_1_2.number}: ${lesson12_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson12_1_2.id,
        number: 1,
        title: "Basic 1D Walk",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Implement a 1D random walk of 20 steps. Print the final position.",
        starterCode: `import random

position = 0
for i in range(20):
    step = # +1 or -1 randomly
    position += step

print(f"Final position: {position}")`,
        solution: `import random

position = 0
for i in range(20):
    step = random.choice([-1, 1])
    position += step

print(f"Final position: {position}")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "Integer position", description: "Final position printed" }]),
        hints: ["Use random.choice([-1, 1])", "Add step to position each iteration", "Final position between -20 and +20"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson12_1_2.id,
        number: 2,
        title: "Track Path",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a function random_walk_1d(n) that returns a list of all positions.",
        starterCode: `import random

def random_walk_1d(num_steps):
    positions = [0]
    for _ in range(num_steps):
        step = random.choice([-1, 1])
        # Add new position to list
        pass
    return positions

path = random_walk_1d(10)
print(f"Path: {path}")
print(f"Length: {len(path)}")  # Should be 11`,
        solution: `import random

def random_walk_1d(num_steps):
    positions = [0]
    for _ in range(num_steps):
        step = random.choice([-1, 1])
        positions.append(positions[-1] + step)
    return positions

path = random_walk_1d(10)
print(f"Path: {path}")
print(f"Length: {len(path)}")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "List of 11 positions", description: "Path tracked" }]),
        hints: ["positions[-1] is current position", "Add step to get new position", "Use positions.append()"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson12_1_2.id,
        number: 3,
        title: "Average Distance",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Run 100 walks of 100 steps. Calculate average distance from origin. Compare to √100=10.",
        starterCode: `import random
import math

total_distance = 0

for _ in range(100):
    position = 0
    for _ in range(100):
        position += random.choice([-1, 1])
    total_distance += abs(position)

avg_distance = total_distance / 100
print(f"Average distance: {avg_distance:.2f}")
print(f"Theoretical (sqrt N): {math.sqrt(100):.2f}")`,
        solution: `import random
import math

total_distance = 0

for _ in range(100):
    position = 0
    for _ in range(100):
        position += random.choice([-1, 1])
    total_distance += abs(position)

avg_distance = total_distance / 100
print(f"Average distance: {avg_distance:.2f}")
print(f"Theoretical (sqrt N): {math.sqrt(100):.2f}")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "Near 10", description: "Close to sqrt(100)" }]),
        hints: ["Distance = abs(position)", "Sum all distances, divide by 100", "Should be close to 10"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson12_1_2.id,
        number: 4,
        title: "Biased Walk",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a biased walk: 60% chance right (+1), 40% chance left (-1). Run 10 walks of 100 steps.",
        starterCode: `import random

def biased_walk(num_steps, p_right=0.6):
    position = 0
    for _ in range(num_steps):
        if random.random() < p_right:
            position += 1
        else:
            position -= 1
    return position

for i in range(10):
    final = biased_walk(100)
    print(f"Walk {i+1}: {final}")`,
        solution: `import random

def biased_walk(num_steps, p_right=0.6):
    position = 0
    for _ in range(num_steps):
        if random.random() < p_right:
            position += 1
        else:
            position -= 1
    return position

for i in range(10):
    final = biased_walk(100)
    print(f"Walk {i+1}: {final}")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "Mostly positive", description: "Biased right" }]),
        hints: ["random.random() < 0.6 is true 60% of time", "Expected: 100*(0.6-0.4) = 20", "Positions should be mostly positive"],
        xpReward: 20,
        order: 4,
      },
    ],
  });
  console.log(`      ✏️  4 exercises created for 12.1.2`);

  const lesson12_1_3 = await prisma.lesson.upsert({
    where: { slug: "random-walks-2d" },
    update: {},
    create: {
      sectionId: section12_1.id,
      number: 12.13,
      title: "Random Walks - 2D",
      slug: "random-walks-2d",
      objectives: [
        "Extend random walks to two dimensions",
        "Implement 2D walks with four directions",
        "Calculate Euclidean distance",
        "Use OOP for walker simulation",
      ],
      content: `# 2D Random Walks

Extend to 2D: instead of left/right, now have four directions: N, S, E, W.

## Implementation

\`\`\`python
import random

x, y = 0, 0
for _ in range(100):
    direction = random.choice(['N', 'S', 'E', 'W'])
    if direction == 'N': y += 1
    elif direction == 'S': y -= 1
    elif direction == 'E': x += 1
    else: x -= 1

print(f"Final: ({x}, {y})")
\`\`\`

## Distance from Origin

Use Pythagorean theorem:

\`\`\`python
import math
distance = math.sqrt(x**2 + y**2)
\`\`\`

## OOP Approach

\`\`\`python
class RandomWalker:
    def __init__(self):
        self.x = 0
        self.y = 0
    
    def step(self):
        d = random.choice(['N','S','E','W'])
        if d == 'N': self.y += 1
        elif d == 'S': self.y -= 1
        elif d == 'E': self.x += 1
        else: self.x -= 1
    
    def distance(self):
        return math.sqrt(self.x**2 + self.y**2)
\`\`\`

## Statistical Properties

Same as 1D: expected distance ~ √N`,
      codeExamples: JSON.stringify([
        {
          id: "basic-2d",
          title: "Basic 2D Walk",
          code: `import random

x, y = 0, 0
for i in range(10):
    d = random.choice(['N','S','E','W'])
    if d == 'N': y += 1
    elif d == 'S': y -= 1
    elif d == 'E': x += 1
    else: x -= 1
    print(f"Step {i+1}: ({x}, {y})")`,
          description: "2D walk with 4 directions",
        },
        {
          id: "distance-calc",
          title: "Calculate Distance",
          code: `import random
import math

x, y = 0, 0
for _ in range(100):
    d = random.choice(['N','S','E','W'])
    if d == 'N': y += 1
    elif d == 'S': y -= 1
    elif d == 'E': x += 1
    else: x -= 1

distance = math.sqrt(x**2 + y**2)
print(f"Position: ({x}, {y})")
print(f"Distance: {distance:.2f}")`,
          description: "Euclidean distance from origin",
        },
      ]),
      keyPoints: [
        "2D: four directions N, S, E, W",
        "Position tracked as (x, y)",
        "Distance = sqrt(x^2 + y^2)",
        "Expected distance still ~ sqrt(N)",
        "OOP helps organize complex simulations",
      ],
      hardwareDemo: "Watch (x, y) coordinates update in memory. See math.sqrt() compute distance.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson12_1_3.number}: ${lesson12_1_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson12_1_3.id,
        number: 1,
        title: "Basic 2D Walk",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Implement a 2D walk of 10 steps. Print final (x, y) position.",
        starterCode: `import random

x, y = 0, 0
for _ in range(10):
    d = random.choice(['N','S','E','W'])
    # Update x or y based on direction
    pass

print(f"Final: ({x}, {y})")`,
        solution: `import random

x, y = 0, 0
for _ in range(10):
    d = random.choice(['N','S','E','W'])
    if d == 'N': y += 1
    elif d == 'S': y -= 1
    elif d == 'E': x += 1
    else: x -= 1

print(f"Final: ({x}, {y})")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "(x, y) tuple", description: "Final position" }]),
        hints: ["N: y+=1, S: y-=1", "E: x+=1, W: x-=1", "Use if/elif/else"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson12_1_3.id,
        number: 2,
        title: "Calculate Distance",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Run a 100-step 2D walk. Calculate distance from origin using sqrt(x^2+y^2).",
        starterCode: `import random
import math

x, y = 0, 0
for _ in range(100):
    d = random.choice(['N','S','E','W'])
    if d == 'N': y += 1
    elif d == 'S': y -= 1
    elif d == 'E': x += 1
    else: x -= 1

distance = # Calculate distance
print(f"Position: ({x}, {y})")
print(f"Distance: {distance:.2f}")`,
        solution: `import random
import math

x, y = 0, 0
for _ in range(100):
    d = random.choice(['N','S','E','W'])
    if d == 'N': y += 1
    elif d == 'S': y -= 1
    elif d == 'E': x += 1
    else: x -= 1

distance = math.sqrt(x**2 + y**2)
print(f"Position: ({x}, {y})")
print(f"Distance: {distance:.2f}")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "Distance value", description: "Euclidean distance" }]),
        hints: ["Import math module", "distance = math.sqrt(x**2 + y**2)", "Expected ~10 (sqrt 100)"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson12_1_3.id,
        number: 3,
        title: "Track 2D Path",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create function random_walk_2d(n) returning list of (x,y) tuples.",
        starterCode: `import random

def random_walk_2d(num_steps):
    path = [(0, 0)]
    x, y = 0, 0
    for _ in range(num_steps):
        d = random.choice(['N','S','E','W'])
        if d == 'N': y += 1
        elif d == 'S': y -= 1
        elif d == 'E': x += 1
        else: x -= 1
        # Append new position
        pass
    return path

path = random_walk_2d(5)
print(path)`,
        solution: `import random

def random_walk_2d(num_steps):
    path = [(0, 0)]
    x, y = 0, 0
    for _ in range(num_steps):
        d = random.choice(['N','S','E','W'])
        if d == 'N': y += 1
        elif d == 'S': y -= 1
        elif d == 'E': x += 1
        else: x -= 1
        path.append((x, y))
    return path

path = random_walk_2d(5)
print(path)`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "List of 6 tuples", description: "Path tracked" }]),
        hints: ["path.append((x, y))", "Include starting position (0,0)", "Length = num_steps + 1"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson12_1_3.id,
        number: 4,
        title: "Walker Class",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create RandomWalker class with walk(n) and distance() methods. Simulate 5 walkers.",
        starterCode: `import random
import math

class RandomWalker:
    def __init__(self, name):
        self.name = name
        self.x = 0
        self.y = 0
    
    def walk(self, num_steps):
        for _ in range(num_steps):
            d = random.choice(['N','S','E','W'])
            # Update self.x and self.y
            pass
    
    def distance(self):
        # Return distance from origin
        pass

for i in range(5):
    w = RandomWalker(f"Walker {i+1}")
    w.walk(50)
    print(f"{w.name}: ({w.x}, {w.y}), dist={w.distance():.2f}")`,
        solution: `import random
import math

class RandomWalker:
    def __init__(self, name):
        self.name = name
        self.x = 0
        self.y = 0
    
    def walk(self, num_steps):
        for _ in range(num_steps):
            d = random.choice(['N','S','E','W'])
            if d == 'N': self.y += 1
            elif d == 'S': self.y -= 1
            elif d == 'E': self.x += 1
            else: self.x -= 1
    
    def distance(self):
        return math.sqrt(self.x**2 + self.y**2)

for i in range(5):
    w = RandomWalker(f"Walker {i+1}")
    w.walk(50)
    print(f"{w.name}: ({w.x}, {w.y}), dist={w.distance():.2f}")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "5 walker results", description: "OOP walkers" }]),
        hints: ["Use self.x and self.y", "distance() uses math.sqrt()", "Each walker is independent"],
        xpReward: 25,
        order: 4,
      },
    ],
  });
  console.log(`      ✏️  4 exercises created for 12.1.3`);

  console.log("\n✅ Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
