import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 1: Chapter 19 structure + Lessons 19.1.1-19.1.2...\n");

  const chapter19 = await prisma.chapter.upsert({
    where: { number: 19 },
    update: {},
    create: {
      number: 19,
      title: "Introduction to Machine Learning",
      description: "Learn the fundamentals of machine learning - teaching computers to learn from data. Covers supervised learning, KNN algorithm, model evaluation, and avoiding common pitfalls like overfitting.",
      objectives: [
        "Understand supervised vs unsupervised learning",
        "Work with features, labels, and training data",
        "Implement K-Nearest Neighbors from scratch",
        "Evaluate models with proper train/test splits",
        "Recognize and avoid overfitting",
      ],
      isPublished: true,
    },
  });
  console.log(`✅ Chapter ${chapter19.number}: ${chapter19.title}`);

  const section19_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter19.id, number: 19.1 } },
    update: {},
    create: {
      chapterId: chapter19.id,
      number: 19.1,
      title: "Machine Learning Fundamentals",
      description: "Core concepts: types of learning, features, labels, and data splitting.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section19_1.number}: ${section19_1.title}`);

  const section19_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter19.id, number: 19.2 } },
    update: {},
    create: {
      chapterId: chapter19.id,
      number: 19.2,
      title: "K-Nearest Neighbors",
      description: "Implement and understand the KNN algorithm.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section19_2.number}: ${section19_2.title}`);

  const section19_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter19.id, number: 19.3 } },
    update: {},
    create: {
      chapterId: chapter19.id,
      number: 19.3,
      title: "Model Evaluation",
      description: "Evaluate models properly and avoid common pitfalls.",
      order: 3,
    },
  });
  console.log(`  📂 Section ${section19_3.number}: ${section19_3.title}`);

  const lesson19_1_1 = await prisma.lesson.upsert({
    where: { slug: "what-is-machine-learning" },
    update: {},
    create: {
      sectionId: section19_1.id,
      number: 19.11,
      title: "What is Machine Learning?",
      slug: "what-is-machine-learning",
      objectives: [
        "Define machine learning",
        "Understand learning from data vs explicit programming",
        "Recognize ML applications in daily life",
        "Understand the ML workflow",
      ],
      content: `# What is Machine Learning?

## Traditional Programming vs Machine Learning

**Traditional Programming:**
\`\`\`
Input + Rules → Output
\`\`\`
You write explicit rules: "if email contains 'free money', it's spam"

**Machine Learning:**
\`\`\`
Input + Output → Rules (learned)
\`\`\`
Computer learns rules from examples: "here are 10,000 spam and non-spam emails, figure out the patterns"

## Formal Definition

Machine Learning is:
> A computer program that **learns from experience E** with respect to some **task T** and **performance measure P**, if its performance on T improves with E.

Example - Spam Filter:
- **Task T**: Classify emails as spam or not
- **Experience E**: Many labeled emails (spam/not-spam)
- **Performance P**: Accuracy (% correctly classified)

## Why Machine Learning?

Some problems are too complex for explicit rules:
- Face recognition (millions of pixel combinations)
- Language translation (infinite sentence variations)
- Product recommendations (complex user preferences)

ML finds patterns humans can't explicitly program!

## ML Workflow

1. **Collect data**: Gather examples
2. **Prepare data**: Clean, format, split
3. **Train model**: Learn from training data
4. **Evaluate**: Test on held-out data
5. **Deploy**: Use model on new data
6. **Iterate**: Improve based on results`,
      codeExamples: JSON.stringify([
        {
          id: "traditional-vs-ml",
          title: "Traditional Rules vs ML",
          code: "# Traditional approach: Write explicit rules\ndef is_spam_rules(email):\n    spam_words = ['free', 'winner', 'click now', 'urgent']\n    email_lower = email.lower()\n    for word in spam_words:\n        if word in email_lower:\n            return True\n    return False\n\n# ML approach: Learn from examples\n# (simplified conceptual example)\ndef learn_spam_patterns(labeled_emails):\n    \"\"\"Learn which words appear more in spam\"\"\"\n    spam_word_freq = {}\n    ham_word_freq = {}\n    \n    for email, is_spam in labeled_emails:\n        words = email.lower().split()\n        freq = spam_word_freq if is_spam else ham_word_freq\n        for word in words:\n            freq[word] = freq.get(word, 0) + 1\n    \n    return spam_word_freq, ham_word_freq\n\n# Example training data\ntraining_data = [\n    ('Free money click now!', True),\n    ('Meeting at 3pm tomorrow', False),\n    ('You are a winner!', True),\n    ('Project update attached', False),\n]\n\nprint('Traditional rules:')\nprint(f'  \"Free money click now!\" → Spam: {is_spam_rules(\"Free money click now!\")}')\nprint(f'  \"Meeting tomorrow\" → Spam: {is_spam_rules(\"Meeting tomorrow\")}')\n\nprint('\\nML learns patterns from data...')\nspam_freq, ham_freq = learn_spam_patterns(training_data)\nprint(f'  Spam words: {spam_freq}')\nprint(f'  Ham words: {ham_freq}')",
          description: "Compare rule-based vs learning approaches",
        },
        {
          id: "ml-applications",
          title: "ML Applications You Use Daily",
          code: "applications = [\n    {\n        'app': 'Email Spam Filter',\n        'task': 'Classify emails',\n        'learns_from': 'Your spam/not-spam actions',\n    },\n    {\n        'app': 'Netflix Recommendations',\n        'task': 'Suggest movies',\n        'learns_from': 'What you watch and rate',\n    },\n    {\n        'app': 'Voice Assistant (Siri/Alexa)',\n        'task': 'Understand speech',\n        'learns_from': 'Millions of voice recordings',\n    },\n    {\n        'app': 'Photo Organization',\n        'task': 'Recognize faces',\n        'learns_from': 'Photos you tag',\n    },\n    {\n        'app': 'Autocomplete/Autocorrect',\n        'task': 'Predict text',\n        'learns_from': 'How people type',\n    },\n]\n\nprint('ML Applications in Daily Life:')\nprint('=' * 50)\nfor app in applications:\n    print(f\"\\n{app['app']}\")\n    print(f\"  Task: {app['task']}\")\n    print(f\"  Learns from: {app['learns_from']}\")",
          description: "ML is everywhere in modern technology",
        },
        {
          id: "ml-workflow",
          title: "The ML Workflow",
          code: "# Simplified ML workflow demonstration\nimport random\n\n# Step 1: Collect data\nprint('Step 1: Collect Data')\ndata = [\n    (150, 'short'), (155, 'short'), (160, 'medium'),\n    (165, 'medium'), (170, 'medium'), (175, 'tall'),\n    (180, 'tall'), (185, 'tall'), (190, 'tall'),\n]\nprint(f'  Collected {len(data)} height measurements')\n\n# Step 2: Prepare data (split)\nprint('\\nStep 2: Prepare Data')\nrandom.shuffle(data)\ntrain = data[:7]\ntest = data[7:]\nprint(f'  Training set: {len(train)}, Test set: {len(test)}')\n\n# Step 3: Train model (simplified)\nprint('\\nStep 3: Train Model')\navg_by_label = {}\nfor height, label in train:\n    if label not in avg_by_label:\n        avg_by_label[label] = []\n    avg_by_label[label].append(height)\n\nfor label in avg_by_label:\n    avg_by_label[label] = sum(avg_by_label[label]) / len(avg_by_label[label])\nprint(f'  Learned averages: {avg_by_label}')\n\n# Step 4: Evaluate\nprint('\\nStep 4: Evaluate')\ncorrect = 0\nfor height, true_label in test:\n    # Predict: find closest average\n    predicted = min(avg_by_label, key=lambda l: abs(avg_by_label[l] - height))\n    if predicted == true_label:\n        correct += 1\nprint(f'  Accuracy: {correct}/{len(test)}')\n\n# Step 5: Use on new data\nprint('\\nStep 5: Deploy - Classify new person')\nnew_height = 168\npredicted = min(avg_by_label, key=lambda l: abs(avg_by_label[l] - new_height))\nprint(f'  Height {new_height}cm → Predicted: {predicted}')",
          description: "Complete ML workflow from data to deployment",
        },
      ]),
      keyPoints: [
        "ML: computer learns rules from data, not explicit programming",
        "Task + Experience + Performance measure",
        "ML excels when rules are too complex to write",
        "Workflow: collect, prepare, train, evaluate, deploy",
        "ML powers spam filters, recommendations, voice assistants",
        "The model improves with more/better data",
      ],
      hardwareDemo: "Watch data flow through ML pipeline. See pattern extraction from examples.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson19_1_1.number}: ${lesson19_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson19_1_1.id,
        number: 1,
        title: "Identify ML vs Traditional",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Classify each problem as 'ML' (better with machine learning) or 'Rules' (better with explicit rules). Print your reasoning.",
        starterCode: "problems = [\n    ('Calculate 15% tip on a restaurant bill', 'Rules'),\n    ('Recognize cats vs dogs in photos', 'ML'),\n    ('Convert Celsius to Fahrenheit', 'Rules'),\n    ('Predict if a customer will cancel subscription', 'ML'),\n    ('Sort a list of numbers', 'Rules'),\n    ('Translate English to Spanish', 'ML'),\n]\n\nprint('Problem Classification:')\nprint('=' * 50)\nfor problem, approach in problems:\n    if approach == 'ML':\n        reason = 'Too many patterns for explicit rules'\n    else:\n        reason = 'Clear formula/algorithm exists'\n    print(f'\\n{problem}')\n    print(f'  → {approach}: {reason}')",
        solution: "problems = [\n    ('Calculate 15% tip on a restaurant bill', 'Rules'),\n    ('Recognize cats vs dogs in photos', 'ML'),\n    ('Convert Celsius to Fahrenheit', 'Rules'),\n    ('Predict if a customer will cancel subscription', 'ML'),\n    ('Sort a list of numbers', 'Rules'),\n    ('Translate English to Spanish', 'ML'),\n]\n\nprint('Problem Classification:')\nprint('=' * 50)\nfor problem, approach in problems:\n    if approach == 'ML':\n        reason = 'Too many patterns for explicit rules'\n    else:\n        reason = 'Clear formula/algorithm exists'\n    print(f'\\n{problem}')\n    print(f'  → {approach}: {reason}')\n\nprint('\\n' + '=' * 50)\nprint('Rule of thumb: If you can write a formula, use Rules.')\nprint('If patterns are complex/unknown, use ML.')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Classifications with reasoning", description: "ML vs Rules" }]),
        hints: ["Simple formulas = Rules", "Pattern recognition = ML", "Prediction from data = ML"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson19_1_1.id,
        number: 2,
        title: "Define Task, Experience, Performance",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "For a movie recommendation system, define the Task, Experience, and Performance measure.",
        starterCode: "# Movie Recommendation System\nmovie_recommender = {\n    'task': 'Recommend movies a user will enjoy',\n    'experience': 'User ratings, watch history, preferences',\n    'performance': 'Percentage of recommended movies user actually watches/likes',\n}\n\nprint('Movie Recommendation ML System')\nprint('=' * 40)\nprint(f\"Task (T): {movie_recommender['task']}\")\nprint(f\"Experience (E): {movie_recommender['experience']}\")\nprint(f\"Performance (P): {movie_recommender['performance']}\")\n\n# Your turn: Define for a credit card fraud detector\nfraud_detector = {\n    'task': 'Detect fraudulent transactions',\n    'experience': 'Historical transactions labeled fraud/legitimate',\n    'performance': 'Accuracy of fraud detection (catch rate)',\n}\n\nprint('\\nCredit Card Fraud Detection')\nprint('=' * 40)\nprint(f\"Task (T): {fraud_detector['task']}\")\nprint(f\"Experience (E): {fraud_detector['experience']}\")\nprint(f\"Performance (P): {fraud_detector['performance']}\")",
        solution: "movie_recommender = {\n    'task': 'Recommend movies a user will enjoy',\n    'experience': 'User ratings, watch history, preferences',\n    'performance': 'Percentage of recommended movies user actually watches/likes',\n}\n\nprint('Movie Recommendation ML System')\nprint('=' * 40)\nprint(f\"Task (T): {movie_recommender['task']}\")\nprint(f\"Experience (E): {movie_recommender['experience']}\")\nprint(f\"Performance (P): {movie_recommender['performance']}\")\n\nfraud_detector = {\n    'task': 'Detect fraudulent transactions',\n    'experience': 'Historical transactions labeled fraud/legitimate',\n    'performance': 'Accuracy of fraud detection (catch rate)',\n}\n\nprint('\\nCredit Card Fraud Detection')\nprint('=' * 40)\nprint(f\"Task (T): {fraud_detector['task']}\")\nprint(f\"Experience (E): {fraud_detector['experience']}\")\nprint(f\"Performance (P): {fraud_detector['performance']}\")\n\nprint('\\nT-E-P framework helps define any ML problem!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "T-E-P defined for both systems", description: "TEP framework" }]),
        hints: ["Task: what the system does", "Experience: data it learns from", "Performance: how we measure success"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson19_1_1.id,
        number: 3,
        title: "Simple Pattern Learner",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a simple 'learner' that counts word frequencies in positive vs negative reviews.",
        starterCode: "def learn_sentiment_patterns(reviews):\n    positive_words = {}\n    negative_words = {}\n    \n    for text, sentiment in reviews:\n        words = text.lower().split()\n        word_dict = positive_words if sentiment == 'positive' else negative_words\n        for word in words:\n            word_dict[word] = word_dict.get(word, 0) + 1\n    \n    return positive_words, negative_words\n\nreviews = [\n    ('This movie was great and amazing', 'positive'),\n    ('Loved this film so much', 'positive'),\n    ('Great acting and story', 'positive'),\n    ('Terrible waste of time', 'negative'),\n    ('Boring and awful movie', 'negative'),\n    ('Worst film I have seen', 'negative'),\n]\n\npos_words, neg_words = learn_sentiment_patterns(reviews)\n\nprint('Learned Patterns:')\nprint('\\nPositive review words:')\nfor word, count in sorted(pos_words.items(), key=lambda x: -x[1])[:5]:\n    print(f'  {word}: {count}')\n\nprint('\\nNegative review words:')\nfor word, count in sorted(neg_words.items(), key=lambda x: -x[1])[:5]:\n    print(f'  {word}: {count}')",
        solution: "def learn_sentiment_patterns(reviews):\n    positive_words = {}\n    negative_words = {}\n    \n    for text, sentiment in reviews:\n        words = text.lower().split()\n        word_dict = positive_words if sentiment == 'positive' else negative_words\n        for word in words:\n            word_dict[word] = word_dict.get(word, 0) + 1\n    \n    return positive_words, negative_words\n\nreviews = [\n    ('This movie was great and amazing', 'positive'),\n    ('Loved this film so much', 'positive'),\n    ('Great acting and story', 'positive'),\n    ('Terrible waste of time', 'negative'),\n    ('Boring and awful movie', 'negative'),\n    ('Worst film I have seen', 'negative'),\n]\n\npos_words, neg_words = learn_sentiment_patterns(reviews)\n\nprint('Learned Patterns:')\nprint('\\nPositive review words:')\nfor word, count in sorted(pos_words.items(), key=lambda x: -x[1])[:5]:\n    print(f'  {word}: {count}')\n\nprint('\\nNegative review words:')\nfor word, count in sorted(neg_words.items(), key=lambda x: -x[1])[:5]:\n    print(f'  {word}: {count}')\n\nprint('\\nThe ML system learned: great, loved, amazing = positive')\nprint('terrible, boring, awful, worst = negative')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Word patterns extracted", description: "Pattern learning" }]),
        hints: ["Split text into words", "Count words per sentiment", "Sort by frequency to see patterns"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson19_1_1.id,
        number: 4,
        title: "Use Learned Patterns to Predict",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use the learned word patterns to predict sentiment of new reviews.",
        starterCode: "# Previous: learned patterns\npositive_indicators = {'great': 2, 'amazing': 1, 'loved': 1, 'good': 1}\nnegative_indicators = {'terrible': 1, 'awful': 1, 'boring': 1, 'worst': 1, 'bad': 1}\n\ndef predict_sentiment(text):\n    words = text.lower().split()\n    pos_score = 0\n    neg_score = 0\n    \n    for word in words:\n        if word in positive_indicators:\n            pos_score += positive_indicators[word]\n        if word in negative_indicators:\n            neg_score += negative_indicators[word]\n    \n    if pos_score > neg_score:\n        return 'positive', pos_score, neg_score\n    elif neg_score > pos_score:\n        return 'negative', pos_score, neg_score\n    else:\n        return 'neutral', pos_score, neg_score\n\ntest_reviews = [\n    'This was a great movie',\n    'Terrible and boring film',\n    'It was okay I guess',\n    'Amazing story but awful ending',\n]\n\nprint('Sentiment Predictions:')\nfor review in test_reviews:\n    sentiment, pos, neg = predict_sentiment(review)\n    print(f'\\n\"{review}\"')\n    print(f'  Scores: positive={pos}, negative={neg}')\n    print(f'  Prediction: {sentiment}')",
        solution: "positive_indicators = {'great': 2, 'amazing': 1, 'loved': 1, 'good': 1}\nnegative_indicators = {'terrible': 1, 'awful': 1, 'boring': 1, 'worst': 1, 'bad': 1}\n\ndef predict_sentiment(text):\n    words = text.lower().split()\n    pos_score = 0\n    neg_score = 0\n    \n    for word in words:\n        if word in positive_indicators:\n            pos_score += positive_indicators[word]\n        if word in negative_indicators:\n            neg_score += negative_indicators[word]\n    \n    if pos_score > neg_score:\n        return 'positive', pos_score, neg_score\n    elif neg_score > pos_score:\n        return 'negative', pos_score, neg_score\n    else:\n        return 'neutral', pos_score, neg_score\n\ntest_reviews = [\n    'This was a great movie',\n    'Terrible and boring film',\n    'It was okay I guess',\n    'Amazing story but awful ending',\n]\n\nprint('Sentiment Predictions:')\nfor review in test_reviews:\n    sentiment, pos, neg = predict_sentiment(review)\n    print(f'\\n\"{review}\"')\n    print(f'  Scores: positive={pos}, negative={neg}')\n    print(f'  Prediction: {sentiment}')\n\nprint('\\nThis is ML in action: learned patterns → predictions!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Predictions for test reviews", description: "Using learned model" }]),
        hints: ["Score based on matching words", "Compare positive vs negative scores", "Majority score wins"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson19_1_1.id,
        number: 5,
        title: "ML Workflow Implementation",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement the complete ML workflow: collect, prepare, train, evaluate, deploy for a simple classifier.",
        starterCode: "import random\n\n# STEP 1: Collect data\nprint('STEP 1: Collect Data')\ndata = [\n    (5.1, 'small'), (4.9, 'small'), (4.7, 'small'), (5.0, 'small'),\n    (7.0, 'medium'), (6.4, 'medium'), (6.9, 'medium'), (6.5, 'medium'),\n    (8.5, 'large'), (8.0, 'large'), (8.7, 'large'), (8.2, 'large'),\n]\nprint(f'  Collected {len(data)} samples')\n\n# STEP 2: Prepare (split)\nprint('\\nSTEP 2: Prepare Data')\nrandom.seed(42)\nshuffled = data.copy()\nrandom.shuffle(shuffled)\ntrain = shuffled[:9]\ntest = shuffled[9:]\nprint(f'  Train: {len(train)}, Test: {len(test)}')\n\n# STEP 3: Train (learn average for each class)\nprint('\\nSTEP 3: Train Model')\nclass_avgs = {}\nfor value, label in train:\n    if label not in class_avgs:\n        class_avgs[label] = []\n    class_avgs[label].append(value)\nfor label in class_avgs:\n    class_avgs[label] = sum(class_avgs[label]) / len(class_avgs[label])\nprint(f'  Learned: {class_avgs}')\n\n# STEP 4: Evaluate\nprint('\\nSTEP 4: Evaluate')\ndef predict(value):\n    return min(class_avgs, key=lambda l: abs(class_avgs[l] - value))\n\ncorrect = sum(1 for v, l in test if predict(v) == l)\nprint(f'  Accuracy: {correct}/{len(test)} = {correct/len(test)*100:.0f}%')\n\n# STEP 5: Deploy\nprint('\\nSTEP 5: Deploy')\nnew_values = [4.5, 6.8, 8.9]\nfor v in new_values:\n    print(f'  Value {v} → {predict(v)}')",
        solution: "import random\n\nprint('STEP 1: Collect Data')\ndata = [\n    (5.1, 'small'), (4.9, 'small'), (4.7, 'small'), (5.0, 'small'),\n    (7.0, 'medium'), (6.4, 'medium'), (6.9, 'medium'), (6.5, 'medium'),\n    (8.5, 'large'), (8.0, 'large'), (8.7, 'large'), (8.2, 'large'),\n]\nprint(f'  Collected {len(data)} samples')\n\nprint('\\nSTEP 2: Prepare Data')\nrandom.seed(42)\nshuffled = data.copy()\nrandom.shuffle(shuffled)\ntrain = shuffled[:9]\ntest = shuffled[9:]\nprint(f'  Train: {len(train)}, Test: {len(test)}')\n\nprint('\\nSTEP 3: Train Model')\nclass_avgs = {}\nfor value, label in train:\n    if label not in class_avgs:\n        class_avgs[label] = []\n    class_avgs[label].append(value)\nfor label in class_avgs:\n    class_avgs[label] = sum(class_avgs[label]) / len(class_avgs[label])\nprint(f'  Learned: {class_avgs}')\n\nprint('\\nSTEP 4: Evaluate')\ndef predict(value):\n    return min(class_avgs, key=lambda l: abs(class_avgs[l] - value))\n\ncorrect = sum(1 for v, l in test if predict(v) == l)\nprint(f'  Accuracy: {correct}/{len(test)} = {correct/len(test)*100:.0f}%')\n\nprint('\\nSTEP 5: Deploy')\nnew_values = [4.5, 6.8, 8.9]\nfor v in new_values:\n    print(f'  Value {v} → {predict(v)}')\n\nprint('\\nComplete ML pipeline!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All 5 steps completed", description: "Full ML workflow" }]),
        hints: ["Split data before training", "Train on train set only", "Evaluate on test set", "Deploy: predict new data"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 19.1.1`);

  const lesson19_1_2 = await prisma.lesson.upsert({
    where: { slug: "supervised-unsupervised-learning" },
    update: {},
    create: {
      sectionId: section19_1.id,
      number: 19.12,
      title: "Supervised vs Unsupervised Learning",
      slug: "supervised-unsupervised-learning",
      objectives: [
        "Distinguish supervised from unsupervised learning",
        "Understand classification vs regression",
        "Recognize clustering as unsupervised",
        "Choose the right approach for a problem",
      ],
      content: `# Supervised vs Unsupervised Learning

## Two Main Categories

### Supervised Learning
Learn from **labeled** data (inputs with known outputs).

Like learning with a teacher who tells you the right answers.

**Examples:**
- Email: "This is spam" / "This is not spam"
- House: "Price is $300,000"
- Image: "This is a cat"

### Unsupervised Learning
Find patterns in **unlabeled** data (no known outputs).

Like exploring data to find hidden structure.

**Examples:**
- Group similar customers together
- Find unusual transactions (anomalies)
- Reduce data dimensions

## Supervised Learning Types

### Classification
Predict a **category/class**.
- Spam or not spam (2 classes)
- Cat, dog, or bird (3 classes)
- Digit 0-9 (10 classes)

### Regression
Predict a **continuous number**.
- House price ($)
- Temperature (°F)
- Stock price ($)

## Comparison

| Aspect | Supervised | Unsupervised |
|--------|------------|--------------|
| Data | Labeled | Unlabeled |
| Goal | Predict labels | Find patterns |
| Example | Classification | Clustering |
| Feedback | Yes (labels) | No |

## Choosing the Right Approach

**Have labels?** → Supervised
**No labels?** → Unsupervised
**Predicting category?** → Classification
**Predicting number?** → Regression`,
      codeExamples: JSON.stringify([
        {
          id: "supervised-classification",
          title: "Supervised: Classification Example",
          code: "# Classification: Predict category from features\n# Data is LABELED (we know the correct fruit type)\n\ntraining_data = [\n    # (weight_g, color_score, fruit_type)\n    (150, 1.0, 'apple'),    # color_score: 0=green, 1=red\n    (160, 0.9, 'apple'),\n    (140, 0.2, 'apple'),    # green apple\n    (120, 1.0, 'orange'),\n    (130, 0.9, 'orange'),\n    (180, 0.1, 'banana'),\n    (170, 0.1, 'banana'),\n]\n\nprint('Supervised Classification: Fruit Identifier')\nprint('=' * 45)\nprint('\\nTraining data (LABELED):')\nfor weight, color, fruit in training_data[:4]:\n    print(f'  Weight={weight}g, Color={color:.1f} → {fruit}')\n\n# Simple classifier: use averages\nfruit_profiles = {}\nfor weight, color, fruit in training_data:\n    if fruit not in fruit_profiles:\n        fruit_profiles[fruit] = {'weights': [], 'colors': []}\n    fruit_profiles[fruit]['weights'].append(weight)\n    fruit_profiles[fruit]['colors'].append(color)\n\nfor fruit in fruit_profiles:\n    w = fruit_profiles[fruit]['weights']\n    c = fruit_profiles[fruit]['colors']\n    fruit_profiles[fruit] = {\n        'avg_weight': sum(w)/len(w),\n        'avg_color': sum(c)/len(c)\n    }\n\nprint('\\nLearned profiles:')\nfor fruit, profile in fruit_profiles.items():\n    print(f\"  {fruit}: weight~{profile['avg_weight']:.0f}g, color~{profile['avg_color']:.1f}\")",
          description: "Classification predicts categories",
        },
        {
          id: "supervised-regression",
          title: "Supervised: Regression Example",
          code: "# Regression: Predict continuous number\n# Data is LABELED (we know the actual prices)\n\nhouse_data = [\n    # (sqft, bedrooms, price)\n    (1000, 2, 200000),\n    (1500, 3, 300000),\n    (2000, 4, 400000),\n    (2500, 4, 500000),\n    (1200, 2, 240000),\n]\n\nprint('Supervised Regression: House Price Prediction')\nprint('=' * 45)\nprint('\\nTraining data (LABELED):')\nfor sqft, beds, price in house_data:\n    print(f'  {sqft}sqft, {beds}bed → ${price:,}')\n\n# Simple regression: price per sqft\ntotal_sqft = sum(h[0] for h in house_data)\ntotal_price = sum(h[2] for h in house_data)\nprice_per_sqft = total_price / total_sqft\n\nprint(f'\\nLearned: ~${price_per_sqft:.0f} per sqft')\n\n# Predict new house\nnew_sqft = 1800\npredicted_price = new_sqft * price_per_sqft\nprint(f'\\nPrediction for {new_sqft}sqft house:')\nprint(f'  Estimated price: ${predicted_price:,.0f}')",
          description: "Regression predicts numbers",
        },
        {
          id: "unsupervised-clustering",
          title: "Unsupervised: Clustering Example",
          code: "# Clustering: Find groups in UNLABELED data\n# We don't know the categories - we discover them!\n\ncustomer_data = [\n    # (age, spending_score) - NO LABELS!\n    (25, 80), (30, 75), (28, 85),  # Young, high spenders\n    (45, 40), (50, 35), (48, 45),  # Middle-aged, moderate\n    (65, 20), (70, 15), (68, 25),  # Older, low spenders\n]\n\nprint('Unsupervised Clustering: Customer Segmentation')\nprint('=' * 50)\nprint('\\nData (NO LABELS - just features):')\nfor age, spending in customer_data:\n    print(f'  Age={age}, Spending Score={spending}')\n\n# Simple clustering: group by spending ranges\ndef simple_cluster(data):\n    clusters = {'high': [], 'medium': [], 'low': []}\n    for age, spending in data:\n        if spending >= 70:\n            clusters['high'].append((age, spending))\n        elif spending >= 35:\n            clusters['medium'].append((age, spending))\n        else:\n            clusters['low'].append((age, spending))\n    return clusters\n\nclusters = simple_cluster(customer_data)\n\nprint('\\nDiscovered clusters:')\nfor cluster_name, members in clusters.items():\n    if members:\n        avg_age = sum(m[0] for m in members) / len(members)\n        print(f'  {cluster_name.upper()} spenders: {len(members)} customers, avg age {avg_age:.0f}')\n\nprint('\\nInsight: Young customers spend more!')\nprint('No labels needed - patterns emerged from data!')",
          description: "Clustering finds groups without labels",
        },
      ]),
      keyPoints: [
        "Supervised: labeled data, predict outputs",
        "Unsupervised: unlabeled data, find patterns",
        "Classification: predict categories",
        "Regression: predict continuous numbers",
        "Clustering: group similar items (unsupervised)",
        "Choose based on: do you have labels?",
      ],
      hardwareDemo: "Watch labeled vs unlabeled data processing. See classification vs clustering.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson19_1_2.number}: ${lesson19_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson19_1_2.id,
        number: 1,
        title: "Classify Problems by Type",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Classify each ML problem as Classification, Regression, or Clustering.",
        starterCode: "problems = [\n    ('Predict house price from size', 'Regression'),\n    ('Detect spam emails', 'Classification'),\n    ('Group similar news articles', 'Clustering'),\n    ('Predict if loan will default', 'Classification'),\n    ('Estimate delivery time in minutes', 'Regression'),\n    ('Find customer segments', 'Clustering'),\n    ('Predict tumor is benign/malignant', 'Classification'),\n    ('Forecast stock price', 'Regression'),\n]\n\nprint('ML Problem Types:')\nprint('=' * 50)\nfor problem, ptype in problems:\n    print(f'\\n{problem}')\n    print(f'  → {ptype}')",
        solution: "problems = [\n    ('Predict house price from size', 'Regression'),\n    ('Detect spam emails', 'Classification'),\n    ('Group similar news articles', 'Clustering'),\n    ('Predict if loan will default', 'Classification'),\n    ('Estimate delivery time in minutes', 'Regression'),\n    ('Find customer segments', 'Clustering'),\n    ('Predict tumor is benign/malignant', 'Classification'),\n    ('Forecast stock price', 'Regression'),\n]\n\nprint('ML Problem Types:')\nprint('=' * 50)\nfor problem, ptype in problems:\n    print(f'\\n{problem}')\n    print(f'  → {ptype}')\n\nprint('\\n' + '=' * 50)\nprint('Classification: yes/no or categories')\nprint('Regression: numbers')\nprint('Clustering: find groups (unsupervised)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Problems classified", description: "Problem type identification" }]),
        hints: ["Categories = Classification", "Numbers = Regression", "Finding groups = Clustering"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson19_1_2.id,
        number: 2,
        title: "Simple Classification",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement a simple classifier that predicts 'pass' or 'fail' based on study hours. Threshold: 5 hours.",
        starterCode: "# Training data: (study_hours, result)\ntraining = [\n    (2, 'fail'), (3, 'fail'), (4, 'fail'),\n    (6, 'pass'), (7, 'pass'), (8, 'pass'),\n    (5, 'pass'), (4.5, 'fail'),\n]\n\n# Learn threshold from data\npass_hours = [h for h, r in training if r == 'pass']\nfail_hours = [h for h, r in training if r == 'fail']\n\navg_pass = sum(pass_hours) / len(pass_hours)\navg_fail = sum(fail_hours) / len(fail_hours)\nthreshold = (avg_pass + avg_fail) / 2\n\nprint(f'Average pass hours: {avg_pass:.1f}')\nprint(f'Average fail hours: {avg_fail:.1f}')\nprint(f'Learned threshold: {threshold:.1f} hours')\n\n# Predict\ndef predict(hours):\n    return 'pass' if hours >= threshold else 'fail'\n\nprint('\\nPredictions:')\nfor test_hours in [3, 5, 7, 4.5]:\n    print(f'  {test_hours} hours → {predict(test_hours)}')",
        solution: "training = [\n    (2, 'fail'), (3, 'fail'), (4, 'fail'),\n    (6, 'pass'), (7, 'pass'), (8, 'pass'),\n    (5, 'pass'), (4.5, 'fail'),\n]\n\npass_hours = [h for h, r in training if r == 'pass']\nfail_hours = [h for h, r in training if r == 'fail']\n\navg_pass = sum(pass_hours) / len(pass_hours)\navg_fail = sum(fail_hours) / len(fail_hours)\nthreshold = (avg_pass + avg_fail) / 2\n\nprint(f'Average pass hours: {avg_pass:.1f}')\nprint(f'Average fail hours: {avg_fail:.1f}')\nprint(f'Learned threshold: {threshold:.1f} hours')\n\ndef predict(hours):\n    return 'pass' if hours >= threshold else 'fail'\n\nprint('\\nPredictions:')\nfor test_hours in [3, 5, 7, 4.5]:\n    print(f'  {test_hours} hours → {predict(test_hours)}')\n\nprint('\\nThis is binary classification!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Threshold learned, predictions made", description: "Binary classification" }]),
        hints: ["Compute average for each class", "Threshold between the averages", "Above threshold = pass"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson19_1_2.id,
        number: 3,
        title: "Simple Regression",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement simple linear regression to predict price from size. Learn price_per_unit.",
        starterCode: "# Training data: (size, price)\ntraining = [\n    (100, 150),\n    (200, 280),\n    (150, 220),\n    (250, 370),\n    (180, 260),\n]\n\n# Learn: price = size * price_per_unit\n# Simple approach: average of (price/size) for each point\nratios = [price / size for size, price in training]\nprice_per_unit = sum(ratios) / len(ratios)\n\nprint('Simple Linear Regression')\nprint('=' * 40)\nprint(f'Learned: price ≈ size × {price_per_unit:.2f}')\n\n# Predict\ndef predict_price(size):\n    return size * price_per_unit\n\nprint('\\nPredictions:')\nfor test_size in [120, 175, 300]:\n    pred = predict_price(test_size)\n    print(f'  Size {test_size} → Price ${pred:.0f}')\n\n# Check training fit\nprint('\\nTraining fit:')\nfor size, actual in training:\n    pred = predict_price(size)\n    error = abs(pred - actual)\n    print(f'  Size {size}: Actual ${actual}, Predicted ${pred:.0f}, Error ${error:.0f}')",
        solution: "training = [\n    (100, 150),\n    (200, 280),\n    (150, 220),\n    (250, 370),\n    (180, 260),\n]\n\nratios = [price / size for size, price in training]\nprice_per_unit = sum(ratios) / len(ratios)\n\nprint('Simple Linear Regression')\nprint('=' * 40)\nprint(f'Learned: price ≈ size × {price_per_unit:.2f}')\n\ndef predict_price(size):\n    return size * price_per_unit\n\nprint('\\nPredictions:')\nfor test_size in [120, 175, 300]:\n    pred = predict_price(test_size)\n    print(f'  Size {test_size} → Price ${pred:.0f}')\n\nprint('\\nTraining fit:')\nfor size, actual in training:\n    pred = predict_price(size)\n    error = abs(pred - actual)\n    print(f'  Size {size}: Actual ${actual}, Predicted ${pred:.0f}, Error ${error:.0f}')\n\nprint('\\nRegression predicts continuous values!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Price per unit learned, predictions made", description: "Simple regression" }]),
        hints: ["Learn price/size ratio", "Use average ratio", "Multiply size by ratio to predict"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson19_1_2.id,
        number: 4,
        title: "Simple Clustering",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement simple 1D clustering: group data points into 'low', 'medium', 'high' based on value ranges.",
        starterCode: "# Unlabeled data - just values!\ndata = [12, 45, 78, 23, 56, 89, 34, 67, 91, 15, 48, 82]\n\ndef simple_cluster(values):\n    min_val = min(values)\n    max_val = max(values)\n    range_size = (max_val - min_val) / 3\n    \n    clusters = {'low': [], 'medium': [], 'high': []}\n    \n    for v in values:\n        if v < min_val + range_size:\n            clusters['low'].append(v)\n        elif v < min_val + 2 * range_size:\n            clusters['medium'].append(v)\n        else:\n            clusters['high'].append(v)\n    \n    return clusters\n\nprint('Unsupervised Clustering')\nprint('=' * 40)\nprint(f'Data: {data}')\nprint(f'Min: {min(data)}, Max: {max(data)}')\n\nclusters = simple_cluster(data)\n\nprint('\\nDiscovered clusters:')\nfor name, members in clusters.items():\n    if members:\n        avg = sum(members) / len(members)\n        print(f'  {name.upper()}: {sorted(members)}')\n        print(f'    Average: {avg:.1f}')",
        solution: "data = [12, 45, 78, 23, 56, 89, 34, 67, 91, 15, 48, 82]\n\ndef simple_cluster(values):\n    min_val = min(values)\n    max_val = max(values)\n    range_size = (max_val - min_val) / 3\n    \n    clusters = {'low': [], 'medium': [], 'high': []}\n    \n    for v in values:\n        if v < min_val + range_size:\n            clusters['low'].append(v)\n        elif v < min_val + 2 * range_size:\n            clusters['medium'].append(v)\n        else:\n            clusters['high'].append(v)\n    \n    return clusters\n\nprint('Unsupervised Clustering')\nprint('=' * 40)\nprint(f'Data: {data}')\nprint(f'Min: {min(data)}, Max: {max(data)}')\n\nclusters = simple_cluster(data)\n\nprint('\\nDiscovered clusters:')\nfor name, members in clusters.items():\n    if members:\n        avg = sum(members) / len(members)\n        print(f'  {name.upper()}: {sorted(members)}')\n        print(f'    Average: {avg:.1f}')\n\nprint('\\nNo labels needed - groups discovered automatically!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Three clusters discovered", description: "Simple clustering" }]),
        hints: ["Divide range into thirds", "Assign each point to a cluster", "No labels in input!"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson19_1_2.id,
        number: 5,
        title: "Supervised vs Unsupervised Comparison",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Use same data with both supervised (given labels) and unsupervised (find clusters) approaches. Compare results.",
        starterCode: "# Same data, two approaches\ndata_points = [10, 15, 12, 50, 55, 48, 90, 95, 88]\n\n# SUPERVISED: We have labels\nlabeled_data = [\n    (10, 'A'), (15, 'A'), (12, 'A'),\n    (50, 'B'), (55, 'B'), (48, 'B'),\n    (90, 'C'), (95, 'C'), (88, 'C'),\n]\n\nprint('SUPERVISED APPROACH')\nprint('=' * 40)\nprint('We have labels: A, B, C')\n\n# Learn averages for each class\nclass_avgs = {}\nfor val, label in labeled_data:\n    if label not in class_avgs:\n        class_avgs[label] = []\n    class_avgs[label].append(val)\nfor label in class_avgs:\n    class_avgs[label] = sum(class_avgs[label]) / len(class_avgs[label])\n\nprint(f'Learned class centers: {class_avgs}')\n\n# Predict new point\nnew_point = 52\npredicted = min(class_avgs, key=lambda l: abs(class_avgs[l] - new_point))\nprint(f'New point {new_point} → Predicted class: {predicted}')\n\nprint('\\nUNSUPERVISED APPROACH')\nprint('=' * 40)\nprint('NO labels - discover clusters')\n\n# Simple clustering\nmin_v, max_v = min(data_points), max(data_points)\nrange_size = (max_v - min_v) / 3\n\nclusters = {}\nfor v in data_points:\n    if v < min_v + range_size:\n        cluster = 'cluster_1'\n    elif v < min_v + 2 * range_size:\n        cluster = 'cluster_2'\n    else:\n        cluster = 'cluster_3'\n    if cluster not in clusters:\n        clusters[cluster] = []\n    clusters[cluster].append(v)\n\nprint('Discovered clusters:')\nfor name, members in sorted(clusters.items()):\n    print(f'  {name}: {members}')\n\nprint('\\nBoth found 3 groups - but supervised KNEW the labels!')",
        solution: "data_points = [10, 15, 12, 50, 55, 48, 90, 95, 88]\n\nlabeled_data = [\n    (10, 'A'), (15, 'A'), (12, 'A'),\n    (50, 'B'), (55, 'B'), (48, 'B'),\n    (90, 'C'), (95, 'C'), (88, 'C'),\n]\n\nprint('SUPERVISED APPROACH')\nprint('=' * 40)\nprint('We have labels: A, B, C')\n\nclass_avgs = {}\nfor val, label in labeled_data:\n    if label not in class_avgs:\n        class_avgs[label] = []\n    class_avgs[label].append(val)\nfor label in class_avgs:\n    class_avgs[label] = sum(class_avgs[label]) / len(class_avgs[label])\n\nprint(f'Learned class centers: {class_avgs}')\n\nnew_point = 52\npredicted = min(class_avgs, key=lambda l: abs(class_avgs[l] - new_point))\nprint(f'New point {new_point} → Predicted class: {predicted}')\n\nprint('\\nUNSUPERVISED APPROACH')\nprint('=' * 40)\nprint('NO labels - discover clusters')\n\nmin_v, max_v = min(data_points), max(data_points)\nrange_size = (max_v - min_v) / 3\n\nclusters = {}\nfor v in data_points:\n    if v < min_v + range_size:\n        cluster = 'cluster_1'\n    elif v < min_v + 2 * range_size:\n        cluster = 'cluster_2'\n    else:\n        cluster = 'cluster_3'\n    if cluster not in clusters:\n        clusters[cluster] = []\n    clusters[cluster].append(v)\n\nprint('Discovered clusters:')\nfor name, members in sorted(clusters.items()):\n    print(f'  {name}: {members}')\n\nprint('\\nBoth found 3 groups - but supervised KNEW the labels!')\nprint('Supervised: can predict class names (A, B, C)')\nprint('Unsupervised: only knows there are groups')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Both approaches shown", description: "Supervised vs unsupervised" }]),
        hints: ["Supervised uses labels", "Unsupervised discovers structure", "Same data, different goals"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 19.1.2`);

  console.log("\n✅ Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
