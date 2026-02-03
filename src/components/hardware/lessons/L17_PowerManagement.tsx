"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [voltage, setVoltage] = useState(1.0);
  const [frequency, setFrequency] = useState(3.0);
  const [coresActive, setCoresActive] = useState(4);
  const maxCores = 8;

  const dynamicPower = coresActive * 0.5 * voltage * voltage * frequency;
  const staticPower = coresActive * 2 + (maxCores - coresActive) * 0.1;
  const totalPower = dynamicPower + staticPower;
  const perfScore = coresActive * frequency * 0.9;
  const efficiency = perfScore / totalPower;

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>The Light Bulb Analogy</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        A CPU is like a room full of light bulbs. You can <strong>dim them</strong> (lower voltage), <strong>flash them slower</strong> (lower frequency), or <strong>turn some off</strong> (power gate cores). Each saves power differently.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        The key equation: <strong>Power = C × V² × f</strong>. Power scales with the <em>square</em> of voltage — halving voltage cuts power by 4×! This is why voltage scaling is the most powerful tool.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        Adjust the sliders to see how voltage, frequency, and active cores affect power and performance.
      </p>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 24, border: '1px solid #334155' }}>
        {/* Sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Voltage</div>
            <input type="range" min="0.5" max="1.4" step="0.05" value={voltage} onChange={e => setVoltage(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#ef4444' }} />
            <div style={{ fontSize: 20, fontWeight: 800, color: '#ef4444', textAlign: 'center', marginTop: 4 }}>{voltage.toFixed(2)}V</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Frequency</div>
            <input type="range" min="0.5" max="5.5" step="0.1" value={frequency} onChange={e => setFrequency(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#3b82f6' }} />
            <div style={{ fontSize: 20, fontWeight: 800, color: '#3b82f6', textAlign: 'center', marginTop: 4 }}>{frequency.toFixed(1)} GHz</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Active Cores</div>
            <input type="range" min="1" max={maxCores} step="1" value={coresActive} onChange={e => setCoresActive(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#22c55e' }} />
            <div style={{ fontSize: 20, fontWeight: 800, color: '#22c55e', textAlign: 'center', marginTop: 4 }}>{coresActive} / {maxCores}</div>
          </div>
        </div>

        {/* Core visualization */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
          {Array.from({ length: maxCores }).map((_, i) => (
            <motion.div key={i}
              animate={{
                background: i < coresActive ? `rgba(59,130,246,${0.3 + voltage * 0.5})` : '#1f2937',
                borderColor: i < coresActive ? '#3b82f6' : '#374151',
                scale: i < coresActive ? [1, 1.05, 1] : 1,
              }}
              transition={{ repeat: i < coresActive ? Infinity : 0, duration: 1 / frequency }}
              style={{ width: 48, height: 48, borderRadius: 10, border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: i < coresActive ? 'white' : '#475569' }}>
              {i < coresActive ? 'ON' : 'OFF'}
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'Dynamic Power', value: `${dynamicPower.toFixed(1)}W`, color: '#ef4444', sub: `C×V²×f = C×${voltage.toFixed(2)}²×${frequency.toFixed(1)}` },
            { label: 'Static Power', value: `${staticPower.toFixed(1)}W`, color: '#f97316', sub: 'Leakage (always on)' },
            { label: 'Total Power', value: `${totalPower.toFixed(1)}W`, color: '#8b5cf6', sub: 'Dynamic + Static' },
            { label: 'Efficiency', value: `${efficiency.toFixed(2)}`, color: '#22c55e', sub: 'Perf / Watt' },
          ].map(s => (
            <div key={s.label} style={{ padding: 12, borderRadius: 10, background: '#1f2937', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca' }}>
          <h4 style={{ margin: '0 0 8px', color: '#991b1b' }}>Dynamic Power (P = CV²f)</h4>
          <p style={{ margin: 0, color: '#b91c1c', lineHeight: 1.7, fontSize: 14 }}>
            Caused by transistors switching. Voltage dominates: reducing V from 1.0V to 0.7V cuts dynamic power by half. This is why undervolting is so effective.
          </p>
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#fff7ed', border: '1px solid #fed7aa' }}>
          <h4 style={{ margin: '0 0 8px', color: '#c2410c' }}>Static Power (Leakage)</h4>
          <p style={{ margin: 0, color: '#9a3412', lineHeight: 1.7, fontSize: 14 }}>
            Transistors leak current even when "off." Worse at smaller nodes (7nm, 5nm) and higher temperatures. At 3nm, leakage can be 30-50% of total power. Only solution: power gating (cutting supply voltage entirely).
          </p>
        </div>
      </div>
    </div>
  );
}

function Layer2() {
  const [selectedState, setSelectedState] = useState<'c' | 'p' | 't'>('c');

  const states = {
    c: {
      name: 'C-States (Idle Power)',
      color: '#3b82f6',
      desc: 'CPU idle states progressively shut down more hardware to save power. Deeper states save more but take longer to wake.',
      items: [
        { state: 'C0', name: 'Active', power: '100%', wakeup: '0 ns', desc: 'CPU actively executing instructions. Full power.', active: true },
        { state: 'C1', name: 'Halt', power: '70%', wakeup: '~1 \u00B5s', desc: 'Clock stopped to core. Registers preserved. Instant resume on interrupt.', active: false },
        { state: 'C3', name: 'Sleep', power: '20%', wakeup: '~50 \u00B5s', desc: 'L1/L2 caches flushed. Core clock and PLL off. Must refill caches on wake.', active: false },
        { state: 'C6', name: 'Deep Sleep', power: '~5%', wakeup: '~100 \u00B5s', desc: 'Core voltage reduced to near zero. Register state saved to special SRAM. Almost off.', active: false },
        { state: 'C8', name: 'Package Sleep', power: '~1%', wakeup: '~1 ms', desc: 'L3 cache flushed. Package-level power gating. Only wake logic powered. Mobile phone deep sleep.', active: false },
        { state: 'C10', name: 'Off', power: '~0.1%', wakeup: '~10 ms', desc: 'Everything off except real-time clock and wake-on-LAN. Modern standby (S0ix).', active: false },
      ],
    },
    p: {
      name: 'P-States (Active Power)',
      color: '#22c55e',
      desc: 'Performance states adjust voltage and frequency while the CPU is working. DVFS (Dynamic Voltage and Frequency Scaling) in action.',
      items: [
        { state: 'P0', name: 'Turbo Boost', power: '100%+', wakeup: 'N/A', desc: 'Above base clock. 5+ GHz. Time-limited by thermal budget. Only 1-2 cores.', active: true },
        { state: 'P1', name: 'Base Clock', power: '100%', wakeup: 'N/A', desc: 'Guaranteed all-core frequency. The rated speed (e.g., 3.4 GHz). Sustainable.', active: false },
        { state: 'P2', name: 'Reduced', power: '70%', wakeup: 'N/A', desc: 'Lower V and f. Still responsive. Used for moderate workloads.', active: false },
        { state: 'Pn', name: 'Minimum', power: '30%', wakeup: 'N/A', desc: 'Lowest active voltage/frequency. ~800 MHz. Background tasks, idle loops.', active: false },
      ],
    },
    t: {
      name: 'T-States (Thermal Throttling)',
      color: '#ef4444',
      desc: 'Emergency power reduction when temperature exceeds safe limits. Duty-cycling and clock reduction to prevent damage.',
      items: [
        { state: 'T0', name: 'No Throttle', power: '100%', wakeup: 'N/A', desc: 'Normal operation. Temperature within limits.', active: true },
        { state: 'T1', name: 'Light Throttle', power: '87.5%', wakeup: 'N/A', desc: 'CPU runs 7 of every 8 clock cycles. 12.5% performance reduction.', active: false },
        { state: 'T4', name: 'Heavy Throttle', power: '50%', wakeup: 'N/A', desc: 'CPU runs 4 of every 8 cycles. Half performance. System feels sluggish.', active: false },
        { state: 'T7', name: 'Maximum Throttle', power: '12.5%', wakeup: 'N/A', desc: 'CPU runs 1 of every 8 cycles. Emergency-only. System barely usable.', active: false },
        { state: 'PROCHOT', name: 'Shutdown', power: '0%', wakeup: 'N/A', desc: 'Temperature critical (105°C+). CPU halts or system shuts down to prevent physical damage.', active: false },
      ],
    },
  };

  const section = states[selectedState];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Power States Explained</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24, fontSize: 16 }}>
        CPUs have dozens of power states for different scenarios: idle, active, and thermal emergency. Understanding these states explains why your laptop's battery life varies so much.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(Object.keys(states) as Array<keyof typeof states>).map(key => (
          <motion.button key={key} whileHover={{ scale: 1.05 }} onClick={() => setSelectedState(key)}
            style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: selectedState === key ? states[key].color : '#f1f5f9', color: selectedState === key ? 'white' : '#334155', fontWeight: 700, fontSize: 13 }}>
            {states[key].name}
          </motion.button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 8px', color: section.color, fontSize: 20, fontWeight: 700 }}>{section.name}</h3>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 20, fontSize: 14 }}>{section.desc}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {section.items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: item.active ? section.color + '0a' : '#f8fafc', border: '1px solid ' + (item.active ? section.color + '33' : '#e2e8f0') }}>
              <div style={{ width: 50, fontFamily: 'monospace', fontWeight: 800, color: section.color, fontSize: 14, flexShrink: 0 }}>{item.state}</div>
              <div style={{ width: 100, fontWeight: 700, color: '#1e293b', fontSize: 13, flexShrink: 0 }}>{item.name}</div>
              <div style={{ width: 60, fontSize: 12, fontWeight: 700, color: '#64748b', flexShrink: 0 }}>{item.power}</div>
              {item.wakeup !== 'N/A' && <div style={{ width: 70, fontSize: 12, color: '#94a3b8', flexShrink: 0 }}>{item.wakeup}</div>}
              <div style={{ flex: 1, fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ padding: 20, borderRadius: 12, background: '#f5f3ff', border: '1px solid #c4b5fd' }}>
        <h4 style={{ margin: '0 0 8px', color: '#6d28d9' }}>The Race-to-Sleep Strategy</h4>
        <p style={{ margin: 0, color: '#5b21b6', lineHeight: 1.7, fontSize: 14 }}>
          Counterintuitively, running at maximum speed and then sleeping deeply uses less energy than running slowly all the time. A task that takes 100ms at full speed + 900ms in C6 uses less energy than the same task running at half speed for 200ms + 800ms in C3. Modern OS schedulers use this "race to sleep" strategy.
        </p>
      </div>
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'DVFS & Voltage Regulators', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Dynamic Voltage and Frequency Scaling is the primary power control mechanism. Modern CPUs adjust voltage thousands of times per second.</p>
        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#1e293b' }}>
            <div><strong>Voltage Regulators (VRM):</strong></div>
            <div>FIVR (Fully Integrated VR): on-die, fastest response</div>
            <div>  Intel since Haswell. Microsecond-scale transitions.</div>
            <div>External VRM: on motherboard, cheaper but slower</div>
            <div>  Millisecond transitions. AMD uses external VRM.</div>
            <div style={{ marginTop: 8 }}><strong>Voltage-Frequency Curve:</strong></div>
            <div>Each frequency requires a minimum voltage to be stable</div>
            <div>Higher voltage = faster switching but quadratic power</div>
            <div>"Silicon lottery": some chips run stable at lower V</div>
            <div>Undervolting: running below stock V for same f = free power savings</div>
            <div style={{ marginTop: 8 }}><strong>Per-Core DVFS (modern):</strong></div>
            <div>Each core has independent voltage and frequency</div>
            <div>One core at 5 GHz (turbo), others at 2 GHz (idle)</div>
            <div>Apple M-series: per-cluster DVFS (P-cores vs E-cores)</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Intel Speed Shift (HWP) lets the CPU hardware adjust P-states in ~1ms without OS involvement. The OS sets policy (performance vs balanced vs power saver), and the CPU's power management unit makes real-time decisions 1000x faster than the OS scheduler could.</p>
      </div>
    )},
    { title: 'Power Gating & Dark Silicon', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>At small process nodes, leakage power is so high that not all transistors can be powered simultaneously. This is the <strong>dark silicon</strong> problem.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'Clock Gating', desc: 'Stop the clock to unused logic blocks. Eliminates dynamic power but leakage continues. Cheapest form of power reduction. ~30% power savings.', color: '#3b82f6' },
            { name: 'Power Gating', desc: 'Cut supply voltage entirely with sleep transistors. Eliminates both dynamic and static power. Takes ~10 \u00B5s to power back on (charge retention SRAM saves state).', color: '#22c55e' },
            { name: 'Dark Silicon', desc: 'At 7nm, only ~30-50% of transistors can be active simultaneously within power budget. The rest must be "dark." Enables heterogeneous designs: GPU, NPU, video decode.', color: '#f97316' },
            { name: 'Heterogeneous Compute', desc: 'Solution to dark silicon: build specialized blocks. CPU, GPU, NPU, ISP, modem — only the needed block is powered. Apple M3 has 25B transistors but rarely uses all simultaneously.', color: '#8b5cf6' },
          ].map(g => (
            <div key={g.name} style={{ padding: 12, borderRadius: 10, background: g.color + '08', border: '1px solid ' + g.color + '33' }}>
              <div style={{ fontWeight: 700, color: g.color, marginBottom: 4, fontSize: 14 }}>{g.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{g.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Dark silicon turned from a problem into an opportunity: since you can't power all transistors, fill the die with specialized accelerators. Each lights up only when needed. This is why modern SoCs have neural engines, video encoders, and crypto accelerators.</p>
      </div>
    )},
    { title: 'Thermal Management', color: '#ef4444', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Heat removal is the ultimate limit on CPU performance. Every watt of power becomes a watt of heat.</p>
        <div style={{ padding: 16, background: '#fef2f2', borderRadius: 12, border: '1px solid #fecaca', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#991b1b' }}>
            <div><strong>TDP (Thermal Design Power):</strong></div>
            <div>NOT maximum power — it's the sustained thermal load</div>
            <div>the cooler must handle. Actual peak power can be 2x TDP.</div>
            <div>i9-14900K: 125W TDP, but draws 253W at max turbo</div>
            <div style={{ marginTop: 8 }}><strong>Cooling hierarchy:</strong></div>
            <div>Die → Thermal paste → IHS → Thermal paste → Heatsink → Fan → Air</div>
            <div>Each interface adds thermal resistance (°C/W)</div>
            <div>Liquid cooling: ~0.05 °C/W. Air cooling: ~0.15 °C/W.</div>
            <div>Direct-die liquid cooling: removes IHS for best contact</div>
            <div style={{ marginTop: 8 }}><strong>Thermal throttling cascade:</strong></div>
            <div>85°C: Turbo boost reduced (fewer boosting cores)</div>
            <div>95°C: Frequency steps down (PROCHOT asserted)</div>
            <div>100°C: Aggressive throttling (duty cycling)</div>
            <div>105°C: Emergency shutdown to prevent damage</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Data centers spend nearly as much on cooling as on compute. Google, Microsoft, and AWS use evaporative cooling, liquid cooling, and even underwater servers to manage heat. Power Usage Effectiveness (PUE) measures total facility power vs IT equipment power — best data centers achieve PUE ~1.1.</p>
      </div>
    )},
    { title: 'Mobile & Embedded Power', color: '#8b5cf6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Mobile devices operate under extreme power constraints: 3-5W sustained, from a battery that stores ~15Wh.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'big.LITTLE (ARM)', desc: 'High-performance cores (Cortex-X4, 3.4 GHz, 2W each) + efficiency cores (Cortex-A520, 2 GHz, 0.1W each). OS migrates threads to match workload. 80% of tasks run on E-cores.', color: '#22c55e' },
            { name: 'Apple Unified Memory', desc: 'CPU, GPU, NPU share one memory pool. No CPU↔GPU copies. Saves power proportional to data movement. 200 GB/s bandwidth at 10W — impossible with discrete GPU.', color: '#3b82f6' },
            { name: 'Coprocessor Strategy', desc: 'Always-on low-power cores handle sensors, motion, audio. Apple\'s Always-On Display uses a tiny co-processor at ~10mW. Main CPU stays in C10 deep sleep.', color: '#f97316' },
            { name: 'Display Power', desc: 'The display uses 30-50% of total phone power. OLED: per-pixel power (dark mode saves 40%). LTPO: 1-120 Hz adaptive refresh. Always-on display: 10-20mW.', color: '#8b5cf6' },
          ].map(m => (
            <div key={m.name} style={{ padding: 12, borderRadius: 10, background: m.color + '08', border: '1px solid ' + m.color + '33' }}>
              <div style={{ fontWeight: 700, color: m.color, marginBottom: 4, fontSize: 14 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{m.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>A smartphone achieves more compute per watt than any desktop: Apple A17 Pro delivers 2 TFLOPS at 5W. The secret is extreme specialization — dedicated hardware for every common task, with the CPU as a general-purpose fallback.</p>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Power Engineering</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>The physics and engineering of keeping CPUs cool and efficient.</p>
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
      code={`import time, os, sys

# === Python's power impact ===
# Every Python instruction uses CPU cycles = power

# Busy loop: CPU stays at max frequency, max power
print("=== CPU Power States & Python ===")
print()

# Demonstrate work vs idle power impact
print("1. Busy work (CPU stays in C0/P0, max power):")
t0 = time.perf_counter()
total = 0
for i in range(2_000_000):
    total += i * i
busy_time = time.perf_counter() - t0
print(f"   2M iterations: {busy_time*1000:.1f}ms")
print(f"   CPU was in C0 (active) the entire time")
print()

# Sleep: CPU can enter deep C-states
print("2. Sleep (CPU drops to C6+, minimal power):")
t0 = time.perf_counter()
time.sleep(0.1)  # 100ms sleep
sleep_time = time.perf_counter() - t0
print(f"   Slept for: {sleep_time*1000:.1f}ms")
print(f"   CPU was in C3-C6 (near zero power)")
print()

# === Real power implications ===
print("=== Python Power Optimization Tips ===")
tips = [
    ("Use time.sleep() in loops",
     "Polling with while True: pass burns 100% CPU.\\n"
     "   while True: time.sleep(0.01) uses ~1% CPU."),
    ("Batch operations (NumPy)",
     "1M Python additions: ~200ms at full power.\\n"
     "   NumPy vectorized: ~2ms then CPU sleeps 198ms."),
    ("Async I/O over threading",
     "Threads waiting on I/O still wake CPU periodically.\\n"
     "   asyncio/epoll lets CPU sleep until data arrives."),
    ("Avoid busy-waiting",
     "queue.get(timeout=1) sleeps. Spinning wastes power.\\n"
     "   Event-driven > polling for battery life."),
]
for title, detail in tips:
    print(f"• {title}")
    print(f"   {detail}")
    print()

# === System power info ===
print("=== System Info ===")
print(f"Python version: {sys.version.split()[0]}")
print(f"Platform: {sys.platform}")
try:
    cpu_count = os.cpu_count()
    print(f"CPU cores: {cpu_count}")
    print(f"Each idle core: ~0.1W (C6)")
    print(f"Each active core: ~5-15W (C0/P0)")
    print(f"Total idle: ~{cpu_count * 0.1:.1f}W")
    print(f"Total busy: ~{cpu_count * 10:.0f}W")
except:
    pass`}
      explanation="Python code directly affects CPU power states. A busy loop keeps the CPU at maximum voltage and frequency (C0/P0 state, 10-15W per core). A time.sleep() call lets the CPU enter C6 deep sleep (0.1W per core). NumPy batches work into short bursts followed by sleep — the 'race to sleep' strategy. For battery-powered devices, this difference is dramatic."
      hardwareNote="CPython's GIL actually helps power efficiency in an unexpected way: only one thread runs at a time, so other cores stay in deep sleep states. A multi-threaded C program might wake all cores. However, this 'power advantage' comes at the cost of parallelism — you're trading performance for lower power consumption."
    />
  );
}

function Layer5() {
  const apps = [
    { icon: '\u{1F4F1}', title: 'Smartphone Power Budget',
      desc: 'iPhone 15 Pro: 3274 mAh battery (~12.5 Wh). A17 Pro TDP ~5W. At full load: ~2.5 hours. Screen + modem + CPU together: ~3W average for 8-10 hour battery life.',
      detail: 'Apple\'s power management is arguably their biggest competitive advantage. The A17 Pro has dedicated hardware for video decode (0.5W vs 3W software), ML inference (NPU at 1W vs CPU at 5W), and always-on display (10mW co-processor).' },
    { icon: '\u{1F3E2}', title: 'Data Center Efficiency',
      desc: 'Google\'s data centers use ~12.7 TWh/year (more than some countries). PUE of 1.1 means only 10% goes to cooling. ML training is the fastest-growing power consumer.',
      detail: 'A single GPT-4 training run consumed an estimated 50+ GWh — equivalent to 5,000 US homes for a year. Inference is growing even faster: every ChatGPT query uses ~10x the power of a Google search.' },
    { icon: '\u2744\uFE0F', title: 'Extreme Cooling',
      desc: 'Liquid nitrogen overclocking reaches -196°C and 8+ GHz. Immersion cooling submerges servers in non-conductive fluid. Microsoft tested underwater data centers.',
      detail: 'Superconducting computers at near-absolute-zero could eliminate resistance entirely. DARPA\'s cryogenic computing program targets 10,000x energy efficiency. Currently impractical — the cooling itself uses more power than it saves.' },
    { icon: '\u26A1', title: 'AMD vs Intel Power Wars',
      desc: 'AMD Zen 4: 170W TDP for 16 cores. Intel 14th Gen: 253W peak for 24 cores. Apple M3 Max: 40W for 16 cores. ARM efficiency dominates.',
      detail: 'Apple achieves 3-4x perf/watt vs x86 through: integrated design (SoC vs discrete), unified memory (no CPU↔GPU copies), specialized accelerators, and ARM\'s simpler decode. x86 tax: ~25% of die area is instruction decode.' },
    { icon: '\u{1F30D}', title: 'Environmental Impact',
      desc: 'Global data centers: ~1-2% of world electricity. AI training growing at 4-5x per year. Bitcoin mining: ~150 TWh/year. Semiconductor manufacturing: water-intensive.',
      detail: 'A single TSMC 5nm fab uses 150,000 tons of water per day. The embodied energy in manufacturing a chip (mining silicon, lithography, packaging) can exceed its lifetime operational energy for short-lived devices.' },
    { icon: '\u{1F50B}', title: 'Future: Near-Threshold Computing',
      desc: 'Operating transistors at near-threshold voltage (~0.3V vs ~0.8V) reduces power by 10x at the cost of 5x slower speed. Ideal for always-on IoT.',
      detail: 'Near-threshold voltage computing works because P = CV²f: at 0.3V instead of 0.9V, dynamic power drops 9x. Combined with lower frequency, total power drops 30-50x. Research chips achieve sub-milliwatt operation for sensor nodes.' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Power Defines Modern Computing</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>The end of Dennard scaling means power efficiency is now the primary design constraint, not raw speed.</p>
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
        <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>POWER EFFICIENCY EVOLUTION (perf/watt)</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginTop: 16 }}>
          <div><div style={{ fontSize: 16, fontWeight: 800, color: '#ef4444' }}>1990s</div><div style={{ fontSize: 11, color: '#94a3b8' }}>Dennard Scaling</div><div style={{ fontSize: 10, color: '#64748b' }}>V drops with size</div></div>
          <div style={{ fontSize: 14, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 16, fontWeight: 800, color: '#f97316' }}>2006</div><div style={{ fontSize: 11, color: '#94a3b8' }}>Power Wall</div><div style={{ fontSize: 10, color: '#64748b' }}>Pentium 4 cancelled</div></div>
          <div style={{ fontSize: 14, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 16, fontWeight: 800, color: '#3b82f6' }}>2015</div><div style={{ fontSize: 11, color: '#94a3b8' }}>Multi-Core Era</div><div style={{ fontSize: 10, color: '#64748b' }}>More cores, not faster</div></div>
          <div style={{ fontSize: 14, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 16, fontWeight: 800, color: '#22c55e' }}>2020+</div><div style={{ fontSize: 11, color: '#94a3b8' }}>Heterogeneous</div><div style={{ fontSize: 10, color: '#64748b' }}>Right core for right job</div></div>
        </div>
      </div>
    </div>
  );
}

export default function L17_PowerManagement() {
  return (
    <LessonWrapper lessonId="L17" title="Power Management"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'Light Bulb Dimming', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'C/P/T Power States', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'DVFS & Thermal', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python Power Impact', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'Power Rules Everything', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'Voltage Scaling', description: 'A CPU runs at 1.2V/4GHz drawing 100W dynamic power. If you reduce to 0.9V/3GHz, what is the new dynamic power? (P=CV²f)' },
        { id: 'c2', title: 'Battery Life', description: 'A laptop has a 60Wh battery. CPU: 15W, screen: 5W, SSD: 2W, other: 3W. What is the battery life? How does reducing CPU to 5W (C-states) change it?' },
        { id: 'c3', title: 'Race to Sleep', description: 'Task A: run at 3GHz for 10ms then sleep 90ms. Task B: run at 1GHz for 30ms then sleep 70ms. Both complete in 100ms. Which uses less energy and why?' },
      ]}
    />
  );
}
