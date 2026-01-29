// H12: RAM Explorer - Address-Based Access

import React, { useState, useCallback } from 'react';

const RAM_ROWS = 8;
const RAM_COLS = 8;
const TOTAL_CELLS = RAM_ROWS * RAM_COLS;

type ViewMode = 'decimal' | 'hex' | 'binary' | 'ascii';

interface MemoryCell {
  address: number;
  value: number;
  lastAccessed: number;
}

export const RAMExplorer: React.FC = () => {
  const [memory, setMemory] = useState<MemoryCell[]>(() =>
    Array(TOTAL_CELLS).fill(null).map((_, i) => ({
      address: i,
      value: Math.floor(Math.random() * 256),
      lastAccessed: 0
    }))
  );
  
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('decimal');
  const [addressInput, setAddressInput] = useState<string>('');
  const [accessCount, setAccessCount] = useState(0);

  const formatValue = useCallback((value: number, mode: ViewMode): string => {
    switch (mode) {
      case 'hex':
        return '0x' + value.toString(16).toUpperCase().padStart(2, '0');
      case 'binary':
        return value.toString(2).padStart(8, '0');
      case 'ascii':
        return value >= 32 && value <= 126 ? String.fromCharCode(value) : '·';
      default:
        return value.toString();
    }
  }, []);

  const handleCellClick = (address: number) => {
    setSelectedAddress(address);
    setEditValue(memory[address].value.toString());
    setAccessCount(prev => prev + 1);
    
    setMemory(prev => prev.map((cell, i) => ({
      ...cell,
      lastAccessed: i === address ? accessCount + 1 : cell.lastAccessed
    })));
  };

  const handleAddressJump = (e: React.FormEvent) => {
    e.preventDefault();
    const address = parseInt(addressInput);
    if (!isNaN(address) && address >= 0 && address < TOTAL_CELLS) {
      handleCellClick(address);
      setAddressInput('');
    }
  };

  const handleValueSubmit = () => {
    if (selectedAddress === null) return;
    let numValue = parseInt(editValue);
    if (isNaN(numValue)) numValue = 0;
    numValue = Math.max(0, Math.min(255, numValue));
    
    setMemory(prev => prev.map((cell, i) => 
      i === selectedAddress ? { ...cell, value: numValue } : cell
    ));
  };

  const fillPattern = (pattern: 'zeros' | 'sequential' | 'random') => {
    setMemory(prev => prev.map((cell, i) => ({
      ...cell,
      value: pattern === 'zeros' ? 0 :
             pattern === 'sequential' ? i :
             Math.floor(Math.random() * 256)
    })));
  };

  const getAddressBreakdown = (address: number) => ({
    row: Math.floor(address / RAM_COLS),
    col: address % RAM_COLS,
    binary: address.toString(2).padStart(6, '0')
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">RAM Explorer</h2>
        <p className="text-gray-600">
          Explore how RAM works as addressable storage. Each cell has a unique address 
          and stores one byte (0-255). Click cells to read/write values.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Address jump */}
        <form onSubmit={handleAddressJump} className="flex gap-2">
          <input
            type="number"
            min={0}
            max={TOTAL_CELLS - 1}
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder={`Address (0-${TOTAL_CELLS - 1})`}
            className="px-3 py-2 border rounded-lg w-40"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Go To
          </button>
        </form>

        {/* View mode */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">View:</span>
          {(['decimal', 'hex', 'binary', 'ascii'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                viewMode === mode ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Fill patterns */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Fill:</span>
          {(['zeros', 'sequential', 'random'] as const).map(pattern => (
            <button
              key={pattern}
              onClick={() => fillPattern(pattern)}
              className="px-3 py-1 rounded text-sm bg-gray-100 hover:bg-gray-200"
            >
              {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Memory grid */}
      <div className="mb-6 overflow-x-auto">
        {/* Column headers */}
        <div className="flex mb-1">
          <div className="w-12"></div>
          {Array(RAM_COLS).fill(0).map((_, col) => (
            <div key={col} className="w-16 text-center text-xs text-gray-500 font-mono">+{col}</div>
          ))}
        </div>

        {/* Memory rows */}
        {Array(RAM_ROWS).fill(0).map((_, row) => (
          <div key={row} className="flex items-center">
            <div className="w-12 text-right pr-2 text-xs text-gray-500 font-mono">
              {(row * RAM_COLS).toString(16).toUpperCase().padStart(2, '0')}:
            </div>
            {Array(RAM_COLS).fill(0).map((_, col) => {
              const address = row * RAM_COLS + col;
              const cell = memory[address];
              const isSelected = selectedAddress === address;
              
              return (
                <div
                  key={col}
                  onClick={() => handleCellClick(address)}
                  className={`w-16 h-12 flex items-center justify-center border cursor-pointer 
                    transition-all duration-200 font-mono text-sm
                    ${isSelected 
                      ? 'bg-blue-500 text-white border-blue-600 scale-110 z-10 shadow-lg' 
                      : 'bg-gray-50 hover:bg-blue-100 border-gray-200'}
                    ${cell.lastAccessed === accessCount && accessCount > 0 && !isSelected ? 'bg-yellow-100' : ''}`}
                  title={`Address: ${address} (0x${address.toString(16).toUpperCase()})`}
                >
                  {formatValue(cell.value, viewMode)}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Selected cell details */}
      {selectedAddress !== null && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-3">Selected: Address {selectedAddress}</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <span className="text-sm text-blue-600">Address (decimal)</span>
              <div className="font-mono font-bold">{selectedAddress}</div>
            </div>
            <div>
              <span className="text-sm text-blue-600">Address (hex)</span>
              <div className="font-mono font-bold">0x{selectedAddress.toString(16).toUpperCase().padStart(2, '0')}</div>
            </div>
            <div>
              <span className="text-sm text-blue-600">Address (binary)</span>
              <div className="font-mono font-bold text-xs">{getAddressBreakdown(selectedAddress).binary}</div>
            </div>
            <div>
              <span className="text-sm text-blue-600">Row, Column</span>
              <div className="font-mono font-bold">[{getAddressBreakdown(selectedAddress).row}, {getAddressBreakdown(selectedAddress).col}]</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <span className="text-sm text-blue-600">Value (decimal)</span>
              <div className="font-mono font-bold">{memory[selectedAddress].value}</div>
            </div>
            <div>
              <span className="text-sm text-blue-600">Value (hex)</span>
              <div className="font-mono font-bold">0x{memory[selectedAddress].value.toString(16).toUpperCase().padStart(2, '0')}</div>
            </div>
            <div>
              <span className="text-sm text-blue-600">Value (binary)</span>
              <div className="font-mono font-bold">{memory[selectedAddress].value.toString(2).padStart(8, '0')}</div>
            </div>
            <div>
              <span className="text-sm text-blue-600">Value (ASCII)</span>
              <div className="font-mono font-bold text-xl">{formatValue(memory[selectedAddress].value, 'ascii')}</div>
            </div>
          </div>

          {/* Edit value */}
          <div className="flex items-center gap-4">
            <label className="text-sm text-blue-600">Write new value:</label>
            <input
              type="number"
              min={0}
              max={255}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleValueSubmit()}
              className="px-3 py-2 border rounded w-24 font-mono"
            />
            <button onClick={handleValueSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Write
            </button>
            <span className="text-sm text-gray-500">(0-255)</span>
          </div>
        </div>
      )}

      {/* Address calculation */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold text-gray-700 mb-2">📐 Address Calculation</h3>
        <p className="text-gray-600 mb-2">
          In this {RAM_ROWS}×{RAM_COLS} grid, each address maps to a row and column:
        </p>
        <div className="font-mono bg-white p-3 rounded border text-sm">
          <div>address = row × {RAM_COLS} + column</div>
          <div className="text-gray-500 mt-1">Example: Address 19 = row 2 × 8 + column 3 = 16 + 3 = 19</div>
        </div>
      </div>

      {/* Key concepts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-bold text-green-800 mb-2">🎯 Random Access</h4>
          <p className="text-sm text-green-700">
            Any address can be accessed directly in the same time - no need to read sequentially. 
            That's why it's called Random Access Memory!
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-bold text-purple-800 mb-2">📊 One Byte Per Cell</h4>
          <p className="text-sm text-purple-700">
            Each address holds one byte (8 bits), storing values 0-255. 
            Larger data spans multiple consecutive addresses.
          </p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <h4 className="font-bold text-orange-800 mb-2">⚡ Volatile Storage</h4>
          <p className="text-sm text-orange-700">
            RAM loses all data when power is off. That's why you save files to disk - 
            it's permanent (non-volatile) storage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RAMExplorer;
