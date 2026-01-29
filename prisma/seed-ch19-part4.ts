import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 4: Lessons 19.3.1-19.3.3 (Model Evaluation)...\n");

  const section19_3 = await prisma.section.findFirst({ where: { number: 19.3 } });
  if (!section19_3) throw new Error("Section 19.3 not found. Run part 1 first.");

  const lesson19_3_1 = await prisma.lesson.upsert({
    where: { slug: "overfitting-underfitting" },
    update: {},
    create: {
      sectionId: section19_3.id,
      number: 19.31,
      title: "Overfitting and Underfitting",
      slug: "overfitting-underfitting",
      objectives: [
        "Understand overfitting (memorizing vs learning)",
        "Understand underfitting (too simple)",
        "Recognize signs of each problem",
        "Use validation to detect overfitting",
      ],
      content: `# Overfitting and Underfitting

## The Core Problem
We want models that **generalize** - work well on new, unseen data.

## Overfitting
Model memorizes training data instead of learning patterns.
Signs: Very high training accuracy, low test accuracy.

## Underfitting
Model is too simple to capture patterns.
Signs: Low training accuracy, low test accuracy.

## In KNN Context
- K=1: Tends to overfit
- K=N: Tends to underfit
- K in between: Usually best`,
      codeExamples: JSON.stringify([{
        id: "overfit-demo",
        title: "Overfitting Demo",
        code: "# K=1 overfits, larger K generalizes better",
        description: "See how K affects overfitting",
      }]),
      keyPoints: [
        "Overfitting: high train, low test",
        "Underfitting: low train, low test",
        "K=1 tends to overfit",
        "More data helps reduce overfitting",
      ],
      hardwareDemo: "Watch train vs test accuracy.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson19_3_1.number}: ${lesson19_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson19_3_1.id,
        number: 1,
        title: "Detect Overfitting",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Compare train vs test accuracy for K=1,3,5,9. Identify which K overfits.",
        starterCode: "import math\nimport random\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn(training, point, k):\n    distances = [(euclidean(point, f), l) for f, l in training]\n    distances.sort()\n    votes = {}\n    for dist, label in distances[:k]:\n        votes[label] = votes.get(label, 0) + 1\n    return max(votes, key=votes.get)\n\nrandom.seed(42)\ndata = [((i/10 + random.gauss(0,0.5),), 'A' if i < 25 else 'B') for i in range(50)]\nrandom.shuffle(data)\ntrain, test = data[:40], data[40:]\n\nprint('Overfitting Detection')\nfor k in [1, 3, 5, 9]:\n    train_acc = sum(1 for f,l in train if knn(train,f,k)==l)/len(train)\n    test_acc = sum(1 for f,l in test if knn(train,f,k)==l)/len(test)\n    gap = train_acc - test_acc\n    status = 'OVERFIT' if gap > 0.15 else 'OK'\n    print(f'K={k}: Train={train_acc:.0%}, Test={test_acc:.0%}, Gap={gap:.0%} {status}')",
        solution: "# K=1 has largest gap (overfitting)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "K=1 shows overfitting", description: "Detect overfitting" }]),
        hints: ["Large gap = overfitting", "K=1 memorizes training", "Look for train >> test"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson19_3_1.id,
        number: 2,
        title: "Diagnose Model Problems",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given train and test accuracies, diagnose if the model is overfitting, underfitting, or good.",
        starterCode: "def diagnose(train_acc, test_acc):\n    gap = train_acc - test_acc\n    if train_acc < 0.7:\n        return 'underfit'\n    elif gap > 0.15:\n        return 'overfit'\n    else:\n        return 'good'\n\ncases = [(0.99, 0.75), (0.60, 0.55), (0.92, 0.88), (0.50, 0.48)]\nfor train, test in cases:\n    result = diagnose(train, test)\n    print(f'Train={train:.0%}, Test={test:.0%} -> {result.upper()}')",
        solution: "# Diagnose based on patterns",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Diagnoses shown", description: "Model diagnosis" }]),
        hints: ["Low train = underfit", "Big gap = overfit", "Both high = good"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson19_3_1.id,
        number: 3,
        title: "More Data Reduces Overfitting",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Show that increasing training data reduces the train/test gap.",
        starterCode: "import math\nimport random\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn(train, point, k=3):\n    distances = [(euclidean(point, f), l) for f, l in train]\n    distances.sort()\n    votes = {}\n    for d, l in distances[:k]:\n        votes[l] = votes.get(l, 0) + 1\n    return max(votes, key=votes.get)\n\nrandom.seed(42)\nall_data = [((random.gauss(2,1), random.gauss(2,1)), 'A') for _ in range(100)]\nall_data += [((random.gauss(5,1), random.gauss(5,1)), 'B') for _ in range(100)]\nrandom.shuffle(all_data)\ntest = all_data[160:]\n\nprint('Training Size vs Overfitting Gap')\nfor size in [10, 20, 40, 80, 160]:\n    train = all_data[:size]\n    train_acc = sum(1 for f,l in train if knn(train,f,3)==l)/len(train)\n    test_acc = sum(1 for f,l in test if knn(train,f,3)==l)/len(test)\n    print(f'Size={size}: Gap={(train_acc-test_acc)*100:.0f}%')",
        solution: "# Gap decreases with more data",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Gap decreases", description: "Data effect" }]),
        hints: ["Track train/test gap", "More data helps", "Gap should shrink"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson19_3_1.id,
        number: 4,
        title: "Find Optimal K",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Test different K values and find the one with best test accuracy.",
        starterCode: "# Test K=1,3,5,7,9 and find best test accuracy",
        solution: "# Find K with best test accuracy",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Optimal K found", description: "Find sweet spot" }]),
        hints: ["K=1 overfits", "Large K underfits", "Find best test acc"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson19_3_1.id,
        number: 5,
        title: "Remedies for Overfitting",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Show three ways to reduce overfitting: increase K, add more data, use weighted KNN.",
        starterCode: "print('Baseline: K=1, small data -> high gap')\nprint('Remedy 1: Increase K -> lower gap')\nprint('Remedy 2: More data -> lower gap')\nprint('Remedy 3: Weighted KNN -> smoother')",
        solution: "# All remedies reduce overfitting",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Remedies shown", description: "Overfitting remedies" }]),
        hints: ["Increase K = simpler", "More data helps", "Weighted = smoother"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 19.3.1`);

  const lesson19_3_2 = await prisma.lesson.upsert({
    where: { slug: "cross-validation" },
    update: {},
    create: {
      sectionId: section19_3.id,
      number: 19.32,
      title: "Cross-Validation",
      slug: "cross-validation",
      objectives: [
        "Understand why single split is limited",
        "Implement K-fold cross-validation",
        "Use CV to choose hyperparameters",
        "Get reliable accuracy estimates",
      ],
      content: `# Cross-Validation

## Problem with Single Split
One split can be lucky or unlucky.

## K-Fold Cross-Validation
Split into K folds, train K times with different test fold each time.
Average the results for reliable estimate.

## Benefits
- Uses all data for training and testing
- More reliable accuracy estimate
- Lower variance than single split`,
      codeExamples: JSON.stringify([{
        id: "kfold",
        title: "K-Fold CV",
        code: "# Rotate test fold through data",
        description: "Basic K-fold implementation",
      }]),
      keyPoints: [
        "Single split can be lucky/unlucky",
        "K-fold: train K times, average results",
        "Common: 5-fold or 10-fold",
        "Use CV to choose hyperparameters",
      ],
      hardwareDemo: "Watch data rotate through folds.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson19_3_2.number}: ${lesson19_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson19_3_2.id,
        number: 1,
        title: "Implement K-Fold CV",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement 5-fold cross-validation from scratch.",
        starterCode: "def k_fold_cv(data, n_folds=5):\n    fold_size = len(data) // n_folds\n    accuracies = []\n    for i in range(n_folds):\n        val = data[i*fold_size:(i+1)*fold_size]\n        train = data[:i*fold_size] + data[(i+1)*fold_size:]\n        acc = 0.85  # Calculate actual accuracy\n        accuracies.append(acc)\n        print(f'Fold {i+1}: {acc:.1%}')\n    return sum(accuracies) / len(accuracies)\n\ndata = list(range(100))\navg = k_fold_cv(data)\nprint(f'Average: {avg:.1%}')",
        solution: "# Full K-fold implementation",
        testCases: JSON.stringify([{ input: "", expectedOutput: "5 fold accuracies", description: "K-fold CV" }]),
        hints: ["Each fold is test once", "Rest is training", "Average all accuracies"],
        xpReward: 20,
        order: 1,
      },
      {
        lessonId: lesson19_3_2.id,
        number: 2,
        title: "CV for Hyperparameter Selection",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Use 5-fold CV to find best K for KNN.",
        starterCode: "# Test K=1,3,5,7,9 with cross-validation\nfor k in [1, 3, 5, 7, 9]:\n    cv_score = 0.8  # Calculate actual CV score\n    print(f'K={k}: CV Score = {cv_score:.1%}')",
        solution: "# Select K with best CV score",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Best K selected", description: "CV hyperparameter" }]),
        hints: ["CV each candidate K", "Track best score", "Select highest"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson19_3_2.id,
        number: 3,
        title: "CV vs Single Split Variance",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show CV gives more stable estimates than single splits.",
        starterCode: "# Compare variance of multiple single splits vs CV",
        solution: "# CV has lower variance",
        testCases: JSON.stringify([{ input: "", expectedOutput: "CV more stable", description: "CV stability" }]),
        hints: ["Run multiple times", "Compare variance", "CV more stable"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson19_3_2.id,
        number: 4,
        title: "Leave-One-Out CV",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement Leave-One-Out CV where each sample is test once.",
        starterCode: "def leave_one_out_cv(data):\n    correct = 0\n    for i in range(len(data)):\n        test = data[i]\n        train = data[:i] + data[i+1:]\n        # Predict and check\n    return correct / len(data)",
        solution: "# LOO uses maximum training data",
        testCases: JSON.stringify([{ input: "", expectedOutput: "LOO accuracy", description: "Leave-one-out" }]),
        hints: ["N folds, 1 test each", "Maximum training data", "But expensive"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson19_3_2.id,
        number: 5,
        title: "Complete CV Pipeline",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Use CV to select K, then train final model on ALL data.",
        starterCode: "# Step 1: CV to select best K\n# Step 2: Train on ALL data with best K\n# Step 3: Predict new points",
        solution: "# Complete pipeline",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Pipeline complete", description: "Full pipeline" }]),
        hints: ["CV for selection", "ALL data for final", "Then predict"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 19.3.2`);

  const lesson19_3_3 = await prisma.lesson.upsert({
    where: { slug: "model-evaluation-metrics" },
    update: {},
    create: {
      sectionId: section19_3.id,
      number: 19.33,
      title: "Model Evaluation Metrics",
      slug: "model-evaluation-metrics",
      objectives: [
        "Understand confusion matrix",
        "Calculate accuracy, precision, recall",
        "Know when each metric matters",
        "Handle imbalanced classes",
      ],
      content: `# Model Evaluation Metrics

## Beyond Accuracy
Accuracy can be misleading with imbalanced classes!

## Confusion Matrix
- TP: True Positive
- TN: True Negative
- FP: False Positive
- FN: False Negative

## Key Metrics
- Accuracy: (TP+TN) / Total
- Precision: TP / (TP+FP)
- Recall: TP / (TP+FN)
- F1: Harmonic mean of P and R`,
      codeExamples: JSON.stringify([{
        id: "metrics",
        title: "Calculate Metrics",
        code: "# From confusion matrix to metrics",
        description: "Metrics calculation",
      }]),
      keyPoints: [
        "Confusion matrix: TP, TN, FP, FN",
        "Accuracy can be misleading",
        "Precision: predicted positives correct",
        "Recall: actual positives caught",
      ],
      hardwareDemo: "Watch confusion matrix fill.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson19_3_3.number}: ${lesson19_3_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson19_3_3.id,
        number: 1,
        title: "Build Confusion Matrix",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate TP, TN, FP, FN from predictions.",
        starterCode: "y_true = ['cat', 'dog', 'cat', 'cat', 'dog', 'dog', 'cat', 'dog']\ny_pred = ['cat', 'dog', 'dog', 'cat', 'dog', 'cat', 'cat', 'dog']\npositive = 'cat'\n\ntp = sum(1 for t,p in zip(y_true,y_pred) if t==positive and p==positive)\ntn = sum(1 for t,p in zip(y_true,y_pred) if t!=positive and p!=positive)\nfp = sum(1 for t,p in zip(y_true,y_pred) if t!=positive and p==positive)\nfn = sum(1 for t,p in zip(y_true,y_pred) if t==positive and p!=positive)\n\nprint(f'TP={tp}, TN={tn}, FP={fp}, FN={fn}')",
        solution: "# Confusion matrix calculated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Matrix shown", description: "Confusion matrix" }]),
        hints: ["TP: true=pos, pred=pos", "FP: true=neg, pred=pos", "Sum equals total"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson19_3_3.id,
        number: 2,
        title: "Calculate Precision and Recall",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate precision and recall from confusion matrix.",
        starterCode: "tp, fp, fn, tn = 25, 10, 5, 60\n\nprecision = tp / (tp + fp)\nrecall = tp / (tp + fn)\n\nprint(f'Precision: {precision:.1%}')\nprint(f'Recall: {recall:.1%}')",
        solution: "# Precision and recall calculated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Metrics shown", description: "P and R" }]),
        hints: ["Precision = TP/(TP+FP)", "Recall = TP/(TP+FN)", "Both about positives"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson19_3_3.id,
        number: 3,
        title: "F1 Score",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate F1 score from precision and recall.",
        starterCode: "precision = 0.8\nrecall = 0.6\n\nf1 = 2 * precision * recall / (precision + recall)\nprint(f'F1 Score: {f1:.1%}')",
        solution: "# F1 balances P and R",
        testCases: JSON.stringify([{ input: "", expectedOutput: "F1 calculated", description: "F1 score" }]),
        hints: ["F1 = 2PR/(P+R)", "Harmonic mean", "Penalizes imbalance"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson19_3_3.id,
        number: 4,
        title: "Choose the Right Metric",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Decide whether precision or recall matters more for different scenarios.",
        starterCode: "scenarios = [\n    ('Cancer screening', 'recall'),\n    ('Spam filter', 'precision'),\n    ('Fire alarm', 'recall'),\n]\nfor name, metric in scenarios:\n    print(f'{name}: {metric.upper()}')",
        solution: "# Context determines metric",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Metrics chosen", description: "Metric selection" }]),
        hints: ["FN costly -> recall", "FP costly -> precision", "Think about impact"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson19_3_3.id,
        number: 5,
        title: "Complete Evaluation Report",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a complete model evaluation report with all metrics.",
        starterCode: "# Calculate all metrics and display professional report",
        solution: "# Complete evaluation report",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Full report", description: "Complete report" }]),
        hints: ["Calculate all metrics", "Format nicely", "Include confusion matrix"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 19.3.3`);

  console.log("\n✅ Part 4 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
