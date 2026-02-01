import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧠 Seeding Chapter 26: Perceptrons & Linear Models...\n");

  const chapter26 = await prisma.chapter.upsert({
    where: { number: 26 },
    update: {},
    create: {
      number: 26,
      title: "Perceptrons & Linear Models",
      description: "The building blocks of neural networks. Learn how perceptrons work, the perceptron learning algorithm, activation functions, and why single-layer networks have limitations.",
      objectives: [
        "Understand the perceptron as the simplest neural network",
        "Learn how the perceptron learning algorithm works",
        "Explore different activation functions",
        "Understand why XOR cannot be solved by single-layer networks",
      ],
      imageUrl: "/images/chapters/ch26-perceptrons.png",
      isPublished: true,
    },
  });

  console.log("✅ Created Chapter 26:", chapter26.title);

  const section26_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter26.id, number: 26.1 } },
    update: {},
    create: {
      chapterId: chapter26.id,
      number: 26.1,
      title: "The Perceptron",
      description: "Understanding the fundamental building block of neural networks",
      order: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "what-is-a-perceptron" },
    update: {},
    create: {
      sectionId: section26_1.id,
      number: 26.11,
      title: "What is a Perceptron?",
      slug: "what-is-a-perceptron",
      objectives: [
        "Understand the perceptron architecture",
        "Learn about weights, bias, and activation",
        "Compute perceptron output by hand",
      ],
      content: `# What is a Perceptron?

The **perceptron** is the simplest neural network - a single artificial neuron that can make binary decisions.

> "The perceptron is a simplified model of a biological neuron."
> — Frank Rosenblatt, 1958

## The Architecture

\`\`\`
Inputs     Weights     Sum        Activation    Output
  x₁ ───── w₁ ─────┐
                    ├──→ Σ + b ──→ f(z) ──→ ŷ
  x₂ ───── w₂ ─────┘
\`\`\`

## The Math

**Step 1: Weighted Sum**
\`\`\`
z = x₁w₁ + x₂w₂ + ... + xₙwₙ + b
z = Σ(xᵢ × wᵢ) + b
\`\`\`

**Step 2: Activation Function**
\`\`\`
ŷ = f(z)

Original perceptron used step function:
f(z) = 1 if z ≥ 0, else 0
\`\`\`

## Example: AND Gate

\`\`\`python
weights = [1, 1]
bias = -1.5

def perceptron(x1, x2):
    z = x1 * weights[0] + x2 * weights[1] + bias
    return 1 if z >= 0 else 0

print(perceptron(0, 0))  # 0
print(perceptron(0, 1))  # 0
print(perceptron(1, 0))  # 0
print(perceptron(1, 1))  # 1
\`\`\`

## Key Components

| Component | Symbol | Role |
|-----------|--------|------|
| **Inputs** | xᵢ | Features/data |
| **Weights** | wᵢ | Learned importance |
| **Bias** | b | Shifts decision boundary |
| **Activation** | f(z) | Introduces non-linearity |`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Perceptron = weighted sum + bias + activation",
        "Weights determine input importance",
        "Bias shifts the decision threshold",
        "Original activation was step function",
      ],
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "linear-decision-boundaries" },
    update: {},
    create: {
      sectionId: section26_1.id,
      number: 26.12,
      title: "Linear Decision Boundaries",
      slug: "linear-decision-boundaries",
      objectives: [
        "Understand what a decision boundary is",
        "Visualize how weights and bias shape the boundary",
        "Recognize linearly separable data",
      ],
      content: `# Linear Decision Boundaries

A perceptron creates a **line** (2D) or **hyperplane** (nD) that divides the input space into two regions.

## The Decision Boundary Equation

The boundary is where z = 0:
\`\`\`
w₁x₁ + w₂x₂ + b = 0
\`\`\`

This is a line with slope -w₁/w₂ and intercept -b/w₂.

## What Makes Data Linearly Separable?

Data is **linearly separable** if a single line can perfectly separate the classes.

**Linearly Separable:** AND, OR gates ✓
**NOT Linearly Separable:** XOR gate ✗`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Decision boundary is where w·x + b = 0",
        "Weights control the slope/orientation",
        "Bias shifts the boundary",
        "Only works for linearly separable data",
      ],
      estimatedTime: 12,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "perceptron-learning-algorithm" },
    update: {},
    create: {
      sectionId: section26_1.id,
      number: 26.13,
      title: "Perceptron Learning Algorithm",
      slug: "perceptron-learning-algorithm",
      objectives: [
        "Understand the perceptron learning rule",
        "Implement training from scratch",
        "Know the convergence theorem",
      ],
      content: `# Perceptron Learning Algorithm

The perceptron learns by **adjusting weights when it makes mistakes**.

## The Learning Rule

\`\`\`
For each training example (x, y):
    1. Compute prediction: ŷ = sign(w·x + b)
    2. If ŷ ≠ y (mistake):
       w = w + α × (y - ŷ) × x
       b = b + α × (y - ŷ)
\`\`\`

Where α is the **learning rate**.

## Convergence Theorem

**If the data is linearly separable, the perceptron learning algorithm is guaranteed to converge in a finite number of steps.**

This was proven by Novikoff in 1962.`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Update weights only on mistakes",
        "w_new = w_old + α × error × x",
        "Guaranteed to converge if linearly separable",
        "Learning rate controls update magnitude",
      ],
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });

  const section26_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter26.id, number: 26.2 } },
    update: {},
    create: {
      chapterId: chapter26.id,
      number: 26.2,
      title: "Activation Functions",
      description: "Non-linear transformations that give neural networks their power",
      order: 2,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "activation-functions" },
    update: {},
    create: {
      sectionId: section26_2.id,
      number: 26.21,
      title: "Activation Functions",
      slug: "activation-functions",
      objectives: [
        "Understand why activation functions are needed",
        "Compare step, sigmoid, tanh, and ReLU",
        "Choose appropriate activations",
      ],
      content: `# Activation Functions

Activation functions introduce **non-linearity** into neural networks.

## Why Non-Linearity?

Without activation: f(g(x)) = Wx (still linear!)
With activation: f(σ(g(x))) = non-linear!

## Common Activation Functions

| Function | Formula | Range | Use |
|----------|---------|-------|-----|
| Step | 1 if x≥0 | {0,1} | Original perceptron |
| Sigmoid | 1/(1+e⁻ˣ) | (0,1) | Probabilities |
| Tanh | tanh(x) | (-1,1) | Zero-centered |
| ReLU | max(0,x) | [0,∞) | Hidden layers |
| Leaky ReLU | x if x>0, 0.01x | (-∞,∞) | Fixes dying ReLU |

## When to Use What

- **Hidden layers:** ReLU (default)
- **Binary output:** Sigmoid
- **Multi-class output:** Softmax`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Activations add non-linearity (essential!)",
        "ReLU is the default for hidden layers",
        "Sigmoid/Softmax for classification outputs",
        "Vanishing gradients = slow learning",
      ],
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 4,
      isPublished: true,
    },
  });

  const section26_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter26.id, number: 26.3 } },
    update: {},
    create: {
      chapterId: chapter26.id,
      number: 26.3,
      title: "Limitations & Solutions",
      description: "The XOR problem and the birth of multi-layer networks",
      order: 3,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "xor-problem" },
    update: {},
    create: {
      sectionId: section26_3.id,
      number: 26.31,
      title: "The XOR Problem",
      slug: "xor-problem",
      objectives: [
        "Understand why XOR is not linearly separable",
        "Know the historical significance",
        "See why multi-layer networks are needed",
      ],
      content: `# The XOR Problem

In 1969, Minsky and Papert proved that single-layer perceptrons **cannot solve XOR**. This caused the first "AI Winter".

## XOR Truth Table

| x₁ | x₂ | XOR |
|----|----|----|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

## Why It's Impossible

No single line can separate the 0s from 1s - they're on opposite corners!

## The Solution

XOR = AND(OR(x₁, x₂), NAND(x₁, x₂))

By adding a **hidden layer**, we can compute intermediate features that make XOR solvable!`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "XOR is NOT linearly separable",
        "No single line can divide correctly",
        "This caused the first AI Winter",
        "Solution: Add hidden layers",
      ],
      estimatedTime: 12,
      difficulty: "INTERMEDIATE",
      order: 5,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "multi-layer-perceptrons" },
    update: {},
    create: {
      sectionId: section26_3.id,
      number: 26.32,
      title: "Multi-Layer Perceptrons (MLPs)",
      slug: "multi-layer-perceptrons",
      objectives: [
        "Understand MLP architecture",
        "See how hidden layers solve XOR",
        "Know the Universal Approximation Theorem",
      ],
      content: `# Multi-Layer Perceptrons (MLPs)

By adding **hidden layers**, we can solve XOR and much more!

## Solving XOR with 2 Hidden Neurons

Hidden Neuron 1: OR(x₁, x₂)
Hidden Neuron 2: NAND(x₁, x₂)
Output Neuron: AND(h₁, h₂)

| x₁ | x₂ | h₁(OR) | h₂(NAND) | Output(AND) |
|----|----|----|----|----|
| 0 | 0 | 0 | 1 | 0 |
| 0 | 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 1 | 0 | 0 |

XOR solved! ✓

## Universal Approximation Theorem

> "A feedforward network with a single hidden layer can approximate any continuous function."

MLPs are **universal function approximators**!`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Hidden layers create intermediate features",
        "XOR = AND(OR, NAND)",
        "Universal Approximation: MLPs can learn any function",
        "Training requires backpropagation",
      ],
      estimatedTime: 18,
      difficulty: "INTERMEDIATE",
      order: 6,
      isPublished: true,
    },
  });

  const lessonCount = await prisma.lesson.count({ where: { section: { chapterId: chapter26.id } } });
  
  console.log("\n📊 Chapter 26 Summary:");
  console.log(`   Sections: 3`);
  console.log(`   Lessons: ${lessonCount}`);
  console.log("\n✅ Chapter 26 seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
