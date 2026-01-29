// H15: Variable Memory Visualizer
// Shows how Python variables map to memory addresses

import React, { useState, useCallback } from 'react';

interface Variable {
  name: string;
  type: string;
  value: string;
  address: string;
  size: number;
  refCount: number;
  pyObject: {
    typePtr: string;
    refCount: number;
    value: string;
  };
}

interface MemoryBlock {
  address: string;
  content: string;
  label?: string;
  color: string;
}

const EXAMPLES = [
  {
    name: 'Integers',
    code: `a = 42
b = 42
c = 100`,
    explanation: 'Small integers (-5 to 256) are cached - a and b point to SAME object!',
  },
  {
    name: 'Strings',
    code: `name = "hello"
greeting = "hello"
message = "hello world"`,
    explanation: 'String interning: identical short strings share memory.',
  },
  {
    name: 'Lists',
    code: `x = [1, 2, 3]
y = x
z = [1, 2, 3]`,
    explanation: 'y references same list as x. z is a NEW list with same values.',
  },
  {
    name: 'Mixed Types',
    code: `count = 10
pi = 3.14
name = "test"
items = [1, 2]`,
    explanation: 'Different types have different PyObject structures and sizes.',
  },
];

export const VariableMemory: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState(0);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>([]);
  const [showPyObject, setShowPyObject] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const generateAddress = (base: number) => 
    '0x' + (0x7fff00000000 + base * 32).toString(16);

  const runExample = useCallback(async () => {
    setAnimating(true);
    setVariables([]);
    setMemoryBlocks([]);
    setCurrentLine(-1);

    const example = EXAMPLES[selectedExample];
    const lines = example.code.trim().split('\n');
    const newVars: Variable[] = [];
    const newBlocks: MemoryBlock[] = [];
    let addrCounter = 0;

    // Pre-create some "cached" addresses for integers
    const intCache: Record<number, string> = {};
    const strCache: Record<string, string> = {};

    for (let i = 0; i < lines.length; i++) {
      setCurrentLine(i);
      await sleep(800);

      const line = lines[i].trim();
      const match = line.match(/(\w+)\s*=\s*(.+)/);
      if (!match) continue;

      const [, varName, rawValue] = match;
      let value = rawValue.trim();
      let type = 'unknown';
      let size = 28; // Base PyObject size
      let address: string;
      let isShared = false;

      // Determine type and handle caching
      if (value.startsWith('[')) {
        type = 'list';
        size = 56;
        // Check if it's a reference (y = x)
        const refMatch = value.match(/^(\w+)$/);
        if (refMatch && newVars.find(v => v.name === refMatch[1])) {
          const refVar = newVars.find(v => v.name === refMatch[1])!;
          address = refVar.address;
          isShared = true;
          // Update ref count
          const idx = newVars.findIndex(v => v.address === address);
          if (idx >= 0) newVars[idx].refCount++;
        } else {
          address = generateAddress(addrCounter++);
        }
      } else if (value.startsWith('"') || value.startsWith("'")) {
        type = 'str';
        const strVal = value.slice(1, -1);
        size = 49 + strVal.length;
        if (strCache[strVal]) {
          address = strCache[strVal];
          isShared = true;
          const idx = newVars.findIndex(v => v.address === address);
          if (idx >= 0) newVars[idx].refCount++;
        } else {
          address = generateAddress(addrCounter++);
          strCache[strVal] = address;
        }
      } else if (value.includes('.')) {
        type = 'float';
        size = 24;
        address = generateAddress(addrCounter++);
      } else if (!isNaN(parseInt(value))) {
        type = 'int';
        size = 28;
        const intVal = parseInt(value);
        if (intVal >= -5 && intVal <= 256 && intCache[intVal]) {
          address = intCache[intVal];
          isShared = true;
          const idx = newVars.findIndex(v => v.address === address);
          if (idx >= 0) newVars[idx].refCount++;
        } else {
          address = generateAddress(addrCounter++);
          if (intVal >= -5 && intVal <= 256) intCache[intVal] = address;
        }
      } else {
        // Reference to another variable
        const refVar = newVars.find(v => v.name === value);
        if (refVar) {
          address = refVar.address;
          isShared = true;
          refVar.refCount++;
          type = refVar.type;
          value = refVar.value;
          size = refVar.size;
        } else {
          address = generateAddress(addrCounter++);
        }
      }

      const newVar: Variable = {
        name: varName,
        type,
        value,
        address,
        size,
        refCount: isShared ? 0 : 1,
        pyObject: {
          typePtr: `<type '${type}'>`,
          refCount: isShared ? 2 : 1,
          value: value,
        },
      };

      if (!isShared) {
        newBlocks.push({
          address,
          content: `PyObject(${type}): ${value}`,
          label: varName,
          color: type === 'int' ? '#3b82f6' : 
                 type === 'str' ? '#22c55e' :
                 type === 'float' ? '#f97316' :
                 type === 'list' ? '#8b5cf6' : '#6b7280',
        });
      }

      newVars.push(newVar);
      setVariables([...newVars]);
      setMemoryBlocks([...newBlocks]);
    }

    setCurrentLine(-1);
    setAnimating(false);
  }, [selectedExample]);

  const example = EXAMPLES[selectedExample];
  const lines = example.code.trim().split('\n');

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Variable Memory Visualizer
        </h2>
        <p className="text-gray-600">
          See how Python variables are actually stored in memory. Variables are 
          references (pointers) to PyObjects on the heap.
        </p>
      </div>

      {/* Example selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {EXAMPLES.map((ex, idx) => (
          <button
            key={ex.name}
            onClick={() => { setSelectedExample(idx); setVariables([]); setMemoryBlocks([]); }}
            disabled={animating}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedExample === idx
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            } ${animating ? 'opacity-50' : ''}`}
          >
            {ex.name}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={runExample}
          disabled={animating}
          className={`px-6 py-2 rounded-lg font-medium ${
            animating
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {animating ? '⚙️ Running...' : '▶ Run Code'}
        </button>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showPyObject}
            onChange={(e) => setShowPyObject(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-600">Show PyObject details</span>
        </label>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Code panel */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-white font-bold mb-3">Python Code</h3>
          <div className="space-y-1">
            {lines.map((line, idx) => (
              <div
                key={idx}
                className={`font-mono text-sm px-2 py-1 rounded transition-all ${
                  currentLine === idx
                    ? 'bg-yellow-500 text-black'
                    : 'text-green-400'
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Variables panel */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-bold mb-3 text-gray-700">Variables (Stack)</h3>
          {variables.length === 0 ? (
            <p className="text-gray-400 text-sm">Run code to see variables</p>
          ) : (
            <div className="space-y-2">
              {variables.map((v, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-lg border-2 border-gray-200 transition-all hover:border-blue-300"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-blue-600">{v.name}</span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">{v.type}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 font-mono">
                    → {v.address}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Memory panel */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-bold mb-3 text-gray-700">Memory (Heap)</h3>
          {memoryBlocks.length === 0 ? (
            <p className="text-gray-400 text-sm">Run code to see memory</p>
          ) : (
            <div className="space-y-2">
              {memoryBlocks.map((block, idx) => (
                <div
                  key={idx}
                  className="rounded-lg p-3 text-white transition-all"
                  style={{ backgroundColor: block.color }}
                >
                  <div className="text-xs font-mono opacity-75">{block.address}</div>
                  <div className="font-bold">{block.content}</div>
                  {showPyObject && (
                    <div className="mt-2 text-xs bg-black/20 p-2 rounded">
                      <div>ob_refcnt: {variables.filter(v => v.address === block.address).length}</div>
                      <div>ob_type: {block.content.match(/\((\w+)\)/)?.[1]}</div>
                    </div>
                  )}
                  <div className="text-xs mt-1 opacity-75">
                    Referenced by: {variables.filter(v => v.address === block.address).map(v => v.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Explanation */}
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded mb-6">
        <h4 className="font-bold text-yellow-800">💡 Key Insight</h4>
        <p className="text-yellow-900">{example.explanation}</p>
      </div>

      {/* Concepts */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-bold text-blue-800 mb-2">📦 PyObject</h4>
          <p className="text-sm text-blue-700">
            Every Python value is a PyObject with: reference count, type pointer, 
            and the actual value. Even integers are objects!
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-bold text-green-800 mb-2">🔗 References</h4>
          <p className="text-sm text-green-700">
            Variables don't contain values - they're references (pointers) to 
            objects. Multiple variables can reference the same object.
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-bold text-purple-800 mb-2">♻️ Reference Counting</h4>
          <p className="text-sm text-purple-700">
            Python tracks how many references point to each object. When count 
            reaches 0, memory is freed (garbage collection).
          </p>
        </div>
      </div>
    </div>
  );
};

export default VariableMemory;
