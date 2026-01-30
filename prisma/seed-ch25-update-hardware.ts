import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Updating Chapter 25 with Hardware Demo tips...\n");

  // Update Lesson 25.1.1
  await prisma.lesson.update({
    where: { slug: "what-is-machine-learning" },
    data: {
      hardwareDemo: "Visualize how ML differs from traditional programming at the CPU level. Show traditional code following fixed instruction paths vs ML iterating through data, updating weights in memory. Demonstrate how training loops repeatedly access memory to refine model parameters.",
    },
  });
  console.log("Updated Lesson 25.1.1 with hardware demo");

  // Update Lesson 25.1.2
  await prisma.lesson.update({
    where: { slug: "ml-types-supervised-unsupervised-reinforcement" },
    data: {
      hardwareDemo: "Compare memory access patterns: Supervised learning reads labeled pairs (X,y) sequentially. Unsupervised scans data looking for patterns. Reinforcement learning shows agent-environment interaction with reward signals stored in registers.",
    },
  });
  console.log("Updated Lesson 25.1.2 with hardware demo");

  // Update Lesson 25.1.3
  await prisma.lesson.update({
    where: { slug: "features-and-labels" },
    data: {
      hardwareDemo: "Show how feature matrices are stored in contiguous memory blocks. Visualize row-major vs column-major access patterns. Demonstrate how X[i] accesses a row (all features for one sample) vs X[:,j] accesses a column (one feature for all samples).",
    },
  });
  console.log("Updated Lesson 25.1.3 with hardware demo");

  // Update Lesson 25.1.4
  await prisma.lesson.update({
    where: { slug: "train-validation-test-sets" },
    data: {
      hardwareDemo: "Visualize memory partitioning when splitting data. Show how shuffling rearranges memory indices. Demonstrate data leakage by showing test data statistics flowing into training normalization vs correct isolation.",
    },
  });
  console.log("Updated Lesson 25.1.4 with hardware demo");

  console.log("\n✅ All hardware demos added!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
