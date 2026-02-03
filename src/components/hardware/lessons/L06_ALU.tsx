"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [animStep, setAnimStep] = useState(0);
  const [showingOp, setShowingOp] = useState('ADD');

  useEffect(() => {
    const timer = setInterval(() => setAnimStep(prev => (prev + 1) % 5), 1800);
    return () => clearInterval(timer);
  }, []);

  const ops = [
    { name: 'ADD', symbol: '+', desc: 'Combines two numbers', example: '5 + 3 = 8', color: '#3b82f6' },
    { name: 'SUB', symbol: '-', desc: 'Finds the difference', example: '7 - 2 = 5', color: '#ef4444' },
    { name: 'AND', symbol: '&', desc: 'Keeps only shared 1-bits', example: '1101 & 1011 = 1001', color: '#22c55e' },
    { name: 'OR', symbol: '|', desc: 'Keeps any 1-bit', example: '1101 | 1011 = 1111', color: '#f97316' },
    { name: 'XOR', symbol: '^', desc: 'Keeps bits that differ', example: '1101 ^ 1011 = 0110', color: '#8b5cf6' },
    { name: 'NOT', symbol: '~', desc: 'Flips every bit', example: '~1101 = 0010', color: '#ec4899' },
    { name: 'CMP', symbol: '==', desc: 'Sets flags for branching', example: '5 == 5 -> Zero flag', color: '#06b6d4' },
  ];
  const activeOp = ops.find(o => o.name === showingOp) || ops[0];
  const steps = [
    { label: 'Input A loads' }, { label: 'Input B loads' },
    { label: 'Opcode selects op' }, { label: 'ALU computes' }, { label: 'Result + flags out' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>The Brain's Calculator</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        Every computation your computer performs flows through one critical circuit: the <strong>Arithmetic Logic Unit (ALU)</strong>.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        It takes two numbers in, an operation code telling it what to do, and produces a result plus status flags, all in a single clock cycle (about 0.25 nanoseconds at 4 GHz). That is 4 <strong>billion</strong> operations every second.
      </p>
      <div style={{ position: 'relative', background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 40, marginBottom: 32, border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, position: 'relative', flexWrap: 'wrap' }}>
          <motion.div animate={{ scale: animStep === 0 ? [1, 1.1, 1] : 1, boxShadow: animStep === 0 ? '0 0 30px #3b82f688' : '0 0 10px #3b82f622' }}
            style={{ padding: '16px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', border: '2px solid #3b82f6', textAlign: 'center', minWidth: 100 }}>
            <div style={{ fontSize: 10, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Input A</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'white', fontFamily: 'monospace' }}>0101</div>
            <div style={{ fontSize: 11, color: '#93c5fd', marginTop: 2 }}>(5)</div>
          </motion.div>
          <motion.div animate={{ opacity: animStep >= 1 ? 1 : 0.3 }} style={{ fontSize: 24, color: '#3b82f6' }}>-&gt;</motion.div>
          <motion.div animate={{ scale: animStep === 3 ? [1, 1.08, 1] : 1, boxShadow: animStep === 3 ? '0 0 50px ' + activeOp.color + '88' : 'none' }}
            style={{ padding: '24px 32px', borderRadius: 16, background: activeOp.color + '15', border: '3px solid ' + activeOp.color, textAlign: 'center', minWidth: 140, position: 'relative' }}>
            <motion.div animate={{ opacity: animStep >= 2 ? 1 : 0.3 }}
              style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', padding: '3px 12px', borderRadius: 20, background: activeOp.color, fontSize: 10, color: 'white', fontWeight: 700 }}>
              OPCODE: {activeOp.name}
            </motion.div>
            <div style={{ fontSize: 12, color: activeOp.color, fontWeight: 600, marginBottom: 8, marginTop: 4 }}>ALU</div>
            <motion.div animate={{ rotate: animStep === 3 ? [0, 360] : 0 }} transition={{ duration: 0.6 }}
              style={{ fontSize: 40, fontWeight: 800, color: activeOp.color }}>{activeOp.symbol}</motion.div>
          </motion.div>
          <motion.div animate={{ opacity: animStep >= 4 ? 1 : 0.3 }} style={{ fontSize: 24, color: '#22c55e' }}>-&gt;</motion.div>
          <motion.div animate={{ scale: animStep === 4 ? [1, 1.1, 1] : 1, boxShadow: animStep === 4 ? '0 0 30px #22c55e88' : '0 0 10px #22c55e22' }}
            style={{ padding: '16px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #166534, #22c55e)', border: '2px solid #22c55e', textAlign: 'center', minWidth: 100 }}>
            <div style={{ fontSize: 10, color: '#86efac', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Result</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'white', fontFamily: 'monospace' }}>1000</div>
            <div style={{ fontSize: 11, color: '#86efac', marginTop: 2 }}>(8)</div>
          </motion.div>
          <motion.div animate={{ scale: animStep === 1 ? [1, 1.1, 1] : 1 }}
            style={{ position: 'absolute', bottom: 12, left: '22%', padding: '12px 20px', borderRadius: 12, background: 'linear-gradient(135deg, #c2410c, #f97316)', border: '2px solid #f97316', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: '#fed7aa', textTransform: 'uppercase', letterSpacing: 1 }}>Input B</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'white', fontFamily: 'monospace' }}>0011</div>
            <div style={{ fontSize: 10, color: '#fed7aa' }}>(3)</div>
          </motion.div>
          <motion.div animate={{ opacity: animStep >= 4 ? 1 : 0.3 }}
            style={{ position: 'absolute', bottom: 12, right: '15%', padding: '10px 16px', borderRadius: 12, background: '#1e293b', border: '2px solid #eab308' }}>
            <div style={{ fontSize: 10, color: '#fde68a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Flags</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ f: 'Z', v: false }, { f: 'C', v: true }, { f: 'N', v: false }].map(fl => (
                <div key={fl.f} style={{ width: 24, height: 24, borderRadius: 6, fontSize: 11, fontWeight: 700, background: fl.v ? '#22c55e' : '#374151', color: fl.v ? 'white' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{fl.f}</div>
              ))}
            </div>
          </motion.div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
          {steps.map((s, i) => (
            <motion.div key={i} animate={{ background: i === animStep ? activeOp.color : '#334155' }}
              style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600, color: i === animStep ? 'white' : '#64748b', border: '1px solid ' + (i === animStep ? activeOp.color : '#475569') }}>{s.label}</motion.div>
          ))}
        </div>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>7 Core Operations:</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {ops.map(op => (
          <motion.button key={op.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowingOp(op.name)}
            style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: showingOp === op.name ? op.color : '#f1f5f9', color: showingOp === op.name ? 'white' : '#334155', fontWeight: 700, fontSize: 14 }}>
            {op.symbol} {op.name}
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={showingOp} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          style={{ padding: 20, borderRadius: 12, background: activeOp.color + '10', border: '1px solid ' + activeOp.color + '33' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: activeOp.color, marginBottom: 8 }}>{activeOp.example}</div>
          <p style={{ margin: 0, color: '#475569', lineHeight: 1.7 }}>
            {showingOp === 'ADD' && 'The most fundamental operation. The ALU adds two binary numbers bit by bit with carry propagation, the same way you add decimal numbers by hand, but with only 0s and 1s.'}
            {showingOp === 'SUB' && 'The ALU reuses the adder by converting B to two\'s complement (flip all bits + add 1) then adding. So 7 - 2 becomes 7 + (-2). One circuit, two operations.'}
            {showingOp === 'AND' && 'Compares each bit: output is 1 only if BOTH inputs are 1. Used for masking, extracting specific bits. When you check if a number is even (n & 1), this is the operation.'}
            {showingOp === 'OR' && 'Output is 1 if EITHER input is 1. Used to combine flags and set specific bits. Setting a permission bit in a file system is an OR operation.'}
            {showingOp === 'XOR' && 'Output is 1 when inputs DIFFER. The Swiss army knife: checksums, encryption (AES), error detection, and swapping variables without a temp.'}
            {showingOp === 'NOT' && 'Flips every bit. Combined with ADD, gives two\'s complement (negation). Also essential for creating bit masks.'}
            {showingOp === 'CMP' && 'Subtracts B from A but DISCARDS the result, only keeps flags. Zero flag = equal, Negative flag = which is larger. Every if-statement triggers a CMP.'}
          </p>
        </motion.div>
      </AnimatePresence>
      <div style={{ marginTop: 24, padding: 20, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
        <h4 style={{ margin: '0 0 8px', color: '#1d4ed8' }}>Why does this matter?</h4>
        <p style={{ margin: 0, color: '#1e40af', lineHeight: 1.8, fontSize: 14 }}>
          Every Python expression you write ultimately becomes a single ALU operation. Understanding the ALU means understanding the fundamental limit of what a CPU can do in one step. Everything else is built by combining these 7 primitives.
        </p>
      </div>
    </div>
  );
}

function Layer2() {
  const [inputA, setInputA] = useState(42);
  const [inputB, setInputB] = useState(15);
  const [operation, setOperation] = useState('ADD');

  const compute = (a: number, b: number, op: string) => {
    let result = 0, carry = false;
    const a8 = a & 0xFF, b8 = b & 0xFF;
    switch (op) {
      case 'ADD': result = a8 + b8; carry = result > 255; result &= 0xFF; break;
      case 'SUB': result = (a8 - b8 + 256) & 0xFF; carry = a8 < b8; break;
      case 'AND': result = a8 & b8; break;
      case 'OR':  result = a8 | b8; break;
      case 'XOR': result = a8 ^ b8; break;
      case 'NOT': result = (~a8) & 0xFF; break;
      case 'SHL': result = (a8 << 1) & 0xFF; carry = !!(a8 & 0x80); break;
      case 'SHR': result = a8 >> 1; carry = !!(a8 & 1); break;
      default: result = (a8 + b8) & 0xFF;
    }
    return { result, carry, zero: result === 0, negative: !!(result & 0x80) };
  };

  const { result, carry, zero, negative } = compute(inputA, inputB, operation);
  const toBin = (n: number) => (n & 0xFF).toString(2).padStart(8, '0');
  const toHex = (n: number) => '0x' + (n & 0xFF).toString(16).toUpperCase().padStart(2, '0');

  const BitRow = ({ value, label, color }: { value: number; label: string; color: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
      <div style={{ width: 70, fontSize: 12, fontWeight: 600, color: '#64748b', textAlign: 'right' }}>{label}</div>
      <div style={{ display: 'flex', gap: 2 }}>
        {toBin(value).split('').map((bit, i) => (
          <motion.div key={i} animate={{ background: bit === '1' ? color : '#e2e8f0', color: bit === '1' ? 'white' : '#94a3b8' }}
            style={{ width: 36, height: 36, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, fontFamily: 'monospace' }}>
            {bit}
          </motion.div>
        ))}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color, fontFamily: 'monospace', minWidth: 60 }}>= {value & 0xFF}</div>
      <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>{toHex(value)}</div>
    </div>
  );

  const ops = [
    { name: 'ADD', sym: '+', color: '#3b82f6' }, { name: 'SUB', sym: '-', color: '#ef4444' },
    { name: 'AND', sym: '&', color: '#22c55e' }, { name: 'OR', sym: '|', color: '#f97316' },
    { name: 'XOR', sym: '^', color: '#8b5cf6' }, { name: 'NOT', sym: '~', color: '#ec4899' },
    { name: 'SHL', sym: '<<', color: '#06b6d4' }, { name: 'SHR', sym: '>>', color: '#eab308' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>8-Bit ALU Simulator</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
        Drag the sliders to change inputs, select an operation, and watch the binary bits change in real-time. This is exactly what happens inside the CPU billions of times per second.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#1d4ed8', display: 'block', marginBottom: 8 }}>
            Input A: <span style={{ fontFamily: 'monospace', fontSize: 18 }}>{inputA}</span>
          </label>
          <input type="range" min={0} max={255} value={inputA} onChange={e => setInputA(+e.target.value)} style={{ width: '100%', accentColor: '#3b82f6' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {[0, 42, 85, 127, 170, 255].map(v => (
              <button key={v} onClick={() => setInputA(v)}
                style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #bfdbfe', background: inputA === v ? '#3b82f6' : 'white', color: inputA === v ? 'white' : '#3b82f6', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>{v}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#fff7ed', border: '1px solid #fed7aa' }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#c2410c', display: 'block', marginBottom: 8 }}>
            Input B: <span style={{ fontFamily: 'monospace', fontSize: 18 }}>{inputB}</span>
          </label>
          <input type="range" min={0} max={255} value={inputB} onChange={e => setInputB(+e.target.value)} style={{ width: '100%', accentColor: '#f97316' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {[0, 15, 42, 85, 170, 255].map(v => (
              <button key={v} onClick={() => setInputB(v)}
                style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #fed7aa', background: inputB === v ? '#f97316' : 'white', color: inputB === v ? 'white' : '#f97316', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>{v}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>Operation:</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {ops.map(op => (
            <motion.button key={op.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setOperation(op.name)}
              style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: operation === op.name ? op.color : '#f1f5f9', color: operation === op.name ? 'white' : '#334155', fontWeight: 700, fontSize: 14, fontFamily: 'monospace' }}>
              {op.sym} {op.name}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ padding: 24, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Binary View</h3>
          <div style={{ display: 'flex', gap: 4, fontSize: 10, color: '#94a3b8' }}>
            {['128','64','32','16','8','4','2','1'].map((p,i) => <div key={i} style={{ width: 36, textAlign: 'center' }}>{p}</div>)}
          </div>
        </div>
        <BitRow value={inputA} label="A" color="#3b82f6" />
        <BitRow value={inputB} label="B" color="#f97316" />
        <div style={{ height: 1, background: '#e2e8f0', margin: '12px 0', marginLeft: 82 }} />
        <BitRow value={result} label={operation + ' ='} color="#22c55e" />
        <div style={{ display: 'flex', gap: 12, marginTop: 16, marginLeft: 82 }}>
          {[
            { flag: 'Zero', val: zero, color: '#8b5cf6' },
            { flag: 'Carry', val: carry, color: '#ef4444' },
            { flag: 'Negative', val: negative, color: '#f97316' },
          ].map(f => (
            <motion.div key={f.flag} animate={{ scale: f.val ? [1, 1.1, 1] : 1, background: f.val ? f.color : '#f1f5f9' }}
              style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid ' + (f.val ? f.color : '#e2e8f0'), color: f.val ? 'white' : '#94a3b8', fontSize: 12, fontWeight: 600 }}>
              {f.flag}: {f.val ? 'SET' : 'clear'}
            </motion.div>
          ))}
        </div>
      </div>
      <div style={{ padding: 20, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <h4 style={{ margin: '0 0 8px', color: '#166534' }}>What just happened inside the CPU:</h4>
        <p style={{ margin: 0, color: '#15803d', lineHeight: 1.8, fontSize: 14 }}>
          {operation === 'ADD' && 'The adder circuit processed each bit from right to left, propagating carries. ' + toBin(inputA) + ' + ' + toBin(inputB) + ' = ' + toBin(result) + '. ' + (carry ? 'Carry flag SET: result exceeded 255.' : 'No carry, result fits in 8 bits.')}
          {operation === 'SUB' && 'The ALU computed two\'s complement of B (flip bits + 1), then added. ' + inputA + ' + (256 - ' + inputB + ') mod 256 = ' + result + '. ' + (carry ? 'Borrow occurred.' : 'No borrow needed.')}
          {operation === 'AND' && 'Each AND gate compared corresponding bits. Output is 1 only where BOTH A and B have 1. Used for bit masking: extracting specific bits from a number.'}
          {operation === 'OR' && 'Each OR gate output 1 if EITHER input bit is 1. Used to combine bit patterns, commonly for setting flags or permissions.'}
          {operation === 'XOR' && 'XOR outputs 1 where bits DIFFER. XOR with 0xFF flips all bits (same as NOT). XOR with itself gives 0, how CPUs clear registers fast.'}
          {operation === 'NOT' && 'Every bit of A was inverted. Combined with adding 1, this gives two\'s complement negation. Only input A is used.'}
          {operation === 'SHL' && 'Every bit shifted left one position. Bit 7 went into carry, 0 filled bit 0. Left shift by 1 = multiply by 2: ' + inputA + ' << 1 = ' + result + '.'}
          {operation === 'SHR' && 'Every bit shifted right one position. Bit 0 went into carry, 0 filled bit 7. Right shift by 1 = divide by 2: ' + inputA + ' >> 1 = ' + result + '.'}
        </p>
      </div>
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'The Adder/Subtractor Unit', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>The adder is a chain of <strong>full adder</strong> circuits, one per bit. Each takes three inputs (bit A, bit B, carry-in) and produces two outputs (sum, carry-out). The carry-out feeds into the next bit: <strong>ripple carry</strong>.</p>
        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16, fontFamily: 'monospace', fontSize: 14, lineHeight: 2, color: '#1e293b' }}>
          <div>Bit 0: A=1, B=1, Cin=0 → Sum=0, Cout=<span style={{ color: '#ef4444', fontWeight: 700 }}>1</span></div>
          <div>Bit 1: A=0, B=1, Cin=<span style={{ color: '#ef4444', fontWeight: 700 }}>1</span> → Sum=0, Cout=<span style={{ color: '#ef4444', fontWeight: 700 }}>1</span></div>
          <div>Bit 2: A=1, B=0, Cin=<span style={{ color: '#ef4444', fontWeight: 700 }}>1</span> → Sum=0, Cout=<span style={{ color: '#ef4444', fontWeight: 700 }}>1</span></div>
          <div>Bit 3: A=0, B=0, Cin=<span style={{ color: '#ef4444', fontWeight: 700 }}>1</span> → Sum=1, Cout=0</div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}><strong>Subtraction trick:</strong> To compute A - B, the ALU flips all bits of B (XOR with SUB signal) and sets carry-in to 1. Flip + add 1 = two's complement negation. A - B = A + (~B) + 1. No separate subtraction hardware needed!</p>
        <p style={{ color: '#475569', lineHeight: 1.8 }}><strong>Speed problem:</strong> Ripple carry is slow — each bit waits for the previous carry. For 64 bits, that is 64 gate delays. Modern CPUs use <strong>carry-lookahead</strong> adders that compute all carries in parallel, reducing delay to ~log2(64) = 6 gate delays.</p>
      </div>
    )},
    { title: 'The Logic Unit', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>The logic unit is simpler: bitwise operations on each bit independently with no carry propagation. AND, OR, XOR, and NOT gates run <strong>in parallel</strong> on every bit.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
          {[
            { gate: 'AND', truth: '0&0=0, 0&1=0, 1&0=0, 1&1=1', use: 'Bit masking' },
            { gate: 'OR', truth: '0|0=0, 0|1=1, 1|0=1, 1|1=1', use: 'Setting bits' },
            { gate: 'XOR', truth: '0^0=0, 0^1=1, 1^0=1, 1^1=0', use: 'Toggling, crypto' },
            { gate: 'NOT', truth: '~0=1, ~1=0', use: 'Inversion' },
          ].map(g => (
            <div key={g.gate} style={{ padding: 14, borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div style={{ fontWeight: 700, color: '#166534', marginBottom: 4 }}>{g.gate}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#475569', marginBottom: 4 }}>{g.truth}</div>
              <div style={{ fontSize: 11, color: '#15803d' }}>Used for: {g.use}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>All four operations compute simultaneously. The MUX selects the correct result. Since there is no carry chain, logic operations complete in ONE gate delay — faster than addition.</p>
      </div>
    )},
    { title: 'The Output Multiplexer', color: '#8b5cf6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>The elegant trick: the adder and ALL logic gates run <strong>simultaneously</strong>. The ALU computes every possible result at once, then the <strong>output MUX</strong> selects which to output based on the opcode.</p>
        <div style={{ padding: 16, background: '#f5f3ff', borderRadius: 12, border: '1px solid #c4b5fd', marginBottom: 16, fontFamily: 'monospace', fontSize: 13, lineHeight: 2, color: '#4c1d95' }}>
          <div>Opcode 000 → SELECT adder output (ADD/SUB)</div>
          <div>Opcode 001 → SELECT AND output</div>
          <div>Opcode 010 → SELECT OR output</div>
          <div>Opcode 011 → SELECT XOR output</div>
          <div>Opcode 100 → SELECT NOT output</div>
          <div>Opcode 101 → SELECT shift output</div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>A 3-bit opcode selects from 8 possible results. This is why ANY operation takes the SAME time — the MUX adds only a tiny delay regardless of selection.</p>
      </div>
    )},
    { title: 'The Flags Register', color: '#ef4444', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Flags are single-bit outputs describing the result, stored in a <strong>flags register</strong> (status register). Used by the CPU for conditional branching — if/else, loops, comparisons.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
          {[
            { flag: 'Zero (Z)', desc: 'Set when result = 0. CMP sets Z when operands are equal. Every == uses this.', color: '#8b5cf6' },
            { flag: 'Carry (C)', desc: 'Set on unsigned overflow. 255 + 1 = 0 with carry. Used for multi-precision math.', color: '#ef4444' },
            { flag: 'Negative (N)', desc: 'Copies bit 7 (sign bit). Set means result is negative in signed arithmetic.', color: '#f97316' },
            { flag: 'Overflow (V)', desc: 'Set on signed overflow. 127 + 1 = -128 (wrong sign!). Different from carry.', color: '#22c55e' },
          ].map(f => (
            <div key={f.flag} style={{ padding: 14, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca' }}>
              <div style={{ fontWeight: 700, color: f.color, marginBottom: 4, fontSize: 14 }}>{f.flag}</div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}><strong>CMP instruction</strong> subtracts B from A, discards result, keeps flags. BEQ (Branch if Equal) reads Zero flag to decide whether to jump. This is how <code>if x == 5</code> works in hardware.</p>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Inside the ALU: 4 Key Components</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>All compute in parallel — the multiplexer picks the winning result. Click each section to explore.</p>
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
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
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
      code={`# Every Python operator maps to an ALU operation
a, b = 42, 15

# ARITHMETIC -> ALU Adder
a + b    # ADD: adder circuit, result = 57
a - b    # SUB: adder + twos complement of b = 27

# LOGIC -> ALU Logic Unit (parallel bit ops)
a & b    # AND: 00101010 & 00001111 = 00001010 (10)
a | b    # OR:  00101010 | 00001111 = 00101111 (47)
a ^ b    # XOR: 00101010 ^ 00001111 = 00100101 (37)
~a       # NOT: ~00101010 = 11010101 (-43 signed)

# COMPARISON -> ALU CMP (subtract, keep only flags)
a == b   # CMP then check Zero flag
a < b    # CMP then check Negative flag

# SHIFTS -> ALU Barrel Shifter
a << 1   # Left shift = multiply by 2: 84
a >> 1   # Right shift = divide by 2: 21

# check if number is even
is_even = (a & 1) == 0  # AND with 1, then CMP

# MULTIPLY uses ALU repeatedly
a * b    # shift + add, shift + add...`}
      explanation="Every Python operator compiles to one or more ALU instructions. Simple operations like + - & | map to exactly ONE ALU operation (one clock cycle). The == operator triggers a CMP that subtracts and checks the Zero flag."
      hardwareNote="At 4 GHz, the ALU performs 4 billion operations per second. A simple x + y takes 0.25 nanoseconds. Python adds ~100x overhead for type checking and interpreter dispatch, which is why NumPy is so much faster."
    />
  );
}

function Layer5() {
  const apps = [
    { icon: '\u{1F3AE}', title: 'Game Physics',
      desc: 'Every frame, the GPU runs millions of ADD/MUL operations for positions, collisions, lighting. One frame needs ~10 billion ALU ops.',
      detail: 'position.x += velocity.x * deltaTime triggers 2 ALU ops per axis, per object, 60x per second.' },
    { icon: '\u{1F510}', title: 'Encryption (AES)',
      desc: 'AES uses XOR as its core operation. Every HTTPS byte is XORed with key bytes in multiple rounds.',
      detail: 'Intel AES-NI accelerates from ~20 cycles to ~4 cycles per block with dedicated XOR instructions.' },
    { icon: '\u{1F50D}', title: 'Search & Compare',
      desc: 'Database queries use CMP billions of times. Hash tables use AND for bucket indices.',
      detail: 'Binary search over 1M items: only 20 CMP operations (log2 of 1,000,000). Nearly instant.' },
    { icon: '\u{1F916}', title: 'AI / Machine Learning',
      desc: 'Neural networks are massive multiply-accumulate chains. GPT-4 does ~1.8 trillion multiply-adds per inference.',
      detail: 'Each neuron: output = activation(sum(weight * input) + bias). GPUs have thousands of ALUs in parallel.' },
    { icon: '\u{1F5BC}', title: 'Image Processing',
      desc: 'Every filter is ALU ops on pixels. Brightness = ADD to RGB. Blur = weighted ADD of neighbors.',
      detail: '4K = 24.9M values. Brightness adjustment = 24.9M ADDs, takes <1ms on modern CPU.' },
    { icon: '\u{1F9EC}', title: 'Scientific Computing',
      desc: 'Protein folding, climate models, particle physics. Supercomputers measured in FLOPS.',
      detail: 'Frontier: 1.194 exaFLOPS = 1.194 x 10^18 ALU ops/second using 37,888 GPUs.' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>The ALU Powers Everything</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>
        Every computation on every device comes down to ALU operations. Here is how 7 simple operations power the modern world:
      </p>
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
        <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>4,000,000,000 operations/second</div>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: 15, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
          A 4 GHz CPU completes one ALU operation every 0.25 nanoseconds. Light only travels 7.5 cm in that time.
        </p>
      </div>
    </div>
  );
}

export default function L06_ALU() {
  return (
    <LessonWrapper lessonId="L06" title="Arithmetic Logic Unit (ALU)"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'The Super-Calculator', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: '8-Bit ALU Simulator', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'Inside the ALU', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python Operators', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'ALU Powers Everything', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'XOR Swap', description: 'Use only XOR to swap two variables without a temp.' },
        { id: 'c2', title: 'Flag Reading', description: 'After 200 + 100 in 8-bit, which flags are set?' },
        { id: 'c3', title: 'Twos Complement', description: 'How does the ALU compute 5 - 3 using only addition?' },
      ]}
    />
  );
}
