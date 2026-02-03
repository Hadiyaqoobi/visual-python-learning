"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [activeTransfer, setActiveTransfer] = useState<number | null>(null);
  const [busType, setBusType] = useState<'shared' | 'point'>('shared');
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(false);

  const sharedDevices = [
    { name: 'CPU', x: 80, color: '#3b82f6' },
    { name: 'RAM', x: 240, color: '#22c55e' },
    { name: 'GPU', x: 400, color: '#8b5cf6' },
    { name: 'SSD', x: 560, color: '#f97316' },
  ];

  const transfers = busType === 'shared' ? [
    { from: 0, to: 1, label: 'CPU reads RAM', cycle: 0 },
    { from: 2, to: 1, label: 'GPU reads RAM (waits!)', cycle: 1 },
    { from: 3, to: 1, label: 'SSD writes RAM (waits!)', cycle: 2 },
    { from: 0, to: 2, label: 'CPU sends to GPU (waits!)', cycle: 3 },
  ] : [
    { from: 0, to: 1, label: 'CPU reads RAM', cycle: 0 },
    { from: 2, to: 1, label: 'GPU reads RAM (simultaneous!)', cycle: 0 },
    { from: 3, to: 1, label: 'SSD writes RAM (simultaneous!)', cycle: 0 },
    { from: 0, to: 2, label: 'CPU sends to GPU (simultaneous!)', cycle: 1 },
  ];

  const maxCycle = busType === 'shared' ? 4 : 2;

  useEffect(() => {
    if (!running) return;
    if (cycle >= maxCycle) { setRunning(false); return; }
    const t = setTimeout(() => setCycle(c => c + 1), 1200);
    return () => clearTimeout(t);
  }, [running, cycle, maxCycle]);

  const activeTransfers = transfers.filter(t => t.cycle === cycle);

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>The Highway Analogy</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        A bus is a <strong>shared communication highway</strong> connecting computer components. Think of a single-lane road: only one car can use it at a time. Other cars must wait. This is a <strong>shared bus</strong>.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        Modern systems use <strong>point-to-point links</strong> — like building a private road between every pair of cities. Multiple transfers happen simultaneously. PCIe, for example, gives each device its own dedicated lanes.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        Watch how a shared bus serializes transfers while point-to-point links allow parallelism.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setBusType('shared'); setCycle(0); setRunning(false); }}
          style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: busType === 'shared' ? '#ef4444' : '#f1f5f9', color: busType === 'shared' ? 'white' : '#334155', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Shared Bus (Old)
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setBusType('point'); setCycle(0); setRunning(false); }}
          style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: busType === 'point' ? '#22c55e' : '#f1f5f9', color: busType === 'point' ? 'white' : '#334155', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Point-to-Point (Modern)
        </motion.button>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 24, border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
            {busType === 'shared' ? 'Shared Bus' : 'Point-to-Point'} — Cycle {cycle}/{maxCycle}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: busType === 'point' ? '#22c55e' : '#ef4444' }}>
            {busType === 'shared' ? '4 transfers = 4 cycles (serialized)' : '4 transfers = 2 cycles (parallel!)'}
          </div>
        </div>

        {/* Device nodes */}
        <svg width="100%" height="200" viewBox="0 0 680 200">
          {/* Bus line for shared mode */}
          {busType === 'shared' && (
            <rect x="40" y="95" width="600" height="10" rx="5" fill="#374151" />
          )}

          {/* Devices */}
          {sharedDevices.map((dev, i) => (
            <g key={i}>
              <motion.rect x={dev.x - 35} y="40" width="70" height="40" rx="10"
                animate={{ fill: activeTransfers.some(t => t.from === i || t.to === i) ? dev.color : '#1f2937', stroke: dev.color }}
                style={{ strokeWidth: 2 }} />
              <text x={dev.x} y="65" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">{dev.name}</text>
              {busType === 'shared' && <line x1={dev.x} y1="80" x2={dev.x} y2="95" stroke={dev.color} strokeWidth="2" />}

              {/* Point-to-point connections */}
              {busType === 'point' && sharedDevices.slice(i + 1).map((dev2, j) => (
                <line key={j} x1={dev.x} y1="80" x2={dev2.x} y2="80" stroke="#374151" strokeWidth="1" strokeDasharray="4" opacity="0.4" />
              ))}
            </g>
          ))}

          {/* Active transfer arrows */}
          {activeTransfers.map((t, i) => {
            const fromX = sharedDevices[t.from].x;
            const toX = sharedDevices[t.to].x;
            const y = busType === 'shared' ? 130 + i * 18 : 130 + i * 18;
            return (
              <g key={i}>
                <motion.line x1={fromX} y1={y} x2={toX} y2={y}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  stroke={sharedDevices[t.from].color} strokeWidth="3" markerEnd="url(#arrow)" />
                <text x={(fromX + toX) / 2} y={y - 6} textAnchor="middle" fill="#94a3b8" fontSize="10">{t.label}</text>
              </g>
            );
          })}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
          </defs>
        </svg>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca' }}>
          <h4 style={{ margin: '0 0 8px', color: '#991b1b' }}>Shared Bus (Legacy)</h4>
          <p style={{ margin: 0, color: '#b91c1c', lineHeight: 1.7, fontSize: 14 }}>
            One transfer at a time. Simple arbitration but becomes a bottleneck fast. Used in old ISA, PCI, and early front-side bus (FSB) designs. Max ~8 GB/s.
          </p>
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 8px', color: '#166534' }}>Point-to-Point (Modern)</h4>
          <p style={{ margin: 0, color: '#15803d', lineHeight: 1.7, fontSize: 14 }}>
            Dedicated lanes between devices. Multiple simultaneous transfers. PCIe, AMD Infinity Fabric, Intel UPI. PCIe 5.0 x16 = 64 GB/s per link.
          </p>
        </div>
      </div>
    </div>
  );
}

function Layer2() {
  const [selectedBus, setSelectedBus] = useState<'pcie' | 'usb' | 'sata' | 'ddr'>('pcie');

  const buses = {
    pcie: {
      name: 'PCIe (PCI Express)',
      versions: [
        { gen: '3.0', year: 2010, bwPerLane: '1 GB/s', x16: '16 GB/s', encoding: '128b/130b' },
        { gen: '4.0', year: 2017, bwPerLane: '2 GB/s', x16: '32 GB/s', encoding: '128b/130b' },
        { gen: '5.0', year: 2019, bwPerLane: '4 GB/s', x16: '64 GB/s', encoding: '128b/130b' },
        { gen: '6.0', year: 2022, bwPerLane: '8 GB/s', x16: '128 GB/s', encoding: 'PAM-4 + FEC' },
      ],
      desc: 'The dominant expansion bus. Each "lane" is a bidirectional serial link. Devices get x1, x4, x8, or x16 lanes. GPUs use x16. NVMe SSDs use x4.',
      color: '#3b82f6',
    },
    usb: {
      name: 'USB (Universal Serial Bus)',
      versions: [
        { gen: '2.0', year: 2000, bwPerLane: '60 MB/s', x16: '-', encoding: 'NRZI' },
        { gen: '3.0', year: 2008, bwPerLane: '625 MB/s', x16: '-', encoding: '8b/10b' },
        { gen: '3.2', year: 2017, bwPerLane: '2.5 GB/s', x16: '-', encoding: '128b/132b' },
        { gen: '4.0', year: 2019, bwPerLane: '5 GB/s', x16: '-', encoding: '64b/66b tunneling' },
      ],
      desc: 'Universal connector for peripherals. Evolved from 12 Mbps to 80 Gbps. USB4 tunnels PCIe and DisplayPort over one cable.',
      color: '#22c55e',
    },
    sata: {
      name: 'SATA (Serial ATA)',
      versions: [
        { gen: 'I', year: 2003, bwPerLane: '150 MB/s', x16: '-', encoding: '8b/10b' },
        { gen: 'II', year: 2004, bwPerLane: '300 MB/s', x16: '-', encoding: '8b/10b' },
        { gen: 'III', year: 2009, bwPerLane: '600 MB/s', x16: '-', encoding: '8b/10b' },
      ],
      desc: 'Storage bus, largely replaced by NVMe/PCIe for SSDs. SATA III at 600 MB/s is now the bottleneck for SSDs that can do 7,000+ MB/s over PCIe.',
      color: '#f97316',
    },
    ddr: {
      name: 'DDR Memory Bus',
      versions: [
        { gen: 'DDR3', year: 2007, bwPerLane: '12.8 GB/s', x16: '51.2 GB/s (4ch)', encoding: 'Parallel' },
        { gen: 'DDR4', year: 2014, bwPerLane: '25.6 GB/s', x16: '102.4 GB/s (4ch)', encoding: 'Parallel' },
        { gen: 'DDR5', year: 2020, bwPerLane: '51.2 GB/s', x16: '204.8 GB/s (4ch)', encoding: 'Parallel' },
      ],
      desc: 'Dedicated parallel bus between CPU and DRAM. Each channel is 64 bits wide. DDR5 doubled internal banks and added on-die ECC for reliability.',
      color: '#8b5cf6',
    },
  };

  const bus = buses[selectedBus];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Bus Standards Compared</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24, fontSize: 16 }}>
        Each bus evolved through generations, doubling bandwidth. Select a bus to explore its evolution and design choices.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {(Object.keys(buses) as Array<keyof typeof buses>).map(key => (
          <motion.button key={key} whileHover={{ scale: 1.05 }} onClick={() => setSelectedBus(key)}
            style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: selectedBus === key ? buses[key].color : '#f1f5f9', color: selectedBus === key ? 'white' : '#334155', fontWeight: 700, fontSize: 13 }}>
            {buses[key].name.split(' ')[0]}
          </motion.button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 8px', color: bus.color, fontSize: 20, fontWeight: 700 }}>{bus.name}</h3>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 20, fontSize: 14 }}>{bus.desc}</p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Generation</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Year</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Bandwidth/Lane</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Max Config</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Encoding</th>
              </tr>
            </thead>
            <tbody>
              {bus.versions.map((v, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i === bus.versions.length - 1 ? bus.color + '08' : 'transparent' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#1e293b' }}>{v.gen}</td>
                  <td style={{ padding: '10px 12px', color: '#475569' }}>{v.year}</td>
                  <td style={{ padding: '10px 12px', color: '#1e293b', fontWeight: 600 }}>{v.bwPerLane}</td>
                  <td style={{ padding: '10px 12px', color: '#475569' }}>{v.x16}</td>
                  <td style={{ padding: '10px 12px', color: '#64748b', fontSize: 12 }}>{v.encoding}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <h4 style={{ margin: '0 0 8px', color: '#1d4ed8' }}>Serial vs Parallel</h4>
          <p style={{ margin: 0, color: '#1e40af', lineHeight: 1.7, fontSize: 14 }}>
            Old buses (PCI, ATA) used parallel wires. Modern buses (PCIe, SATA, USB) are serial — one wire at much higher frequency. Serial won because clock skew limits parallel bus speed.
          </p>
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#f5f3ff', border: '1px solid #c4b5fd' }}>
          <h4 style={{ margin: '0 0 8px', color: '#6d28d9' }}>Encoding Overhead</h4>
          <p style={{ margin: 0, color: '#5b21b6', lineHeight: 1.7, fontSize: 14 }}>
            8b/10b encoding sends 10 bits per 8 data bits (20% overhead). 128b/130b sends 130 per 128 (1.5% overhead). PAM-4 sends 2 bits per symbol by using 4 voltage levels.
          </p>
        </div>
      </div>
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'Bus Arbitration', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>When multiple devices want the bus simultaneously, an <strong>arbiter</strong> decides who goes first.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'Priority-Based', desc: 'Fixed priority order. CPU > GPU > DMA > etc. Fast but lower-priority devices may starve.', color: '#3b82f6' },
            { name: 'Round-Robin', desc: 'Take turns in rotation. Fair but high-priority devices may wait unnecessarily.', color: '#22c55e' },
            { name: 'Daisy-Chain', desc: 'Grant signal passes through devices in a chain. Closest to arbiter has highest priority. Simple wiring.', color: '#f97316' },
            { name: 'Split Transaction', desc: 'Request and response are separate bus operations. Bus is free while device prepares data. Used in modern systems.', color: '#8b5cf6' },
          ].map(a => (
            <div key={a.name} style={{ padding: 12, borderRadius: 10, background: a.color + '08', border: '1px solid ' + a.color + '33' }}>
              <div style={{ fontWeight: 700, color: a.color, marginBottom: 4, fontSize: 14 }}>{a.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    )},
    { title: 'PCIe Architecture', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>PCIe is a <strong>packet-switched</strong> fabric, not a bus. Each link is a point-to-point connection through switches.</p>
        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#1e293b' }}>
            <div><strong>Transaction Layer:</strong> Read/write requests, completions, messages</div>
            <div><strong>Data Link Layer:</strong> CRC, sequence numbers, ACK/NAK, retry</div>
            <div><strong>Physical Layer:</strong> Encoding, lane bonding, equalization</div>
            <div style={{ marginTop: 8 }}>TLP (Transaction Layer Packet) = Header + Data + CRC</div>
            <div>Max payload: 128-4096 bytes (negotiated at link training)</div>
            <div style={{ marginTop: 8 }}>Root Complex (CPU) &rarr; Switch &rarr; Endpoints (devices)</div>
            <div>Each link independently negotiated: speed + width</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>PCIe uses credit-based flow control: the receiver tells the sender how much buffer space is available. No data is sent without credits, preventing buffer overflow.</p>
      </div>
    )},
    { title: 'Memory Bus & Channels', color: '#8b5cf6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>The memory bus is unique: it's still parallel (64 bits wide per channel) because latency matters more than raw bandwidth.</p>
        <div style={{ padding: 16, background: '#f5f3ff', borderRadius: 12, border: '1px solid #c4b5fd', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#4c1d95' }}>
            <div><strong>Channel:</strong> Independent 64-bit path to DRAM modules</div>
            <div><strong>Rank:</strong> Set of chips that respond together (front/back of DIMM)</div>
            <div><strong>Bank:</strong> Independent array within a chip (16-32 banks in DDR5)</div>
            <div><strong>Bank Group:</strong> Banks grouped for faster back-to-back access</div>
            <div style={{ marginTop: 8 }}>DDR5 key changes vs DDR4:</div>
            <div>- Two 32-bit subchannels per DIMM (instead of one 64-bit)</div>
            <div>- On-die ECC (corrects single-bit errors inside chip)</div>
            <div>- Decision feedback equalization (DFE) for signal integrity</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Dual-channel doubles bandwidth by interleaving addresses across two channels. Mismatched DIMMs fall back to single-channel, halving memory bandwidth.</p>
      </div>
    )},
    { title: 'Interconnect Fabrics', color: '#ef4444', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Modern CPUs use on-chip interconnect fabrics to connect cores, caches, memory controllers, and I/O.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'AMD Infinity Fabric', desc: 'Connects chiplets in Zen architecture. Scales from 8 to 128 cores. 32 bytes/cycle per link at ~1.8 GHz. Also connects CPU to GPU in APUs.', color: '#ef4444' },
            { name: 'Intel UPI', desc: 'Ultra Path Interconnect. Connects sockets in multi-CPU servers. 20.8 GT/s in Sapphire Rapids. Replaces QPI (Quick Path Interconnect).', color: '#3b82f6' },
            { name: 'ARM AMBA/CHI', desc: 'Coherent Hub Interface. On-chip mesh connecting Cortex cores and accelerators. Used in every smartphone SoC. Supports cache coherency across big.LITTLE.', color: '#22c55e' },
            { name: 'CXL (Compute Express Link)', desc: 'New standard over PCIe physical layer. Enables cache-coherent memory sharing between CPU, GPU, and accelerators. Key for AI/ML workloads.', color: '#8b5cf6' },
          ].map(f => (
            <div key={f.name} style={{ padding: 12, borderRadius: 10, background: f.color + '08', border: '1px solid ' + f.color + '33' }}>
              <div style={{ fontWeight: 700, color: f.color, marginBottom: 4, fontSize: 14 }}>{f.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>The trend: everything is becoming a network-on-chip (NoC). Modern CPUs are really networks of processing elements communicating via routers and switches.</p>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Bus & Interconnect Engineering</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>The technical details of how data moves between components.</p>
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

# === Bus bandwidth affects Python I/O ===
# Writing sequential vs random chunks demonstrates
# how bus utilization changes with access patterns

# Create test data
data = b'x' * (1024 * 1024)  # 1 MB

# Sequential write (bus-friendly: large contiguous transfers)
t0 = time.perf_counter()
with open('/tmp/seq_test', 'wb') as f:
    for _ in range(100):
        f.write(data)
f_time = time.perf_counter() - t0
os.remove('/tmp/seq_test')

# Many small writes (bus-unfriendly: per-write overhead)
small = b'x' * 1024  # 1 KB
t0 = time.perf_counter()
with open('/tmp/small_test', 'wb') as f:
    for _ in range(100 * 1024):
        f.write(small)
s_time = time.perf_counter() - t0
os.remove('/tmp/small_test')

print(f"100 x 1MB writes: {f_time*1000:.1f}ms")
print(f"102400 x 1KB writes: {s_time*1000:.1f}ms")
print(f"Same total data, small is {s_time/f_time:.1f}x slower")

# === Why? Bus transaction overhead ===
# Each I/O request = system call + bus transaction
# PCIe TLP header = 12-16 bytes overhead per packet
# 1KB payload with 16B header = 1.5% overhead
# 64B payload with 16B header = 20% overhead!

# === Python buffer sizes ===
import io
print(f"\\nDefault buffer: {io.DEFAULT_BUFFER_SIZE} bytes")
# Python buffers small writes into 8KB chunks
# to reduce bus transactions. This is why
# buffered I/O exists!

# === Memory bandwidth test ===
import array
n = 5_000_000
a = array.array('d', range(n))  # 40 MB of doubles

t0 = time.perf_counter()
total = sum(a)
mem_time = time.perf_counter() - t0
bw = (n * 8) / mem_time / 1e9  # GB/s
print(f"\\nMemory scan: {mem_time*1000:.1f}ms")
print(f"Effective bandwidth: {bw:.1f} GB/s")
print(f"DDR5 theoretical max: ~50 GB/s per channel")`}
      explanation="Bus bandwidth only matters if your software uses it efficiently. Large sequential transfers amortize per-transaction overhead (PCIe headers, system calls). Small random I/O wastes most of the bus capacity on overhead. Python's buffered I/O exists specifically to batch small writes into bus-efficient chunks."
      hardwareNote="Every read/write crosses multiple buses: CPU cache bus (256+ GB/s), memory bus (50 GB/s per channel), PCIe (32 GB/s for Gen 4 x16), SATA (600 MB/s). Python's sys.getsizeof() shows object sizes that determine memory bus pressure."
    />
  );
}

function Layer5() {
  const apps = [
    { icon: '\u{1F3AE}', title: 'GPU & PCIe Bottleneck',
      desc: 'GPUs need massive bandwidth. RTX 4090 has 1 TB/s internal bandwidth but only 32 GB/s from CPU via PCIe 4.0 x16.',
      detail: 'This 30:1 ratio means GPU computing works best when data stays on the GPU. Copying data CPU&harr;GPU is the #1 performance killer in ML training.' },
    { icon: '\u{1F4BE}', title: 'NVMe Revolution',
      desc: 'NVMe SSDs bypassed SATA entirely, connecting directly to PCIe. Samsung 990 Pro: 7,450 MB/s read (12x faster than SATA III limit).',
      detail: 'NVMe uses 64K command queues with 64K entries each vs SATA\'s single queue of 32 entries. Designed from scratch for flash storage parallelism.' },
    { icon: '\u{1F50C}', title: 'Thunderbolt & USB4',
      desc: 'Thunderbolt 4 tunnels PCIe + DisplayPort + USB over one cable at 40 Gbps. USB4 adopted the same approach. One cable, all protocols.',
      detail: 'Protocol tunneling multiplexes different traffic types over shared lanes. The bus negotiates bandwidth dynamically between video, data, and charging.' },
    { icon: '\u{1F5A5}\uFE0F', title: 'Chiplet Interconnects',
      desc: 'AMD Zen 4 uses chiplets connected by Infinity Fabric. Each chiplet is a separate die with its own L3 cache, connected at ~36 bytes/cycle.',
      detail: 'Cross-chiplet latency is ~40ns vs ~10ns within a chiplet. Software that is NUMA-aware (accesses memory near its core) runs 2-3x faster on chiplet CPUs.' },
    { icon: '\u{1F4F6}', title: 'Wi-Fi as Wireless Bus',
      desc: 'Wi-Fi is conceptually a shared bus — the radio medium. Only one station transmits at a time (CSMA/CA). Wi-Fi 6 added OFDMA for parallel access.',
      detail: 'The same arbitration problems exist wirelessly. Hidden node problem = two devices that can\'t hear each other collide. RTS/CTS solves it like bus arbitration.' },
    { icon: '\u{1F9EC}', title: 'CXL & The Future',
      desc: 'Compute Express Link enables cache-coherent shared memory between CPUs, GPUs, and accelerators. Built on PCIe physical layer.',
      detail: 'CXL Type 3 adds pooled memory: a rack of DRAM that any server can access coherently. Changes how data centers architect AI training clusters.' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Buses Shape System Design</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>Every system bottleneck traces back to a bus or interconnect limitation.</p>
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
        <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>BANDWIDTH HIERARCHY (2024)</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginTop: 16 }}>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#ef4444' }}>1 TB/s</div><div style={{ fontSize: 11, color: '#94a3b8' }}>GPU Internal (HBM3)</div></div>
          <div style={{ color: '#374151' }}>&gt;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#f97316' }}>200 GB/s</div><div style={{ fontSize: 11, color: '#94a3b8' }}>DDR5 (4 channel)</div></div>
          <div style={{ color: '#374151' }}>&gt;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#3b82f6' }}>64 GB/s</div><div style={{ fontSize: 11, color: '#94a3b8' }}>PCIe 5.0 x16</div></div>
          <div style={{ color: '#374151' }}>&gt;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e' }}>5 GB/s</div><div style={{ fontSize: 11, color: '#94a3b8' }}>USB4 / TB4</div></div>
          <div style={{ color: '#374151' }}>&gt;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#8b5cf6' }}>600 MB/s</div><div style={{ fontSize: 11, color: '#94a3b8' }}>SATA III</div></div>
        </div>
      </div>
    </div>
  );
}

export default function L11_BusArchitecture() {
  return (
    <LessonWrapper lessonId="L11" title="Bus Architecture"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'Highway vs Private Roads', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'Bus Standards', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'Arbitration & PCIe', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python I/O & Buses', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'Interconnect Evolution', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'Bandwidth Calc', description: 'PCIe 4.0 uses 128b/130b encoding at 16 GT/s per lane. What is the actual data bandwidth for x16?' },
        { id: 'c2', title: 'Bottleneck ID', description: 'A GPU with 1 TB/s internal bandwidth connects via PCIe 4.0 x16. What percentage of its bandwidth is accessible from the CPU?' },
        { id: 'c3', title: 'Channel Math', description: 'DDR5-6400 has 6400 MT/s per pin, 64 bits per channel. What is the bandwidth of a dual-channel configuration?' },
      ]}
    />
  );
}
