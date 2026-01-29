import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 3: Lessons 13.2.1 and 13.2.2 (Distributions)...\n");

  const section13_2 = await prisma.section.findFirst({
    where: { number: 13.2 },
  });
  if (!section13_2) throw new Error("Section 13.2 not found. Run part 1 first.");

  const lesson13_2_1 = await prisma.lesson.upsert({
    where: { slug: "intro-distributions" },
    update: {},
    create: {
      sectionId: section13_2.id,
      number: 13.21,
      title: "Introduction to Distributions",
      slug: "intro-distributions",
      objectives: [
        "Understand what a probability distribution is",
        "Distinguish discrete vs continuous distributions",
        "Recognize common distribution shapes",
        "Connect distributions to real phenomena",
      ],
      content: `# Introduction to Distributions

A **distribution** describes how values are spread across possible outcomes. Instead of listing all data, we describe the pattern.

## Two Types

| Type | Description | Examples |
|------|-------------|----------|
| Discrete | Countable outcomes | Dice rolls, coin flips |
| Continuous | Infinite possible values | Height, temperature |

## Why Distributions Matter

- Summarize large datasets compactly
- Make predictions about future data
- Understand underlying processes
- Foundation for statistical inference

## Common Discrete Distributions

**Uniform**: All outcomes equally likely (fair die)

**Binomial**: Number of successes in N trials (coin flips)

**Poisson**: Count of rare events (customer arrivals)

## Common Continuous Distributions

**Normal (Gaussian)**: Bell curve, most common in nature

**Exponential**: Time between events

**Uniform**: All values in range equally likely

## Distribution Properties

Every distribution has:
- **Mean**: Center/expected value
- **Variance**: Spread/width
- **Shape**: Symmetric, skewed, etc.`,
      codeExamples: JSON.stringify([
        {
          id: "dice-distribution",
          title: "Discrete: Two Dice Sum",
          code: "import random\n\nnum_rolls = 10000\nsums = [0] * 13\n\nfor _ in range(num_rolls):\n    total = random.randint(1,6) + random.randint(1,6)\n    sums[total] += 1\n\nprint('Sum : Probability')\nfor s in range(2, 13):\n    prob = sums[s] / num_rolls\n    bar = '#' * int(prob * 50)\n    print(f'{s:2d}  : {prob:.3f} {bar}')",
          description: "7 is most common (6 ways to make it)",
        },
        {
          id: "normal-approx",
          title: "Approximating Normal Distribution",
          code: "import random\nimport statistics\n\ndef approx_normal(mean, std, n):\n    samples = []\n    for _ in range(n):\n        # Sum of 12 uniforms approximates normal\n        val = sum(random.random() for _ in range(12))\n        # Transform: mean=6, std=1 -> desired\n        samples.append(mean + std * (val - 6))\n    return samples\n\nheights = approx_normal(170, 10, 1000)\nprint(f'Mean: {statistics.mean(heights):.1f}')\nprint(f'Std: {statistics.stdev(heights):.1f}')\n\n# Count within 1 std dev\nwithin_1std = sum(1 for h in heights if 160 <= h <= 180)\nprint(f'Within 1 std: {within_1std/10:.1f}% (expect ~68%)')",
          description: "Central Limit Theorem in action",
        },
        {
          id: "histogram",
          title: "Building a Histogram",
          code: "import random\n\ndef histogram(data, bins=10):\n    min_v, max_v = min(data), max(data)\n    width = (max_v - min_v) / bins\n    counts = [0] * bins\n    \n    for v in data:\n        idx = min(int((v - min_v) / width), bins - 1)\n        counts[idx] += 1\n    \n    for i, c in enumerate(counts):\n        lo = min_v + i * width\n        bar = '#' * (c // 5)\n        print(f'{lo:5.1f}: {bar}')\n\ndata = [random.gauss(50, 10) for _ in range(500)]\nhistogram(data)",
          description: "Visualizing distribution shape",
        },
      ]),
      keyPoints: [
        "Distribution describes how values spread across outcomes",
        "Discrete: countable outcomes (dice, coins)",
        "Continuous: infinite values (height, time)",
        "Normal distribution: bell curve, very common",
        "Mean and variance characterize any distribution",
        "Shape matters: symmetric vs skewed",
      ],
      hardwareDemo: "Watch counters increment as samples accumulate. See histogram bins fill up.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson13_2_1.number}: ${lesson13_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson13_2_1.id,
        number: 1,
        title: "Die Roll Distribution",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Roll a die 6000 times. Count frequency of each face. Is it approximately uniform (each ~1000)?",
        starterCode: "import random\n\nrolls = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0}\n\nfor _ in range(6000):\n    face = random.randint(1, 6)\n    rolls[face] += 1\n\nprint('Face : Count')\nfor face in range(1, 7):\n    print(f'{face}    : {rolls[face]}')",
        solution: "import random\n\nrolls = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0}\n\nfor _ in range(6000):\n    face = random.randint(1, 6)\n    rolls[face] += 1\n\nprint('Face : Count')\nfor face in range(1, 7):\n    print(f'{face}    : {rolls[face]}')\n\nprint('\\nEach should be close to 1000 (uniform)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Each face ~1000", description: "Uniform distribution" }]),
        hints: ["6000/6 = 1000 expected per face", "Small variations are normal", "This is uniform distribution"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson13_2_1.id,
        number: 2,
        title: "Two Dice Sum Distribution",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Roll two dice 10000 times. Create distribution of sums (2-12). Which sum is most common?",
        starterCode: "import random\n\nsums = {}\nfor i in range(2, 13):\n    sums[i] = 0\n\nfor _ in range(10000):\n    total = random.randint(1,6) + random.randint(1,6)\n    sums[total] += 1\n\nprint('Sum : Count : Probability')\nfor s in range(2, 13):\n    prob = sums[s] / 10000\n    print(f'{s:2d}  : {sums[s]:4d}  : {prob:.3f}')",
        solution: "import random\n\nsums = {}\nfor i in range(2, 13):\n    sums[i] = 0\n\nfor _ in range(10000):\n    total = random.randint(1,6) + random.randint(1,6)\n    sums[total] += 1\n\nprint('Sum : Count : Probability')\nfor s in range(2, 13):\n    prob = sums[s] / 10000\n    print(f'{s:2d}  : {sums[s]:4d}  : {prob:.3f}')\n\nprint('\\n7 is most common (6 ways: 1+6, 2+5, 3+4, 4+3, 5+2, 6+1)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "7 has highest count", description: "Peak at 7" }]),
        hints: ["7 can be made 6 ways", "2 and 12 can only be made 1 way each", "Distribution is triangular"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson13_2_1.id,
        number: 3,
        title: "Simulate Heights",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Generate 1000 heights with mean=165cm, std=8cm using random.gauss(). Count how many fall within 1 std dev (157-173cm). Should be ~68%.",
        starterCode: "import random\nimport statistics\n\nheights = [random.gauss(165, 8) for _ in range(1000)]\n\nmean = statistics.mean(heights)\nstd = statistics.stdev(heights)\nprint(f'Mean: {mean:.1f} cm')\nprint(f'Std Dev: {std:.1f} cm')\n\n# Count within 1 std dev of mean (157-173)\nwithin = sum(1 for h in heights if 157 <= h <= 173)\nprint(f'Within 1 std dev: {within} ({within/10:.1f}%)')",
        solution: "import random\nimport statistics\n\nheights = [random.gauss(165, 8) for _ in range(1000)]\n\nmean = statistics.mean(heights)\nstd = statistics.stdev(heights)\nprint(f'Mean: {mean:.1f} cm')\nprint(f'Std Dev: {std:.1f} cm')\n\nwithin = sum(1 for h in heights if 157 <= h <= 173)\nprint(f'Within 1 std dev: {within} ({within/10:.1f}%)')\nprint('Expected: ~68% for normal distribution')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "~68% within 1 std dev", description: "Normal distribution property" }]),
        hints: ["random.gauss(mean, std) generates normal values", "165 +/- 8 = 157 to 173", "68-95-99.7 rule for normal"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson13_2_1.id,
        number: 4,
        title: "Binomial Distribution",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Flip 10 coins 1000 times. Count heads each time. Create distribution of head counts (0-10). Where does it peak?",
        starterCode: "import random\n\ndef flip_coins(n):\n    return sum(1 for _ in range(n) if random.random() < 0.5)\n\ncounts = {}\nfor i in range(11):\n    counts[i] = 0\n\nfor _ in range(1000):\n    heads = flip_coins(10)\n    counts[heads] += 1\n\nprint('Heads : Count')\nfor h in range(11):\n    bar = '#' * (counts[h] // 10)\n    print(f'{h:2d}    : {counts[h]:3d} {bar}')",
        solution: "import random\n\ndef flip_coins(n):\n    return sum(1 for _ in range(n) if random.random() < 0.5)\n\ncounts = {}\nfor i in range(11):\n    counts[i] = 0\n\nfor _ in range(1000):\n    heads = flip_coins(10)\n    counts[heads] += 1\n\nprint('Heads : Count')\nfor h in range(11):\n    bar = '#' * (counts[h] // 10)\n    print(f'{h:2d}    : {counts[h]:3d} {bar}')\n\nprint('\\nPeaks at 5 (expected value = n*p = 10*0.5)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Peaks at 5 heads", description: "Binomial distribution" }]),
        hints: ["Expected heads = 10 * 0.5 = 5", "Distribution is symmetric around 5", "This is binomial distribution"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson13_2_1.id,
        number: 5,
        title: "Central Limit Theorem",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Compare std dev of: (A) single uniform random, (B) average of 2 uniforms, (C) average of 12 uniforms. What happens as you average more?",
        starterCode: "import random\nimport statistics\n\ndef sample_a():\n    return random.random()\n\ndef sample_b():\n    return (random.random() + random.random()) / 2\n\ndef sample_c():\n    return sum(random.random() for _ in range(12)) / 12\n\ndata_a = [sample_a() for _ in range(1000)]\ndata_b = [sample_b() for _ in range(1000)]\ndata_c = [sample_c() for _ in range(1000)]\n\nprint(f'A (1 uniform): std = {statistics.stdev(data_a):.4f}')\nprint(f'B (avg of 2):  std = {statistics.stdev(data_b):.4f}')\nprint(f'C (avg of 12): std = {statistics.stdev(data_c):.4f}')",
        solution: "import random\nimport statistics\n\ndef sample_a():\n    return random.random()\n\ndef sample_b():\n    return (random.random() + random.random()) / 2\n\ndef sample_c():\n    return sum(random.random() for _ in range(12)) / 12\n\ndata_a = [sample_a() for _ in range(1000)]\ndata_b = [sample_b() for _ in range(1000)]\ndata_c = [sample_c() for _ in range(1000)]\n\nprint(f'A (1 uniform): std = {statistics.stdev(data_a):.4f}')\nprint(f'B (avg of 2):  std = {statistics.stdev(data_b):.4f}')\nprint(f'C (avg of 12): std = {statistics.stdev(data_c):.4f}')\nprint('\\nStd dev decreases as you average more values!')\nprint('This is the Central Limit Theorem')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Std dev decreases with more averaging", description: "CLT demonstration" }]),
        hints: ["Averaging reduces variability", "Std dev decreases as 1/sqrt(n)", "CLT: averages become normal"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 13.2.1`);

  const lesson13_2_2 = await prisma.lesson.upsert({
    where: { slug: "normal-distribution" },
    update: {},
    create: {
      sectionId: section13_2.id,
      number: 13.22,
      title: "The Normal Distribution",
      slug: "normal-distribution",
      objectives: [
        "Understand the normal (Gaussian) distribution",
        "Apply the 68-95-99.7 rule",
        "Calculate z-scores for standardization",
        "Use normal distribution for predictions",
      ],
      content: `# The Normal Distribution

The **normal distribution** (bell curve) is the most important distribution in statistics. It appears everywhere in nature!

## Why So Common?

**Central Limit Theorem**: When you average many independent random effects, the result is approximately normal - regardless of the original distribution!

Examples: Height (many genes), test scores (many factors), measurement errors

## The Bell Curve Shape

- Symmetric around the mean
- Mean = Median = Mode (at center)
- Tails extend infinitely but probability drops rapidly
- Defined completely by mean (center) and std dev (width)

## The 68-95-99.7 Rule

For any normal distribution:
- **68%** of data within 1 std dev of mean
- **95%** within 2 std devs
- **99.7%** within 3 std devs

Example: IQ scores (mean=100, std=15)
- 68% have IQ 85-115
- 95% have IQ 70-130
- 99.7% have IQ 55-145

## Z-Scores: Standardization

**Z-score** = (value - mean) / std_dev

Tells you how many std devs from the mean:
- z = 0: at the mean
- z = 1: one std dev above mean
- z = -2: two std devs below mean

Z-scores let you compare values from different distributions!`,
      codeExamples: JSON.stringify([
        {
          id: "68-95-99",
          title: "Verifying 68-95-99.7 Rule",
          code: "import random\n\ndata = [random.gauss(100, 15) for _ in range(10000)]\nmean, std = 100, 15\n\nwithin_1 = sum(1 for x in data if mean-std <= x <= mean+std)\nwithin_2 = sum(1 for x in data if mean-2*std <= x <= mean+2*std)\nwithin_3 = sum(1 for x in data if mean-3*std <= x <= mean+3*std)\n\nprint(f'Within 1 std: {within_1/100:.1f}% (expect 68%)')\nprint(f'Within 2 std: {within_2/100:.1f}% (expect 95%)')\nprint(f'Within 3 std: {within_3/100:.1f}% (expect 99.7%)')",
          description: "The empirical rule in action",
        },
        {
          id: "z-scores",
          title: "Computing Z-Scores",
          code: "def z_score(value, mean, std):\n    return (value - mean) / std\n\n# IQ scores: mean=100, std=15\nmean, std = 100, 15\n\ntest_values = [85, 100, 115, 130, 145]\nprint('IQ    Z-Score  Interpretation')\nfor iq in test_values:\n    z = z_score(iq, mean, std)\n    if abs(z) < 1:\n        interp = 'average'\n    elif abs(z) < 2:\n        interp = 'above/below average'\n    else:\n        interp = 'exceptional'\n    print(f'{iq:3d}   {z:+5.2f}    {interp}')",
          description: "Standardizing to compare values",
        },
        {
          id: "compare-distributions",
          title: "Comparing Different Scales",
          code: "def z_score(val, mean, std):\n    return (val - mean) / std\n\n# Student scored 80 on Math (mean=70, std=10)\n# Student scored 85 on English (mean=75, std=5)\n\nmath_z = z_score(80, 70, 10)\nenglish_z = z_score(85, 75, 5)\n\nprint(f'Math: 80 -> z = {math_z:+.1f}')\nprint(f'English: 85 -> z = {english_z:+.1f}')\nprint(f'\\nBetter relative performance: English (higher z-score)')",
          description: "Z-scores enable fair comparison",
        },
      ]),
      keyPoints: [
        "Normal distribution: symmetric bell curve",
        "Defined by mean (center) and std dev (width)",
        "68-95-99.7 rule: % within 1, 2, 3 std devs",
        "Central Limit Theorem explains why normal is so common",
        "Z-score = (value - mean) / std_dev",
        "Z-scores standardize for comparison across distributions",
      ],
      hardwareDemo: "Watch z-score calculation in ALU. See data points categorized by distance from mean.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson13_2_2.number}: ${lesson13_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson13_2_2.id,
        number: 1,
        title: "Verify 68-95-99.7",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Generate 1000 values from normal distribution (mean=50, std=10). Count what percentage falls within 1, 2, and 3 std devs.",
        starterCode: "import random\n\ndata = [random.gauss(50, 10) for _ in range(1000)]\nmean, std = 50, 10\n\nwithin_1 = sum(1 for x in data if mean-std <= x <= mean+std)\nwithin_2 = sum(1 for x in data if mean-2*std <= x <= mean+2*std)\nwithin_3 = sum(1 for x in data if mean-3*std <= x <= mean+3*std)\n\nprint(f'Within 1 std (40-60): {within_1/10:.1f}%')\nprint(f'Within 2 std (30-70): {within_2/10:.1f}%')\nprint(f'Within 3 std (20-80): {within_3/10:.1f}%')",
        solution: "import random\n\ndata = [random.gauss(50, 10) for _ in range(1000)]\nmean, std = 50, 10\n\nwithin_1 = sum(1 for x in data if mean-std <= x <= mean+std)\nwithin_2 = sum(1 for x in data if mean-2*std <= x <= mean+2*std)\nwithin_3 = sum(1 for x in data if mean-3*std <= x <= mean+3*std)\n\nprint(f'Within 1 std (40-60): {within_1/10:.1f}%')\nprint(f'Within 2 std (30-70): {within_2/10:.1f}%')\nprint(f'Within 3 std (20-80): {within_3/10:.1f}%')\nprint('\\nExpected: ~68%, ~95%, ~99.7%')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "~68%, ~95%, ~99.7%", description: "Empirical rule verified" }]),
        hints: ["1 std: 50 +/- 10 = 40 to 60", "2 std: 50 +/- 20 = 30 to 70", "Results should be close to 68, 95, 99.7"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson13_2_2.id,
        number: 2,
        title: "Calculate Z-Scores",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given test scores with mean=75, std=8, calculate z-scores for: 75, 83, 67, 91, 59. Classify each as average (|z|<1), above/below average (1<=|z|<2), or exceptional (|z|>=2).",
        starterCode: "def z_score(value, mean, std):\n    return (value - mean) / std\n\nmean, std = 75, 8\nscores = [75, 83, 67, 91, 59]\n\nprint('Score  Z-Score  Category')\nfor s in scores:\n    z = z_score(s, mean, std)\n    # Classify based on |z|\n    if abs(z) < 1:\n        cat = 'average'\n    elif abs(z) < 2:\n        cat = 'above/below avg'\n    else:\n        cat = 'exceptional'\n    print(f'{s:3d}    {z:+5.2f}    {cat}')",
        solution: "def z_score(value, mean, std):\n    return (value - mean) / std\n\nmean, std = 75, 8\nscores = [75, 83, 67, 91, 59]\n\nprint('Score  Z-Score  Category')\nfor s in scores:\n    z = z_score(s, mean, std)\n    if abs(z) < 1:\n        cat = 'average'\n    elif abs(z) < 2:\n        cat = 'above/below avg'\n    else:\n        cat = 'exceptional'\n    print(f'{s:3d}    {z:+5.2f}    {cat}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "75: z=0, 91: z=+2, 59: z=-2", description: "Correct z-scores" }]),
        hints: ["z = (score - mean) / std", "75 is exactly at mean, so z=0", "91 is 2 std devs above (z=+2)"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson13_2_2.id,
        number: 3,
        title: "Compare Across Subjects",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Alice scored 85 in Math (class mean=78, std=7) and 90 in History (class mean=85, std=3). In which subject did she perform better relative to her class?",
        starterCode: "def z_score(value, mean, std):\n    return (value - mean) / std\n\nmath_score = 85\nmath_mean, math_std = 78, 7\n\nhistory_score = 90\nhistory_mean, history_std = 85, 3\n\nmath_z = z_score(math_score, math_mean, math_std)\nhistory_z = z_score(history_score, history_mean, history_std)\n\nprint(f'Math: {math_score} -> z = {math_z:.2f}')\nprint(f'History: {history_score} -> z = {history_z:.2f}')\nprint(f'\\nBetter relative performance: ')",
        solution: "def z_score(value, mean, std):\n    return (value - mean) / std\n\nmath_score = 85\nmath_mean, math_std = 78, 7\n\nhistory_score = 90\nhistory_mean, history_std = 85, 3\n\nmath_z = z_score(math_score, math_mean, math_std)\nhistory_z = z_score(history_score, history_mean, history_std)\n\nprint(f'Math: {math_score} -> z = {math_z:.2f}')\nprint(f'History: {history_score} -> z = {history_z:.2f}')\nprint(f'\\nBetter relative performance: History (z={history_z:.2f} > z={math_z:.2f})')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "History has higher z-score", description: "Fair comparison" }]),
        hints: ["Higher raw score doesn't mean better relative performance", "Compare z-scores, not raw scores", "History z = (90-85)/3 = 1.67"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson13_2_2.id,
        number: 4,
        title: "Find Percentile",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Generate 10000 heights (mean=170, std=10). What percentile is a height of 185cm? (What % of people are shorter?)",
        starterCode: "import random\n\nheights = [random.gauss(170, 10) for _ in range(10000)]\ntarget = 185\n\n# Count how many are shorter than target\nshorter = sum(1 for h in heights if h < target)\npercentile = shorter / 100\n\nprint(f'Height {target}cm is at the {percentile:.1f}th percentile')\nprint(f'{percentile:.1f}% of people are shorter')",
        solution: "import random\n\nheights = [random.gauss(170, 10) for _ in range(10000)]\ntarget = 185\n\nshorter = sum(1 for h in heights if h < target)\npercentile = shorter / 100\n\nprint(f'Height {target}cm is at the {percentile:.1f}th percentile')\nprint(f'{percentile:.1f}% of people are shorter')\n\n# 185 is 1.5 std devs above mean\n# ~93% below (from z-table)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "~93rd percentile", description: "185 is 1.5 std devs above" }]),
        hints: ["185 = 170 + 1.5*10 (1.5 std devs above)", "About 93% of normal data below 1.5 std devs", "Count how many heights < 185"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson13_2_2.id,
        number: 5,
        title: "Identify Outliers with Z-Score",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Given data [45, 48, 52, 55, 58, 62, 150], use z-scores to identify outliers (|z| > 2). Calculate mean/std first, then find outliers.",
        starterCode: "import statistics\n\ndata = [45, 48, 52, 55, 58, 62, 150]\n\nmean = statistics.mean(data)\nstd = statistics.pstdev(data)\n\nprint(f'Mean: {mean:.2f}')\nprint(f'Std Dev: {std:.2f}')\nprint()\n\nprint('Value  Z-Score  Outlier?')\nfor x in data:\n    z = (x - mean) / std\n    outlier = 'YES' if abs(z) > 2 else 'no'\n    print(f'{x:4d}   {z:+6.2f}   {outlier}')",
        solution: "import statistics\n\ndata = [45, 48, 52, 55, 58, 62, 150]\n\nmean = statistics.mean(data)\nstd = statistics.pstdev(data)\n\nprint(f'Mean: {mean:.2f}')\nprint(f'Std Dev: {std:.2f}')\nprint()\n\nprint('Value  Z-Score  Outlier?')\nfor x in data:\n    z = (x - mean) / std\n    outlier = 'YES' if abs(z) > 2 else 'no'\n    print(f'{x:4d}   {z:+6.2f}   {outlier}')\n\nprint('\\n150 is the outlier (z > 2)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "150 identified as outlier", description: "Z-score outlier detection" }]),
        hints: ["Calculate mean and std of all data", "z = (value - mean) / std", "150 is far from the rest"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 13.2.2`);

  console.log("\n✅ Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
