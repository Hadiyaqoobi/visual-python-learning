"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [addresses, setAddresses] = useState<number[]>([]);
  const [cache, setCache] = useState<Array<{ tag: number; data: string; valid: boolean }>>(
    Array.from({ length: 8 }, () => ({ tag: -1, data: '', valid: false }))
  );
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [lastResult, setLastResult] = useState('');
  const [lastAddr, setLastAddr] = useState(-1);

  const access = (addr: number) => {
    const line = addr % 8;
    const tag = Math.floor(addr / 8);
    setLastAddr(addr);
    setAddresses(prev => [...prev.slice(-11), addr]);
    if (cache[line].valid && cache[line].tag === tag) {
      setHits(h => h + 1);
      setLastResult('HIT! Address ' + addr + ' found in cache line ' + line);
    } else {
      setMisses(m => m + 1);
      setLastResult('MISS. Address ' + addr + ' not in cache. Loading into line ' + line);
      setCache(prev => prev.map((c, i) => i === line ? { tag, data: 'data_' + addr, valid: true } : c));
    }
  };

  const presets = [
    { name: 'Sequential', addrs: [0,1,2,3,4,5,6,7,0,1,2,3], desc: 'Great locality' },
    { name: 'Strided', addrs: [0,8,16,24,0,8,16,24], desc: 'Conflict misses!' },
    { name: 'Random', addrs: [3,17,8,3,25,8,42,3,17,8], desc: 'Some reuse' },
  ];

  const reset = () => { setCache(Array.from({ length: 8 }, () => ({ tag: -1, data: '', valid: false }))); setHits(0); setMisses(0); setAddresses([]); setLastResult(''); setLastAddr(-1); };

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Cache: Your CPU's Short-Term Memory</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        Imagine a librarian who keeps the <strong>most recently requested books</strong> on a small shelf behind the counter. If someone asks for a book on the shelf, they get it instantly (<strong>cache hit</strong>). If not, they must walk to the stacks (<strong>cache miss</strong>).
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        A CPU cache stores recently accessed data in fast SRAM. The CPU checks the cache first; only on a miss does it go to slow DRAM. Hit rates of <strong>95-99%</strong> mean the CPU rarely waits.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        Try accessing memory addresses below. Each address maps to a cache line (address mod 8). Watch how hits and misses change with the access pattern.
      </p>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 24, border: '1px solid #334155' }}>
        <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, textAlign: 'center' }}>8-line Direct-Mapped Cache</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6, marginBottom: 24 }}>
          {cache.map((line, i) => (
            <motion.div key={i}
              animate={{ borderColor: lastAddr >= 0 && lastAddr % 8 === i ? '#22c55e' : line.valid ? '#3b82f6' : '#374151', boxShadow: lastAddr >= 0 && lastAddr % 8 === i ? '0 0 20px #22c55e44' : 'none' }}
              style={{ padding: '10px 8px', borderRadius: 10, background: '#1f2937', border: '2px solid', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#64748b' }}>Line {i}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: line.valid ? '#3b82f6' : '#374151', fontFamily: 'monospace' }}>
                {line.valid ? 'T:' + line.tag : 'empty'}
              </div>
              <div style={{ fontSize: 9, color: '#475569' }}>{line.valid ? line.data : '-'}</div>
            </motion.div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {[0,1,2,3,4,5,8,9,16,17,24,25].map(addr => (
            <motion.button key={addr} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={() => access(addr)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #475569', background: '#374151', color: '#e2e8f0', cursor: 'pointer', fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>
              [{addr}]
            </motion.button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          {presets.map(p => (
            <motion.button key={p.name} whileHover={{ scale: 1.05 }} onClick={() => { reset(); p.addrs.forEach((a, i) => setTimeout(() => access(a), i * 300)); }}
              style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#22c55e22', color: '#22c55e', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
              {p.name} <span style={{ fontSize: 10, opacity: 0.7 }}>({p.desc})</span>
            </motion.button>
          ))}
          <button onClick={reset} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 12 }}>Reset</button>
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 800, color: '#22c55e' }}>{hits}</div><div style={{ fontSize: 11, color: '#64748b' }}>Hits</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 800, color: '#ef4444' }}>{misses}</div><div style={{ fontSize: 11, color: '#64748b' }}>Misses</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 800, color: '#3b82f6' }}>{hits + misses > 0 ? Math.round(hits / (hits + misses) * 100) : 0}%</div><div style={{ fontSize: 11, color: '#64748b' }}>Hit Rate</div></div>
        </div>
        {lastResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', fontSize: 13, color: lastResult.includes('HIT') ? '#22c55e' : '#ef4444', fontFamily: 'monospace' }}>
            {lastResult}
          </motion.div>
        )}
      </div>

      {addresses.length > 0 && (
        <div style={{ marginBottom: 24, padding: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Access History:</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {addresses.map((a, i) => (
              <span key={i} style={{ padding: '2px 8px', borderRadius: 4, background: '#e2e8f0', fontFamily: 'monospace', fontSize: 12, color: '#1e293b' }}>{a}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 8px', color: '#166534' }}>Cache Hit = Fast</h4>
          <p style={{ margin: 0, color: '#15803d', lineHeight: 1.7, fontSize: 14 }}>Data returned in 1-4 cycles (~1 ns). No trip to slow DRAM. Good patterns achieve 95-99% hit rates.</p>
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca' }}>
          <h4 style={{ margin: '0 0 8px', color: '#991b1b' }}>Cache Miss = Slow</h4>
          <p style={{ margin: 0, color: '#b91c1c', lineHeight: 1.7, fontSize: 14 }}>CPU must fetch from DRAM (~50 ns = 200 cycles). Conflict misses occur when different addresses map to the same line.</p>
        </div>
      </div>
    </div>
  );
}

function Layer2() {
  const [mapping, setMapping] = useState<'direct' | 'assoc' | 'setassoc'>('direct');
  const [cache, setCache] = useState<Array<{ tag: number; valid: boolean; lru: number }>>(
    Array.from({ length: 8 }, () => ({ tag: -1, valid: false, lru: 0 }))
  );
  const [accessLog, setAccessLog] = useState<Array<{ addr: number; hit: boolean; line: number }>>([]);
  const [accessCount, setAccessCount] = useState(0);
  const cacheLines = 8;

  const resetCache = () => { setCache(Array.from({ length: cacheLines }, () => ({ tag: -1, valid: false, lru: 0 }))); setAccessLog([]); setAccessCount(0); };
  useEffect(() => resetCache(), [mapping]);

  const accessAddr = (addr: number) => {
    const count = accessCount + 1;
    setAccessCount(count);
    if (mapping === 'direct') {
      const line = addr % cacheLines;
      const tag = Math.floor(addr / cacheLines);
      const isHit = cache[line].valid && cache[line].tag === tag;
      setCache(prev => prev.map((c, i) => i === line ? (isHit ? { ...c, lru: count } : { tag, valid: true, lru: count }) : c));
      setAccessLog(prev => [...prev.slice(-15), { addr, hit: isHit, line }]);
    } else if (mapping === 'assoc') {
      const hitIdx = cache.findIndex(c => c.valid && c.tag === addr);
      if (hitIdx >= 0) {
        setCache(prev => prev.map((c, i) => i === hitIdx ? { ...c, lru: count } : c));
        setAccessLog(prev => [...prev.slice(-15), { addr, hit: true, line: hitIdx }]);
      } else {
        const emptyIdx = cache.findIndex(c => !c.valid);
        const evictIdx = emptyIdx >= 0 ? emptyIdx : cache.reduce((min, c, i) => c.lru < cache[min].lru ? i : min, 0);
        setCache(prev => prev.map((c, i) => i === evictIdx ? { tag: addr, valid: true, lru: count } : c));
        setAccessLog(prev => [...prev.slice(-15), { addr, hit: false, line: evictIdx }]);
      }
    } else {
      const sets = cacheLines / 2;
      const setIdx = addr % sets;
      const way0 = setIdx * 2, way1 = setIdx * 2 + 1;
      const tag = Math.floor(addr / sets);
      const hit0 = cache[way0].valid && cache[way0].tag === tag;
      const hit1 = cache[way1].valid && cache[way1].tag === tag;
      if (hit0) {
        setCache(prev => prev.map((c, i) => i === way0 ? { ...c, lru: count } : c));
        setAccessLog(prev => [...prev.slice(-15), { addr, hit: true, line: way0 }]);
      } else if (hit1) {
        setCache(prev => prev.map((c, i) => i === way1 ? { ...c, lru: count } : c));
        setAccessLog(prev => [...prev.slice(-15), { addr, hit: true, line: way1 }]);
      } else {
        const evict = !cache[way0].valid ? way0 : !cache[way1].valid ? way1 : cache[way0].lru < cache[way1].lru ? way0 : way1;
        setCache(prev => prev.map((c, i) => i === evict ? { tag, valid: true, lru: count } : c));
        setAccessLog(prev => [...prev.slice(-15), { addr, hit: false, line: evict }]);
      }
    }
  };

  const hitCount = accessLog.filter(l => l.hit).length;
  const missCount = accessLog.filter(l => !l.hit).length;

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Cache Mapping Strategies</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
        Compare three strategies for mapping memory addresses to cache lines. Each trades simplicity vs hit rate vs hardware cost.
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {([['direct', 'Direct-Mapped', '#3b82f6'], ['assoc', 'Fully Associative', '#22c55e'], ['setassoc', '2-Way Set Assoc', '#8b5cf6']] as const).map(([key, label, color]) => (
          <motion.button key={key} whileHover={{ scale: 1.05 }} onClick={() => setMapping(key)}
            style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: mapping === key ? color : '#f1f5f9', color: mapping === key ? 'white' : '#334155', fontWeight: 700, fontSize: 13 }}>
            {label}
          </motion.button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div style={{ padding: 20, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 12 }}>
            {mapping === 'direct' ? 'Direct-Mapped' : mapping === 'assoc' ? 'Fully Associative' : '2-Way Set Associative'} ({cacheLines} lines)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mapping === 'setassoc' ? 'auto 1fr 1fr' : 'repeat(2, 1fr)', gap: 6 }}>
            {mapping === 'setassoc' ? (
              Array.from({ length: cacheLines / 2 }, (_, s) => (
                <React.Fragment key={s}>
                  <div style={{ padding: 8, display: 'flex', alignItems: 'center', fontSize: 11, color: '#64748b', fontWeight: 600 }}>Set {s}</div>
                  {[0, 1].map(w => {
                    const idx = s * 2 + w;
                    const line = cache[idx];
                    const isRecent = accessLog.length > 0 && accessLog[accessLog.length - 1].line === idx;
                    return (
                      <motion.div key={w} animate={{ borderColor: isRecent ? '#8b5cf6' : line.valid ? '#3b82f6' : '#e2e8f0' }}
                        style={{ padding: '8px 10px', borderRadius: 8, background: 'white', border: '2px solid', textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: '#64748b' }}>Way {w}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: line.valid ? '#1e293b' : '#cbd5e1', fontFamily: 'monospace' }}>{line.valid ? 'T:' + line.tag : '-'}</div>
                      </motion.div>
                    );
                  })}
                </React.Fragment>
              ))
            ) : (
              cache.map((line, i) => {
                const isRecent = accessLog.length > 0 && accessLog[accessLog.length - 1].line === i;
                return (
                  <motion.div key={i} animate={{ borderColor: isRecent ? '#22c55e' : line.valid ? '#3b82f6' : '#e2e8f0' }}
                    style={{ padding: '8px 10px', borderRadius: 8, background: 'white', border: '2px solid', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Line {i}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: line.valid ? '#1e293b' : '#cbd5e1', fontFamily: 'monospace' }}>{line.valid ? 'T:' + line.tag : '-'}</div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        <div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>Access Address (0-31):</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4 }}>
              {Array.from({ length: 32 }, (_, i) => (
                <motion.button key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => accessAddr(i)}
                  style={{ padding: '6px 2px', borderRadius: 6, border: 'none', background: '#f1f5f9', color: '#334155', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>{i}</motion.button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <div style={{ textAlign: 'center', flex: 1, padding: 8, borderRadius: 8, background: '#f0fdf4' }}><div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e' }}>{hitCount}</div><div style={{ fontSize: 10, color: '#64748b' }}>Hits</div></div>
            <div style={{ textAlign: 'center', flex: 1, padding: 8, borderRadius: 8, background: '#fef2f2' }}><div style={{ fontSize: 18, fontWeight: 800, color: '#ef4444' }}>{missCount}</div><div style={{ fontSize: 10, color: '#64748b' }}>Misses</div></div>
            <div style={{ textAlign: 'center', flex: 1, padding: 8, borderRadius: 8, background: '#eff6ff' }}><div style={{ fontSize: 18, fontWeight: 800, color: '#3b82f6' }}>{accessLog.length > 0 ? Math.round(hitCount / accessLog.length * 100) : 0}%</div><div style={{ fontSize: 10, color: '#64748b' }}>Rate</div></div>
          </div>
          <button onClick={resetCache} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', fontSize: 12 }}>Reset</button>
          {accessLog.length > 0 && (
            <div style={{ marginTop: 12, maxHeight: 120, overflowY: 'auto', fontSize: 11, fontFamily: 'monospace' }}>
              {accessLog.map((l, i) => (<div key={i} style={{ color: l.hit ? '#22c55e' : '#ef4444' }}>[{l.addr}] line {l.line}: {l.hit ? 'HIT' : 'MISS'}</div>))}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: 20, borderRadius: 12, background: '#f5f3ff', border: '1px solid #c4b5fd' }}>
        <h4 style={{ margin: '0 0 8px', color: '#6d28d9' }}>Mapping Tradeoffs:</h4>
        <p style={{ margin: 0, color: '#5b21b6', lineHeight: 1.8, fontSize: 14 }}>
          <strong>Direct-mapped:</strong> 1 possible location. Simple but conflict-prone.
          <strong> Fully associative:</strong> Any location. Best hit rate, expensive hardware (N comparators).
          <strong> Set-associative:</strong> N-way compromise. Modern CPUs use 8-16 way.
        </p>
      </div>
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'Cache Line Structure', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Caches move <strong>cache lines</strong> (64 bytes), not individual bytes. Access one byte and the whole 64-byte block is fetched, exploiting spatial locality.</p>
        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#1e293b' }}>
            <div><strong>Address breakdown (64B lines, 256 sets, 8-way):</strong></div>
            <div>[Tag: 20 bits | Set Index: 8 bits | Offset: 6 bits]</div>
            <div style={{ marginTop: 8 }}>Offset (6 bits): byte within 64-byte line</div>
            <div>Set Index (8 bits): which set (0-255) to check</div>
            <div>Tag (20 bits): identifies which block is stored</div>
            <div style={{ marginTop: 8 }}><strong>L1: 64 KB = 1,024 lines. L3: 32 MB = 524,288 lines.</strong></div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>64-byte lines match one DDR burst transfer. Smaller lines waste bandwidth overhead; larger lines fetch unneeded data.</p>
      </div>
    )},
    { title: 'Replacement Policies', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>When a set is full, which line gets evicted?</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'LRU', desc: 'Evict least recently used. Tracks access order. Expensive at high associativity (needs log2(N!) bits).', color: '#22c55e' },
            { name: 'Pseudo-LRU', desc: 'Tree-based approximation. Only N-1 bits per set. Nearly as good as true LRU. Used in most real CPUs.', color: '#3b82f6' },
            { name: 'Random', desc: 'Evict random line. Surprisingly effective — within 1-2% of LRU. No tracking overhead. Used in some ARM caches.', color: '#f97316' },
            { name: 'FIFO', desc: 'Evict oldest line. Simple counter. Can suffer Belady anomaly. Rarely used alone in modern hardware.', color: '#8b5cf6' },
          ].map(p => (
            <div key={p.name} style={{ padding: 12, borderRadius: 10, background: p.color + '08', border: '1px solid ' + p.color + '33' }}>
              <div style={{ fontWeight: 700, color: p.color, marginBottom: 4, fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    )},
    { title: 'Write Policies', color: '#f97316', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>When the CPU writes, what happens to cache and memory?</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ padding: 14, borderRadius: 10, background: '#fff7ed', border: '1px solid #fed7aa' }}>
            <div style={{ fontWeight: 700, color: '#c2410c', marginBottom: 4 }}>Write-Through</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.8 }}>Write to both cache AND memory. Simple but slow. Mitigated by write buffers. Used in some L1 caches.</div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: '#fff7ed', border: '1px solid #fed7aa' }}>
            <div style={{ fontWeight: 700, color: '#c2410c', marginBottom: 4 }}>Write-Back</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.8 }}>Write only to cache, mark "dirty." Flush to memory on eviction. Much faster. Used in most L2/L3 caches.</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>On write miss: "write-allocate" loads the line first (pairs with write-back). "No-write-allocate" writes directly to memory (pairs with write-through).</p>
      </div>
    )},
    { title: 'Cache Coherency (Multi-Core)', color: '#ef4444', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Each core has its own L1/L2. If Core 0 writes address X, Core 1's cached copy is stale. The MESI protocol solves this:</p>
        <div style={{ padding: 16, background: '#fef2f2', borderRadius: 12, border: '1px solid #fecaca', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2.2, color: '#991b1b' }}>
            <div><strong>Modified:</strong> Only copy, dirty. Must write back before sharing.</div>
            <div><strong>Exclusive:</strong> Only copy, clean. Can write without bus traffic.</div>
            <div><strong>Shared:</strong> Multiple copies, all clean. Read-only.</div>
            <div><strong>Invalid:</strong> Not valid (or invalidated by another core).</div>
            <div style={{ marginTop: 8 }}>Core 0 writes → its line = Modified, all others = Invalid.</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}><strong>False sharing:</strong> Two cores write different variables on the same cache line. Each write invalidates the other's copy — constant misses even with no actual data sharing. A major multithreaded performance pitfall.</p>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Cache Architecture Details</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>The engineering that makes caches fast and correct.</p>
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

# === Cache-friendly vs cache-unfriendly ===
N = 1000
matrix = [[0]*N for _ in range(N)]

# Row-major (sequential in memory = cache-friendly)
t0 = time.perf_counter()
for row in range(N):
    for col in range(N):
        matrix[row][col] = 1
row_time = time.perf_counter() - t0

# Column-major (strided access = cache-unfriendly)
t0 = time.perf_counter()
for col in range(N):
    for row in range(N):
        matrix[row][col] = 1
col_time = time.perf_counter() - t0

print(f"Row-major: {row_time*1000:.1f}ms")
print(f"Col-major: {col_time*1000:.1f}ms")
print(f"Column is {col_time/row_time:.1f}x slower!")

# === Cache line demo ===
arr = list(range(1000000))
t0 = time.perf_counter()
for i in range(1000000): _ = arr[i]
seq = time.perf_counter() - t0

t0 = time.perf_counter()
for i in range(0, 1000000, 16): _ = arr[i]
skip = time.perf_counter() - t0

print(f"Sequential: {seq*1000:.1f}ms (1M accesses)")
print(f"Stride-16:  {skip*1000:.1f}ms (62.5K)")
print(f"Ratio: {seq/skip:.1f}x (not 16x!)")
# Cache loads 64 bytes at a time either way

# === Python object overhead ===
import sys
print(f"int:   {sys.getsizeof(42)} bytes")   # 28!
print(f"float: {sys.getsizeof(1.0)} bytes")  # 24!
print(f"list:  {sys.getsizeof([])} bytes")   # 56!
# Python int = 28 bytes vs C int = 4 bytes
# 7x more cache pressure per integer`}
      explanation="Row-major access walks memory sequentially, reusing cache lines. Column-major jumps by N elements, causing misses every access. In Python this is 2-5x; in C/Fortran it can be 10-100x. Python objects are also bloated: a Python int is 28 bytes vs 4 bytes in C, so fewer fit in cache."
      hardwareNote="Cache line = 64 bytes = 8 Python pointers. Accessing arr[0] loads arr[0]-arr[7] into one line. Sequential access gets 7 free hits per miss. Stride-16 wastes 15/16 of every loaded line. Data layout often matters more than algorithm choice."
    />
  );
}

function Layer5() {
  const apps = [
    { icon: '\u{1F3AE}', title: 'Game Engine ECS',
      desc: 'Entity Component Systems store components in contiguous arrays. Iterating all positions = perfect cache line utilization.',
      detail: 'Unreal Engine 5 Mass Entity: components packed in 16KB chunks matching L1. 100K entities in <1ms vs >10ms with scattered objects.' },
    { icon: '\u{1F4CA}', title: 'Database Query Processing',
      desc: 'Column-store databases (Redshift, BigQuery) store each column contiguously. A query touching 3 of 100 columns only loads those 3.',
      detail: 'Analytics on columnar stores is 10-100x faster. "SELECT AVG(price) FROM sales" reads only the price column — perfect cache behavior.' },
    { icon: '\u{1F9E0}', title: 'Neural Network Inference',
      desc: 'Matrix multiply uses cache-blocked (tiled) algorithms. Sub-matrices sized to fit L1 achieve 90%+ of peak FLOPS.',
      detail: 'Naive 4096x4096 matmul: ~5s. With L1 blocking: ~0.5s. Same math, 10x faster from cache alone.' },
    { icon: '\u{1F310}', title: 'Web Browser V8 Engine',
      desc: 'Chrome V8 uses hidden classes and inline caches so property access hits the same cache line repeatedly.',
      detail: 'DOM nodes allocated in arenas (contiguous memory) for cache-friendly tree traversal. Style calculation accesses properties in cache-optimal order.' },
    { icon: '\u{1F4BB}', title: 'Linux Kernel',
      desc: 'Kernel structures sized to cache lines. task_struct has hot fields in the first 64 bytes. SLUB allocator aligns to cache lines.',
      detail: 'Per-CPU caches avoid coherency traffic. Scheduler uses per-core run queues to prevent false sharing between cores.' },
    { icon: '\u26A1', title: 'High-Frequency Trading',
      desc: 'HFT pre-loads market data into cache before market open. Custom allocators ensure related data shares cache lines.',
      detail: 'CPU pinning, huge pages (2MB vs 4KB), NUMA-aware allocation. Data structures designed cache-line-first, algorithm-second.' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Caches Are Everywhere</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>The cache principle — keep frequently used data close — appears at every level of computing.</p>
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
        <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>THE THREE CACHE MISS TYPES</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', marginTop: 16 }}>
          <div><div style={{ fontSize: 24, fontWeight: 800, color: '#ef4444' }}>Compulsory</div><div style={{ fontSize: 13, color: '#94a3b8' }}>First access ever (cold)</div></div>
          <div><div style={{ fontSize: 24, fontWeight: 800, color: '#f97316' }}>Capacity</div><div style={{ fontSize: 13, color: '#94a3b8' }}>Working set too large</div></div>
          <div><div style={{ fontSize: 24, fontWeight: 800, color: '#8b5cf6' }}>Conflict</div><div style={{ fontSize: 13, color: '#94a3b8' }}>Multiple addrs same set</div></div>
        </div>
      </div>
    </div>
  );
}

export default function L09_CacheSystem() {
  return (
    <LessonWrapper lessonId="L09" title="Cache Systems"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'The Librarian', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'Mapping Strategies', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'Architecture', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python & Cache', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'Caches Everywhere', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'Conflict Miss', description: 'In a direct-mapped cache with 8 lines, which addresses conflict with address 3?' },
        { id: 'c2', title: 'Cache Line Math', description: 'A 32KB cache with 64-byte lines has how many lines? With 8-way, how many sets?' },
        { id: 'c3', title: 'False Sharing', description: 'Two threads update adjacent array elements. Why is this slow on multi-core CPUs?' },
      ]}
    />
  );
}
