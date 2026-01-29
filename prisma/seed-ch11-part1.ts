import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 11 Part 1: Structure + Lessons 11.1.1-11.1.3...\n");

  // Create Chapter 11
  let chapter11 = await prisma.chapter.findFirst({ where: { number: 11 } });
  if (!chapter11) {
    chapter11 = await prisma.chapter.create({
      data: {
        number: 11,
        title: "Plotting and More About Classes",
        description: "Transform data into visual insights with Matplotlib and extend Python's built-in types. Master data visualization - the cornerstone of data science.",
        objectives: [
          "Create professional visualizations with Matplotlib",
          "Choose appropriate chart types for different data",
          "Extend built-in types with custom classes",
          "Apply visualization to real-world data analysis",
        ],
        isPublished: true,
      },
    });
  }
  console.log(`✅ Chapter ${chapter11.number}: ${chapter11.title}`);

  // Create Sections
  const section11_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter11.id, number: 11.1 } },
    update: {},
    create: { chapterId: chapter11.id, number: 11.1, title: "Matplotlib Fundamentals", description: "Core plotting with pyplot.", order: 1 },
  });
  console.log(`  📂 Section ${section11_1.number}: ${section11_1.title}`);

  const section11_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter11.id, number: 11.2 } },
    update: {},
    create: { chapterId: chapter11.id, number: 11.2, title: "Data Visualization", description: "Real-world visualization.", order: 2 },
  });
  console.log(`  📂 Section ${section11_2.number}: ${section11_2.title}`);

  const section11_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter11.id, number: 11.3 } },
    update: {},
    create: { chapterId: chapter11.id, number: 11.3, title: "Extending Built-in Types", description: "Advanced class techniques.", order: 3 },
  });
  console.log(`  📂 Section ${section11_3.number}: ${section11_3.title}`);

  const section11_4 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter11.id, number: 11.4 } },
    update: {},
    create: { chapterId: chapter11.id, number: 11.4, title: "Putting It Together", description: "Complete analysis workflow.", order: 4 },
  });
  console.log(`  📂 Section ${section11_4.number}: ${section11_4.title}`);

  // ==================== LESSON 11.1.1 ====================
  const lesson11_1_1 = await prisma.lesson.upsert({
    where: { slug: "intro-matplotlib" },
    update: {},
    create: {
      sectionId: section11_1.id,
      number: 11.11,
      title: "Introduction to Matplotlib",
      slug: "intro-matplotlib",
      objectives: [
        "Understand why data visualization matters",
        "Install and import matplotlib",
        "Create your first plot",
        "Understand figure and axes concepts",
      ],
      content: `# Introduction to Matplotlib

## Why Visualize Data?

"A picture is worth a thousand numbers."

Raw data:
\`\`\`
[12, 15, 18, 22, 25, 28, 32, 35, 38, 40]
\`\`\`

Can you see the trend? Now imagine 10,000 numbers!

Visualization reveals:
- **Patterns** invisible in raw data
- **Outliers** that might be errors
- **Trends** over time
- **Relationships** between variables

## What is Matplotlib?

Matplotlib is Python's most popular plotting library:
- Industry standard for data visualization
- Used in data science, machine learning, research
- Creates publication-quality figures
- Highly customizable

## Installing Matplotlib

\`\`\`bash
pip install matplotlib
\`\`\`

## The Basic Workflow

\`\`\`python
import matplotlib.pyplot as plt

# 1. Create data
x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]

# 2. Create plot
plt.plot(x, y)

# 3. Add labels
plt.xlabel('X axis')
plt.ylabel('Y axis')
plt.title('My First Plot')

# 4. Display
plt.show()
\`\`\`

## Figure and Axes

- **Figure**: The entire window/image
- **Axes**: A single plot within the figure

\`\`\`python
fig, ax = plt.subplots()  # Create figure and axes
ax.plot(x, y)             # Plot on the axes
plt.show()
\`\`\`

This "object-oriented" style gives more control.`,
      codeExamples: JSON.stringify([
        {
          id: "first-plot",
          title: "Your First Plot",
          code: "import matplotlib.pyplot as plt\n\n# Simple data\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 6, 8, 10]\n\n# Create the plot\nplt.plot(x, y)\n\n# Add labels\nplt.xlabel('X values')\nplt.ylabel('Y values')\nplt.title('My First Plot')\n\n# Show the plot\nplt.show()\n\nprint(\"Plot displayed!\")",
          description: "Create a simple line plot",
        },
        {
          id: "why-visualize",
          title: "Why Visualization Matters",
          code: "import matplotlib.pyplot as plt\n\n# Same data, different views\nmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']\nsales = [100, 120, 115, 140, 180, 200]\n\nprint(\"Raw data:\")\nfor m, s in zip(months, sales):\n    print(f\"  {m}: ${s}\")\n\nprint(\"\\nCan you spot the trend easily?\")\nprint(\"Now let's visualize it...\")\n\nplt.plot(months, sales, marker='o')\nplt.xlabel('Month')\nplt.ylabel('Sales ($)')\nplt.title('Monthly Sales - Trend is Obvious!')\nplt.show()",
          description: "Visualization reveals patterns",
        },
        {
          id: "figure-axes",
          title: "Figure and Axes Concepts",
          code: "import matplotlib.pyplot as plt\n\n# Method 1: Simple (pyplot state machine)\nplt.figure()  # Create a figure\nplt.plot([1, 2, 3], [1, 4, 9])\nplt.title('Method 1: pyplot style')\nplt.show()\n\n# Method 2: Object-oriented (recommended)\nfig, ax = plt.subplots()  # Create figure AND axes\nax.plot([1, 2, 3], [1, 4, 9])\nax.set_title('Method 2: OO style')\nax.set_xlabel('x')\nax.set_ylabel('y')\nplt.show()\n\nprint(\"Method 2 gives more control for complex plots.\")",
          description: "Two ways to create plots",
        },
        {
          id: "plot-workflow",
          title: "Complete Plotting Workflow",
          code: "import matplotlib.pyplot as plt\n\n# Step 1: Prepare data\ndays = list(range(1, 8))\ntemperatures = [72, 75, 71, 68, 74, 78, 80]\n\n# Step 2: Create figure and axes\nfig, ax = plt.subplots(figsize=(8, 5))  # Custom size\n\n# Step 3: Plot the data\nax.plot(days, temperatures, color='red', linewidth=2, marker='o')\n\n# Step 4: Customize\nax.set_xlabel('Day of Week', fontsize=12)\nax.set_ylabel('Temperature (°F)', fontsize=12)\nax.set_title('Weekly Temperature', fontsize=14)\nax.grid(True, linestyle='--', alpha=0.7)\n\n# Step 5: Display\nplt.tight_layout()  # Adjust spacing\nplt.show()\n\nprint(\"Professional-looking plot created!\")",
          description: "The complete workflow",
        },
      ]),
      keyPoints: [
        "Visualization reveals patterns in data",
        "Matplotlib is Python's standard plotting library",
        "import matplotlib.pyplot as plt",
        "plt.plot(x, y) creates a line plot",
        "Always add labels: xlabel, ylabel, title",
        "plt.show() displays the plot",
        "Figure = entire image, Axes = single plot",
        "fig, ax = plt.subplots() for more control",
      ],
      hardwareDemo: "Create plots that render in the learning interface. Show before/after of raw data vs visualization.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson11_1_1.number}: ${lesson11_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson11_1_1.id,
        number: 1,
        title: "First Plot",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a simple line plot of squares: x = [1,2,3,4,5], y = [1,4,9,16,25].",
        starterCode: "import matplotlib.pyplot as plt\n\n# Create x and y data for squares\n\n# Plot the data\n\n# Add title 'Square Numbers'\n\n# Show the plot",
        solution: "import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4, 5]\ny = [1, 4, 9, 16, 25]\n\nplt.plot(x, y)\nplt.title('Square Numbers')\nplt.xlabel('x')\nplt.ylabel('x²')\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Plot displayed", description: "First plot created" }]),
        hints: ["Use plt.plot(x, y)", "Use plt.title() for title", "Use plt.show() to display"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson11_1_1.id,
        number: 2,
        title: "Add Labels",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a plot with proper x-label, y-label, and title.",
        starterCode: "import matplotlib.pyplot as plt\n\nhours_studied = [1, 2, 3, 4, 5, 6]\ntest_scores = [50, 60, 70, 75, 85, 95]\n\n# Create plot with:\n# - x-label: 'Hours Studied'\n# - y-label: 'Test Score'\n# - title: 'Study Time vs Test Score'",
        solution: "import matplotlib.pyplot as plt\n\nhours_studied = [1, 2, 3, 4, 5, 6]\ntest_scores = [50, 60, 70, 75, 85, 95]\n\nplt.plot(hours_studied, test_scores)\nplt.xlabel('Hours Studied')\nplt.ylabel('Test Score')\nplt.title('Study Time vs Test Score')\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Labeled plot", description: "Labels added" }]),
        hints: ["plt.xlabel() for x-axis label", "plt.ylabel() for y-axis label", "plt.title() for title"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson11_1_1.id,
        number: 3,
        title: "Object-Oriented Style",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create the same plot using fig, ax = plt.subplots() style.",
        starterCode: "import matplotlib.pyplot as plt\n\nx = [0, 1, 2, 3, 4]\ny = [0, 1, 4, 9, 16]\n\n# Use object-oriented style:\n# fig, ax = plt.subplots()\n# ax.plot(), ax.set_xlabel(), etc.",
        solution: "import matplotlib.pyplot as plt\n\nx = [0, 1, 2, 3, 4]\ny = [0, 1, 4, 9, 16]\n\nfig, ax = plt.subplots()\nax.plot(x, y)\nax.set_xlabel('x')\nax.set_ylabel('x²')\nax.set_title('Squares (OO Style)')\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "OO style plot", description: "Object-oriented plot" }]),
        hints: ["Use fig, ax = plt.subplots()", "Use ax.set_xlabel() not plt.xlabel()", "Use ax.set_title()"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson11_1_1.id,
        number: 4,
        title: "Custom Figure Size",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a wider plot using figsize parameter.",
        starterCode: "import matplotlib.pyplot as plt\n\nmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']\nrevenue = [10000, 12000, 11500, 14000, 15500, 18000]\n\n# Create a figure that's 10 inches wide and 4 inches tall\n# Plot the revenue data",
        solution: "import matplotlib.pyplot as plt\n\nmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']\nrevenue = [10000, 12000, 11500, 14000, 15500, 18000]\n\nfig, ax = plt.subplots(figsize=(10, 4))\nax.plot(months, revenue, marker='o')\nax.set_xlabel('Month')\nax.set_ylabel('Revenue ($)')\nax.set_title('Monthly Revenue')\nplt.tight_layout()\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Wide plot", description: "Custom size works" }]),
        hints: ["figsize=(width, height) in inches", "plt.tight_layout() adjusts spacing"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson11_1_1.id,
        number: 5,
        title: "Grid and Styling",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a plot with a grid for easier reading.",
        starterCode: "import matplotlib.pyplot as plt\n\ndays = list(range(1, 11))\nsteps = [5000, 6200, 4800, 7500, 8000, 6500, 9000, 8500, 7000, 10000]\n\n# Create plot with:\n# - Grid lines\n# - Title: 'Daily Steps'\n# - Marker on each point",
        solution: "import matplotlib.pyplot as plt\n\ndays = list(range(1, 11))\nsteps = [5000, 6200, 4800, 7500, 8000, 6500, 9000, 8500, 7000, 10000]\n\nfig, ax = plt.subplots(figsize=(8, 5))\nax.plot(days, steps, marker='o', color='green')\nax.set_xlabel('Day')\nax.set_ylabel('Steps')\nax.set_title('Daily Steps')\nax.grid(True, linestyle='--', alpha=0.7)\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Plot with grid", description: "Grid added" }]),
        hints: ["ax.grid(True) enables grid", "linestyle='--' for dashed lines", "alpha controls transparency"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 11.1.1`);

  // ==================== LESSON 11.1.2 ====================
  const lesson11_1_2 = await prisma.lesson.upsert({
    where: { slug: "line-plots" },
    update: {},
    create: {
      sectionId: section11_1.id,
      number: 11.12,
      title: "Line Plots",
      slug: "line-plots",
      objectives: [
        "Master plt.plot() options",
        "Customize colors, styles, and markers",
        "Create professional line plots",
        "Know when to use line plots",
      ],
      content: `# Line Plots

## When to Use Line Plots

Line plots are ideal for:
- **Time series** data (trends over time)
- **Continuous** data
- Showing **change** and **direction**
- Comparing **trends** between datasets

Not ideal for:
- Categorical data (use bar charts)
- Unordered data (use scatter plots)

## Basic Line Plot

\`\`\`python
plt.plot(x, y)
\`\`\`

If you only provide y values, x becomes [0, 1, 2, ...]:
\`\`\`python
plt.plot([10, 20, 30, 40])  # x is [0, 1, 2, 3]
\`\`\`

## Customizing Lines

### Colors
\`\`\`python
plt.plot(x, y, color='red')      # Named color
plt.plot(x, y, color='#FF5733')  # Hex color
plt.plot(x, y, color='C0')       # Default color cycle
\`\`\`

### Line Styles
\`\`\`python
plt.plot(x, y, linestyle='-')    # Solid (default)
plt.plot(x, y, linestyle='--')   # Dashed
plt.plot(x, y, linestyle=':')    # Dotted
plt.plot(x, y, linestyle='-.')   # Dash-dot
\`\`\`

### Markers
\`\`\`python
plt.plot(x, y, marker='o')   # Circle
plt.plot(x, y, marker='s')   # Square
plt.plot(x, y, marker='^')   # Triangle
plt.plot(x, y, marker='*')   # Star
\`\`\`

## Format Strings (Shorthand)

Combine color, marker, and line style:
\`\`\`python
plt.plot(x, y, 'ro-')   # Red, circles, solid line
plt.plot(x, y, 'b^--')  # Blue, triangles, dashed
plt.plot(x, y, 'g*:')   # Green, stars, dotted
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-line",
          title: "Basic Line Plot",
          code: "import matplotlib.pyplot as plt\n\n# Time series data\ndays = list(range(1, 8))\ntemperature = [68, 72, 75, 71, 69, 74, 78]\n\n# Simple line plot\nplt.plot(days, temperature)\nplt.xlabel('Day')\nplt.ylabel('Temperature (°F)')\nplt.title('Weekly Temperature')\nplt.show()",
          description: "Simple line plot for time series",
        },
        {
          id: "colors-styles",
          title: "Colors and Line Styles",
          code: "import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4, 5]\n\nfig, axes = plt.subplots(2, 2, figsize=(10, 8))\n\n# Different colors\naxes[0, 0].plot(x, [1, 4, 2, 5, 3], color='red')\naxes[0, 0].plot(x, [2, 3, 4, 3, 4], color='blue')\naxes[0, 0].plot(x, [3, 2, 1, 2, 5], color='green')\naxes[0, 0].set_title('Different Colors')\n\n# Different line styles\naxes[0, 1].plot(x, [1, 2, 3, 4, 5], linestyle='-', label='Solid')\naxes[0, 1].plot(x, [1.5, 2.5, 3.5, 4.5, 5.5], linestyle='--', label='Dashed')\naxes[0, 1].plot(x, [2, 3, 4, 5, 6], linestyle=':', label='Dotted')\naxes[0, 1].set_title('Line Styles')\naxes[0, 1].legend()\n\n# Different markers\naxes[1, 0].plot(x, [1, 2, 3, 4, 5], marker='o', label='Circle')\naxes[1, 0].plot(x, [1.5, 2.5, 3.5, 4.5, 5.5], marker='s', label='Square')\naxes[1, 0].plot(x, [2, 3, 4, 5, 6], marker='^', label='Triangle')\naxes[1, 0].set_title('Markers')\naxes[1, 0].legend()\n\n# Line width\naxes[1, 1].plot(x, [1, 2, 3, 4, 5], linewidth=1, label='Thin')\naxes[1, 1].plot(x, [1.5, 2.5, 3.5, 4.5, 5.5], linewidth=3, label='Medium')\naxes[1, 1].plot(x, [2, 3, 4, 5, 6], linewidth=5, label='Thick')\naxes[1, 1].set_title('Line Width')\naxes[1, 1].legend()\n\nplt.tight_layout()\nplt.show()",
          description: "Exploring customization options",
        },
        {
          id: "format-strings",
          title: "Format Strings Shorthand",
          code: "import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4, 5]\n\nfig, ax = plt.subplots(figsize=(10, 6))\n\n# Format string: 'color marker linestyle'\nax.plot(x, [1, 2, 3, 4, 5], 'ro-', label='ro- (red circle solid)')\nax.plot(x, [2, 3, 4, 5, 6], 'bs--', label='bs-- (blue square dashed)')\nax.plot(x, [3, 4, 5, 6, 7], 'g^:', label='g^: (green triangle dotted)')\nax.plot(x, [4, 5, 6, 7, 8], 'm*-.', label='m*-. (magenta star dash-dot)')\n\nax.set_xlabel('X')\nax.set_ylabel('Y')\nax.set_title('Format String Shorthand')\nax.legend()\nax.grid(True, alpha=0.3)\n\nplt.show()\n\nprint(\"Format: 'color marker linestyle'\")\nprint(\"Colors: r g b c m y k w\")\nprint(\"Markers: o s ^ v < > * + x\")\nprint(\"Lines: - -- : -.\")",
          description: "Quick formatting with shorthand",
        },
        {
          id: "professional-line",
          title: "Professional Line Plot",
          code: "import matplotlib.pyplot as plt\n\n# Stock price data (example)\ndays = list(range(1, 31))\nimport random\nrandom.seed(42)\nprice = [100]\nfor _ in range(29):\n    price.append(price[-1] + random.uniform(-3, 4))\n\n# Professional styling\nfig, ax = plt.subplots(figsize=(12, 6))\n\nax.plot(days, price, \n        color='#1f77b4',      # Nice blue\n        linewidth=2,\n        marker='o',\n        markersize=4,\n        markerfacecolor='white',\n        markeredgecolor='#1f77b4',\n        markeredgewidth=1.5)\n\n# Add horizontal line for reference\nax.axhline(y=100, color='gray', linestyle='--', alpha=0.5, label='Starting Price')\n\n# Customize\nax.set_xlabel('Day', fontsize=12)\nax.set_ylabel('Stock Price ($)', fontsize=12)\nax.set_title('30-Day Stock Price Movement', fontsize=14, fontweight='bold')\nax.grid(True, linestyle='--', alpha=0.3)\nax.legend()\n\n# Set y-axis to start near data\nax.set_ylim(min(price) - 5, max(price) + 5)\n\nplt.tight_layout()\nplt.show()",
          description: "Publication-quality line plot",
        },
      ]),
      keyPoints: [
        "Line plots show trends over continuous data",
        "color='red' or hex codes for colors",
        "linestyle: '-' solid, '--' dashed, ':' dotted",
        "marker: 'o' circle, 's' square, '^' triangle",
        "Format string shorthand: 'ro-' = red circles solid",
        "linewidth controls line thickness",
        "markersize controls marker size",
        "ax.axhline() adds horizontal reference lines",
      ],
      hardwareDemo: "Show various line styles side by side. Demonstrate format string combinations.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson11_1_2.number}: ${lesson11_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson11_1_2.id,
        number: 1,
        title: "Red Dashed Line",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a red dashed line plot with circle markers.",
        starterCode: "import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 6, 8, 10]\n\n# Create red dashed line with circle markers\n# Use format string shorthand",
        solution: "import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 6, 8, 10]\n\nplt.plot(x, y, 'ro--')  # red, circles, dashed\nplt.xlabel('X')\nplt.ylabel('Y')\nplt.title('Red Dashed Line')\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Red dashed line", description: "Style applied" }]),
        hints: ["Format string: 'ro--'", "r=red, o=circle, --=dashed"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson11_1_2.id,
        number: 2,
        title: "Customize Line Width",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a thick blue line (linewidth=3) with square markers.",
        starterCode: "import matplotlib.pyplot as plt\n\nx = [0, 1, 2, 3, 4]\ny = [0, 1, 4, 9, 16]\n\n# Create blue line with:\n# - linewidth=3\n# - square markers\n# - solid line",
        solution: "import matplotlib.pyplot as plt\n\nx = [0, 1, 2, 3, 4]\ny = [0, 1, 4, 9, 16]\n\nplt.plot(x, y, color='blue', linewidth=3, marker='s', linestyle='-')\nplt.xlabel('X')\nplt.ylabel('Y')\nplt.title('Thick Blue Line')\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Thick blue line", description: "Styling works" }]),
        hints: ["linewidth=3 for thickness", "marker='s' for square"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson11_1_2.id,
        number: 3,
        title: "Temperature Trend",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Plot daily temperatures with a professional style.",
        starterCode: "import matplotlib.pyplot as plt\n\ndays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']\ntemps = [72, 75, 71, 68, 74, 79, 82]\n\n# Create a professional plot with:\n# - Orange line with markers\n# - Grid\n# - Proper labels\n# - Title: 'Weekly Temperature'",
        solution: "import matplotlib.pyplot as plt\n\ndays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']\ntemps = [72, 75, 71, 68, 74, 79, 82]\n\nfig, ax = plt.subplots(figsize=(10, 5))\nax.plot(days, temps, color='orange', linewidth=2, marker='o', markersize=8)\nax.set_xlabel('Day')\nax.set_ylabel('Temperature (°F)')\nax.set_title('Weekly Temperature')\nax.grid(True, linestyle='--', alpha=0.5)\nplt.tight_layout()\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Professional temp plot", description: "Styled correctly" }]),
        hints: ["Use figsize for custom size", "marker='o' for circles", "ax.grid() for grid lines"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson11_1_2.id,
        number: 4,
        title: "Reference Line",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Plot data with a horizontal reference line at the average.",
        starterCode: "import matplotlib.pyplot as plt\n\nmonths = list(range(1, 13))\nsales = [100, 120, 110, 130, 150, 140, 160, 170, 150, 180, 190, 200]\naverage = sum(sales) / len(sales)\n\n# Plot sales\n# Add horizontal dashed line at the average\n# Label it 'Average'",
        solution: "import matplotlib.pyplot as plt\n\nmonths = list(range(1, 13))\nsales = [100, 120, 110, 130, 150, 140, 160, 170, 150, 180, 190, 200]\naverage = sum(sales) / len(sales)\n\nfig, ax = plt.subplots(figsize=(10, 5))\nax.plot(months, sales, 'b-o', label='Monthly Sales')\nax.axhline(y=average, color='red', linestyle='--', label=f'Average: ${average:.0f}')\nax.set_xlabel('Month')\nax.set_ylabel('Sales ($)')\nax.set_title('Monthly Sales with Average')\nax.legend()\nax.grid(True, alpha=0.3)\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Plot with reference line", description: "Reference line added" }]),
        hints: ["ax.axhline() for horizontal line", "Include average in label"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson11_1_2.id,
        number: 5,
        title: "Professional Styling",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a publication-quality plot with custom marker styling.",
        starterCode: "import matplotlib.pyplot as plt\n\nweeks = list(range(1, 13))\nweight = [180, 178, 177, 175, 174, 173, 172, 171, 170, 169, 168, 167]\n\n# Create professional plot with:\n# - White-filled markers with colored edge\n# - Thick line\n# - Goal line at 165\n# - Custom colors\n# - Grid",
        solution: "import matplotlib.pyplot as plt\n\nweeks = list(range(1, 13))\nweight = [180, 178, 177, 175, 174, 173, 172, 171, 170, 169, 168, 167]\n\nfig, ax = plt.subplots(figsize=(10, 6))\n\n# Main data line with custom markers\nax.plot(weeks, weight, \n        color='#2ecc71',\n        linewidth=2.5,\n        marker='o',\n        markersize=10,\n        markerfacecolor='white',\n        markeredgecolor='#2ecc71',\n        markeredgewidth=2,\n        label='Weight')\n\n# Goal line\nax.axhline(y=165, color='#e74c3c', linestyle='--', linewidth=2, label='Goal: 165 lbs')\n\nax.set_xlabel('Week', fontsize=12)\nax.set_ylabel('Weight (lbs)', fontsize=12)\nax.set_title('12-Week Weight Loss Journey', fontsize=14, fontweight='bold')\nax.legend(loc='upper right')\nax.grid(True, linestyle='--', alpha=0.3)\nax.set_ylim(160, 185)\n\nplt.tight_layout()\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Professional plot", description: "Publication quality" }]),
        hints: ["markerfacecolor='white' for hollow look", "markeredgewidth controls edge thickness"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 11.1.2`);

  // ==================== LESSON 11.1.3 ====================
  const lesson11_1_3 = await prisma.lesson.upsert({
    where: { slug: "scatter-bar-plots" },
    update: {},
    create: {
      sectionId: section11_1.id,
      number: 11.13,
      title: "Scatter Plots and Bar Charts",
      slug: "scatter-bar-plots",
      objectives: [
        "Create scatter plots for relationships",
        "Create bar charts for categorical data",
        "Choose the right chart type",
        "Customize scatter and bar plots",
      ],
      content: `# Scatter Plots and Bar Charts

## Scatter Plots

**Use for**: Showing **relationships** between two variables.

\`\`\`python
plt.scatter(x, y)
\`\`\`

**Best for**:
- Correlations (height vs weight)
- Distributions
- Identifying outliers
- Clustering patterns

### Customization
\`\`\`python
plt.scatter(x, y, 
            c='blue',        # Color
            s=50,            # Size
            alpha=0.5,       # Transparency
            marker='o')      # Shape
\`\`\`

## Bar Charts

**Use for**: Comparing **categorical** data.

\`\`\`python
plt.bar(categories, values)    # Vertical
plt.barh(categories, values)   # Horizontal
\`\`\`

**Best for**:
- Comparing quantities across categories
- Showing rankings
- Discrete data

### Customization
\`\`\`python
plt.bar(categories, values,
        color='skyblue',     # Bar color
        edgecolor='navy',    # Border color
        width=0.6)           # Bar width
\`\`\`

## Choosing the Right Chart

| Data Type | Chart |
|-----------|-------|
| Trend over time | Line plot |
| Two continuous variables | Scatter plot |
| Categorical comparison | Bar chart |
| Distribution | Histogram |
| Part of whole | Pie chart |`,
      codeExamples: JSON.stringify([
        {
          id: "basic-scatter",
          title: "Basic Scatter Plot",
          code: "import matplotlib.pyplot as plt\nimport random\n\n# Generate correlated data\nrandom.seed(42)\nheight = [random.uniform(150, 190) for _ in range(50)]\nweight = [h * 0.5 + random.uniform(-10, 10) for h in height]\n\nplt.scatter(height, weight)\nplt.xlabel('Height (cm)')\nplt.ylabel('Weight (kg)')\nplt.title('Height vs Weight')\nplt.show()\n\nprint(\"Scatter plot shows the relationship between variables.\")",
          description: "Show relationship between variables",
        },
        {
          id: "scatter-customization",
          title: "Customized Scatter Plot",
          code: "import matplotlib.pyplot as plt\nimport random\n\nrandom.seed(42)\n\n# Three groups of data\nn = 30\ngroup1_x = [random.uniform(0, 4) for _ in range(n)]\ngroup1_y = [random.uniform(0, 4) for _ in range(n)]\n\ngroup2_x = [random.uniform(3, 7) for _ in range(n)]\ngroup2_y = [random.uniform(3, 7) for _ in range(n)]\n\ngroup3_x = [random.uniform(6, 10) for _ in range(n)]\ngroup3_y = [random.uniform(0, 4) for _ in range(n)]\n\nfig, ax = plt.subplots(figsize=(10, 6))\n\n# Different colors, sizes, and transparency\nax.scatter(group1_x, group1_y, c='red', s=100, alpha=0.6, label='Group A')\nax.scatter(group2_x, group2_y, c='blue', s=100, alpha=0.6, label='Group B')\nax.scatter(group3_x, group3_y, c='green', s=100, alpha=0.6, label='Group C')\n\nax.set_xlabel('X Value')\nax.set_ylabel('Y Value')\nax.set_title('Clustered Data')\nax.legend()\nax.grid(True, alpha=0.3)\n\nplt.show()",
          description: "Multiple groups with custom styling",
        },
        {
          id: "basic-bar",
          title: "Basic Bar Chart",
          code: "import matplotlib.pyplot as plt\n\ncategories = ['Python', 'JavaScript', 'Java', 'C++', 'Go']\npopularity = [35, 28, 18, 12, 7]\n\nplt.bar(categories, popularity)\nplt.xlabel('Programming Language')\nplt.ylabel('Popularity (%)')\nplt.title('Programming Language Popularity')\nplt.show()",
          description: "Compare categorical data",
        },
        {
          id: "styled-bar",
          title: "Styled Bar Chart",
          code: "import matplotlib.pyplot as plt\n\nproducts = ['Laptop', 'Phone', 'Tablet', 'Watch', 'Earbuds']\nsales = [150, 300, 100, 75, 200]\ncolors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6']\n\nfig, ax = plt.subplots(figsize=(10, 6))\n\n# Styled bars\nbars = ax.bar(products, sales, \n              color=colors,\n              edgecolor='black',\n              linewidth=1.5)\n\n# Add value labels on bars\nfor bar, value in zip(bars, sales):\n    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5,\n            f'${value}K', ha='center', fontsize=11, fontweight='bold')\n\nax.set_xlabel('Product', fontsize=12)\nax.set_ylabel('Sales ($K)', fontsize=12)\nax.set_title('Product Sales Comparison', fontsize=14, fontweight='bold')\nax.set_ylim(0, 350)\n\nplt.tight_layout()\nplt.show()",
          description: "Professional bar chart with labels",
        },
      ]),
      keyPoints: [
        "Scatter: plt.scatter(x, y) for relationships",
        "Bar: plt.bar(categories, values) for comparisons",
        "Scatter shows correlations and outliers",
        "Bar compares discrete categories",
        "s=size, c=color, alpha=transparency for scatter",
        "color, edgecolor, width for bars",
        "Add labels to bars for clarity",
        "Choose chart type based on data and question",
      ],
      hardwareDemo: "Create scatter and bar plots side by side. Show when to use each.",
      estimatedTime: 30,
      difficulty: "BEGINNER",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson11_1_3.number}: ${lesson11_1_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson11_1_3.id,
        number: 1,
        title: "Simple Scatter",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a scatter plot of study hours vs test scores.",
        starterCode: "import matplotlib.pyplot as plt\n\nhours = [1, 2, 3, 4, 5, 6, 7, 8]\nscores = [50, 55, 65, 70, 75, 80, 85, 90]\n\n# Create scatter plot with proper labels",
        solution: "import matplotlib.pyplot as plt\n\nhours = [1, 2, 3, 4, 5, 6, 7, 8]\nscores = [50, 55, 65, 70, 75, 80, 85, 90]\n\nplt.scatter(hours, scores)\nplt.xlabel('Hours Studied')\nplt.ylabel('Test Score')\nplt.title('Study Time vs Test Score')\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Scatter plot", description: "Basic scatter works" }]),
        hints: ["Use plt.scatter(x, y)", "Add xlabel, ylabel, title"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson11_1_3.id,
        number: 2,
        title: "Simple Bar Chart",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a bar chart of fruit sales.",
        starterCode: "import matplotlib.pyplot as plt\n\nfruits = ['Apples', 'Bananas', 'Oranges', 'Grapes']\nsales = [45, 30, 25, 20]\n\n# Create bar chart",
        solution: "import matplotlib.pyplot as plt\n\nfruits = ['Apples', 'Bananas', 'Oranges', 'Grapes']\nsales = [45, 30, 25, 20]\n\nplt.bar(fruits, sales, color='green')\nplt.xlabel('Fruit')\nplt.ylabel('Sales (units)')\nplt.title('Fruit Sales')\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Bar chart", description: "Basic bar works" }]),
        hints: ["Use plt.bar(categories, values)", "Add color parameter"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson11_1_3.id,
        number: 3,
        title: "Colored Scatter",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a scatter plot with color indicating a third variable.",
        starterCode: "import matplotlib.pyplot as plt\n\nage = [25, 30, 35, 40, 45, 50, 55, 60]\nincome = [30, 45, 55, 70, 80, 90, 85, 75]\nsatisfaction = [3, 4, 5, 5, 4, 4, 3, 3]  # 1-5 scale\n\n# Create scatter where color shows satisfaction level",
        solution: "import matplotlib.pyplot as plt\n\nage = [25, 30, 35, 40, 45, 50, 55, 60]\nincome = [30, 45, 55, 70, 80, 90, 85, 75]\nsatisfaction = [3, 4, 5, 5, 4, 4, 3, 3]\n\nfig, ax = plt.subplots()\nscatter = ax.scatter(age, income, c=satisfaction, s=100, cmap='RdYlGn')\nplt.colorbar(scatter, label='Satisfaction')\nax.set_xlabel('Age')\nax.set_ylabel('Income ($K)')\nax.set_title('Age vs Income (color = satisfaction)')\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Colored scatter", description: "Color mapping works" }]),
        hints: ["c=satisfaction for color by value", "cmap for color scheme", "plt.colorbar() shows scale"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson11_1_3.id,
        number: 4,
        title: "Bar Chart with Labels",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a bar chart with value labels on each bar.",
        starterCode: "import matplotlib.pyplot as plt\n\nquarters = ['Q1', 'Q2', 'Q3', 'Q4']\nrevenue = [120, 150, 180, 200]\n\n# Create bar chart\n# Add value label on top of each bar",
        solution: "import matplotlib.pyplot as plt\n\nquarters = ['Q1', 'Q2', 'Q3', 'Q4']\nrevenue = [120, 150, 180, 200]\n\nfig, ax = plt.subplots()\nbars = ax.bar(quarters, revenue, color='steelblue', edgecolor='navy')\n\n# Add labels\nfor bar, val in zip(bars, revenue):\n    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 3,\n            f'${val}K', ha='center', fontweight='bold')\n\nax.set_xlabel('Quarter')\nax.set_ylabel('Revenue ($K)')\nax.set_title('Quarterly Revenue')\nax.set_ylim(0, 230)\nplt.show()",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Labeled bars", description: "Labels added" }]),
        hints: ["Use ax.text() for labels", "Position at bar center and top"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson11_1_3.id,
        number: 5,
        title: "Choose the Right Chart",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create both scatter and bar plots to show why each suits different data.",
        starterCode: "import matplotlib.pyplot as plt\n\n# Data 1: Continuous relationship (use scatter)\ntemperature = [60, 65, 70, 75, 80, 85, 90]\nice_cream_sales = [100, 150, 200, 280, 350, 400, 450]\n\n# Data 2: Categorical comparison (use bar)\ndays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']\ncustomers = [150, 180, 160, 200, 250]\n\n# Create side-by-side plots showing appropriate chart for each",
        solution: "import matplotlib.pyplot as plt\n\ntemperature = [60, 65, 70, 75, 80, 85, 90]\nice_cream_sales = [100, 150, 200, 280, 350, 400, 450]\n\ndays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']\ncustomers = [150, 180, 160, 200, 250]\n\nfig, axes = plt.subplots(1, 2, figsize=(14, 5))\n\n# Scatter for continuous relationship\naxes[0].scatter(temperature, ice_cream_sales, c='coral', s=100)\naxes[0].set_xlabel('Temperature (°F)')\naxes[0].set_ylabel('Ice Cream Sales')\naxes[0].set_title('Temperature vs Sales\\n(Scatter: shows relationship)')\naxes[0].grid(True, alpha=0.3)\n\n# Bar for categorical\naxes[1].bar(days, customers, color='skyblue', edgecolor='navy')\naxes[1].set_xlabel('Day')\naxes[1].set_ylabel('Customers')\naxes[1].set_title('Daily Customers\\n(Bar: compares categories)')\n\nplt.tight_layout()\nplt.show()\n\nprint(\"Scatter: continuous variables, relationships\")\nprint(\"Bar: categorical data, comparisons\")",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Both charts side by side", description: "Chart choice demonstrated" }]),
        hints: ["Use subplots(1, 2) for side by side", "Scatter for temperature relationship", "Bar for daily comparison"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 11.1.3`);

  console.log("\n✅ Chapter 11 Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
