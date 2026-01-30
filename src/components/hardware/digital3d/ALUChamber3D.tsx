"use client";

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Html, 
  Float,
  MeshTransmissionMaterial,
  Sparkles,
  Text3D,
  Center
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

type ALUOperation = 'ADD' | 'SUB' | 'AND' | 'OR' | 'XOR' | 'NOT' | 'SHL' | 'SHR';

interface OperationConfig {
  name: ALUOperation;
  symbol: string;
  color: string;
  compute: (a: number, b: number) => number;
}

const OPERATIONS: OperationConfig[] = [
  { name: 'ADD', symbol: '+', color: '#22c55e', compute: (a, b) => (a + b) & 0xFF },
  { name: 'SUB', symbol: '-', color: '#ef4444', compute: (a, b) => (a - b) & 0xFF },
  { name: 'AND', symbol: '&', color: '#3b82f6', compute: (a, b) => a & b },
  { name: 'OR', symbol: '|', color: '#8b5cf6', compute: (a, b) => a | b },
  { name: 'XOR', symbol: '^', color: '#f97316', compute: (a, b) => a ^ b },
  { name: 'SHL', symbol: '<<', color: '#14b8a6', compute: (a, b) => (a << (b & 0x7)) & 0xFF },
  { name: 'SHR', symbol: '>>', color: '#6366f1', compute: (a, b) => (a >> (b & 0x7)) & 0xFF },
];

// Particle that represents a data unit
function DataParticle({ 
  position, 
  targetPosition,
  color,
  delay = 0,
  onComplete
}: { 
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  color: string;
  delay?: number;
  onComplete?: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(-delay);
  const completed = useRef(false);
  
  useFrame((_, delta) => {
    if (progress < 0) {
      setProgress(p => p + delta * 2);
      return;
    }
    
    if (progress >= 1) {
      if (!completed.current && onComplete) {
        completed.current = true;
        onComplete();
      }
      return;
    }
    
    setProgress(p => Math.min(1, p + delta * 1.5));
    
    if (ref.current) {
      ref.current.position.lerpVectors(position, targetPosition, progress);
      ref.current.scale.setScalar(1 - progress * 0.3);
    }
  });

  if (progress < 0) return null;

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={1 - progress * 0.5} />
    </mesh>
  );
}

// Stream of particles from input to ALU
function DataStream({ 
  start, 
  end, 
  value, 
  color, 
  active 
}: { 
  start: [number, number, number];
  end: [number, number, number];
  value: number;
  color: string;
  active: boolean;
}) {
  const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end]);
  
  // Number of particles based on value
  const particleCount = Math.min(Math.max(Math.floor(value / 10), 3), 20);
  
  if (!active || value === 0) return null;
  
  return (
    <group>
      {/* Glowing connection line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([...start, ...end])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.4} />
      </line>
      
      {/* Particles */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <DataParticle
          key={`${value}-${i}`}
          position={startVec.clone()}
          targetPosition={endVec.clone()}
          color={color}
          delay={i * 0.2}
        />
      ))}
    </group>
  );
}

// The main ALU chamber structure
function ALUStructure({ 
  operation, 
  isProcessing,
  result 
}: { 
  operation: ALUOperation;
  isProcessing: boolean;
  result: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const opConfig = OPERATIONS.find(o => o.name === operation)!;
  
  useFrame(({ clock }) => {
    if (!meshRef.current || !innerRef.current) return;
    
    // Rotate the outer shell slowly
    meshRef.current.rotation.y = clock.elapsedTime * 0.2;
    
    // Inner core rotates faster when processing
    if (isProcessing) {
      innerRef.current.rotation.y = clock.elapsedTime * 2;
      innerRef.current.rotation.x = clock.elapsedTime * 1.5;
    }
    
    // Pulse effect
    const pulse = 1 + Math.sin(clock.elapsedTime * 3) * 0.05;
    innerRef.current.scale.setScalar(isProcessing ? pulse : 0.8);
  });

  return (
    <group>
      {/* Outer shell - octahedron */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[2.5, 0]} />
        <MeshTransmissionMaterial
          color={opConfig.color}
          transmission={0.6}
          thickness={0.5}
          roughness={0.1}
          metalness={0.5}
          emissive={opConfig.color}
          emissiveIntensity={isProcessing ? 0.5 : 0.1}
        />
      </mesh>
      
      {/* Inner core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={opConfig.color}
          emissive={opConfig.color}
          emissiveIntensity={isProcessing ? 2 : 0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Operation symbol */}
      <Html position={[0, 0, 0]} center>
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#fff',
          textShadow: `0 0 20px ${opConfig.color}`,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {opConfig.symbol}
        </div>
      </Html>
      
      {/* Sparkles when processing */}
      {isProcessing && (
        <Sparkles
          count={50}
          scale={5}
          size={3}
          speed={2}
          color={opConfig.color}
        />
      )}
      
      {/* Result display */}
      <Html position={[0, 4, 0]} center>
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          border: `2px solid ${opConfig.color}`,
          borderRadius: '12px',
          padding: '12px 24px',
          textAlign: 'center',
          boxShadow: `0 0 30px ${opConfig.color}`,
        }}>
          <div style={{
            fontSize: '10px',
            color: '#888',
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: '4px',
          }}>
            RESULT
          </div>
          <div style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#fff',
            fontFamily: "'JetBrains Mono', monospace",
            textShadow: `0 0 15px ${opConfig.color}`,
          }}>
            {result}
          </div>
          <div style={{
            fontSize: '11px',
            color: opConfig.color,
            fontFamily: "'JetBrains Mono', monospace",
            marginTop: '4px',
          }}>
            0x{result.toString(16).toUpperCase().padStart(2, '0')} | {result.toString(2).padStart(8, '0')}
          </div>
        </div>
      </Html>
    </group>
  );
}

// Input port with value display
function InputPort({ 
  position, 
  label, 
  value, 
  color,
  onChange
}: { 
  position: [number, number, number];
  label: string;
  value: number;
  color: string;
  onChange: (v: number) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = clock.elapsedTime * 0.5;
  });

  return (
    <group position={position}>
      {/* Port structure */}
      <Float speed={2} floatIntensity={0.3}>
        <mesh ref={meshRef}>
          <torusGeometry args={[0.8, 0.2, 8, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Center sphere */}
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={value > 0 ? 1 : 0.2}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>
      
      {/* Label and value */}
      <Html position={[0, -1.5, 0]} center>
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          border: `1px solid ${color}`,
          borderRadius: '8px',
          padding: '8px 16px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '12px',
            color: color,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 'bold',
          }}>
            {label}
          </div>
          <input
            type="number"
            min={0}
            max={255}
            value={value}
            onChange={(e) => onChange(Math.min(255, Math.max(0, parseInt(e.target.value) || 0)))}
            style={{
              width: '60px',
              background: 'transparent',
              border: 'none',
              borderBottom: `1px solid ${color}`,
              color: '#fff',
              fontSize: '20px',
              fontFamily: "'JetBrains Mono', monospace",
              textAlign: 'center',
              outline: 'none',
              marginTop: '4px',
            }}
          />
        </div>
      </Html>
      
      {value > 0 && <Sparkles count={15} scale={2} size={2} color={color} />}
    </group>
  );
}

// Main component
export function ALUChamber3D() {
  const [inputA, setInputA] = useState(42);
  const [inputB, setInputB] = useState(15);
  const [operation, setOperation] = useState<ALUOperation>('ADD');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const opConfig = OPERATIONS.find(o => o.name === operation)!;
  const result = opConfig.compute(inputA, inputB);

  // Trigger processing animation
  const handleCalculate = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 1500);
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '650px', 
      background: '#0A0A1E', 
      borderRadius: '16px', 
      overflow: 'hidden', 
      position: 'relative' 
    }}>
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 5, 15], fov: 50 }}>
        <color attach="background" args={['#0A0A1E']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00AAFF" />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#FF00FF" />
        <pointLight position={[0, -10, 0]} intensity={0.3} color={opConfig.color} />
        
        {/* Grid */}
        <gridHelper args={[40, 40, '#1a1a3e', '#1a1a3e']} position={[0, -4, 0]} />
        
        {/* Input A */}
        <InputPort
          position={[-6, 0, 0]}
          label="INPUT A"
          value={inputA}
          color="#00AAFF"
          onChange={setInputA}
        />
        
        {/* Input B */}
        <InputPort
          position={[6, 0, 0]}
          label="INPUT B"
          value={inputB}
          color="#00FF88"
          onChange={setInputB}
        />
        
        {/* Data streams */}
        <DataStream
          start={[-5, 0, 0]}
          end={[-2.5, 0, 0]}
          value={inputA}
          color="#00AAFF"
          active={isProcessing}
        />
        <DataStream
          start={[5, 0, 0]}
          end={[2.5, 0, 0]}
          value={inputB}
          color="#00FF88"
          active={isProcessing}
        />
        
        {/* ALU Chamber */}
        <ALUStructure
          operation={operation}
          isProcessing={isProcessing}
          result={result}
        />
        
        <OrbitControls
          enablePan={false}
          minDistance={12}
          maxDistance={25}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
        
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.2} />
        </EffectComposer>
      </Canvas>
      
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
      }}>
        <h2 style={{
          margin: 0,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '22px',
          color: '#00FFFF',
          textShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
        }}>
          ALU COMPUTATION CHAMBER
        </h2>
        <p style={{
          margin: '8px 0 0',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          color: '#666688',
        }}>
          Select operation • Adjust inputs • Watch computation
        </p>
      </div>
      
      {/* Operation selector */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 10,
      }}>
        {OPERATIONS.map(op => (
          <button
            key={op.name}
            onClick={() => { setOperation(op.name); handleCalculate(); }}
            style={{
              padding: '10px 16px',
              background: operation === op.name ? op.color : 'rgba(30, 30, 60, 0.9)',
              border: `1px solid ${operation === op.name ? op.color : '#333'}`,
              borderRadius: '8px',
              color: '#fff',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: operation === op.name ? `0 0 20px ${op.color}` : 'none',
            }}
          >
            {op.symbol} {op.name}
          </button>
        ))}
      </div>
      
      {/* Calculate button */}
      <button
        onClick={handleCalculate}
        disabled={isProcessing}
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 32px',
          background: isProcessing ? '#333' : 'linear-gradient(135deg, #00AAFF, #FF00FF)',
          border: 'none',
          borderRadius: '12px',
          color: '#fff',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          zIndex: 10,
          boxShadow: isProcessing ? 'none' : '0 0 30px rgba(0, 170, 255, 0.5)',
        }}
      >
        {isProcessing ? 'COMPUTING...' : '⚡ EXECUTE'}
      </button>
      
      {/* Expression display */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 10,
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '16px',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>EXPRESSION</div>
        <div style={{ fontSize: '20px', color: '#fff' }}>
          <span style={{ color: '#00AAFF' }}>{inputA}</span>
          {' '}
          <span style={{ color: opConfig.color }}>{opConfig.symbol}</span>
          {' '}
          <span style={{ color: '#00FF88' }}>{inputB}</span>
          {' = '}
          <span style={{ color: '#FF00FF', fontWeight: 'bold' }}>{result}</span>
        </div>
      </div>
    </div>
  );
}

export default ALUChamber3D;
