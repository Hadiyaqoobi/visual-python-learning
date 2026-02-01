"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RNNViz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hiddenState, setHiddenState] = useState([0.5, 0.3, 0.7, 0.2]);

  const sequence = ['H', 'E', 'L', 'L', 'O'];
  const outputs = ['E', 'L', 'L', 'O', '!'];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(s => {
          const next = (s + 1) % sequence.length;
          // Update hidden state with some variation
          setHiddenState(h => h.map(v => Math.max(0, Math.min(1, v + (Math.random() - 0.5) * 0.3))));
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const reset = () => {
    setCurrentStep(0);
    setHiddenState([0.5, 0.3, 0.7, 0.2]);
    setIsPlaying(false);
  };

  return (
    <div style={{
      width: '100%', minHeight: '600px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🔄 Recurrent Neural Networks</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Process sequences by maintaining hidden state</p>
      </div>

      {/* Sequence display */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
        {sequence.map((char, i) => (
          <motion.div key={i}
            style={{
              width: '50px', height: '50px', borderRadius: '8px',
              background: i === currentStep ? '#22c55e' : i < currentStep ? '#22c55e40' : '#1e293b',
              border: `2px solid ${i === currentStep ? '#22c55e' : '#334155'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: 'bold',
            }}
            animate={i === currentStep ? { scale: [1, 1.1, 1] } : {}}>
            {char}
          </motion.div>
        ))}
      </div>

      {/* RNN Cell visualization */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
        {/* Previous hidden state */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>Previous State</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {hiddenState.map((v, i) => (
              <div key={i} style={{
                width: '30px', height: '30px', borderRadius: '4px',
                background: `rgba(139, 92, 246, ${v})`,
                border: '1px solid #8b5cf6',
              }} />
            ))}
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>h_{currentStep > 0 ? currentStep - 1 : 't-1'}</div>
        </div>

        {/* Arrow */}
        <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1 }}
          style={{ fontSize: '24px', color: '#8b5cf6' }}>→</motion.div>

        {/* RNN Cell */}
        <motion.div
          style={{
            width: '120px', height: '120px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
          }}
          animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>RNN Cell</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>
            {sequence[currentStep]}
          </div>
          <div style={{ fontSize: '10px', marginTop: '4px', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '4px' }}>
            tanh(Wx + Uh + b)
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1 }}
          style={{ fontSize: '24px', color: '#8b5cf6' }}>→</motion.div>

        {/* New hidden state */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>New State</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {hiddenState.map((v, i) => (
              <motion.div key={i}
                style={{
                  width: '30px', height: '30px', borderRadius: '4px',
                  background: `rgba(34, 197, 94, ${v})`,
                  border: '1px solid #22c55e',
                }}
                animate={{ opacity: [0.5, 1] }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>h_{currentStep}</div>
        </div>
      </div>

      {/* Recurrence arrow */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <svg width="300" height="50" viewBox="0 0 300 50">
          <defs>
            <marker id="arrowRnn" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
            </marker>
          </defs>
          <path d="M 250 10 Q 280 10 280 25 Q 280 40 150 40 Q 20 40 20 25 Q 20 10 50 10"
            fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowRnn)" />
          <text x="150" y="25" textAnchor="middle" fill="#8b5cf6" fontSize="10">state loops back</text>
        </svg>
      </div>

      {/* Output */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Output (next character prediction)</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          {outputs.map((char, i) => (
            <div key={i} style={{
              width: '40px', height: '40px', borderRadius: '8px',
              background: i === currentStep ? '#ef4444' : i < currentStep ? '#ef444440' : '#1e293b',
              border: `2px solid ${i === currentStep ? '#ef4444' : '#334155'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: 'bold',
            }}>
              {i <= currentStep ? char : '?'}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => setIsPlaying(!isPlaying)}
          style={{
            padding: '10px 24px', borderRadius: '8px',
            background: isPlaying ? '#ef4444' : '#22c55e',
            border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer',
          }}>
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button onClick={() => setCurrentStep(s => (s + 1) % sequence.length)}
          disabled={isPlaying}
          style={{
            padding: '10px 24px', borderRadius: '8px',
            background: '#3b82f6', border: 'none', color: 'white',
            fontWeight: 'bold', cursor: 'pointer', opacity: isPlaying ? 0.5 : 1,
          }}>
          Step →
        </button>
        <button onClick={reset}
          style={{
            padding: '10px 24px', borderRadius: '8px',
            background: '#64748b', border: 'none', color: 'white',
            fontWeight: 'bold', cursor: 'pointer',
          }}>
          Reset
        </button>
      </div>

      {/* Info boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '600px', margin: '0 auto' }}>
        {[
          { title: 'RNN', desc: 'Basic recurrence, vanishing gradients', color: '#8b5cf6' },
          { title: 'LSTM', desc: 'Gates control memory, long-term deps', color: '#22c55e' },
          { title: 'GRU', desc: 'Simplified LSTM, fewer parameters', color: '#f97316' },
        ].map((item, i) => (
          <div key={i} style={{
            background: `${item.color}20`, borderRadius: '8px', padding: '12px',
            border: `1px solid ${item.color}40`, textAlign: 'center',
          }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: item.color }}>{item.title}</div>
            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', borderLeft: '3px solid #22c55e' }}>
        <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
          <strong>RNNs</strong> process sequences one step at a time, maintaining a hidden state that
          captures information from previous steps. Great for text, time series, and audio.
        </p>
      </div>
    </div>
  );
}
