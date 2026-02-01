"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function BiasVariance() {
  const [complexity, setComplexity] = useState(3);
  const [showDecomposition, setShowDecomposition] = useState(true);

  const generatePredictions = (comp: number) => {
    const predictions = [];
    const targetX = 200, targetY = 150;
    const bias = Math.max(0, 80 - comp * 15);
    const variance = comp * 12;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const spread = variance * (0.5 + Math.random() * 0.5);
      predictions.push({ x: targetX + bias + Math.cos(angle) * spread, y: targetY + Math.sin(angle) * spread });
    }
    return { predictions, bias, variance };
  };

  const { predictions, bias, variance } = generatePredictions(complexity);
  const totalError = Math.sqrt(bias * bias + variance * variance);
  const avgX = predictions.reduce((sum, p) => sum + p.x, 0) / predictions.length;
  const avgY = predictions.reduce((sum, p) => sum + p.y, 0) / predictions.length;
  const targetX = 200, targetY = 150;

  return (
    <div style={{
      width: '100%', minHeight: '700px',
      background: 'linear-gradient(180deg, #0f172a 0%, #4c1d95 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ 
          fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #f472b6 0%, #c084fc 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🎯 Bias-Variance Tradeoff</h2>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>The fundamental tradeoff every ML practitioner must understand</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px', textAlign: 'center' }}>🎯 Dartboard Analogy</h3>
          <svg width="100%" height="320" viewBox="0 0 400 320">
            <circle cx={targetX} cy={targetY} r="100" fill="none" stroke="#334155" strokeWidth="1" />
            <circle cx={targetX} cy={targetY} r="70" fill="none" stroke="#334155" strokeWidth="1" />
            <circle cx={targetX} cy={targetY} r="40" fill="none" stroke="#334155" strokeWidth="1" />
            <circle cx={targetX} cy={targetY} r="10" fill="#22c55e" />
            <text x={targetX} y={targetY + 4} fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">TRUE</text>

            {predictions.map((p, i) => (
              <motion.circle key={i} cx={p.x} cy={p.y} r="8" fill="#f472b6" stroke="white" strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }} />
            ))}

            <motion.circle cx={avgX} cy={avgY} r="12" fill="#fbbf24" stroke="white" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} />
            <text x={avgX} y={avgY + 4} fill="black" fontSize="8" fontWeight="bold" textAnchor="middle">AVG</text>

            {showDecomposition && bias > 5 && (
              <g>
                <defs><marker id="biasArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" /></marker></defs>
                <line x1={targetX} y1={targetY} x2={avgX} y2={avgY} stroke="#ef4444" strokeWidth="3" markerEnd="url(#biasArrow)" />
                <text x={(targetX + avgX) / 2} y={(targetY + avgY) / 2 - 10} fill="#ef4444" fontSize="11" fontWeight="bold">BIAS</text>
              </g>
            )}

            {showDecomposition && variance > 5 && (
              <circle cx={avgX} cy={avgY} r={variance} fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4,4" opacity="0.7" />
            )}

            <g transform="translate(10, 260)">
              <circle cx="10" cy="10" r="6" fill="#22c55e" /><text x="25" y="14" fill="#94a3b8" fontSize="11">True target</text>
              <circle cx="10" cy="35" r="6" fill="#f472b6" /><text x="25" y="39" fill="#94a3b8" fontSize="11">Predictions</text>
              <circle cx="200" cy="10" r="6" fill="#fbbf24" /><text x="215" y="14" fill="#94a3b8" fontSize="11">Average</text>
            </g>
          </svg>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px', textAlign: 'center' }}>📊 Error Decomposition</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Model Complexity</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#c084fc' }}>{complexity}</span>
            </div>
            <input type="range" min="1" max="6" value={complexity}
              onChange={(e) => setComplexity(parseInt(e.target.value))} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b' }}>
              <span>Simple (underfit)</span><span>Complex (overfit)</span>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#ef4444' }}>Bias²</span>
                <span style={{ fontSize: '12px', color: '#ef4444', fontFamily: 'monospace' }}>{(bias * bias / 100).toFixed(1)}</span>
              </div>
              <div style={{ height: '20px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden' }}>
                <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #ef4444, #f97316)', borderRadius: '10px' }}
                  animate={{ width: `${Math.min(100, bias * bias / 50)}%` }} />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#60a5fa' }}>Variance</span>
                <span style={{ fontSize: '12px', color: '#60a5fa', fontFamily: 'monospace' }}>{(variance * variance / 100).toFixed(1)}</span>
              </div>
              <div style={{ height: '20px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden' }}>
                <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', borderRadius: '10px' }}
                  animate={{ width: `${Math.min(100, variance * variance / 50)}%` }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#c084fc', fontWeight: 'bold' }}>Total Error</span>
                <span style={{ fontSize: '12px', color: '#c084fc', fontFamily: 'monospace' }}>{(totalError * totalError / 100).toFixed(1)}</span>
              </div>
              <div style={{ height: '24px', background: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}>
                <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #c084fc)', borderRadius: '12px' }}
                  animate={{ width: `${Math.min(100, totalError * totalError / 50)}%` }} />
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px', padding: '16px', textAlign: 'center', marginBottom: '16px',
          }}>
            <div style={{ fontSize: '14px', fontFamily: 'monospace', color: '#c084fc' }}>Total Error = Bias² + Variance + Noise</div>
          </div>

          <div style={{
            background: complexity <= 2 ? 'rgba(239, 68, 68, 0.1)' : complexity >= 5 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            border: `1px solid ${complexity <= 2 ? 'rgba(239, 68, 68, 0.3)' : complexity >= 5 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
            borderRadius: '12px', padding: '12px',
          }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold',
              color: complexity <= 2 ? '#ef4444' : complexity >= 5 ? '#60a5fa' : '#22c55e', marginBottom: '4px'
            }}>
              {complexity <= 2 ? '⚠️ Underfitting (High Bias)' : complexity >= 5 ? '⚠️ Overfitting (High Variance)' : '✅ Good Balance'}
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
              {complexity <= 2 ? 'Model too simple. Add more features or use complex model.'
                : complexity >= 5 ? 'Model too complex. Use regularization or simpler model.'
                : 'Model complexity is balanced. Good generalization.'}
            </p>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
        marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px', borderLeft: '3px solid #c084fc',
      }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>🎓 Bias-Variance Tradeoff Explained</h4>
        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
          <strong>Bias:</strong> Error from wrong assumptions. High bias = underfitting.<br/>
          <strong>Variance:</strong> Error from sensitivity to training data. High variance = overfitting.<br/>
          <strong>Tradeoff:</strong> Reducing one often increases the other. Find the sweet spot!
        </p>
      </motion.div>
    </div>
  );
}
