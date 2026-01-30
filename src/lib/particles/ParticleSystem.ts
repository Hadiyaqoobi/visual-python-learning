/**
 * High-Performance Particle System
 * Handles 100,000+ particles at 60fps using WebGPU compute shaders
 * Falls back to CPU-based simulation for WebGL mode
 */

import * as THREE from 'three';
import { WebGPUManager } from '../webgpu/WebGPUManager';

export interface ParticleSystemConfig {
  particleCount: number;
  colorStart: THREE.Color;
  colorEnd: THREE.Color;
  particleSize: number;
  spawnRadius: number;
  attractorPosition?: THREE.Vector3;
  flowDirection?: THREE.Vector3;
  flowStrength?: number;
  attractionStrength?: number;
  dampingFactor?: number;
  maxSpeed?: number;
  enableTrails?: boolean;
}

export interface PerformanceMetrics {
  fps: number;
  particlesRendered: number;
  computeTime: number;
  renderTime: number;
  mode: 'webgpu' | 'webgl';
}

// Particle data structure (must match shader)
const PARTICLE_STRIDE = 8; // 3 pos + 3 vel + 1 life + 1 size = 8 floats

export class ParticleSystem {
  private config: Required<ParticleSystemConfig>;
  private particleData: Float32Array;
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial | THREE.ShaderMaterial;
  private points: THREE.Points;
  
  // WebGPU resources
  private gpuBuffer: GPUBuffer | null = null;
  private uniformBuffer: GPUBuffer | null = null;
  private computePipeline: GPUComputePipeline | null = null;
  private bindGroup: GPUBindGroup | null = null;
  
  // State
  private _isPlaying = true;
  private _useWebGPU = false;
  private lastTime = 0;
  private metrics: PerformanceMetrics = {
    fps: 0,
    particlesRendered: 0,
    computeTime: 0,
    renderTime: 0,
    mode: 'webgl',
  };
  private frameCount = 0;
  private fpsAccumulator = 0;

  constructor(config: ParticleSystemConfig) {
    this.config = {
      particleCount: config.particleCount,
      colorStart: config.colorStart,
      colorEnd: config.colorEnd,
      particleSize: config.particleSize,
      spawnRadius: config.spawnRadius ?? 5,
      attractorPosition: config.attractorPosition ?? new THREE.Vector3(0, 0, 0),
      flowDirection: config.flowDirection ?? new THREE.Vector3(1, 0, 0),
      flowStrength: config.flowStrength ?? 1,
      attractionStrength: config.attractionStrength ?? 2,
      dampingFactor: config.dampingFactor ?? 0.98,
      maxSpeed: config.maxSpeed ?? 5,
      enableTrails: config.enableTrails ?? false,
    };

    // Initialize particle data
    this.particleData = new Float32Array(this.config.particleCount * PARTICLE_STRIDE);
    this.initializeParticles();

    // Create Three.js geometry
    this.geometry = new THREE.BufferGeometry();
    this.updateGeometryFromData();

    // Create material with glow effect
    this.material = this.createMaterial();

    // Create points object
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
  }

  private initializeParticles(): void {
    const { particleCount, spawnRadius } = this.config;
    
    for (let i = 0; i < particleCount; i++) {
      const offset = i * PARTICLE_STRIDE;
      
      // Random position within spawn radius
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * spawnRadius;
      
      this.particleData[offset + 0] = r * Math.sin(phi) * Math.cos(theta); // x
      this.particleData[offset + 1] = r * Math.sin(phi) * Math.sin(theta); // y
      this.particleData[offset + 2] = r * Math.cos(phi);                   // z
      
      // Random initial velocity
      this.particleData[offset + 3] = (Math.random() - 0.5) * 0.5; // vx
      this.particleData[offset + 4] = (Math.random() - 0.5) * 0.5; // vy
      this.particleData[offset + 5] = (Math.random() - 0.5) * 0.5; // vz
      
      // Life and size
      this.particleData[offset + 6] = Math.random(); // life
      this.particleData[offset + 7] = this.config.particleSize * (0.5 + Math.random() * 0.5); // size
    }
  }

  private createMaterial(): THREE.ShaderMaterial {
    const { colorStart, colorEnd, particleSize } = this.config;

    return new THREE.ShaderMaterial({
      uniforms: {
        colorStart: { value: colorStart },
        colorEnd: { value: colorEnd },
        pointSize: { value: particleSize * 100 },
        time: { value: 0 },
      },
      vertexShader: `
        attribute float life;
        attribute float size;
        varying float vLife;
        varying float vSize;
        uniform float pointSize;
        uniform float time;
        
        void main() {
          vLife = life;
          vSize = size;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Size attenuation
          gl_PointSize = pointSize * size * (1.0 / -mvPosition.z);
          gl_PointSize = clamp(gl_PointSize, 1.0, 50.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorStart;
        uniform vec3 colorEnd;
        uniform float time;
        varying float vLife;
        varying float vSize;
        
        void main() {
          // Circular particle shape
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          if (dist > 0.5) discard;
          
          // Soft glow falloff
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          glow = pow(glow, 1.5);
          
          // Color interpolation based on life
          vec3 color = mix(colorEnd, colorStart, vLife);
          
          // Pulsing effect
          float pulse = 0.8 + 0.2 * sin(time * 3.0 + vLife * 10.0);
          
          // Final color with alpha
          float alpha = glow * vLife * pulse;
          gl_FragColor = vec4(color * glow * 1.5, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }

  private updateGeometryFromData(): void {
    const { particleCount } = this.config;
    
    // Extract positions
    const positions = new Float32Array(particleCount * 3);
    const lives = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const offset = i * PARTICLE_STRIDE;
      positions[i * 3 + 0] = this.particleData[offset + 0];
      positions[i * 3 + 1] = this.particleData[offset + 1];
      positions[i * 3 + 2] = this.particleData[offset + 2];
      lives[i] = this.particleData[offset + 6];
      sizes[i] = this.particleData[offset + 7];
    }
    
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('life', new THREE.BufferAttribute(lives, 1));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  }

  /**
   * Initialize WebGPU compute (if available)
   */
  async initWebGPU(): Promise<boolean> {
    const caps = await WebGPUManager.initialize();
    
    if (!caps.supported || !WebGPUManager.device) {
      console.log('WebGPU not available, using CPU simulation');
      this._useWebGPU = false;
      this.metrics.mode = 'webgl';
      return false;
    }

    try {
      const device = WebGPUManager.device;
      const { particleCount } = this.config;

      // Create particle buffer
      const bufferSize = particleCount * PARTICLE_STRIDE * 4; // 4 bytes per float
      this.gpuBuffer = device.createBuffer({
        size: bufferSize,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
        label: 'Particle Buffer',
      });

      // Upload initial data
      device.queue.writeBuffer(this.gpuBuffer, 0, this.particleData);

      // Create uniform buffer (simulation params)
      this.uniformBuffer = device.createBuffer({
        size: 64, // Aligned size for uniforms
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        label: 'Simulation Params',
      });

      // Load and create compute shader
      const shaderCode = await fetch('/shaders/particle-compute.wgsl').then(r => r.text()).catch(() => {
        // Inline shader if file not found
        return `
          struct Particle {
            position: vec3<f32>,
            velocity: vec3<f32>,
            life: f32,
            size: f32,
          }
          
          struct Params {
            deltaTime: f32,
            particleCount: u32,
            time: f32,
            attractionStrength: f32,
            dampingFactor: f32,
            maxSpeed: f32,
            spawnRadius: f32,
            _padding: f32,
            attractorPosition: vec3<f32>,
            _padding2: f32,
            flowDirection: vec3<f32>,
            flowStrength: f32,
          }
          
          @group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
          @group(0) @binding(1) var<uniform> params: Params;
          
          fn rand(seed: vec2<f32>) -> f32 {
            return fract(sin(dot(seed, vec2<f32>(12.9898, 78.233))) * 43758.5453);
          }
          
          @compute @workgroup_size(256)
          fn main(@builtin(global_invocation_id) id: vec3<u32>) {
            let index = id.x;
            if (index >= params.particleCount) { return; }
            
            var p = particles[index];
            let seed = f32(index) + params.time;
            
            let toAttr = params.attractorPosition - p.position;
            let dist = length(toAttr);
            let force = normalize(toAttr) * (params.attractionStrength / (dist * dist + 0.5));
            
            p.velocity += force * params.deltaTime;
            p.velocity += params.flowDirection * params.flowStrength * params.deltaTime;
            p.velocity *= params.dampingFactor;
            
            let speed = length(p.velocity);
            if (speed > params.maxSpeed) {
              p.velocity = normalize(p.velocity) * params.maxSpeed;
            }
            
            p.position += p.velocity * params.deltaTime;
            p.life -= params.deltaTime * 0.3;
            
            if (p.life <= 0.0) {
              p.life = 1.0;
              let r = rand(vec2<f32>(seed, seed * 2.0)) * params.spawnRadius;
              let theta = rand(vec2<f32>(seed * 3.0, seed * 4.0)) * 6.28;
              let phi = rand(vec2<f32>(seed * 5.0, seed * 6.0)) * 3.14;
              p.position = vec3<f32>(
                r * sin(phi) * cos(theta),
                r * sin(phi) * sin(theta),
                r * cos(phi)
              );
              p.velocity = normalize(params.attractorPosition - p.position) * 0.5;
            }
            
            particles[index] = p;
          }
        `;
      });

      const shaderModule = device.createShaderModule({ code: shaderCode });
      
      this.computePipeline = device.createComputePipeline({
        layout: 'auto',
        compute: {
          module: shaderModule,
          entryPoint: 'main',
        },
      });

      // Create bind group
      this.bindGroup = device.createBindGroup({
        layout: this.computePipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: this.gpuBuffer } },
          { binding: 1, resource: { buffer: this.uniformBuffer } },
        ],
      });

      this._useWebGPU = true;
      this.metrics.mode = 'webgpu';
      console.log('✅ Particle system WebGPU compute initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize WebGPU compute:', error);
      this._useWebGPU = false;
      this.metrics.mode = 'webgl';
      return false;
    }
  }

  /**
   * Update particle simulation
   */
  update(deltaTime: number): void {
    if (!this._isPlaying) return;

    const startTime = performance.now();
    const time = this.lastTime + deltaTime;
    this.lastTime = time;

    if (this._useWebGPU && this.computePipeline && this.bindGroup && this.gpuBuffer && this.uniformBuffer) {
      this.updateWebGPU(deltaTime, time);
    } else {
      this.updateCPU(deltaTime, time);
    }

    // Update material time uniform
    if (this.material instanceof THREE.ShaderMaterial) {
      this.material.uniforms.time.value = time;
    }

    // Update metrics
    const computeTime = performance.now() - startTime;
    this.metrics.computeTime = computeTime;
    this.metrics.particlesRendered = this.config.particleCount;
    
    this.fpsAccumulator += deltaTime;
    this.frameCount++;
    if (this.fpsAccumulator >= 1) {
      this.metrics.fps = this.frameCount / this.fpsAccumulator;
      this.frameCount = 0;
      this.fpsAccumulator = 0;
    }
  }

  private updateWebGPU(deltaTime: number, time: number): void {
    const device = WebGPUManager.device;
    if (!device || !this.uniformBuffer || !this.computePipeline || !this.bindGroup || !this.gpuBuffer) return;

    // Update uniforms
    const { particleCount, attractorPosition, flowDirection, flowStrength, attractionStrength, dampingFactor, maxSpeed, spawnRadius } = this.config;
    
    const uniformData = new Float32Array([
      deltaTime,
      particleCount,
      time,
      attractionStrength,
      dampingFactor,
      maxSpeed,
      spawnRadius,
      0, // padding
      attractorPosition.x, attractorPosition.y, attractorPosition.z,
      0, // padding
      flowDirection.x, flowDirection.y, flowDirection.z,
      flowStrength,
    ]);
    
    device.queue.writeBuffer(this.uniformBuffer, 0, uniformData);

    // Dispatch compute
    const workgroupCount = Math.ceil(particleCount / 256);
    WebGPUManager.submitCompute(this.computePipeline, [this.bindGroup], [workgroupCount]);

    // Read back positions for Three.js rendering
    // Note: This is a simplification. In production, you'd use a shared buffer or
    // render directly with WebGPU. For now, we do an async readback.
    this.readBackParticles();
  }

  private async readBackParticles(): Promise<void> {
    if (!this.gpuBuffer) return;
    
    const data = await WebGPUManager.readBuffer(this.gpuBuffer, this.particleData.byteLength);
    if (data) {
      this.particleData = new Float32Array(data);
      this.updateGeometryFromData();
      this.geometry.attributes.position.needsUpdate = true;
      this.geometry.attributes.life.needsUpdate = true;
      this.geometry.attributes.size.needsUpdate = true;
    }
  }

  private updateCPU(deltaTime: number, time: number): void {
    const { particleCount, attractorPosition, flowDirection, flowStrength, attractionStrength, dampingFactor, maxSpeed, spawnRadius } = this.config;

    for (let i = 0; i < particleCount; i++) {
      const offset = i * PARTICLE_STRIDE;
      
      // Current state
      let px = this.particleData[offset + 0];
      let py = this.particleData[offset + 1];
      let pz = this.particleData[offset + 2];
      let vx = this.particleData[offset + 3];
      let vy = this.particleData[offset + 4];
      let vz = this.particleData[offset + 5];
      let life = this.particleData[offset + 6];
      
      // Attraction force
      const dx = attractorPosition.x - px;
      const dy = attractorPosition.y - py;
      const dz = attractorPosition.z - pz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.5;
      const forceMag = attractionStrength / (dist * dist);
      
      vx += (dx / dist) * forceMag * deltaTime;
      vy += (dy / dist) * forceMag * deltaTime;
      vz += (dz / dist) * forceMag * deltaTime;
      
      // Flow force
      vx += flowDirection.x * flowStrength * deltaTime;
      vy += flowDirection.y * flowStrength * deltaTime;
      vz += flowDirection.z * flowStrength * deltaTime;
      
      // Damping
      vx *= dampingFactor;
      vy *= dampingFactor;
      vz *= dampingFactor;
      
      // Speed clamp
      const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        vz *= scale;
      }
      
      // Update position
      px += vx * deltaTime;
      py += vy * deltaTime;
      pz += vz * deltaTime;
      
      // Update life
      life -= deltaTime * 0.3;
      
      // Respawn
      if (life <= 0) {
        life = 1;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = Math.random() * spawnRadius;
        px = r * Math.sin(phi) * Math.cos(theta);
        py = r * Math.sin(phi) * Math.sin(theta);
        pz = r * Math.cos(phi);
        vx = (Math.random() - 0.5) * 0.5;
        vy = (Math.random() - 0.5) * 0.5;
        vz = (Math.random() - 0.5) * 0.5;
      }
      
      // Write back
      this.particleData[offset + 0] = px;
      this.particleData[offset + 1] = py;
      this.particleData[offset + 2] = pz;
      this.particleData[offset + 3] = vx;
      this.particleData[offset + 4] = vy;
      this.particleData[offset + 5] = vz;
      this.particleData[offset + 6] = life;
    }
    
    this.updateGeometryFromData();
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.life.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
  }

  // Controls
  play(): void { this._isPlaying = true; }
  pause(): void { this._isPlaying = false; }
  reset(): void {
    this.initializeParticles();
    this.updateGeometryFromData();
    this.lastTime = 0;
  }

  // Getters
  get mesh(): THREE.Points { return this.points; }
  get isPlaying(): boolean { return this._isPlaying; }
  get isWebGPU(): boolean { return this._useWebGPU; }
  getPerformanceMetrics(): PerformanceMetrics { return { ...this.metrics }; }

  // Configuration
  setAttractorPosition(pos: THREE.Vector3): void {
    this.config.attractorPosition.copy(pos);
  }

  setFlowDirection(dir: THREE.Vector3): void {
    this.config.flowDirection.copy(dir);
  }

  // Cleanup
  dispose(): void {
    this.geometry.dispose();
    if (this.material instanceof THREE.Material) {
      this.material.dispose();
    }
    if (this.gpuBuffer) {
      this.gpuBuffer.destroy();
    }
    if (this.uniformBuffer) {
      this.uniformBuffer.destroy();
    }
  }
}

export default ParticleSystem;
