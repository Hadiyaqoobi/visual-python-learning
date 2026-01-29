// H14: Python → Machine Code Transformer
// Multi-stage transformation: Python → AST → Bytecode → Machine Code

import React, { useState, useEffect, useCallback } from 'react';

interface TransformStage {
  name: string;
  shortName: string;
  color: string;
  description: string;
}

const STAGES: TransformStage[] = [
  { name: 'Python Source', shortName: 'Python', color: '#3b82f6', description: 'Human-readable code you write' },
  { name: 'Abstract Syntax Tree', shortName: 'AST', color: '#8b5cf6', description: 'Tree structure of code meaning' },
  { name: 'Python Bytecode', shortName: 'Bytecode', color: '#f97316', description: 'Portable intermediate code' },
  { name: 'Machine Code', shortName: 'Machine', color: '#ef4444', description: 'CPU-executable binary instructions' },
];

interface CodeExample {
  name: string;
  python: string;
  ast: string;
  bytecode: string;
  machine: string;
  explanation: string;
}

const CODE_EXAMPLES: CodeExample[] = [
  {
    name: 'Simple Addition',
    python: `x = 5 + 3`,
    ast: `Module
└── Assign
    ├── targets: [Name 'x']
    └── value: BinOp
        ├── left: Constant(5)
        ├── op: Add
        └── right: Constant(3)`,
    bytecode: `  0 LOAD_CONST    0 (5)
  2 LOAD_CONST    1 (3)
  4 BINARY_ADD
  6 STORE_NAME    0 (x)
  8 RETURN_VALUE`,
    machine: `mov  eax, 5      ; Load 5 into EAX
mov  ebx, 3      ; Load 3 into EBX
add  eax, ebx    ; EAX = EAX + EBX
mov  [x], eax    ; Store result`,
    explanation: 'Addition becomes: load values → add → store result'
  },
  {
    name: 'Function Call',
    python: `def greet(name):
    return "Hello " + name

greet("World")`,
    ast: `Module
├── FunctionDef 'greet'
│   ├── args: [arg 'name']
│   └── body: Return
│       └── BinOp
│           ├── left: Constant("Hello ")
│           ├── op: Add
│           └── right: Name 'name'
└── Expr
    └── Call
        ├── func: Name 'greet'
        └── args: [Constant("World")]`,
    bytecode: `  # Function definition
  0 LOAD_CONST    1 ("Hello ")
  2 LOAD_FAST     0 (name)
  4 BINARY_ADD
  6 RETURN_VALUE

  # Function call
  8 LOAD_NAME     0 (greet)
 10 LOAD_CONST    2 ("World")
 12 CALL_FUNCTION 1
 14 POP_TOP`,
    machine: `; Function prologue
push ebp
mov  ebp, esp
; String concatenation
lea  eax, [hello_str]
push eax
push [ebp+8]      ; name param
call strcat
; Return
mov  esp, ebp
pop  ebp
ret`,
    explanation: 'Functions become: setup stack → execute body → cleanup → return'
  },
  {
    name: 'Loop',
    python: `total = 0
for i in range(3):
    total += i`,
    ast: `Module
├── Assign
│   ├── targets: [Name 'total']
│   └── value: Constant(0)
└── For
    ├── target: Name 'i'
    ├── iter: Call range(3)
    └── body: AugAssign
        ├── target: Name 'total'
        ├── op: Add
        └── value: Name 'i'`,
    bytecode: `  0 LOAD_CONST    0 (0)
  2 STORE_NAME    0 (total)
  4 LOAD_NAME     1 (range)
  6 LOAD_CONST    1 (3)
  8 CALL_FUNCTION 1
 10 GET_ITER
 12 FOR_ITER      6 (to 20)
 14 STORE_NAME    2 (i)
 16 LOAD_NAME     0 (total)
 18 LOAD_NAME     2 (i)
 20 INPLACE_ADD
 22 STORE_NAME    0 (total)
 24 JUMP_ABSOLUTE 12
 26 RETURN_VALUE`,
    machine: `    mov  [total], 0   ; total = 0
    mov  ecx, 0       ; i = 0
loop:
    cmp  ecx, 3       ; i < 3?
    jge  end          ; if not, exit
    add  [total], ecx ; total += i
    inc  ecx          ; i++
    jmp  loop         ; repeat
end:`,
    explanation: 'Loops become: initialize → compare → body → increment → jump back'
  },
  {
    name: 'Conditional',
    python: `x = 10
if x > 5:
    result = "big"
else:
    result = "small"`,
    ast: `Module
├── Assign (x = 10)
└── If
    ├── test: Compare
    │   ├── left: Name 'x'
    │   ├── ops: [Gt]
    │   └── comparators: [Constant(5)]
    ├── body: Assign (result = "big")
    └── orelse: Assign (result = "small")`,
    bytecode: `  0 LOAD_CONST    0 (10)
  2 STORE_NAME    0 (x)
  4 LOAD_NAME     0 (x)
  6 LOAD_CONST    1 (5)
  8 COMPARE_OP    4 (>)
 10 POP_JUMP_IF_FALSE 18
 12 LOAD_CONST    2 ("big")
 14 STORE_NAME    1 (result)
 16 JUMP_FORWARD  4 (to 22)
 18 LOAD_CONST    3 ("small")
 20 STORE_NAME    1 (result)
 22 RETURN_VALUE`,
    machine: `    mov  eax, 10      ; x = 10
    cmp  eax, 5       ; x > 5?
    jle  else_branch  ; if not, jump
    mov  [result], "big"
    jmp  end
else_branch:
    mov  [result], "small"
end:`,
    explanation: 'Conditionals become: compare → conditional jump → branches'
  },
];

export const CodeTransformer: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [highlightLine, setHighlightLine] = useState<number>(-1);

  const example = CODE_EXAMPLES[selectedExample];

  const getStageContent = (stage: number): string => {
    switch (stage) {
      case 0: return example.python;
      case 1: return example.ast;
      case 2: return example.bytecode;
      case 3: return example.machine;
      default: return '';
    }
  };

  const animateTransition = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Animate line by line highlight
    const lines = getStageContent(currentStage).split('\n');
    for (let i = 0; i < lines.length; i++) {
      setHighlightLine(i);
      await new Promise(r => setTimeout(r, 100));
    }
    setHighlightLine(-1);
    
    // Move to next stage
    await new Promise(r => setTimeout(r, 300));
    setCurrentStage(prev => (prev + 1) % 4);
    setIsAnimating(false);
  }, [currentStage, isAnimating, example]);

  useEffect(() => {
    if (autoPlay && !isAnimating) {
      const timer = setTimeout(animateTransition, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, isAnimating, currentStage, animateTransition]);

  const renderCodeWithHighlight = (code: string) => {
    const lines = code.split('\n');
    return lines.map((line, idx) => (
      <div
        key={idx}
        className={`font-mono text-sm transition-all duration-150 ${
          highlightLine === idx ? 'bg-yellow-200 -mx-2 px-2' : ''
        }`}
      >
        {line || ' '}
      </div>
    ));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Python → Machine Code Transformer
        </h2>
        <p className="text-gray-600">
          Watch how Python code transforms through multiple stages to become 
          machine-executable instructions. Each stage brings it closer to the CPU.
        </p>
      </div>

      {/* Example selector */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">Select Example:</div>
        <div className="flex flex-wrap gap-2">
          {CODE_EXAMPLES.map((ex, idx) => (
            <button
              key={ex.name}
              onClick={() => { setSelectedExample(idx); setCurrentStage(0); }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedExample === idx
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {ex.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stage indicators */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {STAGES.map((stage, idx) => (
            <React.Fragment key={stage.name}>
              <button
                onClick={() => setCurrentStage(idx)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                  currentStage === idx
                    ? 'scale-110 shadow-lg'
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: currentStage === idx ? stage.color : '#f3f4f6',
                  color: currentStage === idx ? 'white' : '#374151'
                }}
              >
                <span className="font-bold">{stage.shortName}</span>
                <span className="text-xs mt-1 max-w-[100px] text-center">
                  {stage.description}
                </span>
              </button>
              {idx < STAGES.length - 1 && (
                <div className={`flex-1 h-2 mx-2 rounded transition-all ${
                  idx < currentStage ? 'bg-green-400' : 'bg-gray-200'
                }`}>
                  <div
                    className="h-full bg-green-500 rounded transition-all duration-500"
                    style={{ width: idx < currentStage ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setCurrentStage(prev => Math.max(0, prev - 1))}
          disabled={currentStage === 0 || isAnimating}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          ← Previous
        </button>
        <button
          onClick={animateTransition}
          disabled={isAnimating}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isAnimating ? 'Transforming...' : 'Transform →'}
        </button>
        <button
          onClick={() => setCurrentStage(prev => Math.min(3, prev + 1))}
          disabled={currentStage === 3 || isAnimating}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Next →
        </button>
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className={`px-4 py-2 rounded-lg ${
            autoPlay ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {autoPlay ? '⏹ Stop' : '▶ Auto Play'}
        </button>
      </div>

      {/* Code display */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Current stage */}
        <div
          className="rounded-lg p-4 border-2"
          style={{ borderColor: STAGES[currentStage].color }}
        >
          <h3
            className="font-bold mb-3 text-lg"
            style={{ color: STAGES[currentStage].color }}
          >
            {STAGES[currentStage].name}
          </h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-80">
            {renderCodeWithHighlight(getStageContent(currentStage))}
          </div>
        </div>

        {/* Next stage preview */}
        <div
          className="rounded-lg p-4 border-2 opacity-60"
          style={{ borderColor: STAGES[(currentStage + 1) % 4].color }}
        >
          <h3
            className="font-bold mb-3 text-lg"
            style={{ color: STAGES[(currentStage + 1) % 4].color }}
          >
            {STAGES[(currentStage + 1) % 4].name} (Next)
          </h3>
          <div className="bg-gray-800 text-gray-400 p-4 rounded-lg overflow-auto max-h-80">
            <pre className="font-mono text-sm whitespace-pre-wrap">
              {getStageContent((currentStage + 1) % 4)}
            </pre>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <h4 className="font-bold text-blue-800 mb-2">💡 What's Happening?</h4>
        <p className="text-blue-700">{example.explanation}</p>
      </div>

      {/* Stage explanations */}
      <div className="grid grid-cols-4 gap-4">
        {STAGES.map((stage, idx) => (
          <div
            key={stage.name}
            className={`p-3 rounded-lg transition-all ${
              currentStage === idx ? 'ring-2 ring-offset-2' : ''
            }`}
            style={{
              backgroundColor: `${stage.color}15`,
              ringColor: stage.color
            }}
          >
            <h5 className="font-bold text-sm mb-1" style={{ color: stage.color }}>
              Stage {idx + 1}: {stage.shortName}
            </h5>
            <p className="text-xs text-gray-600">
              {idx === 0 && 'What you write - readable by humans, uses English keywords.'}
              {idx === 1 && 'Parsed tree structure showing how Python understands your code.'}
              {idx === 2 && 'Platform-independent instructions for Python Virtual Machine.'}
              {idx === 3 && 'CPU-specific binary instructions executed by hardware.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeTransformer;
