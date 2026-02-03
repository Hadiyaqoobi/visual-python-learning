import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MilestoneProgress } from '@/components/projects/MilestoneProgress';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';
import { getChapterRequirements } from '@/lib/validation/milestone-validator';

interface Props {
  params: Promise<{ slug: string; chapter: string }>;
}

export default async function MilestonePage({ params }: Props) {
  const { slug, chapter } = await params;
  const chapterNumber = parseInt(chapter);
  
  const project = await prisma.guidedProject.findUnique({
    where: { slug },
    include: { milestones: { orderBy: { order: 'asc' } } }
  });

  if (!project) notFound();

  const milestone = project.milestones.find(m => m.chapterNumber === chapterNumber);
  if (!milestone) notFound();

  // Get user's completed chapters
  let completedChapters: number[] = [];
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  
  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      const submissions = await prisma.milestoneSubmission.findMany({
        where: {
          userId: payload.userId,
          projectId: project.id
        },
        select: { chapterNumber: true }
      });
      completedChapters = submissions.map(s => s.chapterNumber);
    }
  }

  // Get validation requirements for this chapter
  const requirements = getChapterRequirements(chapterNumber);

  const currentIndex = project.milestones.findIndex(m => m.chapterNumber === chapterNumber);
  const prevMilestone = currentIndex > 0 ? project.milestones[currentIndex - 1] : null;
  const nextMilestone = currentIndex < project.milestones.length - 1 ? project.milestones[currentIndex + 1] : null;

  const formatContent = (text: string) => {
    if (!text) return '';
    return text
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre style="background: #1e1e2e; padding: 20px; border-radius: 12px; overflow-x: auto; border: 1px solid rgba(255,255,255,0.1); margin: 16px 0; font-size: 14px;"><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code style="background: rgba(139, 92, 246, 0.2); padding: 2px 8px; border-radius: 4px; color: #a78bfa; font-size: 14px;">$1</code>')
      .replace(/^### (.*$)/gm, '<h3 style="font-size: 20px; font-weight: 700; margin: 32px 0 16px; color: white;">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 style="font-size: 24px; font-weight: 700; margin: 32px 0 16px; color: white;">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 style="font-size: 28px; font-weight: 800; margin: 32px 0 16px; color: white;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: white;">$1</strong>')
      .replace(/\n\n/g, '</p><p style="margin: 16px 0; color: #cbd5e1; line-height: 1.7;">')
      .replace(/^- (.*$)/gm, '<li style="margin: 8px 0; margin-left: 20px; color: #cbd5e1;">$1</li>');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(15, 15, 26, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 40px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href={`/projects/${project.slug}`} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>
              ← {project.title}
            </Link>
            <span style={{ color: '#334155' }}>|</span>
            <span style={{ color: '#a78bfa', fontWeight: '600' }}>
              Chapter {milestone.chapterNumber}: {milestone.title}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>
              {completedChapters.length} of {project.milestones.length} complete
            </span>
            <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${(completedChapters.length / project.milestones.length) * 100}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #22c55e, #22d3ee)', 
                borderRadius: '3px' 
              }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Sidebar with Checkmarks */}
        <div style={{
          width: '280px',
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.1)',
          padding: '24px',
          height: 'calc(100vh - 65px)',
          overflowY: 'auto',
          position: 'sticky',
          top: '65px'
        }}>
          <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '16px' }}>
            Milestones ({completedChapters.length}/{project.milestones.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {project.milestones.map((m) => {
              const isCompleted = completedChapters.includes(m.chapterNumber);
              const isCurrent = m.chapterNumber === chapterNumber;
              
              return (
                <Link key={m.id} href={`/projects/${project.slug}/milestone/${m.chapterNumber}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: isCurrent 
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(99, 102, 241, 0.3))' 
                      : isCompleted 
                        ? 'rgba(34, 197, 94, 0.1)' 
                        : 'transparent',
                    border: isCurrent 
                      ? '1px solid rgba(139, 92, 246, 0.5)' 
                      : isCompleted 
                        ? '1px solid rgba(34, 197, 94, 0.3)' 
                        : '1px solid transparent',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isCompleted 
                        ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                        : isCurrent 
                          ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' 
                          : 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isCompleted ? '16px' : '12px',
                      fontWeight: '700',
                      color: (isCompleted || isCurrent) ? 'white' : '#64748b'
                    }}>
                      {isCompleted ? '✓' : m.chapterNumber}
                    </div>
                    <span style={{ 
                      fontSize: '13px', 
                      color: isCompleted ? '#4ade80' : isCurrent ? 'white' : '#94a3b8',
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      textDecoration: isCompleted ? 'none' : 'none'
                    }}>
                      {m.title}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '40px', maxWidth: '900px' }}>
          {/* Title Card */}
          <div style={{
            background: completedChapters.includes(chapterNumber)
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(6, 182, 212, 0.2))'
              : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))',
            borderRadius: '20px',
            border: completedChapters.includes(chapterNumber)
              ? '1px solid rgba(34, 197, 94, 0.3)'
              : '1px solid rgba(139, 92, 246, 0.3)',
            padding: '32px',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '16px',
                background: completedChapters.includes(chapterNumber)
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {completedChapters.includes(chapterNumber) ? (
                  <span style={{ fontSize: '36px' }}>✓</span>
                ) : (
                  <>
                    <span style={{ fontSize: '10px', color: '#c4b5fd' }}>CH</span>
                    <span style={{ fontSize: '28px', fontWeight: '800' }}>{milestone.chapterNumber}</span>
                  </>
                )}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>{milestone.title}</h1>
                  {completedChapters.includes(chapterNumber) && (
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#4ade80',
                      border: '1px solid rgba(34, 197, 94, 0.3)'
                    }}>
                      ✓ COMPLETED
                    </span>
                  )}
                </div>
                <p style={{ color: '#94a3b8', margin: '8px 0 0', fontSize: '16px' }}>{milestone.description}</p>
              </div>
            </div>
            {milestone.objectives.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#a78bfa', textTransform: 'uppercase', marginBottom: '12px' }}>What You'll Build</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {milestone.objectives.map((obj, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0', fontSize: '14px' }}>
                      <span style={{ color: '#22c55e' }}>✓</span>
                      {obj}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Progress Tracking Component with Requirements */}
          <MilestoneProgress
            projectSlug={project.slug}
            chapterNumber={chapterNumber}
            totalMilestones={project.milestones.length}
            nextMilestoneChapter={nextMilestone?.chapterNumber || null}
            isLastMilestone={!nextMilestone}
            objectives={milestone.objectives}
            requirements={requirements}
          />

          {/* Instructions */}
          <div style={{
            background: 'rgba(30, 30, 46, 0.8)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '32px',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>📖</span> Instructions
            </h2>
            <div style={{ color: '#cbd5e1', lineHeight: '1.7' }} dangerouslySetInnerHTML={{ __html: formatContent(milestone.instructions) }} />
          </div>

          {/* Hints */}
          {milestone.hints.length > 0 && (
            <div style={{
              background: 'rgba(234, 179, 8, 0.1)',
              borderRadius: '16px',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fbbf24', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>💡</span> Hints
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {milestone.hints.map((hint, i) => (
                  <li key={i} style={{ color: '#fef3c7', marginBottom: '8px', lineHeight: '1.5' }}>{hint}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Solution */}
          {milestone.solutionCode && (
            <details style={{
              background: 'rgba(30, 30, 46, 0.8)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              marginBottom: '24px',
              overflow: 'hidden'
            }}>
              <summary style={{ padding: '20px 24px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0' }}>
                <span>🔑</span> View Solution Code
              </summary>
              <div style={{ padding: '0 24px 24px' }}>
                <pre style={{ background: '#1e1e2e', padding: '20px', borderRadius: '12px', overflow: 'auto', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <code style={{ color: '#e2e8f0', fontSize: '14px' }}>{milestone.solutionCode}</code>
                </pre>
              </div>
            </details>
          )}

          {/* Test */}
          {milestone.testInstructions && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '16px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#4ade80', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✅</span> How to Test
              </h3>
              <p style={{ color: '#bbf7d0', margin: 0, lineHeight: '1.5' }}>{milestone.testInstructions}</p>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {prevMilestone ? (
              <Link href={`/projects/${project.slug}/milestone/${prevMilestone.chapterNumber}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', textDecoration: 'none' }}>
                <span style={{ fontSize: '24px' }}>←</span>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Previous</div>
                  <div style={{ fontWeight: '500' }}>Ch {prevMilestone.chapterNumber}: {prevMilestone.title}</div>
                </div>
              </Link>
            ) : <div />}

            {nextMilestone ? (
              <Link href={`/projects/${project.slug}/milestone/${nextMilestone.chapterNumber}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#a78bfa', textDecoration: 'none', textAlign: 'right' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#8b5cf6' }}>Next</div>
                  <div style={{ fontWeight: '500' }}>Ch {nextMilestone.chapterNumber}: {nextMilestone.title}</div>
                </div>
                <span style={{ fontSize: '24px' }}>→</span>
              </Link>
            ) : (
              <Link href={`/projects/${project.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', textDecoration: 'none', fontWeight: '600' }}>
                🎉 Complete Project
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
