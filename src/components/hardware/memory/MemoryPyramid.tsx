// H10: Memory Pyramid - 3D Interactive Visualization

import React, { useState, useRef, useEffect } from 'react';

interface MemoryLevel {
  name: string;
  size: string;
  speed: string;
  latency: string;
  color: string;
  width: number;
  description: string;
  examples: string[];
}

const MEMORY_LEVELS: MemoryLevel[] = [
  {
    name: 'CPU Registers',
    size: '~1 KB',
    speed: '< 1 ns',
    latency: '0 cycles',
    color: '#ef4444',
    width: 80,
    description: 'Fastest storage, directly in CPU. Holds currently executing data.',
    examples: ['RAX, RBX (general)', 'RIP (instruction pointer)', 'RSP (stack pointer)']
  },
  {
    name: 'L1 Cache',
    size: '32-64 KB',
    speed: '~1 ns',
    latency: '~4 cycles',
    color: '#f97316',
    width: 140,
    description: 'Per-core cache, split into instruction and data caches.',
    examples: ['32KB L1d (data)', '32KB L1i (instructions)', 'Per-core, private']
  },
  {
    name: 'L2 Cache',
    size: '256 KB - 1 MB',
    speed: '~3-10 ns',
    latency: '~10 cycles',
    color: '#eab308',
    width: 200,
    description: 'Larger per-core cache, unified instructions and data.',
    examples: ['256KB-1MB per core', 'Unified cache', '8-way associative']
  },
  {
    name: 'L3 Cache',
    size: '8-64 MB',
    speed: '~10-20 ns',
    latency: '~40 cycles',
    color: '#22c55e',
    width: 260,
    description: 'Shared cache across all cores. Last level before RAM.',
    examples: ['Shared by all cores', '8-64MB typical', '16-way associative']
  },
  {
    name: 'Main Memory (RAM)',
    size: '8-128 GB',
    speed: '~50-100 ns',
    latency: '~200 cycles',
    color: '#3b82f6',
    width: 320,
    description: 'Dynamic RAM, volatile. Primary working memory for programs.',
    examples: ['DDR4/DDR5 SDRAM', '3200-6400 MT/s', 'Dual/Quad channel']
  },
  {
    name: 'SSD Storage',
    size: '256 GB - 4 TB',
    speed: '~10-100 μs',
    latency: '~10,000 cycles',
    color: '#8b5cf6',
    width: 380,
    description: 'Non-volatile flash storage. Fast persistent storage.',
    examples: ['NVMe PCIe 4.0/5.0', '7000 MB/s read', '1M+ IOPS']
  },
  {
    name: 'HDD / Network',
    size: '1 TB - ∞',
    speed: '~1-10 ms',
    latency: '~1M+ cycles',
    color: '#6b7280',
    width: 440,
    description: 'Magnetic disks or network storage. Slowest but largest.',
    examples: ['7200 RPM HDD', 'Cloud storage', 'Network drives']
  }
];

export const MemoryPyramid: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'pyramid' | 'comparison' | 'journey'>('pyramid');
  const [dataJourney, setDataJourney] = useState<{
    active: boolean;
    currentLevel: number;
    found: boolean;
  }>({ active: false, currentLevel: -1, found: false });
  
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const startDataJourney = (targetLevel: number) => {
    setDataJourney({ active: true, currentLevel: 0, found: false });
    let level = 0;
    const animate = () => {
      if (level <= targetLevel) {
        setDataJourney({ active: true, currentLevel: level, found: level === targetLevel });
        level++;
        animationRef.current = setTimeout(animate, 800);
      } else {
        setTimeout(() => setDataJourney({ active: false, currentLevel: -1, found: false }), 1500);
      }
    };
    animate();
  };

  useEffect(() => {
    return () => { if (animationRef.current) clearTimeout(animationRef.current); };
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Memory Hierarchy Pyramid</h2>
        <p className="text-gray-600">
          Computer memory is organized in a hierarchy: faster, smaller, expensive memory at the top;
          slower, larger, cheaper memory at the bottom.
        </p>
      </div>

      {/* View mode tabs */}
      <div className="flex gap-2 mb-6">
        {(['pyramid', 'comparison', 'journey'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === mode ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)} View
          </button>
        ))}
      </div>

      {/* Pyramid View */}
      {viewMode === 'pyramid' && (
        <div className="flex flex-col items-center space-y-1 mb-6">
          {MEMORY_LEVELS.map((level, index) => {
            const isSelected = selectedLevel === index;
            const isJourneyActive = dataJourney.active && dataJourney.currentLevel === index;
            const isJourneyFound = dataJourney.found && dataJourney.currentLevel === index;
            
            return (
              <div
                key={level.name}
                className={`relative cursor-pointer transition-all duration-300 rounded-lg flex items-center justify-center text-white font-semibold
                  ${isSelected ? 'ring-4 ring-white shadow-2xl scale-105 z-10' : 'hover:scale-102'}
                  ${isJourneyActive ? 'animate-pulse ring-4 ring-yellow-400' : ''}
                  ${isJourneyFound ? 'ring-4 ring-green-400 animate-bounce' : ''}`}
                style={{
                  width: level.width,
                  height: 50,
                  backgroundColor: level.color,
                  clipPath: 'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)'
                }}
                onClick={() => setSelectedLevel(isSelected ? null : index)}
              >
                <span className="text-sm drop-shadow-md">{level.name}</span>
                <div className="absolute -right-24 text-xs text-gray-600 whitespace-nowrap">{level.speed}</div>
                <div className="absolute -left-20 text-xs text-gray-600 whitespace-nowrap">{level.size}</div>
              </div>
            );
          })}
          <div className="flex justify-between w-full mt-4 text-sm text-gray-500">
            <div className="flex flex-col items-center"><span className="font-bold">← SMALLER</span><span>Size</span></div>
            <div className="flex flex-col items-center"><span className="font-bold">FASTER →</span><span>Speed</span></div>
          </div>
        </div>
      )}

      {/* Comparison View */}
      {viewMode === 'comparison' && (
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Level</th>
                <th className="p-3 text-left">Size</th>
                <th className="p-3 text-left">Latency</th>
                <th className="p-3 text-left">Cycles</th>
                <th className="p-3 text-left">Relative Speed</th>
              </tr>
            </thead>
            <tbody>
              {MEMORY_LEVELS.map((level, index) => (
                <tr key={level.name} className={`border-b hover:bg-gray-50 cursor-pointer ${selectedLevel === index ? 'bg-blue-50' : ''}`} onClick={() => setSelectedLevel(index)}>
                  <td className="p-3"><div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{ backgroundColor: level.color }} />{level.name}</div></td>
                  <td className="p-3 font-mono">{level.size}</td>
                  <td className="p-3 font-mono">{level.speed}</td>
                  <td className="p-3 font-mono">{level.latency}</td>
                  <td className="p-3">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className="h-4 rounded-full" style={{ width: `${Math.max(5, 100 - index * 14)}%`, backgroundColor: level.color }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Journey View */}
      {viewMode === 'journey' && (
        <div className="space-y-4 mb-6">
          <p className="text-gray-600">Click a memory level to simulate data access through the hierarchy!</p>
          <div className="flex flex-wrap gap-2">
            {MEMORY_LEVELS.map((level, index) => (
              <button key={level.name} onClick={() => startDataJourney(index)} disabled={dataJourney.active}
                className={`px-4 py-2 rounded-lg text-white font-medium ${dataJourney.active ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                style={{ backgroundColor: level.color }}>
                Find in {level.name.split(' ')[0]}
              </button>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">CPU</div>
              <span className="text-gray-500">→ searching for data...</span>
            </div>
            <div className="flex items-center gap-1">
              {MEMORY_LEVELS.map((level, index) => {
                const isChecking = dataJourney.active && dataJourney.currentLevel === index;
                const isFound = dataJourney.found && dataJourney.currentLevel === index;
                const wasChecked = dataJourney.active && index < dataJourney.currentLevel;
                return (
                  <React.Fragment key={level.name}>
                    <div className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center text-xs text-white font-medium
                      ${isChecking ? 'ring-4 ring-yellow-400 animate-pulse scale-110' : ''}
                      ${isFound ? 'ring-4 ring-green-400 scale-110' : ''}
                      ${wasChecked ? 'opacity-50' : ''}`}
                      style={{ backgroundColor: level.color }}>
                      <span>{level.name.split(' ')[0]}</span>
                      {isFound && <span className="text-lg">✓</span>}
                      {wasChecked && <span className="text-lg">✗</span>}
                    </div>
                    {index < MEMORY_LEVELS.length - 1 && <div className={`w-4 h-1 ${wasChecked || isChecking ? 'bg-yellow-400' : 'bg-gray-300'}`} />}
                  </React.Fragment>
                );
              })}
            </div>
            {dataJourney.found && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg text-green-800">
                ✓ Data found in {MEMORY_LEVELS[dataJourney.currentLevel]?.name}! Access time: {MEMORY_LEVELS[dataJourney.currentLevel]?.speed}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected level details */}
      {selectedLevel !== null && (
        <div className="p-4 rounded-lg text-white mb-6" style={{ backgroundColor: MEMORY_LEVELS[selectedLevel].color }}>
          <h3 className="text-xl font-bold mb-2">{MEMORY_LEVELS[selectedLevel].name}</h3>
          <p className="mb-3 opacity-90">{MEMORY_LEVELS[selectedLevel].description}</p>
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div><span className="opacity-75">Size:</span><span className="ml-2 font-mono font-bold">{MEMORY_LEVELS[selectedLevel].size}</span></div>
            <div><span className="opacity-75">Latency:</span><span className="ml-2 font-mono font-bold">{MEMORY_LEVELS[selectedLevel].speed}</span></div>
            <div><span className="opacity-75">Cycles:</span><span className="ml-2 font-mono font-bold">{MEMORY_LEVELS[selectedLevel].latency}</span></div>
          </div>
          <div>
            <span className="opacity-75">Examples:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {MEMORY_LEVELS[selectedLevel].examples.map((ex, i) => (
                <span key={i} className="px-2 py-1 bg-white/20 rounded text-sm">{ex}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Key insight */}
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <h4 className="font-bold text-yellow-800">💡 Key Insight</h4>
        <p className="text-yellow-900">
          The memory hierarchy exploits <strong>locality</strong>: programs tend to access the same data 
          (temporal) or nearby data (spatial) repeatedly. Caches keep frequently-used data close to the CPU.
        </p>
      </div>
    </div>
  );
};

export default MemoryPyramid;
