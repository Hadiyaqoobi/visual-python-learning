import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Chapter 12: Stochastic Programs, Probability, and Distributions...\n");

  const chapter12 = await prisma.chapter.upsert({
    where: { number: 12 },
    update: {},
    create: {
      number: 12,
      title: "Stochastic Programs, Probability, and Distributions",
      description: "Explore randomness, probability theory, and simulation techniques including random walks, Monte Carlo methods, and statistical inference.",
      objectives: [
        "Understand the role of randomness in computing",
        "Use Python's random module effectively",
        "Simulate random walks and analyze behavior",
        "Apply fundamental probability concepts",
        "Implement Monte Carlo simulations",
        "Use simulation for statistical inference",
      ],
      isPublished: true,
    },
  });
  console.log(`✅ Chapter ${chapter12.number}: ${chapter12.title}`);

  // SECTION 12.1
  const section12_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter12.id, number: 12.1 } },
    update: {},
    create: {
      chapterId: chapter12.id,
      number: 12.1,
      title: "Random Walks",
      description: "Introduction to randomness and simulation through random walks.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section12_1.number}: ${section12_1.title}`);

  // LESSON 12.1.1
  const lesson12_1_1 = await prisma.lesson.upsert({
    where: { slug: "introduction-to-randomness" },
    update: {},
    create: {
      sectionId: section12_1.id,
      number: 12.11,
      title: "Introduction to Randomness",
      slug: "introduction-to-randomness",
      objectives: ["Understand stochastic vs deterministic programs", "Use pseudo-random number generators", "Apply random seeds for reproducibility"],
      content: `# Introduction to Randomness

Stochastic programs use randomness to model uncertainty.

## Pseudo-Random Numbers

\`\`\`python
import random
random.random()  # Float in [0.0, 1.0)
\`\`\`

## Seeds for Reproducibility

\`\`\`python
random.seed(42)
print(random.random())  # Always same value
\`\`\``,
      codeExamples: JSON.stringify([{id: "seed-demo", title: "Reproducible Randomness", code: "import random\\nrandom.seed(42)\\nprint(random.random())", description: "Using seeds"}]),
      keyPoints: ["PRNGs are deterministic but appear random", "random.seed() makes results reproducible", "Same seed = same sequence"],
      hardwareDemo: "Visualize PRNG state in memory.",
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson12_1_1.number}: ${lesson12_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {lessonId: lesson12_1_1.id, number: 1, title: "Reproducible Randomness", type: "CODE", difficulty: "BEGINNER", prompt: "Use random.seed(123) to generate the same sequence twice.", starterCode: "import random\\n\\nrandom.seed(123)\\nseq1 = [random.random() for _ in range(3)]\\n\\n# TODO: Reset seed and generate seq2\\nseq2 = []\\n\\nprint(seq1 == seq2)", solution: "import random\\n\\nrandom.seed(123)\\nseq1 = [random.random() for _ in range(3)]\\n\\nrandom.seed(123)\\nseq2 = [random.random() for _ in range(3)]\\n\\nprint(seq1 == seq2)", testCases: JSON.stringify([{input: "", expectedOutput: "True", description: "Sequences match"}]), hints: ["Set seed before each sequence"], xpReward: 10, order: 1},
      {lessonId: lesson12_1_1.id, number: 2, title: "Coin Flip", type: "CODE", difficulty: "BEGINNER", prompt: "Create coin_flip() returning 'Heads' or 'Tails'.", starterCode: "import random\\n\\ndef coin_flip():\\n    # TODO\\n    pass\\n\\nfor _ in range(5): print(coin_flip())", solution: "import random\\n\\ndef coin_flip():\\n    return random.choice(['Heads', 'Tails'])\\n\\nfor _ in range(5): print(coin_flip())", testCases: JSON.stringify([{input: "", expectedOutput: "Heads or Tails", description: "Random"}]), hints: ["Use random.choice()"], xpReward: 10, order: 2},
    ],
  });
  console.log(`      ✏️  2 exercises created`);

  // LESSON 12.1.2
  const lesson12_1_2 = await prisma.lesson.upsert({
    where: { slug: "random-module-python" },
    update: {},
    create: {
      sectionId: section12_1.id,
      number: 12.12,
      title: "The random Module",
      slug: "random-module-python",
      objectives: ["Generate random integers and floats", "Make random selections", "Shuffle sequences"],
      content: `# The random Module

## Basic Functions
\`\`\`python
random.random()      # [0.0, 1.0)
random.uniform(a,b)  # [a, b]
random.randint(a,b)  # [a, b] inclusive
\`\`\`

## Selections
\`\`\`python
random.choice(seq)       # Pick one
random.choices(seq, k=n) # Pick n with replacement
random.sample(seq, k=n)  # Pick n without replacement
random.shuffle(seq)      # Shuffle in place
\`\`\``,
      codeExamples: JSON.stringify([{id: "random-funcs", title: "Random Functions", code: "import random\\nprint(random.randint(1, 6))\\nprint(random.choice(['a','b','c']))", description: "Common functions"}]),
      keyPoints: ["randint includes both endpoints", "sample() for unique selections", "shuffle() modifies in place"],
      hardwareDemo: "Watch Fisher-Yates shuffle algorithm.",
      estimatedTime: 20,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson12_1_2.number}: ${lesson12_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {lessonId: lesson12_1_2.id, number: 1, title: "Roll Dice", type: "CODE", difficulty: "BEGINNER", prompt: "Create roll_dice(n) returning sum of n dice.", starterCode: "import random\\n\\ndef roll_dice(n):\\n    total = 0\\n    # TODO\\n    return total\\n\\nprint(roll_dice(2))", solution: "import random\\n\\ndef roll_dice(n):\\n    total = 0\\n    for _ in range(n):\\n        total += random.randint(1, 6)\\n    return total\\n\\nprint(roll_dice(2))", testCases: JSON.stringify([{input: "roll_dice(2)", expectedOutput: "2-12", description: "Sum of 2 dice"}]), hints: ["Loop n times", "randint(1, 6)"], xpReward: 10, order: 1},
      {lessonId: lesson12_1_2.id, number: 2, title: "Draw Cards", type: "CODE", difficulty: "INTERMEDIATE", prompt: "Draw 5 unique cards using random.sample().", starterCode: "import random\\n\\ndeck = list(range(52))\\n# TODO: Draw 5 cards\\nhand = []\\n\\nprint(hand)", solution: "import random\\n\\ndeck = list(range(52))\\nhand = random.sample(deck, 5)\\n\\nprint(hand)", testCases: JSON.stringify([{input: "", expectedOutput: "5 unique numbers", description: "5 cards"}]), hints: ["random.sample(seq, k=n)"], xpReward: 15, order: 2},
      {lessonId: lesson12_1_2.id, number: 3, title: "Password Generator", type: "CODE", difficulty: "INTERMEDIATE", prompt: "Create generate_password(length) using letters and digits.", starterCode: "import random\\nimport string\\n\\ndef generate_password(length):\\n    chars = string.ascii_letters + string.digits\\n    # TODO\\n    pass\\n\\nprint(generate_password(8))", solution: "import random\\nimport string\\n\\ndef generate_password(length):\\n    chars = string.ascii_letters + string.digits\\n    return ''.join(random.choices(chars, k=length))\\n\\nprint(generate_password(8))", testCases: JSON.stringify([{input: "", expectedOutput: "8 chars", description: "Correct length"}]), hints: ["random.choices()", "''.join()"], xpReward: 15, order: 3},
    ],
  });
  console.log(`      ✏️  3 exercises created`);

  // LESSON 12.1.3
  const lesson12_1_3 = await prisma.lesson.upsert({
    where: { slug: "random-walks-simulation" },
    update: {},
    create: {
      sectionId: section12_1.id,
      number: 12.13,
      title: "Random Walks Simulation",
      slug: "random-walks-simulation",
      objectives: ["Implement 1D and 2D random walks", "Analyze walk behavior", "Understand sqrt(n) distance relationship"],
      content: `# Random Walks

A path of random steps. Key insight: expected distance after n steps ≈ √n

## 1D Walk
\`\`\`python
def walk_1d(steps):
    pos = 0
    for _ in range(steps):
        pos += random.choice([-1, 1])
    return pos
\`\`\``,
      codeExamples: JSON.stringify([{id: "walk-2d", title: "2D Walk", code: "def walk_2d(steps):\\n    x, y = 0, 0\\n    for _ in range(steps):\\n        dx, dy = random.choice([(0,1),(0,-1),(1,0),(-1,0)])\\n        x, y = x+dx, y+dy\\n    return x, y", description: "2D random walk"}]),
      keyPoints: ["Expected distance ≈ √n", "Run many trials to see patterns"],
      hardwareDemo: "Animate walk path.",
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
      {lessonId: lesson12_1_3.id, number: 1, title: "1D Walk", type: "CODE", difficulty: "INTERMEDIATE", prompt: "Implement 1D random walk.", starterCode: "import random\\n\\ndef walk_1d(steps):\\n    pos = 0\\n    # TODO\\n    return pos\\n\\nprint(walk_1d(100))", solution: "import random\\n\\ndef walk_1d(steps):\\n    pos = 0\\n    for _ in range(steps):\\n        pos += random.choice([-1, 1])\\n    return pos\\n\\nprint(walk_1d(100))", testCases: JSON.stringify([{input: "", expectedOutput: "Integer", description: "Final position"}]), hints: ["random.choice([-1, 1])"], xpReward: 15, order: 1},
      {lessonId: lesson12_1_3.id, number: 2, title: "Average Distance", type: "CODE", difficulty: "INTERMEDIATE", prompt: "Calculate average distance from origin over 1000 2D walks of 100 steps.", starterCode: "import random\\nimport math\\n\\ndef walk_2d(steps):\\n    x, y = 0, 0\\n    for _ in range(steps):\\n        dx, dy = random.choice([(0,1),(0,-1),(1,0),(-1,0)])\\n        x, y = x+dx, y+dy\\n    return x, y\\n\\n# TODO: Average distance over 1000 trials\\navg = 0\\nprint(f'Avg: {avg:.2f}, sqrt(100)={math.sqrt(100):.2f}')", solution: "import random\\nimport math\\n\\ndef walk_2d(steps):\\n    x, y = 0, 0\\n    for _ in range(steps):\\n        dx, dy = random.choice([(0,1),(0,-1),(1,0),(-1,0)])\\n        x, y = x+dx, y+dy\\n    return x, y\\n\\ntotal = 0\\nfor _ in range(1000):\\n    x, y = walk_2d(100)\\n    total += math.sqrt(x**2 + y**2)\\navg = total / 1000\\nprint(f'Avg: {avg:.2f}, sqrt(100)={math.sqrt(100):.2f}')", testCases: JSON.stringify([{input: "", expectedOutput: "~10", description: "Close to sqrt(100)"}]), hints: ["Distance = sqrt(x²+y²)"], xpReward: 20, order: 2},
    ],
  });
  console.log(`      ✏️  2 exercises created`);

  // SECTION 12.2
  const section12_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter12.id, number: 12.2 } },
    update: {},
    create: {
      chapterId: chapter12.id,
      number: 12.2,
      title: "Probability Basics",
      description: "Fundamental probability concepts.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section12_2.number}: ${section12_2.title}`);

  // LESSON 12.2.1
  const lesson12_2_1 = await prisma.lesson.upsert({
    where: { slug: "probability-fundamentals" },
    update: {},
    create: {
      sectionId: section12_2.id,
      number: 12.21,
      title: "Probability Fundamentals",
      slug: "probability-fundamentals",
      objectives: ["Calculate probabilities", "Apply addition/multiplication rules", "Understand independence"],
      content: `# Probability Fundamentals

P(E) = favorable / total

- **AND** (independent): P(A and B) = P(A) × P(B)
- **OR** (exclusive): P(A or B) = P(A) + P(B)
- **Complement**: P(not E) = 1 - P(E)`,
      codeExamples: JSON.stringify([{id: "verify-prob", title: "Verify Probability", code: "import random\\n\\ndef verify(fn, n=10000):\\n    return sum(fn() for _ in range(n)) / n\\n\\nprint(verify(lambda: random.randint(1,6)==6))", description: "Simulation verification"}]),
      keyPoints: ["P(E) = favorable/total", "Multiply for independent events", "Simulation verifies theory"],
      hardwareDemo: "Count outcomes in sample space.",
      estimatedTime: 20,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson12_2_1.number}: ${lesson12_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {lessonId: lesson12_2_1.id, number: 1, title: "Die Probability", type: "CODE", difficulty: "BEGINNER", prompt: "Calculate P(>= 5) on a die.", starterCode: "sample = [1,2,3,4,5,6]\\n\\n# TODO: Count favorable (>=5)\\nfavorable = []\\n\\nprob = len(favorable) / len(sample)\\nprint(f'P(>=5) = {prob:.4f}')", solution: "sample = [1,2,3,4,5,6]\\n\\nfavorable = [x for x in sample if x >= 5]\\n\\nprob = len(favorable) / len(sample)\\nprint(f'P(>=5) = {prob:.4f}')", testCases: JSON.stringify([{input: "", expectedOutput: "0.3333", description: "2/6"}]), hints: ["Filter x >= 5"], xpReward: 10, order: 1},
      {lessonId: lesson12_2_1.id, number: 2, title: "Two Sixes", type: "CODE", difficulty: "INTERMEDIATE", prompt: "Calculate and verify P(two 6s in a row).", starterCode: "import random\\n\\ntheoretical = # TODO: (1/6)*(1/6)\\n\\ndef two_sixes():\\n    # TODO\\n    pass\\n\\nsimulated = sum(two_sixes() for _ in range(10000)) / 10000\\nprint(f'Theory: {theoretical:.4f}, Sim: {simulated:.4f}')", solution: "import random\\n\\ntheoretical = (1/6) * (1/6)\\n\\ndef two_sixes():\\n    return random.randint(1,6)==6 and random.randint(1,6)==6\\n\\nsimulated = sum(two_sixes() for _ in range(10000)) / 10000\\nprint(f'Theory: {theoretical:.4f}, Sim: {simulated:.4f}')", testCases: JSON.stringify([{input: "", expectedOutput: "~0.0278", description: "1/36"}]), hints: ["Multiply probabilities"], xpReward: 15, order: 2},
    ],
  });
  console.log(`      ✏️  2 exercises created`);

  // LESSON 12.2.2
  const lesson12_2_2 = await prisma.lesson.upsert({
    where: { slug: "probability-distributions" },
    update: {},
    create: {
      sectionId: section12_2.id,
      number: 12.22,
      title: "Probability Distributions",
      slug: "probability-distributions",
      objectives: ["Understand uniform and normal distributions", "Generate samples", "Apply 68-95-99.7 rule"],
      content: `# Distributions

- **Uniform**: random.uniform(a, b) - all equally likely
- **Normal**: random.gauss(mu, sigma) - bell curve

68-95-99.7 rule: 68% within 1σ, 95% within 2σ, 99.7% within 3σ`,
      codeExamples: JSON.stringify([{id: "normal", title: "Normal Distribution", code: "import random\\nscores = [random.gauss(100, 15) for _ in range(1000)]\\nprint(f'Mean: {sum(scores)/len(scores):.1f}')", description: "IQ scores"}]),
      keyPoints: ["Uniform = equal probability", "Normal = bell curve", "68-95-99.7 rule"],
      hardwareDemo: "Build histogram visualization.",
      estimatedTime: 20,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson12_2_2.number}: ${lesson12_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {lessonId: lesson12_2_2.id, number: 1, title: "Normal Samples", type: "CODE", difficulty: "BEGINNER", prompt: "Generate 1000 heights (mean=170, std=10).", starterCode: "import random\\n\\n# TODO: Generate heights\\nheights = []\\n\\nprint(f'Mean: {sum(heights)/len(heights):.1f}')", solution: "import random\\n\\nheights = [random.gauss(170, 10) for _ in range(1000)]\\n\\nprint(f'Mean: {sum(heights)/len(heights):.1f}')", testCases: JSON.stringify([{input: "", expectedOutput: "~170", description: "Close to mean"}]), hints: ["random.gauss(170, 10)"], xpReward: 10, order: 1},
      {lessonId: lesson12_2_2.id, number: 2, title: "68-95-99.7 Rule", type: "CODE", difficulty: "INTERMEDIATE", prompt: "Verify ~68% within 1 std dev.", starterCode: "import random\\n\\nmu, sigma = 100, 15\\nsamples = [random.gauss(mu, sigma) for _ in range(10000)]\\n\\n# TODO: Count within 1 sigma\\nwithin = 0\\n\\nprint(f'Within 1σ: {within/100:.1f}% (theory: 68%)')", solution: "import random\\n\\nmu, sigma = 100, 15\\nsamples = [random.gauss(mu, sigma) for _ in range(10000)]\\n\\nwithin = sum(1 for s in samples if mu-sigma <= s <= mu+sigma)\\n\\nprint(f'Within 1σ: {within/100:.1f}% (theory: 68%)')", testCases: JSON.stringify([{input: "", expectedOutput: "~68%", description: "Matches theory"}]), hints: ["Check mu-sigma <= s <= mu+sigma"], xpReward: 15, order: 2},
    ],
  });
  console.log(`      ✏️  2 exercises created`);

  // LESSON 12.2.3
  const lesson12_2_3 = await prisma.lesson.upsert({
    where: { slug: "expected-values" },
    update: {},
    create: {
      sectionId: section12_2.id,
      number: 12.23,
      title: "Expected Values",
      slug: "expected-values",
      objectives: ["Calculate expected values", "Apply to decisions", "Estimate via simulation"],
      content: `# Expected Values

E[X] = Σ(value × probability)

Die: E = (1+2+3+4+5+6)/6 = 3.5

Use for decision making: negative expected value = bad bet.`,
      codeExamples: JSON.stringify([{id: "expected-die", title: "Expected Die", code: "import random\\ntheory = 3.5\\nsim = sum(random.randint(1,6) for _ in range(10000))/10000\\nprint(f'Theory: {theory}, Sim: {sim:.2f}')", description: "Die expected value"}]),
      keyPoints: ["Expected value = long-run average", "Negative EV = bad bet"],
      hardwareDemo: "Watch running average converge.",
      estimatedTime: 20,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson12_2_3.number}: ${lesson12_2_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {lessonId: lesson12_2_3.id, number: 1, title: "Two Dice Expected", type: "CODE", difficulty: "INTERMEDIATE", prompt: "Calculate E[sum of two dice].", starterCode: "import random\\n\\ntheoretical = # TODO: 3.5 + 3.5\\n\\nrolls = [random.randint(1,6)+random.randint(1,6) for _ in range(10000)]\\nsimulated = sum(rolls)/len(rolls)\\n\\nprint(f'Theory: {theoretical}, Sim: {simulated:.2f}')", solution: "import random\\n\\ntheoretical = 3.5 + 3.5\\n\\nrolls = [random.randint(1,6)+random.randint(1,6) for _ in range(10000)]\\nsimulated = sum(rolls)/len(rolls)\\n\\nprint(f'Theory: {theoretical}, Sim: {simulated:.2f}')", testCases: JSON.stringify([{input: "", expectedOutput: "7", description: "E=7"}]), hints: ["E[X+Y] = E[X] + E[Y]"], xpReward: 15, order: 1},
      {lessonId: lesson12_2_3.id, number: 2, title: "Game Analysis", type: "CODE", difficulty: "INTERMEDIATE", prompt: "Pay $5, win $2×roll. Should you play?", starterCode: "import random\\n\\ndef play():\\n    return 2 * random.randint(1,6) - 5\\n\\n# TODO: Average 10000 games\\navg = 0\\n\\nprint(f'Avg profit: ${avg:.2f}')", solution: "import random\\n\\ndef play():\\n    return 2 * random.randint(1,6) - 5\\n\\nprofits = [play() for _ in range(10000)]\\navg = sum(profits)/len(profits)\\n\\nprint(f'Avg profit: ${avg:.2f}')", testCases: JSON.stringify([{input: "", expectedOutput: "~$2", description: "E=2×3.5-5=2"}]), hints: ["E[winnings] = 2×3.5 = 7"], xpReward: 20, order: 2},
    ],
  });
  console.log(`      ✏️  2 exercises created`);

  // SECTION 12.3
  const section12_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter12.id, number: 12.3 } },
    update: {},
    create: {
      chapterId: chapter12.id,
      number: 12.3,
      title: "Simulation and Monte Carlo",
      description: "Using randomness to solve problems.",
      order: 3,
    },
  });
  console.log(`  📂 Section ${section12_3.number}: ${section12_3.title}`);

  // LESSON 12.3.1
  const lesson12_3_1 = await prisma.lesson.upsert({
    where: { slug: "intro-simulation" },
    update: {},
    create: {
      sectionId: section12_3.id,
      number: 12.31,
      title: "Introduction to Simulation",
      slug: "intro-simulation",
      objectives: ["Design simulations", "Analyze results", "Handle variability"],
      content: `# Simulation

Use random sampling when math is too complex.

## Birthday Problem
P(shared birthday in 23 people) ≈ 50%

\`\`\`python
def birthday_trial(n):
    bdays = [random.randint(1,365) for _ in range(n)]
    return len(bdays) != len(set(bdays))
\`\`\``,
      codeExamples: JSON.stringify([{id: "birthday", title: "Birthday Problem", code: "import random\\n\\ndef birthday_sim(n, trials=10000):\\n    return sum(len(set(random.randint(1,365) for _ in range(n))) < n for _ in range(trials)) / trials\\n\\nprint(f'23 people: {birthday_sim(23):.1%}')", description: "Birthday simulation"}]),
      keyPoints: ["Simulate when math is hard", "More trials = better precision", "23 people → ~50% collision"],
      hardwareDemo: "Watch trials accumulate.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson12_3_1.number}: ${lesson12_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {lessonId: lesson12_3_1.id, number: 1, title: "Birthday Problem", type: "CODE", difficulty: "INTERMEDIATE", prompt: "Find smallest group with >50% collision.", starterCode: "import random\\n\\ndef trial(n):\\n    bdays = [random.randint(1,365) for _ in range(n)]\\n    return len(bdays) != len(set(bdays))\\n\\nfor n in range(1, 100):\\n    prob = sum(trial(n) for _ in range(1000)) / 1000\\n    if prob > 0.5:\\n        print(f'{n} people: {prob:.1%}')\\n        break", solution: "import random\\n\\ndef trial(n):\\n    bdays = [random.randint(1,365) for _ in range(n)]\\n    return len(bdays) != len(set(bdays))\\n\\nfor n in range(1, 100):\\n    prob = sum(trial(n) for _ in range(1000)) / 1000\\n    if prob > 0.5:\\n        print(f'{n} people: {prob:.1%}')\\n        break", testCases: JSON.stringify([{input: "", expectedOutput: "23", description: "Famous answer"}]), hints: ["Collision if len(set) < len(list)"], xpReward: 20, order: 1},
      {lessonId: lesson12_3_1.id, number: 2, title: "Monty Hall", type: "CODE", difficulty: "ADVANCED", prompt: "Compare stay vs switch strategies.", starterCode: "import random\\n\\ndef monty(switch):\\n    car = random.randint(0,2)\\n    pick = random.randint(0,2)\\n    # Host opens goat door\\n    available = [d for d in range(3) if d != pick and d != car]\\n    host = random.choice(available)\\n    if switch:\\n        pick = [d for d in range(3) if d != pick and d != host][0]\\n    return pick == car\\n\\nstay = sum(monty(False) for _ in range(10000))/100\\nswitch = sum(monty(True) for _ in range(10000))/100\\nprint(f'Stay: {stay:.1f}%, Switch: {switch:.1f}%')", solution: "import random\\n\\ndef monty(switch):\\n    car = random.randint(0,2)\\n    pick = random.randint(0,2)\\n    available = [d for d in range(3) if d != pick and d != car]\\n    host = random.choice(available)\\n    if switch:\\n        pick = [d for d in range(3) if d != pick and d != host][0]\\n    return pick == car\\n\\nstay = sum(monty(False) for _ in range(10000))/100\\nswitch = sum(monty(True) for _ in range(10000))/100\\nprint(f'Stay: {stay:.1f}%, Switch: {switch:.1f}%')", testCases: JSON.stringify([{input: "", expectedOutput: "Stay ~33%, Switch ~67%", description: "Switch wins"}]), hints: ["Switch wins 2/3"], xpReward: 25, order: 2},
    ],
  });
  console.log(`      ✏️  2 exercises created`);

  // LESSON 12.3.2
  const lesson12_3_2 = await prisma.lesson.upsert({
    where: { slug: "monte-carlo-methods" },
    update: {},
    create: {
      sectionId: section12_3.id,
      number: 12.32,
      title: "Monte Carlo Methods",
      slug: "monte-carlo-methods",
      objectives: ["Estimate areas with random sampling", "Estimate π", "Understand convergence"],
      content: `# Monte Carlo Methods

Random sampling to solve deterministic problems.

## Estimating π
Points in circle / total = π/4, so π = 4 × (inside/total)

\`\`\`python
def estimate_pi(n):
    inside = sum(random.random()**2 + random.random()**2 <= 1 for _ in range(n))
    return 4 * inside / n
\`\`\``,
      codeExamples: JSON.stringify([{id: "pi", title: "Estimate π", code: "import random\\n\\ndef pi(n):\\n    inside = sum(random.uniform(-1,1)**2 + random.uniform(-1,1)**2 <= 1 for _ in range(n))\\n    return 4 * inside / n\\n\\nprint(pi(100000))", description: "Monte Carlo π"}]),
      keyPoints: ["Ratio of hits = proportion", "Error decreases as √n", "Works in any dimension"],
      hardwareDemo: "Animate points in circle.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson12_3_2.number}: ${lesson12_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {lessonId: lesson12_3_2.id, number: 1, title: "Estimate π", type: "CODE", difficulty: "INTERMEDIATE", prompt: "Implement Monte Carlo π estimation.", starterCode: "import random\\nimport math\\n\\ndef estimate_pi(n):\\n    inside = 0\\n    for _ in range(n):\\n        x, y = random.uniform(-1,1), random.uniform(-1,1)\\n        # TODO: Check if inside circle\\n    return 4 * inside / n\\n\\nfor n in [1000, 10000, 100000]:\\n    est = estimate_pi(n)\\n    print(f'n={n}: π≈{est:.4f}')", solution: "import random\\nimport math\\n\\ndef estimate_pi(n):\\n    inside = 0\\n    for _ in range(n):\\n        x, y = random.uniform(-1,1), random.uniform(-1,1)\\n        if x**2 + y**2 <= 1:\\n            inside += 1\\n    return 4 * inside / n\\n\\nfor n in [1000, 10000, 100000]:\\n    est = estimate_pi(n)\\n    print(f'n={n}: π≈{est:.4f}')", testCases: JSON.stringify([{input: "", expectedOutput: "~3.14", description: "Close to π"}]), hints: ["Inside if x²+y² <= 1"], xpReward: 20, order: 1},
      {lessonId: lesson12_3_2.id, number: 2, title: "Area Under Curve", type: "CODE", difficulty: "INTERMEDIATE", prompt: "Estimate area under y=x² from 0 to 1 (answer: 1/3).", starterCode: "import random\\n\\ndef area(n):\\n    inside = 0\\n    for _ in range(n):\\n        x, y = random.random(), random.random()\\n        # TODO: Check if under curve\\n    return inside / n\\n\\nprint(f'Area: {area(100000):.4f} (exact: 0.3333)')", solution: "import random\\n\\ndef area(n):\\n    inside = 0\\n    for _ in range(n):\\n        x, y = random.random(), random.random()\\n        if y <= x**2:\\n            inside += 1\\n    return inside / n\\n\\nprint(f'Area: {area(100000):.4f} (exact: 0.3333)')", testCases: JSON.stringify([{input: "", expectedOutput: "~0.333", description: "1/3"}]), hints: ["Under curve if y <= x²"], xpReward: 20, order: 2},
    ],
  });
  console.log(`      ✏️  2 exercises created`);

  // LESSON 12.3.3
  const lesson12_3_3 = await prisma.lesson.upsert({
    where: { slug: "statistical-inference-simulation" },
    update: {},
    create: {
      sectionId: section12_3.id,
      number: 12.33,
      title: "Statistical Inference",
      slug: "statistical-inference-simulation",
      objectives: ["Use bootstrap sampling", "Calculate confidence intervals", "Perform hypothesis tests"],
      content: `# Statistical Inference

## Bootstrap
Resample with replacement to estimate variability.

## 95% Confidence Interval
\`\`\`python
means = sorted([mean(random.choices(data, k=len(data))) for _ in range(10000)])
ci = (means[250], means[9750])  # 2.5th and 97.5th percentile
\`\`\``,
      codeExamples: JSON.stringify([{id: "bootstrap", title: "Bootstrap CI", code: "import random\\ndata = [23, 31, 28, 35, 29, 33]\\nmeans = sorted([sum(random.choices(data, k=len(data)))/len(data) for _ in range(10000)])\\nprint(f'95% CI: [{means[250]:.2f}, {means[9750]:.2f}]')", description: "Bootstrap confidence interval"}]),
      keyPoints: ["Bootstrap: resample with replacement", "95% CI: 2.5th to 97.5th percentile", "P-value: probability under null"],
      hardwareDemo: "Visualize bootstrap distribution.",
      estimatedTime: 30,
      difficulty: "ADVANCED",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson12_3_3.number}: ${lesson12_3_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {lessonId: lesson12_3_3.id, number: 1, title: "Bootstrap CI", type: "CODE", difficulty: "INTERMEDIATE", prompt: "Calculate 95% CI for mean.", starterCode: "import random\\n\\ndata = [72, 85, 91, 68, 77, 82, 79, 88]\\n\\nmeans = []\\nfor _ in range(10000):\\n    sample = random.choices(data, k=len(data))\\n    means.append(sum(sample)/len(sample))\\nmeans.sort()\\n\\nprint(f'95% CI: [{means[250]:.2f}, {means[9750]:.2f}]')", solution: "import random\\n\\ndata = [72, 85, 91, 68, 77, 82, 79, 88]\\n\\nmeans = []\\nfor _ in range(10000):\\n    sample = random.choices(data, k=len(data))\\n    means.append(sum(sample)/len(sample))\\nmeans.sort()\\n\\nprint(f'95% CI: [{means[250]:.2f}, {means[9750]:.2f}]')", testCases: JSON.stringify([{input: "", expectedOutput: "CI around 80", description: "Reasonable interval"}]), hints: ["random.choices with replacement"], xpReward: 20, order: 1},
      {lessonId: lesson12_3_3.id, number: 2, title: "Hypothesis Test", type: "CODE", difficulty: "ADVANCED", prompt: "Test if 62 heads in 100 flips indicates unfair coin.", starterCode: "import random\\n\\ndef test(obs, total, n=10000):\\n    expected = total/2\\n    obs_diff = abs(obs - expected)\\n    extreme = 0\\n    for _ in range(n):\\n        heads = sum(random.random() < 0.5 for _ in range(total))\\n        if abs(heads - expected) >= obs_diff:\\n            extreme += 1\\n    return extreme / n\\n\\np = test(62, 100)\\nprint(f'P-value: {p:.4f}')\\nprint(f'Significant at 0.05? {p < 0.05}')", solution: "import random\\n\\ndef test(obs, total, n=10000):\\n    expected = total/2\\n    obs_diff = abs(obs - expected)\\n    extreme = 0\\n    for _ in range(n):\\n        heads = sum(random.random() < 0.5 for _ in range(total))\\n        if abs(heads - expected) >= obs_diff:\\n            extreme += 1\\n    return extreme / n\\n\\np = test(62, 100)\\nprint(f'P-value: {p:.4f}')\\nprint(f'Significant at 0.05? {p < 0.05}')", testCases: JSON.stringify([{input: "", expectedOutput: "P-value ~0.02", description: "Likely significant"}]), hints: ["Count as extreme or more"], xpReward: 25, order: 2},
    ],
  });
  console.log(`      ✏️  2 exercises created`);

  // SUMMARY
  const lessonCount = await prisma.lesson.count({
    where: { section: { chapter: { number: 12 } } },
  });
  const exerciseCount = await prisma.exercise.count({
    where: { lesson: { section: { chapter: { number: 12 } } } },
  });

  console.log(`\n✅ Chapter 12 seeding complete!`);
  console.log(`   📚 1 chapter`);
  console.log(`   📂 3 sections`);
  console.log(`   📝 ${lessonCount} lessons`);
  console.log(`   ✏️  ${exerciseCount} exercises`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
