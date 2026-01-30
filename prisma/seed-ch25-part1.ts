import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Chapter 25 Part 1: ML Fundamentals (Concept 1)...\n");

  let chapter25 = await prisma.chapter.findFirst({ where: { number: 25 } });
  
  if (!chapter25) {
    chapter25 = await prisma.chapter.create({
      data: {
        number: 25,
        title: "Introduction to Machine Learning",
        description: "Master the fundamentals of machine learning. Learn how computers learn from data, understand different types of ML, build evaluation pipelines, and prepare for advanced AI topics.",
        objectives: [
          "Understand what machine learning is and when to use it",
          "Distinguish between supervised, unsupervised, and reinforcement learning",
          "Build complete ML pipelines from data to deployment",
          "Evaluate models using appropriate metrics",
          "Prevent overfitting and underfitting",
          "Engineer features for better model performance",
        ],
        isPublished: true,
      },
    });
  }
  console.log(`✅ Chapter ${chapter25.number}: ${chapter25.title}`);

  const section25_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter25.id, number: 25.1 } },
    update: {},
    create: {
      chapterId: chapter25.id,
      number: 25.1,
      title: "ML Fundamentals",
      description: "Core concepts of machine learning.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section25_1.number}: ${section25_1.title}`);

  const lesson25_1_1 = await prisma.lesson.upsert({
    where: { slug: "what-is-machine-learning" },
    update: {},
    create: {
      sectionId: section25_1.id,
      number: 25.11,
      title: "What is Machine Learning?",
      slug: "what-is-machine-learning",
      objectives: [
        "Define machine learning and how it differs from traditional programming",
        "Understand when to use ML vs rule-based approaches",
        "Identify real-world ML applications",
        "Explain the basic ML workflow",
      ],
      content: `# What is Machine Learning?

## The Big Picture

Machine learning is a way of programming computers to **learn patterns from data** instead of following manually written rules.

**Traditional Programming:**
\`\`\`
Human writes rules → Computer follows rules → Output
\`\`\`

**Machine Learning:**
\`\`\`
Human provides examples → Computer learns patterns → Output
\`\`\`

## A Simple Analogy

Think about teaching someone to recognize spam emails:

**Traditional approach:** Write a rulebook
- "If email contains 'lottery', mark as spam"
- "If email contains 'viagra', mark as spam"
- Problem: Spammers adapt! They write "l0ttery" or "v1agra"

**ML approach:** Show thousands of examples
- "Here are 10,000 spam emails and 10,000 good emails"
- The computer figures out the patterns itself
- It can even catch tricks it's never seen!

## Why Machine Learning Exists

### 1. Problems Too Complex for Rules
How would you write rules to recognize a face? A cat? Handwriting?

### 2. Rules Change Over Time
Spam patterns evolve monthly, fashion trends change yearly

### 3. Rules Are Unknown
What makes a good movie recommendation? We can't articulate it ourselves!

### 4. Scale
Millions of transactions to check for fraud, billions of web pages to rank

## The ML Workflow

\`\`\`
1. COLLECT DATA → Gather labeled examples
2. TRAIN MODEL → Algorithm finds patterns  
3. EVALUATE → Test on unseen data
4. PREDICT → Use model on new data
\`\`\`

## Real-World Applications

| Domain | Application | Why ML? |
|--------|-------------|---------|
| Email | Spam filtering | Patterns change constantly |
| Shopping | Recommendations | Complex user preferences |
| Voice | Siri, Alexa | Infinite speech variations |
| Cars | Self-driving | Too complex for rules |
| Healthcare | Disease detection | Subtle patterns in images |`,
      codeExamples: JSON.stringify([
        {
          id: "traditional-vs-ml",
          title: "Traditional vs ML Approach",
          code: `# TRADITIONAL PROGRAMMING
def classify_spam_traditional(email):
    spam_words = ['lottery', 'winner', 'free money', 'viagra']
    for word in spam_words:
        if word in email.lower():
            return 'spam'
    return 'not spam'

# Test it
emails = [
    "You won the lottery!",
    "Meeting at 3pm tomorrow",
    "V1AGRA cheap pills!",  # Evades our rules!
]

print("Traditional Approach:")
for email in emails:
    result = classify_spam_traditional(email)
    print(f"  '{email[:25]}' -> {result}")`,
          description: "Traditional programming requires explicit rules",
        },
        {
          id: "ml-approach",
          title: "Machine Learning Approach",
          code: `import numpy as np

class SimpleMLClassifier:
    def __init__(self):
        self.spam_words = {}
        self.ham_words = {}
    
    def fit(self, emails, labels):
        for email, label in zip(emails, labels):
            words = email.lower().split()
            word_dict = self.spam_words if label == 'spam' else self.ham_words
            for word in words:
                word_dict[word] = word_dict.get(word, 0) + 1
        print(f"Learned from {len(emails)} examples")
    
    def predict(self, email):
        words = email.lower().split()
        spam_score = sum(self.spam_words.get(w, 0) for w in words)
        ham_score = sum(self.ham_words.get(w, 0) for w in words)
        return 'spam' if spam_score > ham_score else 'not spam'

# Training data
train_emails = ["you won the lottery click now", "v1agra cheap pills buy now",
                "meeting tomorrow at 3pm", "please review the report"]
train_labels = ['spam', 'spam', 'not spam', 'not spam']

model = SimpleMLClassifier()
model.fit(train_emails, train_labels)

print("ML Approach:")
for email in ["You won the lottery!", "Meeting tomorrow", "V1AGRA pills!"]:
    print(f"  '{email}' -> {model.predict(email)}")`,
          description: "ML learns patterns from examples",
        },
      ]),
      keyPoints: [
        "ML learns patterns from data instead of following explicit rules",
        "Traditional: Human writes rules, ML: Human provides examples",
        "Use ML when rules are complex, changing, or unknown",
        "Use traditional programming when rules are clear and fixed",
        "ML workflow: Collect data → Train → Evaluate → Predict",
      ],
      estimatedTime: 20,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson25_1_1.number}: ${lesson25_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson25_1_1.id,
        number: 1,
        title: "Identify ML vs Traditional",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: `For each problem below, print whether it should use "ML" or "TRADITIONAL" programming:
1. Calculate the area of a circle given radius
2. Recognize handwritten digits
3. Sort names alphabetically
4. Predict which customers will cancel subscription
5. Convert USD to EUR at fixed rate`,
        starterCode: `# Analyze each problem and print your answer
# Format: print("1. TRADITIONAL - reason") or print("1. ML - reason")

# 1. Calculate area of circle given radius
print("1. ")

# 2. Recognize handwritten digits
print("2. ")

# 3. Sort names alphabetically
print("3. ")

# 4. Predict customer cancellation
print("4. ")

# 5. Convert USD to EUR at fixed rate
print("5. ")`,
        solution: `# 1. Calculate area of circle given radius
print("1. TRADITIONAL - Clear formula: pi * r^2, never changes")

# 2. Recognize handwritten digits
print("2. ML - Infinite variations in handwriting, too complex for rules")

# 3. Sort names alphabetically
print("3. TRADITIONAL - Well-defined algorithm exists (alphabetical order)")

# 4. Predict customer cancellation
print("4. ML - Complex patterns in behavior, rules are unknown")

# 5. Convert USD to EUR at fixed rate
print("5. TRADITIONAL - Simple multiplication by fixed rate")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "5 lines with reasoning", description: "Should analyze all 5 problems" },
        ]),
        hints: ["Ask: Are the rules clear and fixed?", "Ask: Does the problem involve pattern recognition?", "Ask: Do the rules change over time?"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson25_1_1.id,
        number: 2,
        title: "Simple Rule-Based Classifier",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: `Create a rule-based function to classify fruits as "citrus" or "not citrus" based on keywords.
Citrus keywords: orange, lemon, lime, grapefruit, citrus`,
        starterCode: `def classify_fruit(description):
    """Classify fruit as citrus or not citrus."""
    citrus_words = ['orange', 'lemon', 'lime', 'grapefruit', 'citrus']
    # Your code here
    pass

# Test
test_fruits = ["A juicy orange fruit", "Red apple from Washington", 
               "Sour lemon for cooking", "Sweet strawberries"]
for fruit in test_fruits:
    result = classify_fruit(fruit)
    print(f"'{fruit}' -> {result}")`,
        solution: `def classify_fruit(description):
    """Classify fruit as citrus or not citrus."""
    citrus_words = ['orange', 'lemon', 'lime', 'grapefruit', 'citrus']
    description_lower = description.lower()
    for word in citrus_words:
        if word in description_lower:
            return "citrus"
    return "not citrus"

# Test
test_fruits = ["A juicy orange fruit", "Red apple from Washington", 
               "Sour lemon for cooking", "Sweet strawberries"]
for fruit in test_fruits:
    result = classify_fruit(fruit)
    print(f"'{fruit}' -> {result}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "citrus classifications", description: "Should classify fruits correctly" },
        ]),
        hints: ["Convert description to lowercase", "Loop through citrus_words", "Return 'citrus' when you find a match"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson25_1_1.id,
        number: 3,
        title: "Limitations of Rules",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: `Your spam filter uses: ['lottery', 'winner', 'free', 'click'].
Test these evasion attempts and count how many bypass your filter.`,
        starterCode: `def spam_filter(email):
    spam_words = ['lottery', 'winner', 'free', 'click']
    for word in spam_words:
        if word in email.lower():
            return "SPAM"
    return "NOT SPAM"

test_emails = [
    "You won the l0ttery!",      # Uses zero instead of 'o'
    "FR33 money for you",        # Uses 3 instead of 'e'
    "C1ick here now",            # Uses 1 instead of 'l'
    "You are a WINNER!!!",       # Normal spam
    "Meeting at 3pm",            # Normal email
]

is_actually_spam = [True, True, True, True, False]

print("Rule-Based Filter Results:")
spam_missed = 0
for email, actually_spam in zip(test_emails, is_actually_spam):
    result = spam_filter(email)
    # Count missed spam
    print(f"'{email}' -> {result}")

print(f"\\nSpam missed: {spam_missed}")`,
        solution: `def spam_filter(email):
    spam_words = ['lottery', 'winner', 'free', 'click']
    for word in spam_words:
        if word in email.lower():
            return "SPAM"
    return "NOT SPAM"

test_emails = [
    "You won the l0ttery!",
    "FR33 money for you",
    "C1ick here now",
    "You are a WINNER!!!",
    "Meeting at 3pm",
]

is_actually_spam = [True, True, True, True, False]

print("Rule-Based Filter Results:")
spam_missed = 0
for email, actually_spam in zip(test_emails, is_actually_spam):
    result = spam_filter(email)
    predicted_spam = (result == "SPAM")
    if actually_spam and not predicted_spam:
        spam_missed += 1
        status = "MISSED!"
    else:
        status = "OK"
    print(f"'{email}' -> {result} {status}")

print(f"\\nSpam missed: {spam_missed}")
print("\\nWhy ML is better: ML learns PATTERNS, not exact strings!")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Shows missed spam", description: "Should show filter limitations" },
        ]),
        hints: ["Compare result to whether email is actually spam", "First 4 emails ARE spam, last one is NOT", "Count incorrectly classified spam"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson25_1_1.id,
        number: 4,
        title: "ML Workflow Steps",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: `Implement the 4 steps of ML workflow for a simple sentiment classifier.`,
        starterCode: `# Step 1: COLLECT DATA
positive_reviews = ["amazing wonderful", "excellent great", "loved masterpiece", "fantastic brilliant"]
negative_reviews = ["terrible waste", "awful boring", "hated disaster", "worst horrible"]

# Step 2: TRAIN - Learn word patterns
positive_words = {}
negative_words = {}
# Your code: Count word frequencies

# Step 3: EVALUATE - Prediction function
def predict_sentiment(review):
    # Your code: Calculate scores and return prediction
    pass

# Step 4: PREDICT - Test
test_reviews = ["wonderful amazing film", "terrible awful waste", "great but terrible ending"]
for review in test_reviews:
    sentiment = predict_sentiment(review)
    print(f"'{review[:25]}' -> {sentiment}")`,
        solution: `# Step 1: COLLECT DATA
positive_reviews = ["amazing wonderful", "excellent great", "loved masterpiece", "fantastic brilliant"]
negative_reviews = ["terrible waste", "awful boring", "hated disaster", "worst horrible"]

# Step 2: TRAIN - Learn word patterns
positive_words = {}
negative_words = {}

for review in positive_reviews:
    for word in review.lower().split():
        positive_words[word] = positive_words.get(word, 0) + 1

for review in negative_reviews:
    for word in review.lower().split():
        negative_words[word] = negative_words.get(word, 0) + 1

print("Training complete!")

# Step 3: EVALUATE - Prediction function
def predict_sentiment(review):
    words = review.lower().split()
    pos_score = sum(positive_words.get(w, 0) for w in words)
    neg_score = sum(negative_words.get(w, 0) for w in words)
    if pos_score > neg_score:
        return "positive"
    elif neg_score > pos_score:
        return "negative"
    return "neutral"

# Step 4: PREDICT - Test
test_reviews = ["wonderful amazing film", "terrible awful waste", "great but terrible ending"]
for review in test_reviews:
    sentiment = predict_sentiment(review)
    print(f"'{review[:25]}' -> {sentiment}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "Sentiment predictions", description: "Should predict sentiments" },
        ]),
        hints: ["Use dictionary.get(word, 0) for missing words", "Split reviews with .split()", "Compare scores to decide"],
        xpReward: 25,
        order: 4,
      },
      {
        lessonId: lesson25_1_1.id,
        number: 5,
        title: "Real-World ML Applications",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: `Create a dictionary mapping 6 applications to their ML type and why ML is used.`,
        starterCode: `ml_applications = {
    "spam_filter": {"ml_type": "", "why_ml": ""},
    "netflix_recommendations": {"ml_type": "", "why_ml": ""},
    "siri": {"ml_type": "", "why_ml": ""},
    "self_driving_car": {"ml_type": "", "why_ml": ""},
    "fraud_detection": {"ml_type": "", "why_ml": ""},
    "medical_diagnosis": {"ml_type": "", "why_ml": ""},
}

for app, details in ml_applications.items():
    print(f"\\n{app.upper()}:")
    print(f"  ML Type: {details['ml_type']}")
    print(f"  Why ML: {details['why_ml']}")`,
        solution: `ml_applications = {
    "spam_filter": {"ml_type": "Classification", "why_ml": "Spam patterns evolve constantly"},
    "netflix_recommendations": {"ml_type": "Recommendation system", "why_ml": "User preferences are complex and personal"},
    "siri": {"ml_type": "Speech recognition + NLP", "why_ml": "Infinite variations in speech"},
    "self_driving_car": {"ml_type": "Computer vision + RL", "why_ml": "Too many scenarios to program manually"},
    "fraud_detection": {"ml_type": "Anomaly detection", "why_ml": "Fraud patterns change rapidly"},
    "medical_diagnosis": {"ml_type": "Image classification", "why_ml": "Subtle patterns humans might miss"},
}

for app, details in ml_applications.items():
    print(f"\\n{app.upper()}:")
    print(f"  ML Type: {details['ml_type']}")
    print(f"  Why ML: {details['why_ml']}")`,
        testCases: JSON.stringify([
          { input: "", expectedOutput: "6 applications with details", description: "Should map all applications" },
        ]),
        hints: ["Think about what each application does", "Consider: Does it classify? Predict? Find patterns?", "Why can't we just write rules?"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✅ Created 5 exercises for Lesson 25.1.1`);

  console.log("\n✅ Chapter 25 Part 1 seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
