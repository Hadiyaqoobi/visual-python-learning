"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonWrapper } from '../core/LessonWrapper';
import { PythonConnection } from '../core/PythonConnection';

function Layer1() {
  const [switches, setSwitches] = useState([false, false, false, false, false, false, false, false]);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    if (!animating) return;
    const timer = setInterval(() => {
      setSwitches(prev => {
        const num = prev.reduce((acc, b, i) => acc + (b ? 1 << (7 - i) : 0), 0);
        const next = (num + 1) % 256;
        return Array.from({ length: 8 }, (_, i) => !!(next & (1 << (7 - i))));
      });
    }, 300);
    return () => clearInterval(timer);
  }, [animating]);

  const decimalValue = switches.reduce((acc, b, i) => acc + (b ? 1 << (7 - i) : 0), 0);
  const toggleBit = (idx: number) => {
    setAnimating(false);
    setSwitches(prev => prev.map((b, i) => i === idx ? !b : b));
  };

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Light Switches: The Language of Computers</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        Imagine a room with 8 light switches. Each switch can only be <strong>ON</strong> or <strong>OFF</strong> — there is no dimmer, no halfway. This is exactly how computers store every piece of information: as patterns of on/off signals called <strong>bits</strong>.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 8, fontSize: 16 }}>
        A single bit can represent 2 values (0 or 1). Two bits give you 4 combinations. Three bits give 8. With 8 bits (one <strong>byte</strong>), you get 256 possible patterns — enough to represent every letter, digit, and symbol you can type.
      </p>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
        Click the switches below to create different numbers. Each switch represents a <strong>power of 2</strong> — this is why computers use binary: transistors are tiny switches that are either conducting electricity (1) or not (0).
      </p>

      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, marginBottom: 32, border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
          {['128','64','32','16','8','4','2','1'].map((p, i) => (
            <div key={i} style={{ width: 56, textAlign: 'center', fontSize: 11, color: '#64748b', fontWeight: 600 }}>{p}</div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 24 }}>
          {switches.map((on, i) => (
            <motion.button key={i} onClick={() => toggleBit(i)}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              animate={{
                background: on ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #374151, #1f2937)',
                boxShadow: on ? '0 0 20px #22c55e66' : '0 0 5px rgba(0,0,0,0.3)'
              }}
              style={{ width: 56, height: 72, borderRadius: 12, border: on ? '2px solid #22c55e' : '2px solid #4b5563', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'white', fontFamily: 'monospace' }}>{on ? '1' : '0'}</div>
              <div style={{ fontSize: 9, color: on ? '#86efac' : '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>{on ? 'ON' : 'OFF'}</div>
            </motion.button>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <motion.div key={decimalValue} initial={{ scale: 1.3, color: '#22c55e' }} animate={{ scale: 1, color: '#ffffff' }}
            style={{ fontSize: 48, fontWeight: 800, fontFamily: 'monospace', marginBottom: 8 }}>{decimalValue}</motion.div>
          <div style={{ fontSize: 14, color: '#64748b' }}>
            Binary: <span style={{ color: '#22c55e', fontFamily: 'monospace', fontWeight: 600 }}>{switches.map(b => b ? '1' : '0').join('')}</span>
            {' | '}Hex: <span style={{ color: '#8b5cf6', fontFamily: 'monospace', fontWeight: 600 }}>0x{decimalValue.toString(16).toUpperCase().padStart(2, '0')}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          <button onClick={() => { setAnimating(false); setSwitches([false,false,false,false,false,false,false,false]); }}
            style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 12 }}>Clear All</button>
          <button onClick={() => { setAnimating(false); setSwitches([true,true,true,true,true,true,true,true]); }}
            style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 12 }}>All On (255)</button>
          <button onClick={() => setAnimating(!animating)}
            style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: animating ? '#ef4444' : '#22c55e', color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            {animating ? 'Stop Counting' : 'Auto Count'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 8px', color: '#166534', fontSize: 15 }}>Why Binary?</h4>
          <p style={{ margin: 0, color: '#15803d', lineHeight: 1.7, fontSize: 14 }}>
            Transistors — the building blocks of CPUs — are tiny switches. They are either ON (conducting electricity = 1) or OFF (not conducting = 0). There is no "2" or "3". By combining billions of these switches, computers represent everything: numbers, text, images, video, code.
          </p>
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <h4 style={{ margin: '0 0 8px', color: '#1d4ed8', fontSize: 15 }}>Powers of 2</h4>
          <p style={{ margin: 0, color: '#1e40af', lineHeight: 1.7, fontSize: 14 }}>
            Each bit position represents a power of 2 (1, 2, 4, 8, 16, 32, 64, 128). To convert binary to decimal, add up the powers where the bit is 1. For example: 10110 = 16 + 4 + 2 = 22. This is called positional notation — same idea as decimal but base-2.
          </p>
        </div>
      </div>
    </div>
  );
}

function Layer2() {
  const [decimal, setDecimal] = useState(42);
  const [inputText, setInputText] = useState('Hello');
  const [showASCII, setShowASCII] = useState(false);

  const toBin = (n: number) => Math.max(0, Math.min(255, n)).toString(2).padStart(8, '0');
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).toUpperCase().padStart(2, '0');

  const conversions = [
    { base: 'Binary (base 2)', value: toBin(decimal), color: '#22c55e', prefix: '0b' },
    { base: 'Octal (base 8)', value: decimal.toString(8), color: '#f97316', prefix: '0o' },
    { base: 'Decimal (base 10)', value: decimal.toString(), color: '#3b82f6', prefix: '' },
    { base: 'Hexadecimal (base 16)', value: toHex(decimal), color: '#8b5cf6', prefix: '0x' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Number System Playground</h2>
      <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
        The same number can be written in different bases. Drag the slider and watch all representations update simultaneously.
      </p>

      <div style={{ padding: 24, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: 8 }}>
          Value: <span style={{ fontSize: 32, fontFamily: 'monospace', color: '#3b82f6' }}>{decimal}</span>
        </label>
        <input type="range" min={0} max={255} value={decimal} onChange={e => setDecimal(+e.target.value)}
          style={{ width: '100%', accentColor: '#3b82f6', marginBottom: 16 }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[0, 1, 10, 42, 65, 100, 127, 128, 200, 255].map(v => (
            <button key={v} onClick={() => setDecimal(v)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: decimal === v ? '#3b82f6' : 'white', color: decimal === v ? 'white' : '#475569', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 32 }}>
        {conversions.map(c => (
          <motion.div key={c.base} layout
            style={{ padding: 20, borderRadius: 12, background: 'white', border: '2px solid ' + c.color + '33', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{c.base}</div>
            <motion.div key={c.value} initial={{ scale: 1.2 }} animate={{ scale: 1 }}
              style={{ fontSize: 28, fontWeight: 800, fontFamily: 'monospace', color: c.color }}>{c.prefix}{c.value}</motion.div>
          </motion.div>
        ))}
      </div>

      <div style={{ padding: 24, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Bit-by-Bit Breakdown</h3>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 8 }}>
          {toBin(decimal).split('').map((bit, i) => {
            const power = 7 - i;
            const val = Math.pow(2, power);
            const isSet = bit === '1';
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>2^{power}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>{val}</div>
                <motion.div animate={{ background: isSet ? '#22c55e' : '#e2e8f0', color: isSet ? 'white' : '#94a3b8' }}
                  style={{ width: 44, height: 44, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, fontFamily: 'monospace' }}>{bit}</motion.div>
                <div style={{ fontSize: 11, color: isSet ? '#22c55e' : '#e2e8f0', fontWeight: 700, marginTop: 4 }}>{isSet ? val : 0}</div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 14, color: '#475569' }}>
          {toBin(decimal).split('').map((bit, i) => bit === '1' ? Math.pow(2, 7 - i) : null).filter(Boolean).join(' + ')} = <strong>{decimal}</strong>
        </div>
      </div>

      <div style={{ padding: 24, borderRadius: 16, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700, color: '#1d4ed8' }}>Text to Binary</h3>
        <p style={{ color: '#1e40af', fontSize: 14, marginBottom: 12 }}>Every character has an ASCII code (a number 0-127). Type below to see text as binary:</p>
        <input type="text" value={inputText} onChange={e => setInputText(e.target.value.slice(0, 12))}
          style={{ padding: '10px 16px', borderRadius: 8, border: '2px solid #bfdbfe', fontSize: 16, width: '100%', marginBottom: 12, fontFamily: 'monospace' }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {inputText.split('').map((ch, i) => (
            <div key={i} style={{ padding: 10, borderRadius: 8, background: 'white', border: '1px solid #bfdbfe', textAlign: 'center', minWidth: 70 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1d4ed8', marginBottom: 4 }}>{ch}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>ASCII {ch.charCodeAt(0)}</div>
              <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#22c55e', marginTop: 2 }}>{ch.charCodeAt(0).toString(2).padStart(8, '0')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Layer3() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const sections = [
    { title: 'Positional Notation', color: '#3b82f6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Binary works exactly like decimal, but with base 2 instead of base 10. In decimal, the number 347 means 3x100 + 4x10 + 7x1. In binary, 1011 means 1x8 + 0x4 + 1x2 + 1x1 = 11.</p>
        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 14, lineHeight: 2.2, color: '#1e293b' }}>
            <div><strong>Decimal 347:</strong> 3x10<sup>2</sup> + 4x10<sup>1</sup> + 7x10<sup>0</sup> = 300 + 40 + 7</div>
            <div><strong>Binary 1011:</strong> 1x2<sup>3</sup> + 0x2<sup>2</sup> + 1x2<sup>1</sup> + 1x2<sup>0</sup> = 8 + 0 + 2 + 1 = <span style={{ color: '#22c55e', fontWeight: 700 }}>11</span></div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>The key insight: ANY number can be represented in ANY base. Binary just happens to be the easiest for electronic circuits because transistors have two states: on and off.</p>
      </div>
    )},
    { title: 'Bytes, Words, and Data Sizes', color: '#22c55e', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Bits are grouped into standard sizes. Each grouping can represent a range of values:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
          {[
            { name: 'Nibble', bits: 4, range: '0-15', use: 'One hex digit' },
            { name: 'Byte', bits: 8, range: '0-255', use: 'One ASCII character' },
            { name: 'Word (16-bit)', bits: 16, range: '0-65,535', use: 'Unicode character' },
            { name: 'Double Word', bits: 32, range: '0-4.2 billion', use: 'IPv4 address, int' },
            { name: 'Quad Word', bits: 64, range: '0-18.4 quintillion', use: 'Modern CPU register' },
          ].map(s => (
            <div key={s.name} style={{ padding: 14, borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div style={{ fontWeight: 700, color: '#166534', marginBottom: 2 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: '#475569' }}>{s.bits} bits = {s.range}</div>
              <div style={{ fontSize: 11, color: '#15803d', marginTop: 4 }}>Used for: {s.use}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>Modern CPUs process 64 bits at a time. That means the CPU can work with numbers up to 18,446,744,073,709,551,615 in a single operation. Your "64-bit operating system" refers to this register width.</p>
      </div>
    )},
    { title: 'Hexadecimal: Binary Shorthand', color: '#8b5cf6', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>Writing long binary strings is error-prone. Hexadecimal (base 16) is a compact shorthand: each hex digit represents exactly 4 bits (one nibble). So an 8-bit byte becomes just 2 hex digits.</p>
        <div style={{ padding: 16, background: '#f5f3ff', borderRadius: 12, border: '1px solid #c4b5fd', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2, color: '#4c1d95' }}>
            <div>0000 = 0 &nbsp; 0100 = 4 &nbsp; 1000 = 8 &nbsp; 1100 = C (12)</div>
            <div>0001 = 1 &nbsp; 0101 = 5 &nbsp; 1001 = 9 &nbsp; 1101 = D (13)</div>
            <div>0010 = 2 &nbsp; 0110 = 6 &nbsp; 1010 = A (10) 1110 = E (14)</div>
            <div>0011 = 3 &nbsp; 0111 = 7 &nbsp; 1011 = B (11) 1111 = F (15)</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>This is why memory addresses, colors (#FF5733), and MAC addresses (AA:BB:CC:DD:EE:FF) use hex. It is human-readable binary. The prefix 0x means "this is hexadecimal": 0xFF = 1111 1111 = 255.</p>
      </div>
    )},
    { title: 'Signed Numbers and Twos Complement', color: '#ef4444', content: (
      <div>
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>How do computers represent negative numbers with only 0s and 1s? Using <strong>twos complement</strong>: the leftmost bit (MSB) indicates the sign. If bit 7 is 0, the number is positive. If bit 7 is 1, it is negative.</p>
        <div style={{ padding: 16, background: '#fef2f2', borderRadius: 12, border: '1px solid #fecaca', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2, color: '#991b1b' }}>
            <div>+5  = 00000101 (same as unsigned)</div>
            <div>-5  = 11111011 (flip all bits of 5, add 1)</div>
            <div>+127 = 01111111 (largest positive in 8-bit signed)</div>
            <div>-128 = 10000000 (most negative in 8-bit signed)</div>
          </div>
        </div>
        <p style={{ color: '#475569', lineHeight: 1.8 }}>The brilliant trick: the same adder circuit works for both signed and unsigned math! 5 + (-3) = 00000101 + 11111101 = 00000010 = 2. The hardware does not "know" about negative numbers. It just adds bits and the twos complement encoding makes the math work out.</p>
      </div>
    )},
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>How Binary Really Works</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>The technical foundations of binary representation. Click each section to explore.</p>
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
      code={`# Python makes binary easy
x = 42

# Convert between bases
bin(42)     # '0b101010'  - binary
oct(42)     # '0o52'      - octal
hex(42)     # '0x2a'      - hexadecimal

# Write numbers in any base directly
a = 0b101010   # binary literal = 42
b = 0o52       # octal literal = 42
c = 0x2A       # hex literal = 42
# a == b == c == 42  -> True!

# Bitwise operations work on binary
x & 0xFF    # AND: mask to 8 bits
x | 0x80    # OR: set the high bit
x ^ 0xFF    # XOR: flip all bits
x << 2      # left shift: multiply by 4
x >> 1      # right shift: divide by 2

# Real example: extract RGB from hex color
color = 0xFF5733
red   = (color >> 16) & 0xFF  # 255
green = (color >> 8) & 0xFF   # 87
blue  = color & 0xFF          # 51

# Format numbers in binary
f"{42:08b}"  # '00101010' (8-bit padded)`}
      explanation="Python handles binary natively. The bin(), oct(), hex() functions convert numbers to string representations. You can write binary literals with 0b prefix, hex with 0x. Bitwise operators (&, |, ^, <<, >>) work directly on the binary representation. The shift-and-mask pattern for extracting color channels is one of the most common real-world uses of binary."
      hardwareNote="When Python executes bin(42), the number 42 is ALREADY stored as binary in the CPU register (00101010). The bin() function just creates a human-readable string of that binary pattern. The CPU never works in decimal internally. Every int, float, and character is binary in hardware."
    />
  );
}

function Layer5() {
  const apps = [
    { icon: '\u{1F3A8}', title: 'Colors (RGB)',
      desc: 'Every pixel on your screen is 3 bytes: Red, Green, Blue. The hex color #FF5733 means Red=255, Green=87, Blue=51. That is 24 bits per pixel.',
      detail: 'A 4K display has 8.3 million pixels x 3 bytes = 24.9 MB per frame. At 60 FPS, that is 1.5 GB/sec of binary data flowing to your screen.' },
    { icon: '\u{1F3B5}', title: 'Digital Audio',
      desc: 'Sound is sampled 44,100 times per second (CD quality). Each sample is 16 bits (65,536 levels). Stereo = 2 channels. That is 1.4 million bits per second of music.',
      detail: 'MP3 compression reduces this by ~10x using psychoacoustic models. But the raw data is pure binary: each sample is a 16-bit number representing speaker cone position.' },
    { icon: '\u{1F4F7}', title: 'Digital Photos',
      desc: 'A 12MP camera sensor captures 12 million pixels, each with 14 bits of light intensity per RGB channel. Raw photo = ~25 MB of binary data.',
      detail: 'JPEG compression uses DCT (discrete cosine transform) to reduce this. But the sensor output is pure binary from analog-to-digital converters.' },
    { icon: '\u{1F310}', title: 'Network Addresses',
      desc: 'IPv4 addresses are 32-bit numbers written as 4 bytes: 192.168.1.1 = 11000000.10101000.00000001.00000001. Subnet masks use binary AND to determine network membership.',
      detail: 'IPv6 uses 128-bit addresses written in hex: fe80::1. That gives 3.4 x 10^38 possible addresses, enough for every atom on Earth.' },
    { icon: '\u{1F4BE}', title: 'File Storage',
      desc: 'Every file is a sequence of bytes. A .txt file stores ASCII codes. A .png stores pixel data with compression headers. Your OS reads/writes binary.',
      detail: 'File signatures (magic bytes) identify type: PNG starts with 89 50 4E 47 (hex). ZIP starts with 50 4B. Your OS reads these binary headers to know what app to open.' },
    { icon: '\u{1F512}', title: 'Cryptography',
      desc: 'Encryption operates on binary data using XOR, bit shifts, and substitution boxes. AES-256 means the key is 256 bits long, giving 2^256 possible keys.',
      detail: '2^256 is approximately 1.15 x 10^77. There are only about 10^80 atoms in the observable universe. Brute-forcing AES-256 is physically impossible.' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>Binary Is Everywhere</h2>
      <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>
        Every digital device speaks binary. Here is how patterns of 0s and 1s create the digital world:
      </p>
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
        <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>PERSPECTIVE</div>
        <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>1 byte = 8 bits = 256 possibilities</div>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: 15, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
          With just 8 switches, you can represent any letter, color channel, or sound sample. Scale to billions of switches and you get the entire digital world.
        </p>
      </div>
    </div>
  );
}

export default function L01_BinaryFundamentals() {
  return (
    <LessonWrapper lessonId="L01" title="Binary Fundamentals"
      layers={[
        { id: 1, title: 'Visual Metaphor', subtitle: 'Light Switches', icon: 'L', component: <Layer1 /> },
        { id: 2, title: 'Interactive', subtitle: 'Number Playground', icon: 'G', component: <Layer2 /> },
        { id: 3, title: 'Technical', subtitle: 'How Binary Works', icon: 'T', component: <Layer3 /> },
        { id: 4, title: 'Code Connection', subtitle: 'Python Binary Ops', icon: 'P', component: <Layer4 /> },
        { id: 5, title: 'Real World', subtitle: 'Binary Everywhere', icon: 'W', component: <Layer5 /> },
      ]}
      challenges={[
        { id: 'c1', title: 'Binary Birthday', description: 'Convert your birth year to binary. How many bits do you need?' },
        { id: 'c2', title: 'Hex Colors', description: 'What RGB values does #1E90FF represent? Convert each pair from hex to decimal.' },
        { id: 'c3', title: 'Twos Complement', description: 'What is -42 in 8-bit twos complement binary?' },
      ]}
    />
  );
}
