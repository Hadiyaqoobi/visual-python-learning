"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [virtualAddr, setVirtualAddr] = useState<number | null>(null);
  const [mappings, setMappings] = useState<Record<number, number>>({ 0: 5, 1: 2, 2: 7, 3: 0, 4: -1, 5: 3, 6: -1, 7: 1 });
  const [pageFault, setPageFault] = useState(false);

  const virtualPages = Array.from({ length: 8 }, (_, i) => i);
  const physicalFrames = Array.from({ length: 8 }, (_, i) => i);

  const handleClick = (vp: number) => {
    setVirtualAddr(vp);
    setPageFault(mappings[vp] === -1);
    if (mappings[vp] === -1) {
      setTimeout(() => {
        const usedFrames = Object.values(mappings).filter(v => v >= 0);
        const free = physicalFrames.find(f => !usedFrames.includes(f));
        if (free !== undefined) {
          setMappings(prev => ({ ...prev, [vp]: free }));
          setPageFault(false);
        }
      }, 1200);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>The Library Card Catalog</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        Imagine a library where every reader gets their own <strong>private card catalog</strong>. Your catalog says "Book #3 is on Shelf 7" — but another reader's catalog might say "Book #3 is on Shelf 2." Same book number, different physical location. That's <strong>virtual memory</strong>.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        Each program thinks it has its own private, contiguous address space starting from 0. The <strong>MMU</strong> (Memory Management Unit) translates these virtual addresses to physical RAM locations using a <strong>page table</strong>. Programs never see real physical addresses.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        Click a virtual page below. If it's mapped, you'll see the physical frame. If not — <strong>page fault!</strong> The OS loads the page from disk.
      </p>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 24, border: '1px solid #334155' }}>
        <div style={{ display: 'flex', gap: 48, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Virtual pages */}
          <div>
            <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Virtual Pages (Program View)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {virtualPages.map(vp => {
                const isMapped = mappings[vp] >= 0;
                const isSelected = virtualAddr === vp;
                return (
                  <motion.button key={vp} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                    onClick={() => handleClick(vp)}
                    style={{ width: 80, height: 56, borderRadius: 10, border: isSelected ? '2px solid white' : '2px solid ' + (isMapped ? '#3b82f6' : '#ef4444'), background: isSelected ? (isMapped ? '#3b82f6' : '#ef4444') : '#1f2937', color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>VP {vp}</div>
                    <div style={{ fontSize: 9, color: isSelected ? '#e0e7ff' : '#94a3b8' }}>{isMapped ? `→ PF ${mappings[vp]}` : 'Not loaded'}</div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Arrow & status */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            {virtualAddr !== null && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, color: pageFault ? '#ef4444' : '#22c55e' }}>
                  {pageFault ? '\u26A0\uFE0F' : '\u2192'}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: pageFault ? '#ef4444' : '#22c55e', marginTop: 8 }}>
                  {pageFault ? 'PAGE FAULT!' : 'MMU Translate'}
                </div>
                {pageFault && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    style={{ fontSize: 11, color: '#f97316', marginTop: 8 }}>
                    Loading from disk...
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          {/* Physical frames */}
          <div>
            <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Physical Frames (Real RAM)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {physicalFrames.map(pf => {
                const mappedVP = Object.entries(mappings).find(([_, v]) => v === pf);
                const isTarget = virtualAddr !== null && mappings[virtualAddr] === pf;
                return (
                  <motion.div key={pf}
                    animate={{ scale: isTarget ? 1.1 : 1, borderColor: isTarget ? '#22c55e' : mappedVP ? '#3b82f6' : '#374151' }}
                    style={{ width: 80, height: 56, borderRadius: 10, border: '2px solid', background: isTarget ? '#22c55e22' : mappedVP ? '#1f2937' : '#111827', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isTarget ? '#22c55e' : 'white' }}>PF {pf}</div>
                    <div style={{ fontSize: 9, color: '#94a3b8' }}>{mappedVP ? `VP ${mappedVP[0]}` : 'Free'}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div style={{ padding: 16, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <h4 style={{ margin: '0 0 6px', color: '#1d4ed8', fontSize: 14 }}>Isolation</h4>
          <p style={{ margin: 0, color: '#1e40af', lineHeight: 1.7, fontSize: 13 }}>Process A can't see Process B's memory. Each has its own page table mapping the same virtual addresses to different physical frames.</p>
        </div>
        <div style={{ padding: 16, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 6px', color: '#166534', fontSize: 14 }}>Overcommit</h4>
          <p style={{ margin: 0, color: '#15803d', lineHeight: 1.7, fontSize: 13 }}>Total virtual memory can exceed physical RAM. Rarely-used pages live on disk. The OS pages them in on demand via page faults.</p>
        </div>
        <div style={{ padding: 16, borderRadius: 12, background: '#f5f3ff', border: '1px solid #c4b5fd' }}>
          <h4 style={{ margin: '0 0 6px', color: '#6d28d9', fontSize: 14 }}>Sharing</h4>
          <p style={{ margin: 0, color: '#5b21b6', lineHeight: 1.7, fontSize: 13 }}>Multiple processes can map the same physical frame (shared libraries, shared memory). One copy of libc serves hundreds of processes.</p>
        </div>
      </div>
    </div>
  );
}

function Layer2() {
  const [addrInput, setAddrInput] = useState('0x00003A7F');
  const [showBreakdown, setShowBreakdown] = useState(false);

  const pageSize = 4096; // 4KB
  const addr = parseInt(addrInput, 16) || 0;
  const vpn = Math.floor(addr / pageSize);
  const offset = addr % pageSize;

  const l4 = (vpn >> 27) & 0x1FF;
  const l3 = (vpn >> 18) & 0x1FF;
  const l2 = (vpn >> 9) & 0x1FF;
  const l1 = vpn & 0x1FF;

  const walkSteps = [
    { level: 'PML4 (L4)', index: l4, desc: 'CR3 register points to PML4 table. Index with bits 47:39.', color: '#ef4444' },
    { level: 'PDPT (L3)', index: l3, desc: 'PML4 entry points to Page Directory Pointer Table. Index with bits 38:30.', color: '#f97316' },
    { level: 'PD (L2)', index: l2, desc: 'PDPT entry points to Page Directory. Index with bits 29:21.', color: '#3b82f6' },
    { level: 'PT (L1)', index: l1, desc: 'PD entry points to Page Table. Index with bits 20:12. Final entry has physical frame number.', color: '#22c55e' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Page Table Walk Simulator</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24, fontSize: 16 }}>
        x86-64 uses a <strong>4-level page table</strong> to translate 48-bit virtual addresses to physical addresses. Enter a virtual address to see how the MMU walks the page table hierarchy.
      </p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>Virtual Address:</div>
        <input value={addrInput} onChange={e => setAddrInput(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: 10, border: '2px solid #e2e8f0', fontFamily: 'monospace', fontSize: 16, width: 180, fontWeight: 700 }} />
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowBreakdown(true)}
          style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#3b82f6', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
          Walk Page Table
        </motion.button>
        {[['0x00003A7F', 'User Code'], ['0x7FFE1234', 'Stack'], ['0xFFFF8000', 'Kernel']].map(([a, label]) => (
          <button key={a} onClick={() => { setAddrInput(a); setShowBreakdown(false); }}
            style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', cursor: 'pointer', fontSize: 12 }}>
            {label}
          </button>
        ))}
      </div>

      {/* Address breakdown */}
      <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 12 }}>Address Breakdown (4KB pages):</div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'PML4 [47:39]', value: l4, color: '#ef4444', bits: 9 },
            { label: 'PDPT [38:30]', value: l3, color: '#f97316', bits: 9 },
            { label: 'PD [29:21]', value: l2, color: '#3b82f6', bits: 9 },
            { label: 'PT [20:12]', value: l1, color: '#22c55e', bits: 9 },
            { label: 'Offset [11:0]', value: offset, color: '#8b5cf6', bits: 12 },
          ].map(seg => (
            <div key={seg.label} style={{ flex: seg.bits === 12 ? 1.3 : 1, padding: '10px 8px', borderRadius: 8, background: seg.color + '12', border: '2px solid ' + seg.color, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: seg.color, fontWeight: 600 }}>{seg.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'monospace', color: '#1e293b' }}>0x{seg.value.toString(16).toUpperCase()}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>({seg.value})</div>
            </div>
          ))}
        </div>

        {showBreakdown && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 12 }}>Page Table Walk (4 memory accesses!):</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {walkSteps.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1, padding: '10px 14px', borderRadius: 8, background: step.color + '0a', borderLeft: '3px solid ' + step.color }}>
                    <div style={{ fontWeight: 700, color: step.color, fontSize: 14 }}>{step.level} — Index {step.index}</div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{step.desc}</div>
                  </div>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                style={{ padding: 12, borderRadius: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>Physical Address = Frame Number + Offset (0x{offset.toString(16).toUpperCase()})</div>
                <div style={{ fontSize: 12, color: '#15803d', marginTop: 4 }}>4 memory accesses just to translate! That's why the TLB cache exists.</div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca' }}>
          <h4 style={{ margin: '0 0 8px', color: '#991b1b' }}>Without TLB: 4 extra memory accesses</h4>
          <p style={{ margin: 0, color: '#b91c1c', lineHeight: 1.7, fontSize: 14 }}>
            Every memory access would need 4 page table lookups first, making memory 5x slower. Completely impractical.
          </p>
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 8px', color: '#166534' }}>With TLB: ~99% hit rate</h4>
          <p style={{ margin: 0, color: '#15803d', lineHeight: 1.7, fontSize: 14 }}>
            The TLB caches recent translations. L1 TLB: 64 entries, 1 cycle. L2 TLB: 1,536 entries, 7 cycles. Miss: full 4-level walk (~50 cycles).
          </p>
        </div>
      </div>
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'TLB (Translation Lookaside Buffer)', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>The TLB is a specialized cache that stores recent virtual-to-physical address translations, avoiding expensive page table walks.</p>
        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#1e293b' }}>
            <div><strong>L1 iTLB:</strong> 64 entries, instruction translations, 1 cycle</div>
            <div><strong>L1 dTLB:</strong> 64 entries, data translations, 1 cycle</div>
            <div><strong>L2 STLB:</strong> 1,536-2,048 entries, unified, 7-8 cycles</div>
            <div style={{ marginTop: 8 }}><strong>TLB miss cost:</strong> ~50 cycles (page table walk)</div>
            <div><strong>TLB miss + page fault:</strong> ~10,000,000 cycles (disk)</div>
            <div style={{ marginTop: 8 }}><strong>Huge pages (2MB/1GB):</strong></div>
            <div>Each TLB entry covers more memory:</div>
            <div>64 entries × 4KB = 256KB coverage</div>
            <div>64 entries × 2MB = 128MB coverage (512x more!)</div>
            <div>Databases, VMs, and HPC use huge pages to reduce TLB misses</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>TLB flushes happen on context switch (process switch changes the page table). PCID (Process Context ID) tags TLB entries with a process ID, avoiding full flushes. Spectre mitigations (KPTI) forced kernel/user TLB separation, increasing flush cost.</p>
      </div>
    )},
    { title: 'Page Table Entry Flags', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Each page table entry isn't just a physical address — it contains permission bits that the MMU checks on every access.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'Present (P)', desc: 'Page is in physical RAM. If clear, any access triggers a page fault. The OS uses this for demand paging.', color: '#22c55e' },
            { name: 'Read/Write (R/W)', desc: 'If clear, page is read-only. Writing triggers a fault. Used for copy-on-write and read-only code pages.', color: '#3b82f6' },
            { name: 'User/Supervisor (U/S)', desc: 'If clear, only ring 0 (kernel) can access. User-mode access triggers a fault. This is memory protection.', color: '#ef4444' },
            { name: 'No-Execute (NX)', desc: 'If set, code cannot execute from this page. Prevents buffer overflow attacks from running injected code on stack/heap.', color: '#f97316' },
            { name: 'Accessed (A)', desc: 'Hardware sets this when the page is read. The OS uses it to track working set and guide page replacement.', color: '#8b5cf6' },
            { name: 'Dirty (D)', desc: 'Hardware sets this when the page is written. The OS must write dirty pages back to disk before evicting them.', color: '#ec4899' },
          ].map(f => (
            <div key={f.name} style={{ padding: 12, borderRadius: 10, background: f.color + '08', border: '1px solid ' + f.color + '33' }}>
              <div style={{ fontWeight: 700, color: f.color, marginBottom: 4, fontSize: 14 }}>{f.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>These flags enable sophisticated memory tricks: copy-on-write fork (mark all pages read-only, fault on write, copy only modified pages), lazy allocation (mark present=0, allocate on first access), and memory-mapped files (fault loads file pages on demand).</p>
      </div>
    )},
    { title: 'Demand Paging & Replacement', color: '#f97316', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>The OS only loads pages into RAM when they're actually accessed. When RAM is full, it must choose a victim page to evict.</p>
        <div style={{ padding: 16, background: '#fff7ed', borderRadius: 12, border: '1px solid #fed7aa', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#9a3412' }}>
            <div><strong>Page Fault Handling:</strong></div>
            <div>1. CPU triggers exception #14 (page fault)</div>
            <div>2. Kernel reads faulting address from CR2 register</div>
            <div>3. Check: is this address valid for this process?</div>
            <div>   No → SIGSEGV (segfault), kill process</div>
            <div>   Yes → find the page (file, swap, zero-fill)</div>
            <div>4. Allocate a physical frame</div>
            <div>5. Read data into frame (disk I/O, ~10ms for HDD)</div>
            <div>6. Update page table entry (set Present bit)</div>
            <div>7. Restart the faulting instruction</div>
            <div style={{ marginTop: 8 }}><strong>Page Replacement Policies:</strong></div>
            <div>LRU approximation: clock algorithm (sweep Accessed bits)</div>
            <div>Linux uses "two-list" approach: active + inactive lists</div>
            <div>Pages demoted from active → inactive → evicted</div>
            <div>MGLRU (Multi-Gen LRU): Linux 6.1+ generational tracking</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Thrashing occurs when the working set exceeds physical RAM. The system constantly pages in and out, spending more time on page faults than useful work. The OOM (Out of Memory) killer terminates processes to recover.</p>
      </div>
    )},
    { title: 'Advanced VM Features', color: '#8b5cf6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Virtual memory enables powerful OS features beyond simple translation.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'Copy-on-Write (CoW)', desc: 'fork() shares all pages between parent and child, marked read-only. Only when one writes a page is it actually copied. Makes fork() nearly instant even for multi-GB processes.', color: '#3b82f6' },
            { name: 'Memory-Mapped Files (mmap)', desc: 'Map a file directly into virtual address space. Reads/writes go through the page cache. No explicit read()/write() calls. Used for shared libraries and database files.', color: '#22c55e' },
            { name: 'ASLR (Address Space Layout Randomization)', desc: 'Randomize where code, stack, heap, and libraries are mapped. Attackers can\'t predict addresses for exploits. Each process gets a different layout.', color: '#ef4444' },
            { name: 'Kernel Same-page Merging (KSM)', desc: 'Scan for identical physical pages across VMs/processes. Deduplicate by sharing with CoW. 10 VMs running the same OS share most of their memory. Huge for VM density.', color: '#8b5cf6' },
          ].map(f => (
            <div key={f.name} style={{ padding: 12, borderRadius: 10, background: f.color + '08', border: '1px solid ' + f.color + '33' }}>
              <div style={{ fontWeight: 700, color: f.color, marginBottom: 4, fontSize: 14 }}>{f.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Nested page tables (Intel EPT / AMD NPT) add a second level of translation for VMs: guest virtual → guest physical → host physical. Two page table walks per access, but hardware support keeps it fast.</p>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Virtual Memory Internals</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>The hardware and OS machinery behind address translation.</p>
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
      code={`import sys, os, mmap, ctypes

# === Every Python object lives in virtual memory ===
x = 42
s = "hello"
lst = [1, 2, 3]

print("Object virtual addresses:")
print(f"  int 42:    0x{id(x):016X}")
print(f"  str hello: 0x{id(s):016X}")
print(f"  list:      0x{id(lst):016X}")

# === Memory layout of a Python process ===
print(f"\\nProcess PID: {os.getpid()}")

# Virtual memory stats
import resource
usage = resource.getrusage(resource.RUSAGE_SELF)
print(f"Max RSS (peak physical): {usage.ru_maxrss} KB")
print(f"Page faults (no I/O):   {usage.ru_minflt}")
print(f"Page faults (disk I/O): {usage.ru_majflt}")

# === Demonstrating demand paging ===
# Allocate 10MB but don't touch it
size = 10 * 1024 * 1024
before_faults = resource.getrusage(resource.RUSAGE_SELF).ru_minflt

# This allocates virtual memory, NOT physical
big_list = bytearray(size)  
after_alloc = resource.getrusage(resource.RUSAGE_SELF).ru_minflt

# Touch every page to force physical allocation
for i in range(0, size, 4096):
    big_list[i] = 1
after_touch = resource.getrusage(resource.RUSAGE_SELF).ru_minflt

print(f"\\nDemand paging demo (10MB allocation):")
print(f"  Page faults from alloc: {after_alloc - before_faults}")
print(f"  Page faults from touch: {after_touch - after_alloc}")
print(f"  Expected pages: {size // 4096} ({size // 4096} × 4KB)")

# === Memory-mapped file ===
print(f"\\nPage size: {mmap.PAGESIZE} bytes")
print(f"Allocation granularity: {mmap.ALLOCATIONGRANULARITY} bytes")

# === Python's memory allocator (pymalloc) ===
# Uses arenas (256KB) of pools (4KB = 1 page!) of blocks
# Small objects (<= 512 bytes) use pymalloc
# Large objects use direct mmap()
print(f"\\nPython allocator info:")
print(f"  Small object threshold: 512 bytes")
print(f"  Arena size: 256 KB (64 pages)")
print(f"  Pool size: 4 KB (1 page - not a coincidence!)")
print(f"  sys.getallocatedblocks(): {sys.getallocatedblocks()}")`}
      explanation="Every Python object lives at a virtual address. id(x) literally returns the virtual address. Python's memory allocator (pymalloc) uses 4KB pools — exactly one page — so each pool maps cleanly to physical memory. Large allocations use mmap(), which creates new virtual mappings without copying. Demand paging means memory is only physically allocated when you touch it."
      hardwareNote="Python's pymalloc arena size (256KB) is chosen to fit in L2 cache. Pool size (4KB) matches the page size. When Python allocates a new arena, the OS returns virtual addresses backed by no physical memory. The first write to each page triggers a page fault, and the kernel allocates a physical frame — you can count these faults with resource.getrusage()."
    />
  );
}

function Layer5() {
  const apps = [
    { icon: '\u{1F4E6}', title: 'Docker & Containers',
      desc: 'Containers share the host kernel but get isolated virtual address spaces via namespaces. Memory cgroups limit how much physical RAM each container can use.',
      detail: 'When a container exceeds its memory limit, the cgroup OOM killer terminates processes inside it — without affecting other containers. This is virtual memory isolation at the OS level.' },
    { icon: '\u{1F5A5}\uFE0F', title: 'VM Memory Ballooning',
      desc: 'Hypervisors inflate a "balloon" driver inside the guest to reclaim physical pages. The guest thinks it\'s running out of memory and starts paging.',
      detail: 'The balloon driver allocates memory inside the guest (taking pages from the guest), then tells the hypervisor those physical frames are free to use. The guest OS manages the pressure through normal paging.' },
    { icon: '\u{1F9E0}', title: 'ML Training & Huge Pages',
      desc: 'PyTorch and TensorFlow allocate huge pages for GPU-bound memory. 2MB huge pages reduce TLB misses by 512x for large tensor operations.',
      detail: 'A 16GB model has 4 million 4KB pages but only 8,192 2MB huge pages. Fewer TLB entries needed = fewer TLB misses = faster memory access for random tensor access patterns.' },
    { icon: '\u{1F4BE}', title: 'Database Buffer Pools',
      desc: 'PostgreSQL and MySQL use mmap() or direct I/O with huge pages. The buffer pool is the database\'s own virtual memory manager on top of the OS.',
      detail: 'PostgreSQL shared_buffers maps database pages to RAM. It implements its own clock-sweep replacement, separate from the OS page cache. Double-buffering (DB + OS) wastes RAM — hence the push for O_DIRECT.' },
    { icon: '\u{1F50F}', title: 'Security: ASLR & NX',
      desc: 'ASLR randomizes memory layout so attackers can\'t predict where code or data lives. NX prevents execution of data pages (no shellcode on heap/stack).',
      detail: 'Without ASLR: every program loads at 0x400000. With ASLR: random base each run. Stack canaries + ASLR + NX makes buffer overflow exploitation extremely difficult (but not impossible — information leaks can defeat ASLR).' },
    { icon: '\u{1F4F1}', title: 'Mobile Memory Compression',
      desc: 'iOS and Android compress inactive pages in RAM instead of swapping to flash. zram creates a compressed block device in memory. 2-3x effective RAM.',
      detail: 'Flash storage on phones has limited write endurance. Swap would wear it out. zram compresses pages at ~2:1 ratio, effectively doubling available RAM. macOS uses a similar compressed memory system.' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Virtual Memory Is Everywhere</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>From containers to databases to security — virtual memory is the foundation of modern computing.</p>
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
        <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>ADDRESS SPACE SIZES</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginTop: 16 }}>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#ef4444' }}>16-bit</div><div style={{ fontSize: 11, color: '#94a3b8' }}>64 KB (8086)</div></div>
          <div style={{ fontSize: 18, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#f97316' }}>32-bit</div><div style={{ fontSize: 11, color: '#94a3b8' }}>4 GB (386-Pentium)</div></div>
          <div style={{ fontSize: 18, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#3b82f6' }}>48-bit</div><div style={{ fontSize: 11, color: '#94a3b8' }}>256 TB (x86-64 current)</div></div>
          <div style={{ fontSize: 18, color: '#374151' }}>&rarr;</div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e' }}>57-bit</div><div style={{ fontSize: 11, color: '#94a3b8' }}>128 PB (5-level paging)</div></div>
        </div>
      </div>
    </div>
  );
}

export default function L14_VirtualMemory() {
  return (
    <LessonWrapper lessonId="L14" title="Virtual Memory"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'Library Card Catalog', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'Page Table Walk', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'TLB, Flags & Paging', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python & Virtual Memory', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'VM Powers Everything', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'TLB Math', description: 'A TLB has 1,024 entries with 4KB pages. How much virtual memory can it cover? How about with 2MB huge pages?' },
        { id: 'c2', title: 'Page Table Size', description: 'A 48-bit virtual address space with 4KB pages needs how many page table entries if fully populated? Why do multi-level tables save space?' },
        { id: 'c3', title: 'CoW fork()', description: 'A process using 1GB of RAM calls fork(). How much physical memory does the child initially use? When does that change?' },
      ]}
    />
  );
}
