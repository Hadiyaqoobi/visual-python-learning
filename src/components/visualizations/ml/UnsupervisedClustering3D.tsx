"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useState, useMemo } from 'react';

const COLORS = ['#ef4444', '#22c55e', '#3b82f6'];

function generateData() {
  const points: { x: number; y: number }[] = [];
  // Cluster 1 - top left
  for (let i = 0; i < 10; i++) {
    points.push({ x: -2 + Math.random() * 1.5, y: 2 + Math.random() * 1.5 });
  }
  // Cluster 2 - top right
  for (let i = 0; i < 10; i++) {
    points.push({ x: 2 + Math.random() * 1.5, y: 2 + Math.random() * 1.5 });
  }
  // Cluster 3 - bottom center
  for (let i = 0; i < 10; i++) {
    points.push({ x: -0.5 + Math.random() * 1.5, y: -2 + Math.random() * 1.5 });
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

function Centroid({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <octahedronGeometry args={[0.25, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </mesh>
  );
}

function Scene({ clusters, centroids }: { clusters: number[]; centroids: { x: number; y: number }[] }) {
  const data = useMemo(() => generateData(), []);

  return (
    <>
      {data.map((point, i) => (
        <DataPoint
          key={i}
          position={[point.x, point.y, 0]}
          color={clusters[i] !== undefined ? COLORS[clusters[i]] : '#9ca3af'}
        />
      ))}
      
      {centroids.map((c, i) => (
        <Centroid key={`c-${i}`} position={[c.x, c.y, 0]} color={COLORS[i]} />
      ))}
      
      <OrbitControls enableZoom={true} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <gridHelper args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} />
    </>
  );
}

export default function UnsupervisedClustering3D() {
  const data = useMemo(() => generateData(), []);
  const [step, setStep] = useState(0);
  const [clusters, setClusters] = useState<number[]>([]);
  const [centroids, setCentroids] = useState<{ x: number; y: number }[]>([]);
  const [iteration, setIteration] = useState(0);

  const initCentroids = () => {
    setCentroids([
      { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2 },
      { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2 },
      { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2 },
    ]);
    setStep(1);
    setIteration(1);
  };

  const assignClusters = () => {
    const newClusters = data.map(p => {
      let minDist = Infinity, nearest = 0;
      centroids.forEach((c, i) => {
        const d = Math.hypot(p.x - c.x, p.y - c.y);
        if (d < minDist) { minDist = d; nearest = i; }
      });
      return nearest;
    });
    setClusters(newClusters);
    setStep(2);
  };

  const updateCentroids = () => {
    const newCentroids = centroids.map((_, idx) => {
      const pts = data.filter((_, i) => clusters[i] === idx);
      if (pts.length === 0) return centroids[idx];
      return {
        x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
        y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
      };
    });
    setCentroids(newCentroids);
    setIteration(i => i + 1);
    setStep(1);
  };

  const reset = () => {
    setStep(0);
    setClusters([]);
    setCentroids([]);
    setIteration(0);
  };

  const descriptions = [
    "📊 Unlabeled data - no classes! Click 'Initialize' to place random centroids.",
    `🎯 Iteration ${iteration}: Centroids placed. Click 'Assign' to color points by nearest centroid.`,
    `✅ Iteration ${iteration}: Points assigned! Click 'Update' to move centroids to cluster centers.`,
  ];

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0f172a', borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <Scene clusters={clusters} centroids={centroids} />
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
          <button onClick={initCentroids} disabled={step !== 0} style={{
            padding: '8px 16px', background: step === 0 ? '#4f46e5' : '#9ca3af',
            color: 'white', border: 'none', borderRadius: '8px', cursor: step === 0 ? 'pointer' : 'default'
          }}>
            1. Initialize
          </button>
          <button onClick={assignClusters} disabled={step !== 1} style={{
            padding: '8px 16px', background: step === 1 ? '#22c55e' : '#9ca3af',
            color: 'white', border: 'none', borderRadius: '8px', cursor: step === 1 ? 'pointer' : 'default'
          }}>
            2. Assign
          </button>
          <button onClick={updateCentroids} disabled={step !== 2} style={{
            padding: '8px 16px', background: step === 2 ? '#f59e0b' : '#9ca3af',
            color: 'white', border: 'none', borderRadius: '8px', cursor: step === 2 ? 'pointer' : 'default'
          }}>
            3. Update
          </button>
          <button onClick={reset} style={{
            padding: '8px 16px', background: '#6b7280',
            color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
          }}>
            ↺ Reset
          </button>
        </div>
        <div style={{ fontSize: '14px', color: '#374151', background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
          {descriptions[step]}
        </div>
      </div>
    </div>
  );
}
