import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 1: Chapter 14 structure + Lesson 14.1.1...\n");

  const chapter14 = await prisma.chapter.upsert({
    where: { number: 14 },
    update: {},
    create: {
      number: 14,
      title: "Sampling and Confidence Intervals",
      description: "Learn how to make inferences about populations from samples. Master the Central Limit Theorem, confidence intervals, and margin of error.",
      objectives: [
        "Distinguish between population and sample",
        "Understand and apply the Central Limit Theorem",
        "Calculate and interpret confidence intervals",
        "Determine appropriate sample sizes",
        "Use bootstrap methods for inference",
      ],
      isPublished: true,
    },
  });
  console.log(`✅ Chapter ${chapter14.number}: ${chapter14.title}`);

  const section14_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter14.id, number: 14.1 } },
    update: {},
    create: {
      chapterId: chapter14.id,
      number: 14.1,
      title: "Sampling Fundamentals",
      description: "Learn the difference between populations and samples, and how to collect representative samples.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section14_1.number}: ${section14_1.title}`);

  const section14_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter14.id, number: 14.2 } },
    update: {},
    create: {
      chapterId: chapter14.id,
      number: 14.2,
      title: "Central Limit Theorem",
      description: "Understand why sample means follow a normal distribution and how this enables statistical inference.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section14_2.number}: ${section14_2.title}`);

  const section14_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter14.id, number: 14.3 } },
    update: {},
    create: {
      chapterId: chapter14.id,
      number: 14.3,
      title: "Confidence Intervals",
      description: "Learn to construct and interpret confidence intervals for population parameters.",
      order: 3,
    },
  });
  console.log(`  📂 Section ${section14_3.number}: ${section14_3.title}`);

  const lesson14_1_1 = await prisma.lesson.upsert({
    where: { slug: "population-vs-sample" },
    update: {},
    create: {
      sectionId: section14_1.id,
      number: 14.11,
      title: "Population vs Sample - Fundamentals",
      slug: "population-vs-sample",
      objectives: [
        "Distinguish between population and sample",
        "Understand representative sampling",
        "Recognize biased vs unbiased samples",
        "Implement random sampling in Python",
      ],
      content: `# Population vs Sample

## Key Definitions

**Population**: Complete set of ALL items of interest
- All registered voters in USA
- All light bulbs produced by factory
- All possible customers

**Sample**: Subset selected from population
- 1000 voters randomly selected
- 100 light bulbs tested
- 500 customers surveyed

## Why Sample?

We can't measure everything:
- **Cost**: Surveying millions is expensive
- **Time**: Sampling is faster
- **Feasibility**: Some tests are destructive
- **Infinity**: Some populations are infinite

## Parameters vs Statistics

| Population | Sample |
|------------|--------|
| Parameter (true value) | Statistic (estimate) |
| μ (mu) = population mean | x̄ (x-bar) = sample mean |
| σ (sigma) = population std | s = sample std |

**Goal**: Use sample statistics to estimate population parameters!

## Random Sampling

Critical requirement: Sample must be REPRESENTATIVE

**Good sampling** (random):
- Every member has equal chance of selection
- Avoids systematic bias
- Enables valid inference

**Bad sampling** (biased):
- Convenience sample (ask nearby people)
- Volunteer sample (only interested respond)
- Leads to wrong conclusions!`,
      codeExamples: JSON.stringify([
        {
          id: "pop-vs-sample",
          title: "Population vs Sample",
          code: "import random\n\n# Population: all values 1-100\npopulation = list(range(1, 101))\npop_mean = sum(population) / len(population)\n\nprint(f'Population size: {len(population)}')\nprint(f'Population mean: {pop_mean}')\n\n# Take random sample\nsample = random.sample(population, 20)\nsample_mean = sum(sample) / len(sample)\n\nprint(f'\\nSample size: {len(sample)}')\nprint(f'Sample mean: {sample_mean:.2f}')\nprint(f'Difference: {abs(sample_mean - pop_mean):.2f}')",
          description: "Sample estimates population",
        },
        {
          id: "sampling-variability",
          title: "Sampling Variability",
          code: "import random\nimport statistics\n\npopulation = list(range(1, 101))\npop_mean = statistics.mean(population)\n\nprint(f'Population mean: {pop_mean}')\nprint('\\n5 different samples of size 10:')\n\nfor i in range(5):\n    sample = random.sample(population, 10)\n    s_mean = statistics.mean(sample)\n    print(f'  Sample {i+1}: mean = {s_mean:.2f}')\n\nprint('\\nNotice: Different samples give different means!')",
          description: "Each sample gives different result",
        },
        {
          id: "biased-sampling",
          title: "Biased vs Random Sampling",
          code: "import random\nimport statistics\n\n# Population: mix of young and old\nyoung = [20, 22, 25, 28, 30] * 30  # 150 young\nold = [65, 70, 75, 80] * 30        # 120 old\npopulation = young + old\n\ntrue_mean = statistics.mean(population)\nprint(f'True population mean: {true_mean:.1f}')\n\n# Good: random sample\ngood = random.sample(population, 50)\nprint(f'Random sample mean: {statistics.mean(good):.1f}')\n\n# Bad: only sample young (biased!)\nbad = random.sample(young, 50)\nprint(f'Biased sample mean: {statistics.mean(bad):.1f}')",
          description: "Bias leads to wrong conclusions",
        },
      ]),
      keyPoints: [
        "Population = entire group; Sample = subset",
        "Random sampling ensures representativeness",
        "Sample statistics estimate population parameters",
        "Different samples give different results (sampling variability)",
        "Biased sampling leads to wrong conclusions",
        "random.sample() for sampling without replacement",
      ],
      hardwareDemo: "Watch random selection from population array. See sample mean calculated.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson14_1_1.number}: ${lesson14_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson14_1_1.id,
        number: 1,
        title: "Basic Sampling",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a population of numbers 1-100. Take a random sample of 10. Calculate and compare population mean (50.5) with sample mean.",
        starterCode: "import random\n\npopulation = list(range(1, 101))\npop_mean = sum(population) / len(population)\n\n# Take sample of 10\nsample = random.sample(population, 10)\nsample_mean = sum(sample) / len(sample)\n\nprint(f'Population mean: {pop_mean}')\nprint(f'Sample mean: {sample_mean:.2f}')\nprint(f'Difference: {abs(sample_mean - pop_mean):.2f}')",
        solution: "import random\n\npopulation = list(range(1, 101))\npop_mean = sum(population) / len(population)\n\nsample = random.sample(population, 10)\nsample_mean = sum(sample) / len(sample)\n\nprint(f'Population mean: {pop_mean}')\nprint(f'Sample mean: {sample_mean:.2f}')\nprint(f'Difference: {abs(sample_mean - pop_mean):.2f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Population mean: 50.5", description: "Correct population mean" }]),
        hints: ["Population mean of 1-100 is 50.5", "random.sample(pop, 10) takes 10 items", "Sample mean will vary each run"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson14_1_1.id,
        number: 2,
        title: "Sampling Variability",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Take 10 different samples of size 15 from population 1-100. Calculate mean for each. Print all 10 means. What is the range?",
        starterCode: "import random\nimport statistics\n\npopulation = list(range(1, 101))\n\nsample_means = []\nfor i in range(10):\n    sample = random.sample(population, 15)\n    mean = statistics.mean(sample)\n    sample_means.append(mean)\n    print(f'Sample {i+1}: mean = {mean:.2f}')\n\nprint(f'\\nRange: {min(sample_means):.2f} to {max(sample_means):.2f}')",
        solution: "import random\nimport statistics\n\npopulation = list(range(1, 101))\n\nsample_means = []\nfor i in range(10):\n    sample = random.sample(population, 15)\n    mean = statistics.mean(sample)\n    sample_means.append(mean)\n    print(f'Sample {i+1}: mean = {mean:.2f}')\n\nprint(f'\\nRange: {min(sample_means):.2f} to {max(sample_means):.2f}')\nprint(f'All cluster around population mean (50.5)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "10 different means around 50", description: "Shows variability" }]),
        hints: ["Each sample gives different mean", "Means should cluster around 50.5", "This is sampling variability"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson14_1_1.id,
        number: 3,
        title: "Sample Size Comparison",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Compare sample sizes 5, 20, and 50. For each, take a sample and calculate mean. Run 5 times. Which size gives most consistent estimates?",
        starterCode: "import random\nimport statistics\n\npopulation = list(range(1, 101))\npop_mean = 50.5\n\nfor size in [5, 20, 50]:\n    print(f'\\nSample size {size}:')\n    errors = []\n    for trial in range(5):\n        sample = random.sample(population, size)\n        mean = statistics.mean(sample)\n        error = abs(mean - pop_mean)\n        errors.append(error)\n        print(f'  Trial {trial+1}: mean={mean:.1f}, error={error:.1f}')\n    print(f'  Avg error: {statistics.mean(errors):.2f}')",
        solution: "import random\nimport statistics\n\npopulation = list(range(1, 101))\npop_mean = 50.5\n\nfor size in [5, 20, 50]:\n    print(f'\\nSample size {size}:')\n    errors = []\n    for trial in range(5):\n        sample = random.sample(population, size)\n        mean = statistics.mean(sample)\n        error = abs(mean - pop_mean)\n        errors.append(error)\n        print(f'  Trial {trial+1}: mean={mean:.1f}, error={error:.1f}')\n    print(f'  Avg error: {statistics.mean(errors):.2f}')\n\nprint('\\nLarger samples = more consistent estimates!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Size 50 has smallest avg error", description: "Larger = better" }]),
        hints: ["Larger samples have smaller errors", "Size 50 should be most consistent", "Error decreases with sample size"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson14_1_1.id,
        number: 4,
        title: "Biased Sampling Demo",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create population: 60% values 10-30, 40% values 70-90. Compare random sample vs biased sample (only from low values). Which estimates population mean better?",
        starterCode: "import random\nimport statistics\n\n# Population: 60% low, 40% high\nlow_vals = list(range(10, 31)) * 6   # 60% low (10-30)\nhigh_vals = list(range(70, 91)) * 4  # 40% high (70-90)\npopulation = low_vals + high_vals\n\ntrue_mean = statistics.mean(population)\nprint(f'True population mean: {true_mean:.2f}')\n\n# Random sample (good)\nrandom_sample = random.sample(population, 50)\nprint(f'Random sample mean: {statistics.mean(random_sample):.2f}')\n\n# Biased sample - only low values (bad)\nbiased_sample = random.sample(low_vals, 50)\nprint(f'Biased sample mean: {statistics.mean(biased_sample):.2f}')",
        solution: "import random\nimport statistics\n\nlow_vals = list(range(10, 31)) * 6\nhigh_vals = list(range(70, 91)) * 4\npopulation = low_vals + high_vals\n\ntrue_mean = statistics.mean(population)\nprint(f'True population mean: {true_mean:.2f}')\n\nrandom_sample = random.sample(population, 50)\nprint(f'Random sample mean: {statistics.mean(random_sample):.2f}')\n\nbiased_sample = random.sample(low_vals, 50)\nprint(f'Biased sample mean: {statistics.mean(biased_sample):.2f}')\n\nprint('\\nBiased sample misses high values entirely!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Random closer to true mean", description: "Bias causes error" }]),
        hints: ["True mean around 34", "Biased sample only sees 10-30", "Random sample represents both groups"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson14_1_1.id,
        number: 5,
        title: "Many Samples Analysis",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Take 100 samples of size 25 from population 1-200. Calculate mean of each. Find: (1) average of all sample means, (2) std dev of sample means. Compare average to true mean (100.5).",
        starterCode: "import random\nimport statistics\n\npopulation = list(range(1, 201))\ntrue_mean = statistics.mean(population)\n\nsample_means = []\nfor _ in range(100):\n    sample = random.sample(population, 25)\n    sample_means.append(statistics.mean(sample))\n\navg_of_means = statistics.mean(sample_means)\nstd_of_means = statistics.stdev(sample_means)\n\nprint(f'True population mean: {true_mean}')\nprint(f'Average of 100 sample means: {avg_of_means:.2f}')\nprint(f'Std dev of sample means: {std_of_means:.2f}')",
        solution: "import random\nimport statistics\n\npopulation = list(range(1, 201))\ntrue_mean = statistics.mean(population)\n\nsample_means = []\nfor _ in range(100):\n    sample = random.sample(population, 25)\n    sample_means.append(statistics.mean(sample))\n\navg_of_means = statistics.mean(sample_means)\nstd_of_means = statistics.stdev(sample_means)\n\nprint(f'True population mean: {true_mean}')\nprint(f'Average of 100 sample means: {avg_of_means:.2f}')\nprint(f'Std dev of sample means: {std_of_means:.2f}')\nprint('\\nSample means cluster around true mean!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Average close to 100.5", description: "Unbiased estimation" }]),
        hints: ["Average of sample means should be close to 100.5", "This demonstrates unbiased estimation", "Std of means is the standard error"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 14.1.1`);

  console.log("\n✅ Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
