import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 1: Chapter 22 structure + Lessons 22.1.1-22.1.4...\n");

  const chapter22 = await prisma.chapter.upsert({
    where: { number: 22 },
    update: {},
    create: {
      number: 22,
      title: "Classification Methods",
      description: "Master supervised learning classification algorithms. Learn logistic regression, decision trees, random forests, and how to evaluate and compare classifiers.",
      objectives: [
        "Understand classification problem types",
        "Master evaluation metrics (precision, recall, F1)",
        "Implement logistic regression and decision trees",
        "Use ensemble methods like random forests",
        "Compare and select appropriate classifiers",
      ],
      isPublished: true,
    },
  });
  console.log(`✅ Chapter ${chapter22.number}: ${chapter22.title}`);

  const section22_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter22.id, number: 22.1 } },
    update: {},
    create: {
      chapterId: chapter22.id,
      number: 22.1,
      title: "Classification Fundamentals",
      description: "Problem types and evaluation metrics.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section22_1.number}: ${section22_1.title}`);

  const section22_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter22.id, number: 22.2 } },
    update: {},
    create: {
      chapterId: chapter22.id,
      number: 22.2,
      title: "Logistic Regression",
      description: "Linear classifier with probability outputs.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section22_2.number}: ${section22_2.title}`);

  const section22_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter22.id, number: 22.3 } },
    update: {},
    create: {
      chapterId: chapter22.id,
      number: 22.3,
      title: "Tree-Based Methods",
      description: "Decision trees and random forests.",
      order: 3,
    },
  });
  console.log(`  📂 Section ${section22_3.number}: ${section22_3.title}`);

  const section22_4 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter22.id, number: 22.4 } },
    update: {},
    create: {
      chapterId: chapter22.id,
      number: 22.4,
      title: "Model Comparison",
      description: "Comparing and selecting classifiers.",
      order: 4,
    },
  });
  console.log(`  📂 Section ${section22_4.number}: ${section22_4.title}`);

  // Lesson 22.1.1
  const lesson22_1_1 = await prisma.lesson.upsert({
    where: { slug: "classification-problem-types" },
    update: {},
    create: {
      sectionId: section22_1.id,
      number: 22.11,
      title: "Classification Problem Types",
      slug: "classification-problem-types",
      objectives: [
        "Distinguish binary vs multi-class classification",
        "Understand multi-label classification",
        "Identify classification problems in real world",
        "Know difference from regression",
      ],
      content: `# Classification Problem Types

## What is Classification?

Predicting a **categorical label** for an input.

Unlike regression (continuous output), classification outputs discrete classes.

## Binary Classification

Two possible classes: Yes/No, Spam/Ham, Sick/Healthy

**Examples**:
- Email: Spam or Not Spam
- Medical: Disease or No Disease
- Finance: Fraud or Legitimate

## Multi-Class Classification

More than two classes (mutually exclusive).

**Examples**:
- Digit recognition: 0, 1, 2, ..., 9
- Animal classification: Cat, Dog, Bird, ...
- Sentiment: Positive, Neutral, Negative

## Multi-Label Classification

Multiple labels can apply to same instance.

**Examples**:
- Movie genres: Action AND Comedy AND Sci-Fi
- Article tags: Politics AND Economy
- Image: Contains car AND person AND tree

## Classification vs Regression

| Classification | Regression |
|----------------|------------|
| Discrete output | Continuous output |
| "What category?" | "How much?" |
| Spam/Not spam | House price |
| Disease type | Temperature |`,
      codeExamples: JSON.stringify([
        {
          id: "binary-example",
          title: "Binary Classification Example",
          code: "# Binary Classification: Spam Detection\n\nemails = [\n    {'text': 'Free money! Click now!', 'label': 'spam'},\n    {'text': 'Meeting at 3pm tomorrow', 'label': 'ham'},\n    {'text': 'You won $1000000!!!', 'label': 'spam'},\n    {'text': 'Project deadline Friday', 'label': 'ham'},\n    {'text': 'Buy cheap watches', 'label': 'spam'},\n]\n\nprint('BINARY CLASSIFICATION: Spam Detection')\nprint('=' * 50)\nprint('Classes: spam, ham (not spam)')\nprint('\\nDataset:')\nfor i, email in enumerate(emails):\n    print(f'  {i+1}. [{email[\"label\"]:4}] \"{email[\"text\"][:30]}...\"')\n\nspam_count = sum(1 for e in emails if e['label'] == 'spam')\nham_count = len(emails) - spam_count\nprint(f'\\nClass distribution: {spam_count} spam, {ham_count} ham')",
          description: "Binary classification example",
        },
        {
          id: "multiclass-example",
          title: "Multi-Class Classification",
          code: "# Multi-Class Classification: Iris Flowers\n\niris_samples = [\n    {'sepal_length': 5.1, 'petal_length': 1.4, 'species': 'setosa'},\n    {'sepal_length': 7.0, 'petal_length': 4.7, 'species': 'versicolor'},\n    {'sepal_length': 6.3, 'petal_length': 6.0, 'species': 'virginica'},\n    {'sepal_length': 4.9, 'petal_length': 1.5, 'species': 'setosa'},\n    {'sepal_length': 6.4, 'petal_length': 4.5, 'species': 'versicolor'},\n]\n\nprint('MULTI-CLASS CLASSIFICATION: Iris Species')\nprint('=' * 50)\nprint('Classes: setosa, versicolor, virginica')\nprint('\\nSamples:')\nprint(f'{\"Sepal\":>8} {\"Petal\":>8} {\"Species\":>12}')\nprint('-' * 30)\nfor s in iris_samples:\n    print(f'{s[\"sepal_length\"]:>8.1f} {s[\"petal_length\"]:>8.1f} {s[\"species\"]:>12}')\n\n# Class distribution\nfrom collections import Counter\nspecies_counts = Counter(s['species'] for s in iris_samples)\nprint(f'\\nClass distribution: {dict(species_counts)}')",
          description: "Multi-class classification",
        },
        {
          id: "multilabel-example",
          title: "Multi-Label Classification",
          code: "# Multi-Label Classification: Movie Genres\n\nmovies = [\n    {'title': 'The Matrix', 'genres': ['Action', 'Sci-Fi']},\n    {'title': 'Toy Story', 'genres': ['Animation', 'Comedy', 'Family']},\n    {'title': 'Titanic', 'genres': ['Drama', 'Romance']},\n    {'title': 'Aliens', 'genres': ['Action', 'Sci-Fi', 'Horror']},\n]\n\nprint('MULTI-LABEL CLASSIFICATION: Movie Genres')\nprint('=' * 50)\nprint('Each movie can have MULTIPLE genres\\n')\n\nfor movie in movies:\n    genres_str = ', '.join(movie['genres'])\n    print(f'{movie[\"title\"]:15} → {genres_str}')\n\n# Collect all genres\nall_genres = set()\nfor m in movies:\n    all_genres.update(m['genres'])\nprint(f'\\nTotal unique genres: {len(all_genres)}')\nprint(f'Genres: {sorted(all_genres)}')",
          description: "Multi-label classification",
        },
      ]),
      keyPoints: [
        "Classification predicts categorical labels",
        "Binary: exactly 2 classes",
        "Multi-class: 3+ mutually exclusive classes",
        "Multi-label: multiple labels per instance",
        "Different from regression (continuous)",
        "Most common ML task in industry",
      ],
      hardwareDemo: "Watch class labels stored. See categorical vs continuous outputs.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson22_1_1.number}: ${lesson22_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson22_1_1.id,
        number: 1,
        title: "Identify Problem Type",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Classify each problem as binary, multi-class, multi-label, or regression.",
        starterCode: "problems = [\n    ('Predict house price', 'regression'),\n    ('Email spam or not', 'binary'),\n    ('Recognize handwritten digit 0-9', 'multiclass'),\n    ('Tag article with topics', 'multilabel'),\n    ('Customer will churn or not', 'binary'),\n    ('Predict temperature tomorrow', 'regression'),\n    ('Classify animal species', 'multiclass'),\n    ('Assign movie genres', 'multilabel'),\n]\n\nprint('CLASSIFY THE PROBLEM TYPE')\nprint('=' * 55)\nprint(f'{\"Problem\":<40} {\"Type\":<15}')\nprint('-' * 55)\nfor problem, ptype in problems:\n    print(f'{problem:<40} {ptype:<15}')",
        solution: "# Problem types identified",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Types listed", description: "Problem types" }]),
        hints: ["2 classes = binary", "3+ exclusive classes = multiclass", "Continuous = regression"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson22_1_1.id,
        number: 2,
        title: "Create Binary Dataset",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a simple binary classification dataset for pass/fail prediction.",
        starterCode: "# Binary classification: Pass/Fail based on study hours\nimport random\n\nrandom.seed(42)\n\nstudents = []\nfor _ in range(20):\n    hours = random.randint(1, 10)\n    # More hours = more likely to pass\n    passed = 'pass' if hours + random.randint(-2, 2) > 5 else 'fail'\n    students.append({'hours': hours, 'result': passed})\n\nprint('BINARY CLASSIFICATION DATASET')\nprint('=' * 40)\nprint(f'{\"Hours Studied\":>15} {\"Result\":>10}')\nprint('-' * 30)\nfor s in students[:10]:  # Show first 10\n    print(f'{s[\"hours\"]:>15} {s[\"result\"]:>10}')\nprint('... (10 more)')\n\n# Class balance\npassed = sum(1 for s in students if s['result'] == 'pass')\nfailed = len(students) - passed\nprint(f'\\nClass balance: {passed} pass, {failed} fail')",
        solution: "# Binary dataset created",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Dataset shown", description: "Binary dataset" }]),
        hints: ["Two classes only", "Track class balance", "Features predict label"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson22_1_1.id,
        number: 3,
        title: "Multi-Class Dataset",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a multi-class dataset with 3 categories.",
        starterCode: "import random\n\nrandom.seed(42)\n\n# Fruit classification based on weight and color_score\nfruits = []\nfor _ in range(30):\n    weight = random.randint(50, 300)\n    color = random.randint(1, 10)\n    \n    if weight < 100 and color > 5:\n        label = 'cherry'\n    elif weight < 200:\n        label = 'apple'\n    else:\n        label = 'melon'\n    \n    fruits.append({'weight': weight, 'color': color, 'type': label})\n\nprint('MULTI-CLASS DATASET: Fruit Classification')\nprint('=' * 50)\nprint(f'{\"Weight\":>10} {\"Color\":>10} {\"Type\":>10}')\nprint('-' * 35)\nfor f in fruits[:10]:\n    print(f'{f[\"weight\"]:>10} {f[\"color\"]:>10} {f[\"type\"]:>10}')\n\n# Class distribution\nfrom collections import Counter\ndist = Counter(f['type'] for f in fruits)\nprint(f'\\nClass distribution: {dict(dist)}')",
        solution: "# Multi-class dataset",
        testCases: JSON.stringify([{ input: "", expectedOutput: "3 classes", description: "Multi-class" }]),
        hints: ["3+ classes", "Mutually exclusive", "Check distribution"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson22_1_1.id,
        number: 4,
        title: "Multi-Label Dataset",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a multi-label dataset where each item can have multiple tags.",
        starterCode: "import random\n\nrandom.seed(42)\n\n# News articles with multiple topic tags\npossible_tags = ['politics', 'sports', 'tech', 'business', 'entertainment']\n\narticles = []\nfor i in range(10):\n    # Each article gets 1-3 random tags\n    num_tags = random.randint(1, 3)\n    tags = random.sample(possible_tags, num_tags)\n    articles.append({'id': i+1, 'tags': tags})\n\nprint('MULTI-LABEL DATASET: News Articles')\nprint('=' * 50)\nprint('Each article can have MULTIPLE tags\\n')\n\nfor article in articles:\n    tags_str = ', '.join(article['tags'])\n    print(f'Article {article[\"id\"]}: [{tags_str}]')\n\n# Tag frequency\nfrom collections import Counter\nall_tags = []\nfor a in articles:\n    all_tags.extend(a['tags'])\ntag_freq = Counter(all_tags)\nprint(f'\\nTag frequencies: {dict(tag_freq)}')",
        solution: "# Multi-label dataset",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Multiple tags per item", description: "Multi-label" }]),
        hints: ["Multiple labels allowed", "Not mutually exclusive", "Count tag frequencies"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson22_1_1.id,
        number: 5,
        title: "Classification vs Regression",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show how the same data can be used for classification vs regression.",
        starterCode: "# Same underlying data, different tasks\n\nhouses = [\n    {'sqft': 1500, 'price': 300000},\n    {'sqft': 2000, 'price': 400000},\n    {'sqft': 2500, 'price': 500000},\n    {'sqft': 1200, 'price': 250000},\n    {'sqft': 3000, 'price': 600000},\n]\n\nprint('SAME DATA, DIFFERENT TASKS')\nprint('=' * 55)\n\n# Regression: Predict exact price\nprint('\\nREGRESSION: Predict exact price')\nprint('  Input: sqft → Output: $XXX,XXX (continuous)')\nfor h in houses[:3]:\n    print(f'  {h[\"sqft\"]} sqft → ${h[\"price\"]:,}')\n\n# Classification: Predict price category\nprint('\\nCLASSIFICATION: Predict price category')\nprint('  Input: sqft → Output: budget/mid/luxury (discrete)')\nfor h in houses[:3]:\n    if h['price'] < 300000:\n        category = 'budget'\n    elif h['price'] < 500000:\n        category = 'mid-range'\n    else:\n        category = 'luxury'\n    print(f'  {h[\"sqft\"]} sqft → {category}')\n\nprint('\\n💡 Same features, different target types!')",
        solution: "# Same data, different tasks",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Both shown", description: "Class vs regression" }]),
        hints: ["Continuous = regression", "Categorical = classification", "Can convert between"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 22.1.1`);

  // Lesson 22.1.2
  const lesson22_1_2 = await prisma.lesson.upsert({
    where: { slug: "evaluation-metrics-accuracy-precision-recall" },
    update: {},
    create: {
      sectionId: section22_1.id,
      number: 22.12,
      title: "Evaluation Metrics (Accuracy, Precision, Recall)",
      slug: "evaluation-metrics-accuracy-precision-recall",
      objectives: [
        "Calculate accuracy and understand its limitations",
        "Understand precision (of predictions, how many right?)",
        "Understand recall (of actual positives, how many found?)",
        "Calculate and interpret F1 score",
      ],
      content: `# Evaluation Metrics

## Accuracy

\`\`\`
Accuracy = (Correct Predictions) / (Total Predictions)
\`\`\`

**Problem**: Misleading with imbalanced classes!
- 99% accuracy on 1% disease rate = always predict "healthy"

## Precision

\`\`\`
Precision = TP / (TP + FP)
\`\`\`

"Of all predicted positives, how many were actually positive?"

**High precision needed when**: False positives are costly
- Spam filter: Don't lose important emails!

## Recall (Sensitivity)

\`\`\`
Recall = TP / (TP + FN)
\`\`\`

"Of all actual positives, how many did we find?"

**High recall needed when**: False negatives are costly
- Disease detection: Don't miss sick patients!

## F1 Score

\`\`\`
F1 = 2 × (Precision × Recall) / (Precision + Recall)
\`\`\`

Harmonic mean of precision and recall. Balances both.

## Precision-Recall Trade-off

Increasing one often decreases the other!
- Stricter threshold → Higher precision, lower recall
- Looser threshold → Lower precision, higher recall`,
      codeExamples: JSON.stringify([
        {
          id: "accuracy-problem",
          title: "The Accuracy Problem",
          code: "# Why accuracy can be misleading\n\n# Imbalanced dataset: 95 healthy, 5 sick\ny_true = ['healthy'] * 95 + ['sick'] * 5\n\n# Model 1: Always predicts healthy\ny_pred_naive = ['healthy'] * 100\n\n# Model 2: Actually tries to detect sick\ny_pred_better = ['healthy'] * 90 + ['sick'] * 10\n# Let's say it catches 4 out of 5 sick, but has 6 false positives\n\ndef accuracy(y_true, y_pred):\n    correct = sum(1 for t, p in zip(y_true, y_pred) if t == p)\n    return correct / len(y_true)\n\nprint('THE ACCURACY PROBLEM')\nprint('=' * 50)\nprint(f'Dataset: 95 healthy, 5 sick\\n')\n\nacc_naive = accuracy(y_true, y_pred_naive)\nprint(f'Model 1 (always predict healthy):')\nprint(f'  Accuracy: {acc_naive:.1%}')\nprint(f'  ⚠️  Catches 0 out of 5 sick patients!\\n')\n\n# Simulate better model\ncorrect_better = 90 + 4  # 90 true neg + 4 true pos\nacc_better = correct_better / 100\nprint(f'Model 2 (actually tries):')\nprint(f'  Accuracy: {acc_better:.1%}')\nprint(f'  Catches 4 out of 5 sick patients!')\n\nprint('\\n💡 Model 1 has HIGHER accuracy but is USELESS!')",
          description: "Show accuracy limitations",
        },
        {
          id: "precision-recall",
          title: "Precision and Recall",
          code: "def calculate_metrics(y_true, y_pred, positive_class):\n    \"\"\"Calculate precision, recall, F1\"\"\"\n    TP = sum(1 for t, p in zip(y_true, y_pred) if t == positive_class and p == positive_class)\n    FP = sum(1 for t, p in zip(y_true, y_pred) if t != positive_class and p == positive_class)\n    FN = sum(1 for t, p in zip(y_true, y_pred) if t == positive_class and p != positive_class)\n    TN = sum(1 for t, p in zip(y_true, y_pred) if t != positive_class and p != positive_class)\n    \n    precision = TP / (TP + FP) if (TP + FP) > 0 else 0\n    recall = TP / (TP + FN) if (TP + FN) > 0 else 0\n    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0\n    \n    return TP, FP, FN, TN, precision, recall, f1\n\n# Spam detection example\ny_true = ['spam', 'ham', 'spam', 'ham', 'spam', 'ham', 'spam', 'ham', 'spam', 'ham']\ny_pred = ['spam', 'ham', 'spam', 'spam', 'ham', 'ham', 'spam', 'ham', 'spam', 'ham']\n\nTP, FP, FN, TN, precision, recall, f1 = calculate_metrics(y_true, y_pred, 'spam')\n\nprint('PRECISION AND RECALL: Spam Detection')\nprint('=' * 50)\nprint(f'True labels:  {y_true}')\nprint(f'Predictions:  {y_pred}')\nprint(f'\\nTP={TP}, FP={FP}, FN={FN}, TN={TN}')\nprint(f'\\nPrecision = TP/(TP+FP) = {TP}/({TP}+{FP}) = {precision:.2f}')\nprint(f'  \"Of predicted spam, {precision:.0%} were actually spam\"')\nprint(f'\\nRecall = TP/(TP+FN) = {TP}/({TP}+{FN}) = {recall:.2f}')\nprint(f'  \"Of actual spam, {recall:.0%} were caught\"')\nprint(f'\\nF1 Score = {f1:.2f} (harmonic mean)')",
          description: "Calculate precision and recall",
        },
        {
          id: "f1-score",
          title: "F1 Score Balances Both",
          code: "import math\n\ndef f1_score(precision, recall):\n    if precision + recall == 0:\n        return 0\n    return 2 * precision * recall / (precision + recall)\n\nprint('F1 SCORE: Balancing Precision and Recall')\nprint('=' * 55)\n\nscenarios = [\n    ('High Precision, Low Recall', 0.95, 0.30),\n    ('Low Precision, High Recall', 0.30, 0.95),\n    ('Balanced (both 0.70)', 0.70, 0.70),\n    ('Perfect', 1.00, 1.00),\n    ('One is zero', 0.80, 0.00),\n]\n\nprint(f'{\"Scenario\":<30} {\"Prec\":>8} {\"Recall\":>8} {\"F1\":>8}')\nprint('-' * 55)\n\nfor name, p, r in scenarios:\n    f1 = f1_score(p, r)\n    print(f'{name:<30} {p:>8.2f} {r:>8.2f} {f1:>8.2f}')\n\nprint('\\n💡 F1 penalizes extreme imbalance!')\nprint('   If either metric is 0, F1 = 0')\nprint('   Balanced metrics give better F1')",
          description: "F1 score calculation",
        },
      ]),
      keyPoints: [
        "Accuracy fails with imbalanced classes",
        "Precision: of predicted positives, how many correct?",
        "Recall: of actual positives, how many found?",
        "F1: harmonic mean, balances both",
        "Choose metric based on cost of errors",
        "FP costly → prioritize precision",
        "FN costly → prioritize recall",
      ],
      hardwareDemo: "Watch TP, FP, FN counts. See metrics calculated step by step.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson22_1_2.number}: ${lesson22_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson22_1_2.id,
        number: 1,
        title: "Calculate All Metrics",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given predictions and true labels, calculate accuracy, precision, recall, and F1.",
        starterCode: "y_true = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1]\ny_pred = [1, 0, 0, 1, 0, 1, 1, 0, 1, 0]\n\n# Count TP, FP, FN, TN (positive class = 1)\nTP = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)\nFP = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)\nFN = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)\nTN = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 0)\n\n# Calculate metrics\naccuracy = (TP + TN) / len(y_true)\nprecision = TP / (TP + FP) if (TP + FP) > 0 else 0\nrecall = TP / (TP + FN) if (TP + FN) > 0 else 0\nf1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0\n\nprint('CLASSIFICATION METRICS')\nprint('=' * 40)\nprint(f'TP={TP}, FP={FP}, FN={FN}, TN={TN}')\nprint(f'\\nAccuracy:  {accuracy:.2f}')\nprint(f'Precision: {precision:.2f}')\nprint(f'Recall:    {recall:.2f}')\nprint(f'F1 Score:  {f1:.2f}')",
        solution: "# All metrics calculated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Metrics shown", description: "Calculate metrics" }]),
        hints: ["Count TP, FP, FN, TN first", "Apply formulas", "Check for division by zero"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson22_1_2.id,
        number: 2,
        title: "Accuracy vs F1 on Imbalanced Data",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show why F1 is better than accuracy for imbalanced datasets.",
        starterCode: "# Imbalanced data: 90 negative, 10 positive\ny_true = [0] * 90 + [1] * 10\n\n# Model A: Always predicts negative (lazy)\ny_pred_a = [0] * 100\n\n# Model B: Tries to find positives (catches 7, but 5 false positives)\ny_pred_b = [0] * 85 + [1] * 15  # Simplified\n# Assume: 7 TP, 5 FP, 3 FN, 85 TN\n\ndef metrics(name, TP, FP, FN, TN):\n    acc = (TP + TN) / (TP + FP + FN + TN)\n    prec = TP / (TP + FP) if (TP + FP) > 0 else 0\n    rec = TP / (TP + FN) if (TP + FN) > 0 else 0\n    f1 = 2 * prec * rec / (prec + rec) if (prec + rec) > 0 else 0\n    print(f'\\n{name}:')\n    print(f'  Accuracy: {acc:.2f}')\n    print(f'  Precision: {prec:.2f}')\n    print(f'  Recall: {rec:.2f}')\n    print(f'  F1: {f1:.2f}')\n\nprint('ACCURACY vs F1 ON IMBALANCED DATA')\nprint('=' * 50)\nprint('Dataset: 90 negative, 10 positive')\n\n# Model A: 0 TP, 0 FP, 10 FN, 90 TN\nmetrics('Model A (always negative)', 0, 0, 10, 90)\nprint('  ⚠️ High accuracy but F1=0 (useless!)')\n\n# Model B: 7 TP, 5 FP, 3 FN, 85 TN\nmetrics('Model B (tries to find positives)', 7, 5, 3, 85)\nprint('  ✓ Lower accuracy but meaningful F1')",
        solution: "# F1 reveals true performance",
        testCases: JSON.stringify([{ input: "", expectedOutput: "F1 better indicator", description: "Accuracy vs F1" }]),
        hints: ["Model A has 0 positives", "F1=0 when TP=0", "Accuracy can be misleading"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson22_1_2.id,
        number: 3,
        title: "Precision vs Recall Trade-off",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show how changing the threshold affects precision and recall.",
        starterCode: "import random\n\n# Simulated model scores (higher = more likely positive)\nrandom.seed(42)\nscores = [(random.random(), 1 if random.random() < 0.3 else 0) for _ in range(100)]\n\ndef evaluate_threshold(scores, threshold):\n    TP = sum(1 for s, y in scores if s >= threshold and y == 1)\n    FP = sum(1 for s, y in scores if s >= threshold and y == 0)\n    FN = sum(1 for s, y in scores if s < threshold and y == 1)\n    \n    precision = TP / (TP + FP) if (TP + FP) > 0 else 0\n    recall = TP / (TP + FN) if (TP + FN) > 0 else 0\n    return precision, recall\n\nprint('PRECISION-RECALL TRADE-OFF')\nprint('=' * 50)\nprint(f'{\"Threshold\":>10} {\"Precision\":>12} {\"Recall\":>12}')\nprint('-' * 35)\n\nfor thresh in [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]:\n    p, r = evaluate_threshold(scores, thresh)\n    print(f'{thresh:>10.1f} {p:>12.2f} {r:>12.2f}')\n\nprint('\\n↑ Higher threshold → Higher precision, lower recall')\nprint('↓ Lower threshold → Lower precision, higher recall')",
        solution: "# Threshold affects both metrics",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Trade-off shown", description: "P-R trade-off" }]),
        hints: ["Higher threshold = stricter", "Precision increases with threshold", "Recall decreases"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson22_1_2.id,
        number: 4,
        title: "Choose the Right Metric",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "For different scenarios, decide whether to prioritize precision or recall.",
        starterCode: "scenarios = [\n    {\n        'task': 'Cancer screening',\n        'priority': 'recall',\n        'reason': 'Missing cancer (FN) is life-threatening',\n        'acceptable_tradeoff': 'Some false alarms (FP) are OK'\n    },\n    {\n        'task': 'Spam filter',\n        'priority': 'precision',\n        'reason': 'Losing important email (FP) is bad',\n        'acceptable_tradeoff': 'Missing some spam (FN) is tolerable'\n    },\n    {\n        'task': 'Credit card fraud',\n        'priority': 'recall',\n        'reason': 'Missing fraud (FN) costs money',\n        'acceptable_tradeoff': 'Blocking legitimate transactions (FP) is annoying but OK'\n    },\n    {\n        'task': 'Job applicant screening',\n        'priority': 'recall',\n        'reason': 'Missing good candidates (FN) hurts hiring',\n        'acceptable_tradeoff': 'Interview some unsuitable candidates (FP)'\n    },\n]\n\nprint('CHOOSING THE RIGHT METRIC')\nprint('=' * 60)\n\nfor s in scenarios:\n    print(f'\\n📋 {s[\"task\"]}')\n    print(f'   Priority: {s[\"priority\"].upper()}')\n    print(f'   Why: {s[\"reason\"]}')\n    print(f'   Trade-off: {s[\"acceptable_tradeoff\"]}')",
        solution: "# Context determines metric",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Priorities explained", description: "Choose metric" }]),
        hints: ["FN costly → recall", "FP costly → precision", "Think about consequences"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson22_1_2.id,
        number: 5,
        title: "Metrics Function",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a reusable function that calculates all classification metrics.",
        starterCode: "def classification_report(y_true, y_pred, positive_label=1):\n    \"\"\"Calculate and display all classification metrics\"\"\"\n    # Count outcomes\n    TP = sum(1 for t, p in zip(y_true, y_pred) if t == positive_label and p == positive_label)\n    FP = sum(1 for t, p in zip(y_true, y_pred) if t != positive_label and p == positive_label)\n    FN = sum(1 for t, p in zip(y_true, y_pred) if t == positive_label and p != positive_label)\n    TN = sum(1 for t, p in zip(y_true, y_pred) if t != positive_label and p != positive_label)\n    \n    # Metrics\n    accuracy = (TP + TN) / len(y_true)\n    precision = TP / (TP + FP) if (TP + FP) > 0 else 0\n    recall = TP / (TP + FN) if (TP + FN) > 0 else 0\n    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0\n    specificity = TN / (TN + FP) if (TN + FP) > 0 else 0\n    \n    return {\n        'TP': TP, 'FP': FP, 'FN': FN, 'TN': TN,\n        'accuracy': accuracy,\n        'precision': precision,\n        'recall': recall,\n        'f1': f1,\n        'specificity': specificity\n    }\n\n# Test\ny_true = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0]\ny_pred = [1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0]\n\nreport = classification_report(y_true, y_pred)\n\nprint('CLASSIFICATION REPORT')\nprint('=' * 40)\nprint(f'Confusion Matrix:')\nprint(f'  TP={report[\"TP\"]:2d}  FP={report[\"FP\"]:2d}')\nprint(f'  FN={report[\"FN\"]:2d}  TN={report[\"TN\"]:2d}')\nprint(f'\\nMetrics:')\nfor metric in ['accuracy', 'precision', 'recall', 'f1', 'specificity']:\n    print(f'  {metric:12}: {report[metric]:.3f}')",
        solution: "# Comprehensive metrics function",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All metrics", description: "Metrics function" }]),
        hints: ["Count all four outcomes", "Handle division by zero", "Return dictionary"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 22.1.2`);

  // Lesson 22.1.3
  const lesson22_1_3 = await prisma.lesson.upsert({
    where: { slug: "confusion-matrix-classification" },
    update: {},
    create: {
      sectionId: section22_1.id,
      number: 22.13,
      title: "Confusion Matrix",
      slug: "confusion-matrix-classification",
      objectives: [
        "Understand the confusion matrix structure",
        "Read and interpret confusion matrices",
        "Calculate metrics from confusion matrix",
        "Handle multi-class confusion matrices",
      ],
      content: `# Confusion Matrix

## What Is It?

A table showing predicted vs actual class labels.

## Binary Confusion Matrix

|                | Predicted Positive | Predicted Negative |
|----------------|--------------------|--------------------|
| Actual Positive | TP (True Positive) | FN (False Negative)|
| Actual Negative | FP (False Positive)| TN (True Negative) |

## Reading the Matrix

- **TP**: Correctly identified positives
- **TN**: Correctly identified negatives
- **FP**: Type I error (false alarm)
- **FN**: Type II error (missed detection)

## Deriving Metrics

\`\`\`
Accuracy = (TP + TN) / Total
Precision = TP / (TP + FP)
Recall = TP / (TP + FN)
Specificity = TN / (TN + FP)
\`\`\`

## Multi-Class Matrix

For N classes, an N×N matrix where:
- Rows = actual classes
- Columns = predicted classes
- Diagonal = correct predictions
- Off-diagonal = errors`,
      codeExamples: JSON.stringify([
        {
          id: "build-confusion",
          title: "Build Confusion Matrix",
          code: "def confusion_matrix(y_true, y_pred, labels):\n    \"\"\"Build confusion matrix from predictions\"\"\"\n    n = len(labels)\n    matrix = [[0] * n for _ in range(n)]\n    label_to_idx = {label: i for i, label in enumerate(labels)}\n    \n    for true, pred in zip(y_true, y_pred):\n        i = label_to_idx[true]\n        j = label_to_idx[pred]\n        matrix[i][j] += 1\n    \n    return matrix\n\ndef print_matrix(matrix, labels):\n    \"\"\"Pretty print confusion matrix\"\"\"\n    print('\\nConfusion Matrix:')\n    print('Actual \\\\ Predicted', end='')\n    for label in labels:\n        print(f'{label:>8}', end='')\n    print()\n    \n    for i, row in enumerate(matrix):\n        print(f'{labels[i]:<18}', end='')\n        for val in row:\n            print(f'{val:>8}', end='')\n        print()\n\n# Binary example\ny_true = ['spam', 'ham', 'spam', 'spam', 'ham', 'ham', 'spam', 'ham']\ny_pred = ['spam', 'ham', 'ham', 'spam', 'spam', 'ham', 'spam', 'ham']\n\nlabels = ['spam', 'ham']\nmatrix = confusion_matrix(y_true, y_pred, labels)\n\nprint('BINARY CONFUSION MATRIX')\nprint('=' * 40)\nprint_matrix(matrix, labels)\n\nTP, FN = matrix[0]  # spam row\nFP, TN = matrix[1]  # ham row\nprint(f'\\nTP={TP}, FN={FN}, FP={FP}, TN={TN}')",
          description: "Build and display confusion matrix",
        },
        {
          id: "multiclass-confusion",
          title: "Multi-Class Confusion Matrix",
          code: "# Multi-class: Iris species\ny_true = ['setosa', 'versicolor', 'virginica', 'setosa', 'versicolor',\n          'virginica', 'setosa', 'versicolor', 'virginica', 'setosa']\ny_pred = ['setosa', 'versicolor', 'versicolor', 'setosa', 'virginica',\n          'virginica', 'setosa', 'versicolor', 'versicolor', 'setosa']\n\nlabels = ['setosa', 'versicolor', 'virginica']\n\n# Build matrix\nmatrix = [[0] * 3 for _ in range(3)]\nlabel_idx = {l: i for i, l in enumerate(labels)}\n\nfor t, p in zip(y_true, y_pred):\n    matrix[label_idx[t]][label_idx[p]] += 1\n\nprint('MULTI-CLASS CONFUSION MATRIX')\nprint('=' * 50)\nprint('\\n          Predicted')\nprint(f'{\"\":12}', end='')\nfor l in labels:\n    print(f'{l[:4]:>10}', end='')\nprint('\\nActual')\n\nfor i, row in enumerate(matrix):\n    print(f'{labels[i]:12}', end='')\n    for val in row:\n        print(f'{val:>10}', end='')\n    print()\n\n# Diagonal = correct\ncorrect = sum(matrix[i][i] for i in range(3))\ntotal = sum(sum(row) for row in matrix)\nprint(f'\\nOverall accuracy: {correct}/{total} = {correct/total:.1%}')",
          description: "Multi-class confusion matrix",
        },
        {
          id: "matrix-to-metrics",
          title: "Metrics from Matrix",
          code: "# Extract all metrics from confusion matrix\n\nmatrix = [\n    [45, 5],   # spam: 45 TP, 5 FN\n    [10, 40],  # ham: 10 FP, 40 TN\n]\nlabels = ['spam (positive)', 'ham (negative)']\n\nTP = matrix[0][0]\nFN = matrix[0][1]\nFP = matrix[1][0]\nTN = matrix[1][1]\n\nprint('METRICS FROM CONFUSION MATRIX')\nprint('=' * 45)\nprint('Matrix:')\nprint(f'  Spam:  [{TP:3d}, {FN:3d}]  (TP, FN)')\nprint(f'  Ham:   [{FP:3d}, {TN:3d}]  (FP, TN)')\n\ntotal = TP + FP + FN + TN\naccuracy = (TP + TN) / total\nprecision = TP / (TP + FP)\nrecall = TP / (TP + FN)\nspecificity = TN / (TN + FP)\nf1 = 2 * precision * recall / (precision + recall)\n\nprint(f'\\nMetrics:')\nprint(f'  Accuracy:    (TP+TN)/Total = ({TP}+{TN})/{total} = {accuracy:.3f}')\nprint(f'  Precision:   TP/(TP+FP) = {TP}/({TP}+{FP}) = {precision:.3f}')\nprint(f'  Recall:      TP/(TP+FN) = {TP}/({TP}+{FN}) = {recall:.3f}')\nprint(f'  Specificity: TN/(TN+FP) = {TN}/({TN}+{FP}) = {specificity:.3f}')\nprint(f'  F1 Score:    {f1:.3f}')",
          description: "Calculate metrics from matrix",
        },
      ]),
      keyPoints: [
        "Rows = actual, columns = predicted",
        "Diagonal = correct predictions",
        "Off-diagonal = errors",
        "TP, TN are good; FP, FN are errors",
        "All metrics derivable from matrix",
        "Multi-class: N×N matrix",
      ],
      hardwareDemo: "Watch matrix fill up. See counts increment for each prediction.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson22_1_3.number}: ${lesson22_1_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson22_1_3.id,
        number: 1,
        title: "Build Binary Confusion Matrix",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a confusion matrix from predictions.",
        starterCode: "y_true = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0]\ny_pred = [1, 0, 0, 1, 1, 0, 1, 0, 1, 0]\n\n# Build 2x2 matrix\nmatrix = [[0, 0], [0, 0]]\n\nfor t, p in zip(y_true, y_pred):\n    matrix[1-t][1-p] += 1  # Flip for standard format\n\n# Actually let's do it clearly\nTP = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)\nFN = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)\nFP = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)\nTN = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 0)\n\nprint('CONFUSION MATRIX')\nprint('=' * 35)\nprint('              Predicted')\nprint('               1     0')\nprint(f'Actual 1    [{TP:3d}] [{FN:3d}]  (TP, FN)')\nprint(f'       0    [{FP:3d}] [{TN:3d}]  (FP, TN)')",
        solution: "# Matrix built from counts",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Matrix displayed", description: "Build matrix" }]),
        hints: ["Count each combination", "TP: both 1", "TN: both 0"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson22_1_3.id,
        number: 2,
        title: "Interpret Confusion Matrix",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given a confusion matrix, extract metrics and interpret results.",
        starterCode: "# Given confusion matrix for disease detection\n# Rows: Actual (Sick, Healthy)\n# Cols: Predicted (Sick, Healthy)\n\nmatrix = [\n    [85, 15],   # Sick: 85 correctly identified, 15 missed\n    [20, 180],  # Healthy: 20 false alarms, 180 correct\n]\n\nTP, FN = matrix[0]  # Sick row\nFP, TN = matrix[1]  # Healthy row\n\nprint('INTERPRETING CONFUSION MATRIX')\nprint('=' * 50)\nprint('Disease Detection Results:')\nprint(f'  True Positives (caught sick): {TP}')\nprint(f'  False Negatives (missed sick): {FN} ← DANGEROUS!')\nprint(f'  False Positives (false alarm): {FP}')\nprint(f'  True Negatives (correct healthy): {TN}')\n\nrecall = TP / (TP + FN)\nprint(f'\\nRecall (sensitivity): {recall:.1%}')\nprint(f'  We catch {recall:.0%} of sick patients')\nprint(f'  We miss {FN} out of {TP+FN} sick patients')\n\nspecificity = TN / (TN + FP)\nprint(f'\\nSpecificity: {specificity:.1%}')\nprint(f'  We correctly clear {specificity:.0%} of healthy patients')",
        solution: "# Interpret matrix for medical context",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Interpretation shown", description: "Interpret matrix" }]),
        hints: ["Extract TP, FN, FP, TN", "Calculate key metrics", "Interpret in context"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson22_1_3.id,
        number: 3,
        title: "Multi-Class Confusion Matrix",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Build and analyze a 3-class confusion matrix.",
        starterCode: "# Animal classification: cat, dog, bird\ny_true = ['cat', 'dog', 'bird', 'cat', 'dog', 'bird', 'cat', 'dog', 'cat', 'bird']\ny_pred = ['cat', 'cat', 'bird', 'cat', 'dog', 'dog', 'dog', 'dog', 'cat', 'bird']\n\nlabels = ['cat', 'dog', 'bird']\nlabel_idx = {l: i for i, l in enumerate(labels)}\n\n# Build 3x3 matrix\nmatrix = [[0]*3 for _ in range(3)]\nfor t, p in zip(y_true, y_pred):\n    matrix[label_idx[t]][label_idx[p]] += 1\n\nprint('MULTI-CLASS CONFUSION MATRIX')\nprint('=' * 45)\nprint('\\n         Predicted')\nprint(f'{\"\":8}', end='')\nfor l in labels:\n    print(f'{l:>8}', end='')\nprint('\\nActual')\nfor i, row in enumerate(matrix):\n    print(f'{labels[i]:8}', end='')\n    for val in row:\n        print(f'{val:>8}', end='')\n    print()\n\n# Per-class accuracy\nprint('\\nPer-class recall:')\nfor i, label in enumerate(labels):\n    total_actual = sum(matrix[i])\n    correct = matrix[i][i]\n    recall = correct / total_actual if total_actual > 0 else 0\n    print(f'  {label}: {correct}/{total_actual} = {recall:.0%}')",
        solution: "# 3-class matrix with per-class metrics",
        testCases: JSON.stringify([{ input: "", expectedOutput: "3x3 matrix", description: "Multi-class matrix" }]),
        hints: ["Build N×N matrix", "Diagonal = correct", "Calculate per-class recall"],
        xpReward: 25,
        order: 3,
      },
      {
        lessonId: lesson22_1_3.id,
        number: 4,
        title: "Normalize Confusion Matrix",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Normalize a confusion matrix by rows (actual classes).",
        starterCode: "# Raw confusion matrix\nmatrix = [\n    [90, 10],\n    [30, 70],\n]\nlabels = ['positive', 'negative']\n\nprint('NORMALIZED CONFUSION MATRIX')\nprint('=' * 45)\n\nprint('\\nRaw counts:')\nfor i, row in enumerate(matrix):\n    print(f'  {labels[i]}: {row}')\n\n# Normalize by row (each row sums to 1)\nnormalized = []\nfor row in matrix:\n    total = sum(row)\n    normalized.append([val / total for val in row])\n\nprint('\\nNormalized (proportions):')\nprint('              Predicted')\nprint(f'{\"\":12} {\"Pos\":>8} {\"Neg\":>8}')\nprint('Actual')\nfor i, row in enumerate(normalized):\n    print(f'{labels[i]:12}', end='')\n    for val in row:\n        print(f'{val:>8.1%}', end='')\n    print()\n\nprint('\\nInterpretation:')\nprint(f'  {normalized[0][0]:.0%} of actual positives predicted correctly (recall)')\nprint(f'  {normalized[1][1]:.0%} of actual negatives predicted correctly (specificity)')",
        solution: "# Normalized shows proportions",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Percentages shown", description: "Normalize matrix" }]),
        hints: ["Divide each row by row sum", "Each row sums to 100%", "Shows recall per class"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson22_1_3.id,
        number: 5,
        title: "Complete Matrix Analysis",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Given a confusion matrix, calculate all possible metrics.",
        starterCode: "def analyze_confusion_matrix(matrix, labels):\n    \"\"\"Complete analysis of binary confusion matrix\"\"\"\n    TP, FN = matrix[0]\n    FP, TN = matrix[1]\n    total = TP + FN + FP + TN\n    \n    metrics = {\n        'accuracy': (TP + TN) / total,\n        'precision': TP / (TP + FP) if (TP + FP) > 0 else 0,\n        'recall': TP / (TP + FN) if (TP + FN) > 0 else 0,\n        'specificity': TN / (TN + FP) if (TN + FP) > 0 else 0,\n        'NPV': TN / (TN + FN) if (TN + FN) > 0 else 0,  # Negative predictive value\n        'FPR': FP / (FP + TN) if (FP + TN) > 0 else 0,  # False positive rate\n        'FNR': FN / (FN + TP) if (FN + TP) > 0 else 0,  # False negative rate\n    }\n    metrics['f1'] = 2 * metrics['precision'] * metrics['recall'] / (metrics['precision'] + metrics['recall']) if (metrics['precision'] + metrics['recall']) > 0 else 0\n    \n    return metrics, TP, FP, FN, TN\n\n# Test\nmatrix = [[80, 20], [15, 85]]  # [TP, FN], [FP, TN]\nlabels = ['positive', 'negative']\n\nmetrics, TP, FP, FN, TN = analyze_confusion_matrix(matrix, labels)\n\nprint('COMPLETE CONFUSION MATRIX ANALYSIS')\nprint('=' * 50)\nprint(f'\\nMatrix: TP={TP}, FN={FN}, FP={FP}, TN={TN}')\nprint(f'\\nAll metrics:')\nfor name, value in metrics.items():\n    print(f'  {name:15}: {value:.3f}')",
        solution: "# All metrics from matrix",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All metrics", description: "Complete analysis" }]),
        hints: ["Extract all four values", "Calculate each metric", "Include NPV, FPR, FNR"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 22.1.3`);

  // Lesson 22.1.4
  const lesson22_1_4 = await prisma.lesson.upsert({
    where: { slug: "roc-curves-auc" },
    update: {},
    create: {
      sectionId: section22_1.id,
      number: 22.14,
      title: "ROC Curves and AUC",
      slug: "roc-curves-auc",
      objectives: [
        "Understand ROC curve construction",
        "Calculate TPR and FPR at different thresholds",
        "Interpret AUC (Area Under Curve)",
        "Compare classifiers using ROC",
      ],
      content: `# ROC Curves and AUC

## What Is an ROC Curve?

**R**eceiver **O**perating **C**haracteristic curve.

Plots True Positive Rate (TPR) vs False Positive Rate (FPR) at all thresholds.

## The Axes

- **Y-axis**: TPR = Recall = TP / (TP + FN)
- **X-axis**: FPR = FP / (FP + TN) = 1 - Specificity

## Building the Curve

1. Sort predictions by confidence
2. At each threshold, calculate TPR and FPR
3. Plot all (FPR, TPR) points

## AUC: Area Under the Curve

- **AUC = 0.5**: Random guessing (diagonal line)
- **AUC = 1.0**: Perfect classifier
- **AUC > 0.8**: Generally considered good
- **AUC < 0.7**: Poor performance

## Why ROC Is Useful

- Threshold-independent evaluation
- Works with imbalanced classes
- Easy to compare models
- Shows trade-off at all points

## Interpretation

- Curve hugging top-left = good
- Curve on diagonal = random
- Curve below diagonal = worse than random`,
      codeExamples: JSON.stringify([
        {
          id: "build-roc",
          title: "Build ROC Curve Points",
          code: "def calculate_roc_points(y_true, y_scores):\n    \"\"\"Calculate ROC curve points\"\"\"\n    # Sort by scores descending\n    sorted_pairs = sorted(zip(y_scores, y_true), reverse=True)\n    \n    total_pos = sum(y_true)\n    total_neg = len(y_true) - total_pos\n    \n    points = [(0, 0)]  # Start at origin\n    tp = 0\n    fp = 0\n    \n    for score, label in sorted_pairs:\n        if label == 1:\n            tp += 1\n        else:\n            fp += 1\n        \n        tpr = tp / total_pos if total_pos > 0 else 0\n        fpr = fp / total_neg if total_neg > 0 else 0\n        points.append((fpr, tpr))\n    \n    return points\n\n# Example: model confidence scores\ny_true = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0]\ny_scores = [0.9, 0.4, 0.8, 0.7, 0.3, 0.2, 0.6, 0.5, 0.85, 0.35]\n\npoints = calculate_roc_points(y_true, y_scores)\n\nprint('ROC CURVE POINTS')\nprint('=' * 40)\nprint(f'{\"FPR\":>8} {\"TPR\":>8}')\nprint('-' * 20)\nfor fpr, tpr in points[::2]:  # Show every other point\n    print(f'{fpr:>8.2f} {tpr:>8.2f}')\nprint(f'... ({len(points)} total points)')",
          description: "Calculate ROC curve points",
        },
        {
          id: "calculate-auc",
          title: "Calculate AUC",
          code: "def calculate_auc(points):\n    \"\"\"Calculate area under ROC curve using trapezoidal rule\"\"\"\n    auc = 0\n    for i in range(1, len(points)):\n        x1, y1 = points[i-1]\n        x2, y2 = points[i]\n        # Trapezoid area\n        auc += (x2 - x1) * (y1 + y2) / 2\n    return auc\n\n# Good model\ny_true_good = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0]\ny_scores_good = [0.95, 0.2, 0.9, 0.85, 0.1, 0.15, 0.8, 0.3, 0.88, 0.25]\n\n# Random model\nimport random\nrandom.seed(42)\ny_scores_random = [random.random() for _ in range(10)]\n\ndef roc_points(y_true, y_scores):\n    sorted_pairs = sorted(zip(y_scores, y_true), reverse=True)\n    total_pos = sum(y_true)\n    total_neg = len(y_true) - total_pos\n    points = [(0, 0)]\n    tp = fp = 0\n    for score, label in sorted_pairs:\n        if label == 1: tp += 1\n        else: fp += 1\n        points.append((fp/total_neg, tp/total_pos))\n    return points\n\npoints_good = roc_points(y_true_good, y_scores_good)\npoints_random = roc_points(y_true_good, y_scores_random)\n\nauc_good = calculate_auc(points_good)\nauc_random = calculate_auc(points_random)\n\nprint('AUC COMPARISON')\nprint('=' * 40)\nprint(f'Good model AUC: {auc_good:.3f}')\nprint(f'Random model AUC: {auc_random:.3f}')\nprint(f'\\nInterpretation:')\nprint(f'  AUC > 0.9: Excellent')\nprint(f'  AUC > 0.8: Good')\nprint(f'  AUC = 0.5: Random guessing')",
          description: "Calculate AUC",
        },
        {
          id: "roc-interpretation",
          title: "ROC Interpretation",
          code: "print('ROC CURVE INTERPRETATION')\nprint('=' * 50)\n\nprint('''\nROC Curve Shape:\n\n  TPR\n  1.0 |        ******* ← Perfect (AUC=1.0)\n      |      **\n      |    **\n      |   *    \n  0.5 | **    *** ← Good (AUC~0.8)\n      |*    **\n      |   **\n      | **     ..... ← Random (AUC=0.5)\n  0.0 +*-------------------\n      0.0    0.5     1.0  FPR\n\nKey Points:\n• Closer to top-left = better\n• Diagonal line = random guessing\n• AUC summarizes overall performance\n• Each point = different threshold\n\nChoosing Operating Point:\n• High TPR, accept higher FPR: Medical screening\n• Low FPR, accept lower TPR: Spam filtering\n• Balanced: Use point closest to (0,1)\n''')",
          description: "Interpret ROC curves",
        },
      ]),
      keyPoints: [
        "ROC plots TPR vs FPR at all thresholds",
        "AUC = 0.5 is random, 1.0 is perfect",
        "Higher AUC = better classifier",
        "Threshold-independent evaluation",
        "Choose operating point based on costs",
        "Compare models easily with AUC",
      ],
      hardwareDemo: "Watch threshold move. See TPR and FPR change together.",
      estimatedTime: 30,
      difficulty: "ADVANCED",
      order: 4,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson22_1_4.number}: ${lesson22_1_4.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson22_1_4.id,
        number: 1,
        title: "Calculate TPR and FPR",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate TPR and FPR at a specific threshold.",
        starterCode: "y_true = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0]\ny_scores = [0.9, 0.4, 0.8, 0.7, 0.3, 0.2, 0.6, 0.5, 0.85, 0.35]\nthreshold = 0.5\n\n# Predict positive if score >= threshold\ny_pred = [1 if s >= threshold else 0 for s in y_scores]\n\n# Calculate TP, FP, TN, FN\nTP = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)\nFP = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)\nTN = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 0)\nFN = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)\n\n# TPR and FPR\nTPR = TP / (TP + FN) if (TP + FN) > 0 else 0\nFPR = FP / (FP + TN) if (FP + TN) > 0 else 0\n\nprint('TPR AND FPR CALCULATION')\nprint('=' * 40)\nprint(f'Threshold: {threshold}')\nprint(f'TP={TP}, FP={FP}, FN={FN}, TN={TN}')\nprint(f'\\nTPR (True Positive Rate) = {TPR:.2f}')\nprint(f'FPR (False Positive Rate) = {FPR:.2f}')\nprint(f'\\nThis is one point on the ROC curve: ({FPR:.2f}, {TPR:.2f})')",
        solution: "# Single ROC point calculated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "TPR and FPR", description: "TPR/FPR calculation" }]),
        hints: ["Apply threshold to scores", "Count TP, FP, FN, TN", "TPR = recall"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson22_1_4.id,
        number: 2,
        title: "Build ROC Curve",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Build complete ROC curve by varying threshold.",
        starterCode: "y_true = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0]\ny_scores = [0.9, 0.4, 0.8, 0.7, 0.3, 0.2, 0.6, 0.5, 0.85, 0.35]\n\ndef get_tpr_fpr(y_true, y_scores, threshold):\n    y_pred = [1 if s >= threshold else 0 for s in y_scores]\n    TP = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)\n    FP = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)\n    TN = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 0)\n    FN = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)\n    TPR = TP / (TP + FN) if (TP + FN) > 0 else 0\n    FPR = FP / (FP + TN) if (FP + TN) > 0 else 0\n    return FPR, TPR\n\nprint('ROC CURVE POINTS')\nprint('=' * 40)\nprint(f'{\"Threshold\":>10} {\"FPR\":>8} {\"TPR\":>8}')\nprint('-' * 30)\n\nroc_points = []\nfor thresh in [0.0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]:\n    fpr, tpr = get_tpr_fpr(y_true, y_scores, thresh)\n    roc_points.append((fpr, tpr))\n    print(f'{thresh:>10.1f} {fpr:>8.2f} {tpr:>8.2f}')\n\nprint('\\nSimplified ROC visualization:')\nprint('TPR')\nfor tpr_level in [1.0, 0.8, 0.6, 0.4, 0.2, 0.0]:\n    row = '|'\n    for fpr, tpr in sorted(roc_points):\n        if abs(tpr - tpr_level) < 0.15:\n            row += '*'\n        else:\n            row += ' '\n    print(f'{tpr_level:.1f} {row}')\nprint('    ' + '-' * 10)\nprint('    FPR')",
        solution: "# Complete ROC curve",
        testCases: JSON.stringify([{ input: "", expectedOutput: "ROC points", description: "Build ROC" }]),
        hints: ["Vary threshold from 0 to 1", "Calculate TPR, FPR at each", "Plot points"],
        xpReward: 25,
        order: 2,
      },
      {
        lessonId: lesson22_1_4.id,
        number: 3,
        title: "Calculate AUC",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Calculate AUC using the trapezoidal rule.",
        starterCode: "def calculate_auc(roc_points):\n    \"\"\"Calculate AUC using trapezoidal rule\"\"\"\n    # Sort points by FPR\n    sorted_points = sorted(roc_points)\n    \n    auc = 0\n    for i in range(1, len(sorted_points)):\n        x1, y1 = sorted_points[i-1]\n        x2, y2 = sorted_points[i]\n        # Trapezoid area: width * average height\n        width = x2 - x1\n        avg_height = (y1 + y2) / 2\n        auc += width * avg_height\n    \n    return auc\n\n# ROC points from a good model\nroc_good = [(0, 0), (0, 0.4), (0.1, 0.6), (0.2, 0.8), (0.4, 1.0), (1.0, 1.0)]\n\n# ROC points from random model (diagonal)\nroc_random = [(0, 0), (0.2, 0.2), (0.4, 0.4), (0.6, 0.6), (0.8, 0.8), (1.0, 1.0)]\n\nauc_good = calculate_auc(roc_good)\nauc_random = calculate_auc(roc_random)\n\nprint('AUC CALCULATION')\nprint('=' * 40)\nprint(f'Good model AUC: {auc_good:.3f}')\nprint(f'Random model AUC: {auc_random:.3f}')\nprint(f'\\nGood model is {auc_good/auc_random:.1f}x better than random')",
        solution: "# AUC calculated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "AUC values", description: "Calculate AUC" }]),
        hints: ["Sum trapezoid areas", "Sort points by FPR first", "Random = 0.5"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson22_1_4.id,
        number: 4,
        title: "Compare Models with AUC",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Compare two models using their AUC scores.",
        starterCode: "import random\n\nrandom.seed(42)\n\n# Same true labels\ny_true = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0]\n\n# Model A: Good predictions\nscores_a = [0.95, 0.15, 0.90, 0.85, 0.10, 0.20, 0.80, 0.25, 0.88, 0.18]\n\n# Model B: Weaker predictions  \nscores_b = [0.70, 0.40, 0.65, 0.60, 0.35, 0.45, 0.55, 0.50, 0.62, 0.42]\n\ndef simple_auc(y_true, scores):\n    \"\"\"Simple AUC calculation\"\"\"\n    pos_scores = [s for s, y in zip(scores, y_true) if y == 1]\n    neg_scores = [s for s, y in zip(scores, y_true) if y == 0]\n    \n    # Count how often positive scores > negative scores\n    correct = sum(1 for ps in pos_scores for ns in neg_scores if ps > ns)\n    ties = sum(0.5 for ps in pos_scores for ns in neg_scores if ps == ns)\n    total = len(pos_scores) * len(neg_scores)\n    \n    return (correct + ties) / total if total > 0 else 0\n\nauc_a = simple_auc(y_true, scores_a)\nauc_b = simple_auc(y_true, scores_b)\n\nprint('MODEL COMPARISON USING AUC')\nprint('=' * 40)\nprint(f'Model A AUC: {auc_a:.3f}')\nprint(f'Model B AUC: {auc_b:.3f}')\nprint(f'\\nModel A is better by {(auc_a - auc_b)*100:.1f} percentage points')\nprint(f'\\nInterpretation:')\nif auc_a > 0.9:\n    print(f'  Model A: Excellent (AUC > 0.9)')\nelif auc_a > 0.8:\n    print(f'  Model A: Good (AUC > 0.8)')",
        solution: "# Models compared via AUC",
        testCases: JSON.stringify([{ input: "", expectedOutput: "AUC comparison", description: "Compare AUC" }]),
        hints: ["Higher AUC = better model", "Simple AUC counts correct rankings", "Compare difference"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson22_1_4.id,
        number: 5,
        title: "Choose Operating Point",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Choose the best threshold based on different cost considerations.",
        starterCode: "y_true = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0]\ny_scores = [0.9, 0.4, 0.8, 0.7, 0.3, 0.2, 0.6, 0.5, 0.85, 0.35]\n\ndef evaluate_threshold(y_true, y_scores, threshold):\n    y_pred = [1 if s >= threshold else 0 for s in y_scores]\n    TP = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)\n    FP = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)\n    FN = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)\n    TN = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 0)\n    TPR = TP / (TP + FN) if (TP + FN) > 0 else 0\n    FPR = FP / (FP + TN) if (FP + TN) > 0 else 0\n    return TPR, FPR, TP, FP, FN, TN\n\nprint('CHOOSING OPERATING POINT')\nprint('=' * 60)\n\nprint(f'\\n{\"Thresh\":>6} {\"TPR\":>6} {\"FPR\":>6} {\"TP\":>4} {\"FP\":>4} {\"FN\":>4} {\"Best For\":<20}')\nprint('-' * 60)\n\nfor thresh in [0.3, 0.5, 0.7, 0.9]:\n    tpr, fpr, tp, fp, fn, tn = evaluate_threshold(y_true, y_scores, thresh)\n    \n    if thresh == 0.3:\n        best_for = 'High recall needed'\n    elif thresh == 0.5:\n        best_for = 'Balanced'\n    elif thresh == 0.7:\n        best_for = 'Higher precision'\n    else:\n        best_for = 'Very high precision'\n    \n    print(f'{thresh:>6.1f} {tpr:>6.2f} {fpr:>6.2f} {tp:>4} {fp:>4} {fn:>4} {best_for:<20}')\n\nprint('\\nGuidelines:')\nprint('  Medical screening: Lower threshold (catch all positives)')\nprint('  Spam filter: Higher threshold (avoid false positives)')",
        solution: "# Operating point selection",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Thresholds compared", description: "Choose threshold" }]),
        hints: ["Lower threshold = higher TPR", "Higher threshold = lower FPR", "Context determines best"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 22.1.4`);

  console.log("\n✅ Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
