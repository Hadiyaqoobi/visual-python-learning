import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📝 Adding exercises to Chapter 30 lessons...\n");

  // Update Lesson 1: Tensors with exercises
  await prisma.lesson.update({
    where: { slug: "pytorch-tensors" },
    data: {
      exercises: JSON.stringify([
        {
          id: "tensor-1",
          type: "code",
          question: "Create a 3x4 tensor filled with zeros, then add 5 to every element.",
          starterCode: "import torch\n\n# Create a 3x4 zeros tensor\nt = \n\n# Add 5 to every element\nresult = \n\nprint(result)",
          solution: "import torch\n\nt = torch.zeros(3, 4)\nresult = t + 5\n\nprint(result)",
          hint: "Use torch.zeros(rows, cols) and simple addition"
        },
        {
          id: "tensor-2",
          type: "multiple_choice",
          question: "What is the shape of torch.randn(2, 3, 4)?",
          options: ["[2, 3, 4]", "[4, 3, 2]", "[24]", "[2, 12]"],
          correctAnswer: 0,
          explanation: "torch.randn(2, 3, 4) creates a 3D tensor with shape [2, 3, 4] - 2 matrices, each 3x4"
        },
        {
          id: "tensor-3",
          type: "code",
          question: "Create two 2x2 tensors A and B, then compute their matrix multiplication.",
          starterCode: "import torch\n\nA = torch.tensor([[1, 2], [3, 4]])\nB = torch.tensor([[5, 6], [7, 8]])\n\n# Matrix multiplication (not element-wise!)\nresult = \n\nprint(result)",
          solution: "import torch\n\nA = torch.tensor([[1, 2], [3, 4]])\nB = torch.tensor([[5, 6], [7, 8]])\n\nresult = A @ B  # or torch.matmul(A, B)\n\nprint(result)",
          hint: "Use @ operator or torch.matmul() for matrix multiplication"
        }
      ])
    }
  });
  console.log("✅ Added exercises to Tensors lesson");

  // Update Lesson 2: Autograd with exercises
  await prisma.lesson.update({
    where: { slug: "pytorch-autograd" },
    data: {
      exercises: JSON.stringify([
        {
          id: "autograd-1",
          type: "code",
          question: "Create a tensor x=3.0 with requires_grad=True, compute y=x², then get the gradient of y with respect to x.",
          starterCode: "import torch\n\n# Create x with gradient tracking\nx = \n\n# Compute y = x²\ny = \n\n# Compute gradients\n\n\nprint(f'x.grad = {x.grad}')  # Should be 6.0 (dy/dx = 2x = 2*3)",
          solution: "import torch\n\nx = torch.tensor(3.0, requires_grad=True)\ny = x ** 2\ny.backward()\n\nprint(f'x.grad = {x.grad}')",
          hint: "Use requires_grad=True and call .backward() on y"
        },
        {
          id: "autograd-2",
          type: "multiple_choice",
          question: "What happens if you call loss.backward() twice without retain_graph=True?",
          options: [
            "It computes the gradient twice",
            "RuntimeError: graph already freed",
            "Gradients accumulate (double)",
            "Nothing, it's ignored"
          ],
          correctAnswer: 1,
          explanation: "The computation graph is freed after the first backward() call. Use retain_graph=True if you need to call backward() multiple times."
        },
        {
          id: "autograd-3",
          type: "code",
          question: "Fix this code to correctly compute gradients in a training loop (hint: gradients accumulate!):",
          starterCode: "import torch\n\nw = torch.tensor(2.0, requires_grad=True)\n\nfor i in range(3):\n    loss = (w * 3 - 10) ** 2\n    loss.backward()\n    print(f'Iteration {i}: w.grad = {w.grad}')\n    # The gradient keeps growing! Fix it.",
          solution: "import torch\n\nw = torch.tensor(2.0, requires_grad=True)\n\nfor i in range(3):\n    if w.grad is not None:\n        w.grad.zero_()  # Reset gradients!\n    loss = (w * 3 - 10) ** 2\n    loss.backward()\n    print(f'Iteration {i}: w.grad = {w.grad}')",
          hint: "You need to zero the gradients before each backward() call"
        }
      ])
    }
  });
  console.log("✅ Added exercises to Autograd lesson");

  // Update Lesson 3: nn.Module with exercises
  await prisma.lesson.update({
    where: { slug: "pytorch-nn-module" },
    data: {
      exercises: JSON.stringify([
        {
          id: "nn-1",
          type: "code",
          question: "Create a neural network with: Input(10) → Linear(32) → ReLU → Linear(1)",
          starterCode: "import torch.nn as nn\n\nclass SimpleNet(nn.Module):\n    def __init__(self):\n        super().__init__()\n        # Define layers here\n        \n    def forward(self, x):\n        # Implement forward pass\n        pass\n\nmodel = SimpleNet()\nprint(model)",
          solution: "import torch.nn as nn\n\nclass SimpleNet(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.fc1 = nn.Linear(10, 32)\n        self.relu = nn.ReLU()\n        self.fc2 = nn.Linear(32, 1)\n        \n    def forward(self, x):\n        x = self.fc1(x)\n        x = self.relu(x)\n        x = self.fc2(x)\n        return x\n\nmodel = SimpleNet()\nprint(model)",
          hint: "Define layers in __init__, use them in forward()"
        },
        {
          id: "nn-2",
          type: "multiple_choice",
          question: "How many trainable parameters does nn.Linear(100, 50) have?",
          options: ["100", "50", "5000", "5050"],
          correctAnswer: 3,
          explanation: "Parameters = weights + biases = (100 × 50) + 50 = 5050"
        },
        {
          id: "nn-3",
          type: "code",
          question: "Rewrite this network using nn.Sequential:",
          starterCode: "import torch.nn as nn\n\n# Original:\n# fc1 = nn.Linear(784, 256)\n# relu1 = nn.ReLU()\n# fc2 = nn.Linear(256, 10)\n\n# Rewrite as Sequential:\nmodel = nn.Sequential(\n    # Your code here\n)\n\nprint(model)",
          solution: "import torch.nn as nn\n\nmodel = nn.Sequential(\n    nn.Linear(784, 256),\n    nn.ReLU(),\n    nn.Linear(256, 10)\n)\n\nprint(model)",
          hint: "nn.Sequential takes layers as arguments in order"
        }
      ])
    }
  });
  console.log("✅ Added exercises to nn.Module lesson");

  // Update Lesson 4: Training Loop with exercises
  await prisma.lesson.update({
    where: { slug: "pytorch-training-loop" },
    data: {
      exercises: JSON.stringify([
        {
          id: "train-1",
          type: "code",
          question: "Complete the training loop - fill in the 5 steps:",
          starterCode: "import torch\nimport torch.nn as nn\nimport torch.optim as optim\n\nmodel = nn.Linear(10, 1)\ncriterion = nn.MSELoss()\noptimizer = optim.SGD(model.parameters(), lr=0.01)\n\nx = torch.randn(32, 10)\ny = torch.randn(32, 1)\n\n# Training step - fill in the blanks:\n# Step 1: Zero gradients\n______\n\n# Step 2: Forward pass\noutput = ______\n\n# Step 3: Compute loss\nloss = ______\n\n# Step 4: Backward pass\n______\n\n# Step 5: Update weights\n______\n\nprint(f'Loss: {loss.item()}')",
          solution: "import torch\nimport torch.nn as nn\nimport torch.optim as optim\n\nmodel = nn.Linear(10, 1)\ncriterion = nn.MSELoss()\noptimizer = optim.SGD(model.parameters(), lr=0.01)\n\nx = torch.randn(32, 10)\ny = torch.randn(32, 1)\n\noptimizer.zero_grad()\noutput = model(x)\nloss = criterion(output, y)\nloss.backward()\noptimizer.step()\n\nprint(f'Loss: {loss.item()}')",
          hint: "The order is: zero_grad → forward → loss → backward → step"
        },
        {
          id: "train-2",
          type: "multiple_choice",
          question: "Which loss function should you use for multi-class classification?",
          options: ["nn.MSELoss()", "nn.BCELoss()", "nn.CrossEntropyLoss()", "nn.L1Loss()"],
          correctAnswer: 2,
          explanation: "CrossEntropyLoss is designed for multi-class classification. It combines LogSoftmax and NLLLoss."
        }
      ])
    }
  });
  console.log("✅ Added exercises to Training Loop lesson");

  // Update Lesson 5: Data Loading with exercises
  await prisma.lesson.update({
    where: { slug: "pytorch-data-loading" },
    data: {
      exercises: JSON.stringify([
        {
          id: "data-1",
          type: "code",
          question: "Create a custom Dataset class for a list of (x, y) pairs:",
          starterCode: "from torch.utils.data import Dataset\n\nclass SimpleDataset(Dataset):\n    def __init__(self, x_data, y_data):\n        # Store data\n        pass\n    \n    def __len__(self):\n        # Return dataset size\n        pass\n    \n    def __getitem__(self, idx):\n        # Return (x, y) at index\n        pass\n\n# Test it\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 6, 8, 10]\nds = SimpleDataset(x, y)\nprint(len(ds))  # Should be 5\nprint(ds[0])    # Should be (1, 2)",
          solution: "from torch.utils.data import Dataset\n\nclass SimpleDataset(Dataset):\n    def __init__(self, x_data, y_data):\n        self.x = x_data\n        self.y = y_data\n    \n    def __len__(self):\n        return len(self.x)\n    \n    def __getitem__(self, idx):\n        return self.x[idx], self.y[idx]\n\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 6, 8, 10]\nds = SimpleDataset(x, y)\nprint(len(ds))\nprint(ds[0])",
          hint: "Store data in __init__, return length in __len__, return item in __getitem__"
        },
        {
          id: "data-2",
          type: "multiple_choice",
          question: "What does shuffle=True do in DataLoader?",
          options: [
            "Shuffles the batch order",
            "Shuffles elements within each batch",
            "Shuffles the entire dataset at the start of each epoch",
            "Randomly drops some samples"
          ],
          correctAnswer: 2,
          explanation: "shuffle=True randomizes the order of all samples at the beginning of each epoch, which helps prevent the model from learning the order of samples."
        }
      ])
    }
  });
  console.log("✅ Added exercises to Data Loading lesson");

  // Update Lesson 6: CNN Project with exercises
  await prisma.lesson.update({
    where: { slug: "pytorch-cnn-project" },
    data: {
      exercises: JSON.stringify([
        {
          id: "cnn-1",
          type: "code",
          question: "Calculate the output size after this conv layer: Conv2d(3, 16, kernel_size=3, padding=1) on a 32x32 image",
          starterCode: "# Input: 3 channels, 32x32 image\n# Conv2d(in_channels=3, out_channels=16, kernel_size=3, padding=1)\n\n# Formula: output_size = (input_size + 2*padding - kernel_size) / stride + 1\n\n# Calculate:\ninput_size = 32\nkernel_size = 3\npadding = 1\nstride = 1  # default\n\noutput_size = \noutput_channels = \n\nprint(f'Output shape: [{output_channels}, {output_size}, {output_size}]')",
          solution: "input_size = 32\nkernel_size = 3\npadding = 1\nstride = 1\n\noutput_size = (input_size + 2*padding - kernel_size) // stride + 1  # = 32\noutput_channels = 16  # from out_channels parameter\n\nprint(f'Output shape: [{output_channels}, {output_size}, {output_size}]')  # [16, 32, 32]",
          hint: "With padding=1 and kernel_size=3, the spatial dimensions stay the same"
        },
        {
          id: "cnn-2",
          type: "multiple_choice",
          question: "After Conv2d(64, 64, 3, padding=1) → MaxPool2d(2) on a 16x16 feature map, what's the output size?",
          options: ["64 × 16 × 16", "64 × 8 × 8", "64 × 14 × 14", "32 × 8 × 8"],
          correctAnswer: 1,
          explanation: "Conv2d with padding=1 keeps size at 16×16. MaxPool2d(2) halves each dimension to 8×8. Channels stay at 64."
        },
        {
          id: "cnn-3",
          type: "code",
          question: "Add BatchNorm and Dropout to this CNN block:",
          starterCode: "import torch.nn as nn\n\n# Original block:\n# Conv2d → ReLU → MaxPool\n\n# Enhanced block:\n# Conv2d → BatchNorm → ReLU → MaxPool → Dropout\n\nblock = nn.Sequential(\n    nn.Conv2d(3, 32, kernel_size=3, padding=1),\n    # Add BatchNorm2d here\n    nn.ReLU(),\n    nn.MaxPool2d(2),\n    # Add Dropout here\n)\n\nprint(block)",
          solution: "import torch.nn as nn\n\nblock = nn.Sequential(\n    nn.Conv2d(3, 32, kernel_size=3, padding=1),\n    nn.BatchNorm2d(32),  # Match number of channels\n    nn.ReLU(),\n    nn.MaxPool2d(2),\n    nn.Dropout(0.25),\n)\n\nprint(block)",
          hint: "BatchNorm2d needs the number of channels as argument"
        }
      ])
    }
  });
  console.log("✅ Added exercises to CNN Project lesson");

  console.log("\n🎉 All exercises added to Chapter 30!");
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
