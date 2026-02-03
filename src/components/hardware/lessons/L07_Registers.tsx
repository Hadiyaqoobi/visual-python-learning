"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [activeReg, setActiveReg] = useState(0);
  const [regs, setRegs] = useState([
    { name: 'RAX', value: 42, desc: 'Accumulator — math results', color: '#3b82f6' },
    { name: 'RBX', value: 1000, desc: 'Base — memory addresses', color: '#22c55e' },
    { name: 'RCX', value: 7, desc: 'Counter — loop iterations', color: '#f97316' },
    { name: 'RDX', value: 255, desc: 'Data — I/O operations', color: '#8b5cf6' },
    { name: 'RSP', value: 65280, desc: 'Stack Pointer — top of stack', color: '#ef4444' },
    { name: 'RBP', value: 65024, desc: 'Base Pointer — stack frame', color: '#ec4899' },
    { name: 'RSI', value: 8192, desc: 'Source Index — string ops', color: '#06b6d4' },
    { name: 'RDI', value: 4096, desc: 'Destination Index — string ops', color: '#84cc16' },
  ]);
  const [operation, setOperation] = useState('');
  const [animating, setAnimating] = useState(false);

  const doOp = (op: string) => {
    setAnimating(true);
    setOperation(op);
    setTimeout(() => {
      setRegs(prev => {
        const next = [...prev.map(r => ({ ...r }))];
        switch (op) {
          case 'ADD RAX, RBX': next[0].value = (next[0].value + next[1].value) & 0xFFFF; break;
          case 'MOV RCX, 100': next[2].value = 100; break;
          case 'SUB RDX, 1': next[3].value = Math.max(0, next[3].value - 1); break;
          case 'INC RCX': next[2].value = (next[2].value + 1) & 0xFFFF; break;
          case 'PUSH RAX': next[4].value = next[4].value - 8; break;
          case 'POP RBX': next[4].value = next[4].value + 8; next[1].value = 42; break;
        }
        return next;
      });
      setTimeout(() => setAnimating(false), 300);
    }, 200);
  };

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>The CPU's Scratchpad</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        Imagine doing math homework but you can only use 16 sticky notes on your desk. Each note holds one number. You can read any note instantly, write a new number on any note, and do math between notes. That is exactly what <strong>registers</strong> are.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        Registers are the <strong>fastest storage</strong> in the entire computer — faster than L1 cache, thousands of times faster than RAM. There are very few of them (typically 16 general-purpose), and every computation must flow through them.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        Click the operation buttons to watch data flow between registers. Notice how each instruction reads from one or two registers and writes to one register — this is how every CPU instruction works.
      </p>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 24, border: '1px solid #334155' }}>
        <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, textAlign: 'center' }}>x86-64 General Purpose Registers</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
          {regs.map((reg, i) => (
            <motion.div key={reg.name} onClick={() => setActiveReg(i)}
              animate={{ boxShadow: i === activeReg ? '0 0 25px ' + reg.color + '55' : 'none', borderColor: i === activeReg ? reg.color : '#374151', scale: animating && operation.includes(reg.name) ? [1, 1.1, 1] : 1 }}
              style={{ padding: '12px 14px', borderRadius: 12, background: '#1f2937', border: '2px solid', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: reg.color }}>{reg.name}</span>
                <span style={{ fontSize: 9, color: '#64748b' }}>64-bit</span>
              </div>
              <motion.div key={reg.value} initial={{ scale: 1.15 }} animate={{ scale: 1 }}
                style={{ fontSize: 18, fontWeight: 700, color: 'white', fontFamily: 'monospace' }}>{reg.value}</motion.div>
              <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>{reg.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Operations */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['ADD RAX, RBX', 'MOV RCX, 100', 'SUB RDX, 1', 'INC RCX', 'PUSH RAX', 'POP RBX'].map(op => (
            <motion.button key={op} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => doOp(op)}
              style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #475569', background: '#374151', color: '#e2e8f0', cursor: 'pointer', fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>
              {op}
            </motion.button>
          ))}
        </div>
        {operation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: '#22c55e', fontFamily: 'monospace' }}>
            Executed: {operation}
          </motion.div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <h4 style={{ margin: '0 0 8px', color: '#1d4ed8' }}>Why So Few Registers?</h4>
          <p style={{ margin: 0, color: '#1e40af', lineHeight: 1.7, fontSize: 14 }}>
            More registers means more MUX levels to select them, more wires, and slower access. 16 registers is a sweet spot: enough to hold working data, few enough to address with 4 bits. Each instruction encodes register numbers in just 4 bits each.
          </p>
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 8px', color: '#166534' }}>Register vs RAM</h4>
          <p style={{ margin: 0, color: '#15803d', lineHeight: 1.7, fontSize: 14 }}>
            <strong>Register read:</strong> 0 extra cycles, ~0.1ns<br/>
            <strong>L1 cache hit:</strong> ~4 cycles, ~1ns<br/>
            <strong>RAM access:</strong> ~200 cycles, ~50ns<br/>
            Registers are 500x faster than RAM. This is why compilers optimize to keep data in registers.
          </p>
        </div>
      </div>
    </div>
  );
}

function Layer2() {
  const [readPort1, setReadPort1] = useState(0);
  const [readPort2, setReadPort2] = useState(1);
  const [writeReg, setWriteReg] = useState(0);
  const [writeVal, setWriteVal] = useState('');
  const [writeEnable, setWriteEnable] = useState(false);
  const [regFile, setRegFile] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [lastWrite, setLastWrite] = useState<{reg: number; val: number} | null>(null);

  const regNames = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'];

  const doWrite = () => {
    const val = parseInt(writeVal) || 0;
    const clamped = val & 0xFF;
    setRegFile(prev => prev.map((v, i) => i === writeReg ? clamped : v));
    setLastWrite({ reg: writeReg, val: clamped });
    setWriteVal('');
  };

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Register File Simulator</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
        A register file has <strong>2 read ports</strong> and <strong>1 write port</strong>. This lets the ALU read two operands and write one result every clock cycle. Select registers to read, enter values to write.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Register array */}
        <div style={{ padding: 20, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 12 }}>8-bit Register File (8 registers)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {regFile.map((val, i) => {
              const isRead1 = i === readPort1;
              const isRead2 = i === readPort2;
              const isWriteTarget = i === writeReg && writeEnable;
              const wasWritten = lastWrite && lastWrite.reg === i;
              return (
                <motion.div key={i}
                  animate={{ borderColor: isRead1 ? '#3b82f6' : isRead2 ? '#f97316' : isWriteTarget ? '#22c55e' : '#e2e8f0', boxShadow: wasWritten ? '0 0 15px #22c55e44' : 'none' }}
                  style={{ padding: '10px 14px', borderRadius: 10, background: 'white', border: '2px solid', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{regNames[i]}</span>
                    {isRead1 && <span style={{ fontSize: 9, color: '#3b82f6', marginLeft: 4 }}>RD1</span>}
                    {isRead2 && <span style={{ fontSize: 9, color: '#f97316', marginLeft: 4 }}>RD2</span>}
                  </div>
                  <motion.span key={val} initial={{ scale: 1.2 }} animate={{ scale: 1 }}
                    style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{val}</motion.span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Read ports */}
          <div style={{ padding: 16, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1d4ed8', marginBottom: 8 }}>Read Port 1 (Blue)</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {regNames.map((n, i) => (
                <button key={i} onClick={() => setReadPort1(i)}
                  style={{ flex: 1, padding: '6px', borderRadius: 6, border: 'none', background: readPort1 === i ? '#3b82f6' : '#e2e8f0', color: readPort1 === i ? 'white' : '#64748b', cursor: 'pointer', fontWeight: 700, fontSize: 11 }}>{n}</button>
              ))}
            </div>
            <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 14, color: '#1d4ed8' }}>
              Output: <strong>{regFile[readPort1]}</strong> ({regFile[readPort1].toString(2).padStart(8, '0')})
            </div>
          </div>

          <div style={{ padding: 16, borderRadius: 12, background: '#fff7ed', border: '1px solid #fed7aa' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#c2410c', marginBottom: 8 }}>Read Port 2 (Orange)</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {regNames.map((n, i) => (
                <button key={i} onClick={() => setReadPort2(i)}
                  style={{ flex: 1, padding: '6px', borderRadius: 6, border: 'none', background: readPort2 === i ? '#f97316' : '#e2e8f0', color: readPort2 === i ? 'white' : '#64748b', cursor: 'pointer', fontWeight: 700, fontSize: 11 }}>{n}</button>
              ))}
            </div>
            <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 14, color: '#c2410c' }}>
              Output: <strong>{regFile[readPort2]}</strong> ({regFile[readPort2].toString(2).padStart(8, '0')})
            </div>
          </div>

          <div style={{ padding: 16, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#166534', marginBottom: 8 }}>Write Port (Green)</div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              {regNames.map((n, i) => (
                <button key={i} onClick={() => setWriteReg(i)}
                  style={{ flex: 1, padding: '6px', borderRadius: 6, border: 'none', background: writeReg === i ? '#22c55e' : '#e2e8f0', color: writeReg === i ? 'white' : '#64748b', cursor: 'pointer', fontWeight: 700, fontSize: 11 }}>{n}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="number" min={0} max={255} value={writeVal} onChange={e => setWriteVal(e.target.value)} placeholder="0-255"
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #bbf7d0', fontSize: 14 }} />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={doWrite}
                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#22c55e', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                Write
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: 20, borderRadius: 12, background: '#f5f3ff', border: '1px solid #c4b5fd' }}>
        <h4 style={{ margin: '0 0 8px', color: '#6d28d9' }}>How it works in hardware:</h4>
        <p style={{ margin: 0, color: '#5b21b6', lineHeight: 1.8, fontSize: 14 }}>
          Each read port is a MUX: the register address selects which register's flip-flops connect to the output bus. The write port uses a decoder: the address activates one register's clock-enable, allowing new data to be captured on the next clock edge. Two reads + one write happen <strong>simultaneously</strong> in a single cycle.
        </p>
      </div>
    </div>
  );
}
