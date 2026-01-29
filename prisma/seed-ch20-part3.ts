import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 3: Lessons 20.3.1-20.3.3 (Bayesian Classification)...\n");

  const section20_3 = await prisma.section.findFirst({ where: { number: 20.3 } });
  if (!section20_3) throw new Error("Section 20.3 not found. Run part 1 first.");

  const lesson20_3_1 = await prisma.lesson.upsert({
    where: { slug: "bayesian-updating-process" },
    update: {},
    create: {
      sectionId: section20_3.id,
      number: 20.31,
      title: "Bayesian Updating Process",
      slug: "bayesian-updating-process",
      objectives: [
        "Implement iterative Bayesian updates",
        "Watch beliefs evolve with data",
        "Understand convergence to truth",
        "Apply to real-world scenarios",
      ],
      content: `# Bayesian Updating Process

## The Iterative Process

1. Start with prior belief
2. Observe new evidence
3. Update to posterior
4. Posterior becomes new prior
5. Repeat with more evidence

## Why It Works

With enough evidence, Bayesian updating converges to the truth regardless of starting prior (unless prior is 0 or 1).

## The Update Formula

For each piece of evidence:
\`\`\`
P(H|E) = P(E|H) × P(H) / P(E)
\`\`\`

Then: new_prior = posterior

## Example: Learning a Coin's Bias

- Start uncertain: P(fair) = 0.5
- Flip and observe
- Update belief after each flip
- Eventually learn true bias

## Key Properties

- More data → more confident
- Surprising evidence → bigger updates
- Expected evidence → smaller updates`,
      codeExamples: JSON.stringify([
        {
          id: "coin-learning",
          title: "Learning Coin Bias",
          code: "import random\n\ndef update_coin_belief(prior_fair, outcome):\n    \"\"\"Update belief about fair coin given flip outcome\"\"\"\n    # P(heads | fair) = 0.5\n    # P(heads | biased) = 0.8 (assume biased means heads-heavy)\n    \n    if outcome == 'H':\n        P_outcome_fair = 0.5\n        P_outcome_biased = 0.8\n    else:\n        P_outcome_fair = 0.5\n        P_outcome_biased = 0.2\n    \n    prior_biased = 1 - prior_fair\n    \n    # Evidence\n    P_outcome = P_outcome_fair * prior_fair + P_outcome_biased * prior_biased\n    \n    # Posterior\n    posterior_fair = (P_outcome_fair * prior_fair) / P_outcome\n    \n    return posterior_fair\n\n# Simulate learning (coin is actually biased)\nrandom.seed(42)\ntrue_heads_prob = 0.8  # Biased coin\n\nbelief_fair = 0.5  # Start uncertain\nprint('Learning Coin Bias Through Flips')\nprint('=' * 45)\nprint(f'True coin: P(heads) = {true_heads_prob} (biased)')\nprint(f'Starting belief P(fair): {belief_fair}')\nprint(f'\\n{\"Flip\":>5} {\"Result\":>8} {\"P(fair)\":>10}')\nprint('-' * 30)\n\nfor i in range(15):\n    flip = 'H' if random.random() < true_heads_prob else 'T'\n    belief_fair = update_coin_belief(belief_fair, flip)\n    print(f'{i+1:>5} {flip:>8} {belief_fair:>10.3f}')\n\nprint(f'\\nFinal belief P(fair) = {belief_fair:.3f}')\nprint('Correctly learned coin is biased!')",
          description: "Watch belief converge to truth",
        },
        {
          id: "general-updating",
          title: "General Bayesian Updater",
          code: "class BayesianUpdater:\n    def __init__(self, prior, likelihood_true, likelihood_false):\n        self.belief = prior\n        self.likelihood_true = likelihood_true\n        self.likelihood_false = likelihood_false\n        self.history = [prior]\n    \n    def update(self, evidence_observed):\n        if evidence_observed:\n            likelihood = self.likelihood_true\n            fp_rate = self.likelihood_false\n        else:\n            likelihood = 1 - self.likelihood_true\n            fp_rate = 1 - self.likelihood_false\n        \n        P_evidence = likelihood * self.belief + fp_rate * (1 - self.belief)\n        self.belief = (likelihood * self.belief) / P_evidence\n        self.history.append(self.belief)\n        return self.belief\n\n# Example: Is the defendant guilty?\nupdater = BayesianUpdater(\n    prior=0.1,  # Presumption of innocence\n    likelihood_true=0.8,   # P(evidence | guilty)\n    likelihood_false=0.2   # P(evidence | innocent)\n)\n\nprint('Bayesian Belief Tracking')\nprint('=' * 40)\n\nevidences = [True, True, False, True, True, True]\nprint(f'Starting belief: {updater.belief:.1%}')\n\nfor i, ev in enumerate(evidences, 1):\n    new_belief = updater.update(ev)\n    ev_str = 'supports' if ev else 'against'\n    print(f'Evidence {i} ({ev_str}): belief = {new_belief:.1%}')\n\nprint(f'\\nBelief trajectory: {[f\"{b:.0%}\" for b in updater.history]}')",
          description: "Reusable Bayesian updater class",
        },
        {
          id: "convergence",
          title: "Convergence Demonstration",
          code: "import random\n\ndef simulate_convergence(true_value, prior, n_observations):\n    \"\"\"Show how different priors converge to truth\"\"\"\n    belief = prior\n    \n    for _ in range(n_observations):\n        # Generate observation based on true value\n        obs = random.random() < true_value\n        \n        # Update (simple binary model)\n        if obs:\n            likelihood = true_value\n            fp = 1 - true_value\n        else:\n            likelihood = 1 - true_value\n            fp = true_value\n        \n        evidence = likelihood * belief + fp * (1 - belief)\n        belief = (likelihood * belief) / evidence\n    \n    return belief\n\nprint('Convergence from Different Priors')\nprint('=' * 50)\nprint(f'True probability: 0.7')\nprint(f'Observations: 50')\n\nrandom.seed(42)\npriors = [0.1, 0.3, 0.5, 0.7, 0.9]\n\nprint(f'\\n{\"Starting Prior\":>15} {\"Final Belief\":>15} {\"Error\":>10}')\nprint('-' * 45)\n\nfor prior in priors:\n    final = simulate_convergence(0.7, prior, 50)\n    error = abs(final - 0.7)\n    print(f'{prior:>15.1f} {final:>15.3f} {error:>10.3f}')\n\nprint('\\n💡 All priors converge to similar beliefs!')\nprint('   Evidence overwhelms initial beliefs.')",
          description: "Different priors converge to truth",
        },
      ]),
      keyPoints: [
        "Posterior becomes next prior",
        "Iterate with each new evidence",
        "Beliefs converge to truth",
        "More evidence → more certainty",
        "Surprising evidence → big updates",
        "Prior doesn't matter with enough data",
      ],
      hardwareDemo: "Watch belief variable update in memory. See convergence over iterations.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson20_3_1.number}: ${lesson20_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson20_3_1.id,
        number: 1,
        title: "Iterative Updates",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement Bayesian updating for 10 observations. Track belief at each step.",
        starterCode: "def bayesian_update(prior, likelihood, fp_rate, evidence):\n    if evidence:\n        l, fp = likelihood, fp_rate\n    else:\n        l, fp = 1 - likelihood, 1 - fp_rate\n    \n    P_e = l * prior + fp * (1 - prior)\n    return (l * prior) / P_e\n\n# Track belief over observations\nbelief = 0.5\nlikelihood = 0.9\nfp_rate = 0.2\n\nobservations = [True, True, True, False, True, True, False, True, True, True]\n\nprint('Iterative Bayesian Updates')\nprint('=' * 40)\nprint(f'{\"Obs\":>5} {\"Evidence\":>10} {\"Belief\":>10}')\nprint('-' * 30)\nprint(f'{\"\":>5} {\"(prior)\":>10} {belief:>10.3f}')\n\nfor i, obs in enumerate(observations, 1):\n    belief = bayesian_update(belief, likelihood, fp_rate, obs)\n    obs_str = '+' if obs else '-'\n    print(f'{i:>5} {obs_str:>10} {belief:>10.3f}')",
        solution: "# Track belief trajectory",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Beliefs tracked", description: "Iterative updates" }]),
        hints: ["Each update uses previous result", "Positive evidence increases belief", "Track the journey"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson20_3_1.id,
        number: 2,
        title: "Belief Convergence",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show that different starting priors converge to similar beliefs given enough evidence.",
        starterCode: "import random\n\ndef run_updates(prior, n_updates, true_prob=0.7):\n    belief = prior\n    random.seed(123)  # Same sequence for all\n    \n    for _ in range(n_updates):\n        obs = random.random() < true_prob\n        if obs:\n            l, fp = 0.8, 0.3\n        else:\n            l, fp = 0.2, 0.7\n        P_e = l * belief + fp * (1 - belief)\n        belief = (l * belief) / P_e\n    \n    return belief\n\nprint('Convergence from Different Priors')\nprint('=' * 45)\n\nfor n in [5, 20, 50]:\n    print(f'\\nAfter {n} observations:')\n    for prior in [0.1, 0.5, 0.9]:\n        final = run_updates(prior, n)\n        print(f'  Prior {prior} → Final {final:.3f}')",
        solution: "# Priors converge with evidence",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Convergence shown", description: "Belief convergence" }]),
        hints: ["Use same random seed", "Compare different priors", "More data = closer beliefs"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson20_3_1.id,
        number: 3,
        title: "Surprising vs Expected Evidence",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show that surprising evidence causes larger belief updates than expected evidence.",
        starterCode: "def update(prior, likelihood, fp_rate, evidence):\n    if evidence:\n        l, fp = likelihood, fp_rate\n    else:\n        l, fp = 1 - likelihood, 1 - fp_rate\n    P_e = l * prior + fp * (1 - prior)\n    return (l * prior) / P_e\n\nprint('Impact of Surprising vs Expected Evidence')\nprint('=' * 50)\n\n# High belief: positive evidence expected\nbelief_high = 0.9\nnew_high_pos = update(belief_high, 0.9, 0.1, True)\nnew_high_neg = update(belief_high, 0.9, 0.1, False)\n\nprint(f'\\nStarting belief: {belief_high:.0%}')\nprint(f'  After positive (expected): {new_high_pos:.3f} (change: {abs(new_high_pos - belief_high):.3f})')\nprint(f'  After negative (surprise!): {new_high_neg:.3f} (change: {abs(new_high_neg - belief_high):.3f})')\n\n# Low belief: negative evidence expected\nbelief_low = 0.1\nnew_low_pos = update(belief_low, 0.9, 0.1, True)\nnew_low_neg = update(belief_low, 0.9, 0.1, False)\n\nprint(f'\\nStarting belief: {belief_low:.0%}')\nprint(f'  After positive (surprise!): {new_low_pos:.3f} (change: {abs(new_low_pos - belief_low):.3f})')\nprint(f'  After negative (expected): {new_low_neg:.3f} (change: {abs(new_low_neg - belief_low):.3f})')\n\nprint('\\n💡 Surprising evidence causes bigger updates!')",
        solution: "# Surprises move beliefs more",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Surprise effect shown", description: "Surprise vs expected" }]),
        hints: ["Expected evidence = small change", "Surprising evidence = big change", "Compare magnitudes"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson20_3_1.id,
        number: 4,
        title: "Bayesian Updater Class",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a BayesianUpdater class that tracks belief history and can report statistics.",
        starterCode: "class BayesianUpdater:\n    def __init__(self, prior, likelihood, fp_rate):\n        self.belief = prior\n        self.likelihood = likelihood\n        self.fp_rate = fp_rate\n        self.history = [prior]\n        self.evidence_count = {'positive': 0, 'negative': 0}\n    \n    def update(self, evidence):\n        if evidence:\n            l, fp = self.likelihood, self.fp_rate\n            self.evidence_count['positive'] += 1\n        else:\n            l, fp = 1 - self.likelihood, 1 - self.fp_rate\n            self.evidence_count['negative'] += 1\n        \n        P_e = l * self.belief + fp * (1 - self.belief)\n        self.belief = (l * self.belief) / P_e\n        self.history.append(self.belief)\n        return self.belief\n    \n    def summary(self):\n        print(f'Current belief: {self.belief:.3f}')\n        print(f'Evidence seen: {self.evidence_count}')\n        print(f'Total updates: {len(self.history) - 1}')\n        print(f'Belief range: {min(self.history):.3f} - {max(self.history):.3f}')\n\n# Test\nupdater = BayesianUpdater(0.5, 0.85, 0.15)\n\nfor evidence in [True, True, False, True, True, True, False, True]:\n    updater.update(evidence)\n\nupdater.summary()\nprint(f'\\nHistory: {[round(b, 2) for b in updater.history]}')",
        solution: "# Full-featured updater class",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Class works", description: "Updater class" }]),
        hints: ["Store history in list", "Track evidence counts", "Provide summary method"],
        xpReward: 25,
        order: 4,
      },
      {
        lessonId: lesson20_3_1.id,
        number: 5,
        title: "Real-World Updating",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Model a real scenario: updating belief about whether it will rain based on multiple weather indicators.",
        starterCode: "def update(prior, l_true, l_false, evidence):\n    if evidence:\n        l, fp = l_true, l_false\n    else:\n        l, fp = 1 - l_true, 1 - l_false\n    P_e = l * prior + fp * (1 - prior)\n    return (l * prior) / P_e\n\nprint('Weather Prediction: Will It Rain?')\nprint('=' * 50)\n\n# Prior: 30% chance of rain (base rate)\nbelief = 0.30\n\n# Weather indicators with likelihoods\nindicators = [\n    ('Dark clouds', True, 0.85, 0.20),   # (name, observed, P(obs|rain), P(obs|no rain))\n    ('High humidity', True, 0.90, 0.40),\n    ('Barometer falling', True, 0.80, 0.25),\n    ('Wind from west', False, 0.70, 0.35),\n    ('Red sky morning', True, 0.60, 0.15),\n]\n\nprint(f'Prior P(rain): {belief:.0%}')\nprint(f'\\n{\"Indicator\":20} {\"Observed\":>10} {\"New Belief\":>12}')\nprint('-' * 45)\n\nfor name, observed, l_rain, l_no_rain in indicators:\n    belief = update(belief, l_rain, l_no_rain, observed)\n    obs_str = 'Yes' if observed else 'No'\n    print(f'{name:20} {obs_str:>10} {belief:>12.1%}')\n\nprint(f'\\nFinal P(rain) = {belief:.1%}')\nif belief > 0.7:\n    print('Recommendation: Bring an umbrella!')\nelse:\n    print('Recommendation: Probably safe without umbrella.')",
        solution: "# Weather prediction with Bayesian updating",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Weather prediction", description: "Real-world updating" }]),
        hints: ["Each indicator updates belief", "Different likelihoods per indicator", "Final belief guides decision"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 20.3.1`);

  const lesson20_3_2 = await prisma.lesson.upsert({
    where: { slug: "naive-bayes-classifier" },
    update: {},
    create: {
      sectionId: section20_3.id,
      number: 20.32,
      title: "Naive Bayes Classifier",
      slug: "naive-bayes-classifier",
      objectives: [
        "Understand the 'naive' independence assumption",
        "Implement Naive Bayes from scratch",
        "Train on labeled data",
        "Make predictions with probabilities",
      ],
      content: `# Naive Bayes Classifier

## The "Naive" Assumption

Assume all features are **independent** given the class.

\`\`\`
P(features | class) = P(f₁|class) × P(f₂|class) × ... × P(fₙ|class)
\`\`\`

This is rarely true but works surprisingly well!

## The Classification Formula

\`\`\`
P(class | features) ∝ P(class) × ∏ P(fᵢ | class)
\`\`\`

We don't need P(features) - just compare classes!

## Training

For each class, calculate:
1. P(class) - class prior (how common?)
2. P(feature | class) - likelihood for each feature

## Prediction

For a new sample:
1. Calculate score for each class
2. Predict class with highest score

## Why "Naive" Works

- Independence assumption simplifies math
- Errors often cancel out
- Fast to train and predict
- Works well with text (words as features)`,
      codeExamples: JSON.stringify([
        {
          id: "naive-bayes-simple",
          title: "Simple Naive Bayes",
          code: "# Simple Naive Bayes for binary features\n\ndef train_naive_bayes(data):\n    \"\"\"Train on data: [(features_dict, label), ...]\"\"\"\n    # Count classes\n    class_counts = {}\n    feature_counts = {}  # {(feature, value, class): count}\n    \n    for features, label in data:\n        class_counts[label] = class_counts.get(label, 0) + 1\n        \n        for feature, value in features.items():\n            key = (feature, value, label)\n            feature_counts[key] = feature_counts.get(key, 0) + 1\n    \n    total = len(data)\n    \n    # Calculate probabilities\n    class_probs = {c: count/total for c, count in class_counts.items()}\n    \n    # P(feature=value | class) with Laplace smoothing\n    feature_probs = {}\n    for (feature, value, label), count in feature_counts.items():\n        feature_probs[(feature, value, label)] = (count + 1) / (class_counts[label] + 2)\n    \n    return class_probs, feature_probs, class_counts\n\n# Training data: weather affects play tennis?\ndata = [\n    ({'outlook': 'sunny', 'wind': 'weak'}, 'yes'),\n    ({'outlook': 'sunny', 'wind': 'strong'}, 'no'),\n    ({'outlook': 'cloudy', 'wind': 'weak'}, 'yes'),\n    ({'outlook': 'rainy', 'wind': 'weak'}, 'yes'),\n    ({'outlook': 'rainy', 'wind': 'strong'}, 'no'),\n    ({'outlook': 'cloudy', 'wind': 'strong'}, 'yes'),\n]\n\nclass_probs, feature_probs, class_counts = train_naive_bayes(data)\n\nprint('Naive Bayes Training')\nprint('=' * 40)\nprint(f'Class priors: {class_probs}')\nprint(f'\\nSample feature probabilities:')\nfor key, prob in list(feature_probs.items())[:4]:\n    print(f'  P({key[0]}={key[1]} | {key[2]}) = {prob:.3f}')",
          description: "Train simple Naive Bayes",
        },
        {
          id: "naive-bayes-predict",
          title: "Prediction with Naive Bayes",
          code: "def predict_naive_bayes(features, class_probs, feature_probs, classes):\n    \"\"\"Predict class for new features\"\"\"\n    scores = {}\n    \n    for c in classes:\n        # Start with log prior\n        score = class_probs[c]\n        \n        # Multiply by feature likelihoods\n        for feature, value in features.items():\n            key = (feature, value, c)\n            if key in feature_probs:\n                score *= feature_probs[key]\n            else:\n                score *= 0.5  # Default for unseen\n        \n        scores[c] = score\n    \n    # Normalize\n    total = sum(scores.values())\n    probs = {c: s/total for c, s in scores.items()}\n    \n    prediction = max(probs, key=probs.get)\n    return prediction, probs\n\n# Use trained model from previous example\nclass_probs = {'yes': 4/6, 'no': 2/6}\nfeature_probs = {\n    ('outlook', 'sunny', 'yes'): 1/4, ('outlook', 'sunny', 'no'): 2/2,\n    ('outlook', 'cloudy', 'yes'): 2/4, ('outlook', 'cloudy', 'no'): 1/2,\n    ('outlook', 'rainy', 'yes'): 1/4, ('outlook', 'rainy', 'no'): 1/2,\n    ('wind', 'weak', 'yes'): 3/4, ('wind', 'weak', 'no'): 1/2,\n    ('wind', 'strong', 'yes'): 1/4, ('wind', 'strong', 'no'): 2/2,\n}\n\nprint('Naive Bayes Prediction')\nprint('=' * 40)\n\n# New day\nnew_day = {'outlook': 'sunny', 'wind': 'weak'}\npred, probs = predict_naive_bayes(new_day, class_probs, feature_probs, ['yes', 'no'])\n\nprint(f'New day: {new_day}')\nprint(f'\\nClass probabilities:')\nfor c, p in probs.items():\n    print(f'  P(play={c}) = {p:.3f}')\nprint(f'\\nPrediction: play = {pred}')",
          description: "Make predictions",
        },
        {
          id: "naive-bayes-class",
          title: "Complete Naive Bayes Class",
          code: "class NaiveBayes:\n    def __init__(self):\n        self.class_probs = {}\n        self.feature_probs = {}\n        self.classes = set()\n    \n    def fit(self, X, y):\n        \"\"\"Train on feature dicts X and labels y\"\"\"\n        n = len(y)\n        class_counts = {}\n        feature_counts = {}\n        \n        for features, label in zip(X, y):\n            self.classes.add(label)\n            class_counts[label] = class_counts.get(label, 0) + 1\n            \n            for feat, val in features.items():\n                key = (feat, val, label)\n                feature_counts[key] = feature_counts.get(key, 0) + 1\n        \n        self.class_probs = {c: cnt/n for c, cnt in class_counts.items()}\n        \n        for key, count in feature_counts.items():\n            feat, val, label = key\n            self.feature_probs[key] = (count + 1) / (class_counts[label] + 2)\n    \n    def predict(self, features):\n        \"\"\"Return predicted class and probabilities\"\"\"\n        scores = {}\n        for c in self.classes:\n            score = self.class_probs[c]\n            for feat, val in features.items():\n                key = (feat, val, c)\n                score *= self.feature_probs.get(key, 0.5)\n            scores[c] = score\n        \n        total = sum(scores.values())\n        probs = {c: s/total for c, s in scores.items()}\n        return max(probs, key=probs.get), probs\n\n# Test\nX = [\n    {'size': 'small', 'color': 'red'},\n    {'size': 'small', 'color': 'red'},\n    {'size': 'large', 'color': 'red'},\n    {'size': 'large', 'color': 'blue'},\n    {'size': 'large', 'color': 'blue'},\n]\ny = ['apple', 'apple', 'apple', 'not_apple', 'not_apple']\n\nclf = NaiveBayes()\nclf.fit(X, y)\n\ntest = {'size': 'small', 'color': 'red'}\npred, probs = clf.predict(test)\nprint(f'Test: {test}')\nprint(f'Prediction: {pred}')\nprint(f'Probabilities: {probs}')",
          description: "Complete reusable classifier",
        },
      ]),
      keyPoints: [
        "Assume features are independent given class",
        "P(class|features) ∝ P(class) × ∏P(feature|class)",
        "Train: count occurrences in training data",
        "Predict: multiply probabilities, pick highest",
        "Use Laplace smoothing for unseen features",
        "Works well despite naive assumption",
      ],
      hardwareDemo: "Watch probability multiplications. See class scores computed.",
      estimatedTime: 35,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson20_3_2.number}: ${lesson20_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson20_3_2.id,
        number: 1,
        title: "Calculate Class Priors",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Given labeled data, calculate P(class) for each class.",
        starterCode: "# Training labels\nlabels = ['spam', 'ham', 'spam', 'ham', 'ham', 'spam', 'ham', 'ham', 'spam', 'ham']\n\n# Count each class\nclass_counts = {}\nfor label in labels:\n    class_counts[label] = class_counts.get(label, 0) + 1\n\n# Calculate priors\ntotal = len(labels)\nclass_priors = {c: count/total for c, count in class_counts.items()}\n\nprint('Class Priors')\nprint('=' * 30)\nfor c, prior in class_priors.items():\n    print(f'P({c}) = {class_counts[c]}/{total} = {prior:.2f}')",
        solution: "# Class priors from counts",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Priors calculated", description: "Class priors" }]),
        hints: ["Count each class", "Divide by total", "Should sum to 1"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson20_3_2.id,
        number: 2,
        title: "Feature Likelihoods",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate P(feature|class) for each feature-class combination.",
        starterCode: "# Data: (features, label)\ndata = [\n    ({'color': 'red', 'size': 'small'}, 'apple'),\n    ({'color': 'red', 'size': 'large'}, 'apple'),\n    ({'color': 'yellow', 'size': 'small'}, 'banana'),\n    ({'color': 'yellow', 'size': 'large'}, 'banana'),\n    ({'color': 'red', 'size': 'small'}, 'apple'),\n]\n\n# Count features per class\nclass_counts = {}\nfeature_counts = {}\n\nfor features, label in data:\n    class_counts[label] = class_counts.get(label, 0) + 1\n    for feat, val in features.items():\n        key = (feat, val, label)\n        feature_counts[key] = feature_counts.get(key, 0) + 1\n\nprint('Feature Likelihoods P(feature|class)')\nprint('=' * 45)\nfor (feat, val, label), count in sorted(feature_counts.items()):\n    prob = count / class_counts[label]\n    print(f'P({feat}={val} | {label}) = {count}/{class_counts[label]} = {prob:.2f}')",
        solution: "# Feature likelihoods calculated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Likelihoods shown", description: "Feature likelihoods" }]),
        hints: ["Count (feature, class) pairs", "Divide by class count", "One probability per combination"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson20_3_2.id,
        number: 3,
        title: "Naive Bayes Prediction",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given trained probabilities, predict class for a new sample.",
        starterCode: "# Trained model\nclass_priors = {'A': 0.6, 'B': 0.4}\nfeature_probs = {\n    ('x', 1, 'A'): 0.7, ('x', 1, 'B'): 0.2,\n    ('x', 0, 'A'): 0.3, ('x', 0, 'B'): 0.8,\n    ('y', 1, 'A'): 0.4, ('y', 1, 'B'): 0.9,\n    ('y', 0, 'A'): 0.6, ('y', 0, 'B'): 0.1,\n}\n\n# New sample to classify\nnew_sample = {'x': 1, 'y': 0}\n\n# Calculate score for each class\nscores = {}\nfor c in ['A', 'B']:\n    score = class_priors[c]\n    for feat, val in new_sample.items():\n        score *= feature_probs[(feat, val, c)]\n    scores[c] = score\n\n# Normalize to probabilities\ntotal = sum(scores.values())\nprobs = {c: s/total for c, s in scores.items()}\n\nprint('Naive Bayes Prediction')\nprint('=' * 35)\nprint(f'Sample: {new_sample}')\nprint(f'\\nRaw scores: {scores}')\nprint(f'Probabilities: {probs}')\nprint(f'\\nPrediction: {max(probs, key=probs.get)}')",
        solution: "# Prediction using Naive Bayes",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Prediction made", description: "NB prediction" }]),
        hints: ["Multiply prior by likelihoods", "Do for each class", "Normalize and pick max"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson20_3_2.id,
        number: 4,
        title: "Laplace Smoothing",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement Laplace smoothing to handle unseen feature values.",
        starterCode: "def calculate_likelihood_smoothed(count, class_count, num_values, alpha=1):\n    \"\"\"Laplace smoothed probability\"\"\"\n    return (count + alpha) / (class_count + alpha * num_values)\n\n# Example: word counts in spam classification\nword_counts_spam = {'free': 10, 'money': 8, 'click': 5}\nword_counts_ham = {'meeting': 15, 'project': 12, 'free': 2}\n\ntotal_spam = 50  # Total words in spam\ntotal_ham = 100  # Total words in ham\nvocab_size = 6  # Unique words\n\nprint('Laplace Smoothing for Unseen Words')\nprint('=' * 50)\n\n# Without smoothing: P(\"meeting\" | spam) = 0 (never seen!)\nprint('Without smoothing:')\nprint(f'  P(\"meeting\" | spam) = 0/{total_spam} = 0.00 ← Problem!')\n\n# With smoothing\nprint('\\nWith Laplace smoothing (alpha=1):')\nfor word in ['free', 'money', 'meeting']:\n    count_spam = word_counts_spam.get(word, 0)\n    count_ham = word_counts_ham.get(word, 0)\n    \n    p_spam = calculate_likelihood_smoothed(count_spam, total_spam, vocab_size)\n    p_ham = calculate_likelihood_smoothed(count_ham, total_ham, vocab_size)\n    \n    print(f'  P(\"{word}\" | spam) = ({count_spam}+1)/({total_spam}+6) = {p_spam:.3f}')\n    print(f'  P(\"{word}\" | ham)  = ({count_ham}+1)/({total_ham}+6) = {p_ham:.3f}')\n\nprint('\\n💡 Smoothing prevents zero probabilities!')",
        solution: "# Laplace smoothing prevents zeros",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Smoothing demonstrated", description: "Laplace smoothing" }]),
        hints: ["Add alpha to numerator", "Add alpha*V to denominator", "Prevents zero probabilities"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson20_3_2.id,
        number: 5,
        title: "Complete Naive Bayes Classifier",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Build a complete NaiveBayes class with fit() and predict() methods.",
        starterCode: "class NaiveBayes:\n    def __init__(self, alpha=1):\n        self.alpha = alpha\n        self.class_priors = {}\n        self.feature_probs = {}\n        self.classes = []\n        self.features = set()\n    \n    def fit(self, X, y):\n        n = len(y)\n        class_counts = {}\n        feature_counts = {}\n        \n        for features, label in zip(X, y):\n            class_counts[label] = class_counts.get(label, 0) + 1\n            for feat, val in features.items():\n                self.features.add(feat)\n                key = (feat, val, label)\n                feature_counts[key] = feature_counts.get(key, 0) + 1\n        \n        self.classes = list(class_counts.keys())\n        self.class_priors = {c: cnt/n for c, cnt in class_counts.items()}\n        \n        for key, count in feature_counts.items():\n            feat, val, label = key\n            self.feature_probs[key] = (count + self.alpha) / (class_counts[label] + 2*self.alpha)\n    \n    def predict(self, features):\n        best_class = None\n        best_score = -1\n        \n        for c in self.classes:\n            score = self.class_priors[c]\n            for feat, val in features.items():\n                key = (feat, val, c)\n                score *= self.feature_probs.get(key, self.alpha / (self.alpha * 2))\n            \n            if score > best_score:\n                best_score = score\n                best_class = c\n        \n        return best_class\n\n# Test\nX = [\n    {'weather': 'sunny', 'temp': 'hot'},\n    {'weather': 'sunny', 'temp': 'mild'},\n    {'weather': 'rainy', 'temp': 'mild'},\n    {'weather': 'rainy', 'temp': 'cold'},\n]\ny = ['no', 'yes', 'yes', 'no']\n\nclf = NaiveBayes()\nclf.fit(X, y)\n\ntest_cases = [\n    {'weather': 'sunny', 'temp': 'hot'},\n    {'weather': 'rainy', 'temp': 'mild'},\n]\n\nprint('Naive Bayes Classifier Test')\nprint('=' * 40)\nfor test in test_cases:\n    pred = clf.predict(test)\n    print(f'{test} → {pred}')",
        solution: "# Complete NaiveBayes class",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Classifier works", description: "Complete NB" }]),
        hints: ["fit() learns probabilities", "predict() multiplies and picks max", "Handle unseen with smoothing"],
        xpReward: 30,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 20.3.2`);

  const lesson20_3_3 = await prisma.lesson.upsert({
    where: { slug: "implementing-spam-filter" },
    update: {},
    create: {
      sectionId: section20_3.id,
      number: 20.33,
      title: "Implementing a Spam Filter",
      slug: "implementing-spam-filter",
      objectives: [
        "Apply Naive Bayes to text classification",
        "Build a working spam filter",
        "Handle word tokenization",
        "Evaluate filter performance",
      ],
      content: `# Building a Spam Filter

## Text as Features

Convert email text to word features:
1. Tokenize into words
2. Convert to lowercase
3. Count word occurrences

## The Spam Filter

For each email, calculate:
\`\`\`
P(spam | words) ∝ P(spam) × ∏ P(word | spam)
P(ham | words) ∝ P(ham) × ∏ P(word | ham)
\`\`\`

Classify as spam if P(spam | words) > P(ham | words)

## Training Process

1. Collect labeled emails (spam/ham)
2. Tokenize each email
3. Count words per class
4. Calculate P(word | class) with smoothing

## Handling Unknown Words

Use Laplace smoothing:
\`\`\`
P(word | class) = (count + 1) / (total_words + vocab_size)
\`\`\`

## Practical Considerations

- Use log probabilities to avoid underflow
- Handle very long emails
- Consider word importance (TF-IDF)`,
      codeExamples: JSON.stringify([
        {
          id: "spam-filter-basic",
          title: "Basic Spam Filter",
          code: "class SpamFilter:\n    def __init__(self):\n        self.spam_words = {}\n        self.ham_words = {}\n        self.spam_total = 0\n        self.ham_total = 0\n        self.spam_count = 0\n        self.ham_count = 0\n        self.vocab = set()\n    \n    def tokenize(self, text):\n        return text.lower().split()\n    \n    def train(self, emails):\n        for text, label in emails:\n            words = self.tokenize(text)\n            self.vocab.update(words)\n            \n            if label == 'spam':\n                self.spam_count += 1\n                self.spam_total += len(words)\n                for word in words:\n                    self.spam_words[word] = self.spam_words.get(word, 0) + 1\n            else:\n                self.ham_count += 1\n                self.ham_total += len(words)\n                for word in words:\n                    self.ham_words[word] = self.ham_words.get(word, 0) + 1\n    \n    def word_prob(self, word, is_spam):\n        vocab_size = len(self.vocab)\n        if is_spam:\n            count = self.spam_words.get(word, 0)\n            return (count + 1) / (self.spam_total + vocab_size)\n        else:\n            count = self.ham_words.get(word, 0)\n            return (count + 1) / (self.ham_total + vocab_size)\n    \n    def classify(self, text):\n        words = self.tokenize(text)\n        total = self.spam_count + self.ham_count\n        \n        spam_score = self.spam_count / total\n        ham_score = self.ham_count / total\n        \n        for word in words:\n            spam_score *= self.word_prob(word, True)\n            ham_score *= self.word_prob(word, False)\n        \n        return 'spam' if spam_score > ham_score else 'ham', spam_score, ham_score\n\n# Training data\nemails = [\n    ('free money click here', 'spam'),\n    ('meeting tomorrow at noon', 'ham'),\n    ('win free prize now', 'spam'),\n    ('project deadline friday', 'ham'),\n    ('free gift card winner', 'spam'),\n    ('lunch plans for today', 'ham'),\n]\n\nfilter = SpamFilter()\nfilter.train(emails)\n\nprint('Spam Filter Test')\nprint('=' * 50)\n\ntest_emails = [\n    'free money winner',\n    'meeting about project',\n    'click here for free prize',\n]\n\nfor email in test_emails:\n    pred, spam_s, ham_s in filter.classify(email)\n    print(f'\\n\"{email}\"')\n    print(f'  → {pred.upper()}')",
          description: "Working spam filter",
        },
        {
          id: "spam-log-prob",
          title: "Log Probabilities for Stability",
          code: "import math\n\nclass SpamFilterLog:\n    \"\"\"Spam filter using log probabilities\"\"\"\n    def __init__(self):\n        self.spam_words = {}\n        self.ham_words = {}\n        self.spam_total = 0\n        self.ham_total = 0\n        self.spam_count = 0\n        self.ham_count = 0\n        self.vocab = set()\n    \n    def tokenize(self, text):\n        return text.lower().split()\n    \n    def train(self, emails):\n        for text, label in emails:\n            words = self.tokenize(text)\n            self.vocab.update(words)\n            if label == 'spam':\n                self.spam_count += 1\n                self.spam_total += len(words)\n                for w in words:\n                    self.spam_words[w] = self.spam_words.get(w, 0) + 1\n            else:\n                self.ham_count += 1\n                self.ham_total += len(words)\n                for w in words:\n                    self.ham_words[w] = self.ham_words.get(w, 0) + 1\n    \n    def classify(self, text):\n        words = self.tokenize(text)\n        v = len(self.vocab)\n        total = self.spam_count + self.ham_count\n        \n        # Use LOG probabilities\n        log_spam = math.log(self.spam_count / total)\n        log_ham = math.log(self.ham_count / total)\n        \n        for word in words:\n            spam_prob = (self.spam_words.get(word, 0) + 1) / (self.spam_total + v)\n            ham_prob = (self.ham_words.get(word, 0) + 1) / (self.ham_total + v)\n            log_spam += math.log(spam_prob)\n            log_ham += math.log(ham_prob)\n        \n        return 'spam' if log_spam > log_ham else 'ham'\n\n# Demo\nemails = [\n    ('free money now', 'spam'),\n    ('meeting tomorrow', 'ham'),\n    ('win big prize', 'spam'),\n    ('project update', 'ham'),\n]\n\nfilter = SpamFilterLog()\nfilter.train(emails)\n\nprint('Log-Probability Spam Filter')\nprint('=' * 40)\nprint('Using log prevents underflow with many words!')\nprint(f'\\n\"free prize winner\" → {filter.classify(\"free prize winner\")}')\nprint(f'\"project meeting\" → {filter.classify(\"project meeting\")}')",
          description: "Use log probs for numerical stability",
        },
        {
          id: "spam-evaluation",
          title: "Evaluate Spam Filter",
          code: "def evaluate_filter(filter, test_data):\n    \"\"\"Calculate accuracy, precision, recall\"\"\"\n    tp = fp = tn = fn = 0\n    \n    for text, true_label in test_data:\n        pred = filter.classify(text)\n        if isinstance(pred, tuple):\n            pred = pred[0]\n        \n        if pred == 'spam' and true_label == 'spam':\n            tp += 1\n        elif pred == 'spam' and true_label == 'ham':\n            fp += 1\n        elif pred == 'ham' and true_label == 'ham':\n            tn += 1\n        else:\n            fn += 1\n    \n    accuracy = (tp + tn) / (tp + tn + fp + fn)\n    precision = tp / (tp + fp) if (tp + fp) > 0 else 0\n    recall = tp / (tp + fn) if (tp + fn) > 0 else 0\n    \n    return {\n        'accuracy': accuracy,\n        'precision': precision,\n        'recall': recall,\n        'confusion': {'TP': tp, 'FP': fp, 'TN': tn, 'FN': fn}\n    }\n\n# Create and train filter\nclass SimpleFilter:\n    def __init__(self):\n        self.spam_words = set()\n    \n    def train(self, data):\n        for text, label in data:\n            if label == 'spam':\n                self.spam_words.update(text.lower().split())\n    \n    def classify(self, text):\n        words = set(text.lower().split())\n        spam_score = len(words & self.spam_words)\n        return 'spam' if spam_score >= 2 else 'ham'\n\ntrain_data = [\n    ('free money now', 'spam'),\n    ('win prize click', 'spam'),\n    ('meeting tomorrow', 'ham'),\n    ('project deadline', 'ham'),\n]\n\ntest_data = [\n    ('free prize winner', 'spam'),\n    ('click here now', 'spam'),\n    ('tomorrow meeting', 'ham'),\n    ('deadline project', 'ham'),\n]\n\nf = SimpleFilter()\nf.train(train_data)\nresults = evaluate_filter(f, test_data)\n\nprint('Spam Filter Evaluation')\nprint('=' * 40)\nprint(f'Accuracy: {results[\"accuracy\"]:.1%}')\nprint(f'Precision: {results[\"precision\"]:.1%}')\nprint(f'Recall: {results[\"recall\"]:.1%}')\nprint(f'\\nConfusion Matrix: {results[\"confusion\"]}')",
          description: "Evaluate filter performance",
        },
      ]),
      keyPoints: [
        "Tokenize text into words",
        "Count word frequencies per class",
        "Use Laplace smoothing for unknown words",
        "Log probabilities prevent underflow",
        "Evaluate with precision and recall",
        "Simple but effective for text classification",
      ],
      hardwareDemo: "Watch word counting. See probability calculations for each word.",
      estimatedTime: 40,
      difficulty: "ADVANCED",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson20_3_3.number}: ${lesson20_3_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson20_3_3.id,
        number: 1,
        title: "Tokenize Emails",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Implement a tokenizer that splits email text into lowercase words.",
        starterCode: "def tokenize(text):\n    \"\"\"Convert text to list of lowercase words\"\"\"\n    # Remove punctuation and split\n    words = text.lower().replace('.', '').replace('!', '').replace(',', '').split()\n    return words\n\nemails = [\n    'FREE MONEY! Click here NOW!',\n    'Meeting tomorrow at 3pm.',\n    'Win a FREE prize, click to claim!',\n]\n\nprint('Email Tokenization')\nprint('=' * 45)\nfor email in emails:\n    tokens = tokenize(email)\n    print(f'\\nOriginal: \"{email}\"')\n    print(f'Tokens: {tokens}')",
        solution: "# Tokenize to lowercase words",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Tokens shown", description: "Tokenization" }]),
        hints: ["Convert to lowercase", "Remove punctuation", "Split on whitespace"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson20_3_3.id,
        number: 2,
        title: "Count Word Frequencies",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Count word frequencies separately for spam and ham emails.",
        starterCode: "def tokenize(text):\n    return text.lower().split()\n\nemails = [\n    ('free money click now', 'spam'),\n    ('meeting project deadline', 'ham'),\n    ('win free prize', 'spam'),\n    ('lunch tomorrow noon', 'ham'),\n    ('click here free gift', 'spam'),\n]\n\nspam_words = {}\nham_words = {}\n\nfor text, label in emails:\n    words = tokenize(text)\n    target = spam_words if label == 'spam' else ham_words\n    for word in words:\n        target[word] = target.get(word, 0) + 1\n\nprint('Word Frequencies')\nprint('=' * 40)\nprint('\\nSpam words:')\nfor word, count in sorted(spam_words.items(), key=lambda x: -x[1]):\n    print(f'  {word}: {count}')\n\nprint('\\nHam words:')\nfor word, count in sorted(ham_words.items(), key=lambda x: -x[1]):\n    print(f'  {word}: {count}')",
        solution: "# Word frequencies per class",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Frequencies counted", description: "Word frequencies" }]),
        hints: ["Separate dictionaries per class", "Count occurrences", "Notice 'free' is spammy"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson20_3_3.id,
        number: 3,
        title: "Calculate Spam Probability",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given word counts, calculate P(spam|email) for a new email.",
        starterCode: "# Pre-computed from training\nspam_word_counts = {'free': 3, 'money': 2, 'click': 2, 'win': 1, 'prize': 1}\nham_word_counts = {'meeting': 2, 'project': 2, 'deadline': 1, 'lunch': 1}\nspam_total = 9\nham_total = 6\nspam_emails = 3\nham_emails = 2\nvocab_size = 9\n\ndef word_prob(word, is_spam):\n    if is_spam:\n        count = spam_word_counts.get(word, 0)\n        return (count + 1) / (spam_total + vocab_size)\n    else:\n        count = ham_word_counts.get(word, 0)\n        return (count + 1) / (ham_total + vocab_size)\n\n# Classify new email\nemail = 'free money prize'\nwords = email.lower().split()\n\n# Prior\nP_spam = spam_emails / (spam_emails + ham_emails)\nP_ham = ham_emails / (spam_emails + ham_emails)\n\n# Likelihood\nspam_score = P_spam\nham_score = P_ham\n\nfor word in words:\n    spam_score *= word_prob(word, True)\n    ham_score *= word_prob(word, False)\n\n# Normalize\ntotal = spam_score + ham_score\nP_spam_given_email = spam_score / total\n\nprint('Spam Classification')\nprint('=' * 40)\nprint(f'Email: \"{email}\"')\nprint(f'\\nP(spam | email) = {P_spam_given_email:.3f}')\nprint(f'P(ham | email) = {1 - P_spam_given_email:.3f}')\nprint(f'\\nClassification: {\"SPAM\" if P_spam_given_email > 0.5 else \"HAM\"}')",
        solution: "# Calculate spam probability",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Spam probability", description: "Spam calculation" }]),
        hints: ["Calculate P(word|spam) for each word", "Multiply together", "Compare spam vs ham score"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson20_3_3.id,
        number: 4,
        title: "Build Complete Spam Filter",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a complete SpamFilter class with train() and classify() methods.",
        starterCode: "class SpamFilter:\n    def __init__(self):\n        self.spam_words = {}\n        self.ham_words = {}\n        self.spam_total = 0\n        self.ham_total = 0\n        self.spam_count = 0\n        self.ham_count = 0\n        self.vocab = set()\n    \n    def train(self, emails):\n        for text, label in emails:\n            words = text.lower().split()\n            self.vocab.update(words)\n            \n            if label == 'spam':\n                self.spam_count += 1\n                self.spam_total += len(words)\n                for w in words:\n                    self.spam_words[w] = self.spam_words.get(w, 0) + 1\n            else:\n                self.ham_count += 1\n                self.ham_total += len(words)\n                for w in words:\n                    self.ham_words[w] = self.ham_words.get(w, 0) + 1\n    \n    def classify(self, text):\n        words = text.lower().split()\n        v = len(self.vocab)\n        total = self.spam_count + self.ham_count\n        \n        spam_score = self.spam_count / total\n        ham_score = self.ham_count / total\n        \n        for word in words:\n            spam_prob = (self.spam_words.get(word, 0) + 1) / (self.spam_total + v)\n            ham_prob = (self.ham_words.get(word, 0) + 1) / (self.ham_total + v)\n            spam_score *= spam_prob\n            ham_score *= ham_prob\n        \n        return 'spam' if spam_score > ham_score else 'ham'\n\n# Test\ntrain_data = [\n    ('free money now', 'spam'),\n    ('win prize click', 'spam'),\n    ('meeting tomorrow', 'ham'),\n    ('project update', 'ham'),\n    ('free gift winner', 'spam'),\n    ('lunch plans today', 'ham'),\n]\n\nfilter = SpamFilter()\nfilter.train(train_data)\n\nprint('Spam Filter')\nprint('=' * 40)\ntest_emails = ['free prize', 'meeting project', 'click free money']\nfor email in test_emails:\n    result = filter.classify(email)\n    print(f'\"{email}\" → {result.upper()}')",
        solution: "# Complete spam filter",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Filter classifies", description: "Complete filter" }]),
        hints: ["train() counts words", "classify() multiplies probs", "Use Laplace smoothing"],
        xpReward: 25,
        order: 4,
      },
      {
        lessonId: lesson20_3_3.id,
        number: 5,
        title: "Evaluate Your Spam Filter",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Train a spam filter and evaluate it with accuracy, precision, and recall.",
        starterCode: "class SpamFilter:\n    def __init__(self):\n        self.spam_words = {}\n        self.ham_words = {}\n        self.spam_total = 0\n        self.ham_total = 0\n        self.spam_count = 0\n        self.ham_count = 0\n        self.vocab = set()\n    \n    def train(self, emails):\n        for text, label in emails:\n            words = text.lower().split()\n            self.vocab.update(words)\n            if label == 'spam':\n                self.spam_count += 1\n                self.spam_total += len(words)\n                for w in words:\n                    self.spam_words[w] = self.spam_words.get(w, 0) + 1\n            else:\n                self.ham_count += 1\n                self.ham_total += len(words)\n                for w in words:\n                    self.ham_words[w] = self.ham_words.get(w, 0) + 1\n    \n    def classify(self, text):\n        words = text.lower().split()\n        v = len(self.vocab) + 1\n        total = self.spam_count + self.ham_count\n        spam_score = self.spam_count / total\n        ham_score = self.ham_count / total\n        for word in words:\n            spam_score *= (self.spam_words.get(word, 0) + 1) / (self.spam_total + v)\n            ham_score *= (self.ham_words.get(word, 0) + 1) / (self.ham_total + v)\n        return 'spam' if spam_score > ham_score else 'ham'\n\n# Training data\ntrain = [\n    ('free money now', 'spam'), ('win big prize', 'spam'),\n    ('click here offer', 'spam'), ('free gift card', 'spam'),\n    ('meeting tomorrow', 'ham'), ('project deadline', 'ham'),\n    ('lunch at noon', 'ham'), ('schedule update', 'ham'),\n]\n\n# Test data\ntest = [\n    ('free prize winner', 'spam'), ('money click now', 'spam'),\n    ('meeting schedule', 'ham'), ('project lunch', 'ham'),\n]\n\nfilter = SpamFilter()\nfilter.train(train)\n\n# Evaluate\ntp = fp = tn = fn = 0\nfor text, true in test:\n    pred = filter.classify(text)\n    if pred == 'spam' and true == 'spam': tp += 1\n    elif pred == 'spam' and true == 'ham': fp += 1\n    elif pred == 'ham' and true == 'ham': tn += 1\n    else: fn += 1\n\nprint('Spam Filter Evaluation')\nprint('=' * 40)\nprint(f'Accuracy: {(tp+tn)/(tp+tn+fp+fn):.1%}')\nprint(f'Precision: {tp/(tp+fp) if tp+fp else 0:.1%}')\nprint(f'Recall: {tp/(tp+fn) if tp+fn else 0:.1%}')\nprint(f'\\nConfusion Matrix:')\nprint(f'  TP={tp}, FP={fp}')\nprint(f'  FN={fn}, TN={tn}')",
        solution: "# Evaluate spam filter performance",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Evaluation metrics", description: "Filter evaluation" }]),
        hints: ["Track TP, FP, TN, FN", "Calculate accuracy", "Precision and recall important"],
        xpReward: 30,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 20.3.3`);

  console.log("\n✅ Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
