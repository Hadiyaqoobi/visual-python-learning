import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔥 Seeding Chapter 30: PyTorch Fundamentals...\n");

  const chapter30 = await prisma.chapter.upsert({
    where: { number: 30 },
    update: {},
    create: {
      number: 30,
      title: "PyTorch Fundamentals",
      description: "Learn to build neural networks with PyTorch, the leading deep learning framework. Master tensors, autograd, and the training loop.",
      objectives: [
        "Understand tensors and tensor operations",
        "Master automatic differentiation with autograd",
        "Build neural networks with nn.Module",
        "Implement the complete training loop",
      ],
      imageUrl: "/images/chapters/ch30-pytorch.png",
      isPublished: true,
    },
  });

  console.log("✅ Created Chapter 30:", chapter30.title);

  // Section 1: Core Concepts
  const section30_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter30.id, number: 30.1 } },
    update: {},
    create: {
      chapterId: chapter30.id,
      number: 30.1,
      title: "PyTorch Core Concepts",
      description: "Tensors, autograd, and the building blocks of deep learning",
      order: 1,
    },
  });

  // Lesson 1: Tensors
  await prisma.lesson.upsert({
    where: { slug: "pytorch-tensors" },
    update: {},
    create: {
      sectionId: section30_1.id,
      number: 30.11,
      title: "Tensors: The Foundation of Deep Learning",
      slug: "pytorch-tensors",
      objectives: [
        "Understand what tensors are and why they matter",
        "Create tensors from data, zeros, ones, and random values",
        "Perform tensor operations and understand broadcasting",
        "Move tensors between CPU and GPU",
      ],
      content: `# Tensors: The Foundation of Deep Learning

Everything in deep learning is a tensor. Images? Tensors. Text? Tensors. Model weights? Tensors. If you understand tensors, you understand the language of neural networks.

## What is a Tensor?

A tensor is simply a **multi-dimensional array**. You already know some tensors:

| Dimensions | Name | Example |
|------------|------|---------|
| 0D | Scalar | A single number: \`42\` |
| 1D | Vector | A list: \`[1, 2, 3, 4]\` |
| 2D | Matrix | A table: \`[[1,2], [3,4]]\` |
| 3D | 3D Tensor | A cube of numbers (e.g., RGB image) |
| 4D | 4D Tensor | Batch of images: \`[batch, channels, height, width]\` |

**Why "tensor" instead of "array"?**
- Tensors can live on GPUs for massive parallel computation
- Tensors track gradients automatically for backpropagation
- The name comes from mathematics (tensor calculus)

---

## Creating Tensors

### From Python Data

\`\`\`python
import torch

# From a list
a = torch.tensor([1, 2, 3, 4])
print(a)  # tensor([1, 2, 3, 4])

# From nested lists (matrix)
b = torch.tensor([[1, 2, 3],
                  [4, 5, 6]])
print(b.shape)  # torch.Size([2, 3]) - 2 rows, 3 columns

# Specify data type
c = torch.tensor([1.0, 2.0, 3.0], dtype=torch.float32)
\`\`\`

### Special Tensors

\`\`\`python
# Zeros
zeros = torch.zeros(3, 4)  # 3x4 matrix of zeros

# Ones
ones = torch.ones(2, 3, 4)  # 2x3x4 tensor of ones

# Random (uniform 0-1)
rand = torch.rand(3, 3)

# Random (normal distribution)
randn = torch.randn(3, 3)  # Mean=0, Std=1

# Range
arange = torch.arange(0, 10, 2)  # [0, 2, 4, 6, 8]

# Identity matrix
eye = torch.eye(4)  # 4x4 identity
\`\`\`

### From NumPy

\`\`\`python
import numpy as np

# NumPy → Tensor (shares memory!)
numpy_array = np.array([1, 2, 3])
tensor = torch.from_numpy(numpy_array)

# Tensor → NumPy
back_to_numpy = tensor.numpy()
\`\`\`

**⚠️ Warning:** \`torch.from_numpy()\` shares memory with the original array. Changes to one affect the other!

---

## Tensor Properties

\`\`\`python
t = torch.randn(2, 3, 4)

print(t.shape)     # torch.Size([2, 3, 4])
print(t.dtype)     # torch.float32
print(t.device)    # cpu (or cuda:0 for GPU)
print(t.ndim)      # 3 (number of dimensions)
print(t.numel())   # 24 (total number of elements)
\`\`\`

---

## Tensor Operations

### Basic Math

\`\`\`python
a = torch.tensor([1, 2, 3, 4], dtype=torch.float32)
b = torch.tensor([5, 6, 7, 8], dtype=torch.float32)

# Element-wise operations
print(a + b)      # tensor([6, 8, 10, 12])
print(a - b)      # tensor([-4, -4, -4, -4])
print(a * b)      # tensor([5, 12, 21, 32])
print(a / b)      # tensor([0.2, 0.33, 0.43, 0.5])
print(a ** 2)     # tensor([1, 4, 9, 16])

# In-place operations (modify tensor directly)
a.add_(1)         # a is now [2, 3, 4, 5]
# Note: In-place ops end with underscore _
\`\`\`

### Aggregations

\`\`\`python
t = torch.tensor([[1, 2, 3],
                  [4, 5, 6]], dtype=torch.float32)

print(t.sum())           # 21 (sum all)
print(t.sum(dim=0))      # [5, 7, 9] (sum columns)
print(t.sum(dim=1))      # [6, 15] (sum rows)

print(t.mean())          # 3.5
print(t.max())           # 6
print(t.min())           # 1
print(t.argmax())        # 5 (index of max value)
\`\`\`

### Matrix Operations

\`\`\`python
A = torch.randn(2, 3)
B = torch.randn(3, 4)

# Matrix multiplication
C = A @ B           # Same as torch.matmul(A, B)
print(C.shape)      # torch.Size([2, 4])

# Transpose
print(A.T.shape)    # torch.Size([3, 2])

# Batch matrix multiplication
batch_A = torch.randn(32, 2, 3)  # 32 matrices of 2x3
batch_B = torch.randn(32, 3, 4)  # 32 matrices of 3x4
batch_C = batch_A @ batch_B      # 32 matrices of 2x4
\`\`\`

---

## Reshaping Tensors

\`\`\`python
t = torch.arange(12)  # [0, 1, 2, ..., 11]

# Reshape
a = t.reshape(3, 4)    # 3 rows, 4 columns
b = t.reshape(2, 2, 3) # 2 x 2 x 3

# View (same as reshape, but shares memory)
c = t.view(4, 3)

# Flatten
d = a.flatten()  # Back to 1D

# Add dimension
e = t.unsqueeze(0)   # Shape: [1, 12]
f = t.unsqueeze(1)   # Shape: [12, 1]

# Remove dimension
g = e.squeeze(0)     # Back to [12]
\`\`\`

### Common Reshape Patterns

\`\`\`python
# Image batch: [batch, height, width, channels] → [batch, channels, height, width]
images = torch.randn(32, 224, 224, 3)  # TensorFlow format
images = images.permute(0, 3, 1, 2)     # PyTorch format: [32, 3, 224, 224]

# Flatten for fully connected layer
batch = torch.randn(32, 16, 7, 7)       # After conv layers
flat = batch.view(32, -1)               # [32, 784] - the -1 infers the size
\`\`\`

---

## GPU Acceleration

This is where tensors shine!

\`\`\`python
# Check if GPU is available
print(torch.cuda.is_available())  # True if you have a GPU

# Create tensor on GPU
if torch.cuda.is_available():
    device = torch.device("cuda")
else:
    device = torch.device("cpu")

# Move tensor to GPU
t = torch.randn(1000, 1000)
t_gpu = t.to(device)

# Or create directly on GPU
t_gpu = torch.randn(1000, 1000, device=device)

# Operations on GPU tensors happen on GPU
result = t_gpu @ t_gpu.T  # Matrix multiply on GPU - much faster!

# Move back to CPU (for NumPy, plotting, etc.)
result_cpu = result.cpu()
\`\`\`

### GPU Speedup Example

\`\`\`python
import time

# CPU timing
t_cpu = torch.randn(5000, 5000)
start = time.time()
_ = t_cpu @ t_cpu.T
print(f"CPU: {time.time() - start:.3f}s")

# GPU timing (if available)
if torch.cuda.is_available():
    t_gpu = torch.randn(5000, 5000, device="cuda")
    torch.cuda.synchronize()  # Wait for GPU
    start = time.time()
    _ = t_gpu @ t_gpu.T
    torch.cuda.synchronize()
    print(f"GPU: {time.time() - start:.3f}s")
\`\`\`

Typical result: **CPU: 2.5s, GPU: 0.05s** - 50x faster!

---

## Broadcasting

When operating on tensors of different shapes, PyTorch automatically expands them to compatible shapes.

\`\`\`python
# Add scalar to matrix (scalar broadcasts)
a = torch.ones(3, 3)
b = a + 5  # 5 broadcasts to [[5,5,5], [5,5,5], [5,5,5]]

# Add vector to matrix (vector broadcasts across rows)
matrix = torch.ones(3, 4)
row = torch.tensor([1, 2, 3, 4])
result = matrix + row  # row added to each row of matrix

# Add column vector to matrix
col = torch.tensor([[1], [2], [3]])  # Shape [3, 1]
result = matrix + col  # col added to each column
\`\`\`

### Broadcasting Rules

Two dimensions are compatible when:
1. They are equal, OR
2. One of them is 1

\`\`\`python
# These work:
[4, 3] + [3] → [4, 3]      # [3] broadcasts to [4, 3]
[4, 3] + [4, 1] → [4, 3]   # [4, 1] broadcasts to [4, 3]
[4, 1, 3] + [5, 3] → [4, 5, 3]

# This fails:
[4, 3] + [4] → Error!      # Can't broadcast [4] to match [4, 3]
\`\`\`

---

## Common Pitfalls

### 1. Forgetting to Match Devices

\`\`\`python
# WRONG - tensors on different devices
a = torch.randn(3, 3)           # CPU
b = torch.randn(3, 3).cuda()    # GPU
c = a + b  # Error!

# RIGHT - same device
a = torch.randn(3, 3).cuda()
b = torch.randn(3, 3).cuda()
c = a + b  # Works!
\`\`\`

### 2. Forgetting to Convert Types

\`\`\`python
# WRONG - integer division
a = torch.tensor([1, 2, 3])
b = a / 2  # tensor([0, 1, 1]) - integer division!

# RIGHT - use floats
a = torch.tensor([1, 2, 3], dtype=torch.float32)
b = a / 2  # tensor([0.5, 1.0, 1.5])
\`\`\`

### 3. Modifying Tensors In-Place During Gradient Computation

\`\`\`python
# WRONG - breaks gradient tracking
x = torch.tensor([1.0], requires_grad=True)
x.add_(1)  # In-place operation - error in backward!

# RIGHT - create new tensor
x = torch.tensor([1.0], requires_grad=True)
y = x + 1  # New tensor, gradient tracking preserved
\`\`\`

---

## Quick Reference

| Operation | Code |
|-----------|------|
| Create from list | \`torch.tensor([1, 2, 3])\` |
| Zeros | \`torch.zeros(3, 4)\` |
| Random normal | \`torch.randn(3, 4)\` |
| Shape | \`t.shape\` |
| Reshape | \`t.reshape(2, 6)\` or \`t.view(2, 6)\` |
| Matrix multiply | \`a @ b\` |
| To GPU | \`t.to("cuda")\` |
| To CPU | \`t.cpu()\` |
| To NumPy | \`t.numpy()\` |`,
      codeExamples: JSON.stringify([
        {
          title: "Tensor Basics",
          language: "python",
          code: `import torch

# Create tensors
scalar = torch.tensor(42)
vector = torch.tensor([1, 2, 3, 4])
matrix = torch.tensor([[1, 2], [3, 4]])

# Check properties
print(f"Shape: {matrix.shape}")  # [2, 2]
print(f"Dtype: {matrix.dtype}")  # torch.int64

# Operations
a = torch.randn(3, 3)
b = torch.randn(3, 3)
c = a + b        # Element-wise add
d = a @ b        # Matrix multiply
e = a.sum()      # Sum all elements

# GPU (if available)
device = "cuda" if torch.cuda.is_available() else "cpu"
t = torch.randn(1000, 1000, device=device)
result = t @ t.T  # Fast on GPU!`
        }
      ]),
      keyPoints: [
        "Tensors are multi-dimensional arrays that can run on GPUs",
        "Create with torch.tensor(), torch.zeros(), torch.randn(), etc.",
        "Use @ for matrix multiplication, * for element-wise",
        "Always match tensor devices (CPU or GPU)",
        "Use .to(device) to move tensors between devices",
        "Broadcasting automatically expands dimensions for compatible operations",
      ],
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });

  const lessonCount = await prisma.lesson.count({ where: { section: { chapterId: chapter30.id } } });
  
  console.log("\n📊 Chapter 30 Progress:");
  console.log(`   Lessons: ${lessonCount}/6`);
  console.log("\n✅ Chapter 30 Lesson 1 seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
