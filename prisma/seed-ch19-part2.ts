import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 2: Lessons 19.1.3-19.1.4 (Features and Train/Test)...\n");

  const section19_1 = await prisma.section.findFirst({ where: { number: 19.1 } });
  if (!section19_1) throw new Error("Section 19.1 not found. Run part 1 first.");

  const lesson19_1_3 = await prisma.lesson.upsert({
    where: { slug: "features-and-feature-engineering" },
    update: {},
    create: {
      sectionId: section19_1.id,
      number: 19.13,
      title: "Features and Feature Engineering",
      slug: "features-and-feature-engineering",
      objectives: [
        "Understand features and labels",
        "Extract meaningful features from data",
        "Normalize/scale features",
        "Create new features from existing ones",
      ],
      content: `# Features and Feature Engineering

## Features and Labels

**Features (X)**: Input variables used to make predictions
**Label (y)**: Output we want to predict

Example - House Price Prediction:
- Features: square feet, bedrooms, location, age
- Label: price

## Feature Types

**Numerical**: Numbers (age, price, temperature)
**Categorical**: Categories (color, country, gender)
**Binary**: Yes/no (is_spam, has_pool)

## Feature Engineering

Creating better features from raw data!

**Why it matters:**
- Good features → Good model
- "Garbage in, garbage out"
- Often more important than algorithm choice

## Common Techniques

### 1. Feature Scaling
Put features on similar scales.
- **Min-Max**: Scale to [0, 1]
- **Standardization**: Mean=0, Std=1

### 2. Feature Creation
Create new features from existing ones.
- Age from birthdate
- Price per sqft from price and sqft
- Is_weekend from date

### 3. Encoding Categories
Convert categories to numbers.
- One-hot encoding: [red, blue, green] → [1,0,0], [0,1,0], [0,0,1]
- Label encoding: red=0, blue=1, green=2

## The Importance of Scaling

Without scaling, features with large values dominate!

Example: Distance calculation
- Age: 25 vs 30 (difference: 5)
- Salary: 50000 vs 80000 (difference: 30000)

Salary dominates even though age might be more important!`,
      codeExamples: JSON.stringify([
        {
          id: "features-labels",
          title: "Features and Labels",
          code: "# Dataset: predict if someone will buy a product\ndata = [\n    # (age, income, hours_on_site, purchased)\n    (25, 50000, 2.5, True),\n    (35, 75000, 1.0, True),\n    (45, 60000, 0.5, False),\n    (22, 30000, 3.0, False),\n    (55, 90000, 0.3, True),\n]\n\n# Separate features (X) and labels (y)\nX = [(age, income, hours) for age, income, hours, _ in data]\ny = [purchased for _, _, _, purchased in data]\n\nprint('Features (X) - what we use to predict:')\nprint('  (age, income, hours_on_site)')\nfor features in X:\n    print(f'  {features}')\n\nprint('\\nLabels (y) - what we predict:')\nprint(f'  {y}')\n\nprint('\\nFeature names: age, income, hours_on_site')\nprint('Label name: purchased (True/False)')",
          description: "Separate inputs (features) from outputs (labels)",
        },
        {
          id: "feature-scaling",
          title: "Feature Scaling",
          code: "# Problem: Different scales make distance unfair\ndata = [\n    # (age, salary)\n    (25, 50000),\n    (30, 80000),\n    (35, 60000),\n]\n\nprint('Without scaling:')\nprint('  Age ranges: 25-35 (range of 10)')\nprint('  Salary ranges: 50000-80000 (range of 30000)')\nprint('  Salary dominates distance calculations!\\n')\n\n# Min-Max Scaling: (x - min) / (max - min)\ndef min_max_scale(values):\n    min_v = min(values)\n    max_v = max(values)\n    return [(v - min_v) / (max_v - min_v) for v in values]\n\nages = [d[0] for d in data]\nsalaries = [d[1] for d in data]\n\nscaled_ages = min_max_scale(ages)\nscaled_salaries = min_max_scale(salaries)\n\nprint('After Min-Max scaling (0 to 1):')\nprint('Original → Scaled')\nfor i in range(len(data)):\n    print(f'  Age {ages[i]} → {scaled_ages[i]:.2f}')\n    print(f'  Salary {salaries[i]} → {scaled_salaries[i]:.2f}')\n    print()\n\nprint('Now both features are on same scale [0, 1]!')",
          description: "Scale features to same range",
        },
        {
          id: "feature-engineering",
          title: "Creating New Features",
          code: "# Raw data about houses\nhouses = [\n    {'sqft': 1500, 'price': 300000, 'bedrooms': 3, 'year_built': 1990},\n    {'sqft': 2000, 'price': 450000, 'bedrooms': 4, 'year_built': 2005},\n    {'sqft': 1200, 'price': 250000, 'bedrooms': 2, 'year_built': 1985},\n    {'sqft': 2500, 'price': 600000, 'bedrooms': 5, 'year_built': 2015},\n]\n\nprint('Original Features:')\nfor h in houses:\n    print(f'  {h}')\n\n# Feature Engineering: Create new features!\nprint('\\nEngineered Features:')\n\ncurrent_year = 2024\nfor h in houses:\n    # Price per square foot\n    h['price_per_sqft'] = h['price'] / h['sqft']\n    \n    # Age of house\n    h['age'] = current_year - h['year_built']\n    \n    # Sqft per bedroom\n    h['sqft_per_bedroom'] = h['sqft'] / h['bedrooms']\n    \n    print(f\"  Price/sqft: ${h['price_per_sqft']:.0f}, Age: {h['age']}yrs, Sqft/bed: {h['sqft_per_bedroom']:.0f}\")\n\nprint('\\nNew features can reveal patterns!')\nprint('  - Price/sqft shows value density')\nprint('  - Age might affect price')\nprint('  - Sqft/bedroom shows spaciousness')",
          description: "Create meaningful features from raw data",
        },
      ]),
      keyPoints: [
        "Features (X) are inputs, Labels (y) are outputs",
        "Feature types: numerical, categorical, binary",
        "Scaling puts features on equal footing",
        "Min-Max scales to [0, 1]",
        "Feature engineering creates better predictors",
        "Good features matter more than fancy algorithms",
      ],
      hardwareDemo: "Watch feature extraction and transformation. See scaling normalize values.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson19_1_3.number}: ${lesson19_1_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson19_1_3.id,
        number: 1,
        title: "Separate Features and Labels",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given student data, separate features (study_hours, sleep_hours) from labels (passed).",
        starterCode: "# Student data: (study_hours, sleep_hours, passed)\nstudent_data = [\n    (5, 7, True),\n    (2, 8, False),\n    (7, 6, True),\n    (3, 9, False),\n    (6, 7, True),\n]\n\n# Separate features and labels\nX = [(study, sleep) for study, sleep, _ in student_data]\ny = [passed for _, _, passed in student_data]\n\nprint('Features (X):')\nprint('  (study_hours, sleep_hours)')\nfor features in X:\n    print(f'  {features}')\n\nprint(f'\\nLabels (y): {y}')\n\nprint(f'\\nDataset: {len(X)} samples')\nprint(f'Features per sample: {len(X[0])}')",
        solution: "student_data = [\n    (5, 7, True),\n    (2, 8, False),\n    (7, 6, True),\n    (3, 9, False),\n    (6, 7, True),\n]\n\nX = [(study, sleep) for study, sleep, _ in student_data]\ny = [passed for _, _, passed in student_data]\n\nprint('Features (X):')\nprint('  (study_hours, sleep_hours)')\nfor features in X:\n    print(f'  {features}')\n\nprint(f'\\nLabels (y): {y}')\n\nprint(f'\\nDataset: {len(X)} samples')\nprint(f'Features per sample: {len(X[0])}')\nprint('\\nX = inputs we use to predict')\nprint('y = outputs we want to predict')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "X and y separated", description: "Feature/label separation" }]),
        hints: ["X contains all but last element", "y contains only last element", "Use list comprehension"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson19_1_3.id,
        number: 2,
        title: "Min-Max Scaling",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement min-max scaling function. Scale ages [20, 30, 40, 50, 60] to [0, 1] range.",
        starterCode: "def min_max_scale(values):\n    min_val = min(values)\n    max_val = max(values)\n    scaled = []\n    for v in values:\n        scaled_v = (v - min_val) / (max_val - min_val)\n        scaled.append(scaled_v)\n    return scaled\n\nages = [20, 30, 40, 50, 60]\nscaled_ages = min_max_scale(ages)\n\nprint('Min-Max Scaling')\nprint('=' * 30)\nprint(f'Original: {ages}')\nprint(f'Min: {min(ages)}, Max: {max(ages)}')\nprint(f'\\nScaled: {scaled_ages}')\n\nprint('\\nMapping:')\nfor orig, scaled in zip(ages, scaled_ages):\n    print(f'  {orig} → {scaled:.2f}')",
        solution: "def min_max_scale(values):\n    min_val = min(values)\n    max_val = max(values)\n    scaled = []\n    for v in values:\n        scaled_v = (v - min_val) / (max_val - min_val)\n        scaled.append(scaled_v)\n    return scaled\n\nages = [20, 30, 40, 50, 60]\nscaled_ages = min_max_scale(ages)\n\nprint('Min-Max Scaling')\nprint('=' * 30)\nprint(f'Original: {ages}')\nprint(f'Min: {min(ages)}, Max: {max(ages)}')\nprint(f'\\nScaled: {scaled_ages}')\n\nprint('\\nMapping:')\nfor orig, scaled in zip(ages, scaled_ages):\n    print(f'  {orig} → {scaled:.2f}')\n\nprint('\\nFormula: (x - min) / (max - min)')\nprint('Result: all values now between 0 and 1')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Values scaled to [0, 1]", description: "Min-max scaling" }]),
        hints: ["Formula: (x - min) / (max - min)", "20 → 0, 60 → 1", "40 → 0.5 (middle)"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson19_1_3.id,
        number: 3,
        title: "Standardization (Z-score)",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement standardization: z = (x - mean) / std. Apply to [10, 20, 30, 40, 50].",
        starterCode: "import math\n\ndef standardize(values):\n    # Calculate mean\n    mean = sum(values) / len(values)\n    \n    # Calculate standard deviation\n    variance = sum((v - mean) ** 2 for v in values) / len(values)\n    std = math.sqrt(variance)\n    \n    # Standardize each value\n    standardized = [(v - mean) / std for v in values]\n    \n    return standardized, mean, std\n\ndata = [10, 20, 30, 40, 50]\nstd_data, mean, std = standardize(data)\n\nprint('Standardization (Z-score)')\nprint('=' * 40)\nprint(f'Original: {data}')\nprint(f'Mean: {mean}')\nprint(f'Std Dev: {std:.2f}')\n\nprint('\\nStandardized (z-scores):')\nfor orig, z in zip(data, std_data):\n    print(f'  {orig} → {z:.2f}')\n\nprint(f'\\nNew mean: {sum(std_data)/len(std_data):.2f}')\nprint(f'New std: {math.sqrt(sum(z**2 for z in std_data)/len(std_data)):.2f}')",
        solution: "import math\n\ndef standardize(values):\n    mean = sum(values) / len(values)\n    variance = sum((v - mean) ** 2 for v in values) / len(values)\n    std = math.sqrt(variance)\n    standardized = [(v - mean) / std for v in values]\n    return standardized, mean, std\n\ndata = [10, 20, 30, 40, 50]\nstd_data, mean, std = standardize(data)\n\nprint('Standardization (Z-score)')\nprint('=' * 40)\nprint(f'Original: {data}')\nprint(f'Mean: {mean}')\nprint(f'Std Dev: {std:.2f}')\n\nprint('\\nStandardized (z-scores):')\nfor orig, z in zip(data, std_data):\n    print(f'  {orig} → {z:.2f}')\n\nprint(f'\\nNew mean: {sum(std_data)/len(std_data):.2f}')\nprint(f'New std: {math.sqrt(sum(z**2 for z in std_data)/len(std_data)):.2f}')\nprint('\\nStandardization: mean=0, std=1')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Z-scores with mean≈0, std≈1", description: "Standardization" }]),
        hints: ["z = (x - mean) / std", "Mean becomes 0", "Std becomes 1"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson19_1_3.id,
        number: 4,
        title: "Feature Engineering",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create new features from raw data: price_per_sqft, age, rooms_per_sqft for houses.",
        starterCode: "houses = [\n    {'sqft': 1500, 'price': 300000, 'rooms': 6, 'year': 2000},\n    {'sqft': 2000, 'price': 500000, 'rooms': 8, 'year': 2010},\n    {'sqft': 1200, 'price': 200000, 'rooms': 5, 'year': 1990},\n    {'sqft': 1800, 'price': 400000, 'rooms': 7, 'year': 2005},\n]\n\ncurrent_year = 2024\n\nprint('Feature Engineering')\nprint('=' * 50)\n\nfor h in houses:\n    # Create new features\n    h['price_per_sqft'] = h['price'] / h['sqft']\n    h['age'] = current_year - h['year']\n    h['sqft_per_room'] = h['sqft'] / h['rooms']\n\nprint('\\nOriginal + Engineered Features:')\nprint(f'{\"Sqft\":>6} {\"Price\":>8} {\"$/sqft\":>7} {\"Age\":>4} {\"Sqft/room\":>10}')\nfor h in houses:\n    print(f\"{h['sqft']:>6} ${h['price']:>7,} ${h['price_per_sqft']:>6.0f} {h['age']:>4} {h['sqft_per_room']:>10.0f}\")\n\nprint('\\nNew features might be better predictors!')",
        solution: "houses = [\n    {'sqft': 1500, 'price': 300000, 'rooms': 6, 'year': 2000},\n    {'sqft': 2000, 'price': 500000, 'rooms': 8, 'year': 2010},\n    {'sqft': 1200, 'price': 200000, 'rooms': 5, 'year': 1990},\n    {'sqft': 1800, 'price': 400000, 'rooms': 7, 'year': 2005},\n]\n\ncurrent_year = 2024\n\nprint('Feature Engineering')\nprint('=' * 50)\n\nfor h in houses:\n    h['price_per_sqft'] = h['price'] / h['sqft']\n    h['age'] = current_year - h['year']\n    h['sqft_per_room'] = h['sqft'] / h['rooms']\n\nprint('\\nOriginal + Engineered Features:')\nprint(f'{\"Sqft\":>6} {\"Price\":>8} {\"$/sqft\":>7} {\"Age\":>4} {\"Sqft/room\":>10}')\nfor h in houses:\n    print(f\"{h['sqft']:>6} ${h['price']:>7,} ${h['price_per_sqft']:>6.0f} {h['age']:>4} {h['sqft_per_room']:>10.0f}\")\n\nprint('\\nNew features might be better predictors!')\nprint('  - $/sqft: value density (higher = pricier area)')\nprint('  - Age: older houses may need repairs')\nprint('  - Sqft/room: spaciousness')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Engineered features created", description: "Feature engineering" }]),
        hints: ["price_per_sqft = price / sqft", "age = current_year - year_built", "These reveal hidden patterns"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson19_1_3.id,
        number: 5,
        title: "One-Hot Encoding",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement one-hot encoding for categorical feature 'color' with values ['red', 'blue', 'green'].",
        starterCode: "def one_hot_encode(values, categories):\n    \"\"\"Convert categorical values to one-hot vectors\"\"\"\n    encoded = []\n    for value in values:\n        vector = [1 if cat == value else 0 for cat in categories]\n        encoded.append(vector)\n    return encoded\n\n# Sample data with categorical 'color' feature\ndata = [\n    {'size': 10, 'color': 'red'},\n    {'size': 15, 'color': 'blue'},\n    {'size': 12, 'color': 'green'},\n    {'size': 8, 'color': 'red'},\n    {'size': 20, 'color': 'blue'},\n]\n\ncategories = ['red', 'blue', 'green']\ncolors = [d['color'] for d in data]\nencoded_colors = one_hot_encode(colors, categories)\n\nprint('One-Hot Encoding')\nprint('=' * 40)\nprint(f'Categories: {categories}')\nprint('\\nOriginal → One-Hot Vector')\nfor color, vector in zip(colors, encoded_colors):\n    print(f'  {color:6} → {vector}')\n\nprint('\\nCombined features:')\nprint('  size, is_red, is_blue, is_green')\nfor i, d in enumerate(data):\n    print(f\"  {d['size']:4}, {encoded_colors[i]}\")",
        solution: "def one_hot_encode(values, categories):\n    encoded = []\n    for value in values:\n        vector = [1 if cat == value else 0 for cat in categories]\n        encoded.append(vector)\n    return encoded\n\ndata = [\n    {'size': 10, 'color': 'red'},\n    {'size': 15, 'color': 'blue'},\n    {'size': 12, 'color': 'green'},\n    {'size': 8, 'color': 'red'},\n    {'size': 20, 'color': 'blue'},\n]\n\ncategories = ['red', 'blue', 'green']\ncolors = [d['color'] for d in data]\nencoded_colors = one_hot_encode(colors, categories)\n\nprint('One-Hot Encoding')\nprint('=' * 40)\nprint(f'Categories: {categories}')\nprint('\\nOriginal → One-Hot Vector')\nfor color, vector in zip(colors, encoded_colors):\n    print(f'  {color:6} → {vector}')\n\nprint('\\nCombined features:')\nprint('  size, is_red, is_blue, is_green')\nfor i, d in enumerate(data):\n    print(f\"  {d['size']:4}, {encoded_colors[i]}\")\n\nprint('\\nWhy one-hot? ML algorithms need numbers!')\nprint('red=1, blue=2, green=3 implies order (wrong!)')\nprint('One-hot treats all categories equally')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Colors encoded as vectors", description: "One-hot encoding" }]),
        hints: ["One 1, rest 0s", "red → [1,0,0]", "Avoids false ordering"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 19.1.3`);

  const lesson19_1_4 = await prisma.lesson.upsert({
    where: { slug: "training-testing-data-split" },
    update: {},
    create: {
      sectionId: section19_1.id,
      number: 19.14,
      title: "Training and Testing Data Split",
      slug: "training-testing-data-split",
      objectives: [
        "Understand why we split data",
        "Implement train/test split",
        "Avoid data leakage",
        "Use appropriate split ratios",
      ],
      content: `# Training and Testing Data Split

## Why Split Data?

**Problem**: If we test on training data, we're checking if the model *memorized* answers, not if it *learned* patterns.

**Solution**: Split data into:
- **Training set**: Model learns from this
- **Test set**: Evaluate model on unseen data

## The Golden Rule

> Never use test data during training!

Test data simulates "future unseen data."

## Typical Split Ratios

| Training | Testing | When to use |
|----------|---------|-------------|
| 80% | 20% | Common default |
| 70% | 30% | Smaller datasets |
| 90% | 10% | Very large datasets |

## The Process

1. Shuffle data (randomize order)
2. Split into train/test
3. Train on training set only
4. Evaluate on test set

## Data Leakage

**Leakage**: When test data information "leaks" into training.

**Examples:**
- Scaling using test data statistics
- Feature engineering using test data
- Selecting features based on test performance

**Prevention**: Do all preprocessing on training data, then apply same transformation to test data.

## Code Pattern

\`\`\`python
# 1. Shuffle
random.shuffle(data)

# 2. Split
split_idx = int(len(data) * 0.8)
train = data[:split_idx]
test = data[split_idx:]

# 3. Train (only on train!)
model = train_model(train)

# 4. Evaluate (only on test!)
accuracy = evaluate(model, test)
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "basic-split",
          title: "Basic Train/Test Split",
          code: "import random\n\ndef train_test_split(data, test_ratio=0.2, seed=42):\n    \"\"\"Split data into training and testing sets\"\"\"\n    # Set seed for reproducibility\n    random.seed(seed)\n    \n    # Make a copy and shuffle\n    shuffled = data.copy()\n    random.shuffle(shuffled)\n    \n    # Calculate split point\n    split_idx = int(len(shuffled) * (1 - test_ratio))\n    \n    # Split\n    train = shuffled[:split_idx]\n    test = shuffled[split_idx:]\n    \n    return train, test\n\n# Sample data\ndata = [(i, 'A' if i < 50 else 'B') for i in range(100)]\n\ntrain, test = train_test_split(data, test_ratio=0.2)\n\nprint('Train/Test Split')\nprint('=' * 40)\nprint(f'Total samples: {len(data)}')\nprint(f'Training samples: {len(train)} ({len(train)/len(data)*100:.0f}%)')\nprint(f'Testing samples: {len(test)} ({len(test)/len(data)*100:.0f}%)')\n\nprint('\\nFirst 5 training samples:', train[:5])\nprint('First 5 testing samples:', test[:5])",
          description: "Basic train/test split implementation",
        },
        {
          id: "why-shuffle",
          title: "Why Shuffling Matters",
          code: "# Without shuffling: biased splits!\ndata_ordered = [\n    (1, 'spam'), (2, 'spam'), (3, 'spam'), (4, 'spam'), (5, 'spam'),\n    (6, 'ham'), (7, 'ham'), (8, 'ham'), (9, 'ham'), (10, 'ham'),\n]\n\n# Bad: No shuffle - train gets all spam, test gets all ham!\nsplit = int(len(data_ordered) * 0.8)\ntrain_bad = data_ordered[:split]\ntest_bad = data_ordered[split:]\n\nprint('WITHOUT Shuffling (BAD!):')\nprint(f'  Train labels: {[d[1] for d in train_bad]}')\nprint(f'  Test labels: {[d[1] for d in test_bad]}')\nprint('  Problem: Train has no ham, test has no spam!')\n\n# Good: With shuffle\nimport random\nrandom.seed(42)\ndata_shuffled = data_ordered.copy()\nrandom.shuffle(data_shuffled)\n\ntrain_good = data_shuffled[:split]\ntest_good = data_shuffled[split:]\n\nprint('\\nWITH Shuffling (GOOD!):')\nprint(f'  Train labels: {[d[1] for d in train_good]}')\nprint(f'  Test labels: {[d[1] for d in test_good]}')\nprint('  Both sets have mix of spam and ham!')",
          description: "Shuffling prevents biased splits",
        },
        {
          id: "full-workflow",
          title: "Complete ML Workflow with Split",
          code: "import random\n\n# Dataset: (feature, label)\ndata = [\n    (2, 'low'), (3, 'low'), (4, 'low'), (5, 'low'),\n    (6, 'medium'), (7, 'medium'), (8, 'medium'),\n    (9, 'high'), (10, 'high'), (11, 'high'),\n]\n\n# Step 1: Split\nrandom.seed(42)\nshuffled = data.copy()\nrandom.shuffle(shuffled)\nsplit = int(len(shuffled) * 0.8)\ntrain, test = shuffled[:split], shuffled[split:]\n\nprint('Step 1: Split Data')\nprint(f'  Train: {len(train)}, Test: {len(test)}')\n\n# Step 2: Train (learn from training data ONLY)\nclass_avgs = {}\nfor val, label in train:\n    if label not in class_avgs:\n        class_avgs[label] = []\n    class_avgs[label].append(val)\nfor label in class_avgs:\n    class_avgs[label] = sum(class_avgs[label]) / len(class_avgs[label])\n\nprint(f'\\nStep 2: Train Model')\nprint(f'  Learned: {class_avgs}')\n\n# Step 3: Evaluate on TEST data (unseen!)\ndef predict(value):\n    return min(class_avgs, key=lambda l: abs(class_avgs[l] - value))\n\ncorrect = sum(1 for val, label in test if predict(val) == label)\naccuracy = correct / len(test)\n\nprint(f'\\nStep 3: Evaluate on Test')\nfor val, true_label in test:\n    pred = predict(val)\n    status = '✓' if pred == true_label else '✗'\n    print(f'  {val} → Predicted: {pred}, Actual: {true_label} {status}')\n\nprint(f'\\nTest Accuracy: {accuracy*100:.0f}%')",
          description: "Complete workflow: split, train, evaluate",
        },
      ]),
      keyPoints: [
        "Split data: train (80%) and test (20%)",
        "Test data simulates unseen future data",
        "Never train on test data!",
        "Shuffle before splitting",
        "Avoid data leakage",
        "Evaluate model only on test set",
      ],
      hardwareDemo: "Watch data shuffle and split. See model trained on subset, evaluated on holdout.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 4,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson19_1_4.number}: ${lesson19_1_4.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson19_1_4.id,
        number: 1,
        title: "Implement Train/Test Split",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement train_test_split function. Split 100 samples with 20% test ratio.",
        starterCode: "import random\n\ndef train_test_split(data, test_ratio=0.2, seed=42):\n    random.seed(seed)\n    shuffled = data.copy()\n    random.shuffle(shuffled)\n    \n    split_idx = int(len(shuffled) * (1 - test_ratio))\n    \n    train = shuffled[:split_idx]\n    test = shuffled[split_idx:]\n    \n    return train, test\n\n# Create sample data\ndata = list(range(100))\n\ntrain, test = train_test_split(data, test_ratio=0.2)\n\nprint(f'Total: {len(data)}')\nprint(f'Train: {len(train)} ({len(train)/len(data)*100:.0f}%)')\nprint(f'Test: {len(test)} ({len(test)/len(data)*100:.0f}%)')\n\nprint(f'\\nTrain samples (first 10): {train[:10]}')\nprint(f'Test samples: {test}')",
        solution: "import random\n\ndef train_test_split(data, test_ratio=0.2, seed=42):\n    random.seed(seed)\n    shuffled = data.copy()\n    random.shuffle(shuffled)\n    \n    split_idx = int(len(shuffled) * (1 - test_ratio))\n    \n    train = shuffled[:split_idx]\n    test = shuffled[split_idx:]\n    \n    return train, test\n\ndata = list(range(100))\n\ntrain, test = train_test_split(data, test_ratio=0.2)\n\nprint(f'Total: {len(data)}')\nprint(f'Train: {len(train)} ({len(train)/len(data)*100:.0f}%)')\nprint(f'Test: {len(test)} ({len(test)/len(data)*100:.0f}%)')\n\nprint(f'\\nTrain samples (first 10): {train[:10]}')\nprint(f'Test samples: {test}')\nprint('\\nData is shuffled - no order bias!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "80 train, 20 test", description: "Split implemented" }]),
        hints: ["Shuffle first", "split_idx = int(len * 0.8)", "Slice at split point"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson19_1_4.id,
        number: 2,
        title: "Check Split Balance",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "After splitting, verify both train and test sets have similar class distributions.",
        starterCode: "import random\n\n# Data with two classes\ndata = [('A', i) for i in range(50)] + [('B', i) for i in range(50)]\n\nrandom.seed(42)\nrandom.shuffle(data)\n\nsplit_idx = int(len(data) * 0.8)\ntrain = data[:split_idx]\ntest = data[split_idx:]\n\n# Count classes in each set\ndef count_classes(dataset):\n    counts = {}\n    for label, _ in dataset:\n        counts[label] = counts.get(label, 0) + 1\n    return counts\n\ntrain_counts = count_classes(train)\ntest_counts = count_classes(test)\n\nprint('Class Balance Check')\nprint('=' * 40)\nprint(f'Original: 50 A, 50 B')\nprint(f'\\nTraining set ({len(train)} samples):')\nfor cls, cnt in train_counts.items():\n    print(f'  {cls}: {cnt} ({cnt/len(train)*100:.1f}%)')\n\nprint(f'\\nTest set ({len(test)} samples):')\nfor cls, cnt in test_counts.items():\n    print(f'  {cls}: {cnt} ({cnt/len(test)*100:.1f}%)')\n\nprint('\\nGood split has similar proportions in both sets!')",
        solution: "import random\n\ndata = [('A', i) for i in range(50)] + [('B', i) for i in range(50)]\n\nrandom.seed(42)\nrandom.shuffle(data)\n\nsplit_idx = int(len(data) * 0.8)\ntrain = data[:split_idx]\ntest = data[split_idx:]\n\ndef count_classes(dataset):\n    counts = {}\n    for label, _ in dataset:\n        counts[label] = counts.get(label, 0) + 1\n    return counts\n\ntrain_counts = count_classes(train)\ntest_counts = count_classes(test)\n\nprint('Class Balance Check')\nprint('=' * 40)\nprint(f'Original: 50 A, 50 B')\nprint(f'\\nTraining set ({len(train)} samples):')\nfor cls, cnt in train_counts.items():\n    print(f'  {cls}: {cnt} ({cnt/len(train)*100:.1f}%)')\n\nprint(f'\\nTest set ({len(test)} samples):')\nfor cls, cnt in test_counts.items():\n    print(f'  {cls}: {cnt} ({cnt/len(test)*100:.1f}%)')\n\nprint('\\nGood split has similar proportions in both sets!')\nprint('Shuffling helps achieve balanced splits.')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "~50% each class in both sets", description: "Balanced split" }]),
        hints: ["Count each class", "Calculate percentages", "Both should be ~50/50"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson19_1_4.id,
        number: 3,
        title: "Demonstrate Data Leakage",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Show how scaling BEFORE split causes data leakage. Compare to correct approach.",
        starterCode: "import random\n\n# Generate data\nrandom.seed(42)\ndata = [(random.randint(0, 100), 'A' if random.random() > 0.5 else 'B') for _ in range(20)]\nvalues = [d[0] for d in data]\n\nprint('Data Leakage Demonstration')\nprint('=' * 50)\n\n# WRONG: Scale using ALL data, then split\nall_min = min(values)\nall_max = max(values)\nscaled_wrong = [(v - all_min) / (all_max - all_min) for v in values]\n\nprint('\\nWRONG: Scale ALL data, then split')\nprint(f'  Used min={all_min}, max={all_max} from ALL data')\nprint('  Test data statistics leaked into training!')\n\n# Split\nsplit = int(len(data) * 0.8)\n\n# CORRECT: Split first, then scale using ONLY training stats\ntrain_values = values[:split]\ntest_values = values[split:]\n\ntrain_min = min(train_values)\ntrain_max = max(train_values)\n\nscaled_train = [(v - train_min) / (train_max - train_min) for v in train_values]\nscaled_test = [(v - train_min) / (train_max - train_min) for v in test_values]\n\nprint('\\nCORRECT: Split first, scale using TRAINING stats only')\nprint(f'  Training min={train_min}, max={train_max}')\nprint(f'  Test scaled using training statistics')\nprint('  No leakage!')",
        solution: "import random\n\nrandom.seed(42)\ndata = [(random.randint(0, 100), 'A' if random.random() > 0.5 else 'B') for _ in range(20)]\nvalues = [d[0] for d in data]\n\nprint('Data Leakage Demonstration')\nprint('=' * 50)\n\nall_min = min(values)\nall_max = max(values)\nscaled_wrong = [(v - all_min) / (all_max - all_min) for v in values]\n\nprint('\\nWRONG: Scale ALL data, then split')\nprint(f'  Used min={all_min}, max={all_max} from ALL data')\nprint('  Test data statistics leaked into training!')\n\nsplit = int(len(data) * 0.8)\n\ntrain_values = values[:split]\ntest_values = values[split:]\n\ntrain_min = min(train_values)\ntrain_max = max(train_values)\n\nscaled_train = [(v - train_min) / (train_max - train_min) for v in train_values]\nscaled_test = [(v - train_min) / (train_max - train_min) for v in test_values]\n\nprint('\\nCORRECT: Split first, scale using TRAINING stats only')\nprint(f'  Training min={train_min}, max={train_max}')\nprint(f'  Test scaled using training statistics')\nprint('  No leakage!')\nprint('\\nRule: All preprocessing uses ONLY training data!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Leakage demonstrated and fixed", description: "Data leakage" }]),
        hints: ["Wrong: use all data stats", "Right: use only train stats", "Apply train stats to test"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson19_1_4.id,
        number: 4,
        title: "Full Pipeline with Proper Split",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement complete pipeline: split → scale (train only) → train → evaluate.",
        starterCode: "import random\n\n# Data: (feature, label)\ndata = [\n    (10, 'low'), (15, 'low'), (20, 'low'), (25, 'low'),\n    (30, 'medium'), (35, 'medium'), (40, 'medium'), (45, 'medium'),\n    (50, 'high'), (55, 'high'), (60, 'high'), (65, 'high'),\n]\n\n# Step 1: Split\nrandom.seed(42)\nshuffled = data.copy()\nrandom.shuffle(shuffled)\nsplit = int(len(shuffled) * 0.75)\ntrain, test = shuffled[:split], shuffled[split:]\n\nprint('Step 1: Split')\nprint(f'  Train: {len(train)}, Test: {len(test)}')\n\n# Step 2: Scale using TRAINING data only\ntrain_vals = [d[0] for d in train]\ntrain_min, train_max = min(train_vals), max(train_vals)\n\ndef scale(value):\n    return (value - train_min) / (train_max - train_min)\n\nprint(f'\\nStep 2: Scale (train min={train_min}, max={train_max})')\n\n# Step 3: Train (learn class averages from scaled training data)\nclass_avgs = {}\nfor val, label in train:\n    scaled_val = scale(val)\n    if label not in class_avgs:\n        class_avgs[label] = []\n    class_avgs[label].append(scaled_val)\nfor label in class_avgs:\n    class_avgs[label] = sum(class_avgs[label]) / len(class_avgs[label])\n\nprint(f'\\nStep 3: Train')\nprint(f'  Class averages (scaled): {class_avgs}')\n\n# Step 4: Evaluate on test\ndef predict(value):\n    scaled = scale(value)\n    return min(class_avgs, key=lambda l: abs(class_avgs[l] - scaled))\n\ncorrect = sum(1 for val, label in test if predict(val) == label)\nprint(f'\\nStep 4: Evaluate')\nprint(f'  Test accuracy: {correct}/{len(test)} = {correct/len(test)*100:.0f}%')",
        solution: "import random\n\ndata = [\n    (10, 'low'), (15, 'low'), (20, 'low'), (25, 'low'),\n    (30, 'medium'), (35, 'medium'), (40, 'medium'), (45, 'medium'),\n    (50, 'high'), (55, 'high'), (60, 'high'), (65, 'high'),\n]\n\nrandom.seed(42)\nshuffled = data.copy()\nrandom.shuffle(shuffled)\nsplit = int(len(shuffled) * 0.75)\ntrain, test = shuffled[:split], shuffled[split:]\n\nprint('Step 1: Split')\nprint(f'  Train: {len(train)}, Test: {len(test)}')\n\ntrain_vals = [d[0] for d in train]\ntrain_min, train_max = min(train_vals), max(train_vals)\n\ndef scale(value):\n    return (value - train_min) / (train_max - train_min)\n\nprint(f'\\nStep 2: Scale (train min={train_min}, max={train_max})')\n\nclass_avgs = {}\nfor val, label in train:\n    scaled_val = scale(val)\n    if label not in class_avgs:\n        class_avgs[label] = []\n    class_avgs[label].append(scaled_val)\nfor label in class_avgs:\n    class_avgs[label] = sum(class_avgs[label]) / len(class_avgs[label])\n\nprint(f'\\nStep 3: Train')\nprint(f'  Class averages (scaled): {class_avgs}')\n\ndef predict(value):\n    scaled = scale(value)\n    return min(class_avgs, key=lambda l: abs(class_avgs[l] - scaled))\n\ncorrect = sum(1 for val, label in test if predict(val) == label)\nprint(f'\\nStep 4: Evaluate')\nprint(f'  Test accuracy: {correct}/{len(test)} = {correct/len(test)*100:.0f}%')\nprint('\\nProper pipeline: no data leakage!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Full pipeline executed", description: "Complete pipeline" }]),
        hints: ["Split first", "Scale with train stats only", "Train on train, test on test"],
        xpReward: 25,
        order: 4,
      },
      {
        lessonId: lesson19_1_4.id,
        number: 5,
        title: "Compare Different Split Ratios",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Test model accuracy with 60/40, 70/30, 80/20, 90/10 splits. Which works best?",
        starterCode: "import random\n\n# Fixed dataset\nrandom.seed(0)\ndata = [(i + random.gauss(0, 5), 'A' if i < 50 else 'B') for i in range(100)]\n\ndef run_experiment(data, train_ratio, seed):\n    random.seed(seed)\n    shuffled = data.copy()\n    random.shuffle(shuffled)\n    \n    split = int(len(shuffled) * train_ratio)\n    train, test = shuffled[:split], shuffled[split:]\n    \n    # Train: compute class means\n    class_means = {}\n    for val, label in train:\n        if label not in class_means:\n            class_means[label] = []\n        class_means[label].append(val)\n    for label in class_means:\n        class_means[label] = sum(class_means[label]) / len(class_means[label])\n    \n    # Test\n    def predict(val):\n        return min(class_means, key=lambda l: abs(class_means[l] - val))\n    \n    correct = sum(1 for val, label in test if predict(val) == label)\n    return correct / len(test) if test else 0\n\nprint('Split Ratio Comparison')\nprint('=' * 40)\nprint(f'Dataset size: {len(data)}')\nprint(f'{\"Ratio\":>10} {\"Train\":>6} {\"Test\":>6} {\"Accuracy\":>10}')\n\nfor train_pct in [60, 70, 80, 90]:\n    train_ratio = train_pct / 100\n    acc = run_experiment(data, train_ratio, seed=42)\n    train_n = int(len(data) * train_ratio)\n    test_n = len(data) - train_n\n    print(f'{train_pct}/{100-train_pct}:     {train_n:>6} {test_n:>6} {acc*100:>9.1f}%')",
        solution: "import random\n\nrandom.seed(0)\ndata = [(i + random.gauss(0, 5), 'A' if i < 50 else 'B') for i in range(100)]\n\ndef run_experiment(data, train_ratio, seed):\n    random.seed(seed)\n    shuffled = data.copy()\n    random.shuffle(shuffled)\n    \n    split = int(len(shuffled) * train_ratio)\n    train, test = shuffled[:split], shuffled[split:]\n    \n    class_means = {}\n    for val, label in train:\n        if label not in class_means:\n            class_means[label] = []\n        class_means[label].append(val)\n    for label in class_means:\n        class_means[label] = sum(class_means[label]) / len(class_means[label])\n    \n    def predict(val):\n        return min(class_means, key=lambda l: abs(class_means[l] - val))\n    \n    correct = sum(1 for val, label in test if predict(val) == label)\n    return correct / len(test) if test else 0\n\nprint('Split Ratio Comparison')\nprint('=' * 40)\nprint(f'Dataset size: {len(data)}')\nprint(f'{\"Ratio\":>10} {\"Train\":>6} {\"Test\":>6} {\"Accuracy\":>10}')\n\nfor train_pct in [60, 70, 80, 90]:\n    train_ratio = train_pct / 100\n    acc = run_experiment(data, train_ratio, seed=42)\n    train_n = int(len(data) * train_ratio)\n    test_n = len(data) - train_n\n    print(f'{train_pct}/{100-train_pct}:     {train_n:>6} {test_n:>6} {acc*100:>9.1f}%')\n\nprint('\\nTradeoff: More training → better model')\nprint('         More testing → more reliable evaluation')\nprint('         80/20 is common compromise')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Accuracies for each ratio", description: "Split ratio comparison" }]),
        hints: ["More train = better learning", "More test = reliable evaluation", "80/20 is standard"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 19.1.4`);

  console.log("\n✅ Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
