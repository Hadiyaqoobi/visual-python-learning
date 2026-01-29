import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 1: Chapter 12 structure + Lesson 12.1.1...\n");

  const chapter12 = await prisma.chapter.upsert({
    where: { number: 12 },
    update: {},
    create: {
      number: 12,
      title: "Stochastic Programs, Probability, and Distributions",
      description: "Learn probabilistic programming, random walks, Monte Carlo simulation, and statistical inference.",
      objectives: [
        "Understand deterministic vs stochastic programs",
        "Master Python's random module",
        "Implement random walks in 1D and 2D",
        "Calculate probabilities through simulation",
        "Apply Monte Carlo simulation methods",
      ],
      isPublished: true,
    },
  });
  console.log(`✅ Chapter ${chapter12.number}: ${chapter12.title}`);

  const section12_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter12.id, number: 12.1 } },
    update: {},
    create: {
      chapterId: chapter12.id,
      number: 12.1,
      title: "Random Walks",
      description: "Introduction to stochastic programming through random number generation and random walk simulations.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section12_1.number}: ${section12_1.title}`);

  const section12_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter12.id, number: 12.2 } },
    update: {},
    create: {
      chapterId: chapter12.id,
      number: 12.2,
      title: "Probability and Statistics",
      description: "Fundamental probability concepts and simulation-based probability estimation.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section12_2.number}: ${section12_2.title}`);

  const section12_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter12.id, number: 12.3 } },
    update: {},
    create: {
      chapterId: chapter12.id,
      number: 12.3,
      title: "Inferential Statistics and Simulations",
      description: "Monte Carlo simulation and statistical inference from simulations.",
      order: 3,
    },
  });
  console.log(`  📂 Section ${section12_3.number}: ${section12_3.title}`);

  const lesson12_1_1 = await prisma.lesson.upsert({
    where: { slug: "intro-randomness-stochastic-programs" },
    update: {},
    create: {
      sectionId: section12_1.id,
      number: 12.11,
      title: "Introduction to Randomness and Stochastic Programs",
      slug: "intro-randomness-stochastic-programs",
      objectives: [
        "Understand deterministic vs stochastic programs",
        "Learn about pseudo-random number generators",
        "Use Python's random module",
        "Understand seeding for reproducibility",
      ],
      content: `# Introduction to Randomness and Stochastic Programs

Until now, all programs have been **deterministic** - same input always produces same output. Real world has uncertainty: weather, stock markets, user behavior. **Stochastic programs** use randomness to model this uncertainty.

## Deterministic vs Stochastic

| Deterministic | Stochastic |
|---------------|------------|
| Same input → same output | Same input → different outputs |
| Calculator: 2+2=4 always | Coin flip: heads or tails |
| Predictable | Probabilistic |

## Pseudo-Random Numbers

Computers can't generate truly random numbers! They use **pseudo-random number generators (PRNGs)** - algorithms producing sequences that appear random but are actually deterministic.

## The Random Seed

Same seed = same sequence! This is useful for testing and reproducibility.

\`\`\`python
import random
random.seed(42)
print(random.random())  # Always 0.6394...
random.seed(42)
print(random.random())  # Same: 0.6394...
\`\`\`

## Python's random Module

\`\`\`python
import random
random.random()          # Float [0, 1)
random.randint(1, 6)     # Integer [1, 6] inclusive
random.choice(['a','b']) # Pick from list
random.shuffle(mylist)   # Shuffle in place
random.seed(42)          # Set seed
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-random",
          title: "Basic Random Functions",
          code: `import random

# Float between 0 and 1
print(f"random(): {random.random():.4f}")

# Integer between 1 and 6 (die roll)
print(f"randint(1,6): {random.randint(1, 6)}")

# Pick from list
colors = ['red', 'blue', 'green']
print(f"choice(): {random.choice(colors)}")`,
          description: "Essential random module functions",
        },
        {
          id: "seeding",
          title: "Reproducible Randomness",
          code: `import random

random.seed(42)
print(random.random())  # 0.6394...
print(random.random())  # 0.0250...

random.seed(42)  # Reset
print(random.random())  # 0.6394... (same!)
print(random.random())  # 0.0250... (same!)`,
          description: "Using seeds for reproducibility",
        },
      ]),
      keyPoints: [
        "Deterministic: same input → same output always",
        "Stochastic: uses randomness, may give different outputs",
        "PRNGs produce sequences that appear random",
        "random.seed(n) makes results reproducible",
        "Key functions: random(), randint(), choice(), shuffle()",
      ],
      hardwareDemo: "Watch PRNG state in memory transform with each random() call.",
      estimatedTime: 20,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson12_1_1.number}: ${lesson12_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson12_1_1.id,
        number: 1,
        title: "Coin Flip",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Simulate a coin flip. Print 'Heads' or 'Tails' randomly.",
        starterCode: `import random

result = # Use random.choice()
print(result)`,
        solution: `import random

result = random.choice(['Heads', 'Tails'])
print(result)`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "Heads or Tails", description: "Random result" }]),
        hints: ["Use random.choice() with a list", "The list should contain 'Heads' and 'Tails'", "random.choice(['Heads', 'Tails'])"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson12_1_1.id,
        number: 2,
        title: "Roll Two Dice",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Simulate rolling two dice and print their sum.",
        starterCode: `import random

die1 = # randint for die 1
die2 = # randint for die 2
print(f"Die 1: {die1}, Die 2: {die2}")
print(f"Sum: {die1 + die2}")`,
        solution: `import random

die1 = random.randint(1, 6)
die2 = random.randint(1, 6)
print(f"Die 1: {die1}, Die 2: {die2}")
print(f"Sum: {die1 + die2}")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "Sum between 2-12", description: "Valid dice sum" }]),
        hints: ["Use random.randint(1, 6) for each die", "randint includes both endpoints", "Sum ranges from 2 to 12"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson12_1_1.id,
        number: 3,
        title: "Reproducible Sequence",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use seed 42 to generate 5 random numbers that are the same every run.",
        starterCode: `import random

# Set seed to 42 here

for i in range(5):
    print(f"{random.random():.6f}")`,
        solution: `import random

random.seed(42)

for i in range(5):
    print(f"{random.random():.6f}")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "Same 5 numbers each run", description: "Reproducible" }]),
        hints: ["Call random.seed(42) before generating numbers", "The seed must be set BEFORE the loop", "First number will be 0.639427..."],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson12_1_1.id,
        number: 4,
        title: "1000 Coin Flips",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Simulate 1000 coin flips. Print percentage of heads (should be ~50%).",
        starterCode: `import random

heads = 0
for _ in range(1000):
    # Flip coin and count heads
    pass

percentage = heads / 1000 * 100
print(f"Heads: {heads}/1000 ({percentage:.1f}%)")`,
        solution: `import random

heads = 0
for _ in range(1000):
    if random.choice(['H', 'T']) == 'H':
        heads += 1

percentage = heads / 1000 * 100
print(f"Heads: {heads}/1000 ({percentage:.1f}%)")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "~50%", description: "Close to 50%" }]),
        hints: ["Use random.choice(['H', 'T'])", "Increment heads when result is 'H'", "Law of large numbers: result approaches 50%"],
        xpReward: 15,
        order: 4,
      },
    ],
  });
  console.log(`      ✏️  4 exercises created for 12.1.1`);

  console.log("\n✅ Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
