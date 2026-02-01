"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function GradientDescent() {
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 20 });
  const [isRunning, setIsRunning] = useState(false);
  const [learningRate, setLearningRate] = useState(0.1);
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState<{x: number, y: number}[]>([]);

  const getLoss = (x: number) => Math.pow(x - 200, 2) / 1000 + 50;
  const getGradient = (x: number) => 2 * (x - 200) / 1000;

  const runGradientStep = useCallback(() => {
    setBallPosition(prev => {
      const gradient = getGradient(prev.x);
      const newX = prev.x - learningRate * gradient * 500;
      const newY = getLoss(newX);
      setHistory(h => [...h, { x: newX, y: newY }]);
      setStep(s => s + 1);
      return { x: Math.max(20, Math.min(380, newX)), y: newY };
    });
  }, [learningRate]);

  useEffect(() => {
    if (!isRunning) return;
    if (step > 50 || Math.abs(ballPosition.x - 200) < 1) {
      setIsRunning(false);
      return;
    }
    const timer = setTimeout(runGradientStep, 200);
    return () => clearTimeout(timer);
  }, [isRunning, step, ballPosition.x, runGradientStep]);

  const reset = () => {
    setBallPosition({ x: 50, y: getLoss(50) });
    setHistory([]);
    setStep(0);
    setIsRunning(false);
  };

  const currentLoss = getLoss(ballPosition.x);
  const currentGradient = getGradient(ballPosition.x);

  return (
    <div style={{
      width: '100%', minHeight: '650px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ 
          fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>⛰️ Gradient Descent: Finding the Minimum</h2>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Watch the ball roll down to find optimal weights</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px', position: 'relative' }}>
          <svg width="100%" height="300" viewBox="0 0 400 300">
            {[0,1,2,3,4].map(i => (
              <line key={`v${i}`} x1={i*100} y1="20" x2={i*100} y2="260" stroke="#334155" strokeWidth="0.5" />
            ))}
            <path
              d={Array.from({length: 40}, (_, i) => {
                const x = i * 10 + 10;
                const y = 260 - getLoss(x) * 2;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none" stroke="url(#lossGrad)" strokeWidth="3"
            />
            <defs>
              <linearGradient id="lossGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <radialGradient id="ballGrad">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f97316" />
              </radialGradient>
            </defs>
            <line x1="200" y1="20" x2="200" y2="260" stroke="#22c55e" strokeDasharray="4,4" strokeWidth="1" opacity="0.5" />
            <text x="200" y="280" fill="#22c55e" fontSize="11" textAnchor="middle">Optimal</text>
            {history.length > 1 && (
              <path d={history.map((h, i) => `${i === 0 ? 'M' : 'L'} ${h.x} ${260 - h.y * 2}`).join(' ')}
                fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="4,2" opacity="0.7" />
            )}
            <motion.circle cx={ballPosition.x} cy={260 - ballPosition.y * 2} r="12"
              fill="url(#ballGrad)" stroke="#fff" strokeWidth="2"
              animate={{ cx: ballPosition.x, cy: 260 - ballPosition.y * 2 }}
              transition={{ type: 'spring', stiffness: 100 }} />
          </svg>
          <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }}>
            Step: <span style={{ color: '#f97316', fontWeight: 'bold' }}>{step}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Current State</h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Weight:</span>
                <span style={{ color: '#60a5fa', fontFamily: 'monospace' }}>{ballPosition.x.toFixed(1)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Loss:</span>
                <span style={{ color: currentLoss < 60 ? '#22c55e' : '#ef4444', fontFamily: 'monospace' }}>{currentLoss.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Gradient:</span>
                <span style={{ color: '#f97316', fontFamily: 'monospace' }}>{currentGradient.toFixed(4)}</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Learning Rate: {learningRate}</h4>
            <input type="range" min="0.01" max="0.5" step="0.01" value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
              <span>Slow</span><span>Fast</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px', padding: '16px',
          }}>
            <h4 style={{ fontSize: '14px', color: '#22c55e', marginBottom: '8px' }}>📐 The Math</h4>
            <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#86efac' }}>
              w_new = w - α × ∇L(w)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setIsRunning(!isRunning)} style={{
              flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
              background: isRunning ? '#ef4444' : '#22c55e', color: 'white', fontWeight: '600', cursor: 'pointer',
            }}>{isRunning ? '⏸ Pause' : '▶ Start'}</button>
            <button onClick={runGradientStep} disabled={isRunning} style={{
              padding: '12px 16px', borderRadius: '8px', border: 'none',
              background: '#3b82f6', color: 'white', cursor: isRunning ? 'default' : 'pointer', opacity: isRunning ? 0.5 : 1,
            }}>Step</button>
            <button onClick={reset} style={{
              padding: '12px 16px', borderRadius: '8px', border: '1px solid #475569',
              background: 'transparent', color: '#94a3b8', cursor: 'pointer',
            }}>↺</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '3px solid #f97316' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>🎓 How It Works</h4>
        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
          <strong>Goal:</strong> Find weights that minimize loss. <strong>Method:</strong> Move opposite to the gradient (downhill).
          <strong> Learning rate:</strong> Too small = slow. Too large = overshoot.
        </p>
      </div>
    </div>
  );
}
