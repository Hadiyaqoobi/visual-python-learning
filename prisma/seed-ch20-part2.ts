import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 2: Lessons 20.2.1-20.2.3 (Bayes' Theorem)...\n");

  const section20_2 = await prisma.section.findFirst({ where: { number: 20.2 } });
  if (!section20_2) throw new Error("Section 20.2 not found. Run part 1 first.");

  const lesson20_2_1 = await prisma.lesson.upsert({
    where: { slug: "bayes-theorem-derivation" },
    update: {},
    create: {
      sectionId: section20_2.id,
      number: 20.21,
      title: "Bayes' Theorem Derivation",
      slug: "bayes-theorem-derivation",
      objectives: [
        "Derive Bayes' theorem from conditional probability",
        "Understand each component of the formula",
        "See why it's called 'inverse probability'",
        "Apply the formula step by step",
      ],
      content: `# Bayes' Theorem Derivation

## Starting Point

From conditional probability:
\`\`\`
P(A|B) = P(A and B) / P(B)
P(B|A) = P(A and B) / P(A)
\`\`\`

## The Derivation

From the second equation:
\`\`\`
P(A and B) = P(B|A) × P(A)
\`\`\`

Substitute into the first:
\`\`\`
P(A|B) = P(B|A) × P(A) / P(B)
\`\`\`

## Bayes' Theorem

\`\`\`
P(A|B) = P(B|A) × P(A) / P(B)
\`\`\`

## The Components

- **P(A|B)**: Posterior - what we want to know
- **P(B|A)**: Likelihood - how likely is B given A
- **P(A)**: Prior - initial belief about A
- **P(B)**: Evidence - total probability of B

## Why "Inverse Probability"?

Bayes lets us "flip" the conditional:
- We know P(B|A) - likelihood
- We want P(A|B) - posterior

Example:
- Know: P(Positive Test | Disease)
- Want: P(Disease | Positive Test)`,
      codeExamples: JSON.stringify([
        {
          id: "derivation",
          title: "Step-by-Step Derivation",
          code: "# Bayes' Theorem Derivation\n\nprint('BAYES\\' THEOREM DERIVATION')\nprint('=' * 50)\n\nprint('\\nStep 1: Start with conditional probability')\nprint('  P(A|B) = P(A ∩ B) / P(B)')\nprint('  P(B|A) = P(A ∩ B) / P(A)')\n\nprint('\\nStep 2: Solve second equation for P(A ∩ B)')\nprint('  P(A ∩ B) = P(B|A) × P(A)')\n\nprint('\\nStep 3: Substitute into first equation')\nprint('  P(A|B) = [P(B|A) × P(A)] / P(B)')\n\nprint('\\nStep 4: Bayes\\' Theorem!')\nprint('  ┌─────────────────────────────────┐')\nprint('  │  P(A|B) = P(B|A) × P(A) / P(B) │')\nprint('  └─────────────────────────────────┘')\n\nprint('\\nComponents:')\nprint('  P(A|B) = Posterior (what we want)')\nprint('  P(B|A) = Likelihood (data given hypothesis)')\nprint('  P(A)   = Prior (initial belief)')\nprint('  P(B)   = Evidence (normalizing constant)')",
          description: "Derive Bayes from first principles",
        },
        {
          id: "simple-example",
          title: "Simple Numerical Example",
          code: "# Simple Bayes example: Cookie jars\n\n# Two jars of cookies:\n# Jar 1: 30 chocolate, 10 vanilla (P(choc|J1) = 0.75)\n# Jar 2: 20 chocolate, 20 vanilla (P(choc|J2) = 0.50)\n# You pick a jar at random, then pick a cookie.\n# The cookie is chocolate. What's P(Jar1 | chocolate)?\n\nprint('Cookie Jar Problem')\nprint('=' * 45)\n\n# Prior: equal chance of each jar\nP_J1 = 0.5\nP_J2 = 0.5\n\n# Likelihood: P(chocolate | jar)\nP_choc_given_J1 = 30/40  # = 0.75\nP_choc_given_J2 = 20/40  # = 0.50\n\nprint(f'Prior: P(Jar1) = {P_J1}, P(Jar2) = {P_J2}')\nprint(f'Likelihood: P(choc|J1) = {P_choc_given_J1:.2f}')\nprint(f'Likelihood: P(choc|J2) = {P_choc_given_J2:.2f}')\n\n# Evidence: P(chocolate) using law of total probability\nP_choc = P_choc_given_J1 * P_J1 + P_choc_given_J2 * P_J2\nprint(f'\\nEvidence: P(chocolate) = {P_choc:.3f}')\n\n# Bayes' Theorem\nP_J1_given_choc = (P_choc_given_J1 * P_J1) / P_choc\n\nprint(f'\\nBayes\\' Theorem:')\nprint(f'P(J1|choc) = P(choc|J1) × P(J1) / P(choc)')\nprint(f'P(J1|choc) = {P_choc_given_J1:.2f} × {P_J1} / {P_choc:.3f}')\nprint(f'P(J1|choc) = {P_J1_given_choc:.3f}')\n\nprint(f'\\nGiven chocolate cookie, P(from Jar1) = {P_J1_given_choc:.1%}')",
          description: "Classic cookie jar example",
        },
        {
          id: "formula-breakdown",
          title: "Formula Component Analysis",
          code: "def bayes_theorem(prior, likelihood, evidence):\n    \"\"\"\n    P(A|B) = P(B|A) × P(A) / P(B)\n    \n    prior = P(A)\n    likelihood = P(B|A)\n    evidence = P(B)\n    \n    returns: posterior = P(A|B)\n    \"\"\"\n    posterior = (likelihood * prior) / evidence\n    return posterior\n\n# Example: Disease diagnosis\nprint('Bayes\\' Theorem Components')\nprint('=' * 45)\n\n# Disease affects 1% of population\nprior = 0.01  # P(Disease)\n\n# Test is 90% accurate for sick people\nlikelihood = 0.90  # P(Positive | Disease)\n\n# 5% false positive rate\nP_pos_given_healthy = 0.05\n\n# Calculate evidence P(Positive)\nevidence = likelihood * prior + P_pos_given_healthy * (1 - prior)\n\nprint(f'Prior P(Disease) = {prior:.2f}')\nprint(f'Likelihood P(+|Disease) = {likelihood:.2f}')\nprint(f'Evidence P(+) = {evidence:.4f}')\n\nposterior = bayes_theorem(prior, likelihood, evidence)\n\nprint(f'\\nPosterior P(Disease|+) = {posterior:.3f}')\nprint(f'\\nInterpretation:')\nprint(f'  Before test: {prior:.1%} chance of disease')\nprint(f'  After positive test: {posterior:.1%} chance')\nprint(f'  Update factor: {posterior/prior:.1f}x')",
          description: "Break down each component",
        },
      ]),
      keyPoints: [
        "P(A|B) = P(B|A) × P(A) / P(B)",
        "Derived from conditional probability",
        "Flips the direction of conditioning",
        "Prior: initial belief before evidence",
        "Likelihood: probability of evidence given hypothesis",
        "Posterior: updated belief after evidence",
      ],
      hardwareDemo: "Watch multiplication and division in ALU. See each component computed.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson20_2_1.number}: ${lesson20_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson20_2_1.id,
        number: 1,
        title: "Apply Bayes Formula",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given prior, likelihood, and evidence, calculate the posterior using Bayes' theorem.",
        starterCode: "# Bayes' Theorem: P(A|B) = P(B|A) × P(A) / P(B)\n\nprior = 0.3       # P(A)\nlikelihood = 0.8  # P(B|A)\nevidence = 0.5    # P(B)\n\nposterior = (likelihood * prior) / evidence\n\nprint('Bayes\\' Theorem Calculation')\nprint('=' * 35)\nprint(f'Prior P(A) = {prior}')\nprint(f'Likelihood P(B|A) = {likelihood}')\nprint(f'Evidence P(B) = {evidence}')\nprint(f'\\nPosterior P(A|B) = {likelihood} × {prior} / {evidence}')\nprint(f'Posterior P(A|B) = {posterior}')",
        solution: "# Direct application of Bayes formula",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Posterior = 0.48", description: "Bayes calculation" }]),
        hints: ["Multiply likelihood by prior", "Divide by evidence", "Result is posterior"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson20_2_1.id,
        number: 2,
        title: "Calculate Evidence",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use law of total probability to calculate P(B), then apply Bayes.",
        starterCode: "# P(B) = P(B|A)P(A) + P(B|not A)P(not A)\n\nP_A = 0.2\nP_B_given_A = 0.9\nP_B_given_not_A = 0.3\n\n# Calculate P(B) - the evidence\nP_B = P_B_given_A * P_A + P_B_given_not_A * (1 - P_A)\n\nprint('Law of Total Probability')\nprint('=' * 40)\nprint(f'P(A) = {P_A}')\nprint(f'P(B|A) = {P_B_given_A}')\nprint(f'P(B|not A) = {P_B_given_not_A}')\nprint(f'\\nP(B) = P(B|A)×P(A) + P(B|¬A)×P(¬A)')\nprint(f'P(B) = {P_B_given_A}×{P_A} + {P_B_given_not_A}×{1-P_A}')\nprint(f'P(B) = {P_B}')\n\n# Now Bayes\nP_A_given_B = (P_B_given_A * P_A) / P_B\nprint(f'\\nBayes: P(A|B) = {P_A_given_B:.3f}')",
        solution: "# Calculate evidence first, then Bayes",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Evidence and posterior", description: "Total probability" }]),
        hints: ["P(B) sums over all cases", "Two cases: A and not A", "Then apply Bayes"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson20_2_1.id,
        number: 3,
        title: "Bayes Function",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write a function that computes Bayes' theorem given all inputs.",
        starterCode: "def bayes(prior, likelihood, false_positive_rate):\n    \"\"\"\n    Calculate posterior probability.\n    \n    prior: P(H) - hypothesis probability\n    likelihood: P(E|H) - evidence given hypothesis\n    false_positive_rate: P(E|not H)\n    \n    Returns: P(H|E) - posterior\n    \"\"\"\n    # Calculate evidence P(E)\n    evidence = likelihood * prior + false_positive_rate * (1 - prior)\n    \n    # Bayes' theorem\n    posterior = (likelihood * prior) / evidence\n    \n    return posterior, evidence\n\n# Test: Rare disease (1%), test 95% sensitive, 10% false positive\nprior = 0.01\nlikelihood = 0.95\nfp_rate = 0.10\n\nposterior, evidence = bayes(prior, likelihood, fp_rate)\n\nprint('Bayes Function Test')\nprint('=' * 40)\nprint(f'Prior (disease rate): {prior:.1%}')\nprint(f'Sensitivity (true positive): {likelihood:.1%}')\nprint(f'False positive rate: {fp_rate:.1%}')\nprint(f'\\nP(positive test): {evidence:.3f}')\nprint(f'P(disease | positive): {posterior:.3f} = {posterior:.1%}')",
        solution: "# Reusable Bayes function",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Function works", description: "Bayes function" }]),
        hints: ["Calculate evidence first", "Use law of total probability", "Then apply formula"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson20_2_1.id,
        number: 4,
        title: "Compare Prior and Posterior",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show how evidence updates the prior to posterior. Calculate the update factor.",
        starterCode: "def analyze_update(prior, likelihood, fp_rate):\n    evidence = likelihood * prior + fp_rate * (1 - prior)\n    posterior = (likelihood * prior) / evidence\n    update_factor = posterior / prior\n    \n    return posterior, update_factor\n\nprint('Bayesian Update Analysis')\nprint('=' * 45)\n\nscenarios = [\n    ('Rare disease', 0.001, 0.99, 0.05),\n    ('Common cold', 0.20, 0.90, 0.10),\n    ('Email spam', 0.30, 0.95, 0.05),\n]\n\nfor name, prior, likelihood, fp in scenarios:\n    posterior, factor = analyze_update(prior, likelihood, fp)\n    print(f'\\n{name}:')\n    print(f'  Prior: {prior:.1%} → Posterior: {posterior:.1%}')\n    print(f'  Update factor: {factor:.1f}x')\n    if factor > 1:\n        print(f'  Evidence INCREASED belief by {factor:.1f}x')\n    else:\n        print(f'  Evidence DECREASED belief')",
        solution: "# Shows how evidence changes belief",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Update factors shown", description: "Update analysis" }]),
        hints: ["Update factor = posterior/prior", ">1 means increased belief", "Compare different scenarios"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson20_2_1.id,
        number: 5,
        title: "Derive Bayes Step by Step",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write code that shows each step of the Bayes derivation with actual numbers.",
        starterCode: "def bayes_derivation(P_A, P_B_given_A, P_B_given_not_A):\n    print('BAYES DERIVATION WITH NUMBERS')\n    print('=' * 50)\n    \n    # Step 1: Given values\n    print('\\nStep 1: Given')\n    print(f'  P(A) = {P_A}')\n    print(f'  P(B|A) = {P_B_given_A}')\n    print(f'  P(B|¬A) = {P_B_given_not_A}')\n    \n    # Step 2: Calculate P(A and B)\n    P_A_and_B = P_B_given_A * P_A\n    print(f'\\nStep 2: P(A ∩ B) = P(B|A) × P(A)')\n    print(f'  P(A ∩ B) = {P_B_given_A} × {P_A} = {P_A_and_B}')\n    \n    # Step 3: Calculate P(B)\n    P_B = P_B_given_A * P_A + P_B_given_not_A * (1 - P_A)\n    print(f'\\nStep 3: P(B) = P(B|A)P(A) + P(B|¬A)P(¬A)')\n    print(f'  P(B) = {P_B_given_A}×{P_A} + {P_B_given_not_A}×{1-P_A}')\n    print(f'  P(B) = {P_B}')\n    \n    # Step 4: Apply Bayes\n    P_A_given_B = P_A_and_B / P_B\n    print(f'\\nStep 4: Bayes\\' Theorem')\n    print(f'  P(A|B) = P(A ∩ B) / P(B)')\n    print(f'  P(A|B) = {P_A_and_B} / {P_B}')\n    print(f'  P(A|B) = {P_A_given_B:.4f}')\n    \n    return P_A_given_B\n\n# Example\nbayes_derivation(0.1, 0.8, 0.2)",
        solution: "# Complete derivation with numbers",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All steps shown", description: "Full derivation" }]),
        hints: ["Show P(A∩B) = P(B|A)P(A)", "Calculate P(B) via total probability", "Final division gives posterior"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 20.2.1`);

  const lesson20_2_2 = await prisma.lesson.upsert({
    where: { slug: "bayes-theorem-applications" },
    update: {},
    create: {
      sectionId: section20_2.id,
      number: 20.22,
      title: "Bayes' Theorem Applications (Medical Testing)",
      slug: "bayes-theorem-applications",
      objectives: [
        "Apply Bayes to medical test interpretation",
        "Understand sensitivity and specificity",
        "Calculate positive predictive value",
        "See why rare disease tests are tricky",
      ],
      content: `# Bayes' Theorem: Medical Testing

## Medical Test Terminology

- **Sensitivity**: P(Positive | Disease) - true positive rate
- **Specificity**: P(Negative | No Disease) - true negative rate
- **False Positive Rate**: 1 - Specificity = P(Positive | No Disease)
- **PPV**: P(Disease | Positive) - what patients want to know!

## The Paradox of Rare Disease Testing

Even with a "95% accurate" test:
- If disease affects 1% of population
- Test positive → only ~16% chance of having disease!

Why? Most positives come from the 99% healthy people!

## Bayes in Action

\`\`\`
P(Disease | +) = P(+ | Disease) × P(Disease) / P(+)
\`\`\`

Where:
\`\`\`
P(+) = P(+|D)×P(D) + P(+|¬D)×P(¬D)
\`\`\`

## Key Insight

The **base rate** (prevalence) matters enormously!
- High prevalence → positive test is more meaningful
- Low prevalence → many false positives`,
      codeExamples: JSON.stringify([
        {
          id: "medical-test",
          title: "Medical Test Interpretation",
          code: "# Medical test scenario\n\n# Disease prevalence: 1%\nP_disease = 0.01\nP_healthy = 1 - P_disease\n\n# Test characteristics\nsensitivity = 0.95  # P(+|Disease)\nspecificity = 0.90  # P(-|Healthy)\nfalse_positive_rate = 1 - specificity  # P(+|Healthy)\n\nprint('Medical Test Analysis')\nprint('=' * 50)\nprint(f'Disease prevalence: {P_disease:.1%}')\nprint(f'Test sensitivity: {sensitivity:.1%}')\nprint(f'Test specificity: {specificity:.1%}')\nprint(f'False positive rate: {false_positive_rate:.1%}')\n\n# Calculate P(+)\nP_positive = sensitivity * P_disease + false_positive_rate * P_healthy\nprint(f'\\nP(test positive) = {P_positive:.4f}')\n\n# Bayes: P(Disease | Positive)\nP_disease_given_pos = (sensitivity * P_disease) / P_positive\n\nprint(f'\\nBAYES\\' THEOREM:')\nprint(f'P(Disease|+) = P(+|Disease) × P(Disease) / P(+)')\nprint(f'P(Disease|+) = {sensitivity} × {P_disease} / {P_positive:.4f}')\nprint(f'P(Disease|+) = {P_disease_given_pos:.4f}')\n\nprint(f'\\n⚠️  RESULT: If you test positive,')\nprint(f'   you have only a {P_disease_given_pos:.1%} chance of having the disease!')\nprint(f'\\n   The \"95% accurate\" test gives very different info')\nprint(f'   when the disease is rare!')",
          description: "Classic medical test example",
        },
        {
          id: "prevalence-effect",
          title: "Effect of Disease Prevalence",
          code: "def ppv(prevalence, sensitivity, specificity):\n    \"\"\"Calculate Positive Predictive Value\"\"\"\n    fp_rate = 1 - specificity\n    P_pos = sensitivity * prevalence + fp_rate * (1 - prevalence)\n    return (sensitivity * prevalence) / P_pos\n\nprint('Effect of Prevalence on PPV')\nprint('=' * 50)\nprint('(Same test: 95% sensitivity, 90% specificity)')\nprint(f'\\n{\"Prevalence\":>12} {\"PPV\":>10} {\"Interpretation\":>25}')\nprint('-' * 50)\n\nprevalences = [0.001, 0.01, 0.05, 0.10, 0.20, 0.50]\nfor prev in prevalences:\n    value = ppv(prev, 0.95, 0.90)\n    if value < 0.10:\n        interp = 'Very unreliable'\n    elif value < 0.50:\n        interp = 'More likely healthy'\n    elif value < 0.80:\n        interp = 'Uncertain'\n    else:\n        interp = 'Probably has disease'\n    print(f'{prev:>11.1%} {value:>10.1%} {interp:>25}')\n\nprint('\\n💡 Higher prevalence = more meaningful positive test')",
          description: "See how prevalence affects interpretation",
        },
        {
          id: "confusion-matrix",
          title: "Visualize with Confusion Matrix",
          code: "def medical_confusion_matrix(population, prevalence, sensitivity, specificity):\n    \"\"\"Create confusion matrix for medical test\"\"\"\n    diseased = int(population * prevalence)\n    healthy = population - diseased\n    \n    # Test results\n    true_positive = int(diseased * sensitivity)\n    false_negative = diseased - true_positive\n    true_negative = int(healthy * specificity)\n    false_positive = healthy - true_negative\n    \n    return true_positive, false_negative, false_positive, true_negative\n\n# Population of 10,000\npop = 10000\nprev = 0.01\nsens = 0.95\nspec = 0.90\n\ntp, fn, fp, tn = medical_confusion_matrix(pop, prev, sens, spec)\n\nprint('Confusion Matrix (Population: 10,000)')\nprint('=' * 50)\nprint(f'Disease prevalence: {prev:.1%} ({int(pop*prev)} people)')\nprint(f'\\n{\"\":15} {\"Test +\":>10} {\"Test -\":>10} {\"Total\":>10}')\nprint('-' * 50)\nprint(f'{\"Has Disease\":15} {tp:>10} {fn:>10} {tp+fn:>10}')\nprint(f'{\"No Disease\":15} {fp:>10} {tn:>10} {fp+tn:>10}')\nprint('-' * 50)\nprint(f'{\"Total\":15} {tp+fp:>10} {fn+tn:>10} {pop:>10}')\n\nppv = tp / (tp + fp)\nnpv = tn / (tn + fn)\n\nprint(f'\\nPositive Predictive Value: {tp}/{tp+fp} = {ppv:.1%}')\nprint(f'Negative Predictive Value: {tn}/{tn+fn} = {npv:.1%}')\nprint(f'\\n{tp+fp} people test positive, but only {tp} have the disease!')",
          description: "Concrete numbers in confusion matrix",
        },
      ]),
      keyPoints: [
        "Sensitivity = P(+|Disease), Specificity = P(-|Healthy)",
        "PPV = P(Disease|+) is what patients need",
        "Rare diseases: many false positives!",
        "Base rate (prevalence) is crucial",
        "95% accurate ≠ 95% chance of disease",
        "Always consider prevalence when interpreting tests",
      ],
      hardwareDemo: "Watch Bayes calculation. See confusion matrix counts.",
      estimatedTime: 35,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson20_2_2.number}: ${lesson20_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson20_2_2.id,
        number: 1,
        title: "Calculate PPV",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given sensitivity=99%, specificity=95%, prevalence=2%, calculate PPV.",
        starterCode: "# Medical test parameters\nprevalence = 0.02\nsensitivity = 0.99\nspecificity = 0.95\nfalse_positive_rate = 1 - specificity\n\n# P(+) = P(+|D)P(D) + P(+|¬D)P(¬D)\nP_positive = sensitivity * prevalence + false_positive_rate * (1 - prevalence)\n\n# PPV = P(D|+)\nPPV = (sensitivity * prevalence) / P_positive\n\nprint('Positive Predictive Value')\nprint('=' * 40)\nprint(f'Prevalence: {prevalence:.1%}')\nprint(f'Sensitivity: {sensitivity:.1%}')\nprint(f'Specificity: {specificity:.1%}')\nprint(f'\\nP(positive test): {P_positive:.4f}')\nprint(f'PPV = P(Disease | Positive): {PPV:.1%}')",
        solution: "# PPV calculation",
        testCases: JSON.stringify([{ input: "", expectedOutput: "PPV calculated", description: "PPV calculation" }]),
        hints: ["Calculate P(+) first", "Use law of total probability", "Then apply Bayes"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson20_2_2.id,
        number: 2,
        title: "Build Confusion Matrix",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "For a population of 100,000 with 1% disease rate and a test (90% sens, 95% spec), build the confusion matrix.",
        starterCode: "population = 100000\nprevalence = 0.01\nsensitivity = 0.90\nspecificity = 0.95\n\n# Calculate counts\ndiseased = int(population * prevalence)\nhealthy = population - diseased\n\ntrue_positive = int(diseased * sensitivity)\nfalse_negative = diseased - true_positive\ntrue_negative = int(healthy * specificity)\nfalse_positive = healthy - true_negative\n\nprint('Confusion Matrix')\nprint('=' * 45)\nprint(f'{\"\":15} {\"Test +\":>10} {\"Test -\":>10}')\nprint('-' * 45)\nprint(f'{\"Disease\":15} {true_positive:>10} {false_negative:>10}')\nprint(f'{\"No Disease\":15} {false_positive:>10} {true_negative:>10}')\nprint('-' * 45)\nprint(f'{\"Total\":15} {true_positive+false_positive:>10} {false_negative+true_negative:>10}')\n\nprint(f'\\nOf {true_positive+false_positive} positive tests:')\nprint(f'  True positives: {true_positive}')\nprint(f'  False positives: {false_positive}')",
        solution: "# Confusion matrix with real numbers",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Matrix displayed", description: "Confusion matrix" }]),
        hints: ["1000 diseased, 99000 healthy", "Apply sensitivity and specificity", "Count each cell"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson20_2_2.id,
        number: 3,
        title: "Compare Different Prevalences",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show how PPV changes with prevalence for the same test.",
        starterCode: "def calculate_ppv(prevalence, sensitivity, specificity):\n    fp_rate = 1 - specificity\n    P_pos = sensitivity * prevalence + fp_rate * (1 - prevalence)\n    return (sensitivity * prevalence) / P_pos\n\n# Same test characteristics\nsensitivity = 0.95\nspecificity = 0.95\n\nprint('PPV vs Prevalence')\nprint('=' * 40)\nprint(f'Test: {sensitivity:.0%} sensitivity, {specificity:.0%} specificity')\nprint(f'\\n{\"Prevalence\":>12} {\"PPV\":>10}')\nprint('-' * 25)\n\nfor prev in [0.001, 0.01, 0.05, 0.10, 0.25, 0.50]:\n    ppv = calculate_ppv(prev, sensitivity, specificity)\n    print(f'{prev:>11.1%} {ppv:>10.1%}')\n\nprint('\\n↑ Higher prevalence = more trustworthy positive')",
        solution: "# PPV increases with prevalence",
        testCases: JSON.stringify([{ input: "", expectedOutput: "PPV table", description: "Prevalence effect" }]),
        hints: ["Same test, different populations", "Low prevalence = low PPV", "High prevalence = high PPV"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson20_2_2.id,
        number: 4,
        title: "NPV Calculation",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Calculate Negative Predictive Value: P(No Disease | Negative Test).",
        starterCode: "# NPV = P(Healthy | Negative Test)\n\nprevalence = 0.01\nsensitivity = 0.95\nspecificity = 0.90\n\n# P(-) = P(-|D)P(D) + P(-|¬D)P(¬D)\nP_neg_given_disease = 1 - sensitivity  # false negative rate\nP_neg_given_healthy = specificity       # true negative rate\n\nP_negative = P_neg_given_disease * prevalence + P_neg_given_healthy * (1 - prevalence)\n\n# NPV = P(Healthy | -)\nNPV = (P_neg_given_healthy * (1 - prevalence)) / P_negative\n\nprint('Negative Predictive Value')\nprint('=' * 45)\nprint(f'If you test NEGATIVE:')\nprint(f'  P(No Disease | Negative) = {NPV:.4f}')\nprint(f'  NPV = {NPV:.1%}')\n\nprint(f'\\nIf you test POSITIVE (for comparison):')\nP_positive = sensitivity * prevalence + (1-specificity) * (1-prevalence)\nPPV = (sensitivity * prevalence) / P_positive\nprint(f'  PPV = {PPV:.1%}')\n\nprint(f'\\n💡 NPV is usually high for rare diseases!')\nprint(f'   Negative test is very reassuring.')",
        solution: "# NPV is usually high for rare diseases",
        testCases: JSON.stringify([{ input: "", expectedOutput: "NPV calculated", description: "NPV calculation" }]),
        hints: ["P(-) includes false negatives", "NPV uses P(Healthy) and specificity", "Usually high for rare diseases"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson20_2_2.id,
        number: 5,
        title: "Two-Stage Testing",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "If first test is positive, a second confirmatory test is done. Calculate final probability.",
        starterCode: "# Two-stage testing for rare disease\n\nprevalence = 0.001  # 0.1%\n\n# Screening test (cheap, sensitive)\nscreen_sens = 0.99\nscreen_spec = 0.95\n\n# Confirmatory test (expensive, specific)\nconfirm_sens = 0.95\nconfirm_spec = 0.99\n\n# Stage 1: Screening\nfp_rate1 = 1 - screen_spec\nP_pos1 = screen_sens * prevalence + fp_rate1 * (1 - prevalence)\nP_disease_given_pos1 = (screen_sens * prevalence) / P_pos1\n\nprint('Two-Stage Testing Protocol')\nprint('=' * 50)\nprint(f'\\nStage 1: Screening Test')\nprint(f'  P(Disease | Screen+) = {P_disease_given_pos1:.2%}')\n\n# Stage 2: Among those who screened positive\n# Now prevalence is P_disease_given_pos1\nprevalence2 = P_disease_given_pos1\nfp_rate2 = 1 - confirm_spec\nP_pos2 = confirm_sens * prevalence2 + fp_rate2 * (1 - prevalence2)\nP_disease_given_both_pos = (confirm_sens * prevalence2) / P_pos2\n\nprint(f'\\nStage 2: Confirmatory Test (among screen+)')\nprint(f'  P(Disease | Both Tests+) = {P_disease_given_both_pos:.2%}')\n\nprint(f'\\n💡 Two positive tests: {P_disease_given_both_pos:.1%} chance of disease')\nprint(f'   Much better than single test: {P_disease_given_pos1:.1%}')",
        solution: "# Sequential testing improves accuracy",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Two-stage result", description: "Sequential testing" }]),
        hints: ["First test updates prevalence", "Use updated prevalence for second", "Dramatically improves PPV"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 20.2.2`);

  const lesson20_2_3 = await prisma.lesson.upsert({
    where: { slug: "prior-posterior-probabilities" },
    update: {},
    create: {
      sectionId: section20_2.id,
      number: 20.23,
      title: "Prior and Posterior Probabilities",
      slug: "prior-posterior-probabilities",
      objectives: [
        "Understand prior as initial belief",
        "See posterior as updated belief",
        "Recognize how evidence changes beliefs",
        "Apply Bayesian reasoning to decisions",
      ],
      content: `# Prior and Posterior Probabilities

## Prior Probability

Your belief **before** seeing evidence.

Sources of priors:
- Historical data (base rates)
- Expert knowledge
- Previous studies
- Reasonable assumptions

## Posterior Probability

Your belief **after** incorporating evidence.

\`\`\`
Posterior ∝ Likelihood × Prior
\`\`\`

## The Bayesian Update

1. Start with prior belief P(H)
2. Observe evidence E
3. Calculate P(E|H) - likelihood
4. Update to posterior P(H|E)

## Example: Email Spam

**Prior**: 30% of emails are spam
**Evidence**: Email contains "free money"
**Likelihood**: P("free money" | spam) = 80%
**Posterior**: P(spam | "free money") = ?

## Key Insight

Evidence that is:
- More likely under H₁ than H₂ → increases P(H₁)
- Equally likely → doesn't change beliefs
- Less likely under H₁ → decreases P(H₁)`,
      codeExamples: JSON.stringify([
        {
          id: "prior-to-posterior",
          title: "Prior to Posterior Update",
          code: "def bayesian_update(prior, likelihood, false_positive_rate):\n    \"\"\"Update prior to posterior given evidence\"\"\"\n    evidence = likelihood * prior + false_positive_rate * (1 - prior)\n    posterior = (likelihood * prior) / evidence\n    return posterior\n\nprint('Bayesian Update: Prior → Posterior')\nprint('=' * 50)\n\n# Scenario: Is this email spam?\nprior = 0.30  # 30% of emails are spam\n\n# Evidence: contains \"free money\"\nP_free_given_spam = 0.80\nP_free_given_ham = 0.05\n\nposterior = bayesian_update(prior, P_free_given_spam, P_free_given_ham)\n\nprint(f'\\nPrior P(spam) = {prior:.0%}')\nprint(f'Evidence: email contains \"free money\"')\nprint(f'  P(\"free money\" | spam) = {P_free_given_spam:.0%}')\nprint(f'  P(\"free money\" | ham) = {P_free_given_ham:.0%}')\nprint(f'\\nPosterior P(spam | \"free money\") = {posterior:.1%}')\nprint(f'\\nBelief updated: {prior:.0%} → {posterior:.1%}')\nprint(f'Update factor: {posterior/prior:.1f}x')",
          description: "Watch belief update with evidence",
        },
        {
          id: "multiple-evidence",
          title: "Multiple Pieces of Evidence",
          code: "def sequential_update(prior, evidence_list):\n    \"\"\"Update belief with multiple pieces of evidence\"\"\"\n    current = prior\n    print(f'Starting prior: {current:.1%}')\n    \n    for i, (name, likelihood, fp_rate) in enumerate(evidence_list, 1):\n        evidence = likelihood * current + fp_rate * (1 - current)\n        posterior = (likelihood * current) / evidence\n        print(f'\\nEvidence {i}: {name}')\n        print(f'  Likelihood ratio: {likelihood/fp_rate:.1f}')\n        print(f'  {current:.1%} → {posterior:.1%}')\n        current = posterior\n    \n    return current\n\nprint('Sequential Bayesian Updates')\nprint('=' * 50)\n\n# Spam detection with multiple clues\nprior_spam = 0.30\n\nevidence = [\n    ('Contains \"free\"', 0.70, 0.10),\n    ('Has exclamation marks', 0.60, 0.20),\n    ('Unknown sender', 0.80, 0.30),\n]\n\nfinal = sequential_update(prior_spam, evidence)\nprint(f'\\nFinal probability of spam: {final:.1%}')",
          description: "Update with multiple evidence pieces",
        },
        {
          id: "likelihood-ratio",
          title: "Likelihood Ratio Intuition",
          code: "def analyze_evidence(likelihood_H, likelihood_not_H):\n    \"\"\"Analyze how evidence affects beliefs\"\"\"\n    ratio = likelihood_H / likelihood_not_H\n    \n    if ratio > 1:\n        effect = 'INCREASES belief in H'\n    elif ratio < 1:\n        effect = 'DECREASES belief in H'\n    else:\n        effect = 'NO CHANGE in belief'\n    \n    return ratio, effect\n\nprint('Likelihood Ratio Analysis')\nprint('=' * 50)\nprint('How does evidence affect our belief?')\nprint('\\nLikelihood ratio = P(E|H) / P(E|¬H)')\n\nevidences = [\n    ('Positive test', 0.95, 0.05),  # Strong evidence FOR\n    ('Coin flip heads', 0.50, 0.50),  # No information\n    ('Passes smell test', 0.30, 0.90),  # Evidence AGAINST\n]\n\nprint(f'\\n{\"Evidence\":20} {\"P(E|H)\":>8} {\"P(E|¬H)\":>8} {\"Ratio\":>8} {\"Effect\":>20}')\nprint('-' * 70)\n\nfor name, p_h, p_not_h in evidences:\n    ratio, effect = analyze_evidence(p_h, p_not_h)\n    print(f'{name:20} {p_h:>8.2f} {p_not_h:>8.2f} {ratio:>8.1f} {effect:>20}')\n\nprint('\\n💡 Ratio > 1: evidence supports H')\nprint('   Ratio < 1: evidence contradicts H')\nprint('   Ratio = 1: evidence is uninformative')",
          description: "Understand likelihood ratio",
        },
      ]),
      keyPoints: [
        "Prior: belief before evidence",
        "Posterior: belief after evidence",
        "Likelihood ratio determines update direction",
        "Ratio > 1: evidence supports hypothesis",
        "Multiple evidence: update sequentially",
        "Bayesian thinking: rational belief updating",
      ],
      hardwareDemo: "Watch prior transform to posterior. See ratio calculations.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson20_2_3.number}: ${lesson20_2_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson20_2_3.id,
        number: 1,
        title: "Prior to Posterior",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given prior=0.2, likelihood=0.9, false_positive=0.1, calculate posterior.",
        starterCode: "prior = 0.2\nlikelihood = 0.9  # P(evidence | hypothesis)\nfalse_positive = 0.1  # P(evidence | not hypothesis)\n\n# Calculate evidence\nevidence = likelihood * prior + false_positive * (1 - prior)\n\n# Calculate posterior\nposterior = (likelihood * prior) / evidence\n\nprint('Bayesian Update')\nprint('=' * 35)\nprint(f'Prior: {prior}')\nprint(f'Likelihood: {likelihood}')\nprint(f'False positive rate: {false_positive}')\nprint(f'\\nEvidence P(E): {evidence}')\nprint(f'Posterior: {posterior:.3f}')\nprint(f'\\nBelief changed: {prior:.0%} → {posterior:.1%}')",
        solution: "# Basic Bayesian update",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Posterior calculated", description: "Basic update" }]),
        hints: ["Calculate P(E) first", "Apply Bayes formula", "Compare prior to posterior"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson20_2_3.id,
        number: 2,
        title: "Likelihood Ratio",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate likelihood ratio and determine if evidence supports or contradicts hypothesis.",
        starterCode: "# Different pieces of evidence\nevidences = [\n    ('Strong positive test', 0.95, 0.10),\n    ('Weak positive test', 0.60, 0.40),\n    ('Neutral observation', 0.50, 0.50),\n    ('Contradicting evidence', 0.20, 0.80),\n]\n\nprint('Likelihood Ratio Analysis')\nprint('=' * 55)\nprint(f'{\"Evidence\":25} {\"L(H)\":>8} {\"L(¬H)\":>8} {\"Ratio\":>8} {\"Effect\":>12}')\nprint('-' * 55)\n\nfor name, l_h, l_not_h in evidences:\n    ratio = l_h / l_not_h\n    if ratio > 1:\n        effect = 'Supports H'\n    elif ratio < 1:\n        effect = 'Against H'\n    else:\n        effect = 'Neutral'\n    print(f'{name:25} {l_h:>8.2f} {l_not_h:>8.2f} {ratio:>8.2f} {effect:>12}')",
        solution: "# Likelihood ratio interpretation",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Ratios analyzed", description: "Likelihood ratio" }]),
        hints: ["Ratio = P(E|H) / P(E|¬H)", ">1 supports, <1 contradicts", "=1 is neutral"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson20_2_3.id,
        number: 3,
        title: "Sequential Updates",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Update belief through multiple pieces of evidence sequentially.",
        starterCode: "def update(prior, likelihood, fp_rate):\n    evidence = likelihood * prior + fp_rate * (1 - prior)\n    return (likelihood * prior) / evidence\n\n# Detective investigating a suspect\nprior = 0.10  # Initial suspicion\n\nclues = [\n    ('Found at scene', 0.60, 0.20),\n    ('Has motive', 0.70, 0.30),\n    ('No alibi', 0.80, 0.40),\n]\n\nprint('Detective\\'s Bayesian Investigation')\nprint('=' * 45)\ncurrent = prior\nprint(f'Initial suspicion: {current:.1%}')\n\nfor clue, l_guilty, l_innocent in clues:\n    new = update(current, l_guilty, l_innocent)\n    print(f'\\nClue: {clue}')\n    print(f'  {current:.1%} → {new:.1%}')\n    current = new\n\nprint(f'\\nFinal probability of guilt: {current:.1%}')",
        solution: "# Sequential Bayesian updates",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Updates shown", description: "Sequential update" }]),
        hints: ["Each update uses previous posterior", "Posterior becomes new prior", "Track the journey"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson20_2_3.id,
        number: 4,
        title: "Comparing Hypotheses",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Given evidence, compare two hypotheses and determine which is more likely.",
        starterCode: "# Two competing hypotheses about a coin\n# H1: Fair coin (P(heads) = 0.5)\n# H2: Biased coin (P(heads) = 0.8)\n\n# Prior: equal belief in both\nprior_H1 = 0.5\nprior_H2 = 0.5\n\n# Evidence: 7 heads in 10 flips\n# P(7H in 10 | fair) using binomial\nimport math\ndef binomial_prob(n, k, p):\n    comb = math.factorial(n) // (math.factorial(k) * math.factorial(n-k))\n    return comb * (p ** k) * ((1-p) ** (n-k))\n\nP_evidence_H1 = binomial_prob(10, 7, 0.5)\nP_evidence_H2 = binomial_prob(10, 7, 0.8)\n\nprint('Hypothesis Comparison')\nprint('=' * 45)\nprint('Evidence: 7 heads in 10 flips')\nprint(f'\\nP(evidence | fair coin) = {P_evidence_H1:.4f}')\nprint(f'P(evidence | biased coin) = {P_evidence_H2:.4f}')\n\n# Bayes for each\nP_evidence = P_evidence_H1 * prior_H1 + P_evidence_H2 * prior_H2\nposterior_H1 = (P_evidence_H1 * prior_H1) / P_evidence\nposterior_H2 = (P_evidence_H2 * prior_H2) / P_evidence\n\nprint(f'\\nPosterior P(fair | evidence) = {posterior_H1:.3f}')\nprint(f'Posterior P(biased | evidence) = {posterior_H2:.3f}')\n\nprint(f'\\n→ Biased coin is {posterior_H2/posterior_H1:.1f}x more likely')",
        solution: "# Compare hypotheses via posteriors",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Hypotheses compared", description: "Hypothesis comparison" }]),
        hints: ["Calculate likelihood for each H", "Apply Bayes to each", "Compare posteriors"],
        xpReward: 25,
        order: 4,
      },
      {
        lessonId: lesson20_2_3.id,
        number: 5,
        title: "Prior Sensitivity",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Show how different priors lead to different posteriors given same evidence.",
        starterCode: "def update(prior, likelihood, fp_rate):\n    evidence = likelihood * prior + fp_rate * (1 - prior)\n    return (likelihood * prior) / evidence\n\n# Same evidence for all\nlikelihood = 0.90\nfp_rate = 0.10\n\nprint('Prior Sensitivity Analysis')\nprint('=' * 50)\nprint('Same evidence, different priors')\nprint(f'Likelihood: {likelihood}, FP rate: {fp_rate}')\nprint(f'\\n{\"Prior\":>10} {\"Posterior\":>12} {\"Change\":>12}')\nprint('-' * 40)\n\nfor prior in [0.01, 0.10, 0.30, 0.50, 0.70, 0.90]:\n    posterior = update(prior, likelihood, fp_rate)\n    change = posterior - prior\n    sign = '+' if change > 0 else ''\n    print(f'{prior:>10.0%} {posterior:>12.1%} {sign}{change:>11.1%}')\n\nprint('\\n💡 Strong priors are harder to move!')\nprint('   Weak priors are easily swayed by evidence.')",
        solution: "# Prior affects posterior significantly",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Sensitivity shown", description: "Prior sensitivity" }]),
        hints: ["Same evidence, vary prior", "Strong priors resist change", "Weak priors shift easily"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 20.2.3`);

  console.log("\n✅ Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
