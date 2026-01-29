import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 3: Lessons 22.3.1-22.3.2 (Tree-Based Methods)...\n");

  const section22_3 = await prisma.section.findFirst({ where: { number: 22.3 } });
  if (!section22_3) throw new Error("Section 22.3 not found. Run part 1 first.");

  // Lesson 22.3.1
  const lesson22_3_1 = await prisma.lesson.upsert({
    where: { slug: "decision-trees-classification" },
    update: {},
    create: {
      sectionId: section22_3.id,
      number: 22.31,
      title: "Decision Trees",
      slug: "decision-trees-classification",
      objectives: [
        "Understand decision tree structure",
        "Learn how splits are chosen (Gini, entropy)",
        "Build a simple decision tree",
        "Know advantages and disadvantages",
      ],
      content: `# Decision Trees

## What Is a Decision Tree?

A flowchart-like structure where:
- Internal nodes = feature tests
- Branches = test outcomes
- Leaves = class predictions

## How It Works

1. Start at root
2. Test a feature
3. Follow branch based on answer
4. Repeat until reaching a leaf
5. Leaf gives the prediction

## Choosing Splits

We want splits that **reduce impurity**.

### Gini Impurity
\`\`\`
Gini = 1 - Σ(pᵢ²)
\`\`\`
Where pᵢ = proportion of class i

- Gini = 0: Pure node (all one class)
- Gini = 0.5: Maximum impurity (binary, 50/50)

### Information Gain (Entropy)
\`\`\`
Entropy = -Σ(pᵢ × log₂(pᵢ))
\`\`\`

## Advantages

✅ Easy to understand and interpret
✅ Handles non-linear relationships
✅ No feature scaling needed
✅ Handles mixed feature types

## Disadvantages

❌ Prone to overfitting
❌ Unstable (small data changes → different tree)
❌ Biased toward features with many values`,
      codeExamples: JSON.stringify([
        {
          id: "gini-impurity",
          title: "Gini Impurity Calculation",
          code: "def gini_impurity(labels):\n    \"\"\"Calculate Gini impurity of a node\"\"\"\n    if len(labels) == 0:\n        return 0\n    \n    # Count each class\n    counts = {}\n    for label in labels:\n        counts[label] = counts.get(label, 0) + 1\n    \n    # Calculate Gini\n    total = len(labels)\n    gini = 1.0\n    for count in counts.values():\n        p = count / total\n        gini -= p ** 2\n    \n    return gini\n\nprint('GINI IMPURITY')\nprint('=' * 45)\nprint('Gini = 1 - Σ(pᵢ²)')\nprint()\n\n# Different distributions\ndistributions = [\n    ('Pure (all A)', ['A', 'A', 'A', 'A', 'A']),\n    ('50/50 A/B', ['A', 'A', 'B', 'B']),\n    ('80/20 A/B', ['A', 'A', 'A', 'A', 'B']),\n    ('Three classes', ['A', 'A', 'B', 'B', 'C', 'C']),\n]\n\nfor name, labels in distributions:\n    gini = gini_impurity(labels)\n    print(f'{name:20}: Gini = {gini:.3f}')\n\nprint('\\n💡 Lower Gini = more pure (better for leaves)')",
          description: "Calculate Gini impurity",
        },
        {
          id: "find-best-split",
          title: "Finding Best Split",
          code: "def gini_impurity(labels):\n    if len(labels) == 0:\n        return 0\n    counts = {}\n    for l in labels:\n        counts[l] = counts.get(l, 0) + 1\n    total = len(labels)\n    return 1 - sum((c/total)**2 for c in counts.values())\n\ndef weighted_gini(left_labels, right_labels):\n    \"\"\"Weighted average Gini after split\"\"\"\n    total = len(left_labels) + len(right_labels)\n    if total == 0:\n        return 0\n    w_left = len(left_labels) / total\n    w_right = len(right_labels) / total\n    return w_left * gini_impurity(left_labels) + w_right * gini_impurity(right_labels)\n\n# Dataset: [age, income, buys_product]\ndata = [\n    (25, 'low', 'no'),\n    (35, 'low', 'no'),\n    (45, 'high', 'yes'),\n    (55, 'high', 'yes'),\n    (30, 'high', 'yes'),\n    (40, 'low', 'no'),\n]\n\nprint('FINDING BEST SPLIT')\nprint('=' * 50)\nprint('Data: age, income → buys_product')\n\n# Try splitting on income\nleft = [d[2] for d in data if d[1] == 'low']\nright = [d[2] for d in data if d[1] == 'high']\nprint(f'\\nSplit on income:')\nprint(f'  Low income: {left} → Gini = {gini_impurity(left):.3f}')\nprint(f'  High income: {right} → Gini = {gini_impurity(right):.3f}')\nprint(f'  Weighted Gini = {weighted_gini(left, right):.3f}')\n\n# Try splitting on age <= 35\nleft = [d[2] for d in data if d[0] <= 35]\nright = [d[2] for d in data if d[0] > 35]\nprint(f'\\nSplit on age <= 35:')\nprint(f'  Age ≤ 35: {left} → Gini = {gini_impurity(left):.3f}')\nprint(f'  Age > 35: {right} → Gini = {gini_impurity(right):.3f}')\nprint(f'  Weighted Gini = {weighted_gini(left, right):.3f}')\n\nprint('\\n✓ Income split is better (lower weighted Gini)!')",
          description: "Find best split using Gini",
        },
        {
          id: "simple-tree",
          title: "Simple Decision Tree",
          code: "class DecisionNode:\n    def __init__(self, feature=None, threshold=None, left=None, right=None, prediction=None):\n        self.feature = feature\n        self.threshold = threshold\n        self.left = left\n        self.right = right\n        self.prediction = prediction\n\ndef predict_one(node, sample):\n    \"\"\"Traverse tree to get prediction\"\"\"\n    if node.prediction is not None:\n        return node.prediction\n    \n    if sample[node.feature] <= node.threshold:\n        return predict_one(node.left, sample)\n    else:\n        return predict_one(node.right, sample)\n\n# Manually build a tree for: buys_product based on age and income\n# Tree structure:\n#       income?\n#      /      \\\n#    low      high\n#     |        |\n#    NO       YES\n\ntree = DecisionNode(\n    feature=1,  # income (index 1)\n    threshold=0.5,  # low=0, high=1\n    left=DecisionNode(prediction='no'),   # low income → no\n    right=DecisionNode(prediction='yes')  # high income → yes\n)\n\nprint('DECISION TREE PREDICTION')\nprint('=' * 45)\nprint('Tree structure:')\nprint('       income?')\nprint('      /      \\\\\\')\nprint('    low      high')\nprint('     |        |')\nprint('    NO       YES')\nprint()\n\n# Test samples: [age, income_numeric]\ntest_samples = [\n    ([30, 0], 'low income, age 30'),\n    ([50, 1], 'high income, age 50'),\n    ([25, 1], 'high income, age 25'),\n]\n\nfor sample, desc in test_samples:\n    pred = predict_one(tree, sample)\n    print(f'{desc}: → {pred.upper()}')",
          description: "Simple decision tree implementation",
        },
      ]),
      keyPoints: [
        "Tree: nodes test features, leaves predict",
        "Gini = 1 - Σ(pᵢ²), measures impurity",
        "Lower Gini = purer split",
        "Choose split that minimizes weighted Gini",
        "Easy to interpret and visualize",
        "Can overfit without pruning/limits",
      ],
      hardwareDemo: "Watch tree grow. See Gini decrease at each split.",
      estimatedTime: 35,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson22_3_1.number}: ${lesson22_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson22_3_1.id,
        number: 1,
        title: "Calculate Gini Impurity",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement Gini impurity calculation for different class distributions.",
        starterCode: "def gini_impurity(labels):\n    \"\"\"Calculate Gini impurity: 1 - sum(p_i^2)\"\"\"\n    if len(labels) == 0:\n        return 0\n    \n    # Count classes\n    counts = {}\n    for label in labels:\n        counts[label] = counts.get(label, 0) + 1\n    \n    # Calculate Gini\n    total = len(labels)\n    gini = 1.0\n    for count in counts.values():\n        p = count / total\n        gini -= p ** 2\n    \n    return gini\n\nprint('GINI IMPURITY CALCULATOR')\nprint('=' * 40)\n\ntest_cases = [\n    ['A', 'A', 'A', 'A'],           # Pure\n    ['A', 'A', 'B', 'B'],           # 50/50\n    ['A', 'A', 'A', 'B'],           # 75/25\n    ['A', 'B', 'C'],                # 3 classes equal\n    ['A', 'A', 'A', 'A', 'B', 'C'], # Imbalanced 3 classes\n]\n\nfor labels in test_cases:\n    gini = gini_impurity(labels)\n    print(f'{str(labels):35} Gini = {gini:.3f}')",
        solution: "# Gini calculated correctly",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Gini values", description: "Gini impurity" }]),
        hints: ["Count each class", "p = count/total", "Gini = 1 - sum(p²)"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson22_3_1.id,
        number: 2,
        title: "Information Gain",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate information gain for a split using entropy.",
        starterCode: "import math\n\ndef entropy(labels):\n    \"\"\"Calculate entropy: -sum(p * log2(p))\"\"\"\n    if len(labels) == 0:\n        return 0\n    \n    counts = {}\n    for l in labels:\n        counts[l] = counts.get(l, 0) + 1\n    \n    total = len(labels)\n    ent = 0\n    for count in counts.values():\n        p = count / total\n        if p > 0:\n            ent -= p * math.log2(p)\n    \n    return ent\n\ndef information_gain(parent, left, right):\n    \"\"\"Calculate information gain from a split\"\"\"\n    parent_entropy = entropy(parent)\n    n = len(parent)\n    weighted_child = (len(left)/n) * entropy(left) + (len(right)/n) * entropy(right)\n    return parent_entropy - weighted_child\n\n# Example: splitting customer data on age\nparent = ['buy', 'buy', 'buy', 'no', 'no', 'no', 'no', 'no']\nleft = ['buy', 'buy', 'buy']  # Young customers\nright = ['no', 'no', 'no', 'no', 'no']  # Older customers\n\nprint('INFORMATION GAIN')\nprint('=' * 45)\nprint(f'Parent: {parent}')\nprint(f'Parent entropy: {entropy(parent):.3f}')\nprint(f'\\nAfter split on age:')\nprint(f'  Left (young): {left}, entropy = {entropy(left):.3f}')\nprint(f'  Right (old): {right}, entropy = {entropy(right):.3f}')\nprint(f'\\nInformation Gain = {information_gain(parent, left, right):.3f}')",
        solution: "# Information gain calculation",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Info gain shown", description: "Information gain" }]),
        hints: ["Entropy = -Σp*log2(p)", "Gain = parent - weighted children", "Higher gain = better split"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson22_3_1.id,
        number: 3,
        title: "Find Best Split Point",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Find the best threshold for splitting a continuous feature.",
        starterCode: "def gini(labels):\n    if len(labels) == 0:\n        return 0\n    counts = {}\n    for l in labels:\n        counts[l] = counts.get(l, 0) + 1\n    total = len(labels)\n    return 1 - sum((c/total)**2 for c in counts.values())\n\ndef find_best_split(feature_values, labels):\n    \"\"\"Find best threshold for splitting\"\"\"\n    # Sort by feature value\n    sorted_data = sorted(zip(feature_values, labels))\n    \n    best_threshold = None\n    best_gini = float('inf')\n    \n    # Try each unique midpoint as threshold\n    for i in range(1, len(sorted_data)):\n        if sorted_data[i][0] == sorted_data[i-1][0]:\n            continue\n        \n        threshold = (sorted_data[i][0] + sorted_data[i-1][0]) / 2\n        \n        left_labels = [l for v, l in sorted_data if v <= threshold]\n        right_labels = [l for v, l in sorted_data if v > threshold]\n        \n        weighted = (len(left_labels) * gini(left_labels) + \n                   len(right_labels) * gini(right_labels)) / len(labels)\n        \n        if weighted < best_gini:\n            best_gini = weighted\n            best_threshold = threshold\n    \n    return best_threshold, best_gini\n\n# Example: age feature\nages = [25, 30, 35, 40, 45, 50, 55, 60]\nlabels = ['no', 'no', 'no', 'yes', 'yes', 'yes', 'yes', 'yes']\n\nprint('FINDING BEST SPLIT THRESHOLD')\nprint('=' * 50)\nprint(f'Feature (age): {ages}')\nprint(f'Labels: {labels}')\n\nthreshold, gini_score = find_best_split(ages, labels)\nprint(f'\\nBest threshold: age ≤ {threshold}')\nprint(f'Weighted Gini: {gini_score:.3f}')\n\n# Verify\nleft = [l for a, l in zip(ages, labels) if a <= threshold]\nright = [l for a, l in zip(ages, labels) if a > threshold]\nprint(f'\\nSplit result:')\nprint(f'  Left (≤{threshold}): {left}')\nprint(f'  Right (>{threshold}): {right}')",
        solution: "# Find optimal split threshold",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Best threshold", description: "Best split" }]),
        hints: ["Try midpoints between values", "Calculate weighted Gini each time", "Keep track of minimum"],
        xpReward: 25,
        order: 3,
      },
      {
        lessonId: lesson22_3_1.id,
        number: 4,
        title: "Build Simple Tree",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Build a decision tree with one split (decision stump).",
        starterCode: "def gini(labels):\n    if len(labels) == 0:\n        return 0\n    counts = {}\n    for l in labels:\n        counts[l] = counts.get(l, 0) + 1\n    total = len(labels)\n    return 1 - sum((c/total)**2 for c in counts.values())\n\ndef majority_class(labels):\n    counts = {}\n    for l in labels:\n        counts[l] = counts.get(l, 0) + 1\n    return max(counts, key=counts.get)\n\nclass DecisionStump:\n    def __init__(self):\n        self.feature_idx = None\n        self.threshold = None\n        self.left_class = None\n        self.right_class = None\n    \n    def fit(self, X, y):\n        best_gini = float('inf')\n        \n        for f_idx in range(len(X[0])):\n            values = [x[f_idx] for x in X]\n            for threshold in sorted(set(values))[:-1]:\n                left_y = [yi for xi, yi in zip(X, y) if xi[f_idx] <= threshold]\n                right_y = [yi for xi, yi in zip(X, y) if xi[f_idx] > threshold]\n                \n                if len(left_y) == 0 or len(right_y) == 0:\n                    continue\n                \n                weighted = (len(left_y)*gini(left_y) + len(right_y)*gini(right_y)) / len(y)\n                \n                if weighted < best_gini:\n                    best_gini = weighted\n                    self.feature_idx = f_idx\n                    self.threshold = threshold\n                    self.left_class = majority_class(left_y)\n                    self.right_class = majority_class(right_y)\n    \n    def predict(self, x):\n        if x[self.feature_idx] <= self.threshold:\n            return self.left_class\n        return self.right_class\n\n# Data: [hours_studied, hours_slept] → passed\nX = [[2, 8], [3, 7], [4, 6], [5, 5], [6, 6], [7, 7], [8, 8]]\ny = ['fail', 'fail', 'fail', 'pass', 'pass', 'pass', 'pass']\n\nstump = DecisionStump()\nstump.fit(X, y)\n\nprint('DECISION STUMP')\nprint('=' * 45)\nprint(f'Best split: feature {stump.feature_idx} ≤ {stump.threshold}')\nprint(f'  If ≤ {stump.threshold}: predict {stump.left_class}')\nprint(f'  If > {stump.threshold}: predict {stump.right_class}')\n\nprint('\\nPredictions:')\nfor xi, yi in zip(X, y):\n    pred = stump.predict(xi)\n    status = '✓' if pred == yi else '✗'\n    print(f'  {xi} → {pred} (actual: {yi}) {status}')",
        solution: "# Decision stump built",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Stump trained", description: "Build stump" }]),
        hints: ["Try all features and thresholds", "Keep best split", "Predict majority class in each leaf"],
        xpReward: 30,
        order: 4,
      },
      {
        lessonId: lesson22_3_1.id,
        number: 5,
        title: "Tree Visualization",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a text visualization of a decision tree.",
        starterCode: "def print_tree(description):\n    \"\"\"Print tree structure\"\"\"\n    print(description)\n\n# Manually defined tree for play tennis\ntree_structure = '''\nDECISION TREE: Play Tennis?\n============================\n\n              [Outlook?]\n             /    |    \\\\\n        sunny  overcast  rainy\n          |       |        |\n     [Humidity?]  YES   [Windy?]\n       /    \\\\            /    \\\\\n    high   normal    true   false\n     |       |        |       |\n    NO      YES      NO      YES\n\nRules extracted:\n1. IF outlook=overcast THEN play=yes\n2. IF outlook=sunny AND humidity=high THEN play=no\n3. IF outlook=sunny AND humidity=normal THEN play=yes\n4. IF outlook=rainy AND windy=true THEN play=no\n5. IF outlook=rainy AND windy=false THEN play=yes\n'''\n\nprint(tree_structure)\n\n# Test predictions\ntest_cases = [\n    {'outlook': 'sunny', 'humidity': 'high', 'windy': False},\n    {'outlook': 'overcast', 'humidity': 'high', 'windy': True},\n    {'outlook': 'rainy', 'humidity': 'normal', 'windy': False},\n]\n\nprint('Test predictions:')\nfor tc in test_cases:\n    if tc['outlook'] == 'overcast':\n        pred = 'YES'\n    elif tc['outlook'] == 'sunny':\n        pred = 'NO' if tc['humidity'] == 'high' else 'YES'\n    else:  # rainy\n        pred = 'NO' if tc['windy'] else 'YES'\n    print(f'  {tc} → {pred}')",
        solution: "# Tree visualization and rules",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Tree shown", description: "Tree visualization" }]),
        hints: ["Show branches clearly", "Extract if-then rules", "Test with examples"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 22.3.1`);

  // Lesson 22.3.2
  const lesson22_3_2 = await prisma.lesson.upsert({
    where: { slug: "random-forests-ensemble" },
    update: {},
    create: {
      sectionId: section22_3.id,
      number: 22.32,
      title: "Random Forests (Ensemble Methods)",
      slug: "random-forests-ensemble",
      objectives: [
        "Understand ensemble learning concept",
        "Learn how random forests work",
        "Understand bagging and feature randomness",
        "Know when to use random forests",
      ],
      content: `# Random Forests

## The Problem with Single Trees

- High variance (small data changes → different tree)
- Prone to overfitting
- Unstable predictions

## Ensemble Solution

Combine multiple models to get better predictions!

"Wisdom of the crowd" - many weak learners → one strong learner

## Random Forest Recipe

1. **Bootstrap sampling**: Create N random subsets (with replacement)
2. **Random feature selection**: Each split considers only √p features
3. **Build N trees**: One tree per bootstrap sample
4. **Aggregate**: Vote (classification) or average (regression)

## Why It Works

- **Bagging** reduces variance
- **Feature randomness** decorrelates trees
- Errors of individual trees cancel out

## Key Hyperparameters

- **n_estimators**: Number of trees (more = better, but slower)
- **max_depth**: How deep each tree grows
- **max_features**: Features per split (√p is common)
- **min_samples_split**: Minimum samples to split

## Advantages

✅ Handles non-linear relationships
✅ Robust to overfitting
✅ Feature importance built-in
✅ Works well out-of-the-box`,
      codeExamples: JSON.stringify([
        {
          id: "bootstrap-sample",
          title: "Bootstrap Sampling",
          code: "import random\n\ndef bootstrap_sample(data, seed=None):\n    \"\"\"Create bootstrap sample (sampling with replacement)\"\"\"\n    if seed:\n        random.seed(seed)\n    n = len(data)\n    sample = [random.choice(data) for _ in range(n)]\n    return sample\n\noriginal = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']\n\nprint('BOOTSTRAP SAMPLING')\nprint('=' * 50)\nprint(f'Original data: {original}')\nprint(f'Size: {len(original)}')\nprint()\n\nfor i in range(3):\n    sample = bootstrap_sample(original, seed=i)\n    # Count unique items\n    unique = set(sample)\n    print(f'Bootstrap sample {i+1}: {sample}')\n    print(f'  Unique items: {len(unique)}/{len(original)}')\n    print(f'  Items NOT in sample: {set(original) - unique}')\n    print()\n\nprint('💡 Each sample has ~63.2% of original data on average')\nprint('   (1 - 1/e ≈ 0.632)')",
          description: "Bootstrap sampling demonstration",
        },
        {
          id: "simple-random-forest",
          title: "Simple Random Forest",
          code: "import random\nfrom collections import Counter\n\nclass SimpleTree:\n    \"\"\"Very simple decision stump\"\"\"\n    def __init__(self, feature_idx, threshold, left_class, right_class):\n        self.feature_idx = feature_idx\n        self.threshold = threshold\n        self.left_class = left_class\n        self.right_class = right_class\n    \n    def predict(self, x):\n        if x[self.feature_idx] <= self.threshold:\n            return self.left_class\n        return self.right_class\n\nclass SimpleRandomForest:\n    def __init__(self, n_trees=5):\n        self.n_trees = n_trees\n        self.trees = []\n    \n    def fit(self, X, y):\n        n_features = len(X[0])\n        \n        for t in range(self.n_trees):\n            # Bootstrap sample\n            indices = [random.randint(0, len(X)-1) for _ in range(len(X))]\n            X_boot = [X[i] for i in indices]\n            y_boot = [y[i] for i in indices]\n            \n            # Random feature subset (simplified: pick 1 random feature)\n            feat_idx = random.randint(0, n_features - 1)\n            \n            # Find best threshold for this feature\n            values = sorted(set(x[feat_idx] for x in X_boot))\n            threshold = values[len(values)//2] if values else 0\n            \n            # Majority class in each split\n            left_y = [yi for xi, yi in zip(X_boot, y_boot) if xi[feat_idx] <= threshold]\n            right_y = [yi for xi, yi in zip(X_boot, y_boot) if xi[feat_idx] > threshold]\n            \n            left_class = Counter(left_y).most_common(1)[0][0] if left_y else y_boot[0]\n            right_class = Counter(right_y).most_common(1)[0][0] if right_y else y_boot[0]\n            \n            self.trees.append(SimpleTree(feat_idx, threshold, left_class, right_class))\n    \n    def predict(self, x):\n        # Majority vote\n        votes = [tree.predict(x) for tree in self.trees]\n        return Counter(votes).most_common(1)[0][0]\n\n# Data\nX = [[2, 8], [3, 7], [4, 6], [5, 5], [6, 4], [7, 5], [8, 6]]\ny = [0, 0, 0, 1, 1, 1, 1]\n\nrandom.seed(42)\nrf = SimpleRandomForest(n_trees=5)\nrf.fit(X, y)\n\nprint('SIMPLE RANDOM FOREST')\nprint('=' * 45)\nprint(f'Trained {len(rf.trees)} trees')\nprint('\\nIndividual tree predictions for [5, 5]:')\nfor i, tree in enumerate(rf.trees):\n    print(f'  Tree {i+1} (feature {tree.feature_idx}, thresh {tree.threshold}): {tree.predict([5, 5])}')\n\nprint(f'\\nForest prediction (majority vote): {rf.predict([5, 5])}')",
          description: "Simple random forest implementation",
        },
        {
          id: "voting",
          title: "Ensemble Voting",
          code: "from collections import Counter\n\ndef ensemble_vote(predictions):\n    \"\"\"Majority voting for classification\"\"\"\n    vote_counts = Counter(predictions)\n    winner = vote_counts.most_common(1)[0]\n    return winner[0], winner[1] / len(predictions)\n\ndef ensemble_average(predictions):\n    \"\"\"Averaging for regression\"\"\"\n    return sum(predictions) / len(predictions)\n\nprint('ENSEMBLE VOTING')\nprint('=' * 45)\n\n# Classification: 5 trees vote\ntree_predictions = ['cat', 'dog', 'cat', 'cat', 'dog']\nprediction, confidence = ensemble_vote(tree_predictions)\nprint('Classification ensemble:')\nprint(f'  Individual: {tree_predictions}')\nprint(f'  Prediction: {prediction} (confidence: {confidence:.0%})')\n\n# Regression: 5 trees predict values\nreg_predictions = [100, 105, 98, 102, 110]\naverage = ensemble_average(reg_predictions)\nprint(f'\\nRegression ensemble:')\nprint(f'  Individual: {reg_predictions}')\nprint(f'  Prediction (average): {average:.1f}')\n\n# Show how more trees help\nprint('\\nEffect of number of trees:')\nimport random\nrandom.seed(42)\nfor n_trees in [1, 5, 10, 50]:\n    # Simulate trees with 60% individual accuracy\n    votes = ['correct' if random.random() < 0.6 else 'wrong' for _ in range(n_trees)]\n    winner, _ = ensemble_vote(votes)\n    accuracy = votes.count('correct') / len(votes)\n    print(f'  {n_trees:2d} trees: ensemble accuracy = {accuracy:.0%}')",
          description: "How ensemble voting works",
        },
      ]),
      keyPoints: [
        "Ensemble: combine multiple weak learners",
        "Bootstrap: sample with replacement",
        "Random features: decorrelates trees",
        "Vote for classification, average for regression",
        "More trees = more stable (but slower)",
        "Built-in feature importance",
      ],
      hardwareDemo: "Watch multiple trees vote. See predictions stabilize with more trees.",
      estimatedTime: 35,
      difficulty: "ADVANCED",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson22_3_2.number}: ${lesson22_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson22_3_2.id,
        number: 1,
        title: "Implement Bootstrap Sampling",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create bootstrap samples and analyze what fraction of data is included.",
        starterCode: "import random\n\ndef bootstrap_sample(data):\n    \"\"\"Sample with replacement, same size as original\"\"\"\n    n = len(data)\n    return [random.choice(data) for _ in range(n)]\n\ndef analyze_bootstrap(data, n_samples=100):\n    \"\"\"Analyze bootstrap sampling properties\"\"\"\n    inclusion_rates = []\n    \n    for _ in range(n_samples):\n        sample = bootstrap_sample(data)\n        unique = len(set(sample))\n        inclusion_rates.append(unique / len(data))\n    \n    return sum(inclusion_rates) / len(inclusion_rates)\n\ndata = list(range(100))  # 100 items\n\nrandom.seed(42)\navg_inclusion = analyze_bootstrap(data)\n\nprint('BOOTSTRAP SAMPLING ANALYSIS')\nprint('=' * 45)\nprint(f'Original data size: {len(data)}')\nprint(f'Average unique items in bootstrap: {avg_inclusion:.1%}')\nprint(f'Expected (1 - 1/e): {1 - 1/2.718:.1%}')\nprint(f'\\nThis means ~{(1-avg_inclusion)*100:.0f}% of data is \"out-of-bag\"')\nprint('OOB samples can be used for validation!')",
        solution: "# Bootstrap analysis",
        testCases: JSON.stringify([{ input: "", expectedOutput: "~63% inclusion", description: "Bootstrap sampling" }]),
        hints: ["Sample with replacement", "Count unique items", "Compare to 1-1/e"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson22_3_2.id,
        number: 2,
        title: "Majority Voting",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Implement majority voting to combine classifier predictions.",
        starterCode: "from collections import Counter\n\ndef majority_vote(predictions):\n    \"\"\"Return most common prediction and its frequency\"\"\"\n    counts = Counter(predictions)\n    winner, count = counts.most_common(1)[0]\n    confidence = count / len(predictions)\n    return winner, confidence\n\n# Test cases\ntest_cases = [\n    ['A', 'A', 'B', 'A', 'B'],\n    ['cat', 'dog', 'cat', 'cat', 'dog'],\n    [1, 1, 1, 0, 0, 0, 1],\n    ['spam', 'spam', 'spam', 'ham'],\n]\n\nprint('MAJORITY VOTING')\nprint('=' * 50)\n\nfor predictions in test_cases:\n    winner, conf = majority_vote(predictions)\n    print(f'Votes: {predictions}')\n    print(f'  → Winner: {winner} (confidence: {conf:.0%})')\n    print()",
        solution: "# Majority voting works",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Winners determined", description: "Majority voting" }]),
        hints: ["Use Counter", "most_common(1) gives winner", "Confidence = count/total"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson22_3_2.id,
        number: 3,
        title: "Feature Importance",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate simple feature importance based on how often features are used.",
        starterCode: "from collections import Counter\n\n# Simulated forest: each tree uses certain features\n# Format: list of (feature_used, threshold) for each tree\nforest_splits = [\n    [('age', 30), ('income', 50000)],\n    [('age', 35), ('education', 2)],\n    [('income', 45000), ('age', 28)],\n    [('age', 32), ('income', 55000)],\n    [('education', 3), ('age', 30)],\n]\n\n# Count feature usage\nfeature_counts = Counter()\nfor tree_splits in forest_splits:\n    for feature, threshold in tree_splits:\n        feature_counts[feature] += 1\n\ntotal_splits = sum(feature_counts.values())\n\nprint('FEATURE IMPORTANCE (by usage)')\nprint('=' * 45)\nprint(f'Total splits across {len(forest_splits)} trees: {total_splits}')\nprint()\n\nfor feature, count in feature_counts.most_common():\n    importance = count / total_splits\n    bar = '█' * int(importance * 20)\n    print(f'{feature:12}: {count:2d} splits ({importance:.1%}) {bar}')\n\nprint('\\n💡 \"age\" is most important - used most often for splits')",
        solution: "# Feature importance calculated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Importance shown", description: "Feature importance" }]),
        hints: ["Count how often each feature splits", "Divide by total splits", "More splits = more important"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson22_3_2.id,
        number: 4,
        title: "Ensemble Accuracy",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show how ensemble accuracy improves over individual classifiers.",
        starterCode: "import random\nfrom collections import Counter\n\ndef simulate_ensemble(n_classifiers, individual_accuracy, n_trials=1000):\n    \"\"\"Simulate ensemble of classifiers with given individual accuracy\"\"\"\n    ensemble_correct = 0\n    \n    for _ in range(n_trials):\n        # Each classifier makes a prediction\n        votes = []\n        for _ in range(n_classifiers):\n            correct = random.random() < individual_accuracy\n            votes.append(1 if correct else 0)\n        \n        # Majority vote\n        ensemble_pred = 1 if sum(votes) > n_classifiers / 2 else 0\n        if ensemble_pred == 1:\n            ensemble_correct += 1\n    \n    return ensemble_correct / n_trials\n\nrandom.seed(42)\nindividual_acc = 0.6  # 60% accurate individually\n\nprint('ENSEMBLE ACCURACY IMPROVEMENT')\nprint('=' * 50)\nprint(f'Individual classifier accuracy: {individual_acc:.0%}')\nprint()\nprint(f'{\"Classifiers\":>12} {\"Ensemble Accuracy\":>18}')\nprint('-' * 35)\n\nfor n in [1, 3, 5, 11, 21, 51, 101]:\n    ens_acc = simulate_ensemble(n, individual_acc)\n    improvement = ens_acc - individual_acc\n    print(f'{n:>12} {ens_acc:>18.1%} ({improvement:+.1%})')\n\nprint('\\n💡 More classifiers → higher ensemble accuracy!')\nprint('   (as long as individual accuracy > 50%)')",
        solution: "# Ensemble improves accuracy",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Accuracy increases", description: "Ensemble accuracy" }]),
        hints: ["Simulate votes", "Majority wins", "More voters = better if >50% accurate"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson22_3_2.id,
        number: 5,
        title: "Build Mini Random Forest",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Build a simple random forest with 3 decision stumps.",
        starterCode: "import random\nfrom collections import Counter\n\nclass Stump:\n    def __init__(self, feature, threshold, left_pred, right_pred):\n        self.feature = feature\n        self.threshold = threshold\n        self.left_pred = left_pred\n        self.right_pred = right_pred\n    \n    def predict(self, x):\n        return self.left_pred if x[self.feature] <= self.threshold else self.right_pred\n\ndef build_stump(X, y, feature_idx):\n    \"\"\"Build a stump for one feature\"\"\"\n    values = [x[feature_idx] for x in X]\n    threshold = sum(values) / len(values)  # Simple: mean as threshold\n    \n    left_y = [yi for xi, yi in zip(X, y) if xi[feature_idx] <= threshold]\n    right_y = [yi for xi, yi in zip(X, y) if xi[feature_idx] > threshold]\n    \n    left_pred = Counter(left_y).most_common(1)[0][0] if left_y else y[0]\n    right_pred = Counter(right_y).most_common(1)[0][0] if right_y else y[0]\n    \n    return Stump(feature_idx, threshold, left_pred, right_pred)\n\ndef random_forest(X, y, n_trees=3):\n    \"\"\"Build random forest\"\"\"\n    trees = []\n    n_features = len(X[0])\n    \n    for _ in range(n_trees):\n        # Bootstrap sample\n        indices = [random.randint(0, len(X)-1) for _ in range(len(X))]\n        X_boot = [X[i] for i in indices]\n        y_boot = [y[i] for i in indices]\n        \n        # Random feature\n        feat = random.randint(0, n_features - 1)\n        \n        trees.append(build_stump(X_boot, y_boot, feat))\n    \n    return trees\n\ndef forest_predict(trees, x):\n    votes = [t.predict(x) for t in trees]\n    return Counter(votes).most_common(1)[0][0]\n\n# Data\nX = [[1, 5], [2, 4], [3, 6], [6, 2], [7, 3], [8, 1]]\ny = ['A', 'A', 'A', 'B', 'B', 'B']\n\nrandom.seed(42)\nforest = random_forest(X, y, n_trees=5)\n\nprint('MINI RANDOM FOREST')\nprint('=' * 45)\nprint(f'Built {len(forest)} trees\\n')\n\nfor i, tree in enumerate(forest):\n    print(f'Tree {i+1}: feature[{tree.feature}] <= {tree.threshold:.1f} → {tree.left_pred}, else → {tree.right_pred}')\n\nprint('\\nPredictions:')\nfor x in [[2, 5], [7, 2], [4, 4]]:\n    pred = forest_predict(forest, x)\n    votes = [t.predict(x) for t in forest]\n    print(f'  {x} → {pred} (votes: {votes})')",
        solution: "# Mini random forest built",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Forest predictions", description: "Mini random forest" }]),
        hints: ["Bootstrap sample per tree", "Random feature per tree", "Majority vote to predict"],
        xpReward: 30,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 22.3.2`);

  console.log("\n✅ Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
