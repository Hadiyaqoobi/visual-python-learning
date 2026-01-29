import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Part 4: Lesson 24.3.1 (Real Data Pipeline) - FINAL LESSON!\n");
  console.log("🎉 THIS COMPLETES THE ENTIRE 24-CHAPTER CURRICULUM! 🎉\n");

  const section24_3 = await prisma.section.findFirst({ where: { number: 24.3 } });
  if (!section24_3) throw new Error("Section 24.3 not found.");

  const lesson24_3_1 = await prisma.lesson.upsert({
    where: { slug: "real-data-pipeline" },
    update: {},
    create: {
      sectionId: section24_3.id,
      number: 24.31,
      title: "Real Data Pipeline Example",
      slug: "real-data-pipeline",
      objectives: [
        "Build a complete data analysis pipeline",
        "Combine all learned techniques",
        "Handle real-world data challenges",
        "Create actionable insights from data",
      ],
      content: `# Real Data Pipeline

## The Complete Workflow

A real data analysis project follows these steps:

### 1. Data Loading
\`\`\`python
# Load from various sources
df = pd.read_csv('sales.csv')
df2 = pd.read_excel('inventory.xlsx')
\`\`\`

### 2. Data Exploration
\`\`\`python
df.head()
df.info()
df.describe()
df.isnull().sum()
\`\`\`

### 3. Data Cleaning
- Handle missing values
- Fix data types
- Remove duplicates
- Handle outliers

### 4. Data Transformation
- Create derived columns
- Normalize/scale data
- Encode categories

### 5. Analysis & Aggregation
- GroupBy operations
- Statistical analysis
- Pivot tables

### 6. Joining Data
- Merge related tables
- Combine data sources

### 7. Results & Insights
- Summary statistics
- Key findings
- Recommendations

## Best Practices

✅ Always explore data first
✅ Document your transformations
✅ Validate results at each step
✅ Keep raw data unchanged
✅ Make analysis reproducible`,
      codeExamples: JSON.stringify([
        {
          id: "complete-pipeline",
          title: "Complete Data Pipeline",
          code: "from collections import defaultdict\nimport math\n\n# ============================================\n# STEP 1: LOAD DATA\n# ============================================\nprint('🔄 STEP 1: LOAD DATA')\nprint('=' * 60)\n\n# Simulated sales data\nsales_data = {\n    'order_id': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],\n    'date': ['2024-01-15', '2024-01-16', '2024-01-16', '2024-01-17', '2024-01-17',\n             '2024-01-18', '2024-01-18', '2024-01-19', '2024-01-19', '2024-01-20'],\n    'product_id': ['P001', 'P002', 'P001', 'P003', 'P002', 'P001', 'P003', 'P002', 'P001', 'P003'],\n    'quantity': [2, 1, 3, 2, None, 1, 4, 2, 1, 3],\n    'customer_id': [101, 102, 101, 103, 102, 104, 103, 101, 105, 104]\n}\n\nproducts = {\n    'product_id': ['P001', 'P002', 'P003'],\n    'name': ['Laptop', 'Phone', 'Tablet'],\n    'price': [999, 699, 449],\n    'category': ['Electronics', 'Electronics', 'Electronics']\n}\n\ncustomers = {\n    'customer_id': [101, 102, 103, 104, 105],\n    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],\n    'region': ['East', 'West', 'East', 'West', 'East']\n}\n\nprint(f'Loaded {len(sales_data[\"order_id\"])} sales records')\nprint(f'Loaded {len(products[\"product_id\"])} products')\nprint(f'Loaded {len(customers[\"customer_id\"])} customers')",
          description: "Step 1: Load data from sources",
        },
        {
          id: "explore-clean",
          title: "Explore and Clean Data",
          code: "# Continuing from Step 1...\nsales_data = {\n    'order_id': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],\n    'date': ['2024-01-15', '2024-01-16', '2024-01-16', '2024-01-17', '2024-01-17',\n             '2024-01-18', '2024-01-18', '2024-01-19', '2024-01-19', '2024-01-20'],\n    'product_id': ['P001', 'P002', 'P001', 'P003', 'P002', 'P001', 'P003', 'P002', 'P001', 'P003'],\n    'quantity': [2, 1, 3, 2, None, 1, 4, 2, 1, 3],\n    'customer_id': [101, 102, 101, 103, 102, 104, 103, 101, 105, 104]\n}\n\n# ============================================\n# STEP 2: EXPLORE DATA\n# ============================================\nprint('\\n🔍 STEP 2: EXPLORE DATA')\nprint('=' * 60)\n\nn_records = len(sales_data['order_id'])\nprint(f'Total records: {n_records}')\nprint(f'Columns: {list(sales_data.keys())}')\nprint(f'Date range: {min(sales_data[\"date\"])} to {max(sales_data[\"date\"])}')\n\n# Check for missing values\nfor col, values in sales_data.items():\n    null_count = sum(1 for v in values if v is None)\n    if null_count > 0:\n        print(f'⚠️  {col}: {null_count} missing values')\n\n# ============================================\n# STEP 3: CLEAN DATA\n# ============================================\nprint('\\n🧹 STEP 3: CLEAN DATA')\nprint('=' * 60)\n\n# Fill missing quantity with median\nvalid_qty = [q for q in sales_data['quantity'] if q is not None]\nmedian_qty = sorted(valid_qty)[len(valid_qty)//2]\nprint(f'Filling missing quantity with median: {median_qty}')\n\nsales_data['quantity'] = [q if q is not None else median_qty for q in sales_data['quantity']]\nprint(f'✓ Missing values handled')\nprint(f'  Quantities now: {sales_data[\"quantity\"]}')",
          description: "Steps 2-3: Explore and clean",
        },
        {
          id: "transform-analyze",
          title: "Transform and Analyze",
          code: "from collections import defaultdict\n\n# Simulated cleaned data\nsales_data = {\n    'order_id': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],\n    'product_id': ['P001', 'P002', 'P001', 'P003', 'P002', 'P001', 'P003', 'P002', 'P001', 'P003'],\n    'quantity': [2, 1, 3, 2, 2, 1, 4, 2, 1, 3],\n    'customer_id': [101, 102, 101, 103, 102, 104, 103, 101, 105, 104]\n}\n\nproducts = {'product_id': ['P001', 'P002', 'P003'], 'name': ['Laptop', 'Phone', 'Tablet'], 'price': [999, 699, 449]}\ncustomers = {'customer_id': [101, 102, 103, 104, 105], 'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'], 'region': ['East', 'West', 'East', 'West', 'East']}\n\n# ============================================\n# STEP 4: JOIN DATA\n# ============================================\nprint('🔗 STEP 4: JOIN DATA')\nprint('=' * 60)\n\n# Create lookups\nprod_lookup = {products['product_id'][i]: i for i in range(len(products['product_id']))}\ncust_lookup = {customers['customer_id'][i]: i for i in range(len(customers['customer_id']))}\n\n# Enrich sales data\nsales_data['product_name'] = [products['name'][prod_lookup[pid]] for pid in sales_data['product_id']]\nsales_data['price'] = [products['price'][prod_lookup[pid]] for pid in sales_data['product_id']]\nsales_data['customer_name'] = [customers['name'][cust_lookup[cid]] for cid in sales_data['customer_id']]\nsales_data['region'] = [customers['region'][cust_lookup[cid]] for cid in sales_data['customer_id']]\n\n# Calculate revenue\nsales_data['revenue'] = [q * p for q, p in zip(sales_data['quantity'], sales_data['price'])]\n\nprint(f'✓ Joined product info')\nprint(f'✓ Joined customer info')\nprint(f'✓ Calculated revenue')\nprint(f'\\nSample enriched record:')\nfor col in ['order_id', 'product_name', 'customer_name', 'region', 'quantity', 'revenue']:\n    print(f'  {col}: {sales_data[col][0]}')\n\n# ============================================\n# STEP 5: ANALYZE\n# ============================================\nprint('\\n📊 STEP 5: ANALYZE')\nprint('=' * 60)\n\n# Revenue by product\nby_product = defaultdict(int)\nfor i in range(len(sales_data['order_id'])):\n    by_product[sales_data['product_name'][i]] += sales_data['revenue'][i]\n\nprint('\\nRevenue by Product:')\nfor prod, rev in sorted(by_product.items(), key=lambda x: -x[1]):\n    print(f'  {prod}: ${rev:,}')\n\n# Revenue by region\nby_region = defaultdict(int)\nfor i in range(len(sales_data['order_id'])):\n    by_region[sales_data['region'][i]] += sales_data['revenue'][i]\n\nprint('\\nRevenue by Region:')\nfor reg, rev in sorted(by_region.items(), key=lambda x: -x[1]):\n    print(f'  {reg}: ${rev:,}')\n\nprint(f'\\nTotal Revenue: ${sum(sales_data[\"revenue\"]):,}')",
          description: "Steps 4-5: Join and analyze",
        },
      ]),
      keyPoints: [
        "Load → Explore → Clean → Transform → Analyze",
        "Always explore before transforming",
        "Handle missing values appropriately",
        "Join tables to enrich data",
        "GroupBy for aggregations",
        "Document and validate each step",
      ],
      hardwareDemo: "Watch complete pipeline execute. See data transform through each stage.",
      estimatedTime: 45,
      difficulty: "ADVANCED",
      order: 1,
      isPublished: true,
    },
  });
  console.log(`    📝 Lesson ${lesson24_3_1.number}: ${lesson24_3_1.title}`);

  await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson24_3_1.id,
        number: 1,
        title: "Load and Explore Data",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Load a dataset and perform initial exploration.",
        starterCode: "# E-commerce dataset\norders = {\n    'order_id': list(range(1, 16)),\n    'customer_id': [101, 102, 103, 101, 104, 102, 105, 103, 101, 104, 105, 102, 103, 104, 101],\n    'product': ['Laptop', 'Phone', 'Tablet', 'Phone', 'Laptop', 'Tablet', 'Phone', 'Laptop', 'Tablet', 'Phone', 'Laptop', 'Phone', 'Tablet', 'Laptop', 'Phone'],\n    'amount': [999, 699, 449, 699, 999, 449, 699, 999, 449, 699, 999, 699, 449, 999, 699],\n    'date': ['2024-01-01', '2024-01-02', '2024-01-02', '2024-01-03', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-05', '2024-01-06', '2024-01-07', '2024-01-08', '2024-01-09', '2024-01-10', '2024-01-10', '2024-01-11']\n}\n\nprint('📊 DATA EXPLORATION')\nprint('=' * 55)\n\n# Basic info\nprint(f'\\nDataset Overview:')\nprint(f'  Records: {len(orders[\"order_id\"])}')\nprint(f'  Columns: {list(orders.keys())}')\n\n# Unique values\nprint(f'\\nUnique Values:')\nprint(f'  Customers: {len(set(orders[\"customer_id\"]))}')\nprint(f'  Products: {set(orders[\"product\"])}')\nprint(f'  Date range: {min(orders[\"date\"])} to {max(orders[\"date\"])}')\n\n# Numeric summary\namounts = orders['amount']\nprint(f'\\nAmount Statistics:')\nprint(f'  Total: ${sum(amounts):,}')\nprint(f'  Mean: ${sum(amounts)/len(amounts):,.0f}')\nprint(f'  Min: ${min(amounts):,}')\nprint(f'  Max: ${max(amounts):,}')",
        solution: "# Data explored",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Exploration complete", description: "Explore data" }]),
        hints: ["Check dimensions", "Find unique values", "Calculate basic stats"],
        xpReward: 15,
        order: 1,
      },
      {
        lessonId: lesson24_3_1.id,
        number: 2,
        title: "Clean and Validate Data",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Handle missing values, duplicates, and validate data quality.",
        starterCode: "# Dataset with issues\ndata = {\n    'id': [1, 2, 3, 4, 5, 6, 7, 8, 2, 9],  # Note: duplicate id=2\n    'name': ['Alice', 'Bob', None, 'Diana', 'Eve', 'Frank', 'Grace', None, 'Bob', 'Henry'],\n    'score': [85, 92, 78, None, 88, 95, 72, 80, 92, None],\n    'grade': ['B', 'A', 'C', 'B', 'B', 'A', 'C', 'B', 'A', 'B']\n}\n\nprint('🧹 DATA CLEANING')\nprint('=' * 55)\n\n# Step 1: Check for issues\nprint('\\n1. Identify Issues:')\nfor col, values in data.items():\n    null_count = sum(1 for v in values if v is None)\n    if null_count > 0:\n        print(f'   {col}: {null_count} missing')\n\n# Check duplicates\nid_counts = {}\nfor i in data['id']:\n    id_counts[i] = id_counts.get(i, 0) + 1\nduplicates = [k for k, v in id_counts.items() if v > 1]\nif duplicates:\n    print(f'   Duplicate IDs: {duplicates}')\n\n# Step 2: Fix issues\nprint('\\n2. Apply Fixes:')\n\n# Fill missing names\ndata['name'] = [n if n else 'Unknown' for n in data['name']]\nprint('   ✓ Filled missing names with \"Unknown\"')\n\n# Fill missing scores with mean\nvalid_scores = [s for s in data['score'] if s is not None]\nmean_score = sum(valid_scores) / len(valid_scores)\ndata['score'] = [s if s is not None else round(mean_score) for s in data['score']]\nprint(f'   ✓ Filled missing scores with mean ({mean_score:.0f})')\n\n# Remove duplicates (keep first)\nseen = set()\nkeep = []\nfor i, id_val in enumerate(data['id']):\n    if id_val not in seen:\n        seen.add(id_val)\n        keep.append(i)\ndata = {col: [values[i] for i in keep] for col, values in data.items()}\nprint(f'   ✓ Removed duplicates (kept {len(keep)} records)')\n\n# Step 3: Validate\nprint('\\n3. Validation:')\nprint(f'   Records: {len(data[\"id\"])}')\nprint(f'   No missing values: {all(v is not None for col in data.values() for v in col)}')",
        solution: "# Data cleaned",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Clean data", description: "Clean data" }]),
        hints: ["Check nulls per column", "Fill or drop as appropriate", "Remove duplicates"],
        xpReward: 20,
        order: 2,
      },
      {
        lessonId: lesson24_3_1.id,
        number: 3,
        title: "Transform and Enrich Data",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Add derived columns and enrich data through joins.",
        starterCode: "# Sales data\nsales = {\n    'sale_id': [1, 2, 3, 4, 5],\n    'product_id': ['A', 'B', 'A', 'C', 'B'],\n    'units': [10, 5, 8, 12, 6],\n    'date': ['2024-01-15', '2024-01-15', '2024-01-16', '2024-01-17', '2024-01-17']\n}\n\nproducts = {\n    'product_id': ['A', 'B', 'C'],\n    'name': ['Widget', 'Gadget', 'Gizmo'],\n    'unit_price': [25, 50, 35],\n    'category': ['Basic', 'Premium', 'Basic']\n}\n\nprint('🔄 DATA TRANSFORMATION')\nprint('=' * 55)\n\n# Step 1: Join with products\nprint('\\n1. Enrich with product info:')\nprod_lookup = {products['product_id'][i]: i for i in range(len(products['product_id']))}\n\nsales['product_name'] = [products['name'][prod_lookup[pid]] for pid in sales['product_id']]\nsales['unit_price'] = [products['unit_price'][prod_lookup[pid]] for pid in sales['product_id']]\nsales['category'] = [products['category'][prod_lookup[pid]] for pid in sales['product_id']]\nprint('   ✓ Added product name, price, category')\n\n# Step 2: Calculate derived columns\nprint('\\n2. Create derived columns:')\nsales['revenue'] = [u * p for u, p in zip(sales['units'], sales['unit_price'])]\nprint('   ✓ Added revenue (units × price)')\n\n# Extract date parts\nsales['month'] = [d.split('-')[1] for d in sales['date']]\nsales['day'] = [d.split('-')[2] for d in sales['date']]\nprint('   ✓ Extracted month and day')\n\n# Step 3: Show result\nprint('\\n3. Enriched Data Sample:')\nprint(f'{\"ID\":>4} {\"Product\":>10} {\"Units\":>6} {\"Price\":>8} {\"Revenue\":>10}')\nprint('-' * 45)\nfor i in range(len(sales['sale_id'])):\n    print(f'{sales[\"sale_id\"][i]:>4} {sales[\"product_name\"][i]:>10} '\n          f'{sales[\"units\"][i]:>6} ${sales[\"unit_price\"][i]:>7} ${sales[\"revenue\"][i]:>9}')",
        solution: "# Data transformed",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Enriched data", description: "Transform data" }]),
        hints: ["Join using lookup", "Calculate derived values", "Parse dates"],
        xpReward: 20,
        order: 3,
      },
      {
        lessonId: lesson24_3_1.id,
        number: 4,
        title: "Aggregate and Analyze",
        type: "CODE",
        difficulty: "INTERMEDIATE",
        prompt: "Perform groupby aggregations to extract insights.",
        starterCode: "from collections import defaultdict\n\n# Enriched sales data\nsales = {\n    'sale_id': [1, 2, 3, 4, 5, 6, 7, 8],\n    'product': ['Laptop', 'Phone', 'Laptop', 'Tablet', 'Phone', 'Laptop', 'Tablet', 'Phone'],\n    'category': ['Electronics', 'Electronics', 'Electronics', 'Electronics', 'Electronics', 'Electronics', 'Electronics', 'Electronics'],\n    'region': ['East', 'West', 'East', 'West', 'East', 'West', 'East', 'West'],\n    'units': [5, 10, 3, 8, 12, 4, 6, 15],\n    'revenue': [4995, 6990, 2997, 3592, 8388, 3996, 2694, 10485]\n}\n\nprint('📊 DATA AGGREGATION')\nprint('=' * 60)\n\n# Aggregation 1: By Product\nprint('\\n1. Revenue by Product:')\nby_product = defaultdict(lambda: {'units': 0, 'revenue': 0, 'orders': 0})\nfor i in range(len(sales['sale_id'])):\n    prod = sales['product'][i]\n    by_product[prod]['units'] += sales['units'][i]\n    by_product[prod]['revenue'] += sales['revenue'][i]\n    by_product[prod]['orders'] += 1\n\nprint(f'{\"Product\":>10} {\"Orders\":>8} {\"Units\":>8} {\"Revenue\":>12}')\nprint('-' * 42)\nfor prod in sorted(by_product.keys(), key=lambda x: -by_product[x]['revenue']):\n    stats = by_product[prod]\n    print(f'{prod:>10} {stats[\"orders\"]:>8} {stats[\"units\"]:>8} ${stats[\"revenue\"]:>11,}')\n\n# Aggregation 2: By Region\nprint('\\n2. Revenue by Region:')\nby_region = defaultdict(int)\nfor i in range(len(sales['sale_id'])):\n    by_region[sales['region'][i]] += sales['revenue'][i]\n\nfor region, revenue in sorted(by_region.items(), key=lambda x: -x[1]):\n    pct = revenue / sum(sales['revenue']) * 100\n    bar = '█' * int(pct / 5)\n    print(f'  {region}: ${revenue:>10,} ({pct:.0f}%) {bar}')\n\n# Summary\nprint('\\n3. Summary:')\nprint(f'  Total Orders: {len(sales[\"sale_id\"])}')\nprint(f'  Total Units: {sum(sales[\"units\"])}')\nprint(f'  Total Revenue: ${sum(sales[\"revenue\"]):,}')\nprint(f'  Avg Order Value: ${sum(sales[\"revenue\"])//len(sales[\"sale_id\"]):,}')",
        solution: "# Data aggregated",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Insights shown", description: "Aggregate data" }]),
        hints: ["Group by category", "Sum relevant columns", "Calculate percentages"],
        xpReward: 20,
        order: 4,
      },
      {
        lessonId: lesson24_3_1.id,
        number: 5,
        title: "Complete Analysis Pipeline",
        type: "CODE",
        difficulty: "ADVANCED",
        prompt: "Build a complete end-to-end data analysis pipeline.",
        starterCode: "from collections import defaultdict\n\nprint('🚀 COMPLETE DATA ANALYSIS PIPELINE')\nprint('=' * 65)\n\n# ====== STEP 1: LOAD ======\nprint('\\n📥 STEP 1: Load Data')\norders = {\n    'id': list(range(1, 21)),\n    'customer': ['Alice', 'Bob', 'Alice', 'Charlie', 'Bob', 'Diana', 'Alice', 'Charlie', 'Eve', 'Bob',\n                 'Diana', 'Eve', 'Alice', 'Charlie', 'Bob', 'Diana', 'Eve', 'Alice', 'Bob', 'Charlie'],\n    'product': ['A', 'B', 'A', 'C', 'A', 'B', 'C', 'A', 'B', 'C',\n                'A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'A', 'C'],\n    'amount': [100, 200, 100, 150, 100, 200, 150, 100, 200, 150,\n               100, 200, 150, 100, None, 150, 100, 100, 200, 150],\n    'region': ['East', 'West', 'East', 'East', 'West', 'West', 'East', 'East', 'West', 'West',\n               'West', 'West', 'East', 'East', 'West', 'West', 'East', 'East', 'West', 'East']\n}\nprint(f'  Loaded {len(orders[\"id\"])} orders')\n\n# ====== STEP 2: CLEAN ======\nprint('\\n🧹 STEP 2: Clean Data')\nnulls = sum(1 for a in orders['amount'] if a is None)\nprint(f'  Found {nulls} missing amounts')\nmean_amt = sum(a for a in orders['amount'] if a) / (len(orders['amount']) - nulls)\norders['amount'] = [a if a else round(mean_amt) for a in orders['amount']]\nprint(f'  Filled with mean: ${mean_amt:.0f}')\n\n# ====== STEP 3: ANALYZE ======\nprint('\\n📊 STEP 3: Analyze')\n\n# By customer\ncustomer_totals = defaultdict(lambda: {'orders': 0, 'revenue': 0})\nfor i in range(len(orders['id'])):\n    c = orders['customer'][i]\n    customer_totals[c]['orders'] += 1\n    customer_totals[c]['revenue'] += orders['amount'][i]\n\nprint('\\n  Top Customers:')\nfor c in sorted(customer_totals.keys(), key=lambda x: -customer_totals[x]['revenue'])[:3]:\n    print(f'    {c}: {customer_totals[c][\"orders\"]} orders, ${customer_totals[c][\"revenue\"]:,}')\n\n# By product\nproduct_sales = defaultdict(int)\nfor i in range(len(orders['id'])):\n    product_sales[orders['product'][i]] += orders['amount'][i]\n\nprint('\\n  Revenue by Product:')\nfor p, rev in sorted(product_sales.items(), key=lambda x: -x[1]):\n    pct = rev / sum(orders['amount']) * 100\n    print(f'    Product {p}: ${rev:,} ({pct:.0f}%)')\n\n# By region\nregion_sales = defaultdict(int)\nfor i in range(len(orders['id'])):\n    region_sales[orders['region'][i]] += orders['amount'][i]\n\nprint('\\n  Revenue by Region:')\nfor r, rev in sorted(region_sales.items(), key=lambda x: -x[1]):\n    print(f'    {r}: ${rev:,}')\n\n# ====== STEP 4: INSIGHTS ======\nprint('\\n💡 STEP 4: Key Insights')\nprint(f'  • Total Revenue: ${sum(orders[\"amount\"]):,}')\nprint(f'  • Orders: {len(orders[\"id\"])}')\nprint(f'  • Avg Order: ${sum(orders[\"amount\"])//len(orders[\"id\"])}')\ntop_customer = max(customer_totals.keys(), key=lambda x: customer_totals[x]['revenue'])\nprint(f'  • Best Customer: {top_customer} (${customer_totals[top_customer][\"revenue\"]:,})')\ntop_product = max(product_sales.keys(), key=lambda x: product_sales[x])\nprint(f'  • Top Product: {top_product} (${product_sales[top_product]:,})')\n\nprint('\\n✅ Pipeline Complete!')",
        solution: "# Complete pipeline",
        testCases: JSON.stringify([{ input: "", expectedOutput: "Full analysis", description: "Complete pipeline" }]),
        hints: ["Follow all steps", "Clean before analyze", "Extract key insights"],
        xpReward: 30,
        order: 5,
      },
    ],
  });
  console.log(`      ✏️  5 exercises created for 24.3.1`);

  console.log("\n" + "=".repeat(65));
  console.log("🎉🎉🎉 CURRICULUM COMPLETE! 🎉🎉🎉");
  console.log("=".repeat(65));
  console.log("\n✅ All 24 chapters have been created!");
  console.log("✅ All lessons and exercises are in the database!");
  console.log("\n📊 Final Statistics:");
  
  // Get final counts
  const chapters = await prisma.chapter.count();
  const sections = await prisma.section.count();
  const lessons = await prisma.lesson.count();
  const exercises = await prisma.exercise.count();
  
  console.log(`   Chapters: ${chapters}`);
  console.log(`   Sections: ${sections}`);
  console.log(`   Lessons: ${lessons}`);
  console.log(`   Exercises: ${exercises}`);
  console.log("\n🚀 Ready for students to learn Python from zero to data science!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
