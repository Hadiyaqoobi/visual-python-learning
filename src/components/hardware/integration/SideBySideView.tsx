// H19: Side-by-Side Python + Hardware View
// Shows Python code execution alongside hardware operations

import React, { useState, useCallback, useRef } from 'react';

interface CodeLine {
  python: string;
  bytecode: string[];
  assembly: string[];
  registers: Record<string, number | string>;
  memory: { address: string; value: string; label?: string }[];
  explanation: string;
}

interface Example {
  name: string;
  lines: CodeLine[];
}

const EXAMPLES: Example[] = [
  {
    name: 'x = 5 + 3',
    lines: [
      {
        python: 'x = 5 + 3',
        bytecode: ['LOAD_CONST 5', 'LOAD_CONST 3', 'BINARY_ADD', 'STORE_NAME x'],
        assembly: ['mov rax, 5', 'mov rbx, 3', 'add rax, rbx', 'mov [x], rax'],
        registers: { RAX: 8, RBX: 3, RCX: 0, RDX: 0 },
        memory: [
          { address: '0x1000', value: 'PyLong(8)', label: 'x' },
        ],
        explanation: 'Load constants, add them, store result in variable x',
      },
    ],
  },
  {
    name: 'Loop: sum',
    lines: [
      {
        python: 'total = 0',
        bytecode: ['LOAD_CONST 0', 'STORE_NAME total'],
        assembly: ['xor rax, rax', 'mov [total], rax'],
        registers: { RAX: 0, RBX: 0, RCX: 0, RDX: 0 },
        memory: [{ address: '0x1000', value: 'PyLong(0)', label: 'total' }],
        explanation: 'Initialize total to 0',
      },
      {
        python: 'for i in range(3):',
        bytecode: ['LOAD_NAME range', 'LOAD_CONST 3', 'CALL_FUNCTION', 'GET_ITER'],
        assembly: ['mov rcx, 0', 'mov rdx, 3'],
        registers: { RAX: 0, RBX: 0, RCX: 0, RDX: 3 },
        memory: [
          { address: '0x1000', value: 'PyLong(0)', label: 'total' },
          { address: '0x1008', value: 'range(0,3)', label: 'iterator' },
        ],
        explanation: 'Create range iterator, RCX=counter, RDX=limit',
      },
      {
        python: '    total += i  # i=0',
        bytecode: ['LOAD_NAME total', 'LOAD_NAME i', 'INPLACE_ADD', 'STORE_NAME total'],
        assembly: ['mov rax, [total]', 'add rax, rcx', 'mov [total], rax'],
        registers: { RAX: 0, RBX: 0, RCX: 0, RDX: 3 },
        memory: [{ address: '0x1000', value: 'PyLong(0)', label: 'total' }],
        explanation: 'First iteration: total = 0 + 0 = 0',
      },
      {
        python: '    total += i  # i=1',
        bytecode: ['LOAD_NAME total', 'LOAD_NAME i', 'INPLACE_ADD', 'STORE_NAME total'],
        assembly: ['mov rax, [total]', 'add rax, rcx', 'mov [total], rax'],
        registers: { RAX: 1, RBX: 0, RCX: 1, RDX: 3 },
        memory: [{ address: '0x1000', value: 'PyLong(1)', label: 'total' }],
        explanation: 'Second iteration: total = 0 + 1 = 1',
      },
      {
        python: '    total += i  # i=2',
        bytecode: ['LOAD_NAME total', 'LOAD_NAME i', 'INPLACE_ADD', 'STORE_NAME total'],
        assembly: ['mov rax, [total]', 'add rax, rcx', 'mov [total], rax'],
        registers: { RAX: 3, RBX: 0, RCX: 2, RDX: 3 },
        memory: [{ address: '0x1000', value: 'PyLong(3)', label: 'total' }],
        explanation: 'Third iteration: total = 1 + 2 = 3',
      },
      {
        python: '# Loop complete',
        bytecode: ['POP_BLOCK'],
        assembly: ['cmp rcx, rdx', 'jge end'],
        registers: { RAX: 3, RBX: 0, RCX: 3, RDX: 3 },
        memory: [{ address: '0x1000', value: 'PyLong(3)', label: 'total' }],
        explanation: 'Loop ends: total = 0+1+2 = 3',
      },
    ],
  },
  {
    name: 'if/else',
    lines: [
      {
        python: 'x = 10',
        bytecode: ['LOAD_CONST 10', 'STORE_NAME x'],
        assembly: ['mov rax, 10', 'mov [x], rax'],
        registers: { RAX: 10, RBX: 0, FLAGS: 'none' },
        memory: [{ address: '0x1000', value: 'PyLong(10)', label: 'x' }],
        explanation: 'Store 10 in variable x',
      },
      {
        python: 'if x > 5:',
        bytecode: ['LOAD_NAME x', 'LOAD_CONST 5', 'COMPARE_OP >', 'POP_JUMP_IF_FALSE'],
        assembly: ['mov rax, [x]', 'cmp rax, 5'],
        registers: { RAX: 10, RBX: 0, FLAGS: 'GT (greater)' },
        memory: [{ address: '0x1000', value: 'PyLong(10)', label: 'x' }],
        explanation: 'Compare x with 5: 10 > 5 is True',
      },
      {
        python: '    result = "big"',
        bytecode: ['LOAD_CONST "big"', 'STORE_NAME result'],
        assembly: ['lea rax, [big_str]', 'mov [result], rax'],
        registers: { RAX: '0x2000', RBX: 0, FLAGS: 'GT' },
        memory: [
          { address: '0x1000', value: 'PyLong(10)', label: 'x' },
          { address: '0x1008', value: 'PyStr("big")', label: 'result' },
        ],
        explanation: 'Condition true: set result = "big"',
      },
      {
        python: 'else:  # skipped',
        bytecode: ['JUMP_FORWARD (skip else)'],
        assembly: ['jmp end'],
        registers: { RAX: '0x2000', RBX: 0, FLAGS: 'GT' },
        memory: [
          { address: '0x1000', value: 'PyLong(10)', label: 'x' },
          { address: '0x1008', value: 'PyStr("big")', label: 'result' },
        ],
        explanation: 'Else branch skipped (condition was true)',
      },
    ],
  },
];

export const SideBySideView: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [showBytecode, setShowBytecode] = useState(true);
  const [showAssembly, setShowAssembly] = useState(true);

  const runningRef = useRef(false);
  const example = EXAMPLES[selectedExample];

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runCode = useCallback(async () => {
    setIsRunning(true);
    runningRef.current = true;
    setCurrentLine(0);

    for (let i = 0; i < example.lines.length; i++) {
      if (!runningRef.current) break;
      setCurrentLine(i);
      await sleep(speed);
    }

    setIsRunning(false);
    runningRef.current = false;
  }, [selectedExample, speed, example.lines.length]);

  const stop = () => { runningRef.current = false; setIsRunning(false); };
  const reset = () => { stop(); setCurrentLine(0); };
  const stepNext = () => { if (currentLine < example.lines.length - 1) setCurrentLine(c => c + 1); };
  const stepPrev = () => { if (currentLine > 0) setCurrentLine(c => c - 1); };

  const line = example.lines[currentLine];

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Side-by-Side: Python + Hardware</h2>
        <p className="text-gray-600">
          See exactly what happens in hardware when Python code executes.
          Watch bytecode, assembly, registers, and memory change together.
        </p>
      </div>

      {/* Example selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {EXAMPLES.map((ex, idx) => (
          <button key={ex.name} onClick={() => { setSelectedExample(idx); setCurrentLine(0); }}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedExample === idx ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}>
            {ex.name}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <button onClick={isRunning ? stop : runCode}
          className={`px-5 py-2 rounded-lg text-white ${isRunning ? 'bg-red-500' : 'bg-green-500'}`}>
          {isRunning ? '⏹ Stop' : '▶ Run'}
        </button>
        <button onClick={stepPrev} disabled={currentLine === 0 || isRunning}
          className="px-3 py-2 bg-gray-200 rounded-lg disabled:opacity-50">← Prev</button>
        <button onClick={stepNext} disabled={currentLine >= example.lines.length - 1 || isRunning}
          className="px-3 py-2 bg-gray-200 rounded-lg disabled:opacity-50">Next →</button>
        <button onClick={reset} className="px-3 py-2 bg-gray-200 rounded-lg">Reset</button>
        <span className="text-sm text-gray-500">Line {currentLine + 1}/{example.lines.length}</span>
        <div className="flex items-center gap-2 ml-4">
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showBytecode} onChange={e => setShowBytecode(e.target.checked)} />
            Bytecode
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showAssembly} onChange={e => setShowAssembly(e.target.checked)} />
            Assembly
          </label>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        {/* Python code */}
        <div className="col-span-3 bg-gray-900 rounded-lg p-4">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span className="text-xl">🐍</span> Python
          </h3>
          <div className="space-y-1">
            {example.lines.map((l, idx) => (
              <div key={idx}
                className={`font-mono text-sm px-2 py-1 rounded transition-all ${
                  idx === currentLine ? 'bg-yellow-500 text-black font-bold' :
                  idx < currentLine ? 'text-gray-500' : 'text-green-400'
                }`}>
                {l.python}
              </div>
            ))}
          </div>
        </div>

        {/* Bytecode */}
        {showBytecode && (
          <div className="col-span-3 bg-purple-900 rounded-lg p-4">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span className="text-xl">📝</span> Bytecode
            </h3>
            <div className="space-y-1">
              {line.bytecode.map((b, idx) => (
                <div key={idx} className="font-mono text-sm text-purple-200 bg-purple-800/50 px-2 py-1 rounded">
                  {b}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assembly */}
        {showAssembly && (
          <div className="col-span-3 bg-orange-900 rounded-lg p-4">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span className="text-xl">⚙️</span> Assembly
            </h3>
            <div className="space-y-1">
              {line.assembly.map((a, idx) => (
                <div key={idx} className="font-mono text-sm text-orange-200 bg-orange-800/50 px-2 py-1 rounded">
                  {a}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registers & Memory */}
        <div className={`${showBytecode && showAssembly ? 'col-span-3' : 'col-span-6'}`}>
          {/* Registers */}
          <div className="bg-red-50 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
              <span>📊</span> Registers
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(line.registers).map(([reg, val]) => (
                <div key={reg} className="flex justify-between bg-white p-2 rounded border">
                  <span className="font-mono text-sm font-bold text-red-600">{reg}</span>
                  <span className="font-mono text-sm">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Memory */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
              <span>💾</span> Memory
            </h3>
            <div className="space-y-2">
              {line.memory.map((m, idx) => (
                <div key={idx} className="bg-white p-2 rounded border flex justify-between items-center">
                  <div>
                    <span className="font-mono text-xs text-gray-500">{m.address}</span>
                    {m.label && <span className="ml-2 text-sm font-bold text-green-600">{m.label}</span>}
                  </div>
                  <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <h4 className="font-bold text-blue-800 mb-1">What's happening:</h4>
        <p className="text-blue-900">{line.explanation}</p>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-4 gap-4 text-sm">
        <div className="p-3 bg-gray-100 rounded-lg">
          <span className="font-bold text-gray-700">🐍 Python</span>
          <p className="text-gray-600">What you write</p>
        </div>
        <div className="p-3 bg-purple-100 rounded-lg">
          <span className="font-bold text-purple-700">📝 Bytecode</span>
          <p className="text-purple-600">Python VM instructions</p>
        </div>
        <div className="p-3 bg-orange-100 rounded-lg">
          <span className="font-bold text-orange-700">⚙️ Assembly</span>
          <p className="text-orange-600">CPU instructions</p>
        </div>
        <div className="p-3 bg-green-100 rounded-lg">
          <span className="font-bold text-green-700">💾 Hardware</span>
          <p className="text-green-600">Registers & Memory</p>
        </div>
      </div>
    </div>
  );
};

export default SideBySideView;
