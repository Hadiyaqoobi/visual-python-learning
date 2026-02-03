"use client";
import React from 'react';

type GateType = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR' | 'XNOR';

interface LogicGateProps {
  type: GateType;
  inputA: boolean;
  inputB?: boolean;
  size?: number;
}

function computeOutput(type: GateType, a: boolean, b: boolean): boolean {
  switch (type) {
    case 'AND': return a && b;
    case 'OR': return a || b;
    case 'NOT': return !a;
    case 'XOR': return a !== b;
    case 'NAND': return !(a && b);
    case 'NOR': return !(a || b);
    case 'XNOR': return a === b;
    default: return false;
  }
}

function getGateSymbol(type: GateType): string {
  switch (type) {
    case 'AND': return '&';
    case 'OR': return '≥1';
    case 'NOT': return '1';
    case 'XOR': return '=1';
    case 'NAND': return '&';
    case 'NOR': return '≥1';
    case 'XNOR': return '=1';
    default: return '?';
  }
}

export function LogicGate({ type, inputA, inputB = false, size = 100 }: LogicGateProps) {
  const output = computeOutput(type, inputA, inputB);
  const scale = size / 100;
  const isNot = type === 'NOT';
  const isNegated = ['NAND', 'NOR', 'XNOR'].includes(type);

  const onColor = '#22c55e';
  const offColor = '#64748b';
  const gateColor = output ? '#1e40af' : '#1e293b';
  const gateBorder = output ? '#3b82f6' : '#475569';

  return (
    <svg width={size * 1.8} height={size * 1.2} viewBox="0 0 180 120">
      {/* Input A line */}
      <line x1="0" y1={isNot ? "60" : "35"} x2="40" y2={isNot ? "60" : "35"}
        stroke={inputA ? onColor : offColor} strokeWidth="3" />
      {/* Input A dot */}
      <circle cx="10" cy={isNot ? 60 : 35} r="6"
        fill={inputA ? onColor : 'transparent'} stroke={inputA ? onColor : offColor} strokeWidth="2" />

      {/* Input B line (not for NOT gate) */}
      {!isNot && (
        <>
          <line x1="0" y1="85" x2="40" y2="85"
            stroke={inputB ? onColor : offColor} strokeWidth="3" />
          <circle cx="10" cy={85} r="6"
            fill={inputB ? onColor : 'transparent'} stroke={inputB ? onColor : offColor} strokeWidth="2" />
        </>
      )}

      {/* Gate body */}
      <rect x="40" y="20" width="70" height="80" rx="8"
        fill={gateColor} stroke={gateBorder} strokeWidth="2.5" />

      {/* Gate label */}
      <text x="75" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold"
        fontFamily="monospace">
        {type}
      </text>
      <text x="75" y="75" textAnchor="middle" fill="#94a3b8" fontSize="11"
        fontFamily="monospace">
        {getGateSymbol(type)}
      </text>

      {/* Negation bubble */}
      {isNegated && (
        <circle cx="115" cy="60" r="6" fill="none" stroke={gateBorder} strokeWidth="2" />
      )}

      {/* Output line */}
      <line x1={isNegated ? "121" : "110"} y1="60" x2="170" y2="60"
        stroke={output ? onColor : offColor} strokeWidth="3" />
      {/* Output dot */}
      <circle cx="170" cy="60" r="6"
        fill={output ? onColor : 'transparent'} stroke={output ? onColor : offColor} strokeWidth="2" />

      {/* Input labels */}
      <text x="22" y={isNot ? 56 : 31} fill={inputA ? onColor : offColor} fontSize="10"
        fontFamily="monospace" fontWeight="bold">
        {inputA ? '1' : '0'}
      </text>
      {!isNot && (
        <text x="22" y={81} fill={inputB ? onColor : offColor} fontSize="10"
          fontFamily="monospace" fontWeight="bold">
          {inputB ? '1' : '0'}
        </text>
      )}

      {/* Output label */}
      <text x="158" y={56} fill={output ? onColor : offColor} fontSize="10"
        fontFamily="monospace" fontWeight="bold">
        {output ? '1' : '0'}
      </text>
    </svg>
  );
}
