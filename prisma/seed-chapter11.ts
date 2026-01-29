import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Chapter 11: Plotting and More About Classes...\n");

  // ============================================
  // CHAPTER 11: Plotting and More About Classes
  // ============================================
  const chapter11 = await prisma.chapter.upsert({
    where: { number: 11 },
    update: {},
    create: {
      number: 11,
      title: "Plotting and More About Classes",
      description: "Master data visualization with matplotlib and deepen your understanding of object-oriented programming. Learn to create professional plots, work with class variables, static methods, and extend built-in types.",
      objectives: [
        "Create line plots, scatter plots, and bar charts using matplotlib",
        "Customize plot appearance with colors, labels, legends, and styles",
        "Work with multiple subplots and figure layouts",
        "Understand the difference between class and instance variables",
        "Use static methods and class methods effectively",
        "Subclass built-in types like list and dict to create custom data structures",
      ],
      isPublished: true,
    },
  });
  console.log(`✅ Chapter ${chapter11.number}: ${chapter11.title}`);

  // ============================================
  // SECTION 11.1: Plotting with Matplotlib
  // ============================================
  const section11_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter11.id, number: 11.1 } },
    update: {},
    create: {
      chapterId: chapter11.id,
      number: 11.1,
      title: "Plotting with Matplotlib",
      description: "Learn to create professional data visualizations using Python's matplotlib library, the foundation of scientific plotting in Python.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section11_1.number}: ${section11_1.title}`);

  // ----------------------------------------
  // LESSON 11.1.1: Introduction to Matplotlib
  // ----------------------------------------
  const lesson11_1_1 = await prisma.lesson.upsert({
    where: { slug: "introduction-to-matplotlib" },
    update: {},
    create: {
      sectionId: section11_1.id,
      number: 11.11,
      title: "Introduction to Matplotlib",
      slug: "introduction-to-matplotlib",
      objectives: [
        "Understand why data visualization is essential for data analysis",
        "Install and import matplotlib correctly",
        "Create your first simple line plot",
        "Understand the figure and axes model that matplotlib uses",
      ],
      content: `# Introduction to Matplotlib

Data visualization transforms raw numbers into visual stories. While our brains struggle to find patterns in tables of thousands of numbers, we excel at recognizing visual patterns in charts and graphs.

## Why Visualization Matters

Consider analyzing a dataset of 10,000 temperature readings over a year. Looking at raw numbers is overwhelming:
- Day 1: 45°F, Day 2: 47°F, Day 3: 44°F... 

But a line chart immediately reveals seasonal patterns, trends, and anomalies that would take hours to find in raw data.

## The Matplotlib Library

**Matplotlib** is Python's foundational plotting library, created by John Hunter in 2003 to bring MATLAB-style plotting to Python. It's:
- The most widely used Python plotting library
- Foundation for other libraries (Seaborn, Pandas plotting)
- Highly customizable for publication-quality figures
- Free and open source

## Importing Matplotlib

The standard convention is to import the pyplot module as \`plt\`:

\`\`\`python
import matplotlib.pyplot as plt
\`\`\`

The \`pyplot\` module provides a MATLAB-like interface that manages figures and axes automatically.

## Your First Plot

Creating a basic plot requires just a few lines:

\`\`\`python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]

plt.plot(x, y)
plt.show()
\`\`\`

This creates a simple line plot connecting the points (1,2), (2,4), (3,6), (4,8), (5,10).

## The Figure and Axes Model

Matplotlib uses a hierarchical structure:

- **Figure**: The entire window or page. Think of it as the canvas.
- **Axes**: An individual plot within the figure. A figure can contain multiple axes.
- **Axis**: The x-axis or y-axis of a plot (note: different from "axes"!)
- **Artist**: Everything visible on the figure (lines, text, labels, etc.)

\`\`\`python
# Explicit figure and axes creation
fig, ax = plt.subplots()
ax.plot(x, y)
plt.show()
\`\`\`

## Adding Labels and Titles

Always label your plots! A plot without labels is like a map without a legend:

\`\`\`python
plt.plot(x, y)
plt.xlabel('Time (seconds)')
plt.ylabel('Distance (meters)')
plt.title('Distance vs Time')
plt.show()
\`\`\`

Clear labels make your visualizations self-explanatory and professional.`,
      codeExamples: JSON.stringify([
        {
          id: "first-plot",
          title: "Your First Plot",
          code: `import matplotlib.pyplot as plt

# Data
x = [1, 2, 3, 4, 5]
y = [1, 4, 9, 16, 25]  # y = x squared

# Create the plot
plt.plot(x, y)

# Add labels and title
plt.xlabel('X Value')
plt.ylabel('X Squared')
plt.title('Square Numbers')

# Display the plot
plt.show()`,
          description: "A complete first plot with labels and title",
        },
        {
          id: "fig-ax-style",
          title: "Figure and Axes Style",
          code: `import matplotlib.pyplot as plt

# Create figure and axes explicitly
fig, ax = plt.subplots()

# Data
x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]

# Plot on the axes
ax.plot(x, y)

# Set labels using axes methods
ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_title('Using Figure and Axes')

plt.show()`,
          description: "The object-oriented approach to matplotlib",
        },
        {
          id: "multiple-lines",
          title: "Multiple Lines on One Plot",
          code: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y1 = [1, 2, 3, 4, 5]      # Linear
y2 = [1, 4, 9, 16, 25]    # Quadratic

# Plot both lines
plt.plot(x, y1, label='Linear')
plt.plot(x, y2, label='Quadratic')

# Add legend to identify lines
plt.legend()
plt.title('Linear vs Quadratic Growth')
plt.show()`,
          description: "Plotting multiple data series with a legend",
        },
      ]),
      keyPoints: [
        "Matplotlib is Python's foundational visualization library, used by scientists and analysts worldwide",
        "Import with: import matplotlib.pyplot as plt",
        "plt.plot(x, y) creates a line plot connecting points",
        "plt.show() displays the plot window",
        "Always add labels with xlabel(), ylabel(), and title()",
        "The figure contains axes, which contain the actual plots",
        "Use label parameter and plt.legend() to identify multiple lines",
      ],
      hardwareDemo: "Watch how matplotlib allocates memory arrays for your x and y data. See how the CPU transforms these data coordinates into pixel positions, then observe the GPU rendering the line by calculating which pixels to illuminate between each pair of points.",
      estimatedTime: 20,
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
        title: "Create Your First Plot",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a line plot showing the numbers 1-5 on the x-axis and their squares (1, 4, 9, 16, 25) on the y-axis. Add the title 'Square Numbers'.",
        starterCode: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = # TODO: Create list of squares [1, 4, 9, 16, 25]

# TODO: Create the plot using plt.plot()

# TODO: Add title 'Square Numbers'

plt.show()`,
        solution: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [1, 4, 9, 16, 25]

plt.plot(x, y)
plt.title('Square Numbers')

plt.show()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Plot displayed with title", description: "Creates a line plot of square numbers" },
        ]),
        hints: [
          "The squares of 1, 2, 3, 4, 5 are 1, 4, 9, 16, 25",
          "Use plt.plot(x, y) to create the line plot",
          "Use plt.title('Square Numbers') to add the title",
        ],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson11_1_1.id,
        number: 2,
        title: "Add Axis Labels",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add x-axis label 'Number' and y-axis label 'Square Value' to the square numbers plot from Exercise 1.",
        starterCode: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [1, 4, 9, 16, 25]

plt.plot(x, y)
plt.title('Square Numbers')

# TODO: Add x-axis label 'Number'

# TODO: Add y-axis label 'Square Value'

plt.show()`,
        solution: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [1, 4, 9, 16, 25]

plt.plot(x, y)
plt.title('Square Numbers')
plt.xlabel('Number')
plt.ylabel('Square Value')

plt.show()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Plot with labeled axes", description: "Both axes are properly labeled" },
        ]),
        hints: [
          "Use plt.xlabel('label text') for the x-axis",
          "Use plt.ylabel('label text') for the y-axis",
          "Labels are strings enclosed in quotes",
        ],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson11_1_1.id,
        number: 3,
        title: "Plot Multiple Lines with Legend",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Plot both linear (y=x) and quadratic (y=x²) functions on the same graph for x values 1-5. Add labels and a legend to distinguish them.",
        starterCode: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y_linear = [1, 2, 3, 4, 5]
y_quadratic = [1, 4, 9, 16, 25]

# TODO: Plot linear line with label='Linear'

# TODO: Plot quadratic line with label='Quadratic'

# TODO: Add legend

plt.title('Linear vs Quadratic')
plt.show()`,
        solution: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y_linear = [1, 2, 3, 4, 5]
y_quadratic = [1, 4, 9, 16, 25]

plt.plot(x, y_linear, label='Linear')
plt.plot(x, y_quadratic, label='Quadratic')
plt.legend()

plt.title('Linear vs Quadratic')
plt.show()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Two lines with legend", description: "Both functions plotted with legend" },
        ]),
        hints: [
          "Add label='name' parameter to each plt.plot() call",
          "Call plt.legend() to display the legend",
          "You can call plt.plot() multiple times to add multiple lines",
        ],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson11_1_1.id,
        number: 4,
        title: "Temperature Data Visualization",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Plot the following temperature data for a week. Days 1-7 on x-axis, temperatures [72, 75, 71, 73, 78, 80, 76] on y-axis. Add appropriate labels and title 'Weekly Temperature'.",
        starterCode: `import matplotlib.pyplot as plt

days = [1, 2, 3, 4, 5, 6, 7]
temps = [72, 75, 71, 73, 78, 80, 76]

# TODO: Create the plot

# TODO: Add xlabel 'Day'
# TODO: Add ylabel 'Temperature (°F)'
# TODO: Add title 'Weekly Temperature'

plt.show()`,
        solution: `import matplotlib.pyplot as plt

days = [1, 2, 3, 4, 5, 6, 7]
temps = [72, 75, 71, 73, 78, 80, 76]

plt.plot(days, temps)
plt.xlabel('Day')
plt.ylabel('Temperature (°F)')
plt.title('Weekly Temperature')

plt.show()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Temperature plot with labels", description: "Properly labeled temperature chart" },
        ]),
        hints: [
          "Use plt.plot(days, temps) to create the line",
          "Remember xlabel, ylabel, and title",
          "The degree symbol ° is optional but nice to include",
        ],
        xpReward: 15,
        order: 4,
      },
    ],
  });
  console.log(`      ✏️  4 exercises created`);

  // ----------------------------------------
  // LESSON 11.1.2: Line Plots and Styling
  // ----------------------------------------
  const lesson11_1_2 = await prisma.lesson.upsert({
    where: { slug: "line-plots-and-styling" },
    update: {},
    create: {
      sectionId: section11_1.id,
      number: 11.12,
      title: "Line Plots and Styling",
      slug: "line-plots-and-styling",
      objectives: [
        "Customize line colors using names, hex codes, and shortcuts",
        "Apply different line styles (solid, dashed, dotted)",
        "Add markers to data points",
        "Use format strings for quick styling",
        "Control line width and transparency",
      ],
      content: `# Line Plots and Styling

Plain plots work, but styled plots communicate better. Matplotlib offers extensive customization.

## Line Colors

Specify colors in multiple ways:

\`\`\`python
# Named colors
plt.plot(x, y, color='red')
plt.plot(x, y, color='steelblue')

# Hex codes (web colors)
plt.plot(x, y, color='#FF5733')

# RGB tuples (0-1 scale)
plt.plot(x, y, color=(0.2, 0.4, 0.6))

# Single-letter shortcuts
plt.plot(x, y, color='r')  # red
plt.plot(x, y, color='b')  # blue
plt.plot(x, y, color='g')  # green
plt.plot(x, y, color='k')  # black
\`\`\`

## Line Styles

Control how the line is drawn:

\`\`\`python
plt.plot(x, y, linestyle='-')    # solid (default)
plt.plot(x, y, linestyle='--')   # dashed
plt.plot(x, y, linestyle=':')    # dotted
plt.plot(x, y, linestyle='-.')   # dash-dot
\`\`\`

## Markers

Add symbols at each data point:

\`\`\`python
plt.plot(x, y, marker='o')   # circle
plt.plot(x, y, marker='s')   # square
plt.plot(x, y, marker='^')   # triangle up
plt.plot(x, y, marker='*')   # star
plt.plot(x, y, marker='x')   # x mark
plt.plot(x, y, marker='D')   # diamond
\`\`\`

## Format Strings (Quick Styling)

Combine color, marker, and linestyle in one short string:

\`\`\`python
plt.plot(x, y, 'ro-')    # red circles, solid line
plt.plot(x, y, 'bs--')   # blue squares, dashed line
plt.plot(x, y, 'g^:')    # green triangles, dotted line
plt.plot(x, y, 'k*-.')   # black stars, dash-dot line
\`\`\`

Format: \`'[color][marker][linestyle]'\`

## Line Width and Marker Size

\`\`\`python
plt.plot(x, y, linewidth=2)      # thicker line
plt.plot(x, y, markersize=10)    # larger markers

# Or use shorthand
plt.plot(x, y, lw=2, ms=10)
\`\`\`

## Transparency (Alpha)

\`\`\`python
plt.plot(x, y, alpha=0.5)  # 50% transparent
\`\`\`

Alpha ranges from 0 (invisible) to 1 (opaque). Useful for overlapping data.`,
      codeExamples: JSON.stringify([
        {
          id: "styled-line",
          title: "Fully Styled Line Plot",
          code: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]

plt.plot(x, y, 
         color='purple',
         linestyle='--',
         marker='o',
         linewidth=2,
         markersize=8)

plt.title('Styled Line Plot')
plt.show()`,
          description: "Line plot with custom color, style, markers, and sizes",
        },
        {
          id: "format-strings",
          title: "Format String Shortcuts",
          code: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]

# Three different styles using format strings
plt.plot(x, [i for i in x], 'r-o', label='Linear')
plt.plot(x, [i**2 for i in x], 'b--s', label='Quadratic')
plt.plot(x, [i**0.5 for i in x], 'g:^', label='Square Root')

plt.legend()
plt.title('Format String Styling')
plt.show()`,
          description: "Quick styling with format strings",
        },
        {
          id: "transparency",
          title: "Overlapping Lines with Transparency",
          code: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y1 = [1, 3, 2, 4, 3]
y2 = [2, 2, 3, 3, 4]

# Thick lines with transparency so both are visible
plt.plot(x, y1, 'b-', linewidth=8, alpha=0.5, label='Data A')
plt.plot(x, y2, 'r-', linewidth=8, alpha=0.5, label='Data B')

plt.legend()
plt.title('Overlapping Lines (50% Transparent)')
plt.show()`,
          description: "Using alpha for overlapping data",
        },
      ]),
      keyPoints: [
        "Colors: use names ('red'), shortcuts ('r'), hex ('#FF0000'), or RGB tuples",
        "Line styles: '-' solid, '--' dashed, ':' dotted, '-.' dash-dot",
        "Markers: 'o' circle, 's' square, '^' triangle, '*' star, 'x' x-mark",
        "Format strings combine all three: 'ro--' = red circles with dashed line",
        "linewidth (lw) controls thickness, markersize (ms) controls marker size",
        "alpha controls transparency (0=invisible, 1=solid)",
      ],
      hardwareDemo: "Observe how the CPU calculates pixel positions for each line segment using Bresenham's line algorithm, then watch as color values are blended with the alpha channel for transparency effects.",
      estimatedTime: 20,
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
        title: "Style a Line",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a blue dashed line with circle markers and linewidth of 2.",
        starterCode: `import matplotlib.pyplot as plt

x = [0, 1, 2, 3, 4, 5]
y = [0, 2, 4, 6, 8, 10]

# TODO: Plot with blue color, dashed line, circle markers, linewidth=2

plt.title('Styled Line')
plt.show()`,
        solution: `import matplotlib.pyplot as plt

x = [0, 1, 2, 3, 4, 5]
y = [0, 2, 4, 6, 8, 10]

plt.plot(x, y, color='blue', linestyle='--', marker='o', linewidth=2)

plt.title('Styled Line')
plt.show()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Blue dashed line with circles", description: "All styling applied" },
        ]),
        hints: [
          "Use color='blue' or color='b'",
          "Use linestyle='--' for dashed",
          "Use marker='o' for circles",
        ],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson11_1_2.id,
        number: 2,
        title: "Format String Challenge",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Using ONLY format strings (no separate parameters), create three lines: (1) red solid line with squares, (2) green dashed line with triangles, (3) blue dotted line with circles.",
        starterCode: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y1 = [1, 2, 3, 4, 5]
y2 = [2, 4, 6, 8, 10]
y3 = [5, 4, 3, 2, 1]

# TODO: Plot y1 with red solid squares (format string only)

# TODO: Plot y2 with green dashed triangles (format string only)

# TODO: Plot y3 with blue dotted circles (format string only)

plt.legend(['Red Squares', 'Green Triangles', 'Blue Circles'])
plt.show()`,
        solution: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y1 = [1, 2, 3, 4, 5]
y2 = [2, 4, 6, 8, 10]
y3 = [5, 4, 3, 2, 1]

plt.plot(x, y1, 'rs-')
plt.plot(x, y2, 'g^--')
plt.plot(x, y3, 'bo:')

plt.legend(['Red Squares', 'Green Triangles', 'Blue Circles'])
plt.show()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Three distinctly styled lines", description: "Format strings work correctly" },
        ]),
        hints: [
          "Format: '[color][marker][linestyle]'",
          "'s' for square, '^' for triangle, 'o' for circle",
          "'-' solid, '--' dashed, ':' dotted",
        ],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson11_1_2.id,
        number: 3,
        title: "Transparency Overlay",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Plot two overlapping thick lines (linewidth=10) with 50% transparency so both are visible where they cross.",
        starterCode: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y1 = [1, 3, 2, 4, 3]
y2 = [3, 2, 4, 2, 4]

# TODO: Plot y1 in blue with linewidth=10 and alpha=0.5

# TODO: Plot y2 in red with linewidth=10 and alpha=0.5

plt.title('Overlapping Lines')
plt.legend(['Line 1', 'Line 2'])
plt.show()`,
        solution: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y1 = [1, 3, 2, 4, 3]
y2 = [3, 2, 4, 2, 4]

plt.plot(x, y1, 'b-', linewidth=10, alpha=0.5, label='Line 1')
plt.plot(x, y2, 'r-', linewidth=10, alpha=0.5, label='Line 2')

plt.title('Overlapping Lines')
plt.legend()
plt.show()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Two semi-transparent thick lines", description: "Both lines visible at intersections" },
        ]),
        hints: [
          "alpha=0.5 means 50% transparent",
          "Use linewidth=10 for thick lines",
          "Both lines need the alpha parameter",
        ],
        xpReward: 15,
        order: 3,
      },
    ],
  });
  console.log(`      ✏️  3 exercises created`);

  // ----------------------------------------
  // LESSON 11.1.3: Scatter Plots
  // ----------------------------------------
  const lesson11_1_3 = await prisma.lesson.upsert({
    where: { slug: "scatter-plots" },
    update: {},
    create: {
      sectionId: section11_1.id,
      number: 11.13,
      title: "Scatter Plots",
      slug: "scatter-plots",
      objectives: [
        "Create scatter plots for discrete data points",
        "Use color to encode a third dimension of data",
        "Use point size to encode a fourth dimension",
        "Add colorbars to explain color mappings",
        "Create bubble charts for multi-dimensional data",
      ],
      content: `# Scatter Plots

Scatter plots display individual data points without connecting lines—perfect for showing relationships between variables or identifying patterns and clusters.

## When to Use Scatter vs Line

| Use Scatter | Use Line |
|-------------|----------|
| Independent data points | Continuous trend |
| Looking for correlation | Time series data |
| Each point is a measurement | Order matters |
| Showing distribution | Showing progression |

## Basic Scatter Plot

\`\`\`python
plt.scatter(x, y)
\`\`\`

Unlike \`plot()\`, scatter doesn't connect points—each point stands alone.

## Customizing Points

\`\`\`python
plt.scatter(x, y, 
            color='blue',      # Point color
            s=100,             # Point size
            marker='o',        # Point shape
            alpha=0.7)         # Transparency
\`\`\`

## Color-Coding Data (3rd Dimension)

Use the \`c\` parameter to map values to colors:

\`\`\`python
values = [10, 20, 30, 40, 50]
plt.scatter(x, y, c=values, cmap='viridis')
plt.colorbar()  # Shows the color scale
\`\`\`

This lets you visualize a third variable through color!

## Popular Colormaps

- \`'viridis'\` - Modern default, perceptually uniform (blue to yellow)
- \`'plasma'\` - Similar to viridis, more purple/orange
- \`'coolwarm'\` - Blue (cold) to red (warm), good for diverging data
- \`'RdYlGn'\` - Red to yellow to green
- \`'Blues'\` - Light to dark blue

## Size-Coding Data (4th Dimension)

The \`s\` parameter can accept a list of sizes:

\`\`\`python
sizes = [20, 50, 100, 200, 400]
plt.scatter(x, y, s=sizes)
\`\`\`

## Bubble Charts (4D Visualization)

Combine color AND size to show four dimensions:

\`\`\`python
plt.scatter(x, y, c=colors, s=sizes, cmap='viridis', alpha=0.6)
plt.colorbar()
\`\`\`

x, y = position; color = third variable; size = fourth variable!`,
      codeExamples: JSON.stringify([
        {
          id: "basic-scatter",
          title: "Basic Scatter Plot",
          code: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5, 6, 7, 8]
y = [2.1, 3.9, 6.2, 7.8, 10.1, 12.0, 13.8, 16.2]

plt.scatter(x, y)
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Basic Scatter Plot')
plt.show()`,
          description: "Simple scatter plot",
        },
        {
          id: "color-coded",
          title: "Color-Coded Scatter",
          code: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]
values = [10, 20, 30, 40, 50]  # Third variable

plt.scatter(x, y, c=values, cmap='viridis', s=100)
plt.colorbar(label='Value')
plt.title('Color Shows Third Dimension')
plt.show()`,
          description: "Using color to show a third variable",
        },
        {
          id: "bubble-chart",
          title: "Bubble Chart (4D Data)",
          code: `import matplotlib.pyplot as plt

# Company data
revenue = [50, 120, 80, 200, 150]    # x-axis
profit = [5, 25, 12, 45, 30]          # y-axis  
employees = [100, 400, 200, 800, 500]  # size
satisfaction = [3.2, 4.1, 3.8, 4.5, 4.0]  # color

plt.scatter(revenue, profit, 
            s=employees,          # Size = employees
            c=satisfaction,       # Color = satisfaction
            cmap='RdYlGn',        # Red to Green
            alpha=0.6,
            edgecolors='black')

plt.colorbar(label='Employee Satisfaction')
plt.xlabel('Revenue (millions)')
plt.ylabel('Profit (millions)')
plt.title('Company Comparison')
plt.show()`,
          description: "Four dimensions: x, y, size, and color",
        },
      ]),
      keyPoints: [
        "plt.scatter() creates point plots without connecting lines",
        "c parameter maps values to colors via a colormap",
        "s parameter sets point sizes (area in points²)",
        "plt.colorbar() shows the color scale legend",
        "Bubble charts combine c and s to visualize 4 dimensions",
        "Use alpha for overlapping points to see density",
        "Choose colormaps based on data type (sequential vs diverging)",
      ],
      hardwareDemo: "Watch how scatter renders each point individually. See the colormap lookup table in memory mapping data values to RGB colors, and observe how point sizes affect the number of pixels filled.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
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
        title: "Study Hours vs Test Score",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a scatter plot showing the relationship between study hours and test scores. Add appropriate labels and title.",
        starterCode: `import matplotlib.pyplot as plt

hours = [1, 2, 3, 4, 5, 6, 7, 8]
scores = [52, 58, 65, 70, 74, 80, 85, 90]

# TODO: Create scatter plot

# TODO: Add xlabel 'Study Hours'
# TODO: Add ylabel 'Test Score'
# TODO: Add title 'Study Hours vs Test Score'

plt.show()`,
        solution: `import matplotlib.pyplot as plt

hours = [1, 2, 3, 4, 5, 6, 7, 8]
scores = [52, 58, 65, 70, 74, 80, 85, 90]

plt.scatter(hours, scores)
plt.xlabel('Study Hours')
plt.ylabel('Test Score')
plt.title('Study Hours vs Test Score')

plt.show()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Labeled scatter plot", description: "Shows positive correlation" },
        ]),
        hints: [
          "Use plt.scatter(x, y) not plt.plot()",
          "xlabel, ylabel, and title work the same as with line plots",
          "The data shows a positive correlation",
        ],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson11_1_3.id,
        number: 2,
        title: "Color-Coded Grades",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a scatter plot where point color represents the student's grade (A=4, B=3, C=2). Use the 'RdYlGn' colormap and add a colorbar.",
        starterCode: `import matplotlib.pyplot as plt

hours = [2, 4, 3, 6, 5, 7, 4, 8]
scores = [65, 75, 70, 88, 82, 95, 78, 98]
grades = [2, 3, 2, 4, 3, 4, 3, 4]  # C=2, B=3, A=4

# TODO: Create scatter with c=grades, cmap='RdYlGn', s=100

# TODO: Add colorbar with label='Grade'

plt.xlabel('Hours Studied')
plt.ylabel('Test Score')
plt.title('Student Performance')
plt.show()`,
        solution: `import matplotlib.pyplot as plt

hours = [2, 4, 3, 6, 5, 7, 4, 8]
scores = [65, 75, 70, 88, 82, 95, 78, 98]
grades = [2, 3, 2, 4, 3, 4, 3, 4]

plt.scatter(hours, scores, c=grades, cmap='RdYlGn', s=100)
plt.colorbar(label='Grade')

plt.xlabel('Hours Studied')
plt.ylabel('Test Score')
plt.title('Student Performance')
plt.show()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Color-coded scatter with colorbar", description: "Grades shown as colors" },
        ]),
        hints: [
          "c=grades sets the color values",
          "cmap='RdYlGn' creates a red-yellow-green gradient",
          "plt.colorbar(label='Grade') adds the color legend",
        ],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson11_1_3.id,
        number: 3,
        title: "Company Bubble Chart",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a bubble chart showing companies where x=revenue, y=profit, size=employees, and color=customer satisfaction score.",
        starterCode: `import matplotlib.pyplot as plt

revenue = [50, 120, 80, 200, 150]
profit = [5, 25, 12, 45, 30]
employees = [100, 400, 200, 800, 500]
satisfaction = [3.2, 4.1, 3.8, 4.5, 4.0]

# TODO: Create scatter with s=employees, c=satisfaction, cmap='coolwarm', alpha=0.6

# TODO: Add colorbar labeled 'Satisfaction'

plt.xlabel('Revenue (millions)')
plt.ylabel('Profit (millions)')
plt.title('Company Comparison')
plt.show()`,
        solution: `import matplotlib.pyplot as plt

revenue = [50, 120, 80, 200, 150]
profit = [5, 25, 12, 45, 30]
employees = [100, 400, 200, 800, 500]
satisfaction = [3.2, 4.1, 3.8, 4.5, 4.0]

plt.scatter(revenue, profit, s=employees, c=satisfaction, cmap='coolwarm', alpha=0.6)
plt.colorbar(label='Satisfaction')

plt.xlabel('Revenue (millions)')
plt.ylabel('Profit (millions)')
plt.title('Company Comparison')
plt.show()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Bubble chart with 4 dimensions", description: "Size and color vary correctly" },
        ]),
        hints: [
          "s=employees sets point sizes",
          "c=satisfaction sets point colors",
          "alpha=0.6 adds transparency for overlapping bubbles",
        ],
        xpReward: 20,
        order: 3,
      },
    ],
  });
  console.log(`      ✏️  3 exercises created`);

  // ----------------------------------------
  // LESSON 11.1.4: Bar Charts
  // ----------------------------------------
  const lesson11_1_4 = await prisma.lesson.upsert({
    where: { slug: "bar-charts" },
    update: {},
    create: {
      sectionId: section11_1.id,
      number: 11.14,
      title: "Bar Charts",
      slug: "bar-charts",
      objectives: [
        "Create vertical and horizontal bar charts",
        "Customize bar colors, edges, and widths",
        "Create grouped bar charts for comparisons",
        "Create stacked bar charts for part-to-whole relationships",
        "Add value labels to bars",
      ],
      content: `# Bar Charts

Bar charts compare quantities across categories. They're essential for showing discrete comparisons.

## Basic Bar Chart

\`\`\`python
categories = ['A', 'B', 'C', 'D']
values = [25, 40, 30, 55]

plt.bar(categories, values)
\`\`\`

## Horizontal Bars

Use \`barh()\` when category names are long:

\`\`\`python
plt.barh(categories, values)
\`\`\`

## Customizing Bars

\`\`\`python
plt.bar(categories, values,
        color='steelblue',     # Fill color
        edgecolor='black',     # Border color
        width=0.6,             # Bar width (0-1)
        alpha=0.8)             # Transparency
\`\`\`

## Grouped Bar Charts

For comparing multiple series side by side:

\`\`\`python
import numpy as np

x = np.arange(len(categories))  # [0, 1, 2, 3]
width = 0.35

plt.bar(x - width/2, values1, width, label='Group 1')
plt.bar(x + width/2, values2, width, label='Group 2')
plt.xticks(x, categories)
plt.legend()
\`\`\`

## Stacked Bar Charts

Show parts of a whole:

\`\`\`python
plt.bar(categories, values1, label='Bottom')
plt.bar(categories, values2, bottom=values1, label='Top')
plt.legend()
\`\`\`

The \`bottom\` parameter stacks the second bars on top of the first.

## Adding Value Labels

\`\`\`python
bars = plt.bar(categories, values)
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2, height,
             f'{height}',
             ha='center', va='bottom')
\`\`\`

This adds the value above each bar.`,
      codeExamples: JSON.stringify([
        {
          id: "basic-bar",
          title: "Basic Bar Chart",
          code: `import matplotlib.pyplot as plt

languages = ['Python', 'JavaScript', 'Java', 'C++']
popularity = [30, 25, 20, 15]

plt.bar(languages, popularity, color='steelblue', edgecolor='black')
plt.ylabel('Popularity %')
plt.title('Programming Language Popularity')
plt.show()`,
          description: "Simple vertical bar chart",
        },
        {
          id: "grouped-bars",
          title: "Grouped Bar Chart",
          code: `import matplotlib.pyplot as plt
import numpy as np

categories = ['Q1', 'Q2', 'Q3', 'Q4']
sales_2023 = [100, 120, 140, 130]
sales_2024 = [110, 130, 160, 155]

x = np.arange(len(categories))
width = 0.35

plt.bar(x - width/2, sales_2023, width, label='2023', color='skyblue')
plt.bar(x + width/2, sales_2024, width, label='2024', color='coral')

plt.xticks(x, categories)
plt.ylabel('Sales ($K)')
plt.title('Quarterly Sales Comparison')
plt.legend()
plt.show()`,
          description: "Comparing two data series",
        },
        {
          id: "stacked-bars",
          title: "Stacked Bar Chart",
          code: `import matplotlib.pyplot as plt

classes = ['Class A', 'Class B', 'Class C']
passed = [25, 30, 28]
failed = [5, 3, 7]

plt.bar(classes, passed, label='Passed', color='green')
plt.bar(classes, failed, bottom=passed, label='Failed', color='red')

plt.ylabel('Number of Students')
plt.title('Pass/Fail by Class')
plt.legend()
plt.show()`,
          description: "Stacking bars to show composition",
        },
      ]),
      keyPoints: [
        "plt.bar() creates vertical bars, plt.barh() creates horizontal bars",
        "Categories go first, then values",
        "width parameter controls bar thickness (default 0.8)",
        "Use numpy arange for precise positioning in grouped bars",
        "bottom parameter stacks bars on top of previous bars",
        "Always add labels and legends for clarity",
        "Horizontal bars are better for long category names",
      ],
      hardwareDemo: "Watch memory allocation for bar coordinates. See how the renderer fills rectangular regions by iterating through pixel rows, applying color and edge rendering separately.",
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
        title: "Fruit Inventory",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a bar chart showing fruit quantities: Apples=30, Bananas=45, Oranges=25, Grapes=40.",
        starterCode: `import matplotlib.pyplot as plt

fruits = ['Apples', 'Bananas', 'Oranges', 'Grapes']
quantities = [30, 45, 25, 40]

# TODO: Create bar chart

# TODO: Add ylabel 'Quantity'
# TODO: Add title 'Fruit Inventory'

plt.show()`,
        solution: `import matplotlib.pyplot as plt

fruits = ['Apples', 'Bananas', 'Oranges', 'Grapes']
quantities = [30, 45, 25, 40]

plt.bar(fruits, quantities)
plt.ylabel('Quantity')
plt.title('Fruit Inventory')

plt.show()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Bar chart with 4 bars", description: "All fruits shown" },
        ]),
        hints: [
          "plt.bar(categories, values)",
          "fruits is the x-axis (categories)",
          "quantities is the y-axis (values)",
        ],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson11_1_4.id,
        number: 2,
        title: "Styled Horizontal Bars",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a horizontal bar chart with coral color and black edges for the item scores.",
        starterCode: `import matplotlib.pyplot as plt

items = ['Item A', 'Item B', 'Item C', 'Item D']
scores = [85, 92, 78, 88]

# TODO: Create horizontal bar chart with color='coral', edgecolor='black'

plt.xlabel('Score')
plt.title('Item Scores')
plt.show()`,
        solution: `import matplotlib.pyplot as plt

items = ['Item A', 'Item B', 'Item C', 'Item D']
scores = [85, 92, 78, 88]

plt.barh(items, scores, color='coral', edgecolor='black')

plt.xlabel('Score')
plt.title('Item Scores')
plt.show()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Horizontal coral bars with black edges", description: "Styling applied" },
        ]),
        hints: [
          "Use plt.barh() for horizontal bars",
          "color='coral' sets the fill color",
          "edgecolor='black' sets the border color",
        ],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson11_1_4.id,
        number: 3,
        title: "Stacked Pass/Fail Chart",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a stacked bar chart showing passed and failed students per class. Passed should be green on the bottom, failed should be red on top.",
        starterCode: `import matplotlib.pyplot as plt

classes = ['Class A', 'Class B', 'Class C']
passed = [25, 30, 28]
failed = [5, 3, 7]

# TODO: Create bar chart with passed on bottom (green)

# TODO: Stack failed on top using bottom parameter (red)

# TODO: Add legend

plt.ylabel('Students')
plt.title('Pass/Fail by Class')
plt.show()`,
        solution: `import matplotlib.pyplot as plt

classes = ['Class A', 'Class B', 'Class C']
passed = [25, 30, 28]
failed = [5, 3, 7]

plt.bar(classes, passed, label='Passed', color='green')
plt.bar(classes, failed, bottom=passed, label='Failed', color='red')

plt.legend()

plt.ylabel('Students')
plt.title('Pass/Fail by Class')
plt.show()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Stacked bar chart", description: "Failed stacked on passed" },
        ]),
        hints: [
          "Plot passed first (no bottom parameter)",
          "Use bottom=passed for the failed bars",
          "Add label to each bar for the legend",
        ],
        xpReward: 20,
        order: 3,
      },
    ],
  });
  console.log(`      ✏️  3 exercises created`);

  // ----------------------------------------
  // LESSON 11.1.5: Subplots and Figure Layout
  // ----------------------------------------
  const lesson11_1_5 = await prisma.lesson.upsert({
    where: { slug: "subplots-and-layout" },
    update: {},
    create: {
      sectionId: section11_1.id,
      number: 11.15,
      title: "Subplots and Figure Layout",
      slug: "subplots-and-layout",
      objectives: [
        "Create multiple subplots in a single figure",
        "Use plt.subplots() to create grid layouts",
        "Share axes between subplots for comparison",
        "Adjust figure size and spacing",
        "Add overall figure titles",
      ],
      content: `# Subplots and Figure Layout

Often you need multiple visualizations in one figure for comparison or to tell a complete story.

## Creating Subplots

\`\`\`python
fig, axes = plt.subplots(nrows=2, ncols=2)  # 2×2 grid
\`\`\`

This returns:
- \`fig\`: The overall figure
- \`axes\`: A 2D array of Axes objects

## Accessing Individual Subplots

\`\`\`python
axes[0, 0].plot(x, y1)  # Top-left
axes[0, 1].plot(x, y2)  # Top-right
axes[1, 0].plot(x, y3)  # Bottom-left
axes[1, 1].plot(x, y4)  # Bottom-right
\`\`\`

For a single row or column, axes is 1D:

\`\`\`python
fig, axes = plt.subplots(1, 3)  # 1 row, 3 columns
axes[0].plot(...)  # First plot
axes[1].plot(...)  # Second plot
axes[2].plot(...)  # Third plot
\`\`\`

## Sharing Axes

For easy comparison, share axis scales:

\`\`\`python
fig, axes = plt.subplots(2, 2, sharex=True, sharey=True)
\`\`\`

Now all plots have the same x and y ranges.

## Figure Size

\`\`\`python
fig, axes = plt.subplots(2, 2, figsize=(12, 8))  # width, height in inches
\`\`\`

## Preventing Overlap

\`\`\`python
plt.tight_layout()  # Auto-adjust spacing
\`\`\`

Always call this before \`show()\`!

## Main Figure Title

\`\`\`python
fig.suptitle('Main Title', fontsize=14)
\`\`\`

This adds a title above all subplots.

## Setting Subplot Titles and Labels

Use the axes methods:

\`\`\`python
axes[0, 0].set_title('Subplot 1')
axes[0, 0].set_xlabel('X')
axes[0, 0].set_ylabel('Y')
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "2x2-grid",
          title: "2×2 Subplot Grid",
          code: `import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(10, 8))

x = [1, 2, 3, 4, 5]

# Top-left: Linear
axes[0, 0].plot(x, x, 'b-o')
axes[0, 0].set_title('Linear')

# Top-right: Quadratic
axes[0, 1].plot(x, [i**2 for i in x], 'r-s')
axes[0, 1].set_title('Quadratic')

# Bottom-left: Cubic
axes[1, 0].plot(x, [i**3 for i in x], 'g-^')
axes[1, 0].set_title('Cubic')

# Bottom-right: Square Root
axes[1, 1].plot(x, [i**0.5 for i in x], 'm-d')
axes[1, 1].set_title('Square Root')

fig.suptitle('Function Comparison', fontsize=14)
plt.tight_layout()
plt.show()`,
          description: "Four function plots in a grid",
        },
        {
          id: "shared-axes",
          title: "Shared Axes for Comparison",
          code: `import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, sharey=True, figsize=(10, 4))

months = ['Jan', 'Feb', 'Mar', 'Apr']
sales_2023 = [100, 120, 140, 130]
sales_2024 = [110, 130, 160, 155]

ax1.bar(months, sales_2023, color='skyblue')
ax1.set_title('2023 Sales')
ax1.set_ylabel('Sales ($K)')

ax2.bar(months, sales_2024, color='coral')
ax2.set_title('2024 Sales')

fig.suptitle('Sales Comparison')
plt.tight_layout()
plt.show()`,
          description: "Side-by-side comparison with shared y-axis",
        },
        {
          id: "dashboard",
          title: "Dashboard Layout",
          code: `import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

data = [10, 25, 15, 30, 20]
categories = ['A', 'B', 'C', 'D', 'E']

# Line plot
axes[0].plot(categories, data, 'b-o')
axes[0].set_title('Trend')

# Bar chart
axes[1].bar(categories, data, color='green')
axes[1].set_title('Comparison')

# Scatter plot
axes[2].scatter(range(5), data, s=100, c='red')
axes[2].set_title('Distribution')

fig.suptitle('Data Dashboard', fontsize=14)
plt.tight_layout()
plt.show()`,
          description: "Three different plot types in one figure",
        },
      ]),
      keyPoints: [
        "plt.subplots(rows, cols) creates a grid of plots",
        "Access subplots with axes[row, col] indexing",
        "sharex/sharey synchronize axis scales across subplots",
        "figsize=(width, height) sets figure dimensions in inches",
        "plt.tight_layout() prevents labels from overlapping",
        "fig.suptitle() adds a main title above all subplots",
        "Use ax.set_title(), ax.set_xlabel(), ax.set_ylabel() for subplot labels",
      ],
      hardwareDemo: "See how each subplot gets its own viewport region in GPU memory. Watch independent coordinate transformations calculated for each axes, allowing different scales while maintaining visual alignment.",
      estimatedTime: 25,
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
        title: "2×2 Function Grid",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a 2×2 grid showing linear, quadratic, cubic, and square root functions for x = 1 to 5.",
        starterCode: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]

# TODO: Create 2x2 subplot grid with figsize=(10, 8)

# TODO: Plot linear (y=x) in top-left with title 'Linear'

# TODO: Plot quadratic (y=x²) in top-right with title 'Quadratic'

# TODO: Plot cubic (y=x³) in bottom-left with title 'Cubic'

# TODO: Plot square root in bottom-right with title 'Square Root'

plt.tight_layout()
plt.show()`,
        solution: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]

fig, axes = plt.subplots(2, 2, figsize=(10, 8))

axes[0, 0].plot(x, x)
axes[0, 0].set_title('Linear')

axes[0, 1].plot(x, [i**2 for i in x])
axes[0, 1].set_title('Quadratic')

axes[1, 0].plot(x, [i**3 for i in x])
axes[1, 0].set_title('Cubic')

axes[1, 1].plot(x, [i**0.5 for i in x])
axes[1, 1].set_title('Square Root')

plt.tight_layout()
plt.show()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Four plots in grid", description: "All functions displayed" },
        ]),
        hints: [
          "fig, axes = plt.subplots(2, 2, figsize=(10, 8))",
          "Access plots with axes[row, col]",
          "Use ax.set_title() for each subplot title",
        ],
        xpReward: 20,
        order: 1,
      },
      {
        lessonId: lesson11_1_5.id,
        number: 2,
        title: "Sales Comparison Dashboard",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create side-by-side bar charts comparing 2023 and 2024 sales with shared y-axis. Add a main title 'Sales Comparison'.",
        starterCode: `import matplotlib.pyplot as plt

months = ['Jan', 'Feb', 'Mar', 'Apr']
sales_2023 = [100, 120, 140, 130]
sales_2024 = [110, 130, 160, 155]

# TODO: Create 1x2 subplots with sharey=True

# TODO: Plot 2023 sales as bar chart on first subplot

# TODO: Plot 2024 sales as bar chart on second subplot

# TODO: Add main title 'Sales Comparison'

plt.tight_layout()
plt.show()`,
        solution: `import matplotlib.pyplot as plt

months = ['Jan', 'Feb', 'Mar', 'Apr']
sales_2023 = [100, 120, 140, 130]
sales_2024 = [110, 130, 160, 155]

fig, (ax1, ax2) = plt.subplots(1, 2, sharey=True, figsize=(10, 4))

ax1.bar(months, sales_2023)
ax1.set_title('2023')
ax1.set_ylabel('Sales ($K)')

ax2.bar(months, sales_2024)
ax2.set_title('2024')

fig.suptitle('Sales Comparison')

plt.tight_layout()
plt.show()`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Two bar charts with shared y-axis", description: "Easy visual comparison" },
        ]),
        hints: [
          "sharey=True makes both plots use the same y scale",
          "Unpack axes directly: fig, (ax1, ax2) = ...",
          "fig.suptitle() adds the main title",
        ],
        xpReward: 20,
        order: 2,
      },
    ],
  });
  console.log(`      ✏️  2 exercises created`);

  // ============================================
  // SECTION 11.2: More About Classes
  // ============================================
  const section11_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter11.id, number: 11.2 } },
    update: {},
    create: {
      chapterId: chapter11.id,
      number: 11.2,
      title: "More About Classes",
      description: "Advanced object-oriented programming concepts including class variables, static methods, class methods, and subclassing built-in types.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section11_2.number}: ${section11_2.title}`);

  // ----------------------------------------
  // LESSON 11.2.1: Class Variables vs Instance Variables
  // ----------------------------------------
  const lesson11_2_1 = await prisma.lesson.upsert({
    where: { slug: "class-vs-instance-variables" },
    update: {},
    create: {
      sectionId: section11_2.id,
      number: 11.21,
      title: "Class Variables vs Instance Variables",
      slug: "class-vs-instance-variables",
      objectives: [
        "Understand the difference between class and instance variables",
        "Know when to use each type appropriately",
        "Avoid common pitfalls with mutable class variables",
        "Access class variables correctly from instances and the class",
      ],
      content: `# Class Variables vs Instance Variables

Understanding the difference between class and instance variables is crucial for effective object-oriented programming.

## Instance Variables

Defined in \`__init__\`, unique to each object:

\`\`\`python
class Dog:
    def __init__(self, name, age):
        self.name = name  # Instance variable
        self.age = age    # Instance variable
\`\`\`

Each dog has its own name and age. Changing one dog's name doesn't affect others.

## Class Variables

Defined in the class body, **shared by all instances**:

\`\`\`python
class Dog:
    species = 'Canis familiaris'  # Class variable - same for ALL dogs
    
    def __init__(self, name):
        self.name = name  # Instance variable - unique per dog
\`\`\`

## Key Differences

| Aspect | Class Variable | Instance Variable |
|--------|----------------|-------------------|
| Where defined | Class body (outside methods) | Inside \`__init__\` |
| Scope | Shared by all instances | Unique to each instance |
| Access | \`ClassName.var\` or \`self.var\` | \`self.var\` only |
| Memory | One copy total | One copy per instance |
| Use case | Constants, counters, defaults | Object-specific data |

## Accessing Class Variables

\`\`\`python
# Preferred: Access via class name
Dog.species

# Also works: Access via instance
fido = Dog('Fido')
fido.species  # Works, but less clear

# Most explicit
self.__class__.species
\`\`\`

## DANGER: Mutable Class Variables

**Never use mutable objects (lists, dicts) as class variables!**

\`\`\`python
class Student:
    grades = []  # DANGER! Shared by ALL students!
    
    def add_grade(self, grade):
        self.grades.append(grade)  # Affects EVERY student!

# This bug is subtle and causes confusion
alice = Student()
bob = Student()
alice.add_grade(90)
print(bob.grades)  # [90] - Bob has Alice's grade!
\`\`\`

## Correct Pattern

\`\`\`python
class Student:
    def __init__(self):
        self.grades = []  # Instance variable - each student has own list
\`\`\`

## Common Use: Instance Counter

\`\`\`python
class Employee:
    count = 0  # Class variable - tracks all employees
    
    def __init__(self, name):
        self.name = name  # Instance variable
        Employee.count += 1  # Increment class variable
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "class-var-demo",
          title: "Class Variable for Shared Data",
          code: `class Circle:
    pi = 3.14159  # Class variable - same for all circles
    
    def __init__(self, radius):
        self.radius = radius  # Instance variable - unique per circle
    
    def area(self):
        return Circle.pi * self.radius ** 2

# Both circles share pi, but have different radii
c1 = Circle(5)
c2 = Circle(10)

print(f"Circle 1 area: {c1.area():.2f}")  # 78.54
print(f"Circle 2 area: {c2.area():.2f}")  # 314.16
print(f"Pi value: {Circle.pi}")            # 3.14159`,
          description: "Using class variable for a constant shared by all instances",
        },
        {
          id: "instance-counter",
          title: "Counting Instances",
          code: `class User:
    total_users = 0  # Class variable to count users
    
    def __init__(self, username):
        self.username = username  # Instance variable
        User.total_users += 1     # Increment class variable
    
    @classmethod
    def get_total(cls):
        return cls.total_users

# Create users
u1 = User('alice')
u2 = User('bob')
u3 = User('charlie')

print(f"Total users created: {User.get_total()}")  # 3`,
          description: "Class variable as an instance counter",
        },
        {
          id: "mutable-danger",
          title: "The Mutable Class Variable Bug",
          code: `# WRONG - Shared mutable class variable
class BadStudent:
    grades = []  # Shared by all!
    
    def add_grade(self, grade):
        self.grades.append(grade)

# RIGHT - Instance variable  
class GoodStudent:
    def __init__(self):
        self.grades = []  # Each student has own list
    
    def add_grade(self, grade):
        self.grades.append(grade)

# Demo the bug
bad1 = BadStudent()
bad2 = BadStudent()
bad1.add_grade(90)
print(f"bad2's grades: {bad2.grades}")  # [90] - Bug!

# Demo the fix
good1 = GoodStudent()
good2 = GoodStudent()
good1.add_grade(90)
print(f"good2's grades: {good2.grades}")  # [] - Correct!`,
          description: "Demonstrating the mutable class variable bug and fix",
        },
      ]),
      keyPoints: [
        "Instance variables: unique per object, defined in __init__ with self.var",
        "Class variables: shared by all instances, defined in class body",
        "Access class variables via ClassName.var (preferred) or self.var",
        "NEVER use mutable objects (lists, dicts) as class variables",
        "Use class variables for constants or counters",
        "Modifying self.class_var creates an instance variable that shadows the class variable",
      ],
      hardwareDemo: "Visualize memory layout showing the class variable stored once in the class object, while instance variables are duplicated in each instance's memory block. Watch the single class variable being accessed from multiple instances.",
      estimatedTime: 25,
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
        title: "Car with Class Variable",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a Car class with a class variable wheels=4 and instance variables make and model.",
        starterCode: `class Car:
    # TODO: Add class variable wheels = 4
    
    def __init__(self, make, model):
        # TODO: Set instance variables make and model
        pass

# Test
car1 = Car('Toyota', 'Camry')
car2 = Car('Honda', 'Civic')

print(f"Wheels: {Car.wheels}")        # Should print 4
print(f"Car 1: {car1.make} {car1.model}")  # Toyota Camry
print(f"Car 2: {car2.make} {car2.model}")  # Honda Civic`,
        solution: `class Car:
    wheels = 4
    
    def __init__(self, make, model):
        self.make = make
        self.model = model

car1 = Car('Toyota', 'Camry')
car2 = Car('Honda', 'Civic')

print(f"Wheels: {Car.wheels}")
print(f"Car 1: {car1.make} {car1.model}")
print(f"Car 2: {car2.make} {car2.model}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "4, Toyota Camry, Honda Civic", description: "Class and instance variables work" },
        ]),
        hints: [
          "Class variable: define directly in class body (not in __init__)",
          "Instance variables: use self.var = value in __init__",
          "Access class variable with ClassName.var",
        ],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson11_2_1.id,
        number: 2,
        title: "Product Counter",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a Product class that tracks how many products have been created using a class variable.",
        starterCode: `class Product:
    # TODO: Class variable to count products (start at 0)
    
    def __init__(self, name, price):
        # TODO: Set instance variables name and price
        # TODO: Increment the product count
        pass
    
    @classmethod
    def get_count(cls):
        # TODO: Return the total count
        pass

# Test
p1 = Product('Laptop', 999)
p2 = Product('Phone', 699)
p3 = Product('Tablet', 499)

print(f"Products created: {Product.get_count()}")  # Should print 3`,
        solution: `class Product:
    count = 0
    
    def __init__(self, name, price):
        self.name = name
        self.price = price
        Product.count += 1
    
    @classmethod
    def get_count(cls):
        return cls.count

p1 = Product('Laptop', 999)
p2 = Product('Phone', 699)
p3 = Product('Tablet', 499)

print(f"Products created: {Product.get_count()}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "3", description: "Counter increments correctly" },
        ]),
        hints: [
          "Initialize count = 0 as class variable",
          "Use Product.count += 1 in __init__ to increment",
          "classmethod receives cls, use cls.count to access",
        ],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson11_2_1.id,
        number: 3,
        title: "Fix the Mutable Bug",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "The Student class has a bug where all students share the same grades list. Fix it so each student has their own grades.",
        starterCode: `# BUG: All students share the same grades list!
class Student:
    grades = []  # This is the bug!
    
    def __init__(self, name):
        self.name = name
    
    def add_grade(self, grade):
        self.grades.append(grade)

# TODO: Fix the class above

# Test - each student should have their own grades
s1 = Student('Alice')
s2 = Student('Bob')

s1.add_grade(90)
s2.add_grade(85)

print(f"Alice's grades: {s1.grades}")  # Should be [90]
print(f"Bob's grades: {s2.grades}")    # Should be [85]`,
        solution: `class Student:
    def __init__(self, name):
        self.name = name
        self.grades = []  # Now each student has their own list
    
    def add_grade(self, grade):
        self.grades.append(grade)

s1 = Student('Alice')
s2 = Student('Bob')

s1.add_grade(90)
s2.add_grade(85)

print(f"Alice's grades: {s1.grades}")
print(f"Bob's grades: {s2.grades}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "[90]\\n[85]", description: "Each student has own grades" },
        ]),
        hints: [
          "Move grades = [] from class body into __init__",
          "Use self.grades = [] in __init__",
          "Now each instance creates its own empty list",
        ],
        xpReward: 20,
        order: 3,
      },
    ],
  });
  console.log(`      ✏️  3 exercises created`);

  // ----------------------------------------
  // LESSON 11.2.2: Static and Class Methods
  // ----------------------------------------
  const lesson11_2_2 = await prisma.lesson.upsert({
    where: { slug: "static-and-class-methods" },
    update: {},
    create: {
      sectionId: section11_2.id,
      number: 11.22,
      title: "Static Methods and Class Methods",
      slug: "static-and-class-methods",
      objectives: [
        "Understand when and how to use @staticmethod",
        "Understand when and how to use @classmethod",
        "Know the differences between instance, class, and static methods",
        "Create factory methods using @classmethod",
      ],
      content: `# Static Methods and Class Methods

Python provides special method types beyond regular instance methods.

## Three Types of Methods

| Type | Decorator | First Argument | Access To |
|------|-----------|----------------|-----------|
| Instance | None | \`self\` | Instance + class |
| Class | \`@classmethod\` | \`cls\` | Class only |
| Static | \`@staticmethod\` | None | Neither |

## Instance Methods (Normal)

\`\`\`python
def method(self):
    # Has access to self (the instance) and self.__class__
    return self.some_attribute
\`\`\`

## Static Methods

No access to instance or class. Just a function that lives in the class namespace:

\`\`\`python
class Math:
    @staticmethod
    def add(a, b):
        return a + b

# Call without creating instance
result = Math.add(5, 3)  # 8
\`\`\`

Use static methods for utility functions logically related to the class.

## Class Methods

Receives the class as first argument (\`cls\`), not the instance:

\`\`\`python
class Pizza:
    def __init__(self, toppings):
        self.toppings = toppings
    
    @classmethod
    def margherita(cls):
        return cls(['mozzarella', 'tomato', 'basil'])
\`\`\`

## Factory Methods

Class methods are perfect for alternative constructors:

\`\`\`python
class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day
    
    @classmethod
    def from_string(cls, date_string):
        year, month, day = map(int, date_string.split('-'))
        return cls(year, month, day)
    
    @classmethod
    def today(cls):
        import datetime
        t = datetime.date.today()
        return cls(t.year, t.month, t.day)

# Multiple ways to create a Date
d1 = Date(2024, 12, 25)              # Normal constructor
d2 = Date.from_string('2024-12-25')  # Factory from string
d3 = Date.today()                     # Factory for today
\`\`\`

## Why Use \`cls\` Instead of the Class Name?

Using \`cls\` supports inheritance properly:

\`\`\`python
class Animal:
    @classmethod
    def create(cls):
        return cls()  # Creates instance of whatever class called it

class Dog(Animal):
    pass

dog = Dog.create()  # Creates a Dog, not an Animal!
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "static-utility",
          title: "Static Methods for Utilities",
          code: `class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius
    
    @staticmethod
    def celsius_to_fahrenheit(c):
        return c * 9/5 + 32
    
    @staticmethod
    def fahrenheit_to_celsius(f):
        return (f - 32) * 5/9
    
    def to_fahrenheit(self):
        return self.celsius_to_fahrenheit(self.celsius)

# Static methods work without an instance
print(Temperature.celsius_to_fahrenheit(100))  # 212.0
print(Temperature.fahrenheit_to_celsius(32))   # 0.0

# Also work on instances
t = Temperature(25)
print(t.to_fahrenheit())  # 77.0`,
          description: "Static methods for conversion utilities",
        },
        {
          id: "factory-methods",
          title: "Factory Methods with @classmethod",
          code: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    @classmethod
    def from_birth_year(cls, name, birth_year):
        age = 2024 - birth_year
        return cls(name, age)
    
    @classmethod
    def create_anonymous(cls):
        return cls('Anonymous', 0)
    
    def __str__(self):
        return f"{self.name}, age {self.age}"

# Different ways to create Person objects
p1 = Person('Alice', 30)                    # Direct
p2 = Person.from_birth_year('Bob', 1990)    # From birth year
p3 = Person.create_anonymous()              # Anonymous

print(p1)  # Alice, age 30
print(p2)  # Bob, age 34
print(p3)  # Anonymous, age 0`,
          description: "Multiple factory methods for different creation patterns",
        },
      ]),
      keyPoints: [
        "@staticmethod: no self/cls parameter, just a utility function in class namespace",
        "@classmethod: receives cls, can access and modify class state",
        "Use static methods for utilities that don't need instance or class data",
        "Use class methods for factory methods that create instances",
        "Factory methods return cls(...) to properly support subclasses",
        "Call both with ClassName.method() or instance.method()",
      ],
      hardwareDemo: "Compare method dispatch: see how instance methods look up self in the stack frame, class methods resolve cls at call time from the class object, and static methods skip both lookups entirely.",
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
        title: "Static Validator",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Add a static method is_valid_email that checks if a string contains '@'. Use it in __init__ to validate.",
        starterCode: `class User:
    def __init__(self, email):
        if not User.is_valid_email(email):
            raise ValueError("Invalid email")
        self.email = email
    
    @staticmethod
    def is_valid_email(email):
        # TODO: Return True if '@' in email, False otherwise
        pass

# Test
print(User.is_valid_email('test@example.com'))  # True
print(User.is_valid_email('invalid'))            # False`,
        solution: `class User:
    def __init__(self, email):
        if not User.is_valid_email(email):
            raise ValueError("Invalid email")
        self.email = email
    
    @staticmethod
    def is_valid_email(email):
        return '@' in email

print(User.is_valid_email('test@example.com'))
print(User.is_valid_email('invalid'))`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "True\\nFalse", description: "Validates email correctly" },
        ]),
        hints: [
          "@staticmethod goes above the method definition",
          "No self parameter in static methods",
          "Use 'in' operator to check for '@'",
        ],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson11_2_2.id,
        number: 2,
        title: "Rectangle Factory",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a Rectangle class with a class method square(side) that creates a square (equal width and height).",
        starterCode: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    @classmethod
    def square(cls, side):
        # TODO: Return a Rectangle with equal width and height
        pass
    
    def area(self):
        return self.width * self.height

# Test
rect = Rectangle(4, 5)
sq = Rectangle.square(4)

print(f"Rectangle area: {rect.area()}")  # 20
print(f"Square area: {sq.area()}")        # 16`,
        solution: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    @classmethod
    def square(cls, side):
        return cls(side, side)
    
    def area(self):
        return self.width * self.height

rect = Rectangle(4, 5)
sq = Rectangle.square(4)

print(f"Rectangle area: {rect.area()}")
print(f"Square area: {sq.area()}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "20\\n16", description: "Square factory works" },
        ]),
        hints: [
          "@classmethod receives cls as first parameter",
          "Return cls(side, side) to create a square",
          "cls refers to the class (Rectangle)",
        ],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson11_2_2.id,
        number: 3,
        title: "Book with Multiple Factories",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a Book class with factory methods from_dict and from_tuple to create books from different data formats.",
        starterCode: `class Book:
    def __init__(self, title, author, year):
        self.title = title
        self.author = author
        self.year = year
    
    @classmethod
    def from_dict(cls, data):
        # TODO: Create from {'title': ..., 'author': ..., 'year': ...}
        pass
    
    @classmethod
    def from_tuple(cls, data):
        # TODO: Create from (title, author, year) tuple
        pass
    
    def __str__(self):
        return f"'{self.title}' by {self.author} ({self.year})"

# Test
b1 = Book.from_dict({'title': '1984', 'author': 'Orwell', 'year': 1949})
b2 = Book.from_tuple(('Dune', 'Herbert', 1965))

print(b1)  # '1984' by Orwell (1949)
print(b2)  # 'Dune' by Herbert (1965)`,
        solution: `class Book:
    def __init__(self, title, author, year):
        self.title = title
        self.author = author
        self.year = year
    
    @classmethod
    def from_dict(cls, data):
        return cls(data['title'], data['author'], data['year'])
    
    @classmethod
    def from_tuple(cls, data):
        return cls(data[0], data[1], data[2])
    
    def __str__(self):
        return f"'{self.title}' by {self.author} ({self.year})"

b1 = Book.from_dict({'title': '1984', 'author': 'Orwell', 'year': 1949})
b2 = Book.from_tuple(('Dune', 'Herbert', 1965))

print(b1)
print(b2)`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "'1984' by Orwell (1949)\\n'Dune' by Herbert (1965)", description: "Both factories work" },
        ]),
        hints: [
          "from_dict: access data['key'] for dict values",
          "from_tuple: access data[index] for tuple values",
          "Both return cls(title, author, year)",
        ],
        xpReward: 20,
        order: 3,
      },
    ],
  });
  console.log(`      ✏️  3 exercises created`);

  // ----------------------------------------
  // LESSON 11.2.3: Subclassing Built-in Types
  // ----------------------------------------
  const lesson11_2_3 = await prisma.lesson.upsert({
    where: { slug: "subclassing-builtin-types" },
    update: {},
    create: {
      sectionId: section11_2.id,
      number: 11.23,
      title: "Subclassing Built-in Types",
      slug: "subclassing-builtin-types",
      objectives: [
        "Extend built-in types like list and dict",
        "Override methods to add custom behavior",
        "Understand when subclassing is appropriate vs composition",
        "Use super() correctly with built-in types",
      ],
      content: `# Subclassing Built-in Types

Python allows you to subclass built-in types to create specialized versions with custom behavior.

## Why Subclass Built-ins?

- Add validation (only positive numbers)
- Add behavior (logging, counting)
- Enforce constraints (max size)
- Customize key handling (case-insensitive dict)

## Extending list

\`\`\`python
class PositiveList(list):
    """A list that only accepts positive numbers."""
    
    def append(self, value):
        if value <= 0:
            raise ValueError("Only positive numbers allowed")
        super().append(value)
\`\`\`

## Methods to Override for list

- \`append(value)\` - Add single item
- \`extend(iterable)\` - Add multiple items
- \`insert(index, value)\` - Insert at position
- \`__setitem__(index, value)\` - Handle \`lst[i] = v\`
- \`__init__(iterable)\` - Initialize from iterable

## Extending dict

\`\`\`python
class CaseInsensitiveDict(dict):
    """Dictionary with case-insensitive string keys."""
    
    def __setitem__(self, key, value):
        super().__setitem__(key.lower(), value)
    
    def __getitem__(self, key):
        return super().__getitem__(key.lower())
\`\`\`

## The __missing__ Method

Special dict method called when a key is not found:

\`\`\`python
class DefaultDict(dict):
    def __init__(self, default_factory):
        super().__init__()
        self.default_factory = default_factory
    
    def __missing__(self, key):
        value = self.default_factory()
        self[key] = value
        return value

counts = DefaultDict(int)  # int() returns 0
counts['a'] += 1  # Auto-creates counts['a'] = 0, then adds 1
\`\`\`

## When to Subclass vs Compose

| Subclass When | Compose When |
|---------------|--------------|
| Need "is-a" relationship | Need "has-a" relationship |
| Want all inherited methods | Want controlled interface |
| Simple behavior override | Complex internal state |
| Polymorphism needed | Encapsulation needed |`,
      codeExamples: JSON.stringify([
        {
          id: "typed-list",
          title: "TypedList - Enforcing Types",
          code: `class TypedList(list):
    """A list that enforces a single type."""
    
    def __init__(self, item_type, initial=None):
        super().__init__()
        self.item_type = item_type
        if initial:
            for item in initial:
                self.append(item)  # Uses our append with validation
    
    def _validate(self, value):
        if not isinstance(value, self.item_type):
            raise TypeError(f"Expected {self.item_type.__name__}, got {type(value).__name__}")
    
    def append(self, value):
        self._validate(value)
        super().append(value)
    
    def extend(self, values):
        for v in values:
            self.append(v)  # Validates each item

# Usage
int_list = TypedList(int, [1, 2, 3])
int_list.append(4)       # OK
# int_list.append("5")   # TypeError!
print(int_list)  # [1, 2, 3, 4]`,
          description: "A list that only accepts items of a specific type",
        },
        {
          id: "counter-dict",
          title: "Auto-Initializing Counter Dict",
          code: `class CounterDict(dict):
    """Dict that auto-initializes missing keys to 0."""
    
    def __missing__(self, key):
        self[key] = 0
        return 0

# Usage - no KeyError!
counter = CounterDict()
counter['apples'] += 1
counter['apples'] += 2
counter['bananas'] += 1

print(dict(counter))  # {'apples': 3, 'bananas': 1}`,
          description: "Dictionary with automatic zero initialization",
        },
        {
          id: "bounded-list",
          title: "BoundedList - Maximum Size",
          code: `class BoundedList(list):
    """A list with a maximum capacity."""
    
    def __init__(self, max_size, initial=None):
        super().__init__()
        self.max_size = max_size
        if initial:
            for item in initial[:max_size]:  # Only take up to max
                super().append(item)
    
    def append(self, value):
        if len(self) >= self.max_size:
            raise ValueError(f"List is at max capacity ({self.max_size})")
        super().append(valuecd ~/projects/visual-python-learning && cat >> prisma/seed-chapter11.ts << 'ENDOFFILE'
)
    
    def extend(self, values):
        for v in values:
            self.append(v)

# Usage
history = BoundedList(3)
history.append('page1')
history.append('page2')
history.append('page3')
# history.append('page4')  # ValueError: List is at max capacity

print(history)  # ['page1', 'page2', 'page3']`,
          description: "A list that enforces a maximum size",
        },
      ]),
      keyPoints: [
        "Subclass built-ins to add validation, logging, or constraints",
        "Override append(), extend(), __setitem__() for lists",
        "Override __getitem__(), __setitem__(), __missing__() for dicts",
        "Always call super().method() to use parent behavior",
        "__missing__ is called when dict key doesn't exist",
        "Consider composition as an alternative to inheritance",
        "Validate in all methods that add/modify data",
      ],
      hardwareDemo: "Watch the method resolution order (MRO) in action as Python looks up methods in your subclass first, then the built-in parent. See super() traverse the MRO to find the parent implementation.",
      estimatedTime: 30,
      difficulty: "ADVANCED",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson11_2_3.number}: ${lesson11_2_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson11_2_3.id,
        number: 1,
        title: "PositiveList",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a PositiveList that only accepts positive numbers (> 0). Override append() to validate.",
        starterCode: `class PositiveList(list):
    def append(self, value):
        # TODO: Raise ValueError if value <= 0
        # TODO: Call super().append(value) if valid
        pass

# Test
pl = PositiveList()
pl.append(5)
pl.append(10)
print(pl)  # [5, 10]

# This should raise ValueError
try:
    pl.append(-3)
except ValueError as e:
    print(f"Error: {e}")`,
        solution: `class PositiveList(list):
    def append(self, value):
        if value <= 0:
            raise ValueError("Only positive numbers allowed")
        super().append(value)

pl = PositiveList()
pl.append(5)
pl.append(10)
print(pl)

try:
    pl.append(-3)
except ValueError as e:
    print(f"Error: {e}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "[5, 10]\\nError: Only positive numbers allowed", description: "Validates and rejects negative" },
        ]),
        hints: [
          "Check if value <= 0 first",
          "raise ValueError('message') to reject",
          "super().append(value) to add valid items",
        ],
        xpReward: 20,
        order: 1,
      },
      {
        lessonId: lesson11_2_3.id,
        number: 2,
        title: "CaseInsensitiveDict",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a dict subclass where string keys are case-insensitive (converted to lowercase).",
        starterCode: `class CaseInsensitiveDict(dict):
    def __setitem__(self, key, value):
        # TODO: Convert key to lowercase, then call super().__setitem__
        pass
    
    def __getitem__(self, key):
        # TODO: Convert key to lowercase, then call super().__getitem__
        pass

# Test
d = CaseInsensitiveDict()
d['Name'] = 'Alice'
d['AGE'] = 30

print(d['name'])   # Alice
print(d['age'])    # 30
print(d['NAME'])   # Alice`,
        solution: `class CaseInsensitiveDict(dict):
    def __setitem__(self, key, value):
        super().__setitem__(key.lower(), value)
    
    def __getitem__(self, key):
        return super().__getitem__(key.lower())

d = CaseInsensitiveDict()
d['Name'] = 'Alice'
d['AGE'] = 30

print(d['name'])
print(d['age'])
print(d['NAME'])`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Alice\\n30\\nAlice", description: "Keys are case-insensitive" },
        ]),
        hints: [
          "key.lower() converts to lowercase",
          "__setitem__ handles d[key] = value",
          "__getitem__ handles d[key] lookups",
        ],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson11_2_3.id,
        number: 3,
        title: "DefaultDict with __missing__",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a CounterDict that automatically initializes missing keys to 0 using __missing__.",
        starterCode: `class CounterDict(dict):
    def __missing__(self, key):
        # TODO: Set self[key] = 0
        # TODO: Return 0
        pass

# Test - no KeyError when accessing missing keys!
counts = CounterDict()
counts['a'] += 1
counts['a'] += 1
counts['b'] += 1

print(counts['a'])  # 2
print(counts['b'])  # 1
print(counts['c'])  # 0 (auto-created)`,
        solution: `class CounterDict(dict):
    def __missing__(self, key):
        self[key] = 0
        return 0

counts = CounterDict()
counts['a'] += 1
counts['a'] += 1
counts['b'] += 1

print(counts['a'])
print(counts['b'])
print(counts['c'])`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "2\\n1\\n0", description: "Auto-initializes missing keys" },
        ]),
        hints: [
          "__missing__ is called when key doesn't exist",
          "Set self[key] = 0 to store the default",
          "Return the default value (0)",
        ],
        xpReward: 25,
        order: 3,
      },
    ],
  });
  console.log(`      ✏️  3 exercises created`);

  // ============================================
  // SUMMARY
  // ============================================
  const lessonCount = await prisma.lesson.count({
    where: { section: { chapter: { number: 11 } } },
  });
  const exerciseCount = await prisma.exercise.count({
    where: { lesson: { section: { chapter: { number: 11 } } } },
  });

  console.log(`\n✅ Chapter 11 seeding complete!`);
  console.log(`   📚 1 chapter`);
  console.log(`   📂 2 sections`);
  console.log(`   📝 ${lessonCount} lessons`);
  console.log(`   ✏️  ${exerciseCount} exercises`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
