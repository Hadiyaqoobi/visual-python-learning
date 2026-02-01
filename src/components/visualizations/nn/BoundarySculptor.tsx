"use client";

import { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function BoundarySculptor() {
  const [angle, setAngle] = useState(45);
  const [offset, setOffset] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const classA = useMemo(() => [
    { x: 80, y: 200 }, { x: 100, y: 180 }, { x: 120, y: 220 },
    { x: 90, y: 240 }, { x: 140, y: 200 }, { x: 110, y: 260 },
    { x: 70, y: 230 }, { x: 130, y: 240 },
  ], []);
  
  const classB = useMemo(() => [
    { x: 280, y: 80 }, { x: 300, y: 100 }, { x: 260, y: 60 },
    { x: 320, y: 90 }, { x: 290, y: 50 }, { x: 270, y: 110 },
    { x: 310, y: 70 }, { x: 250, y: 90 },
  ], []);

  const radians = (angle * Math.PI) / 180;
  const centerX = 200 + offset;
  const centerY = 150;
  const lineLength = 400;
  
  const x1 = centerX - Math.cos(radians) * lineLength;
  const y1 = centerY - Math.sin(radians) * lineLength;
  const x2 = centerX + Math.cos(radians) * lineLength;
  const y2 = centerY + Math.sin(radians) * lineLength;

  const classifyPoint = (px: number, py: number) => {
    const d = (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);
    return d > 0;
  };

  const correctA = classA.filter(p => !classifyPoint(p.x, p.y)).length;
  const correctB = classB.filter(p => classifyPoint(p.x, p.y)).length;
  const accuracy = ((correctA + correctB) / (classA.length + classB.length)) * 100;

  return (
    <div style={{
      width: '100%', minHeight: '550px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1a1a2e 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>✂️ Boundary Sculptor</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Find the line that separates the two classes</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px' }}>
          <svg ref={svgRef} width="100%" height="300" viewBox="0 0 400 300">
            <rect x="0" y="0" width="400" height="300" fill="rgba(0,0,0,0.2)" rx="8" />
            
            <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#fbbf24" strokeWidth="3" strokeDasharray="8,4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

            {classA.map((p, i) => {
              const correct = !classifyPoint(p.x, p.y);
              return (
                <motion.circle key={`a-${i}`} cx={p.x} cy={p.y} r="12"
                  fill="#3b82f6" stroke={correct ? '#22c55e' : '#ef4444'} strokeWidth="3"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }} />
              );
            })}

            {classB.map((p, i) => {
              const correct = classifyPoint(p.x, p.y);
              return (
                <motion.polygon key={`b-${i}`}
                  points={`${p.x},${p.y - 12} ${p.x - 10},${p.y + 8} ${p.x + 10},${p.y + 8}`}
                  fill="#ef4444" stroke={correct ? '#22c55e' : '#ef4444'} strokeWidth="3"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 + 0.3 }} />
              );
            })}
          </svg>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#3b82f6' }} />
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Class A</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '0', height: '0', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '14px solid #ef4444' }} />
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Class B</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Accuracy</div>
            <div style={{
              fontSize: '42px', fontWeight: 'bold',
              color: accuracy >= 100 ? '#22c55e' : accuracy >= 80 ? '#fbbf24' : '#ef4444',
            }}>{accuracy.toFixed(0)}%</div>
            <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', marginTop: '8px' }}>
              <motion.div style={{
                height: '100%', borderRadius: '3px',
                background: accuracy >= 100 ? '#22c55e' : accuracy >= 80 ? '#fbbf24' : '#ef4444',
              }} animate={{ width: `${accuracy}%` }} />
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Angle</span>
              <span style={{ fontSize: '12px', color: '#fbbf24' }}>{angle}°</span>
            </div>
            <input type="range" min="-90" max="90" value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Position</span>
              <span style={{ fontSize: '12px', color: '#fbbf24' }}>{offset}</span>
            </div>
            <input type="range" min="-100" max="100" value={offset}
              onChange={(e) => setOffset(parseInt(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div style={{
            background: accuracy >= 100 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(251, 191, 36, 0.1)',
            border: `1px solid ${accuracy >= 100 ? '#22c55e' : '#fbbf2440'}`,
            borderRadius: '12px', padding: '12px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '14px', color: accuracy >= 100 ? '#22c55e' : '#fbbf24' }}>
              {accuracy >= 100 ? '🎉 Perfect!' : '🎯 Adjust to 100%'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px', borderLeft: '3px solid #06b6d4' }}>
        <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
          <strong>Linear classifiers</strong> find a line (2D) or hyperplane (nD) to separate classes. 
          Perceptrons, logistic regression, and SVMs all learn linear boundaries.
        </p>
      </div>
    </div>
  );
}
