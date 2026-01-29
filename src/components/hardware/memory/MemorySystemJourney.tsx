// H13: Complete Memory System Journey

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface MemoryLevel {
  id: string;
  name: string;
  shortName: string;
  latency: string;
  latencyNs: number;
  color: string;
  size: string;
}

const MEMORY_LEVELS: MemoryLevel[] = [
  { id: 'reg', name: 'CPU Registers', shortName: 'REG', latency: '<1ns', latencyNs: 0.5, color: '#ef4444', size: '~1KB' },
  { id: 'l1', name: 'L1 Cache', shortName: 'L1', latency: '~1ns', latencyNs: 1, color: '#f97316', size: '64KB' },
  { id: 'l2', name: 'L2 Cache', shortName: 'L2', latency: '~4ns', latencyNs: 4, color: '#eab308', size: '512KB' },
  { id: 'l3', name: 'L3 Cache', shortName: 'L3', latency: '~12ns', latencyNs: 12, color: '#22c55e', size: '8MB' },
  { id: 'ram', name: 'Main Memory', shortName: 'RAM', latency: '~100ns', latencyNs: 100, color: '#3b82f6', size: '16GB' },
  { id: 'ssd', name: 'SSD Storage', shortName: 'SSD', latency: '~100μs', latencyNs: 100000, color: '#8b5cf6', size: '512GB' },
];

const SAMPLE_VARIABLES = [
  { name: 'counter', location: 0, value: 42, description: 'Loop counter in register' },
  { name: 'array[0]', location: 1, value: 100, description: 'Recently accessed, in L1' },
  { name: 'array[50]', location: 2, value: 150, description: 'Accessed a moment ago, in L2' },
  { name: 'config', location: 3, value: 999, description: 'Shared data, in L3' },
  { name: 'userData', location: 4, value: 12345, description: 'General data, in RAM' },
  { name: 'fileData', location: 5, value: 0, description: 'From disk, needs SSD access' },
];

interface JourneyStep {
  level: number;
  action: 'check' | 'found' | 'miss' | 'store';
  message: string;
}

export const MemorySystemJourney: React.FC = () => {
  const [selectedVariable, setSelectedVariable] = useState<number | null>(null);
  const [journeyActive, setJourneyActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([]);
  const [totalTime, setTotalTime] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(true);
  
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const startJourney = useCallback(async (variableIndex: number) => {
    const variable = SAMPLE_VARIABLES[variableIndex];
    const targetLevel = variable.location;
    
    setJourneyActive(true);
    setSelectedVariable(variableIndex);
    setCurrentStep(-1);
    setJourneySteps([]);
    setTotalTime('');
    
    const steps: JourneyStep[] = [];
    
    // Generate journey steps - searching down
    for (let i = 0; i <= targetLevel; i++) {
      steps.push({
        level: i,
        action: 'check',
        message: `Checking ${MEMORY_LEVELS[i].name}...`
      });
      if (i === targetLevel) {
        steps.push({
          level: i,
          action: 'found',
          message: `✓ Data found in ${MEMORY_LEVELS[i].name}!`
        });
      } else {
        steps.push({
          level: i,
          action: 'miss',
          message: `✗ Not in ${MEMORY_LEVELS[i].name}, checking next level...`
        });
      }
    }
    
    // Add cache-back steps (storing in faster levels)
    if (targetLevel > 0) {
      for (let i = targetLevel - 1; i >= 0; i--) {
        steps.push({
          level: i,
          action: 'store',
          message: `Caching data in ${MEMORY_LEVELS[i].name} for future access`
        });
      }
    }
    
    setJourneySteps(steps);
    
    // Animate through steps
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await sleep(steps[i].action === 'found' ? 1200 : 600);
    }
    
    // Calculate total time
    let time = 0;
    for (let i = 0; i <= targetLevel; i++) {
      time += MEMORY_LEVELS[i].latencyNs;
    }
    setTotalTime(time < 1000 ? `${time.toFixed(1)} ns` : `${(time/1000).toFixed(1)} μs`);
    
    setJourneyActive(false);
  }, []);

  useEffect(() => {
    return () => { if (animationRef.current) clearTimeout(animationRef.current); };
  }, []);

  const getCurrentLevelFromStep = () => {
    if (currentStep < 0 || currentStep >= journeySteps.length) return -1;
    return journeySteps[currentStep].level;
  };

  const getLevelStatus = (levelIndex: number): string => {
    if (currentStep < 0) return 'idle';
    
    const currentLevel = getCurrentLevelFromStep();
    const currentAction = journeySteps[currentStep]?.action;
    
    if (levelIndex === currentLevel) return currentAction;
    
    // Check previous states
    for (let i = 0; i <= currentStep; i++) {
      if (journeySteps[i].level === levelIndex) {
        if (journeySteps[i].action === 'miss') return 'missed';
        if (journeySteps[i].action === 'store') return 'stored';
      }
    }
    return 'idle';
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Memory System Journey</h2>
        <p className="text-gray-600">
          Watch how the CPU searches through the memory hierarchy to find data.
          Select a variable to see its journey from CPU to storage and back.
        </p>
      </div>

      {/* CPU and Memory System */}
      <div className="mb-6">
        {/* CPU */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-24 h-24 bg-gray-800 rounded-lg flex flex-col items-center justify-center text-white font-bold shadow-lg ${journeyActive ? 'animate-pulse' : ''}`}>
            <span className="text-2xl">CPU</span>
            <span className="text-xs opacity-75">Processing</span>
          </div>
          <div className="flex-1 flex items-center">
            <div className={`h-2 flex-1 rounded ${journeyActive ? 'bg-yellow-400' : 'bg-gray-300'}`}>
              {journeyActive && <div className="h-full w-4 bg-yellow-600 rounded animate-ping" />}
            </div>
            <span className="mx-2 text-gray-500">→</span>
          </div>
        </div>

        {/* Memory Levels */}
        <div className="grid grid-cols-6 gap-2">
          {MEMORY_LEVELS.map((level, index) => {
            const status = getLevelStatus(index);
            return (
              <div
                key={level.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center text-center
                  ${status === 'check' ? 'border-yellow-400 bg-yellow-50 scale-105 shadow-lg' : ''}
                  ${status === 'found' ? 'border-green-500 bg-green-100 scale-110 shadow-xl' : ''}
                  ${status === 'miss' || status === 'missed' ? 'border-red-300 bg-red-50 opacity-60' : ''}
                  ${status === 'store' || status === 'stored' ? 'border-blue-400 bg-blue-50' : ''}
                  ${status === 'idle' ? 'border-gray-200 bg-gray-50' : ''}`}
                style={{ borderTopColor: level.color, borderTopWidth: '4px' }}
              >
                <div className="text-lg font-bold mb-1" style={{ color: level.color }}>{level.shortName}</div>
                <div className="text-xs text-gray-500 mb-1">{level.size}</div>
                <div className="text-xs font-mono text-gray-600">{level.latency}</div>
                {status === 'check' && <div className="mt-2 text-yellow-600 text-lg animate-spin">⚙️</div>}
                {status === 'found' && <div className="mt-2 text-green-600 text-lg animate-bounce">✓</div>}
                {(status === 'miss' || status === 'missed') && <div className="mt-2 text-red-500 text-lg">✗</div>}
                {(status === 'store' || status === 'stored') && <div className="mt-2 text-blue-500 text-lg">📥</div>}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>⚡ Fastest</span>
          <span>🐢 Slowest</span>
        </div>
      </div>

      {/* Current step message */}
      {journeyActive && currentStep >= 0 && currentStep < journeySteps.length && (
        <div className={`mb-6 p-4 rounded-lg text-center font-medium text-lg
          ${journeySteps[currentStep].action === 'found' ? 'bg-green-100 text-green-800' : ''}
          ${journeySteps[currentStep].action === 'miss' ? 'bg-red-100 text-red-800' : ''}
          ${journeySteps[currentStep].action === 'check' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${journeySteps[currentStep].action === 'store' ? 'bg-blue-100 text-blue-800' : ''}`}>
          {journeySteps[currentStep].message}
        </div>
      )}

      {/* Result */}
      {totalTime && !journeyActive && (
        <div className="mb-6 p-4 bg-green-100 rounded-lg text-center">
          <span className="text-green-800 font-bold text-xl">Total access time: {totalTime}</span>
          {selectedVariable !== null && (
            <p className="text-green-700 mt-1">
              Retrieved "{SAMPLE_VARIABLES[selectedVariable].name}" = {SAMPLE_VARIABLES[selectedVariable].value}
            </p>
          )}
        </div>
      )}

      {/* Variable selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select a Variable to Access:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SAMPLE_VARIABLES.map((variable, index) => (
            <button
              key={variable.name}
              onClick={() => startJourney(index)}
              disabled={journeyActive}
              className={`p-4 rounded-lg border-2 text-left transition-all
                ${journeyActive ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-md'}
                ${selectedVariable === index && !journeyActive ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MEMORY_LEVELS[variable.location].color }} />
                <span className="font-mono font-bold">{variable.name}</span>
              </div>
              <div className="text-sm text-gray-600">{variable.description}</div>
              <div className="text-xs text-gray-500 mt-1">Located in: {MEMORY_LEVELS[variable.location].name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Explanation toggle */}
      <button
        onClick={() => setShowExplanation(!showExplanation)}
        className="mb-4 text-blue-500 hover:text-blue-700 text-sm"
      >
        {showExplanation ? '▼ Hide' : '▶ Show'} How Memory Hierarchy Works
      </button>

      {/* Explanation */}
      {showExplanation && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2">🔍 The Search Process</h4>
            <ol className="list-decimal list-inside text-blue-700 space-y-1 text-sm">
              <li>CPU first checks its registers (fastest, but tiny)</li>
              <li>Then L1 cache (very fast, per-core)</li>
              <li>Then L2 cache (fast, larger)</li>
              <li>Then L3 cache (slower, shared between cores)</li>
              <li>Then main RAM (much slower)</li>
              <li>Finally storage if needed (very slow)</li>
            </ol>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-bold text-green-800 mb-2">📥 Caching on the Way Back</h4>
            <p className="text-green-700 text-sm">
              When data is found, it's copied into faster memory levels on the way back.
              If the same data is needed again soon, it will be found faster!
              This exploits <strong>temporal locality</strong>.
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-bold text-yellow-800 mb-2">💡 Why This Design?</h4>
            <p className="text-yellow-700 text-sm">
              Fast memory is expensive and can't be large. Slow memory is cheap but... slow.
              The hierarchy gives us the illusion of large, fast memory by keeping
              frequently-used data close to the CPU.
            </p>
          </div>

          {/* Latency comparison */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-gray-700 mb-3">⏱️ Latency Comparison</h4>
            <div className="space-y-2">
              {MEMORY_LEVELS.map((level, index) => {
                const widths = [5, 10, 20, 40, 80, 100];
                return (
                  <div key={level.id} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-gray-600">{level.shortName}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div className="h-4 rounded-full" style={{ width: `${widths[index]}%`, backgroundColor: level.color }} />
                    </div>
                    <div className="w-20 text-sm font-mono text-gray-600">{level.latency}</div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-gray-500 text-center">
              Note: Scale is logarithmic. SSD is ~100,000× slower than registers!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemorySystemJourney;
