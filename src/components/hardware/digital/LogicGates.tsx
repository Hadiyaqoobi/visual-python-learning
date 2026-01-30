// H2: Logic Gates Playground
// Interactive AND, OR, NOT, XOR, NAND, NOR gate simulator

import React, { useState } from 'react';

type GateType = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR';

interface GateInfo {
  name: GateType;
  symbol: string;
  description: string;
  truthTable: { inputs: boolean[]; output: boolean }[];
  compute: (a: boolean, b?: boolean) => boolean;
  color: string;
}

const GATES: GateInfo[] = [
  {
    name: 'AND',
    symbol: '&',
    description: 'Output is 1 only if BOTH inputs are 1',
    color: '#3b82f6',
    compute: (a, b) => a && (b ?? true),
    truthTable: [
      { inputs: [false, false], output: false },
      { inputs: [false, true], output: false },
      { inputs: [true, false], output: false },
      { inputs: [true, true], output: true },
    ],
  },
  {
    name: 'OR',
    symbol: '≥1',
    description: 'Output is 1 if ANY input is 1',
    color: '#22c55e',
    compute: (a, b) => a || (b ?? false),
    truthTable: [
      { inputs: [false, false], output: false },
      { inputs: [false, true], output: true },
      { inputs: [true, false], output: true },
      { inputs: [true, true], output: true },
    ],
  },
  {
    name: 'NOT',
    symbol: '1',
    description: 'Output is the OPPOSITE of input',
    color: '#ef4444',
    compute: (a) => !a,
    truthTable: [
      { inputs: [false], output: true },
      { inputs: [true], output: false },
    ],
  },
  {
    name: 'XOR',
    symbol: '=1',
    description: 'Output is 1 if inputs are DIFFERENT',
    color: '#f97316',
    compute: (a, b) => a !== (b ?? false),
    truthTable: [
      { inputs: [false, false], output: false },
      { inputs: [false, true], output: true },
      { inputs: [true, false], output: true },
      { inputs: [true, true], output: false },
    ],
  },
  {
    name: 'NAND',
    symbol: '&',
    description: 'NOT-AND: Output is 0 only if BOTH inputs are 1',
    color: '#8b5cf6',
    compute: (a, b) => !(a && (b ?? true)),
    truthTable: [
      { inputs: [false, false], output: true },
      { inputs: [false, true], output: true },
      { inputs: [true, false], output: true },
      { inputs: [true, true], output: false },
    ],
  },
  {
    name: 'NOR',
    symbol: '≥1',
    description: 'NOT-OR: Output is 1 only if BOTH inputs are 0',
    color: '#ec4899',
    compute: (a, b) => !(a || (b ?? false)),
    truthTable: [
      { inputs: [false, false], output: true },
      { inputs: [false, true], output: false },
      { inputs: [true, false], output: false },
      { inputs: [true, true], output: false },
    ],
  },
];

export const LogicGates: React.FC = () => {
  const [selectedGate, setSelectedGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);

  const gate = GATES.find(g => g.name === selectedGate)!;
  const isUnary = gate.name === 'NOT';
  const output = isUnary ? gate.compute(inputA) : gate.compute(inputA, inputB);

  const InputButton: React.FC<{ value: boolean; onChange: () => void; label: string }> = 
    ({ value, onChange, label }) => (
    <button
      onClick={onChange}
      className={`w-20 h-20 rounded-lg font-bold text-2xl transition-all transform hover:scale-105 ${
        value 
          ? 'bg-green-500 text-white shadow-lg shadow-green-500/50' 
          : 'bg-gray-300 text-gray-600'
      }`}
    >
      <div className="text-xs mb-1">{label}</div>
      {value ? '1' : '0'}
    </button>
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Logic Gates Playground</h2>
        <p className="text-gray-600">
          Logic gates are the building blocks of all digital circuits. Click inputs to toggle them!
        </p>
      </div>

      {/* Gate selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {GATES.map(g => (
          <button
            key={g.name}
            onClick={() => setSelectedGate(g.name)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              selectedGate === g.name
                ? 'text-white scale-105'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            style={{ backgroundColor: selectedGate === g.name ? g.color : undefined }}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Interactive gate visualization */}
      <div className="bg-gray-100 rounded-xl p-8 mb-6">
        <div className="flex items-center justify-center gap-8">
          {/* Inputs */}
          <div className="flex flex-col gap-4">
            <InputButton value={inputA} onChange={() => setInputA(!inputA)} label="Input A" />
            {!isUnary && (
              <InputButton value={inputB} onChange={() => setInputB(!inputB)} label="Input B" />
            )}
          </div>

          {/* Wires to gate */}
          <div className="flex flex-col justify-center gap-4">
            <div className={`h-1 w-16 ${inputA ? 'bg-green-500' : 'bg-gray-400'}`} />
            {!isUnary && (
              <div className={`h-1 w-16 ${inputB ? 'bg-green-500' : 'bg-gray-400'}`} />
            )}
          </div>

          {/* Gate symbol */}
          <div
            className="w-32 h-24 rounded-lg flex flex-col items-center justify-center text-white font-bold relative"
            style={{ backgroundColor: gate.color }}
          >
            <span className="text-2xl">{gate.symbol}</span>
            <span className="text-sm">{gate.name}</span>
            {(gate.name === 'NAND' || gate.name === 'NOR' || gate.name === 'NOT') && (
              <div className="absolute -right-2 w-4 h-4 rounded-full bg-white border-2" 
                style={{ borderColor: gate.color }} />
            )}
          </div>

          {/* Wire from gate */}
          <div className={`h-1 w-16 ${output ? 'bg-green-500' : 'bg-gray-400'}`} />

          {/* Output */}
          <div
            className={`w-20 h-20 rounded-lg font-bold text-2xl flex flex-col items-center justify-center transition-all ${
              output
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            <div className="text-xs mb-1">Output</div>
            {output ? '1' : '0'}
          </div>
        </div>

        {/* Gate description */}
        <div className="mt-6 text-center">
          <p className="text-gray-700 font-medium">{gate.description}</p>
        </div>
      </div>

      {/* Truth table */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-3">Truth Table</h3>
        <div className="inline-block">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2 bg-gray-100">A</th>
                {!isUnary && <th className="border px-4 py-2 bg-gray-100">B</th>}
                <th className="border px-4 py-2" style={{ backgroundColor: gate.color, color: 'white' }}>
                  Output
                </th>
              </tr>
            </thead>
            <tbody>
              {gate.truthTable.map((row, idx) => {
                const isCurrentRow = isUnary 
                  ? row.inputs[0] === inputA
                  : row.inputs[0] === inputA && row.inputs[1] === inputB;
                return (
                  <tr key={idx} className={isCurrentRow ? 'bg-yellow-100' : ''}>
                    <td className="border px-4 py-2 text-center font-mono">
                      {row.inputs[0] ? '1' : '0'}
                    </td>
                    {!isUnary && (
                      <td className="border px-4 py-2 text-center font-mono">
                        {row.inputs[1] ? '1' : '0'}
                      </td>
                    )}
                    <td className={`border px-4 py-2 text-center font-mono font-bold ${
                      row.output ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {row.output ? '1' : '0'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Boolean expression */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-gray-700 mb-2">Boolean Expression</h3>
        <div className="font-mono text-lg">
          {gate.name === 'AND' && 'Q = A · B (A AND B)'}
          {gate.name === 'OR' && 'Q = A + B (A OR B)'}
          {gate.name === 'NOT' && "Q = A' (NOT A)"}
          {gate.name === 'XOR' && 'Q = A ⊕ B (A XOR B)'}
          {gate.name === 'NAND' && "Q = (A · B)' (NOT (A AND B))"}
          {gate.name === 'NOR' && "Q = (A + B)' (NOT (A OR B))"}
        </div>
      </div>

      {/* Real-world applications */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-bold text-blue-800 text-sm">AND Gate Uses</h4>
          <p className="text-xs text-blue-700">Security systems, enable signals, masking bits</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <h4 className="font-bold text-green-800 text-sm">OR Gate Uses</h4>
          <p className="text-xs text-green-700">Alarms, any-key detection, combining signals</p>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <h4 className="font-bold text-orange-800 text-sm">XOR Gate Uses</h4>
          <p className="text-xs text-orange-700">Addition, parity checking, encryption</p>
        </div>
      </div>

      {/* Key insight */}
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <h4 className="font-bold text-yellow-800">💡 Key Insight</h4>
        <p className="text-yellow-900">
          NAND gates are "universal" - you can build ANY other gate using only NAND gates!
          This is why many processors are built primarily from NAND gates.
        </p>
      </div>
    </div>
  );
};

export default LogicGates;
