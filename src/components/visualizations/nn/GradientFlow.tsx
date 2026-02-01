"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GradientFlow() {
  const [activationType, setActivationType] = useState<'sigmoid' | 'relu'>('sigmoid');
  const [depth, setDepth] = useState(5);
  const [isFlowing, setIsFlowing] = useState(false);
  const [gradients, setGradients] = useState<number[]>([]);

  const sigmoid_grad = 0.25; // max gradient of sigmoid
  const relu_grad = 1.0;

  const simulateGradientFlow = () => {
    setIsFlowing(true);
    setGradients([]);
    
    let grad = 1.0;
    const newGradients: number[] = [grad];
    
    for (let i = 1; i < depth; i++) {
      setTimeout(() => {
        const localGrad = activationType === 'sigmoid' ? sigmoid_grad : relu_grad;
        grad *= localGrad * (0.8 + Math.random() * 0.4); // weight factor
        if (activationType === 'relu' && Math.random() < 0.2) grad *= 0; // dead relu
        newGradients.push(Math.max(grad, 0.001));
        setGradients([...newGradients]);
        
        if (i === depth - 1) {
          setTimeout(() => setIsFlowing(false), 500);
        }
      }, i * 400);
    }
  };

  const reset = () => {
    setGradients([]);
    setIsFlowing(false);
  };

  const layerWidth = Math.min(80, 500 / depth);

  return (
    <div style={{
      width: '100%', minHeight: '600px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🌊 Gradient Flow</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Watch gradients vanish or explode through deep networks</p>
      </div>

      {/* Activation selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => { setActivationType('sigmoid'); reset(); }}
          style={{
            padding: '10px 20px', borderRadius: '8px',
            background: activationType === 'sigmoid' ? '#ef4444' : 'transparent',
            border: '2px solid #ef4444', color: 'white', cursor: 'pointer',
          }}>
          Sigmoid (Vanishing)
        </button>
        <button onClick={() => { setActivationType('relu'); reset(); }}
          style={{
            padding: '10px 20px', borderRadius: '8px',
            background: activationType === 'relu' ? '#22c55e' : 'transparent',
            border: '2px solid #22c55e', color: 'white', cursor: 'pointer',
          }}>
          ReLU (Better)
        </button>
      </div>

      {/* Network depth control */}
      <div style={{ maxWidth: '300px', margin: '0 auto 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Network Depth</span>
          <span style={{ fontSize: '12px' }}>{depth} layers</span>
        </div>
        <input type="range" min="3" max="10" value={depth}
          onChange={(e) => { setDepth(parseInt(e.target.value)); reset(); }}
          style={{ width: '100%' }} />
      </div>

      {/* Gradient visualization */}
      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'end', gap: '8px', height: '200px' }}>
          {Array.from({ length: depth }).map((_, i) => {
            const grad = gradients[depth - 1 - i] || 0;
            const height = Math.min(grad * 180, 180);
            const color = grad < 0.01 ? '#ef4444' : grad > 0.5 ? '#22c55e' : '#fbbf24';
            
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: layerWidth }}>
                <motion.div
                  style={{
                    width: layerWidth - 10,
                    background: `linear-gradient(to top, ${color}, ${color}88)`,
                    borderRadius: '4px 4px 0 0',
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: height || 4 }}
                  transition={{ duration: 0.3 }}
                />
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                  L{depth - i}
                </div>
                {gradients[depth - 1 - i] !== undefined && (
                  <div style={{ fontSize: '9px', color: color }}>
                    {gradients[depth - 1 - i].toFixed(3)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Flow direction arrow */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Output</span>
          <div style={{ flex: 1, height: '2px', background: '#ef4444', margin: '0 12px', position: 'relative' }}>
            <motion.div
              style={{ position: 'absolute', top: '-4px', width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%' }}
              animate={isFlowing ? { left: ['0%', '100%'] } : {}}
              transition={{ duration: 2, repeat: isFlowing ? Infinity : 0 }}
            />
          </div>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Input ←</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={simulateGradientFlow} disabled={isFlowing}
          style={{
            padding: '10px 24px', borderRadius: '8px',
            background: '#f97316', border: 'none', color: 'white',
            fontWeight: 'bold', cursor: 'pointer', opacity: isFlowing ? 0.5 : 1,
          }}>
          {isFlowing ? '⏳ Flowing...' : '▶ Flow Gradients'}
        </button>
        <button onClick={reset}
          style={{ padding: '10px 24px', borderRadius: '8px', background: '#64748b',
            border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
          Reset
        </button>
      </div>

      {/* Stats */}
      {gradients.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '500px', margin: '0 auto 20px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>Initial Gradient</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#22c55e' }}>1.000</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>Final Gradient</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: gradients[gradients.length - 1] < 0.01 ? '#ef4444' : '#22c55e' }}>
              {gradients[gradients.length - 1]?.toFixed(4) || '—'}
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>Reduction</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fbbf24' }}>
              {gradients.length > 0 ? `${((1 - gradients[gradients.length - 1]) * 100).toFixed(1)}%` : '—'}
            </div>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div style={{ padding: '16px', background: activationType === 'sigmoid' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
        borderRadius: '12px', borderLeft: `3px solid ${activationType === 'sigmoid' ? '#ef4444' : '#22c55e'}` }}>
        <h4 style={{ fontSize: '14px', color: activationType === 'sigmoid' ? '#ef4444' : '#22c55e', marginBottom: '8px' }}>
          {activationType === 'sigmoid' ? '⚠️ Vanishing Gradient Problem' : '✅ ReLU Helps!'}
        </h4>
        <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
          {activationType === 'sigmoid' 
            ? "Sigmoid's max gradient is 0.25. After just 4 layers: 0.25⁴ = 0.004. Gradients vanish, early layers can't learn!"
            : "ReLU has gradient of 1 for positive inputs. Gradients flow much better through deep networks (but watch for dead neurons)."}
        </p>
      </div>
    </div>
  );
}
