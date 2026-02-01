"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DecisionTreeViz() {
  const [dataPoint, setDataPoint] = useState({ age: 35, income: 60 });

  const data = [
    { age: 25, income: 30, approved: false }, { age: 30, income: 40, approved: false },
    { age: 35, income: 70, approved: true }, { age: 40, income: 80, approved: true },
    { age: 45, income: 90, approved: true }, { age: 50, income: 75, approved: true },
    { age: 32, income: 55, approved: true }, { age: 38, income: 45, approved: false },
  ];

  const predict = (age: number, income: number) => {
    const path = ['root'];
    if (income > 50) {
      path.push('right');
      path.push(age > 35 ? 'rr' : 'rl');
      return { prediction: true, label: '✅ Approve', path };
    } else {
      path.push('left');
      path.push(age > 30 ? 'lr' : 'll');
      return { prediction: false, label: '❌ Deny', path };
    }
  };

  const result = predict(dataPoint.age, dataPoint.income);

  return (
    <div style={{
      width: '100%', minHeight: '650px',
      background: 'linear-gradient(180deg, #0f172a 0%, #064e3b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ 
          fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #22c55e 0%, #84cc16 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🌳 Decision Tree: If-Then Rules</h2>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Follow the branches to make a prediction</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px', textAlign: 'center' }}>Loan Approval Tree</h3>
          <svg width="100%" height="250" viewBox="0 0 400 250">
            {/* Root node */}
            <rect x="145" y="10" width="110" height="45" rx="8" fill={result.path.includes('root') ? 'rgba(59, 130, 246, 0.3)' : 'rgba(0,0,0,0.3)'} stroke={result.path.includes('root') ? '#3b82f6' : '#475569'} strokeWidth="2" />
            <text x="200" y="35" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle">Income &gt; 50K?</text>
            
            {/* Lines */}
            <line x1="170" y1="55" x2="100" y2="100" stroke={result.path.includes('left') ? '#22c55e' : '#475569'} strokeWidth={result.path.includes('left') ? 3 : 1} />
            <line x1="230" y1="55" x2="300" y2="100" stroke={result.path.includes('right') ? '#22c55e' : '#475569'} strokeWidth={result.path.includes('right') ? 3 : 1} />
            <text x="120" y="75" fill="#94a3b8" fontSize="10">No</text>
            <text x="265" y="75" fill="#94a3b8" fontSize="10">Yes</text>
            
            {/* Left node */}
            <rect x="45" y="100" width="110" height="45" rx="8" fill={result.path.includes('left') ? 'rgba(59, 130, 246, 0.3)' : 'rgba(0,0,0,0.3)'} stroke={result.path.includes('left') ? '#3b82f6' : '#475569'} strokeWidth="2" />
            <text x="100" y="125" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle">Age &gt; 30?</text>
            
            {/* Right node */}
            <rect x="245" y="100" width="110" height="45" rx="8" fill={result.path.includes('right') ? 'rgba(59, 130, 246, 0.3)' : 'rgba(0,0,0,0.3)'} stroke={result.path.includes('right') ? '#3b82f6' : '#475569'} strokeWidth="2" />
            <text x="300" y="125" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle">Age &gt; 35?</text>
            
            {/* Leaf lines */}
            <line x1="70" y1="145" x2="40" y2="185" stroke={result.path.includes('ll') ? '#ef4444' : '#475569'} strokeWidth={result.path.includes('ll') ? 3 : 1} />
            <line x1="130" y1="145" x2="160" y2="185" stroke={result.path.includes('lr') ? '#ef4444' : '#475569'} strokeWidth={result.path.includes('lr') ? 3 : 1} />
            <line x1="270" y1="145" x2="240" y2="185" stroke={result.path.includes('rl') ? '#22c55e' : '#475569'} strokeWidth={result.path.includes('rl') ? 3 : 1} />
            <line x1="330" y1="145" x2="360" y2="185" stroke={result.path.includes('rr') ? '#22c55e' : '#475569'} strokeWidth={result.path.includes('rr') ? 3 : 1} />
            
            {/* Leaf nodes */}
            <rect x="5" y="185" width="70" height="35" rx="17" fill="rgba(239, 68, 68, 0.3)" stroke={result.path.includes('ll') ? '#ef4444' : '#475569'} strokeWidth={result.path.includes('ll') ? 3 : 1} />
            <text x="40" y="207" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">❌ Deny</text>
            
            <rect x="125" y="185" width="70" height="35" rx="17" fill="rgba(239, 68, 68, 0.3)" stroke={result.path.includes('lr') ? '#ef4444' : '#475569'} strokeWidth={result.path.includes('lr') ? 3 : 1} />
            <text x="160" y="207" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">❌ Deny</text>
            
            <rect x="205" y="185" width="70" height="35" rx="17" fill="rgba(34, 197, 94, 0.3)" stroke={result.path.includes('rl') ? '#22c55e' : '#475569'} strokeWidth={result.path.includes('rl') ? 3 : 1} />
            <text x="240" y="207" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">✅ OK</text>
            
            <rect x="325" y="185" width="70" height="35" rx="17" fill="rgba(34, 197, 94, 0.3)" stroke={result.path.includes('rr') ? '#22c55e' : '#475569'} strokeWidth={result.path.includes('rr') ? 3 : 1} />
            <text x="360" y="207" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">✅ OK</text>
          </svg>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px', textAlign: 'center' }}>Data Space</h3>
          <svg width="100%" height="250" viewBox="0 0 300 220">
            <line x1="0" y1={220 - 50 * 2.2} x2="300" y2={220 - 50 * 2.2} stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" />
            <text x="5" y={220 - 50 * 2.2 - 5} fill="#3b82f6" fontSize="10">Income=50K</text>
            
            <rect x="5" y="5" width="290" height={220 - 50 * 2.2 - 10} fill="rgba(239, 68, 68, 0.1)" rx="4" />
            <rect x="5" y={220 - 50 * 2.2 + 5} width="290" height="100" fill="rgba(34, 197, 94, 0.1)" rx="4" />

            {data.map((d, i) => (
              <circle key={i} cx={d.age * 4} cy={220 - d.income * 2.2} r="6"
                fill={d.approved ? '#22c55e' : '#ef4444'} stroke="white" strokeWidth="1" />
            ))}

            <motion.circle cx={dataPoint.age * 4} cy={220 - dataPoint.income * 2.2} r="10"
              fill={result.prediction ? '#22c55e' : '#ef4444'} stroke="#fbbf24" strokeWidth="3"
              animate={{ cx: dataPoint.age * 4, cy: 220 - dataPoint.income * 2.2 }} />
            <text x={dataPoint.age * 4} y={220 - dataPoint.income * 2.2 + 4} fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">?</text>
            
            <text x="150" y="215" fill="#94a3b8" fontSize="10" textAnchor="middle">Age</text>
          </svg>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Test Input</h4>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: '#64748b' }}>Age: {dataPoint.age}</label>
            <input type="range" min="20" max="60" value={dataPoint.age}
              onChange={(e) => setDataPoint(p => ({ ...p, age: parseInt(e.target.value) }))} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#64748b' }}>Income: ${dataPoint.income}K</label>
            <input type="range" min="20" max="100" value={dataPoint.income}
              onChange={(e) => setDataPoint(p => ({ ...p, income: parseInt(e.target.value) }))} style={{ width: '100%' }} />
          </div>
        </div>

        <div style={{
          background: result.prediction 
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.1))'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1))',
          borderRadius: '12px', padding: '16px', textAlign: 'center',
          border: `2px solid ${result.prediction ? '#22c55e' : '#ef4444'}`,
        }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Prediction</div>
          <div style={{ fontSize: '32px', marginTop: '4px' }}>{result.prediction ? '✅' : '❌'}</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: result.prediction ? '#22c55e' : '#ef4444' }}>{result.label}</div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Decision Path</h4>
          <div style={{ fontSize: '12px', color: '#86efac', lineHeight: '1.8' }}>
            <div>1. Income {dataPoint.income > 50 ? '>' : '≤'} 50K</div>
            <div>2. Age check → {result.label}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '3px solid #22c55e' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>🎓 Decision Trees</h4>
        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
          Trees split data using if-then questions. Each split separates classes. Follow branches from root to leaf for prediction.
        </p>
      </div>
    </div>
  );
}
