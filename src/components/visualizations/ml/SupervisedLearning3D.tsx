"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useState, useMemo } from 'react';

// Generate sample data
function generateData() {
  const points: { x: number; y: number; label: number }[] = [];
  
  // Class 0 (blue) - lower left cluster
  for (let i = 0; i < 15; i++) {
    points.push({
      x: -2 + Math.random() * 2,
      y: -2 + Math.random() * 2,
      label: 0,
    });
  }
  
  // Class 1 (orange) - upper right cluster
  for (let i = 0; i < 15; i++) {
    points.push({
      x: 1 + Math.random() * 2,
      y: 1 + Math.random() * 2,
      label: 1,
    });
  }
  
  return points;
}

function DataPoint({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function DecisionBoundary({ visible }: { visible: boolean }) {
  if (!visible) return null;
  
  return (
    <mesh position={[0, 0, -0.1]} rotation={[0, 0, Math.PI / 4]}>
      <planeGeometry args={[12, 0.05]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
  );
}

function Scene({ step }: { step: number }) {
  const data = useMemo(() => generateData(), []);

  return (
    <>
      {/* Data points */}
      {data.map((point, i) => (
        <DataPoint
          key={i}
          position={[point.x, point.y, 0]}
          color={point.label === 0 ? '#3b82f6' : '#f97316'}
        />
      ))}
      
      {/* Decision boundary */}
      <DecisionBoundary visible={step >= 2} />
      
      {/* Legend */}
      <Html position={[-4, 3.5, 0]}>
        <div style={{ 
          background: 'rgba(0,0,0,0.8)', 
          padding: '12px', 
          borderRadius: '8px',
          color: 'white',
          fontSize: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div>
            <span>Class 0 (Negative)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f97316' }}></div>
            <span>Class 1 (Positive)</span>
          </div>
        </div>
      </Html>
      
      <OrbitControls enableZoom={true} enablePan={true} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <gridHelper args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} />
    </>
  );
}

export default function SupervisedLearning3D() {
  const [step, setStep] = useState(0);

  const descriptions = [
    "📊 This shows LABELED data - each point has a known class (blue=0, orange=1). Click 'Train Model' to learn a boundary.",
    "🔄 Training... The model is finding a line that separates the two classes.",
    "✅ Trained! The green line is the decision boundary. Points on left → Class 0, points on right → Class 1.",
  ];

  const handleTrain = () => {
    setStep(1);
    setTimeout(() => setStep(2), 1000);
  };

  const reset = () => setStep(0);

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0f172a', borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <Scene step={step} />
      </Canvas>
      
      {/* Controls */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        background: 'rgba(255,255,255,0.95)',
        padding: '16px',
        borderRadius: '12px',
      }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button
            onClick={handleTrain}
            disabled={step > 0}
            style={{
              padding: '8px 16px',
              background: step > 0 ? '#9ca3af' : '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: step > 0 ? 'default' : 'pointer',
              fontWeight: 500,
            }}
          >
            {step === 0 ? '▶ Train Model' : step === 1 ? '⏳ Training...' : '✓ Trained'}
          </button>
          <button
            onClick={reset}
            style={{
              padding: '8px 16px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            ↺ Reset
          </button>
        </div>
        <div style={{
          fontSize: '14px',
          color: '#374151',
          background: '#f3f4f6',
          padding: '12px',
          borderRadius: '8px',
        }}>
          {descriptions[step]}
        </div>
      </div>
    </div>
  );
}
