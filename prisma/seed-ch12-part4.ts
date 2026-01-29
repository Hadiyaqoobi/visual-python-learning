import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 4: Lessons 12.3.1-12.3.3 (Monte Carlo & Inference)...\n");

  const section12_3 = await prisma.section.findFirst({
    where: { number: 12.3 },
  });
  if (!section12_3) throw new Error("Section 12.3 not found. Run part 1 first.");

  const lesson12_3_1 = await prisma.lesson.upsert({
    where: { slug: "monte-carlo-simulation" },
    update: {},
    create: {
      sectionId: section12_3.id,
      number: 12.31,
      title: "Monte Carlo Simulation",
      slug: "monte-carlo-simulation",
      objectives: [
        "Understand Monte Carlo simulation",
        "Estimate pi using random sampling",
        "Apply Monte Carlo to integration",
        "Understand samples vs accuracy tradeoff",
      ],
      content: `# Monte Carlo Simulation

Monte Carlo uses **randomness to solve deterministic problems**. Named after the Monte Carlo casino!

## The Core Idea

1. Generate many random samples
2. Calculate result for each
3. Average results = approximation
4. More samples = better approximation

## Classic Example: Estimating Pi

Square with side 2 (area=4), circle inside with radius 1 (area=pi).

Ratio of areas: pi/4

**Algorithm:**
1. Generate random point (x,y) in [-1,1] x [-1,1]
2. Check if inside circle: x^2 + y^2 <= 1
3. Ratio of inside/total = pi/4
4. Multiply by 4 = pi estimate

## Accuracy vs Samples

Error decreases as 1/sqrt(N)
- 100 samples: ~10% error
- 10000 samples: ~1% error
- 1000000 samples: ~0.1% error

To halve error, need 4x more samples!`,
      codeExamples: JSON.stringify([
        {
          id: "estimate-pi",
          title: "Estimating Pi",
          code: "import random\nimport math\n\ndef estimate_pi(n):\n    inside = 0\n    for _ in range(n):\n        x = random.uniform(-1, 1)\n        y = random.uniform(-1, 1)\n        if x**2 + y**2 <= 1:\n            inside += 1\n    return 4 * inside / n\n\nfor n in [100, 1000, 10000, 100000]:\n    est = estimate_pi(n)\n    err = abs(est - math.pi)\n    print(f'{n:6d}: pi={est:.4f} (err={err:.4f})')",
          description: "Pi estimation with increasing accuracy",
        },
      ]),
      keyPoints: [
        "Monte Carlo: random sampling for deterministic problems",
        "Pi estimation: ratio of points inside circle x 4",
        "Error decreases as 1/sqrt(N)",
        "4x more samples needed to halve error",
        "Powerful for integration and complex problems",
      ],
      hardwareDemo: "Watch inside counter grow. See ratio converge to pi/4.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson12_3_1.number}: ${lesson12_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson12_3_1.id,
        number: 1,
        title: "Estimate Pi",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Estimate pi using 1000 random points. Compare to math.pi.",
        starterCode: "import random\nimport math\n\ninside = 0\nn = 1000\n\nfor _ in range(n):\n    x = random.uniform(-1, 1)\n    y = random.uniform(-1, 1)\n    if x**2 + y**2 <= 1:\n        inside += 1\n\npi_est = 4 * inside / n\nprint(f'Estimated: {pi_est:.4f}')\nprint(f'Actual: {math.pi:.4f}')",
        solution: "import random\nimport math\n\ninside = 0\nn = 1000\n\nfor _ in range(n):\n    x = random.uniform(-1, 1)\n    y = random.uniform(-1, 1)\n    if x**2 + y**2 <= 1:\n        inside += 1\n\npi_est = 4 * inside / n\nprint(f'Estimated: {pi_est:.4f}')\nprint(f'Actual: {math.pi:.4f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Around 3.14", description: "Close to pi" }]),
        hints: ["Point inside if x^2+y^2 <= 1", "Multiply ratio by 4", "Result should be around 3.14"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson12_3_1.id,
        number: 2,
        title: "Error vs Samples",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Run pi estimation with 100, 1000, 10000, 100000 points. Show error decreasing.",
        starterCode: "import random\nimport math\n\ndef estimate_pi(n):\n    inside = 0\n    for _ in range(n):\n        x = random.uniform(-1, 1)\n        y = random.uniform(-1, 1)\n        if x**2 + y**2 <= 1:\n            inside += 1\n    return 4 * inside / n\n\nfor n in [100, 1000, 10000, 100000]:\n    est = estimate_pi(n)\n    err = abs(est - math.pi)\n    print(f'{n:6d} points: error = {err:.4f}')",
        solution: "import random\nimport math\n\ndef estimate_pi(n):\n    inside = 0\n    for _ in range(n):\n        x = random.uniform(-1, 1)\n        y = random.uniform(-1, 1)\n        if x**2 + y**2 <= 1:\n            inside += 1\n    return 4 * inside / n\n\nfor n in [100, 1000, 10000, 100000]:\n    est = estimate_pi(n)\n    err = abs(est - math.pi)\n    print(f'{n:6d} points: error = {err:.4f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Error decreases", description: "More points = less error" }]),
        hints: ["Error is about 1/sqrt(N)", "10x more samples gives about 3x less error", "100000 should be very accurate"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson12_3_1.id,
        number: 3,
        title: "Circle Area",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Estimate area of circle with radius 2 using Monte Carlo. Theoretical: 4*pi is about 12.57.",
        starterCode: "import random\nimport math\n\ninside = 0\nn = 10000\nradius = 2\n\nfor _ in range(n):\n    x = random.uniform(-radius, radius)\n    y = random.uniform(-radius, radius)\n    if x**2 + y**2 <= radius**2:\n        inside += 1\n\nsquare_area = (2 * radius) ** 2\ncircle_area = square_area * inside / n\n\nprint(f'Estimated: {circle_area:.2f}')\nprint(f'Theoretical: {math.pi * radius**2:.2f}')",
        solution: "import random\nimport math\n\ninside = 0\nn = 10000\nradius = 2\n\nfor _ in range(n):\n    x = random.uniform(-radius, radius)\n    y = random.uniform(-radius, radius)\n    if x**2 + y**2 <= radius**2:\n        inside += 1\n\nsquare_area = (2 * radius) ** 2\ncircle_area = square_area * inside / n\n\nprint(f'Estimated: {circle_area:.2f}')\nprint(f'Theoretical: {math.pi * radius**2:.2f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Around 12.57", description: "Close to 4*pi" }]),
        hints: ["Inside if x^2+y^2 <= r^2", "Square area = 16", "pi * 2^2 = 4*pi is about 12.57"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson12_3_1.id,
        number: 4,
        title: "Integrate x cubed",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Use Monte Carlo to estimate integral of x^3 from 0 to 1. Actual answer: 1/4 = 0.25.",
        starterCode: "import random\n\nbelow = 0\nn = 10000\n\nfor _ in range(n):\n    x = random.uniform(0, 1)\n    y = random.uniform(0, 1)\n    if y <= x**3:\n        below += 1\n\narea = below / n\nprint(f'Estimated: {area:.4f}')\nprint(f'Actual: 0.25')",
        solution: "import random\n\nbelow = 0\nn = 10000\n\nfor _ in range(n):\n    x = random.uniform(0, 1)\n    y = random.uniform(0, 1)\n    if y <= x**3:\n        below += 1\n\narea = below / n\nprint(f'Estimated: {area:.4f}')\nprint(f'Actual: 0.25')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Around 0.25", description: "Close to 1/4" }]),
        hints: ["Below curve if y <= x^3", "Rectangle area is 1", "Integral of x^3 = x^4/4"],
        xpReward: 25,
        order: 4,
      },
    ],
  });
  console.log(`      ✏️  4 exercises created for 12.3.1`);

  const lesson12_3_2 = await prisma.lesson.upsert({
    where: { slug: "statistical-inference-simulation" },
    update: {},
    create: {
      sectionId: section12_3.id,
      number: 12.32,
      title: "Statistical Inference from Simulations",
      slug: "statistical-inference-simulation",
      objectives: [
        "Use simulation for statistical inference",
        "Calculate mean and standard deviation",
        "Compare strategies through simulation",
        "Quantify uncertainty in results",
      ],
      content: `# Statistical Inference from Simulations

Simulation helps answer "what if" questions and quantify uncertainty.

## Multiple Trials

Single simulation may be misleading! Run many trials to get reliable results.

## Variance and Standard Deviation

**Variance**: How spread out are results?
**Standard Deviation**: Square root of variance (same units as data)

## Comparing Strategies

Run both strategies many times, compare averages to determine which is better.

## Confidence Through Repetition

More trials = more confidence in results.`,
      codeExamples: JSON.stringify([
        {
          id: "multiple-simulations",
          title: "Multiple Simulations",
          code: "import random\n\ndef gambler_simulation(start, bets):\n    money = start\n    for _ in range(bets):\n        if random.random() < 0.5:\n            money += 1\n        else:\n            money -= 1\n        if money <= 0:\n            break\n    return money\n\nresults = [gambler_simulation(10, 20) for _ in range(100)]\nprint(f'Average: ${sum(results)/100:.2f}')\nprint(f'Bankrupt: {sum(1 for r in results if r==0)}')",
          description: "Running multiple simulations",
        },
      ]),
      keyPoints: [
        "Run multiple trials, not just one",
        "Calculate mean (average outcome)",
        "Calculate std dev (spread/uncertainty)",
        "Compare strategies using averages",
        "More trials = more confidence",
      ],
      hardwareDemo: "Watch results list grow in memory. See statistical calculations.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson12_3_2.number}: ${lesson12_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson12_3_2.id,
        number: 1,
        title: "Gambler Simulation",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Simulate gambler starting with $50, betting $1 per round (50% win). Run 100 simulations of 100 bets each.",
        starterCode: "import random\n\ndef gamble(start, bets):\n    money = start\n    for _ in range(bets):\n        if random.random() < 0.5:\n            money += 1\n        else:\n            money -= 1\n        if money <= 0:\n            break\n    return money\n\nresults = [gamble(50, 100) for _ in range(100)]\nprint(f'Average: ${sum(results)/100:.2f}')\nprint(f'Bankrupt: {sum(1 for r in results if r==0)}')",
        solution: "import random\n\ndef gamble(start, bets):\n    money = start\n    for _ in range(bets):\n        if random.random() < 0.5:\n            money += 1\n        else:\n            money -= 1\n        if money <= 0:\n            break\n    return money\n\nresults = [gamble(50, 100) for _ in range(100)]\nprint(f'Average: ${sum(results)/100:.2f}')\nprint(f'Bankrupt: {sum(1 for r in results if r==0)}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Average near $50", description: "Fair game" }]),
        hints: ["50/50 odds = fair game", "Average should be around $50", "Some will go bankrupt"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson12_3_2.id,
        number: 2,
        title: "Calculate Standard Deviation",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate mean and standard deviation of pi estimates from 50 trials of 1000 points each.",
        starterCode: "import random\nimport math\n\ndef estimate_pi(n):\n    inside = sum(1 for _ in range(n) if random.uniform(-1,1)**2 + random.uniform(-1,1)**2 <= 1)\n    return 4 * inside / n\n\nestimates = [estimate_pi(1000) for _ in range(50)]\n\nmean = sum(estimates) / 50\nvariance = sum((e - mean)**2 for e in estimates) / 50\nstd_dev = math.sqrt(variance)\n\nprint(f'Mean: {mean:.4f}')\nprint(f'Std Dev: {std_dev:.4f}')",
        solution: "import random\nimport math\n\ndef estimate_pi(n):\n    inside = sum(1 for _ in range(n) if random.uniform(-1,1)**2 + random.uniform(-1,1)**2 <= 1)\n    return 4 * inside / n\n\nestimates = [estimate_pi(1000) for _ in range(50)]\n\nmean = sum(estimates) / 50\nvariance = sum((e - mean)**2 for e in estimates) / 50\nstd_dev = math.sqrt(variance)\n\nprint(f'Mean: {mean:.4f}')\nprint(f'Std Dev: {std_dev:.4f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Mean around 3.14, small std dev", description: "Consistent estimates" }]),
        hints: ["Mean = sum/count", "Variance = avg of squared differences from mean", "Std dev = sqrt(variance)"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson12_3_2.id,
        number: 3,
        title: "Compare Betting Strategies",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Compare aggressive ($5 bets) vs conservative ($1 bets) strategy. Start with $100, play 50 rounds, run 1000 trials each.",
        starterCode: "import random\n\ndef aggressive(start, rounds):\n    money = start\n    for _ in range(rounds):\n        if random.random() < 0.5:\n            money += 5\n        else:\n            money -= 5\n        if money < 5: break\n    return money\n\ndef conservative(start, rounds):\n    money = start\n    for _ in range(rounds):\n        if random.random() < 0.5:\n            money += 1\n        else:\n            money -= 1\n        if money < 1: break\n    return money\n\na = [aggressive(100, 50) for _ in range(1000)]\nc = [conservative(100, 50) for _ in range(1000)]\n\nprint(f'Aggressive: avg=${sum(a)/1000:.2f}')\nprint(f'Conservative: avg=${sum(c)/1000:.2f}')",
        solution: "import random\n\ndef aggressive(start, rounds):\n    money = start\n    for _ in range(rounds):\n        if random.random() < 0.5:\n            money += 5\n        else:\n            money -= 5\n        if money < 5: break\n    return money\n\ndef conservative(start, rounds):\n    money = start\n    for _ in range(rounds):\n        if random.random() < 0.5:\n            money += 1\n        else:\n            money -= 1\n        if money < 1: break\n    return money\n\na = [aggressive(100, 50) for _ in range(1000)]\nc = [conservative(100, 50) for _ in range(1000)]\n\nprint(f'Aggressive: avg=${sum(a)/1000:.2f}')\nprint(f'Conservative: avg=${sum(c)/1000:.2f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Similar averages, different risk", description: "Risk vs reward" }]),
        hints: ["Both are fair games (50/50)", "Aggressive has higher variance", "Conservative less likely to go bankrupt"],
        xpReward: 25,
        order: 3,
      },
    ],
  });
  console.log(`      ✏️  3 exercises created for 12.3.2`);

  const lesson12_3_3 = await prisma.lesson.upsert({
    where: { slug: "advanced-monte-carlo" },
    update: {},
    create: {
      sectionId: section12_3.id,
      number: 12.33,
      title: "Advanced Monte Carlo Applications",
      slug: "advanced-monte-carlo",
      objectives: [
        "Apply Monte Carlo to real-world problems",
        "Simulate stock prices",
        "Model A/B tests",
        "Design effective simulations",
      ],
      content: `# Advanced Monte Carlo Applications

Monte Carlo is used in finance, physics, engineering, and AI!

## Real-World Applications

- **Finance**: Option pricing, risk analysis
- **Physics**: Particle simulations
- **Engineering**: Reliability analysis
- **AI**: Monte Carlo Tree Search (AlphaGo!)

## Stock Price Simulation

Model prices as random walk with drift.

## A/B Test Simulation

Test if improvement is real or random chance.

## Simulation Design Tips

1. Clear model of the problem
2. Sufficient trials (1000-100000+)
3. Validate against known results
4. Analyze variance, not just mean`,
      codeExamples: JSON.stringify([
        {
          id: "stock-simulation",
          title: "Stock Price Simulation",
          code: "import random\n\ndef simulate_stock(start, days):\n    price = start\n    for _ in range(days):\n        change = random.uniform(-0.02, 0.02) + 0.001\n        price *= (1 + change)\n    return price\n\nfor i in range(10):\n    final = simulate_stock(100, 252)\n    ret = (final - 100) / 100 * 100\n    print(f'Sim {i+1}: ${final:.2f} ({ret:+.1f}%)')",
          description: "Simulating stock price over a year",
        },
      ]),
      keyPoints: [
        "Monte Carlo used in finance, physics, AI",
        "Stock prices modeled as random walk with drift",
        "A/B tests can be simulated to estimate power",
        "Always run sufficient trials",
        "Validate simulations against known results",
      ],
      hardwareDemo: "Watch price evolve through simulation. See outcomes accumulate.",
      estimatedTime: 30,
      difficulty: "ADVANCED",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson12_3_3.number}: ${lesson12_3_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson12_3_3.id,
        number: 1,
        title: "Stock Simulation",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Simulate stock starting at $50 for 100 days with plus or minus 2% daily volatility. Run 10 simulations.",
        starterCode: "import random\n\ndef simulate_stock(start, days):\n    price = start\n    for _ in range(days):\n        change = random.uniform(-0.02, 0.02)\n        price *= (1 + change)\n    return price\n\nfor i in range(10):\n    final = simulate_stock(50, 100)\n    print(f'Sim {i+1}: ${final:.2f}')",
        solution: "import random\n\ndef simulate_stock(start, days):\n    price = start\n    for _ in range(days):\n        change = random.uniform(-0.02, 0.02)\n        price *= (1 + change)\n    return price\n\nfor i in range(10):\n    final = simulate_stock(50, 100)\n    print(f'Sim {i+1}: ${final:.2f}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "10 different prices", description: "Prices vary" }]),
        hints: ["price *= (1 + change)", "Plus or minus 2% = uniform(-0.02, 0.02)", "Each simulation is different"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson12_3_3.id,
        number: 2,
        title: "Dice Game Analysis",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Dice game: Roll 2 dice. Sum>=7 wins $2, else lose $1. Starting $20, play 50 rounds. Is this a good game?",
        starterCode: "import random\n\ndef play_game(start, rounds):\n    money = start\n    for _ in range(rounds):\n        roll = random.randint(1,6) + random.randint(1,6)\n        if roll >= 7:\n            money += 2\n        else:\n            money -= 1\n    return money\n\nresults = [play_game(20, 50) for _ in range(1000)]\navg = sum(results) / 1000\nprint(f'Average final: ${avg:.2f}')\nprint(f'Started with: $20')\nprint(f'Good game? {\"Yes\" if avg > 20 else \"No\"}')",
        solution: "import random\n\ndef play_game(start, rounds):\n    money = start\n    for _ in range(rounds):\n        roll = random.randint(1,6) + random.randint(1,6)\n        if roll >= 7:\n            money += 2\n        else:\n            money -= 1\n    return money\n\nresults = [play_game(20, 50) for _ in range(1000)]\navg = sum(results) / 1000\nprint(f'Average final: ${avg:.2f}')\nprint(f'Started with: $20')\nprint(f'Good game? {\"Yes\" if avg > 20 else \"No\"}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Average > $20", description: "Favorable odds" }]),
        hints: ["P(sum>=7) = 21/36 which is about 58%", "Expected: 0.58*$2 - 0.42*$1 = $0.74/round", "Good game! Expected profit"],
        xpReward: 25,
        order: 2,
      },
      {
        lessonId: lesson12_3_3.id,
        number: 3,
        title: "Epidemic Simulation",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Simulate epidemic: 100 people, 1 infected. Each day, infected have 20% chance to infect each of 5 contacts. Simulate 30 days.",
        starterCode: "import random\n\ndef simulate_epidemic(pop, days, p_infect=0.2, contacts=5):\n    infected = {0}\n    \n    for day in range(days):\n        new_infected = set()\n        for person in infected:\n            for _ in range(contacts):\n                contact = random.randint(0, pop-1)\n                if contact not in infected and random.random() < p_infect:\n                    new_infected.add(contact)\n        infected.update(new_infected)\n    \n    return len(infected)\n\nresults = [simulate_epidemic(100, 30) for _ in range(100)]\nprint(f'Average infected: {sum(results)/100:.1f}')\nprint(f'Min: {min(results)}, Max: {max(results)}')",
        solution: "import random\n\ndef simulate_epidemic(pop, days, p_infect=0.2, contacts=5):\n    infected = {0}\n    \n    for day in range(days):\n        new_infected = set()\n        for person in infected:\n            for _ in range(contacts):\n                contact = random.randint(0, pop-1)\n                if contact not in infected and random.random() < p_infect:\n                    new_infected.add(contact)\n        infected.update(new_infected)\n    \n    return len(infected)\n\nresults = [simulate_epidemic(100, 30) for _ in range(100)]\nprint(f'Average infected: {sum(results)/100:.1f}')\nprint(f'Min: {min(results)}, Max: {max(results)}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "High infection rate", description: "Epidemic spreads" }]),
        hints: ["Use set for infected people", "Check if contact already infected", "Exponential growth at first"],
        xpReward: 30,
        order: 3,
      },
    ],
  });
  console.log(`      ✏️  3 exercises created for 12.3.3`);

  console.log("\n✅ Part 4 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
