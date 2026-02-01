"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NetworkArchitecture() {
  const [layers, setLayers] = useState([3, 4, 4, 2]);
  const [hoveredNeuron, setHoveredNeuron] = useState<{layer: number, neuron: number} | null>(null);

  const layerColors = ['#3b82f6', '#8b5cf6', '#a855f7', '#22c55e'];
  const maxNeurons = 6;
  const layerSpacing = 120;
  const neuronSpacing = 50;

  const addLayer = () => {
    if (layers.length < 6) setLayers([...layers.slice(0, -1), 3, layers[layers.length - 1]]);
  };

  const removeLayer = () => {
    if (layers.length > 2) setLayers([layers[0], ...layers.slice(2)]);
  };

  const updateLayer = (index: number, delta: number) => {
    const newLayers = [...layers];
    newLayers[index] = Math.max(1, Math.min(maxNeurons, newLayers[index] + delta));
    setLayers(newLayers);
  };

  const totalParams = layers.slice(0, -1).reduce((sum, n, i) => sum + n * layers[i + 1] + layers[i + 1], 0);

  return (
    <div style={{
      width: '100%', minHeight: '600px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🏗️ Neural Network Architecture</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Build and explore network structures</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', overflow: 'auto' }}>
        <svg width={layers.length * layerSpacing + 100} height="350" style={{ minWidth: '500px' }}>
          {layers.slice(0, -1).map((neuronCount, layerIdx) => {
            const nextCount = layers[layerIdx + 1];
            const x1 = 50 + layerIdx * layerSpacing;
            const x2 = 50 + (layerIdx + 1) * layerSpacing;
            
            return Array.from({ length: neuronCount }).map((_, n1) => {
              const y1 = 175 - ((neuronCount - 1) * neuronSpacing) / 2 + n1 * neuronSpacing;
              
              return Array.from({ length: nextCount }).map((_, n2) => {
                const y2 = 175 - ((nextCount - 1) * neuronSpacing) / 2 + n2 * neuronSpacing;
                const isHighlighted = hoveredNeuron && 
                  ((hoveredNeuron.layer === layerIdx && hoveredNeuron.neuron === n1) ||
                   (hoveredNeuron.layer === layerIdx + 1 && hoveredNeuron.neuron === n2));
                
                return (
                  <motion.line
                    key={`${layerIdx}-${n1}-${n2}`}
                    x1={x1 + 20} y1={y1} x2={x2 - 20} y2={y2}
                    stroke={isHighlighted ? '#fbbf24' : '#475569'}
                    strokeWidth={isHighlighted ? 2 : 1}
                    opacity={isHighlighted ? 1 : 0.4}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: layerIdx * 0.1 }}
                  />
                );
              });
            });
          })}

          {layers.map((neuronCount, layerIdx) => {
            const x = 50 + layerIdx * layerSpacing;
            const color = layerColors[Math.min(layerIdx, layerColors.length - 1)];
            
            return Array.from({ length: neuronCount }).map((_, neuronIdx) => {
              const y = 175 - ((neuronCount - 1) * neuronSpacing) / 2 + neuronIdx * neuronSpacing;
              const isHovered = hoveredNeuron?.layer === layerIdx && hoveredNeuron?.neuron === neuronIdx;
              
              return (
                <g key={`neuron-${layerIdx}-${neuronIdx}`}
                   onMouseEnter={() => setHoveredNeuron({ layer: layerIdx, neuron: neuronIdx })}
                   onMouseLeave={() => setHoveredNeuron(null)}
                   style={{ cursor: 'pointer' }}>
                  <motion.circle
                    cx={x} cy={y} r={isHovered ? 22 : 18}
                    fill={color}
                    stroke={isHovered ? '#fbbf24' : color}
                    strokeWidth={isHovered ? 3 : 2}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: layerIdx * 0.1 + neuronIdx * 0.05 }}
                  />
                  {isHovered && (
                    <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                      a{neuronIdx + 1}
                    </text>
                  )}
                </g>
              );
            });
          })}

          {layers.map((count, idx) => {
            const x = 50 + idx * layerSpacing;
            const label = idx === 0 ? 'Input' : idx === layers.length - 1 ? 'Output' : `Hidden ${idx}`;
            return (
              <g key={`label-${idx}`}>
                <text x={x} y={320} textAnchor="middle" fill="#94a3b8" fontSize="12">{label}</text>
                <text x={x} y={338} textAnchor="middle" fill="#64748b" fontSize="11">({count} neurons)</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={removeLayer} disabled={layers.length <= 2}
          style={{ padding: '8px 16px', borderRadius: '8px', background: '#ef4444', border: 'none',
            color: 'white', cursor: 'pointer', opacity: layers.length <= 2 ? 0.5 : 1 }}>
          - Layer
        </button>
        <button onClick={addLayer} disabled={layers.length >= 6}
          style={{ padding: '8px 16px', borderRadius: '8px', background: '#22c55e', border: 'none',
            color: 'white', cursor: 'pointer', opacity: layers.length >= 6 ? 0.5 : 1 }}>
          + Layer
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {layers.map((count, idx) => (
          <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '8px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
              {idx === 0 ? 'Input' : idx === layers.length - 1 ? 'Output' : `Hidden ${idx}`}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => updateLayer(idx, -1)} style={{ width: '24px', height: '24px', borderRadius: '4px',
                background: '#475569', border: 'none', color: 'white', cursor: 'pointer' }}>-</button>
              <span style={{ fontWeight: 'bold', minWidth: '20px' }}>{count}</span>
              <button onClick={() => updateLayer(idx, 1)} style={{ width: '24px', height: '24px', borderRadius: '4px',
                background: '#475569', border: 'none', color: 'white', cursor: 'pointer' }}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(59, 130, 246, 0.2)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{layers.length}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Layers</div>
        </div>
        <div style={{ background: 'rgba(139, 92, 246, 0.2)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>{layers.reduce((a, b) => a + b, 0)}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Neurons</div>
        </div>
        <div style={{ background: 'rgba(34, 197, 94, 0.2)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{totalParams}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Parameters</div>
        </div>
      </div>
    </div>
  );
}
