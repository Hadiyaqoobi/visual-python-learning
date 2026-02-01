// Chapter 25: Machine Learning Fundamentals - Comprehensive Content
// Sources: MIT 6.036, Stanford CS229, "Introduction to Statistical Learning"

export const chapter25Lessons = [
  // ============================================
  // LESSON 1: What is Machine Learning?
  // ============================================
  {
    slug: "what-is-machine-learning",
    title: "What is Machine Learning?",
    content: `
# What is Machine Learning?

## The Core Idea

Machine Learning is **the science of getting computers to learn from data without being explicitly programmed**. Instead of writing rules manually, we show the computer examples and let it discover patterns.

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

## Why Machine Learning?

### Problems Too Complex for Manual Rules

**Spam Detection**: Spammers constantly evolve tactics. Writing rules manually is impossible.

**Image Recognition**: How would you write rules to detect a cat? "Has fur, four legs, whiskers..." But so does a dog!

**Speech Recognition**: Accents, background noise, speaking speeds vary infinitely.

**Medical Diagnosis**: Thousands of symptoms, test results, and conditions interact in complex ways.

### The Data Explosion

- 2.5 quintillion bytes of data created daily
- Humans cannot manually analyze this volume
- ML finds patterns humans would miss

## The Machine Learning Process

### Step 1: Define the Problem
What are you trying to predict? Classification? A number? Groups?

### Step 2: Collect Data
The foundation of ML. More quality data = better models.

\`\`\`python
# Example: Housing price dataset
import pandas as pd

data = pd.DataFrame({
    'sqft': [1400, 1600, 1700, 1875, 1100],
    'bedrooms': [3, 3, 2, 4, 2],
    'age': [15, 10, 5, 0, 25],
    'price': [245000, 312000, 279000, 308000, 199000]
})
\`\`\`

### Step 3: Prepare Data
Clean missing values, normalize scales, encode categories.

\`\`\`python
from sklearn.preprocessing import StandardScaler

# Normalize features to same scale
scaler = StandardScaler()
X_scaled = scaler.fit_transform(data[['sqft', 'bedrooms', 'age']])
\`\`\`

### Step 4: Choose a Model
Linear Regression? Decision Tree? Neural Network? Depends on your problem.

### Step 5: Train the Model
Feed data to the model. It adjusts internal parameters to minimize errors.

\`\`\`python
from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_scaled, data['price'])  # Learning happens here!
\`\`\`

### Step 6: Evaluate Performance
How well does it work on NEW data it hasn't seen?

\`\`\`python
from sklearn.metrics import mean_absolute_error

predictions = model.predict(X_test)
error = mean_absolute_error(y_test, predictions)
print(f"Average prediction error: ${error:,.0f}")
\`\`\`

### Step 7: Deploy & Monitor
Put into production. Monitor for drift (when real-world data changes).

## Key Terminology

| Term | Definition | Example |
|------|------------|---------|
| **Features** | Input variables (X) | Square footage, bedrooms |
| **Labels/Target** | What we predict (y) | House price |
| **Training Data** | Data used to learn | 80% of dataset |
| **Test Data** | Data to evaluate | 20% of dataset |
| **Model** | The learned function | f(X) → y |
| **Parameters** | Values model learns | Weights, biases |
| **Hyperparameters** | Settings we choose | Learning rate, depth |

## Real-World Applications

### Healthcare
- Cancer detection from medical images
- Drug discovery and interaction prediction
- Personalized treatment recommendations

### Finance
- Fraud detection (anomaly detection)
- Credit scoring (classification)
- Algorithmic trading (time series prediction)

### Technology
- Search engines (ranking)
- Recommendation systems (Netflix, Spotify)
- Voice assistants (speech recognition + NLP)

### Transportation
- Self-driving cars (computer vision + planning)
- Route optimization (reinforcement learning)
- Demand prediction (time series)

## Common Misconceptions

### ❌ "ML will solve any problem"
ML requires quality data and well-defined problems. Garbage in = garbage out.

### ❌ "More data is always better"
Quality > Quantity. Biased data creates biased models.

### ❌ "ML models understand like humans"
They find statistical patterns, not true understanding.

### ❌ "Once trained, models work forever"
Real-world data changes (drift). Models need retraining.

## Your First ML Model in 5 Lines

\`\`\`python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

# Load famous iris flower dataset
X, y = load_iris(return_X_y=True)

# Split: 80% train, 20% test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train a decision tree
model = DecisionTreeClassifier()
model.fit(X_train, y_train)

# Evaluate
accuracy = model.score(X_test, y_test)
print(f"Accuracy: {accuracy:.1%}")  # Typically ~95%+
\`\`\`

## Key Takeaways

1. **ML learns from data** instead of following explicit rules
2. **The process is iterative**: data → train → evaluate → improve
3. **Data quality is crucial**: bad data = bad predictions
4. **ML is a tool, not magic**: requires understanding to use effectively
5. **Start simple**: begin with basic models before complex ones
`,
    exercises: [
      {
        id: "ml-intro-1",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "What is the key difference between traditional programming and machine learning?",
        options: [
          "ML is faster than traditional programming",
          "In ML, the computer learns rules from data instead of being given explicit rules",
          "ML doesn't require any data",
          "Traditional programming cannot solve complex problems"
        ],
        correctAnswer: 1,
        explanation: "In traditional programming, we write explicit rules. In ML, we provide data and answers, and the computer discovers the rules/patterns automatically."
      },
      {
        id: "ml-intro-2",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "Which of the following is NOT a good use case for machine learning?",
        options: [
          "Detecting spam emails",
          "Calculating the sum of two numbers",
          "Recognizing faces in photos",
          "Predicting stock prices"
        ],
        correctAnswer: 1,
        explanation: "Calculating a sum has a clear, simple rule (addition). ML is best for problems too complex for manual rules, like spam detection, image recognition, or prediction tasks."
      },
      {
        id: "ml-intro-3",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        points: 20,
        question: "Complete the code to train a simple ML model and print its accuracy:",
        starterCode: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

# Load data
X, y = load_iris(return_X_y=True)

# Split into train/test (80/20)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=___)

# Create and train model
model = ___
model.fit(___, ___)

# Print accuracy
print(f"Accuracy: {model.score(X_test, y_test):.1%}")`,
        solution: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = DecisionTreeClassifier()
model.fit(X_train, y_train)

print(f"Accuracy: {model.score(X_test, y_test):.1%}")`,
        explanation: "We use test_size=0.2 for 80/20 split, create a DecisionTreeClassifier, and train it using fit(X_train, y_train)."
      }
    ]
  },

  // ============================================
  // LESSON 2: Types of Machine Learning
  // ============================================
  {
    slug: "ml-types-supervised-unsupervised-reinforcement",
    title: "Types of Machine Learning",
    content: `
# Types of Machine Learning

Machine learning algorithms are categorized by how they learn from data. Understanding these types helps you choose the right approach for your problem.

## Overview of ML Types

| Type | Has Labels? | Goal | Example |
|------|-------------|------|---------|
| **Supervised** | Yes ✓ | Predict labels | Email → Spam/Not Spam |
| **Unsupervised** | No ✗ | Find patterns | Customer segmentation |
| **Reinforcement** | Rewards | Learn actions | Game AI, robotics |

---

## 1. Supervised Learning

### What Is It?

Supervised learning uses **labeled data** - examples where we know the correct answer. The algorithm learns to map inputs to outputs.

> "In supervised learning, we are given a data set and already know what our correct output should look like, having the idea that there is a relationship between the input and the output."
> — Stanford CS229

### The Two Types of Supervised Learning

#### Classification: Predict a Category

The output is a **discrete class label**.

\`\`\`python
# Binary Classification (2 classes)
# Input: Email text → Output: Spam or Not Spam

from sklearn.naive_bayes import MultinomialNB

classifier = MultinomialNB()
classifier.fit(email_features, spam_labels)  # 0=not spam, 1=spam
prediction = classifier.predict(new_email)   # Returns 0 or 1
\`\`\`

\`\`\`python
# Multi-class Classification (3+ classes)
# Input: Image → Output: Cat, Dog, or Bird

from sklearn.ensemble import RandomForestClassifier

classifier = RandomForestClassifier()
classifier.fit(image_features, animal_labels)  # 0=cat, 1=dog, 2=bird
prediction = classifier.predict(new_image)     # Returns 0, 1, or 2
\`\`\`

**Common Classification Algorithms:**
- Logistic Regression
- Decision Trees
- Random Forest
- Support Vector Machines (SVM)
- Neural Networks

#### Regression: Predict a Number

The output is a **continuous value**.

\`\`\`python
# Input: House features → Output: Price (continuous)

from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(house_features, prices)
predicted_price = model.predict(new_house)  # Returns $247,500.00
\`\`\`

**Common Regression Algorithms:**
- Linear Regression
- Polynomial Regression
- Ridge/Lasso Regression
- Gradient Boosting (XGBoost)
- Neural Networks

### Supervised Learning Examples

| Problem | Input (X) | Output (y) | Type |
|---------|-----------|------------|------|
| Spam detection | Email text | Spam/Not spam | Classification |
| House pricing | Sqft, beds, location | Price ($) | Regression |
| Medical diagnosis | Symptoms, tests | Disease type | Classification |
| Stock prediction | Historical prices | Future price | Regression |
| Sentiment analysis | Review text | Positive/Negative | Classification |

---

## 2. Unsupervised Learning

### What Is It?

Unsupervised learning finds **hidden patterns** in data without labeled examples. The algorithm discovers structure on its own.

> "Unsupervised learning allows us to approach problems with little or no idea what our results should look like. We can derive structure from data where we don't necessarily know the effect of the variables."
> — Stanford CS229

### Types of Unsupervised Learning

#### Clustering: Group Similar Items

Find natural groupings in data.

\`\`\`python
from sklearn.cluster import KMeans

# Group customers into 3 segments based on behavior
kmeans = KMeans(n_clusters=3)
kmeans.fit(customer_data)

# Each customer gets a cluster label (0, 1, or 2)
customer_segments = kmeans.labels_
\`\`\`

**Common Clustering Algorithms:**
- K-Means
- Hierarchical Clustering
- DBSCAN
- Gaussian Mixture Models

#### Dimensionality Reduction: Simplify Data

Reduce number of features while preserving information.

\`\`\`python
from sklearn.decomposition import PCA

# Reduce 100 features to 10 principal components
pca = PCA(n_components=10)
simplified_data = pca.fit_transform(high_dim_data)
\`\`\`

**Common Algorithms:**
- PCA (Principal Component Analysis)
- t-SNE (visualization)
- UMAP

#### Anomaly Detection: Find Outliers

Identify unusual data points.

\`\`\`python
from sklearn.ensemble import IsolationForest

detector = IsolationForest(contamination=0.01)  # Expect 1% anomalies
detector.fit(transaction_data)

# Returns 1 for normal, -1 for anomaly
is_fraud = detector.predict(new_transaction)
\`\`\`

### Unsupervised Learning Examples

| Problem | Data | Goal | Algorithm |
|---------|------|------|-----------|
| Customer segmentation | Purchase history | Find customer groups | K-Means |
| Fraud detection | Transactions | Find unusual patterns | Isolation Forest |
| Topic modeling | Documents | Discover themes | LDA |
| Gene analysis | Gene expressions | Find gene groups | Hierarchical |

---

## 3. Reinforcement Learning

### What Is It?

Reinforcement learning learns through **trial and error**. An agent takes actions in an environment and receives rewards or penalties.

> "Reinforcement learning is learning what to do—how to map situations to actions—so as to maximize a numerical reward signal."
> — Sutton & Barto, "Reinforcement Learning: An Introduction"

### Key Concepts

\`\`\`
Agent → takes Action → Environment → returns State + Reward → Agent learns
\`\`\`

| Term | Definition | Chess Example |
|------|------------|---------------|
| **Agent** | The learner/decision maker | Chess AI |
| **Environment** | What agent interacts with | Chess board |
| **State** | Current situation | Board position |
| **Action** | What agent can do | Move a piece |
| **Reward** | Feedback signal | +1 win, -1 lose, 0 otherwise |
| **Policy** | Strategy for choosing actions | Which move to make |

### Simple RL Example

\`\`\`python
# Conceptual Q-Learning for a simple game
import numpy as np

# Q-table: stores value of each (state, action) pair
Q = np.zeros((num_states, num_actions))

for episode in range(1000):
    state = env.reset()
    
    while not done:
        # Choose action (explore vs exploit)
        if np.random.random() < epsilon:
            action = np.random.randint(num_actions)  # Explore
        else:
            action = np.argmax(Q[state])  # Exploit best known
        
        # Take action, get reward
        next_state, reward, done = env.step(action)
        
        # Update Q-value (learning!)
        Q[state, action] = Q[state, action] + alpha * (
            reward + gamma * np.max(Q[next_state]) - Q[state, action]
        )
        
        state = next_state
\`\`\`

### Reinforcement Learning Examples

| Application | Agent | Actions | Reward |
|-------------|-------|---------|--------|
| Game AI (AlphaGo) | AI player | Game moves | Win/Lose |
| Robot walking | Robot | Motor controls | Distance walked |
| Stock trading | Trading bot | Buy/Sell/Hold | Profit |
| Recommendation | System | Show content | User engagement |

---

## Choosing the Right Type

\`\`\`
START
  │
  ├── Do you have labeled data?
  │     │
  │     ├── YES → SUPERVISED
  │     │         │
  │     │         ├── Predicting a category? → Classification
  │     │         └── Predicting a number? → Regression
  │     │
  │     └── NO → Do you need to learn from interaction?
  │               │
  │               ├── YES → REINFORCEMENT LEARNING
  │               │
  │               └── NO → UNSUPERVISED
  │                         │
  │                         ├── Finding groups? → Clustering
  │                         ├── Reducing features? → Dimensionality Reduction
  │                         └── Finding anomalies? → Anomaly Detection
\`\`\`

## Comparison Table

| Aspect | Supervised | Unsupervised | Reinforcement |
|--------|------------|--------------|---------------|
| **Data** | Labeled | Unlabeled | Environment |
| **Feedback** | Correct answers | None | Rewards |
| **Goal** | Predict | Discover | Optimize |
| **Difficulty** | Easier | Medium | Hardest |
| **Data needed** | Moderate | Less | Lots of trials |

## Key Takeaways

1. **Supervised learning** = Learn from labeled examples (classification/regression)
2. **Unsupervised learning** = Find hidden patterns in unlabeled data
3. **Reinforcement learning** = Learn optimal actions through trial and error
4. **Choose based on**: Do you have labels? What are you predicting?
5. **Most common**: Supervised learning (because labeled data is most useful)
`,
    exercises: [
      {
        id: "ml-types-1",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "You have a dataset of customer purchases but no labels. You want to group customers with similar buying patterns. Which type of ML should you use?",
        options: [
          "Supervised Learning - Classification",
          "Supervised Learning - Regression",
          "Unsupervised Learning - Clustering",
          "Reinforcement Learning"
        ],
        correctAnswer: 2,
        explanation: "With no labels and a goal of finding groups, this is unsupervised clustering. K-Means or similar algorithms would work well."
      },
      {
        id: "ml-types-2",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "Training an AI to play chess by having it play millions of games against itself is an example of:",
        options: [
          "Supervised Learning",
          "Unsupervised Learning",
          "Reinforcement Learning",
          "Transfer Learning"
        ],
        correctAnswer: 2,
        explanation: "The AI learns by taking actions (moves) and receiving rewards (win/lose). This trial-and-error approach with rewards is reinforcement learning."
      },
      {
        id: "ml-types-3",
        type: "MULTIPLE_CHOICE",
        difficulty: "INTERMEDIATE",
        points: 15,
        question: "You have 10,000 emails labeled as 'spam' or 'not spam'. You want to build a filter for new emails. This is:",
        options: [
          "Unsupervised clustering",
          "Supervised classification",
          "Supervised regression",
          "Reinforcement learning"
        ],
        correctAnswer: 1,
        explanation: "You have labeled data (spam/not spam) and want to predict a category (discrete class), so this is supervised classification."
      }
    ]
  },

  // ============================================
  // LESSON 3: Features and Labels
  // ============================================
  {
    slug: "features-and-labels",
    title: "Features and Labels: The Building Blocks of ML",
    content: `
# Features and Labels: The Building Blocks of ML

Every machine learning problem comes down to **features** (inputs) and **labels** (outputs). Understanding how to work with them is fundamental to ML success.

## The Core Concepts

### Features (X) - The Inputs

Features are the **measurable properties** we use to make predictions. Also called:
- Independent variables
- Input variables  
- Predictors
- Attributes

\`\`\`python
# House price prediction features
features = {
    'square_feet': 1500,
    'bedrooms': 3,
    'bathrooms': 2,
    'age_years': 10,
    'has_garage': True,
    'neighborhood': 'downtown'
}
\`\`\`

### Labels (y) - The Output

The label is **what we're trying to predict**. Also called:
- Dependent variable
- Target variable
- Response variable
- Output

\`\`\`python
# The label we want to predict
label = 285000  # House price in dollars
\`\`\`

## Feature Types

### Numerical Features

Continuous or discrete numbers.

\`\`\`python
# Continuous (any value in a range)
temperature = 72.5
salary = 65432.50

# Discrete (countable values)
num_bedrooms = 3
num_children = 2
\`\`\`

### Categorical Features

Distinct categories or groups.

\`\`\`python
# Nominal (no order)
color = 'red'  # red, blue, green
city = 'Boston'  # Boston, NYC, LA

# Ordinal (has order)
education = 'masters'  # high_school < bachelors < masters < phd
size = 'medium'  # small < medium < large
\`\`\`

### Binary Features

Two possible values.

\`\`\`python
has_garage = True  # True/False
is_spam = 1  # 0 or 1
gender = 'M'  # M/F
\`\`\`

## Feature Engineering

> "Coming up with features is difficult, time-consuming, and requires expert knowledge. Applied machine learning is basically feature engineering."
> — Andrew Ng, Stanford

### Why Feature Engineering Matters

Raw data is rarely in the best format for ML. Good features can:
- Dramatically improve model performance
- Make simple models work as well as complex ones
- Capture domain knowledge

### Common Techniques

#### 1. Creating New Features

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    'length': [10, 15, 20],
    'width': [5, 8, 10],
    'order_date': pd.to_datetime(['2024-01-15', '2024-06-20', '2024-12-25'])
})

# Create area from length × width
df['area'] = df['length'] * df['width']

# Extract date components
df['month'] = df['order_date'].dt.month
df['day_of_week'] = df['order_date'].dt.dayofweek
df['is_weekend'] = df['day_of_week'].isin([5, 6])
\`\`\`

#### 2. Encoding Categorical Variables

**One-Hot Encoding** - For nominal categories:

\`\`\`python
# Before: color = ['red', 'blue', 'green']
# After:  color_red, color_blue, color_green (0 or 1)

df = pd.get_dummies(df, columns=['color'])
\`\`\`

**Label Encoding** - For ordinal categories:

\`\`\`python
from sklearn.preprocessing import LabelEncoder

# education: high_school=0, bachelors=1, masters=2, phd=3
le = LabelEncoder()
df['education_encoded'] = le.fit_transform(df['education'])
\`\`\`

#### 3. Scaling Features

Different scales can hurt algorithms. Standardization puts all features on the same scale.

\`\`\`python
from sklearn.preprocessing import StandardScaler

# Before: age=[25, 30, 35], salary=[50000, 75000, 100000]
# After:  age=[-1.2, 0, 1.2], salary=[-1.2, 0, 1.2]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
\`\`\`

#### 4. Handling Missing Values

\`\`\`python
# Option 1: Remove rows with missing values
df_clean = df.dropna()

# Option 2: Fill with mean/median
df['age'].fillna(df['age'].mean(), inplace=True)

# Option 3: Fill with most frequent value
df['city'].fillna(df['city'].mode()[0], inplace=True)

# Option 4: Use a model to predict missing values
from sklearn.impute import KNNImputer
imputer = KNNImputer(n_neighbors=5)
X_imputed = imputer.fit_transform(X)
\`\`\`

## Feature Selection

Not all features help. Some hurt! Feature selection finds the most useful ones.

### Why Select Features?

1. **Reduce overfitting** - Fewer features = simpler model
2. **Improve accuracy** - Remove noisy features
3. **Speed up training** - Less data to process
4. **Improve interpretability** - Understand what matters

### Methods

\`\`\`python
from sklearn.feature_selection import SelectKBest, f_classif

# Select top 5 features based on statistical tests
selector = SelectKBest(score_func=f_classif, k=5)
X_selected = selector.fit_transform(X, y)

# See which features were selected
selected_features = X.columns[selector.get_support()]
print(f"Best features: {list(selected_features)}")
\`\`\`

## The Feature Matrix

In ML, we organize data into a feature matrix (X) and label vector (y).

\`\`\`python
import numpy as np

# Feature matrix: n_samples × n_features
X = np.array([
    [1500, 3, 2, 10],  # House 1: sqft, beds, baths, age
    [2000, 4, 3, 5],   # House 2
    [1200, 2, 1, 20],  # House 3
])

# Label vector: n_samples
y = np.array([285000, 450000, 180000])  # Prices

print(f"X shape: {X.shape}")  # (3, 4) - 3 samples, 4 features
print(f"y shape: {y.shape}")  # (3,) - 3 labels
\`\`\`

## Complete Example

\`\`\`python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier

# Load data
df = pd.read_csv('customers.csv')

# Feature engineering
df['account_age_days'] = (pd.Timestamp.now() - df['signup_date']).dt.days
df['avg_order_value'] = df['total_spent'] / df['num_orders']

# Encode categorical
le = LabelEncoder()
df['membership_encoded'] = le.fit_transform(df['membership_level'])

# Select features and label
features = ['account_age_days', 'avg_order_value', 'num_orders', 'membership_encoded']
X = df[features]
y = df['churned']  # 0 = stayed, 1 = left

# Handle missing values
X = X.fillna(X.median())

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split and train
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2)
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Feature importance
for feature, importance in zip(features, model.feature_importances_):
    print(f"{feature}: {importance:.3f}")
\`\`\`

## Key Takeaways

1. **Features (X)** = inputs used for prediction
2. **Labels (y)** = output we want to predict
3. **Feature engineering** often matters more than algorithm choice
4. **Encode** categorical variables for algorithms
5. **Scale** numerical features to the same range
6. **Select** relevant features, remove noisy ones
`,
    exercises: [
      {
        id: "features-1",
        type: "MULTIPLE_CHOICE",
        difficulty: "BEGINNER",
        points: 10,
        question: "In a model predicting house prices from square footage, bedrooms, and location, which is the label?",
        options: [
          "Square footage",
          "Number of bedrooms",
          "Location",
          "House price"
        ],
        correctAnswer: 3,
        explanation: "The label (y) is what we're predicting - the house price. Square footage, bedrooms, and location are all features (X)."
      },
      {
        id: "features-2",
        type: "MULTIPLE_CHOICE",
        difficulty: "INTERMEDIATE",
        points: 15,
        question: "You have a 'color' column with values 'red', 'blue', 'green'. What's the best way to encode this for ML?",
        options: [
          "Replace with numbers: red=1, blue=2, green=3",
          "One-hot encoding: create color_red, color_blue, color_green columns",
          "Leave as text strings",
          "Delete the column"
        ],
        correctAnswer: 1,
        explanation: "One-hot encoding is best for nominal categories (no order). Using numbers like 1,2,3 implies green > blue > red, which isn't true for colors."
      },
      {
        id: "features-3",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        points: 20,
        question: "Complete the feature engineering code:",
        starterCode: `import pandas as pd
from sklearn.preprocessing import StandardScaler

df = pd.DataFrame({
    'length': [10, 20, 15],
    'width': [5, 10, 8],
    'category': ['A', 'B', 'A']
})

# Create area feature (length × width)
df['area'] = ___

# One-hot encode category
df = pd.get_dummies(df, columns=[___])

# Scale numerical features
scaler = StandardScaler()
numerical_cols = ['length', 'width', 'area']
df[numerical_cols] = scaler.fit_transform(df[___])

print(df)`,
        solution: `import pandas as pd
from sklearn.preprocessing import StandardScaler

df = pd.DataFrame({
    'length': [10, 20, 15],
    'width': [5, 10, 8],
    'category': ['A', 'B', 'A']
})

df['area'] = df['length'] * df['width']
df = pd.get_dummies(df, columns=['category'])

scaler = StandardScaler()
numerical_cols = ['length', 'width', 'area']
df[numerical_cols] = scaler.fit_transform(df[numerical_cols])

print(df)`,
        explanation: "We create area by multiplying length × width, one-hot encode 'category', and scale the numerical columns using StandardScaler."
      }
    ]
  }
];

export default chapter25Lessons;
