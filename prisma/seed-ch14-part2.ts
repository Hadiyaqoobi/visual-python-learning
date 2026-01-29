import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 2: Lessons 14.2.1 (Central Limit Theorem)...\n");

  const section14_2 = await prisma.section.findFirst({
    where: { number: 14.2 },
  });
  if (!section14_2) throw new Error("Section 14.2 not found. Run part 1 first.");

  const lesson14_2_1 = await prisma.lesson.upsert({
    where: { slug: "central-limit-theorem" },
    update: {},
    create: {
      sectionId: section14_2.id,
      number: 14.21,
      title: "The Central Limit Theorem",
      slug: "central-limit-theorem",
      objectives: [
        "Understand the Central Limit Theorem statement",
        "Demonstrate CLT through simulation",
        "Calculate standard error",
        "Apply CLT to sampling distributions",
      ],
      content: `# The Central Limit Theorem (CLT)

One of the most important theorems in statistics!

## The Theorem

**Statement**: Given a population with mean μ and std dev σ, the distribution of sample means (from samples of size n) approaches a normal distribution with:
- Mean = μ (same as population)
- Std dev = σ/√n (called Standard Error)

## Why It's Amazing

- Works for ANY population shape (uniform, skewed, bimodal)
- Sample means become normally distributed
- Enables inference using normal distribution math
- Requires n ≥ 30 (rule of thumb)

## Standard Error

**SE = σ / √n**

Standard error measures how much sample means vary:
- Larger n → smaller SE → more precise estimates
- To halve SE, need 4x more samples

## Example

Population: σ = 20
- n = 25: SE = 20/√25 = 4
- n = 100: SE = 20/√100 = 2
- n = 400: SE = 20/√400 = 1

## Why CLT Matters

Without CLT: Would need to know population distribution
With CLT: Use normal distribution for any population!`,
      codeExamples: JSON.stringify([
        {
          id: "clt-uniform",
          title: "CLT with Uniform Population",
          code: "import random\nimport statistics\nimport math\n\n# Uniform population (NOT normal!)\npopulation = list(range(1, 101))\npop_std = statistics.pstdev(population)\n\n# Take 1000 samples, get mean of each\nsample_means = []\nfor _ in range(1000):\n    sample = random.sample(population, 30)\n    sample_means.append(statistics.mean(sample))\n\nprint(f'Std of sample means: {statistics.stdev(sample_means):.2f}')\nprint(f'Predicted SE (σ/√n): {pop_std/math.sqrt(30):.2f}')\nprint('\\nThey match! CLT works!')",
          description: "Sample means follow normal distribution",
        },
        {
          id: "clt-skewed",
          title: "CLT with Skewed Population",
          code: "import random\nimport statistics\n\n# Very skewed population\nskewed = [1]*70 + [5]*20 + [20]*10\nprint(f'Population: mostly 1s, some 5s, few 20s')\nprint(f'Population mean: {statistics.mean(skewed):.2f}')\n\n# Take many samples\nsample_means = []\nfor _ in range(1000):\n    sample = random.choices(skewed, k=30)\n    sample_means.append(statistics.mean(sample))\n\n# Sample means are approximately normal!\nprint(f'\\nSample means (n=30):')\nprint(f'  Mean: {statistics.mean(sample_means):.2f}')\nprint(f'  Std: {statistics.stdev(sample_means):.2f}')",
          description: "Even skewed populations give normal sample means",
        },
        {
          id: "sample-size-effect",
          title: "Sample Size Effect on SE",
          code: "import random\nimport statistics\nimport math\n\npopulation = list(range(1, 201))\npop_std = statistics.pstdev(population)\n\nprint('n     Actual SE   Predicted SE')\nfor n in [10, 30, 50, 100]:\n    means = [statistics.mean(random.sample(population, n)) for _ in range(500)]\n    actual_se = statistics.stdev(means)\n    predicted_se = pop_std / math.sqrt(n)\n    print(f'{n:3d}   {actual_se:8.2f}   {predicted_se:12.2f}')",
          description: "Larger n = smaller standard error",
        },
      ]),
      keyPoints: [
        "CLT: Sample means form normal distribution regardless of population",
        "Requires sample size n >= 30",
        "Standard Error SE = σ / √n",
        "Larger samples = smaller SE = more precision",
        "4x larger sample = 2x smaller SE",
        "CLT enables statistical inference for any population",
      ],
      hardwareDemo: "Watch 1000 sample means accumulate. See normal distribution emerge.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson14_2_1.number}: ${lesson14_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson14_2_1.id,
        number: 1,
        title: "Calculate Standard Error",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given population std dev σ = 15, calculate standard error for sample sizes 25, 100, and 400. Use formula SE = σ/√n.",
        starterCode: "import math\n\nsigma = 15\n\nfor n in [25, 100, 400]:\n    se = sigma / math.sqrt(n)\n    print(f'n = {n:3d}: SE = {se:.2f}')",
        solution: "import math\n\nsigma = 15\n\nfor n in [25, 100, 400]:\n    se = sigma / math.sqrt(n)\n    print(f'n = {n:3d}: SE = {se:.2f}')\n\nprint('\\n4x larger n = 2x smaller SE')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "SE: 3.0, 1.5, 0.75", description: "Correct SE values" }]),
        hints: ["SE = sigma / sqrt(n)", "sqrt(25)=5, sqrt(100)=10, sqrt(400)=20", "SE decreases as n increases"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson14_2_1.id,
        number: 2,
        title: "Demonstrate CLT",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create uniform population 1-50. Take 500 samples of size 30. Calculate std dev of sample means. Compare to theoretical SE = σ/√30.",
        starterCode: "import random\nimport statistics\nimport math\n\npopulation = list(range(1, 51))\npop_std = statistics.pstdev(population)\n\nsample_means = []\nfor _ in range(500):\n    sample = random.sample(population, 30)\n    sample_means.append(statistics.mean(sample))\n\nactual_se = statistics.stdev(sample_means)\ntheoretical_se = pop_std / math.sqrt(30)\n\nprint(f'Population std: {pop_std:.2f}')\nprint(f'Actual SE: {actual_se:.2f}')\nprint(f'Theoretical SE: {theoretical_se:.2f}')",
        solution: "import random\nimport statistics\nimport math\n\npopulation = list(range(1, 51))\npop_std = statistics.pstdev(population)\n\nsample_means = []\nfor _ in range(500):\n    sample = random.sample(population, 30)\n    sample_means.append(statistics.mean(sample))\n\nactual_se = statistics.stdev(sample_means)\ntheoretical_se = pop_std / math.sqrt(30)\n\nprint(f'Population std: {pop_std:.2f}')\nprint(f'Actual SE: {actual_se:.2f}')\nprint(f'Theoretical SE: {theoretical_se:.2f}')\nprint(f'Match? {abs(actual_se - theoretical_se) < 0.5}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Actual and theoretical SE close", description: "CLT verified" }]),
        hints: ["Pop std of 1-50 is about 14.4", "SE = 14.4/sqrt(30) ≈ 2.6", "Actual should be close to theoretical"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson14_2_1.id,
        number: 3,
        title: "CLT with Skewed Data",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create very skewed population: [1]*80 + [10]*15 + [100]*5. Verify CLT: take 500 samples of size 40, check if std of means matches σ/√40.",
        starterCode: "import random\nimport statistics\nimport math\n\n# Skewed population\npopulation = [1]*80 + [10]*15 + [100]*5\npop_mean = statistics.mean(population)\npop_std = statistics.pstdev(population)\n\nprint(f'Population mean: {pop_mean:.2f}')\nprint(f'Population std: {pop_std:.2f}')\n\nsample_means = []\nfor _ in range(500):\n    sample = random.choices(population, k=40)\n    sample_means.append(statistics.mean(sample))\n\nprint(f'\\nMean of sample means: {statistics.mean(sample_means):.2f}')\nprint(f'Std of sample means: {statistics.stdev(sample_means):.2f}')\nprint(f'Predicted SE: {pop_std/math.sqrt(40):.2f}')",
        solution: "import random\nimport statistics\nimport math\n\npopulation = [1]*80 + [10]*15 + [100]*5\npop_mean = statistics.mean(population)\npop_std = statistics.pstdev(population)\n\nprint(f'Population mean: {pop_mean:.2f}')\nprint(f'Population std: {pop_std:.2f}')\n\nsample_means = []\nfor _ in range(500):\n    sample = random.choices(population, k=40)\n    sample_means.append(statistics.mean(sample))\n\nprint(f'\\nMean of sample means: {statistics.mean(sample_means):.2f}')\nprint(f'Std of sample means: {statistics.stdev(sample_means):.2f}')\nprint(f'Predicted SE: {pop_std/math.sqrt(40):.2f}')\nprint('\\nCLT works even for skewed populations!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "SE matches prediction", description: "CLT works for skewed data" }]),
        hints: ["Population is very skewed (mostly 1s)", "CLT still applies with n=40", "Sample means still form normal distribution"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson14_2_1.id,
        number: 4,
        title: "Sample Size and Precision",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "For sample sizes 10, 30, 100, take 500 samples each. Calculate SE for each size. Verify: SE decreases as 1/√n.",
        starterCode: "import random\nimport statistics\nimport math\n\npopulation = list(range(1, 201))\npop_std = statistics.pstdev(population)\n\nprint('n      Actual SE   Predicted   Ratio')\nfor n in [10, 30, 100]:\n    means = [statistics.mean(random.sample(population, n)) for _ in range(500)]\n    actual = statistics.stdev(means)\n    predicted = pop_std / math.sqrt(n)\n    ratio = actual / predicted\n    print(f'{n:3d}    {actual:8.2f}    {predicted:8.2f}   {ratio:.2f}')",
        solution: "import random\nimport statistics\nimport math\n\npopulation = list(range(1, 201))\npop_std = statistics.pstdev(population)\n\nprint('n      Actual SE   Predicted   Ratio')\nfor n in [10, 30, 100]:\n    means = [statistics.mean(random.sample(population, n)) for _ in range(500)]\n    actual = statistics.stdev(means)\n    predicted = pop_std / math.sqrt(n)\n    ratio = actual / predicted\n    print(f'{n:3d}    {actual:8.2f}    {predicted:8.2f}   {ratio:.2f}')\n\nprint('\\nRatios all close to 1.0 = CLT confirmed!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Ratios near 1.0", description: "SE follows 1/sqrt(n)" }]),
        hints: ["Ratio should be close to 1.0", "This verifies SE = σ/√n formula", "Larger n = smaller SE"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson14_2_1.id,
        number: 5,
        title: "68-95-99.7 Rule for Sample Means",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Population mean=100, std=20. For samples of size 25, SE=4. Take 1000 samples. Verify ~68% of sample means are within 1 SE of 100 (96-104).",
        starterCode: "import random\nimport statistics\n\n# Generate population with mean=100, std=20\npopulation = [random.gauss(100, 20) for _ in range(10000)]\n\n# SE for n=25: 20/sqrt(25) = 4\nse = 4\n\nsample_means = []\nfor _ in range(1000):\n    sample = random.sample(population, 25)\n    sample_means.append(statistics.mean(sample))\n\n# Count within 1 SE of 100\nwithin_1se = sum(1 for m in sample_means if 96 <= m <= 104)\n\nprint(f'Sample means within 1 SE (96-104): {within_1se}')\nprint(f'Percentage: {within_1se/10:.1f}%')\nprint(f'Expected: ~68%')",
        solution: "import random\nimport statistics\n\npopulation = [random.gauss(100, 20) for _ in range(10000)]\nse = 4\n\nsample_means = []\nfor _ in range(1000):\n    sample = random.sample(population, 25)\n    sample_means.append(statistics.mean(sample))\n\nwithin_1se = sum(1 for m in sample_means if 96 <= m <= 104)\n\nprint(f'Sample means within 1 SE (96-104): {within_1se}')\nprint(f'Percentage: {within_1se/10:.1f}%')\nprint(f'Expected: ~68%')\nprint('\\n68-95-99.7 rule applies to sample means too!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "~68% within 1 SE", description: "Normal distribution of sample means" }]),
        hints: ["SE = 20/5 = 4", "1 SE from 100 is 96-104", "~68% should fall in this range"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 14.2.1`);

  console.log("\n✅ Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
