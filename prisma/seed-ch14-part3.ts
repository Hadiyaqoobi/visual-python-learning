import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 3: Lessons 14.3.1 and 14.3.2 (Confidence Intervals)...\n");

  const section14_3 = await prisma.section.findFirst({
    where: { number: 14.3 },
  });
  if (!section14_3) throw new Error("Section 14.3 not found. Run part 1 first.");

  const lesson14_3_1 = await prisma.lesson.upsert({
    where: { slug: "confidence-intervals-intro" },
    update: {},
    create: {
      sectionId: section14_3.id,
      number: 14.31,
      title: "Confidence Intervals - Construction and Interpretation",
      slug: "confidence-intervals-intro",
      objectives: [
        "Understand what confidence intervals represent",
        "Calculate confidence intervals for means",
        "Interpret confidence levels correctly",
        "Understand the tradeoff between precision and confidence",
      ],
      content: `# Confidence Intervals

## Point Estimate vs Interval

**Point estimate**: Single value (e.g., "mean is 50")
**Confidence interval**: Range of values (e.g., "mean is between 48 and 52")

Confidence intervals quantify uncertainty!

## Formula

**CI = x̄ ± z * SE**

Where:
- x̄ = sample mean
- z = z-score for confidence level (1.96 for 95%)
- SE = standard error = s/√n

## Common Z-Scores

| Confidence | Z-Score |
|------------|---------|
| 90% | 1.645 |
| 95% | 1.96 |
| 99% | 2.576 |

## Correct Interpretation

**95% confidence** means: If we repeated sampling 100 times and built 100 intervals, about 95 would contain the true mean.

**NOT**: "95% chance the true mean is in this interval"

## The Tradeoff

- Higher confidence → wider interval (less precise)
- Lower confidence → narrower interval (less certain)
- Larger sample → narrower interval (win-win!)`,
      codeExamples: JSON.stringify([
        {
          id: "basic-ci",
          title: "Calculate 95% Confidence Interval",
          code: "import statistics\nimport math\n\nsample = [45, 50, 48, 52, 49, 51, 47, 53, 50, 48]\n\nmean = statistics.mean(sample)\nstd = statistics.stdev(sample)\nn = len(sample)\nse = std / math.sqrt(n)\n\nmargin = 1.96 * se\nci_low = mean - margin\nci_high = mean + margin\n\nprint(f'Sample mean: {mean:.2f}')\nprint(f'Standard error: {se:.2f}')\nprint(f'95% CI: ({ci_low:.2f}, {ci_high:.2f})')",
          description: "Basic CI calculation",
        },
        {
          id: "verify-ci",
          title: "Verify 95% CI Captures True Mean 95% of Time",
          code: "import random\nimport statistics\nimport math\n\npopulation = list(range(1, 101))\ntrue_mean = 50.5\npop_std = statistics.pstdev(population)\n\ncaptures = 0\nfor _ in range(100):\n    sample = random.sample(population, 30)\n    mean = statistics.mean(sample)\n    se = pop_std / math.sqrt(30)\n    ci_low = mean - 1.96 * se\n    ci_high = mean + 1.96 * se\n    if ci_low <= true_mean <= ci_high:\n        captures += 1\n\nprint(f'CIs that captured true mean: {captures}/100')\nprint(f'Expected: ~95')",
          description: "95% CI works as advertised",
        },
        {
          id: "compare-levels",
          title: "Compare Confidence Levels",
          code: "import statistics\nimport math\n\nsample = [100, 105, 102, 98, 103, 107, 101, 99, 104, 102]\nmean = statistics.mean(sample)\nse = statistics.stdev(sample) / math.sqrt(len(sample))\n\nz_scores = {'90%': 1.645, '95%': 1.96, '99%': 2.576}\n\nprint(f'Sample mean: {mean:.2f}')\nprint(f'Standard error: {se:.2f}\\n')\n\nfor level, z in z_scores.items():\n    margin = z * se\n    print(f'{level} CI: ({mean-margin:.2f}, {mean+margin:.2f}) width={2*margin:.2f}')",
          description: "Higher confidence = wider interval",
        },
      ]),
      keyPoints: [
        "CI = sample mean ± z * standard error",
        "95% CI uses z = 1.96",
        "Higher confidence = wider interval",
        "Larger sample = narrower interval",
        "95% of intervals capture true mean (not 95% chance)",
        "CI quantifies uncertainty in our estimate",
      ],
      hardwareDemo: "Watch margin of error calculated. See CI bounds computed.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson14_3_1.number}: ${lesson14_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson14_3_1.id,
        number: 1,
        title: "Calculate 95% CI",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given sample [72, 75, 78, 80, 82, 85, 88], calculate the 95% confidence interval. Use z = 1.96.",
        starterCode: "import statistics\nimport math\n\nsample = [72, 75, 78, 80, 82, 85, 88]\n\nmean = statistics.mean(sample)\nstd = statistics.stdev(sample)\nn = len(sample)\nse = std / math.sqrt(n)\n\nmargin = 1.96 * se\nci_low = mean - margin\nci_high = mean + margin\n\nprint(f'Mean: {mean:.2f}')\nprint(f'SE: {se:.2f}')\nprint(f'95% CI: ({ci_low:.2f}, {ci_high:.2f})')",
        solution: "import statistics\nimport math\n\nsample = [72, 75, 78, 80, 82, 85, 88]\n\nmean = statistics.mean(sample)\nstd = statistics.stdev(sample)\nn = len(sample)\nse = std / math.sqrt(n)\n\nmargin = 1.96 * se\nci_low = mean - margin\nci_high = mean + margin\n\nprint(f'Mean: {mean:.2f}')\nprint(f'SE: {se:.2f}')\nprint(f'95% CI: ({ci_low:.2f}, {ci_high:.2f})')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "CI around (74, 86)", description: "Correct 95% CI" }]),
        hints: ["Mean of sample is 80", "SE = std / sqrt(7)", "Margin = 1.96 * SE"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson14_3_1.id,
        number: 2,
        title: "Compare 90%, 95%, 99% CIs",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "For sample [48, 50, 52, 49, 51, 50, 53, 47], calculate 90%, 95%, and 99% confidence intervals. Compare widths.",
        starterCode: "import statistics\nimport math\n\nsample = [48, 50, 52, 49, 51, 50, 53, 47]\nmean = statistics.mean(sample)\nse = statistics.stdev(sample) / math.sqrt(len(sample))\n\nz_values = {'90%': 1.645, '95%': 1.96, '99%': 2.576}\n\nfor level, z in z_values.items():\n    margin = z * se\n    low = mean - margin\n    high = mean + margin\n    width = high - low\n    print(f'{level}: ({low:.2f}, {high:.2f}) width = {width:.2f}')",
        solution: "import statistics\nimport math\n\nsample = [48, 50, 52, 49, 51, 50, 53, 47]\nmean = statistics.mean(sample)\nse = statistics.stdev(sample) / math.sqrt(len(sample))\n\nz_values = {'90%': 1.645, '95%': 1.96, '99%': 2.576}\n\nfor level, z in z_values.items():\n    margin = z * se\n    low = mean - margin\n    high = mean + margin\n    width = high - low\n    print(f'{level}: ({low:.2f}, {high:.2f}) width = {width:.2f}')\n\nprint('\\nHigher confidence = wider interval')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "99% CI is widest", description: "Width increases with confidence" }]),
        hints: ["Use z=1.645 for 90%, 1.96 for 95%, 2.576 for 99%", "Width = 2 * margin", "Higher confidence needs wider interval"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson14_3_1.id,
        number: 3,
        title: "Verify CI Coverage",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Population 1-100 (mean=50.5). Take 200 samples of size 25, build 95% CI for each. Count how many capture true mean. Should be ~190 (95%).",
        starterCode: "import random\nimport statistics\nimport math\n\npopulation = list(range(1, 101))\ntrue_mean = 50.5\npop_std = statistics.pstdev(population)\n\ncaptures = 0\nfor _ in range(200):\n    sample = random.sample(population, 25)\n    mean = statistics.mean(sample)\n    se = pop_std / math.sqrt(25)\n    ci_low = mean - 1.96 * se\n    ci_high = mean + 1.96 * se\n    if ci_low <= true_mean <= ci_high:\n        captures += 1\n\nprint(f'CIs capturing true mean: {captures}/200')\nprint(f'Percentage: {captures/2:.1f}%')\nprint(f'Expected: ~95%')",
        solution: "import random\nimport statistics\nimport math\n\npopulation = list(range(1, 101))\ntrue_mean = 50.5\npop_std = statistics.pstdev(population)\n\ncaptures = 0\nfor _ in range(200):\n    sample = random.sample(population, 25)\n    mean = statistics.mean(sample)\n    se = pop_std / math.sqrt(25)\n    ci_low = mean - 1.96 * se\n    ci_high = mean + 1.96 * se\n    if ci_low <= true_mean <= ci_high:\n        captures += 1\n\nprint(f'CIs capturing true mean: {captures}/200')\nprint(f'Percentage: {captures/2:.1f}%')\nprint(f'Expected: ~95%')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "~95% capture rate", description: "95% CI works" }]),
        hints: ["True mean is 50.5", "Check if true_mean is between ci_low and ci_high", "Should be close to 95%"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson14_3_1.id,
        number: 4,
        title: "Sample Size Effect on CI Width",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Calculate 95% CI width for sample sizes 10, 50, 100, 500 (assume std=20). How does width change with sample size?",
        starterCode: "import math\n\nstd = 20\n\nprint('n      SE       CI Width')\nfor n in [10, 50, 100, 500]:\n    se = std / math.sqrt(n)\n    width = 2 * 1.96 * se\n    print(f'{n:3d}    {se:6.2f}   {width:8.2f}')",
        solution: "import math\n\nstd = 20\n\nprint('n      SE       CI Width')\nfor n in [10, 50, 100, 500]:\n    se = std / math.sqrt(n)\n    width = 2 * 1.96 * se\n    print(f'{n:3d}    {se:6.2f}   {width:8.2f}')\n\nprint('\\n4x more samples = half the CI width')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Width decreases as n increases", description: "Larger n = narrower CI" }]),
        hints: ["SE = 20 / sqrt(n)", "Width = 2 * 1.96 * SE", "Width decreases with sqrt(n)"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson14_3_1.id,
        number: 5,
        title: "CI for Real Data",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Test scores: [85, 90, 78, 92, 88, 76, 95, 82, 89, 91, 87, 84]. Calculate 95% CI. Interpret: what can we say about the true class average?",
        starterCode: "import statistics\nimport math\n\nscores = [85, 90, 78, 92, 88, 76, 95, 82, 89, 91, 87, 84]\n\nmean = statistics.mean(scores)\nstd = statistics.stdev(scores)\nn = len(scores)\nse = std / math.sqrt(n)\n\nmargin = 1.96 * se\nci_low = mean - margin\nci_high = mean + margin\n\nprint(f'Sample size: {n}')\nprint(f'Sample mean: {mean:.2f}')\nprint(f'Sample std: {std:.2f}')\nprint(f'Standard error: {se:.2f}')\nprint(f'\\n95% CI: ({ci_low:.2f}, {ci_high:.2f})')\nprint(f'\\nInterpretation: ')",
        solution: "import statistics\nimport math\n\nscores = [85, 90, 78, 92, 88, 76, 95, 82, 89, 91, 87, 84]\n\nmean = statistics.mean(scores)\nstd = statistics.stdev(scores)\nn = len(scores)\nse = std / math.sqrt(n)\n\nmargin = 1.96 * se\nci_low = mean - margin\nci_high = mean + margin\n\nprint(f'Sample size: {n}')\nprint(f'Sample mean: {mean:.2f}')\nprint(f'Sample std: {std:.2f}')\nprint(f'Standard error: {se:.2f}')\nprint(f'\\n95% CI: ({ci_low:.2f}, {ci_high:.2f})')\nprint(f'\\nInterpretation: We are 95% confident the true')\nprint(f'class average is between {ci_low:.1f} and {ci_high:.1f}.')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "CI around (83, 90)", description: "Real data interpretation" }]),
        hints: ["Calculate mean, std, SE first", "Apply CI formula", "Interpret in context of test scores"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 14.3.1`);

  const lesson14_3_2 = await prisma.lesson.upsert({
    where: { slug: "margin-of-error-sample-size" },
    update: {},
    create: {
      sectionId: section14_3.id,
      number: 14.32,
      title: "Margin of Error and Sample Size Determination",
      slug: "margin-of-error-sample-size",
      objectives: [
        "Understand margin of error",
        "Calculate required sample size for desired precision",
        "Apply to polling and survey design",
        "Understand precision vs cost tradeoff",
      ],
      content: `# Margin of Error and Sample Size

## Margin of Error

**Margin of Error = z * SE = z * (σ/√n)**

The "±" part of a confidence interval.

Example: "48% ± 3%" means CI is (45%, 51%)

## Determining Sample Size

Want specific margin of error? Solve for n:

**n = (z * σ / E)²**

Where:
- E = desired margin of error
- z = z-score for confidence level
- σ = population std dev (estimated)

## Practical Example

Want margin of error of ±3% for a poll (95% confidence):
- z = 1.96
- σ = 0.5 (worst case for proportions)
- n = (1.96 * 0.5 / 0.03)² ≈ 1067

Need about 1067 people!

## Key Insights

1. **Diminishing returns**: Halving margin of error requires 4x more samples
2. **Cost-precision tradeoff**: More precision = more expensive
3. **Planning ahead**: Calculate sample size BEFORE collecting data`,
      codeExamples: JSON.stringify([
        {
          id: "sample-size-calc",
          title: "Calculate Required Sample Size",
          code: "import math\n\ndef required_sample_size(std, margin, confidence=0.95):\n    z = 1.96 if confidence == 0.95 else 2.576\n    n = (z * std / margin) ** 2\n    return math.ceil(n)\n\n# Want margin of 2, std is 15\nn = required_sample_size(std=15, margin=2)\nprint(f'For margin of 2: need n = {n}')\n\nn = required_sample_size(std=15, margin=1)\nprint(f'For margin of 1: need n = {n}')\n\nprint('\\nHalving margin requires 4x samples!')",
          description: "How many samples do we need?",
        },
        {
          id: "poll-sample-size",
          title: "Polling Sample Size",
          code: "import math\n\ndef poll_sample_size(margin_pct, confidence=0.95):\n    z = 1.96 if confidence == 0.95 else 2.576\n    # Worst case std for proportions is 0.5\n    std = 0.5\n    margin = margin_pct / 100\n    n = (z * std / margin) ** 2\n    return math.ceil(n)\n\nprint('Required sample sizes for polls:')\nfor margin in [5, 3, 2, 1]:\n    n = poll_sample_size(margin)\n    print(f'  ±{margin}%: n = {n:,}')",
          description: "Why polls survey ~1000 people",
        },
        {
          id: "precision-cost",
          title: "Precision vs Sample Size",
          code: "import math\n\nstd = 20\nz = 1.96\n\nprint('n       Margin of Error')\nfor n in [25, 100, 400, 1600]:\n    margin = z * std / math.sqrt(n)\n    print(f'{n:4d}    ±{margin:.2f}')\n\nprint('\\n4x more samples = 2x better precision')",
          description: "Diminishing returns on precision",
        },
      ]),
      keyPoints: [
        "Margin of error = z * (σ/√n)",
        "Sample size n = (z * σ / E)²",
        "Halving margin of error requires 4x more samples",
        "Plan sample size before collecting data",
        "More precision costs more (time, money)",
        "Typical polls use ~1000 for ±3% margin",
      ],
      hardwareDemo: "Watch sample size formula calculation. See margin of error decrease with more samples.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson14_3_2.number}: ${lesson14_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson14_3_2.id,
        number: 1,
        title: "Calculate Margin of Error",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Sample of 100 with std=15. Calculate margin of error for 95% confidence (z=1.96).",
        starterCode: "import math\n\nn = 100\nstd = 15\nz = 1.96\n\nse = std / math.sqrt(n)\nmargin = z * se\n\nprint(f'Standard Error: {se:.2f}')\nprint(f'Margin of Error: ±{margin:.2f}')",
        solution: "import math\n\nn = 100\nstd = 15\nz = 1.96\n\nse = std / math.sqrt(n)\nmargin = z * se\n\nprint(f'Standard Error: {se:.2f}')\nprint(f'Margin of Error: ±{margin:.2f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Margin: ±2.94", description: "Correct margin" }]),
        hints: ["SE = std / sqrt(n) = 15/10 = 1.5", "Margin = 1.96 * 1.5", "Answer is about 2.94"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson14_3_2.id,
        number: 2,
        title: "Required Sample Size",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Population std=20. What sample size needed for margin of error ±3 at 95% confidence?",
        starterCode: "import math\n\nstd = 20\nmargin = 3\nz = 1.96\n\n# n = (z * std / margin)^2\nn = (z * std / margin) ** 2\nn_rounded = math.ceil(n)\n\nprint(f'Required sample size: {n_rounded}')\n\n# Verify\nactual_margin = z * std / math.sqrt(n_rounded)\nprint(f'Actual margin with n={n_rounded}: ±{actual_margin:.2f}')",
        solution: "import math\n\nstd = 20\nmargin = 3\nz = 1.96\n\nn = (z * std / margin) ** 2\nn_rounded = math.ceil(n)\n\nprint(f'Required sample size: {n_rounded}')\n\nactual_margin = z * std / math.sqrt(n_rounded)\nprint(f'Actual margin with n={n_rounded}: ±{actual_margin:.2f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "n = 171", description: "Correct sample size" }]),
        hints: ["n = (1.96 * 20 / 3)^2", "= (39.2 / 3)^2 = 13.07^2", "= 170.7, round up to 171"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson14_3_2.id,
        number: 3,
        title: "Poll Sample Size",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Design a political poll. Calculate sample sizes needed for margins of ±5%, ±3%, ±2%, ±1% (95% confidence, use std=0.5 for proportions).",
        starterCode: "import math\n\nstd = 0.5  # Worst case for proportions\nz = 1.96\n\nprint('Margin    Required n')\nfor margin_pct in [5, 3, 2, 1]:\n    margin = margin_pct / 100\n    n = (z * std / margin) ** 2\n    print(f'±{margin_pct}%       {math.ceil(n):,}')",
        solution: "import math\n\nstd = 0.5\nz = 1.96\n\nprint('Margin    Required n')\nfor margin_pct in [5, 3, 2, 1]:\n    margin = margin_pct / 100\n    n = (z * std / margin) ** 2\n    print(f'±{margin_pct}%       {math.ceil(n):,}')\n\nprint('\\nThis is why most polls survey ~1000 people (±3%)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "±3% needs ~1068", description: "Poll sample sizes" }]),
        hints: ["Convert % to decimal: 3% = 0.03", "n = (1.96 * 0.5 / 0.03)^2", "±1% requires ~10,000 people!"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson14_3_2.id,
        number: 4,
        title: "Diminishing Returns",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Show diminishing returns: Calculate margin of error for n = 100, 400, 1600, 6400 (std=20, 95% CI). How much does margin improve each time?",
        starterCode: "import math\n\nstd = 20\nz = 1.96\n\nprint('n        Margin    Improvement')\nprev_margin = None\nfor n in [100, 400, 1600, 6400]:\n    margin = z * std / math.sqrt(n)\n    if prev_margin:\n        improvement = prev_margin / margin\n        print(f'{n:5d}    ±{margin:.2f}     {improvement:.1f}x better')\n    else:\n        print(f'{n:5d}    ±{margin:.2f}     (baseline)')\n    prev_margin = margin",
        solution: "import math\n\nstd = 20\nz = 1.96\n\nprint('n        Margin    Improvement')\nprev_margin = None\nfor n in [100, 400, 1600, 6400]:\n    margin = z * std / math.sqrt(n)\n    if prev_margin:\n        improvement = prev_margin / margin\n        print(f'{n:5d}    ±{margin:.2f}     {improvement:.1f}x better')\n    else:\n        print(f'{n:5d}    ±{margin:.2f}     (baseline)')\n    prev_margin = margin\n\nprint('\\n4x samples = 2x better precision (diminishing returns)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Each 4x gives 2x improvement", description: "Square root relationship" }]),
        hints: ["Each step is 4x more samples", "Margin decreases by sqrt(4) = 2", "This is diminishing returns"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson14_3_2.id,
        number: 5,
        title: "Budget Constraint Problem",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Each survey response costs $5. Budget is $2000. Population std=30. What margin of error can we achieve with 95% confidence?",
        starterCode: "import math\n\nbudget = 2000\ncost_per_response = 5\nstd = 30\nz = 1.96\n\n# How many responses can we afford?\nmax_n = budget // cost_per_response\n\n# What margin does that give?\nse = std / math.sqrt(max_n)\nmargin = z * se\n\nprint(f'Budget: ${budget}')\nprint(f'Cost per response: ${cost_per_response}')\nprint(f'Max sample size: {max_n}')\nprint(f'Achievable margin: ±{margin:.2f}')",
        solution: "import math\n\nbudget = 2000\ncost_per_response = 5\nstd = 30\nz = 1.96\n\nmax_n = budget // cost_per_response\nse = std / math.sqrt(max_n)\nmargin = z * se\n\nprint(f'Budget: ${budget}')\nprint(f'Cost per response: ${cost_per_response}')\nprint(f'Max sample size: {max_n}')\nprint(f'Achievable margin: ±{margin:.2f}')\n\nprint(f'\\nWith ${budget} we can achieve ±{margin:.1f} precision')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "n=400, margin around ±2.94", description: "Budget-constrained design" }]),
        hints: ["$2000 / $5 = 400 responses", "SE = 30 / sqrt(400) = 1.5", "Margin = 1.96 * 1.5 ≈ 2.94"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 14.3.2`);

  console.log("\n✅ Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
