import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 2: Lessons 22.2.1-22.2.2 (Logistic Regression)...\n");

  const section22_2 = await prisma.section.findFirst({ where: { number: 22.2 } });
  if (!section22_2) throw new Error("Section 22.2 not found. Run part 1 first.");

  // Lesson 22.2.1
  const lesson22_2_1 = await prisma.lesson.upsert({
    where: { slug: "logistic-regression-introduction" },
    update: {},
    create: {
      sectionId: section22_2.id,
      number: 22.21,
      title: "Logistic Regression Introduction",
      slug: "logistic-regression-introduction",
      objectives: [
        "Understand why linear regression fails for classification",
        "Learn the sigmoid function",
        "See how logistic regression outputs probabilities",
        "Implement simple logistic regression",
      ],
      content: `# Logistic Regression

## Why Not Linear Regression?

Linear regression predicts continuous values (-∞ to +∞).
For classification, we need probabilities (0 to 1).

**Problem**: Linear model can predict values outside [0, 1]!

## The Sigmoid Function

\`\`\`
σ(z) = 1 / (1 + e^(-z))
\`\`\`

Properties:
- Output always between 0 and 1
- σ(0) = 0.5
- Large positive z → 1
- Large negative z → 0

## Logistic Regression Model

\`\`\`
P(y=1|x) = σ(w₀ + w₁x₁ + w₂x₂ + ...)
\`\`\`

1. Linear combination of features
2. Pass through sigmoid
3. Get probability

## Making Predictions

- P(y=1) ≥ 0.5 → Predict class 1
- P(y=1) < 0.5 → Predict class 0

## Key Advantages

- Outputs interpretable probabilities
- Works well with linear boundaries
- Fast to train
- Less prone to overfitting`,
      codeExamples: JSON.stringify([
        {
          id: "sigmoid-function",
          title: "The Sigmoid Function",
          code: "import math\n\ndef sigmoid(z):\n    \"\"\"Sigmoid activation function\"\"\"\n    # Clip to avoid overflow\n    z = max(-500, min(500, z))\n    return 1 / (1 + math.exp(-z))\n\nprint('SIGMOID FUNCTION')\nprint('=' * 45)\nprint('σ(z) = 1 / (1 + e^(-z))')\nprint(f'\\n{\"z\":>8} {\"σ(z)\":>10} {\"Visualization\":<20}')\nprint('-' * 45)\n\nfor z in [-5, -3, -1, 0, 1, 3, 5]:\n    s = sigmoid(z)\n    bar = '█' * int(s * 20)\n    print(f'{z:>8} {s:>10.4f} |{bar:<20}|')\n\nprint('\\nKey properties:')\nprint(f'  σ(0) = {sigmoid(0):.1f} (midpoint)')\nprint(f'  σ(large+) → 1')\nprint(f'  σ(large-) → 0')\nprint('  Always between 0 and 1!')",
          description: "Understand sigmoid function",
        },
        {
          id: "logistic-prediction",
          title: "Logistic Regression Prediction",
          code: "import math\n\ndef sigmoid(z):\n    z = max(-500, min(500, z))\n    return 1 / (1 + math.exp(-z))\n\ndef predict_proba(x, weights, bias):\n    \"\"\"Predict probability using logistic regression\"\"\"\n    z = bias\n    for xi, wi in zip(x, weights):\n        z += xi * wi\n    return sigmoid(z)\n\n# Example: Predicting pass/fail based on study hours\n# Model: P(pass) = σ(w₀ + w₁ * hours)\nweights = [0.8]  # Weight for hours\nbias = -4  # Intercept\n\nprint('LOGISTIC REGRESSION PREDICTION')\nprint('=' * 50)\nprint('Model: P(pass) = σ(-4 + 0.8 × hours)')\nprint(f'\\n{\"Hours\":>8} {\"z\":>8} {\"P(pass)\":>10} {\"Predict\":>10}')\nprint('-' * 40)\n\nfor hours in [1, 3, 5, 7, 9, 11]:\n    z = bias + weights[0] * hours\n    prob = predict_proba([hours], weights, bias)\n    prediction = 'PASS' if prob >= 0.5 else 'FAIL'\n    print(f'{hours:>8} {z:>8.1f} {prob:>10.3f} {prediction:>10}')\n\nprint('\\nDecision boundary at 5 hours (where P = 0.5)')",
          description: "Make predictions with logistic regression",
        },
        {
          id: "simple-training",
          title: "Simple Gradient Descent Training",
          code: "import math\nimport random\n\ndef sigmoid(z):\n    z = max(-500, min(500, z))\n    return 1 / (1 + math.exp(-z))\n\ndef train_logistic(X, y, lr=0.1, epochs=100):\n    \"\"\"Train logistic regression with gradient descent\"\"\"\n    n_features = len(X[0])\n    weights = [0.0] * n_features\n    bias = 0.0\n    \n    for epoch in range(epochs):\n        total_loss = 0\n        for xi, yi in zip(X, y):\n            # Forward pass\n            z = bias + sum(w * x for w, x in zip(weights, xi))\n            pred = sigmoid(z)\n            \n            # Loss (binary cross-entropy)\n            loss = -yi * math.log(pred + 1e-10) - (1-yi) * math.log(1-pred + 1e-10)\n            total_loss += loss\n            \n            # Gradient\n            error = pred - yi\n            \n            # Update weights\n            for j in range(n_features):\n                weights[j] -= lr * error * xi[j]\n            bias -= lr * error\n        \n        if epoch % 20 == 0:\n            print(f'Epoch {epoch}: Loss = {total_loss/len(X):.4f}')\n    \n    return weights, bias\n\n# Training data: study hours → pass (1) / fail (0)\nX = [[2], [3], [4], [5], [6], [7], [8], [9]]\ny = [0, 0, 0, 1, 1, 1, 1, 1]\n\nprint('TRAINING LOGISTIC REGRESSION')\nprint('=' * 45)\nweights, bias = train_logistic(X, y, lr=0.5, epochs=100)\n\nprint(f'\\nLearned: w = {weights[0]:.3f}, b = {bias:.3f}')\nprint(f'Model: P(pass) = σ({bias:.2f} + {weights[0]:.2f} × hours)')",
          description: "Train logistic regression from scratch",
        },
      ]),
      keyPoints: [
        "Sigmoid maps any value to [0, 1]",
        "σ(z) = 1/(1 + e^(-z))",
        "Linear combination passed through sigmoid",
        "Output is probability P(y=1|x)",
        "Threshold at 0.5 for binary prediction",
        "Trained with gradient descent",
      ],
      hardwareDemo: "Watch sigmoid computation. See probability emerge from linear combination.",
      estimatedTime: 35,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson22_2_1.number}: ${lesson22_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson22_2_1.id,
        number: 1,
        title: "Implement Sigmoid",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Implement the sigmoid function and test it on various inputs.",
        starterCode: "import math\n\ndef sigmoid(z):\n    \"\"\"Compute sigmoid of z\"\"\"\n    return 1 / (1 + math.exp(-z))\n\nprint('SIGMOID FUNCTION')\nprint('=' * 35)\n\ntest_values = [-10, -5, -2, -1, 0, 1, 2, 5, 10]\n\nprint(f'{\"Input z\":>10} {\"σ(z)\":>12}')\nprint('-' * 25)\nfor z in test_values:\n    result = sigmoid(z)\n    print(f'{z:>10} {result:>12.6f}')\n\nprint('\\nVerify properties:')\nprint(f'  σ(0) = {sigmoid(0):.1f} ✓')\nprint(f'  σ(-∞) → 0')\nprint(f'  σ(+∞) → 1')",
        solution: "# Sigmoid implementation",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Sigmoid values", description: "Implement sigmoid" }]),
        hints: ["Formula: 1/(1+e^-z)", "e^-z uses math.exp(-z)", "Handle extreme values"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson22_2_1.id,
        number: 2,
        title: "Logistic Regression Prediction",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given weights and bias, predict probabilities for new data points.",
        starterCode: "import math\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef predict_proba(features, weights, bias):\n    \"\"\"Predict probability for a single sample\"\"\"\n    z = bias\n    for f, w in zip(features, weights):\n        z += f * w\n    return sigmoid(z)\n\n# Trained model: predict loan default based on income and debt\nweights = [-0.5, 0.8]  # [income_weight, debt_weight]\nbias = 1.0\n\n# New applicants: [income (normalized), debt (normalized)]\napplicants = [\n    [2.0, 0.5],   # High income, low debt\n    [0.5, 2.0],   # Low income, high debt\n    [1.0, 1.0],   # Average\n    [1.5, 0.3],   # Good\n]\n\nprint('LOAN DEFAULT PREDICTION')\nprint('=' * 55)\nprint(f'{\"Income\":>8} {\"Debt\":>8} {\"P(default)\":>12} {\"Risk\":>10}')\nprint('-' * 45)\n\nfor income, debt in applicants:\n    prob = predict_proba([income, debt], weights, bias)\n    risk = 'HIGH' if prob > 0.5 else 'LOW'\n    print(f'{income:>8.1f} {debt:>8.1f} {prob:>12.3f} {risk:>10}')",
        solution: "# Predict probabilities",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Predictions shown", description: "Logistic prediction" }]),
        hints: ["Compute z = bias + sum(w*x)", "Apply sigmoid to z", "Threshold at 0.5"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson22_2_1.id,
        number: 3,
        title: "Why Not Linear Regression?",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show why linear regression is problematic for classification.",
        starterCode: "# Linear regression for classification (BAD)\n\n# Training data: hours studied → pass (1) / fail (0)\nhours = [1, 2, 3, 4, 5, 6, 7, 8]\npassed = [0, 0, 0, 0, 1, 1, 1, 1]\n\n# Fit linear regression (simplified)\nmean_x = sum(hours) / len(hours)\nmean_y = sum(passed) / len(passed)\n\nnumerator = sum((x - mean_x) * (y - mean_y) for x, y in zip(hours, passed))\ndenominator = sum((x - mean_x) ** 2 for x in hours)\nslope = numerator / denominator\nintercept = mean_y - slope * mean_x\n\nprint('LINEAR REGRESSION FOR CLASSIFICATION')\nprint('=' * 50)\nprint(f'Model: y = {intercept:.3f} + {slope:.3f} × hours')\nprint(f'\\n{\"Hours\":>8} {\"Actual\":>8} {\"Predicted\":>10} {\"Problem?\":<15}')\nprint('-' * 45)\n\nfor h in [0, 2, 4, 6, 8, 10, 12]:\n    pred = intercept + slope * h\n    actual = '-'\n    if h in hours:\n        actual = passed[hours.index(h)]\n    problem = ''\n    if pred < 0:\n        problem = '< 0 (invalid!)'\n    elif pred > 1:\n        problem = '> 1 (invalid!)'\n    print(f'{h:>8} {str(actual):>8} {pred:>10.3f} {problem:<15}')\n\nprint('\\n⚠️  Linear regression can predict outside [0, 1]!')\nprint('   This is why we need logistic regression.')",
        solution: "# Linear regression fails for classification",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Problems shown", description: "Linear vs logistic" }]),
        hints: ["Linear predicts continuous", "Can go below 0 or above 1", "Not valid probabilities"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson22_2_1.id,
        number: 4,
        title: "Find Decision Threshold",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find where P(y=1) = 0.5 (the decision boundary).",
        starterCode: "import math\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\n# Model: P(pass) = σ(bias + weight × hours)\nweight = 1.2\nbias = -6.0\n\nprint('FINDING DECISION BOUNDARY')\nprint('=' * 45)\nprint(f'Model: P(pass) = σ({bias} + {weight} × hours)')\nprint('\\nDecision boundary is where P = 0.5')\nprint('σ(z) = 0.5 when z = 0')\nprint(f'So: {bias} + {weight} × hours = 0')\nprint(f'    hours = {-bias}/{weight} = {-bias/weight:.2f}')\n\nboundary = -bias / weight\n\nprint(f'\\nDecision boundary: {boundary:.2f} hours')\nprint(f'\\nVerification:')\nfor h in [boundary - 1, boundary, boundary + 1]:\n    z = bias + weight * h\n    p = sigmoid(z)\n    pred = 'PASS' if p >= 0.5 else 'FAIL'\n    print(f'  {h:.1f} hours: P = {p:.3f} → {pred}')",
        solution: "# Find where z = 0",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Boundary found", description: "Decision threshold" }]),
        hints: ["σ(0) = 0.5", "Solve bias + weight*x = 0", "x = -bias/weight"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson22_2_1.id,
        number: 5,
        title: "Manual Gradient Step",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Perform one gradient descent step to update weights.",
        starterCode: "import math\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\n# Single training example\nx = [3.0]  # 3 hours of study\ny = 0      # Failed\n\n# Initial weights\nweight = 0.5\nbias = -1.0\nlearning_rate = 0.1\n\nprint('MANUAL GRADIENT DESCENT STEP')\nprint('=' * 50)\nprint(f'Training example: x = {x[0]}, y = {y}')\nprint(f'Initial: weight = {weight}, bias = {bias}')\n\n# Forward pass\nz = bias + weight * x[0]\npred = sigmoid(z)\nprint(f'\\n1. Forward pass:')\nprint(f'   z = {bias} + {weight} × {x[0]} = {z}')\nprint(f'   P(y=1) = σ({z}) = {pred:.4f}')\n\n# Compute error\nerror = pred - y\nprint(f'\\n2. Error = prediction - actual = {pred:.4f} - {y} = {error:.4f}')\n\n# Compute gradients\ngrad_weight = error * x[0]\ngrad_bias = error\nprint(f'\\n3. Gradients:')\nprint(f'   ∂L/∂w = error × x = {error:.4f} × {x[0]} = {grad_weight:.4f}')\nprint(f'   ∂L/∂b = error = {grad_bias:.4f}')\n\n# Update weights\nnew_weight = weight - learning_rate * grad_weight\nnew_bias = bias - learning_rate * grad_bias\nprint(f'\\n4. Update (lr = {learning_rate}):')\nprint(f'   new_weight = {weight} - {learning_rate} × {grad_weight:.4f} = {new_weight:.4f}')\nprint(f'   new_bias = {bias} - {learning_rate} × {grad_bias:.4f} = {new_bias:.4f}')\n\n# Verify improvement\nnew_z = new_bias + new_weight * x[0]\nnew_pred = sigmoid(new_z)\nprint(f'\\n5. Verification:')\nprint(f'   Old prediction: {pred:.4f}')\nprint(f'   New prediction: {new_pred:.4f}')\nprint(f'   Moved toward y = {y} ✓' if abs(new_pred - y) < abs(pred - y) else '   ✗')",
        solution: "# One gradient step",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Weight updated", description: "Gradient step" }]),
        hints: ["Forward: compute prediction", "Error: pred - actual", "Update: w -= lr * grad"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 22.2.1`);

  // Lesson 22.2.2
  const lesson22_2_2 = await prisma.lesson.upsert({
    where: { slug: "decision-boundaries" },
    update: {},
    create: {
      sectionId: section22_2.id,
      number: 22.22,
      title: "Decision Boundaries",
      slug: "decision-boundaries",
      objectives: [
        "Understand what a decision boundary is",
        "See linear vs non-linear boundaries",
        "Visualize boundaries in 2D",
        "Know when linear boundaries work",
      ],
      content: `# Decision Boundaries

## What Is a Decision Boundary?

The surface that separates different classes in feature space.

For logistic regression: where P(y=1) = 0.5

## Linear Decision Boundary

Logistic regression creates a **linear** boundary:
- 1D: A point
- 2D: A line
- 3D: A plane
- nD: A hyperplane

## The Boundary Equation

\`\`\`
w₀ + w₁x₁ + w₂x₂ = 0
\`\`\`

This is where σ(z) = 0.5 (since σ(0) = 0.5)

## When Linear Works

✅ Classes are linearly separable
✅ Simple, interpretable
✅ Fast to compute

## When Linear Fails

❌ XOR problem
❌ Circular boundaries
❌ Complex patterns

## Solutions for Non-Linear

1. Feature engineering (add x², x₁x₂, etc.)
2. Kernel methods (SVM)
3. Non-linear models (trees, neural networks)`,
      codeExamples: JSON.stringify([
        {
          id: "1d-boundary",
          title: "1D Decision Boundary",
          code: "import math\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\n# Model: P(pass) = σ(-5 + 1.0 × hours)\nweight = 1.0\nbias = -5.0\n\n# Decision boundary: where z = 0\nboundary = -bias / weight\n\nprint('1D DECISION BOUNDARY')\nprint('=' * 50)\nprint(f'Model: P(pass) = σ({bias} + {weight} × hours)')\nprint(f'Boundary: hours = {boundary}')\nprint()\n\n# Visualize\nprint('Hours:  1   2   3   4   5   6   7   8   9  10')\nprint('        ', end='')\nfor h in range(1, 11):\n    prob = sigmoid(bias + weight * h)\n    if h == int(boundary):\n        print('|', end='  ')\n    elif prob < 0.5:\n        print('F', end='  ')\n    else:\n        print('P', end='  ')\nprint()\nprint(f'        {\"← FAIL\":^15} | {\"PASS →\":^15}')\nprint(f'                    ↑')\nprint(f'            Decision boundary at {boundary} hours')",
          description: "Visualize 1D boundary",
        },
        {
          id: "2d-boundary",
          title: "2D Decision Boundary",
          code: "import math\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef predict(x1, x2, w1, w2, b):\n    z = b + w1 * x1 + w2 * x2\n    return 1 if sigmoid(z) >= 0.5 else 0\n\n# Model parameters\nw1, w2, b = 1.0, 1.0, -3.0\n\nprint('2D DECISION BOUNDARY')\nprint('=' * 50)\nprint(f'Model: P(y=1) = σ({b} + {w1}×x₁ + {w2}×x₂)')\nprint(f'Boundary: {b} + {w1}×x₁ + {w2}×x₂ = 0')\nprint(f'          x₂ = {-b/w2} - {w1/w2}×x₁')\nprint()\n\n# Visualize on grid\nprint('x₂')\nprint('5 |', end='')\nfor x2 in range(5, -1, -1):\n    if x2 < 5:\n        print(f'{x2} |', end='')\n    for x1 in range(6):\n        pred = predict(x1, x2, w1, w2, b)\n        # Check if on boundary\n        z = b + w1 * x1 + w2 * x2\n        if abs(z) < 0.6:\n            print(' / ', end='')\n        elif pred == 1:\n            print(' + ', end='')\n        else:\n            print(' - ', end='')\n    print()\nprint('  +' + '-' * 18)\nprint('    0  1  2  3  4  5  x₁')\nprint('\\n+ = Class 1, - = Class 0, / = Boundary')",
          description: "Visualize 2D linear boundary",
        },
        {
          id: "non-linear-problem",
          title: "When Linear Fails (XOR)",
          code: "# XOR problem: linear boundary cannot separate\n\nxor_data = [\n    (0, 0, 0),  # (x1, x2, label)\n    (0, 1, 1),\n    (1, 0, 1),\n    (1, 1, 0),\n]\n\nprint('XOR PROBLEM: Linear Boundary Fails')\nprint('=' * 50)\nprint('\\nx₂')\nprint('1 |  1     0')\nprint('  |')\nprint('0 |  0     1')\nprint('  +----------')\nprint('     0     1   x₁')\nprint()\nprint('Labels at corners:')\nfor x1, x2, label in xor_data:\n    print(f'  ({x1}, {x2}) → {label}')\n\nprint('\\n⚠️  No single line can separate 0s from 1s!')\nprint('\\nSolutions:')\nprint('  1. Add feature: x₁ × x₂ (interaction term)')\nprint('  2. Use non-linear model (decision tree, neural net)')\nprint('\\nWith x₃ = x₁ × x₂:')\nprint('  (0,0): x₃=0, label=0')\nprint('  (0,1): x₃=0, label=1')\nprint('  (1,0): x₃=0, label=1')\nprint('  (1,1): x₃=1, label=0')\nprint('  Now separable with: label = 1 if (x₁+x₂-2×x₃) = 1')",
          description: "XOR cannot be solved linearly",
        },
      ]),
      keyPoints: [
        "Decision boundary: where P(y=1) = 0.5",
        "Logistic regression has linear boundary",
        "1D: point, 2D: line, nD: hyperplane",
        "Boundary equation: w·x + b = 0",
        "Linear fails on XOR-like problems",
        "Add polynomial features for non-linear",
      ],
      hardwareDemo: "Watch boundary position change with weights. See classification regions.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson22_2_2.number}: ${lesson22_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson22_2_2.id,
        number: 1,
        title: "Find 1D Boundary",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Find the decision boundary for a 1D logistic regression model.",
        starterCode: "# Model: P(y=1) = σ(bias + weight × x)\nweight = 2.0\nbias = -8.0\n\n# Decision boundary is where z = 0\n# bias + weight × x = 0\n# x = -bias / weight\n\nboundary = -bias / weight\n\nprint('1D DECISION BOUNDARY')\nprint('=' * 40)\nprint(f'Model: P(y=1) = σ({bias} + {weight} × x)')\nprint(f'\\nBoundary equation: {bias} + {weight}x = 0')\nprint(f'Solving: x = {-bias}/{weight} = {boundary}')\nprint(f'\\nDecision boundary at x = {boundary}')\nprint(f'\\nPredictions:')\nprint(f'  x < {boundary}: Predict class 0')\nprint(f'  x > {boundary}: Predict class 1')",
        solution: "# Boundary at x = 4",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Boundary = 4", description: "1D boundary" }]),
        hints: ["Set z = 0", "Solve for x", "x = -bias/weight"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson22_2_2.id,
        number: 2,
        title: "2D Boundary Equation",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find the line equation for a 2D decision boundary.",
        starterCode: "# Model: P(y=1) = σ(b + w₁x₁ + w₂x₂)\nw1 = 2.0\nw2 = -1.0\nb = 4.0\n\nprint('2D DECISION BOUNDARY')\nprint('=' * 45)\nprint(f'Model: P(y=1) = σ({b} + {w1}x₁ + {w2}x₂)')\nprint(f'\\nBoundary equation (z = 0):')\nprint(f'  {b} + {w1}x₁ + {w2}x₂ = 0')\n\n# Solve for x₂ in terms of x₁\n# w2 × x2 = -b - w1 × x1\n# x2 = (-b - w1 × x1) / w2\n\nslope = -w1 / w2\nintercept = -b / w2\n\nprint(f'\\nSolving for x₂:')\nprint(f'  x₂ = {intercept} + {slope} × x₁')\nprint(f'\\nLine equation: x₂ = {intercept} + {slope}x₁')\nprint(f'  Slope: {slope}')\nprint(f'  Y-intercept: {intercept}')\n\nprint(f'\\nBoundary passes through:')\nfor x1 in [0, 2, 4]:\n    x2 = intercept + slope * x1\n    print(f'  ({x1}, {x2})')",
        solution: "# Line equation from weights",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Line equation", description: "2D boundary" }]),
        hints: ["Set z = 0", "Solve for x₂", "Get slope and intercept"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson22_2_2.id,
        number: 3,
        title: "Visualize 2D Boundary",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a simple text visualization of a 2D decision boundary.",
        starterCode: "import math\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef classify(x1, x2, w1, w2, b):\n    z = b + w1 * x1 + w2 * x2\n    return '+' if sigmoid(z) >= 0.5 else '-'\n\n# Model\nw1, w2, b = 0.5, 0.5, -2.0\n\nprint('2D CLASSIFICATION REGIONS')\nprint('=' * 45)\nprint(f'Model: P(y=1) = σ({b} + {w1}x₁ + {w2}x₂)')\nprint(f'Boundary: x₂ = {-b/w2} - {w1/w2}x₁')\nprint()\n\n# Grid visualization\nprint('x₂')\nfor x2 in range(6, -1, -1):\n    print(f'{x2} |', end=' ')\n    for x1 in range(7):\n        z = b + w1 * x1 + w2 * x2\n        if abs(z) < 0.3:  # Near boundary\n            print('/', end=' ')\n        else:\n            print(classify(x1, x2, w1, w2, b), end=' ')\n    print()\nprint('  +' + '-' * 15)\nprint('    0 1 2 3 4 5 6 x₁')\nprint('\\n+ = Class 1, - = Class 0, / = Boundary')",
        solution: "# 2D visualization",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Grid shown", description: "Visualize boundary" }]),
        hints: ["Loop through grid points", "Classify each point", "Mark boundary"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson22_2_2.id,
        number: 4,
        title: "Linear Separability Test",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Check if a dataset is linearly separable.",
        starterCode: "def is_likely_separable(data):\n    \"\"\"Simple check: can classes be separated by a threshold on each feature?\"\"\"\n    class_0 = [d for d in data if d[-1] == 0]\n    class_1 = [d for d in data if d[-1] == 1]\n    \n    n_features = len(data[0]) - 1\n    separable_features = []\n    \n    for f in range(n_features):\n        max_0 = max(d[f] for d in class_0)\n        min_1 = min(d[f] for d in class_1)\n        min_0 = min(d[f] for d in class_0)\n        max_1 = max(d[f] for d in class_1)\n        \n        if max_0 < min_1 or max_1 < min_0:\n            separable_features.append(f)\n    \n    return len(separable_features) > 0, separable_features\n\n# Dataset 1: Linearly separable\ndata1 = [\n    (1, 2, 0), (2, 1, 0), (2, 3, 0),\n    (5, 6, 1), (6, 5, 1), (6, 7, 1),\n]\n\n# Dataset 2: XOR (not separable)\ndata2 = [\n    (0, 0, 0), (1, 1, 0),\n    (0, 1, 1), (1, 0, 1),\n]\n\nprint('LINEAR SEPARABILITY TEST')\nprint('=' * 45)\n\nfor name, data in [('Dataset 1', data1), ('XOR', data2)]:\n    sep, features = is_likely_separable(data)\n    print(f'\\n{name}:')\n    print(f'  Likely separable: {sep}')\n    if features:\n        print(f'  Separable on features: {features}')\n    else:\n        print(f'  No single feature separates classes')",
        solution: "# Check separability",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Separability check", description: "Linear separability" }]),
        hints: ["Compare class ranges", "Any gap means separable on that feature", "XOR has no gap"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson22_2_2.id,
        number: 5,
        title: "Add Polynomial Features",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Make XOR linearly separable by adding polynomial features.",
        starterCode: "# XOR data\nxor_data = [\n    (0, 0, 0),\n    (0, 1, 1),\n    (1, 0, 1),\n    (1, 1, 0),\n]\n\nprint('SOLVING XOR WITH POLYNOMIAL FEATURES')\nprint('=' * 50)\n\nprint('Original XOR (not linearly separable):')\nprint(f'{\"x1\":>4} {\"x2\":>4} {\"y\":>4}')\nfor x1, x2, y in xor_data:\n    print(f'{x1:>4} {x2:>4} {y:>4}')\n\nprint('\\nAdd x3 = x1 × x2 (interaction term):')\nprint(f'{\"x1\":>4} {\"x2\":>4} {\"x3\":>4} {\"y\":>4}')\nfor x1, x2, y in xor_data:\n    x3 = x1 * x2\n    print(f'{x1:>4} {x2:>4} {x3:>4} {y:>4}')\n\nprint('\\nNow we can find weights that work!')\nprint('Model: y = 1 if (x1 + x2 - 2×x3) == 1')\n\nprint('\\nVerification:')\nfor x1, x2, y in xor_data:\n    x3 = x1 * x2\n    prediction = 1 if (x1 + x2 - 2*x3) == 1 else 0\n    status = '✓' if prediction == y else '✗'\n    print(f'  ({x1},{x2}): {x1}+{x2}-2×{x3} = {x1+x2-2*x3} → pred={prediction}, actual={y} {status}')",
        solution: "# XOR solved with interaction term",
        testCases: JSON.stringify([{ input: "", expectedOutput: "XOR solved", description: "Polynomial features" }]),
        hints: ["Add x1*x2 feature", "Creates 3D space", "Now linearly separable"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 22.2.2`);

  console.log("\n✅ Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
