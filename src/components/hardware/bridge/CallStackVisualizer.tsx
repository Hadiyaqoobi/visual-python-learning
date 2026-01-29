// H16: Function Call Stack Visualizer
// Shows how function calls create stack frames

import React, { useState, useCallback, useRef } from 'react';

interface StackFrame {
  id: number;
  functionName: string;
  args: Record<string, any>;
  locals: Record<string, any>;
  returnAddress: string;
  lineNumber: number;
  color: string;
}

interface ExecutionStep {
  action: 'call' | 'return' | 'assign' | 'line';
  description: string;
  frame?: StackFrame;
  returnValue?: any;
  highlightLine: number;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#22c55e'];

const EXAMPLES = [
  {
    name: 'Simple Call',
    code: `def greet(name):
    message = "Hello, " + name
    return message

result = greet("World")
print(result)`,
    steps: [
      { action: 'line', description: 'Define function greet', highlightLine: 0 },
      { action: 'call', description: 'Call greet("World")', highlightLine: 4, 
        frame: { functionName: 'greet', args: { name: '"World"' }, locals: {}, returnAddress: 'line 5', lineNumber: 1 } },
      { action: 'assign', description: 'Create local variable message', highlightLine: 1 },
      { action: 'return', description: 'Return "Hello, World"', highlightLine: 2, returnValue: '"Hello, World"' },
      { action: 'assign', description: 'Store result', highlightLine: 4 },
      { action: 'line', description: 'Print result', highlightLine: 5 },
    ],
  },
  {
    name: 'Nested Calls',
    code: `def add(a, b):
    return a + b

def multiply(x, y):
    result = 0
    for i in range(y):
        result = add(result, x)
    return result

answer = multiply(3, 4)`,
    steps: [
      { action: 'line', description: 'Define add function', highlightLine: 0 },
      { action: 'line', description: 'Define multiply function', highlightLine: 3 },
      { action: 'call', description: 'Call multiply(3, 4)', highlightLine: 9,
        frame: { functionName: 'multiply', args: { x: 3, y: 4 }, locals: { result: 0, i: 0 }, returnAddress: 'line 10', lineNumber: 4 } },
      { action: 'call', description: 'Call add(0, 3) - iteration 1', highlightLine: 6,
        frame: { functionName: 'add', args: { a: 0, b: 3 }, locals: {}, returnAddress: 'multiply:7', lineNumber: 1 } },
      { action: 'return', description: 'add returns 3', highlightLine: 1, returnValue: 3 },
      { action: 'call', description: 'Call add(3, 3) - iteration 2', highlightLine: 6,
        frame: { functionName: 'add', args: { a: 3, b: 3 }, locals: {}, returnAddress: 'multiply:7', lineNumber: 1 } },
      { action: 'return', description: 'add returns 6', highlightLine: 1, returnValue: 6 },
      { action: 'call', description: 'Call add(6, 3) - iteration 3', highlightLine: 6,
        frame: { functionName: 'add', args: { a: 6, b: 3 }, locals: {}, returnAddress: 'multiply:7', lineNumber: 1 } },
      { action: 'return', description: 'add returns 9', highlightLine: 1, returnValue: 9 },
      { action: 'call', description: 'Call add(9, 3) - iteration 4', highlightLine: 6,
        frame: { functionName: 'add', args: { a: 9, b: 3 }, locals: {}, returnAddress: 'multiply:7', lineNumber: 1 } },
      { action: 'return', description: 'add returns 12', highlightLine: 1, returnValue: 12 },
      { action: 'return', description: 'multiply returns 12', highlightLine: 7, returnValue: 12 },
    ],
  },
  {
    name: 'Recursion',
    code: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

result = factorial(4)`,
    steps: [
      { action: 'line', description: 'Define factorial function', highlightLine: 0 },
      { action: 'call', description: 'Call factorial(4)', highlightLine: 5,
        frame: { functionName: 'factorial', args: { n: 4 }, locals: {}, returnAddress: 'line 6', lineNumber: 1 } },
      { action: 'call', description: 'Recurse: factorial(3)', highlightLine: 3,
        frame: { functionName: 'factorial', args: { n: 3 }, locals: {}, returnAddress: 'factorial:4', lineNumber: 1 } },
      { action: 'call', description: 'Recurse: factorial(2)', highlightLine: 3,
        frame: { functionName: 'factorial', args: { n: 2 }, locals: {}, returnAddress: 'factorial:4', lineNumber: 1 } },
      { action: 'call', description: 'Recurse: factorial(1)', highlightLine: 3,
        frame: { functionName: 'factorial', args: { n: 1 }, locals: {}, returnAddress: 'factorial:4', lineNumber: 1 } },
      { action: 'return', description: 'Base case: return 1', highlightLine: 2, returnValue: 1 },
      { action: 'return', description: '2 * 1 = 2', highlightLine: 3, returnValue: 2 },
      { action: 'return', description: '3 * 2 = 6', highlightLine: 3, returnValue: 6 },
      { action: 'return', description: '4 * 6 = 24', highlightLine: 3, returnValue: 24 },
    ],
  },
];

export const CallStackVisualizer: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState(0);
  const [stack, setStack] = useState<StackFrame[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [lastReturn, setLastReturn] = useState<any>(null);
  
  const frameIdRef = useRef(0);
  const runningRef = useRef(false);

  const example = EXAMPLES[selectedExample];
  const lines = example.code.split('\n');

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runVisualization = useCallback(async () => {
    setIsRunning(true);
    runningRef.current = true;
    setStack([]);
    setCurrentStep(-1);
    setLastReturn(null);
    frameIdRef.current = 0;

    const steps = example.steps as ExecutionStep[];

    for (let i = 0; i < steps.length; i++) {
      if (!runningRef.current) break;
      
      const step = steps[i];
      setCurrentStep(i);

      if (step.action === 'call' && step.frame) {
        const newFrame: StackFrame = {
          id: frameIdRef.current++,
          functionName: step.frame.functionName,
          args: step.frame.args,
          locals: step.frame.locals || {},
          returnAddress: step.frame.returnAddress,
          lineNumber: step.frame.lineNumber,
          color: COLORS[frameIdRef.current % COLORS.length],
        };
        setStack(prev => [...prev, newFrame]);
        setLastReturn(null);
      } else if (step.action === 'return') {
        setLastReturn(step.returnValue);
        await sleep(speed / 2);
        setStack(prev => prev.slice(0, -1));
      }

      await sleep(speed);
    }

    setIsRunning(false);
    runningRef.current = false;
  }, [selectedExample, speed, example.steps]);

  const stopVisualization = () => {
    runningRef.current = false;
    setIsRunning(false);
  };

  const resetVisualization = () => {
    stopVisualization();
    setStack([]);
    setCurrentStep(-1);
    setLastReturn(null);
  };

  const currentStepData = currentStep >= 0 ? (example.steps[currentStep] as ExecutionStep) : null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Function Call Stack Visualizer
        </h2>
        <p className="text-gray-600">
          Watch how function calls create stack frames. Each call pushes a frame,
          each return pops one. The stack grows and shrinks as your code runs.
        </p>
      </div>

      {/* Example selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {EXAMPLES.map((ex, idx) => (
          <button
            key={ex.name}
            onClick={() => { setSelectedExample(idx); resetVisualization(); }}
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
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={isRunning ? stopVisualization : runVisualization}
          className={`px-6 py-2 rounded-lg font-medium text-white ${
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? '⏹ Stop' : '▶ Run'}
        </button>
        <button
          onClick={resetVisualization}
          disabled={isRunning}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Reset
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Speed:</span>
          <input
            type="range"
            min={200}
            max={2000}
            step={100}
            value={2200 - speed}
            onChange={(e) => setSpeed(2200 - parseInt(e.target.value))}
            className="w-24"
          />
          <span className="text-sm text-gray-500">{speed < 500 ? 'Fast' : speed > 1500 ? 'Slow' : 'Medium'}</span>
        </div>
      </div>

      {/* Current action */}
      {currentStepData && (
        <div className={`mb-6 p-4 rounded-lg font-medium ${
          currentStepData.action === 'call' ? 'bg-green-100 text-green-800' :
          currentStepData.action === 'return' ? 'bg-orange-100 text-orange-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {currentStepData.action === 'call' && '📥 '}
          {currentStepData.action === 'return' && '📤 '}
          {currentStepData.description}
          {lastReturn !== null && currentStepData.action === 'return' && (
            <span className="ml-2 font-mono bg-white/50 px-2 py-1 rounded">
              = {JSON.stringify(lastReturn)}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Code panel */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-white font-bold mb-3">Python Code</h3>
          <div className="space-y-1">
            {lines.map((line, idx) => (
              <div
                key={idx}
                className={`font-mono text-sm px-2 py-1 rounded transition-all flex ${
                  currentStepData?.highlightLine === idx
                    ? 'bg-yellow-500 text-black'
                    : 'text-green-400'
                }`}
              >
                <span className="w-6 text-gray-500 select-none">{idx + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stack panel */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-bold mb-3 text-gray-700 flex items-center gap-2">
            Call Stack
            <span className="text-sm font-normal text-gray-500">
              ({stack.length} frame{stack.length !== 1 ? 's' : ''})
            </span>
          </h3>
          
          {stack.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              <div className="text-4xl mb-2">📭</div>
              <p>Stack is empty</p>
              <p className="text-sm">Run the code to see stack frames</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Stack grows upward visually */}
              {[...stack].reverse().map((frame, idx) => (
                <div
                  key={frame.id}
                  className={`rounded-lg p-4 text-white transition-all ${
                    idx === 0 ? 'ring-2 ring-yellow-400 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: frame.color }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">{frame.functionName}()</span>
                    {idx === 0 && (
                      <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded">
                        ← Current
                      </span>
                    )}
                  </div>
                  
                  {/* Arguments */}
                  <div className="text-sm mb-2">
                    <span className="opacity-75">Args: </span>
                    {Object.entries(frame.args).map(([k, v], i) => (
                      <span key={k} className="font-mono">
                        {i > 0 && ', '}{k}={JSON.stringify(v)}
                      </span>
                    ))}
                  </div>
                  
                  {/* Locals */}
                  {Object.keys(frame.locals).length > 0 && (
                    <div className="text-sm mb-2">
                      <span className="opacity-75">Locals: </span>
                      {Object.entries(frame.locals).map(([k, v], i) => (
                        <span key={k} className="font-mono">
                          {i > 0 && ', '}{k}={JSON.stringify(v)}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs opacity-75">
                    Return to: {frame.returnAddress}
                  </div>
                </div>
              ))}
              
              {/* Stack base */}
              <div className="border-t-4 border-gray-400 pt-2 text-center text-gray-500 text-sm">
                ⬇️ Stack Base (main)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Concepts */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-bold text-green-800 mb-2">📥 Function Call (Push)</h4>
          <p className="text-sm text-green-700">
            When a function is called, a new stack frame is pushed. It contains
            arguments, local variables, and the return address.
          </p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <h4 className="font-bold text-orange-800 mb-2">📤 Return (Pop)</h4>
          <p className="text-sm text-orange-700">
            When a function returns, its frame is popped off the stack. Execution 
            continues at the return address with the returned value.
          </p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <h4 className="font-bold text-red-800 mb-2">💥 Stack Overflow</h4>
          <p className="text-sm text-red-700">
            Too many nested calls (like infinite recursion) fills the stack,
            causing a crash. Python limits recursion depth to ~1000.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallStackVisualizer;
