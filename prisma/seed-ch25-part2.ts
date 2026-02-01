// Chapter 25 Part 2: Lessons 7-10

export const chapter25Part2 = [
  {
    slug: "logistic-regression",
    title: "Logistic Regression: Classification",
    content: `
# Logistic Regression: Classification

Despite its name, logistic regression is for **classification**, not regression. It predicts the **probability** of belonging to a class.

## Why Not Linear Regression?

Linear regression outputs -∞ to +∞. But probabilities must be 0 to 1!

## The Sigmoid Function

Squashes any number to (0, 1):

\`\`\`
σ(z) = 1 / (1 + e^(-z))

σ(0) = 0.5
σ(large +) → 1
σ(large -) → 0
\`\`\`

## The Model

\`\`\`
1. Linear: z = w₁x₁ + w₂x₂ + ... + b
2. Sigmoid: P(y=1) = σ(z) = 1 / (1 + e^(-z))
3. Decision: ŷ = 1 if P ≥ 0.5, else 0
\`\`\`

## Using Scikit-Learn

\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

model = LogisticRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)  # Probabilities

print(classification_report(y_test, y_pred))
\`\`\`

## Adjusting Threshold

Default is 0.5, but you can change it:

\`\`\`python
threshold = 0.3  # More positives (higher recall)
y_pred = (model.predict_proba(X_test)[:, 1] >= threshold).astype(int)
\`\`\`

- **Medical diagnosis:** Lower threshold (don't miss diseases)
- **Spam filter:** Higher threshold (don't block real emails)

## Key Takeaways

1. **Logistic regression** = classification, not regression
2. **Sigmoid** converts to probability (0-1)
3. **Cross-entropy** loss (not MSE)
4. **Threshold** adjustable based on cost of errors
`,
    exercises: [
      {
        id: "logreg-1",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "Why use sigmoid in logistic regression?",
        options: [
          "Faster computation",
          "Converts any number to probability (0-1)",
          "Makes model non-linear",
          "Prevents overfitting"
        ],
        correctAnswer: 1,
        explanation: "Sigmoid squashes any input to (0, 1), giving valid probabilities."
      }
    ]
  },
  {
    slug: "k-nearest-neighbors",
    title: "K-Nearest Neighbors: Learning by Similarity",
    content: `
# K-Nearest Neighbors (KNN)

KNN makes predictions based on the **most similar** training examples.

## The Algorithm

1. Find K closest training points
2. Classification: majority vote
3. Regression: average values

## Distance: Euclidean

\`\`\`
d(a, b) = √[(a₁-b₁)² + (a₂-b₂)² + ...]
\`\`\`

## Using Scikit-Learn

\`\`\`python
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

# ALWAYS scale for KNN!
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train_scaled, y_train)
print(f"Accuracy: {knn.score(X_test_scaled, y_test):.3f}")
\`\`\`

## Choosing K

- **K too small:** Noisy, overfits
- **K too large:** Over-smooths
- **Rule of thumb:** K = √n

\`\`\`python
# Find best K with cross-validation
from sklearn.model_selection import cross_val_score

for k in range(1, 20):
    knn = KNeighborsClassifier(n_neighbors=k)
    score = cross_val_score(knn, X_scaled, y, cv=5).mean()
    print(f"K={k}: {score:.3f}")
\`\`\`

## Why Scale Features?

Without scaling, features with larger ranges dominate!

\`\`\`
age: 0-100
salary: 0-100,000
# Salary will completely dominate the distance!
\`\`\`

## Pros/Cons

**Pros:** Simple, no training, handles multi-class
**Cons:** Slow prediction, sensitive to scaling

## Key Takeaways

1. **KNN** = classify by K nearest neighbors
2. **Always scale features**
3. **Use cross-validation** to find K
4. **Slow** for large datasets
`,
    exercises: [
      {
        id: "knn-1",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "In KNN with K=5, how is classification done?",
        options: [
          "Average the 5 labels",
          "Use closest neighbor only",
          "Majority vote among 5 nearest",
          "Use median"
        ],
        correctAnswer: 2,
        explanation: "Classification uses majority voting - the most common class among K neighbors wins."
      }
    ]
  },
  {
    slug: "decision-trees",
    title: "Decision Trees: If-Then-Else Learning",
    content: `
# Decision Trees

Decision trees make predictions through **if-then-else questions**.

\`\`\`
         [Income > $50k?]
         /           \\
       No            Yes
       /              \\
  [Age > 30?]     [Owns home?]
   /     \\         /      \\
DENY   DENY    APPROVE  APPROVE
\`\`\`

## How Trees are Built

Find splits that best **separate** classes using:

### Gini Impurity
\`\`\`
Gini = 1 - Σ(pᵢ)²

Pure node (all same): Gini = 0
50-50 split: Gini = 0.5
\`\`\`

## Using Scikit-Learn

\`\`\`python
from sklearn.tree import DecisionTreeClassifier, plot_tree

tree = DecisionTreeClassifier(
    max_depth=5,           # Prevent overfitting
    min_samples_split=10,  # Min samples to split
    min_samples_leaf=5     # Min samples in leaf
)
tree.fit(X_train, y_train)

# Visualize
plot_tree(tree, feature_names=features, filled=True)

# Feature importance
for name, imp in zip(features, tree.feature_importances_):
    print(f"{name}: {imp:.3f}")
\`\`\`

## Preventing Overfitting

Trees easily overfit! Use regularization:

\`\`\`python
tree = DecisionTreeClassifier(
    max_depth=5,         # Limit depth
    min_samples_leaf=10  # Require samples per leaf
)
\`\`\`

## Pros/Cons

**Pros:** Interpretable, no scaling needed, handles mixed data
**Cons:** Overfits easily, unstable

## Key Takeaways

1. **Trees** = series of if-then rules
2. **Gini** measures impurity (0 = pure)
3. **Regularize** with max_depth, min_samples
4. **Feature importance** built-in
`,
    exercises: [
      {
        id: "tree-1",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "Gini impurity = 0 means:",
        options: [
          "No samples",
          "Completely pure (all same class)",
          "Bad split",
          "50-50 split"
        ],
        correctAnswer: 1,
        explanation: "Gini = 0 means perfect purity - all samples belong to the same class."
      }
    ]
  },
  {
    slug: "random-forests",
    title: "Random Forests: Ensemble Power",
    content: `
# Random Forests

Random Forests combine many decision trees for more robust predictions.

> "Many weak learners make a strong learner."

## The Key Ideas

### 1. Bagging
Each tree trains on random sample of data (with replacement).

### 2. Feature Randomness
Each split considers only random subset of features.

**Result:** Trees are diverse, errors cancel out!

## Using Scikit-Learn

\`\`\`python
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
    n_estimators=100,     # Number of trees
    max_depth=10,
    max_features='sqrt',  # Features per split
    n_jobs=-1             # Use all CPUs
)
rf.fit(X_train, y_train)

# Feature importance
for name, imp in sorted(zip(features, rf.feature_importances_), 
                        key=lambda x: x[1], reverse=True):
    print(f"{name}: {imp:.3f}")
\`\`\`

## Out-of-Bag (OOB) Score

Free validation! Each tree tested on data it didn't see:

\`\`\`python
rf = RandomForestClassifier(n_estimators=100, oob_score=True)
rf.fit(X_train, y_train)
print(f"OOB Score: {rf.oob_score_:.3f}")
\`\`\`

## How Many Trees?

Usually 100-500. Diminishing returns after that.

## RF vs Single Tree

| Aspect | Decision Tree | Random Forest |
|--------|--------------|---------------|
| Variance | High | Low |
| Overfitting | Easy | Harder |
| Interpretability | High | Low |
| Accuracy | Lower | Higher |

## Key Takeaways

1. **Random Forest** = many trees voting
2. **Bagging** + feature randomness = diverse trees
3. **OOB score** = free validation
4. **Feature importance** built-in
5. Works well "out of the box"
`,
    exercises: [
      {
        id: "rf-1",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "Why do Random Forests outperform single trees?",
        options: [
          "More complex splits",
          "Many trees reduce variance - errors cancel out",
          "Deeper trees",
          "More training data"
        ],
        correctAnswer: 1,
        explanation: "By averaging many diverse trees, individual errors cancel out, reducing variance."
      }
    ]
  }
];

export default chapter25Part2;
