"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

type LossType = 'mse' | 'mae' | 'cross_entropy';

export default function LossFunctions() {
  const [selected, setSelected] = useState<LossType>('mse');
  const [predicted, setPredicted] = useState(0.7);
  const [actual, setActual] = useState(1);

  const losses: Record<LossType, { fn: (p: number, a: number) => number; color: string; formula: string; name: string; description: string }> = {
    mse: {
      fn: (p, a) => Math.pow(a - p, 2),
      color: '#3b82f6',
      formula: 'L = (y - ŷ)²',
      name: 'Mean Squared Error',
      description: 'Penalizes large errors heavily. Standard for regression.',
    },
    mae: {
      fn: (p, a) => Math.abs(a - p),
      color: '#22c55e',
      formula: 'L = |y - ŷ|',
      name: 'Mean Absolute Error',
      description: 'Linear penalty. More robust to outliers than MSE.',
    },
    cross_entropy: {
      fn: (p, a) => a === 1 ? -Math.log(Math.max(p, 0.001)) : -Math.log(Math.max(1 - p, 0.001)),
      color: '#f97316',
      formula: 'L = -y·log(ŷ) - (1-y)·log(1-ŷ)',
      name: 'Binary Cross-Entropy',
      description: 'Standard for classification. Heavily penalizes confident wrong predictions.',
    },
  };

  const current = losses[selected];
  const loss = current.fn(predicted, actual);

  const curvePoints = useMemo(() => {
    const points: string[] = [];
    for (let p = 0.01; p <= 0.99; p += 0.02) {
      const l = current.fn(p, actual);
      const x = 50 + p * 300;
      const y = 250 - Math.min(l, 5) * 45;
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  }, [selected, actual]);

  return (
    <div style={{
      width: '100%', minHeight: '600px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>📉 Loss Functions</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Measuring how wrong our predictions are</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
        {(Object.keys(losses) as LossType[]).map(type => (
          <button key={type} onClick={() => setSelected(type)}
            style={{
              padding: '8px 16px', borderRadius: '8px',
              background: selected === type ? losses[type].color : 'transparent',
              border: `2px solid ${losses[type].color}`,
              color: 'white', cursor: 'pointer', fontSize: '12px',
            }}>
            {losses[type].name}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
          <svg width="100%" height="280" viewBox="0 0 400 280">
            <defs>
              <linearGradient id="lossGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor={current.color} stopOpacity="0.1" />
                <stop offset="100%" stopColor={current.color} stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Axes */}
            <line x1="50" y1="250" x2="350" y2="250" stroke="#475569" strokeWidth="2" />
            <line x1="50" y1="250" x2="50" y2="30" stroke="#475569" strokeWidth="2" />
            
            <text x="200" y="275" textAnchor="middle" fill="#94a3b8" fontSize="12">Predicted (ŷ)</text>
            <text x="25" y="140" textAnchor="middle" fill="#94a3b8" fontSize="12" transform="rotate(-90, 25, 140)">Loss</text>

            {/* Target marker */}
            <line x1={50 + actual * 300} y1="30" x2={50 + actual * 300} y2="250" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" />
            <text x={50 + actual * 300} y="20" textAnchor="middle" fill="#22c55e" fontSize="11">Target={actual}</text>

            {/* Loss curve */}
            <motion.polyline
              points={curvePoints}
              fill="none"
              stroke={current.color}
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              key={`${selected}-${actual}`}
            />

            {/* Current prediction marker */}
            <motion.circle
              cx={50 + predicted * 300}
              cy={250 - Math.min(loss, 5) * 45}
              r="8"
              fill={current.color}
              stroke="white"
              strokeWidth="2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />

            {/* Prediction line */}
            <line x1={50 + predicted * 300} y1="250" x2={50 + predicted * 300} y2={250 - Math.min(loss, 5) * 45}
              stroke={current.color} strokeWidth="2" strokeDasharray="3,3" />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Formula</div>
            <div style={{ fontFamily: 'monospace', fontSize: '16px', color: current.color }}>{current.formula}</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Predicted (ŷ)</div>
            <input type="range" min="0.01" max="0.99" step="0.01" value={predicted}
              onChange={(e) => setPredicted(parseFloat(e.target.value))} style={{ width: '100%' }} />
            <div style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>{predicted.toFixed(2)}</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Actual (y)</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setActual(0)}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', background: actual === 0 ? '#22c55e' : '#1e293b',
                  border: 'none', color: 'white', cursor: 'pointer' }}>0</button>
              <button onClick={() => setActual(1)}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', background: actual === 1 ? '#22c55e' : '#1e293b',
                  border: 'none', color: 'white', cursor: 'pointer' }}>1</button>
            </div>
          </div>

          <div style={{ background: `${current.color}30`, borderRadius: '12px', padding: '16px', textAlign: 'center',
            border: `2px solid ${current.color}` }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Loss</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: current.color }}>{loss.toFixed(4)}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', padding: '12px', background: `${current.color}20`, borderRadius: '8px', borderLeft: `3px solid ${current.color}` }}>
        <p style={{ fontSize: '13px', color: '#cbd5e1' }}>{current.description}</p>
      </div>
    </div>
  );
}
