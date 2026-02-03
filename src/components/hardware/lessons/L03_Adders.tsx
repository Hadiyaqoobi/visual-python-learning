"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => setStep(prev => (prev + 1) % 6), 2000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const humanSteps = [
    { label: 'Start from rightmost column', desc: 'Just like adding 47 + 35 by hand, computers add from right to left, one column at a time.', colHighlight: 3 },
    { label: 'Add column: 1 + 1 = 10', desc: 'In binary, 1+1 = 10 (that is "2" in binary). Write 0, carry the 1 to the next column.', colHighlight: 3 },
    { label: 'Add column: 0 + 1 + carry = 10', desc: 'The carry from the previous column joins in. 0+1+1 = 10. Write 0, carry 1 again.', colHighlight: 2 },
    { label: 'Add column: 1 + 0 + carry = 10', desc: 'Another carry propagation. 1+0+1 = 10. Write 0, carry 1.', colHighlight: 1 },
    { label: 'Add column: 0 + 1 + carry = 10', desc: 'Final column. 0+1+1 = 10. Write 0, carry 1 into a new column.', colHighlight: 0 },
    { label: 'Result: 10000 (16)', desc: '0101 (5) + 1011 (11) = 10000 (16). The carry rippled through every column — this is called RIPPLE CARRY addition.', colHighlight: -1 },
  ];

  const aBits = [0, 1, 0, 1];
  const bBits = [1, 0, 1, 1];
  const carries = [1, 1, 1, 1, 0];
  const sumBits = [1, 0, 0, 0, 0];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Addition: The Foundation of All Math</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        When you add numbers by hand, you work right to left, carrying digits. Computers do the <strong>exact same thing</strong> — but in binary, where the only digits are 0 and 1.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        The circuit that performs binary addition is called an <strong>adder</strong>. It is built entirely from logic gates (XOR for the sum, AND for the carry). Adders are the most fundamental arithmetic circuit — subtraction, multiplication, and even division are built on top of addition.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        Watch the animation below to see how binary addition works, column by column, with carries rippling through:
      </p>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 24, border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {['C', '', '', '', ''].map((_, i) => (
            <div key={i} style={{ width: 56, textAlign: 'center' }}>
              {i === 0 && <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>Carry</div>}
              {i > 0 && <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>Bit {4 - i}</div>}
            </div>
          ))}
        </div>

        {/* Carry row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
          {carries.map((c, i) => (
            <motion.div key={i}
              animate={{ opacity: step >= (4 - i) ? 1 : 0.15, background: step >= (4 - i) && c ? '#ef4444' : '#1f2937', scale: humanSteps[step]?.colHighlight === i ? 1.15 : 1 }}
              style={{ width: 56, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: c ? 'white' : '#4b5563', fontFamily: 'monospace', border: '1px solid #374151' }}>
              {c}
            </motion.div>
          ))}
        </div>

        {/* A row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 56 }} />
          {aBits.map((b, i) => (
            <motion.div key={i}
              animate={{ background: humanSteps[step]?.colHighlight === i ? '#3b82f6' : '#1e3a5f', scale: humanSteps[step]?.colHighlight === i ? 1.1 : 1 }}
              style={{ width: 56, height: 44, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: 'white', fontFamily: 'monospace', border: '2px solid #3b82f6' }}>
              {b}
            </motion.div>
          ))}
        </div>

        {/* + B row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#f97316', fontWeight: 700 }}>+</div>
          {bBits.map((b, i) => (
            <motion.div key={i}
              animate={{ background: humanSteps[step]?.colHighlight === i ? '#f97316' : '#5c3a1e', scale: humanSteps[step]?.colHighlight === i ? 1.1 : 1 }}
              style={{ width: 56, height: 44, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: 'white', fontFamily: 'monospace', border: '2px solid #f97316' }}>
              {b}
            </motion.div>
          ))}
        </div>

        {/* Separator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '8px 0' }}>
          {[0,1,2,3,4].map(i => <div key={i} style={{ width: 56, height: 2, background: '#475569' }} />)}
        </div>

        {/* Result row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {sumBits.map((b, i) => (
            <motion.div key={i}
              animate={{ opacity: step >= (5 - i) ? 1 : 0.15, background: step >= (5 - i) ? '#22c55e' : '#1f2937', scale: step === 5 ? [1, 1.1, 1] : 1 }}
              transition={{ delay: step === 5 ? i * 0.1 : 0 }}
              style={{ width: 56, height: 44, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: 'white', fontFamily: 'monospace', border: '2px solid #22c55e' }}>
              {b}
            </motion.div>
          ))}
        </div>

        {/* Step indicator */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#22c55e', marginBottom: 4 }}>Step {step + 1}: {humanSteps[step].label}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>{humanSteps[step].desc}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          {humanSteps.map((_, i) => (
            <motion.button key={i} onClick={() => { setAutoPlay(false); setStep(i); }}
              animate={{ background: i === step ? '#22c55e' : '#374151' }}
              style={{ width: 12, height: 12, borderRadius: 6, border: 'none', cursor: 'pointer' }} />
          ))}
          <button onClick={() => setAutoPlay(!autoPlay)}
            style={{ marginLeft: 12, padding: '4px 12px', borderRadius: 6, border: 'none', background: autoPlay ? '#ef4444' : '#22c55e', color: 'white', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
            {autoPlay ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <h4 style={{ margin: '0 0 8px', color: '#1d4ed8' }}>Binary Addition Rules</h4>
          <div style={{ fontFamily: 'monospace', fontSize: 15, color: '#1e40af', lineHeight: 2.2 }}>
            <div>0 + 0 = 0</div>
            <div>0 + 1 = 1</div>
            <div>1 + 0 = 1</div>
            <div>1 + 1 = <strong>10</strong> (0 with carry 1)</div>
            <div>1 + 1 + 1 = <strong>11</strong> (1 with carry 1)</div>
          </div>
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 8px', color: '#166534' }}>The Gate Recipe</h4>
          <p style={{ margin: 0, color: '#15803d', lineHeight: 1.8, fontSize: 14 }}>
            <strong>Sum bit</strong> = A XOR B XOR Carry-in<br/>
            <strong>Carry-out</strong> = (A AND B) OR (Carry-in AND (A XOR B))<br/><br/>
            Just 2 XOR gates, 2 AND gates, and 1 OR gate per bit. That is 5 gates to add one column. An 8-bit adder needs 40 gates. A 64-bit adder: 320 gates.
          </p>
        </div>
      </div>
    </div>
  );
}

function Layer2() {
  const [numA, setNumA] = useState(5);
  const [numB, setNumB] = useState(11);
  const [showSteps, setShowSteps] = useState(true);

  const toBin8 = (n: number) => ((n & 0xFF)).toString(2).padStart(8, '0');
  const result = (numA + numB) & 0xFF;
  const carry = numA + numB > 255;

  const computeSteps = () => {
    const steps = [];
    let carryBit = 0;
    const aBits = toBin8(numA).split('').map(Number).reverse();
    const bBits = toBin8(numB).split('').map(Number).reverse();
    for (let i = 0; i < 8; i++) {
      const a = aBits[i], b = bBits[i];
      const sum = a + b + carryBit;
      const resultBit = sum % 2;
      const carryOut = Math.floor(sum / 2);
      steps.push({ bit: i, a, b, carryIn: carryBit, sum: resultBit, carryOut });
      carryBit = carryOut;
    }
    if (carryBit) steps.push({ bit: 8, a: 0, b: 0, carryIn: carryBit, sum: 0, carryOut: 0 });
    return steps;
  };

  const steps = computeSteps();

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>8-Bit Adder Simulator</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
        Change the inputs and watch the full adder chain process each bit. Every step shows the XOR (sum) and AND (carry) gate outputs.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#1d4ed8', display: 'block', marginBottom: 8 }}>
            A: <span style={{ fontFamily: 'monospace', fontSize: 24 }}>{numA}</span>
            <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>({toBin8(numA)})</span>
          </label>
          <input type="range" min={0} max={255} value={numA} onChange={e => setNumA(+e.target.value)} style={{ width: '100%', accentColor: '#3b82f6' }} />
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#fff7ed', border: '1px solid #fed7aa' }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#c2410c', display: 'block', marginBottom: 8 }}>
            B: <span style={{ fontFamily: 'monospace', fontSize: 24 }}>{numB}</span>
            <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>({toBin8(numB)})</span>
          </label>
          <input type="range" min={0} max={255} value={numB} onChange={e => setNumB(+e.target.value)} style={{ width: '100%', accentColor: '#f97316' }} />
        </div>
      </div>

      {/* Binary visualization */}
      <div style={{ padding: 24, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 50, fontSize: 12, fontWeight: 600, color: '#3b82f6', textAlign: 'right' }}>A:</div>
          <div style={{ display: 'flex', gap: 3 }}>
            {toBin8(numA).split('').map((b, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: 6, background: b === '1' ? '#3b82f6' : '#e2e8f0', color: b === '1' ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: 'monospace', fontSize: 16 }}>{b}</div>
            ))}
          </div>
          <span style={{ fontFamily: 'monospace', color: '#3b82f6', fontWeight: 700 }}>= {numA}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 50, fontSize: 12, fontWeight: 600, color: '#f97316', textAlign: 'right' }}>+ B:</div>
          <div style={{ display: 'flex', gap: 3 }}>
            {toBin8(numB).split('').map((b, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: 6, background: b === '1' ? '#f97316' : '#e2e8f0', color: b === '1' ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: 'monospace', fontSize: 16 }}>{b}</div>
            ))}
          </div>
          <span style={{ fontFamily: 'monospace', color: '#f97316', fontWeight: 700 }}>= {numB}</span>
        </div>
        <div style={{ height: 2, background: '#cbd5e1', margin: '8px 0 8px 62px', width: 300 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 50, fontSize: 12, fontWeight: 600, color: '#22c55e', textAlign: 'right' }}>=</div>
          <div style={{ display: 'flex', gap: 3 }}>
            {(carry ? '1' : '').concat(toBin8(result)).split('').map((b, i) => (
              <motion.div key={i} initial={{ scale: 1.2 }} animate={{ scale: 1 }}
                style={{ width: 36, height: 36, borderRadius: 6, background: b === '1' ? '#22c55e' : '#e2e8f0', color: b === '1' ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: 'monospace', fontSize: 16 }}>{b}</motion.div>
            ))}
          </div>
          <span style={{ fontFamily: 'monospace', color: '#22c55e', fontWeight: 700 }}>= {numA + numB}</span>
          {carry && <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, padding: '2px 8px', background: '#fef2f2', borderRadius: 4 }}>OVERFLOW</span>}
        </div>
      </div>

      {/* Step-by-step gate operations */}
      <button onClick={() => setShowSteps(!showSteps)}
        style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 14, marginBottom: 16 }}>
        {showSteps ? 'Hide' : 'Show'} Gate-by-Gate Breakdown
      </button>
      {showSteps && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
          {steps.slice(0, 8).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ padding: 14, borderRadius: 10, background: s.carryOut ? '#fff7ed' : '#f8fafc', border: '1px solid ' + (s.carryOut ? '#fed7aa' : '#e2e8f0') }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>Bit {s.bit} (2^{s.bit} = {Math.pow(2, s.bit)})</div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#475569', lineHeight: 1.8 }}>
                <div>A={s.a} XOR B={s.b} XOR Cin={s.carryIn}</div>
                <div>Sum = <span style={{ color: '#22c55e', fontWeight: 700 }}>{s.sum}</span></div>
                <div>Carry = <span style={{ color: s.carryOut ? '#ef4444' : '#94a3b8', fontWeight: 700 }}>{s.carryOut}</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'Half Adder: The Simplest Circuit', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>A half adder adds two single bits with no carry input. It needs just 2 gates:</p>
        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 14, lineHeight: 2.2, color: '#1e293b' }}>
            <div><strong>Sum</strong> = A XOR B &nbsp;&nbsp;(1 when inputs differ)</div>
            <div><strong>Carry</strong> = A AND B &nbsp;&nbsp;(1 when both inputs are 1)</div>
            <div style={{ marginTop: 8 }}>Truth table:</div>
            <div>A=0 B=0: Sum=0 Carry=0 &nbsp;(0+0=0)</div>
            <div>A=0 B=1: Sum=1 Carry=0 &nbsp;(0+1=1)</div>
            <div>A=1 B=0: Sum=1 Carry=0 &nbsp;(1+0=1)</div>
            <div>A=1 B=1: Sum=0 Carry=<span style={{ color: '#ef4444', fontWeight: 700 }}>1</span> &nbsp;(1+1=10)</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>The half adder is called "half" because it cannot accept a carry from a previous stage. It can only add the very first (rightmost) bit position. For all other positions, we need a full adder.</p>
      </div>
    )},
    { title: 'Full Adder: Handling the Carry Chain', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>A full adder adds three bits: A, B, and Carry-in. It is built from two half adders plus an OR gate (5 gates total):</p>
        <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 14, lineHeight: 2.2, color: '#166534' }}>
            <div><strong>Sum</strong> = A XOR B XOR Cin</div>
            <div><strong>Cout</strong> = (A AND B) OR (Cin AND (A XOR B))</div>
            <div style={{ marginTop: 8 }}>Key cases:</div>
            <div>A=1 B=1 Cin=0: Sum=0, Cout=1 &nbsp;(two 1s = carry)</div>
            <div>A=1 B=0 Cin=1: Sum=0, Cout=1 &nbsp;(two 1s = carry)</div>
            <div>A=1 B=1 Cin=1: Sum=1, Cout=1 &nbsp;(three 1s = 11)</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>The full adder is the workhorse of all arithmetic. Chain N full adders together (with a half adder for bit 0) and you get an N-bit ripple carry adder. Each stage waits for the carry from the previous stage before it can finalize its output.</p>
      </div>
    )},
    { title: 'Ripple Carry vs Carry Lookahead', color: '#8b5cf6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}><strong>Ripple carry</strong> is simple but slow. Each bit must wait for the previous carry. For 64 bits, the carry ripples through 64 stages sequentially. If each gate has 25ps delay, the critical path is about 64 x 2 = 128 gate delays = 3.2ns. That limits clock speed to ~300 MHz.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ padding: 16, borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca' }}>
            <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>Ripple Carry</div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
              Simple: N full adders in a chain<br/>
              Delay: O(N) gate delays<br/>
              64-bit: ~128 gate delays<br/>
              Good for: small adders, low power
            </div>
          </div>
          <div style={{ padding: 16, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div style={{ fontWeight: 700, color: '#166534', marginBottom: 4 }}>Carry Lookahead</div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
              Complex: precomputes all carries<br/>
              Delay: O(log N) gate delays<br/>
              64-bit: ~12 gate delays<br/>
              Good for: high-speed CPUs
            </div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}><strong>Carry lookahead</strong> uses extra gates to compute carries in parallel. It defines two signals per bit: <em>Generate</em> (G = A AND B, definitely produces carry) and <em>Propagate</em> (P = A XOR B, passes carry through). Using G and P, all carries can be computed in O(log N) time. Modern CPUs use hybrid designs combining both approaches.</p>
      </div>
    )},
    { title: 'Subtraction Through Addition', color: '#ef4444', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>The adder does double duty. To subtract A - B, the ALU:</p>
        <div style={{ padding: 16, background: '#fef2f2', borderRadius: 12, border: '1px solid #fecaca', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 14, lineHeight: 2.2, color: '#991b1b' }}>
            <div>1. Flip all bits of B using XOR gates (controlled by SUB signal)</div>
            <div>2. Set the initial carry-in to 1</div>
            <div>3. Add normally: A + NOT(B) + 1 = A + (-B) = A - B</div>
            <div style={{ marginTop: 8 }}>Example: 7 - 3 in 4-bit:</div>
            <div>B = 0011, NOT(B) = 1100, NOT(B)+1 = 1101 = -3</div>
            <div>0111 + 1101 = <span style={{ color: '#22c55e' }}>1</span>0100 = 0100 = 4 (ignore overflow carry)</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>This is the beauty of twos complement: addition and subtraction use the SAME circuit. The only difference is XOR gates on the B input and a 1 on the carry-in. This saves enormous chip area compared to having separate addition and subtraction hardware.</p>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Adder Architecture Deep Dive</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>From half adders to carry lookahead — the engineering of fast addition.</p>
      {sections.map((s, i) => (
        <motion.div key={i} style={{ marginBottom: 12, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <motion.button onClick={() => setExpanded(expanded === i ? null : i)} whileHover={{ backgroundColor: '#f8fafc' }}
            style={{ width: '100%', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16, border: 'none', background: expanded === i ? s.color + '08' : 'white', cursor: 'pointer', textAlign: 'left', borderLeft: '4px solid ' + s.color }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: expanded === i ? s.color : s.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: expanded === i ? 'white' : s.color, fontWeight: 800, fontSize: 16 }}>{i + 1}</div>
            <div style={{ flex: 1, fontWeight: 700, fontSize: 16, color: '#1e293b' }}>{s.title}</div>
            <motion.div animate={{ rotate: expanded === i ? 180 : 0 }} style={{ fontSize: 20, color: '#94a3b8' }}>v</motion.div>
          </motion.button>
          <AnimatePresence>
            {expanded === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ padding: '8px 24px 24px', borderTop: '1px solid #e2e8f0' }}>{s.content}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

function Layer4() {
  return (
    <PythonConnection
      code={`# Python addition maps directly to the adder circuit
a, b = 42, 15

# Simple addition -> single adder operation
a + b    # 57: one pass through the ripple carry chain

# Subtraction -> adder with twos complement
a - b    # 27: ALU flips b, sets carry-in to 1, adds

# Under the hood: binary addition
bin(42)     # '0b101010'
bin(15)     # '0b001111'
bin(42+15)  # '0b111001' = 57

# Overflow detection
a = 200
b = 100
result = (a + b) & 0xFF  # 44! (300 mod 256)
# The carry flag would be SET in hardware

# Twos complement subtraction manually
def subtract_8bit(a, b):
    not_b = (~b) & 0xFF     # flip bits
    result = a + not_b + 1  # add with carry-in=1
    return result & 0xFF    # mask to 8 bits

subtract_8bit(42, 15)  # 27 - same as 42 - 15!

# Python ints have unlimited precision
# but hardware adders are fixed-width (32 or 64 bit)
2**64 + 1  # Python handles this fine
# CPU would need multiple add instructions`}
      explanation="Python + and - operators compile directly to the CPU adder circuit. Addition is a single ripple through the carry chain. Subtraction uses the same adder with twos complement. Python hides overflow by using arbitrary-precision integers, but in hardware, 8-bit 200+100 really does give 44 (with carry flag set). Languages like C/Rust expose this fixed-width behavior."
      hardwareNote="A 64-bit carry-lookahead adder completes in about 12 gate delays (~0.3ns at modern process nodes). The adder is the most time-critical component in the ALU because almost every instruction uses it: ADD, SUB, address calculation, branch target computation, and loop counter increment."
    />
  );
}

function Layer5() {
  const apps = [
    { icon: '\u{1F4B0}', title: 'Financial Computing',
      desc: 'Every bank transaction, stock trade, and cryptocurrency operation relies on adders. Bitcoin mining hashes (SHA-256) use modular addition as a core operation.',
      detail: 'A single SHA-256 hash requires 64 rounds of addition. Bitcoin miners compute trillions of hashes per second, each needing hundreds of adder operations.' },
    { icon: '\u{1F3AE}', title: '3D Graphics',
      desc: 'Vertex positions, normals, colors — all computed with vector addition. Each frame of a game requires millions of 3D vector additions (three adds per vector).',
      detail: 'position = position + velocity * dt is computed for every vertex every frame. A character model might have 50,000 vertices, all needing vector addition 60x/sec.' },
    { icon: '\u{1F4F1}', title: 'Digital Signal Processing',
      desc: 'Audio processing, radio signals, sensor data — all use multiply-accumulate (MAC) operations that chain multipliers and adders together at high speed.',
      detail: 'A digital audio filter computing 48kHz stereo audio needs ~10 million additions per second. 5G baseband processors use thousands of parallel adders.' },
    { icon: '\u{1F9EC}', title: 'Scientific Simulation',
      desc: 'Climate models, protein folding, fluid dynamics — all numerical simulations are fundamentally massive chains of floating-point additions.',
      detail: 'Floating-point adders are more complex: they must align exponents, add mantissas, then normalize. An FP add takes 3-5 cycles vs 1 cycle for integer add.' },
    { icon: '\u{1F680}', title: 'Address Calculation',
      desc: 'Every memory access requires addition: base address + offset. Array indexing (arr[i]) computes base + i * element_size using adders.',
      detail: 'Modern CPUs have DEDICATED adders just for address generation (AGUs), separate from the main ALU. Intel CPUs have 2-3 AGUs running in parallel.' },
    { icon: '\u{1F916}', title: 'Neural Network Training',
      desc: 'Backpropagation accumulates gradients using millions of additions. The optimizer step (weight += learning_rate * gradient) is an add for every parameter.',
      detail: 'GPT-3 has 175 billion parameters. Each training step requires at least 175 billion additions just for the weight update, plus billions more for forward/backward passes.' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Addition Powers Everything</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>Addition is the most fundamental operation. Subtraction, multiplication, division, and even floating-point math are all built on adders.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
        {apps.map(app => (
          <motion.div key={app.title} whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
            style={{ padding: 24, borderRadius: 16, background: 'white', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{app.icon}</div>
            <h3 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: 18, fontWeight: 700 }}>{app.title}</h3>
            <p style={{ margin: '0 0 12px', color: '#475569', fontSize: 14, lineHeight: 1.7 }}>{app.desc}</p>
            <div style={{ padding: 12, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: 13, lineHeight: 1.6, fontStyle: 'italic' }}>{app.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div style={{ marginTop: 32, padding: 24, borderRadius: 16, background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white', textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>PERSPECTIVE</div>
        <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>5 gates per bit = all arithmetic</div>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: 15, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
          A full adder is just 2 XOR + 2 AND + 1 OR gate. Chain 64 of these together and you can add any two numbers a CPU can hold. Add twos complement and you get subtraction for free.
        </p>
      </div>
    </div>
  );
}

export default function L03_Adders() {
  return (
    <LessonWrapper lessonId="L03" title="Adders & Binary Arithmetic"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'Adding by Hand', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: '8-Bit Adder', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'Adder Architecture', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python Arithmetic', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'Addition Powers All', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'Manual Addition', description: 'Add 10110011 + 01101010 by hand showing all carries.' },
        { id: 'c2', title: 'Subtraction', description: 'Compute 42 - 15 using twos complement addition on paper.' },
        { id: 'c3', title: 'Overflow', description: 'What happens when you add 200 + 200 in 8-bit unsigned? What about signed?' },
      ]}
    />
  );
}
