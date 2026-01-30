// H5: Register File Explorer
// Visualize CPU registers and compare speeds with cache/RAM

import React, { useState, useCallback, useRef } from 'react';

interface Register {
  name: string;
  fullName: string;
  value: number;
  description: string;
  color: string;
}

const INITIAL_REGISTERS: Register[] = [
  { name: 'RAX', fullName: 'Accumulator', value: 0, description: 'General purpose, math results', color: '#ef4444' },
  { name: 'RBX', fullName: 'Base', value: 0, description: 'General purpose, base pointer', color: '#f97316' },
  { name: 'RCX', fullName: 'Counter', value: 0, description: 'Loop counter', color: '#eab308' },
  { name: 'RDX', fullName: 'Data', value: 0, description: 'I/O operations, multiply/divide', color: '#22c55e' },
  { name: 'RSP', fullName: 'Stack Pointer', value: 0x7FFF0000, description: 'Top of stack', color: '#14b8a6' },
  { name: 'RBP', fullName: 'Base Pointer', value: 0x7FFF0000, description: 'Stack frame base', color: '#3b82f6' },
  { name: 'RSI', fullName: 'Source Index', value: 0, description: 'String source pointer', color: '#8b5cf6' },
  { name: 'RDI', fullName: 'Dest Index', value: 0, description: 'String destination pointer', color: '#ec4899' },
];

interface AccessTime {
  name: string;
  time: string;
  timeNs: number;
  color: string;
  icon: string;
}

const ACCESS_TIMES: AccessTime[] = [
  { name: 'Register', time: '< 1 ns', timeNs: 0.5, color: '#ef4444', icon: '📊' },
  { name: 'L1 Cache', time: '~1 ns', timeNs: 1, color: '#f97316', icon: '⚡' },
  { name: 'L2 Cache', time: '~4 ns', timeNs: 4, color: '#eab308', icon: '💨' },
  { name: 'L3 Cache', time: '~12 ns', timeNs: 12, color: '#22c55e', icon: '📦' },
  { name: 'RAM', time: '~100 ns', timeNs: 100, color: '#3b82f6', icon: '💾' },
  { name: 'SSD', time: '~100 μs', timeNs: 100000, color: '#8b5cf6', icon: '💿' },
];

export const RegisterFile: React.FC = () => {
  const [registers, setRegisters] = useState<Register[]>(INITIAL_REGISTERS);
  const [selectedReg, setSelectedReg] = useState<string | null>('RAX');
  const [editValue, setEditValue] = useState('');
  const [accessDemo, setAccessDemo] = useState<{ active: boolean; level: number; complete: boolean }>({
    active: false, level: -1, complete: false
  });
  const [operation, setOperation] = useState<string | null>(null);

  const runningRef = useRef(false);
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const updateRegister = (name: string, value: number) => {
    setRegisters(prev => prev.map(r => 
      r.name === name ? { ...r, value: value & 0xFFFFFFFF } : r
    ));
  };

  const handleSetValue = () => {
    if (!selectedReg) return;
    const value = parseInt(editValue, 16) || parseInt(editValue) || 0;
    updateRegister(selectedReg, value);
    setEditValue('');
  };

  const runSpeedDemo = useCallback(async () => {
    setAccessDemo({ active: true, level: 0, complete: false });
    runningRef.current = true;

    for (let i = 0; i < ACCESS_TIMES.length; i++) {
      if (!runningRef.current) break;
      setAccessDemo({ active: true, level: i, complete: false });
      // Simulate relative access time (scaled for visualization)
      const delay = Math.min(100 + i * 150, 800);
      await sleep(delay);
    }

    setAccessDemo({ active: false, level: -1, complete: true });
    runningRef.current = false;
  }, []);

  const runOperation = async (op: string) => {
    setOperation(op);
    await sleep(300);

    const rax = registers.find(r => r.name === 'RAX')!.value;
    const rbx = registers.find(r => r.name === 'RBX')!.value;

    switch (op) {
      case 'ADD':
        updateRegister('RAX', rax + rbx);
        break;
      case 'SUB':
        updateRegister('RAX', rax - rbx);
        break;
      case 'INC':
        updateRegister('RCX', registers.find(r => r.name === 'RCX')!.value + 1);
        break;
      case 'MOV':
        updateRegister('RDX', rax);
        break;
      case 'XOR':
        updateRegister('RAX', rax ^ rbx);
        break;
      case 'CLEAR':
        setRegisters(INITIAL_REGISTERS);
        break;
    }

    await sleep(300);
    setOperation(null);
  };

  const selectedRegData = registers.find(r => r.name === selectedReg);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Register File Explorer</h2>
        <p className="text-gray-600">
          Registers are the fastest storage in a computer - tiny memory cells inside the CPU itself.
          Click registers to select them, modify values, and see operations in action.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Register file */}
        <div className="col-span-2">
          <h3 className="font-bold text-gray-700 mb-3">CPU Registers (x86-64)</h3>
          <div className="grid grid-cols-2 gap-3">
            {registers.map(reg => (
              <button
                key={reg.name}
                onClick={() => setSelectedReg(reg.name)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedReg === reg.name 
                    ? 'ring-2 ring-offset-2 scale-[1.02]' 
                    : 'hover:scale-[1.01]'
                } ${operation ? 'animate-pulse' : ''}`}
                style={{ 
                  backgroundColor: `${reg.color}20`,
                  borderLeft: `4px solid ${reg.color}`,
                  ringColor: reg.color
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold" style={{ color: reg.color }}>
                    {reg.name}
                  </span>
                  <span className="text-xs text-gray-500">{reg.fullName}</span>
                </div>
                <div className="font-mono text-lg mt-1">
                  0x{reg.value.toString(16).toUpperCase().padStart(8, '0')}
                </div>
                <div className="text-xs text-gray-500 mt-1">{reg.description}</div>
              </button>
            ))}
          </div>

          {/* Operations */}
          <div className="mt-4">
            <h4 className="font-bold text-gray-700 mb-2">Quick Operations</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { op: 'ADD', label: 'RAX + RBX → RAX' },
                { op: 'SUB', label: 'RAX - RBX → RAX' },
                { op: 'INC', label: 'RCX++' },
                { op: 'MOV', label: 'RAX → RDX' },
                { op: 'XOR', label: 'RAX ^ RBX → RAX' },
                { op: 'CLEAR', label: 'Reset All' },
              ].map(({ op, label }) => (
                <button
                  key={op}
                  onClick={() => runOperation(op)}
                  disabled={!!operation}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    operation === op 
                      ? 'bg-yellow-400 text-black' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Details panel */}
        <div>
          {selectedRegData && (
            <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: `${selectedRegData.color}15` }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: selectedRegData.color }}>
                {selectedRegData.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{selectedRegData.fullName}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Hex:</span>
                  <span className="font-mono">0x{selectedRegData.value.toString(16).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Decimal:</span>
                  <span className="font-mono">{selectedRegData.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Binary:</span>
                  <span className="font-mono text-xs">
                    {selectedRegData.value.toString(2).padStart(8, '0').slice(-8)}...
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm text-gray-600">Set value:</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="0x or decimal"
                    className="flex-1 px-2 py-1 border rounded text-sm font-mono"
                    onKeyDown={(e) => e.key === 'Enter' && handleSetValue()}
                  />
                  <button
                    onClick={handleSetValue}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                  >
                    Set
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Speed comparison */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-gray-700 mb-2">⚡ Speed Comparison</h4>
            <button
              onClick={runSpeedDemo}
              disabled={accessDemo.active}
              className="w-full mb-3 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm disabled:opacity-50"
            >
              {accessDemo.active ? 'Running...' : 'Run Speed Demo'}
            </button>
            
            <div className="space-y-2">
              {ACCESS_TIMES.map((level, idx) => (
                <div
                  key={level.name}
                  className={`flex items-center gap-2 p-2 rounded transition-all ${
                    accessDemo.level === idx ? 'bg-yellow-100 scale-[1.02]' : ''
                  }`}
                >
                  <span>{level.icon}</span>
                  <span className="flex-1 text-sm">{level.name}</span>
                  <span className="text-xs font-mono text-gray-500">{level.time}</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (1 / level.timeNs) * 50)}%`,
                        backgroundColor: level.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {accessDemo.complete && (
              <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
                Registers are ~200x faster than RAM!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Python connection */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-bold text-blue-800 mb-2">🐍 Python Connection</h4>
        <p className="text-blue-900 text-sm mb-2">
          When you write <code className="bg-blue-200 px-1 rounded">x = 5 + 3</code>, 
          here's what happens in registers:
        </p>
        <div className="font-mono text-sm bg-white p-3 rounded border">
          <div>MOV RAX, 5    <span className="text-gray-400"># Load 5 into RAX</span></div>
          <div>MOV RBX, 3    <span className="text-gray-400"># Load 3 into RBX</span></div>
          <div>ADD RAX, RBX  <span className="text-gray-400"># RAX = RAX + RBX = 8</span></div>
          <div>MOV [x], RAX  <span className="text-gray-400"># Store result in memory</span></div>
        </div>
      </div>

      {/* Key insight */}
      <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <h4 className="font-bold text-yellow-800">💡 Key Insight</h4>
        <p className="text-yellow-900">
          CPUs have very few registers (16 general-purpose in x86-64) but they're incredibly fast.
          Good compilers try to keep frequently-used values in registers to maximize performance.
          This is why the memory hierarchy exists!
        </p>
      </div>
    </div>
  );
};

export default RegisterFile;
