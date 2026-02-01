"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LogisticRegression() {
  const [threshold, setThreshold] = useState(0.5);
  const [boundaryX, setBoundaryX] = useState(150);

  // Data points
  const classA = [
    { x: 50, y: 80 }, { x: 70, y: 120 }, { x: 60, y: 160 },
    { x: 90, y: 100 }, { x: 80, y: 140 }, { x: 100, y: 180 },
    { x: 40, y: 130 }, { x: 110, y: 90 },
  ];
  const classB = [
    { x: 200, y: 80 }, { x: 220, y: 120 }, { x: 240, y: 160 },
    { x: 210, y: 140 }, { x: 250, y: 100 }, { x: 230, y: 180 },
    { x: 260, y: 130 }, { x: 190, y: 170 },
  ];

  // Sigmoid function
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  
  // Get probability based on x position
  const getProb = (x: number) => sigmoid((x - boundaryX) / 30);

  // Classify points
  const classifyPoint = (x: number) => getProb(x) >= threshold;

  // Calculate metrics
  const allPoints = [...classA.map(p => ({ ...p, actual: false })), ...classB.map(p => ({ ...p, actual: true }))];
  const tp = allPoints.filter(p => p.actual && classifyPoint(p.x)).length;
  const tn = allPoints.filter(p => !p.actual && !classifyPoint(p.x)).length;
  const fp = allPoints.filter(p => !p.actual && classifyPoint(p.x)).length;
  const fn = allPoints.filter(p => p.actual && !classifyPoint(p.x)).length;
  const accuracy = (tp + tn) / allPoints.length;

  return (
    <div style={{
      width: '100%', minHeight: '650px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ 
          fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>📊 Logistic Regression: Classification</h2>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Predicts probability of belonging to a class</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Main visualization */}
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px' }}>
          <svg width="100%" height="280" viewBox="0 0 300 250">
            {/* Probability gradient background */}
            <defs>
              <linearGradient id="probGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset={`${(boundaryX / 300) * 100}%`} stopColor="#94a3b8" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="300" height="200" fill="url(#probGradient)" />

            {/* Decision boundary */}
            <motion.line
              x1={boundaryX} y1="0" x2={boundaryX} y2="200"
              stroke="#fbbf24" strokeWidth="3" strokeDasharray="8,4"
              animate={{ x1: boundaryX, x2: boundaryX }}
            />
            <text x={boundaryX} y="215" fill="#fbbf24" fontSize="10" textAnchor="middle">Decision Boundary</text>

            {/* Class A points (blue) */}
            {classA.map((p, i) => {
              const prob = getProb(p.x);
              const predicted = prob >= threshold;
              const correct = !predicted; // Should be Class A (false)
              return (
                <motion.circle
                  key={`a-${i}`}
                  cx={p.x} cy={p.y} r="8"
                  fill="#3b82f6"
                  stroke={correct ? '#22c55e' : '#ef4444'}
                  strokeWidth="3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                />
              );
            })}

            {/* Class B points (orange) */}
            {classB.map((p, i) => {
              const prob = getProb(p.x);
              const predicted = prob >= threshold;
              const correct = predicted; // Should be Class B (true)
              return (
                <motion.circle
                  key={`b-${i}`}
                  cx={p.x} cy={p.y} r="8"
                  fill="#f97316"
                  stroke={correct ? '#22c55e' : '#ef4444'}
                  strokeWidth="3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 + 0.3 }}
                />
              );
            })}

            {/* Sigmoid curve at bottom */}
            <path
              d={Array.from({ length: 60 }, (_, i) => {
                const x = i * 5;
                const prob = getProb(x);
                const y = 240 - prob * 30;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none" stroke="#22c55e" strokeWidth="2"
            />
            <line x1="0" y1={240 - threshold * 30} x2="300" y2={240 - threshold * 30} 
              stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" />
          </svg>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }} />Class A
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f97316' }} />Class B
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #22c55e' }} />Correct
            </span>
          </div>
        </div>

        {/* Controls & Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Threshold control */}
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>
              Threshold: {threshold.toFixed(2)}
            </h4>
            <input type="range" min="0.1" max="0.9" step="0.05" value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))} style={{ width: '100%' }} />
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              If P(Class B) ≥ {threshold.toFixed(2)} → Predict B
            </div>
          </div>

          {/* Boundary control */}
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>
              Boundary Position: {boundaryX}
            </h4>
            <input type="range" min="80" max="220" value={boundaryX}
              onChange={(e) => setBoundaryX(parseInt(e.target.value))} style={{ width: '100%' }} />
          </div>

          {/* Metrics */}
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Metrics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
              <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(34, 197, 94, 0.2)', borderRadius: '6px' }}>
                <div style={{ color: '#22c55e', fontWeight: 'bold' }}>{tp}</div>
                <div style={{ color: '#64748b' }}>True Pos</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '6px' }}>
                <div style={{ color: '#ef4444', fontWeight: 'bold' }}>{fp}</div>
                <div style={{ color: '#64748b' }}>False Pos</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '6px' }}>
                <div style={{ color: '#ef4444', fontWeight: 'bold' }}>{fn}</div>
                <div style={{ color: '#64748b' }}>False Neg</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(34, 197, 94, 0.2)', borderRadius: '6px' }}>
                <div style={{ color: '#22c55e', fontWeight: 'bold' }}>{tn}</div>
                <div style={{ color: '#64748b' }}>True Neg</div>
              </div>
            </div>
            <div style={{ marginTop: '12px', textAlign: 'center', padding: '8px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '6px' }}>
              <div style={{ color: '#60a5fa', fontSize: '18px', fontWeight: 'bold' }}>{(accuracy * 100).toFixed(1)}%</div>
              <div style={{ color: '#64748b', fontSize: '11px' }}>Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '3px solid #ec4899' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>🎓 Logistic Regression</h4>
        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
          <strong>Output:</strong> Probability (0 to 1) via sigmoid function: σ(z) = 1/(1+e⁻ᶻ)<br/>
          <strong>Decision:</strong> If probability ≥ threshold → Class B, else Class A<br/>
          <strong>Training:</strong> Minimizes cross-entropy loss (not MSE like linear regression)
        </p>
      </div>
    </div>
  );
}
