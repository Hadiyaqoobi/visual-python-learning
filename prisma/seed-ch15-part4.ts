import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 4: Lesson 15.3.3 (Making Predictions)...\n");

  const section15_3 = await prisma.section.findFirst({
    where: { number: 15.3 },
  });
  if (!section15_3) throw new Error("Section 15.3 not found. Run part 1 first.");

  const lesson15_3_3 = await prisma.lesson.upsert({
    where: { slug: "predictions-with-regression" },
    update: {},
    create: {
      sectionId: section15_3.id,
      number: 15.33,
      title: "Making Predictions with Regression",
      slug: "predictions-with-regression",
      objectives: [
        "Use regression models for prediction",
        "Understand interpolation vs extrapolation",
        "Assess prediction reliability",
        "Apply regression to real problems",
      ],
      content: `# Making Predictions with Regression

## Using the Model

Once we have y = mx + b, prediction is simple:

\`\`\`python
y_predicted = slope * x_new + intercept
\`\`\`

## Interpolation vs Extrapolation

**Interpolation**: Predicting within the range of training data
- x_new is between min(x) and max(x)
- Generally reliable

**Extrapolation**: Predicting outside the training range
- x_new < min(x) or x_new > max(x)
- More uncertain - relationship may not hold

## Prediction Confidence

Predictions are more reliable when:
- R² is high (model fits well)
- Predicting within data range (interpolation)
- Training data is representative
- Residuals show no pattern

## Real-World Applications

- **Physics**: Predict force from mass (Hooke's Law)
- **Business**: Predict sales from advertising
- **Science**: Predict temperature from elevation
- **Medicine**: Predict dosage from weight

## Complete Workflow

1. Collect and clean data
2. Fit regression model
3. Evaluate fit (R², residuals)
4. Make predictions
5. Report with appropriate uncertainty`,
      codeExamples: JSON.stringify([
        {
          id: "basic-prediction",
          title: "Basic Prediction",
          code: "def linear_reg(x, y):\n    n = len(x)\n    x_m, y_m = sum(x)/n, sum(y)/n\n    num = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y))\n    den = sum((xi-x_m)**2 for xi in x)\n    m = num/den\n    return m, y_m - m*x_m\n\n# Training data: hours studied vs test score\nhours = [1, 2, 3, 4, 5, 6]\nscores = [52, 58, 65, 72, 78, 85]\n\nm, b = linear_reg(hours, scores)\nprint(f'Model: score = {m:.1f} × hours + {b:.1f}')\n\n# Predict for new values\nprint('\\nPredictions:')\nfor h in [3.5, 7, 10]:\n    pred = m * h + b\n    in_range = 1 <= h <= 6\n    print(f'  {h} hours: {pred:.1f} ({\"interpolation\" if in_range else \"extrapolation\"})')",
          description: "Make predictions and identify extrapolation",
        },
        {
          id: "complete-analysis",
          title: "Complete Regression Analysis",
          code: "def linear_reg(x, y):\n    n = len(x)\n    x_m, y_m = sum(x)/n, sum(y)/n\n    num = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y))\n    den = sum((xi-x_m)**2 for xi in x)\n    m = num/den\n    return m, y_m - m*x_m\n\ndef r_squared(x, y, m, b):\n    y_m = sum(y)/len(y)\n    ss_tot = sum((yi-y_m)**2 for yi in y)\n    ss_res = sum((yi-(m*xi+b))**2 for xi,yi in zip(x,y))\n    return 1 - ss_res/ss_tot\n\n# Data: ad spend ($k) vs sales ($k)\nad = [10, 20, 30, 40, 50]\nsales = [95, 120, 140, 165, 190]\n\nm, b = linear_reg(ad, sales)\nr2 = r_squared(ad, sales, m, b)\n\nprint('=== Regression Analysis ===')\nprint(f'Model: Sales = {m:.2f} × Ad_Spend + {b:.2f}')\nprint(f'R² = {r2:.4f} ({r2*100:.1f}% variance explained)')\n\nprint(f'\\nInterpretation:')\nprint(f'  Each $1k in ads → ${m:.0f}k more sales')\nprint(f'  Base sales: ${b:.0f}k')\n\nprint(f'\\nPredict for $60k ad spend:')\npred = m * 60 + b\nprint(f'  Expected sales: ${pred:.0f}k')",
          description: "Full analysis with interpretation",
        },
        {
          id: "hookes-law-complete",
          title: "Hooke's Law: Complete Example",
          code: "def linear_reg(x, y):\n    n = len(x)\n    x_m, y_m = sum(x)/n, sum(y)/n\n    num = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y))\n    den = sum((xi-x_m)**2 for xi in x)\n    m = num/den\n    return m, y_m - m*x_m\n\ndef r_squared(x, y, m, b):\n    y_m = sum(y)/len(y)\n    ss_tot = sum((yi-y_m)**2 for yi in y)\n    ss_res = sum((yi-(m*xi+b))**2 for xi,yi in zip(x,y))\n    return 1 - ss_res/ss_tot\n\n# Hooke's Law experiment\nmass = [0, 50, 100, 150, 200, 250]  # grams\nextension = [0, 1.2, 2.5, 3.7, 5.0, 6.2]  # cm\n\nm, b = linear_reg(mass, extension)\nr2 = r_squared(mass, extension, m, b)\n\nprint('=== Hooke\\'s Law Analysis ===')\nprint(f'Extension = {m:.5f} × Mass + {b:.2f}')\nprint(f'R² = {r2:.6f}')\n\nspring_constant = 1/m  # g/cm\nprint(f'\\nSpring constant: {spring_constant:.1f} g/cm')\n\nprint(f'\\nPredict extension for 300g:')\npred = m * 300 + b\nprint(f'  {pred:.2f} cm (extrapolation - may exceed elastic limit!)')",
          description: "Real physics application",
        },
      ]),
      keyPoints: [
        "Predict: y = slope × x_new + intercept",
        "Interpolation (within range) is more reliable",
        "Extrapolation (outside range) has more uncertainty",
        "Always report R² with predictions",
        "Interpret slope and intercept in context",
        "Check residuals before trusting predictions",
      ],
      hardwareDemo: "Watch prediction calculation. See comparison of new x to training range.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson15_3_3.number}: ${lesson15_3_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson15_3_3.id,
        number: 1,
        title: "Simple Prediction",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Model: y = 2.5x + 10. Predict y for x = 4, 8, and 12.",
        starterCode: "m = 2.5\nb = 10\n\nprint('Model: y = 2.5x + 10')\nprint('\\nPredictions:')\nfor x in [4, 8, 12]:\n    y = m * x + b\n    print(f'  x = {x}: y = {y}')",
        solution: "m = 2.5\nb = 10\n\nprint('Model: y = 2.5x + 10')\nprint('\\nPredictions:')\nfor x in [4, 8, 12]:\n    y = m * x + b\n    print(f'  x = {x}: y = {y}')\n\nprint('\\nSimple: just plug x into the equation!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "x=4: y=20, x=8: y=30, x=12: y=40", description: "Correct predictions" }]),
        hints: ["y = 2.5 × x + 10", "x=4: 2.5×4 + 10 = 20", "Just plug in each x value"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson15_3_3.id,
        number: 2,
        title: "Interpolation vs Extrapolation",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Training data: x=[10,20,30,40,50]. For predictions at x=25, 55, 5 - identify which are interpolation and which are extrapolation.",
        starterCode: "x_train = [10, 20, 30, 40, 50]\nx_min, x_max = min(x_train), max(x_train)\n\nprint(f'Training range: {x_min} to {x_max}')\nprint('\\nClassification:')\n\nfor x_new in [25, 55, 5]:\n    if x_min <= x_new <= x_max:\n        pred_type = 'Interpolation (within range)'\n    else:\n        pred_type = 'Extrapolation (outside range)'\n    print(f'  x = {x_new}: {pred_type}')",
        solution: "x_train = [10, 20, 30, 40, 50]\nx_min, x_max = min(x_train), max(x_train)\n\nprint(f'Training range: {x_min} to {x_max}')\nprint('\\nClassification:')\n\nfor x_new in [25, 55, 5]:\n    if x_min <= x_new <= x_max:\n        pred_type = 'Interpolation (within range)'\n    else:\n        pred_type = 'Extrapolation (outside range)'\n    print(f'  x = {x_new}: {pred_type}')\n\nprint('\\nInterpolation is more reliable!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "25=interp, 55=extrap, 5=extrap", description: "Correct classification" }]),
        hints: ["Range is 10 to 50", "25 is within range", "55 and 5 are outside range"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson15_3_3.id,
        number: 3,
        title: "Predict with Confidence",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Build regression from x=[1,2,3,4,5], y=[5.1,7.0,9.2,10.8,13.1]. Calculate R². Predict for x=3 and x=10. Which prediction is more trustworthy?",
        starterCode: "def linear_reg(x, y):\n    n = len(x)\n    x_m, y_m = sum(x)/n, sum(y)/n\n    num = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y))\n    den = sum((xi-x_m)**2 for xi in x)\n    m = num/den\n    return m, y_m - m*x_m\n\ndef r_squared(x, y, m, b):\n    y_m = sum(y)/len(y)\n    ss_tot = sum((yi-y_m)**2 for yi in y)\n    ss_res = sum((yi-(m*xi+b))**2 for xi,yi in zip(x,y))\n    return 1 - ss_res/ss_tot\n\nx = [1, 2, 3, 4, 5]\ny = [5.1, 7.0, 9.2, 10.8, 13.1]\n\nm, b = linear_reg(x, y)\nr2 = r_squared(x, y, m, b)\n\nprint(f'Model: y = {m:.2f}x + {b:.2f}')\nprint(f'R² = {r2:.4f}')\n\nprint(f'\\nPrediction at x=3: {m*3+b:.2f} (interpolation)')\nprint(f'Prediction at x=10: {m*10+b:.2f} (extrapolation)')",
        solution: "def linear_reg(x, y):\n    n = len(x)\n    x_m, y_m = sum(x)/n, sum(y)/n\n    num = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y))\n    den = sum((xi-x_m)**2 for xi in x)\n    m = num/den\n    return m, y_m - m*x_m\n\ndef r_squared(x, y, m, b):\n    y_m = sum(y)/len(y)\n    ss_tot = sum((yi-y_m)**2 for yi in y)\n    ss_res = sum((yi-(m*xi+b))**2 for xi,yi in zip(x,y))\n    return 1 - ss_res/ss_tot\n\nx = [1, 2, 3, 4, 5]\ny = [5.1, 7.0, 9.2, 10.8, 13.1]\n\nm, b = linear_reg(x, y)\nr2 = r_squared(x, y, m, b)\n\nprint(f'Model: y = {m:.2f}x + {b:.2f}')\nprint(f'R² = {r2:.4f}')\n\nprint(f'\\nPrediction at x=3: {m*3+b:.2f} (interpolation)')\nprint(f'Prediction at x=10: {m*10+b:.2f} (extrapolation)')\nprint('\\nx=3 prediction is more trustworthy (interpolation)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "x=3 is interpolation, more reliable", description: "Confidence assessment" }]),
        hints: ["x=3 is within training range (1-5)", "x=10 is outside range", "Interpolation is more reliable"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson15_3_3.id,
        number: 4,
        title: "Business Prediction",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Marketing data: spend ($k)=[5,10,15,20,25], revenue ($k)=[42,55,67,82,95]. Build model, interpret slope, predict revenue for $30k spend.",
        starterCode: "def linear_reg(x, y):\n    n = len(x)\n    x_m, y_m = sum(x)/n, sum(y)/n\n    num = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y))\n    den = sum((xi-x_m)**2 for xi in x)\n    m = num/den\n    return m, y_m - m*x_m\n\ndef r_squared(x, y, m, b):\n    y_m = sum(y)/len(y)\n    ss_tot = sum((yi-y_m)**2 for yi in y)\n    ss_res = sum((yi-(m*xi+b))**2 for xi,yi in zip(x,y))\n    return 1 - ss_res/ss_tot\n\nspend = [5, 10, 15, 20, 25]\nrevenue = [42, 55, 67, 82, 95]\n\nm, b = linear_reg(spend, revenue)\nr2 = r_squared(spend, revenue, m, b)\n\nprint('=== Marketing Analysis ===')\nprint(f'Revenue = {m:.2f} × Spend + {b:.2f}')\nprint(f'R² = {r2:.4f}')\n\nprint(f'\\nInterpretation:')\nprint(f'  Each $1k spent → ${m:.2f}k revenue')\nprint(f'  ROI: ${m:.2f} per $1 spent')\n\npred_30 = m * 30 + b\nprint(f'\\nPredict $30k spend: ${pred_30:.1f}k revenue')",
        solution: "def linear_reg(x, y):\n    n = len(x)\n    x_m, y_m = sum(x)/n, sum(y)/n\n    num = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y))\n    den = sum((xi-x_m)**2 for xi in x)\n    m = num/den\n    return m, y_m - m*x_m\n\ndef r_squared(x, y, m, b):\n    y_m = sum(y)/len(y)\n    ss_tot = sum((yi-y_m)**2 for yi in y)\n    ss_res = sum((yi-(m*xi+b))**2 for xi,yi in zip(x,y))\n    return 1 - ss_res/ss_tot\n\nspend = [5, 10, 15, 20, 25]\nrevenue = [42, 55, 67, 82, 95]\n\nm, b = linear_reg(spend, revenue)\nr2 = r_squared(spend, revenue, m, b)\n\nprint('=== Marketing Analysis ===')\nprint(f'Revenue = {m:.2f} × Spend + {b:.2f}')\nprint(f'R² = {r2:.4f}')\n\nprint(f'\\nInterpretation:')\nprint(f'  Each $1k spent → ${m:.2f}k revenue')\nprint(f'  ROI: ${m:.2f} per $1 spent')\n\npred_30 = m * 30 + b\nprint(f'\\nPredict $30k spend: ${pred_30:.1f}k revenue')\nprint('(Note: slight extrapolation beyond $25k data)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Model with ROI interpretation", description: "Business application" }]),
        hints: ["Slope is revenue per dollar spent", "This is the ROI", "$30k is slight extrapolation"],
        xpReward: 25,
        order: 4,
      },
      {
        lessonId: lesson15_3_3.id,
        number: 5,
        title: "Complete Analysis Pipeline",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Full pipeline: Data x=[2,4,6,8,10,12], y=[8.5,15.2,22.1,28.8,36.0,42.5]. (1) Fit model, (2) Calculate R², (3) Check residuals, (4) Predict for x=7 and x=20.",
        starterCode: "def linear_reg(x, y):\n    n = len(x)\n    x_m, y_m = sum(x)/n, sum(y)/n\n    num = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y))\n    den = sum((xi-x_m)**2 for xi in x)\n    m = num/den\n    return m, y_m - m*x_m\n\ndef r_squared(x, y, m, b):\n    y_m = sum(y)/len(y)\n    ss_tot = sum((yi-y_m)**2 for yi in y)\n    ss_res = sum((yi-(m*xi+b))**2 for xi,yi in zip(x,y))\n    return 1 - ss_res/ss_tot\n\nx = [2, 4, 6, 8, 10, 12]\ny = [8.5, 15.2, 22.1, 28.8, 36.0, 42.5]\n\n# 1. Fit model\nm, b = linear_reg(x, y)\nprint(f'1. Model: y = {m:.2f}x + {b:.2f}')\n\n# 2. R²\nr2 = r_squared(x, y, m, b)\nprint(f'2. R² = {r2:.4f} ({\"Excellent\" if r2>0.95 else \"Good\"})')\n\n# 3. Residuals\nresiduals = [yi - (m*xi + b) for xi, yi in zip(x, y)]\nprint(f'3. Residuals: {[round(r,2) for r in residuals]}')\nprint(f'   Mean residual: {sum(residuals)/len(residuals):.4f}')\n\n# 4. Predictions\nprint(f'4. Predictions:')\nfor x_new in [7, 20]:\n    pred = m * x_new + b\n    ptype = 'interp' if 2 <= x_new <= 12 else 'extrap'\n    print(f'   x={x_new}: y={pred:.1f} ({ptype})')",
        solution: "def linear_reg(x, y):\n    n = len(x)\n    x_m, y_m = sum(x)/n, sum(y)/n\n    num = sum((xi-x_m)*(yi-y_m) for xi,yi in zip(x,y))\n    den = sum((xi-x_m)**2 for xi in x)\n    m = num/den\n    return m, y_m - m*x_m\n\ndef r_squared(x, y, m, b):\n    y_m = sum(y)/len(y)\n    ss_tot = sum((yi-y_m)**2 for yi in y)\n    ss_res = sum((yi-(m*xi+b))**2 for xi,yi in zip(x,y))\n    return 1 - ss_res/ss_tot\n\nx = [2, 4, 6, 8, 10, 12]\ny = [8.5, 15.2, 22.1, 28.8, 36.0, 42.5]\n\nm, b = linear_reg(x, y)\nprint(f'1. Model: y = {m:.2f}x + {b:.2f}')\n\nr2 = r_squared(x, y, m, b)\nprint(f'2. R² = {r2:.4f} ({\"Excellent\" if r2>0.95 else \"Good\"})')\n\nresiduals = [yi - (m*xi + b) for xi, yi in zip(x, y)]\nprint(f'3. Residuals: {[round(r,2) for r in residuals]}')\nprint(f'   Mean residual: {sum(residuals)/len(residuals):.4f}')\n\nprint(f'4. Predictions:')\nfor x_new in [7, 20]:\n    pred = m * x_new + b\n    ptype = 'interp' if 2 <= x_new <= 12 else 'extrap'\n    print(f'   x={x_new}: y={pred:.1f} ({ptype})')\n\nprint('\\n✅ Complete analysis pipeline!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Full pipeline completed", description: "End-to-end analysis" }]),
        hints: ["Follow all 4 steps", "x=7 is interpolation", "x=20 is extrapolation"],
        xpReward: 30,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 15.3.3`);

  console.log("\n✅ Part 4 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
