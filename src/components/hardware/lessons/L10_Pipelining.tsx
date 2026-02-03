"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [mode, setMode] = useState<'sequential' | 'pipelined'>('sequential');
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(false);
  const stages = ['FETCH', 'DECODE', 'EXECUTE', 'MEMORY', 'WRITEBACK'];
  const colors = ['#3b82f6', '#f97316', '#22c55e', '#8b5cf6', '#ef4444'];
  const instructions = ['ADD R1,R2,R3', 'SUB R4,R5,R6', 'AND R7,R8,R9', 'OR R10,R11,R12', 'XOR R13,R14,R15'];

  const maxCycle = mode === 'sequential' ? 25 : 9;

  const getStage = (inst: number, cyc: number): number => {
    if (mode === 'sequential') {
      const start = inst * 5;
      const offset = cyc - start;
      return offset >= 0 && offset < 5 ? offset : -1;
    } else {
      const offset = cyc - inst;
      return offset >= 0 && offset < 5 ? offset : -1;
    }
  };

  useEffect(() => {
    if (!running) return;
    if (cycle >= maxCycle) { setRunning(false); return; }
    const timer = setTimeout(() => setCycle(c => c + 1), 600);
    return () => clearTimeout(timer);
  }, [running, cycle, maxCycle]);

  const reset = () => { setCycle(0); setRunning(false); };

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>The Laundry Analogy</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        Imagine doing laundry: wash, dry, fold, iron, put away. Without pipelining, you finish all 5 steps for load 1 before starting load 2. With pipelining, while load 1 dries, load 2 starts washing — all machines stay busy.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        CPUs work the same way. Each instruction has 5 stages (Fetch, Decode, Execute, Memory, Writeback). Without pipelining, 5 instructions take 25 cycles. <strong>With pipelining, they take only 9 cycles</strong> — nearly 3x faster.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        Toggle between sequential and pipelined mode to see the difference. Watch how pipelining keeps every stage busy every cycle.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setMode('sequential'); reset(); }}
          style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: mode === 'sequential' ? '#ef4444' : '#f1f5f9', color: mode === 'sequential' ? 'white' : '#334155', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Sequential (Slow)
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setMode('pipelined'); reset(); }}
          style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: mode === 'pipelined' ? '#22c55e' : '#f1f5f9', color: mode === 'pipelined' ? 'white' : '#334155', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Pipelined (Fast)
        </motion.button>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 24, border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
            {mode === 'sequential' ? 'Sequential Execution' : 'Pipelined Execution'} — Cycle {cycle}/{maxCycle}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: mode === 'pipelined' ? '#22c55e' : '#ef4444' }}>
            {mode === 'sequential' ? '25 cycles for 5 instructions' : '9 cycles for 5 instructions (2.8x faster!)'}
          </div>
        </div>

        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '140px repeat(' + (maxCycle + 1) + ', 44px)', gap: 3, minWidth: mode === 'sequential' ? 1300 : 600 }}>
            <div style={{ fontSize: 10, color: '#64748b', padding: 4 }}>Instruction</div>
            {Array.from({ length: maxCycle + 1 }, (_, c) => (
              <div key={c} style={{ fontSize: 10, color: cycle === c ? '#f97316' : '#64748b', textAlign: 'center', padding: 4, fontWeight: cycle === c ? 700 : 400 }}>C{c}</div>
            ))}

            {instructions.map((inst, iIdx) => (
              <React.Fragment key={iIdx}>
                <div style={{ fontSize: 11, color: '#e2e8f0', fontFamily: 'monospace', padding: '6px 4px', fontWeight: 600 }}>{inst}</div>
                {Array.from({ length: maxCycle + 1 }, (_, c) => {
                  const stg = getStage(iIdx, c);
                  const isActive = c === cycle && stg >= 0;
                  return (
                    <motion.div key={c}
                      animate={{ opacity: stg >= 0 && c <= cycle ? 1 : c <= cycle ? 0.15 : 0.05, scale: isActive ? 1.1 : 1 }}
                      style={{ borderRadius: 4, background: stg >= 0 ? colors[stg] : '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: 'white', padding: 2, border: isActive ? '2px solid white' : '1px solid transparent' }}>
                      {stg >= 0 ? stages[stg][0] : ''}
                    </motion.div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
          {stages.map((s, i) => {
            const active = instructions.some((_, iIdx) => getStage(iIdx, cycle) === i);
            return (
              <div key={i} style={{ padding: '6px 12px', borderRadius: 8, background: active ? colors[i] : '#1f2937', color: active ? 'white' : '#475569', fontSize: 11, fontWeight: 700, border: '1px solid ' + (active ? colors[i] : '#374151') }}>
                {s} {active ? '\u2713' : '\u00B7'}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setRunning(!running)}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: running ? '#ef4444' : '#22c55e', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            {running ? 'Pause' : 'Run'}
          </motion.button>
          <button onClick={() => setCycle(c => Math.min(c + 1, maxCycle))}
            style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>Step</button>
          <button onClick={reset}
            style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>Reset</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 8px', color: '#166534' }}>Throughput vs Latency</h4>
          <p style={{ margin: 0, color: '#15803d', lineHeight: 1.7, fontSize: 14 }}>
            Pipelining does NOT make individual instructions faster (latency stays 5 cycles). It increases <strong>throughput</strong>: once the pipeline is full, one instruction completes every cycle instead of every 5 cycles.
          </p>
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <h4 style={{ margin: '0 0 8px', color: '#1d4ed8' }}>Speedup Formula</h4>
          <p style={{ margin: 0, color: '#1e40af', lineHeight: 1.7, fontSize: 14 }}>
            Ideal speedup = number of pipeline stages. A 5-stage pipeline is ideally 5x faster. Real speedup is less due to hazards (data dependencies, branches, structural conflicts).
          </p>
        </div>
      </div>
    </div>
  );
}

function Layer2() {
  const [hazardType, setHazardType] = useState<'data' | 'control' | 'structural'>('data');
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(false);

  const hazards = {
    data: {
      title: 'Data Hazard',
      instructions: [
        { text: 'ADD R1, R2, R3', stages: [0,1,2,3,4], note: 'Produces R1' },
        { text: 'SUB R4, R1, R5', stages: [1,2,-1,3,4], note: 'Needs R1 — STALL at cycle 2!' },
        { text: 'AND R6, R7, R8', stages: [2,3,-1,4,5], note: 'Delayed by stall' },
      ],
      maxCycle: 8,
      desc: 'Instruction 2 needs R1, which instruction 1 hasn\'t written yet. The pipeline stalls (inserts a "bubble") until R1 is available.',
      solution: 'Data forwarding (bypassing) sends the ALU result directly to the next instruction\'s input, eliminating the stall in many cases.',
    },
    control: {
      title: 'Control Hazard',
      instructions: [
        { text: 'BEQ R1, R2, target', stages: [0,1,2,3,4], note: 'Branch — where to fetch next?' },
        { text: '??? (speculated)', stages: [1,2,-1,-1,-1], note: 'Fetched speculatively, flushed if wrong!' },
        { text: 'target: OR R5,R6,R7', stages: [-1,-1,3,4,5], note: 'Correct target fetched after branch resolves' },
      ],
      maxCycle: 8,
      desc: 'The branch destination isn\'t known until the Execute stage. The pipeline has already fetched the next instruction — if the branch is taken, that fetched instruction must be flushed (discarded).',
      solution: 'Branch prediction guesses the outcome. Modern CPUs are 95-99% accurate. A misprediction costs 10-20 cycles of flushed work.',
    },
    structural: {
      title: 'Structural Hazard',
      instructions: [
        { text: 'LW R1, 0(R2)', stages: [0,1,2,3,4], note: 'Memory stage uses memory port' },
        { text: 'ADD R3, R4, R5', stages: [1,2,3,4,5], note: 'No conflict — uses ALU' },
        { text: 'LW R6, 0(R7)', stages: [2,3,-1,4,5], note: 'STALL — memory port is busy!' },
      ],
      maxCycle: 8,
      desc: 'Two instructions need the same hardware unit at the same time. Only one can use the memory port per cycle.',
      solution: 'Separate instruction and data caches (Harvard architecture) let fetch and memory access happen simultaneously, eliminating this structural hazard.',
    },
  };

  const h = hazards[hazardType];
  const colors = ['#3b82f6', '#f97316', '#22c55e', '#8b5cf6', '#ef4444'];
  const stageNames = ['IF', 'ID', 'EX', 'ME', 'WB'];

  useEffect(() => {
    if (!running) return;
    if (cycle >= h.maxCycle) { setRunning(false); return; }
    const t = setTimeout(() => setCycle(c => c + 1), 700);
    return () => clearTimeout(t);
  }, [running, cycle, h.maxCycle]);

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Pipeline Hazards</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24, fontSize: 16 }}>
        Pipelining isn't always smooth. Three types of hazards can force the pipeline to stall or flush. Select each hazard to see how it disrupts the pipeline and how hardware solves it.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {([['data', 'Data Hazard', '#ef4444'], ['control', 'Control Hazard', '#f97316'], ['structural', 'Structural Hazard', '#8b5cf6']] as const).map(([key, label, color]) => (
          <motion.button key={key} whileHover={{ scale: 1.05 }} onClick={() => { setHazardType(key); setCycle(0); setRunning(false); }}
            style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: hazardType === key ? color : '#f1f5f9', color: hazardType === key ? 'white' : '#334155', fontWeight: 700, fontSize: 13 }}>
            {label}
          </motion.button>
        ))}
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 28, marginBottom: 24, border: '1px solid #334155' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 16 }}>{h.title}</div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px repeat(' + (h.maxCycle + 1) + ', 48px)', gap: 3, marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: '#64748b', padding: 4 }}>Instruction</div>
          {Array.from({ length: h.maxCycle + 1 }, (_, c) => (
            <div key={c} style={{ textAlign: 'center', fontSize: 10, color: cycle === c ? '#f97316' : '#475569', fontWeight: cycle === c ? 700 : 400 }}>C{c}</div>
          ))}

          {h.instructions.map((inst, iIdx) => (
            <React.Fragment key={iIdx}>
              <div style={{ fontSize: 11, color: '#e2e8f0', fontFamily: 'monospace', padding: '6px 0' }}>{inst.text}</div>
              {Array.from({ length: h.maxCycle + 1 }, (_, c) => {
                const stg = inst.stages.findIndex((s) => s === c);
                const isActive = stg >= 0 && c <= cycle;
                const isCurrent = stg >= 0 && c === cycle;
                let isStallCell = false;
                for (let s = 0; s < inst.stages.length; s++) {
                  if (inst.stages[s] === -1 && c === (s > 0 ? inst.stages[s-1] + 1 : 0)) isStallCell = true;
                }
                return (
                  <motion.div key={c}
                    animate={{ opacity: isActive ? 1 : isStallCell && c <= cycle ? 0.8 : c <= cycle ? 0.1 : 0.05, scale: isCurrent ? 1.1 : 1 }}
                    style={{ borderRadius: 4, background: isStallCell ? '#fbbf2466' : stg >= 0 ? colors[stg] : '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: 'white', padding: 2, border: isCurrent ? '2px solid white' : '1px solid transparent' }}>
                    {isStallCell ? 'STALL' : stg >= 0 ? stageNames[stg] : ''}
                  </motion.div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          {h.instructions.map((inst, i) => (
            <div key={i} style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
              <span style={{ color: '#f97316', fontWeight: 700 }}>I{i+1}:</span> {inst.note}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setRunning(!running)}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: running ? '#ef4444' : '#22c55e', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            {running ? 'Pause' : 'Run'}
          </motion.button>
          <button onClick={() => setCycle(c => Math.min(c + 1, h.maxCycle))}
            style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>Step</button>
          <button onClick={() => { setCycle(0); setRunning(false); }}
            style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>Reset</button>
        </div>
      </div>

      <div style={{ padding: 20, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 16 }}>
        <h4 style={{ margin: '0 0 8px', color: '#1e293b' }}>What's Happening</h4>
        <p style={{ margin: '0 0 12px', color: '#475569', lineHeight: 1.7, fontSize: 14 }}>{h.desc}</p>
        <div style={{ padding: 12, borderRadius: 8, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <strong style={{ color: '#166534' }}>Hardware Solution:</strong>
          <span style={{ color: '#15803d' }}> {h.solution}</span>
        </div>
      </div>

      <div style={{ padding: 20, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
        <h4 style={{ margin: '0 0 8px', color: '#1d4ed8' }}>Pipeline Stalls Cost Performance</h4>
        <p style={{ margin: 0, color: '#1e40af', lineHeight: 1.7, fontSize: 14 }}>
          Every stall cycle is a wasted cycle. A 5-stage pipeline with 20% stall rate drops from 5x ideal speedup to 4x actual. Modern CPUs use forwarding, branch prediction, and out-of-order execution to minimize stalls.
        </p>
      </div>
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'Pipeline Stages in Detail', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Each stage is separated by a <strong>pipeline register</strong> that holds the instruction's data between clock edges. These registers add hardware cost but enable overlapping execution.</p>
        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#1e293b' }}>
            <div><strong>IF (Instruction Fetch):</strong> PC &rarr; Instruction Memory &rarr; IF/ID Register</div>
            <div>Read instruction at address PC. Increment PC by 4.</div>
            <div style={{ marginTop: 8 }}><strong>ID (Instruction Decode):</strong> IF/ID &rarr; Register File &rarr; ID/EX Register</div>
            <div>Decode opcode. Read source registers. Sign-extend immediate.</div>
            <div style={{ marginTop: 8 }}><strong>EX (Execute):</strong> ID/EX &rarr; ALU &rarr; EX/MEM Register</div>
            <div>ALU computes result. Branch target calculated. Condition evaluated.</div>
            <div style={{ marginTop: 8 }}><strong>MEM (Memory Access):</strong> EX/MEM &rarr; Data Memory &rarr; MEM/WB Register</div>
            <div>Load reads from memory. Store writes to memory. Others pass through.</div>
            <div style={{ marginTop: 8 }}><strong>WB (Writeback):</strong> MEM/WB &rarr; Register File</div>
            <div>Write result back to destination register.</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>The clock speed is limited by the <strong>slowest stage</strong>. If EX takes 2ns but other stages take 1ns, all stages run at 2ns. Balancing stage latencies is critical for performance.</p>
      </div>
    )},
    { title: 'Data Forwarding (Bypassing)', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Without forwarding, data hazards cause 2-cycle stalls. Forwarding adds multiplexers that route results directly from later pipeline stages back to earlier ones.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ padding: 14, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca' }}>
            <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: 4, fontSize: 14 }}>Without Forwarding</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.8 }}>
              ADD R1, R2, R3 — result in WB (cycle 5)<br/>
              SUB R4, R1, R5 — needs R1 in ID (cycle 3)<br/>
              Gap = 2 cycles. Insert 2 stall bubbles.<br/>
              <strong>CPI = 1.0 + 0.4 penalty = 1.4</strong>
            </div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div style={{ fontWeight: 700, color: '#166534', marginBottom: 4, fontSize: 14 }}>With Forwarding</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.8 }}>
              ADD R1, R2, R3 — result available end of EX (cycle 3)<br/>
              SUB R4, R1, R5 — gets R1 via forward path in EX (cycle 4)<br/>
              No stall needed! Result bypasses register file.<br/>
              <strong>CPI = 1.0 (ideal)</strong>
            </div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Exception: <strong>load-use hazard</strong>. A LOAD instruction's data isn't available until the end of MEM stage. If the next instruction needs it in EX, a 1-cycle stall is unavoidable even with forwarding. Compilers reorder instructions to avoid this.</p>
      </div>
    )},
    { title: 'Branch Prediction', color: '#f97316', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Branches are decided in the EX stage, but the pipeline has already fetched 2 instructions by then. Wrong guess = flush and restart.</p>
        <div style={{ padding: 16, background: '#fff7ed', borderRadius: 12, border: '1px solid #fed7aa', marginBottom: 16 }}>
          <div style={{ fontSize: 13, lineHeight: 2.2, color: '#9a3412' }}>
            <div><strong>Static Prediction:</strong> Always predict not-taken (50-60% accurate).</div>
            <div><strong>1-bit Predictor:</strong> Remember last outcome. ~80% accurate.</div>
            <div><strong>2-bit Saturating Counter:</strong> Need 2 wrong predictions to flip. ~85%.</div>
            <div><strong>Two-Level Adaptive:</strong> Pattern history table. ~93% accurate.</div>
            <div><strong>TAGE (Tagged Geometric):</strong> Multiple history lengths. ~96%.</div>
            <div><strong>Perceptron Predictor:</strong> Neural-network-inspired. AMD Zen. ~97%.</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Even at 97% accuracy, a 20-stage pipeline means 3% × 20 cycles = 0.6 cycles lost per branch on average. Branch prediction is the single most important predictor of CPU performance.</p>
      </div>
    )},
    { title: 'Superscalar & Out-of-Order', color: '#8b5cf6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Modern CPUs go far beyond simple 5-stage pipelining. They fetch, decode, and execute <strong>multiple instructions per cycle</strong> and reorder them for maximum parallelism.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'Superscalar', desc: 'Duplicate execution units. A 4-wide superscalar executes 4 instructions per cycle. Requires multiple ALUs, load/store units, branch units.', color: '#8b5cf6' },
            { name: 'Out-of-Order (OoO)', desc: 'Instructions enter a reorder buffer and execute when operands are ready, regardless of program order. Results committed in order.', color: '#3b82f6' },
            { name: 'Register Renaming', desc: 'Maps architectural registers (R1-R31) to 128+ physical registers. Eliminates false dependencies (WAR, WAW hazards).', color: '#22c55e' },
            { name: 'Speculative Execution', desc: 'Execute past branches before they resolve. Correct predictions keep results; mispredictions discard them. Critical for deep pipelines.', color: '#ef4444' },
          ].map(f => (
            <div key={f.name} style={{ padding: 12, borderRadius: 10, background: f.color + '08', border: '1px solid ' + f.color + '33' }}>
              <div style={{ fontWeight: 700, color: f.color, marginBottom: 4, fontSize: 14 }}>{f.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Apple M3 performance core: 8-wide decode, 13+ pipeline stages, ~600 instructions in-flight, 192 physical integer registers, 5 ALUs, 3 load/store units. Up to 8 instructions per cycle at 3.7 GHz.</p>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Pipeline Engineering</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>How real CPUs solve pipeline problems and push beyond simple pipelining.</p>
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
      code={`# How Python affects CPU pipelining
import dis, random, time

# === Unpredictable branches kill pipeline performance ===
data_sorted = sorted([random.randint(0, 255) for _ in range(100000)])
data_random = data_sorted[:]
random.shuffle(data_random)

def sum_above_128(data):
    total = 0
    for val in data:
        if val > 128:  # Branch!
            total += val
    return total

t0 = time.perf_counter()
for _ in range(100): sum_above_128(data_sorted)
sorted_time = time.perf_counter() - t0

t0 = time.perf_counter()
for _ in range(100): sum_above_128(data_random)
random_time = time.perf_counter() - t0

print(f"Sorted:   {sorted_time*1000:.1f}ms")
print(f"Unsorted: {random_time*1000:.1f}ms")
print(f"Unsorted is {random_time/sorted_time:.1f}x slower!")
# In C: 3-5x difference. In Python: 1.2-1.5x
# because interpreter overhead dominates.

# === CPython bytecode per iteration ===
def simple_loop():
    total = 0
    for x in [1, 2, 3]:
        total += x
    return total

print("\\nBytecode for simple_loop:")
dis.dis(simple_loop)
# Each bytecode dispatch = indirect branch
# The interpreter's switch/case over ~120 opcodes
# is inherently unpredictable for branch predictors`}
      explanation="Branch prediction matters even in Python. Sorted data has predictable branch patterns (all False then all True), so the CPU predicts ~99% correctly. Unsorted data is random — ~50% misprediction. In C this causes 3-5x slowdowns; in Python it's smaller because interpreter overhead dominates."
      hardwareNote="CPython's main loop is a giant switch statement over ~120 opcodes. Each bytecode dispatch is an indirect branch that's hard to predict. This is why Python is inherently pipeline-unfriendly. JIT compilers (PyPy, Cython) generate native code that works much better with the pipeline."
    />
  );
}

function Layer5() {
  const apps = [
    { icon: '\u{1F4F1}', title: 'ARM Cortex Pipeline Evolution',
      desc: 'ARM7 (1994): 3-stage, 60 MHz. Cortex-A53 (2012): 8-stage in-order, 1.5 GHz. Cortex-A78 (2020): 13-stage OoO, 3 GHz. Cortex-X4 (2023): 14+ stages, 3.4 GHz.',
      detail: 'Each generation added stages and width. ARM balances efficiency cores (8-stage, power-efficient) with performance cores (14-stage, fast) in big.LITTLE designs.' },
    { icon: '\u{1F3AE}', title: 'GPU Pipelines',
      desc: 'GPUs have thousands of simple pipelines in parallel. NVIDIA RTX 4090: 16,384 CUDA cores. Thread-level parallelism hides stalls completely.',
      detail: 'When one thread stalls on memory, the GPU switches to another instantly (zero-cost context switch). With 32+ threads per core, the pipeline stays full.' },
    { icon: '\u{1F6E1}\uFE0F', title: 'Spectre & Meltdown',
      desc: 'Speculative execution was exploited by Spectre (2018). CPUs speculatively accessed forbidden memory; cache timing revealed the data even after results were discarded.',
      detail: 'Mitigations (retpolines, IBRS, microcode patches) cost 5-30% performance. The fundamental tradeoff: speculation is essential but creates side channels.' },
    { icon: '\u26A1', title: 'Compiler Pipeline Optimization',
      desc: 'Compilers reorder instructions to minimize stalls. "Instruction scheduling" fills stall slots with independent operations.',
      detail: 'GCC -O2 performs software pipelining for loops: overlapping iterations to keep hardware busy. LLVM models the exact pipeline of the target CPU.' },
    { icon: '\u{1F9EC}', title: 'RISC-V Pipeline Designs',
      desc: 'RISC-V was designed with pipelining in mind. Fixed 32-bit instructions simplify fetch/decode. No complex addressing modes.',
      detail: 'SiFive U74: 8-stage dual-issue, 1.5 GHz. Ventana Veyron: 14-stage OoO, 4-wide, 3.6 GHz. Open ISA lets anyone design custom pipelines.' },
    { icon: '\u{1F52C}', title: 'Pipeline Depth Trends',
      desc: 'Pentium 4 (2000): 20-31 stages. Very high clock (3.8 GHz) but huge branch penalty. Modern designs settled on 12-16 stages.',
      detail: 'Deeper = higher frequency but longer misprediction penalty and more power. The "pipeline depth wall" was hit around 2004. Industry shifted to wider instead of deeper.' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Pipelining in the Real World</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>From mobile chips to GPUs to security vulnerabilities — pipelining shapes all of modern computing.</p>
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
        <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>PIPELINE EVOLUTION</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginTop: 16 }}>
          <div><div style={{ fontSize: 20, fontWeight: 800, color: '#3b82f6' }}>1985</div><div style={{ fontSize: 12, color: '#94a3b8' }}>MIPS R2000: 5 stages</div></div>
          <div style={{ fontSize: 20, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 20, fontWeight: 800, color: '#f97316' }}>2000</div><div style={{ fontSize: 12, color: '#94a3b8' }}>Pentium 4: 20 stages</div></div>
          <div style={{ fontSize: 20, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 20, fontWeight: 800, color: '#22c55e' }}>2024</div><div style={{ fontSize: 12, color: '#94a3b8' }}>M3 Pro: 13+ stages, 8-wide</div></div>
        </div>
        <p style={{ marginTop: 16, color: '#94a3b8', fontSize: 14, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
          The trend shifted from "deeper pipelines" to "wider pipelines" after the Pentium 4 era. More instructions per cycle beats higher clock speed.
        </p>
      </div>
    </div>
  );
}

export default function L10_Pipelining() {
  return (
    <LessonWrapper lessonId="L10" title="CPU Pipelining"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'Laundry Pipeline', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'Pipeline Hazards', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'Forwarding & Prediction', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python & Branches', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'Pipeline Evolution', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'Stall Count', description: 'A 5-stage pipeline processes 100 instructions with 15 data hazards (1-cycle stall each). What is the CPI?' },
        { id: 'c2', title: 'Branch Penalty', description: 'A 12-stage pipeline has 95% branch prediction accuracy. If 20% of instructions are branches, what is the average penalty per instruction?' },
        { id: 'c3', title: 'Speedup Limit', description: 'Why doesn\'t a 20-stage pipeline give 20x speedup over non-pipelined execution?' },
      ]}
    />
  );
}
