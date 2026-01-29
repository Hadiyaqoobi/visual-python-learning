import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 4: Lessons 13.3.1 and 13.3.2 (Statistical Inference)...\n");

  const section13_3 = await prisma.section.findFirst({
    where: { number: 13.3 },
  });
  if (!section13_3) throw new Error("Section 13.3 not found. Run part 1 first.");

  const lesson13_3_1 = await prisma.lesson.upsert({
    where: { slug: "statistical-significance" },
    update: {},
    create: {
      sectionId: section13_3.id,
      number: 13.31,
      title: "Statistical Significance",
      slug: "statistical-significance",
      objectives: [
        "Understand what statistical significance means",
        "Learn about null hypotheses and p-values",
        "Use simulation to test significance",
        "Avoid common significance mistakes",
      ],
      content: `# Statistical Significance

When we observe a result, is it real or just random chance? Statistical significance helps us decide.

## The Core Question

You flip a coin 10 times and get 8 heads. Is the coin biased, or just luck?

- Could happen with fair coin (unlikely but possible)
- Need to quantify "how unlikely"

## Null Hypothesis

The **null hypothesis** assumes nothing special is happening:
- "The coin is fair"
- "The drug has no effect"
- "There's no difference between groups"

We ask: How likely is our result IF the null hypothesis is true?

## P-Value

**P-value** = Probability of seeing our result (or more extreme) if null is true

- Small p-value (< 0.05): Result unlikely by chance, reject null
- Large p-value (>= 0.05): Result could easily be chance, keep null

**p < 0.05** is the traditional threshold for "statistically significant"

## Simulation Approach

Instead of complex formulas, we can simulate!

1. Assume null hypothesis (fair coin)
2. Simulate many experiments
3. Count how often we see result as extreme as observed
4. That proportion is the p-value

## Cautions

- Significant doesn't mean important
- p = 0.05 still means 5% chance of being wrong
- Correlation doesn't imply causation
- Multiple testing inflates false positives`,
      codeExamples: JSON.stringify([
        {
          id: "coin-bias-test",
          title: "Testing Coin Bias",
          code: "import random\n\ndef simulate_fair_coin(n_flips, n_trials):\n    \"\"\"How often do we get 8+ heads in 10 flips with fair coin?\"\"\"\n    extreme_count = 0\n    for _ in range(n_trials):\n        heads = sum(1 for _ in range(n_flips) if random.random() < 0.5)\n        if heads >= 8 or heads <= 2:  # 8+ heads OR 2- heads (two-tailed)\n            extreme_count += 1\n    return extreme_count / n_trials\n\nobserved_heads = 8\nn_flips = 10\n\np_value = simulate_fair_coin(n_flips, 10000)\nprint(f'Observed: {observed_heads} heads in {n_flips} flips')\nprint(f'P-value: {p_value:.4f}')\nprint(f'Significant (p < 0.05)? {p_value < 0.05}')",
          description: "Using simulation to calculate p-value",
        },
        {
          id: "ab-test",
          title: "A/B Test Simulation",
          code: "import random\n\ndef ab_test_simulation(ctrl_conv, test_conv, n_visitors, n_sims):\n    \"\"\"Test if difference between A and B is significant\"\"\"\n    observed_diff = test_conv - ctrl_conv\n    \n    # Pool the data (assume no difference)\n    pooled_rate = (ctrl_conv + test_conv) / 2\n    \n    more_extreme = 0\n    for _ in range(n_sims):\n        # Simulate both groups with same rate\n        ctrl = sum(1 for _ in range(n_visitors) if random.random() < pooled_rate)\n        test = sum(1 for _ in range(n_visitors) if random.random() < pooled_rate)\n        sim_diff = (test - ctrl) / n_visitors\n        if abs(sim_diff) >= abs(observed_diff / n_visitors):\n            more_extreme += 1\n    \n    return more_extreme / n_sims\n\n# A: 100/1000 converted (10%)\n# B: 120/1000 converted (12%)\np_val = ab_test_simulation(0.10, 0.12, 1000, 5000)\nprint(f'P-value: {p_val:.4f}')",
          description: "Is 12% really better than 10%?",
        },
      ]),
      keyPoints: [
        "Statistical significance asks: is this result due to chance?",
        "Null hypothesis: assume nothing special happening",
        "P-value: probability of result if null is true",
        "p < 0.05 traditionally considered significant",
        "Simulation can calculate p-values without complex math",
        "Significant does not mean practically important",
        "Beware multiple testing and false positives",
      ],
      hardwareDemo: "Watch simulation counter accumulate. See p-value emerge from many trials.",
      estimatedTime: 30,
      difficulty: "ADVANCED",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson13_3_1.number}: ${lesson13_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson13_3_1.id,
        number: 1,
        title: "Is the Coin Biased?",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "You flip a coin 20 times and get 15 heads. Simulate 10000 experiments with a fair coin. What fraction get 15+ or 5- heads? Is your result significant (p < 0.05)?",
        starterCode: "import random\n\nobserved_heads = 15\nn_flips = 20\nn_simulations = 10000\n\nextreme_count = 0\nfor _ in range(n_simulations):\n    heads = sum(1 for _ in range(n_flips) if random.random() < 0.5)\n    # Count if as extreme as observed (15+ or 5-)\n    if heads >= 15 or heads <= 5:\n        extreme_count += 1\n\np_value = extreme_count / n_simulations\nprint(f'Observed: {observed_heads}/{n_flips} heads')\nprint(f'P-value: {p_value:.4f}')\nprint(f'Significant? {p_value < 0.05}')",
        solution: "import random\n\nobserved_heads = 15\nn_flips = 20\nn_simulations = 10000\n\nextreme_count = 0\nfor _ in range(n_simulations):\n    heads = sum(1 for _ in range(n_flips) if random.random() < 0.5)\n    if heads >= 15 or heads <= 5:\n        extreme_count += 1\n\np_value = extreme_count / n_simulations\nprint(f'Observed: {observed_heads}/{n_flips} heads')\nprint(f'P-value: {p_value:.4f}')\nprint(f'Significant? {p_value < 0.05}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "p-value around 0.02, significant", description: "15/20 is unlikely by chance" }]),
        hints: ["Two-tailed test: count both extremes", "15+ heads or 5- heads are equally extreme", "p < 0.05 means statistically significant"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson13_3_1.id,
        number: 2,
        title: "Die Fairness Test",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "You roll a die 60 times and get 15 sixes (expected: 10). Simulate to find p-value. Is the die loaded?",
        starterCode: "import random\n\nobserved_sixes = 15\nn_rolls = 60\nexpected_sixes = 10  # 60 * (1/6)\n\nextreme_count = 0\nfor _ in range(10000):\n    sixes = sum(1 for _ in range(n_rolls) if random.randint(1,6) == 6)\n    # Count if as extreme or more than observed\n    if abs(sixes - expected_sixes) >= abs(observed_sixes - expected_sixes):\n        extreme_count += 1\n\np_value = extreme_count / 10000\nprint(f'Observed: {observed_sixes} sixes (expected {expected_sixes})')\nprint(f'P-value: {p_value:.4f}')\nprint(f'Die appears loaded? {p_value < 0.05}')",
        solution: "import random\n\nobserved_sixes = 15\nn_rolls = 60\nexpected_sixes = 10\n\nextreme_count = 0\nfor _ in range(10000):\n    sixes = sum(1 for _ in range(n_rolls) if random.randint(1,6) == 6)\n    if abs(sixes - expected_sixes) >= abs(observed_sixes - expected_sixes):\n        extreme_count += 1\n\np_value = extreme_count / 10000\nprint(f'Observed: {observed_sixes} sixes (expected {expected_sixes})')\nprint(f'P-value: {p_value:.4f}')\nprint(f'Die appears loaded? {p_value < 0.05}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "p-value around 0.10, not significant", description: "15 sixes could happen by chance" }]),
        hints: ["Expected sixes = 60/6 = 10", "15 vs 10 is a difference of 5", "Compare simulated deviation to observed"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson13_3_1.id,
        number: 3,
        title: "A/B Test Website",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Website A: 50/500 clicked (10%). Website B: 65/500 clicked (13%). Is B significantly better? Simulate under null hypothesis (both have same 11.5% rate).",
        starterCode: "import random\n\na_clicks, a_visitors = 50, 500\nb_clicks, b_visitors = 65, 500\n\nobserved_diff = (b_clicks/b_visitors) - (a_clicks/a_visitors)\nprint(f'Observed difference: {observed_diff:.1%}')\n\n# Null hypothesis: both have same rate\npooled_rate = (a_clicks + b_clicks) / (a_visitors + b_visitors)\n\nextreme_count = 0\nfor _ in range(10000):\n    sim_a = sum(1 for _ in range(500) if random.random() < pooled_rate)\n    sim_b = sum(1 for _ in range(500) if random.random() < pooled_rate)\n    sim_diff = (sim_b - sim_a) / 500\n    if abs(sim_diff) >= abs(observed_diff):\n        extreme_count += 1\n\np_value = extreme_count / 10000\nprint(f'P-value: {p_value:.4f}')\nprint(f'B significantly better? {p_value < 0.05}')",
        solution: "import random\n\na_clicks, a_visitors = 50, 500\nb_clicks, b_visitors = 65, 500\n\nobserved_diff = (b_clicks/b_visitors) - (a_clicks/a_visitors)\nprint(f'Observed difference: {observed_diff:.1%}')\n\npooled_rate = (a_clicks + b_clicks) / (a_visitors + b_visitors)\n\nextreme_count = 0\nfor _ in range(10000):\n    sim_a = sum(1 for _ in range(500) if random.random() < pooled_rate)\n    sim_b = sum(1 for _ in range(500) if random.random() < pooled_rate)\n    sim_diff = (sim_b - sim_a) / 500\n    if abs(sim_diff) >= abs(observed_diff):\n        extreme_count += 1\n\np_value = extreme_count / 10000\nprint(f'P-value: {p_value:.4f}')\nprint(f'B significantly better? {p_value < 0.05}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "p-value around 0.12, not significant", description: "3% difference could be chance" }]),
        hints: ["Pool rate = (50+65)/(500+500) = 11.5%", "Simulate both groups with same rate", "Count how often random diff >= observed"],
        xpReward: 25,
        order: 3,
      },
      {
        lessonId: lesson13_3_1.id,
        number: 4,
        title: "Multiple Testing Problem",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Test 20 fair coins for bias (p<0.05 threshold). How many false positives do you expect? Run simulation to verify.",
        starterCode: "import random\n\ndef test_coin(n_flips=100):\n    \"\"\"Flip coin n times, return p-value for bias test\"\"\"\n    heads = sum(1 for _ in range(n_flips) if random.random() < 0.5)\n    # Simulate p-value\n    extreme = 0\n    for _ in range(1000):\n        sim_heads = sum(1 for _ in range(n_flips) if random.random() < 0.5)\n        if abs(sim_heads - 50) >= abs(heads - 50):\n            extreme += 1\n    return extreme / 1000\n\n# Test 20 fair coins\nfalse_positives = 0\nfor i in range(20):\n    p_val = test_coin()\n    if p_val < 0.05:\n        false_positives += 1\n        print(f'Coin {i+1}: p={p_val:.3f} - FALSE POSITIVE!')\n\nprint(f'\\nFalse positives: {false_positives}/20')\nprint(f'Expected: ~1 (5% of 20)')",
        solution: "import random\n\ndef test_coin(n_flips=100):\n    heads = sum(1 for _ in range(n_flips) if random.random() < 0.5)\n    extreme = 0\n    for _ in range(1000):\n        sim_heads = sum(1 for _ in range(n_flips) if random.random() < 0.5)\n        if abs(sim_heads - 50) >= abs(heads - 50):\n            extreme += 1\n    return extreme / 1000\n\nfalse_positives = 0\nfor i in range(20):\n    p_val = test_coin()\n    if p_val < 0.05:\n        false_positives += 1\n        print(f'Coin {i+1}: p={p_val:.3f} - FALSE POSITIVE!')\n\nprint(f'\\nFalse positives: {false_positives}/20')\nprint(f'Expected: ~1 (5% of 20)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "~1 false positive on average", description: "5% false positive rate" }]),
        hints: ["All coins are fair, so any significant = false positive", "With p=0.05 threshold, expect 5% false positives", "20 tests * 5% = 1 expected false positive"],
        xpReward: 25,
        order: 4,
      },
    ],
  });
  console.log(`      ✏️  4 exercises created for 13.3.1`);

  const lesson13_3_2 = await prisma.lesson.upsert({
    where: { slug: "confidence-intervals" },
    update: {},
    create: {
      sectionId: section13_3.id,
      number: 13.32,
      title: "Confidence Intervals and Standard Error",
      slug: "confidence-intervals",
      objectives: [
        "Understand standard error of the mean",
        "Calculate and interpret confidence intervals",
        "Use bootstrap sampling for confidence intervals",
        "Make informed decisions with uncertainty quantified",
      ],
      content: `# Confidence Intervals and Standard Error

Point estimates (like sample mean) are never exact. We need to quantify uncertainty!

## Standard Error

**Standard Error (SE)** measures how much the sample mean varies from sample to sample.

SE = std_dev / sqrt(n)

Key insight: **Larger samples = smaller standard error = more precise estimates**

## Confidence Intervals

A **95% confidence interval** is a range where we're 95% confident the true value lies.

For normal data: CI = mean +/- 1.96 * SE

Interpretation: If we repeated the experiment many times, 95% of intervals would contain the true value.

## Bootstrap Method

When formulas don't apply, use **bootstrap**:

1. Resample your data with replacement
2. Calculate statistic on each resample
3. Find middle 95% of bootstrap values

This works for any statistic, not just means!

## Using Confidence Intervals

- Narrow CI: Precise estimate (good!)
- Wide CI: Uncertain estimate (need more data)
- If CI doesn't include 0: Effect is significant
- CIs are more informative than just p-values`,
      codeExamples: JSON.stringify([
        {
          id: "standard-error",
          title: "Standard Error Demonstration",
          code: "import random\nimport statistics\n\n# True population: mean=100, std=15\npop_mean, pop_std = 100, 15\n\n# Take many samples, see how sample means vary\nsample_means = []\nfor _ in range(1000):\n    sample = [random.gauss(pop_mean, pop_std) for _ in range(25)]\n    sample_means.append(statistics.mean(sample))\n\nprint(f'True mean: {pop_mean}')\nprint(f'Mean of sample means: {statistics.mean(sample_means):.2f}')\nprint(f'Std of sample means (SE): {statistics.stdev(sample_means):.2f}')\nprint(f'Theoretical SE: {pop_std / (25**0.5):.2f}')",
          description: "SE measures variation in sample means",
        },
        {
          id: "confidence-interval",
          title: "95% Confidence Interval",
          code: "import random\nimport statistics\nimport math\n\n# Sample data\ndata = [random.gauss(50, 10) for _ in range(30)]\n\nmean = statistics.mean(data)\nstd = statistics.stdev(data)\nn = len(data)\nse = std / math.sqrt(n)\n\n# 95% CI: mean +/- 1.96 * SE\nmargin = 1.96 * se\nci_low = mean - margin\nci_high = mean + margin\n\nprint(f'Sample mean: {mean:.2f}')\nprint(f'Standard error: {se:.2f}')\nprint(f'95% CI: ({ci_low:.2f}, {ci_high:.2f})')",
          description: "Calculating confidence interval",
        },
        {
          id: "bootstrap",
          title: "Bootstrap Confidence Interval",
          code: "import random\nimport statistics\n\ndata = [23, 25, 28, 30, 32, 35, 40, 45]\n\ndef bootstrap_ci(data, n_bootstrap=5000):\n    boot_means = []\n    for _ in range(n_bootstrap):\n        # Resample with replacement\n        resample = [random.choice(data) for _ in range(len(data))]\n        boot_means.append(statistics.mean(resample))\n    \n    boot_means.sort()\n    # Middle 95%\n    low_idx = int(0.025 * n_bootstrap)\n    high_idx = int(0.975 * n_bootstrap)\n    return boot_means[low_idx], boot_means[high_idx]\n\nci_low, ci_high = bootstrap_ci(data)\nprint(f'Sample mean: {statistics.mean(data):.2f}')\nprint(f'Bootstrap 95% CI: ({ci_low:.2f}, {ci_high:.2f})')",
          description: "Bootstrap works for any statistic",
        },
      ]),
      keyPoints: [
        "Standard error = std / sqrt(n), measures precision",
        "Larger samples give smaller SE (more precise)",
        "95% CI: range where true value likely lies",
        "CI = mean +/- 1.96 * SE (for normal data)",
        "Bootstrap: resample with replacement for any statistic",
        "Narrow CI = precise; Wide CI = uncertain",
      ],
      hardwareDemo: "Watch bootstrap resamples generated. See CI bounds computed from sorted values.",
      estimatedTime: 30,
      difficulty: "ADVANCED",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson13_3_2.number}: ${lesson13_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson13_3_2.id,
        number: 1,
        title: "Calculate Standard Error",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given sample data with std=20, calculate SE for sample sizes 25, 100, and 400. What happens to SE as n increases?",
        starterCode: "import math\n\nstd = 20\n\nfor n in [25, 100, 400]:\n    se = std / math.sqrt(n)\n    print(f'n={n:3d}: SE = {se:.2f}')\n\nprint('\\nPattern: ')",
        solution: "import math\n\nstd = 20\n\nfor n in [25, 100, 400]:\n    se = std / math.sqrt(n)\n    print(f'n={n:3d}: SE = {se:.2f}')\n\nprint('\\nPattern: SE decreases as sqrt(n) increases')\nprint('4x more data = 2x smaller SE')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "SE: 4.0, 2.0, 1.0", description: "SE decreases with sqrt(n)" }]),
        hints: ["SE = std / sqrt(n)", "sqrt(25)=5, sqrt(100)=10, sqrt(400)=20", "4x more samples = half the SE"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson13_3_2.id,
        number: 2,
        title: "Compute 95% CI",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate 95% confidence interval for data: [45, 48, 52, 55, 58, 62, 65, 68]. Use formula: mean +/- 1.96 * SE",
        starterCode: "import statistics\nimport math\n\ndata = [45, 48, 52, 55, 58, 62, 65, 68]\n\nmean = statistics.mean(data)\nstd = statistics.stdev(data)\nn = len(data)\nse = std / math.sqrt(n)\n\nmargin = 1.96 * se\nci_low = mean - margin\nci_high = mean + margin\n\nprint(f'Mean: {mean:.2f}')\nprint(f'Std Dev: {std:.2f}')\nprint(f'SE: {se:.2f}')\nprint(f'95% CI: ({ci_low:.2f}, {ci_high:.2f})')",
        solution: "import statistics\nimport math\n\ndata = [45, 48, 52, 55, 58, 62, 65, 68]\n\nmean = statistics.mean(data)\nstd = statistics.stdev(data)\nn = len(data)\nse = std / math.sqrt(n)\n\nmargin = 1.96 * se\nci_low = mean - margin\nci_high = mean + margin\n\nprint(f'Mean: {mean:.2f}')\nprint(f'Std Dev: {std:.2f}')\nprint(f'SE: {se:.2f}')\nprint(f'95% CI: ({ci_low:.2f}, {ci_high:.2f})')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "CI around (49, 60)", description: "95% confidence interval" }]),
        hints: ["First calculate mean, std, n", "SE = std / sqrt(n)", "CI = mean +/- 1.96 * SE"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson13_3_2.id,
        number: 3,
        title: "Bootstrap CI for Median",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Use bootstrap (5000 resamples) to find 95% CI for the median of [12, 15, 18, 22, 25, 28, 35, 42, 55, 70].",
        starterCode: "import random\nimport statistics\n\ndata = [12, 15, 18, 22, 25, 28, 35, 42, 55, 70]\n\nboot_medians = []\nfor _ in range(5000):\n    resample = [random.choice(data) for _ in range(len(data))]\n    boot_medians.append(statistics.median(resample))\n\nboot_medians.sort()\nci_low = boot_medians[int(0.025 * 5000)]\nci_high = boot_medians[int(0.975 * 5000)]\n\nprint(f'Sample median: {statistics.median(data)}')\nprint(f'Bootstrap 95% CI: ({ci_low}, {ci_high})')",
        solution: "import random\nimport statistics\n\ndata = [12, 15, 18, 22, 25, 28, 35, 42, 55, 70]\n\nboot_medians = []\nfor _ in range(5000):\n    resample = [random.choice(data) for _ in range(len(data))]\n    boot_medians.append(statistics.median(resample))\n\nboot_medians.sort()\nci_low = boot_medians[int(0.025 * 5000)]\nci_high = boot_medians[int(0.975 * 5000)]\n\nprint(f'Sample median: {statistics.median(data)}')\nprint(f'Bootstrap 95% CI: ({ci_low}, {ci_high})')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "CI around (18, 42)", description: "Bootstrap CI for median" }]),
        hints: ["Resample WITH replacement", "Calculate median of each resample", "Sort and take middle 95%"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson13_3_2.id,
        number: 4,
        title: "CI Width and Sample Size",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Generate samples of size 10, 50, 100, 500 from normal(100, 15). Calculate 95% CI for each. How does CI width change?",
        starterCode: "import random\nimport statistics\nimport math\n\npop_mean, pop_std = 100, 15\n\nprint('n     Mean    CI Width   CI')\nprint('-' * 50)\n\nfor n in [10, 50, 100, 500]:\n    sample = [random.gauss(pop_mean, pop_std) for _ in range(n)]\n    mean = statistics.mean(sample)\n    std = statistics.stdev(sample)\n    se = std / math.sqrt(n)\n    margin = 1.96 * se\n    ci_low = mean - margin\n    ci_high = mean + margin\n    width = ci_high - ci_low\n    print(f'{n:3d}   {mean:.1f}   {width:.2f}       ({ci_low:.1f}, {ci_high:.1f})')",
        solution: "import random\nimport statistics\nimport math\n\npop_mean, pop_std = 100, 15\n\nprint('n     Mean    CI Width   CI')\nprint('-' * 50)\n\nfor n in [10, 50, 100, 500]:\n    sample = [random.gauss(pop_mean, pop_std) for _ in range(n)]\n    mean = statistics.mean(sample)\n    std = statistics.stdev(sample)\n    se = std / math.sqrt(n)\n    margin = 1.96 * se\n    ci_low = mean - margin\n    ci_high = mean + margin\n    width = ci_high - ci_low\n    print(f'{n:3d}   {mean:.1f}   {width:.2f}       ({ci_low:.1f}, {ci_high:.1f})')\n\nprint('\\nMore data = narrower CI = more precision!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "CI width decreases with n", description: "Precision improves with more data" }]),
        hints: ["CI width = 2 * 1.96 * SE", "SE decreases with sqrt(n)", "4x more data = half the CI width"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson13_3_2.id,
        number: 5,
        title: "CI for Difference in Means",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Group A scores: [78, 82, 85, 88, 90]. Group B scores: [85, 88, 92, 95, 98]. Use bootstrap to find 95% CI for (mean_B - mean_A). Does CI include 0?",
        starterCode: "import random\nimport statistics\n\ngroup_a = [78, 82, 85, 88, 90]\ngroup_b = [85, 88, 92, 95, 98]\n\nobserved_diff = statistics.mean(group_b) - statistics.mean(group_a)\nprint(f'Observed difference: {observed_diff:.2f}')\n\nboot_diffs = []\nfor _ in range(5000):\n    resample_a = [random.choice(group_a) for _ in range(len(group_a))]\n    resample_b = [random.choice(group_b) for _ in range(len(group_b))]\n    diff = statistics.mean(resample_b) - statistics.mean(resample_a)\n    boot_diffs.append(diff)\n\nboot_diffs.sort()\nci_low = boot_diffs[int(0.025 * 5000)]\nci_high = boot_diffs[int(0.975 * 5000)]\n\nprint(f'95% CI for difference: ({ci_low:.2f}, {ci_high:.2f})')\nprint(f'Includes 0? {ci_low <= 0 <= ci_high}')",
        solution: "import random\nimport statistics\n\ngroup_a = [78, 82, 85, 88, 90]\ngroup_b = [85, 88, 92, 95, 98]\n\nobserved_diff = statistics.mean(group_b) - statistics.mean(group_a)\nprint(f'Observed difference: {observed_diff:.2f}')\n\nboot_diffs = []\nfor _ in range(5000):\n    resample_a = [random.choice(group_a) for _ in range(len(group_a))]\n    resample_b = [random.choice(group_b) for _ in range(len(group_b))]\n    diff = statistics.mean(resample_b) - statistics.mean(resample_a)\n    boot_diffs.append(diff)\n\nboot_diffs.sort()\nci_low = boot_diffs[int(0.025 * 5000)]\nci_high = boot_diffs[int(0.975 * 5000)]\n\nprint(f'95% CI for difference: ({ci_low:.2f}, {ci_high:.2f})')\nprint(f'Includes 0? {ci_low <= 0 <= ci_high}')\nprint('If CI does not include 0, difference is significant!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "CI does not include 0", description: "Significant difference" }]),
        hints: ["Bootstrap each group separately", "Calculate difference of means each time", "If 0 not in CI, difference is significant"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 13.3.2`);

  console.log("\n✅ Part 4 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
