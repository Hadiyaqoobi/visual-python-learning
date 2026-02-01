import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏗️ Seeding Chapter 29, Lesson 6: Complete ML Project...\n");

  const section = await prisma.section.findFirst({
    where: { number: 29.1 }
  });

  if (!section) {
    throw new Error("Section 29.1 not found.");
  }

  await prisma.lesson.upsert({
    where: { slug: "complete-ml-project" },
    update: {},
    create: {
      sectionId: section.id,
      number: 29.16,
      title: "Complete ML Project: From Data to Deployment",
      slug: "complete-ml-project",
      objectives: [
        "Apply the complete ML workflow to a real problem",
        "Build a customer churn prediction model",
        "Practice all the skills from this chapter",
        "Deploy a production-ready model",
      ],
      content: `# Complete ML Project: Customer Churn Prediction

Let's put everything together and build a real machine learning project from scratch. We'll predict whether customers will leave (churn) based on their usage patterns.

## The Business Problem

**Scenario:** You work at a telecom company. Acquiring new customers costs 5-10x more than retaining existing ones. If we can predict which customers are likely to leave, we can intervene with special offers.

**Goal:** Build a model that predicts customer churn with at least 80% accuracy.

---

## Step 1: Define the Problem 🎯

Before writing any code, answer these questions:

| Question | Answer |
|----------|--------|
| What are we predicting? | Binary: Will customer churn? (Yes/No) |
| What data do we have? | Customer demographics, account info, usage |
| How will success be measured? | Accuracy, but also recall (catch churners!) |
| What's the business impact? | Each saved customer = $500/year |

\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load the data
df = pd.read_csv('telco_churn.csv')

print(f"Dataset shape: {df.shape}")
print(f"\\nChurn distribution:")
print(df['Churn'].value_counts(normalize=True))
\`\`\`

**Output:**
\`\`\`
Dataset shape: (7043, 21)
Churn distribution:
No     0.735
Yes    0.265
\`\`\`

**Insight:** 26.5% churn rate. This is imbalanced - we'll need to handle this.

---

## Step 2: Explore the Data 🔍

### Check Data Quality

\`\`\`python
# Missing values
print("Missing values:")
print(df.isnull().sum()[df.isnull().sum() > 0])

# Data types
print("\\nData types:")
print(df.dtypes.value_counts())

# Numeric summary
print("\\nNumeric summary:")
print(df.describe())
\`\`\`

### Visualize Key Patterns

\`\`\`python
# Churn by tenure
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Tenure distribution by churn
df.groupby('Churn')['tenure'].hist(ax=axes[0], alpha=0.7, bins=20)
axes[0].set_title('Tenure by Churn')
axes[0].legend(['No Churn', 'Churn'])

# Monthly charges by churn
df.boxplot(column='MonthlyCharges', by='Churn', ax=axes[1])
axes[1].set_title('Monthly Charges by Churn')

# Contract type vs churn
pd.crosstab(df['Contract'], df['Churn'], normalize='index').plot(
    kind='bar', ax=axes[2]
)
axes[2].set_title('Churn Rate by Contract Type')

plt.tight_layout()
\`\`\`

**Key Findings:**
1. New customers (low tenure) churn more often
2. Customers with higher monthly charges churn more
3. Month-to-month contracts have 3x higher churn than 2-year contracts

---

## Step 3: Preprocess the Data 🔧

\`\`\`python
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer

# Make a copy
df_processed = df.copy()

# 1. Handle missing values (TotalCharges has some blanks)
df_processed['TotalCharges'] = pd.to_numeric(
    df_processed['TotalCharges'], errors='coerce'
)
df_processed['TotalCharges'].fillna(
    df_processed['TotalCharges'].median(), inplace=True
)

# 2. Encode target variable
df_processed['Churn'] = (df_processed['Churn'] == 'Yes').astype(int)

# 3. Identify column types
numeric_cols = ['tenure', 'MonthlyCharges', 'TotalCharges']
categorical_cols = ['gender', 'Partner', 'Dependents', 'PhoneService',
                    'MultipleLines', 'InternetService', 'OnlineSecurity',
                    'OnlineBackup', 'DeviceProtection', 'TechSupport',
                    'StreamingTV', 'StreamingMovies', 'Contract',
                    'PaperlessBilling', 'PaymentMethod']

# 4. One-hot encode categorical variables
df_encoded = pd.get_dummies(df_processed, columns=categorical_cols, drop_first=True)

# 5. Scale numeric features
scaler = StandardScaler()
df_encoded[numeric_cols] = scaler.fit_transform(df_encoded[numeric_cols])

print(f"Final shape: {df_encoded.shape}")
\`\`\`

---

## Step 4: Split the Data ✂️

\`\`\`python
from sklearn.model_selection import train_test_split

# Separate features and target
X = df_encoded.drop(['Churn', 'customerID'], axis=1)
y = df_encoded['Churn']

# Stratified split (maintains class proportions)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2, 
    random_state=42,
    stratify=y  # Important for imbalanced data!
)

print(f"Training set: {X_train.shape[0]} samples")
print(f"Test set: {X_test.shape[0]} samples")
print(f"Train churn rate: {y_train.mean():.1%}")
print(f"Test churn rate: {y_test.mean():.1%}")
\`\`\`

---

## Step 5: Train Baseline Model 📊

Always start simple!

\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Train baseline
baseline = LogisticRegression(max_iter=1000, random_state=42)
baseline.fit(X_train, y_train)

# Evaluate
y_pred_baseline = baseline.predict(X_test)
print("BASELINE MODEL (Logistic Regression)")
print("=" * 40)
print(f"Accuracy: {accuracy_score(y_test, y_pred_baseline):.1%}")
print(f"\\nClassification Report:")
print(classification_report(y_test, y_pred_baseline))
\`\`\`

**Baseline Results:**
- Accuracy: 80.3%
- Precision (Churn): 65%
- Recall (Churn): 54% ← We're missing half the churners!

---

## Step 6: Try Better Models 🚀

\`\`\`python
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import cross_val_score

# Models to compare
models = {
    'Logistic Regression': LogisticRegression(max_iter=1000),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingClassifier(random_state=42),
}

# Compare with cross-validation
print("MODEL COMPARISON (5-fold CV)")
print("=" * 50)

results = {}
for name, model in models.items():
    scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
    results[name] = scores
    print(f"{name:25} {scores.mean():.3f} (+/- {scores.std()*2:.3f})")
\`\`\`

**Results:**
\`\`\`
Logistic Regression       0.803 (+/- 0.018)
Random Forest             0.789 (+/- 0.021)
Gradient Boosting         0.805 (+/- 0.016)
\`\`\`

### Tune the Best Model

\`\`\`python
from sklearn.model_selection import GridSearchCV

# Tune Gradient Boosting
param_grid = {
    'n_estimators': [50, 100, 150],
    'max_depth': [3, 5, 7],
    'learning_rate': [0.05, 0.1, 0.15],
}

grid_search = GridSearchCV(
    GradientBoostingClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1
)

grid_search.fit(X_train, y_train)

print(f"Best parameters: {grid_search.best_params_}")
print(f"Best CV score: {grid_search.best_score_:.3f}")
\`\`\`

---

## Step 7: Final Evaluation 📈

\`\`\`python
# Use the best model
best_model = grid_search.best_estimator_

# Final predictions
y_pred = best_model.predict(X_test)
y_prob = best_model.predict_proba(X_test)[:, 1]

# Comprehensive evaluation
print("FINAL MODEL EVALUATION")
print("=" * 50)
print(f"\\nAccuracy: {accuracy_score(y_test, y_pred):.1%}")
print(f"\\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['No Churn', 'Churn']))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print(f"\\nConfusion Matrix:")
print(cm)
\`\`\`

### Feature Importance

\`\`\`python
# What features matter most?
importance = pd.DataFrame({
    'feature': X.columns,
    'importance': best_model.feature_importances_
}).sort_values('importance', ascending=False)

print("\\nTop 10 Most Important Features:")
print(importance.head(10).to_string(index=False))
\`\`\`

**Top Features:**
1. tenure (how long they've been a customer)
2. MonthlyCharges
3. TotalCharges
4. Contract_Two year
5. InternetService_Fiber optic

---

## Step 8: Save & Deploy 🎉

\`\`\`python
import joblib

# Save the model and preprocessing objects
joblib.dump(best_model, 'churn_model.pkl')
joblib.dump(scaler, 'scaler.pkl')

print("Model saved successfully!")

# Example: How to use in production
def predict_churn(customer_data):
    """Predict churn probability for a new customer."""
    # Load model
    model = joblib.load('churn_model.pkl')
    scaler = joblib.load('scaler.pkl')
    
    # Preprocess (same steps as training)
    # ... preprocessing code ...
    
    # Predict
    probability = model.predict_proba(processed_data)[0][1]
    prediction = "High Risk" if probability > 0.5 else "Low Risk"
    
    return {
        'churn_probability': f"{probability:.1%}",
        'risk_level': prediction
    }

# Test it
sample_customer = X_test.iloc[0:1]
print(predict_churn(sample_customer))
\`\`\`

---

## Project Summary

| Metric | Baseline | Final Model |
|--------|----------|-------------|
| Accuracy | 80.3% | 83.7% |
| Precision (Churn) | 65% | 72% |
| Recall (Churn) | 54% | 61% |

**Business Impact:**
- We can now identify 61% of customers likely to churn
- Each intervention that saves a customer = $500/year
- If we identify 100 at-risk customers and save 50%, that's $25,000/year

---

## What You've Learned

1. ✅ Define the problem clearly before coding
2. ✅ Explore and understand your data
3. ✅ Preprocess: handle missing values, encode, scale
4. ✅ Split data properly (stratified for imbalanced data)
5. ✅ Start with a simple baseline
6. ✅ Compare multiple models with cross-validation
7. ✅ Tune hyperparameters
8. ✅ Evaluate comprehensively
9. ✅ Save and deploy

**Congratulations!** You now know the complete ML workflow used by professional data scientists.`,
      codeExamples: JSON.stringify([
        {
          title: "Complete Churn Prediction Pipeline",
          language: "python",
          code: `# Complete pipeline in one script
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report
import joblib

# 1. Load and preprocess
df = pd.read_csv('telco_churn.csv')
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df['TotalCharges'].fillna(df['TotalCharges'].median(), inplace=True)
df['Churn'] = (df['Churn'] == 'Yes').astype(int)

# 2. Encode and scale
df_encoded = pd.get_dummies(df, drop_first=True)
X = df_encoded.drop(['Churn', 'customerID'], axis=1)
y = df_encoded['Churn']

# 3. Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 4. Train with tuning
grid = GridSearchCV(
    GradientBoostingClassifier(random_state=42),
    {'n_estimators': [100, 150], 'max_depth': [3, 5]},
    cv=5, n_jobs=-1
)
grid.fit(X_train, y_train)

# 5. Evaluate
print(classification_report(y_test, grid.predict(X_test)))

# 6. Save
joblib.dump(grid.best_estimator_, 'churn_model.pkl')`
        }
      ]),
      keyPoints: [
        "Always define the business problem before coding",
        "Explore data thoroughly - visualize, check missing values, understand distributions",
        "Use stratified splits for imbalanced classification problems",
        "Start with a simple baseline model to establish a performance floor",
        "Compare multiple models using cross-validation",
        "Tune hyperparameters on the best-performing model",
        "Save both the model and preprocessing objects for deployment",
        "Consider business impact, not just accuracy metrics",
      ],
      estimatedTime: 45,
      difficulty: "INTERMEDIATE",
      order: 6,
      isPublished: true,
    },
  });

  console.log("✅ Lesson 6: Complete ML Project created!");
  console.log("\n🎉 Chapter 29 Complete! (6 lessons)");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
