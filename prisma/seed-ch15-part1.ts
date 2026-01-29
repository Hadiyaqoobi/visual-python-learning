import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 1: Chapter 15 structure + Lessons 15.1.1-15.1.2...\n");

  const chapter15 = await prisma.chapter.upsert({
    where: { number: 15 },
    update: {},
    create: {
      number: 15,
      title: "Understanding Experimental Data",
      description: "Learn to work with real experimental data using linear regression. Master fitting lines to data, evaluating model quality with R², and making predictions.",
      objectives: [
        "Understand experimental design principles",
        "Implement linear regression from scratch",
        "Calculate and interpret R-squared",
        "Analyze residuals for model validation",
        "Make predictions using regression models",
      ],
      isPublished: true,
    },
  });
  console.log(`✅ Chapter ${chapter15.number}: ${chapter15.title}`);

  const section15_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter15.id, number: 15.1 } },
    update: {},
    create: {
      chapterId: chapter15.id,
      number: 15.1,
      title: "Experimental Data Fundamentals",
      description: "Learn principles of experimental design and data quality.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section15_1.number}: ${section15_1.title}`);

  const section15_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter15.id, number: 15.2 } },
    update: {},
    create: {
      chapterId: chapter15.id,
      number: 15.2,
      title: "Linear Regression",
      description: "Master the most important statistical technique: fitting lines to data.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section15_2.number}: ${section15_2.title}`);

  const section15_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter15.id, number: 15.3 } },
    update: {},
    create: {
      chapterId: chapter15.id,
      number: 15.3,
      title: "Model Evaluation",
      description: "Learn to evaluate regression models using R² and residual analysis.",
      order: 3,
    },
  });
  console.log(`  📂 Section ${section15_3.number}: ${section15_3.title}`);

  const lesson15_1_1 = await prisma.lesson.upsert({
    where: { slug: "experimental-design-basics" },
    update: {},
    create: {
      sectionId: section15_1.id,
      number: 15.11,
      title: "Experimental Design Basics",
      slug: "experimental-design-basics",
      objectives: [
        "Understand independent vs dependent variables",
        "Learn principles of good experimental design",
        "Recognize sources of experimental error",
        "Design simple experiments",
      ],
      content: `# Experimental Design Basics

## Variables in Experiments

**Independent Variable (X)**: What you control/change
**Dependent Variable (Y)**: What you measure/observe

Example - Hooke's Law:
- Independent: Mass added to spring (X)
- Dependent: Spring extension (Y)

## Good Experimental Design

1. **Control variables**: Keep everything else constant
2. **Replication**: Repeat measurements multiple times
3. **Randomization**: Reduce systematic bias
4. **Range**: Test across full range of interest

## Types of Error

**Systematic Error**: Consistent bias in one direction
- Miscalibrated instrument
- Always measuring at an angle

**Random Error**: Unpredictable variation
- Measurement precision limits
- Environmental fluctuations

## The Goal

Find the RELATIONSHIP between X and Y:
- Is there a pattern?
- Can we describe it mathematically?
- Can we predict Y from X?

This leads us to regression!`,
      codeExamples: JSON.stringify([
        {
          id: "hookes-law-data",
          title: "Hooke's Law Experiment Data",
          code: "# Hooke's Law: F = kx (Force = spring constant * extension)\n# We measure extension (cm) for different masses (g)\n\nmasses = [0, 50, 100, 150, 200, 250, 300]  # grams (independent)\nextensions = [0, 1.2, 2.5, 3.7, 5.1, 6.2, 7.4]  # cm (dependent)\n\nprint('Mass (g)  Extension (cm)')\nfor m, e in zip(masses, extensions):\n    print(f'{m:6d}    {e:6.1f}')\n\nprint('\\nQuestion: What is the relationship?')",
          description: "Classic physics experiment data",
        },
        {
          id: "multiple-trials",
          title: "Multiple Trials for Reliability",
          code: "import random\n\n# Simulate 3 trials of measuring extension at 100g\ntrue_extension = 2.5\nmeasurement_error = 0.2\n\nprint('Trial  Measurement')\nmeasurements = []\nfor trial in range(1, 6):\n    # Add random measurement error\n    measured = true_extension + random.uniform(-measurement_error, measurement_error)\n    measurements.append(measured)\n    print(f'{trial:3d}    {measured:.2f} cm')\n\navg = sum(measurements) / len(measurements)\nprint(f'\\nAverage: {avg:.2f} cm')\nprint(f'True value: {true_extension} cm')\nprint('Multiple trials reduce random error!')",
          description: "Replication reduces random error",
        },
        {
          id: "systematic-error",
          title: "Detecting Systematic Error",
          code: "# Suppose our ruler is off by 0.3 cm (systematic error)\ntrue_values = [1.0, 2.0, 3.0, 4.0, 5.0]\nsystematic_bias = 0.3\n\nmeasured = [v + systematic_bias for v in true_values]\n\nprint('True    Measured    Error')\nfor t, m in zip(true_values, measured):\n    print(f'{t:.1f}     {m:.1f}        {m-t:+.1f}')\n\nprint('\\nNotice: ALL errors are +0.3 (systematic)')\nprint('This is different from random scatter!')",
          description: "Systematic vs random error",
        },
      ]),
      keyPoints: [
        "Independent variable (X) = what you control",
        "Dependent variable (Y) = what you measure",
        "Replication reduces random error",
        "Systematic errors bias all measurements",
        "Good design: control, replicate, randomize",
        "Goal: find mathematical relationship Y = f(X)",
      ],
      hardwareDemo: "Watch data arrays being populated. See mean calculation for multiple trials.",
      estimatedTime: 20,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson15_1_1.number}: ${lesson15_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson15_1_1.id,
        number: 1,
        title: "Identify Variables",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given plant growth experiment data (sunlight hours vs height), identify and print which is independent and which is dependent variable.",
        starterCode: "# Plant growth experiment\nsunlight_hours = [2, 4, 6, 8, 10]  # hours per day\nplant_height = [5, 12, 18, 25, 30]   # cm after 4 weeks\n\nprint('Independent variable (X):', )\nprint('Dependent variable (Y):', )\nprint('\\nWhy? We CONTROL sunlight, we MEASURE height')",
        solution: "sunlight_hours = [2, 4, 6, 8, 10]\nplant_height = [5, 12, 18, 25, 30]\n\nprint('Independent variable (X): sunlight_hours')\nprint('Dependent variable (Y): plant_height')\nprint('\\nWhy? We CONTROL sunlight, we MEASURE height')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Independent: sunlight, Dependent: height", description: "Correct identification" }]),
        hints: ["What do you control in the experiment?", "What do you measure as a result?", "X = control, Y = measure"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson15_1_1.id,
        number: 2,
        title: "Calculate Trial Average",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given 5 measurements of the same quantity [23.4, 23.8, 23.1, 23.6, 23.5], calculate the average to reduce random error.",
        starterCode: "measurements = [23.4, 23.8, 23.1, 23.6, 23.5]\n\naverage = sum(measurements) / len(measurements)\n\nprint(f'Measurements: {measurements}')\nprint(f'Average: {average:.2f}')\nprint(f'Range: {min(measurements):.1f} to {max(measurements):.1f}')",
        solution: "measurements = [23.4, 23.8, 23.1, 23.6, 23.5]\n\naverage = sum(measurements) / len(measurements)\n\nprint(f'Measurements: {measurements}')\nprint(f'Average: {average:.2f}')\nprint(f'Range: {min(measurements):.1f} to {max(measurements):.1f}')\nprint('\\nAveraging reduces random error!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Average: 23.48", description: "Correct average" }]),
        hints: ["Average = sum / count", "This reduces random error", "True value is likely near 23.5"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson15_1_1.id,
        number: 3,
        title: "Detect Systematic Error",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Known true values are [10, 20, 30, 40, 50]. Measured values are [10.5, 20.5, 30.5, 40.5, 50.5]. Calculate error for each. Is this systematic or random error?",
        starterCode: "true_values = [10, 20, 30, 40, 50]\nmeasured = [10.5, 20.5, 30.5, 40.5, 50.5]\n\nprint('True  Measured  Error')\nerrors = []\nfor t, m in zip(true_values, measured):\n    error = m - t\n    errors.append(error)\n    print(f'{t:4d}  {m:8.1f}  {error:+.1f}')\n\nprint(f'\\nAll errors: {errors}')\nprint('Error type: ')",
        solution: "true_values = [10, 20, 30, 40, 50]\nmeasured = [10.5, 20.5, 30.5, 40.5, 50.5]\n\nprint('True  Measured  Error')\nerrors = []\nfor t, m in zip(true_values, measured):\n    error = m - t\n    errors.append(error)\n    print(f'{t:4d}  {m:8.1f}  {error:+.1f}')\n\nprint(f'\\nAll errors: {errors}')\nprint('Error type: SYSTEMATIC (all +0.5, constant bias)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Systematic error identified", description: "All errors same" }]),
        hints: ["Look at the pattern of errors", "Are they all the same?", "Constant bias = systematic"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson15_1_1.id,
        number: 4,
        title: "Simulate Random Error",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Simulate 10 measurements of a true value 50.0 with random error ±2.0. Calculate average. Is average close to true value?",
        starterCode: "import random\n\ntrue_value = 50.0\nerror_range = 2.0\n\nmeasurements = []\nfor i in range(10):\n    measured = true_value + random.uniform(-error_range, error_range)\n    measurements.append(measured)\n\navg = sum(measurements) / len(measurements)\n\nprint(f'True value: {true_value}')\nprint(f'Measurements: {[round(m, 1) for m in measurements]}')\nprint(f'Average: {avg:.2f}')\nprint(f'Error in average: {abs(avg - true_value):.2f}')",
        solution: "import random\n\ntrue_value = 50.0\nerror_range = 2.0\n\nmeasurements = []\nfor i in range(10):\n    measured = true_value + random.uniform(-error_range, error_range)\n    measurements.append(measured)\n\navg = sum(measurements) / len(measurements)\n\nprint(f'True value: {true_value}')\nprint(f'Measurements: {[round(m, 1) for m in measurements]}')\nprint(f'Average: {avg:.2f}')\nprint(f'Error in average: {abs(avg - true_value):.2f}')\nprint('\\nRandom errors tend to cancel out when averaged!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Average close to 50", description: "Random errors cancel" }]),
        hints: ["Random errors go both + and -", "They tend to cancel when averaged", "Average should be close to 50"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson15_1_1.id,
        number: 5,
        title: "Design an Experiment",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Design a simple experiment: study time (hours) vs test score. Create realistic data for 5 students with some randomness. Print as a table.",
        starterCode: "import random\n\n# Assume: base score 40, gain ~8 points per hour of study\n# Add random variation ±5 points\n\nstudy_hours = [1, 2, 3, 4, 5]\ntest_scores = []\n\nfor hours in study_hours:\n    base_score = 40 + 8 * hours\n    actual_score = base_score + random.uniform(-5, 5)\n    actual_score = min(100, max(0, actual_score))  # Keep 0-100\n    test_scores.append(round(actual_score, 1))\n\nprint('Study Hours  Test Score')\nfor h, s in zip(study_hours, test_scores):\n    print(f'{h:6d}       {s:6.1f}')",
        solution: "import random\n\nstudy_hours = [1, 2, 3, 4, 5]\ntest_scores = []\n\nfor hours in study_hours:\n    base_score = 40 + 8 * hours\n    actual_score = base_score + random.uniform(-5, 5)\n    actual_score = min(100, max(0, actual_score))\n    test_scores.append(round(actual_score, 1))\n\nprint('Study Hours  Test Score')\nfor h, s in zip(study_hours, test_scores):\n    print(f'{h:6d}       {s:6.1f}')\n\nprint('\\nIndependent: study_hours')\nprint('Dependent: test_scores')\nprint('Expected relationship: more study = higher score')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Table with increasing scores", description: "Realistic experiment data" }]),
        hints: ["More study should give higher scores", "Add some randomness for realism", "Scores should stay 0-100"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 15.1.1`);

  const lesson15_1_2 = await prisma.lesson.upsert({
    where: { slug: "data-collection-quality" },
    update: {},
    create: {
      sectionId: section15_1.id,
      number: 15.12,
      title: "Data Collection and Quality",
      slug: "data-collection-quality",
      objectives: [
        "Store experimental data in Python structures",
        "Calculate basic statistics on data",
        "Identify outliers and data quality issues",
        "Prepare data for analysis",
      ],
      content: `# Data Collection and Quality

## Storing Experimental Data

Use parallel lists or list of tuples:

\`\`\`python
# Parallel lists
x_values = [1, 2, 3, 4, 5]
y_values = [2.1, 3.9, 6.2, 7.8, 10.1]

# List of tuples
data = [(1, 2.1), (2, 3.9), (3, 6.2), (4, 7.8), (5, 10.1)]
\`\`\`

## Basic Data Quality Checks

1. **Check for missing values**: Are all measurements recorded?
2. **Check range**: Are values reasonable?
3. **Check for outliers**: Any extreme values?
4. **Check consistency**: Do patterns make sense?

## Identifying Outliers

Simple method: Values beyond mean ± 2*std are potential outliers.

## Data Summary Statistics

Before regression, always compute:
- Mean of X and Y
- Standard deviation of X and Y
- Min/Max values
- Sample size

This helps catch problems early!`,
      codeExamples: JSON.stringify([
        {
          id: "data-structures",
          title: "Storing Experimental Data",
          code: "# Method 1: Parallel lists\nmasses = [100, 200, 300, 400, 500]\nextensions = [1.2, 2.5, 3.7, 5.0, 6.2]\n\n# Method 2: List of tuples\ndata_points = list(zip(masses, extensions))\n\nprint('As parallel lists:')\nprint(f'  X: {masses}')\nprint(f'  Y: {extensions}')\n\nprint('\\nAs tuples:')\nfor point in data_points:\n    print(f'  {point}')",
          description: "Two ways to store paired data",
        },
        {
          id: "data-summary",
          title: "Data Summary Statistics",
          code: "import statistics\n\nx = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\ny = [2.3, 4.1, 5.8, 8.2, 9.9, 12.1, 14.0, 15.8, 18.1, 20.2]\n\nprint('Data Summary')\nprint('=' * 30)\nprint(f'Sample size: {len(x)}')\nprint(f'\\nX statistics:')\nprint(f'  Mean: {statistics.mean(x):.2f}')\nprint(f'  Std:  {statistics.stdev(x):.2f}')\nprint(f'  Range: {min(x)} to {max(x)}')\nprint(f'\\nY statistics:')\nprint(f'  Mean: {statistics.mean(y):.2f}')\nprint(f'  Std:  {statistics.stdev(y):.2f}')\nprint(f'  Range: {min(y):.1f} to {max(y):.1f}')",
          description: "Always summarize before analysis",
        },
        {
          id: "outlier-detection",
          title: "Simple Outlier Detection",
          code: "import statistics\n\ndata = [10, 12, 11, 13, 12, 11, 50, 12, 13, 11]  # 50 is outlier!\n\nmean = statistics.mean(data)\nstd = statistics.stdev(data)\n\nprint(f'Data: {data}')\nprint(f'Mean: {mean:.2f}')\nprint(f'Std: {std:.2f}')\nprint(f'\\nOutlier threshold: mean ± 2*std')\nprint(f'  Lower: {mean - 2*std:.2f}')\nprint(f'  Upper: {mean + 2*std:.2f}')\n\nprint('\\nPotential outliers:')\nfor x in data:\n    if abs(x - mean) > 2 * std:\n        print(f'  {x} (z-score: {(x-mean)/std:.1f})')",
          description: "Find values far from mean",
        },
      ]),
      keyPoints: [
        "Store data in parallel lists or list of tuples",
        "Always compute summary statistics first",
        "Check for outliers: values > 2 std from mean",
        "Verify data range is reasonable",
        "Missing or bad data corrupts analysis",
        "Data quality is crucial for valid results",
      ],
      hardwareDemo: "Watch statistics being calculated from arrays. See outlier detection comparisons.",
      estimatedTime: 20,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson15_1_2.number}: ${lesson15_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson15_1_2.id,
        number: 1,
        title: "Create Data Structure",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create parallel lists for temperature (°C) and ice cream sales ($): temps [20, 25, 30, 35, 40] and sales [100, 150, 200, 300, 450]. Print as table.",
        starterCode: "temperatures = [20, 25, 30, 35, 40]\nsales = [100, 150, 200, 300, 450]\n\nprint('Temp (°C)  Sales ($)')\nfor t, s in zip(temperatures, sales):\n    print(f'{t:6d}     {s:6d}')",
        solution: "temperatures = [20, 25, 30, 35, 40]\nsales = [100, 150, 200, 300, 450]\n\nprint('Temp (°C)  Sales ($)')\nfor t, s in zip(temperatures, sales):\n    print(f'{t:6d}     {s:6d}')\n\nprint('\\nHigher temp = more ice cream sales!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Table with 5 rows", description: "Correct data structure" }]),
        hints: ["Use zip() to iterate parallel lists", "Format with f-strings", "Data shows positive correlation"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson15_1_2.id,
        number: 2,
        title: "Calculate Summary Stats",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "For data x=[5,10,15,20,25] and y=[12,25,35,48,61], calculate mean and std for both X and Y.",
        starterCode: "import statistics\n\nx = [5, 10, 15, 20, 25]\ny = [12, 25, 35, 48, 61]\n\nprint('X Statistics:')\nprint(f'  Mean: {statistics.mean(x):.2f}')\nprint(f'  Std:  {statistics.stdev(x):.2f}')\n\nprint('\\nY Statistics:')\nprint(f'  Mean: {statistics.mean(y):.2f}')\nprint(f'  Std:  {statistics.stdev(y):.2f}')",
        solution: "import statistics\n\nx = [5, 10, 15, 20, 25]\ny = [12, 25, 35, 48, 61]\n\nprint('X Statistics:')\nprint(f'  Mean: {statistics.mean(x):.2f}')\nprint(f'  Std:  {statistics.stdev(x):.2f}')\n\nprint('\\nY Statistics:')\nprint(f'  Mean: {statistics.mean(y):.2f}')\nprint(f'  Std:  {statistics.stdev(y):.2f}')\n\nprint('\\nY increases roughly 2.5x for each unit of X')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "X mean=15, Y mean=36.2", description: "Correct statistics" }]),
        hints: ["Use statistics.mean() and statistics.stdev()", "X mean is 15", "Y mean is 36.2"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson15_1_2.id,
        number: 3,
        title: "Find Outliers",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Data: [45, 48, 52, 49, 51, 47, 150, 50, 48]. Find and print any outliers (values > 2 std from mean).",
        starterCode: "import statistics\n\ndata = [45, 48, 52, 49, 51, 47, 150, 50, 48]\n\nmean = statistics.mean(data)\nstd = statistics.stdev(data)\n\nprint(f'Data: {data}')\nprint(f'Mean: {mean:.2f}')\nprint(f'Std: {std:.2f}')\nprint(f'\\nThreshold: {mean-2*std:.2f} to {mean+2*std:.2f}')\n\nprint('\\nOutliers:')\nfor x in data:\n    if abs(x - mean) > 2 * std:\n        print(f'  {x}')",
        solution: "import statistics\n\ndata = [45, 48, 52, 49, 51, 47, 150, 50, 48]\n\nmean = statistics.mean(data)\nstd = statistics.stdev(data)\n\nprint(f'Data: {data}')\nprint(f'Mean: {mean:.2f}')\nprint(f'Std: {std:.2f}')\nprint(f'\\nThreshold: {mean-2*std:.2f} to {mean+2*std:.2f}')\n\nprint('\\nOutliers:')\nfor x in data:\n    if abs(x - mean) > 2 * std:\n        print(f'  {x}')\n\nprint('\\n150 is clearly an outlier!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "150 identified as outlier", description: "Correct outlier detection" }]),
        hints: ["150 is much larger than others", "Calculate mean and std first", "Check if |x - mean| > 2*std"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson15_1_2.id,
        number: 4,
        title: "Remove Outliers",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Given data [20, 22, 21, 100, 23, 21, 22, -50, 20], remove outliers and recalculate mean. Compare before/after.",
        starterCode: "import statistics\n\ndata = [20, 22, 21, 100, 23, 21, 22, -50, 20]\n\nmean_before = statistics.mean(data)\nstd = statistics.stdev(data)\n\n# Remove outliers\ncleaned = [x for x in data if abs(x - mean_before) <= 2 * std]\n\nmean_after = statistics.mean(cleaned)\n\nprint(f'Original: {data}')\nprint(f'Mean before: {mean_before:.2f}')\nprint(f'\\nCleaned: {cleaned}')\nprint(f'Mean after: {mean_after:.2f}')\nprint(f'\\nDifference: {abs(mean_after - mean_before):.2f}')",
        solution: "import statistics\n\ndata = [20, 22, 21, 100, 23, 21, 22, -50, 20]\n\nmean_before = statistics.mean(data)\nstd = statistics.stdev(data)\n\ncleaned = [x for x in data if abs(x - mean_before) <= 2 * std]\n\nmean_after = statistics.mean(cleaned)\n\nprint(f'Original: {data}')\nprint(f'Mean before: {mean_before:.2f}')\nprint(f'\\nCleaned: {cleaned}')\nprint(f'Mean after: {mean_after:.2f}')\nprint(f'\\nOutliers removed: 100 and -50')\nprint(f'Mean shifted significantly!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Mean after ~21", description: "Outliers removed correctly" }]),
        hints: ["Use list comprehension to filter", "Keep values within 2 std of mean", "100 and -50 are outliers"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson15_1_2.id,
        number: 5,
        title: "Complete Data Quality Check",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Perform full data quality check on x=[1,2,3,4,5,6] and y=[2.1, 4.0, None, 7.9, 10.2, 12.0]. Handle missing value (None), then print summary.",
        starterCode: "import statistics\n\nx = [1, 2, 3, 4, 5, 6]\ny = [2.1, 4.0, None, 7.9, 10.2, 12.0]\n\n# Remove pairs with None\nclean_x = []\nclean_y = []\nfor xi, yi in zip(x, y):\n    if yi is not None:\n        clean_x.append(xi)\n        clean_y.append(yi)\n\nprint(f'Original size: {len(x)}')\nprint(f'Clean size: {len(clean_x)}')\nprint(f'Removed: {len(x) - len(clean_x)} missing values')\nprint(f'\\nClean X: {clean_x}')\nprint(f'Clean Y: {clean_y}')\nprint(f'\\nY mean: {statistics.mean(clean_y):.2f}')",
        solution: "import statistics\n\nx = [1, 2, 3, 4, 5, 6]\ny = [2.1, 4.0, None, 7.9, 10.2, 12.0]\n\nclean_x = []\nclean_y = []\nfor xi, yi in zip(x, y):\n    if yi is not None:\n        clean_x.append(xi)\n        clean_y.append(yi)\n\nprint(f'Original size: {len(x)}')\nprint(f'Clean size: {len(clean_x)}')\nprint(f'Removed: {len(x) - len(clean_x)} missing values')\nprint(f'\\nClean X: {clean_x}')\nprint(f'Clean Y: {clean_y}')\nprint(f'\\nY mean: {statistics.mean(clean_y):.2f}')\nprint('\\nData is now ready for regression!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "5 clean data points", description: "Missing value handled" }]),
        hints: ["Check for None values", "Remove both x and y for that pair", "Must keep x and y aligned"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 15.1.2`);

  console.log("\n✅ Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
