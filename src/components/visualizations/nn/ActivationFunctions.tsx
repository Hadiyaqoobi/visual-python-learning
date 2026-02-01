"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

type ActivationType = 'step' | 'sigmoid' | 'tanh' | 'relu' | 'leaky_relu';

export default function ActivationFunctions() {
  const [selected, setSelected] = useState<ActivationType>('sigmoid');
  const [inputValue, setInputValue] = useState(0);

  const activations: Record<ActivationType, { fn: (x: number) => number; color: string; formula: string; description: string }> = {
    step: {
      fn: (x) => x >= 0 ? 1 : 0,
      color: '#ef4444',
      formula: 'f(x) = 1 if x ≥ 0, else 0',
      description: 'Original perceptron. Binary output, not differentiable at x=0.',
    },
    sigmoid: {
      fn: (x) => 1 / (1 + Math.exp(-x)),
      color: '#3b82f6',
      formula: 'f(x) = 1 / (1 + e⁻ˣ)',
      description: 'Squashes to (0,1). Good for probabilities. Suffers from vanishing gradients.',
    },
    tanh: {
      fn: (x) => Math.tanh(x),
      color: '#22c55e',
      formula: 'f(x) = tanh(x)',
      description: 'Squashes to (-1,1). Zero-centered. Also has vanishing gradient problem.',
    },
    relu: {
      fn: (x) => Math.max(0, x),
      color: '#f97316',
      formula: 'f(x) = max(0, x)',
      description: 'Most popular! Fast, no vanishing gradient. Can "die" if always negative.',
    },
    leaky_relu: {
      fn: (x) => x >= 0 ? x : 0.1 * x,
      color: '#a855f7',
      formula: 'f(x) = x if x ≥ 0, else 0.1x',
      description: 'Fixes dying ReLU by allowing small negative values.',
    },
  };

  const current = activations[selected];
  const output = current.fn(inputValue);

  const curvePoints = useMemo(() => {
    const points: string[] = [];
    for (let x = -5; x <= 5; x += 0.1) {
      const y = current.fn(x);
      const px = 200 + x * 35;
      const py = 150 - y * 70;
      points.push(`${px},${py}`);
    }
    return points.join(' ');
  }, [selected]);

  return (
    <div style={{
      width: '100%', minHeight: '550px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>⚡ Activation Functions</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Non-linear transformations that enable neural networks to learn complex patterns</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {(Object.keys(activations) as ActivationType[]).map(type => (
          <button key={type} onClick={() => setSelected(type)}
            style={{
              padding: '8px 16px', borderRadius: '20px',
              background: selected === type ? activations[type].color : 'transparent',
              border: `2px solid ${activations[type].color}`,
              color: selected === type ? 'white' : activations[type].color,
              cursor: 'pointer', fontSize: '13px', fontWeight: '500',
            }}>
            {type.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
          <svg width="100%" height="300" viewBox="0 0 400 300">
            <defs>
              <pattern id="grid" width="35" height="35" patternUnits="userSpaceOnUse">
                <path d="M 35 0 L 0 0 0 35" fill="none" stroke="#1e293b" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="400" height="300" fill="url(#grid)" />
            
            <line x1="0" y1="150" x2="400" y2="150" stroke="#475569" strokeWidth="2"/>
            <line x1="200" y1="0" x2="200" y2="300" stroke="#475569" strokeWidth="2"/>
            
            <text x="385" y="145" fill="#94a3b8" fontSize="12">x</text>
            <text x="205" y="15" fill="#94a3b8" fontSize="12">f(x)</text>

            <motion.polyline
              points={curvePoints}
              fill="none"
              stroke={current.color}
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              key={selected}
            />

            <motion.circle
              cx={200 + inputValue * 35}
              cy={150 - output * 70}
              r="8"
              fill={current.color}
              stroke="white"
              strokeWidth="2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Formula</h4>
            <div style={{ fontFamily: 'monospace', fontSize: '14px', color: current.color }}>
              {current.formula}
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Test Input</h4>
            <input type="range" min="-5" max="5" step="0.1" value={inputValue}
              onChange={(e) => setInputValue(parseFloat(e.target.value))} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Input: </span>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{inputValue.toFixed(2)}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Output: </span>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: current.color }}>{output.toFixed(3)}</span>
              </div>
            </div>
          </div>

          <div style={{ 
            background: `${current.color}20`, borderRadius: '12px', padding: '16px',
            border: `1px solid ${current.color}40`,
          }}>
            <p style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.5' }}>
              {current.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
