// Chapter 25 Part 1: Lessons 4-6 (Comprehensive)
// Sources: MIT 6.036, Stanford CS229

export const chapter25Part1 = [
  {
    slug: "train-validation-test-sets",
    title: "Train, Validation, and Test Sets",
    content: `
# Train, Validation, and Test Sets

## The Fundamental Problem

If we train a model on data and then test it on the **same data**, we get a misleadingly optimistic result. The model has essentially "memorized" the answers.

> "The error rate on training data is not a good estimate of the error rate on new data."
> — MIT 6.036

## The Three Data Splits

### 1. Training Set (60-80%)
**Purpose:** Teach the model patterns

\`\`\`python
model.fit(X_train, y_train)  # Model learns from this
\`\`\`

### 2. Validation Set (10-20%)
**Purpose:** Tune hyperparameters, compare models

\`\`\`python
for depth in [3, 5, 10, 20]:
    model = DecisionTreeClassifier(max_depth=depth)
    model.fit(X_train, y_train)
    val_score = model.score(X_val, y_val)
    print(f"Depth {depth}: {val_score:.3f}")
\`\`\`

### 3. Test Set (10-20%)
**Purpose:** Final, unbiased evaluation (use ONCE!)

\`\`\`python
final_score = model.score(X_test, y_test)
\`\`\`

## Implementing Data Splits

\`\`\`python
from sklearn.model_selection import train_test_split

# Simple train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Train/val/test (60/20/20)
X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.2)
X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.25)
\`\`\`

## Data Leakage: The Silent Killer

### ❌ WRONG: Fitting on All Data
\`\`\`python
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)  # Sees ALL data!
X_train, X_test = train_test_split(X_scaled)
\`\`\`

### ✓ CORRECT: Fit Only on Training
\`\`\`python
X_train, X_test = train_test_split(X)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # No fit!
\`\`\`

## Key Takeaways

1. **Training set** = Model learns patterns
2. **Validation set** = Tune hyperparameters  
3. **Test set** = Final evaluation (use ONCE!)
4. **Prevent leakage** = Fit preprocessing on training only
`,
    exercises: [
      {
        id: "split-1",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "Why should you only use the test set once?",
        options: ["To save computation time", "Using it multiple times gives biased results", "The test set can only be loaded once", "It is just a convention"],
        correctAnswer: 1,
        explanation: "Each time you use test data to make decisions, information leaks into your model."
      }
    ]
  },
  {
    slug: "linear-regression",
    title: "Linear Regression: Predicting Numbers",
    content: `
# Linear Regression: Predicting Numbers

Linear regression predicts continuous outputs by fitting a line to data.

> "Linear regression is perhaps the most well-understood statistical method."
> — "An Introduction to Statistical Learning"

## The Core Equation

\`\`\`
Simple: y = mx + b
Multiple: y = w₁x₁ + w₂x₂ + ... + b
\`\`\`

## Cost Function: Mean Squared Error

\`\`\`
MSE = (1/n) × Σ(yᵢ - ŷᵢ)²
\`\`\`

## Using Scikit-Learn

\`\`\`python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"Coefficients: {model.coef_}")
print(f"RMSE: {rmse:.2f}")
print(f"R²: {r2:.3f}")
\`\`\`

## Interpreting Coefficients

Each coefficient = change in y per unit change in x:
- sqft: $150 → each sqft adds $150
- bedrooms: $15,000 → each bedroom adds $15,000
- age: -$2,000 → each year REDUCES by $2,000

## Key Takeaways

1. **Linear regression** = weighted sum of features
2. **MSE** minimized during training
3. **Coefficients** show feature impact
4. **R²** measures variance explained (0-1)
`,
    exercises: [
      {
        id: "linreg-1",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "In y = 3x + 10, if x increases by 1, how much does y increase?",
        options: ["1", "3", "10", "13"],
        correctAnswer: 1,
        explanation: "The coefficient (slope) is 3. For every 1 unit increase in x, y increases by 3."
      }
    ]
  },
  {
    slug: "gradient-descent",
    title: "Gradient Descent: How Models Learn",
    content: `
# Gradient Descent: How Models Learn

Gradient descent finds the best parameters to minimize error.

> "Gradient descent minimizes an objective function by updating parameters in the opposite direction of the gradient."
> — Stanford CS229

## The Core Idea

Like finding the bottom of a hill while blindfolded:
1. Feel which way is steepest downhill
2. Take a step that direction
3. Repeat until flat

## The Math

\`\`\`
θ_new = θ_old - α × ∇J(θ)

Where:
  θ = parameters (weights)
  α = learning rate (step size)
  ∇J(θ) = gradient (steepest INCREASE direction)
  - sign = go OPPOSITE (downhill)
\`\`\`

## Learning Rate

- **Too small:** Takes forever, may get stuck
- **Too large:** Overshoots, never converges
- **Just right:** Converges efficiently

## Types of Gradient Descent

| Type | Data per Step | Speed | Stability |
|------|--------------|-------|-----------|
| Batch | All N | Slow | High |
| Stochastic | 1 | Fast | Low |
| Mini-Batch | B | Medium | Medium |

## Implementation

\`\`\`python
def gradient_descent(X, y, lr=0.01, n_iter=1000):
    weights = np.zeros(X.shape[1])
    bias = 0
    n = len(y)
    
    for _ in range(n_iter):
        y_pred = X @ weights + bias
        dw = -(2/n) * X.T @ (y - y_pred)
        db = -(2/n) * np.sum(y - y_pred)
        weights = weights - lr * dw
        bias = bias - lr * db
    return weights, bias
\`\`\`

## Key Takeaways

1. **Gradient descent** = iterative optimization
2. **Learning rate** controls step size
3. **Always scale features** before using GD
4. **Monitor loss** - should decrease smoothly
`,
    exercises: [
      {
        id: "gd-1",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "Why use the NEGATIVE gradient?",
        options: ["Gradients are always negative", "Gradient points uphill; we want downhill", "Makes math simpler", "Does not matter"],
        correctAnswer: 1,
        explanation: "The gradient points toward steepest INCREASE. We want to DECREASE loss, so we go opposite."
      }
    ]
  }
];

export default chapter25Part1;
