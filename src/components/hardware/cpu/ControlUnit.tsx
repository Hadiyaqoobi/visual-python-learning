"use client";
import React, { useState, useCallback, useRef } from 'react';

interface ControlSignal {
  name: string;
  description: string;
  active: boolean;
}

interface Instruction {
  name: string;
  opcode: string;
  description: string;
  signals: string[];
  steps: { phase: string; description: string; activeSignals: string[] }[];
}

const INSTRUCTIONS: Instruction[] = [
  {
    name: 'ADD',
    opcode: '0x01',
    description: 'Add two registers',
    signals: ['RegRead', 'ALUOp', 'RegWrite'],
    steps: [
      { phase: 'Fetch', description: 'Get instruction from memory', activeSignals: ['MemRead', 'PCIncrement'] },
      { phase: 'Decode', description: 'Identify ADD operation', activeSignals: ['IRLoad', 'RegSelect'] },
      { phase: 'Execute', description: 'ALU performs addition', activeSignals: ['RegRead', 'ALUOp'] },
      { phase: 'WriteBack', description: 'Store result in register', activeSignals: ['RegWrite'] },
    ],
  },
  {
    name: 'LOAD',
    opcode: '0x02',
    description: 'Load value from memory',
    signals: ['MemRead', 'RegWrite'],
    steps: [
      { phase: 'Fetch', description: 'Get instruction from memory', activeSignals: ['MemRead', 'PCIncrement'] },
      { phase: 'Decode', description: 'Identify LOAD operation', activeSignals: ['IRLoad', 'AddrCalc'] },
      { phase: 'Memory', description: 'Read from memory address', activeSignals: ['MemRead', 'AddrSelect'] },
      { phase: 'WriteBack', description: 'Store in register', activeSignals: ['RegWrite'] },
    ],
  },
  {
    name: 'STORE',
    opcode: '0x03',
    description: 'Store value to memory',
    signals: ['RegRead', 'MemWrite'],
    steps: [
      { phase: 'Fetch', description: 'Get instruction from memory', activeSignals: ['MemRead', 'PCIncrement'] },
      { phase: 'Decode', description: 'Identify STORE operation', activeSignals: ['IRLoad', 'AddrCalc'] },
      { phase: 'Execute', description: 'Read register value', activeSignals: ['RegRead'] },
      { phase: 'Memory', description: 'Write to memory address', activeSignals: ['MemWrite', 'AddrSelect'] },
    ],
  },
];

const ALL_SIGNALS = [
  { name: 'MemRead', description: 'Read from memory' },
  { name: 'MemWrite', description: 'Write to memory' },
  { name: 'RegRead', description: 'Read from register' },
  { name: 'RegWrite', description: 'Write to register' },
  { name: 'ALUOp', description: 'ALU operation' },
  { name: 'PCIncrement', description: 'Increment program counter' },
  { name: 'IRLoad', description: 'Load instruction register' },
  { name: 'RegSelect', description: 'Select registers' },
  { name: 'AddrCalc', description: 'Calculate address' },
  { name: 'AddrSelect', description: 'Select memory address' },
];

export function ControlUnit() {
  const [selectedInstr, setSelectedInstr] = useState(0);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [activeSignals, setActiveSignals] = useState<string[]>([]);

  const runningRef = useRef(false);
  const instruction = INSTRUCTIONS[selectedInstr];

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runCycle = useCallback(async () => {
    setIsRunning(true);
    runningRef.current = true;
    setCurrentStep(-1);
    setActiveSignals([]);

    for (let i = 0; i < instruction.steps.length; i++) {
      if (!runningRef.current) break;
      setCurrentStep(i);
      setActiveSignals(instruction.steps[i].activeSignals);
      await sleep(speed);
    }

    await sleep(speed / 2);
    setActiveSignals([]);
    setIsRunning(false);
    runningRef.current = false;
  }, [selectedInstr, speed, instruction.steps]);

  const stop = () => { runningRef.current = false; setIsRunning(false); };
  const reset = () => { stop(); setCurrentStep(-1); setActiveSignals([]); };

  const currentStepData = currentStep >= 0 ? instruction.steps[currentStep] : null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Control Unit Conductor</h2>
        <p className="text-gray-600">
          The Control Unit orchestrates all CPU operations by sending control signals.
        </p>
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">Select Instruction:</div>
        <div className="flex gap-2">
          {INSTRUCTIONS.map((instr, idx) => (
            <button
              key={instr.name}
              onClick={() => { setSelectedInstr(idx); reset(); }}
              disabled={isRunning}
              className={`px-4 py-2 rounded-lg font-mono font-bold transition-all ${
                selectedInstr === idx ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {instr.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={isRunning ? stop : runCycle}
          className={`px-6 py-2 rounded-lg font-medium text-white ${
            isRunning ? 'bg-red-500' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? '⏹ Stop' : '▶ Execute'}
        </button>
        <button onClick={reset} className="px-4 py-2 bg-gray-200 rounded-lg">Reset</button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-1">
          <div className={`bg-purple-100 rounded-xl p-4 border-2 ${isRunning ? 'border-purple-500' : 'border-purple-200'}`}>
            <h3 className="font-bold text-purple-800 mb-3 text-center">🎛️ Control Unit</h3>
            <div className="bg-white rounded-lg p-3 mb-3">
              <div className="text-xs text-gray-500">Instruction</div>
              <div className="font-mono font-bold text-lg text-purple-600">{instruction.name}</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-xs text-gray-500">Phase</div>
              <div className={`font-bold text-lg ${currentStepData ? 'text-yellow-600' : 'text-gray-400'}`}>
                {currentStepData?.phase || 'Idle'}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <h3 className="font-bold text-gray-700 mb-3">Control Signals</h3>
          <div className="grid grid-cols-3 gap-2">
            {ALL_SIGNALS.map(signal => {
              const isActive = activeSignals.includes(signal.name);
              return (
                <div key={signal.name}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isActive ? 'bg-green-500 text-white scale-105 shadow-lg' : 'bg-gray-100 text-gray-500'
                  }`}>
                  <div className="font-mono text-sm font-bold">{signal.name}</div>
                  <div className="text-xs opacity-75">{signal.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {currentStepData && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
          <h4 className="font-bold text-yellow-800">Phase: {currentStepData.phase}</h4>
          <p className="text-yellow-900">{currentStepData.description}</p>
        </div>
      )}

      <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
        <h4 className="font-bold text-blue-800">💡 Key Insight</h4>
        <p className="text-blue-900">
          The Control Unit doesn&apos;t compute - it coordinates. Like a conductor leading an orchestra,
          it sends signals to tell other components what to do.
        </p>
      </div>
    </div>
  );
}

export default ControlUnit;
