import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🎛️ Seeding Chapter 29, Lesson 5: Hyperparameter Tuning...\n");

  const section = await prisma.section.findFirst({
    where: { number: 29.1 }
  });

  if (!section) {
    throw new Error("Section 29.1 not found.");
  }

  await prisma.lesson.upsert({
    where: { slug: "hyperparameter-tuning" },
    update: {},
    create: {
      sectionId: section.id,
      number: 29.15,
      title: "Hyperparameter Tuning: Optimizing Your Model",
      slug: "hyperparameter-tuning",
      objectives: [
        "Understand the difference between parameters and hyperparameters",
        "Master Grid Search, Random Search, and Bayesian optimization",
        "Use cross-validation for robust hyperparameter selection",
        "Avoid common tuning pitfalls",
      ],
      content: `# Hyperparameter Tuning: Finding the Best Model Settings

You've chosen your algorithm. Now how do you configure it for best performance?

## Parameters vs Hyperparameters

This distinction is crucial:

| Type | What It Is | Who Sets It | Examples |
|------|-----------|-------------|----------|
| **Parameters** | Model learns from data | Training algorithm | Weights, tree splits |
| **Hyperparameters** | Configuration settings | You (the engineer) | Learning rate, tree depth |

**Analogy:** If training a model is like baking a cake:
- **Parameters** = How the ingredients combine (the model figures this out)
- **Hyperparameters** = Oven temperature and baking time (you decide)

---

## Common Hyperparameters by Algorithm

### Random Forest
\`\`\`python
RandomForestClassifier(
    n_estimators=100,      # Number of trees
    max_depth=10,          # Maximum tree depth
    min_samples_split=2,   # Minimum samples to split a node
    min_samples_leaf=1,    # Minimum samples in a leaf
    max_features='sqrt',   # Features to consider per split
)
\`\`\`

### XGBoost
\`\`\`python
XGBClassifier(
    n_estimators=100,      # Number of boosting rounds
    learning_rate=0.1,     # Step size shrinkage
    max_depth=6,           # Maximum tree depth
    min_child_weight=1,    # Minimum sum of instance weight
    subsample=0.8,         # Fraction of samples per tree
    colsample_bytree=0.8,  # Fraction of features per tree
)
\`\`\`

### Neural Network
\`\`\`python
MLPClassifier(
    hidden_layer_sizes=(100, 50),  # Network architecture
    learning_rate_init=0.001,      # Initial learning rate
    batch_size=32,                 # Samples per gradient update
    alpha=0.0001,                  # L2 regularization
)
\`\`\`

---

## Method 1: Grid Search 🔲

**Idea:** Try every combination of specified values.

\`\`\`python
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier

# Define parameter grid
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 15, None],
    'min_samples_split': [2, 5, 10]
}

# Create grid search
grid_search = GridSearchCV(
    estimator=RandomForestClassifier(random_state=42),
    param_grid=param_grid,
    cv=5,                    # 5-fold cross-validation
    scoring='accuracy',
    n_jobs=-1,               # Use all CPU cores
    verbose=1
)

# Run the search
grid_search.fit(X_train, y_train)

# Results
print(f"Best parameters: {grid_search.best_params_}")
print(f"Best CV score: {grid_search.best_score_:.3f}")
print(f"Test score: {grid_search.score(X_test, y_test):.3f}")
\`\`\`

### Pros & Cons

✅ **Pros:**
- Guaranteed to find the best combination (in your grid)
- Exhaustive - won't miss anything you specified
- Easy to understand and implement

❌ **Cons:**
- **Curse of dimensionality:** 3 params × 4 values each = 64 combinations
- 5 params × 5 values = 3,125 combinations!
- Wastes time on bad regions of parameter space

---

## Method 2: Random Search 🎲

**Idea:** Randomly sample from parameter distributions.

\`\`\`python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint, uniform

# Define parameter distributions
param_distributions = {
    'n_estimators': randint(50, 300),        # Uniform integer [50, 300)
    'max_depth': randint(3, 20),             # Uniform integer [3, 20)
    'min_samples_split': randint(2, 20),
    'min_samples_leaf': randint(1, 10),
    'max_features': uniform(0.1, 0.9),       # Uniform float [0.1, 1.0)
}

# Create randomized search
random_search = RandomizedSearchCV(
    estimator=RandomForestClassifier(random_state=42),
    param_distributions=param_distributions,
    n_iter=100,              # Number of random combinations to try
    cv=5,
    scoring='accuracy',
    n_jobs=-1,
    random_state=42,
    verbose=1
)

random_search.fit(X_train, y_train)
print(f"Best parameters: {random_search.best_params_}")
\`\`\`

### Why Random Search Often Beats Grid Search

Imagine you have 2 hyperparameters, but only 1 actually matters:

- **Grid Search:** Tests same values repeatedly for unimportant param
- **Random Search:** Tests MORE unique values for important param

**Research shows:** Random search finds good solutions in **fewer iterations** than grid search, especially when some parameters matter more than others.

### Pros & Cons

✅ **Pros:**
- Much faster than grid search
- Explores more of the parameter space
- Works well with many hyperparameters
- Can use continuous distributions

❌ **Cons:**
- May miss the absolute best combination
- Results vary between runs (use random_state)

---

## Method 3: Bayesian Optimization 🧠

**Idea:** Use past results to decide where to search next.

\`\`\`python
# Using Optuna (modern and powerful)
import optuna
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

def objective(trial):
    # Suggest hyperparameters
    n_estimators = trial.suggest_int('n_estimators', 50, 300)
    max_depth = trial.suggest_int('max_depth', 3, 20)
    min_samples_split = trial.suggest_int('min_samples_split', 2, 20)
    
    # Create and evaluate model
    model = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        random_state=42
    )
    
    # Return mean CV score (Optuna minimizes, so negate for accuracy)
    scores = cross_val_score(model, X_train, y_train, cv=5)
    return scores.mean()

# Create study and optimize
study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=50, show_progress_bar=True)

print(f"Best parameters: {study.best_params}")
print(f"Best CV score: {study.best_value:.3f}")
\`\`\`

### How It Works

1. **Explore:** Try random combinations initially
2. **Model:** Build a model of how parameters affect performance
3. **Exploit:** Focus on promising regions
4. **Repeat:** Balance exploration vs exploitation

### Pros & Cons

✅ **Pros:**
- Most sample-efficient
- Smart about where to search
- Handles continuous parameters well
- Can incorporate prior knowledge

❌ **Cons:**
- More complex to set up
- Overhead for small searches
- Results can vary

---

## Cross-Validation is Crucial

**Never tune on a single train/test split!**

\`\`\`python
# WRONG - overfits to one particular split
model.fit(X_train, y_train)
score = model.score(X_test, y_test)

# RIGHT - robust estimate across multiple splits
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X_train, y_train, cv=5)
print(f"CV Score: {scores.mean():.3f} (+/- {scores.std()*2:.3f})")
\`\`\`

**Why 5-fold CV?**
- Trains on 80% of data 5 times
- Tests on different 20% each time
- Average gives robust estimate

---

## Practical Workflow

### Step 1: Coarse Search

Start broad to find the right region:

\`\`\`python
# Coarse grid
coarse_params = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 20],
    'learning_rate': [0.01, 0.1, 0.3]
}
\`\`\`

### Step 2: Fine Search

Zoom in on promising areas:

\`\`\`python
# Found max_depth=10 works well, now fine-tune
fine_params = {
    'n_estimators': [80, 100, 120],
    'max_depth': [8, 10, 12],
    'learning_rate': [0.05, 0.1, 0.15]
}
\`\`\`

### Step 3: Final Evaluation

\`\`\`python
# Only now use test set!
best_model = grid_search.best_estimator_
final_score = best_model.score(X_test, y_test)
print(f"Final test score: {final_score:.3f}")
\`\`\`

---

## Common Mistakes

### Mistake 1: Tuning on Test Data

\`\`\`python
# WRONG - data leakage!
for params in param_grid:
    model = Model(**params)
    model.fit(X_train, y_train)
    score = model.score(X_test, y_test)  # NO!
    
# RIGHT - use validation set or CV
grid_search = GridSearchCV(model, params, cv=5)
grid_search.fit(X_train, y_train)
# Only use X_test at the very end
\`\`\`

### Mistake 2: Too Many Parameters at Once

Start with the most impactful hyperparameters:

| Algorithm | Most Important |
|-----------|----------------|
| Random Forest | n_estimators, max_depth |
| XGBoost | learning_rate, max_depth, n_estimators |
| SVM | C, kernel, gamma |
| Neural Net | learning_rate, architecture, batch_size |

### Mistake 3: Forgetting Computational Cost

\`\`\`python
# This will take forever!
param_grid = {
    'n_estimators': range(50, 500, 10),     # 45 values
    'max_depth': range(1, 30),               # 29 values
    'min_samples_split': range(2, 50),       # 48 values
}
# Total: 45 × 29 × 48 × 5 CV folds = 313,200 model fits!
\`\`\`

---

## Quick Reference

| Method | Best For | Time | Finds Optimum |
|--------|----------|------|---------------|
| Grid Search | Few parameters, small grids | Slow | Yes (in grid) |
| Random Search | Many parameters, large space | Fast | Usually close |
| Bayesian | Expensive evaluations, complex spaces | Efficient | Often yes |

**Rule of Thumb:**
- < 3 parameters, < 100 total combinations → Grid Search
- 3-10 parameters → Random Search
- Expensive models or large spaces → Bayesian Optimization`,
      codeExamples: JSON.stringify([
        {
          title: "Complete Tuning Workflow",
          language: "python",
          code: `from sklearn.model_selection import RandomizedSearchCV, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from scipy.stats import randint
import numpy as np

# Step 1: Define parameter distributions
param_dist = {
    'n_estimators': randint(50, 300),
    'max_depth': randint(3, 20),
    'min_samples_split': randint(2, 20),
    'min_samples_leaf': randint(1, 10),
}

# Step 2: Random search with cross-validation
search = RandomizedSearchCV(
    RandomForestClassifier(random_state=42),
    param_distributions=param_dist,
    n_iter=50,
    cv=5,
    scoring='accuracy',
    n_jobs=-1,
    random_state=42
)

search.fit(X_train, y_train)

# Step 3: Examine results
print(f"Best params: {search.best_params_}")
print(f"Best CV score: {search.best_score_:.3f}")

# Step 4: Final evaluation on test set
final_score = search.score(X_test, y_test)
print(f"Test score: {final_score:.3f}")`
        }
      ]),
      keyPoints: [
        "Parameters are learned from data; hyperparameters are set by you",
        "Grid Search: exhaustive but slow - good for small parameter spaces",
        "Random Search: faster and often better - good default choice",
        "Bayesian Optimization: most efficient - best for expensive evaluations",
        "Always use cross-validation when tuning to avoid overfitting to one split",
        "Start coarse, then fine-tune around the best region",
      ],
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 5,
      isPublished: true,
    },
  });

  console.log("✅ Lesson 5: Hyperparameter Tuning created!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
