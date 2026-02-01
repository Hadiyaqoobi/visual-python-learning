// Chapter 25 Part 3: Lessons 11-16
// Sources: MIT 6.036, Stanford CS229, "Elements of Statistical Learning"

export const chapter25Part3 = [
  // ============================================
  // LESSON 11: Bias-Variance Tradeoff
  // ============================================
  {
    slug: "bias-variance-tradeoff",
    title: "Bias-Variance Tradeoff: The Fundamental Challenge",
    content: `
# Bias-Variance Tradeoff: The Fundamental Challenge

The bias-variance tradeoff is one of the most important concepts in machine learning. It explains why models fail and how to fix them.

> "Understanding bias and variance is critical for understanding the behavior of prediction models."
> — "Elements of Statistical Learning"

## The Decomposition

Total prediction error can be decomposed into three parts:

\`\`\`
Total Error = Bias² + Variance + Irreducible Noise

Where:
  Bias = Error from wrong assumptions (underfitting)
  Variance = Error from sensitivity to training data (overfitting)
  Noise = Inherent randomness in data (can't be reduced)
\`\`\`

## The Dartboard Analogy

Imagine throwing darts at a target:

\`\`\`
High Bias, Low Variance:    Low Bias, High Variance:
(Consistently wrong)        (Right on average, scattered)

       ○○○                        ○
      ○○○○                     ○    ○
       ○○○                   ○  ●  ○
        ↑                       ○  ○
      target                      ↑
                                target

Low Bias, Low Variance:     High Bias, High Variance:
(Ideal - clustered on target)  (Worst - wrong AND scattered)

                                   ○
        ●●                    ○      ○
        ●●                   ○   ○  
        ↑                           ○
      target
\`\`\`

## Bias: Underfitting

**High bias** means the model is too simple to capture the true pattern.

### Symptoms
- Training error is high
- Test error is also high
- Both errors are similar

### Causes
- Model too simple (e.g., linear model for non-linear data)
- Not enough features
- Too much regularization

### Solutions
- Use more complex model
- Add more features
- Reduce regularization
- Train longer

\`\`\`python
# High bias example: fitting a line to curved data
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures

# Underfitting
linear = LinearRegression()
linear.fit(X_train, y_train)
print(f"Linear train error: {linear.score(X_train, y_train):.3f}")  # Low!

# Fix: Add polynomial features
poly = PolynomialFeatures(degree=3)
X_train_poly = poly.fit_transform(X_train)
poly_model = LinearRegression()
poly_model.fit(X_train_poly, y_train)
print(f"Poly train error: {poly_model.score(X_train_poly, y_train):.3f}")  # Better!
\`\`\`

## Variance: Overfitting

**High variance** means the model is too complex and memorizes noise.

### Symptoms
- Training error is very low
- Test error is much higher
- Large gap between train/test errors

### Causes
- Model too complex
- Too many features
- Not enough training data
- Too little regularization

### Solutions
- Simplify model
- Add regularization
- Get more training data
- Use cross-validation
- Feature selection

\`\`\`python
# High variance example: deep tree memorizing training data
from sklearn.tree import DecisionTreeClassifier

# Overfitting
deep_tree = DecisionTreeClassifier(max_depth=None)  # No limit
deep_tree.fit(X_train, y_train)
print(f"Train accuracy: {deep_tree.score(X_train, y_train):.3f}")  # 1.000!
print(f"Test accuracy: {deep_tree.score(X_test, y_test):.3f}")     # 0.750 (gap!)

# Fix: Limit depth
shallow_tree = DecisionTreeClassifier(max_depth=5)
shallow_tree.fit(X_train, y_train)
print(f"Train accuracy: {shallow_tree.score(X_train, y_train):.3f}")  # 0.920
print(f"Test accuracy: {shallow_tree.score(X_test, y_test):.3f}")     # 0.890 (better!)
\`\`\`

## The Tradeoff

As you increase model complexity:
- Bias decreases (model can fit more patterns)
- Variance increases (model becomes more sensitive)

\`\`\`
Error
  |
  |  \\                    /
  |    \\   Total Error  /
  |      \\            /
  |        \\________/  ← Sweet spot
  |   Bias   \\    /
  |    ↘      \\/
  |            /\\
  |           /  \\  Variance
  |__________/    \\__________
  Simple ←  Complexity  → Complex
  
  Underfitting           Overfitting
\`\`\`

## Diagnosing Bias vs Variance

### Learning Curves

\`\`\`python
from sklearn.model_selection import learning_curve
import matplotlib.pyplot as plt

train_sizes, train_scores, test_scores = learning_curve(
    model, X, y, cv=5, 
    train_sizes=np.linspace(0.1, 1.0, 10)
)

plt.plot(train_sizes, train_scores.mean(axis=1), label='Training')
plt.plot(train_sizes, test_scores.mean(axis=1), label='Validation')
plt.xlabel('Training Set Size')
plt.ylabel('Score')
plt.legend()
plt.show()
\`\`\`

### Interpretation

**High Bias (Underfitting):**
\`\`\`
Both curves plateau at low score
Adding more data doesn't help
→ Need more complex model
\`\`\`

**High Variance (Overfitting):**
\`\`\`
Gap between train (high) and test (low)
Test score improves with more data
→ Need more data or simpler model
\`\`\`

## Strategies for the Sweet Spot

### 1. Cross-Validation
Find the model complexity that generalizes best.

\`\`\`python
from sklearn.model_selection import cross_val_score

for depth in [2, 5, 10, 20, None]:
    tree = DecisionTreeClassifier(max_depth=depth)
    score = cross_val_score(tree, X_train, y_train, cv=5).mean()
    print(f"Depth {depth}: {score:.3f}")
\`\`\`

### 2. Regularization
Add penalty for complexity.

\`\`\`python
from sklearn.linear_model import Ridge

for alpha in [0.01, 0.1, 1, 10, 100]:
    model = Ridge(alpha=alpha)
    model.fit(X_train, y_train)
    print(f"Alpha {alpha}: Train={model.score(X_train, y_train):.3f}, Test={model.score(X_test, y_test):.3f}")
\`\`\`

### 3. Ensemble Methods
Combine models to reduce variance.

\`\`\`python
# Bagging reduces variance
from sklearn.ensemble import BaggingClassifier

bagging = BaggingClassifier(
    estimator=DecisionTreeClassifier(),
    n_estimators=100
)
\`\`\`

## Complete Example: Finding the Balance

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import Ridge
from sklearn.pipeline import make_pipeline

# Generate synthetic data
np.random.seed(42)
X = np.linspace(0, 10, 100).reshape(-1, 1)
y = np.sin(X).ravel() + 0.1 * np.random.randn(100)

# Try different polynomial degrees
degrees = [1, 3, 5, 10, 15]
train_scores = []
test_scores = []

for degree in degrees:
    model = make_pipeline(
        PolynomialFeatures(degree),
        Ridge(alpha=0.01)
    )
    
    train_score = model.fit(X, y).score(X, y)
    test_score = cross_val_score(model, X, y, cv=5).mean()
    
    train_scores.append(train_score)
    test_scores.append(test_score)
    
    print(f"Degree {degree:2d}: Train R² = {train_score:.3f}, CV R² = {test_score:.3f}")

# Plot
plt.figure(figsize=(10, 4))
plt.subplot(1, 2, 1)
plt.plot(degrees, train_scores, 'o-', label='Train')
plt.plot(degrees, test_scores, 'o-', label='CV')
plt.xlabel('Polynomial Degree')
plt.ylabel('R² Score')
plt.legend()
plt.title('Bias-Variance Tradeoff')

plt.subplot(1, 2, 2)
gap = np.array(train_scores) - np.array(test_scores)
plt.bar(degrees, gap)
plt.xlabel('Polynomial Degree')
plt.ylabel('Train - CV Score Gap')
plt.title('Overfitting Indicator')
plt.tight_layout()
plt.show()
\`\`\`

## Key Takeaways

1. **Total error = Bias² + Variance + Noise**
2. **High bias** = underfitting (model too simple)
3. **High variance** = overfitting (model too complex)
4. **Learning curves** diagnose the problem
5. **Cross-validation** finds the sweet spot
6. **Regularization** controls the tradeoff
7. **Ensembles** reduce variance without increasing bias
`,
    exercises: [
      {
        id: "bv-1",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "Your model has 95% training accuracy but only 60% test accuracy. What's the problem?",
        options: [
          "High bias (underfitting)",
          "High variance (overfitting)",
          "Irreducible noise",
          "Not enough features"
        ],
        correctAnswer: 1,
        explanation: "The large gap between training and test accuracy indicates overfitting (high variance). The model memorized training data but doesn't generalize."
      },
      {
        id: "bv-2",
        type: "MULTIPLE_CHOICE",
        difficulty: "INTERMEDIATE",
        points: 15,
        question: "Your model has 65% training accuracy and 63% test accuracy. What should you try?",
        options: [
          "Add regularization",
          "Remove features",
          "Use a more complex model or add features",
          "Get less training data"
        ],
        correctAnswer: 2,
        explanation: "Both accuracies are low and similar - this is high bias (underfitting). The model is too simple. Try a more complex model or better features."
      }
    ]
  },

  // ============================================
  // LESSON 12: Cross-Validation
  // ============================================
  {
    slug: "cross-validation",
    title: "Cross-Validation: Reliable Model Evaluation",
    content: `
# Cross-Validation: Reliable Model Evaluation

Cross-validation gives a more reliable estimate of model performance than a single train/test split.

> "Cross-validation is perhaps the simplest and most widely used method for estimating prediction error."
> — "Elements of Statistical Learning"

## Why Not Just Train/Test Split?

A single split has problems:
- **Lucky/unlucky split**: Results depend on which data ends up in test set
- **Wastes data**: Some data never used for training
- **High variance**: Estimate can vary a lot

## K-Fold Cross-Validation

Split data into K equal parts. Train on K-1 parts, test on 1 part. Repeat K times.

\`\`\`
5-Fold Cross-Validation:

Fold 1: [TEST] [Train] [Train] [Train] [Train] → Score 1
Fold 2: [Train] [TEST] [Train] [Train] [Train] → Score 2
Fold 3: [Train] [Train] [TEST] [Train] [Train] → Score 3
Fold 4: [Train] [Train] [Train] [TEST] [Train] → Score 4
Fold 5: [Train] [Train] [Train] [Train] [TEST] → Score 5

Final Score = Average of all 5 scores
\`\`\`

### Implementation

\`\`\`python
from sklearn.model_selection import cross_val_score, KFold

# Basic usage
scores = cross_val_score(model, X, y, cv=5)
print(f"CV Scores: {scores}")
print(f"Mean: {scores.mean():.3f} (+/- {scores.std()*2:.3f})")

# More control with KFold
kf = KFold(n_splits=5, shuffle=True, random_state=42)

scores = []
for train_idx, test_idx in kf.split(X):
    X_train, X_test = X[train_idx], X[test_idx]
    y_train, y_test = y[train_idx], y[test_idx]
    
    model.fit(X_train, y_train)
    score = model.score(X_test, y_test)
    scores.append(score)

print(f"CV Score: {np.mean(scores):.3f}")
\`\`\`

## Stratified K-Fold (for Classification)

Preserves class proportions in each fold.

\`\`\`python
from sklearn.model_selection import StratifiedKFold

# If classes are imbalanced, use stratified
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=skf)
\`\`\`

## Choosing K

| K Value | Pros | Cons |
|---------|------|------|
| **K=5** | Good balance | Standard choice |
| **K=10** | More reliable | Slower |
| **K=N (LOOCV)** | Maximum data usage | Very slow, high variance |

**Rule of thumb**: K=5 or K=10 for most cases.

## Cross-Validation for Hyperparameter Tuning

\`\`\`python
from sklearn.model_selection import GridSearchCV

param_grid = {
    'max_depth': [3, 5, 10, 20],
    'min_samples_split': [2, 5, 10]
}

grid_search = GridSearchCV(
    DecisionTreeClassifier(),
    param_grid,
    cv=5,
    scoring='accuracy',
    return_train_score=True
)

grid_search.fit(X_train, y_train)

print(f"Best params: {grid_search.best_params_}")
print(f"Best CV score: {grid_search.best_score_:.3f}")
\`\`\`

## Nested Cross-Validation

For unbiased evaluation when also tuning hyperparameters:

\`\`\`python
from sklearn.model_selection import cross_val_score, GridSearchCV

# Inner CV: tune hyperparameters
# Outer CV: evaluate the tuning process

param_grid = {'max_depth': [3, 5, 10]}

inner_cv = KFold(n_splits=5, shuffle=True, random_state=42)
outer_cv = KFold(n_splits=5, shuffle=True, random_state=42)

clf = GridSearchCV(
    DecisionTreeClassifier(),
    param_grid,
    cv=inner_cv
)

# Nested CV score
nested_scores = cross_val_score(clf, X, y, cv=outer_cv)
print(f"Nested CV Score: {nested_scores.mean():.3f} (+/- {nested_scores.std():.3f})")
\`\`\`

## Time Series Cross-Validation

Never use future data to predict past!

\`\`\`python
from sklearn.model_selection import TimeSeriesSplit

tscv = TimeSeriesSplit(n_splits=5)

for train_idx, test_idx in tscv.split(X):
    print(f"Train: {train_idx[0]}-{train_idx[-1]}, Test: {test_idx[0]}-{test_idx[-1]}")

# Visualization:
# Fold 1: [Train      ] [Test]
# Fold 2: [Train          ] [Test]
# Fold 3: [Train              ] [Test]
# Fold 4: [Train                  ] [Test]
# Fold 5: [Train                      ] [Test]
\`\`\`

## Key Takeaways

1. **K-Fold CV** uses all data for both training and testing
2. **Stratified** preserves class proportions
3. **K=5 or 10** is standard
4. **GridSearchCV** combines CV with hyperparameter tuning
5. **Nested CV** for unbiased evaluation
6. **TimeSeriesSplit** for temporal data
`,
    exercises: [
      {
        id: "cv-1",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "In 5-fold cross-validation, how many times is each data point used for testing?",
        options: ["1 time", "4 times", "5 times", "It varies"],
        correctAnswer: 0,
        explanation: "Each data point is in exactly one test fold, so it's tested exactly once. But it's used for training 4 times (in the other 4 folds)."
      }
    ]
  },

  // ============================================
  // LESSON 13: Regularization
  // ============================================
  {
    slug: "regularization",
    title: "Regularization: Controlling Overfitting",
    content: `
# Regularization: Controlling Overfitting

Regularization adds a **penalty** for model complexity, preventing overfitting.

> "Regularization is any modification we make to a learning algorithm that is intended to reduce its generalization error but not its training error."
> — "Deep Learning" (Goodfellow et al.)

## The Idea

Instead of just minimizing error, minimize:

\`\`\`
Loss = Error + λ × Complexity Penalty

Where:
  λ (lambda) = regularization strength
  Higher λ = simpler model (more penalty)
  Lower λ = more complex model (less penalty)
\`\`\`

## L1 Regularization (Lasso)

Adds absolute value of weights to loss:

\`\`\`
Loss = MSE + λ × Σ|wᵢ|
\`\`\`

**Effect**: Pushes weights to **exactly zero** → **Feature selection!**

\`\`\`python
from sklearn.linear_model import Lasso

# L1: Some weights become exactly 0
lasso = Lasso(alpha=0.1)
lasso.fit(X_train, y_train)

# See which features were eliminated
print("Non-zero weights:", np.sum(lasso.coef_ != 0))
print("Zero weights:", np.sum(lasso.coef_ == 0))
\`\`\`

## L2 Regularization (Ridge)

Adds squared weights to loss:

\`\`\`
Loss = MSE + λ × Σwᵢ²
\`\`\`

**Effect**: Shrinks all weights toward zero, but rarely exactly zero → **Smooth model**

\`\`\`python
from sklearn.linear_model import Ridge

# L2: Weights are small but not zero
ridge = Ridge(alpha=1.0)
ridge.fit(X_train, y_train)

print("Weights:", ridge.coef_)
\`\`\`

## L1 vs L2 Comparison

| Aspect | L1 (Lasso) | L2 (Ridge) |
|--------|-----------|------------|
| Penalty | Σ\|wᵢ\| | Σwᵢ² |
| Effect | Sparse (some w=0) | Small weights |
| Use case | Feature selection | General regularization |
| Geometry | Diamond constraint | Circle constraint |

## Elastic Net (L1 + L2)

Combines both penalties:

\`\`\`python
from sklearn.linear_model import ElasticNet

# Mix of L1 and L2
elastic = ElasticNet(alpha=0.1, l1_ratio=0.5)  # 50% L1, 50% L2
elastic.fit(X_train, y_train)
\`\`\`

## Choosing Lambda (α)

\`\`\`python
from sklearn.linear_model import RidgeCV, LassoCV

# Automatic cross-validation to find best alpha
ridge_cv = RidgeCV(alphas=[0.01, 0.1, 1, 10, 100], cv=5)
ridge_cv.fit(X_train, y_train)
print(f"Best alpha: {ridge_cv.alpha_}")

# Or manual search
from sklearn.model_selection import cross_val_score

alphas = [0.001, 0.01, 0.1, 1, 10, 100]
for alpha in alphas:
    model = Ridge(alpha=alpha)
    score = cross_val_score(model, X_train, y_train, cv=5).mean()
    print(f"Alpha {alpha}: CV Score = {score:.3f}")
\`\`\`

## Regularization in Other Models

### Decision Trees
\`\`\`python
# Regularize by limiting complexity
tree = DecisionTreeClassifier(
    max_depth=5,           # Limit depth
    min_samples_leaf=10    # Require samples per leaf
)
\`\`\`

### Neural Networks
\`\`\`python
# L2 regularization (weight decay)
from sklearn.neural_network import MLPClassifier

mlp = MLPClassifier(alpha=0.01)  # L2 penalty
\`\`\`

## Key Takeaways

1. **Regularization** adds penalty for large weights
2. **L1 (Lasso)** creates sparse models (feature selection)
3. **L2 (Ridge)** shrinks all weights (smoother model)
4. **Higher λ** = simpler model, less overfitting
5. **Use cross-validation** to find optimal λ
`,
    exercises: [
      {
        id: "reg-1",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "What's the main difference between L1 and L2 regularization?",
        options: [
          "L1 is faster than L2",
          "L1 can eliminate features (weights=0), L2 just shrinks them",
          "L2 is more accurate than L1",
          "L1 only works for classification"
        ],
        correctAnswer: 1,
        explanation: "L1 (Lasso) pushes weights to exactly zero, effectively removing features. L2 (Ridge) shrinks weights but keeps them non-zero."
      }
    ]
  },

  // ============================================
  // LESSON 14: Model Evaluation Metrics
  // ============================================
  {
    slug: "model-evaluation-metrics",
    title: "Model Evaluation Metrics",
    content: `
# Model Evaluation Metrics

Choosing the right metric is crucial. Accuracy isn't always the answer!

## Classification Metrics

### Confusion Matrix

\`\`\`
                 Predicted
              Neg      Pos
Actual  Neg [ TN       FP ]
        Pos [ FN       TP ]

TN = True Negative (correct rejection)
TP = True Positive (correct detection)
FP = False Positive (false alarm)
FN = False Negative (miss)
\`\`\`

\`\`\`python
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

cm = confusion_matrix(y_test, y_pred)
ConfusionMatrixDisplay(cm).plot()
\`\`\`

### Accuracy
\`\`\`
Accuracy = (TP + TN) / (TP + TN + FP + FN)
\`\`\`

**Problem**: Misleading for imbalanced data!

### Precision
"Of all predicted positives, how many are correct?"

\`\`\`
Precision = TP / (TP + FP)
\`\`\`

High precision = Few false alarms

### Recall (Sensitivity)
"Of all actual positives, how many did we find?"

\`\`\`
Recall = TP / (TP + FN)
\`\`\`

High recall = Few misses

### F1 Score
Harmonic mean of precision and recall:

\`\`\`
F1 = 2 × (Precision × Recall) / (Precision + Recall)
\`\`\`

\`\`\`python
from sklearn.metrics import precision_score, recall_score, f1_score, classification_report

print(f"Precision: {precision_score(y_test, y_pred):.3f}")
print(f"Recall: {recall_score(y_test, y_pred):.3f}")
print(f"F1: {f1_score(y_test, y_pred):.3f}")

# All at once
print(classification_report(y_test, y_pred))
\`\`\`

### When to Use What?

| Metric | Use When |
|--------|----------|
| **Accuracy** | Balanced classes |
| **Precision** | False positives are costly (spam filter) |
| **Recall** | False negatives are costly (disease detection) |
| **F1** | Need balance of precision and recall |

## Regression Metrics

### MAE (Mean Absolute Error)
\`\`\`
MAE = (1/n) × Σ|yᵢ - ŷᵢ|
\`\`\`

### MSE (Mean Squared Error)
\`\`\`
MSE = (1/n) × Σ(yᵢ - ŷᵢ)²
\`\`\`

### RMSE (Root Mean Squared Error)
\`\`\`
RMSE = √MSE
\`\`\`

### R² Score
\`\`\`
R² = 1 - (SS_res / SS_tot)
\`\`\`

Proportion of variance explained (0-1, higher is better).

\`\`\`python
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

print(f"MAE: {mean_absolute_error(y_test, y_pred):.2f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.2f}")
print(f"R²: {r2_score(y_test, y_pred):.3f}")
\`\`\`

## Key Takeaways

1. **Accuracy** misleads with imbalanced data
2. **Precision** = few false alarms
3. **Recall** = few misses
4. **F1** = balance of precision/recall
5. **R²** = variance explained (regression)
`,
    exercises: [
      {
        id: "metrics-1",
        type: "MULTIPLE_CHOICE",
        difficulty: "INTERMEDIATE",
        points: 15,
        question: "In disease screening where missing a case is very dangerous, which metric should you prioritize?",
        options: ["Accuracy", "Precision", "Recall", "Specificity"],
        correctAnswer: 2,
        explanation: "Recall (sensitivity) measures how many actual positive cases you find. In disease screening, high recall means few missed diagnoses."
      }
    ]
  },

  // ============================================
  // LESSON 15: Overfitting and Underfitting
  // ============================================
  {
    slug: "overfitting-and-underfitting",
    title: "Overfitting and Underfitting",
    content: `
# Overfitting and Underfitting

Understanding when and why models fail to generalize.

## Underfitting

Model is **too simple** to capture the pattern.

### Signs
- High training error
- High test error
- Both errors similar

### Causes
- Model too simple
- Too few features
- Too much regularization

### Solutions
- Use more complex model
- Add features
- Reduce regularization

## Overfitting

Model is **too complex** and memorizes noise.

### Signs
- Low training error
- High test error
- Large gap between them

### Causes
- Model too complex
- Too many features
- Too little regularization
- Not enough training data

### Solutions
- Simplify model
- Remove features
- Add regularization
- Get more data
- Use dropout (neural networks)
- Early stopping

## Visual Guide

\`\`\`
                Underfitting        Good Fit         Overfitting
Data:           •    •    •       •    •    •       •    •    •
                  •      •           •      •           •      •  
                •    •    •       •    •    •       •    •    •

Model:              ___             /\\               /\\/\\/\\
                                   /  \\             /      \\

Train Error:        High            Low              Very Low
Test Error:         High            Low              High
Gap:                Small           Small            Large
\`\`\`

## Detection with Learning Curves

\`\`\`python
from sklearn.model_selection import learning_curve
import matplotlib.pyplot as plt

train_sizes, train_scores, test_scores = learning_curve(
    model, X, y, cv=5,
    train_sizes=np.linspace(0.1, 1.0, 10)
)

plt.plot(train_sizes, train_scores.mean(axis=1), label='Training')
plt.plot(train_sizes, test_scores.mean(axis=1), label='Validation')
plt.xlabel('Training Size')
plt.ylabel('Score')
plt.legend()
plt.show()
\`\`\`

## Key Takeaways

1. **Underfitting** = model too simple (high bias)
2. **Overfitting** = model too complex (high variance)
3. **Learning curves** diagnose the problem
4. **Regularization** fights overfitting
5. **More features/complexity** fights underfitting
`,
    exercises: [
      {
        id: "overfit-1",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "A decision tree with unlimited depth gets 100% training accuracy but 65% test accuracy. What's happening?",
        options: [
          "Underfitting - model is too simple",
          "Overfitting - model memorized training data",
          "Perfect model",
          "Data is too noisy"
        ],
        correctAnswer: 1,
        explanation: "Perfect training accuracy with much lower test accuracy is the hallmark of overfitting. The tree memorized the training data, including noise."
      }
    ]
  },

  // ============================================
  // LESSON 16: K-Means Clustering
  // ============================================
  {
    slug: "k-means-clustering",
    title: "K-Means Clustering: Finding Groups",
    content: `
# K-Means Clustering: Finding Groups

K-Means is an unsupervised algorithm that groups similar data points into K clusters.

## The Algorithm

\`\`\`
1. Initialize K random centroids
2. Assign each point to nearest centroid
3. Update centroids to mean of assigned points
4. Repeat until convergence
\`\`\`

\`\`\`python
from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=3, random_state=42)
clusters = kmeans.fit_predict(X)

print(f"Cluster centers:\\n{kmeans.cluster_centers_}")
print(f"Inertia: {kmeans.inertia_:.2f}")
\`\`\`

## Choosing K: Elbow Method

\`\`\`python
inertias = []
K_range = range(1, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X)
    inertias.append(kmeans.inertia_)

plt.plot(K_range, inertias, 'o-')
plt.xlabel('K')
plt.ylabel('Inertia')
plt.title('Elbow Method')
plt.show()
# Look for the "elbow" point
\`\`\`

## Silhouette Score

Measures how similar points are to their cluster vs other clusters (-1 to 1):

\`\`\`python
from sklearn.metrics import silhouette_score

score = silhouette_score(X, clusters)
print(f"Silhouette Score: {score:.3f}")
# Higher is better (close to 1)
\`\`\`

## Limitations

- Must specify K in advance
- Assumes spherical clusters
- Sensitive to initialization
- Sensitive to outliers

## Key Takeaways

1. **K-Means** finds K clusters by minimizing within-cluster variance
2. **Elbow method** helps choose K
3. **Silhouette score** measures cluster quality
4. **Scale features** before clustering!
`,
    exercises: [
      {
        id: "kmeans-1",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "K-Means is an example of:",
        options: [
          "Supervised learning",
          "Unsupervised learning",
          "Reinforcement learning",
          "Semi-supervised learning"
        ],
        correctAnswer: 1,
        explanation: "K-Means is unsupervised because it finds patterns (clusters) without labeled data. We don't tell it what groups exist - it discovers them."
      }
    ]
  }
];

export default chapter25Part3;
