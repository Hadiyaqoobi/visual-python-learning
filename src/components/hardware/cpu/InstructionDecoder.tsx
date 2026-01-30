"use client";
import React, { useState } from 'react';

interface DecodedInstruction {
  name: string;
  binary: string;
  hex: string;
  format: string;
  fields: { name: string; value: string; meaning: string; color: string }[];
  description: string;
}

const SAMPLE_INSTRUCTIONS: DecodedInstruction[] = [
  {
    name: 'ADD $t0, $s1, $s2',
    binary: '00000010001100100100000000100000',
    hex: '0x02324020',
    format: 'R-Type',
    fields: [
      { name: 'opcode', value: '000000', meaning: 'R-type', color: '#ef4444' },
      { name: 'rs', value: '10001', meaning: '$s1 (17)', color: '#f97316' },
      { name: 'rt', value: '10010', meaning: '$s2 (18)', color: '#eab308' },
      { name: 'rd', value: '01000', meaning: '$t0 (8)', color: '#22c55e' },
      { name: 'shamt', value: '00000', meaning: '0', color: '#3b82f6' },
      { name: 'funct', value: '100000', meaning: 'ADD', color: '#8b5cf6' },
    ],
    description: 'Add registers $s1 and $s2, store result in $t0',
  },
  {
    name: 'LW $t0, 4($s1)',
    binary: '10001110001010000000000000000100',
    hex: '0x8E280004',
    format: 'I-Type',
    fields: [
      { name: 'opcode', value: '100011', meaning: 'LW (load)', color: '#ef4444' },
      { name: 'rs', value: '10001', meaning: '$s1 (17)', color: '#f97316' },
      { name: 'rt', value: '01000', meaning: '$t0 (8)', color: '#eab308' },
      { name: 'immediate', value: '0000000000000100', meaning: '4 (offset)', color: '#22c55e' },
    ],
    description: 'Load word from memory address ($s1 + 4) into $t0',
  },
  {
    name: 'J 0x00400000',
    binary: '00001000000100000000000000000000',
    hex: '0x08100000',
    format: 'J-Type',
    fields: [
      { name: 'opcode', value: '000010', meaning: 'J (jump)', color: '#ef4444' },
      { name: 'address', value: '00000100000000000000000000', meaning: '0x00400000', color: '#3b82f6' },
    ],
    description: 'Jump to address 0x00400000',
  },
];

export function InstructionDecoder() {
  const [selectedInstr, setSelectedInstr] = useState(0);
  const [highlightField, setHighlightField] = useState<string | null>(null);

  const instruction = SAMPLE_INSTRUCTIONS[selectedInstr];

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Instruction Decoder</h2>
        <p className="text-gray-600">
          Every CPU instruction is just a pattern of bits. The decoder breaks it apart
          to understand what operation to perform.
        </p>
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">Select Instruction:</div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_INSTRUCTIONS.map((instr, idx) => (
            <button
              key={idx}
              onClick={() => { setSelectedInstr(idx); setHighlightField(null); }}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                selectedInstr === idx ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {instr.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 mb-6">
        <div className="text-center mb-4">
          <span className="text-gray-400 text-sm">Assembly:</span>
          <div className="text-2xl font-mono text-green-400">{instruction.name}</div>
        </div>

        <div className="text-center mb-4">
          <span className="text-gray-400 text-sm">Hexadecimal:</span>
          <div className="text-xl font-mono text-blue-400">{instruction.hex}</div>
        </div>

        <div className="mb-4">
          <div className="text-center text-gray-400 text-sm mb-2">Binary ({instruction.format}):</div>
          <div className="flex justify-center flex-wrap gap-0">
            {instruction.fields.map((field, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHighlightField(field.name)}
                onMouseLeave={() => setHighlightField(null)}
                className={`transition-all cursor-pointer ${highlightField === field.name ? 'transform scale-110' : ''}`}
              >
                <div className="px-2 py-1 font-mono text-white text-sm" style={{ backgroundColor: field.color }}>
                  {field.value}
                </div>
                <div className="text-center text-xs mt-1" style={{ color: field.color }}>{field.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center text-xs text-gray-500 font-mono">
          <span>31</span>
          <span className="flex-1 text-center">← bits →</span>
          <span>0</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-3">Decoded Fields</h3>
        <div className="grid grid-cols-2 gap-3">
          {instruction.fields.map((field, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHighlightField(field.name)}
              onMouseLeave={() => setHighlightField(null)}
              className={`p-3 rounded-lg border-l-4 transition-all ${highlightField === field.name ? 'scale-[1.02] shadow-md' : ''}`}
              style={{ 
                borderLeftColor: field.color,
                backgroundColor: highlightField === field.name ? `${field.color}20` : '#f9fafb'
              }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold" style={{ color: field.color }}>{field.name}</span>
                <span className="font-mono text-sm bg-gray-200 px-2 py-0.5 rounded">{field.value}</span>
              </div>
              <div className="text-sm text-gray-700">{field.meaning}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-bold text-blue-800 mb-1">What This Instruction Does:</h4>
        <p className="text-blue-900">{instruction.description}</p>
      </div>

      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <h4 className="font-bold text-yellow-800">💡 Key Insight</h4>
        <p className="text-yellow-900">
          The CPU doesn&apos;t understand &quot;ADD&quot; - it only sees bits! The opcode tells 
          the CPU which operation, and other fields specify registers and values.
        </p>
      </div>
    </div>
  );
}

export default InstructionDecoder;
