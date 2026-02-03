"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [events, setEvents] = useState<Array<{ type: string; time: number; color: string; handled: boolean }>>([]);
  const [cpuTask, setCpuTask] = useState('Working...');
  const [cpuColor, setCpuColor] = useState('#3b82f6');
  const [progress, setProgress] = useState(0);
  const [handling, setHandling] = useState(false);

  const interruptSources = [
    { name: 'Keyboard', emoji: '\u2328\uFE0F', color: '#3b82f6', desc: 'Key pressed' },
    { name: 'Timer', emoji: '\u23F0', color: '#f97316', desc: 'Tick (10ms)' },
    { name: 'Network', emoji: '\u{1F4E1}', color: '#22c55e', desc: 'Packet arrived' },
    { name: 'Disk', emoji: '\u{1F4BE}', color: '#8b5cf6', desc: 'Read complete' },
    { name: 'GPU', emoji: '\u{1F3AE}', color: '#ef4444', desc: 'Frame done' },
  ];

  useEffect(() => {
    if (handling) return;
    const t = setInterval(() => setProgress(p => Math.min(p + 2, 100)), 100);
    return () => clearInterval(t);
  }, [handling]);

  const fireInterrupt = (source: typeof interruptSources[0]) => {
    if (handling) return;
    setHandling(true);
    setCpuTask('Handling: ' + source.name + ' IRQ');
    setCpuColor(source.color);
    setEvents(prev => [...prev.slice(-9), { type: source.name, time: Date.now(), color: source.color, handled: false }]);

    setTimeout(() => {
      setEvents(prev => prev.map((e, i) => i === prev.length - 1 ? { ...e, handled: true } : e));
      setCpuTask('Resuming work...');
      setCpuColor('#22c55e');
      setTimeout(() => {
        setCpuTask('Working...');
        setCpuColor('#3b82f6');
        setHandling(false);
      }, 400);
    }, 800);
  };

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>The Doorbell Analogy</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        You're reading a book (the CPU's main task). The doorbell rings — an <strong>interrupt</strong>. You bookmark your page (save CPU state), answer the door (handle the interrupt), then return to reading exactly where you left off (restore state).
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        Without interrupts, the CPU would have to constantly check every device: "Any keys pressed? Any packets? Any disk data?" — wasting enormous time. Interrupts let the CPU focus on work until something <strong>actually needs attention</strong>.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        Click the devices below to fire interrupts. Watch the CPU pause its work, handle the interrupt, then resume.
      </p>

      {/* CPU state */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 24, border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>CPU Status</div>
            <motion.div animate={{ color: cpuColor }} style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{cpuTask}</motion.div>
          </div>
          <div style={{ width: 200 }}>
            <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>Main Task Progress</div>
            <div style={{ height: 8, borderRadius: 4, background: '#1f2937' }}>
              <motion.div animate={{ width: progress + '%' }} style={{ height: '100%', borderRadius: 4, background: handling ? '#ef4444' : '#3b82f6' }} />
            </div>
          </div>
        </div>

        {/* Interrupt sources */}
        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>Click a device to fire an interrupt:</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {interruptSources.map(src => (
            <motion.button key={src.name} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => fireInterrupt(src)}
              style={{ padding: '12px 18px', borderRadius: 12, border: '2px solid ' + src.color, background: '#1f2937', color: 'white', cursor: handling ? 'not-allowed' : 'pointer', opacity: handling ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
              <span style={{ fontSize: 20 }}>{src.emoji}</span>
              <div>
                <div>{src.name}</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>{src.desc}</div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Event log */}
        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>Interrupt Log:</div>
        <div style={{ minHeight: 60, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {events.length === 0 && <div style={{ color: '#475569', fontSize: 12, fontStyle: 'italic' }}>No interrupts yet — click a device above</div>}
          {events.map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              style={{ padding: '6px 12px', borderRadius: 8, background: e.color + '22', border: '1px solid ' + e.color + '44', fontSize: 11, color: e.color, fontWeight: 600 }}>
              {e.type} {e.handled ? '\u2713' : '\u23F3'}
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div style={{ padding: 16, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <h4 style={{ margin: '0 0 6px', color: '#1d4ed8', fontSize: 14 }}>1. Save State</h4>
          <p style={{ margin: 0, color: '#1e40af', lineHeight: 1.7, fontSize: 13 }}>CPU pushes registers and program counter onto the stack. Exactly like bookmarking your page.</p>
        </div>
        <div style={{ padding: 16, borderRadius: 12, background: '#fff7ed', border: '1px solid #fed7aa' }}>
          <h4 style={{ margin: '0 0 6px', color: '#c2410c', fontSize: 14 }}>2. Handle IRQ</h4>
          <p style={{ margin: 0, color: '#9a3412', lineHeight: 1.7, fontSize: 13 }}>Jump to the interrupt handler (ISR). Read device status, copy data, acknowledge the interrupt.</p>
        </div>
        <div style={{ padding: 16, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 6px', color: '#166534', fontSize: 14 }}>3. Restore & Resume</h4>
          <p style={{ margin: 0, color: '#15803d', lineHeight: 1.7, fontSize: 13 }}>Pop registers from stack, restore program counter. Continue exactly where you left off.</p>
        </div>
      </div>
    </div>
  );
}

function Layer2() {
  const [selectedIRQ, setSelectedIRQ] = useState(0);
  const [nestingDemo, setNestingDemo] = useState(false);
  const [nestLevel, setNestLevel] = useState(0);
  const [nestRunning, setNestRunning] = useState(false);

  const irqTable = [
    { irq: 0, device: 'System Timer', type: 'Edge', priority: 'Highest', freq: '100-1000 Hz', desc: 'Drives the OS scheduler. Every tick, the kernel checks if the current process has used its time slice.' },
    { irq: 1, device: 'Keyboard (PS/2)', type: 'Edge', priority: 'High', freq: 'On keypress', desc: 'Fires on every key press and release. The handler reads the scancode from port 0x60.' },
    { irq: 8, device: 'Real-Time Clock', type: 'Edge', priority: 'Medium', freq: '2-8192 Hz', desc: 'Programmable periodic interrupt. Used for high-resolution timers and watchdog functions.' },
    { irq: 11, device: 'USB Controller', type: 'Level', priority: 'Medium', freq: 'On transfer', desc: 'Shared among USB devices. Level-triggered: stays asserted until all sharing devices are serviced.' },
    { irq: 14, device: 'Primary IDE/SATA', type: 'Edge', priority: 'Medium', freq: 'On I/O complete', desc: 'Fires when a disk read/write completes. The handler moves data from the controller buffer.' },
    { irq: 'MSI', device: 'PCIe Device (MSI-X)', type: 'Message', priority: 'Configurable', freq: 'Variable', desc: 'Modern devices write a message to a specific memory address instead of asserting a wire. No sharing, no routing issues.' },
  ];

  const selected = irqTable[selectedIRQ];

  useEffect(() => {
    if (!nestRunning) return;
    if (nestLevel >= 3) { setNestRunning(false); return; }
    const t = setTimeout(() => setNestLevel(n => n + 1), 1000);
    return () => clearTimeout(t);
  }, [nestRunning, nestLevel]);

  const nestColors = ['#3b82f6', '#f97316', '#ef4444', '#22c55e'];
  const nestLabels = ['Main Program', 'Timer IRQ (priority 0)', 'Network IRQ (priority 1)', 'Returning...'];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Interrupt Vector Table & Priorities</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24, fontSize: 16 }}>
        Each interrupt has a number (vector) that indexes into the <strong>Interrupt Descriptor Table (IDT)</strong>. The IDT maps each vector to its handler function. Explore how different devices use different interrupt types and priorities.
      </p>

      {/* IRQ Table */}
      <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 12 }}>Interrupt Descriptor Table (click a row):</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#64748b' }}>IRQ</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#64748b' }}>Device</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#64748b' }}>Trigger</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#64748b' }}>Priority</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#64748b' }}>Frequency</th>
              </tr>
            </thead>
            <tbody>
              {irqTable.map((row, i) => (
                <tr key={i} onClick={() => setSelectedIRQ(i)}
                  style={{ borderBottom: '1px solid #f1f5f9', background: selectedIRQ === i ? '#eff6ff' : 'transparent', cursor: 'pointer' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#1e293b', fontFamily: 'monospace' }}>{row.irq}</td>
                  <td style={{ padding: '10px 12px', color: '#1e293b', fontWeight: 600 }}>{row.device}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, background: row.type === 'Edge' ? '#dbeafe' : row.type === 'Level' ? '#fef3c7' : '#e0e7ff', color: row.type === 'Edge' ? '#1d4ed8' : row.type === 'Level' ? '#92400e' : '#4338ca', fontSize: 11, fontWeight: 600 }}>{row.type}</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#475569' }}>{row.priority}</td>
                  <td style={{ padding: '10px 12px', color: '#64748b', fontSize: 12 }}>{row.freq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={selectedIRQ}
            style={{ marginTop: 16, padding: 16, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{selected.device}</div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{selected.desc}</div>
          </motion.div>
        )}
      </div>

      {/* Interrupt nesting demo */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 16, padding: 24, border: '1px solid #334155', marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', marginBottom: 16 }}>Interrupt Nesting (Higher Priority Preempts)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {nestLabels.map((label, i) => (
            <motion.div key={i}
              animate={{ opacity: nestLevel >= i ? 1 : 0.2, x: i * 24 }}
              style={{ padding: '10px 16px', borderRadius: 8, background: nestLevel >= i ? nestColors[i] : '#1f2937', color: 'white', fontSize: 13, fontWeight: 600, border: nestLevel === i ? '2px solid white' : '1px solid transparent' }}>
              {'  '.repeat(i)}{i > 0 ? '\u21B3 ' : ''}{label}
            </motion.div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
          A higher-priority interrupt can interrupt a lower-priority handler. The CPU saves state again, creating a nested stack of saved contexts.
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setNestLevel(0); setNestRunning(true); }}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#22c55e', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            Run Nesting Demo
          </motion.button>
          <button onClick={() => { setNestLevel(0); setNestRunning(false); }}
            style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>Reset</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <h4 style={{ margin: '0 0 8px', color: '#1d4ed8' }}>Edge vs Level Triggered</h4>
          <p style={{ margin: 0, color: '#1e40af', lineHeight: 1.7, fontSize: 14 }}>
            <strong>Edge:</strong> fires on signal transition (0&rarr;1). Fast but can be missed if asserted briefly. <strong>Level:</strong> stays asserted until acknowledged. Can't be missed but requires explicit clearing. MSI avoids both issues.
          </p>
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca' }}>
          <h4 style={{ margin: '0 0 8px', color: '#991b1b' }}>Interrupt Sharing</h4>
          <p style={{ margin: 0, color: '#b91c1c', lineHeight: 1.7, fontSize: 14 }}>
            Legacy PCI allows multiple devices on one IRQ line. Each handler must check "was it my device?" — slow. MSI-X gives each device (even each queue) its own vector. No sharing needed.
          </p>
        </div>
      </div>
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'Interrupt Controller Hardware', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>The interrupt controller sits between devices and the CPU, managing priorities and routing.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: '8259 PIC (Legacy)', desc: 'Two cascaded 8259 chips = 15 IRQ lines. Fixed priority. Single CPU only. Still emulated in BIOS for backward compatibility. IRQ 0-7 and 8-15.', color: '#f97316' },
            { name: 'APIC (Advanced PIC)', desc: 'Local APIC per CPU core + I/O APIC on chipset. Supports multi-core routing. 256 vectors. Priority-based arbitration. Required for SMP.', color: '#3b82f6' },
            { name: 'MSI/MSI-X', desc: 'Device writes a small message to a memory-mapped APIC register. No physical IRQ lines. Up to 2,048 vectors per device. Eliminates sharing and routing issues.', color: '#22c55e' },
            { name: 'ARM GIC', desc: 'Generic Interrupt Controller. GICv3 supports 1,020 IRQ IDs, affinity routing to specific cores, priority grouping, and virtualization. Used in all ARM SoCs.', color: '#8b5cf6' },
          ].map(ic => (
            <div key={ic.name} style={{ padding: 12, borderRadius: 10, background: ic.color + '08', border: '1px solid ' + ic.color + '33' }}>
              <div style={{ fontWeight: 700, color: ic.color, marginBottom: 4, fontSize: 14 }}>{ic.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{ic.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Modern systems use the Local APIC + MSI-X combination. Each CPU core has its own Local APIC that receives MSI messages and delivers them as local interrupts. The OS programs affinity to distribute interrupts across cores.</p>
      </div>
    )},
    { title: 'Interrupt Handling in the Kernel', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Linux splits interrupt handling into two halves to minimize the time spent with interrupts disabled.</p>
        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#1e293b' }}>
            <div><strong>Top Half (Hardirq):</strong></div>
            <div>- Runs immediately, interrupts disabled on this core</div>
            <div>- Must be FAST (&lt;10 \u00B5s). No sleeping allowed.</div>
            <div>- Read device status, acknowledge IRQ, copy urgent data</div>
            <div>- Schedule bottom half for deferred work</div>
            <div style={{ marginTop: 8 }}><strong>Bottom Half (Softirq / Tasklet / Workqueue):</strong></div>
            <div>- Runs later, interrupts re-enabled</div>
            <div>- Process data, wake waiting processes, update stats</div>
            <div>- Softirqs: highest priority, per-CPU, can't sleep</div>
            <div>- Tasklets: built on softirqs, serialized per-tasklet</div>
            <div>- Workqueues: kernel threads, CAN sleep, lowest priority</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Why two halves? If the top half takes too long, other interrupts are missed. The NIC top half takes ~1 \u00B5s to acknowledge the IRQ and schedule NAPI. The bottom half processes hundreds of packets — work that can take milliseconds.</p>
      </div>
    )},
    { title: 'Context Switch Mechanics', color: '#f97316', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>When an interrupt fires, the CPU performs an automatic context switch. This is the most latency-critical operation in the system.</p>
        <div style={{ padding: 16, background: '#fff7ed', borderRadius: 12, border: '1px solid #fed7aa', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#9a3412' }}>
            <div><strong>Hardware (automatic, ~20 cycles):</strong></div>
            <div>1. Finish current instruction</div>
            <div>2. Push flags, CS, IP to kernel stack</div>
            <div>3. Clear interrupt flag (disable further IRQs)</div>
            <div>4. Load handler address from IDT[vector]</div>
            <div>5. Switch to kernel stack (if from user mode)</div>
            <div style={{ marginTop: 8 }}><strong>Software (ISR prologue, ~50-100 cycles):</strong></div>
            <div>6. Push remaining registers (RAX-R15 on x86-64)</div>
            <div>7. Switch to per-CPU IRQ stack</div>
            <div>8. Run handler code</div>
            <div>9. Send EOI (End of Interrupt) to APIC</div>
            <div>10. Pop registers, IRET to restore all state</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Total interrupt overhead: ~100-300 ns on modern x86. This includes pipeline flush, cache pollution, and TLB pressure. At 1 million IRQs/sec, that's 10-30% CPU overhead — why interrupt coalescing matters.</p>
      </div>
    )},
    { title: 'Exceptions & Software Interrupts', color: '#8b5cf6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Not all interrupts come from devices. The CPU generates its own "exceptions" and software can trigger "traps."</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'Faults', desc: 'Recoverable errors. Page fault (#14): access unmapped page, OS loads it from disk, re-execute instruction. Division by zero (#0): deliver SIGFPE to process.', color: '#ef4444' },
            { name: 'Traps', desc: 'Intentional exceptions. INT 0x80 (Linux syscall on x86), SYSCALL instruction on x86-64. Breakpoint (#3): single-byte INT3 instruction used by debuggers.', color: '#3b82f6' },
            { name: 'Aborts', desc: 'Unrecoverable errors. Machine check (#18): hardware failure detected. Double fault (#8): exception during exception handler. Triple fault: CPU resets.', color: '#ef4444' },
            { name: 'NMI', desc: 'Non-Maskable Interrupt. Cannot be disabled. Used for critical hardware errors (memory parity), watchdog timers, and performance profiling (perf NMI).', color: '#f97316' },
          ].map(e => (
            <div key={e.name} style={{ padding: 12, borderRadius: 10, background: e.color + '08', border: '1px solid ' + e.color + '33' }}>
              <div style={{ fontWeight: 700, color: e.color, marginBottom: 4, fontSize: 14 }}>{e.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{e.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>The page fault is the most important exception: it enables virtual memory, demand paging, copy-on-write, and memory-mapped files. A typical program triggers thousands of page faults during startup as code pages are loaded on demand.</p>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Interrupt Architecture</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>The hardware and software machinery that makes interrupts work.</p>
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
      code={`import signal, os, time

# === Signal handlers = user-space "interrupts" ===
# Unix signals are the user-space equivalent of
# hardware interrupts. The kernel delivers them
# to your process, interrupting normal execution.

def handle_alarm(signum, frame):
    print(f"ALARM! Signal {signum} received")
    print(f"Interrupted at: {frame.f_code.co_filename}:{frame.f_lineno}")

def handle_usr1(signum, frame):
    print(f"USR1 signal received! Custom handler.")

# Register signal handlers (like writing an ISR)
signal.signal(signal.SIGALRM, handle_alarm)
signal.signal(signal.SIGUSR1, handle_usr1)

# Schedule an alarm interrupt in 1 second
signal.alarm(1)

print("Working... (alarm in 1 second)")
# Simulate work that will be interrupted
t0 = time.time()
count = 0
while time.time() - t0 < 1.5:
    count += 1
print(f"Resumed after alarm. Did {count:,} iterations.")

# === Common signals and their hardware analogs ===
signals = {
    'SIGINT (2)': 'Ctrl+C = keyboard interrupt (like IRQ 1)',
    'SIGKILL (9)': 'Unconditional kill (like NMI - can\\'t catch)',
    'SIGSEGV (11)': 'Segfault = page fault exception (#14)',
    'SIGALRM (14)': 'Timer alarm (like timer IRQ 0)',
    'SIGFPE (8)': 'Float/div error (like exception #0)',
    'SIGCHLD (17)': 'Child process done (like I/O completion IRQ)',
}
print("\\nSignal → Hardware interrupt mapping:")
for sig, hw in signals.items():
    print(f"  {sig}: {hw}")

# === Interrupt frequency check ===
print(f"\\nTimer frequency (HZ): typically 100-1000")
print(f"Process ID: {os.getpid()}")
print(f"\\nIn /proc/interrupts you can see:")
print("  IRQ counts per CPU core")
print("  Which devices are on which IRQ")
print("  Total interrupts handled")`}
      explanation="Unix signals are the user-space mirror of hardware interrupts. SIGINT (Ctrl+C) is like a keyboard IRQ. SIGSEGV (segfault) is a page fault exception. SIGALRM is a timer interrupt. Just like hardware ISRs, signal handlers interrupt normal execution, save state, run the handler, then resume."
      hardwareNote="Every Python KeyboardInterrupt is a full interrupt chain: keyboard hardware IRQ → kernel top half → bottom half → terminal driver → signal delivery → Python signal handler → raise KeyboardInterrupt. That Ctrl+C traverses the entire interrupt architecture."
    />
  );
}

function Layer5() {
  const apps = [
    { icon: '\u{1F3AE}', title: 'Real-Time Gaming',
      desc: 'Game engines need consistent frame timing. A 16.67ms frame budget (60 FPS) leaves zero room for unexpected interrupt storms. Timer interrupts drive the game loop.',
      detail: 'High-performance games use CPU affinity to pin the render thread to a core with minimal interrupt load. Linux irqbalance distributes IRQs across cores; games may disable it for dedicated cores.' },
    { icon: '\u26A1', title: 'High-Frequency Trading',
      desc: 'HFT systems disable all unnecessary interrupts on trading cores. They poll the NIC directly (kernel bypass with DPDK/RDMA) to achieve sub-microsecond latency.',
      detail: 'A single interrupt costs 100-300ns — unacceptable when you need 1\u00B5s response. Busy-polling wastes CPU but eliminates interrupt jitter. HFT firms literally buy fewer-core CPUs to get higher per-core clock speeds.' },
    { icon: '\u{1F4F1}', title: 'Mobile Power Management',
      desc: 'Every interrupt wakes the CPU from deep sleep. ARM big.LITTLE routes low-priority IRQs to efficiency cores. Interrupt batching reduces wake-ups.',
      detail: 'A phone receiving push notifications must wake from C6 sleep state (100\u00B5s wake latency) for each notification. iOS and Android batch network interrupts to reduce total wake-ups from hundreds to dozens per minute.' },
    { icon: '\u{1F5A5}\uFE0F', title: 'Virtualization & VFIO',
      desc: 'Hypervisors must intercept and virtualize interrupts. Guest IRQs are emulated via the virtual APIC. VFIO passthrough delivers physical MSI-X directly to VMs.',
      detail: 'Interrupt virtualization (Intel VT-d posted interrupts) lets the hardware deliver an MSI-X directly into a VM without hypervisor intervention — near-native interrupt latency for VMs.' },
    { icon: '\u{1F50D}', title: 'Performance Profiling',
      desc: 'perf uses PMU (Performance Monitoring Unit) interrupts to sample where the CPU spends time. NMI-based sampling can profile even interrupt handlers.',
      detail: 'Timer-based profiling fires an interrupt every N microseconds and records the instruction pointer. Statistical sampling builds a profile of hot code paths without instrumenting the code.' },
    { icon: '\u{1F6E1}\uFE0F', title: 'Security: Interrupt Attacks',
      desc: 'Meltdown-style attacks exploit speculative execution during interrupt handling. Interrupt timing side channels can leak information across security boundaries.',
      detail: 'KPTI (Kernel Page Table Isolation) was added to Linux to prevent Meltdown. It separates user and kernel page tables, adding TLB flush overhead on every interrupt and syscall — a 5-30% performance cost.' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Interrupts Run the World</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>Every keystroke, network packet, and timer tick is an interrupt. The entire OS is interrupt-driven.</p>
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
        <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>INTERRUPT TIMELINE</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginTop: 16 }}>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#3b82f6' }}>1981</div><div style={{ fontSize: 11, color: '#94a3b8' }}>8259 PIC (15 IRQs)</div></div>
          <div style={{ fontSize: 18, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#f97316' }}>1996</div><div style={{ fontSize: 11, color: '#94a3b8' }}>APIC (multicore)</div></div>
          <div style={{ fontSize: 18, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e' }}>2003</div><div style={{ fontSize: 11, color: '#94a3b8' }}>MSI-X (no wires)</div></div>
          <div style={{ fontSize: 18, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#8b5cf6' }}>2024</div><div style={{ fontSize: 11, color: '#94a3b8' }}>Posted IRQs (VM-direct)</div></div>
        </div>
      </div>
    </div>
  );
}

export default function L13_Interrupts() {
  return (
    <LessonWrapper lessonId="L13" title="Interrupts"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'The Doorbell', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'Vector Table & Nesting', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'Controllers & Context Switch', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python Signals', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'Interrupts Everywhere', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'IRQ Overhead', description: 'Each interrupt takes 200ns. A NIC fires 500K interrupts/sec. What fraction of a 3 GHz core is spent on interrupts?' },
        { id: 'c2', title: 'Top/Bottom Half', description: 'Why does Linux split interrupt handling into top half and bottom half? What happens if the top half takes too long?' },
        { id: 'c3', title: 'MSI-X Advantage', description: 'An NVMe SSD has 32 I/O queues. Why does MSI-X (one vector per queue) outperform shared IRQ lines?' },
      ]}
    />
  );
}
