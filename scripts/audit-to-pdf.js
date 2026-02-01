const { PrismaClient } = require('@prisma/client');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('📊 Generating comprehensive course audit PDF...\n');

  const doc = new PDFDocument({ 
    margin: 50,
    size: 'A4'
  });
  
  const outputPath = path.join(__dirname, '..', 'course-audit-report.pdf');
  doc.pipe(fs.createWriteStream(outputPath));

  // Fetch all data
  const chapters = await prisma.chapter.findMany({
    include: {
      sections: {
        include: {
          lessons: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { number: 'asc' }
  });

  // Calculate stats
  let totalChapters = chapters.length;
  let totalSections = 0;
  let totalLessons = 0;
  let totalExercises = 0;
  let lessonsWithExercises = 0;
  let lessonsWithCode = 0;
  let publishedLessons = 0;
  let totalContentChars = 0;

  const chapterStats = [];

  for (const chapter of chapters) {
    let chLessons = 0;
    let chExercises = 0;

    totalSections += chapter.sections.length;

    for (const section of chapter.sections) {
      for (const lesson of section.lessons) {
        totalLessons++;
        chLessons++;
        
        if (lesson.isPublished) publishedLessons++;
        if (lesson.content) totalContentChars += lesson.content.length;

        let exerciseCount = 0;
        if (lesson.exercises) {
          try {
            const ex = JSON.parse(lesson.exercises);
            exerciseCount = Array.isArray(ex) ? ex.length : 0;
          } catch(e) {}
        }
        if (exerciseCount > 0) {
          lessonsWithExercises++;
          totalExercises += exerciseCount;
          chExercises += exerciseCount;
        }

        if (lesson.codeExamples) {
          try {
            const code = JSON.parse(lesson.codeExamples);
            if (Array.isArray(code) && code.length > 0) lessonsWithCode++;
          } catch(e) {}
        }
      }
    }

    chapterStats.push({
      number: chapter.number,
      title: chapter.title,
      lessons: chLessons,
      exercises: chExercises,
      isPublished: chapter.isPublished
    });
  }

  // ============ COVER PAGE ============
  doc.moveDown(2);
  doc.fontSize(32).font('Helvetica-Bold').fillColor('#1e40af')
    .text('Visual Python Learning', { align: 'center' });
  doc.fontSize(20).font('Helvetica').fillColor('#6b7280')
    .text('Course Content Audit Report', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('#9ca3af')
    .text('Generated: ' + new Date().toLocaleString(), { align: 'center' });
  
  doc.moveDown(3);

  // Summary stats
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#1e3a5f')
    .text('Executive Summary');
  doc.moveDown(0.5);
  
  doc.fontSize(11).font('Helvetica').fillColor('#374151');
  doc.text('Total Chapters: ' + totalChapters);
  doc.text('Total Sections: ' + totalSections);
  doc.text('Total Lessons: ' + totalLessons);
  doc.text('Published Lessons: ' + publishedLessons);
  doc.text('Total Exercises: ' + totalExercises);
  doc.text('Lessons with Exercises: ' + lessonsWithExercises);
  doc.text('Lessons with Code Examples: ' + lessonsWithCode);
  doc.text('Total Content: ' + Math.round(totalContentChars/1000) + 'K characters');

  doc.moveDown(2);

  // Chapter table
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#1e3a5f')
    .text('Chapter Overview');
  doc.moveDown(0.5);

  for (const ch of chapterStats) {
    const status = ch.exercises > 0 ? '✓' : ch.lessons > 0 ? '◐' : '○';
    doc.fontSize(10).font('Helvetica').fillColor('#374151')
      .text(status + ' Ch ' + ch.number + ': ' + ch.title + ' (' + ch.lessons + ' lessons, ' + ch.exercises + ' exercises)');
  }

  // ============ DETAILED PAGES ============
  for (const chapter of chapters) {
    doc.addPage();
    
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#1e40af')
      .text('Chapter ' + chapter.number + ': ' + chapter.title);
    doc.moveDown(0.3);
    
    if (chapter.description) {
      doc.fontSize(10).font('Helvetica-Oblique').fillColor('#6b7280')
        .text(chapter.description, { width: 495 });
    }
    doc.moveDown(0.5);

    if (chapter.objectives && chapter.objectives.length > 0) {
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#059669').text('Objectives:');
      for (const obj of chapter.objectives) {
        doc.fontSize(9).font('Helvetica').fillColor('#374151').text('  • ' + obj);
      }
      doc.moveDown(0.5);
    }

    doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e3a5f').text('Lessons:');
    doc.moveDown(0.3);

    for (const section of chapter.sections) {
      for (const lesson of section.lessons) {
        if (doc.y > 720) doc.addPage();

        let exercises = [];
        try { exercises = JSON.parse(lesson.exercises || '[]'); } catch(e) {}
        
        const contentLen = lesson.content ? lesson.content.length : 0;
        const status = exercises.length > 0 ? '●' : contentLen > 1000 ? '◐' : '○';
        const color = exercises.length > 0 ? '#059669' : contentLen > 1000 ? '#d97706' : '#dc2626';

        doc.fontSize(10).font('Helvetica-Bold').fillColor(color).text(status + ' ' + lesson.title);
        doc.fontSize(8).font('Helvetica').fillColor('#6b7280')
          .text('    Slug: ' + lesson.slug + ' | Content: ' + contentLen + ' chars | Exercises: ' + exercises.length);
        
        if (lesson.objectives && lesson.objectives.length > 0) {
          for (const obj of lesson.objectives.slice(0, 2)) {
            doc.fontSize(8).fillColor('#9ca3af').text('    - ' + obj);
          }
        }

        if (exercises.length > 0) {
          doc.fontSize(8).fillColor('#059669').text('    Exercises:');
          for (const ex of exercises) {
            const q = (ex.question || '').substring(0, 50);
            doc.fillColor('#374151').text('      [' + (ex.type || '?') + '] ' + q + '...');
          }
        }
        doc.moveDown(0.3);
      }
    }

    if (chapter.sections.every(s => s.lessons.length === 0)) {
      doc.fontSize(10).font('Helvetica-Oblique').fillColor('#dc2626')
        .text('No lessons created yet');
    }
  }

  // ============ GAPS PAGE ============
  doc.addPage();
  doc.fontSize(18).font('Helvetica-Bold').fillColor('#dc2626')
    .text('Gaps Analysis');
  doc.moveDown(0.5);

  const noExercises = chapterStats.filter(ch => ch.exercises === 0 && ch.lessons > 0);
  const noLessons = chapterStats.filter(ch => ch.lessons === 0);

  if (noExercises.length > 0) {
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#d97706')
      .text('Chapters needing exercises:');
    for (const ch of noExercises) {
      doc.fontSize(10).font('Helvetica').fillColor('#374151')
        .text('  • Ch ' + ch.number + ': ' + ch.title + ' (' + ch.lessons + ' lessons)');
    }
    doc.moveDown(0.5);
  }

  if (noLessons.length > 0) {
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#dc2626')
      .text('Empty chapters (no lessons):');
    for (const ch of noLessons) {
      doc.fontSize(10).font('Helvetica').fillColor('#374151')
        .text('  • Ch ' + ch.number + ': ' + ch.title);
    }
  }

  doc.moveDown(1);
  doc.fontSize(10).font('Helvetica').fillColor('#6b7280')
    .text('Legend: ● Complete | ◐ Content only | ○ Incomplete');

  doc.end();
  
  console.log('✅ PDF report generated: ' + outputPath);
  console.log('\n📊 Quick Stats:');
  console.log('   Chapters: ' + totalChapters);
  console.log('   Lessons: ' + totalLessons);
  console.log('   Exercises: ' + totalExercises);
  console.log('   Chapters needing exercises: ' + noExercises.length);
}

main()
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
