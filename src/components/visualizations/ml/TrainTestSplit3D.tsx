"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useState, useMemo } from 'react';

function generateData() {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < 50; i++) {
    points.push({
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 6,
    });
  }
  return points;
}

function DataPoint({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.12, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Scene({ data, assignments, step }: { data: { x: number; y: number }[]; assignments: string[]; step: number }) {
  const getPosition = (point: { x: number; y: number }, idx: number): [number, number, number] => {
    if (step < 2) return [point.x, point.y, 0];
    const set = assignments[idx];
    if (set === 'train') return [point.x * 0.35 - 3.5, point.y * 0.5, 0];
    if (set === 'val') return [point.x * 0.25, point.y * 0.4, 0];
    return [point.x * 0.35 + 3.5, point.y * 0.5, 0];
  };

  const getColor = (set: string) => {
    if (set === 'train') return '#22c55e';
    if (set === 'val') return '#f59e0b';
    if (set === 'test') return '#3b82f6';
    return '#9ca3af';
  };

  return (
    <>
      {data.map((p, i) => (
        <DataPoint key={i} position={getPosition(p, i)} color={getColor(assignments[i])} />
      ))}
      
      {step >= 2 && (
        <>
          <Html position={[-3.5, 3, 0]} center>
            <div style={{ background: '#22c55e', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' }}>
              Train (60%)
            </div>
          </Html>
          <Html position={[0, 2.5, 0]} center>
            <div style={{ background: '#f59e0b', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' }}>
              Validation (20%)
            </div>
          </Html>
          <Html position={[3.5, 3, 0]} center>
            <div style={{ background: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' }}>
              Test (20%)
            </div>
          </Html>
        </>
      )}
      
      <OrbitControls enableZoom={true} enableRotate={false} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
    </>
  );
}

export default function TrainTestSplit3D() {
  const data = useMemo(() => generateData(), []);
  const [step, setStep] = useState(0);
  const [assignments, setAssignments] = useState<string[]>(Array(50).fill(''));

  const split = () => {
    setStep(1);
    setTimeout(() => {
      const shuffled = [...Array(50).keys()].sort(() => Math.random() - 0.5);
      const newAssignments = Array(50).fill('');
      shuffled.slice(0, 30).forEach(i => newAssignments[i] = 'train');
      shuffled.slice(30, 40).forEach(i => newAssignments[i] = 'val');
      shuffled.slice(40, 50).forEach(i => newAssignments[i] = 'test');
      setAssignments(newAssignments);
      setStep(2);
    }, 500);
  };

  const reset = () => {
    setStep(0);
    setAssignments(Array(50).fill(''));
  };

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0f172a', borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
        <Scene data={data} assignments={assignments} step={step} />
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
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button onClick={split} disabled={step > 0} style={{
            padding: '8px 16px', background: step === 0 ? '#4f46e5' : '#9ca3af',
            color: 'white', border: 'none', borderRadius: '8px', cursor: step === 0 ? 'pointer' : 'default'
          }}>
            {step === 0 ? '▶ Split Data' : step === 1 ? '⏳ Shuffling...' : '✓ Split Complete'}
          </button>
          <button onClick={reset} style={{
            padding: '8px 16px', background: '#6b7280',
            color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
          }}>
            ↺ Reset
          </button>
        </div>
        <div style={{ fontSize: '14px', color: '#374151', background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
          {step === 0 && "📊 50 data points ready to split. Click 'Split Data' to randomly assign to Train/Validation/Test sets."}
          {step === 1 && "🔀 Shuffling data randomly..."}
          {step === 2 && "✅ Split complete! Train (green, 60%) for learning, Validation (orange, 20%) for tuning, Test (blue, 20%) for final evaluation."}
        </div>
      </div>
    </div>
  );
}
