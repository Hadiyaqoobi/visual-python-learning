"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [gateType, setGateType] = useState('AND');
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);

  const gates: Record<string, { symbol: string; desc: string; analogy: string; compute: (a: boolean, b: boolean) => boolean; color: string }> = {
    AND:  { symbol: '&', desc: 'Output is 1 only when BOTH inputs are 1', analogy: 'Two switches in SERIES: both must be ON for the light to work. Like needing both a key AND a PIN to open a safe.', compute: (a, b) => a && b, color: '#3b82f6' },
    OR:   { symbol: '|', desc: 'Output is 1 when EITHER input is 1', analogy: 'Two switches in PARALLEL: either one can turn on the light. Like a hallway light with switches at both ends.', compute: (a, b) => a || b, color: '#22c55e' },
    NOT:  { symbol: '!', desc: 'Flips the input: 0 becomes 1, 1 becomes 0', analogy: 'A normally-closed door: when you push (1), it closes (0). When released (0), it opens (1). An inverter.', compute: (a, _b) => !a, color: '#ef4444' },
    NAND: { symbol: '!&', desc: 'Opposite of AND: output is 0 only when BOTH are 1', analogy: 'An alarm that triggers unless BOTH guards are present. The most important gate: you can build ANY circuit from only NAND gates.', compute: (a, b) => !(a && b), color: '#f97316' },
    NOR:  { symbol: '!|', desc: 'Opposite of OR: output is 1 only when BOTH are 0', analogy: 'A "do not disturb" light: ON only when nobody is pressing either button. Like NAND, NOR alone is universal.', compute: (a, b) => !(a || b), color: '#8b5cf6' },
    XOR:  { symbol: '^', desc: 'Output is 1 when inputs are DIFFERENT', analogy: 'A light controlled by two switches: flipping either one toggles the light. Same state = off, different state = on.', compute: (a, b) => a !== b, color: '#06b6d4' },
    XNOR: { symbol: '=', desc: 'Output is 1 when inputs are the SAME', analogy: 'An agreement detector: lights up when both people vote the same way. Used in equality comparisons.', compute: (a, b) => a === b, color: '#ec4899' },
  };

  const gate = gates[gateType];
  const output = gate.compute(inputA, inputB);
  const isSingleInput = gateType === 'NOT';

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>The Building Blocks of All Computing</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        Every computer, from a simple calculator to a supercomputer, is built from just a few types of <strong>logic gates</strong>. A logic gate takes one or two binary inputs (0 or 1) and produces one output based on a simple rule.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        These gates are made from <strong>transistors</strong> — tiny semiconductor switches etched into silicon. A modern CPU contains <strong>billions</strong> of these gates, all working together at GHz speeds. Yet the rules for each gate are incredibly simple.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        Click each gate type below, toggle the inputs, and watch the output change. The animations show real electrical signals flowing through the gate.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {Object.entries(gates).map(([name, g]) => (
          <motion.button key={name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setGateType(name)}
            style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: gateType === name ? g.color : '#f1f5f9', color: gateType === name ? 'white' : '#334155', fontWeight: 700, fontSize: 14 }}>
            {name}
          </motion.button>
        ))}
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 40, marginBottom: 24, border: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <motion.button onClick={() => setInputA(!inputA)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              animate={{ background: inputA ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #374151, #1f2937)', boxShadow: inputA ? '0 0 25px #22c55e66' : 'none' }}
              style={{ width: 72, height: 72, borderRadius: 16, border: inputA ? '2px solid #22c55e' : '2px solid #4b5563', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'white', fontFamily: 'monospace' }}>{inputA ? '1' : '0'}</div>
              <div style={{ fontSize: 9, color: inputA ? '#86efac' : '#6b7280' }}>INPUT A</div>
            </motion.button>
            {!isSingleInput && (
              <motion.button onClick={() => setInputB(!inputB)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                animate={{ background: inputB ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #374151, #1f2937)', boxShadow: inputB ? '0 0 25px #22c55e66' : 'none' }}
                style={{ width: 72, height: 72, borderRadius: 16, border: inputB ? '2px solid #22c55e' : '2px solid #4b5563', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'white', fontFamily: 'monospace' }}>{inputB ? '1' : '0'}</div>
                <div style={{ fontSize: 9, color: inputB ? '#86efac' : '#6b7280' }}>INPUT B</div>
              </motion.button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 60, height: 2, background: inputA ? '#22c55e' : '#374151' }} />
            {!isSingleInput && <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              style={{ width: 60, height: 2, background: inputB ? '#22c55e' : '#374151' }} />}
          </div>

          <motion.div animate={{ scale: [1, 1.05, 1], boxShadow: '0 0 40px ' + gate.color + '44' }} transition={{ duration: 2, repeat: Infinity }}
            style={{ padding: '24px 32px', borderRadius: 16, background: gate.color + '22', border: '3px solid ' + gate.color, textAlign: 'center', minWidth: 120 }}>
            <div style={{ fontSize: 12, color: gate.color, fontWeight: 700, marginBottom: 4 }}>{gateType}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: gate.color }}>{gate.symbol}</div>
          </motion.div>

          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            style={{ width: 60, height: 2, background: output ? '#22c55e' : '#374151' }} />

          <motion.div key={String(output)} initial={{ scale: 1.3 }} animate={{ scale: 1, boxShadow: output ? '0 0 40px #22c55e66' : '0 0 10px rgba(0,0,0,0.3)' }}
            style={{ width: 80, height: 80, borderRadius: 20, background: output ? 'linear-gradient(135deg, #166534, #22c55e)' : 'linear-gradient(135deg, #374151, #1f2937)', border: output ? '3px solid #22c55e' : '3px solid #4b5563', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'white', fontFamily: 'monospace' }}>{output ? '1' : '0'}</div>
            <div style={{ fontSize: 9, color: output ? '#86efac' : '#6b7280' }}>OUTPUT</div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={gateType} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          style={{ padding: 20, borderRadius: 12, background: gate.color + '10', border: '1px solid ' + gate.color + '33', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, color: gate.color, fontSize: 16, marginBottom: 8 }}>{gateType} Gate: {gate.desc}</div>
          <p style={{ margin: 0, color: '#475569', lineHeight: 1.7 }}>{gate.analogy}</p>
        </motion.div>
      </AnimatePresence>

      <div style={{ padding: 20, borderRadius: 12, background: '#fff7ed', border: '1px solid #fed7aa' }}>
        <h4 style={{ margin: '0 0 8px', color: '#c2410c' }}>The Universal Gate</h4>
        <p style={{ margin: 0, color: '#9a3412', lineHeight: 1.8, fontSize: 14 }}>
          Here is a mind-blowing fact: you can build ANY logic circuit using ONLY NAND gates (or ONLY NOR gates). AND = two NANDs. OR = three NANDs. NOT = one NAND with inputs tied together. This is why NAND flash memory is called "NAND" — it is built entirely from NAND gates.
        </p>
      </div>
    </div>
  );
}

function Layer2() {
  const [inputs, setInputs] = useState<boolean[]>([false, false, false, false]);
  const [showCircuit, setShowCircuit] = useState<'half-adder' | 'sr-latch' | 'mux'>('half-adder');

  const toggleInput = (i: number) => setInputs(prev => prev.map((v, idx) => idx === i ? !v : v));

  const circuits = {
    'half-adder': {
      name: 'Half Adder (adds 2 bits)',
      desc: 'Combines XOR (for sum) and AND (for carry) to add two single bits. This is the fundamental building block of all arithmetic in a CPU.',
      inputs: ['A', 'B'],
      compute: () => {
        const sum = inputs[0] !== inputs[1];
        const carry = inputs[0] && inputs[1];
        return [
          { label: 'Sum (XOR)', value: sum, desc: 'XOR: 1 when inputs differ' },
          { label: 'Carry (AND)', value: carry, desc: 'AND: 1 when both inputs are 1' },
        ];
      }
    },
    'sr-latch': {
      name: 'SR Latch (1-bit memory)',
      desc: 'Two NOR gates cross-connected create a circuit that REMEMBERS. Set (S=1) stores a 1. Reset (R=1) stores a 0. Both 0 = holds previous value. This is the basis of all computer memory.',
      inputs: ['S (Set)', 'R (Reset)'],
      compute: () => {
        const s = inputs[0], r = inputs[1];
        let q = false, invalid = false;
        if (s && !r) q = true;
        else if (!s && r) q = false;
        else if (s && r) { q = false; invalid = true; }
        return [
          { label: 'Q (stored bit)', value: q, desc: s && r ? 'INVALID: both S and R cannot be 1' : q ? 'Latch is SET (storing 1)' : 'Latch is RESET (storing 0)' },
          { label: 'Q\u0305 (complement)', value: !q && !invalid, desc: 'Always opposite of Q' },
        ];
      }
    },
    'mux': {
      name: '2-to-1 Multiplexer (data selector)',
      desc: 'Uses AND, OR, and NOT gates to select between two inputs based on a selector signal. If Sel=0, output=A. If Sel=1, output=B. The CPU uses multiplexers everywhere to route data.',
      inputs: ['A (data 0)', 'B (data 1)', 'Sel'],
      compute: () => {
        const sel = inputs[2];
        const out = sel ? inputs[1] : inputs[0];
        return [
          { label: 'Output', value: out, desc: sel ? 'Sel=1: passing input B through' : 'Sel=0: passing input A through' },
        ];
      }
    },
  };

  const circuit = circuits[showCircuit];
  const outputs = circuit.compute();

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Build Circuits from Gates</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
        Individual gates are simple, but combining them creates powerful circuits. Toggle the inputs and watch signals flow through real circuits used inside every CPU.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(Object.keys(circuits) as Array<keyof typeof circuits>).map(key => (
          <motion.button key={key} whileHover={{ scale: 1.05 }} onClick={() => setShowCircuit(key)}
            style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: showCircuit === key ? '#3b82f6' : '#f1f5f9', color: showCircuit === key ? 'white' : '#334155', fontWeight: 700, fontSize: 13 }}>
            {circuits[key].name}
          </motion.button>
        ))}
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 24, border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>Inputs</div>
            {circuit.inputs.map((label, i) => (
              <motion.button key={label} onClick={() => toggleInput(i)} whileHover={{ scale: 1.05 }}
                animate={{ background: inputs[i] ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #374151, #1f2937)' }}
                style={{ padding: '12px 20px', borderRadius: 12, border: inputs[i] ? '2px solid #22c55e' : '2px solid #4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, minWidth: 140 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'white', fontFamily: 'monospace', width: 28 }}>{inputs[i] ? '1' : '0'}</div>
                <div style={{ fontSize: 12, color: inputs[i] ? '#86efac' : '#9ca3af' }}>{label}</div>
              </motion.button>
            ))}
          </div>

          <div style={{ padding: 24, borderRadius: 16, background: '#3b82f622', border: '2px solid #3b82f6', textAlign: 'center', minWidth: 140 }}>
            <div style={{ fontSize: 11, color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{showCircuit.replace('-', ' ')}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Gate Circuit</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>Outputs</div>
            {outputs.map(o => (
              <motion.div key={o.label} animate={{ boxShadow: o.value ? '0 0 25px #22c55e55' : 'none' }}
                style={{ padding: '12px 20px', borderRadius: 12, background: o.value ? 'linear-gradient(135deg, #166534, #22c55e)' : '#1f2937', border: o.value ? '2px solid #22c55e' : '2px solid #4b5563', display: 'flex', alignItems: 'center', gap: 12, minWidth: 160 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'white', fontFamily: 'monospace', width: 28 }}>{o.value ? '1' : '0'}</div>
                <div>
                  <div style={{ fontSize: 12, color: o.value ? '#86efac' : '#9ca3af' }}>{o.label}</div>
                  <div style={{ fontSize: 10, color: o.value ? '#bbf7d0' : '#6b7280' }}>{o.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: 20, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
        <h4 style={{ margin: '0 0 8px', color: '#1d4ed8' }}>About this circuit:</h4>
        <p style={{ margin: 0, color: '#1e40af', lineHeight: 1.8, fontSize: 14 }}>{circuit.desc}</p>
      </div>
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'Transistors: The Physical Gate', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>A transistor is a tiny semiconductor switch. It has three terminals: <strong>Gate</strong>, <strong>Source</strong>, and <strong>Drain</strong>. When voltage is applied to the Gate, current flows from Source to Drain. When no voltage, current is blocked.</p>
        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#1e293b' }}>
            <div><strong>NMOS transistor:</strong> Conducts when Gate = HIGH (1). Used to pull output LOW.</div>
            <div><strong>PMOS transistor:</strong> Conducts when Gate = LOW (0). Used to pull output HIGH.</div>
            <div><strong>CMOS NOT gate:</strong> 1 PMOS + 1 NMOS = 2 transistors total</div>
            <div><strong>CMOS NAND gate:</strong> 2 PMOS + 2 NMOS = 4 transistors total</div>
            <div><strong>CMOS AND gate:</strong> NAND + NOT = 6 transistors total</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Modern CPUs use CMOS (Complementary Metal-Oxide-Semiconductor) technology. Each gate uses paired NMOS and PMOS transistors. Apple M3 chip has 25 billion transistors in an area the size of your thumbnail. Each transistor is about 3 nanometers — smaller than a strand of DNA (2.5nm wide).</p>
      </div>
    )},
    { title: 'Truth Tables: The Complete Definition', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>A truth table lists every possible input combination and the corresponding output. This IS the gate — there is nothing more to it. If you know the truth table, you know exactly what the gate does for any input.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 16 }}>
          {[
            { gate: 'AND', rows: ['0,0=0','0,1=0','1,0=0','1,1=1'] },
            { gate: 'OR', rows: ['0,0=0','0,1=1','1,0=1','1,1=1'] },
            { gate: 'XOR', rows: ['0,0=0','0,1=1','1,0=1','1,1=0'] },
            { gate: 'NAND', rows: ['0,0=1','0,1=1','1,0=1','1,1=0'] },
          ].map(g => (
            <div key={g.gate} style={{ padding: 14, borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div style={{ fontWeight: 700, color: '#166534', marginBottom: 6, textAlign: 'center' }}>{g.gate}</div>
              {g.rows.map(r => {
                const [ins, out] = r.split('=');
                return <div key={r} style={{ fontFamily: 'monospace', fontSize: 12, color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{ins.replace(',', ', ')}</span><span style={{ color: out === '1' ? '#22c55e' : '#94a3b8', fontWeight: 700 }}>{out}</span>
                </div>;
              })}
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Any function of N inputs has 2^N rows in its truth table. For 2 inputs: 4 rows. For 3 inputs: 8 rows. There are exactly 16 possible 2-input logic functions (2^4 truth table outputs). We name the most useful ones: AND, OR, XOR, NAND, NOR, XNOR.</p>
      </div>
    )},
    { title: 'Boolean Algebra: The Math of Logic', color: '#8b5cf6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Boolean algebra is the mathematical framework for logic gates. Just like regular algebra has rules (a + 0 = a), Boolean algebra has laws for simplifying gate circuits:</p>
        <div style={{ padding: 16, background: '#f5f3ff', borderRadius: 12, border: '1px solid #c4b5fd', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#4c1d95' }}>
            <div><strong>Identity:</strong> A AND 1 = A &nbsp;|&nbsp; A OR 0 = A</div>
            <div><strong>Null:</strong> A AND 0 = 0 &nbsp;|&nbsp; A OR 1 = 1</div>
            <div><strong>Complement:</strong> A AND (NOT A) = 0 &nbsp;|&nbsp; A OR (NOT A) = 1</div>
            <div><strong>Idempotent:</strong> A AND A = A &nbsp;|&nbsp; A OR A = A</div>
            <div><strong>De Morgan:</strong> NOT(A AND B) = (NOT A) OR (NOT B)</div>
            <div><strong>De Morgan:</strong> NOT(A OR B) = (NOT A) AND (NOT B)</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>De Morgan's Laws are especially powerful. They let you convert between AND and OR by flipping gates and adding inverters. Chip designers use these laws to minimize the number of transistors, reducing power consumption and increasing speed.</p>
      </div>
    )},
    { title: 'Gate Delays and Propagation', color: '#ef4444', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Gates are not instant. Each gate introduces a tiny delay (typically 10-50 picoseconds in modern chips). This <strong>propagation delay</strong> is the time for the output to stabilize after inputs change.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'NOT gate', delay: '~10 ps', transistors: '2', note: 'Fastest gate: just 2 transistors' },
            { name: 'NAND/NOR', delay: '~15 ps', transistors: '4', note: 'Single-stage gates, very fast' },
            { name: 'AND/OR', delay: '~25 ps', transistors: '6', note: 'NAND/NOR + NOT: extra stage' },
            { name: 'XOR', delay: '~35 ps', transistors: '8-12', note: 'More complex, used in adders' },
          ].map(g => (
            <div key={g.name} style={{ padding: 14, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca' }}>
              <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: 2 }}>{g.name}</div>
              <div style={{ fontSize: 12, color: '#475569' }}>Delay: {g.delay} | {g.transistors} transistors</div>
              <div style={{ fontSize: 11, color: '#b91c1c', marginTop: 4 }}>{g.note}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>The <strong>critical path</strong> is the longest chain of gates a signal must pass through. It determines maximum clock speed. If the critical path has 20 gate delays of 25ps each = 500ps, max clock speed = 1/500ps = 2 GHz. Designers spend enormous effort shortening critical paths.</p>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>The Technical Foundation</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>From transistors to Boolean algebra — the engineering behind logic gates.</p>
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
      code={`# Python bitwise operators ARE logic gates
a, b = 0b11001010, 0b10101100

# Each operator maps to a gate applied to every bit pair
a & b    # AND: 10001000 (136) - bits set in BOTH
a | b    # OR:  11101110 (238) - bits set in EITHER
a ^ b    # XOR: 01100110 (102) - bits that DIFFER
~a       # NOT: 00110101 (as 8-bit: 53)

# Real use: permission flags (like Unix file permissions)
READ    = 0b100  # 4
WRITE   = 0b010  # 2
EXECUTE = 0b001  # 1

perms = READ | WRITE       # Set: 0b110 = 6 (rw-)
perms & READ               # Check: nonzero = has read
perms = perms & ~WRITE     # Clear write: 0b100 (r--)
perms = perms ^ EXECUTE    # Toggle exec: 0b101 (r-x)

# Real use: checking if power of 2
def is_power_of_2(n):
    return n > 0 and (n & (n - 1)) == 0
# 16 & 15 = 10000 & 01111 = 00000 -> True!

# Real use: swap without temp variable
a = a ^ b  # XOR trick
b = a ^ b
a = a ^ b  # a and b are now swapped!`}
      explanation="Python bitwise operators directly correspond to logic gates applied to each bit pair in parallel. The & operator is AND gates on all 8 bits simultaneously. The | is OR gates. ^ is XOR gates. These are among the fastest operations a CPU can perform because they need no carry propagation — each bit is independent."
      hardwareNote="When Python executes a & b, the CPU sends both values to the ALU logic unit, which has AND gates wired to every bit position. All 64 bits are computed in parallel in a single clock cycle (~0.25ns). The permission flag pattern (using OR to set, AND to check, AND-NOT to clear, XOR to toggle) is used in operating systems, network protocols, and graphics programming."
    />
  );
}

function Layer5() {
  const apps = [
    { icon: '\u{1F4BB}', title: 'CPU Design',
      desc: 'Every CPU is billions of logic gates. The ALU, registers, cache, branch predictor — all built from AND, OR, NOT, and XOR gates arranged in increasingly complex patterns.',
      detail: 'Apple M3: 25 billion transistors = ~6 billion logic gates. Designed using hardware description languages (Verilog/VHDL) that describe gate connections.' },
    { icon: '\u{1F4BE}', title: 'Memory (SRAM and DRAM)',
      desc: 'SRAM (cache) uses 6 transistors per bit arranged as cross-coupled gates to store data. DRAM (RAM) uses 1 transistor + 1 capacitor but needs constant refreshing.',
      detail: 'Your CPU L1 cache: ~100KB of SRAM = 4.8 million transistors just for storage. Fast because gates hold state directly. DRAM is slower but denser.' },
    { icon: '\u{1F50C}', title: 'NAND Flash Storage',
      desc: 'SSDs and USB drives use floating-gate NAND transistors. Named after NAND gates because the memory cells are connected in series (like NAND logic).',
      detail: 'A 1TB SSD contains ~8 trillion NAND cells. Each stores 3-4 bits using different voltage levels (TLC/QLC). Read speed limited by gate sensing time.' },
    { icon: '\u{1F310}', title: 'Network Hardware',
      desc: 'Routers and switches use logic gates for packet routing, error detection (CRC uses XOR), and protocol processing. Hardware acceleration in NICs uses custom gate arrays.',
      detail: 'Ethernet CRC-32 check: XOR operations on every byte of every packet. A 100Gbps switch processes ~150 million packets/second, each requiring gate-level CRC verification.' },
    { icon: '\u{1F3AE}', title: 'GPU Shader Cores',
      desc: 'GPUs have thousands of simple cores, each with their own logic gates. They execute the same operation on different data (SIMD) — perfect for graphics and AI.',
      detail: 'NVIDIA RTX 4090: 16,384 CUDA cores, each with its own ALU made from logic gates. Total: ~76 billion transistors, processing 82.6 TFLOPS of parallel operations.' },
    { icon: '\u{1F3E5}', title: 'FPGAs: Programmable Gates',
      desc: 'FPGAs (Field-Programmable Gate Arrays) let you rewire logic gates after manufacturing. Used in prototyping, telecom, medical devices, and trading systems.',
      detail: 'An FPGA contains thousands of configurable logic blocks (CLBs). Each CLB can become ANY gate combination. Used in high-frequency trading where 10ns faster than software matters.' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Gates Power Everything Digital</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>From CPUs to SSDs to network routers — every digital device is logic gates at its core.</p>
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
        <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>7 gate types = all of computing</div>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: 15, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
          AND, OR, NOT, NAND, NOR, XOR, XNOR. Just 7 simple rules, combined billions of times, create every digital device on Earth. In fact, NAND alone is enough.
        </p>
      </div>
    </div>
  );
}

export default function L02_LogicGates() {
  return (
    <LessonWrapper lessonId="L02" title="Logic Gates"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'Switches and Rules', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'Build Circuits', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'Transistors to Algebra', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python Bitwise Ops', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'Gates Power Everything', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'NAND Universal', description: 'Build an OR gate using only NAND gates. How many do you need?' },
        { id: 'c2', title: 'De Morgan', description: 'Prove NOT(A AND B) = (NOT A) OR (NOT B) using a truth table.' },
        { id: 'c3', title: 'Bit Tricks', description: 'Why does n & (n-1) == 0 test if n is a power of 2?' },
      ]}
    />
  );
}
