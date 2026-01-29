import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 2: Lesson 13.1.2 (Variance and Standard Deviation)...\n");

  const section13_1 = await prisma.section.findFirst({
    where: { number: 13.1 },
  });
  if (!section13_1) throw new Error("Section 13.1 not found. Run part 1 first.");

  const lesson13_1_2 = await prisma.lesson.upsert({
    where: { slug: "measures-variability" },
    update: {},
    create: {
      sectionId: section13_1.id,
      number: 13.12,
      title: "Measures of Variability - Range, Variance, Standard Deviation",
      slug: "measures-variability",
      objectives: [
        "Understand why variability matters",
        "Calculate range, variance, and standard deviation",
        "Interpret standard deviation in context",
        "Compare datasets using variability measures",
      ],
      content: `# Measures of Variability

Central tendency alone is insufficient. Consider two students with mean score = 80:

- **Student A**: [80, 80, 80, 80, 80] - Consistent!
- **Student B**: [40, 60, 80, 100, 120] - Highly variable!

Same mean, very different stories. Variability tells us how spread out data is.

## Range - Simplest Measure

**Range = Maximum - Minimum**

Simple but limited - only uses two values, sensitive to outliers.

## Variance - Average Squared Deviation

Variance measures average squared distance from mean:

\`\`\`
variance = sum((x - mean)^2 for x in data) / n
\`\`\`

**Why square?**
- Positive and negative deviations don't cancel
- Emphasizes larger deviations
- Useful mathematical properties

**Problem**: Units are squared (dollars becomes dollars squared)

## Standard Deviation - Interpretable Spread

**Standard Deviation = Square Root of Variance**

Returns to original units! Much more interpretable.

**The 68-95-99.7 Rule** (for normal distributions):
- ~68% of data within 1 std dev of mean
- ~95% within 2 std devs
- ~99.7% within 3 std devs

Example: Heights with mean=170cm, std=10cm
- 68% of people: 160-180cm
- 95% of people: 150-190cm

## Interpretation

- **Low std dev**: Data clustered, consistent, predictable
- **High std dev**: Data spread out, variable, uncertain`,
      codeExamples: JSON.stringify([
        {
          id: "variance-stddev",
          title: "Computing Variance and Std Dev",
          code: "import math\n\ndef variance(data):\n    mean = sum(data) / len(data)\n    squared_diffs = [(x - mean)**2 for x in data]\n    return sum(squared_diffs) / len(data)\n\ndef std_dev(data):\n    return math.sqrt(variance(data))\n\nscores = [75, 80, 85, 90, 95]\nprint(f'Data: {scores}')\nprint(f'Mean: {sum(scores)/len(scores)}')\nprint(f'Variance: {variance(scores):.2f}')\nprint(f'Std Dev: {std_dev(scores):.2f}')",
          description: "Manual calculation of variance and standard deviation",
        },
        {
          id: "compare-variability",
          title: "Comparing Two Datasets",
          code: "import statistics\n\nstudent_a = [78, 80, 79, 81, 80, 82, 79]\nstudent_b = [50, 70, 90, 60, 100, 65, 85]\n\nprint('Student A (Consistent):')\nprint(f'  Mean: {statistics.mean(student_a):.1f}')\nprint(f'  Std Dev: {statistics.stdev(student_a):.1f}')\n\nprint('Student B (Variable):')\nprint(f'  Mean: {statistics.mean(student_b):.1f}')\nprint(f'  Std Dev: {statistics.stdev(student_b):.1f}')",
          description: "Same mean, different variability",
        },
        {
          id: "outlier-effect",
          title: "Effect of Outliers on Std Dev",
          code: "import statistics\n\nnormal = [10, 12, 14, 16, 18, 20, 22]\nwith_outlier = normal + [200]\n\nprint('Normal data:')\nprint(f'  Mean: {statistics.mean(normal):.1f}')\nprint(f'  Std Dev: {statistics.stdev(normal):.1f}')\n\nprint('With outlier [200]:')\nprint(f'  Mean: {statistics.mean(with_outlier):.1f}')\nprint(f'  Std Dev: {statistics.stdev(with_outlier):.1f}')\n\n# Outlier dramatically increases std dev!",
          description: "Outliers inflate standard deviation",
        },
      ]),
      keyPoints: [
        "Variability measures how spread out data is",
        "Range = max - min (simple but limited)",
        "Variance = average of squared deviations from mean",
        "Std dev = sqrt(variance), same units as data",
        "Low std dev means consistent, high means variable",
        "Outliers dramatically inflate variance and std dev",
        "statistics.stdev() uses sample formula (n-1)",
      ],
      hardwareDemo: "Watch squared deviations computed in ALU. See sum accumulation and sqrt operation.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson13_1_2.number}: ${lesson13_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson13_1_2.id,
        number: 1,
        title: "Calculate Variance Manually",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Calculate the variance of [2, 4, 6, 8, 10] manually without using statistics module.",
        starterCode: "import math\n\ndata = [2, 4, 6, 8, 10]\n\n# Step 1: Calculate mean\nmean = sum(data) / len(data)\nprint(f'Mean: {mean}')\n\n# Step 2: Calculate squared deviations\nsquared_diffs = [(x - mean)**2 for x in data]\nprint(f'Squared diffs: {squared_diffs}')\n\n# Step 3: Calculate variance (average of squared diffs)\nvariance = # Your code\nprint(f'Variance: {variance}')\n\n# Step 4: Calculate std dev\nstd_dev = math.sqrt(variance)\nprint(f'Std Dev: {std_dev:.2f}')",
        solution: "import math\n\ndata = [2, 4, 6, 8, 10]\n\nmean = sum(data) / len(data)\nprint(f'Mean: {mean}')\n\nsquared_diffs = [(x - mean)**2 for x in data]\nprint(f'Squared diffs: {squared_diffs}')\n\nvariance = sum(squared_diffs) / len(data)\nprint(f'Variance: {variance}')\n\nstd_dev = math.sqrt(variance)\nprint(f'Std Dev: {std_dev:.2f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Variance: 8.0, Std Dev: 2.83", description: "Correct calculations" }]),
        hints: ["Mean of [2,4,6,8,10] is 6", "Variance = sum of squared diffs / n", "Std dev = sqrt(variance)"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson13_1_2.id,
        number: 2,
        title: "Compare Factory Quality",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Two factories produce widgets. Factory A: [10,10,10,10,10], Factory B: [5,8,10,12,15]. Both have mean=10. Which has better quality control (lower variability)?",
        starterCode: "import statistics\n\nfactory_a = [10, 10, 10, 10, 10]\nfactory_b = [5, 8, 10, 12, 15]\n\nprint('Factory A:')\nprint(f'  Mean: {statistics.mean(factory_a)}')\nprint(f'  Std Dev: {statistics.pstdev(factory_a):.2f}')\n\nprint('Factory B:')\nprint(f'  Mean: {statistics.mean(factory_b)}')\nprint(f'  Std Dev: {statistics.pstdev(factory_b):.2f}')\n\nprint(f'\\nBetter quality control: ')",
        solution: "import statistics\n\nfactory_a = [10, 10, 10, 10, 10]\nfactory_b = [5, 8, 10, 12, 15]\n\nprint('Factory A:')\nprint(f'  Mean: {statistics.mean(factory_a)}')\nprint(f'  Std Dev: {statistics.pstdev(factory_a):.2f}')\n\nprint('Factory B:')\nprint(f'  Mean: {statistics.mean(factory_b)}')\nprint(f'  Std Dev: {statistics.pstdev(factory_b):.2f}')\n\nprint(f'\\nBetter quality control: Factory A (std dev = 0)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Factory A has std dev 0", description: "Perfect consistency" }]),
        hints: ["Factory A has all identical values", "Std dev of identical values is 0", "Lower variability = better quality control"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson13_1_2.id,
        number: 3,
        title: "Create Target Std Dev",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a dataset of 10 numbers with mean = 50 and standard deviation as close to 10 as possible. Verify with statistics.pstdev().",
        starterCode: "import statistics\n\n# Create dataset with mean=50 and std dev close to 10\n# Hint: Values should spread roughly 10 units from mean\ndata = [40, 42, 45, 48, 50, 50, 52, 55, 58, 60]  # Modify this!\n\nmean = statistics.mean(data)\nstd = statistics.pstdev(data)\n\nprint(f'Data: {data}')\nprint(f'Mean: {mean}')\nprint(f'Std Dev: {std:.2f}')\nprint(f'Target std dev: 10')",
        solution: "import statistics\n\n# Spread values around 50, roughly +/- 10\ndata = [35, 40, 45, 47, 50, 50, 53, 55, 60, 65]\n\nmean = statistics.mean(data)\nstd = statistics.pstdev(data)\n\nprint(f'Data: {data}')\nprint(f'Mean: {mean}')\nprint(f'Std Dev: {std:.2f}')\nprint(f'Target std dev: 10')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Std dev close to 10", description: "Approximately correct spread" }]),
        hints: ["Mean of 50 means values should average to 50", "Std dev of 10 means typical distance from mean is ~10", "Try values like 40, 45, 50, 55, 60"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson13_1_2.id,
        number: 4,
        title: "Same Mean, Different Variance",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Compare three datasets: A=[1,2,3,4,5], B=[1,1,3,5,5], C=[3,3,3,3,3]. All have mean=3. Calculate variance for each and explain why they differ.",
        starterCode: "import statistics\n\nA = [1, 2, 3, 4, 5]\nB = [1, 1, 3, 5, 5]\nC = [3, 3, 3, 3, 3]\n\nfor name, data in [('A', A), ('B', B), ('C', C)]:\n    mean = statistics.mean(data)\n    var = statistics.pvariance(data)\n    print(f'Dataset {name}: mean={mean}, variance={var:.2f}')",
        solution: "import statistics\n\nA = [1, 2, 3, 4, 5]\nB = [1, 1, 3, 5, 5]\nC = [3, 3, 3, 3, 3]\n\nfor name, data in [('A', A), ('B', B), ('C', C)]:\n    mean = statistics.mean(data)\n    var = statistics.pvariance(data)\n    print(f'Dataset {name}: mean={mean}, variance={var:.2f}')\n\nprint('\\nA: evenly spread')\nprint('B: clustered at extremes (higher variance)')\nprint('C: all identical (zero variance)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "A: 2.0, B: 3.2, C: 0.0", description: "Different variances explained" }]),
        hints: ["C has all same values so variance=0", "B has more extreme values than A", "Extreme values increase variance"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson13_1_2.id,
        number: 5,
        title: "Remove Outliers",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write a function that removes outliers (values more than 2 std devs from mean). Test on [10,12,14,16,18,100]. Recalculate mean and std dev after removal.",
        starterCode: "import statistics\n\ndef remove_outliers(data):\n    mean = statistics.mean(data)\n    std = statistics.pstdev(data)\n    \n    # Keep values within 2 std devs of mean\n    cleaned = [x for x in data if # Your condition here]\n    \n    return cleaned\n\noriginal = [10, 12, 14, 16, 18, 100]\nprint(f'Original: {original}')\nprint(f'  Mean: {statistics.mean(original):.2f}')\nprint(f'  Std Dev: {statistics.pstdev(original):.2f}')\n\ncleaned = remove_outliers(original)\nprint(f'\\nCleaned: {cleaned}')\nprint(f'  Mean: {statistics.mean(cleaned):.2f}')\nprint(f'  Std Dev: {statistics.pstdev(cleaned):.2f}')",
        solution: "import statistics\n\ndef remove_outliers(data):\n    mean = statistics.mean(data)\n    std = statistics.pstdev(data)\n    \n    lower = mean - 2 * std\n    upper = mean + 2 * std\n    cleaned = [x for x in data if lower <= x <= upper]\n    \n    return cleaned\n\noriginal = [10, 12, 14, 16, 18, 100]\nprint(f'Original: {original}')\nprint(f'  Mean: {statistics.mean(original):.2f}')\nprint(f'  Std Dev: {statistics.pstdev(original):.2f}')\n\ncleaned = remove_outliers(original)\nprint(f'\\nCleaned: {cleaned}')\nprint(f'  Mean: {statistics.mean(cleaned):.2f}')\nprint(f'  Std Dev: {statistics.pstdev(cleaned):.2f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "100 removed, std dev drops significantly", description: "Outlier detection works" }]),
        hints: ["Calculate mean and std first", "Keep x if mean-2*std <= x <= mean+2*std", "100 is more than 2 std devs from mean"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 13.1.2`);

  console.log("\n✅ Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
