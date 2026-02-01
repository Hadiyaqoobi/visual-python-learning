"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CNNViz() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const layers = [
    { name: 'Input', type: 'input', size: '224×224×3', color: '#3b82f6', width: 80, desc: 'Raw image pixels (RGB)' },
    { name: 'Conv1', type: 'conv', size: '112×112×64', color: '#8b5cf6', width: 70, desc: '64 filters detect edges' },
    { name: 'Pool1', type: 'pool', size: '56×56×64', color: '#06b6d4', width: 50, desc: 'Downsample 2x' },
    { name: 'Conv2', type: 'conv', size: '56×56×128', color: '#8b5cf6', width: 55, desc: '128 filters detect textures' },
    { name: 'Pool2', type: 'pool', size: '28×28×128', color: '#06b6d4', width: 40, desc: 'Downsample 2x' },
    { name: 'Flatten', type: 'flatten', size: '50176', color: '#f59e0b', width: 20, desc: 'Reshape to 1D' },
    { name: 'FC', type: 'fc', size: '4096', color: '#22c55e', width: 25, desc: 'Fully connected' },
    { name: 'Output', type: 'output', size: '1000', color: '#ef4444', width: 30, desc: 'Class probabilities' },
  ];

  return (
    <div style={{
      width: '100%', minHeight: '600px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🖼️ Convolutional Neural Network</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>How CNNs process images layer by layer</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '24px', overflowX: 'auto', padding: '20px 0' }}>
        {layers.map((layer, i) => (
          <motion.div key={i}
            onMouseEnter={() => setActiveLayer(i)}
            onMouseLeave={() => setActiveLayer(null)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
            whileHover={{ scale: 1.05 }}>
            <motion.div style={{
              width: layer.width,
              height: layer.width * 1.2,
              background: `linear-gradient(135deg, ${layer.color}, ${layer.color}88)`,
              borderRadius: '4px',
              border: activeLayer === i ? '2px solid white' : `2px solid ${layer.color}`,
              boxShadow: activeLayer === i ? `0 0 20px ${layer.color}` : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}
              animate={{ scale: activeLayer === i ? 1.1 : 1 }}>
              <div style={{
                position: 'absolute', top: '-4px', right: '-4px',
                width: '100%', height: '100%',
                background: `${layer.color}44`,
                borderRadius: '4px',
                zIndex: -1,
              }} />
              <span style={{ fontSize: '8px', fontWeight: 'bold', textAlign: 'center', padding: '2px' }}>
                {layer.type === 'conv' && '⊛'}
                {layer.type === 'pool' && '↓'}
                {layer.type === 'fc' && '●'}
              </span>
            </motion.div>
            
            <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '8px', textAlign: 'center' }}>
              {layer.name}
            </div>
            <div style={{ fontSize: '8px', color: '#64748b', textAlign: 'center' }}>
              {layer.size}
            </div>
          </motion.div>
        ))}
      </div>

      {activeLayer !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: `${layers[activeLayer].color}20`,
            border: `2px solid ${layers[activeLayer].color}`,
            borderRadius: '12px', padding: '16px', marginBottom: '20px',
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: layers[activeLayer].color }}>
                {layers[activeLayer].name}
              </h4>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>{layers[activeLayer].desc}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Output Shape</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                {layers[activeLayer].size}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '20px' }}>
        {[
          { color: '#8b5cf6', label: 'Convolution', icon: '⊛' },
          { color: '#06b6d4', label: 'Pooling', icon: '↓' },
          { color: '#22c55e', label: 'Fully Connected', icon: '●' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '20px', height: '20px', background: item.color, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
              {item.icon}
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
        <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>What Each Layer Learns</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {[
            { layer: 'Early', learns: 'Edges, Colors', emoji: '📐' },
            { layer: 'Middle', learns: 'Textures, Patterns', emoji: '🔲' },
            { layer: 'Deep', learns: 'Parts, Shapes', emoji: '👁️' },
            { layer: 'Final', learns: 'Objects, Concepts', emoji: '🐕' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '32px', marginBottom: '4px' }}>{item.emoji}</div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#e2e8f0' }}>{item.layer}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>{item.learns}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
