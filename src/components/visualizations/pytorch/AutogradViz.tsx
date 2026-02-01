"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AutogradViz() {
  const [step, setStep] = useState(0);

  const x = 2.0, w = 3.0, b = 1.0;
  const y = w * x + b;
  const target = 10.0;
  const loss = (y - target) ** 2;
  const dLoss_dy = 2 * (y - target);
  const dLoss_dw = dLoss_dy * x;
  const dLoss_db = dLoss_dy * 1;

  const steps = [
    { title: 'Forward Pass', desc: 'Compute y = w×x + b' },
    { title: 'Compute Loss', desc: 'Loss = (y - target)²' },
    { title: 'Backward Pass', desc: 'Compute gradients' },
    { title: 'Update Weights', desc: 'w -= lr × gradient' },
  ];

  return (
    <div style={{
      width: '100%', minHeight: '650px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>⚡ Autograd</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Automatic gradient computation</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            padding: '10px 16px', borderRadius: '8px',
            background: step === i ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
            border: `2px solid ${step >= i ? '#8b5cf6' : '#334155'}`,
            color: 'white', cursor: 'pointer', fontSize: '11px',
          }}>
            {i + 1}. {s.title}
          </button>
        ))}
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <motion.div animate={{ scale: step === 0 ? [1, 1.05, 1] : 1 }} transition={{ repeat: step === 0 ? Infinity : 0, duration: 1 }}
              style={{ padding: '12px 20px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#93c5fd' }}>x</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{x}</div>
            </motion.div>
            <motion.div animate={{ scale: step === 3 ? [1, 1.05, 1] : 1, boxShadow: step >= 2 ? '0 0 15px #22c55e' : 'none' }}
              style={{ padding: '12px 20px', borderRadius: '10px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#bbf7d0' }}>w</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{w}</div>
              {step >= 2 && <div style={{ fontSize: '10px', color: '#fef08a' }}>∇={dLoss_dw}</div>}
            </motion.div>
            <motion.div animate={{ scale: step === 3 ? [1, 1.05, 1] : 1, boxShadow: step >= 2 ? '0 0 15px #f97316' : 'none' }}
              style={{ padding: '12px 20px', borderRadius: '10px', background: 'linear-gradient(135deg, #f97316, #ea580c)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#fed7aa' }}>b</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{b}</div>
              {step >= 2 && <div style={{ fontSize: '10px', color: '#fef08a' }}>∇={dLoss_db}</div>}
            </motion.div>
          </div>

          <motion.div animate={{ x: step === 0 ? [0, 5, 0] : 0 }} style={{ fontSize: '20px', color: step === 0 ? '#22c55e' : '#64748b' }}>→</motion.div>

          <motion.div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.3)', border: '2px solid #8b5cf6', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#c4b5fd' }}>y = w×x + b</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#8b5cf6' }}>{y}</div>
          </motion.div>

          <motion.div animate={{ x: step === 1 ? [0, 5, 0] : 0 }} style={{ fontSize: '20px', color: step === 1 ? '#ef4444' : '#64748b' }}>→</motion.div>

          <motion.div animate={{ scale: step === 1 ? [1, 1.05, 1] : 1 }}
            style={{ padding: '16px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.3)', border: '2px solid #ef4444', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#fca5a5' }}>Loss</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ef4444' }}>{loss}</div>
          </motion.div>
        </div>

        {step >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', marginTop: '16px', color: '#fef08a', fontSize: '13px' }}>
            ← Gradients flow backward (chain rule) ←
          </motion.div>
        )}
      </div>

      <div style={{ background: `rgba(139, 92, 246, 0.1)`, border: '2px solid rgba(139, 92, 246, 0.5)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
        <h4 style={{ color: '#8b5cf6', marginBottom: '8px' }}>{steps[step].title}</h4>
        <p style={{ color: '#e2e8f0', fontSize: '14px' }}>
          {step === 0 && `y = ${w} × ${x} + ${b} = ${y}`}
          {step === 1 && `Loss = (${y} - ${target})² = ${loss}`}
          {step === 2 && `∂Loss/∂w = ${dLoss_dy} × ${x} = ${dLoss_dw}`}
          {step === 3 && `w_new = ${w} - 0.01 × ${dLoss_dw} = ${(w - 0.01 * dLoss_dw).toFixed(2)}`}
        </p>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '14px' }}>
        <pre style={{ fontFamily: 'monospace', fontSize: '11px', color: '#22c55e', margin: 0 }}>
{`w = torch.tensor(${w}, requires_grad=True)
y = w * ${x} + ${b}
loss = (y - ${target}) ** 2
loss.backward()  # Autograd magic!
print(w.grad)    # tensor(${dLoss_dw}.)`}
        </pre>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
          style={{ padding: '8px 20px', borderRadius: '8px', background: step === 0 ? '#334155' : '#475569', border: 'none', color: 'white', cursor: step === 0 ? 'not-allowed' : 'pointer' }}>
          ← Prev
        </button>
        <button onClick={() => setStep(Math.min(3, step + 1))} disabled={step === 3}
          style={{ padding: '8px 20px', borderRadius: '8px', background: step === 3 ? '#334155' : '#8b5cf6', border: 'none', color: 'white', cursor: step === 3 ? 'not-allowed' : 'pointer' }}>
          Next →
        </button>
      </div>
    </div>
  );
}
