const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const exercisesByLesson = {
  'population-vs-sample': [
    { title: 'Define Population', prompt: 'What is a population in statistics? Give an example.', type: 'TEXT_RESPONSE', difficulty: 'BEGINNER', xpReward: 5, hints: ['Entire group of interest'], solution: 'A population is the complete set of all items/individuals you want to study.\n\nExamples:\n- All voters in a country\n- All products from a factory\n- All students in a university\n\nPopulation parameters (μ, σ) are usually unknown.' },
    { title: 'Define Sample', prompt: 'What is a sample and why do we use samples instead of populations?', type: 'TEXT_RESPONSE', difficulty: 'BEGINNER', xpReward: 5, hints: ['Subset', 'Practical reasons'], solution: 'A sample is a subset of the population selected for study.\n\nWhy use samples:\n1. Cost: measuring entire population is expensive\n2. Time: sampling is faster\n3. Feasibility: can\'t always access whole population\n4. Destructive testing: can\'t test all products\n\nSample statistics (x̄, s) estimate population parameters.' },
    { title: 'Random Sampling', prompt: 'Implement simple random sampling from a population.', type: 'CODE', difficulty: 'BEGINNER', xpReward: 15, starterCode: 'import random\n\ndef simple_random_sample(population, n):\n    """Select n items randomly without replacement."""\n    return random.sample(population, n)\n\n# Population: all numbers 1-100\npopulation = list(range(1, 101))\n\n# Take samples of different sizes\nfor n in [5, 10, 20]:\n    sample = simple_random_sample(population, n)\n    sample_mean = sum(sample) / len(sample)\n    print(f"Sample size {n}: mean = {sample_mean:.1f}")\n\n# True population mean\npop_mean = sum(population) / len(population)\nprint(f"\\nPopulation mean: {pop_mean}")', hints: ['Use random.sample', 'Without replacement'], solution: '# Sample means approximate population mean (50.5)' },
    { title: 'Sampling Bias', prompt: 'Explain sampling bias with an example of how it can lead to wrong conclusions.', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 10, hints: ['Non-representative sample', 'Systematic error'], solution: 'Sampling bias occurs when some members of the population are more likely to be selected than others.\n\nExample: Surveying political opinions by phone during work hours.\n- Bias: excludes working people\n- Result: overrepresents retirees, unemployed\n- Wrong conclusion: may show different political preferences than actual population\n\nAlways consider who is excluded from your sample!' },
  ],

  'central-limit-theorem': [
    { title: 'CLT Statement', prompt: 'State the Central Limit Theorem in your own words.', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 10, hints: ['Sample means', 'Normal distribution'], solution: 'The Central Limit Theorem states that the distribution of sample means approaches a normal distribution as sample size increases, regardless of the population\'s original distribution.\n\nKey points:\n- Works for n ≥ 30 (rule of thumb)\n- Mean of sample means = population mean\n- Standard error = σ/√n' },
    { title: 'CLT Simulation', prompt: 'Demonstrate the CLT by taking many samples and plotting their means.', type: 'CODE', difficulty: 'INTERMEDIATE', xpReward: 25, starterCode: 'import random\n\ndef simulate_clt(population, sample_size, num_samples):\n    """Take many samples and return their means."""\n    sample_means = []\n    for _ in range(num_samples):\n        sample = random.choices(population, k=sample_size)\n        sample_means.append(sum(sample) / len(sample))\n    return sample_means\n\n# Uniform population (NOT normal!)\npopulation = list(range(1, 101))  # 1 to 100\n\n# Simulate for different sample sizes\nfor n in [5, 30, 100]:\n    means = simulate_clt(population, sample_size=n, num_samples=1000)\n    \n    # Calculate stats of sample means\n    mean_of_means = sum(means) / len(means)\n    std_of_means = (sum((m - mean_of_means)**2 for m in means) / len(means)) ** 0.5\n    \n    print(f"n={n}: mean of means = {mean_of_means:.2f}, std = {std_of_means:.2f}")\n\n# Theory: std of means should be σ/√n ≈ 28.9/√n\nimport math\npop_std = 28.87  # std of uniform 1-100\nprint(f"\\nTheoretical std for n=30: {pop_std/math.sqrt(30):.2f}")', hints: ['Take many samples', 'Compare to theory'], solution: '# Sample means become more normal, std decreases with √n' },
    { title: 'Standard Error', prompt: 'Calculate the standard error of the mean for different sample sizes.', type: 'CODE', difficulty: 'INTERMEDIATE', xpReward: 15, starterCode: 'import math\n\ndef standard_error(population_std, sample_size):\n    """SE = σ / √n"""\n    return population_std / math.sqrt(sample_size)\n\n# Population std = 15 (e.g., IQ test)\npop_std = 15\n\nprint("Sample Size | Standard Error")\nprint("-" * 30)\nfor n in [10, 25, 50, 100, 400, 1000]:\n    se = standard_error(pop_std, n)\n    print(f"    {n:4}    |    {se:.2f}")\n\nprint("\\nNote: To halve SE, you need 4x the sample size!")', hints: ['SE = σ/√n', 'Diminishing returns'], solution: '# SE decreases with √n' },
  ],

  'confidence-intervals-intro': [
    { title: 'CI Interpretation', prompt: 'What does a 95% confidence interval actually mean?', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 15, hints: ['Long-run frequency', 'Not probability of parameter'], solution: 'A 95% CI means: If we repeated the sampling process many times and built a CI each time, about 95% of those intervals would contain the true population parameter.\n\nNOT: "95% probability the true value is in this interval"\n\nThe true parameter is fixed; the interval is random. Once calculated, the parameter either is or isn\'t in the interval.' },
    { title: 'Calculate CI for Mean', prompt: 'Implement confidence interval calculation for a sample mean.', type: 'CODE', difficulty: 'INTERMEDIATE', xpReward: 20, starterCode: 'import math\n\ndef confidence_interval(sample, confidence=0.95):\n    """\n    Calculate CI for mean using t-distribution approximation.\n    For large n, z ≈ 1.96 for 95% CI.\n    """\n    n = len(sample)\n    mean = sum(sample) / n\n    \n    # Sample standard deviation\n    variance = sum((x - mean)**2 for x in sample) / (n - 1)\n    std = math.sqrt(variance)\n    \n    # Standard error\n    se = std / math.sqrt(n)\n    \n    # Z-score for confidence level (approximation)\n    z_scores = {0.90: 1.645, 0.95: 1.96, 0.99: 2.576}\n    z = z_scores.get(confidence, 1.96)\n    \n    # Margin of error\n    margin = z * se\n    \n    return mean - margin, mean + margin, mean, margin\n\n# Test with sample data\nimport random\nrandom.seed(42)\nsample = [random.gauss(100, 15) for _ in range(50)]  # IQ-like data\n\nlower, upper, mean, margin = confidence_interval(sample, 0.95)\nprint(f"Sample mean: {mean:.2f}")\nprint(f"95% CI: ({lower:.2f}, {upper:.2f})")\nprint(f"Margin of error: ±{margin:.2f}")', hints: ['Mean ± z × SE', 'Use z=1.96 for 95%'], solution: '# CI contains true mean (100) about 95% of the time' },
    { title: 'CI Width Factors', prompt: 'What three factors affect the width of a confidence interval?', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 10, hints: ['Sample size', 'Variability', 'Confidence level'], solution: 'CI width depends on:\n\n1. Sample size (n): Larger n → narrower CI\n   - SE = σ/√n decreases with n\n\n2. Variability (σ): More variability → wider CI\n   - Uncertain data needs wider interval\n\n3. Confidence level: Higher confidence → wider CI\n   - 99% CI is wider than 95% CI\n   - More confidence requires more coverage' },
  ],

  'margin-of-error-sample-size': [
    { title: 'Margin of Error Formula', prompt: 'Explain the margin of error and its formula.', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 10, hints: ['Half-width of CI', 'z × SE'], solution: 'Margin of Error (ME) is the half-width of a confidence interval.\n\nFormula: ME = z × (σ/√n)\n\nFor 95% CI: ME = 1.96 × (σ/√n)\n\nInterpretation: The estimate is within ±ME of the true value with the specified confidence.' },
    { title: 'Sample Size Calculation', prompt: 'Calculate required sample size for a given margin of error.', type: 'CODE', difficulty: 'INTERMEDIATE', xpReward: 20, starterCode: 'import math\n\ndef required_sample_size(margin_of_error, pop_std, confidence=0.95):\n    """\n    Calculate n needed for desired margin of error.\n    Formula: n = (z × σ / ME)²\n    """\n    z_scores = {0.90: 1.645, 0.95: 1.96, 0.99: 2.576}\n    z = z_scores.get(confidence, 1.96)\n    \n    n = (z * pop_std / margin_of_error) ** 2\n    return math.ceil(n)  # Round up\n\n# Example: Estimating average height\n# Population std ≈ 4 inches\npop_std = 4\n\nprint("Desired ME | Required n (95% CI)")\nprint("-" * 35)\nfor me in [2.0, 1.0, 0.5, 0.25]:\n    n = required_sample_size(me, pop_std, 0.95)\n    print(f"   ±{me}    |        {n}")\n\nprint("\\nNote: Halving ME requires 4x the sample size!")', hints: ['Solve ME formula for n', 'n = (z×σ/ME)²'], solution: '# Shows relationship between ME and n' },
    { title: 'Poll Sample Size', prompt: 'A political poll wants ±3% margin of error with 95% confidence. What sample size is needed?', type: 'CODE', difficulty: 'INTERMEDIATE', xpReward: 15, starterCode: 'import math\n\n# For proportions, maximum variability when p = 0.5\n# std = sqrt(p(1-p)) = sqrt(0.25) = 0.5\n\ndef poll_sample_size(margin_of_error, confidence=0.95):\n    z = 1.96 if confidence == 0.95 else 2.576\n    p = 0.5  # Maximum variability\n    \n    # ME = z × sqrt(p(1-p)/n)\n    # Solve for n: n = z² × p(1-p) / ME²\n    n = (z ** 2) * p * (1 - p) / (margin_of_error ** 2)\n    return math.ceil(n)\n\nme = 0.03  # ±3%\nn = poll_sample_size(me)\nprint(f"For ±{me*100}% margin of error at 95% confidence:")\nprint(f"Required sample size: {n}")\n\n# Try different margins\nprint("\\nME    | Sample Size")\nfor me in [0.05, 0.03, 0.02, 0.01]:\n    print(f"±{me*100:.0f}%  |    {poll_sample_size(me)}")', hints: ['Use p=0.5 for max variability', 'Proportions formula'], solution: '# ±3% needs about 1,068 people' },
  ],

  'bootstrap-method': [
    { title: 'Bootstrap Concept', prompt: 'Explain the bootstrap method and why it works.', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 15, hints: ['Resampling with replacement', 'Approximate sampling distribution'], solution: 'Bootstrap: Resample from your sample (with replacement) many times to estimate the sampling distribution.\n\nWhy it works:\n1. Sample is our best estimate of population\n2. Resampling mimics taking new samples from population\n3. Distribution of bootstrap statistics approximates sampling distribution\n\nUseful when:\n- Theoretical distribution unknown\n- Small sample sizes\n- Complex statistics (median, ratios)' },
    { title: 'Implement Bootstrap', prompt: 'Implement bootstrap confidence interval for the mean.', type: 'CODE', difficulty: 'INTERMEDIATE', xpReward: 25, starterCode: 'import random\n\ndef bootstrap_ci(sample, stat_func, n_bootstrap=1000, confidence=0.95):\n    """\n    Calculate bootstrap confidence interval.\n    stat_func: function that computes statistic from sample\n    """\n    bootstrap_stats = []\n    n = len(sample)\n    \n    for _ in range(n_bootstrap):\n        # Resample with replacement\n        boot_sample = random.choices(sample, k=n)\n        stat = stat_func(boot_sample)\n        bootstrap_stats.append(stat)\n    \n    # Percentile method\n    bootstrap_stats.sort()\n    alpha = 1 - confidence\n    lower_idx = int(n_bootstrap * alpha / 2)\n    upper_idx = int(n_bootstrap * (1 - alpha / 2))\n    \n    return bootstrap_stats[lower_idx], bootstrap_stats[upper_idx]\n\n# Test with sample data\nrandom.seed(42)\nsample = [random.gauss(50, 10) for _ in range(30)]\n\n# Bootstrap CI for mean\nmean_func = lambda x: sum(x) / len(x)\nlower, upper = bootstrap_ci(sample, mean_func)\nprint(f"Sample mean: {mean_func(sample):.2f}")\nprint(f"95% Bootstrap CI for mean: ({lower:.2f}, {upper:.2f})")\n\n# Bootstrap CI for median\nmedian_func = lambda x: sorted(x)[len(x)//2]\nlower, upper = bootstrap_ci(sample, median_func)\nprint(f"\\nSample median: {median_func(sample):.2f}")\nprint(f"95% Bootstrap CI for median: ({lower:.2f}, {upper:.2f})")', hints: ['Resample with replacement', 'Use percentiles'], solution: '# Works for any statistic!' },
    { title: 'Bootstrap vs Normal CI', prompt: 'When would you use bootstrap instead of the normal-theory confidence interval?', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 10, hints: ['Non-normal data', 'Complex statistics'], solution: 'Use bootstrap when:\n1. Data is not normally distributed\n2. Sample size is small\n3. Statistic is complex (median, trimmed mean, ratio)\n4. No formula exists for standard error\n5. Population distribution is unknown\n\nUse normal-theory CI when:\n- Large sample (CLT applies)\n- Estimating mean/proportion\n- Need computational efficiency' },
  ],
};

async function main() {
  console.log('Adding Ch 14 exercises...\n');
  
  for (const [slug, exercises] of Object.entries(exercisesByLesson)) {
    const lesson = await prisma.lesson.findUnique({
      where: { slug },
      include: { exercises: true }
    });
    
    if (!lesson) {
      console.log(`⚠️  Lesson not found: ${slug}`);
      continue;
    }
    
    const startNum = lesson.exercises.length + 1;
    let added = 0;
    
    for (const ex of exercises) {
      const exists = lesson.exercises.some(e => e.title === ex.title);
      if (exists) continue;
      
      await prisma.exercise.create({
        data: {
          lessonId: lesson.id,
          number: startNum + added,
          title: ex.title,
          prompt: ex.prompt,
          type: ex.type || 'CODE',
          difficulty: ex.difficulty || 'BEGINNER',
          xpReward: ex.xpReward || 10,
          starterCode: ex.starterCode || null,
          solution: ex.solution || null,
          hints: ex.hints || [],
          order: startNum + added,
        }
      });
      added++;
    }
    
    console.log(`✓ ${slug}: +${added} (total: ${lesson.exercises.length + added})`);
  }
  
  const total = await prisma.exercise.count();
  console.log(`\n📊 Total exercises: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
