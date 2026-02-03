import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ProjectsPage() {
  const projects = await prisma.guidedProject.findMany({
    where: { isPublished: true },
    include: { milestones: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' }
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)',
      color: 'white',
      padding: '40px'
    }}>
      {/* Hero Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', marginBottom: '60px' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '50px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          marginBottom: '32px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 10px #22c55e',
            animation: 'pulse 2s infinite'
          }} />
          <span style={{ fontSize: '14px', color: '#c4b5fd' }}>New Project Available</span>
        </div>

        <h1 style={{
          fontSize: '64px',
          fontWeight: '900',
          marginBottom: '24px',
          lineHeight: '1.1'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #fff, #c4b5fd, #67e8f9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Build Something
          </span>
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa, #f472b6, #22d3ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Extraordinary
          </span>
        </h1>

        <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 48px' }}>
          Transform your Python skills into real-world applications.
          <span style={{ color: '#a78bfa' }}> One project.</span>
          <span style={{ color: '#22d3ee' }}> 31 chapters.</span>
          <span style={{ color: '#f472b6' }}> Infinite possibilities.</span>
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '64px', marginBottom: '48px' }}>
          {[
            { value: '2,500+', label: 'Lines of Code', color: '#a78bfa' },
            { value: '31', label: 'Milestones', color: '#f472b6' },
            { value: '40+', label: 'Hours of Learning', color: '#22d3ee' }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Cards */}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              position: 'relative',
              marginBottom: '32px',
              cursor: 'pointer'
            }}>
              {/* Glow Effect */}
              <div style={{
                position: 'absolute',
                inset: '-2px',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4)',
                borderRadius: '28px',
                filter: 'blur(20px)',
                opacity: '0.4',
                transition: 'opacity 0.3s'
              }} />

              {/* Card */}
              <div style={{
                position: 'relative',
                background: 'linear-gradient(135deg, #1e1e2e, #2a2a3e)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden'
              }}>
                {/* Banner */}
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #312e81, #581c87, #831843)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 48px'
                }}>
                  {/* Icon */}
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '64px',
                    boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)'
                  }}>
                    🛫
                  </div>

                  {/* Radar Animation */}
                  <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                    <div style={{
                      position: 'absolute',
                      inset: '0',
                      border: '2px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '50%',
                      animation: 'ping 3s infinite'
                    }} />
                    <div style={{
                      position: 'absolute',
                      inset: '20px',
                      border: '2px solid rgba(34, 197, 94, 0.4)',
                      borderRadius: '50%',
                      animation: 'ping 3s infinite 0.5s'
                    }} />
                    <div style={{
                      position: 'absolute',
                      inset: '40px',
                      border: '2px solid rgba(34, 197, 94, 0.5)',
                      borderRadius: '50%',
                      animation: 'ping 3s infinite 1s'
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '12px',
                      height: '12px',
                      background: '#22c55e',
                      borderRadius: '50%',
                      boxShadow: '0 0 20px #22c55e'
                    }} />
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'white', margin: 0 }}>
                      {project.title}
                    </h2>
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

                  <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '24px' }}>
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                    {project.technologies.map((tech, i) => (
                      <span key={tech} style={{
                        padding: '8px 16px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        background: 'rgba(255,255,255,0.05)',
                        color: ['#818cf8', '#a78bfa', '#f472b6', '#22d3ee', '#34d399', '#fbbf24', '#f87171'][i % 7],
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '24px',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{ display: 'flex', gap: '32px', color: '#64748b' }}>
                      <span>📚 {project.milestones.length} Milestones</span>
                      <span>⏱️ {project.estimatedHours} Hours</span>
                    </div>

                    <div style={{
                      padding: '16px 32px',
                      borderRadius: '16px',
                      fontWeight: '700',
                      fontSize: '16px',
                      background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4)',
                      color: 'white',
                      boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)'
                    }}>
                      Start Building →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Features Section */}
      <div style={{ maxWidth: '1200px', margin: '80px auto', textAlign: 'center' }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '700',
          marginBottom: '48px',
          background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Why Build With Us?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { icon: '🌍', title: 'Real Data', desc: 'Track actual flights using OpenSky Network API. See real planes flying across the globe.', color: '#22d3ee' },
            { icon: '🧠', title: 'AI-Powered', desc: 'Build machine learning models that predict flight delays. Real AI, real predictions.', color: '#a78bfa' },
            { icon: '🚀', title: 'Deploy Live', desc: 'Ship your project to the cloud. Share a real URL with friends and employers.', color: '#f472b6' }
          ].map((feature, i) => (
            <div key={i} style={{
              background: 'rgba(30, 30, 46, 0.8)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>{feature.title}</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2 style={{
          fontSize: '48px',
          fontWeight: '700',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #fff, #94a3b8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Ready to Take Off?
        </h2>
        <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '32px' }}>
          Join thousands of learners building real Python projects.
        </p>
        <Link href="/projects/skytrack-flight-tracker" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          padding: '20px 48px',
          borderRadius: '20px',
          fontWeight: '700',
          fontSize: '20px',
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4)',
          color: 'white',
          textDecoration: 'none',
          boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}>
          🛫 Start SkyTrack Now →
        </Link>
      </div>

      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
