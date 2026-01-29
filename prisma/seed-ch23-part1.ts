import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 1: Chapter 23 structure + Lessons 23.1.1-23.1.2...\n");

  const chapter23 = await prisma.chapter.upsert({
    where: { number: 23 },
    update: {},
    create: {
      number: 23,
      title: "Clustering",
      description: "Master unsupervised learning through clustering algorithms. Learn K-means, hierarchical clustering, and how to discover hidden patterns in unlabeled data.",
      objectives: [
        "Understand unsupervised learning concepts",
        "Implement K-means clustering from scratch",
        "Apply hierarchical clustering methods",
        "Choose optimal number of clusters",
        "Validate and interpret clustering results",
      ],
      isPublished: true,
    },
  });
  console.log(`✅ Chapter ${chapter23.number}: ${chapter23.title}`);

  const section23_1 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter23.id, number: 23.1 } },
    update: {},
    create: {
      chapterId: chapter23.id,
      number: 23.1,
      title: "Unsupervised Learning Foundations",
      description: "Introduction to learning without labels.",
      order: 1,
    },
  });
  console.log(`  📂 Section ${section23_1.number}: ${section23_1.title}`);

  const section23_2 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter23.id, number: 23.2 } },
    update: {},
    create: {
      chapterId: chapter23.id,
      number: 23.2,
      title: "K-Means Clustering",
      description: "The most popular clustering algorithm.",
      order: 2,
    },
  });
  console.log(`  📂 Section ${section23_2.number}: ${section23_2.title}`);

  const section23_3 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter23.id, number: 23.3 } },
    update: {},
    create: {
      chapterId: chapter23.id,
      number: 23.3,
      title: "Hierarchical Clustering",
      description: "Tree-based clustering methods.",
      order: 3,
    },
  });
  console.log(`  📂 Section ${section23_3.number}: ${section23_3.title}`);

  const section23_4 = await prisma.section.upsert({
    where: { chapterId_number: { chapterId: chapter23.id, number: 23.4 } },
    update: {},
    create: {
      chapterId: chapter23.id,
      number: 23.4,
      title: "Cluster Validation",
      description: "Evaluating clustering quality.",
      order: 4,
    },
  });
  console.log(`  📂 Section ${section23_4.number}: ${section23_4.title}`);

  // Lesson 23.1.1
  const lesson23_1_1 = await prisma.lesson.upsert({
    where: { slug: "unsupervised-learning-introduction" },
    update: {},
    create: {
      sectionId: section23_1.id,
      number: 23.11,
      title: "Unsupervised Learning Introduction",
      slug: "unsupervised-learning-introduction",
      objectives: [
        "Understand the difference from supervised learning",
        "Know when to use unsupervised methods",
        "Identify types of unsupervised tasks",
        "See real-world applications",
      ],
      content: `# Unsupervised Learning

## Supervised vs Unsupervised

| Supervised | Unsupervised |
|------------|--------------|
| Has labels (y) | No labels |
| "What is this?" | "What patterns exist?" |
| Predict | Discover |
| Classification/Regression | Clustering/Dimensionality Reduction |

## Why Unsupervised?

1. **Labels are expensive** - Manual labeling costs time and money
2. **Labels don't exist** - What groups exist in my customers?
3. **Exploration** - Discover unknown patterns
4. **Preprocessing** - Reduce dimensions, find features

## Types of Unsupervised Learning

### Clustering
Group similar items together.
- Customer segmentation
- Document categorization
- Image grouping

### Dimensionality Reduction
Reduce features while preserving information.
- PCA (Principal Component Analysis)
- Visualization (t-SNE, UMAP)

### Anomaly Detection
Find unusual data points.
- Fraud detection
- System monitoring

## The Challenge

No labels = No ground truth!

How do we know if our clustering is "good"?
→ This is a fundamental challenge of unsupervised learning.`,
      codeExamples: JSON.stringify([
        {
          id: "supervised-vs-unsupervised",
          title: "Supervised vs Unsupervised",
          code: "# Supervised: We have labels\nsupervised_data = [\n    ([5.1, 3.5], 'setosa'),      # Features AND label\n    ([7.0, 3.2], 'versicolor'),\n    ([6.3, 3.3], 'virginica'),\n]\n\nprint('SUPERVISED LEARNING')\nprint('=' * 50)\nprint('Data has labels (the answer is provided):')\nfor features, label in supervised_data:\n    print(f'  {features} → {label}')\nprint('\\nGoal: Learn to predict labels for new data')\n\n# Unsupervised: No labels\nunsupervised_data = [\n    [5.1, 3.5],  # Just features, no label\n    [7.0, 3.2],\n    [6.3, 3.3],\n    [4.9, 3.0],\n    [6.7, 3.0],\n    [5.8, 2.7],\n]\n\nprint('\\nUNSUPERVISED LEARNING')\nprint('=' * 50)\nprint('Data has NO labels:')\nfor features in unsupervised_data:\n    print(f'  {features} → ?')\nprint('\\nGoal: Discover patterns/structure in data')",
          description: "Compare supervised and unsupervised",
        },
        {
          id: "clustering-example",
          title: "Clustering Intuition",
          code: "import random\n\n# Generate clustered data (but we pretend we don't know the clusters)\nrandom.seed(42)\ndata = []\n\n# Cluster 1: around (2, 2)\nfor _ in range(5):\n    data.append([2 + random.gauss(0, 0.3), 2 + random.gauss(0, 0.3)])\n\n# Cluster 2: around (8, 8)\nfor _ in range(5):\n    data.append([8 + random.gauss(0, 0.3), 8 + random.gauss(0, 0.3)])\n\n# Cluster 3: around (2, 8)\nfor _ in range(5):\n    data.append([2 + random.gauss(0, 0.3), 8 + random.gauss(0, 0.3)])\n\nprint('CLUSTERING INTUITION')\nprint('=' * 50)\nprint('We have 15 unlabeled data points:')\nprint()\n\n# Simple visualization\nprint('Y')\nfor y in range(10, -1, -1):\n    row = f'{y:2d} |'\n    for x in range(11):\n        point_here = any(int(d[0]) == x and int(d[1]) == y for d in data)\n        row += ' *' if point_here else '  '\n    print(row)\nprint('   +' + '-' * 22)\nprint('     0 1 2 3 4 5 6 7 8 9 10  X')\n\nprint('\\n💡 Can you see 3 natural groups?')\nprint('   Clustering algorithms find these automatically!')",
          description: "Visualize clustering intuition",
        },
        {
          id: "applications",
          title: "Real-World Applications",
          code: "applications = [\n    {\n        'domain': 'Marketing',\n        'task': 'Customer Segmentation',\n        'description': 'Group customers by purchasing behavior',\n        'benefit': 'Targeted marketing campaigns'\n    },\n    {\n        'domain': 'Biology',\n        'task': 'Gene Expression Analysis',\n        'description': 'Group genes with similar expression patterns',\n        'benefit': 'Discover gene functions'\n    },\n    {\n        'domain': 'Finance',\n        'task': 'Fraud Detection',\n        'description': 'Find transactions that don\\'t fit normal patterns',\n        'benefit': 'Catch fraudulent activity'\n    },\n    {\n        'domain': 'Image Processing',\n        'task': 'Image Compression',\n        'description': 'Reduce colors by clustering similar pixels',\n        'benefit': 'Smaller file sizes'\n    },\n    {\n        'domain': 'Text Mining',\n        'task': 'Document Clustering',\n        'description': 'Group similar documents together',\n        'benefit': 'Organize large document collections'\n    },\n]\n\nprint('UNSUPERVISED LEARNING APPLICATIONS')\nprint('=' * 60)\n\nfor app in applications:\n    print(f'\\n📊 {app[\"domain\"]}: {app[\"task\"]}')\n    print(f'   What: {app[\"description\"]}')\n    print(f'   Why: {app[\"benefit\"]}')",
          description: "Real-world unsupervised learning applications",
        },
      ]),
      keyPoints: [
        "Unsupervised: no labels, discover patterns",
        "Supervised: has labels, predict outcomes",
        "Clustering groups similar items",
        "No ground truth makes evaluation hard",
        "Used when labels are expensive or don't exist",
        "Applications: segmentation, anomaly detection, compression",
      ],
      hardwareDemo: "Compare labeled vs unlabeled data in memory. See structure without labels.",
      estimatedTime: 25,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson23_1_1.number}: ${lesson23_1_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson23_1_1.id,
        number: 1,
        title: "Identify Learning Type",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Classify each problem as supervised or unsupervised learning.",
        starterCode: "problems = [\n    ('Predict house prices from features', 'supervised'),\n    ('Group customers by shopping behavior', 'unsupervised'),\n    ('Classify emails as spam or not', 'supervised'),\n    ('Find unusual network traffic patterns', 'unsupervised'),\n    ('Predict if a patient has diabetes', 'supervised'),\n    ('Discover topics in a document collection', 'unsupervised'),\n    ('Recommend movies based on ratings', 'supervised'),\n    ('Compress image colors', 'unsupervised'),\n]\n\nprint('SUPERVISED vs UNSUPERVISED')\nprint('=' * 60)\n\nfor problem, answer in problems:\n    indicator = '🏷️' if answer == 'supervised' else '🔍'\n    print(f'{indicator} {problem}')\n    print(f'   → {answer.upper()}')",
        solution: "# Problem types identified",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Types shown", description: "Learning types" }]),
        hints: ["Has labels = supervised", "Find patterns = unsupervised", "Predict = usually supervised"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson23_1_1.id,
        number: 2,
        title: "Generate Clustered Data",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Generate data with natural clusters (but don't label it).",
        starterCode: "import random\n\ndef generate_cluster(center_x, center_y, n_points, spread=0.5):\n    \"\"\"Generate points around a center\"\"\"\n    points = []\n    for _ in range(n_points):\n        x = center_x + random.gauss(0, spread)\n        y = center_y + random.gauss(0, spread)\n        points.append([x, y])\n    return points\n\nrandom.seed(42)\n\n# Generate 3 clusters (but data is unlabeled!)\nall_data = []\nall_data.extend(generate_cluster(2, 2, 10))\nall_data.extend(generate_cluster(8, 3, 10))\nall_data.extend(generate_cluster(5, 8, 10))\n\nprint('GENERATED UNLABELED DATA')\nprint('=' * 45)\nprint(f'Total points: {len(all_data)}')\nprint(f'\\nFirst 5 points:')\nfor i, point in enumerate(all_data[:5]):\n    print(f'  Point {i+1}: [{point[0]:.2f}, {point[1]:.2f}]')\n\nprint(f'\\n💡 Data has structure, but NO labels!')\nprint('   Clustering will discover the groups.')",
        solution: "# Clustered data generated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "30 points", description: "Generate clusters" }]),
        hints: ["Use Gaussian around centers", "Combine all points", "No labels attached"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson23_1_1.id,
        number: 3,
        title: "Visualize Unlabeled Data",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a simple text visualization of 2D unlabeled data.",
        starterCode: "import random\n\nrandom.seed(42)\n\n# Generate data with hidden structure\ndata = []\nfor _ in range(8):\n    data.append([1 + random.random(), 1 + random.random()])  # Bottom-left\nfor _ in range(8):\n    data.append([8 + random.random(), 8 + random.random()])  # Top-right\n\ndef visualize(data, width=12, height=10):\n    \"\"\"Simple text visualization\"\"\"\n    grid = [['.' for _ in range(width)] for _ in range(height)]\n    \n    for x, y in data:\n        gx = int(x * (width-1) / 10)\n        gy = int(y * (height-1) / 10)\n        if 0 <= gx < width and 0 <= gy < height:\n            grid[height - 1 - gy][gx] = '*'\n    \n    print('Y')\n    for row in grid:\n        print('  |' + ''.join(row))\n    print('  +' + '-' * width)\n    print('   X')\n\nprint('UNLABELED DATA VISUALIZATION')\nprint('=' * 40)\nprint(f'{len(data)} points, no labels\\n')\n\nvisualize(data)\n\nprint('\\n💡 Can you see the two groups?')\nprint('   A clustering algorithm will find them!')",
        solution: "# Data visualized",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Grid shown", description: "Visualize data" }]),
        hints: ["Map coordinates to grid", "Mark points with *", "Show structure visually"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson23_1_1.id,
        number: 4,
        title: "The Challenge: No Ground Truth",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Demonstrate why evaluating unsupervised learning is challenging.",
        starterCode: "import random\n\nrandom.seed(42)\n\n# Same data, two different \"clusterings\"\ndata = [[1, 1], [1, 2], [2, 1], [8, 8], [8, 9], [9, 8]]\n\n# Clustering A: by visual proximity (2 clusters)\nclustering_a = [0, 0, 0, 1, 1, 1]\n\n# Clustering B: odd vs even indices (2 clusters)\nclustering_b = [0, 1, 0, 1, 0, 1]\n\nprint('THE UNSUPERVISED LEARNING CHALLENGE')\nprint('=' * 55)\nprint('Same data, two different clusterings:\\n')\n\nprint('Data points:', data)\nprint()\n\nprint('Clustering A (by proximity):')\nfor i, (point, cluster) in enumerate(zip(data, clustering_a)):\n    print(f'  Point {point} → Cluster {cluster}')\n\nprint('\\nClustering B (odd/even index):')\nfor i, (point, cluster) in enumerate(zip(data, clustering_b)):\n    print(f'  Point {point} → Cluster {cluster}')\n\nprint('\\n❓ Which clustering is \"correct\"?')\nprint('   Without labels, there\\'s no definitive answer!')\nprint('   We need other ways to evaluate quality.')",
        solution: "# Challenge demonstrated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Challenge shown", description: "No ground truth" }]),
        hints: ["Show same data, different groupings", "Both are valid clusterings", "No labels to check against"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson23_1_1.id,
        number: 5,
        title: "Clustering Use Case",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Design a customer segmentation scenario showing why clustering is useful.",
        starterCode: "# Customer data (no predefined segments)\ncustomers = [\n    {'id': 1, 'age': 22, 'spending': 150, 'visits': 12},\n    {'id': 2, 'age': 25, 'spending': 180, 'visits': 15},\n    {'id': 3, 'age': 45, 'spending': 500, 'visits': 4},\n    {'id': 4, 'age': 48, 'spending': 450, 'visits': 3},\n    {'id': 5, 'age': 35, 'spending': 200, 'visits': 8},\n    {'id': 6, 'age': 23, 'spending': 120, 'visits': 20},\n    {'id': 7, 'age': 50, 'spending': 600, 'visits': 2},\n    {'id': 8, 'age': 28, 'spending': 160, 'visits': 10},\n]\n\nprint('CUSTOMER SEGMENTATION USE CASE')\nprint('=' * 55)\nprint('We have customer data but NO predefined segments:\\n')\n\nprint(f'{\"ID\":>4} {\"Age\":>6} {\"Spending\":>10} {\"Visits\":>8}')\nprint('-' * 32)\nfor c in customers:\n    print(f'{c[\"id\"]:>4} {c[\"age\"]:>6} ${c[\"spending\"]:>9} {c[\"visits\"]:>8}')\n\nprint('\\n💡 Clustering could discover segments like:')\nprint('   • Young frequent shoppers (low spend, high visits)')\nprint('   • Mature high-value customers (high spend, low visits)')\nprint('   • Middle-ground customers')\n\nprint('\\n✓ Marketing can then target each segment differently!')",
        solution: "# Segmentation scenario",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Use case shown", description: "Customer segmentation" }]),
        hints: ["Show raw data", "Suggest possible segments", "Explain business value"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 23.1.1`);

  // Lesson 23.1.2
  const lesson23_1_2 = await prisma.lesson.upsert({
    where: { slug: "clustering-concepts-applications" },
    update: {},
    create: {
      sectionId: section23_1.id,
      number: 23.12,
      title: "Clustering Concepts and Applications",
      slug: "clustering-concepts-applications",
      objectives: [
        "Define clustering formally",
        "Understand intra-cluster vs inter-cluster distance",
        "Know different types of clustering",
        "See how clustering is applied",
      ],
      content: `# Clustering Concepts

## What Is Clustering?

Partitioning data into groups (clusters) where:
- Points in the **same cluster** are similar
- Points in **different clusters** are dissimilar

## Key Concepts

### Intra-cluster Distance
Distance between points WITHIN the same cluster.
**Goal**: Minimize (compact clusters)

### Inter-cluster Distance
Distance between different clusters.
**Goal**: Maximize (well-separated clusters)

### Centroid
The center point of a cluster (often the mean).

## Types of Clustering

### Partitioning (K-Means)
- Divide data into K non-overlapping groups
- Each point belongs to exactly one cluster
- Must specify K in advance

### Hierarchical
- Build a tree of clusters
- Can cut at any level for different K
- Agglomerative (bottom-up) or Divisive (top-down)

### Density-Based (DBSCAN)
- Clusters are dense regions
- Can find arbitrary shapes
- Identifies outliers naturally

## Distance Metrics

- **Euclidean**: Straight-line distance (most common)
- **Manhattan**: Sum of absolute differences
- **Cosine**: Angle between vectors (for text)`,
      codeExamples: JSON.stringify([
        {
          id: "cluster-quality",
          title: "Cluster Quality Concepts",
          code: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef intra_cluster_distance(cluster):\n    \"\"\"Average distance between points in a cluster\"\"\"\n    if len(cluster) < 2:\n        return 0\n    total = 0\n    count = 0\n    for i, p1 in enumerate(cluster):\n        for p2 in cluster[i+1:]:\n            total += euclidean(p1, p2)\n            count += 1\n    return total / count if count > 0 else 0\n\ndef inter_cluster_distance(cluster1, cluster2):\n    \"\"\"Average distance between two clusters\"\"\"\n    total = 0\n    for p1 in cluster1:\n        for p2 in cluster2:\n            total += euclidean(p1, p2)\n    return total / (len(cluster1) * len(cluster2))\n\n# Example clusters\ncluster_a = [[1, 1], [1, 2], [2, 1]]  # Tight cluster\ncluster_b = [[8, 8], [8, 9], [9, 8]]  # Another tight cluster\ncluster_c = [[1, 1], [5, 5], [9, 9]]  # Spread out\n\nprint('CLUSTER QUALITY METRICS')\nprint('=' * 50)\n\nprint('\\nIntra-cluster distance (lower = tighter):')\nprint(f'  Cluster A: {intra_cluster_distance(cluster_a):.2f}')\nprint(f'  Cluster B: {intra_cluster_distance(cluster_b):.2f}')\nprint(f'  Cluster C: {intra_cluster_distance(cluster_c):.2f} ← too spread!')\n\nprint('\\nInter-cluster distance (higher = better separated):')\nprint(f'  A to B: {inter_cluster_distance(cluster_a, cluster_b):.2f} ← well separated')\nprint(f'  A to C: {inter_cluster_distance(cluster_a, cluster_c):.2f}')",
          description: "Understand cluster quality metrics",
        },
        {
          id: "centroid",
          title: "Computing Centroids",
          code: "def compute_centroid(cluster):\n    \"\"\"Compute the center (mean) of a cluster\"\"\"\n    n = len(cluster)\n    if n == 0:\n        return None\n    \n    n_features = len(cluster[0])\n    centroid = []\n    \n    for f in range(n_features):\n        mean = sum(point[f] for point in cluster) / n\n        centroid.append(mean)\n    \n    return centroid\n\n# Example clusters\ncluster1 = [[1, 2], [2, 3], [3, 2], [2, 1]]\ncluster2 = [[8, 8], [9, 9], [8, 9], [9, 8]]\n\nprint('COMPUTING CENTROIDS')\nprint('=' * 45)\n\nfor i, cluster in enumerate([cluster1, cluster2], 1):\n    centroid = compute_centroid(cluster)\n    print(f'\\nCluster {i}:')\n    print(f'  Points: {cluster}')\n    print(f'  Centroid: [{centroid[0]:.1f}, {centroid[1]:.1f}]')\n\nprint('\\n💡 Centroid is the \"representative\" of a cluster')\nprint('   K-means uses centroids to assign points')",
          description: "Calculate cluster centroids",
        },
        {
          id: "distance-metrics",
          title: "Distance Metrics",
          code: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef manhattan(a, b):\n    return sum(abs(ai - bi) for ai, bi in zip(a, b))\n\ndef cosine_distance(a, b):\n    dot = sum(ai * bi for ai, bi in zip(a, b))\n    norm_a = math.sqrt(sum(ai ** 2 for ai in a))\n    norm_b = math.sqrt(sum(bi ** 2 for bi in b))\n    if norm_a == 0 or norm_b == 0:\n        return 1.0\n    similarity = dot / (norm_a * norm_b)\n    return 1 - similarity  # Convert to distance\n\n# Test points\na = [1, 0]\nb = [3, 4]\n\nprint('DISTANCE METRICS')\nprint('=' * 45)\nprint(f'Point A: {a}')\nprint(f'Point B: {b}')\nprint()\nprint(f'Euclidean: {euclidean(a, b):.2f} (straight line)')\nprint(f'Manhattan: {manhattan(a, b):.2f} (grid/city blocks)')\nprint(f'Cosine:    {cosine_distance(a, b):.2f} (angle-based)')\n\nprint('\\nWhen to use each:')\nprint('  • Euclidean: General purpose, continuous features')\nprint('  • Manhattan: When features are on different scales')\nprint('  • Cosine: Text data, direction matters more than magnitude')",
          description: "Compare different distance metrics",
        },
      ]),
      keyPoints: [
        "Clustering: group similar, separate dissimilar",
        "Intra-cluster: within cluster (minimize)",
        "Inter-cluster: between clusters (maximize)",
        "Centroid: cluster center point",
        "Partitioning vs hierarchical vs density-based",
        "Distance metric choice affects results",
      ],
      hardwareDemo: "Watch distance calculations. See centroids update.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson23_1_2.number}: ${lesson23_1_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson23_1_2.id,
        number: 1,
        title: "Calculate Centroid",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Implement a function to calculate the centroid of a cluster.",
        starterCode: "def centroid(cluster):\n    \"\"\"Calculate centroid (mean point) of cluster\"\"\"\n    n = len(cluster)\n    n_dims = len(cluster[0])\n    \n    result = []\n    for d in range(n_dims):\n        mean = sum(point[d] for point in cluster) / n\n        result.append(mean)\n    \n    return result\n\n# Test\ncluster = [[0, 0], [4, 0], [2, 4]]\n\nprint('CENTROID CALCULATION')\nprint('=' * 40)\nprint(f'Cluster points: {cluster}')\nc = centroid(cluster)\nprint(f'Centroid: [{c[0]:.1f}, {c[1]:.1f}]')\n\n# Verify\nprint(f'\\nVerification:')\nprint(f'  x: (0 + 4 + 2) / 3 = {(0+4+2)/3:.1f}')\nprint(f'  y: (0 + 0 + 4) / 3 = {(0+0+4)/3:.1f}')",
        solution: "# Centroid calculated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "[2.0, 1.3]", description: "Calculate centroid" }]),
        hints: ["Average each dimension separately", "Sum / count for each coordinate", "Works for any dimensions"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson23_1_2.id,
        number: 2,
        title: "Implement Distance Metrics",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement Euclidean and Manhattan distance functions.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    \"\"\"Euclidean (straight-line) distance\"\"\"\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef manhattan(a, b):\n    \"\"\"Manhattan (city block) distance\"\"\"\n    return sum(abs(ai - bi) for ai, bi in zip(a, b))\n\n# Test\np1 = [0, 0]\np2 = [3, 4]\n\nprint('DISTANCE METRICS')\nprint('=' * 40)\nprint(f'Point 1: {p1}')\nprint(f'Point 2: {p2}')\nprint(f'\\nEuclidean: {euclidean(p1, p2):.2f}')\nprint(f'Manhattan: {manhattan(p1, p2):.2f}')\n\nprint('\\nVisualization:')\nprint('  4 |       * P2')\nprint('  3 |      /')\nprint('  2 |     /  Euclidean: diagonal')\nprint('  1 |    /')\nprint('  0 * P1 -----> Manhattan: grid path')\nprint('    0 1 2 3 ')",
        solution: "# Distance metrics implemented",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Euclidean: 5, Manhattan: 7", description: "Distance metrics" }]),
        hints: ["Euclidean: sqrt(sum of squares)", "Manhattan: sum of absolutes", "Both take two points"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson23_1_2.id,
        number: 3,
        title: "Intra-Cluster Distance",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate the average distance between all pairs of points in a cluster.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef intra_cluster_distance(cluster):\n    \"\"\"Average pairwise distance within cluster\"\"\"\n    if len(cluster) < 2:\n        return 0\n    \n    total_distance = 0\n    pair_count = 0\n    \n    for i in range(len(cluster)):\n        for j in range(i + 1, len(cluster)):\n            total_distance += euclidean(cluster[i], cluster[j])\n            pair_count += 1\n    \n    return total_distance / pair_count\n\n# Test with tight vs loose clusters\ntight_cluster = [[0, 0], [1, 0], [0, 1], [1, 1]]\nloose_cluster = [[0, 0], [5, 0], [0, 5], [5, 5]]\n\nprint('INTRA-CLUSTER DISTANCE')\nprint('=' * 45)\nprint('Measures how compact a cluster is\\n')\n\nprint(f'Tight cluster: {tight_cluster}')\nprint(f'  Intra-distance: {intra_cluster_distance(tight_cluster):.2f}')\n\nprint(f'\\nLoose cluster: {loose_cluster}')\nprint(f'  Intra-distance: {intra_cluster_distance(loose_cluster):.2f}')\n\nprint('\\n💡 Lower = more compact = better cluster')",
        solution: "# Intra-cluster distance",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Tight < Loose", description: "Intra-cluster" }]),
        hints: ["Iterate all pairs", "Avoid counting twice", "Average the distances"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson23_1_2.id,
        number: 4,
        title: "Compare Clustering Quality",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Compare two different clusterings of the same data.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef cluster_quality(clusters):\n    \"\"\"Calculate total intra-cluster distance\"\"\"\n    total = 0\n    for cluster in clusters:\n        if len(cluster) < 2:\n            continue\n        for i in range(len(cluster)):\n            for j in range(i + 1, len(cluster)):\n                total += euclidean(cluster[i], cluster[j])\n    return total\n\n# Data points\ndata = [[0, 0], [1, 0], [0, 1], [9, 9], [10, 9], [9, 10]]\n\n# Clustering A: Natural grouping\nclustering_a = [\n    [[0, 0], [1, 0], [0, 1]],      # Left cluster\n    [[9, 9], [10, 9], [9, 10]]     # Right cluster\n]\n\n# Clustering B: Bad grouping\nclustering_b = [\n    [[0, 0], [9, 9], [0, 1]],      # Mixed!\n    [[1, 0], [10, 9], [9, 10]]     # Mixed!\n]\n\nprint('COMPARING CLUSTERINGS')\nprint('=' * 50)\n\nquality_a = cluster_quality(clustering_a)\nquality_b = cluster_quality(clustering_b)\n\nprint('Clustering A (natural groups):')\nfor i, c in enumerate(clustering_a):\n    print(f'  Cluster {i+1}: {c}')\nprint(f'  Total intra-distance: {quality_a:.2f}')\n\nprint('\\nClustering B (bad grouping):')\nfor i, c in enumerate(clustering_b):\n    print(f'  Cluster {i+1}: {c}')\nprint(f'  Total intra-distance: {quality_b:.2f}')\n\nprint(f'\\n✓ Clustering A is better (lower distance: {quality_a:.2f} < {quality_b:.2f})')",
        solution: "# Natural grouping wins",
        testCases: JSON.stringify([{ input: "", expectedOutput: "A is better", description: "Compare clusterings" }]),
        hints: ["Calculate quality for each", "Lower total distance = better", "Natural groups are compact"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson23_1_2.id,
        number: 5,
        title: "Assign Point to Nearest Centroid",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement a function to assign a point to the nearest cluster centroid.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef assign_to_nearest(point, centroids):\n    \"\"\"Return index of nearest centroid\"\"\"\n    min_dist = float('inf')\n    nearest = 0\n    \n    for i, centroid in enumerate(centroids):\n        dist = euclidean(point, centroid)\n        if dist < min_dist:\n            min_dist = dist\n            nearest = i\n    \n    return nearest, min_dist\n\n# Three cluster centroids\ncentroids = [\n    [2, 2],   # Cluster 0\n    [8, 2],   # Cluster 1\n    [5, 8],   # Cluster 2\n]\n\n# Test points\ntest_points = [[1, 1], [7, 3], [6, 7], [5, 5]]\n\nprint('ASSIGN TO NEAREST CENTROID')\nprint('=' * 50)\nprint(f'Centroids: {centroids}\\n')\n\nprint(f'{\"Point\":>12} {\"Nearest\":>10} {\"Distance\":>10}')\nprint('-' * 35)\nfor point in test_points:\n    nearest, dist = assign_to_nearest(point, centroids)\n    print(f'{str(point):>12} {\"Cluster \" + str(nearest):>10} {dist:>10.2f}')",
        solution: "# Points assigned to nearest",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Assignments shown", description: "Nearest centroid" }]),
        hints: ["Calculate distance to each centroid", "Track minimum distance", "Return cluster index"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 23.1.2`);

  console.log("\n✅ Part 1 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
