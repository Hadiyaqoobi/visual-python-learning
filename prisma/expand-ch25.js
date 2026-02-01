const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = {
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

print(f"X shape: {X.shape}")  # (3, 3)
print(f"y shape: {y.shape}")  # (3,)
\`\`\`

## Feature Engineering

\`\`\`python
# Raw feature
date_built = "2010-05-15"

# Engineered features
age_years = 2024 - 2010  # 14
is_new = age_years < 5   # False
\`\`\`

## Types of Features

| Type | Example | Handling |
|------|---------|----------|
| Numerical | price, age | Use directly or scale |
| Categorical | color, city | One-hot encode |
| Binary | yes/no | Convert to 0/1 |
| Text | description | Vectorize (TF-IDF) |

## Feature Selection

\`\`\`python
from sklearn.feature_selection import SelectKBest, f_regression

selector = SelectKBest(f_regression, k=5)
X_selected = selector.fit_transform(X, y)
\`\`\``,

  'ml-types-supervised-unsupervised-reinforcement': `# Supervised vs Unsupervised vs Reinforcement Learning

Machine learning algorithms fall into three main paradigms.

## Supervised Learning

**Definition**: Learn from labeled examples to predict labels for new data.

\`\`\`python
# Training data has features AND labels
X_train = [[1500, 3], [2000, 4], [1200, 2]]
y_train = [350000, 450000, 280000]

from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X_train, y_train)

prediction = model.predict([[1800, 3]])
\`\`\`

**Types**: Classification (categories) and Regression (continuous)

**Use Cases**: Spam detection, medical diagnosis, price prediction

## Unsupervised Learning

**Definition**: Find patterns in data WITHOUT labels.

\`\`\`python
# No labels!
X = [[1, 2], [1.5, 1.8], [5, 8], [8, 8]]

from sklearn.cluster import KMeans
model = KMeans(n_clusters=2)
model.fit(X)

print(model.labels_)  # [0, 0, 1, 1]
\`\`\`

**Types**: Clustering, Dimensionality Reduction, Anomaly Detection

## Reinforcement Learning

**Definition**: Learn by interacting with environment, receiving rewards.

**Key Concepts**: Agent, Environment, State, Action, Reward

**Use Cases**: Game AI, robotics, autonomous vehicles

## Comparison

| Aspect | Supervised | Unsupervised | Reinforcement |
|--------|-----------|--------------|---------------|
| Labels | Required | Not used | Rewards |
| Goal | Predict | Discover patterns | Maximize reward |`,

  'train-validation-test-sets': `# Training, Validation, and Test Sets

Properly splitting data is crucial for models that generalize well.

## Why Split Data?

\`\`\`python
# BAD: Train and test on same data
model.fit(X, y)
score = model.score(X, y)  # Overly optimistic!

# GOOD: Train and test on different data
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model.fit(X_train, y_train)
score = model.score(X_test, y_test)  # Realistic!
\`\`\`

## The Three-Way Split

- **Training (60-80%)**: Learn patterns
- **Validation (10-20%)**: Tune hyperparameters
- **Test (10-20%)**: Final evaluation only

## Implementation

\`\`\`python
from sklearn.model_selection import train_test_split

# First split: separate test set
X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.2)

# Second split: separate validation set
X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.25)
\`\`\`

## Cross-Validation

\`\`\`python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(model, X, y, cv=5)
print(f"Mean: {scores.mean():.3f} (+/- {scores.std() * 2:.3f})")
\`\`\`

## Common Mistakes

1. **Data Leakage**: Test data influences training
2. **Not Stratifying**: Class imbalance in splits
3. **Temporal Leakage**: Using future to predict past`,

  'decision-trees': `# Decision Trees

Decision trees make predictions by learning simple decision rules.

## How They Work

A tree of if-else decisions:
- Income > 50K? → Yes/No branches
- Age > 30? → Yes/No branches
- Final leaf = prediction

## Implementation

\`\`\`python
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris

iris = load_iris()
X, y = iris.data, iris.target

tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(X, y)

prediction = tree.predict([[5.1, 3.5, 1.4, 0.2]])
print(f"Predicted: {iris.target_names[prediction[0]]}")
\`\`\`

## Visualizing

\`\`\`python
from sklearn.tree import plot_tree
import matplotlib.pyplot as plt

plt.figure(figsize=(20, 10))
plot_tree(tree, feature_names=iris.feature_names, 
          class_names=iris.target_names, filled=True)
plt.show()
\`\`\`

## Controlling Complexity

\`\`\`python
tree = DecisionTreeClassifier(
    max_depth=5,           # Maximum tree depth
    min_samples_split=10,  # Min samples to split
    min_samples_leaf=5,    # Min samples in leaf
)
\`\`\`

## Pros and Cons

**Pros**: Easy to interpret, handles mixed data, feature importance

**Cons**: Prone to overfitting, unstable, biased with imbalanced data

## Feature Importance

\`\`\`python
for name, imp in zip(iris.feature_names, tree.feature_importances_):
    print(f"{name}: {imp:.3f}")
\`\`\``,

  'random-forests': `# Random Forests

Random Forests combine many decision trees for better accuracy.

## The Wisdom of Crowds

Many trees voting together are more reliable than one!

## How It Works

1. **Bootstrap Sampling**: Each tree trains on random sample
2. **Feature Randomness**: Each split uses random features
3. **Aggregation**: Vote or average predictions

## Implementation

\`\`\`python
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
    n_estimators=100,      # Number of trees
    max_depth=5,           # Max depth per tree
    random_state=42
)

rf.fit(X_train, y_train)
print(f"Accuracy: {rf.score(X_test, y_test):.3f}")
\`\`\`

## Feature Importance

\`\`\`python
import pandas as pd

feat_imp = pd.DataFrame({
    'feature': feature_names,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)
print(feat_imp)
\`\`\`

## Out-of-Bag Score

\`\`\`python
rf = RandomForestClassifier(n_estimators=100, oob_score=True)
rf.fit(X, y)
print(f"OOB Score: {rf.oob_score_:.3f}")
\`\`\`

## Pros and Cons

**Pros**: Very accurate, handles overfitting, parallelizable

**Cons**: Less interpretable, can be slow, memory intensive`,

  'linear-regression': `# Linear Regression

Linear regression finds the best line through your data.

## The Concept

y = mx + b (slope × input + intercept)

## Simple Linear Regression

\`\`\`python
import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[1000], [1500], [2000], [2500], [3000]])
y = np.array([200000, 280000, 350000, 420000, 500000])

model = LinearRegression()
model.fit(X, y)

print(f"Slope: ${model.coef_[0]:.2f} per sqft")
print(f"Intercept: ${model.intercept_:.2f}")

prediction = model.predict([[1800]])
print(f"1800 sqft: ${prediction[0]:,.2f}")
\`\`\`

## Multiple Linear Regression

\`\`\`python
X = np.array([
    [1500, 3, 10],  # sqft, beds, age
    [2000, 4, 5],
    [1200, 2, 20],
])
y = np.array([300000, 400000, 250000])

model = LinearRegression()
model.fit(X, y)

for name, coef in zip(['sqft', 'beds', 'age'], model.coef_):
    print(f"{name}: {coef:.2f}")
\`\`\`

## Evaluation Metrics

\`\`\`python
from sklearn.metrics import mean_squared_error, r2_score

y_pred = model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"RMSE: ${rmse:,.2f}")
print(f"R²: {r2:.3f}")
\`\`\``,

  'gradient-descent': `# Gradient Descent

The optimization algorithm powering most of ML.

## The Intuition

Like finding the valley while blindfolded:
1. Feel the slope
2. Step downhill
3. Repeat until flat

## The Math

weight = weight - learning_rate × gradient

## Implementation

\`\`\`python
import numpy as np

def gradient_descent(X, y, lr=0.01, iterations=1000):
    m, n = X.shape
    weights = np.zeros(n)
    bias = 0
    
    for i in range(iterations):
        y_pred = X @ weights + bias
        
        # Gradients
        dw = (1/m) * X.T @ (y_pred - y)
        db = (1/m) * np.sum(y_pred - y)
        
        # Update
        weights -= lr * dw
        bias -= lr * db
    
    return weights, bias
\`\`\`

## Learning Rate

- Too small: Slow convergence
- Too large: Overshooting
- Just right: Fast and stable

## Variants

- **Batch GD**: All samples (stable, slow)
- **SGD**: One sample (fast, noisy)
- **Mini-Batch**: 32-128 samples (best of both)

## Modern Optimizers

- **Momentum**: Accelerates consistent directions
- **Adam**: Adaptive rates per parameter
- **RMSprop**: Scales by recent gradients`,

  'logistic-regression': `# Logistic Regression

Despite its name, used for **classification**.

## The Sigmoid Function

Squashes any value to (0, 1):

\`\`\`python
def sigmoid(z):
    return 1 / (1 + np.exp(-z))

print(sigmoid(-10))  # ≈ 0.00
print(sigmoid(0))    # = 0.50
print(sigmoid(10))   # ≈ 1.00
\`\`\`

## Implementation

\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2
)

model = LogisticRegression(max_iter=10000)
model.fit(X_train, y_train)

# Probabilities
probs = model.predict_proba(X_test)
print(f"Accuracy: {model.score(X_test, y_test):.3f}")
\`\`\`

## Multi-Class

\`\`\`python
model = LogisticRegression(multi_class='multinomial')
\`\`\`

## Regularization

\`\`\`python
# L2 (Ridge) - default
model = LogisticRegression(penalty='l2', C=1.0)

# L1 (Lasso) - feature selection
model = LogisticRegression(penalty='l1', solver='saga')
\`\`\``,

  'k-nearest-neighbors': `# K-Nearest Neighbors (KNN)

"Tell me who your neighbors are, and I'll tell you who you are."

## How It Works

1. Find K closest training points
2. Vote among neighbors
3. Assign majority class

## Implementation

\`\`\`python
from sklearn.neighbors import KNeighborsClassifier

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)
print(f"Accuracy: {knn.score(X_test, y_test):.3f}")
\`\`\`

## Choosing K

\`\`\`python
from sklearn.model_selection import cross_val_score

scores = []
for k in range(1, 31):
    knn = KNeighborsClassifier(n_neighbors=k)
    score = cross_val_score(knn, X_train, y_train, cv=5).mean()
    scores.append(score)

best_k = np.argmax(scores) + 1
\`\`\`

## Feature Scaling is Critical!

\`\`\`python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
\`\`\`

## Pros and Cons

**Pros**: Simple, no training, handles multi-class

**Cons**: Slow predictions, needs scaling, sensitive to irrelevant features`,

  'bias-variance-tradeoff': `# Bias-Variance Tradeoff

Understanding why models fail.

## The Formula

Total Error = Bias² + Variance + Noise

## Bias (Underfitting)

Model too simple:
- Poor training AND test accuracy
- Solution: More complex model

## Variance (Overfitting)

Model too sensitive to training data:
- Great training, poor test accuracy
- Solution: More data, regularization

## Learning Curves

\`\`\`python
from sklearn.model_selection import learning_curve

train_sizes, train_scores, val_scores = learning_curve(
    model, X, y, cv=5
)

# High Bias: Both curves low
# High Variance: Big gap between curves
\`\`\`

## Solutions

**For High Bias:**
- More complex model
- More/better features
- Less regularization

**For High Variance:**
- More training data
- Simpler model
- More regularization
- Dropout, early stopping`,

  'regularization': `# Regularization

Prevent overfitting by penalizing complexity.

## The Idea

Loss = Data Loss + λ × Penalty

## L2 Regularization (Ridge)

Shrinks all weights:

\`\`\`python
from sklearn.linear_model import Ridge

ridge = Ridge(alpha=1.0)
ridge.fit(X_train, y_train)
\`\`\`

## L1 Regularization (Lasso)

Some weights become exactly 0:

\`\`\`python
from sklearn.linear_model import Lasso

lasso = Lasso(alpha=1.0)
lasso.fit(X_train, y_train)
# Automatic feature selection!
\`\`\`

## Elastic Net

Combines L1 and L2:

\`\`\`python
from sklearn.linear_model import ElasticNet

elastic = ElasticNet(alpha=1.0, l1_ratio=0.5)
\`\`\`

## Choosing Alpha

\`\`\`python
from sklearn.linear_model import RidgeCV

alphas = [0.001, 0.01, 0.1, 1.0, 10.0]
ridge_cv = RidgeCV(alphas=alphas, cv=5)
ridge_cv.fit(X_train, y_train)
print(f"Best alpha: {ridge_cv.alpha_}")
\`\`\``,

  'overfitting-and-underfitting': `# Overfitting and Underfitting

Two fundamental ML problems.

## Overfitting

Model memorizes training data:
- Training: 100%, Test: 60%
- Big gap = overfitting!

**Solutions:**
\`\`\`python
# Simpler model
tree = DecisionTreeClassifier(max_depth=3)

# Regularization
model = Ridge(alpha=1.0)

# More data
# Dropout, early stopping
\`\`\`

## Underfitting

Model too simple:
- Training: 70%, Test: 68%
- Both low = underfitting!

**Solutions:**
\`\`\`python
# More complex model
tree = DecisionTreeClassifier(max_depth=10)

# More features
poly = PolynomialFeatures(degree=3)

# Less regularization
\`\`\`

## Detection

\`\`\`python
train_score = model.score(X_train, y_train)
test_score = model.score(X_test, y_test)

if train_score > 0.95 and test_score < 0.8:
    print("Overfitting!")
elif train_score < 0.7:
    print("Underfitting!")
\`\`\``,

  'k-means-clustering': `# K-Means Clustering

Group data by similarity without labels.

## The Algorithm

1. Initialize K centers randomly
2. Assign points to nearest center
3. Move centers to cluster means
4. Repeat until convergence

## Implementation

\`\`\`python
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

kmeans = KMeans(n_clusters=4, random_state=42)
labels = kmeans.fit_predict(X)

plt.scatter(X[:, 0], X[:, 1], c=labels)
plt.scatter(kmeans.cluster_centers_[:, 0], 
            kmeans.cluster_centers_[:, 1], 
            c='red', marker='X', s=200)
plt.show()
\`\`\`

## Choosing K: Elbow Method

\`\`\`python
inertias = []
for k in range(1, 11):
    kmeans = KMeans(n_clusters=k)
    kmeans.fit(X)
    inertias.append(kmeans.inertia_)

plt.plot(range(1, 11), inertias, 'bo-')
plt.xlabel('K')
plt.ylabel('Inertia')
# Look for the "elbow"
\`\`\`

## Silhouette Score

\`\`\`python
from sklearn.metrics import silhouette_score

for k in range(2, 11):
    labels = KMeans(n_clusters=k).fit_predict(X)
    print(f"K={k}: {silhouette_score(X, labels):.3f}")
\`\`\`

## Limitations

- Assumes spherical clusters
- Must specify K
- Sensitive to initialization
- Sensitive to outliers`
};

async function main() {
  console.log("Expanding Chapter 25...");
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
