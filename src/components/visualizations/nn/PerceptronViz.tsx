"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PerceptronViz() {
  const [inputs, setInputs] = useState([0.5, 0.8, 0.3]);
  const [weights, setWeights] = useState([0.4, -0.6, 0.9]);
  const [bias, setBias] = useState(-0.2);
  const [activationType, setActivationType] = useState<'step' | 'sigmoid'>('step');
  
  const weightedSum = inputs.reduce((sum, x, i) => sum + x * weights[i], 0) + bias;
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const step = (x: number) => x >= 0 ? 1 : 0;
  const output = activationType === 'step' ? step(weightedSum) : sigmoid(weightedSum);

  const inputColors = ['#3b82f6', '#22c55e', '#f97316'];

  return (
    <div style={{
      width: '100%', minHeight: '600px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🧠 The Perceptron</h2>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>The fundamental unit of neural networks</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
        {/* Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {inputs.map((input, i) => (
            <motion.div key={i}
              style={{
                width: '80px', height: '60px',
                background: `linear-gradient(135deg, ${inputColors[i]}, ${inputColors[i]}99)`,
                borderRadius: '12px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 20px ${inputColors[i]}40`,
              }}
              whileHover={{ scale: 1.05 }}>
              <span style={{ fontSize: '10px', opacity: 0.8 }}>x{i + 1}</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{input.toFixed(1)}</span>
            </motion.div>
          ))}
        </div>

        {/* Connections */}
        <svg width="150" height="200" style={{ overflow: 'visible' }}>
          {weights.map((w, i) => {
            const startY = 30 + i * 70;
            const endY = 100;
            const thickness = Math.abs(w) * 4 + 1;
            const color = w >= 0 ? '#22c55e' : '#ef4444';
            return (
              <g key={i}>
                <motion.line x1="0" y1={startY} x2="130" y2={endY}
                  stroke={color} strokeWidth={thickness}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                <rect x="50" y={startY - 15 + (endY - startY) / 3} width="50" height="20" rx="4" fill="#1e293b" />
                <text x="75" y={startY - 2 + (endY - startY) / 3} fill={color} fontSize="11" textAnchor="middle" fontWeight="bold">
                  w={w.toFixed(1)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Neuron */}
        <motion.div style={{
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)',
          }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}>
          <span style={{ fontSize: '10px', opacity: 0.8 }}>Σ + b</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{weightedSum.toFixed(2)}</span>
          <span style={{ fontSize: '9px', marginTop: '4px', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
            {activationType}
          </span>
        </motion.div>

        {/* Arrow */}
        <svg width="60" height="40">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24" />
            </marker>
          </defs>
          <line x1="0" y1="20" x2="50" y2="20" stroke="#fbbf24" strokeWidth="3" markerEnd="url(#arrowhead)" />
        </svg>

        {/* Output */}
        <motion.div style={{
            width: '80px', height: '80px', borderRadius: '12px',
            background: output > 0.5 
              ? 'linear-gradient(135deg, #22c55e, #16a34a)'
              : 'linear-gradient(135deg, #ef4444, #dc2626)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: output > 0.5 ? '0 0 30px rgba(34, 197, 94, 0.5)' : '0 0 30px rgba(239, 68, 68, 0.5)',
          }}
          animate={{ scale: output > 0.5 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5 }}>
          <span style={{ fontSize: '10px', opacity: 0.8 }}>Output</span>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{output.toFixed(2)}</span>
        </motion.div>
      </div>

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Inputs</h4>
          {inputs.map((input, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: inputColors[i], fontSize: '12px' }}>x{i + 1}</span>
                <span style={{ fontSize: '12px' }}>{input.toFixed(2)}</span>
              </div>
              <input type="range" min="0" max="1" step="0.1" value={input}
                onChange={(e) => { const n = [...inputs]; n[i] = parseFloat(e.target.value); setInputs(n); }}
                style={{ width: '100%' }} />
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Weights & Bias</h4>
          {weights.map((w, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: w >= 0 ? '#22c55e' : '#ef4444', fontSize: '12px' }}>w{i + 1}</span>
                <span style={{ fontSize: '12px' }}>{w.toFixed(2)}</span>
              </div>
              <input type="range" min="-1" max="1" step="0.1" value={w}
                onChange={(e) => { const n = [...weights]; n[i] = parseFloat(e.target.value); setWeights(n); }}
                style={{ width: '100%' }} />
            </div>
          ))}
          <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#fbbf24', fontSize: '12px' }}>bias</span>
              <span style={{ fontSize: '12px' }}>{bias.toFixed(2)}</span>
            </div>
            <input type="range" min="-1" max="1" step="0.1" value={bias}
              onChange={(e) => setBias(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Activation Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
        {(['step', 'sigmoid'] as const).map(type => (
          <button key={type} onClick={() => setActivationType(type)}
            style={{
              padding: '8px 20px', borderRadius: '8px',
              border: activationType === type ? '2px solid #a855f7' : '1px solid #475569',
              background: activationType === type ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
              color: activationType === type ? '#a855f7' : '#94a3b8',
              cursor: 'pointer', fontSize: '13px',
            }}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Formula */}
      <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '3px solid #a855f7' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '14px', color: '#e2e8f0' }}>
          z = Σ(xᵢ × wᵢ) + b = {inputs.map((x, i) => `${x.toFixed(1)}×${weights[i].toFixed(1)}`).join(' + ')} + {bias.toFixed(1)} = <strong>{weightedSum.toFixed(2)}</strong>
        </p>
        <p style={{ fontFamily: 'monospace', fontSize: '14px', color: '#e2e8f0', marginTop: '4px' }}>
          output = {activationType}({weightedSum.toFixed(2)}) = <strong style={{ color: output > 0.5 ? '#22c55e' : '#ef4444' }}>{output.toFixed(2)}</strong>
        </p>
      </div>
    </div>
  );
}
