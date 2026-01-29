import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 2: Lessons 23.2.1-23.2.3 (K-Means)...\n");

  const section23_2 = await prisma.section.findFirst({ where: { number: 23.2 } });
  if (!section23_2) throw new Error("Section 23.2 not found. Run part 1 first.");

  // Lesson 23.2.1
  const lesson23_2_1 = await prisma.lesson.upsert({
    where: { slug: "kmeans-algorithm" },
    update: {},
    create: {
      sectionId: section23_2.id,
      number: 23.21,
      title: "K-Means Algorithm",
      slug: "kmeans-algorithm",
      objectives: [
        "Understand K-means algorithm steps",
        "See how Lloyd's algorithm works",
        "Understand convergence",
        "Know K-means limitations",
      ],
      content: `# K-Means Algorithm

## The Idea

Partition N data points into K clusters by minimizing within-cluster variance.

## Lloyd's Algorithm (Standard K-Means)

### Step 1: Initialize
Randomly select K points as initial centroids.

### Step 2: Assign
Assign each point to the nearest centroid.

### Step 3: Update
Recalculate centroids as the mean of assigned points.

### Step 4: Repeat
Repeat steps 2-3 until convergence.

## Convergence

Algorithm stops when:
- Centroids don't move (or move very little)
- Assignments don't change
- Maximum iterations reached

## Objective Function

Minimize total within-cluster sum of squares (WCSS):
\`\`\`
WCSS = Σᵢ Σₓ∈Cᵢ ||x - μᵢ||²
\`\`\`

## Limitations

- Must choose K in advance
- Sensitive to initialization
- Finds local optimum, not global
- Assumes spherical clusters
- Sensitive to outliers`,
      codeExamples: JSON.stringify([
        {
          id: "kmeans-steps",
          title: "K-Means Step by Step",
          code: "import random\nimport math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef assign_clusters(data, centroids):\n    \"\"\"Assign each point to nearest centroid\"\"\"\n    assignments = []\n    for point in data:\n        distances = [euclidean(point, c) for c in centroids]\n        assignments.append(distances.index(min(distances)))\n    return assignments\n\ndef update_centroids(data, assignments, k):\n    \"\"\"Calculate new centroids\"\"\"\n    new_centroids = []\n    for i in range(k):\n        cluster_points = [data[j] for j in range(len(data)) if assignments[j] == i]\n        if cluster_points:\n            centroid = [sum(p[d] for p in cluster_points) / len(cluster_points)\n                       for d in range(len(data[0]))]\n            new_centroids.append(centroid)\n        else:\n            new_centroids.append([0, 0])  # Empty cluster\n    return new_centroids\n\n# Example data\ndata = [[1, 1], [1.5, 2], [2, 1], [8, 8], [8.5, 9], [9, 8]]\nk = 2\n\nprint('K-MEANS STEP BY STEP')\nprint('=' * 50)\nprint(f'Data: {data}')\nprint(f'K = {k}')\n\n# Step 1: Initialize (pick first 2 points as centroids)\ncentroids = [[1, 1], [9, 8]]  # Fixed for reproducibility\nprint(f'\\n--- Step 1: Initialize ---')\nprint(f'Initial centroids: {centroids}')\n\n# Step 2: Assign\nassignments = assign_clusters(data, centroids)\nprint(f'\\n--- Step 2: Assign ---')\nfor i, (point, cluster) in enumerate(zip(data, assignments)):\n    print(f'  {point} → Cluster {cluster}')\n\n# Step 3: Update\nnew_centroids = update_centroids(data, assignments, k)\nprint(f'\\n--- Step 3: Update Centroids ---')\nprint(f'New centroids: {[[round(c, 2) for c in cent] for cent in new_centroids]}')",
          description: "Walk through K-means steps",
        },
        {
          id: "kmeans-iteration",
          title: "K-Means Iteration",
          code: "import random\nimport math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef kmeans_step(data, centroids):\n    k = len(centroids)\n    # Assign\n    assignments = []\n    for point in data:\n        dists = [euclidean(point, c) for c in centroids]\n        assignments.append(dists.index(min(dists)))\n    \n    # Update\n    new_centroids = []\n    for i in range(k):\n        cluster = [data[j] for j in range(len(data)) if assignments[j] == i]\n        if cluster:\n            cent = [sum(p[d] for p in cluster) / len(cluster) for d in range(len(data[0]))]\n            new_centroids.append(cent)\n        else:\n            new_centroids.append(centroids[i])\n    \n    return assignments, new_centroids\n\n# Data with clear clusters\nrandom.seed(42)\ndata = [[random.gauss(2, 0.5), random.gauss(2, 0.5)] for _ in range(5)] + \\\n       [[random.gauss(8, 0.5), random.gauss(8, 0.5)] for _ in range(5)]\n\n# Start with bad initialization\ncentroids = [[0, 0], [1, 1]]\n\nprint('K-MEANS CONVERGENCE')\nprint('=' * 55)\n\nfor iteration in range(5):\n    assignments, new_centroids = kmeans_step(data, centroids)\n    \n    # Check if converged\n    moved = sum(euclidean(c, nc) for c, nc in zip(centroids, new_centroids))\n    \n    print(f'\\nIteration {iteration + 1}:')\n    print(f'  Centroids: {[[round(c, 1) for c in cent] for cent in new_centroids]}')\n    print(f'  Assignments: {assignments}')\n    print(f'  Centroid movement: {moved:.4f}')\n    \n    if moved < 0.001:\n        print('\\n✓ Converged!')\n        break\n    \n    centroids = new_centroids",
          description: "Watch K-means iterate to convergence",
        },
        {
          id: "wcss",
          title: "Within-Cluster Sum of Squares",
          code: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef calculate_wcss(data, assignments, centroids):\n    \"\"\"Calculate Within-Cluster Sum of Squares\"\"\"\n    wcss = 0\n    for i, point in enumerate(data):\n        centroid = centroids[assignments[i]]\n        wcss += euclidean(point, centroid) ** 2\n    return wcss\n\n# Example\ndata = [[1, 1], [1, 2], [2, 1], [8, 8], [8, 9], [9, 8]]\n\n# Good clustering\ngood_assignments = [0, 0, 0, 1, 1, 1]\ngood_centroids = [[1.33, 1.33], [8.33, 8.33]]\n\n# Bad clustering  \nbad_assignments = [0, 0, 1, 0, 1, 1]\nbad_centroids = [[3.33, 3.67], [6.33, 6.0]]\n\nprint('WITHIN-CLUSTER SUM OF SQUARES (WCSS)')\nprint('=' * 50)\nprint('WCSS measures total distance from points to their centroids')\nprint('Lower WCSS = better clustering\\n')\n\ngood_wcss = calculate_wcss(data, good_assignments, good_centroids)\nbad_wcss = calculate_wcss(data, bad_assignments, bad_centroids)\n\nprint(f'Good clustering WCSS: {good_wcss:.2f}')\nprint(f'Bad clustering WCSS: {bad_wcss:.2f}')\nprint(f'\\n✓ K-means minimizes WCSS')",
          description: "Understand the K-means objective",
        },
      ]),
      keyPoints: [
        "K-means: partition into K clusters",
        "Lloyd's algorithm: assign, update, repeat",
        "Converges when centroids stop moving",
        "Minimizes within-cluster sum of squares",
        "Sensitive to initialization",
        "Must specify K in advance",
      ],
      hardwareDemo: "Watch centroids move iteration by iteration. See convergence.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson23_2_1.number}: ${lesson23_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson23_2_1.id,
        number: 1,
        title: "Assign Points to Centroids",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement the assignment step of K-means.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef assign_to_centroids(data, centroids):\n    \"\"\"Assign each point to nearest centroid\"\"\"\n    assignments = []\n    for point in data:\n        min_dist = float('inf')\n        nearest = 0\n        for i, centroid in enumerate(centroids):\n            dist = euclidean(point, centroid)\n            if dist < min_dist:\n                min_dist = dist\n                nearest = i\n        assignments.append(nearest)\n    return assignments\n\n# Test\ndata = [[1, 1], [2, 1], [8, 8], [9, 9], [5, 5]]\ncentroids = [[1.5, 1], [8.5, 8.5]]\n\nassignments = assign_to_centroids(data, centroids)\n\nprint('ASSIGNMENT STEP')\nprint('=' * 40)\nprint(f'Centroids: {centroids}\\n')\n\nfor point, cluster in zip(data, assignments):\n    print(f'{point} → Cluster {cluster}')",
        solution: "# Points assigned to nearest centroid",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Assignments shown", description: "Assignment step" }]),
        hints: ["Calculate distance to each centroid", "Find minimum", "Store cluster index"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson23_2_1.id,
        number: 2,
        title: "Update Centroids",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement the centroid update step of K-means.",
        starterCode: "def update_centroids(data, assignments, k):\n    \"\"\"Calculate new centroids as mean of assigned points\"\"\"\n    n_dims = len(data[0])\n    new_centroids = []\n    \n    for cluster_id in range(k):\n        # Get points in this cluster\n        cluster_points = [data[i] for i in range(len(data)) \n                         if assignments[i] == cluster_id]\n        \n        if cluster_points:\n            # Calculate mean\n            centroid = []\n            for d in range(n_dims):\n                mean = sum(p[d] for p in cluster_points) / len(cluster_points)\n                centroid.append(mean)\n            new_centroids.append(centroid)\n        else:\n            new_centroids.append([0] * n_dims)  # Handle empty cluster\n    \n    return new_centroids\n\n# Test\ndata = [[1, 1], [2, 1], [1, 2], [8, 8], [9, 8], [8, 9]]\nassignments = [0, 0, 0, 1, 1, 1]\nk = 2\n\nnew_centroids = update_centroids(data, assignments, k)\n\nprint('UPDATE STEP')\nprint('=' * 40)\nprint('Cluster 0 points:', [data[i] for i in range(len(data)) if assignments[i] == 0])\nprint('Cluster 1 points:', [data[i] for i in range(len(data)) if assignments[i] == 1])\nprint(f'\\nNew centroids:')\nfor i, c in enumerate(new_centroids):\n    print(f'  Cluster {i}: [{c[0]:.2f}, {c[1]:.2f}]')",
        solution: "# Centroids updated to cluster means",
        testCases: JSON.stringify([{ input: "", expectedOutput: "New centroids", description: "Update centroids" }]),
        hints: ["Group points by cluster", "Calculate mean per dimension", "Handle empty clusters"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson23_2_1.id,
        number: 3,
        title: "One K-Means Iteration",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Combine assign and update into one K-means iteration.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef kmeans_iteration(data, centroids):\n    \"\"\"Perform one iteration of K-means\"\"\"\n    k = len(centroids)\n    n_dims = len(data[0])\n    \n    # Step 1: Assign\n    assignments = []\n    for point in data:\n        dists = [euclidean(point, c) for c in centroids]\n        assignments.append(dists.index(min(dists)))\n    \n    # Step 2: Update\n    new_centroids = []\n    for i in range(k):\n        cluster = [data[j] for j in range(len(data)) if assignments[j] == i]\n        if cluster:\n            cent = [sum(p[d] for p in cluster) / len(cluster) for d in range(n_dims)]\n            new_centroids.append(cent)\n        else:\n            new_centroids.append(centroids[i])\n    \n    return assignments, new_centroids\n\n# Test\ndata = [[1, 1], [2, 2], [1, 2], [8, 8], [9, 9], [8, 9]]\ncentroids = [[0, 0], [10, 10]]  # Initial centroids\n\nprint('ONE K-MEANS ITERATION')\nprint('=' * 45)\nprint(f'Initial centroids: {centroids}')\n\nassignments, new_centroids = kmeans_iteration(data, centroids)\n\nprint(f'\\nAssignments: {assignments}')\nprint(f'New centroids: {[[round(c, 2) for c in cent] for cent in new_centroids]}')\n\n# Calculate movement\nmovement = sum(euclidean(c, nc) for c, nc in zip(centroids, new_centroids))\nprint(f'Total centroid movement: {movement:.2f}')",
        solution: "# One complete iteration",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Iteration complete", description: "K-means iteration" }]),
        hints: ["Assign then update", "Return both assignments and new centroids", "Track movement"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson23_2_1.id,
        number: 4,
        title: "Calculate WCSS",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate the within-cluster sum of squares for a clustering.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef wcss(data, assignments, centroids):\n    \"\"\"Calculate Within-Cluster Sum of Squares\"\"\"\n    total = 0\n    for i, point in enumerate(data):\n        cluster = assignments[i]\n        centroid = centroids[cluster]\n        total += euclidean(point, centroid) ** 2\n    return total\n\n# Test with two different clusterings\ndata = [[0, 0], [1, 0], [0, 1], [5, 5], [6, 5], [5, 6]]\n\n# Good clustering\ngood_assign = [0, 0, 0, 1, 1, 1]\ngood_cents = [[0.33, 0.33], [5.33, 5.33]]\n\n# Random/bad clustering\nbad_assign = [0, 1, 0, 1, 0, 1]\nbad_cents = [[2, 2], [4, 3.33]]\n\nprint('WCSS COMPARISON')\nprint('=' * 45)\n\ngood_wcss = wcss(data, good_assign, good_cents)\nbad_wcss = wcss(data, bad_assign, bad_cents)\n\nprint(f'Good clustering WCSS: {good_wcss:.2f}')\nprint(f'Bad clustering WCSS: {bad_wcss:.2f}')\nprint(f'\\n💡 Lower WCSS = better clustering')\nprint(f'   Good is {bad_wcss/good_wcss:.1f}x better than bad')",
        solution: "# WCSS calculated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "WCSS values", description: "Calculate WCSS" }]),
        hints: ["Sum of squared distances", "Point to its centroid", "Lower is better"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson23_2_1.id,
        number: 5,
        title: "Detect Convergence",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement convergence detection for K-means.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef has_converged(old_centroids, new_centroids, tolerance=0.001):\n    \"\"\"Check if centroids have stopped moving\"\"\"\n    total_movement = 0\n    for old, new in zip(old_centroids, new_centroids):\n        total_movement += euclidean(old, new)\n    return total_movement < tolerance\n\ndef assignments_changed(old_assignments, new_assignments):\n    \"\"\"Check if any point changed clusters\"\"\"\n    return old_assignments != new_assignments\n\n# Test scenarios\nprint('CONVERGENCE DETECTION')\nprint('=' * 50)\n\n# Scenario 1: Not converged\nold_c = [[1, 1], [8, 8]]\nnew_c = [[1.5, 1.2], [8.3, 8.1]]\nprint(f'\\nScenario 1:')\nprint(f'  Old: {old_c}')\nprint(f'  New: {new_c}')\nprint(f'  Movement: {sum(euclidean(o, n) for o, n in zip(old_c, new_c)):.4f}')\nprint(f'  Converged: {has_converged(old_c, new_c)}')\n\n# Scenario 2: Converged\nold_c = [[1.5, 1.5], [8.5, 8.5]]\nnew_c = [[1.5001, 1.4999], [8.5, 8.5001]]\nprint(f'\\nScenario 2:')\nprint(f'  Old: {old_c}')\nprint(f'  New: {new_c}')\nprint(f'  Movement: {sum(euclidean(o, n) for o, n in zip(old_c, new_c)):.6f}')\nprint(f'  Converged: {has_converged(old_c, new_c)}')",
        solution: "# Convergence detected",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Convergence checked", description: "Detect convergence" }]),
        hints: ["Sum centroid movements", "Compare to tolerance", "Can also check assignments"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 23.2.1`);

  // Lesson 23.2.2
  const lesson23_2_2 = await prisma.lesson.upsert({
    where: { slug: "kmeans-implementation" },
    update: {},
    create: {
      sectionId: section23_2.id,
      number: 23.22,
      title: "K-Means Implementation",
      slug: "kmeans-implementation",
      objectives: [
        "Implement complete K-means from scratch",
        "Handle initialization strategies",
        "Visualize clustering results",
        "Apply K-means to real data",
      ],
      content: `# K-Means Implementation

## Complete Algorithm

\`\`\`python
def kmeans(data, k, max_iters=100):
    # 1. Initialize centroids
    centroids = random_initialization(data, k)
    
    for i in range(max_iters):
        # 2. Assign points to nearest centroid
        assignments = assign(data, centroids)
        
        # 3. Update centroids
        new_centroids = update(data, assignments, k)
        
        # 4. Check convergence
        if converged(centroids, new_centroids):
            break
            
        centroids = new_centroids
    
    return assignments, centroids
\`\`\`

## Initialization Strategies

### Random Points
Pick K random data points as initial centroids.
- Simple
- Can lead to poor results

### K-Means++
Smart initialization that spreads out centroids:
1. Choose first centroid randomly
2. Choose next centroid with probability proportional to distance²
3. Repeat until K centroids

**K-means++ usually converges faster and gives better results!**

## Handling Edge Cases

- **Empty clusters**: Keep old centroid or reinitialize
- **Single point clusters**: Centroid = that point
- **Identical points**: May cause division by zero

## Tips for Good Results

1. Run multiple times with different initializations
2. Use K-means++ initialization
3. Normalize features to similar scales
4. Check for outliers first`,
      codeExamples: JSON.stringify([
        {
          id: "complete-kmeans",
          title: "Complete K-Means Implementation",
          code: "import random\nimport math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef kmeans(data, k, max_iters=100, seed=None):\n    \"\"\"Complete K-means clustering\"\"\"\n    if seed:\n        random.seed(seed)\n    \n    n = len(data)\n    n_dims = len(data[0])\n    \n    # Initialize: random points as centroids\n    indices = random.sample(range(n), k)\n    centroids = [data[i].copy() for i in indices]\n    \n    for iteration in range(max_iters):\n        # Assign\n        assignments = []\n        for point in data:\n            dists = [euclidean(point, c) for c in centroids]\n            assignments.append(dists.index(min(dists)))\n        \n        # Update\n        new_centroids = []\n        for i in range(k):\n            cluster = [data[j] for j in range(n) if assignments[j] == i]\n            if cluster:\n                cent = [sum(p[d] for p in cluster) / len(cluster) for d in range(n_dims)]\n            else:\n                cent = centroids[i]  # Keep old if empty\n            new_centroids.append(cent)\n        \n        # Check convergence\n        movement = sum(euclidean(c, nc) for c, nc in zip(centroids, new_centroids))\n        if movement < 0.0001:\n            print(f'Converged at iteration {iteration + 1}')\n            break\n        \n        centroids = new_centroids\n    \n    return assignments, centroids\n\n# Test\nrandom.seed(42)\ndata = [[random.gauss(2, 0.5), random.gauss(2, 0.5)] for _ in range(10)] + \\\n       [[random.gauss(8, 0.5), random.gauss(8, 0.5)] for _ in range(10)]\n\nassignments, centroids = kmeans(data, k=2, seed=42)\n\nprint('\\nK-MEANS RESULTS')\nprint('=' * 45)\nprint(f'Final centroids: {[[round(c, 2) for c in cent] for cent in centroids]}')\nprint(f'Cluster sizes: {[assignments.count(i) for i in range(2)]}')",
          description: "Complete K-means from scratch",
        },
        {
          id: "kmeans-plusplus",
          title: "K-Means++ Initialization",
          code: "import random\nimport math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef kmeans_plusplus_init(data, k, seed=None):\n    \"\"\"K-means++ smart initialization\"\"\"\n    if seed:\n        random.seed(seed)\n    \n    n = len(data)\n    centroids = []\n    \n    # First centroid: random\n    centroids.append(data[random.randint(0, n-1)].copy())\n    \n    # Remaining centroids: probability proportional to distance²\n    for _ in range(1, k):\n        distances = []\n        for point in data:\n            min_dist = min(euclidean(point, c) for c in centroids)\n            distances.append(min_dist ** 2)\n        \n        # Weighted random selection\n        total = sum(distances)\n        probs = [d / total for d in distances]\n        r = random.random()\n        cumsum = 0\n        for i, p in enumerate(probs):\n            cumsum += p\n            if r <= cumsum:\n                centroids.append(data[i].copy())\n                break\n    \n    return centroids\n\n# Compare with random initialization\nrandom.seed(42)\ndata = [[1, 1], [1, 2], [2, 1], [8, 8], [8, 9], [9, 8], [5, 5]]\n\nprint('K-MEANS++ INITIALIZATION')\nprint('=' * 50)\nprint(f'Data points: {data}')\n\n# K-means++ init\ncentroids_pp = kmeans_plusplus_init(data, k=2, seed=42)\nprint(f'\\nK-means++ centroids: {centroids_pp}')\n\n# Random init\nrandom.seed(42)\nrandom_idx = random.sample(range(len(data)), 2)\ncentroids_random = [data[i] for i in random_idx]\nprint(f'Random centroids: {centroids_random}')\n\nprint('\\n💡 K-means++ spreads centroids apart!')",
          description: "Smart K-means++ initialization",
        },
        {
          id: "visualize-clustering",
          title: "Visualize Clustering",
          code: "import random\nimport math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef kmeans(data, k, max_iters=50, seed=None):\n    if seed: random.seed(seed)\n    centroids = [data[i].copy() for i in random.sample(range(len(data)), k)]\n    for _ in range(max_iters):\n        assignments = [min(range(k), key=lambda i: euclidean(p, centroids[i])) for p in data]\n        new_centroids = []\n        for i in range(k):\n            cluster = [data[j] for j in range(len(data)) if assignments[j] == i]\n            new_centroids.append([sum(p[d] for p in cluster)/len(cluster) for d in range(2)] if cluster else centroids[i])\n        if sum(euclidean(c, nc) for c, nc in zip(centroids, new_centroids)) < 0.001: break\n        centroids = new_centroids\n    return assignments, centroids\n\ndef visualize(data, assignments, centroids, width=20, height=10):\n    symbols = ['A', 'B', 'C', 'D']\n    grid = [['.' for _ in range(width)] for _ in range(height)]\n    \n    for point, cluster in zip(data, assignments):\n        x = int(point[0] * (width-1) / 10)\n        y = int(point[1] * (height-1) / 10)\n        if 0 <= x < width and 0 <= y < height:\n            grid[height-1-y][x] = symbols[cluster]\n    \n    for i, cent in enumerate(centroids):\n        x = int(cent[0] * (width-1) / 10)\n        y = int(cent[1] * (height-1) / 10)\n        if 0 <= x < width and 0 <= y < height:\n            grid[height-1-y][x] = '*'\n    \n    for row in grid:\n        print(''.join(row))\n\n# Generate and cluster\nrandom.seed(42)\ndata = [[random.gauss(2, 1), random.gauss(2, 1)] for _ in range(15)] + \\\n       [[random.gauss(8, 1), random.gauss(7, 1)] for _ in range(15)]\n\nassignments, centroids = kmeans(data, k=2, seed=42)\n\nprint('CLUSTERING VISUALIZATION')\nprint('=' * 30)\nprint('A, B = cluster points')\nprint('* = centroids\\n')\nvisualize(data, assignments, centroids)",
          description: "Visualize clustering results",
        },
      ]),
      keyPoints: [
        "Initialize → Assign → Update → Check convergence",
        "K-means++ gives better initialization",
        "Run multiple times for best result",
        "Handle empty clusters gracefully",
        "Normalize features before clustering",
        "Check results visually when possible",
      ],
      hardwareDemo: "Watch full K-means run. See data move between clusters.",
      estimatedTime: 35,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson23_2_2.number}: ${lesson23_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson23_2_2.id,
        number: 1,
        title: "Complete K-Means Function",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement a complete K-means function that runs until convergence.",
        starterCode: "import random\nimport math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef kmeans(data, k, max_iters=100):\n    \"\"\"Complete K-means clustering\"\"\"\n    n = len(data)\n    n_dims = len(data[0])\n    \n    # Initialize: random points\n    random.seed(42)\n    centroids = [data[i].copy() for i in random.sample(range(n), k)]\n    \n    for iteration in range(max_iters):\n        # Assign\n        assignments = []\n        for point in data:\n            dists = [euclidean(point, c) for c in centroids]\n            assignments.append(dists.index(min(dists)))\n        \n        # Update\n        new_centroids = []\n        for i in range(k):\n            cluster = [data[j] for j in range(n) if assignments[j] == i]\n            if cluster:\n                cent = [sum(p[d] for p in cluster)/len(cluster) for d in range(n_dims)]\n            else:\n                cent = centroids[i]\n            new_centroids.append(cent)\n        \n        # Check convergence\n        if sum(euclidean(c, nc) for c, nc in zip(centroids, new_centroids)) < 0.001:\n            print(f'Converged at iteration {iteration + 1}')\n            break\n        \n        centroids = new_centroids\n    \n    return assignments, centroids\n\n# Test\ndata = [[1,1], [1,2], [2,1], [8,8], [8,9], [9,8], [5,5], [5,6]]\nassignments, centroids = kmeans(data, k=2)\n\nprint(f'\\nAssignments: {assignments}')\nprint(f'Centroids: {[[round(c,2) for c in cent] for cent in centroids]}')",
        solution: "# Complete K-means implemented",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Converged", description: "Complete K-means" }]),
        hints: ["Loop assign-update", "Check convergence each iteration", "Return assignments and centroids"],
        xpReward: 25,
        order: 1,
      },
      {
        lessonId: lesson23_2_2.id,
        number: 2,
        title: "K-Means++ Initialization",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement K-means++ initialization strategy.",
        starterCode: "import random\nimport math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef kmeans_plusplus(data, k):\n    \"\"\"K-means++ initialization\"\"\"\n    n = len(data)\n    centroids = []\n    \n    # First centroid: random\n    centroids.append(data[random.randint(0, n-1)].copy())\n    \n    while len(centroids) < k:\n        # Calculate distance to nearest centroid for each point\n        distances_sq = []\n        for point in data:\n            min_dist = min(euclidean(point, c) for c in centroids)\n            distances_sq.append(min_dist ** 2)\n        \n        # Select next centroid with probability ~ distance²\n        total = sum(distances_sq)\n        r = random.random() * total\n        cumsum = 0\n        for i, d in enumerate(distances_sq):\n            cumsum += d\n            if cumsum >= r:\n                centroids.append(data[i].copy())\n                break\n    \n    return centroids\n\n# Test\nrandom.seed(42)\ndata = [[0,0], [1,0], [0,1], [10,10], [11,10], [10,11], [5,5]]\n\ncentroids = kmeans_plusplus(data, k=2)\nprint('K-MEANS++ INITIALIZATION')\nprint('=' * 40)\nprint(f'Data: {data}')\nprint(f'Selected centroids: {centroids}')\n\n# Verify spread\ndist = euclidean(centroids[0], centroids[1])\nprint(f'Distance between centroids: {dist:.2f}')",
        solution: "# K-means++ spreads centroids",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Spread centroids", description: "K-means++" }]),
        hints: ["First is random", "Others weighted by distance²", "Spreads centroids apart"],
        xpReward: 25,
        order: 2,
      },
      {
        lessonId: lesson23_2_2.id,
        number: 3,
        title: "Multiple Runs",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Run K-means multiple times and keep the best result.",
        starterCode: "import random\nimport math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef kmeans_single(data, k, seed):\n    random.seed(seed)\n    centroids = [data[i].copy() for i in random.sample(range(len(data)), k)]\n    for _ in range(50):\n        assignments = [min(range(k), key=lambda i: euclidean(p, centroids[i])) for p in data]\n        new_cents = []\n        for i in range(k):\n            cluster = [data[j] for j in range(len(data)) if assignments[j] == i]\n            new_cents.append([sum(p[d] for p in cluster)/len(cluster) for d in range(2)] if cluster else centroids[i])\n        if sum(euclidean(c, nc) for c, nc in zip(centroids, new_cents)) < 0.001:\n            break\n        centroids = new_cents\n    wcss = sum(euclidean(data[i], centroids[assignments[i]])**2 for i in range(len(data)))\n    return assignments, centroids, wcss\n\ndef kmeans_best_of_n(data, k, n_runs=5):\n    best_wcss = float('inf')\n    best_result = None\n    \n    for run in range(n_runs):\n        assignments, centroids, wcss = kmeans_single(data, k, seed=run)\n        print(f'Run {run+1}: WCSS = {wcss:.2f}')\n        if wcss < best_wcss:\n            best_wcss = wcss\n            best_result = (assignments, centroids)\n    \n    return best_result, best_wcss\n\n# Test\nrandom.seed(42)\ndata = [[random.gauss(2, 1), random.gauss(2, 1)] for _ in range(10)] + \\\n       [[random.gauss(8, 1), random.gauss(8, 1)] for _ in range(10)]\n\nprint('MULTIPLE K-MEANS RUNS')\nprint('=' * 40)\nresult, wcss = kmeans_best_of_n(data, k=2, n_runs=5)\nprint(f'\\nBest WCSS: {wcss:.2f}')",
        solution: "# Best of multiple runs",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Best selected", description: "Multiple runs" }]),
        hints: ["Run with different seeds", "Track WCSS for each", "Keep lowest WCSS"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson23_2_2.id,
        number: 4,
        title: "Cluster Statistics",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate statistics about the resulting clusters.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef cluster_stats(data, assignments, centroids):\n    \"\"\"Calculate cluster statistics\"\"\"\n    k = len(centroids)\n    stats = []\n    \n    for i in range(k):\n        cluster_points = [data[j] for j in range(len(data)) if assignments[j] == i]\n        centroid = centroids[i]\n        \n        if not cluster_points:\n            stats.append({'size': 0, 'avg_dist': 0, 'max_dist': 0})\n            continue\n        \n        distances = [euclidean(p, centroid) for p in cluster_points]\n        \n        stats.append({\n            'size': len(cluster_points),\n            'avg_dist': sum(distances) / len(distances),\n            'max_dist': max(distances),\n            'centroid': centroid\n        })\n    \n    return stats\n\n# Example clustering result\ndata = [[1,1], [1,2], [2,1], [2,2], [8,8], [8,9], [9,8], [9,9], [10,10]]\nassignments = [0, 0, 0, 0, 1, 1, 1, 1, 1]\ncentroids = [[1.5, 1.5], [8.8, 8.8]]\n\nstats = cluster_stats(data, assignments, centroids)\n\nprint('CLUSTER STATISTICS')\nprint('=' * 50)\nfor i, s in enumerate(stats):\n    print(f'\\nCluster {i}:')\n    print(f'  Size: {s[\"size\"]} points')\n    print(f'  Centroid: {[round(c, 2) for c in s[\"centroid\"]]}')\n    print(f'  Avg distance to centroid: {s[\"avg_dist\"]:.2f}')\n    print(f'  Max distance to centroid: {s[\"max_dist\"]:.2f}')",
        solution: "# Cluster statistics calculated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Stats shown", description: "Cluster stats" }]),
        hints: ["Group points by cluster", "Calculate distances to centroid", "Report size, avg, max"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson23_2_2.id,
        number: 5,
        title: "Customer Segmentation",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Apply K-means to segment customers by their behavior.",
        starterCode: "import random\nimport math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef kmeans(data, k, max_iters=50):\n    random.seed(42)\n    centroids = [data[i].copy() for i in random.sample(range(len(data)), k)]\n    for _ in range(max_iters):\n        assignments = [min(range(k), key=lambda i: euclidean(p, centroids[i])) for p in data]\n        new_cents = []\n        for i in range(k):\n            cluster = [data[j] for j in range(len(data)) if assignments[j] == i]\n            new_cents.append([sum(p[d] for p in cluster)/len(cluster) for d in range(len(data[0]))] if cluster else centroids[i])\n        if sum(euclidean(c, nc) for c, nc in zip(centroids, new_cents)) < 0.001: break\n        centroids = new_cents\n    return assignments, centroids\n\n# Customer data: [annual_spending, visit_frequency]\ncustomers = [\n    [500, 2], [450, 3], [600, 2],   # Low freq, high spend\n    [100, 15], [80, 20], [120, 18], # High freq, low spend\n    [300, 8], [350, 7], [280, 9],   # Medium\n]\n\n# Normalize (simple min-max)\nspend_max = max(c[0] for c in customers)\nfreq_max = max(c[1] for c in customers)\nnormalized = [[c[0]/spend_max, c[1]/freq_max] for c in customers]\n\nassignments, centroids = kmeans(normalized, k=3)\n\nprint('CUSTOMER SEGMENTATION')\nprint('=' * 55)\nprint(f'{\"Customer\":>10} {\"Spending\":>10} {\"Visits\":>10} {\"Segment\":>10}')\nprint('-' * 45)\n\nfor i, (orig, cluster) in enumerate(zip(customers, assignments)):\n    print(f'{i+1:>10} ${orig[0]:>9} {orig[1]:>10} {cluster:>10}')\n\nprint('\\nSegment interpretation:')\nfor i in range(3):\n    cluster_customers = [customers[j] for j in range(len(customers)) if assignments[j] == i]\n    avg_spend = sum(c[0] for c in cluster_customers) / len(cluster_customers)\n    avg_visits = sum(c[1] for c in cluster_customers) / len(cluster_customers)\n    print(f'  Segment {i}: Avg spend ${avg_spend:.0f}, Avg visits {avg_visits:.0f}')",
        solution: "# Customer segments discovered",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Segments shown", description: "Customer segmentation" }]),
        hints: ["Normalize features", "Run K-means", "Interpret segments"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 23.2.2`);

  // Lesson 23.2.3
  const lesson23_2_3 = await prisma.lesson.upsert({
    where: { slug: "choosing-k-elbow-method" },
    update: {},
    create: {
      sectionId: section23_2.id,
      number: 23.23,
      title: "Choosing K (Elbow Method)",
      slug: "choosing-k-elbow-method",
      objectives: [
        "Understand the problem of choosing K",
        "Apply the elbow method",
        "Use silhouette score",
        "Make practical K decisions",
      ],
      content: `# Choosing the Number of Clusters (K)

## The Problem

K-means requires K in advance, but how do we know the "right" K?

## The Elbow Method

1. Run K-means for K = 1, 2, 3, ..., n
2. Calculate WCSS (within-cluster sum of squares) for each
3. Plot WCSS vs K
4. Look for the "elbow" - where improvement slows

**The elbow**: Point where adding more clusters gives diminishing returns.

## Why It Works

- K = 1: WCSS is maximum (all points far from single center)
- K = n: WCSS = 0 (each point is its own cluster)
- Sweet spot: Enough clusters to capture structure, not too many

## Silhouette Score

Alternative method measuring cluster quality:

\`\`\`
s(i) = (b(i) - a(i)) / max(a(i), b(i))
\`\`\`

Where:
- a(i) = average distance to points in same cluster
- b(i) = average distance to points in nearest other cluster

**Score range**: -1 to 1 (higher is better)

## Practical Tips

- Elbow isn't always clear
- Domain knowledge helps
- Try multiple methods
- Consider interpretability`,
      codeExamples: JSON.stringify([
        {
          id: "elbow-method",
          title: "The Elbow Method",
          code: "import random\nimport math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef kmeans(data, k):\n    random.seed(42)\n    if k >= len(data): return list(range(len(data))), data.copy()\n    centroids = [data[i].copy() for i in random.sample(range(len(data)), k)]\n    for _ in range(50):\n        assignments = [min(range(k), key=lambda i: euclidean(p, centroids[i])) for p in data]\n        new_cents = []\n        for i in range(k):\n            cluster = [data[j] for j in range(len(data)) if assignments[j] == i]\n            new_cents.append([sum(p[d] for p in cluster)/len(cluster) for d in range(2)] if cluster else centroids[i])\n        if sum(euclidean(c, nc) for c, nc in zip(centroids, new_cents)) < 0.001: break\n        centroids = new_cents\n    return assignments, centroids\n\ndef wcss(data, assignments, centroids):\n    return sum(euclidean(data[i], centroids[assignments[i]])**2 for i in range(len(data)))\n\n# Generate data with 3 natural clusters\nrandom.seed(42)\ndata = [[random.gauss(2, 0.5), random.gauss(2, 0.5)] for _ in range(10)] + \\\n       [[random.gauss(8, 0.5), random.gauss(2, 0.5)] for _ in range(10)] + \\\n       [[random.gauss(5, 0.5), random.gauss(8, 0.5)] for _ in range(10)]\n\nprint('ELBOW METHOD')\nprint('=' * 50)\nprint(f'{\"K\":>3} {\"WCSS\":>12} {\"Visual\"}')\nprint('-' * 40)\n\nelbow_data = []\nfor k in range(1, 8):\n    assignments, centroids = kmeans(data, k)\n    w = wcss(data, assignments, centroids)\n    elbow_data.append((k, w))\n    bar = '█' * int(w / 20)\n    print(f'{k:>3} {w:>12.1f} {bar}')\n\nprint('\\n💡 The \"elbow\" is around K=3')\nprint('   (WCSS drops sharply then levels off)')",
          description: "Apply elbow method to find K",
        },
        {
          id: "silhouette",
          title: "Silhouette Score",
          code: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef silhouette_score(data, assignments):\n    \"\"\"Calculate average silhouette score\"\"\"\n    n = len(data)\n    scores = []\n    \n    for i in range(n):\n        # a(i): avg distance to same cluster\n        same_cluster = [data[j] for j in range(n) if assignments[j] == assignments[i] and j != i]\n        if not same_cluster:\n            scores.append(0)\n            continue\n        a_i = sum(euclidean(data[i], p) for p in same_cluster) / len(same_cluster)\n        \n        # b(i): avg distance to nearest other cluster\n        other_clusters = set(assignments) - {assignments[i]}\n        if not other_clusters:\n            scores.append(0)\n            continue\n        \n        b_i = float('inf')\n        for cluster in other_clusters:\n            other_points = [data[j] for j in range(n) if assignments[j] == cluster]\n            avg_dist = sum(euclidean(data[i], p) for p in other_points) / len(other_points)\n            b_i = min(b_i, avg_dist)\n        \n        s_i = (b_i - a_i) / max(a_i, b_i) if max(a_i, b_i) > 0 else 0\n        scores.append(s_i)\n    \n    return sum(scores) / len(scores)\n\n# Example\ndata = [[1, 1], [1, 2], [2, 1],  # Cluster 0\n        [8, 8], [8, 9], [9, 8]]  # Cluster 1\n\ngood_assignments = [0, 0, 0, 1, 1, 1]\nbad_assignments = [0, 1, 0, 1, 0, 1]\n\nprint('SILHOUETTE SCORE')\nprint('=' * 45)\nprint('Range: -1 (bad) to 1 (good)\\n')\n\ngood_score = silhouette_score(data, good_assignments)\nbad_score = silhouette_score(data, bad_assignments)\n\nprint(f'Good clustering: {good_score:.3f}')\nprint(f'Bad clustering: {bad_score:.3f}')",
          description: "Calculate silhouette score",
        },
        {
          id: "compare-methods",
          title: "Compare Elbow and Silhouette",
          code: "import random\nimport math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef kmeans(data, k):\n    random.seed(42)\n    if k >= len(data): return list(range(len(data))), data.copy()\n    centroids = [data[i].copy() for i in random.sample(range(len(data)), k)]\n    for _ in range(50):\n        assignments = [min(range(k), key=lambda i: euclidean(p, centroids[i])) for p in data]\n        new_cents = [[sum(data[j][d] for j in range(len(data)) if assignments[j]==i)/max(1,assignments.count(i)) for d in range(2)] for i in range(k)]\n        if sum(euclidean(c, nc) for c, nc in zip(centroids, new_cents)) < 0.001: break\n        centroids = new_cents\n    return assignments, centroids\n\ndef wcss(data, assignments, centroids):\n    return sum(euclidean(data[i], centroids[assignments[i]])**2 for i in range(len(data)))\n\ndef silhouette(data, assignments):\n    if len(set(assignments)) < 2: return 0\n    scores = []\n    for i in range(len(data)):\n        same = [data[j] for j in range(len(data)) if assignments[j]==assignments[i] and j!=i]\n        if not same: continue\n        a_i = sum(euclidean(data[i], p) for p in same) / len(same)\n        b_i = min(sum(euclidean(data[i], data[j]) for j in range(len(data)) if assignments[j]==c)/assignments.count(c) \n                  for c in set(assignments) if c != assignments[i])\n        scores.append((b_i - a_i) / max(a_i, b_i))\n    return sum(scores) / len(scores) if scores else 0\n\n# Data with 3 clusters\nrandom.seed(42)\ndata = [[random.gauss(c[0], 0.5), random.gauss(c[1], 0.5)] \n        for c in [(2,2), (8,2), (5,8)] for _ in range(8)]\n\nprint('COMPARING METHODS FOR CHOOSING K')\nprint('=' * 55)\nprint(f'{\"K\":>3} {\"WCSS\":>12} {\"Silhouette\":>12}')\nprint('-' * 35)\n\nfor k in range(2, 7):\n    assignments, centroids = kmeans(data, k)\n    w = wcss(data, assignments, centroids)\n    s = silhouette(data, assignments)\n    print(f'{k:>3} {w:>12.1f} {s:>12.3f}')\n\nprint('\\n💡 Both methods suggest K=3')\nprint('   (Elbow in WCSS, peak silhouette)')",
          description: "Compare elbow and silhouette methods",
        },
      ]),
      keyPoints: [
        "K must be chosen before running K-means",
        "Elbow method: plot WCSS vs K, find bend",
        "Silhouette: measures cluster separation quality",
        "Higher silhouette (closer to 1) is better",
        "Methods may suggest different K",
        "Domain knowledge helps final decision",
      ],
      hardwareDemo: "Watch WCSS decrease as K increases. See elbow form.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson23_2_3.number}: ${lesson23_2_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson23_2_3.id,
        number: 1,
        title: "Calculate WCSS for Multiple K",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Run K-means for K=1 to 6 and calculate WCSS for each.",
        starterCode: "import random\nimport math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef kmeans(data, k):\n    random.seed(42)\n    if k >= len(data): return list(range(len(data))), [[d[0], d[1]] for d in data]\n    centroids = [list(data[i]) for i in random.sample(range(len(data)), k)]\n    for _ in range(50):\n        assignments = [min(range(k), key=lambda c: euclidean(p, centroids[c])) for p in data]\n        new_cents = []\n        for i in range(k):\n            pts = [data[j] for j in range(len(data)) if assignments[j] == i]\n            new_cents.append([sum(p[d] for p in pts)/len(pts) for d in range(2)] if pts else centroids[i])\n        centroids = new_cents\n    return assignments, centroids\n\ndef wcss(data, assignments, centroids):\n    return sum(euclidean(data[i], centroids[assignments[i]])**2 for i in range(len(data)))\n\n# Generate data\nrandom.seed(42)\ndata = [[random.gauss(2, 0.5), random.gauss(2, 0.5)] for _ in range(8)] + \\\n       [[random.gauss(7, 0.5), random.gauss(7, 0.5)] for _ in range(8)]\n\nprint('WCSS FOR DIFFERENT K VALUES')\nprint('=' * 40)\n\nresults = []\nfor k in range(1, 7):\n    assignments, centroids = kmeans(data, k)\n    w = wcss(data, assignments, centroids)\n    results.append((k, w))\n    print(f'K={k}: WCSS = {w:.2f}')\n\nprint('\\n💡 Look for where WCSS stops dropping sharply')",
        solution: "# WCSS calculated for each K",
        testCases: JSON.stringify([{ input: "", expectedOutput: "WCSS values", description: "WCSS for K" }]),
        hints: ["Loop through K values", "Run K-means each time", "Store WCSS values"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson23_2_3.id,
        number: 2,
        title: "Visualize the Elbow",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a text-based visualization of the elbow curve.",
        starterCode: "def visualize_elbow(k_values, wcss_values, height=10):\n    \"\"\"Text visualization of elbow curve\"\"\"\n    max_wcss = max(wcss_values)\n    min_wcss = min(wcss_values)\n    \n    print('WCSS')\n    for h in range(height, 0, -1):\n        threshold = min_wcss + (max_wcss - min_wcss) * h / height\n        row = f'{threshold:6.0f} |'\n        for w in wcss_values:\n            if w >= threshold:\n                row += ' *'\n            else:\n                row += '  '\n        print(row)\n    print('       +' + '--' * len(k_values))\n    print('        ' + ''.join(f'{k:2d}' for k in k_values))\n    print('                  K')\n\n# Sample elbow data\nk_values = [1, 2, 3, 4, 5, 6]\nwcss_values = [500, 200, 100, 80, 70, 65]  # Clear elbow at K=3\n\nprint('ELBOW METHOD VISUALIZATION')\nprint('=' * 40)\nvisualize_elbow(k_values, wcss_values)\n\nprint('\\n💡 The elbow is at K=3')\nprint('   Sharp drop from K=1→3, then levels off')",
        solution: "# Elbow visualized",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Elbow plot", description: "Visualize elbow" }]),
        hints: ["Scale WCSS to height", "Plot stars where value meets threshold", "Show K on x-axis"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson23_2_3.id,
        number: 3,
        title: "Implement Silhouette Score",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement the silhouette score calculation.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef silhouette_score(data, assignments):\n    \"\"\"Calculate average silhouette score\"\"\"\n    n = len(data)\n    clusters = set(assignments)\n    \n    if len(clusters) < 2:\n        return 0  # Need at least 2 clusters\n    \n    scores = []\n    for i in range(n):\n        # a(i): mean distance to same cluster\n        same = [data[j] for j in range(n) if assignments[j] == assignments[i] and j != i]\n        if not same:\n            continue\n        a_i = sum(euclidean(data[i], p) for p in same) / len(same)\n        \n        # b(i): mean distance to nearest other cluster\n        b_i = float('inf')\n        for c in clusters:\n            if c == assignments[i]:\n                continue\n            other = [data[j] for j in range(n) if assignments[j] == c]\n            if other:\n                mean_dist = sum(euclidean(data[i], p) for p in other) / len(other)\n                b_i = min(b_i, mean_dist)\n        \n        if max(a_i, b_i) > 0:\n            s_i = (b_i - a_i) / max(a_i, b_i)\n            scores.append(s_i)\n    \n    return sum(scores) / len(scores) if scores else 0\n\n# Test\ndata = [[1, 1], [1, 2], [2, 1], [9, 9], [9, 10], [10, 9]]\nassignments = [0, 0, 0, 1, 1, 1]\n\nscore = silhouette_score(data, assignments)\nprint('SILHOUETTE SCORE')\nprint('=' * 40)\nprint(f'Score: {score:.3f}')\nprint(f'\\nInterpretation:')\nprint(f'  > 0.7: Strong structure')\nprint(f'  0.5-0.7: Reasonable structure')\nprint(f'  < 0.5: Weak structure')",
        solution: "# Silhouette implemented",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Score calculated", description: "Silhouette score" }]),
        hints: ["a(i) = avg dist in same cluster", "b(i) = avg dist to nearest other", "s = (b-a)/max(a,b)"],
        xpReward: 25,
        order: 3,
      },
      {
        lessonId: lesson23_2_3.id,
        number: 4,
        title: "Find Optimal K",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use both elbow and silhouette to recommend optimal K.",
        starterCode: "import random\nimport math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef kmeans(data, k):\n    random.seed(42)\n    if k >= len(data): return list(range(len(data))), data[:]\n    centroids = [data[i][:] for i in random.sample(range(len(data)), k)]\n    for _ in range(50):\n        assignments = [min(range(k), key=lambda c: euclidean(p, centroids[c])) for p in data]\n        new_cents = [[sum(data[j][d] for j in range(len(data)) if assignments[j]==i)/max(1,assignments.count(i)) for d in range(2)] for i in range(k)]\n        centroids = new_cents\n    return assignments, centroids\n\ndef wcss(data, assignments, centroids):\n    return sum(euclidean(data[i], centroids[assignments[i]])**2 for i in range(len(data)))\n\ndef silhouette(data, assignments):\n    if len(set(assignments)) < 2: return 0\n    scores = []\n    for i in range(len(data)):\n        same = [data[j] for j in range(len(data)) if assignments[j]==assignments[i] and j!=i]\n        if not same: continue\n        a = sum(euclidean(data[i], p) for p in same) / len(same)\n        b = min(sum(euclidean(data[i], data[j]) for j in range(len(data)) if assignments[j]==c)/assignments.count(c) for c in set(assignments) if c != assignments[i])\n        scores.append((b - a) / max(a, b))\n    return sum(scores) / len(scores) if scores else 0\n\n# Data with unknown number of clusters\nrandom.seed(42)\ndata = [[random.gauss(c[0], 0.5), random.gauss(c[1], 0.5)] for c in [(2,2), (8,2), (5,7)] for _ in range(6)]\n\nprint('FINDING OPTIMAL K')\nprint('=' * 50)\nprint(f'{\"K\":>3} {\"WCSS\":>10} {\"WCSS Drop\":>12} {\"Silhouette\":>12}')\nprint('-' * 45)\n\nprev_wcss = None\nbest_sil_k = 2\nbest_sil = -1\n\nfor k in range(2, 7):\n    assignments, centroids = kmeans(data, k)\n    w = wcss(data, assignments, centroids)\n    s = silhouette(data, assignments)\n    drop = prev_wcss - w if prev_wcss else 0\n    print(f'{k:>3} {w:>10.1f} {drop:>12.1f} {s:>12.3f}')\n    if s > best_sil:\n        best_sil = s\n        best_sil_k = k\n    prev_wcss = w\n\nprint(f'\\n✓ Best silhouette at K={best_sil_k}')",
        solution: "# Optimal K found",
        testCases: JSON.stringify([{ input: "", expectedOutput: "K recommended", description: "Find optimal K" }]),
        hints: ["Calculate both metrics", "Track WCSS drop", "Find max silhouette"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson23_2_3.id,
        number: 5,
        title: "Elbow Detection Algorithm",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Automatically detect the elbow point in the WCSS curve.",
        starterCode: "def find_elbow(k_values, wcss_values):\n    \"\"\"Find elbow using the 'knee' method\"\"\"\n    # Calculate rate of change\n    n = len(k_values)\n    \n    # Method: Find where second derivative changes most\n    # Or: Find point farthest from line connecting first and last\n    \n    # Line from first to last point\n    x1, y1 = k_values[0], wcss_values[0]\n    x2, y2 = k_values[-1], wcss_values[-1]\n    \n    # Calculate distance from each point to the line\n    max_dist = 0\n    elbow_k = k_values[0]\n    \n    for i in range(len(k_values)):\n        x0, y0 = k_values[i], wcss_values[i]\n        # Distance from point to line\n        num = abs((y2-y1)*x0 - (x2-x1)*y0 + x2*y1 - y2*x1)\n        denom = ((y2-y1)**2 + (x2-x1)**2) ** 0.5\n        dist = num / denom if denom > 0 else 0\n        \n        if dist > max_dist:\n            max_dist = dist\n            elbow_k = k_values[i]\n    \n    return elbow_k\n\n# Test with different curves\nprint('AUTOMATIC ELBOW DETECTION')\nprint('=' * 50)\n\n# Clear elbow at K=3\ncurve1 = [(1, 500), (2, 200), (3, 100), (4, 80), (5, 70), (6, 65)]\nk1, w1 = zip(*curve1)\nelbow1 = find_elbow(list(k1), list(w1))\nprint(f'Curve 1: WCSS = {list(w1)}')\nprint(f'  Detected elbow: K={elbow1}')\n\n# Gradual curve (no clear elbow)\ncurve2 = [(1, 500), (2, 400), (3, 300), (4, 200), (5, 100), (6, 50)]\nk2, w2 = zip(*curve2)\nelbow2 = find_elbow(list(k2), list(w2))\nprint(f'\\nCurve 2: WCSS = {list(w2)}')\nprint(f'  Detected elbow: K={elbow2}')",
        solution: "# Elbow detected automatically",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Elbow found", description: "Elbow detection" }]),
        hints: ["Draw line from first to last", "Find point farthest from line", "That's the elbow"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 23.2.3`);

  console.log("\n✅ Part 2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
