"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Regularization() {
  const [lambda, setLambda] = useState(0.5);
  const [regType, setRegType] = useState<'none' | 'L1' | 'L2'>('none');

  // Simulated weights that change with regularization
  const getWeights = () => {
    const baseWeights = [0.8, -0.6, 0.9, -0.3, 0.7, -0.5, 0.4, -0.2];
    if (regType === 'none') return baseWeights;
    
    return baseWeights.map(w => {
      if (regType === 'L1') {
        // L1: Pushes weights to exactly zero (sparsity)
        const shrink = Math.sign(w) * Math.max(0, Math.abs(w) - lambda * 0.5);
        return shrink;
      } else {
        // L2: Shrinks weights proportionally
        return w * (1 - lambda * 0.4);
      }
    });
  };

  const weights = getWeights();
  const nonZeroCount = weights.filter(w => Math.abs(w) > 0.05).length;

  // Generate curve points
  const generateCurve = (complexity: number) => {
    const points = [];
    for (let x = 0; x <= 300; x += 5) {
      const base = 150 - 50 * Math.sin((x / 300) * Math.PI * 2);
      const noise = complexity * 30 * Math.sin(x * 0.1) * Math.cos(x * 0.15);
      points.push({ x, y: base + noise });
    }
    return points;
  };

  const trueSignal = generateCurve(0);
  const fittedCurve = generateCurve(regType === 'none' ? 1 : regType === 'L1' ? 0.3 : 0.2);

  return (
    <div style={{
      width: '100%', minHeight: '650px',
      background: 'linear-gradient(180deg, #0f172a 0%, #4c1d95 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ 
          fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>⚖️ Regularization: Preventing Overfitting</h2>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Add a penalty to keep weights small and models simple</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Model Fit Visualization */}
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px', textAlign: 'center' }}>Model Fit</h3>
          <svg width="100%" height="220" viewBox="0 0 300 200">
            {/* True signal */}
            <path
              d={trueSignal.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
              fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="8,4"
            />
            {/* Fitted curve */}
            <motion.path
              d={fittedCurve.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
              fill="none" stroke="#a855f7" strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              <div style={{ width: '20px', height: '3px', background: '#22c55e' }} />True pattern
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              <div style={{ width: '20px', height: '2px', background: '#a855f7' }} />Model fit
            </span>
          </div>
        </div>

        {/* Weights Visualization */}
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px', textAlign: 'center' }}>
            Model Weights ({nonZeroCount}/8 active)
          </h3>
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'center', gap: '8px', height: '150px' }}>
            {weights.map((w, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <motion.div
                  style={{
                    width: '28px',
                    background: w > 0 
                      ? 'linear-gradient(180deg, #3b82f6, #1d4ed8)'
                      : 'linear-gradient(180deg, #ef4444, #b91c1c)',
                    borderRadius: '4px 4px 0 0',
                  }}
                  animate={{ height: Math.abs(w) * 120 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
                <span style={{ fontSize: '10px', color: '#64748b' }}>w{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '20px' }}>
        {/* Regularization Type */}
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Regularization Type</h4>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['none', 'L1', 'L2'] as const).map(type => (
              <button
                key={type}
                onClick={() => setRegType(type)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  border: regType === type ? '2px solid #a855f7' : '1px solid #475569',
                  background: regType === type ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                  color: regType === type ? '#a855f7' : '#94a3b8',
                  cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                }}
              >
                {type === 'none' ? 'None' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Lambda slider */}
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>
            λ (Strength): {lambda.toFixed(2)}
          </h4>
          <input type="range" min="0" max="1" step="0.05" value={lambda}
            onChange={(e) => setLambda(parseFloat(e.target.value))} 
            disabled={regType === 'none'}
            style={{ width: '100%', opacity: regType === 'none' ? 0.3 : 1 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
            <span>Weak</span><span>Strong</span>
          </div>
        </div>

        {/* Formula */}
        <div style={{
          background: regType === 'L1' ? 'rgba(34, 197, 94, 0.1)' : regType === 'L2' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(100, 116, 139, 0.1)',
          border: `1px solid ${regType === 'L1' ? 'rgba(34, 197, 94, 0.3)' : regType === 'L2' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(100, 116, 139, 0.3)'}`,
          borderRadius: '12px', padding: '16px',
        }}>
          <h4 style={{ fontSize: '14px', color: regType === 'L1' ? '#22c55e' : regType === 'L2' ? '#3b82f6' : '#94a3b8', marginBottom: '8px' }}>
            {regType === 'none' ? '📐 No Penalty' : regType === 'L1' ? '📐 L1 (Lasso)' : '📐 L2 (Ridge)'}
          </h4>
          <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#e2e8f0' }}>
            {regType === 'none' && 'Loss = Error only'}
            {regType === 'L1' && 'Loss + λΣ|wᵢ|'}
            {regType === 'L2' && 'Loss + λΣwᵢ²'}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
            {regType === 'none' && 'Model can overfit freely'}
            {regType === 'L1' && 'Pushes weights to zero (sparse)'}
            {regType === 'L2' && 'Shrinks all weights (smooth)'}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '3px solid #a855f7' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>🎓 Regularization Explained</h4>
        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
          <strong>Problem:</strong> Complex models memorize noise (overfit).<br/>
          <strong>Solution:</strong> Add penalty for large weights to the loss function.<br/>
          <strong>L1 (Lasso):</strong> Creates sparse models - some weights become exactly 0 (feature selection).<br/>
          <strong>L2 (Ridge):</strong> Shrinks all weights - prevents any single weight from dominating.
        </p>
      </div>
    </div>
  );
}
