"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KNearestNeighbors() {
  const [k, setK] = useState(3);
  const [queryPoint, setQueryPoint] = useState({ x: 200, y: 150 });
  const [showDistances, setShowDistances] = useState(true);

  const trainingData = [
    { x: 80, y: 80, label: 'A' }, { x: 100, y: 60, label: 'A' },
    { x: 60, y: 100, label: 'A' }, { x: 90, y: 110, label: 'A' },
    { x: 120, y: 90, label: 'A' }, { x: 70, y: 70, label: 'A' },
    { x: 300, y: 220, label: 'A' }, { x: 320, y: 240, label: 'A' },
    { x: 280, y: 250, label: 'A' },
    { x: 280, y: 80, label: 'B' }, { x: 300, y: 100, label: 'B' },
    { x: 320, y: 70, label: 'B' }, { x: 340, y: 90, label: 'B' },
    { x: 260, y: 100, label: 'B' },
    { x: 100, y: 220, label: 'B' }, { x: 80, y: 240, label: 'B' },
    { x: 120, y: 250, label: 'B' }, { x: 90, y: 260, label: 'B' },
  ];

  const distance = (p1: {x: number, y: number}, p2: {x: number, y: number}) => 
    Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

  const findKNearest = () => {
    const distances = trainingData.map((point, i) => ({
      ...point, index: i, dist: distance(queryPoint, point)
    }));
    distances.sort((a, b) => a.dist - b.dist);
    return distances.slice(0, k);
  };

  const kNearest = findKNearest();
  const nearestIndices = kNearest.map(n => n.index);

  const predict = () => {
    const countA = kNearest.filter(n => n.label === 'A').length;
    const countB = kNearest.filter(n => n.label === 'B').length;
    return countA > countB ? 'A' : 'B';
  };

  const prediction = predict();

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 400;
    const y = ((e.clientY - rect.top) / rect.height) * 300;
    setQueryPoint({ x: Math.max(20, Math.min(380, x)), y: Math.max(20, Math.min(280, y)) });
  };

  return (
    <div style={{
      width: '100%', minHeight: '700px',
      background: 'linear-gradient(180deg, #0f172a 0%, #312e81 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ 
          fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🎯 K-Nearest Neighbors (KNN)</h2>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Click anywhere to classify a new point</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px' }}>
          <svg width="100%" height="350" viewBox="0 0 400 300" style={{ cursor: 'crosshair' }} onClick={handleClick}>
            {[0,1,2,3,4].map(i => (<line key={`v${i}`} x1={i*100} y1="0" x2={i*100} y2="300" stroke="#334155" strokeWidth="0.5" />))}
            {[0,1,2,3,4,5,6].map(i => (<line key={`h${i}`} x1="0" y1={i*50} x2="400" y2={i*50} stroke="#334155" strokeWidth="0.5" />))}

            {showDistances && kNearest.map((neighbor, i) => (
              <motion.line key={`dist-${i}`} x1={queryPoint.x} y1={queryPoint.y} x2={neighbor.x} y2={neighbor.y}
                stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,4" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} />
            ))}

            {kNearest.length > 0 && (
              <motion.circle cx={queryPoint.x} cy={queryPoint.y} r={kNearest[kNearest.length - 1].dist}
                fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="8,4" opacity="0.4"
                initial={{ scale: 0 }} animate={{ scale: 1 }} />
            )}

            {trainingData.map((point, i) => {
              const isNearest = nearestIndices.includes(i);
              return (
                <motion.g key={i}>
                  {isNearest && (
                    <motion.circle cx={point.x} cy={point.y} r="16"
                      fill={point.label === 'A' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(249, 115, 22, 0.3)'}
                      initial={{ scale: 0 }} animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                  )}
                  <motion.circle cx={point.x} cy={point.y} r={isNearest ? "10" : "8"}
                    fill={point.label === 'A' ? '#3b82f6' : '#f97316'}
                    stroke={isNearest ? '#fff' : 'transparent'} strokeWidth="2"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.02 }} />
                  <text x={point.x} y={point.y + 4} fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">{point.label}</text>
                </motion.g>
              );
            })}

            <motion.g animate={{ x: queryPoint.x, y: queryPoint.y }} transition={{ type: 'spring', stiffness: 200 }}>
              <circle cx="0" cy="0" r="14" fill={prediction === 'A' ? '#3b82f6' : '#f97316'} stroke="#fff" strokeWidth="3" />
              <text x="0" y="1" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">?</text>
            </motion.g>
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={prediction} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              style={{
                background: prediction === 'A' 
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.1))'
                  : 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(249, 115, 22, 0.1))',
                border: `2px solid ${prediction === 'A' ? '#3b82f6' : '#f97316'}`,
                borderRadius: '12px', padding: '20px', textAlign: 'center',
              }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Prediction</div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: prediction === 'A' ? '#60a5fa' : '#fb923c' }}>{prediction}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Based on {k} nearest neighbors</div>
            </motion.div>
          </AnimatePresence>

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>K = {k} neighbors</h4>
            <input type="range" min="1" max="9" step="2" value={k}
              onChange={(e) => setK(parseInt(e.target.value))} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
              <span>1 (overfit)</span><span>9 (smooth)</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Majority Vote</h4>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ color: '#60a5fa', fontSize: '24px', fontWeight: 'bold' }}>{kNearest.filter(n => n.label === 'A').length}</div>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>Class A</div>
              </div>
              <div style={{ width: '1px', background: '#334155' }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ color: '#fb923c', fontSize: '24px', fontWeight: 'bold' }}>{kNearest.filter(n => n.label === 'B').length}</div>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>Class B</div>
              </div>
            </div>
          </div>

          <button onClick={() => setShowDistances(!showDistances)} style={{
            padding: '10px', borderRadius: '8px', border: '1px solid #475569',
            background: showDistances ? 'rgba(251, 191, 36, 0.2)' : 'transparent',
            color: showDistances ? '#fbbf24' : '#94a3b8', cursor: 'pointer', fontSize: '12px',
          }}>{showDistances ? '🔗 Hide Distances' : '👁 Show Distances'}</button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
        marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px', borderLeft: '3px solid #a78bfa',
      }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>🎓 KNN Explained</h4>
        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
          <strong>Algorithm:</strong> Find K closest training points → Majority vote determines class.<br/>
          <strong>Distance:</strong> Euclidean: √((x₁-x₂)² + (y₁-y₂)²)<br/>
          <strong>K selection:</strong> Small K = noisy. Large K = smooth but may miss patterns.
        </p>
      </motion.div>
    </div>
  );
}
