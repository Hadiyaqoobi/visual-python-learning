import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 1: Chapter 21 structure + Lessons 21.1.1-21.1.4...\n");

  const chapter21 = await prisma.chapter.upsert({
    where: { number: 21 },
    update: {},
    create: {
      number: 21,
      title: "Lies, Damned Lies, and Statistics",
      description: "Develop critical thinking about data. Learn to recognize statistical manipulation, common fallacies, and misleading presentations that pervade media and business.",
      objectives: [
        "Identify common statistical errors and fallacies",
        "Distinguish correlation from causation",
        "Recognize selection and survivorship bias",
        "Detect misleading visualizations",
        "Evaluate statistical claims critically",
      ],
      isPublished: true,
    },
  });
  console.log(`✅ Chapter ${chapter21.number}: ${chapter21.title}`);

  const section21_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter21.id, number: 21.1 } },
    update: {},
    create: {
      chapterId: chapter21.id,
      number: 21.1,
      title: "Statistical Fallacies and Biases",
      description: "Common errors in statistical reasoning.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section21_1.number}: ${section21_1.title}`);

  const section21_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter21.id, number: 21.2 } },
    update: {},
    create: {
      chapterId: chapter21.id,
      number: 21.2,
      title: "Data Manipulation",
      description: "How data can be manipulated to mislead.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section21_2.number}: ${section21_2.title}`);

  const section21_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter21.id, number: 21.3 } },
    update: {},
    create: {
      chapterId: chapter21.id,
      number: 21.3,
      title: "Critical Evaluation",
      description: "Tools for evaluating statistical claims.",
      order: 3,
    },
  });
  console.log(`  📂 Section ${section21_3.number}: ${section21_3.title}`);

  // Lesson 21.1.1
  const lesson21_1_1 = await prisma.lesson.upsert({
    where: { slug: "common-statistical-errors" },
    update: {},
    create: {
      sectionId: section21_1.id,
      number: 21.11,
      title: "Common Statistical Errors",
      slug: "common-statistical-errors",
      objectives: [
        "Recognize base rate neglect",
        "Understand sample size issues",
        "Identify the prosecutor's fallacy",
        "Detect misuse of averages",
      ],
      content: `# Common Statistical Errors

## 1. Base Rate Neglect

Ignoring how common something is in the population.

**Example**: "Test is 99% accurate" doesn't mean positive = 99% chance of disease!
If disease affects 1 in 10,000, most positives are false positives.

## 2. Small Sample Sizes

Drawing big conclusions from too little data.

**Example**: "3 out of 4 dentists recommend..." (they only asked 4!)

## 3. Prosecutor's Fallacy

Confusing P(evidence | innocent) with P(innocent | evidence).

**Example**: "1 in a million match" ≠ "1 in a million chance of innocence"

## 4. Misusing Averages

Mean vs median vs mode matter!

**Example**: "Average salary is $100K" (but median is $50K - skewed by few rich people)

## 5. Regression to the Mean

Extreme values tend to be followed by less extreme ones.

**Example**: "Sports Illustrated jinx" - players on cover often perform worse next year (they were already at peak).`,
      codeExamples: JSON.stringify([
        {
          id: "base-rate-neglect",
          title: "Base Rate Neglect Demo",
          code: "# The '99% accurate test' problem\n\ndef test_scenario(disease_rate, test_accuracy):\n    population = 100000\n    sick = int(population * disease_rate)\n    healthy = population - sick\n    \n    # Test results\n    true_positive = int(sick * test_accuracy)\n    false_negative = sick - true_positive\n    false_positive = int(healthy * (1 - test_accuracy))\n    true_negative = healthy - false_positive\n    \n    # What people think vs reality\n    total_positive = true_positive + false_positive\n    actual_sick_given_positive = true_positive / total_positive\n    \n    return {\n        'sick': sick,\n        'healthy': healthy,\n        'true_positive': true_positive,\n        'false_positive': false_positive,\n        'total_positive': total_positive,\n        'P_sick_given_positive': actual_sick_given_positive\n    }\n\nprint('BASE RATE NEGLECT')\nprint('=' * 50)\nprint('\"99% accurate test\" - what does positive mean?')\n\nfor rate in [0.01, 0.001, 0.0001]:\n    result = test_scenario(rate, 0.99)\n    print(f'\\nDisease rate: {rate:.2%}')\n    print(f'  Positive tests: {result[\"total_positive\"]}')\n    print(f'  Actually sick: {result[\"true_positive\"]}')\n    print(f'  P(sick | positive): {result[\"P_sick_given_positive\"]:.1%}')\n\nprint('\\n⚠️  Rare disease + positive test ≠ definitely sick!')",
          description: "Show base rate neglect",
        },
        {
          id: "small-sample",
          title: "Small Sample Problems",
          code: "import random\n\ndef coin_flip_experiment(flips):\n    heads = sum(1 for _ in range(flips) if random.random() < 0.5)\n    return heads / flips\n\nprint('SMALL SAMPLE SIZE PROBLEM')\nprint('=' * 50)\nprint('Fair coin (50% heads) - what do samples show?')\n\nrandom.seed(42)\n\nprint(f'\\n{\"Sample Size\":>12} {\"Observed %\":>12} {\"Off by\":>10}')\nprint('-' * 40)\n\nfor n in [4, 10, 30, 100, 1000, 10000]:\n    observed = coin_flip_experiment(n)\n    error = abs(observed - 0.5)\n    print(f'{n:>12} {observed:>11.1%} {error:>10.1%}')\n\nprint('\\n💡 Small samples have HIGH variance!')\nprint('   \"4 out of 5 doctors\" means almost nothing.')",
          description: "Show small sample variance",
        },
        {
          id: "average-misuse",
          title: "Misleading Averages",
          code: "# Same data, different \"averages\"\n\nsalaries = [30000, 35000, 40000, 42000, 45000, 48000, 50000, 52000, 55000, 500000]\n\n# Calculate different measures\nmean = sum(salaries) / len(salaries)\nsorted_sal = sorted(salaries)\nmedian = (sorted_sal[4] + sorted_sal[5]) / 2\nmode = 'No clear mode'\n\nprint('MISLEADING AVERAGES')\nprint('=' * 50)\nprint(f'Salaries: {salaries[:5]}... {salaries[-1]}')\nprint(f'\\nMean (average): ${mean:,.0f}')\nprint(f'Median (middle): ${median:,.0f}')\nprint(f'\\nWhich is \"the average salary\"?')\nprint(f'  Company says: ${mean:,.0f} (sounds impressive!)')\nprint(f'  Reality for most: ${median:,.0f}')\n\nprint('\\n⚠️  One $500K exec skews the mean!')\nprint('   Always ask: mean or median?')\n\n# Percentage that earns below the \"average\"\nbelow_mean = sum(1 for s in salaries if s < mean) / len(salaries)\nprint(f'\\n{below_mean:.0%} of employees earn BELOW the \"average\"!')",
          description: "Mean vs median deception",
        },
      ]),
      keyPoints: [
        "Base rate neglect: ignore prevalence at your peril",
        "Small samples have high variance",
        "Prosecutor's fallacy: don't flip conditionals",
        "Mean vs median: outliers matter",
        "Regression to mean: extremes don't last",
        "Always ask: what's the sample size?",
      ],
      hardwareDemo: "Watch probability calculations. See how sample size affects variance.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson21_1_1.number}: ${lesson21_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson21_1_1.id,
        number: 1,
        title: "Spot the Base Rate Neglect",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "A drug test is 95% accurate. If 2% of employees use drugs, what's P(user | positive)?",
        starterCode: "# Drug test scenario\naccuracy = 0.95\ndrug_use_rate = 0.02\n\n# Population of 1000 employees\npopulation = 1000\nusers = int(population * drug_use_rate)\nnon_users = population - users\n\n# Test results\ntrue_positive = int(users * accuracy)\nfalse_positive = int(non_users * (1 - accuracy))\n\ntotal_positive = true_positive + false_positive\nP_user_given_positive = true_positive / total_positive\n\nprint('Drug Test Analysis')\nprint('=' * 40)\nprint(f'Employees: {population}')\nprint(f'Actual drug users: {users}')\nprint(f'\\nTest results:')\nprint(f'  True positives: {true_positive}')\nprint(f'  False positives: {false_positive}')\nprint(f'  Total positives: {total_positive}')\nprint(f'\\nP(actually uses | positive test) = {P_user_given_positive:.1%}')\nprint(f'\\n⚠️  A positive test is only {P_user_given_positive:.0%} likely to be correct!')",
        solution: "# Shows base rate neglect - most positives are false!",
        testCases: JSON.stringify([{ input: "", expectedOutput: "~28% actually users", description: "Base rate" }]),
        hints: ["Calculate true and false positives", "Most positives from larger group", "Low base rate = many false positives"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson21_1_1.id,
        number: 2,
        title: "Small Sample Danger",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show how a small sample (n=10) can give wildly different results from a fair coin.",
        starterCode: "import random\n\ndef flip_coins(n):\n    return sum(1 for _ in range(n) if random.random() < 0.5) / n\n\nprint('Small Sample Variability')\nprint('=' * 45)\nprint('10 trials of flipping a FAIR coin 10 times:')\nprint(f'\\n{\"Trial\":>6} {\"Heads %\":>10} {\"Conclusion\":>20}')\nprint('-' * 40)\n\nfor trial in range(1, 11):\n    result = flip_coins(10)\n    if result >= 0.7:\n        conclusion = 'Biased toward heads!'\n    elif result <= 0.3:\n        conclusion = 'Biased toward tails!'\n    else:\n        conclusion = 'Seems fair'\n    print(f'{trial:>6} {result:>10.0%} {conclusion:>20}')\n\nprint('\\n⚠️  Small samples often give WRONG conclusions!')\nprint('   The coin is actually fair (50%).')",
        solution: "# Small samples are unreliable",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Variable results", description: "Small sample" }]),
        hints: ["Run multiple trials", "Same fair coin", "Results vary wildly"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson21_1_1.id,
        number: 3,
        title: "Mean vs Median",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Show how one extreme value can make the mean misleading.",
        starterCode: "# Home prices in a neighborhood\nprices = [200000, 220000, 230000, 240000, 250000, 260000, 270000, 280000, 290000, 2000000]\n\nmean_price = sum(prices) / len(prices)\nsorted_prices = sorted(prices)\nmedian_price = (sorted_prices[4] + sorted_prices[5]) / 2\n\nprint('Home Prices Analysis')\nprint('=' * 45)\nprint(f'Prices: {prices[:3]}... {prices[-1]}')\nprint(f'\\nMean: ${mean_price:,.0f}')\nprint(f'Median: ${median_price:,.0f}')\nprint(f'\\nDifference: ${mean_price - median_price:,.0f}')\n\nbelow_mean = sum(1 for p in prices if p < mean_price)\nprint(f'\\n{below_mean} out of {len(prices)} homes are below the \"average\"!')\nprint('\\nReal estate agent says: \"Average price is $500K!\"')\nprint('Reality: Most homes are around $250K.')",
        solution: "# One mansion skews the mean",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Mean much higher", description: "Mean vs median" }]),
        hints: ["One extreme value", "Mean is pulled up", "Median is robust"],
        xpReward: 10,
        order: 3,
      },
      {
        lessonId: lesson21_1_1.id,
        number: 4,
        title: "Regression to the Mean",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Simulate the 'Sports Illustrated jinx' - extreme performers regress to average.",
        starterCode: "import random\n\ndef player_performance(true_skill, luck_factor=20):\n    \"\"\"Performance = skill + luck\"\"\"\n    return true_skill + random.randint(-luck_factor, luck_factor)\n\n# Simulate players with same skill\ntrue_skill = 100\nn_players = 20\n\nprint('Regression to the Mean: Sports Illustrated Jinx')\nprint('=' * 55)\n\n# Year 1: Find the \"star\" (highest performer)\nyear1_scores = [(i, player_performance(true_skill)) for i in range(n_players)]\nstar_id, star_score = max(year1_scores, key=lambda x: x[1])\n\nprint(f'Year 1: Player {star_id} scores {star_score} (COVER STAR!)')\nprint(f'        Average score: {sum(s for _, s in year1_scores)/n_players:.1f}')\n\n# Year 2: Star's performance\nstar_year2 = player_performance(true_skill)\navg_year2 = sum(player_performance(true_skill) for _ in range(n_players)) / n_players\n\nprint(f'\\nYear 2: Player {star_id} scores {star_year2}')\nprint(f'        Change: {star_year2 - star_score:+d}')\nprint(f'\\n⚠️  The \"jinx\" is just regression to the mean!')\nprint('   Extreme performance includes luck that won\\'t repeat.')",
        solution: "# Extreme scores include luck",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Star regresses", description: "Regression to mean" }]),
        hints: ["Peak includes luck", "Luck doesn't repeat", "Not a curse, just math"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson21_1_1.id,
        number: 5,
        title: "Identify the Error",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Given statistical claims, identify what type of error each one makes.",
        starterCode: "claims = [\n    {\n        'claim': '4 out of 5 dentists recommend our toothpaste',\n        'error': 'small_sample',\n        'explanation': 'Only 5 dentists surveyed - tiny sample!'\n    },\n    {\n        'claim': 'Average income in our town is $150K',\n        'error': 'misleading_average',\n        'explanation': 'A few billionaires skew the mean; median is $50K'\n    },\n    {\n        'claim': 'DNA match is 1 in a billion, defendant must be guilty',\n        'error': 'prosecutors_fallacy',\n        'explanation': 'P(match|innocent) ≠ P(innocent|match)'\n    },\n    {\n        'claim': 'This medication cured 90% of patients who took it',\n        'error': 'base_rate_neglect',\n        'explanation': '90% of sick people get better anyway!'\n    },\n    {\n        'claim': 'Rookie of year always has worse second season',\n        'error': 'regression_to_mean',\n        'explanation': 'Outstanding year includes luck that won\\'t repeat'\n    },\n]\n\nprint('IDENTIFY THE STATISTICAL ERROR')\nprint('=' * 60)\n\nfor i, item in enumerate(claims, 1):\n    print(f'\\n{i}. \"{item[\"claim\"]}\"')\n    print(f'   Error: {item[\"error\"].replace(\"_\", \" \").title()}')\n    print(f'   Why: {item[\"explanation\"]}')",
        solution: "# Identify error types",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Errors identified", description: "Error identification" }]),
        hints: ["Each claim has a flaw", "Match to error type", "Think about what's missing"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 21.1.1`);

  // Lesson 21.1.2
  const lesson21_1_2 = await prisma.lesson.upsert({
    where: { slug: "correlation-causation" },
    update: {},
    create: {
      sectionId: section21_1.id,
      number: 21.12,
      title: "Correlation Does Not Imply Causation",
      slug: "correlation-causation",
      objectives: [
        "Understand correlation vs causation",
        "Identify confounding variables",
        "Recognize spurious correlations",
        "Know when causation can be inferred",
      ],
      content: `# Correlation ≠ Causation

## The Classic Mistake

Just because A and B occur together doesn't mean A causes B!

## Possible Explanations for Correlation

1. **A causes B** (direct causation)
2. **B causes A** (reverse causation)
3. **C causes both A and B** (confounding variable)
4. **Coincidence** (spurious correlation)

## Famous Examples

**Ice cream and drowning**: Both increase in summer (confounder: hot weather)

**Shoe size and reading ability**: Both increase with age (confounder: age)

**Pirates and global warming**: Spurious correlation!

## When CAN We Infer Causation?

1. **Randomized controlled trials** (gold standard)
2. **Natural experiments**
3. **Strong theory + multiple evidence types**
4. **Time precedence** (cause before effect)

## Key Questions

- Could there be a confounding variable?
- Does the proposed mechanism make sense?
- Has causation been tested experimentally?`,
      codeExamples: JSON.stringify([
        {
          id: "spurious-correlation",
          title: "Spurious Correlations",
          code: "import random\n\n# Generate completely unrelated data that correlates by chance\nrandom.seed(42)\n\nyears = list(range(2000, 2020))\n\n# Two unrelated trends that both go up\nice_cream_sales = [100 + i*5 + random.randint(-10, 10) for i in range(20)]\nshark_attacks = [50 + i*2 + random.randint(-5, 5) for i in range(20)]\n\n# Calculate correlation\nmean_ic = sum(ice_cream_sales) / len(ice_cream_sales)\nmean_sa = sum(shark_attacks) / len(shark_attacks)\n\nnumerator = sum((ic - mean_ic) * (sa - mean_sa) for ic, sa in zip(ice_cream_sales, shark_attacks))\ndenominator = (sum((ic - mean_ic)**2 for ic in ice_cream_sales) * sum((sa - mean_sa)**2 for sa in shark_attacks)) ** 0.5\ncorrelation = numerator / denominator\n\nprint('SPURIOUS CORRELATION')\nprint('=' * 50)\nprint(f'Correlation between ice cream sales and shark attacks:')\nprint(f'r = {correlation:.3f}')\nprint(f'\\n⚠️  Strong correlation! Does ice cream cause shark attacks?')\nprint(f'\\nNO! Both are caused by summer weather (confounding variable).')\nprint(f'- Hot weather → more swimming → more shark encounters')\nprint(f'- Hot weather → more ice cream sales')",
          description: "Show spurious correlation",
        },
        {
          id: "confounding-demo",
          title: "Confounding Variable Demo",
          code: "# Shoe size predicts reading ability?\n\nstudents = [\n    {'age': 6, 'shoe_size': 1, 'reading_score': 20},\n    {'age': 7, 'shoe_size': 2, 'reading_score': 35},\n    {'age': 8, 'shoe_size': 3, 'reading_score': 50},\n    {'age': 9, 'shoe_size': 4, 'reading_score': 65},\n    {'age': 10, 'shoe_size': 5, 'reading_score': 75},\n    {'age': 11, 'shoe_size': 6, 'reading_score': 85},\n    {'age': 12, 'shoe_size': 7, 'reading_score': 90},\n]\n\n# Correlation: shoe size vs reading\nshoes = [s['shoe_size'] for s in students]\nreading = [s['reading_score'] for s in students]\n\nmean_s = sum(shoes) / len(shoes)\nmean_r = sum(reading) / len(reading)\nnum = sum((s - mean_s) * (r - mean_r) for s, r in zip(shoes, reading))\nden = (sum((s - mean_s)**2 for s in shoes) * sum((r - mean_r)**2 for r in reading)) ** 0.5\ncorr = num / den\n\nprint('CONFOUNDING VARIABLE')\nprint('=' * 50)\nprint('Data: shoe size vs reading score')\nprint(f'\\nCorrelation: r = {corr:.3f} (very strong!)')\nprint(f'\\nShould we conclude: Bigger feet → Better reading?')\nprint(f'\\nNO! AGE is the confounding variable:')\nprint('- Age → Bigger feet (growth)')\nprint('- Age → Better reading (education)')\nprint('\\nShoe size and reading have no causal relationship!')",
          description: "Show confounding variable",
        },
        {
          id: "reverse-causation",
          title: "Reverse Causation",
          code: "# Does studying cause good grades, or do good grades cause studying?\n\nprint('REVERSE CAUSATION')\nprint('=' * 50)\n\nprint('Observation: Students who study more get better grades.')\nprint('\\nPossible interpretations:')\nprint('\\n1. Studying → Good grades (seems obvious)')\nprint('   More study time leads to better understanding')\n\nprint('\\n2. Good grades → More studying (reverse!)')\nprint('   Success motivates more effort')\nprint('   Students who do well enjoy the subject more')\n\nprint('\\n3. Third variable causes both')\nprint('   Conscientiousness → Studies hard AND gets good grades')\nprint('   Parental involvement → More studying AND better grades')\n\nprint('\\n⚠️  The causal direction is not always obvious!')\nprint('   Need experiments to determine true cause.')",
          description: "Show reverse causation possibility",
        },
      ]),
      keyPoints: [
        "Correlation: A and B occur together",
        "Causation: A actually causes B",
        "Confounders: C causes both A and B",
        "Spurious: coincidental correlation",
        "Only experiments prove causation",
        "Always ask: what else could explain this?",
      ],
      hardwareDemo: "Watch correlation calculation. See how confounders create false patterns.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson21_1_2.number}: ${lesson21_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson21_1_2.id,
        number: 1,
        title: "Identify the Confounder",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "For each correlation, identify the likely confounding variable.",
        starterCode: "correlations = [\n    {\n        'A': 'Number of firefighters at a fire',\n        'B': 'Damage caused by fire',\n        'correlation': 'positive',\n        'confounder': 'Size of the fire',\n        'explanation': 'Bigger fires need more firefighters AND cause more damage'\n    },\n    {\n        'A': 'Hospital visits',\n        'B': 'Death rate',\n        'correlation': 'positive',\n        'confounder': 'Severity of illness',\n        'explanation': 'Sicker people go to hospital AND are more likely to die'\n    },\n    {\n        'A': 'Number of TVs in home',\n        'B': 'Academic performance',\n        'correlation': 'positive',\n        'confounder': 'Family income',\n        'explanation': 'Wealthier families have more TVs AND better schools'\n    },\n]\n\nprint('IDENTIFY THE CONFOUNDER')\nprint('=' * 60)\n\nfor i, item in enumerate(correlations, 1):\n    print(f'\\n{i}. Correlation: {item[\"A\"]} ↔ {item[\"B\"]}')\n    print(f'   Direction: {item[\"correlation\"]}')\n    print(f'   Confounder: {item[\"confounder\"]}')\n    print(f'   Explanation: {item[\"explanation\"]}')",
        solution: "# Confounders explain correlations",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Confounders identified", description: "Find confounders" }]),
        hints: ["What third variable affects both?", "Think about common causes", "Not always obvious"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson21_1_2.id,
        number: 2,
        title: "Create a Spurious Correlation",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Generate two unrelated trends and show they can appear correlated.",
        starterCode: "import random\n\nrandom.seed(123)\n\n# Two completely unrelated things that trend upward\nyears = list(range(2010, 2025))\n\n# Trend 1: Smartphone sales (increasing)\nsmartphones = [50 + i*10 + random.randint(-5, 5) for i in range(15)]\n\n# Trend 2: Organic food sales (also increasing, unrelated)\norganic = [20 + i*8 + random.randint(-3, 3) for i in range(15)]\n\n# Calculate correlation\nmean_s = sum(smartphones) / len(smartphones)\nmean_o = sum(organic) / len(organic)\nnum = sum((s - mean_s) * (o - mean_o) for s, o in zip(smartphones, organic))\nden = (sum((s - mean_s)**2 for s in smartphones) * sum((o - mean_o)**2 for o in organic)) ** 0.5\ncorr = num / den\n\nprint('SPURIOUS CORRELATION DEMO')\nprint('=' * 50)\nprint(f'Correlation: Smartphones ↔ Organic Food')\nprint(f'r = {corr:.3f}')\nprint(f'\\nBoth trends go UP over time, creating false correlation!')\nprint(f'\\nDoes buying smartphones cause organic food purchases?')\nprint('NO! Both are just increasing trends over time.')",
        solution: "# Trends create spurious correlation",
        testCases: JSON.stringify([{ input: "", expectedOutput: "High correlation", description: "Spurious correlation" }]),
        hints: ["Two upward trends", "Correlate by coincidence", "Time is the confounder"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson21_1_2.id,
        number: 3,
        title: "Correlation Coefficient",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Calculate correlation coefficient and interpret what it means (and doesn't mean).",
        starterCode: "def correlation(x, y):\n    n = len(x)\n    mean_x = sum(x) / n\n    mean_y = sum(y) / n\n    \n    numerator = sum((xi - mean_x) * (yi - mean_y) for xi, yi in zip(x, y))\n    denom_x = sum((xi - mean_x)**2 for xi in x) ** 0.5\n    denom_y = sum((yi - mean_y)**2 for yi in y) ** 0.5\n    \n    return numerator / (denom_x * denom_y)\n\n# Example data\nheight = [60, 63, 65, 68, 70, 72, 74, 76]\nweight = [120, 140, 145, 160, 170, 185, 190, 200]\n\nr = correlation(height, weight)\n\nprint('CORRELATION COEFFICIENT')\nprint('=' * 45)\nprint(f'Height: {height}')\nprint(f'Weight: {weight}')\nprint(f'\\nCorrelation r = {r:.3f}')\nprint(f'\\nInterpretation:')\nprint(f'  r close to 1: strong positive relationship')\nprint(f'  r close to -1: strong negative relationship')\nprint(f'  r close to 0: no linear relationship')\nprint(f'\\n⚠️  r = {r:.2f} shows strong correlation')\nprint('   But does NOT prove height CAUSES weight!')",
        solution: "# Calculate and interpret r",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Correlation shown", description: "Correlation coefficient" }]),
        hints: ["r ranges from -1 to 1", "Magnitude = strength", "Sign = direction"],
        xpReward: 10,
        order: 3,
      },
      {
        lessonId: lesson21_1_2.id,
        number: 4,
        title: "Design an Experiment",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Given a correlation, design how you would test for causation.",
        starterCode: "def design_experiment(hypothesis):\n    print(f'\\nHypothesis: {hypothesis}')\n    print('\\nExperimental Design:')\n    print('  1. Randomly assign participants to groups')\n    print('  2. Treatment group receives intervention')\n    print('  3. Control group receives placebo/nothing')\n    print('  4. Measure outcome in both groups')\n    print('  5. Compare results statistically')\n    print('\\nWhy randomization matters:')\n    print('  - Balances confounding variables')\n    print('  - Makes groups comparable')\n    print('  - Allows causal inference')\n\nhypotheses = [\n    'Coffee improves focus',\n    'Exercise reduces depression',\n    'Music helps studying',\n]\n\nprint('DESIGNING EXPERIMENTS FOR CAUSATION')\nprint('=' * 55)\n\nfor h in hypotheses:\n    design_experiment(h)\n    print('-' * 50)",
        solution: "# Randomized experiments prove causation",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Designs shown", description: "Experiment design" }]),
        hints: ["Random assignment key", "Control group needed", "Eliminate confounders"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson21_1_2.id,
        number: 5,
        title: "Evaluate Causal Claims",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Given news headlines, evaluate whether the causal claim is justified.",
        starterCode: "claims = [\n    {\n        'headline': 'Study: Wine drinkers live longer!',\n        'study_type': 'observational',\n        'causal_claim': True,\n        'valid': False,\n        'issue': 'Confounders: wine drinkers may be wealthier, have better healthcare'\n    },\n    {\n        'headline': 'Clinical trial shows new drug reduces symptoms by 40%',\n        'study_type': 'randomized controlled trial',\n        'causal_claim': True,\n        'valid': True,\n        'issue': 'RCT can support causal claims'\n    },\n    {\n        'headline': 'Countries with more chocolate win more Nobel Prizes',\n        'study_type': 'observational',\n        'causal_claim': True,\n        'valid': False,\n        'issue': 'Obvious spurious correlation; wealth is confounder'\n    },\n]\n\nprint('EVALUATING CAUSAL CLAIMS')\nprint('=' * 60)\n\nfor item in claims:\n    print(f'\\nHeadline: \"{item[\"headline\"]}\"')\n    print(f'Study type: {item[\"study_type\"]}')\n    print(f'Makes causal claim: {item[\"causal_claim\"]}')\n    print(f'Claim valid: {\"✓\" if item[\"valid\"] else \"✗\"}')\n    print(f'Issue: {item[\"issue\"]}')",
        solution: "# Evaluate causal claims critically",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Claims evaluated", description: "Evaluate claims" }]),
        hints: ["Check study type", "Observational ≠ causal", "RCTs are gold standard"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 21.1.2`);

  // Lesson 21.1.3
  const lesson21_1_3 = await prisma.lesson.upsert({
    where: { slug: "selection-bias" },
    update: {},
    create: {
      sectionId: section21_1.id,
      number: 21.13,
      title: "Selection Bias",
      slug: "selection-bias",
      objectives: [
        "Understand what selection bias is",
        "Identify common sources of selection bias",
        "See how it distorts conclusions",
        "Learn how to avoid it",
      ],
      content: `# Selection Bias

## What Is Selection Bias?

When the sample is not representative of the population you're studying.

## Common Types

### 1. Self-Selection Bias
People who volunteer are different from those who don't.

**Example**: Survey about exercise habits - fit people more likely to respond.

### 2. Non-Response Bias
People who don't respond are systematically different.

**Example**: Customer satisfaction surveys - unhappy customers don't bother.

### 3. Sampling Bias
Method of sampling excludes certain groups.

**Example**: Phone surveys exclude people without phones.

### 4. Berkson's Bias
Selecting from a hospitalized population gives wrong conclusions.

**Example**: Studying disease correlations in hospital patients only.

## Real-World Consequences

- Political polls miss certain demographics
- Clinical trials exclude elderly/sick patients
- Product reviews are extreme (love or hate)

## How to Avoid

1. Random sampling when possible
2. High response rates
3. Understand who's missing
4. Weight data to correct imbalances`,
      codeExamples: JSON.stringify([
        {
          id: "self-selection",
          title: "Self-Selection Bias Demo",
          code: "import random\n\n# True population of 1000 people\nrandom.seed(42)\npopulation = []\nfor i in range(1000):\n    exercises = random.random() < 0.3  # 30% actually exercise\n    # People who exercise are MORE likely to respond to fitness survey\n    responds = random.random() < (0.8 if exercises else 0.2)\n    population.append({'exercises': exercises, 'responds': responds})\n\n# True population rate\ntrue_rate = sum(1 for p in population if p['exercises']) / len(population)\n\n# Survey respondents only\nrespondents = [p for p in population if p['responds']]\nsurvey_rate = sum(1 for p in respondents if p['exercises']) / len(respondents)\n\nprint('SELF-SELECTION BIAS')\nprint('=' * 50)\nprint('Survey: \"How often do you exercise?\"')\nprint(f'\\nTrue population exercise rate: {true_rate:.1%}')\nprint(f'Survey respondent exercise rate: {survey_rate:.1%}')\nprint(f'\\nBias: Survey overstates by {survey_rate - true_rate:.1%}')\nprint('\\n⚠️  Fit people more likely to respond to fitness surveys!')",
          description: "Show self-selection bias",
        },
        {
          id: "sampling-bias",
          title: "Sampling Bias Demo",
          code: "import random\n\nrandom.seed(42)\n\n# Population with different incomes\npopulation = []\nfor _ in range(500):\n    income = random.choice(['low', 'medium', 'high'])\n    # Low income less likely to have internet for online survey\n    has_internet = random.random() < {'low': 0.5, 'medium': 0.9, 'high': 0.99}[income]\n    # Political preference varies by income\n    supports_X = random.random() < {'low': 0.6, 'medium': 0.5, 'high': 0.3}[income]\n    population.append({'income': income, 'internet': has_internet, 'supports_X': supports_X})\n\n# True support in population\ntrue_support = sum(1 for p in population if p['supports_X']) / len(population)\n\n# Online survey (only people with internet)\nonline_sample = [p for p in population if p['internet']]\nonline_support = sum(1 for p in online_sample if p['supports_X']) / len(online_sample)\n\nprint('SAMPLING BIAS: Online Surveys')\nprint('=' * 50)\nprint(f'True support for candidate X: {true_support:.1%}')\nprint(f'Online survey shows support: {online_support:.1%}')\nprint(f'\\nBias: Online survey underestimates by {true_support - online_support:.1%}')\nprint('\\n⚠️  Online surveys miss low-income voters without internet!')",
          description: "Show sampling method bias",
        },
        {
          id: "review-bias",
          title: "Review Selection Bias",
          code: "import random\n\nrandom.seed(42)\n\n# True customer satisfaction (1-10)\nall_customers = [random.gauss(7, 1.5) for _ in range(1000)]\nall_customers = [max(1, min(10, s)) for s in all_customers]  # Clamp to 1-10\n\n# Who leaves reviews? Extreme experiences!\nreviewers = []\nfor satisfaction in all_customers:\n    # Very happy or very unhappy people review\n    reviews_prob = 0.5 if satisfaction <= 3 or satisfaction >= 9 else 0.05\n    if random.random() < reviews_prob:\n        reviewers.append(satisfaction)\n\ntrue_avg = sum(all_customers) / len(all_customers)\nreview_avg = sum(reviewers) / len(reviewers) if reviewers else 0\n\nprint('REVIEW SELECTION BIAS')\nprint('=' * 50)\nprint(f'Total customers: {len(all_customers)}')\nprint(f'Left reviews: {len(reviewers)}')\nprint(f'\\nTrue average satisfaction: {true_avg:.1f}/10')\nprint(f'Review average: {review_avg:.1f}/10')\n\n# Show distribution of reviews\nlow_reviews = sum(1 for r in reviewers if r < 4)\nhigh_reviews = sum(1 for r in reviewers if r > 8)\nprint(f'\\nReview distribution:')\nprint(f'  1-3 stars: {low_reviews} ({low_reviews/len(reviewers)*100:.0f}%)')\nprint(f'  8-10 stars: {high_reviews} ({high_reviews/len(reviewers)*100:.0f}%)')\nprint('\\n⚠️  Reviews are bimodal - missing the satisfied middle!')",
          description: "Show review bias",
        },
      ]),
      keyPoints: [
        "Selection bias: sample ≠ population",
        "Self-selection: volunteers differ",
        "Non-response: who didn't answer?",
        "Sampling method can exclude groups",
        "Reviews attract extremes",
        "Always ask: who's missing?",
      ],
      hardwareDemo: "Watch sampling process. See who gets included and excluded.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson21_1_3.number}: ${lesson21_1_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson21_1_3.id,
        number: 1,
        title: "Identify the Selection Bias",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "For each scenario, identify what type of selection bias is present.",
        starterCode: "scenarios = [\n    {\n        'scenario': 'Mall survey about shopping habits',\n        'bias': 'Location bias',\n        'who_missing': 'People who shop online, don\\'t go to malls'\n    },\n    {\n        'scenario': 'Emailing customers for product feedback',\n        'bias': 'Non-response bias',\n        'who_missing': 'Dissatisfied customers who unsubscribed'\n    },\n    {\n        'scenario': 'Asking gym members about exercise',\n        'bias': 'Self-selection bias',\n        'who_missing': 'People who don\\'t exercise (not at gym)'\n    },\n    {\n        'scenario': 'Studying disease outcomes in hospital patients',\n        'bias': 'Berkson\\'s bias',\n        'who_missing': 'Mild cases treated at home, healthy people'\n    },\n]\n\nprint('IDENTIFY SELECTION BIAS')\nprint('=' * 60)\n\nfor i, s in enumerate(scenarios, 1):\n    print(f'\\n{i}. {s[\"scenario\"]}')\n    print(f'   Bias type: {s[\"bias\"]}')\n    print(f'   Who\\'s missing: {s[\"who_missing\"]}')",
        solution: "# Different types of selection bias",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Biases identified", description: "Identify biases" }]),
        hints: ["Think about who participates", "Who's excluded?", "How does sample differ from population?"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson21_1_3.id,
        number: 2,
        title: "Simulate Response Bias",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Simulate how low response rates create biased results.",
        starterCode: "import random\n\nrandom.seed(42)\n\n# Population: 1000 voters\npopulation = []\nfor _ in range(1000):\n    # Engaged voters more likely to support incumbent\n    engaged = random.random() < 0.4\n    supports_incumbent = random.random() < (0.7 if engaged else 0.4)\n    # Engaged voters much more likely to respond\n    responds = random.random() < (0.6 if engaged else 0.1)\n    population.append({'engaged': engaged, 'supports': supports_incumbent, 'responds': responds})\n\n# True population support\ntrue_support = sum(1 for p in population if p['supports']) / len(population)\n\n# Survey with response bias\nrespondents = [p for p in population if p['responds']]\nsurvey_support = sum(1 for p in respondents if p['supports']) / len(respondents)\n\nresponse_rate = len(respondents) / len(population)\n\nprint('RESPONSE BIAS IN POLLING')\nprint('=' * 50)\nprint(f'Response rate: {response_rate:.1%}')\nprint(f'\\nTrue support for incumbent: {true_support:.1%}')\nprint(f'Survey shows support: {survey_support:.1%}')\nprint(f'\\nBias: {survey_support - true_support:+.1%}')\nprint('\\n⚠️  Engaged voters over-respond, skewing results!')",
        solution: "# Response bias affects results",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Bias shown", description: "Response bias" }]),
        hints: ["Who's more likely to respond?", "Do they differ on key variable?", "Compare to true population"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson21_1_3.id,
        number: 3,
        title: "Correct for Bias",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Use weighting to correct for known sampling bias.",
        starterCode: "import random\n\nrandom.seed(42)\n\n# True population: 50% young, 50% old\n# Survey over-sampled young people (70% young in sample)\n\nsurvey = []\nfor _ in range(100):\n    young = random.random() < 0.7  # Biased sample\n    # Young people prefer A, old prefer B\n    prefers_A = random.random() < (0.6 if young else 0.3)\n    survey.append({'young': young, 'prefers_A': prefers_A})\n\n# Unweighted result (biased)\nunweighted = sum(1 for s in survey if s['prefers_A']) / len(survey)\n\n# Weight to correct for oversampling\n# Young: should be 50%, are 70% → weight = 0.5/0.7\n# Old: should be 50%, are 30% → weight = 0.5/0.3\n\nweighted_sum = 0\nweight_total = 0\nfor s in survey:\n    weight = (0.5/0.7) if s['young'] else (0.5/0.3)\n    weighted_sum += weight if s['prefers_A'] else 0\n    weight_total += weight\n\nweighted = weighted_sum / weight_total\n\n# True population preference (for comparison)\ntrue_pref = 0.6 * 0.5 + 0.3 * 0.5  # 0.45\n\nprint('CORRECTING SAMPLING BIAS')\nprint('=' * 50)\nprint(f'Sample composition: 70% young, 30% old')\nprint(f'Population: 50% young, 50% old')\nprint(f'\\nUnweighted result (biased): {unweighted:.1%} prefer A')\nprint(f'Weighted result (corrected): {weighted:.1%} prefer A')\nprint(f'True population preference: {true_pref:.1%} prefer A')\nprint('\\n✓ Weighting corrects for known imbalances!')",
        solution: "# Weighting corrects known bias",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Weighted closer to truth", description: "Correct bias" }]),
        hints: ["Know population proportions", "Calculate weights", "Adjust sample to match"],
        xpReward: 25,
        order: 3,
      },
      {
        lessonId: lesson21_1_3.id,
        number: 4,
        title: "Survivorship Bias Preview",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show how looking only at survivors gives wrong conclusions.",
        starterCode: "import random\n\nrandom.seed(42)\n\n# 100 startups, risky strategy vs safe strategy\nstartups = []\nfor i in range(100):\n    risky = random.random() < 0.5\n    if risky:\n        # High risk: 20% huge success, 80% fail\n        success = random.random() < 0.2\n        if success:\n            revenue = random.randint(10, 50)  # millions\n        else:\n            revenue = 0  # failed\n    else:\n        # Safe: 60% modest success, 40% fail\n        success = random.random() < 0.6\n        if success:\n            revenue = random.randint(1, 5)  # millions\n        else:\n            revenue = 0\n    startups.append({'risky': risky, 'success': success, 'revenue': revenue})\n\n# Looking at ALL startups\nall_risky = [s for s in startups if s['risky']]\nall_safe = [s for s in startups if not s['risky']]\navg_risky_all = sum(s['revenue'] for s in all_risky) / len(all_risky)\navg_safe_all = sum(s['revenue'] for s in all_safe) / len(all_safe)\n\n# Looking at SURVIVORS only (the ones we hear about)\nsurvivors_risky = [s for s in all_risky if s['success']]\nsurvivors_safe = [s for s in all_safe if s['success']]\navg_risky_surv = sum(s['revenue'] for s in survivors_risky) / len(survivors_risky) if survivors_risky else 0\navg_safe_surv = sum(s['revenue'] for s in survivors_safe) / len(survivors_safe) if survivors_safe else 0\n\nprint('SURVIVORSHIP BIAS: Startup Strategies')\nprint('=' * 55)\nprint(f'\\nAll startups (including failures):')\nprint(f'  Risky strategy avg: ${avg_risky_all:.1f}M')\nprint(f'  Safe strategy avg: ${avg_safe_all:.1f}M')\nprint(f'  → Safe is better!')\n\nprint(f'\\nSurvivors only (what gets reported):')\nprint(f'  Risky survivors avg: ${avg_risky_surv:.1f}M')\nprint(f'  Safe survivors avg: ${avg_safe_surv:.1f}M')\nprint(f'  → Risky looks better!')\n\nprint('\\n⚠️  We only hear about survivors, not failures!')",
        solution: "# Survivors give biased picture",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Bias demonstrated", description: "Survivorship" }]),
        hints: ["Include failures", "Survivors are special", "Dead companies don't report"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson21_1_3.id,
        number: 5,
        title: "Design Unbiased Sampling",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Given a research goal, design a sampling strategy that minimizes selection bias.",
        starterCode: "def evaluate_sampling_method(method_name, pros, cons, bias_risk):\n    print(f'\\nMethod: {method_name}')\n    print(f'  Pros: {pros}')\n    print(f'  Cons: {cons}')\n    print(f'  Bias risk: {bias_risk}')\n\nprint('DESIGNING UNBIASED SAMPLING')\nprint('=' * 60)\nprint('Goal: Survey public opinion on new policy')\n\nmethods = [\n    ('Random phone survey', \n     'Reaches many people', \n     'Misses those without phones, non-responders differ',\n     'Medium'),\n    ('Online panel', \n     'Fast and cheap', \n     'Misses non-internet users, self-selected panel',\n     'High'),\n    ('In-person random addresses', \n     'Representative if done well', \n     'Expensive, time-consuming',\n     'Low'),\n    ('Stratified random sampling', \n     'Ensures all groups represented', \n     'Requires knowing population strata',\n     'Low'),\n]\n\nfor m in methods:\n    evaluate_sampling_method(*m)\n\nprint('\\n✓ Best approach: Stratified random sampling')\nprint('  - Divide population into groups (age, region, etc.)')\nprint('  - Randomly sample from each group')\nprint('  - Weight to match population proportions')",
        solution: "# Design good sampling",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Methods compared", description: "Sampling design" }]),
        hints: ["Consider who's excluded", "Random helps reduce bias", "Stratification ensures coverage"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 21.1.3`);

  // Lesson 21.1.4
  const lesson21_1_4 = await prisma.lesson.upsert({
    where: { slug: "survivorship-bias" },
    update: {},
    create: {
      sectionId: section21_1.id,
      number: 21.14,
      title: "Survivorship Bias",
      slug: "survivorship-bias",
      objectives: [
        "Understand survivorship bias deeply",
        "Recognize it in business and media",
        "See the WWII planes example",
        "Learn to ask: what's missing?",
      ],
      content: `# Survivorship Bias

## The Classic Example: WWII Planes

During WWII, engineers studied bullet holes in returning planes to decide where to add armor.

**Naive approach**: Add armor where holes are concentrated.

**Abraham Wald's insight**: Add armor where holes are NOT - those planes didn't return!

## Definition

Focusing on survivors while ignoring failures that didn't make it.

## Where It Appears

### Business
"Follow these 5 habits of successful entrepreneurs!"
(But failed entrepreneurs had the same habits)

### Investing
"This fund beat the market for 20 years!"
(Thousands of funds that failed are gone)

### Self-Help
"Dropouts like Bill Gates became billionaires!"
(Millions of dropouts didn't)

### Music/Art
"The Beatles were rejected by labels but succeeded!"
(Thousands of rejected bands stayed rejected)

## Why It's Dangerous

- Gives false confidence in strategies
- Ignores base rates of failure
- Leads to survivorship of lucky strategies`,
      codeExamples: JSON.stringify([
        {
          id: "wwii-planes",
          title: "WWII Planes Example",
          code: "# Simulate the WWII plane problem\nimport random\n\nrandom.seed(42)\n\n# 1000 planes, hit in different areas\nplanes = []\nfor _ in range(1000):\n    # Random hits in 4 areas: nose, wings, body, tail\n    hits = {\n        'nose': random.randint(0, 3),\n        'wings': random.randint(0, 5),\n        'body': random.randint(0, 6),\n        'tail': random.randint(0, 2)\n    }\n    # Planes with hits to engine (nose) or tail likely crash\n    survives = hits['nose'] < 2 and hits['tail'] < 2\n    planes.append({'hits': hits, 'survives': survives})\n\n# Only analyze RETURNING planes (survivors)\nsurvivors = [p for p in planes if p['survives']]\n\nprint('WWII AIRCRAFT SURVIVORSHIP BIAS')\nprint('=' * 50)\nprint(f'Total planes: {len(planes)}')\nprint(f'Returned: {len(survivors)}')\nprint(f'Lost: {len(planes) - len(survivors)}')\n\n# Where do survivors have holes?\nprint(f'\\nHits on RETURNING planes:')\nfor area in ['nose', 'wings', 'body', 'tail']:\n    avg_hits = sum(p['hits'][area] for p in survivors) / len(survivors)\n    print(f'  {area:6}: {avg_hits:.1f} avg hits')\n\nprint(f'\\n❌ Naive: Armor the body and wings (most holes)')\nprint(f'✓ Wald: Armor the nose and tail (planes with')\nprint(f'         those hits DIDN\\'T return!)')",
          description: "The famous WWII planes example",
        },
        {
          id: "mutual-funds",
          title: "Mutual Fund Survivorship",
          code: "import random\n\nrandom.seed(42)\n\n# Simulate 1000 mutual funds over 20 years\nfunds = []\nfor i in range(1000):\n    returns = []\n    alive = True\n    for year in range(20):\n        if not alive:\n            break\n        # Random return: some funds are just lucky\n        ret = random.gauss(0.08, 0.20)  # 8% avg, 20% std\n        returns.append(ret)\n        # Funds that do poorly get shut down\n        if len(returns) >= 3 and sum(returns[-3:]) < -0.30:\n            alive = False\n    funds.append({'returns': returns, 'survived': alive})\n\n# Surviving funds only\nsurvivors = [f for f in funds if f['survived']]\n\n# Average returns\nall_returns = [sum(f['returns'])/len(f['returns']) for f in funds if f['returns']]\nsurvivor_returns = [sum(f['returns'])/len(f['returns']) for f in survivors]\n\nprint('MUTUAL FUND SURVIVORSHIP BIAS')\nprint('=' * 50)\nprint(f'Started with: {len(funds)} funds')\nprint(f'Survived 20 years: {len(survivors)}')\nprint(f'Closed/merged: {len(funds) - len(survivors)}')\n\nprint(f'\\nAverage annual return:')\nprint(f'  All funds (including dead): {sum(all_returns)/len(all_returns)*100:.1f}%')\nprint(f'  Surviving funds only: {sum(survivor_returns)/len(survivor_returns)*100:.1f}%')\n\nprint(f'\\n⚠️  Looking only at survivors inflates returns!')\nprint(f'   \"Our fund beat the market for 20 years!\"')\nprint(f'   (Survivorship of the lucky)')",
          description: "Mutual fund survivorship bias",
        },
        {
          id: "entrepreneur-advice",
          title: "Entrepreneur Success Bias",
          code: "import random\n\nrandom.seed(42)\n\n# 10000 entrepreneurs with same traits\nentrepreneurs = []\nfor _ in range(10000):\n    # Same \"success habits\"\n    works_hard = random.random() < 0.9  # 90% work hard\n    takes_risks = random.random() < 0.8  # 80% take risks\n    networks = random.random() < 0.7    # 70% network actively\n    \n    # Success is mostly luck + small skill component\n    luck = random.random()\n    skill_bonus = 0.05 * (works_hard + takes_risks + networks)\n    success = (luck + skill_bonus) > 0.95  # Only top ~5% succeed\n    \n    entrepreneurs.append({\n        'works_hard': works_hard,\n        'takes_risks': takes_risks,\n        'networks': networks,\n        'success': success\n    })\n\nsuccesses = [e for e in entrepreneurs if e['success']]\nfailures = [e for e in entrepreneurs if not e['success']]\n\nprint('ENTREPRENEUR SUCCESS HABITS')\nprint('=' * 55)\nprint(f'Total entrepreneurs: {len(entrepreneurs)}')\nprint(f'Successful: {len(successes)} ({len(successes)/len(entrepreneurs)*100:.1f}%)')\n\nprint(f'\\n{\"Trait\":<15} {\"% of Successful\":<18} {\"% of Failures\":<18}')\nprint('-' * 55)\n\nfor trait in ['works_hard', 'takes_risks', 'networks']:\n    pct_success = sum(1 for e in successes if e[trait]) / len(successes) * 100\n    pct_failure = sum(1 for e in failures if e[trait]) / len(failures) * 100\n    print(f'{trait:<15} {pct_success:<18.1f} {pct_failure:<18.1f}')\n\nprint(f'\\n⚠️  Successful and failed entrepreneurs have SAME traits!')\nprint(f'   \"Habits of successful people\" books are misleading.')",
          description: "Success advice survivorship bias",
        },
      ]),
      keyPoints: [
        "Survivors are visible, failures are not",
        "WWII planes: armor where holes AREN'T",
        "Success advice ignores failed attempts",
        "Mutual funds: dead funds disappear from data",
        "Always ask: what am I NOT seeing?",
        "Base rates matter more than survivor stories",
      ],
      hardwareDemo: "Visualize surviving vs lost data points. See what disappears.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 4,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson21_1_4.number}: ${lesson21_1_4.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson21_1_4.id,
        number: 1,
        title: "WWII Planes Simulation",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Simulate the WWII planes problem and show where armor should go.",
        starterCode: "import random\n\nrandom.seed(42)\n\n# Simulate 500 planes\nplanes = []\nfor _ in range(500):\n    # Hits to different areas (0-5 each)\n    cockpit = random.randint(0, 5)\n    wings = random.randint(0, 5)\n    fuselage = random.randint(0, 5)\n    engine = random.randint(0, 5)\n    \n    # Plane crashes if engine or cockpit hit > 2\n    returns = engine <= 2 and cockpit <= 2\n    \n    planes.append({\n        'cockpit': cockpit, 'wings': wings,\n        'fuselage': fuselage, 'engine': engine,\n        'returns': returns\n    })\n\nreturned = [p for p in planes if p['returns']]\nlost = [p for p in planes if not p['returns']]\n\nprint('WWII Planes Analysis')\nprint('=' * 50)\nprint(f'Returned: {len(returned)}, Lost: {len(lost)}')\n\nprint(f'\\nAverage hits on RETURNED planes:')\nfor area in ['cockpit', 'wings', 'fuselage', 'engine']:\n    avg = sum(p[area] for p in returned) / len(returned)\n    print(f'  {area:10}: {avg:.1f}')\n\nprint(f'\\n→ Most damage on wings/fuselage')\nprint(f'→ But planes with cockpit/engine damage CRASHED!')\nprint(f'→ Armor the cockpit and engine!')",
        solution: "# Armor where survivors DON'T have holes",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Correct analysis", description: "WWII planes" }]),
        hints: ["Survivors have fewer critical hits", "Lost planes had critical hits", "Armor the quiet spots"],
        xpReward: 20,
        order: 1,
      },
      {
        lessonId: lesson21_1_4.id,
        number: 2,
        title: "Spot Survivorship Bias",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Identify survivorship bias in common claims.",
        starterCode: "claims = [\n    {\n        'claim': 'Successful startups all pivoted from their original idea',\n        'bias': 'We don\\'t see startups that pivoted and still failed',\n        'reality': 'Most pivoting companies also fail'\n    },\n    {\n        'claim': 'Old buildings are better built than new ones',\n        'bias': 'Poorly built old buildings already collapsed',\n        'reality': 'We only see the sturdy survivors'\n    },\n    {\n        'claim': 'Music was better in the past',\n        'bias': 'Bad old music was forgotten',\n        'reality': 'We compare best of past to all of present'\n    },\n    {\n        'claim': 'Cat owners who give their sick cats homeopathy say it works',\n        'bias': 'Cats that died aren\\'t reported',\n        'reality': 'Surviving cats would have recovered anyway'\n    },\n]\n\nprint('SPOTTING SURVIVORSHIP BIAS')\nprint('=' * 60)\n\nfor i, c in enumerate(claims, 1):\n    print(f'\\n{i}. \"{c[\"claim\"]}\"')\n    print(f'   Bias: {c[\"bias\"]}')\n    print(f'   Reality: {c[\"reality\"]}')",
        solution: "# Identify what's missing",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Biases identified", description: "Spot bias" }]),
        hints: ["What don't we see?", "What's been forgotten/removed?", "What failures are hidden?"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson21_1_4.id,
        number: 3,
        title: "Investment Fund Survivorship",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Simulate how fund closures inflate average reported returns.",
        starterCode: "import random\n\nrandom.seed(42)\n\n# 200 funds, 10 years\nfunds = []\nfor fund_id in range(200):\n    skill = random.gauss(0, 0.02)  # Small skill differences\n    returns = []\n    active = True\n    \n    for year in range(10):\n        if not active:\n            returns.append(None)\n            continue\n        \n        ret = skill + random.gauss(0.07, 0.15)  # Market + noise\n        returns.append(ret)\n        \n        # Close fund if 3-year trailing return < -10%\n        if year >= 2:\n            trailing = sum(r for r in returns[-3:] if r) / 3\n            if trailing < -0.10:\n                active = False\n    \n    funds.append({'id': fund_id, 'returns': returns, 'active': active})\n\n# Calculate returns two ways\nactive_funds = [f for f in funds if f['active']]\n\nprint('INVESTMENT SURVIVORSHIP BIAS')\nprint('=' * 50)\nprint(f'Started: {len(funds)} funds')\nprint(f'Still active: {len(active_funds)}')\nprint(f'Closed: {len(funds) - len(active_funds)}')\n\n# All funds (including while they were active)\nall_returns = []\nfor f in funds:\n    for r in f['returns']:\n        if r is not None:\n            all_returns.append(r)\n\n# Survivors only\nsurvivor_returns = []\nfor f in active_funds:\n    for r in f['returns']:\n        if r is not None:\n            survivor_returns.append(r)\n\nprint(f'\\nAverage annual return:')\nprint(f'  Including closed funds: {sum(all_returns)/len(all_returns)*100:.1f}%')\nprint(f'  Survivors only: {sum(survivor_returns)/len(survivor_returns)*100:.1f}%')\nprint(f'\\n⚠️  Reported \"industry average\" is inflated!')",
        solution: "# Survivors have higher average",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Bias quantified", description: "Fund survivorship" }]),
        hints: ["Bad funds close", "Only good funds remain", "Reported average is biased up"],
        xpReward: 25,
        order: 3,
      },
      {
        lessonId: lesson21_1_4.id,
        number: 4,
        title: "Counter the Dropout Billionaire Myth",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show why 'dropouts become billionaires' is survivorship bias.",
        starterCode: "import random\n\nrandom.seed(42)\n\n# Simulate outcomes for dropouts vs graduates\nn = 100000\n\ndropouts = []\ngraduates = []\n\nfor _ in range(n // 2):\n    # Dropout: small chance of huge success, higher chance of struggle\n    outcome = random.random()\n    if outcome < 0.0001:  # 0.01% become very rich\n        dropouts.append('billionaire')\n    elif outcome < 0.30:\n        dropouts.append('struggling')\n    else:\n        dropouts.append('middle_class')\n\nfor _ in range(n // 2):\n    # Graduate: more stable outcomes\n    outcome = random.random()\n    if outcome < 0.00005:  # 0.005% become very rich\n        graduates.append('billionaire')\n    elif outcome < 0.10:\n        graduates.append('struggling')\n    else:\n        graduates.append('middle_class')\n\nprint('DROPOUT BILLIONAIRE MYTH')\nprint('=' * 55)\n\nprint(f'\\n{\"Outcome\":<15} {\"Dropouts\":<15} {\"Graduates\":<15}')\nprint('-' * 45)\nfor outcome in ['billionaire', 'middle_class', 'struggling']:\n    d_pct = dropouts.count(outcome) / len(dropouts) * 100\n    g_pct = graduates.count(outcome) / len(graduates) * 100\n    print(f'{outcome:<15} {d_pct:<15.3f}% {g_pct:<15.3f}%')\n\nprint(f'\\nMedia reports: \"Dropouts like Gates/Zuckerberg became billionaires!\"')\nprint(f'Reality: Dropouts are MORE likely to struggle.')\nprint(f'         We only hear about the tiny fraction who succeed.')",
        solution: "# Base rates tell the real story",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Myth debunked", description: "Dropout myth" }]),
        hints: ["Compare full distributions", "Billionaires are tiny minority", "Struggling is more common for dropouts"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson21_1_4.id,
        number: 5,
        title: "Ask: What's Missing?",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "For various data presentations, identify what survivorship is hiding.",
        starterCode: "analyses = [\n    {\n        'data': 'Average age of top CEOs is 54',\n        'visible': 'Successful CEOs still in their positions',\n        'missing': 'CEOs who were fired, quit, or whose companies failed',\n        'better_question': 'What\\'s the success rate of CEOs by age?'\n    },\n    {\n        'data': 'Most successful restaurants have been open 10+ years',\n        'visible': 'Restaurants still operating after 10 years',\n        'missing': '60% of restaurants that failed in first 3 years',\n        'better_question': 'What % of new restaurants survive 10 years?'\n    },\n    {\n        'data': 'Reviews show this product is 4.8 stars',\n        'visible': 'People who bought it and left reviews',\n        'missing': 'Returns, people too frustrated to review',\n        'better_question': 'What\\'s the return rate? Review response rate?'\n    },\n]\n\nprint('WHAT\\'S MISSING FROM THIS DATA?')\nprint('=' * 65)\n\nfor a in analyses:\n    print(f'\\nData presented: \"{a[\"data\"]}\"')\n    print(f'  Visible: {a[\"visible\"]}')\n    print(f'  Missing: {a[\"missing\"]}')\n    print(f'  Better question: {a[\"better_question\"]}')",
        solution: "# Always ask what's not shown",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Missing data identified", description: "What's missing" }]),
        hints: ["Who left the sample?", "What failures are hidden?", "Ask about base rates"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 21.1.4`);

  console.log("\n✅ Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
