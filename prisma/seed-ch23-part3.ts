import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 3: Lessons 23.3.1-23.3.3 (Hierarchical Clustering)...\n");

  const section23_3 = await prisma.section.findFirst({ where: { number: 23.3 } });
  if (!section23_3) throw new Error("Section 23.3 not found. Run part 1 first.");

  // Lesson 23.3.1
  const lesson23_3_1 = await prisma.lesson.upsert({
    where: { slug: "hierarchical-clustering-intro" },
    update: {},
    create: {
      sectionId: section23_3.id,
      number: 23.31,
      title: "Hierarchical Clustering",
      slug: "hierarchical-clustering-intro",
      objectives: [
        "Understand hierarchical clustering concept",
        "Know agglomerative vs divisive approaches",
        "See how clusters merge step by step",
        "Compare with K-means",
      ],
      content: `# Hierarchical Clustering

## What Is It?

Build a **hierarchy** (tree) of clusters rather than flat partitions.

## Two Approaches

### Agglomerative (Bottom-Up)
1. Start: Each point is its own cluster
2. Merge: Combine two closest clusters
3. Repeat: Until one cluster remains

### Divisive (Top-Down)
1. Start: All points in one cluster
2. Split: Divide into two clusters
3. Repeat: Until each point is its own cluster

**Agglomerative is more common and practical.**

## Agglomerative Algorithm

\`\`\`
1. Assign each point to its own cluster
2. Calculate distances between all clusters
3. Merge the two closest clusters
4. Repeat steps 2-3 until one cluster
\`\`\`

## Advantages Over K-Means

✅ Don't need to specify K in advance
✅ Produces a hierarchy (dendrogram)
✅ Can cut at any level for different K
✅ Deterministic (no random initialization)

## Disadvantages

❌ Slower: O(n³) vs O(n·k·i) for K-means
❌ Greedy: Can't undo a merge
❌ Sensitive to noise and outliers`,
      codeExamples: JSON.stringify([
        {
          id: "agglomerative-steps",
          title: "Agglomerative Clustering Steps",
          code: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef cluster_distance(c1, c2):\n    \"\"\"Distance between clusters (using centroids)\"\"\"\n    cent1 = [sum(p[d] for p in c1) / len(c1) for d in range(len(c1[0]))]\n    cent2 = [sum(p[d] for p in c2) / len(c2) for d in range(len(c2[0]))]\n    return euclidean(cent1, cent2)\n\n# Simple data\ndata = [[1, 1], [1.5, 1.5], [5, 5], [5.5, 5]]\nlabels = ['A', 'B', 'C', 'D']\n\nprint('AGGLOMERATIVE CLUSTERING STEPS')\nprint('=' * 55)\nprint(f'Data: {dict(zip(labels, data))}')\n\n# Start: each point is a cluster\nclusters = [[p] for p in data]\ncluster_labels = [[l] for l in labels]\n\nstep = 0\nwhile len(clusters) > 1:\n    step += 1\n    \n    # Find closest pair\n    min_dist = float('inf')\n    merge_i, merge_j = 0, 1\n    for i in range(len(clusters)):\n        for j in range(i + 1, len(clusters)):\n            d = cluster_distance(clusters[i], clusters[j])\n            if d < min_dist:\n                min_dist = d\n                merge_i, merge_j = i, j\n    \n    # Merge\n    print(f'\\nStep {step}: Merge {cluster_labels[merge_i]} and {cluster_labels[merge_j]}')\n    print(f'  Distance: {min_dist:.2f}')\n    \n    clusters[merge_i] = clusters[merge_i] + clusters[merge_j]\n    cluster_labels[merge_i] = cluster_labels[merge_i] + cluster_labels[merge_j]\n    del clusters[merge_j]\n    del cluster_labels[merge_j]\n    \n    print(f'  Clusters now: {cluster_labels}')",
          description: "Walk through agglomerative clustering",
        },
        {
          id: "vs-kmeans",
          title: "Hierarchical vs K-Means",
          code: "print('HIERARCHICAL vs K-MEANS COMPARISON')\nprint('=' * 60)\n\ncomparison = [\n    ('Aspect', 'K-Means', 'Hierarchical'),\n    ('-' * 20, '-' * 18, '-' * 18),\n    ('Need K upfront', 'YES', 'NO'),\n    ('Output', 'Flat clusters', 'Tree (dendrogram)'),\n    ('Deterministic', 'NO (random init)', 'YES'),\n    ('Time complexity', 'O(n·k·iterations)', 'O(n³) or O(n²log n)'),\n    ('Can undo merges', 'N/A', 'NO (greedy)'),\n    ('Handles large data', 'YES', 'Difficult'),\n    ('Cluster shapes', 'Spherical', 'Flexible'),\n]\n\nfor row in comparison:\n    print(f'{row[0]:<20} {row[1]:<18} {row[2]:<18}')\n\nprint('\\nWhen to use Hierarchical:')\nprint('  • Want to explore different K values')\nprint('  • Need a cluster hierarchy')\nprint('  • Small to medium dataset')\nprint('  • Want deterministic results')\n\nprint('\\nWhen to use K-Means:')\nprint('  • Know K in advance')\nprint('  • Large dataset')\nprint('  • Need speed')\nprint('  • Clusters are roughly spherical')",
          description: "Compare hierarchical and K-means",
        },
        {
          id: "simple-implementation",
          title: "Simple Agglomerative Clustering",
          code: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef agglomerative(data, n_clusters=2):\n    \"\"\"Simple agglomerative clustering\"\"\"\n    # Start: each point is a cluster\n    clusters = [[i] for i in range(len(data))]\n    \n    # Track merge history\n    history = []\n    \n    while len(clusters) > n_clusters:\n        # Find closest pair using single linkage\n        min_dist = float('inf')\n        merge_i, merge_j = 0, 1\n        \n        for i in range(len(clusters)):\n            for j in range(i + 1, len(clusters)):\n                # Min distance between any points in clusters\n                for pi in clusters[i]:\n                    for pj in clusters[j]:\n                        d = euclidean(data[pi], data[pj])\n                        if d < min_dist:\n                            min_dist = d\n                            merge_i, merge_j = i, j\n        \n        # Merge\n        history.append((clusters[merge_i].copy(), clusters[merge_j].copy(), min_dist))\n        clusters[merge_i] = clusters[merge_i] + clusters[merge_j]\n        del clusters[merge_j]\n    \n    # Convert to labels\n    labels = [0] * len(data)\n    for cluster_id, cluster in enumerate(clusters):\n        for point_id in cluster:\n            labels[point_id] = cluster_id\n    \n    return labels, history\n\n# Test\ndata = [[1, 1], [1, 2], [2, 1], [8, 8], [8, 9], [9, 8]]\nlabels, history = agglomerative(data, n_clusters=2)\n\nprint('AGGLOMERATIVE CLUSTERING')\nprint('=' * 45)\nprint(f'Data: {data}')\nprint(f'\\nFinal labels: {labels}')\nprint(f'\\nMerge history:')\nfor i, (c1, c2, dist) in enumerate(history):\n    print(f'  Step {i+1}: Merge clusters with points {c1} and {c2} (dist={dist:.2f})')",
          description: "Simple agglomerative implementation",
        },
      ]),
      keyPoints: [
        "Hierarchical: builds tree of clusters",
        "Agglomerative: bottom-up merging",
        "Divisive: top-down splitting",
        "No need to specify K in advance",
        "Produces dendrogram visualization",
        "Slower than K-means, but more flexible",
      ],
      hardwareDemo: "Watch clusters merge one by one. See tree grow.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson23_3_1.number}: ${lesson23_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson23_3_1.id,
        number: 1,
        title: "Initialize Clusters",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create initial clusters where each point is its own cluster.",
        starterCode: "data = [[1, 1], [2, 2], [8, 8], [9, 9]]\n\n# Each point starts as its own cluster\nclusters = [[point] for point in data]\n\nprint('INITIAL CLUSTERS')\nprint('=' * 40)\nprint(f'Data points: {data}')\nprint(f'Number of points: {len(data)}')\nprint(f'\\nInitial clusters (one per point):')\nfor i, cluster in enumerate(clusters):\n    print(f'  Cluster {i}: {cluster}')\n\nprint(f'\\nTotal clusters: {len(clusters)}')\nprint('\\n💡 Agglomerative clustering starts here')\nprint('   and merges clusters until desired number')",
        solution: "# Each point is own cluster",
        testCases: JSON.stringify([{ input: "", expectedOutput: "4 clusters", description: "Initialize clusters" }]),
        hints: ["One cluster per point", "Use list comprehension", "Each cluster is a list of points"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson23_3_1.id,
        number: 2,
        title: "Find Closest Clusters",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find the two closest clusters to merge.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef find_closest_clusters(clusters):\n    \"\"\"Find indices of two closest clusters\"\"\"\n    min_dist = float('inf')\n    closest_i, closest_j = 0, 1\n    \n    for i in range(len(clusters)):\n        for j in range(i + 1, len(clusters)):\n            # Use centroid distance\n            cent_i = [sum(p[d] for p in clusters[i])/len(clusters[i]) for d in range(len(clusters[i][0]))]\n            cent_j = [sum(p[d] for p in clusters[j])/len(clusters[j]) for d in range(len(clusters[j][0]))]\n            dist = euclidean(cent_i, cent_j)\n            \n            if dist < min_dist:\n                min_dist = dist\n                closest_i, closest_j = i, j\n    \n    return closest_i, closest_j, min_dist\n\n# Test\nclusters = [[[1, 1]], [[2, 2]], [[10, 10]], [[11, 11]]]\n\nprint('FINDING CLOSEST CLUSTERS')\nprint('=' * 45)\nprint('Clusters:')\nfor i, c in enumerate(clusters):\n    print(f'  {i}: {c}')\n\ni, j, dist = find_closest_clusters(clusters)\nprint(f'\\nClosest pair: clusters {i} and {j}')\nprint(f'Distance: {dist:.2f}')",
        solution: "# Closest clusters found",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Closest pair", description: "Find closest" }]),
        hints: ["Compare all pairs", "Track minimum distance", "Return indices"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson23_3_1.id,
        number: 3,
        title: "Merge Two Clusters",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Merge two clusters into one.",
        starterCode: "def merge_clusters(clusters, i, j):\n    \"\"\"Merge clusters i and j, return new cluster list\"\"\"\n    # Combine points from both clusters\n    merged = clusters[i] + clusters[j]\n    \n    # Create new list without original i and j\n    new_clusters = []\n    for k, cluster in enumerate(clusters):\n        if k != i and k != j:\n            new_clusters.append(cluster)\n    \n    # Add merged cluster\n    new_clusters.append(merged)\n    \n    return new_clusters\n\n# Test\nclusters = [[[1, 1]], [[2, 2]], [[10, 10]], [[11, 11]]]\n\nprint('MERGING CLUSTERS')\nprint('=' * 45)\nprint('Before merge:')\nfor i, c in enumerate(clusters):\n    print(f'  Cluster {i}: {c}')\n\n# Merge clusters 0 and 1\nnew_clusters = merge_clusters(clusters, 0, 1)\n\nprint('\\nAfter merging clusters 0 and 1:')\nfor i, c in enumerate(new_clusters):\n    print(f'  Cluster {i}: {c}')\n\nprint(f'\\nCluster count: {len(clusters)} → {len(new_clusters)}')",
        solution: "# Clusters merged",
        testCases: JSON.stringify([{ input: "", expectedOutput: "3 clusters after", description: "Merge clusters" }]),
        hints: ["Combine point lists", "Remove original two", "Add merged cluster"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson23_3_1.id,
        number: 4,
        title: "Complete Agglomerative Algorithm",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement full agglomerative clustering that stops at K clusters.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef agglomerative_clustering(data, k):\n    \"\"\"Agglomerative clustering to k clusters\"\"\"\n    # Initialize: each point is a cluster\n    clusters = [[p] for p in data]\n    history = []\n    \n    while len(clusters) > k:\n        # Find closest pair\n        min_dist = float('inf')\n        merge_i, merge_j = 0, 1\n        \n        for i in range(len(clusters)):\n            for j in range(i + 1, len(clusters)):\n                # Centroid distance\n                ci = [sum(p[d] for p in clusters[i])/len(clusters[i]) for d in range(len(data[0]))]\n                cj = [sum(p[d] for p in clusters[j])/len(clusters[j]) for d in range(len(data[0]))]\n                dist = euclidean(ci, cj)\n                if dist < min_dist:\n                    min_dist = dist\n                    merge_i, merge_j = i, j\n        \n        # Record merge\n        history.append((len(clusters[merge_i]), len(clusters[merge_j]), min_dist))\n        \n        # Merge\n        clusters[merge_i] = clusters[merge_i] + clusters[merge_j]\n        del clusters[merge_j]\n    \n    return clusters, history\n\n# Test\ndata = [[1, 1], [1, 2], [2, 1], [8, 8], [8, 9], [9, 8]]\n\nclusters, history = agglomerative_clustering(data, k=2)\n\nprint('AGGLOMERATIVE CLUSTERING')\nprint('=' * 45)\nprint(f'Data: {data}')\nprint(f'Target K: 2\\n')\n\nprint('Merge history:')\nfor i, (s1, s2, d) in enumerate(history):\n    print(f'  Step {i+1}: Merged clusters of size {s1} and {s2} (dist={d:.2f})')\n\nprint(f'\\nFinal {len(clusters)} clusters:')\nfor i, c in enumerate(clusters):\n    print(f'  Cluster {i}: {c}')",
        solution: "# Full agglomerative clustering",
        testCases: JSON.stringify([{ input: "", expectedOutput: "2 clusters", description: "Complete agglomerative" }]),
        hints: ["Loop until k clusters", "Find and merge closest", "Track history"],
        xpReward: 25,
        order: 4,
      },
      {
        lessonId: lesson23_3_1.id,
        number: 5,
        title: "Get Cluster Labels",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Convert cluster structure to point labels.",
        starterCode: "def clusters_to_labels(data, clusters):\n    \"\"\"Convert clusters to label array\"\"\"\n    # Create mapping from point to cluster\n    labels = [-1] * len(data)\n    \n    for cluster_id, cluster in enumerate(clusters):\n        for point in cluster:\n            # Find index of this point in data\n            for i, data_point in enumerate(data):\n                if point == data_point and labels[i] == -1:\n                    labels[i] = cluster_id\n                    break\n    \n    return labels\n\n# Test\ndata = [[1, 1], [1, 2], [2, 1], [8, 8], [8, 9], [9, 8]]\nclusters = [\n    [[1, 1], [1, 2], [2, 1]],\n    [[8, 8], [8, 9], [9, 8]]\n]\n\nlabels = clusters_to_labels(data, clusters)\n\nprint('CLUSTERS TO LABELS')\nprint('=' * 45)\nprint('Clusters:')\nfor i, c in enumerate(clusters):\n    print(f'  Cluster {i}: {c}')\n\nprint(f'\\nData points with labels:')\nfor point, label in zip(data, labels):\n    print(f'  {point} → Cluster {label}')\n\nprint(f'\\nLabels array: {labels}')",
        solution: "# Labels extracted",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Labels array", description: "Clusters to labels" }]),
        hints: ["Map each point to its cluster", "Use cluster index as label", "Return list of labels"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 23.3.1`);

  // Lesson 23.3.2
  const lesson23_3_2 = await prisma.lesson.upsert({
    where: { slug: "linkage-methods" },
    update: {},
    create: {
      sectionId: section23_3.id,
      number: 23.32,
      title: "Linkage Methods",
      slug: "linkage-methods",
      objectives: [
        "Understand different linkage methods",
        "Compare single, complete, and average linkage",
        "Know when to use each method",
        "See how linkage affects cluster shape",
      ],
      content: `# Linkage Methods

## What Is Linkage?

How we define "distance" between two clusters.

Different linkage methods give different clustering results!

## Single Linkage (Minimum)

Distance = **minimum** distance between any two points

\`\`\`
d(A, B) = min{ d(a, b) : a ∈ A, b ∈ B }
\`\`\`

**Pros**: Can find elongated clusters
**Cons**: Sensitive to noise (chaining effect)

## Complete Linkage (Maximum)

Distance = **maximum** distance between any two points

\`\`\`
d(A, B) = max{ d(a, b) : a ∈ A, b ∈ B }
\`\`\`

**Pros**: Compact, spherical clusters
**Cons**: Sensitive to outliers

## Average Linkage

Distance = **average** of all pairwise distances

\`\`\`
d(A, B) = (1/|A||B|) × Σ d(a, b)
\`\`\`

**Pros**: Compromise between single and complete
**Cons**: Computationally more expensive

## Ward's Method

Minimize within-cluster variance when merging.

Most similar to K-means objective.

## Summary

| Linkage | Cluster Shape | Noise Sensitivity |
|---------|---------------|-------------------|
| Single | Elongated | High (chaining) |
| Complete | Compact | Moderate |
| Average | Balanced | Low |
| Ward's | Spherical | Low |`,
      codeExamples: JSON.stringify([
        {
          id: "linkage-comparison",
          title: "Compare Linkage Methods",
          code: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef single_linkage(cluster1, cluster2):\n    \"\"\"Minimum distance between clusters\"\"\"\n    min_dist = float('inf')\n    for p1 in cluster1:\n        for p2 in cluster2:\n            d = euclidean(p1, p2)\n            if d < min_dist:\n                min_dist = d\n    return min_dist\n\ndef complete_linkage(cluster1, cluster2):\n    \"\"\"Maximum distance between clusters\"\"\"\n    max_dist = 0\n    for p1 in cluster1:\n        for p2 in cluster2:\n            d = euclidean(p1, p2)\n            if d > max_dist:\n                max_dist = d\n    return max_dist\n\ndef average_linkage(cluster1, cluster2):\n    \"\"\"Average of all pairwise distances\"\"\"\n    total = 0\n    count = 0\n    for p1 in cluster1:\n        for p2 in cluster2:\n            total += euclidean(p1, p2)\n            count += 1\n    return total / count\n\n# Two clusters\ncluster_a = [[1, 1], [2, 2], [1, 2]]\ncluster_b = [[5, 5], [6, 6], [5, 6]]\n\nprint('LINKAGE METHODS COMPARISON')\nprint('=' * 50)\nprint(f'Cluster A: {cluster_a}')\nprint(f'Cluster B: {cluster_b}')\nprint()\n\nprint(f'Single linkage (min):   {single_linkage(cluster_a, cluster_b):.2f}')\nprint(f'Complete linkage (max): {complete_linkage(cluster_a, cluster_b):.2f}')\nprint(f'Average linkage:        {average_linkage(cluster_a, cluster_b):.2f}')",
          description: "Compare different linkage methods",
        },
        {
          id: "chaining-effect",
          title: "Single Linkage Chaining Effect",
          code: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef single_linkage_cluster(data, k):\n    clusters = [[p] for p in data]\n    while len(clusters) > k:\n        min_dist = float('inf')\n        merge_i, merge_j = 0, 1\n        for i in range(len(clusters)):\n            for j in range(i+1, len(clusters)):\n                for p1 in clusters[i]:\n                    for p2 in clusters[j]:\n                        d = euclidean(p1, p2)\n                        if d < min_dist:\n                            min_dist = d\n                            merge_i, merge_j = i, j\n        clusters[merge_i] = clusters[merge_i] + clusters[merge_j]\n        del clusters[merge_j]\n    return clusters\n\n# Chain-like data\ndata = [[1, 1], [2, 1.5], [3, 2], [4, 2.5], [5, 3],  # Chain\n        [10, 10], [10, 11]]  # Separate cluster\n\nprint('SINGLE LINKAGE CHAINING EFFECT')\nprint('=' * 50)\nprint('Data forms a chain + separate cluster')\nprint(f'\\nData: {data}')\n\nclusters = single_linkage_cluster(data, k=2)\n\nprint(f'\\nSingle linkage (k=2):')\nfor i, c in enumerate(clusters):\n    print(f'  Cluster {i}: {c}')\n\nprint('\\n💡 Single linkage connects the chain into one cluster')\nprint('   This is the \"chaining effect\" - can be good or bad!')",
          description: "Demonstrate chaining effect",
        },
        {
          id: "complete-compact",
          title: "Complete Linkage Compact Clusters",
          code: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef complete_linkage_cluster(data, k):\n    clusters = [[p] for p in data]\n    while len(clusters) > k:\n        min_dist = float('inf')\n        merge_i, merge_j = 0, 1\n        for i in range(len(clusters)):\n            for j in range(i+1, len(clusters)):\n                # Max distance within merge\n                max_d = 0\n                for p1 in clusters[i]:\n                    for p2 in clusters[j]:\n                        d = euclidean(p1, p2)\n                        if d > max_d:\n                            max_d = d\n                if max_d < min_dist:\n                    min_dist = max_d\n                    merge_i, merge_j = i, j\n        clusters[merge_i] = clusters[merge_i] + clusters[merge_j]\n        del clusters[merge_j]\n    return clusters\n\n# Same chain data\ndata = [[1, 1], [2, 1.5], [3, 2], [4, 2.5], [5, 3],  # Chain\n        [10, 10], [10, 11]]  # Separate cluster\n\nprint('COMPLETE LINKAGE COMPACT CLUSTERS')\nprint('=' * 50)\nprint(f'Data: {data}')\n\nclusters = complete_linkage_cluster(data, k=2)\n\nprint(f'\\nComplete linkage (k=2):')\nfor i, c in enumerate(clusters):\n    print(f'  Cluster {i}: {c}')\n\nprint('\\n💡 Complete linkage creates more compact clusters')\nprint('   Chain gets split because endpoints are far apart')",
          description: "Complete linkage creates compact clusters",
        },
      ]),
      keyPoints: [
        "Single: min distance (chains, elongated)",
        "Complete: max distance (compact, spherical)",
        "Average: mean of all pairs (balanced)",
        "Ward's: minimize variance (like K-means)",
        "Linkage choice affects cluster shape",
        "No universally best method",
      ],
      hardwareDemo: "Watch different linkages create different merges. See cluster shapes differ.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson23_3_2.number}: ${lesson23_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson23_3_2.id,
        number: 1,
        title: "Implement Single Linkage",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement single linkage (minimum) distance between clusters.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef single_linkage(cluster1, cluster2):\n    \"\"\"Minimum distance between any two points\"\"\"\n    min_dist = float('inf')\n    for p1 in cluster1:\n        for p2 in cluster2:\n            d = euclidean(p1, p2)\n            if d < min_dist:\n                min_dist = d\n    return min_dist\n\n# Test\nc1 = [[0, 0], [1, 0], [0, 1]]\nc2 = [[5, 5], [6, 5], [5, 6]]\n\nprint('SINGLE LINKAGE')\nprint('=' * 40)\nprint(f'Cluster 1: {c1}')\nprint(f'Cluster 2: {c2}')\n\ndist = single_linkage(c1, c2)\nprint(f'\\nSingle linkage distance: {dist:.2f}')\nprint('(Minimum pairwise distance)')",
        solution: "# Single linkage implemented",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Min distance", description: "Single linkage" }]),
        hints: ["Compare all pairs", "Keep minimum", "Return smallest distance"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson23_3_2.id,
        number: 2,
        title: "Implement Complete Linkage",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement complete linkage (maximum) distance between clusters.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef complete_linkage(cluster1, cluster2):\n    \"\"\"Maximum distance between any two points\"\"\"\n    max_dist = 0\n    for p1 in cluster1:\n        for p2 in cluster2:\n            d = euclidean(p1, p2)\n            if d > max_dist:\n                max_dist = d\n    return max_dist\n\n# Test\nc1 = [[0, 0], [1, 0], [0, 1]]\nc2 = [[5, 5], [6, 5], [5, 6]]\n\nprint('COMPLETE LINKAGE')\nprint('=' * 40)\nprint(f'Cluster 1: {c1}')\nprint(f'Cluster 2: {c2}')\n\ndist = complete_linkage(c1, c2)\nprint(f'\\nComplete linkage distance: {dist:.2f}')\nprint('(Maximum pairwise distance)')",
        solution: "# Complete linkage implemented",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Max distance", description: "Complete linkage" }]),
        hints: ["Compare all pairs", "Keep maximum", "Return largest distance"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson23_3_2.id,
        number: 3,
        title: "Implement Average Linkage",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement average linkage distance between clusters.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef average_linkage(cluster1, cluster2):\n    \"\"\"Average of all pairwise distances\"\"\"\n    total = 0\n    count = 0\n    for p1 in cluster1:\n        for p2 in cluster2:\n            total += euclidean(p1, p2)\n            count += 1\n    return total / count if count > 0 else 0\n\n# Test\nc1 = [[0, 0], [1, 0], [0, 1]]\nc2 = [[5, 5], [6, 5], [5, 6]]\n\nprint('AVERAGE LINKAGE')\nprint('=' * 40)\nprint(f'Cluster 1: {c1}')\nprint(f'Cluster 2: {c2}')\nprint(f'Number of pairs: {len(c1) * len(c2)}')\n\ndist = average_linkage(c1, c2)\nprint(f'\\nAverage linkage distance: {dist:.2f}')\nprint('(Mean of all pairwise distances)')",
        solution: "# Average linkage implemented",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Average distance", description: "Average linkage" }]),
        hints: ["Sum all pairwise distances", "Count pairs", "Divide sum by count"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson23_3_2.id,
        number: 4,
        title: "Compare Linkage Methods",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Compare all three linkage methods on the same clusters.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef single_linkage(c1, c2):\n    return min(euclidean(p1, p2) for p1 in c1 for p2 in c2)\n\ndef complete_linkage(c1, c2):\n    return max(euclidean(p1, p2) for p1 in c1 for p2 in c2)\n\ndef average_linkage(c1, c2):\n    dists = [euclidean(p1, p2) for p1 in c1 for p2 in c2]\n    return sum(dists) / len(dists)\n\n# Test clusters\nc1 = [[0, 0], [0, 1]]\nc2 = [[3, 0], [3, 3]]  # One point close, one far\n\nprint('LINKAGE COMPARISON')\nprint('=' * 45)\nprint(f'Cluster 1: {c1}')\nprint(f'Cluster 2: {c2}')\nprint()\n\nprint(f'Single (min):   {single_linkage(c1, c2):.2f}')\nprint(f'Complete (max): {complete_linkage(c1, c2):.2f}')\nprint(f'Average:        {average_linkage(c1, c2):.2f}')\n\nprint('\\n💡 Notice: Single ≤ Average ≤ Complete (always)')",
        solution: "# All linkages compared",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All three values", description: "Compare linkages" }]),
        hints: ["Calculate all three", "Observe ordering", "Single ≤ Average ≤ Complete"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson23_3_2.id,
        number: 5,
        title: "Agglomerative with Different Linkages",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Run agglomerative clustering with different linkage methods and compare results.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef cluster_distance(c1, c2, method):\n    dists = [euclidean(p1, p2) for p1 in c1 for p2 in c2]\n    if method == 'single':\n        return min(dists)\n    elif method == 'complete':\n        return max(dists)\n    else:  # average\n        return sum(dists) / len(dists)\n\ndef agglomerative(data, k, method='average'):\n    clusters = [[p] for p in data]\n    while len(clusters) > k:\n        min_dist = float('inf')\n        merge_i, merge_j = 0, 1\n        for i in range(len(clusters)):\n            for j in range(i+1, len(clusters)):\n                d = cluster_distance(clusters[i], clusters[j], method)\n                if d < min_dist:\n                    min_dist = d\n                    merge_i, merge_j = i, j\n        clusters[merge_i] = clusters[merge_i] + clusters[merge_j]\n        del clusters[merge_j]\n    return clusters\n\n# Chain-like data that shows difference\ndata = [[0, 0], [1, 0.5], [2, 1], [3, 1.5], [10, 10], [10, 11]]\n\nprint('AGGLOMERATIVE WITH DIFFERENT LINKAGES')\nprint('=' * 55)\nprint(f'Data: {data}\\n')\n\nfor method in ['single', 'complete', 'average']:\n    clusters = agglomerative(data, k=2, method=method)\n    sizes = [len(c) for c in clusters]\n    print(f'{method.capitalize():10}: Cluster sizes = {sizes}')",
        solution: "# Different linkages give different results",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Different clusterings", description: "Linkage comparison" }]),
        hints: ["Same data, different methods", "Observe cluster sizes differ", "Single creates chains"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 23.3.2`);

  // Lesson 23.3.3
  const lesson23_3_3 = await prisma.lesson.upsert({
    where: { slug: "dendrograms" },
    update: {},
    create: {
      sectionId: section23_3.id,
      number: 23.33,
      title: "Dendrograms",
      slug: "dendrograms",
      objectives: [
        "Understand dendrogram structure",
        "Read and interpret dendrograms",
        "Cut dendrograms to get clusters",
        "Use dendrograms for K selection",
      ],
      content: `# Dendrograms

## What Is a Dendrogram?

A tree diagram showing the hierarchical clustering process.

- **Leaves**: Individual data points
- **Branches**: Merged clusters
- **Height**: Distance at which merge occurred

## Reading a Dendrogram

\`\`\`
Height
  |
  5 |         ┌───────┐
    |         │       │
  3 |     ┌───┤       │
    |     │   │       │
  1 |   ┌─┤   │       │
    |   │ │   │       │
  0 +---A-B---C-------D-E
\`\`\`

- A and B merge at height 1
- Then (AB) merges with C at height 3
- D and E merge, then merge with (ABC) at height 5

## Cutting the Dendrogram

Draw a horizontal line at a certain height:
- The number of vertical lines it crosses = number of clusters
- Higher cut = fewer clusters
- Lower cut = more clusters

## Using Dendrograms for K Selection

1. Look for **large vertical gaps**
2. Cut just below the gap
3. Gap = natural separation between clusters

## Benefits

- Visual cluster exploration
- See cluster relationships
- Choose K interactively
- Understand data structure`,
      codeExamples: JSON.stringify([
        {
          id: "build-dendrogram",
          title: "Build Dendrogram Data",
          code: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef build_dendrogram(data, labels):\n    \"\"\"Build dendrogram structure\"\"\"\n    n = len(data)\n    clusters = {i: [i] for i in range(n)}  # cluster_id -> point indices\n    active = set(range(n))  # active cluster ids\n    merges = []  # (cluster1, cluster2, distance, new_id)\n    next_id = n\n    \n    while len(active) > 1:\n        # Find closest pair\n        min_dist = float('inf')\n        merge_pair = None\n        \n        active_list = list(active)\n        for i, c1 in enumerate(active_list):\n            for c2 in active_list[i+1:]:\n                # Average linkage\n                dists = [euclidean(data[p1], data[p2]) \n                        for p1 in clusters[c1] for p2 in clusters[c2]]\n                d = sum(dists) / len(dists)\n                if d < min_dist:\n                    min_dist = d\n                    merge_pair = (c1, c2)\n        \n        c1, c2 = merge_pair\n        merges.append((c1, c2, min_dist, next_id))\n        \n        # Create new cluster\n        clusters[next_id] = clusters[c1] + clusters[c2]\n        active.remove(c1)\n        active.remove(c2)\n        active.add(next_id)\n        next_id += 1\n    \n    return merges\n\n# Example\ndata = [[1, 1], [1, 2], [5, 5], [6, 5]]\nlabels = ['A', 'B', 'C', 'D']\n\nmerges = build_dendrogram(data, labels)\n\nprint('DENDROGRAM MERGE HISTORY')\nprint('=' * 50)\nprint(f'Data: {dict(zip(labels, data))}')\nprint(f'\\nMerge order:')\nfor c1, c2, dist, new_id in merges:\n    n1 = labels[c1] if c1 < len(labels) else f'Cluster{c1}'\n    n2 = labels[c2] if c2 < len(labels) else f'Cluster{c2}'\n    print(f'  Height {dist:.2f}: {n1} + {n2} → Cluster{new_id}')",
          description: "Build dendrogram data structure",
        },
        {
          id: "text-dendrogram",
          title: "Text Dendrogram Visualization",
          code: "def simple_dendrogram(merges, labels):\n    \"\"\"Simple text dendrogram\"\"\"\n    print('DENDROGRAM')\n    print('=' * 40)\n    \n    # Sort merges by height\n    sorted_merges = sorted(merges, key=lambda x: x[2], reverse=True)\n    \n    # Find max height for scaling\n    max_height = max(m[2] for m in merges) if merges else 1\n    \n    print(f'\\nHeight')\n    for m in sorted_merges:\n        height_bar = int(m[2] / max_height * 20)\n        c1, c2 = m[0], m[1]\n        n1 = labels[c1] if c1 < len(labels) else f'C{c1}'\n        n2 = labels[c2] if c2 < len(labels) else f'C{c2}'\n        print(f'{m[2]:5.2f} |{\"█\" * height_bar} [{n1}+{n2}]')\n    \n    print(f'{0:5.2f} |' + ' '.join(f' {l} ' for l in labels))\n    print('      +' + '---' * len(labels))\n\n# Example merges: (c1, c2, height, new_id)\nmerges = [\n    (0, 1, 1.0, 4),   # A+B at height 1\n    (2, 3, 1.2, 5),   # C+D at height 1.2\n    (4, 5, 5.0, 6),   # (AB)+(CD) at height 5\n]\nlabels = ['A', 'B', 'C', 'D']\n\nsimple_dendrogram(merges, labels)\n\nprint('\\n💡 Large gap between 1.2 and 5.0 suggests K=2')",
          description: "Text visualization of dendrogram",
        },
        {
          id: "cut-dendrogram",
          title: "Cut Dendrogram for Clusters",
          code: "def cut_dendrogram(merges, n_points, height):\n    \"\"\"Cut dendrogram at given height to get clusters\"\"\"\n    # Start with each point as its own cluster\n    clusters = {i: {i} for i in range(n_points)}\n    \n    # Apply merges below the cut height\n    for c1, c2, h, new_id in merges:\n        if h <= height:\n            # Merge clusters\n            clusters[new_id] = clusters[c1] | clusters[c2]\n            del clusters[c1]\n            del clusters[c2]\n    \n    return list(clusters.values())\n\n# Example\nmerges = [\n    (0, 1, 1.0, 4),   # A+B\n    (2, 3, 1.5, 5),   # C+D\n    (4, 5, 4.0, 6),   # (AB)+(CD)\n]\nn_points = 4\nlabels = ['A', 'B', 'C', 'D']\n\nprint('CUTTING DENDROGRAM')\nprint('=' * 45)\nprint('Merges: A+B@1.0, C+D@1.5, (AB)+(CD)@4.0\\n')\n\nfor cut_height in [0.5, 2.0, 5.0]:\n    clusters = cut_dendrogram(merges, n_points, cut_height)\n    cluster_labels = [[labels[i] for i in c] for c in clusters]\n    print(f'Cut at height {cut_height}: {len(clusters)} clusters')\n    print(f'  Clusters: {cluster_labels}')",
          description: "Cut dendrogram at different heights",
        },
      ]),
      keyPoints: [
        "Dendrogram shows merge hierarchy",
        "Height = distance at merge",
        "Cut horizontally for K clusters",
        "Large gaps suggest natural K",
        "Lower cut = more clusters",
        "Visual tool for K selection",
      ],
      hardwareDemo: "Watch dendrogram build up. See cuts produce different clusterings.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson23_3_3.number}: ${lesson23_3_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson23_3_3.id,
        number: 1,
        title: "Record Merge History",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Modify agglomerative clustering to record the merge history for a dendrogram.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef agglomerative_with_history(data):\n    \"\"\"Returns merge history: [(c1, c2, distance), ...]\"\"\"\n    n = len(data)\n    clusters = [[p] for p in data]\n    cluster_ids = list(range(n))\n    history = []\n    next_id = n\n    \n    while len(clusters) > 1:\n        # Find closest\n        min_dist = float('inf')\n        merge_i, merge_j = 0, 1\n        for i in range(len(clusters)):\n            for j in range(i+1, len(clusters)):\n                dists = [euclidean(p1, p2) for p1 in clusters[i] for p2 in clusters[j]]\n                d = sum(dists) / len(dists)\n                if d < min_dist:\n                    min_dist = d\n                    merge_i, merge_j = i, j\n        \n        # Record merge\n        history.append((cluster_ids[merge_i], cluster_ids[merge_j], min_dist))\n        \n        # Merge\n        clusters[merge_i] = clusters[merge_i] + clusters[merge_j]\n        cluster_ids[merge_i] = next_id\n        del clusters[merge_j]\n        del cluster_ids[merge_j]\n        next_id += 1\n    \n    return history\n\n# Test\ndata = [[1, 1], [2, 2], [10, 10], [11, 11]]\nlabels = ['A', 'B', 'C', 'D']\n\nhistory = agglomerative_with_history(data)\n\nprint('MERGE HISTORY')\nprint('=' * 40)\nfor c1, c2, dist in history:\n    n1 = labels[c1] if c1 < len(labels) else f'({c1})'\n    n2 = labels[c2] if c2 < len(labels) else f'({c2})'\n    print(f'Height {dist:.2f}: Merge {n1} and {n2}')",
        solution: "# Merge history recorded",
        testCases: JSON.stringify([{ input: "", expectedOutput: "History shown", description: "Record merges" }]),
        hints: ["Track cluster IDs", "Record each merge", "Use incrementing IDs for new clusters"],
        xpReward: 20,
        order: 1,
      },
      {
        lessonId: lesson23_3_3.id,
        number: 2,
        title: "Simple Dendrogram Display",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a simple text display of dendrogram structure.",
        starterCode: "def display_dendrogram(history, labels):\n    \"\"\"Simple text display of dendrogram\"\"\"\n    print('DENDROGRAM')\n    print('=' * 50)\n    \n    # Show merges from bottom to top\n    print(f'\\n{\"Height\":>8}  Merge')\n    print('-' * 35)\n    \n    for c1, c2, height in sorted(history, key=lambda x: x[2]):\n        n1 = labels[c1] if c1 < len(labels) else f'Cluster{c1}'\n        n2 = labels[c2] if c2 < len(labels) else f'Cluster{c2}'\n        bar = '█' * int(height * 3)\n        print(f'{height:>8.2f}  {bar} {n1} ─┬─ {n2}')\n    \n    print(f'\\nLeaves: {\" \".join(labels)}')\n\n# Example history\nhistory = [\n    (0, 1, 1.0),   # A+B at 1.0\n    (2, 3, 1.5),   # C+D at 1.5\n    (4, 5, 6.0),   # (AB)+(CD) at 6.0\n]\nlabels = ['A', 'B', 'C', 'D']\n\ndisplay_dendrogram(history, labels)\n\nprint('\\n💡 Gap between 1.5 and 6.0 suggests K=2')",
        solution: "# Dendrogram displayed",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Tree shown", description: "Display dendrogram" }]),
        hints: ["Sort by height", "Show merge info", "Identify gaps"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson23_3_3.id,
        number: 3,
        title: "Cut Dendrogram",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement cutting a dendrogram at a specific height to get clusters.",
        starterCode: "def cut_at_height(history, n_points, cut_height):\n    \"\"\"Cut dendrogram at height to get cluster labels\"\"\"\n    # Union-find structure\n    parent = list(range(n_points + len(history)))\n    \n    def find(x):\n        if parent[x] != x:\n            parent[x] = find(parent[x])\n        return parent[x]\n    \n    # Apply merges below cut height\n    next_id = n_points\n    for c1, c2, height in history:\n        if height <= cut_height:\n            # Union the clusters\n            parent[find(c1)] = next_id\n            parent[find(c2)] = next_id\n        next_id += 1\n    \n    # Get labels for original points\n    labels = [find(i) for i in range(n_points)]\n    \n    # Renumber to 0, 1, 2, ...\n    unique = list(set(labels))\n    label_map = {old: new for new, old in enumerate(unique)}\n    return [label_map[l] for l in labels]\n\n# Test\nhistory = [\n    (0, 1, 1.0),   # A+B\n    (2, 3, 1.5),   # C+D  \n    (4, 5, 6.0),   # (AB)+(CD)\n]\npoint_names = ['A', 'B', 'C', 'D']\n\nprint('CUTTING DENDROGRAM')\nprint('=' * 45)\n\nfor h in [0.5, 2.0, 7.0]:\n    labels = cut_at_height(history, 4, h)\n    print(f'\\nCut at height {h}:')\n    print(f'  Labels: {labels}')\n    print(f'  Clusters: {len(set(labels))}')\n    for name, label in zip(point_names, labels):\n        print(f'    {name} → Cluster {label}')",
        solution: "# Cut implemented",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Clusters at heights", description: "Cut dendrogram" }]),
        hints: ["Use union-find", "Only apply merges below height", "Renumber final labels"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson23_3_3.id,
        number: 4,
        title: "Find Natural Clusters",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Find the best cut height by looking for the largest gap in merge heights.",
        starterCode: "def find_best_cut(history):\n    \"\"\"Find height with largest gap (suggests natural K)\"\"\"\n    if len(history) < 2:\n        return history[0][2] if history else 0\n    \n    heights = sorted([h for _, _, h in history])\n    \n    max_gap = 0\n    best_cut = heights[0]\n    \n    for i in range(1, len(heights)):\n        gap = heights[i] - heights[i-1]\n        if gap > max_gap:\n            max_gap = gap\n            # Cut between the two heights\n            best_cut = (heights[i-1] + heights[i]) / 2\n    \n    return best_cut, max_gap\n\n# Test with clear structure\nhistory = [\n    (0, 1, 1.0),\n    (2, 3, 1.2),\n    (4, 5, 8.0),  # Large gap before this!\n]\n\nprint('FINDING NATURAL CLUSTERS')\nprint('=' * 45)\nprint('Merge heights: 1.0, 1.2, 8.0')\nprint()\n\nbest_cut, gap = find_best_cut(history)\nprint(f'Largest gap: {gap:.1f}')\nprint(f'Suggested cut height: {best_cut:.1f}')\nprint(f'\\n💡 Cutting at {best_cut:.1f} gives 2 clusters')\nprint('   (merges at 1.0 and 1.2 happen, but not 8.0)')",
        solution: "# Natural cut found",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Best cut", description: "Find natural K" }]),
        hints: ["Sort merge heights", "Find largest gap", "Cut in the gap"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson23_3_3.id,
        number: 5,
        title: "Complete Hierarchical Clustering",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement complete hierarchical clustering with dendrogram output.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef hierarchical_clustering(data, labels=None):\n    \"\"\"Complete hierarchical clustering with dendrogram\"\"\"\n    n = len(data)\n    if labels is None:\n        labels = [str(i) for i in range(n)]\n    \n    clusters = [[p] for p in data]\n    cluster_names = [[l] for l in labels]\n    history = []\n    \n    while len(clusters) > 1:\n        # Find closest (average linkage)\n        min_dist = float('inf')\n        mi, mj = 0, 1\n        for i in range(len(clusters)):\n            for j in range(i+1, len(clusters)):\n                dists = [euclidean(p1, p2) for p1 in clusters[i] for p2 in clusters[j]]\n                d = sum(dists) / len(dists)\n                if d < min_dist:\n                    min_dist = d\n                    mi, mj = i, j\n        \n        # Record\n        history.append({\n            'merged': (cluster_names[mi], cluster_names[mj]),\n            'height': min_dist\n        })\n        \n        # Merge\n        clusters[mi] = clusters[mi] + clusters[mj]\n        cluster_names[mi] = cluster_names[mi] + cluster_names[mj]\n        del clusters[mj]\n        del cluster_names[mj]\n    \n    return history\n\n# Test\ndata = [[1, 1], [2, 1], [10, 10], [10, 11], [11, 10]]\nlabels = ['A', 'B', 'C', 'D', 'E']\n\nhistory = hierarchical_clustering(data, labels)\n\nprint('HIERARCHICAL CLUSTERING')\nprint('=' * 50)\nprint(f'Data points: {labels}\\n')\nprint('Dendrogram:')\nfor i, step in enumerate(history):\n    m1, m2 = step['merged']\n    print(f'  Height {step[\"height\"]:.2f}: {m1} + {m2}')\n\nprint('\\n💡 First two merges are close (within-cluster)')\nprint('   Last merge has large height (between-cluster)')",
        solution: "# Complete clustering with dendrogram",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Full dendrogram", description: "Complete hierarchical" }]),
        hints: ["Track cluster contents", "Record each merge", "Show final dendrogram"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 23.3.3`);

  console.log("\n✅ Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
