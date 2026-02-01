"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ConvolutionDemo() {
  const [kernelType, setKernelType] = useState<'edge' | 'blur' | 'sharpen'>('edge');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const inputImage = [
    [10, 10, 10, 50, 50],
    [10, 10, 10, 50, 50],
    [10, 10, 10, 50, 50],
    [10, 10, 50, 50, 50],
    [10, 50, 50, 50, 50],
  ];

  const kernels = {
    edge: { name: 'Edge Detection', values: [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]], color: '#ef4444' },
    blur: { name: 'Blur (Average)', values: [[1/9, 1/9, 1/9], [1/9, 1/9, 1/9], [1/9, 1/9, 1/9]], color: '#3b82f6' },
    sharpen: { name: 'Sharpen', values: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]], color: '#22c55e' },
  };

  const currentKernel = kernels[kernelType];

  const computeConvolution = (px: number, py: number) => {
    let sum = 0;
    for (let ky = 0; ky < 3; ky++) {
      for (let kx = 0; kx < 3; kx++) {
        const imgY = py + ky;
        const imgX = px + kx;
        if (imgY < 5 && imgX < 5) {
          sum += inputImage[imgY][imgX] * currentKernel.values[ky][kx];
        }
      }
    }
    return Math.max(0, Math.min(255, Math.round(sum)));
  };

  const outputImage = Array(3).fill(0).map((_, y) =>
    Array(3).fill(0).map((_, x) => computeConvolution(x, y))
  );

  const currentValue = computeConvolution(position.x, position.y);

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setPosition(p => {
          const newX = (p.x + 1) % 3;
          const newY = newX === 0 ? (p.y + 1) % 3 : p.y;
          return { x: newX, y: newY };
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  const cellSize = 40;

  return (
    <div style={{
      width: '100%', minHeight: '650px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>⊛ Convolution Operation</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Slide a kernel over the image to detect features</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
        {(Object.keys(kernels) as Array<keyof typeof kernels>).map(k => (
          <button key={k} onClick={() => setKernelType(k)}
            style={{
              padding: '8px 16px', borderRadius: '8px',
              background: kernelType === k ? kernels[k].color : 'transparent',
              border: `2px solid ${kernels[k].color}`,
              color: 'white', cursor: 'pointer', fontSize: '12px',
            }}>
            {kernels[k].name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textAlign: 'center' }}>Input (5×5)</div>
          <div style={{ position: 'relative', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '4px' }}>
            {inputImage.map((row, y) => (
              <div key={y} style={{ display: 'flex' }}>
                {row.map((val, x) => (
                  <div key={x} style={{
                    width: cellSize, height: cellSize,
                    background: `rgb(${val}, ${val}, ${val})`,
                    border: '1px solid #334155',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', color: val > 127 ? 'black' : 'white',
                  }}>
                    {val}
                  </div>
                ))}
              </div>
            ))}
            <motion.div
              style={{
                position: 'absolute',
                width: cellSize * 3 + 2,
                height: cellSize * 3 + 2,
                border: `3px solid ${currentKernel.color}`,
                borderRadius: '4px',
                pointerEvents: 'none',
                boxShadow: `0 0 15px ${currentKernel.color}`,
              }}
              animate={{
                left: position.x * cellSize + 3,
                top: position.y * cellSize + 3,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textAlign: 'center' }}>Kernel (3×3)</div>
          <div style={{ background: `${currentKernel.color}30`, borderRadius: '8px', padding: '4px', border: `2px solid ${currentKernel.color}` }}>
            {currentKernel.values.map((row, y) => (
              <div key={y} style={{ display: 'flex' }}>
                {row.map((val, x) => (
                  <motion.div key={x} style={{
                    width: cellSize, height: cellSize,
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid #475569',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 'bold',
                    color: val > 0 ? '#22c55e' : val < 0 ? '#ef4444' : '#94a3b8',
                  }}>
                    {val.toFixed(val % 1 === 0 ? 0 : 2)}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '32px', color: '#94a3b8' }}>=</div>

        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textAlign: 'center' }}>Output (3×3)</div>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '4px' }}>
            {outputImage.map((row, y) => (
              <div key={y} style={{ display: 'flex' }}>
                {row.map((val, x) => {
                  const isActive = x === position.x && y === position.y;
                  return (
                    <motion.div key={x} style={{
                      width: cellSize, height: cellSize,
                      background: isActive ? currentKernel.color : `rgb(${val}, ${val}, ${val})`,
                      border: isActive ? '2px solid white' : '1px solid #334155',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', color: val > 127 && !isActive ? 'black' : 'white',
                      fontWeight: isActive ? 'bold' : 'normal',
                    }}>
                      {val}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => setIsAnimating(!isAnimating)}
          style={{
            padding: '10px 24px', borderRadius: '8px',
            background: isAnimating ? '#ef4444' : '#22c55e',
            border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer',
          }}>
          {isAnimating ? '⏸ Pause' : '▶ Animate'}
        </button>
        <button onClick={() => setPosition(p => ({ x: (p.x + 1) % 3, y: p.x === 2 ? (p.y + 1) % 3 : p.y }))}
          disabled={isAnimating}
          style={{
            padding: '10px 24px', borderRadius: '8px',
            background: '#3b82f6', border: 'none', color: 'white',
            fontWeight: 'bold', cursor: 'pointer', opacity: isAnimating ? 0.5 : 1,
          }}>
          Step →
        </button>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
        <h4 style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
          Current Calculation (position [{position.x}, {position.y}])
        </h4>
        <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#e2e8f0' }}>
          Σ(input × kernel) = <strong style={{ color: currentKernel.color }}>{currentValue}</strong>
        </div>
      </div>
    </div>
  );
}
