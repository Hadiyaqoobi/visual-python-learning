"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { 
  QuantumZoomSystem, 
  ZoomLevel, 
  ZOOM_LEVELS,
  BytecodeInstruction,
  AssemblyInstruction,
  GateOperation
} from './QuantumZoomSystem';

// Sample Python code
const SAMPLE_CODE = `x = 10
y = 20
z = x + y
result = z * 2
print(result)`;

// =====================================================
// LEVEL 1: Python Code View
// =====================================================
function PythonCodeView({ 
  code, 
  visible, 
  activeLineIndex 
}: { 
  code: string; 
  visible: boolean; 
  activeLineIndex: number;
}) {
  const lines = code.split('\n');
  
  if (!visible) return null;
  
  return (
    <group position={[0, 0, 0]}>
      <Html center transform scale={0.5} position={[0, 2, 0]}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderRadius: '12px',
          padding: '20px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '16px',
          minWidth: '400px',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          boxShadow: '0 0 30px rgba(0, 170, 255, 0.3)',
        }}>
          <div style={{ 
            color: '#00FFFF', 
            fontSize: '12px', 
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>🐍</span>
            <span>PYTHON SOURCE CODE</span>
            <span style={{ marginLeft: 'auto', color: '#666' }}>Level 1</span>
          </div>
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                background: i === activeLineIndex ? 'rgba(0, 170, 255, 0.2)' : 'transparent',
                borderLeft: i === activeLineIndex ? '3px solid #00AAFF' : '3px solid transparent',
                color: i === activeLineIndex ? '#fff' : '#888',
                display: 'flex',
                gap: '16px',
              }}
            >
              <span style={{ color: '#555', width: '20px' }}>{i + 1}</span>
              <span style={{ color: getCodeColor(line) }}>{line || ' '}</span>
            </div>
          ))}
        </div>
      </Html>
    </group>
  );
}

function getCodeColor(line: string): string {
  if (line.includes('print')) return '#22C55E';
  if (line.includes('=') && !line.includes('==')) return '#F97316';
  if (line.includes('+') || line.includes('*') || line.includes('-')) return '#8B5CF6';
  return '#fff';
}

// =====================================================
// LEVEL 2: Bytecode View
// =====================================================
function BytecodeView({ 
  instructions, 
  visible,
  activeIndex
}: { 
  instructions: BytecodeInstruction[];
  visible: boolean;
  activeIndex: number;
}) {
  if (!visible) return null;
  
  return (
    <group position={[0, 0, 0]}>
      <Html center transform scale={0.5} position={[0, 2, 0]}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderRadius: '12px',
          padding: '20px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '14px',
          minWidth: '500px',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          boxShadow: '0 0 30px rgba(249, 115, 22, 0.3)',
          maxHeight: '400px',
          overflowY: 'auto',
        }}>
          <div style={{ 
            color: '#F97316', 
            fontSize: '12px', 
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>📦</span>
            <span>PYTHON BYTECODE</span>
            <span style={{ marginLeft: 'auto', color: '#666' }}>Level 2</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: '#666', fontSize: '11px' }}>
                <th style={{ textAlign: 'left', padding: '4px' }}>OFFSET</th>
                <th style={{ textAlign: 'left', padding: '4px' }}>OPCODE</th>
                <th style={{ textAlign: 'left', padding: '4px' }}>ARG</th>
              </tr>
            </thead>
            <tbody>
              {instructions.map((instr, i) => (
                <tr
                  key={i}
                  style={{
                    background: i === activeIndex ? 'rgba(249, 115, 22, 0.2)' : 'transparent',
                    color: i === activeIndex ? '#fff' : '#888',
                  }}
                >
                  <td style={{ padding: '6px', color: '#666' }}>{instr.offset}</td>
                  <td style={{ padding: '6px', color: '#F97316' }}>{instr.opcode}</td>
                  <td style={{ padding: '6px', color: '#22C55E' }}>{instr.arg ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Html>
    </group>
  );
}

// =====================================================
// LEVEL 3: Assembly View
// =====================================================
function AssemblyView({ 
  instructions, 
  visible,
  activeIndex
}: { 
  instructions: AssemblyInstruction[];
  visible: boolean;
  activeIndex: number;
}) {
  if (!visible) return null;
  
  return (
    <group position={[0, 0, 0]}>
      <Html center transform scale={0.5} position={[0, 2, 0]}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderRadius: '12px',
          padding: '20px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '14px',
          minWidth: '450px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
          maxHeight: '400px',
          overflowY: 'auto',
        }}>
          <div style={{ 
            color: '#8B5CF6', 
            fontSize: '12px', 
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>⚙️</span>
            <span>x86-64 ASSEMBLY</span>
            <span style={{ marginLeft: 'auto', color: '#666' }}>Level 3</span>
          </div>
          {instructions.map((instr, i) => (
            <div
              key={i}
              style={{
                padding: '6px 8px',
                borderRadius: '4px',
                background: i === activeIndex ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                display: 'flex',
                gap: '16px',
                color: i === activeIndex ? '#fff' : '#888',
              }}
            >
              <span style={{ color: '#555', width: '60px' }}>{instr.address}</span>
              <span style={{ color: '#8B5CF6', width: '50px' }}>{instr.mnemonic}</span>
              <span style={{ color: '#22C55E' }}>{instr.operands}</span>
            </div>
          ))}
        </div>
      </Html>
    </group>
  );
}

// =====================================================
// LEVEL 4: Logic Gates View
// =====================================================
function LogicGate3D({ 
  type, 
  position, 
  active 
}: { 
  type: string; 
  position: [number, number, number];
  active: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current && active) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.5;
      const scale = 1 + Math.sin(clock.elapsedTime * 3) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });
  
  const gateColors: Record<string, string> = {
    'AND': '#22C55E',
    'OR': '#3B82F6',
    'XOR': '#F97316',
    'NOT': '#EF4444',
    'NAND': '#8B5CF6',
    'NOR': '#EC4899',
  };
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1.2, 0.8, 0.4]} />
        <meshStandardMaterial
          color={gateColors[type] || '#666'}
          emissive={gateColors[type] || '#666'}
          emissiveIntensity={active ? 1 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <Html position={[position[0], position[1] + 0.7, position[2]]} center>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          color: active ? '#fff' : '#666',
          fontWeight: 'bold',
          textShadow: active ? `0 0 10px ${gateColors[type]}` : 'none',
        }}>
          {type}
        </div>
      </Html>
    </Float>
  );
}

function GatesView({ 
  operations, 
  visible,
  activeGates
}: { 
  operations: GateOperation[];
  visible: boolean;
  activeGates: Set<string>;
}) {
  if (!visible) return null;
  
  // Create a grid of gates
  const allGates = ['AND', 'OR', 'XOR', 'NOT', 'NAND', 'NOR'];
  
  return (
    <group position={[0, 0, 0]}>
      {/* Title */}
      <Html position={[0, 4, 0]} center>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '14px',
          color: '#22C55E',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0,0,0,0.8)',
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(34, 197, 94, 0.3)',
        }}>
          <span>🔌</span>
          <span>LOGIC GATES</span>
          <span style={{ marginLeft: '16px', color: '#666' }}>Level 4</span>
        </div>
      </Html>
      
      {/* Gates */}
      {allGates.map((gate, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = (col - 1) * 2.5;
        const y = 1 - row * 2;
        return (
          <LogicGate3D
            key={gate}
            type={gate}
            position={[x, y, 0]}
            active={activeGates.has(gate)}
          />
        );
      })}
      
      {/* Connections (simplified) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-3, 0, 0, -1.5, 1, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#333" />
      </line>
    </group>
  );
}

// =====================================================
// LEVEL 5: Electrons View (simplified)
// =====================================================
function ElectronsView({ visible }: { visible: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 500;
  
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return pos;
  }, []);
  
  useFrame(({ clock }) => {
    if (particlesRef.current && visible) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3] += Math.sin(clock.elapsedTime + i * 0.1) * 0.01;
        positions[i * 3 + 1] += Math.cos(clock.elapsedTime + i * 0.1) * 0.005;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  if (!visible) return null;
  
  return (
    <group>
      {/* Title */}
      <Html position={[0, 3.5, 0]} center>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '14px',
          color: '#00AAFF',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0,0,0,0.8)',
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(0, 170, 255, 0.3)',
        }}>
          <span>⚡</span>
          <span>ELECTRON FLOW</span>
          <span style={{ marginLeft: '16px', color: '#666' }}>Level 5</span>
        </div>
      </Html>
      
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#00AAFF"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Circuit board background */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial
          color="#0a0a1e"
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

// =====================================================
// Camera Controller
// =====================================================
function CameraController({ 
  zoomLevel, 
  onTransitionComplete 
}: { 
  zoomLevel: ZoomLevel;
  onTransitionComplete?: () => void;
}) {
  const { camera } = useThree();
  const targetZ = [50, 35, 20, 10, 5][zoomLevel - 1];
  
  useEffect(() => {
    gsap.to(camera.position, {
      z: targetZ,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: onTransitionComplete,
    });
  }, [zoomLevel, camera, targetZ, onTransitionComplete]);
  
  return null;
}

// =====================================================
// Main Component
// =====================================================
export function QuantumZoomDemo() {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(ZoomLevel.PYTHON);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [activeInstructionIndex, setActiveInstructionIndex] = useState(0);
  const [activeGates, setActiveGates] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Generate bytecode and assembly from sample code
  const bytecode = React.useMemo(() => QuantumZoomSystem.pythonToBytecode(SAMPLE_CODE), []);
  const assembly = React.useMemo(() => QuantumZoomSystem.bytecodeToAssembly(bytecode), [bytecode]);
  const gateOps = React.useMemo(() => QuantumZoomSystem.assemblyToGates(assembly), [assembly]);
  
  // Handle zoom
  const handleZoomIn = useCallback(() => {
    if (zoomLevel < ZoomLevel.ELECTRONS && !isAnimating) {
      setIsAnimating(true);
      setZoomLevel(prev => (prev + 1) as ZoomLevel);
    }
  }, [zoomLevel, isAnimating]);
  
  const handleZoomOut = useCallback(() => {
    if (zoomLevel > ZoomLevel.PYTHON && !isAnimating) {
      setIsAnimating(true);
      setZoomLevel(prev => (prev - 1) as ZoomLevel);
    }
  }, [zoomLevel, isAnimating]);
  
  // Handle scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleZoomIn, handleZoomOut]);
  
  // Animate active elements
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLineIndex(prev => (prev + 1) % SAMPLE_CODE.split('\n').length);
      setActiveInstructionIndex(prev => (prev + 1) % bytecode.length);
      
      // Cycle through gates
      const allGates = ['AND', 'OR', 'XOR', 'NOT', 'NAND', 'NOR'];
      setActiveGates(prev => {
        const newSet = new Set<string>();
        const randomCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < randomCount; i++) {
          newSet.add(allGates[Math.floor(Math.random() * allGates.length)]);
        }
        return newSet;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [bytecode.length]);

  const currentLevelConfig = ZOOM_LEVELS.find(l => l.level === zoomLevel)!;

  return (
    <div style={{ 
      width: '100%', 
      height: '700px', 
      background: '#0A0A1E', 
      borderRadius: '16px', 
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Canvas camera={{ position: [0, 0, 50], fov: 50 }}>
        <color attach="background" args={['#0A0A1E']} />
        
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00AAFF" />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#FF00FF" />
        
        <CameraController 
          zoomLevel={zoomLevel} 
          onTransitionComplete={() => setIsAnimating(false)}
        />
        
        {/* Level Views */}
        <PythonCodeView 
          code={SAMPLE_CODE} 
          visible={zoomLevel === ZoomLevel.PYTHON}
          activeLineIndex={activeLineIndex}
        />
        <BytecodeView 
          instructions={bytecode}
          visible={zoomLevel === ZoomLevel.BYTECODE}
          activeIndex={activeInstructionIndex}
        />
        <AssemblyView 
          instructions={assembly}
          visible={zoomLevel === ZoomLevel.ASSEMBLY}
          activeIndex={activeInstructionIndex % assembly.length}
        />
        <GatesView 
          operations={gateOps}
          visible={zoomLevel === ZoomLevel.GATES}
          activeGates={activeGates}
        />
        <ElectronsView visible={zoomLevel === ZoomLevel.ELECTRONS} />
        
        <gridHelper args={[50, 50, '#111', '#111']} position={[0, -5, 0]} />
        
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
        
        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.2} />
        </EffectComposer>
      </Canvas>
      
      {/* Title */}
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
          QUANTUM ZOOM
        </h2>
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#666' }}>
          Scroll or use buttons to zoom through abstraction layers
        </p>
      </div>
      
      {/* Current Level Indicator */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '12px',
        padding: '16px',
        fontFamily: "'JetBrains Mono', monospace",
        border: `1px solid ${currentLevelConfig.color}`,
        boxShadow: `0 0 20px ${currentLevelConfig.color}44`,
      }}>
        <div style={{ 
          fontSize: '24px',
          textAlign: 'center',
          marginBottom: '8px',
        }}>
          {currentLevelConfig.icon}
        </div>
        <div style={{ 
          color: currentLevelConfig.color,
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
          {currentLevelConfig.name}
        </div>
        <div style={{ 
          color: '#666',
          fontSize: '11px',
          textAlign: 'center',
          marginTop: '4px',
        }}>
          Level {zoomLevel} of 5
        </div>
      </div>
      
      {/* Level indicators */}
      <div style={{
        position: 'absolute',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {ZOOM_LEVELS.map((level) => (
          <button
            key={level.level}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setZoomLevel(level.level);
              }
            }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: zoomLevel === level.level 
                ? `2px solid ${level.color}`
                : '1px solid #333',
              background: zoomLevel === level.level 
                ? `${level.color}22`
                : 'rgba(0,0,0,0.5)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              transition: 'all 0.2s',
            }}
            title={level.name}
          >
            {level.icon}
          </button>
        ))}
      </div>
      
      {/* Zoom Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '12px',
      }}>
        <button
          onClick={handleZoomOut}
          disabled={zoomLevel === ZoomLevel.PYTHON || isAnimating}
          style={{
            padding: '12px 24px',
            background: zoomLevel > ZoomLevel.PYTHON && !isAnimating
              ? 'rgba(0, 170, 255, 0.2)'
              : 'rgba(50, 50, 50, 0.5)',
            border: '1px solid rgba(0, 255, 255, 0.3)',
            borderRadius: '8px',
            color: zoomLevel > ZoomLevel.PYTHON && !isAnimating ? '#00FFFF' : '#444',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '14px',
            cursor: zoomLevel > ZoomLevel.PYTHON && !isAnimating ? 'pointer' : 'not-allowed',
          }}
        >
          ← Zoom Out (Higher Level)
        </button>
        
        <button
          onClick={handleZoomIn}
          disabled={zoomLevel === ZoomLevel.ELECTRONS || isAnimating}
          style={{
            padding: '12px 24px',
            background: zoomLevel < ZoomLevel.ELECTRONS && !isAnimating
              ? 'linear-gradient(135deg, #00AAFF, #FF00FF)'
              : 'rgba(50, 50, 50, 0.5)',
            border: 'none',
            borderRadius: '8px',
            color: zoomLevel < ZoomLevel.ELECTRONS && !isAnimating ? '#fff' : '#444',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '14px',
            cursor: zoomLevel < ZoomLevel.ELECTRONS && !isAnimating ? 'pointer' : 'not-allowed',
            boxShadow: zoomLevel < ZoomLevel.ELECTRONS && !isAnimating
              ? '0 0 20px rgba(0, 170, 255, 0.4)'
              : 'none',
          }}
        >
          Zoom In (Lower Level) →
        </button>
      </div>
      
      {/* Abstraction layers info */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        left: '20px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '10px',
        color: '#444',
      }}>
        <div>🐍 Python → 📦 Bytecode → ⚙️ Assembly → 🔌 Gates → ⚡ Electrons</div>
      </div>
    </div>
  );
}

export default QuantumZoomDemo;
