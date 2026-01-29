import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 3: Lessons 17.2.1-17.2.2 (Graph Basics)...\n");

  const section17_2 = await prisma.section.findFirst({ where: { number: 17.2 } });
  if (!section17_2) throw new Error("Section 17.2 not found. Run part 1 first.");

  const lesson17_2_1 = await prisma.lesson.upsert({
    where: { slug: "intro-graph-theory" },
    update: {},
    create: {
      sectionId: section17_2.id,
      number: 17.21,
      title: "Introduction to Graph Theory",
      slug: "intro-graph-theory",
      objectives: [
        "Understand nodes (vertices) and edges",
        "Distinguish directed vs undirected graphs",
        "Recognize weighted graphs",
        "Identify real-world graph applications",
      ],
      content: `# Introduction to Graph Theory

## What is a Graph?

A graph is a collection of:
- **Nodes (Vertices)**: Things or entities
- **Edges**: Connections between nodes

## Example: Social Network

Nodes = People
Edges = Friendships

\`\`\`
    Alice --- Bob
      |       |
    Carol --- Dan
\`\`\`

## Types of Graphs

**Undirected**: Edges work both ways (friendships)
**Directed**: Edges have direction (following on Twitter)
**Weighted**: Edges have values (distances between cities)

## Graph Terminology

- **Adjacent**: Two nodes connected by an edge
- **Path**: Sequence of nodes connected by edges
- **Cycle**: Path that starts and ends at same node
- **Connected**: Path exists between every pair of nodes
- **Degree**: Number of edges connected to a node

## Real-World Graphs

| Domain | Nodes | Edges |
|--------|-------|-------|
| Social | People | Friendships |
| Web | Pages | Links |
| Maps | Cities | Roads |
| Networks | Computers | Connections |`,
      codeExamples: JSON.stringify([
        {
          id: "simple-graph",
          title: "Conceptual Graph",
          code: "# A simple graph with 4 nodes\nnodes = ['A', 'B', 'C', 'D']\nedges = [\n    ('A', 'B'),\n    ('A', 'C'),\n    ('B', 'D'),\n    ('C', 'D'),\n]\n\nprint('Graph:')\nprint(f'Nodes: {nodes}')\nprint(f'Edges: {edges}')\nprint()\nprint('Visual:')\nprint('    A --- B')\nprint('    |     |')\nprint('    C --- D')",
          description: "Basic graph structure",
        },
        {
          id: "directed-graph",
          title: "Directed Graph",
          code: "# Twitter-like follow relationships\nfollows = {\n    'Alice': ['Bob', 'Carol'],\n    'Bob': ['Carol'],\n    'Carol': ['Alice'],\n    'Dan': ['Alice', 'Bob', 'Carol'],\n}\n\nprint('Who follows whom:')\nfor person, following in follows.items():\n    print(f'  {person} follows: {following}')\n\n# Count followers\nfollower_count = {p: 0 for p in follows}\nfor person, following in follows.items():\n    for f in following:\n        follower_count[f] += 1\n\nprint('\\nFollower counts:')\nfor person, count in follower_count.items():\n    print(f'  {person}: {count} followers')",
          description: "Directed edges (one-way relationships)",
        },
        {
          id: "weighted-graph",
          title: "Weighted Graph",
          code: "# Cities connected by roads with distances\ncities = ['NYC', 'Boston', 'DC', 'Philly']\nroads = [\n    ('NYC', 'Boston', 215),\n    ('NYC', 'Philly', 95),\n    ('NYC', 'DC', 225),\n    ('Philly', 'DC', 140),\n    ('Boston', 'DC', 440),\n]\n\nprint('Road Network:')\nprint(f'Cities: {cities}')\nprint('\\nRoads with distances:')\nfor city1, city2, distance in roads:\n    print(f'  {city1} <-> {city2}: {distance} miles')",
          description: "Edges with weights (distances)",
        },
      ]),
      keyPoints: [
        "Graph = Nodes + Edges",
        "Undirected: edges work both ways",
        "Directed: edges have direction",
        "Weighted: edges have values",
        "Degree: number of edges at a node",
        "Graphs model networks, maps, relationships",
      ],
      hardwareDemo: "Watch node and edge data structures in memory. See adjacency relationships.",
      estimatedTime: 20,
      difficulty: "BEGINNER",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson17_2_1.number}: ${lesson17_2_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson17_2_1.id,
        number: 1,
        title: "Create Node and Edge Lists",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create a graph with 5 nodes (A-E) and 5 edges. Print both lists.",
        starterCode: "nodes = ['A', 'B', 'C', 'D', 'E']\nedges = [\n    ('A', 'B'),\n    ('A', 'C'),\n    ('B', 'D'),\n    ('C', 'D'),\n    ('D', 'E'),\n]\n\nprint(f'Nodes ({len(nodes)}): {nodes}')\nprint(f'Edges ({len(edges)}): {edges}')",
        solution: "nodes = ['A', 'B', 'C', 'D', 'E']\nedges = [\n    ('A', 'B'),\n    ('A', 'C'),\n    ('B', 'D'),\n    ('C', 'D'),\n    ('D', 'E'),\n]\n\nprint(f'Nodes ({len(nodes)}): {nodes}')\nprint(f'Edges ({len(edges)}): {edges}')\nprint('\\nThis is an undirected graph')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "5 nodes, 5 edges", description: "Graph created" }]),
        hints: ["List nodes as strings", "Edges as tuples of two nodes", "Order doesn't matter for undirected"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson17_2_1.id,
        number: 2,
        title: "Calculate Node Degrees",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Calculate the degree (number of connections) for each node in the graph.",
        starterCode: "nodes = ['A', 'B', 'C', 'D']\nedges = [('A','B'), ('A','C'), ('A','D'), ('B','C'), ('C','D')]\n\n# Count degree for each node\ndegree = {node: 0 for node in nodes}\n\nfor n1, n2 in edges:\n    degree[n1] += 1\n    degree[n2] += 1\n\nprint('Node degrees:')\nfor node, d in degree.items():\n    print(f'  {node}: degree {d}')\n\nprint(f'\\nSum of degrees: {sum(degree.values())}')\nprint(f'2 × edges: {2 * len(edges)}')",
        solution: "nodes = ['A', 'B', 'C', 'D']\nedges = [('A','B'), ('A','C'), ('A','D'), ('B','C'), ('C','D')]\n\ndegree = {node: 0 for node in nodes}\n\nfor n1, n2 in edges:\n    degree[n1] += 1\n    degree[n2] += 1\n\nprint('Node degrees:')\nfor node, d in degree.items():\n    print(f'  {node}: degree {d}')\n\nprint(f'\\nSum of degrees: {sum(degree.values())}')\nprint(f'2 × edges: {2 * len(edges)}')\nprint('Sum of degrees always = 2 × edges!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Degrees calculated, sum = 2×edges", description: "Degree calculation" }]),
        hints: ["Each edge contributes 1 to both endpoints", "A has 3 edges connected", "Sum of degrees = 2 × edge count"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson17_2_1.id,
        number: 3,
        title: "Directed Graph",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create a directed graph of website links. Calculate in-degree and out-degree for each page.",
        starterCode: "# Directed graph: page A links to page B\nlinks = [\n    ('Home', 'About'),\n    ('Home', 'Products'),\n    ('Home', 'Contact'),\n    ('About', 'Home'),\n    ('Products', 'Home'),\n    ('Products', 'Contact'),\n]\n\npages = ['Home', 'About', 'Products', 'Contact']\n\nout_degree = {p: 0 for p in pages}\nin_degree = {p: 0 for p in pages}\n\nfor src, dst in links:\n    out_degree[src] += 1\n    in_degree[dst] += 1\n\nprint('Page      Out-degree  In-degree')\nfor page in pages:\n    print(f'{page:10s}  {out_degree[page]:5d}       {in_degree[page]:5d}')",
        solution: "links = [\n    ('Home', 'About'),\n    ('Home', 'Products'),\n    ('Home', 'Contact'),\n    ('About', 'Home'),\n    ('Products', 'Home'),\n    ('Products', 'Contact'),\n]\n\npages = ['Home', 'About', 'Products', 'Contact']\n\nout_degree = {p: 0 for p in pages}\nin_degree = {p: 0 for p in pages}\n\nfor src, dst in links:\n    out_degree[src] += 1\n    in_degree[dst] += 1\n\nprint('Page      Out-degree  In-degree')\nfor page in pages:\n    print(f'{page:10s}  {out_degree[page]:5d}       {in_degree[page]:5d}')\n\nprint('\\nHome has most links (out=3, in=2)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "In and out degrees shown", description: "Directed graph degrees" }]),
        hints: ["Out-degree: links FROM this page", "In-degree: links TO this page", "Home links to 3 pages"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson17_2_1.id,
        number: 4,
        title: "Weighted Graph",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Create weighted graph of flight routes. Find the shortest and longest routes.",
        starterCode: "flights = [\n    ('NYC', 'LA', 2475),\n    ('NYC', 'Chicago', 790),\n    ('NYC', 'Miami', 1280),\n    ('LA', 'Chicago', 1745),\n    ('LA', 'Miami', 2340),\n    ('Chicago', 'Miami', 1380),\n]\n\nprint('Flight routes:')\nfor src, dst, dist in flights:\n    print(f'  {src} -> {dst}: {dist} miles')\n\nshortest = min(flights, key=lambda x: x[2])\nlongest = max(flights, key=lambda x: x[2])\n\nprint(f'\\nShortest: {shortest[0]} -> {shortest[1]} ({shortest[2]} miles)')\nprint(f'Longest:  {longest[0]} -> {longest[1]} ({longest[2]} miles)')",
        solution: "flights = [\n    ('NYC', 'LA', 2475),\n    ('NYC', 'Chicago', 790),\n    ('NYC', 'Miami', 1280),\n    ('LA', 'Chicago', 1745),\n    ('LA', 'Miami', 2340),\n    ('Chicago', 'Miami', 1380),\n]\n\nprint('Flight routes:')\nfor src, dst, dist in flights:\n    print(f'  {src} -> {dst}: {dist} miles')\n\nshortest = min(flights, key=lambda x: x[2])\nlongest = max(flights, key=lambda x: x[2])\n\nprint(f'\\nShortest: {shortest[0]} -> {shortest[1]} ({shortest[2]} miles)')\nprint(f'Longest:  {longest[0]} -> {longest[1]} ({longest[2]} miles)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Shortest and longest found", description: "Weighted graph analysis" }]),
        hints: ["Use min/max with key function", "Third element is distance", "NYC-Chicago is shortest"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson17_2_1.id,
        number: 5,
        title: "Find Neighbors",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write function neighbors(node, edges) that returns all nodes connected to given node.",
        starterCode: "def neighbors(node, edges):\n    result = []\n    for n1, n2 in edges:\n        if n1 == node:\n            result.append(n2)\n        elif n2 == node:\n            result.append(n1)\n    return result\n\nedges = [\n    ('A', 'B'), ('A', 'C'), ('A', 'D'),\n    ('B', 'C'), ('C', 'D'), ('D', 'E'),\n]\n\nprint('Neighbors of each node:')\nfor node in ['A', 'B', 'C', 'D', 'E']:\n    print(f'  {node}: {neighbors(node, edges)}')",
        solution: "def neighbors(node, edges):\n    result = []\n    for n1, n2 in edges:\n        if n1 == node:\n            result.append(n2)\n        elif n2 == node:\n            result.append(n1)\n    return result\n\nedges = [\n    ('A', 'B'), ('A', 'C'), ('A', 'D'),\n    ('B', 'C'), ('C', 'D'), ('D', 'E'),\n]\n\nprint('Neighbors of each node:')\nfor node in ['A', 'B', 'C', 'D', 'E']:\n    print(f'  {node}: {neighbors(node, edges)}')\n\nprint('\\nA has most neighbors (3)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Neighbors listed for each node", description: "Neighbor function works" }]),
        hints: ["Check both positions in edge tuple", "Undirected: either position counts", "Return list of connected nodes"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 17.2.1`);

  const lesson17_2_2 = await prisma.lesson.upsert({
    where: { slug: "graph-representation" },
    update: {},
    create: {
      sectionId: section17_2.id,
      number: 17.22,
      title: "Graph Representation (Adjacency Matrix/List)",
      slug: "graph-representation",
      objectives: [
        "Implement adjacency matrix representation",
        "Implement adjacency list representation",
        "Compare space and time complexity",
        "Choose appropriate representation",
      ],
      content: `# Graph Representation

## Two Main Approaches

**Adjacency Matrix**: 2D array where matrix[i][j] = 1 if edge exists

**Adjacency List**: Dictionary mapping each node to its neighbors

## Adjacency Matrix

\`\`\`
     A  B  C  D
A [  0  1  1  0 ]
B [  1  0  1  1 ]
C [  1  1  0  1 ]
D [  0  1  1  0 ]
\`\`\`

1 means edge exists, 0 means no edge.

## Adjacency List

\`\`\`python
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'C', 'D'],
    'C': ['A', 'B', 'D'],
    'D': ['B', 'C'],
}
\`\`\`

## Comparison

| Operation | Matrix | List |
|-----------|--------|------|
| Check if edge exists | O(1) | O(degree) |
| Get all neighbors | O(n) | O(degree) |
| Space | O(n²) | O(n + e) |
| Add edge | O(1) | O(1) |

## When to Use What

- **Dense graphs** (many edges): Matrix
- **Sparse graphs** (few edges): List
- **Need fast edge lookup**: Matrix
- **Need to iterate neighbors**: List`,
      codeExamples: JSON.stringify([
        {
          id: "adjacency-matrix",
          title: "Adjacency Matrix",
          code: "# Create adjacency matrix for graph\nnodes = ['A', 'B', 'C', 'D']\nedges = [('A','B'), ('A','C'), ('B','C'), ('B','D'), ('C','D')]\n\n# Initialize n×n matrix with zeros\nn = len(nodes)\nmatrix = [[0] * n for _ in range(n)]\n\n# Map node names to indices\nnode_idx = {node: i for i, node in enumerate(nodes)}\n\n# Fill in edges (undirected = symmetric)\nfor n1, n2 in edges:\n    i, j = node_idx[n1], node_idx[n2]\n    matrix[i][j] = 1\n    matrix[j][i] = 1\n\n# Print matrix\nprint('    ' + '  '.join(nodes))\nfor i, node in enumerate(nodes):\n    print(f'{node}  {matrix[i]}')",
          description: "2D array representation",
        },
        {
          id: "adjacency-list",
          title: "Adjacency List",
          code: "# Create adjacency list for same graph\nedges = [('A','B'), ('A','C'), ('B','C'), ('B','D'), ('C','D')]\n\n# Build adjacency list\ngraph = {}\nfor n1, n2 in edges:\n    if n1 not in graph:\n        graph[n1] = []\n    if n2 not in graph:\n        graph[n2] = []\n    graph[n1].append(n2)\n    graph[n2].append(n1)\n\nprint('Adjacency List:')\nfor node, neighbors in sorted(graph.items()):\n    print(f'  {node}: {neighbors}')\n\n# Easy to get neighbors\nprint(f\"\\nNeighbors of B: {graph['B']}\")",
          description: "Dictionary of lists representation",
        },
        {
          id: "operations-comparison",
          title: "Comparing Operations",
          code: "# Same graph, different representations\nnodes = ['A', 'B', 'C', 'D']\nedges = [('A','B'), ('A','C'), ('B','C'), ('B','D'), ('C','D')]\n\n# Adjacency list\nadj_list = {n: [] for n in nodes}\nfor n1, n2 in edges:\n    adj_list[n1].append(n2)\n    adj_list[n2].append(n1)\n\n# Adjacency matrix\nidx = {n: i for i, n in enumerate(nodes)}\nmatrix = [[0]*4 for _ in range(4)]\nfor n1, n2 in edges:\n    matrix[idx[n1]][idx[n2]] = 1\n    matrix[idx[n2]][idx[n1]] = 1\n\n# Check edge exists\nprint('Is there edge A-B?')\nprint(f'  List: {\"B\" in adj_list[\"A\"]}')\nprint(f'  Matrix: {matrix[idx[\"A\"]][idx[\"B\"]] == 1}')\n\n# Get neighbors\nprint('\\nNeighbors of B:')\nprint(f'  List: {adj_list[\"B\"]}')\nprint(f'  Matrix: {[nodes[j] for j in range(4) if matrix[idx[\"B\"]][j]]}')",
          description: "Same operations, both representations",
        },
      ]),
      keyPoints: [
        "Matrix: O(n²) space, O(1) edge check",
        "List: O(n+e) space, O(degree) edge check",
        "Matrix good for dense graphs",
        "List good for sparse graphs",
        "List easier for iterating neighbors",
        "Most real graphs are sparse → use list",
      ],
      hardwareDemo: "Watch 2D array indexing. Compare to dictionary lookup for adjacency list.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson17_2_2.number}: ${lesson17_2_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson17_2_2.id,
        number: 1,
        title: "Build Adjacency Matrix",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Build adjacency matrix for graph with edges: A-B, A-C, B-D, C-D. Print the matrix.",
        starterCode: "nodes = ['A', 'B', 'C', 'D']\nedges = [('A','B'), ('A','C'), ('B','D'), ('C','D')]\n\nn = len(nodes)\nmatrix = [[0] * n for _ in range(n)]\nnode_idx = {node: i for i, node in enumerate(nodes)}\n\nfor n1, n2 in edges:\n    i, j = node_idx[n1], node_idx[n2]\n    matrix[i][j] = 1\n    matrix[j][i] = 1\n\nprint('    ' + '  '.join(nodes))\nfor i, node in enumerate(nodes):\n    print(f'{node}  {matrix[i]}')",
        solution: "nodes = ['A', 'B', 'C', 'D']\nedges = [('A','B'), ('A','C'), ('B','D'), ('C','D')]\n\nn = len(nodes)\nmatrix = [[0] * n for _ in range(n)]\nnode_idx = {node: i for i, node in enumerate(nodes)}\n\nfor n1, n2 in edges:\n    i, j = node_idx[n1], node_idx[n2]\n    matrix[i][j] = 1\n    matrix[j][i] = 1\n\nprint('    ' + '  '.join(nodes))\nfor i, node in enumerate(nodes):\n    print(f'{node}  {matrix[i]}')\n\nprint('\\nSymmetric matrix (undirected graph)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "4x4 symmetric matrix", description: "Matrix built correctly" }]),
        hints: ["Map nodes to indices 0-3", "Set both matrix[i][j] and matrix[j][i]", "Diagonal should be 0 (no self-loops)"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson17_2_2.id,
        number: 2,
        title: "Build Adjacency List",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Build adjacency list for the same graph. Use dictionary with node keys.",
        starterCode: "edges = [('A','B'), ('A','C'), ('B','D'), ('C','D')]\n\n# Build adjacency list\ngraph = {}\nfor n1, n2 in edges:\n    if n1 not in graph:\n        graph[n1] = []\n    if n2 not in graph:\n        graph[n2] = []\n    graph[n1].append(n2)\n    graph[n2].append(n1)\n\nprint('Adjacency List:')\nfor node in sorted(graph.keys()):\n    print(f'  {node}: {graph[node]}')",
        solution: "edges = [('A','B'), ('A','C'), ('B','D'), ('C','D')]\n\ngraph = {}\nfor n1, n2 in edges:\n    if n1 not in graph:\n        graph[n1] = []\n    if n2 not in graph:\n        graph[n2] = []\n    graph[n1].append(n2)\n    graph[n2].append(n1)\n\nprint('Adjacency List:')\nfor node in sorted(graph.keys()):\n    print(f'  {node}: {graph[node]}')\n\nprint('\\nEach edge appears twice (once per endpoint)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Dictionary with neighbor lists", description: "Adjacency list built" }]),
        hints: ["Each node maps to list of neighbors", "Add edge to both endpoints", "Check if key exists first"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson17_2_2.id,
        number: 3,
        title: "Edge Existence Check",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write function has_edge(graph, n1, n2) for adjacency list. Test several node pairs.",
        starterCode: "graph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D'],\n    'C': ['A', 'D'],\n    'D': ['B', 'C'],\n}\n\ndef has_edge(graph, n1, n2):\n    if n1 not in graph:\n        return False\n    return n2 in graph[n1]\n\ntest_pairs = [('A','B'), ('A','D'), ('B','C'), ('B','D')]\n\nprint('Edge existence check:')\nfor n1, n2 in test_pairs:\n    result = has_edge(graph, n1, n2)\n    print(f'  {n1}-{n2}: {result}')",
        solution: "graph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D'],\n    'C': ['A', 'D'],\n    'D': ['B', 'C'],\n}\n\ndef has_edge(graph, n1, n2):\n    if n1 not in graph:\n        return False\n    return n2 in graph[n1]\n\ntest_pairs = [('A','B'), ('A','D'), ('B','C'), ('B','D')]\n\nprint('Edge existence check:')\nfor n1, n2 in test_pairs:\n    result = has_edge(graph, n1, n2)\n    print(f'  {n1}-{n2}: {result}')\n\nprint('\\nA-D is False (no direct edge)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "A-B:True, A-D:False, etc.", description: "Edge check works" }]),
        hints: ["Check if n2 is in neighbors of n1", "Handle case where n1 not in graph", "A-D should be False"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson17_2_2.id,
        number: 4,
        title: "Weighted Adjacency List",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Build weighted adjacency list storing (neighbor, weight) tuples. Find neighbors of each node with weights.",
        starterCode: "weighted_edges = [\n    ('A', 'B', 5),\n    ('A', 'C', 3),\n    ('B', 'C', 2),\n    ('B', 'D', 4),\n    ('C', 'D', 6),\n]\n\n# Build weighted adjacency list\ngraph = {}\nfor n1, n2, weight in weighted_edges:\n    if n1 not in graph:\n        graph[n1] = []\n    if n2 not in graph:\n        graph[n2] = []\n    graph[n1].append((n2, weight))\n    graph[n2].append((n1, weight))\n\nprint('Weighted Adjacency List:')\nfor node in sorted(graph.keys()):\n    neighbors = [(n, w) for n, w in graph[node]]\n    print(f'  {node}: {neighbors}')",
        solution: "weighted_edges = [\n    ('A', 'B', 5),\n    ('A', 'C', 3),\n    ('B', 'C', 2),\n    ('B', 'D', 4),\n    ('C', 'D', 6),\n]\n\ngraph = {}\nfor n1, n2, weight in weighted_edges:\n    if n1 not in graph:\n        graph[n1] = []\n    if n2 not in graph:\n        graph[n2] = []\n    graph[n1].append((n2, weight))\n    graph[n2].append((n1, weight))\n\nprint('Weighted Adjacency List:')\nfor node in sorted(graph.keys()):\n    neighbors = [(n, w) for n, w in graph[node]]\n    print(f'  {node}: {neighbors}')\n\nprint('\\nTuples store (neighbor, edge_weight)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Weighted neighbor lists", description: "Weighted graph built" }]),
        hints: ["Store (neighbor, weight) tuples", "Each edge has 3 values now", "Weight included in both directions"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson17_2_2.id,
        number: 5,
        title: "Space Comparison",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Compare space usage of matrix vs list for sparse graph (n nodes, few edges) and dense graph (n nodes, many edges).",
        starterCode: "def space_analysis(n_nodes, n_edges):\n    # Matrix: n×n integers\n    matrix_space = n_nodes * n_nodes\n    \n    # List: n entries + 2*e neighbor refs (undirected)\n    list_space = n_nodes + 2 * n_edges\n    \n    return matrix_space, list_space\n\nprint('Space Comparison (in units):')\nprint('Nodes  Edges    Matrix    List')\n\ncases = [\n    (10, 15),    # Sparse\n    (10, 45),    # Dense (max is 45 for n=10)\n    (100, 200),  # Sparse\n    (100, 4950), # Dense\n]\n\nfor n, e in cases:\n    matrix, lst = space_analysis(n, e)\n    better = 'List' if lst < matrix else 'Matrix'\n    print(f'{n:5d}  {e:5d}    {matrix:6d}    {lst:5d}  ({better})')",
        solution: "def space_analysis(n_nodes, n_edges):\n    matrix_space = n_nodes * n_nodes\n    list_space = n_nodes + 2 * n_edges\n    return matrix_space, list_space\n\nprint('Space Comparison (in units):')\nprint('Nodes  Edges    Matrix    List')\n\ncases = [\n    (10, 15),\n    (10, 45),\n    (100, 200),\n    (100, 4950),\n]\n\nfor n, e in cases:\n    matrix, lst = space_analysis(n, e)\n    better = 'List' if lst < matrix else 'Matrix'\n    print(f'{n:5d}  {e:5d}    {matrix:6d}    {lst:5d}  ({better})')\n\nprint('\\nSparse graphs → List wins')\nprint('Dense graphs → Matrix comparable')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Space comparison shown", description: "Space analysis" }]),
        hints: ["Matrix always n²", "List is n + 2e", "Sparse: few edges, dense: many edges"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 17.2.2`);

  console.log("\n✅ Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
