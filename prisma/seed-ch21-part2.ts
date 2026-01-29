import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 2: Lessons 21.2.1-21.2.3 (Data Manipulation)...\n");

  const section21_2 = await prisma.section.findFirst({ where: { number: 21.2 } });
  if (!section21_2) throw new Error("Section 21.2 not found. Run part 1 first.");

  // Lesson 21.2.1
  const lesson21_2_1 = await prisma.lesson.upsert({
    where: { slug: "cherry-picking-p-hacking" },
    update: {},
    create: {
      sectionId: section21_2.id,
      number: 21.21,
      title: "Cherry-Picking Data (P-Hacking)",
      slug: "cherry-picking-p-hacking",
      objectives: [
        "Understand p-hacking and data dredging",
        "See how multiple testing inflates false positives",
        "Recognize cherry-picked results",
        "Learn about pre-registration",
      ],
      content: `# Cherry-Picking and P-Hacking

## What Is P-Hacking?

Manipulating data or analysis until you get p < 0.05:
- Testing many hypotheses, reporting only significant ones
- Removing "outliers" until results are significant
- Trying different statistical tests
- Stopping data collection when p < 0.05

## The Multiple Testing Problem

If you test 20 hypotheses at α = 0.05:
- Expected false positives: 20 × 0.05 = 1
- You'll likely find "something significant" by chance!

## Real Examples

**Jelly beans cause acne**: Test 20 colors, one will be "significant" by chance.

**Chocolate and Nobel Prizes**: Correlation found by testing many country-level variables.

## How to Spot It

- Suspiciously round p-values (p = 0.049)
- Only positive results reported
- Post-hoc hypotheses presented as predictions
- Unusual subgroup analyses

## Solutions

1. **Pre-registration**: State hypotheses before seeing data
2. **Bonferroni correction**: Adjust α for multiple tests
3. **Replication**: Require independent confirmation`,
      codeExamples: JSON.stringify([
        {
          id: "multiple-testing",
          title: "Multiple Testing Problem",
          code: "import random\n\nrandom.seed(42)\n\ndef fake_experiment(n=30):\n    \"\"\"Generate random data with no real effect\"\"\"\n    group1 = [random.gauss(100, 15) for _ in range(n)]\n    group2 = [random.gauss(100, 15) for _ in range(n)]  # Same mean!\n    \n    # Simple t-test approximation\n    mean1 = sum(group1) / n\n    mean2 = sum(group2) / n\n    pooled_se = ((sum((x-mean1)**2 for x in group1) + \n                  sum((x-mean2)**2 for x in group2)) / (2*n-2)) ** 0.5\n    t = (mean1 - mean2) / (pooled_se * (2/n)**0.5)\n    \n    # Very rough p-value approximation\n    p = 2 * (1 - min(0.9999, 0.5 + 0.4 * min(abs(t)/3, 1)))\n    return p\n\nprint('MULTIPLE TESTING PROBLEM')\nprint('=' * 50)\nprint('Running 20 experiments with NO real effect...')\nprint('(Both groups have same mean = 100)')\nprint(f'\\n{\"Test\":<6} {\"P-value\":<10} {\"Significant?\":<12}')\nprint('-' * 30)\n\nsignificant_count = 0\nfor i in range(20):\n    p = fake_experiment()\n    sig = 'YES *' if p < 0.05 else 'no'\n    if p < 0.05:\n        significant_count += 1\n    print(f'{i+1:<6} {p:<10.4f} {sig:<12}')\n\nprint(f'\\n⚠️  Found {significant_count} \"significant\" results from nothing!')\nprint(f'   Expected by chance: ~1 (5% of 20)')\nprint(f'   This is why we need multiple testing correction.')",
          description: "Show multiple testing inflates false positives",
        },
        {
          id: "jelly-bean",
          title: "The Jelly Bean Problem",
          code: "import random\n\nrandom.seed(42)\n\ncolors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', \n          'pink', 'white', 'black', 'brown', 'cyan', 'magenta',\n          'lime', 'navy', 'teal', 'coral', 'gold', 'silver',\n          'peach', 'lavender']\n\nprint('JELLY BEANS AND ACNE')\nprint('=' * 50)\nprint('\"Scientists\" test if each jelly bean color causes acne')\nprint('(None of them actually do - null hypothesis is true)')\nprint()\n\nresults = []\nfor color in colors:\n    # Simulate study: no real effect\n    p = random.random()  # Uniform random p-value under null\n    results.append((color, p))\n\n# Sort by p-value\nresults.sort(key=lambda x: x[1])\n\nprint(f'{\"Color\":<12} {\"P-value\":<10} {\"Result\":<15}')\nprint('-' * 40)\nfor color, p in results[:5]:  # Show top 5\n    sig = '*** SIGNIFICANT!' if p < 0.05 else ''\n    print(f'{color:<12} {p:<10.4f} {sig}')\nprint('... (15 more not shown)')\n\nsig_colors = [c for c, p in results if p < 0.05]\nprint(f'\\nHeadline: \"{sig_colors[0].upper()} JELLY BEANS LINKED TO ACNE!\"')\nprint(f'          (p = {results[0][1]:.3f})')\nprint(f'\\n⚠️  But they tested 20 colors!')\nprint(f'   Expected ~1 false positive at α = 0.05')\nprint(f'   This is p-hacking / data dredging!')",
          description: "Classic jelly bean XKCD example",
        },
        {
          id: "stopping-rule",
          title: "Optional Stopping",
          code: "import random\n\ndef running_p_value(data1, data2):\n    \"\"\"Calculate p-value as data accumulates\"\"\"\n    n = len(data1)\n    if n < 5:\n        return 1.0\n    mean1 = sum(data1) / n\n    mean2 = sum(data2) / n\n    pooled_var = (sum((x-mean1)**2 for x in data1) + \n                  sum((x-mean2)**2 for x in data2)) / (2*n-2)\n    se = (2 * pooled_var / n) ** 0.5\n    if se == 0:\n        return 1.0\n    t = abs(mean1 - mean2) / se\n    p = max(0.001, 1 - min(0.999, 0.3 + 0.5 * min(t/2, 1)))\n    return p\n\nprint('OPTIONAL STOPPING (P-HACKING)')\nprint('=' * 50)\nprint('Collect data and stop when p < 0.05...')\nprint('(True effect: NONE - both groups have mean 100)')\n\nrandom.seed(123)\ndata1, data2 = [], []\n\nprint(f'\\n{\"N\":<5} {\"P-value\":<10} {\"Action\":<20}')\nprint('-' * 40)\n\nstopped_early = False\nfor i in range(100):\n    data1.append(random.gauss(100, 15))\n    data2.append(random.gauss(100, 15))  # Same mean!\n    \n    if i >= 4 and i % 5 == 4:  # Check every 5 samples\n        p = running_p_value(data1, data2)\n        if p < 0.05 and not stopped_early:\n            print(f'{i+1:<5} {p:<10.4f} {\"STOP! Significant!\":<20}')\n            stopped_early = True\n            early_n = i + 1\n            early_p = p\n        elif not stopped_early:\n            print(f'{i+1:<5} {p:<10.4f} {\"Keep collecting...\":<20}')\n\nif stopped_early:\n    print(f'\\n⚠️  \"Found\" significance at n={early_n} (p={early_p:.3f})')\n    print(f'   But there\\'s NO real effect!')\n    print(f'   Optional stopping inflates false positives.')",
          description: "Show how stopping rules bias results",
        },
      ]),
      keyPoints: [
        "P-hacking: manipulate until p < 0.05",
        "20 tests at α=0.05 → expect 1 false positive",
        "Cherry-picking: report only significant results",
        "Optional stopping inflates false positives",
        "Pre-registration prevents p-hacking",
        "Replication is essential",
      ],
      hardwareDemo: "Watch p-values calculated. See false positives accumulate with multiple tests.",
      estimatedTime: 30,
      difficulty: "ADVANCED",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson21_2_1.number}: ${lesson21_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson21_2_1.id,
        number: 1,
        title: "Multiple Testing Simulation",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Run 100 tests with no real effect and count how many are 'significant'.",
        starterCode: "import random\n\nrandom.seed(42)\n\ndef fake_test():\n    \"\"\"Returns random p-value (null hypothesis is true)\"\"\"\n    return random.random()\n\nn_tests = 100\nalpha = 0.05\n\np_values = [fake_test() for _ in range(n_tests)]\nsignificant = sum(1 for p in p_values if p < alpha)\n\nprint('MULTIPLE TESTING SIMULATION')\nprint('=' * 45)\nprint(f'Tests run: {n_tests}')\nprint(f'Alpha level: {alpha}')\nprint(f'\\nSignificant results: {significant}')\nprint(f'Expected by chance: {n_tests * alpha}')\nprint(f'\\n⚠️  These are ALL false positives!')\nprint(f'   There was no real effect in any test.')",
        solution: "# ~5% false positives expected",
        testCases: JSON.stringify([{ input: "", expectedOutput: "~5 significant", description: "Multiple testing" }]),
        hints: ["Null is true for all", "5% will be significant by chance", "This is the problem"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson21_2_1.id,
        number: 2,
        title: "Bonferroni Correction",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Apply Bonferroni correction to control false positive rate.",
        starterCode: "import random\n\nrandom.seed(42)\n\nn_tests = 20\nalpha = 0.05\nbonferroni_alpha = alpha / n_tests\n\np_values = [random.random() for _ in range(n_tests)]\n\n# Without correction\nsig_uncorrected = sum(1 for p in p_values if p < alpha)\n\n# With Bonferroni correction\nsig_corrected = sum(1 for p in p_values if p < bonferroni_alpha)\n\nprint('BONFERRONI CORRECTION')\nprint('=' * 45)\nprint(f'Number of tests: {n_tests}')\nprint(f'Original α: {alpha}')\nprint(f'Bonferroni α: {bonferroni_alpha:.4f}')\n\nprint(f'\\nResults (no real effects):')\nprint(f'  Uncorrected significant: {sig_uncorrected}')\nprint(f'  Corrected significant: {sig_corrected}')\n\nprint(f'\\n✓ Bonferroni correction reduces false positives')\nprint(f'  by requiring stronger evidence when testing many hypotheses.')",
        solution: "# Bonferroni reduces false positives",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Corrected has fewer", description: "Bonferroni" }]),
        hints: ["Divide alpha by number of tests", "Stricter threshold", "Fewer false positives"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson21_2_1.id,
        number: 3,
        title: "Spot the P-Hacking",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Identify p-hacking red flags in research descriptions.",
        starterCode: "studies = [\n    {\n        'description': 'We tested our hypothesis and found p = 0.048',\n        'red_flags': ['Suspiciously close to 0.05'],\n        'likely_hacked': True\n    },\n    {\n        'description': 'After removing 3 outliers, results became significant',\n        'red_flags': ['Post-hoc outlier removal', 'Results changed with removal'],\n        'likely_hacked': True\n    },\n    {\n        'description': 'Pre-registered study found p = 0.003',\n        'red_flags': [],\n        'likely_hacked': False\n    },\n    {\n        'description': 'Among 18-24 year old males in urban areas, effect was significant',\n        'red_flags': ['Very specific subgroup', 'Likely many subgroups tested'],\n        'likely_hacked': True\n    },\n    {\n        'description': 'We stopped collecting data when we reached significance',\n        'red_flags': ['Optional stopping', 'Explicit admission of p-hacking'],\n        'likely_hacked': True\n    },\n]\n\nprint('SPOT THE P-HACKING')\nprint('=' * 60)\n\nfor i, s in enumerate(studies, 1):\n    print(f'\\n{i}. \"{s[\"description\"]}\"')\n    print(f'   Red flags: {s[\"red_flags\"] if s[\"red_flags\"] else \"None\"}')\n    print(f'   Likely p-hacked: {\"YES\" if s[\"likely_hacked\"] else \"No\"}')",
        solution: "# Identify p-hacking signs",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Red flags shown", description: "Spot p-hacking" }]),
        hints: ["p = 0.049 is suspicious", "Post-hoc changes are red flags", "Pre-registration is good"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson21_2_1.id,
        number: 4,
        title: "Garden of Forking Paths",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Show how researcher degrees of freedom lead to many possible analyses.",
        starterCode: "import random\n\nrandom.seed(42)\n\n# Generate some data\ndata = [(random.gauss(50, 10), random.gauss(50, 10), random.choice(['A', 'B']))\n        for _ in range(100)]\n\ndef analyze(data, remove_outliers, transform, subgroup):\n    \"\"\"One of many possible analyses\"\"\"\n    d = data.copy()\n    \n    # Researcher choice 1: Remove outliers?\n    if remove_outliers:\n        d = [(x, y, g) for x, y, g in d if 30 < x < 70 and 30 < y < 70]\n    \n    # Researcher choice 2: Transform?\n    if transform == 'log':\n        d = [(max(0.1, x)**0.5, y, g) for x, y, g in d]\n    \n    # Researcher choice 3: Subgroup?\n    if subgroup:\n        d = [(x, y, g) for x, y, g in d if g == 'A']\n    \n    if len(d) < 10:\n        return None\n    \n    # Calculate correlation\n    xs = [x for x, y, g in d]\n    ys = [y for x, y, g in d]\n    mean_x = sum(xs) / len(xs)\n    mean_y = sum(ys) / len(ys)\n    num = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys))\n    den = (sum((x - mean_x)**2 for x in xs) * sum((y - mean_y)**2 for y in ys)) ** 0.5\n    return num / den if den > 0 else 0\n\nprint('GARDEN OF FORKING PATHS')\nprint('=' * 55)\nprint('Same data, different \"reasonable\" analysis choices:\\n')\n\nresults = []\nfor outliers in [False, True]:\n    for transform in ['none', 'log']:\n        for subgroup in [False, True]:\n            r = analyze(data, outliers, transform, subgroup)\n            if r is not None:\n                results.append((outliers, transform, subgroup, r))\n\nprint(f'{\"Outliers\":<10} {\"Transform\":<10} {\"Subgroup\":<10} {\"Correlation\":<12}')\nprint('-' * 45)\nfor o, t, s, r in results:\n    print(f'{str(o):<10} {t:<10} {str(s):<10} {r:+.3f}')\n\nprint(f'\\nCorrelation range: {min(r for _,_,_,r in results):.3f} to {max(r for _,_,_,r in results):.3f}')\nprint(f'\\n⚠️  8 different \"defensible\" analyses!')\nprint(f'   Easy to find one that \"works\".')",
        solution: "# Many analyses possible",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Multiple results", description: "Forking paths" }]),
        hints: ["Each choice multiplies options", "All seem reasonable", "Easy to find significance"],
        xpReward: 25,
        order: 4,
      },
      {
        lessonId: lesson21_2_1.id,
        number: 5,
        title: "Pre-Registration Benefits",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Simulate how pre-registration prevents p-hacking.",
        starterCode: "import random\n\ndef simulate_research(pre_registered, n_analyses=10):\n    \"\"\"Simulate research with/without pre-registration\"\"\"\n    random.seed()\n    \n    # True effect: NONE\n    p_values = [random.random() for _ in range(n_analyses)]\n    \n    if pre_registered:\n        # Must use pre-specified analysis (first one)\n        return p_values[0], 1\n    else:\n        # Can choose best p-value from many analyses\n        return min(p_values), n_analyses\n\nprint('PRE-REGISTRATION SIMULATION')\nprint('=' * 55)\n\n# Run many \"studies\"\nn_studies = 1000\npre_reg_sig = 0\nno_pre_reg_sig = 0\n\nfor _ in range(n_studies):\n    p_pre, _ = simulate_research(True)\n    p_no, _ = simulate_research(False)\n    \n    if p_pre < 0.05:\n        pre_reg_sig += 1\n    if p_no < 0.05:\n        no_pre_reg_sig += 1\n\nprint(f'Simulated {n_studies} studies (NO real effect)\\n')\nprint(f'False positive rate:')\nprint(f'  Pre-registered: {pre_reg_sig/n_studies*100:.1f}%')\nprint(f'  Not pre-registered: {no_pre_reg_sig/n_studies*100:.1f}%')\nprint(f'\\n✓ Pre-registration keeps false positives at ~5%')\nprint(f'✗ Without it, p-hacking inflates to ~{no_pre_reg_sig/n_studies*100:.0f}%')",
        solution: "# Pre-registration prevents inflation",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Pre-reg at 5%", description: "Pre-registration" }]),
        hints: ["Pre-reg: commit to one analysis", "No pre-reg: choose best", "Big difference in false positives"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 21.2.1`);

  // Lesson 21.2.2
  const lesson21_2_2 = await prisma.lesson.upsert({
    where: { slug: "misleading-visualizations" },
    update: {},
    create: {
      sectionId: section21_2.id,
      number: 21.22,
      title: "Misleading Visualizations",
      slug: "misleading-visualizations",
      objectives: [
        "Recognize truncated y-axes",
        "Spot manipulated scales",
        "Identify cherry-picked time ranges",
        "Create honest visualizations",
      ],
      content: `# Misleading Visualizations

## Common Tricks

### 1. Truncated Y-Axis
Starting y-axis above zero makes small differences look huge.

**Example**: 
- Honest: Y from 0 to 100, shows 48 vs 52
- Misleading: Y from 45 to 55, looks like 3x difference!

### 2. Manipulated Scales
Using different scales on dual-axis charts to create false correlations.

### 3. Cherry-Picked Time Ranges
Selecting start/end dates to show desired trend.

**Example**: "Stock up 20% this year!" (but down 50% over 5 years)

### 4. Area/Volume Distortion
Doubling a circle's radius quadruples its area - misleading!

### 5. 3D Charts
3D effects distort perception of values.

## How to Spot Them

1. Always check if y-axis starts at zero
2. Look for dual axes with different scales
3. Ask: what time range would change the story?
4. Be suspicious of 3D and area charts
5. Calculate actual percentages yourself`,
      codeExamples: JSON.stringify([
        {
          id: "truncated-axis",
          title: "Truncated Y-Axis",
          code: "# Same data, dramatically different impressions\n\ndata = {'Product A': 48, 'Product B': 52}\n\nprint('TRUNCATED Y-AXIS MANIPULATION')\nprint('=' * 55)\nprint(f'\\nActual values: A = {data[\"Product A\"]}, B = {data[\"Product B\"]}')\nprint(f'Real difference: {data[\"Product B\"] - data[\"Product A\"]} ({(data[\"Product B\"]/data[\"Product A\"]-1)*100:.1f}% more)')\n\n# Honest visualization (0 to 60)\nprint('\\n--- HONEST CHART (Y: 0 to 60) ---')\nfor product, value in data.items():\n    bar = '█' * int(value / 2)  # Scale to fit\n    print(f'{product}: {bar} {value}')\n\n# Misleading visualization (45 to 55)  \nprint('\\n--- MISLEADING CHART (Y: 45 to 55) ---')\nprint('(Y-axis starts at 45, not 0)')\nfor product, value in data.items():\n    # Exaggerate by showing only 45-55 range\n    bar = '█' * int((value - 45) * 3)\n    print(f'{product}: {bar} {value}')\n\nprint('\\n⚠️  Same data looks VERY different!')\nprint('   Truncated axis makes 8% difference look like 3x!')",
          description: "Show truncated axis effect",
        },
        {
          id: "cherry-picked-range",
          title: "Cherry-Picked Time Range",
          code: "import random\n\n# Simulated stock price over 5 years\nrandom.seed(42)\nprices = [100]\nfor _ in range(60):  # 60 months\n    change = random.gauss(0, 5)\n    prices.append(max(50, prices[-1] + change))\n\nprint('CHERRY-PICKED TIME RANGE')\nprint('=' * 55)\n\n# Different stories from same data\nstories = [\n    ('Last 6 months', prices[-7], prices[-1]),\n    ('Last 12 months', prices[-13], prices[-1]),\n    ('Last 3 years', prices[-37], prices[-1]),\n    ('All 5 years', prices[0], prices[-1]),\n]\n\nprint(f'\\n{\"Time Range\":<20} {\"Start\":>10} {\"End\":>10} {\"Change\":>12}')\nprint('-' * 55)\nfor name, start, end in stories:\n    change = (end/start - 1) * 100\n    print(f'{name:<20} ${start:>9.2f} ${end:>9.2f} {change:>+11.1f}%')\n\nprint('\\n⚠️  Same stock, completely different narratives!')\nprint('   \"Up 15% this quarter!\" vs \"Down 10% over 3 years\"')\nprint('   Always ask: what time range tells the FULL story?')",
          description: "Show cherry-picked time ranges",
        },
        {
          id: "area-distortion",
          title: "Area Distortion",
          code: "import math\n\n# Data: Value doubled\nvalue_a = 100\nvalue_b = 200  # 2x bigger\n\nprint('AREA DISTORTION')\nprint('=' * 55)\nprint(f'\\nActual values: A = {value_a}, B = {value_b}')\nprint(f'B is {value_b/value_a}x larger than A')\n\n# Using circles where radius ~ value (WRONG)\nradius_a = 10\nradius_b = 20  # 2x radius for 2x value\n\narea_a = math.pi * radius_a ** 2\narea_b = math.pi * radius_b ** 2\n\nprint(f'\\n--- MISLEADING (radius proportional to value) ---')\nprint(f'Circle A: radius = {radius_a}, area = {area_a:.0f}')\nprint(f'Circle B: radius = {radius_b}, area = {area_b:.0f}')\nprint(f'Visual impression: B is {area_b/area_a:.0f}x larger!')\n\n# Correct: area ~ value\nradius_a_correct = 10\nradius_b_correct = 10 * math.sqrt(2)  # √2 radius for 2x area\n\narea_a_correct = math.pi * radius_a_correct ** 2\narea_b_correct = math.pi * radius_b_correct ** 2\n\nprint(f'\\n--- CORRECT (area proportional to value) ---')\nprint(f'Circle A: radius = {radius_a_correct:.1f}, area = {area_a_correct:.0f}')\nprint(f'Circle B: radius = {radius_b_correct:.1f}, area = {area_b_correct:.0f}')\nprint(f'Visual impression: B is {area_b_correct/area_a_correct:.1f}x larger ✓')\n\nprint('\\n⚠️  Doubling radius quadruples area!')",
          description: "Show area/volume distortion",
        },
      ]),
      keyPoints: [
        "Truncated y-axis exaggerates differences",
        "Cherry-picked dates change the story",
        "Area scales with square of radius",
        "Dual axes can create false correlations",
        "3D charts distort perception",
        "Always check: does y start at 0?",
      ],
      hardwareDemo: "See same data with different visualizations. Watch perception change.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson21_2_2.number}: ${lesson21_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson21_2_2.id,
        number: 1,
        title: "Fix the Truncated Axis",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Show how starting y-axis at 0 gives honest impression.",
        starterCode: "# Poll results\ncandidate_a = 47\ncandidate_b = 53\n\nprint('FIXING TRUNCATED Y-AXIS')\nprint('=' * 50)\n\nprint(f'\\nActual results: A={candidate_a}%, B={candidate_b}%')\nprint(f'Difference: {candidate_b - candidate_a} percentage points')\n\n# Misleading (start at 40)\nprint('\\n--- MISLEADING (Y: 40-60) ---')\nfor name, val in [('A', candidate_a), ('B', candidate_b)]:\n    bar = '█' * int((val - 40) * 2)\n    print(f'{name}: {bar} {val}%')\nprint('(Looks like B has huge lead!)')\n\n# Honest (start at 0)\nprint('\\n--- HONEST (Y: 0-100) ---')\nfor name, val in [('A', candidate_a), ('B', candidate_b)]:\n    bar = '█' * int(val / 2)\n    print(f'{name}: {bar} {val}%')\nprint('(Shows actual close race)')",
        solution: "# Y at 0 shows true scale",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Both charts shown", description: "Fix truncated axis" }]),
        hints: ["Compare impressions", "Start at 0 for honesty", "6 points is not huge"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson21_2_2.id,
        number: 2,
        title: "Find the Cherry-Pick",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given data, find both bullish and bearish time ranges to show cherry-picking.",
        starterCode: "# Monthly revenue data (24 months)\nrevenue = [100, 105, 98, 102, 110, 108, 115, 120, 118, 125, 130, 128,\n           125, 120, 115, 118, 122, 125, 130, 128, 135, 140, 138, 145]\n\ndef find_story(data, direction):\n    \"\"\"Find time range that tells desired story\"\"\"\n    best_range = None\n    best_change = 0 if direction == 'bullish' else float('inf')\n    \n    for start in range(len(data) - 3):  # At least 3 months\n        for end in range(start + 3, len(data)):\n            change = (data[end] / data[start] - 1) * 100\n            if direction == 'bullish' and change > best_change:\n                best_change = change\n                best_range = (start, end)\n            elif direction == 'bearish' and change < best_change:\n                best_change = change\n                best_range = (start, end)\n    \n    return best_range, best_change\n\nprint('CHERRY-PICKING TIME RANGES')\nprint('=' * 50)\n\nbull_range, bull_change = find_story(revenue, 'bullish')\nbear_range, bear_change = find_story(revenue, 'bearish')\n\nprint(f'\\nBullish spin (months {bull_range[0]+1}-{bull_range[1]+1}):')\nprint(f'  \"Revenue up {bull_change:.0f}%!\"')\n\nprint(f'\\nBearish spin (months {bear_range[0]+1}-{bear_range[1]+1}):')\nprint(f'  \"Revenue down {abs(bear_change):.0f}%!\"')\n\nfull_change = (revenue[-1] / revenue[0] - 1) * 100\nprint(f'\\nFull picture (all 24 months):')\nprint(f'  Revenue change: {full_change:+.0f}%')",
        solution: "# Same data, opposite stories",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Both stories found", description: "Cherry-pick ranges" }]),
        hints: ["Search all ranges", "Find best positive", "Find worst negative"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson21_2_2.id,
        number: 3,
        title: "Identify Chart Problems",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "List common chart problems and how to spot them.",
        starterCode: "problems = [\n    {\n        'name': 'Truncated Y-Axis',\n        'how_to_spot': 'Y-axis doesn\\'t start at 0',\n        'why_misleading': 'Small differences look huge',\n        'fix': 'Start axis at 0 or clearly mark break'\n    },\n    {\n        'name': 'Dual Y-Axes',\n        'how_to_spot': 'Two different scales on left/right',\n        'why_misleading': 'Can make unrelated things look correlated',\n        'fix': 'Use same scale or separate charts'\n    },\n    {\n        'name': '3D Effects',\n        'how_to_spot': 'Bars/pies have depth/perspective',\n        'why_misleading': 'Perspective distorts perceived size',\n        'fix': 'Use 2D charts'\n    },\n    {\n        'name': 'Pictograph Scaling',\n        'how_to_spot': 'Icons doubled in height AND width',\n        'why_misleading': 'Area grows with square of value',\n        'fix': 'Scale area, not dimensions'\n    },\n]\n\nprint('CHART PROBLEMS CHECKLIST')\nprint('=' * 60)\n\nfor p in problems:\n    print(f'\\n📊 {p[\"name\"]}')\n    print(f'   Spot: {p[\"how_to_spot\"]}')\n    print(f'   Problem: {p[\"why_misleading\"]}')\n    print(f'   Fix: {p[\"fix\"]}')",
        solution: "# Chart problems reference",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Problems listed", description: "Chart problems" }]),
        hints: ["Each has telltale sign", "Know why it misleads", "Know the fix"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson21_2_2.id,
        number: 4,
        title: "Calculate True Comparison",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given a misleading visual comparison, calculate the actual difference.",
        starterCode: "# Company claims \"We grew 3x compared to competitor!\"\n# Visual shows bars where theirs looks 3x taller\n\nour_start = 100\nour_end = 130\ntheir_start = 100\ntheir_end = 125\n\nprint('CALCULATING TRUE COMPARISON')\nprint('=' * 50)\n\nour_growth = (our_end / our_start - 1) * 100\ntheir_growth = (their_end / their_start - 1) * 100\n\nprint(f'Our growth: {our_start} → {our_end} = +{our_growth:.0f}%')\nprint(f'Their growth: {their_start} → {their_end} = +{their_growth:.0f}%')\n\nprint(f'\\nMisleading claim: \"We grew 3x more!\"')\nprint(f'Reality: We grew {our_growth/their_growth:.2f}x their rate')\nprint(f'         Or just {our_growth - their_growth:.0f} percentage points more')\n\nprint(f'\\n--- How they made it look 3x ---')\nprint(f'Truncated Y-axis from 95 to 135:')\nprint(f'  Our bar height: {our_end - 95} units')\nprint(f'  Their bar height: {their_end - 95} units')\nprint(f'  Visual ratio: {(our_end - 95) / (their_end - 95):.1f}x')\nprint(f'\\n⚠️  Truncation turned 20% difference into visual 3x!')",
        solution: "# Calculate actual vs visual",
        testCases: JSON.stringify([{ input: "", expectedOutput: "True comparison", description: "True comparison" }]),
        hints: ["Calculate actual percentages", "Find truncation point", "Show visual distortion"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson21_2_2.id,
        number: 5,
        title: "Create Honest vs Misleading",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Given data, create both an honest and a misleading representation.",
        starterCode: "# Quarterly profits (millions)\nprofits = {'Q1': 12.1, 'Q2': 12.3, 'Q3': 12.0, 'Q4': 12.5}\n\nprint('HONEST vs MISLEADING VISUALIZATION')\nprint('=' * 55)\n\n# Honest representation\nprint('\\n--- HONEST CHART (Y: $0-$15M) ---')\nfor q, val in profits.items():\n    bar = '█' * int(val)\n    print(f'{q}: {bar} ${val}M')\nprint('Shows: Profits stable around $12M')\n\n# Misleading representation\nprint('\\n--- MISLEADING CHART (Y: $11.8M-$12.6M) ---')\nprint('(Makes small changes look dramatic)')\nfor q, val in profits.items():\n    bar = '█' * int((val - 11.8) * 25)\n    print(f'{q}: {bar} ${val}M')\nprint('Shows: Wild fluctuations!')\n\n# Statistics\nmin_p, max_p = min(profits.values()), max(profits.values())\nprint(f'\\nActual range: ${min_p}M to ${max_p}M')\nprint(f'Actual variation: {(max_p/min_p - 1)*100:.1f}%')\nprint(f'\\n⚠️  A {(max_p/min_p - 1)*100:.1f}% variation is NOT dramatic!')",
        solution: "# Same data, different impression",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Both versions", description: "Honest vs misleading" }]),
        hints: ["Honest: start at 0", "Misleading: truncate", "Calculate true variation"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 21.2.2`);

  // Lesson 21.2.3
  const lesson21_2_3 = await prisma.lesson.upsert({
    where: { slug: "simpsons-paradox" },
    update: {},
    create: {
      sectionId: section21_2.id,
      number: 21.23,
      title: "Simpson's Paradox",
      slug: "simpsons-paradox",
      objectives: [
        "Understand Simpson's paradox",
        "See how aggregation reverses trends",
        "Identify when to aggregate vs separate",
        "Apply to real-world examples",
      ],
      content: `# Simpson's Paradox

## What Is It?

A trend that appears in groups **reverses** when groups are combined.

## Classic Example: UC Berkeley Admissions

**Aggregated**: Men admitted at higher rate (looks like discrimination against women)

**By Department**: Women admitted at higher rate in MOST departments!

**Explanation**: Women applied to more competitive departments.

## Another Example: Treatment Success

**Overall**: Treatment A better than Treatment B
**Small stones**: Treatment B better
**Large stones**: Treatment B better

How? Treatment A used more on easy cases!

## Why It Happens

A **confounding variable** affects both:
1. Which group you're in
2. What outcome you get

## Key Lesson

- Aggregated data can be **opposite** of subgroup data
- Always ask: are there subgroups?
- Consider what determines group membership`,
      codeExamples: JSON.stringify([
        {
          id: "berkeley-example",
          title: "UC Berkeley Admissions",
          code: "# Simulated Berkeley-style admissions data\n\n# Department A: Easy to get into\ndept_a_men = {'applied': 400, 'admitted': 320}  # 80%\ndept_a_women = {'applied': 100, 'admitted': 85}  # 85%\n\n# Department B: Hard to get into  \ndept_b_men = {'applied': 100, 'admitted': 20}    # 20%\ndept_b_women = {'applied': 400, 'admitted': 100} # 25%\n\nprint('SIMPSON\\'S PARADOX: University Admissions')\nprint('=' * 55)\n\nprint('\\n--- BY DEPARTMENT ---')\nprint('\\nDepartment A (easy):')\nprint(f'  Men: {dept_a_men[\"admitted\"]}/{dept_a_men[\"applied\"]} = {dept_a_men[\"admitted\"]/dept_a_men[\"applied\"]*100:.0f}%')\nprint(f'  Women: {dept_a_women[\"admitted\"]}/{dept_a_women[\"applied\"]} = {dept_a_women[\"admitted\"]/dept_a_women[\"applied\"]*100:.0f}% ← Higher!')\n\nprint('\\nDepartment B (hard):')\nprint(f'  Men: {dept_b_men[\"admitted\"]}/{dept_b_men[\"applied\"]} = {dept_b_men[\"admitted\"]/dept_b_men[\"applied\"]*100:.0f}%')\nprint(f'  Women: {dept_b_women[\"admitted\"]}/{dept_b_women[\"applied\"]} = {dept_b_women[\"admitted\"]/dept_b_women[\"applied\"]*100:.0f}% ← Higher!')\n\nprint('\\n--- AGGREGATED (COMBINED) ---')\ntotal_men_applied = dept_a_men['applied'] + dept_b_men['applied']\ntotal_men_admitted = dept_a_men['admitted'] + dept_b_men['admitted']\ntotal_women_applied = dept_a_women['applied'] + dept_b_women['applied']\ntotal_women_admitted = dept_a_women['admitted'] + dept_b_women['admitted']\n\nprint(f'Men: {total_men_admitted}/{total_men_applied} = {total_men_admitted/total_men_applied*100:.0f}% ← Looks higher!')\nprint(f'Women: {total_women_admitted}/{total_women_applied} = {total_women_admitted/total_women_applied*100:.0f}%')\n\nprint('\\n⚠️  PARADOX!')\nprint('   Women had higher rates in BOTH departments')\nprint('   But lower rate OVERALL')\nprint('   Why? Women applied more to the harder department.')",
          description: "Berkeley admissions paradox",
        },
        {
          id: "medical-example",
          title: "Medical Treatment Paradox",
          code: "# Treatment success rates\n\n# Small kidney stones\nsmall_A = {'treated': 87, 'success': 81}   # 93%\nsmall_B = {'treated': 270, 'success': 234} # 87%\n\n# Large kidney stones  \nlarge_A = {'treated': 263, 'success': 192} # 73%\nlarge_B = {'treated': 80, 'success': 55}   # 69%\n\nprint('SIMPSON\\'S PARADOX: Medical Treatment')\nprint('=' * 55)\n\nprint('\\n--- BY STONE SIZE ---')\nprint('\\nSmall stones:')\nprint(f'  Treatment A: {small_A[\"success\"]}/{small_A[\"treated\"]} = {small_A[\"success\"]/small_A[\"treated\"]*100:.0f}%')\nprint(f'  Treatment B: {small_B[\"success\"]}/{small_B[\"treated\"]} = {small_B[\"success\"]/small_B[\"treated\"]*100:.0f}% ← B worse')\n\nprint('\\nLarge stones:')\nprint(f'  Treatment A: {large_A[\"success\"]}/{large_A[\"treated\"]} = {large_A[\"success\"]/large_A[\"treated\"]*100:.0f}%')\nprint(f'  Treatment B: {large_B[\"success\"]}/{large_B[\"treated\"]} = {large_B[\"success\"]/large_B[\"treated\"]*100:.0f}% ← B worse')\n\nprint('\\n--- AGGREGATED ---')\ntotal_A = small_A['treated'] + large_A['treated']\nsuccess_A = small_A['success'] + large_A['success']\ntotal_B = small_B['treated'] + large_B['treated']\nsuccess_B = small_B['success'] + large_B['success']\n\nprint(f'Treatment A: {success_A}/{total_A} = {success_A/total_A*100:.0f}%')\nprint(f'Treatment B: {success_B}/{total_B} = {success_B/total_B*100:.0f}% ← B looks better!')\n\nprint('\\n⚠️  PARADOX!')\nprint('   Treatment A is better for BOTH stone sizes')\nprint('   But Treatment B has better OVERALL rate')\nprint('   Why? A was used more on hard (large stone) cases.')",
          description: "Kidney stone treatment paradox",
        },
        {
          id: "batting-average",
          title: "Batting Average Paradox",
          code: "# Player batting averages by year\n\nplayer_1 = {\n    'year1': {'hits': 35, 'at_bats': 100},   # .350\n    'year2': {'hits': 175, 'at_bats': 500},  # .350\n}\n\nplayer_2 = {\n    'year1': {'hits': 150, 'at_bats': 500},  # .300\n    'year2': {'hits': 35, 'at_bats': 100},   # .350\n}\n\nprint('SIMPSON\\'S PARADOX: Batting Averages')\nprint('=' * 55)\n\nprint('\\n--- BY YEAR ---')\np1_y1 = player_1['year1']['hits'] / player_1['year1']['at_bats']\np1_y2 = player_1['year2']['hits'] / player_1['year2']['at_bats']\np2_y1 = player_2['year1']['hits'] / player_2['year1']['at_bats']\np2_y2 = player_2['year2']['hits'] / player_2['year2']['at_bats']\n\nprint(f'Year 1: Player 1 = {p1_y1:.3f}, Player 2 = {p2_y1:.3f} ← P1 higher')\nprint(f'Year 2: Player 1 = {p1_y2:.3f}, Player 2 = {p2_y2:.3f} ← P1 higher (tie)')\n\nprint('\\n--- COMBINED (both years) ---')\np1_total_hits = player_1['year1']['hits'] + player_1['year2']['hits']\np1_total_ab = player_1['year1']['at_bats'] + player_1['year2']['at_bats']\np2_total_hits = player_2['year1']['hits'] + player_2['year2']['hits']\np2_total_ab = player_2['year1']['at_bats'] + player_2['year2']['at_bats']\n\nprint(f'Player 1: {p1_total_hits}/{p1_total_ab} = {p1_total_hits/p1_total_ab:.3f}')\nprint(f'Player 2: {p2_total_hits}/{p2_total_ab} = {p2_total_hits/p2_total_ab:.3f} ← P2 higher!')\n\nprint('\\n⚠️  Player 1 better in BOTH years, worse OVERALL!')\nprint('   Why? Player 2 had more at-bats in the year he hit .300')",
          description: "Baseball batting average paradox",
        },
      ]),
      keyPoints: [
        "Aggregated trends can reverse subgroup trends",
        "Confounding variable determines group membership",
        "UC Berkeley: women applied to harder departments",
        "Medical: better treatment given to harder cases",
        "Always ask: are there meaningful subgroups?",
        "Aggregation can hide or reverse true effects",
      ],
      hardwareDemo: "Watch numbers aggregate. See trend reversal when combined.",
      estimatedTime: 30,
      difficulty: "ADVANCED",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson21_2_3.number}: ${lesson21_2_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson21_2_3.id,
        number: 1,
        title: "Create Simpson's Paradox",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Construct a dataset where A beats B in all subgroups but B beats A overall.",
        starterCode: "# Create your own Simpson's paradox!\n\n# Group 1 (Easy)\ngroup1_A = {'success': 9, 'total': 10}   # 90%\ngroup1_B = {'success': 70, 'total': 80}  # 87.5%\n\n# Group 2 (Hard)  \ngroup2_A = {'success': 30, 'total': 90}  # 33%\ngroup2_B = {'success': 5, 'total': 20}   # 25%\n\nprint('CONSTRUCTING SIMPSON\\'S PARADOX')\nprint('=' * 50)\n\nprint('\\n--- BY GROUP ---')\nprint(f'Group 1: A={group1_A[\"success\"]/group1_A[\"total\"]*100:.0f}%, B={group1_B[\"success\"]/group1_B[\"total\"]*100:.0f}% → A wins')\nprint(f'Group 2: A={group2_A[\"success\"]/group2_A[\"total\"]*100:.0f}%, B={group2_B[\"success\"]/group2_B[\"total\"]*100:.0f}% → A wins')\n\nprint('\\n--- COMBINED ---')\ntotal_A = group1_A['total'] + group2_A['total']\nsuccess_A = group1_A['success'] + group2_A['success']\ntotal_B = group1_B['total'] + group2_B['total']\nsuccess_B = group1_B['success'] + group2_B['success']\n\nprint(f'A overall: {success_A}/{total_A} = {success_A/total_A*100:.0f}%')\nprint(f'B overall: {success_B}/{total_B} = {success_B/total_B*100:.0f}%')\n\nif success_B/total_B > success_A/total_A:\n    print('\\n✓ Paradox achieved! B wins overall despite losing both groups!')\nelse:\n    print('\\n✗ Need to adjust numbers for paradox')",
        solution: "# Construct paradox with unequal group sizes",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Paradox shown", description: "Create paradox" }]),
        hints: ["A wins both subgroups", "B has more in easy group", "Aggregation reverses"],
        xpReward: 25,
        order: 1,
      },
      {
        lessonId: lesson21_2_3.id,
        number: 2,
        title: "Detect the Paradox",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given data, check if Simpson's paradox is present.",
        starterCode: "def check_simpsons_paradox(data):\n    \"\"\"Check if aggregation reverses subgroup trends\"\"\"\n    # Calculate subgroup rates\n    subgroup_winners = []\n    for group_name, group_data in data['subgroups'].items():\n        rate_A = group_data['A']['success'] / group_data['A']['total']\n        rate_B = group_data['B']['success'] / group_data['B']['total']\n        winner = 'A' if rate_A > rate_B else 'B'\n        subgroup_winners.append(winner)\n        print(f'{group_name}: A={rate_A:.1%}, B={rate_B:.1%} → {winner} wins')\n    \n    # Calculate aggregate\n    total_A_success = sum(g['A']['success'] for g in data['subgroups'].values())\n    total_A = sum(g['A']['total'] for g in data['subgroups'].values())\n    total_B_success = sum(g['B']['success'] for g in data['subgroups'].values())\n    total_B = sum(g['B']['total'] for g in data['subgroups'].values())\n    \n    rate_A_overall = total_A_success / total_A\n    rate_B_overall = total_B_success / total_B\n    overall_winner = 'A' if rate_A_overall > rate_B_overall else 'B'\n    \n    print(f'\\nOverall: A={rate_A_overall:.1%}, B={rate_B_overall:.1%} → {overall_winner} wins')\n    \n    # Check for paradox\n    if all(w == 'A' for w in subgroup_winners) and overall_winner == 'B':\n        return True\n    if all(w == 'B' for w in subgroup_winners) and overall_winner == 'A':\n        return True\n    return False\n\ndata = {\n    'subgroups': {\n        'Young': {'A': {'success': 80, 'total': 100}, 'B': {'success': 180, 'total': 250}},\n        'Old': {'A': {'success': 120, 'total': 400}, 'B': {'success': 30, 'total': 100}},\n    }\n}\n\nprint('SIMPSON\\'S PARADOX DETECTOR')\nprint('=' * 50)\nparadox = check_simpsons_paradox(data)\nprint(f'\\nSimpson\\'s Paradox present: {\"YES!\" if paradox else \"No\"}')",
        solution: "# Detect paradox automatically",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Paradox detected", description: "Detect paradox" }]),
        hints: ["Compare subgroup winners", "Compare aggregate winner", "Paradox if reversed"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson21_2_3.id,
        number: 3,
        title: "Explain the Paradox",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "For a given Simpson's paradox, explain what causes it.",
        starterCode: "# Hospital mortality data\n\nhospital_A = {\n    'mild': {'patients': 800, 'deaths': 8},    # 1%\n    'severe': {'patients': 200, 'deaths': 40}   # 20%\n}\n\nhospital_B = {\n    'mild': {'patients': 200, 'deaths': 4},     # 2%\n    'severe': {'patients': 800, 'deaths': 120}  # 15%\n}\n\nprint('EXPLAINING SIMPSON\\'S PARADOX')\nprint('=' * 55)\n\nprint('\\n--- BY SEVERITY ---')\nfor severity in ['mild', 'severe']:\n    rate_A = hospital_A[severity]['deaths'] / hospital_A[severity]['patients']\n    rate_B = hospital_B[severity]['deaths'] / hospital_B[severity]['patients']\n    better = 'A' if rate_A < rate_B else 'B'\n    print(f'{severity.capitalize()}: A={rate_A:.1%}, B={rate_B:.1%} → {better} better')\n\nprint('\\n--- OVERALL ---')\ntotal_A = sum(d['patients'] for d in hospital_A.values())\ndeaths_A = sum(d['deaths'] for d in hospital_A.values())\ntotal_B = sum(d['patients'] for d in hospital_B.values())\ndeaths_B = sum(d['deaths'] for d in hospital_B.values())\n\nprint(f'Hospital A: {deaths_A}/{total_A} = {deaths_A/total_A:.1%} mortality')\nprint(f'Hospital B: {deaths_B}/{total_B} = {deaths_B/total_B:.1%} mortality')\n\nprint('\\n--- EXPLANATION ---')\npct_severe_A = hospital_A['severe']['patients'] / total_A\npct_severe_B = hospital_B['severe']['patients'] / total_B\nprint(f'Hospital A: {pct_severe_A:.0%} severe cases')\nprint(f'Hospital B: {pct_severe_B:.0%} severe cases')\nprint(f'\\nHospital B treats MORE severe patients!')\nprint('This confounding variable explains the paradox.')",
        solution: "# Confounding variable explains paradox",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Explanation given", description: "Explain paradox" }]),
        hints: ["Find the confounder", "Check group proportions", "Explain allocation difference"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson21_2_3.id,
        number: 4,
        title: "Should You Aggregate?",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Determine when to use aggregated vs subgroup data.",
        starterCode: "scenarios = [\n    {\n        'question': 'Which hospital should I go to?',\n        'use_subgroups': True,\n        'reason': 'Your case is either mild or severe, not both. Compare your specific category.'\n    },\n    {\n        'question': 'Which hospital has better overall outcomes?',\n        'use_subgroups': False,\n        'reason': 'Overall comparison is appropriate if patient mix is similar.'\n    },\n    {\n        'question': 'Which treatment is more effective?',\n        'use_subgroups': True,\n        'reason': 'Confounding (severity) affects treatment assignment. Control for it.'\n    },\n    {\n        'question': 'Did discrimination affect admissions?',\n        'use_subgroups': True,\n        'reason': 'Compare within departments to control for different application rates.'\n    },\n]\n\nprint('WHEN TO AGGREGATE vs SEPARATE')\nprint('=' * 60)\n\nfor s in scenarios:\n    print(f'\\nQuestion: \"{s[\"question\"]}\"')\n    print(f'Use: {\"SUBGROUPS\" if s[\"use_subgroups\"] else \"AGGREGATED\"}')\n    print(f'Reason: {s[\"reason\"]}')",
        solution: "# Decision depends on question",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Guidance shown", description: "When to aggregate" }]),
        hints: ["Consider your specific situation", "Is there a confounder?", "What question are you answering?"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson21_2_3.id,
        number: 5,
        title: "Real-World Simpson's Paradox",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Find Simpson's paradox in a realistic dataset.",
        starterCode: "# Exercise effectiveness data\n# Paradox: Exercise looks bad overall but good in both age groups!\n\ndata = {\n    'young': {\n        'exercisers': {'health_score': 85, 'n': 200},\n        'non_exercisers': {'health_score': 80, 'n': 100},\n    },\n    'old': {\n        'exercisers': {'health_score': 60, 'n': 50},\n        'non_exercisers': {'health_score': 55, 'n': 200},\n    }\n}\n\nprint('REAL-WORLD SIMPSON\\'S PARADOX')\nprint('=' * 55)\nprint('Does exercise improve health?')\n\nprint('\\n--- BY AGE GROUP ---')\nfor age in ['young', 'old']:\n    ex_score = data[age]['exercisers']['health_score']\n    non_score = data[age]['non_exercisers']['health_score']\n    print(f'{age.capitalize()}: Exercisers={ex_score}, Non={non_score} → Exercise helps!')\n\nprint('\\n--- OVERALL (AGGREGATED) ---')\n# Weighted average\nex_total = sum(d['exercisers']['n'] for d in data.values())\nex_weighted = sum(d['exercisers']['health_score'] * d['exercisers']['n'] for d in data.values()) / ex_total\nnon_total = sum(d['non_exercisers']['n'] for d in data.values())\nnon_weighted = sum(d['non_exercisers']['health_score'] * d['non_exercisers']['n'] for d in data.values()) / non_total\n\nprint(f'Exercisers avg: {ex_weighted:.1f}')\nprint(f'Non-exercisers avg: {non_weighted:.1f}')\nif ex_weighted < non_weighted:\n    print('→ Exercise looks BAD overall!?')\n\nprint('\\n--- EXPLANATION ---')\npct_young_ex = data['young']['exercisers']['n'] / ex_total\npct_young_non = data['young']['non_exercisers']['n'] / non_total\nprint(f'Young exercisers: {pct_young_ex:.0%}')\nprint(f'Young non-exercisers: {pct_young_non:.0%}')\nprint('\\nYoung people exercise more AND are healthier anyway.')\nprint('Age is the confounding variable!')",
        solution: "# Age confounds exercise-health relationship",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Paradox explained", description: "Real-world paradox" }]),
        hints: ["Calculate subgroup effects", "Calculate aggregate", "Identify confounder"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 21.2.3`);

  console.log("\n✅ Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
