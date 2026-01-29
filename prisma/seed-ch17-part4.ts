import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 4: Lessons 17.2.3-17.2.4 (DFS and BFS)...\n");

  const section17_2 = await prisma.section.findFirst({ where: { number: 17.2 } });
  if (!section17_2) throw new Error("Section 17.2 not found. Run part 1 first.");

  const lesson17_2_3 = await prisma.lesson.upsert({
    where: { slug: "depth-first-search" },
    update: {},
    create: {
      sectionId: section17_2.id,
      number: 17.23,
      title: "Graph Traversal - Depth-First Search",
      slug: "depth-first-search",
      objectives: [
        "Understand DFS traversal strategy",
        "Implement recursive DFS",
        "Implement iterative DFS with stack",
        "Use DFS to find paths and check connectivity",
      ],
      content: `# Depth-First Search (DFS)

## Strategy

Go **deep** before going wide. Explore as far as possible along each branch before backtracking.

Like exploring a maze: go down one path until you hit a dead end, then backtrack.

## Algorithm

\`\`\`
DFS(node):
    Mark node as visited
    For each neighbor of node:
        If neighbor not visited:
            DFS(neighbor)
\`\`\`

## Two Implementations

**Recursive**: Uses call stack
**Iterative**: Uses explicit stack

## Stack Data Structure

LIFO: Last In, First Out
- Push: Add to top
- Pop: Remove from top

## Example Traversal

\`\`\`
    A
   / \\
  B   C
 / \\
D   E
\`\`\`

DFS from A: A → B → D → E → C

## Applications

- Finding paths
- Detecting cycles
- Topological sorting
- Solving mazes`,
      codeExamples: JSON.stringify([
        {
          id: "recursive-dfs",
          title: "Recursive DFS",
          code: "graph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'],\n    'E': ['B', 'F'],\n    'F': ['C', 'E'],\n}\n\ndef dfs_recursive(graph, node, visited=None):\n    if visited is None:\n        visited = set()\n    \n    visited.add(node)\n    print(f'Visiting: {node}')\n    \n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            dfs_recursive(graph, neighbor, visited)\n    \n    return visited\n\nprint('DFS Traversal (recursive):')\nvisited = dfs_recursive(graph, 'A')\nprint(f'\\nVisited: {visited}')",
          description: "DFS using recursion",
        },
        {
          id: "iterative-dfs",
          title: "Iterative DFS with Stack",
          code: "graph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'],\n    'E': ['B', 'F'],\n    'F': ['C', 'E'],\n}\n\ndef dfs_iterative(graph, start):\n    visited = set()\n    stack = [start]\n    order = []\n    \n    while stack:\n        node = stack.pop()  # LIFO\n        if node not in visited:\n            visited.add(node)\n            order.append(node)\n            print(f'Visit: {node}, Stack: {stack}')\n            \n            # Add neighbors to stack (reverse for same order as recursive)\n            for neighbor in reversed(graph[node]):\n                if neighbor not in visited:\n                    stack.append(neighbor)\n    \n    return order\n\nprint('DFS Traversal (iterative):')\norder = dfs_iterative(graph, 'A')\nprint(f'\\nOrder: {order}')",
          description: "DFS using explicit stack",
        },
        {
          id: "dfs-find-path",
          title: "Find Path with DFS",
          code: "graph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'],\n    'E': ['B', 'F'],\n    'F': ['C', 'E'],\n}\n\ndef dfs_path(graph, start, end, path=None):\n    if path is None:\n        path = []\n    \n    path = path + [start]\n    \n    if start == end:\n        return path\n    \n    for neighbor in graph[start]:\n        if neighbor not in path:\n            result = dfs_path(graph, neighbor, end, path)\n            if result:\n                return result\n    \n    return None\n\nprint('Finding paths with DFS:')\nfor target in ['D', 'F', 'Z']:\n    path = dfs_path(graph, 'A', target)\n    if path:\n        print(f'  A → {target}: {\" → \".join(path)}')\n    else:\n        print(f'  A → {target}: No path found')",
          description: "Use DFS to find a path between nodes",
        },
      ]),
      keyPoints: [
        "DFS: go deep, then backtrack",
        "Uses stack (explicit or call stack)",
        "Recursive version is elegant",
        "Iterative uses explicit stack",
        "Time: O(V + E), Space: O(V)",
        "Good for: paths, cycles, connectivity",
      ],
      hardwareDemo: "Watch stack grow with recursive calls. See LIFO behavior of explicit stack.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson17_2_3.number}: ${lesson17_2_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson17_2_3.id,
        number: 1,
        title: "Basic Recursive DFS",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement recursive DFS that prints visit order. Start from node 'A'.",
        starterCode: "graph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D'],\n    'C': ['A', 'D'],\n    'D': ['B', 'C'],\n}\n\ndef dfs(graph, node, visited=None):\n    if visited is None:\n        visited = set()\n    \n    visited.add(node)\n    print(f'Visited: {node}')\n    \n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            dfs(graph, neighbor, visited)\n    \n    return visited\n\nprint('DFS from A:')\nvisited = dfs(graph, 'A')\nprint(f'\\nAll visited: {visited}')",
        solution: "graph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D'],\n    'C': ['A', 'D'],\n    'D': ['B', 'C'],\n}\n\ndef dfs(graph, node, visited=None):\n    if visited is None:\n        visited = set()\n    \n    visited.add(node)\n    print(f'Visited: {node}')\n    \n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            dfs(graph, neighbor, visited)\n    \n    return visited\n\nprint('DFS from A:')\nvisited = dfs(graph, 'A')\nprint(f'\\nAll visited: {visited}')\nprint('Order: A → B → D → C')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All 4 nodes visited", description: "DFS traversal" }]),
        hints: ["Mark visited before recursing", "Check if neighbor already visited", "Pass visited set to recursive calls"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson17_2_3.id,
        number: 2,
        title: "Iterative DFS with Stack",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement DFS using explicit stack. Show stack contents at each step.",
        starterCode: "graph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D'],\n    'C': ['A', 'D'],\n    'D': ['B', 'C'],\n}\n\ndef dfs_iterative(graph, start):\n    visited = set()\n    stack = [start]\n    order = []\n    \n    while stack:\n        node = stack.pop()\n        if node not in visited:\n            visited.add(node)\n            order.append(node)\n            print(f'Pop: {node}, Stack after: {stack}')\n            \n            for neighbor in graph[node]:\n                if neighbor not in visited:\n                    stack.append(neighbor)\n            print(f'  Added neighbors, Stack: {stack}')\n    \n    return order\n\nprint('Iterative DFS:')\norder = dfs_iterative(graph, 'A')\nprint(f'\\nVisit order: {order}')",
        solution: "graph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D'],\n    'C': ['A', 'D'],\n    'D': ['B', 'C'],\n}\n\ndef dfs_iterative(graph, start):\n    visited = set()\n    stack = [start]\n    order = []\n    \n    while stack:\n        node = stack.pop()\n        if node not in visited:\n            visited.add(node)\n            order.append(node)\n            print(f'Pop: {node}, Stack after: {stack}')\n            \n            for neighbor in graph[node]:\n                if neighbor not in visited:\n                    stack.append(neighbor)\n            print(f'  Added neighbors, Stack: {stack}')\n    \n    return order\n\nprint('Iterative DFS:')\norder = dfs_iterative(graph, 'A')\nprint(f'\\nVisit order: {order}')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Stack shown at each step", description: "Iterative DFS" }]),
        hints: ["Pop from stack (LIFO)", "Add unvisited neighbors to stack", "Check visited before processing"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson17_2_3.id,
        number: 3,
        title: "DFS Path Finding",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write DFS function that returns path from start to end. Return None if no path exists.",
        starterCode: "graph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A'],\n    'D': ['B'],\n    'E': ['B', 'F'],\n    'F': ['E'],\n}\n\ndef find_path(graph, start, end, path=None):\n    if path is None:\n        path = []\n    \n    path = path + [start]\n    \n    if start == end:\n        return path\n    \n    for neighbor in graph[start]:\n        if neighbor not in path:\n            result = find_path(graph, neighbor, end, path)\n            if result:\n                return result\n    \n    return None\n\nprint('Path finding with DFS:')\nfor target in ['F', 'C', 'Z']:\n    path = find_path(graph, 'A', target)\n    if path:\n        print(f'  A → {target}: {path}')\n    else:\n        print(f'  A → {target}: No path')",
        solution: "graph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A'],\n    'D': ['B'],\n    'E': ['B', 'F'],\n    'F': ['E'],\n}\n\ndef find_path(graph, start, end, path=None):\n    if path is None:\n        path = []\n    \n    path = path + [start]\n    \n    if start == end:\n        return path\n    \n    for neighbor in graph[start]:\n        if neighbor not in path:\n            result = find_path(graph, neighbor, end, path)\n            if result:\n                return result\n    \n    return None\n\nprint('Path finding with DFS:')\nfor target in ['F', 'C', 'Z']:\n    path = find_path(graph, 'A', target)\n    if path:\n        print(f'  A → {target}: {path}')\n    else:\n        print(f'  A → {target}: No path')\n\nprint('\\nDFS finds A path, not necessarily shortest')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Paths found for F, C; None for Z", description: "Path finding works" }]),
        hints: ["Build path as you recurse", "Return path when end found", "Return None if dead end"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson17_2_3.id,
        number: 4,
        title: "Check Connectivity",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write function is_connected(graph) that returns True if all nodes are reachable from any starting node.",
        starterCode: "def dfs_count(graph, start):\n    visited = set()\n    stack = [start]\n    while stack:\n        node = stack.pop()\n        if node not in visited:\n            visited.add(node)\n            for neighbor in graph[node]:\n                if neighbor not in visited:\n                    stack.append(neighbor)\n    return len(visited)\n\ndef is_connected(graph):\n    if not graph:\n        return True\n    start = next(iter(graph))\n    reachable = dfs_count(graph, start)\n    return reachable == len(graph)\n\n# Connected graph\ngraph1 = {'A': ['B'], 'B': ['A', 'C'], 'C': ['B']}\nprint(f'Graph 1 connected: {is_connected(graph1)}')\n\n# Disconnected graph\ngraph2 = {'A': ['B'], 'B': ['A'], 'C': ['D'], 'D': ['C']}\nprint(f'Graph 2 connected: {is_connected(graph2)}')",
        solution: "def dfs_count(graph, start):\n    visited = set()\n    stack = [start]\n    while stack:\n        node = stack.pop()\n        if node not in visited:\n            visited.add(node)\n            for neighbor in graph[node]:\n                if neighbor not in visited:\n                    stack.append(neighbor)\n    return len(visited)\n\ndef is_connected(graph):\n    if not graph:\n        return True\n    start = next(iter(graph))\n    reachable = dfs_count(graph, start)\n    return reachable == len(graph)\n\ngraph1 = {'A': ['B'], 'B': ['A', 'C'], 'C': ['B']}\nprint(f'Graph 1 connected: {is_connected(graph1)}')\n\ngraph2 = {'A': ['B'], 'B': ['A'], 'C': ['D'], 'D': ['C']}\nprint(f'Graph 2 connected: {is_connected(graph2)}')\n\nprint('\\nGraph 2 has two separate components')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Graph1: True, Graph2: False", description: "Connectivity check" }]),
        hints: ["DFS from any node", "Count reachable nodes", "Compare to total nodes"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson17_2_3.id,
        number: 5,
        title: "DFS with Visit Order",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Implement DFS that tracks both discovery time and finish time for each node.",
        starterCode: "graph = {\n    'A': ['B', 'C'],\n    'B': ['D'],\n    'C': ['D'],\n    'D': [],\n}\n\ndef dfs_times(graph, start):\n    visited = set()\n    discovery = {}\n    finish = {}\n    time = [0]  # Use list to allow modification in nested function\n    \n    def dfs(node):\n        time[0] += 1\n        discovery[node] = time[0]\n        visited.add(node)\n        \n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                dfs(neighbor)\n        \n        time[0] += 1\n        finish[node] = time[0]\n    \n    dfs(start)\n    return discovery, finish\n\ndisc, fin = dfs_times(graph, 'A')\nprint('Node  Discovery  Finish')\nfor node in sorted(graph.keys()):\n    print(f'  {node}      {disc.get(node, \"-\"):>5}      {fin.get(node, \"-\"):>5}')",
        solution: "graph = {\n    'A': ['B', 'C'],\n    'B': ['D'],\n    'C': ['D'],\n    'D': [],\n}\n\ndef dfs_times(graph, start):\n    visited = set()\n    discovery = {}\n    finish = {}\n    time = [0]\n    \n    def dfs(node):\n        time[0] += 1\n        discovery[node] = time[0]\n        visited.add(node)\n        \n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                dfs(neighbor)\n        \n        time[0] += 1\n        finish[node] = time[0]\n    \n    dfs(start)\n    return discovery, finish\n\ndisc, fin = dfs_times(graph, 'A')\nprint('Node  Discovery  Finish')\nfor node in sorted(graph.keys()):\n    print(f'  {node}      {disc.get(node, \"-\"):>5}      {fin.get(node, \"-\"):>5}')\n\nprint('\\nUseful for topological sort and cycle detection')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Discovery and finish times", description: "DFS timestamps" }]),
        hints: ["Increment time on entry and exit", "Discovery when first visited", "Finish after all descendants done"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 17.2.3`);

  const lesson17_2_4 = await prisma.lesson.upsert({
    where: { slug: "breadth-first-search" },
    update: {},
    create: {
      sectionId: section17_2.id,
      number: 17.24,
      title: "Graph Traversal - Breadth-First Search",
      slug: "breadth-first-search",
      objectives: [
        "Understand BFS traversal strategy",
        "Implement BFS with queue",
        "Use BFS to find shortest paths",
        "Compare BFS and DFS",
      ],
      content: `# Breadth-First Search (BFS)

## Strategy

Go **wide** before going deep. Visit all neighbors at current level before moving to next level.

Like ripples in a pond: expand outward layer by layer.

## Algorithm

\`\`\`
BFS(start):
    Create queue with start
    Mark start as visited
    While queue not empty:
        node = dequeue (remove from front)
        For each neighbor of node:
            If neighbor not visited:
                Mark visited
                Enqueue neighbor
\`\`\`

## Queue Data Structure

FIFO: First In, First Out
- Enqueue: Add to back
- Dequeue: Remove from front

## Example Traversal

\`\`\`
    A
   / \\
  B   C
 / \\
D   E
\`\`\`

BFS from A: A → B → C → D → E

## Key Property

BFS finds **shortest path** (fewest edges) in unweighted graphs!

## DFS vs BFS

| Property | DFS | BFS |
|----------|-----|-----|
| Data structure | Stack | Queue |
| Order | Deep first | Wide first |
| Shortest path | No | Yes (unweighted) |
| Memory | O(depth) | O(width) |`,
      codeExamples: JSON.stringify([
        {
          id: "basic-bfs",
          title: "Basic BFS",
          code: "from collections import deque\n\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'],\n    'E': ['B', 'F'],\n    'F': ['C', 'E'],\n}\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    order = []\n    \n    while queue:\n        node = queue.popleft()  # FIFO\n        order.append(node)\n        print(f'Visit: {node}, Queue: {list(queue)}')\n        \n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    \n    return order\n\nprint('BFS Traversal:')\norder = bfs(graph, 'A')\nprint(f'\\nOrder: {order}')",
          description: "BFS using queue",
        },
        {
          id: "bfs-shortest-path",
          title: "BFS Shortest Path",
          code: "from collections import deque\n\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'],\n    'E': ['B', 'F'],\n    'F': ['C', 'E'],\n}\n\ndef bfs_shortest_path(graph, start, end):\n    if start == end:\n        return [start]\n    \n    visited = set([start])\n    queue = deque([(start, [start])])  # (node, path)\n    \n    while queue:\n        node, path = queue.popleft()\n        \n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                new_path = path + [neighbor]\n                if neighbor == end:\n                    return new_path\n                visited.add(neighbor)\n                queue.append((neighbor, new_path))\n    \n    return None\n\nprint('Shortest paths from A:')\nfor target in ['D', 'F', 'E']:\n    path = bfs_shortest_path(graph, 'A', target)\n    print(f'  A → {target}: {path} (length {len(path)-1})')",
          description: "BFS finds shortest path in unweighted graph",
        },
        {
          id: "bfs-levels",
          title: "BFS with Level Tracking",
          code: "from collections import deque\n\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'],\n    'E': ['B', 'F'],\n    'F': ['C', 'E'],\n}\n\ndef bfs_levels(graph, start):\n    visited = set([start])\n    queue = deque([(start, 0)])\n    levels = {start: 0}\n    \n    while queue:\n        node, level = queue.popleft()\n        \n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                levels[neighbor] = level + 1\n                queue.append((neighbor, level + 1))\n    \n    return levels\n\nlevels = bfs_levels(graph, 'A')\nprint('Distance from A:')\nfor level in range(max(levels.values()) + 1):\n    nodes_at_level = [n for n, l in levels.items() if l == level]\n    print(f'  Level {level}: {nodes_at_level}')",
          description: "Track distance from start node",
        },
      ]),
      keyPoints: [
        "BFS: go wide, level by level",
        "Uses queue (FIFO)",
        "Finds shortest path in unweighted graphs",
        "Time: O(V + E), Space: O(V)",
        "Mark visited when enqueueing (not when visiting)",
        "Good for: shortest path, level-order traversal",
      ],
      hardwareDemo: "Watch queue grow and shrink. See FIFO behavior vs LIFO stack.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 4,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson17_2_4.number}: ${lesson17_2_4.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson17_2_4.id,
        number: 1,
        title: "Basic BFS",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement BFS that prints visit order. Use collections.deque for the queue.",
        starterCode: "from collections import deque\n\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D'],\n    'C': ['A', 'D'],\n    'D': ['B', 'C'],\n}\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    order = []\n    \n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        print(f'Visit: {node}')\n        \n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    \n    return order\n\nprint('BFS from A:')\norder = bfs(graph, 'A')\nprint(f'Order: {order}')",
        solution: "from collections import deque\n\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D'],\n    'C': ['A', 'D'],\n    'D': ['B', 'C'],\n}\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    order = []\n    \n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        print(f'Visit: {node}')\n        \n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    \n    return order\n\nprint('BFS from A:')\norder = bfs(graph, 'A')\nprint(f'Order: {order}')\nprint('\\nLevel order: A first, then B,C, then D')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "A, B, C, D order", description: "BFS traversal" }]),
        hints: ["Use deque.popleft() for FIFO", "Mark visited when adding to queue", "Not when visiting!"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson17_2_4.id,
        number: 2,
        title: "BFS Shortest Path",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write BFS function that returns shortest path from start to end.",
        starterCode: "from collections import deque\n\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'],\n    'E': ['B', 'F'],\n    'F': ['C', 'E'],\n}\n\ndef shortest_path(graph, start, end):\n    if start == end:\n        return [start]\n    \n    visited = set([start])\n    queue = deque([(start, [start])])\n    \n    while queue:\n        node, path = queue.popleft()\n        \n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                new_path = path + [neighbor]\n                if neighbor == end:\n                    return new_path\n                visited.add(neighbor)\n                queue.append((neighbor, new_path))\n    \n    return None\n\nprint('Shortest paths:')\nfor target in ['D', 'F']:\n    path = shortest_path(graph, 'A', target)\n    print(f'  A → {target}: {path}')",
        solution: "from collections import deque\n\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'],\n    'E': ['B', 'F'],\n    'F': ['C', 'E'],\n}\n\ndef shortest_path(graph, start, end):\n    if start == end:\n        return [start]\n    \n    visited = set([start])\n    queue = deque([(start, [start])])\n    \n    while queue:\n        node, path = queue.popleft()\n        \n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                new_path = path + [neighbor]\n                if neighbor == end:\n                    return new_path\n                visited.add(neighbor)\n                queue.append((neighbor, new_path))\n    \n    return None\n\nprint('Shortest paths:')\nfor target in ['D', 'F']:\n    path = shortest_path(graph, 'A', target)\n    print(f'  A → {target}: {path}')\n\nprint('\\nBFS guarantees shortest in unweighted graphs!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Shortest paths found", description: "BFS shortest path" }]),
        hints: ["Store (node, path) in queue", "Return immediately when end found", "First path found is shortest"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson17_2_4.id,
        number: 3,
        title: "Level-Order Traversal",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Write BFS that groups nodes by their level (distance from start).",
        starterCode: "from collections import deque\n\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'],\n    'E': ['B'],\n    'F': ['C'],\n}\n\ndef bfs_levels(graph, start):\n    levels = {start: 0}\n    visited = set([start])\n    queue = deque([start])\n    \n    while queue:\n        node = queue.popleft()\n        current_level = levels[node]\n        \n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                levels[neighbor] = current_level + 1\n                queue.append(neighbor)\n    \n    return levels\n\nlevels = bfs_levels(graph, 'A')\nprint('Nodes by level:')\nmax_level = max(levels.values())\nfor lvl in range(max_level + 1):\n    nodes = [n for n, l in levels.items() if l == lvl]\n    print(f'  Level {lvl}: {nodes}')",
        solution: "from collections import deque\n\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'],\n    'E': ['B'],\n    'F': ['C'],\n}\n\ndef bfs_levels(graph, start):\n    levels = {start: 0}\n    visited = set([start])\n    queue = deque([start])\n    \n    while queue:\n        node = queue.popleft()\n        current_level = levels[node]\n        \n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                levels[neighbor] = current_level + 1\n                queue.append(neighbor)\n    \n    return levels\n\nlevels = bfs_levels(graph, 'A')\nprint('Nodes by level:')\nmax_level = max(levels.values())\nfor lvl in range(max_level + 1):\n    nodes = [n for n, l in levels.items() if l == lvl]\n    print(f'  Level {lvl}: {nodes}')\n\nprint('\\nLevel = shortest path length from A')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Nodes grouped by level", description: "Level tracking" }]),
        hints: ["Level of neighbor = level of current + 1", "Store level when adding to queue", "Level 0 is just the start"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson17_2_4.id,
        number: 4,
        title: "Compare BFS and DFS",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Run both BFS and DFS on same graph. Compare visit orders.",
        starterCode: "from collections import deque\n\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'],\n    'E': ['B'],\n    'F': ['C'],\n}\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return order\n\ndef dfs(graph, start):\n    visited = set()\n    stack = [start]\n    order = []\n    while stack:\n        node = stack.pop()\n        if node not in visited:\n            visited.add(node)\n            order.append(node)\n            for neighbor in reversed(graph[node]):\n                if neighbor not in visited:\n                    stack.append(neighbor)\n    return order\n\nprint(f'BFS: {bfs(graph, \"A\")}')\nprint(f'DFS: {dfs(graph, \"A\")}')",
        solution: "from collections import deque\n\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'],\n    'E': ['B'],\n    'F': ['C'],\n}\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return order\n\ndef dfs(graph, start):\n    visited = set()\n    stack = [start]\n    order = []\n    while stack:\n        node = stack.pop()\n        if node not in visited:\n            visited.add(node)\n            order.append(node)\n            for neighbor in reversed(graph[node]):\n                if neighbor not in visited:\n                    stack.append(neighbor)\n    return order\n\nprint(f'BFS: {bfs(graph, \"A\")}')\nprint(f'DFS: {dfs(graph, \"A\")}')\nprint('\\nBFS: level by level')\nprint('DFS: deep first, then backtrack')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Different orders shown", description: "BFS vs DFS" }]),
        hints: ["BFS uses queue (FIFO)", "DFS uses stack (LIFO)", "Order will be different"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson17_2_4.id,
        number: 5,
        title: "Six Degrees of Separation",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Given a social network graph, find the shortest connection path between two people using BFS.",
        starterCode: "from collections import deque\n\n# Social network\nfriends = {\n    'Alice': ['Bob', 'Carol'],\n    'Bob': ['Alice', 'Dave', 'Eve'],\n    'Carol': ['Alice', 'Frank'],\n    'Dave': ['Bob', 'Eve'],\n    'Eve': ['Bob', 'Dave', 'Grace'],\n    'Frank': ['Carol', 'Grace'],\n    'Grace': ['Eve', 'Frank'],\n}\n\ndef find_connection(graph, person1, person2):\n    if person1 == person2:\n        return [person1]\n    \n    visited = set([person1])\n    queue = deque([(person1, [person1])])\n    \n    while queue:\n        person, path = queue.popleft()\n        \n        for friend in graph[person]:\n            if friend not in visited:\n                new_path = path + [friend]\n                if friend == person2:\n                    return new_path\n                visited.add(friend)\n                queue.append((friend, new_path))\n    \n    return None\n\nprint('Social Network Connections:')\npath = find_connection(friends, 'Alice', 'Grace')\nprint(f'Alice → Grace: {\" → \".join(path)}')\nprint(f'Degrees of separation: {len(path) - 1}')",
        solution: "from collections import deque\n\nfriends = {\n    'Alice': ['Bob', 'Carol'],\n    'Bob': ['Alice', 'Dave', 'Eve'],\n    'Carol': ['Alice', 'Frank'],\n    'Dave': ['Bob', 'Eve'],\n    'Eve': ['Bob', 'Dave', 'Grace'],\n    'Frank': ['Carol', 'Grace'],\n    'Grace': ['Eve', 'Frank'],\n}\n\ndef find_connection(graph, person1, person2):\n    if person1 == person2:\n        return [person1]\n    \n    visited = set([person1])\n    queue = deque([(person1, [person1])])\n    \n    while queue:\n        person, path = queue.popleft()\n        \n        for friend in graph[person]:\n            if friend not in visited:\n                new_path = path + [friend]\n                if friend == person2:\n                    return new_path\n                visited.add(friend)\n                queue.append((friend, new_path))\n    \n    return None\n\nprint('Social Network Connections:')\npath = find_connection(friends, 'Alice', 'Grace')\nprint(f'Alice → Grace: {\" → \".join(path)}')\nprint(f'Degrees of separation: {len(path) - 1}')\nprint('\\nBFS finds shortest social connection!')",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Shortest path found", description: "Social network BFS" }]),
        hints: ["Same as shortest path problem", "Degrees = path length - 1", "BFS guarantees shortest"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 17.2.4`);

  console.log("\n✅ Part 4 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
