"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PoolingViz() {
  const [poolType, setPoolType] = useState<'max' | 'avg'>('max');
  const [activeQuadrant, setActiveQuadrant] = useState<number | null>(null);

  // 4x4 input
  const input = [
    [12, 20, 30, 0],
    [8, 12, 2, 0],
    [34, 70, 37, 4],
    [112, 100, 25, 12],
  ];

  // Compute pooled output (2x2 with stride 2)
  const computePool = (qx: number, qy: number) => {
    const values = [
      input[qy * 2][qx * 2],
      input[qy * 2][qx * 2 + 1],
      input[qy * 2 + 1][qx * 2],
      input[qy * 2 + 1][qx * 2 + 1],
    ];
    if (poolType === 'max') {
      return Math.max(...values);
    } else {
      return Math.round(values.reduce((a, b) => a + b, 0) / 4);
    }
  };

  const output = [
    [computePool(0, 0), computePool(1, 0)],
    [computePool(0, 1), computePool(1, 1)],
  ];

  const cellSize = 50;

  const getQuadrant = (x: number, y: number) => {
    return Math.floor(y / 2) * 2 + Math.floor(x / 2);
  };

  const isInActiveQuadrant = (x: number, y: number) => {
    if (activeQuadrant === null) return false;
    const qx = activeQuadrant % 2;
    const qy = Math.floor(activeQuadrant / 2);
    return x >= qx * 2 && x < qx * 2 + 2 && y >= qy * 2 && y < qy * 2 + 2;
  };

  const isMaxInQuadrant = (x: number, y: number, qx: number, qy: number) => {
    if (poolType !== 'max') return false;
    const values = [
      { v: input[qy * 2][qx * 2], x: qx * 2, y: qy * 2 },
      { v: input[qy * 2][qx * 2 + 1], x: qx * 2 + 1, y: qy * 2 },
      { v: input[qy * 2 + 1][qx * 2], x: qx * 2, y: qy * 2 + 1 },
      { v: input[qy * 2 + 1][qx * 2 + 1], x: qx * 2 + 1, y: qy * 2 + 1 },
    ];
    const max = values.reduce((a, b) => a.v > b.v ? a : b);
    return max.x === x && max.y === y;
  };

  return (
    <div style={{
      width: '100%', minHeight: '550px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>↓ Pooling Layers</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Downsample while keeping important information</p>
      </div>

      {/* Pool type selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => setPoolType('max')}
          style={{
            padding: '10px 24px', borderRadius: '8px',
            background: poolType === 'max' ? '#22c55e' : 'transparent',
            border: '2px solid #22c55e', color: 'white', cursor: 'pointer',
          }}>
          Max Pooling
        </button>
        <button onClick={() => setPoolType('avg')}
          style={{
            padding: '10px 24px', borderRadius: '8px',
            background: poolType === 'avg' ? '#3b82f6' : 'transparent',
            border: '2px solid #3b82f6', color: 'white', cursor: 'pointer',
          }}>
          Average Pooling
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginBottom: '24px' }}>
        {/* Input */}
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textAlign: 'center' }}>Input (4×4)</div>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '4px' }}>
            {input.map((row, y) => (
              <div key={y} style={{ display: 'flex' }}>
                {row.map((val, x) => {
                  const quadrant = getQuadrant(x, y);
                  const isActive = isInActiveQuadrant(x, y);
                  const isMax = activeQuadrant !== null && isMaxInQuadrant(x, y, activeQuadrant % 2, Math.floor(activeQuadrant / 2));
                  const bgColor = isMax ? '#22c55e' : isActive ? (poolType === 'max' ? '#22c55e40' : '#3b82f640') : '#1e293b';
                  
                  return (
                    <motion.div key={x}
                      onMouseEnter={() => setActiveQuadrant(quadrant)}
                      onMouseLeave={() => setActiveQuadrant(null)}
                      style={{
                        width: cellSize, height: cellSize,
                        background: bgColor,
                        border: isActive ? `2px solid ${poolType === 'max' ? '#22c55e' : '#3b82f6'}` : '1px solid #334155',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', fontWeight: isMax ? 'bold' : 'normal',
                        cursor: 'pointer',
                      }}
                      animate={isMax ? { scale: [1, 1.1, 1] } : {}}>
                      {val}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>2×2, stride 2</div>
          <div style={{ fontSize: '32px', color: poolType === 'max' ? '#22c55e' : '#3b82f6' }}>→</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            {poolType === 'max' ? 'take max' : 'take avg'}
          </div>
        </div>

        {/* Output */}
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textAlign: 'center' }}>Output (2×2)</div>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '4px' }}>
            {output.map((row, y) => (
              <div key={y} style={{ display: 'flex' }}>
                {row.map((val, x) => {
                  const quadrant = y * 2 + x;
                  const isActive = activeQuadrant === quadrant;
                  return (
                    <motion.div key={x}
                      onMouseEnter={() => setActiveQuadrant(quadrant)}
                      onMouseLeave={() => setActiveQuadrant(null)}
                      style={{
                        width: cellSize, height: cellSize,
                        background: isActive ? (poolType === 'max' ? '#22c55e' : '#3b82f6') : '#1e293b',
                        border: `2px solid ${poolType === 'max' ? '#22c55e' : '#3b82f6'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                      animate={isActive ? { scale: 1.1 } : { scale: 1 }}>
                      {val}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '600px', margin: '0 auto 20px' }}>
        <div style={{ background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', padding: '16px', border: '1px solid #22c55e40' }}>
          <h4 style={{ fontSize: '14px', color: '#22c55e', marginBottom: '8px' }}>Max Pooling</h4>
          <ul style={{ fontSize: '12px', color: '#94a3b8', margin: 0, paddingLeft: '16px' }}>
            <li>Keeps strongest activations</li>
            <li>Good for detecting if feature exists</li>
            <li>More common in practice</li>
          </ul>
        </div>
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', padding: '16px', border: '1px solid #3b82f640' }}>
          <h4 style={{ fontSize: '14px', color: '#3b82f6', marginBottom: '8px' }}>Average Pooling</h4>
          <ul style={{ fontSize: '12px', color: '#94a3b8', margin: 0, paddingLeft: '16px' }}>
            <li>Smooths the feature map</li>
            <li>Considers all values equally</li>
            <li>Often used at end of network</li>
          </ul>
        </div>
      </div>

      <div style={{ padding: '12px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px', borderLeft: '3px solid #06b6d4' }}>
        <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
          <strong>Pooling</strong> reduces spatial dimensions (width × height) while keeping depth.
          This reduces computation and provides translation invariance.
        </p>
      </div>
    </div>
  );
}
