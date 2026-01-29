import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 4: Lesson 14.3.3 (Bootstrap Method)...\n");

  const section14_3 = await prisma.section.findFirst({
    where: { number: 14.3 },
  });
  if (!section14_3) throw new Error("Section 14.3 not found. Run part 1 first.");

  const lesson14_3_3 = await prisma.lesson.upsert({
    where: { slug: "bootstrap-method" },
    update: {},
    create: {
      sectionId: section14_3.id,
      number: 14.33,
      title: "The Bootstrap Method",
      slug: "bootstrap-method",
      objectives: [
        "Understand bootstrap resampling",
        "Implement bootstrap confidence intervals",
        "Apply bootstrap to any statistic",
        "Compare bootstrap to formula-based methods",
      ],
      content: `# The Bootstrap Method

## The Problem

Formula-based CIs work for means, but what about:
- Median?
- Correlation?
- Ratio of means?
- Custom statistics?

## The Bootstrap Solution

**Idea**: Treat your sample as a "mini-population" and resample from it!

## Algorithm

1. Take your original sample (size n)
2. Resample n values WITH REPLACEMENT (bootstrap sample)
3. Calculate statistic on bootstrap sample
4. Repeat steps 2-3 many times (e.g., 5000)
5. Use middle 95% of bootstrap statistics as CI

## Why It Works

- Resampling mimics the sampling process
- Bootstrap distribution approximates sampling distribution
- Works for ANY statistic!

## Key Points

- Must sample WITH REPLACEMENT
- Use many bootstrap samples (1000-10000)
- Find 2.5th and 97.5th percentiles for 95% CI
- Very powerful, requires no formulas!`,
      codeExamples: JSON.stringify([
        {
          id: "bootstrap-mean",
          title: "Bootstrap CI for Mean",
          code: "import random\nimport statistics\n\nsample = [23, 25, 28, 30, 32, 35, 40, 45]\n\nboot_means = []\nfor _ in range(5000):\n    # Resample WITH replacement\n    resample = [random.choice(sample) for _ in range(len(sample))]\n    boot_means.append(statistics.mean(resample))\n\nboot_means.sort()\nci_low = boot_means[int(0.025 * 5000)]\nci_high = boot_means[int(0.975 * 5000)]\n\nprint(f'Sample mean: {statistics.mean(sample):.2f}')\nprint(f'Bootstrap 95% CI: ({ci_low:.2f}, {ci_high:.2f})')",
          description: "Bootstrap CI for mean",
        },
        {
          id: "bootstrap-median",
          title: "Bootstrap CI for Median",
          code: "import random\nimport statistics\n\nsample = [12, 15, 18, 22, 25, 28, 35, 42, 55, 70]\n\nboot_medians = []\nfor _ in range(5000):\n    resample = [random.choice(sample) for _ in range(len(sample))]\n    boot_medians.append(statistics.median(resample))\n\nboot_medians.sort()\nci_low = boot_medians[int(0.025 * 5000)]\nci_high = boot_medians[int(0.975 * 5000)]\n\nprint(f'Sample median: {statistics.median(sample)}')\nprint(f'Bootstrap 95% CI: ({ci_low}, {ci_high})')\nprint('\\nNo formula needed for median CI!')",
          description: "Bootstrap works for any statistic",
        },
        {
          id: "bootstrap-function",
          title: "Reusable Bootstrap Function",
          code: "import random\n\ndef bootstrap_ci(data, stat_func, n_boot=5000, ci=0.95):\n    boot_stats = []\n    n = len(data)\n    for _ in range(n_boot):\n        resample = [random.choice(data) for _ in range(n)]\n        boot_stats.append(stat_func(resample))\n    \n    boot_stats.sort()\n    alpha = (1 - ci) / 2\n    low_idx = int(alpha * n_boot)\n    high_idx = int((1 - alpha) * n_boot)\n    return boot_stats[low_idx], boot_stats[high_idx]\n\nimport statistics\ndata = [10, 15, 20, 25, 30, 35, 40]\n\nprint('Mean CI:', bootstrap_ci(data, statistics.mean))\nprint('Median CI:', bootstrap_ci(data, statistics.median))\nprint('Max CI:', bootstrap_ci(data, max))",
          description: "Generic bootstrap function",
        },
      ]),
      keyPoints: [
        "Bootstrap: resample WITH replacement from your data",
        "Calculate statistic on each resample",
        "Middle 95% of bootstrap values = 95% CI",
        "Works for ANY statistic (mean, median, correlation, etc.)",
        "Use 1000-10000 bootstrap samples",
        "No formulas needed - very flexible!",
      ],
      hardwareDemo: "Watch bootstrap resamples generated. See distribution of statistics form.",
      estimatedTime: 30,
      difficulty: "ADVANCED",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson14_3_3.number}: ${lesson14_3_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson14_3_3.id,
        number: 1,
        title: "Basic Bootstrap CI",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate bootstrap 95% CI for the mean of [15, 18, 22, 25, 28, 32, 35]. Use 3000 bootstrap samples.",
        starterCode: "import random\nimport statistics\n\nsample = [15, 18, 22, 25, 28, 32, 35]\n\nboot_means = []\nfor _ in range(3000):\n    resample = [random.choice(sample) for _ in range(len(sample))]\n    boot_means.append(statistics.mean(resample))\n\nboot_means.sort()\nci_low = boot_means[int(0.025 * 3000)]\nci_high = boot_means[int(0.975 * 3000)]\n\nprint(f'Sample mean: {statistics.mean(sample):.2f}')\nprint(f'Bootstrap 95% CI: ({ci_low:.2f}, {ci_high:.2f})')",
        solution: "import random\nimport statistics\n\nsample = [15, 18, 22, 25, 28, 32, 35]\n\nboot_means = []\nfor _ in range(3000):\n    resample = [random.choice(sample) for _ in range(len(sample))]\n    boot_means.append(statistics.mean(resample))\n\nboot_means.sort()\nci_low = boot_means[int(0.025 * 3000)]\nci_high = boot_means[int(0.975 * 3000)]\n\nprint(f'Sample mean: {statistics.mean(sample):.2f}')\nprint(f'Bootstrap 95% CI: ({ci_low:.2f}, {ci_high:.2f})')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "CI around (19, 31)", description: "Bootstrap CI" }]),
        hints: ["Resample WITH replacement using random.choice()", "Sort bootstrap means", "2.5% and 97.5% percentiles"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson14_3_3.id,
        number: 2,
        title: "Bootstrap CI for Median",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate bootstrap 95% CI for the MEDIAN of [5, 8, 12, 15, 45, 52, 78, 95]. Note: no formula exists for median CI!",
        starterCode: "import random\nimport statistics\n\nsample = [5, 8, 12, 15, 45, 52, 78, 95]\n\nboot_medians = []\nfor _ in range(5000):\n    resample = [random.choice(sample) for _ in range(len(sample))]\n    boot_medians.append(statistics.median(resample))\n\nboot_medians.sort()\nci_low = boot_medians[int(0.025 * 5000)]\nci_high = boot_medians[int(0.975 * 5000)]\n\nprint(f'Sample median: {statistics.median(sample)}')\nprint(f'Bootstrap 95% CI: ({ci_low}, {ci_high})')",
        solution: "import random\nimport statistics\n\nsample = [5, 8, 12, 15, 45, 52, 78, 95]\n\nboot_medians = []\nfor _ in range(5000):\n    resample = [random.choice(sample) for _ in range(len(sample))]\n    boot_medians.append(statistics.median(resample))\n\nboot_medians.sort()\nci_low = boot_medians[int(0.025 * 5000)]\nci_high = boot_medians[int(0.975 * 5000)]\n\nprint(f'Sample median: {statistics.median(sample)}')\nprint(f'Bootstrap 95% CI: ({ci_low}, {ci_high})')\nprint('\\nBootstrap works for median - no formula needed!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "CI for median", description: "Median CI via bootstrap" }]),
        hints: ["Use statistics.median() instead of mean", "Same bootstrap process", "This is where bootstrap shines!"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson14_3_3.id,
        number: 3,
        title: "Bootstrap CI for Standard Deviation",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Calculate bootstrap 95% CI for the STANDARD DEVIATION of [20, 25, 30, 35, 40, 45, 50, 55, 60].",
        starterCode: "import random\nimport statistics\n\nsample = [20, 25, 30, 35, 40, 45, 50, 55, 60]\n\nboot_stds = []\nfor _ in range(5000):\n    resample = [random.choice(sample) for _ in range(len(sample))]\n    boot_stds.append(statistics.stdev(resample))\n\nboot_stds.sort()\nci_low = boot_stds[int(0.025 * 5000)]\nci_high = boot_stds[int(0.975 * 5000)]\n\nprint(f'Sample std dev: {statistics.stdev(sample):.2f}')\nprint(f'Bootstrap 95% CI: ({ci_low:.2f}, {ci_high:.2f})')",
        solution: "import random\nimport statistics\n\nsample = [20, 25, 30, 35, 40, 45, 50, 55, 60]\n\nboot_stds = []\nfor _ in range(5000):\n    resample = [random.choice(sample) for _ in range(len(sample))]\n    boot_stds.append(statistics.stdev(resample))\n\nboot_stds.sort()\nci_low = boot_stds[int(0.025 * 5000)]\nci_high = boot_stds[int(0.975 * 5000)]\n\nprint(f'Sample std dev: {statistics.stdev(sample):.2f}')\nprint(f'Bootstrap 95% CI: ({ci_low:.2f}, {ci_high:.2f})')\nprint('\\nBootstrap works for std dev too!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "CI for std dev", description: "Std dev CI via bootstrap" }]),
        hints: ["Use statistics.stdev()", "Same bootstrap procedure", "Works for any statistic"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson14_3_3.id,
        number: 4,
        title: "Compare Bootstrap to Formula CI",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "For sample [45, 50, 55, 60, 65, 70, 75], calculate 95% CI for mean using both: (1) formula method, (2) bootstrap. Compare results.",
        starterCode: "import random\nimport statistics\nimport math\n\nsample = [45, 50, 55, 60, 65, 70, 75]\nmean = statistics.mean(sample)\nstd = statistics.stdev(sample)\nn = len(sample)\n\n# Formula method\nse = std / math.sqrt(n)\nformula_low = mean - 1.96 * se\nformula_high = mean + 1.96 * se\n\n# Bootstrap method\nboot_means = []\nfor _ in range(5000):\n    resample = [random.choice(sample) for _ in range(n)]\n    boot_means.append(statistics.mean(resample))\n\nboot_means.sort()\nboot_low = boot_means[int(0.025 * 5000)]\nboot_high = boot_means[int(0.975 * 5000)]\n\nprint(f'Sample mean: {mean:.2f}')\nprint(f'Formula CI:   ({formula_low:.2f}, {formula_high:.2f})')\nprint(f'Bootstrap CI: ({boot_low:.2f}, {boot_high:.2f})')",
        solution: "import random\nimport statistics\nimport math\n\nsample = [45, 50, 55, 60, 65, 70, 75]\nmean = statistics.mean(sample)\nstd = statistics.stdev(sample)\nn = len(sample)\n\nse = std / math.sqrt(n)\nformula_low = mean - 1.96 * se\nformula_high = mean + 1.96 * se\n\nboot_means = []\nfor _ in range(5000):\n    resample = [random.choice(sample) for _ in range(n)]\n    boot_means.append(statistics.mean(resample))\n\nboot_means.sort()\nboot_low = boot_means[int(0.025 * 5000)]\nboot_high = boot_means[int(0.975 * 5000)]\n\nprint(f'Sample mean: {mean:.2f}')\nprint(f'Formula CI:   ({formula_low:.2f}, {formula_high:.2f})')\nprint(f'Bootstrap CI: ({boot_low:.2f}, {boot_high:.2f})')\nprint('\\nBoth methods give similar results for means!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Both CIs similar", description: "Methods agree for mean" }]),
        hints: ["Formula: mean ± 1.96 * SE", "Bootstrap: percentiles of resampled means", "Should be close for means"],
        xpReward: 25,
        order: 4,
      },
      {
        lessonId: lesson14_3_3.id,
        number: 5,
        title: "Bootstrap CI for Difference in Means",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Group A: [70, 75, 80, 85]. Group B: [85, 90, 95, 100]. Calculate bootstrap 95% CI for (mean_B - mean_A). Does CI include 0?",
        starterCode: "import random\nimport statistics\n\ngroup_a = [70, 75, 80, 85]\ngroup_b = [85, 90, 95, 100]\n\nobserved_diff = statistics.mean(group_b) - statistics.mean(group_a)\n\nboot_diffs = []\nfor _ in range(5000):\n    resample_a = [random.choice(group_a) for _ in range(len(group_a))]\n    resample_b = [random.choice(group_b) for _ in range(len(group_b))]\n    diff = statistics.mean(resample_b) - statistics.mean(resample_a)\n    boot_diffs.append(diff)\n\nboot_diffs.sort()\nci_low = boot_diffs[int(0.025 * 5000)]\nci_high = boot_diffs[int(0.975 * 5000)]\n\nprint(f'Observed difference: {observed_diff:.2f}')\nprint(f'Bootstrap 95% CI: ({ci_low:.2f}, {ci_high:.2f})')\nprint(f'CI includes 0? {ci_low <= 0 <= ci_high}')",
        solution: "import random\nimport statistics\n\ngroup_a = [70, 75, 80, 85]\ngroup_b = [85, 90, 95, 100]\n\nobserved_diff = statistics.mean(group_b) - statistics.mean(group_a)\n\nboot_diffs = []\nfor _ in range(5000):\n    resample_a = [random.choice(group_a) for _ in range(len(group_a))]\n    resample_b = [random.choice(group_b) for _ in range(len(group_b))]\n    diff = statistics.mean(resample_b) - statistics.mean(resample_a)\n    boot_diffs.append(diff)\n\nboot_diffs.sort()\nci_low = boot_diffs[int(0.025 * 5000)]\nci_high = boot_diffs[int(0.975 * 5000)]\n\nprint(f'Observed difference: {observed_diff:.2f}')\nprint(f'Bootstrap 95% CI: ({ci_low:.2f}, {ci_high:.2f})')\nprint(f'CI includes 0? {ci_low <= 0 <= ci_high}')\nprint('\\nIf CI excludes 0, difference is statistically significant!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "CI does not include 0", description: "Significant difference" }]),
        hints: ["Bootstrap each group separately", "Calculate difference for each pair", "If 0 not in CI, groups are different"],
        xpReward: 30,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 14.3.3`);

  console.log("\n✅ Part 4 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
