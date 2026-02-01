const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("📝 Adding exercises to Chapter 30 lessons...\n");

  // Lesson 1: Tensors
  const tensorLesson = await prisma.lesson.findUnique({ where: { slug: "pytorch-tensors" } });
  if (tensorLesson) {
    await prisma.exercise.createMany({
      data: [
        {
          lessonId: tensorLesson.id,
          number: 1,
          title: "Create a Zeros Tensor",
          prompt: "Create a 3x4 tensor filled with zeros, then add 5 to every element.",
          type: "CODE",
          starterCode: "import torch\n\n# Create a 3x4 zeros tensor\nt = \n\n# Add 5 to every element\nresult = \n\nprint(result)",
          solution: "import torch\n\nt = torch.zeros(3, 4)\nresult = t + 5\n\nprint(result)",
          hints: ["Use torch.zeros(rows, cols)", "Use simple addition with +"],
          xpReward: 10,
          difficulty: "BEGINNER",
          order: 1,
        },
        {
          lessonId: tensorLesson.id,
          number: 2,
          title: "Tensor Shape Quiz",
          prompt: "What is the shape of torch.randn(2, 3, 4)?",
          type: "MULTIPLE_CHOICE",
          starterCode: null,
          solution: "[2, 3, 4]",
          hints: ["The arguments directly correspond to dimensions"],
          xpReward: 5,
          difficulty: "BEGINNER",
          order: 2,
        },
        {
          lessonId: tensorLesson.id,
          number: 3,
          title: "Matrix Multiplication",
          prompt: "Create two 2x2 tensors A and B, then compute their matrix multiplication (not element-wise!).",
          type: "CODE",
          starterCode: "import torch\n\nA = torch.tensor([[1, 2], [3, 4]])\nB = torch.tensor([[5, 6], [7, 8]])\n\n# Matrix multiplication (not element-wise!)\nresult = \n\nprint(result)",
          solution: "import torch\n\nA = torch.tensor([[1, 2], [3, 4]])\nB = torch.tensor([[5, 6], [7, 8]])\n\nresult = A @ B  # or torch.matmul(A, B)\n\nprint(result)",
          hints: ["Use @ operator or torch.matmul()", "Don't use * which is element-wise"],
          xpReward: 15,
          difficulty: "BEGINNER",
          order: 3,
        },
      ],
      skipDuplicates: true,
    });
    console.log("✅ Added 3 exercises to Tensors lesson");
  }

  // Lesson 2: Autograd
  const autogradLesson = await prisma.lesson.findUnique({ where: { slug: "pytorch-autograd" } });
  if (autogradLesson) {
    await prisma.exercise.createMany({
      data: [
        {
          lessonId: autogradLesson.id,
          number: 1,
          title: "Compute Gradient",
          prompt: "Create a tensor x=3.0 with requires_grad=True, compute y=x², then get the gradient of y with respect to x.",
          type: "CODE",
          starterCode: "import torch\n\n# Create x with gradient tracking\nx = \n\n# Compute y = x²\ny = \n\n# Compute gradients\n\n\nprint(f'x.grad = {x.grad}')  # Should be 6.0",
          solution: "import torch\n\nx = torch.tensor(3.0, requires_grad=True)\ny = x ** 2\ny.backward()\n\nprint(f'x.grad = {x.grad}')",
          hints: ["Use requires_grad=True", "Call .backward() on y"],
          xpReward: 15,
          difficulty: "INTERMEDIATE",
          order: 1,
        },
        {
          lessonId: autogradLesson.id,
          number: 2,
          title: "Backward Twice Quiz",
          prompt: "What happens if you call loss.backward() twice without retain_graph=True?",
          type: "MULTIPLE_CHOICE",
          starterCode: null,
          solution: "RuntimeError: graph already freed",
          hints: ["The computation graph is consumed after backward()"],
          xpReward: 5,
          difficulty: "INTERMEDIATE",
          order: 2,
        },
        {
          lessonId: autogradLesson.id,
          number: 3,
          title: "Fix Gradient Accumulation Bug",
          prompt: "Fix this code - gradients are accumulating incorrectly in the loop!",
          type: "FIX_BUG",
          starterCode: "import torch\n\nw = torch.tensor(2.0, requires_grad=True)\n\nfor i in range(3):\n    loss = (w * 3 - 10) ** 2\n    loss.backward()\n    print(f'Iteration {i}: w.grad = {w.grad}')\n    # The gradient keeps growing! Fix it.",
          solution: "import torch\n\nw = torch.tensor(2.0, requires_grad=True)\n\nfor i in range(3):\n    if w.grad is not None:\n        w.grad.zero_()  # Reset gradients!\n    loss = (w * 3 - 10) ** 2\n    loss.backward()\n    print(f'Iteration {i}: w.grad = {w.grad}')",
          hints: ["Gradients accumulate by default", "Use .zero_() to reset"],
          xpReward: 20,
          difficulty: "INTERMEDIATE",
          order: 3,
        },
      ],
      skipDuplicates: true,
    });
    console.log("✅ Added 3 exercises to Autograd lesson");
  }

  // Lesson 3: nn.Module
  const nnLesson = await prisma.lesson.findUnique({ where: { slug: "pytorch-nn-module" } });
  if (nnLesson) {
    await prisma.exercise.createMany({
      data: [
        {
          lessonId: nnLesson.id,
          number: 1,
          title: "Build a Simple Network",
          prompt: "Create a neural network with: Input(10) → Linear(32) → ReLU → Linear(1)",
          type: "CODE",
          starterCode: "import torch.nn as nn\n\nclass SimpleNet(nn.Module):\n    def __init__(self):\n        super().__init__()\n        # Define layers here\n        \n    def forward(self, x):\n        # Implement forward pass\n        pass\n\nmodel = SimpleNet()\nprint(model)",
          solution: "import torch.nn as nn\n\nclass SimpleNet(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.fc1 = nn.Linear(10, 32)\n        self.relu = nn.ReLU()\n        self.fc2 = nn.Linear(32, 1)\n        \n    def forward(self, x):\n        x = self.fc1(x)\n        x = self.relu(x)\n        x = self.fc2(x)\n        return x\n\nmodel = SimpleNet()\nprint(model)",
          hints: ["Define layers in __init__", "Use them in forward()"],
          xpReward: 20,
          difficulty: "INTERMEDIATE",
          order: 1,
        },
        {
          lessonId: nnLesson.id,
          number: 2,
          title: "Count Parameters Quiz",
          prompt: "How many trainable parameters does nn.Linear(100, 50) have?",
          type: "MULTIPLE_CHOICE",
          starterCode: null,
          solution: "5050",
          hints: ["Parameters = weights + biases", "Weights: 100 × 50, Biases: 50"],
          xpReward: 5,
          difficulty: "INTERMEDIATE",
          order: 2,
        },
        {
          lessonId: nnLesson.id,
          number: 3,
          title: "Use nn.Sequential",
          prompt: "Rewrite this network using nn.Sequential: fc1=Linear(784,256), relu1=ReLU(), fc2=Linear(256,10)",
          type: "CODE",
          starterCode: "import torch.nn as nn\n\n# Rewrite as Sequential:\nmodel = nn.Sequential(\n    # Your code here\n)\n\nprint(model)",
          solution: "import torch.nn as nn\n\nmodel = nn.Sequential(\n    nn.Linear(784, 256),\n    nn.ReLU(),\n    nn.Linear(256, 10)\n)\n\nprint(model)",
          hints: ["nn.Sequential takes layers as arguments"],
          xpReward: 10,
          difficulty: "BEGINNER",
          order: 3,
        },
      ],
      skipDuplicates: true,
    });
    console.log("✅ Added 3 exercises to nn.Module lesson");
  }

  // Lesson 4: Training Loop
  const trainingLesson = await prisma.lesson.findUnique({ where: { slug: "pytorch-training-loop" } });
  if (trainingLesson) {
    await prisma.exercise.createMany({
      data: [
        {
          lessonId: trainingLesson.id,
          number: 1,
          title: "Complete the Training Loop",
          prompt: "Fill in the 5 steps of the training loop",
          type: "FILL_BLANK",
          starterCode: "import torch\nimport torch.nn as nn\nimport torch.optim as optim\n\nmodel = nn.Linear(10, 1)\ncriterion = nn.MSELoss()\noptimizer = optim.SGD(model.parameters(), lr=0.01)\n\nx = torch.randn(32, 10)\ny = torch.randn(32, 1)\n\n# Step 1: Zero gradients\n______\n\n# Step 2: Forward pass\noutput = ______\n\n# Step 3: Compute loss\nloss = ______\n\n# Step 4: Backward pass\n______\n\n# Step 5: Update weights\n______",
          solution: "import torch\nimport torch.nn as nn\nimport torch.optim as optim\n\nmodel = nn.Linear(10, 1)\ncriterion = nn.MSELoss()\noptimizer = optim.SGD(model.parameters(), lr=0.01)\n\nx = torch.randn(32, 10)\ny = torch.randn(32, 1)\n\noptimizer.zero_grad()\noutput = model(x)\nloss = criterion(output, y)\nloss.backward()\noptimizer.step()",
          hints: ["Order: zero_grad → forward → loss → backward → step"],
          xpReward: 25,
          difficulty: "INTERMEDIATE",
          order: 1,
        },
        {
          lessonId: trainingLesson.id,
          number: 2,
          title: "Loss Function Quiz",
          prompt: "Which loss function should you use for multi-class classification?",
          type: "MULTIPLE_CHOICE",
          starterCode: null,
          solution: "nn.CrossEntropyLoss()",
          hints: ["It combines LogSoftmax and NLLLoss"],
          xpReward: 5,
          difficulty: "BEGINNER",
          order: 2,
        },
      ],
      skipDuplicates: true,
    });
    console.log("✅ Added 2 exercises to Training Loop lesson");
  }

  // Lesson 5: Data Loading
  const dataLesson = await prisma.lesson.findUnique({ where: { slug: "pytorch-data-loading" } });
  if (dataLesson) {
    await prisma.exercise.createMany({
      data: [
        {
          lessonId: dataLesson.id,
          number: 1,
          title: "Create a Custom Dataset",
          prompt: "Create a custom Dataset class for a list of (x, y) pairs",
          type: "CODE",
          starterCode: "from torch.utils.data import Dataset\n\nclass SimpleDataset(Dataset):\n    def __init__(self, x_data, y_data):\n        # Store data\n        pass\n    \n    def __len__(self):\n        # Return dataset size\n        pass\n    \n    def __getitem__(self, idx):\n        # Return (x, y) at index\n        pass\n\n# Test it\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 6, 8, 10]\nds = SimpleDataset(x, y)\nprint(len(ds))  # Should be 5",
          solution: "from torch.utils.data import Dataset\n\nclass SimpleDataset(Dataset):\n    def __init__(self, x_data, y_data):\n        self.x = x_data\n        self.y = y_data\n    \n    def __len__(self):\n        return len(self.x)\n    \n    def __getitem__(self, idx):\n        return self.x[idx], self.y[idx]\n\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 6, 8, 10]\nds = SimpleDataset(x, y)\nprint(len(ds))",
          hints: ["Store data in __init__", "__len__ returns length", "__getitem__ returns item at index"],
          xpReward: 20,
          difficulty: "INTERMEDIATE",
          order: 1,
        },
        {
          lessonId: dataLesson.id,
          number: 2,
          title: "Shuffle Quiz",
          prompt: "What does shuffle=True do in DataLoader?",
          type: "MULTIPLE_CHOICE",
          starterCode: null,
          solution: "Shuffles the entire dataset at the start of each epoch",
          hints: ["It randomizes sample order"],
          xpReward: 5,
          difficulty: "BEGINNER",
          order: 2,
        },
      ],
      skipDuplicates: true,
    });
    console.log("✅ Added 2 exercises to Data Loading lesson");
  }

  // Lesson 6: CNN Project
  const cnnLesson = await prisma.lesson.findUnique({ where: { slug: "pytorch-cnn-project" } });
  if (cnnLesson) {
    await prisma.exercise.createMany({
      data: [
        {
          lessonId: cnnLesson.id,
          number: 1,
          title: "Calculate Output Size",
          prompt: "Calculate the output size after Conv2d(3, 16, kernel_size=3, padding=1) on a 32x32 image",
          type: "CODE",
          starterCode: "# Formula: output_size = (input_size + 2*padding - kernel_size) / stride + 1\n\ninput_size = 32\nkernel_size = 3\npadding = 1\nstride = 1\n\noutput_size = \noutput_channels = \n\nprint(f'Output shape: [{output_channels}, {output_size}, {output_size}]')",
          solution: "input_size = 32\nkernel_size = 3\npadding = 1\nstride = 1\n\noutput_size = (input_size + 2*padding - kernel_size) // stride + 1  # = 32\noutput_channels = 16\n\nprint(f'Output shape: [{output_channels}, {output_size}, {output_size}]')",
          hints: ["With padding=1 and kernel=3, size stays same", "Output channels = out_channels parameter"],
          xpReward: 15,
          difficulty: "INTERMEDIATE",
          order: 1,
        },
        {
          lessonId: cnnLesson.id,
          number: 2,
          title: "Conv + Pool Output Quiz",
          prompt: "After Conv2d(64, 64, 3, padding=1) → MaxPool2d(2) on a 16x16 feature map, what's the output size?",
          type: "MULTIPLE_CHOICE",
          starterCode: null,
          solution: "64 × 8 × 8",
          hints: ["Conv with padding=1 keeps size", "MaxPool(2) halves dimensions"],
          xpReward: 10,
          difficulty: "INTERMEDIATE",
          order: 2,
        },
        {
          lessonId: cnnLesson.id,
          number: 3,
          title: "Add BatchNorm and Dropout",
          prompt: "Add BatchNorm and Dropout to this CNN block",
          type: "CODE",
          starterCode: "import torch.nn as nn\n\n# Add BatchNorm after Conv, Dropout after MaxPool\nblock = nn.Sequential(\n    nn.Conv2d(3, 32, kernel_size=3, padding=1),\n    # Add BatchNorm2d here\n    nn.ReLU(),\n    nn.MaxPool2d(2),\n    # Add Dropout here\n)\n\nprint(block)",
          solution: "import torch.nn as nn\n\nblock = nn.Sequential(\n    nn.Conv2d(3, 32, kernel_size=3, padding=1),\n    nn.BatchNorm2d(32),\n    nn.ReLU(),\n    nn.MaxPool2d(2),\n    nn.Dropout(0.25),\n)\n\nprint(block)",
          hints: ["BatchNorm2d needs number of channels", "Dropout takes probability"],
          xpReward: 15,
          difficulty: "INTERMEDIATE",
          order: 3,
        },
      ],
      skipDuplicates: true,
    });
    console.log("✅ Added 3 exercises to CNN Project lesson");
  }

  // Count total exercises
  const totalExercises = await prisma.exercise.count();
  console.log(`\n🎉 Total exercises in database: ${totalExercises}`);
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
