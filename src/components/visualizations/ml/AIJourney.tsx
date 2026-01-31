"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIJourney() {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [weights, setWeights] = useState([0.5, -0.3, 0.8, 0.1, -0.2]);
  const [inputs] = useState([1, 0, 1, 1, 0]);
  const [prediction, setPrediction] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [lossHistory, setLossHistory] = useState<number[]>([]);

  const phases = [
    { title: "🎯 The Goal", desc: "We want to teach AI to recognize if a pattern means '1' or '0'." },
    { title: "📊 The Data", desc: "AI sees numbers, not images. Each pixel = a number (dark=1, light=0)." },
    { title: "🧠 The Brain", desc: "Neurons connected in layers. Each connection has a 'weight' (importance)." },
    { title: "⚡ Forward Pass", desc: "Data flows through: multiply by weights, add up, decide to 'fire'." },
    { title: "❌ The Mistake", desc: "Compare prediction to answer. Difference = 'loss'. Goal: minimize loss!" },
    { title: "🔧 Learning", desc: "Trace backwards: which weights caused the mistake? Nudge them!" },
    { title: "🔄 Training", desc: "Repeat 1000x: predict → check → adjust. Watch accuracy rise!" },
    { title: "✨ Intelligence", desc: "AI now recognizes patterns it's NEVER seen. It learned the concept!" },
  ];

  const codeSnippets = [
    `# 🎯 Our Mission: Teach AI to recognize patterns
pattern = [1, 0, 1, 1, 0]  # Input
target = 1  # This pattern means "1"`,
    `# 📊 AI sees numbers
import numpy as np
X = np.array([1, 0, 1, 1, 0])
print(f"AI sees: {X}")`,
    `# 🧠 Random weights (AI knows nothing!)
weights = np.random.randn(5) * 0.5
print("Weights:", weights)`,
    `# ⚡ Forward pass
def sigmoid(x): return 1/(1+np.exp(-x))
z = np.dot(X, weights)
prediction = sigmoid(z)
print(f"Prediction: {prediction:.3f}")`,
    `# ❌ Calculate loss
target = 1
loss = (prediction - target) ** 2
print(f"Loss: {loss:.4f}")`,
    `# 🔧 Backpropagation
lr = 0.1
gradient = (pred - target) * pred * (1-pred)
weights -= lr * gradient * X`,
    `# 🔄 Training loop
for epoch in range(1000):
    pred = sigmoid(np.dot(X, weights))
    loss = (pred - target) ** 2
    grad = (pred - target) * pred * (1-pred)
    weights -= 0.5 * grad * X`,
    `# ✨ Test on NEW patterns!
test = [1, 1, 0, 1, 0]
pred = sigmoid(np.dot(test, weights))
print(f"New pattern → {pred:.2f} → {'1' if pred>0.5 else '0'}")`
  ];

  const runForward = useCallback(() => {
    let sum = 0;
    for (let i = 0; i < 5; i++) sum += inputs[i] * weights[i];
    const pred = 1 / (1 + Math.exp(-sum));
    setPrediction(pred);
    return pred;
  }, [inputs, weights]);

  const trainStep = useCallback(() => {
    const pred = runForward();
    const error = pred - 1;
    const gradient = error * pred * (1 - pred);
    const newWeights = weights.map((w, i) => w - 0.5 * gradient * inputs[i]);
    setWeights(newWeights);
    const loss = Math.pow(pred - 1, 2);
    setLossHistory(prev => [...prev.slice(-30), loss]);
    setEpoch(e => e + 1);
    setAccuracy(prev => Math.min(99, prev + (100 - prev) * 0.15));
  }, [runForward, weights, inputs]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      if (phase === 6 && epoch < 25) trainStep();
      else if (phase < 7) { setPhase(p => p + 1); if (phase === 2) runForward(); }
      else setIsPlaying(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [isPlaying, phase, epoch, trainStep, runForward]);

  const reset = () => {
    setPhase(0); setIsPlaying(false); setWeights([0.5,-0.3,0.8,0.1,-0.2]);
    setPrediction(0); setEpoch(0); setAccuracy(0); setLossHistory([]);
  };

  return (
    <div style={{ width:'100%', minHeight:'800px', background:'linear-gradient(180deg,#0a0a1a,#1a1a2e)', borderRadius:'20px', padding:'24px', color:'white' }}>
      <div style={{ textAlign:'center', marginBottom:'20px' }}>
        <h1 style={{ fontSize:'32px', fontWeight:800, background:'linear-gradient(135deg,#60a5fa,#a78bfa,#f472b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          🚀 The AI Learning Journey
        </h1>
        <p style={{ color:'#94a3b8' }}>Watch exactly how a neural network learns</p>
      </div>

      <div style={{ display:'flex', justifyContent:'center', gap:'6px', marginBottom:'20px', flexWrap:'wrap' }}>
        {phases.map((p, i) => (
          <button key={i} onClick={() => setPhase(i)} style={{
            padding:'8px 12px', borderRadius:'10px', border:'none', cursor:'pointer',
            background: i === phase ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : i < phase ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)',
            color:'white', fontSize:'12px', fontWeight: i === phase ? 600 : 400
          }}>{i+1}. {p.title.split(' ')[0]}</button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns: showCode ? '1fr 1fr' : '1fr', gap:'20px', marginBottom:'20px' }}>
        <div style={{ background:'rgba(0,0,0,0.4)', borderRadius:'16px', padding:'20px', border:'1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize:'20px', marginBottom:'12px' }}>{phases[phase].title}</h2>
          
          {(phase <= 1) && (
            <div style={{ textAlign:'center', padding:'20px' }}>
              <p style={{ color:'#94a3b8', marginBottom:'12px' }}>Input pattern:</p>
              <div style={{ display:'flex', justifyContent:'center', gap:'8px' }}>
                {inputs.map((v, i) => (
                  <motion.div key={i} initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:i*0.1 }}
                    style={{ width:'45px', height:'45px', borderRadius:'8px', background: v ? '#3b82f6' : '#1e293b',
                    border:'2px solid #334155', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:'bold' }}>
                    {v}
                  </motion.div>
                ))}
              </div>
              <p style={{ marginTop:'16px', color:'#22c55e' }}>Target: This = "1"</p>
            </div>
          )}

          {(phase >= 2 && phase <= 5) && (
            <svg width="100%" height="250" viewBox="0 0 400 250">
              {[0,1,2,3,4].map(i => [0,1,2].map(j => (
                <line key={`c1-${i}-${j}`} x1="60" y1={30+i*45} x2="180" y2={50+j*60} stroke={phase>=3?'#3b82f6':'#334155'} strokeWidth="1.5" opacity="0.5"/>
              )))}
              {[0,1,2].map(i => (
                <line key={`c2-${i}`} x1="180" y1={50+i*60} x2="340" y2="125" stroke={phase>=3?'#a78bfa':'#334155'} strokeWidth="1.5" opacity="0.5"/>
              ))}
              {[0,1,2,3,4].map(i => (
                <g key={`in-${i}`}>
                  <circle cx="60" cy={30+i*45} r="18" fill={inputs[i]?'#3b82f6':'#1e293b'} stroke="#60a5fa" strokeWidth="2"/>
                  <text x="60" y={35+i*45} fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">{inputs[i]}</text>
                  <text x="20" y={35+i*45} fill="#64748b" fontSize="9">{weights[i].toFixed(2)}</text>
                </g>
              ))}
              {[0,1,2].map(i => <circle key={`h-${i}`} cx="180" cy={50+i*60} r="20" fill={phase>=3?'#8b5cf6':'#1e293b'} stroke="#a78bfa" strokeWidth="2"/>)}
              <circle cx="340" cy="125" r="28" fill={phase>=3?(prediction>0.5?'rgba(34,197,94,0.8)':'rgba(239,68,68,0.8)'):'#1e293b'} stroke={prediction>0.5?'#22c55e':'#ef4444'} strokeWidth="3"/>
              {phase>=3 && <text x="340" y="130" fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">{prediction.toFixed(2)}</text>}
              {phase===5 && <><path d="M320 125 L80 125" stroke="#ef4444" strokeWidth="3" strokeDasharray="8,4"/><text x="200" y="115" fill="#ef4444" fontSize="11" textAnchor="middle">← Adjusting weights ←</text></>}
            </svg>
          )}

          {phase === 6 && (
            <div style={{ padding:'10px' }}>
              <div style={{ display:'flex', gap:'16px', marginBottom:'16px' }}>
                <div style={{ flex:1, background:'rgba(59,130,246,0.2)', borderRadius:'12px', padding:'12px', textAlign:'center' }}>
                  <div style={{ fontSize:'11px', color:'#94a3b8' }}>Epoch</div>
                  <div style={{ fontSize:'28px', fontWeight:'bold', color:'#60a5fa' }}>{epoch}</div>
                </div>
                <div style={{ flex:1, background:'rgba(34,197,94,0.2)', borderRadius:'12px', padding:'12px', textAlign:'center' }}>
                  <div style={{ fontSize:'11px', color:'#94a3b8' }}>Accuracy</div>
                  <div style={{ fontSize:'28px', fontWeight:'bold', color:'#22c55e' }}>{accuracy.toFixed(0)}%</div>
                </div>
              </div>
              <div style={{ background:'rgba(0,0,0,0.3)', borderRadius:'10px', padding:'12px', height:'100px' }}>
                <div style={{ fontSize:'11px', color:'#94a3b8', marginBottom:'6px' }}>Loss (lower = better)</div>
                <svg width="100%" height="70" viewBox="0 0 200 70">
                  {lossHistory.length > 1 && <path d={lossHistory.map((l,i) => `${i===0?'M':'L'} ${i*6.5} ${60-l*100}`).join(' ')} fill="none" stroke="#ef4444" strokeWidth="2"/>}
                  <line x1="0" y1="60" x2="200" y2="60" stroke="#334155"/>
                </svg>
              </div>
            </div>
          )}

          {phase === 7 && (
            <div style={{ textAlign:'center', padding:'30px' }}>
              <motion.div initial={{ scale:0 }} animate={{ scale:1 }} style={{ fontSize:'60px', marginBottom:'16px' }}>🎉</motion.div>
              <h3 style={{ fontSize:'22px', color:'#22c55e', marginBottom:'8px' }}>The AI Has Learned!</h3>
              <p style={{ color:'#94a3b8' }}>Final accuracy: <span style={{ color:'#22c55e', fontWeight:'bold' }}>{accuracy.toFixed(0)}%</span></p>
            </div>
          )}

          <div style={{ marginTop:'16px', padding:'14px', background:'rgba(255,255,255,0.05)', borderRadius:'10px', borderLeft:'3px solid #3b82f6' }}>
            <p style={{ color:'#e2e8f0', fontSize:'14px', lineHeight:'1.5' }}>{phases[phase].desc}</p>
          </div>
        </div>

        {showCode && (
          <div style={{ background:'#0d1117', borderRadius:'16px', border:'1px solid #30363d', overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'#161b22', borderBottom:'1px solid #30363d' }}>
              <div style={{ display:'flex', gap:'6px' }}>
                <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#ff5f56' }}/>
                <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#ffbd2e' }}/>
                <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#27ca40' }}/>
              </div>
              <span style={{ color:'#8b949e', fontSize:'12px' }}>neural_network.py</span>
            </div>
            <pre style={{ padding:'14px', margin:0, fontSize:'12px', lineHeight:'1.5', color:'#c9d1d9', fontFamily:'monospace', overflow:'auto', maxHeight:'400px' }}>
              {codeSnippets[phase]}
            </pre>
          </div>
        )}
      </div>

      <div style={{ display:'flex', justifyContent:'center', gap:'12px', flexWrap:'wrap' }}>
        <button onClick={() => setPhase(Math.max(0,phase-1))} disabled={phase===0} style={{ padding:'10px 20px', borderRadius:'10px', border:'none', background: phase===0?'#1e293b':'rgba(255,255,255,0.1)', color: phase===0?'#475569':'white', cursor: phase===0?'default':'pointer' }}>← Previous</button>
        <button onClick={() => { setIsPlaying(!isPlaying); if(!isPlaying && phase===6){ setEpoch(0); setLossHistory([]); }}} style={{ padding:'12px 32px', borderRadius:'10px', border:'none', background: isPlaying?'linear-gradient(135deg,#ef4444,#f97316)':'linear-gradient(135deg,#3b82f6,#8b5cf6)', color:'white', cursor:'pointer', fontWeight:600 }}>{isPlaying ? '⏸ Pause' : '▶ Play'}</button>
        <button onClick={() => setPhase(Math.min(7,phase+1))} disabled={phase===7} style={{ padding:'10px 20px', borderRadius:'10px', border:'none', background: phase===7?'#1e293b':'rgba(255,255,255,0.1)', color: phase===7?'#475569':'white', cursor: phase===7?'default':'pointer' }}>Next →</button>
        <button onClick={reset} style={{ padding:'10px 16px', borderRadius:'10px', border:'1px solid #334155', background:'transparent', color:'#94a3b8', cursor:'pointer' }}>↺ Reset</button>
        <button onClick={() => setShowCode(!showCode)} style={{ padding:'10px 16px', borderRadius:'10px', border:'1px solid #334155', background: showCode?'rgba(59,130,246,0.2)':'transparent', color: showCode?'#60a5fa':'#94a3b8', cursor:'pointer' }}>{showCode ? '👁 Hide Code' : '👁 Show Code'}</button>
      </div>
    </div>
  );
}
