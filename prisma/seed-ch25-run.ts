// Run with: npx ts-node prisma/seed-ch25-run.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🤖 Seeding Chapter 25: Machine Learning Fundamentals...\n");

  // ==================== CHAPTER 25 ====================
  const chapter25 = await prisma.chapter.upsert({
    where: { number: 25 },
    update: {},
    create: {
      number: 25,
      title: "Machine Learning Fundamentals",
      description: "Introduction to machine learning concepts, algorithms, and evaluation techniques. Learn supervised and unsupervised learning, model training, and how to evaluate ML models.",
      objectives: [
        "Understand what machine learning is and its types",
        "Learn core ML concepts: features, labels, training, testing",
        "Implement basic ML algorithms from scratch",
        "Evaluate models using proper metrics and techniques",
      ],
      imageUrl: "/images/chapters/ch25-ml-fundamentals.png",
      isPublished: true,
    },
  });

  console.log("✅ Created Chapter 25:", chapter25.title);

  // ==================== SECTION 25.1: ML Foundations ====================
  const section25_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter25.id, number: 25.1 } },
    update: {},
    create: {
      chapterId: chapter25.id,
      number: 25.1,
      title: "Machine Learning Foundations",
      description: "Core concepts and types of machine learning",
      order: 1,
    },
  });

  // Lesson 25.1.1 - What is Machine Learning
  await prisma.lesson.upsert({
    where: { slug: "what-is-machine-learning" },
    update: {},
    create: {
      sectionId: section25_1.id,
      number: 25.11,
      title: "What is Machine Learning?",
      slug: "what-is-machine-learning",
      objectives: [
        "Understand what machine learning is",
        "Distinguish ML from traditional programming",
        "Recognize the ML workflow",
      ],
      content: `# What is Machine Learning?

Machine Learning is **the science of getting computers to learn from data without being explicitly programmed**.

> "A computer program is said to learn from experience E with respect to some class of tasks T and performance measure P, if its performance at tasks in T, as measured by P, improves with experience E."
> — Tom Mitchell, Carnegie Mellon University

## Traditional Programming vs Machine Learning

### Traditional Programming
\`\`\`
Input: Data + Rules → Output: Answers
Example: "If email contains 'lottery winner', mark as spam"
\`\`\`

### Machine Learning
\`\`\`
Input: Data + Answers → Output: Rules (Model)
Example: Show 10,000 spam/not-spam emails → Model learns patterns
\`\`\`

## The ML Process

1. **Define the Problem** - What are you predicting?
2. **Collect Data** - More quality data = better models
3. **Prepare Data** - Clean, normalize, encode
4. **Choose a Model** - Linear? Tree? Neural Network?
5. **Train** - Model learns from data
6. **Evaluate** - Test on unseen data
7. **Deploy** - Use in production

## Your First ML Model

\`\`\`python
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

# Load data
X, y = load_iris(return_X_y=True)

# Split: 80% train, 20% test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train
model = DecisionTreeClassifier()
model.fit(X_train, y_train)

# Evaluate
print(f"Accuracy: {model.score(X_test, y_test):.1%}")
\`\`\`

## Key Takeaways

1. **ML learns from data** instead of explicit rules
2. **The process is iterative**: data → train → evaluate → improve
3. **Data quality is crucial**: bad data = bad predictions`,
      codeExamples: JSON.stringify([
        {
          id: "first-ml",
          title: "First ML Model",
          code: `from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = DecisionTreeClassifier()
model.fit(X_train, y_train)
print(f"Accuracy: {model.score(X_test, y_test):.1%}")`,
          description: "Train a decision tree on the Iris dataset",
        },
      ]),
      keyPoints: [
        "ML learns patterns from data automatically",
        "Traditional programming: rules → answers; ML: data → rules",
        "The ML workflow: collect, prepare, train, evaluate, deploy",
      ],
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });

  // Lesson 25.1.2 - Types of ML
  await prisma.lesson.upsert({
    where: { slug: "ml-types-supervised-unsupervised-reinforcement" },
    update: {},
    create: {
      sectionId: section25_1.id,
      number: 25.12,
      title: "Types of Machine Learning",
      slug: "ml-types-supervised-unsupervised-reinforcement",
      objectives: [
        "Understand supervised learning (classification & regression)",
        "Understand unsupervised learning (clustering)",
        "Understand reinforcement learning basics",
      ],
      content: `# Types of Machine Learning

## Overview

| Type | Has Labels? | Goal | Example |
|------|-------------|------|---------|
| **Supervised** | Yes ✓ | Predict labels | Email → Spam/Not Spam |
| **Unsupervised** | No ✗ | Find patterns | Customer segmentation |
| **Reinforcement** | Rewards | Learn actions | Game AI, robotics |

## 1. Supervised Learning

Uses **labeled data** - examples where we know the correct answer.

### Classification: Predict a Category
\`\`\`python
from sklearn.naive_bayes import MultinomialNB
classifier = MultinomialNB()
classifier.fit(email_features, spam_labels)  # 0 or 1
\`\`\`

### Regression: Predict a Number
\`\`\`python
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(house_features, prices)  # $247,500
\`\`\`

## 2. Unsupervised Learning

Finds **hidden patterns** without labeled examples.

### Clustering
\`\`\`python
from sklearn.cluster import KMeans
kmeans = KMeans(n_clusters=3)
kmeans.fit(customer_data)
segments = kmeans.labels_
\`\`\`

## 3. Reinforcement Learning

Learns through **trial and error** with rewards.

\`\`\`
Agent → Action → Environment → Reward → Learn
\`\`\`

## Choosing the Right Type

- Have labels? → **Supervised**
- No labels, find groups? → **Unsupervised** 
- Learning from interaction? → **Reinforcement**`,
      codeExamples: JSON.stringify([
        {
          id: "supervised-example",
          title: "Supervised: Classification",
          code: `from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier

X, y = load_iris(return_X_y=True)
model = DecisionTreeClassifier()
model.fit(X, y)
print("Predicted class:", model.predict([[5.1, 3.5, 1.4, 0.2]])[0])`,
          description: "Classify iris flowers by species",
        },
        {
          id: "unsupervised-example",
          title: "Unsupervised: Clustering",
          code: `from sklearn.cluster import KMeans
import numpy as np

data = np.array([[1, 2], [1.5, 1.8], [5, 8], [8, 8], [1, 0.6], [9, 11]])
kmeans = KMeans(n_clusters=2)
kmeans.fit(data)
print("Cluster labels:", kmeans.labels_)`,
          description: "Group data points into clusters",
        },
      ]),
      keyPoints: [
        "Supervised = labeled data (classification/regression)",
        "Unsupervised = unlabeled data (clustering/patterns)",
        "Reinforcement = learn from rewards/penalties",
      ],
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });

  // Lesson 25.1.3 - Features and Labels
  await prisma.lesson.upsert({
    where: { slug: "features-and-labels" },
    update: {},
    create: {
      sectionId: section25_1.id,
      number: 25.13,
      title: "Features and Labels",
      slug: "features-and-labels",
      objectives: [
        "Understand features (X) and labels (y)",
        "Learn about feature types and engineering",
        "Prepare data for ML models",
      ],
      content: `# Features and Labels

## Features (X) - The Inputs

Features are **measurable properties** used to make predictions.

\`\`\`python
features = {
    'square_feet': 1500,
    'bedrooms': 3,
    'age_years': 10,
}
\`\`\`

## Labels (y) - The Output

The label is **what we're trying to predict**.

\`\`\`python
label = 285000  # House price
\`\`\`

## Feature Types

| Type | Example |
|------|---------|
| **Numerical** | age=25, salary=50000 |
| **Categorical** | color='red', city='Boston' |
| **Binary** | has_garage=True |

## Feature Engineering

> "Applied machine learning is basically feature engineering."
> — Andrew Ng, Stanford

\`\`\`python
# Create new features
df['area'] = df['length'] * df['width']
df['age_squared'] = df['age'] ** 2

# Encode categorical
df = pd.get_dummies(df, columns=['color'])

# Scale numerical
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
\`\`\`

## The Feature Matrix

\`\`\`python
# X: n_samples × n_features
X = np.array([
    [1500, 3, 10],  # House 1
    [2000, 4, 5],   # House 2
])

# y: n_samples
y = np.array([285000, 450000])
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "feature-engineering",
          title: "Feature Engineering",
          code: `import pandas as pd
from sklearn.preprocessing import StandardScaler

df = pd.DataFrame({
    'length': [10, 20],
    'width': [5, 10],
    'category': ['A', 'B']
})

# Create feature
df['area'] = df['length'] * df['width']

# Encode categorical
df = pd.get_dummies(df, columns=['category'])

print(df)`,
          description: "Transform raw data into ML-ready features",
        },
      ]),
      keyPoints: [
        "Features (X) = inputs used for prediction",
        "Labels (y) = output we want to predict",
        "Feature engineering often matters more than algorithm choice",
        "Scale numerical features, encode categorical ones",
      ],
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 3,
      isPublished: true,
    },
  });

  // ==================== SECTION 25.2: Core Algorithms ====================
  const section25_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter25.id, number: 25.2 } },
    update: {},
    create: {
      chapterId: chapter25.id,
      number: 25.2,
      title: "Core ML Algorithms",
      description: "Essential machine learning algorithms",
      order: 2,
    },
  });

  // Lesson: Train/Test Split
  await prisma.lesson.upsert({
    where: { slug: "train-validation-test-sets" },
    update: {},
    create: {
      sectionId: section25_2.id,
      number: 25.21,
      title: "Train, Validation, and Test Sets",
      slug: "train-validation-test-sets",
      objectives: [
        "Understand why we split data",
        "Implement train/test splits",
        "Avoid data leakage",
      ],
      content: `# Train, Validation, and Test Sets

## Why Split Data?

If we test on training data, we get misleadingly optimistic results!

## The Three Splits

| Set | % | Purpose |
|-----|---|---------|
| **Train** | 60-80% | Model learns |
| **Validation** | 10-20% | Tune hyperparameters |
| **Test** | 10-20% | Final evaluation (ONCE!) |

## Implementation

\`\`\`python
from sklearn.model_selection import train_test_split

# Simple split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Three-way split
X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.2)
X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.25)
\`\`\`

## Data Leakage

❌ **WRONG:**
\`\`\`python
scaler.fit_transform(X)  # Sees ALL data!
X_train, X_test = train_test_split(X_scaled)
\`\`\`

✓ **CORRECT:**
\`\`\`python
X_train, X_test = train_test_split(X)
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # No fit!
\`\`\``,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Train = learn, Validation = tune, Test = final eval",
        "Test set used ONCE at the very end",
        "Fit preprocessing on training data only",
      ],
      estimatedTime: 12,
      difficulty: "BEGINNER",
      order: 4,
      isPublished: true,
    },
  });

  // Lesson: Linear Regression
  await prisma.lesson.upsert({
    where: { slug: "linear-regression" },
    update: {},
    create: {
      sectionId: section25_2.id,
      number: 25.22,
      title: "Linear Regression",
      slug: "linear-regression",
      objectives: [
        "Understand the linear regression model",
        "Implement linear regression",
        "Interpret coefficients",
      ],
      content: `# Linear Regression

Predicts continuous outputs by fitting a line to data.

## The Equation

\`\`\`
y = w₁x₁ + w₂x₂ + ... + b
\`\`\`

## Implementation

\`\`\`python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(f"R²: {r2_score(y_test, y_pred):.3f}")
print(f"Coefficients: {model.coef_}")
\`\`\`

## Interpreting Coefficients

Each coefficient = change in y per unit change in x:
- sqft: $150 → each sqft adds $150 to price
- age: -$2000 → each year reduces price by $2000`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "y = weighted sum of features + bias",
        "Coefficients show feature impact",
        "R² measures variance explained (0-1)",
      ],
      estimatedTime: 15,
      difficulty: "BEGINNER",
      order: 5,
      isPublished: true,
    },
  });

  // Lesson: Gradient Descent
  await prisma.lesson.upsert({
    where: { slug: "gradient-descent" },
    update: {},
    create: {
      sectionId: section25_2.id,
      number: 25.23,
      title: "Gradient Descent",
      slug: "gradient-descent",
      objectives: [
        "Understand how models learn via optimization",
        "Implement gradient descent",
        "Tune learning rate",
      ],
      content: `# Gradient Descent

The optimization algorithm that allows ML models to learn.

## The Core Idea

1. Start with random weights
2. Calculate gradient (direction of steepest increase)
3. Move OPPOSITE to gradient (downhill)
4. Repeat until convergence

## The Math

\`\`\`
w_new = w_old - α × ∇J(w)

α = learning rate (step size)
∇J = gradient of loss function
\`\`\`

## Learning Rate

- **Too small:** Takes forever
- **Too large:** Overshoots, never converges
- **Just right:** Converges efficiently

## Types

| Type | Data per Step | Speed |
|------|--------------|-------|
| Batch | All N | Slow |
| Stochastic | 1 | Fast |
| Mini-Batch | B | Balanced |`,
      codeExamples: JSON.stringify([]),
      keyPoints: [
        "Move opposite to gradient (downhill)",
        "Learning rate controls step size",
        "Always scale features first",
      ],
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 6,
      isPublished: true,
    },
  });

  // Continue with more lessons...
  // Logistic Regression
  await prisma.lesson.upsert({
    where: { slug: "logistic-regression" },
    update: {},
    create: {
      sectionId: section25_2.id,
      number: 25.24,
      title: "Logistic Regression",
      slug: "logistic-regression",
      objectives: ["Understand classification with logistic regression", "Use sigmoid function", "Adjust classification threshold"],
      content: `# Logistic Regression

For **classification**, not regression! Predicts probability (0-1).

## The Sigmoid Function

\`\`\`
σ(z) = 1 / (1 + e^(-z))
\`\`\`

Squashes any number to (0, 1).

## Usage

\`\`\`python
from sklearn.linear_model import LogisticRegression
model = LogisticRegression()
model.fit(X_train, y_train)
y_proba = model.predict_proba(X_test)  # Probabilities
\`\`\``,
      codeExamples: JSON.stringify([]),
      keyPoints: ["Sigmoid converts to probability", "Threshold (default 0.5) decides class", "Adjust threshold based on cost of errors"],
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 7,
      isPublished: true,
    },
  });

  // KNN
  await prisma.lesson.upsert({
    where: { slug: "k-nearest-neighbors" },
    update: {},
    create: {
      sectionId: section25_2.id,
      number: 25.25,
      title: "K-Nearest Neighbors",
      slug: "k-nearest-neighbors",
      objectives: ["Understand KNN algorithm", "Choose optimal K", "Know when to use KNN"],
      content: `# K-Nearest Neighbors

Predict based on the K most similar training examples.

## Algorithm

1. Find K closest training points
2. Classification: majority vote
3. Regression: average values

## Important: Scale Features!

\`\`\`python
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
\`\`\`

## Choosing K

- K too small → overfits
- K too large → underfits
- Rule: K ≈ √n`,
      codeExamples: JSON.stringify([]),
      keyPoints: ["Always scale features", "Use cross-validation to find K", "Simple but slow for large data"],
      estimatedTime: 12,
      difficulty: "BEGINNER",
      order: 8,
      isPublished: true,
    },
  });

  // Decision Trees
  await prisma.lesson.upsert({
    where: { slug: "decision-trees" },
    update: {},
    create: {
      sectionId: section25_2.id,
      number: 25.26,
      title: "Decision Trees",
      slug: "decision-trees",
      objectives: ["Understand decision tree structure", "Know Gini impurity", "Prevent overfitting"],
      content: `# Decision Trees

Make predictions through if-then-else questions.

## How Trees Split

Gini Impurity measures "mixedness":
\`\`\`
Gini = 1 - Σ(pᵢ)²
Pure node: Gini = 0
\`\`\`

## Preventing Overfitting

\`\`\`python
tree = DecisionTreeClassifier(
    max_depth=5,
    min_samples_leaf=10
)
\`\`\``,
      codeExamples: JSON.stringify([]),
      keyPoints: ["Gini = 0 means pure node", "Limit depth to prevent overfitting", "No scaling needed"],
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 9,
      isPublished: true,
    },
  });

  // Random Forests
  await prisma.lesson.upsert({
    where: { slug: "random-forests" },
    update: {},
    create: {
      sectionId: section25_2.id,
      number: 25.27,
      title: "Random Forests",
      slug: "random-forests",
      objectives: ["Understand ensemble learning", "Know bagging and feature randomness", "Use Random Forest effectively"],
      content: `# Random Forests

Many trees voting together = better predictions.

## Key Ideas

1. **Bagging**: Each tree sees random data sample
2. **Feature randomness**: Each split uses random features
3. **Voting**: Final prediction = majority vote

## Why It Works

Individual tree errors cancel out when averaged!

\`\`\`python
from sklearn.ensemble import RandomForestClassifier
rf = RandomForestClassifier(n_estimators=100)
rf.fit(X_train, y_train)
\`\`\``,
      codeExamples: JSON.stringify([]),
      keyPoints: ["Many trees reduce variance", "OOB score = free validation", "Works well out of the box"],
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 10,
      isPublished: true,
    },
  });

  // ==================== SECTION 25.3: Model Evaluation ====================
  const section25_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter25.id, number: 25.3 } },
    update: {},
    create: {
      chapterId: chapter25.id,
      number: 25.3,
      title: "Model Evaluation",
      description: "Techniques for evaluating and improving models",
      order: 3,
    },
  });

  // Bias-Variance
  await prisma.lesson.upsert({
    where: { slug: "bias-variance-tradeoff" },
    update: {},
    create: {
      sectionId: section25_3.id,
      number: 25.31,
      title: "Bias-Variance Tradeoff",
      slug: "bias-variance-tradeoff",
      objectives: ["Understand bias vs variance", "Diagnose underfitting/overfitting", "Find the sweet spot"],
      content: `# Bias-Variance Tradeoff

Total Error = Bias² + Variance + Noise

## High Bias (Underfitting)
- Model too simple
- High train AND test error

## High Variance (Overfitting)
- Model too complex
- Low train error, HIGH test error

## Finding Balance
Use cross-validation to find optimal complexity.`,
      codeExamples: JSON.stringify([]),
      keyPoints: ["High bias = underfitting", "High variance = overfitting", "Cross-validate to find sweet spot"],
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 11,
      isPublished: true,
    },
  });

  // Cross-Validation
  await prisma.lesson.upsert({
    where: { slug: "cross-validation" },
    update: {},
    create: {
      sectionId: section25_3.id,
      number: 25.32,
      title: "Cross-Validation",
      slug: "cross-validation",
      objectives: ["Implement K-fold cross-validation", "Choose K appropriately", "Use CV for model selection"],
      content: `# Cross-Validation

More reliable than single train/test split.

## K-Fold CV

Split into K parts. Train on K-1, test on 1. Repeat K times.

\`\`\`python
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5)
print(f"CV Score: {scores.mean():.3f} ± {scores.std():.3f}")
\`\`\``,
      codeExamples: JSON.stringify([]),
      keyPoints: ["Every point tested exactly once", "K=5 or K=10 is standard", "More reliable than single split"],
      estimatedTime: 12,
      difficulty: "INTERMEDIATE",
      order: 12,
      isPublished: true,
    },
  });

  // Regularization
  await prisma.lesson.upsert({
    where: { slug: "regularization" },
    update: {},
    create: {
      sectionId: section25_3.id,
      number: 25.33,
      title: "Regularization",
      slug: "regularization",
      objectives: ["Understand L1 and L2 regularization", "Choose regularization strength", "Prevent overfitting"],
      content: `# Regularization

Add penalty for large weights to prevent overfitting.

## L1 (Lasso)
\`Loss + λΣ|wᵢ|\`
→ Pushes weights to exactly 0 (feature selection)

## L2 (Ridge)
\`Loss + λΣwᵢ²\`
→ Shrinks all weights (smoother model)

\`\`\`python
from sklearn.linear_model import Ridge, Lasso
ridge = Ridge(alpha=1.0)
lasso = Lasso(alpha=0.1)
\`\`\``,
      codeExamples: JSON.stringify([]),
      keyPoints: ["L1 creates sparse models", "L2 shrinks all weights", "Higher λ = simpler model"],
      estimatedTime: 12,
      difficulty: "INTERMEDIATE",
      order: 13,
      isPublished: true,
    },
  });

  // Metrics
  await prisma.lesson.upsert({
    where: { slug: "model-evaluation-metrics" },
    update: {},
    create: {
      sectionId: section25_3.id,
      number: 25.34,
      title: "Model Evaluation Metrics",
      slug: "model-evaluation-metrics",
      objectives: ["Choose appropriate metrics", "Understand precision/recall", "Use confusion matrix"],
      content: `# Model Evaluation Metrics

## Classification

- **Accuracy**: Overall correctness (misleading for imbalanced data!)
- **Precision**: Of predicted positives, how many correct?
- **Recall**: Of actual positives, how many found?
- **F1**: Harmonic mean of precision/recall

## Regression

- **MAE**: Mean Absolute Error
- **RMSE**: Root Mean Squared Error
- **R²**: Variance explained (0-1)`,
      codeExamples: JSON.stringify([]),
      keyPoints: ["Accuracy misleads with imbalanced data", "Precision = few false alarms", "Recall = few misses"],
      estimatedTime: 15,
      difficulty: "INTERMEDIATE",
      order: 14,
      isPublished: true,
    },
  });

  // Overfitting/Underfitting
  await prisma.lesson.upsert({
    where: { slug: "overfitting-and-underfitting" },
    update: {},
    create: {
      sectionId: section25_3.id,
      number: 25.35,
      title: "Overfitting and Underfitting",
      slug: "overfitting-and-underfitting",
      objectives: ["Diagnose overfitting/underfitting", "Use learning curves", "Apply solutions"],
      content: `# Overfitting and Underfitting

## Underfitting (High Bias)
- Model too simple
- Fix: More features, complex model

## Overfitting (High Variance)
- Model memorizes noise
- Fix: More data, regularization, simpler model

## Learning Curves

Plot train/val error vs training size to diagnose.`,
      codeExamples: JSON.stringify([]),
      keyPoints: ["Underfitting: both errors high", "Overfitting: train low, test high", "Learning curves diagnose issues"],
      estimatedTime: 12,
      difficulty: "INTERMEDIATE",
      order: 15,
      isPublished: true,
    },
  });

  // K-Means
  await prisma.lesson.upsert({
    where: { slug: "k-means-clustering" },
    update: {},
    create: {
      sectionId: section25_3.id,
      number: 25.36,
      title: "K-Means Clustering",
      slug: "k-means-clustering",
      objectives: ["Understand K-Means algorithm", "Choose K with elbow method", "Apply clustering"],
      content: `# K-Means Clustering

Unsupervised algorithm to find K groups.

## Algorithm

1. Initialize K random centroids
2. Assign points to nearest centroid
3. Update centroids to cluster means
4. Repeat until convergence

## Choosing K: Elbow Method

Plot inertia vs K. Look for the "elbow".

\`\`\`python
from sklearn.cluster import KMeans
kmeans = KMeans(n_clusters=3)
kmeans.fit(X)
labels = kmeans.labels_
\`\`\``,
      codeExamples: JSON.stringify([]),
      keyPoints: ["Unsupervised - no labels needed", "Elbow method to choose K", "Scale features first"],
      estimatedTime: 12,
      difficulty: "INTERMEDIATE",
      order: 16,
      isPublished: true,
    },
  });

  // Summary
  const lessonCount = await prisma.lesson.count({ where: { section: { chapterId: chapter25.id } } });
  
  console.log("\n📊 Chapter 25 Summary:");
  console.log(`   Sections: 3`);
  console.log(`   Lessons: ${lessonCount}`);
  console.log("\n✅ Chapter 25 seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
