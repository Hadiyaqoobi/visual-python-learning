// H11: Cache Simulator - Hit vs Miss Visualization

import React, { useState, useRef, useCallback } from 'react';

interface CacheLine {
  valid: boolean;
  tag: number;
  data: number;
  lastAccess: number;
}

interface AccessResult {
  type: 'hit' | 'miss';
  address: number;
  cacheLineIndex: number;
  data: number;
}

const CACHE_SIZE = 8;
const RAM_SIZE = 64;
const CACHE_LINE_SIZE = 8;

export const CacheSimulator: React.FC = () => {
  const [cache, setCache] = useState<CacheLine[]>(() =>
    Array(CACHE_SIZE).fill(null).map(() => ({ valid: false, tag: 0, data: 0, lastAccess: 0 }))
  );
  const [ram] = useState<number[]>(() => 
    Array(RAM_SIZE).fill(0).map(() => Math.floor(Math.random() * 256))
  );
  const [inputAddress, setInputAddress] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [checkingLine, setCheckingLine] = useState<number>(-1);
  const [hitCount, setHitCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [accessHistory, setAccessHistory] = useState<AccessResult[]>([]);
  const [lastResult, setLastResult] = useState<'hit' | 'miss' | null>(null);
  const accessCountRef = useRef(0);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const getTag = (address: number) => Math.floor(address / CACHE_LINE_SIZE);
  const getCacheIndex = (address: number) => getTag(address) % CACHE_SIZE;

  const accessMemory = useCallback(async (address: number) => {
    if (isProcessing || address < 0 || address >= RAM_SIZE) return;
    
    setIsProcessing(true);
    setLastResult(null);
    accessCountRef.current++;
    const currentAccess = accessCountRef.current;
    const tag = getTag(address);
    const cacheIndex = getCacheIndex(address);

    // Step 1: Calculate
    setCurrentStep(`Calculating: Address ${address} → Tag: ${tag}, Cache Line: ${cacheIndex}`);
    await sleep(500);
    
    // Step 2: Check cache
    setCurrentStep(`Checking cache line ${cacheIndex}...`);
    setCheckingLine(cacheIndex);
    await sleep(400);

    const cacheLine = cache[cacheIndex];
    
    if (cacheLine.valid && cacheLine.tag === tag) {
      // HIT
      setCurrentStep(`🎉 CACHE HIT! Data found in cache line ${cacheIndex}`);
      setLastResult('hit');
      setHitCount(prev => prev + 1);
      setCache(prev => prev.map((line, i) => 
        i === cacheIndex ? { ...line, lastAccess: currentAccess } : line
      ));
      setAccessHistory(prev => [...prev.slice(-9), { 
        type: 'hit', address, cacheLineIndex: cacheIndex, data: cacheLine.data 
      }]);
      await sleep(800);
    } else {
      // MISS
      setCurrentStep(`❌ CACHE MISS! Fetching from RAM...`);
      setLastResult('miss');
      setMissCount(prev => prev + 1);
      await sleep(600);
      
      const data = ram[address];
      setCurrentStep(`📥 Loading address ${address} (data: ${data}) into cache line ${cacheIndex}`);
      await sleep(800);
      
      setCache(prev => prev.map((line, i) => 
        i === cacheIndex ? { valid: true, tag, data, lastAccess: currentAccess } : line
      ));
      setAccessHistory(prev => [...prev.slice(-9), { 
        type: 'miss', address, cacheLineIndex: cacheIndex, data 
      }]);
      await sleep(400);
    }
    
    setCheckingLine(-1);
    setCurrentStep('Ready for next access');
    setIsProcessing(false);
  }, [cache, ram, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const address = parseInt(inputAddress);
    if (!isNaN(address) && address >= 0 && address < RAM_SIZE) {
      accessMemory(address);
      setInputAddress('');
    }
  };

  const resetSimulator = () => {
    setCache(Array(CACHE_SIZE).fill(null).map(() => ({ valid: false, tag: 0, data: 0, lastAccess: 0 })));
    setHitCount(0);
    setMissCount(0);
    setAccessHistory([]);
    setLastResult(null);
    setCurrentStep('');
    accessCountRef.current = 0;
  };

  const hitRate = hitCount + missCount > 0 
    ? ((hitCount / (hitCount + missCount)) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Cache Simulator</h2>
        <p className="text-gray-600">
          Experience the difference between cache hits and misses. Enter a memory address 
          to see if data is in the cache (fast!) or needs to be fetched from RAM (slow).
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-600">{hitCount}</div>
          <div className="text-sm text-green-800">Cache Hits</div>
          <div className="text-xs text-green-600">~2 ns each</div>
        </div>
        <div className="bg-red-100 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-red-600">{missCount}</div>
          <div className="text-sm text-red-800">Cache Misses</div>
          <div className="text-xs text-red-600">~100 ns each</div>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-600">{hitRate}%</div>
          <div className="text-sm text-blue-800">Hit Rate</div>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-purple-600">{hitCount + missCount}</div>
          <div className="text-sm text-purple-800">Total Accesses</div>
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">
            Memory Address (0-{RAM_SIZE - 1})
          </label>
          <input
            type="number"
            min={0}
            max={RAM_SIZE - 1}
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            disabled={isProcessing}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter address..."
          />
        </div>
        <button
          type="submit"
          disabled={isProcessing || !inputAddress}
          className={`px-6 py-2 rounded-lg font-medium self-end ${
            isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Access Memory
        </button>
        <button
          type="button"
          onClick={resetSimulator}
          disabled={isProcessing}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium self-end"
        >
          Reset
        </button>
      </form>

      {/* Quick access buttons */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">Quick Access:</div>
        <div className="flex flex-wrap gap-2">
          {[0, 8, 16, 24, 32, 5, 13, 21].map(addr => (
            <button
              key={addr}
              onClick={() => accessMemory(addr)}
              disabled={isProcessing}
              className={`px-3 py-1 rounded text-sm font-mono ${
                isProcessing ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              [{addr}]
            </button>
          ))}
        </div>
      </div>

      {/* Current step */}
      {currentStep && (
        <div className={`mb-6 p-4 rounded-lg font-medium ${
          lastResult === 'hit' ? 'bg-green-100 text-green-800' : 
          lastResult === 'miss' ? 'bg-red-100 text-red-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {isProcessing && <span className="inline-block animate-spin mr-2">⚙️</span>}
          {currentStep}
        </div>
      )}

      {/* Cache visualization */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Cache (8 Lines)</h3>
        <div className="grid grid-cols-1 gap-2">
          {cache.map((line, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-3 rounded-lg border-2 transition-all duration-300 ${
                checkingLine === index ? 'border-yellow-400 bg-yellow-50 scale-[1.02]' : 'border-gray-200'
              } ${line.valid && lastResult === 'hit' && checkingLine === index ? 'border-green-400 bg-green-50' : ''}`}
            >
              <div className="w-16 text-center">
                <span className="text-sm text-gray-500">Line</span>
                <div className="font-bold">{index}</div>
              </div>
              <div className={`w-16 h-10 rounded flex items-center justify-center font-bold ${
                line.valid ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {line.valid ? 'Valid' : 'Empty'}
              </div>
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-gray-500">Tag</span>
                  <div className="font-mono">{line.valid ? line.tag : '-'}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Data</span>
                  <div className="font-mono">{line.valid ? line.data : '-'}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Last Access</span>
                  <div className="font-mono text-sm">{line.valid ? `#${line.lastAccess}` : '-'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Access history */}
      {accessHistory.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Access History</h3>
          <div className="flex flex-wrap gap-2">
            {accessHistory.map((access, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded-lg text-sm font-mono ${
                  access.type === 'hit' 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                [{access.address}] → {access.type.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timing comparison */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-bold text-green-800 mb-2">⚡ Cache Hit</h4>
          <div className="space-y-1 text-sm text-green-700">
            <p>1. CPU requests data</p>
            <p>2. Check cache (1 cycle)</p>
            <p>3. ✓ Found! Return data</p>
            <p className="font-bold mt-2">Total: ~2 nanoseconds</p>
          </div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <h4 className="font-bold text-red-800 mb-2">🐢 Cache Miss</h4>
          <div className="space-y-1 text-sm text-red-700">
            <p>1. CPU requests data</p>
            <p>2. Check cache (1 cycle)</p>
            <p>3. ✗ Not found!</p>
            <p>4. Fetch from RAM (~200 cycles)</p>
            <p>5. Store in cache</p>
            <p className="font-bold mt-2">Total: ~100 nanoseconds</p>
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <h4 className="font-bold text-yellow-800">💡 Try This!</h4>
        <p className="text-yellow-900">
          Access the same address twice. First is a miss, second is a hit! 
          This is <strong>temporal locality</strong>. Also try 0, 1, 2, 3... 
          to see <strong>spatial locality</strong>.
        </p>
      </div>
    </div>
  );
};

export default CacheSimulator;
