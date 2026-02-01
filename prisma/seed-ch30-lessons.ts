import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔥 Seeding Chapter 30 Lessons 2-6...\n");

  const section = await prisma.section.findFirst({
    where: { number: 30.1 }
  });

  if (!section) {
    throw new Error("Section 30.1 not found. Run seed-ch30-run.ts first.");
  }

  // Lesson 2: Autograd
  await prisma.lesson.upsert({
    where: { slug: "pytorch-autograd" },
    update: {},
    create: {
      sectionId: section.id,
      number: 30.12,
      title: "Autograd: Automatic Differentiation",
      slug: "pytorch-autograd",
      objectives: [
        "Understand how PyTorch tracks computations",
        "Use requires_grad and backward()",
        "Compute gradients automatically",
        "Control gradient computation",
      ],
      content: `# Autograd: The Magic Behind Neural Network Training

PyTorch's autograd is what makes deep learning practical. It automatically computes gradients - the derivatives you need to update your model's weights.

## The Core Idea

Remember calculus? To minimize a function, you take its derivative and move in the opposite direction. Neural networks have millions of parameters, making manual derivatives impossible. Autograd does it automatically!

## How It Works

\`\`\`python
import torch

# Create tensors - requires_grad=True tells PyTorch to track operations
x = torch.tensor(2.0)
w = torch.tensor(3.0, requires_grad=True)
b = torch.tensor(1.0, requires_grad=True)

# Forward pass - PyTorch builds a computation graph
y = w * x + b  # y = 3*2 + 1 = 7

# Define loss
target = torch.tensor(10.0)
loss = (y - target) ** 2  # (7-10)² = 9

# Backward pass - compute all gradients!
loss.backward()

# Gradients are now available
print(w.grad)  # How much loss changes when w changes
print(b.grad)  # How much loss changes when b changes
\`\`\`

## The Computation Graph

When you do operations on tensors with \`requires_grad=True\`, PyTorch builds a graph:

\`\`\`
x ─────┐
       ├── * ──┐
w ─────┘       │
               ├── + ──── y ──── loss
b ─────────────┘
\`\`\`

When you call \`loss.backward()\`, PyTorch traverses this graph **backwards**, computing gradients using the chain rule.

## The Chain Rule in Action

For \`loss = (y - 10)²\` where \`y = w*x + b\`:

\`\`\`
∂loss/∂w = ∂loss/∂y × ∂y/∂w
         = 2(y-10) × x
         = 2(7-10) × 2
         = -12
\`\`\`

PyTorch does this automatically for arbitrarily complex functions!

## Key Functions

### requires_grad

\`\`\`python
# Only parameters need gradients
x = torch.tensor([1., 2., 3.])                    # No gradients
w = torch.tensor([1., 2., 3.], requires_grad=True)  # Track gradients

# Or enable later
x.requires_grad_(True)
\`\`\`

### backward()

\`\`\`python
loss.backward()  # Computes gradients for all tensors with requires_grad=True
\`\`\`

### grad

\`\`\`python
print(w.grad)  # Access the computed gradient
\`\`\`

### Detaching and No-Grad

\`\`\`python
# Stop tracking operations
y = w * x
y_detached = y.detach()  # New tensor, no gradient tracking

# Temporarily disable gradient tracking (faster, saves memory)
with torch.no_grad():
    # Operations here won't be tracked
    prediction = model(x)
\`\`\`

## Gradient Accumulation

⚠️ Important: Gradients accumulate by default!

\`\`\`python
# WRONG - gradients accumulate!
for i in range(3):
    loss = compute_loss()
    loss.backward()
    print(w.grad)  # Gets larger each iteration!

# RIGHT - zero gradients first
for i in range(3):
    w.grad.zero_()  # Reset gradients
    loss = compute_loss()
    loss.backward()
    print(w.grad)  # Correct gradient
\`\`\`

## Complete Training Step

\`\`\`python
# Standard pattern
optimizer.zero_grad()     # Clear old gradients
loss = criterion(output, target)  # Compute loss
loss.backward()           # Compute gradients
optimizer.step()          # Update parameters
\`\`\`

## Common Pitfalls

1. **Forgetting requires_grad:** Model parameters need it, inputs don't
2. **Not zeroing gradients:** Causes gradients to accumulate
3. **In-place operations:** Can break the computation graph
4. **Calling backward twice:** Need \`retain_graph=True\` for this`,
      codeExamples: JSON.stringify([
        {
          title: "Autograd Basics",
          language: "python",
          code: `import torch

# Create parameters
w = torch.tensor(3.0, requires_grad=True)
b = torch.tensor(1.0, requires_grad=True)

# Forward pass
x = torch.tensor(2.0)
y = w * x + b
loss = (y - 10) ** 2

# Backward pass
loss.backward()

print(f"w.grad = {w.grad}")  # -12
print(f"b.grad = {b.grad}")  # -6

# Update parameters (simple gradient descent)
with torch.no_grad():
    w -= 0.01 * w.grad
    b -= 0.01 * b.grad

print(f"New w = {w}")  # 3.12
print(f"New b = {b}")  # 1.06`
        }
      ]),
      keyPoints: [
        "requires_grad=True tells PyTorch to track operations for gradient computation",
        "backward() computes gradients using the chain rule automatically",
        "Gradients accumulate - always zero them before each backward pass",
        "Use torch.no_grad() for inference to save memory and speed up computation",
        "The computation graph is built during the forward pass and consumed during backward",
      ],
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log("✅ Lesson 2: Autograd");

  // Lesson 3: Building Neural Networks
  await prisma.lesson.upsert({
    where: { slug: "pytorch-nn-module" },
    update: {},
    create: {
      sectionId: section.id,
      number: 30.13,
      title: "Building Neural Networks with nn.Module",
      slug: "pytorch-nn-module",
      objectives: [
        "Create neural networks using nn.Module",
        "Understand layers, activations, and architectures",
        "Build custom models with flexibility",
        "Use nn.Sequential for simple models",
      ],
      content: `# Building Neural Networks with nn.Module

PyTorch's nn.Module is the base class for all neural networks. It handles parameter management, GPU transfers, and more.

## Your First Neural Network

\`\`\`python
import torch
import torch.nn as nn

class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 128)  # Input → Hidden
        self.fc2 = nn.Linear(128, 10)   # Hidden → Output
        self.relu = nn.ReLU()
    
    def forward(self, x):
        x = self.fc1(x)      # Linear transformation
        x = self.relu(x)     # Activation
        x = self.fc2(x)      # Output layer
        return x

# Create model
model = SimpleNet()
print(model)
\`\`\`

## Common Layers

### Linear (Fully Connected)
\`\`\`python
# y = xW^T + b
nn.Linear(in_features=784, out_features=256)
\`\`\`

### Convolutional
\`\`\`python
# For images
nn.Conv2d(in_channels=3, out_channels=64, kernel_size=3, padding=1)
\`\`\`

### Activation Functions
\`\`\`python
nn.ReLU()           # max(0, x)
nn.Sigmoid()        # 1/(1+e^-x)
nn.Tanh()           # (e^x - e^-x)/(e^x + e^-x)
nn.Softmax(dim=1)   # Normalize to probabilities
\`\`\`

### Regularization
\`\`\`python
nn.Dropout(p=0.5)        # Randomly zero elements
nn.BatchNorm1d(128)      # Normalize activations
\`\`\`

## nn.Sequential

For simple architectures without branching:

\`\`\`python
model = nn.Sequential(
    nn.Linear(784, 256),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(256, 128),
    nn.ReLU(),
    nn.Linear(128, 10)
)

# Use it
output = model(input_tensor)
\`\`\`

## Model Parameters

\`\`\`python
# Count parameters
total_params = sum(p.numel() for p in model.parameters())
trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)

# View all parameters
for name, param in model.named_parameters():
    print(f"{name}: {param.shape}")
\`\`\`

## Moving Models

\`\`\`python
# To GPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

# Data must also be on same device!
x = x.to(device)
output = model(x)
\`\`\`

## Training vs Evaluation Mode

\`\`\`python
model.train()  # Enable dropout, batch norm in training mode
model.eval()   # Disable dropout, use running stats for batch norm

# Always use eval mode for inference
with torch.no_grad():
    model.eval()
    predictions = model(test_data)
\`\`\`

## Saving and Loading

\`\`\`python
# Save
torch.save(model.state_dict(), 'model.pth')

# Load
model = SimpleNet()
model.load_state_dict(torch.load('model.pth'))
model.eval()
\`\`\``,
      codeExamples: JSON.stringify([
        {
          title: "Complete Neural Network",
          language: "python",
          code: `import torch
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self, input_size, hidden_size, num_classes):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, num_classes)
        )
    
    def forward(self, x):
        return self.layers(x)

# Create model
model = MLP(784, 256, 10)
print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")

# Move to GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
model = model.to(device)`
        }
      ]),
      keyPoints: [
        "nn.Module is the base class for all neural networks",
        "Define layers in __init__, use them in forward()",
        "nn.Sequential is great for simple linear architectures",
        "Always move model and data to the same device",
        "Use model.train() for training, model.eval() for inference",
      ],
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log("✅ Lesson 3: nn.Module");

  // Lesson 4: Training Loop
  await prisma.lesson.upsert({
    where: { slug: "pytorch-training-loop" },
    update: {},
    create: {
      sectionId: section.id,
      number: 30.14,
      title: "The Training Loop: Putting It All Together",
      slug: "pytorch-training-loop",
      objectives: [
        "Understand the complete training process",
        "Implement the training loop from scratch",
        "Use loss functions and optimizers correctly",
        "Track and visualize training progress",
      ],
      content: `# The Training Loop: Heart of Deep Learning

Every neural network learns through the same basic loop. Master this, and you can train any model.

## The Core Pattern

\`\`\`python
for epoch in range(num_epochs):
    for batch_x, batch_y in dataloader:
        # 1. Zero gradients
        optimizer.zero_grad()
        
        # 2. Forward pass
        predictions = model(batch_x)
        
        # 3. Compute loss
        loss = criterion(predictions, batch_y)
        
        # 4. Backward pass
        loss.backward()
        
        # 5. Update weights
        optimizer.step()
\`\`\`

## Loss Functions

### Classification
\`\`\`python
# Binary (2 classes)
criterion = nn.BCEWithLogitsLoss()

# Multi-class
criterion = nn.CrossEntropyLoss()  # Combines LogSoftmax + NLLLoss
\`\`\`

### Regression
\`\`\`python
criterion = nn.MSELoss()    # Mean Squared Error
criterion = nn.L1Loss()     # Mean Absolute Error
criterion = nn.SmoothL1Loss()  # Huber loss
\`\`\`

## Optimizers

\`\`\`python
import torch.optim as optim

# SGD
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)

# Adam (usually best default)
optimizer = optim.Adam(model.parameters(), lr=0.001)

# AdamW (Adam with proper weight decay)
optimizer = optim.AdamW(model.parameters(), lr=0.001, weight_decay=0.01)
\`\`\`

## Complete Training Script

\`\`\`python
import torch
import torch.nn as nn
import torch.optim as optim

# Setup
device = "cuda" if torch.cuda.is_available() else "cpu"
model = MyModel().to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training loop
num_epochs = 10
for epoch in range(num_epochs):
    model.train()
    running_loss = 0.0
    
    for batch_idx, (data, target) in enumerate(train_loader):
        data, target = data.to(device), target.to(device)
        
        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
    
    avg_loss = running_loss / len(train_loader)
    print(f"Epoch {epoch+1}/{num_epochs}, Loss: {avg_loss:.4f}")
\`\`\`

## Validation Loop

\`\`\`python
def validate(model, val_loader, criterion, device):
    model.eval()
    val_loss = 0.0
    correct = 0
    total = 0
    
    with torch.no_grad():
        for data, target in val_loader:
            data, target = data.to(device), target.to(device)
            output = model(data)
            val_loss += criterion(output, target).item()
            
            _, predicted = output.max(1)
            total += target.size(0)
            correct += predicted.eq(target).sum().item()
    
    accuracy = 100. * correct / total
    avg_loss = val_loss / len(val_loader)
    return avg_loss, accuracy
\`\`\`

## Learning Rate Scheduling

\`\`\`python
from torch.optim.lr_scheduler import StepLR, ReduceLROnPlateau

# Reduce LR every 10 epochs
scheduler = StepLR(optimizer, step_size=10, gamma=0.1)

# Or reduce when validation loss plateaus
scheduler = ReduceLROnPlateau(optimizer, patience=5)

# Use in training loop
for epoch in range(num_epochs):
    train_one_epoch()
    val_loss = validate()
    scheduler.step(val_loss)  # For ReduceLROnPlateau
    # scheduler.step()        # For StepLR
\`\`\`

## Early Stopping

\`\`\`python
best_loss = float('inf')
patience = 5
counter = 0

for epoch in range(num_epochs):
    train_loss = train()
    val_loss = validate()
    
    if val_loss < best_loss:
        best_loss = val_loss
        counter = 0
        torch.save(model.state_dict(), 'best_model.pth')
    else:
        counter += 1
        if counter >= patience:
            print("Early stopping!")
            break
\`\`\``,
      codeExamples: JSON.stringify([
        {
          title: "Complete Training Script",
          language: "python",
          code: `import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader

# Model, loss, optimizer
model = MyModel().to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=1e-3)

# Training loop
for epoch in range(10):
    model.train()
    for x, y in train_loader:
        x, y = x.to(device), y.to(device)
        
        optimizer.zero_grad()
        pred = model(x)
        loss = criterion(pred, y)
        loss.backward()
        optimizer.step()
    
    # Validation
    model.eval()
    with torch.no_grad():
        val_loss = sum(criterion(model(x.to(device)), y.to(device)) 
                       for x, y in val_loader) / len(val_loader)
    
    print(f"Epoch {epoch+1}: val_loss={val_loss:.4f}")`
        }
      ]),
      keyPoints: [
        "The training loop: zero_grad → forward → loss → backward → step",
        "Use CrossEntropyLoss for classification, MSELoss for regression",
        "Adam optimizer is a great default choice",
        "Always validate on held-out data to detect overfitting",
        "Use learning rate scheduling and early stopping for better results",
      ],
      estimatedTime: 35,
      difficulty: "INTERMEDIATE",
      order: 4,
      isPublished: true,
    },
  });
  console.log("✅ Lesson 4: Training Loop");

  // Lesson 5: Datasets and DataLoaders
  await prisma.lesson.upsert({
    where: { slug: "pytorch-data-loading" },
    update: {},
    create: {
      sectionId: section.id,
      number: 30.15,
      title: "Datasets and DataLoaders",
      slug: "pytorch-data-loading",
      objectives: [
        "Create custom datasets for any data",
        "Use DataLoader for efficient batching",
        "Apply transforms and augmentation",
        "Work with built-in datasets",
      ],
      content: `# Datasets and DataLoaders: Feeding Your Network

Efficient data loading is crucial for training. PyTorch provides a clean abstraction.

## The Dataset Class

\`\`\`python
from torch.utils.data import Dataset

class CustomDataset(Dataset):
    def __init__(self, data, labels, transform=None):
        self.data = data
        self.labels = labels
        self.transform = transform
    
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, idx):
        x = self.data[idx]
        y = self.labels[idx]
        
        if self.transform:
            x = self.transform(x)
        
        return x, y
\`\`\`

## DataLoader

\`\`\`python
from torch.utils.data import DataLoader

dataset = CustomDataset(X, y)

loader = DataLoader(
    dataset,
    batch_size=32,
    shuffle=True,      # Shuffle for training
    num_workers=4,     # Parallel data loading
    pin_memory=True    # Faster GPU transfer
)

# Iterate
for batch_x, batch_y in loader:
    # batch_x.shape = [32, ...]
    pass
\`\`\`

## Built-in Datasets

\`\`\`python
from torchvision import datasets, transforms

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

# MNIST
train_data = datasets.MNIST(
    root='./data',
    train=True,
    download=True,
    transform=transform
)

# CIFAR-10
train_data = datasets.CIFAR10(...)

# ImageFolder (for your own images)
train_data = datasets.ImageFolder(
    root='./data/train',
    transform=transform
)
# Expects: ./data/train/class1/img1.jpg, etc.
\`\`\`

## Transforms

\`\`\`python
from torchvision import transforms

# Common transforms
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# Data augmentation (training only)
train_transform = transforms.Compose([
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean, std)
])
\`\`\`

## Train/Val Split

\`\`\`python
from torch.utils.data import random_split

full_dataset = CustomDataset(X, y)

train_size = int(0.8 * len(full_dataset))
val_size = len(full_dataset) - train_size

train_dataset, val_dataset = random_split(
    full_dataset, [train_size, val_size]
)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)
\`\`\``,
      codeExamples: JSON.stringify([
        {
          title: "Custom Dataset Example",
          language: "python",
          code: `import torch
from torch.utils.data import Dataset, DataLoader

class CSVDataset(Dataset):
    def __init__(self, csv_file):
        import pandas as pd
        self.df = pd.read_csv(csv_file)
        self.X = self.df.drop('target', axis=1).values
        self.y = self.df['target'].values
    
    def __len__(self):
        return len(self.df)
    
    def __getitem__(self, idx):
        return (
            torch.FloatTensor(self.X[idx]),
            torch.LongTensor([self.y[idx]])[0]
        )

# Use it
dataset = CSVDataset('data.csv')
loader = DataLoader(dataset, batch_size=32, shuffle=True)

for x, y in loader:
    print(x.shape, y.shape)  # [32, features], [32]`
        }
      ]),
      keyPoints: [
        "Dataset defines __len__ and __getitem__ methods",
        "DataLoader handles batching, shuffling, and parallel loading",
        "Use num_workers > 0 for faster data loading",
        "Apply different transforms for training (augmentation) vs validation",
        "Use random_split to create train/val sets",
      ],
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 5,
      isPublished: true,
    },
  });
  console.log("✅ Lesson 5: Data Loading");

  // Lesson 6: Building a CNN
  await prisma.lesson.upsert({
    where: { slug: "pytorch-cnn-project" },
    update: {},
    create: {
      sectionId: section.id,
      number: 30.16,
      title: "Project: Building a CNN Image Classifier",
      slug: "pytorch-cnn-project",
      objectives: [
        "Build a complete CNN from scratch",
        "Train on real image data",
        "Evaluate and improve the model",
        "Apply everything learned in this chapter",
      ],
      content: `# Project: Building a CNN Image Classifier

Let's put everything together and build a real image classifier from scratch!

## The Goal

Build a CNN that classifies CIFAR-10 images into 10 categories:
airplane, automobile, bird, cat, deer, dog, frog, horse, ship, truck

## Step 1: Setup and Data

\`\`\`python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Transforms
train_transform = transforms.Compose([
    transforms.RandomHorizontalFlip(),
    transforms.RandomCrop(32, padding=4),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

test_transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

# Load data
train_data = datasets.CIFAR10('./data', train=True, download=True, transform=train_transform)
test_data = datasets.CIFAR10('./data', train=False, transform=test_transform)

train_loader = DataLoader(train_data, batch_size=64, shuffle=True, num_workers=2)
test_loader = DataLoader(test_data, batch_size=64, shuffle=False, num_workers=2)

classes = ('plane', 'car', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck')
\`\`\`

## Step 2: Build the CNN

\`\`\`python
class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        
        # Convolutional layers
        self.conv_layers = nn.Sequential(
            # Block 1: 3 → 32 channels
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.Conv2d(32, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Dropout(0.25),
            
            # Block 2: 32 → 64 channels
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Dropout(0.25),
        )
        
        # Fully connected layers
        self.fc_layers = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 8 * 8, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, 10)
        )
    
    def forward(self, x):
        x = self.conv_layers(x)
        x = self.fc_layers(x)
        return x

model = CNN().to(device)
print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")
\`\`\`

## Step 3: Training Loop

\`\`\`python
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=3)

def train_epoch(model, loader, criterion, optimizer, device):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    
    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
        _, predicted = outputs.max(1)
        total += labels.size(0)
        correct += predicted.eq(labels).sum().item()
    
    return running_loss / len(loader), 100. * correct / total

def evaluate(model, loader, criterion, device):
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0
    
    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            
            running_loss += loss.item()
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()
    
    return running_loss / len(loader), 100. * correct / total
\`\`\`

## Step 4: Train the Model

\`\`\`python
num_epochs = 20
best_acc = 0.0

for epoch in range(num_epochs):
    train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer, device)
    val_loss, val_acc = evaluate(model, test_loader, criterion, device)
    
    scheduler.step(val_loss)
    
    print(f"Epoch {epoch+1}/{num_epochs}")
    print(f"  Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}%")
    print(f"  Val Loss:   {val_loss:.4f}, Val Acc:   {val_acc:.2f}%")
    
    if val_acc > best_acc:
        best_acc = val_acc
        torch.save(model.state_dict(), 'best_model.pth')
        print(f"  ✓ New best model saved!")

print(f"\\nBest Accuracy: {best_acc:.2f}%")
\`\`\`

## Step 5: Evaluate Per Class

\`\`\`python
# Load best model
model.load_state_dict(torch.load('best_model.pth'))

# Per-class accuracy
class_correct = [0] * 10
class_total = [0] * 10

model.eval()
with torch.no_grad():
    for images, labels in test_loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        _, predicted = outputs.max(1)
        
        for i in range(labels.size(0)):
            label = labels[i].item()
            class_correct[label] += (predicted[i] == label).item()
            class_total[label] += 1

for i, cls in enumerate(classes):
    acc = 100 * class_correct[i] / class_total[i]
    print(f'{cls:10s}: {acc:.1f}%')
\`\`\`

## Expected Results

After 20 epochs, you should see:
- **Training accuracy:** ~90%
- **Validation accuracy:** ~80-85%
- Some classes (truck, ship) will be easier than others (cat, dog)

## Next Steps to Improve

1. **More data augmentation:** AutoAugment, Cutout
2. **Better architecture:** ResNet, EfficientNet
3. **Learning rate scheduling:** Cosine annealing
4. **Longer training:** 100+ epochs with early stopping
5. **Transfer learning:** Start from pretrained ImageNet weights`,
      codeExamples: JSON.stringify([
        {
          title: "Complete CIFAR-10 CNN",
          language: "python",
          code: `import torch
import torch.nn as nn
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# Data
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5,0.5,0.5), (0.5,0.5,0.5))
])
train_data = datasets.CIFAR10('./data', train=True, download=True, transform=transform)
train_loader = DataLoader(train_data, batch_size=64, shuffle=True)

# Model
class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Flatten(),
            nn.Linear(64*8*8, 256), nn.ReLU(),
            nn.Linear(256, 10)
        )
    def forward(self, x): return self.net(x)

model = CNN().cuda()
opt = torch.optim.Adam(model.parameters())
loss_fn = nn.CrossEntropyLoss()

# Train
for epoch in range(10):
    for x, y in train_loader:
        x, y = x.cuda(), y.cuda()
        opt.zero_grad()
        loss_fn(model(x), y).backward()
        opt.step()`
        }
      ]),
      keyPoints: [
        "CNNs use Conv2d → BatchNorm → ReLU → MaxPool patterns",
        "Data augmentation (flip, crop) helps prevent overfitting",
        "Always normalize input images",
        "Use dropout and batch normalization for regularization",
        "Save the best model based on validation accuracy",
        "Evaluate per-class accuracy to understand model weaknesses",
      ],
      estimatedTime: 45,
      difficulty: "INTERMEDIATE",
      order: 6,
      isPublished: true,
    },
  });
  console.log("✅ Lesson 6: CNN Project");

  const lessonCount = await prisma.lesson.count({
    where: { section: { chapter: { number: 30 } } }
  });

  console.log(`\n🎉 Chapter 30 Complete! ${lessonCount} lessons created.`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
