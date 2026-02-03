"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [stickyNotes, setStickyNotes] = useState([0, 1, 0, 1, 1, 0, 1, 0]);
  const [clockTick, setClockTick] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [pendingValues, setPendingValues] = useState([1, 0, 1, 0, 0, 1, 0, 1]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setClockTick(prev => {
        const next = prev + 1;
        if (next % 2 === 0) {
          setStickyNotes([...pendingValues]);
          setPendingValues(Array.from({ length: 8 }, () => Math.random() > 0.5 ? 1 : 0));
        }
        return next;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, [autoPlay, pendingValues]);

  const isRisingEdge = clockTick % 2 === 0;

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Sticky Notes That Remember</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        Logic gates are <strong>forgetful</strong>: their output depends only on current inputs. The instant an input changes, the output changes. But computers need to <strong>remember</strong> things — your variables, the program counter, register values.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        A <strong>flip-flop</strong> is a circuit that captures and holds a single bit. Think of it as a sticky note: when a clock signal "ticks," the flip-flop reads the input and writes it to the sticky note. Between ticks, the note holds its value no matter what happens to the input.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        This is the fundamental difference between <strong>combinational</strong> logic (gates: output = function of inputs) and <strong>sequential</strong> logic (flip-flops: output = stored state). Every register, counter, and state machine in a CPU is built from flip-flops.
      </p>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 24, border: '1px solid #334155' }}>
        {/* Clock signal */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Clock Signal</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            {Array.from({ length: 16 }, (_, i) => (
              <motion.div key={i}
                animate={{ background: i <= (clockTick % 16) ? (i % 2 === 0 ? '#22c55e' : '#1f2937') : '#1f2937' }}
                style={{ width: 24, height: i % 2 === 0 ? 24 : 8, borderRadius: 3, border: '1px solid #374151', alignSelf: 'flex-end' }} />
            ))}
          </div>
          <motion.div
            animate={{ color: isRisingEdge ? '#22c55e' : '#64748b', scale: isRisingEdge ? [1, 1.2, 1] : 1 }}
            style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>
            {isRisingEdge ? '\u2191 RISING EDGE — Capture!' : 'Holding value...'}
          </motion.div>
        </div>

        {/* Pending inputs */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', marginBottom: 8 }}>Pending Input (D)</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
            {pendingValues.map((v, i) => (
              <motion.div key={i} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}
                style={{ width: 48, height: 36, borderRadius: 8, background: v ? '#f97316' : '#374151', border: '2px solid ' + (v ? '#f97316' : '#4b5563'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'white', fontFamily: 'monospace' }}>
                {v}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ textAlign: 'center', fontSize: 20, color: isRisingEdge ? '#22c55e' : '#374151', marginBottom: 16 }}>
          {isRisingEdge ? '\u2B07 CAPTURED' : '\u2B07 waiting for clock...'}
        </div>

        {/* Stored values */}
        <div>
          <div style={{ fontSize: 11, color: '#22c55e', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', marginBottom: 8 }}>Stored Output (Q) — Sticky Notes</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
            {stickyNotes.map((v, i) => (
              <motion.div key={i + '-' + v}
                initial={isRisingEdge ? { scale: 1.3, boxShadow: '0 0 20px #22c55e66' } : {}}
                animate={{ scale: 1, boxShadow: '0 0 5px rgba(0,0,0,0.2)' }}
                style={{ width: 48, height: 48, borderRadius: 8, background: v ? 'linear-gradient(135deg, #166534, #22c55e)' : '#1f2937',
                  border: '2px solid ' + (v ? '#22c55e' : '#4b5563'), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'white', fontFamily: 'monospace' }}>{v}</div>
                <div style={{ fontSize: 8, color: v ? '#86efac' : '#6b7280' }}>FF{i}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <button onClick={() => setAutoPlay(!autoPlay)}
            style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: autoPlay ? '#ef4444' : '#22c55e', color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            {autoPlay ? 'Stop Clock' : 'Start Clock'}
          </button>
          <button onClick={() => { setAutoPlay(false); setStickyNotes([...pendingValues]); setPendingValues(Array.from({ length: 8 }, () => Math.random() > 0.5 ? 1 : 0)); setClockTick(prev => prev + 2); }}
            style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 12 }}>
            Manual Tick
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <h4 style={{ margin: '0 0 8px', color: '#1d4ed8' }}>Why Clocks Matter</h4>
          <p style={{ margin: 0, color: '#1e40af', lineHeight: 1.7, fontSize: 14 }}>
            Without a clock, gates would change outputs chaotically as signals propagate at different speeds. The clock synchronizes everything: all flip-flops capture at the same instant, ensuring the entire CPU moves in lockstep. A 4 GHz clock ticks 4 billion times per second.
          </p>
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 8px', color: '#166534' }}>Combinational vs Sequential</h4>
          <p style={{ margin: 0, color: '#15803d', lineHeight: 1.7, fontSize: 14 }}>
            <strong>Combinational:</strong> AND, OR, XOR — output depends only on current inputs. No memory.<br/>
            <strong>Sequential:</strong> Flip-flops — output depends on stored state. Has memory.<br/>
            Every CPU is a mix of both: combinational logic computes, flip-flops store results.
          </p>
        </div>
      </div>
    </div>
  );
}

function Layer2() {
  const [ffType, setFfType] = useState<'d' | 'sr' | 'jk' | 't'>('d');
  const [d, setD] = useState(false);
  const [s, setS] = useState(false);
  const [r, setR] = useState(false);
  const [j, setJ] = useState(false);
  const [k, setK] = useState(false);
  const [q, setQ] = useState(false);
  const [history, setHistory] = useState<Array<{ q: boolean; input: string }>>([]);

  const clockPulse = () => {
    let newQ = q;
    let inputDesc = '';
    switch (ffType) {
      case 'd': newQ = d; inputDesc = 'D=' + (d ? '1' : '0'); break;
      case 'sr':
        if (s && !r) { newQ = true; inputDesc = 'S=1 R=0'; }
        else if (!s && r) { newQ = false; inputDesc = 'S=0 R=1'; }
        else if (!s && !r) { inputDesc = 'S=0 R=0 (hold)'; }
        else { inputDesc = 'S=1 R=1 (INVALID)'; }
        break;
      case 'jk':
        if (j && !k) { newQ = true; inputDesc = 'J=1 K=0 (set)'; }
        else if (!j && k) { newQ = false; inputDesc = 'J=0 K=1 (reset)'; }
        else if (j && k) { newQ = !q; inputDesc = 'J=1 K=1 (toggle)'; }
        else { inputDesc = 'J=0 K=0 (hold)'; }
        break;
      case 't': newQ = d ? !q : q; inputDesc = 'T=' + (d ? '1 (toggle)' : '0 (hold)'); break;
    }
    setQ(newQ);
    setHistory(prev => [{ q: newQ, input: inputDesc }, ...prev].slice(0, 12));
  };

  const types = [
    { id: 'd' as const, name: 'D Flip-Flop', desc: 'Data — captures input on clock edge' },
    { id: 'sr' as const, name: 'SR Flip-Flop', desc: 'Set/Reset — separate set and clear' },
    { id: 'jk' as const, name: 'JK Flip-Flop', desc: 'Like SR but J=K=1 toggles' },
    { id: 't' as const, name: 'T Flip-Flop', desc: 'Toggle — flips state when T=1' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Flip-Flop Simulator</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
        Set inputs, press Clock to capture. Watch the output change (or not!) based on the flip-flop type. The history shows previous states.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {types.map(t => (
          <motion.button key={t.id} whileHover={{ scale: 1.05 }} onClick={() => { setFfType(t.id); setHistory([]); }}
            style={{ padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', background: ffType === t.id ? '#8b5cf6' : '#f1f5f9', color: ffType === t.id ? 'white' : '#334155', fontWeight: 700, fontSize: 13 }}>
            {t.name}
          </motion.button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Input controls */}
        <div style={{ padding: 24, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 12 }}>Inputs:</div>
          {ffType === 'd' && (
            <motion.button onClick={() => setD(!d)} whileHover={{ scale: 1.05 }}
              style={{ width: '100%', padding: '16px 20px', borderRadius: 12, border: '2px solid ' + (d ? '#3b82f6' : '#e2e8f0'), background: d ? '#3b82f6' : 'white', color: d ? 'white' : '#475569', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>
              D = {d ? '1' : '0'} &nbsp; (click to toggle)
            </motion.button>
          )}
          {ffType === 'sr' && (
            <div style={{ display: 'flex', gap: 12 }}>
              <motion.button onClick={() => setS(!s)} whileHover={{ scale: 1.05 }}
                style={{ flex: 1, padding: '16px', borderRadius: 12, border: '2px solid ' + (s ? '#22c55e' : '#e2e8f0'), background: s ? '#22c55e' : 'white', color: s ? 'white' : '#475569', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>
                S = {s ? '1' : '0'}
              </motion.button>
              <motion.button onClick={() => setR(!r)} whileHover={{ scale: 1.05 }}
                style={{ flex: 1, padding: '16px', borderRadius: 12, border: '2px solid ' + (r ? '#ef4444' : '#e2e8f0'), background: r ? '#ef4444' : 'white', color: r ? 'white' : '#475569', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>
                R = {r ? '1' : '0'}
              </motion.button>
            </div>
          )}
          {ffType === 'jk' && (
            <div style={{ display: 'flex', gap: 12 }}>
              <motion.button onClick={() => setJ(!j)} whileHover={{ scale: 1.05 }}
                style={{ flex: 1, padding: '16px', borderRadius: 12, border: '2px solid ' + (j ? '#22c55e' : '#e2e8f0'), background: j ? '#22c55e' : 'white', color: j ? 'white' : '#475569', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>
                J = {j ? '1' : '0'}
              </motion.button>
              <motion.button onClick={() => setK(!k)} whileHover={{ scale: 1.05 }}
                style={{ flex: 1, padding: '16px', borderRadius: 12, border: '2px solid ' + (k ? '#ef4444' : '#e2e8f0'), background: k ? '#ef4444' : 'white', color: k ? 'white' : '#475569', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>
                K = {k ? '1' : '0'}
              </motion.button>
            </div>
          )}
          {ffType === 't' && (
            <motion.button onClick={() => setD(!d)} whileHover={{ scale: 1.05 }}
              style={{ width: '100%', padding: '16px 20px', borderRadius: 12, border: '2px solid ' + (d ? '#f97316' : '#e2e8f0'), background: d ? '#f97316' : 'white', color: d ? 'white' : '#475569', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>
              T = {d ? '1 (will toggle)' : '0 (will hold)'}
            </motion.button>
          )}

          <motion.button onClick={clockPulse} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{ width: '100%', marginTop: 16, padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>
            \u23F0 Clock Pulse!
          </motion.button>
        </div>

        {/* Output + History */}
        <div style={{ padding: 24, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 12 }}>Current Output:</div>
          <motion.div key={String(q)} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
            style={{ width: 80, height: 80, borderRadius: 16, background: q ? 'linear-gradient(135deg, #166534, #22c55e)' : 'linear-gradient(135deg, #991b1b, #ef4444)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 25px ' + (q ? '#22c55e' : '#ef4444') + '44' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'white', fontFamily: 'monospace' }}>{q ? '1' : '0'}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>Q</div>
          </motion.div>

          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>History (newest first):</div>
          <div style={{ maxHeight: 140, overflowY: 'auto' }}>
            {history.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: '1px solid #f1f5f9', fontSize: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: 4, background: h.q ? '#22c55e' : '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 10 }}>{h.q ? '1' : '0'}</div>
                <span style={{ color: '#64748b' }}>{h.input}</span>
              </div>
            ))}
            {history.length === 0 && <div style={{ color: '#94a3b8', fontSize: 12 }}>Press Clock to start</div>}
          </div>
        </div>
      </div>

      <div style={{ padding: 20, borderRadius: 12, background: '#f5f3ff', border: '1px solid #c4b5fd' }}>
        <h4 style={{ margin: '0 0 8px', color: '#6d28d9' }}>About: {types.find(t => t.id === ffType)?.name}</h4>
        <p style={{ margin: 0, color: '#5b21b6', lineHeight: 1.8, fontSize: 14 }}>
          {ffType === 'd' && 'The D (Data) flip-flop is the most common type. On each clock edge, Q becomes whatever D is. Simple, predictable, and used for 99% of storage in modern CPUs. Every register bit is a D flip-flop.'}
          {ffType === 'sr' && 'The SR (Set-Reset) flip-flop has separate set and reset inputs. S=1 stores a 1, R=1 stores a 0. S=R=0 holds the current value. S=R=1 is INVALID (undefined behavior). The JK flip-flop fixes this limitation.'}
          {ffType === 'jk' && 'The JK flip-flop is the "universal" flip-flop. J=1 sets, K=1 resets, J=K=0 holds, and J=K=1 TOGGLES (flips the output). No invalid state! Used in counters and frequency dividers.'}
          {ffType === 't' && 'The T (Toggle) flip-flop flips its output when T=1, holds when T=0. Perfect for building binary counters: chain T flip-flops together and each one divides the clock frequency by 2. Four T flip-flops = a 4-bit counter.'}
        </p>
      </div>
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'Inside a D Flip-Flop: Gate-Level', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>A D flip-flop is built from two stages: a "master" latch and a "slave" latch, each made from NAND gates. This master-slave design ensures the output only changes on the clock edge, not while the clock is high.</p>
        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#1e293b' }}>
            <div><strong>Master-Slave D Flip-Flop:</strong></div>
            <div>Stage 1 (Master): D-latch, transparent when CLK=1</div>
            <div>Stage 2 (Slave): D-latch, transparent when CLK=0</div>
            <div>Combined: captures D on rising edge of CLK</div>
            <div style={{ marginTop: 8 }}><strong>Gate count:</strong> ~12 NAND gates = ~24 transistors</div>
            <div><strong>Setup time:</strong> D must be stable ~50ps before clock edge</div>
            <div><strong>Hold time:</strong> D must stay stable ~30ps after clock edge</div>
            <div><strong>Clock-to-Q delay:</strong> ~80ps (output appears after edge)</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Setup and hold time violations cause <strong>metastability</strong>: the flip-flop enters an undefined state between 0 and 1, which can take arbitrarily long to resolve. This is a real hardware bug that chip designers must carefully avoid.</p>
      </div>
    )},
    { title: 'Registers: Groups of Flip-Flops', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>A <strong>register</strong> is simply a group of flip-flops sharing the same clock, storing multiple bits as one unit. An 8-bit register = 8 D flip-flops. A 64-bit register = 64 D flip-flops.</p>
        <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2, color: '#166534' }}>
            <div><strong>x86-64 General Purpose Registers:</strong></div>
            <div>RAX, RBX, RCX, RDX: 64 bits each = 256 flip-flops</div>
            <div>RSI, RDI, RSP, RBP: 64 bits each = 256 flip-flops</div>
            <div>R8-R15: 64 bits each = 512 flip-flops</div>
            <div>Total: 16 registers x 64 bits = 1,024 flip-flops</div>
            <div style={{ marginTop: 8 }}>Plus: RFLAGS (64 FF), RIP (64 FF), segment regs...</div>
            <div>Plus: 16 x 256-bit AVX = 4,096 flip-flops for SIMD</div>
            <div><strong>Total register storage: ~6,000+ flip-flops</strong></div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Registers are the fastest storage in a computer: zero additional delay beyond the flip-flop itself. Reading a register takes 0 extra cycles. This is why compilers try to keep frequently-used variables in registers.</p>
      </div>
    )},
    { title: 'Counters and State Machines', color: '#8b5cf6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Flip-flops combined with logic gates create <strong>counters</strong> and <strong>finite state machines (FSMs)</strong> — the controllers that orchestrate everything in a CPU.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ padding: 14, borderRadius: 10, background: '#f5f3ff', border: '1px solid #c4b5fd' }}>
            <div style={{ fontWeight: 700, color: '#6d28d9', marginBottom: 4 }}>Binary Counter</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.8 }}>
              Chain of T flip-flops<br/>
              Each bit toggles at half the rate<br/>
              4-bit counter: counts 0-15<br/>
              Used for: program counter, timers<br/>
              PC = PC + 4 is a counter!
            </div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: '#f5f3ff', border: '1px solid #c4b5fd' }}>
            <div style={{ fontWeight: 700, color: '#6d28d9', marginBottom: 4 }}>Finite State Machine</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.8 }}>
              Flip-flops store current state<br/>
              Logic gates compute next state<br/>
              States: FETCH, DECODE, EXECUTE...<br/>
              Used for: CPU control unit<br/>
              USB, PCIe, HDMI protocols
            </div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>The CPU control unit is a massive FSM. Each instruction goes through states: FETCH (load instruction from memory), DECODE (figure out what it does), EXECUTE (do it), WRITEBACK (store result). The control FSM generates all the MUX selectors and enable signals.</p>
      </div>
    )},
    { title: 'Memory Hierarchy: From FF to Disk', color: '#ef4444', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Flip-flops are fast but expensive (24 transistors per bit). The memory hierarchy trades speed for density:</p>
        <div style={{ padding: 16, background: '#fef2f2', borderRadius: 12, border: '1px solid #fecaca', marginBottom: 16 }}>
          <div style={{ fontSize: 13, lineHeight: 2.2, color: '#991b1b' }}>
            {[
              { name: 'Registers', tech: 'Flip-flops', size: '~1 KB', speed: '0 cycles', trans: '24T/bit' },
              { name: 'L1 Cache', tech: 'SRAM', size: '64 KB', speed: '~4 cycles', trans: '6T/bit' },
              { name: 'L2 Cache', tech: 'SRAM', size: '256 KB-1MB', speed: '~12 cycles', trans: '6T/bit' },
              { name: 'L3 Cache', tech: 'SRAM', size: '8-64 MB', speed: '~40 cycles', trans: '6T/bit' },
              { name: 'RAM', tech: 'DRAM', size: '8-64 GB', speed: '~200 cycles', trans: '1T+1C/bit' },
              { name: 'SSD', tech: 'NAND Flash', size: '256GB-4TB', speed: '~50,000 cycles', trans: '1T/bit' },
            ].map(m => (
              <div key={m.name} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <strong style={{ minWidth: 80 }}>{m.name}:</strong>
                <span>{m.tech}, {m.size}, {m.speed} latency, {m.trans}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>SRAM (Static RAM) uses 6 transistors per bit — cross-coupled inverters that hold state without refreshing. DRAM (Dynamic RAM) uses just 1 transistor + 1 capacitor, but the capacitor leaks charge and must be refreshed thousands of times per second. The entire memory hierarchy exists because we cannot build enough fast flip-flops.</p>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Sequential Logic Deep Dive</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>From gate-level flip-flops to the memory hierarchy.</p>
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
      code={`# Variables ARE flip-flops (in hardware)
x = 42  # Store 42 in a register (64 flip-flops)
x = x + 1  # Read register, add 1, write back on clock edge

# Python objects map to memory hierarchy
a = 5          # likely in a CPU register
lst = [1]*100  # in RAM (DRAM), cached in SRAM

# Simulating a D flip-flop in Python
class DFlipFlop:
    def __init__(self):
        self.q = False  # stored state
    
    def clock(self, d: bool) -> bool:
        self.q = d  # capture on rising edge
        return self.q

# Building a register from flip-flops
class Register:
    def __init__(self, width=8):
        self.bits = [DFlipFlop() for _ in range(width)]
    
    def write(self, value: int):
        for i, ff in enumerate(self.bits):
            ff.clock(bool((value >> i) & 1))
    
    def read(self) -> int:
        return sum(ff.q << i for i, ff in enumerate(self.bits))

reg = Register(8)
reg.write(42)       # clock edge: all 8 FFs capture
print(reg.read())   # 42 - stored until next write

# Building a counter from T flip-flops
class Counter:
    def __init__(self, bits=4):
        self.value = 0
        self.max = (1 << bits) - 1
    
    def tick(self):
        self.value = (self.value + 1) & self.max
        return self.value`}
      explanation="Every Python variable assignment is a flip-flop write operation in hardware. When you write x = 42, the CPU loads 42 into a register (64 D flip-flops) on the next clock edge. The old value is lost instantly. Python hides the clocked nature of hardware, but underneath, every state change happens on a clock edge."
      hardwareNote="At 4 GHz, each clock cycle is 0.25ns. In that time, signals must propagate through combinational logic AND satisfy flip-flop setup/hold times. If logic is too slow, the chip must run at a lower clock speed. This is why CPU frequency has plateaued around 4-5 GHz — we have hit the limits of how fast signals can propagate."
    />
  );
}

function Layer5() {
  const apps = [
    { icon: '\u{1F4BB}', title: 'CPU Registers',
      desc: 'Every register in your CPU is a bank of D flip-flops. x86-64 has 16 general-purpose 64-bit registers = 1,024 flip-flops, plus hundreds more for flags, segments, and SIMD.',
      detail: 'Register file access: 0 cycle latency. The compiler allocates variables to registers for maximum speed. Running out of registers causes "spilling" to slower cache/RAM.' },
    { icon: '\u{1F504}', title: 'Pipeline Registers',
      desc: 'Between each CPU pipeline stage sits a bank of flip-flops. They hold the instruction and data as it flows through FETCH, DECODE, EXECUTE, MEMORY, WRITEBACK.',
      detail: 'A 5-stage pipeline has 4 sets of pipeline registers. Each set might be 200+ bits wide (instruction, operands, control signals). Total: ~1,000 flip-flops just for pipelining.' },
    { icon: '\u{23F0}', title: 'Clock Distribution',
      desc: 'The clock signal must reach every flip-flop simultaneously. Clock tree synthesis is a major engineering challenge: distributing a 4 GHz signal to billions of flip-flops with minimal skew.',
      detail: 'Clock skew (different arrival times) of just 10ps can cause failures. Modern CPUs use clock tree buffers consuming 30-40% of total power just for clock distribution.' },
    { icon: '\u{1F4BE}', title: 'Cache Memory (SRAM)',
      desc: 'Each SRAM cell is a pair of cross-coupled inverters (essentially 2 SR latches) that hold one bit. L1 cache (64KB) = 524,288 SRAM cells = over 3 million transistors.',
      detail: 'SRAM is 6T per bit vs flip-flop 24T per bit. Cheaper but slightly slower. Cache hit: ~4 cycles. Cache miss: ~200 cycles (fetch from DRAM). Caches exist because DRAM is 50x slower.' },
    { icon: '\u{1F50B}', title: 'DRAM: Capacitor Memory',
      desc: 'Each DRAM cell is 1 transistor + 1 capacitor. The capacitor stores charge (1) or no charge (0). But charge leaks, so DRAM must be refreshed every 64ms.',
      detail: '16GB DDR5 RAM = 128 billion DRAM cells. Refreshed 8,192 times per second. Reading a cell destroys its charge (destructive read), so every read requires a rewrite.' },
    { icon: '\u{1F3AE}', title: 'GPU Register Files',
      desc: 'GPUs have massive register files: NVIDIA RTX 4090 has 256KB of registers per SM, with 128 SMs. Total GPU registers: 32MB of flip-flop based storage.',
      detail: 'GPU registers are allocated per-thread. With 2,048 threads per SM, each thread gets 128 registers (32-bit). GPUs trade clock speed for massive parallelism in register access.' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Flip-Flops Are Everywhere</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>Every bit of state in every digital system is stored in some form of flip-flop or latch.</p>
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
        <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Gates compute. Flip-flops remember.</div>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: 15, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
          A computer without flip-flops would be a calculator: it could transform inputs to outputs but could never store a result, run a program, or maintain state. Flip-flops make computing possible.
        </p>
      </div>
    </div>
  );
}

export default function L05_FlipFlops() {
  return (
    <LessonWrapper lessonId="L05" title="Flip-Flops & Memory"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'Sticky Notes', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'FF Simulator', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'Sequential Logic', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Variables = FFs', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'Memory Everywhere', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'Counter', description: 'How many T flip-flops do you need for a counter that counts 0 to 99?' },
        { id: 'c2', title: 'Metastability', description: 'Why is S=1 R=1 invalid for an SR latch? What physically happens?' },
        { id: 'c3', title: 'Memory Math', description: 'How many transistors for 64KB of SRAM (6T/bit) vs 64KB of flip-flops (24T/bit)?' },
      ]}
    />
  );
}
