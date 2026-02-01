"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BackpropagationViz() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = [
    { title: "Forward Pass", desc: "Compute predictions layer by layer", activeLayer: 'forward', gradient: [] },
    { title: "Compute Loss", desc: "L = (y - ŷ)² = (1 - 0.73)² = 0.073", activeLayer: 'loss', gradient: [] },
    { title: "Output Gradient", desc: "∂L/∂ŷ = -2(y - ŷ) = -0.54", activeLayer: 'output', gradient: [2] },
    { title: "Hidden→Output Weights", desc: "∂L/∂w = ∂L/∂ŷ × ∂ŷ/∂z × h", activeLayer: 'weights2', gradient: [1, 2] },
    { title: "Hidden Gradient", desc: "∂L/∂h = ∂L/∂ŷ × ∂ŷ/∂z × w", activeLayer: 'hidden', gradient: [1] },
    { title: "Input→Hidden Weights", desc: "∂L/∂w = ∂L/∂h × ∂h/∂z × x", activeLayer: 'weights1', gradient: [0, 1] },
    { title: "Update Weights", desc: "w_new = w_old - α × ∂L/∂w", activeLayer: 'update', gradient: [0, 1, 2] },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setStep(s => (s + 1) % steps.length);
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const currentStep = steps[step];
  const layers = [2, 3, 1];
  const layerSpacing = 140;
  const neuronSpacing = 55;

  const getLayerColor = (layerIdx: number) => {
    if (currentStep.gradient.includes(layerIdx)) return '#ef4444';
    if (currentStep.activeLayer === 'forward') return '#22c55e';
    return '#475569';
  };

  return (
    <div style={{
      width: '100%', minHeight: '650px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>⬅️ Backpropagation</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>The chain rule in action - gradients flow backward</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
        {steps.map((_, i) => (
          <div key={i} onClick={() => setStep(i)}
            style={{
              width: '12px', height: '12px', borderRadius: '50%',
              background: i === step ? '#f97316' : i < step ? '#22c55e' : '#475569',
              cursor: 'pointer', transition: 'all 0.3s',
            }} />
        ))}
      </div>

      {/* Current step info */}
      <motion.div key={step} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f97316', marginBottom: '4px' }}>
          Step {step + 1}: {currentStep.title}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '14px', color: '#e2e8f0' }}>{currentStep.desc}</div>
      </motion.div>

      {/* Network visualization */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <svg width="500" height="250">
          {/* Backward arrows */}
          {currentStep.gradient.length > 0 && (
            <defs>
              <marker id="backArrow" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="10 0, 10 7, 0 3.5" fill="#ef4444" />
              </marker>
            </defs>
          )}

          {/* Connections */}
          {layers.slice(0, -1).map((count, layerIdx) => {
            const nextCount = layers[layerIdx + 1];
            const x1 = 100 + layerIdx * layerSpacing;
            const x2 = 100 + (layerIdx + 1) * layerSpacing;
            const isGradientFlow = currentStep.gradient.includes(layerIdx) && currentStep.gradient.includes(layerIdx + 1);
            const isWeightUpdate = currentStep.activeLayer === `weights${layerIdx + 1}` || currentStep.activeLayer === 'update';
            
            return Array.from({ length: count }).flatMap((_, n1) => {
              const y1 = 125 - ((count - 1) * neuronSpacing) / 2 + n1 * neuronSpacing;
              return Array.from({ length: nextCount }).map((_, n2) => {
                const y2 = 125 - ((nextCount - 1) * neuronSpacing) / 2 + n2 * neuronSpacing;
                return (
                  <g key={`${layerIdx}-${n1}-${n2}`}>
                    <motion.line
                      x1={x1 + 22} y1={y1} x2={x2 - 22} y2={y2}
                      stroke={isWeightUpdate ? '#fbbf24' : isGradientFlow ? '#ef4444' : '#475569'}
                      strokeWidth={isWeightUpdate ? 3 : isGradientFlow ? 2 : 1}
                      opacity={isWeightUpdate || isGradientFlow ? 0.8 : 0.3}
                    />
                    {isGradientFlow && (
                      <motion.line
                        x1={x2 - 30} y1={y2} x2={x1 + 30} y2={y1}
                        stroke="#ef4444" strokeWidth="2"
                        markerEnd="url(#backArrow)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </g>
                );
              });
            });
          })}

          {/* Neurons */}
          {layers.map((count, layerIdx) => {
            const x = 100 + layerIdx * layerSpacing;
            const isActive = currentStep.gradient.includes(layerIdx) || 
              (currentStep.activeLayer === 'forward' || currentStep.activeLayer === 'update');
            const color = currentStep.gradient.includes(layerIdx) ? '#ef4444' : 
              layerIdx === 0 ? '#3b82f6' : layerIdx === layers.length - 1 ? '#22c55e' : '#8b5cf6';
            
            return Array.from({ length: count }).map((_, neuronIdx) => {
              const y = 125 - ((count - 1) * neuronSpacing) / 2 + neuronIdx * neuronSpacing;
              return (
                <motion.circle key={`n-${layerIdx}-${neuronIdx}`}
                  cx={x} cy={y} r="20"
                  fill={isActive ? color : '#1e293b'}
                  stroke={color} strokeWidth="2"
                  animate={currentStep.gradient.includes(layerIdx) ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: currentStep.gradient.includes(layerIdx) ? Infinity : 0 }}
                />
              );
            });
          })}

          {/* Loss box */}
          <rect x="400" y="105" width="60" height="40" rx="8"
            fill={currentStep.activeLayer === 'loss' ? '#ef4444' : '#1e293b'}
            stroke="#ef4444" strokeWidth="2" />
          <text x="430" y="130" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Loss</text>

          {/* Arrow to loss */}
          <line x1="340" y1="125" x2="395" y2="125" stroke="#475569" strokeWidth="2" markerEnd="url(#backArrow)" />

          {/* Labels */}
          <text x="100" y="220" textAnchor="middle" fill="#94a3b8" fontSize="11">Input</text>
          <text x="240" y="220" textAnchor="middle" fill="#94a3b8" fontSize="11">Hidden</text>
          <text x="380" y="220" textAnchor="middle" fill="#94a3b8" fontSize="11">Output</text>
        </svg>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))}
          style={{ padding: '8px 16px', borderRadius: '8px', background: '#475569', border: 'none', color: 'white', cursor: 'pointer' }}>
          ← Prev
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)}
          style={{ padding: '8px 24px', borderRadius: '8px', background: isPlaying ? '#ef4444' : '#22c55e',
            border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button onClick={() => setStep(s => (s + 1) % steps.length)}
          style={{ padding: '8px 16px', borderRadius: '8px', background: '#475569', border: 'none', color: 'white', cursor: 'pointer' }}>
          Next →
        </button>
      </div>

      {/* Speed control */}
      <div style={{ maxWidth: '300px', margin: '0 auto 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Speed</span>
          <span style={{ fontSize: '12px' }}>{(speed / 1000).toFixed(1)}s</span>
        </div>
        <input type="range" min="500" max="3000" step="100" value={speed}
          onChange={(e) => setSpeed(parseInt(e.target.value))} style={{ width: '100%' }} />
      </div>

      {/* Chain rule explanation */}
      <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', borderLeft: '3px solid #ef4444' }}>
        <h4 style={{ fontSize: '14px', color: '#ef4444', marginBottom: '8px' }}>🔗 The Chain Rule</h4>
        <p style={{ fontSize: '13px', color: '#cbd5e1', fontFamily: 'monospace' }}>
          ∂L/∂w = ∂L/∂ŷ × ∂ŷ/∂z × ∂z/∂w
        </p>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
          Gradients flow backward through the network, multiplying local gradients at each step.
        </p>
      </div>
    </div>
  );
}
