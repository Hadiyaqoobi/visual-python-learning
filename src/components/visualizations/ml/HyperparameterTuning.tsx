"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function HyperparameterTuning() {
  const [method, setMethod] = useState<'grid' | 'random' | 'bayesian'>('grid');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [results, setResults] = useState<{params: string, score: number}[]>([]);
  const [bestResult, setBestResult] = useState<{params: string, score: number} | null>(null);

  const paramSpace = {
    n_estimators: [50, 100, 150, 200],
    max_depth: [3, 5, 7, 10],
    learning_rate: [0.01, 0.05, 0.1, 0.2],
  };

  const totalCombinations = 64;

  const simulateScore = (n: number, d: number, lr: number) => {
    const base = 0.75;
    const nBonus = n === 100 || n === 150 ? 0.05 : 0;
    const dBonus = d === 5 || d === 7 ? 0.04 : (d === 10 ? -0.02 : 0);
    const lrBonus = lr === 0.05 || lr === 0.1 ? 0.06 : (lr === 0.2 ? -0.03 : 0);
    const noise = (Math.random() - 0.5) * 0.04;
    return Math.min(0.98, Math.max(0.6, base + nBonus + dBonus + lrBonus + noise));
  };

  const runSearch = () => {
    setIsSearching(true);
    setResults([]);
    setBestResult(null);
    setSearchProgress(0);

    const searchResults: {params: string, score: number}[] = [];
    let currentBest: {params: string, score: number} | null = null;

    if (method === 'grid') {
      let i = 0;
      const interval = setInterval(() => {
        if (i >= totalCombinations) {
          clearInterval(interval);
          setIsSearching(false);
          return;
        }

        const nIdx = Math.floor(i / 16) % 4;
        const dIdx = Math.floor(i / 4) % 4;
        const lrIdx = i % 4;

        const n = paramSpace.n_estimators[nIdx];
        const d = paramSpace.max_depth[dIdx];
        const lr = paramSpace.learning_rate[lrIdx];
        const score = simulateScore(n, d, lr);

        const result = { params: `n=${n}, d=${d}, lr=${lr}`, score };
        searchResults.push(result);
        setResults([...searchResults]);

        if (!currentBest || score > currentBest.score) {
          currentBest = result;
          setBestResult(currentBest);
        }

        setSearchProgress(((i + 1) / totalCombinations) * 100);
        i++;
      }, 80);
    } else if (method === 'random') {
      let i = 0;
      const numTrials = 20;
      const interval = setInterval(() => {
        if (i >= numTrials) {
          clearInterval(interval);
          setIsSearching(false);
          return;
        }

        const n = paramSpace.n_estimators[Math.floor(Math.random() * 4)];
        const d = paramSpace.max_depth[Math.floor(Math.random() * 4)];
        const lr = paramSpace.learning_rate[Math.floor(Math.random() * 4)];
        const score = simulateScore(n, d, lr);

        const result = { params: `n=${n}, d=${d}, lr=${lr}`, score };
        searchResults.push(result);
        setResults([...searchResults]);

        if (!currentBest || score > currentBest.score) {
          currentBest = result;
          setBestResult(currentBest);
        }

        setSearchProgress(((i + 1) / numTrials) * 100);
        i++;
      }, 200);
    } else {
      let i = 0;
      const numTrials = 15;
      let goodN = 100, goodD = 5, goodLr = 0.1;
      
      const interval = setInterval(() => {
        if (i >= numTrials) {
          clearInterval(interval);
          setIsSearching(false);
          return;
        }

        let n, d, lr;
        if (i < 5) {
          n = paramSpace.n_estimators[Math.floor(Math.random() * 4)];
          d = paramSpace.max_depth[Math.floor(Math.random() * 4)];
          lr = paramSpace.learning_rate[Math.floor(Math.random() * 4)];
        } else {
          const nOptions = paramSpace.n_estimators.filter(x => Math.abs(x - goodN) <= 50);
          const dOptions = paramSpace.max_depth.filter(x => Math.abs(x - goodD) <= 2);
          const lrOptions = paramSpace.learning_rate.filter(x => Math.abs(x - goodLr) <= 0.05);
          
          n = nOptions[Math.floor(Math.random() * nOptions.length)] || goodN;
          d = dOptions[Math.floor(Math.random() * dOptions.length)] || goodD;
          lr = lrOptions[Math.floor(Math.random() * lrOptions.length)] || goodLr;
        }

        const score = simulateScore(n, d, lr);
        const result = { params: `n=${n}, d=${d}, lr=${lr}`, score };
        searchResults.push(result);
        setResults([...searchResults]);

        if (!currentBest || score > currentBest.score) {
          currentBest = result;
          setBestResult(currentBest);
          goodN = n; goodD = d; goodLr = lr;
        }

        setSearchProgress(((i + 1) / numTrials) * 100);
        i++;
      }, 300);
    }
  };

  const methods = [
    { id: 'grid', name: 'Grid Search', icon: '🔲', trials: 64, color: '#3b82f6', desc: 'Try ALL combinations' },
    { id: 'random', name: 'Random Search', icon: '🎲', trials: 20, color: '#22c55e', desc: 'Random sampling' },
    { id: 'bayesian', name: 'Bayesian', icon: '🧠', trials: 15, color: '#8b5cf6', desc: 'Smart exploration' },
  ];

  const currentMethod = methods.find(m => m.id === method)!;

  return (
    <div style={{
      width: '100%', minHeight: '700px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🎛️ Hyperparameter Tuning</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
          Find the best model settings automatically
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
        {methods.map(m => (
          <button
            key={m.id}
            onClick={() => { setMethod(m.id as typeof method); setResults([]); setBestResult(null); setSearchProgress(0); }}
            disabled={isSearching}
            style={{
              padding: '16px 24px', borderRadius: '12px',
              background: method === m.id ? m.color : 'rgba(255,255,255,0.1)',
              border: `2px solid ${m.color}`,
              color: 'white', cursor: isSearching ? 'not-allowed' : 'pointer',
              opacity: isSearching ? 0.5 : 1,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{m.icon}</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{m.name}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{m.trials} trials</div>
          </button>
        ))}
      </div>

      <div style={{
        background: `${currentMethod.color}20`,
        border: `2px solid ${currentMethod.color}50`,
        borderRadius: '12px', padding: '16px', marginBottom: '20px',
        textAlign: 'center',
      }}>
        <p style={{ color: '#e2e8f0', fontSize: '14px' }}>
          <strong>{currentMethod.name}:</strong> {currentMethod.desc}
          {method === 'grid' && ' — Exhaustive but slow (64 combinations)'}
          {method === 'random' && ' — Fast, often finds good solutions quickly'}
          {method === 'bayesian' && ' — Learns from past results to search smarter'}
        </p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={runSearch}
          disabled={isSearching}
          style={{
            padding: '12px 32px', borderRadius: '8px',
            background: isSearching ? '#475569' : '#22c55e',
            border: 'none', color: 'white', fontSize: '16px',
            fontWeight: 'bold', cursor: isSearching ? 'not-allowed' : 'pointer',
          }}
        >
          {isSearching ? `Searching... ${searchProgress.toFixed(0)}%` : '🔍 Start Search'}
        </button>
      </div>

      {isSearching && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ background: '#1e293b', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
            <motion.div
              style={{ background: currentMethod.color, height: '100%' }}
              animate={{ width: `${searchProgress}%` }}
            />
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '14px' }}>🏆 Best Result</h4>
          {bestResult ? (
            <motion.div
              key={bestResult.params}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '2px solid #22c55e',
                borderRadius: '8px', padding: '16px', textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22c55e' }}>
                {(bestResult.score * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px', fontFamily: 'monospace' }}>
                {bestResult.params}
              </div>
            </motion.div>
          ) : (
            <div style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>
              Run search to find best params
            </div>
          )}
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '14px' }}>
            📊 Search Log ({results.length} trials)
          </h4>
          <div style={{ maxHeight: '200px', overflow: 'auto' }}>
            {results.slice(-10).reverse().map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '6px 8px', borderRadius: '4px',
                  background: r === bestResult ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
                  fontSize: '11px', marginBottom: '4px',
                }}
              >
                <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>{r.params}</span>
                <span style={{ 
                  fontWeight: 'bold',
                  color: r.score > 0.9 ? '#22c55e' : r.score > 0.85 ? '#eab308' : '#94a3b8'
                }}>
                  {(r.score * 100).toFixed(1)}%
                </span>
              </motion.div>
            ))}
            {results.length === 0 && (
              <div style={{ color: '#64748b', textAlign: 'center' }}>No results yet</div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {methods.map(m => (
          <div key={m.id} style={{
            background: `${m.color}10`,
            border: `1px solid ${m.color}30`,
            borderRadius: '8px', padding: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span>{m.icon}</span>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: m.color }}>{m.name}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'pre-line' }}>
              {m.id === 'grid' && '✓ Guaranteed to find best\n✗ Slow with many params'}
              {m.id === 'random' && '✓ Fast & effective\n✓ Good with many params'}
              {m.id === 'bayesian' && '✓ Most efficient\n✗ More complex setup'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
