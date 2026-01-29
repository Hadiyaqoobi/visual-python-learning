import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 4: Lesson 16.3.3 (3D Visualization)...\n");

  const section16_3 = await prisma.section.findFirst({ where: { number: 16.3 } });
  if (!section16_3) throw new Error("Section 16.3 not found. Run part 1 first.");

  const lesson16_3_3 = await prisma.lesson.upsert({
    where: { slug: "3d-visualization-basics" },
    update: {},
    create: {
      sectionId: section16_3.id,
      number: 16.33,
      title: "3D Visualization Basics",
      slug: "3d-visualization-basics",
      objectives: [
        "Create 3D plots with matplotlib",
        "Visualize 3D random walks",
        "Plot 3D surfaces",
        "Understand when to use 3D visualization",
      ],
      content: `# 3D Visualization Basics

## Setting Up 3D Axes

\`\`\`python
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.pyplot as plt

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
\`\`\`

## 3D Line Plots

\`\`\`python
ax.plot3D(x, y, z)  # 3D line
\`\`\`

## 3D Scatter Plots

\`\`\`python
ax.scatter3D(x, y, z, c=colors, cmap='viridis')
\`\`\`

## 3D Surface Plots

\`\`\`python
ax.plot_surface(X, Y, Z, cmap='viridis')
\`\`\`

## 3D Random Walks

Extend 2D walks to 3D:
- 6 directions: ±x, ±y, ±z
- Track (x, y, z) over time

## When to Use 3D

✅ Actual 3D data (molecular positions, trajectories)
✅ Functions of two variables: z = f(x, y)
✅ Time as third dimension

❌ When 2D is clearer (often!)
❌ Complex data (hard to interpret)`,
      codeExamples: JSON.stringify([
        {
          id: "3d-random-walk",
          title: "3D Random Walk",
          code: "import matplotlib.pyplot as plt\nfrom mpl_toolkits.mplot3d import Axes3D\nimport random\n\ndef walk_3d(n):\n    x, y, z = [0], [0], [0]\n    dirs = [(1,0,0), (-1,0,0), (0,1,0), (0,-1,0), (0,0,1), (0,0,-1)]\n    \n    for _ in range(n):\n        dx, dy, dz = random.choice(dirs)\n        x.append(x[-1] + dx)\n        y.append(y[-1] + dy)\n        z.append(z[-1] + dz)\n    return x, y, z\n\nx, y, z = walk_3d(500)\n\nfig = plt.figure(figsize=(10, 8))\nax = fig.add_subplot(111, projection='3d')\nax.plot3D(x, y, z, alpha=0.7)\nax.scatter3D([0], [0], [0], color='green', s=100, label='Start')\nax.scatter3D([x[-1]], [y[-1]], [z[-1]], color='red', s=100, label='End')\nax.set_xlabel('X')\nax.set_ylabel('Y')\nax.set_zlabel('Z')\nax.set_title('3D Random Walk (500 steps)')\nax.legend()\nplt.savefig('walk_3d.png', dpi=100)\nprint('Saved walk_3d.png')",
          description: "Random walk in 3D space",
        },
        {
          id: "3d-scatter-endpoints",
          title: "3D Scatter of Endpoints",
          code: "import matplotlib.pyplot as plt\nfrom mpl_toolkits.mplot3d import Axes3D\nimport random\n\ndef walk_3d_endpoint(n):\n    x, y, z = 0, 0, 0\n    dirs = [(1,0,0), (-1,0,0), (0,1,0), (0,-1,0), (0,0,1), (0,0,-1)]\n    for _ in range(n):\n        dx, dy, dz = random.choice(dirs)\n        x, y, z = x+dx, y+dy, z+dz\n    return x, y, z\n\n# Collect 200 endpoints\nendpoints = [walk_3d_endpoint(100) for _ in range(200)]\nx_e, y_e, z_e = zip(*endpoints)\n\n# Distance for coloring\nimport math\ndists = [math.sqrt(x**2+y**2+z**2) for x,y,z in endpoints]\n\nfig = plt.figure(figsize=(10, 8))\nax = fig.add_subplot(111, projection='3d')\nsc = ax.scatter3D(x_e, y_e, z_e, c=dists, cmap='viridis', alpha=0.6)\nplt.colorbar(sc, label='Distance from origin')\nax.scatter3D([0], [0], [0], color='red', s=200, marker='*')\nax.set_title('3D Walk Endpoints (200 walks, 100 steps)')\nplt.savefig('endpoints_3d.png', dpi=100)\nprint('Saved endpoints_3d.png')",
          description: "Scatter plot of 3D walk endpoints",
        },
        {
          id: "3d-surface",
          title: "3D Surface Plot",
          code: "import matplotlib.pyplot as plt\nfrom mpl_toolkits.mplot3d import Axes3D\nimport numpy as np\n\n# Create grid\nx = np.linspace(-3, 3, 50)\ny = np.linspace(-3, 3, 50)\nX, Y = np.meshgrid(x, y)\n\n# Gaussian surface (like endpoint distribution)\nZ = np.exp(-(X**2 + Y**2) / 2)\n\nfig = plt.figure(figsize=(10, 8))\nax = fig.add_subplot(111, projection='3d')\nsurf = ax.plot_surface(X, Y, Z, cmap='viridis', alpha=0.8)\nplt.colorbar(surf, shrink=0.5)\nax.set_xlabel('X')\nax.set_ylabel('Y')\nax.set_zlabel('Probability')\nax.set_title('Gaussian Distribution Surface')\nplt.savefig('surface_3d.png', dpi=100)\nprint('Saved surface_3d.png')",
          description: "3D surface visualization",
        },
      ]),
      keyPoints: [
        "Use projection='3d' for 3D axes",
        "plot3D() for 3D lines",
        "scatter3D() for 3D points",
        "plot_surface() for surfaces",
        "6 directions in 3D walks",
        "3D good for trajectories, use carefully",
      ],
      hardwareDemo: "Watch 3D coordinate tracking. See projection calculations for display.",
      estimatedTime: 30,
      difficulty: "ADVANCED",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson16_3_3.number}: ${lesson16_3_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson16_3_3.id,
        number: 1,
        title: "Basic 3D Walk",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement 3D random walk (100 steps) with 6 directions. Plot using plot3D(). Mark start and end.",
        starterCode: "import matplotlib.pyplot as plt\nfrom mpl_toolkits.mplot3d import Axes3D\nimport random\n\ndef walk_3d(n):\n    x, y, z = [0], [0], [0]\n    dirs = [(1,0,0), (-1,0,0), (0,1,0), (0,-1,0), (0,0,1), (0,0,-1)]\n    \n    for _ in range(n):\n        dx, dy, dz = random.choice(dirs)\n        x.append(x[-1] + dx)\n        y.append(y[-1] + dy)\n        z.append(z[-1] + dz)\n    return x, y, z\n\nx, y, z = walk_3d(100)\n\nfig = plt.figure(figsize=(8, 8))\nax = fig.add_subplot(111, projection='3d')\nax.plot3D(x, y, z)\nax.scatter3D([0], [0], [0], color='green', s=100, label='Start')\nax.scatter3D([x[-1]], [y[-1]], [z[-1]], color='red', s=100, label='End')\nax.legend()\nax.set_title('3D Random Walk')\nplt.savefig('basic_3d.png')\nprint('Saved basic_3d.png')",
        solution: "import matplotlib.pyplot as plt\nfrom mpl_toolkits.mplot3d import Axes3D\nimport random\n\ndef walk_3d(n):\n    x, y, z = [0], [0], [0]\n    dirs = [(1,0,0), (-1,0,0), (0,1,0), (0,-1,0), (0,0,1), (0,0,-1)]\n    \n    for _ in range(n):\n        dx, dy, dz = random.choice(dirs)\n        x.append(x[-1] + dx)\n        y.append(y[-1] + dy)\n        z.append(z[-1] + dz)\n    return x, y, z\n\nx, y, z = walk_3d(100)\n\nfig = plt.figure(figsize=(8, 8))\nax = fig.add_subplot(111, projection='3d')\nax.plot3D(x, y, z)\nax.scatter3D([0], [0], [0], color='green', s=100, label='Start')\nax.scatter3D([x[-1]], [y[-1]], [z[-1]], color='red', s=100, label='End')\nax.legend()\nax.set_title('3D Random Walk')\nplt.savefig('basic_3d.png')\nprint('Saved basic_3d.png')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "basic_3d.png saved", description: "3D walk plotted" }]),
        hints: ["6 directions: ±x, ±y, ±z", "Use projection='3d'", "plot3D for the path"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson16_3_3.id,
        number: 2,
        title: "Multiple 3D Walks",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Plot 5 different 3D walks (200 steps each) on the same axes. Use different colors.",
        starterCode: "import matplotlib.pyplot as plt\nfrom mpl_toolkits.mplot3d import Axes3D\nimport random\n\ndef walk_3d(n):\n    x, y, z = [0], [0], [0]\n    dirs = [(1,0,0), (-1,0,0), (0,1,0), (0,-1,0), (0,0,1), (0,0,-1)]\n    for _ in range(n):\n        dx, dy, dz = random.choice(dirs)\n        x.append(x[-1]+dx)\n        y.append(y[-1]+dy)\n        z.append(z[-1]+dz)\n    return x, y, z\n\nfig = plt.figure(figsize=(10, 8))\nax = fig.add_subplot(111, projection='3d')\n\ncolors = ['blue', 'red', 'green', 'orange', 'purple']\nfor i, color in enumerate(colors):\n    x, y, z = walk_3d(200)\n    ax.plot3D(x, y, z, color=color, alpha=0.6, label=f'Walk {i+1}')\n\nax.scatter3D([0], [0], [0], color='black', s=200, marker='*')\nax.set_title('5 Random 3D Walks')\nax.legend()\nplt.savefig('multi_3d.png')\nprint('Saved multi_3d.png')",
        solution: "import matplotlib.pyplot as plt\nfrom mpl_toolkits.mplot3d import Axes3D\nimport random\n\ndef walk_3d(n):\n    x, y, z = [0], [0], [0]\n    dirs = [(1,0,0), (-1,0,0), (0,1,0), (0,-1,0), (0,0,1), (0,0,-1)]\n    for _ in range(n):\n        dx, dy, dz = random.choice(dirs)\n        x.append(x[-1]+dx)\n        y.append(y[-1]+dy)\n        z.append(z[-1]+dz)\n    return x, y, z\n\nfig = plt.figure(figsize=(10, 8))\nax = fig.add_subplot(111, projection='3d')\n\ncolors = ['blue', 'red', 'green', 'orange', 'purple']\nfor i, color in enumerate(colors):\n    x, y, z = walk_3d(200)\n    ax.plot3D(x, y, z, color=color, alpha=0.6, label=f'Walk {i+1}')\n\nax.scatter3D([0], [0], [0], color='black', s=200, marker='*')\nax.set_title('5 Random 3D Walks')\nax.legend()\nplt.savefig('multi_3d.png')\nprint('Saved multi_3d.png')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "multi_3d.png saved", description: "5 walks overlaid" }]),
        hints: ["Loop through colors", "alpha for transparency", "All start at origin"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson16_3_3.id,
        number: 3,
        title: "3D Endpoint Scatter",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Run 300 3D walks (100 steps). Create scatter plot of endpoints. Color by distance from origin.",
        starterCode: "import matplotlib.pyplot as plt\nfrom mpl_toolkits.mplot3d import Axes3D\nimport random\nimport math\n\ndef walk_3d_end(n):\n    x, y, z = 0, 0, 0\n    dirs = [(1,0,0), (-1,0,0), (0,1,0), (0,-1,0), (0,0,1), (0,0,-1)]\n    for _ in range(n):\n        dx, dy, dz = random.choice(dirs)\n        x, y, z = x+dx, y+dy, z+dz\n    return x, y, z\n\nendpoints = [walk_3d_end(100) for _ in range(300)]\nx_e, y_e, z_e = zip(*endpoints)\ndists = [math.sqrt(x**2+y**2+z**2) for x,y,z in endpoints]\n\nfig = plt.figure(figsize=(10, 8))\nax = fig.add_subplot(111, projection='3d')\nsc = ax.scatter3D(x_e, y_e, z_e, c=dists, cmap='plasma', alpha=0.6)\nplt.colorbar(sc, label='Distance')\nax.scatter3D([0], [0], [0], color='red', s=200, marker='*')\nax.set_title('3D Walk Endpoints (300 walks)')\nplt.savefig('scatter_3d.png')\nprint('Saved scatter_3d.png')",
        solution: "import matplotlib.pyplot as plt\nfrom mpl_toolkits.mplot3d import Axes3D\nimport random\nimport math\n\ndef walk_3d_end(n):\n    x, y, z = 0, 0, 0\n    dirs = [(1,0,0), (-1,0,0), (0,1,0), (0,-1,0), (0,0,1), (0,0,-1)]\n    for _ in range(n):\n        dx, dy, dz = random.choice(dirs)\n        x, y, z = x+dx, y+dy, z+dz\n    return x, y, z\n\nendpoints = [walk_3d_end(100) for _ in range(300)]\nx_e, y_e, z_e = zip(*endpoints)\ndists = [math.sqrt(x**2+y**2+z**2) for x,y,z in endpoints]\n\nfig = plt.figure(figsize=(10, 8))\nax = fig.add_subplot(111, projection='3d')\nsc = ax.scatter3D(x_e, y_e, z_e, c=dists, cmap='plasma', alpha=0.6)\nplt.colorbar(sc, label='Distance')\nax.scatter3D([0], [0], [0], color='red', s=200, marker='*')\nax.set_title('3D Walk Endpoints (300 walks)')\nplt.savefig('scatter_3d.png')\nprint('Saved scatter_3d.png')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "scatter_3d.png saved", description: "Endpoints colored by distance" }]),
        hints: ["c=dists colors by distance", "cmap='plasma' for colors", "Closer points are one color"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson16_3_3.id,
        number: 4,
        title: "Time-Colored 3D Walk",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create single 3D walk (300 steps). Color the path by time (step number) to show progression.",
        starterCode: "import matplotlib.pyplot as plt\nfrom mpl_toolkits.mplot3d import Axes3D\nimport random\nimport numpy as np\n\ndef walk_3d(n):\n    x, y, z = [0], [0], [0]\n    dirs = [(1,0,0), (-1,0,0), (0,1,0), (0,-1,0), (0,0,1), (0,0,-1)]\n    for _ in range(n):\n        dx, dy, dz = random.choice(dirs)\n        x.append(x[-1]+dx)\n        y.append(y[-1]+dy)\n        z.append(z[-1]+dz)\n    return np.array(x), np.array(y), np.array(z)\n\nx, y, z = walk_3d(300)\ntime = np.arange(len(x))\n\nfig = plt.figure(figsize=(10, 8))\nax = fig.add_subplot(111, projection='3d')\n\n# Plot segments with color\nfor i in range(len(x)-1):\n    ax.plot3D(x[i:i+2], y[i:i+2], z[i:i+2], \n              color=plt.cm.viridis(i/len(x)), alpha=0.7)\n\nax.scatter3D([x[0]], [y[0]], [z[0]], color='green', s=100, label='Start')\nax.scatter3D([x[-1]], [y[-1]], [z[-1]], color='red', s=100, label='End')\nax.set_title('3D Walk Colored by Time')\nax.legend()\nplt.savefig('time_3d.png')\nprint('Saved time_3d.png')",
        solution: "import matplotlib.pyplot as plt\nfrom mpl_toolkits.mplot3d import Axes3D\nimport random\nimport numpy as np\n\ndef walk_3d(n):\n    x, y, z = [0], [0], [0]\n    dirs = [(1,0,0), (-1,0,0), (0,1,0), (0,-1,0), (0,0,1), (0,0,-1)]\n    for _ in range(n):\n        dx, dy, dz = random.choice(dirs)\n        x.append(x[-1]+dx)\n        y.append(y[-1]+dy)\n        z.append(z[-1]+dz)\n    return np.array(x), np.array(y), np.array(z)\n\nx, y, z = walk_3d(300)\ntime = np.arange(len(x))\n\nfig = plt.figure(figsize=(10, 8))\nax = fig.add_subplot(111, projection='3d')\n\nfor i in range(len(x)-1):\n    ax.plot3D(x[i:i+2], y[i:i+2], z[i:i+2], \n              color=plt.cm.viridis(i/len(x)), alpha=0.7)\n\nax.scatter3D([x[0]], [y[0]], [z[0]], color='green', s=100, label='Start')\nax.scatter3D([x[-1]], [y[-1]], [z[-1]], color='red', s=100, label='End')\nax.set_title('3D Walk Colored by Time')\nax.legend()\nplt.savefig('time_3d.png')\nprint('Saved time_3d.png')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "time_3d.png saved", description: "Time progression visible" }]),
        hints: ["Plot each segment separately", "plt.cm.viridis(fraction) gets color", "Early = purple, late = yellow"],
        xpReward: 25,
        order: 4,
      },
      {
        lessonId: lesson16_3_3.id,
        number: 5,
        title: "3D Brownian Motion",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create 3D Brownian motion (Gaussian steps, σ=1, 200 steps). Plot path and mark start/end.",
        starterCode: "import matplotlib.pyplot as plt\nfrom mpl_toolkits.mplot3d import Axes3D\nimport random\n\ndef brownian_3d(n, sigma=1.0):\n    x, y, z = [0], [0], [0]\n    for _ in range(n):\n        x.append(x[-1] + random.gauss(0, sigma))\n        y.append(y[-1] + random.gauss(0, sigma))\n        z.append(z[-1] + random.gauss(0, sigma))\n    return x, y, z\n\nx, y, z = brownian_3d(200, sigma=1.0)\n\nfig = plt.figure(figsize=(10, 8))\nax = fig.add_subplot(111, projection='3d')\nax.plot3D(x, y, z, alpha=0.7)\nax.scatter3D([0], [0], [0], color='green', s=100, label='Start')\nax.scatter3D([x[-1]], [y[-1]], [z[-1]], color='red', s=100, label='End')\nax.set_xlabel('X')\nax.set_ylabel('Y')\nax.set_zlabel('Z')\nax.set_title('3D Brownian Motion (σ=1)')\nax.legend()\nplt.savefig('brownian_3d.png')\nprint('Saved brownian_3d.png')",
        solution: "import matplotlib.pyplot as plt\nfrom mpl_toolkits.mplot3d import Axes3D\nimport random\n\ndef brownian_3d(n, sigma=1.0):\n    x, y, z = [0], [0], [0]\n    for _ in range(n):\n        x.append(x[-1] + random.gauss(0, sigma))\n        y.append(y[-1] + random.gauss(0, sigma))\n        z.append(z[-1] + random.gauss(0, sigma))\n    return x, y, z\n\nx, y, z = brownian_3d(200, sigma=1.0)\n\nfig = plt.figure(figsize=(10, 8))\nax = fig.add_subplot(111, projection='3d')\nax.plot3D(x, y, z, alpha=0.7)\nax.scatter3D([0], [0], [0], color='green', s=100, label='Start')\nax.scatter3D([x[-1]], [y[-1]], [z[-1]], color='red', s=100, label='End')\nax.set_xlabel('X')\nax.set_ylabel('Y')\nax.set_zlabel('Z')\nax.set_title('3D Brownian Motion (σ=1)')\nax.legend()\nplt.savefig('brownian_3d.png')\nprint('Saved brownian_3d.png')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "brownian_3d.png saved", description: "3D Brownian motion" }]),
        hints: ["Gaussian step for each axis", "Smoother than discrete walk", "Models real physical diffusion"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 16.3.3`);

  console.log("\n✅ Part 4 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
