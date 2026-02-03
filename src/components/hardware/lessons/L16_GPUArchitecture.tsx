"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [mode, setMode] = useState<'cpu' | 'gpu'>('cpu');
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pixels, setPixels] = useState<boolean[]>(new Array(256).fill(false));

  const cpuCores = 8;
  const gpuCores = 64;

  useEffect(() => {
    if (!running) return;
    const cores = mode === 'cpu' ? cpuCores : gpuCores;
    const interval = mode === 'cpu' ? 60 : 15;
    const t = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + cores, 256);
        setPixels(p => {
          const np = [...p];
          for (let i = prev; i < next && i < 256; i++) np[i] = true;
          return np;
        });
        if (next >= 256) { setRunning(false); }
        return next;
      });
    }, interval);
    return () => clearInterval(t);
  }, [running, mode]);

  const reset = () => { setProgress(0); setPixels(new Array(256).fill(false)); setRunning(false); };

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>The Factory Floor Analogy</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        A CPU is like <strong>8 expert craftspeople</strong> — each can handle any complex task independently. A GPU is like <strong>thousands of assembly-line workers</strong> — each does one simple thing, but they all work simultaneously.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        Need to paint 256 pixels? The CPU processes them 8 at a time. The GPU processes 64+ at a time. For tasks that are <strong>massively parallel</strong> (every pixel is independent), the GPU wins overwhelmingly.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        Watch both process the same 256 pixels. The GPU doesn't have faster cores — it just has far more of them.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setMode('cpu'); reset(); }}
          style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: mode === 'cpu' ? '#3b82f6' : '#f1f5f9', color: mode === 'cpu' ? 'white' : '#334155', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          CPU ({cpuCores} cores)
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setMode('gpu'); reset(); }}
          style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: mode === 'gpu' ? '#22c55e' : '#f1f5f9', color: mode === 'gpu' ? 'white' : '#334155', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          GPU ({gpuCores} cores)
        </motion.button>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 24, border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>{mode === 'cpu' ? 'CPU' : 'GPU'}: {progress}/256 pixels</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: mode === 'gpu' ? '#22c55e' : '#3b82f6' }}>
            {mode === 'cpu' ? `${cpuCores} pixels/batch` : `${gpuCores} pixels/batch`}
          </div>
        </div>

        {/* Pixel grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: 2, marginBottom: 20 }}>
          {pixels.map((done, i) => (
            <motion.div key={i}
              animate={{ background: done ? (mode === 'cpu' ? '#3b82f6' : '#22c55e') : '#1f2937', scale: done ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.15 }}
              style={{ aspectRatio: '1', borderRadius: 3, border: '1px solid #374151' }} />
          ))}
        </div>

        {/* Core visualization */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>Active Cores:</div>
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {Array.from({ length: mode === 'cpu' ? cpuCores : gpuCores }).map((_, i) => (
              <motion.div key={i}
                animate={{ background: running ? (mode === 'cpu' ? '#3b82f6' : '#22c55e') : '#374151' }}
                style={{ width: mode === 'cpu' ? 32 : 10, height: mode === 'cpu' ? 32 : 10, borderRadius: mode === 'cpu' ? 6 : 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700 }}>
                {mode === 'cpu' && (i + 1)}
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setRunning(true)}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#22c55e', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            Run
          </motion.button>
          <button onClick={reset}
            style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>Reset</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <h4 style={{ margin: '0 0 8px', color: '#1d4ed8' }}>CPU: Latency Optimized</h4>
          <p style={{ margin: 0, color: '#1e40af', lineHeight: 1.7, fontSize: 14 }}>
            Big caches, branch prediction, out-of-order execution. Each core handles complex tasks fast. Best for serial workloads: OS, compilers, game logic.
          </p>
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 8px', color: '#166534' }}>GPU: Throughput Optimized</h4>
          <p style={{ margin: 0, color: '#15803d', lineHeight: 1.7, fontSize: 14 }}>
            Thousands of simple cores, massive parallelism. Hides memory latency by switching between threads. Best for: graphics, ML training, physics, crypto.
          </p>
        </div>
      </div>
    </div>
  );
}

function Layer2() {
  const [selectedArch, setSelectedArch] = useState<'sm' | 'memory' | 'pipeline'>('sm');

  const archSections = {
    sm: {
      name: 'Streaming Multiprocessor (SM)',
      color: '#22c55e',
      content: (
        <div>
          <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>The SM is the GPU's fundamental building block. Each SM runs thousands of threads simultaneously using <strong>warp-based scheduling</strong>.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'CUDA Cores', value: '128 per SM', desc: 'Simple ALUs for integer and float ops. Each processes one thread\'s instruction per cycle.', color: '#22c55e' },
              { label: 'Tensor Cores', value: '4 per SM', desc: 'Matrix multiply accelerators. One instruction: 4×4 matrix FMA. Essential for ML training/inference.', color: '#8b5cf6' },
              { label: 'Warp Scheduler', value: '4 per SM', desc: 'Each selects a warp (32 threads) to execute. Switches warps every cycle to hide memory latency.', color: '#f97316' },
              { label: 'Shared Memory', value: '100 KB per SM', desc: 'Programmer-managed L1 cache. Shared among threads in a block. 100x faster than global memory.', color: '#3b82f6' },
              { label: 'Register File', value: '256 KB per SM', desc: 'Massive — 16x larger than CPU. Holds state for thousands of concurrent threads. No context switch cost.', color: '#ef4444' },
              { label: 'RT Cores', value: '1 per SM', desc: 'Ray-triangle intersection hardware. Accelerates ray tracing by 10x vs software. BVH tree traversal.', color: '#ec4899' },
            ].map(item => (
              <div key={item.label} style={{ padding: 14, borderRadius: 10, background: item.color + '08', border: '1px solid ' + item.color + '33' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, color: item.color, fontSize: 14 }}>{item.label}</div>
                  <div style={{ fontWeight: 800, color: '#1e293b', fontSize: 14 }}>{item.value}</div>
                </div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <p style={{ color: '#475569', lineHeight: 1.8 }}>RTX 4090: 128 SMs × 128 CUDA cores = <strong>16,384 CUDA cores</strong>. Each SM runs up to 2,048 threads simultaneously (64 warps). Total: 262,144 threads in flight across the GPU.</p>
        </div>
      ),
    },
    memory: {
      name: 'Memory Hierarchy',
      color: '#3b82f6',
      content: (
        <div>
          <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>GPU memory is optimized for bandwidth, not latency. The entire architecture is designed to keep thousands of threads fed with data.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {[
              { level: 'Registers', size: '256 KB / SM', latency: '0 cycles', bw: 'Unlimited', color: '#ef4444', detail: 'Each thread gets ~64 registers. 32K registers per SM. Fastest storage.' },
              { level: 'Shared Memory', size: '100 KB / SM', latency: '~20 cycles', bw: '~100 TB/s aggregate', color: '#f97316', detail: 'Programmer-controlled scratchpad. Shared within a thread block. Bank conflicts reduce throughput.' },
              { level: 'L1 Cache', size: '128 KB / SM', latency: '~30 cycles', bw: '~50 TB/s aggregate', color: '#3b82f6', detail: 'Unified with shared memory (configurable split). Caches global memory accesses.' },
              { level: 'L2 Cache', size: '96 MB (4090)', latency: '~200 cycles', bw: '~6 TB/s', color: '#8b5cf6', detail: 'Shared across all SMs. Partitioned across memory channels. Critical for bandwidth amplification.' },
              { level: 'HBM3 / GDDR6X', size: '24-80 GB', latency: '~400 cycles', bw: '1-3 TB/s', color: '#22c55e', detail: 'Main GPU memory. 4090: 1 TB/s (GDDR6X). H100: 3.35 TB/s (HBM3). 10-20x CPU memory bandwidth.' },
              { level: 'System RAM (PCIe)', size: 'Host RAM', latency: '~10K cycles', bw: '32-64 GB/s', color: '#94a3b8', detail: 'CPU↔GPU transfer. The primary bottleneck. NVLink: 900 GB/s GPU-to-GPU bypass.' },
            ].map(m => (
              <div key={m.level} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 110, textAlign: 'right', fontWeight: 700, color: m.color, fontSize: 13, flexShrink: 0 }}>{m.level}</div>
                <div style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: m.color + '08', borderLeft: '3px solid ' + m.color }}>
                  <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#64748b', marginBottom: 2 }}>
                    <span>{m.size}</span><span>{m.latency}</span><span>{m.bw}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#475569' }}>{m.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    pipeline: {
      name: 'Execution Model',
      color: '#f97316',
      content: (
        <div>
          <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>GPUs use <strong>SIMT</strong> (Single Instruction Multiple Threads): one instruction operates on 32 threads (a warp) simultaneously.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {[
              { name: 'Warp (NVIDIA) / Wave (AMD)', desc: '32 threads execute in lockstep. All run the same instruction on different data. If threads diverge (if/else), both paths run serially (branch divergence penalty).', color: '#f97316' },
              { name: 'Thread Block / Workgroup', desc: 'Up to 1,024 threads that share memory and can synchronize. Maps to one SM. Multiple blocks run on the same SM concurrently for latency hiding.', color: '#3b82f6' },
              { name: 'Grid / Dispatch', desc: 'Collection of all thread blocks for one kernel launch. Can be 1D, 2D, or 3D. Grid dimensions determine total parallelism.', color: '#22c55e' },
              { name: 'Occupancy', desc: 'Ratio of active warps to maximum. Higher occupancy = better latency hiding. Limited by registers, shared memory, and thread block count per SM.', color: '#8b5cf6' },
            ].map(item => (
              <div key={item.name} style={{ padding: 14, borderRadius: 10, background: item.color + '08', border: '1px solid ' + item.color + '33' }}>
                <div style={{ fontWeight: 700, color: item.color, marginBottom: 4, fontSize: 14 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: 16, background: '#fff7ed', borderRadius: 12, border: '1px solid #fed7aa' }}>
            <div style={{ fontWeight: 700, color: '#c2410c', marginBottom: 4, fontSize: 14 }}>Latency Hiding: The GPU's Superpower</div>
            <p style={{ margin: 0, fontSize: 13, color: '#9a3412', lineHeight: 1.8 }}>
              When a warp stalls on memory (400 cycles), the scheduler instantly switches to another ready warp — zero cost. With 64 warps per SM, there's always work to do. CPUs wait for memory; GPUs switch threads. This is why GPUs need thousands of threads to reach peak performance.
            </p>
          </div>
        </div>
      ),
    },
  };

  const section = archSections[selectedArch];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>GPU Architecture Deep Dive</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24, fontSize: 16 }}>
        Explore the three pillars of GPU architecture: the Streaming Multiprocessor, memory hierarchy, and execution model.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(Object.keys(archSections) as Array<keyof typeof archSections>).map(key => (
          <motion.button key={key} whileHover={{ scale: 1.05 }} onClick={() => setSelectedArch(key)}
            style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: selectedArch === key ? archSections[key].color : '#f1f5f9', color: selectedArch === key ? 'white' : '#334155', fontWeight: 700, fontSize: 13 }}>
            {archSections[key].name}
          </motion.button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0' }}>
        {section.content}
      </div>
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'Graphics Pipeline', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>The original purpose of GPUs: transform 3D geometry into 2D pixels at 60+ FPS.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          {[
            { stage: 'Vertex Shader', desc: 'Transform each vertex position (model → world → screen space). Runs per-vertex. Fully programmable.', color: '#3b82f6' },
            { stage: 'Tessellation', desc: 'Subdivide coarse meshes into finer triangles. Hardware tessellator between two shader stages. Detail on demand.', color: '#8b5cf6' },
            { stage: 'Geometry Shader', desc: 'Generate or destroy primitives. Rarely used (slow). Mesh shaders (modern replacement) are more flexible.', color: '#f97316' },
            { stage: 'Rasterizer', desc: 'Fixed-function hardware. Convert triangles to fragments (potential pixels). Determine which pixels each triangle covers.', color: '#ef4444' },
            { stage: 'Fragment Shader', desc: 'Calculate color for each pixel. Texture sampling, lighting, shadows. Most expensive stage. Runs billions of times per frame.', color: '#22c55e' },
            { stage: 'Output Merger', desc: 'Depth test, stencil test, alpha blending. Write final pixel to framebuffer. Fixed-function hardware.', color: '#ec4899' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1, padding: '8px 14px', borderRadius: 8, borderLeft: '3px solid ' + s.color, background: s.color + '06' }}>
                <span style={{ fontWeight: 700, color: s.color, fontSize: 13 }}>{s.stage}:</span>{' '}
                <span style={{ fontSize: 12, color: '#475569' }}>{s.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Modern games process 5-10 million triangles and 8+ million pixels per frame, 60+ times per second. That's 480 million pixel shader executions per second — only possible with massive GPU parallelism.</p>
      </div>
    )},
    { title: 'Compute (GPGPU) Model', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>CUDA and OpenCL repurpose GPU parallelism for general computation. The programming model maps directly to hardware.</p>
        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#1e293b' }}>
            <div><strong>CUDA Programming Model:</strong></div>
            <div>Thread → one CUDA core execution</div>
            <div>Warp (32 threads) → executes in lockstep on SM</div>
            <div>Block (up to 1024 threads) → one SM, shared memory</div>
            <div>Grid (many blocks) → entire GPU</div>
            <div style={{ marginTop: 8 }}><strong>Memory Model:</strong></div>
            <div>__shared__ → SM shared memory (fast, 100KB)</div>
            <div>__global__ → device DRAM (slow, huge)</div>
            <div>__constant__ → read-only cached memory</div>
            <div>Coalesced access: 32 threads read consecutive addresses</div>
            <div> → ONE memory transaction (128 bytes)</div>
            <div>Uncoalesced: 32 random addresses</div>
            <div> → 32 transactions (4KB, 32x slower!)</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>GPU programming is all about memory access patterns. Coalesced global reads, shared memory tiling, and register usage determine whether you get 10% or 90% of peak performance.</p>
      </div>
    )},
    { title: 'Tensor Cores & AI Acceleration', color: '#8b5cf6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Tensor Cores are dedicated matrix-multiply units that accelerate deep learning by 10-20x over regular CUDA cores.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'FP16 (Half Precision)', desc: 'D = A×B + C where A,B are FP16 4×4 matrices and D,C are FP16 or FP32. Used for most ML training and inference.', value: '~330 TFLOPS (4090)', color: '#22c55e' },
            { name: 'INT8 Quantization', desc: '8-bit integer matrix multiply. 2x throughput vs FP16. Sufficient for inference with minimal accuracy loss.', value: '~660 TOPS (4090)', color: '#3b82f6' },
            { name: 'FP8 (Hopper/Ada)', desc: 'New 8-bit float format. Better dynamic range than INT8. Enables faster training without quantization overhead.', value: '~1.3 PFLOPS (H100)', color: '#8b5cf6' },
            { name: 'Sparsity (2:4)', desc: 'Structured sparsity: 2 of every 4 weights are zero. Hardware skips zero multiply-adds. 2x speedup for pruned models.', value: '2x throughput', color: '#f97316' },
          ].map(t => (
            <div key={t.name} style={{ padding: 14, borderRadius: 10, background: t.color + '08', border: '1px solid ' + t.color + '33' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ fontWeight: 700, color: t.color, fontSize: 14 }}>{t.name}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{t.value}</div>
              </div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{t.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Transformers (GPT, BERT) are dominated by matrix multiplies (attention: Q×K^T, feed-forward: X×W). Tensor Cores turn these into a single instruction per 4×4 block. An H100 with 528 Tensor Cores performs 2 petaflops of FP8 matrix math.</p>
      </div>
    )},
    { title: 'Multi-GPU & Interconnects', color: '#ef4444', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Training large models requires multiple GPUs communicating at high bandwidth.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'NVLink 4.0', desc: '900 GB/s bidirectional between two GPUs. 18 links × 25 GB/s each. Bypasses PCIe entirely. H100 connects 8 GPUs in a fully-connected NVSwitch topology.', color: '#22c55e' },
            { name: 'PCIe 5.0 x16', desc: '64 GB/s bidirectional. The CPU↔GPU bottleneck. 14x slower than NVLink. Data transfer must be minimized — keep computation on GPU.', color: '#f97316' },
            { name: 'InfiniBand NDR', desc: '400 Gbps (50 GB/s) between servers. RDMA: GPU reads/writes remote GPU memory directly. GPUDirect bypasses CPU/system memory entirely.', color: '#3b82f6' },
            { name: 'NVSwitch', desc: 'Full-bisection switch connecting 8 GPUs at 900 GB/s each. Every GPU can talk to every other at full bandwidth simultaneously. DGX H100 has 4 NVSwitches.', color: '#8b5cf6' },
          ].map(i => (
            <div key={i.name} style={{ padding: 12, borderRadius: 10, background: i.color + '08', border: '1px solid ' + i.color + '33' }}>
              <div style={{ fontWeight: 700, color: i.color, marginBottom: 4, fontSize: 14 }}>{i.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{i.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>GPT-4 training reportedly used ~25,000 A100 GPUs. All-reduce gradient synchronization across this many GPUs requires network bandwidth exceeding the total internet traffic of many countries.</p>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>GPU Engineering</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>From graphics pipelines to AI accelerators.</p>
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
      code={`import time
import array
import math

# === CPU vs GPU: The parallelism gap ===
# Python on CPU: inherently serial
# GPU: thousands of threads in parallel

# Simulate the difference with a parallel-friendly task
n = 1_000_000

# "Embarrassingly parallel": each element independent
data = array.array('f', [float(i) for i in range(n)])

# CPU (serial): process one element at a time
t0 = time.perf_counter()
result_cpu = array.array('f', [math.sin(x) * math.cos(x) for x in data])
cpu_time = time.perf_counter() - t0

print(f"CPU serial (1M sin*cos): {cpu_time*1000:.1f}ms")
print(f"Elements/sec: {n/cpu_time:,.0f}")
print()

# === What GPU code looks like (conceptual) ===
print("=== Equivalent CUDA kernel ===")
print('''
__global__ void sincos_kernel(float* data, float* out, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) {
        out[i] = sinf(data[i]) * cosf(data[i]);
    }
}
// Launch: sincos_kernel<<<n/256, 256>>>(d_data, d_out, n);
// 1M elements / 256 threads per block = 3,906 blocks
// GPU processes all 1M elements in ~0.05ms (20x faster)
''')

# === NumPy: CPU SIMD parallelism ===
try:
    import numpy as np
    data_np = np.arange(n, dtype=np.float32)
    t0 = time.perf_counter()
    result_np = np.sin(data_np) * np.cos(data_np)
    np_time = time.perf_counter() - t0
    print(f"NumPy (SIMD vectorized): {np_time*1000:.1f}ms")
    print(f"Speedup vs pure Python: {cpu_time/np_time:.1f}x")
    print(f"GPU would be another ~10-50x faster than NumPy")
except ImportError:
    print("NumPy not available for comparison")

# === GPU programming from Python ===
print("\\n=== Python GPU Libraries ===")
libs = {
    'CuPy': 'Drop-in NumPy replacement on GPU',
    'PyTorch': 'tensor.cuda() moves data to GPU',
    'JAX': 'jax.jit compiles to XLA → GPU kernels',
    'Numba': '@cuda.jit decorator compiles Python to CUDA',
    'RAPIDS cuDF': 'Pandas DataFrames on GPU',
    'Triton': 'Python-like GPU kernel language by OpenAI',
}
for lib, desc in libs.items():
    print(f"  {lib}: {desc}")`}
      explanation="Python hides GPU complexity through libraries. NumPy uses CPU SIMD (4-16x speedup). CuPy/PyTorch move computation to GPU (100-1000x for large arrays). The key insight: GPU acceleration only works for parallel operations on large datasets. A single Python if/else can't use GPU at all — but matrix multiply over millions of elements uses every core."
      hardwareNote="When you call tensor.cuda() in PyTorch, your data crosses CPU→PCIe→GPU memory (32 GB/s bottleneck). Once on the GPU, operations run at 1 TB/s bandwidth. This is why ML frameworks batch operations and keep data on GPU — every CPU↔GPU transfer wastes thousands of cycles."
    />
  );
}

function Layer5() {
  const apps = [
    { icon: '\u{1F3AE}', title: 'Real-Time Ray Tracing',
      desc: 'RTX GPUs trace rays in real time using dedicated RT Cores. Cyberpunk 2077 with path tracing: every light bounce physically simulated.',
      detail: 'RT Cores accelerate BVH (Bounding Volume Hierarchy) traversal and ray-triangle intersection — the two operations that dominate ray tracing. Without RT Cores, ray tracing is 10x slower, making real-time impossible.' },
    { icon: '\u{1F9E0}', title: 'LLM Training & Inference',
      desc: 'GPT-4 training: ~25,000 A100s for months. A single H100 can run 13B-parameter inference at 30+ tokens/second. Tensor Cores are essential.',
      detail: 'LLM inference is memory-bandwidth bound: loading 70B parameters at FP16 = 140 GB, streamed every token. H100 HBM3 at 3.35 TB/s allows ~24 full reads/second — directly limiting token throughput.' },
    { icon: '\u{1F3AC}', title: 'Video Encoding & Streaming',
      desc: 'NVIDIA NVENC, AMD VCN, Intel Arc encode H.264/H.265/AV1 in hardware. OBS, Discord, Twitch all use GPU encoding.',
      detail: 'Hardware encoders use dedicated ASIC blocks on the GPU die. NVENC encodes 8K60 HEVC while using zero CUDA cores — the shader hardware stays free for gaming or compute.' },
    { icon: '\u{1F52C}', title: 'Scientific Computing',
      desc: 'Molecular dynamics, weather simulation, particle physics. GPU-accelerated GROMACS runs protein folding 50x faster than CPU.',
      detail: 'Particle interactions are O(N²) — each particle with every other. GPU parallelism maps perfectly: each thread computes one particle\'s forces. N-body simulations went from hours to minutes.' },
    { icon: '\u26D3\uFE0F', title: 'Cryptocurrency Mining',
      desc: 'Ethereum mining (now ended) used GPU parallelism for hash computation. Bitcoin moved to ASICs. ZK-proof generation is the new GPU-heavy crypto workload.',
      detail: 'GPUs are ideal for hash computation: parallel, regular, no branching. But ASICs are 1000x more efficient for specific algorithms. ZK proofs need GPU-style flexibility — the next mining wave.' },
    { icon: '\u2601\uFE0F', title: 'Cloud GPU & Disaggregation',
      desc: 'AWS p5 instances: 8× H100 GPUs. Cloud makes $100K+ GPU clusters accessible by the hour. GPU disaggregation separates GPU memory from compute.',
      detail: 'Multi-Instance GPU (MIG) on H100 splits one GPU into 7 independent instances. Each gets guaranteed memory bandwidth and compute — like VMs but for GPU. Maximizes utilization for inference serving.' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>GPUs Power the Modern World</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>From gaming to AI to science — GPU parallelism is the engine of modern computing.</p>
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
        <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>GPU COMPUTE EVOLUTION</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginTop: 16 }}>
          <div><div style={{ fontSize: 16, fontWeight: 800, color: '#ef4444' }}>2006</div><div style={{ fontSize: 11, color: '#94a3b8' }}>CUDA 1.0 (Tesla)</div></div>
          <div style={{ fontSize: 14, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 16, fontWeight: 800, color: '#f97316' }}>2012</div><div style={{ fontSize: 11, color: '#94a3b8' }}>AlexNet (GPU ML)</div></div>
          <div style={{ fontSize: 14, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 16, fontWeight: 800, color: '#3b82f6' }}>2018</div><div style={{ fontSize: 11, color: '#94a3b8' }}>Tensor Cores (Volta)</div></div>
          <div style={{ fontSize: 14, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 16, fontWeight: 800, color: '#22c55e' }}>2022</div><div style={{ fontSize: 11, color: '#94a3b8' }}>H100 (2 PFLOPS)</div></div>
          <div style={{ fontSize: 14, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 16, fontWeight: 800, color: '#8b5cf6' }}>2024</div><div style={{ fontSize: 11, color: '#94a3b8' }}>B200 (4.5 PFLOPS)</div></div>
        </div>
      </div>
    </div>
  );
}

export default function L16_GPUArchitecture() {
  return (
    <LessonWrapper lessonId="L16" title="GPU Architecture"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'Factory Floor', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'SM, Memory & Execution', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'Pipelines & Tensor Cores', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python GPU Computing', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'GPUs Power Everything', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'Bandwidth Bound', description: 'H100 has 3.35 TB/s memory bandwidth. A transformer layer reads 70B FP16 parameters (140 GB). How many tokens/second can it generate?' },
        { id: 'c2', title: 'Occupancy', description: 'An SM has 65,536 registers and supports 2,048 threads. Your kernel uses 64 registers/thread. What is the maximum occupancy?' },
        { id: 'c3', title: 'Transfer Time', description: 'Copying 24 GB of model weights from CPU to GPU over PCIe 4.0 x16 (32 GB/s). How long? Why does this matter for inference serving?' },
      ]}
    />
  );
}
