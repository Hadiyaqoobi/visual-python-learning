"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CNNProjectViz() {
  const [selectedClass, setSelectedClass] = useState(0);
  const [showArchitecture, setShowArchitecture] = useState(true);

  const classes = [
    { name: 'airplane', emoji: '✈️', accuracy: 89 },
    { name: 'automobile', emoji: '🚗', accuracy: 92 },
    { name: 'bird', emoji: '🐦', accuracy: 78 },
    { name: 'cat', emoji: '🐱', accuracy: 72 },
    { name: 'deer', emoji: '🦌', accuracy: 81 },
    { name: 'dog', emoji: '🐶', accuracy: 74 },
    { name: 'frog', emoji: '🐸', accuracy: 88 },
    { name: 'horse', emoji: '🐴', accuracy: 85 },
    { name: 'ship', emoji: '🚢', accuracy: 91 },
    { name: 'truck', emoji: '🚚', accuracy: 90 },
  ];

  const architecture = [
    { type: 'Input', size: '3×32×32', color: '#94a3b8' },
    { type: 'Conv2d', size: '32×32×32', color: '#3b82f6' },
    { type: 'MaxPool', size: '32×16×16', color: '#06b6d4' },
    { type: 'Conv2d', size: '64×16×16', color: '#3b82f6' },
    { type: 'MaxPool', size: '64×8×8', color: '#06b6d4' },
    { type: 'Flatten', size: '4096', color: '#8b5cf6' },
    { type: 'Linear', size: '512', color: '#22c55e' },
    { type: 'Linear', size: '10', color: '#22c55e' },
  ];

  const overallAccuracy = (classes.reduce((sum, c) => sum + c.accuracy, 0) / classes.length).toFixed(1);

  return (
    <div style={{
      width: '100%', minHeight: '700px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🖼️ CIFAR-10 CNN Classifier</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          Image classification with convolutional neural networks
        </p>
      </div>

      {/* Overall stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px' }}>
        <div style={{ textAlign: 'center', padding: '16px 24px', background: 'rgba(34, 197, 94, 0.2)', borderRadius: '12px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22c55e' }}>{overallAccuracy}%</div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Overall Accuracy</div>
        </div>
        <div style={{ textAlign: 'center', padding: '16px 24px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>10</div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Classes</div>
        </div>
        <div style={{ textAlign: 'center', padding: '16px 24px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '12px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>~500K</div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Parameters</div>
        </div>
      </div>

      {/* Class selector */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px', textAlign: 'center' }}>
          Per-Class Accuracy (click to select)
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {classes.map((cls, i) => (
            <motion.button
              key={i}
              onClick={() => setSelectedClass(i)}
              whileHover={{ scale: 1.1 }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: selectedClass === i ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255,255,255,0.1)',
                border: selectedClass === i ? '2px solid #8b5cf6' : '2px solid transparent',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '24px' }}>{cls.emoji}</span>
              <span style={{ fontSize: '10px' }}>{cls.accuracy}%</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected class detail */}
      <motion.div
        key={selectedClass}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '48px' }}>{classes[selectedClass].emoji}</span>
        <h3 style={{ fontSize: '20px', marginTop: '8px', textTransform: 'capitalize' }}>
          {classes[selectedClass].name}
        </h3>
        <div style={{ marginTop: '12px' }}>
          <div style={{ 
            width: '100%', 
            background: '#1e293b', 
            borderRadius: '8px', 
            height: '24px',
            overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${classes[selectedClass].accuracy}%` }}
              transition={{ duration: 0.5 }}
              style={{
                height: '100%',
                background: classes[selectedClass].accuracy > 85 ? '#22c55e' : 
                           classes[selectedClass].accuracy > 75 ? '#eab308' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {classes[selectedClass].accuracy}%
            </motion.div>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
          {classes[selectedClass].accuracy > 85 ? 'Excellent performance!' :
           classes[selectedClass].accuracy > 75 ? 'Good, but room for improvement' :
           'Challenging class - consider more augmentation'}
        </p>
      </motion.div>

      {/* Architecture toggle */}
      <button
        onClick={() => setShowArchitecture(!showArchitecture)}
        style={{
          width: '100%', padding: '10px', borderRadius: '8px',
          background: 'rgba(255,255,255,0.1)', border: '1px solid #334155',
          color: 'white', cursor: 'pointer', marginBottom: '12px',
        }}
      >
        {showArchitecture ? '▼' : '▶'} CNN Architecture
      </button>

      {showArchitecture && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '12px',
            padding: '16px',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
            {architecture.map((layer, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: `${layer.color}30`,
                    border: `2px solid ${layer.color}`,
                    textAlign: 'center',
                    minWidth: '70px',
                  }}
                >
                  <div style={{ fontSize: '10px', color: layer.color }}>{layer.type}</div>
                  <div style={{ fontSize: '9px', color: '#94a3b8' }}>{layer.size}</div>
                </motion.div>
                {i < architecture.length - 1 && <span style={{ color: '#64748b' }}>→</span>}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
