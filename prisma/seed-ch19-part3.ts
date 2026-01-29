import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 3: Lessons 19.2.1-19.2.3 (Distance Metrics and KNN)...\n");

  const section19_2 = await prisma.section.findFirst({ where: { number: 19.2 } });
  if (!section19_2) throw new Error("Section 19.2 not found. Run part 1 first.");

  const lesson19_2_1 = await prisma.lesson.upsert({
    where: { slug: "distance-metrics" },
    update: {},
    create: {
      sectionId: section19_2.id,
      number: 19.21,
      title: "Distance Metrics (Euclidean, Manhattan)",
      slug: "distance-metrics",
      objectives: [
        "Understand distance as similarity measure",
        "Implement Euclidean distance",
        "Implement Manhattan distance",
        "Choose appropriate distance metric",
      ],
      content: `# Distance Metrics

## Why Distance Matters

Many ML algorithms rely on measuring **similarity** between data points.

**Key idea**: Similar things are "close" in feature space.

## Euclidean Distance

"Straight line" distance - like flying.

**Formula (2D)**:
\`\`\`
d = √[(x₂-x₁)² + (y₂-y₁)²]
\`\`\`

**Formula (nD)**:
\`\`\`
d = √[Σ(aᵢ - bᵢ)²]
\`\`\`

## Manhattan Distance

"City block" distance - like driving on a grid.

**Formula (2D)**:
\`\`\`
d = |x₂-x₁| + |y₂-y₁|
\`\`\`

**Formula (nD)**:
\`\`\`
d = Σ|aᵢ - bᵢ|
\`\`\`

## Comparison

| Euclidean | Manhattan |
|-----------|-----------|
| Straight line | Grid path |
| √(Σsquares) | Σ|differences| |
| Sensitive to large differences | More robust |
| Default choice | Good for high dimensions |

## Visual Example

Point A(0,0) to Point B(3,4):
- Euclidean: √(9+16) = 5
- Manhattan: 3+4 = 7

## When to Use Which

- **Euclidean**: Default for most cases
- **Manhattan**: High-dimensional data, integer features`,
      codeExamples: JSON.stringify([
        {
          id: "euclidean-distance",
          title: "Euclidean Distance",
          code: "import math\n\ndef euclidean_distance(point1, point2):\n    \"\"\"Calculate Euclidean (straight-line) distance\"\"\"\n    squared_diff = 0\n    for i in range(len(point1)):\n        squared_diff += (point1[i] - point2[i]) ** 2\n    return math.sqrt(squared_diff)\n\n# 2D examples\na = (0, 0)\nb = (3, 4)\nprint('Euclidean Distance')\nprint('=' * 40)\nprint(f'Point A: {a}')\nprint(f'Point B: {b}')\nprint(f'Distance: {euclidean_distance(a, b)}')\nprint('  √[(3-0)² + (4-0)²] = √[9+16] = √25 = 5')\n\n# 3D example\nc = (1, 2, 3)\nd = (4, 6, 3)\nprint(f'\\n3D: {c} to {d}')\nprint(f'Distance: {euclidean_distance(c, d):.2f}')\nprint('  √[(4-1)² + (6-2)² + (3-3)²] = √[9+16+0] = 5')",
          description: "Straight-line distance calculation",
        },
        {
          id: "manhattan-distance",
          title: "Manhattan Distance",
          code: "def manhattan_distance(point1, point2):\n    \"\"\"Calculate Manhattan (city-block) distance\"\"\"\n    total = 0\n    for i in range(len(point1)):\n        total += abs(point1[i] - point2[i])\n    return total\n\n# 2D examples\na = (0, 0)\nb = (3, 4)\nprint('Manhattan Distance')\nprint('=' * 40)\nprint(f'Point A: {a}')\nprint(f'Point B: {b}')\nprint(f'Distance: {manhattan_distance(a, b)}')\nprint('  |3-0| + |4-0| = 3 + 4 = 7')\n\n# Like walking on city blocks\nprint('\\nVisualization (A to B):')\nprint('B . . .')\nprint('. . . .')\nprint('. . . .')\nprint('. . . .')\nprint('A → → →  then ↑↑↑↑')\nprint('3 blocks right + 4 blocks up = 7')",
          description: "Grid/block distance calculation",
        },
        {
          id: "compare-distances",
          title: "Compare Distance Metrics",
          code: "import math\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef manhattan(p1, p2):\n    return sum(abs(a-b) for a, b in zip(p1, p2))\n\n# Compare on several point pairs\ntest_pairs = [\n    ((0, 0), (3, 4)),\n    ((1, 1), (4, 5)),\n    ((0, 0), (10, 0)),\n    ((0, 0), (5, 5)),\n]\n\nprint('Distance Comparison')\nprint('=' * 50)\nprint(f'{\"Points\":^25} {\"Euclidean\":>10} {\"Manhattan\":>10}')\nprint('-' * 50)\n\nfor p1, p2 in test_pairs:\n    euc = euclidean(p1, p2)\n    man = manhattan(p1, p2)\n    print(f'{str(p1) + \" to \" + str(p2):^25} {euc:>10.2f} {man:>10}')\n\nprint('\\nManhattan >= Euclidean always!')\nprint('(Triangle inequality)')",
          description: "Side-by-side comparison",
        },
      ]),
      keyPoints: [
        "Distance measures similarity (closer = more similar)",
        "Euclidean: straight-line, √(Σsquares)",
        "Manhattan: grid path, Σ|differences|",
        "Manhattan >= Euclidean always",
        "Euclidean is default choice",
        "Scale features before computing distances!",
      ],
      hardwareDemo: "Watch squared differences accumulate. See sqrt for Euclidean, abs sum for Manhattan.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson19_2_1.number}: ${lesson19_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson19_2_1.id,
        number: 1,
        title: "Implement Euclidean Distance",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Implement euclidean_distance for any number of dimensions. Test with 2D and 3D points.",
        starterCode: "import math\n\ndef euclidean_distance(point1, point2):\n    squared_sum = 0\n    for i in range(len(point1)):\n        diff = point1[i] - point2[i]\n        squared_sum += diff ** 2\n    return math.sqrt(squared_sum)\n\n# Test 2D\na = (0, 0)\nb = (3, 4)\nprint(f'2D: {a} to {b}')\nprint(f'Distance: {euclidean_distance(a, b)}')\n\n# Test 3D\nc = (1, 2, 3)\nd = (4, 6, 3)\nprint(f'\\n3D: {c} to {d}')\nprint(f'Distance: {euclidean_distance(c, d)}')",
        solution: "import math\n\ndef euclidean_distance(point1, point2):\n    squared_sum = 0\n    for i in range(len(point1)):\n        diff = point1[i] - point2[i]\n        squared_sum += diff ** 2\n    return math.sqrt(squared_sum)\n\na = (0, 0)\nb = (3, 4)\nprint(f'2D: {a} to {b}')\nprint(f'Distance: {euclidean_distance(a, b)}')\n\nc = (1, 2, 3)\nd = (4, 6, 3)\nprint(f'\\n3D: {c} to {d}')\nprint(f'Distance: {euclidean_distance(c, d)}')\n\nprint('\\nWorks for any number of dimensions!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "5.0 and 5.0", description: "Euclidean implemented" }]),
        hints: ["Sum squared differences", "Take square root", "Works for any dimensions"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson19_2_1.id,
        number: 2,
        title: "Implement Manhattan Distance",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Implement manhattan_distance. Compare with Euclidean for same points.",
        starterCode: "import math\n\ndef euclidean_distance(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef manhattan_distance(p1, p2):\n    total = 0\n    for i in range(len(p1)):\n        total += abs(p1[i] - p2[i])\n    return total\n\n# Compare\na = (0, 0)\nb = (3, 4)\n\nprint(f'Points: {a} to {b}')\nprint(f'Euclidean: {euclidean_distance(a, b)}')\nprint(f'Manhattan: {manhattan_distance(a, b)}')\nprint(f'\\nManhattan is larger (going around corners)')",
        solution: "import math\n\ndef euclidean_distance(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef manhattan_distance(p1, p2):\n    total = 0\n    for i in range(len(p1)):\n        total += abs(p1[i] - p2[i])\n    return total\n\na = (0, 0)\nb = (3, 4)\n\nprint(f'Points: {a} to {b}')\nprint(f'Euclidean: {euclidean_distance(a, b)}')\nprint(f'Manhattan: {manhattan_distance(a, b)}')\nprint(f'\\nManhattan is larger (going around corners)')\nprint('Euclidean: straight line = 5')\nprint('Manhattan: 3 right + 4 up = 7')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Euclidean 5, Manhattan 7", description: "Manhattan implemented" }]),
        hints: ["Sum absolute differences", "No square root needed", "Always >= Euclidean"],
        xpReward: 10,
        order: 2,
      },
      {
        lessonId: lesson19_2_1.id,
        number: 3,
        title: "Find Nearest Point",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Given a target point and list of candidates, find the nearest one using Euclidean distance.",
        starterCode: "import math\n\ndef euclidean_distance(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef find_nearest(target, candidates):\n    nearest = None\n    min_dist = float('inf')\n    \n    for candidate in candidates:\n        dist = euclidean_distance(target, candidate)\n        if dist < min_dist:\n            min_dist = dist\n            nearest = candidate\n    \n    return nearest, min_dist\n\n# Test\ntarget = (5, 5)\ncandidates = [(1, 1), (3, 3), (4, 6), (8, 8), (6, 4)]\n\nprint(f'Target: {target}')\nprint(f'Candidates: {candidates}')\n\nnearest, dist = find_nearest(target, candidates)\nprint(f'\\nNearest: {nearest}')\nprint(f'Distance: {dist:.2f}')",
        solution: "import math\n\ndef euclidean_distance(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef find_nearest(target, candidates):\n    nearest = None\n    min_dist = float('inf')\n    \n    for candidate in candidates:\n        dist = euclidean_distance(target, candidate)\n        if dist < min_dist:\n            min_dist = dist\n            nearest = candidate\n    \n    return nearest, min_dist\n\ntarget = (5, 5)\ncandidates = [(1, 1), (3, 3), (4, 6), (8, 8), (6, 4)]\n\nprint(f'Target: {target}')\nprint(f'Candidates: {candidates}')\n\nnearest, dist = find_nearest(target, candidates)\nprint(f'\\nNearest: {nearest}')\nprint(f'Distance: {dist:.2f}')\n\nprint('\\nDistances to all:')\nfor c in candidates:\n    d = euclidean_distance(target, c)\n    marker = ' ← nearest' if c == nearest else ''\n    print(f'  {c}: {d:.2f}{marker}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Nearest point found", description: "Find nearest" }]),
        hints: ["Track minimum distance", "Update when smaller found", "Return point and distance"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson19_2_1.id,
        number: 4,
        title: "Impact of Feature Scaling",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Show how unscaled features distort distances. Age (20-60) vs Salary (30000-100000).",
        starterCode: "import math\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\n# Person data: (age, salary)\nperson_a = (30, 50000)\nperson_b = (35, 52000)\nperson_c = (31, 80000)\n\nprint('Without Scaling')\nprint('=' * 40)\nprint(f'A: age={person_a[0]}, salary=${person_a[1]:,}')\nprint(f'B: age={person_b[0]}, salary=${person_b[1]:,}')\nprint(f'C: age={person_c[0]}, salary=${person_c[1]:,}')\n\nprint(f'\\nDistance A to B: {euclidean(person_a, person_b):.0f}')\nprint(f'Distance A to C: {euclidean(person_a, person_c):.0f}')\nprint('\\nSalary dominates! B seems far from A.')\n\n# Scale to 0-1\ndef scale(val, min_v, max_v):\n    return (val - min_v) / (max_v - min_v)\n\nage_min, age_max = 20, 60\nsal_min, sal_max = 30000, 100000\n\na_scaled = (scale(30, age_min, age_max), scale(50000, sal_min, sal_max))\nb_scaled = (scale(35, age_min, age_max), scale(52000, sal_min, sal_max))\nc_scaled = (scale(31, age_min, age_max), scale(80000, sal_min, sal_max))\n\nprint('\\nWith Scaling (0-1)')\nprint('=' * 40)\nprint(f'Distance A to B: {euclidean(a_scaled, b_scaled):.3f}')\nprint(f'Distance A to C: {euclidean(a_scaled, c_scaled):.3f}')\nprint('\\nNow age and salary contribute equally!')",
        solution: "import math\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\nperson_a = (30, 50000)\nperson_b = (35, 52000)\nperson_c = (31, 80000)\n\nprint('Without Scaling')\nprint('=' * 40)\nprint(f'A: age={person_a[0]}, salary=${person_a[1]:,}')\nprint(f'B: age={person_b[0]}, salary=${person_b[1]:,}')\nprint(f'C: age={person_c[0]}, salary=${person_c[1]:,}')\n\nprint(f'\\nDistance A to B: {euclidean(person_a, person_b):.0f}')\nprint(f'Distance A to C: {euclidean(person_a, person_c):.0f}')\nprint('\\nSalary dominates! B seems far from A.')\n\ndef scale(val, min_v, max_v):\n    return (val - min_v) / (max_v - min_v)\n\nage_min, age_max = 20, 60\nsal_min, sal_max = 30000, 100000\n\na_scaled = (scale(30, age_min, age_max), scale(50000, sal_min, sal_max))\nb_scaled = (scale(35, age_min, age_max), scale(52000, sal_min, sal_max))\nc_scaled = (scale(31, age_min, age_max), scale(80000, sal_min, sal_max))\n\nprint('\\nWith Scaling (0-1)')\nprint('=' * 40)\nprint(f'Distance A to B: {euclidean(a_scaled, b_scaled):.3f}')\nprint(f'Distance A to C: {euclidean(a_scaled, c_scaled):.3f}')\nprint('\\nNow age and salary contribute equally!')\nprint('ALWAYS scale features before distance calculations!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Scaling changes nearest neighbor", description: "Scaling impact" }]),
        hints: ["Salary range >> age range", "Large values dominate distance", "Scaling equalizes features"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson19_2_1.id,
        number: 5,
        title: "Find K Nearest Neighbors",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Find the K nearest points to a target. This is the foundation of KNN!",
        starterCode: "import math\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef find_k_nearest(target, candidates, k):\n    # Calculate all distances\n    distances = []\n    for candidate in candidates:\n        dist = euclidean(target, candidate)\n        distances.append((dist, candidate))\n    \n    # Sort by distance\n    distances.sort(key=lambda x: x[0])\n    \n    # Return K nearest\n    return distances[:k]\n\n# Test\ntarget = (5, 5)\ncandidates = [(1, 1), (3, 4), (6, 6), (8, 2), (4, 5), (7, 7), (2, 3)]\n\nprint(f'Target: {target}')\nprint(f'Find 3 nearest neighbors\\n')\n\nk_nearest = find_k_nearest(target, candidates, k=3)\n\nprint('K=3 Nearest Neighbors:')\nfor dist, point in k_nearest:\n    print(f'  {point} - distance: {dist:.2f}')\n\nprint('\\nThis is the core of KNN algorithm!')",
        solution: "import math\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef find_k_nearest(target, candidates, k):\n    distances = []\n    for candidate in candidates:\n        dist = euclidean(target, candidate)\n        distances.append((dist, candidate))\n    \n    distances.sort(key=lambda x: x[0])\n    \n    return distances[:k]\n\ntarget = (5, 5)\ncandidates = [(1, 1), (3, 4), (6, 6), (8, 2), (4, 5), (7, 7), (2, 3)]\n\nprint(f'Target: {target}')\nprint(f'Find 3 nearest neighbors\\n')\n\nk_nearest = find_k_nearest(target, candidates, k=3)\n\nprint('K=3 Nearest Neighbors:')\nfor dist, point in k_nearest:\n    print(f'  {point} - distance: {dist:.2f}')\n\nprint('\\nThis is the core of KNN algorithm!')\nprint('Next: use neighbors\\' labels to classify!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "3 nearest points found", description: "K nearest neighbors" }]),
        hints: ["Compute all distances", "Sort by distance", "Take first K"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 19.2.1`);

  const lesson19_2_2 = await prisma.lesson.upsert({
    where: { slug: "knn-algorithm" },
    update: {},
    create: {
      sectionId: section19_2.id,
      number: 19.22,
      title: "K-Nearest Neighbors Algorithm",
      slug: "knn-algorithm",
      objectives: [
        "Understand the KNN classification algorithm",
        "Implement KNN from scratch",
        "Apply KNN to classification problems",
        "Understand majority voting",
      ],
      content: `# K-Nearest Neighbors Algorithm

## The Idea

**"Similar things are near each other"**

To classify a new point:
1. Find K nearest neighbors in training data
2. Take majority vote of their labels
3. Assign that label to the new point

## The Algorithm

\`\`\`
INPUT:
  - Training data: [(features, label), ...]
  - New point: features to classify
  - K: number of neighbors

PROCESS:
  1. Calculate distance to ALL training points
  2. Sort by distance (closest first)
  3. Take top K nearest neighbors
  4. Count labels among K neighbors
  5. Return most common label (majority vote)

OUTPUT: Predicted label
\`\`\`

## Example

Classify new flower with petal_length=4.8, petal_width=1.6

K=3 nearest neighbors:
- Neighbor 1: versicolor (dist=0.2)
- Neighbor 2: versicolor (dist=0.3)
- Neighbor 3: virginica (dist=0.5)

Vote: versicolor=2, virginica=1
**Prediction: versicolor** (majority wins!)

## Properties

**Advantages:**
- Simple to understand
- No training phase (lazy learning)
- Works for multi-class problems

**Disadvantages:**
- Slow prediction (calculate all distances)
- Memory intensive (stores all training data)
- Sensitive to feature scaling`,
      codeExamples: JSON.stringify([
        {
          id: "knn-1d",
          title: "KNN in 1D",
          code: "def knn_classify_1d(training, new_point, k=3):\n    \"\"\"KNN for 1D data\"\"\"\n    # Calculate distances\n    distances = []\n    for value, label in training:\n        dist = abs(new_point - value)\n        distances.append((dist, label))\n    \n    # Sort by distance\n    distances.sort(key=lambda x: x[0])\n    \n    # Take K nearest\n    k_nearest = distances[:k]\n    \n    # Majority vote\n    votes = {}\n    for dist, label in k_nearest:\n        votes[label] = votes.get(label, 0) + 1\n    \n    # Return most common\n    return max(votes, key=votes.get)\n\n# Training data: (height_cm, category)\ntraining = [\n    (150, 'short'), (155, 'short'), (160, 'short'),\n    (170, 'medium'), (175, 'medium'),\n    (185, 'tall'), (190, 'tall'), (195, 'tall'),\n]\n\nprint('KNN 1D Classification')\nprint('=' * 40)\nfor height in [152, 168, 188]:\n    prediction = knn_classify_1d(training, height, k=3)\n    print(f'Height {height}cm → {prediction}')",
          description: "Simple 1D KNN classification",
        },
        {
          id: "knn-2d",
          title: "KNN in 2D (Full Implementation)",
          code: "import math\n\ndef euclidean_distance(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn_classify(training, new_point, k=3):\n    \"\"\"KNN for multi-dimensional data\"\"\"\n    # Calculate distances to all training points\n    distances = []\n    for features, label in training:\n        dist = euclidean_distance(new_point, features)\n        distances.append((dist, label, features))\n    \n    # Sort by distance\n    distances.sort(key=lambda x: x[0])\n    \n    # Take K nearest neighbors\n    k_nearest = distances[:k]\n    \n    # Majority vote\n    votes = {}\n    for dist, label, _ in k_nearest:\n        votes[label] = votes.get(label, 0) + 1\n    \n    return max(votes, key=votes.get), k_nearest\n\n# Flower data: ((petal_length, petal_width), species)\nflowers = [\n    ((1.4, 0.2), 'setosa'), ((1.5, 0.3), 'setosa'), ((1.3, 0.2), 'setosa'),\n    ((4.5, 1.5), 'versicolor'), ((4.7, 1.4), 'versicolor'), ((4.2, 1.3), 'versicolor'),\n    ((5.5, 2.1), 'virginica'), ((5.8, 2.3), 'virginica'), ((5.2, 2.0), 'virginica'),\n]\n\nnew_flower = (4.8, 1.6)\nprediction, neighbors = knn_classify(flowers, new_flower, k=3)\n\nprint('KNN 2D Classification')\nprint('=' * 40)\nprint(f'New flower: petal_length={new_flower[0]}, width={new_flower[1]}')\nprint(f'\\nK=3 Nearest Neighbors:')\nfor dist, label, features in neighbors:\n    print(f'  {features} → {label} (dist={dist:.2f})')\nprint(f'\\nPrediction: {prediction}')",
          description: "Complete 2D KNN implementation",
        },
        {
          id: "knn-with-trace",
          title: "KNN with Detailed Trace",
          code: "import math\n\ndef knn_classify_verbose(training, new_point, k=3):\n    print(f'Classifying point: {new_point}')\n    print(f'Using K={k}\\n')\n    \n    # Step 1: Calculate all distances\n    print('Step 1: Calculate distances')\n    distances = []\n    for features, label in training:\n        dist = math.sqrt(sum((a-b)**2 for a, b in zip(new_point, features)))\n        distances.append((dist, label, features))\n        print(f'  {features} ({label}): {dist:.2f}')\n    \n    # Step 2: Sort\n    print('\\nStep 2: Sort by distance')\n    distances.sort(key=lambda x: x[0])\n    for i, (dist, label, features) in enumerate(distances):\n        marker = ' ← neighbor' if i < k else ''\n        print(f'  {i+1}. {features} ({label}): {dist:.2f}{marker}')\n    \n    # Step 3: K nearest\n    k_nearest = distances[:k]\n    \n    # Step 4: Vote\n    print(f'\\nStep 3: Majority vote among K={k} nearest')\n    votes = {}\n    for dist, label, _ in k_nearest:\n        votes[label] = votes.get(label, 0) + 1\n    for label, count in votes.items():\n        print(f'  {label}: {count} vote(s)')\n    \n    winner = max(votes, key=votes.get)\n    print(f'\\nPrediction: {winner}')\n    return winner\n\ntraining = [\n    ((1, 1), 'A'), ((2, 1), 'A'), ((1, 2), 'A'),\n    ((5, 5), 'B'), ((6, 5), 'B'), ((5, 6), 'B'),\n]\n\nknn_classify_verbose(training, (2, 2), k=3)",
          description: "See every step of KNN",
        },
      ]),
      keyPoints: [
        "KNN: find K nearest, take majority vote",
        "No explicit training (lazy learning)",
        "K is a hyperparameter we choose",
        "Odd K avoids ties",
        "Must scale features first",
        "Simple but effective for many problems",
      ],
      hardwareDemo: "Watch distance calculations, sorting, and vote counting in real-time.",
      estimatedTime: 35,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson19_2_2.number}: ${lesson19_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson19_2_2.id,
        number: 1,
        title: "KNN from Scratch (1D)",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement KNN for 1D classification. Classify test heights using K=3.",
        starterCode: "def knn_1d(training, test_point, k=3):\n    # Calculate distances\n    distances = []\n    for value, label in training:\n        dist = abs(test_point - value)\n        distances.append((dist, label))\n    \n    # Sort by distance\n    distances.sort(key=lambda x: x[0])\n    \n    # Take K nearest\n    k_nearest = distances[:k]\n    \n    # Count votes\n    votes = {}\n    for dist, label in k_nearest:\n        votes[label] = votes.get(label, 0) + 1\n    \n    # Return winner\n    return max(votes, key=votes.get)\n\n# Training data\ntraining = [\n    (150, 'short'), (155, 'short'), (158, 'short'),\n    (165, 'medium'), (170, 'medium'), (172, 'medium'),\n    (180, 'tall'), (185, 'tall'), (190, 'tall'),\n]\n\n# Test\ntest_heights = [152, 167, 178, 188]\nfor h in test_heights:\n    prediction = knn_1d(training, h, k=3)\n    print(f'Height {h}cm → {prediction}')",
        solution: "def knn_1d(training, test_point, k=3):\n    distances = []\n    for value, label in training:\n        dist = abs(test_point - value)\n        distances.append((dist, label))\n    \n    distances.sort(key=lambda x: x[0])\n    k_nearest = distances[:k]\n    \n    votes = {}\n    for dist, label in k_nearest:\n        votes[label] = votes.get(label, 0) + 1\n    \n    return max(votes, key=votes.get)\n\ntraining = [\n    (150, 'short'), (155, 'short'), (158, 'short'),\n    (165, 'medium'), (170, 'medium'), (172, 'medium'),\n    (180, 'tall'), (185, 'tall'), (190, 'tall'),\n]\n\ntest_heights = [152, 167, 178, 188]\nfor h in test_heights:\n    prediction = knn_1d(training, h, k=3)\n    print(f'Height {h}cm → {prediction}')\n\nprint('\\nKNN classifies based on nearest neighbors!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Heights classified", description: "1D KNN" }]),
        hints: ["Distance in 1D is |a - b|", "Sort distances ascending", "Count labels in top K"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson19_2_2.id,
        number: 2,
        title: "KNN for 2D Data",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement KNN for 2D flower classification. Use Euclidean distance.",
        starterCode: "import math\n\ndef euclidean(p1, p2):\n    return math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)\n\ndef knn_2d(training, test_point, k=3):\n    distances = []\n    for features, label in training:\n        dist = euclidean(test_point, features)\n        distances.append((dist, label))\n    \n    distances.sort(key=lambda x: x[0])\n    k_nearest = distances[:k]\n    \n    votes = {}\n    for dist, label in k_nearest:\n        votes[label] = votes.get(label, 0) + 1\n    \n    return max(votes, key=votes.get)\n\n# Flowers: ((petal_length, petal_width), species)\nflowers = [\n    ((1.4, 0.2), 'setosa'), ((1.5, 0.3), 'setosa'),\n    ((4.5, 1.5), 'versicolor'), ((4.7, 1.4), 'versicolor'),\n    ((5.5, 2.1), 'virginica'), ((5.8, 2.3), 'virginica'),\n]\n\ntest_flowers = [(1.6, 0.3), (4.8, 1.6), (5.6, 2.2)]\nfor flower in test_flowers:\n    prediction = knn_2d(flowers, flower, k=3)\n    print(f'Flower {flower} → {prediction}')",
        solution: "import math\n\ndef euclidean(p1, p2):\n    return math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)\n\ndef knn_2d(training, test_point, k=3):\n    distances = []\n    for features, label in training:\n        dist = euclidean(test_point, features)\n        distances.append((dist, label))\n    \n    distances.sort(key=lambda x: x[0])\n    k_nearest = distances[:k]\n    \n    votes = {}\n    for dist, label in k_nearest:\n        votes[label] = votes.get(label, 0) + 1\n    \n    return max(votes, key=votes.get)\n\nflowers = [\n    ((1.4, 0.2), 'setosa'), ((1.5, 0.3), 'setosa'),\n    ((4.5, 1.5), 'versicolor'), ((4.7, 1.4), 'versicolor'),\n    ((5.5, 2.1), 'virginica'), ((5.8, 2.3), 'virginica'),\n]\n\ntest_flowers = [(1.6, 0.3), (4.8, 1.6), (5.6, 2.2)]\nfor flower in test_flowers:\n    prediction = knn_2d(flowers, flower, k=3)\n    print(f'Flower {flower} → {prediction}')\n\nprint('\\n2D KNN uses Euclidean distance!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Flowers classified", description: "2D KNN" }]),
        hints: ["Use Euclidean distance", "Same algorithm as 1D", "Works for any dimensions"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson19_2_2.id,
        number: 3,
        title: "KNN with Train/Test Evaluation",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement KNN, split data 80/20, and calculate test accuracy.",
        starterCode: "import math\nimport random\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn_classify(training, point, k=3):\n    distances = [(euclidean(point, f), l) for f, l in training]\n    distances.sort()\n    votes = {}\n    for dist, label in distances[:k]:\n        votes[label] = votes.get(label, 0) + 1\n    return max(votes, key=votes.get)\n\n# Dataset\ndata = [\n    ((1, 1), 'A'), ((1, 2), 'A'), ((2, 1), 'A'), ((2, 2), 'A'),\n    ((5, 5), 'B'), ((5, 6), 'B'), ((6, 5), 'B'), ((6, 6), 'B'),\n    ((1, 5), 'C'), ((1, 6), 'C'), ((2, 5), 'C'), ((2, 6), 'C'),\n]\n\n# Split\nrandom.seed(42)\nshuffled = data.copy()\nrandom.shuffle(shuffled)\nsplit = int(len(shuffled) * 0.75)\ntrain, test = shuffled[:split], shuffled[split:]\n\nprint(f'Train: {len(train)}, Test: {len(test)}')\n\n# Evaluate\ncorrect = 0\nfor features, true_label in test:\n    pred = knn_classify(train, features, k=3)\n    status = '✓' if pred == true_label else '✗'\n    print(f'  {features} → Pred: {pred}, True: {true_label} {status}')\n    if pred == true_label:\n        correct += 1\n\nprint(f'\\nAccuracy: {correct}/{len(test)} = {correct/len(test)*100:.0f}%')",
        solution: "import math\nimport random\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn_classify(training, point, k=3):\n    distances = [(euclidean(point, f), l) for f, l in training]\n    distances.sort()\n    votes = {}\n    for dist, label in distances[:k]:\n        votes[label] = votes.get(label, 0) + 1\n    return max(votes, key=votes.get)\n\ndata = [\n    ((1, 1), 'A'), ((1, 2), 'A'), ((2, 1), 'A'), ((2, 2), 'A'),\n    ((5, 5), 'B'), ((5, 6), 'B'), ((6, 5), 'B'), ((6, 6), 'B'),\n    ((1, 5), 'C'), ((1, 6), 'C'), ((2, 5), 'C'), ((2, 6), 'C'),\n]\n\nrandom.seed(42)\nshuffled = data.copy()\nrandom.shuffle(shuffled)\nsplit = int(len(shuffled) * 0.75)\ntrain, test = shuffled[:split], shuffled[split:]\n\nprint(f'Train: {len(train)}, Test: {len(test)}')\n\ncorrect = 0\nfor features, true_label in test:\n    pred = knn_classify(train, features, k=3)\n    status = '✓' if pred == true_label else '✗'\n    print(f'  {features} → Pred: {pred}, True: {true_label} {status}')\n    if pred == true_label:\n        correct += 1\n\nprint(f'\\nAccuracy: {correct}/{len(test)} = {correct/len(test)*100:.0f}%')\nprint('\\nProper ML workflow: split → train → evaluate!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Accuracy calculated", description: "KNN evaluation" }]),
        hints: ["Split before training", "Train on train set", "Evaluate on test set"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson19_2_2.id,
        number: 4,
        title: "KNN for Regression",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Adapt KNN for regression: predict house price as average of K nearest neighbors' prices.",
        starterCode: "import math\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn_regress(training, point, k=3):\n    \"\"\"KNN for regression - return average of neighbors' values\"\"\"\n    distances = []\n    for features, value in training:\n        dist = euclidean(point, features)\n        distances.append((dist, value))\n    \n    distances.sort(key=lambda x: x[0])\n    k_nearest = distances[:k]\n    \n    # Average instead of vote!\n    total = sum(val for dist, val in k_nearest)\n    return total / k\n\n# Houses: ((sqft, bedrooms), price)\nhouses = [\n    ((1000, 2), 200000),\n    ((1200, 2), 230000),\n    ((1500, 3), 300000),\n    ((1800, 3), 350000),\n    ((2000, 4), 400000),\n    ((2200, 4), 450000),\n]\n\nprint('KNN Regression for House Prices')\nprint('=' * 40)\n\ntest_houses = [(1100, 2), (1600, 3), (2100, 4)]\nfor h in test_houses:\n    pred_price = knn_regress(houses, h, k=2)\n    print(f'House {h[0]}sqft, {h[1]}bed → ${pred_price:,.0f}')",
        solution: "import math\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn_regress(training, point, k=3):\n    distances = []\n    for features, value in training:\n        dist = euclidean(point, features)\n        distances.append((dist, value))\n    \n    distances.sort(key=lambda x: x[0])\n    k_nearest = distances[:k]\n    \n    total = sum(val for dist, val in k_nearest)\n    return total / k\n\nhouses = [\n    ((1000, 2), 200000),\n    ((1200, 2), 230000),\n    ((1500, 3), 300000),\n    ((1800, 3), 350000),\n    ((2000, 4), 400000),\n    ((2200, 4), 450000),\n]\n\nprint('KNN Regression for House Prices')\nprint('=' * 40)\n\ntest_houses = [(1100, 2), (1600, 3), (2100, 4)]\nfor h in test_houses:\n    pred_price = knn_regress(houses, h, k=2)\n    print(f'House {h[0]}sqft, {h[1]}bed → ${pred_price:,.0f}')\n\nprint('\\nRegression: average neighbors\\' values')\nprint('Classification: vote on neighbors\\' labels')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "House prices predicted", description: "KNN regression" }]),
        hints: ["Same as classification but average values", "No voting needed", "Output is continuous"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson19_2_2.id,
        number: 5,
        title: "Weighted KNN",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement weighted KNN where closer neighbors have more influence (weight = 1/distance).",
        starterCode: "import math\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef weighted_knn(training, point, k=3):\n    \"\"\"Weighted KNN - closer neighbors count more\"\"\"\n    distances = []\n    for features, label in training:\n        dist = euclidean(point, features)\n        distances.append((dist, label))\n    \n    distances.sort(key=lambda x: x[0])\n    k_nearest = distances[:k]\n    \n    # Weighted votes (weight = 1/distance)\n    weighted_votes = {}\n    for dist, label in k_nearest:\n        weight = 1 / (dist + 0.001)  # Add small value to avoid division by 0\n        weighted_votes[label] = weighted_votes.get(label, 0) + weight\n    \n    return max(weighted_votes, key=weighted_votes.get), weighted_votes\n\n# Training data\ntraining = [\n    ((1, 1), 'A'), ((2, 2), 'A'),\n    ((5, 5), 'B'), ((4, 4), 'B'),\n]\n\n# Test point near boundary\ntest_point = (3, 3)\n\nprint('Weighted vs Unweighted KNN')\nprint('=' * 40)\nprint(f'Test point: {test_point}')\n\n# Weighted\npred, weights = weighted_knn(training, test_point, k=4)\nprint(f'\\nWeighted votes:')\nfor label, weight in weights.items():\n    print(f'  {label}: {weight:.2f}')\nprint(f'Weighted prediction: {pred}')",
        solution: "import math\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef weighted_knn(training, point, k=3):\n    distances = []\n    for features, label in training:\n        dist = euclidean(point, features)\n        distances.append((dist, label))\n    \n    distances.sort(key=lambda x: x[0])\n    k_nearest = distances[:k]\n    \n    weighted_votes = {}\n    for dist, label in k_nearest:\n        weight = 1 / (dist + 0.001)\n        weighted_votes[label] = weighted_votes.get(label, 0) + weight\n    \n    return max(weighted_votes, key=weighted_votes.get), weighted_votes\n\ntraining = [\n    ((1, 1), 'A'), ((2, 2), 'A'),\n    ((5, 5), 'B'), ((4, 4), 'B'),\n]\n\ntest_point = (3, 3)\n\nprint('Weighted vs Unweighted KNN')\nprint('=' * 40)\nprint(f'Test point: {test_point}')\n\npred, weights = weighted_knn(training, test_point, k=4)\nprint(f'\\nWeighted votes:')\nfor label, weight in weights.items():\n    print(f'  {label}: {weight:.2f}')\nprint(f'Weighted prediction: {pred}')\n\nprint('\\nCloser neighbors have more influence!')\nprint('Weight = 1/distance')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Weighted prediction made", description: "Weighted KNN" }]),
        hints: ["Weight = 1/distance", "Closer = higher weight", "Sum weights per class"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 19.2.2`);

  const lesson19_2_3 = await prisma.lesson.upsert({
    where: { slug: "choosing-k-knn-limitations" },
    update: {},
    create: {
      sectionId: section19_2.id,
      number: 19.23,
      title: "Choosing K and KNN Limitations",
      slug: "choosing-k-knn-limitations",
      objectives: [
        "Understand how K affects predictions",
        "Choose appropriate K values",
        "Recognize KNN limitations",
        "Know when to use KNN",
      ],
      content: `# Choosing K and KNN Limitations

## How K Affects Predictions

### Small K (K=1)
- Very sensitive to noise
- Overfits to training data
- Wiggly decision boundary
- Single outlier can cause errors

### Large K
- Smoother decisions
- May underfit
- Ignores local patterns
- Extreme: K=N predicts majority class always

## Guidelines for Choosing K

1. **Start with K = √n** (square root of training size)
2. **Use odd K** to avoid ties
3. **Try K = 3, 5, 7, 9** and compare accuracy
4. **Cross-validation** to find best K

## KNN Limitations

### 1. Slow Prediction
Must calculate distance to ALL training points.
- 1 million training points = 1 million calculations per prediction!

### 2. Memory Intensive
Stores entire training dataset.
- No "model" to save - just raw data

### 3. Curse of Dimensionality
In high dimensions, "distance" becomes meaningless.
- All points become equally far apart!
- Generally: use < 20 features

### 4. Feature Scaling Required
Unscaled features distort distances.
- Always normalize/standardize first!

## When to Use KNN

**Good for:**
- Small to medium datasets
- Few features (< 20)
- When interpretability matters
- Quick prototyping

**Avoid for:**
- Large datasets (slow)
- High-dimensional data
- Real-time predictions needed`,
      codeExamples: JSON.stringify([
        {
          id: "k-comparison",
          title: "Effect of K on Predictions",
          code: "import math\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn(training, point, k):\n    distances = [(euclidean(point, f), l) for f, l in training]\n    distances.sort()\n    votes = {}\n    for dist, label in distances[:k]:\n        votes[label] = votes.get(label, 0) + 1\n    return max(votes, key=votes.get)\n\n# Training data with some noise\ntraining = [\n    ((1, 1), 'A'), ((1, 2), 'A'), ((2, 1), 'A'),\n    ((2, 2), 'B'),  # Noise! Outlier in A region\n    ((5, 5), 'B'), ((5, 6), 'B'), ((6, 5), 'B'), ((6, 6), 'B'),\n]\n\ntest_point = (1.5, 1.5)  # Clearly in A region, but near outlier\n\nprint('Effect of K on noisy data')\nprint('=' * 40)\nprint(f'Test point: {test_point}')\nprint('(1.5, 1.5) is in the A region, but (2,2) is a B outlier)\\n')\n\nfor k in [1, 3, 5, 7]:\n    pred = knn(training, test_point, k)\n    print(f'K={k}: Prediction = {pred}')\n\nprint('\\nK=1 might pick the outlier!')\nprint('Larger K is more robust to noise.')",
          description: "See how K changes predictions",
        },
        {
          id: "find-best-k",
          title: "Finding Optimal K",
          code: "import math\nimport random\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn(training, point, k):\n    distances = [(euclidean(point, f), l) for f, l in training]\n    distances.sort()\n    votes = {}\n    for dist, label in distances[:k]:\n        votes[label] = votes.get(label, 0) + 1\n    return max(votes, key=votes.get)\n\ndef evaluate(train, test, k):\n    correct = sum(1 for f, l in test if knn(train, f, k) == l)\n    return correct / len(test)\n\n# Generate data\nrandom.seed(42)\ndata = []\nfor _ in range(30):\n    x = random.gauss(2, 1)\n    y = random.gauss(2, 1)\n    data.append(((x, y), 'A'))\nfor _ in range(30):\n    x = random.gauss(5, 1)\n    y = random.gauss(5, 1)\n    data.append(((x, y), 'B'))\n\nrandom.shuffle(data)\ntrain, test = data[:48], data[48:]\n\nprint('Finding Optimal K')\nprint('=' * 40)\nprint(f'Train: {len(train)}, Test: {len(test)}')\nprint(f'\\n{\"K\":>4} {\"Accuracy\":>10}')\nprint('-' * 20)\n\nbest_k, best_acc = 1, 0\nfor k in [1, 3, 5, 7, 9, 11]:\n    acc = evaluate(train, test, k)\n    marker = ' ← best' if acc > best_acc else ''\n    if acc > best_acc:\n        best_k, best_acc = k, acc\n    print(f'{k:>4} {acc*100:>9.1f}%{marker}')\n\nprint(f'\\nBest K = {best_k} with {best_acc*100:.1f}% accuracy')",
          description: "Test different K values to find best",
        },
        {
          id: "knn-limitations",
          title: "KNN Limitations Demo",
          code: "import math\nimport time\n\n# Limitation 1: Slow with large data\nprint('Limitation 1: Prediction Speed')\nprint('=' * 40)\n\ndef knn_timed(training, point, k=3):\n    distances = []\n    for f, l in training:\n        dist = math.sqrt(sum((a-b)**2 for a, b in zip(point, f)))\n        distances.append((dist, l))\n    distances.sort()\n    return distances[0][1]\n\nfor n in [100, 1000, 5000]:\n    # Create dummy data\n    training = [((i, i), 'A') for i in range(n)]\n    point = (0, 0)\n    \n    start = time.time()\n    for _ in range(10):  # 10 predictions\n        knn_timed(training, point, 3)\n    elapsed = time.time() - start\n    \n    print(f'  {n:5} training points: {elapsed*100:.1f}ms per prediction')\n\nprint('\\nLimitation 2: Memory Usage')\nprint('=' * 40)\nimport sys\nsmall_data = [((i, i), 'A') for i in range(100)]\nlarge_data = [((i, i), 'A') for i in range(10000)]\nprint(f'  100 points: ~{sys.getsizeof(small_data)} bytes')\nprint(f'  10000 points: ~{sys.getsizeof(large_data)} bytes')\nprint('  KNN must store ALL training data!')\n\nprint('\\nLimitation 3: Curse of Dimensionality')\nprint('=' * 40)\nprint('  In high dimensions, all points are far apart.')\nprint('  \"Nearest\" neighbor may not be meaningful.')\nprint('  Rule of thumb: Keep features < 20')",
          description: "See KNN limitations in practice",
        },
      ]),
      keyPoints: [
        "Small K: sensitive to noise, may overfit",
        "Large K: smoother but may underfit",
        "Try K = 3, 5, 7 and use cross-validation",
        "Use odd K to avoid ties",
        "KNN is slow for large datasets",
        "Scale features before using KNN",
      ],
      hardwareDemo: "Watch prediction time grow with data size. See different K values change boundaries.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson19_2_3.number}: ${lesson19_2_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson19_2_3.id,
        number: 1,
        title: "Compare Different K Values",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Test K=1,3,5,7,9 on provided data. Find which K gives best test accuracy.",
        starterCode: "import math\nimport random\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn(training, point, k):\n    distances = [(euclidean(point, f), l) for f, l in training]\n    distances.sort()\n    votes = {}\n    for dist, label in distances[:k]:\n        votes[label] = votes.get(label, 0) + 1\n    return max(votes, key=votes.get)\n\n# Data\nrandom.seed(42)\ndata = ([((random.gauss(2,0.5), random.gauss(2,0.5)), 'A') for _ in range(20)] +\n        [((random.gauss(4,0.5), random.gauss(4,0.5)), 'B') for _ in range(20)])\n\nrandom.shuffle(data)\ntrain, test = data[:32], data[32:]\n\nprint('K Value Comparison')\nprint('=' * 30)\n\nfor k in [1, 3, 5, 7, 9]:\n    correct = sum(1 for f, l in test if knn(train, f, k) == l)\n    acc = correct / len(test) * 100\n    print(f'K={k}: {acc:.1f}% accuracy')",
        solution: "import math\nimport random\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn(training, point, k):\n    distances = [(euclidean(point, f), l) for f, l in training]\n    distances.sort()\n    votes = {}\n    for dist, label in distances[:k]:\n        votes[label] = votes.get(label, 0) + 1\n    return max(votes, key=votes.get)\n\nrandom.seed(42)\ndata = ([((random.gauss(2,0.5), random.gauss(2,0.5)), 'A') for _ in range(20)] +\n        [((random.gauss(4,0.5), random.gauss(4,0.5)), 'B') for _ in range(20)])\n\nrandom.shuffle(data)\ntrain, test = data[:32], data[32:]\n\nprint('K Value Comparison')\nprint('=' * 30)\n\nfor k in [1, 3, 5, 7, 9]:\n    correct = sum(1 for f, l in test if knn(train, f, k) == l)\n    acc = correct / len(test) * 100\n    print(f'K={k}: {acc:.1f}% accuracy')\n\nprint('\\nTry different K values to find best!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Accuracies for each K", description: "K comparison" }]),
        hints: ["Test each K value", "Calculate accuracy on test set", "Compare results"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson19_2_3.id,
        number: 2,
        title: "K=1 vs K=5 on Noisy Data",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show that K=1 is sensitive to noise while K=5 is more robust.",
        starterCode: "import math\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn(training, point, k):\n    distances = [(euclidean(point, f), l) for f, l in training]\n    distances.sort()\n    votes = {}\n    for dist, label in distances[:k]:\n        votes[label] = votes.get(label, 0) + 1\n    return max(votes, key=votes.get)\n\n# Clean data with one outlier\ntraining = [\n    ((1, 1), 'A'), ((1, 2), 'A'), ((2, 1), 'A'), ((2, 2), 'A'),\n    ((1.5, 1.5), 'B'),  # NOISE! Outlier in A region\n    ((5, 5), 'B'), ((5, 6), 'B'), ((6, 5), 'B'), ((6, 6), 'B'),\n]\n\ntest_point = (1.4, 1.4)  # Should be A, but near outlier\n\nprint('Noise Sensitivity: K=1 vs K=5')\nprint('=' * 40)\nprint(f'Test point: {test_point}')\nprint('(Should be A, but there is a B outlier at (1.5, 1.5))\\n')\n\nfor k in [1, 3, 5]:\n    pred = knn(training, test_point, k)\n    print(f'K={k}: Predicts {pred}')\n\nprint('\\nK=1 may be fooled by the outlier!')\nprint('Larger K is more robust.')",
        solution: "import math\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn(training, point, k):\n    distances = [(euclidean(point, f), l) for f, l in training]\n    distances.sort()\n    votes = {}\n    for dist, label in distances[:k]:\n        votes[label] = votes.get(label, 0) + 1\n    return max(votes, key=votes.get)\n\ntraining = [\n    ((1, 1), 'A'), ((1, 2), 'A'), ((2, 1), 'A'), ((2, 2), 'A'),\n    ((1.5, 1.5), 'B'),\n    ((5, 5), 'B'), ((5, 6), 'B'), ((6, 5), 'B'), ((6, 6), 'B'),\n]\n\ntest_point = (1.4, 1.4)\n\nprint('Noise Sensitivity: K=1 vs K=5')\nprint('=' * 40)\nprint(f'Test point: {test_point}')\nprint('(Should be A, but there is a B outlier at (1.5, 1.5))\\n')\n\nfor k in [1, 3, 5]:\n    pred = knn(training, test_point, k)\n    print(f'K={k}: Predicts {pred}')\n\nprint('\\nK=1 may be fooled by the outlier!')\nprint('Larger K is more robust.')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "K=1 wrong, K=5 correct", description: "Noise sensitivity" }]),
        hints: ["K=1 picks single nearest", "Outlier can mislead K=1", "Larger K averages out noise"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson19_2_3.id,
        number: 3,
        title: "Square Root Rule for K",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement the √n rule: K ≈ square root of training size. Test if it works well.",
        starterCode: "import math\nimport random\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn(training, point, k):\n    distances = [(euclidean(point, f), l) for f, l in training]\n    distances.sort()\n    votes = {}\n    for dist, label in distances[:k]:\n        votes[label] = votes.get(label, 0) + 1\n    return max(votes, key=votes.get)\n\ndef evaluate(train, test, k):\n    return sum(1 for f, l in test if knn(train, f, k) == l) / len(test)\n\n# Generate data\nrandom.seed(42)\ndata = ([((random.gauss(2,1), random.gauss(2,1)), 'A') for _ in range(50)] +\n        [((random.gauss(5,1), random.gauss(5,1)), 'B') for _ in range(50)])\nrandom.shuffle(data)\ntrain, test = data[:80], data[80:]\n\n# √n rule\nn = len(train)\nk_sqrt = int(math.sqrt(n))\nif k_sqrt % 2 == 0:  # Make odd\n    k_sqrt += 1\n\nprint('Square Root Rule for K')\nprint('=' * 40)\nprint(f'Training size: {n}')\nprint(f'√{n} ≈ {math.sqrt(n):.1f}')\nprint(f'Suggested K: {k_sqrt} (odd)\\n')\n\nprint('Comparing K values:')\nfor k in [1, 3, k_sqrt, 9, 15]:\n    acc = evaluate(train, test, k)\n    marker = ' ← √n rule' if k == k_sqrt else ''\n    print(f'  K={k:2}: {acc*100:.1f}%{marker}')",
        solution: "import math\nimport random\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn(training, point, k):\n    distances = [(euclidean(point, f), l) for f, l in training]\n    distances.sort()\n    votes = {}\n    for dist, label in distances[:k]:\n        votes[label] = votes.get(label, 0) + 1\n    return max(votes, key=votes.get)\n\ndef evaluate(train, test, k):\n    return sum(1 for f, l in test if knn(train, f, k) == l) / len(test)\n\nrandom.seed(42)\ndata = ([((random.gauss(2,1), random.gauss(2,1)), 'A') for _ in range(50)] +\n        [((random.gauss(5,1), random.gauss(5,1)), 'B') for _ in range(50)])\nrandom.shuffle(data)\ntrain, test = data[:80], data[80:]\n\nn = len(train)\nk_sqrt = int(math.sqrt(n))\nif k_sqrt % 2 == 0:\n    k_sqrt += 1\n\nprint('Square Root Rule for K')\nprint('=' * 40)\nprint(f'Training size: {n}')\nprint(f'√{n} ≈ {math.sqrt(n):.1f}')\nprint(f'Suggested K: {k_sqrt} (odd)\\n')\n\nprint('Comparing K values:')\nfor k in [1, 3, k_sqrt, 9, 15]:\n    acc = evaluate(train, test, k)\n    marker = ' ← √n rule' if k == k_sqrt else ''\n    print(f'  K={k:2}: {acc*100:.1f}%{marker}')\n\nprint('\\n√n is a good starting point!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "√n rule tested", description: "Square root rule" }]),
        hints: ["K ≈ √n", "Make K odd", "Compare with other values"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson19_2_3.id,
        number: 4,
        title: "Measure KNN Prediction Time",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Measure how prediction time grows with training set size. Show KNN scales linearly.",
        starterCode: "import math\nimport time\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn(training, point, k=3):\n    distances = [(euclidean(point, f), l) for f, l in training]\n    distances.sort()\n    return distances[0][1]\n\nprint('KNN Prediction Time vs Training Size')\nprint('=' * 45)\nprint(f'{\"N\":>8} {\"Time (ms)\":>12} {\"Scaling\":>10}')\nprint('-' * 45)\n\nprev_time = None\nfor n in [100, 500, 1000, 2000, 5000]:\n    # Create training data\n    training = [((i % 10, i // 10), 'A' if i < n//2 else 'B') for i in range(n)]\n    point = (5, 5)\n    \n    # Time 100 predictions\n    start = time.time()\n    for _ in range(100):\n        knn(training, point, 3)\n    elapsed = (time.time() - start) * 10  # ms per prediction\n    \n    scaling = f'{elapsed/prev_time:.1f}x' if prev_time else '-'\n    print(f'{n:>8} {elapsed:>12.2f} {scaling:>10}')\n    prev_time = elapsed\n\nprint('\\nKNN is O(n) per prediction - linear scaling!')",
        solution: "import math\nimport time\n\ndef euclidean(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn(training, point, k=3):\n    distances = [(euclidean(point, f), l) for f, l in training]\n    distances.sort()\n    return distances[0][1]\n\nprint('KNN Prediction Time vs Training Size')\nprint('=' * 45)\nprint(f'{\"N\":>8} {\"Time (ms)\":>12} {\"Scaling\":>10}')\nprint('-' * 45)\n\nprev_time = None\nfor n in [100, 500, 1000, 2000, 5000]:\n    training = [((i % 10, i // 10), 'A' if i < n//2 else 'B') for i in range(n)]\n    point = (5, 5)\n    \n    start = time.time()\n    for _ in range(100):\n        knn(training, point, 3)\n    elapsed = (time.time() - start) * 10\n    \n    scaling = f'{elapsed/prev_time:.1f}x' if prev_time else '-'\n    print(f'{n:>8} {elapsed:>12.2f} {scaling:>10}')\n    prev_time = elapsed\n\nprint('\\nKNN is O(n) per prediction - linear scaling!')\nprint('For real-time apps with large data, consider other algorithms.')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Linear time growth shown", description: "KNN time complexity" }]),
        hints: ["Time increases with data", "Roughly linear scaling", "This is KNN's main weakness"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson19_2_3.id,
        number: 5,
        title: "When to Use KNN",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a decision guide for when KNN is appropriate based on dataset characteristics.",
        starterCode: "def should_use_knn(n_samples, n_features, need_fast_prediction, interpretability_needed):\n    \"\"\"\n    Decide if KNN is appropriate for your problem.\n    Returns (recommendation, reasons)\n    \"\"\"\n    reasons = []\n    score = 0\n    \n    # Check sample size\n    if n_samples < 10000:\n        score += 1\n        reasons.append('✓ Dataset size OK (<10K samples)')\n    else:\n        score -= 1\n        reasons.append('✗ Large dataset - KNN will be slow')\n    \n    # Check features\n    if n_features < 20:\n        score += 1\n        reasons.append('✓ Low dimensions (<20 features)')\n    else:\n        score -= 1\n        reasons.append('✗ High dimensions - curse of dimensionality')\n    \n    # Check speed requirement\n    if not need_fast_prediction:\n        score += 1\n        reasons.append('✓ Real-time speed not required')\n    else:\n        score -= 1\n        reasons.append('✗ Need fast predictions - KNN is slow')\n    \n    # Check interpretability\n    if interpretability_needed:\n        score += 1\n        reasons.append('✓ KNN is interpretable (\"similar to these examples\")')\n    \n    recommendation = 'USE KNN' if score >= 2 else 'CONSIDER OTHER ALGORITHMS'\n    \n    return recommendation, reasons\n\n# Test scenarios\nscenarios = [\n    ('Small dataset, few features', 1000, 5, False, True),\n    ('Large dataset, fast needed', 100000, 10, True, False),\n    ('High dimensional', 5000, 100, False, False),\n    ('Quick prototype', 500, 8, False, True),\n]\n\nprint('KNN Decision Guide')\nprint('=' * 50)\n\nfor name, n, f, fast, interp in scenarios:\n    rec, reasons = should_use_knn(n, f, fast, interp)\n    print(f'\\n{name}:')\n    print(f'  Samples: {n}, Features: {f}')\n    for r in reasons:\n        print(f'  {r}')\n    print(f'  → {rec}')",
        solution: "def should_use_knn(n_samples, n_features, need_fast_prediction, interpretability_needed):\n    reasons = []\n    score = 0\n    \n    if n_samples < 10000:\n        score += 1\n        reasons.append('✓ Dataset size OK (<10K samples)')\n    else:\n        score -= 1\n        reasons.append('✗ Large dataset - KNN will be slow')\n    \n    if n_features < 20:\n        score += 1\n        reasons.append('✓ Low dimensions (<20 features)')\n    else:\n        score -= 1\n        reasons.append('✗ High dimensions - curse of dimensionality')\n    \n    if not need_fast_prediction:\n        score += 1\n        reasons.append('✓ Real-time speed not required')\n    else:\n        score -= 1\n        reasons.append('✗ Need fast predictions - KNN is slow')\n    \n    if interpretability_needed:\n        score += 1\n        reasons.append('✓ KNN is interpretable (\"similar to these examples\")')\n    \n    recommendation = 'USE KNN' if score >= 2 else 'CONSIDER OTHER ALGORITHMS'\n    \n    return recommendation, reasons\n\nscenarios = [\n    ('Small dataset, few features', 1000, 5, False, True),\n    ('Large dataset, fast needed', 100000, 10, True, False),\n    ('High dimensional', 5000, 100, False, False),\n    ('Quick prototype', 500, 8, False, True),\n]\n\nprint('KNN Decision Guide')\nprint('=' * 50)\n\nfor name, n, f, fast, interp in scenarios:\n    rec, reasons = should_use_knn(n, f, fast, interp)\n    print(f'\\n{name}:')\n    print(f'  Samples: {n}, Features: {f}')\n    for r in reasons:\n        print(f'  {r}')\n    print(f'  → {rec}')\n\nprint('\\nKNN: simple, interpretable, but limited scalability.')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Recommendations for each scenario", description: "KNN decision guide" }]),
        hints: ["Small data = good", "Few features = good", "Need speed = bad for KNN"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 19.2.3`);

  console.log("\n✅ Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
