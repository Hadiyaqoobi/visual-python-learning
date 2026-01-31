"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HowAILearns() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const digitGrid = [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,1,0,0,0],
  ];

  const steps = [
    { title: "🖼️ Step 1: The Input", description: "When you show AI an image (like a handwritten '7'), it first converts it to numbers. Each pixel becomes a value: dark=1, light=0. This is ALL the AI sees - just numbers!", highlight: "input" },
    { title: "🧠 Step 2: Into the Brain", description: "These numbers flow into the neural network - layers of connected 'neurons'. Each connection has a 'weight' (importance). Initially, weights are random - the AI knows NOTHING yet!", highlight: "network" },
    { title: "⚡ Step 3: Signals Flow", description: "Each neuron receives signals, multiplies by weights, adds them up, and 'fires' if the total is high enough. This mimics how real brain neurons work!", highlight: "signals" },
    { title: "🤔 Step 4: First Guess", description: "The output layer has 10 neurons (for digits 0-9). The brightest one is the AI's guess. First guess is usually WRONG because weights are random!", highlight: "output" },
    { title: "❌ Step 5: Check the Answer", description: "We compare AI's guess to the correct answer. The difference is called 'loss' or 'error'. This tells us HOW WRONG the AI was.", highlight: "error" },
    { title: "🔧 Step 6: Backpropagation", description: "Here's the MAGIC: We trace backwards asking 'which weights caused this mistake?' Then we adjust those weights slightly. This is how AI LEARNS!", highlight: "backprop" },
    { title: "🔄 Step 7: Repeat 1000x", description: "Show the AI thousands of examples. Each time: guess → check → adjust weights. Slowly, the weights become perfect for recognizing patterns!", highlight: "training" },
    { title: "✨ Step 8: AI Can See!", description: "After training, the AI recognizes digits it's NEVER seen before! It learned the PATTERNS, not memorized examples. This is machine learning!", highlight: "success" },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      if (step < steps.length - 1) setStep(s => s + 1);
      else setIsPlaying(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [isPlaying, step, steps.length]);

  useEffect(() => {
    if (step === 6) {
      const interval = setInterval(() => {
        setEpoch(e => {
          const newE = e + 1;
          setAccuracy(Math.min(95, 30 + newE * 6.5));
          if (newE >= 10) clearInterval(interval);
          return newE;
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      setEpoch(0);
      setAccuracy(0);
    }
  }, [step]);

  useEffect(() => {
    if (step >= 3) {
      if (step === 3) { setPrediction(3); setConfidence(45); }
      else if (step >= 7) { setPrediction(7); setConfidence(98); }
    } else { setPrediction(null); }
  }, [step]);

  const currentStep = steps[step];

  return (
    <div style={{ width: '100%', minHeight: '700px', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', borderRadius: '16px', padding: '24px', color: 'white' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>🧠 How Does AI Actually Learn?</h2>
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>Watch a neural network learn to recognize handwritten digits</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '24px', marginBottom: '24px', minHeight: '350px' }}>
        {/* Input */}
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', border: currentStep.highlight === 'input' ? '2px solid #3b82f6' : '2px solid transparent' }}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px', textAlign: 'center' }}>INPUT IMAGE</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', maxWidth: '150px', margin: '0 auto' }}>
            {digitGrid.flat().map((pixel, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1, backgroundColor: pixel ? '#3b82f6' : '#1e293b' }} transition={{ delay: i * 0.02 }}
                style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #334155' }} />
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '24px' }}>This is a "7"</p>
          {step >= 0 && <div style={{ marginTop: '16px', fontSize: '12px', color: '#64748b' }}><p>AI sees numbers:</p><code style={{ fontSize: '10px', color: '#22c55e' }}>[1,1,1,1,1,0,0,0,0,1...]</code></div>}
        </div>

        {/* Neural Network */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', border: ['network','signals','backprop'].includes(currentStep.highlight) ? '2px solid #8b5cf6' : '2px solid transparent' }}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px', textAlign: 'center' }}>NEURAL NETWORK</h3>
          <svg width="100%" height="250" viewBox="0 0 400 250">
            <text x="50" y="20" fill="#64748b" fontSize="12" textAnchor="middle">Input</text>
            <text x="150" y="20" fill="#64748b" fontSize="12" textAnchor="middle">Hidden 1</text>
            <text x="250" y="20" fill="#64748b" fontSize="12" textAnchor="middle">Hidden 2</text>
            <text x="350" y="20" fill="#64748b" fontSize="12" textAnchor="middle">Output</text>
            
            {step >= 1 && [0,1,2,3,4].map(i => [0,1,2,3].map(j => (
              <motion.line key={`c1-${i}-${j}`} x1="50" y1={50 + i * 40} x2="150" y2={60 + j * 45}
                stroke={step >= 2 ? '#3b82f6' : '#334155'} strokeWidth={step >= 2 ? 1.5 : 1}
                initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.3 }} />
            )))}
            {step >= 1 && [0,1,2,3].map(i => [0,1,2].map(j => (
              <motion.line key={`c2-${i}-${j}`} x1="150" y1={60 + i * 45} x2="250" y2={80 + j * 50}
                stroke={step >= 2 ? '#8b5cf6' : '#334155'} strokeWidth={step >= 2 ? 1.5 : 1}
                initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.5 }} />
            )))}
            {step >= 1 && [0,1,2].map(i => [0,1,2,3,4].map(j => (
              <motion.line key={`c3-${i}-${j}`} x1="250" y1={80 + i * 50} x2="350" y2={50 + j * 40}
                stroke={step >= 2 ? '#f59e0b' : '#334155'} strokeWidth={step >= 2 ? 1.5 : 1}
                initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.7 }} />
            )))}

            {[0,1,2,3,4].map(i => <motion.circle key={`in-${i}`} cx="50" cy={50 + i * 40} r="12" fill={step >= 0 ? '#3b82f6' : '#1e293b'} stroke="#64748b" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} />)}
            {[0,1,2,3].map(i => <motion.circle key={`h1-${i}`} cx="150" cy={60 + i * 45} r="14" fill={step >= 2 ? '#8b5cf6' : '#1e293b'} stroke="#64748b" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }} />)}
            {[0,1,2].map(i => <motion.circle key={`h2-${i}`} cx="250" cy={80 + i * 50} r="14" fill={step >= 2 ? '#f59e0b' : '#1e293b'} stroke="#64748b" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.1 }} />)}
            
            {[0,1,2,3,4].map(i => {
              const labels = [3, 5, 7, 8, 9];
              const isCorrect = step >= 7 && labels[i] === 7;
              const isWrong = step === 3 && labels[i] === 3;
              return (
                <g key={`out-${i}`}>
                  <motion.circle cx="350" cy={50 + i * 40} r="14" fill={isCorrect ? '#22c55e' : isWrong ? '#ef4444' : '#1e293b'} stroke={labels[i] === 7 ? '#22c55e' : '#64748b'} strokeWidth={labels[i] === 7 ? 2 : 1} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 + i * 0.1 }} />
                  <text x="350" y={54 + i * 40} fill="white" fontSize="12" textAnchor="middle">{labels[i]}</text>
                </g>
              );
            })}

            {step === 5 && <>
              <motion.path d="M 340 130 L 60 130" stroke="#ef4444" strokeWidth="3" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
              <text x="200" y="118" fill="#ef4444" fontSize="11" textAnchor="middle">← Adjust weights (backprop) ←</text>
            </>}
          </svg>
          
          {step === 6 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', marginTop: '16px' }}>
              <p style={{ fontSize: '14px', color: '#94a3b8' }}>Training Progress</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>Epoch {epoch}/10 - Accuracy: {accuracy.toFixed(0)}%</p>
              <div style={{ width: '100%', height: '8px', background: '#334155', borderRadius: '4px', marginTop: '8px', overflow: 'hidden' }}>
                <motion.div style={{ height: '100%', background: '#22c55e', borderRadius: '4px' }} animate={{ width: `${accuracy}%` }} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Output */}
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', border: ['output','error','success'].includes(currentStep.highlight) ? '2px solid #22c55e' : '2px solid transparent' }}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px', textAlign: 'center' }}>AI's ANSWER</h3>
          <AnimatePresence mode="wait">
            {prediction !== null ? (
              <motion.div key={prediction} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '72px', fontWeight: 'bold', color: prediction === 7 ? '#22c55e' : '#ef4444' }}>{prediction}</div>
                <div style={{ fontSize: '14px', color: prediction === 7 ? '#22c55e' : '#ef4444', marginTop: '8px' }}>{prediction === 7 ? '✓ CORRECT!' : '✗ WRONG!'}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Confidence: {confidence}%</div>
                {step === 4 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '20px', padding: '12px', background: '#fef2f2', borderRadius: '8px', color: '#991b1b', fontSize: '13px' }}><strong>Error:</strong> Expected 7, got 3<br/><strong>Loss = 0.82</strong></motion.div>}
                {step >= 7 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '20px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', color: '#166534', fontSize: '13px' }}>🎉 After training, AI recognizes the 7!</motion.div>}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>❓</div>
                <p>Waiting for output...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#f1f5f9' }}>{currentStep.title}</h3>
        <p style={{ fontSize: '16px', color: '#cbd5e1', lineHeight: '1.6' }}>{currentStep.description}</p>
      </motion.div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ padding: '12px 24px', background: step === 0 ? '#334155' : '#475569', color: 'white', border: 'none', borderRadius: '8px', cursor: step === 0 ? 'default' : 'pointer', fontSize: '16px' }}>← Previous</button>
        <button onClick={() => { setIsPlaying(!isPlaying); if (!isPlaying && step === steps.length - 1) setStep(0); }} style={{ padding: '12px 32px', background: isPlaying ? '#ef4444' : '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>{isPlaying ? '⏸ Pause' : '▶ Auto Play'}</button>
        <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1} style={{ padding: '12px 24px', background: step === steps.length - 1 ? '#334155' : '#475569', color: 'white', border: 'none', borderRadius: '8px', cursor: step === steps.length - 1 ? 'default' : 'pointer', fontSize: '16px' }}>Next →</button>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
        {steps.map((_, i) => <button key={i} onClick={() => setStep(i)} style={{ width: '12px', height: '12px', borderRadius: '50%', border: 'none', background: i === step ? '#3b82f6' : i < step ? '#22c55e' : '#475569', cursor: 'pointer' }} />)}
      </div>
    </div>
  );
}
