"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function TrainingLive() {
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(1.0);
  const [accuracy, setAccuracy] = useState(0.5);
  const [learningRate, setLearningRate] = useState(0.1);
  const [lossHistory, setLossHistory] = useState<number[]>([1.0]);
  const [weights, setWeights] = useState([
    [[0.5, -0.3], [0.2, 0.7]],
    [[0.4], [0.6]],
  ]);

  const trainStep = () => {
    // Simulate training progress
    const newLoss = Math.max(0.01, loss * (0.92 + Math.random() * 0.1) - learningRate * 0.05);
    const newAcc = Math.min(0.99, accuracy + (1 - accuracy) * learningRate * (0.1 + Math.random() * 0.1));
    
    setLoss(newLoss);
    setAccuracy(newAcc);
    setEpoch(e => e + 1);
    setLossHistory(h => [...h.slice(-49), newLoss]);
    
    // Update weights slightly
    setWeights(w => w.map(layer => 
      layer.map(neuron => 
        neuron.map(weight => weight + (Math.random() - 0.5) * learningRate * 0.2)
      )
    ));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining && loss > 0.02) {
      interval = setInterval(trainStep, 200);
    } else if (loss <= 0.02) {
      setIsTraining(false);
    }
    return () => clearInterval(interval);
  }, [isTraining, loss, learningRate]);

  const reset = () => {
    setIsTraining(false);
    setEpoch(0);
    setLoss(1.0);
    setAccuracy(0.5);
    setLossHistory([1.0]);
    setWeights([[[0.5, -0.3], [0.2, 0.7]], [[0.4], [0.6]]]);
  };

  // Loss curve points
  const curvePoints = lossHistory.map((l, i) => {
    const x = 50 + (i / 50) * 300;
    const y = 150 - l * 130;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{
      width: '100%', minHeight: '650px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🏋️ Training Live</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Watch a neural network learn in real-time</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Loss curve */}
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Loss Over Time</h4>
          <svg width="100%" height="180" viewBox="0 0 400 180">
            {/* Grid */}
            <line x1="50" y1="150" x2="350" y2="150" stroke="#475569" strokeWidth="1" />
            <line x1="50" y1="20" x2="50" y2="150" stroke="#475569" strokeWidth="1" />
            
            {/* Labels */}
            <text x="200" y="175" textAnchor="middle" fill="#64748b" fontSize="10">Epoch</text>
            <text x="30" y="85" textAnchor="middle" fill="#64748b" fontSize="10" transform="rotate(-90, 30, 85)">Loss</text>
            
            {/* Loss curve */}
            <motion.polyline
              points={curvePoints}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
            
            {/* Current point */}
            {lossHistory.length > 0 && (
              <motion.circle
                cx={50 + ((lossHistory.length - 1) / 50) * 300}
                cy={150 - lossHistory[lossHistory.length - 1] * 130}
                r="5"
                fill="#22c55e"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              />
            )}
          </svg>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(34, 197, 94, 0.2)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Epoch</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22c55e' }}>{epoch}</div>
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Loss</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>{loss.toFixed(4)}</div>
            </div>
          </div>
          
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Accuracy</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#3b82f6' }}>{(accuracy * 100).toFixed(1)}%</span>
            </div>
            <div style={{ width: '100%', height: '12px', background: '#1e293b', borderRadius: '6px', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', background: '#3b82f6', borderRadius: '6px' }}
                animate={{ width: `${accuracy * 100}%` }}
              />
            </div>
          </div>

          {/* Learning rate */}
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Learning Rate (α)</span>
              <span style={{ fontSize: '12px', color: '#fbbf24' }}>{learningRate}</span>
            </div>
            <input type="range" min="0.01" max="0.5" step="0.01" value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              disabled={isTraining} style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Weight visualization */}
      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
        <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Weights (updating live)</h4>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
          {weights.map((layer, layerIdx) => (
            <div key={layerIdx}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', textAlign: 'center' }}>
                Layer {layerIdx + 1}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {layer.map((neuron, nIdx) => (
                  <div key={nIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {neuron.map((w, wIdx) => (
                      <motion.div key={wIdx}
                        style={{
                          width: '40px', height: '24px',
                          background: w >= 0 ? `rgba(34, 197, 94, ${Math.abs(w)})` : `rgba(239, 68, 68, ${Math.abs(w)})`,
                          borderRadius: '4px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', fontWeight: 'bold',
                        }}
                        animate={{ scale: isTraining ? [1, 1.05, 1] : 1 }}
                        transition={{ duration: 0.2 }}>
                        {w.toFixed(2)}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
        <button onClick={() => setIsTraining(!isTraining)}
          style={{
            padding: '12px 32px', borderRadius: '8px',
            background: isTraining ? '#ef4444' : '#22c55e',
            border: 'none', color: 'white', fontWeight: 'bold',
            cursor: 'pointer', fontSize: '16px',
          }}>
          {isTraining ? '⏸ Pause' : '▶ Train'}
        </button>
        <button onClick={trainStep} disabled={isTraining}
          style={{
            padding: '12px 24px', borderRadius: '8px',
            background: '#3b82f6', border: 'none', color: 'white',
            fontWeight: 'bold', cursor: 'pointer', opacity: isTraining ? 0.5 : 1,
          }}>
          Step
        </button>
        <button onClick={reset}
          style={{
            padding: '12px 24px', borderRadius: '8px',
            background: '#64748b', border: 'none', color: 'white',
            fontWeight: 'bold', cursor: 'pointer',
          }}>
          Reset
        </button>
      </div>

      {/* Status message */}
      <div style={{
        marginTop: '16px', padding: '12px', borderRadius: '8px', textAlign: 'center',
        background: loss <= 0.02 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(251, 191, 36, 0.1)',
        border: `1px solid ${loss <= 0.02 ? '#22c55e' : '#fbbf2440'}`,
      }}>
        {loss <= 0.02 ? (
          <span style={{ color: '#22c55e', fontWeight: 'bold' }}>🎉 Training Complete! Model converged.</span>
        ) : (
          <span style={{ color: '#94a3b8' }}>
            {isTraining ? '⏳ Training in progress...' : 'Press Train to start learning'}
          </span>
        )}
      </div>
    </div>
  );
}
