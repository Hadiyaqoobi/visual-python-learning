"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TensorViz() {
  const [tensorType, setTensorType] = useState<'scalar' | '1d' | '2d' | '3d'>('2d');
  const [showOperations, setShowOperations] = useState(false);

  const tensors = {
    scalar: {
      name: 'Scalar (0D)',
      shape: '[]',
      description: 'A single number',
      code: 'torch.tensor(42)',
      visual: (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 'bold', color: 'white',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
          }}
        >
          42
        </motion.div>
      ),
    },
    '1d': {
      name: 'Vector (1D)',
      shape: '[4]',
      description: 'A list of numbers',
      code: 'torch.tensor([1, 2, 3, 4])',
      visual: (
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4].map((val, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                width: '50px', height: '50px', borderRadius: '8px',
                background: `linear-gradient(135deg, hsl(${200 + i * 30}, 70%, 50%), hsl(${220 + i * 30}, 70%, 40%))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: 'bold', color: 'white',
              }}
            >
              {val}
            </motion.div>
          ))}
        </div>
      ),
    },
    '2d': {
      name: 'Matrix (2D)',
      shape: '[3, 4]',
      description: 'A table of numbers (rows × columns)',
      code: 'torch.tensor([[1,2,3,4], [5,6,7,8], [9,10,11,12]])',
      visual: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[[1,2,3,4], [5,6,7,8], [9,10,11,12]].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '4px' }}>
              {row.map((val, j) => (
                <motion.div
                  key={j}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: (i * 4 + j) * 0.03 }}
                  style={{
                    width: '45px', height: '45px', borderRadius: '6px',
                    background: `linear-gradient(135deg, hsl(${180 + val * 10}, 70%, 50%), hsl(${200 + val * 10}, 70%, 40%))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 'bold', color: 'white',
                  }}
                >
                  {val}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      ),
    },
    '3d': {
      name: '3D Tensor',
      shape: '[2, 3, 4]',
      description: 'Stack of matrices (e.g., RGB image)',
      code: 'torch.randn(2, 3, 4)',
      visual: (
        <div style={{ display: 'flex', gap: '20px', perspective: '500px' }}>
          {[0, 1].map((batch, b) => (
            <motion.div
              key={b}
              initial={{ rotateY: -30, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ delay: b * 0.2 }}
              style={{
                display: 'flex', flexDirection: 'column', gap: '3px',
                opacity: b === 0 ? 1 : 0.7,
              }}
            >
              {[0, 1, 2].map((row, i) => (
                <div key={i} style={{ display: 'flex', gap: '3px' }}>
                  {[0, 1, 2, 3].map((col, j) => (
                    <motion.div
                      key={j}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (b * 12 + i * 4 + j) * 0.02 }}
                      style={{
                        width: '35px', height: '35px', borderRadius: '4px',
                        background: b === 0 
                          ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                          : 'linear-gradient(135deg, #22c55e, #16a34a)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', color: 'white',
                      }}
                    >
                      {(Math.random() * 2 - 1).toFixed(1)}
                    </motion.div>
                  ))}
                </div>
              ))}
              <div style={{ textAlign: 'center', fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                Batch {b}
              </div>
            </motion.div>
          ))}
        </div>
      ),
    },
  };

  const current = tensors[tensorType];

  const operations = [
    { op: 'a + b', name: 'Addition', desc: 'Element-wise add' },
    { op: 'a * b', name: 'Multiply', desc: 'Element-wise multiply' },
    { op: 'a @ b', name: 'MatMul', desc: 'Matrix multiplication' },
    { op: 'a.sum()', name: 'Sum', desc: 'Sum all elements' },
    { op: 'a.mean()', name: 'Mean', desc: 'Average value' },
    { op: 'a.reshape()', name: 'Reshape', desc: 'Change dimensions' },
  ];

  return (
    <div style={{
      width: '100%', minHeight: '700px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #ee4c2c 0%, #ff6f61 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🔥 PyTorch Tensors</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
          The fundamental data structure for deep learning
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
        {(Object.keys(tensors) as Array<keyof typeof tensors>).map(key => (
          <button
            key={key}
            onClick={() => setTensorType(key)}
            style={{
              padding: '12px 20px', borderRadius: '12px',
              background: tensorType === key ? '#ee4c2c' : 'rgba(255,255,255,0.1)',
              border: '2px solid #ee4c2c',
              color: 'white', cursor: 'pointer',
              fontWeight: tensorType === key ? 'bold' : 'normal',
            }}
          >
            {tensors[key].name}
          </button>
        ))}
      </div>

      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '180px' }}>
          {current.visual}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>Shape: <code style={{ color: '#ee4c2c' }}>{current.shape}</code></div>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{current.description}</div>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ color: '#ee4c2c' }}>●</span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>PyTorch Code</span>
        </div>
        <code style={{ fontFamily: 'monospace', fontSize: '14px', color: '#22c55e' }}>
          {current.code}
        </code>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowOperations(!showOperations)}
          style={{
            width: '100%', padding: '12px', borderRadius: '8px',
            background: 'rgba(238, 76, 44, 0.2)',
            border: '1px solid rgba(238, 76, 44, 0.5)',
            color: 'white', cursor: 'pointer', fontSize: '14px',
          }}
        >
          {showOperations ? '▼' : '▶'} Common Tensor Operations
        </button>
        
        {showOperations && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '12px' }}>
              {operations.map((op, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px', padding: '12px',
                    textAlign: 'center',
                  }}
                >
                  <code style={{ color: '#ee4c2c', fontSize: '14px' }}>{op.op}</code>
                  <div style={{ fontSize: '12px', color: '#e2e8f0', marginTop: '4px' }}>{op.name}</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>{op.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div style={{ padding: '16px', background: 'rgba(238, 76, 44, 0.1)', borderRadius: '12px', borderLeft: '4px solid #ee4c2c' }}>
        <h4 style={{ color: '#ee4c2c', marginBottom: '8px', fontSize: '14px' }}>💡 Why Tensors?</h4>
        <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6' }}>
          Tensors are like NumPy arrays but with superpowers: they can run on GPUs for 100x faster computation, 
          and they automatically track gradients for backpropagation. Everything in deep learning is a tensor!
        </p>
      </div>
    </div>
  );
}
