"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [selectedISA, setSelectedISA] = useState<'cisc' | 'risc'>('cisc');
  const [step, setStep] = useState(0);

  const ciscExample = {
    title: 'CISC (x86): One Complex Instruction',
    code: 'ADD [EBX+ESI*4+8], EAX',
    meaning: 'Read memory at EBX + ESI×4 + 8, add EAX to it, write result back to memory',
    steps: [
      { label: 'Calculate address: EBX + ESI×4 + 8', color: '#f97316', detail: 'AGU (Address Generation Unit) computes complex address in one step' },
      { label: 'Read value from memory at that address', color: '#3b82f6', detail: 'Memory load through cache hierarchy' },
      { label: 'Add EAX to the loaded value', color: '#22c55e', detail: 'ALU performs addition' },
      { label: 'Write result back to memory', color: '#8b5cf6', detail: 'Memory store through cache hierarchy' },
    ],
    summary: '1 instruction does address math + load + add + store. Complex but compact code.',
  };

  const riscExample = {
    title: 'RISC (ARM/RISC-V): Multiple Simple Instructions',
    code: 'LSL  R2, R1, #2\nADD  R2, R2, R0\nLDR  R3, [R2, #8]\nADD  R3, R3, R4\nSTR  R3, [R2, #8]',
    meaning: 'Same operation as CISC, broken into 5 simple steps',
    steps: [
      { label: 'LSL R2, R1, #2  — Shift R1 left by 2 (×4)', color: '#f97316', detail: 'Simple shift operation, 1 cycle' },
      { label: 'ADD R2, R2, R0  — Add base address', color: '#ef4444', detail: 'Simple addition, 1 cycle' },
      { label: 'LDR R3, [R2, #8] — Load from memory', color: '#3b82f6', detail: 'Memory load, only operation that touches memory' },
      { label: 'ADD R3, R3, R4  — Add the value', color: '#22c55e', detail: 'Simple addition, 1 cycle' },
      { label: 'STR R3, [R2, #8] — Store result', color: '#8b5cf6', detail: 'Memory store, only other memory operation' },
    ],
    summary: '5 simple instructions, each does exactly one thing. Easier to pipeline and optimize.',
  };

  const example = selectedISA === 'cisc' ? ciscExample : riscExample;

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>The Language of CPUs</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        An <strong>Instruction Set Architecture (ISA)</strong> is the CPU's vocabulary — the set of commands it understands. Think of it as the contract between software and hardware: the software speaks in instructions, and the hardware promises to execute them.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        Two philosophies: <strong>CISC</strong> (Complex Instruction Set) gives you a Swiss Army knife — each instruction does a lot. <strong>RISC</strong> (Reduced Instruction Set) gives you a sharp chef's knife — each instruction does one thing fast.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        Compare the same operation in both styles. The CISC version is more compact; the RISC version is easier for hardware to optimize.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setSelectedISA('cisc'); setStep(0); }}
          style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: selectedISA === 'cisc' ? '#ef4444' : '#f1f5f9', color: selectedISA === 'cisc' ? 'white' : '#334155', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          CISC (x86)
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setSelectedISA('risc'); setStep(0); }}
          style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: selectedISA === 'risc' ? '#22c55e' : '#f1f5f9', color: selectedISA === 'risc' ? 'white' : '#334155', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          RISC (ARM/RISC-V)
        </motion.button>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 24, border: '1px solid #334155' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>{example.title}</div>
        <pre style={{ background: '#111827', padding: 16, borderRadius: 10, color: '#22c55e', fontFamily: 'monospace', fontSize: 14, marginBottom: 12, overflowX: 'auto' }}>{example.code}</pre>
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>{example.meaning}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {example.steps.map((s, i) => (
            <motion.div key={i}
              animate={{ opacity: i <= step ? 1 : 0.25, x: i <= step ? 0 : 20 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
              onClick={() => setStep(i)}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: i <= step ? s.color : '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0, border: i === step ? '2px solid white' : 'none' }}>{i + 1}</div>
              <div style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: i === step ? s.color + '22' : 'transparent', borderLeft: '3px solid ' + (i <= step ? s.color : '#374151') }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: i <= step ? s.color : '#64748b', fontFamily: 'monospace' }}>{s.label}</div>
                {i === step && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{s.detail}</div>}
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', padding: '8px 16px', borderRadius: 8, background: '#1f2937' }}>{example.summary}</div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          <button onClick={() => setStep(s => Math.max(0, s - 1))} style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 12 }}>Prev</button>
          <button onClick={() => setStep(s => Math.min(example.steps.length - 1, s + 1))} style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 12 }}>Next</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca' }}>
          <h4 style={{ margin: '0 0 8px', color: '#991b1b' }}>CISC Advantage</h4>
          <p style={{ margin: 0, color: '#b91c1c', lineHeight: 1.7, fontSize: 14 }}>
            Fewer instructions = smaller binaries = less instruction cache pressure. One x86 instruction can replace 3-5 RISC instructions. Better code density.
          </p>
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 8px', color: '#166534' }}>RISC Advantage</h4>
          <p style={{ margin: 0, color: '#15803d', lineHeight: 1.7, fontSize: 14 }}>
            Fixed-length instructions (4 bytes) are trivial to decode in parallel. Simple operations complete in 1 cycle. Easier to pipeline deeply. Lower power consumption.
          </p>
        </div>
      </div>
    </div>
  );
}

function Layer2() {
  const [category, setCategory] = useState<'arithmetic' | 'memory' | 'control' | 'simd'>('arithmetic');

  const categories = {
    arithmetic: {
      name: 'Arithmetic & Logic',
      color: '#3b82f6',
      instructions: [
        { x86: 'ADD RAX, RBX', arm: 'ADD X0, X0, X1', rv: 'add a0, a0, a1', desc: 'Add two registers', cycles: '1' },
        { x86: 'IMUL RAX, RBX', arm: 'MUL X0, X0, X1', rv: 'mul a0, a0, a1', desc: 'Multiply registers', cycles: '3' },
        { x86: 'SHL RAX, 4', arm: 'LSL X0, X0, #4', rv: 'slli a0, a0, 4', desc: 'Shift left (multiply by 16)', cycles: '1' },
        { x86: 'XOR RAX, RAX', arm: 'EOR X0, X0, X0', rv: 'xor a0, a0, a0', desc: 'Zero a register (fast idiom)', cycles: '0-1' },
        { x86: 'LEA RAX,[RBX+RCX*8]', arm: 'ADD X0,X1,X2,LSL#3', rv: 'slli t0,a2,3; add a0,a1,t0', desc: 'Address calculation', cycles: '1' },
      ],
    },
    memory: {
      name: 'Memory Access',
      color: '#22c55e',
      instructions: [
        { x86: 'MOV RAX, [RBX]', arm: 'LDR X0, [X1]', rv: 'ld a0, 0(a1)', desc: 'Load from memory', cycles: '4-200' },
        { x86: 'MOV [RBX], RAX', arm: 'STR X0, [X1]', rv: 'sd a0, 0(a1)', desc: 'Store to memory', cycles: '1*' },
        { x86: 'PUSH RAX', arm: 'STP X0,X1,[SP,#-16]!', rv: 'addi sp,sp,-8; sd a0,0(sp)', desc: 'Push to stack', cycles: '1-2' },
        { x86: 'PREFETCHT0 [RBX]', arm: 'PRFM PLDL1KEEP,[X0]', rv: 'prefetch.r 0(a0)', desc: 'Prefetch to cache', cycles: '0' },
        { x86: 'MOVNTI [RBX],RAX', arm: 'STNP X0,X1,[X2]', rv: '(no standard)', desc: 'Non-temporal store (bypass cache)', cycles: '1*' },
      ],
    },
    control: {
      name: 'Control Flow',
      color: '#f97316',
      instructions: [
        { x86: 'JMP label', arm: 'B label', rv: 'jal zero, label', desc: 'Unconditional jump', cycles: '0-1' },
        { x86: 'JE label', arm: 'BEQ label', rv: 'beq a0, a1, label', desc: 'Branch if equal', cycles: '0-20' },
        { x86: 'CALL func', arm: 'BL func', rv: 'jal ra, func', desc: 'Function call', cycles: '1-5' },
        { x86: 'RET', arm: 'RET', rv: 'jalr zero, ra, 0', desc: 'Return from function', cycles: '1-5' },
        { x86: 'CMOVGE RAX,RBX', arm: 'CSEL X0,X0,X1,GE', rv: '(branch sequence)', desc: 'Conditional move (branchless)', cycles: '1' },
      ],
    },
    simd: {
      name: 'SIMD / Vector',
      color: '#8b5cf6',
      instructions: [
        { x86: 'VADDPS YMM0,YMM1,YMM2', arm: 'FADD V0.4S,V1.4S,V2.4S', rv: 'vfadd.vv v0,v1,v2', desc: 'Add 8 floats at once (256-bit)', cycles: '3-5' },
        { x86: 'VMULPS ZMM0,ZMM1,ZMM2', arm: '(SVE) FMUL Z0,Z1,Z2', rv: 'vfmul.vv v0,v1,v2', desc: 'Multiply 16 floats (512-bit)', cycles: '4-5' },
        { x86: 'VFMADD231PS', arm: 'FMLA V0.4S,V1.4S,V2.4S', rv: 'vfmacc.vv v0,v1,v2', desc: 'Fused multiply-add (key for ML)', cycles: '4' },
        { x86: 'VBROADCASTSS', arm: 'DUP V0.4S, V1.S[0]', rv: 'vfmv.v.f v0,fa0', desc: 'Broadcast scalar to all lanes', cycles: '1-3' },
        { x86: 'VPBLENDMD', arm: 'BSL V0,V1,V2', rv: 'vmerge.vvm', desc: 'Blend/select elements by mask', cycles: '1' },
      ],
    },
  };

  const cat = categories[category];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Instruction Categories Across ISAs</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24, fontSize: 16 }}>
        Every ISA has the same fundamental categories. The syntax differs but the operations are universal. Compare x86-64, ARM (AArch64), and RISC-V side by side.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {(Object.keys(categories) as Array<keyof typeof categories>).map(key => (
          <motion.button key={key} whileHover={{ scale: 1.05 }} onClick={() => setCategory(key)}
            style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: category === key ? categories[key].color : '#f1f5f9', color: category === key ? 'white' : '#334155', fontWeight: 700, fontSize: 13 }}>
            {categories[key].name}
          </motion.button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '10px 8px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Operation</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', color: '#ef4444', fontWeight: 600 }}>x86-64</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', color: '#22c55e', fontWeight: 600 }}>AArch64 (ARM)</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', color: '#3b82f6', fontWeight: 600 }}>RISC-V</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Cycles</th>
              </tr>
            </thead>
            <tbody>
              {cat.instructions.map((inst, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 8px', color: '#475569', fontSize: 12 }}>{inst.desc}</td>
                  <td style={{ padding: '10px 8px', fontFamily: 'monospace', color: '#ef4444', fontSize: 11, fontWeight: 600 }}>{inst.x86}</td>
                  <td style={{ padding: '10px 8px', fontFamily: 'monospace', color: '#22c55e', fontSize: 11, fontWeight: 600 }}>{inst.arm}</td>
                  <td style={{ padding: '10px 8px', fontFamily: 'monospace', color: '#3b82f6', fontSize: 11, fontWeight: 600 }}>{inst.rv}</td>
                  <td style={{ padding: '10px 8px', color: '#64748b', fontSize: 12 }}>{inst.cycles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: cat.color + '08', border: '1px solid ' + cat.color + '33' }}>
        <p style={{ margin: 0, color: '#475569', lineHeight: 1.7, fontSize: 14 }}>
          {category === 'arithmetic' && 'Arithmetic instructions are the fastest — 1 cycle for most operations. LEA (Load Effective Address) on x86 is a beloved trick: it computes addresses without touching memory, effectively giving free multiply-and-add.'}
          {category === 'memory' && 'Only RISC load/store instructions touch memory — arithmetic never does. x86 allows memory operands in arithmetic (ADD [mem], reg), which the CPU internally splits into a load + add + store. Non-temporal stores bypass the cache for streaming writes.'}
          {category === 'control' && 'Branch misprediction costs 10-20 cycles (pipeline flush). Conditional moves (CMOV) avoid branches entirely — the CPU executes both paths and selects the result. Critical for branchless programming in performance-sensitive code.'}
          {category === 'simd' && 'SIMD processes 4-16 values per instruction. x86 AVX-512 = 512 bits = 16 floats. ARM SVE scales from 128 to 2048 bits. RISC-V Vector extension uses variable-length vectors. SIMD is essential for ML inference (matrix multiply = fused multiply-add in tight loops).'}
        </p>
      </div>
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'Instruction Encoding', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>How instructions are encoded into bytes determines decode complexity and code density.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'x86-64 (Variable)', desc: '1-15 bytes per instruction. REX/VEX/EVEX prefixes add width. Extremely complex decoder: 4 simple + 1 complex decoder per core. But excellent code density.', color: '#ef4444', example: 'ADD RAX,1 = 48 83 C0 01 (4 bytes)\nNOP = 90 (1 byte)\nVADDPS = 62 F1 7C 48 58 C1 (6 bytes)' },
            { name: 'AArch64 (Fixed 32-bit)', desc: 'Every instruction is exactly 4 bytes. Simple decode logic. Up to 8-wide decode. Some information waste (padding). Conditional execution via flags.', color: '#22c55e', example: 'ADD X0,X0,X1 = 8B010000 (4 bytes)\nNOP = D503201F (4 bytes)\nBEQ label = 54000000 (4 bytes)' },
            { name: 'RISC-V (32-bit + compressed)', desc: 'Standard: 4 bytes. "C" extension: 2 bytes for common ops. Best of both: simple decode for 4-byte + density for 2-byte. Modular design.', color: '#3b82f6', example: 'add a0,a0,a1 = 00B50533 (4 bytes)\nc.add a0,a1 = 952E (2 bytes)\nc.nop = 0001 (2 bytes)' },
          ].map(enc => (
            <div key={enc.name} style={{ padding: 14, borderRadius: 10, background: enc.color + '08', border: '1px solid ' + enc.color + '33' }}>
              <div style={{ fontWeight: 700, color: enc.color, marginBottom: 6, fontSize: 14 }}>{enc.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7, marginBottom: 8 }}>{enc.desc}</div>
              <pre style={{ margin: 0, fontSize: 10, color: '#64748b', fontFamily: 'monospace', lineHeight: 1.6, background: 'white', padding: 8, borderRadius: 6 }}>{enc.example}</pre>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>x86-64 spends ~25% of decoder transistors just on instruction length determination. ARM and RISC-V start executing immediately because they know exactly where each instruction begins. This is why Apple's M-series chips achieve 8-wide decode at lower power.</p>
      </div>
    )},
    { title: 'Registers & Calling Conventions', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Registers are the CPU's fastest storage. Each ISA defines how many, how they're used, and how functions pass arguments.</p>
        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#1e293b' }}>
            <div><strong>x86-64 (System V ABI):</strong></div>
            <div>16 GPRs: RAX-R15 (64-bit). Args: RDI, RSI, RDX, RCX, R8, R9</div>
            <div>Return: RAX. Callee-saved: RBX, RBP, R12-R15</div>
            <div>32 SIMD: YMM0-YMM31 (256-bit) or ZMM (512-bit AVX-512)</div>
            <div style={{ marginTop: 8 }}><strong>AArch64 (ARM):</strong></div>
            <div>31 GPRs: X0-X30 (64-bit). Args: X0-X7 (8 args in regs!)</div>
            <div>Return: X0-X1. LR = X30. Callee-saved: X19-X28</div>
            <div>32 SIMD: V0-V31 (128-bit NEON) or Z0-Z31 (SVE, up to 2048-bit)</div>
            <div style={{ marginTop: 8 }}><strong>RISC-V (RV64G):</strong></div>
            <div>32 GPRs: x0-x31 (x0 = hardwired zero). Args: a0-a7</div>
            <div>Return: a0-a1. Callee-saved: s0-s11. RA = x1</div>
            <div>32 FP: f0-f31. Vector: v0-v31 (configurable width)</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>ARM's 8 argument registers vs x86's 6 means fewer function calls need stack spills. RISC-V's hardwired zero register (x0) simplifies many operations: MOV becomes ADD rd, x0, rs. More registers = less memory traffic = faster code.</p>
      </div>
    )},
    { title: 'Memory Ordering & Atomics', color: '#f97316', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Different ISAs have different rules about when memory operations become visible to other cores. This is the <strong>memory model</strong>.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'x86-64: TSO (Strong)', desc: 'Total Store Order. Stores are seen in program order by all cores. Only store-load reordering allowed. Simplest to program correctly. Most expensive in hardware.', color: '#ef4444' },
            { name: 'ARM: Weak Ordering', desc: 'Any reordering allowed unless explicit barriers (DMB, DSB, ISB). Loads can pass loads, stores can pass stores. Faster hardware but harder to write correct lock-free code.', color: '#22c55e' },
            { name: 'RISC-V: Relaxed (RVWMO)', desc: 'Very relaxed by default. fence instruction for ordering. AMO (atomic memory operations) for lock-free algorithms. Acquire/release semantics on atomics.', color: '#3b82f6' },
          ].map(m => (
            <div key={m.name} style={{ padding: 12, borderRadius: 10, background: m.color + '08', border: '1px solid ' + m.color + '33' }}>
              <div style={{ fontWeight: 700, color: m.color, marginBottom: 4, fontSize: 13 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{m.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>C++ memory_order maps to these: memory_order_relaxed needs no barriers on any ISA. memory_order_acquire/release needs barriers on ARM/RISC-V but not x86. memory_order_seq_cst needs MFENCE on x86 and DMB on ARM. Python's GIL sidesteps most of this — only one thread runs at a time.</p>
      </div>
    )},
    { title: 'ISA Extensions & Evolution', color: '#8b5cf6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>ISAs grow over time by adding optional extensions. The base ISA stays stable; extensions add new capabilities.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'x86 SIMD Evolution', desc: 'MMX (64-bit, 1996) → SSE (128-bit, 1999) → AVX (256-bit, 2011) → AVX-512 (512-bit, 2016) → AVX10 (unified, 2023). Each generation doubles width.', color: '#ef4444' },
            { name: 'ARM Extensions', desc: 'NEON (128-bit SIMD) → SVE (128-2048 bit, scalable) → SVE2 (2020, crypto+ML). SME (Scalable Matrix Extension) for native matrix multiply.', color: '#22c55e' },
            { name: 'RISC-V Modularity', desc: 'Base: I (integer). Standard: M (multiply), A (atomic), F/D (float), C (compressed), V (vector). Custom extensions via reserved opcode space.', color: '#3b82f6' },
            { name: 'Crypto & ML Extensions', desc: 'AES-NI (x86), ARMv8 Crypto, RISC-V Crypto. AMX (x86 matrix), SME (ARM matrix), RISC-V matrix TBD. Dedicated silicon for common workloads.', color: '#8b5cf6' },
          ].map(e => (
            <div key={e.name} style={{ padding: 12, borderRadius: 10, background: e.color + '08', border: '1px solid ' + e.color + '33' }}>
              <div style={{ fontWeight: 700, color: e.color, marginBottom: 4, fontSize: 14 }}>{e.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{e.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>RISC-V's key innovation is modularity: pick only the extensions you need. An embedded microcontroller uses RV32I (base integer). A server CPU uses RV64GCV (everything). Custom extensions let you add domain-specific instructions without breaking compatibility.</p>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>ISA Deep Dive</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>The engineering details that define CPU architectures.</p>
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
      code={`import dis, sys, struct

# === Python bytecode is its own instruction set! ===
# CPython has ~120 "instructions" (opcodes)
# The interpreter is a giant switch statement over these

def add_and_check(a, b):
    result = a + b
    if result > 100:
        return result
    return 0

# Disassemble to see Python's ISA
print("=== Python Bytecode (CPython's ISA) ===")
dis.dis(add_and_check)

# === Bytecode encoding ===
code = add_and_check.__code__
print(f"\\nBytecode bytes: {code.co_code.hex()}")
print(f"Instruction count: ~{len(code.co_code) // 2}")
print(f"Constants: {code.co_consts}")
print(f"Variable names: {code.co_varnames}")
print(f"Stack depth needed: {code.co_stacksize}")

# === Compare with what hardware sees ===
print("\\n=== What Actually Runs on Hardware ===")
print("Python:  result = a + b")
print("Bytecode: LOAD_FAST(a) LOAD_FAST(b) BINARY_ADD STORE_FAST(result)")
print("x86-64:  ~50 instructions (interpreter overhead)")
print("         fetch opcode, decode, dispatch, type check,")
print("         unbox int, ADD, box result, refcount, store")
print()
print("Key insight: one Python '+' becomes ~50 x86 instructions")
print("because CPython must:")
print("  1. Look up the opcode in a dispatch table")
print("  2. Check types of both operands at runtime")
print("  3. Call the correct __add__ method")
print("  4. Allocate a new object for the result")
print("  5. Manage reference counts")
print()

# === Platform detection ===
print(f"Platform: {sys.platform}")
print(f"Byte order: {sys.byteorder}")
print(f"Pointer size: {struct.calcsize('P')} bytes")
print(f"This is a {'64' if struct.calcsize('P') == 8 else '32'}-bit Python")
print(f"Max int before bignum: {sys.maxsize} ({sys.maxsize.bit_length()} bits)")`}
      explanation="CPython bytecode is essentially a virtual ISA. LOAD_FAST, BINARY_ADD, STORE_FAST are 'instructions' for the Python virtual machine. But each bytecode instruction becomes ~50 real x86/ARM instructions because of dynamic typing, reference counting, and method dispatch. JIT compilers (PyPy) compile hot bytecodes directly to native instructions, eliminating this overhead."
      hardwareNote="When you run Python on an ARM Mac vs an x86 PC, the same bytecode executes — but the interpreter translates each opcode into completely different machine instructions. This is the beauty of the ISA abstraction: Python doesn't care what hardware it runs on, because CPython's interpreter bridges the gap."
    />
  );
}

function Layer5() {
  const apps = [
    { icon: '\u{1F34E}', title: 'Apple Silicon (ARM)',
      desc: 'Apple\'s M-series chips proved ARM can match x86 in performance. M3 Pro: 8-wide decode, 600+ instructions in-flight, unified memory architecture.',
      detail: 'Apple\'s Rosetta 2 translates x86 to ARM in real-time with ~80% native performance. This enabled the Mac transition without breaking existing software — ISA translation at its finest.' },
    { icon: '\u{1F680}', title: 'RISC-V: The Open ISA',
      desc: 'RISC-V is royalty-free and open source. Anyone can build a RISC-V CPU. Used in SiFive, Alibaba T-Head, and billions of embedded chips.',
      detail: 'RISC-V\'s modular extensions mean the same ISA scales from a $0.10 microcontroller (RV32E, 16 registers) to a server CPU (RV64GCV, full vector). No licensing fees to ARM or Intel.' },
    { icon: '\u{1F9E0}', title: 'ML Instruction Extensions',
      desc: 'Intel AMX, ARM SME, and Google TPU instruction sets add native matrix multiply. A single AMX instruction multiplies two 16×16 matrices.',
      detail: 'Before AMX: matrix multiply needed hundreds of FMA instructions manually scheduled. With AMX: one instruction feeds a 2D array of multiplier-accumulators. 8x throughput for transformer inference.' },
    { icon: '\u{1F512}', title: 'Security Extensions',
      desc: 'ARM MTE (Memory Tagging), Intel CET (Control-flow Enforcement), RISC-V CFI. Hardware-enforced memory safety and control flow integrity.',
      detail: 'ARM MTE adds 4-bit tags to memory pointers and allocations. If the pointer tag doesn\'t match the memory tag, hardware traps. Catches use-after-free and buffer overflows at near-zero performance cost.' },
    { icon: '\u{1F30D}', title: 'WebAssembly (Wasm)',
      desc: 'A virtual ISA for the web. Compiles C/C++/Rust to a portable binary that runs in browsers at near-native speed. Stack-based, strongly typed.',
      detail: 'Wasm is essentially a RISC ISA designed for safe sandboxed execution. JIT-compiled to native x86/ARM. Now expanding beyond browsers: WASI brings Wasm to servers, edge computing, and embedded devices.' },
    { icon: '\u{1F4CA}', title: 'ISA Market Share (2024)',
      desc: 'ARM: ~200 billion chips shipped total. x86: dominates servers and desktops. RISC-V: fastest-growing, 10+ billion cores shipped. MIPS: legacy.',
      detail: 'ARM wins on volume (every smartphone). x86 wins on software ecosystem (Windows, enterprise). RISC-V wins on flexibility and cost (no licensing). The future is likely multi-ISA: right tool for right job.' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>ISAs Shape the Industry</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>The instruction set is the most important interface in computing — it defines what software can ask hardware to do.</p>
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
        <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>ISA TIMELINE</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginTop: 16 }}>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#ef4444' }}>1978</div><div style={{ fontSize: 11, color: '#94a3b8' }}>x86 (Intel 8086)</div></div>
          <div style={{ fontSize: 18, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#f97316' }}>1985</div><div style={{ fontSize: 11, color: '#94a3b8' }}>ARM (Acorn)</div></div>
          <div style={{ fontSize: 18, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#3b82f6' }}>2003</div><div style={{ fontSize: 11, color: '#94a3b8' }}>x86-64 (AMD64)</div></div>
          <div style={{ fontSize: 18, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e' }}>2010</div><div style={{ fontSize: 11, color: '#94a3b8' }}>RISC-V (Berkeley)</div></div>
          <div style={{ fontSize: 18, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#8b5cf6' }}>2017</div><div style={{ fontSize: 11, color: '#94a3b8' }}>Wasm (W3C)</div></div>
        </div>
      </div>
    </div>
  );
}

export default function L15_InstructionSets() {
  return (
    <LessonWrapper lessonId="L15" title="Instruction Sets"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'CISC vs RISC', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'Instructions Compared', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'Encoding & Memory Models', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python Bytecode as ISA', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'ISA Wars', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'Code Density', description: 'A function compiles to 120 bytes on x86-64 (variable length) and 200 bytes on AArch64 (4 bytes each). How many instructions in each? Why does code density matter for I-cache?' },
        { id: 'c2', title: 'Register Pressure', description: 'x86-64 has 16 GPRs, AArch64 has 31. Why does having more registers reduce memory traffic? When would 16 not be enough?' },
        { id: 'c3', title: 'RISC-V Modularity', description: 'Design a RISC-V configuration for: (a) a $0.10 IoT sensor, (b) a smartphone, (c) a server CPU. Which extensions would each need?' },
      ]}
    />
  );
}
