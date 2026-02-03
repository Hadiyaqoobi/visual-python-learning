import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';
import Link from 'next/link';
import { CertificateActions } from './CertificateActions';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CertificatePage({ params }: Props) {
  const { slug } = await params;
  
  // Get user
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  
  if (!token) {
    redirect('/login');
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId }
  });

  if (!user) {
    redirect('/login');
  }

  // Get project
  const project = await prisma.guidedProject.findUnique({
    where: { slug },
    include: { milestones: true }
  });

  if (!project) notFound();

  // Check if user completed all milestones
  const submissions = await prisma.milestoneSubmission.findMany({
    where: {
      userId: user.id,
      projectId: project.id
    }
  });

  const completedCount = submissions.length;
  const totalMilestones = project.milestones.length;
  const isCompleted = completedCount >= totalMilestones;

  if (!isCompleted) {
    redirect(`/projects/${slug}`);
  }

  // Get completion date
  const progress = await prisma.userProjectProgress.findUnique({
    where: {
      userId_projectId: {
        userId: user.id,
        projectId: project.id
      }
    }
  });

  const completionDate = progress?.completedAt || new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(completionDate);

  // Generate certificate ID
  const certId = `CERT-${project.slug.toUpperCase().slice(0, 3)}-${user.id.slice(-6).toUpperCase()}-${completionDate.getFullYear()}`;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)',
      color: 'white',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Back Link */}
        <Link href={`/projects/${slug}`} style={{ 
          color: '#94a3b8', 
          textDecoration: 'none', 
          fontSize: '14px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px'
        }}>
          ← Back to Project
        </Link>

        {/* Certificate */}
        <div 
          id="certificate"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e, #2a2a40)',
            borderRadius: '24px',
            border: '3px solid transparent',
            backgroundImage: 'linear-gradient(#1a1a2e, #2a2a40), linear-gradient(135deg, #f59e0b, #eab308, #fbbf24)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            padding: '48px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative corners */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '60px',
            height: '60px',
            borderTop: '3px solid #f59e0b',
            borderLeft: '3px solid #f59e0b',
            borderRadius: '8px 0 0 0'
          }} />
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderTop: '3px solid #f59e0b',
            borderRight: '3px solid #f59e0b',
            borderRadius: '0 8px 0 0'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            width: '60px',
            height: '60px',
            borderBottom: '3px solid #f59e0b',
            borderLeft: '3px solid #f59e0b',
            borderRadius: '0 0 0 8px'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderBottom: '3px solid #f59e0b',
            borderRight: '3px solid #f59e0b',
            borderRadius: '0 0 8px 0'
          }} />

          {/* Trophy Icon */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #f59e0b, #eab308)',
              borderRadius: '50%',
              fontSize: '50px',
              boxShadow: '0 0 40px rgba(245, 158, 11, 0.4)'
            }}>
              🏆
            </div>
          </div>

          {/* Certificate Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#f59e0b', 
              textTransform: 'uppercase', 
              letterSpacing: '4px',
              marginBottom: '8px'
            }}>
              Certificate of Completion
            </p>
            <h1 style={{ 
              fontSize: '18px', 
              fontWeight: '400', 
              color: '#94a3b8',
              margin: 0
            }}>
              This is to certify that
            </h1>
          </div>

          {/* Name */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '42px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
              padding: '8px 0',
              borderTop: '1px solid rgba(245, 158, 11, 0.3)',
              borderBottom: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              {user.name || user.email.split('@')[0]}
            </h2>
          </div>

          {/* Completion Text */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ fontSize: '18px', color: '#94a3b8', margin: '0 0 16px' }}>
              has successfully completed the project
            </p>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'white',
              margin: '0 0 16px'
            }}>
              {project.title}
            </h3>
            <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
              {totalMilestones} milestones • {project.estimatedHours} hours • {project.difficulty}
            </p>
          </div>

          {/* Technologies */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Technologies Mastered
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
              {project.technologies.map((tech, i) => (
                <span key={i} style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '500',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Date and ID */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '24px',
            marginTop: '24px'
          }}>
            <div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px' }}>Date of Completion</p>
              <p style={{ fontSize: '16px', color: '#e2e8f0', margin: 0, fontWeight: '600' }}>{formattedDate}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
                fontSize: '12px',
                fontWeight: '700',
                color: 'white'
              }}>
                VERIFIED
              </div>
              <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>Digital Seal</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px' }}>Certificate ID</p>
              <p style={{ fontSize: '14px', color: '#e2e8f0', margin: 0, fontFamily: 'monospace' }}>{certId}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <CertificateActions 
          projectTitle={project.title}
          userName={user.name || user.email.split('@')[0]}
          certId={certId}
          completionDate={formattedDate}
          technologies={project.technologies}
        />
      </div>
    </div>
  );
}
