import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 3: Lessons 12.2.1 and 12.2.2 (Probability)...\n");

  const section12_2 = await prisma.section.findFirst({
    where: { number: 12.2 },
  });
  if (!section12_2) throw new Error("Section 12.2 not found. Run part 1 first.");

  const lesson12_2_1 = await prisma.lesson.upsert({
    where: { slug: "intro-probability" },
    update: {},
    create: {
      sectionId: section12_2.id,
      number: 12.21,
      title: "Introduction to Probability",
      slug: "intro-probability",
      objectives: [
        "Understand basic probability concepts",
        "Calculate simple probabilities",
        "Use simulation to estimate probabilities",
        "Understand the Law of Large Numbers",
      ],
      content: `# Introduction to Probability

Probability quantifies how likely events are to occur.

## Basic Concepts

- **Probability**: 0 (impossible) to 1 (certain)
- **Formula**: P(event) = favorable outcomes / total outcomes

**Examples:**
- Coin flip: P(heads) = 1/2 = 0.5
- Die roll: P(6) = 1/6 ≈ 0.167
- Die roll: P(even) = 3/6 = 0.5

## Theoretical vs Empirical

| Theoretical | Empirical |
|-------------|-----------|
| Calculated from logic | Estimated from experiments |
| P(heads) = 0.5 | Flip 1000 times, count heads |
| Exact | Approximate |

## Law of Large Numbers

More trials → empirical approaches theoretical.

\`\`\`
10 flips:    Maybe 60% heads
100 flips:   Maybe 52% heads
10000 flips: Maybe 50.1% heads
\`\`\`

## Simulation for Probability

When theory is complex, simulate!

\`\`\`python
# Estimate P(double sixes)
count = 0
for _ in range(10000):
    if random.randint(1,6) == 6 and random.randint(1,6) == 6:
        count += 1
print(count / 10000)  # ≈ 0.028 (1/36)
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "theoretical-empirical",
          title: "Theoretical vs Empirical",
          code: `import random

heads = 0
for _ in range(1000):
    if random.choice(['H','T']) == 'H':
        heads += 1

print(f"Theoretical: 0.5")
print(f"Empirical: {heads/1000:.3f}")`,
          description: "Comparing calculated vs simulated probability",
        },
        {
          id: "double-sixes",
          title: "P(Double Sixes)",
          code: `import random

count = 0
trials = 10000

for _ in range(trials):
    d1 = random.randint(1, 6)
    d2 = random.randint(1, 6)
    if d1 == 6 and d2 == 6:
        count += 1

print(f"Theoretical: {1/36:.4f}")
print(f"Empirical: {count/trials:.4f}")`,
          description: "Simulating compound probability",
        },
        {
          id: "dice-distribution",
          title: "Dice Sum Distribution",
          code: `import random

sums = {}
for _ in range(10000):
    total = random.randint(1,6) + random.randint(1,6)
    sums[total] = sums.get(total, 0) + 1

for s in sorted(sums):
    print(f"Sum {s}: {sums[s]/10000:.3f}")`,
          description: "Building probability distribution",
        },
      ]),
      keyPoints: [
        "Probability: 0 to 1 scale",
        "P(E) = favorable / total outcomes",
        "Empirical probability from experiments",
        "Law of Large Numbers: more trials = better estimate",
        "Simulation powerful for complex probabilities",
      ],
      hardwareDemo: "Watch counter increment in memory. See division compute probability.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson12_2_1.number}: ${lesson12_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson12_2_1.id,
        number: 1,
        title: "Empirical P(Heads)",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Simulate 100 coin flips. Calculate empirical probability of heads.",
        starterCode: `import random

heads = 0
for _ in range(100):
    if random.choice(['H','T']) == 'H':
        heads += 1

prob = # Calculate probability
print(f"P(heads) = {prob:.2f}")`,
        solution: `import random

heads = 0
for _ in range(100):
    if random.choice(['H','T']) == 'H':
        heads += 1

prob = heads / 100
print(f"P(heads) = {prob:.2f}")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "~0.50", description: "Near 50%" }]),
        hints: ["prob = heads / 100", "Should be close to 0.5", "More flips = closer to 0.5"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson12_2_1.id,
        number: 2,
        title: "P(Sum = 7)",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Estimate P(sum=7) with two dice using 10000 simulations. Theoretical: 6/36 ≈ 0.167",
        starterCode: `import random

count = 0
for _ in range(10000):
    total = random.randint(1,6) + random.randint(1,6)
    if total == 7:
        count += 1

print(f"P(sum=7) = {count/10000:.4f}")
print(f"Theoretical: {6/36:.4f}")`,
        solution: `import random

count = 0
for _ in range(10000):
    total = random.randint(1,6) + random.randint(1,6)
    if total == 7:
        count += 1

print(f"P(sum=7) = {count/10000:.4f}")
print(f"Theoretical: {6/36:.4f}")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "~0.167", description: "Near 6/36" }]),
        hints: ["Count when sum equals 7", "6 ways: (1,6),(2,5),(3,4)...", "Divide by 10000"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson12_2_1.id,
        number: 3,
        title: "Dice Sum Distribution",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create probability distribution for sum of two dice (2-12). Roll 10000 times.",
        starterCode: `import random

sums = {}
for _ in range(10000):
    total = random.randint(1,6) + random.randint(1,6)
    sums[total] = sums.get(total, 0) + 1

print("Sum : Probability")
for s in sorted(sums):
    print(f"{s:3d} : {sums[s]/10000:.4f}")`,
        solution: `import random

sums = {}
for _ in range(10000):
    total = random.randint(1,6) + random.randint(1,6)
    sums[total] = sums.get(total, 0) + 1

print("Sum : Probability")
for s in sorted(sums):
    print(f"{s:3d} : {sums[s]/10000:.4f}")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "7 highest", description: "Peak at 7" }]),
        hints: ["Use dict to count each sum", "sums.get(total, 0) + 1", "7 should have highest probability"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson12_2_1.id,
        number: 4,
        title: "Monty Hall Problem",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Simulate Monty Hall: 3 doors, 1 prize. Compare stay vs switch strategy over 10000 trials.",
        starterCode: `import random

stay_wins = 0
switch_wins = 0

for _ in range(10000):
    prize = random.randint(0, 2)  # Prize behind door 0, 1, or 2
    pick = 0  # Always pick door 0
    
    # Stay wins if prize == pick
    if prize == pick:
        stay_wins += 1
    else:
        switch_wins += 1

print(f"Stay wins: {stay_wins/10000:.1%}")
print(f"Switch wins: {switch_wins/10000:.1%}")`,
        solution: `import random

stay_wins = 0
switch_wins = 0

for _ in range(10000):
    prize = random.randint(0, 2)
    pick = 0
    
    if prize == pick:
        stay_wins += 1
    else:
        switch_wins += 1

print(f"Stay wins: {stay_wins/10000:.1%}")
print(f"Switch wins: {switch_wins/10000:.1%}")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "Stay ~33%, Switch ~67%", description: "Switch is better" }]),
        hints: ["Stay wins only if prize at original pick", "P(stay) = 1/3, P(switch) = 2/3", "Switching doubles your chances!"],
        xpReward: 25,
        order: 4,
      },
    ],
  });
  console.log(`      ✏️  4 exercises created for 12.2.1`);

  const lesson12_2_2 = await prisma.lesson.upsert({
    where: { slug: "probability-distributions" },
    update: {},
    create: {
      sectionId: section12_2.id,
      number: 12.22,
      title: "Probability Distributions",
      slug: "probability-distributions",
      objectives: [
        "Understand probability distributions",
        "Work with uniform and binomial distributions",
        "Calculate expected values",
        "Visualize distributions through simulation",
      ],
      content: `# Probability Distributions

A distribution shows all outcomes and their probabilities.

## Types of Distributions

**Discrete**: Countable outcomes (dice, coins)
**Continuous**: Infinite values (height, temperature)

## Uniform Distribution

All outcomes equally likely.
- Die roll: P(1) = P(2) = ... = P(6) = 1/6
- random.randint() is uniform

## Binomial Distribution

Number of successes in N trials.
- Flip 10 coins, count heads
- Parameters: n (trials), p (success probability)
- Expected value: n × p

\`\`\`python
# 10 flips, p=0.5 → expect 5 heads
def count_heads(n):
    return sum(1 for _ in range(n) if random.random() < 0.5)
\`\`\`

## Expected Value

The long-run average outcome.

E[X] = Σ (value × probability)

**Die roll**: E = (1+2+3+4+5+6)/6 = 3.5`,
      codeExamples: JSON.stringify([
        {
          id: "uniform",
          title: "Uniform Distribution",
          code: `import random

rolls = {}
for _ in range(6000):
    r = random.randint(1, 6)
    rolls[r] = rolls.get(r, 0) + 1

for face in sorted(rolls):
    print(f"Face {face}: {rolls[face]} ({rolls[face]/6000:.3f})")
# Each ~1000 times, ~0.167`,
          description: "Verifying uniform distribution",
        },
        {
          id: "binomial",
          title: "Binomial Distribution",
          code: `import random

def flip_coins(n):
    return sum(1 for _ in range(n) if random.random() < 0.5)

results = {}
for _ in range(1000):
    heads = flip_coins(10)
    results[heads] = results.get(heads, 0) + 1

for h in sorted(results):
    print(f"{h} heads: {results[h]/1000:.3f}")`,
          description: "Binomial: heads in 10 flips",
        },
        {
          id: "expected-value",
          title: "Expected Value",
          code: `import random

# Verify E[die] = 3.5
total = 0
n = 10000
for _ in range(n):
    total += random.randint(1, 6)

print(f"Average: {total/n:.2f}")
print(f"Expected: 3.5")`,
          description: "Expected value of die roll",
        },
      ]),
      keyPoints: [
        "Distribution: all outcomes with their probabilities",
        "Uniform: all outcomes equally likely",
        "Binomial: successes in N independent trials",
        "Expected value: long-run average (n*p for binomial)",
        "More trials reveal distribution shape",
      ],
      hardwareDemo: "Watch dictionary grow as outcomes are counted.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson12_2_2.number}: ${lesson12_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson12_2_2.id,
        number: 1,
        title: "Verify Uniform Distribution",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Roll a die 6000 times. Verify each face appears ~1000 times (uniform).",
        starterCode: `import random

rolls = {}
for _ in range(6000):
    r = random.randint(1, 6)
    rolls[r] = rolls.get(r, 0) + 1

for face in sorted(rolls):
    print(f"Face {face}: {rolls[face]}")`,
        solution: `import random

rolls = {}
for _ in range(6000):
    r = random.randint(1, 6)
    rolls[r] = rolls.get(r, 0) + 1

for face in sorted(rolls):
    print(f"Face {face}: {rolls[face]}")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "Each ~1000", description: "Uniform distribution" }]),
        hints: ["Each face should appear ~1000 times", "Slight variation is normal", "6000/6 = 1000"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson12_2_2.id,
        number: 2,
        title: "Binomial: Coin Flips",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Flip 5 coins 1000 times. Show distribution of heads (0-5).",
        starterCode: `import random

def flip_coins(n):
    return sum(1 for _ in range(n) if random.random() < 0.5)

results = {}
for _ in range(1000):
    h = flip_coins(5)
    results[h] = results.get(h, 0) + 1

for heads in sorted(results):
    print(f"{heads} heads: {results[heads]/1000:.3f}")`,
        solution: `import random

def flip_coins(n):
    return sum(1 for _ in range(n) if random.random() < 0.5)

results = {}
for _ in range(1000):
    h = flip_coins(5)
    results[h] = results.get(h, 0) + 1

for heads in sorted(results):
    print(f"{heads} heads: {results[heads]/1000:.3f}")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "Peak at 2-3", description: "Binomial shape" }]),
        hints: ["Expected: 5 * 0.5 = 2.5 heads", "Distribution peaks at 2-3", "Symmetric around 2.5"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson12_2_2.id,
        number: 3,
        title: "Expected Value of Die",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Roll a die 10000 times. Calculate average and compare to expected value 3.5.",
        starterCode: `import random

total = 0
n = 10000

for _ in range(n):
    total += random.randint(1, 6)

average = total / n
print(f"Average: {average:.3f}")
print(f"Expected: 3.5")`,
        solution: `import random

total = 0
n = 10000

for _ in range(n):
    total += random.randint(1, 6)

average = total / n
print(f"Average: {average:.3f}")
print(f"Expected: 3.5")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: "~3.5", description: "Close to 3.5" }]),
        hints: ["E = (1+2+3+4+5+6)/6 = 3.5", "More rolls = closer to 3.5", "Law of Large Numbers"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson12_2_2.id,
        number: 4,
        title: "Birthday Paradox",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "In 23 people, P(shared birthday) > 50%. Simulate 10000 rooms to verify.",
        starterCode: `import random

shared = 0
for _ in range(10000):
    birthdays = [random.randint(1, 365) for _ in range(23)]
    if len(birthdays) != len(set(birthdays)):
        shared += 1

print(f"P(shared birthday): {shared/10000:.1%}")`,
        solution: `import random

shared = 0
for _ in range(10000):
    birthdays = [random.randint(1, 365) for _ in range(23)]
    if len(birthdays) != len(set(birthdays)):
        shared += 1

print(f"P(shared birthday): {shared/10000:.1%}")`,
        testCases: JSON.stringify([{ input: "", expectedOutput: ">50%", description: "Over 50%" }]),
        hints: ["len(set(birthdays)) < 23 means duplicate", "Theoretical: ~50.7%", "Counterintuitive result!"],
        xpReward: 25,
        order: 4,
      },
    ],
  });
  console.log(`      ✏️  4 exercises created for 12.2.2`);

  console.log("\n✅ Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
