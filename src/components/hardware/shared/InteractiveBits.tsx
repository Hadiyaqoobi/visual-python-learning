"use client";

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface InteractiveBitsProps {
  bits?: number;
  initialValue?: number;
  onChange?: (value: number, binary: boolean[]) => void;
  showDecimal?: boolean;
  showHex?: boolean;
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function InteractiveBits({
  bits = 8, initialValue = 0, onChange,
  showDecimal = true, showHex = false, showLabels = true, size = 'medium'
}: InteractiveBitsProps) {
  const [binary, setBinary] = useState<boolean[]>(() => {
    const arr = [];
    for (let i = bits - 1; i >= 0; i--) {
      arr.push(((initialValue >> i) & 1) === 1);
    }
    return arr;
  });

  const toggleBit = useCallback((index: number) => {
    setBinary(prev => {
      const newBinary = [...prev];
      newBinary[index] = !newBinary[index];
      const value = newBinary.reduce((sum, bit, i) => sum + (bit ? Math.pow(2, bits - 1 - i) : 0), 0);
      onChange?.(value, newBinary);
      return newBinary;
    });
  }, [bits, onChange]);

  const decimalValue = binary.reduce((sum, bit, i) => sum + (bit ? Math.pow(2, bits - 1 - i) : 0), 0);
  const sizes = { small: { box: 32, font: 14, label: 8 }, medium: { box: 48, font: 20, label: 10 }, large: { box: 64, font: 28, label: 12 } };
  const s = sizes[size];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {binary.map((bit, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <motion.button onClick={() => toggleBit(idx)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              animate={{ backgroundColor: bit ? '#22c55e' : '#1f2937', boxShadow: bit ? '0 0 20px rgba(34, 197, 94, 0.5)' : 'none' }}
              style={{ width: s.box, height: s.box, borderRadius: 8, border: `2px solid ${bit ? '#22c55e' : '#374151'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: s.font, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: bit ? 'white' : '#6b7280' }}>
              {bit ? '1' : '0'}
            </motion.button>
            {showLabels && <span style={{ fontSize: s.label, color: '#6b7280' }}>2^{bits - 1 - idx}</span>}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {showDecimal && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Decimal</div>
            <motion.div key={decimalValue} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              style={{ fontSize: 32, fontWeight: 700, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace" }}>
              {decimalValue}
            </motion.div>
          </div>
        )}
        {showHex && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Hex</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6', fontFamily: "'JetBrains Mono', monospace" }}>
              0x{decimalValue.toString(16).toUpperCase().padStart(Math.ceil(bits/4), '0')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default InteractiveBits;
