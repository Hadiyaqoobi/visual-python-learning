"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  projectSlug: string;
  chapterNumber: number;
  totalMilestones: number;
  nextMilestoneChapter: number | null;
  isLastMilestone: boolean;
  objectives?: string[];
}

export function MilestoneProgress({ 
  projectSlug, 
  chapterNumber, 
  totalMilestones,
  nextMilestoneChapter,
  isLastMilestone,
  objectives = []
}: Props) {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Verification state
  const [showVerification, setShowVerification] = useState(false);
  const [checkedObjectives, setCheckedObjectives] = useState<boolean[]>([]);
  const [proofCode, setProofCode] = useState('');
  const [proofOutput, setProofOutput] = useState('');

  const allObjectivesChecked = objectives.length === 0 || checkedObjectives.every(Boolean);

  useEffect(() => {
    fetchProgress();
  }, [projectSlug, chapterNumber]);

  useEffect(() => {
    setShowVerification(false);
    setCheckedObjectives(new Array(objectives.length).fill(false));
    setProofCode('');
    setProofOutput('');
    setValidationErrors([]);
    setError(null);
    setIsCompleted(false);
  }, [chapterNumber, objectives.length]);

  const fetchProgress = async () => {
    try {
      const res = await fetch(`/api/projects/progress?projectSlug=${projectSlug}`);
      const data = await res.json();
      
      if (res.ok) {
        setProgress(data);
        if (data.completedChapters?.includes(chapterNumber)) {
          setIsCompleted(true);
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleToggleObjective = (index: number) => {
    const newChecked = [...checkedObjectives];
    newChecked[index] = !newChecked[index];
    setCheckedObjectives(newChecked);
  };

  const handleComplete = async () => {
    if (!allObjectivesChecked) {
      setError('Please confirm you completed all objectives');
      setValidationErrors([]);
      return;
    }

    if (!proofCode.trim()) {
      setError('Please paste your code to verify completion');
      setValidationErrors([]);
      return;
    }

    setIsCompleting(true);
    setError(null);
    setValidationErrors([]);
    
    try {
      const res = await fetch('/api/projects/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectSlug,
          action: 'complete_milestone',
          milestoneChapter: chapterNumber,
          proof: {
            code: proofCode,
            output: proofOutput || null,
            objectivesConfirmed: true
          }
        })
      });

      const data = await res.json();
      console.log('API Response:', data);
      
      if (res.ok) {
        setIsCompleted(true);
        setShowVerification(false);
        setShowCelebration(true);
        
        setTimeout(() => {
          setShowCelebration(false);
          if (data.isProjectComplete) {
            router.push(`/projects/${projectSlug}?completed=true`);
          } else if (nextMilestoneChapter) {
            router.push(`/projects/${projectSlug}/milestone/${nextMilestoneChapter}`);
          }
        }, 2000);
      } else {
        // Handle validation errors
        console.log('Validation failed:', data);
        if (data.validationErrors && data.validationErrors.length > 0) {
          setValidationErrors(data.validationErrors);
        } else if (data.error) {
          setValidationErrors([data.error]);
        } else {
          setValidationErrors(['An unknown error occurred. Please try again.']);
        }
      }
    } catch (error) {
      console.error('Error completing milestone:', error);
      setValidationErrors(['Network error. Please check your connection and try again.']);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleStart = async () => {
    setIsStarting(true);
    setError(null);
    try {
      const res = await fetch('/api/projects/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectSlug,
          action: 'start'
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        await fetchProgress();
      } else {
        setError(data.error || 'Failed to start project');
      }
    } catch (error) {
      console.error('Error starting project:', error);
      setError('Network error');
    } finally {
      setIsStarting(false);
    }
  };

  const showStartButton = !progress || progress.status === 'NOT_STARTED';
  const showCompleteButton = progress && progress.status === 'IN_PROGRESS' && !isCompleted;

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '100px', marginBottom: '20px', animation: 'bounce 0.5s ease infinite' }}>🎉</div>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: 'white', marginBottom: '10px' }}>
              {isLastMilestone ? 'Project Complete!' : 'Milestone Complete!'}
            </h2>
            <p style={{ color: '#22d3ee', fontSize: '24px', fontWeight: '700' }}>+50 XP</p>
            <p style={{ color: '#94a3b8', marginTop: '20px' }}>Loading next chapter...</p>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerification && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e1e2e, #2a2a40)',
            borderRadius: '24px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white', margin: 0 }}>
                ✅ Verify Completion
              </h2>
              <button
                onClick={() => {
                  setShowVerification(false);
                  setValidationErrors([]);
                  setError(null);
                }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Validation Errors - PROMINENT DISPLAY */}
            {validationErrors.length > 0 && (
              <div style={{
                padding: '20px',
                marginBottom: '24px',
                borderRadius: '16px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '2px solid rgba(239, 68, 68, 0.5)'
              }}>
                <h4 style={{ color: '#f87171', margin: '0 0 16px', fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ❌ Code Validation Failed
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {validationErrors.map((err, i) => (
                    <li key={i} style={{ color: '#fca5a5', marginBottom: '12px', fontSize: '14px', lineHeight: '1.6' }}>
                      {err}
                    </li>
                  ))}
                </ul>
                <p style={{ color: '#f87171', fontSize: '13px', marginTop: '16px', marginBottom: 0, fontStyle: 'italic' }}>
                  💡 Tip: Make sure you&apos;ve followed all the instructions and your code includes the required elements.
                </p>
              </div>
            )}

            {/* General Error */}
            {error && validationErrors.length === 0 && (
              <div style={{
                padding: '16px',
                marginBottom: '20px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {/* Objectives Checklist */}
            {objectives.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#a78bfa', marginBottom: '16px', textTransform: 'uppercase' }}>
                  Confirm You Completed These Objectives:
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {objectives.map((obj, i) => (
                    <label
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        background: checkedObjectives[i] ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        border: checkedObjectives[i] ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checkedObjectives[i] || false}
                        onChange={() => handleToggleObjective(i)}
                        style={{
                          width: '20px',
                          height: '20px',
                          accentColor: '#22c55e',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ color: checkedObjectives[i] ? '#4ade80' : '#e2e8f0', fontSize: '15px' }}>
                        {obj}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Required: Code Proof */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📝 Paste Your Code <span style={{ color: '#ef4444' }}>*</span>
              </h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>
                Your code will be automatically validated. It must include the required elements for this chapter.
              </p>
              <textarea
                value={proofCode}
                onChange={(e) => {
                  setProofCode(e.target.value);
                  setValidationErrors([]); // Clear errors when user types
                }}
                placeholder="Paste your complete app.py code here..."
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '16px',
                  background: '#1a1a2e',
                  border: validationErrors.length > 0 
                    ? '2px solid rgba(239, 68, 68, 0.5)' 
                    : proofCode.trim() 
                      ? '1px solid rgba(34, 197, 94, 0.3)' 
                      : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  resize: 'vertical'
                }}
              />
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                {proofCode.length} characters entered
              </p>
            </div>

            {/* Optional: Output Proof */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '12px' }}>
                🖥️ Paste API Output (Optional)
              </h3>
              <textarea
                value={proofOutput}
                onChange={(e) => setProofOutput(e.target.value)}
                placeholder='Paste your API response here... e.g. {"message": "Hello SkyTrack!"}'
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '16px',
                  background: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleComplete}
              disabled={!allObjectivesChecked || !proofCode.trim() || isCompleting}
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: '12px',
                border: 'none',
                background: (allObjectivesChecked && proofCode.trim() && !isCompleting)
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'rgba(255,255,255,0.1)',
                color: (allObjectivesChecked && proofCode.trim()) ? 'white' : '#64748b',
                fontWeight: '700',
                fontSize: '16px',
                cursor: (allObjectivesChecked && proofCode.trim() && !isCompleting) ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isCompleting ? (
                <>⏳ Validating Your Code...</>
              ) : (allObjectivesChecked && proofCode.trim()) ? (
                <>🎯 Submit & Earn 50 XP</>
              ) : !proofCode.trim() ? (
                <>Paste your code to continue</>
              ) : (
                <>Check all objectives to continue</>
              )}
            </button>

            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', marginTop: '16px' }}>
              Your code is automatically validated for required elements.
            </p>
          </div>
        </div>
      )}

      {/* Progress Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(6, 182, 212, 0.1))',
        borderRadius: '16px',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <span>📈</span> Your Progress
          </h3>
          {progress && progress.status !== 'NOT_STARTED' && (
            <span style={{ color: '#22d3ee', fontWeight: '700', fontSize: '18px' }}>
              {progress.percentComplete}%
            </span>
          )}
        </div>

        <div style={{
          height: '10px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '5px',
          marginBottom: '16px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress?.percentComplete || 0}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #22c55e, #22d3ee)',
            borderRadius: '5px',
            transition: 'width 0.5s ease'
          }} />
        </div>

        <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>
          {progress && progress.status !== 'NOT_STARTED' ? (
            <>Milestone {progress.completedMilestones} of {totalMilestones} complete</>
          ) : (
            <>Start this project to track your progress!</>
          )}
        </div>

        {showStartButton && (
          <button
            onClick={handleStart}
            disabled={isStarting}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: isStarting ? 'rgba(139, 92, 246, 0.5)' : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              color: 'white',
              fontWeight: '700',
              fontSize: '16px',
              cursor: isStarting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isStarting ? '⏳ Starting...' : '🚀 Start Project'}
          </button>
        )}
        
        {isCompleted && (
          <div style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#4ade80',
            fontWeight: '600',
            fontSize: '16px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            ✅ Completed
          </div>
        )}
        
        {showCompleteButton && (
          <button
            onClick={() => setShowVerification(true)}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            ✓ Mark Complete & Continue
          </button>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </>
  );
}
