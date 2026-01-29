import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 2: Lessons 16.1.3, 16.2.1, 16.2.2...\n");

  const section16_1 = await prisma.section.findFirst({ where: { number: 16.1 } });
  const section16_2 = await prisma.section.findFirst({ where: { number: 16.2 } });
  if (!section16_1 || !section16_2) throw new Error("Sections not found. Run part 1 first.");

  const lesson16_1_3 = await prisma.lesson.upsert({
    where: { slug: "analyzing-walk-properties" },
    update: {},
    create: {
      sectionId: section16_1.id,
      number: 16.13,
      title: "Analyzing Random Walk Properties",
      slug: "analyzing-walk-properties",
      objectives: [
        "Calculate variance of final position",
        "Analyze distribution of endpoints",
        "Compute hitting times and probabilities",
        "Understand statistical properties of walks",
      ],
      content: `# Analyzing Random Walk Properties

## Variance of Final Position

For unbiased walk after n steps:
- **Mean position**: 0
- **Variance**: n
- **Standard deviation**: √n

This means positions spread out as √n over time.

## Distribution of Endpoints

After many steps, final positions follow approximately normal distribution:
- Centered at expected position (0 for unbiased)
- Standard deviation = √n

## Hitting Probabilities

Probability questions:
- Will walker reach position +10 before -10?
- How long until walker hits a boundary?

For unbiased walk between -a and +b:
- P(hit +b first) = a / (a + b)

## Maximum Displacement

The furthest point reached during a walk:
- Expected max ≈ √(2n/π) × √n ≈ 0.8√n
- Maximum is usually larger than final position`,
      codeExamples: JSON.stringify([
        {
          id: "variance-analysis",
          title: "Variance Analysis",
          code: "import random\nimport statistics\n\ndef random_walk(n):\n    pos = 0\n    for _ in range(n):\n        pos += random.choice([-1, 1])\n    return pos\n\nprint('Steps   Mean    Variance   Theory(n)')\nfor n in [100, 400, 900, 1600]:\n    finals = [random_walk(n) for _ in range(1000)]\n    mean = statistics.mean(finals)\n    var = statistics.variance(finals)\n    print(f'{n:5d}   {mean:+5.1f}   {var:8.1f}   {n}')\n\nprint('\\nVariance = n (as expected!)')",
          description: "Verify variance equals n",
        },
        {
          id: "hitting-probability",
          title: "Hitting Probabilities",
          code: "import random\n\ndef first_hit(target_up, target_down, max_steps=10000):\n    \"\"\"Which boundary is hit first?\"\"\"\n    pos = 0\n    for _ in range(max_steps):\n        pos += random.choice([-1, 1])\n        if pos >= target_up:\n            return 'up'\n        if pos <= target_down:\n            return 'down'\n    return 'neither'\n\n# Probability of hitting +10 before -5\nhits = [first_hit(10, -5) for _ in range(1000)]\nup_count = hits.count('up')\ndown_count = hits.count('down')\n\nprint(f'Target: +10 (up) vs -5 (down)')\nprint(f'Hit up first: {up_count}/1000 = {up_count/10:.1f}%')\nprint(f'Hit down first: {down_count}/1000 = {down_count/10:.1f}%')\nprint(f'Theory: P(up) = 5/(5+10) = 33.3%')",
          description: "Probability of hitting boundaries",
        },
        {
          id: "max-displacement",
          title: "Maximum Displacement",
          code: "import random\nimport math\n\ndef walk_with_max(n):\n    pos = 0\n    max_pos = 0\n    min_pos = 0\n    for _ in range(n):\n        pos += random.choice([-1, 1])\n        max_pos = max(max_pos, pos)\n        min_pos = min(min_pos, pos)\n    return pos, max_pos, min_pos\n\nprint('Walk analysis (1000 walks of 400 steps):')\nfinals, maxes, mins = [], [], []\nfor _ in range(1000):\n    final, mx, mn = walk_with_max(400)\n    finals.append(abs(final))\n    maxes.append(mx)\n    mins.append(abs(mn))\n\nprint(f'Avg |final|: {sum(finals)/1000:.1f}')\nprint(f'Avg max: {sum(maxes)/1000:.1f}')\nprint(f'Avg |min|: {sum(mins)/1000:.1f}')\nprint(f'√400 = {math.sqrt(400):.1f}')",
          description: "Maximum excursion from origin",
        },
      ]),
      keyPoints: [
        "Variance of final position = n",
        "Standard deviation = √n",
        "Endpoints approximately normal distribution",
        "P(hit +b before -a) = a/(a+b)",
        "Max displacement > final position typically",
        "Expected max ≈ 0.8√n",
      ],
      hardwareDemo: "Watch variance calculation accumulate. See boundary checking in loop.",
      estimatedTime: 25,
      difficulty: "ADVANCED",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson16_1_3.number}: ${lesson16_1_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson16_1_3.id,
        number: 1,
        title: "Calculate Variance",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Run 500 walks of 225 steps. Calculate variance of final positions. Should be close to 225.",
        starterCode: "import random\nimport statistics\n\ndef random_walk(n):\n    pos = 0\n    for _ in range(n):\n        pos += random.choice([-1, 1])\n    return pos\n\nfinals = [random_walk(225) for _ in range(500)]\n\nmean = statistics.mean(finals)\nvar = statistics.variance(finals)\nstd = statistics.stdev(finals)\n\nprint(f'500 walks of 225 steps:')\nprint(f'Mean: {mean:.2f} (expected: 0)')\nprint(f'Variance: {var:.1f} (expected: 225)')\nprint(f'Std Dev: {std:.1f} (expected: 15)')",
        solution: "import random\nimport statistics\n\ndef random_walk(n):\n    pos = 0\n    for _ in range(n):\n        pos += random.choice([-1, 1])\n    return pos\n\nfinals = [random_walk(225) for _ in range(500)]\n\nmean = statistics.mean(finals)\nvar = statistics.variance(finals)\nstd = statistics.stdev(finals)\n\nprint(f'500 walks of 225 steps:')\nprint(f'Mean: {mean:.2f} (expected: 0)')\nprint(f'Variance: {var:.1f} (expected: 225)')\nprint(f'Std Dev: {std:.1f} (expected: 15)')\nprint('\\nVariance = n confirmed!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Variance near 225", description: "Variance = n" }]),
        hints: ["Use statistics.variance()", "Expected variance = n = 225", "Std dev = √225 = 15"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson16_1_3.id,
        number: 2,
        title: "Endpoint Distribution",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Run 1000 walks of 100 steps. Count how many end in ranges: [-20,-10], [-10,0], [0,10], [10,20]. Should be roughly bell-shaped.",
        starterCode: "import random\n\ndef random_walk(n):\n    pos = 0\n    for _ in range(n):\n        pos += random.choice([-1, 1])\n    return pos\n\nfinals = [random_walk(100) for _ in range(1000)]\n\n# Count in bins\nbins = {'[-30,-20]': 0, '[-20,-10]': 0, '[-10,0]': 0, \n        '[0,10]': 0, '[10,20]': 0, '[20,30]': 0}\n\nfor f in finals:\n    if -30 <= f < -20: bins['[-30,-20]'] += 1\n    elif -20 <= f < -10: bins['[-20,-10]'] += 1\n    elif -10 <= f < 0: bins['[-10,0]'] += 1\n    elif 0 <= f < 10: bins['[0,10]'] += 1\n    elif 10 <= f < 20: bins['[10,20]'] += 1\n    elif 20 <= f <= 30: bins['[20,30]'] += 1\n\nprint('Range        Count')\nfor r, c in bins.items():\n    bar = '#' * (c // 10)\n    print(f'{r:12s} {c:4d} {bar}')",
        solution: "import random\n\ndef random_walk(n):\n    pos = 0\n    for _ in range(n):\n        pos += random.choice([-1, 1])\n    return pos\n\nfinals = [random_walk(100) for _ in range(1000)]\n\nbins = {'[-30,-20]': 0, '[-20,-10]': 0, '[-10,0]': 0, \n        '[0,10]': 0, '[10,20]': 0, '[20,30]': 0}\n\nfor f in finals:\n    if -30 <= f < -20: bins['[-30,-20]'] += 1\n    elif -20 <= f < -10: bins['[-20,-10]'] += 1\n    elif -10 <= f < 0: bins['[-10,0]'] += 1\n    elif 0 <= f < 10: bins['[0,10]'] += 1\n    elif 10 <= f < 20: bins['[10,20]'] += 1\n    elif 20 <= f <= 30: bins['[20,30]'] += 1\n\nprint('Range        Count')\nfor r, c in bins.items():\n    bar = '#' * (c // 10)\n    print(f'{r:12s} {c:4d} {bar}')\n\nprint('\\nBell-shaped distribution!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Bell-shaped histogram", description: "Normal distribution" }]),
        hints: ["Most endpoints near 0", "Fewer at extremes", "Forms bell curve shape"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson16_1_3.id,
        number: 3,
        title: "Hitting Probability",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Walker between barriers at -20 and +10. Run 500 trials. Count hits at each barrier. Theory: P(hit +10) = 20/30 = 66.7%.",
        starterCode: "import random\n\ndef first_hit(up, down):\n    pos = 0\n    while True:\n        pos += random.choice([-1, 1])\n        if pos >= up:\n            return 'up'\n        if pos <= down:\n            return 'down'\n\nresults = [first_hit(10, -20) for _ in range(500)]\nup_hits = results.count('up')\ndown_hits = results.count('down')\n\nprint(f'Barriers: +10 (up), -20 (down)')\nprint(f'Hit up: {up_hits}/500 = {up_hits/5:.1f}%')\nprint(f'Hit down: {down_hits}/500 = {down_hits/5:.1f}%')\nprint(f'Theory P(up) = 20/(20+10) = {20/30*100:.1f}%')",
        solution: "import random\n\ndef first_hit(up, down):\n    pos = 0\n    while True:\n        pos += random.choice([-1, 1])\n        if pos >= up:\n            return 'up'\n        if pos <= down:\n            return 'down'\n\nresults = [first_hit(10, -20) for _ in range(500)]\nup_hits = results.count('up')\ndown_hits = results.count('down')\n\nprint(f'Barriers: +10 (up), -20 (down)')\nprint(f'Hit up: {up_hits}/500 = {up_hits/5:.1f}%')\nprint(f'Hit down: {down_hits}/500 = {down_hits/5:.1f}%')\nprint(f'Theory P(up) = 20/(20+10) = {20/30*100:.1f}%')\nprint('\\nCloser barrier is hit less often!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "~67% hit up", description: "Hitting probability verified" }]),
        hints: ["P(hit +b first) = a/(a+b)", "a=20, b=10, so P = 20/30", "Closer barrier hit less often"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson16_1_3.id,
        number: 4,
        title: "Maximum Displacement",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Track max and min positions during 256-step walks. Run 500 trials. Compare average |final| to average max reached.",
        starterCode: "import random\n\ndef walk_stats(n):\n    pos = 0\n    max_pos = 0\n    min_pos = 0\n    for _ in range(n):\n        pos += random.choice([-1, 1])\n        max_pos = max(max_pos, pos)\n        min_pos = min(min_pos, pos)\n    return abs(pos), max_pos, abs(min_pos)\n\nfinal_dists = []\nmax_ups = []\nmax_downs = []\n\nfor _ in range(500):\n    final, mx, mn = walk_stats(256)\n    final_dists.append(final)\n    max_ups.append(mx)\n    max_downs.append(mn)\n\nprint(f'256-step walks (500 trials):')\nprint(f'Avg |final|: {sum(final_dists)/500:.1f}')\nprint(f'Avg max up: {sum(max_ups)/500:.1f}')\nprint(f'Avg max down: {sum(max_downs)/500:.1f}')\nprint(f'√256 = 16')",
        solution: "import random\n\ndef walk_stats(n):\n    pos = 0\n    max_pos = 0\n    min_pos = 0\n    for _ in range(n):\n        pos += random.choice([-1, 1])\n        max_pos = max(max_pos, pos)\n        min_pos = min(min_pos, pos)\n    return abs(pos), max_pos, abs(min_pos)\n\nfinal_dists = []\nmax_ups = []\nmax_downs = []\n\nfor _ in range(500):\n    final, mx, mn = walk_stats(256)\n    final_dists.append(final)\n    max_ups.append(mx)\n    max_downs.append(mn)\n\nprint(f'256-step walks (500 trials):')\nprint(f'Avg |final|: {sum(final_dists)/500:.1f}')\nprint(f'Avg max up: {sum(max_ups)/500:.1f}')\nprint(f'Avg max down: {sum(max_downs)/500:.1f}')\nprint(f'√256 = 16')\nprint('\\nMax reached > final position!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Max > final typically", description: "Maximum excursion" }]),
        hints: ["Track max and min during walk", "Max reached is usually > final", "Walker wanders before settling"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson16_1_3.id,
        number: 5,
        title: "Time to Hit Target",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "How many steps to first reach position +10? Run 200 trials, find average and max hitting time.",
        starterCode: "import random\n\ndef steps_to_hit(target, max_steps=50000):\n    pos = 0\n    for step in range(1, max_steps + 1):\n        pos += random.choice([-1, 1])\n        if pos == target:\n            return step\n    return max_steps\n\ntarget = 10\nhitting_times = [steps_to_hit(target) for _ in range(200)]\n\nprint(f'Steps to reach +{target} (200 trials):')\nprint(f'Average: {sum(hitting_times)/200:.0f}')\nprint(f'Min: {min(hitting_times)}')\nprint(f'Max: {max(hitting_times)}')\nprint(f'Median: {sorted(hitting_times)[100]}')",
        solution: "import random\n\ndef steps_to_hit(target, max_steps=50000):\n    pos = 0\n    for step in range(1, max_steps + 1):\n        pos += random.choice([-1, 1])\n        if pos == target:\n            return step\n    return max_steps\n\ntarget = 10\nhitting_times = [steps_to_hit(target) for _ in range(200)]\n\nprint(f'Steps to reach +{target} (200 trials):')\nprint(f'Average: {sum(hitting_times)/200:.0f}')\nprint(f'Min: {min(hitting_times)}')\nprint(f'Max: {max(hitting_times)}')\nprint(f'Median: {sorted(hitting_times)[100]}')\nprint(f'\\nExpected hitting time = target² = {target**2}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Average near 100", description: "Hitting time analysis" }]),
        hints: ["Expected time to hit ±n is n²", "To hit +10: expect ~100 steps", "Variance is huge though"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 16.1.3`);

  const lesson16_2_1 = await prisma.lesson.upsert({
    where: { slug: "2d-random-walk-patterns" },
    update: {},
    create: {
      sectionId: section16_2.id,
      number: 16.21,
      title: "2D Random Walk Patterns",
      slug: "2d-random-walk-patterns",
      objectives: [
        "Implement 2D random walks",
        "Track x,y positions over time",
        "Calculate distance from origin",
        "Analyze 2D walk statistics",
      ],
      content: `# 2D Random Walk Patterns

## Moving to Two Dimensions

In 2D, walker can move in 4 directions: N, S, E, W

\`\`\`python
directions = [(0,1), (0,-1), (1,0), (-1,0)]  # N, S, E, W
dx, dy = random.choice(directions)
x += dx
y += dy
\`\`\`

## Distance from Origin

Use Euclidean distance: d = √(x² + y²)

After n steps:
- Expected distance ≈ √n (similar to 1D!)
- Walker diffuses outward over time

## 2D Walk Properties

- Returns to origin eventually (but takes longer than 1D)
- Path fills space more uniformly
- Used for modeling: animal foraging, molecular diffusion

## Tracking the Path

Store (x, y) pairs for visualization:

\`\`\`python
path = [(0, 0)]
for _ in range(n):
    # ... update x, y
    path.append((x, y))
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-2d-walk",
          title: "Basic 2D Random Walk",
          code: "import random\nimport math\n\ndef walk_2d(n_steps):\n    x, y = 0, 0\n    directions = [(0,1), (0,-1), (1,0), (-1,0)]  # N,S,E,W\n    \n    for _ in range(n_steps):\n        dx, dy = random.choice(directions)\n        x += dx\n        y += dy\n    \n    return x, y\n\nprint('10 random 2D walks of 100 steps:')\nfor i in range(10):\n    x, y = walk_2d(100)\n    dist = math.sqrt(x**2 + y**2)\n    print(f'  Walk {i+1}: ({x:+3d}, {y:+3d}), dist = {dist:.1f}')",
          description: "Basic 2D walk implementation",
        },
        {
          id: "2d-path-tracking",
          title: "Tracking 2D Path",
          code: "import random\n\ndef walk_2d_path(n_steps):\n    x, y = 0, 0\n    path = [(x, y)]\n    directions = [(0,1), (0,-1), (1,0), (-1,0)]\n    \n    for _ in range(n_steps):\n        dx, dy = random.choice(directions)\n        x += dx\n        y += dy\n        path.append((x, y))\n    \n    return path\n\npath = walk_2d_path(20)\nprint('20-step 2D walk path:')\nfor i, (x, y) in enumerate(path):\n    if i % 5 == 0:\n        print(f'  Step {i:2d}: ({x:+2d}, {y:+2d})')",
          description: "Store full 2D path",
        },
        {
          id: "2d-distance-stats",
          title: "2D Distance Statistics",
          code: "import random\nimport math\n\ndef walk_2d(n):\n    x, y = 0, 0\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    for _ in range(n):\n        dx, dy = random.choice(dirs)\n        x, y = x+dx, y+dy\n    return math.sqrt(x**2 + y**2)\n\nprint('Steps   Avg Distance   √n')\nfor n in [100, 400, 900, 1600]:\n    dists = [walk_2d(n) for _ in range(500)]\n    avg = sum(dists) / len(dists)\n    print(f'{n:5d}   {avg:8.1f}       {math.sqrt(n):.1f}')\n\nprint('\\nDistance grows as √n in 2D too!')",
          description: "Verify √n scaling in 2D",
        },
      ]),
      keyPoints: [
        "2D walk: move N, S, E, or W randomly",
        "Track position as (x, y) coordinates",
        "Distance = √(x² + y²)",
        "Expected distance still ~√n",
        "Path can be stored as list of (x,y) tuples",
        "Models diffusion, foraging, exploration",
      ],
      hardwareDemo: "Watch x,y coordinates update. See distance calculation with sqrt.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson16_2_1.number}: ${lesson16_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson16_2_1.id,
        number: 1,
        title: "Basic 2D Walk",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Implement a 2D walk of 50 steps. Print starting position (0,0), final position, and distance from origin.",
        starterCode: "import random\nimport math\n\nx, y = 0, 0\ndirections = [(0,1), (0,-1), (1,0), (-1,0)]  # N,S,E,W\n\nfor _ in range(50):\n    dx, dy = random.choice(directions)\n    x += dx\n    y += dy\n\ndist = math.sqrt(x**2 + y**2)\n\nprint(f'Start: (0, 0)')\nprint(f'End: ({x}, {y})')\nprint(f'Distance from origin: {dist:.2f}')",
        solution: "import random\nimport math\n\nx, y = 0, 0\ndirections = [(0,1), (0,-1), (1,0), (-1,0)]\n\nfor _ in range(50):\n    dx, dy = random.choice(directions)\n    x += dx\n    y += dy\n\ndist = math.sqrt(x**2 + y**2)\n\nprint(f'Start: (0, 0)')\nprint(f'End: ({x}, {y})')\nprint(f'Distance from origin: {dist:.2f}')\nprint(f'Expected distance: ~{math.sqrt(50):.1f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Distance around 7", description: "2D walk works" }]),
        hints: ["4 directions: N,S,E,W", "Distance = sqrt(x² + y²)", "Expected ~√50 ≈ 7"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson16_2_1.id,
        number: 2,
        title: "Track 2D Path",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Track full path of 30-step 2D walk. Print position at steps 0, 10, 20, 30.",
        starterCode: "import random\n\ndef walk_2d_path(n):\n    x, y = 0, 0\n    path = [(x, y)]\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    \n    for _ in range(n):\n        dx, dy = random.choice(dirs)\n        x, y = x + dx, y + dy\n        path.append((x, y))\n    return path\n\npath = walk_2d_path(30)\n\nprint('Step   Position')\nfor step in [0, 10, 20, 30]:\n    x, y = path[step]\n    print(f'{step:3d}    ({x:+3d}, {y:+3d})')",
        solution: "import random\n\ndef walk_2d_path(n):\n    x, y = 0, 0\n    path = [(x, y)]\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    \n    for _ in range(n):\n        dx, dy = random.choice(dirs)\n        x, y = x + dx, y + dy\n        path.append((x, y))\n    return path\n\npath = walk_2d_path(30)\n\nprint('Step   Position')\nfor step in [0, 10, 20, 30]:\n    x, y = path[step]\n    print(f'{step:3d}    ({x:+3d}, {y:+3d})')\n\nprint(f'\\nPath has {len(path)} positions')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "4 positions shown", description: "Path tracked" }]),
        hints: ["Store (x,y) after each step", "Path has n+1 positions", "Index 0 is start, n is end"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson16_2_1.id,
        number: 3,
        title: "2D Distance Statistics",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Run 500 2D walks of 100 steps. Calculate average distance from origin. Should be close to √100 = 10.",
        starterCode: "import random\nimport math\n\ndef walk_2d_distance(n):\n    x, y = 0, 0\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    for _ in range(n):\n        dx, dy = random.choice(dirs)\n        x, y = x + dx, y + dy\n    return math.sqrt(x**2 + y**2)\n\ndistances = [walk_2d_distance(100) for _ in range(500)]\n\navg_dist = sum(distances) / len(distances)\n\nprint(f'500 walks of 100 steps:')\nprint(f'Average distance: {avg_dist:.2f}')\nprint(f'Expected (√n): {math.sqrt(100):.2f}')",
        solution: "import random\nimport math\n\ndef walk_2d_distance(n):\n    x, y = 0, 0\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    for _ in range(n):\n        dx, dy = random.choice(dirs)\n        x, y = x + dx, y + dy\n    return math.sqrt(x**2 + y**2)\n\ndistances = [walk_2d_distance(100) for _ in range(500)]\n\navg_dist = sum(distances) / len(distances)\n\nprint(f'500 walks of 100 steps:')\nprint(f'Average distance: {avg_dist:.2f}')\nprint(f'Expected (√n): {math.sqrt(100):.2f}')\nprint('\\n√n scaling works in 2D!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Average around 10", description: "√n scaling in 2D" }]),
        hints: ["Run many walks for statistics", "Average should be near √100 = 10", "2D follows same √n law"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson16_2_1.id,
        number: 4,
        title: "2D Walk Bounding Box",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Track a 200-step 2D walk. Find the bounding box (min_x, max_x, min_y, max_y) that contains the entire path.",
        starterCode: "import random\n\ndef walk_with_bounds(n):\n    x, y = 0, 0\n    min_x = max_x = min_y = max_y = 0\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    \n    for _ in range(n):\n        dx, dy = random.choice(dirs)\n        x, y = x + dx, y + dy\n        min_x, max_x = min(min_x, x), max(max_x, x)\n        min_y, max_y = min(min_y, y), max(max_y, y)\n    \n    return (x, y), (min_x, max_x, min_y, max_y)\n\nfinal, bounds = walk_with_bounds(200)\nmin_x, max_x, min_y, max_y = bounds\n\nprint(f'200-step 2D walk:')\nprint(f'Final position: {final}')\nprint(f'Bounding box:')\nprint(f'  X: {min_x} to {max_x} (width: {max_x - min_x})')\nprint(f'  Y: {min_y} to {max_y} (height: {max_y - min_y})')",
        solution: "import random\n\ndef walk_with_bounds(n):\n    x, y = 0, 0\n    min_x = max_x = min_y = max_y = 0\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    \n    for _ in range(n):\n        dx, dy = random.choice(dirs)\n        x, y = x + dx, y + dy\n        min_x, max_x = min(min_x, x), max(max_x, x)\n        min_y, max_y = min(min_y, y), max(max_y, y)\n    \n    return (x, y), (min_x, max_x, min_y, max_y)\n\nfinal, bounds = walk_with_bounds(200)\nmin_x, max_x, min_y, max_y = bounds\n\nprint(f'200-step 2D walk:')\nprint(f'Final position: {final}')\nprint(f'Bounding box:')\nprint(f'  X: {min_x} to {max_x} (width: {max_x - min_x})')\nprint(f'  Y: {min_y} to {max_y} (height: {max_y - min_y})')\nprint('\\nBox shows how far walker explored')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Bounding box calculated", description: "Track extremes" }]),
        hints: ["Track min/max for both x and y", "Update after each step", "Box contains entire path"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson16_2_1.id,
        number: 5,
        title: "Return to Origin in 2D",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "In 2D walk, count how many times walker returns to origin (0,0) during 1000 steps. Run 100 trials, find average returns.",
        starterCode: "import random\n\ndef count_returns(n_steps):\n    x, y = 0, 0\n    returns = 0\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    \n    for _ in range(n_steps):\n        dx, dy = random.choice(dirs)\n        x, y = x + dx, y + dy\n        if x == 0 and y == 0:\n            returns += 1\n    \n    return returns\n\nreturn_counts = [count_returns(1000) for _ in range(100)]\n\nprint(f'Returns to origin in 1000 steps (100 trials):')\nprint(f'Average returns: {sum(return_counts)/100:.1f}')\nprint(f'Max returns: {max(return_counts)}')\nprint(f'Zero returns: {sum(1 for r in return_counts if r == 0)}')",
        solution: "import random\n\ndef count_returns(n_steps):\n    x, y = 0, 0\n    returns = 0\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    \n    for _ in range(n_steps):\n        dx, dy = random.choice(dirs)\n        x, y = x + dx, y + dy\n        if x == 0 and y == 0:\n            returns += 1\n    \n    return returns\n\nreturn_counts = [count_returns(1000) for _ in range(100)]\n\nprint(f'Returns to origin in 1000 steps (100 trials):')\nprint(f'Average returns: {sum(return_counts)/100:.1f}')\nprint(f'Max returns: {max(return_counts)}')\nprint(f'Zero returns: {sum(1 for r in return_counts if r == 0)}')\nprint('\\n2D walks return less often than 1D!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Few returns on average", description: "2D return rate" }]),
        hints: ["Check if x==0 and y==0", "2D returns are rarer than 1D", "Many walks may have 0 returns"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 16.2.1`);

  const lesson16_2_2 = await prisma.lesson.upsert({
    where: { slug: "brownian-motion-basics" },
    update: {},
    create: {
      sectionId: section16_2.id,
      number: 16.22,
      title: "Brownian Motion Basics",
      slug: "brownian-motion-basics",
      objectives: [
        "Understand Brownian motion as continuous random walk",
        "Implement Gaussian step random walks",
        "Model physical diffusion",
        "Connect to real-world applications",
      ],
      content: `# Brownian Motion Basics

## From Discrete to Continuous

**Discrete walk**: Fixed step size (+1 or -1)
**Brownian motion**: Continuous steps from normal distribution

\`\`\`python
# Brownian motion step
step = random.gauss(0, sigma)  # Mean 0, std dev sigma
position += step
\`\`\`

## Physical Interpretation

Brownian motion models:
- **Pollen grains** in water (Robert Brown, 1827)
- **Gas molecules** bouncing around
- **Stock prices** (geometric Brownian motion)

## Key Properties

- Mean displacement = 0
- Variance after time t = σ² × t
- Standard deviation = σ√t

## Diffusion Coefficient

D = σ²/2 (diffusion coefficient)

Mean squared displacement = 2Dt (in 1D)`,
      codeExamples: JSON.stringify([
        {
          id: "gaussian-walk",
          title: "Gaussian Step Walk",
          code: "import random\n\ndef brownian_1d(n_steps, sigma=1.0):\n    \"\"\"1D Brownian motion with Gaussian steps\"\"\"\n    pos = 0\n    path = [pos]\n    for _ in range(n_steps):\n        step = random.gauss(0, sigma)\n        pos += step\n        path.append(pos)\n    return path\n\npath = brownian_1d(100, sigma=0.5)\n\nprint('Brownian motion (100 steps, σ=0.5):')\nfor i in [0, 25, 50, 75, 100]:\n    print(f'  Step {i:3d}: position = {path[i]:+.2f}')",
          description: "Continuous steps from normal distribution",
        },
        {
          id: "brownian-2d",
          title: "2D Brownian Motion",
          code: "import random\nimport math\n\ndef brownian_2d(n_steps, sigma=1.0):\n    x, y = 0, 0\n    for _ in range(n_steps):\n        x += random.gauss(0, sigma)\n        y += random.gauss(0, sigma)\n    return x, y, math.sqrt(x**2 + y**2)\n\nprint('2D Brownian motion (100 steps, σ=1):')\nfor i in range(5):\n    x, y, d = brownian_2d(100, 1.0)\n    print(f'  Trial {i+1}: ({x:+.1f}, {y:+.1f}), dist={d:.1f}')\n\nprint(f'\\nExpected dist: √(100×1²×2) ≈ {math.sqrt(200):.1f}')",
          description: "Brownian motion in 2D",
        },
        {
          id: "diffusion-simulation",
          title: "Particle Diffusion",
          code: "import random\nimport math\n\ndef simulate_diffusion(n_particles, n_steps, sigma):\n    \"\"\"Simulate many particles diffusing\"\"\"\n    final_dists = []\n    for _ in range(n_particles):\n        x, y = 0, 0\n        for _ in range(n_steps):\n            x += random.gauss(0, sigma)\n            y += random.gauss(0, sigma)\n        final_dists.append(math.sqrt(x**2 + y**2))\n    return final_dists\n\ndists = simulate_diffusion(500, 100, 0.5)\navg_dist = sum(dists) / len(dists)\n\nprint(f'500 particles, 100 steps, σ=0.5:')\nprint(f'Average distance from origin: {avg_dist:.2f}')\nprint(f'Expected: √(100×0.5²×2) = {math.sqrt(100*0.25*2):.2f}')",
          description: "Many particles diffusing",
        },
      ]),
      keyPoints: [
        "Brownian motion: Gaussian steps (continuous)",
        "Step distribution: N(0, σ)",
        "Variance grows as σ²t",
        "Models physical diffusion",
        "Stock prices use geometric Brownian motion",
        "Same √t scaling as discrete walks",
      ],
      hardwareDemo: "Watch Gaussian random number generation. See position accumulate continuous steps.",
      estimatedTime: 25,
      difficulty: "ADVANCED",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson16_2_2.number}: ${lesson16_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson16_2_2.id,
        number: 1,
        title: "Gaussian Steps",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement 1D Brownian motion with 50 Gaussian steps (σ=1). Print position at steps 0, 25, 50.",
        starterCode: "import random\n\npos = 0\npath = [pos]\nsigma = 1.0\n\nfor _ in range(50):\n    step = random.gauss(0, sigma)\n    pos += step\n    path.append(pos)\n\nprint(f'Brownian motion (σ={sigma}):')\nfor i in [0, 25, 50]:\n    print(f'  Step {i}: {path[i]:+.2f}')",
        solution: "import random\n\npos = 0\npath = [pos]\nsigma = 1.0\n\nfor _ in range(50):\n    step = random.gauss(0, sigma)\n    pos += step\n    path.append(pos)\n\nprint(f'Brownian motion (σ={sigma}):')\nfor i in [0, 25, 50]:\n    print(f'  Step {i}: {path[i]:+.2f}')\n\nprint(f'\\nExpected |pos| at step 50: ~{50**0.5:.1f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Positions at 3 steps", description: "Gaussian walk works" }]),
        hints: ["random.gauss(0, sigma) for each step", "Position changes continuously", "Expected |final| ≈ √50 ≈ 7"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson16_2_2.id,
        number: 2,
        title: "2D Brownian Motion",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement 2D Brownian motion (100 steps, σ=0.5). Calculate final distance from origin.",
        starterCode: "import random\nimport math\n\nx, y = 0, 0\nsigma = 0.5\n\nfor _ in range(100):\n    x += random.gauss(0, sigma)\n    y += random.gauss(0, sigma)\n\ndist = math.sqrt(x**2 + y**2)\n\nprint(f'2D Brownian motion (100 steps, σ={sigma}):')\nprint(f'Final position: ({x:.2f}, {y:.2f})')\nprint(f'Distance from origin: {dist:.2f}')",
        solution: "import random\nimport math\n\nx, y = 0, 0\nsigma = 0.5\n\nfor _ in range(100):\n    x += random.gauss(0, sigma)\n    y += random.gauss(0, sigma)\n\ndist = math.sqrt(x**2 + y**2)\n\nprint(f'2D Brownian motion (100 steps, σ={sigma}):')\nprint(f'Final position: ({x:.2f}, {y:.2f})')\nprint(f'Distance from origin: {dist:.2f}')\nprint(f'Expected: ~{math.sqrt(100*sigma**2*2):.1f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Distance around 7", description: "2D Brownian works" }]),
        hints: ["Apply Gaussian step to both x and y", "Distance = √(x² + y²)", "Expected ~√(n×σ²×2)"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson16_2_2.id,
        number: 3,
        title: "Variance vs Steps",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Verify variance grows linearly with steps. For steps [25, 100, 400], run 500 trials and calculate variance of final positions.",
        starterCode: "import random\nimport statistics\n\ndef brownian_1d(n, sigma=1.0):\n    pos = 0\n    for _ in range(n):\n        pos += random.gauss(0, sigma)\n    return pos\n\nsigma = 1.0\nprint(f'Brownian motion (σ={sigma}):')\nprint('Steps   Variance    Theory(n×σ²)')\n\nfor n in [25, 100, 400]:\n    finals = [brownian_1d(n, sigma) for _ in range(500)]\n    var = statistics.variance(finals)\n    theory = n * sigma**2\n    print(f'{n:5d}   {var:8.1f}    {theory:8.1f}')",
        solution: "import random\nimport statistics\n\ndef brownian_1d(n, sigma=1.0):\n    pos = 0\n    for _ in range(n):\n        pos += random.gauss(0, sigma)\n    return pos\n\nsigma = 1.0\nprint(f'Brownian motion (σ={sigma}):')\nprint('Steps   Variance    Theory(n×σ²)')\n\nfor n in [25, 100, 400]:\n    finals = [brownian_1d(n, sigma) for _ in range(500)]\n    var = statistics.variance(finals)\n    theory = n * sigma**2\n    print(f'{n:5d}   {var:8.1f}    {theory:8.1f}')\n\nprint('\\nVariance = n × σ² (linear growth)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Variance matches n×σ²", description: "Linear variance growth" }]),
        hints: ["Variance should equal n × σ²", "4x steps → 4x variance", "This is diffusion law"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson16_2_2.id,
        number: 4,
        title: "Effect of σ",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Compare Brownian motion with σ=0.5, 1.0, 2.0. Run 100 steps, 300 trials each. Show how σ affects spread.",
        starterCode: "import random\nimport statistics\nimport math\n\ndef brownian_1d(n, sigma):\n    pos = 0\n    for _ in range(n):\n        pos += random.gauss(0, sigma)\n    return pos\n\nn_steps = 100\nprint(f'Effect of σ on spread ({n_steps} steps, 300 trials):')\nprint('σ       Std Dev    Theory(σ√n)')\n\nfor sigma in [0.5, 1.0, 2.0]:\n    finals = [brownian_1d(n_steps, sigma) for _ in range(300)]\n    std = statistics.stdev(finals)\n    theory = sigma * math.sqrt(n_steps)\n    print(f'{sigma:.1f}     {std:7.2f}     {theory:7.2f}')",
        solution: "import random\nimport statistics\nimport math\n\ndef brownian_1d(n, sigma):\n    pos = 0\n    for _ in range(n):\n        pos += random.gauss(0, sigma)\n    return pos\n\nn_steps = 100\nprint(f'Effect of σ on spread ({n_steps} steps, 300 trials):')\nprint('σ       Std Dev    Theory(σ√n)')\n\nfor sigma in [0.5, 1.0, 2.0]:\n    finals = [brownian_1d(n_steps, sigma) for _ in range(300)]\n    std = statistics.stdev(finals)\n    theory = sigma * math.sqrt(n_steps)\n    print(f'{sigma:.1f}     {std:7.2f}     {theory:7.2f}')\n\nprint('\\nLarger σ = faster diffusion!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Std dev scales with σ", description: "σ controls spread" }]),
        hints: ["Std dev should be σ×√n", "Larger σ means bigger steps", "2x σ → 2x spread"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson16_2_2.id,
        number: 5,
        title: "Particle Cloud",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Simulate 100 particles doing 2D Brownian motion for 200 steps (σ=1). Calculate average distance and spread of particle cloud.",
        starterCode: "import random\nimport math\nimport statistics\n\ndef particle_2d(n_steps, sigma):\n    x, y = 0, 0\n    for _ in range(n_steps):\n        x += random.gauss(0, sigma)\n        y += random.gauss(0, sigma)\n    return math.sqrt(x**2 + y**2)\n\ndistances = [particle_2d(200, 1.0) for _ in range(100)]\n\nprint(f'100 particles, 200 steps, σ=1:')\nprint(f'Average distance: {statistics.mean(distances):.2f}')\nprint(f'Std of distances: {statistics.stdev(distances):.2f}')\nprint(f'Min distance: {min(distances):.2f}')\nprint(f'Max distance: {max(distances):.2f}')",
        solution: "import random\nimport math\nimport statistics\n\ndef particle_2d(n_steps, sigma):\n    x, y = 0, 0\n    for _ in range(n_steps):\n        x += random.gauss(0, sigma)\n        y += random.gauss(0, sigma)\n    return math.sqrt(x**2 + y**2)\n\ndistances = [particle_2d(200, 1.0) for _ in range(100)]\n\nprint(f'100 particles, 200 steps, σ=1:')\nprint(f'Average distance: {statistics.mean(distances):.2f}')\nprint(f'Std of distances: {statistics.stdev(distances):.2f}')\nprint(f'Min distance: {min(distances):.2f}')\nprint(f'Max distance: {max(distances):.2f}')\nprint(f'Expected avg: ~{math.sqrt(200*2):.1f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Particle cloud statistics", description: "Diffusion cloud" }]),
        hints: ["Each particle is independent", "Average distance ~√(2×n×σ²)", "Cloud spreads over time"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 16.2.2`);

  console.log("\n✅ Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
