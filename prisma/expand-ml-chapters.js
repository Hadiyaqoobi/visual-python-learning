const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const expandedContent = {
  // ============================================================
  // CHAPTER 25: ML EXTENDED
  // ============================================================
  'features-and-labels': `# Features and Labels

In machine learning, **features** and **labels** are the building blocks of every model.

## What are Features?

Features (also called **inputs**, **predictors**, or **independent variables**) are the measurable properties of your data that the model uses to make predictions.

\`\`\`python
# Example: Predicting house prices
features = {
    'square_feet': 1500,
    'bedrooms': 3,
    'bathrooms': 2,
    'age_years': 10,
    'has_garage': True
}
\`\`\`

## What are Labels?

Labels (also called **targets**, **outputs**, or **dependent variables**) are what you want to predict.

\`\`\`python
# The label we want to predict
label = 350000  # House price in dollars
\`\`\`

## Feature Matrix (X) and Target Vector (y)

In practice, we organize data into matrices:

\`\`\`python
import numpy as np

# Feature matrix X: each row is a sample, each column is a feature
X = np.array([
    [1500, 3, 2],  # House 1: sqft, beds, baths
    [2000, 4, 3],  # House 2
    [1200, 2, 1],  # House 3
])

# Target vector y: one label per sample
y = np.array([350000, 450000, 280000])

print(f"X shape: {X.shape}")  # (3, 3) - 3 samples, 3 features
print(f"y shape: {y.shape}")  # (3,) - 3 labels
\`\`\`

## Feature Engineering

The quality of features often determines model success:

\`\`\`python
# Raw feature
date_built = "2010-05-15"

# Engineered features
age_years = 2024 - 2010  # 14
is_new = age_years < 5   # False
decade = "2010s"
\`\`\`

## Types of Features

| Type | Example | Handling |
|------|---------|----------|
| Numerical | price, age | Use directly or scale |
| Categorical | color, city | One-hot encode |
| Binary | yes/no | Convert to 0/1 |
| Text | description | Vectorize (TF-IDF, embeddings) |

## Feature Selection

Not all features help! Some may be:
- **Irrelevant**: Don't correlate with the target
- **Redundant**: Duplicate information
- **Noisy**: Add randomness without signal

\`\`\`python
from sklearn.feature_selection import SelectKBest, f_regression

# Select top 5 most important features
selector = SelectKBest(f_regression, k=5)
X_selected = selector.fit_transform(X, y)
\`\`\``,

  'supervised-vs-unsupervised-vs-reinforcement-learning': `# Supervised vs Unsupervised vs Reinforcement Learning

Machine learning algorithms fall into three main paradigms, each suited for different problems.

## Supervised Learning

**Definition**: Learn from labeled examples to predict labels for new data.

\`\`\`python
# Training data has features AND labels
X_train = [[1500, 3], [2000, 4], [1200, 2]]  # Features
y_train = [350000, 450000, 280000]            # Labels

from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X_train, y_train)  # Learn from labeled data

# Predict on new, unseen data
X_new = [[1800, 3]]
prediction = model.predict(X_new)  # [400000]
\`\`\`

**Types**:
- **Classification**: Predict categories (spam/not spam, cat/dog)
- **Regression**: Predict continuous values (price, temperature)

**Use Cases**: Email spam detection, medical diagnosis, price prediction, image recognition

## Unsupervised Learning

**Definition**: Find patterns in data WITHOUT labels.

\`\`\`python
# Training data has features only - NO labels!
X = [[1, 2], [1.5, 1.8], [5, 8], [8, 8], [1, 0.6], [9, 11]]

from sklearn.cluster import KMeans
model = KMeans(n_clusters=2)
model.fit(X)

# Discover natural groupings
print(model.labels_)  # [0, 0, 1, 1, 0, 1]
\`\`\`

**Types**:
- **Clustering**: Group similar items (customer segments)
- **Dimensionality Reduction**: Compress features (PCA)
- **Anomaly Detection**: Find outliers (fraud detection)

**Use Cases**: Customer segmentation, recommendation systems, data compression

## Reinforcement Learning

**Definition**: Learn by interacting with an environment, receiving rewards/penalties.

\`\`\`python
# Conceptual example (simplified)
class Agent:
    def __init__(self):
        self.q_table = {}  # State-action values
    
    def choose_action(self, state):
        # Balance exploration vs exploitation
        if random.random() < 0.1:  # Explore
            return random.choice(actions)
        return best_action(state)  # Exploit
    
    def learn(self, state, action, reward, next_state):
        # Update Q-value based on reward
        old_value = self.q_table.get((state, action), 0)
        next_max = max(self.q_table.get((next_state, a), 0) for a in actions)
        new_value = old_value + 0.1 * (reward + 0.9 * next_max - old_value)
        self.q_table[(state, action)] = new_value
\`\`\`

**Key Concepts**:
- **Agent**: The learner/decision maker
- **Environment**: What the agent interacts with
- **State**: Current situation
- **Action**: What the agent can do
- **Reward**: Feedback signal

**Use Cases**: Game AI, robotics, autonomous vehicles, trading bots

## Comparison Table

| Aspect | Supervised | Unsupervised | Reinforcement |
|--------|-----------|--------------|---------------|
| Labels | Required | Not used | Rewards |
| Goal | Predict | Discover patterns | Maximize reward |
| Feedback | Direct | None | Delayed |
| Examples | Classification, Regression | Clustering, PCA | Games, Robotics |`,

  'training-validation-and-test-sets': `# Training, Validation, and Test Sets

Properly splitting your data is crucial for building models that generalize well.

## Why Split Data?

If you train AND evaluate on the same data, you'll get overly optimistic results. Your model might just memorize the training data!

\`\`\`python
# BAD: Train and test on same data
model.fit(X, y)
score = model.score(X, y)  # 99%! But will it work on new data?

# GOOD: Train and test on different data
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model.fit(X_train, y_train)
score = model.score(X_test, y_test)  # Realistic estimate
\`\`\`

## The Three-Way Split

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    All Data (100%)                       │
├─────────────────────┬─────────────┬─────────────────────┤
│   Training (60%)    │  Val (20%)  │    Test (20%)       │
│   Learn patterns    │  Tune model │    Final eval       │
└─────────────────────┴─────────────┴─────────────────────┘
\`\`\`

### Training Set (60-80%)
- Used to **train** the model
- Model sees these examples during learning

### Validation Set (10-20%)
- Used to **tune hyperparameters**
- Compare different model configurations
- Make decisions about model architecture

### Test Set (10-20%)
- Used for **final evaluation only**
- Never used during training or tuning
- Gives unbiased estimate of real-world performance

## Implementation

\`\`\`python
from sklearn.model_selection import train_test_split

# First split: separate test set
X_temp, X_test, y_temp, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Second split: separate validation set
X_train, X_val, y_train, y_val = train_test_split(
    X_temp, y_temp, test_size=0.25, random_state=42  # 0.25 * 0.8 = 0.2
)

print(f"Train: {len(X_train)}, Val: {len(X_val)}, Test: {len(X_test)}")
\`\`\`

## Cross-Validation

For small datasets, use **k-fold cross-validation**:

\`\`\`python
from sklearn.model_selection import cross_val_score

# 5-fold: train on 4/5, validate on 1/5, rotate
scores = cross_val_score(model, X, y, cv=5)
print(f"Scores: {scores}")
print(f"Mean: {scores.mean():.3f} (+/- {scores.std() * 2:.3f})")
\`\`\`

## Common Mistakes

1. **Data Leakage**: Test data influences training
2. **Not Stratifying**: Class imbalance in splits
3. **Temporal Leakage**: Using future data to predict past

\`\`\`python
# Stratified split for classification (maintains class proportions)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
\`\`\``,

  'decision-trees': `# Decision Trees

Decision trees are intuitive models that make predictions by learning simple decision rules from data.

## How Decision Trees Work

A decision tree splits data based on feature values, creating a tree of decisions:

\`\`\`
                    [Income > 50K?]
                    /            \\
                  Yes             No
                  /                \\
        [Age > 30?]            [Owns Home?]
        /        \\              /        \\
      Yes        No           Yes        No
       |          |            |          |
    Approve    Review      Approve     Deny
\`\`\`

## Building a Decision Tree

\`\`\`python
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris

# Load data
iris = load_iris()
X, y = iris.data, iris.target

# Create and train
tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(X, y)

# Predict
prediction = tree.predict([[5.1, 3.5, 1.4, 0.2]])
print(f"Predicted class: {iris.target_names[prediction[0]]}")
\`\`\`

## Visualizing Decision Trees

\`\`\`python
from sklearn.tree import plot_tree
import matplotlib.pyplot as plt

plt.figure(figsize=(20, 10))
plot_tree(tree, feature_names=iris.feature_names, 
          class_names=iris.target_names, filled=True)
plt.show()
\`\`\`

## Key Concepts

### Splitting Criteria
- **Gini Impurity**: Measures misclassification probability
- **Entropy/Information Gain**: Measures disorder reduction

\`\`\`python
# Gini impurity for a node
def gini(y):
    classes, counts = np.unique(y, return_counts=True)
    probs = counts / len(y)
    return 1 - sum(p**2 for p in probs)
\`\`\`

### Controlling Tree Complexity

\`\`\`python
tree = DecisionTreeClassifier(
    max_depth=5,           # Maximum tree depth
    min_samples_split=10,  # Minimum samples to split a node
    min_samples_leaf=5,    # Minimum samples in a leaf
    max_features='sqrt'    # Features to consider per split
)
\`\`\`

## Advantages and Disadvantages

**Pros**:
- Easy to understand and interpret
- Handles numerical and categorical data
- Requires little data preprocessing
- Feature importance built-in

**Cons**:
- Prone to overfitting
- Unstable (small data changes → different tree)
- Can create biased trees with imbalanced data
- Not great for continuous target prediction

## Feature Importance

\`\`\`python
# See which features matter most
importance = tree.feature_importances_
for name, imp in zip(iris.feature_names, importance):
    print(f"{name}: {imp:.3f}")
\`\`\``,

  'random-forests': `# Random Forests

Random Forests combine many decision trees to create a more robust and accurate model.

## The Wisdom of Crowds

One tree can be biased or overfit. Many diverse trees voting together are more reliable!

\`\`\`
    Tree 1: Cat       Tree 2: Dog       Tree 3: Cat
         \\              |              /
          \\             |             /
           \\            |            /
            → → → VOTE → → → → → Cat wins!
\`\`\`

## How Random Forests Work

1. **Bootstrap Sampling**: Each tree trains on a random sample of data
2. **Feature Randomness**: Each split considers random subset of features
3. **Aggregation**: Combine predictions (vote for classification, average for regression)

## Implementation

\`\`\`python
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

# Load and split data
iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42
)

# Create Random Forest
rf = RandomForestClassifier(
    n_estimators=100,      # Number of trees
    max_depth=5,           # Max depth per tree
    random_state=42
)

# Train
rf.fit(X_train, y_train)

# Evaluate
accuracy = rf.score(X_test, y_test)
print(f"Accuracy: {accuracy:.3f}")
\`\`\`

## Key Parameters

\`\`\`python
rf = RandomForestClassifier(
    n_estimators=100,       # More trees = better but slower
    max_depth=None,         # How deep each tree can grow
    min_samples_split=2,    # Min samples to split
    min_samples_leaf=1,     # Min samples in leaf
    max_features='sqrt',    # Features per split (sqrt for classification)
    bootstrap=True,         # Use bootstrap sampling
    n_jobs=-1,              # Use all CPU cores
    random_state=42
)
\`\`\`

## Feature Importance

Random Forests provide built-in feature importance:

\`\`\`python
import pandas as pd

# Get feature importance
importance = rf.feature_importances_

# Create DataFrame for nice display
feat_imp = pd.DataFrame({
    'feature': iris.feature_names,
    'importance': importance
}).sort_values('importance', ascending=False)

print(feat_imp)
\`\`\`

## Out-of-Bag (OOB) Score

Free validation! Each tree can be tested on samples it didn't see:

\`\`\`python
rf = RandomForestClassifier(n_estimators=100, oob_score=True)
rf.fit(X, y)
print(f"OOB Score: {rf.oob_score_:.3f}")
\`\`\`

## Advantages and Disadvantages

**Pros**:
- Very accurate out-of-the-box
- Handles overfitting well
- Works with high-dimensional data
- Provides feature importance
- Parallelizable

**Cons**:
- Less interpretable than single tree
- Can be slow for large datasets
- May overfit on noisy data
- Memory intensive`,

  'linear-regression': `# Linear Regression

Linear regression finds the best straight line (or hyperplane) through your data.

## The Concept

We want to find the line that best predicts y from X:

\`\`\`
y = mx + b

Where:
- y = predicted value
- x = input feature
- m = slope (weight)
- b = intercept (bias)
\`\`\`

## Simple Linear Regression

\`\`\`python
import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

# Sample data: square footage → price
X = np.array([[1000], [1500], [2000], [2500], [3000]])
y = np.array([200000, 280000, 350000, 420000, 500000])

# Fit model
model = LinearRegression()
model.fit(X, y)

# Model parameters
print(f"Slope (price per sqft): ${model.coef_[0]:.2f}")
print(f"Intercept: ${model.intercept_:.2f}")

# Predict
new_house = [[1800]]
prediction = model.predict(new_house)
print(f"Predicted price for 1800 sqft: ${prediction[0]:,.2f}")
\`\`\`

## Multiple Linear Regression

With multiple features:

\`\`\`python
# Multiple features: sqft, bedrooms, age
X = np.array([
    [1500, 3, 10],
    [2000, 4, 5],
    [1200, 2, 20],
    [1800, 3, 15],
])
y = np.array([300000, 400000, 250000, 350000])

model = LinearRegression()
model.fit(X, y)

print("Coefficients:")
features = ['sqft', 'bedrooms', 'age']
for name, coef in zip(features, model.coef_):
    print(f"  {name}: {coef:.2f}")
\`\`\`

## The Math Behind It

Linear regression minimizes the **Mean Squared Error (MSE)**:

\`\`\`python
def mse(y_true, y_pred):
    return np.mean((y_true - y_pred) ** 2)

# The closed-form solution (Normal Equation)
# weights = (X^T X)^(-1) X^T y
def linear_regression_manual(X, y):
    X_b = np.c_[np.ones((len(X), 1)), X]  # Add bias column
    weights = np.linalg.inv(X_b.T @ X_b) @ X_b.T @ y
    return weights
\`\`\`

## Model Evaluation

\`\`\`python
from sklearn.metrics import mean_squared_error, r2_score

y_pred = model.predict(X_test)

# Mean Squared Error
mse = mean_squared_error(y_test, y_pred)
print(f"MSE: {mse:.2f}")

# Root Mean Squared Error (same units as y)
rmse = np.sqrt(mse)
print(f"RMSE: ${rmse:,.2f}")

# R² Score (0-1, higher is better)
r2 = r2_score(y_test, y_pred)
print(f"R²: {r2:.3f}")
\`\`\`

## Assumptions of Linear Regression

1. **Linearity**: Relationship is linear
2. **Independence**: Observations are independent
3. **Homoscedasticity**: Constant variance of errors
4. **Normality**: Errors are normally distributed

## When to Use

- Predicting continuous values
- Understanding feature relationships
- When interpretability matters
- As a baseline model`,

  'gradient-descent': `# Gradient Descent

Gradient descent is the optimization algorithm that powers most of machine learning.

## The Intuition

Imagine you're on a mountain in fog. To reach the valley (minimum), you:
1. Feel the slope beneath your feet
2. Take a step downhill
3. Repeat until flat ground

That's gradient descent!

## The Math

\`\`\`
weight = weight - learning_rate × gradient

Where:
- weight: parameter we're optimizing
- learning_rate: step size
- gradient: slope of loss function
\`\`\`

## Implementation from Scratch

\`\`\`python
import numpy as np

def gradient_descent(X, y, learning_rate=0.01, iterations=1000):
    m, n = X.shape
    weights = np.zeros(n)
    bias = 0
    
    for i in range(iterations):
        # Predictions
        y_pred = X @ weights + bias
        
        # Compute gradients
        dw = (1/m) * X.T @ (y_pred - y)
        db = (1/m) * np.sum(y_pred - y)
        
        # Update parameters
        weights -= learning_rate * dw
        bias -= learning_rate * db
        
        # Track loss
        if i % 100 == 0:
            loss = np.mean((y_pred - y) ** 2)
            print(f"Iteration {i}: Loss = {loss:.4f}")
    
    return weights, bias

# Example usage
X = np.random.randn(100, 3)
y = X @ [2, -1, 0.5] + 1 + np.random.randn(100) * 0.1

weights, bias = gradient_descent(X, y)
print(f"Learned weights: {weights}")
print(f"Learned bias: {bias}")
\`\`\`

## Learning Rate

The learning rate is crucial:

\`\`\`
Too small: Slow convergence ─────────────→ minimum
Too large: Overshooting     ←──→←──→←──→  never converges
Just right: Fast and stable ────→ minimum
\`\`\`

\`\`\`python
# Experiment with learning rates
for lr in [0.001, 0.01, 0.1, 1.0]:
    weights, bias = gradient_descent(X, y, learning_rate=lr)
    print(f"lr={lr}: final weights = {weights}")
\`\`\`

## Variants of Gradient Descent

### Batch Gradient Descent
- Uses ALL samples per update
- Stable but slow for large datasets

### Stochastic Gradient Descent (SGD)
- Uses ONE sample per update
- Fast but noisy

### Mini-Batch Gradient Descent
- Uses a BATCH of samples (e.g., 32)
- Best of both worlds!

\`\`\`python
def mini_batch_gd(X, y, batch_size=32, learning_rate=0.01, epochs=100):
    m, n = X.shape
    weights = np.zeros(n)
    bias = 0
    
    for epoch in range(epochs):
        # Shuffle data
        indices = np.random.permutation(m)
        X_shuffled = X[indices]
        y_shuffled = y[indices]
        
        # Process mini-batches
        for i in range(0, m, batch_size):
            X_batch = X_shuffled[i:i+batch_size]
            y_batch = y_shuffled[i:i+batch_size]
            
            # Gradient step
            y_pred = X_batch @ weights + bias
            dw = (1/len(X_batch)) * X_batch.T @ (y_pred - y_batch)
            db = (1/len(X_batch)) * np.sum(y_pred - y_batch)
            
            weights -= learning_rate * dw
            bias -= learning_rate * db
    
    return weights, bias
\`\`\`

## Advanced Optimizers

Modern deep learning uses improved versions:
- **Momentum**: Accelerates in consistent directions
- **Adam**: Adaptive learning rates per parameter
- **RMSprop**: Scales learning rate by recent gradients`,

  'logistic-regression': `# Logistic Regression

Despite its name, logistic regression is used for **classification**, not regression.

## The Problem

Linear regression outputs any number, but we need probabilities (0-1) for classification:

\`\`\`
Linear:    -∞ ←──────────────→ +∞
Logistic:   0 ←────────────────→ 1
\`\`\`

## The Sigmoid Function

We squash linear output through the sigmoid function:

\`\`\`python
import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# Examples
print(sigmoid(-10))  # ≈ 0.00 (definitely class 0)
print(sigmoid(0))    # = 0.50 (uncertain)
print(sigmoid(10))   # ≈ 1.00 (definitely class 1)
\`\`\`

## The Model

\`\`\`
P(y=1|X) = σ(w·X + b)

Where:
- σ = sigmoid function
- w = weights
- X = features
- b = bias
\`\`\`

## Implementation with Scikit-Learn

\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# Load data
data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

# Train model
model = LogisticRegression(max_iter=10000)
model.fit(X_train, y_train)

# Predict probabilities
probs = model.predict_proba(X_test)
print(f"Probability of class 0: {probs[0][0]:.3f}")
print(f"Probability of class 1: {probs[0][1]:.3f}")

# Predict classes
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
\`\`\`

## Decision Boundary

Logistic regression creates a linear decision boundary:

\`\`\`python
import matplotlib.pyplot as plt

# For 2D data, we can visualize the boundary
def plot_decision_boundary(model, X, y):
    x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
    y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
    
    xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.1),
                         np.arange(y_min, y_max, 0.1))
    
    Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)
    
    plt.contourf(xx, yy, Z, alpha=0.4)
    plt.scatter(X[:, 0], X[:, 1], c=y, edgecolors='k')
    plt.show()
\`\`\`

## Multi-Class Classification

For more than 2 classes:

\`\`\`python
# One-vs-Rest (default)
model = LogisticRegression(multi_class='ovr')

# Softmax (multinomial)
model = LogisticRegression(multi_class='multinomial')
\`\`\`

## Regularization

Prevent overfitting with L1 or L2 regularization:

\`\`\`python
# L2 regularization (Ridge) - default
model = LogisticRegression(penalty='l2', C=1.0)

# L1 regularization (Lasso) - for feature selection
model = LogisticRegression(penalty='l1', solver='saga', C=1.0)

# C is inverse of regularization strength
# Smaller C = more regularization
\`\`\`

## When to Use

- Binary classification problems
- When you need probability estimates
- When interpretability matters (coefficients have meaning)
- As a baseline classifier`,

  'k-nearest-neighbors': `# K-Nearest Neighbors (KNN)

KNN is one of the simplest yet effective machine learning algorithms.

## The Intuition

"Tell me who your neighbors are, and I'll tell you who you are."

To classify a new point:
1. Find the K closest training points
2. Take a vote among those neighbors
3. Assign the majority class

## Visual Example

\`\`\`
    ○ ○ ○
      ○ ● ←── New point: What class?
        ○ ○
    
K=3: 3 neighbors are ○ → Classify as ○
K=5: 4 neighbors are ○, 1 is ● → Still ○
\`\`\`

## Implementation

\`\`\`python
from sklearn.neighbors import KNeighborsClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load data
iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42
)

# Create and train KNN
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)

# Predict
y_pred = knn.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
\`\`\`

## Choosing K

\`\`\`python
from sklearn.model_selection import cross_val_score
import matplotlib.pyplot as plt

# Test different K values
k_range = range(1, 31)
scores = []

for k in k_range:
    knn = KNeighborsClassifier(n_neighbors=k)
    score = cross_val_score(knn, X_train, y_train, cv=5)
    scores.append(score.mean())

# Plot
plt.plot(k_range, scores)
plt.xlabel('K')
plt.ylabel('Cross-Validation Accuracy')
plt.title('KNN: Choosing K')
plt.show()

best_k = k_range[np.argmax(scores)]
print(f"Best K: {best_k}")
\`\`\`

## Distance Metrics

\`\`\`python
# Euclidean (default) - straight line distance
knn = KNeighborsClassifier(n_neighbors=5, metric='euclidean')

# Manhattan - grid-like distance
knn = KNeighborsClassifier(n_neighbors=5, metric='manhattan')

# Minkowski (general form)
knn = KNeighborsClassifier(n_neighbors=5, metric='minkowski', p=2)  # p=2 is Euclidean
\`\`\`

## Feature Scaling is Critical!

KNN uses distances, so features must be on same scale:

\`\`\`python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

knn.fit(X_train_scaled, y_train)
y_pred = knn.predict(X_test_scaled)
\`\`\`

## KNN for Regression

\`\`\`python
from sklearn.neighbors import KNeighborsRegressor

# Average the target values of K neighbors
knn_reg = KNeighborsRegressor(n_neighbors=5)
knn_reg.fit(X_train, y_train)
predictions = knn_reg.predict(X_test)
\`\`\`

## Advantages and Disadvantages

**Pros**:
- Simple to understand
- No training phase (lazy learner)
- Naturally handles multi-class
- Non-parametric (no assumptions about data)

**Cons**:
- Slow predictions (must search all training data)
- Sensitive to irrelevant features
- Memory intensive
- Requires feature scaling`,

  'bias-variance-tradeoff': `# Bias-Variance Tradeoff

Understanding bias and variance is key to building models that generalize well.

## The Problem

Why do models fail? Two main reasons:

\`\`\`
Total Error = Bias² + Variance + Irreducible Noise
\`\`\`

## Bias: Underfitting

**Bias** = Error from overly simplistic assumptions

\`\`\`
High Bias Model:
                    Data: ∿∿∿
    Model prediction: ────
    
    The straight line can't capture the curve!
\`\`\`

Signs of high bias:
- Poor training accuracy
- Poor test accuracy
- Model is too simple

## Variance: Overfitting

**Variance** = Error from sensitivity to training data fluctuations

\`\`\`
High Variance Model:
                     Training data: ●  ●  ●  ●
    Model prediction:              ╭─╮╭╮╭─╮╭╮
    
    Fits training perfectly but won't generalize!
\`\`\`

Signs of high variance:
- Great training accuracy
- Poor test accuracy
- Model is too complex

## The Tradeoff

\`\`\`
Error
  │
  │\\  Total Error
  │ \\     ╱
  │  \\   ╱
  │   \\ ╱
  │    X  ← Sweet spot
  │   ╱ \\
  │  ╱   \\
  │ ╱ Bias \\Variance
  │╱         \\
  └───────────────→ Model Complexity
     Simple    Complex
\`\`\`

## Detecting the Problem

\`\`\`python
from sklearn.model_selection import learning_curve
import matplotlib.pyplot as plt

def plot_learning_curve(model, X, y):
    train_sizes, train_scores, val_scores = learning_curve(
        model, X, y, cv=5, n_jobs=-1,
        train_sizes=np.linspace(0.1, 1.0, 10)
    )
    
    train_mean = train_scores.mean(axis=1)
    val_mean = val_scores.mean(axis=1)
    
    plt.plot(train_sizes, train_mean, label='Training')
    plt.plot(train_sizes, val_mean, label='Validation')
    plt.xlabel('Training Size')
    plt.ylabel('Score')
    plt.legend()
    plt.show()
\`\`\`

## Diagnosing from Learning Curves

**High Bias (Underfitting)**:
- Both curves are low and close together
- More data won't help much
- Solution: More complex model

**High Variance (Overfitting)**:
- Big gap between training and validation
- Training score much higher
- Solution: More data, regularization, simpler model

## Solutions

### For High Bias:
\`\`\`python
# Add more features
# Use polynomial features
from sklearn.preprocessing import PolynomialFeatures
poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(X)

# Use more complex model
# Decrease regularization
\`\`\`

### For High Variance:
\`\`\`python
# Get more training data
# Reduce number of features
# Increase regularization
from sklearn.linear_model import Ridge
model = Ridge(alpha=10.0)  # Higher alpha = more regularization

# Use cross-validation
# Use ensemble methods
\`\`\``,

  'regularization': `# Regularization

Regularization prevents overfitting by penalizing complex models.

## The Problem

Without regularization, models can fit training data too well:

\`\`\`python
# Overfitting example
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

# With degree 15, model overfits badly
poly = PolynomialFeatures(degree=15)
X_poly = poly.fit_transform(X)
model = LinearRegression()
model.fit(X_poly, y)

print(f"Training R²: {model.score(X_poly, y):.4f}")  # ~1.0000 (too good!)
\`\`\`

## How Regularization Works

Add a penalty term to the loss function:

\`\`\`
Loss = Data Loss + λ × Penalty

Where λ (lambda) controls regularization strength
\`\`\`

## L2 Regularization (Ridge)

Penalizes the **sum of squared weights**:

\`\`\`python
from sklearn.linear_model import Ridge

# Higher alpha = more regularization
ridge = Ridge(alpha=1.0)
ridge.fit(X_train, y_train)

# Compare coefficients
print(f"Linear: {linear_model.coef_}")
print(f"Ridge:  {ridge.coef_}")  # Smaller coefficients!
\`\`\`

**Effect**: Shrinks all weights toward zero

## L1 Regularization (Lasso)

Penalizes the **sum of absolute weights**:

\`\`\`python
from sklearn.linear_model import Lasso

lasso = Lasso(alpha=1.0)
lasso.fit(X_train, y_train)

# L1 can make coefficients exactly zero!
print(f"Lasso coefficients: {lasso.coef_}")
# Some will be 0 → automatic feature selection
\`\`\`

**Effect**: Pushes some weights to exactly zero (sparse)

## Elastic Net: Best of Both

Combines L1 and L2:

\`\`\`python
from sklearn.linear_model import ElasticNet

# l1_ratio: 0 = Ridge, 1 = Lasso, 0.5 = balanced
elastic = ElasticNet(alpha=1.0, l1_ratio=0.5)
elastic.fit(X_train, y_train)
\`\`\`

## Choosing Regularization Strength

\`\`\`python
from sklearn.linear_model import RidgeCV, LassoCV

# Cross-validation to find best alpha
alphas = [0.001, 0.01, 0.1, 1.0, 10.0, 100.0]

ridge_cv = RidgeCV(alphas=alphas, cv=5)
ridge_cv.fit(X_train, y_train)
print(f"Best alpha: {ridge_cv.alpha_}")

lasso_cv = LassoCV(alphas=alphas, cv=5)
lasso_cv.fit(X_train, y_train)
print(f"Best alpha: {lasso_cv.alpha_}")
\`\`\`

## Visual Comparison

\`\`\`
Coefficients vs Regularization Strength:

No Reg    L2 (Ridge)    L1 (Lasso)
──────    ──────────    ──────────
  5.2        2.1           0
 -3.1       -1.5          -1.2
  0.8        0.4           0
  4.7        2.3           2.1
 -2.3       -1.1           0

L2: All shrink proportionally
L1: Some become exactly zero → Feature selection!
\`\`\`

## Regularization in Other Models

\`\`\`python
# Logistic Regression
from sklearn.linear_model import LogisticRegression
lr = LogisticRegression(C=0.1)  # C = 1/alpha (inverse!)

# Neural Networks
model.add(Dense(64, kernel_regularizer='l2'))

# Decision Trees (not regularization, but similar effect)
tree = DecisionTreeClassifier(max_depth=5, min_samples_leaf=10)
\`\`\``,

  'overfitting-and-underfitting': `# Overfitting and Underfitting

Two fundamental problems in machine learning that every practitioner must understand.

## What is Overfitting?

Model memorizes training data instead of learning patterns.

\`\`\`
Training Data:    ●  ●    ●  ●
Overfit Model:    ╭╮ ╭╮  ╭╮ ╭╮   (wiggles through every point)
True Pattern:     ─────────────   (simple line)

Training Accuracy: 100%
Test Accuracy: 60%   ← Big gap = overfitting!
\`\`\`

## What is Underfitting?

Model is too simple to capture the pattern.

\`\`\`
Training Data:    ●     ●    ●
                    ●  ●   ● 
True Pattern:     ╭──────────╮  (curve)
Underfit Model:   ──────────── (straight line)

Training Accuracy: 70%
Test Accuracy: 68%   ← Both low = underfitting!
\`\`\`

## Detecting the Problem

\`\`\`python
from sklearn.model_selection import cross_val_score

# Train the model
model.fit(X_train, y_train)

# Get scores
train_score = model.score(X_train, y_train)
test_score = model.score(X_test, y_test)

print(f"Training: {train_score:.3f}")
print(f"Test: {test_score:.3f}")

if train_score > 0.95 and test_score < 0.8:
    print("⚠️ Likely OVERFITTING")
elif train_score < 0.7 and test_score < 0.7:
    print("⚠️ Likely UNDERFITTING")
else:
    print("✓ Looks good!")
\`\`\`

## Solutions for Overfitting

### 1. Get More Data
\`\`\`python
# The best solution! More data = harder to memorize
\`\`\`

### 2. Simplify the Model
\`\`\`python
# Reduce complexity
tree = DecisionTreeClassifier(max_depth=3)  # Limit depth
poly = PolynomialFeatures(degree=2)  # Lower degree
\`\`\`

### 3. Regularization
\`\`\`python
from sklearn.linear_model import Ridge
model = Ridge(alpha=1.0)  # Add penalty for large weights
\`\`\`

### 4. Dropout (Neural Networks)
\`\`\`python
from tensorflow.keras.layers import Dropout
model.add(Dropout(0.5))  # Randomly ignore 50% of neurons
\`\`\`

### 5. Early Stopping
\`\`\`python
from sklearn.neural_network import MLPClassifier
model = MLPClassifier(early_stopping=True, validation_fraction=0.1)
\`\`\`

### 6. Cross-Validation
\`\`\`python
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5)
\`\`\`

## Solutions for Underfitting

### 1. Increase Model Complexity
\`\`\`python
# More features
poly = PolynomialFeatures(degree=3)

# Deeper tree
tree = DecisionTreeClassifier(max_depth=10)

# More neurons/layers
model.add(Dense(128, activation='relu'))
\`\`\`

### 2. Feature Engineering
\`\`\`python
# Create interaction features
X['feature1_x_feature2'] = X['feature1'] * X['feature2']

# Domain-specific features
X['age_squared'] = X['age'] ** 2
\`\`\`

### 3. Reduce Regularization
\`\`\`python
model = Ridge(alpha=0.01)  # Less regularization
\`\`\`

### 4. Train Longer
\`\`\`python
model = MLPClassifier(max_iter=1000)  # More iterations
\`\`\`

## The Goal: Just Right

\`\`\`
         │
Training │━━━━━━━━━━━━━━━━━━━━━━━━━
Score    │              Test
         │         ╭─────────────
         │        ╱
         │       ╱
         │──────╱
         │    ↑
         │  Sweet spot (stop here!)
         └──────────────────────────→
           Underfit → Just Right → Overfit
\`\`\``,

  'k-means-clustering': `# K-Means Clustering

K-Means is the most popular unsupervised learning algorithm for grouping data.

## The Concept

Group data points into K clusters based on similarity:

\`\`\`
Before:                  After (K=3):
    ● ●                     ○ ○
  ● ● ●                   ○ ○ ○
      ●  ●                    □  □
        ● ●                     □ □
    ●                       △
  ● ● ●                   △ △ △
\`\`\`

## The Algorithm

1. **Initialize**: Randomly place K cluster centers
2. **Assign**: Each point goes to nearest center
3. **Update**: Move centers to mean of their points
4. **Repeat**: Until centers stop moving

\`\`\`python
# Visualization of the algorithm
def kmeans_steps(X, k, max_iters=10):
    # Random initialization
    centers = X[np.random.choice(len(X), k, replace=False)]
    
    for i in range(max_iters):
        # Assign points to nearest center
        distances = np.sqrt(((X - centers[:, np.newaxis])**2).sum(axis=2))
        labels = distances.argmin(axis=0)
        
        # Update centers
        new_centers = np.array([X[labels == j].mean(axis=0) for j in range(k)])
        
        # Check convergence
        if np.allclose(centers, new_centers):
            break
        centers = new_centers
    
    return labels, centers
\`\`\`

## Implementation with Scikit-Learn

\`\`\`python
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

# Generate sample data
from sklearn.datasets import make_blobs
X, _ = make_blobs(n_samples=300, centers=4, cluster_std=0.6, random_state=42)

# Fit K-Means
kmeans = KMeans(n_clusters=4, random_state=42)
labels = kmeans.fit_predict(X)

# Visualize
plt.scatter(X[:, 0], X[:, 1], c=labels, cmap='viridis')
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], 
            c='red', marker='X', s=200, label='Centers')
plt.legend()
plt.title('K-Means Clustering')
plt.show()
\`\`\`

## Choosing K: The Elbow Method

\`\`\`python
inertias = []
K_range = range(1, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X)
    inertias.append(kmeans.inertia_)

plt.plot(K_range, inertias, 'bo-')
plt.xlabel('Number of Clusters (K)')
plt.ylabel('Inertia (Within-cluster sum of squares)')
plt.title('Elbow Method')
plt.show()

# Look for the "elbow" - where adding clusters stops helping much
\`\`\`

## Silhouette Score

Better metric for cluster quality:

\`\`\`python
from sklearn.metrics import silhouette_score

for k in range(2, 11):
    kmeans = KMeans(n_clusters=k, random_state=42)
    labels = kmeans.fit_predict(X)
    score = silhouette_score(X, labels)
    print(f"K={k}: Silhouette Score = {score:.3f}")

# Higher is better (max = 1)
\`\`\`

## Important Parameters

\`\`\`python
kmeans = KMeans(
    n_clusters=4,         # Number of clusters
    init='k-means++',     # Smart initialization (default)
    n_init=10,            # Run 10 times with different seeds
    max_iter=300,         # Maximum iterations
    random_state=42       # For reproducibility
)
\`\`\`

## Limitations and Solutions

1. **Assumes spherical clusters**: Use DBSCAN for arbitrary shapes
2. **Sensitive to initialization**: Use k-means++ (default)
3. **Must specify K**: Use elbow method or silhouette score
4. **Sensitive to outliers**: Consider K-Medoids

## Real-World Applications

- Customer segmentation
- Image compression
- Document clustering
- Anomaly detection
- Feature learning`,

  // ============================================================
  // CHAPTER 26: PERCEPTRONS
  // ============================================================
  'what-is-a-perceptron': `# What is a Perceptron?

The perceptron is the simplest neural network - a single artificial neuron that can learn.

## Biological Inspiration

Real neurons:
- Receive signals through dendrites
- Process in cell body
- Fire output through axon if threshold exceeded

\`\`\`
Inputs (x)        Weights (w)       Sum           Activation
   x₁ ────────→ w₁ ─┐
                    │
   x₂ ────────→ w₂ ─┼──→ Σ(wᵢxᵢ) + b ──→ f(·) ──→ Output
                    │
   x₃ ────────→ w₃ ─┘
\`\`\`

## The Math

\`\`\`
output = activation(w₁x₁ + w₂x₂ + ... + wₙxₙ + b)
       = activation(w·x + b)
\`\`\`

For the original perceptron, activation is the step function:
- Output 1 if (w·x + b) > 0
- Output 0 otherwise

## Implementation from Scratch

\`\`\`python
import numpy as np

class Perceptron:
    def __init__(self, n_features, learning_rate=0.01):
        self.weights = np.zeros(n_features)
        self.bias = 0
        self.lr = learning_rate
    
    def activation(self, x):
        return 1 if x > 0 else 0
    
    def predict(self, X):
        linear = np.dot(X, self.weights) + self.bias
        return np.array([self.activation(x) for x in linear])
    
    def fit(self, X, y, epochs=100):
        for epoch in range(epochs):
            errors = 0
            for xi, yi in zip(X, y):
                prediction = self.activation(np.dot(xi, self.weights) + self.bias)
                error = yi - prediction
                
                # Update rule
                self.weights += self.lr * error * xi
                self.bias += self.lr * error
                
                errors += int(error != 0)
            
            if errors == 0:
                print(f"Converged at epoch {epoch}")
                break
        
        return self

# Example: AND gate
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([0, 0, 0, 1])

perceptron = Perceptron(n_features=2)
perceptron.fit(X, y)
print(f"Weights: {perceptron.weights}, Bias: {perceptron.bias}")
print(f"Predictions: {perceptron.predict(X)}")
\`\`\`

## What Can a Perceptron Learn?

### ✓ AND Gate
\`\`\`
Inputs → Output
(0,0)  →   0
(0,1)  →   0
(1,0)  →   0
(1,1)  →   1

Learnable! A line can separate 0s from 1.
\`\`\`

### ✓ OR Gate
\`\`\`
(0,0)  →   0
(0,1)  →   1
(1,0)  →   1
(1,1)  →   1

Learnable! A line can separate 0 from 1s.
\`\`\`

### ✗ XOR Gate
\`\`\`
(0,0)  →   0
(0,1)  →   1
(1,0)  →   1
(1,1)  →   0

NOT learnable! No single line can separate.
\`\`\`

## Historical Significance

- 1958: Frank Rosenblatt invents the perceptron
- 1969: Minsky & Papert publish "Perceptrons" - shows XOR limitation
- This led to the first "AI winter"
- Later: Multi-layer networks solve XOR and more!`,

  'linear-decision-boundaries': `# Linear Decision Boundaries

A perceptron creates a linear decision boundary - a line (2D), plane (3D), or hyperplane (higher dimensions) that separates classes.

## The Equation

The decision boundary is where:
\`\`\`
w·x + b = 0
\`\`\`

Points where w·x + b > 0 → Class 1
Points where w·x + b < 0 → Class 0

## Visualizing in 2D

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

def plot_decision_boundary(weights, bias, X, y):
    # Create grid
    x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
    y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
    
    # Decision boundary: w1*x1 + w2*x2 + b = 0
    # Solving for x2: x2 = -(w1*x1 + b) / w2
    x1_line = np.linspace(x_min, x_max, 100)
    x2_line = -(weights[0] * x1_line + bias) / weights[1]
    
    plt.figure(figsize=(10, 6))
    plt.scatter(X[y==0][:, 0], X[y==0][:, 1], c='blue', label='Class 0', s=100)
    plt.scatter(X[y==1][:, 0], X[y==1][:, 1], c='red', label='Class 1', s=100)
    plt.plot(x1_line, x2_line, 'g-', linewidth=2, label='Decision Boundary')
    
    # Shade regions
    plt.fill_between(x1_line, x2_line, y_max, alpha=0.2, color='red')
    plt.fill_between(x1_line, y_min, x2_line, alpha=0.2, color='blue')
    
    plt.xlim(x_min, x_max)
    plt.ylim(y_min, y_max)
    plt.xlabel('Feature 1')
    plt.ylabel('Feature 2')
    plt.legend()
    plt.title('Linear Decision Boundary')
    plt.show()

# Example
X = np.array([[1, 2], [2, 3], [3, 1], [4, 2], [2, 1], [3, 3]])
y = np.array([0, 0, 1, 1, 0, 1])
weights = np.array([1, -1])
bias = 0

plot_decision_boundary(weights, bias, X, y)
\`\`\`

## Geometric Interpretation

The weight vector w is **perpendicular** to the decision boundary:

\`\`\`
        ↑ w (weight vector)
        │
        │    ● Class 1
        │  ●
────────┼─────── Decision Boundary
      ● │
    ●   │ Class 0
\`\`\`

The bias b determines how far the boundary is from the origin.

## Linearly Separable Data

Data is **linearly separable** if a hyperplane can perfectly separate the classes:

\`\`\`python
def is_linearly_separable(X, y, max_iter=1000):
    """
    Check if data is linearly separable using perceptron.
    If perceptron converges, data is linearly separable.
    """
    from sklearn.linear_model import Perceptron
    
    model = Perceptron(max_iter=max_iter, tol=None)
    model.fit(X, y)
    
    accuracy = model.score(X, y)
    return accuracy == 1.0

# Test
X_separable = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y_and = np.array([0, 0, 0, 1])  # AND gate
y_xor = np.array([0, 1, 1, 0])  # XOR gate

print(f"AND is linearly separable: {is_linearly_separable(X_separable, y_and)}")  # True
print(f"XOR is linearly separable: {is_linearly_separable(X_separable, y_xor)}")  # False
\`\`\`

## Limitations

Linear boundaries can only classify **linearly separable** data:

\`\`\`
✓ Linearly Separable:      ✗ Not Linearly Separable:
   
   ○ ○ ○ │ ● ● ●              ○   ●
   ○ ○ ○ │ ● ● ●              ● ○ ○ ●
   ○ ○ ○ │ ● ● ●              ○   ●
   
   One line works!          No line works!
\`\`\`

To handle non-linearly separable data, we need:
- Multiple layers (MLPs)
- Kernel tricks (SVM)
- Non-linear transformations`,

  'perceptron-learning-algorithm': `# Perceptron Learning Algorithm

The perceptron learning algorithm is simple yet powerful - it's guaranteed to converge for linearly separable data!

## The Algorithm

\`\`\`
1. Initialize weights w = 0, bias b = 0
2. For each training example (x, y):
   a. Compute prediction: ŷ = sign(w·x + b)
   b. If prediction is wrong (ŷ ≠ y):
      - Update: w = w + y·x
      - Update: b = b + y
3. Repeat until no errors (or max iterations)
\`\`\`

## The Update Rule

When misclassifying point (x, y):
- If y = 1 but predicted 0: Add x to weights (push boundary)
- If y = 0 but predicted 1: Subtract x from weights (push boundary)

\`\`\`python
# Update rule in code
if prediction != y_true:
    weights += learning_rate * y_true * x
    bias += learning_rate * y_true
\`\`\`

## Complete Implementation

\`\`\`python
import numpy as np

class PerceptronLearning:
    def __init__(self, learning_rate=1.0):
        self.lr = learning_rate
        self.weights = None
        self.bias = None
        self.errors_per_epoch = []
    
    def fit(self, X, y, max_epochs=100):
        n_samples, n_features = X.shape
        
        # Convert labels to {-1, 1}
        y_ = np.where(y <= 0, -1, 1)
        
        # Initialize
        self.weights = np.zeros(n_features)
        self.bias = 0
        
        for epoch in range(max_epochs):
            errors = 0
            
            for xi, yi in zip(X, y_):
                # Compute prediction
                linear_output = np.dot(xi, self.weights) + self.bias
                prediction = np.sign(linear_output)
                
                # Update if wrong
                if prediction != yi:
                    self.weights += self.lr * yi * xi
                    self.bias += self.lr * yi
                    errors += 1
            
            self.errors_per_epoch.append(errors)
            
            # Convergence check
            if errors == 0:
                print(f"✓ Converged at epoch {epoch + 1}")
                return self
        
        print(f"Did not converge after {max_epochs} epochs")
        return self
    
    def predict(self, X):
        linear_output = np.dot(X, self.weights) + self.bias
        return np.where(linear_output >= 0, 1, 0)

# Demo
np.random.seed(42)

# Generate linearly separable data
X = np.vstack([
    np.random.randn(50, 2) + [2, 2],
    np.random.randn(50, 2) + [-2, -2]
])
y = np.array([1]*50 + [0]*50)

# Train
model = PerceptronLearning()
model.fit(X, y)

# Plot convergence
import matplotlib.pyplot as plt
plt.plot(model.errors_per_epoch)
plt.xlabel('Epoch')
plt.ylabel('Errors')
plt.title('Perceptron Convergence')
plt.show()
\`\`\`

## Convergence Theorem

**Theorem**: If the training data is linearly separable, the perceptron algorithm will converge in a finite number of steps.

The number of mistakes is bounded by:
\`\`\`
mistakes ≤ (R/γ)²

Where:
- R = max ||xᵢ|| (maximum norm of any point)
- γ = margin (minimum distance to separating hyperplane)
\`\`\`

## Handling Non-Separable Data

For data that isn't linearly separable, use:

\`\`\`python
from sklearn.linear_model import Perceptron

# Standard perceptron (won't converge for non-separable)
model = Perceptron(max_iter=1000, tol=1e-3)

# With regularization and early stopping
model = Perceptron(
    max_iter=1000,
    penalty='l2',           # Regularization
    alpha=0.0001,           # Regularization strength
    early_stopping=True,    # Stop if no improvement
    validation_fraction=0.1
)
\`\`\``,

  'activation-functions': `# Activation Functions

Activation functions introduce non-linearity, allowing neural networks to learn complex patterns.

## Why Activation Functions?

Without activation functions, neural networks are just linear transformations:
\`\`\`
layer1 = W1·x
layer2 = W2·layer1 = W2·W1·x = W·x (still linear!)
\`\`\`

Activation functions break linearity, enabling complex decision boundaries.

## Common Activation Functions

### Step Function (Original Perceptron)
\`\`\`python
def step(x):
    return 1 if x > 0 else 0

# Problem: Not differentiable → can't use gradient descent
\`\`\`

### Sigmoid
\`\`\`python
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

# Output: (0, 1) - good for probabilities
# Problem: Vanishing gradients for large |x|
\`\`\`

### Tanh
\`\`\`python
def tanh(x):
    return np.tanh(x)

# Output: (-1, 1) - zero-centered
# Problem: Still has vanishing gradients
\`\`\`

### ReLU (Rectified Linear Unit)
\`\`\`python
def relu(x):
    return np.maximum(0, x)

# Output: [0, ∞)
# Pros: Fast, no vanishing gradient for positive values
# Cons: "Dying ReLU" - neurons can get stuck at 0
\`\`\`

### Leaky ReLU
\`\`\`python
def leaky_relu(x, alpha=0.01):
    return np.where(x > 0, x, alpha * x)

# Fixes dying ReLU by allowing small negative values
\`\`\`

### Softmax (Multi-class Output)
\`\`\`python
def softmax(x):
    exp_x = np.exp(x - np.max(x))  # Subtract max for stability
    return exp_x / exp_x.sum()

# Converts logits to probabilities that sum to 1
\`\`\`

## Visual Comparison

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-5, 5, 100)

fig, axes = plt.subplots(2, 3, figsize=(15, 8))

# Sigmoid
axes[0,0].plot(x, 1/(1+np.exp(-x)))
axes[0,0].set_title('Sigmoid')
axes[0,0].axhline(y=0, color='k', linewidth=0.5)
axes[0,0].axvline(x=0, color='k', linewidth=0.5)

# Tanh
axes[0,1].plot(x, np.tanh(x))
axes[0,1].set_title('Tanh')
axes[0,1].axhline(y=0, color='k', linewidth=0.5)

# ReLU
axes[0,2].plot(x, np.maximum(0, x))
axes[0,2].set_title('ReLU')

# Leaky ReLU
axes[1,0].plot(x, np.where(x > 0, x, 0.1*x))
axes[1,0].set_title('Leaky ReLU')

# Softmax example
axes[1,1].bar([0,1,2], softmax([2.0, 1.0, 0.1]))
axes[1,1].set_title('Softmax Example')

plt.tight_layout()
plt.show()
\`\`\`

## Choosing Activation Functions

| Layer Type | Recommended Activation |
|------------|----------------------|
| Hidden layers | ReLU, Leaky ReLU |
| Binary classification output | Sigmoid |
| Multi-class output | Softmax |
| Regression output | None (linear) |

## In Practice (PyTorch)

\`\`\`python
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(784, 256),
    nn.ReLU(),           # Hidden layer activation
    nn.Linear(256, 128),
    nn.ReLU(),
    nn.Linear(128, 10),
    nn.Softmax(dim=1)    # Output for 10-class classification
)
\`\`\``,

  'the-xor-problem': `# The XOR Problem

The XOR problem revealed the fundamental limitation of single-layer perceptrons and drove the development of multi-layer networks.

## What is XOR?

XOR (exclusive OR) outputs 1 only when inputs differ:

\`\`\`
Input A  Input B  Output
   0       0        0
   0       1        1
   1       0        1
   1       1        0
\`\`\`

## Why Perceptrons Fail

A single perceptron creates a **linear** decision boundary. XOR is **not linearly separable**:

\`\`\`
     B
     1│  ●(0,1)     ○(1,1)
      │      
      │      
     0│  ○(0,0)     ●(1,0)
      └──────────────── A
         0           1

● = Output 1
○ = Output 0

No single straight line can separate ●s from ○s!
\`\`\`

## Proving Non-Separability

\`\`\`python
from sklearn.linear_model import Perceptron
import numpy as np

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y_xor = np.array([0, 1, 1, 0])

model = Perceptron(max_iter=1000)
model.fit(X, y_xor)

print(f"Predictions: {model.predict(X)}")  # Won't get [0, 1, 1, 0]
print(f"Accuracy: {model.score(X, y_xor)}")  # ~50-75%, never 100%
\`\`\`

## The Solution: Multiple Layers

Add a hidden layer to create non-linear boundaries:

\`\`\`
Input Layer    Hidden Layer    Output Layer
    
   x₁ ─────────→ h₁ ─┐
        ╲      ╱      ├────→ output
         ╲    ╱       │
          ╲  ╱        │
           ╲╱         │
           ╱╲         │
          ╱  ╲        │
         ╱    ╲       │
        ╱      ╲      │
   x₂ ─────────→ h₂ ─┘
\`\`\`

## Solving XOR with 2 Layers

\`\`\`python
import numpy as np

class XORNetwork:
    def __init__(self):
        # Hidden layer: 2 neurons that compute AND and OR
        # h1 = x1 AND x2
        # h2 = x1 OR x2
        self.w_hidden = np.array([[1, 1], [1, 1]])
        self.b_hidden = np.array([-1.5, -0.5])  # AND threshold, OR threshold
        
        # Output: h2 AND NOT h1 = OR but not AND = XOR!
        self.w_output = np.array([-1, 1])
        self.b_output = -0.5
    
    def sigmoid(self, x):
        return 1 / (1 + np.exp(-10*x))  # Steep sigmoid for sharp decisions
    
    def forward(self, X):
        # Hidden layer
        hidden = self.sigmoid(X @ self.w_hidden + self.b_hidden)
        
        # Output layer
        output = self.sigmoid(hidden @ self.w_output + self.b_output)
        
        return output

# Test
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
network = XORNetwork()
predictions = network.forward(X)
print("XOR Predictions:")
for inputs, pred in zip(X, predictions):
    print(f"  {inputs} -> {pred:.3f} ≈ {round(pred)}")
\`\`\`

## Learning XOR with Backpropagation

\`\`\`python
from sklearn.neural_network import MLPClassifier

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([0, 1, 1, 0])

# Multi-layer perceptron with 1 hidden layer
mlp = MLPClassifier(
    hidden_layer_sizes=(4,),  # 4 neurons in hidden layer
    activation='relu',
    max_iter=10000,
    random_state=42
)
mlp.fit(X, y)

print(f"Predictions: {mlp.predict(X)}")  # [0, 1, 1, 0] ✓
print(f"Accuracy: {mlp.score(X, y)}")    # 1.0 ✓
\`\`\`

## Historical Significance

- 1969: Minsky & Papert's book showed perceptrons can't solve XOR
- Led to the first "AI winter" - funding dried up
- 1986: Backpropagation popularized, solving XOR and much more
- Today: Deep learning = many layers solving far more complex problems!`,

  'multi-layer-perceptrons-mlps': `# Multi-Layer Perceptrons (MLPs)

MLPs extend the perceptron with hidden layers, enabling them to learn any function.

## Architecture

\`\`\`
Input Layer      Hidden Layer(s)      Output Layer
    
   x₁ ───────┬───→ h₁ ───┬───→ h₃ ───┬───→ y₁
             │           │           │
   x₂ ───────┼───→ h₂ ───┼───→ h₄ ───┼───→ y₂
             │           │           │
   x₃ ───────┴───────────┴───────────┘
   
   n features    Hidden 1   Hidden 2    m outputs
                (4 neurons) (2 neurons)
\`\`\`

## Why Hidden Layers Matter

Each layer learns increasingly abstract features:

\`\`\`
Image → Layer 1: Edges → Layer 2: Shapes → Layer 3: Objects → "Cat"
\`\`\`

## Implementation from Scratch

\`\`\`python
import numpy as np

class MLP:
    def __init__(self, layer_sizes):
        """
        layer_sizes: list like [input_dim, hidden1, hidden2, ..., output_dim]
        """
        self.weights = []
        self.biases = []
        
        # Initialize weights with Xavier initialization
        for i in range(len(layer_sizes) - 1):
            w = np.random.randn(layer_sizes[i], layer_sizes[i+1]) * np.sqrt(2.0 / layer_sizes[i])
            b = np.zeros((1, layer_sizes[i+1]))
            self.weights.append(w)
            self.biases.append(b)
    
    def relu(self, x):
        return np.maximum(0, x)
    
    def relu_derivative(self, x):
        return (x > 0).astype(float)
    
    def softmax(self, x):
        exp_x = np.exp(x - np.max(x, axis=1, keepdims=True))
        return exp_x / np.sum(exp_x, axis=1, keepdims=True)
    
    def forward(self, X):
        self.activations = [X]
        self.z_values = []
        
        for i in range(len(self.weights) - 1):
            z = self.activations[-1] @ self.weights[i] + self.biases[i]
            self.z_values.append(z)
            self.activations.append(self.relu(z))
        
        # Output layer (softmax for classification)
        z = self.activations[-1] @ self.weights[-1] + self.biases[-1]
        self.z_values.append(z)
        self.activations.append(self.softmax(z))
        
        return self.activations[-1]
    
    def backward(self, X, y, learning_rate=0.01):
        m = X.shape[0]
        
        # One-hot encode y
        y_onehot = np.zeros_like(self.activations[-1])
        y_onehot[np.arange(m), y] = 1
        
        # Output layer gradient
        delta = self.activations[-1] - y_onehot
        
        # Backpropagate
        for i in range(len(self.weights) - 1, -1, -1):
            dw = self.activations[i].T @ delta / m
            db = np.sum(delta, axis=0, keepdims=True) / m
            
            if i > 0:
                delta = (delta @ self.weights[i].T) * self.relu_derivative(self.z_values[i-1])
            
            self.weights[i] -= learning_rate * dw
            self.biases[i] -= learning_rate * db
    
    def fit(self, X, y, epochs=1000, learning_rate=0.01):
        for epoch in range(epochs):
            output = self.forward(X)
            self.backward(X, y, learning_rate)
            
            if epoch % 100 == 0:
                loss = -np.mean(np.log(output[np.arange(len(y)), y] + 1e-8))
                print(f"Epoch {epoch}: Loss = {loss:.4f}")
    
    def predict(self, X):
        return np.argmax(self.forward(X), axis=1)

# Example
from sklearn.datasets import make_moons
X, y = make_moons(n_samples=200, noise=0.1, random_state=42)

mlp = MLP([2, 16, 8, 2])  # 2 inputs → 16 → 8 → 2 outputs
mlp.fit(X, y, epochs=1000, learning_rate=0.1)
print(f"Accuracy: {np.mean(mlp.predict(X) == y):.3f}")
\`\`\`

## Using Scikit-Learn

\`\`\`python
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split

# Load MNIST-like digits
digits = load_digits()
X_train, X_test, y_train, y_test = train_test_split(
    digits.data, digits.target, test_size=0.2, random_state=42
)

# Create MLP
mlp = MLPClassifier(
    hidden_layer_sizes=(128, 64),  # Two hidden layers
    activation='relu',
    solver='adam',
    max_iter=500,
    random_state=42
)

mlp.fit(X_train, y_train)
print(f"Training accuracy: {mlp.score(X_train, y_train):.3f}")
print(f"Test accuracy: {mlp.score(X_test, y_test):.3f}")
\`\`\`

## Key Hyperparameters

| Parameter | Description | Typical Values |
|-----------|-------------|----------------|
| hidden_layer_sizes | Neurons per layer | (64,), (128, 64) |
| activation | Activation function | 'relu', 'tanh' |
| solver | Optimizer | 'adam', 'sgd' |
| learning_rate_init | Initial learning rate | 0.001 |
| batch_size | Mini-batch size | 32, 64, 128 |
| max_iter | Maximum epochs | 200-1000 |

## Universal Approximation Theorem

MLPs with just ONE hidden layer (with enough neurons) can approximate ANY continuous function to arbitrary precision!

This is why neural networks are so powerful.`,

  // Continue with Chapters 27 and 28...
  'neural-network-architecture': `# Neural Network Architecture

Understanding network architecture is crucial for designing effective models.

## Components of a Neural Network

### Layers

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Input     │────→│   Hidden    │────→│   Output    │
│   Layer     │     │   Layers    │     │   Layer     │
│  (features) │     │  (learned)  │     │(predictions)│
└─────────────┘     └─────────────┘     └─────────────┘
\`\`\`

### Types of Layers

\`\`\`python
import torch.nn as nn

# Dense (Fully Connected) Layer
nn.Linear(in_features=784, out_features=256)

# Convolutional Layer
nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3)

# Recurrent Layer
nn.LSTM(input_size=128, hidden_size=256)

# Normalization Layer
nn.BatchNorm2d(num_features=64)

# Dropout Layer
nn.Dropout(p=0.5)
\`\`\`

## Network Depth vs Width

**Depth** = Number of layers
**Width** = Neurons per layer

\`\`\`python
# Shallow and Wide
shallow = nn.Sequential(
    nn.Linear(784, 1024),
    nn.ReLU(),
    nn.Linear(1024, 10)
)

# Deep and Narrow
deep = nn.Sequential(
    nn.Linear(784, 256),
    nn.ReLU(),
    nn.Linear(256, 128),
    nn.ReLU(),
    nn.Linear(128, 64),
    nn.ReLU(),
    nn.Linear(64, 32),
    nn.ReLU(),
    nn.Linear(32, 10)
)
\`\`\`

**Deeper networks** can learn more abstract hierarchies
**Wider networks** can memorize more but may overfit

## Common Architectures

### Feedforward Network (MLP)

\`\`\`python
class FeedForward(nn.Module):
    def __init__(self, input_size, hidden_sizes, output_size):
        super().__init__()
        layers = []
        prev_size = input_size
        
        for hidden_size in hidden_sizes:
            layers.extend([
                nn.Linear(prev_size, hidden_size),
                nn.ReLU(),
                nn.Dropout(0.2)
            ])
            prev_size = hidden_size
        
        layers.append(nn.Linear(prev_size, output_size))
        self.network = nn.Sequential(*layers)
    
    def forward(self, x):
        return self.network(x)

# Usage
model = FeedForward(784, [512, 256, 128], 10)
\`\`\`

### ResNet-style Skip Connections

\`\`\`python
class ResidualBlock(nn.Module):
    def __init__(self, features):
        super().__init__()
        self.block = nn.Sequential(
            nn.Linear(features, features),
            nn.ReLU(),
            nn.Linear(features, features)
        )
    
    def forward(self, x):
        return x + self.block(x)  # Skip connection!

# Residual connections help train very deep networks
\`\`\`

## Designing Your Architecture

### For Tabular Data
\`\`\`python
model = nn.Sequential(
    nn.Linear(num_features, 256),
    nn.ReLU(),
    nn.BatchNorm1d(256),
    nn.Dropout(0.3),
    nn.Linear(256, 128),
    nn.ReLU(),
    nn.Linear(128, num_classes)
)
\`\`\`

### For Images
\`\`\`python
model = nn.Sequential(
    nn.Conv2d(3, 32, 3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),
    nn.Conv2d(32, 64, 3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),
    nn.Flatten(),
    nn.Linear(64 * 8 * 8, 256),
    nn.ReLU(),
    nn.Linear(256, num_classes)
)
\`\`\`

### For Sequences
\`\`\`python
class SequenceModel(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, output_dim):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)
    
    def forward(self, x):
        embedded = self.embedding(x)
        _, (hidden, _) = self.lstm(embedded)
        return self.fc(hidden.squeeze(0))
\`\`\`

## Parameter Count

\`\`\`python
def count_parameters(model):
    return sum(p.numel() for p in model.parameters() if p.requires_grad)

model = FeedForward(784, [512, 256, 128], 10)
print(f"Parameters: {count_parameters(model):,}")  # ~530,000
\`\`\``,

  'forward-propagation': `# Forward Propagation

Forward propagation is how data flows through a neural network to produce predictions.

## The Process

\`\`\`
Input → Layer 1 → Activation → Layer 2 → Activation → ... → Output

x → (W₁·x + b₁) → f(·) → (W₂·a₁ + b₂) → f(·) → ... → ŷ
\`\`\`

## Step by Step

### 1. Linear Transformation
\`\`\`python
z = W @ x + b
\`\`\`
Each neuron computes a weighted sum of inputs plus bias.

### 2. Activation Function
\`\`\`python
a = activation(z)
\`\`\`
Non-linear transformation enables learning complex patterns.

### 3. Repeat for Each Layer
The output of one layer becomes the input to the next.

## Implementation

\`\`\`python
import numpy as np

def forward_propagation(X, weights, biases, activations):
    """
    X: Input data (batch_size, n_features)
    weights: List of weight matrices
    biases: List of bias vectors
    activations: List of activation functions
    
    Returns: Final output and cached values for backprop
    """
    cache = {'A0': X}  # Store activations for backprop
    A = X
    
    for i, (W, b, activation) in enumerate(zip(weights, biases, activations)):
        # Linear transformation
        Z = A @ W + b
        cache[f'Z{i+1}'] = Z
        
        # Activation
        if activation == 'relu':
            A = np.maximum(0, Z)
        elif activation == 'sigmoid':
            A = 1 / (1 + np.exp(-Z))
        elif activation == 'softmax':
            exp_Z = np.exp(Z - np.max(Z, axis=1, keepdims=True))
            A = exp_Z / np.sum(exp_Z, axis=1, keepdims=True)
        elif activation == 'none':
            A = Z
        
        cache[f'A{i+1}'] = A
    
    return A, cache

# Example usage
np.random.seed(42)

# Network: 4 inputs → 8 hidden → 3 outputs
X = np.random.randn(5, 4)  # 5 samples, 4 features

weights = [
    np.random.randn(4, 8) * 0.1,  # Input to hidden
    np.random.randn(8, 3) * 0.1   # Hidden to output
]
biases = [np.zeros((1, 8)), np.zeros((1, 3))]
activations = ['relu', 'softmax']

output, cache = forward_propagation(X, weights, biases, activations)
print(f"Output shape: {output.shape}")  # (5, 3)
print(f"Output (probabilities):\\n{output}")
\`\`\`

## Matrix Dimensions

\`\`\`
Layer:       Input        Hidden       Output
Size:         4      →      8      →      3

Dimensions:
X:     (batch, 4)
W1:    (4, 8)
b1:    (1, 8)
Z1:    (batch, 8)
A1:    (batch, 8)

W2:    (8, 3)
b2:    (1, 3)
Z2:    (batch, 3)
A2:    (batch, 3)  ← Output!
\`\`\`

## PyTorch Forward Pass

\`\`\`python
import torch
import torch.nn as nn

class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.layer1 = nn.Linear(4, 8)
        self.layer2 = nn.Linear(8, 3)
        self.relu = nn.ReLU()
        self.softmax = nn.Softmax(dim=1)
    
    def forward(self, x):
        # This IS forward propagation!
        x = self.layer1(x)
        x = self.relu(x)
        x = self.layer2(x)
        x = self.softmax(x)
        return x

model = SimpleNet()
X = torch.randn(5, 4)
output = model(X)  # Calls forward() automatically
print(output.shape)  # torch.Size([5, 3])
\`\`\`

## Computational Graph

Forward propagation builds a computational graph that will be used for backpropagation:

\`\`\`
x ──→ [×W1] ──→ [+b1] ──→ [ReLU] ──→ [×W2] ──→ [+b2] ──→ [Softmax] ──→ ŷ
       │         │          │          │         │           │
       ↓         ↓          ↓          ↓         ↓           ↓
      W1        b1        Z1>0        W2        b2      softmax(Z2)
      
Each operation is tracked for gradient computation!
\`\`\``,

  'loss-functions': `# Loss Functions

Loss functions measure how wrong the model's predictions are. The goal of training is to minimize this loss.

## What is Loss?

\`\`\`
Loss = f(predictions, actual_values)

Low loss → Good predictions
High loss → Bad predictions
\`\`\`

## Common Loss Functions

### Mean Squared Error (MSE) - Regression

\`\`\`python
import numpy as np

def mse_loss(y_true, y_pred):
    return np.mean((y_true - y_pred) ** 2)

# Example
y_true = np.array([3.0, 5.0, 2.5])
y_pred = np.array([2.8, 5.2, 2.3])
print(f"MSE: {mse_loss(y_true, y_pred):.4f}")  # 0.0433
\`\`\`

**When to use**: Predicting continuous values (prices, temperatures)

### Mean Absolute Error (MAE) - Regression

\`\`\`python
def mae_loss(y_true, y_pred):
    return np.mean(np.abs(y_true - y_pred))

print(f"MAE: {mae_loss(y_true, y_pred):.4f}")  # 0.2000
\`\`\`

**When to use**: Less sensitive to outliers than MSE

### Binary Cross-Entropy - Binary Classification

\`\`\`python
def binary_cross_entropy(y_true, y_pred):
    epsilon = 1e-15  # Prevent log(0)
    y_pred = np.clip(y_pred, epsilon, 1 - epsilon)
    return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))

# Example
y_true = np.array([1, 0, 1, 1])
y_pred = np.array([0.9, 0.1, 0.8, 0.7])
print(f"BCE: {binary_cross_entropy(y_true, y_pred):.4f}")
\`\`\`

**When to use**: Two classes (spam/not spam, cat/dog)

### Categorical Cross-Entropy - Multi-class Classification

\`\`\`python
def categorical_cross_entropy(y_true, y_pred):
    epsilon = 1e-15
    y_pred = np.clip(y_pred, epsilon, 1 - epsilon)
    return -np.mean(np.sum(y_true * np.log(y_pred), axis=1))

# Example: 3 classes, 2 samples
y_true = np.array([[1, 0, 0], [0, 1, 0]])  # One-hot encoded
y_pred = np.array([[0.8, 0.1, 0.1], [0.2, 0.7, 0.1]])
print(f"CCE: {categorical_cross_entropy(y_true, y_pred):.4f}")
\`\`\`

**When to use**: Multiple classes (digits 0-9, animal types)

## PyTorch Loss Functions

\`\`\`python
import torch
import torch.nn as nn

# Regression
mse_loss = nn.MSELoss()
mae_loss = nn.L1Loss()

# Binary Classification
bce_loss = nn.BCELoss()  # With sigmoid output
bce_logits = nn.BCEWithLogitsLoss()  # Raw logits (preferred)

# Multi-class Classification
ce_loss = nn.CrossEntropyLoss()  # With raw logits (preferred)
nll_loss = nn.NLLLoss()  # With log-softmax output

# Example usage
predictions = torch.tensor([0.8, 0.2, 0.9])
targets = torch.tensor([1.0, 0.0, 1.0])
loss = bce_loss(predictions, targets)
print(f"Loss: {loss.item():.4f}")
\`\`\`

## Loss Landscape

The loss function creates a "landscape" that gradient descent navigates:

\`\`\`
Loss
  │     ╱╲
  │    ╱  ╲      ╱╲
  │   ╱    ╲    ╱  ╲
  │  ╱      ╲  ╱    ╲
  │ ╱        ╲╱      ╲
  │╱                   ╲___  ← Global minimum
  └─────────────────────────→ Weights

Gradient descent follows the slope downhill!
\`\`\`

## Choosing the Right Loss

| Task | Loss Function | Output Activation |
|------|---------------|-------------------|
| Regression | MSE, MAE | None (linear) |
| Binary Classification | BCE | Sigmoid |
| Multi-class (single label) | Cross-Entropy | Softmax |
| Multi-label | BCE per class | Sigmoid |`,

  'backpropagation': `# Backpropagation

Backpropagation is the algorithm that calculates gradients, enabling neural networks to learn.

## The Core Idea

1. Forward pass: Compute predictions and loss
2. Backward pass: Compute gradients using chain rule
3. Update: Adjust weights to reduce loss

\`\`\`
Forward:   x → Layer1 → Layer2 → ŷ → Loss
                                       ↓
Backward:  ∂L/∂W1 ← ∂L/∂W2 ← ∂L/∂ŷ ← ∂L/∂Loss
\`\`\`

## The Chain Rule

For composite functions, multiply derivatives:

\`\`\`
y = f(g(x))
dy/dx = dy/dg × dg/dx
\`\`\`

In neural networks:
\`\`\`
Loss = L(f₂(f₁(x)))

∂Loss/∂W₁ = ∂Loss/∂f₂ × ∂f₂/∂f₁ × ∂f₁/∂W₁
\`\`\`

## Step-by-Step Backprop

\`\`\`python
import numpy as np

class SimpleNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        self.W1 = np.random.randn(input_size, hidden_size) * 0.01
        self.b1 = np.zeros((1, hidden_size))
        self.W2 = np.random.randn(hidden_size, output_size) * 0.01
        self.b2 = np.zeros((1, output_size))
    
    def relu(self, x):
        return np.maximum(0, x)
    
    def relu_derivative(self, x):
        return (x > 0).astype(float)
    
    def softmax(self, x):
        exp_x = np.exp(x - np.max(x, axis=1, keepdims=True))
        return exp_x / exp_x.sum(axis=1, keepdims=True)
    
    def forward(self, X):
        # Layer 1
        self.Z1 = X @ self.W1 + self.b1
        self.A1 = self.relu(self.Z1)
        
        # Layer 2
        self.Z2 = self.A1 @ self.W2 + self.b2
        self.A2 = self.softmax(self.Z2)
        
        return self.A2
    
    def backward(self, X, y_true):
        m = X.shape[0]
        
        # Output layer gradient (softmax + cross-entropy shortcut)
        dZ2 = self.A2 - y_true  # Shape: (m, output_size)
        
        # Gradients for W2 and b2
        dW2 = (self.A1.T @ dZ2) / m
        db2 = np.sum(dZ2, axis=0, keepdims=True) / m
        
        # Backprop through layer 2
        dA1 = dZ2 @ self.W2.T
        
        # Backprop through ReLU
        dZ1 = dA1 * self.relu_derivative(self.Z1)
        
        # Gradients for W1 and b1
        dW1 = (X.T @ dZ1) / m
        db1 = np.sum(dZ1, axis=0, keepdims=True) / m
        
        return {'dW1': dW1, 'db1': db1, 'dW2': dW2, 'db2': db2}
    
    def update(self, gradients, learning_rate):
        self.W1 -= learning_rate * gradients['dW1']
        self.b1 -= learning_rate * gradients['db1']
        self.W2 -= learning_rate * gradients['dW2']
        self.b2 -= learning_rate * gradients['db2']
    
    def train_step(self, X, y_true, learning_rate=0.01):
        # Forward
        predictions = self.forward(X)
        
        # Loss
        loss = -np.mean(np.sum(y_true * np.log(predictions + 1e-8), axis=1))
        
        # Backward
        gradients = self.backward(X, y_true)
        
        # Update
        self.update(gradients, learning_rate)
        
        return loss

# Example
np.random.seed(42)
X = np.random.randn(100, 4)
y = np.eye(3)[np.random.randint(0, 3, 100)]  # One-hot

net = SimpleNetwork(4, 8, 3)

for epoch in range(1000):
    loss = net.train_step(X, y, learning_rate=0.1)
    if epoch % 100 == 0:
        print(f"Epoch {epoch}: Loss = {loss:.4f}")
\`\`\`

## Gradient Formulas

For each layer, we compute:

\`\`\`
∂L/∂W = ∂L/∂Z × ∂Z/∂W = δ × Aₚᵣₑᵥᵀ
∂L/∂b = ∂L/∂Z × ∂Z/∂b = δ
∂L/∂Aₚᵣₑᵥ = ∂L/∂Z × ∂Z/∂Aₚᵣₑᵥ = δ × Wᵀ

Where δ = ∂L/∂Z includes the activation derivative
\`\`\`

## Automatic Differentiation (PyTorch)

Modern frameworks compute gradients automatically:

\`\`\`python
import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(4, 8),
    nn.ReLU(),
    nn.Linear(8, 3)
)

X = torch.randn(32, 4)
y = torch.randint(0, 3, (32,))

# Forward
output = model(X)
loss = nn.CrossEntropyLoss()(output, y)

# Backward (computes all gradients automatically!)
loss.backward()

# Gradients are stored in .grad attribute
for name, param in model.named_parameters():
    print(f"{name}: gradient shape = {param.grad.shape}")
\`\`\``,

  'gradient-flow-problems': `# Gradient Flow Problems

Deep networks face challenges with gradient propagation. Understanding these problems is key to training deep models successfully.

## Vanishing Gradients

Gradients become exponentially smaller as they propagate backward:

\`\`\`
Layer N:   gradient = 0.5
Layer N-1: gradient = 0.5 × 0.5 = 0.25
Layer N-2: gradient = 0.25 × 0.5 = 0.125
...
Layer 1:   gradient ≈ 0.00001  ← Too small to learn!
\`\`\`

### Causes

1. **Sigmoid/Tanh activations**: Gradients max out at 0.25 for sigmoid
2. **Deep networks**: Many multiplications compound the problem
3. **Poor weight initialization**: Starts gradients too small

\`\`\`python
import numpy as np

# Sigmoid derivative is at most 0.25
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_derivative(x):
    s = sigmoid(x)
    return s * (1 - s)

# Maximum derivative at x=0
print(f"Max sigmoid derivative: {sigmoid_derivative(0)}")  # 0.25

# After 10 layers: 0.25^10 ≈ 0.000001
print(f"After 10 layers: {0.25**10:.10f}")
\`\`\`

### Solutions

\`\`\`python
import torch.nn as nn

# 1. Use ReLU activation (gradient is 1 for positive inputs)
model = nn.Sequential(
    nn.Linear(100, 100),
    nn.ReLU(),  # Not sigmoid!
    nn.Linear(100, 100),
    nn.ReLU()
)

# 2. Proper weight initialization
nn.init.kaiming_normal_(layer.weight, mode='fan_in', nonlinearity='relu')

# 3. Batch Normalization
model = nn.Sequential(
    nn.Linear(100, 100),
    nn.BatchNorm1d(100),  # Normalizes activations
    nn.ReLU()
)

# 4. Skip connections (ResNet)
class ResBlock(nn.Module):
    def forward(self, x):
        return x + self.layers(x)  # Gradient can flow directly through +
\`\`\`

## Exploding Gradients

Gradients become exponentially larger:

\`\`\`
Layer N:   gradient = 2
Layer N-1: gradient = 2 × 2 = 4
Layer N-2: gradient = 4 × 2 = 8
...
Layer 1:   gradient = 1024  ← Updates too large!
\`\`\`

### Symptoms
- Loss becomes NaN or Inf
- Weights oscillate wildly
- Training is unstable

### Solutions

\`\`\`python
# 1. Gradient Clipping
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

# Or clip by value
torch.nn.utils.clip_grad_value_(model.parameters(), clip_value=1.0)

# 2. Lower learning rate
optimizer = torch.optim.Adam(model.parameters(), lr=0.0001)

# 3. Proper initialization
for layer in model.modules():
    if isinstance(layer, nn.Linear):
        nn.init.xavier_normal_(layer.weight)
\`\`\`

## Dying ReLU

ReLU neurons can "die" - output 0 for all inputs:

\`\`\`python
# If weights push all inputs negative, ReLU always outputs 0
# Gradient through ReLU is 0 when input < 0
# The neuron can never recover!

# Solutions:
# 1. Leaky ReLU
nn.LeakyReLU(negative_slope=0.01)

# 2. ELU
nn.ELU(alpha=1.0)

# 3. GELU (used in transformers)
nn.GELU()

# 4. Lower learning rate
# 5. Careful initialization
\`\`\`

## Monitoring Gradient Health

\`\`\`python
def check_gradients(model):
    for name, param in model.named_parameters():
        if param.grad is not None:
            grad_norm = param.grad.norm().item()
            if grad_norm < 1e-7:
                print(f"⚠️ Vanishing gradient in {name}: {grad_norm:.2e}")
            elif grad_norm > 1000:
                print(f"⚠️ Exploding gradient in {name}: {grad_norm:.2e}")
            else:
                print(f"✓ {name}: {grad_norm:.4f}")

# Use during training
for batch in dataloader:
    loss.backward()
    check_gradients(model)
    optimizer.step()
\`\`\`

## Best Practices

1. **Use ReLU or variants** for hidden layers
2. **Use proper initialization** (Xavier, Kaiming)
3. **Add BatchNorm** between layers
4. **Use skip connections** for very deep networks
5. **Clip gradients** for RNNs and unstable training
6. **Monitor gradient norms** during training`,

  'training-neural-networks': `# Training Neural Networks

A comprehensive guide to training neural networks effectively.

## The Training Loop

\`\`\`python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader

def train(model, train_loader, val_loader, epochs, device):
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=5)
    
    best_val_loss = float('inf')
    
    for epoch in range(epochs):
        # Training phase
        model.train()
        train_loss = 0
        
        for batch_idx, (data, target) in enumerate(train_loader):
            data, target = data.to(device), target.to(device)
            
            optimizer.zero_grad()          # Clear gradients
            output = model(data)           # Forward pass
            loss = criterion(output, target)  # Compute loss
            loss.backward()                # Backward pass
            optimizer.step()               # Update weights
            
            train_loss += loss.item()
        
        # Validation phase
        model.eval()
        val_loss = 0
        correct = 0
        
        with torch.no_grad():
            for data, target in val_loader:
                data, target = data.to(device), target.to(device)
                output = model(data)
                val_loss += criterion(output, target).item()
                pred = output.argmax(dim=1)
                correct += pred.eq(target).sum().item()
        
        val_loss /= len(val_loader)
        accuracy = correct / len(val_loader.dataset)
        
        # Learning rate scheduling
        scheduler.step(val_loss)
        
        # Save best model
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), 'best_model.pth')
        
        print(f'Epoch {epoch}: Train Loss={train_loss/len(train_loader):.4f}, '
              f'Val Loss={val_loss:.4f}, Accuracy={accuracy:.4f}')
\`\`\`

## Optimization Strategies

### Optimizers

\`\`\`python
# SGD - Simple but needs tuning
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)

# Adam - Good default choice
optimizer = optim.Adam(model.parameters(), lr=0.001)

# AdamW - Adam with better weight decay
optimizer = optim.AdamW(model.parameters(), lr=0.001, weight_decay=0.01)
\`\`\`

### Learning Rate Scheduling

\`\`\`python
# Step decay
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=30, gamma=0.1)

# Reduce on plateau
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=10)

# Cosine annealing
scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=100)

# Warmup + decay
def warmup_scheduler(epoch):
    if epoch < 5:
        return epoch / 5
    return 0.5 * (1 + np.cos(np.pi * (epoch - 5) / 95))

scheduler = optim.lr_scheduler.LambdaLR(optimizer, warmup_scheduler)
\`\`\`

## Regularization Techniques

### Dropout

\`\`\`python
class Model(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 256)
        self.dropout = nn.Dropout(0.5)  # 50% dropout
        self.fc2 = nn.Linear(256, 10)
    
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.dropout(x)  # Only active during training
        return self.fc2(x)
\`\`\`

### Weight Decay (L2 Regularization)

\`\`\`python
optimizer = optim.Adam(model.parameters(), lr=0.001, weight_decay=0.01)
\`\`\`

### Data Augmentation

\`\`\`python
from torchvision import transforms

transform = transforms.Compose([
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])
\`\`\`

## Early Stopping

\`\`\`python
class EarlyStopping:
    def __init__(self, patience=7, min_delta=0):
        self.patience = patience
        self.min_delta = min_delta
        self.counter = 0
        self.best_loss = None
        self.early_stop = False
    
    def __call__(self, val_loss):
        if self.best_loss is None:
            self.best_loss = val_loss
        elif val_loss > self.best_loss - self.min_delta:
            self.counter += 1
            if self.counter >= self.patience:
                self.early_stop = True
        else:
            self.best_loss = val_loss
            self.counter = 0

# Usage
early_stopping = EarlyStopping(patience=10)
for epoch in range(max_epochs):
    train(...)
    val_loss = validate(...)
    early_stopping(val_loss)
    if early_stopping.early_stop:
        print("Early stopping triggered")
        break
\`\`\`

## Batch Size Considerations

| Batch Size | Pros | Cons |
|------------|------|------|
| Small (16-32) | Better generalization, less memory | Noisy gradients, slow |
| Medium (64-128) | Good balance | - |
| Large (256+) | Faster, stable gradients | May generalize worse, more memory |

## Training Tips

1. **Start simple**: Get a basic model working first
2. **Overfit first**: Ensure your model can memorize a small dataset
3. **Monitor training**: Use TensorBoard or wandb
4. **Check gradients**: Watch for vanishing/exploding
5. **Save checkpoints**: Don't lose progress!
6. **Reproducibility**: Set random seeds`,

  // CHAPTER 28: DEEP LEARNING
  'introduction-to-deep-learning': `# Introduction to Deep Learning

Deep learning is machine learning with neural networks that have many layers.

## What Makes it "Deep"?

\`\`\`
Shallow Network (1-2 layers):
Input → Hidden → Output

Deep Network (many layers):
Input → Hidden₁ → Hidden₂ → ... → Hidden_n → Output
\`\`\`

Modern deep networks can have hundreds or even thousands of layers!

## Why Deep Learning Works

### Hierarchical Feature Learning

Each layer learns increasingly abstract features:

\`\`\`
Image Recognition:
Layer 1: Edges (/)  (\)  (|)  (-)
Layer 2: Shapes (○)  (□)  (△)
Layer 3: Parts  (eye)  (nose)  (ear)
Layer 4: Objects (face)  (car)  (dog)
\`\`\`

\`\`\`
Natural Language:
Layer 1: Characters
Layer 2: Word parts (morphemes)
Layer 3: Words
Layer 4: Phrases
Layer 5: Sentences
Layer 6: Meaning/Intent
\`\`\`

## The Deep Learning Revolution

### What Changed?

1. **Data**: Massive datasets (ImageNet, web-scale text)
2. **Compute**: GPUs made training feasible
3. **Algorithms**: Better architectures, optimization tricks
4. **Software**: PyTorch, TensorFlow made it accessible

### Key Milestones

\`\`\`
2012: AlexNet wins ImageNet (CNNs for vision)
2014: GANs invented (generative models)
2015: ResNet - 152 layers! (skip connections)
2017: Transformer architecture (attention is all you need)
2018: BERT (pre-trained language models)
2020: GPT-3 (175 billion parameters)
2022: ChatGPT (RLHF for instruction following)
2023: GPT-4 (multimodal, reasoning)
\`\`\`

## Deep Learning vs Traditional ML

| Aspect | Traditional ML | Deep Learning |
|--------|---------------|---------------|
| Features | Hand-engineered | Learned automatically |
| Data needs | Works with small data | Needs lots of data |
| Compute | CPU sufficient | Needs GPUs |
| Interpretability | Often interpretable | Often "black box" |
| Performance ceiling | Hits plateau | Scales with data/compute |

## When to Use Deep Learning

### ✓ Good Fit
- Large datasets (millions of examples)
- Complex patterns (images, audio, text)
- End-to-end learning desired
- State-of-the-art performance needed

### ✗ Maybe Not
- Small datasets
- Need interpretability
- Limited compute
- Simple patterns (use simpler models!)

## Setting Up Deep Learning

\`\`\`python
import torch
import torch.nn as nn

# Check GPU availability
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

# Simple deep network
model = nn.Sequential(
    nn.Linear(784, 512),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(512, 256),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(256, 128),
    nn.ReLU(),
    nn.Linear(128, 10)
).to(device)

# Count parameters
total_params = sum(p.numel() for p in model.parameters())
print(f"Total parameters: {total_params:,}")  # ~535,000
\`\`\`

## The Deep Learning Workflow

\`\`\`
1. Data Collection & Preprocessing
        ↓
2. Model Architecture Design
        ↓
3. Training Loop
        ↓
4. Evaluation & Iteration
        ↓
5. Deployment
\`\`\``,

  'pooling-layers': `# Pooling Layers

Pooling layers reduce spatial dimensions while retaining important features.

## Why Pooling?

1. **Reduce computation**: Fewer parameters to compute
2. **Provide translation invariance**: Small shifts don't matter
3. **Prevent overfitting**: Fewer parameters = less memorization
4. **Increase receptive field**: Each neuron "sees" more of the input

## Types of Pooling

### Max Pooling

Takes the maximum value in each window:

\`\`\`
Input (4×4):          Max Pool 2×2:
┌───┬───┬───┬───┐     ┌───┬───┐
│ 1 │ 3 │ 2 │ 4 │     │ 4 │ 6 │  max(1,3,2,4)=4
├───┼───┼───┼───┤     ├───┼───┤
│ 2 │ 4 │ 1 │ 6 │ →   │ 8 │ 9 │
├───┼───┼───┼───┤     └───┴───┘
│ 5 │ 8 │ 7 │ 3 │
├───┼───┼───┼───┤
│ 3 │ 1 │ 9 │ 2 │
└───┴───┴───┴───┘

Output is 2×2 (half the size!)
\`\`\`

\`\`\`python
import torch
import torch.nn as nn

# Max pooling
max_pool = nn.MaxPool2d(kernel_size=2, stride=2)

x = torch.tensor([[[
    [1, 3, 2, 4],
    [2, 4, 1, 6],
    [5, 8, 7, 3],
    [3, 1, 9, 2]
]]], dtype=torch.float)

output = max_pool(x)
print(output)
# tensor([[[[4., 6.],
#           [8., 9.]]]])
\`\`\`

### Average Pooling

Takes the average value in each window:

\`\`\`python
avg_pool = nn.AvgPool2d(kernel_size=2, stride=2)
output = avg_pool(x)
# Average of each 2×2 region
\`\`\`

### Global Pooling

Reduces each channel to a single value:

\`\`\`python
# Global Average Pooling - common before final classifier
gap = nn.AdaptiveAvgPool2d(1)

x = torch.randn(1, 64, 7, 7)  # (batch, channels, H, W)
output = gap(x)  # (1, 64, 1, 1)
output = output.view(1, 64)  # Flatten for FC layer
\`\`\`

## Pooling Parameters

\`\`\`python
# kernel_size: Size of pooling window
# stride: How much to move window (default = kernel_size)
# padding: Zero-padding around input

pool = nn.MaxPool2d(
    kernel_size=3,    # 3×3 window
    stride=2,         # Move 2 pixels
    padding=1         # Add 1 pixel border
)
\`\`\`

## When to Use Each Type

| Type | Use Case |
|------|----------|
| Max Pooling | General feature extraction, CNNs |
| Average Pooling | Smooth features, less aggressive |
| Global Average | Replace fully connected layers |

## Pooling in a CNN

\`\`\`python
class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),  # 32×32 → 16×16
            
            nn.Conv2d(32, 64, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),  # 16×16 → 8×8
            
            nn.Conv2d(64, 128, 3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d(1)  # 8×8 → 1×1
        )
        self.classifier = nn.Linear(128, 10)
    
    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)  # Flatten
        return self.classifier(x)
\`\`\`

## Alternative: Strided Convolutions

Instead of pooling, you can use strided convolutions:

\`\`\`python
# Pooling approach
nn.Conv2d(32, 64, 3, padding=1),
nn.MaxPool2d(2)

# Strided convolution approach
nn.Conv2d(32, 64, 3, stride=2, padding=1)
\`\`\`

Strided convolutions are learnable and often preferred in modern architectures.`,

  'convolutional-neural-networks': `# Convolutional Neural Networks (CNNs)

CNNs are the foundation of modern computer vision, designed to process grid-like data efficiently.

## Why CNNs for Images?

Fully connected networks don't scale:
\`\`\`
224×224 RGB image = 150,528 inputs
First hidden layer with 1000 neurons = 150 million parameters!
\`\`\`

CNNs exploit image structure:
- **Local connectivity**: Neurons only connect to nearby pixels
- **Parameter sharing**: Same filter applied across entire image
- **Translation equivariance**: Features detected anywhere

## CNN Building Blocks

\`\`\`python
import torch.nn as nn

class CNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        
        # Convolutional layers (feature extraction)
        self.conv_layers = nn.Sequential(
            # Block 1
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2),
            
            # Block 2
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2),
            
            # Block 3
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d(1)
        )
        
        # Classifier (decision making)
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, num_classes)
        )
    
    def forward(self, x):
        x = self.conv_layers(x)
        x = self.classifier(x)
        return x
\`\`\`

## Feature Visualization

\`\`\`
Input Image
    ↓
Conv Layer 1: Detects edges, colors
    [diagonal edges] [horizontal edges] [color blobs]
    ↓
Conv Layer 2: Detects textures, patterns
    [fur texture] [scales] [stripes]
    ↓
Conv Layer 3: Detects parts
    [eyes] [ears] [noses]
    ↓
Conv Layer 4: Detects objects
    [cat face] [dog face]
    ↓
Classifier: Makes decision
    "This is a cat" (95%)
\`\`\`

## Famous CNN Architectures

### LeNet (1998)
\`\`\`python
# Original CNN for digit recognition
nn.Sequential(
    nn.Conv2d(1, 6, 5),
    nn.Tanh(),
    nn.AvgPool2d(2),
    nn.Conv2d(6, 16, 5),
    nn.Tanh(),
    nn.AvgPool2d(2),
    nn.Flatten(),
    nn.Linear(16*5*5, 120),
    nn.Tanh(),
    nn.Linear(120, 84),
    nn.Tanh(),
    nn.Linear(84, 10)
)
\`\`\`

### VGG (2014)
\`\`\`python
# Very deep with 3×3 convolutions
# Key insight: Stack small filters instead of large ones
\`\`\`

### ResNet (2015)
\`\`\`python
# Skip connections enable very deep networks
class ResBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, 3, padding=1)
        self.bn1 = nn.BatchNorm2d(channels)
        self.conv2 = nn.Conv2d(channels, channels, 3, padding=1)
        self.bn2 = nn.BatchNorm2d(channels)
    
    def forward(self, x):
        residual = x
        x = F.relu(self.bn1(self.conv1(x)))
        x = self.bn2(self.conv2(x))
        x = F.relu(x + residual)  # Skip connection!
        return x
\`\`\`

## Transfer Learning

Use pre-trained CNNs for your tasks:

\`\`\`python
from torchvision import models

# Load pre-trained ResNet
model = models.resnet50(pretrained=True)

# Freeze all layers
for param in model.parameters():
    param.requires_grad = False

# Replace final layer for your task
model.fc = nn.Linear(2048, num_your_classes)

# Only train the new layer!
\`\`\`

## Training a CNN

\`\`\`python
from torchvision import datasets, transforms

# Data augmentation for training
train_transform = transforms.Compose([
    transforms.RandomHorizontalFlip(),
    transforms.RandomCrop(32, padding=4),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

# Load CIFAR-10
train_dataset = datasets.CIFAR10(
    root='./data', train=True, transform=train_transform, download=True
)
train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)

# Train
model = CNN(num_classes=10).to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
criterion = nn.CrossEntropyLoss()

for epoch in range(10):
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
\`\`\``,

  'the-convolution-operation': `# The Convolution Operation

Convolution is the core operation that gives CNNs their power.

## What is Convolution?

A filter (kernel) slides across the input, computing element-wise multiplication and sum at each position:

\`\`\`
Input (5×5):              Filter (3×3):           Output:
┌───┬───┬───┬───┬───┐     ┌───┬───┬───┐
│ 1 │ 2 │ 3 │ 0 │ 1 │     │ 1 │ 0 │ 1 │
├───┼───┼───┼───┼───┤     ├───┼───┼───┤
│ 0 │ 1 │ 2 │ 3 │ 2 │     │ 0 │ 1 │ 0 │     
├───┼───┼───┼───┼───┤  *  ├───┼───┼───┤  =  [result]
│ 1 │ 0 │ 1 │ 0 │ 1 │     │ 1 │ 0 │ 1 │
├───┼───┼───┼───┼───┤     └───┴───┴───┘
│ 2 │ 1 │ 0 │ 1 │ 0 │
├───┼───┼───┼───┼───┤
│ 0 │ 1 │ 2 │ 1 │ 1 │
└───┴───┴───┴───┴───┘

Position (0,0): 1×1 + 2×0 + 3×1 + 0×0 + 1×1 + 2×0 + 1×1 + 0×0 + 1×1 = 8
\`\`\`

## Implementation

\`\`\`python
import numpy as np

def convolve2d(image, kernel):
    """Simple 2D convolution (no padding, stride=1)"""
    img_h, img_w = image.shape
    ker_h, ker_w = kernel.shape
    
    out_h = img_h - ker_h + 1
    out_w = img_w - ker_w + 1
    output = np.zeros((out_h, out_w))
    
    for i in range(out_h):
        for j in range(out_w):
            # Extract patch
            patch = image[i:i+ker_h, j:j+ker_w]
            # Element-wise multiply and sum
            output[i, j] = np.sum(patch * kernel)
    
    return output

# Example
image = np.array([
    [1, 2, 3, 0, 1],
    [0, 1, 2, 3, 2],
    [1, 0, 1, 0, 1],
    [2, 1, 0, 1, 0],
    [0, 1, 2, 1, 1]
], dtype=float)

# Edge detection kernel
sobel_x = np.array([
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
])

output = convolve2d(image, sobel_x)
print(output)
\`\`\`

## PyTorch Convolutions

\`\`\`python
import torch
import torch.nn as nn

# 2D Convolution
conv = nn.Conv2d(
    in_channels=3,      # RGB input
    out_channels=32,    # 32 filters
    kernel_size=3,      # 3×3 filters
    stride=1,           # Move 1 pixel at a time
    padding=1           # Add border to maintain size
)

# Input shape: (batch, channels, height, width)
x = torch.randn(1, 3, 32, 32)
output = conv(x)
print(f"Input: {x.shape}")   # [1, 3, 32, 32]
print(f"Output: {output.shape}")  # [1, 32, 32, 32]
\`\`\`

## Key Parameters

### Stride
How much the filter moves:

\`\`\`
Stride=1: Overlapping        Stride=2: Skipping
┌───┬───┬───┐               ┌───┬───┬───┐
│ * │→*│  │               │ * │   │ * │
├───┼───┼───┤               ├───┼───┼───┤
│   │   │   │               │   │   │   │
└───┴───┴───┘               └───┴───┴───┘
\`\`\`

### Padding
Adding zeros around the border:

\`\`\`python
# Without padding: output shrinks
conv_no_pad = nn.Conv2d(1, 1, kernel_size=3, padding=0)
# Input 32×32 → Output 30×30

# With padding: output same size
conv_with_pad = nn.Conv2d(1, 1, kernel_size=3, padding=1)
# Input 32×32 → Output 32×32
\`\`\`

## Common Filters

\`\`\`python
# Edge detection (horizontal)
horizontal_edge = torch.tensor([[
    [-1, -1, -1],
    [ 0,  0,  0],
    [ 1,  1,  1]
]], dtype=torch.float)

# Edge detection (vertical)
vertical_edge = torch.tensor([[
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1]
]], dtype=torch.float)

# Blur
blur = torch.tensor([[
    [1/9, 1/9, 1/9],
    [1/9, 1/9, 1/9],
    [1/9, 1/9, 1/9]
]], dtype=torch.float)

# Sharpen
sharpen = torch.tensor([[
    [ 0, -1,  0],
    [-1,  5, -1],
    [ 0, -1,  0]
]], dtype=torch.float)
\`\`\`

## Output Size Formula

\`\`\`
Output Size = (Input Size - Kernel Size + 2×Padding) / Stride + 1

Example:
Input: 32×32, Kernel: 3×3, Padding: 1, Stride: 1
Output = (32 - 3 + 2×1) / 1 + 1 = 32×32

Input: 32×32, Kernel: 3×3, Padding: 0, Stride: 2
Output = (32 - 3 + 0) / 2 + 1 = 15×15
\`\`\``,

  'recurrent-neural-networks': `# Recurrent Neural Networks (RNNs)

RNNs are designed for sequential data where order matters.

## Why RNNs?

Standard networks can't handle sequences:
- Each input is processed independently
- No memory of previous inputs
- Can't handle variable-length inputs

RNNs maintain hidden state that acts as memory:

\`\`\`
Standard:  x₁ → [Network] → y₁
           x₂ → [Network] → y₂  (no connection between steps)

RNN:       x₁ → [Network] → y₁
                    ↓ h₁
           x₂ → [Network] → y₂
                    ↓ h₂
           x₃ → [Network] → y₃
\`\`\`

## Basic RNN Cell

\`\`\`python
import torch
import torch.nn as nn

class SimpleRNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.hidden_size = hidden_size
        
        # Input to hidden
        self.i2h = nn.Linear(input_size + hidden_size, hidden_size)
        # Hidden to output
        self.h2o = nn.Linear(hidden_size, output_size)
    
    def forward(self, x, hidden):
        # Concatenate input and previous hidden state
        combined = torch.cat([x, hidden], dim=1)
        # Update hidden state
        hidden = torch.tanh(self.i2h(combined))
        # Compute output
        output = self.h2o(hidden)
        return output, hidden
    
    def init_hidden(self, batch_size):
        return torch.zeros(batch_size, self.hidden_size)

# Usage
rnn = SimpleRNN(input_size=10, hidden_size=20, output_size=5)
hidden = rnn.init_hidden(batch_size=32)

# Process sequence one step at a time
for t in range(sequence_length):
    x_t = sequence[:, t, :]  # (batch, features)
    output, hidden = rnn(x_t, hidden)
\`\`\`

## Using PyTorch's RNN

\`\`\`python
# Built-in RNN
rnn = nn.RNN(
    input_size=10,    # Features per timestep
    hidden_size=20,   # Hidden state size
    num_layers=2,     # Stacked RNN layers
    batch_first=True  # Input shape: (batch, seq, features)
)

# Input shape: (batch_size, sequence_length, input_size)
x = torch.randn(32, 50, 10)  # 32 sequences of length 50

# Forward pass
output, hidden = rnn(x)
print(f"Output shape: {output.shape}")  # (32, 50, 20)
print(f"Hidden shape: {hidden.shape}")  # (2, 32, 20)
\`\`\`

## LSTM (Long Short-Term Memory)

LSTMs solve the vanishing gradient problem with gates:

\`\`\`python
lstm = nn.LSTM(
    input_size=10,
    hidden_size=20,
    num_layers=2,
    batch_first=True,
    dropout=0.2,      # Dropout between layers
    bidirectional=True # Process both directions
)

x = torch.randn(32, 50, 10)
output, (hidden, cell) = lstm(x)
# Bidirectional: hidden_size * 2
print(f"Output shape: {output.shape}")  # (32, 50, 40)
\`\`\`

## GRU (Gated Recurrent Unit)

Simpler than LSTM, often similar performance:

\`\`\`python
gru = nn.GRU(
    input_size=10,
    hidden_size=20,
    num_layers=2,
    batch_first=True
)

output, hidden = gru(x)
\`\`\`

## Applications

### Text Classification

\`\`\`python
class TextClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_classes):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, num_classes)
    
    def forward(self, x):
        embedded = self.embedding(x)  # (batch, seq, embed)
        _, (hidden, _) = self.lstm(embedded)
        output = self.fc(hidden[-1])  # Use last hidden state
        return output
\`\`\`

### Sequence-to-Sequence

\`\`\`python
class Seq2Seq(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.encoder = nn.LSTM(input_dim, hidden_dim, batch_first=True)
        self.decoder = nn.LSTM(output_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)
    
    def forward(self, source, target):
        # Encode
        _, (hidden, cell) = self.encoder(source)
        
        # Decode
        output, _ = self.decoder(target, (hidden, cell))
        predictions = self.fc(output)
        return predictions
\`\`\`

## When to Use RNNs vs Alternatives

| Task | Model |
|------|-------|
| Simple sequences | RNN/GRU |
| Long sequences | LSTM/Transformer |
| Text understanding | Transformer |
| Time series | LSTM/Transformer |
| Real-time processing | RNN/GRU |`,

  'modern-architectures': `# Modern Deep Learning Architectures

An overview of the architectures that define modern deep learning.

## Transformer Architecture

The dominant architecture for NLP and increasingly vision:

\`\`\`python
import torch
import torch.nn as nn

class TransformerBlock(nn.Module):
    def __init__(self, embed_dim, num_heads, ff_dim, dropout=0.1):
        super().__init__()
        self.attention = nn.MultiheadAttention(embed_dim, num_heads)
        self.norm1 = nn.LayerNorm(embed_dim)
        self.norm2 = nn.LayerNorm(embed_dim)
        self.ff = nn.Sequential(
            nn.Linear(embed_dim, ff_dim),
            nn.GELU(),
            nn.Linear(ff_dim, embed_dim)
        )
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x):
        # Self-attention with residual
        attn_out, _ = self.attention(x, x, x)
        x = self.norm1(x + self.dropout(attn_out))
        
        # Feed-forward with residual
        ff_out = self.ff(x)
        x = self.norm2(x + self.dropout(ff_out))
        
        return x

# Vision Transformer (ViT)
class ViT(nn.Module):
    def __init__(self, image_size, patch_size, num_classes, embed_dim, depth, heads):
        super().__init__()
        num_patches = (image_size // patch_size) ** 2
        patch_dim = 3 * patch_size ** 2
        
        self.patch_embed = nn.Linear(patch_dim, embed_dim)
        self.pos_embed = nn.Parameter(torch.randn(1, num_patches + 1, embed_dim))
        self.cls_token = nn.Parameter(torch.randn(1, 1, embed_dim))
        
        self.transformer = nn.Sequential(*[
            TransformerBlock(embed_dim, heads, embed_dim * 4)
            for _ in range(depth)
        ])
        
        self.head = nn.Linear(embed_dim, num_classes)
\`\`\`

## ResNet (Residual Networks)

Skip connections enable very deep networks:

\`\`\`python
class ResidualBlock(nn.Module):
    def __init__(self, in_channels, out_channels, stride=1):
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels, out_channels, 3, stride, 1, bias=False)
        self.bn1 = nn.BatchNorm2d(out_channels)
        self.conv2 = nn.Conv2d(out_channels, out_channels, 3, 1, 1, bias=False)
        self.bn2 = nn.BatchNorm2d(out_channels)
        
        # Shortcut connection
        self.shortcut = nn.Sequential()
        if stride != 1 or in_channels != out_channels:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_channels, out_channels, 1, stride, bias=False),
                nn.BatchNorm2d(out_channels)
            )
    
    def forward(self, x):
        out = torch.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += self.shortcut(x)  # Skip connection!
        return torch.relu(out)
\`\`\`

## U-Net (Image Segmentation)

Encoder-decoder with skip connections:

\`\`\`python
class UNet(nn.Module):
    def __init__(self, in_channels, num_classes):
        super().__init__()
        
        # Encoder (downsampling)
        self.enc1 = self.conv_block(in_channels, 64)
        self.enc2 = self.conv_block(64, 128)
        self.enc3 = self.conv_block(128, 256)
        
        self.pool = nn.MaxPool2d(2)
        
        # Decoder (upsampling)
        self.up2 = nn.ConvTranspose2d(256, 128, 2, stride=2)
        self.dec2 = self.conv_block(256, 128)  # 128 + 128 from skip
        
        self.up1 = nn.ConvTranspose2d(128, 64, 2, stride=2)
        self.dec1 = self.conv_block(128, 64)
        
        self.final = nn.Conv2d(64, num_classes, 1)
    
    def conv_block(self, in_ch, out_ch):
        return nn.Sequential(
            nn.Conv2d(in_ch, out_ch, 3, padding=1),
            nn.BatchNorm2d(out_ch),
            nn.ReLU(),
            nn.Conv2d(out_ch, out_ch, 3, padding=1),
            nn.BatchNorm2d(out_ch),
            nn.ReLU()
        )
    
    def forward(self, x):
        # Encoder
        e1 = self.enc1(x)
        e2 = self.enc2(self.pool(e1))
        e3 = self.enc3(self.pool(e2))
        
        # Decoder with skip connections
        d2 = self.up2(e3)
        d2 = self.dec2(torch.cat([d2, e2], dim=1))
        
        d1 = self.up1(d2)
        d1 = self.dec1(torch.cat([d1, e1], dim=1))
        
        return self.final(d1)
\`\`\`

## Using Pre-trained Models

\`\`\`python
from torchvision import models

# ResNet
resnet = models.resnet50(pretrained=True)

# EfficientNet
efficientnet = models.efficientnet_b0(pretrained=True)

# Vision Transformer
vit = models.vit_b_16(pretrained=True)

# For transfer learning
for param in resnet.parameters():
    param.requires_grad = False
resnet.fc = nn.Linear(2048, num_your_classes)
\`\`\`

## Architecture Trends

| Year | Architecture | Key Innovation |
|------|-------------|----------------|
| 2012 | AlexNet | Deep CNNs + GPUs |
| 2014 | VGG | Smaller filters, deeper |
| 2015 | ResNet | Skip connections |
| 2017 | Transformer | Self-attention |
| 2020 | ViT | Transformers for vision |
| 2021 | Swin Transformer | Efficient vision transformer |

## Choosing an Architecture

- **Image Classification**: EfficientNet, ResNet, ViT
- **Object Detection**: YOLO, Faster R-CNN
- **Segmentation**: U-Net, DeepLab
- **NLP**: BERT, GPT, T5
- **Time Series**: LSTM, Transformer
- **Generative**: GAN, VAE, Diffusion`
};

async function main() {
  console.log("📚 EXPANDING ML/DL CHAPTERS (25-28)");
  console.log("===================================\n");

  let updated = 0;

  for (const [slug, content] of Object.entries(expandedContent)) {
    try {
      const result = await prisma.lesson.updateMany({
        where: { slug },
        data: { content }
      });
      
      if (result.count > 0) {
        console.log(`✅ Updated: ${slug} (${content.length} chars)`);
        updated++;
      } else {
        console.log(`⚠️ Not found: ${slug}`);
      }
    } catch (e) {
      console.log(`❌ Error updating ${slug}: ${e.message}`);
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`🎉 Updated ${updated} lessons with expanded content!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
