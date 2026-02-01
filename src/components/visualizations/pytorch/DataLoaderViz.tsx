"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DataLoaderViz() {
  const [batchSize, setBatchSize] = useState(4);
  const [shuffle, setShuffle] = useState(true);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample dataset of 12 items
  const dataset = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    color: `hsl(${i * 30}, 70%, 50%)`,
    label: ['🐱', '🐶', '🐦', '🐟', '🦋', '🐢', '🐰', '🦊', '🐻', '🐼', '🦁', '🐯'][i],
  }));

  const [order, setOrder] = useState(dataset.map((_, i) => i));

  const shuffleData = () => {
    const newOrder = [...order];
    for (let i = newOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
    }
    setOrder(newOrder);
  };

  const numBatches = Math.ceil(dataset.length / batchSize);
  const currentBatchItems = order.slice(currentBatch * batchSize, (currentBatch + 1) * batchSize);

  const nextBatch = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (currentBatch < numBatches - 1) {
        setCurrentBatch(currentBatch + 1);
      } else {
        setCurrentBatch(0);
        if (shuffle) shuffleData();
      }
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    if (shuffle) shuffleData();
  }, [shuffle]);

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
        }}>📦 DataLoader</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          Efficient batching and shuffling for training
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
            Batch Size
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[2, 4, 6].map(size => (
              <button
                key={size}
                onClick={() => { setBatchSize(size); setCurrentBatch(0); }}
                style={{
                  padding: '8px 16px', borderRadius: '8px',
                  background: batchSize === size ? '#f97316' : 'rgba(255,255,255,0.1)',
                  border: '2px solid #f97316',
                  color: 'white', cursor: 'pointer',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
            Shuffle
          </label>
          <button
            onClick={() => setShuffle(!shuffle)}
            style={{
              padding: '8px 20px', borderRadius: '8px',
              background: shuffle ? '#22c55e' : 'rgba(255,255,255,0.1)',
              border: '2px solid #22c55e',
              color: 'white', cursor: 'pointer',
            }}
          >
            {shuffle ? '✓ On' : '✗ Off'}
          </button>
        </div>
      </div>

      {/* Dataset visualization */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px', textAlign: 'center' }}>
          Full Dataset ({dataset.length} samples) - Current Order:
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {order.map((idx, i) => {
            const item = dataset[idx];
            const isInCurrentBatch = i >= currentBatch * batchSize && i < (currentBatch + 1) * batchSize;
            return (
              <motion.div
                key={i}
                animate={{
                  scale: isInCurrentBatch ? 1.1 : 1,
                  y: isInCurrentBatch ? -5 : 0,
                }}
                style={{
                  width: '50px', height: '50px',
                  borderRadius: '8px',
                  background: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  border: isInCurrentBatch ? '3px solid white' : '3px solid transparent',
                  opacity: isInCurrentBatch ? 1 : 0.5,
                }}
              >
                {item.label}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current batch */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <div style={{ fontSize: '14px', color: '#f97316', marginBottom: '16px', textAlign: 'center' }}>
          Current Batch: {currentBatch + 1} / {numBatches}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', minHeight: '80px', alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ color: '#64748b' }}
              >
                Loading batch...
              </motion.div>
            ) : (
              <motion.div
                key={currentBatch}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                style={{ display: 'flex', gap: '12px' }}
              >
                {currentBatchItems.map((idx, i) => {
                  const item = dataset[idx];
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        width: '70px', height: '70px',
                        borderRadius: '12px',
                        background: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        boxShadow: `0 0 20px ${item.color}50`,
                      }}
                    >
                      {item.label}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            onClick={nextBatch}
            disabled={isLoading}
            style={{
              padding: '12px 32px',
              borderRadius: '8px',
              background: isLoading ? '#475569' : '#f97316',
              border: 'none',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {currentBatch < numBatches - 1 ? 'Next Batch →' : '🔄 New Epoch'}
          </button>
        </div>
      </div>

      {/* Code */}
      <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '16px' }}>
        <pre style={{ fontFamily: 'monospace', fontSize: '11px', color: '#22c55e', margin: 0 }}>
{`from torch.utils.data import DataLoader

loader = DataLoader(
    dataset,
    batch_size=${batchSize},
    shuffle=${shuffle ? 'True' : 'False'},
    num_workers=4
)

for batch in loader:  # ${numBatches} batches per epoch
    x, y = batch
    # x.shape = [${batchSize}, ...]`}
        </pre>
      </div>
    </div>
  );
}
