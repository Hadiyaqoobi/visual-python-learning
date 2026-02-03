"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [mode, setMode] = useState<'polling' | 'interrupt' | 'dma'>('polling');
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(false);

  const maxCycle = mode === 'polling' ? 12 : mode === 'interrupt' ? 10 : 8;

  const scenarios = {
    polling: {
      title: 'Polling (Are We There Yet?)',
      cpuStates: ['CHECK', 'WAIT', 'CHECK', 'WAIT', 'CHECK', 'WAIT', 'CHECK', 'READY!', 'COPY', 'COPY', 'COPY', 'DONE', 'WORK'],
      cpuColors: ['#f97316', '#94a3b8', '#f97316', '#94a3b8', '#f97316', '#94a3b8', '#f97316', '#22c55e', '#8b5cf6', '#8b5cf6', '#8b5cf6', '#22c55e', '#3b82f6'],
      deviceStates: ['BUSY', 'BUSY', 'BUSY', 'BUSY', 'BUSY', 'BUSY', 'BUSY', 'DONE', 'SEND', 'SEND', 'SEND', 'IDLE', 'IDLE'],
      wastedCycles: 7,
      desc: 'CPU keeps asking "ready yet?" every cycle. Wastes 7 of 13 cycles just checking. Like constantly asking "are we there yet?" on a road trip.',
    },
    interrupt: {
      title: 'Interrupts (Call Me When Ready)',
      cpuStates: ['WORK', 'WORK', 'WORK', 'WORK', 'WORK', 'WORK', 'WORK', 'IRQ!', 'COPY', 'DONE', 'WORK'],
      cpuColors: ['#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#ef4444', '#8b5cf6', '#22c55e', '#3b82f6'],
      deviceStates: ['BUSY', 'BUSY', 'BUSY', 'BUSY', 'BUSY', 'BUSY', 'BUSY', 'IRQ\u2191', 'SEND', 'IDLE', 'IDLE'],
      wastedCycles: 0,
      desc: 'CPU does useful work until the device raises an interrupt signal. Like telling the waiter "tap my shoulder when the food is ready." Zero wasted cycles.',
    },
    dma: {
      title: 'DMA (Deliver It Yourself)',
      cpuStates: ['SETUP', 'WORK', 'WORK', 'WORK', 'WORK', 'WORK', 'WORK', 'IRQ!', 'DONE'],
      cpuColors: ['#f97316', '#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#ef4444', '#22c55e'],
      deviceStates: ['SETUP', 'BUSY', 'BUSY', 'BUSY', 'XFER', 'XFER', 'XFER', 'IRQ\u2191', 'IDLE'],
      dmaStates: ['', '', '', '', 'COPY', 'COPY', 'COPY', 'DONE', ''],
      wastedCycles: 0,
      desc: 'CPU tells the DMA controller: "copy this data to RAM yourself." DMA handles the transfer while CPU keeps working. CPU only pauses for 1-cycle setup and completion interrupt.',
    },
  };

  const s = scenarios[mode];

  useEffect(() => {
    if (!running) return;
    if (cycle >= maxCycle) { setRunning(false); return; }
    const t = setTimeout(() => setCycle(c => c + 1), 600);
    return () => clearTimeout(t);
  }, [running, cycle, maxCycle]);

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Three Ways to Talk to Devices</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        Your CPU needs data from a keyboard, disk, or network card. But these devices are <strong>millions of times slower</strong> than the CPU. How should the CPU wait for them?
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        <strong>Polling</strong> is like refreshing a webpage every second. <strong>Interrupts</strong> are like push notifications. <strong>DMA</strong> is like hiring a delivery service so you don't even need to answer the door.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        Watch how each method uses (or wastes) CPU time differently.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {([['polling', 'Polling', '#f97316'], ['interrupt', 'Interrupts', '#22c55e'], ['dma', 'DMA', '#3b82f6']] as const).map(([key, label, color]) => (
          <motion.button key={key} whileHover={{ scale: 1.05 }} onClick={() => { setMode(key); setCycle(0); setRunning(false); }}
            style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: mode === key ? color : '#f1f5f9', color: mode === key ? 'white' : '#334155', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            {label}
          </motion.button>
        ))}
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 24, border: '1px solid #334155' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 16 }}>{s.title}</div>

        {/* Timeline */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>CPU:</div>
          <div style={{ display: 'flex', gap: 3 }}>
            {s.cpuStates.map((state, i) => (
              <motion.div key={i}
                animate={{ opacity: i <= cycle ? 1 : 0.2, scale: i === cycle ? 1.1 : 1 }}
                style={{ flex: 1, padding: '8px 2px', borderRadius: 6, background: i <= cycle ? s.cpuColors[i] : '#1f2937', textAlign: 'center', fontSize: 9, fontWeight: 700, color: 'white', border: i === cycle ? '2px solid white' : '1px solid transparent', minWidth: 42 }}>
                {state}
              </motion.div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>Device:</div>
          <div style={{ display: 'flex', gap: 3 }}>
            {s.deviceStates.map((state, i) => (
              <motion.div key={i}
                animate={{ opacity: i <= cycle ? 1 : 0.2 }}
                style={{ flex: 1, padding: '8px 2px', borderRadius: 6, background: i <= cycle ? (state.includes('IRQ') ? '#ef4444' : state === 'DONE' ? '#22c55e' : state === 'SEND' ? '#8b5cf6' : state === 'IDLE' ? '#374151' : '#f97316') : '#1f2937', textAlign: 'center', fontSize: 9, fontWeight: 700, color: 'white', minWidth: 42 }}>
                {state}
              </motion.div>
            ))}
          </div>
        </div>
        {mode === 'dma' && s.dmaStates && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>DMA:</div>
            <div style={{ display: 'flex', gap: 3 }}>
              {s.dmaStates.map((state, i) => (
                <motion.div key={i}
                  animate={{ opacity: i <= cycle ? 1 : 0.2 }}
                  style={{ flex: 1, padding: '8px 2px', borderRadius: 6, background: state && i <= cycle ? '#ec4899' : '#1f2937', textAlign: 'center', fontSize: 9, fontWeight: 700, color: 'white', minWidth: 42 }}>
                  {state || '\u00B7'}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.desc}</div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setRunning(!running)}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: running ? '#ef4444' : '#22c55e', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            {running ? 'Pause' : 'Run'}
          </motion.button>
          <button onClick={() => setCycle(c => Math.min(c + 1, maxCycle))}
            style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>Step</button>
          <button onClick={() => { setCycle(0); setRunning(false); }}
            style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>Reset</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div style={{ padding: 16, borderRadius: 12, background: '#fff7ed', border: '1px solid #fed7aa' }}>
          <h4 style={{ margin: '0 0 6px', color: '#c2410c', fontSize: 14 }}>Polling</h4>
          <p style={{ margin: 0, color: '#9a3412', lineHeight: 1.7, fontSize: 13 }}>Simple but wastes CPU. OK for very fast devices or real-time systems where latency must be minimal.</p>
        </div>
        <div style={{ padding: 16, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 6px', color: '#166534', fontSize: 14 }}>Interrupts</h4>
          <p style={{ margin: 0, color: '#15803d', lineHeight: 1.7, fontSize: 13 }}>CPU works until notified. Best for infrequent events (keyboard, mouse). Context switch has overhead (~1-5 \u00B5s).</p>
        </div>
        <div style={{ padding: 16, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <h4 style={{ margin: '0 0 6px', color: '#1d4ed8', fontSize: 14 }}>DMA</h4>
          <p style={{ margin: 0, color: '#1e40af', lineHeight: 1.7, fontSize: 13 }}>Hardware copies data without CPU. Essential for disk, network, GPU. CPU only handles setup and completion.</p>
        </div>
      </div>
    </div>
  );
}

function Layer2() {
  const [selectedDevice, setSelectedDevice] = useState<'ssd' | 'nic' | 'gpu' | 'keyboard'>('ssd');

  const devices = {
    ssd: {
      name: 'NVMe SSD',
      ioMethod: 'DMA + Interrupts (MSI-X)',
      latency: '10-100 \u00B5s',
      bandwidth: '7 GB/s (PCIe 4.0 x4)',
      queueDepth: '64K queues \u00D7 64K entries',
      diagram: [
        { label: 'Application calls read()', color: '#3b82f6' },
        { label: 'Kernel builds NVMe command', color: '#8b5cf6' },
        { label: 'Command placed in submission queue', color: '#f97316' },
        { label: 'Doorbell register poked', color: '#ef4444' },
        { label: 'SSD DMA reads command from RAM', color: '#ec4899' },
        { label: 'SSD fetches data from flash', color: '#f97316' },
        { label: 'SSD DMA writes data to RAM', color: '#ec4899' },
        { label: 'Completion entry written to CQ', color: '#22c55e' },
        { label: 'MSI-X interrupt fires', color: '#ef4444' },
        { label: 'Kernel wakes waiting process', color: '#3b82f6' },
      ],
    },
    nic: {
      name: 'Network Card (NIC)',
      ioMethod: 'DMA + NAPI (polling+interrupt hybrid)',
      latency: '1-50 \u00B5s',
      bandwidth: '25-400 Gbps',
      queueDepth: 'Multiple TX/RX ring buffers',
      diagram: [
        { label: 'Packet arrives on wire', color: '#22c55e' },
        { label: 'NIC DMA writes packet to ring buffer', color: '#ec4899' },
        { label: 'NIC raises interrupt', color: '#ef4444' },
        { label: 'Kernel switches to polling mode (NAPI)', color: '#f97316' },
        { label: 'Kernel polls ring buffer for more packets', color: '#f97316' },
        { label: 'Packets processed in batch (no IRQ per packet)', color: '#3b82f6' },
        { label: 'When queue drains, re-enable interrupts', color: '#22c55e' },
      ],
    },
    gpu: {
      name: 'GPU',
      ioMethod: 'DMA + Command Buffers + Fences',
      latency: '5-50 \u00B5s (submission)',
      bandwidth: '32 GB/s (PCIe 4.0 x16)',
      queueDepth: 'Multiple command queues',
      diagram: [
        { label: 'Application builds command buffer', color: '#3b82f6' },
        { label: 'Driver validates and patches commands', color: '#8b5cf6' },
        { label: 'Commands submitted to GPU queue', color: '#f97316' },
        { label: 'GPU DMA reads command buffer from RAM', color: '#ec4899' },
        { label: 'GPU executes shader/compute workload', color: '#22c55e' },
        { label: 'GPU DMA writes results to RAM', color: '#ec4899' },
        { label: 'GPU signals fence (completion)', color: '#ef4444' },
        { label: 'CPU polls fence or waits for interrupt', color: '#3b82f6' },
      ],
    },
    keyboard: {
      name: 'USB Keyboard',
      ioMethod: 'Interrupt transfers (USB)',
      latency: '1-8 ms (USB polling interval)',
      bandwidth: '64 bytes per transfer',
      queueDepth: '1 (one report at a time)',
      diagram: [
        { label: 'Key pressed, scancode generated', color: '#22c55e' },
        { label: 'USB controller polls device (1-8ms interval)', color: '#f97316' },
        { label: 'Keyboard sends HID report (8 bytes)', color: '#8b5cf6' },
        { label: 'USB host controller DMA writes to RAM', color: '#ec4899' },
        { label: 'Host controller raises interrupt', color: '#ef4444' },
        { label: 'USB driver decodes HID report', color: '#3b82f6' },
        { label: 'Input subsystem delivers keypress event', color: '#3b82f6' },
      ],
    },
  };

  const dev = devices[selectedDevice];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>I/O Flow for Real Devices</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24, fontSize: 16 }}>
        Select a device to see the complete I/O path — from hardware signal to application data. Every device has a different strategy optimized for its speed and usage pattern.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {(Object.keys(devices) as Array<keyof typeof devices>).map(key => (
          <motion.button key={key} whileHover={{ scale: 1.05 }} onClick={() => setSelectedDevice(key)}
            style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: selectedDevice === key ? '#3b82f6' : '#f1f5f9', color: selectedDevice === key ? 'white' : '#334155', fontWeight: 700, fontSize: 13 }}>
            {devices[key].name}
          </motion.button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontSize: 20, fontWeight: 700 }}>{dev.name}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          <div style={{ padding: 12, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Method</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>{dev.ioMethod}</div>
          </div>
          <div style={{ padding: 12, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Latency</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>{dev.latency}</div>
          </div>
          <div style={{ padding: 12, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Bandwidth</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>{dev.bandwidth}</div>
          </div>
          <div style={{ padding: 12, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Queue Depth</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>{dev.queueDepth}</div>
          </div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 12 }}>I/O Path:</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {dev.diagram.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: step.color + '0a', borderLeft: '3px solid ' + step.color, fontSize: 13, color: '#1e293b' }}>{step.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ padding: 20, borderRadius: 12, background: '#f5f3ff', border: '1px solid #c4b5fd' }}>
        <h4 style={{ margin: '0 0 8px', color: '#6d28d9' }}>Interrupt Coalescing</h4>
        <p style={{ margin: 0, color: '#5b21b6', lineHeight: 1.7, fontSize: 14 }}>
          High-speed devices (NIC, NVMe) would fire thousands of interrupts per second. Interrupt coalescing batches multiple completions into one interrupt, trading latency for CPU efficiency. NICs use NAPI to switch between interrupt and polling modes dynamically.
        </p>
      </div>
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'Memory-Mapped I/O vs Port I/O', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>The CPU communicates with devices through <strong>registers</strong>. Two approaches map device registers into the CPU's address space.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ padding: 14, borderRadius: 10, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div style={{ fontWeight: 700, color: '#1d4ed8', marginBottom: 4, fontSize: 14 }}>Memory-Mapped I/O (MMIO)</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.8 }}>
              Device registers appear at physical addresses. CPU uses normal load/store instructions. Modern standard. GPU BAR = MMIO window into GPU memory. Supports all addressing modes and protection.
            </div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: '#fff7ed', border: '1px solid #fed7aa' }}>
            <div style={{ fontWeight: 700, color: '#c2410c', marginBottom: 4, fontSize: 14 }}>Port I/O (PIO)</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.8 }}>
              Separate I/O address space. x86 uses IN/OUT instructions. Legacy method. Limited to 64K ports. Still used for some BIOS/firmware devices. ARM doesn't have port I/O at all.
            </div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>MMIO is preferred because it works with virtual memory, page protection, and cache control. The OS maps device MMIO regions as <strong>uncacheable</strong> (UC) to prevent stale reads.</p>
      </div>
    )},
    { title: 'DMA Engine Architecture', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>DMA controllers are specialized hardware that copy data between devices and memory without CPU involvement.</p>
        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#1e293b' }}>
            <div><strong>Scatter-Gather DMA:</strong></div>
            <div>CPU builds a linked list of (address, length) descriptors</div>
            <div>DMA engine walks the list, transferring each segment</div>
            <div>No need for contiguous physical memory!</div>
            <div style={{ marginTop: 8 }}><strong>Ring Buffer (used by NIC/NVMe):</strong></div>
            <div>Circular array of DMA descriptors</div>
            <div>Producer (device) writes, consumer (CPU) reads</div>
            <div>Head/tail pointers avoid locking</div>
            <div style={{ marginTop: 8 }}><strong>IOMMU (I/O Memory Management Unit):</strong></div>
            <div>Translates device DMA addresses to physical</div>
            <div>Prevents rogue devices from accessing arbitrary RAM</div>
            <div>Essential for PCIe passthrough in VMs (VFIO)</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Without IOMMU, a buggy PCIe device could DMA-write anywhere in RAM, corrupting kernel memory. IOMMU provides the same protection for device DMA that the MMU provides for CPU access.</p>
      </div>
    )},
    { title: 'Device Driver Architecture', color: '#f97316', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Device drivers are kernel code that translate OS I/O requests into hardware-specific register writes and DMA operations.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'Character Devices', desc: 'Byte streams: keyboards, serial ports, /dev/random. Read/write one byte at a time. No seeking. open(), read(), write(), ioctl().', color: '#3b82f6' },
            { name: 'Block Devices', desc: 'Fixed-size blocks: disks, SSDs. Random access. Buffered through page cache. Supports file systems. Uses I/O scheduler for ordering.', color: '#22c55e' },
            { name: 'Network Devices', desc: 'Packet-based: Ethernet, Wi-Fi. Uses socket API, not read/write. sk_buff structures carry packets through the network stack.', color: '#f97316' },
            { name: 'Framebuffer/DRM', desc: 'Display devices. DRM (Direct Rendering Manager) for GPU. Modesetting, buffer management, command submission. Complex state machines.', color: '#8b5cf6' },
          ].map(d => (
            <div key={d.name} style={{ padding: 12, borderRadius: 10, background: d.color + '08', border: '1px solid ' + d.color + '33' }}>
              <div style={{ fontWeight: 700, color: d.color, marginBottom: 4, fontSize: 14 }}>{d.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{d.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Linux has ~28 million lines of driver code out of ~32 million total. Drivers are the largest source of kernel bugs because they interface with unpredictable hardware and are often written by hardware vendors, not kernel developers.</p>
      </div>
    )},
    { title: 'I/O Scheduling & Queuing', color: '#8b5cf6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>The OS I/O scheduler reorders and merges I/O requests to maximize throughput and minimize latency.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'CFQ (Completely Fair)', desc: 'Gives each process fair I/O time slices. Good for desktops, bad for servers. Deprecated in Linux 5.0.', color: '#3b82f6' },
            { name: 'mq-deadline', desc: 'Sorts requests by sector, enforces deadlines to prevent starvation. Multi-queue aware. Good for SSDs with mixed workloads.', color: '#22c55e' },
            { name: 'BFQ (Budget Fair)', desc: 'Gives processes I/O budget (sectors) not time. Excellent for interactive responsiveness. Higher CPU overhead.', color: '#f97316' },
            { name: 'none (noop)', desc: 'No reordering — FIFO. Best for NVMe SSDs that do their own scheduling internally. Lowest CPU overhead.', color: '#8b5cf6' },
          ].map(s => (
            <div key={s.name} style={{ padding: 12, borderRadius: 10, background: s.color + '08', border: '1px solid ' + s.color + '33' }}>
              <div style={{ fontWeight: 700, color: s.color, marginBottom: 4, fontSize: 14 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>NVMe changed everything: with 64K hardware queues, the device can schedule I/O better than the OS. Linux multi-queue block layer (blk-mq) maps software queues to hardware queues, one per CPU core, eliminating lock contention.</p>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>I/O System Internals</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>The engineering that connects software to hardware.</p>
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
      code={`import time, os

# === Buffered vs unbuffered I/O ===
data = b'Hello World! ' * 100  # 1300 bytes

# Unbuffered: each write() = syscall = I/O transaction
t0 = time.perf_counter()
fd = os.open('/tmp/unbuf_test', os.O_WRONLY | os.O_CREAT | os.O_TRUNC)
for _ in range(10000):
    os.write(fd, data)
os.close(fd)
unbuf = time.perf_counter() - t0

# Buffered: Python batches writes into 8KB chunks
t0 = time.perf_counter()
with open('/tmp/buf_test', 'wb') as f:
    for _ in range(10000):
        f.write(data)
buf = time.perf_counter() - t0

os.remove('/tmp/unbuf_test')
os.remove('/tmp/buf_test')

print(f"Unbuffered: {unbuf*1000:.1f}ms (10K syscalls)")
print(f"Buffered:   {buf*1000:.1f}ms (batched)")
print(f"Buffered is {unbuf/buf:.1f}x faster")

# === Sync vs async I/O ===
# sync: process blocks until I/O completes
# async: submit I/O, do other work, check later

# Python's asyncio uses epoll (Linux) to monitor
# multiple I/O sources without blocking
import selectors
print(f"\\nI/O selector: {selectors.DefaultSelector.__name__}")
# EpollSelector on Linux, KqueueSelector on macOS

# === File descriptor limits ===
import resource
soft, hard = resource.getrlimit(resource.RLIMIT_NOFILE)
print(f"File descriptors: soft={soft}, hard={hard}")
# Each open file/socket/pipe = 1 fd
# Web servers need 1 fd per connection
# C10K problem: 10,000 connections = 10,000 fds

# === I/O stats ===
print("\\n--- /proc/diskstats shows I/O counters ---")
print("reads_completed, reads_merged, sectors_read,")
print("read_time_ms, writes_completed, writes_merged,")
print("sectors_written, write_time_ms, io_in_progress,")
print("io_time_ms, weighted_io_time_ms")`}
      explanation="Python's file I/O is buffered by default — small writes are batched into 8KB chunks before issuing a syscall. Each syscall crosses the user/kernel boundary, triggers I/O scheduling, and may initiate DMA. Buffering reduces this overhead dramatically. For network I/O, Python uses epoll/kqueue to monitor thousands of connections without a thread per socket."
      hardwareNote="Every Python read()/write() eventually becomes a DMA transfer. The path: Python buffer → syscall → kernel page cache → I/O scheduler → device driver → DMA controller → device. Understanding this chain explains why I/O patterns matter more than raw device speed."
    />
  );
}

function Layer5() {
  const apps = [
    { icon: '\u{1F310}', title: 'Web Server I/O Models',
      desc: 'nginx handles 10K+ connections with a single thread using epoll (Linux). Each connection is a file descriptor monitored for readability/writability.',
      detail: 'The C10K problem (1999): how to handle 10,000 simultaneous connections. epoll solved it by letting the kernel notify the server which sockets are ready, instead of checking all 10K every time.' },
    { icon: '\u{1F4BE}', title: 'Database Storage Engines',
      desc: 'PostgreSQL uses buffered I/O through the OS page cache. MySQL InnoDB uses O_DIRECT to bypass the page cache and manage its own buffer pool.',
      detail: 'Double buffering (DB cache + OS cache) wastes RAM. O_DIRECT eliminates the OS copy. But O_DIRECT requires aligned I/O and gives up read-ahead. Each approach has tradeoffs.' },
    { icon: '\u26A1', title: 'io_uring (Linux 5.1+)',
      desc: 'Revolutionary async I/O interface. Submission and completion queues in shared memory — zero syscalls for I/O submission after setup.',
      detail: 'Traditional async I/O (libaio) needed one syscall per submission. io_uring uses ring buffers in shared memory: the kernel and app communicate through memory, not syscalls. 10x fewer syscalls.' },
    { icon: '\u{1F3AE}', title: 'GPU I/O Pipeline',
      desc: 'Vulkan and DirectX 12 expose multiple command queues: graphics, compute, transfer. Applications overlap GPU rendering with DMA transfers.',
      detail: 'A game simultaneously renders frame N, uploads textures for frame N+1, and downloads compute results from frame N-1. Three queues running in parallel on the same GPU.' },
    { icon: '\u{1F4F1}', title: 'Mobile I/O Power',
      desc: 'Every I/O operation wakes hardware. Batching network requests saves battery. iOS and Android defer background I/O to reduce wake-ups.',
      detail: 'A single HTTP request wakes the radio (1-2s ramp-up), modem, and CPU. Batching 10 requests into one wake cycle uses 10x less power than 10 separate wake cycles.' },
    { icon: '\u{1F5A5}\uFE0F', title: 'Virtualized I/O (virtio)',
      desc: 'VMs can\'t access real hardware directly. virtio provides paravirtualized devices with shared memory ring buffers between guest and host.',
      detail: 'VFIO/PCIe passthrough gives VMs direct hardware access via IOMMU. Near-native performance but the device is dedicated to one VM. SR-IOV splits one NIC into multiple virtual functions.' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>I/O Shapes Every System</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>Most real-world performance problems are I/O problems, not CPU problems.</p>
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
        <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>I/O LATENCY HIERARCHY</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginTop: 16 }}>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e' }}>~1 ns</div><div style={{ fontSize: 11, color: '#94a3b8' }}>L1 Cache</div></div>
          <div style={{ color: '#374151' }}>&lt;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#3b82f6' }}>~100 ns</div><div style={{ fontSize: 11, color: '#94a3b8' }}>DRAM</div></div>
          <div style={{ color: '#374151' }}>&lt;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#f97316' }}>~10 \u00B5s</div><div style={{ fontSize: 11, color: '#94a3b8' }}>NVMe SSD</div></div>
          <div style={{ color: '#374151' }}>&lt;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#ef4444' }}>~5 ms</div><div style={{ fontSize: 11, color: '#94a3b8' }}>HDD Seek</div></div>
          <div style={{ color: '#374151' }}>&lt;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#8b5cf6' }}>~50 ms</div><div style={{ fontSize: 11, color: '#94a3b8' }}>Network RTT</div></div>
        </div>
      </div>
    </div>
  );
}

export default function L12_IOSystems() {
  return (
    <LessonWrapper lessonId="L12" title="I/O Systems"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'Polling vs Interrupts vs DMA', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'Device I/O Flows', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'MMIO, DMA & Drivers', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python I/O Patterns', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'I/O Everywhere', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'DMA vs CPU Copy', description: 'Copying 1 GB via CPU takes 100% of one core for 200ms. DMA takes 0.1% CPU for setup. How much CPU time does DMA save for 100 transfers?' },
        { id: 'c2', title: 'Interrupt Storm', description: 'A 100 Gbps NIC receives 10 million packets/second. Each interrupt takes 2 \u00B5s. What percentage of CPU time is spent on interrupts without coalescing?' },
        { id: 'c3', title: 'Buffer Sizing', description: 'Why does Python use 8KB I/O buffers instead of 1KB or 1MB?' },
      ]}
    />
  );
}
