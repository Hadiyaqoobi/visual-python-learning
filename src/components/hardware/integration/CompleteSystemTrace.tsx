// H18: Complete System Trace
// Trace a single Python operation through the ENTIRE system

import React, { useState, useCallback, useRef } from 'react';

interface SystemComponent {
  id: string;
  name: string;
  shortName: string;
  color: string;
  icon: string;
}

const SYSTEM_COMPONENTS: SystemComponent[] = [
  { id: 'python', name: 'Python Code', shortName: 'Python', color: '#3b82f6', icon: '🐍' },
  { id: 'interpreter', name: 'Interpreter', shortName: 'Interp', color: '#8b5cf6', icon: '⚙️' },
  { id: 'bytecode', name: 'Bytecode', shortName: 'Byte', color: '#ec4899', icon: '📝' },
  { id: 'cpu', name: 'CPU', shortName: 'CPU', color: '#f97316', icon: '🔲' },
  { id: 'registers', name: 'Registers', shortName: 'Regs', color: '#ef4444', icon: '📊' },
  { id: 'cache', name: 'Cache', shortName: 'Cache', color: '#eab308', icon: '⚡' },
  { id: 'ram', name: 'RAM', shortName: 'RAM', color: '#22c55e', icon: '💾' },
];

interface TraceStep {
  component: string;
  action: string;
  details: string;
  data?: string;
}

const TRACE_EXAMPLES = [
  {
    name: 'x = 5 + 3',
    code: 'x = 5 + 3',
    steps: [
      { component: 'python', action: 'Parse source', details: 'Tokenize: x, =, 5, +, 3', data: 'x = 5 + 3' },
      { component: 'interpreter', action: 'Build AST', details: 'Assign(Name(x), BinOp(5, Add, 3))' },
      { component: 'bytecode', action: 'Compile', details: 'LOAD_CONST 5, LOAD_CONST 3, BINARY_ADD, STORE_NAME', data: 'LOAD_CONST 5' },
      { component: 'cpu', action: 'Fetch instruction', details: 'Read bytecode from memory' },
      { component: 'ram', action: 'Read constant', details: 'Load value 5 from constants', data: '5' },
      { component: 'cache', action: 'Cache miss', details: 'Fetch from RAM, store in cache' },
      { component: 'registers', action: 'Store value', details: 'RAX = 5', data: 'RAX = 5' },
      { component: 'cpu', action: 'Fetch next', details: 'LOAD_CONST 3' },
      { component: 'registers', action: 'Store value', details: 'RBX = 3', data: 'RBX = 3' },
      { component: 'cpu', action: 'Execute ADD', details: 'ALU: 5 + 3 = 8', data: '5 + 3 = 8' },
      { component: 'registers', action: 'Store result', details: 'RAX = 8', data: 'RAX = 8' },
      { component: 'ram', action: 'Create PyObject', details: 'Allocate PyLongObject(8)' },
      { component: 'ram', action: 'Update namespace', details: 'x → PyLong(8)', data: "locals['x']" },
      { component: 'python', action: 'Complete!', details: 'x = 8', data: 'x = 8 ✓' },
    ]
  },
  {
    name: 'print("Hi")',
    code: 'print("Hi")',
    steps: [
      { component: 'python', action: 'Parse call', details: 'Function: print, Args: ["Hi"]' },
      { component: 'interpreter', action: 'Lookup', details: 'Find print in builtins' },
      { component: 'ram', action: 'Load function', details: 'builtin_function object' },
      { component: 'cache', action: 'Cache hit!', details: 'print used frequently' },
      { component: 'bytecode', action: 'Generate', details: 'LOAD_NAME, LOAD_CONST, CALL_FUNCTION' },
      { component: 'cpu', action: 'Setup call', details: 'Push stack frame' },
      { component: 'registers', action: 'Load args', details: 'RDI = "Hi"', data: 'RDI = "Hi"' },
      { component: 'ram', action: 'Read string', details: 'Bytes: 0x48 0x69' },
      { component: 'cpu', action: 'System call', details: 'write(1, "Hi", 2)', data: 'syscall' },
      { component: 'python', action: 'Output', details: '"Hi" displayed', data: 'Hi ✓' },
    ]
  },
  {
    name: 'a[0]',
    code: 'a=[1,2,3]; x=a[0]',
    steps: [
      { component: 'python', action: 'Create list', details: 'Parse [1, 2, 3]' },
      { component: 'ram', action: 'Allocate list', details: 'PyListObject + array', data: 'size=3' },
      { component: 'ram', action: 'Store elements', details: '3 PyLongObjects created' },
      { component: 'bytecode', action: 'Index op', details: 'BINARY_SUBSCR' },
      { component: 'cpu', action: 'Calculate addr', details: 'base + index * 8', data: 'offset=0' },
      { component: 'cache', action: 'Check cache', details: 'List header cached' },
      { component: 'ram', action: 'Read pointer', details: 'Get element 0 ptr' },
      { component: 'ram', action: 'Dereference', details: 'Follow → PyLong(1)', data: '1' },
      { component: 'registers', action: 'Load', details: 'RAX = 1', data: 'RAX = 1' },
      { component: 'python', action: 'Complete', details: 'x = 1', data: 'x = 1 ✓' },
    ]
  },
];

export const CompleteSystemTrace: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState(0);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const runningRef = useRef(false);
  const example = TRACE_EXAMPLES[selectedExample];

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runTrace = useCallback(async () => {
    setIsRunning(true);
    runningRef.current = true;
    setCurrentStep(-1);
    setCompletedSteps([]);

    for (let i = 0; i < example.steps.length; i++) {
      if (!runningRef.current) break;
      setCurrentStep(i);
      await sleep(speed);
      setCompletedSteps(prev => [...prev, i]);
    }

    setIsRunning(false);
    runningRef.current = false;
  }, [selectedExample, speed, example.steps.length]);

  const stopTrace = () => { runningRef.current = false; setIsRunning(false); };
  const resetTrace = () => { stopTrace(); setCurrentStep(-1); setCompletedSteps([]); };
  
  const stepForward = () => {
    if (currentStep < example.steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setCompletedSteps(prev => [...prev, next]);
    }
  };

  const getComponentStatus = (compId: string) => {
    if (currentStep < 0) return 'idle';
    if (example.steps[currentStep]?.component === compId) return 'active';
    if (completedSteps.some(i => example.steps[i].component === compId)) return 'used';
    return 'idle';
  };

  const currentStepData = currentStep >= 0 ? example.steps[currentStep] : null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete System Trace</h2>
        <p className="text-gray-600">
          Follow a Python operation through every system layer - from source code to CPU and memory.
        </p>
      </div>

      {/* Example selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TRACE_EXAMPLES.map((ex, idx) => (
          <button
            key={ex.name}
            onClick={() => { setSelectedExample(idx); resetTrace(); }}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg font-mono text-sm ${
              selectedExample === idx ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {ex.code}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center gap-4 flex-wrap">
        <button
          onClick={isRunning ? stopTrace : runTrace}
          className={`px-6 py-2 rounded-lg font-medium text-white ${
            isRunning ? 'bg-red-500' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? '⏹ Stop' : '▶ Run'}
        </button>
        <button onClick={stepForward} disabled={isRunning || currentStep >= example.steps.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50">
          Step →
        </button>
        <button onClick={resetTrace} className="px-4 py-2 bg-gray-200 rounded-lg">Reset</button>
        <input type="range" min={300} max={2000} value={2300 - speed}
          onChange={(e) => setSpeed(2300 - parseInt(e.target.value))} className="w-24" />
        <span className="text-sm text-gray-500">{currentStep + 1}/{example.steps.length}</span>
      </div>

      {/* System components */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between gap-1">
          {SYSTEM_COMPONENTS.map((comp) => {
            const status = getComponentStatus(comp.id);
            return (
              <div key={comp.id}
                className={`flex-1 p-2 rounded-lg text-center transition-all duration-300 ${
                  status === 'active' ? 'scale-110 shadow-lg ring-2 ring-yellow-400' :
                  status === 'used' ? '' : 'opacity-40'
                }`}
                style={{ backgroundColor: status !== 'idle' ? comp.color : '#e5e7eb' }}>
                <div className="text-xl">{comp.icon}</div>
                <div className={`text-xs font-bold ${status === 'active' ? 'text-white' : ''}`}>
                  {comp.shortName}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current step */}
      {currentStepData && (
        <div className="mb-6 p-4 rounded-lg text-white"
          style={{ backgroundColor: SYSTEM_COMPONENTS.find(c => c.id === currentStepData.component)?.color }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{SYSTEM_COMPONENTS.find(c => c.id === currentStepData.component)?.icon}</span>
            <div>
              <div className="font-bold">{SYSTEM_COMPONENTS.find(c => c.id === currentStepData.component)?.name}</div>
              <div className="opacity-90">{currentStepData.action}</div>
            </div>
          </div>
          <p className="opacity-90">{currentStepData.details}</p>
          {currentStepData.data && (
            <div className="mt-2 bg-black/20 p-2 rounded font-mono text-sm">{currentStepData.data}</div>
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="mb-6 max-h-48 overflow-y-auto">
        <h3 className="font-bold text-gray-700 mb-2">Timeline</h3>
        <div className="space-y-1">
          {example.steps.map((step, idx) => {
            const comp = SYSTEM_COMPONENTS.find(c => c.id === step.component)!;
            const isActive = idx === currentStep;
            const isDone = completedSteps.includes(idx);
            return (
              <div key={idx} className={`flex items-center gap-2 p-1 rounded text-sm ${
                isActive ? 'bg-yellow-100' : isDone ? 'bg-gray-50' : 'opacity-40'
              }`}>
                <span className="w-4 text-xs text-gray-400">{idx + 1}</span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: comp.color }} />
                <span className="w-16 font-medium">{comp.shortName}</span>
                <span className="flex-1 text-gray-600 truncate">{step.action}</span>
                {isDone && <span className="text-green-500">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Insight */}
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <h4 className="font-bold text-yellow-800">💡 Key Insight</h4>
        <p className="text-yellow-900">
          A simple <code className="bg-yellow-200 px-1 rounded">{example.code}</code> triggers 
          many operations across multiple layers. Understanding this flow helps you write better Python!
        </p>
      </div>
    </div>
  );
};

export default CompleteSystemTrace;
