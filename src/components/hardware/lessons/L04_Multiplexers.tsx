"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [selectedChannel, setSelectedChannel] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const channels = [
    { label: 'Ch 0', content: 'News', color: '#3b82f6', value: '01101001' },
    { label: 'Ch 1', content: 'Sports', color: '#22c55e', value: '10110100' },
    { label: 'Ch 2', content: 'Music', color: '#f97316', value: '11001010' },
    { label: 'Ch 3', content: 'Movies', color: '#8b5cf6', value: '00110111' },
  ];

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => setSelectedChannel(prev => (prev + 1) % 4), 2000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const active = channels[selectedChannel];
  const selBits = selectedChannel.toString(2).padStart(2, '0');

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>The TV Remote of Computing</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        A <strong>multiplexer (MUX)</strong> is like a TV remote control. You have many channels (inputs), but can only watch one at a time. The channel number (selector) determines which input reaches the output.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        In a CPU, multiplexers are everywhere. The ALU uses a MUX to select which operation result to output. The register file uses MUXes to select which register to read. The program counter uses a MUX to choose between sequential execution and a branch target.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        A 4-to-1 MUX has 4 data inputs, 2 selector bits, and 1 output. With N selector bits, you can choose from 2^N inputs. Click the channels below or watch the auto-cycle:
      </p>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 24, border: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {/* Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>4 Inputs</div>
            {channels.map((ch, i) => (
              <motion.button key={i} onClick={() => { setAutoPlay(false); setSelectedChannel(i); }}
                whileHover={{ scale: 1.05 }}
                animate={{
                  background: i === selectedChannel ? 'linear-gradient(135deg, ' + ch.color + ', ' + ch.color + 'cc)' : '#1f2937',
                  boxShadow: i === selectedChannel ? '0 0 25px ' + ch.color + '55' : 'none',
                  borderColor: i === selectedChannel ? ch.color : '#4b5563'
                }}
                style={{ padding: '10px 18px', borderRadius: 10, border: '2px solid', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, minWidth: 160 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: i === selectedChannel ? 'white' : '#6b7280' }}>{i.toString(2).padStart(2, '0')}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{ch.content}</div>
                  <div style={{ fontSize: 10, color: i === selectedChannel ? '#e2e8f0' : '#6b7280', fontFamily: 'monospace' }}>{ch.value}</div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* MUX box */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <motion.div animate={{ boxShadow: '0 0 30px ' + active.color + '44' }}
              style={{ padding: '24px 32px', borderRadius: 16, background: active.color + '22', border: '3px solid ' + active.color, textAlign: 'center', minWidth: 140 }}>
              <div style={{ fontSize: 11, color: active.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>4-to-1 MUX</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: active.color, margin: '8px 0' }}>SEL</div>
              <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 800, color: 'white' }}>{selBits}</div>
            </motion.div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Selector: {selBits} = channel {selectedChannel}</div>
          </div>

          {/* Arrow */}
          <motion.div animate={{ color: active.color }} style={{ fontSize: 32, fontWeight: 800 }}>&#8594;</motion.div>

          {/* Output */}
          <motion.div key={selectedChannel} initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ padding: '20px 28px', borderRadius: 16, background: 'linear-gradient(135deg, ' + active.color + '33, ' + active.color + '11)', border: '3px solid ' + active.color, textAlign: 'center', minWidth: 140 }}>
            <div style={{ fontSize: 11, color: '#86efac', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Output</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 4 }}>{active.content}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 14, color: active.color }}>{active.value}</div>
          </motion.div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button onClick={() => setAutoPlay(!autoPlay)}
            style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: autoPlay ? '#ef4444' : '#22c55e', color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            {autoPlay ? 'Stop' : 'Auto-cycle'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <h4 style={{ margin: '0 0 8px', color: '#1d4ed8' }}>MUX = Programmable Wire</h4>
          <p style={{ margin: 0, color: '#1e40af', lineHeight: 1.7, fontSize: 14 }}>
            A MUX is essentially a programmable wire: the selector bits control which input gets connected to the output. No data is modified, just routed. This is how CPUs steer data between components.
          </p>
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 8px', color: '#166534' }}>Demultiplexer (DEMUX)</h4>
          <p style={{ margin: 0, color: '#15803d', lineHeight: 1.7, fontSize: 14 }}>
            The reverse of a MUX: one input, many outputs. The selector chooses which output receives the data. Used for memory address decoding: the address bits select which memory chip receives the read/write signal.
          </p>
        </div>
      </div>
    </div>
  );
}

function Layer2() {
  const [mode, setMode] = useState<'4to1' | '8to1' | 'cascaded'>('4to1');
  const [inputs, setInputs] = useState([1, 0, 1, 1, 0, 1, 0, 1]);
  const [selector, setSelector] = useState(0);

  const maxInputs = mode === '4to1' ? 4 : mode === '8to1' ? 8 : 8;
  const selBits = mode === '4to1' ? 2 : 3;
  const effectiveSel = selector % maxInputs;
  const output = inputs[effectiveSel];

  const toggleInput = (i: number) => setInputs(prev => prev.map((v, idx) => idx === i ? (v ? 0 : 1) : v));

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>MUX Simulator</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
        Toggle data inputs, change the selector, and watch which input gets routed to the output. Try different MUX sizes to see how selector bits scale.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['4to1', '8to1', 'cascaded'] as const).map(m => (
          <motion.button key={m} whileHover={{ scale: 1.05 }} onClick={() => { setMode(m); setSelector(0); }}
            style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: mode === m ? '#3b82f6' : '#f1f5f9', color: mode === m ? 'white' : '#334155', fontWeight: 700, fontSize: 13 }}>
            {m === '4to1' ? '4-to-1 MUX' : m === '8to1' ? '8-to-1 MUX' : 'Cascaded MUX'}
          </motion.button>
        ))}
      </div>

      <div style={{ padding: 24, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 24 }}>
        {/* Selector control */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>
            Selector ({selBits} bits): <span style={{ fontFamily: 'monospace', color: '#8b5cf6', fontSize: 18 }}>{effectiveSel.toString(2).padStart(selBits, '0')}</span> = input {effectiveSel}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {Array.from({ length: maxInputs }, (_, i) => (
              <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelector(i)}
                animate={{ background: i === effectiveSel ? '#8b5cf6' : '#e2e8f0' }}
                style={{ width: 44, height: 44, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'monospace', color: i === effectiveSel ? 'white' : '#64748b' }}>
                {i}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Data inputs */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>Data Inputs (click to toggle):</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {inputs.slice(0, maxInputs).map((val, i) => (
              <motion.button key={i} onClick={() => toggleInput(i)} whileHover={{ scale: 1.05 }}
                animate={{
                  background: i === effectiveSel ? (val ? '#22c55e' : '#ef4444') : (val ? '#22c55e44' : '#ef444444'),
                  borderColor: i === effectiveSel ? (val ? '#22c55e' : '#ef4444') : '#e2e8f0',
                  boxShadow: i === effectiveSel ? '0 0 20px ' + (val ? '#22c55e' : '#ef4444') + '44' : 'none'
                }}
                style={{ width: 56, height: 64, borderRadius: 10, border: '2px solid', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'white', fontFamily: 'monospace' }}>{val}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>In {i}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Output */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Output:</div>
          <motion.div key={String(output) + effectiveSel} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
            style={{ width: 72, height: 72, borderRadius: 16, background: output ? 'linear-gradient(135deg, #166534, #22c55e)' : 'linear-gradient(135deg, #991b1b, #ef4444)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px ' + (output ? '#22c55e' : '#ef4444') + '44' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'white', fontFamily: 'monospace' }}>{output}</div>
          </motion.div>
          <div style={{ fontSize: 13, color: '#475569' }}>
            Input[<span style={{ color: '#8b5cf6', fontWeight: 700 }}>{effectiveSel}</span>] = <span style={{ color: output ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{output}</span>
          </div>
        </div>
      </div>

      {mode === 'cascaded' && (
        <div style={{ padding: 20, borderRadius: 12, background: '#f5f3ff', border: '1px solid #c4b5fd' }}>
          <h4 style={{ margin: '0 0 8px', color: '#6d28d9' }}>Cascaded MUX</h4>
          <p style={{ margin: 0, color: '#5b21b6', lineHeight: 1.8, fontSize: 14 }}>
            Large MUXes are built by cascading smaller ones. An 8-to-1 MUX can be built from two 4-to-1 MUXes feeding into a 2-to-1 MUX. The high selector bit chooses which 4-to-1 MUX output to use. This is how CPUs build 32-to-1 or 64-to-1 selectors efficiently.
          </p>
        </div>
      )}

      <div style={{ marginTop: 16, padding: 20, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <h4 style={{ margin: '0 0 8px', color: '#166534' }}>What is happening in hardware:</h4>
        <p style={{ margin: 0, color: '#15803d', lineHeight: 1.8, fontSize: 14 }}>
          The MUX uses AND gates to "mask" each input with the selector, then OR gates to combine them. For a 4-to-1 MUX: Output = (In0 AND S1bar AND S0bar) OR (In1 AND S1bar AND S0) OR (In2 AND S1 AND S0bar) OR (In3 AND S1 AND S0). Only one AND gate produces 1, so only one input passes through.
        </p>
      </div>
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'MUX Gate-Level Implementation', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>A 2-to-1 MUX is the simplest multiplexer. It uses just 3 gates: 2 AND gates and 1 OR gate, plus a NOT for the inverted selector.</p>
        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 14, lineHeight: 2.2, color: '#1e293b' }}>
            <div><strong>2-to-1 MUX equation:</strong></div>
            <div>Output = (A AND NOT Sel) OR (B AND Sel)</div>
            <div style={{ marginTop: 8 }}>When Sel=0: NOT Sel=1, so A AND 1 = A passes through</div>
            <div>When Sel=1: Sel=1, so B AND 1 = B passes through</div>
            <div style={{ marginTop: 8 }}><strong>Gate count:</strong> 1 NOT + 2 AND + 1 OR = 4 gates (8 transistors)</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>A 4-to-1 MUX needs a 2-bit selector and uses 4 AND gates (each with 3 inputs) plus a 4-input OR gate. An N-to-1 MUX needs N AND gates with (log2N + 1) inputs each, plus an N-input OR gate. The gate count grows linearly with inputs.</p>
      </div>
    )},
    { title: 'MUX as Universal Logic', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>A remarkable property: a 2^N-to-1 MUX can implement ANY N-variable Boolean function! You simply hard-wire the truth table outputs to the MUX data inputs and use the function variables as selectors.</p>
        <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2, color: '#166534' }}>
            <div><strong>Example: Implement A XOR B using a 4-to-1 MUX</strong></div>
            <div>Connect A to Sel1, B to Sel0</div>
            <div>In0 = 0 (A=0, B=0 -&gt; XOR = 0)</div>
            <div>In1 = 1 (A=0, B=1 -&gt; XOR = 1)</div>
            <div>In2 = 1 (A=1, B=0 -&gt; XOR = 1)</div>
            <div>In3 = 0 (A=1, B=1 -&gt; XOR = 0)</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>This is why MUXes are used in FPGAs (Field-Programmable Gate Arrays). Each logic block in an FPGA is essentially a MUX-based lookup table (LUT) that can be programmed to implement any Boolean function.</p>
      </div>
    )},
    { title: 'Decoders: The MUX Partner', color: '#8b5cf6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>A <strong>decoder</strong> converts an N-bit binary input into 2^N output lines, with exactly one output active at a time. It is the inverse of an encoder and a key building block alongside MUXes.</p>
        <div style={{ padding: 16, background: '#f5f3ff', borderRadius: 12, border: '1px solid #c4b5fd', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2, color: '#4c1d95' }}>
            <div><strong>2-to-4 Decoder:</strong></div>
            <div>Input 00 -&gt; Output: 1000 (line 0 active)</div>
            <div>Input 01 -&gt; Output: 0100 (line 1 active)</div>
            <div>Input 10 -&gt; Output: 0010 (line 2 active)</div>
            <div>Input 11 -&gt; Output: 0001 (line 3 active)</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Decoders are essential for <strong>memory addressing</strong>. A 10-bit address decoder activates 1 of 1,024 memory rows. Your RAM uses decoders to find the exact storage cell being accessed. The address bus feeds into a decoder that "selects" one memory location out of billions.</p>
      </div>
    )},
    { title: 'MUX Trees and Barrel Shifters', color: '#ef4444', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Large MUXes are built as <strong>trees</strong> of smaller MUXes. A 16-to-1 MUX can be four 4-to-1 MUXes feeding one 4-to-1 MUX. This tree structure keeps delays logarithmic.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ padding: 14, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca' }}>
            <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>MUX Tree Sizes</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.8 }}>
              4-to-1: 2 levels, delay = 2 MUX<br/>
              16-to-1: 3 levels, delay = 3 MUX<br/>
              64-to-1: 4 levels, delay = 4 MUX<br/>
              256-to-1: 5 levels, delay = 5 MUX
            </div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca' }}>
            <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>Barrel Shifter</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.8 }}>
              Built from layers of MUXes<br/>
              Each layer shifts by 2^k positions<br/>
              64-bit shift in 6 MUX delays<br/>
              Used for SHL, SHR, rotate ops
            </div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>A <strong>barrel shifter</strong> is a beautiful MUX application: it shifts data by any amount in constant time. For a 64-bit shifter, 6 layers of MUXes (for shift amounts 1, 2, 4, 8, 16, 32) can shift by 0-63 positions in just 6 MUX delays. Without this, shifting by 32 would take 32 clock cycles!</p>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>MUX Engineering Deep Dive</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>From gate-level circuits to barrel shifters — how MUXes power data routing.</p>
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
      code={`# Python if/else IS a multiplexer!
a, b = 10, 20
selector = True

# This if/else compiles to a MUX-like branch
if selector:
    result = a   # MUX input 0
else:
    result = b   # MUX input 1

# Ternary operator = 2-to-1 MUX in one line
result = a if selector else b

# Dictionary lookup = N-to-1 MUX
ops = {0: 'add', 1: 'sub', 2: 'mul', 3: 'div'}
opcode = 2
operation = ops[opcode]  # MUX selects 'mul'

# match/case = MUX with named selectors
match opcode:
    case 0: result = a + b
    case 1: result = a - b
    case 2: result = a * b
    case 3: result = a // b

# List indexing = MUX!
data = [100, 200, 300, 400]
output = data[2]  # Selector=2, output=300

# NumPy where = vectorized MUX
import numpy as np
mask = np.array([True, False, True, False])
a = np.array([1, 2, 3, 4])
b = np.array([5, 6, 7, 8])
np.where(mask, a, b)  # [1, 6, 3, 8]
# Each element: MUX selects a or b`}
      explanation="Every conditional in Python maps to multiplexer-like hardware. An if/else is a 2-to-1 MUX: the condition is the selector, and the two code paths are the inputs. Dictionary lookups and list indexing are N-to-1 MUXes. NumPy where() is a vectorized MUX operating on arrays in parallel."
      hardwareNote="The CPU branch predictor tries to guess which MUX input will be needed BEFORE the condition is evaluated. If it guesses right, execution continues without delay. If wrong, the pipeline must be flushed (15-20 cycle penalty). This is why sorted data processes faster than random data in branch-heavy code."
    />
  );
}

function Layer5() {
  const apps = [
    { icon: '\u{1F9E0}', title: 'ALU Operation Selection',
      desc: 'The ALU computes ADD, SUB, AND, OR, XOR simultaneously. A MUX at the output selects which result to use based on the opcode from the instruction decoder.',
      detail: 'A 3-bit opcode feeds an 8-to-1 MUX that selects from 8 parallel computation results. This is why all ALU operations take the same time.' },
    { icon: '\u{1F4CA}', title: 'Register File',
      desc: 'Reading a register uses a MUX. ARM has 16 registers, so reading one requires a 16-to-1 MUX. x86-64 has 16 general-purpose registers.',
      detail: 'A 64-bit wide 16-to-1 MUX = 16 x 64 = 1,024 MUX gates just to read one register. CPUs have 2-3 read ports, each with its own MUX tree.' },
    { icon: '\u{1F500}', title: 'Data Path Routing',
      desc: 'MUXes steer data between CPU components: should the ALU input come from a register, from memory, or from an immediate value? A MUX decides.',
      detail: 'The CPU datapath has dozens of MUXes. Pipeline forwarding (bypassing) uses MUXes to route results directly to where they are needed without waiting.' },
    { icon: '\u{1F4BE}', title: 'Memory Address Decoding',
      desc: 'Decoders (MUX inverses) select which memory chip, bank, row, and column to access. Your 16GB RAM uses a cascade of decoders.',
      detail: 'A 34-bit address decoder selects 1 of 16 billion memory cells. Built as a tree: chip select, bank select, row decoder, column decoder.' },
    { icon: '\u{1F3AE}', title: 'GPU Texture Sampling',
      desc: 'GPUs use MUXes to select texture data from multiple mipmap levels, blend between texture samples, and choose shader outputs.',
      detail: 'Bilinear texture filtering selects 4 texels and blends them. Trilinear adds mipmap selection. Each is a MUX choosing from pre-computed data.' },
    { icon: '\u{1F4F6}', title: 'Network Switches',
      desc: 'Network switches are essentially massive MUXes: incoming packets on N ports are routed to the correct output port based on destination address.',
      detail: 'A 48-port Ethernet switch is a 48-to-48 crossbar: 48 MUXes, each selecting from 48 inputs. Runs at line rate (100Gbps per port) using hardware MUXes.' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>MUXes Route the Digital World</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>Every time data needs to be selected, steered, or routed, a multiplexer is involved.</p>
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
        <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Every if/else = a MUX</div>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: 15, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
          Conditional logic, data routing, memory addressing, register selection — they all come down to multiplexers choosing between inputs. The MUX is the traffic cop of the CPU.
        </p>
      </div>
    </div>
  );
}

export default function L04_Multiplexers() {
  return (
    <LessonWrapper lessonId="L04" title="Multiplexers & Data Selection"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'TV Remote', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'MUX Simulator', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'MUX Engineering', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python Conditionals', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'Data Routing', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'Gate Count', description: 'How many AND and OR gates does a 16-to-1 MUX need?' },
        { id: 'c2', title: 'Universal Logic', description: 'Implement a 3-input majority function using an 8-to-1 MUX.' },
        { id: 'c3', title: 'Barrel Shifter', description: 'How many MUX layers does a 32-bit barrel shifter need?' },
      ]}
    />
  );
}
