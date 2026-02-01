import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧠 Seeding Chapter 28: Deep Learning...\n");

  const chapter28 = await prisma.chapter.upsert({
    where: { number: 28 },
    update: {},
    create: {
      number: 28,
      title: "Deep Learning",
      description: "Explore deep learning architectures: CNNs for images, RNNs for sequences, and modern innovations like ResNets and Transformers.",
      objectives: [
        "Understand what makes learning 'deep'",
        "Learn CNN architecture for image processing",
        "Understand RNNs for sequential data",
        "Explore modern architectures",
      ],
      imageUrl: "/images/chapters/ch28-deep-learning.png",
      isPublished: true,
    },
  });

  console.log("✅ Created Chapter 28:", chapter28.title);

  const section28_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter28.id, number: 28.1 } },
    update: {},
    create: {
      chapterId: chapter28.id,
      number: 28.1,
      title: "Introduction to Deep Learning",
      description: "What makes neural networks 'deep'",
      order: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "introduction-to-deep-learning" },
    update: {},
    create: {
      sectionId: section28_1.id,
      number: 28.11,
      title: "Introduction to Deep Learning",
      slug: "introduction-to-deep-learning",
      objectives: [
        "Understand what makes networks 'deep'",
        "Learn the history of deep learning",
        "Know what enabled the deep learning revolution",
      ],
      content: `# Introduction to Deep Learning

**Deep Learning** = neural networks with many layers.

## The Journey

| Year | Model | Layers | Breakthrough |
|------|-------|--------|--------------|
| 1958 | Perceptron | 1 | First neural network |
| 1986 | MLP | 2-3 | Backpropagation |
| 2012 | AlexNet | 8 | ImageNet winner |
| 2015 | ResNet | 152 | Skip connections |
| 2017 | Transformer | 96 | Attention mechanism |

## What Enabled Deep Learning?

1. **GPUs** - Parallel computation
2. **Big Data** - Millions of training examples
3. **Better Activations** - ReLU solved vanishing gradients
4. **Skip Connections** - Train very deep networks

## Why Depth Matters

Deeper networks learn **hierarchical features**:
- Layer 1: Edges, colors
- Layer 2: Textures, patterns
- Layer 3: Parts, shapes
- Layer N: Objects, concepts`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Deep = many layers (typically 10+)",
        "Depth enables hierarchical feature learning",
        "GPUs + Big Data + ReLU enabled revolution",
      ],
      estimatedTime: 12,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });

  const section28_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter28.id, number: 28.2 } },
    update: {},
    create: {
      chapterId: chapter28.id,
      number: 28.2,
      title: "Convolutional Neural Networks",
      description: "Networks designed for image processing",
      order: 2,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "convolutional-neural-networks" },
    update: {},
    create: {
      sectionId: section28_2.id,
      number: 28.21,
      title: "Convolutional Neural Networks",
      slug: "convolutional-neural-networks",
      objectives: [
        "Understand CNN architecture",
        "Learn what each layer type does",
        "Know why CNNs work for images",
      ],
      content: `# Convolutional Neural Networks (CNNs)

CNNs are designed specifically for **image data**.

## Architecture

Input → [Conv → ReLU → Pool]×N → Flatten → FC → Output

## Layer Types

| Layer | Purpose | Output |
|-------|---------|--------|
| **Convolution** | Detect features | Feature maps |
| **Pooling** | Downsample | Smaller feature maps |
| **Flatten** | Reshape to 1D | Vector |
| **Fully Connected** | Classification | Predictions |

## Why CNNs Work

1. **Local connectivity** - Focus on small regions
2. **Weight sharing** - Same filter everywhere
3. **Translation invariance** - Detect features anywhere
4. **Hierarchical learning** - Edges → Textures → Objects`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Conv layers detect features with learned filters",
        "Pooling reduces size while keeping information",
        "CNNs learn hierarchical representations",
      ],
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "convolution-operation" },
    update: {},
    create: {
      sectionId: section28_2.id,
      number: 28.22,
      title: "The Convolution Operation",
      slug: "convolution-operation",
      objectives: [
        "Understand how convolution works",
        "Learn about kernels/filters",
        "Compute convolution by hand",
      ],
      content: `# The Convolution Operation

Convolution slides a small **kernel** over the input, computing element-wise products.

## The Process

1. Place kernel at position (i, j)
2. Multiply overlapping elements
3. Sum all products → output[i, j]
4. Slide and repeat

## Common Kernels

**Edge Detection:**
\`\`\`
[-1, -1, -1]
[-1,  8, -1]
[-1, -1, -1]
\`\`\`

**Blur (Average):**
\`\`\`
[1/9, 1/9, 1/9]
[1/9, 1/9, 1/9]
[1/9, 1/9, 1/9]
\`\`\`

## Output Size

output_size = (input_size - kernel_size) / stride + 1

For 5×5 input with 3×3 kernel, stride 1:
(5 - 3) / 1 + 1 = 3×3 output`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Convolution = slide kernel, multiply, sum",
        "Different kernels detect different features",
        "Networks LEARN the best kernels",
      ],
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "pooling-layers" },
    update: {},
    create: {
      sectionId: section28_2.id,
      number: 28.23,
      title: "Pooling Layers",
      slug: "pooling-layers",
      objectives: [
        "Understand pooling operations",
        "Compare max vs average pooling",
        "Know why pooling is useful",
      ],
      content: `# Pooling Layers

Pooling **downsamples** feature maps while preserving important information.

## Max Pooling

Takes the **maximum** value in each region.
- Keeps strongest activations
- Provides some translation invariance
- Most common choice

## Average Pooling

Takes the **average** of values in each region.
- Smoother downsampling
- Sometimes used at end of network

## Benefits

1. **Reduces computation** - Smaller feature maps
2. **Translation invariance** - Small shifts don't matter
3. **Prevents overfitting** - Fewer parameters

## Typical Setup

- 2×2 pooling with stride 2
- Reduces each dimension by half
- Applied after conv + activation`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Max pooling keeps strongest features",
        "Average pooling smooths features",
        "Pooling reduces size by ~half",
      ],
      estimatedTime: 10,
      difficulty: "BEGINNER",
      order: 4,
      isPublished: true,
    },
  });

  const section28_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter28.id, number: 28.3 } },
    update: {},
    create: {
      chapterId: chapter28.id,
      number: 28.3,
      title: "Sequence Models & Modern Architectures",
      description: "RNNs, Transformers, and beyond",
      order: 3,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "recurrent-neural-networks" },
    update: {},
    create: {
      sectionId: section28_3.id,
      number: 28.31,
      title: "Recurrent Neural Networks",
      slug: "recurrent-neural-networks",
      objectives: [
        "Understand RNN architecture",
        "Learn about hidden state",
        "Know RNN variants (LSTM, GRU)",
      ],
      content: `# Recurrent Neural Networks (RNNs)

RNNs process **sequences** by maintaining a **hidden state**.

## The Core Idea

h_t = tanh(W_x · x_t + W_h · h_{t-1} + b)

The hidden state h carries information from previous steps.

## Processing a Sequence

"HELLO" → H → E → L → L → O
          ↓   ↓   ↓   ↓   ↓
          h₁→ h₂→ h₃→ h₄→ h₅

## Variants

| Model | Innovation | Benefit |
|-------|------------|---------|
| RNN | Basic recurrence | Simple |
| LSTM | Gates (forget, input, output) | Long-term memory |
| GRU | Simplified gates | Fewer parameters |

## Applications

- Text generation
- Machine translation
- Speech recognition
- Time series prediction`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "RNNs maintain hidden state across time steps",
        "LSTM/GRU solve vanishing gradient problem",
        "Great for text, audio, time series",
      ],
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 5,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "modern-architectures" },
    update: {},
    create: {
      sectionId: section28_3.id,
      number: 28.32,
      title: "Modern Architectures",
      slug: "modern-architectures",
      objectives: [
        "Learn about ResNets and skip connections",
        "Understand Transformer architecture",
        "Know about GANs and U-Net",
      ],
      content: `# Modern Architectures

## ResNet (2015)

**Innovation:** Skip connections
**Key Idea:** y = F(x) + x

Skip connections allow training very deep networks (152+ layers) by providing gradient highways.

## Transformer (2017)

**Innovation:** Self-attention
**Key Idea:** Attend to all positions in parallel

Powers GPT, BERT, and most modern NLP. Now used for vision (ViT) too!

## U-Net (2015)

**Innovation:** Encoder-decoder with skip connections
**Use:** Image segmentation, diffusion models

## GAN (2014)

**Innovation:** Adversarial training
**Key Idea:** Generator vs Discriminator

Generator creates fakes, Discriminator detects them. Both improve through competition.

## Timeline

2012: AlexNet → 2014: GAN → 2015: ResNet → 2017: Transformer → 2020: ViT → 2022: Diffusion`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Skip connections enable very deep networks",
        "Attention allows parallel sequence processing",
        "GANs learn through adversarial competition",
      ],
      estimatedTime: 18,
      difficulty: "ADVANCED",
      order: 6,
      isPublished: true,
    },
  });

  const lessonCount = await prisma.lesson.count({ where: { section: { chapterId: chapter28.id } } });
  
  console.log("\n📊 Chapter 28 Summary:");
  console.log(`   Sections: 3`);
  console.log(`   Lessons: ${lessonCount}`);
  console.log("\n✅ Chapter 28 seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
