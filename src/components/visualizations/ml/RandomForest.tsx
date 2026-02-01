"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RandomForest() {
  const [numTrees, setNumTrees] = useState(5);
  const [isVoting, setIsVoting] = useState(false);
  const [votes, setVotes] = useState<boolean[]>([]);
  const [currentTree, setCurrentTree] = useState(-1);

  const generateVote = () => Math.random() > 0.35;

  const runVoting = () => {
    setVotes([]);
    setCurrentTree(-1);
    setIsVoting(true);
  };

  useEffect(() => {
    if (!isVoting) return;
    if (currentTree >= numTrees - 1) {
      setIsVoting(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentTree(c => c + 1);
      setVotes(v => [...v, generateVote()]);
    }, 600);
    return () => clearTimeout(timer);
  }, [isVoting, currentTree, numTrees]);

  const yesVotes = votes.filter(v => v).length;
  const noVotes = votes.filter(v => !v).length;
  const finalPrediction = yesVotes > noVotes;

  return (
    <div style={{
      width: '100%', minHeight: '650px',
      background: 'linear-gradient(180deg, #0f172a 0%, #064e3b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ 
          fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🌲 Random Forest: Ensemble Power</h2>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Many trees vote together for better predictions</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px', textAlign: 'center' }}>
            Forest of {numTrees} Decision Trees
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {Array.from({ length: numTrees }, (_, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <motion.div
                  animate={currentTree === i ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  style={{ fontSize: '48px', filter: i <= currentTree ? 'none' : 'grayscale(1) opacity(0.4)' }}>
                  🌲
                </motion.div>
                <AnimatePresence>
                  {votes[i] !== undefined && (
                    <motion.div initial={{ scale: 0, y: -20 }} animate={{ scale: 1, y: 0 }}
                      style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: votes[i] ? '#22c55e' : '#ef4444',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', fontWeight: 'bold',
                      }}>
                      {votes[i] ? '✓' : '✗'}
                    </motion.div>
                  )}
                </AnimatePresence>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Tree {i + 1}</span>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {votes.length === numTrees && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '24px', padding: '16px',
                  background: finalPrediction ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  borderRadius: '12px', border: `2px solid ${finalPrediction ? '#22c55e' : '#ef4444'}`,
                  textAlign: 'center',
                }}>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Final Prediction (Majority Vote)</div>
                <div style={{ fontSize: '32px', marginTop: '4px' }}>{finalPrediction ? '✅ YES' : '❌ NO'}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{yesVotes} yes vs {noVotes} no</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Number of Trees: {numTrees}</h4>
            <input type="range" min="3" max="7" value={numTrees}
              onChange={(e) => { setNumTrees(parseInt(e.target.value)); setVotes([]); setCurrentTree(-1); }}
              disabled={isVoting} style={{ width: '100%' }} />
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Vote Count</h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: 'rgba(34, 197, 94, 0.2)', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{yesVotes}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Yes ✓</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{noVotes}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>No ✗</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '14px', color: '#22c55e', marginBottom: '8px' }}>💡 Key Ideas</h4>
            <ul style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.6', paddingLeft: '16px', margin: 0 }}>
              <li><strong>Bagging:</strong> Each tree sees random data subset</li>
              <li><strong>Feature randomness:</strong> Random features per split</li>
              <li><strong>Voting:</strong> Majority wins</li>
            </ul>
          </div>

          <button onClick={runVoting} disabled={isVoting} style={{
            padding: '14px', borderRadius: '8px', border: 'none',
            background: isVoting ? '#475569' : 'linear-gradient(135deg, #22c55e, #14b8a6)',
            color: 'white', fontWeight: '600', cursor: isVoting ? 'default' : 'pointer', fontSize: '14px',
          }}>{isVoting ? '🔄 Voting...' : '▶ Run Prediction'}</button>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '3px solid #22c55e' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>🎓 Why Random Forests Work</h4>
        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
          <strong>Problem:</strong> Single trees overfit. <strong>Solution:</strong> Train many trees on random subsets, average votes.
          <strong> Result:</strong> Errors cancel out - more stable predictions!
        </p>
      </div>
    </div>
  );
}
