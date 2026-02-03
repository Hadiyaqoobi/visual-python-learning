"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const levels = [
    { name: 'Registers', size: '~1 KB', speed: '< 1 ns', color: '#ef4444', width: 100 },
    { name: 'L1 Cache', size: '64 KB', speed: '~1 ns', color: '#f97316', width: 160 },
    { name: 'L2 Cache', size: '256 KB', speed: '~4 ns', color: '#eab308', width: 220 },
    { name: 'L3 Cache', size: '8 MB', speed: '~10 ns', color: '#22c55e', width: 280 },
    { name: 'RAM', size: '16 GB', speed: '~100 ns', color: '#3b82f6', width: 340 },
    { name: 'SSD', size: '1 TB', speed: '~100 μs', color: '#8b5cf6', width: 400 },
  ];
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>The Memory Pyramid</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 24 }}>
        Fast memory is tiny and expensive. Slow memory is huge and cheap. Computers use a <strong>hierarchy</strong> — keep frequently-used data close and fast.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        {levels.map((l, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
            style={{ width: l.width, padding: '10px 16px', borderRadius: 8, background: l.color, color: 'white',
              display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>
            <span>{l.name}</span>
            <span>{l.size} · {l.speed}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Layer2() {
  const [accessCount, setAccessCount] = useState({ reg: 0, l1: 0, ram: 0 });
  const simulate = () => {
    const r = Math.random();
    if (r < 0.7) setAccessCount(p => ({ ...p, reg: p.reg + 1 }));
    else if (r < 0.95) setAccessCount(p => ({ ...p, l1: p.l1 + 1 }));
    else setAccessCount(p => ({ ...p, ram: p.ram + 1 }));
  };
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>Memory Access Simulator</h2>
      <p style={{ color: '#475569', marginBottom: 24 }}>Click to simulate memory accesses. Most hit cache thanks to locality.</p>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => { for (let i = 0; i < 10; i++) simulate(); }}
          style={{ padding: '12px 32px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: '#3b82f6', color: 'white', fontSize: 16, fontWeight: 700 }}>
          Simulate 10 Accesses
        </motion.button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
        {[
          { name: 'Register', count: accessCount.reg, color: '#ef4444', pct: '70%' },
          { name: 'L1 Cache', count: accessCount.l1, color: '#f97316', pct: '25%' },
          { name: 'RAM (slow)', count: accessCount.ram, color: '#3b82f6', pct: '5%' },
        ].map(m => (
          <div key={m.name} style={{ textAlign: 'center', padding: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', minWidth: 120 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: m.color }}>{m.count}</div>
            <div style={{ fontWeight: 600, color: '#334155' }}>{m.name}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>~{m.pct} of accesses</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Layer3() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>Why Hierarchy Works</h2>
      {[
        { step: 1, title: 'Temporal Locality', desc: 'Data accessed recently will likely be accessed again soon. Keep it in cache.' },
        { step: 2, title: 'Spatial Locality', desc: 'Data near recently accessed data will likely be needed. Fetch whole cache lines (64 bytes).' },
        { step: 3, title: 'Cache Lines', desc: 'Memory is fetched in 64-byte blocks. Accessing one byte loads 63 neighbors for free.' },
        { step: 4, title: 'The Speed Gap', desc: 'RAM is 100x slower than L1 cache. Disk is 100,000x slower. The hierarchy bridges this gap.' },
      ].map(s => (
        <div key={s.step} style={{ display: 'flex', gap: 16, marginBottom: 14, padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#22c55e', display: 'flex',
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
      code={`# Cache-friendly vs cache-unfriendly code

# GOOD: Sequential access (spatial locality)
data = list(range(10000))
total = sum(data)  # Accesses memory in order

# BAD: Random access (cache misses)
import random
indices = list(range(10000))
random.shuffle(indices)
total = sum(data[i] for i in indices)  # Random jumps

# GOOD: Reuse variables (temporal locality)
for i in range(1000):
    x = x + 1  # x stays in register/L1

# BAD: Touch too much data
for i in range(1000):
    big_array[i] += big_array[i + 10000]  # Cache thrashing`}
      explanation="Writing cache-friendly code can be 10-100x faster. Sequential access and reusing variables keeps data in fast cache instead of slow RAM."
      hardwareNote="L1 cache hit: 1ns. RAM access: 100ns. Your code's memory access pattern directly determines performance."
    />
  );
}

function Layer5() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>Memory Hierarchy Everywhere</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {[
          { icon: '🌐', title: 'Web Caching', desc: 'CDNs, browser cache, DNS cache — the same hierarchy principle applied to the internet.' },
          { icon: '📱', title: 'Phone Storage', desc: 'Your phone has registers, L1/L2 cache, RAM, flash storage — identical hierarchy.' },
          { icon: '🗄️', title: 'Databases', desc: 'Buffer pools, query caches, disk storage — databases mirror the hardware hierarchy.' },
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

export default function L08_MemoryHierarchy() {
  return (
    <LessonWrapper lessonId="l08" title="Memory Hierarchy"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'The Pyramid', icon: '🏔️', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'Access Simulator', icon: '🎮', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'Locality Principles', icon: '📐', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Cache-Friendly Code', icon: '🐍', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'Applications', icon: '🌍', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'Speed Ratio', description: 'How many L1 accesses happen in the time of 1 RAM access?' },
        { id: 'c2', title: 'Locality Type', description: 'Is a for-loop over an array temporal or spatial locality?' },
      ]}
    />
  );
}
