// H4: ALU Simulator
// Interactive Arithmetic Logic Unit with operation selection

import React, { useState, useEffect } from 'react';

type ALUOperation = 'ADD' | 'SUB' | 'AND' | 'OR' | 'XOR' | 'NOT' | 'SHL' | 'SHR';

interface OperationInfo {
  name: ALUOperation;
  symbol: string;
  description: string;
  compute: (a: number, b: number) => number;
  color: string;
  unary?: boolean;
}

const OPERATIONS: OperationInfo[] = [
  { name: 'ADD', symbol: '+', description: 'Addition', color: '#22c55e',
    compute: (a, b) => (a + b) & 0xFF },
  { name: 'SUB', symbol: '−', description: 'Subtraction', color: '#ef4444',
    compute: (a, b) => (a - b) & 0xFF },
  { name: 'AND', symbol: '&', description: 'Bitwise AND', color: '#3b82f6',
    compute: (a, b) => a & b },
  { name: 'OR', symbol: '|', description: 'Bitwise OR', color: '#8b5cf6',
    compute: (a, b) => a | b },
  { name: 'XOR', symbol: '^', description: 'Bitwise XOR', color: '#f97316',
    compute: (a, b) => a ^ b },
  { name: 'NOT', symbol: '~', description: 'Bitwise NOT (A only)', color: '#ec4899',
    compute: (a) => (~a) & 0xFF, unary: true },
  { name: 'SHL', symbol: '<<', description: 'Shift Left', color: '#14b8a6',
    compute: (a, b) => (a << (b & 0x7)) & 0xFF },
  { name: 'SHR', symbol: '>>', description: 'Shift Right', color: '#6366f1',
    compute: (a, b) => (a >> (b & 0x7)) & 0xFF },
];

export const ALUSimulator: React.FC = () => {
  const [inputA, setInputA] = useState(42);
  const [inputB, setInputB] = useState(15);
  const [operation, setOperation] = useState<ALUOperation>('ADD');
  const [showBinary, setShowBinary] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const op = OPERATIONS.find(o => o.name === operation)!;

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setResult(op.compute(inputA, inputB));
      setAnimating(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputA, inputB, operation, op]);

  const toBinary = (n: number) => (n >>> 0).toString(2).padStart(8, '0');

  const flags = {
    zero: result === 0,
    negative: result !== null && (result & 0x80) !== 0,
    carry: operation === 'ADD' && inputA + inputB > 255,
    overflow: operation === 'ADD' && ((inputA ^ result!) & (inputB ^ result!) & 0x80) !== 0,
  };

  const BitDisplay: React.FC<{ value: number; color: string; label: string }> = 
    ({ value, color, label }) => (
    <div className="text-center">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="flex gap-0.5 justify-center">
        {toBinary(value).split('').map((bit, idx) => (
          <div
            key={idx}
            className={`w-6 h-8 rounded flex items-center justify-center font-mono font-bold text-sm ${
              bit === '1' ? 'text-white' : 'bg-gray-200 text-gray-500'
            }`}
            style={{ backgroundColor: bit === '1' ? color : undefined }}
          >
            {bit}
          </div>
        ))}
      </div>
      <div className="text-lg font-bold mt-1" style={{ color }}>{value}</div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">ALU Simulator</h2>
        <p className="text-gray-600">
          The Arithmetic Logic Unit performs all math and logic operations in the CPU.
          Select an operation and watch the bits transform!
        </p>
      </div>

      {/* Operation selector */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">Select Operation:</div>
        <div className="flex flex-wrap gap-2">
          {OPERATIONS.map(o => (
            <button
              key={o.name}
              onClick={() => setOperation(o.name)}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                operation === o.name
                  ? 'text-white scale-105 shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              style={{ 
                backgroundColor: operation === o.name ? o.color : undefined,
              }}
            >
              <span className="mr-1">{o.symbol}</span>
              {o.name}
            </button>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600">{op.description}</div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Input A (0-255)</label>
          <input
            type="range"
            min={0}
            max={255}
            value={inputA}
            onChange={(e) => setInputA(parseInt(e.target.value))}
            className="w-full"
          />
          <input
            type="number"
            min={0}
            max={255}
            value={inputA}
            onChange={(e) => setInputA(Math.min(255, Math.max(0, parseInt(e.target.value) || 0)))}
            className="w-full mt-2 px-3 py-2 border rounded-lg text-center font-mono"
          />
        </div>
        {!op.unary && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">Input B (0-255)</label>
            <input
              type="range"
              min={0}
              max={255}
              value={inputB}
              onChange={(e) => setInputB(parseInt(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              min={0}
              max={255}
              value={inputB}
              onChange={(e) => setInputB(Math.min(255, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-full mt-2 px-3 py-2 border rounded-lg text-center font-mono"
            />
          </div>
        )}
      </div>

      {/* ALU Visualization */}
      <div className="bg-gray-900 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-4">
          {/* Input A */}
          <div className="text-center">
            {showBinary && <BitDisplay value={inputA} color="#3b82f6" label="Input A" />}
            {!showBinary && (
              <div>
                <div className="text-xs text-gray-500">A</div>
                <div className="text-3xl font-bold text-blue-400">{inputA}</div>
              </div>
            )}
          </div>

          {/* Input B */}
          {!op.unary && (
            <div className="text-center">
              {showBinary && <BitDisplay value={inputB} color="#22c55e" label="Input B" />}
              {!showBinary && (
                <div>
                  <div className="text-xs text-gray-500">B</div>
                  <div className="text-3xl font-bold text-green-400">{inputB}</div>
                </div>
              )}
            </div>
          )}

          {/* Arrow into ALU */}
          <div className="text-gray-500 text-2xl">→</div>

          {/* ALU Box */}
          <div
            className={`w-32 h-32 rounded-xl flex flex-col items-center justify-center text-white font-bold transition-all ${
              animating ? 'scale-110' : ''
            }`}
            style={{ backgroundColor: op.color }}
          >
            <div className="text-4xl">{op.symbol}</div>
            <div className="text-sm mt-1">ALU</div>
            <div className="text-xs opacity-75">{op.name}</div>
          </div>

          {/* Arrow out of ALU */}
          <div className="text-gray-500 text-2xl">→</div>

          {/* Result */}
          <div className="text-center">
            {showBinary && result !== null && (
              <BitDisplay value={result} color={op.color} label="Result" />
            )}
            {!showBinary && (
              <div>
                <div className="text-xs text-gray-500">Result</div>
                <div className="text-3xl font-bold" style={{ color: op.color }}>
                  {result}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Expression */}
        <div className="text-center mt-4 font-mono text-lg text-gray-300">
          {op.unary ? (
            <span>{op.symbol}{inputA} = {result}</span>
          ) : (
            <span>{inputA} {op.symbol} {inputB} = {result}</span>
          )}
        </div>
      </div>

      {/* Flags */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-2">Status Flags</h3>
        <div className="flex gap-4">
          {Object.entries(flags).map(([name, value]) => (
            <div
              key={name}
              className={`px-4 py-2 rounded-lg font-medium ${
                value ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}: {value ? '1' : '0'}
            </div>
          ))}
        </div>
      </div>

      {/* Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowBinary(!showBinary)}
          className={`px-4 py-2 rounded-lg ${
            showBinary ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {showBinary ? 'Show Decimal' : 'Show Binary'}
        </button>
      </div>

      {/* Operation details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold text-gray-700 mb-2">Arithmetic Operations</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><strong>ADD:</strong> Adds two numbers</li>
            <li><strong>SUB:</strong> Subtracts B from A</li>
            <li><strong>SHL:</strong> Shift left (multiply by 2)</li>
            <li><strong>SHR:</strong> Shift right (divide by 2)</li>
          </ul>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold text-gray-700 mb-2">Logic Operations</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><strong>AND:</strong> 1 only if both bits are 1</li>
            <li><strong>OR:</strong> 1 if either bit is 1</li>
            <li><strong>XOR:</strong> 1 if bits are different</li>
            <li><strong>NOT:</strong> Flips all bits</li>
          </ul>
        </div>
      </div>

      {/* Key insight */}
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <h4 className="font-bold text-yellow-800">💡 Key Insight</h4>
        <p className="text-yellow-900">
          The ALU is the "calculator" inside the CPU. Every Python math operation 
          (like <code className="bg-yellow-200 px-1 rounded">5 + 3</code>) eventually becomes 
          an ALU operation on binary numbers. The flags help with comparisons and overflow detection.
        </p>
      </div>
    </div>
  );
};

export default ALUSimulator;
