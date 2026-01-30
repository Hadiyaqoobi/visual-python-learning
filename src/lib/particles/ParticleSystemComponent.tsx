"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { ParticleSystem, ParticleSystemConfig, PerformanceMetrics } from './ParticleSystem';

interface ParticleSystemSceneProps {
  config: ParticleSystemConfig;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  attractorPosition?: THREE.Vector3;
}

function ParticleSystemScene({ config, onMetricsUpdate, attractorPosition }: ParticleSystemSceneProps) {
  const systemRef = useRef<ParticleSystem | null>(null);
  const { scene } = useThree();

  // Initialize particle system
  useEffect(() => {
    const system = new ParticleSystem(config);
    systemRef.current = system;
    scene.add(system.mesh);

    // Try to initialize WebGPU
    system.initWebGPU().then((success) => {
      console.log(`Particle system using ${success ? 'WebGPU' : 'CPU'} compute`);
    });

    return () => {
      scene.remove(system.mesh);
      system.dispose();
    };
  }, [config, scene]);

  // Update attractor position
  useEffect(() => {
    if (systemRef.current && attractorPosition) {
      systemRef.current.setAttractorPosition(attractorPosition);
    }
  }, [attractorPosition]);

  // Animation loop
  useFrame((_, delta) => {
    if (systemRef.current) {
      systemRef.current.update(delta);
      
      if (onMetricsUpdate) {
        onMetricsUpdate(systemRef.current.getPerformanceMetrics());
      }
    }
  });

  return null;
}

interface ParticleSystemComponentProps {
  particleCount?: number;
  colorStart?: string;
  colorEnd?: string;
  particleSize?: number;
  spawnRadius?: number;
  showMetrics?: boolean;
  showControls?: boolean;
  attractorPosition?: [number, number, number];
  flowDirection?: [number, number, number];
  height?: string | number;
}

export function ParticleSystemComponent({
  particleCount = 10000,
  colorStart = '#00AAFF',
  colorEnd = '#0055FF',
  particleSize = 0.05,
  spawnRadius = 5,
  showMetrics = true,
  showControls = true,
  attractorPosition = [0, 0, 0],
  flowDirection = [0, 0, 0],
  height = '500px',
}: ParticleSystemComponentProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    particlesRendered: 0,
    computeTime: 0,
    renderTime: 0,
    mode: 'webgl',
  });

  const config: ParticleSystemConfig = {
    particleCount,
    colorStart: new THREE.Color(colorStart),
    colorEnd: new THREE.Color(colorEnd),
    particleSize,
    spawnRadius,
    attractorPosition: new THREE.Vector3(...attractorPosition),
    flowDirection: new THREE.Vector3(...flowDirection).normalize(),
    flowStrength: new THREE.Vector3(...flowDirection).length() || 0,
  };

  return (
    <div style={{ 
      width: '100%', 
      height, 
      background: '#0A0A1E', 
      borderRadius: '16px', 
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={['#0A0A1E']} />
        
        <ParticleSystemScene 
          config={config} 
          onMetricsUpdate={setMetrics}
          attractorPosition={new THREE.Vector3(...attractorPosition)}
        />
        
        {showControls && (
          <OrbitControls 
            enablePan={false}
            minDistance={5}
            maxDistance={30}
          />
        )}
        
        <EffectComposer>
          <Bloom 
            intensity={1.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
      
      {/* Metrics overlay */}
      {showMetrics && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '8px',
          padding: '12px 16px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          color: '#fff',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: metrics.mode === 'webgpu' ? '#10B981' : '#3B82F6',
              boxShadow: metrics.mode === 'webgpu' 
                ? '0 0 8px rgba(16,185,129,0.6)' 
                : '0 0 8px rgba(59,130,246,0.6)',
            }} />
            <span style={{ color: metrics.mode === 'webgpu' ? '#10B981' : '#3B82F6' }}>
              {metrics.mode === 'webgpu' ? 'WebGPU' : 'WebGL'}
            </span>
          </div>
          <div style={{ display: 'grid', gap: '4px' }}>
            <div>FPS: <span style={{ color: metrics.fps >= 55 ? '#10B981' : metrics.fps >= 30 ? '#F59E0B' : '#EF4444' }}>
              {metrics.fps.toFixed(0)}
            </span></div>
            <div>Particles: <span style={{ color: '#00AAFF' }}>{metrics.particlesRendered.toLocaleString()}</span></div>
            <div>Compute: <span style={{ color: '#8B5CF6' }}>{metrics.computeTime.toFixed(2)}ms</span></div>
          </div>
        </div>
      )}
      
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#00FFFF',
          textShadow: '0 0 10px rgba(0,255,255,0.5)',
        }}>
          PARTICLE SYSTEM
        </div>
        <div style={{ fontSize: '11px', color: '#666' }}>
          {particleCount.toLocaleString()} particles
        </div>
      </div>
    </div>
  );
}

export default ParticleSystemComponent;
