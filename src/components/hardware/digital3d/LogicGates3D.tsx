"use client";

import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Html, 
  Float,
  MeshTransmissionMaterial,
  Sparkles,
  Trail
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

type GateType = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR';

interface GateConfig {
  name: GateType;
  color: string;
  compute: (a: boolean, b?: boolean) => boolean;
  description: string;
}

const GATES: GateConfig[] = [
  { name: 'AND', color: '#3b82f6', compute: (a, b) => a && (b ?? true), description: 'Both inputs must be 1' },
  { name: 'OR', color: '#22c55e', compute: (a, b) => a || (b ?? false), description: 'Either input can be 1' },
  { name: 'NOT', color: '#ef4444', compute: (a) => !a, description: 'Inverts the input' },
  { name: 'XOR', color: '#f97316', compute: (a, b) => a !== (b ?? false), description: 'Inputs must be different' },
  { name: 'NAND', color: '#8b5cf6', compute: (a, b) => !(a && (b ?? true)), description: 'NOT AND' },
  { name: 'NOR', color: '#ec4899', compute: (a, b) => !(a || (b ?? false)), description: 'NOT OR' },
];

// Electron particle that flows through the circuit
function Electron({ 
  startPos, 
  endPos, 
  color, 
  delay = 0,
  speed = 2
}: { 
  startPos: THREE.Vector3; 
  endPos: THREE.Vector3; 
  color: string;
  delay?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(-delay);
  
  useFrame((_, delta) => {
    setProgress(p => {
      const newP = p + delta * speed;
      return newP > 1 ? -0.5 : newP;
    });
    
    if (ref.current && progress >= 0 && progress <= 1) {
      ref.current.position.lerpVectors(startPos, endPos, progress);
      ref.current.visible = true;
    } else if (ref.current) {
      ref.current.visible = false;
    }
  });

  return (
    <mesh ref={ref} visible={false}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// Stream of electrons
function ElectronStream({ 
  start, 
  end, 
  active, 
  color 
}: { 
  start: [number, number, number]; 
  end: [number, number, number]; 
  active: boolean;
  color: string;
}) {
  const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end]);
  
  if (!active) return null;
  
  return (
    <group>
      {Array.from({ length: 8 }).map((_, i) => (
        <Electron 
          key={i} 
          startPos={startVec} 
          endPos={endVec} 
          color={color}
          delay={i * 0.15}
          speed={1.5}
        />
      ))}
      {/* Glowing line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([...start, ...end])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color={color} 
          transparent 
          opacity={0.3}
          linewidth={2}
        />
      </line>
    </group>
  );
}

// 3D Gate structure
function Gate3D({ 
  type, 
  position, 
  inputA, 
  inputB, 
  output,
  onInputAToggle,
  onInputBToggle
}: { 
  type: GateType;
  position: [number, number, number];
  inputA: boolean;
  inputB?: boolean;
  output: boolean;
  onInputAToggle: () => void;
  onInputBToggle?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const gateConfig = GATES.find(g => g.name === type)!;
  const isUnary = type === 'NOT';
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    // Pulse when output is active
    if (output) {
      const scale = 1 + Math.sin(clock.elapsedTime * 4) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      {/* Input A */}
      <group position={[-3, isUnary ? 0 : 0.8, 0]}>
        <mesh onClick={onInputAToggle}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial 
            color={inputA ? '#00AAFF' : '#1a1a3e'}
            emissive={inputA ? '#00AAFF' : '#000000'}
            emissiveIntensity={inputA ? 1 : 0}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <Html position={[0, 0.8, 0]} center>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: inputA ? '#00FFFF' : '#444',
            textShadow: inputA ? '0 0 10px #00FFFF' : 'none',
          }}>
            A: {inputA ? '1' : '0'}
          </div>
        </Html>
        {inputA && <Sparkles count={10} scale={1} size={2} color="#00FFFF" />}
      </group>
      
      {/* Input B (if binary gate) */}
      {!isUnary && (
        <group position={[-3, -0.8, 0]}>
          <mesh onClick={onInputBToggle}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial 
              color={inputB ? '#00FF00' : '#1a1a3e'}
              emissive={inputB ? '#00FF00' : '#000000'}
              emissiveIntensity={inputB ? 1 : 0}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          <Html position={[0, -0.8, 0]} center>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              color: inputB ? '#00FF88' : '#444',
              textShadow: inputB ? '0 0 10px #00FF88' : 'none',
            }}>
              B: {inputB ? '1' : '0'}
            </div>
          </Html>
          {inputB && <Sparkles count={10} scale={1} size={2} color="#00FF88" />}
        </group>
      )}
      
      {/* Electron streams to gate */}
      <ElectronStream 
        start={[-3, isUnary ? 0 : 0.8, 0]} 
        end={[-1, 0, 0]} 
        active={inputA} 
        color="#00AAFF" 
      />
      {!isUnary && (
        <ElectronStream 
          start={[-3, -0.8, 0]} 
          end={[-1, 0, 0]} 
          active={inputB ?? false} 
          color="#00FF00" 
        />
      )}
      
      {/* Gate body */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={meshRef}>
          <boxGeometry args={[2, 1.5, 1.5]} />
          <MeshTransmissionMaterial
            color={gateConfig.color}
            transmission={0.4}
            thickness={0.5}
            roughness={0.1}
            metalness={0.8}
            emissive={gateConfig.color}
            emissiveIntensity={output ? 0.8 : 0.2}
          />
        </mesh>
        
        {/* Gate edges */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(2, 1.5, 1.5)]} />
          <lineBasicMaterial color={output ? '#00FFFF' : '#333'} />
        </lineSegments>
        
        {/* Gate label */}
        <Html position={[0, 0, 0.8]} center>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#fff',
            textShadow: `0 0 10px ${gateConfig.color}`,
            padding: '4px 8px',
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '4px',
          }}>
            {type}
          </div>
        </Html>
      </Float>
      
      {/* Output stream */}
      <ElectronStream 
        start={[1, 0, 0]} 
        end={[3, 0, 0]} 
        active={output} 
        color={output ? '#FF00FF' : '#333'} 
      />
      
      {/* Output indicator */}
      <group position={[3.5, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial 
            color={output ? '#FF00FF' : '#1a1a3e'}
            emissive={output ? '#FF00FF' : '#000000'}
            emissiveIntensity={output ? 1.5 : 0}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <Html position={[0, 1, 0]} center>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '14px',
            fontWeight: 'bold',
            color: output ? '#FF00FF' : '#444',
            textShadow: output ? '0 0 15px #FF00FF' : 'none',
          }}>
            OUT: {output ? '1' : '0'}
          </div>
        </Html>
        {output && <Sparkles count={20} scale={1.5} size={3} color="#FF00FF" />}
      </group>
      
      {/* Internal visualization */}
      {output && (
        <Sparkles 
          count={30} 
          scale={[2, 1.5, 1.5]} 
          size={2} 
          speed={2}
          color={gateConfig.color} 
        />
      )}
    </group>
  );
}

// Truth table display
function TruthTable({ type, inputA, inputB }: { type: GateType; inputA: boolean; inputB: boolean }) {
  const gate = GATES.find(g => g.name === type)!;
  const isUnary = type === 'NOT';
  
  const rows = isUnary 
    ? [[false], [true]]
    : [[false, false], [false, true], [true, false], [true, true]];

  return (
    <div style={{
      background: 'rgba(10, 10, 30, 0.9)',
      border: '1px solid rgba(0, 255, 255, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ 
        color: '#00FFFF', 
        fontSize: '14px', 
        marginBottom: '12px',
        textAlign: 'center',
        fontWeight: 'bold',
      }}>
        Truth Table
      </div>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ padding: '6px 12px', borderBottom: '1px solid #333', color: '#00AAFF' }}>A</th>
            {!isUnary && <th style={{ padding: '6px 12px', borderBottom: '1px solid #333', color: '#00FF88' }}>B</th>}
            <th style={{ padding: '6px 12px', borderBottom: '1px solid #333', color: '#FF00FF' }}>Out</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const a = row[0];
            const b = isUnary ? undefined : row[1];
            const out = gate.compute(a, b);
            const isCurrentRow = isUnary 
              ? a === inputA
              : a === inputA && b === inputB;
            
            return (
              <tr key={i} style={{ 
                background: isCurrentRow ? 'rgba(0, 255, 255, 0.2)' : 'transparent',
              }}>
                <td style={{ 
                  padding: '6px 12px', 
                  textAlign: 'center',
                  color: a ? '#00FFFF' : '#555',
                }}>
                  {a ? '1' : '0'}
                </td>
                {!isUnary && (
                  <td style={{ 
                    padding: '6px 12px', 
                    textAlign: 'center',
                    color: b ? '#00FF88' : '#555',
                  }}>
                    {b ? '1' : '0'}
                  </td>
                )}
                <td style={{ 
                  padding: '6px 12px', 
                  textAlign: 'center',
                  color: out ? '#FF00FF' : '#555',
                  fontWeight: 'bold',
                }}>
                  {out ? '1' : '0'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Main component
export function LogicGates3D() {
  const [selectedGate, setSelectedGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  
  const gate = GATES.find(g => g.name === selectedGate)!;
  const output = gate.compute(inputA, inputB);

  return (
    <div style={{ 
      width: '100%', 
      height: '600px', 
      background: '#0A0A1E', 
      borderRadius: '16px', 
      overflow: 'hidden', 
      position: 'relative' 
    }}>
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 3, 12], fov: 50 }}>
        <color attach="background" args={['#0A0A1E']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00AAFF" />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#FF00FF" />
        
        {/* Grid */}
        <gridHelper args={[30, 30, '#1a1a3e', '#1a1a3e']} position={[0, -2, 0]} />
        
        {/* Gate */}
        <Gate3D
          type={selectedGate}
          position={[0, 0, 0]}
          inputA={inputA}
          inputB={inputB}
          output={output}
          onInputAToggle={() => setInputA(!inputA)}
          onInputBToggle={() => setInputB(!inputB)}
        />
        
        <OrbitControls 
          enablePan={false}
          minDistance={8}
          maxDistance={20}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
        
        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.2} />
        </EffectComposer>
      </Canvas>
      
      {/* Gate selector */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 10,
      }}>
        {GATES.map(g => (
          <button
            key={g.name}
            onClick={() => setSelectedGate(g.name)}
            style={{
              padding: '8px 16px',
              background: selectedGate === g.name ? g.color : 'rgba(30, 30, 60, 0.8)',
              border: `1px solid ${selectedGate === g.name ? g.color : '#333'}`,
              borderRadius: '8px',
              color: '#fff',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: selectedGate === g.name ? `0 0 20px ${g.color}` : 'none',
            }}
          >
            {g.name}
          </button>
        ))}
      </div>
      
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '70px',
        left: '20px',
        zIndex: 10,
      }}>
        <h2 style={{
          margin: 0,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '20px',
          color: '#00FFFF',
          textShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
        }}>
          3D LOGIC CIRCUIT LAB
        </h2>
        <p style={{
          margin: '8px 0 0',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          color: '#666688',
        }}>
          Click input spheres to toggle • {gate.description}
        </p>
      </div>
      
      {/* Truth table */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 10,
      }}>
        <TruthTable type={selectedGate} inputA={inputA} inputB={inputB} />
      </div>
      
      {/* Boolean expression */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 10,
        fontFamily: "'JetBrains Mono', monospace",
        background: 'rgba(10, 10, 30, 0.9)',
        border: '1px solid rgba(0, 255, 255, 0.3)',
        borderRadius: '12px',
        padding: '16px',
      }}>
        <div style={{ color: '#666', fontSize: '11px', marginBottom: '8px' }}>BOOLEAN EXPRESSION</div>
        <div style={{ color: '#00FFFF', fontSize: '18px' }}>
          {selectedGate === 'AND' && 'Q = A · B'}
          {selectedGate === 'OR' && 'Q = A + B'}
          {selectedGate === 'NOT' && "Q = A'"}
          {selectedGate === 'XOR' && 'Q = A ⊕ B'}
          {selectedGate === 'NAND' && "Q = (A · B)'"}
          {selectedGate === 'NOR' && "Q = (A + B)'"}
        </div>
      </div>
    </div>
  );
}

export default LogicGates3D;
