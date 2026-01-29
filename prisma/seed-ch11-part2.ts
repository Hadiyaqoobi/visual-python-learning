import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 11 Part 2: Lessons 11.1.4-11.2.2...\n");

  const section11_1 = await prisma.section.findFirst({ where: { number: 11.1 } });
  const section11_2 = await prisma.section.findFirst({ where: { number: 11.2 } });
  if (!section11_1 || !section11_2) throw new Error("Sections not found.");

  // ==================== LESSON 11.1.4 ====================
  const lesson11_1_4 = await prisma.lesson.upsert({
    where: { slug: "multiple-datasets" },
    update: {},
    create: {
      sectionId: section11_1.id,
      number: 11.14,
      title: "Multiple Datasets",
      slug: "multiple-datasets",
      objectives: [
        "Plot multiple lines on one chart",
        "Create effective legends",
        "Use different styles for distinction",
        "Compare data visually",
      ],
      content: `# Multiple Datasets

## Plotting Multiple Lines

Just call plot() multiple times:

\`\`\`python
plt.plot(x, y1, label='Dataset 1')
plt.plot(x, y2, label='Dataset 2')
plt.legend()
\`\`\`

## Legends

Legends explain what each line represents:

\`\`\`python
plt.legend()                    # Auto position
plt.legend(loc='upper left')    # Specific position
plt.legend(loc='best')          # Matplotlib chooses
\`\`\`

### Legend Positions
- 'upper right', 'upper left'
- 'lower right', 'lower left'
- 'center', 'center left', 'center right'
- 'best' (automatic)

## Distinguishing Lines

Use different:
- **Colors**: 'red', 'blue', 'green'
- **Line styles**: '-', '--', ':', '-.'
- **Markers**: 'o', 's', '^', 'v'

\`\`\`python
plt.plot(x, y1, 'r-o', label='A')   # Red solid circles
plt.plot(x, y2, 'b--s', label='B')  # Blue dashed squares
plt.plot(x, y3, 'g:^', label='C')   # Green dotted triangles
\`\`\`

## Tips for Multiple Datasets

1. **Limit to 5-6 lines** for readability
2. **Use contrasting colors**
3. **Consider colorblind-friendly palettes**
4. **Make legends clear and concise**`,
      codeExamples: JSON.stringify([
        {
          id: "two-lines",
          title: "Two Lines Comparison",
          code: "import matplotlib.pyplot as plt\n\nmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']\nsales_2023 = [100, 120, 115, 130, 145, 160]\nsales_2024 = [110, 125, 140, 155, 170, 190]\n\nplt.plot(months, sales_2023, 'b-o', label='2023')\nplt.plot(months, sales_2024, 'r-s', label='2024')\n\nplt.xlabel('Month')\nplt.ylabel('Sales ($K)')\nplt.title('Year over Year Sales Comparison')\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.show()",
          description: "Compare two years of data",
        },
        {
          id: "multiple-styled",
          title: "Multiple Lines with Distinct Styles",
          code: "import matplotlib.pyplot as plt\nimport math\n\nx = [i/10 for i in range(0, 63)]\nsin_y = [math.sin(xi) for xi in x]\ncos_y = [math.cos(xi) for xi in x]\ntan_y = [math.tan(xi) if abs(math.tan(xi)) < 5 else None for xi in x]\n\nfig, ax = plt.subplots(figsize=(12, 6))\n\nax.plot(x, sin_y, 'b-', linewidth=2, label='sin(x)')\nax.plot(x, cos_y, 'r--', linewidth=2, label='cos(x)')\nax.plot(x, tan_y, 'g:', linewidth=2, label='tan(x)')\n\nax.set_xlabel('x (radians)')\nax.set_ylabel('y')\nax.set_title('Trigonometric Functions')\nax.legend(loc='upper right')\nax.grid(True, alpha=0.3)\nax.set_ylim(-3, 3)\n\nplt.show()",
          description: "Different line styles for clarity",
        },
        {
          id: "color-cycle",
          title: "Using Matplotlib's Color Cycle",
          code: "import matplotlib.pyplot as plt\n\nx = list(range(1, 11))\n\nfig, ax = plt.subplots(figsize=(10, 6))\n\n# Matplotlib automatically cycles through colors\nfor i in range(5):\n    y = [val + i*10 for val in x]\n    ax.plot(x, y, marker='o', label=f'Series {i+1}')\n\nax.set_xlabel('X')\nax.set_ylabel('Y')\nax.set_title('Auto Color Cycling')\nax.legend()\nax.grid(True, alpha=0.3)\n\nplt.show()\n\nprint(\"Matplotlib automatically assigns different colors!\")",
          description: "Automatic color assignment",
        },
        {
          id: "professional-comparison",
          title: "Professional Multi-Line Chart",
          code: "import matplotlib.pyplot as plt\n\nquarters = ['Q1', 'Q2', 'Q3', 'Q4']\nproduct_a = [50, 65, 80, 95]\nproduct_b = [80, 85, 75, 90]\nproduct_c = [30, 45, 60, 85]\n\nfig, ax = plt.subplots(figsize=(10, 6))\n\n# Distinct colors and styles\nax.plot(quarters, product_a, color='#2ecc71', linewidth=2.5, \n        marker='o', markersize=10, label='Product A')\nax.plot(quarters, product_b, color='#3498db', linewidth=2.5, \n        marker='s', markersize=10, label='Product B')\nax.plot(quarters, product_c, color='#e74c3c', linewidth=2.5, \n        marker='^', markersize=10, label='Product C')\n\nax.set_xlabel('Quarter', fontsize=12)\nax.set_ylabel('Revenue ($K)', fontsize=12)\nax.set_title('Quarterly Revenue by Product', fontsize=14, fontweight='bold')\nax.legend(loc='upper left', frameon=True, fancybox=True, shadow=True)\nax.grid(True, linestyle='--', alpha=0.5)\nax.set_ylim(0, 110)\n\nplt.tight_layout()\nplt.show()",
          description: "Publication-quality comparison chart",
        },
      ]),
      keyPoints: [
        "Call plot() multiple times for multiple lines",
        "Use label parameter for legend entries",
        "plt.legend() displays the legend",
        "loc='best' lets matplotlib position legend",
        "Use different colors and styles for distinction",
        "Limit to 5-6 lines for readability",
        "Matplotlib auto-cycles through colors",
        "Consider colorblind-friendly palettes",
      ],
      hardwareDemo: "Show multiple datasets overlaid. Demonstrate legend positioning options.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 4,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson11_1_4.number}: ${lesson11_1_4.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson11_1_4.id,
        number: 1,
        title: "Two Lines",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Plot two lines comparing morning and afternoon temperatures.",
        starterCode: "import matplotlib.pyplot as plt\n\ndays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']\nmorning = [55, 58, 60, 57, 62]\nafternoon = [70, 72, 75, 71, 78]\n\n# Plot both with legend",
        solution: "import matplotlib.pyplot as plt\n\ndays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']\nmorning = [55, 58, 60, 57, 62]\nafternoon = [70, 72, 75, 71, 78]\n\nplt.plot(days, morning, 'b-o', label='Morning')\nplt.plot(days, afternoon, 'r-o', label='Afternoon')\nplt.xlabel('Day')\nplt.ylabel('Temperature (°F)')\nplt.title('Daily Temperatures')\nplt.legend()\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Two-line plot", description: "Both lines shown" }]),
        hints: ["Use label parameter", "Call plt.legend()"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson11_1_4.id,
        number: 2,
        title: "Legend Position",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a plot with the legend in the lower right corner.",
        starterCode: "import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4, 5]\ny1 = [1, 4, 9, 16, 25]\ny2 = [1, 2, 3, 4, 5]\n\n# Plot both lines\n# Position legend in lower right",
        solution: "import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4, 5]\ny1 = [1, 4, 9, 16, 25]\ny2 = [1, 2, 3, 4, 5]\n\nplt.plot(x, y1, label='Quadratic')\nplt.plot(x, y2, label='Linear')\nplt.xlabel('X')\nplt.ylabel('Y')\nplt.title('Linear vs Quadratic')\nplt.legend(loc='lower right')\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Legend lower right", description: "Position correct" }]),
        hints: ["Use loc='lower right'", "Add labels to both plots"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson11_1_4.id,
        number: 3,
        title: "Three Lines Distinct",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Plot three lines with different colors, styles, and markers.",
        starterCode: "import matplotlib.pyplot as plt\n\nmonths = list(range(1, 13))\nstore_a = [100, 110, 105, 120, 130, 125, 140, 150, 145, 160, 170, 180]\nstore_b = [80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135]\nstore_c = [60, 70, 75, 85, 90, 100, 110, 105, 115, 120, 130, 140]\n\n# Plot with distinct styles for each store",
        solution: "import matplotlib.pyplot as plt\n\nmonths = list(range(1, 13))\nstore_a = [100, 110, 105, 120, 130, 125, 140, 150, 145, 160, 170, 180]\nstore_b = [80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135]\nstore_c = [60, 70, 75, 85, 90, 100, 110, 105, 115, 120, 130, 140]\n\nfig, ax = plt.subplots(figsize=(10, 6))\nax.plot(months, store_a, 'ro-', linewidth=2, label='Store A')\nax.plot(months, store_b, 'bs--', linewidth=2, label='Store B')\nax.plot(months, store_c, 'g^:', linewidth=2, label='Store C')\n\nax.set_xlabel('Month')\nax.set_ylabel('Sales ($K)')\nax.set_title('Monthly Sales by Store')\nax.legend()\nax.grid(True, alpha=0.3)\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Three distinct lines", description: "All distinguishable" }]),
        hints: ["Use different format strings", "r=red, b=blue, g=green", "o=circle, s=square, ^=triangle"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson11_1_4.id,
        number: 4,
        title: "Loop for Multiple Lines",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use a loop to plot multiple datasets from a dictionary.",
        starterCode: "import matplotlib.pyplot as plt\n\nx = list(range(1, 6))\ndata = {\n    'Alice': [85, 88, 90, 87, 92],\n    'Bob': [78, 82, 80, 85, 88],\n    'Carol': [90, 92, 88, 95, 93],\n}\n\n# Use a loop to plot each person's scores",
        solution: "import matplotlib.pyplot as plt\n\nx = list(range(1, 6))\ndata = {\n    'Alice': [85, 88, 90, 87, 92],\n    'Bob': [78, 82, 80, 85, 88],\n    'Carol': [90, 92, 88, 95, 93],\n}\n\nfig, ax = plt.subplots(figsize=(10, 6))\n\nfor name, scores in data.items():\n    ax.plot(x, scores, marker='o', label=name)\n\nax.set_xlabel('Test Number')\nax.set_ylabel('Score')\nax.set_title('Test Scores Over Time')\nax.legend()\nax.grid(True, alpha=0.3)\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Three lines from loop", description: "Loop plotting works" }]),
        hints: ["Iterate over data.items()", "Use name as label"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson11_1_4.id,
        number: 5,
        title: "Professional Comparison",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a publication-quality chart comparing multiple datasets.",
        starterCode: "import matplotlib.pyplot as plt\n\nyears = [2019, 2020, 2021, 2022, 2023]\nrevenue = [150, 120, 180, 220, 280]\nexpenses = [100, 110, 130, 150, 180]\nprofit = [50, 10, 50, 70, 100]\n\n# Create professional chart with:\n# - Distinct colors and markers\n# - Styled legend with box\n# - Grid\n# - Clear title",
        solution: "import matplotlib.pyplot as plt\n\nyears = [2019, 2020, 2021, 2022, 2023]\nrevenue = [150, 120, 180, 220, 280]\nexpenses = [100, 110, 130, 150, 180]\nprofit = [50, 10, 50, 70, 100]\n\nfig, ax = plt.subplots(figsize=(12, 6))\n\nax.plot(years, revenue, color='#27ae60', linewidth=2.5, \n        marker='o', markersize=10, label='Revenue')\nax.plot(years, expenses, color='#e74c3c', linewidth=2.5, \n        marker='s', markersize=10, label='Expenses')\nax.plot(years, profit, color='#3498db', linewidth=2.5, \n        marker='^', markersize=10, label='Profit')\n\nax.set_xlabel('Year', fontsize=12)\nax.set_ylabel('Amount ($K)', fontsize=12)\nax.set_title('Financial Overview 2019-2023', fontsize=14, fontweight='bold')\nax.legend(loc='upper left', frameon=True, fancybox=True, shadow=True, fontsize=11)\nax.grid(True, linestyle='--', alpha=0.4)\nax.set_ylim(0, 320)\n\nplt.tight_layout()\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Professional chart", description: "Publication quality" }]),
        hints: ["Use hex colors for consistency", "fancybox=True for rounded legend", "shadow=True for depth"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 11.1.4`);

  // ==================== LESSON 11.1.5 ====================
  const lesson11_1_5 = await prisma.lesson.upsert({
    where: { slug: "subplots" },
    update: {},
    create: {
      sectionId: section11_1.id,
      number: 11.15,
      title: "Subplots",
      slug: "subplots",
      objectives: [
        "Create multiple plots in one figure",
        "Use subplot grid layouts",
        "Share axes between plots",
        "Create complex figure arrangements",
      ],
      content: `# Subplots

## Why Multiple Plots?

Sometimes you want to show related but separate visualizations:
- Compare different metrics
- Show before/after
- Different views of same data
- Dashboard-style layouts

## Creating Subplots

\`\`\`python
fig, axes = plt.subplots(rows, cols)
\`\`\`

Examples:
\`\`\`python
fig, axes = plt.subplots(2, 1)   # 2 rows, 1 column
fig, axes = plt.subplots(1, 2)   # 1 row, 2 columns
fig, axes = plt.subplots(2, 2)   # 2×2 grid
\`\`\`

## Accessing Axes

\`\`\`python
# Single row or column: axes is 1D array
fig, axes = plt.subplots(1, 2)
axes[0].plot(...)  # Left plot
axes[1].plot(...)  # Right plot

# Multiple rows and columns: axes is 2D array
fig, axes = plt.subplots(2, 2)
axes[0, 0].plot(...)  # Top left
axes[0, 1].plot(...)  # Top right
axes[1, 0].plot(...)  # Bottom left
axes[1, 1].plot(...)  # Bottom right
\`\`\`

## Shared Axes

\`\`\`python
fig, axes = plt.subplots(2, 1, sharex=True)  # Same x-axis
fig, axes = plt.subplots(1, 2, sharey=True)  # Same y-axis
\`\`\`

## Figure Size

\`\`\`python
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
\`\`\`

## Spacing

\`\`\`python
plt.tight_layout()  # Auto-adjust
plt.subplots_adjust(hspace=0.3, wspace=0.3)  # Manual
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-subplots",
          title: "Basic 2x1 Subplots",
          code: "import matplotlib.pyplot as plt\n\nmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']\nrevenue = [100, 120, 115, 140, 155, 170]\nexpenses = [80, 85, 90, 95, 100, 110]\n\nfig, axes = plt.subplots(2, 1, figsize=(10, 8))\n\n# Top plot: Revenue\naxes[0].plot(months, revenue, 'g-o', linewidth=2)\naxes[0].set_ylabel('Revenue ($K)')\naxes[0].set_title('Monthly Revenue')\naxes[0].grid(True, alpha=0.3)\n\n# Bottom plot: Expenses\naxes[1].plot(months, expenses, 'r-s', linewidth=2)\naxes[1].set_xlabel('Month')\naxes[1].set_ylabel('Expenses ($K)')\naxes[1].set_title('Monthly Expenses')\naxes[1].grid(True, alpha=0.3)\n\nplt.tight_layout()\nplt.show()",
          description: "Two plots stacked vertically",
        },
        {
          id: "side-by-side",
          title: "Side by Side Plots",
          code: "import matplotlib.pyplot as plt\nimport random\n\nrandom.seed(42)\ndata1 = [random.gauss(50, 10) for _ in range(100)]\ndata2 = [random.gauss(70, 15) for _ in range(100)]\n\nfig, axes = plt.subplots(1, 2, figsize=(12, 5))\n\n# Left: Scatter\naxes[0].scatter(range(100), data1, alpha=0.5, c='blue')\naxes[0].set_xlabel('Index')\naxes[0].set_ylabel('Value')\naxes[0].set_title('Dataset A (Scatter)')\n\n# Right: Histogram\naxes[1].hist(data2, bins=15, color='green', edgecolor='black', alpha=0.7)\naxes[1].set_xlabel('Value')\naxes[1].set_ylabel('Frequency')\naxes[1].set_title('Dataset B (Distribution)')\n\nplt.tight_layout()\nplt.show()",
          description: "Different chart types side by side",
        },
        {
          id: "grid-2x2",
          title: "2x2 Grid",
          code: "import matplotlib.pyplot as plt\nimport math\n\nx = [i/10 for i in range(0, 63)]\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\n\n# Top left: Sine\naxes[0, 0].plot(x, [math.sin(xi) for xi in x], 'b-')\naxes[0, 0].set_title('sin(x)')\naxes[0, 0].grid(True, alpha=0.3)\n\n# Top right: Cosine\naxes[0, 1].plot(x, [math.cos(xi) for xi in x], 'r-')\naxes[0, 1].set_title('cos(x)')\naxes[0, 1].grid(True, alpha=0.3)\n\n# Bottom left: Exponential\naxes[1, 0].plot(x, [math.exp(xi/10) for xi in x], 'g-')\naxes[1, 0].set_title('exp(x/10)')\naxes[1, 0].grid(True, alpha=0.3)\n\n# Bottom right: Log\naxes[1, 1].plot(x[1:], [math.log(xi) for xi in x[1:]], 'm-')\naxes[1, 1].set_title('log(x)')\naxes[1, 1].grid(True, alpha=0.3)\n\nplt.suptitle('Mathematical Functions', fontsize=14, fontweight='bold')\nplt.tight_layout()\nplt.show()",
          description: "Four plots in a grid",
        },
        {
          id: "shared-axes",
          title: "Shared Axes",
          code: "import matplotlib.pyplot as plt\nimport random\n\nrandom.seed(42)\nx = list(range(1, 13))\nproduct_a = [random.randint(80, 150) for _ in range(12)]\nproduct_b = [random.randint(60, 120) for _ in range(12)]\n\n# Shared x-axis for comparison\nfig, axes = plt.subplots(2, 1, figsize=(10, 8), sharex=True)\n\naxes[0].bar(x, product_a, color='steelblue')\naxes[0].set_ylabel('Product A Sales')\naxes[0].set_title('Monthly Sales Comparison')\n\naxes[1].bar(x, product_b, color='coral')\naxes[1].set_xlabel('Month')\naxes[1].set_ylabel('Product B Sales')\n\nplt.tight_layout()\nplt.show()\n\nprint(\"sharex=True: Both plots use the same x-axis scale\")",
          description: "Plots with shared x-axis",
        },
      ]),
      keyPoints: [
        "plt.subplots(rows, cols) creates grid",
        "axes[0] for 1D, axes[row, col] for 2D",
        "sharex=True, sharey=True for shared axes",
        "figsize=(width, height) for figure size",
        "plt.tight_layout() adjusts spacing",
        "plt.suptitle() for overall title",
        "Each axes has its own set_xlabel, set_title, etc.",
        "Use subplots for dashboard-style layouts",
      ],
      hardwareDemo: "Create various subplot layouts. Show shared axes behavior.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 5,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson11_1_5.number}: ${lesson11_1_5.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson11_1_5.id,
        number: 1,
        title: "Two Stacked Plots",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create two plots stacked vertically showing temperature and humidity.",
        starterCode: "import matplotlib.pyplot as plt\n\ndays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']\ntemp = [72, 75, 71, 68, 74]\nhumidity = [45, 50, 55, 60, 48]\n\n# Create 2x1 subplots",
        solution: "import matplotlib.pyplot as plt\n\ndays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']\ntemp = [72, 75, 71, 68, 74]\nhumidity = [45, 50, 55, 60, 48]\n\nfig, axes = plt.subplots(2, 1, figsize=(8, 6))\n\naxes[0].plot(days, temp, 'r-o')\naxes[0].set_ylabel('Temperature (°F)')\naxes[0].set_title('Temperature')\n\naxes[1].plot(days, humidity, 'b-o')\naxes[1].set_xlabel('Day')\naxes[1].set_ylabel('Humidity (%)')\naxes[1].set_title('Humidity')\n\nplt.tight_layout()\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Stacked plots", description: "2x1 layout works" }]),
        hints: ["Use plt.subplots(2, 1)", "Access with axes[0] and axes[1]"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson11_1_5.id,
        number: 2,
        title: "Side by Side",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create two plots side by side comparing line and bar charts.",
        starterCode: "import matplotlib.pyplot as plt\n\ncategories = ['A', 'B', 'C', 'D']\nvalues = [25, 40, 30, 35]\n\n# Create 1x2 subplots\n# Left: line plot\n# Right: bar chart",
        solution: "import matplotlib.pyplot as plt\n\ncategories = ['A', 'B', 'C', 'D']\nvalues = [25, 40, 30, 35]\n\nfig, axes = plt.subplots(1, 2, figsize=(12, 5))\n\n# Line plot\naxes[0].plot(categories, values, 'go-', linewidth=2)\naxes[0].set_title('Line Plot')\naxes[0].set_ylabel('Value')\n\n# Bar chart\naxes[1].bar(categories, values, color='steelblue')\naxes[1].set_title('Bar Chart')\naxes[1].set_ylabel('Value')\n\nplt.tight_layout()\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Side by side", description: "1x2 layout works" }]),
        hints: ["Use plt.subplots(1, 2)", "Left: axes[0], Right: axes[1]"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson11_1_5.id,
        number: 3,
        title: "2x2 Grid",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a 2x2 grid showing four different visualizations of the same data.",
        starterCode: "import matplotlib.pyplot as plt\nimport random\n\nrandom.seed(42)\ndata = [random.randint(50, 100) for _ in range(20)]\nx = list(range(1, 21))\n\n# Create 2x2 subplots showing:\n# Top-left: Line plot\n# Top-right: Scatter plot\n# Bottom-left: Bar chart\n# Bottom-right: Histogram",
        solution: "import matplotlib.pyplot as plt\nimport random\n\nrandom.seed(42)\ndata = [random.randint(50, 100) for _ in range(20)]\nx = list(range(1, 21))\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\n\n# Line plot\naxes[0, 0].plot(x, data, 'b-')\naxes[0, 0].set_title('Line Plot')\n\n# Scatter plot\naxes[0, 1].scatter(x, data, c='green')\naxes[0, 1].set_title('Scatter Plot')\n\n# Bar chart\naxes[1, 0].bar(x, data, color='coral')\naxes[1, 0].set_title('Bar Chart')\n\n# Histogram\naxes[1, 1].hist(data, bins=10, color='purple', edgecolor='black')\naxes[1, 1].set_title('Histogram')\n\nplt.suptitle('Four Views of the Same Data', fontsize=14)\nplt.tight_layout()\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "2x2 grid", description: "Grid layout works" }]),
        hints: ["Access with axes[row, col]", "Use plt.suptitle() for main title"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson11_1_5.id,
        number: 4,
        title: "Shared X-Axis",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create stacked plots with shared x-axis for time series comparison.",
        starterCode: "import matplotlib.pyplot as plt\n\nmonths = list(range(1, 13))\nstock_a = [100, 105, 102, 108, 115, 112, 120, 125, 122, 130, 135, 140]\nstock_b = [50, 52, 48, 55, 58, 60, 62, 58, 65, 68, 70, 75]\n\n# Create 2x1 subplots with sharex=True",
        solution: "import matplotlib.pyplot as plt\n\nmonths = list(range(1, 13))\nstock_a = [100, 105, 102, 108, 115, 112, 120, 125, 122, 130, 135, 140]\nstock_b = [50, 52, 48, 55, 58, 60, 62, 58, 65, 68, 70, 75]\n\nfig, axes = plt.subplots(2, 1, figsize=(10, 8), sharex=True)\n\naxes[0].plot(months, stock_a, 'b-o', label='Stock A')\naxes[0].set_ylabel('Price ($)')\naxes[0].set_title('Stock A')\naxes[0].legend()\naxes[0].grid(True, alpha=0.3)\n\naxes[1].plot(months, stock_b, 'r-o', label='Stock B')\naxes[1].set_xlabel('Month')\naxes[1].set_ylabel('Price ($)')\naxes[1].set_title('Stock B')\naxes[1].legend()\naxes[1].grid(True, alpha=0.3)\n\nplt.tight_layout()\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Shared x-axis", description: "sharex works" }]),
        hints: ["Add sharex=True to subplots()", "Only bottom plot needs xlabel"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson11_1_5.id,
        number: 5,
        title: "Dashboard Layout",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a dashboard with 4 plots showing different business metrics.",
        starterCode: "import matplotlib.pyplot as plt\n\nmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']\nrevenue = [100, 120, 115, 140, 155, 170]\nexpenses = [80, 85, 90, 95, 100, 110]\ncustomers = [500, 550, 520, 600, 650, 700]\nproducts = ['Laptop', 'Phone', 'Tablet', 'Watch']\nsales = [40, 30, 20, 10]\n\n# Create professional dashboard with:\n# Top-left: Revenue line\n# Top-right: Expenses line\n# Bottom-left: Customers bar\n# Bottom-right: Product sales pie",
        solution: "import matplotlib.pyplot as plt\n\nmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']\nrevenue = [100, 120, 115, 140, 155, 170]\nexpenses = [80, 85, 90, 95, 100, 110]\ncustomers = [500, 550, 520, 600, 650, 700]\nproducts = ['Laptop', 'Phone', 'Tablet', 'Watch']\nsales = [40, 30, 20, 10]\n\nfig, axes = plt.subplots(2, 2, figsize=(14, 10))\n\n# Revenue\naxes[0, 0].plot(months, revenue, 'g-o', linewidth=2)\naxes[0, 0].set_title('Monthly Revenue', fontweight='bold')\naxes[0, 0].set_ylabel('Revenue ($K)')\naxes[0, 0].grid(True, alpha=0.3)\n\n# Expenses\naxes[0, 1].plot(months, expenses, 'r-s', linewidth=2)\naxes[0, 1].set_title('Monthly Expenses', fontweight='bold')\naxes[0, 1].set_ylabel('Expenses ($K)')\naxes[0, 1].grid(True, alpha=0.3)\n\n# Customers\naxes[1, 0].bar(months, customers, color='steelblue')\naxes[1, 0].set_title('Monthly Customers', fontweight='bold')\naxes[1, 0].set_ylabel('Customers')\n\n# Product sales pie\naxes[1, 1].pie(sales, labels=products, autopct='%1.1f%%', colors=['#3498db', '#e74c3c', '#2ecc71', '#f39c12'])\naxes[1, 1].set_title('Sales by Product', fontweight='bold')\n\nplt.suptitle('Business Dashboard', fontsize=16, fontweight='bold')\nplt.tight_layout()\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Dashboard", description: "Complex layout works" }]),
        hints: ["Use different chart types", "pie() for pie chart", "autopct shows percentages"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 11.1.5`);

  // ==================== LESSON 11.2.1 ====================
  const lesson11_2_1 = await prisma.lesson.upsert({
    where: { slug: "mortgages-example" },
    update: {},
    create: {
      sectionId: section11_2.id,
      number: 11.21,
      title: "Real-World Example: Mortgage Analysis",
      slug: "mortgages-example",
      objectives: [
        "Apply plotting to real financial data",
        "Calculate mortgage payments",
        "Compare different loan scenarios",
        "Create informative visualizations",
      ],
      content: `# Real-World Example: Mortgage Analysis

## The Mortgage Problem

When buying a home, you need to understand:
- Monthly payments
- Total interest paid
- How extra payments affect the loan
- Fixed vs adjustable rates

## Monthly Payment Formula

\`\`\`
M = P * [r(1+r)^n] / [(1+r)^n - 1]

Where:
M = Monthly payment
P = Principal (loan amount)
r = Monthly interest rate (annual rate / 12)
n = Number of payments (years * 12)
\`\`\`

## Python Implementation

\`\`\`python
def monthly_payment(principal, annual_rate, years):
    r = annual_rate / 12 / 100  # Monthly rate as decimal
    n = years * 12              # Total months
    if r == 0:
        return principal / n
    payment = principal * (r * (1+r)**n) / ((1+r)**n - 1)
    return payment
\`\`\`

## What We'll Visualize

1. **Payment breakdown** over time (principal vs interest)
2. **Remaining balance** curve
3. **Compare** different scenarios
4. **Impact** of extra payments

## Why This Matters

Understanding mortgages helps you:
- Choose the right loan
- Know how much house you can afford
- See impact of extra payments
- Make informed financial decisions`,
      codeExamples: JSON.stringify([
        {
          id: "payment-calc",
          title: "Calculate Monthly Payment",
          code: "def monthly_payment(principal, annual_rate, years):\n    \"\"\"Calculate monthly mortgage payment.\"\"\"\n    r = annual_rate / 12 / 100  # Monthly rate\n    n = years * 12              # Total months\n    if r == 0:\n        return principal / n\n    payment = principal * (r * (1+r)**n) / ((1+r)**n - 1)\n    return payment\n\n# Example: $300,000 home, 6.5% rate, 30 years\nprincipal = 300000\nrate = 6.5\nyears = 30\n\npayment = monthly_payment(principal, rate, years)\ntotal_paid = payment * years * 12\ntotal_interest = total_paid - principal\n\nprint(f\"Loan Amount: ${principal:,}\")\nprint(f\"Interest Rate: {rate}%\")\nprint(f\"Term: {years} years\")\nprint(f\"\\nMonthly Payment: ${payment:,.2f}\")\nprint(f\"Total Paid: ${total_paid:,.2f}\")\nprint(f\"Total Interest: ${total_interest:,.2f}\")",
          description: "Basic mortgage calculation",
        },
        {
          id: "balance-over-time",
          title: "Visualize Balance Over Time",
          code: "import matplotlib.pyplot as plt\n\ndef calculate_amortization(principal, annual_rate, years):\n    \"\"\"Return lists of balance, principal paid, interest paid per month.\"\"\"\n    r = annual_rate / 12 / 100\n    n = years * 12\n    payment = principal * (r * (1+r)**n) / ((1+r)**n - 1)\n    \n    balance = principal\n    balances = [balance]\n    \n    for month in range(n):\n        interest = balance * r\n        principal_paid = payment - interest\n        balance -= principal_paid\n        balances.append(max(0, balance))\n    \n    return balances, payment\n\n# Calculate for 30-year mortgage\nprincipal = 300000\nrate = 6.5\nyears = 30\n\nbalances, payment = calculate_amortization(principal, rate, years)\nmonths = list(range(len(balances)))\nyears_axis = [m/12 for m in months]\n\nfig, ax = plt.subplots(figsize=(10, 6))\nax.plot(years_axis, balances, 'b-', linewidth=2)\nax.fill_between(years_axis, balances, alpha=0.3)\nax.set_xlabel('Years')\nax.set_ylabel('Remaining Balance ($)')\nax.set_title(f'Mortgage Balance Over Time\\n${principal:,} at {rate}%, ${payment:,.2f}/month')\nax.grid(True, alpha=0.3)\nax.set_xlim(0, years)\nax.set_ylim(0, principal * 1.05)\nplt.tight_layout()\nplt.show()",
          description: "Watch the balance decrease",
        },
        {
          id: "compare-rates",
          title: "Compare Different Interest Rates",
          code: "import matplotlib.pyplot as plt\n\ndef calculate_amortization(principal, annual_rate, years):\n    r = annual_rate / 12 / 100\n    n = years * 12\n    if r == 0:\n        payment = principal / n\n    else:\n        payment = principal * (r * (1+r)**n) / ((1+r)**n - 1)\n    \n    balance = principal\n    balances = [balance]\n    \n    for month in range(n):\n        interest = balance * r if r > 0 else 0\n        principal_paid = payment - interest\n        balance -= principal_paid\n        balances.append(max(0, balance))\n    \n    return balances, payment\n\nprincipal = 300000\nyears = 30\nrates = [5.0, 6.0, 7.0, 8.0]\n\nfig, ax = plt.subplots(figsize=(12, 6))\n\nfor rate in rates:\n    balances, payment = calculate_amortization(principal, rate, years)\n    years_axis = [m/12 for m in range(len(balances))]\n    total_interest = payment * years * 12 - principal\n    ax.plot(years_axis, balances, linewidth=2, \n            label=f'{rate}% (${payment:,.0f}/mo, ${total_interest:,.0f} interest)')\n\nax.set_xlabel('Years', fontsize=12)\nax.set_ylabel('Remaining Balance ($)', fontsize=12)\nax.set_title(f'Impact of Interest Rate on ${principal:,} Mortgage', fontsize=14)\nax.legend(loc='upper right')\nax.grid(True, alpha=0.3)\nplt.tight_layout()\nplt.show()",
          description: "Compare different rate scenarios",
        },
        {
          id: "payment-breakdown",
          title: "Principal vs Interest Breakdown",
          code: "import matplotlib.pyplot as plt\n\ndef payment_breakdown(principal, annual_rate, years):\n    \"\"\"Return monthly principal and interest amounts.\"\"\"\n    r = annual_rate / 12 / 100\n    n = years * 12\n    payment = principal * (r * (1+r)**n) / ((1+r)**n - 1)\n    \n    balance = principal\n    principal_amounts = []\n    interest_amounts = []\n    \n    for month in range(n):\n        interest = balance * r\n        principal_paid = payment - interest\n        principal_amounts.append(principal_paid)\n        interest_amounts.append(interest)\n        balance -= principal_paid\n    \n    return principal_amounts, interest_amounts, payment\n\nprincipal = 300000\nrate = 6.5\nyears = 30\n\nprinc, inter, payment = payment_breakdown(principal, rate, years)\n\n# Show first and last 5 years\nfig, axes = plt.subplots(1, 2, figsize=(14, 5))\n\n# First 5 years (60 months)\nmonths_range = range(1, 61)\naxes[0].bar(months_range, inter[:60], label='Interest', color='#e74c3c', alpha=0.8)\naxes[0].bar(months_range, princ[:60], bottom=inter[:60], label='Principal', color='#2ecc71', alpha=0.8)\naxes[0].set_xlabel('Month')\naxes[0].set_ylabel('Payment Breakdown ($)')\naxes[0].set_title('First 5 Years: Mostly Interest!')\naxes[0].legend()\n\n# Last 5 years\nmonths_range = range(301, 361)\naxes[1].bar(range(60), inter[300:], label='Interest', color='#e74c3c', alpha=0.8)\naxes[1].bar(range(60), princ[300:], bottom=inter[300:], label='Principal', color='#2ecc71', alpha=0.8)\naxes[1].set_xlabel('Month (from month 301)')\naxes[1].set_ylabel('Payment Breakdown ($)')\naxes[1].set_title('Last 5 Years: Mostly Principal!')\naxes[1].legend()\n\nplt.suptitle(f'${payment:,.2f} Monthly Payment Breakdown', fontsize=14)\nplt.tight_layout()\nplt.show()",
          description: "See how payments shift over time",
        },
      ]),
      keyPoints: [
        "Mortgages involve complex calculations",
        "Visualization makes trends clear",
        "Early payments are mostly interest",
        "Later payments are mostly principal",
        "Small rate changes have big impacts",
        "Extra payments reduce total interest",
        "Amortization schedules show the breakdown",
        "Real-world data makes plotting meaningful",
      ],
      hardwareDemo: "Interactive mortgage calculator with live plots showing impact of different variables.",
      estimatedTime: 35,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson11_2_1.number}: ${lesson11_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson11_2_1.id,
        number: 1,
        title: "Calculate Payment",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function to calculate monthly mortgage payment.",
        starterCode: "def monthly_payment(principal, annual_rate, years):\n    \"\"\"Calculate monthly mortgage payment.\n    \n    Args:\n        principal: Loan amount\n        annual_rate: Annual interest rate (e.g., 6.5 for 6.5%)\n        years: Loan term in years\n    \"\"\"\n    pass\n\n# Test: $250,000 at 7% for 30 years\nprint(f\"Monthly payment: ${monthly_payment(250000, 7, 30):,.2f}\")",
        solution: "def monthly_payment(principal, annual_rate, years):\n    r = annual_rate / 12 / 100  # Monthly rate\n    n = years * 12              # Total months\n    if r == 0:\n        return principal / n\n    payment = principal * (r * (1+r)**n) / ((1+r)**n - 1)\n    return payment\n\nprint(f\"Monthly payment: ${monthly_payment(250000, 7, 30):,.2f}\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "$1,663.26", description: "Payment correct" }]),
        hints: ["r = annual_rate / 12 / 100", "Use the formula from lesson"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson11_2_1.id,
        number: 2,
        title: "Plot Balance",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Plot the remaining balance over a 30-year mortgage.",
        starterCode: "import matplotlib.pyplot as plt\n\ndef calculate_balances(principal, annual_rate, years):\n    \"\"\"Return list of remaining balances.\"\"\"\n    r = annual_rate / 12 / 100\n    n = years * 12\n    payment = principal * (r * (1+r)**n) / ((1+r)**n - 1)\n    \n    balance = principal\n    balances = [balance]\n    \n    for _ in range(n):\n        interest = balance * r\n        balance -= (payment - interest)\n        balances.append(max(0, balance))\n    \n    return balances\n\n# Plot for $200,000 at 6% for 30 years",
        solution: "import matplotlib.pyplot as plt\n\ndef calculate_balances(principal, annual_rate, years):\n    r = annual_rate / 12 / 100\n    n = years * 12\n    payment = principal * (r * (1+r)**n) / ((1+r)**n - 1)\n    \n    balance = principal\n    balances = [balance]\n    \n    for _ in range(n):\n        interest = balance * r\n        balance -= (payment - interest)\n        balances.append(max(0, balance))\n    \n    return balances\n\nbalances = calculate_balances(200000, 6, 30)\nyears_axis = [m/12 for m in range(len(balances))]\n\nplt.figure(figsize=(10, 6))\nplt.plot(years_axis, balances, 'b-', linewidth=2)\nplt.fill_between(years_axis, balances, alpha=0.3)\nplt.xlabel('Years')\nplt.ylabel('Remaining Balance ($)')\nplt.title('Mortgage Balance Over Time')\nplt.grid(True, alpha=0.3)\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Balance curve plot", description: "Plot shows balance" }]),
        hints: ["Convert months to years for x-axis", "fill_between adds shading"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson11_2_1.id,
        number: 3,
        title: "Compare Terms",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Compare 15-year vs 30-year mortgage on the same plot.",
        starterCode: "import matplotlib.pyplot as plt\n\ndef calculate_balances(principal, annual_rate, years):\n    r = annual_rate / 12 / 100\n    n = years * 12\n    payment = principal * (r * (1+r)**n) / ((1+r)**n - 1)\n    balance = principal\n    balances = [balance]\n    for _ in range(n):\n        interest = balance * r\n        balance -= (payment - interest)\n        balances.append(max(0, balance))\n    return balances, payment\n\nprincipal = 300000\nrate = 6.5\n\n# Plot both 15-year and 30-year mortgages",
        solution: "import matplotlib.pyplot as plt\n\ndef calculate_balances(principal, annual_rate, years):\n    r = annual_rate / 12 / 100\n    n = years * 12\n    payment = principal * (r * (1+r)**n) / ((1+r)**n - 1)\n    balance = principal\n    balances = [balance]\n    for _ in range(n):\n        interest = balance * r\n        balance -= (payment - interest)\n        balances.append(max(0, balance))\n    return balances, payment\n\nprincipal = 300000\nrate = 6.5\n\nbal_15, pay_15 = calculate_balances(principal, rate, 15)\nbal_30, pay_30 = calculate_balances(principal, rate, 30)\n\nfig, ax = plt.subplots(figsize=(10, 6))\n\nax.plot([m/12 for m in range(len(bal_15))], bal_15, \n        'g-', linewidth=2, label=f'15-year (${pay_15:,.0f}/mo)')\nax.plot([m/12 for m in range(len(bal_30))], bal_30, \n        'b-', linewidth=2, label=f'30-year (${pay_30:,.0f}/mo)')\n\nax.set_xlabel('Years')\nax.set_ylabel('Balance ($)')\nax.set_title(f'${principal:,} Mortgage: 15 vs 30 Year')\nax.legend()\nax.grid(True, alpha=0.3)\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Two curves compared", description: "Comparison works" }]),
        hints: ["Calculate both separately", "Include payment in label"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson11_2_1.id,
        number: 4,
        title: "Total Interest",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a bar chart comparing total interest paid at different rates.",
        starterCode: "import matplotlib.pyplot as plt\n\ndef total_interest(principal, annual_rate, years):\n    r = annual_rate / 12 / 100\n    n = years * 12\n    payment = principal * (r * (1+r)**n) / ((1+r)**n - 1)\n    return payment * n - principal\n\nprincipal = 300000\nyears = 30\nrates = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0]\n\n# Create bar chart of total interest for each rate",
        solution: "import matplotlib.pyplot as plt\n\ndef total_interest(principal, annual_rate, years):\n    r = annual_rate / 12 / 100\n    n = years * 12\n    payment = principal * (r * (1+r)**n) / ((1+r)**n - 1)\n    return payment * n - principal\n\nprincipal = 300000\nyears = 30\nrates = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0]\n\ninterest_amounts = [total_interest(principal, r, years) for r in rates]\n\nfig, ax = plt.subplots(figsize=(10, 6))\nbars = ax.bar([f'{r}%' for r in rates], interest_amounts, color='coral', edgecolor='darkred')\n\n# Add value labels\nfor bar, val in zip(bars, interest_amounts):\n    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5000,\n            f'${val/1000:.0f}K', ha='center', fontweight='bold')\n\nax.set_xlabel('Interest Rate')\nax.set_ylabel('Total Interest Paid ($)')\nax.set_title(f'Total Interest Over {years} Years on ${principal:,} Mortgage')\nax.set_ylim(0, max(interest_amounts) * 1.15)\nplt.tight_layout()\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Bar chart of interest", description: "Interest comparison" }]),
        hints: ["Calculate interest for each rate", "Add labels on bars"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson11_2_1.id,
        number: 5,
        title: "Complete Analysis",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a 2x2 dashboard showing comprehensive mortgage analysis.",
        starterCode: "import matplotlib.pyplot as plt\n\n# Create dashboard showing:\n# 1. Balance over time\n# 2. Payment breakdown (first year)\n# 3. Cumulative interest paid\n# 4. Comparison of 15 vs 30 year\n\nprincipal = 300000\nrate = 6.5",
        solution: "import matplotlib.pyplot as plt\n\ndef full_amortization(principal, annual_rate, years):\n    r = annual_rate / 12 / 100\n    n = years * 12\n    payment = principal * (r * (1+r)**n) / ((1+r)**n - 1)\n    balance = principal\n    balances, principals, interests, cum_interest = [balance], [], [], [0]\n    total_int = 0\n    for _ in range(n):\n        interest = balance * r\n        princ = payment - interest\n        total_int += interest\n        principals.append(princ)\n        interests.append(interest)\n        cum_interest.append(total_int)\n        balance -= princ\n        balances.append(max(0, balance))\n    return balances, principals, interests, cum_interest, payment\n\nprincipal = 300000\nrate = 6.5\n\nbal30, princ30, int30, cum30, pay30 = full_amortization(principal, rate, 30)\nbal15, _, _, cum15, pay15 = full_amortization(principal, rate, 15)\n\nfig, axes = plt.subplots(2, 2, figsize=(14, 10))\n\n# Balance over time\naxes[0,0].plot([m/12 for m in range(len(bal30))], bal30, 'b-', lw=2)\naxes[0,0].set_title('Balance Over Time')\naxes[0,0].set_xlabel('Years'); axes[0,0].set_ylabel('Balance ($)')\naxes[0,0].grid(True, alpha=0.3)\n\n# First year breakdown\naxes[0,1].bar(range(1,13), int30[:12], label='Interest', color='#e74c3c')\naxes[0,1].bar(range(1,13), princ30[:12], bottom=int30[:12], label='Principal', color='#2ecc71')\naxes[0,1].set_title('First Year Payment Breakdown')\naxes[0,1].set_xlabel('Month'); axes[0,1].legend()\n\n# Cumulative interest\naxes[1,0].plot([m/12 for m in range(len(cum30))], cum30, 'r-', lw=2)\naxes[1,0].set_title('Cumulative Interest Paid')\naxes[1,0].set_xlabel('Years'); axes[1,0].set_ylabel('Interest ($)')\naxes[1,0].grid(True, alpha=0.3)\n\n# 15 vs 30\naxes[1,1].plot([m/12 for m in range(len(bal15))], bal15, 'g-', lw=2, label=f'15yr (${pay15:,.0f}/mo)')\naxes[1,1].plot([m/12 for m in range(len(bal30))], bal30, 'b-', lw=2, label=f'30yr (${pay30:,.0f}/mo)')\naxes[1,1].set_title('15 vs 30 Year Comparison')\naxes[1,1].set_xlabel('Years'); axes[1,1].legend()\naxes[1,1].grid(True, alpha=0.3)\n\nplt.suptitle(f'${principal:,} Mortgage at {rate}%', fontsize=14, fontweight='bold')\nplt.tight_layout()\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "4-panel dashboard", description: "Complete analysis" }]),
        hints: ["Calculate full amortization data", "Use 2x2 subplots"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 11.2.1`);

  // ==================== LESSON 11.2.2 ====================
  const lesson11_2_2 = await prisma.lesson.upsert({
    where: { slug: "visualization-best-practices" },
    update: {},
    create: {
      sectionId: section11_2.id,
      number: 11.22,
      title: "Data Visualization Best Practices",
      slug: "visualization-best-practices",
      objectives: [
        "Choose appropriate chart types",
        "Create clear and honest visualizations",
        "Avoid common mistakes",
        "Follow design principles",
      ],
      content: `# Data Visualization Best Practices

## Choosing the Right Chart

| Data Type | Best Chart |
|-----------|------------|
| Trend over time | Line chart |
| Comparison across categories | Bar chart |
| Part of whole | Pie chart (≤5 parts) |
| Relationship between variables | Scatter plot |
| Distribution | Histogram |
| Many categories | Horizontal bar |

## Golden Rules

### 1. **Clear Labels**
- Always label axes
- Include units (°F, $, kg)
- Use descriptive titles

### 2. **Appropriate Scale**
- Start y-axis at 0 for bar charts
- Don't truncate to exaggerate
- Use consistent scales for comparison

### 3. **Minimal Clutter**
- Remove unnecessary gridlines
- Limit colors (3-5 max)
- No 3D effects (they distort)

### 4. **Honest Representation**
- Don't cherry-pick data
- Show uncertainty when relevant
- Don't use misleading scales

## Common Mistakes to Avoid

❌ **Truncated Y-axis** - Makes small changes look huge
❌ **3D Charts** - Distort perception
❌ **Too many colors** - Overwhelming
❌ **Missing labels** - Unclear meaning
❌ **Wrong chart type** - Confusing message
❌ **Pie charts > 5 slices** - Hard to compare`,
      codeExamples: JSON.stringify([
        {
          id: "good-vs-bad",
          title: "Good vs Bad Visualization",
          code: "import matplotlib.pyplot as plt\n\nmonths = ['Jan', 'Feb', 'Mar', 'Apr']\nvalues = [100, 102, 104, 103]\n\nfig, axes = plt.subplots(1, 2, figsize=(14, 5))\n\n# BAD: Truncated y-axis exaggerates change\naxes[0].bar(months, values, color='red')\naxes[0].set_ylim(98, 106)  # Truncated!\naxes[0].set_title('BAD: Truncated Y-Axis\\n(Makes 3% change look huge!)', color='red')\naxes[0].set_ylabel('Sales')\n\n# GOOD: Y-axis starts at 0\naxes[1].bar(months, values, color='green')\naxes[1].set_ylim(0, 120)  # Starts at 0\naxes[1].set_title('GOOD: Y-Axis Starts at 0\\n(Shows true proportion)', color='green')\naxes[1].set_ylabel('Sales')\n\nplt.tight_layout()\nplt.show()\n\nprint(\"The same data tells VERY different stories!\")",
          description: "Honest vs misleading scales",
        },
        {
          id: "chart-selection",
          title: "Choosing the Right Chart",
          code: "import matplotlib.pyplot as plt\nimport random\n\nrandom.seed(42)\n\n# Same data, different charts\ncategories = ['A', 'B', 'C', 'D', 'E']\nvalues = [30, 25, 20, 15, 10]\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\n\n# Pie - OK for parts of whole (≤5 parts)\naxes[0, 0].pie(values, labels=categories, autopct='%1.0f%%')\naxes[0, 0].set_title('Pie Chart\\n✓ Good for parts of whole')\n\n# Bar - Better for comparison\naxes[0, 1].bar(categories, values, color='steelblue')\naxes[0, 1].set_title('Bar Chart\\n✓ Better for comparing values')\naxes[0, 1].set_ylabel('Value')\n\n# Line - Wrong choice! (categorical, not time series)\naxes[1, 0].plot(categories, values, 'ro-')\naxes[1, 0].set_title('Line Chart\\n✗ Wrong for categorical data!')\naxes[1, 0].set_ylabel('Value')\n\n# Horizontal bar - Great for many categories\naxes[1, 1].barh(categories, values, color='coral')\naxes[1, 1].set_title('Horizontal Bar\\n✓ Great for many categories')\naxes[1, 1].set_xlabel('Value')\n\nplt.tight_layout()\nplt.show()",
          description: "Match chart type to data",
        },
        {
          id: "clean-design",
          title: "Clean vs Cluttered",
          code: "import matplotlib.pyplot as plt\n\nmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']\nvalues = [100, 120, 115, 140, 155, 170]\n\nfig, axes = plt.subplots(1, 2, figsize=(14, 5))\n\n# CLUTTERED\naxes[0].plot(months, values, 'ro-', linewidth=3, markersize=15)\naxes[0].set_facecolor('#FFFFCC')\naxes[0].grid(True, color='red', linewidth=2)\naxes[0].set_title('CLUTTERED: Too much going on!', fontsize=16, color='red')\n\n# CLEAN\naxes[1].plot(months, values, color='#2c3e50', linewidth=2, marker='o', markersize=6)\naxes[1].set_xlabel('Month', fontsize=11)\naxes[1].set_ylabel('Revenue ($K)', fontsize=11)\naxes[1].set_title('Revenue Growth', fontsize=12)\naxes[1].grid(True, alpha=0.3, linestyle='--')\naxes[1].spines['top'].set_visible(False)\naxes[1].spines['right'].set_visible(False)\n\nplt.tight_layout()\nplt.show()\n\nprint(\"Less is more! Clean design communicates better.\")",
          description: "Minimalist design wins",
        },
        {
          id: "professional-template",
          title: "Professional Chart Template",
          code: "import matplotlib.pyplot as plt\n\ndef professional_line_chart(x, y, title, xlabel, ylabel, color='#3498db'):\n    \"\"\"Template for professional-looking charts.\"\"\"\n    fig, ax = plt.subplots(figsize=(10, 6))\n    \n    # Plot with good defaults\n    ax.plot(x, y, color=color, linewidth=2, marker='o', markersize=6)\n    \n    # Labels and title\n    ax.set_xlabel(xlabel, fontsize=11, fontweight='medium')\n    ax.set_ylabel(ylabel, fontsize=11, fontweight='medium')\n    ax.set_title(title, fontsize=13, fontweight='bold', pad=15)\n    \n    # Clean grid\n    ax.grid(True, alpha=0.3, linestyle='--')\n    \n    # Remove top and right spines\n    ax.spines['top'].set_visible(False)\n    ax.spines['right'].set_visible(False)\n    \n    # Padding\n    plt.tight_layout()\n    \n    return fig, ax\n\n# Use the template\nmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']\nsales = [85, 92, 88, 105, 115, 125]\n\nfig, ax = professional_line_chart(\n    months, sales,\n    title='Monthly Sales Performance',\n    xlabel='Month',\n    ylabel='Sales ($K)',\n    color='#27ae60'\n)\n\nplt.show()\n\nprint(\"Use this template for consistent, professional charts!\")",
          description: "Reusable professional template",
        },
      ]),
      keyPoints: [
        "Choose chart type based on data and message",
        "Always label axes with units",
        "Start bar chart y-axis at 0",
        "Limit to 3-5 colors maximum",
        "Avoid 3D charts (distortion)",
        "Remove unnecessary clutter",
        "Be honest - don't mislead",
        "Less is more in visualization",
      ],
      hardwareDemo: "Show good vs bad examples side by side. Interactive chart type selector.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson11_2_2.number}: ${lesson11_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson11_2_2.id,
        number: 1,
        title: "Fix the Y-Axis",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Fix this misleading chart by setting appropriate y-axis limits.",
        starterCode: "import matplotlib.pyplot as plt\n\nyears = [2020, 2021, 2022, 2023]\nrevenue = [995, 1000, 1010, 1005]  # Very small changes\n\n# This is misleading!\nplt.bar(years, revenue)\nplt.ylim(990, 1015)  # Truncated!\nplt.title('Revenue Growth')\nplt.show()\n\n# Fix it to show honest scale",
        solution: "import matplotlib.pyplot as plt\n\nyears = [2020, 2021, 2022, 2023]\nrevenue = [995, 1000, 1010, 1005]\n\nplt.figure(figsize=(8, 6))\nplt.bar(years, revenue, color='steelblue')\nplt.ylim(0, 1200)  # Start at 0!\nplt.xlabel('Year')\nplt.ylabel('Revenue ($M)')\nplt.title('Revenue (Honest Scale)')\nplt.show()\n\nprint(\"Now we see the changes are actually very small!\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Honest y-axis", description: "Scale fixed" }]),
        hints: ["Start ylim at 0", "This shows the true proportion"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson11_2_2.id,
        number: 2,
        title: "Choose Right Chart",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        prompt: "You want to show how market share is divided among 4 companies. Best chart?",
        starterCode: "",
        solution: "Pie chart or bar chart - both work for parts of a whole with ≤5 categories",
        testCases: JSON.stringify([
          { input: "Pie chart", expectedOutput: "true", description: "Good choice!" },
          { input: "Bar chart", expectedOutput: "true", description: "Also good!" },
          { input: "Line chart", expectedOutput: "false", description: "Line is for trends over time" },
          { input: "Scatter plot", expectedOutput: "false", description: "Scatter is for relationships" },
        ]),
        hints: ["4 categories = ≤5, pie is OK", "Bar also works for comparison"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson11_2_2.id,
        number: 3,
        title: "Clean Up Chart",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Transform this cluttered chart into a clean, professional one.",
        starterCode: "import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4, 5]\ny = [10, 25, 15, 30, 20]\n\n# Cluttered version\nplt.figure(facecolor='yellow')\nplt.plot(x, y, 'r*-', linewidth=5, markersize=20)\nplt.grid(True, color='blue', linewidth=3)\nplt.title('DATA!!!', fontsize=30, color='purple')\nplt.show()\n\n# Create clean version",
        solution: "import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4, 5]\ny = [10, 25, 15, 30, 20]\n\nfig, ax = plt.subplots(figsize=(8, 5))\n\n# Clean styling\nax.plot(x, y, color='#2c3e50', linewidth=2, marker='o', markersize=6)\nax.set_xlabel('X Value', fontsize=11)\nax.set_ylabel('Y Value', fontsize=11)\nax.set_title('Clean Data Visualization', fontsize=12, fontweight='bold')\nax.grid(True, alpha=0.3, linestyle='--')\nax.spines['top'].set_visible(False)\nax.spines['right'].set_visible(False)\n\nplt.tight_layout()\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Clean chart", description: "Professional result" }]),
        hints: ["Remove bright colors", "Subtle grid", "Remove top/right spines"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson11_2_2.id,
        number: 4,
        title: "Add Proper Labels",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add all necessary labels and a legend to make this chart clear.",
        starterCode: "import matplotlib.pyplot as plt\n\nquarters = ['Q1', 'Q2', 'Q3', 'Q4']\nproduct_a = [50, 60, 70, 80]\nproduct_b = [40, 45, 55, 70]\n\nplt.plot(quarters, product_a)\nplt.plot(quarters, product_b)\nplt.show()\n\n# Add: title, xlabel, ylabel, legend, and units",
        solution: "import matplotlib.pyplot as plt\n\nquarters = ['Q1', 'Q2', 'Q3', 'Q4']\nproduct_a = [50, 60, 70, 80]\nproduct_b = [40, 45, 55, 70]\n\nfig, ax = plt.subplots(figsize=(8, 5))\n\nax.plot(quarters, product_a, 'b-o', linewidth=2, label='Product A')\nax.plot(quarters, product_b, 'r-s', linewidth=2, label='Product B')\n\nax.set_xlabel('Quarter', fontsize=11)\nax.set_ylabel('Units Sold (thousands)', fontsize=11)\nax.set_title('Quarterly Sales by Product', fontsize=12, fontweight='bold')\nax.legend(loc='upper left')\nax.grid(True, alpha=0.3)\n\nplt.tight_layout()\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Fully labeled", description: "All labels present" }]),
        hints: ["Label tells what data is", "Include units in ylabel", "Legend identifies each line"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson11_2_2.id,
        number: 5,
        title: "Professional Template",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a reusable function that produces professional bar charts.",
        starterCode: "import matplotlib.pyplot as plt\n\ndef professional_bar(categories, values, title, ylabel, color='steelblue'):\n    \"\"\"\n    Create a professional bar chart.\n    - Clean design\n    - Proper labels\n    - Value labels on bars\n    - No clutter\n    \"\"\"\n    pass\n\n# Test it\nprofessional_bar(\n    ['North', 'South', 'East', 'West'],\n    [120, 98, 145, 110],\n    'Regional Sales',\n    'Sales ($K)'\n)",
        solution: "import matplotlib.pyplot as plt\n\ndef professional_bar(categories, values, title, ylabel, color='steelblue'):\n    fig, ax = plt.subplots(figsize=(10, 6))\n    \n    # Create bars\n    bars = ax.bar(categories, values, color=color, edgecolor='white', linewidth=1.5)\n    \n    # Add value labels\n    for bar, val in zip(bars, values):\n        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(values)*0.02,\n                f'{val}', ha='center', fontsize=10, fontweight='bold')\n    \n    # Labels and title\n    ax.set_ylabel(ylabel, fontsize=11, fontweight='medium')\n    ax.set_title(title, fontsize=13, fontweight='bold', pad=15)\n    \n    # Clean up\n    ax.spines['top'].set_visible(False)\n    ax.spines['right'].set_visible(False)\n    ax.set_ylim(0, max(values) * 1.15)\n    \n    plt.tight_layout()\n    plt.show()\n    return fig, ax\n\nprofessional_bar(\n    ['North', 'South', 'East', 'West'],\n    [120, 98, 145, 110],\n    'Regional Sales',\n    'Sales ($K)'\n)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Professional bar chart", description: "Template works" }]),
        hints: ["Add value labels on bars", "Remove top/right spines", "Leave room for labels with ylim"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 11.2.2`);

  console.log("\n✅ Chapter 11 Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
