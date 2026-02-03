"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>The CPU's Heartbeat</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 24 }}>
        The CPU repeats three steps billions of times per second: <strong>Fetch</strong> the instruction from memory,
        <strong> Decode</strong> what it means, and <strong>Execute</strong> it. This is the FDE cycle.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'FETCH', color: '#3b82f6', desc: 'Get instruction from RAM' },
          { label: 'DECODE', color: '#f97316', desc: 'Figure out what to do' },
          { label: 'EXECUTE', color: '#22c55e', desc: 'Do the operation' },
        ].map((s, i) => (
          <motion.div key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
            style={{ padding: '20px 24px', borderRadius: 16, background: s.color, color: 'white', textAlign: 'center', minWidth: 140 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{s.label}</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{s.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Layer2() {
  const [step, setStep] = useState(0);
  const program = [
    { addr: '0x00', instr: 'LOAD R1, 5', fetch: 'PC=0x00, read memory', decode: 'Opcode=LOAD, dest=R1, val=5', execute: 'R1 ← 5' },
    { addr: '0x04', instr: 'LOAD R2, 3', fetch: 'PC=0x04, read memory', decode: 'Opcode=LOAD, dest=R2, val=3', execute: 'R2 ← 3' },
    { addr: '0x08', instr: 'ADD R3, R1, R2', fetch: 'PC=0x08, read memory', decode: 'Opcode=ADD, dest=R3, src=R1,R2', execute: 'R3 ← R1+R2 = 8' },
  ];
  const phases = ['fetch', 'decode', 'execute'] as const;
  const instrIdx = Math.floor(step / 3);
  const phase = step % 3;
  const current = program[Math.min(instrIdx, program.length - 1)];
  const done = step >= program.length * 3;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>Step Through the FDE Cycle</h2>
      <div style={{ marginBottom: 20 }}>
        {program.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 16px', borderRadius: 8, marginBottom: 4,
            background: instrIdx === i ? '#eff6ff' : 'transparent', border: instrIdx === i ? '1px solid #bfdbfe' : '1px solid transparent',
            fontFamily: 'monospace', fontSize: 14 }}>
            <span style={{ color: '#64748b' }}>{p.addr}</span>
            <span style={{ color: '#1e293b', fontWeight: instrIdx === i ? 700 : 400 }}>{p.instr}</span>
          </div>
        ))}
      </div>
      {!done && (
        <div style={{ padding: 16, borderRadius: 12, marginBottom: 16,
          background: phase === 0 ? '#eff6ff' : phase === 1 ? '#fff7ed' : '#f0fdf4',
          border: `1px solid ${phase === 0 ? '#bfdbfe' : phase === 1 ? '#fed7aa' : '#bbf7d0'}` }}>
          <div style={{ fontWeight: 700, color: phase === 0 ? '#1d4ed8' : phase === 1 ? '#c2410c' : '#166534', marginBottom: 4 }}>
            {phases[phase].toUpperCase()}
          </div>
          <div style={{ color: '#475569', fontFamily: 'monospace', fontSize: 14 }}>
            {current[phases[phase]]}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
          style={{ padding: '10px 24px', borderRadius: 8, border: 'none', cursor: step > 0 ? 'pointer' : 'not-allowed',
            background: step > 0 ? '#e2e8f0' : '#f8fafc', color: '#334155', fontWeight: 600 }}>← Back</button>
        <button onClick={() => setStep(step + 1)} disabled={done}
          style={{ padding: '10px 24px', borderRadius: 8, border: 'none', cursor: done ? 'not-allowed' : 'pointer',
            background: done ? '#f8fafc' : '#3b82f6', color: done ? '#94a3b8' : 'white', fontWeight: 600 }}>
          {done ? 'Done' : 'Next Step →'}
        </button>
        <button onClick={() => setStep(0)}
          style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', color: '#334155', fontWeight: 600 }}>Reset</button>
      </div>
    </div>
  );
}

function Layer3() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>FDE in Detail</h2>
      {[
        { step: 1, title: 'Fetch', desc: 'PC (Program Counter) sends address to memory. Memory returns the instruction. PC increments to next address.' },
        { step: 2, title: 'Decode', desc: 'Instruction register holds the binary. Control unit extracts opcode, register IDs, and immediate values.' },
        { step: 3, title: 'Execute', desc: 'ALU performs the operation. Results write back to registers or memory. Flags update.' },
        { step: 4, title: 'Repeat', desc: 'At 4 GHz, this happens 4 billion times per second. Pipelining overlaps stages for speed.' },
      ].map(s => (
        <div key={s.step} style={{ display: 'flex', gap: 16, marginBottom: 14, padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f97316', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
          <div><h4 style={{ margin: '0 0 4px', color: '#1e293b' }}>{s.title}</h4><p style={{ margin: 0, color: '#475569', fontSize: 14 }}>{s.desc}</p></div>
        </div>
      ))}
    </div>
  );
}

function Layer4() {
  return (
    <PythonConnection
      code={`# Each Python line = multiple FDE cycles
x = 5      # LOAD R1, 5         (1 FDE cycle)
y = 3      # LOAD R2, 3         (1 FDE cycle)
z = x + y  # ADD R3, R1, R2     (1 FDE cycle)

# A for loop = many FDE cycles
total = 0
for i in range(100):  # Each iteration:
    total += i        # LOAD, ADD, STORE = 3+ cycles
# ~300+ FDE cycles for this loop

# Function call = extra FDE cycles
def add(a, b):    # PUSH return addr, JUMP
    return a + b  # ADD, then RETURN
result = add(5, 3)  # CALL + RETURN overhead`}
      explanation="A single Python line may need 1-10+ FDE cycles. Loops multiply that by iteration count. This is why algorithm efficiency matters — fewer cycles = faster code."
      hardwareNote="Modern CPUs can execute 4+ instructions per cycle using superscalar architecture, but the basic FDE model still applies."
    />
  );
}

function Layer5() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>The FDE Cycle Powers Everything</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {[
          { icon: '🖥️', title: 'Every Program', desc: 'From notepad to AI — all software is just FDE cycles running instructions.' },
          { icon: '⚡', title: 'Clock Speed', desc: '4 GHz = 4 billion FDE cycles/sec. Higher clock = faster but more heat.' },
          { icon: '🔄', title: 'Pipelining', desc: 'Overlap F-D-E stages like a factory assembly line. 3x throughput improvement.' },
        ].map(a => (
          <div key={a.title} style={{ padding: 20, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{a.icon}</div>
            <h4 style={{ margin: '0 0 8px', color: '#1e293b', fontWeight: 600 }}>{a.title}</h4>
            <p style={{ margin: 0, color: '#475569', fontSize: 14, lineHeight: 1.6 }}>{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function L07_FDECycle() {
  return (
    <LessonWrapper lessonId="l07" title="Fetch-Decode-Execute"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'CPU Heartbeat', icon: '💓', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'Step Through', icon: '🎮', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'Detailed Stages', icon: '📐', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python Lines = Cycles', icon: '🐍', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'Applications', icon: '🌍', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'Cycle Count', description: 'How many FDE cycles for a 1000-iteration loop with 3 instructions?' },
        { id: 'c2', title: 'PC Tracking', description: 'If instructions are 4 bytes, what does PC equal after 5 instructions?' },
      ]}
    />
  );
}
