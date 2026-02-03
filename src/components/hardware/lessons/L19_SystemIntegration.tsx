"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const components = [
    { id: 'cpu', label: 'CPU', x: 50, y: 15, w: 20, color: '#3b82f6', desc: 'Executes instructions. Fetches from L1→L2→L3→RAM. Branch prediction, out-of-order execution, speculative execution. 5 GHz, billions of ops/sec.' },
    { id: 'l3', label: 'L3 Cache', x: 50, y: 32, w: 22, color: '#8b5cf6', desc: 'Last-level cache shared by all cores. 32-96 MB. ~10ns latency. Inclusive or non-inclusive depending on architecture. Sliced across cores.' },
    { id: 'mc', label: 'Memory\nController', x: 15, y: 48, w: 18, color: '#22c55e', desc: 'Manages DDR5 channels. On-die since AMD64/Core i. Dual-channel interleaving. Refresh scheduling. Row buffer management.' },
    { id: 'ram', label: 'DDR5 RAM', x: 15, y: 68, w: 18, color: '#22c55e', desc: '32-128 GB. ~80ns latency. 51.2 GB/s per channel. Dual subchannels. On-die ECC. Stores active programs and data.' },
    { id: 'pcie', label: 'PCIe 5.0\nController', x: 50, y: 48, w: 18, color: '#f97316', desc: 'Root complex. 128 GB/s x16. Connects GPU, NVMe, NICs. Packet-switched fabric. CXL support for cache-coherent devices.' },
    { id: 'gpu', label: 'GPU', x: 82, y: 32, w: 16, color: '#ef4444', desc: '16K+ CUDA cores. 1 TB/s HBM/GDDR bandwidth. Tensor cores for ML. RT cores for ray tracing. Separate memory space, PCIe bridge.' },
    { id: 'nvme', label: 'NVMe SSD', x: 50, y: 68, w: 16, color: '#f97316', desc: '7,450 MB/s read. PCIe 4.0/5.0 x4. 64K command queues. Direct CPU↔SSD via DMA. ~10 µs latency. 1-4 TB typical.' },
    { id: 'nic', label: 'Network', x: 82, y: 56, w: 14, color: '#ec4899', desc: '25-400 Gbps Ethernet. RDMA for zero-copy. RSS distributes packets across cores. TCP offload. DMA to host memory.' },
    { id: 'usb', label: 'USB / IO', x: 15, y: 88, w: 16, color: '#94a3b8', desc: 'USB4 (40 Gbps), Thunderbolt 4, audio, sensors. South bridge / PCH handles low-speed I/O. Interrupt-driven.' },
    { id: 'pch', label: 'Chipset\n(PCH)', x: 50, y: 88, w: 18, color: '#94a3b8', desc: 'Platform Controller Hub. Manages SATA, USB, audio, LPC. Connected to CPU via DMI 4.0 (8 GB/s). The I/O traffic cop.' },
  ];

  const paths = [
    { id: 'cpu-l3', from: 'cpu', to: 'l3', label: 'L3 Bus: ~10ns, 1 TB/s', color: '#8b5cf6' },
    { id: 'l3-mc', from: 'l3', to: 'mc', label: 'Memory Bus: ~80ns', color: '#22c55e' },
    { id: 'mc-ram', from: 'mc', to: 'ram', label: 'DDR5: 51.2 GB/s/ch', color: '#22c55e' },
    { id: 'cpu-pcie', from: 'cpu', to: 'pcie', label: 'PCIe Root Complex', color: '#f97316' },
    { id: 'pcie-gpu', from: 'pcie', to: 'gpu', label: 'PCIe 5.0 x16: 64 GB/s', color: '#ef4444' },
    { id: 'pcie-nvme', from: 'pcie', to: 'nvme', label: 'PCIe 4.0 x4: 8 GB/s', color: '#f97316' },
    { id: 'pcie-nic', from: 'pcie', to: 'nic', label: 'PCIe 4.0 x8: 16 GB/s', color: '#ec4899' },
    { id: 'cpu-pch', from: 'cpu', to: 'pch', label: 'DMI 4.0: 8 GB/s', color: '#94a3b8' },
    { id: 'pch-usb', from: 'pch', to: 'usb', label: 'USB4: 5 GB/s', color: '#94a3b8' },
  ];

  const hovered = components.find(c => c.id === hoveredComponent);

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>The Complete System</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        Every lesson in this course connects to form a complete computer system. The CPU fetches instructions (L15) from cache (L06) through the memory hierarchy (L05), executes them on pipelined cores (L09) with branch prediction (L10), communicates over buses (L11), handles I/O via interrupts (L13) and DMA (L12), uses virtual memory (L14) to isolate processes, and manages power (L17) across multiple cores (L18).
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        Hover over each component to see how it connects to lessons you've learned.
      </p>

      <div style={{ position: 'relative', background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 24, border: '1px solid #334155', minHeight: 500 }}>
        {/* Components */}
        {components.map(c => (
          <motion.div key={c.id}
            onMouseEnter={() => setHoveredComponent(c.id)}
            onMouseLeave={() => setHoveredComponent(null)}
            whileHover={{ scale: 1.08, zIndex: 10 }}
            style={{
              position: 'absolute', left: `${c.x - c.w / 2}%`, top: `${c.y}%`, width: `${c.w}%`,
              padding: '10px 6px', borderRadius: 12,
              background: hoveredComponent === c.id ? c.color : c.color + '33',
              border: `2px solid ${c.color}`,
              textAlign: 'center', cursor: 'pointer', zIndex: hoveredComponent === c.id ? 10 : 1,
              transition: 'background 0.2s',
            }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'white', whiteSpace: 'pre-line', lineHeight: 1.3 }}>{c.label}</div>
          </motion.div>
        ))}

        {/* Info panel */}
        <AnimatePresence>
          {hovered && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', bottom: 12, left: 12, right: 12, padding: 16, borderRadius: 12, background: 'rgba(15,23,42,0.95)', border: '1px solid ' + hovered.color, zIndex: 20 }}>
              <div style={{ fontWeight: 700, color: hovered.color, marginBottom: 4, fontSize: 15 }}>{hovered.label.replace('\n', ' ')}</div>
              <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7 }}>{hovered.desc}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Connection legend */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {paths.map(p => (
          <div key={p.id} style={{ padding: 8, borderRadius: 8, background: p.color + '0a', borderLeft: '3px solid ' + p.color, fontSize: 11, color: '#475569' }}>
            <span style={{ fontWeight: 700, color: p.color }}>{p.from.toUpperCase()} → {p.to.toUpperCase()}</span>: {p.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function Layer2() {
  const [selectedTrace, setSelectedTrace] = useState<'keypress' | 'webload' | 'mlinfer'>('keypress');

  const traces = {
    keypress: {
      name: 'Keystroke → Screen',
      color: '#3b82f6',
      desc: 'You press "A" on the keyboard. What happens in the next 10 milliseconds?',
      steps: [
        { hw: 'USB Controller', lesson: 'L12 I/O', time: '0 µs', desc: 'Keyboard sends USB interrupt transfer (64 bytes). USB host controller receives packet.', color: '#94a3b8' },
        { hw: 'Interrupt Controller', lesson: 'L13 Interrupts', time: '~5 µs', desc: 'USB controller raises MSI-X interrupt. APIC routes to CPU core via interrupt vector.', color: '#ef4444' },
        { hw: 'CPU (Kernel)', lesson: 'L09 Pipeline', time: '~10 µs', desc: 'CPU saves register state, jumps to USB IRQ handler. Top-half acknowledges interrupt.', color: '#3b82f6' },
        { hw: 'Virtual Memory', lesson: 'L14 VM', time: '~15 µs', desc: 'Kernel maps USB buffer. Checks page table, TLB caches translation. Reads HID report.', color: '#8b5cf6' },
        { hw: 'Context Switch', lesson: 'L18 Multi-Core', time: '~50 µs', desc: 'Kernel wakes the terminal process. Scheduler context-switches to the app on an available core.', color: '#22c55e' },
        { hw: 'CPU (App)', lesson: 'L15 ISA', time: '~100 µs', desc: 'Terminal app reads keycode. Processes input: echo character, update cursor position, insert in buffer.', color: '#3b82f6' },
        { hw: 'Cache Hierarchy', lesson: 'L06 Cache', time: '~105 µs', desc: 'App\'s text buffer is in L1 cache (hot data). Character insertion: ~3ns L1 access. No cache miss.', color: '#f97316' },
        { hw: 'GPU Command', lesson: 'L16 GPU', time: '~200 µs', desc: 'App writes updated glyph to GPU command buffer via PCIe. GPU rasterizes the character.', color: '#ef4444' },
        { hw: 'Display Scanout', lesson: 'L11 Bus', time: '~5 ms', desc: 'GPU framebuffer scanned out to display via DisplayPort. Next vsync shows the character. Total: ~5-16 ms.', color: '#f97316' },
      ],
    },
    webload: {
      name: 'Web Page Load',
      color: '#22c55e',
      desc: 'You type "example.com" and hit Enter. How does the page appear?',
      steps: [
        { hw: 'CPU + DNS', lesson: 'L06 Cache', time: '0 ms', desc: 'Browser checks DNS cache (L1 → OS cache → router). Cache miss → UDP query to DNS resolver.', color: '#3b82f6' },
        { hw: 'NIC + DMA', lesson: 'L12 I/O', time: '~20 ms', desc: 'DNS response arrives. NIC DMAs packet to ring buffer in RAM. Raises interrupt for network stack.', color: '#22c55e' },
        { hw: 'TCP/TLS', lesson: 'L09 Pipeline', time: '~50 ms', desc: 'TCP 3-way handshake (1 RTT). TLS 1.3 handshake (1 RTT). CPU executes AES-NI for encryption.', color: '#3b82f6' },
        { hw: 'HTTP + NVMe', lesson: 'L11 Bus', time: '~80 ms', desc: 'HTTP GET sent. Server reads HTML from NVMe SSD (10 µs). Response traverses network back.', color: '#f97316' },
        { hw: 'Parser (CPU)', lesson: 'L15 ISA', time: '~100 ms', desc: 'Browser HTML parser runs on CPU. DOM tree construction. CSS parsing. JavaScript compilation (JIT).', color: '#3b82f6' },
        { hw: 'Memory Alloc', lesson: 'L14 VM', time: '~110 ms', desc: 'Browser allocates memory for DOM nodes. Virtual pages demand-paged. Heap grows via mmap().', color: '#8b5cf6' },
        { hw: 'Layout + Paint', lesson: 'L18 Multi-Core', time: '~150 ms', desc: 'Layout engine computes positions (main thread). Rasterization parallelized across compositor threads.', color: '#22c55e' },
        { hw: 'GPU Render', lesson: 'L16 GPU', time: '~160 ms', desc: 'Compositor sends display lists to GPU. GPU rasterizes tiles. Texture upload + fragment shaders.', color: '#ef4444' },
        { hw: 'Display', lesson: 'L17 Power', time: '~170 ms', desc: 'GPU presents frame. CPU drops to lower P-state. Idle cores enter C6 until next interaction.', color: '#94a3b8' },
      ],
    },
    mlinfer: {
      name: 'ML Inference (ChatGPT)',
      color: '#8b5cf6',
      desc: 'You send a prompt to an LLM. How does it generate each token?',
      steps: [
        { hw: 'Network Ingress', lesson: 'L12 I/O', time: '0 ms', desc: 'Your prompt arrives at the data center. NIC receives via RDMA. DMA copies to GPU-accessible memory.', color: '#ec4899' },
        { hw: 'Tokenizer (CPU)', lesson: 'L09 Pipeline', time: '~1 ms', desc: 'CPU tokenizes input text (BPE). Converts "Hello world" → [15496, 995]. Lookup in embedding table.', color: '#3b82f6' },
        { hw: 'GPU Transfer', lesson: 'L11 Bus', time: '~2 ms', desc: 'Token IDs transferred CPU→GPU via PCIe. Embedding vectors fetched from GPU HBM (3.35 TB/s on H100).', color: '#f97316' },
        { hw: 'Attention (GPU)', lesson: 'L16 GPU', time: '~5 ms', desc: 'Self-attention: Q×K^T matmul on Tensor Cores. Softmax. Attention × V. FP8/FP16 precision. KV-cache for previous tokens.', color: '#ef4444' },
        { hw: 'Feed-Forward', lesson: 'L05 Memory', time: '~8 ms', desc: 'FFN layers: two large matmuls per layer. Memory-bandwidth bound: reading 70B parameters from HBM every token.', color: '#22c55e' },
        { hw: 'Multi-GPU Sync', lesson: 'L18 Multi-Core', time: '~10 ms', desc: 'Tensor parallel: each GPU computes partial attention. All-reduce over NVLink (900 GB/s) to merge results.', color: '#8b5cf6' },
        { hw: 'Sampling (CPU)', lesson: 'L15 ISA', time: '~11 ms', desc: 'Logits transferred GPU→CPU. Temperature scaling, top-p sampling. Random number generation. Token selected.', color: '#3b82f6' },
        { hw: 'KV-Cache Update', lesson: 'L14 VM', time: '~12 ms', desc: 'New token\'s KV vectors appended to cache in GPU HBM. PagedAttention uses virtual memory concepts to manage fragmented KV blocks.', color: '#8b5cf6' },
        { hw: 'Power Management', lesson: 'L17 Power', time: 'Ongoing', desc: '8× H100 GPUs: ~5,600W total. Liquid cooling required. Dynamic power gating between batches. $30K+/month in electricity.', color: '#94a3b8' },
      ],
    },
  };

  const trace = traces[selectedTrace];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>End-to-End System Traces</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24, fontSize: 16 }}>
        Follow a real operation through every hardware layer. Each step maps back to a lesson you've completed.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(Object.keys(traces) as Array<keyof typeof traces>).map(key => (
          <motion.button key={key} whileHover={{ scale: 1.05 }} onClick={() => setSelectedTrace(key)}
            style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: selectedTrace === key ? traces[key].color : '#f1f5f9', color: selectedTrace === key ? 'white' : '#334155', fontWeight: 700, fontSize: 13 }}>
            {traces[key].name}
          </motion.button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 4px', color: trace.color, fontSize: 20, fontWeight: 700 }}>{trace.name}</h3>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 20, fontSize: 14 }}>{trace.desc}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {trace.steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              style={{ display: 'flex', alignItems: 'stretch', gap: 10 }}>
              {/* Timeline dot and line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: step.color, flexShrink: 0, marginTop: 6 }} />
                {i < trace.steps.length - 1 && <div style={{ width: 2, flex: 1, background: '#e2e8f0' }} />}
              </div>
              {/* Content */}
              <div style={{ flex: 1, padding: '6px 12px 12px', borderRadius: 10, background: step.color + '06', borderLeft: '3px solid ' + step.color }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <div style={{ fontWeight: 700, color: step.color, fontSize: 13 }}>{step.hw}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: step.color + '22', color: step.color, fontWeight: 600 }}>{step.lesson}</span>
                    <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{step.time}</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'SoC Design: Everything on One Chip', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Modern System-on-Chip designs integrate every subsystem onto a single die or package.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'Apple M3 Max', desc: 'CPU (16 cores: 12P+4E), GPU (40 cores), Neural Engine (16 cores), media engines, ISP, Thunderbolt, 96 GB unified memory. 92 billion transistors on TSMC 3nm. All sharing one memory pool at 400 GB/s.', color: '#3b82f6' },
            { name: 'Qualcomm Snapdragon 8 Gen 3', desc: 'CPU (Cortex-X4+A720+A520), Adreno GPU, Hexagon NPU (45 TOPS), 5G modem, Wi-Fi 7, GPS, ISP (200MP), Spectra camera. Single 4nm die for your phone.', color: '#22c55e' },
            { name: 'AMD EPYC 9654 (Server)', desc: 'Chiplet design: 12 CCD chiplets (8 cores each = 96 cores) + 1 I/O die. Infinity Fabric interconnect. 12 DDR5 channels (460 GB/s). 128 PCIe 5.0 lanes.', color: '#f97316' },
            { name: 'NVIDIA Grace Hopper', desc: 'CPU (ARM Grace, 72 cores) + GPU (H100, 80 GB HBM3) on one package. NVLink-C2C: 900 GB/s CPU↔GPU coherent link. Eliminates PCIe bottleneck for AI.', color: '#8b5cf6' },
          ].map(s => (
            <div key={s.name} style={{ padding: 14, borderRadius: 10, background: s.color + '08', border: '1px solid ' + s.color + '33' }}>
              <div style={{ fontWeight: 700, color: s.color, marginBottom: 4, fontSize: 14 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>The SoC trend unifies what used to be separate chips (CPU, GPU, memory controller, I/O) into one package. Benefits: lower latency (no package-to-package hops), lower power (shorter wires), unified memory (no copies). The tradeoff: no upgradability.</p>
      </div>
    )},
    { title: 'The Software Stack: Hardware Abstraction', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Between your Python code and the transistors lie dozens of abstraction layers, each hiding complexity from the layer above.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
          {[
            { layer: 'Your Python Code', detail: 'x = a + b', color: '#8b5cf6' },
            { layer: 'CPython Bytecode', detail: 'LOAD_FAST, BINARY_ADD, STORE_FAST', color: '#3b82f6' },
            { layer: 'CPython Interpreter (C)', detail: 'switch(opcode) { case BINARY_ADD: ... }', color: '#3b82f6' },
            { layer: 'C Runtime (libc)', detail: 'malloc(), memcpy(), syscall wrappers', color: '#22c55e' },
            { layer: 'System Call Interface', detail: 'read(), write(), mmap(), futex()', color: '#22c55e' },
            { layer: 'Linux Kernel', detail: 'Scheduler, VFS, memory manager, device drivers', color: '#f97316' },
            { layer: 'Hardware Abstraction (HAL)', detail: 'ACPI, device trees, firmware tables', color: '#f97316' },
            { layer: 'Microcode / Firmware', detail: 'x86 µops, SSD FTL, NIC firmware', color: '#ef4444' },
            { layer: 'ISA (x86-64 / ARM)', detail: 'ADD, MOV, JMP — the hardware contract', color: '#ef4444' },
            { layer: 'Microarchitecture', detail: 'Pipeline, caches, branch predictor, OoO', color: '#991b1b' },
            { layer: 'Transistors (CMOS)', detail: '~100 billion MOSFET switches on 3-5nm', color: '#991b1b' },
          ].map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', borderRadius: 8, background: l.color + '06', borderLeft: '3px solid ' + l.color }}>
              <div style={{ width: 20, textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#64748b' }}>{i}</div>
              <div style={{ width: 180, fontWeight: 700, color: l.color, fontSize: 12, flexShrink: 0 }}>{l.layer}</div>
              <div style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>{l.detail}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Your simple x + y traverses 11 abstraction layers. Each layer can be understood independently — that's the power of abstraction. But performance bugs often span layers: a Python loop that's slow because of TLB misses crosses 8 boundaries.</p>
      </div>
    )},
    { title: 'Bottleneck Analysis', color: '#f97316', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>System performance is always limited by the slowest component. Identifying the bottleneck is the most important performance skill.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'CPU-Bound', symptom: '100% CPU, low I/O wait', fix: 'Algorithmic optimization, SIMD vectorization, better cache locality, move to GPU', tools: 'perf, VTune, py-spy, cProfile', color: '#3b82f6' },
            { name: 'Memory-Bound', symptom: 'High LLC misses, IPC < 1', fix: 'Better data layout, prefetching, reduce working set, huge pages', tools: 'perf stat (cache-misses), cachegrind', color: '#22c55e' },
            { name: 'I/O-Bound', symptom: 'High iowait%, low CPU', fix: 'Async I/O, io_uring, NVMe, larger buffers, memory-mapped files', tools: 'iostat, blktrace, strace', color: '#f97316' },
            { name: 'Network-Bound', symptom: 'High latency, low throughput', fix: 'Connection pooling, compression, CDN, RDMA, batch requests', tools: 'tcpdump, Wireshark, ss', color: '#ef4444' },
            { name: 'Contention-Bound', symptom: 'Multiple cores but low utilization', fix: 'Reduce lock scope, lock-free structures, sharding, per-CPU data', tools: 'perf lock, mutrace, lockstat', color: '#8b5cf6' },
            { name: 'Thermal-Bound', symptom: 'Performance drops over time', fix: 'Better cooling, lower voltage, reduce sustained workload', tools: 'sensors, turbostat, throttle logs', color: '#ec4899' },
          ].map(b => (
            <div key={b.name} style={{ padding: 12, borderRadius: 10, background: b.color + '08', border: '1px solid ' + b.color + '33' }}>
              <div style={{ fontWeight: 700, color: b.color, marginBottom: 2, fontSize: 14 }}>{b.name}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Symptom: {b.symptom}</div>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 2 }}>Fix: {b.fix}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>Tools: {b.tools}</div>
            </div>
          ))}
        </div>
      </div>
    )},
    { title: 'The Future of Systems', color: '#8b5cf6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Where computer architecture is heading in the next decade.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'Chiplets & UCIe', desc: 'Universal Chiplet Interconnect Express: mix-and-match dies from different fabs and vendors. TSMC 3nm compute chiplet + Intel I/O die + Samsung HBM. Lego-block chip design.', color: '#3b82f6' },
            { name: 'CXL Memory Pooling', desc: 'Compute Express Link allows disaggregated memory: a rack of memory shared by many servers. 10 TB memory pools. Cache-coherent over PCIe. Enables memory-bound AI workloads.', color: '#22c55e' },
            { name: 'Domain-Specific Accelerators', desc: 'End of general-purpose scaling → specialized chips. Google TPU (ML), AWS Graviton (cloud), Tesla Dojo (self-driving). RISC-V custom extensions for every vertical.', color: '#f97316' },
            { name: 'Photonic Interconnects', desc: 'Light instead of electrons between chips. 10x bandwidth, 1/10 power of electrical links. Intel/Ayar Labs optical I/O. Needed when electrical interconnects hit bandwidth wall.', color: '#8b5cf6' },
            { name: '3D Stacking', desc: 'AMD 3D V-Cache: stacking SRAM on top of CPU die. 96MB → 192MB L3 cache. Future: logic-on-logic stacking. Shorter wires = lower latency and power.', color: '#ef4444' },
            { name: 'Near-Memory Compute', desc: 'Processing-in-Memory (PIM): put compute inside DRAM/HBM. Samsung HBM-PIM adds ALUs to memory stack. Eliminates memory wall for bandwidth-bound workloads.', color: '#ec4899' },
          ].map(f => (
            <div key={f.name} style={{ padding: 12, borderRadius: 10, background: f.color + '08', border: '1px solid ' + f.color + '33' }}>
              <div style={{ fontWeight: 700, color: f.color, marginBottom: 4, fontSize: 14 }}>{f.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>System Architecture</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>How all the pieces fit together — and where they're going.</p>
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
      code={`import sys, os, time, struct, platform

# === Your Python program sits atop the entire hardware stack ===
# Let's inspect every layer from Python's perspective

print("=" * 55)
print("  SYSTEM INTEGRATION: Python Sees the Hardware")
print("=" * 55)
print()

# Layer 1: Platform & ISA (L15)
print("=== ISA & Platform ===")
print(f"  Architecture: {platform.machine()}")
print(f"  Pointer size: {struct.calcsize('P') * 8}-bit")
print(f"  Byte order: {sys.byteorder}-endian")
print(f"  Platform: {platform.platform()}")
print()

# Layer 2: CPU & Cores (L18 Multi-Core)
print("=== CPU & Cores ===")
cpu_count = os.cpu_count() or 1
print(f"  CPU cores: {cpu_count}")
print(f"  Python GIL: only 1 core for Python bytecode")
print(f"  multiprocessing.Pool({cpu_count}) for true parallel")
print()

# Layer 3: Memory (L05, L14 Virtual Memory)
print("=== Memory ===")
print(f"  Max Python int before bignum: {sys.maxsize}")
print(f"  Python object overhead: {sys.getsizeof(0)} bytes (int 0)")
print(f"  List overhead: {sys.getsizeof([])} bytes (empty)")
print(f"  Dict overhead: {sys.getsizeof({})} bytes (empty)")
print(f"  1 Python int 'x=42' uses {sys.getsizeof(42)} bytes")
print(f"    (vs 8 bytes for a C int64 or 4 for a register)")
print()

# Layer 4: Cache effects (L06 Cache)
print("=== Cache Effect Demo ===")
import array
SIZE = 500_000
data = array.array('i', range(SIZE))

# Sequential access (cache-friendly)
t0 = time.perf_counter()
total = 0
for i in range(SIZE):
    total += data[i]
seq_time = time.perf_counter() - t0

# Strided access (cache-unfriendly)
STRIDE = 16  # Skip 64 bytes = 1 cache line
t0 = time.perf_counter()
total = 0
for i in range(0, SIZE, STRIDE):
    total += data[i]
stride_time = time.perf_counter() - t0

elements_seq = SIZE
elements_stride = SIZE // STRIDE
print(f"  Sequential: {seq_time*1000:.1f}ms ({elements_seq} elements)")
print(f"  Stride-{STRIDE}: {stride_time*1000:.1f}ms ({elements_stride} elements)")
print(f"  Per-element: seq={seq_time/elements_seq*1e9:.1f}ns stride={stride_time/elements_stride*1e9:.1f}ns")
print()

# Layer 5: I/O stack (L12 I/O)
print("=== I/O Stack ===")
print(f"  Default buffer size: {__import__('io').DEFAULT_BUFFER_SIZE:,} bytes")
print(f"  This matches OS page size for efficient DMA")
print()

# Layer 6: Timing precision (L13 Interrupts, L17 Power)
print("=== System Timing ===")
readings = []
for _ in range(100):
    t0 = time.perf_counter()
    t1 = time.perf_counter()
    readings.append(t1 - t0)
resolution = min(r for r in readings if r > 0)
print(f"  Timer resolution: ~{resolution*1e9:.0f} ns")
print(f"  (Limited by CPU frequency, OS scheduler, C-state wakeup)")
print()

print("=" * 55)
print("  Every Python operation flows through:")
print("  bytecode → interpreter → syscall → kernel →")
print("  driver → bus → hardware → physics")
print("=" * 55)`}
      explanation="This script inspects the entire hardware stack from Python. Each measurement reveals a different hardware layer: platform.machine() tells you the ISA (x86_64 or aarch64). os.cpu_count() shows available cores. sys.getsizeof() reveals Python's memory overhead vs bare hardware. Sequential vs strided access demonstrates cache effects. Timer resolution reflects CPU frequency and power states."
      hardwareNote="Python adds 28-72 bytes of overhead per object (type pointer, reference count, value). A C int uses 4-8 bytes. A hardware register uses 0 bytes of memory. This is the cost of abstraction: Python trades 10-50× memory overhead for programmer productivity. Understanding these layers helps you know when to optimize and when Python's overhead doesn't matter."
    />
  );
}

function Layer5() {
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>You Now Understand the Machine</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        From transistors to Python, you've covered the complete stack. Here's your map of everything you've learned — and how it connects.
      </p>

      {/* Course map */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginBottom: 32 }}>
        {[
          { num: 'L01-L04', title: 'Digital Foundations', lessons: 'Binary, Logic Gates, Boolean Algebra, Number Systems', color: '#3b82f6', insight: 'Everything is 0s and 1s. Gates compute. Algebra optimizes.' },
          { num: 'L05-L06', title: 'Memory Hierarchy', lessons: 'Memory Organization, Cache Systems', color: '#22c55e', insight: 'Speed vs size tradeoff. Locality is king. Cache makes it fast.' },
          { num: 'L07-L08', title: 'Data Representation', lessons: 'Data Types, ALU Operations', color: '#f97316', insight: 'Integers, floats, strings encoded in bits. ALU computes them.' },
          { num: 'L09-L10', title: 'CPU Execution', lessons: 'Pipelining, Branch Prediction', color: '#ef4444', insight: 'Overlap stages for speed. Predict branches to avoid stalls.' },
          { num: 'L11-L13', title: 'I/O & Communication', lessons: 'Buses, I/O Systems, Interrupts', color: '#8b5cf6', insight: 'Devices talk via buses. DMA avoids CPU. Interrupts signal events.' },
          { num: 'L14', title: 'Virtual Memory', lessons: 'Address Translation, Page Tables', color: '#ec4899', insight: 'Every process gets private address space. Hardware translates.' },
          { num: 'L15-L16', title: 'ISA & GPU', lessons: 'Instruction Sets, GPU Architecture', color: '#3b82f6', insight: 'CPU: few fast cores. GPU: thousands of simple cores. Choose wisely.' },
          { num: 'L17-L18', title: 'Power & Parallelism', lessons: 'Power Management, Multi-Core', color: '#22c55e', insight: 'Power = CV²f. Amdahl limits speedup. GIL limits Python.' },
          { num: 'L19', title: 'System Integration', lessons: 'This Lesson — Everything Connected', color: '#f97316', insight: 'The whole is greater than the sum of its parts.' },
        ].map(block => (
          <motion.div key={block.num} whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
            style={{ padding: 20, borderRadius: 16, background: 'white', border: '1px solid #e2e8f0', borderTop: '4px solid ' + block.color }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: block.color, marginBottom: 4 }}>{block.num}</div>
            <h3 style={{ margin: '0 0 4px', color: '#1e293b', fontSize: 16, fontWeight: 700 }}>{block.title}</h3>
            <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: 12 }}>{block.lessons}</p>
            <p style={{ margin: 0, color: '#475569', fontSize: 13, lineHeight: 1.6, fontStyle: 'italic' }}>{block.insight}</p>
          </motion.div>
        ))}
      </div>

      {/* Key numbers */}
      <div style={{ padding: 24, borderRadius: 16, background: 'linear-gradient(135deg, #0f172a, #1e293b)', marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: 16 }}>The Numbers Every Programmer Should Know</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
          {[
            { value: '~0.3 ns', label: 'L1 cache access', color: '#22c55e' },
            { value: '~1 ns', label: 'L2 cache access', color: '#22c55e' },
            { value: '~10 ns', label: 'L3 cache access', color: '#3b82f6' },
            { value: '~100 ns', label: 'DRAM access', color: '#f97316' },
            { value: '~10 µs', label: 'NVMe SSD read', color: '#ef4444' },
            { value: '~5 ms', label: 'HDD seek', color: '#ef4444' },
            { value: '~50 ms', label: 'Network round-trip', color: '#8b5cf6' },
            { value: '~150 ms', label: 'Human perception', color: '#94a3b8' },
          ].map(n => (
            <div key={n.label} style={{ padding: 10, borderRadius: 8, background: '#1f2937', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: n.color }}>{n.value}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>{n.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Where to go next */}
      <div style={{ padding: 24, borderRadius: 16, background: '#f0f9ff', border: '1px solid #bae6fd' }}>
        <h3 style={{ margin: '0 0 12px', color: '#0369a1', fontSize: 20, fontWeight: 700 }}>Where to Go From Here</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { path: 'Systems Programming', rec: 'Learn C or Rust. Build an OS kernel (xv6), a database, or a compiler. Read "Computer Systems: A Programmer\'s Perspective" (CS:APP).' },
            { path: 'Performance Engineering', rec: 'Master perf, VTune, and flamegraphs. Study cache-oblivious algorithms. Optimize real programs: find and fix the bottleneck.' },
            { path: 'Hardware Design', rec: 'Learn Verilog/VHDL. Build a RISC-V CPU on an FPGA. Take a computer architecture course (Patterson & Hennessy).' },
            { path: 'ML Systems', rec: 'Understand GPU programming (CUDA). Study distributed training. Learn about quantization, KV-cache optimization, and serving systems.' },
          ].map(next => (
            <div key={next.path} style={{ padding: 14, borderRadius: 10, background: 'white', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0369a1', marginBottom: 4, fontSize: 14 }}>{next.path}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{next.rec}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function L19_SystemIntegration() {
  return (
    <LessonWrapper lessonId="L19" title="System Integration"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'The Complete System', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'End-to-End Traces', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'SoC, Stack & Bottlenecks', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python Sees Hardware', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'The Complete Map', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'Full Trace', description: 'Trace what happens when you run "python3 hello.py" from the shell. Cover: file system read, ELF loading, virtual memory setup, interpreter startup, bytecode execution, and print() syscall to terminal.' },
        { id: 'c2', title: 'Bottleneck Detective', description: 'A Python web app handles 100 req/s but needs 1000. CPU is at 25%, memory at 40%, disk I/O is low. What is likely the bottleneck? How would you diagnose and fix it?' },
        { id: 'c3', title: 'System Design', description: 'Design the hardware for a self-driving car computer. What ISA, how many cores, what accelerators, memory size, power budget, and cooling? Justify every choice with lessons from this course.' },
      ]}
    />
  );
}
