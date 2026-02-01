"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function MLPIntro() {
  const [input1, setInput1] = useState(0);
  const [input2, setInput2] = useState(1);
  const [showIntermediate, setShowIntermediate] = useState(true);

  const h1_w = [1, 1], h1_b = -0.5;
  const h2_w = [-1, -1], h2_b = 1.5;
  const out_w = [1, 1], out_b = -1.5;

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x * 5));
  const step = (x: number) => x > 0.5 ? 1 : 0;

  const h1_raw = input1 * h1_w[0] + input2 * h1_w[1] + h1_b;
  const h2_raw = input1 * h2_w[0] + input2 * h2_w[1] + h2_b;
  const h1 = sigmoid(h1_raw);
  const h2 = sigmoid(h2_raw);
  const out_raw = h1 * out_w[0] + h2 * out_w[1] + out_b;
  const output = sigmoid(out_raw);
  const prediction = step(output);
  
  const expected = (input1 === 1) !== (input2 === 1) ? 1 : 0;
  const isCorrect = prediction === expected;

  const nodeStyle = (value: number, active: boolean) => ({
    width: '60px', height: '60px', borderRadius: '50%',
    background: active 
      ? `linear-gradient(135deg, ${value > 0.5 ? '#22c55e' : '#3b82f6'}, ${value > 0.5 ? '#16a34a' : '#2563eb'})`
      : 'rgba(100,100,100,0.3)',
    display: 'flex', flexDirection: 'column' as const,
    alignItems: 'center', justifyContent: 'center',
    boxShadow: active ? `0 0 20px ${value > 0.5 ? '#22c55e50' : '#3b82f650'}` : 'none',
  });

  return (
    <div style={{
      width: '100%', minHeight: '600px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🧠 Multi-Layer Perceptron</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Solving XOR with a hidden layer</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
        {[[0,0], [0,1], [1,0], [1,1]].map(([a, b]) => {
          const xor = (a === 1) !== (b === 1) ? 1 : 0;
          const isSelected = input1 === a && input2 === b;
          return (
            <button key={`${a}-${b}`}
              onClick={() => { setInput1(a); setInput2(b); }}
              style={{
                padding: '8px 16px', borderRadius: '8px',
                background: isSelected ? '#3b82f6' : 'rgba(0,0,0,0.3)',
                border: `2px solid ${isSelected ? '#3b82f6' : '#475569'}`,
                color: 'white', cursor: 'pointer', fontSize: '13px',
              }}>
              [{a}, {b}] → {xor}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Input</div>
          <motion.div style={nodeStyle(input1, true)} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1, repeat: Infinity }}>
            <span style={{ fontSize: '9px', opacity: 0.7 }}>x₁</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{input1}</span>
          </motion.div>
          <motion.div style={nodeStyle(input2, true)} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}>
            <span style={{ fontSize: '9px', opacity: 0.7 }}>x₂</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{input2}</span>
          </motion.div>
        </div>

        <svg width="60" height="180" style={{ overflow: 'visible' }}>
          <line x1="0" y1="40" x2="60" y2="50" stroke="#22c55e" strokeWidth="2" />
          <line x1="0" y1="140" x2="60" y2="50" stroke="#22c55e" strokeWidth="2" />
          <line x1="0" y1="40" x2="60" y2="130" stroke="#ef4444" strokeWidth="2" />
          <line x1="0" y1="140" x2="60" y2="130" stroke="#ef4444" strokeWidth="2" />
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Hidden</div>
          <motion.div style={nodeStyle(h1, showIntermediate)}>
            <span style={{ fontSize: '9px', opacity: 0.7 }}>h₁</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{h1.toFixed(2)}</span>
          </motion.div>
          <motion.div style={nodeStyle(h2, showIntermediate)}>
            <span style={{ fontSize: '9px', opacity: 0.7 }}>h₂</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{h2.toFixed(2)}</span>
          </motion.div>
        </div>

        <svg width="60" height="180" style={{ overflow: 'visible' }}>
          <line x1="0" y1="50" x2="60" y2="90" stroke="#22c55e" strokeWidth="2" />
          <line x1="0" y1="130" x2="60" y2="90" stroke="#22c55e" strokeWidth="2" />
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Output</div>
          <motion.div 
            style={{
              ...nodeStyle(output, true),
              width: '80px', height: '80px',
              background: isCorrect 
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : 'linear-gradient(135deg, #ef4444, #dc2626)',
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5 }}>
            <span style={{ fontSize: '9px', opacity: 0.7 }}>XOR</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{prediction}</span>
          </motion.div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: isCorrect ? '#22c55e' : '#ef4444' }}>
            {isCorrect ? '✓ Correct!' : '✗ Wrong'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={showIntermediate} onChange={(e) => setShowIntermediate(e.target.checked)} />
          <span style={{ fontSize: '13px' }}>Show intermediate values</span>
        </label>
      </div>

      <div style={{ padding: '16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', borderLeft: '3px solid #22c55e' }}>
        <h4 style={{ fontSize: '14px', color: '#22c55e', marginBottom: '8px' }}>🎓 How It Works</h4>
        <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
          <strong>XOR = (x₁ OR x₂) AND NOT(x₁ AND x₂)</strong><br/>
          The hidden layer creates two intermediate features: one OR-like neuron and one NAND-like neuron.
          The output combines them with AND. This is the power of depth!
        </p>
      </div>
    </div>
  );
}
