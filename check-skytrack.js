const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const project = await prisma.guidedProject.findUnique({
    where: { slug: 'skytrack-flight-tracker' },
    include: { milestones: { orderBy: { order: 'asc' } } }
  });
  
  console.log('Project:', project?.title);
  console.log('Milestones:', project?.milestones?.length);
  
  if (project?.milestones) {
    project.milestones.forEach(m => {
      console.log('  Ch ' + m.chapterNumber + ': ' + m.title);
    });
  }
}

check().finally(() => prisma.$disconnect());
