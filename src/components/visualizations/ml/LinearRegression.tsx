"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LinearRegression() {
  const [points] = useState([
    { x: 50, y: 220 }, { x: 80, y: 190 }, { x: 120, y: 160 },
    { x: 150, y: 140 }, { x: 180, y: 130 }, { x: 220, y: 100 },
    { x: 260, y: 90 }, { x: 300, y: 70 }, { x: 340, y: 50 },
  ]);
  const [slope, setSlope] = useState(0);
  const [intercept, setIntercept] = useState(200);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [mse, setMse] = useState(0);
  const [showResiduals, setShowResiduals] = useState(true);

  const calculateMSE = (m: number, b: number) => {
    let totalError = 0;
    points.forEach(p => {
      const predicted = m * p.x + b;
      totalError += Math.pow(p.y - predicted, 2);
    });
    return totalError / points.length;
  };

  const findOptimalLine = () => {
    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    points.forEach(p => { sumX += p.x; sumY += p.y; sumXY += p.x * p.y; sumX2 += p.x * p.x; });
    const optimalSlope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const optimalIntercept = (sumY - optimalSlope * sumX) / n;
    return { slope: optimalSlope, intercept: optimalIntercept };
  };

  useEffect(() => {
    if (!isTraining) return;
    const optimal = findOptimalLine();
    const timer = setInterval(() => {
      setSlope(prev => prev + (optimal.slope - prev) * 0.1);
      setIntercept(prev => prev + (optimal.intercept - prev) * 0.1);
      setEpoch(e => e + 1);
    }, 100);
    return () => clearInterval(timer);
  }, [isTraining, points]);

  useEffect(() => { setMse(calculateMSE(slope, intercept)); }, [slope, intercept, points]);
  useEffect(() => { if (epoch > 50) setIsTraining(false); }, [epoch]);

  const reset = () => { setSlope(0); setIntercept(200); setEpoch(0); setIsTraining(false); };
  const predict = (x: number) => slope * x + intercept;

  return (
    <div style={{
      width: '100%', minHeight: '700px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ 
          fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>📈 Linear Regression: Fitting a Line</h2>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Find the best line that minimizes prediction errors</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px' }}>
          <svg width="100%" height="350" viewBox="0 0 400 300">
            {[0,1,2,3,4].map(i => (<line key={`v${i}`} x1={i*100} y1="0" x2={i*100} y2="300" stroke="#334155" strokeWidth="0.5" />))}
            {[0,1,2,3,4,5,6].map(i => (<line key={`h${i}`} x1="0" y1={i*50} x2="400" y2={i*50} stroke="#334155" strokeWidth="0.5" />))}

            {showResiduals && points.map((p, i) => (
              <motion.line key={`res-${i}`} x1={p.x} y1={p.y} x2={p.x} y2={predict(p.x)}
                stroke="#ef4444" strokeWidth="2" opacity="0.6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            ))}

            <motion.line x1="0" y1={intercept} x2="400" y2={slope * 400 + intercept}
              stroke="#22c55e" strokeWidth="3" animate={{ y1: intercept, y2: slope * 400 + intercept }} />

            {points.map((p, i) => (
              <motion.circle key={i} cx={p.x} cy={p.y} r="8" fill="#3b82f6" stroke="white" strokeWidth="2"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.3 }} />
            ))}
          </svg>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }} />Data points</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <div style={{ width: '20px', height: '3px', background: '#22c55e' }} />Best fit line</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <div style={{ width: '20px', height: '2px', background: '#ef4444' }} />Errors</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px', padding: '16px', textAlign: 'center',
          }}>
            <h4 style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Line Equation</h4>
            <div style={{ fontFamily: 'monospace', fontSize: '20px', color: '#60a5fa' }}>
              y = <span style={{ color: '#22c55e' }}>{slope.toFixed(2)}</span>x + <span style={{ color: '#f97316' }}>{intercept.toFixed(1)}</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Model Parameters</h4>
            <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Slope (m):</span>
                <span style={{ color: '#22c55e', fontFamily: 'monospace' }}>{slope.toFixed(4)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Intercept (b):</span>
                <span style={{ color: '#f97316', fontFamily: 'monospace' }}>{intercept.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '8px' }}>
                <span style={{ color: '#94a3b8' }}>MSE:</span>
                <span style={{ color: mse < 100 ? '#22c55e' : '#ef4444', fontFamily: 'monospace' }}>{mse.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Epoch:</span>
                <span style={{ color: '#60a5fa', fontFamily: 'monospace' }}>{epoch}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
            <button onClick={() => setIsTraining(!isTraining)} style={{
              padding: '12px', borderRadius: '8px', border: 'none',
              background: isTraining ? 'linear-gradient(135deg, #ef4444, #f97316)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white', fontWeight: '600', cursor: 'pointer',
            }}>{isTraining ? '⏸ Pause Training' : '▶ Train Model'}</button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={reset} style={{
                flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #475569',
                background: 'transparent', color: '#94a3b8', cursor: 'pointer',
              }}>↺ Reset</button>
              <button onClick={() => setShowResiduals(!showResiduals)} style={{
                flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #475569',
                background: showResiduals ? 'rgba(239,68,68,0.2)' : 'transparent',
                color: showResiduals ? '#ef4444' : '#94a3b8', cursor: 'pointer', fontSize: '12px',
              }}>{showResiduals ? '🔴 Hide Errors' : '👁 Show Errors'}</button>
            </div>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
        marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px', borderLeft: '3px solid #3b82f6',
      }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>🎓 Linear Regression Explained</h4>
        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
          <strong>What:</strong> Find a line y = mx + b that best predicts output from input.<br/>
          <strong>How:</strong> Minimize Mean Squared Error (MSE) - the average of squared distances from points to line.<br/>
          <strong>Why squares?</strong> Penalizes large errors more, makes math tractable.
        </p>
      </motion.div>
    </div>
  );
}
