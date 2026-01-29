import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 1: Chapter 20 structure + Lessons 20.1.1-20.1.2...\n");

  const chapter20 = await prisma.chapter.upsert({
    where: { number: 20 },
    update: {},
    create: {
      number: 20,
      title: "Conditional Probability and Bayesian Statistics",
      description: "Master Bayesian thinking - updating beliefs based on evidence. Learn conditional probability, Bayes' theorem, and build a Naive Bayes spam classifier.",
      objectives: [
        "Understand conditional probability P(A|B)",
        "Apply Bayes' theorem to real problems",
        "Distinguish prior, likelihood, and posterior",
        "Implement Bayesian updating",
        "Build a Naive Bayes classifier",
      ],
      isPublished: true,
    },
  });
  console.log(`✅ Chapter ${chapter20.number}: ${chapter20.title}`);

  const section20_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter20.id, number: 20.1 } },
    update: {},
    create: {
      chapterId: chapter20.id,
      number: 20.1,
      title: "Probability Foundations",
      description: "Conditional, joint, and marginal probabilities.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section20_1.number}: ${section20_1.title}`);

  const section20_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter20.id, number: 20.2 } },
    update: {},
    create: {
      chapterId: chapter20.id,
      number: 20.2,
      title: "Bayes' Theorem",
      description: "The most important formula in probability.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section20_2.number}: ${section20_2.title}`);

  const section20_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter20.id, number: 20.3 } },
    update: {},
    create: {
      chapterId: chapter20.id,
      number: 20.3,
      title: "Bayesian Classification",
      description: "Naive Bayes and spam filtering.",
      order: 3,
    },
  });
  console.log(`  📂 Section ${section20_3.number}: ${section20_3.title}`);

  const lesson20_1_1 = await prisma.lesson.upsert({
    where: { slug: "conditional-probability" },
    update: {},
    create: {
      sectionId: section20_1.id,
      number: 20.11,
      title: "Conditional Probability",
      slug: "conditional-probability",
      objectives: [
        "Understand P(A|B) notation",
        "Calculate conditional probabilities",
        "Distinguish P(A|B) from P(B|A)",
        "Apply to real-world scenarios",
      ],
      content: `# Conditional Probability

## What is Conditional Probability?

**P(A|B)** = "Probability of A, given that B has occurred"

The vertical bar "|" means "given" or "conditional on."

## The Formula

\`\`\`
P(A|B) = P(A and B) / P(B)
\`\`\`

## Example: Card Drawing

Deck of 52 cards. What's P(King | Face card)?
- P(King and Face) = 4/52 (4 kings are face cards)
- P(Face card) = 12/52 (J, Q, K in 4 suits)
- P(King | Face) = (4/52) / (12/52) = 4/12 = 1/3

## Key Insight

P(A|B) ≠ P(B|A) in general!

Example:
- P(Wet grass | Rain) is high
- P(Rain | Wet grass) is lower (sprinkler could cause it)

## Why It Matters

Conditional probability is the foundation of:
- Medical diagnosis: P(Disease | Symptom)
- Spam filtering: P(Spam | Words)
- Weather forecasting: P(Rain | Clouds)`,
      codeExamples: JSON.stringify([
        {
          id: "basic-conditional",
          title: "Basic Conditional Probability",
          code: "# P(A|B) = P(A and B) / P(B)\n\n# Example: Fair die roll\n# A = roll is even (2, 4, 6)\n# B = roll is greater than 3 (4, 5, 6)\n\n# Sample space: {1, 2, 3, 4, 5, 6}\nall_outcomes = [1, 2, 3, 4, 5, 6]\n\nA = {2, 4, 6}  # Even\nB = {4, 5, 6}  # Greater than 3\nA_and_B = A & B  # Intersection: {4, 6}\n\nprint('Die Roll Example')\nprint('=' * 40)\nprint(f'A (even): {A}')\nprint(f'B (> 3): {B}')\nprint(f'A ∩ B: {A_and_B}')\n\n# Calculate probabilities\nP_A = len(A) / len(all_outcomes)\nP_B = len(B) / len(all_outcomes)\nP_A_and_B = len(A_and_B) / len(all_outcomes)\n\nprint(f'\\nP(A) = {len(A)}/6 = {P_A:.3f}')\nprint(f'P(B) = {len(B)}/6 = {P_B:.3f}')\nprint(f'P(A ∩ B) = {len(A_and_B)}/6 = {P_A_and_B:.3f}')\n\n# Conditional probability\nP_A_given_B = P_A_and_B / P_B\nprint(f'\\nP(A|B) = P(A ∩ B) / P(B)')\nprint(f'P(A|B) = {P_A_and_B:.3f} / {P_B:.3f} = {P_A_given_B:.3f}')\nprint(f'\\nGiven roll > 3, probability of even is {P_A_given_B:.1%}')",
          description: "Calculate P(A|B) step by step",
        },
        {
          id: "card-example",
          title: "Card Drawing Example",
          code: "# Deck of cards conditional probability\n\n# What is P(Heart | Red card)?\n\ntotal_cards = 52\nhearts = 13\nred_cards = 26  # Hearts + Diamonds\nhearts_and_red = 13  # All hearts are red\n\nP_heart = hearts / total_cards\nP_red = red_cards / total_cards\nP_heart_and_red = hearts_and_red / total_cards\n\nP_heart_given_red = P_heart_and_red / P_red\n\nprint('Card Drawing: P(Heart | Red)')\nprint('=' * 40)\nprint(f'P(Heart) = {hearts}/{total_cards} = {P_heart:.3f}')\nprint(f'P(Red) = {red_cards}/{total_cards} = {P_red:.3f}')\nprint(f'P(Heart ∩ Red) = {hearts_and_red}/{total_cards} = {P_heart_and_red:.3f}')\nprint(f'\\nP(Heart | Red) = {P_heart_and_red:.3f} / {P_red:.3f} = {P_heart_given_red:.3f}')\nprint(f'\\nKnowing card is red, P(heart) = {P_heart_given_red:.1%}')\n\n# Compare: P(Red | Heart)?\nP_red_given_heart = P_heart_and_red / P_heart\nprint(f'\\nP(Red | Heart) = {P_red_given_heart:.1%}')\nprint('All hearts are red, so P(Red|Heart) = 100%!')",
          description: "Card probability example",
        },
        {
          id: "asymmetry",
          title: "P(A|B) ≠ P(B|A)",
          code: "# CRITICAL: P(A|B) and P(B|A) are different!\n\n# Example: Medical test\n# D = has disease\n# T = tests positive\n\n# Given data:\nP_D = 0.01  # 1% of population has disease\nP_T_given_D = 0.95  # Test 95% accurate if sick\nP_T_given_not_D = 0.05  # 5% false positive rate\n\nprint('Medical Test: P(A|B) vs P(B|A)')\nprint('=' * 45)\nprint(f'P(Disease) = {P_D:.1%}')\nprint(f'P(Positive | Disease) = {P_T_given_D:.1%}')\nprint(f'P(Positive | No Disease) = {P_T_given_not_D:.1%}')\n\n# Calculate P(T) using law of total probability\nP_T = P_T_given_D * P_D + P_T_given_not_D * (1 - P_D)\nprint(f'\\nP(Positive) = {P_T:.3f}')\n\n# Now calculate P(D|T) - what we really want!\nP_D_and_T = P_T_given_D * P_D\nP_D_given_T = P_D_and_T / P_T\n\nprint(f'\\nP(Disease | Positive) = {P_D_given_T:.1%}')\n\nprint('\\n⚠️  KEY INSIGHT:')\nprint(f'   P(Positive | Disease) = {P_T_given_D:.1%}')\nprint(f'   P(Disease | Positive) = {P_D_given_T:.1%}')\nprint('   These are VERY different!')",
          description: "Show asymmetry of conditional probability",
        },
      ]),
      keyPoints: [
        "P(A|B) = probability of A given B occurred",
        "Formula: P(A|B) = P(A and B) / P(B)",
        "P(A|B) ≠ P(B|A) in general",
        "Conditional probability restricts sample space",
        "Foundation of Bayesian reasoning",
        "Used in diagnosis, filtering, prediction",
      ],
      hardwareDemo: "Watch division in ALU. See probability calculations step by step.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson20_1_1.number}: ${lesson20_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson20_1_1.id,
        number: 1,
        title: "Calculate P(A|B) from Data",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given a dataset, calculate P(Pass | Studied) - probability of passing given the student studied.",
        starterCode: "# Student data: (studied, passed)\nstudents = [\n    (True, True), (True, True), (True, False), (True, True),\n    (False, False), (False, True), (False, False), (False, False),\n    (True, True), (True, True),\n]\n\n# Count occurrences\nstudied_count = sum(1 for s, p in students if s)\npassed_given_studied = sum(1 for s, p in students if s and p)\n\nP_studied = studied_count / len(students)\nP_studied_and_passed = passed_given_studied / len(students)\nP_pass_given_studied = P_studied_and_passed / P_studied\n\nprint('P(Pass | Studied)')\nprint('=' * 30)\nprint(f'Total students: {len(students)}')\nprint(f'Students who studied: {studied_count}')\nprint(f'Studied AND passed: {passed_given_studied}')\nprint(f'\\nP(Pass | Studied) = {P_pass_given_studied:.1%}')",
        solution: "# Solution calculates conditional probability from data",
        testCases: JSON.stringify([{ input: "", expectedOutput: "P(Pass|Studied) calculated", description: "Conditional from data" }]),
        hints: ["Count studied students", "Count studied AND passed", "Divide appropriately"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson20_1_1.id,
        number: 2,
        title: "Die Roll Conditional",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Calculate P(even | greater than 2) for a fair die.",
        starterCode: "outcomes = [1, 2, 3, 4, 5, 6]\n\neven = {2, 4, 6}\ngreater_than_2 = {3, 4, 5, 6}\nboth = even & greater_than_2\n\nprint('Die: P(Even | > 2)')\nprint(f'Even: {even}')\nprint(f'Greater than 2: {greater_than_2}')\nprint(f'Both: {both}')\n\nP_gt2 = len(greater_than_2) / len(outcomes)\nP_both = len(both) / len(outcomes)\nP_even_given_gt2 = P_both / P_gt2\n\nprint(f'\\nP(Even | > 2) = {P_even_given_gt2:.3f}')",
        solution: "# Even numbers > 2 are {4, 6}, total > 2 is {3,4,5,6}",
        testCases: JSON.stringify([{ input: "", expectedOutput: "P = 0.5", description: "Die conditional" }]),
        hints: ["Find intersection", "Divide by P(>2)", "Answer is 2/4 = 0.5"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson20_1_1.id,
        number: 3,
        title: "Compare P(A|B) and P(B|A)",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "For weather data, calculate both P(Umbrella|Rain) and P(Rain|Umbrella). Show they're different.",
        starterCode: "# Weather observations: (rained, had_umbrella)\ndays = [\n    (True, True), (True, True), (True, False),\n    (False, True), (False, False), (False, False),\n    (True, True), (False, False), (False, False),\n    (True, True),\n]\n\nrain_count = sum(1 for r, u in days if r)\numbrella_count = sum(1 for r, u in days if u)\nboth_count = sum(1 for r, u in days if r and u)\ntotal = len(days)\n\nP_rain = rain_count / total\nP_umbrella = umbrella_count / total\nP_both = both_count / total\n\nP_umbrella_given_rain = P_both / P_rain\nP_rain_given_umbrella = P_both / P_umbrella\n\nprint('Weather: P(A|B) vs P(B|A)')\nprint('=' * 40)\nprint(f'P(Rain) = {P_rain:.2f}')\nprint(f'P(Umbrella) = {P_umbrella:.2f}')\nprint(f'P(Both) = {P_both:.2f}')\nprint(f'\\nP(Umbrella | Rain) = {P_umbrella_given_rain:.2f}')\nprint(f'P(Rain | Umbrella) = {P_rain_given_umbrella:.2f}')\nprint('\\nThese are different!')",
        solution: "# Shows asymmetry of conditional probability",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Two different values", description: "Asymmetry" }]),
        hints: ["Calculate P(both)", "Divide by different denominators", "Compare results"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson20_1_1.id,
        number: 4,
        title: "Conditional Probability Function",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function that calculates P(A|B) from a dataset.",
        starterCode: "def conditional_probability(data, condition_A, condition_B):\n    \"\"\"\n    Calculate P(A|B) from data.\n    condition_A and condition_B are functions that return True/False.\n    \"\"\"\n    b_count = sum(1 for item in data if condition_B(item))\n    both_count = sum(1 for item in data if condition_A(item) and condition_B(item))\n    \n    if b_count == 0:\n        return 0\n    return both_count / b_count\n\n# Test: People data (age, income)\npeople = [\n    (25, 40000), (30, 55000), (35, 70000), (40, 80000),\n    (45, 90000), (28, 45000), (33, 60000), (50, 100000),\n]\n\n# P(Income > 60000 | Age > 35)\nhigh_income = lambda p: p[1] > 60000\nolder = lambda p: p[0] > 35\n\nresult = conditional_probability(people, high_income, older)\nprint(f'P(High Income | Age > 35) = {result:.1%}')",
        solution: "# Reusable conditional probability function",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Function works", description: "P(A|B) function" }]),
        hints: ["Count B occurrences", "Count A and B", "Divide"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson20_1_1.id,
        number: 5,
        title: "Email Conditional Probability",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Given email data, calculate P(Spam | contains 'free'). This is the basis of spam filtering!",
        starterCode: "# Emails: (text, is_spam)\nemails = [\n    ('free money now', True),\n    ('meeting tomorrow', False),\n    ('free gift card', True),\n    ('project update', False),\n    ('click here free', True),\n    ('lunch plans', False),\n    ('free trial offer', True),\n    ('quarterly report', False),\n    ('free shipping', True),\n    ('team meeting', False),\n]\n\n# Count\nhas_free = sum(1 for text, spam in emails if 'free' in text.lower())\nis_spam = sum(1 for text, spam in emails if spam)\nfree_and_spam = sum(1 for text, spam in emails if 'free' in text.lower() and spam)\n\nP_free = has_free / len(emails)\nP_spam = is_spam / len(emails)\nP_free_and_spam = free_and_spam / len(emails)\n\nP_spam_given_free = P_free_and_spam / P_free\n\nprint('Spam Detection: P(Spam | contains free)')\nprint('=' * 45)\nprint(f'Emails with \"free\": {has_free}/{len(emails)}')\nprint(f'Spam emails: {is_spam}/{len(emails)}')\nprint(f'Free AND spam: {free_and_spam}/{len(emails)}')\nprint(f'\\nP(Spam | \"free\") = {P_spam_given_free:.1%}')\nprint('\\nThis is the foundation of spam filtering!')",
        solution: "# Spam filtering uses conditional probability",
        testCases: JSON.stringify([{ input: "", expectedOutput: "P(Spam|free) = 100%", description: "Spam conditional" }]),
        hints: ["Count emails with 'free'", "Count spam with 'free'", "This is Naive Bayes foundation"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 20.1.1`);

  const lesson20_1_2 = await prisma.lesson.upsert({
    where: { slug: "joint-marginal-probabilities" },
    update: {},
    create: {
      sectionId: section20_1.id,
      number: 20.12,
      title: "Joint and Marginal Probabilities",
      slug: "joint-marginal-probabilities",
      objectives: [
        "Understand joint probability P(A and B)",
        "Calculate marginal probabilities",
        "Build and use probability tables",
        "Connect joint, marginal, and conditional",
      ],
      content: `# Joint and Marginal Probabilities

## Joint Probability

**P(A and B)** = probability both A and B occur together.

Also written as P(A ∩ B) or P(A, B).

## Marginal Probability

The probability of a single event, ignoring other variables.

Found by summing across rows or columns of a joint probability table.

## The Relationship

\`\`\`
P(A|B) = P(A and B) / P(B)
\`\`\`

Rearranging:
\`\`\`
P(A and B) = P(A|B) × P(B)
\`\`\`

## Probability Table Example

|          | Rain | No Rain | Total |
|----------|------|---------|-------|
| Umbrella | 0.30 | 0.10    | 0.40  |
| No Umb   | 0.10 | 0.50    | 0.60  |
| Total    | 0.40 | 0.60    | 1.00  |

- **Joint**: P(Rain and Umbrella) = 0.30
- **Marginal**: P(Rain) = 0.40, P(Umbrella) = 0.40
- **Conditional**: P(Umbrella|Rain) = 0.30/0.40 = 0.75`,
      codeExamples: JSON.stringify([
        {
          id: "joint-prob",
          title: "Joint Probability from Data",
          code: "# Calculate joint probability from observations\n\n# Weather data: (rain, umbrella)\nobservations = [\n    (True, True), (True, True), (True, True),\n    (True, False),\n    (False, True),\n    (False, False), (False, False), (False, False),\n    (False, False), (False, False),\n]\n\ntotal = len(observations)\n\n# Joint probabilities\nP_rain_and_umb = sum(1 for r,u in observations if r and u) / total\nP_rain_and_no_umb = sum(1 for r,u in observations if r and not u) / total\nP_no_rain_and_umb = sum(1 for r,u in observations if not r and u) / total\nP_no_rain_and_no_umb = sum(1 for r,u in observations if not r and not u) / total\n\nprint('Joint Probability Table')\nprint('=' * 45)\nprint(f'{\"\":12} {\"Rain\":>10} {\"No Rain\":>10} {\"Total\":>10}')\nprint('-' * 45)\nprint(f'{\"Umbrella\":12} {P_rain_and_umb:>10.2f} {P_no_rain_and_umb:>10.2f} {P_rain_and_umb + P_no_rain_and_umb:>10.2f}')\nprint(f'{\"No Umbrella\":12} {P_rain_and_no_umb:>10.2f} {P_no_rain_and_no_umb:>10.2f} {P_rain_and_no_umb + P_no_rain_and_no_umb:>10.2f}')\nprint('-' * 45)\nP_rain = P_rain_and_umb + P_rain_and_no_umb\nP_no_rain = P_no_rain_and_umb + P_no_rain_and_no_umb\nprint(f'{\"Total\":12} {P_rain:>10.2f} {P_no_rain:>10.2f} {1.0:>10.2f}')",
          description: "Build joint probability table from data",
        },
        {
          id: "marginal-prob",
          title: "Marginal from Joint",
          code: "# Calculate marginal probabilities by summing\n\n# Joint probability table (as dictionary)\njoint = {\n    ('rain', 'umbrella'): 0.30,\n    ('rain', 'no_umbrella'): 0.10,\n    ('no_rain', 'umbrella'): 0.10,\n    ('no_rain', 'no_umbrella'): 0.50,\n}\n\n# Marginal P(Rain)\nP_rain = sum(p for (weather, _), p in joint.items() if weather == 'rain')\nP_no_rain = sum(p for (weather, _), p in joint.items() if weather == 'no_rain')\n\n# Marginal P(Umbrella)\nP_umbrella = sum(p for (_, umb), p in joint.items() if umb == 'umbrella')\nP_no_umbrella = sum(p for (_, umb), p in joint.items() if umb == 'no_umbrella')\n\nprint('Marginal Probabilities')\nprint('=' * 35)\nprint(f'P(Rain) = {P_rain:.2f}')\nprint(f'P(No Rain) = {P_no_rain:.2f}')\nprint(f'P(Umbrella) = {P_umbrella:.2f}')\nprint(f'P(No Umbrella) = {P_no_umbrella:.2f}')\nprint(f'\\nSum of weather: {P_rain + P_no_rain:.2f}')\nprint(f'Sum of umbrella: {P_umbrella + P_no_umbrella:.2f}')",
          description: "Calculate marginal by summing joint",
        },
        {
          id: "conditional-from-joint",
          title: "Conditional from Joint",
          code: "# P(A|B) = P(A and B) / P(B)\n\njoint = {\n    ('rain', 'umbrella'): 0.30,\n    ('rain', 'no_umbrella'): 0.10,\n    ('no_rain', 'umbrella'): 0.10,\n    ('no_rain', 'no_umbrella'): 0.50,\n}\n\n# Marginals\nP_rain = 0.40\nP_umbrella = 0.40\n\n# Conditional: P(Umbrella | Rain)\nP_umb_and_rain = joint[('rain', 'umbrella')]\nP_umb_given_rain = P_umb_and_rain / P_rain\n\n# Conditional: P(Rain | Umbrella)\nP_rain_given_umb = P_umb_and_rain / P_umbrella\n\nprint('Conditional from Joint')\nprint('=' * 40)\nprint(f'P(Rain and Umbrella) = {P_umb_and_rain:.2f}')\nprint(f'P(Rain) = {P_rain:.2f}')\nprint(f'P(Umbrella) = {P_umbrella:.2f}')\nprint(f'\\nP(Umbrella | Rain) = {P_umb_and_rain:.2f} / {P_rain:.2f} = {P_umb_given_rain:.2f}')\nprint(f'P(Rain | Umbrella) = {P_umb_and_rain:.2f} / {P_umbrella:.2f} = {P_rain_given_umb:.2f}')\nprint(f'\\nThe relationship: P(A|B) = P(A,B) / P(B)')",
          description: "Derive conditional from joint",
        },
      ]),
      keyPoints: [
        "Joint P(A,B): probability of both together",
        "Marginal: sum across rows or columns",
        "P(A|B) = P(A,B) / P(B)",
        "P(A,B) = P(A|B) × P(B)",
        "Probability tables organize relationships",
        "All joint probabilities sum to 1",
      ],
      hardwareDemo: "Watch table construction. See row/column sums for marginals.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson20_1_2.number}: ${lesson20_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson20_1_2.id,
        number: 1,
        title: "Build Joint Probability Table",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "From survey data about coffee and tea preferences, build a joint probability table.",
        starterCode: "# Survey: (drinks_coffee, drinks_tea)\nsurvey = [\n    (True, False), (True, True), (False, True), (True, False),\n    (True, True), (False, True), (True, False), (True, False),\n    (False, False), (True, True),\n]\n\ntotal = len(survey)\n\n# Calculate joint probabilities\nP_coffee_tea = sum(1 for c,t in survey if c and t) / total\nP_coffee_no_tea = sum(1 for c,t in survey if c and not t) / total\nP_no_coffee_tea = sum(1 for c,t in survey if not c and t) / total\nP_no_coffee_no_tea = sum(1 for c,t in survey if not c and not t) / total\n\nprint('Joint Probability Table')\nprint('=' * 45)\nprint(f'{\"\":15} {\"Tea\":>10} {\"No Tea\":>10} {\"Total\":>10}')\nprint('-' * 45)\nP_coffee = P_coffee_tea + P_coffee_no_tea\nP_no_coffee = P_no_coffee_tea + P_no_coffee_no_tea\nprint(f'{\"Coffee\":15} {P_coffee_tea:>10.2f} {P_coffee_no_tea:>10.2f} {P_coffee:>10.2f}')\nprint(f'{\"No Coffee\":15} {P_no_coffee_tea:>10.2f} {P_no_coffee_no_tea:>10.2f} {P_no_coffee:>10.2f}')\nprint('-' * 45)\nP_tea = P_coffee_tea + P_no_coffee_tea\nP_no_tea = P_coffee_no_tea + P_no_coffee_no_tea\nprint(f'{\"Total\":15} {P_tea:>10.2f} {P_no_tea:>10.2f} {1.0:>10.2f}')",
        solution: "# Joint probability table built",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Table displayed", description: "Joint table" }]),
        hints: ["Count each combination", "Divide by total", "Check sums equal 1"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson20_1_2.id,
        number: 2,
        title: "Calculate Marginals",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given a joint probability table, calculate marginal probabilities.",
        starterCode: "# Joint probabilities\njoint = {\n    ('A', 'X'): 0.15,\n    ('A', 'Y'): 0.25,\n    ('B', 'X'): 0.35,\n    ('B', 'Y'): 0.25,\n}\n\n# Marginal P(A), P(B)\nP_A = joint[('A','X')] + joint[('A','Y')]\nP_B = joint[('B','X')] + joint[('B','Y')]\n\n# Marginal P(X), P(Y)\nP_X = joint[('A','X')] + joint[('B','X')]\nP_Y = joint[('A','Y')] + joint[('B','Y')]\n\nprint('Marginal Probabilities')\nprint('=' * 30)\nprint(f'P(A) = {P_A:.2f}')\nprint(f'P(B) = {P_B:.2f}')\nprint(f'P(X) = {P_X:.2f}')\nprint(f'P(Y) = {P_Y:.2f}')\nprint(f'\\nCheck: P(A)+P(B) = {P_A + P_B:.2f}')\nprint(f'Check: P(X)+P(Y) = {P_X + P_Y:.2f}')",
        solution: "# Marginals sum row/column",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Marginals calculated", description: "Marginal calculation" }]),
        hints: ["Sum across rows for one variable", "Sum across columns for other", "Both should sum to 1"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson20_1_2.id,
        number: 3,
        title: "Conditional from Joint Table",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given joint probabilities, calculate P(X|A) and P(A|X).",
        starterCode: "# Joint probabilities\njoint = {\n    ('A', 'X'): 0.15,\n    ('A', 'Y'): 0.25,\n    ('B', 'X'): 0.35,\n    ('B', 'Y'): 0.25,\n}\n\n# Marginals\nP_A = 0.40\nP_X = 0.50\n\n# P(X|A) = P(A,X) / P(A)\nP_X_given_A = joint[('A','X')] / P_A\n\n# P(A|X) = P(A,X) / P(X)\nP_A_given_X = joint[('A','X')] / P_X\n\nprint('Conditional from Joint')\nprint('=' * 35)\nprint(f\"P(A,X) = {joint[('A','X')]:.2f}\")\nprint(f'P(A) = {P_A:.2f}')\nprint(f'P(X) = {P_X:.2f}')\nprint(f'\\nP(X|A) = {P_X_given_A:.2f}')\nprint(f'P(A|X) = {P_A_given_X:.2f}')\nprint('\\nNote: P(X|A) ≠ P(A|X)')",
        solution: "# Conditional from joint divided by marginal",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Conditionals shown", description: "Conditional from joint" }]),
        hints: ["P(X|A) = P(A,X) / P(A)", "P(A|X) = P(A,X) / P(X)", "Different denominators"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson20_1_2.id,
        number: 4,
        title: "Independence Check",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Check if two events are independent: P(A,B) = P(A) × P(B)?",
        starterCode: "# Two scenarios\n\n# Scenario 1: Fair coin flips\njoint1 = {\n    ('H1', 'H2'): 0.25,\n    ('H1', 'T2'): 0.25,\n    ('T1', 'H2'): 0.25,\n    ('T1', 'T2'): 0.25,\n}\n\n# Scenario 2: Correlated events\njoint2 = {\n    ('rain', 'umbrella'): 0.30,\n    ('rain', 'no_umb'): 0.10,\n    ('no_rain', 'umbrella'): 0.10,\n    ('no_rain', 'no_umb'): 0.50,\n}\n\ndef check_independence(joint, event1_vals, event2_vals):\n    # Calculate marginals\n    P_A = sum(joint[(a,b)] for a in event1_vals for b in event2_vals if a == event1_vals[0])\n    P_B = sum(joint[(a,b)] for a in event1_vals for b in event2_vals if b == event2_vals[0])\n    P_AB = joint[(event1_vals[0], event2_vals[0])]\n    \n    expected = P_A * P_B\n    is_independent = abs(P_AB - expected) < 0.01\n    \n    return P_A, P_B, P_AB, expected, is_independent\n\nprint('Independence Check: P(A,B) = P(A) × P(B)?')\nprint('=' * 45)\n\n# Check coin flips\nP_H1 = 0.5\nP_H2 = 0.5\nP_both_H = joint1[('H1','H2')]\nprint(f'\\nCoin flips:')\nprint(f'  P(H1) × P(H2) = {P_H1} × {P_H2} = {P_H1*P_H2}')\nprint(f'  P(H1, H2) = {P_both_H}')\nprint(f'  Independent? {abs(P_both_H - P_H1*P_H2) < 0.01}')\n\n# Check rain/umbrella\nP_rain = 0.40\nP_umb = 0.40\nP_both = joint2[('rain','umbrella')]\nprint(f'\\nRain & Umbrella:')\nprint(f'  P(Rain) × P(Umb) = {P_rain} × {P_umb} = {P_rain*P_umb}')\nprint(f'  P(Rain, Umb) = {P_both}')\nprint(f'  Independent? {abs(P_both - P_rain*P_umb) < 0.01}')",
        solution: "# Independent if P(A,B) = P(A)P(B)",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Independence checked", description: "Independence test" }]),
        hints: ["Calculate P(A) × P(B)", "Compare to P(A,B)", "Close = independent"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson20_1_2.id,
        number: 5,
        title: "Complete Probability Analysis",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Given data, compute joint, marginal, and conditional probabilities. Create a complete analysis.",
        starterCode: "# Customer data: (bought_product_A, bought_product_B)\ncustomers = [\n    (True, True), (True, False), (False, True), (True, True),\n    (False, False), (True, True), (False, True), (True, False),\n    (True, True), (False, False), (True, True), (False, True),\n]\n\ntotal = len(customers)\n\n# Joint\nP_A_B = sum(1 for a,b in customers if a and b) / total\nP_A_notB = sum(1 for a,b in customers if a and not b) / total\nP_notA_B = sum(1 for a,b in customers if not a and b) / total\nP_notA_notB = sum(1 for a,b in customers if not a and not b) / total\n\n# Marginal\nP_A = P_A_B + P_A_notB\nP_B = P_A_B + P_notA_B\n\n# Conditional\nP_B_given_A = P_A_B / P_A\nP_A_given_B = P_A_B / P_B\n\nprint('Complete Probability Analysis')\nprint('=' * 50)\nprint('\\nJOINT PROBABILITIES:')\nprint(f'  P(A and B) = {P_A_B:.3f}')\nprint(f'  P(A and not B) = {P_A_notB:.3f}')\nprint(f'  P(not A and B) = {P_notA_B:.3f}')\nprint(f'  P(not A and not B) = {P_notA_notB:.3f}')\nprint(f'  Sum = {P_A_B + P_A_notB + P_notA_B + P_notA_notB:.3f}')\n\nprint('\\nMARGINAL PROBABILITIES:')\nprint(f'  P(A) = {P_A:.3f}')\nprint(f'  P(B) = {P_B:.3f}')\n\nprint('\\nCONDITIONAL PROBABILITIES:')\nprint(f'  P(B|A) = {P_B_given_A:.3f}')\nprint(f'  P(A|B) = {P_A_given_B:.3f}')\n\nprint('\\nINDEPENDENCE CHECK:')\nexpected = P_A * P_B\nprint(f'  P(A) × P(B) = {expected:.3f}')\nprint(f'  P(A,B) = {P_A_B:.3f}')\nprint(f'  Independent? {abs(P_A_B - expected) < 0.05}')",
        solution: "# Complete probability analysis",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Full analysis", description: "Complete analysis" }]),
        hints: ["Calculate all joints first", "Sum for marginals", "Divide for conditionals"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 20.1.2`);

  console.log("\n✅ Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
