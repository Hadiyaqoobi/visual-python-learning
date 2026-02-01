"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DeepLearningIntro() {
  const [selectedEra, setSelectedEra] = useState(2);

  const eras = [
    { year: '1958', name: 'Perceptron', layers: 1, desc: 'Single layer, linear only', color: '#94a3b8' },
    { year: '1986', name: 'Backprop MLP', layers: 3, desc: '2-3 layers, XOR solved', color: '#3b82f6' },
    { year: '2012', name: 'AlexNet', layers: 8, desc: 'Deep CNNs, ImageNet revolution', color: '#8b5cf6' },
    { year: '2015', name: 'ResNet', layers: 152, desc: 'Skip connections, 152 layers!', color: '#22c55e' },
    { year: '2017', name: 'Transformer', layers: 96, desc: 'Attention is all you need', color: '#f97316' },
  ];

  const current = eras[selectedEra];

  return (
    <div style={{
      width: '100%', minHeight: '600px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🚀 The Deep Learning Revolution</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>From 1 layer to 152+ layers</p>
      </div>

      <div style={{ position: 'relative', marginBottom: '30px', padding: '0 20px' }}>
        <div style={{ position: 'absolute', top: '50%', left: '40px', right: '40px', height: '4px', background: '#334155', borderRadius: '2px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          {eras.map((era, i) => (
            <motion.div key={i}
              onClick={() => setSelectedEra(i)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', zIndex: 1 }}
              whileHover={{ scale: 1.1 }}>
              <motion.div style={{
                width: i === selectedEra ? '24px' : '16px',
                height: i === selectedEra ? '24px' : '16px',
                borderRadius: '50%',
                background: era.color,
                border: i === selectedEra ? '3px solid white' : 'none',
                boxShadow: i === selectedEra ? `0 0 20px ${era.color}` : 'none',
              }} />
              <div style={{ fontSize: '11px', color: i === selectedEra ? 'white' : '#64748b', marginTop: '8px', fontWeight: i === selectedEra ? 'bold' : 'normal' }}>
                {era.year}
              </div>
              <div style={{ fontSize: '10px', color: i === selectedEra ? era.color : '#475569', marginTop: '2px' }}>
                {era.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div key={selectedEra} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px' }}>
          <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>Network Depth</h4>
          <div style={{ display: 'flex', alignItems: 'end', gap: '4px', height: '180px' }}>
            {eras.map((era, i) => {
              const height = Math.min((era.layers / 152) * 160 + 20, 170);
              const isSelected = i === selectedEra;
              return (
                <motion.div key={i}
                  style={{
                    flex: 1,
                    background: isSelected ? era.color : '#334155',
                    borderRadius: '4px 4px 0 0',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'flex-end',
                    paddingBottom: '8px',
                    opacity: isSelected ? 1 : 0.5,
                  }}
                  animate={{ height }}
                  transition={{ duration: 0.5 }}>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'white' }}>
                    {era.layers}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: '#64748b' }}>Layers</div>
        </div>

        <div style={{ background: `${current.color}20`, borderRadius: '12px', padding: '20px', border: `2px solid ${current.color}` }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{current.year}</div>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: current.color, marginBottom: '8px' }}>{current.name}</h3>
          <p style={{ fontSize: '14px', color: '#e2e8f0', marginBottom: '16px' }}>{current.desc}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: current.color }}>{current.layers}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Layers</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: current.color }}>
                {current.layers === 1 ? '~10' : current.layers < 10 ? '~1K' : current.layers < 100 ? '~60M' : '~100M+'}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Parameters</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px' }}>
        <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>What Made Deep Learning Work?</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { icon: '🖥️', title: 'GPUs', desc: 'Parallel computation' },
            { icon: '📊', title: 'Big Data', desc: 'Millions of examples' },
            { icon: '⚡', title: 'ReLU', desc: 'Better gradients' },
            { icon: '🔗', title: 'Skip Connections', desc: 'Train 100+ layers' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{item.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#e2e8f0' }}>{item.title}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
