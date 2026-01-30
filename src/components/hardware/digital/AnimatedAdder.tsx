// H3: Animated Adder
// Visualize binary addition with carry propagation

import React, { useState, useCallback, useRef } from 'react';

interface AdderState {
  step: number;
  carryBits: boolean[];
  sumBits: boolean[];
  currentBit: number;
  phase: 'idle' | 'adding' | 'carry' | 'done';
}

export const AnimatedAdder: React.FC = () => {
  const [numA, setNumA] = useState(5);
  const [numB, setNumB] = useState(3);
  const [state, setState] = useState<AdderState>({
    step: -1,
    carryBits: [false, false, false, false, false],
    sumBits: [false, false, false, false],
    currentBit: -1,
    phase: 'idle',
  });
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(800);

  const runningRef = useRef(false);

  const bitsA = [(numA >> 3) & 1, (numA >> 2) & 1, (numA >> 1) & 1, numA & 1].map(b => b === 1);
  const bitsB = [(numB >> 3) & 1, (numB >> 2) & 1, (numB >> 1) & 1, numB & 1].map(b => b === 1);
  const expectedSum = numA + numB;

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runAddition = useCallback(async () => {
    setIsRunning(true);
    runningRef.current = true;

    const carryBits = [false, false, false, false, false];
    const sumBits = [false, false, false, false];

    // Process each bit from right to left (LSB to MSB)
    for (let i = 3; i >= 0; i--) {
      if (!runningRef.current) break;

      const a = bitsA[i];
      const b = bitsB[i];
      const carryIn = carryBits[i + 1];

      // Show current bit being processed
      setState({
        step: 3 - i,
        carryBits: [...carryBits],
        sumBits: [...sumBits],
        currentBit: i,
        phase: 'adding',
      });
      await sleep(speed);

      // Calculate sum and carry
      const sum = (a ? 1 : 0) + (b ? 1 : 0) + (carryIn ? 1 : 0);
      sumBits[i] = sum % 2 === 1;
      carryBits[i] = sum >= 2;

      // Show carry propagation
      if (carryBits[i]) {
        setState({
          step: 3 - i,
          carryBits: [...carryBits],
          sumBits: [...sumBits],
          currentBit: i,
          phase: 'carry',
        });
        await sleep(speed);
      }

      setState({
        step: 3 - i,
        carryBits: [...carryBits],
        sumBits: [...sumBits],
        currentBit: i,
        phase: 'adding',
      });
      await sleep(speed / 2);
    }

    setState({
      step: 4,
      carryBits: [...carryBits],
      sumBits: [...sumBits],
      currentBit: -1,
      phase: 'done',
    });

    setIsRunning(false);
    runningRef.current = false;
  }, [numA, numB, speed, bitsA, bitsB]);

  const stop = () => { runningRef.current = false; setIsRunning(false); };
  
  const reset = () => {
    stop();
    setState({
      step: -1,
      carryBits: [false, false, false, false, false],
      sumBits: [false, false, false, false],
      currentBit: -1,
      phase: 'idle',
    });
  };

  const BitCell: React.FC<{ 
    value: boolean; 
    highlight?: boolean; 
    color?: string;
    label?: string;
  }> = ({ value, highlight, color = 'bg-gray-200', label }) => (
    <div className={`
      w-14 h-14 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-xl
      transition-all duration-300
      ${highlight ? 'scale-110 ring-4 ring-yellow-400' : ''}
      ${value ? color + ' text-white' : 'bg-gray-200 text-gray-500'}
    `}>
      {label && <span className="text-xs opacity-75">{label}</span>}
      {value ? '1' : '0'}
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Animated Binary Adder</h2>
        <p className="text-gray-600">
          Watch how computers add numbers bit by bit, with carry propagation just like decimal addition!
        </p>
      </div>

      {/* Number inputs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Number A (0-15)</label>
          <input
            type="range"
            min={0}
            max={15}
            value={numA}
            onChange={(e) => { setNumA(parseInt(e.target.value)); reset(); }}
            disabled={isRunning}
            className="w-full"
          />
          <div className="text-center font-bold text-2xl text-blue-600">{numA}</div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Number B (0-15)</label>
          <input
            type="range"
            min={0}
            max={15}
            value={numB}
            onChange={(e) => { setNumB(parseInt(e.target.value)); reset(); }}
            disabled={isRunning}
            className="w-full"
          />
          <div className="text-center font-bold text-2xl text-green-600">{numB}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={isRunning ? stop : runAddition}
          className={`px-6 py-2 rounded-lg font-medium text-white ${
            isRunning ? 'bg-red-500' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? '⏹ Stop' : '▶ Add'}
        </button>
        <button onClick={reset} className="px-4 py-2 bg-gray-200 rounded-lg">Reset</button>
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

      {/* Addition visualization */}
      <div className="bg-gray-900 rounded-xl p-6 mb-6">
        {/* Carry row */}
        <div className="flex justify-center gap-2 mb-2">
          <div className="w-14 text-gray-500 text-sm text-right">Carry:</div>
          {state.carryBits.slice(0, 4).map((bit, idx) => (
            <div
              key={idx}
              className={`w-14 h-8 rounded flex items-center justify-center font-mono text-sm transition-all ${
                bit ? 'bg-yellow-500 text-black font-bold' : 'bg-gray-700 text-gray-500'
              } ${state.currentBit === idx && state.phase === 'carry' ? 'animate-bounce' : ''}`}
            >
              {bit ? '1' : ''}
            </div>
          ))}
          <div className="w-14"></div>
        </div>

        {/* Number A */}
        <div className="flex justify-center gap-2 mb-2">
          <div className="w-14 text-blue-400 text-sm text-right">A:</div>
          {bitsA.map((bit, idx) => (
            <BitCell
              key={idx}
              value={bit}
              highlight={state.currentBit === idx}
              color="bg-blue-500"
            />
          ))}
          <div className="w-14 flex items-center justify-center text-blue-400 font-bold">
            = {numA}
          </div>
        </div>

        {/* Number B */}
        <div className="flex justify-center gap-2 mb-2">
          <div className="w-14 text-green-400 text-sm text-right">B:</div>
          {bitsB.map((bit, idx) => (
            <BitCell
              key={idx}
              value={bit}
              highlight={state.currentBit === idx}
              color="bg-green-500"
            />
          ))}
          <div className="w-14 flex items-center justify-center text-green-400 font-bold">
            = {numB}
          </div>
        </div>

        {/* Separator */}
        <div className="flex justify-center gap-2 mb-2">
          <div className="w-14 text-white text-right">+</div>
          <div className="w-[248px] border-b-2 border-white"></div>
          <div className="w-14"></div>
        </div>

        {/* Sum */}
        <div className="flex justify-center gap-2">
          <div className="w-14 text-purple-400 text-sm text-right">Sum:</div>
          {state.carryBits[0] && state.phase === 'done' && (
            <BitCell value={true} color="bg-purple-500" />
          )}
          {state.sumBits.map((bit, idx) => (
            <BitCell
              key={idx}
              value={state.phase !== 'idle' && state.step >= 3 - idx ? bit : false}
              highlight={state.currentBit === idx && state.phase === 'adding'}
              color="bg-purple-500"
            />
          ))}
          {!state.carryBits[0] && <div className="w-14"></div>}
          <div className="w-14 flex items-center justify-center text-purple-400 font-bold">
            {state.phase === 'done' ? `= ${expectedSum}` : ''}
          </div>
        </div>
      </div>

      {/* Step explanation */}
      {state.phase !== 'idle' && (
        <div className={`p-4 rounded-lg mb-6 ${
          state.phase === 'done' ? 'bg-green-100' :
          state.phase === 'carry' ? 'bg-yellow-100' : 'bg-blue-100'
        }`}>
          <h4 className="font-bold mb-1">
            {state.phase === 'done' && '✓ Addition Complete!'}
            {state.phase === 'adding' && `Step ${state.step + 1}: Adding bit ${3 - state.currentBit}`}
            {state.phase === 'carry' && `Carry! Sum ≥ 2, carry 1 to next position`}
          </h4>
          {state.currentBit >= 0 && state.phase !== 'done' && (
            <p className="text-sm">
              {bitsA[state.currentBit] ? '1' : '0'} + {bitsB[state.currentBit] ? '1' : '0'}
              {state.carryBits[state.currentBit + 1] ? ' + 1 (carry)' : ''}
              {' = '}
              {(bitsA[state.currentBit] ? 1 : 0) + (bitsB[state.currentBit] ? 1 : 0) + (state.carryBits[state.currentBit + 1] ? 1 : 0)}
            </p>
          )}
          {state.phase === 'done' && (
            <p>{numA} + {numB} = {expectedSum}</p>
          )}
        </div>
      )}

      {/* How it works */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-bold text-blue-800 text-sm mb-1">1. Half Adder</h4>
          <p className="text-xs text-blue-700">XOR gives sum bit, AND gives carry</p>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg">
          <h4 className="font-bold text-yellow-800 text-sm mb-1">2. Full Adder</h4>
          <p className="text-xs text-yellow-700">Adds two bits PLUS carry from previous</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <h4 className="font-bold text-purple-800 text-sm mb-1">3. Ripple Carry</h4>
          <p className="text-xs text-purple-700">Carry "ripples" through each bit position</p>
        </div>
      </div>

      {/* Key insight */}
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <h4 className="font-bold text-yellow-800">💡 Key Insight</h4>
        <p className="text-yellow-900">
          Binary addition is just like decimal addition you learned in school!
          When the sum is ≥ 2 (like ≥ 10 in decimal), you write 0 and carry 1.
          This is why it's called a "ripple carry adder" - carries ripple through.
        </p>
      </div>
    </div>
  );
};

export default AnimatedAdder;
