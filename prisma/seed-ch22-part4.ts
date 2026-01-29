import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 4: Lessons 22.4.1-22.4.2 (Model Comparison)...\n");

  const section22_4 = await prisma.section.findFirst({ where: { number: 22.4 } });
  if (!section22_4) throw new Error("Section 22.4 not found. Run part 1 first.");

  // Lesson 22.4.1
  const lesson22_4_1 = await prisma.lesson.upsert({
    where: { slug: "knn-revisited-classification" },
    update: {},
    create: {
      sectionId: section22_4.id,
      number: 22.41,
      title: "K-Nearest Neighbors Revisited",
      slug: "knn-revisited-classification",
      objectives: [
        "Apply KNN to classification problems",
        "Understand the role of K in classification",
        "Compare KNN with other classifiers",
        "Know when KNN works well",
      ],
      content: `# K-Nearest Neighbors for Classification

## Quick Review

KNN predicts based on the **K closest training examples**.

For classification: **majority vote** among K neighbors.

## The Algorithm

1. Calculate distance to all training points
2. Find K nearest neighbors
3. Count votes for each class
4. Predict the majority class

## Choosing K

- **K = 1**: Very flexible, prone to noise
- **K = large**: More stable, but may miss local patterns
- **Odd K**: Avoids ties in binary classification
- **Rule of thumb**: K = √n (square root of training size)

## Distance Matters

- **Euclidean**: Most common, assumes features on same scale
- **Manhattan**: Sum of absolute differences
- **Feature scaling**: CRITICAL for KNN!

## Pros and Cons

### Advantages
✅ Simple to understand
✅ No training phase (lazy learner)
✅ Naturally handles multi-class
✅ Can capture complex boundaries

### Disadvantages
❌ Slow prediction (must scan all data)
❌ Sensitive to irrelevant features
❌ Requires feature scaling
❌ Struggles with high dimensions`,
      codeExamples: JSON.stringify([
        {
          id: "knn-classification",
          title: "KNN Classification",
          code: "import math\nfrom collections import Counter\n\ndef euclidean_distance(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef knn_classify(X_train, y_train, x_new, k=3):\n    \"\"\"Classify using K-nearest neighbors\"\"\"\n    # Calculate distances to all training points\n    distances = []\n    for xi, yi in zip(X_train, y_train):\n        dist = euclidean_distance(xi, x_new)\n        distances.append((dist, yi))\n    \n    # Sort and get K nearest\n    distances.sort(key=lambda x: x[0])\n    k_nearest = distances[:k]\n    \n    # Majority vote\n    votes = [label for dist, label in k_nearest]\n    prediction = Counter(votes).most_common(1)[0][0]\n    \n    return prediction, k_nearest\n\n# Training data: [feature1, feature2] → class\nX_train = [[1, 2], [2, 3], [3, 1], [6, 5], [7, 7], [8, 6]]\ny_train = ['A', 'A', 'A', 'B', 'B', 'B']\n\n# New point to classify\nx_new = [5, 4]\n\nprint('KNN CLASSIFICATION')\nprint('=' * 50)\nprint(f'New point: {x_new}')\nprint(f'\\nTrying different K values:')\n\nfor k in [1, 3, 5]:\n    pred, neighbors = knn_classify(X_train, y_train, x_new, k)\n    neighbor_info = [(f'{d:.2f}', l) for d, l in neighbors]\n    print(f'\\nK = {k}:')\n    print(f'  Neighbors: {neighbor_info}')\n    print(f'  Prediction: {pred}')",
          description: "KNN classification with different K",
        },
        {
          id: "effect-of-k",
          title: "Effect of K on Decision",
          code: "import math\nfrom collections import Counter\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai-bi)**2 for ai, bi in zip(a, b)))\n\ndef knn_predict(X, y, point, k):\n    dists = [(euclidean(xi, point), yi) for xi, yi in zip(X, y)]\n    dists.sort()\n    votes = [l for d, l in dists[:k]]\n    return Counter(votes).most_common(1)[0][0]\n\n# Data with some noise\nX = [[1,1], [1,2], [2,1], [2,2],  # Class A cluster\n     [5,5], [5,6], [6,5], [6,6],  # Class B cluster\n     [3,3]]  # Noisy point labeled B (outlier)\ny = ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B']\n\ntest_point = [2.5, 2.5]  # Near the outlier\n\nprint('EFFECT OF K ON CLASSIFICATION')\nprint('=' * 50)\nprint(f'Test point: {test_point}')\nprint('(Near a noisy B point among A cluster)\\n')\n\nprint(f'{\"K\":>3} {\"Prediction\":>12} {\"Reasoning\":<30}')\nprint('-' * 50)\n\nfor k in [1, 3, 5, 7]:\n    pred = knn_predict(X, y, test_point, k)\n    if k == 1:\n        reason = 'Closest is the noisy B point'\n    elif k <= 3:\n        reason = 'Noise still has influence'\n    else:\n        reason = 'More neighbors → more robust to noise'\n    print(f'{k:>3} {pred:>12} {reason:<30}')\n\nprint('\\n💡 Larger K is more robust to noise!')",
          description: "K affects noise sensitivity",
        },
        {
          id: "knn-vs-others",
          title: "KNN vs Other Classifiers",
          code: "print('KNN vs OTHER CLASSIFIERS')\nprint('=' * 60)\n\ncomparison = [\n    ('Aspect', 'KNN', 'Logistic Reg', 'Decision Tree'),\n    ('-' * 15, '-' * 12, '-' * 12, '-' * 12),\n    ('Training', 'None (lazy)', 'Fast', 'Fast'),\n    ('Prediction', 'Slow (O(n))', 'Very fast', 'Very fast'),\n    ('Boundary', 'Non-linear', 'Linear', 'Non-linear'),\n    ('Interpretable', 'Somewhat', 'Yes (weights)', 'Yes (rules)'),\n    ('Scaling needed', 'YES!', 'Helpful', 'No'),\n    ('Handles noise', 'With large K', 'Moderate', 'Poor'),\n    ('High dimensions', 'Struggles', 'OK', 'OK'),\n]\n\nfor row in comparison:\n    print(f'{row[0]:<15} {row[1]:<12} {row[2]:<12} {row[3]:<12}')\n\nprint('\\nWhen to use KNN:')\nprint('  ✓ Small to medium dataset')\nprint('  ✓ Non-linear boundaries needed')\nprint('  ✓ No strong assumptions about data')\nprint('  ✓ Baseline for comparison')\nprint('\\nWhen to avoid KNN:')\nprint('  ✗ Large dataset (slow prediction)')\nprint('  ✗ Many irrelevant features')\nprint('  ✗ High-dimensional data')",
          description: "Compare KNN with other methods",
        },
      ]),
      keyPoints: [
        "KNN: vote among K nearest neighbors",
        "Larger K = more robust to noise",
        "Smaller K = more flexible boundaries",
        "MUST scale features for KNN",
        "Lazy learner: no training, slow prediction",
        "Good baseline, simple to understand",
      ],
      hardwareDemo: "Watch distance calculations. See neighbors voted and majority found.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson22_4_1.number}: ${lesson22_4_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson22_4_1.id,
        number: 1,
        title: "Implement KNN Classifier",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement K-nearest neighbors classification from scratch.",
        starterCode: "import math\nfrom collections import Counter\n\ndef distance(a, b):\n    return math.sqrt(sum((ai - bi)**2 for ai, bi in zip(a, b)))\n\ndef knn_classify(X_train, y_train, x_test, k):\n    # Calculate all distances\n    distances = []\n    for i, xi in enumerate(X_train):\n        d = distance(xi, x_test)\n        distances.append((d, y_train[i]))\n    \n    # Sort by distance\n    distances.sort(key=lambda x: x[0])\n    \n    # Get K nearest labels\n    k_labels = [label for dist, label in distances[:k]]\n    \n    # Return majority\n    return Counter(k_labels).most_common(1)[0][0]\n\n# Test data\nX = [[0, 0], [1, 0], [0, 1], [5, 5], [6, 5], [5, 6]]\ny = ['A', 'A', 'A', 'B', 'B', 'B']\n\ntest_points = [[0.5, 0.5], [4, 4], [3, 3]]\n\nprint('KNN CLASSIFIER')\nprint('=' * 40)\nfor point in test_points:\n    pred = knn_classify(X, y, point, k=3)\n    print(f'{point} → {pred}')",
        solution: "# KNN implementation",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Classifications", description: "KNN classifier" }]),
        hints: ["Calculate all distances", "Sort and take K smallest", "Majority vote"],
        xpReward: 20,
        order: 1,
      },
      {
        lessonId: lesson22_4_1.id,
        number: 2,
        title: "Effect of K",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show how different K values affect classification.",
        starterCode: "import math\nfrom collections import Counter\n\ndef knn(X, y, point, k):\n    dists = [(math.sqrt(sum((a-b)**2 for a,b in zip(xi, point))), yi) \n             for xi, yi in zip(X, y)]\n    dists.sort()\n    votes = [l for d, l in dists[:k]]\n    return Counter(votes).most_common(1)[0][0]\n\n# Data with overlapping region\nX = [[1,1], [1,2], [2,1],  # A\n     [4,4], [4,5], [5,4],  # B\n     [2.5, 2.5]]  # Borderline B\ny = ['A', 'A', 'A', 'B', 'B', 'B', 'B']\n\ntest_point = [2.2, 2.2]\n\nprint('EFFECT OF K ON CLASSIFICATION')\nprint('=' * 45)\nprint(f'Test point: {test_point}\\n')\n\nprint(f'{\"K\":>3} {\"Prediction\":>12} {\"K Nearest Labels\"}')\nprint('-' * 40)\n\nfor k in [1, 3, 5, 7]:\n    # Get neighbors for display\n    dists = [(math.sqrt(sum((a-b)**2 for a,b in zip(xi, test_point))), yi) \n             for xi, yi in zip(X, y)]\n    dists.sort()\n    k_labels = [l for d, l in dists[:k]]\n    pred = Counter(k_labels).most_common(1)[0][0]\n    print(f'{k:>3} {pred:>12} {k_labels}')",
        solution: "# K affects prediction",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Different K results", description: "Effect of K" }]),
        hints: ["Try multiple K values", "Show neighbor labels", "See how prediction changes"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson22_4_1.id,
        number: 3,
        title: "Feature Scaling for KNN",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Demonstrate why feature scaling is critical for KNN.",
        starterCode: "import math\nfrom collections import Counter\n\ndef knn(X, y, point, k=3):\n    dists = [(math.sqrt(sum((a-b)**2 for a,b in zip(xi, point))), yi) \n             for xi, yi in zip(X, y)]\n    dists.sort()\n    return Counter([l for d,l in dists[:k]]).most_common(1)[0][0]\n\ndef scale_data(X):\n    \"\"\"Min-max scaling to [0, 1]\"\"\"\n    n_features = len(X[0])\n    mins = [min(x[i] for x in X) for i in range(n_features)]\n    maxs = [max(x[i] for x in X) for i in range(n_features)]\n    \n    scaled = []\n    for x in X:\n        scaled_x = [(x[i] - mins[i]) / (maxs[i] - mins[i]) if maxs[i] != mins[i] else 0\n                    for i in range(n_features)]\n        scaled.append(scaled_x)\n    return scaled, mins, maxs\n\ndef scale_point(point, mins, maxs):\n    return [(point[i] - mins[i]) / (maxs[i] - mins[i]) if maxs[i] != mins[i] else 0\n            for i in range(len(point))]\n\n# Data: [age (20-60), income (20000-100000)]\nX = [[25, 30000], [30, 25000], [35, 35000],  # Class A (young, low income)\n     [50, 80000], [55, 90000], [45, 85000]]  # Class B (older, high income)\ny = ['A', 'A', 'A', 'B', 'B', 'B']\n\ntest = [40, 50000]\n\nprint('FEATURE SCALING FOR KNN')\nprint('=' * 50)\n\n# Without scaling\npred_unscaled = knn(X, y, test)\nprint(f'Without scaling:')\nprint(f'  Test: {test}')\nprint(f'  Prediction: {pred_unscaled}')\nprint(f'  ⚠️ Income dominates distance calculation!')\n\n# With scaling\nX_scaled, mins, maxs = scale_data(X)\ntest_scaled = scale_point(test, mins, maxs)\npred_scaled = knn(X_scaled, y, test_scaled)\nprint(f'\\nWith scaling:')\nprint(f'  Test scaled: [{test_scaled[0]:.2f}, {test_scaled[1]:.2f}]')\nprint(f'  Prediction: {pred_scaled}')\nprint(f'  ✓ Both features contribute equally')",
        solution: "# Scaling changes prediction",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Scaling effect shown", description: "Feature scaling" }]),
        hints: ["Large range dominates", "Scale to same range", "Compare predictions"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson22_4_1.id,
        number: 4,
        title: "KNN with Probability",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Return class probabilities instead of just the prediction.",
        starterCode: "import math\nfrom collections import Counter\n\ndef knn_proba(X, y, point, k=3):\n    \"\"\"Return class probabilities\"\"\"\n    dists = [(math.sqrt(sum((a-b)**2 for a,b in zip(xi, point))), yi) \n             for xi, yi in zip(X, y)]\n    dists.sort()\n    k_labels = [l for d, l in dists[:k]]\n    \n    # Count votes\n    counts = Counter(k_labels)\n    \n    # Convert to probabilities\n    classes = sorted(set(y))\n    proba = {c: counts.get(c, 0) / k for c in classes}\n    \n    prediction = max(proba, key=proba.get)\n    return prediction, proba\n\n# Data\nX = [[1,1], [1,2], [2,1], [2,2], [5,5], [5,6], [6,5], [6,6]]\ny = ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B']\n\ntest_points = [[1.5, 1.5], [3.5, 3.5], [5.5, 5.5]]\n\nprint('KNN WITH PROBABILITIES')\nprint('=' * 50)\n\nfor point in test_points:\n    pred, proba = knn_proba(X, y, point, k=5)\n    print(f'\\nPoint: {point}')\n    print(f'  Probabilities: A={proba[\"A\"]:.0%}, B={proba[\"B\"]:.0%}')\n    print(f'  Prediction: {pred}')",
        solution: "# KNN with probabilities",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Probabilities shown", description: "KNN probability" }]),
        hints: ["Count votes per class", "Divide by K", "Return dictionary"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson22_4_1.id,
        number: 5,
        title: "Choose Optimal K",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Use cross-validation to find the best K for a dataset.",
        starterCode: "import math\nfrom collections import Counter\nimport random\n\ndef knn(X, y, point, k):\n    dists = [(math.sqrt(sum((a-b)**2 for a,b in zip(xi, point))), yi) \n             for xi, yi in zip(X, y)]\n    dists.sort()\n    return Counter([l for d,l in dists[:k]]).most_common(1)[0][0]\n\ndef evaluate_k(X, y, k, test_frac=0.3):\n    \"\"\"Evaluate K using train/test split\"\"\"\n    n = len(X)\n    indices = list(range(n))\n    random.shuffle(indices)\n    \n    split = int(n * (1 - test_frac))\n    train_idx = indices[:split]\n    test_idx = indices[split:]\n    \n    X_train = [X[i] for i in train_idx]\n    y_train = [y[i] for i in train_idx]\n    X_test = [X[i] for i in test_idx]\n    y_test = [y[i] for i in test_idx]\n    \n    correct = sum(1 for xi, yi in zip(X_test, y_test) \n                  if knn(X_train, y_train, xi, k) == yi)\n    return correct / len(X_test)\n\n# Generate data\nrandom.seed(42)\nX = [[random.gauss(0, 1), random.gauss(0, 1)] for _ in range(30)] + \\\n    [[random.gauss(3, 1), random.gauss(3, 1)] for _ in range(30)]\ny = ['A'] * 30 + ['B'] * 30\n\nprint('FINDING OPTIMAL K')\nprint('=' * 45)\nprint(f'{\"K\":>3} {\"Accuracy\":>12}')\nprint('-' * 20)\n\nbest_k = 1\nbest_acc = 0\n\nfor k in [1, 3, 5, 7, 9, 11, 15]:\n    # Average over multiple splits\n    accs = [evaluate_k(X, y, k) for _ in range(5)]\n    avg_acc = sum(accs) / len(accs)\n    print(f'{k:>3} {avg_acc:>12.1%}')\n    if avg_acc > best_acc:\n        best_acc = avg_acc\n        best_k = k\n\nprint(f'\\nBest K = {best_k} (accuracy: {best_acc:.1%})')",
        solution: "# Find optimal K",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Best K found", description: "Optimal K" }]),
        hints: ["Try multiple K values", "Use train/test split", "Track best accuracy"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 22.4.1`);

  // Lesson 22.4.2
  const lesson22_4_2 = await prisma.lesson.upsert({
    where: { slug: "model-comparison-selection" },
    update: {},
    create: {
      sectionId: section22_4.id,
      number: 22.42,
      title: "Model Comparison and Selection",
      slug: "model-comparison-selection",
      objectives: [
        "Compare classifiers on same dataset",
        "Understand bias-variance tradeoff",
        "Use cross-validation for fair comparison",
        "Know which classifier to choose when",
      ],
      content: `# Model Comparison and Selection

## Why Compare Models?

No single classifier is best for all problems!

**No Free Lunch Theorem**: Every algorithm has trade-offs.

## Comparison Framework

1. Use same train/test split for all models
2. Use cross-validation for robust estimates
3. Compare multiple metrics (not just accuracy)
4. Consider computational cost

## Bias-Variance Tradeoff

| Model | Bias | Variance | Notes |
|-------|------|----------|-------|
| Logistic Regression | High | Low | Simple, stable |
| Decision Tree (deep) | Low | High | Can overfit |
| Random Forest | Low | Medium | Reduces variance |
| KNN (small K) | Low | High | Flexible but noisy |
| KNN (large K) | Higher | Low | More stable |

## Model Selection Guidelines

### Use Logistic Regression when:
- Linear relationship expected
- Interpretability important
- Baseline needed

### Use Decision Trees when:
- Non-linear relationships
- Interpretability needed
- Mixed feature types

### Use Random Forest when:
- High accuracy needed
- Overfitting is a concern
- Can sacrifice interpretability

### Use KNN when:
- Small dataset
- No assumptions about data
- Simple baseline needed

## Cross-Validation

Split data into K folds, train on K-1, test on 1, rotate.

Gives more reliable performance estimate than single split.`,
      codeExamples: JSON.stringify([
        {
          id: "compare-classifiers",
          title: "Compare Multiple Classifiers",
          code: "import math\nimport random\nfrom collections import Counter\n\n# Simple classifiers\ndef knn_predict(X, y, point, k=3):\n    dists = [(math.sqrt(sum((a-b)**2 for a,b in zip(xi, point))), yi) \n             for xi, yi in zip(X, y)]\n    dists.sort()\n    return Counter([l for d,l in dists[:k]]).most_common(1)[0][0]\n\ndef majority_baseline(y_train, x):\n    return Counter(y_train).most_common(1)[0][0]\n\ndef evaluate(X_train, y_train, X_test, y_test, predict_fn):\n    correct = sum(1 for xi, yi in zip(X_test, y_test) \n                  if predict_fn(X_train, y_train, xi) == yi)\n    return correct / len(y_test)\n\n# Generate dataset\nrandom.seed(42)\nX = [[random.gauss(0, 1), random.gauss(0, 1)] for _ in range(40)] + \\\n    [[random.gauss(2, 1), random.gauss(2, 1)] for _ in range(40)]\ny = [0] * 40 + [1] * 40\n\n# Train/test split\nindices = list(range(80))\nrandom.shuffle(indices)\nX_train = [X[i] for i in indices[:60]]\ny_train = [y[i] for i in indices[:60]]\nX_test = [X[i] for i in indices[60:]]\ny_test = [y[i] for i in indices[60:]]\n\nprint('CLASSIFIER COMPARISON')\nprint('=' * 45)\n\n# Compare\nmodels = [\n    ('Majority Baseline', lambda X, y, x: majority_baseline(y, x)),\n    ('KNN (K=1)', lambda X, y, x: knn_predict(X, y, x, k=1)),\n    ('KNN (K=3)', lambda X, y, x: knn_predict(X, y, x, k=3)),\n    ('KNN (K=7)', lambda X, y, x: knn_predict(X, y, x, k=7)),\n]\n\nprint(f'{\"Model\":<20} {\"Accuracy\":>12}')\nprint('-' * 35)\n\nfor name, pred_fn in models:\n    acc = evaluate(X_train, y_train, X_test, y_test, pred_fn)\n    print(f'{name:<20} {acc:>12.1%}')",
          description: "Compare different classifiers",
        },
        {
          id: "cross-validation",
          title: "K-Fold Cross Validation",
          code: "import random\nfrom collections import Counter\nimport math\n\ndef knn_predict(X, y, point, k=3):\n    dists = [(math.sqrt(sum((a-b)**2 for a,b in zip(xi, point))), yi) \n             for xi, yi in zip(X, y)]\n    dists.sort()\n    return Counter([l for d,l in dists[:k]]).most_common(1)[0][0]\n\ndef cross_validate(X, y, predict_fn, n_folds=5):\n    \"\"\"K-fold cross validation\"\"\"\n    n = len(X)\n    indices = list(range(n))\n    random.shuffle(indices)\n    \n    fold_size = n // n_folds\n    scores = []\n    \n    for fold in range(n_folds):\n        # Define test fold\n        test_start = fold * fold_size\n        test_end = test_start + fold_size\n        test_idx = indices[test_start:test_end]\n        train_idx = indices[:test_start] + indices[test_end:]\n        \n        X_train = [X[i] for i in train_idx]\n        y_train = [y[i] for i in train_idx]\n        X_test = [X[i] for i in test_idx]\n        y_test = [y[i] for i in test_idx]\n        \n        correct = sum(1 for xi, yi in zip(X_test, y_test) \n                      if predict_fn(X_train, y_train, xi) == yi)\n        scores.append(correct / len(y_test))\n    \n    return scores\n\n# Generate data\nrandom.seed(42)\nX = [[random.gauss(0, 1), random.gauss(0, 1)] for _ in range(50)] + \\\n    [[random.gauss(2, 1), random.gauss(2, 1)] for _ in range(50)]\ny = [0] * 50 + [1] * 50\n\nprint('5-FOLD CROSS VALIDATION')\nprint('=' * 50)\n\nfor k in [1, 3, 5, 7]:\n    scores = cross_validate(X, y, lambda X, y, x: knn_predict(X, y, x, k))\n    mean = sum(scores) / len(scores)\n    std = (sum((s - mean)**2 for s in scores) / len(scores)) ** 0.5\n    print(f'KNN (K={k}): {mean:.1%} ± {std:.1%}  {scores}')\n\nprint('\\n💡 Cross-validation gives more reliable estimates!')",
          description: "Implement cross-validation",
        },
        {
          id: "model-selection-guide",
          title: "Model Selection Guide",
          code: "print('MODEL SELECTION GUIDE')\nprint('=' * 65)\n\nscenarios = [\n    {\n        'situation': 'Small dataset, need interpretability',\n        'best': 'Logistic Regression or Decision Tree',\n        'reason': 'Simple models, avoid overfitting'\n    },\n    {\n        'situation': 'Large dataset, accuracy is priority',\n        'best': 'Random Forest',\n        'reason': 'Handles complexity, reduces overfitting'\n    },\n    {\n        'situation': 'Linear relationship expected',\n        'best': 'Logistic Regression',\n        'reason': 'Matches data structure, fast'\n    },\n    {\n        'situation': 'Complex non-linear boundaries',\n        'best': 'Random Forest or KNN',\n        'reason': 'Can capture any boundary shape'\n    },\n    {\n        'situation': 'Need probability estimates',\n        'best': 'Logistic Regression',\n        'reason': 'Natural probability outputs'\n    },\n    {\n        'situation': 'Mixed feature types (categorical + numeric)',\n        'best': 'Decision Tree / Random Forest',\n        'reason': 'Handles both naturally'\n    },\n]\n\nfor s in scenarios:\n    print(f'\\n📋 Situation: {s[\"situation\"]}')\n    print(f'   Best choice: {s[\"best\"]}')\n    print(f'   Why: {s[\"reason\"]}')",
          description: "When to use which model",
        },
      ]),
      keyPoints: [
        "No single best classifier for all problems",
        "Use same data split for fair comparison",
        "Cross-validation gives robust estimates",
        "Consider accuracy, speed, and interpretability",
        "Bias-variance tradeoff guides model choice",
        "Start simple, increase complexity if needed",
      ],
      hardwareDemo: "Watch multiple models train. See comparison table update.",
      estimatedTime: 35,
      difficulty: "ADVANCED",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson22_4_2.number}: ${lesson22_4_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson22_4_2.id,
        number: 1,
        title: "Compare on Same Split",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Compare multiple classifiers using the same train/test split.",
        starterCode: "import random\nimport math\nfrom collections import Counter\n\ndef knn(X, y, point, k):\n    dists = [(math.sqrt(sum((a-b)**2 for a,b in zip(xi, point))), yi) \n             for xi, yi in zip(X, y)]\n    dists.sort()\n    return Counter([l for d,l in dists[:k]]).most_common(1)[0][0]\n\ndef majority(y_train, x):\n    return Counter(y_train).most_common(1)[0][0]\n\n# Generate data\nrandom.seed(42)\nX = [[random.gauss(0, 1), random.gauss(0, 1)] for _ in range(30)] + \\\n    [[random.gauss(3, 1), random.gauss(3, 1)] for _ in range(30)]\ny = ['A'] * 30 + ['B'] * 30\n\n# Same split for all\nindices = list(range(60))\nrandom.shuffle(indices)\nX_train = [X[i] for i in indices[:45]]\ny_train = [y[i] for i in indices[:45]]\nX_test = [X[i] for i in indices[45:]]\ny_test = [y[i] for i in indices[45:]]\n\ndef accuracy(pred_fn):\n    correct = sum(1 for xi, yi in zip(X_test, y_test) \n                  if pred_fn(xi) == yi)\n    return correct / len(y_test)\n\nprint('CLASSIFIER COMPARISON (Same Split)')\nprint('=' * 40)\n\nresults = [\n    ('Majority Baseline', accuracy(lambda x: majority(y_train, x))),\n    ('1-NN', accuracy(lambda x: knn(X_train, y_train, x, 1))),\n    ('3-NN', accuracy(lambda x: knn(X_train, y_train, x, 3))),\n    ('5-NN', accuracy(lambda x: knn(X_train, y_train, x, 5))),\n]\n\nfor name, acc in sorted(results, key=lambda x: -x[1]):\n    print(f'{name:<20} {acc:.1%}')",
        solution: "# Fair comparison on same split",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Ranked results", description: "Compare classifiers" }]),
        hints: ["Same split for all models", "Calculate accuracy for each", "Sort by performance"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson22_4_2.id,
        number: 2,
        title: "Implement Cross-Validation",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement K-fold cross-validation from scratch.",
        starterCode: "import random\nimport math\nfrom collections import Counter\n\ndef knn(X, y, point, k=3):\n    dists = [(math.sqrt(sum((a-b)**2 for a,b in zip(xi, point))), yi) \n             for xi, yi in zip(X, y)]\n    dists.sort()\n    return Counter([l for d,l in dists[:k]]).most_common(1)[0][0]\n\ndef k_fold_cv(X, y, model_fn, k_folds=5):\n    \"\"\"K-fold cross validation\"\"\"\n    n = len(X)\n    indices = list(range(n))\n    random.shuffle(indices)\n    \n    fold_size = n // k_folds\n    fold_scores = []\n    \n    for i in range(k_folds):\n        # Create test and train indices\n        test_start = i * fold_size\n        test_end = test_start + fold_size\n        test_idx = indices[test_start:test_end]\n        train_idx = [j for j in indices if j not in test_idx]\n        \n        # Split data\n        X_train = [X[j] for j in train_idx]\n        y_train = [y[j] for j in train_idx]\n        X_test = [X[j] for j in test_idx]\n        y_test = [y[j] for j in test_idx]\n        \n        # Evaluate\n        correct = sum(1 for xi, yi in zip(X_test, y_test)\n                      if model_fn(X_train, y_train, xi) == yi)\n        fold_scores.append(correct / len(y_test))\n    \n    return fold_scores\n\n# Data\nrandom.seed(42)\nX = [[random.gauss(0, 1), random.gauss(0, 1)] for _ in range(50)] + \\\n    [[random.gauss(2, 1), random.gauss(2, 1)] for _ in range(50)]\ny = [0] * 50 + [1] * 50\n\nprint('5-FOLD CROSS VALIDATION')\nprint('=' * 50)\n\nscores = k_fold_cv(X, y, lambda X, y, x: knn(X, y, x, 3))\nmean = sum(scores) / len(scores)\nstd = (sum((s-mean)**2 for s in scores) / len(scores)) ** 0.5\n\nprint(f'Fold scores: {[f\"{s:.0%}\" for s in scores]}')\nprint(f'Mean: {mean:.1%} ± {std:.1%}')",
        solution: "# Cross-validation implemented",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Fold scores", description: "Cross-validation" }]),
        hints: ["Divide into K folds", "Each fold is test once", "Average all scores"],
        xpReward: 25,
        order: 2,
      },
      {
        lessonId: lesson22_4_2.id,
        number: 3,
        title: "Bias-Variance Analysis",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show how model complexity affects bias and variance.",
        starterCode: "import random\nimport math\nfrom collections import Counter\n\ndef knn(X, y, point, k):\n    dists = [(math.sqrt(sum((a-b)**2 for a,b in zip(xi, point))), yi) \n             for xi, yi in zip(X, y)]\n    dists.sort()\n    return Counter([l for d,l in dists[:k]]).most_common(1)[0][0]\n\ndef evaluate_variance(X, y, k, n_trials=10):\n    \"\"\"Measure prediction variance across different train/test splits\"\"\"\n    predictions = {tuple(x): [] for x in X}\n    \n    for _ in range(n_trials):\n        # Random split\n        indices = list(range(len(X)))\n        random.shuffle(indices)\n        train_idx = indices[:int(len(X)*0.7)]\n        \n        X_train = [X[i] for i in train_idx]\n        y_train = [y[i] for i in train_idx]\n        \n        # Predict all points\n        for xi in X:\n            pred = knn(X_train, y_train, xi, k)\n            predictions[tuple(xi)].append(pred)\n    \n    # Measure consistency\n    consistencies = []\n    for preds in predictions.values():\n        most_common = Counter(preds).most_common(1)[0][1]\n        consistencies.append(most_common / len(preds))\n    \n    return sum(consistencies) / len(consistencies)\n\nrandom.seed(42)\nX = [[random.gauss(0, 1), random.gauss(0, 1)] for _ in range(30)] + \\\n    [[random.gauss(2, 1), random.gauss(2, 1)] for _ in range(30)]\ny = [0] * 30 + [1] * 30\n\nprint('BIAS-VARIANCE: Effect of K in KNN')\nprint('=' * 50)\nprint('Higher consistency = lower variance\\n')\n\nprint(f'{\"K\":>3} {\"Consistency\":>15} {\"Interpretation\":<25}')\nprint('-' * 50)\n\nfor k in [1, 3, 5, 9, 15]:\n    consistency = evaluate_variance(X, y, k)\n    interp = 'High variance' if consistency < 0.85 else 'Low variance'\n    print(f'{k:>3} {consistency:>15.1%} {interp:<25}')",
        solution: "# Larger K = lower variance",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Variance analysis", description: "Bias-variance" }]),
        hints: ["Small K = high variance", "Large K = lower variance", "Measure prediction consistency"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson22_4_2.id,
        number: 4,
        title: "Multiple Metrics Comparison",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Compare models using accuracy, precision, and recall.",
        starterCode: "import random\nimport math\nfrom collections import Counter\n\ndef knn(X, y, point, k):\n    dists = [(math.sqrt(sum((a-b)**2 for a,b in zip(xi, point))), yi) \n             for xi, yi in zip(X, y)]\n    dists.sort()\n    return Counter([l for d,l in dists[:k]]).most_common(1)[0][0]\n\ndef metrics(y_true, y_pred, positive=1):\n    TP = sum(1 for t, p in zip(y_true, y_pred) if t == positive and p == positive)\n    FP = sum(1 for t, p in zip(y_true, y_pred) if t != positive and p == positive)\n    FN = sum(1 for t, p in zip(y_true, y_pred) if t == positive and p != positive)\n    TN = sum(1 for t, p in zip(y_true, y_pred) if t != positive and p != positive)\n    \n    accuracy = (TP + TN) / len(y_true)\n    precision = TP / (TP + FP) if (TP + FP) > 0 else 0\n    recall = TP / (TP + FN) if (TP + FN) > 0 else 0\n    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0\n    \n    return accuracy, precision, recall, f1\n\n# Imbalanced data\nrandom.seed(42)\nX = [[random.gauss(0, 1), random.gauss(0, 1)] for _ in range(80)] + \\\n    [[random.gauss(2, 1), random.gauss(2, 1)] for _ in range(20)]  # Imbalanced!\ny = [0] * 80 + [1] * 20\n\n# Split\nindices = list(range(100))\nrandom.shuffle(indices)\nX_test = [X[i] for i in indices[:30]]\ny_test = [y[i] for i in indices[:30]]\nX_train = [X[i] for i in indices[30:]]\ny_train = [y[i] for i in indices[30:]]\n\nprint('MULTI-METRIC COMPARISON (Imbalanced Data)')\nprint('=' * 60)\nprint(f'{\"Model\":<12} {\"Accuracy\":>10} {\"Precision\":>10} {\"Recall\":>10} {\"F1\":>10}')\nprint('-' * 55)\n\nfor k in [1, 3, 5, 9]:\n    y_pred = [knn(X_train, y_train, x, k) for x in X_test]\n    acc, prec, rec, f1 = metrics(y_test, y_pred)\n    print(f'{f\"KNN (K={k})\":<12} {acc:>10.1%} {prec:>10.1%} {rec:>10.1%} {f1:>10.2f}')",
        solution: "# Multiple metrics comparison",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All metrics shown", description: "Multiple metrics" }]),
        hints: ["Calculate all metrics", "Accuracy can be misleading", "F1 balances precision/recall"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson22_4_2.id,
        number: 5,
        title: "Model Selection Framework",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a complete model selection framework that picks the best model.",
        starterCode: "import random\nimport math\nfrom collections import Counter\n\ndef knn(X, y, point, k):\n    dists = [(math.sqrt(sum((a-b)**2 for a,b in zip(xi, point))), yi) \n             for xi, yi in zip(X, y)]\n    dists.sort()\n    return Counter([l for d,l in dists[:k]]).most_common(1)[0][0]\n\ndef majority(y_train, x):\n    return Counter(y_train).most_common(1)[0][0]\n\ndef cross_validate(X, y, model_fn, k_folds=5):\n    n = len(X)\n    indices = list(range(n))\n    random.shuffle(indices)\n    fold_size = n // k_folds\n    scores = []\n    \n    for i in range(k_folds):\n        test_idx = indices[i*fold_size:(i+1)*fold_size]\n        train_idx = [j for j in indices if j not in test_idx]\n        X_tr = [X[j] for j in train_idx]\n        y_tr = [y[j] for j in train_idx]\n        X_te = [X[j] for j in test_idx]\n        y_te = [y[j] for j in test_idx]\n        \n        correct = sum(1 for xi, yi in zip(X_te, y_te) if model_fn(X_tr, y_tr, xi) == yi)\n        scores.append(correct / len(y_te))\n    \n    return sum(scores) / len(scores), scores\n\ndef select_best_model(X, y, models):\n    \"\"\"Select best model using cross-validation\"\"\"\n    results = []\n    for name, model_fn in models:\n        mean, scores = cross_validate(X, y, model_fn)\n        std = (sum((s-mean)**2 for s in scores) / len(scores)) ** 0.5\n        results.append((name, mean, std))\n    \n    results.sort(key=lambda x: -x[1])\n    return results\n\n# Data\nrandom.seed(42)\nX = [[random.gauss(0, 1), random.gauss(0, 1)] for _ in range(50)] + \\\n    [[random.gauss(2.5, 1), random.gauss(2.5, 1)] for _ in range(50)]\ny = [0] * 50 + [1] * 50\n\n# Models to compare\nmodels = [\n    ('Majority', lambda X, y, x: majority(y, x)),\n    ('1-NN', lambda X, y, x: knn(X, y, x, 1)),\n    ('3-NN', lambda X, y, x: knn(X, y, x, 3)),\n    ('5-NN', lambda X, y, x: knn(X, y, x, 5)),\n    ('9-NN', lambda X, y, x: knn(X, y, x, 9)),\n]\n\nprint('MODEL SELECTION FRAMEWORK')\nprint('=' * 50)\nprint('Using 5-fold cross-validation\\n')\n\nresults = select_best_model(X, y, models)\n\nprint(f'{\"Rank\":<6} {\"Model\":<12} {\"Mean\":>10} {\"Std\":>10}')\nprint('-' * 40)\nfor rank, (name, mean, std) in enumerate(results, 1):\n    print(f'{rank:<6} {name:<12} {mean:>10.1%} {std:>10.1%}')\n\nprint(f'\\n🏆 Best model: {results[0][0]} ({results[0][1]:.1%} accuracy)')",
        solution: "# Complete model selection",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Best model selected", description: "Model selection" }]),
        hints: ["Cross-validate all models", "Track mean and std", "Select highest mean"],
        xpReward: 30,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 22.4.2`);

  console.log("\n✅ Part 4 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
