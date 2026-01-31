"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import { useState, useMemo } from 'react';
import * as THREE from 'three';

function generateData() {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const x = (i / 19) * 8 - 4;
    const y = Math.sin(x * 0.8) * 2 + (Math.random() - 0.5) * 0.8;
    points.push({ x, y });
  }
  return points;
}

function generateCurve(type: 'underfit' | 'goodfit' | 'overfit', data: { x: number; y: number }[]) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = (i / 100) * 8 - 4;
    let y: number;
    if (type === 'underfit') {
      y = x * 0.15;
    } else if (type === 'goodfit') {
      y = Math.sin(x * 0.8) * 2;
    } else {
      y = Math.sin(x * 0.8) * 2;
      data.forEach(p => {
        const dist = Math.abs(x - p.x);
        if (dist < 0.4) {
          y += (p.y - Math.sin(p.x * 0.8) * 2) * Math.exp(-dist * 8);
        }
      });
    }
    points.push(new THREE.Vector3(x, y, 0));
  }
  return points;
}

function DataPoint({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.12, 32, 32]} />
      <meshStandardMaterial color="#3b82f6" />
    </mesh>
  );
}

function Scene({ activeModel, data }: { activeModel: string; data: { x: number; y: number }[] }) {
  const underfitCurve = useMemo(() => generateCurve('underfit', data), [data]);
  const goodfitCurve = useMemo(() => generateCurve('goodfit', data), [data]);
  const overfitCurve = useMemo(() => generateCurve('overfit', data), [data]);

  return (
    <>
      {data.map((p, i) => (
        <DataPoint key={i} position={[p.x, p.y, 0]} />
      ))}
      
      {(activeModel === 'underfit' || activeModel === 'all') && (
        <Line points={underfitCurve} color="#ef4444" lineWidth={3} />
      )}
      {(activeModel === 'goodfit' || activeModel === 'all') && (
        <Line points={goodfitCurve} color="#22c55e" lineWidth={3} />
      )}
      {(activeModel === 'overfit' || activeModel === 'all') && (
        <Line points={overfitCurve} color="#f59e0b" lineWidth={3} />
      )}
      
      <OrbitControls enableZoom={true} enableRotate={false} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <gridHelper args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} />
    </>
  );
}

export default function OverfittingUnderfitting3D() {
  const data = useMemo(() => generateData(), []);
  const [activeModel, setActiveModel] = useState('goodfit');

  const descriptions: Record<string, string> = {
    underfit: "🔴 UNDERFITTING: Model too simple (straight line). High bias - misses the curve pattern entirely.",
    goodfit: "🟢 GOOD FIT: Model captures the true sine wave pattern without memorizing noise. Generalizes well!",
    overfit: "🟡 OVERFITTING: Model too complex - wiggles through every point including noise. Won't generalize.",
    all: "📊 Comparing all three: Red=Underfit, Green=Good Fit, Yellow=Overfit. Notice how Good Fit balances complexity.",
  };

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0f172a', borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <Scene activeModel={activeModel} data={data} />
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
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveModel('underfit')} style={{
            padding: '8px 16px', background: activeModel === 'underfit' ? '#ef4444' : '#fecaca',
            color: activeModel === 'underfit' ? 'white' : '#991b1b', border: 'none', borderRadius: '8px', cursor: 'pointer'
          }}>
            Underfit
          </button>
          <button onClick={() => setActiveModel('goodfit')} style={{
            padding: '8px 16px', background: activeModel === 'goodfit' ? '#22c55e' : '#bbf7d0',
            color: activeModel === 'goodfit' ? 'white' : '#166534', border: 'none', borderRadius: '8px', cursor: 'pointer'
          }}>
            Good Fit
          </button>
          <button onClick={() => setActiveModel('overfit')} style={{
            padding: '8px 16px', background: activeModel === 'overfit' ? '#f59e0b' : '#fef3c7',
            color: activeModel === 'overfit' ? 'white' : '#92400e', border: 'none', borderRadius: '8px', cursor: 'pointer'
          }}>
            Overfit
          </button>
          <button onClick={() => setActiveModel('all')} style={{
            padding: '8px 16px', background: activeModel === 'all' ? '#4f46e5' : '#e0e7ff',
            color: activeModel === 'all' ? 'white' : '#3730a3', border: 'none', borderRadius: '8px', cursor: 'pointer'
          }}>
            Show All
          </button>
        </div>
        <div style={{ fontSize: '14px', color: '#374151', background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
          {descriptions[activeModel]}
        </div>
      </div>
    </div>
  );
}
