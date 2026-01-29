import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 2: Lessons 15.2.1-15.2.3 (Linear Regression)...\n");

  const section15_2 = await prisma.section.findFirst({
    where: { number: 15.2 },
  });
  if (!section15_2) throw new Error("Section 15.2 not found. Run part 1 first.");

  const lesson15_2_1 = await prisma.lesson.upsert({
    where: { slug: "intro-linear-regression" },
    update: {},
    create: {
      sectionId: section15_2.id,
      number: 15.21,
      title: "Introduction to Linear Regression",
      slug: "intro-linear-regression",
      objectives: [
        "Understand what linear regression does",
        "Learn the equation of a line: y = mx + b",
        "Visualize best-fit lines",
        "Know when linear regression is appropriate",
      ],
      content: `# Introduction to Linear Regression

## What is Linear Regression?

Linear regression finds the **best straight line** through data points.

Given data points (x₁, y₁), (x₂, y₂), ..., find line y = mx + b that "best fits" the data.

## The Line Equation

**y = mx + b** (or y = ax + b)

- **m (slope)**: How much y changes per unit change in x
- **b (intercept)**: Value of y when x = 0

## What "Best Fit" Means

The line that minimizes the total error between predicted and actual y values.

For each point:
- **Predicted**: ŷ = mx + b
- **Actual**: y (observed)
- **Error (residual)**: y - ŷ

Best line minimizes sum of squared errors!

## When to Use Linear Regression

✅ Relationship looks linear (straight line pattern)
✅ Want to predict Y from X
✅ Want to quantify relationship strength

❌ Curved relationships (need polynomial/other models)
❌ Multiple distinct groups
❌ Categorical dependent variable`,
      codeExamples: JSON.stringify([
        {
          id: "line-equation",
          title: "The Line Equation",
          code: "# y = mx + b\n# m = slope, b = intercept\n\nm = 2.0  # slope: y increases by 2 for each unit of x\nb = 5.0  # intercept: y = 5 when x = 0\n\nprint('Line: y = 2x + 5')\nprint('\\nx     y = 2x + 5')\nfor x in range(6):\n    y = m * x + b\n    print(f'{x}     {y:.1f}')",
          description: "Understanding slope and intercept",
        },
        {
          id: "predict-with-line",
          title: "Making Predictions",
          code: "# Known line: y = 3x + 10\nm = 3\nb = 10\n\ndef predict(x):\n    return m * x + b\n\nprint('Predictions using y = 3x + 10:')\nfor x in [5, 10, 15, 20]:\n    y_pred = predict(x)\n    print(f'  x = {x:2d} -> y = {y_pred:.1f}')",
          description: "Using a line for prediction",
        },
        {
          id: "residuals-intro",
          title: "Understanding Residuals",
          code: "# Suppose we have line y = 2x + 1\nm, b = 2, 1\n\n# Actual data points\nx_data = [1, 2, 3, 4, 5]\ny_actual = [3.2, 4.8, 7.1, 8.9, 11.2]\n\nprint('x    Actual  Predicted  Residual')\nfor x, y_act in zip(x_data, y_actual):\n    y_pred = m * x + b\n    residual = y_act - y_pred\n    print(f'{x}    {y_act:5.1f}    {y_pred:5.1f}      {residual:+.1f}')\n\nprint('\\nResidual = Actual - Predicted')",
          description: "Residuals measure prediction error",
        },
      ]),
      keyPoints: [
        "Linear regression fits best line through data",
        "Line equation: y = mx + b",
        "m = slope (rate of change)",
        "b = intercept (y when x=0)",
        "Residual = actual - predicted",
        "Best line minimizes squared residuals",
      ],
      hardwareDemo: "Watch y = mx + b calculation for each x. See residuals computed.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson15_2_1.number}: ${lesson15_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson15_2_1.id,
        number: 1,
        title: "Calculate Y from Line",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given line y = 4x + 3, calculate y for x = 0, 2, 5, 10.",
        starterCode: "m = 4  # slope\nb = 3  # intercept\n\nprint('Line: y = 4x + 3')\nprint('\\nx      y')\nfor x in [0, 2, 5, 10]:\n    y = m * x + b\n    print(f'{x:2d}     {y:.1f}')",
        solution: "m = 4\nb = 3\n\nprint('Line: y = 4x + 3')\nprint('\\nx      y')\nfor x in [0, 2, 5, 10]:\n    y = m * x + b\n    print(f'{x:2d}     {y:.1f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "x=0: y=3, x=10: y=43", description: "Correct calculations" }]),
        hints: ["y = mx + b", "When x=0, y=b", "When x=10, y=4*10+3=43"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson15_2_1.id,
        number: 2,
        title: "Interpret Slope and Intercept",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "A taxi charges $3 base fare plus $2 per mile. Write this as y = mx + b and calculate cost for 0, 5, 10 miles.",
        starterCode: "# Taxi fare: $3 base + $2 per mile\n# y = cost, x = miles\nm = 2  # cost per mile\nb = 3  # base fare\n\nprint('Taxi fare: y = 2x + 3')\nprint('\\nMiles  Cost')\nfor miles in [0, 5, 10]:\n    cost = m * miles + b\n    print(f'{miles:3d}    ${cost:.2f}')",
        solution: "m = 2\nb = 3\n\nprint('Taxi fare: y = 2x + 3')\nprint('\\nMiles  Cost')\nfor miles in [0, 5, 10]:\n    cost = m * miles + b\n    print(f'{miles:3d}    ${cost:.2f}')\n\nprint('\\nSlope (2) = cost per mile')\nprint('Intercept (3) = base fare')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "0 miles=$3, 10 miles=$23", description: "Real-world interpretation" }]),
        hints: ["Base fare is the intercept (y when x=0)", "Cost per mile is the slope", "10 miles = 2*10 + 3 = $23"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson15_2_1.id,
        number: 3,
        title: "Calculate Residuals",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Line: y = 2x + 1. Actual data: x=[1,2,3,4], y=[3.5, 4.8, 7.2, 9.1]. Calculate residuals for each point.",
        starterCode: "m, b = 2, 1\n\nx_data = [1, 2, 3, 4]\ny_actual = [3.5, 4.8, 7.2, 9.1]\n\nprint('x   Actual  Predicted  Residual')\nresiduals = []\nfor x, y_act in zip(x_data, y_actual):\n    y_pred = m * x + b\n    resid = y_act - y_pred\n    residuals.append(resid)\n    print(f'{x}   {y_act:5.1f}    {y_pred:5.1f}      {resid:+.1f}')\n\nprint(f'\\nSum of residuals: {sum(residuals):.2f}')",
        solution: "m, b = 2, 1\n\nx_data = [1, 2, 3, 4]\ny_actual = [3.5, 4.8, 7.2, 9.1]\n\nprint('x   Actual  Predicted  Residual')\nresiduals = []\nfor x, y_act in zip(x_data, y_actual):\n    y_pred = m * x + b\n    resid = y_act - y_pred\n    residuals.append(resid)\n    print(f'{x}   {y_act:5.1f}    {y_pred:5.1f}      {resid:+.1f}')\n\nprint(f'\\nSum of residuals: {sum(residuals):.2f}')\nprint('Positive residual = actual above line')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Residuals calculated", description: "Correct residuals" }]),
        hints: ["Predicted = m*x + b", "Residual = actual - predicted", "Positive = point above line"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson15_2_1.id,
        number: 4,
        title: "Sum of Squared Residuals",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate sum of squared residuals (SSR) for line y=2x+1 with data x=[1,2,3], y=[3.2, 5.1, 6.8].",
        starterCode: "m, b = 2, 1\n\nx_data = [1, 2, 3]\ny_actual = [3.2, 5.1, 6.8]\n\nssr = 0\nprint('x   Actual  Predicted  Residual  Squared')\nfor x, y_act in zip(x_data, y_actual):\n    y_pred = m * x + b\n    resid = y_act - y_pred\n    squared = resid ** 2\n    ssr += squared\n    print(f'{x}   {y_act:5.1f}    {y_pred:5.1f}      {resid:+.2f}     {squared:.3f}')\n\nprint(f'\\nSum of Squared Residuals (SSR): {ssr:.3f}')",
        solution: "m, b = 2, 1\n\nx_data = [1, 2, 3]\ny_actual = [3.2, 5.1, 6.8]\n\nssr = 0\nprint('x   Actual  Predicted  Residual  Squared')\nfor x, y_act in zip(x_data, y_actual):\n    y_pred = m * x + b\n    resid = y_act - y_pred\n    squared = resid ** 2\n    ssr += squared\n    print(f'{x}   {y_act:5.1f}    {y_pred:5.1f}      {resid:+.2f}     {squared:.3f}')\n\nprint(f'\\nSum of Squared Residuals (SSR): {ssr:.3f}')\nprint('Best line minimizes SSR!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "SSR calculated", description: "Correct SSR" }]),
        hints: ["Square each residual", "Sum all squared residuals", "Best fit minimizes this sum"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson15_2_1.id,
        number: 5,
        title: "Compare Two Lines",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Data: x=[1,2,3,4], y=[2.5, 5.0, 7.3, 10.1]. Compare lines y=2.5x+0 and y=2.4x+0.2. Which has lower SSR (better fit)?",
        starterCode: "x_data = [1, 2, 3, 4]\ny_actual = [2.5, 5.0, 7.3, 10.1]\n\ndef calc_ssr(m, b, x_data, y_actual):\n    ssr = 0\n    for x, y in zip(x_data, y_actual):\n        pred = m * x + b\n        ssr += (y - pred) ** 2\n    return ssr\n\nssr1 = calc_ssr(2.5, 0, x_data, y_actual)\nssr2 = calc_ssr(2.4, 0.2, x_data, y_actual)\n\nprint(f'Line 1 (y = 2.5x + 0): SSR = {ssr1:.3f}')\nprint(f'Line 2 (y = 2.4x + 0.2): SSR = {ssr2:.3f}')\nprint(f'\\nBetter fit: Line {1 if ssr1 < ssr2 else 2}')",
        solution: "x_data = [1, 2, 3, 4]\ny_actual = [2.5, 5.0, 7.3, 10.1]\n\ndef calc_ssr(m, b, x_data, y_actual):\n    ssr = 0\n    for x, y in zip(x_data, y_actual):\n        pred = m * x + b\n        ssr += (y - pred) ** 2\n    return ssr\n\nssr1 = calc_ssr(2.5, 0, x_data, y_actual)\nssr2 = calc_ssr(2.4, 0.2, x_data, y_actual)\n\nprint(f'Line 1 (y = 2.5x + 0): SSR = {ssr1:.3f}')\nprint(f'Line 2 (y = 2.4x + 0.2): SSR = {ssr2:.3f}')\nprint(f'\\nBetter fit: Line {1 if ssr1 < ssr2 else 2}')\nprint('Lower SSR = better fit!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Lower SSR identified", description: "Correct comparison" }]),
        hints: ["Calculate SSR for each line", "Lower SSR = better fit", "Compare the two values"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 15.2.1`);

  const lesson15_2_2 = await prisma.lesson.upsert({
    where: { slug: "least-squares-method" },
    update: {},
    create: {
      sectionId: section15_2.id,
      number: 15.22,
      title: "The Least Squares Method",
      slug: "least-squares-method",
      objectives: [
        "Understand the least squares principle",
        "Learn the formulas for slope and intercept",
        "Calculate best-fit line by hand",
        "Verify the math with examples",
      ],
      content: `# The Least Squares Method

## The Principle

Find slope (m) and intercept (b) that **minimize sum of squared residuals**.

Why squared?
- Makes all errors positive
- Penalizes large errors more
- Has nice mathematical properties

## The Formulas

Given n data points (x₁,y₁), (x₂,y₂), ..., (xₙ,yₙ):

**Slope:**
m = Σ(xᵢ - x̄)(yᵢ - ȳ) / Σ(xᵢ - x̄)²

**Intercept:**
b = ȳ - m·x̄

Where x̄ and ȳ are the means.

## Step-by-Step Process

1. Calculate means: x̄ and ȳ
2. Calculate deviations: (xᵢ - x̄) and (yᵢ - ȳ)
3. Calculate numerator: Σ(xᵢ - x̄)(yᵢ - ȳ)
4. Calculate denominator: Σ(xᵢ - x̄)²
5. Slope: m = numerator / denominator
6. Intercept: b = ȳ - m·x̄

## Key Insight

The line ALWAYS passes through (x̄, ȳ) - the centroid of the data!`,
      codeExamples: JSON.stringify([
        {
          id: "least-squares-formula",
          title: "Least Squares Calculation",
          code: "# Data\nx = [1, 2, 3, 4, 5]\ny = [2.1, 4.0, 5.8, 8.1, 9.9]\n\n# Step 1: Means\nn = len(x)\nx_mean = sum(x) / n\ny_mean = sum(y) / n\nprint(f'Means: x̄ = {x_mean}, ȳ = {y_mean}')\n\n# Step 2-4: Numerator and denominator\nnumerator = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(x, y))\ndenominator = sum((xi - x_mean) ** 2 for xi in x)\n\nprint(f'Numerator: {numerator}')\nprint(f'Denominator: {denominator}')\n\n# Step 5-6: Slope and intercept\nm = numerator / denominator\nb = y_mean - m * x_mean\n\nprint(f'\\nBest fit line: y = {m:.2f}x + {b:.2f}')",
          description: "Complete least squares calculation",
        },
        {
          id: "verify-centroid",
          title: "Line Passes Through Centroid",
          code: "x = [1, 2, 3, 4, 5]\ny = [2.1, 4.0, 5.8, 8.1, 9.9]\n\nx_mean = sum(x) / len(x)\ny_mean = sum(y) / len(y)\n\n# Calculate best fit line\nnum = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(x, y))\nden = sum((xi - x_mean) ** 2 for xi in x)\nm = num / den\nb = y_mean - m * x_mean\n\nprint(f'Line: y = {m:.2f}x + {b:.2f}')\nprint(f'\\nCentroid: ({x_mean}, {y_mean})')\nprint(f'Line at x={x_mean}: y = {m * x_mean + b:.2f}')\nprint('\\nLine passes exactly through centroid!')",
          description: "Verify the line passes through (x̄, ȳ)",
        },
        {
          id: "step-by-step",
          title: "Detailed Step-by-Step",
          code: "x = [1, 2, 3, 4, 5]\ny = [2, 4, 5, 4, 5]\n\nn = len(x)\nx_mean = sum(x) / n\ny_mean = sum(y) / n\n\nprint('Step-by-step calculation:')\nprint('x   y   (x-x̄)  (y-ȳ)  (x-x̄)(y-ȳ)  (x-x̄)²')\n\nnum_sum = 0\nden_sum = 0\nfor xi, yi in zip(x, y):\n    x_dev = xi - x_mean\n    y_dev = yi - y_mean\n    product = x_dev * y_dev\n    squared = x_dev ** 2\n    num_sum += product\n    den_sum += squared\n    print(f'{xi}   {yi}   {x_dev:+.1f}   {y_dev:+.1f}    {product:+.2f}       {squared:.2f}')\n\nprint(f'\\nSums:                      {num_sum:+.2f}       {den_sum:.2f}')\nm = num_sum / den_sum\nb = y_mean - m * x_mean\nprint(f'\\nm = {num_sum}/{den_sum} = {m:.2f}')\nprint(f'b = {y_mean} - {m:.2f}*{x_mean} = {b:.2f}')",
          description: "See each step of the calculation",
        },
      ]),
      keyPoints: [
        "Least squares minimizes sum of squared residuals",
        "Slope m = Σ(x-x̄)(y-ȳ) / Σ(x-x̄)²",
        "Intercept b = ȳ - m·x̄",
        "Best-fit line passes through (x̄, ȳ)",
        "Process: means → deviations → sums → m → b",
        "This is the optimal solution (mathematically proven)",
      ],
      hardwareDemo: "Watch deviation products accumulate. See division for slope, then intercept calculation.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson15_2_2.number}: ${lesson15_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson15_2_2.id,
        number: 1,
        title: "Calculate Means",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given x=[2,4,6,8,10] and y=[5,9,13,17,21], calculate x̄ and ȳ (the means).",
        starterCode: "x = [2, 4, 6, 8, 10]\ny = [5, 9, 13, 17, 21]\n\nx_mean = sum(x) / len(x)\ny_mean = sum(y) / len(y)\n\nprint(f'x̄ = {x_mean}')\nprint(f'ȳ = {y_mean}')",
        solution: "x = [2, 4, 6, 8, 10]\ny = [5, 9, 13, 17, 21]\n\nx_mean = sum(x) / len(x)\ny_mean = sum(y) / len(y)\n\nprint(f'x̄ = {x_mean}')\nprint(f'ȳ = {y_mean}')\nprint('\\nThe regression line will pass through (6, 13)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "x̄=6, ȳ=13", description: "Correct means" }]),
        hints: ["Mean = sum / count", "x̄ = (2+4+6+8+10)/5", "ȳ = (5+9+13+17+21)/5"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson15_2_2.id,
        number: 2,
        title: "Calculate Deviations",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "For x=[1,2,3,4,5] (mean=3), calculate (xᵢ - x̄) for each value. Print as table.",
        starterCode: "x = [1, 2, 3, 4, 5]\nx_mean = 3\n\nprint('x    (x - x̄)')\nfor xi in x:\n    deviation = xi - x_mean\n    print(f'{xi}    {deviation:+d}')",
        solution: "x = [1, 2, 3, 4, 5]\nx_mean = 3\n\nprint('x    (x - x̄)')\nfor xi in x:\n    deviation = xi - x_mean\n    print(f'{xi}    {deviation:+d}')\n\nprint(f'\\nSum of deviations: {sum(xi - x_mean for xi in x)}')\nprint('Sum is always 0!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Deviations: -2, -1, 0, +1, +2", description: "Correct deviations" }]),
        hints: ["Subtract mean from each value", "Some will be negative, some positive", "Sum of deviations = 0"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson15_2_2.id,
        number: 3,
        title: "Calculate Slope",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "For x=[1,2,3,4,5] and y=[3,5,7,9,11], calculate slope using the formula m = Σ(x-x̄)(y-ȳ) / Σ(x-x̄)².",
        starterCode: "x = [1, 2, 3, 4, 5]\ny = [3, 5, 7, 9, 11]\n\nx_mean = sum(x) / len(x)\ny_mean = sum(y) / len(y)\n\nnumerator = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(x, y))\ndenominator = sum((xi - x_mean) ** 2 for xi in x)\n\nm = numerator / denominator\n\nprint(f'x̄ = {x_mean}, ȳ = {y_mean}')\nprint(f'Numerator: {numerator}')\nprint(f'Denominator: {denominator}')\nprint(f'Slope m = {m}')",
        solution: "x = [1, 2, 3, 4, 5]\ny = [3, 5, 7, 9, 11]\n\nx_mean = sum(x) / len(x)\ny_mean = sum(y) / len(y)\n\nnumerator = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(x, y))\ndenominator = sum((xi - x_mean) ** 2 for xi in x)\n\nm = numerator / denominator\n\nprint(f'x̄ = {x_mean}, ȳ = {y_mean}')\nprint(f'Numerator: {numerator}')\nprint(f'Denominator: {denominator}')\nprint(f'Slope m = {m}')\nprint('\\nSlope = 2 (y increases by 2 for each unit of x)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Slope m = 2.0", description: "Correct slope" }]),
        hints: ["Calculate means first", "Numerator: sum of (x-x̄)(y-ȳ)", "Denominator: sum of (x-x̄)²"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson15_2_2.id,
        number: 4,
        title: "Complete Regression",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "For x=[1,2,3,4,5] and y=[2.2, 4.1, 5.8, 8.0, 10.1], calculate both slope and intercept. Print the line equation.",
        starterCode: "x = [1, 2, 3, 4, 5]\ny = [2.2, 4.1, 5.8, 8.0, 10.1]\n\n# Means\nx_mean = sum(x) / len(x)\ny_mean = sum(y) / len(y)\n\n# Slope\nnum = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(x, y))\nden = sum((xi - x_mean) ** 2 for xi in x)\nm = num / den\n\n# Intercept\nb = y_mean - m * x_mean\n\nprint(f'Best fit line: y = {m:.2f}x + {b:.2f}')",
        solution: "x = [1, 2, 3, 4, 5]\ny = [2.2, 4.1, 5.8, 8.0, 10.1]\n\nx_mean = sum(x) / len(x)\ny_mean = sum(y) / len(y)\n\nnum = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(x, y))\nden = sum((xi - x_mean) ** 2 for xi in x)\nm = num / den\n\nb = y_mean - m * x_mean\n\nprint(f'Best fit line: y = {m:.2f}x + {b:.2f}')\nprint(f'\\nVerify: line passes through ({x_mean}, {y_mean})')\nprint(f'At x={x_mean}: y = {m*x_mean + b:.2f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "y ≈ 2x + 0", description: "Correct regression line" }]),
        hints: ["Follow the formula step by step", "m first, then b", "b = ȳ - m·x̄"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson15_2_2.id,
        number: 5,
        title: "Hooke's Law Regression",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Hooke's Law data: mass (g) = [0,50,100,150,200] and extension (cm) = [0,1.1,2.3,3.4,4.5]. Find best-fit line to determine spring constant.",
        starterCode: "mass = [0, 50, 100, 150, 200]  # grams\nextension = [0, 1.1, 2.3, 3.4, 4.5]  # cm\n\n# Calculate regression\nx_mean = sum(mass) / len(mass)\ny_mean = sum(extension) / len(extension)\n\nnum = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(mass, extension))\nden = sum((xi - x_mean) ** 2 for xi in mass)\nm = num / den\nb = y_mean - m * x_mean\n\nprint(f'Best fit: extension = {m:.4f} * mass + {b:.2f}')\nprint(f'\\nSpring constant k ≈ {1/m:.1f} g/cm')",
        solution: "mass = [0, 50, 100, 150, 200]\nextension = [0, 1.1, 2.3, 3.4, 4.5]\n\nx_mean = sum(mass) / len(mass)\ny_mean = sum(extension) / len(extension)\n\nnum = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(mass, extension))\nden = sum((xi - x_mean) ** 2 for xi in mass)\nm = num / den\nb = y_mean - m * x_mean\n\nprint(f'Best fit: extension = {m:.4f} * mass + {b:.2f}')\nprint(f'\\nSlope means {m*100:.2f} cm per 100g')\nprint(f'Spring constant k ≈ {1/m:.1f} g/cm')\nprint('\\nThis is Hooke\\'s Law in action!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Linear relationship found", description: "Hooke's Law verified" }]),
        hints: ["Mass is X, extension is Y", "Slope tells us extension per gram", "Intercept should be near 0"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 15.2.2`);

  const lesson15_2_3 = await prisma.lesson.upsert({
    where: { slug: "implementing-linear-regression" },
    update: {},
    create: {
      sectionId: section15_2.id,
      number: 15.23,
      title: "Implementing Linear Regression",
      slug: "implementing-linear-regression",
      objectives: [
        "Write a reusable regression function",
        "Make predictions with regression model",
        "Handle edge cases",
        "Use regression for real problems",
      ],
      content: `# Implementing Linear Regression

## A Reusable Function

\`\`\`python
def linear_regression(x, y):
    n = len(x)
    x_mean = sum(x) / n
    y_mean = sum(y) / n
    
    numerator = sum((xi - x_mean) * (yi - y_mean) 
                    for xi, yi in zip(x, y))
    denominator = sum((xi - x_mean) ** 2 for xi in x)
    
    slope = numerator / denominator
    intercept = y_mean - slope * x_mean
    
    return slope, intercept
\`\`\`

## Making Predictions

\`\`\`python
def predict(x, slope, intercept):
    return slope * x + intercept
\`\`\`

## Edge Cases to Handle

1. **Empty data**: Return None or raise error
2. **Single point**: Can't fit line (infinite solutions)
3. **Vertical line**: Infinite slope (all x same)
4. **Perfect fit**: SSR = 0 (rare with real data)

## Complete Workflow

1. Collect and clean data
2. Compute regression (slope, intercept)
3. Evaluate fit (R², residuals)
4. Make predictions
5. Validate predictions`,
      codeExamples: JSON.stringify([
        {
          id: "regression-function",
          title: "Complete Regression Function",
          code: "def linear_regression(x, y):\n    \"\"\"Calculate best-fit line using least squares\"\"\"\n    if len(x) != len(y):\n        raise ValueError('x and y must have same length')\n    if len(x) < 2:\n        raise ValueError('Need at least 2 points')\n    \n    n = len(x)\n    x_mean = sum(x) / n\n    y_mean = sum(y) / n\n    \n    num = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(x, y))\n    den = sum((xi - x_mean) ** 2 for xi in x)\n    \n    if den == 0:\n        raise ValueError('All x values are identical')\n    \n    slope = num / den\n    intercept = y_mean - slope * x_mean\n    return slope, intercept\n\n# Test\nx = [1, 2, 3, 4, 5]\ny = [2.1, 4.0, 6.2, 7.9, 10.1]\nm, b = linear_regression(x, y)\nprint(f'y = {m:.2f}x + {b:.2f}')",
          description: "Robust regression function with error handling",
        },
        {
          id: "predict-function",
          title: "Making Predictions",
          code: "def linear_regression(x, y):\n    n = len(x)\n    x_mean = sum(x) / n\n    y_mean = sum(y) / n\n    num = sum((xi-x_mean)*(yi-y_mean) for xi,yi in zip(x,y))\n    den = sum((xi-x_mean)**2 for xi in x)\n    return num/den, y_mean - (num/den)*x_mean\n\ndef predict(x_new, slope, intercept):\n    return slope * x_new + intercept\n\n# Training data\nx = [1, 2, 3, 4, 5]\ny = [10, 22, 31, 42, 51]\n\nm, b = linear_regression(x, y)\nprint(f'Model: y = {m:.1f}x + {b:.1f}')\n\n# Predictions\nprint('\\nPredictions:')\nfor x_new in [6, 7, 10]:\n    y_pred = predict(x_new, m, b)\n    print(f'  x = {x_new}: y = {y_pred:.1f}')",
          description: "Use model for predictions",
        },
        {
          id: "real-example",
          title: "Real-World Example: Sales Prediction",
          code: "def linear_regression(x, y):\n    n = len(x)\n    x_mean, y_mean = sum(x)/n, sum(y)/n\n    num = sum((xi-x_mean)*(yi-y_mean) for xi,yi in zip(x,y))\n    den = sum((xi-x_mean)**2 for xi in x)\n    m = num/den\n    return m, y_mean - m*x_mean\n\n# Advertising spend ($1000s) vs Sales ($1000s)\nad_spend = [10, 20, 30, 40, 50, 60]\nsales = [100, 150, 200, 270, 320, 380]\n\nm, b = linear_regression(ad_spend, sales)\nprint(f'Sales = {m:.1f} × Ad_Spend + {b:.1f}')\nprint(f'\\nInterpretation:')\nprint(f'  Each $1000 in ads → ${m*1000:.0f} more sales')\nprint(f'  Base sales (no ads): ${b*1000:.0f}')\n\n# Predict for $80k ad spend\npred = m * 80 + b\nprint(f'\\nPredict: $80k ads → ${pred:.0f}k sales')",
          description: "Business application of regression",
        },
      ]),
      keyPoints: [
        "Wrap regression in reusable function",
        "Handle edge cases (empty, single point, vertical)",
        "Predict: y = slope * x + intercept",
        "Validate inputs before processing",
        "Interpret slope and intercept in context",
        "Test with known data before using",
      ],
      hardwareDemo: "Watch function call stack. See calculations in ALU. Observe prediction computation.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson15_2_3.number}: ${lesson15_2_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson15_2_3.id,
        number: 1,
        title: "Write Regression Function",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function linear_regression(x, y) that returns (slope, intercept). Test with x=[1,2,3,4] and y=[2,4,6,8].",
        starterCode: "def linear_regression(x, y):\n    n = len(x)\n    x_mean = sum(x) / n\n    y_mean = sum(y) / n\n    \n    num = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(x, y))\n    den = sum((xi - x_mean) ** 2 for xi in x)\n    \n    slope = num / den\n    intercept = y_mean - slope * x_mean\n    return slope, intercept\n\n# Test\nx = [1, 2, 3, 4]\ny = [2, 4, 6, 8]\nm, b = linear_regression(x, y)\nprint(f'y = {m:.1f}x + {b:.1f}')",
        solution: "def linear_regression(x, y):\n    n = len(x)\n    x_mean = sum(x) / n\n    y_mean = sum(y) / n\n    \n    num = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(x, y))\n    den = sum((xi - x_mean) ** 2 for xi in x)\n    \n    slope = num / den\n    intercept = y_mean - slope * x_mean\n    return slope, intercept\n\nx = [1, 2, 3, 4]\ny = [2, 4, 6, 8]\nm, b = linear_regression(x, y)\nprint(f'y = {m:.1f}x + {b:.1f}')\nprint('Perfect fit: y = 2x + 0')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "y = 2.0x + 0.0", description: "Perfect linear data" }]),
        hints: ["This is perfect linear data", "Slope should be 2", "Intercept should be 0"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson15_2_3.id,
        number: 2,
        title: "Make Predictions",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Using regression on x=[1,2,3,4,5], y=[3,5,7,9,11], predict y for x=10 and x=20.",
        starterCode: "def linear_regression(x, y):\n    n = len(x)\n    x_mean, y_mean = sum(x)/n, sum(y)/n\n    num = sum((xi-x_mean)*(yi-y_mean) for xi,yi in zip(x,y))\n    den = sum((xi-x_mean)**2 for xi in x)\n    return num/den, y_mean - (num/den)*x_mean\n\nx = [1, 2, 3, 4, 5]\ny = [3, 5, 7, 9, 11]\n\nm, b = linear_regression(x, y)\nprint(f'Model: y = {m:.1f}x + {b:.1f}')\n\n# Predictions\nfor x_new in [10, 20]:\n    y_pred = m * x_new + b\n    print(f'x = {x_new}: y = {y_pred:.1f}')",
        solution: "def linear_regression(x, y):\n    n = len(x)\n    x_mean, y_mean = sum(x)/n, sum(y)/n\n    num = sum((xi-x_mean)*(yi-y_mean) for xi,yi in zip(x,y))\n    den = sum((xi-x_mean)**2 for xi in x)\n    return num/den, y_mean - (num/den)*x_mean\n\nx = [1, 2, 3, 4, 5]\ny = [3, 5, 7, 9, 11]\n\nm, b = linear_regression(x, y)\nprint(f'Model: y = {m:.1f}x + {b:.1f}')\n\nfor x_new in [10, 20]:\n    y_pred = m * x_new + b\n    print(f'x = {x_new}: y = {y_pred:.1f}')\n\nprint('\\nPredictions beyond data range (extrapolation)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "x=10: y=21, x=20: y=41", description: "Correct predictions" }]),
        hints: ["Pattern: y = 2x + 1", "At x=10: 2*10+1=21", "At x=20: 2*20+1=41"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson15_2_3.id,
        number: 3,
        title: "Add Error Handling",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Add error handling to regression function: check for matching lengths, minimum 2 points, and identical x values.",
        starterCode: "def linear_regression(x, y):\n    # Add error checks\n    if len(x) != len(y):\n        raise ValueError('x and y must have same length')\n    if len(x) < 2:\n        raise ValueError('Need at least 2 points')\n    \n    n = len(x)\n    x_mean, y_mean = sum(x)/n, sum(y)/n\n    num = sum((xi-x_mean)*(yi-y_mean) for xi,yi in zip(x,y))\n    den = sum((xi-x_mean)**2 for xi in x)\n    \n    if den == 0:\n        raise ValueError('All x values are identical')\n    \n    return num/den, y_mean - (num/den)*x_mean\n\n# Test error cases\ntry:\n    linear_regression([1,2], [1,2,3])  # Different lengths\nexcept ValueError as e:\n    print(f'Error 1: {e}')\n\ntry:\n    linear_regression([1], [1])  # Single point\nexcept ValueError as e:\n    print(f'Error 2: {e}')\n\ntry:\n    linear_regression([5,5,5], [1,2,3])  # Same x values\nexcept ValueError as e:\n    print(f'Error 3: {e}')",
        solution: "def linear_regression(x, y):\n    if len(x) != len(y):\n        raise ValueError('x and y must have same length')\n    if len(x) < 2:\n        raise ValueError('Need at least 2 points')\n    \n    n = len(x)\n    x_mean, y_mean = sum(x)/n, sum(y)/n\n    num = sum((xi-x_mean)*(yi-y_mean) for xi,yi in zip(x,y))\n    den = sum((xi-x_mean)**2 for xi in x)\n    \n    if den == 0:\n        raise ValueError('All x values are identical')\n    \n    return num/den, y_mean - (num/den)*x_mean\n\ntry:\n    linear_regression([1,2], [1,2,3])\nexcept ValueError as e:\n    print(f'Error 1: {e}')\n\ntry:\n    linear_regression([1], [1])\nexcept ValueError as e:\n    print(f'Error 2: {e}')\n\ntry:\n    linear_regression([5,5,5], [1,2,3])\nexcept ValueError as e:\n    print(f'Error 3: {e}')\n\nprint('\\nAll edge cases handled!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All 3 errors caught", description: "Robust function" }]),
        hints: ["Check lengths match", "Need at least 2 points for a line", "Denominator 0 means vertical line"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson15_2_3.id,
        number: 4,
        title: "Temperature Conversion",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Use regression to find Fahrenheit to Celsius formula from data: F=[32,50,68,86,104], C=[0,10,20,30,40].",
        starterCode: "def linear_regression(x, y):\n    n = len(x)\n    x_mean, y_mean = sum(x)/n, sum(y)/n\n    num = sum((xi-x_mean)*(yi-y_mean) for xi,yi in zip(x,y))\n    den = sum((xi-x_mean)**2 for xi in x)\n    return num/den, y_mean - (num/den)*x_mean\n\nF = [32, 50, 68, 86, 104]  # Fahrenheit\nC = [0, 10, 20, 30, 40]    # Celsius\n\nm, b = linear_regression(F, C)\nprint(f'C = {m:.4f} × F + {b:.2f}')\nprint(f'\\nThis is the formula: C = (F - 32) × 5/9')\nprint(f'Our slope {m:.4f} ≈ 5/9 = {5/9:.4f}')",
        solution: "def linear_regression(x, y):\n    n = len(x)\n    x_mean, y_mean = sum(x)/n, sum(y)/n\n    num = sum((xi-x_mean)*(yi-y_mean) for xi,yi in zip(x,y))\n    den = sum((xi-x_mean)**2 for xi in x)\n    return num/den, y_mean - (num/den)*x_mean\n\nF = [32, 50, 68, 86, 104]\nC = [0, 10, 20, 30, 40]\n\nm, b = linear_regression(F, C)\nprint(f'C = {m:.4f} × F + {b:.2f}')\nprint(f'\\nKnown formula: C = (F - 32) × 5/9')\nprint(f'Our slope {m:.4f} ≈ 5/9 = {5/9:.4f}')\nprint(f'Our intercept {b:.2f} ≈ -32 × 5/9 = {-32*5/9:.2f}')\nprint('\\nRegression recovered the exact formula!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Slope ≈ 0.5556", description: "Correct conversion formula" }]),
        hints: ["F is x, C is y", "Slope should be 5/9 ≈ 0.5556", "Intercept should be about -17.78"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson15_2_3.id,
        number: 5,
        title: "Sales Prediction System",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Build sales prediction: Ad spend ($k) = [5,10,15,20,25,30] and Sales ($k) = [50,75,110,130,160,200]. Predict sales for $40k ad spend.",
        starterCode: "def linear_regression(x, y):\n    n = len(x)\n    x_mean, y_mean = sum(x)/n, sum(y)/n\n    num = sum((xi-x_mean)*(yi-y_mean) for xi,yi in zip(x,y))\n    den = sum((xi-x_mean)**2 for xi in x)\n    return num/den, y_mean - (num/den)*x_mean\n\nad_spend = [5, 10, 15, 20, 25, 30]  # $thousands\nsales = [50, 75, 110, 130, 160, 200]  # $thousands\n\nm, b = linear_regression(ad_spend, sales)\nprint(f'Sales = {m:.2f} × Ad_Spend + {b:.2f}')\nprint(f'\\nFor each $1k in ads, sales increase by ${m:.2f}k')\n\n# Predict for $40k\npred_40 = m * 40 + b\nprint(f'\\nPrediction for $40k ad spend: ${pred_40:.1f}k sales')",
        solution: "def linear_regression(x, y):\n    n = len(x)\n    x_mean, y_mean = sum(x)/n, sum(y)/n\n    num = sum((xi-x_mean)*(yi-y_mean) for xi,yi in zip(x,y))\n    den = sum((xi-x_mean)**2 for xi in x)\n    return num/den, y_mean - (num/den)*x_mean\n\nad_spend = [5, 10, 15, 20, 25, 30]\nsales = [50, 75, 110, 130, 160, 200]\n\nm, b = linear_regression(ad_spend, sales)\nprint(f'Sales = {m:.2f} × Ad_Spend + {b:.2f}')\nprint(f'\\nFor each $1k in ads, sales increase by ${m:.2f}k')\n\npred_40 = m * 40 + b\nprint(f'\\nPrediction for $40k ad spend: ${pred_40:.1f}k sales')\nprint('\\nNote: Extrapolating beyond data range - use with caution!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Prediction around $250k", description: "Business prediction" }]),
        hints: ["Find the linear relationship", "Slope tells ROI on advertising", "Extrapolation has uncertainty"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 15.2.3`);

  console.log("\n✅ Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
