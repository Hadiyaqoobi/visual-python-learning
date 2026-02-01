"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CrossValidation() {
  const [k, setK] = useState(5);
  const [currentFold, setCurrentFold] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [showAverage, setShowAverage] = useState(false);

  const foldColors = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#ef4444', '#14b8a6', '#f59e0b'];
  
  const generateScore = () => 0.75 + Math.random() * 0.2;

  useEffect(() => {
    if (!isRunning) return;
    if (currentFold >= k) {
      setIsRunning(false);
      setShowAverage(true);
      return;
    }
    const timer = setTimeout(() => {
      setScores(s => [...s, generateScore()]);
      setCurrentFold(f => f + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isRunning, currentFold, k]);

  const reset = () => {
    setCurrentFold(0);
    setScores([]);
    setIsRunning(false);
    setShowAverage(false);
  };

  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  return (
    <div style={{
      width: '100%', minHeight: '650px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ 
          fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🔄 K-Fold Cross-Validation</h2>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Every data point gets to be in the test set exactly once</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px', textAlign: 'center' }}>
            Data Split Visualization (K={k})
          </h3>
          
          {/* Folds visualization */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Array.from({ length: k }, (_, foldIdx) => (
              <motion.div
                key={foldIdx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: foldIdx * 0.1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px',
                  borderRadius: '8px',
                  background: currentFold === foldIdx && isRunning ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  border: currentFold === foldIdx && isRunning ? '2px solid #3b82f6' : '2px solid transparent',
                }}
              >
                <span style={{ fontSize: '12px', color: '#64748b', width: '60px' }}>Fold {foldIdx + 1}</span>
                <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                  {Array.from({ length: k }, (_, blockIdx) => {
                    const isTest = blockIdx === foldIdx;
                    const isCompleted = foldIdx < currentFold;
                    return (
                      <motion.div
                        key={blockIdx}
                        style={{
                          flex: 1,
                          height: '40px',
                          borderRadius: '6px',
                          background: isTest 
                            ? `linear-gradient(135deg, ${foldColors[foldIdx % foldColors.length]}, ${foldColors[(foldIdx + 1) % foldColors.length]})`
                            : 'rgba(100, 116, 139, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: '600',
                          color: isTest ? 'white' : '#64748b',
                          opacity: isCompleted || (foldIdx === currentFold && isRunning) ? 1 : 0.5,
                        }}
                        animate={foldIdx === currentFold && isRunning ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                      >
                        {isTest ? 'TEST' : 'TRAIN'}
                      </motion.div>
                    );
                  })}
                </div>
                <div style={{ width: '60px', textAlign: 'right' }}>
                  {scores[foldIdx] !== undefined && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ color: '#22c55e', fontFamily: 'monospace', fontSize: '14px' }}
                    >
                      {(scores[foldIdx] * 100).toFixed(1)}%
                    </motion.span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Average score */}
          <AnimatePresence>
            {showAverage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '20px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))',
                  borderRadius: '12px',
                  border: '2px solid #22c55e',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Final CV Score (Average)</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#22c55e' }}>
                  {(avgScore * 100).toFixed(1)}%
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  ± {(Math.max(...scores) - Math.min(...scores)) * 50}% variance
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>K = {k} folds</h4>
            <input type="range" min="3" max="7" value={k} disabled={isRunning}
              onChange={(e) => { setK(parseInt(e.target.value)); reset(); }} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
              <span>3 (less reliable)</span><span>7 (more reliable)</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Progress</h4>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ flex: 1, height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #22c55e)', borderRadius: '4px' }}
                  animate={{ width: `${(currentFold / k) * 100}%` }}
                />
              </div>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{currentFold}/{k}</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '12px', padding: '16px',
          }}>
            <h4 style={{ fontSize: '14px', color: '#06b6d4', marginBottom: '8px' }}>💡 Why K-Fold?</h4>
            <ul style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6', paddingLeft: '16px', margin: 0 }}>
              <li>Uses ALL data for both training & testing</li>
              <li>More reliable than single train/test split</li>
              <li>Detects if model is unstable (high variance)</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { reset(); setIsRunning(true); }} disabled={isRunning} style={{
              flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
              background: isRunning ? '#475569' : '#22c55e', color: 'white', fontWeight: '600',
              cursor: isRunning ? 'default' : 'pointer',
            }}>{isRunning ? '🔄 Running...' : '▶ Run CV'}</button>
            <button onClick={reset} style={{
              padding: '12px 16px', borderRadius: '8px', border: '1px solid #475569',
              background: 'transparent', color: '#94a3b8', cursor: 'pointer',
            }}>↺</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '3px solid #06b6d4' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>🎓 Cross-Validation Explained</h4>
        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
          <strong>Problem:</strong> Single train/test split wastes data and may be lucky/unlucky.<br/>
          <strong>Solution:</strong> Split data into K folds. Train on K-1, test on 1. Repeat K times. Average the scores.<br/>
          <strong>Result:</strong> Every sample is tested exactly once. More reliable performance estimate.
        </p>
      </div>
    </div>
  );
}
