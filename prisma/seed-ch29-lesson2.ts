import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Seeding Chapter 29, Lesson 2: Data Preprocessing...\n");

  const section = await prisma.section.findFirst({
    where: { number: 29.1 }
  });

  if (!section) {
    throw new Error("Section 29.1 not found. Run seed-ch29-run.ts first.");
  }

  await prisma.lesson.upsert({
    where: { slug: "data-preprocessing" },
    update: {},
    create: {
      sectionId: section.id,
      number: 29.12,
      title: "Data Preprocessing: Cleaning Your Data",
      slug: "data-preprocessing",
      objectives: [
        "Handle missing values using different imputation strategies",
        "Encode categorical variables correctly",
        "Scale numerical features appropriately",
        "Understand when to use each technique",
      ],
      content: `# Data Preprocessing: The Foundation of Good Models

You've heard it before: **"Garbage in, garbage out."** In machine learning, this couldn't be more true. The quality of your preprocessing directly determines your model's ceiling. No algorithm can compensate for poorly prepared data.

## Why Preprocessing Matters

Real-world data is messy. Here's what you'll typically encounter:

| Problem | Example | Impact on Model |
|---------|---------|-----------------|
| Missing values | Customer age = NULL | Model crashes or learns wrong patterns |
| Different scales | Age (25-65) vs Income ($20K-$500K) | Model thinks income matters more |
| Text categories | "Red", "Blue", "Green" | Model can't process text |
| Outliers | Age = 200 | Skews all predictions |

**Let's fix each of these, step by step.**

---

## 1. Handling Missing Values

Missing data is everywhere. The key is understanding **why** it's missing:

### Types of Missing Data

1. **MCAR (Missing Completely at Random)**
   - No pattern to what's missing
   - Example: Survey responses lost due to a computer glitch
   - Safe to delete or impute

2. **MAR (Missing at Random)**
   - Missingness depends on other observed data
   - Example: High earners skip income questions
   - Imputation can work well

3. **MNAR (Missing Not at Random)**
   - Missingness depends on the missing value itself
   - Example: Depressed people skip mental health questions
   - Hardest to handle - may need domain expertise

### Imputation Strategies

\`\`\`python
import pandas as pd
from sklearn.impute import SimpleImputer

# Sample data with missing values
df = pd.DataFrame({
    'age': [25, None, 35, 45, 30],
    'salary': [50000, 60000, None, 80000, 55000]
})

# Strategy 1: Mean imputation (good for normal distributions)
mean_imputer = SimpleImputer(strategy='mean')
df['age_filled'] = mean_imputer.fit_transform(df[['age']])

# Strategy 2: Median imputation (robust to outliers)
median_imputer = SimpleImputer(strategy='median')
df['salary_filled'] = median_imputer.fit_transform(df[['salary']])

# Strategy 3: Mode imputation (for categorical data)
mode_imputer = SimpleImputer(strategy='most_frequent')

# Strategy 4: Constant value
constant_imputer = SimpleImputer(strategy='constant', fill_value=0)
\`\`\`

### When to Use Each Strategy

| Strategy | Best For | Avoid When |
|----------|----------|------------|
| **Mean** | Normally distributed data | Outliers present |
| **Median** | Skewed data, outliers | Very few samples |
| **Mode** | Categorical features | Many unique values |
| **Delete rows** | Very few missing (<5%) | Lots of missing data |
| **Predict missing** | Complex patterns | Small datasets |

### Advanced: Predicting Missing Values

\`\`\`python
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer

# Uses other features to predict missing values
iterative_imputer = IterativeImputer(random_state=42)
df_imputed = iterative_imputer.fit_transform(df)
\`\`\`

---

## 2. Encoding Categorical Variables

Machine learning algorithms speak one language: **numbers**. We need to translate our categories.

### Label Encoding (Binary Categories)

For yes/no, true/false, or any two-category variable:

\`\`\`python
from sklearn.preprocessing import LabelEncoder

# Binary encoding
df['purchased'] = ['Yes', 'No', 'Yes', 'No', 'Yes']
le = LabelEncoder()
df['purchased_encoded'] = le.fit_transform(df['purchased'])
# Result: Yes=1, No=0
\`\`\`

### One-Hot Encoding (Multiple Categories)

**Critical:** For 3+ categories, NEVER use simple label encoding (1, 2, 3). The model will think category 3 is "greater than" category 1!

\`\`\`python
from sklearn.preprocessing import OneHotEncoder
import pandas as pd

# Multiple categories
df['city'] = ['NYC', 'LA', 'NYC', 'Chicago', 'LA']

# Method 1: pandas get_dummies (easy)
df_encoded = pd.get_dummies(df, columns=['city'], prefix='city')
# Creates: city_NYC, city_LA, city_Chicago

# Method 2: sklearn OneHotEncoder (for pipelines)
encoder = OneHotEncoder(sparse=False, handle_unknown='ignore')
city_encoded = encoder.fit_transform(df[['city']])
\`\`\`

### The Dummy Variable Trap

When one-hot encoding, you can drop one column (it's redundant):

\`\`\`python
# If city_NYC=0 and city_LA=0, we KNOW it's Chicago
# So we only need N-1 columns for N categories
df_encoded = pd.get_dummies(df, columns=['city'], drop_first=True)
\`\`\`

---

## 3. Feature Scaling

Different features have wildly different ranges. This matters because:

1. **Distance-based algorithms** (KNN, SVM, K-means) will be dominated by large-scale features
2. **Gradient descent** converges faster with scaled features
3. **Regularization** works more fairly across features

### StandardScaler (Z-score Normalization)

Centers data around 0 with standard deviation of 1:

\`\`\`python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
df[['age_scaled', 'salary_scaled']] = scaler.fit_transform(df[['age', 'salary']])

# Formula: z = (x - mean) / std
# Result: Most values between -3 and +3
\`\`\`

**Use when:** Data is approximately normally distributed, using algorithms sensitive to magnitude (SVM, neural networks, PCA).

### MinMaxScaler (0-1 Normalization)

Scales all values to [0, 1]:

\`\`\`python
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()
df[['age_01', 'salary_01']] = scaler.fit_transform(df[['age', 'salary']])

# Formula: x' = (x - min) / (max - min)
# Result: All values between 0 and 1
\`\`\`

**Use when:** You need bounded values, neural networks with sigmoid/tanh, image pixel values.

### RobustScaler (Outlier-Resistant)

Uses median and IQR instead of mean and std:

\`\`\`python
from sklearn.preprocessing import RobustScaler

scaler = RobustScaler()
df_scaled = scaler.fit_transform(df[['age', 'salary']])

# Formula: x' = (x - median) / IQR
\`\`\`

**Use when:** Your data has outliers that you don't want to remove.

### When to Scale (and When Not To)

| Algorithm | Needs Scaling? | Why |
|-----------|---------------|-----|
| Linear/Logistic Regression | Yes* | Regularization affected |
| SVM | Yes | Distance-based |
| KNN | Yes | Distance-based |
| Decision Trees | No | Split-based, not distance |
| Random Forest | No | Ensemble of trees |
| Neural Networks | Yes | Gradient descent |
| Naive Bayes | No | Probability-based |

*Without regularization, linear regression is scale-invariant

---

## 4. Putting It All Together: The Preprocessing Pipeline

**Never preprocess training and test data separately!** Use sklearn's Pipeline:

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier

# Define column types
numeric_features = ['age', 'income', 'years_experience']
categorical_features = ['education', 'job_type', 'city']

# Numeric pipeline: impute then scale
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# Categorical pipeline: impute then encode
categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

# Combine into single preprocessor
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ])

# Create full pipeline with model
full_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier())
])

# Now training is just one line!
full_pipeline.fit(X_train, y_train)

# And prediction automatically applies all preprocessing
predictions = full_pipeline.predict(X_test)
\`\`\`

---

## Common Preprocessing Mistakes

### Mistake 1: Scaling Before Splitting
\`\`\`python
# WRONG - data leakage!
scaler.fit(X)  # Sees test data statistics
X_scaled = scaler.transform(X)
X_train, X_test = train_test_split(X_scaled)

# CORRECT
X_train, X_test = train_test_split(X)
scaler.fit(X_train)  # Only sees training data
X_train_scaled = scaler.transform(X_train)
X_test_scaled = scaler.transform(X_test)
\`\`\`

### Mistake 2: Forgetting to Save the Scaler
\`\`\`python
# In production, you need the same scaler!
import joblib

# Save with your model
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(model, 'model.pkl')

# Load for predictions
scaler = joblib.load('scaler.pkl')
model = joblib.load('model.pkl')
new_data_scaled = scaler.transform(new_data)
predictions = model.predict(new_data_scaled)
\`\`\`

### Mistake 3: Encoding Test Categories Not Seen in Training
\`\`\`python
# If test data has a city not in training, handle it!
encoder = OneHotEncoder(handle_unknown='ignore')
\`\`\`

---

## Quick Reference: Preprocessing Checklist

- [ ] Explore data first (df.info(), df.describe())
- [ ] Identify missing values (df.isnull().sum())
- [ ] Decide imputation strategy based on missingness type
- [ ] Identify categorical vs numerical features
- [ ] Encode categoricals (label for binary, one-hot for multi)
- [ ] Scale numericals if algorithm requires it
- [ ] Build a Pipeline to ensure consistency
- [ ] Split data AFTER setting up pipeline (before fitting)
- [ ] Save preprocessors with model for deployment`,
      codeExamples: JSON.stringify([
        {
          title: "Complete Preprocessing Pipeline",
          language: "python",
          code: `from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# Define transformers
numeric_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore'))
])

# Combine into preprocessor
preprocessor = ColumnTransformer([
    ('num', numeric_transformer, ['age', 'income']),
    ('cat', categorical_transformer, ['city', 'education'])
])

# Use in full pipeline
from sklearn.ensemble import RandomForestClassifier
pipeline = Pipeline([
    ('prep', preprocessor),
    ('model', RandomForestClassifier())
])

pipeline.fit(X_train, y_train)
print(f"Accuracy: {pipeline.score(X_test, y_test):.2%}")`
        }
      ]),
      keyPoints: [
        "Handle missing values based on WHY they're missing (MCAR, MAR, MNAR)",
        "Use one-hot encoding for 3+ categories to avoid implying false order",
        "Scale features for distance-based algorithms and neural networks",
        "Tree-based models (Random Forest, XGBoost) don't need scaling",
        "Always use Pipelines to prevent data leakage and ensure consistency",
        "Save your preprocessors along with your model for deployment",
      ],
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });

  console.log("✅ Lesson 2: Data Preprocessing created!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
