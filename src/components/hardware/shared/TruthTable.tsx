"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TruthTableProps {
  inputs: string[];
  outputs: string[];
  rows: { inputs: boolean[]; outputs: boolean[] }[];
  title?: string;
  interactive?: boolean;
  highlightRow?: number;
}

export function TruthTable({ inputs, outputs, rows, title, interactive = false, highlightRow }: TruthTableProps) {
  const [activeRow, setActiveRow] = useState<number | null>(highlightRow ?? null);

  return (
    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      {title && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)' }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{title}</h3>
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {inputs.map((input, i) => (
              <th key={`i-${i}`} style={{ padding: '10px 16px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#3b82f6', fontSize: 13, fontWeight: 600 }}>{input}</th>
            ))}
            <th style={{ borderLeft: '2px solid rgba(255,255,255,0.2)', width: 1 }}></th>
            {outputs.map((output, i) => (
              <th key={`o-${i}`} style={{ padding: '10px 16px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#22c55e', fontSize: 13, fontWeight: 600 }}>{output}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <motion.tr key={rowIdx} onClick={() => interactive && setActiveRow(rowIdx)}
              animate={{ backgroundColor: (highlightRow === rowIdx || activeRow === rowIdx) ? 'rgba(139, 92, 246, 0.2)' : 'transparent' }}
              style={{ cursor: interactive ? 'pointer' : 'default' }}>
              {row.inputs.map((val, i) => (
                <td key={`i-${i}`} style={{ padding: '10px 16px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: val ? '#22c55e' : '#ef4444' }}>{val ? '1' : '0'}</td>
              ))}
              <td style={{ borderLeft: '2px solid rgba(255,255,255,0.2)' }}></td>
              {row.outputs.map((val, i) => (
                <td key={`o-${i}`} style={{ padding: '10px 16px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: val ? '#22c55e' : '#ef4444' }}>{val ? '1' : '0'}</td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default TruthTable;
