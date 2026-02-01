"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TrainingLoopViz() {
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [step, setStep] = useState(0);
  const [losses, setLosses] = useState<number[]>([]);
  const [currentPhase, setCurrentPhase] = useState<'idle' | 'zero_grad' | 'forward' | 'loss' | 'backward' | 'step'>('idle');

  const phases = [
    { id: 'zero_grad', name: 'optimizer.zero_grad()', color: '#ef4444', desc: 'Clear old gradients' },
    { id: 'forward', name: 'output = model(x)', color: '#3b82f6', desc: 'Forward pass' },
    { id: 'loss', name: 'loss = criterion(...)', color: '#f97316', desc: 'Compute loss' },
    { id: 'backward', name: 'loss.backward()', color: '#8b5cf6', desc: 'Compute gradients' },
    { id: 'step', name: 'optimizer.step()', color: '#22c55e', desc: 'Update weights' },
  ];

  const startTraining = () => {
    setIsTraining(true);
    setEpoch(0);
    setStep(0);
    setLosses([]);
    setCurrentPhase('zero_grad');
  };

  useEffect(() => {
    if (!isTraining) return;

    const phaseOrder: typeof currentPhase[] = ['zero_grad', 'forward', 'loss', 'backward', 'step'];
    const currentIndex = phaseOrder.indexOf(currentPhase);

    const timer = setTimeout(() => {
      if (currentPhase === 'idle') return;

      if (currentIndex < phaseOrder.length - 1) {
        setCurrentPhase(phaseOrder[currentIndex + 1]);
      } else {
        // Completed one step
        const newLoss = 2.5 * Math.exp(-epoch * 0.3 - step * 0.05) + Math.random() * 0.2;
        setLosses(prev => [...prev.slice(-19), newLoss]);
        
        if (step < 4) {
          setStep(step + 1);
          setCurrentPhase('zero_grad');
        } else if (epoch < 4) {
          setEpoch(epoch + 1);
          setStep(0);
          setCurrentPhase('zero_grad');
        } else {
          setIsTraining(false);
          setCurrentPhase('idle');
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [isTraining, currentPhase, epoch, step]);

  return (
    <div style={{
      width: '100%', minHeight: '700px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🔄 The Training Loop</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          Watch the 5-step training process in action
        </p>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>{epoch + 1}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Epoch</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22c55e' }}>{step + 1}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Batch</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f97316' }}>
            {losses.length > 0 ? losses[losses.length - 1].toFixed(3) : '—'}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Loss</div>
        </div>
      </div>

      {/* Training loop visualization */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {phases.map((phase, i) => (
            <div key={phase.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <motion.div
                animate={{
                  scale: currentPhase === phase.id ? [1, 1.1, 1] : 1,
                  boxShadow: currentPhase === phase.id ? `0 0 20px ${phase.color}` : 'none',
                }}
                transition={{ repeat: currentPhase === phase.id ? Infinity : 0, duration: 0.5 }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: currentPhase === phase.id ? phase.color : `${phase.color}40`,
                  border: `2px solid ${phase.color}`,
                  textAlign: 'center',
                  minWidth: '120px',
                }}
              >
                <div style={{ fontSize: '10px', fontFamily: 'monospace', opacity: 0.9 }}>{phase.name}</div>
                <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>{phase.desc}</div>
              </motion.div>
              {i < phases.length - 1 && (
                <motion.span
                  animate={{ opacity: currentPhase === phases[i + 1].id ? 1 : 0.3 }}
                  style={{ fontSize: '20px', color: '#64748b' }}
                >
                  →
                </motion.span>
              )}
            </div>
          ))}
        </div>

        {/* Circular arrow back */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <motion.div
            animate={{ rotate: isTraining ? 360 : 0 }}
            transition={{ repeat: isTraining ? Infinity : 0, duration: 2, ease: 'linear' }}
            style={{ display: 'inline-block', fontSize: '24px' }}
          >
            🔄
          </motion.div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Repeat for each batch, each epoch
          </div>
        </div>
      </div>

      {/* Loss chart */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        height: '150px',
      }}>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Loss over time</div>
        <div style={{ display: 'flex', alignItems: 'end', height: '100px', gap: '4px' }}>
          {losses.map((loss, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${Math.min(100, loss * 40)}%` }}
              style={{
                flex: 1,
                background: `linear-gradient(to top, #22c55e, ${loss > 1 ? '#f97316' : '#22c55e'})`,
                borderRadius: '2px 2px 0 0',
                minWidth: '8px',
              }}
            />
          ))}
          {losses.length === 0 && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              Start training to see loss
            </div>
          )}
        </div>
      </div>

      {/* Start button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={startTraining}
          disabled={isTraining}
          style={{
            padding: '14px 40px',
            borderRadius: '12px',
            background: isTraining ? '#475569' : 'linear-gradient(135deg, #22c55e, #16a34a)',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isTraining ? 'not-allowed' : 'pointer',
          }}
        >
          {isTraining ? '🔄 Training...' : '▶️ Start Training'}
        </button>
      </div>

      {/* Code */}
      <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '16px', marginTop: '20px' }}>
        <pre style={{ fontFamily: 'monospace', fontSize: '11px', color: '#e2e8f0', margin: 0 }}>
{`for epoch in range(num_epochs):
    for batch_x, batch_y in dataloader:
        optimizer.zero_grad()      # 1. Clear gradients
        output = model(batch_x)    # 2. Forward pass
        loss = criterion(output, batch_y)  # 3. Compute loss
        loss.backward()            # 4. Backward pass
        optimizer.step()           # 5. Update weights`}
        </pre>
      </div>
    </div>
  );
}
