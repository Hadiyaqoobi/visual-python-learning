"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [cores, setCores] = useState(1);
  const [parallelFraction, setParallelFraction] = useState(0.9);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<number[]>([]);
  const [elapsed, setElapsed] = useState(0);

  const serialTime = 1000;
  const amdahlSpeedup = 1 / ((1 - parallelFraction) + parallelFraction / cores);
  const actualTime = serialTime / amdahlSpeedup;
  const efficiency = amdahlSpeedup / cores;

  useEffect(() => {
    if (!running) return;
    setProgress(new Array(cores).fill(0));
    setElapsed(0);
    const totalSteps = 50;
    const step = actualTime / totalSteps;
    let current = 0;
    const t = setInterval(() => {
      current++;
      setElapsed(current * step);
      setProgress(prev => prev.map((_, i) => {
        const serialPortion = (1 - parallelFraction) * totalSteps;
        if (i === 0 && current <= serialPortion) return (current / totalSteps) * 100;
        if (current <= serialPortion) return 0;
        const parallelProgress = ((current - serialPortion) / (totalSteps - serialPortion)) * 100;
        return Math.min((i === 0 ? (serialPortion / totalSteps) * 100 : 0) + parallelProgress * parallelFraction, 100);
      }));
      if (current >= totalSteps) { setRunning(false); }
    }, step);
    return () => clearInterval(t);
  }, [running, cores, parallelFraction]);

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>The Kitchen Analogy</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        One chef makes dinner in 60 minutes. Two chefs in 30? Only if the work can be split! Some tasks (chopping vegetables) parallelize perfectly. Others (the soup must simmer for 20 minutes) are inherently serial — adding chefs doesn't help.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        <strong>Amdahl's Law</strong> says: speedup = 1 / ((1-P) + P/N), where P is the parallel fraction and N is the number of cores. If only 50% of work is parallel, 1000 cores gives only 2× speedup. The serial portion becomes the bottleneck.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        Adjust the sliders to see how core count and parallelizable fraction interact.
      </p>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 24, border: '1px solid #334155' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>CPU Cores</div>
            <input type="range" min="1" max="64" step="1" value={cores} onChange={e => setCores(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#3b82f6' }} />
            <div style={{ fontSize: 24, fontWeight: 800, color: '#3b82f6', textAlign: 'center' }}>{cores} cores</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Parallel Fraction</div>
            <input type="range" min="0" max="1" step="0.05" value={parallelFraction} onChange={e => setParallelFraction(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#22c55e' }} />
            <div style={{ fontSize: 24, fontWeight: 800, color: '#22c55e', textAlign: 'center' }}>{(parallelFraction * 100).toFixed(0)}%</div>
          </div>
        </div>

        {/* Amdahl's Law visualization */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', height: 32, borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ width: `${(1 - parallelFraction) * 100}%`, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700 }}>
              {((1 - parallelFraction) * 100).toFixed(0)}% Serial
            </div>
            <div style={{ flex: 1, background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700 }}>
              {(parallelFraction * 100).toFixed(0)}% Parallel ÷ {cores} cores
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
            Serial portion cannot be sped up regardless of core count
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Speedup', value: `${amdahlSpeedup.toFixed(2)}×`, color: '#3b82f6' },
            { label: 'Max Possible', value: `${(1 / (1 - parallelFraction)).toFixed(1)}×`, color: '#f97316', sub: '(∞ cores)' },
            { label: 'Efficiency', value: `${(efficiency * 100).toFixed(1)}%`, color: efficiency > 0.5 ? '#22c55e' : '#ef4444' },
            { label: 'Time', value: `${actualTime.toFixed(0)}ms`, color: '#8b5cf6', sub: `(of ${serialTime}ms)` },
          ].map(s => (
            <div key={s.label} style={{ padding: 12, borderRadius: 10, background: '#1f2937', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.value}</div>
              {s.sub && <div style={{ fontSize: 10, color: '#475569' }}>{s.sub}</div>}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setRunning(true)}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#22c55e', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            Simulate
          </motion.button>
          {[['0.5', '50%'], ['0.9', '90%'], ['0.99', '99%']].map(([v, l]) => (
            <button key={v} onClick={() => setParallelFraction(parseFloat(v))}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 12 }}>
              P={l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca' }}>
          <h4 style={{ margin: '0 0 8px', color: '#991b1b' }}>Amdahl's Law (Fixed Problem)</h4>
          <p style={{ margin: 0, color: '#b91c1c', lineHeight: 1.7, fontSize: 14 }}>
            For a fixed workload, speedup is limited by the serial fraction. Even with 1000 cores, if 5% is serial, max speedup is only 20×. Diminishing returns hit hard.
          </p>
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 8px', color: '#166534' }}>Gustafson's Law (Scaled Problem)</h4>
          <p style={{ margin: 0, color: '#15803d', lineHeight: 1.7, fontSize: 14 }}>
            With more cores, we tackle bigger problems, not the same one faster. 64 cores process 64× more data. Real workloads (ML training, rendering) scale with problem size.
          </p>
        </div>
      </div>
    </div>
  );
}

function Layer2() {
  const [scenario, setScenario] = useState<'race' | 'deadlock' | 'false_sharing'>('race');

  const scenarios = {
    race: {
      name: 'Race Condition',
      color: '#ef4444',
      desc: 'Two threads increment the same counter. Without synchronization, updates are lost when both read the old value before either writes.',
      steps: [
        { t1: 'Read counter (=10)', t2: '...idle...', counter: '10', issue: false },
        { t1: 'Compute 10+1=11', t2: 'Read counter (=10)', counter: '10', issue: true },
        { t1: 'Write counter=11', t2: 'Compute 10+1=11', counter: '11', issue: false },
        { t1: '...idle...', t2: 'Write counter=11', counter: '11', issue: true },
      ],
      fix: 'Use atomic operations (lock-free) or mutex locks. Atomic: hardware guarantees read-modify-write is indivisible. Mutex: only one thread enters the critical section.',
      expected: '12',
      actual: '11 (lost update!)',
    },
    deadlock: {
      name: 'Deadlock',
      color: '#f97316',
      desc: 'Thread 1 holds Lock A, needs Lock B. Thread 2 holds Lock B, needs Lock A. Both wait forever — circular dependency.',
      steps: [
        { t1: 'Acquire Lock A ✓', t2: '...idle...', counter: 'OK', issue: false },
        { t1: '...working...', t2: 'Acquire Lock B ✓', counter: 'OK', issue: false },
        { t1: 'Try Lock B... WAIT', t2: 'Try Lock A... WAIT', counter: 'STUCK', issue: true },
        { t1: '⏳ Blocked forever', t2: '⏳ Blocked forever', counter: 'DEADLOCK', issue: true },
      ],
      fix: 'Lock ordering: always acquire locks in the same global order (A before B). Timeout: trylock with deadline. Lock-free algorithms: avoid locks entirely using compare-and-swap (CAS).',
      expected: 'Both complete',
      actual: 'Neither completes',
    },
    false_sharing: {
      name: 'False Sharing',
      color: '#8b5cf6',
      desc: 'Two threads write to different variables that happen to share the same cache line. The cache coherency protocol bounces the line between cores — 100× slower.',
      steps: [
        { t1: 'Write var_a (line 42)', t2: '...idle...', counter: 'OK', issue: false },
        { t1: '...idle...', t2: 'Write var_b (line 42!)', counter: 'INVALIDATE', issue: true },
        { t1: 'Write var_a (reload!)', t2: '...stall...', counter: 'INVALIDATE', issue: true },
        { t1: '...stall...', t2: 'Write var_b (reload!)', counter: 'THRASH', issue: true },
      ],
      fix: 'Pad variables to separate cache lines (64 bytes apart). Use __attribute__((aligned(64))) in C. In Python/Java, false sharing is hidden by the runtime but still affects performance of underlying C libraries.',
      expected: 'Independent, fast',
      actual: '10-100× slower (cache line ping-pong)',
    },
  };

  const s = scenarios[scenario];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Concurrency Hazards</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24, fontSize: 16 }}>
        Multi-core programming introduces bugs that don't exist in single-threaded code. These are the three most common hazards — and they can be incredibly hard to reproduce and debug.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(Object.keys(scenarios) as Array<keyof typeof scenarios>).map(key => (
          <motion.button key={key} whileHover={{ scale: 1.05 }} onClick={() => setScenario(key)}
            style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: scenario === key ? scenarios[key].color : '#f1f5f9', color: scenario === key ? 'white' : '#334155', fontWeight: 700, fontSize: 13 }}>
            {scenarios[key].name}
          </motion.button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 8px', color: s.color, fontSize: 20, fontWeight: 700 }}>{s.name}</h3>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 20, fontSize: 14 }}>{s.desc}</p>

        {/* Timeline */}
        <div style={{ overflowX: 'auto', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', width: 60 }}>Step</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#3b82f6' }}>Thread 1</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#22c55e' }}>Thread 2</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b' }}>State</th>
              </tr>
            </thead>
            <tbody>
              {s.steps.map((step, i) => (
                <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                  style={{ borderBottom: '1px solid #f1f5f9', background: step.issue ? s.color + '08' : 'transparent' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 700, color: '#1e293b' }}>{i + 1}</td>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#3b82f6', fontSize: 11 }}>{step.t1}</td>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#22c55e', fontSize: 11 }}>{step.t2}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 700, color: step.issue ? s.color : '#64748b', fontSize: 12 }}>{step.counter}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ padding: 12, borderRadius: 8, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Expected</div>
            <div style={{ fontWeight: 700, color: '#166534', fontSize: 14 }}>{s.expected}</div>
          </div>
          <div style={{ padding: 12, borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca' }}>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Actual</div>
            <div style={{ fontWeight: 700, color: '#991b1b', fontSize: 14 }}>{s.actual}</div>
          </div>
        </div>

        <div style={{ padding: 16, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4, fontSize: 14 }}>Fix:</div>
          <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{s.fix}</div>
        </div>
      </div>
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'Cache Coherency (MESI Protocol)', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>When multiple cores have copies of the same cache line, hardware must keep them consistent. MESI tracks each line's state.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { state: 'M', name: 'Modified', desc: 'This core has the only copy and it\'s dirty. Must write back before another core can read. Most exclusive state.', color: '#ef4444' },
            { state: 'E', name: 'Exclusive', desc: 'This core has the only copy and it\'s clean. Can silently transition to Modified on write (no bus traffic).', color: '#f97316' },
            { state: 'S', name: 'Shared', desc: 'Multiple cores have clean copies. Any core can read. Writing requires invalidating all other copies first.', color: '#22c55e' },
            { state: 'I', name: 'Invalid', desc: 'Line is not valid. Must fetch from another core or memory. Initial state for all cache lines.', color: '#94a3b8' },
          ].map(m => (
            <div key={m.state} style={{ padding: 12, borderRadius: 10, background: m.color + '08', border: '2px solid ' + m.color + '44', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: m.color }}>{m.state}</div>
              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 12, marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.6 }}>{m.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Modern CPUs use MOESI (AMD) or MESIF (Intel) extensions. MOESI adds "Owned" state: one core can supply data directly to requesters without writing back to memory. This reduces memory bandwidth pressure. Each cache snoop (check other caches) costs ~20-40 cycles.</p>
      </div>
    )},
    { title: 'Synchronization Primitives', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Hardware provides atomic operations; software builds synchronization on top.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'Atomic CAS', desc: 'Compare-And-Swap: if (mem == expected) mem = new. Single instruction, hardware-guaranteed atomic. Foundation of all lock-free algorithms. x86: LOCK CMPXCHG. ARM: LDXR/STXR loop.', color: '#3b82f6' },
            { name: 'Mutex / Spinlock', desc: 'Mutex: thread sleeps if lock held (OS context switch, ~1 µs). Spinlock: thread busy-waits (wastes CPU but no context switch). Use spinlock for <10 µs critical sections.', color: '#22c55e' },
            { name: 'Read-Write Lock', desc: 'Multiple readers OR one writer. RwLock in Rust, ReadWriteLock in Java. Optimizes read-heavy workloads. Writer starvation possible without fairness policy.', color: '#f97316' },
            { name: 'Lock-Free Structures', desc: 'Queues, stacks, hash maps that use CAS instead of locks. No deadlock possible. But ABA problem, memory reclamation (hazard pointers), and extreme complexity.', color: '#8b5cf6' },
          ].map(p => (
            <div key={p.name} style={{ padding: 12, borderRadius: 10, background: p.color + '08', border: '1px solid ' + p.color + '33' }}>
              <div style={{ fontWeight: 700, color: p.color, marginBottom: 4, fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>The cost hierarchy: uncontended atomic (~5ns) {'<'} contended atomic (~50ns) {'<'} uncontended mutex (~25ns) {'<'} contended mutex (~1,000ns with context switch). Lock-free algorithms avoid the worst case but are notoriously hard to write correctly.</p>
      </div>
    )},
    { title: 'Multi-Core Topologies', color: '#f97316', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>How cores are connected affects performance. Core-to-core latency varies from 10ns (same cluster) to 200ns (remote NUMA node).</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'Symmetric (SMP)', desc: 'All cores equal distance to memory. Simple programming model. Desktop/laptop CPUs up to ~16 cores. Uniform memory access (UMA).', color: '#3b82f6' },
            { name: 'NUMA (Non-Uniform)', desc: 'Each CPU socket has local memory (fast) and remote memory (2-3x slower). Server CPUs. Software must be NUMA-aware for best performance.', color: '#f97316' },
            { name: 'Chiplet (AMD Zen)', desc: 'Cores grouped into chiplets (CCDs), each with local L3 cache. Cross-chiplet latency ~40ns vs ~10ns intra-chiplet. Infinity Fabric connects chiplets.', color: '#22c55e' },
            { name: 'big.LITTLE (ARM)', desc: 'Heterogeneous cores: fast P-cores + efficient E-cores. Intel hybrid: P-cores (Golden Cove) + E-cores (Gracemont). OS scheduler must understand core capabilities.', color: '#8b5cf6' },
          ].map(t => (
            <div key={t.name} style={{ padding: 12, borderRadius: 10, background: t.color + '08', border: '1px solid ' + t.color + '33' }}>
              <div style={{ fontWeight: 700, color: t.color, marginBottom: 4, fontSize: 14 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{t.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>NUMA-unaware software can run 2-3× slower on multi-socket servers. Database systems (PostgreSQL, MySQL) use NUMA-aware memory allocation. Linux numactl pins processes to specific nodes. The OS scheduler (CFS) balances load while respecting NUMA topology.</p>
      </div>
    )},
    { title: 'Parallel Programming Models', color: '#8b5cf6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Different abstractions for multi-core programming, from low-level threads to high-level frameworks.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'Shared Memory (Threads)', desc: 'Threads share address space. Communicate via shared variables. Requires synchronization (locks, atomics). pthreads, std::thread, Java threads. Most error-prone.', color: '#ef4444' },
            { name: 'Message Passing (Actors)', desc: 'Processes communicate by sending messages. No shared state. Erlang, Go channels, Rust channels, MPI for clusters. Easier to reason about. Actor model: each actor has private state.', color: '#22c55e' },
            { name: 'Data Parallelism', desc: 'Same operation on all elements. Map-reduce pattern. NumPy vectorization, CUDA kernels, OpenMP parallel for. Easiest to use when it fits the problem.', color: '#3b82f6' },
            { name: 'Task Parallelism', desc: 'Decompose into independent tasks with dependencies (DAG). Work-stealing scheduler distributes tasks. Intel TBB, Tokio (Rust), asyncio. Good for irregular workloads.', color: '#8b5cf6' },
          ].map(m => (
            <div key={m.name} style={{ padding: 12, borderRadius: 10, background: m.color + '08', border: '1px solid ' + m.color + '33' }}>
              <div style={{ fontWeight: 700, color: m.color, marginBottom: 4, fontSize: 14 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{m.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>The trend is moving away from shared-memory threading toward safer models. Rust's ownership system prevents data races at compile time. Go's goroutines + channels make concurrency accessible. Python's asyncio provides concurrency without parallelism (I/O-bound tasks).</p>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Multi-Core Engineering</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>The hardware and software that makes parallelism work.</p>
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
      code={`import threading, multiprocessing, time, os

# === Python's GIL: The Multi-Core Problem ===
# CPython has a Global Interpreter Lock (GIL):
# only ONE thread executes Python bytecode at a time.
# Multi-threading does NOT use multiple cores for CPU work!

def cpu_work(n):
    """CPU-bound: counting"""
    total = 0
    for i in range(n):
        total += i * i
    return total

N = 5_000_000

# Single-threaded baseline
t0 = time.perf_counter()
cpu_work(N)
single = time.perf_counter() - t0
print(f"Single thread: {single*1000:.0f}ms")

# Multi-threaded (GIL prevents parallelism!)
t0 = time.perf_counter()
threads = []
for _ in range(4):
    t = threading.Thread(target=cpu_work, args=(N//4,))
    threads.append(t)
    t.start()
for t in threads:
    t.join()
threaded = time.perf_counter() - t0
print(f"4 threads:     {threaded*1000:.0f}ms (GIL bottleneck)")
print(f"Thread speedup: {single/threaded:.2f}x (should be ~4x)")
print()

# Multi-PROCESS (bypasses GIL — true parallelism!)
t0 = time.perf_counter()
with multiprocessing.Pool(4) as pool:
    pool.map(cpu_work, [N//4] * 4)
mp_time = time.perf_counter() - t0
print(f"4 processes:   {mp_time*1000:.0f}ms (true parallel)")
print(f"Process speedup: {single/mp_time:.2f}x")
print()

# === When threading DOES help: I/O-bound ===
print("=== Threading works for I/O ===")
def io_work():
    time.sleep(0.1)  # Simulates network/disk I/O

t0 = time.perf_counter()
for _ in range(4):
    io_work()
serial_io = time.perf_counter() - t0

t0 = time.perf_counter()
threads = [threading.Thread(target=io_work) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()
parallel_io = time.perf_counter() - t0

print(f"Serial I/O:   {serial_io*1000:.0f}ms")
print(f"Threaded I/O: {parallel_io*1000:.0f}ms")
print(f"I/O speedup:  {serial_io/parallel_io:.1f}x (GIL released!)")
print()

# === Python parallelism strategies ===
print("=== Python Multi-Core Strategies ===")
strategies = {
    "multiprocessing": "Separate processes, no GIL. IPC overhead.",
    "concurrent.futures": "High-level ProcessPool/ThreadPool.",
    "NumPy/SciPy": "C extensions release GIL. True parallel.",
    "Cython (nogil)": "Compile to C, release GIL in sections.",
    "Python 3.13+": "Free-threaded mode (no GIL!) experimental.",
    "asyncio": "Concurrency without threads (I/O only).",
}
for name, desc in strategies.items():
    print(f"  {name}: {desc}")
print(f"\\nCPU cores available: {os.cpu_count()}")`}
      explanation="Python's GIL is the most important multi-core limitation to understand: threading doesn't parallelize CPU work because only one thread holds the GIL at a time. Use multiprocessing for CPU-bound work (separate processes, separate GILs) and threading for I/O-bound work (GIL is released during I/O). Python 3.13 introduces experimental free-threaded mode that removes the GIL entirely."
      hardwareNote="The GIL is actually a concurrency primitive — a global mutex. Each thread acquires the GIL, runs ~5ms of bytecode, then releases it. This means Python threading has ~5ms scheduling granularity vs the OS scheduler's ~1ms. NumPy releases the GIL during C-level computation, allowing true multi-core BLAS/LAPACK operations."
    />
  );
}

function Layer5() {
  const apps = [
    { icon: '\u{1F3AE}', title: 'Game Engine Threading',
      desc: 'Modern engines use job systems: render, physics, AI, audio on separate threads. Unity DOTS and Unreal\'s task graph schedule thousands of micro-jobs across cores.',
      detail: 'The key challenge: the render thread must wait for physics to finish computing positions. Frame-parallel rendering (compute frame N+1 physics while rendering frame N) adds one frame of latency but doubles throughput.' },
    { icon: '\u{1F9E0}', title: 'ML Training Parallelism',
      desc: 'Data parallelism: each GPU processes different mini-batches, gradients are averaged. Model parallelism: layers split across GPUs. Pipeline parallelism: different stages on different GPUs.',
      detail: 'Training GPT-4: data parallel across 25,000 GPUs with ZeRO optimizer (partitions gradients, optimizer states, and parameters). All-reduce gradient sync needs 10+ GB/s per GPU — NVLink is essential.' },
    { icon: '\u{1F4CA}', title: 'Database Parallelism',
      desc: 'PostgreSQL uses multiple processes per connection (process-per-connection model). MySQL uses threads. Both parallelize query execution across cores for large scans.',
      detail: 'Parallel query: a sequential scan of 100GB table splits into 8 parallel workers. Each scans 12.5GB. Merge results. But parallel overhead means small queries run faster single-threaded — the optimizer decides.' },
    { icon: '\u{1F310}', title: 'Web Server Architectures',
      desc: 'nginx: event-driven single-thread per core. Apache: thread-per-connection. Node.js: single-threaded event loop with worker threads. Go: goroutines (M:N threading).',
      detail: 'nginx achieves 10K+ connections/core because I/O multiplexing (epoll) avoids thread overhead. Go\'s goroutines are 2KB stack (vs 1MB pthread) — you can run millions. The runtime schedules goroutines onto OS threads.' },
    { icon: '\u{1F6E1}\uFE0F', title: 'Rust\'s Safety Model',
      desc: 'Rust\'s ownership + borrowing system prevents data races at compile time. "Fearless concurrency" — if it compiles, no race conditions. Send/Sync traits enforce thread safety.',
      detail: 'Rust\'s borrow checker ensures: either N readers OR 1 writer, never both. Arc<Mutex<T>> provides thread-safe shared mutable state. Channels (mpsc) provide message passing. Zero runtime cost for safety checks.' },
    { icon: '\u{1F4BB}', title: 'Core Count Trends',
      desc: 'AMD EPYC 9654: 96 cores / 192 threads. Apple M3 Ultra: 24 cores (16P + 8E). Intel 14th Gen: 24 cores (8P + 16E). Servers pushing 100+ cores per socket.',
      detail: 'The challenge: most software can\'t use 96 cores efficiently. Amdahl\'s Law limits speedup. OS scheduler overhead grows. Cache coherency traffic increases. The future is heterogeneous: right core for right task, not more of the same.' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Multi-Core Is the Default</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>Every modern program must understand concurrency. Sequential programming is the exception, not the norm.</p>
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
        <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>CORE COUNT EVOLUTION</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginTop: 16 }}>
          <div><div style={{ fontSize: 16, fontWeight: 800, color: '#ef4444' }}>2005</div><div style={{ fontSize: 11, color: '#94a3b8' }}>2 cores (Athlon X2)</div></div>
          <div style={{ fontSize: 14, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 16, fontWeight: 800, color: '#f97316' }}>2010</div><div style={{ fontSize: 11, color: '#94a3b8' }}>4-6 cores</div></div>
          <div style={{ fontSize: 14, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 16, fontWeight: 800, color: '#3b82f6' }}>2017</div><div style={{ fontSize: 11, color: '#94a3b8' }}>8-16 (Zen)</div></div>
          <div style={{ fontSize: 14, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 16, fontWeight: 800, color: '#22c55e' }}>2022</div><div style={{ fontSize: 11, color: '#94a3b8' }}>24+ hybrid</div></div>
          <div style={{ fontSize: 14, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 16, fontWeight: 800, color: '#8b5cf6' }}>2024</div><div style={{ fontSize: 11, color: '#94a3b8' }}>96+ (server)</div></div>
        </div>
      </div>
    </div>
  );
}

export default function L18_MultiCoreProcessing() {
  return (
    <LessonWrapper lessonId="L18" title="Multi-Core Processing"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'Kitchen & Amdahl\'s Law', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'Concurrency Hazards', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'Coherency & Sync', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python GIL & Parallelism', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'Multi-Core Everywhere', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: "Amdahl's Law", description: 'A program is 95% parallelizable. What is the maximum speedup with 32 cores? With 1000 cores? What is the theoretical maximum?' },
        { id: 'c2', title: 'GIL Impact', description: 'A Python web server handles 1000 req/s with I/O-bound work using threading. If each request becomes CPU-bound (10ms compute), what happens to throughput? How do you fix it?' },
        { id: 'c3', title: 'False Sharing', description: 'Two threads increment adjacent counters (counter[0] and counter[1]) 10M times. On a 64-byte cache line, what happens? How would you fix it?' },
      ]}
    />
  );
}
