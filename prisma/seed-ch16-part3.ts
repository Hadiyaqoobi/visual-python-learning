import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 3: Lessons 16.3.1-16.3.2 (Visualization)...\n");

  const section16_3 = await prisma.section.findFirst({ where: { number: 16.3 } });
  if (!section16_3) throw new Error("Section 16.3 not found. Run part 1 first.");

  const lesson16_3_1 = await prisma.lesson.upsert({
    where: { slug: "matplotlib-multiple-subplots" },
    update: {},
    create: {
      sectionId: section16_3.id,
      number: 16.31,
      title: "Advanced Matplotlib - Multiple Subplots",
      slug: "matplotlib-multiple-subplots",
      objectives: [
        "Create multi-panel figures with subplots",
        "Compare different scenarios side-by-side",
        "Customize subplot layouts",
        "Add titles and labels to complex figures",
      ],
      content: `# Advanced Matplotlib - Multiple Subplots

## Why Multiple Subplots?

Compare related visualizations side-by-side:
- Different parameters
- Before/after
- Multiple perspectives on data

## Creating Subplots

\`\`\`python
import matplotlib.pyplot as plt

# Create 2x2 grid of subplots
fig, axes = plt.subplots(2, 2, figsize=(10, 8))

# Access individual subplots
axes[0, 0].plot(x, y)  # Top-left
axes[0, 1].plot(x, y)  # Top-right
axes[1, 0].plot(x, y)  # Bottom-left
axes[1, 1].plot(x, y)  # Bottom-right
\`\`\`

## Single Row/Column

\`\`\`python
fig, axes = plt.subplots(1, 3)  # 1 row, 3 columns
axes[0].plot(...)
axes[1].plot(...)
axes[2].plot(...)
\`\`\`

## Sharing Axes

\`\`\`python
fig, axes = plt.subplots(2, 2, sharex=True, sharey=True)
\`\`\`

This ensures all subplots use the same scale.`,
      codeExamples: JSON.stringify([
        {
          id: "basic-subplots",
          title: "Basic 2x2 Subplots",
          code: "import matplotlib.pyplot as plt\nimport random\n\n# Generate data for 4 walks\nwalks = []\nfor _ in range(4):\n    path = [0]\n    for _ in range(100):\n        path.append(path[-1] + random.choice([-1, 1]))\n    walks.append(path)\n\n# Create 2x2 figure\nfig, axes = plt.subplots(2, 2, figsize=(10, 8))\nfig.suptitle('Four Random Walks', fontsize=14)\n\nfor i, ax in enumerate(axes.flat):\n    ax.plot(walks[i])\n    ax.set_title(f'Walk {i+1}')\n    ax.set_xlabel('Step')\n    ax.set_ylabel('Position')\n    ax.axhline(y=0, color='gray', linestyle='--', alpha=0.5)\n\nplt.tight_layout()\nplt.savefig('four_walks.png', dpi=100)\nprint('Saved four_walks.png')",
          description: "2x2 grid of random walks",
        },
        {
          id: "compare-bias",
          title: "Compare Different Biases",
          code: "import matplotlib.pyplot as plt\nimport random\n\ndef biased_walk(n, p):\n    path = [0]\n    for _ in range(n):\n        step = 1 if random.random() < p else -1\n        path.append(path[-1] + step)\n    return path\n\nbiases = [0.4, 0.5, 0.6, 0.7]\nfig, axes = plt.subplots(1, 4, figsize=(14, 4), sharey=True)\nfig.suptitle('Effect of Bias on Random Walk')\n\nfor ax, p in zip(axes, biases):\n    for _ in range(5):  # 5 walks each\n        path = biased_walk(100, p)\n        ax.plot(path, alpha=0.6)\n    ax.set_title(f'p = {p}')\n    ax.set_xlabel('Step')\n    ax.axhline(y=0, color='gray', linestyle='--')\n\naxes[0].set_ylabel('Position')\nplt.tight_layout()\nplt.savefig('bias_comparison.png', dpi=100)\nprint('Saved bias_comparison.png')",
          description: "Compare walks with different biases",
        },
        {
          id: "walk-statistics",
          title: "Walk Statistics Dashboard",
          code: "import matplotlib.pyplot as plt\nimport random\nimport statistics\n\n# Run 500 walks, collect endpoints\nendpoints = []\nfor _ in range(500):\n    pos = 0\n    for _ in range(100):\n        pos += random.choice([-1, 1])\n    endpoints.append(pos)\n\nfig, axes = plt.subplots(1, 3, figsize=(12, 4))\nfig.suptitle('Random Walk Statistics (500 walks, 100 steps)')\n\n# Histogram\naxes[0].hist(endpoints, bins=20, edgecolor='black')\naxes[0].set_title('Distribution of Endpoints')\naxes[0].set_xlabel('Final Position')\naxes[0].set_ylabel('Count')\n\n# Box plot\naxes[1].boxplot(endpoints)\naxes[1].set_title('Box Plot')\naxes[1].set_ylabel('Final Position')\n\n# Stats text\nstats_text = f'Mean: {statistics.mean(endpoints):.2f}\\n'\nstats_text += f'Std: {statistics.stdev(endpoints):.2f}\\n'\nstats_text += f'Min: {min(endpoints)}\\n'\nstats_text += f'Max: {max(endpoints)}'\naxes[2].text(0.5, 0.5, stats_text, fontsize=14,\n             ha='center', va='center', transform=axes[2].transAxes)\naxes[2].set_title('Summary Statistics')\naxes[2].axis('off')\n\nplt.tight_layout()\nplt.savefig('walk_stats.png', dpi=100)\nprint('Saved walk_stats.png')",
          description: "Multiple views of walk statistics",
        },
      ]),
      keyPoints: [
        "plt.subplots(rows, cols) creates grid",
        "Access subplots via axes[row, col] or axes.flat",
        "sharex/sharey for consistent scales",
        "fig.suptitle() for overall title",
        "plt.tight_layout() prevents overlap",
        "Great for comparing variations",
      ],
      hardwareDemo: "Watch figure object created in memory. See subplot array allocated.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson16_3_1.number}: ${lesson16_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson16_3_1.id,
        number: 1,
        title: "Create 2x2 Grid",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a 2x2 subplot grid. Plot a different random walk in each panel. Add titles 'Walk 1', 'Walk 2', etc.",
        starterCode: "import matplotlib.pyplot as plt\nimport random\n\ndef random_walk(n):\n    path = [0]\n    for _ in range(n):\n        path.append(path[-1] + random.choice([-1, 1]))\n    return path\n\nfig, axes = plt.subplots(2, 2, figsize=(8, 6))\nfig.suptitle('Four Random Walks')\n\nfor i, ax in enumerate(axes.flat):\n    path = random_walk(50)\n    ax.plot(path)\n    ax.set_title(f'Walk {i+1}')\n\nplt.tight_layout()\nplt.savefig('grid_walks.png')\nprint('Saved grid_walks.png')",
        solution: "import matplotlib.pyplot as plt\nimport random\n\ndef random_walk(n):\n    path = [0]\n    for _ in range(n):\n        path.append(path[-1] + random.choice([-1, 1]))\n    return path\n\nfig, axes = plt.subplots(2, 2, figsize=(8, 6))\nfig.suptitle('Four Random Walks')\n\nfor i, ax in enumerate(axes.flat):\n    path = random_walk(50)\n    ax.plot(path)\n    ax.set_title(f'Walk {i+1}')\n\nplt.tight_layout()\nplt.savefig('grid_walks.png')\nprint('Saved grid_walks.png')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "grid_walks.png saved", description: "2x2 grid created" }]),
        hints: ["Use plt.subplots(2, 2)", "axes.flat iterates all subplots", "Each ax is like a mini-plot"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson16_3_1.id,
        number: 2,
        title: "Compare Step Counts",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create 1x3 subplot row showing walks of 50, 100, and 200 steps. Share y-axis to compare scales.",
        starterCode: "import matplotlib.pyplot as plt\nimport random\n\ndef random_walk(n):\n    path = [0]\n    for _ in range(n):\n        path.append(path[-1] + random.choice([-1, 1]))\n    return path\n\nsteps = [50, 100, 200]\nfig, axes = plt.subplots(1, 3, figsize=(12, 4), sharey=True)\nfig.suptitle('Random Walks of Different Lengths')\n\nfor ax, n in zip(axes, steps):\n    path = random_walk(n)\n    ax.plot(path)\n    ax.set_title(f'{n} steps')\n    ax.set_xlabel('Step')\n\naxes[0].set_ylabel('Position')\nplt.tight_layout()\nplt.savefig('step_comparison.png')\nprint('Saved step_comparison.png')",
        solution: "import matplotlib.pyplot as plt\nimport random\n\ndef random_walk(n):\n    path = [0]\n    for _ in range(n):\n        path.append(path[-1] + random.choice([-1, 1]))\n    return path\n\nsteps = [50, 100, 200]\nfig, axes = plt.subplots(1, 3, figsize=(12, 4), sharey=True)\nfig.suptitle('Random Walks of Different Lengths')\n\nfor ax, n in zip(axes, steps):\n    path = random_walk(n)\n    ax.plot(path)\n    ax.set_title(f'{n} steps')\n    ax.set_xlabel('Step')\n\naxes[0].set_ylabel('Position')\nplt.tight_layout()\nplt.savefig('step_comparison.png')\nprint('Saved step_comparison.png')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "step_comparison.png saved", description: "1x3 row created" }]),
        hints: ["Use plt.subplots(1, 3)", "sharey=True for same y-scale", "zip(axes, steps) pairs them"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson16_3_1.id,
        number: 3,
        title: "Bias Comparison Panel",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create 2x2 grid comparing biases p=0.3, 0.5, 0.7, 0.9. Plot 3 walks in each panel.",
        starterCode: "import matplotlib.pyplot as plt\nimport random\n\ndef biased_walk(n, p):\n    path = [0]\n    for _ in range(n):\n        step = 1 if random.random() < p else -1\n        path.append(path[-1] + step)\n    return path\n\nbiases = [0.3, 0.5, 0.7, 0.9]\nfig, axes = plt.subplots(2, 2, figsize=(10, 8), sharey=True)\nfig.suptitle('Biased Random Walks')\n\nfor ax, p in zip(axes.flat, biases):\n    for _ in range(3):\n        path = biased_walk(100, p)\n        ax.plot(path, alpha=0.7)\n    ax.set_title(f'p = {p}')\n    ax.axhline(y=0, color='gray', linestyle='--', alpha=0.5)\n\nplt.tight_layout()\nplt.savefig('bias_panel.png')\nprint('Saved bias_panel.png')",
        solution: "import matplotlib.pyplot as plt\nimport random\n\ndef biased_walk(n, p):\n    path = [0]\n    for _ in range(n):\n        step = 1 if random.random() < p else -1\n        path.append(path[-1] + step)\n    return path\n\nbiases = [0.3, 0.5, 0.7, 0.9]\nfig, axes = plt.subplots(2, 2, figsize=(10, 8), sharey=True)\nfig.suptitle('Biased Random Walks')\n\nfor ax, p in zip(axes.flat, biases):\n    for _ in range(3):\n        path = biased_walk(100, p)\n        ax.plot(path, alpha=0.7)\n    ax.set_title(f'p = {p}')\n    ax.axhline(y=0, color='gray', linestyle='--', alpha=0.5)\n\nplt.tight_layout()\nplt.savefig('bias_panel.png')\nprint('Saved bias_panel.png')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "bias_panel.png saved", description: "Bias comparison" }]),
        hints: ["4 biases in 2x2 grid", "3 walks per panel shows variation", "Drift visible in biased panels"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson16_3_1.id,
        number: 4,
        title: "Statistics Dashboard",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create 1x3 dashboard: (1) histogram of 500 walk endpoints, (2) single example path, (3) text with mean, std, min, max.",
        starterCode: "import matplotlib.pyplot as plt\nimport random\nimport statistics\n\ndef random_walk(n):\n    path = [0]\n    for _ in range(n):\n        path.append(path[-1] + random.choice([-1, 1]))\n    return path\n\n# Collect data\nendpoints = [random_walk(100)[-1] for _ in range(500)]\nexample_path = random_walk(100)\n\nfig, axes = plt.subplots(1, 3, figsize=(14, 4))\nfig.suptitle('Random Walk Analysis')\n\n# Histogram\naxes[0].hist(endpoints, bins=25, edgecolor='black')\naxes[0].set_title('Endpoint Distribution')\naxes[0].set_xlabel('Final Position')\n\n# Example path\naxes[1].plot(example_path)\naxes[1].set_title('Example Walk')\naxes[1].set_xlabel('Step')\naxes[1].axhline(y=0, color='gray', linestyle='--')\n\n# Statistics\nstats = f'Mean: {statistics.mean(endpoints):.2f}\\n'\nstats += f'Std: {statistics.stdev(endpoints):.2f}\\n'\nstats += f'Min: {min(endpoints)}\\nMax: {max(endpoints)}'\naxes[2].text(0.5, 0.5, stats, fontsize=14, ha='center', va='center',\n             transform=axes[2].transAxes, family='monospace')\naxes[2].set_title('Statistics')\naxes[2].axis('off')\n\nplt.tight_layout()\nplt.savefig('dashboard.png')\nprint('Saved dashboard.png')",
        solution: "import matplotlib.pyplot as plt\nimport random\nimport statistics\n\ndef random_walk(n):\n    path = [0]\n    for _ in range(n):\n        path.append(path[-1] + random.choice([-1, 1]))\n    return path\n\nendpoints = [random_walk(100)[-1] for _ in range(500)]\nexample_path = random_walk(100)\n\nfig, axes = plt.subplots(1, 3, figsize=(14, 4))\nfig.suptitle('Random Walk Analysis')\n\naxes[0].hist(endpoints, bins=25, edgecolor='black')\naxes[0].set_title('Endpoint Distribution')\naxes[0].set_xlabel('Final Position')\n\naxes[1].plot(example_path)\naxes[1].set_title('Example Walk')\naxes[1].set_xlabel('Step')\naxes[1].axhline(y=0, color='gray', linestyle='--')\n\nstats = f'Mean: {statistics.mean(endpoints):.2f}\\n'\nstats += f'Std: {statistics.stdev(endpoints):.2f}\\n'\nstats += f'Min: {min(endpoints)}\\nMax: {max(endpoints)}'\naxes[2].text(0.5, 0.5, stats, fontsize=14, ha='center', va='center',\n             transform=axes[2].transAxes, family='monospace')\naxes[2].set_title('Statistics')\naxes[2].axis('off')\n\nplt.tight_layout()\nplt.savefig('dashboard.png')\nprint('Saved dashboard.png')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "dashboard.png saved", description: "Dashboard complete" }]),
        hints: ["3 different plot types", "axis('off') hides empty axes", "transform=axes[2].transAxes for relative positioning"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson16_3_1.id,
        number: 5,
        title: "2D Walk Comparison",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create 2x2 grid showing four 2D random walks. Plot (x,y) path for each. Use equal aspect ratio.",
        starterCode: "import matplotlib.pyplot as plt\nimport random\n\ndef walk_2d(n):\n    x, y = [0], [0]\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    for _ in range(n):\n        dx, dy = random.choice(dirs)\n        x.append(x[-1] + dx)\n        y.append(y[-1] + dy)\n    return x, y\n\nfig, axes = plt.subplots(2, 2, figsize=(10, 10))\nfig.suptitle('Four 2D Random Walks (200 steps)')\n\nfor i, ax in enumerate(axes.flat):\n    x, y = walk_2d(200)\n    ax.plot(x, y, alpha=0.7)\n    ax.plot(0, 0, 'go', markersize=10, label='Start')\n    ax.plot(x[-1], y[-1], 'ro', markersize=10, label='End')\n    ax.set_title(f'Walk {i+1}')\n    ax.set_aspect('equal')\n    ax.grid(True, alpha=0.3)\n\naxes[0, 0].legend()\nplt.tight_layout()\nplt.savefig('walks_2d.png')\nprint('Saved walks_2d.png')",
        solution: "import matplotlib.pyplot as plt\nimport random\n\ndef walk_2d(n):\n    x, y = [0], [0]\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    for _ in range(n):\n        dx, dy = random.choice(dirs)\n        x.append(x[-1] + dx)\n        y.append(y[-1] + dy)\n    return x, y\n\nfig, axes = plt.subplots(2, 2, figsize=(10, 10))\nfig.suptitle('Four 2D Random Walks (200 steps)')\n\nfor i, ax in enumerate(axes.flat):\n    x, y = walk_2d(200)\n    ax.plot(x, y, alpha=0.7)\n    ax.plot(0, 0, 'go', markersize=10, label='Start')\n    ax.plot(x[-1], y[-1], 'ro', markersize=10, label='End')\n    ax.set_title(f'Walk {i+1}')\n    ax.set_aspect('equal')\n    ax.grid(True, alpha=0.3)\n\naxes[0, 0].legend()\nplt.tight_layout()\nplt.savefig('walks_2d.png')\nprint('Saved walks_2d.png')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "walks_2d.png saved", description: "2D walks visualized" }]),
        hints: ["Track x and y separately", "set_aspect('equal') for true proportions", "Mark start (green) and end (red)"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 16.3.1`);

  const lesson16_3_2 = await prisma.lesson.upsert({
    where: { slug: "heatmaps-density-plots" },
    update: {},
    create: {
      sectionId: section16_3.id,
      number: 16.32,
      title: "Heatmaps and Density Plots",
      slug: "heatmaps-density-plots",
      objectives: [
        "Create 2D histograms (heatmaps)",
        "Visualize endpoint distributions",
        "Use color to show density",
        "Interpret density visualizations",
      ],
      content: `# Heatmaps and Density Plots

## What is a Heatmap?

A heatmap shows density using color intensity:
- Hot colors (yellow/red) = high density
- Cool colors (blue/purple) = low density

## 2D Histogram

For 2D random walks, we can visualize where endpoints cluster:

\`\`\`python
plt.hist2d(x_endpoints, y_endpoints, bins=20)
plt.colorbar()
\`\`\`

## Creating a Heatmap from Grid Data

\`\`\`python
plt.imshow(data, cmap='hot')
plt.colorbar()
\`\`\`

## Color Maps

- **'hot'**: Black → red → yellow → white
- **'viridis'**: Default, colorblind-friendly
- **'coolwarm'**: Blue → white → red
- **'Greys'**: White → black

## Why Heatmaps?

- Visualize where walkers end up
- Show concentration vs spread
- Reveal patterns invisible in line plots`,
      codeExamples: JSON.stringify([
        {
          id: "endpoint-heatmap",
          title: "2D Walk Endpoint Heatmap",
          code: "import matplotlib.pyplot as plt\nimport random\n\ndef walk_2d_endpoint(n):\n    x, y = 0, 0\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    for _ in range(n):\n        dx, dy = random.choice(dirs)\n        x, y = x + dx, y + dy\n    return x, y\n\n# Collect 1000 endpoints\nx_ends, y_ends = [], []\nfor _ in range(1000):\n    x, y = walk_2d_endpoint(100)\n    x_ends.append(x)\n    y_ends.append(y)\n\n# Create heatmap\nplt.figure(figsize=(8, 8))\nplt.hist2d(x_ends, y_ends, bins=25, cmap='hot')\nplt.colorbar(label='Count')\nplt.xlabel('X Position')\nplt.ylabel('Y Position')\nplt.title('2D Walk Endpoints (1000 walks, 100 steps)')\nplt.axis('equal')\nplt.savefig('endpoint_heatmap.png', dpi=100)\nprint('Saved endpoint_heatmap.png')",
          description: "Where do walkers end up?",
        },
        {
          id: "visit-heatmap",
          title: "Visit Frequency Heatmap",
          code: "import matplotlib.pyplot as plt\nimport random\nimport numpy as np\n\n# Track visits on a grid\ngrid_size = 41  # -20 to +20\nvisits = [[0]*grid_size for _ in range(grid_size)]\noffset = 20  # Center at (20, 20)\n\n# Multiple walks, track all visits\nfor _ in range(100):\n    x, y = 0, 0\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    for _ in range(200):\n        visits[y + offset][x + offset] += 1\n        dx, dy = random.choice(dirs)\n        x, y = x + dx, y + dy\n        # Keep in bounds\n        x = max(-20, min(20, x))\n        y = max(-20, min(20, y))\n\nplt.figure(figsize=(8, 8))\nplt.imshow(visits, cmap='hot', origin='lower',\n           extent=[-20, 20, -20, 20])\nplt.colorbar(label='Visit Count')\nplt.title('Visit Frequency (100 walks, 200 steps)')\nplt.xlabel('X')\nplt.ylabel('Y')\nplt.savefig('visit_heatmap.png', dpi=100)\nprint('Saved visit_heatmap.png')",
          description: "Which positions are visited most?",
        },
        {
          id: "biased-heatmap",
          title: "Biased Walk Endpoint Heatmap",
          code: "import matplotlib.pyplot as plt\nimport random\n\ndef biased_2d_endpoint(n, px, py):\n    \"\"\"2D walk with bias px (right) and py (up)\"\"\"\n    x, y = 0, 0\n    for _ in range(n):\n        x += 1 if random.random() < px else -1\n        y += 1 if random.random() < py else -1\n    return x, y\n\n# Biased toward upper-right (px=0.6, py=0.6)\nx_ends, y_ends = [], []\nfor _ in range(1000):\n    x, y = biased_2d_endpoint(100, 0.6, 0.6)\n    x_ends.append(x)\n    y_ends.append(y)\n\nplt.figure(figsize=(8, 8))\nplt.hist2d(x_ends, y_ends, bins=25, cmap='viridis')\nplt.colorbar(label='Count')\nplt.xlabel('X Position')\nplt.ylabel('Y Position')\nplt.title('Biased 2D Walk (px=0.6, py=0.6)')\nplt.axhline(y=0, color='white', linestyle='--', alpha=0.5)\nplt.axvline(x=0, color='white', linestyle='--', alpha=0.5)\nplt.savefig('biased_heatmap.png', dpi=100)\nprint('Saved biased_heatmap.png')",
          description: "Heatmap shows drift direction",
        },
      ]),
      keyPoints: [
        "Heatmaps show density via color",
        "plt.hist2d() for 2D histograms",
        "plt.imshow() for grid data",
        "colorbar() adds legend for colors",
        "Choose colormap with cmap parameter",
        "Great for visualizing distributions",
      ],
      hardwareDemo: "Watch bin counting for 2D histogram. See color mapping calculation.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson16_3_2.number}: ${lesson16_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson16_3_2.id,
        number: 1,
        title: "Basic Endpoint Heatmap",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Run 500 2D random walks of 100 steps. Create heatmap of endpoints using plt.hist2d().",
        starterCode: "import matplotlib.pyplot as plt\nimport random\n\ndef walk_2d(n):\n    x, y = 0, 0\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    for _ in range(n):\n        dx, dy = random.choice(dirs)\n        x, y = x + dx, y + dy\n    return x, y\n\nx_ends = []\ny_ends = []\nfor _ in range(500):\n    x, y = walk_2d(100)\n    x_ends.append(x)\n    y_ends.append(y)\n\nplt.figure(figsize=(8, 8))\nplt.hist2d(x_ends, y_ends, bins=20, cmap='hot')\nplt.colorbar(label='Count')\nplt.title('2D Walk Endpoints (500 walks)')\nplt.xlabel('X')\nplt.ylabel('Y')\nplt.savefig('basic_heatmap.png')\nprint('Saved basic_heatmap.png')",
        solution: "import matplotlib.pyplot as plt\nimport random\n\ndef walk_2d(n):\n    x, y = 0, 0\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    for _ in range(n):\n        dx, dy = random.choice(dirs)\n        x, y = x + dx, y + dy\n    return x, y\n\nx_ends = []\ny_ends = []\nfor _ in range(500):\n    x, y = walk_2d(100)\n    x_ends.append(x)\n    y_ends.append(y)\n\nplt.figure(figsize=(8, 8))\nplt.hist2d(x_ends, y_ends, bins=20, cmap='hot')\nplt.colorbar(label='Count')\nplt.title('2D Walk Endpoints (500 walks)')\nplt.xlabel('X')\nplt.ylabel('Y')\nplt.savefig('basic_heatmap.png')\nprint('Saved basic_heatmap.png')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "basic_heatmap.png saved", description: "Heatmap created" }]),
        hints: ["Collect x and y endpoints separately", "hist2d takes x_list, y_list", "Center should be hottest"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson16_3_2.id,
        number: 2,
        title: "Different Color Maps",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create 2x2 subplot showing same data with 4 different colormaps: 'hot', 'viridis', 'coolwarm', 'plasma'.",
        starterCode: "import matplotlib.pyplot as plt\nimport random\n\ndef walk_2d(n):\n    x, y = 0, 0\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    for _ in range(n):\n        dx, dy = random.choice(dirs)\n        x, y = x + dx, y + dy\n    return x, y\n\n# Collect endpoints\nx_ends = [walk_2d(100)[0] for _ in range(500)]\ny_ends = [walk_2d(100)[1] for _ in range(500)]\n\ncmaps = ['hot', 'viridis', 'coolwarm', 'plasma']\nfig, axes = plt.subplots(2, 2, figsize=(10, 10))\nfig.suptitle('Different Colormaps')\n\nfor ax, cmap in zip(axes.flat, cmaps):\n    ax.hist2d(x_ends, y_ends, bins=15, cmap=cmap)\n    ax.set_title(cmap)\n\nplt.tight_layout()\nplt.savefig('colormaps.png')\nprint('Saved colormaps.png')",
        solution: "import matplotlib.pyplot as plt\nimport random\n\ndef walk_2d(n):\n    x, y = 0, 0\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    for _ in range(n):\n        dx, dy = random.choice(dirs)\n        x, y = x + dx, y + dy\n    return x, y\n\nx_ends = [walk_2d(100)[0] for _ in range(500)]\ny_ends = [walk_2d(100)[1] for _ in range(500)]\n\ncmaps = ['hot', 'viridis', 'coolwarm', 'plasma']\nfig, axes = plt.subplots(2, 2, figsize=(10, 10))\nfig.suptitle('Different Colormaps')\n\nfor ax, cmap in zip(axes.flat, cmaps):\n    ax.hist2d(x_ends, y_ends, bins=15, cmap=cmap)\n    ax.set_title(cmap)\n\nplt.tight_layout()\nplt.savefig('colormaps.png')\nprint('Saved colormaps.png')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "colormaps.png saved", description: "4 colormaps shown" }]),
        hints: ["Same data, different cmap", "cmap parameter changes colors", "viridis is colorblind-friendly"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson16_3_2.id,
        number: 3,
        title: "Biased Walk Heatmap",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create heatmap for biased 2D walk (px=0.6, py=0.55). Run 800 walks. Show drift in heatmap.",
        starterCode: "import matplotlib.pyplot as plt\nimport random\n\ndef biased_2d(n, px, py):\n    x, y = 0, 0\n    for _ in range(n):\n        x += 1 if random.random() < px else -1\n        y += 1 if random.random() < py else -1\n    return x, y\n\nx_ends, y_ends = [], []\nfor _ in range(800):\n    x, y = biased_2d(100, 0.6, 0.55)\n    x_ends.append(x)\n    y_ends.append(y)\n\nplt.figure(figsize=(8, 8))\nplt.hist2d(x_ends, y_ends, bins=25, cmap='viridis')\nplt.colorbar(label='Count')\nplt.axhline(y=0, color='white', linestyle='--', alpha=0.5)\nplt.axvline(x=0, color='white', linestyle='--', alpha=0.5)\nplt.title('Biased 2D Walk (px=0.6, py=0.55)')\nplt.savefig('biased_heat.png')\nprint('Saved biased_heat.png')",
        solution: "import matplotlib.pyplot as plt\nimport random\n\ndef biased_2d(n, px, py):\n    x, y = 0, 0\n    for _ in range(n):\n        x += 1 if random.random() < px else -1\n        y += 1 if random.random() < py else -1\n    return x, y\n\nx_ends, y_ends = [], []\nfor _ in range(800):\n    x, y = biased_2d(100, 0.6, 0.55)\n    x_ends.append(x)\n    y_ends.append(y)\n\nplt.figure(figsize=(8, 8))\nplt.hist2d(x_ends, y_ends, bins=25, cmap='viridis')\nplt.colorbar(label='Count')\nplt.axhline(y=0, color='white', linestyle='--', alpha=0.5)\nplt.axvline(x=0, color='white', linestyle='--', alpha=0.5)\nplt.title('Biased 2D Walk (px=0.6, py=0.55)')\nplt.savefig('biased_heat.png')\nprint('Saved biased_heat.png')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "biased_heat.png saved", description: "Drift visible" }]),
        hints: ["Expected x: 100×0.2=20, y: 100×0.1=10", "Hot spot should be upper-right", "Origin marked with dashed lines"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson16_3_2.id,
        number: 4,
        title: "Compare Unbiased vs Biased",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create 1x2 subplot: left shows unbiased (p=0.5), right shows biased (p=0.65). 500 walks each. Same color scale.",
        starterCode: "import matplotlib.pyplot as plt\nimport random\n\ndef walk_2d(n, p=0.5):\n    x, y = 0, 0\n    for _ in range(n):\n        x += 1 if random.random() < p else -1\n        y += 1 if random.random() < p else -1\n    return x, y\n\n# Unbiased\nx1, y1 = zip(*[walk_2d(100, 0.5) for _ in range(500)])\n# Biased\nx2, y2 = zip(*[walk_2d(100, 0.65) for _ in range(500)])\n\nfig, axes = plt.subplots(1, 2, figsize=(12, 5))\nfig.suptitle('Unbiased vs Biased Random Walks')\n\naxes[0].hist2d(x1, y1, bins=20, cmap='hot', range=[[-30,30],[-30,30]])\naxes[0].set_title('Unbiased (p=0.5)')\n\naxes[1].hist2d(x2, y2, bins=20, cmap='hot', range=[[-30,50],[-30,50]])\naxes[1].set_title('Biased (p=0.65)')\n\nfor ax in axes:\n    ax.axhline(y=0, color='white', linestyle='--', alpha=0.5)\n    ax.axvline(x=0, color='white', linestyle='--', alpha=0.5)\n\nplt.tight_layout()\nplt.savefig('compare_bias.png')\nprint('Saved compare_bias.png')",
        solution: "import matplotlib.pyplot as plt\nimport random\n\ndef walk_2d(n, p=0.5):\n    x, y = 0, 0\n    for _ in range(n):\n        x += 1 if random.random() < p else -1\n        y += 1 if random.random() < p else -1\n    return x, y\n\nx1, y1 = zip(*[walk_2d(100, 0.5) for _ in range(500)])\nx2, y2 = zip(*[walk_2d(100, 0.65) for _ in range(500)])\n\nfig, axes = plt.subplots(1, 2, figsize=(12, 5))\nfig.suptitle('Unbiased vs Biased Random Walks')\n\naxes[0].hist2d(x1, y1, bins=20, cmap='hot', range=[[-30,30],[-30,30]])\naxes[0].set_title('Unbiased (p=0.5)')\n\naxes[1].hist2d(x2, y2, bins=20, cmap='hot', range=[[-30,50],[-30,50]])\naxes[1].set_title('Biased (p=0.65)')\n\nfor ax in axes:\n    ax.axhline(y=0, color='white', linestyle='--', alpha=0.5)\n    ax.axvline(x=0, color='white', linestyle='--', alpha=0.5)\n\nplt.tight_layout()\nplt.savefig('compare_bias.png')\nprint('Saved compare_bias.png')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "compare_bias.png saved", description: "Side-by-side comparison" }]),
        hints: ["zip(*list) unpacks list of tuples", "Biased should be shifted up-right", "range parameter controls axes"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson16_3_2.id,
        number: 5,
        title: "Time Evolution Heatmaps",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create 2x2 showing endpoints at steps 25, 50, 100, 200. Show how distribution spreads over time.",
        starterCode: "import matplotlib.pyplot as plt\nimport random\n\ndef walk_2d_at_step(n):\n    x, y = 0, 0\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    for _ in range(n):\n        dx, dy = random.choice(dirs)\n        x, y = x + dx, y + dy\n    return x, y\n\nsteps = [25, 50, 100, 200]\nfig, axes = plt.subplots(2, 2, figsize=(10, 10))\nfig.suptitle('Distribution Spreads Over Time')\n\nfor ax, n in zip(axes.flat, steps):\n    x_ends, y_ends = zip(*[walk_2d_at_step(n) for _ in range(500)])\n    ax.hist2d(x_ends, y_ends, bins=20, cmap='hot',\n              range=[[-25, 25], [-25, 25]])\n    ax.set_title(f'{n} steps')\n    ax.set_aspect('equal')\n\nplt.tight_layout()\nplt.savefig('time_evolution.png')\nprint('Saved time_evolution.png')",
        solution: "import matplotlib.pyplot as plt\nimport random\n\ndef walk_2d_at_step(n):\n    x, y = 0, 0\n    dirs = [(0,1), (0,-1), (1,0), (-1,0)]\n    for _ in range(n):\n        dx, dy = random.choice(dirs)\n        x, y = x + dx, y + dy\n    return x, y\n\nsteps = [25, 50, 100, 200]\nfig, axes = plt.subplots(2, 2, figsize=(10, 10))\nfig.suptitle('Distribution Spreads Over Time')\n\nfor ax, n in zip(axes.flat, steps):\n    x_ends, y_ends = zip(*[walk_2d_at_step(n) for _ in range(500)])\n    ax.hist2d(x_ends, y_ends, bins=20, cmap='hot',\n              range=[[-25, 25], [-25, 25]])\n    ax.set_title(f'{n} steps')\n    ax.set_aspect('equal')\n\nplt.tight_layout()\nplt.savefig('time_evolution.png')\nprint('Saved time_evolution.png')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "time_evolution.png saved", description: "Spreading distribution" }]),
        hints: ["Same range for comparison", "Distribution should spread over time", "Spread grows as √n"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 16.3.2`);

  console.log("\n✅ Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
