"use client";

import React from 'react';
import { Code2, Cpu, Zap } from 'lucide-react';

interface PythonConnectionProps {
  code: string;
  explanation: string;
  hardwareNote: string;
  title?: string;
}

function highlightPython(code: string): JSX.Element[] {
  return code.split('\n').map((line, idx) => {
    let highlighted = line
      .replace(/(#.*$)/g, '<span style="color: #6b7280;">$1</span>')
      .replace(/\b(def|return|if|else|elif|for|while|import|from|class|in|and|or|not|True|False|None|print|with|as|async|await)\b/g, '<span style="color: #c084fc;">$1</span>')
      .replace(/\b(\d+)\b/g, '<span style="color: #f59e0b;">$1</span>')
      .replace(/(["'])(.*?)\1/g, '<span style="color: #22c55e;">$1$2$1</span>')
      .replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span style="color: #60a5fa;">$1</span>(');
    return (
      <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '2px 12px' }}>
        <span style={{ width: 32, color: '#4b5563', fontSize: 11, textAlign: 'right', marginRight: 12, fontFamily: 'monospace', userSelect: 'none' }}>{idx + 1}</span>
        <code style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: '#e2e8f0' }} dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }} />
      </div>
    );
  });
}

export function PythonConnection({ code, explanation, hardwareNote, title = "Python to Hardware" }: PythonConnectionProps) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: 12, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <Zap size={18} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{title}</h3>
          <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>See how Python maps to hardware</p>
        </div>
      </div>

      {/* Code block */}
      <div style={{ padding: '16px 0', background: '#1e1e2e', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ padding: '0 16px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Code2 size={14} style={{ color: '#3b82f6' }} />
          <span style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Python Code</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {highlightPython(code)}
        </div>
      </div>

      {/* Explanation */}
      <div style={{ padding: 20, background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
            <Code2 size={14} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>How It Connects</div>
            <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.7 }}>{explanation}</p>
          </div>
        </div>
      </div>

      {/* Hardware note */}
      <div style={{ padding: 20, background: '#fffbeb', borderTop: '1px solid #fde68a' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
            <Cpu size={14} style={{ color: '#d97706' }} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#d97706', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Hardware Detail</div>
            <p style={{ margin: 0, fontSize: 14, color: '#92400e', lineHeight: 1.7 }}>{hardwareNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PythonConnection;
