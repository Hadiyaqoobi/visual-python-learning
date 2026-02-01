"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ForwardPropagation() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(-1);
  const [activations, setActivations] = useState<number[][]>([[0.5, 0.8], [0, 0, 0], [0, 0]]);
  const [showMath, setShowMath] = useState(true);

  const weights = [
    [[0.5, -0.3, 0.8], [0.2, 0.7, -0.4]],
    [[0.6, -0.5], [0.3, 0.8], [-0.2, 0.4]],
  ];
  const biases = [[0.1, -0.2, 0.3], [0.2, -0.1]];

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

  const runForward = () => {
    setIsRunning(true);
    setCurrentLayer(0);
    
    setTimeout(() => {
      const hidden = [0, 0, 0].map((_, j) => {
        const sum = activations[0].reduce((s, a, i) => s + a * weights[0][i][j], 0) + biases[0][j];
        return sigmoid(sum);
      });
      setActivations([activations[0], hidden, [0, 0]]);
      setCurrentLayer(1);
      
      setTimeout(() => {
        const output = [0, 0].map((_, j) => {
          const sum = hidden.reduce((s, a, i) => s + a * weights[1][i][j], 0) + biases[1][j];
          return sigmoid(sum);
        });
        setActivations([activations[0], hidden, output]);
        setCurrentLayer(2);
        
        setTimeout(() => {
          setIsRunning(false);
          setCurrentLayer(-1);
        }, 1000);
      }, 1500);
    }, 1500);
  };

  const reset = () => {
    setActivations([[0.5, 0.8], [0, 0, 0], [0, 0]]);
    setCurrentLayer(-1);
    setIsRunning(false);
  };

  const layers = [2, 3, 2];
  const layerSpacing = 150;
  const neuronSpacing = 60;

  return (
    <div style={{
      width: '100%', minHeight: '650px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>➡️ Forward Propagation</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Watch data flow through the network</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <svg width="550" height="280">
          {layers.slice(0, -1).map((count, layerIdx) => {
            const nextCount = layers[layerIdx + 1];
            const x1 = 75 + layerIdx * layerSpacing;
            const x2 = 75 + (layerIdx + 1) * layerSpacing;
            const isActive = currentLayer === layerIdx + 1;
            
            return Array.from({ length: count }).flatMap((_, n1) => {
              const y1 = 140 - ((count - 1) * neuronSpacing) / 2 + n1 * neuronSpacing;
              return Array.from({ length: nextCount }).map((_, n2) => {
                const y2 = 140 - ((nextCount - 1) * neuronSpacing) / 2 + n2 * neuronSpacing;
                const weight = weights[layerIdx][n1][n2];
                return (
                  <motion.line key={`${layerIdx}-${n1}-${n2}`}
                    x1={x1 + 25} y1={y1} x2={x2 - 25} y2={y2}
                    stroke={isActive ? (weight >= 0 ? '#22c55e' : '#ef4444') : '#475569'}
                    strokeWidth={isActive ? Math.abs(weight) * 3 + 1 : 1}
                    opacity={isActive ? 0.8 : 0.3}
                    animate={isActive ? { strokeDashoffset: [100, 0] } : {}}
                    strokeDasharray={isActive ? "10,5" : "0"}
                    transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                  />
                );
              });
            });
          })}

          {layers.map((count, layerIdx) => {
            const x = 75 + layerIdx * layerSpacing;
            const isActive = currentLayer >= layerIdx;
            const color = layerIdx === 0 ? '#3b82f6' : layerIdx === layers.length - 1 ? '#22c55e' : '#8b5cf6';
            
            return Array.from({ length: count }).map((_, neuronIdx) => {
              const y = 140 - ((count - 1) * neuronSpacing) / 2 + neuronIdx * neuronSpacing;
              const value = activations[layerIdx][neuronIdx];
              
              return (
                <g key={`neuron-${layerIdx}-${neuronIdx}`}>
                  <motion.circle cx={x} cy={y} r="22"
                    fill={isActive ? color : '#1e293b'}
                    stroke={color} strokeWidth="2"
                    animate={currentLayer === layerIdx ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  />
                  <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                    {value.toFixed(2)}
                  </text>
                </g>
              );
            });
          })}

          <text x="75" y="260" textAnchor="middle" fill="#94a3b8" fontSize="12">Input</text>
          <text x="225" y="260" textAnchor="middle" fill="#94a3b8" fontSize="12">Hidden</text>
          <text x="375" y="260" textAnchor="middle" fill="#94a3b8" fontSize="12">Output</text>
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={runForward} disabled={isRunning}
          style={{ padding: '10px 24px', borderRadius: '8px', background: '#22c55e', border: 'none',
            color: 'white', fontWeight: 'bold', cursor: 'pointer', opacity: isRunning ? 0.5 : 1 }}>
          {isRunning ? '⏳ Running...' : '▶ Run Forward Pass'}
        </button>
        <button onClick={reset}
          style={{ padding: '10px 24px', borderRadius: '8px', background: '#64748b', border: 'none',
            color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
          Reset
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        {activations[0].map((val, i) => (
          <div key={i} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Input x{i + 1}</div>
            <input type="range" min="0" max="1" step="0.1" value={val} disabled={isRunning}
              onChange={(e) => {
                const newAct = [...activations];
                newAct[0][i] = parseFloat(e.target.value);
                setActivations(newAct);
              }} style={{ width: '100px' }} />
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#3b82f6' }}>{val.toFixed(1)}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', borderLeft: '3px solid #22c55e' }}>
        <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
          <strong>Forward propagation:</strong> For each layer, compute z = Wx + b, then apply activation a = σ(z).
          Data flows from input → hidden → output.
        </p>
      </div>
    </div>
  );
}
