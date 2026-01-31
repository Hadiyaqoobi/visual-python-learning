"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useState } from 'react';

const samplePredictions = [
  { actual: 0, predicted: 0 }, { actual: 0, predicted: 0 }, { actual: 0, predicted: 1 },
  { actual: 1, predicted: 1 }, { actual: 1, predicted: 1 }, { actual: 1, predicted: 0 },
  { actual: 0, predicted: 0 }, { actual: 1, predicted: 1 }, { actual: 0, predicted: 0 },
  { actual: 1, predicted: 1 }, { actual: 0, predicted: 1 }, { actual: 1, predicted: 0 },
  { actual: 1, predicted: 1 }, { actual: 0, predicted: 0 }, { actual: 1, predicted: 1 },
];

function MatrixCell({ position, count, label, isCorrect }: { 
  position: [number, number, number]; 
  count: number; 
  label: string;
  isCorrect: boolean;
}) {
  const height = Math.max(count * 0.3, 0.1);
  const color = isCorrect ? '#22c55e' : '#ef4444';
  
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[1.8, height, 1.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Html position={[0, height + 0.5, 0]} center>
        <div style={{ background: 'rgba(0,0,0,0.8)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
          {label}: {count}
        </div>
      </Html>
    </group>
  );
}

function Scene({ matrix }: { matrix: number[][] }) {
  return (
    <>
      <MatrixCell position={[-1.2, 0, -1.2]} count={matrix[0][0]} label="TN" isCorrect={true} />
      <MatrixCell position={[1.2, 0, -1.2]} count={matrix[0][1]} label="FP" isCorrect={false} />
      <MatrixCell position={[-1.2, 0, 1.2]} count={matrix[1][0]} label="FN" isCorrect={false} />
      <MatrixCell position={[1.2, 0, 1.2]} count={matrix[1][1]} label="TP" isCorrect={true} />
      
      {/* Labels */}
      <Html position={[0, 0, -3]} center>
        <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>← Predicted →</div>
      </Html>
      <Html position={[-3.5, 0, 0]} center>
        <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', transform: 'rotate(-90deg)' }}>← Actual →</div>
      </Html>
      
      <OrbitControls enableZoom={true} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
    </>
  );
}

export default function ConfusionMatrix3D() {
  const [matrix, setMatrix] = useState([[0, 0], [0, 0]]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const runPredictions = () => {
    if (isRunning) return;
    setIsRunning(true);
    setMatrix([[0, 0], [0, 0]]);
    setCurrentIdx(0);
    
    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= samplePredictions.length) {
        clearInterval(interval);
        setIsRunning(false);
        return;
      }
      
      const pred = samplePredictions[idx];
      setMatrix(prev => {
        const newMatrix = prev.map(row => [...row]);
        newMatrix[pred.actual][pred.predicted]++;
        return newMatrix;
      });
      setCurrentIdx(idx + 1);
      idx++;
    }, 300);
  };

  const reset = () => {
    setMatrix([[0, 0], [0, 0]]);
    setCurrentIdx(0);
    setIsRunning(false);
  };

  const tn = matrix[0][0], fp = matrix[0][1], fn = matrix[1][0], tp = matrix[1][1];
  const total = tn + fp + fn + tp;
  const accuracy = total > 0 ? ((tp + tn) / total * 100).toFixed(0) : '0';
  const precision = (tp + fp) > 0 ? (tp / (tp + fp) * 100).toFixed(0) : '0';
  const recall = (tp + fn) > 0 ? (tp / (tp + fn) * 100).toFixed(0) : '0';

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0f172a', borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 8, 6], fov: 50 }}>
        <Scene matrix={matrix} />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        background: 'rgba(255,255,255,0.95)',
        padding: '16px',
        borderRadius: '12px',
      }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={runPredictions} disabled={isRunning} style={{
            padding: '8px 16px', background: isRunning ? '#9ca3af' : '#4f46e5',
            color: 'white', border: 'none', borderRadius: '8px', cursor: isRunning ? 'default' : 'pointer'
          }}>
            {isRunning ? `Processing ${currentIdx}/${samplePredictions.length}...` : '▶ Run Predictions'}
          </button>
          <button onClick={reset} style={{
            padding: '8px 16px', background: '#6b7280',
            color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
          }}>
            ↺ Reset
          </button>
          
          {total > 0 && (
            <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto', fontSize: '14px' }}>
              <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px' }}>
                Accuracy: {accuracy}%
              </span>
              <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '4px' }}>
                Precision: {precision}%
              </span>
              <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '4px' }}>
                Recall: {recall}%
              </span>
            </div>
          )}
        </div>
        <div style={{ fontSize: '14px', color: '#374151', background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
          {total === 0 
            ? "📊 Click 'Run Predictions' to see how a confusion matrix builds up from model predictions."
            : `✅ Matrix shows: TN=${tn} (correct negative), FP=${fp} (false alarm), FN=${fn} (missed), TP=${tp} (correct positive)`
          }
        </div>
      </div>
    </div>
  );
}
