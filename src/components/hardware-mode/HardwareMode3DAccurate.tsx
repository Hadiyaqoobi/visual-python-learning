"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Float, Sparkles, Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { 
  Zap, Thermometer, Eye, Info, Layers,
  ZoomIn, ZoomOut, ChevronRight, Clock, Cpu,
  HardDrive, Database, Box, ArrowRight, AlertTriangle
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
export type ZoomLevel = 1 | 2 | 3 | 4 | 5;
export type ViewMode = 'electrons' | 'thermal' | 'standard' | 'pipeline';

export interface ExecutionEvent {
  type: 'ASSIGNMENT' | 'ARITHMETIC' | 'COMPARISON' | 'FUNCTION_CALL' | 'LOOP' | 'MEMORY_READ' | 'MEMORY_WRITE' | 'PRINT';
  line: number;
  code: string;
  variable?: string;
  value?: string;
  operator?: string;
  operand1?: string;
  operand2?: string;
}

interface HardwareMode3DProps {
  executionEvents: ExecutionEvent[];
  currentLine: number;
  isRunning: boolean;
  code: string;
}

// ============================================
// ACCURATE MEMORY HIERARCHY - This is what's missing!
// ============================================
const MEMORY_HIERARCHY = [
  { 
    name: 'Registers', 
    size: '~1KB', 
    latency: '1 cycle',
    latencyNs: 0.3,
    color: '#22C55E',
    description: '16 general purpose (RAX, RBX, RCX...)',
  },
  { 
    name: 'L1 Cache', 
    size: '32-64KB', 
    latency: '~4 cycles',
    latencyNs: 1,
    color: '#84CC16',
    description: 'Per-core, split I-cache/D-cache',
  },
  { 
    name: 'L2 Cache', 
    size: '256KB-1MB', 
    latency: '~12 cycles',
    latencyNs: 4,
    color: '#EAB308',
    description: 'Per-core unified cache',
  },
  { 
    name: 'L3 Cache', 
    size: '8-32MB', 
    latency: '~40 cycles',
    latencyNs: 12,
    color: '#F97316',
    description: 'Shared across all cores',
  },
  { 
    name: 'RAM (DRAM)', 
    size: '8-128GB', 
    latency: '~200 cycles',
    latencyNs: 60,
    color: '#EF4444',
    description: 'Main memory, DDR4/DDR5',
  },
  { 
    name: 'SSD/NVMe', 
    size: '256GB-4TB', 
    latency: '~100,000 cycles',
    latencyNs: 30000,
    color: '#7C3AED',
    description: 'Persistent storage',
  },
];

// ============================================
// CPU PIPELINE STAGES - What actually happens
// ============================================
const PIPELINE_STAGES = [
  { 
    name: 'IF', 
    fullName: 'Instruction Fetch',
    description: 'Fetch instruction from memory/cache',
    color: '#3B82F6',
  },
  { 
    name: 'ID', 
    fullName: 'Instruction Decode',
    description: 'Decode opcode, read registers',
    color: '#8B5CF6',
  },
  { 
    name: 'EX', 
    fullName: 'Execute',
    description: 'ALU operation or address calc',
    color: '#22C55E',
  },
  { 
    name: 'MEM', 
    fullName: 'Memory Access',
    description: 'Load/Store from/to memory',
    color: '#F97316',
  },
  { 
    name: 'WB', 
    fullName: 'Write Back',
    description: 'Write result to register',
    color: '#EC4899',
  },
];

// ============================================
// REALISTIC x86-64 REGISTERS
// ============================================
const X86_REGISTERS = {
  general: ['RAX', 'RBX', 'RCX', 'RDX', 'RSI', 'RDI', 'RBP', 'RSP', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15'],
  special: ['RIP', 'RFLAGS'],
  segment: ['CS', 'DS', 'SS', 'ES', 'FS', 'GS'],
  vector: ['XMM0', 'XMM1', 'XMM2', 'XMM3', 'XMM4', 'XMM5', 'XMM6', 'XMM7'],
};

// ============================================
// ZOOM LEVEL CONFIGS - Now Accurate
// ============================================
const ZOOM_CONFIGS = [
  { 
    level: 1 as ZoomLevel, 
    name: 'Python', 
    icon: '🐍', 
    color: '#3572A5', 
    cameraZ: 20,
    description: 'High-level source code',
  },
  { 
    level: 2 as ZoomLevel, 
    name: 'Bytecode', 
    icon: '📦', 
    color: '#F97316', 
    cameraZ: 18,
    description: 'CPython VM instructions',
  },
  { 
    level: 3 as ZoomLevel, 
    name: 'x86-64', 
    icon: '⚙️', 
    color: '#8B5CF6', 
    cameraZ: 15,
    description: 'Native machine code',
  },
  { 
    level: 4 as ZoomLevel, 
    name: 'Pipeline', 
    icon: '🔄', 
    color: '#22C55E', 
    cameraZ: 12,
    description: 'CPU execution pipeline',
  },
  { 
    level: 5 as ZoomLevel, 
    name: 'Silicon', 
    icon: '⚡', 
    color: '#00AAFF', 
    cameraZ: 8,
    description: 'Transistor-level switching',
  },
];

// ============================================
// MEMORY HIERARCHY 3D PYRAMID
// ============================================
function MemoryHierarchyPyramid({ 
  activeLevel,
  isRunning,
}: { 
  activeLevel: number;
  isRunning: boolean;
}) {
  return (
    <group position={[5, 0, 0]}>
      {MEMORY_HIERARCHY.map((level, i) => {
        const yPos = 2 - i * 0.8;
        const width = 1 + i * 0.3;
        const isActive = activeLevel === i && isRunning;
        
        return (
          <group key={level.name} position={[0, yPos, 0]}>
            <mesh>
              <boxGeometry args={[width, 0.5, 0.5]} />
              <meshStandardMaterial
                color={level.color}
                emissive={level.color}
                emissiveIntensity={isActive ? 0.8 : 0.15}
                metalness={0.6}
                roughness={0.3}
              />
            </mesh>
            
            {/* Glowing edges when active */}
            {isActive && (
              <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(width, 0.5, 0.5)]} />
                <lineBasicMaterial color="#00FFFF" />
              </lineSegments>
            )}
            
            <Html position={[width / 2 + 0.3, 0, 0]} center={false}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                whiteSpace: 'nowrap',
                color: isActive ? '#fff' : '#666',
              }}>
                <div style={{ color: level.color, fontWeight: 'bold' }}>{level.name}</div>
                <div>{level.size} | {level.latency}</div>
              </div>
            </Html>
          </group>
        );
      })}
      
      {/* Title */}
      <Html position={[0, 3, 0]} center>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          color: '#00FFFF',
          fontWeight: 'bold',
        }}>
          MEMORY HIERARCHY
        </div>
      </Html>
      
      {/* Speed indicator */}
      <Html position={[-1.5, 0, 0]} center>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '8px',
          color: '#22C55E',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
        }}>
          FASTER ↑
        </div>
      </Html>
      <Html position={[-1.5, -2, 0]} center>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '8px',
          color: '#EF4444',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
        }}>
          ↓ SLOWER
        </div>
      </Html>
    </group>
  );
}

// ============================================
// CPU PIPELINE VISUALIZATION
// ============================================
function PipelineVisualization({ 
  activeStage,
  isRunning,
}: { 
  activeStage: number;
  isRunning: boolean;
}) {
  return (
    <group position={[-3, -2, 0]}>
      {/* Pipeline stages */}
      {PIPELINE_STAGES.map((stage, i) => {
        const xPos = i * 1.4;
        const isActive = activeStage === i && isRunning;
        
        return (
          <group key={stage.name} position={[xPos, 0, 0]}>
            <mesh>
              <boxGeometry args={[1.2, 0.8, 0.4]} />
              <meshStandardMaterial
                color={stage.color}
                emissive={stage.color}
                emissiveIntensity={isActive ? 1 : 0.2}
                metalness={0.5}
                roughness={0.4}
              />
            </mesh>
            
            {isActive && (
              <Sparkles
                count={15}
                scale={[1.5, 1.2, 0.8]}
                size={2}
                speed={0.5}
                color="#00FFFF"
              />
            )}
            
            <Html position={[0, -0.6, 0]} center>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                color: isActive ? '#fff' : '#666',
                textAlign: 'center',
              }}>
                <div style={{ fontWeight: 'bold', color: stage.color }}>{stage.name}</div>
              </div>
            </Html>
            
            {/* Arrow to next stage */}
            {i < PIPELINE_STAGES.length - 1 && (
              <mesh position={[0.8, 0, 0]}>
                <coneGeometry args={[0.1, 0.2, 8]} />
                <meshBasicMaterial color={isActive ? '#00FFFF' : '#333'} />
              </mesh>
            )}
          </group>
        );
      })}
      
      {/* Title */}
      <Html position={[2.5, 1, 0]} center>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          color: '#00FFFF',
          fontWeight: 'bold',
        }}>
          CPU PIPELINE (5-Stage)
        </div>
      </Html>
    </group>
  );
}

// ============================================
// REALISTIC CPU CORE
// ============================================
function CPUCore3D({ 
  position,
  isRunning,
  activeUnit,
  currentInstruction,
}: { 
  position: [number, number, number];
  isRunning: boolean;
  activeUnit: string | null;
  currentInstruction?: string;
}) {
  return (
    <group position={position}>
      {/* CPU Die outline */}
      <mesh>
        <boxGeometry args={[4, 3, 0.3]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(4, 3, 0.3)]} />
        <lineBasicMaterial color={isRunning ? '#00FFFF' : '#333'} />
      </lineSegments>
      
      {/* Control Unit */}
      <group position={[-1.2, 0.8, 0.2]}>
        <mesh>
          <boxGeometry args={[1.4, 0.8, 0.3]} />
          <meshStandardMaterial
            color="#F97316"
            emissive="#F97316"
            emissiveIntensity={activeUnit === 'control' ? 0.8 : 0.15}
          />
        </mesh>
        <Html position={[0, -0.6, 0]} center>
          <div style={{ 
            fontFamily: "'JetBrains Mono', monospace", 
            fontSize: '8px', 
            color: activeUnit === 'control' ? '#F97316' : '#666',
            fontWeight: 'bold',
          }}>
            CONTROL
          </div>
        </Html>
      </group>
      
      {/* ALU (Integer) */}
      <group position={[0.8, 0.8, 0.2]}>
        <mesh>
          <boxGeometry args={[1.2, 0.8, 0.3]} />
          <meshStandardMaterial
            color="#22C55E"
            emissive="#22C55E"
            emissiveIntensity={activeUnit === 'alu' ? 0.8 : 0.15}
          />
        </mesh>
        <Html position={[0, -0.6, 0]} center>
          <div style={{ 
            fontFamily: "'JetBrains Mono', monospace", 
            fontSize: '8px', 
            color: activeUnit === 'alu' ? '#22C55E' : '#666',
            fontWeight: 'bold',
          }}>
            INT ALU
          </div>
        </Html>
      </group>
      
      {/* FPU (Floating Point Unit) */}
      <group position={[0.8, 0, 0.2]}>
        <mesh>
          <boxGeometry args={[1.2, 0.6, 0.3]} />
          <meshStandardMaterial
            color="#8B5CF6"
            emissive="#8B5CF6"
            emissiveIntensity={activeUnit === 'fpu' ? 0.8 : 0.15}
          />
        </mesh>
        <Html position={[0, -0.5, 0]} center>
          <div style={{ 
            fontFamily: "'JetBrains Mono', monospace", 
            fontSize: '8px', 
            color: '#666',
            fontWeight: 'bold',
          }}>
            FPU
          </div>
        </Html>
      </group>
      
      {/* Register File */}
      <group position={[-1.2, -0.2, 0.2]}>
        <mesh>
          <boxGeometry args={[1.4, 1, 0.3]} />
          <meshStandardMaterial
            color="#3B82F6"
            emissive="#3B82F6"
            emissiveIntensity={activeUnit === 'registers' ? 0.8 : 0.15}
          />
        </mesh>
        <Html position={[0, -0.7, 0]} center>
          <div style={{ 
            fontFamily: "'JetBrains Mono', monospace", 
            fontSize: '8px', 
            color: activeUnit === 'registers' ? '#3B82F6' : '#666',
            fontWeight: 'bold',
          }}>
            REGISTERS (16)
          </div>
        </Html>
      </group>
      
      {/* L1 Cache */}
      <group position={[0, -1.1, 0.2]}>
        <mesh>
          <boxGeometry args={[3.6, 0.4, 0.3]} />
          <meshStandardMaterial
            color="#84CC16"
            emissive="#84CC16"
            emissiveIntensity={activeUnit === 'l1' ? 0.8 : 0.15}
          />
        </mesh>
        <Html position={[0, -0.4, 0]} center>
          <div style={{ 
            fontFamily: "'JetBrains Mono', monospace", 
            fontSize: '8px', 
            color: '#666',
          }}>
            L1 Cache (32KB I + 32KB D)
          </div>
        </Html>
      </group>
      
      {/* Current instruction display */}
      {currentInstruction && (
        <Html position={[0, 1.8, 0]} center>
          <div style={{
            background: 'rgba(0,0,0,0.9)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: '#00FFFF',
            border: '1px solid #00FFFF',
          }}>
            {currentInstruction}
          </div>
        </Html>
      )}
    </group>
  );
}

// ============================================
// DATA FLOW PARTICLES
// ============================================
function DataFlowParticles({ 
  start, 
  end, 
  active,
  color = '#00AAFF',
}: { 
  start: [number, number, number];
  end: [number, number, number];
  active: boolean;
  color?: string;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 20;
  const positions = useMemo(() => new Float32Array(count * 3), []);
  const lifes = useRef<number[]>(Array(count).fill(0).map((_, i) => i / count));
  
  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return;
    
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    lifes.current.forEach((life, i) => {
      lifes.current[i] = (life + delta * 0.8) % 1;
      const t = lifes.current[i];
      
      posArray[i * 3] = start[0] + (end[0] - start[0]) * t;
      posArray[i * 3 + 1] = start[1] + (end[1] - start[1]) * t + Math.sin(t * Math.PI) * 0.2;
      posArray[i * 3 + 2] = start[2] + (end[2] - start[2]) * t;
    });
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  if (!active) return null;
  
  return (
    <points ref={pointsRef}>
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
        color={color}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============================================
// CAMERA CONTROLLER
// ============================================
function CameraController({ zoomLevel }: { zoomLevel: ZoomLevel }) {
  const { camera } = useThree();
  const targetZ = ZOOM_CONFIGS.find(c => c.level === zoomLevel)?.cameraZ || 15;
  
  useEffect(() => {
    gsap.to(camera.position, {
      z: targetZ,
      y: 1,
      duration: 0.8,
      ease: 'power2.inOut',
    });
  }, [zoomLevel, camera, targetZ]);
  
  return null;
}

// ============================================
// MAIN 3D SCENE
// ============================================
function HardwareScene3D({
  executionEvents,
  isRunning,
  zoomLevel,
  viewMode,
  pipelineStage,
  memoryLevel,
}: {
  executionEvents: ExecutionEvent[];
  isRunning: boolean;
  zoomLevel: ZoomLevel;
  viewMode: ViewMode;
  pipelineStage: number;
  memoryLevel: number;
}) {
  const latestEvent = executionEvents[executionEvents.length - 1];
  
  const activeUnit = useMemo(() => {
    if (!latestEvent || !isRunning) return null;
    switch (latestEvent.type) {
      case 'ARITHMETIC': return 'alu';
      case 'ASSIGNMENT': return latestEvent.operator ? 'alu' : 'registers';
      case 'MEMORY_READ':
      case 'MEMORY_WRITE': return 'l1';
      default: return 'control';
    }
  }, [latestEvent, isRunning]);

  return (
    <>
      <color attach="background" args={['#0A0A1E']} />
      
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#00AAFF" />
      <pointLight position={[-10, 10, -10]} intensity={0.6} color="#FF00FF" />
      
      <CameraController zoomLevel={zoomLevel} />
      
      {/* CPU Core */}
      <CPUCore3D
        position={[-2, 1, 0]}
        isRunning={isRunning}
        activeUnit={activeUnit}
        currentInstruction={latestEvent?.code}
      />
      
      {/* Memory Hierarchy */}
      <MemoryHierarchyPyramid
        activeLevel={memoryLevel}
        isRunning={isRunning}
      />
      
      {/* Pipeline (shown at certain zoom levels) */}
      {zoomLevel >= 4 && (
        <PipelineVisualization
          activeStage={pipelineStage}
          isRunning={isRunning}
        />
      )}
      
      {/* Data flow from CPU to Memory */}
      <DataFlowParticles
        start={[-0.5, -0.5, 0]}
        end={[3.5, 1.5, 0]}
        active={isRunning && (latestEvent?.type === 'MEMORY_READ' || latestEvent?.type === 'MEMORY_WRITE')}
        color="#3B82F6"
      />
      
      {/* Grid */}
      <gridHelper 
        args={[20, 20, '#1a1a3e', '#1a1a3e']} 
        position={[0, -3, 0]} 
      />
      
      <OrbitControls 
        enablePan={false}
        minDistance={5}
        maxDistance={25}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
      />
      
      <EffectComposer>
        <Bloom 
          intensity={1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  );
}

// ============================================
// EDUCATIONAL SIDEBAR - The Key Missing Piece!
// ============================================
function EducationalSidebar({ 
  event,
  pipelineStage,
  memoryLevel,
  zoomLevel,
}: { 
  event: ExecutionEvent | null;
  pipelineStage: number;
  memoryLevel: number;
  zoomLevel: ZoomLevel;
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '16px',
      height: '100%',
      overflow: 'auto',
    }}>
      {/* Current Operation */}
      {event && (
        <div style={{
          background: 'rgba(0, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '12px',
          border: '1px solid rgba(0, 255, 255, 0.2)',
        }}>
          <div style={{
            fontSize: '10px',
            color: '#00FFFF',
            fontWeight: 'bold',
            marginBottom: '8px',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            CURRENT OPERATION
          </div>
          <div style={{
            fontSize: '13px',
            color: '#fff',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {event.code}
          </div>
        </div>
      )}
      
      {/* Pipeline Stage */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '8px',
        padding: '12px',
      }}>
        <div style={{
          fontSize: '10px',
          color: '#888',
          fontWeight: 'bold',
          marginBottom: '8px',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          🔄 PIPELINE STAGE
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {PIPELINE_STAGES.map((stage, i) => (
            <div
              key={stage.name}
              style={{
                flex: 1,
                padding: '6px 4px',
                background: i === pipelineStage ? stage.color : 'rgba(255,255,255,0.05)',
                borderRadius: '4px',
                textAlign: 'center',
                fontSize: '9px',
                color: i === pipelineStage ? '#fff' : '#555',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: i === pipelineStage ? 'bold' : 'normal',
              }}
            >
              {stage.name}
            </div>
          ))}
        </div>
        {PIPELINE_STAGES[pipelineStage] && (
          <div style={{
            marginTop: '8px',
            fontSize: '11px',
            color: '#888',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <strong style={{ color: PIPELINE_STAGES[pipelineStage].color }}>
              {PIPELINE_STAGES[pipelineStage].fullName}:
            </strong>{' '}
            {PIPELINE_STAGES[pipelineStage].description}
          </div>
        )}
      </div>
      
      {/* Memory Access */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '8px',
        padding: '12px',
      }}>
        <div style={{
          fontSize: '10px',
          color: '#888',
          fontWeight: 'bold',
          marginBottom: '8px',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          💾 MEMORY ACCESS
        </div>
        {MEMORY_HIERARCHY.slice(0, 5).map((level, i) => (
          <div
            key={level.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 0',
              opacity: i === memoryLevel ? 1 : 0.4,
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '2px',
              background: level.color,
            }} />
            <span style={{
              fontSize: '10px',
              color: i === memoryLevel ? '#fff' : '#666',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: i === memoryLevel ? 'bold' : 'normal',
            }}>
              {level.name}
            </span>
            <span style={{
              fontSize: '9px',
              color: '#555',
              marginLeft: 'auto',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {level.latency}
            </span>
          </div>
        ))}
      </div>
      
      {/* Real-World Context */}
      <div style={{
        background: 'rgba(139, 92, 246, 0.1)',
        borderRadius: '8px',
        padding: '12px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
      }}>
        <div style={{
          fontSize: '10px',
          color: '#8B5CF6',
          fontWeight: 'bold',
          marginBottom: '8px',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          💡 DID YOU KNOW?
        </div>
        <div style={{
          fontSize: '11px',
          color: '#888',
          lineHeight: 1.5,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {zoomLevel === 1 && "Python code is first compiled to bytecode by the CPython compiler, then executed by the Python Virtual Machine (PVM)."}
          {zoomLevel === 2 && "Python bytecode is platform-independent. The same .pyc file runs on Windows, Mac, and Linux!"}
          {zoomLevel === 3 && "Modern CPUs can execute 4-6 instructions PER CYCLE thanks to superscalar architecture."}
          {zoomLevel === 4 && "A cache miss can cost 200 cycles - that's why good cache locality makes code 100x faster!"}
          {zoomLevel === 5 && "Modern CPUs have 50+ billion transistors switching at 4-5 GHz (5 billion times per second)!"}
        </div>
      </div>
      
      {/* Hardware Interview Tip */}
      <div style={{
        background: 'rgba(34, 197, 94, 0.1)',
        borderRadius: '8px',
        padding: '12px',
        border: '1px solid rgba(34, 197, 94, 0.2)',
      }}>
        <div style={{
          fontSize: '10px',
          color: '#22C55E',
          fontWeight: 'bold',
          marginBottom: '8px',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          🎯 INTERVIEW TIP
        </div>
        <div style={{
          fontSize: '11px',
          color: '#888',
          lineHeight: 1.5,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {event?.type === 'ARITHMETIC' && "Know that integer operations (ADD, MUL) are 1 cycle, but division can take 20-40 cycles!"}
          {event?.type === 'ASSIGNMENT' && "Memory-bound code? Look for cache misses. CPU-bound? Look at branch mispredictions."}
          {event?.type === 'MEMORY_READ' && "Sequential memory access is 100x faster than random access due to cache prefetching."}
          {event?.type === 'MEMORY_WRITE' && "Write-through vs write-back cache policies - know the tradeoffs!"}
          {event?.type === 'PRINT' && "I/O operations involve system calls, context switches, and kernel mode transitions."}
          {!event && "Understanding memory hierarchy is THE most asked topic in hardware company interviews."}
        </div>
      </div>
    </div>
  );
}

// ============================================
// CODE PANEL
// ============================================
function CodePanel({ 
  code, 
  currentLine,
  executionEvents,
}: { 
  code: string;
  currentLine: number;
  executionEvents: ExecutionEvent[];
}) {
  const lines = code.split('\n');
  const executedLines = new Set(executionEvents.map(e => e.line));
  
  return (
    <div style={{
      height: '100%',
      overflow: 'auto',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '12px',
    }}>
      {lines.map((line, i) => {
        const lineNum = i + 1;
        const isComment = line.trim().startsWith('#');
        const isCurrent = lineNum === currentLine;
        const wasExecuted = executedLines.has(lineNum);
        
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              padding: '3px 10px',
              background: isCurrent 
                ? 'linear-gradient(90deg, rgba(0,255,255,0.2), transparent)'
                : wasExecuted 
                  ? 'rgba(34,197,94,0.08)'
                  : 'transparent',
              borderLeft: isCurrent 
                ? '3px solid #00FFFF'
                : wasExecuted
                  ? '3px solid #22C55E55'
                  : '3px solid transparent',
            }}
          >
            <span style={{
              width: '24px',
              color: isCurrent ? '#00FFFF' : '#444',
              textAlign: 'right',
              marginRight: '12px',
              userSelect: 'none',
            }}>
              {lineNum}
            </span>
            <span style={{
              color: isComment 
                ? '#6B7280' 
                : isCurrent 
                  ? '#fff'
                  : '#999',
            }}>
              {line || ' '}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function HardwareMode3DAccurate({ 
  executionEvents, 
  currentLine, 
  isRunning, 
  code 
}: HardwareMode3DProps) {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(1);
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [pipelineStage, setPipelineStage] = useState(0);
  const [memoryLevel, setMemoryLevel] = useState(0);
  
  // Cycle through pipeline stages and memory levels
  useEffect(() => {
    if (!isRunning) return;
    
    const pipelineInterval = setInterval(() => {
      setPipelineStage(prev => (prev + 1) % 5);
    }, 400);
    
    return () => clearInterval(pipelineInterval);
  }, [isRunning]);
  
  useEffect(() => {
    if (!isRunning || executionEvents.length === 0) {
      setMemoryLevel(0);
      return;
    }
    
    const event = executionEvents[executionEvents.length - 1];
    // Simulate cache behavior
    if (event.type === 'MEMORY_READ' || event.type === 'MEMORY_WRITE') {
      // Simulate going through cache hierarchy
      let level = 0;
      const interval = setInterval(() => {
        level++;
        if (level > 3) {
          clearInterval(interval);
          setMemoryLevel(0);
        } else {
          setMemoryLevel(level);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isRunning, executionEvents]);

  const currentConfig = ZOOM_CONFIGS.find(c => c.level === zoomLevel)!;
  const latestEvent = executionEvents.length > 0 ? executionEvents[executionEvents.length - 1] : null;

  return (
    <div style={{ 
      display: 'flex',
      width: '100%', 
      height: '100%', 
      background: '#0A0A1E',
      overflow: 'hidden',
    }}>
      {/* LEFT: Code Panel */}
      <div style={{
        width: '240px',
        borderRight: '1px solid #1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        background: '#0f0f1a',
      }}>
        <div style={{
          padding: '10px 14px',
          borderBottom: '1px solid #1a1a2e',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '14px' }}>🐍</span>
          <span style={{
            fontSize: '11px',
            fontWeight: 'bold',
            color: '#666',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            PYTHON CODE
          </span>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <CodePanel 
            code={code} 
            currentLine={currentLine}
            executionEvents={executionEvents}
          />
        </div>
      </div>
      
      {/* CENTER: 3D Visualization */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [0, 1, 18], fov: 50 }}>
          <HardwareScene3D
            executionEvents={executionEvents}
            isRunning={isRunning}
            zoomLevel={zoomLevel}
            viewMode={viewMode}
            pipelineStage={pipelineStage}
            memoryLevel={memoryLevel}
          />
        </Canvas>
        
        {/* Zoom Level Indicator */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(0, 0, 0, 0.85)',
          borderRadius: '8px',
          padding: '10px 14px',
          fontFamily: "'JetBrains Mono', monospace",
          border: `1px solid ${currentConfig.color}44`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>{currentConfig.icon}</span>
            <div>
              <div style={{ color: currentConfig.color, fontSize: '12px', fontWeight: 'bold' }}>
                {currentConfig.name}
              </div>
              <div style={{ fontSize: '9px', color: '#555' }}>
                {currentConfig.description}
              </div>
            </div>
          </div>
        </div>
        
        {/* Zoom Level Quick Select */}
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          {ZOOM_CONFIGS.map((config) => (
            <button
              key={config.level}
              onClick={() => setZoomLevel(config.level)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: zoomLevel === config.level ? `2px solid ${config.color}` : '1px solid #333',
                background: zoomLevel === config.level ? `${config.color}22` : 'rgba(0,0,0,0.6)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
              }}
              title={`${config.name}: ${config.description}`}
            >
              {config.icon}
            </button>
          ))}
        </div>
        
        {/* View Mode Toggle */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          display: 'flex',
          gap: '6px',
        }}>
          {[
            { mode: 'standard' as ViewMode, icon: <Eye size={12} />, label: 'Standard' },
            { mode: 'pipeline' as ViewMode, icon: <Layers size={12} />, label: 'Pipeline' },
            { mode: 'thermal' as ViewMode, icon: <Thermometer size={12} />, label: 'Thermal' },
          ].map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: viewMode === mode ? '1px solid #00FFFF' : '1px solid #333',
                background: viewMode === mode ? 'rgba(0, 255, 255, 0.15)' : 'rgba(0,0,0,0.6)',
                color: viewMode === mode ? '#00FFFF' : '#555',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>
      
      {/* RIGHT: Educational Sidebar */}
      <div style={{
        width: '280px',
        borderLeft: '1px solid #1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        background: '#0f0f1a',
      }}>
        <div style={{
          padding: '10px 14px',
          borderBottom: '1px solid #1a1a2e',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Info style={{ width: 14, height: 14, color: '#00FFFF' }} />
          <span style={{
            fontSize: '11px',
            fontWeight: 'bold',
            color: '#666',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            DEEP DIVE
          </span>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <EducationalSidebar 
            event={latestEvent}
            pipelineStage={pipelineStage}
            memoryLevel={memoryLevel}
            zoomLevel={zoomLevel}
          />
        </div>
      </div>
    </div>
  );
}

export default HardwareMode3DAccurate;
