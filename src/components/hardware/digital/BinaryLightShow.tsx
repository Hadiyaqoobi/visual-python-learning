// H1: Binary Light Show
// Interactive 8-bit LED toggle to understand binary representation

import React, { useState } from 'react';

const BIT_POSITIONS = [128, 64, 32, 16, 8, 4, 2, 1];

export const BinaryLightShow: React.FC = () => {
  const [bits, setBits] = useState<boolean[]>([false, false, false, false, false, false, false, false]);
  const [showHints, setShowHints] = useState(true);

  const toggleBit = (index: number) => {
    setBits(prev => {
      const newBits = [...prev];
      newBits[index] = !newBits[index];
      return newBits;
    });
  };

  const decimalValue = bits.reduce((sum, bit, idx) => sum + (bit ? BIT_POSITIONS[idx] : 0), 0);
  const binaryString = bits.map(b => b ? '1' : '0').join('');
  const hexValue = decimalValue.toString(16).toUpperCase().padStart(2, '0');

  const setPreset = (value: number) => {
    const newBits = BIT_POSITIONS.map(pos => (value & pos) !== 0);
    setBits(newBits);
  };

  const challenges = [
    { label: 'Make 42', target: 42 },
    { label: 'Make 255', target: 255 },
    { label: 'Make 100', target: 100 },
    { label: 'Make 7', target: 7 },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Binary Light Show</h2>
        <p className="text-gray-600">
          Click the LEDs to toggle bits ON (1) and OFF (0). Watch how binary converts to decimal!
        </p>
      </div>

      {/* Main LED display */}
      <div className="bg-gray-900 rounded-xl p-8 mb-6">
        {/* Bit position labels */}
        {showHints && (
          <div className="flex justify-center gap-4 mb-2">
            {BIT_POSITIONS.map((pos, idx) => (
              <div key={idx} className="w-16 text-center text-gray-500 text-xs font-mono">
                2^{7-idx} = {pos}
              </div>
            ))}
          </div>
        )}

        {/* LED buttons */}
        <div className="flex justify-center gap-4 mb-4">
          {bits.map((bit, idx) => (
            <button
              key={idx}
              onClick={() => toggleBit(idx)}
              className={`w-16 h-16 rounded-full transition-all duration-200 transform hover:scale-110 
                ${bit 
                  ? 'bg-green-400 shadow-[0_0_30px_rgba(74,222,128,0.8)]' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }`}
              style={{
                boxShadow: bit ? '0 0 30px rgba(74,222,128,0.8), inset 0 -4px 8px rgba(0,0,0,0.3)' : 'inset 0 4px 8px rgba(0,0,0,0.5)'
              }}
            >
              <span className={`text-2xl font-bold ${bit ? 'text-green-900' : 'text-gray-500'}`}>
                {bit ? '1' : '0'}
              </span>
            </button>
          ))}
        </div>

        {/* Bit index labels */}
        <div className="flex justify-center gap-4">
          {bits.map((_, idx) => (
            <div key={idx} className="w-16 text-center text-gray-600 text-xs">
              bit {7-idx}
            </div>
          ))}
        </div>
      </div>

      {/* Value displays */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-sm text-blue-600 mb-1">Binary</div>
          <div className="text-2xl font-mono font-bold text-blue-800">{binaryString}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-sm text-green-600 mb-1">Decimal</div>
          <div className="text-4xl font-bold text-green-800">{decimalValue}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-sm text-purple-600 mb-1">Hexadecimal</div>
          <div className="text-2xl font-mono font-bold text-purple-800">0x{hexValue}</div>
        </div>
      </div>

      {/* Calculation breakdown */}
      {showHints && decimalValue > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600 mb-2">How it adds up:</div>
          <div className="font-mono text-lg">
            {bits.map((bit, idx) => bit ? BIT_POSITIONS[idx] : null).filter(v => v !== null).join(' + ')} = {decimalValue}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setBits([false, false, false, false, false, false, false, false])}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
          Clear All
        </button>
        <button onClick={() => setBits([true, true, true, true, true, true, true, true])}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
          All On (255)
        </button>
        <button onClick={() => setShowHints(!showHints)}
          className={`px-4 py-2 rounded-lg ${showHints ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          {showHints ? 'Hide Hints' : 'Show Hints'}
        </button>
      </div>

      {/* Presets */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">Quick presets:</div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 4, 8, 16, 32, 64, 128, 42, 85, 170, 255].map(val => (
            <button key={val} onClick={() => setPreset(val)}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 font-mono text-sm">
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <h3 className="font-bold text-yellow-800 mb-2">🎯 Challenges</h3>
        <div className="flex flex-wrap gap-2">
          {challenges.map(ch => (
            <div key={ch.target} 
              className={`px-3 py-2 rounded-lg ${
                decimalValue === ch.target 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white border border-yellow-300'
              }`}>
              {ch.label} {decimalValue === ch.target && '✓'}
            </div>
          ))}
        </div>
      </div>

      {/* Key insight */}
      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <h4 className="font-bold text-blue-800">💡 Key Insight</h4>
        <p className="text-blue-900">
          Each bit position represents a power of 2. This is why computers use binary - 
          electronic circuits easily represent two states: ON (voltage) = 1, OFF (no voltage) = 0.
        </p>
      </div>
    </div>
  );
};

export default BinaryLightShow;
