"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Float, Sparkles, Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { 
  Zap, Thermometer, Eye, Info,
  ZoomIn, ZoomOut, ChevronRight,
  Sparkles as SparklesIcon, Cpu, Database, Calculator, Box
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
export type ZoomLevel = 1 | 2 | 3 | 4 | 5;
export type ViewMode = 'electrons' | 'thermal' | 'standard';

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
// ZOOM LEVEL CONFIGS  
// ============================================
const ZOOM_CONFIGS = [
  { level: 1 as ZoomLevel, name: 'Python', icon: '🐍', color: '#3572A5', cameraZ: 18 },
  { level: 2 as ZoomLevel, name: 'Bytecode', icon: '📦', color: '#F97316', cameraZ: 15 },
  { level: 3 as ZoomLevel, name: 'Assembly', icon: '⚙️', color: '#8B5CF6', cameraZ: 12 },
  { level: 4 as ZoomLevel, name: 'Gates', icon: '🔌', color: '#22C55E', cameraZ: 9 },
  { level: 5 as ZoomLevel, name: 'Electrons', icon: '⚡', color: '#00AAFF', cameraZ: 6 },
];

// ============================================
// BEAUTIFUL CPU COMPONENT 3D
// ============================================
function CPUComponent3D({ 
  position, 
  size, 
  color, 
  label, 
  icon,
  description,
  active = false,
  temperature = 25,
  showThermal = false,
  currentValue,
}: { 
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  active?: boolean;
  temperature?: number;
  showThermal?: boolean;
  currentValue?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      if (active) {
        const pulse = 1 + Math.sin(clock.elapsedTime * 4) * 0.05;
        meshRef.current.scale.set(pulse, pulse, pulse);
      } else {
        gsap.to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
      }
    }
    if (glowRef.current && active) {
      glowRef.current.rotation.z = clock.elapsedTime * 0.5;
    }
  });

  const getThermalColor = (temp: number) => {
    if (temp < 35) return '#0088FF';
    if (temp < 50) return '#00FF88';
    if (temp < 70) return '#FFAA00';
    return '#FF4444';
  };

  const displayColor = showThermal ? getThermalColor(temperature) : color;

  return (
    <group position={position}>
      {/* Outer glow when active */}
      {active && (
        <mesh ref={glowRef}>
          <ringGeometry args={[Math.max(size[0], size[1]) * 0.7, Math.max(size[0], size[1]) * 0.85, 32]} />
          <meshBasicMaterial color="#00FFFF" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
      
      {/* Main component box */}
      <Float speed={active ? 4 : 1} rotationIntensity={0} floatIntensity={active ? 0.2 : 0.05}>
        <mesh ref={meshRef}>
          <boxGeometry args={size} />
          <meshStandardMaterial
            color={displayColor}
            emissive={displayColor}
            emissiveIntensity={active ? 0.8 : 0.2}
            metalness={0.6}
            roughness={0.3}
            transparent
            opacity={0.95}
          />
        </mesh>
        
        {/* Glowing edges */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
          <lineBasicMaterial 
            color={active ? '#00FFFF' : '#444'} 
            transparent 
            opacity={active ? 1 : 0.4}
          />
        </lineSegments>
      </Float>
      
      {/* Sparkles when active */}
      {active && (
        <Sparkles
          count={30}
          scale={[size[0] * 2, size[1] * 2, size[2] * 2]}
          size={3}
          speed={0.8}
          color="#00FFFF"
        />
      )}
      
      {/* Label - LARGE and CLEAR */}
      <Html position={[0, -size[1] / 2 - 0.6, 0]} center distanceFactor={10}>
        <div style={{
          textAlign: 'center',
          fontFamily: "'JetBrains Mono', monospace",
          pointerEvents: 'none',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: active ? '#00FFFF' : '#888',
            textShadow: active ? '0 0 20px rgba(0,255,255,0.8)' : 'none',
            marginBottom: '4px',
          }}>
            {label}
          </div>
          {active && currentValue && (
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#FFD700',
              background: 'rgba(0,0,0,0.8)',
              padding: '4px 12px',
              borderRadius: '6px',
              border: '1px solid #FFD700',
              textShadow: '0 0 10px rgba(255,215,0,0.8)',
            }}>
              {currentValue}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

// ============================================
// ELECTRON FLOW PATH - VISIBLE ANIMATED PARTICLES
// ============================================
function ElectronFlowPath({ 
  start, 
  end, 
  control,
  active,
  color = '#00AAFF',
  particleCount = 30,
}: { 
  start: [number, number, number];
  end: [number, number, number];
  control?: [number, number, number];
  active: boolean;
  color?: string;
  particleCount?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleData = useRef<{ t: number; speed: number }[]>([]);
  
  // Generate curve points for the path line
  const curvePoints = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...(control || [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2 + 1, 0])),
      new THREE.Vector3(...end)
    );
    return curve.getPoints(50);
  }, [start, end, control]);
  
  // Initialize particle data
  useEffect(() => {
    particleData.current = Array(particleCount).fill(null).map((_, i) => ({
      t: i / particleCount,
      speed: 0.3 + Math.random() * 0.2,
    }));
  }, [particleCount]);
  
  // Create positions buffer
  const positions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
  
  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return;
    
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...(control || [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2 + 1, 0])),
      new THREE.Vector3(...end)
    );
    
    particleData.current.forEach((particle, i) => {
      particle.t += delta * particle.speed;
      if (particle.t > 1) particle.t = 0;
      
      const point = curve.getPoint(particle.t);
      posArray[i * 3] = point.x + (Math.random() - 0.5) * 0.1;
      posArray[i * 3 + 1] = point.y + (Math.random() - 0.5) * 0.1;
      posArray[i * 3 + 2] = point.z + (Math.random() - 0.5) * 0.1;
    });
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <group>
      {/* Path line (always visible but dim when inactive) */}
      <Line 
          points={curvePoints.map(p => [p.x, p.y, p.z])} 
          color={active ? color : '#333'} 
          lineWidth={2}
          transparent
          opacity={active ? 0.6 : 0.2}
        />
      
      {/* Flowing particles */}
      {active && (
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.15}
            color={color}
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
      
      {/* Arrow at end */}
      {active && (
        <mesh position={end}>
          <coneGeometry args={[0.15, 0.3, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      )}
    </group>
  );
}

// ============================================
// DATA BUS - HORIZONTAL CONNECTION
// ============================================
function DataBus({ active }: { active: boolean }) {
  return (
    <group position={[0, -2, 0]}>
      <mesh>
        <boxGeometry args={[10, 0.08, 0.08]} />
        <meshBasicMaterial 
          color={active ? '#00AAFF' : '#333'} 
          transparent 
          opacity={active ? 0.8 : 0.3}
        />
      </mesh>
      
      <Html position={[0, -0.4, 0]} center>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          color: active ? '#00AAFF' : '#444',
          letterSpacing: '3px',
          fontWeight: 'bold',
        }}>
          ══════ DATA BUS ══════
        </div>
      </Html>
    </group>
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
      y: 2,
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
  activeFlow,
}: {
  executionEvents: ExecutionEvent[];
  isRunning: boolean;
  zoomLevel: ZoomLevel;
  viewMode: ViewMode;
  activeFlow: string | null;
}) {
  const latestEvent = executionEvents[executionEvents.length - 1];
  const showThermal = viewMode === 'thermal';
  
  // Determine what's active
  const activeComponent = useMemo(() => {
    if (!latestEvent || !isRunning) return null;
    switch (latestEvent.type) {
      case 'ASSIGNMENT':
        return latestEvent.operator ? 'alu' : 'control';
      case 'ARITHMETIC':
        return 'alu';
      case 'MEMORY_READ':
      case 'MEMORY_WRITE':
        return 'memory';
      case 'PRINT':
        return 'output';
      default:
        return 'control';
    }
  }, [latestEvent, isRunning]);
  
  // Current values to display
  const currentValues = useMemo(() => {
    if (!latestEvent) return {};
    return {
      control: latestEvent.code?.slice(0, 20),
      alu: latestEvent.operator ? `${latestEvent.operand1} ${latestEvent.operator} ${latestEvent.operand2}` : null,
      registers: latestEvent.variable ? `${latestEvent.variable} = ${latestEvent.value || '?'}` : null,
      memory: latestEvent.type === 'MEMORY_WRITE' ? 'WRITE' : latestEvent.type === 'MEMORY_READ' ? 'READ' : null,
    };
  }, [latestEvent]);
  
  // Calculate temperatures
  const temperatures = useMemo(() => {
    const base = 25;
    const eventCount = executionEvents.length;
    return {
      control: base + (activeComponent === 'control' ? 30 : eventCount * 2),
      alu: base + (activeComponent === 'alu' ? 45 : eventCount * 3),
      registers: base + eventCount * 2,
      memory: base + (activeComponent === 'memory' ? 20 : eventCount),
    };
  }, [executionEvents.length, activeComponent]);

  return (
    <>
      <color attach="background" args={['#0A0A1E']} />
      
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#00AAFF" />
      <pointLight position={[-10, 10, -10]} intensity={0.6} color="#FF00FF" />
      <pointLight position={[0, -5, 5]} intensity={0.4} color="#22C55E" />
      
      <CameraController zoomLevel={zoomLevel} />
      
      {/* ====== CPU COMPONENTS ====== */}
      
      {/* Control Unit - Top Left */}
      <CPUComponent3D
        position={[-3, 2, 0]}
        size={[2.5, 1.5, 1]}
        color="#F97316"
        label="CONTROL UNIT"
        icon={<Cpu />}
        description="Fetches & decodes instructions"
        active={activeComponent === 'control' && isRunning}
        temperature={temperatures.control}
        showThermal={showThermal}
        currentValue={activeComponent === 'control' ? currentValues.control : undefined}
      />
      
      {/* ALU - Top Right */}
      <CPUComponent3D
        position={[3, 2, 0]}
        size={[2.5, 1.5, 1]}
        color="#22C55E"
        label="ALU"
        icon={<Calculator />}
        description="Arithmetic & Logic Unit"
        active={activeComponent === 'alu' && isRunning}
        temperature={temperatures.alu}
        showThermal={showThermal}
        currentValue={activeComponent === 'alu' ? currentValues.alu || undefined : undefined}
      />
      
      {/* Registers - Middle */}
      <CPUComponent3D
        position={[0, 0, 0]}
        size={[3, 1.2, 1]}
        color="#8B5CF6"
        label="REGISTERS"
        icon={<Box />}
        description="Fast temporary storage"
        active={activeComponent === 'registers' && isRunning}
        temperature={temperatures.registers}
        showThermal={showThermal}
        currentValue={currentValues.registers || undefined}
      />
      
      {/* Memory - Bottom */}
      <CPUComponent3D
        position={[0, -3.5, 0]}
        size={[4, 1, 1]}
        color="#3B82F6"
        label="MEMORY (RAM)"
        icon={<Database />}
        description="Main memory storage"
        active={activeComponent === 'memory' && isRunning}
        temperature={temperatures.memory}
        showThermal={showThermal}
        currentValue={currentValues.memory || undefined}
      />
      
      {/* ====== DATA FLOW PATHS ====== */}
      
      {/* Control → ALU */}
      <ElectronFlowPath
        start={[-1.5, 2, 0]}
        end={[1.5, 2, 0]}
        active={activeFlow === 'control-to-alu' && viewMode === 'electrons'}
        color="#F97316"
        particleCount={25}
      />
      
      {/* Control → Registers */}
      <ElectronFlowPath
        start={[-2, 1.2, 0]}
        end={[-1, 0.6, 0]}
        control={[-1.5, 0.9, 0]}
        active={activeFlow === 'control-to-registers' && viewMode === 'electrons'}
        color="#F97316"
        particleCount={20}
      />
      
      {/* ALU → Registers */}
      <ElectronFlowPath
        start={[2, 1.2, 0]}
        end={[1, 0.6, 0]}
        control={[1.5, 0.9, 0]}
        active={activeFlow === 'alu-to-registers' && viewMode === 'electrons'}
        color="#22C55E"
        particleCount={25}
      />
      
      {/* Registers → ALU */}
      <ElectronFlowPath
        start={[1, 0.6, 0]}
        end={[2, 1.2, 0]}
        control={[1.5, 0.9, 0]}
        active={activeFlow === 'registers-to-alu' && viewMode === 'electrons'}
        color="#8B5CF6"
        particleCount={20}
      />
      
      {/* Registers → Memory */}
      <ElectronFlowPath
        start={[0, -0.6, 0]}
        end={[0, -3, 0]}
        active={activeFlow === 'registers-to-memory' && viewMode === 'electrons'}
        color="#8B5CF6"
        particleCount={30}
      />
      
      {/* Memory → Registers */}
      <ElectronFlowPath
        start={[0.5, -3, 0]}
        end={[0.5, -0.6, 0]}
        active={activeFlow === 'memory-to-registers' && viewMode === 'electrons'}
        color="#3B82F6"
        particleCount={30}
      />
      
      {/* Data Bus */}
      <DataBus active={isRunning} />
      
      {/* Grid */}
      <gridHelper 
        args={[20, 20, '#1a1a3e', '#1a1a3e']} 
        position={[0, -5, 0]} 
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
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  );
}

// ============================================
// STEP EXPLANATION COMPONENT
// ============================================
function StepExplanation({ 
  event, 
  stepNumber,
  activeFlow,
}: { 
  event: ExecutionEvent | null;
  stepNumber: number;
  activeFlow: string | null;
}) {
  if (!event) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#666',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎯</div>
        <div style={{ fontSize: '14px' }}>Click <strong style={{ color: '#00FFFF' }}>Step</strong> or <strong style={{ color: '#22C55E' }}>Auto Play</strong> to start</div>
        <div style={{ fontSize: '12px', marginTop: '8px', color: '#555' }}>
          Watch data flow through the CPU!
        </div>
      </div>
    );
  }
  
  const getExplanation = () => {
    switch (event.type) {
      case 'ASSIGNMENT':
        if (event.operator) {
          return {
            title: `Computing ${event.variable}`,
            steps: [
              { icon: '📥', text: `Load ${event.operand1} from registers`, flow: 'registers-to-alu' },
              { icon: '📥', text: `Load ${event.operand2} from registers`, flow: 'registers-to-alu' },
              { icon: '🔢', text: `ALU computes: ${event.operand1} ${event.operator} ${event.operand2}`, flow: 'control-to-alu' },
              { icon: '📤', text: `Store result in ${event.variable}`, flow: 'alu-to-registers' },
            ],
            color: '#22C55E',
          };
        }
        return {
          title: `Assigning ${event.variable} = ${event.value}`,
          steps: [
            { icon: '🎯', text: 'Control Unit decodes instruction', flow: 'control-to-registers' },
            { icon: '💾', text: `Load value ${event.value}`, flow: 'control-to-registers' },
            { icon: '📦', text: `Store in register ${event.variable}`, flow: 'control-to-registers' },
          ],
          color: '#F97316',
        };
      
      case 'ARITHMETIC':
        return {
          title: `Arithmetic: ${event.operand1} ${event.operator} ${event.operand2}`,
          steps: [
            { icon: '📥', text: `Fetch operands from registers`, flow: 'registers-to-alu' },
            { icon: '🔢', text: `ALU performs ${event.operator} operation`, flow: 'control-to-alu' },
            { icon: '📤', text: `Result stored in accumulator`, flow: 'alu-to-registers' },
          ],
          color: '#22C55E',
        };
      
      case 'MEMORY_WRITE':
        return {
          title: 'Writing to Memory',
          steps: [
            { icon: '📦', text: 'Data loaded from registers', flow: 'registers-to-memory' },
            { icon: '🚌', text: 'Sent via data bus', flow: 'registers-to-memory' },
            { icon: '💾', text: 'Written to RAM', flow: 'registers-to-memory' },
          ],
          color: '#3B82F6',
        };
      
      case 'MEMORY_READ':
        return {
          title: 'Reading from Memory',
          steps: [
            { icon: '🔍', text: 'Address sent to memory', flow: 'memory-to-registers' },
            { icon: '📤', text: 'Data retrieved from RAM', flow: 'memory-to-registers' },
            { icon: '📦', text: 'Loaded into registers', flow: 'memory-to-registers' },
          ],
          color: '#3B82F6',
        };
      
      case 'PRINT':
        return {
          title: 'Output to Console',
          steps: [
            { icon: '📦', text: 'Load data from registers', flow: 'registers-to-alu' },
            { icon: '🖥️', text: 'Send to I/O system', flow: 'alu-to-registers' },
            { icon: '✅', text: 'Display on screen', flow: null },
          ],
          color: '#EC4899',
        };
      
      default:
        return {
          title: 'Processing...',
          steps: [{ icon: '⚙️', text: 'Executing instruction', flow: null }],
          color: '#666',
        };
    }
  };
  
  const explanation = getExplanation();
  
  return (
    <div style={{ padding: '16px' }}>
      {/* Step counter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${explanation.color}, ${explanation.color}88)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '16px',
          color: '#fff',
          boxShadow: `0 0 20px ${explanation.color}66`,
        }}>
          {stepNumber}
        </div>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: explanation.color,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {explanation.title}
          </div>
          <div style={{
            fontSize: '11px',
            color: '#666',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            Line {event.line}: {event.code}
          </div>
        </div>
      </div>
      
      {/* Step breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {explanation.steps.map((step, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              background: activeFlow === step.flow ? `${explanation.color}22` : 'rgba(255,255,255,0.03)',
              borderRadius: '8px',
              borderLeft: activeFlow === step.flow ? `3px solid ${explanation.color}` : '3px solid transparent',
              transition: 'all 0.3s',
            }}
          >
            <span style={{ fontSize: '18px' }}>{step.icon}</span>
            <span style={{
              fontSize: '12px',
              color: activeFlow === step.flow ? '#fff' : '#888',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {step.text}
            </span>
            {activeFlow === step.flow && (
              <ChevronRight style={{ 
                width: 16, 
                height: 16, 
                color: explanation.color,
                marginLeft: 'auto',
                animation: 'pulse 1s infinite',
              }} />
            )}
          </div>
        ))}
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
      fontSize: '13px',
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
              padding: '4px 12px',
              background: isCurrent 
                ? 'linear-gradient(90deg, rgba(0,255,255,0.2), transparent)'
                : wasExecuted 
                  ? 'rgba(34,197,94,0.1)'
                  : 'transparent',
              borderLeft: isCurrent 
                ? '3px solid #00FFFF'
                : wasExecuted
                  ? '3px solid #22C55E'
                  : '3px solid transparent',
            }}
          >
            <span style={{
              width: '30px',
              color: isCurrent ? '#00FFFF' : '#555',
              textAlign: 'right',
              marginRight: '16px',
              userSelect: 'none',
            }}>
              {lineNum}
            </span>
            <span style={{
              color: isComment 
                ? '#6B7280' 
                : isCurrent 
                  ? '#fff'
                  : '#B0B0B0',
            }}>
              {line || ' '}
            </span>
            {isCurrent && (
              <span style={{
                marginLeft: '12px',
                fontSize: '10px',
                color: '#00FFFF',
                animation: 'pulse 1s infinite',
              }}>
                ◀ EXECUTING
              </span>
            )}
          </div>
        );
      })}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function HardwareMode3D({ 
  executionEvents, 
  currentLine, 
  isRunning, 
  code 
}: HardwareMode3DProps) {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(1);
  const [viewMode, setViewMode] = useState<ViewMode>('electrons');
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeFlow, setActiveFlow] = useState<string | null>(null);
  
  // Update active flow based on latest event
  useEffect(() => {
    if (!isRunning || executionEvents.length === 0) {
      setActiveFlow(null);
      return;
    }
    
    const event = executionEvents[executionEvents.length - 1];
    
    // Cycle through flows for the current operation
    const flows: string[] = [];
    switch (event.type) {
      case 'ASSIGNMENT':
        if (event.operator) {
          flows.push('registers-to-alu', 'control-to-alu', 'alu-to-registers');
        } else {
          flows.push('control-to-registers');
        }
        break;
      case 'ARITHMETIC':
        flows.push('registers-to-alu', 'alu-to-registers');
        break;
      case 'MEMORY_WRITE':
        flows.push('registers-to-memory');
        break;
      case 'MEMORY_READ':
        flows.push('memory-to-registers');
        break;
      default:
        flows.push('control-to-registers');
    }
    
    let flowIndex = 0;
    const interval = setInterval(() => {
      setActiveFlow(flows[flowIndex % flows.length]);
      flowIndex++;
    }, 500);
    
    return () => clearInterval(interval);
  }, [isRunning, executionEvents]);
  
  const handleZoomIn = useCallback(() => {
    if (zoomLevel < 5 && !isAnimating) {
      setIsAnimating(true);
      setZoomLevel(prev => (prev + 1) as ZoomLevel);
      setTimeout(() => setIsAnimating(false), 800);
    }
  }, [zoomLevel, isAnimating]);
  
  const handleZoomOut = useCallback(() => {
    if (zoomLevel > 1 && !isAnimating) {
      setIsAnimating(true);
      setZoomLevel(prev => (prev - 1) as ZoomLevel);
      setTimeout(() => setIsAnimating(false), 800);
    }
  }, [zoomLevel, isAnimating]);

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
        width: '280px',
        borderRight: '1px solid #1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        background: '#0f0f1a',
      }}>
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid #1a1a2e',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '16px' }}>🐍</span>
          <span style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#888',
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
        <Canvas camera={{ position: [0, 2, 18], fov: 50 }}>
          <HardwareScene3D
            executionEvents={executionEvents}
            isRunning={isRunning}
            zoomLevel={zoomLevel}
            viewMode={viewMode}
            activeFlow={activeFlow}
          />
        </Canvas>
        
        {/* Zoom Level Indicator */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          padding: '12px 16px',
          fontFamily: "'JetBrains Mono', monospace",
          border: `1px solid ${currentConfig.color}44`,
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '4px',
          }}>
            <span style={{ fontSize: '20px' }}>{currentConfig.icon}</span>
            <span style={{ 
              color: currentConfig.color, 
              fontSize: '14px', 
              fontWeight: 'bold',
            }}>
              {currentConfig.name}
            </span>
          </div>
          <div style={{ fontSize: '10px', color: '#666' }}>
            Zoom Level {zoomLevel}/5
          </div>
        </div>
        
        {/* View Mode Toggle */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          display: 'flex',
          gap: '6px',
        }}>
          {[
            { mode: 'electrons' as ViewMode, icon: <Zap size={12} />, label: 'Flow' },
            { mode: 'thermal' as ViewMode, icon: <Thermometer size={12} />, label: 'Heat' },
            { mode: 'standard' as ViewMode, icon: <Eye size={12} />, label: 'Clean' },
          ].map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: viewMode === mode ? '1px solid #00FFFF' : '1px solid #333',
                background: viewMode === mode ? 'rgba(0, 255, 255, 0.15)' : 'rgba(0,0,0,0.6)',
                color: viewMode === mode ? '#00FFFF' : '#666',
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
        
        {/* Zoom Buttons */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          display: 'flex',
          gap: '6px',
        }}>
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel === 1}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #333',
              background: zoomLevel > 1 ? 'rgba(0, 170, 255, 0.1)' : 'rgba(50,50,50,0.5)',
              color: zoomLevel > 1 ? '#00AAFF' : '#444',
              cursor: zoomLevel > 1 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel === 5}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              background: zoomLevel < 5 ? 'linear-gradient(135deg, #00AAFF, #FF00FF)' : 'rgba(50,50,50,0.5)',
              color: zoomLevel < 5 ? '#fff' : '#444',
              cursor: zoomLevel < 5 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <ZoomIn size={14} />
          </button>
        </div>
        
        {/* Zoom Level Quick Select */}
        <div style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          {ZOOM_CONFIGS.map((config) => (
            <button
              key={config.level}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setZoomLevel(config.level);
                  setTimeout(() => setIsAnimating(false), 800);
                }
              }}
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
              title={config.name}
            >
              {config.icon}
            </button>
          ))}
        </div>
      </div>
      
      {/* RIGHT: Explanation Panel */}
      <div style={{
        width: '300px',
        borderLeft: '1px solid #1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        background: '#0f0f1a',
      }}>
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid #1a1a2e',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Info style={{ width: 16, height: 16, color: '#00FFFF' }} />
          <span style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#888',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            WHAT'S HAPPENING
          </span>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <StepExplanation 
            event={latestEvent}
            stepNumber={executionEvents.length}
            activeFlow={activeFlow}
          />
        </div>
        
        {/* Legend */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #1a1a2e',
        }}>
          <div style={{
            fontSize: '10px',
            color: '#555',
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: '8px',
          }}>
            COMPONENTS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { color: '#F97316', label: 'Control' },
              { color: '#22C55E', label: 'ALU' },
              { color: '#8B5CF6', label: 'Registers' },
              { color: '#3B82F6', label: 'Memory' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                <span style={{ fontSize: '10px', color: '#888', fontFamily: "'JetBrains Mono', monospace" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HardwareMode3D;
