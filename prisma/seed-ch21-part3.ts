import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 3: Lesson 21.3.1 (Critical Evaluation)...\n");

  const section21_3 = await prisma.section.findFirst({ where: { number: 21.3 } });
  if (!section21_3) throw new Error("Section 21.3 not found. Run part 1 first.");

  const lesson21_3_1 = await prisma.lesson.upsert({
    where: { slug: "critical-evaluation-statistical-claims" },
    update: {},
    create: {
      sectionId: section21_3.id,
      number: 21.31,
      title: "Critical Evaluation of Statistical Claims",
      slug: "critical-evaluation-statistical-claims",
      objectives: [
        "Apply a systematic checklist to evaluate claims",
        "Ask the right questions about statistics",
        "Recognize common manipulation patterns",
        "Become a critical consumer of data",
      ],
      content: `# Critical Evaluation of Statistical Claims

## The Checklist

When you encounter a statistical claim, ask:

### 1. Source
- Who is making this claim?
- Do they have an agenda?
- Is the source reputable?

### 2. Sample
- How big is the sample?
- How was it selected?
- Who is missing?

### 3. Methodology
- Was it observational or experimental?
- Could there be confounders?
- Was it pre-registered?

### 4. Analysis
- Is the y-axis truncated?
- What time period was chosen?
- Are subgroups hidden?

### 5. Interpretation
- Correlation or causation?
- Relative or absolute numbers?
- What's the base rate?

## Red Flags

- "Studies show..." (which studies?)
- Suspiciously round numbers
- Missing sample sizes
- No comparison group
- Testimonials instead of data

## Good Signs

- Confidence intervals reported
- Methodology explained
- Limitations acknowledged
- Data available for review`,
      codeExamples: JSON.stringify([
        {
          id: "checklist",
          title: "Statistical Claim Checklist",
          code: "def evaluate_claim(claim_info):\n    \"\"\"Evaluate a statistical claim systematically\"\"\"\n    score = 0\n    issues = []\n    \n    print(f'Claim: \"{claim_info[\"claim\"]}\"')\n    print('-' * 50)\n    \n    # Source check\n    if claim_info.get('source_reputable'):\n        score += 1\n        print('✓ Source: Reputable')\n    else:\n        issues.append('Source may have bias or unknown')\n        print('⚠ Source: Check for bias')\n    \n    # Sample check\n    n = claim_info.get('sample_size', 0)\n    if n >= 1000:\n        score += 1\n        print(f'✓ Sample: Large (n={n})')\n    elif n >= 100:\n        score += 0.5\n        print(f'~ Sample: Moderate (n={n})')\n    else:\n        issues.append(f'Sample size too small (n={n})')\n        print(f'⚠ Sample: Small (n={n})')\n    \n    # Methodology check\n    if claim_info.get('randomized'):\n        score += 1\n        print('✓ Method: Randomized experiment')\n    else:\n        issues.append('Observational study - correlation only')\n        print('⚠ Method: Observational (no causation)')\n    \n    # Analysis check\n    if claim_info.get('peer_reviewed'):\n        score += 1\n        print('✓ Analysis: Peer reviewed')\n    else:\n        issues.append('Not peer reviewed')\n        print('⚠ Analysis: Not peer reviewed')\n    \n    print(f'\\nScore: {score}/4')\n    if issues:\n        print(f'Issues: {issues}')\n    \n    return score, issues\n\n# Example claims\nclaim1 = {\n    'claim': 'Our product is 50% more effective',\n    'source_reputable': False,\n    'sample_size': 20,\n    'randomized': False,\n    'peer_reviewed': False\n}\n\nclaim2 = {\n    'claim': 'Vaccine reduces infection by 90%',\n    'source_reputable': True,\n    'sample_size': 30000,\n    'randomized': True,\n    'peer_reviewed': True\n}\n\nprint('EVALUATING STATISTICAL CLAIMS')\nprint('=' * 55)\nprint()\nevaluate_claim(claim1)\nprint()\nevaluate_claim(claim2)",
          description: "Systematic claim evaluation",
        },
        {
          id: "red-flags",
          title: "Spotting Red Flags",
          code: "def check_red_flags(claim_text, details):\n    \"\"\"Check for common red flags in statistical claims\"\"\"\n    flags = []\n    \n    # Vague source\n    vague_sources = ['studies show', 'research proves', 'scientists say', 'experts agree']\n    for vs in vague_sources:\n        if vs in claim_text.lower():\n            flags.append(f'Vague source: \"{vs}\"')\n    \n    # Missing sample size\n    if details.get('sample_size') is None:\n        flags.append('No sample size mentioned')\n    \n    # Round numbers\n    numbers = [int(s) for s in claim_text.split() if s.isdigit()]\n    for n in numbers:\n        if n > 10 and n % 10 == 0:\n            flags.append(f'Suspiciously round number: {n}')\n    \n    # Relative without absolute\n    if any(word in claim_text.lower() for word in ['times more', '% more', '% less', 'x more']):\n        if 'absolute' not in details:\n            flags.append('Relative numbers without absolute context')\n    \n    # No comparison\n    if not details.get('comparison_group'):\n        flags.append('No clear comparison group')\n    \n    return flags\n\nclaims = [\n    {\n        'text': 'Studies show our supplement is 300% more effective',\n        'details': {'sample_size': None, 'comparison_group': False}\n    },\n    {\n        'text': '9 out of 10 dentists recommend our toothpaste',\n        'details': {'sample_size': 10, 'comparison_group': False}\n    },\n    {\n        'text': 'Treatment reduced mortality from 2% to 1% in 5000-patient trial',\n        'details': {'sample_size': 5000, 'comparison_group': True, 'absolute': True}\n    },\n]\n\nprint('RED FLAG DETECTOR')\nprint('=' * 55)\n\nfor c in claims:\n    print(f'\\nClaim: \"{c[\"text\"]}\"')\n    flags = check_red_flags(c['text'], c['details'])\n    if flags:\n        print(f'🚩 Red flags:')\n        for f in flags:\n            print(f'   - {f}')\n    else:\n        print('✓ No major red flags')",
          description: "Detect common red flags",
        },
        {
          id: "questions-to-ask",
          title: "Questions to Always Ask",
          code: "questions = {\n    'Source': [\n        'Who funded this study?',\n        'Do they benefit from positive results?',\n        'Has this been replicated?',\n    ],\n    'Sample': [\n        'How many people were studied?',\n        'How were they selected?',\n        'Who was excluded?',\n        'Is it representative?',\n    ],\n    'Methodology': [\n        'Was it a randomized controlled trial?',\n        'Was there a control group?',\n        'Was it double-blind?',\n        'Was it pre-registered?',\n    ],\n    'Statistics': [\n        'What is the confidence interval?',\n        'What is the effect size?',\n        'Is it statistically AND practically significant?',\n        'Were multiple comparisons corrected for?',\n    ],\n    'Interpretation': [\n        'Is this correlation or causation?',\n        'What are the absolute numbers?',\n        'Could there be confounding variables?',\n        'What are the limitations?',\n    ],\n}\n\nprint('QUESTIONS TO ASK ABOUT ANY STATISTICAL CLAIM')\nprint('=' * 55)\n\nfor category, q_list in questions.items():\n    print(f'\\n📋 {category}')\n    for q in q_list:\n        print(f'   • {q}')",
          description: "Essential questions to ask",
        },
      ]),
      keyPoints: [
        "Always check: source, sample, methodology",
        "Red flags: vague sources, missing sizes, round numbers",
        "Correlation ≠ causation",
        "Relative numbers need absolute context",
        "Ask: who benefits from this claim?",
        "Good studies acknowledge limitations",
      ],
      hardwareDemo: "Walk through evaluation checklist. Score claims systematically.",
      estimatedTime: 35,
      difficulty: "ADVANCED",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson21_3_1.number}: ${lesson21_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson21_3_1.id,
        number: 1,
        title: "Evaluate a Health Claim",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Apply the checklist to evaluate a health-related statistical claim.",
        starterCode: "claim = {\n    'headline': 'New Study: Drinking Coffee Reduces Heart Disease Risk by 20%',\n    'source': 'Coffee Industry Association',\n    'sample_size': 500,\n    'study_type': 'observational',\n    'peer_reviewed': True,\n    'confounders_controlled': ['age', 'smoking'],\n    'confounders_not_controlled': ['diet', 'exercise', 'socioeconomic status'],\n}\n\nprint('HEALTH CLAIM EVALUATION')\nprint('=' * 55)\nprint(f'Headline: \"{claim[\"headline\"]}\"')\nprint()\n\n# Source evaluation\nprint('1. SOURCE')\nprint(f'   Who: {claim[\"source\"]}')\nprint(f'   ⚠ Potential conflict of interest (coffee industry)')\n\n# Sample evaluation\nprint(f'\\n2. SAMPLE')\nprint(f'   Size: {claim[\"sample_size\"]}')\nprint(f'   ~ Moderate size, but could be larger')\n\n# Methodology evaluation\nprint(f'\\n3. METHODOLOGY')\nprint(f'   Type: {claim[\"study_type\"].capitalize()}')\nprint(f'   ⚠ Cannot establish causation')\nprint(f'   Peer reviewed: {\"Yes ✓\" if claim[\"peer_reviewed\"] else \"No ⚠\"}')\n\n# Confounders\nprint(f'\\n4. CONFOUNDERS')\nprint(f'   Controlled: {claim[\"confounders_controlled\"]}')\nprint(f'   NOT controlled: {claim[\"confounders_not_controlled\"]}')\nprint(f'   ⚠ Healthier people may drink more coffee')\n\n# Overall assessment\nprint(f'\\n5. OVERALL ASSESSMENT')\nprint('   Claim is WEAK because:')\nprint('   - Industry-funded (bias risk)')\nprint('   - Observational (not causal)')\nprint('   - Important confounders uncontrolled')\nprint('   - 20% relative reduction - what\\'s absolute risk?')",
        solution: "# Systematic claim evaluation",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Evaluation complete", description: "Health claim eval" }]),
        hints: ["Check source bias", "Observational ≠ causal", "List confounders"],
        xpReward: 20,
        order: 1,
      },
      {
        lessonId: lesson21_3_1.id,
        number: 2,
        title: "Absolute vs Relative Risk",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show how relative risk can mislead without absolute numbers.",
        starterCode: "# Two scenarios with same relative risk but very different implications\n\nscenarios = [\n    {\n        'name': 'Rare Disease Treatment',\n        'control_risk': 0.0001,  # 0.01% (1 in 10,000)\n        'treatment_risk': 0.00005,  # 0.005% (1 in 20,000)\n    },\n    {\n        'name': 'Common Disease Treatment',\n        'control_risk': 0.20,  # 20%\n        'treatment_risk': 0.10,  # 10%\n    },\n]\n\nprint('RELATIVE vs ABSOLUTE RISK')\nprint('=' * 55)\n\nfor s in scenarios:\n    relative_reduction = (1 - s['treatment_risk'] / s['control_risk']) * 100\n    absolute_reduction = (s['control_risk'] - s['treatment_risk']) * 100\n    nnt = 1 / (s['control_risk'] - s['treatment_risk'])  # Number needed to treat\n    \n    print(f'\\n{s[\"name\"]}')\n    print(f'  Control risk: {s[\"control_risk\"]*100:.3f}%')\n    print(f'  Treatment risk: {s[\"treatment_risk\"]*100:.3f}%')\n    print(f'  Relative risk reduction: {relative_reduction:.0f}%')\n    print(f'  Absolute risk reduction: {absolute_reduction:.3f}%')\n    print(f'  Number needed to treat: {nnt:.0f} people')\n\nprint('\\n⚠️  SAME 50% relative reduction, but:')\nprint('   Rare disease: treat 20,000 to prevent 1 case')\nprint('   Common disease: treat 10 to prevent 1 case')\nprint('\\n   ALWAYS ask for absolute numbers!')",
        solution: "# Relative risk can mislead",
        testCases: JSON.stringify([{ input: "", expectedOutput: "NNT shown", description: "Absolute vs relative" }]),
        hints: ["Same relative reduction", "Very different absolute", "NNT tells real story"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson21_3_1.id,
        number: 3,
        title: "Build a Claim Evaluator",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a function that scores statistical claims and identifies issues.",
        starterCode: "def evaluate_claim(claim):\n    score = 0\n    max_score = 10\n    issues = []\n    strengths = []\n    \n    # Source (2 points)\n    if claim.get('independent_source'):\n        score += 2\n        strengths.append('Independent source')\n    elif claim.get('source_disclosed'):\n        score += 1\n        issues.append('Potential conflict of interest')\n    else:\n        issues.append('Source not disclosed')\n    \n    # Sample size (2 points)\n    n = claim.get('sample_size', 0)\n    if n >= 1000:\n        score += 2\n        strengths.append(f'Large sample (n={n})')\n    elif n >= 100:\n        score += 1\n        issues.append(f'Moderate sample size (n={n})')\n    else:\n        issues.append(f'Small/unknown sample size')\n    \n    # Study type (2 points)\n    if claim.get('randomized_trial'):\n        score += 2\n        strengths.append('Randomized controlled trial')\n    elif claim.get('observational'):\n        score += 1\n        issues.append('Observational study only')\n    else:\n        issues.append('Study type unknown')\n    \n    # Peer review (2 points)\n    if claim.get('peer_reviewed'):\n        score += 2\n        strengths.append('Peer reviewed')\n    else:\n        issues.append('Not peer reviewed')\n    \n    # Replication (2 points)\n    if claim.get('replicated'):\n        score += 2\n        strengths.append('Results replicated')\n    else:\n        issues.append('Not yet replicated')\n    \n    return {\n        'score': score,\n        'max_score': max_score,\n        'grade': 'A' if score >= 8 else 'B' if score >= 6 else 'C' if score >= 4 else 'F',\n        'strengths': strengths,\n        'issues': issues\n    }\n\n# Test claims\nclaims = [\n    {'name': 'Weak claim', 'sample_size': 30, 'source_disclosed': False},\n    {'name': 'Strong claim', 'sample_size': 5000, 'independent_source': True, \n     'randomized_trial': True, 'peer_reviewed': True, 'replicated': True},\n]\n\nprint('CLAIM EVALUATOR')\nprint('=' * 55)\n\nfor c in claims:\n    result = evaluate_claim(c)\n    print(f'\\n{c[\"name\"]}: Grade {result[\"grade\"]} ({result[\"score\"]}/{result[\"max_score\"]})')\n    if result['strengths']:\n        print(f'  Strengths: {result[\"strengths\"]}')\n    if result['issues']:\n        print(f'  Issues: {result[\"issues\"]}')",
        solution: "# Comprehensive claim evaluator",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Scores and grades", description: "Claim evaluator" }]),
        hints: ["Score each dimension", "Track strengths and issues", "Provide overall grade"],
        xpReward: 25,
        order: 3,
      },
      {
        lessonId: lesson21_3_1.id,
        number: 4,
        title: "Spot the Manipulation",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Identify the manipulation technique in each example.",
        starterCode: "examples = [\n    {\n        'claim': 'Crime is up 200% in our city!',\n        'reality': 'Went from 1 to 3 incidents',\n        'technique': 'Misleading percentages on small numbers',\n        'fix': 'Report absolute numbers: \"3 incidents this year vs 1 last year\"'\n    },\n    {\n        'claim': 'Our approval rating is at an all-time high!',\n        'reality': 'Cherry-picked recent poll; others show lower',\n        'technique': 'Cherry-picking favorable data',\n        'fix': 'Report average of multiple polls'\n    },\n    {\n        'claim': '9 out of 10 customers are satisfied',\n        'reality': 'Only asked customers who made repeat purchases',\n        'technique': 'Selection bias',\n        'fix': 'Survey all customers, including one-time buyers'\n    },\n    {\n        'claim': 'Drug reduces risk of heart attack by 50%',\n        'reality': 'From 2% to 1% (absolute reduction: 1%)',\n        'technique': 'Relative vs absolute risk confusion',\n        'fix': 'Report both: \"50% relative, 1% absolute reduction\"'\n    },\n    {\n        'claim': 'Average employee salary increased to $80K',\n        'reality': 'CEO got $10M raise; median is still $45K',\n        'technique': 'Mean vs median confusion',\n        'fix': 'Report median: \"Median salary is $45K\"'\n    },\n]\n\nprint('SPOT THE MANIPULATION')\nprint('=' * 60)\n\nfor i, ex in enumerate(examples, 1):\n    print(f'\\n{i}. Claim: \"{ex[\"claim\"]}\"')\n    print(f'   Reality: {ex[\"reality\"]}')\n    print(f'   Technique: {ex[\"technique\"]}')\n    print(f'   Fix: {ex[\"fix\"]}')",
        solution: "# Identify manipulation techniques",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Techniques identified", description: "Spot manipulation" }]),
        hints: ["Each has different technique", "Consider what's hidden", "Think about proper presentation"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson21_3_1.id,
        number: 5,
        title: "Create Your Own Evaluation",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Evaluate a real-world statistical claim using all techniques learned.",
        starterCode: "# Real-world claim to evaluate\nclaim = {\n    'headline': 'New Study: Screen Time Linked to Depression in Teens',\n    'source': 'University research team',\n    'funding': 'National Institutes of Health',\n    'sample_size': 3000,\n    'sample_selection': 'Self-selected online survey',\n    'study_type': 'Cross-sectional observational',\n    'measure': 'Self-reported screen time and depression symptoms',\n    'finding': 'Teens with >5 hours screen time 2x more likely to report depression',\n    'peer_reviewed': True,\n    'replicated': False,\n}\n\ndef full_evaluation(claim):\n    print('COMPREHENSIVE CLAIM EVALUATION')\n    print('=' * 60)\n    print(f'\\nHeadline: \"{claim[\"headline\"]}\"')\n    \n    print('\\n--- 1. SOURCE ANALYSIS ---')\n    print(f'  Source: {claim[\"source\"]} ✓')\n    print(f'  Funding: {claim[\"funding\"]} ✓ (independent)')\n    \n    print('\\n--- 2. SAMPLE ANALYSIS ---')\n    print(f'  Size: {claim[\"sample_size\"]} ✓ (adequate)')\n    print(f'  Selection: {claim[\"sample_selection\"]}')\n    print('  ⚠ Self-selection bias likely')\n    \n    print('\\n--- 3. METHODOLOGY ---')\n    print(f'  Type: {claim[\"study_type\"]}')\n    print('  ⚠ Cross-sectional: cannot determine causation')\n    print('  ⚠ Direction unclear: depression → more screen time?')\n    print(f'  Measures: {claim[\"measure\"]}')\n    print('  ⚠ Self-reported (may be inaccurate)')\n    \n    print('\\n--- 4. STATISTICAL CONCERNS ---')\n    print(f'  Finding: {claim[\"finding\"]}')\n    print('  ⚠ \"2x more likely\" - what\\'s the base rate?')\n    print('  ⚠ Many confounders: sleep, exercise, social life')\n    \n    print('\\n--- 5. REPLICATION STATUS ---')\n    print(f'  Peer reviewed: {\"Yes\" if claim[\"peer_reviewed\"] else \"No\"}')\n    print(f'  Replicated: {\"Yes\" if claim[\"replicated\"] else \"Not yet\"}')\n    \n    print('\\n--- OVERALL ASSESSMENT ---')\n    print('  Strength: Moderate (large sample, peer-reviewed, NIH-funded)')\n    print('  Weakness: Cannot prove causation, self-selection, self-report')\n    print('  Verdict: Interesting correlation, but CANNOT conclude')\n    print('           that screen time CAUSES depression.')\n    print('  Better headline: \"Screen time ASSOCIATED with depression\"')\n\nfull_evaluation(claim)",
        solution: "# Full critical evaluation",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Complete evaluation", description: "Full evaluation" }]),
        hints: ["Check all dimensions", "Note limitations", "Suggest improvements"],
        xpReward: 30,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 21.3.1`);

  console.log("\n✅ Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
