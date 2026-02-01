const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const exercisesByLesson = {
  // ============ CHAPTER 27: Neural Networks (need +6) ============
  'loss-functions': [
    { title: 'Loss Function Purpose', prompt: 'What is a loss function and why do we need it?', type: 'TEXT_RESPONSE', difficulty: 'BEGINNER', xpReward: 5, hints: ['Measure of error', 'Guide for learning'], solution: 'A loss function measures how wrong the model\'s predictions are. It provides a single number that tells us how well (or poorly) the model is doing. Training minimizes this loss, guiding the model to make better predictions.' },
    { title: 'MSE vs MAE', prompt: 'Compare Mean Squared Error and Mean Absolute Error.', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 10, hints: ['Squaring vs absolute', 'Sensitivity to outliers'], solution: 'MSE = mean((y - ŷ)²): Penalizes large errors more, sensitive to outliers, differentiable everywhere.\n\nMAE = mean(|y - ŷ|): Treats all errors equally, robust to outliers, not differentiable at 0.\n\nUse MSE for general regression, MAE when outliers are a concern.' },
    { title: 'Cross-Entropy Intuition', prompt: 'Explain cross-entropy loss intuitively.', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 15, hints: ['Probability mismatch', 'Information theory'], solution: 'Cross-entropy measures the "surprise" when using predicted probabilities instead of true ones.\n\nIf model predicts 90% for correct class: low loss (not surprised)\nIf model predicts 10% for correct class: high loss (very surprised)\n\nFormula: -Σ y_true * log(y_pred)\nPenalizes confident wrong predictions heavily.' },
    { title: 'Implement Cross-Entropy', prompt: 'Implement categorical cross-entropy loss.', type: 'CODE', difficulty: 'INTERMEDIATE', xpReward: 20, starterCode: 'import math\n\ndef cross_entropy(y_true, y_pred):\n    """\n    y_true: one-hot encoded labels\n    y_pred: predicted probabilities\n    """\n    eps = 1e-15  # Prevent log(0)\n    loss = 0\n    for true, pred in zip(y_true, y_pred):\n        pred = max(eps, min(1-eps, pred))\n        if true == 1:\n            loss -= math.log(pred)\n    return loss\n\n# Test: 3-class problem\n# True class is 0\ny_true = [1, 0, 0]\n\n# Good prediction\ny_pred_good = [0.9, 0.05, 0.05]\nprint(f"Good prediction loss: {cross_entropy(y_true, y_pred_good):.4f}")\n\n# Bad prediction\ny_pred_bad = [0.1, 0.6, 0.3]\nprint(f"Bad prediction loss: {cross_entropy(y_true, y_pred_bad):.4f}")', hints: ['-log(p) for correct class', 'Clip predictions'], solution: '# Good: ~0.105, Bad: ~2.303' },
  ],

  'backpropagation': [
    { title: 'Backprop Purpose', prompt: 'Why do we need backpropagation?', type: 'TEXT_RESPONSE', difficulty: 'BEGINNER', xpReward: 5, hints: ['Gradient computation', 'Credit assignment'], solution: 'Backpropagation computes how much each weight contributed to the error. It answers: "Which weights should change and by how much?"\n\nWithout backprop, we\'d have to try random changes or compute gradients numerically (very slow).' },
    { title: 'Chain Rule', prompt: 'Explain the chain rule and its role in backpropagation.', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 15, hints: ['Composite functions', 'Multiply local gradients'], solution: 'Chain rule: For f(g(x)), the derivative is f\'(g(x)) × g\'(x).\n\nIn neural networks:\n- Output depends on many nested functions\n- Each layer is a function\n- Chain rule lets us compute gradients layer by layer\n- Multiply local gradients from output back to input' },
    { title: 'Backward Pass Example', prompt: 'Trace the backward pass for f = (a + b) * c.', type: 'CODE', difficulty: 'INTERMEDIATE', xpReward: 20, starterCode: '# Forward: f = (a + b) * c\na, b, c = 2.0, 3.0, 4.0\n\n# Forward pass\nd = a + b      # d = 5\nf = d * c      # f = 20\n\nprint(f"Forward: a={a}, b={b}, c={c}")\nprint(f"d = a + b = {d}")\nprint(f"f = d * c = {f}")\n\n# Backward pass\ndf_df = 1.0         # Gradient of f with respect to f\n\n# f = d * c\ndf_dd = c * df_df   # ∂f/∂d = c\ndf_dc = d * df_df   # ∂f/∂c = d\n\n# d = a + b\ndf_da = 1 * df_dd   # ∂d/∂a = 1\ndf_db = 1 * df_dd   # ∂d/∂b = 1\n\nprint(f"\\nBackward:")\nprint(f"∂f/∂a = {df_da}")\nprint(f"∂f/∂b = {df_db}")\nprint(f"∂f/∂c = {df_dc}")', hints: ['Start from output', 'Apply chain rule'], solution: '# ∂f/∂a = 4, ∂f/∂b = 4, ∂f/∂c = 5' },
  ],

  'gradient-flow-problems': [
    { title: 'Vanishing Gradients', prompt: 'What causes vanishing gradients and how does it affect training?', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 15, hints: ['Deep networks', 'Sigmoid/tanh derivatives'], solution: 'Cause: Sigmoid/tanh derivatives are < 1. In deep networks, multiplying many small numbers → gradient approaches 0.\n\nEffect:\n- Early layers learn very slowly or not at all\n- Network can\'t learn long-range dependencies\n- Training stalls\n\nSolutions: ReLU, skip connections, careful initialization, batch normalization.' },
    { title: 'Exploding Gradients', prompt: 'How do you detect and fix exploding gradients?', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 15, hints: ['NaN loss', 'Gradient clipping'], solution: 'Detection:\n- Loss becomes NaN or Inf\n- Weights grow very large\n- Unstable training\n\nFixes:\n1. Gradient clipping: cap gradient magnitude\n2. Lower learning rate\n3. Better weight initialization\n4. Batch normalization\n5. Use LSTM/GRU for sequences' },
    { title: 'Implement Gradient Clipping', prompt: 'Implement gradient clipping by norm.', type: 'CODE', difficulty: 'INTERMEDIATE', xpReward: 20, starterCode: 'import math\n\ndef clip_gradients(gradients, max_norm):\n    """\n    Clip gradients so total norm <= max_norm.\n    """\n    # Calculate total norm\n    total_norm = math.sqrt(sum(g**2 for g in gradients))\n    \n    # Clip if necessary\n    if total_norm > max_norm:\n        scale = max_norm / total_norm\n        gradients = [g * scale for g in gradients]\n    \n    return gradients, total_norm\n\n# Test with large gradients\ngradients = [10.0, 20.0, 30.0]  # Norm = sqrt(100+400+900) = 37.4\nmax_norm = 5.0\n\nclipped, original_norm = clip_gradients(gradients, max_norm)\nclipped_norm = math.sqrt(sum(g**2 for g in clipped))\n\nprint(f"Original gradients: {gradients}")\nprint(f"Original norm: {original_norm:.2f}")\nprint(f"Clipped gradients: {[round(g, 3) for g in clipped]}")\nprint(f"Clipped norm: {clipped_norm:.2f}")', hints: ['Compute total norm', 'Scale if exceeds max'], solution: '# Clipped norm = 5.0' },
  ],

  'training-neural-networks': [
    { title: 'Training Recipe', prompt: 'List the key ingredients for successfully training a neural network.', type: 'TEXT_RESPONSE', difficulty: 'BEGINNER', xpReward: 10, hints: ['Data, model, optimizer, loss'], solution: '1. Data: clean, sufficient, properly split\n2. Model: appropriate architecture for problem\n3. Loss function: matches your goal\n4. Optimizer: SGD, Adam, etc.\n5. Hyperparameters: learning rate, batch size, epochs\n6. Regularization: dropout, weight decay\n7. Monitoring: track train/val loss' },
    { title: 'Common Training Issues', prompt: 'Your model\'s training loss decreases but validation loss increases. What\'s wrong?', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 10, hints: ['Generalization', 'Complexity'], solution: 'Overfitting! The model is memorizing training data instead of learning general patterns.\n\nFixes:\n1. More training data\n2. Data augmentation\n3. Simpler model\n4. Add dropout\n5. Early stopping\n6. L2 regularization\n7. Reduce training time' },
    { title: 'Learning Rate Schedule', prompt: 'What is learning rate scheduling and why use it?', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 15, hints: ['Change LR during training', 'Fine-tuning'], solution: 'LR scheduling changes the learning rate during training.\n\nCommon schedules:\n- Step decay: reduce by factor every N epochs\n- Exponential decay: LR × decay^epoch\n- Cosine annealing: smooth decrease and reset\n- ReduceLROnPlateau: reduce when val loss stalls\n\nWhy: Start with large LR for fast progress, reduce for fine-tuning near optimum.' },
  ],

  // ============ CHAPTER 29: Practical ML (need +6) ============
  'ml-pipeline-overview': [
    { title: 'Pipeline Importance', prompt: 'Why is having a structured ML pipeline important?', type: 'TEXT_RESPONSE', difficulty: 'BEGINNER', xpReward: 5, hints: ['Reproducibility', 'Organization'], solution: 'A structured pipeline ensures:\n1. Reproducibility: same results every time\n2. Organization: clear steps and responsibilities\n3. Debugging: easy to find where things go wrong\n4. Collaboration: team can work together\n5. Deployment: smooth transition to production\n6. Maintenance: easy to update and improve' },
  ],

  'data-preprocessing': [
    { title: 'Scaling Importance', prompt: 'Why is feature scaling important for many ML algorithms?', type: 'TEXT_RESPONSE', difficulty: 'BEGINNER', xpReward: 10, hints: ['Different scales', 'Gradient descent'], solution: 'Many algorithms are sensitive to feature scales:\n\n- Gradient descent: large features dominate gradients\n- KNN/SVM: distance metrics affected by scale\n- Neural networks: large inputs cause saturation\n\nFeatures like age (0-100) and income (0-1M) need to be on similar scales for fair comparison.' },
    { title: 'Handle Categorical Data', prompt: 'Implement one-hot encoding for categorical features.', type: 'CODE', difficulty: 'INTERMEDIATE', xpReward: 15, starterCode: 'def one_hot_encode(values):\n    """One-hot encode a list of categorical values."""\n    unique = sorted(set(values))\n    encoding = {val: i for i, val in enumerate(unique)}\n    \n    result = []\n    for val in values:\n        one_hot = [0] * len(unique)\n        one_hot[encoding[val]] = 1\n        result.append(one_hot)\n    \n    return result, unique\n\n# Test\ncolors = [\"red\", \"blue\", \"green\", \"red\", \"blue\"]\nencoded, categories = one_hot_encode(colors)\n\nprint(f"Categories: {categories}")\nfor color, enc in zip(colors, encoded):\n    print(f"{color} -> {enc}")', hints: ['Map each category to index', 'Create binary vector'], solution: '# red->[1,0,0], blue->[0,1,0], green->[0,0,1]' },
  ],

  'feature-engineering': [
    { title: 'Domain Knowledge', prompt: 'Why is domain knowledge crucial for feature engineering?', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 10, hints: ['Understanding data', 'Meaningful features'], solution: 'Domain knowledge helps:\n1. Identify relevant features (what matters for prediction)\n2. Create meaningful combinations (BMI from height/weight)\n3. Handle edge cases properly\n4. Avoid data leakage\n5. Interpret results correctly\n\nA medical expert knows that certain lab values are more important than others for diagnosis.' },
  ],

  'model-selection': [
    { title: 'Model Comparison', prompt: 'How do you fairly compare different models?', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 15, hints: ['Same data splits', 'Cross-validation'], solution: 'Fair comparison requires:\n1. Same train/test splits for all models\n2. Same preprocessing\n3. Cross-validation (not single split)\n4. Proper hyperparameter tuning for each\n5. Statistical significance testing\n6. Multiple metrics (not just accuracy)\n7. Consider training time and complexity' },
  ],

  'hyperparameter-tuning': [
    { title: 'Hyperparameter vs Parameter', prompt: 'Distinguish hyperparameters from model parameters with examples.', type: 'TEXT_RESPONSE', difficulty: 'BEGINNER', xpReward: 5, hints: ['Set before vs learned'], solution: 'Parameters: Learned from data during training\n- Neural network weights\n- Linear regression coefficients\n\nHyperparameters: Set before training, control learning\n- Learning rate\n- Number of layers/neurons\n- K in KNN\n- Tree depth\n- Regularization strength' },
    { title: 'Bayesian Optimization', prompt: 'Briefly explain Bayesian optimization for hyperparameter tuning.', type: 'TEXT_RESPONSE', difficulty: 'ADVANCED', xpReward: 20, hints: ['Model of objective', 'Acquisition function'], solution: 'Bayesian optimization:\n1. Build probabilistic model of objective function\n2. Use acquisition function to pick next hyperparameters to try\n3. Evaluate, update model\n4. Repeat\n\nAdvantages over grid/random:\n- Uses past evaluations to guide search\n- Efficient for expensive evaluations\n- Balances exploration and exploitation' },
  ],

  'complete-ml-project': [
    { title: 'Project Checklist', prompt: 'Create a checklist for a production ML project.', type: 'TEXT_RESPONSE', difficulty: 'INTERMEDIATE', xpReward: 15, hints: ['End-to-end steps'], solution: '□ Define problem and success metrics\n□ Collect and validate data\n□ Exploratory data analysis\n□ Data cleaning and preprocessing\n□ Feature engineering\n□ Train/val/test split\n□ Baseline model\n□ Model selection and tuning\n□ Error analysis\n□ Final evaluation\n□ Documentation\n□ Deployment plan\n□ Monitoring setup' },
  ],
};

async function main() {
  console.log('Adding final gap exercises...\n');
  
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
    
    if (added > 0) {
      console.log(`✓ ${slug}: +${added}`);
    }
  }
  
  // Final counts
  const chapters = await prisma.chapter.findMany({
    include: { sections: { include: { lessons: { include: { _count: { select: { exercises: true } } } } } } },
    orderBy: { number: 'asc' }
  });
  
  let grandTotal = 0;
  console.log('\nFinal counts:');
  for (const ch of chapters) {
    let total = 0;
    for (const sec of ch.sections) {
      for (const les of sec.lessons) {
        total += les._count.exercises;
      }
    }
    grandTotal += total;
    const status = total < 30 ? '⚠️' : '✓';
    console.log(`${status} Ch ${ch.number}: ${total}`);
  }
  console.log(`\n📊 Total: ${grandTotal} exercises`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
