"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function XORProblem() {
  const [problemType, setProblemType] = useState<'and' | 'or' | 'xor'>('xor');
  const [showAttemptedLine, setShowAttemptedLine] = useState(true);
  const [lineAngle, setLineAngle] = useState(45);
  const [lineOffset, setLineOffset] = useState(50);

  const problems = {
    and: { 
      data: [
        { x: 50, y: 50, label: 0 }, { x: 50, y: 200, label: 0 },
        { x: 200, y: 50, label: 0 }, { x: 200, y: 200, label: 1 },
      ],
      title: 'AND Gate', separable: true,
    },
    or: {
      data: [
        { x: 50, y: 50, label: 0 }, { x: 50, y: 200, label: 1 },
        { x: 200, y: 50, label: 1 }, { x: 200, y: 200, label: 1 },
      ],
      title: 'OR Gate', separable: true,
    },
    xor: {
      data: [
        { x: 50, y: 50, label: 0 }, { x: 50, y: 200, label: 1 },
        { x: 200, y: 50, label: 1 }, { x: 200, y: 200, label: 0 },
      ],
      title: 'XOR Gate', separable: false,
    },
  };

  const current = problems[problemType];

  const radians = (lineAngle * Math.PI) / 180;
  const centerX = 125;
  const centerY = 125 + lineOffset - 50;
  const lineLength = 300;

  const x1 = centerX - Math.cos(radians) * lineLength;
  const y1 = centerY - Math.sin(radians) * lineLength;
  const x2 = centerX + Math.cos(radians) * lineLength;
  const y2 = centerY + Math.sin(radians) * lineLength;

  const classifyPoint = (px: number, py: number) => {
    const d = (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);
    return d > 0 ? 1 : 0;
  };

  const accuracy = useMemo(() => {
    const correct = current.data.filter(p => classifyPoint(p.x, p.y) === p.label).length;
    return (correct / current.data.length) * 100;
  }, [problemType, lineAngle, lineOffset]);

  return (
    <div style={{
      width: '100%', minHeight: '600px',
      background: 'linear-gradient(180deg, #0f172a 0%, #2d1b4e 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🚫 The XOR Problem</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Why single-layer perceptrons cannot solve everything</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
        {(['and', 'or', 'xor'] as const).map(type => (
          <button key={type} onClick={() => setProblemType(type)}
            style={{
              padding: '10px 24px', borderRadius: '8px',
              background: problemType === type 
                ? (problems[type].separable ? '#22c55e' : '#ef4444') : 'transparent',
              border: `2px solid ${problems[type].separable ? '#22c55e' : '#ef4444'}`,
              color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
            }}>
            {type.toUpperCase()} {problems[type].separable ? '✓' : '✗'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
          <svg width="100%" height="280" viewBox="0 0 250 250">
            <rect width="250" height="250" fill="rgba(0,0,0,0.2)" rx="8" />
            
            <line x1="25" y1="225" x2="225" y2="225" stroke="#475569" strokeWidth="2"/>
            <line x1="25" y1="225" x2="25" y2="25" stroke="#475569" strokeWidth="2"/>

            {showAttemptedLine && (
              <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#fbbf24" strokeWidth="3" strokeDasharray="8,4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            )}

            {current.data.map((point, i) => {
              const predicted = classifyPoint(point.x, point.y);
              const isCorrect = predicted === point.label;
              return (
                <g key={i}>
                  <motion.circle cx={point.x} cy={250 - point.y} r="20"
                    fill={point.label === 1 ? '#22c55e' : '#ef4444'}
                    stroke={showAttemptedLine ? (isCorrect ? '#22c55e' : '#fbbf24') : '#475569'}
                    strokeWidth={showAttemptedLine && !isCorrect ? '4' : '2'}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} />
                  <text x={point.x} y={255 - point.y} fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">
                    {point.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            background: current.separable ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `2px solid ${current.separable ? '#22c55e' : '#ef4444'}`,
            borderRadius: '12px', padding: '16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: current.separable ? '#22c55e' : '#ef4444' }}>
              {current.separable ? '✓ Linearly Separable' : '✗ NOT Linearly Separable'}
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={showAttemptedLine} onChange={(e) => setShowAttemptedLine(e.target.checked)} />
              <span style={{ fontSize: '13px' }}>Show decision boundary</span>
            </label>
            
            {showAttemptedLine && (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Angle</span>
                    <span style={{ fontSize: '11px' }}>{lineAngle}°</span>
                  </div>
                  <input type="range" min="0" max="180" value={lineAngle}
                    onChange={(e) => setLineAngle(parseInt(e.target.value))} style={{ width: '100%' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Position</span>
                    <span style={{ fontSize: '11px' }}>{lineOffset}</span>
                  </div>
                  <input type="range" min="0" max="100" value={lineOffset}
                    onChange={(e) => setLineOffset(parseInt(e.target.value))} style={{ width: '100%' }} />
                </div>
                
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Best Accuracy: </span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: accuracy === 100 ? '#22c55e' : '#fbbf24' }}>
                    {accuracy.toFixed(0)}%
                  </span>
                </div>
              </>
            )}
          </div>

          <div style={{ background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', padding: '16px', borderLeft: '3px solid #22c55e' }}>
            <h4 style={{ fontSize: '13px', color: '#22c55e', marginBottom: '8px' }}>💡 The Solution</h4>
            <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
              Add a <strong>hidden layer!</strong> Multi-layer perceptrons can create non-linear boundaries and solve XOR.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
