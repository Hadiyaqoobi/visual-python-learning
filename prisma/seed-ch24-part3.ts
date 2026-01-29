import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 3: Lessons 24.2.3-24.2.5...\n");

  const section24_2 = await prisma.section.findFirst({ where: { number: 24.2 } });
  if (!section24_2) throw new Error("Section 24.2 not found.");

  // Lesson 24.2.3
  const lesson24_2_3 = await prisma.lesson.upsert({
    where: { slug: "data-selection-filtering" },
    update: {},
    create: {
      sectionId: section24_2.id,
      number: 24.23,
      title: "Data Selection and Filtering",
      slug: "data-selection-filtering",
      objectives: [
        "Select data using loc and iloc",
        "Filter rows with boolean conditions",
        "Combine multiple filter conditions",
        "Use query() for readable filtering",
      ],
      content: `# Data Selection and Filtering

## Selection Methods

### iloc: Integer Location
Select by position (like array indexing).
\`\`\`python
df.iloc[0]       # First row
df.iloc[0:5]     # First 5 rows
df.iloc[:, 0]    # First column
df.iloc[0:5, 0:2] # Rows 0-4, columns 0-1
\`\`\`

### loc: Label Location
Select by label/name.
\`\`\`python
df.loc[0]              # Row with index 0
df.loc[:, 'column']    # All rows, one column
df.loc[0:5, 'col1':'col3']  # Slice by labels
\`\`\`

## Boolean Filtering

\`\`\`python
# Single condition
df[df['age'] > 30]

# Multiple conditions (use & for AND, | for OR)
df[(df['age'] > 30) & (df['salary'] > 50000)]
df[(df['dept'] == 'Sales') | (df['dept'] == 'IT')]

# Using isin()
df[df['dept'].isin(['Sales', 'IT', 'HR'])]
\`\`\`

## Query Method

More readable for complex filters:
\`\`\`python
df.query('age > 30 and salary > 50000')
df.query('dept in ["Sales", "IT"]')
\`\`\`

## Common Patterns

\`\`\`python
# Null filtering
df[df['col'].notna()]
df[df['col'].isna()]

# String contains
df[df['name'].str.contains('John')]
\`\`\``,
      codeExamples: JSON.stringify([
        {
          id: "iloc-selection",
          title: "Selection with iloc (Position)",
          code: "# iloc: integer-location based selection\ndata = {\n    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],\n    'age': [25, 30, 35, 28, 32],\n    'dept': ['Sales', 'IT', 'IT', 'HR', 'Sales'],\n    'salary': [50000, 60000, 70000, 45000, 55000]\n}\n\ndef iloc_row(data, idx):\n    return {col: data[col][idx] for col in data}\n\ndef iloc_rows(data, start, end):\n    return {col: data[col][start:end] for col in data}\n\ndef iloc_col(data, col_idx):\n    cols = list(data.keys())\n    return data[cols[col_idx]]\n\nprint('iloc SELECTION (by position)')\nprint('=' * 50)\n\nprint('\\ndf.iloc[0] - First row:')\nprint(f'  {iloc_row(data, 0)}')\n\nprint('\\ndf.iloc[1:3] - Rows 1-2:')\nfor col, vals in iloc_rows(data, 1, 3).items():\n    print(f'  {col}: {vals}')\n\nprint('\\ndf.iloc[:, 1] - Second column (age):')\nprint(f'  {iloc_col(data, 1)}')\n\nprint('\\n💡 iloc uses integer positions like array indexing')",
          description: "Select by position with iloc",
        },
        {
          id: "boolean-filtering",
          title: "Boolean Filtering",
          code: "# Boolean filtering\ndata = {\n    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],\n    'age': [25, 30, 35, 28, 32],\n    'dept': ['Sales', 'IT', 'IT', 'HR', 'Sales'],\n    'salary': [50000, 60000, 70000, 45000, 55000]\n}\n\ndef filter_data(data, condition_func):\n    \"\"\"Filter rows where condition is True\"\"\"\n    indices = [i for i in range(len(data['name'])) if condition_func(data, i)]\n    return {col: [data[col][i] for i in indices] for col in data}\n\nprint('BOOLEAN FILTERING')\nprint('=' * 55)\n\n# Age > 30\nresult = filter_data(data, lambda d, i: d['age'][i] > 30)\nprint('\\ndf[df[\"age\"] > 30]:')\nprint(f'  Names: {result[\"name\"]}')\n\n# Salary >= 55000 AND dept == IT\nresult = filter_data(data, lambda d, i: d['salary'][i] >= 55000 and d['dept'][i] == 'IT')\nprint('\\ndf[(df[\"salary\"] >= 55000) & (df[\"dept\"] == \"IT\")]:')\nprint(f'  Names: {result[\"name\"]}')\n\n# Dept is Sales OR HR\nresult = filter_data(data, lambda d, i: d['dept'][i] in ['Sales', 'HR'])\nprint('\\ndf[df[\"dept\"].isin([\"Sales\", \"HR\"])]:')\nprint(f'  Names: {result[\"name\"]}')\n\nprint('\\n💡 Use & for AND, | for OR (with parentheses!)')",
          description: "Filter with boolean conditions",
        },
        {
          id: "complex-filters",
          title: "Complex Filter Patterns",
          code: "# Complex filtering patterns\ndata = {\n    'product': ['Laptop', 'Phone', 'Tablet', 'Watch', 'Headphones', 'Camera'],\n    'price': [999, 699, 449, 299, 149, 599],\n    'category': ['Electronics', 'Electronics', 'Electronics', 'Wearable', 'Audio', 'Electronics'],\n    'in_stock': [True, True, False, True, True, False]\n}\n\ndef filter_data(data, mask):\n    return {col: [data[col][i] for i, m in enumerate(mask) if m] for col in data}\n\nprint('COMPLEX FILTER PATTERNS')\nprint('=' * 55)\n\n# In stock AND price < 500\nmask = [data['in_stock'][i] and data['price'][i] < 500 for i in range(len(data['product']))]\nresult = filter_data(data, mask)\nprint('\\nIn stock AND price < $500:')\nprint(f'  Products: {result[\"product\"]}')\nprint(f'  Prices: {result[\"price\"]}')\n\n# Electronics OR price > 500\nmask = [data['category'][i] == 'Electronics' or data['price'][i] > 500 for i in range(len(data['product']))]\nresult = filter_data(data, mask)\nprint('\\nElectronics OR price > $500:')\nprint(f'  Products: {result[\"product\"]}')\n\n# NOT in stock\nmask = [not data['in_stock'][i] for i in range(len(data['product']))]\nresult = filter_data(data, mask)\nprint('\\nNOT in stock:')\nprint(f'  Products: {result[\"product\"]}')\n\nprint('\\n💡 Pandas: df.query(\"in_stock and price < 500\")')",
          description: "Complex multi-condition filters",
        },
      ]),
      keyPoints: [
        "iloc: select by integer position",
        "loc: select by label/name",
        "Boolean mask: df[df['col'] > value]",
        "Combine conditions with & (AND) and | (OR)",
        "Use parentheses around each condition",
        "isin() for checking multiple values",
      ],
      hardwareDemo: "Watch boolean mask creation. See filtered rows extracted.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 3,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson24_2_3.number}: ${lesson24_2_3.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson24_2_3.id,
        number: 1,
        title: "Select by Position",
        type: "CODE",
        difficulty: "BEGINNER",
        prompt: "Practice selecting rows and columns by position using iloc.",
        starterCode: "data = {\n    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'],\n    'score': [85, 92, 78, 88, 95, 72],\n    'grade': ['B', 'A', 'C', 'B', 'A', 'C']\n}\n\ndef iloc_row(data, idx):\n    return {col: data[col][idx] for col in data}\n\ndef iloc_slice(data, start, end):\n    return {col: data[col][start:end] for col in data}\n\nprint('SELECTION BY POSITION (iloc)')\nprint('=' * 45)\n\nprint('\\nFirst row (iloc[0]):')\nprint(f'  {iloc_row(data, 0)}')\n\nprint('\\nLast row (iloc[-1]):')\nprint(f'  {iloc_row(data, -1)}')\n\nprint('\\nRows 2-4 (iloc[2:5]):')\nsliced = iloc_slice(data, 2, 5)\nfor col, vals in sliced.items():\n    print(f'  {col}: {vals}')\n\nprint('\\nFirst 3 rows (iloc[:3]):')\nfor name, score in zip(iloc_slice(data, 0, 3)['name'], iloc_slice(data, 0, 3)['score']):\n    print(f'  {name}: {score}')",
        solution: "# Selection by position",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Selections shown", description: "iloc selection" }]),
        hints: ["Use index for single row", "Slice for range", "Negative index from end"],
        xpReward: 10,
        order: 1,
      },
      {
        lessonId: lesson24_2_3.id,
        number: 2,
        title: "Filter with Single Condition",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Filter DataFrame rows based on a single condition.",
        starterCode: "data = {\n    'product': ['A', 'B', 'C', 'D', 'E', 'F'],\n    'price': [100, 250, 75, 300, 150, 200],\n    'quantity': [50, 30, 100, 20, 60, 40]\n}\n\ndef filter_by(data, column, condition):\n    \"\"\"Filter data where condition(value) is True\"\"\"\n    mask = [condition(data[column][i]) for i in range(len(data[column]))]\n    return {col: [data[col][i] for i, m in enumerate(mask) if m] for col in data}\n\nprint('SINGLE CONDITION FILTERING')\nprint('=' * 50)\n\n# Price > 150\nresult = filter_by(data, 'price', lambda x: x > 150)\nprint('\\nProducts where price > 150:')\nprint(f'  Products: {result[\"product\"]}')\nprint(f'  Prices: {result[\"price\"]}')\n\n# Quantity >= 50\nresult = filter_by(data, 'quantity', lambda x: x >= 50)\nprint('\\nProducts where quantity >= 50:')\nprint(f'  Products: {result[\"product\"]}')\nprint(f'  Quantities: {result[\"quantity\"]}')\n\n# Price between 100 and 200\nresult = filter_by(data, 'price', lambda x: 100 <= x <= 200)\nprint('\\nProducts where 100 <= price <= 200:')\nprint(f'  Products: {result[\"product\"]}')",
        solution: "# Single condition filter",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Filtered results", description: "Single condition" }]),
        hints: ["Create boolean mask", "Filter all columns", "Lambda for condition"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson24_2_3.id,
        number: 3,
        title: "Combine Multiple Conditions",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Filter with AND, OR, and NOT conditions.",
        starterCode: "data = {\n    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],\n    'dept': ['Sales', 'IT', 'IT', 'HR', 'Sales'],\n    'salary': [55000, 65000, 58000, 48000, 62000],\n    'years': [3, 7, 2, 5, 4]\n}\n\ndef multi_filter(data, condition_func):\n    mask = [condition_func(data, i) for i in range(len(data['name']))]\n    return {col: [data[col][i] for i, m in enumerate(mask) if m] for col in data}\n\nprint('MULTIPLE CONDITIONS')\nprint('=' * 55)\n\n# IT AND salary > 60000\nresult = multi_filter(data, lambda d, i: d['dept'][i] == 'IT' and d['salary'][i] > 60000)\nprint('\\nIT dept AND salary > 60000:')\nprint(f'  {result[\"name\"]}')\n\n# Sales OR HR\nresult = multi_filter(data, lambda d, i: d['dept'][i] in ['Sales', 'HR'])\nprint('\\nSales OR HR:')\nprint(f'  {result[\"name\"]}')\n\n# NOT IT\nresult = multi_filter(data, lambda d, i: d['dept'][i] != 'IT')\nprint('\\nNOT IT dept:')\nprint(f'  {result[\"name\"]}')\n\n# (Sales OR IT) AND years >= 3\nresult = multi_filter(data, lambda d, i: d['dept'][i] in ['Sales', 'IT'] and d['years'][i] >= 3)\nprint('\\n(Sales OR IT) AND years >= 3:')\nprint(f'  {result[\"name\"]}')",
        solution: "# Multiple conditions",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Combined filters", description: "Multiple conditions" }]),
        hints: ["and for AND", "in [...] for OR on values", "!= for NOT equal"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson24_2_3.id,
        number: 4,
        title: "Filter and Select Columns",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Filter rows and select specific columns in one operation.",
        starterCode: "data = {\n    'id': [1, 2, 3, 4, 5],\n    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],\n    'dept': ['Sales', 'IT', 'IT', 'HR', 'Sales'],\n    'salary': [55000, 65000, 58000, 48000, 62000],\n    'bonus': [5500, 6500, 5800, 4800, 6200]\n}\n\ndef filter_select(data, condition, columns):\n    \"\"\"Filter rows and select specific columns\"\"\"\n    mask = [condition(data, i) for i in range(len(data['id']))]\n    return {col: [data[col][i] for i, m in enumerate(mask) if m] for col in columns}\n\nprint('FILTER AND SELECT')\nprint('=' * 50)\n\n# IT employees, show only name and salary\nresult = filter_select(data, \n                       lambda d, i: d['dept'][i] == 'IT',\n                       ['name', 'salary'])\nprint('\\nIT employees (name, salary only):')\nfor name, sal in zip(result['name'], result['salary']):\n    print(f'  {name}: ${sal:,}')\n\n# High earners (salary > 55000), show name, dept, total comp\nresult = filter_select(data,\n                       lambda d, i: d['salary'][i] > 55000,\n                       ['name', 'dept', 'salary', 'bonus'])\nprint('\\nHigh earners (salary > 55000):')\nfor i in range(len(result['name'])):\n    total = result['salary'][i] + result['bonus'][i]\n    print(f'  {result[\"name\"][i]} ({result[\"dept\"][i]}): ${total:,}')",
        solution: "# Filter and select",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Filtered columns", description: "Filter and select" }]),
        hints: ["Filter first", "Then select columns", "Can calculate derived values"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson24_2_3.id,
        number: 5,
        title: "String Pattern Filtering",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Filter data based on string patterns and text matching.",
        starterCode: "data = {\n    'email': ['john@gmail.com', 'jane@yahoo.com', 'bob@gmail.com', \n              'alice@outlook.com', 'charlie@gmail.com'],\n    'name': ['John Smith', 'Jane Doe', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'],\n    'status': ['active', 'inactive', 'active', 'pending', 'active']\n}\n\ndef filter_contains(data, column, pattern):\n    mask = [pattern.lower() in data[column][i].lower() for i in range(len(data[column]))]\n    return {col: [data[col][i] for i, m in enumerate(mask) if m] for col in data}\n\ndef filter_startswith(data, column, prefix):\n    mask = [data[column][i].lower().startswith(prefix.lower()) for i in range(len(data[column]))]\n    return {col: [data[col][i] for i, m in enumerate(mask) if m] for col in data}\n\nprint('STRING PATTERN FILTERING')\nprint('=' * 55)\n\n# Gmail users\nresult = filter_contains(data, 'email', 'gmail')\nprint('\\nGmail users:')\nprint(f'  Emails: {result[\"email\"]}')\n\n# Names starting with 'J'\nresult = filter_startswith(data, 'name', 'J')\nprint('\\nNames starting with J:')\nprint(f'  Names: {result[\"name\"]}')\n\n# Active status (exact match)\nresult = filter_contains(data, 'status', 'active')\nprint('\\nActive users:')\nprint(f'  Names: {result[\"name\"]}')\n\nprint('\\n💡 Pandas: df[df[\"email\"].str.contains(\"gmail\")]')",
        solution: "# String filtering",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Pattern matches", description: "String patterns" }]),
        hints: ["Use 'in' for contains", "startswith() for prefix", "lower() for case-insensitive"],
        xpReward: 15,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 24.2.3`);

  // Lesson 24.2.4
  const lesson24_2_4 = await prisma.lesson.upsert({
    where: { slug: "data-aggregation-grouping" },
    update: {},
    create: {
      sectionId: section24_2.id,
      number: 24.24,
      title: "Data Aggregation and Grouping",
      slug: "data-aggregation-grouping",
      objectives: [
        "Understand the split-apply-combine pattern",
        "Use groupby for aggregation",
        "Apply multiple aggregation functions",
        "Create pivot tables",
      ],
      content: `# Data Aggregation and Grouping

## The Split-Apply-Combine Pattern

1. **Split**: Divide data into groups
2. **Apply**: Compute something for each group
3. **Combine**: Merge results back together

## GroupBy Basics

\`\`\`python
# Group by one column
df.groupby('dept')['salary'].mean()

# Group by multiple columns
df.groupby(['dept', 'year'])['sales'].sum()

# Multiple aggregations
df.groupby('dept').agg({
    'salary': 'mean',
    'bonus': 'sum',
    'id': 'count'
})
\`\`\`

## Common Aggregations

- count(): Number of non-null values
- sum(): Total
- mean(): Average
- min(), max(): Extremes
- std(): Standard deviation
- first(), last(): First/last value

## Pivot Tables

\`\`\`python
pd.pivot_table(df,
    values='sales',
    index='region',
    columns='product',
    aggfunc='sum'
)
\`\`\`

## Transform vs Aggregate

- **agg()**: Returns one value per group
- **transform()**: Returns same shape as input`,
      codeExamples: JSON.stringify([
        {
          id: "groupby-basics",
          title: "GroupBy Basics",
          code: "from collections import defaultdict\n\ndata = {\n    'dept': ['Sales', 'IT', 'Sales', 'IT', 'HR', 'Sales', 'HR'],\n    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace'],\n    'salary': [55000, 65000, 52000, 70000, 48000, 58000, 51000]\n}\n\ndef groupby_mean(data, group_col, value_col):\n    \"\"\"Group by column and calculate mean\"\"\"\n    groups = defaultdict(list)\n    for i in range(len(data[group_col])):\n        groups[data[group_col][i]].append(data[value_col][i])\n    return {k: sum(v)/len(v) for k, v in groups.items()}\n\ndef groupby_sum(data, group_col, value_col):\n    groups = defaultdict(list)\n    for i in range(len(data[group_col])):\n        groups[data[group_col][i]].append(data[value_col][i])\n    return {k: sum(v) for k, v in groups.items()}\n\ndef groupby_count(data, group_col):\n    groups = defaultdict(int)\n    for val in data[group_col]:\n        groups[val] += 1\n    return dict(groups)\n\nprint('GROUPBY BASICS')\nprint('=' * 50)\n\nprint('\\nMean salary by department:')\nfor dept, avg in groupby_mean(data, 'dept', 'salary').items():\n    print(f'  {dept}: ${avg:,.0f}')\n\nprint('\\nTotal salary by department:')\nfor dept, total in groupby_sum(data, 'dept', 'salary').items():\n    print(f'  {dept}: ${total:,}')\n\nprint('\\nCount by department:')\nfor dept, count in groupby_count(data, 'dept').items():\n    print(f'  {dept}: {count} employees')\n\nprint('\\n💡 Pandas: df.groupby(\"dept\")[\"salary\"].mean()')",
          description: "Basic groupby operations",
        },
        {
          id: "multiple-agg",
          title: "Multiple Aggregations",
          code: "from collections import defaultdict\nimport math\n\ndata = {\n    'region': ['East', 'West', 'East', 'West', 'East', 'West'],\n    'product': ['A', 'A', 'B', 'B', 'A', 'B'],\n    'sales': [100, 150, 200, 180, 120, 220],\n    'quantity': [10, 15, 20, 18, 12, 22]\n}\n\ndef groupby_agg(data, group_col, agg_dict):\n    \"\"\"Group and apply multiple aggregations\"\"\"\n    # Group the data\n    groups = defaultdict(lambda: defaultdict(list))\n    for i in range(len(data[group_col])):\n        key = data[group_col][i]\n        for col in agg_dict:\n            groups[key][col].append(data[col][i])\n    \n    # Apply aggregations\n    result = {}\n    for key, cols in groups.items():\n        result[key] = {}\n        for col, func in agg_dict.items():\n            values = cols[col]\n            if func == 'sum':\n                result[key][col] = sum(values)\n            elif func == 'mean':\n                result[key][col] = sum(values) / len(values)\n            elif func == 'count':\n                result[key][col] = len(values)\n            elif func == 'min':\n                result[key][col] = min(values)\n            elif func == 'max':\n                result[key][col] = max(values)\n    return result\n\nprint('MULTIPLE AGGREGATIONS')\nprint('=' * 55)\n\nagg_result = groupby_agg(data, 'region', {\n    'sales': 'sum',\n    'quantity': 'mean'\n})\n\nprint('\\nBy Region (sales=sum, quantity=mean):')\nprint(f'{\"Region\":>8} {\"Total Sales\":>12} {\"Avg Qty\":>10}')\nprint('-' * 35)\nfor region, stats in agg_result.items():\n    print(f'{region:>8} {stats[\"sales\"]:>12} {stats[\"quantity\"]:>10.1f}')\n\nprint('\\n💡 Pandas: df.groupby(\"region\").agg({\"sales\": \"sum\", \"quantity\": \"mean\"})')",
          description: "Apply multiple aggregations",
        },
        {
          id: "pivot-table",
          title: "Pivot Tables",
          code: "from collections import defaultdict\n\ndata = {\n    'region': ['East', 'East', 'West', 'West', 'East', 'West'],\n    'product': ['A', 'B', 'A', 'B', 'A', 'B'],\n    'quarter': ['Q1', 'Q1', 'Q1', 'Q1', 'Q2', 'Q2'],\n    'sales': [100, 150, 120, 180, 110, 200]\n}\n\ndef pivot_table(data, values, index, columns, aggfunc='sum'):\n    \"\"\"Create a pivot table\"\"\"\n    # Get unique values for rows and columns\n    row_vals = sorted(set(data[index]))\n    col_vals = sorted(set(data[columns]))\n    \n    # Aggregate\n    pivot = defaultdict(lambda: defaultdict(list))\n    for i in range(len(data[index])):\n        row = data[index][i]\n        col = data[columns][i]\n        pivot[row][col].append(data[values][i])\n    \n    # Apply aggregation\n    result = {}\n    for row in row_vals:\n        result[row] = {}\n        for col in col_vals:\n            vals = pivot[row][col]\n            if aggfunc == 'sum':\n                result[row][col] = sum(vals) if vals else 0\n            elif aggfunc == 'mean':\n                result[row][col] = sum(vals)/len(vals) if vals else 0\n    \n    return result, col_vals\n\nprint('PIVOT TABLE')\nprint('=' * 50)\nprint('Sales by Region and Product:\\n')\n\npivot, cols = pivot_table(data, 'sales', 'region', 'product')\n\n# Display\nprint(f'{\"\":>8}', end='')\nfor col in cols:\n    print(f'{col:>10}', end='')\nprint(f'{\"Total\":>10}')\nprint('-' * 38)\n\nfor region, sales in pivot.items():\n    print(f'{region:>8}', end='')\n    row_total = 0\n    for col in cols:\n        val = sales.get(col, 0)\n        print(f'{val:>10}', end='')\n        row_total += val\n    print(f'{row_total:>10}')\n\nprint('\\n💡 Pandas: pd.pivot_table(df, values=\"sales\", index=\"region\", columns=\"product\")')",
          description: "Create pivot tables",
        },
      ]),
      keyPoints: [
        "Split-Apply-Combine pattern",
        "groupby('col')['value'].agg()",
        "Multiple aggregations with agg({})",
        "Common: sum, mean, count, min, max",
        "Pivot tables: rows × columns summary",
        "Transform keeps original shape",
      ],
      hardwareDemo: "Watch data split into groups. See aggregation computed per group.",
      estimatedTime: 35,
      difficulty: "INTERMEDIATE",
      order: 4,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson24_2_4.number}: ${lesson24_2_4.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson24_2_4.id,
        number: 1,
        title: "Basic GroupBy",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Group data by a category and calculate basic statistics.",
        starterCode: "from collections import defaultdict\n\ndata = {\n    'store': ['A', 'B', 'A', 'C', 'B', 'A', 'C', 'B'],\n    'product': ['X', 'X', 'Y', 'X', 'Y', 'X', 'Y', 'X'],\n    'sales': [100, 150, 80, 200, 120, 90, 180, 140]\n}\n\ndef groupby_stats(data, group_col, value_col):\n    groups = defaultdict(list)\n    for i in range(len(data[group_col])):\n        groups[data[group_col][i]].append(data[value_col][i])\n    \n    stats = {}\n    for key, values in groups.items():\n        stats[key] = {\n            'sum': sum(values),\n            'mean': sum(values) / len(values),\n            'count': len(values),\n            'min': min(values),\n            'max': max(values)\n        }\n    return stats\n\nprint('GROUPBY STATISTICS')\nprint('=' * 55)\n\nstats = groupby_stats(data, 'store', 'sales')\nprint('\\nSales by Store:')\nprint(f'{\"Store\":>6} {\"Sum\":>8} {\"Mean\":>8} {\"Count\":>6} {\"Min\":>6} {\"Max\":>6}')\nprint('-' * 45)\nfor store in sorted(stats.keys()):\n    s = stats[store]\n    print(f'{store:>6} {s[\"sum\"]:>8} {s[\"mean\"]:>8.1f} {s[\"count\"]:>6} {s[\"min\"]:>6} {s[\"max\"]:>6}')",
        solution: "# GroupBy statistics",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Stats by group", description: "Basic groupby" }]),
        hints: ["Collect values per group", "Calculate stats for each", "Display as table"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson24_2_4.id,
        number: 2,
        title: "Group by Multiple Columns",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Group by multiple columns and aggregate.",
        starterCode: "from collections import defaultdict\n\ndata = {\n    'year': [2023, 2023, 2023, 2023, 2024, 2024, 2024, 2024],\n    'quarter': ['Q1', 'Q2', 'Q1', 'Q2', 'Q1', 'Q2', 'Q1', 'Q2'],\n    'region': ['East', 'East', 'West', 'West', 'East', 'East', 'West', 'West'],\n    'revenue': [100, 120, 90, 110, 130, 140, 100, 125]\n}\n\ndef groupby_multi(data, group_cols, value_col, aggfunc='sum'):\n    groups = defaultdict(list)\n    for i in range(len(data[value_col])):\n        key = tuple(data[col][i] for col in group_cols)\n        groups[key].append(data[value_col][i])\n    \n    result = {}\n    for key, values in groups.items():\n        if aggfunc == 'sum':\n            result[key] = sum(values)\n        elif aggfunc == 'mean':\n            result[key] = sum(values) / len(values)\n    return result\n\nprint('GROUP BY MULTIPLE COLUMNS')\nprint('=' * 50)\n\n# Group by year and quarter\nresult = groupby_multi(data, ['year', 'quarter'], 'revenue', 'sum')\nprint('\\nRevenue by Year and Quarter:')\nprint(f'{\"Year\":>6} {\"Quarter\":>8} {\"Revenue\":>10}')\nprint('-' * 28)\nfor (year, quarter), revenue in sorted(result.items()):\n    print(f'{year:>6} {quarter:>8} {revenue:>10}')\n\n# Group by year and region\nresult = groupby_multi(data, ['year', 'region'], 'revenue', 'sum')\nprint('\\nRevenue by Year and Region:')\nfor (year, region), revenue in sorted(result.items()):\n    print(f'  {year} {region}: ${revenue}')",
        solution: "# Multi-column groupby",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Multi-group results", description: "Multiple columns" }]),
        hints: ["Use tuple as key", "Combine column values", "Sort for display"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson24_2_4.id,
        number: 3,
        title: "Multiple Aggregations",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Apply different aggregation functions to different columns.",
        starterCode: "from collections import defaultdict\n\ndata = {\n    'category': ['Electronics', 'Clothing', 'Electronics', 'Clothing', 'Electronics'],\n    'product': ['Laptop', 'Shirt', 'Phone', 'Pants', 'Tablet'],\n    'price': [999, 29, 699, 49, 449],\n    'quantity': [50, 200, 150, 180, 80],\n    'rating': [4.5, 4.0, 4.8, 3.9, 4.2]\n}\n\ndef groupby_multi_agg(data, group_col, agg_specs):\n    # Collect data per group\n    groups = defaultdict(lambda: {col: [] for col in agg_specs})\n    for i in range(len(data[group_col])):\n        key = data[group_col][i]\n        for col in agg_specs:\n            groups[key][col].append(data[col][i])\n    \n    # Apply aggregations\n    result = {}\n    for key, cols in groups.items():\n        result[key] = {}\n        for col, func in agg_specs.items():\n            vals = cols[col]\n            if func == 'sum': result[key][col] = sum(vals)\n            elif func == 'mean': result[key][col] = sum(vals)/len(vals)\n            elif func == 'max': result[key][col] = max(vals)\n            elif func == 'min': result[key][col] = min(vals)\n            elif func == 'count': result[key][col] = len(vals)\n    return result\n\nprint('MULTIPLE AGGREGATIONS')\nprint('=' * 60)\n\nagg_specs = {\n    'price': 'mean',\n    'quantity': 'sum',\n    'rating': 'mean'\n}\n\nresult = groupby_multi_agg(data, 'category', agg_specs)\n\nprint('\\nBy Category (price=mean, quantity=sum, rating=mean):')\nprint(f'{\"Category\":>12} {\"Avg Price\":>12} {\"Total Qty\":>12} {\"Avg Rating\":>12}')\nprint('-' * 52)\nfor cat, stats in result.items():\n    print(f'{cat:>12} ${stats[\"price\"]:>11.0f} {stats[\"quantity\"]:>12} {stats[\"rating\"]:>12.2f}')",
        solution: "# Multiple aggregations",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Different aggs", description: "Multi aggregation" }]),
        hints: ["Specify agg per column", "Apply correct function", "Format output nicely"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson24_2_4.id,
        number: 4,
        title: "Create Pivot Table",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Create a pivot table showing values across two dimensions.",
        starterCode: "from collections import defaultdict\n\ndata = {\n    'month': ['Jan', 'Jan', 'Jan', 'Feb', 'Feb', 'Feb', 'Mar', 'Mar', 'Mar'],\n    'product': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'sales': [100, 150, 80, 120, 160, 90, 140, 180, 100]\n}\n\ndef create_pivot(data, values, index, columns):\n    # Get unique values\n    rows = sorted(set(data[index]))\n    cols = sorted(set(data[columns]))\n    \n    # Aggregate into pivot structure\n    pivot = defaultdict(lambda: defaultdict(int))\n    for i in range(len(data[values])):\n        r = data[index][i]\n        c = data[columns][i]\n        pivot[r][c] += data[values][i]\n    \n    return pivot, rows, cols\n\npivot, rows, cols = create_pivot(data, 'sales', 'month', 'product')\n\nprint('PIVOT TABLE: Sales by Month and Product')\nprint('=' * 50)\n\n# Header\nprint(f'{\"\":>6}', end='')\nfor col in cols:\n    print(f'{col:>8}', end='')\nprint(f'{\"Total\":>10}')\nprint('-' * 40)\n\n# Rows\ngrand_total = 0\nfor row in rows:\n    print(f'{row:>6}', end='')\n    row_total = 0\n    for col in cols:\n        val = pivot[row][col]\n        print(f'{val:>8}', end='')\n        row_total += val\n    print(f'{row_total:>10}')\n    grand_total += row_total\n\n# Column totals\nprint('-' * 40)\nprint(f'{\"Total\":>6}', end='')\nfor col in cols:\n    col_total = sum(pivot[row][col] for row in rows)\n    print(f'{col_total:>8}', end='')\nprint(f'{grand_total:>10}')",
        solution: "# Pivot table created",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Pivot table", description: "Create pivot" }]),
        hints: ["Two dimensions: rows and columns", "Aggregate at intersection", "Add row/column totals"],
        xpReward: 25,
        order: 4,
      },
      {
        lessonId: lesson24_2_4.id,
        number: 5,
        title: "GroupBy with Transform",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Use transform to add group statistics back to original data.",
        starterCode: "from collections import defaultdict\n\ndata = {\n    'dept': ['Sales', 'IT', 'Sales', 'IT', 'Sales', 'IT'],\n    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'],\n    'salary': [55000, 65000, 52000, 70000, 58000, 62000]\n}\n\ndef transform_mean(data, group_col, value_col):\n    \"\"\"Add group mean as new column\"\"\"\n    # Calculate group means\n    groups = defaultdict(list)\n    for i in range(len(data[group_col])):\n        groups[data[group_col][i]].append(data[value_col][i])\n    means = {k: sum(v)/len(v) for k, v in groups.items()}\n    \n    # Map back to original rows\n    return [means[data[group_col][i]] for i in range(len(data[group_col]))]\n\n# Add department mean salary\ndata['dept_mean_salary'] = transform_mean(data, 'dept', 'salary')\n\n# Calculate difference from mean\ndata['diff_from_mean'] = [data['salary'][i] - data['dept_mean_salary'][i] \n                          for i in range(len(data['salary']))]\n\nprint('TRANSFORM: Group Stats Back to Rows')\nprint('=' * 65)\n\nprint(f'{\"Name\":>10} {\"Dept\":>8} {\"Salary\":>10} {\"Dept Mean\":>12} {\"Diff\":>10}')\nprint('-' * 55)\nfor i in range(len(data['name'])):\n    print(f'{data[\"name\"][i]:>10} {data[\"dept\"][i]:>8} '\n          f'${data[\"salary\"][i]:>9,} ${data[\"dept_mean_salary\"][i]:>11,.0f} '\n          f'{data[\"diff_from_mean\"][i]:>+10,.0f}')\n\nprint('\\n💡 Pandas: df[\"dept_mean\"] = df.groupby(\"dept\")[\"salary\"].transform(\"mean\")')",
        solution: "# Transform applied",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Stats added", description: "GroupBy transform" }]),
        hints: ["Calculate group statistic", "Map back to each row", "Same length as original"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 24.2.4`);

  // Lesson 24.2.5
  const lesson24_2_5 = await prisma.lesson.upsert({
    where: { slug: "data-joining-merging" },
    update: {},
    create: {
      sectionId: section24_2.id,
      number: 24.25,
      title: "Data Joining and Merging",
      slug: "data-joining-merging",
      objectives: [
        "Understand different join types",
        "Merge DataFrames on keys",
        "Handle missing matches",
        "Concatenate DataFrames",
      ],
      content: `# Data Joining and Merging

## Why Join Data?

Real data often comes from multiple sources that need to be combined.

## Join Types

### Inner Join
Keep only rows that match in BOTH tables.

### Left Join
Keep ALL rows from left table, matched or not.

### Right Join
Keep ALL rows from right table.

### Outer Join
Keep ALL rows from both tables.

## Merge Syntax

\`\`\`python
# Basic merge
pd.merge(df1, df2, on='key')

# Different column names
pd.merge(df1, df2, left_on='id', right_on='emp_id')

# Specify join type
pd.merge(df1, df2, on='key', how='left')
\`\`\`

## Concatenation

\`\`\`python
# Stack vertically
pd.concat([df1, df2])

# Stack horizontally
pd.concat([df1, df2], axis=1)
\`\`\`

## Common Issues

- Duplicate keys (one-to-many)
- Missing keys (nulls after join)
- Column name conflicts`,
      codeExamples: JSON.stringify([
        {
          id: "join-types",
          title: "Join Types Explained",
          code: "# Visualizing join types\n\nleft = {'id': [1, 2, 3], 'name': ['Alice', 'Bob', 'Charlie']}\nright = {'id': [2, 3, 4], 'dept': ['IT', 'Sales', 'HR']}\n\ndef inner_join(left, right, key):\n    result = {k: [] for k in list(left.keys()) + [k for k in right if k != key]}\n    for i, lk in enumerate(left[key]):\n        for j, rk in enumerate(right[key]):\n            if lk == rk:\n                for col in left:\n                    result[col].append(left[col][i])\n                for col in right:\n                    if col != key:\n                        result[col].append(right[col][j])\n    return result\n\ndef left_join(left, right, key):\n    result = {k: [] for k in list(left.keys()) + [k for k in right if k != key]}\n    right_keys = set(right[key])\n    for i, lk in enumerate(left[key]):\n        for col in left:\n            result[col].append(left[col][i])\n        if lk in right_keys:\n            j = right[key].index(lk)\n            for col in right:\n                if col != key:\n                    result[col].append(right[col][j])\n        else:\n            for col in right:\n                if col != key:\n                    result[col].append(None)\n    return result\n\nprint('JOIN TYPES')\nprint('=' * 55)\nprint(f'Left table:  id={left[\"id\"]}, name={left[\"name\"]}')\nprint(f'Right table: id={right[\"id\"]}, dept={right[\"dept\"]}')\n\nprint('\\nINNER JOIN (only matching):')\ninner = inner_join(left, right, 'id')\nprint(f'  id={inner[\"id\"]}, name={inner[\"name\"]}, dept={inner[\"dept\"]}')\n\nprint('\\nLEFT JOIN (all from left):')\nleft_j = left_join(left, right, 'id')\nprint(f'  id={left_j[\"id\"]}, name={left_j[\"name\"]}, dept={left_j[\"dept\"]}')",
          description: "Understand different join types",
        },
        {
          id: "merge-example",
          title: "Merging DataFrames",
          code: "# Merging employee and department data\n\nemployees = {\n    'emp_id': [1, 2, 3, 4, 5],\n    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],\n    'dept_id': [101, 102, 101, 103, 102]\n}\n\ndepartments = {\n    'dept_id': [101, 102, 103],\n    'dept_name': ['Engineering', 'Sales', 'HR'],\n    'budget': [500000, 300000, 150000]\n}\n\ndef merge(left, right, on):\n    \"\"\"Inner join on specified key\"\"\"\n    result = {col: [] for col in left}\n    for col in right:\n        if col != on:\n            result[col] = []\n    \n    right_lookup = {right[on][i]: i for i in range(len(right[on]))}\n    \n    for i in range(len(left[on])):\n        key = left[on][i]\n        if key in right_lookup:\n            j = right_lookup[key]\n            for col in left:\n                result[col].append(left[col][i])\n            for col in right:\n                if col != on:\n                    result[col].append(right[col][j])\n    \n    return result\n\nmerged = merge(employees, departments, 'dept_id')\n\nprint('MERGING DATAFRAMES')\nprint('=' * 65)\n\nprint('\\nEmployees with Department Info:')\nprint(f'{\"ID\":>4} {\"Name\":>10} {\"Dept\":>15} {\"Budget\":>12}')\nprint('-' * 45)\nfor i in range(len(merged['emp_id'])):\n    print(f'{merged[\"emp_id\"][i]:>4} {merged[\"name\"][i]:>10} '\n          f'{merged[\"dept_name\"][i]:>15} ${merged[\"budget\"][i]:>11,}')\n\nprint('\\n💡 Pandas: pd.merge(employees, departments, on=\"dept_id\")')",
          description: "Merge two DataFrames",
        },
        {
          id: "concatenation",
          title: "Concatenating DataFrames",
          code: "# Concatenating data\n\nq1_sales = {\n    'product': ['A', 'B', 'C'],\n    'revenue': [100, 150, 80],\n    'quarter': ['Q1', 'Q1', 'Q1']\n}\n\nq2_sales = {\n    'product': ['A', 'B', 'C'],\n    'revenue': [120, 160, 90],\n    'quarter': ['Q2', 'Q2', 'Q2']\n}\n\ndef concat_vertical(dfs):\n    \"\"\"Stack DataFrames vertically\"\"\"\n    result = {col: [] for col in dfs[0]}\n    for df in dfs:\n        for col in df:\n            result[col].extend(df[col])\n    return result\n\ndef concat_horizontal(dfs):\n    \"\"\"Stack DataFrames side by side\"\"\"\n    result = {}\n    for i, df in enumerate(dfs):\n        for col in df:\n            new_col = f'{col}_{i}' if col in result else col\n            result[new_col] = df[col]\n    return result\n\nprint('CONCATENATION')\nprint('=' * 50)\n\nprint('\\nVertical concatenation (stacking):')\ncombined = concat_vertical([q1_sales, q2_sales])\nprint(f'  product: {combined[\"product\"]}')\nprint(f'  revenue: {combined[\"revenue\"]}')\nprint(f'  quarter: {combined[\"quarter\"]}')\n\nprint('\\n💡 Pandas: pd.concat([q1_sales, q2_sales])')",
          description: "Concatenate DataFrames",
        },
      ]),
      keyPoints: [
        "Inner join: only matching rows",
        "Left join: all from left table",
        "Right join: all from right table",
        "Outer join: all from both tables",
        "merge(): combine on key columns",
        "concat(): stack DataFrames",
      ],
      hardwareDemo: "Watch rows match between tables. See join result build up.",
      estimatedTime: 30,
      difficulty: "INTERMEDIATE",
      order: 5,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson24_2_5.number}: ${lesson24_2_5.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson24_2_5.id,
        number: 1,
        title: "Inner Join",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement an inner join that keeps only matching rows.",
        starterCode: "def inner_join(left, right, key):\n    \"\"\"Keep only rows that match in both tables\"\"\"\n    result = {col: [] for col in left}\n    for col in right:\n        if col != key:\n            result[col] = []\n    \n    # Create lookup for right table\n    right_lookup = {}\n    for i, k in enumerate(right[key]):\n        right_lookup[k] = i\n    \n    # Find matches\n    for i, k in enumerate(left[key]):\n        if k in right_lookup:\n            j = right_lookup[k]\n            for col in left:\n                result[col].append(left[col][i])\n            for col in right:\n                if col != key:\n                    result[col].append(right[col][j])\n    \n    return result\n\n# Test data\norders = {'order_id': [1, 2, 3, 4], 'customer_id': [101, 102, 103, 101], 'amount': [50, 75, 100, 60]}\ncustomers = {'customer_id': [101, 102, 104], 'name': ['Alice', 'Bob', 'Diana']}\n\nprint('INNER JOIN')\nprint('=' * 50)\nprint(f'Orders: {orders}')\nprint(f'Customers: {customers}')\n\nresult = inner_join(orders, customers, 'customer_id')\nprint('\\nInner Join Result:')\nfor col, vals in result.items():\n    print(f'  {col}: {vals}')\nprint('\\n(Customer 103 and 104 not in result - no match)')",
        solution: "# Inner join implemented",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Only matches", description: "Inner join" }]),
        hints: ["Build lookup from right", "Check if key exists", "Only add if match found"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson24_2_5.id,
        number: 2,
        title: "Left Join",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Implement a left join that keeps all rows from the left table.",
        starterCode: "def left_join(left, right, key):\n    \"\"\"Keep all rows from left, match from right where possible\"\"\"\n    result = {col: [] for col in left}\n    for col in right:\n        if col != key:\n            result[col] = []\n    \n    # Create lookup for right table\n    right_lookup = {right[key][i]: i for i in range(len(right[key]))}\n    \n    # Process all left rows\n    for i in range(len(left[key])):\n        k = left[key][i]\n        for col in left:\n            result[col].append(left[col][i])\n        \n        if k in right_lookup:\n            j = right_lookup[k]\n            for col in right:\n                if col != key:\n                    result[col].append(right[col][j])\n        else:\n            # No match - add None\n            for col in right:\n                if col != key:\n                    result[col].append(None)\n    \n    return result\n\n# Test\nemployees = {'emp_id': [1, 2, 3], 'name': ['Alice', 'Bob', 'Charlie']}\nsalaries = {'emp_id': [1, 3], 'salary': [50000, 60000]}\n\nprint('LEFT JOIN')\nprint('=' * 50)\n\nresult = left_join(employees, salaries, 'emp_id')\nprint('\\nAll employees with salary (if available):')\nfor i in range(len(result['emp_id'])):\n    sal = result['salary'][i]\n    sal_str = f'${sal:,}' if sal else 'N/A'\n    print(f'  {result[\"name\"][i]}: {sal_str}')",
        solution: "# Left join implemented",
        testCases: JSON.stringify([{ input: "", expectedOutput: "All left rows", description: "Left join" }]),
        hints: ["Always add left row", "Check for match", "Use None if no match"],
        xpReward: 15,
        order: 2,
      },
      {
        lessonId: lesson24_2_5.id,
        number: 3,
        title: "Join with Different Key Names",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Join tables where the key columns have different names.",
        starterCode: "def merge_on_diff_keys(left, right, left_key, right_key):\n    \"\"\"Join when key columns have different names\"\"\"\n    result = {col: [] for col in left}\n    for col in right:\n        if col != right_key:\n            result[col] = []\n    \n    right_lookup = {right[right_key][i]: i for i in range(len(right[right_key]))}\n    \n    for i in range(len(left[left_key])):\n        k = left[left_key][i]\n        if k in right_lookup:\n            j = right_lookup[k]\n            for col in left:\n                result[col].append(left[col][i])\n            for col in right:\n                if col != right_key:\n                    result[col].append(right[col][j])\n    \n    return result\n\n# Test - different key names\norders = {'order_id': [1, 2, 3], 'cust_id': [101, 102, 101], 'total': [150, 200, 75]}\ncustomers = {'customer_id': [101, 102, 103], 'name': ['Alice', 'Bob', 'Charlie']}\n\nprint('JOIN WITH DIFFERENT KEY NAMES')\nprint('=' * 55)\nprint(f'Orders key: \"cust_id\"')\nprint(f'Customers key: \"customer_id\"')\n\nresult = merge_on_diff_keys(orders, customers, 'cust_id', 'customer_id')\n\nprint('\\nJoined Result:')\nfor i in range(len(result['order_id'])):\n    print(f'  Order {result[\"order_id\"][i]}: {result[\"name\"][i]} - ${result[\"total\"][i]}')\n\nprint('\\n💡 Pandas: pd.merge(orders, customers, left_on=\"cust_id\", right_on=\"customer_id\")')",
        solution: "# Different key names handled",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Joined correctly", description: "Different keys" }]),
        hints: ["Use separate key parameters", "Lookup uses right key", "Match uses left key value"],
        xpReward: 15,
        order: 3,
      },
      {
        lessonId: lesson24_2_5.id,
        number: 4,
        title: "Concatenate DataFrames",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Concatenate multiple DataFrames vertically.",
        starterCode: "def concat(dfs, ignore_index=True):\n    \"\"\"Concatenate DataFrames vertically\"\"\"\n    if not dfs:\n        return {}\n    \n    # Get all columns\n    all_cols = set()\n    for df in dfs:\n        all_cols.update(df.keys())\n    \n    result = {col: [] for col in all_cols}\n    \n    for df in dfs:\n        n_rows = len(list(df.values())[0]) if df else 0\n        for col in all_cols:\n            if col in df:\n                result[col].extend(df[col])\n            else:\n                result[col].extend([None] * n_rows)\n    \n    return result\n\n# Test - quarterly reports\nq1 = {'month': ['Jan', 'Feb', 'Mar'], 'sales': [100, 110, 120]}\nq2 = {'month': ['Apr', 'May', 'Jun'], 'sales': [130, 125, 140]}\nq3 = {'month': ['Jul', 'Aug', 'Sep'], 'sales': [135, 145, 150]}\n\nprint('CONCATENATE DATAFRAMES')\nprint('=' * 45)\n\ncombined = concat([q1, q2, q3])\n\nprint('\\nCombined quarterly data:')\nprint(f'{\"Month\":>6} {\"Sales\":>8}')\nprint('-' * 16)\nfor month, sales in zip(combined['month'], combined['sales']):\n    print(f'{month:>6} {sales:>8}')\n\nprint(f'\\nTotal rows: {len(combined[\"month\"])}')",
        solution: "# DataFrames concatenated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Stacked data", description: "Concatenate" }]),
        hints: ["Collect all columns", "Extend each column", "Handle missing columns"],
        xpReward: 15,
        order: 4,
      },
      {
        lessonId: lesson24_2_5.id,
        number: 5,
        title: "Multi-Table Join",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Join three tables together to create a comprehensive view.",
        starterCode: "def merge(left, right, on):\n    \"\"\"Simple inner join\"\"\"\n    result = {col: [] for col in left}\n    for col in right:\n        if col != on:\n            result[col] = []\n    \n    right_lookup = {right[on][i]: i for i in range(len(right[on]))}\n    \n    for i in range(len(left[on])):\n        k = left[on][i]\n        if k in right_lookup:\n            j = right_lookup[k]\n            for col in left:\n                result[col].append(left[col][i])\n            for col in right:\n                if col != on:\n                    result[col].append(right[col][j])\n    return result\n\n# Three tables\norders = {\n    'order_id': [1, 2, 3, 4],\n    'customer_id': [101, 102, 101, 103],\n    'product_id': ['P1', 'P2', 'P1', 'P3'],\n    'quantity': [2, 1, 3, 2]\n}\n\ncustomers = {\n    'customer_id': [101, 102, 103],\n    'name': ['Alice', 'Bob', 'Charlie']\n}\n\nproducts = {\n    'product_id': ['P1', 'P2', 'P3'],\n    'product_name': ['Laptop', 'Phone', 'Tablet'],\n    'price': [999, 699, 449]\n}\n\nprint('MULTI-TABLE JOIN')\nprint('=' * 65)\n\n# First join: orders + customers\nstep1 = merge(orders, customers, 'customer_id')\n\n# Second join: result + products\nfinal = merge(step1, products, 'product_id')\n\nprint('\\nComplete Order Details:')\nprint(f'{\"Order\":>6} {\"Customer\":>10} {\"Product\":>10} {\"Qty\":>5} {\"Price\":>8} {\"Total\":>10}')\nprint('-' * 55)\nfor i in range(len(final['order_id'])):\n    total = final['quantity'][i] * final['price'][i]\n    print(f'{final[\"order_id\"][i]:>6} {final[\"name\"][i]:>10} '\n          f'{final[\"product_name\"][i]:>10} {final[\"quantity\"][i]:>5} '\n          f'${final[\"price\"][i]:>7} ${total:>9}')",
        solution: "# Three tables joined",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Complete view", description: "Multi-table join" }]),
        hints: ["Join two tables first", "Then join result with third", "Chain the joins"],
        xpReward: 25,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 24.2.5`);

  console.log("\n✅ Part 3 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
