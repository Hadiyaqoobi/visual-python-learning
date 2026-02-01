"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PerceptronLearning() {
  const [weights, setWeights] = useState([0.5, 0.5]);
  const [bias, setBias] = useState(0);
  const [learningRate, setLearningRate] = useState(0.1);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  
  const trainingData = [
    { inputs: [0, 0], label: 0 },
    { inputs: [0, 1], label: 0 },
    { inputs: [1, 0], label: 0 },
    { inputs: [1, 1], label: 1 },
  ];

  const predict = (x: number[]) => {
    const sum = x[0] * weights[0] + x[1] * weights[1] + bias;
    return sum >= 0 ? 1 : 0;
  };

  const trainStep = () => {
    const sample = trainingData[currentStep % trainingData.length];
    const prediction = predict(sample.inputs);
    const error = sample.label - prediction;
    
    if (error !== 0) {
      const newWeights = [
        weights[0] + learningRate * error * sample.inputs[0],
        weights[1] + learningRate * error * sample.inputs[1],
      ];
      const newBias = bias + learningRate * error;
      
      setHistory(h => [...h, 
        `Step ${currentStep + 1}: [${sample.inputs}]→${prediction} (expected ${sample.label}) | Error=${error}`
      ].slice(-6));
      
      setWeights(newWeights);
      setBias(newBias);
    } else {
      setHistory(h => [...h, 
        `Step ${currentStep + 1}: [${sample.inputs}]→${prediction} ✓ Correct!`
      ].slice(-6));
    }
    
    setCurrentStep(s => s + 1);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining) {
      interval = setInterval(trainStep, 800);
    }
    return () => clearInterval(interval);
  }, [isTraining, currentStep, weights, bias]);

  const accuracy = trainingData.filter(d => predict(d.inputs) === d.label).length / trainingData.length * 100;

  const reset = () => {
    setWeights([0.5, 0.5]);
    setBias(0);
    setCurrentStep(0);
    setHistory([]);
    setIsTraining(false);
  };

  return (
    <div style={{
      width: '100%', minHeight: '600px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>⚡ Perceptron Learning Algorithm</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Watch the perceptron learn the AND gate</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>AND Gate Truth Table</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '8px', color: '#94a3b8' }}>x₁</th>
                <th style={{ padding: '8px', color: '#94a3b8' }}>x₂</th>
                <th style={{ padding: '8px', color: '#94a3b8' }}>Expected</th>
                <th style={{ padding: '8px', color: '#94a3b8' }}>Predicted</th>
              </tr>
            </thead>
            <tbody>
              {trainingData.map((d, i) => {
                const pred = predict(d.inputs);
                const isCorrect = pred === d.label;
                const isCurrent = currentStep % 4 === i && isTraining;
                return (
                  <motion.tr key={i}
                    style={{ 
                      background: isCurrent ? 'rgba(251, 191, 36, 0.2)' : 'transparent',
                      borderBottom: '1px solid #1e293b',
                    }}
                    animate={{ backgroundColor: isCurrent ? 'rgba(251, 191, 36, 0.2)' : 'transparent' }}>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{d.inputs[0]}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{d.inputs[1]}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{d.label}</td>
                    <td style={{ 
                      padding: '10px', textAlign: 'center',
                      color: isCorrect ? '#22c55e' : '#ef4444',
                      fontWeight: 'bold',
                    }}>
                      {pred} {isCorrect ? '✓' : '✗'}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Current Weights</h4>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '16px' }}>
            {weights.map((w, i) => (
              <motion.div key={i}
                style={{
                  width: '80px', height: '80px', borderRadius: '12px',
                  background: w >= 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `2px solid ${w >= 0 ? '#22c55e' : '#ef4444'}`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.3 }}>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>w{i + 1}</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: w >= 0 ? '#22c55e' : '#ef4444' }}>
                  {w.toFixed(2)}
                </span>
              </motion.div>
            ))}
            <motion.div
              style={{
                width: '80px', height: '80px', borderRadius: '12px',
                background: 'rgba(251, 191, 36, 0.2)',
                border: '2px solid #fbbf24',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>bias</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fbbf24' }}>
                {bias.toFixed(2)}
              </span>
            </motion.div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Accuracy: </span>
            <span style={{ 
              fontSize: '24px', fontWeight: 'bold',
              color: accuracy === 100 ? '#22c55e' : '#fbbf24',
            }}>{accuracy.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
        <button onClick={() => setIsTraining(!isTraining)}
          style={{
            padding: '10px 24px', borderRadius: '8px',
            background: isTraining ? '#ef4444' : '#22c55e',
            border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer',
          }}>
          {isTraining ? '⏸ Pause' : '▶ Train'}
        </button>
        <button onClick={trainStep} disabled={isTraining}
          style={{
            padding: '10px 24px', borderRadius: '8px',
            background: '#3b82f6', border: 'none', color: 'white',
            fontWeight: 'bold', cursor: 'pointer', opacity: isTraining ? 0.5 : 1,
          }}>
          Step →
        </button>
        <button onClick={reset}
          style={{
            padding: '10px 24px', borderRadius: '8px',
            background: '#64748b', border: 'none', color: 'white',
            fontWeight: 'bold', cursor: 'pointer',
          }}>
          Reset
        </button>
      </div>

      <div style={{ maxWidth: '300px', margin: '16px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Learning Rate (α)</span>
          <span style={{ fontSize: '12px', color: '#a855f7' }}>{learningRate}</span>
        </div>
        <input type="range" min="0.01" max="1" step="0.01" value={learningRate}
          onChange={(e) => setLearningRate(parseFloat(e.target.value))} style={{ width: '100%' }} />
      </div>

      <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '12px', maxHeight: '120px', overflow: 'auto' }}>
        <h4 style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Training Log (Step {currentStep})</h4>
        <AnimatePresence>
          {history.map((log, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              style={{ fontSize: '11px', fontFamily: 'monospace', color: '#e2e8f0', marginBottom: '4px' }}>
              {log}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', borderLeft: '3px solid #22c55e' }}>
        <p style={{ fontSize: '13px', color: '#cbd5e1', fontFamily: 'monospace' }}>
          <strong>Update Rule:</strong> w_new = w_old + α × error × x
        </p>
      </div>
    </div>
  );
}
