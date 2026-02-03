import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  
  const project = await prisma.guidedProject.findUnique({
    where: { slug },
    include: { milestones: { orderBy: { order: 'asc' } } }
  });

  if (!project) notFound();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)',
      color: 'white',
      padding: '40px'
    }}>
      {/* Back Button */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 24px' }}>
        <Link href="/projects" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#94a3b8',
          textDecoration: 'none',
          fontSize: '14px',
          padding: '8px 16px',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          ← Back to Projects
        </Link>
      </div>

      {/* Hero */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 48px',
        background: 'linear-gradient(135deg, #312e81, #581c87, #831843)',
        borderRadius: '24px',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)',
            flexShrink: 0
          }}>
            🛫
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '36px', fontWeight: '800', margin: 0 }}>{project.title}</h1>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#4ade80',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                {project.difficulty}
              </span>
            </div>
            <p style={{ color: '#c4b5fd', fontSize: '18px', margin: 0 }}>{project.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '32px', marginTop: '32px' }}>
          {[
            { icon: '📚', label: `${project.milestones.length} Milestones` },
            { icon: '⏱️', label: `${project.estimatedHours} Hours` },
            { icon: '📈', label: 'Chapters 1-31' }
          ].map((stat, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '14px'
            }}>
              <span>{stat.icon}</span>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
        {/* Milestones */}
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span>📍</span> Your Journey
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {project.milestones.map((milestone, index) => (
              <Link
                key={milestone.id}
                href={`/projects/${project.slug}/milestone/${milestone.chapterNumber}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '24px',
                  background: 'rgba(30, 30, 46, 0.8)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}>
                  {/* Chapter Badge */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '10px', color: '#c4b5fd' }}>CH</span>
                    <span style={{ fontSize: '24px', fontWeight: '800' }}>{milestone.chapterNumber}</span>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: '0 0 8px' }}>
                      {milestone.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
                      {milestone.description}
                    </p>

                    {/* Objectives */}
                    {milestone.objectives.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                        {milestone.objectives.slice(0, 3).map((obj, i) => (
                          <span key={i} style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#a78bfa'
                          }}>
                            {obj.length > 25 ? obj.slice(0, 25) + '...' : obj}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#64748b',
                    fontSize: '20px'
                  }}>
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Start Button */}
          <Link
            href={`/projects/${project.slug}/milestone/1`}
            style={{
              display: 'block',
              padding: '20px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              color: 'white',
              textDecoration: 'none',
              textAlign: 'center',
              fontWeight: '700',
              fontSize: '18px',
              boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)'
            }}
          >
            🚀 Start Project
          </Link>

          {/* Technologies */}
          <div style={{
            padding: '24px',
            background: 'rgba(30, 30, 46, 0.8)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '16px', textTransform: 'uppercase' }}>
              🛠️ Technologies
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.technologies.map((tech) => (
                <span key={tech} style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Learning Outcomes */}
          {project.learningOutcomes.length > 0 && (
            <div style={{
              padding: '24px',
              background: 'rgba(30, 30, 46, 0.8)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '16px', textTransform: 'uppercase' }}>
                🎯 What You'll Learn
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {project.learningOutcomes.map((outcome, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#e2e8f0', fontSize: '14px' }}>
                    <span style={{ color: '#22d3ee' }}>→</span>
                    {outcome}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress */}
          <div style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))',
            borderRadius: '16px',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#a78bfa', marginBottom: '8px' }}>
              📈 Your Progress
            </h3>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#22d3ee', marginBottom: '8px' }}>
              0%
            </div>
            <div style={{
              height: '8px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              marginBottom: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '0%',
                height: '100%',
                background: 'linear-gradient(90deg, #8b5cf6, #22d3ee)',
                borderRadius: '4px'
              }} />
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>
              0 of {project.milestones.length} milestones complete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
