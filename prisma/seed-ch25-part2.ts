import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Chapter 25 Part 2...");

  const chapter25 = await prisma.chapter.findFirst({ where: { number: 25 } });
  if (!chapter25) {
    console.error("Chapter 25 not found!");
    process.exit(1);
  }

  const section25_1 = await prisma.section.findFirst({
    where: { chapterId: chapter25.id, number: 25.1 },
  });
  if (!section25_1) {
    console.error("Section 25.1 not found!");
    process.exit(1);
  }

  const lesson25_1_2 = await prisma.lesson.upsert({
    where: { slug: "ml-types-supervised-unsupervised-reinforcement" },
    update: {},
    create: {
      sectionId: section25_1.id,
      number: 25.12,
      title: "Supervised vs Unsupervised vs Reinforcement Learning",
      slug: "ml-types-supervised-unsupervised-reinforcement",
      objectives: [
        "Understand the three main types of machine learning",
        "Identify which type fits a given problem",
        "Know the key characteristics of each type",
        "Recognize real-world examples of each",
      ],
      content: "# Types of Machine Learning\n\n## The Three Main Types\n\n1. **Supervised Learning** - Learn from labeled examples\n2. **Unsupervised Learning** - Find patterns without labels\n3. **Reinforcement Learning** - Learn from trial and error\n\n## Supervised Learning\n\nThe algorithm learns from labeled data - examples where we know the correct answer.\n\n**Classification:** Predict a category (Spam/Not Spam)\n**Regression:** Predict a number (House price)\n\n## Unsupervised Learning\n\nFind patterns in unlabeled data.\n\n**Clustering:** Group similar items\n**Anomaly Detection:** Find outliers\n\n## Reinforcement Learning\n\nLearn through trial and error with rewards.\n\nAgent takes actions, gets rewards/penalties, learns to maximize reward.",
      codeExamples: JSON.stringify([
        {
          id: "supervised-example",
          title: "Supervised Learning",
          code: "import numpy as np\n\n# Labeled data\nX = np.array([[1400, 3], [1600, 3], [1900, 4]])\ny = np.array([245, 280, 350])  # Prices\n\nprint('Supervised: We have labels!')\nfor features, price in zip(X, y):\n    print(f'  {features} -> ${price}k')",
          description: "Supervised learning with labels",
        },
        {
          id: "unsupervised-example",
          title: "Unsupervised Learning",
          code: "import numpy as np\n\n# No labels!\ncustomers = np.array([[200, 2], [500, 10], [900, 25]])\n\nprint('Unsupervised: Finding patterns')\nfor spending, visits in customers:\n    if spending < 300:\n        print(f'  ${spending} -> Budget')\n    elif spending < 600:\n        print(f'  ${spending} -> Regular')\n    else:\n        print(f'  ${spending} -> Premium')",
          description: "Unsupervised clustering",
        },
      ]),
      keyPoints: [
        "Supervised: Learn from labeled data",
        "Unsupervised: Find patterns without labels",
        "Reinforcement: Learn through trial and error",
        "Classification predicts categories",
        "Regression predicts numbers",
      ],
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });
  console.log("Created Lesson 25.1.2");

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson25_1_2.id,
        number: 1,
        title: "Classify ML Problems",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Identify each problem as Supervised-Classification, Supervised-Regression, Unsupervised, or Reinforcement:\n1. Predict loan default\n2. Group news articles\n3. Train drone navigation\n4. Predict stock price",
        starterCode: "answers = {\n    1: '',\n    2: '',\n    3: '',\n    4: '',\n}\n\nfor num, ans in answers.items():\n    print(f'{num}. {ans}')",
        solution: "answers = {\n    1: 'Supervised-Classification',\n    2: 'Unsupervised',\n    3: 'Reinforcement',\n    4: 'Supervised-Regression',\n}\n\nfor num, ans in answers.items():\n    print(f'{num}. {ans}')",
        testCases: JSON.stringify([]),
        hints: ["Classification = categories", "Regression = numbers", "No labels = Unsupervised"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson25_1_2.id,
        number: 2,
        title: "Create Supervised Data",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create X (features) and y (labels) for student pass/fail prediction.",
        starterCode: "import numpy as np\n\n# Students: [study_hours, sleep_hours]\n# Labels: 1=pass, 0=fail\n\nX = np.array([\n    # Add data\n])\n\ny = np.array([])\n\nprint(f'X shape: {X.shape}')\nprint(f'y shape: {y.shape}')",
        solution: "import numpy as np\n\nX = np.array([\n    [5, 8],\n    [2, 4],\n    [6, 7],\n    [1, 9],\n])\n\ny = np.array([1, 0, 1, 0])\n\nprint(f'X shape: {X.shape}')\nprint(f'y shape: {y.shape}')",
        testCases: JSON.stringify([]),
        hints: ["X is 2D array", "y is 1D array", "1=pass, 0=fail"],
        xpReward: 15,
        order: 2,
      },
    ],
  });
  console.log("Created exercises for 25.1.2");

  const lesson25_1_3 = await prisma.lesson.upsert({
    where: { slug: "features-and-labels" },
    update: {},
    create: {
      sectionId: section25_1.id,
      number: 25.13,
      title: "Features and Labels",
      slug: "features-and-labels",
      objectives: [
        "Understand what features and labels are",
        "Identify features and labels in datasets",
        "Know the difference between X and y",
      ],
      content: "# Features and Labels\n\n## Features (X)\nInput data used to make predictions.\n- House: sqft, bedrooms, location\n- Email: word count, sender, links\n\n## Labels (y)\nOutput we want to predict.\n- House price: $350,000\n- Email: spam or not spam\n\n## X and y Together\nFeatures -> Label\n[1500, 3] -> $350k\n[2000, 4] -> $450k\n\nModel learns: f(X) = y",
      codeExamples: JSON.stringify([
        {
          id: "basic-xy",
          title: "Features and Labels",
          code: "import numpy as np\n\nX = np.array([[1500, 3], [2000, 4], [1200, 2]])\ny = np.array([350, 450, 280])\n\nprint('X shape:', X.shape)\nprint('y shape:', y.shape)\n\nfor i in range(len(X)):\n    print(f'House {i+1}: {X[i]} -> ${y[i]}k')",
          description: "Basic X and y",
        },
      ]),
      keyPoints: [
        "Features (X) = inputs",
        "Labels (y) = outputs to predict",
        "X shape: (samples, features)",
        "y shape: (samples,)",
      ],
      estimatedTime: 20,
      difficulty: "BEGINNER",
      order: 3,
      isPublished: true,
    },
  });
  console.log("Created Lesson 25.1.3");

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson25_1_3.id,
        number: 1,
        title: "Create Feature Matrix",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create X and y for car prices. Features: mileage, age, hp.",
        starterCode: "import numpy as np\n\nX = np.array([\n    # [mileage, age, hp]\n])\n\ny = np.array([])  # prices\n\nprint(X)\nprint(y)",
        solution: "import numpy as np\n\nX = np.array([\n    [50000, 3, 200],\n    [30000, 1, 250],\n    [80000, 5, 180],\n])\n\ny = np.array([25, 35, 18])\n\nprint(X)\nprint(y)",
        testCases: JSON.stringify([]),
        hints: ["X: 3 rows, 3 columns", "y: 3 values"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson25_1_3.id,
        number: 2,
        title: "Access Features",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Extract: first row, second column, last row from X.",
        starterCode: "import numpy as np\n\nX = np.array([[1500, 3], [2000, 4], [1200, 2]])\n\nfirst_row = # X[?]\nall_bedrooms = # X[:, ?]\nlast_row = # X[?]\n\nprint(first_row)\nprint(all_bedrooms)\nprint(last_row)",
        solution: "import numpy as np\n\nX = np.array([[1500, 3], [2000, 4], [1200, 2]])\n\nfirst_row = X[0]\nall_bedrooms = X[:, 1]\nlast_row = X[-1]\n\nprint(first_row)\nprint(all_bedrooms)\nprint(last_row)",
        testCases: JSON.stringify([]),
        hints: ["X[0] = first row", "X[:, 1] = column 1", "X[-1] = last row"],
        xpReward: 10,
        order: 2,
      },
    ],
  });
  console.log("Created exercises for 25.1.3");

  const lesson25_1_4 = await prisma.lesson.upsert({
    where: { slug: "train-validation-test-sets" },
    update: {},
    create: {
      sectionId: section25_1.id,
      number: 25.14,
      title: "Training, Validation, and Test Sets",
      slug: "train-validation-test-sets",
      objectives: [
        "Understand why we split data",
        "Know train/val/test purposes",
        "Learn proper split ratios",
        "Avoid data leakage",
      ],
      content: "# Train/Val/Test Sets\n\n## Why Split?\nAvoid memorization, ensure generalization.\n\n## Three Sets\n- Training (70%): Model learns\n- Validation (15%): Tune parameters\n- Test (15%): Final evaluation\n\n## Data Leakage\nDONT: Normalize before splitting\nDO: Split first, then normalize using training stats only",
      codeExamples: JSON.stringify([
        {
          id: "split",
          title: "Train/Test Split",
          code: "import numpy as np\n\nX = np.arange(10)\nsplit = int(len(X) * 0.8)\n\nX_train = X[:split]\nX_test = X[split:]\n\nprint('Train:', X_train)\nprint('Test:', X_test)",
          description: "Basic split",
        },
      ]),
      keyPoints: [
        "Train: model learns (70%)",
        "Val: tune params (15%)",
        "Test: final eval (15%)",
        "Split FIRST, normalize AFTER",
      ],
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 4,
      isPublished: true,
    },
  });
  console.log("Created Lesson 25.1.4");

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson25_1_4.id,
        number: 1,
        title: "Basic Split",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Split data 80/20 into train and test.",
        starterCode: "import numpy as np\n\nX = np.array([1,2,3,4,5,6,7,8,9,10])\n\nsplit_idx = # 80%\nX_train = # first part\nX_test = # second part\n\nprint('Train:', X_train)\nprint('Test:', X_test)",
        solution: "import numpy as np\n\nX = np.array([1,2,3,4,5,6,7,8,9,10])\n\nsplit_idx = int(len(X) * 0.8)\nX_train = X[:split_idx]\nX_test = X[split_idx:]\n\nprint('Train:', X_train)\nprint('Test:', X_test)",
        testCases: JSON.stringify([]),
        hints: ["split_idx = int(len(X) * 0.8)", "Use slicing"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson25_1_4.id,
        number: 2,
        title: "Shuffled Split",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Shuffle data before splitting.",
        starterCode: "import numpy as np\nnp.random.seed(42)\n\nX = np.array([1,2,3,4,5,6,7,8,9,10])\n\n# Shuffle indices\nindices = # np.random.permutation\nX_shuffled = # X[indices]\n\n# Split\nX_train = X_shuffled[:8]\nX_test = X_shuffled[8:]\n\nprint('Shuffled:', X_shuffled)\nprint('Train:', X_train)",
        solution: "import numpy as np\nnp.random.seed(42)\n\nX = np.array([1,2,3,4,5,6,7,8,9,10])\n\nindices = np.random.permutation(len(X))\nX_shuffled = X[indices]\n\nX_train = X_shuffled[:8]\nX_test = X_shuffled[8:]\n\nprint('Shuffled:', X_shuffled)\nprint('Train:', X_train)",
        testCases: JSON.stringify([]),
        hints: ["np.random.permutation(n)", "X[indices] to shuffle"],
        xpReward: 15,
        order: 2,
      },
    ],
  });
  console.log("Created exercises for 25.1.4");

  console.log("\nChapter 25 Part 2 complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
