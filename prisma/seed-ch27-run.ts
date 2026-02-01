import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧠 Seeding Chapter 27: Neural Networks & Backpropagation...\n");

  const chapter27 = await prisma.chapter.upsert({
    where: { number: 27 },
    update: {},
    create: {
      number: 27,
      title: "Neural Networks & Backpropagation",
      description: "Deep dive into how neural networks learn. Understand forward propagation, loss functions, backpropagation, and gradient flow through deep networks.",
      objectives: [
        "Understand neural network architecture",
        "Learn forward propagation computations",
        "Master backpropagation and the chain rule",
        "Recognize gradient flow problems",
      ],
      imageUrl: "/images/chapters/ch27-neural-networks.png",
      isPublished: true,
    },
  });

  console.log("✅ Created Chapter 27:", chapter27.title);

  const section27_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter27.id, number: 27.1 } },
    update: {},
    create: {
      chapterId: chapter27.id,
      number: 27.1,
      title: "Network Fundamentals",
      description: "Building blocks of neural networks",
      order: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "neural-network-architecture" },
    update: {},
    create: {
      sectionId: section27_1.id,
      number: 27.11,
      title: "Neural Network Architecture",
      slug: "neural-network-architecture",
      objectives: [
        "Understand layers, neurons, and connections",
        "Count parameters in a network",
        "Design network architectures",
      ],
      content: `# Neural Network Architecture

A neural network is layers of interconnected neurons that transform inputs into outputs.

## Components

**Input Layer:** Receives raw features (no computation)
**Hidden Layers:** Learn intermediate representations  
**Output Layer:** Produces final predictions

## Counting Parameters

Between two layers with n₁ and n₂ neurons:
- Weights: n₁ × n₂
- Biases: n₂
- Total: n₁ × n₂ + n₂

## Example: [3, 4, 2] Network

- Layer 1→2: 3×4 + 4 = 16 params
- Layer 2→3: 4×2 + 2 = 10 params
- **Total: 26 parameters**

## Width vs Depth

- **Wider:** More neurons per layer → more capacity
- **Deeper:** More layers → hierarchical features
- Trade-off: More params = more data needed`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Networks have input, hidden, and output layers",
        "Parameters = weights + biases",
        "More parameters = more capacity but needs more data",
      ],
      estimatedTime: 12,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "forward-propagation" },
    update: {},
    create: {
      sectionId: section27_1.id,
      number: 27.12,
      title: "Forward Propagation",
      slug: "forward-propagation",
      objectives: [
        "Compute layer-by-layer activations",
        "Understand matrix operations",
        "Trace data flow through networks",
      ],
      content: `# Forward Propagation

Data flows from input to output, layer by layer.

## The Process

For each layer l:
1. **Linear:** z⁽ˡ⁾ = W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾
2. **Activation:** a⁽ˡ⁾ = σ(z⁽ˡ⁾)

## Matrix Form

\`\`\`python
def forward(X, weights, biases):
    a = X
    for W, b in zip(weights, biases):
        z = np.dot(a, W) + b
        a = sigmoid(z)
    return a
\`\`\`

## Example

Input: [0.5, 0.8]
Hidden: h = σ(W₁·x + b₁) = [0.62, 0.45, 0.71]
Output: y = σ(W₂·h + b₂) = [0.73]`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Each layer: z = Wx + b, then a = σ(z)",
        "Activations from one layer become inputs to next",
        "Final output is the prediction",
      ],
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });

  const section27_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter27.id, number: 27.2 } },
    update: {},
    create: {
      chapterId: chapter27.id,
      number: 27.2,
      title: "Learning",
      description: "How neural networks learn from data",
      order: 2,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "loss-functions" },
    update: {},
    create: {
      sectionId: section27_2.id,
      number: 27.21,
      title: "Loss Functions",
      slug: "loss-functions",
      objectives: [
        "Understand different loss functions",
        "Choose loss for regression vs classification",
        "Interpret loss values",
      ],
      content: `# Loss Functions

Loss measures how wrong our predictions are.

## Regression Losses

**Mean Squared Error (MSE):**
L = (y - ŷ)²
- Penalizes large errors heavily
- Standard for regression

**Mean Absolute Error (MAE):**
L = |y - ŷ|
- More robust to outliers

## Classification Losses

**Binary Cross-Entropy:**
L = -y·log(ŷ) - (1-y)·log(1-ŷ)
- Standard for binary classification
- Heavily penalizes confident wrong predictions

**Categorical Cross-Entropy:**
L = -Σ yᵢ·log(ŷᵢ)
- For multi-class problems

## Choosing a Loss

| Problem | Loss |
|---------|------|
| Regression | MSE or MAE |
| Binary Classification | Binary Cross-Entropy |
| Multi-class | Categorical Cross-Entropy |`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Loss quantifies prediction error",
        "MSE for regression, Cross-Entropy for classification",
        "Lower loss = better predictions",
      ],
      estimatedTime: 12,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "backpropagation" },
    update: {},
    create: {
      sectionId: section27_2.id,
      number: 27.22,
      title: "Backpropagation",
      slug: "backpropagation",
      objectives: [
        "Understand the chain rule",
        "Compute gradients layer by layer",
        "Update weights using gradients",
      ],
      content: `# Backpropagation

The algorithm that makes deep learning possible!

## The Chain Rule

To find how loss changes with a weight:
∂L/∂w = ∂L/∂ŷ × ∂ŷ/∂z × ∂z/∂w

## The Algorithm

1. **Forward pass:** Compute all activations
2. **Compute loss:** L = Loss(y, ŷ)
3. **Output gradient:** ∂L/∂ŷ
4. **For each layer (backward):**
   - Gradient w.r.t. weights: ∂L/∂W
   - Gradient w.r.t. biases: ∂L/∂b
   - Gradient w.r.t. previous activation: ∂L/∂a
5. **Update weights:** W = W - α × ∂L/∂W

## Why "Back"propagation?

Gradients flow BACKWARD from output to input:
Loss → Output → Hidden → Input

## Key Insight

Each layer's gradient depends on the gradient from the next layer. We compute them in reverse order!`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Chain rule lets us compute gradients for any weight",
        "Gradients flow backward through the network",
        "Each layer passes gradients to previous layer",
      ],
      estimatedTime: 20,
      difficulty: "ADVANCED",
      order: 4,
      isPublished: true,
    },
  });

  const section27_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter27.id, number: 27.3 } },
    update: {},
    create: {
      chapterId: chapter27.id,
      number: 27.3,
      title: "Training Challenges",
      description: "Common problems and solutions",
      order: 3,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "gradient-flow-problems" },
    update: {},
    create: {
      sectionId: section27_3.id,
      number: 27.31,
      title: "Gradient Flow Problems",
      slug: "gradient-flow-problems",
      objectives: [
        "Understand vanishing gradients",
        "Understand exploding gradients",
        "Learn solutions to gradient problems",
      ],
      content: `# Gradient Flow Problems

## Vanishing Gradients

Gradients shrink as they flow backward through many layers.

**Cause:** Sigmoid/Tanh have max gradient < 1
After n layers: gradient ≈ (0.25)ⁿ → 0

**Symptoms:**
- Early layers learn very slowly
- Loss plateaus
- Weights don't change

**Solutions:**
- Use ReLU activation
- Batch normalization
- Skip connections (ResNets)

## Exploding Gradients

Gradients grow exponentially through layers.

**Symptoms:**
- NaN losses
- Weights become huge
- Unstable training

**Solutions:**
- Gradient clipping
- Careful weight initialization
- Lower learning rate`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Vanishing: gradients shrink to ~0, early layers can't learn",
        "Exploding: gradients grow huge, training becomes unstable",
        "ReLU, BatchNorm, and skip connections help",
      ],
      estimatedTime: 15,
      difficulty: "ADVANCED",
      order: 5,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "training-neural-networks" },
    update: {},
    create: {
      sectionId: section27_3.id,
      number: 27.32,
      title: "Training Neural Networks",
      slug: "training-neural-networks",
      objectives: [
        "Understand the training loop",
        "Monitor training progress",
        "Recognize convergence",
      ],
      content: `# Training Neural Networks

## The Training Loop

\`\`\`python
for epoch in range(n_epochs):
    for batch in data_loader:
        # Forward pass
        predictions = model(batch.x)
        loss = loss_fn(predictions, batch.y)
        
        # Backward pass
        loss.backward()
        
        # Update weights
        optimizer.step()
        optimizer.zero_grad()
\`\`\`

## Monitoring Training

**Watch for:**
- Training loss decreasing
- Validation loss decreasing
- Accuracy improving

**Warning signs:**
- Loss not decreasing → learning rate too low/high
- Training loss good, validation bad → overfitting
- Loss is NaN → exploding gradients

## Hyperparameters

| Hyperparameter | Effect |
|----------------|--------|
| Learning rate | Speed vs stability |
| Batch size | Noise vs efficiency |
| Epochs | Underfitting vs overfitting |
| Architecture | Capacity to learn |`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Training loop: forward → loss → backward → update",
        "Monitor both training and validation loss",
        "Learning rate is the most important hyperparameter",
      ],
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 6,
      isPublished: true,
    },
  });

  const lessonCount = await prisma.lesson.count({ where: { section: { chapterId: chapter27.id } } });
  
  console.log("\n📊 Chapter 27 Summary:");
  console.log(`   Sections: 3`);
  console.log(`   Lessons: ${lessonCount}`);
  console.log("\n✅ Chapter 27 seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
