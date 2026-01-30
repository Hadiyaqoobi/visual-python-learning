"use client";

import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Html, 
  Environment,
  Float,
  MeshTransmissionMaterial,
  Sparkles, Line
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

// Particle system for effects
function ParticleBurst({ position, active }: { position: THREE.Vector3; active: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 50;
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 0.05 + Math.random() * 0.1;
      
      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      vel[i * 3 + 2] = Math.cos(phi) * speed;
    }
    
    return [pos, vel];
  }, []);

  useFrame(() => {
    if (!particlesRef.current || !active) return;
    
    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] += velocities[i * 3];
      posArray[i * 3 + 1] += velocities[i * 3 + 1];
      posArray[i * 3 + 2] += velocities[i * 3 + 2];
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#00FFFF"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Glowing bit cube component
function BitCube({ 
  position, 
  value, 
  power, 
  index,
  onToggle 
}: { 
  position: [number, number, number];
  value: boolean;
  power: number;
  index: number;
  onToggle: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [bursting, setBursting] = useState(false);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    // Floating animation
    meshRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2 + index) * 0.15;
    
    // Rotation for active bits
    if (value) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime) * 0.1;
    }
    
    // Pulsing glow
    if (glowRef.current && value) {
      const scale = 1.2 + Math.sin(clock.elapsedTime * 3) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }
  });

  const handleClick = useCallback(() => {
    if (meshRef.current) {
      // Burst animation
      setBursting(true);
      setTimeout(() => setBursting(false), 500);
      
      // Scale animation
      gsap.to(meshRef.current.scale, {
        x: value ? 0.3 : 1.2,
        y: value ? 0.3 : 1.2,
        z: value ? 0.3 : 1.2,
        duration: 0.3,
        ease: "elastic.out(1, 0.5)",
        onComplete: () => {
          gsap.to(meshRef.current!.scale, {
            x: value ? 0.5 : 1,
            y: value ? 0.5 : 1,
            z: value ? 0.5 : 1,
            duration: 0.2
          });
        }
      });
    }
    onToggle();
  }, [value, onToggle]);

  return (
    <group position={position}>
      {/* Glow sphere behind cube */}
      {value && (
        <mesh ref={glowRef} scale={1.5}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial 
            color="#00AAFF" 
            transparent 
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
      
      {/* Main cube */}
      <Float speed={2} rotationIntensity={value ? 0.5 : 0.1} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={value ? 1 : 0.5}
        >
          <boxGeometry args={[1, 1, 1]} />
          {value ? (
            <MeshTransmissionMaterial
              color="#00AAFF"
              transmission={0.3}
              thickness={0.5}
              roughness={0.1}
              metalness={0.8}
              emissive="#00AAFF"
              emissiveIntensity={hovered ? 2 : 1}
            />
          ) : (
            <meshStandardMaterial
              color="#1A1A2E"
              transparent
              opacity={hovered ? 0.5 : 0.2}
              metalness={0.9}
              roughness={0.1}
            />
          )}
          
          {/* Edges */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
            <lineBasicMaterial color={value ? "#00FFFF" : "#333355"} linewidth={2} />
          </lineSegments>
        </mesh>
      </Float>
      
      {/* Sparkles for active bits */}
      {value && (
        <Sparkles
          count={20}
          scale={2}
          size={2}
          speed={0.5}
          color="#00FFFF"
        />
      )}
      
      {/* Particle burst on toggle */}
      <ParticleBurst position={new THREE.Vector3(0, 0, 0)} active={bursting} />
      
      {/* Labels */}
      <Html position={[0, -1.2, 0]} center>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '14px',
          color: value ? '#00FFFF' : '#444466',
          textShadow: value ? '0 0 10px #00FFFF' : 'none',
          textAlign: 'center',
          userSelect: 'none',
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{value ? '1' : '0'}</div>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>2^{Math.log2(power)}</div>
        </div>
      </Html>
    </group>
  );
}

// Energy connections between active bits
function EnergyConnections({ bits }: { bits: boolean[] }) {
  const activeBits = bits.map((b, i) => b ? i : -1).filter(i => i >= 0);
  if (activeBits.length < 2) return null;

  const points: [number, number, number][] = [];
  activeBits.forEach(i => {
    points.push([i * 2 - 7, 0, 0]);
  });

  return (
    <Line 
      points={points}
      color="#00FFFF"
      lineWidth={2}
      transparent
      opacity={0.5}
    />
  );
}

// Holographic decimal display
function HolographicDisplay({ value }: { value: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, 3, 0]}>
      <Html center>
        <div style={{
          background: 'rgba(0, 170, 255, 0.1)',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          borderRadius: '12px',
          padding: '16px 32px',
          fontFamily: "'JetBrains Mono', monospace",
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{
            fontSize: '12px',
            color: '#00FFFF',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '4px',
          }}>
            Decimal Value
          </div>
          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#00FF88',
            textShadow: '0 0 20px #00FF88, 0 0 40px #00FF88',
          }}>
            {value}
          </div>
          <div style={{
            fontSize: '11px',
            color: '#00AAFF',
            marginTop: '4px',
          }}>
            HEX: 0x{value.toString(16).toUpperCase().padStart(2, '0')}
          </div>
        </div>
      </Html>
    </group>
  );
}

// Background grid
function HolographicGrid() {
  return (
    <group>
      <gridHelper 
        args={[40, 40, '#1a1a3e', '#1a1a3e']} 
        position={[0, -3, 0]}
        rotation={[0, 0, 0]}
      />
      <gridHelper 
        args={[40, 40, '#1a1a3e', '#1a1a3e']} 
        position={[0, 0, -10]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

// Main component
export function BinaryMatrix3D() {
  const [bits, setBits] = useState<boolean[]>([false, false, false, false, false, false, false, false]);
  
  const powers = [128, 64, 32, 16, 8, 4, 2, 1];
  const decimalValue = bits.reduce((sum, bit, idx) => sum + (bit ? powers[idx] : 0), 0);

  const toggleBit = useCallback((index: number) => {
    setBits(prev => {
      const newBits = [...prev];
      newBits[index] = !newBits[index];
      return newBits;
    });
  }, []);

  const presets = [
    { label: '42', value: 42 },
    { label: '255', value: 255 },
    { label: '128', value: 128 },
    { label: 'Clear', value: 0 },
  ];

  const setPreset = (value: number) => {
    const newBits = powers.map(p => (value & p) !== 0);
    setBits(newBits);
  };

  return (
    <div style={{ width: '100%', height: '600px', background: '#0A0A1E', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 5, 15], fov: 50 }}>
        <color attach="background" args={['#0A0A1E']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00AAFF" />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#FF00FF" />
        <spotLight position={[0, 20, 0]} intensity={0.5} color="#00FFFF" angle={0.5} />
        
        {/* Background */}
        <HolographicGrid />
        
        {/* Bit cubes */}
        {bits.map((bit, idx) => (
          <BitCube
            key={idx}
            position={[idx * 2 - 7, 0, 0]}
            value={bit}
            power={powers[idx]}
            index={idx}
            onToggle={() => toggleBit(idx)}
          />
        ))}
        
        {/* Energy connections */}
        <EnergyConnections bits={bits} />
        
        {/* Holographic display */}
        <HolographicDisplay value={decimalValue} />
        
        {/* Controls */}
        <OrbitControls 
          enablePan={false}
          minDistance={10}
          maxDistance={30}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
        
        {/* Post-processing */}
        <EffectComposer>
          <Bloom 
            intensity={1.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
          />
          <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
        </EffectComposer>
        
        <Environment preset="night" />
      </Canvas>
      
      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '12px',
        zIndex: 10,
      }}>
        {presets.map(preset => (
          <button
            key={preset.label}
            onClick={() => setPreset(preset.value)}
            style={{
              padding: '10px 20px',
              background: 'rgba(0, 170, 255, 0.2)',
              border: '1px solid rgba(0, 255, 255, 0.4)',
              borderRadius: '8px',
              color: '#00FFFF',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(0, 170, 255, 0.4)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(0, 170, 255, 0.2)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
      
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
          fontSize: '24px',
          color: '#00FFFF',
          textShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
          letterSpacing: '2px',
        }}>
          BINARY MATRIX 3D
        </h2>
        <p style={{
          margin: '8px 0 0',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '12px',
          color: '#666688',
        }}>
          Click cubes to toggle bits • Drag to rotate
        </p>
      </div>
      
      {/* Binary display */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 10,
        fontFamily: "'JetBrains Mono', monospace",
        textAlign: 'right',
      }}>
        <div style={{ fontSize: '12px', color: '#666688', marginBottom: '4px' }}>BINARY</div>
        <div style={{ 
          fontSize: '20px', 
          color: '#00AAFF',
          textShadow: '0 0 10px rgba(0, 170, 255, 0.5)',
          letterSpacing: '4px',
        }}>
          {bits.map(b => b ? '1' : '0').join('')}
        </div>
      </div>
    </div>
  );
}

export default BinaryMatrix3D;
