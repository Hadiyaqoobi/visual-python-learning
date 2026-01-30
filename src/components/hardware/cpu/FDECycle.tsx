"use client";
import React, { useState, useCallback, useRef } from 'react';

interface CyclePhase {
  name: string;
  fullName: string;
  color: string;
  icon: string;
  description: string;
}

const PHASES: CyclePhase[] = [
  { name: 'Fetch', fullName: 'Instruction Fetch', color: '#3b82f6', icon: '📥', description: 'Get instruction from memory' },
  { name: 'Decode', fullName: 'Instruction Decode', color: '#8b5cf6', icon: '🔍', description: 'Figure out what to do' },
  { name: 'Execute', fullName: 'Execute', color: '#f97316', icon: '⚡', description: 'Perform the operation' },
  { name: 'Memory', fullName: 'Memory Access', color: '#22c55e', icon: '💾', description: 'Read/write memory if needed' },
  { name: 'WriteBack', fullName: 'Write Back', color: '#ef4444', icon: '📝', description: 'Store result in register' },
];

const DEMO_PROGRAM = [
  { address: 0, instruction: 'LOAD R1, [100]', action: 'Load value from address 100 into R1' },
  { address: 4, instruction: 'LOAD R2, [104]', action: 'Load value from address 104 into R2' },
  { address: 8, instruction: 'ADD R3, R1, R2', action: 'Add R1 and R2, store in R3' },
  { address: 12, instruction: 'STORE R3, [108]', action: 'Store R3 to address 108' },
];

export function FDECycle() {
  const [currentPhase, setCurrentPhase] = useState(-1);
  const [currentInstr, setCurrentInstr] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [registers, setRegisters] = useState([0, 0, 0, 0]);
  const [memory] = useState([0, 0, 0, 0, 42, 58, 0, 0]);
  const [completedCycles, setCompletedCycles] = useState(0);

  const runningRef = useRef(false);
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runCycle = useCallback(async () => {
    setIsRunning(true);
    runningRef.current = true;

    while (runningRef.current && currentInstr < DEMO_PROGRAM.length) {
      for (let phase = 0; phase < PHASES.length; phase++) {
        if (!runningRef.current) break;
        setCurrentPhase(phase);
        
        if (phase === 4) {
          setRegisters(prev => {
            const newRegs = [...prev];
            if (currentInstr === 0) newRegs[1] = 42;
            else if (currentInstr === 1) newRegs[2] = 58;
            else if (currentInstr === 2) newRegs[3] = newRegs[1] + newRegs[2];
            return newRegs;
          });
        }
        
        await sleep(speed);
      }

      if (runningRef.current) {
        setCompletedCycles(c => c + 1);
        setCurrentInstr(i => i + 1);
        setCurrentPhase(-1);
        await sleep(speed / 2);
      }
    }

    setIsRunning(false);
    runningRef.current = false;
  }, [currentInstr, speed]);

  const stop = () => { runningRef.current = false; setIsRunning(false); };
  
  const reset = () => {
    stop();
    setCurrentPhase(-1);
    setCurrentInstr(0);
    setCompletedCycles(0);
    setRegisters([0, 0, 0, 0]);
  };

  const stepPhase = () => {
    if (currentPhase < PHASES.length - 1) {
      setCurrentPhase(p => p + 1);
    } else {
      setCurrentPhase(-1);
      if (currentInstr < DEMO_PROGRAM.length - 1) {
        setCurrentInstr(i => i + 1);
        setCompletedCycles(c => c + 1);
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete FDE Cycle</h2>
        <p className="text-gray-600">
          Watch the CPU execute a program. Every instruction goes through Fetch → Decode → Execute → Memory → WriteBack.
        </p>
      </div>

      <div className="mb-6 flex items-center gap-4 flex-wrap">
        <button
          onClick={isRunning ? stop : runCycle}
          disabled={currentInstr >= DEMO_PROGRAM.length}
          className={`px-6 py-2 rounded-lg font-medium text-white ${
            isRunning ? 'bg-red-500' : 'bg-green-500 hover:bg-green-600'
          } disabled:opacity-50`}
        >
          {isRunning ? '⏹ Stop' : '▶ Run'}
        </button>
        <button onClick={stepPhase} disabled={isRunning || currentInstr >= DEMO_PROGRAM.length}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50">
          Step →
        </button>
        <button onClick={reset} className="px-4 py-2 bg-gray-200 rounded-lg">Reset</button>
        <span className="text-sm text-gray-500">Cycles: {completedCycles}</span>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          {PHASES.map((phase, idx) => (
            <div
              key={phase.name}
              className={`flex-1 p-4 rounded-lg text-center transition-all duration-300 ${
                idx === currentPhase ? 'scale-105 shadow-lg text-white' : idx < currentPhase ? 'opacity-50' : 'bg-gray-100'
              }`}
              style={{ backgroundColor: idx === currentPhase ? phase.color : undefined }}
            >
              <div className="text-2xl mb-1">{phase.icon}</div>
              <div className="font-bold">{phase.name}</div>
              {idx === currentPhase && <div className="text-xs mt-1 opacity-90">{phase.description}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-bold text-gray-700 mb-3">📜 Program</h3>
          <div className="space-y-2">
            {DEMO_PROGRAM.map((instr, idx) => (
              <div key={idx}
                className={`p-2 rounded font-mono text-sm transition-all ${
                  idx === currentInstr ? 'bg-yellow-200 ring-2 ring-yellow-400' :
                  idx < currentInstr ? 'bg-green-100 text-green-800' : 'bg-white'
                }`}>
                <div className="flex justify-between">
                  <span className="text-gray-500">[{instr.address}]</span>
                  <span className="font-bold">{instr.instruction}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{instr.action}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="font-bold text-red-800 mb-2">📊 Registers</h3>
            <div className="grid grid-cols-4 gap-2">
              {registers.map((val, idx) => (
                <div key={idx} className="bg-white p-2 rounded text-center">
                  <div className="text-xs text-gray-500">R{idx}</div>
                  <div className="font-mono font-bold">{val}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-bold text-green-800 mb-2">💾 Memory</h3>
            <div className="grid grid-cols-4 gap-2">
              {[100, 104, 108, 112].map((addr, idx) => (
                <div key={addr} className="bg-white p-2 rounded text-center">
                  <div className="text-xs text-gray-500">[{addr}]</div>
                  <div className="font-mono font-bold">{memory[idx + 4]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <h4 className="font-bold text-yellow-800">💡 Key Insight</h4>
        <p className="text-yellow-900">
          The FDE cycle repeats billions of times per second! Modern CPUs use pipelining to 
          process multiple instructions simultaneously.
        </p>
      </div>
    </div>
  );
}

export default FDECycle;
