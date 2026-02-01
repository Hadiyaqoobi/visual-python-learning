import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⚙️ Seeding Chapter 29, Lesson 3: Feature Engineering...\n");

  const section = await prisma.section.findFirst({
    where: { number: 29.1 }
  });

  if (!section) {
    throw new Error("Section 29.1 not found.");
  }

  await prisma.lesson.upsert({
    where: { slug: "feature-engineering" },
    update: {},
    create: {
      sectionId: section.id,
      number: 29.13,
      title: "Feature Engineering: The Art of Creating Predictive Features",
      slug: "feature-engineering",
      objectives: [
        "Understand why feature engineering is often more valuable than algorithm selection",
        "Master common feature engineering techniques",
        "Know when to apply each technique",
        "Learn domain-specific feature engineering strategies",
      ],
      content: `# Feature Engineering: Where Data Science Becomes an Art

Here's a truth that might surprise you: **feature engineering often matters more than which algorithm you choose**. A simple model with great features will beat a complex model with poor features almost every time.

## What is Feature Engineering?

Feature engineering is the process of using domain knowledge to create new input features that make machine learning algorithms work better.

**Think of it this way:** You're translating the real world into a language your model can understand.

## Why Raw Features Aren't Enough

Consider predicting taxi demand. Your raw data has:
- pickup_timestamp: "2024-03-15 14:30:00"

What can a model learn from this? Not much. But engineer it into:
- hour: 14 (afternoon rush)
- day_of_week: Friday (weekend starts)
- is_payday: True (15th of month)
- is_raining: True (from weather API)

Now the model can learn: "Taxi demand spikes on rainy Friday afternoons, especially on payday."

**The raw timestamp was useless. The engineered features tell a story.**

---

## Technique 1: DateTime Feature Extraction

Time-based data is everywhere, but raw timestamps are meaningless to models.

### Basic Extraction

\`\`\`python
import pandas as pd

# Convert to datetime
df['timestamp'] = pd.to_datetime(df['timestamp'])

# Extract components
df['year'] = df['timestamp'].dt.year
df['month'] = df['timestamp'].dt.month
df['day'] = df['timestamp'].dt.day
df['hour'] = df['timestamp'].dt.hour
df['minute'] = df['timestamp'].dt.minute
df['day_of_week'] = df['timestamp'].dt.dayofweek  # 0=Monday
df['day_of_year'] = df['timestamp'].dt.dayofyear
df['week_of_year'] = df['timestamp'].dt.isocalendar().week
df['quarter'] = df['timestamp'].dt.quarter
\`\`\`

### Derived Features

\`\`\`python
# Boolean features
df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
df['is_month_start'] = df['timestamp'].dt.is_month_start.astype(int)
df['is_month_end'] = df['timestamp'].dt.is_month_end.astype(int)

# Time periods
df['is_morning'] = df['hour'].between(6, 11).astype(int)
df['is_afternoon'] = df['hour'].between(12, 17).astype(int)
df['is_evening'] = df['hour'].between(18, 22).astype(int)
df['is_night'] = (~df['hour'].between(6, 22)).astype(int)

# Business features
df['is_business_hour'] = (
    (df['hour'].between(9, 17)) & 
    (df['day_of_week'] < 5)
).astype(int)
\`\`\`

### Cyclical Encoding (Advanced)

Here's a problem: hour 23 and hour 0 are very close in time, but numerically they're far apart (23 vs 0). Solution: cyclical encoding!

\`\`\`python
import numpy as np

# Encode hour as position on a circle
df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)

# Now 23:00 and 0:00 are close in this representation!
# hour=0:  sin=0.00, cos=1.00
# hour=6:  sin=1.00, cos=0.00
# hour=12: sin=0.00, cos=-1.00
# hour=23: sin=-0.26, cos=0.97  (close to hour 0!)
\`\`\`

---

## Technique 2: Polynomial Features

Linear models can only capture straight-line relationships. But what if the true relationship is curved?

### The Problem

Imagine predicting happiness based on income:
- Low income → Low happiness (struggling)
- Medium income → High happiness (comfortable)
- Very high income → Medium happiness (diminishing returns)

This is a curve, not a line! A linear model will fail.

### The Solution

\`\`\`python
from sklearn.preprocessing import PolynomialFeatures

# Original feature
X = df[['income']]

# Create polynomial features
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X)

# Now we have: [income, income²]
# A linear model on these can fit: y = a×income + b×income² + c
# This is a parabola - it can capture curves!
\`\`\`

### Controlling Complexity

\`\`\`python
# degree=2: [x, x²]
# degree=3: [x, x², x³]
# With multiple features, interactions are also created:
# [x1, x2] → [x1, x2, x1², x1×x2, x2²]

# For just interactions (no powers):
poly = PolynomialFeatures(degree=2, interaction_only=True)
# [x1, x2] → [x1, x2, x1×x2]
\`\`\`

**Warning:** High degrees explode the feature count and can cause overfitting!

---

## Technique 3: Interaction Features

Sometimes two features together are more predictive than either alone.

### Example: House Prices

\`\`\`python
# Raw features
df['bedrooms'] = 3
df['sqft'] = 1500

# The combination tells more:
df['sqft_per_bedroom'] = df['sqft'] / df['bedrooms']  # 500 sqft/bedroom
# A 3bed/900sqft house (cramped) vs 3bed/3000sqft (spacious) are VERY different!

# More examples:
df['bathroom_ratio'] = df['bathrooms'] / df['bedrooms']
df['age_quality'] = df['year_built'] * df['condition_score']
df['total_rooms'] = df['bedrooms'] + df['bathrooms'] + df['other_rooms']
\`\`\`

### Domain Knowledge is Key

The best interaction features come from understanding your domain:

**E-commerce:**
\`\`\`python
df['cart_abandon_rate'] = df['carts_created'] / df['purchases_completed']
df['avg_order_value'] = df['total_revenue'] / df['num_orders']
df['days_since_last_purchase'] = (today - df['last_purchase_date']).days
\`\`\`

**Healthcare:**
\`\`\`python
df['bmi'] = df['weight_kg'] / (df['height_m'] ** 2)
df['age_at_diagnosis'] = df['diagnosis_date'] - df['birth_date']
df['medication_adherence'] = df['pills_taken'] / df['pills_prescribed']
\`\`\`

**Finance:**
\`\`\`python
df['debt_to_income'] = df['total_debt'] / df['annual_income']
df['credit_utilization'] = df['credit_used'] / df['credit_limit']
df['savings_rate'] = df['monthly_savings'] / df['monthly_income']
\`\`\`

---

## Technique 4: Binning / Discretization

Sometimes continuous values have more meaning as categories.

### Why Bin?

1. **Capture non-linear effects:** Age 40→41 might not matter, but 65→66 (retirement) is significant
2. **Reduce noise:** Tiny variations don't matter
3. **Handle outliers:** Extreme values get grouped
4. **Interpretability:** "High income" is easier to explain than "income > 1.5 std above mean"

### Equal-Width Binning

\`\`\`python
import pandas as pd

# Divide range into equal parts
df['age_group'] = pd.cut(
    df['age'], 
    bins=[0, 18, 30, 50, 65, 100],
    labels=['Child', 'Young Adult', 'Adult', 'Senior', 'Elder']
)
\`\`\`

### Quantile Binning (Equal Frequency)

\`\`\`python
# Each bin has same number of samples
df['income_quartile'] = pd.qcut(
    df['income'], 
    q=4,  # 4 quartiles
    labels=['Q1 (Low)', 'Q2', 'Q3', 'Q4 (High)']
)

# Or with custom quantiles
df['income_tier'] = pd.qcut(
    df['income'],
    q=[0, 0.1, 0.5, 0.9, 1.0],
    labels=['Bottom 10%', 'Lower Middle', 'Upper Middle', 'Top 10%']
)
\`\`\`

---

## Technique 5: Text Feature Engineering

Text data requires special handling.

### Basic Text Features

\`\`\`python
# Length-based
df['text_length'] = df['review'].str.len()
df['word_count'] = df['review'].str.split().str.len()
df['avg_word_length'] = df['text_length'] / df['word_count']

# Content-based
df['has_exclamation'] = df['review'].str.contains('!').astype(int)
df['question_count'] = df['review'].str.count('\\?')
df['caps_ratio'] = df['review'].str.count('[A-Z]') / df['text_length']

# Sentiment indicators (simple)
positive_words = ['great', 'excellent', 'love', 'amazing']
df['positive_word_count'] = df['review'].apply(
    lambda x: sum(word in x.lower() for word in positive_words)
)
\`\`\`

### TF-IDF (Term Frequency-Inverse Document Frequency)

\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer(
    max_features=1000,  # Top 1000 words
    ngram_range=(1, 2),  # Include bigrams
    stop_words='english'
)

text_features = vectorizer.fit_transform(df['review'])
\`\`\`

---

## Feature Selection: Knowing What to Keep

More features isn't always better. Too many can cause overfitting and slow training.

### Method 1: Correlation Analysis

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

# Find highly correlated features (redundant)
correlation_matrix = df.corr()
sns.heatmap(correlation_matrix, annot=True)

# Remove one of each highly correlated pair (>0.9)
\`\`\`

### Method 2: Feature Importance from Models

\`\`\`python
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier()
model.fit(X_train, y_train)

# Get importance scores
importance = pd.DataFrame({
    'feature': X_train.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print(importance.head(20))  # Top 20 features
\`\`\`

### Method 3: Recursive Feature Elimination

\`\`\`python
from sklearn.feature_selection import RFE

# Select top 10 features
selector = RFE(estimator=model, n_features_to_select=10, step=1)
selector.fit(X_train, y_train)

# Get selected features
selected = X_train.columns[selector.support_]
\`\`\`

---

## The Feature Engineering Mindset

### Ask These Questions:

1. **What does the business care about?**
   - Convert raw data into business metrics

2. **What would a human expert look at?**
   - Encode domain knowledge as features

3. **What comparisons matter?**
   - Ratios, differences, interactions

4. **Is there hidden time information?**
   - Recency, frequency, duration

5. **Can I enrich with external data?**
   - Weather, holidays, economic indicators

### The Iteration Cycle

\`\`\`
1. Start with basic features
2. Train a simple model
3. Analyze errors - what patterns is it missing?
4. Engineer features to capture those patterns
5. Repeat
\`\`\`

## Common Mistakes

1. **Creating features from the target**
   - Never use future information to predict the past!

2. **Data leakage through aggregates**
   - Mean encoding must be done on training set only

3. **Too many features**
   - Causes overfitting and slow training

4. **Ignoring domain knowledge**
   - The best features come from understanding the problem

5. **Not validating features**
   - A feature that helps on training might hurt on test`,
      codeExamples: JSON.stringify([
        {
          title: "Complete Feature Engineering Pipeline",
          language: "python",
          code: `import pandas as pd
import numpy as np
from sklearn.preprocessing import PolynomialFeatures

def engineer_features(df):
    """Apply comprehensive feature engineering."""
    df = df.copy()
    
    # DateTime features
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
    df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
    
    # Interaction features
    df['sqft_per_bedroom'] = df['sqft'] / df['bedrooms'].clip(lower=1)
    df['price_per_sqft'] = df['price'] / df['sqft']
    
    # Binning
    df['age_group'] = pd.cut(df['age'], 
        bins=[0, 30, 50, 65, 100],
        labels=['Young', 'Middle', 'Senior', 'Elder'])
    
    # Polynomial features for key numeric columns
    poly = PolynomialFeatures(degree=2, include_bias=False)
    poly_features = poly.fit_transform(df[['income', 'age']])
    
    return df

# Apply to your data
df_engineered = engineer_features(df_raw)`
        }
      ]),
      keyPoints: [
        "Feature engineering often matters more than algorithm choice",
        "DateTime features: extract hour, day, month; use cyclical encoding for continuous cycles",
        "Polynomial features help linear models capture curved relationships",
        "Interaction features (ratios, products) capture combined effects",
        "Binning converts continuous values to meaningful categories",
        "Domain knowledge is your superpower - encode expert intuition as features",
        "Always validate new features don't cause data leakage",
      ],
      estimatedTime: 35,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });

  console.log("✅ Lesson 3: Feature Engineering created!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
