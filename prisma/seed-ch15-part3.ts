import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 3: Lessons 15.3.1-15.3.2 (R² and Residuals)...\n");

  const section15_3 = await prisma.section.findFirst({
    where: { number: 15.3 },
  });
  if (!section15_3) throw new Error("Section 15.3 not found. Run part 1 first.");

  const lesson15_3_1 = await prisma.lesson.upsert({
    where: { slug: "r-squared-goodness-fit" },
    update: {},
    create: {
      sectionId: section15_3.id,
      number: 15.31,
      title: "R-Squared: Goodness of Fit",
      slug: "r-squared-goodness-fit",
      objectives: [
        "Understand what R² measures",
        "Calculate R² from scratch",
        "Interpret R² values correctly",
        "Know limitations of R²",
      ],
      content: `# R-Squared (Coefficient of Determination)

## What R² Measures

R² tells us **how much of the variance in Y is explained by X**.

- R² = 1.0: Perfect fit (all points on line)
- R² = 0.0: No linear relationship
- R² = 0.8: 80% of variance explained

## The Formula

**R² = 1 - (SS_res / SS_tot)**

Where:
- SS_res = Σ(yᵢ - ŷᵢ)² (sum of squared residuals)
- SS_tot = Σ(yᵢ - ȳ)² (total sum of squares)

## Interpretation

| R² | Interpretation |
|----|----------------|
| 0.9+ | Excellent fit |
| 0.7-0.9 | Good fit |
| 0.5-0.7 | Moderate fit |
| <0.5 | Weak fit |

## Important Caveats

1. R² doesn't prove causation
2. High R² doesn't mean model is correct
3. R² can be misleading with non-linear data
4. Always visualize data, don't just trust R²`,
      codeExamples: JSON.stringify([
        {
          id: "r-squared-calc",
          title: "Calculating R²",
          code: "def calc_r_squared(x, y, slope, intercept):\n    y_mean = sum(y) / len(y)\n    \n    # Total sum of squares\n    ss_tot = sum((yi - y_mean)**2 for yi in y)\n    \n    # Residual sum of squares\n    ss_res = sum((yi - (slope*xi + intercept))**2 \n                 for xi, yi in zip(x, y))\n    \n    r_squared = 1 - (ss_res / ss_tot)\n    return r_squared\n\n# Good fit example\nx = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.9, 10.0]\n\n# Calculate regression\nx_m, y_m = sum(x)/5, sum(y)/5\nm = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y)) / sum((xi-x_m)**2 for xi in x)\nb = y_m - m * x_m\n\nr2 = calc_r_squared(x, y, m, b)\nprint(f'R² = {r2:.4f}')\nprint(f'Interpretation: {r2*100:.1f}% of variance explained')",
          description: "R² calculation from scratch",
        },
        {
          id: "compare-fits",
          title: "Comparing Good vs Bad Fits",
          code: "def linear_reg(x, y):\n    n = len(x)\n    x_m, y_m = sum(x)/n, sum(y)/n\n    num = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y))\n    den = sum((xi-x_m)**2 for xi in x)\n    return num/den, y_m - (num/den)*x_m\n\ndef r_squared(x, y, m, b):\n    y_m = sum(y)/len(y)\n    ss_tot = sum((yi-y_m)**2 for yi in y)\n    ss_res = sum((yi-(m*xi+b))**2 for xi,yi in zip(x,y))\n    return 1 - ss_res/ss_tot\n\n# Good fit (linear data)\nx1 = [1,2,3,4,5]\ny1 = [2,4,6,8,10]\nm1, b1 = linear_reg(x1, y1)\nr2_1 = r_squared(x1, y1, m1, b1)\n\n# Bad fit (scattered data)\nx2 = [1,2,3,4,5]\ny2 = [5,2,8,3,7]\nm2, b2 = linear_reg(x2, y2)\nr2_2 = r_squared(x2, y2, m2, b2)\n\nprint(f'Good fit: R² = {r2_1:.4f}')\nprint(f'Bad fit:  R² = {r2_2:.4f}')",
          description: "R² distinguishes good from bad fits",
        },
        {
          id: "r-squared-meaning",
          title: "What R² Really Means",
          code: "import random\n\n# Create data with known R²\ndef create_data(n, noise_level):\n    x = list(range(1, n+1))\n    y = [2*xi + random.gauss(0, noise_level) for xi in x]\n    return x, y\n\nprint('Noise Level vs R²:')\nfor noise in [0.1, 1, 3, 5, 10]:\n    x, y = create_data(20, noise)\n    \n    # Regression\n    x_m, y_m = sum(x)/len(x), sum(y)/len(y)\n    m = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y)) / sum((xi-x_m)**2 for xi in x)\n    b = y_m - m * x_m\n    \n    # R²\n    ss_tot = sum((yi-y_m)**2 for yi in y)\n    ss_res = sum((yi-(m*xi+b))**2 for xi,yi in zip(x,y))\n    r2 = 1 - ss_res/ss_tot\n    \n    print(f'  Noise={noise:4.1f}: R² = {r2:.3f}')\n\nprint('\\nMore noise = lower R²')",
          description: "R² reflects signal vs noise",
        },
      ]),
      keyPoints: [
        "R² = proportion of variance explained by model",
        "R² = 1 - (SS_residual / SS_total)",
        "R² ranges from 0 (no fit) to 1 (perfect fit)",
        "R² > 0.7 generally indicates good fit",
        "High R² doesn't prove causation",
        "Always visualize data alongside R²",
      ],
      hardwareDemo: "Watch SS_tot and SS_res accumulate. See division and subtraction for R².",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson15_3_1.number}: ${lesson15_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson15_3_1.id,
        number: 1,
        title: "Calculate SS_tot",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "For y = [2, 4, 6, 8, 10] with mean ȳ = 6, calculate SS_tot = Σ(yᵢ - ȳ)².",
        starterCode: "y = [2, 4, 6, 8, 10]\ny_mean = 6\n\nss_tot = sum((yi - y_mean)**2 for yi in y)\n\nprint(f'y values: {y}')\nprint(f'y mean: {y_mean}')\nprint(f'\\nDeviations: {[yi - y_mean for yi in y]}')\nprint(f'Squared: {[(yi - y_mean)**2 for yi in y]}')\nprint(f'SS_tot = {ss_tot}')",
        solution: "y = [2, 4, 6, 8, 10]\ny_mean = 6\n\nss_tot = sum((yi - y_mean)**2 for yi in y)\n\nprint(f'y values: {y}')\nprint(f'y mean: {y_mean}')\nprint(f'\\nDeviations: {[yi - y_mean for yi in y]}')\nprint(f'Squared: {[(yi - y_mean)**2 for yi in y]}')\nprint(f'SS_tot = {ss_tot}')\nprint('\\nSS_tot measures total variance in y')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "SS_tot = 40", description: "Correct total sum of squares" }]),
        hints: ["Subtract mean from each y", "Square each deviation", "Sum all squared deviations"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson15_3_1.id,
        number: 2,
        title: "Calculate SS_res",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "For line y = 2x + 0 with data x=[1,2,3,4,5], y=[2.1, 3.9, 6.1, 7.9, 10.0], calculate SS_res.",
        starterCode: "x = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.9, 10.0]\nm, b = 2, 0  # Line: y = 2x\n\nprint('x   y_actual  y_pred  residual  squared')\nss_res = 0\nfor xi, yi in zip(x, y):\n    y_pred = m * xi + b\n    resid = yi - y_pred\n    sq = resid ** 2\n    ss_res += sq\n    print(f'{xi}   {yi:6.1f}    {y_pred:5.1f}    {resid:+.1f}      {sq:.2f}')\n\nprint(f'\\nSS_res = {ss_res:.2f}')",
        solution: "x = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.9, 10.0]\nm, b = 2, 0\n\nprint('x   y_actual  y_pred  residual  squared')\nss_res = 0\nfor xi, yi in zip(x, y):\n    y_pred = m * xi + b\n    resid = yi - y_pred\n    sq = resid ** 2\n    ss_res += sq\n    print(f'{xi}   {yi:6.1f}    {y_pred:5.1f}    {resid:+.1f}      {sq:.2f}')\n\nprint(f'\\nSS_res = {ss_res:.2f}')\nprint('SS_res measures unexplained variance')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "SS_res = 0.04", description: "Very small residuals" }]),
        hints: ["Predict y for each x using line", "Residual = actual - predicted", "Square and sum residuals"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson15_3_1.id,
        number: 3,
        title: "Calculate R²",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given SS_tot = 40 and SS_res = 2, calculate R². What percentage of variance is explained?",
        starterCode: "ss_tot = 40\nss_res = 2\n\nr_squared = 1 - (ss_res / ss_tot)\n\nprint(f'SS_tot = {ss_tot}')\nprint(f'SS_res = {ss_res}')\nprint(f'R² = 1 - {ss_res}/{ss_tot} = {r_squared:.2f}')\nprint(f'\\n{r_squared*100:.0f}% of variance explained')",
        solution: "ss_tot = 40\nss_res = 2\n\nr_squared = 1 - (ss_res / ss_tot)\n\nprint(f'SS_tot = {ss_tot}')\nprint(f'SS_res = {ss_res}')\nprint(f'R² = 1 - {ss_res}/{ss_tot} = {r_squared:.2f}')\nprint(f'\\n{r_squared*100:.0f}% of variance explained')\nprint('This is an excellent fit!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "R² = 0.95", description: "Correct R² calculation" }]),
        hints: ["R² = 1 - (SS_res / SS_tot)", "2/40 = 0.05", "1 - 0.05 = 0.95"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson15_3_1.id,
        number: 4,
        title: "Complete R² Function",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write function calc_r_squared(x, y, slope, intercept) and test on x=[1,2,3,4,5], y=[2.2, 4.1, 5.9, 8.0, 10.0] with line y=2x.",
        starterCode: "def calc_r_squared(x, y, slope, intercept):\n    y_mean = sum(y) / len(y)\n    \n    ss_tot = sum((yi - y_mean)**2 for yi in y)\n    ss_res = sum((yi - (slope*xi + intercept))**2 \n                 for xi, yi in zip(x, y))\n    \n    return 1 - (ss_res / ss_tot)\n\nx = [1, 2, 3, 4, 5]\ny = [2.2, 4.1, 5.9, 8.0, 10.0]\nm, b = 2, 0\n\nr2 = calc_r_squared(x, y, m, b)\nprint(f'R² = {r2:.4f}')\nprint(f'Fit quality: {\"Excellent\" if r2 > 0.9 else \"Good\" if r2 > 0.7 else \"Moderate\"}')",
        solution: "def calc_r_squared(x, y, slope, intercept):\n    y_mean = sum(y) / len(y)\n    \n    ss_tot = sum((yi - y_mean)**2 for yi in y)\n    ss_res = sum((yi - (slope*xi + intercept))**2 \n                 for xi, yi in zip(x, y))\n    \n    return 1 - (ss_res / ss_tot)\n\nx = [1, 2, 3, 4, 5]\ny = [2.2, 4.1, 5.9, 8.0, 10.0]\nm, b = 2, 0\n\nr2 = calc_r_squared(x, y, m, b)\nprint(f'R² = {r2:.4f}')\nprint(f'Fit quality: {\"Excellent\" if r2 > 0.9 else \"Good\" if r2 > 0.7 else \"Moderate\"}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "R² > 0.99", description: "Excellent fit" }]),
        hints: ["Calculate y_mean first", "SS_tot uses y_mean", "SS_res uses predictions"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson15_3_1.id,
        number: 5,
        title: "Compare Model Fits",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Data: x=[1,2,3,4,5], y=[3, 7, 8, 14, 18]. Calculate R² for two lines: y=3.5x-1 and y=4x-2. Which fits better?",
        starterCode: "def calc_r_squared(x, y, m, b):\n    y_mean = sum(y) / len(y)\n    ss_tot = sum((yi - y_mean)**2 for yi in y)\n    ss_res = sum((yi - (m*xi + b))**2 for xi, yi in zip(x, y))\n    return 1 - (ss_res / ss_tot)\n\nx = [1, 2, 3, 4, 5]\ny = [3, 7, 8, 14, 18]\n\n# Line 1: y = 3.5x - 1\nr2_1 = calc_r_squared(x, y, 3.5, -1)\n\n# Line 2: y = 4x - 2\nr2_2 = calc_r_squared(x, y, 4, -2)\n\nprint(f'Line 1 (y = 3.5x - 1): R² = {r2_1:.4f}')\nprint(f'Line 2 (y = 4x - 2):   R² = {r2_2:.4f}')\nprint(f'\\nBetter fit: Line {1 if r2_1 > r2_2 else 2}')",
        solution: "def calc_r_squared(x, y, m, b):\n    y_mean = sum(y) / len(y)\n    ss_tot = sum((yi - y_mean)**2 for yi in y)\n    ss_res = sum((yi - (m*xi + b))**2 for xi, yi in zip(x, y))\n    return 1 - (ss_res / ss_tot)\n\nx = [1, 2, 3, 4, 5]\ny = [3, 7, 8, 14, 18]\n\nr2_1 = calc_r_squared(x, y, 3.5, -1)\nr2_2 = calc_r_squared(x, y, 4, -2)\n\nprint(f'Line 1 (y = 3.5x - 1): R² = {r2_1:.4f}')\nprint(f'Line 2 (y = 4x - 2):   R² = {r2_2:.4f}')\nprint(f'\\nBetter fit: Line {1 if r2_1 > r2_2 else 2}')\nprint('Higher R² = better fit!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Comparison shows which fits better", description: "Model comparison" }]),
        hints: ["Calculate R² for each line", "Higher R² = better fit", "Compare the two values"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 15.3.1`);

  const lesson15_3_2 = await prisma.lesson.upsert({
    where: { slug: "residual-analysis" },
    update: {},
    create: {
      sectionId: section15_3.id,
      number: 15.32,
      title: "Residual Analysis",
      slug: "residual-analysis",
      objectives: [
        "Calculate and interpret residuals",
        "Identify patterns in residuals",
        "Diagnose model problems",
        "Know when linear model is inappropriate",
      ],
      content: `# Residual Analysis

## What Are Residuals?

**Residual = Actual - Predicted** (eᵢ = yᵢ - ŷᵢ)

Residuals show how much the model misses each point.

## Good Residual Patterns

For a good linear fit:
- Residuals scatter randomly around zero
- No systematic pattern
- Roughly constant spread across x values

## Bad Residual Patterns

**Curved pattern**: Data is non-linear (need different model)
**Fan shape**: Variance increases with x (heteroscedasticity)
**Clusters**: Possible outliers or subgroups

## Residual Diagnostics

1. **Mean of residuals**: Should be ≈ 0
2. **Pattern check**: Should look random
3. **Outliers**: Large |residual| values

## Why Check Residuals?

- R² can be misleading
- Residuals reveal model assumptions violated
- Help identify outliers
- Guide model improvement`,
      codeExamples: JSON.stringify([
        {
          id: "calc-residuals",
          title: "Calculating Residuals",
          code: "def linear_reg(x, y):\n    n = len(x)\n    x_m, y_m = sum(x)/n, sum(y)/n\n    num = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y))\n    den = sum((xi-x_m)**2 for xi in x)\n    m = num/den\n    return m, y_m - m*x_m\n\nx = [1, 2, 3, 4, 5, 6, 7, 8]\ny = [2.1, 4.2, 5.8, 8.1, 9.9, 12.0, 14.1, 15.9]\n\nm, b = linear_reg(x, y)\nprint(f'Line: y = {m:.2f}x + {b:.2f}')\n\nprint('\\nx   Actual  Predicted  Residual')\nresiduals = []\nfor xi, yi in zip(x, y):\n    pred = m * xi + b\n    resid = yi - pred\n    residuals.append(resid)\n    print(f'{xi}   {yi:5.1f}    {pred:6.2f}     {resid:+.2f}')\n\nprint(f'\\nMean residual: {sum(residuals)/len(residuals):.4f}')\nprint('(Should be ≈ 0)')",
          description: "Calculate and display residuals",
        },
        {
          id: "residual-plot",
          title: "Text-Based Residual Plot",
          code: "def residual_plot(residuals):\n    \"\"\"Simple text-based residual plot\"\"\"\n    scale = max(abs(r) for r in residuals)\n    \n    print('Residual Plot (text-based):')\n    print('     |' + '-'*20 + '0' + '-'*20 + '|')\n    \n    for i, r in enumerate(residuals):\n        # Scale to -20 to +20 character positions\n        pos = int((r / scale) * 20) + 20\n        line = ' ' * 5 + '|' + ' ' * pos + '*' + ' ' * (40 - pos) + '|'\n        print(f'x={i+1}: {line} {r:+.2f}')\n\nresiduals = [0.1, -0.2, 0.15, -0.1, 0.05, -0.15, 0.1, -0.05]\nresidual_plot(residuals)\nprint('\\nGood: Random scatter around 0')",
          description: "Visualize residuals (text-based)",
        },
        {
          id: "detect-nonlinear",
          title: "Detecting Non-Linear Data",
          code: "def linear_reg(x, y):\n    n = len(x)\n    x_m, y_m = sum(x)/n, sum(y)/n\n    num = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y))\n    den = sum((xi-x_m)**2 for xi in x)\n    m = num/den\n    return m, y_m - m*x_m\n\n# Quadratic data (y = x²)\nx = [1, 2, 3, 4, 5, 6, 7, 8]\ny = [1, 4, 9, 16, 25, 36, 49, 64]  # y = x²\n\nm, b = linear_reg(x, y)\n\nprint('Fitting linear model to QUADRATIC data:')\nprint(f'Line: y = {m:.1f}x + {b:.1f}')\nprint('\\nx   Actual  Predicted  Residual')\nfor xi, yi in zip(x, y):\n    pred = m * xi + b\n    resid = yi - pred\n    print(f'{xi}   {yi:5.0f}    {pred:6.1f}     {resid:+.1f}')\n\nprint('\\nResiduals show U-shape pattern!')\nprint('This means: linear model is WRONG for this data')",
          description: "Residuals reveal non-linearity",
        },
      ]),
      keyPoints: [
        "Residual = Actual - Predicted",
        "Good fit: residuals randomly scattered around 0",
        "Pattern in residuals = model problem",
        "Mean of residuals should be ≈ 0",
        "Curved residuals = need non-linear model",
        "Always plot residuals to check model",
      ],
      hardwareDemo: "Watch residual calculations. See pattern detection in residual values.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson15_3_2.number}: ${lesson15_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson15_3_2.id,
        number: 1,
        title: "Calculate Residuals",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Line y = 3x + 1. Data: x=[1,2,3,4], y=[4.2, 6.9, 10.1, 12.8]. Calculate residual for each point.",
        starterCode: "m, b = 3, 1\nx = [1, 2, 3, 4]\ny = [4.2, 6.9, 10.1, 12.8]\n\nprint('x   Actual  Predicted  Residual')\nfor xi, yi in zip(x, y):\n    predicted = m * xi + b\n    residual = yi - predicted\n    print(f'{xi}   {yi:5.1f}    {predicted:5.1f}      {residual:+.1f}')",
        solution: "m, b = 3, 1\nx = [1, 2, 3, 4]\ny = [4.2, 6.9, 10.1, 12.8]\n\nprint('x   Actual  Predicted  Residual')\nfor xi, yi in zip(x, y):\n    predicted = m * xi + b\n    residual = yi - predicted\n    print(f'{xi}   {yi:5.1f}    {predicted:5.1f}      {residual:+.1f}')\n\nprint('\\nPositive residual = point above line')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Residuals calculated", description: "Correct residuals" }]),
        hints: ["Predicted = 3x + 1", "Residual = actual - predicted", "Positive means above line"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson15_3_2.id,
        number: 2,
        title: "Mean Residual Check",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given residuals = [0.3, -0.2, 0.1, -0.3, 0.1, -0.1, 0.2, -0.1], calculate mean. Is model unbiased (mean ≈ 0)?",
        starterCode: "residuals = [0.3, -0.2, 0.1, -0.3, 0.1, -0.1, 0.2, -0.1]\n\nmean_resid = sum(residuals) / len(residuals)\n\nprint(f'Residuals: {residuals}')\nprint(f'Mean residual: {mean_resid:.4f}')\nprint(f'\\nModel unbiased? {abs(mean_resid) < 0.1}')",
        solution: "residuals = [0.3, -0.2, 0.1, -0.3, 0.1, -0.1, 0.2, -0.1]\n\nmean_resid = sum(residuals) / len(residuals)\n\nprint(f'Residuals: {residuals}')\nprint(f'Mean residual: {mean_resid:.4f}')\nprint(f'\\nModel unbiased? {abs(mean_resid) < 0.1}')\nprint('Mean ≈ 0 indicates no systematic bias')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Mean close to 0", description: "Unbiased model" }]),
        hints: ["Mean = sum / count", "Should be close to 0", "Indicates no systematic bias"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson15_3_2.id,
        number: 3,
        title: "Identify Outlier",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Residuals = [0.1, -0.2, 0.15, 3.5, -0.1, 0.2, -0.15, 0.1]. Find outlier (|residual| > 2*std).",
        starterCode: "import statistics\n\nresiduals = [0.1, -0.2, 0.15, 3.5, -0.1, 0.2, -0.15, 0.1]\n\nmean_r = statistics.mean(residuals)\nstd_r = statistics.stdev(residuals)\n\nprint(f'Mean residual: {mean_r:.3f}')\nprint(f'Std of residuals: {std_r:.3f}')\nprint(f'Threshold: ±{2*std_r:.3f}')\n\nprint('\\nOutliers:')\nfor i, r in enumerate(residuals):\n    if abs(r - mean_r) > 2 * std_r:\n        print(f'  Point {i+1}: residual = {r}')",
        solution: "import statistics\n\nresiduals = [0.1, -0.2, 0.15, 3.5, -0.1, 0.2, -0.15, 0.1]\n\nmean_r = statistics.mean(residuals)\nstd_r = statistics.stdev(residuals)\n\nprint(f'Mean residual: {mean_r:.3f}')\nprint(f'Std of residuals: {std_r:.3f}')\nprint(f'Threshold: ±{2*std_r:.3f}')\n\nprint('\\nOutliers:')\nfor i, r in enumerate(residuals):\n    if abs(r - mean_r) > 2 * std_r:\n        print(f'  Point {i+1}: residual = {r}')\n\nprint('\\nPoint 4 (residual=3.5) is an outlier!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "3.5 identified as outlier", description: "Outlier detected" }]),
        hints: ["3.5 is much larger than others", "Use 2 std deviations as threshold", "One point is clearly different"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson15_3_2.id,
        number: 4,
        title: "Detect Non-Linear Pattern",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Fit linear model to y = x² data: x=[1,2,3,4,5], y=[1,4,9,16,25]. Look at residuals - do they show a pattern?",
        starterCode: "def linear_reg(x, y):\n    n = len(x)\n    x_m, y_m = sum(x)/n, sum(y)/n\n    num = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y))\n    den = sum((xi-x_m)**2 for xi in x)\n    m = num/den\n    return m, y_m - m*x_m\n\nx = [1, 2, 3, 4, 5]\ny = [1, 4, 9, 16, 25]  # y = x² (quadratic!)\n\nm, b = linear_reg(x, y)\nprint(f'Linear fit: y = {m:.1f}x + {b:.1f}')\n\nprint('\\nx   Actual  Predicted  Residual')\nfor xi, yi in zip(x, y):\n    pred = m * xi + b\n    resid = yi - pred\n    print(f'{xi}   {yi:5.0f}    {pred:6.1f}     {resid:+.1f}')",
        solution: "def linear_reg(x, y):\n    n = len(x)\n    x_m, y_m = sum(x)/n, sum(y)/n\n    num = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y))\n    den = sum((xi-x_m)**2 for xi in x)\n    m = num/den\n    return m, y_m - m*x_m\n\nx = [1, 2, 3, 4, 5]\ny = [1, 4, 9, 16, 25]\n\nm, b = linear_reg(x, y)\nprint(f'Linear fit: y = {m:.1f}x + {b:.1f}')\n\nprint('\\nx   Actual  Predicted  Residual')\nfor xi, yi in zip(x, y):\n    pred = m * xi + b\n    resid = yi - pred\n    print(f'{xi}   {yi:5.0f}    {pred:6.1f}     {resid:+.1f}')\n\nprint('\\nPattern: - - 0 + + (curved/U-shape)')\nprint('This indicates LINEAR model is WRONG!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "U-shaped residual pattern", description: "Non-linearity detected" }]),
        hints: ["Data is y = x² (quadratic)", "Linear model can't fit curves", "Residuals will show pattern"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson15_3_2.id,
        number: 5,
        title: "Complete Residual Analysis",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Perform full residual analysis: calculate residuals, mean, std, find outliers, check for pattern. Data: x=[1,2,3,4,5,6], y=[2.1, 4.0, 5.9, 8.2, 9.8, 12.1].",
        starterCode: "import statistics\n\ndef linear_reg(x, y):\n    n = len(x)\n    x_m, y_m = sum(x)/n, sum(y)/n\n    num = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y))\n    den = sum((xi-x_m)**2 for xi in x)\n    m = num/den\n    return m, y_m - m*x_m\n\nx = [1, 2, 3, 4, 5, 6]\ny = [2.1, 4.0, 5.9, 8.2, 9.8, 12.1]\n\nm, b = linear_reg(x, y)\nprint(f'Model: y = {m:.2f}x + {b:.2f}')\n\n# Calculate residuals\nresiduals = [yi - (m*xi + b) for xi, yi in zip(x, y)]\n\nprint('\\nResidual Analysis:')\nprint(f'  Residuals: {[round(r, 2) for r in residuals]}')\nprint(f'  Mean: {statistics.mean(residuals):.4f}')\nprint(f'  Std: {statistics.stdev(residuals):.4f}')\n\n# Check for outliers\nprint('\\nOutliers (|r| > 2*std): ', end='')\nstd_r = statistics.stdev(residuals)\noutliers = [r for r in residuals if abs(r) > 2*std_r]\nprint(outliers if outliers else 'None')",
        solution: "import statistics\n\ndef linear_reg(x, y):\n    n = len(x)\n    x_m, y_m = sum(x)/n, sum(y)/n\n    num = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y))\n    den = sum((xi-x_m)**2 for xi in x)\n    m = num/den\n    return m, y_m - m*x_m\n\nx = [1, 2, 3, 4, 5, 6]\ny = [2.1, 4.0, 5.9, 8.2, 9.8, 12.1]\n\nm, b = linear_reg(x, y)\nprint(f'Model: y = {m:.2f}x + {b:.2f}')\n\nresiduals = [yi - (m*xi + b) for xi, yi in zip(x, y)]\n\nprint('\\nResidual Analysis:')\nprint(f'  Residuals: {[round(r, 2) for r in residuals]}')\nprint(f'  Mean: {statistics.mean(residuals):.4f}')\nprint(f'  Std: {statistics.stdev(residuals):.4f}')\n\nprint('\\nOutliers (|r| > 2*std): ', end='')\nstd_r = statistics.stdev(residuals)\noutliers = [r for r in residuals if abs(r) > 2*std_r]\nprint(outliers if outliers else 'None')\n\nprint('\\nConclusion: Good fit - random residuals, no outliers')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Complete analysis", description: "Full residual analysis" }]),
        hints: ["Calculate residuals first", "Check mean ≈ 0", "Look for patterns or outliers"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 15.3.2`);

  console.log("\n✅ Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
