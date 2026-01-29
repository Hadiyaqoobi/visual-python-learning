import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 4: Lesson 23.4.1 (Cluster Validation)...\n");

  const section23_4 = await prisma.section.findFirst({ where: { number: 23.4 } });
  if (!section23_4) throw new Error("Section 23.4 not found. Run part 1 first.");

  const lesson23_4_1 = await prisma.lesson.upsert({
    where: { slug: "cluster-validation" },
    update: {},
    create: {
      sectionId: section23_4.id,
      number: 23.41,
      title: "Cluster Validation",
      slug: "cluster-validation",
      objectives: [
        "Understand internal vs external validation",
        "Apply multiple validation metrics",
        "Interpret silhouette analysis",
        "Compare clustering results",
      ],
      content: `# Cluster Validation

## The Challenge

Without labels, how do we know if clustering is "good"?

## Internal Validation

Measures based only on the data and clustering result.

### Silhouette Score
Measures how similar points are to their own cluster vs other clusters.
- Range: -1 to 1
- Higher is better
- > 0.5 is reasonable structure

### Davies-Bouldin Index
Ratio of within-cluster to between-cluster distances.
- Lower is better
- 0 is perfect (no overlap)

### Calinski-Harabasz Index
Ratio of between-cluster to within-cluster variance.
- Higher is better
- Also called Variance Ratio Criterion

## External Validation

Compares clustering to known labels (if available).

### Adjusted Rand Index (ARI)
- Measures agreement between two clusterings
- Range: -0.5 to 1.0
- 1.0 = perfect agreement

### Normalized Mutual Information (NMI)
- Information-theoretic measure
- Range: 0 to 1
- 1.0 = perfect agreement

## Practical Approach

1. Use internal metrics when no labels exist
2. Run multiple algorithms, compare results
3. Use domain knowledge to validate
4. Silhouette analysis per cluster
5. Visualize when possible`,
      codeExamples: JSON.stringify([
        {
          id: "silhouette-analysis",
          title: "Silhouette Analysis",
          code: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef silhouette_samples(data, labels):\n    \"\"\"Calculate silhouette score for each sample\"\"\"\n    n = len(data)\n    scores = []\n    \n    for i in range(n):\n        # a(i): mean distance to same cluster\n        same = [data[j] for j in range(n) if labels[j] == labels[i] and j != i]\n        if not same:\n            scores.append(0)\n            continue\n        a_i = sum(euclidean(data[i], p) for p in same) / len(same)\n        \n        # b(i): mean distance to nearest other cluster\n        other_clusters = set(labels) - {labels[i]}\n        if not other_clusters:\n            scores.append(0)\n            continue\n        \n        b_i = float('inf')\n        for c in other_clusters:\n            others = [data[j] for j in range(n) if labels[j] == c]\n            if others:\n                mean_d = sum(euclidean(data[i], p) for p in others) / len(others)\n                b_i = min(b_i, mean_d)\n        \n        s_i = (b_i - a_i) / max(a_i, b_i) if max(a_i, b_i) > 0 else 0\n        scores.append(s_i)\n    \n    return scores\n\n# Test data\ndata = [[1, 1], [1, 2], [2, 1],  # Cluster 0\n        [8, 8], [8, 9], [9, 8],  # Cluster 1\n        [5, 5]]                   # Outlier in cluster 0\nlabels = [0, 0, 0, 1, 1, 1, 0]\n\nscores = silhouette_samples(data, labels)\n\nprint('SILHOUETTE ANALYSIS')\nprint('=' * 50)\nprint(f'{\"Point\":>10} {\"Cluster\":>10} {\"Silhouette\":>12}')\nprint('-' * 35)\nfor i, (point, label, score) in enumerate(zip(data, labels, scores)):\n    quality = '⚠️' if score < 0.3 else '✓'\n    print(f'{str(point):>10} {label:>10} {score:>12.3f} {quality}')\n\nprint(f'\\nMean silhouette: {sum(scores)/len(scores):.3f}')\nprint('\\n💡 Point [5,5] has low score - possible misclassification')",
          description: "Analyze silhouette scores per sample",
        },
        {
          id: "cluster-metrics",
          title: "Multiple Validation Metrics",
          code: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef wcss(data, labels, centroids):\n    \"\"\"Within-Cluster Sum of Squares\"\"\"\n    return sum(euclidean(data[i], centroids[labels[i]])**2 for i in range(len(data)))\n\ndef silhouette_score(data, labels):\n    \"\"\"Average silhouette score\"\"\"\n    n = len(data)\n    if len(set(labels)) < 2:\n        return 0\n    \n    total = 0\n    for i in range(n):\n        same = [data[j] for j in range(n) if labels[j] == labels[i] and j != i]\n        if not same:\n            continue\n        a = sum(euclidean(data[i], p) for p in same) / len(same)\n        \n        b = float('inf')\n        for c in set(labels):\n            if c == labels[i]:\n                continue\n            others = [data[j] for j in range(n) if labels[j] == c]\n            if others:\n                b = min(b, sum(euclidean(data[i], p) for p in others) / len(others))\n        \n        if max(a, b) > 0:\n            total += (b - a) / max(a, b)\n    \n    return total / n\n\ndef inertia(data, labels):\n    \"\"\"Total within-cluster variance\"\"\"\n    k = len(set(labels))\n    centroids = []\n    for c in range(k):\n        cluster = [data[i] for i in range(len(data)) if labels[i] == c]\n        if cluster:\n            centroids.append([sum(p[d] for p in cluster)/len(cluster) for d in range(len(data[0]))])\n    return wcss(data, labels, centroids)\n\n# Compare two clusterings\ndata = [[1, 1], [1, 2], [2, 1], [8, 8], [8, 9], [9, 8]]\n\ngood_labels = [0, 0, 0, 1, 1, 1]\nbad_labels = [0, 1, 0, 1, 0, 1]\n\nprint('CLUSTERING VALIDATION METRICS')\nprint('=' * 50)\n\nprint('\\nGood clustering (natural groups):')\nprint(f'  Labels: {good_labels}')\nprint(f'  Silhouette: {silhouette_score(data, good_labels):.3f}')\nprint(f'  Inertia: {inertia(data, good_labels):.2f}')\n\nprint('\\nBad clustering (alternating):')\nprint(f'  Labels: {bad_labels}')\nprint(f'  Silhouette: {silhouette_score(data, bad_labels):.3f}')\nprint(f'  Inertia: {inertia(data, bad_labels):.2f}')\n\nprint('\\n💡 Good clustering: Higher silhouette, lower inertia')",
          description: "Compare multiple validation metrics",
        },
        {
          id: "compare-algorithms",
          title: "Compare Clustering Algorithms",
          code: "import math\nimport random\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef kmeans(data, k, seed=42):\n    random.seed(seed)\n    centroids = [data[i][:] for i in random.sample(range(len(data)), k)]\n    for _ in range(50):\n        labels = [min(range(k), key=lambda c: euclidean(p, centroids[c])) for p in data]\n        new_cents = [[sum(data[j][d] for j in range(len(data)) if labels[j]==i)/max(1,labels.count(i)) \n                      for d in range(len(data[0]))] for i in range(k)]\n        if centroids == new_cents:\n            break\n        centroids = new_cents\n    return labels\n\ndef agglomerative(data, k):\n    clusters = [[i] for i in range(len(data))]\n    while len(clusters) > k:\n        min_d = float('inf')\n        mi, mj = 0, 1\n        for i in range(len(clusters)):\n            for j in range(i+1, len(clusters)):\n                d = sum(euclidean(data[a], data[b]) for a in clusters[i] for b in clusters[j]) / (len(clusters[i])*len(clusters[j]))\n                if d < min_d:\n                    min_d, mi, mj = d, i, j\n        clusters[mi] = clusters[mi] + clusters[mj]\n        del clusters[mj]\n    labels = [0] * len(data)\n    for i, c in enumerate(clusters):\n        for j in c:\n            labels[j] = i\n    return labels\n\ndef silhouette(data, labels):\n    if len(set(labels)) < 2:\n        return 0\n    total = 0\n    for i in range(len(data)):\n        same = [data[j] for j in range(len(data)) if labels[j] == labels[i] and j != i]\n        if not same:\n            continue\n        a = sum(euclidean(data[i], p) for p in same) / len(same)\n        b = min(sum(euclidean(data[i], data[j]) for j in range(len(data)) if labels[j]==c)/labels.count(c) \n                for c in set(labels) if c != labels[i])\n        total += (b - a) / max(a, b) if max(a, b) > 0 else 0\n    return total / len(data)\n\n# Generate data\nrandom.seed(42)\ndata = [[random.gauss(c[0], 0.5), random.gauss(c[1], 0.5)] \n        for c in [(2,2), (8,2), (5,8)] for _ in range(6)]\n\nprint('ALGORITHM COMPARISON')\nprint('=' * 50)\n\nfor k in [2, 3, 4]:\n    km_labels = kmeans(data, k)\n    hc_labels = agglomerative(data, k)\n    \n    km_sil = silhouette(data, km_labels)\n    hc_sil = silhouette(data, hc_labels)\n    \n    print(f'\\nK = {k}:')\n    print(f'  K-Means silhouette:      {km_sil:.3f}')\n    print(f'  Hierarchical silhouette: {hc_sil:.3f}')\n    winner = 'K-Means' if km_sil > hc_sil else 'Hierarchical'\n    print(f'  Better: {winner}')\n\nprint('\\n💡 K=3 gives best silhouette (matches true structure)')",
          description: "Compare K-means and hierarchical",
        },
      ]),
      keyPoints: [
        "Internal: uses only data (silhouette, inertia)",
        "External: compares to known labels (ARI, NMI)",
        "Silhouette: -1 to 1, higher is better",
        "Per-sample silhouette finds misclassified points",
        "Compare multiple algorithms on same data",
        "Domain knowledge validates results",
      ],
      hardwareDemo: "Watch validation metrics calculated. See good vs bad clustering scores.",
      estimatedTime: 35,
      difficulty: "ADVANCED",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson23_4_1.number}: ${lesson23_4_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson23_4_1.id,
        number: 1,
        title: "Implement Silhouette Score",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement the silhouette score calculation from scratch.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef silhouette_score(data, labels):\n    \"\"\"Calculate average silhouette score\"\"\"\n    n = len(data)\n    clusters = set(labels)\n    \n    if len(clusters) < 2:\n        return 0\n    \n    scores = []\n    for i in range(n):\n        # a(i): avg distance to same cluster\n        same_cluster = [data[j] for j in range(n) if labels[j] == labels[i] and j != i]\n        if not same_cluster:\n            continue\n        a_i = sum(euclidean(data[i], p) for p in same_cluster) / len(same_cluster)\n        \n        # b(i): avg distance to nearest other cluster\n        b_i = float('inf')\n        for c in clusters:\n            if c == labels[i]:\n                continue\n            other_cluster = [data[j] for j in range(n) if labels[j] == c]\n            if other_cluster:\n                avg_dist = sum(euclidean(data[i], p) for p in other_cluster) / len(other_cluster)\n                b_i = min(b_i, avg_dist)\n        \n        # Silhouette for point i\n        s_i = (b_i - a_i) / max(a_i, b_i) if max(a_i, b_i) > 0 else 0\n        scores.append(s_i)\n    \n    return sum(scores) / len(scores) if scores else 0\n\n# Test\ndata = [[1, 1], [1, 2], [2, 1], [8, 8], [8, 9], [9, 8]]\ngood_labels = [0, 0, 0, 1, 1, 1]\nbad_labels = [0, 1, 0, 1, 0, 1]\n\nprint('SILHOUETTE SCORE')\nprint('=' * 40)\nprint(f'Good clustering: {silhouette_score(data, good_labels):.3f}')\nprint(f'Bad clustering: {silhouette_score(data, bad_labels):.3f}')",
        solution: "# Silhouette implemented",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Good > Bad", description: "Silhouette score" }]),
        hints: ["a(i) = avg distance within cluster", "b(i) = min avg distance to other clusters", "s = (b-a)/max(a,b)"],
        xpReward: 25,
        order: 1,
      },
      {
        lessonId: lesson23_4_1.id,
        number: 2,
        title: "Per-Cluster Silhouette",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate silhouette scores per cluster to identify weak clusters.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef silhouette_per_cluster(data, labels):\n    \"\"\"Calculate average silhouette for each cluster\"\"\"\n    n = len(data)\n    clusters = sorted(set(labels))\n    cluster_scores = {c: [] for c in clusters}\n    \n    for i in range(n):\n        same = [data[j] for j in range(n) if labels[j] == labels[i] and j != i]\n        if not same:\n            continue\n        a = sum(euclidean(data[i], p) for p in same) / len(same)\n        \n        b = float('inf')\n        for c in clusters:\n            if c == labels[i]:\n                continue\n            other = [data[j] for j in range(n) if labels[j] == c]\n            if other:\n                b = min(b, sum(euclidean(data[i], p) for p in other) / len(other))\n        \n        s = (b - a) / max(a, b) if max(a, b) > 0 else 0\n        cluster_scores[labels[i]].append(s)\n    \n    return {c: sum(s)/len(s) if s else 0 for c, s in cluster_scores.items()}\n\n# Test - one good cluster, one weaker\ndata = [[1, 1], [1, 2], [2, 1],  # Tight cluster 0\n        [8, 8], [10, 10], [6, 6]]  # Spread cluster 1\nlabels = [0, 0, 0, 1, 1, 1]\n\nscores = silhouette_per_cluster(data, labels)\n\nprint('PER-CLUSTER SILHOUETTE')\nprint('=' * 40)\nfor c, score in scores.items():\n    quality = 'Strong' if score > 0.5 else 'Weak'\n    print(f'Cluster {c}: {score:.3f} ({quality})')\n\nprint('\\n💡 Cluster 0 is tighter than cluster 1')",
        solution: "# Per-cluster scores",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Scores per cluster", description: "Per-cluster silhouette" }]),
        hints: ["Group scores by cluster", "Average within each cluster", "Identify weak clusters"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson23_4_1.id,
        number: 3,
        title: "Inertia Calculation",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate clustering inertia (total within-cluster variance).",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef compute_centroids(data, labels):\n    \"\"\"Compute centroid for each cluster\"\"\"\n    clusters = set(labels)\n    centroids = {}\n    for c in clusters:\n        points = [data[i] for i in range(len(data)) if labels[i] == c]\n        if points:\n            centroids[c] = [sum(p[d] for p in points)/len(points) for d in range(len(data[0]))]\n    return centroids\n\ndef inertia(data, labels):\n    \"\"\"Total within-cluster sum of squared distances\"\"\"\n    centroids = compute_centroids(data, labels)\n    total = 0\n    for i, point in enumerate(data):\n        centroid = centroids[labels[i]]\n        total += euclidean(point, centroid) ** 2\n    return total\n\n# Test\ndata = [[1, 1], [1, 2], [2, 1], [8, 8], [8, 9], [9, 8]]\n\ngood = [0, 0, 0, 1, 1, 1]\nbad = [0, 1, 0, 1, 0, 1]\n\nprint('INERTIA (WCSS)')\nprint('=' * 40)\nprint('Lower inertia = tighter clusters\\n')\n\nprint(f'Good clustering inertia: {inertia(data, good):.2f}')\nprint(f'Bad clustering inertia: {inertia(data, bad):.2f}')\n\nprint('\\n✓ Good clustering has lower inertia')",
        solution: "# Inertia calculated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Good < Bad", description: "Inertia" }]),
        hints: ["Find centroids first", "Sum squared distances to centroids", "Lower = better"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson23_4_1.id,
        number: 4,
        title: "Find Misclassified Points",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Use silhouette analysis to identify potentially misclassified points.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef find_suspicious_points(data, labels, threshold=0.0):\n    \"\"\"Find points with low silhouette scores\"\"\"\n    n = len(data)\n    suspicious = []\n    \n    for i in range(n):\n        same = [data[j] for j in range(n) if labels[j] == labels[i] and j != i]\n        if not same:\n            continue\n        a = sum(euclidean(data[i], p) for p in same) / len(same)\n        \n        # Find nearest other cluster\n        best_other = None\n        b = float('inf')\n        for c in set(labels):\n            if c == labels[i]:\n                continue\n            other = [data[j] for j in range(n) if labels[j] == c]\n            if other:\n                avg = sum(euclidean(data[i], p) for p in other) / len(other)\n                if avg < b:\n                    b = avg\n                    best_other = c\n        \n        s = (b - a) / max(a, b) if max(a, b) > 0 else 0\n        \n        if s < threshold:\n            suspicious.append({\n                'index': i,\n                'point': data[i],\n                'assigned': labels[i],\n                'nearest_other': best_other,\n                'silhouette': s\n            })\n    \n    return suspicious\n\n# Data with one misclassified point\ndata = [[1, 1], [1, 2], [2, 1], [8, 8], [8, 9], [9, 8], [5, 5]]  # [5,5] is outlier\nlabels = [0, 0, 0, 1, 1, 1, 0]  # Assigned to cluster 0\n\nprint('FINDING SUSPICIOUS POINTS')\nprint('=' * 50)\n\nsuspicious = find_suspicious_points(data, labels, threshold=0.3)\n\nif suspicious:\n    print('Points with silhouette < 0.3:\\n')\n    for s in suspicious:\n        print(f'  Point {s[\"point\"]} (index {s[\"index\"]})')\n        print(f'    Assigned: Cluster {s[\"assigned\"]}')\n        print(f'    Nearest other: Cluster {s[\"nearest_other\"]}')\n        print(f'    Silhouette: {s[\"silhouette\"]:.3f}')\nelse:\n    print('No suspicious points found')",
        solution: "# Suspicious points identified",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Outlier found", description: "Find misclassified" }]),
        hints: ["Low silhouette = poor fit", "Track nearest other cluster", "Threshold determines sensitivity"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson23_4_1.id,
        number: 5,
        title: "Complete Validation Report",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a comprehensive clustering validation report.",
        starterCode: "import math\n\ndef euclidean(a, b):\n    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))\n\ndef clustering_report(data, labels):\n    \"\"\"Generate comprehensive validation report\"\"\"\n    n = len(data)\n    k = len(set(labels))\n    \n    # Basic info\n    cluster_sizes = [labels.count(c) for c in range(k)]\n    \n    # Centroids\n    centroids = []\n    for c in range(k):\n        pts = [data[i] for i in range(n) if labels[i] == c]\n        centroids.append([sum(p[d] for p in pts)/len(pts) for d in range(len(data[0]))])\n    \n    # Inertia\n    inertia = sum(euclidean(data[i], centroids[labels[i]])**2 for i in range(n))\n    \n    # Silhouette\n    sil_scores = []\n    for i in range(n):\n        same = [data[j] for j in range(n) if labels[j] == labels[i] and j != i]\n        if not same:\n            continue\n        a = sum(euclidean(data[i], p) for p in same) / len(same)\n        b = min(sum(euclidean(data[i], data[j]) for j in range(n) if labels[j]==c)/labels.count(c) \n                for c in set(labels) if c != labels[i])\n        sil_scores.append((b - a) / max(a, b) if max(a, b) > 0 else 0)\n    \n    avg_silhouette = sum(sil_scores) / len(sil_scores) if sil_scores else 0\n    \n    # Per-cluster silhouette\n    cluster_sil = {}\n    for c in range(k):\n        c_scores = [sil_scores[i] for i in range(len(sil_scores)) \n                    if i < n and labels[i] == c]\n        cluster_sil[c] = sum(c_scores) / len(c_scores) if c_scores else 0\n    \n    return {\n        'n_clusters': k,\n        'cluster_sizes': cluster_sizes,\n        'inertia': inertia,\n        'silhouette': avg_silhouette,\n        'cluster_silhouettes': cluster_sil\n    }\n\n# Test\ndata = [[1, 1], [1, 2], [2, 1], [2, 2],\n        [8, 8], [8, 9], [9, 8], [9, 9]]\nlabels = [0, 0, 0, 0, 1, 1, 1, 1]\n\nreport = clustering_report(data, labels)\n\nprint('CLUSTERING VALIDATION REPORT')\nprint('=' * 50)\nprint(f'\\nNumber of clusters: {report[\"n_clusters\"]}')\nprint(f'Cluster sizes: {report[\"cluster_sizes\"]}')\nprint(f'\\nMetrics:')\nprint(f'  Inertia (WCSS): {report[\"inertia\"]:.2f}')\nprint(f'  Silhouette score: {report[\"silhouette\"]:.3f}')\nprint(f'\\nPer-cluster silhouette:')\nfor c, s in report['cluster_silhouettes'].items():\n    quality = '✓ Good' if s > 0.5 else '⚠ Weak'\n    print(f'  Cluster {c}: {s:.3f} {quality}')\n\nprint(f'\\nOverall quality: {\"Good\" if report[\"silhouette\"] > 0.5 else \"Moderate\"}')",
        solution: "# Complete validation report",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Full report", description: "Validation report" }]),
        hints: ["Calculate multiple metrics", "Include per-cluster analysis", "Provide interpretation"],
        xpReward: 30,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 23.4.1`);

  console.log("\n✅ Part 4 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
