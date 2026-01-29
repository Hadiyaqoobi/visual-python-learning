import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 5: Lessons 17.3.1-17.3.2 (Shortest Path)...\n");

  const section17_3 = await prisma.section.findFirst({ where: { number: 17.3 } });
  if (!section17_3) throw new Error("Section 17.3 not found. Run part 1 first.");

  const lesson17_3_1 = await prisma.lesson.upsert({
    where: { slug: "shortest-path-problems" },
    update: {},
    create: {
      sectionId: section17_3.id,
      number: 17.31,
      title: "Shortest Path Problems",
      slug: "shortest-path-problems",
      objectives: [
        "Understand weighted shortest path problems",
        "Distinguish from unweighted BFS",
        "Recognize real-world applications",
        "Understand why greedy doesn't always work",
      ],
      content: `# Shortest Path Problems

## The Problem

Given a weighted graph, find the path with **minimum total weight** from source to destination.

## Unweighted vs Weighted

**Unweighted**: BFS finds shortest path (fewest edges)
**Weighted**: Need smarter algorithms (Dijkstra's, etc.)

## Why BFS Doesn't Work for Weighted Graphs

\`\`\`
A --1-- B --1-- C
|               |
+------10------+
\`\`\`

BFS might find A→C (direct, 1 edge) but weight is 10.
Better path: A→B→C (2 edges) with weight 2!

## Real-World Applications

- **GPS Navigation**: Shortest route (distance or time)
- **Network Routing**: Fastest data path
- **Game AI**: Pathfinding for characters
- **Flight Planning**: Cheapest or fastest route

## Problem Variants

- **Single Source**: From one node to all others
- **Single Pair**: From source to specific target
- **All Pairs**: Between every pair of nodes

## Greedy Pitfall

Always taking the cheapest next edge doesn't guarantee the overall cheapest path!`,
      codeExamples: JSON.stringify([
        {
          id: "weighted-graph-setup",
          title: "Weighted Graph Setup",
          code: "# Weighted graph as adjacency list\n# Each neighbor is (node, weight)\ngraph = {\n    'A': [('B', 4), ('C', 2)],\n    'B': [('A', 4), ('C', 1), ('D', 5)],\n    'C': [('A', 2), ('B', 1), ('D', 8)],\n    'D': [('B', 5), ('C', 8)],\n}\n\nprint('Weighted Graph:')\nfor node, neighbors in graph.items():\n    print(f'  {node}: {neighbors}')\n\nprint('\\nPaths from A to D:')\nprint('  A→C→D: 2 + 8 = 10')\nprint('  A→B→D: 4 + 5 = 9')\nprint('  A→C→B→D: 2 + 1 + 5 = 8  ← shortest!')",
          description: "Setup weighted graph structure",
        },
        {
          id: "bfs-fails",
          title: "Why BFS Fails on Weighted Graphs",
          code: "from collections import deque\n\n# Weighted graph\ngraph = {\n    'A': [('B', 1), ('C', 10)],\n    'B': [('A', 1), ('C', 1)],\n    'C': [('A', 10), ('B', 1)],\n}\n\ndef bfs_path(graph, start, end):\n    visited = set([start])\n    queue = deque([(start, [start])])\n    while queue:\n        node, path = queue.popleft()\n        for neighbor, weight in graph[node]:\n            if neighbor not in visited:\n                new_path = path + [neighbor]\n                if neighbor == end:\n                    return new_path\n                visited.add(neighbor)\n                queue.append((neighbor, new_path))\n    return None\n\npath = bfs_path(graph, 'A', 'C')\nprint(f'BFS path A→C: {path}')\nprint(f'BFS found direct path (1 edge)')\nprint(f'But A→C costs 10!')\nprint(f'A→B→C costs only 2!')",
          description: "BFS ignores edge weights",
        },
        {
          id: "greedy-fails",
          title: "Why Greedy Fails",
          code: "# Graph where greedy fails\ngraph = {\n    'A': [('B', 1), ('C', 5)],\n    'B': [('D', 10)],\n    'C': [('D', 1)],\n    'D': [],\n}\n\ndef greedy_path(graph, start, end):\n    path = [start]\n    total = 0\n    current = start\n    visited = set([start])\n    \n    while current != end:\n        neighbors = [(n, w) for n, w in graph[current] if n not in visited]\n        if not neighbors:\n            return None, float('inf')\n        # Greedy: take cheapest edge\n        next_node, weight = min(neighbors, key=lambda x: x[1])\n        path.append(next_node)\n        total += weight\n        visited.add(next_node)\n        current = next_node\n    \n    return path, total\n\npath, cost = greedy_path(graph, 'A', 'D')\nprint(f'Greedy path: {path}, cost: {cost}')\nprint(f'\\nBut A→C→D costs only 5 + 1 = 6!')\nprint('Greedy took cheap first step, got stuck with expensive second.')",
          description: "Greedy approach can fail",
        },
      ]),
      keyPoints: [
        "Weighted graphs have costs on edges",
        "BFS finds fewest edges, not minimum weight",
        "Greedy (cheapest next step) can fail",
        "Need algorithms like Dijkstra's",
        "Applications: GPS, routing, games",
        "Store weights as (neighbor, weight) tuples",
      ],
      hardwareDemo: "Watch path cost accumulation. See comparison of different route costs.",
      estimatedTime: 25,
      difficulty: "INTERMEDIATE",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson17_3_1.number}: ${lesson17_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson17_3_1.id,
        number: 1,
        title: "Create Weighted Graph",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Create weighted adjacency list for cities connected by roads with distances.",
        starterCode: "# Cities and road distances\nroads = [\n    ('NYC', 'Boston', 215),\n    ('NYC', 'Philly', 95),\n    ('Boston', 'Portland', 110),\n    ('Philly', 'DC', 140),\n    ('DC', 'Richmond', 110),\n]\n\n# Build weighted adjacency list\ngraph = {}\nfor city1, city2, distance in roads:\n    if city1 not in graph:\n        graph[city1] = []\n    if city2 not in graph:\n        graph[city2] = []\n    graph[city1].append((city2, distance))\n    graph[city2].append((city1, distance))\n\nprint('Road Network:')\nfor city, neighbors in sorted(graph.items()):\n    print(f'  {city}: {neighbors}')",
        solution: "roads = [\n    ('NYC', 'Boston', 215),\n    ('NYC', 'Philly', 95),\n    ('Boston', 'Portland', 110),\n    ('Philly', 'DC', 140),\n    ('DC', 'Richmond', 110),\n]\n\ngraph = {}\nfor city1, city2, distance in roads:\n    if city1 not in graph:\n        graph[city1] = []\n    if city2 not in graph:\n        graph[city2] = []\n    graph[city1].append((city2, distance))\n    graph[city2].append((city1, distance))\n\nprint('Road Network:')\nfor city, neighbors in sorted(graph.items()):\n    print(f'  {city}: {neighbors}')\n\nprint('\\nWeighted edges stored as (neighbor, distance)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Weighted adjacency list", description: "Graph created" }]),
        hints: ["Store (neighbor, weight) tuples", "Add edges both directions", "Handle new cities"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson17_3_1.id,
        number: 2,
        title: "Calculate Path Cost",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write function path_cost(graph, path) that returns total weight of a path.",
        starterCode: "graph = {\n    'A': [('B', 4), ('C', 2)],\n    'B': [('A', 4), ('C', 1), ('D', 5)],\n    'C': [('A', 2), ('B', 1), ('D', 8)],\n    'D': [('B', 5), ('C', 8)],\n}\n\ndef path_cost(graph, path):\n    total = 0\n    for i in range(len(path) - 1):\n        current = path[i]\n        next_node = path[i + 1]\n        # Find weight of edge\n        for neighbor, weight in graph[current]:\n            if neighbor == next_node:\n                total += weight\n                break\n    return total\n\npaths = [\n    ['A', 'B', 'D'],\n    ['A', 'C', 'D'],\n    ['A', 'C', 'B', 'D'],\n]\n\nprint('Path costs:')\nfor path in paths:\n    cost = path_cost(graph, path)\n    print(f'  {\" → \".join(path)}: {cost}')",
        solution: "graph = {\n    'A': [('B', 4), ('C', 2)],\n    'B': [('A', 4), ('C', 1), ('D', 5)],\n    'C': [('A', 2), ('B', 1), ('D', 8)],\n    'D': [('B', 5), ('C', 8)],\n}\n\ndef path_cost(graph, path):\n    total = 0\n    for i in range(len(path) - 1):\n        current = path[i]\n        next_node = path[i + 1]\n        for neighbor, weight in graph[current]:\n            if neighbor == next_node:\n                total += weight\n                break\n    return total\n\npaths = [\n    ['A', 'B', 'D'],\n    ['A', 'C', 'D'],\n    ['A', 'C', 'B', 'D'],\n]\n\nprint('Path costs:')\nfor path in paths:\n    cost = path_cost(graph, path)\n    print(f'  {\" → \".join(path)}: {cost}')\n\nprint('\\nA→C→B→D is shortest (8)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Path costs calculated", description: "Cost calculation" }]),
        hints: ["Sum weights of consecutive edges", "Look up weight for each pair", "Shorter path ≠ lower cost"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson17_3_1.id,
        number: 3,
        title: "BFS Finds Wrong Path",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Show that BFS finds path with fewest edges but not minimum cost.",
        starterCode: "from collections import deque\n\ngraph = {\n    'A': [('B', 1), ('C', 100)],\n    'B': [('A', 1), ('C', 1)],\n    'C': [('A', 100), ('B', 1)],\n}\n\ndef bfs_path(graph, start, end):\n    visited = set([start])\n    queue = deque([(start, [start])])\n    while queue:\n        node, path = queue.popleft()\n        for neighbor, _ in graph[node]:  # Ignore weight!\n            if neighbor not in visited:\n                new_path = path + [neighbor]\n                if neighbor == end:\n                    return new_path\n                visited.add(neighbor)\n                queue.append((neighbor, new_path))\n    return None\n\ndef path_cost(graph, path):\n    total = 0\n    for i in range(len(path)-1):\n        for n, w in graph[path[i]]:\n            if n == path[i+1]:\n                total += w\n    return total\n\nbfs_result = bfs_path(graph, 'A', 'C')\nprint(f'BFS path: {bfs_result}')\nprint(f'BFS cost: {path_cost(graph, bfs_result)}')\nprint(f'\\nBetter path: A→B→C')\nprint(f'Better cost: {path_cost(graph, [\"A\", \"B\", \"C\"])}')",
        solution: "from collections import deque\n\ngraph = {\n    'A': [('B', 1), ('C', 100)],\n    'B': [('A', 1), ('C', 1)],\n    'C': [('A', 100), ('B', 1)],\n}\n\ndef bfs_path(graph, start, end):\n    visited = set([start])\n    queue = deque([(start, [start])])\n    while queue:\n        node, path = queue.popleft()\n        for neighbor, _ in graph[node]:\n            if neighbor not in visited:\n                new_path = path + [neighbor]\n                if neighbor == end:\n                    return new_path\n                visited.add(neighbor)\n                queue.append((neighbor, new_path))\n    return None\n\ndef path_cost(graph, path):\n    total = 0\n    for i in range(len(path)-1):\n        for n, w in graph[path[i]]:\n            if n == path[i+1]:\n                total += w\n    return total\n\nbfs_result = bfs_path(graph, 'A', 'C')\nprint(f'BFS path: {bfs_result}')\nprint(f'BFS cost: {path_cost(graph, bfs_result)}')\nprint(f'\\nBetter path: A→B→C')\nprint(f'Better cost: {path_cost(graph, [\"A\", \"B\", \"C\"])}')\nprint('\\nBFS ignores weights!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "BFS cost 100 vs optimal 2", description: "BFS limitation" }]),
        hints: ["BFS finds 1-edge path A→C", "That costs 100!", "A→B→C costs only 2"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson17_3_1.id,
        number: 4,
        title: "Brute Force All Paths",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Find ALL paths from A to D, calculate costs, return shortest. (Works for small graphs only!)",
        starterCode: "graph = {\n    'A': [('B', 4), ('C', 2)],\n    'B': [('A', 4), ('C', 1), ('D', 5)],\n    'C': [('A', 2), ('B', 1), ('D', 8)],\n    'D': [('B', 5), ('C', 8)],\n}\n\ndef all_paths(graph, start, end, path=None):\n    if path is None:\n        path = []\n    path = path + [start]\n    \n    if start == end:\n        return [path]\n    \n    paths = []\n    for neighbor, _ in graph[start]:\n        if neighbor not in path:\n            new_paths = all_paths(graph, neighbor, end, path)\n            paths.extend(new_paths)\n    return paths\n\ndef path_cost(graph, path):\n    total = 0\n    for i in range(len(path)-1):\n        for n, w in graph[path[i]]:\n            if n == path[i+1]:\n                total += w\n    return total\n\npaths = all_paths(graph, 'A', 'D')\nprint('All paths A → D:')\nfor p in paths:\n    cost = path_cost(graph, p)\n    print(f'  {\" → \".join(p)}: cost {cost}')\n\nbest = min(paths, key=lambda p: path_cost(graph, p))\nprint(f'\\nShortest: {\" → \".join(best)} (cost {path_cost(graph, best)})')",
        solution: "graph = {\n    'A': [('B', 4), ('C', 2)],\n    'B': [('A', 4), ('C', 1), ('D', 5)],\n    'C': [('A', 2), ('B', 1), ('D', 8)],\n    'D': [('B', 5), ('C', 8)],\n}\n\ndef all_paths(graph, start, end, path=None):\n    if path is None:\n        path = []\n    path = path + [start]\n    \n    if start == end:\n        return [path]\n    \n    paths = []\n    for neighbor, _ in graph[start]:\n        if neighbor not in path:\n            new_paths = all_paths(graph, neighbor, end, path)\n            paths.extend(new_paths)\n    return paths\n\ndef path_cost(graph, path):\n    total = 0\n    for i in range(len(path)-1):\n        for n, w in graph[path[i]]:\n            if n == path[i+1]:\n                total += w\n    return total\n\npaths = all_paths(graph, 'A', 'D')\nprint('All paths A → D:')\nfor p in paths:\n    cost = path_cost(graph, p)\n    print(f'  {\" → \".join(p)}: cost {cost}')\n\nbest = min(paths, key=lambda p: path_cost(graph, p))\nprint(f'\\nShortest: {\" → \".join(best)} (cost {path_cost(graph, best)})')\nprint('\\nBrute force works but is slow for large graphs!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All paths found, shortest identified", description: "Brute force" }]),
        hints: ["DFS to find all paths", "Avoid cycles (check if in path)", "Compare all costs"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson17_3_1.id,
        number: 5,
        title: "GPS Navigation Example",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Model a GPS problem: find shortest route considering both distance and time (create two separate graphs).",
        starterCode: "# Same roads, different weights\nroads_distance = {\n    'Home': [('Mall', 5), ('Office', 10)],\n    'Mall': [('Home', 5), ('Office', 3), ('Park', 7)],\n    'Office': [('Home', 10), ('Mall', 3), ('Park', 2)],\n    'Park': [('Mall', 7), ('Office', 2)],\n}\n\nroads_time = {  # Time in minutes (traffic!)\n    'Home': [('Mall', 15), ('Office', 12)],  # Mall has traffic\n    'Mall': [('Home', 15), ('Office', 8), ('Park', 10)],\n    'Office': [('Home', 12), ('Mall', 8), ('Park', 5)],\n    'Park': [('Mall', 10), ('Office', 5)],\n}\n\ndef path_cost(graph, path):\n    total = 0\n    for i in range(len(path)-1):\n        for n, w in graph[path[i]]:\n            if n == path[i+1]:\n                total += w\n    return total\n\n# Compare two routes\nroute1 = ['Home', 'Mall', 'Park']\nroute2 = ['Home', 'Office', 'Park']\n\nprint('Route comparison Home → Park:')\nprint(f'\\nVia Mall: {\" → \".join(route1)}')\nprint(f'  Distance: {path_cost(roads_distance, route1)} km')\nprint(f'  Time: {path_cost(roads_time, route1)} min')\n\nprint(f'\\nVia Office: {\" → \".join(route2)}')\nprint(f'  Distance: {path_cost(roads_distance, route2)} km')\nprint(f'  Time: {path_cost(roads_time, route2)} min')",
        solution: "roads_distance = {\n    'Home': [('Mall', 5), ('Office', 10)],\n    'Mall': [('Home', 5), ('Office', 3), ('Park', 7)],\n    'Office': [('Home', 10), ('Mall', 3), ('Park', 2)],\n    'Park': [('Mall', 7), ('Office', 2)],\n}\n\nroads_time = {\n    'Home': [('Mall', 15), ('Office', 12)],\n    'Mall': [('Home', 15), ('Office', 8), ('Park', 10)],\n    'Office': [('Home', 12), ('Mall', 8), ('Park', 5)],\n    'Park': [('Mall', 10), ('Office', 5)],\n}\n\ndef path_cost(graph, path):\n    total = 0\n    for i in range(len(path)-1):\n        for n, w in graph[path[i]]:\n            if n == path[i+1]:\n                total += w\n    return total\n\nroute1 = ['Home', 'Mall', 'Park']\nroute2 = ['Home', 'Office', 'Park']\n\nprint('Route comparison Home → Park:')\nprint(f'\\nVia Mall: {\" → \".join(route1)}')\nprint(f'  Distance: {path_cost(roads_distance, route1)} km')\nprint(f'  Time: {path_cost(roads_time, route1)} min')\n\nprint(f'\\nVia Office: {\" → \".join(route2)}')\nprint(f'  Distance: {path_cost(roads_distance, route2)} km')\nprint(f'  Time: {path_cost(roads_time, route2)} min')\n\nprint('\\nShortest distance ≠ shortest time!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Distance vs time comparison", description: "GPS example" }]),
        hints: ["Same topology, different weights", "Mall route shorter but slower", "Office route longer but faster"],
        xpReward: 20,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 17.3.1`);

  const lesson17_3_2 = await prisma.lesson.upsert({
    where: { slug: "dijkstras-algorithm" },
    update: {},
    create: {
      sectionId: section17_3.id,
      number: 17.32,
      title: "Dijkstra's Algorithm (Simplified)",
      slug: "dijkstras-algorithm",
      objectives: [
        "Understand Dijkstra's algorithm concept",
        "Implement simplified version",
        "Trace algorithm execution",
        "Know limitations (no negative weights)",
      ],
      content: `# Dijkstra's Algorithm

## The Idea

Expand outward from source, always processing the **closest unvisited node**.

Like water spreading through pipes - it reaches closer nodes first!

## Algorithm Steps

\`\`\`
1. Set distance to source = 0, all others = ∞
2. Mark all nodes unvisited
3. While unvisited nodes exist:
   a. Pick unvisited node with smallest distance
   b. For each neighbor:
      - If distance through current node is shorter:
        - Update neighbor's distance
   c. Mark current node as visited
\`\`\`

## Key Insight

When we visit a node, we've found its shortest path!
(This only works with non-negative weights)

## Example Trace

\`\`\`
Graph: A--1--B--2--D
       |     |
       4     1
       |     |
       C--3--+
       
Start: A
Step 1: Visit A, update B(1), C(4)
Step 2: Visit B (closest), update D(3), C(2)
Step 3: Visit C, no improvements
Step 4: Visit D, done!
\`\`\`

## Complexity

- Simple implementation: O(V²)
- With priority queue: O((V+E) log V)`,
      codeExamples: JSON.stringify([
        {
          id: "simple-dijkstra",
          title: "Simple Dijkstra Implementation",
          code: "def dijkstra(graph, start):\n    # Initialize distances\n    distances = {node: float('inf') for node in graph}\n    distances[start] = 0\n    visited = set()\n    \n    while len(visited) < len(graph):\n        # Find unvisited node with smallest distance\n        min_dist = float('inf')\n        min_node = None\n        for node in graph:\n            if node not in visited and distances[node] < min_dist:\n                min_dist = distances[node]\n                min_node = node\n        \n        if min_node is None:\n            break\n        \n        visited.add(min_node)\n        print(f'Visit {min_node}, distance = {distances[min_node]}')\n        \n        # Update neighbors\n        for neighbor, weight in graph[min_node]:\n            new_dist = distances[min_node] + weight\n            if new_dist < distances[neighbor]:\n                print(f'  Update {neighbor}: {distances[neighbor]} → {new_dist}')\n                distances[neighbor] = new_dist\n    \n    return distances\n\ngraph = {\n    'A': [('B', 1), ('C', 4)],\n    'B': [('A', 1), ('C', 2), ('D', 5)],\n    'C': [('A', 4), ('B', 2), ('D', 1)],\n    'D': [('B', 5), ('C', 1)],\n}\n\nprint('Dijkstra from A:\\n')\ndist = dijkstra(graph, 'A')\nprint(f'\\nFinal distances: {dist}')",
          description: "Basic Dijkstra implementation",
        },
        {
          id: "dijkstra-with-path",
          title: "Dijkstra with Path Tracking",
          code: "def dijkstra_path(graph, start, end):\n    distances = {node: float('inf') for node in graph}\n    distances[start] = 0\n    previous = {node: None for node in graph}\n    visited = set()\n    \n    while len(visited) < len(graph):\n        # Find closest unvisited\n        min_node = None\n        for node in graph:\n            if node not in visited and distances[node] < float('inf'):\n                if min_node is None or distances[node] < distances[min_node]:\n                    min_node = node\n        \n        if min_node is None or min_node == end:\n            break\n        \n        visited.add(min_node)\n        \n        for neighbor, weight in graph[min_node]:\n            new_dist = distances[min_node] + weight\n            if new_dist < distances[neighbor]:\n                distances[neighbor] = new_dist\n                previous[neighbor] = min_node\n    \n    # Reconstruct path\n    path = []\n    current = end\n    while current:\n        path.append(current)\n        current = previous[current]\n    path.reverse()\n    \n    return path, distances[end]\n\ngraph = {\n    'A': [('B', 1), ('C', 4)],\n    'B': [('A', 1), ('C', 2), ('D', 5)],\n    'C': [('A', 4), ('B', 2), ('D', 1)],\n    'D': [('B', 5), ('C', 1)],\n}\n\npath, dist = dijkstra_path(graph, 'A', 'D')\nprint(f'Shortest path A→D: {\" → \".join(path)}')\nprint(f'Total distance: {dist}')",
          description: "Track and reconstruct shortest path",
        },
        {
          id: "dijkstra-all-pairs",
          title: "All Shortest Paths from Source",
          code: "def dijkstra(graph, start):\n    distances = {n: float('inf') for n in graph}\n    distances[start] = 0\n    previous = {n: None for n in graph}\n    visited = set()\n    \n    while len(visited) < len(graph):\n        min_node = min((n for n in graph if n not in visited),\n                       key=lambda n: distances[n], default=None)\n        if min_node is None or distances[min_node] == float('inf'):\n            break\n        \n        visited.add(min_node)\n        for neighbor, weight in graph[min_node]:\n            new_dist = distances[min_node] + weight\n            if new_dist < distances[neighbor]:\n                distances[neighbor] = new_dist\n                previous[neighbor] = min_node\n    \n    return distances, previous\n\ngraph = {\n    'A': [('B', 1), ('C', 4)],\n    'B': [('A', 1), ('C', 2), ('D', 5)],\n    'C': [('A', 4), ('B', 2), ('D', 1)],\n    'D': [('B', 5), ('C', 1)],\n}\n\ndist, prev = dijkstra(graph, 'A')\nprint('Shortest distances from A:')\nfor node, d in sorted(dist.items()):\n    print(f'  A → {node}: {d}')",
          description: "Find all shortest paths from one source",
        },
      ]),
      keyPoints: [
        "Always process closest unvisited node",
        "Update neighbors if shorter path found",
        "When visited, shortest path is final",
        "Works only with non-negative weights",
        "Time: O(V²) simple, O((V+E)logV) with heap",
        "Foundation of GPS and network routing",
      ],
      hardwareDemo: "Watch distance table updates. See node selection based on minimum distance.",
      estimatedTime: 35,
      difficulty: "ADVANCED",
      order: 2,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson17_3_2.number}: ${lesson17_3_2.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson17_3_2.id,
        number: 1,
        title: "Initialize Distances",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write function to initialize distance table: source=0, all others=infinity.",
        starterCode: "def init_distances(graph, source):\n    distances = {}\n    for node in graph:\n        if node == source:\n            distances[node] = 0\n        else:\n            distances[node] = float('inf')\n    return distances\n\ngraph = {\n    'A': [('B', 1), ('C', 4)],\n    'B': [('A', 1), ('D', 3)],\n    'C': [('A', 4), ('D', 2)],\n    'D': [('B', 3), ('C', 2)],\n}\n\ndist = init_distances(graph, 'A')\nprint('Initial distances from A:')\nfor node, d in sorted(dist.items()):\n    print(f'  {node}: {d}')",
        solution: "def init_distances(graph, source):\n    distances = {}\n    for node in graph:\n        if node == source:\n            distances[node] = 0\n        else:\n            distances[node] = float('inf')\n    return distances\n\ngraph = {\n    'A': [('B', 1), ('C', 4)],\n    'B': [('A', 1), ('D', 3)],\n    'C': [('A', 4), ('D', 2)],\n    'D': [('B', 3), ('C', 2)],\n}\n\ndist = init_distances(graph, 'A')\nprint('Initial distances from A:')\nfor node, d in sorted(dist.items()):\n    print(f'  {node}: {d}')\n\nprint('\\nSource=0, others=∞ (unknown yet)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "A:0, others:inf", description: "Distances initialized" }]),
        hints: ["Source distance is 0", "All others start at infinity", "float('inf') for infinity"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson17_3_2.id,
        number: 2,
        title: "Find Minimum Unvisited",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write function to find unvisited node with smallest distance.",
        starterCode: "def find_min_unvisited(distances, visited):\n    min_dist = float('inf')\n    min_node = None\n    \n    for node, dist in distances.items():\n        if node not in visited and dist < min_dist:\n            min_dist = dist\n            min_node = node\n    \n    return min_node\n\ndistances = {'A': 0, 'B': 5, 'C': 3, 'D': float('inf')}\nvisited = {'A'}  # A already visited\n\nprint(f'Distances: {distances}')\nprint(f'Visited: {visited}')\nprint(f'\\nMinimum unvisited: {find_min_unvisited(distances, visited)}')",
        solution: "def find_min_unvisited(distances, visited):\n    min_dist = float('inf')\n    min_node = None\n    \n    for node, dist in distances.items():\n        if node not in visited and dist < min_dist:\n            min_dist = dist\n            min_node = node\n    \n    return min_node\n\ndistances = {'A': 0, 'B': 5, 'C': 3, 'D': float('inf')}\nvisited = {'A'}\n\nprint(f'Distances: {distances}')\nprint(f'Visited: {visited}')\nprint(f'\\nMinimum unvisited: {find_min_unvisited(distances, visited)}')\nprint('\\nC has smallest distance (3) among unvisited')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "C (distance 3)", description: "Minimum found" }]),
        hints: ["Skip visited nodes", "Track minimum seen so far", "Return None if all visited"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson17_3_2.id,
        number: 3,
        title: "Update Neighbors",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Write function to update neighbor distances through current node.",
        starterCode: "def update_neighbors(graph, current, distances):\n    updates = []\n    for neighbor, weight in graph[current]:\n        new_dist = distances[current] + weight\n        if new_dist < distances[neighbor]:\n            old_dist = distances[neighbor]\n            distances[neighbor] = new_dist\n            updates.append((neighbor, old_dist, new_dist))\n    return updates\n\ngraph = {\n    'A': [('B', 1), ('C', 4)],\n    'B': [('A', 1), ('C', 2), ('D', 5)],\n    'C': [('A', 4), ('B', 2), ('D', 1)],\n    'D': [('B', 5), ('C', 1)],\n}\n\ndistances = {'A': 0, 'B': float('inf'), 'C': float('inf'), 'D': float('inf')}\n\nprint('Processing A:')\nupdates = update_neighbors(graph, 'A', distances)\nfor n, old, new in updates:\n    print(f'  {n}: {old} → {new}')\nprint(f'\\nDistances now: {distances}')",
        solution: "def update_neighbors(graph, current, distances):\n    updates = []\n    for neighbor, weight in graph[current]:\n        new_dist = distances[current] + weight\n        if new_dist < distances[neighbor]:\n            old_dist = distances[neighbor]\n            distances[neighbor] = new_dist\n            updates.append((neighbor, old_dist, new_dist))\n    return updates\n\ngraph = {\n    'A': [('B', 1), ('C', 4)],\n    'B': [('A', 1), ('C', 2), ('D', 5)],\n    'C': [('A', 4), ('B', 2), ('D', 1)],\n    'D': [('B', 5), ('C', 1)],\n}\n\ndistances = {'A': 0, 'B': float('inf'), 'C': float('inf'), 'D': float('inf')}\n\nprint('Processing A:')\nupdates = update_neighbors(graph, 'A', distances)\nfor n, old, new in updates:\n    print(f'  {n}: {old} → {new}')\nprint(f'\\nDistances now: {distances}')\nprint('\\nB updated to 1, C updated to 4')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Neighbors updated", description: "Relaxation step" }]),
        hints: ["new_dist = current_dist + edge_weight", "Only update if shorter", "This is called 'relaxation'"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson17_3_2.id,
        number: 4,
        title: "Complete Dijkstra",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement complete Dijkstra's algorithm. Print each step.",
        starterCode: "def dijkstra(graph, start):\n    distances = {n: float('inf') for n in graph}\n    distances[start] = 0\n    visited = set()\n    \n    while len(visited) < len(graph):\n        # Find minimum unvisited\n        min_node = None\n        for node in graph:\n            if node not in visited:\n                if min_node is None or distances[node] < distances[min_node]:\n                    min_node = node\n        \n        if min_node is None or distances[min_node] == float('inf'):\n            break\n        \n        print(f'Visit {min_node} (dist={distances[min_node]})')\n        visited.add(min_node)\n        \n        # Update neighbors\n        for neighbor, weight in graph[min_node]:\n            new_dist = distances[min_node] + weight\n            if new_dist < distances[neighbor]:\n                print(f'  Update {neighbor}: {distances[neighbor]}→{new_dist}')\n                distances[neighbor] = new_dist\n    \n    return distances\n\ngraph = {\n    'A': [('B', 1), ('C', 4)],\n    'B': [('A', 1), ('C', 2), ('D', 5)],\n    'C': [('A', 4), ('B', 2), ('D', 1)],\n    'D': [('B', 5), ('C', 1)],\n}\n\nprint('Dijkstra from A:\\n')\nresult = dijkstra(graph, 'A')\nprint(f'\\nFinal: {result}')",
        solution: "def dijkstra(graph, start):\n    distances = {n: float('inf') for n in graph}\n    distances[start] = 0\n    visited = set()\n    \n    while len(visited) < len(graph):\n        min_node = None\n        for node in graph:\n            if node not in visited:\n                if min_node is None or distances[node] < distances[min_node]:\n                    min_node = node\n        \n        if min_node is None or distances[min_node] == float('inf'):\n            break\n        \n        print(f'Visit {min_node} (dist={distances[min_node]})')\n        visited.add(min_node)\n        \n        for neighbor, weight in graph[min_node]:\n            new_dist = distances[min_node] + weight\n            if new_dist < distances[neighbor]:\n                print(f'  Update {neighbor}: {distances[neighbor]}→{new_dist}')\n                distances[neighbor] = new_dist\n    \n    return distances\n\ngraph = {\n    'A': [('B', 1), ('C', 4)],\n    'B': [('A', 1), ('C', 2), ('D', 5)],\n    'C': [('A', 4), ('B', 2), ('D', 1)],\n    'D': [('B', 5), ('C', 1)],\n}\n\nprint('Dijkstra from A:\\n')\nresult = dijkstra(graph, 'A')\nprint(f'\\nFinal: {result}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Correct shortest distances", description: "Full Dijkstra" }]),
        hints: ["Process nodes in order of distance", "A(0) → B(1) → C(3) → D(4)", "C gets updated from 4 to 3 via B"],
        xpReward: 25,
        order: 4,
      },
      {
        lessonId: lesson17_3_2.id,
        number: 5,
        title: "Dijkstra with Path",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Extend Dijkstra to track and return the actual shortest path, not just distance.",
        starterCode: "def dijkstra_path(graph, start, end):\n    distances = {n: float('inf') for n in graph}\n    distances[start] = 0\n    previous = {n: None for n in graph}\n    visited = set()\n    \n    while len(visited) < len(graph):\n        min_node = None\n        for node in graph:\n            if node not in visited and distances[node] < float('inf'):\n                if min_node is None or distances[node] < distances[min_node]:\n                    min_node = node\n        \n        if min_node is None or min_node == end:\n            break\n        \n        visited.add(min_node)\n        \n        for neighbor, weight in graph[min_node]:\n            new_dist = distances[min_node] + weight\n            if new_dist < distances[neighbor]:\n                distances[neighbor] = new_dist\n                previous[neighbor] = min_node\n    \n    # Reconstruct path\n    path = []\n    current = end\n    while current is not None:\n        path.append(current)\n        current = previous[current]\n    path.reverse()\n    \n    return path, distances[end]\n\ngraph = {\n    'A': [('B', 1), ('C', 4)],\n    'B': [('A', 1), ('C', 2), ('D', 5)],\n    'C': [('A', 4), ('B', 2), ('D', 1)],\n    'D': [('B', 5), ('C', 1)],\n}\n\npath, dist = dijkstra_path(graph, 'A', 'D')\nprint(f'Shortest path: {\" → \".join(path)}')\nprint(f'Total distance: {dist}')",
        solution: "def dijkstra_path(graph, start, end):\n    distances = {n: float('inf') for n in graph}\n    distances[start] = 0\n    previous = {n: None for n in graph}\n    visited = set()\n    \n    while len(visited) < len(graph):\n        min_node = None\n        for node in graph:\n            if node not in visited and distances[node] < float('inf'):\n                if min_node is None or distances[node] < distances[min_node]:\n                    min_node = node\n        \n        if min_node is None or min_node == end:\n            break\n        \n        visited.add(min_node)\n        \n        for neighbor, weight in graph[min_node]:\n            new_dist = distances[min_node] + weight\n            if new_dist < distances[neighbor]:\n                distances[neighbor] = new_dist\n                previous[neighbor] = min_node\n    \n    path = []\n    current = end\n    while current is not None:\n        path.append(current)\n        current = previous[current]\n    path.reverse()\n    \n    return path, distances[end]\n\ngraph = {\n    'A': [('B', 1), ('C', 4)],\n    'B': [('A', 1), ('C', 2), ('D', 5)],\n    'C': [('A', 4), ('B', 2), ('D', 1)],\n    'D': [('B', 5), ('C', 1)],\n}\n\npath, dist = dijkstra_path(graph, 'A', 'D')\nprint(f'Shortest path: {\" → \".join(path)}')\nprint(f'Total distance: {dist}')\nprint('\\nPath: A → B → C → D (not A → B → D!)')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "A → B → C → D, dist=4", description: "Path reconstruction" }]),
        hints: ["Track previous node for each update", "Backtrack from end to start", "Reverse to get correct order"],
        xpReward: 30,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 17.3.2`);

  console.log("\n✅ Part 5 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
