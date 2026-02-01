import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🎯 Seeding Chapter 29, Lesson 4: Model Selection...\n");

  const section = await prisma.section.findFirst({
    where: { number: 29.1 }
  });

  if (!section) {
    throw new Error("Section 29.1 not found.");
  }

  await prisma.lesson.upsert({
    where: { slug: "model-selection" },
    update: {},
    create: {
      sectionId: section.id,
      number: 29.14,
      title: "Model Selection: Choosing the Right Algorithm",
      slug: "model-selection",
      objectives: [
        "Know which algorithms work best for different problem types",
        "Understand the trade-offs between accuracy, speed, and interpretability",
        "Learn a systematic approach to model selection",
        "Avoid common model selection mistakes",
      ],
      content: `# Model Selection: Choosing the Right Algorithm

One of the most common questions in machine learning: **"Which algorithm should I use?"**

The answer: **It depends.** But after this lesson, you'll know exactly what it depends on.

## The Model Selection Framework

Before choosing a model, answer these questions:

### 1. What type of problem is this?

| Problem Type | Output | Examples |
|--------------|--------|----------|
| **Classification** | Category/Label | Spam detection, disease diagnosis, image recognition |
| **Regression** | Continuous number | Price prediction, temperature forecast, sales estimation |
| **Clustering** | Groups (unsupervised) | Customer segmentation, anomaly detection |
| **Ranking** | Ordered list | Search results, recommendations |

### 2. How much data do you have?

| Data Size | Recommended Approach |
|-----------|---------------------|
| **< 1,000 samples** | Simple models (Logistic/Linear Regression, SVM) |
| **1K - 100K samples** | Tree ensembles (Random Forest, XGBoost) |
| **> 100K samples** | Deep learning becomes viable |
| **Millions+** | Deep learning often excels |

### 3. What are your priorities?

- **Accuracy:** Need the best predictions? XGBoost, Neural Networks
- **Speed:** Real-time predictions? Logistic Regression, Decision Trees
- **Interpretability:** Need to explain decisions? Decision Trees, Linear Models
- **Memory:** Limited resources? Avoid large ensembles

---

## Algorithm Comparison: Classification

### Logistic Regression 📈

**What it does:** Finds a linear boundary between classes using the sigmoid function.

\`\`\`python
from sklearn.linear_model import LogisticRegression

model = LogisticRegression()
model.fit(X_train, y_train)

# Probability predictions
probabilities = model.predict_proba(X_test)
\`\`\`

**Pros:**
- Fast training and prediction
- Highly interpretable (coefficients show feature importance)
- Works well with linearly separable data
- Good baseline model

**Cons:**
- Assumes linear decision boundary
- Can underfit complex patterns
- Sensitive to outliers

**Use when:** You need a quick baseline, interpretability matters, or your data is linearly separable.

---

### Decision Tree 🌳

**What it does:** Creates a tree of if-then rules by splitting data on features.

\`\`\`python
from sklearn.tree import DecisionTreeClassifier

model = DecisionTreeClassifier(max_depth=5)
model.fit(X_train, y_train)

# Visualize the tree
from sklearn.tree import plot_tree
plot_tree(model, feature_names=feature_names)
\`\`\`

**Pros:**
- Highly interpretable (can visualize rules)
- Handles non-linear relationships
- No feature scaling needed
- Handles mixed data types

**Cons:**
- Prone to overfitting
- Unstable (small data changes → very different trees)
- Can create biased trees with imbalanced data

**Use when:** You need interpretable rules, or as a building block for ensembles.

---

### Random Forest 🌲

**What it does:** Creates many decision trees on random subsets and averages their predictions.

\`\`\`python
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(
    n_estimators=100,  # Number of trees
    max_depth=10,
    random_state=42
)
model.fit(X_train, y_train)

# Feature importance
importance = model.feature_importances_
\`\`\`

**Pros:**
- Very robust, hard to overfit
- Handles noise well
- Provides feature importance
- Works out-of-the-box with minimal tuning

**Cons:**
- Less interpretable than single tree
- Slower than simple models
- Large memory footprint
- Can't extrapolate beyond training data

**Use when:** You want reliable performance without much tuning, or as a strong baseline before trying boosting.

---

### XGBoost / Gradient Boosting 🚀

**What it does:** Builds trees sequentially, each one correcting the errors of the previous.

\`\`\`python
from xgboost import XGBClassifier

model = XGBClassifier(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=5,
    random_state=42
)
model.fit(X_train, y_train)
\`\`\`

**Pros:**
- Often the best performance on tabular data
- Handles missing values natively
- Built-in regularization
- Wins most Kaggle competitions

**Cons:**
- Can overfit if not tuned
- Slower to train than Random Forest
- Less interpretable
- Many hyperparameters to tune

**Use when:** You need maximum accuracy on structured/tabular data and have time to tune.

---

### Support Vector Machine (SVM) 📐

**What it does:** Finds the hyperplane that maximizes the margin between classes.

\`\`\`python
from sklearn.svm import SVC

model = SVC(kernel='rbf', C=1.0)
model.fit(X_train, y_train)
\`\`\`

**Pros:**
- Effective in high-dimensional spaces
- Memory efficient (uses support vectors only)
- Versatile kernels for non-linear boundaries

**Cons:**
- Slow on large datasets (O(n²) to O(n³))
- Sensitive to feature scaling
- Requires careful tuning
- Not great with noisy data

**Use when:** You have high-dimensional data with clear margins and < 100K samples.

---

### Neural Networks 🧠

**What they do:** Learn complex patterns through layers of interconnected neurons.

\`\`\`python
from sklearn.neural_network import MLPClassifier

model = MLPClassifier(
    hidden_layer_sizes=(100, 50),
    max_iter=500,
    random_state=42
)
model.fit(X_train, y_train)
\`\`\`

**Pros:**
- Can learn extremely complex patterns
- State-of-the-art for images, text, audio
- Automatic feature learning

**Cons:**
- Requires lots of data
- Computationally expensive
- Black box (hard to interpret)
- Many hyperparameters
- Can overfit easily

**Use when:** You have lots of data, complex patterns, and accuracy is paramount.

---

## Algorithm Comparison: Regression

| Algorithm | Best For | Avoid When |
|-----------|----------|------------|
| **Linear Regression** | Linear relationships, interpretability | Non-linear patterns |
| **Ridge/Lasso** | Many features, multicollinearity | Few important features |
| **Decision Tree** | Non-linear, interpretable | Need smooth predictions |
| **Random Forest** | Robust, handles outliers | Need to extrapolate |
| **XGBoost** | Maximum accuracy | Simplicity needed |
| **Neural Network** | Complex non-linear patterns | Small datasets |

---

## The Model Selection Workflow

Here's a systematic approach:

### Step 1: Start with a Baseline

Always start simple:

\`\`\`python
# Classification baseline
from sklearn.linear_model import LogisticRegression
baseline = LogisticRegression()
baseline.fit(X_train, y_train)
print(f"Baseline accuracy: {baseline.score(X_test, y_test):.2%}")

# Regression baseline
from sklearn.linear_model import LinearRegression
baseline = LinearRegression()
baseline.fit(X_train, y_train)
print(f"Baseline R²: {baseline.score(X_test, y_test):.3f}")
\`\`\`

**Why?** If the simple model works, you're done! Plus, it tells you if your problem is solvable.

### Step 2: Try a Few Candidates

\`\`\`python
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.model_selection import cross_val_score

models = {
    'Logistic': LogisticRegression(),
    'Random Forest': RandomForestClassifier(n_estimators=100),
    'Gradient Boosting': GradientBoostingClassifier(),
    'SVM': SVC(),
}

for name, model in models.items():
    scores = cross_val_score(model, X_train, y_train, cv=5)
    print(f"{name}: {scores.mean():.3f} (+/- {scores.std()*2:.3f})")
\`\`\`

### Step 3: Deep Dive on Top Performers

\`\`\`python
from sklearn.model_selection import GridSearchCV

# Tune the best model
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 15, None],
    'min_samples_split': [2, 5, 10]
}

grid_search = GridSearchCV(
    RandomForestClassifier(),
    param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1
)
grid_search.fit(X_train, y_train)

print(f"Best params: {grid_search.best_params_}")
print(f"Best score: {grid_search.best_score_:.3f}")
\`\`\`

### Step 4: Final Evaluation

\`\`\`python
# Only now touch the test set!
final_model = grid_search.best_estimator_
test_score = final_model.score(X_test, y_test)
print(f"Final test score: {test_score:.3f}")
\`\`\`

---

## Common Mistakes

### Mistake 1: Starting Too Complex

"Let me try deep learning first!"

**Problem:** You won't know if the complexity is justified.

**Solution:** Always start with logistic/linear regression.

### Mistake 2: Evaluating on Training Data

\`\`\`python
# WRONG
model.fit(X, y)
print(model.score(X, y))  # Overly optimistic!

# RIGHT
model.fit(X_train, y_train)
print(model.score(X_test, y_test))
\`\`\`

### Mistake 3: Not Considering the Full Picture

Accuracy isn't everything:

\`\`\`python
# Consider:
# - Training time
# - Prediction time
# - Memory usage
# - Interpretability
# - Deployment constraints
\`\`\`

### Mistake 4: Forgetting No Free Lunch

**No Free Lunch Theorem:** No algorithm is best for all problems.

The best model depends on YOUR specific data and constraints.

---

## Quick Reference: When to Use What

| Situation | Recommended Model |
|-----------|-------------------|
| Need quick baseline | Logistic/Linear Regression |
| Need interpretability | Decision Tree, Linear Models |
| Tabular data, need accuracy | XGBoost, Random Forest |
| High-dimensional sparse data | SVM, Logistic with L1 |
| Lots of data, complex patterns | Neural Networks |
| Time series | ARIMA, LSTM, Prophet |
| Images | CNN |
| Text | Transformers, LSTM |
| Anomaly detection | Isolation Forest, One-Class SVM |`,
      codeExamples: JSON.stringify([
        {
          title: "Model Comparison Script",
          language: "python",
          code: `from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
import time

# Define models to compare
models = {
    'Logistic Regression': LogisticRegression(max_iter=1000),
    'Random Forest': RandomForestClassifier(n_estimators=100),
    'Gradient Boosting': GradientBoostingClassifier(),
    'SVM (RBF)': SVC(kernel='rbf'),
}

# Compare all models
results = []
for name, model in models.items():
    start = time.time()
    scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
    train_time = time.time() - start
    
    results.append({
        'Model': name,
        'CV Accuracy': f"{scores.mean():.3f} (+/- {scores.std()*2:.3f})",
        'Training Time': f"{train_time:.2f}s"
    })

import pandas as pd
print(pd.DataFrame(results).to_string(index=False))`
        }
      ]),
      keyPoints: [
        "Always start with a simple baseline (Logistic/Linear Regression)",
        "Match algorithm to your data size: small data → simple models, big data → complex models",
        "Consider the trade-offs: accuracy vs speed vs interpretability",
        "Tree ensembles (Random Forest, XGBoost) are great defaults for tabular data",
        "No Free Lunch: no single algorithm wins on all problems",
        "Use cross-validation to compare models fairly",
      ],
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 4,
      isPublished: true,
    },
  });

  console.log("✅ Lesson 4: Model Selection created!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
