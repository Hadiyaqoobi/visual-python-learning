// H17: CPU Execution Simulator
// Shows how Python operations translate to CPU cycles

import React, { useState, useCallback, useRef } from 'react';

interface Register {
  name: string;
  value: number | string;
  description: string;
}

interface CPUState {
  registers: Register[];
  flags: { zero: boolean; carry: boolean; sign: boolean };
  currentInstruction: string;
  phase: 'fetch' | 'decode' | 'execute' | 'writeback' | 'idle';
}

interface Instruction {
  assembly: string;
  description: string;
  action: (state: CPUState) => CPUState;
}

const INITIAL_REGISTERS: Register[] = [
  { name: 'RAX', value: 0, description: 'Accumulator' },
  { name: 'RBX', value: 0, description: 'Base' },
  { name: 'RCX', value: 0, description: 'Counter' },
  { name: 'RDX', value: 0, description: 'Data' },
  { name: 'RIP', value: 0, description: 'Instruction Pointer' },
  { name: 'RSP', value: 1000, description: 'Stack Pointer' },
];

const EXAMPLES = [
  {
    name: 'Addition: x = 5 + 3',
    python: 'x = 5 + 3',
    instructions: [
      {
        assembly: 'MOV RAX, 5',
        description: 'Load 5 into accumulator',
        action: (s: CPUState) => ({
          ...s,
          registers: s.registers.map(r => r.name === 'RAX' ? { ...r, value: 5 } : r)
        })
      },
      {
        assembly: 'MOV RBX, 3',
        description: 'Load 3 into base register',
        action: (s: CPUState) => ({
          ...s,
          registers: s.registers.map(r => r.name === 'RBX' ? { ...r, value: 3 } : r)
        })
      },
      {
        assembly: 'ADD RAX, RBX',
        description: 'Add RBX to RAX (5 + 3 = 8)',
        action: (s: CPUState) => {
          const rax = s.registers.find(r => r.name === 'RAX')!;
          const rbx = s.registers.find(r => r.name === 'RBX')!;
          const result = (rax.value as number) + (rbx.value as number);
          return {
            ...s,
            registers: s.registers.map(r => r.name === 'RAX' ? { ...r, value: result } : r),
            flags: { ...s.flags, zero: result === 0, sign: result < 0 }
          };
        }
      },
      {
        assembly: 'MOV [x], RAX',
        description: 'Store result in memory location x',
        action: (s: CPUState) => s
      },
    ]
  },
  {
    name: 'Loop: sum 1 to 5',
    python: `total = 0
for i in range(1, 6):
    total += i`,
    instructions: [
      {
        assembly: 'XOR RAX, RAX',
        description: 'Clear RAX (total = 0)',
        action: (s: CPUState) => ({
          ...s,
          registers: s.registers.map(r => r.name === 'RAX' ? { ...r, value: 0 } : r),
          flags: { ...s.flags, zero: true }
        })
      },
      {
        assembly: 'MOV RCX, 1',
        description: 'Initialize counter i = 1',
        action: (s: CPUState) => ({
          ...s,
          registers: s.registers.map(r => r.name === 'RCX' ? { ...r, value: 1 } : r)
        })
      },
      {
        assembly: 'loop: ADD RAX, RCX',
        description: 'total += i (0 + 1 = 1)',
        action: (s: CPUState) => {
          const rax = s.registers.find(r => r.name === 'RAX')!;
          const rcx = s.registers.find(r => r.name === 'RCX')!;
          return {
            ...s,
            registers: s.registers.map(r => r.name === 'RAX' ? { ...r, value: (rax.value as number) + (rcx.value as number) } : r)
          };
        }
      },
      {
        assembly: 'INC RCX',
        description: 'i++ (i = 2)',
        action: (s: CPUState) => ({
          ...s,
          registers: s.registers.map(r => r.name === 'RCX' ? { ...r, value: (r.value as number) + 1 } : r)
        })
      },
      {
        assembly: 'CMP RCX, 6',
        description: 'Compare i with 6',
        action: (s: CPUState) => {
          const rcx = s.registers.find(r => r.name === 'RCX')!;
          return { ...s, flags: { ...s.flags, zero: rcx.value === 6, sign: (rcx.value as number) < 6 } };
        }
      },
      {
        assembly: 'JL loop',
        description: 'Jump if less (continue loop)',
        action: (s: CPUState) => s
      },
      {
        assembly: 'ADD RAX, RCX',
        description: 'total += i (1 + 2 = 3)',
        action: (s: CPUState) => {
          const rax = s.registers.find(r => r.name === 'RAX')!;
          const rcx = s.registers.find(r => r.name === 'RCX')!;
          return {
            ...s,
            registers: s.registers.map(r => r.name === 'RAX' ? { ...r, value: (rax.value as number) + (rcx.value as number) } : r)
          };
        }
      },
      {
        assembly: '... (loop continues)',
        description: 'Iterations 3, 4, 5...',
        action: (s: CPUState) => ({
          ...s,
          registers: s.registers.map(r => r.name === 'RAX' ? { ...r, value: 15 } : r.name === 'RCX' ? { ...r, value: 6 } : r)
        })
      },
    ]
  },
  {
    name: 'Comparison: if x > 5',
    python: `x = 10
if x > 5:
    result = 1`,
    instructions: [
      {
        assembly: 'MOV RAX, 10',
        description: 'Load x = 10',
        action: (s: CPUState) => ({
          ...s,
          registers: s.registers.map(r => r.name === 'RAX' ? { ...r, value: 10 } : r)
        })
      },
      {
        assembly: 'CMP RAX, 5',
        description: 'Compare x with 5 (10 - 5 = 5)',
        action: (s: CPUState) => ({
          ...s,
          flags: { zero: false, carry: false, sign: false }
        })
      },
      {
        assembly: 'JLE skip',
        description: 'Jump if less or equal (not taken!)',
        action: (s: CPUState) => s
      },
      {
        assembly: 'MOV RBX, 1',
        description: 'result = 1 (condition was true)',
        action: (s: CPUState) => ({
          ...s,
          registers: s.registers.map(r => r.name === 'RBX' ? { ...r, value: 1 } : r)
        })
      },
      {
        assembly: 'skip:',
        description: 'Continue execution',
        action: (s: CPUState) => s
      },
    ]
  },
];

const PHASES = [
  { name: 'fetch', label: 'Fetch', color: '#3b82f6', description: 'Get instruction from memory' },
  { name: 'decode', label: 'Decode', color: '#8b5cf6', description: 'Understand what to do' },
  { name: 'execute', label: 'Execute', color: '#f97316', description: 'Perform the operation' },
  { name: 'writeback', label: 'Write', color: '#22c55e', description: 'Store the result' },
];

export const CPUExecutionSimulator: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState(0);
  const [cpuState, setCpuState] = useState<CPUState>({
    registers: INITIAL_REGISTERS,
    flags: { zero: false, carry: false, sign: false },
    currentInstruction: '',
    phase: 'idle',
  });
  const [currentInstr, setCurrentInstr] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [showPhases, setShowPhases] = useState(true);

  const runningRef = useRef(false);
  const example = EXAMPLES[selectedExample];

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runSimulation = useCallback(async () => {
    setIsRunning(true);
    runningRef.current = true;
    setCpuState({
      registers: INITIAL_REGISTERS,
      flags: { zero: false, carry: false, sign: false },
      currentInstruction: '',
      phase: 'idle',
    });
    setCurrentInstr(-1);

    for (let i = 0; i < example.instructions.length; i++) {
      if (!runningRef.current) break;

      const instr = example.instructions[i];
      setCurrentInstr(i);

      // Fetch phase
      if (showPhases) {
        setCpuState(s => ({ ...s, phase: 'fetch', currentInstruction: instr.assembly }));
        await sleep(speed);
      }

      // Decode phase
      if (showPhases) {
        setCpuState(s => ({ ...s, phase: 'decode' }));
        await sleep(speed);
      }

      // Execute phase
      setCpuState(s => {
        const newState = instr.action(s);
        return { ...newState, phase: 'execute', currentInstruction: instr.assembly };
      });
      await sleep(speed);

      // Writeback phase
      if (showPhases) {
        setCpuState(s => ({ ...s, phase: 'writeback' }));
        await sleep(speed);
      }

      // Update instruction pointer
      setCpuState(s => ({
        ...s,
        registers: s.registers.map(r => r.name === 'RIP' ? { ...r, value: i + 1 } : r),
        phase: 'idle',
      }));
      await sleep(speed / 2);
    }

    setIsRunning(false);
    runningRef.current = false;
  }, [selectedExample, speed, showPhases, example.instructions]);

  const stopSimulation = () => {
    runningRef.current = false;
    setIsRunning(false);
  };

  const resetSimulation = () => {
    stopSimulation();
    setCpuState({
      registers: INITIAL_REGISTERS,
      flags: { zero: false, carry: false, sign: false },
      currentInstruction: '',
      phase: 'idle',
    });
    setCurrentInstr(-1);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          CPU Execution Simulator
        </h2>
        <p className="text-gray-600">
          See how Python operations become CPU instructions. Watch registers change
          as each instruction executes through the fetch-decode-execute cycle.
        </p>
      </div>

      {/* Example selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {EXAMPLES.map((ex, idx) => (
          <button
            key={ex.name}
            onClick={() => { setSelectedExample(idx); resetSimulation(); }}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedExample === idx
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            } ${isRunning ? 'opacity-50' : ''}`}
          >
            {ex.name}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center gap-4 flex-wrap">
        <button
          onClick={isRunning ? stopSimulation : runSimulation}
          className={`px-6 py-2 rounded-lg font-medium text-white ${
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? '⏹ Stop' : '▶ Run'}
        </button>
        <button
          onClick={resetSimulation}
          disabled={isRunning}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Reset
        </button>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showPhases}
            onChange={(e) => setShowPhases(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Show CPU phases</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Speed:</span>
          <input
            type="range"
            min={200}
            max={1500}
            value={1700 - speed}
            onChange={(e) => setSpeed(1700 - parseInt(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      {/* CPU Phases */}
      {showPhases && (
        <div className="mb-6 flex gap-2">
          {PHASES.map((phase) => (
            <div
              key={phase.name}
              className={`flex-1 p-3 rounded-lg text-center transition-all ${
                cpuState.phase === phase.name
                  ? 'scale-105 shadow-lg text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              style={{
                backgroundColor: cpuState.phase === phase.name ? phase.color : undefined
              }}
            >
              <div className="font-bold">{phase.label}</div>
              <div className="text-xs">{phase.description}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Python code */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-white font-bold mb-3">Python</h3>
          <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
            {example.python}
          </pre>
        </div>

        {/* Assembly */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-white font-bold mb-3">Assembly Instructions</h3>
          <div className="space-y-1">
            {example.instructions.map((instr, idx) => (
              <div
                key={idx}
                className={`font-mono text-sm px-2 py-1 rounded transition-all ${
                  currentInstr === idx
                    ? 'bg-yellow-500 text-black'
                    : idx < currentInstr
                    ? 'text-gray-500'
                    : 'text-blue-400'
                }`}
              >
                {instr.assembly}
              </div>
            ))}
          </div>
        </div>

        {/* Registers */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-bold mb-3 text-gray-700">CPU Registers</h3>
          <div className="space-y-2">
            {cpuState.registers.map((reg) => (
              <div
                key={reg.name}
                className={`flex items-center justify-between p-2 rounded transition-all ${
                  reg.name === 'RAX' && cpuState.phase === 'execute'
                    ? 'bg-yellow-200'
                    : 'bg-white'
                }`}
              >
                <div>
                  <span className="font-mono font-bold text-blue-600">{reg.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{reg.description}</span>
                </div>
                <span className="font-mono bg-gray-200 px-2 py-1 rounded">
                  {typeof reg.value === 'number' ? reg.value : reg.value}
                </span>
              </div>
            ))}
          </div>

          {/* Flags */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-bold text-gray-600 mb-2">Flags</h4>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded text-xs font-mono ${
                cpuState.flags.zero ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}>
                ZF={cpuState.flags.zero ? '1' : '0'}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-mono ${
                cpuState.flags.carry ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}>
                CF={cpuState.flags.carry ? '1' : '0'}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-mono ${
                cpuState.flags.sign ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}>
                SF={cpuState.flags.sign ? '1' : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Current instruction description */}
      {currentInstr >= 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-bold text-blue-800">Current: {example.instructions[currentInstr].assembly}</h4>
          <p className="text-blue-700">{example.instructions[currentInstr].description}</p>
        </div>
      )}

      {/* Concepts */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-bold text-blue-800 text-sm mb-1">Fetch</h4>
          <p className="text-xs text-blue-700">Read instruction from memory at address RIP</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <h4 className="font-bold text-purple-800 text-sm mb-1">Decode</h4>
          <p className="text-xs text-purple-700">Parse opcode and operands</p>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <h4 className="font-bold text-orange-800 text-sm mb-1">Execute</h4>
          <p className="text-xs text-orange-700">ALU performs the operation</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <h4 className="font-bold text-green-800 text-sm mb-1">Write Back</h4>
          <p className="text-xs text-green-700">Store result in register/memory</p>
        </div>
      </div>
    </div>
  );
};

export default CPUExecutionSimulator;
