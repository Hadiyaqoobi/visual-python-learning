"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Float, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { 
  Zap, Thermometer, Eye,
  ZoomIn, ZoomOut,
  Sparkles as SparklesIcon
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
  { level: 1 as ZoomLevel, name: 'Python', icon: '🐍', color: '#3572A5', cameraZ: 25, description: 'High-level code' },
  { level: 2 as ZoomLevel, name: 'Bytecode', icon: '📦', color: '#F97316', cameraZ: 20, description: 'Python instructions' },
  { level: 3 as ZoomLevel, name: 'Assembly', icon: '⚙️', color: '#8B5CF6', cameraZ: 15, description: 'CPU instructions' },
  { level: 4 as ZoomLevel, name: 'Gates', icon: '🔌', color: '#22C55E', cameraZ: 10, description: 'Logic circuits' },
  { level: 5 as ZoomLevel, name: 'Electrons', icon: '⚡', color: '#00AAFF', cameraZ: 6, description: 'Particle flow' },
];

// ============================================
// CPU COMPONENT 3D
// ============================================
function CPUComponent3D({ 
  position, 
  size, 
  color, 
  label, 
  icon,
  active = false,
  temperature = 25,
  showThermal = false,
}: { 
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  label: string;
  icon: string;
  active?: boolean;
  temperature?: number;
  showThermal?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      if (active) {
        const pulse = 1 + Math.sin(clock.elapsedTime * 4) * 0.03;
        meshRef.current.scale.set(pulse, pulse, pulse);
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }
    }
    if (glowRef.current && active) {
      glowRef.current.rotation.y = clock.elapsedTime * 0.5;
    }
  });

  const getThermalColor = (temp: number) => {
    if (temp < 35) return '#0088FF';
    if (temp < 50) return '#00FF88';
    if (temp < 70) return '#FFAA00';
    return '#FF4444';
  };

  const displayColor = showThermal ? getThermalColor(temperature) : color;
  const emissiveIntensity = active ? 0.6 : 0.15;

  return (
    <group position={position}>
      {/* Main box */}
      <mesh ref={meshRef}>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={displayColor}
          emissive={displayColor}
          emissiveIntensity={emissiveIntensity}
          metalness={0.7}
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
          opacity={active ? 1 : 0.5}
        />
      </lineSegments>
      
      {/* Active glow ring */}
      {active && (
        <mesh ref={glowRef} position={[0, 0, 0]}>
          <torusGeometry args={[Math.max(size[0], size[1]) * 0.6, 0.02, 8, 32]} />
          <meshBasicMaterial color="#00FFFF" transparent opacity={0.6} />
        </mesh>
      )}
      
      {/* Sparkles when active */}
      {active && (
        <Sparkles
          count={20}
          scale={[size[0] * 1.5, size[1] * 1.5, size[2] * 1.5]}
          size={2}
          speed={0.5}
          color="#00FFFF"
        />
      )}
      
      {/* Label */}
      <Html position={[0, size[1] / 2 + 0.3, 0]} center distanceFactor={15}>
        <div style={{
          background: active ? 'rgba(0, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          padding: '6px 12px',
          borderRadius: '6px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          color: active ? '#00FFFF' : '#888',
          whiteSpace: 'nowrap',
          border: active ? '1px solid rgba(0, 255, 255, 0.4)' : '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: active ? '0 0 15px rgba(0, 255, 255, 0.3)' : 'none',
        }}>
          <span>{icon}</span>
          <span>{label}</span>
          {showThermal && (
            <span style={{ color: getThermalColor(temperature), marginLeft: '4px' }}>
              {temperature}°C
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}

// ============================================
// ELECTRON PARTICLES
// ============================================
function ElectronParticles({ 
  active, 
  pathType,
  count = 100 
}: { 
  active: boolean;
  pathType: 'control-to-alu' | 'alu-to-register' | 'register-to-memory' | 'memory-to-register' | 'input';
  count?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const positionsRef = useRef<Float32Array>(new Float32Array(count * 3));
  const lifesRef = useRef<Float32Array>(new Float32Array(count));
  
  // Path definitions
  const paths: Record<string, { start: number[], end: number[], control?: number[] }> = {
    'control-to-alu': { start: [-3, 1.5, 0], end: [0, 0, 0], control: [-1, 1, 0] },
    'alu-to-register': { start: [0, 0, 0], end: [3, -0.5, 0], control: [1.5, -0.5, 0] },
    'register-to-memory': { start: [3, -0.5, 0], end: [0, -2.5, 0], control: [2, -2, 0] },
    'memory-to-register': { start: [0, -2.5, 0], end: [3, -0.5, 0], control: [2, -2, 0] },
    'input': { start: [-5, 1, 0], end: [-3, 1.5, 0] },
  };
  
  const currentPath = paths[pathType] || paths['input'];
  
  // Initialize particles
  useEffect(() => {
    for (let i = 0; i < count; i++) {
      positionsRef.current[i * 3] = currentPath.start[0];
      positionsRef.current[i * 3 + 1] = currentPath.start[1];
      positionsRef.current[i * 3 + 2] = currentPath.start[2];
      lifesRef.current[i] = -(i / count) * 2; // Stagger spawn
    }
  }, [count, currentPath]);
  
  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      lifesRef.current[i] += delta * 1.5;
      
      if (lifesRef.current[i] < 0) continue;
      
      const t = Math.min(lifesRef.current[i], 1);
      
      // Bezier interpolation
      const start = currentPath.start;
      const end = currentPath.end;
      const ctrl = currentPath.control || [
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2,
        (start[2] + end[2]) / 2,
      ];
      
      const invT = 1 - t;
      positions[i * 3] = invT * invT * start[0] + 2 * invT * t * ctrl[0] + t * t * end[0];
      positions[i * 3 + 1] = invT * invT * start[1] + 2 * invT * t * ctrl[1] + t * t * end[1];
      positions[i * 3 + 2] = invT * invT * start[2] + 2 * invT * t * ctrl[2] + t * t * end[2];
      
      // Add slight randomness
      positions[i * 3] += (Math.random() - 0.5) * 0.05;
      positions[i * 3 + 1] += (Math.random() - 0.5) * 0.05;
      
      // Reset when done
      if (lifesRef.current[i] >= 1) {
        lifesRef.current[i] = -Math.random() * 0.5;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  if (!active) return null;
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positionsRef.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#00AAFF"
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ============================================
// DATA BUS VISUALIZATION
// ============================================
function DataBus({ active }: { active: boolean }) {
  return (
    <group>
      {/* Horizontal bus */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[8, 0.05, 0.05]} />
        <meshBasicMaterial 
          color={active ? '#00AAFF' : '#333'} 
          transparent 
          opacity={active ? 0.8 : 0.3}
        />
      </mesh>
      
      {/* Vertical connections */}
      {[[-3, 0.3], [0, 1.2], [3, 0.7]].map(([x, height], i) => (
        <mesh key={i} position={[x, -1.2 + height / 2, 0]}>
          <boxGeometry args={[0.05, height, 0.05]} />
          <meshBasicMaterial 
            color={active ? '#00AAFF' : '#333'} 
            transparent 
            opacity={active ? 0.8 : 0.3}
          />
        </mesh>
      ))}
      
      {/* Bus label */}
      <Html position={[0, -1.5, 0]} center>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '9px',
          color: active ? '#00AAFF' : '#555',
          letterSpacing: '2px',
        }}>
          DATA BUS
        </div>
      </Html>
    </group>
  );
}

// ============================================
// ZOOM LEVEL OVERLAY
// ============================================
function ZoomLevelOverlay({ 
  level, 
  code, 
  currentLine 
}: { 
  level: ZoomLevel; 
  code: string;
  currentLine: number;
}) {
  const config = ZOOM_CONFIGS.find(c => c.level === level)!;
  
  const getContent = () => {
    const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
    
    switch (level) {
      case 1:
        return lines.map((line, i) => ({
          text: line,
          active: i === currentLine - 1,
        }));
      
      case 2:
        return lines.flatMap((line, i) => {
          const ops = [];
          if (line.includes('=') && !line.includes('==')) {
            if (line.includes('+') || line.includes('-') || line.includes('*')) {
              ops.push({ text: `LOAD_NAME ${line.split('=')[1].split(/[+\-*/]/)[0].trim()}`, active: i === currentLine - 1 });
              ops.push({ text: `BINARY_OP`, active: i === currentLine - 1 });
            } else {
              ops.push({ text: `LOAD_CONST ${line.split('=')[1].trim()}`, active: i === currentLine - 1 });
            }
            ops.push({ text: `STORE_NAME ${line.split('=')[0].trim()}`, active: i === currentLine - 1 });
          } else if (line.includes('print')) {
            ops.push({ text: `LOAD_NAME print`, active: i === currentLine - 1 });
            ops.push({ text: `CALL_FUNCTION 1`, active: i === currentLine - 1 });
          }
          return ops;
        });
      
      case 3:
        return lines.flatMap((line, i) => {
          const ops = [];
          if (line.includes('=')) {
            ops.push({ text: `MOV EAX, [value]`, active: i === currentLine - 1 });
            ops.push({ text: `MOV [${line.split('=')[0].trim()}], EAX`, active: i === currentLine - 1 });
          }
          return ops;
        });
      
      case 4:
        return [
          { text: 'AND Gate → Active', active: true },
          { text: 'OR Gate → Ready', active: false },
          { text: 'XOR Gate → Computing', active: currentLine > 2 },
        ];
      
      default:
        return [];
    }
  };
  
  const content = getContent();
  
  if (level === 5) return null;
  
  return (
    <Html position={[-4, 3, 0]} transform distanceFactor={20}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '16px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '12px',
        minWidth: '280px',
        maxHeight: '300px',
        overflowY: 'auto',
        border: `1px solid ${config.color}44`,
        boxShadow: `0 0 30px ${config.color}33`,
      }}>
        <div style={{ 
          color: config.color, 
          fontSize: '11px', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: `1px solid ${config.color}33`,
          paddingBottom: '8px',
        }}>
          <span>{config.icon}</span>
          <span style={{ fontWeight: 'bold' }}>{config.name.toUpperCase()}</span>
          <span style={{ marginLeft: 'auto', color: '#666' }}>Level {level}</span>
        </div>
        
        {content.slice(0, 10).map((item, i) => (
          <div
            key={i}
            style={{
              padding: '4px 8px',
              marginBottom: '4px',
              borderRadius: '4px',
              background: item.active ? `${config.color}22` : 'transparent',
              borderLeft: item.active ? `3px solid ${config.color}` : '3px solid transparent',
              color: item.active ? '#fff' : '#666',
            }}
          >
            {item.text}
          </div>
        ))}
      </div>
    </Html>
  );
}

// ============================================
// CAMERA CONTROLLER
// ============================================
function CameraController({ zoomLevel }: { zoomLevel: ZoomLevel }) {
  const { camera } = useThree();
  const targetZ = ZOOM_CONFIGS.find(c => c.level === zoomLevel)?.cameraZ || 20;
  
  useEffect(() => {
    gsap.to(camera.position, {
      z: targetZ,
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
  currentLine,
  isRunning,
  code,
  zoomLevel,
  viewMode,
}: HardwareMode3DProps & { zoomLevel: ZoomLevel; viewMode: ViewMode }) {
  const latestEvent = executionEvents[executionEvents.length - 1];
  const showThermal = viewMode === 'thermal';
  
  const activeComponent = useMemo(() => {
    if (!latestEvent || !isRunning) return null;
    switch (latestEvent.type) {
      case 'ASSIGNMENT':
      case 'ARITHMETIC':
        return latestEvent.operator ? 'alu' : 'control';
      case 'MEMORY_READ':
      case 'MEMORY_WRITE':
        return 'memory';
      default:
        return 'control';
    }
  }, [latestEvent, isRunning]);
  
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
  
  const electronPaths = useMemo(() => {
    if (!latestEvent || zoomLevel < 4) return [];
    
    switch (latestEvent.type) {
      case 'ASSIGNMENT':
        return latestEvent.operator 
          ? ['control-to-alu', 'alu-to-register']
          : ['input', 'control-to-alu', 'alu-to-register'];
      case 'ARITHMETIC':
        return ['control-to-alu', 'alu-to-register'];
      case 'MEMORY_WRITE':
        return ['register-to-memory'];
      case 'MEMORY_READ':
        return ['memory-to-register'];
      default:
        return ['input'];
    }
  }, [latestEvent, zoomLevel]);

  return (
    <>
      <color attach="background" args={['#0A0A1E']} />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00AAFF" />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#FF00FF" />
      <pointLight position={[0, -10, 5]} intensity={0.3} color="#22C55E" />
      
      <CameraController zoomLevel={zoomLevel} />
      
      <CPUComponent3D
        position={[-3, 1.5, 0]}
        size={[2, 1.2, 0.8]}
        color="#F97316"
        label="Control Unit"
        icon="🎛️"
        active={activeComponent === 'control' && isRunning}
        temperature={temperatures.control}
        showThermal={showThermal}
      />
      
      <CPUComponent3D
        position={[0, 0, 0]}
        size={[2.5, 1.5, 1]}
        color="#22C55E"
        label="ALU"
        icon="🔢"
        active={activeComponent === 'alu' && isRunning}
        temperature={temperatures.alu}
        showThermal={showThermal}
      />
      
      <CPUComponent3D
        position={[3, -0.5, 0]}
        size={[1.8, 1, 0.8]}
        color="#8B5CF6"
        label="Registers"
        icon="📦"
        active={activeComponent === 'registers' && isRunning}
        temperature={temperatures.registers}
        showThermal={showThermal}
      />
      
      <CPUComponent3D
        position={[0, -2.5, 0]}
        size={[3, 0.8, 0.8]}
        color="#3B82F6"
        label="Memory"
        icon="💾"
        active={activeComponent === 'memory' && isRunning}
        temperature={temperatures.memory}
        showThermal={showThermal}
      />
      
      <DataBus active={isRunning} />
      
      {viewMode === 'electrons' && electronPaths.map((path, i) => (
        <ElectronParticles 
          key={`${path}-${i}`}
          active={isRunning} 
          pathType={path as any}
          count={50}
        />
      ))}
      
      <ZoomLevelOverlay level={zoomLevel} code={code} currentLine={currentLine} />
      
      <gridHelper 
        args={[30, 30, '#1a1a3e', '#1a1a3e']} 
        position={[0, -4, 0]} 
      />
      
      <OrbitControls 
        enablePan={false}
        minDistance={5}
        maxDistance={30}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
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
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY > 0) handleZoomIn();
        else handleZoomOut();
      }
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleZoomIn, handleZoomOut]);

  const currentConfig = ZOOM_CONFIGS.find(c => c.level === zoomLevel)!;

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      background: '#0A0A1E', 
      borderRadius: '12px', 
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Canvas camera={{ position: [0, 2, 20], fov: 50 }}>
        <HardwareScene3D
          executionEvents={executionEvents}
          currentLine={currentLine}
          isRunning={isRunning}
          code={code}
          zoomLevel={zoomLevel}
          viewMode={viewMode}
        />
      </Canvas>
      
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '4px',
        }}>
          <SparklesIcon style={{ width: 20, height: 20, color: '#00FFFF' }} />
          <span style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#00FFFF',
            textShadow: '0 0 15px rgba(0,255,255,0.5)',
          }}>
            3D HARDWARE MODE
          </span>
        </div>
        <div style={{ fontSize: '11px', color: '#666' }}>
          Ctrl+Scroll to zoom through layers
        </div>
      </div>
      
      {/* Current Zoom Level */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        padding: '12px 16px',
        fontFamily: "'JetBrains Mono', monospace",
        border: `1px solid ${currentConfig.color}44`,
      }}>
        <div style={{ fontSize: '24px', textAlign: 'center', marginBottom: '6px' }}>
          {currentConfig.icon}
        </div>
        <div style={{ 
          color: currentConfig.color, 
          fontSize: '13px', 
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
          {currentConfig.name}
        </div>
        <div style={{ 
          color: '#666', 
          fontSize: '10px',
          textAlign: 'center',
          marginTop: '2px',
        }}>
          Level {zoomLevel}/5
        </div>
      </div>
      
      {/* Zoom Level Sidebar */}
      <div style={{
        position: 'absolute',
        right: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
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
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: zoomLevel === config.level 
                ? `2px solid ${config.color}`
                : '1px solid #333',
              background: zoomLevel === config.level 
                ? `${config.color}22`
                : 'rgba(0,0,0,0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              transition: 'all 0.2s',
            }}
            title={config.name}
          >
            {config.icon}
          </button>
        ))}
      </div>
      
      {/* View Mode Toggle */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        display: 'flex',
        gap: '8px',
      }}>
        {[
          { mode: 'electrons' as ViewMode, icon: <Zap size={14} />, label: 'Electrons' },
          { mode: 'thermal' as ViewMode, icon: <Thermometer size={14} />, label: 'Thermal' },
          { mode: 'standard' as ViewMode, icon: <Eye size={14} />, label: 'Standard' },
        ].map(({ mode, icon, label }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: viewMode === mode ? '1px solid #00FFFF' : '1px solid #333',
              background: viewMode === mode ? 'rgba(0, 255, 255, 0.1)' : 'rgba(0,0,0,0.6)',
              color: viewMode === mode ? '#00FFFF' : '#666',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
      
      {/* Zoom Controls */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        display: 'flex',
        gap: '8px',
      }}>
        <button
          onClick={handleZoomOut}
          disabled={zoomLevel === 1 || isAnimating}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #333',
            background: zoomLevel > 1 ? 'rgba(0, 170, 255, 0.1)' : 'rgba(50,50,50,0.5)',
            color: zoomLevel > 1 ? '#00AAFF' : '#444',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            cursor: zoomLevel > 1 && !isAnimating ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <ZoomOut size={14} />
          Zoom Out
        </button>
        
        <button
          onClick={handleZoomIn}
          disabled={zoomLevel === 5 || isAnimating}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            background: zoomLevel < 5 
              ? 'linear-gradient(135deg, #00AAFF, #FF00FF)' 
              : 'rgba(50,50,50,0.5)',
            color: zoomLevel < 5 ? '#fff' : '#444',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            cursor: zoomLevel < 5 && !isAnimating ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: zoomLevel < 5 ? '0 0 15px rgba(0, 170, 255, 0.3)' : 'none',
          }}
        >
          <ZoomIn size={14} />
          Zoom In
        </button>
      </div>
      
      {/* Stats */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        left: '16px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '10px',
        color: '#555',
      }}>
        <div>Events: {executionEvents.length}</div>
        <div>Line: {currentLine}</div>
        <div>Status: {isRunning ? '🟢 Running' : '⚪ Idle'}</div>
      </div>
    </div>
  );
}

export default HardwareMode3D;
