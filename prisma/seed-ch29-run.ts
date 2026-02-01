import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Seeding Chapter 29: Practical ML with Scikit-Learn...\n");

  const chapter29 = await prisma.chapter.upsert({
    where: { number: 29 },
    update: {},
    create: {
      number: 29,
      title: "Practical ML with Scikit-Learn",
      description: "Master the complete machine learning workflow using Python's most popular ML library. Learn to build production-ready models from raw data to deployment.",
      objectives: [
        "Understand the end-to-end ML pipeline",
        "Master data preprocessing techniques",
        "Learn feature engineering strategies",
        "Apply hyperparameter tuning effectively",
      ],
      imageUrl: "/images/chapters/ch29-sklearn.png",
      isPublished: true,
    },
  });

  console.log("✅ Created Chapter 29:", chapter29.title);

  // Section 1: The ML Pipeline
  const section29_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter29.id, number: 29.1 } },
    update: {},
    create: {
      chapterId: chapter29.id,
      number: 29.1,
      title: "The Machine Learning Pipeline",
      description: "Understanding the complete workflow from raw data to deployed model",
      order: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "ml-pipeline-overview" },
    update: {},
    create: {
      sectionId: section29_1.id,
      number: 29.11,
      title: "The ML Pipeline: From Data to Deployment",
      slug: "ml-pipeline-overview",
      objectives: [
        "Understand each stage of the ML pipeline",
        "Know why order matters in ML workflows",
        "Recognize common pitfalls at each stage",
      ],
      content: `# The Machine Learning Pipeline

Every successful machine learning project follows a structured workflow. Understanding this pipeline is crucial because **mistakes at early stages cascade through your entire project**.

## Why Do We Need a Pipeline?

Imagine trying to build a house by randomly placing bricks. Without a structured approach, you'd end up with a mess. ML is the same - each step depends on the previous one.

**Real-world example:** A company wanted to predict customer churn. They jumped straight to training a fancy neural network without cleaning their data. The model learned that "Customer ID" predicted churn because older customers had lower IDs. Useless!

## The 8 Stages of Every ML Project

### Stage 1: Raw Data Collection 📊
Your journey begins with messy, real-world data.

**What you'll encounter:**
- Missing values (customers who skipped survey questions)
- Inconsistent formats ("$50,000" vs "50000" vs "50K")
- Different data types mixed together
- Duplicate entries
- Outliers (a 200-year-old customer?)

**Key insight:** Data is never clean. Expect to spend 60-80% of your time here.

### Stage 2: Data Preprocessing 🔧
Transform raw data into a format algorithms can understand.

**Why it matters:** Most ML algorithms can only process numbers. They can't understand "Yes"/"No" or "$50,000".

\`\`\`python
# Example: The problem with raw data
raw_data = ["$50,000", None, "Yes", 25]

# What the algorithm needs
clean_data = [50000, 35000, 1, 25]  # number, imputed, encoded, number
\`\`\`

**Common transformations:**
1. **Handle missing values** - Delete rows? Fill with mean? Predict missing values?
2. **Encode categories** - Convert "Red"/"Blue"/"Green" to numbers
3. **Scale features** - Put everything on similar ranges
4. **Handle outliers** - Cap extreme values or remove them

### Stage 3: Feature Engineering ⚙️
Create new features that help the model learn better patterns.

**Why it's powerful:** Raw features often don't capture the real relationships.

**Example:** Predicting house prices
- Raw features: \`[square_feet, bedrooms, bathrooms]\`
- Engineered: \`[square_feet, bedrooms, bathrooms, sqft_per_bedroom, bathroom_ratio, total_rooms]\`

The engineered features might reveal patterns the raw features miss!

### Stage 4: Train/Test Split ✂️
Separate your data to honestly evaluate your model.

**Critical rule:** Never let your model see test data during training!

\`\`\`python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
# 80% for training, 20% for testing
\`\`\`

**Why this matters:** If you test on training data, you're just measuring memorization, not learning.

### Stage 5: Model Training 🧠
The algorithm learns patterns from your training data.

\`\`\`python
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)  # Learning happens here!
\`\`\`

**What's happening inside:** The algorithm adjusts its internal parameters to minimize prediction errors on the training set.

### Stage 6: Evaluation 📈
Measure how well your model performs on unseen data.

\`\`\`python
from sklearn.metrics import accuracy_score, classification_report

y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2%}")
print(classification_report(y_test, y_pred))
\`\`\`

**Key metrics:**
- **Accuracy:** What percentage of predictions were correct?
- **Precision:** When we predicted positive, how often were we right?
- **Recall:** Of all actual positives, how many did we find?
- **F1 Score:** Balance between precision and recall

### Stage 7: Hyperparameter Tuning 🎛️
Optimize model settings for best performance.

**Hyperparameters vs Parameters:**
- **Parameters:** Learned from data (weights, splits)
- **Hyperparameters:** Set by you (number of trees, learning rate)

\`\`\`python
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 20, None]
}

grid_search = GridSearchCV(
    RandomForestClassifier(), 
    param_grid, 
    cv=5  # 5-fold cross-validation
)
grid_search.fit(X_train, y_train)
print(f"Best params: {grid_search.best_params_}")
\`\`\`

### Stage 8: Deployment 🚀
Put your model into production.

\`\`\`python
import joblib

# Save the model
joblib.dump(model, 'my_model.pkl')

# Load and use later
loaded_model = joblib.load('my_model.pkl')
prediction = loaded_model.predict(new_data)
\`\`\`

## The Golden Rule

**Always apply the same preprocessing to new data!**

If you scaled your training data, you must scale prediction data the same way. This is why we use pipelines:

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', RandomForestClassifier())
])

# Now scaling + prediction happens together
pipeline.fit(X_train, y_train)
pipeline.predict(X_test)  # Automatically scales!
\`\`\`

## Common Mistakes to Avoid

1. **Data leakage:** Using test data information during training
2. **Scaling before splitting:** Leads to information leakage
3. **Ignoring data quality:** Garbage in, garbage out
4. **Skipping validation:** Testing only once isn't enough
5. **Overcomplicating:** Start simple, add complexity only if needed`,
      codeExamples: JSON.stringify([
        {
          title: "Complete Pipeline Example",
          language: "python",
          code: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score

# Load your data
X, y = load_data()

# Split first!
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create pipeline (preprocessing + model together)
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier(n_estimators=100))
])

# Train
pipeline.fit(X_train, y_train)

# Evaluate
print(f"Test accuracy: {pipeline.score(X_test, y_test):.2%}")

# Cross-validation for robust estimate
cv_scores = cross_val_score(pipeline, X_train, y_train, cv=5)
print(f"CV accuracy: {cv_scores.mean():.2%} (+/- {cv_scores.std()*2:.2%})")`
        }
      ]),
      keyPoints: [
        "The ML pipeline has 8 stages: data → preprocess → engineer → split → train → evaluate → tune → deploy",
        "Order matters: always split BEFORE preprocessing to avoid data leakage",
        "Expect to spend 60-80% of time on data preparation",
        "Use sklearn Pipelines to ensure consistent preprocessing",
        "Start simple, measure, then add complexity",
      ],
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });

  // Continue with more lessons for Chapter 29...
  // (I'll create the remaining lessons with the same level of detail)

  const lessonCount = await prisma.lesson.count({ where: { section: { chapterId: chapter29.id } } });
  
  console.log("\n📊 Chapter 29 Summary:");
  console.log(`   Sections: 1 (more coming)`);
  console.log(`   Lessons: ${lessonCount}`);
  console.log("\n✅ Chapter 29 Lesson 1 seeding complete!");
  console.log("📝 This lesson includes comprehensive explanations, code examples, and practical advice.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
