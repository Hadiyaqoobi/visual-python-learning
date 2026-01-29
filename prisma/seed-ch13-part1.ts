import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 1: Chapter 13 structure + Lesson 13.1.1...\n");

  const chapter13 = await prisma.chapter.upsert({
    where: { number: 13 },
    update: {},
    create: {
      number: 13,
      title: "Statistical Thinking",
      description: "Learn fundamental statistical concepts essential for data analysis, scientific computing, and machine learning. Master measures of central tendency, variability, distributions, and statistical significance.",
      objectives: [
        "Calculate and interpret mean, median, and mode",
        "Understand variance and standard deviation",
        "Work with probability distributions",
        "Apply statistical significance testing",
        "Make data-driven decisions with confidence",
      ],
      isPublished: true,
    },
  });
  console.log(`✅ Chapter ${chapter13.number}: ${chapter13.title}`);

  const section13_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter13.id, number: 13.1 } },
    update: {},
    create: {
      chapterId: chapter13.id,
      number: 13.1,
      title: "Measures of Central Tendency and Variability",
      description: "Learn to summarize datasets with measures of center (mean, median, mode) and spread (variance, standard deviation).",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section13_1.number}: ${section13_1.title}`);

  const section13_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter13.id, number: 13.2 } },
    update: {},
    create: {
      chapterId: chapter13.id,
      number: 13.2,
      title: "Distributions",
      description: "Understand probability distributions and how they describe data patterns.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section13_2.number}: ${section13_2.title}`);

  const section13_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter13.id, number: 13.3 } },
    update: {},
    create: {
      chapterId: chapter13.id,
      number: 13.3,
      title: "Statistical Inference",
      description: "Learn about statistical significance, confidence intervals, and making inferences from data.",
      order: 3,
    },
  });
  console.log(`  📂 Section ${section13_3.number}: ${section13_3.title}`);

  const lesson13_1_1 = await prisma.lesson.upsert({
    where: { slug: "measures-central-tendency" },
    update: {},
    create: {
      sectionId: section13_1.id,
      number: 13.11,
      title: "Measures of Central Tendency - Mean, Median, Mode",
      slug: "measures-central-tendency",
      objectives: [
        "Understand and calculate mean (average)",
        "Understand and calculate median (middle value)",
        "Understand and calculate mode (most frequent)",
        "Know when to use each measure",
        "Recognize how outliers affect each measure",
      ],
      content: `# Measures of Central Tendency

When we have a dataset, we want to summarize it with a single representative value. This is **central tendency** - where the data tends to cluster.

## Three Main Measures

| Measure | Definition | Best For |
|---------|------------|----------|
| Mean | Sum / Count | Symmetric data, no outliers |
| Median | Middle value (sorted) | Skewed data, outliers present |
| Mode | Most frequent value | Categorical data |

## Mean - The Average

The most common measure. Add all values, divide by count.

\`\`\`python
mean = sum(data) / len(data)
\`\`\`

**Warning**: Mean is sensitive to outliers! One extreme value can dramatically shift it.

## Median - The Middle Value

Sort the data, find the middle. If even count, average the two middle values.

\`\`\`python
sorted_data = sorted(data)
n = len(sorted_data)
if n % 2 == 1:
    median = sorted_data[n // 2]
else:
    median = (sorted_data[n//2 - 1] + sorted_data[n//2]) / 2
\`\`\`

**Advantage**: Median is robust to outliers!

## Mode - Most Frequent

The value that appears most often. Can have no mode (all unique) or multiple modes.

## Example: Income Data

Consider incomes: [30k, 35k, 40k, 45k, 1M]

- **Mean**: $230k (misleading - pulled up by millionaire)
- **Median**: $40k (representative of typical person)

This is why median income is reported, not mean income!`,
      codeExamples: JSON.stringify([
        {
          id: "calculate-mean",
          title: "Calculating Mean",
          code: "def calculate_mean(data):\n    if len(data) == 0:\n        return None\n    return sum(data) / len(data)\n\nscores = [85, 90, 78, 92, 88, 95, 73, 89]\nmean_score = calculate_mean(scores)\nprint(f'Mean score: {mean_score:.2f}')\n\n# Using statistics module\nimport statistics\nprint(f'Built-in: {statistics.mean(scores):.2f}')",
          description: "Manual and built-in mean calculation",
        },
        {
          id: "calculate-median",
          title: "Calculating Median",
          code: "def calculate_median(data):\n    if len(data) == 0:\n        return None\n    sorted_data = sorted(data)\n    n = len(sorted_data)\n    if n % 2 == 1:\n        return sorted_data[n // 2]\n    else:\n        return (sorted_data[n//2 - 1] + sorted_data[n//2]) / 2\n\nscores = [85, 90, 78, 92, 88]\nprint(f'Median: {calculate_median(scores)}')\n\n# With outlier\nscores_outlier = scores + [200]\nprint(f'Mean with outlier: {sum(scores_outlier)/len(scores_outlier):.2f}')\nprint(f'Median with outlier: {calculate_median(scores_outlier)}')",
          description: "Median is robust to outliers",
        },
        {
          id: "calculate-mode",
          title: "Calculating Mode",
          code: "def calculate_mode(data):\n    if len(data) == 0:\n        return None\n    frequency = {}\n    for value in data:\n        frequency[value] = frequency.get(value, 0) + 1\n    max_freq = max(frequency.values())\n    modes = [v for v, f in frequency.items() if f == max_freq]\n    if len(modes) == len(data):\n        return None  # No mode\n    return modes[0] if len(modes) == 1 else modes\n\nsizes = [7, 8, 8, 9, 9, 9, 10, 10, 11]\nprint(f'Mode: {calculate_mode(sizes)}')",
          description: "Finding the most frequent value",
        },
        {
          id: "compare-measures",
          title: "Comparing All Three",
          code: "import statistics\n\ndef analyze(data, name):\n    print(f'{name}:')\n    print(f'  Mean:   {statistics.mean(data):.2f}')\n    print(f'  Median: {statistics.median(data):.2f}')\n    try:\n        print(f'  Mode:   {statistics.mode(data)}')\n    except:\n        print(f'  Mode:   No unique mode')\n\n# Symmetric data\nanalyze([10, 20, 30, 40, 50], 'Symmetric')\n\n# Skewed data (income)\nanalyze([30000, 35000, 40000, 45000, 1000000], 'Skewed Income')",
          description: "When mean and median differ significantly, data is skewed",
        },
      ]),
      keyPoints: [
        "Mean = sum/count, sensitive to outliers",
        "Median = middle value, robust to outliers",
        "Mode = most frequent, useful for categorical data",
        "Use median for skewed data or when outliers present",
        "Mean and median similar for symmetric data",
        "Python statistics module provides built-in functions",
      ],
      hardwareDemo: "Watch sum accumulator grow, then division in ALU. See sorting for median.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson13_1_1.number}: ${lesson13_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson13_1_1.id,
        number: 1,
        title: "Calculate Mean Manually",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Calculate the mean of [12, 15, 18, 20, 25] without using the statistics module.",
        starterCode: "data = [12, 15, 18, 20, 25]\n\n# Calculate mean manually\nmean = # Your code here\n\nprint(f'Mean: {mean}')",
        solution: "data = [12, 15, 18, 20, 25]\n\nmean = sum(data) / len(data)\n\nprint(f'Mean: {mean}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Mean: 18.0", description: "Correct mean" }]),
        hints: ["Sum all values with sum(data)", "Divide by count with len(data)", "mean = sum(data) / len(data)"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson13_1_1.id,
        number: 2,
        title: "Find Median Manually",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Find the median of [5, 2, 8, 1, 9] without using statistics module. Remember to sort first!",
        starterCode: "data = [5, 2, 8, 1, 9]\n\n# Sort the data first\nsorted_data = sorted(data)\n\n# Find middle value\nmedian = # Your code here\n\nprint(f'Sorted: {sorted_data}')\nprint(f'Median: {median}')",
        solution: "data = [5, 2, 8, 1, 9]\n\nsorted_data = sorted(data)\nn = len(sorted_data)\nmedian = sorted_data[n // 2]\n\nprint(f'Sorted: {sorted_data}')\nprint(f'Median: {median}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Median: 5", description: "Middle of sorted list" }]),
        hints: ["Sort with sorted(data)", "For odd length, middle index is n // 2", "sorted_data[n // 2] gives middle value"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson13_1_1.id,
        number: 3,
        title: "Outlier Impact",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given ages = [25, 30, 35, 40, 45, 50, 100], calculate both mean and median. Which better represents the typical age?",
        starterCode: "ages = [25, 30, 35, 40, 45, 50, 100]\n\nmean_age = sum(ages) / len(ages)\n\nsorted_ages = sorted(ages)\nmedian_age = sorted_ages[len(ages) // 2]\n\nprint(f'Mean age: {mean_age:.1f}')\nprint(f'Median age: {median_age}')\nprint(f'Which is more representative? ')",
        solution: "ages = [25, 30, 35, 40, 45, 50, 100]\n\nmean_age = sum(ages) / len(ages)\n\nsorted_ages = sorted(ages)\nmedian_age = sorted_ages[len(ages) // 2]\n\nprint(f'Mean age: {mean_age:.1f}')\nprint(f'Median age: {median_age}')\nprint(f'Median (40) is more representative - 100 is an outlier!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Mean ~46.4, Median 40", description: "Median more representative" }]),
        hints: ["100 is an outlier pulling mean up", "Most ages are 25-50", "Median ignores extreme values"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson13_1_1.id,
        number: 4,
        title: "Complete Analysis Function",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function analyze_data(data) that returns a dictionary with 'mean', 'median', and 'mode' keys. Handle case where there is no mode.",
        starterCode: "def analyze_data(data):\n    # Calculate mean\n    mean = sum(data) / len(data)\n    \n    # Calculate median\n    sorted_data = sorted(data)\n    n = len(sorted_data)\n    if n % 2 == 1:\n        median = sorted_data[n // 2]\n    else:\n        median = (sorted_data[n//2-1] + sorted_data[n//2]) / 2\n    \n    # Calculate mode (find most frequent)\n    # Your code here\n    mode = None\n    \n    return {'mean': mean, 'median': median, 'mode': mode}\n\n# Test\nresult = analyze_data([1, 2, 2, 3, 4])\nprint(result)",
        solution: "def analyze_data(data):\n    mean = sum(data) / len(data)\n    \n    sorted_data = sorted(data)\n    n = len(sorted_data)\n    if n % 2 == 1:\n        median = sorted_data[n // 2]\n    else:\n        median = (sorted_data[n//2-1] + sorted_data[n//2]) / 2\n    \n    freq = {}\n    for v in data:\n        freq[v] = freq.get(v, 0) + 1\n    max_freq = max(freq.values())\n    modes = [v for v, f in freq.items() if f == max_freq]\n    mode = modes[0] if len(modes) < len(data) else None\n    \n    return {'mean': mean, 'median': median, 'mode': mode}\n\nresult = analyze_data([1, 2, 2, 3, 4])\nprint(result)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "mean: 2.4, median: 2, mode: 2", description: "All three measures" }]),
        hints: ["Use dictionary to count frequencies", "Find maximum frequency", "Mode is value with max frequency"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson13_1_1.id,
        number: 5,
        title: "Create Symmetric and Skewed Data",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create two datasets: (A) symmetric where mean is approximately equal to median, (B) skewed where mean is not equal to median. Calculate both measures for each.",
        starterCode: "# Dataset A: Symmetric (mean should equal median)\nsymmetric = [10, 20, 30, 40, 50]  # Modify if needed\n\n# Dataset B: Skewed (mean should differ from median)\nskewed = [10, 20, 30, 40, 500]  # Modify if needed\n\ndef stats(data, name):\n    mean = sum(data) / len(data)\n    s = sorted(data)\n    median = s[len(s)//2]\n    print(f'{name}: mean={mean:.1f}, median={median}')\n\nstats(symmetric, 'Symmetric')\nstats(skewed, 'Skewed')",
        solution: "symmetric = [10, 20, 30, 40, 50]\nskewed = [10, 20, 30, 40, 500]\n\ndef stats(data, name):\n    mean = sum(data) / len(data)\n    s = sorted(data)\n    median = s[len(s)//2]\n    diff = abs(mean - median)\n    print(f'{name}: mean={mean:.1f}, median={median}, diff={diff:.1f}')\n\nstats(symmetric, 'Symmetric')\nstats(skewed, 'Skewed')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Symmetric: small diff, Skewed: large diff", description: "Demonstrates skewness" }]),
        hints: ["Symmetric: values evenly spaced around center", "Skewed: add one extreme value", "Large outlier pulls mean but not median"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 13.1.1`);

  console.log("\n✅ Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
