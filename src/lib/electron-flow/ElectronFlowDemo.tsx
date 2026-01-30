"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { ElectronFlowSystem, CPU_PATHS, OPERATION_PATHS } from './ElectronFlowSystem';

// CPU Component visualization
function CPUComponent({ 
  position, 
  size, 
  color, 
  label, 
  active = false,
  icon
}: { 
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  label: string;
  active?: boolean;
  icon: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current && active) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 4) * 0.05;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh ref={meshRef}>
          <boxGeometry args={size} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={active ? 0.8 : 0.2}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* Glowing edges */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
          <lineBasicMaterial color={active ? '#00FFFF' : '#333'} linewidth={2} />
        </lineSegments>
      </Float>
      
      {/* Label */}
      <Html position={[0, size[1] / 2 + 0.5, 0]} center>
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '6px 12px',
          borderRadius: '6px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          color: active ? '#00FFFF' : '#888',
          whiteSpace: 'nowrap',
          border: active ? '1px solid #00FFFF' : '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span>{icon}</span>
          <span>{label}</span>
        </div>
      </Html>
    </group>
  );
}

// Path visualization
function PathVisualization({ pathId, active }: { pathId: string; active: boolean }) {
  const path = CPU_PATHS[pathId];
  if (!path) return null;
  
  const points = path.waypoints;
  const curve = new THREE.CatmullRomCurve3(points);
  const curvePoints = curve.getPoints(50);
  
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={curvePoints.length}
          array={new Float32Array(curvePoints.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial 
        color={active ? path.color : '#222'} 
        transparent 
        opacity={active ? 0.6 : 0.2}
        linewidth={2}
      />
    </line>
  );
}

// Electron flow scene
function ElectronFlowScene({ 
  flowSystem,
  activeOperation,
  activePaths
}: { 
  flowSystem: ElectronFlowSystem;
  activeOperation: string | null;
  activePaths: string[];
}) {
  const { scene } = useThree();
  
  useEffect(() => {
    scene.add(flowSystem.mesh);
    return () => {
      scene.remove(flowSystem.mesh);
    };
  }, [flowSystem, scene]);
  
  useFrame(({ clock }, delta) => {
    flowSystem.update(delta, clock.elapsedTime);
  });

  const isComponentActive = (componentPaths: string[]) => {
    return componentPaths.some(p => activePaths.includes(p));
  };

  return (
    <group>
      {/* CPU Components */}
      <CPUComponent
        position={[-4, 2, 0]}
        size={[2, 1.2, 1]}
        color="#8B5CF6"
        label="Control Unit"
        icon="🎛️"
        active={isComponentActive(['INPUT_TO_CONTROL', 'CONTROL_TO_ALU', 'CONTROL_TO_REGISTER'])}
      />
      
      <CPUComponent
        position={[2, 0, 0]}
        size={[2.5, 1.5, 1]}
        color="#F97316"
        label="ALU"
        icon="➕"
        active={isComponentActive(['CONTROL_TO_ALU', 'REGISTER_TO_ALU', 'ALU_TO_REGISTER'])}
      />
      
      <CPUComponent
        position={[4, -2, 0]}
        size={[1.8, 1, 1]}
        color="#22C55E"
        label="Registers"
        icon="📊"
        active={isComponentActive(['CONTROL_TO_REGISTER', 'ALU_TO_REGISTER', 'REGISTER_TO_ALU', 'MEMORY_TO_REGISTER', 'REGISTER_TO_MEMORY'])}
      />
      
      <CPUComponent
        position={[0, -4, 0]}
        size={[3, 1, 1]}
        color="#3B82F6"
        label="Memory"
        icon="💾"
        active={isComponentActive(['MEMORY_TO_REGISTER', 'REGISTER_TO_MEMORY'])}
      />
      
      <CPUComponent
        position={[-6, 0, 0]}
        size={[1.5, 1, 1]}
        color="#00AAFF"
        label="Input"
        icon="📥"
        active={isComponentActive(['INPUT_TO_CONTROL'])}
      />
      
      {/* Path visualizations */}
      {Object.keys(CPU_PATHS).map(pathId => (
        <PathVisualization 
          key={pathId} 
          pathId={pathId} 
          active={activePaths.includes(pathId)}
        />
      ))}
      
      {/* Grid */}
      <gridHelper args={[20, 20, '#1a1a3e', '#1a1a3e']} position={[0, -5, 0]} />
    </group>
  );
}

// Main component
export function ElectronFlowDemo() {
  const flowSystemRef = useRef<ElectronFlowSystem | null>(null);
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [activePaths, setActivePaths] = useState<string[]>([]);
  const [electronCount, setElectronCount] = useState(0);
  
  // Initialize flow system
  useEffect(() => {
    flowSystemRef.current = new ElectronFlowSystem(5000);
    
    return () => {
      flowSystemRef.current?.dispose();
    };
  }, []);
  
  // Update electron count display
  useEffect(() => {
    const interval = setInterval(() => {
      if (flowSystemRef.current) {
        setElectronCount(flowSystemRef.current.getElectronCount());
        setActivePaths(flowSystemRef.current.getActivePaths());
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  const triggerOperation = useCallback((op: string) => {
    if (flowSystemRef.current) {
      setActiveOperation(op);
      flowSystemRef.current.triggerOperation(op);
      
      // Clear active operation after flow completes
      setTimeout(() => setActiveOperation(null), 1500);
    }
  }, []);
  
  const operations = [
    { id: 'ASSIGNMENT', label: 'x = 5', icon: '📝', color: '#8B5CF6' },
    { id: 'ADDITION', label: 'x + y', icon: '➕', color: '#22C55E' },
    { id: 'MULTIPLICATION', label: 'x × y', icon: '✖️', color: '#F97316' },
    { id: 'MEMORY_READ', label: 'Load', icon: '📖', color: '#3B82F6' },
    { id: 'MEMORY_WRITE', label: 'Store', icon: '💾', color: '#3B82F6' },
    { id: 'BITWISE_AND', label: 'AND', icon: '&', color: '#EC4899' },
    { id: 'BITWISE_OR', label: 'OR', icon: '|', color: '#EC4899' },
    { id: 'SHIFT_LEFT', label: '<<', icon: '⬅️', color: '#14B8A6' },
  ];

  if (!flowSystemRef.current) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '700px', 
      background: '#0A0A1E', 
      borderRadius: '16px', 
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Canvas camera={{ position: [0, 5, 12], fov: 50 }}>
        <color attach="background" args={['#0A0A1E']} />
        
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00AAFF" />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#FF00FF" />
        
        <ElectronFlowScene 
          flowSystem={flowSystemRef.current}
          activeOperation={activeOperation}
          activePaths={activePaths}
        />
        
        <OrbitControls 
          enablePan={false}
          minDistance={8}
          maxDistance={25}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
        
        <EffectComposer>
          <Bloom 
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
      
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '22px',
          color: '#00FFFF',
          textShadow: '0 0 20px rgba(0,255,255,0.5)',
        }}>
          ELECTRON FLOW VISUALIZATION
        </h2>
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#666' }}>
          Watch data flow through CPU components as electron particles
        </p>
      </div>
      
      {/* Stats */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '8px',
        padding: '12px 16px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px',
        border: '1px solid rgba(0,255,255,0.2)',
      }}>
        <div style={{ color: '#00FFFF', marginBottom: '8px' }}>
          ⚡ Electrons: <span style={{ color: '#fff' }}>{electronCount}</span>
        </div>
        <div style={{ color: '#8B5CF6' }}>
          🎯 Operation: <span style={{ color: '#fff' }}>{activeOperation || 'Idle'}</span>
        </div>
        <div style={{ color: '#22C55E', marginTop: '8px' }}>
          📍 Active Paths: <span style={{ color: '#fff' }}>{activePaths.length}</span>
        </div>
      </div>
      
      {/* Operation buttons */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '90%',
      }}>
        {operations.map(op => (
          <button
            key={op.id}
            onClick={() => triggerOperation(op.id)}
            disabled={activeOperation === op.id}
            style={{
              padding: '10px 16px',
              background: activeOperation === op.id 
                ? op.color 
                : 'rgba(255,255,255,0.1)',
              border: `1px solid ${activeOperation === op.id ? op.color : '#333'}`,
              borderRadius: '8px',
              color: '#fff',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              cursor: activeOperation === op.id ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              boxShadow: activeOperation === op.id ? `0 0 20px ${op.color}` : 'none',
            }}
          >
            <span>{op.icon}</span>
            <span>{op.label}</span>
          </button>
        ))}
      </div>
      
      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '8px',
        padding: '12px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '10px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ color: '#666', marginBottom: '8px' }}>COMPONENTS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { color: '#8B5CF6', label: 'Control Unit' },
            { color: '#F97316', label: 'ALU' },
            { color: '#22C55E', label: 'Registers' },
            { color: '#3B82F6', label: 'Memory' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '2px', 
                background: item.color 
              }} />
              <span style={{ color: '#888' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ElectronFlowDemo;
