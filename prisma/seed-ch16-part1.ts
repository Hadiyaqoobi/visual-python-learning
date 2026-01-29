import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 1: Chapter 16 structure + Lessons 16.1.1-16.1.2...\n");

  const chapter16 = await prisma.chapter.upsert({
    where: { number: 16 },
    update: {},
    create: {
      number: 16,
      title: "Random Walks and More About Data Visualization",
      description: "Extend random walk concepts with bias and drift. Master advanced data visualization techniques including multiple plots, heatmaps, and statistical analysis of simulations.",
      objectives: [
        "Implement biased random walks with drift",
        "Analyze random walk statistical properties",
        "Create multi-panel visualizations",
        "Build heatmaps and density plots",
        "Apply random walks to real-world modeling",
      ],
      isPublished: true,
    },
  });
  console.log(`✅ Chapter ${chapter16.number}: ${chapter16.title}`);

  const section16_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter16.id, number: 16.1 } },
    update: {},
    create: {
      chapterId: chapter16.id,
      number: 16.1,
      title: "Advanced Random Walks",
      description: "Extend random walks with bias, drift, and statistical analysis.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section16_1.number}: ${section16_1.title}`);

  const section16_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter16.id, number: 16.2 } },
    update: {},
    create: {
      chapterId: chapter16.id,
      number: 16.2,
      title: "2D Random Walks and Brownian Motion",
      description: "Explore random walks in two dimensions and their physical applications.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section16_2.number}: ${section16_2.title}`);

  const section16_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter16.id, number: 16.3 } },
    update: {},
    create: {
      chapterId: chapter16.id,
      number: 16.3,
      title: "Advanced Data Visualization",
      description: "Master matplotlib for multi-panel plots, heatmaps, and statistical visualization.",
      order: 3,
    },
  });
  console.log(`  📂 Section ${section16_3.number}: ${section16_3.title}`);

  const lesson16_1_1 = await prisma.lesson.upsert({
    where: { slug: "random-walks-revisited" },
    update: {},
    create: {
      sectionId: section16_1.id,
      number: 16.11,
      title: "Random Walks Revisited",
      slug: "random-walks-revisited",
      objectives: [
        "Review 1D random walk fundamentals",
        "Implement efficient walk simulations",
        "Track and analyze walk paths",
        "Understand expected distance from origin",
      ],
      content: `# Random Walks Revisited

## Review: The Basic Random Walk

At each step, move +1 or -1 with equal probability (50/50).

\`\`\`python
position += random.choice([-1, 1])
\`\`\`

## Key Properties

After n steps:
- **Expected position**: 0 (no bias)
- **Expected distance from origin**: √n
- **Variance of position**: n

## Why √n Distance?

This is a fundamental result! After 100 steps:
- Expected position = 0
- Expected |distance| ≈ 10 (not 50!)

The walker meanders back and forth, not making much net progress.

## Tracking Paths

Store entire path for analysis:

\`\`\`python
path = [0]  # Start at origin
for _ in range(n_steps):
    path.append(path[-1] + random.choice([-1, 1]))
\`\`\`

## Applications

- **Stock prices**: Daily returns as random steps
- **Particle diffusion**: Brownian motion
- **Gambling**: Running total of wins/losses
- **Search algorithms**: Random exploration`,
      codeExamples: JSON.stringify([
        {
          id: "basic-walk-review",
          title: "Basic Random Walk",
          code: "import random\n\ndef random_walk(n_steps):\n    \"\"\"Simulate 1D random walk, return final position\"\"\"\n    position = 0\n    for _ in range(n_steps):\n        step = random.choice([-1, 1])\n        position += step\n    return position\n\n# Run 10 walks of 100 steps\nprint('10 random walks of 100 steps:')\nfor i in range(10):\n    final = random_walk(100)\n    print(f'  Walk {i+1}: final position = {final:+d}')",
          description: "Basic 1D random walk",
        },
        {
          id: "track-path",
          title: "Tracking the Path",
          code: "import random\n\ndef walk_with_path(n_steps):\n    \"\"\"Return full path of random walk\"\"\"\n    path = [0]\n    for _ in range(n_steps):\n        step = random.choice([-1, 1])\n        path.append(path[-1] + step)\n    return path\n\npath = walk_with_path(20)\nprint('20-step walk path:')\nprint(path)\n\nprint(f'\\nStart: {path[0]}')\nprint(f'End: {path[-1]}')\nprint(f'Max: {max(path)}')\nprint(f'Min: {min(path)}')",
          description: "Store and analyze full path",
        },
        {
          id: "sqrt-n-distance",
          title: "Verifying √n Distance",
          code: "import random\nimport math\n\ndef random_walk(n):\n    pos = 0\n    for _ in range(n):\n        pos += random.choice([-1, 1])\n    return pos\n\nprint('Steps    Avg |Distance|    √n (theory)')\nfor n_steps in [100, 400, 1600, 6400]:\n    # Run 1000 walks\n    distances = [abs(random_walk(n_steps)) for _ in range(1000)]\n    avg_dist = sum(distances) / len(distances)\n    theory = math.sqrt(n_steps) * 0.8  # ~√(2n/π)\n    print(f'{n_steps:5d}    {avg_dist:10.1f}         {theory:.1f}')\n\nprint('\\nDistance grows as √n, not n!')",
          description: "Verify expected distance is √n",
        },
      ]),
      keyPoints: [
        "Random walk: position += random.choice([-1, 1])",
        "Expected position after n steps: 0",
        "Expected distance from origin: ~√n",
        "Track full path with list for analysis",
        "Variance of final position = n",
        "Models stocks, diffusion, gambling",
      ],
      hardwareDemo: "Watch position variable update each step. See path list grow in memory.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson16_1_1.number}: ${lesson16_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson16_1_1.id,
        number: 1,
        title: "Basic Random Walk",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Implement a random walk of 50 steps. Print starting position, final position, and total distance traveled.",
        starterCode: "import random\n\nposition = 0\nsteps_taken = 0\n\nfor _ in range(50):\n    step = random.choice([-1, 1])\n    position += step\n    steps_taken += 1\n\nprint(f'Started at: 0')\nprint(f'Ended at: {position}')\nprint(f'Steps taken: {steps_taken}')\nprint(f'Net displacement: {abs(position)}')",
        solution: "import random\n\nposition = 0\nsteps_taken = 0\n\nfor _ in range(50):\n    step = random.choice([-1, 1])\n    position += step\n    steps_taken += 1\n\nprint(f'Started at: 0')\nprint(f'Ended at: {position}')\nprint(f'Steps taken: {steps_taken}')\nprint(f'Net displacement: {abs(position)}')\nprint(f'Expected displacement: ~{50**0.5:.1f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Final position varies, ~7 expected displacement", description: "Random walk works" }]),
        hints: ["Use random.choice([-1, 1])", "Add step to position each time", "Net displacement = abs(final position)"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson16_1_1.id,
        number: 2,
        title: "Track Full Path",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a random walk that stores the entire path. Return path list and print: start, end, max position, min position.",
        starterCode: "import random\n\ndef walk_with_path(n_steps):\n    path = [0]\n    for _ in range(n_steps):\n        step = random.choice([-1, 1])\n        path.append(path[-1] + step)\n    return path\n\npath = walk_with_path(30)\n\nprint(f'Path: {path}')\nprint(f'Start: {path[0]}')\nprint(f'End: {path[-1]}')\nprint(f'Max: {max(path)}')\nprint(f'Min: {min(path)}')",
        solution: "import random\n\ndef walk_with_path(n_steps):\n    path = [0]\n    for _ in range(n_steps):\n        step = random.choice([-1, 1])\n        path.append(path[-1] + step)\n    return path\n\npath = walk_with_path(30)\n\nprint(f'Path: {path}')\nprint(f'Start: {path[0]}')\nprint(f'End: {path[-1]}')\nprint(f'Max: {max(path)}')\nprint(f'Min: {min(path)}')\nprint(f'Range: {max(path) - min(path)}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Path with 31 positions", description: "Full path tracked" }]),
        hints: ["Start path = [0]", "Append new position each step", "path[-1] gives current position"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson16_1_1.id,
        number: 3,
        title: "Average Final Position",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Run 1000 random walks of 100 steps each. Calculate average final position (should be ~0) and average distance from origin.",
        starterCode: "import random\n\ndef random_walk(n):\n    pos = 0\n    for _ in range(n):\n        pos += random.choice([-1, 1])\n    return pos\n\nfinal_positions = [random_walk(100) for _ in range(1000)]\n\navg_position = sum(final_positions) / len(final_positions)\navg_distance = sum(abs(p) for p in final_positions) / len(final_positions)\n\nprint(f'1000 walks of 100 steps:')\nprint(f'Average final position: {avg_position:.2f} (expected: 0)')\nprint(f'Average distance from origin: {avg_distance:.2f} (expected: ~8)')",
        solution: "import random\n\ndef random_walk(n):\n    pos = 0\n    for _ in range(n):\n        pos += random.choice([-1, 1])\n    return pos\n\nfinal_positions = [random_walk(100) for _ in range(1000)]\n\navg_position = sum(final_positions) / len(final_positions)\navg_distance = sum(abs(p) for p in final_positions) / len(final_positions)\n\nprint(f'1000 walks of 100 steps:')\nprint(f'Average final position: {avg_position:.2f} (expected: 0)')\nprint(f'Average distance from origin: {avg_distance:.2f} (expected: ~8)')\nprint(f'√100 = 10, actual ~8 due to mean absolute deviation')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Avg position ~0, avg distance ~8", description: "Statistics verified" }]),
        hints: ["Average position should be near 0", "Average distance is about √n * 0.8", "Run 1000 walks for good statistics"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson16_1_1.id,
        number: 4,
        title: "Verify √n Scaling",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Compare average distance for walks of 25, 100, 400, and 1600 steps. Verify distance scales as √n (doubles when n quadruples).",
        starterCode: "import random\nimport math\n\ndef random_walk(n):\n    pos = 0\n    for _ in range(n):\n        pos += random.choice([-1, 1])\n    return pos\n\nprint('Steps   Avg Distance   √n     Ratio')\nprev_dist = None\n\nfor n in [25, 100, 400, 1600]:\n    distances = [abs(random_walk(n)) for _ in range(500)]\n    avg = sum(distances) / len(distances)\n    sqrt_n = math.sqrt(n)\n    \n    if prev_dist:\n        ratio = avg / prev_dist\n        print(f'{n:5d}   {avg:8.1f}       {sqrt_n:5.1f}   {ratio:.2f}x')\n    else:\n        print(f'{n:5d}   {avg:8.1f}       {sqrt_n:5.1f}   -')\n    prev_dist = avg",
        solution: "import random\nimport math\n\ndef random_walk(n):\n    pos = 0\n    for _ in range(n):\n        pos += random.choice([-1, 1])\n    return pos\n\nprint('Steps   Avg Distance   √n     Ratio')\nprev_dist = None\n\nfor n in [25, 100, 400, 1600]:\n    distances = [abs(random_walk(n)) for _ in range(500)]\n    avg = sum(distances) / len(distances)\n    sqrt_n = math.sqrt(n)\n    \n    if prev_dist:\n        ratio = avg / prev_dist\n        print(f'{n:5d}   {avg:8.1f}       {sqrt_n:5.1f}   {ratio:.2f}x')\n    else:\n        print(f'{n:5d}   {avg:8.1f}       {sqrt_n:5.1f}   -')\n    prev_dist = avg\n\nprint('\\nRatio ~2x each time (4x steps → 2x distance)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Ratio ~2x each time", description: "√n scaling verified" }]),
        hints: ["4x more steps → 2x distance", "Each row should double previous", "This is the √n law"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson16_1_1.id,
        number: 5,
        title: "First Return to Origin",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Simulate walks until they return to origin (position = 0). Run 100 trials, find average steps to return. (Limit to 10000 steps max)",
        starterCode: "import random\n\ndef steps_to_return(max_steps=10000):\n    \"\"\"Walk until return to origin, return step count\"\"\"\n    pos = 0\n    for step in range(1, max_steps + 1):\n        pos += random.choice([-1, 1])\n        if pos == 0:\n            return step\n    return max_steps  # Didn't return in time\n\nreturn_times = [steps_to_return() for _ in range(100)]\n\nprint(f'100 trials of return to origin:')\nprint(f'Average steps: {sum(return_times)/len(return_times):.1f}')\nprint(f'Min: {min(return_times)}')\nprint(f'Max: {max(return_times)}')\nprint(f'Returned in under 100 steps: {sum(1 for t in return_times if t < 100)}')",
        solution: "import random\n\ndef steps_to_return(max_steps=10000):\n    pos = 0\n    for step in range(1, max_steps + 1):\n        pos += random.choice([-1, 1])\n        if pos == 0:\n            return step\n    return max_steps\n\nreturn_times = [steps_to_return() for _ in range(100)]\n\nprint(f'100 trials of return to origin:')\nprint(f'Average steps: {sum(return_times)/len(return_times):.1f}')\nprint(f'Min: {min(return_times)}')\nprint(f'Max: {max(return_times)}')\nprint(f'Returned in under 100 steps: {sum(1 for t in return_times if t < 100)}')\nprint('\\nNote: Mean return time is infinite in theory!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Various return times", description: "Return time analysis" }]),
        hints: ["Check if pos == 0 after each step", "Return step number when it happens", "Some walks take very long to return"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 16.1.1`);

  const lesson16_1_2 = await prisma.lesson.upsert({
    where: { slug: "biased-random-walks" },
    update: {},
    create: {
      sectionId: section16_1.id,
      number: 16.12,
      title: "Biased Random Walks (Drift)",
      slug: "biased-random-walks",
      objectives: [
        "Implement biased random walks",
        "Understand drift and its effects",
        "Calculate expected position with bias",
        "Model real-world phenomena with drift",
      ],
      content: `# Biased Random Walks (Drift)

## What is Bias?

In a **biased walk**, the probability of moving in one direction is not 50%.

\`\`\`python
# Biased walk: 60% chance to go right
if random.random() < 0.6:
    position += 1  # Right
else:
    position -= 1  # Left
\`\`\`

## Drift

**Drift** = the tendency to move in one direction over time.

With probability p of going right (+1):
- Expected step = p(+1) + (1-p)(-1) = 2p - 1
- After n steps: Expected position = n(2p - 1)

## Examples

| p | Drift per step | After 100 steps |
|---|----------------|-----------------|
| 0.5 | 0 | 0 |
| 0.6 | 0.2 | 20 |
| 0.7 | 0.4 | 40 |
| 0.55 | 0.1 | 10 |

## Real-World Applications

- **Stock with trend**: Upward drift in bull market
- **Biased coin**: Unfair gambling
- **Evolution**: Selection pressure as drift
- **Climate**: Warming trend as upward drift`,
      codeExamples: JSON.stringify([
        {
          id: "biased-walk",
          title: "Biased Random Walk",
          code: "import random\n\ndef biased_walk(n_steps, p_right=0.5):\n    \"\"\"Walk with probability p_right of going right\"\"\"\n    position = 0\n    for _ in range(n_steps):\n        if random.random() < p_right:\n            position += 1  # Right\n        else:\n            position -= 1  # Left\n    return position\n\n# Compare different biases\nprint('Bias    Avg Position (100 trials, 100 steps)')\nfor p in [0.5, 0.55, 0.6, 0.7]:\n    finals = [biased_walk(100, p) for _ in range(100)]\n    avg = sum(finals) / len(finals)\n    expected = 100 * (2*p - 1)\n    print(f'{p:.2f}    {avg:6.1f} (expected: {expected:.0f})')",
          description: "Walk with different bias levels",
        },
        {
          id: "drift-visualization",
          title: "Visualizing Drift",
          code: "import random\n\ndef walk_path(n_steps, p_right):\n    path = [0]\n    for _ in range(n_steps):\n        if random.random() < p_right:\n            path.append(path[-1] + 1)\n        else:\n            path.append(path[-1] - 1)\n    return path\n\n# Compare unbiased vs biased\npath_fair = walk_path(50, 0.5)\npath_biased = walk_path(50, 0.7)\n\nprint('Step  Fair(p=0.5)  Biased(p=0.7)')\nfor i in range(0, 51, 10):\n    print(f'{i:3d}   {path_fair[i]:+6d}       {path_biased[i]:+6d}')\n\nprint(f'\\nFair drift: 0 per step')\nprint(f'Biased drift: 0.4 per step')",
          description: "Compare fair vs biased walks",
        },
        {
          id: "stock-model",
          title: "Stock Price with Drift",
          code: "import random\n\ndef stock_walk(days, daily_drift=0.001, volatility=0.02):\n    \"\"\"Model stock price with drift (trend) and volatility\"\"\"\n    price = 100  # Start at $100\n    prices = [price]\n    \n    for _ in range(days):\n        # Random return with drift\n        change = daily_drift + random.gauss(0, volatility)\n        price *= (1 + change)\n        prices.append(price)\n    \n    return prices\n\n# Bull market (positive drift) vs Bear market (negative drift)\nbull = stock_walk(252, daily_drift=0.0003)  # ~8% annual\nbear = stock_walk(252, daily_drift=-0.0002)  # ~-5% annual\n\nprint('Day    Bull Market  Bear Market')\nfor day in [0, 50, 100, 150, 200, 252]:\n    print(f'{day:3d}    ${bull[day]:7.2f}    ${bear[day]:7.2f}')",
          description: "Stock prices as biased random walk",
        },
      ]),
      keyPoints: [
        "Biased walk: p ≠ 0.5 for direction",
        "Drift = expected step = 2p - 1",
        "Expected position after n steps = n × drift",
        "p > 0.5: positive drift (trending up)",
        "p < 0.5: negative drift (trending down)",
        "Models trends in stocks, evolution, climate",
      ],
      hardwareDemo: "Watch probability comparison in ALU. See position accumulate drift over many steps.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson16_1_2.number}: ${lesson16_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson16_1_2.id,
        number: 1,
        title: "Simple Biased Walk",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Implement a biased walk with p=0.6 (60% right). Run 100 steps and print final position. Expected: ~20.",
        starterCode: "import random\n\np_right = 0.6\nposition = 0\n\nfor _ in range(100):\n    if random.random() < p_right:\n        position += 1\n    else:\n        position -= 1\n\nprint(f'Bias: {p_right}')\nprint(f'Steps: 100')\nprint(f'Final position: {position}')\nprint(f'Expected: {100 * (2*p_right - 1):.0f}')",
        solution: "import random\n\np_right = 0.6\nposition = 0\n\nfor _ in range(100):\n    if random.random() < p_right:\n        position += 1\n    else:\n        position -= 1\n\nprint(f'Bias: {p_right}')\nprint(f'Steps: 100')\nprint(f'Final position: {position}')\nprint(f'Expected: {100 * (2*p_right - 1):.0f}')\nprint('\\nDrift of 0.2 per step → ~20 after 100 steps')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Position around 20", description: "Biased walk works" }]),
        hints: ["p=0.6 means 60% chance right", "Drift = 2×0.6 - 1 = 0.2", "100 steps × 0.2 = 20 expected"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson16_1_2.id,
        number: 2,
        title: "Compare Bias Levels",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Run 500 walks of 200 steps for p=0.5, 0.55, 0.6, 0.65. Calculate average final position for each. Verify it matches n×(2p-1).",
        starterCode: "import random\n\ndef biased_walk(n, p):\n    pos = 0\n    for _ in range(n):\n        pos += 1 if random.random() < p else -1\n    return pos\n\nn_steps = 200\nprint('p      Avg Position   Expected')\n\nfor p in [0.5, 0.55, 0.6, 0.65]:\n    finals = [biased_walk(n_steps, p) for _ in range(500)]\n    avg = sum(finals) / len(finals)\n    expected = n_steps * (2*p - 1)\n    print(f'{p:.2f}   {avg:8.1f}        {expected:.0f}')",
        solution: "import random\n\ndef biased_walk(n, p):\n    pos = 0\n    for _ in range(n):\n        pos += 1 if random.random() < p else -1\n    return pos\n\nn_steps = 200\nprint('p      Avg Position   Expected')\n\nfor p in [0.5, 0.55, 0.6, 0.65]:\n    finals = [biased_walk(n_steps, p) for _ in range(500)]\n    avg = sum(finals) / len(finals)\n    expected = n_steps * (2*p - 1)\n    print(f'{p:.2f}   {avg:8.1f}        {expected:.0f}')\n\nprint('\\nAverage matches n×(2p-1) formula!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Averages match expected", description: "Drift formula verified" }]),
        hints: ["Expected = n × (2p - 1)", "p=0.5: drift=0, p=0.6: drift=0.2", "More bias → more drift"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson16_1_2.id,
        number: 3,
        title: "Track Biased Path",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Track full path of a biased walk (p=0.65, 50 steps). Print position at steps 0, 10, 20, 30, 40, 50. Show the drift accumulating.",
        starterCode: "import random\n\ndef biased_path(n, p):\n    path = [0]\n    for _ in range(n):\n        step = 1 if random.random() < p else -1\n        path.append(path[-1] + step)\n    return path\n\npath = biased_path(50, 0.65)\n\nprint('Step   Position   Expected')\nfor step in [0, 10, 20, 30, 40, 50]:\n    expected = step * (2*0.65 - 1)\n    print(f'{step:3d}    {path[step]:+5d}      {expected:+.0f}')",
        solution: "import random\n\ndef biased_path(n, p):\n    path = [0]\n    for _ in range(n):\n        step = 1 if random.random() < p else -1\n        path.append(path[-1] + step)\n    return path\n\npath = biased_path(50, 0.65)\n\nprint('Step   Position   Expected')\nfor step in [0, 10, 20, 30, 40, 50]:\n    expected = step * (2*0.65 - 1)\n    print(f'{step:3d}    {path[step]:+5d}      {expected:+.0f}')\n\nprint('\\nPosition trends upward due to positive drift!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Increasing positions", description: "Drift visible in path" }]),
        hints: ["Drift = 0.3 per step", "After 50 steps, expect ~15", "Position should generally increase"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson16_1_2.id,
        number: 4,
        title: "Negative Drift",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement walks with negative drift (p=0.4, favoring left). Run 100 walks of 100 steps. Verify average position is negative (~-20).",
        starterCode: "import random\n\ndef biased_walk(n, p):\n    pos = 0\n    for _ in range(n):\n        pos += 1 if random.random() < p else -1\n    return pos\n\np_right = 0.4  # Negative drift (favors left)\nfinals = [biased_walk(100, p_right) for _ in range(100)]\n\navg = sum(finals) / len(finals)\nexpected = 100 * (2*p_right - 1)\n\nprint(f'p = {p_right} (favors LEFT)')\nprint(f'Average position: {avg:.1f}')\nprint(f'Expected: {expected:.0f}')\nprint(f'All negatives? {all(f < 10 for f in finals)}')",
        solution: "import random\n\ndef biased_walk(n, p):\n    pos = 0\n    for _ in range(n):\n        pos += 1 if random.random() < p else -1\n    return pos\n\np_right = 0.4\nfinals = [biased_walk(100, p_right) for _ in range(100)]\n\navg = sum(finals) / len(finals)\nexpected = 100 * (2*p_right - 1)\n\nprint(f'p = {p_right} (favors LEFT)')\nprint(f'Average position: {avg:.1f}')\nprint(f'Expected: {expected:.0f}')\nprint(f'Most are negative? {sum(1 for f in finals if f < 0)} / 100')\nprint('\\nNegative drift pulls walker to the left!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Average around -20", description: "Negative drift works" }]),
        hints: ["p=0.4 means 40% right, 60% left", "Drift = 2×0.4 - 1 = -0.2", "Walker tends to go left"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson16_1_2.id,
        number: 5,
        title: "Stock Price Model",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Model stock price: start at $100, each day multiply by (1 + drift + noise). drift=0.001, noise=gauss(0, 0.02). Simulate 252 days (1 year), show final price.",
        starterCode: "import random\n\ndef stock_simulation(days, start_price, drift, volatility):\n    prices = [start_price]\n    price = start_price\n    \n    for _ in range(days):\n        daily_return = drift + random.gauss(0, volatility)\n        price *= (1 + daily_return)\n        prices.append(price)\n    \n    return prices\n\nprices = stock_simulation(252, 100, 0.001, 0.02)\n\nprint(f'Stock Simulation (1 year)')\nprint(f'Start: ${prices[0]:.2f}')\nprint(f'End: ${prices[-1]:.2f}')\nprint(f'Change: {(prices[-1]/prices[0] - 1)*100:+.1f}%')\nprint(f'Max: ${max(prices):.2f}')\nprint(f'Min: ${min(prices):.2f}')",
        solution: "import random\n\ndef stock_simulation(days, start_price, drift, volatility):\n    prices = [start_price]\n    price = start_price\n    \n    for _ in range(days):\n        daily_return = drift + random.gauss(0, volatility)\n        price *= (1 + daily_return)\n        prices.append(price)\n    \n    return prices\n\nprices = stock_simulation(252, 100, 0.001, 0.02)\n\nprint(f'Stock Simulation (1 year)')\nprint(f'Start: ${prices[0]:.2f}')\nprint(f'End: ${prices[-1]:.2f}')\nprint(f'Change: {(prices[-1]/prices[0] - 1)*100:+.1f}%')\nprint(f'Max: ${max(prices):.2f}')\nprint(f'Min: ${min(prices):.2f}')\nprint(f'\\nExpected annual return: ~{252*0.001*100:.0f}% (with volatility)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Price with positive trend", description: "Stock model works" }]),
        hints: ["drift=0.001 is ~25% annual", "Volatility adds randomness", "Price should trend upward on average"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 16.1.2`);

  console.log("\n✅ Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
