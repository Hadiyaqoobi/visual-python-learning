const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = {
  // CHAPTER 26: PERCEPTRONS
  'what-is-a-perceptron': `# What is a Perceptron?

The perceptron is the simplest neural network - a single artificial neuron.

## Biological Inspiration

Real neurons receive signals, process them, and fire if threshold exceeded.

## The Math

\`\`\`
output = activation(w₁x₁ + w₂x₂ + ... + wₙxₙ + b)
       = activation(w·x + b)
\`\`\`

## Implementation

\`\`\`python
import numpy as np

class Perceptron:
    def __init__(self, n_features, lr=0.01):
        self.weights = np.zeros(n_features)
        self.bias = 0
        self.lr = lr
    
    def activation(self, x):
        return 1 if x > 0 else 0
    
    def predict(self, X):
        linear = np.dot(X, self.weights) + self.bias
        return np.array([self.activation(x) for x in linear])
    
    def fit(self, X, y, epochs=100):
        for epoch in range(epochs):
            errors = 0
            for xi, yi in zip(X, y):
                pred = self.activation(np.dot(xi, self.weights) + self.bias)
                error = yi - pred
                
                self.weights += self.lr * error * xi
                self.bias += self.lr * error
                errors += int(error != 0)
            
            if errors == 0:
                print(f"Converged at epoch {epoch}")
                break

# AND gate
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([0, 0, 0, 1])

p = Perceptron(n_features=2)
p.fit(X, y)
print(p.predict(X))  # [0, 0, 0, 1]
\`\`\`

## What Can It Learn?

✓ AND gate (linearly separable)
✓ OR gate (linearly separable)
✗ XOR gate (NOT linearly separable)

## Historical Significance

- 1958: Rosenblatt invents perceptron
- 1969: Minsky shows XOR limitation → AI winter
- Later: Multi-layer networks solve everything!`,

  'linear-decision-boundaries': `# Linear Decision Boundaries

A perceptron creates a line (or hyperplane) separating classes.

## The Equation

Decision boundary: w·x + b = 0

- w·x + b > 0 → Class 1
- w·x + b < 0 → Class 0

## Visualizing

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

def plot_decision_boundary(weights, bias, X, y):
    x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
    
    # w1*x1 + w2*x2 + b = 0  →  x2 = -(w1*x1 + b)/w2
    x1_line = np.linspace(x_min, x_max, 100)
    x2_line = -(weights[0] * x1_line + bias) / weights[1]
    
    plt.scatter(X[y==0][:, 0], X[y==0][:, 1], c='blue', label='Class 0')
    plt.scatter(X[y==1][:, 0], X[y==1][:, 1], c='red', label='Class 1')
    plt.plot(x1_line, x2_line, 'g-', label='Boundary')
    plt.legend()
    plt.show()
\`\`\`

## Linearly Separable Data

Data is linearly separable if ONE line can perfectly separate classes.

\`\`\`python
from sklearn.linear_model import Perceptron

# Test if separable
model = Perceptron(max_iter=1000)
model.fit(X, y)
is_separable = model.score(X, y) == 1.0
\`\`\`

## Limitations

Linear boundaries CANNOT classify:
- XOR pattern
- Circular clusters
- Any non-linearly separable data

Solution: Multiple layers!`,

  'perceptron-learning-algorithm': `# Perceptron Learning Algorithm

Simple yet powerful - guaranteed to converge for linearly separable data!

## The Algorithm

\`\`\`
1. Initialize weights w = 0, bias b = 0
2. For each example (x, y):
   a. Predict: ŷ = sign(w·x + b)
   b. If wrong (ŷ ≠ y):
      w = w + y·x
      b = b + y
3. Repeat until no errors
\`\`\`

## Implementation

\`\`\`python
import numpy as np

class PerceptronLearning:
    def __init__(self, lr=1.0):
        self.lr = lr
        self.weights = None
        self.bias = None
        self.errors_per_epoch = []
    
    def fit(self, X, y, max_epochs=100):
        n_samples, n_features = X.shape
        y_ = np.where(y <= 0, -1, 1)
        
        self.weights = np.zeros(n_features)
        self.bias = 0
        
        for epoch in range(max_epochs):
            errors = 0
            for xi, yi in zip(X, y_):
                linear = np.dot(xi, self.weights) + self.bias
                pred = np.sign(linear)
                
                if pred != yi:
                    self.weights += self.lr * yi * xi
                    self.bias += self.lr * yi
                    errors += 1
            
            self.errors_per_epoch.append(errors)
            if errors == 0:
                print(f"Converged at epoch {epoch + 1}")
                return self
        
        return self
    
    def predict(self, X):
        linear = np.dot(X, self.weights) + self.bias
        return np.where(linear >= 0, 1, 0)
\`\`\`

## Convergence Theorem

If data is linearly separable, perceptron WILL converge!

Mistakes bounded by: (R/γ)²
- R = max point distance from origin
- γ = margin (min distance to boundary)`,

  'activation-functions': `# Activation Functions

Activation functions introduce non-linearity, enabling complex learning.

## Why Needed?

Without activation: layer₂ = W₂·(W₁·x) = W·x (still linear!)

## Common Functions

### Step (Original Perceptron)
\`\`\`python
def step(x):
    return 1 if x > 0 else 0
# Problem: Not differentiable
\`\`\`

### Sigmoid
\`\`\`python
def sigmoid(x):
    return 1 / (1 + np.exp(-x))
# Output: (0, 1) - good for probabilities
# Problem: Vanishing gradients
\`\`\`

### Tanh
\`\`\`python
def tanh(x):
    return np.tanh(x)
# Output: (-1, 1) - zero-centered
\`\`\`

### ReLU (Most Popular)
\`\`\`python
def relu(x):
    return np.maximum(0, x)
# Fast, no vanishing gradient for positive
# Problem: "Dying ReLU"
\`\`\`

### Leaky ReLU
\`\`\`python
def leaky_relu(x, alpha=0.01):
    return np.where(x > 0, x, alpha * x)
# Fixes dying ReLU
\`\`\`

### Softmax (Output Layer)
\`\`\`python
def softmax(x):
    exp_x = np.exp(x - np.max(x))
    return exp_x / exp_x.sum()
# Converts to probabilities summing to 1
\`\`\`

## Choosing Activations

| Layer | Activation |
|-------|------------|
| Hidden | ReLU, Leaky ReLU |
| Binary output | Sigmoid |
| Multi-class output | Softmax |
| Regression output | None (linear) |`,

  'xor-problem': `# The XOR Problem

XOR revealed perceptron's limitation and drove multi-layer development.

## What is XOR?

XOR outputs 1 only when inputs differ:

| A | B | Output |
|---|---|--------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

## Why Perceptrons Fail

No single line can separate the 1s from 0s!

\`\`\`python
from sklearn.linear_model import Perceptron

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y_xor = np.array([0, 1, 1, 0])

model = Perceptron(max_iter=1000)
model.fit(X, y_xor)
print(model.score(X, y_xor))  # ~50-75%, never 100%!
\`\`\`

## The Solution: Hidden Layer

\`\`\`python
from sklearn.neural_network import MLPClassifier

mlp = MLPClassifier(hidden_layer_sizes=(4,), max_iter=10000)
mlp.fit(X, y_xor)
print(mlp.predict(X))  # [0, 1, 1, 0] ✓
print(mlp.score(X, y_xor))  # 1.0 ✓
\`\`\`

## How It Works

Hidden layer creates intermediate features:
- h1 = x1 AND x2
- h2 = x1 OR x2
- output = h2 AND NOT h1 = XOR!

## Historical Impact

- 1969: Minsky's book showed this limitation
- Led to first "AI winter"
- 1986: Backpropagation popularized
- Today: Deep learning solves far more!`,

  'multi-layer-perceptrons': `# Multi-Layer Perceptrons (MLPs)

MLPs add hidden layers, enabling learning of any function.

## Architecture

\`\`\`
Input → Hidden₁ → Hidden₂ → ... → Output
\`\`\`

## Why Hidden Layers?

Each layer learns more abstract features:
- Layer 1: Edges
- Layer 2: Shapes
- Layer 3: Objects

## Implementation

\`\`\`python
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split

digits = load_digits()
X_train, X_test, y_train, y_test = train_test_split(
    digits.data, digits.target, test_size=0.2
)

mlp = MLPClassifier(
    hidden_layer_sizes=(128, 64),  # Two hidden layers
    activation='relu',
    solver='adam',
    max_iter=500
)

mlp.fit(X_train, y_train)
print(f"Training: {mlp.score(X_train, y_train):.3f}")
print(f"Test: {mlp.score(X_test, y_test):.3f}")
\`\`\`

## Key Hyperparameters

| Parameter | Description |
|-----------|-------------|
| hidden_layer_sizes | Neurons per layer |
| activation | relu, tanh, logistic |
| solver | adam, sgd |
| learning_rate_init | Starting learning rate |
| batch_size | Mini-batch size |

## Universal Approximation

MLPs with ONE hidden layer can approximate ANY continuous function!

This is why neural networks are so powerful.`,

  // CHAPTER 27: NEURAL NETWORKS
  'neural-network-architecture': `# Neural Network Architecture

Understanding network structure is key to effective design.

## Components

- **Input Layer**: Receives features
- **Hidden Layers**: Learn representations
- **Output Layer**: Makes predictions

## Layer Types

\`\`\`python
import torch.nn as nn

# Dense (Fully Connected)
nn.Linear(in_features=784, out_features=256)

# Convolutional
nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3)

# Recurrent
nn.LSTM(input_size=128, hidden_size=256)

# Normalization
nn.BatchNorm2d(num_features=64)

# Dropout
nn.Dropout(p=0.5)
\`\`\`

## Depth vs Width

**Depth** = Number of layers
**Width** = Neurons per layer

- Deeper: More abstract hierarchies
- Wider: More memorization capacity

## Example Architecture

\`\`\`python
model = nn.Sequential(
    nn.Linear(784, 512),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(512, 256),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(256, 10)
)
\`\`\`

## Parameter Count

\`\`\`python
total = sum(p.numel() for p in model.parameters())
print(f"Parameters: {total:,}")
\`\`\``,

  'forward-propagation': `# Forward Propagation

How data flows through a network to produce predictions.

## The Process

\`\`\`
Input → Linear → Activation → Linear → Activation → Output
  x   →  W₁x+b₁ →    a₁     → W₂a₁+b₂ →    a₂     →   ŷ
\`\`\`

## Step by Step

1. **Linear**: z = W @ x + b
2. **Activation**: a = f(z)
3. **Repeat** for each layer

## Implementation

\`\`\`python
import numpy as np

def forward(X, weights, biases, activations):
    A = X
    cache = {'A0': X}
    
    for i, (W, b, act) in enumerate(zip(weights, biases, activations)):
        Z = A @ W + b
        
        if act == 'relu':
            A = np.maximum(0, Z)
        elif act == 'sigmoid':
            A = 1 / (1 + np.exp(-Z))
        elif act == 'softmax':
            exp_Z = np.exp(Z - np.max(Z, axis=1, keepdims=True))
            A = exp_Z / exp_Z.sum(axis=1, keepdims=True)
        
        cache[f'Z{i+1}'] = Z
        cache[f'A{i+1}'] = A
    
    return A, cache
\`\`\`

## PyTorch Forward

\`\`\`python
class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 256)
        self.fc2 = nn.Linear(256, 10)
    
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x

model = SimpleNet()
output = model(X)  # Calls forward()
\`\`\``,

  'loss-functions': `# Loss Functions

Loss measures how wrong predictions are. Training minimizes loss.

## Regression Losses

### Mean Squared Error (MSE)
\`\`\`python
def mse(y_true, y_pred):
    return np.mean((y_true - y_pred) ** 2)
\`\`\`

### Mean Absolute Error (MAE)
\`\`\`python
def mae(y_true, y_pred):
    return np.mean(np.abs(y_true - y_pred))
\`\`\`

## Classification Losses

### Binary Cross-Entropy
\`\`\`python
def bce(y_true, y_pred):
    eps = 1e-15
    y_pred = np.clip(y_pred, eps, 1 - eps)
    return -np.mean(y_true * np.log(y_pred) + 
                    (1 - y_true) * np.log(1 - y_pred))
\`\`\`

### Categorical Cross-Entropy
\`\`\`python
def cce(y_true, y_pred):
    eps = 1e-15
    y_pred = np.clip(y_pred, eps, 1 - eps)
    return -np.mean(np.sum(y_true * np.log(y_pred), axis=1))
\`\`\`

## PyTorch Losses

\`\`\`python
import torch.nn as nn

# Regression
mse_loss = nn.MSELoss()

# Binary Classification
bce_loss = nn.BCEWithLogitsLoss()

# Multi-class
ce_loss = nn.CrossEntropyLoss()
\`\`\`

## Choosing Loss

| Task | Loss | Output Activation |
|------|------|-------------------|
| Regression | MSE | Linear |
| Binary | BCE | Sigmoid |
| Multi-class | CE | Softmax |`,

  'backpropagation': `# Backpropagation

The algorithm that calculates gradients, enabling learning.

## The Process

1. **Forward**: Compute predictions and loss
2. **Backward**: Compute gradients via chain rule
3. **Update**: Adjust weights

## Chain Rule

For y = f(g(x)):  dy/dx = dy/dg × dg/dx

In networks: ∂L/∂W₁ = ∂L/∂a₂ × ∂a₂/∂a₁ × ∂a₁/∂W₁

## Implementation

\`\`\`python
class SimpleNetwork:
    def __init__(self, sizes):
        self.W1 = np.random.randn(sizes[0], sizes[1]) * 0.01
        self.b1 = np.zeros((1, sizes[1]))
        self.W2 = np.random.randn(sizes[1], sizes[2]) * 0.01
        self.b2 = np.zeros((1, sizes[2]))
    
    def forward(self, X):
        self.Z1 = X @ self.W1 + self.b1
        self.A1 = np.maximum(0, self.Z1)  # ReLU
        self.Z2 = self.A1 @ self.W2 + self.b2
        self.A2 = softmax(self.Z2)
        return self.A2
    
    def backward(self, X, y_true):
        m = X.shape[0]
        
        # Output gradient
        dZ2 = self.A2 - y_true
        dW2 = (self.A1.T @ dZ2) / m
        db2 = np.sum(dZ2, axis=0, keepdims=True) / m
        
        # Hidden gradient
        dA1 = dZ2 @ self.W2.T
        dZ1 = dA1 * (self.Z1 > 0)  # ReLU derivative
        dW1 = (X.T @ dZ1) / m
        db1 = np.sum(dZ1, axis=0, keepdims=True) / m
        
        return {'dW1': dW1, 'db1': db1, 'dW2': dW2, 'db2': db2}
\`\`\`

## PyTorch Autograd

\`\`\`python
output = model(X)
loss = criterion(output, y)
loss.backward()  # Computes ALL gradients automatically!

# Gradients stored in .grad
print(model.fc1.weight.grad.shape)
\`\`\``,

  'gradient-flow-problems': `# Gradient Flow Problems

Deep networks face gradient challenges.

## Vanishing Gradients

Gradients shrink exponentially backward:

\`\`\`
Layer N:   gradient = 0.5
Layer N-1: 0.5 × 0.5 = 0.25
Layer N-2: 0.25 × 0.5 = 0.125
...
Layer 1:   ≈ 0.00001  ← Too small!
\`\`\`

**Causes**: Sigmoid/tanh, deep networks, poor initialization

**Solutions**:
\`\`\`python
# Use ReLU
nn.ReLU()

# Batch Normalization
nn.BatchNorm1d(256)

# Skip connections
def forward(self, x):
    return x + self.layers(x)

# Proper initialization
nn.init.kaiming_normal_(layer.weight)
\`\`\`

## Exploding Gradients

Gradients grow exponentially:

**Symptoms**: Loss becomes NaN, weights oscillate

**Solutions**:
\`\`\`python
# Gradient clipping
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

# Lower learning rate
optimizer = Adam(model.parameters(), lr=0.0001)
\`\`\`

## Dying ReLU

Neurons stuck at 0 forever.

**Solution**: Leaky ReLU
\`\`\`python
nn.LeakyReLU(0.01)
\`\`\`

## Monitoring

\`\`\`python
for name, param in model.named_parameters():
    if param.grad is not None:
        grad_norm = param.grad.norm().item()
        if grad_norm < 1e-7:
            print(f"Vanishing: {name}")
        elif grad_norm > 1000:
            print(f"Exploding: {name}")
\`\`\``,

  'training-neural-networks': `# Training Neural Networks

A complete guide to training effectively.

## The Training Loop

\`\`\`python
import torch
import torch.nn as nn
import torch.optim as optim

model = MyModel()
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

for epoch in range(epochs):
    model.train()
    for X_batch, y_batch in train_loader:
        optimizer.zero_grad()
        output = model(X_batch)
        loss = criterion(output, y_batch)
        loss.backward()
        optimizer.step()
    
    # Validation
    model.eval()
    with torch.no_grad():
        val_loss = evaluate(model, val_loader)
    
    print(f"Epoch {epoch}: Loss={loss:.4f}, Val={val_loss:.4f}")
\`\`\`

## Optimizers

\`\`\`python
# SGD with momentum
optim.SGD(params, lr=0.01, momentum=0.9)

# Adam (good default)
optim.Adam(params, lr=0.001)

# AdamW (better weight decay)
optim.AdamW(params, lr=0.001, weight_decay=0.01)
\`\`\`

## Learning Rate Scheduling

\`\`\`python
# Step decay
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=30, gamma=0.1)

# Reduce on plateau
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=10)
\`\`\`

## Regularization

\`\`\`python
# Dropout
nn.Dropout(0.5)

# Weight decay
optimizer = Adam(params, weight_decay=0.01)

# Data augmentation
transforms.RandomHorizontalFlip()
\`\`\`

## Early Stopping

\`\`\`python
best_loss = float('inf')
patience_counter = 0

for epoch in range(max_epochs):
    val_loss = validate()
    if val_loss < best_loss:
        best_loss = val_loss
        patience_counter = 0
        save_model()
    else:
        patience_counter += 1
        if patience_counter >= patience:
            print("Early stopping!")
            break
\`\`\``,

  // CHAPTER 28: DEEP LEARNING
  'introduction-to-deep-learning': `# Introduction to Deep Learning

Neural networks with many layers.

## What Makes It "Deep"?

Shallow: Input → Hidden → Output
Deep: Input → Hidden₁ → Hidden₂ → ... → Hidden_n → Output

Modern networks can have hundreds of layers!

## Why It Works

### Hierarchical Learning

Each layer learns more abstract features:
- Layer 1: Edges
- Layer 2: Shapes  
- Layer 3: Parts
- Layer 4: Objects

## The Revolution

**What changed?**
- Data: Massive datasets
- Compute: GPUs
- Algorithms: Better architectures
- Software: PyTorch, TensorFlow

**Milestones:**
- 2012: AlexNet (CNNs)
- 2017: Transformers
- 2022: ChatGPT

## When to Use

✓ Large datasets
✓ Complex patterns (images, text)
✓ State-of-the-art needed

✗ Small datasets
✗ Need interpretability
✗ Limited compute`,

  'pooling-layers': `# Pooling Layers

Reduce spatial dimensions while keeping important features.

## Why Pool?

1. Reduce computation
2. Translation invariance
3. Prevent overfitting
4. Increase receptive field

## Max Pooling

\`\`\`python
import torch.nn as nn

max_pool = nn.MaxPool2d(kernel_size=2, stride=2)

# 4×4 input → 2×2 output (takes max of each 2×2 region)
\`\`\`

## Average Pooling

\`\`\`python
avg_pool = nn.AvgPool2d(kernel_size=2, stride=2)
\`\`\`

## Global Average Pooling

\`\`\`python
# Reduces each channel to single value
gap = nn.AdaptiveAvgPool2d(1)

x = torch.randn(1, 64, 7, 7)
output = gap(x)  # (1, 64, 1, 1)
\`\`\`

## In a CNN

\`\`\`python
nn.Sequential(
    nn.Conv2d(3, 32, 3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),  # 32×32 → 16×16
    
    nn.Conv2d(32, 64, 3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),  # 16×16 → 8×8
)
\`\`\`

## Alternative: Strided Convolutions

\`\`\`python
# Instead of pool
nn.Conv2d(32, 64, 3, stride=2, padding=1)
\`\`\``,

  'convolutional-neural-networks': `# Convolutional Neural Networks (CNNs)

The foundation of modern computer vision.

## Why CNNs?

FC networks don't scale:
224×224 RGB = 150,528 inputs
1000 neurons = 150 MILLION parameters!

CNNs exploit image structure:
- Local connectivity
- Parameter sharing
- Translation equivariance

## Architecture

\`\`\`python
class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2),
            
            nn.Conv2d(32, 64, 3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 8 * 8, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, 10)
        )
    
    def forward(self, x):
        x = self.features(x)
        return self.classifier(x)
\`\`\`

## Famous Architectures

- **LeNet** (1998): First CNN
- **AlexNet** (2012): Deep CNNs + GPUs
- **VGG** (2014): Deeper, 3×3 filters
- **ResNet** (2015): Skip connections

## Transfer Learning

\`\`\`python
from torchvision import models

model = models.resnet50(pretrained=True)

# Freeze layers
for param in model.parameters():
    param.requires_grad = False

# Replace final layer
model.fc = nn.Linear(2048, num_classes)
\`\`\``,

  'convolution-operation': `# The Convolution Operation

The core operation of CNNs.

## How It Works

A filter slides across input, computing element-wise multiply and sum:

\`\`\`
Filter slides → Multiply → Sum → Output pixel
\`\`\`

## Implementation

\`\`\`python
def convolve2d(image, kernel):
    img_h, img_w = image.shape
    ker_h, ker_w = kernel.shape
    
    out_h = img_h - ker_h + 1
    out_w = img_w - ker_w + 1
    output = np.zeros((out_h, out_w))
    
    for i in range(out_h):
        for j in range(out_w):
            patch = image[i:i+ker_h, j:j+ker_w]
            output[i, j] = np.sum(patch * kernel)
    
    return output
\`\`\`

## PyTorch

\`\`\`python
conv = nn.Conv2d(
    in_channels=3,
    out_channels=32,
    kernel_size=3,
    stride=1,
    padding=1
)
\`\`\`

## Parameters

- **kernel_size**: Filter dimensions
- **stride**: How far filter moves
- **padding**: Border handling

## Output Size

\`\`\`
Output = (Input - Kernel + 2×Padding) / Stride + 1
\`\`\`

## Common Filters

\`\`\`python
# Edge detection
edge = [[-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]]

# Blur
blur = [[1/9]*3]*3

# Sharpen
sharp = [[ 0, -1,  0],
         [-1,  5, -1],
         [ 0, -1,  0]]
\`\`\``,

  'recurrent-neural-networks': `# Recurrent Neural Networks (RNNs)

Designed for sequential data where order matters.

## Why RNNs?

Standard networks:
- Process inputs independently
- No memory
- Can't handle variable length

RNNs maintain hidden state as memory.

## Basic RNN

\`\`\`python
rnn = nn.RNN(
    input_size=10,
    hidden_size=20,
    num_layers=2,
    batch_first=True
)

x = torch.randn(32, 50, 10)  # batch, seq_len, features
output, hidden = rnn(x)
\`\`\`

## LSTM

Solves vanishing gradient with gates:

\`\`\`python
lstm = nn.LSTM(
    input_size=10,
    hidden_size=20,
    num_layers=2,
    batch_first=True,
    bidirectional=True
)

output, (hidden, cell) = lstm(x)
\`\`\`

## GRU

Simpler than LSTM:

\`\`\`python
gru = nn.GRU(input_size=10, hidden_size=20, batch_first=True)
\`\`\`

## Text Classification

\`\`\`python
class TextClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_classes):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, num_classes)
    
    def forward(self, x):
        embedded = self.embedding(x)
        _, (hidden, _) = self.lstm(embedded)
        return self.fc(hidden[-1])
\`\`\``,

  'modern-architectures': `# Modern Deep Learning Architectures

## Transformer

Dominant for NLP and increasingly vision:

\`\`\`python
class TransformerBlock(nn.Module):
    def __init__(self, embed_dim, num_heads, ff_dim):
        super().__init__()
        self.attention = nn.MultiheadAttention(embed_dim, num_heads)
        self.norm1 = nn.LayerNorm(embed_dim)
        self.norm2 = nn.LayerNorm(embed_dim)
        self.ff = nn.Sequential(
            nn.Linear(embed_dim, ff_dim),
            nn.GELU(),
            nn.Linear(ff_dim, embed_dim)
        )
    
    def forward(self, x):
        attn_out, _ = self.attention(x, x, x)
        x = self.norm1(x + attn_out)
        x = self.norm2(x + self.ff(x))
        return x
\`\`\`

## ResNet (Skip Connections)

\`\`\`python
class ResBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, 3, padding=1)
        self.conv2 = nn.Conv2d(channels, channels, 3, padding=1)
        self.bn1 = nn.BatchNorm2d(channels)
        self.bn2 = nn.BatchNorm2d(channels)
    
    def forward(self, x):
        residual = x
        x = F.relu(self.bn1(self.conv1(x)))
        x = self.bn2(self.conv2(x))
        return F.relu(x + residual)  # Skip!
\`\`\`

## Using Pre-trained Models

\`\`\`python
from torchvision import models

resnet = models.resnet50(pretrained=True)
vit = models.vit_b_16(pretrained=True)
efficientnet = models.efficientnet_b0(pretrained=True)
\`\`\`

## Architecture Timeline

| Year | Model | Innovation |
|------|-------|------------|
| 2012 | AlexNet | Deep CNNs |
| 2015 | ResNet | Skip connections |
| 2017 | Transformer | Self-attention |
| 2020 | ViT | Transformers for vision |`
};

async function main() {
  console.log("Expanding Chapters 26-28...");
  let updated = 0;
  for (const [slug, content] of Object.entries(updates)) {
    const result = await prisma.lesson.updateMany({
      where: { slug },
      data: { content }
    });
    if (result.count > 0) {
      console.log(`✅ ${slug}: ${content.length} chars`);
      updated++;
    }
  }
  console.log(`\nUpdated ${updated} lessons`);
}

main().finally(() => prisma.$disconnect());
