/**
 * Electron Flow System
 * Visualizes data flow through CPU components as electron particles
 */

import * as THREE from 'three';

export interface ElectronPath {
  id: string;
  name: string;
  waypoints: THREE.Vector3[];
  color: THREE.Color;
  flowDuration: number; // ms
  electronCount: number;
}

export interface FlowEvent {
  pathId: string;
  electronCount?: number;
  duration?: number;
  color?: THREE.Color;
  onComplete?: () => void;
}

export interface Electron {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  pathIndex: number;
  pathProgress: number;
  life: number;
  size: number;
  pathId: string;
}

// Predefined CPU paths
export const CPU_PATHS: Record<string, ElectronPath> = {
  // Digital Foundations paths
  CONTROL_TO_ALU: {
    id: 'CONTROL_TO_ALU',
    name: 'Control Unit → ALU',
    waypoints: [
      new THREE.Vector3(-4, 2, 0),
      new THREE.Vector3(-2, 2, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(2, 0, 0),
    ],
    color: new THREE.Color(0x8B5CF6), // Purple
    flowDuration: 300,
    electronCount: 50,
  },
  ALU_TO_REGISTER: {
    id: 'ALU_TO_REGISTER',
    name: 'ALU → Register',
    waypoints: [
      new THREE.Vector3(2, 0, 0),
      new THREE.Vector3(3, -1, 0),
      new THREE.Vector3(4, -2, 0),
    ],
    color: new THREE.Color(0xF97316), // Orange
    flowDuration: 200,
    electronCount: 40,
  },
  REGISTER_TO_ALU: {
    id: 'REGISTER_TO_ALU',
    name: 'Register → ALU',
    waypoints: [
      new THREE.Vector3(4, -2, 0),
      new THREE.Vector3(3, -1, 0),
      new THREE.Vector3(2, 0, 0),
    ],
    color: new THREE.Color(0x22C55E), // Green
    flowDuration: 200,
    electronCount: 40,
  },
  MEMORY_TO_REGISTER: {
    id: 'MEMORY_TO_REGISTER',
    name: 'Memory → Register',
    waypoints: [
      new THREE.Vector3(0, -4, 0),
      new THREE.Vector3(0, -3, 0),
      new THREE.Vector3(2, -2.5, 0),
      new THREE.Vector3(4, -2, 0),
    ],
    color: new THREE.Color(0x3B82F6), // Blue
    flowDuration: 400,
    electronCount: 80,
  },
  REGISTER_TO_MEMORY: {
    id: 'REGISTER_TO_MEMORY',
    name: 'Register → Memory',
    waypoints: [
      new THREE.Vector3(4, -2, 0),
      new THREE.Vector3(2, -2.5, 0),
      new THREE.Vector3(0, -3, 0),
      new THREE.Vector3(0, -4, 0),
    ],
    color: new THREE.Color(0x3B82F6), // Blue
    flowDuration: 400,
    electronCount: 80,
  },
  INPUT_TO_CONTROL: {
    id: 'INPUT_TO_CONTROL',
    name: 'Input → Control Unit',
    waypoints: [
      new THREE.Vector3(-6, 0, 0),
      new THREE.Vector3(-5, 1, 0),
      new THREE.Vector3(-4, 2, 0),
    ],
    color: new THREE.Color(0x00AAFF), // Cyan
    flowDuration: 250,
    electronCount: 60,
  },
  CONTROL_TO_REGISTER: {
    id: 'CONTROL_TO_REGISTER',
    name: 'Control Unit → Register',
    waypoints: [
      new THREE.Vector3(-4, 2, 0),
      new THREE.Vector3(-2, 1, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(2, -1, 0),
      new THREE.Vector3(4, -2, 0),
    ],
    color: new THREE.Color(0x8B5CF6), // Purple
    flowDuration: 350,
    electronCount: 50,
  },
};

// Operation to path mapping
export const OPERATION_PATHS: Record<string, string[]> = {
  'ASSIGNMENT': ['INPUT_TO_CONTROL', 'CONTROL_TO_REGISTER'],
  'ADDITION': ['REGISTER_TO_ALU', 'ALU_TO_REGISTER'],
  'SUBTRACTION': ['REGISTER_TO_ALU', 'ALU_TO_REGISTER'],
  'MULTIPLICATION': ['REGISTER_TO_ALU', 'ALU_TO_REGISTER'],
  'DIVISION': ['REGISTER_TO_ALU', 'ALU_TO_REGISTER'],
  'MEMORY_READ': ['MEMORY_TO_REGISTER'],
  'MEMORY_WRITE': ['REGISTER_TO_MEMORY'],
  'COMPARISON': ['REGISTER_TO_ALU', 'CONTROL_TO_ALU'],
  'BITWISE_AND': ['REGISTER_TO_ALU', 'ALU_TO_REGISTER'],
  'BITWISE_OR': ['REGISTER_TO_ALU', 'ALU_TO_REGISTER'],
  'BITWISE_XOR': ['REGISTER_TO_ALU', 'ALU_TO_REGISTER'],
  'SHIFT_LEFT': ['REGISTER_TO_ALU', 'ALU_TO_REGISTER'],
  'SHIFT_RIGHT': ['REGISTER_TO_ALU', 'ALU_TO_REGISTER'],
};

export class ElectronFlowSystem {
  private electrons: Electron[] = [];
  private maxElectrons: number;
  private activePaths: Set<string> = new Set();
  private pathQueue: FlowEvent[] = [];
  
  // Three.js rendering
  private geometry: THREE.BufferGeometry;
  private material: THREE.ShaderMaterial;
  private points: THREE.Points;
  
  // Buffers
  private positions: Float32Array;
  private colors: Float32Array;
  private sizes: Float32Array;
  private lives: Float32Array;

  constructor(maxElectrons: number = 5000) {
    this.maxElectrons = maxElectrons;
    
    // Initialize buffers
    this.positions = new Float32Array(maxElectrons * 3);
    this.colors = new Float32Array(maxElectrons * 3);
    this.sizes = new Float32Array(maxElectrons);
    this.lives = new Float32Array(maxElectrons);
    
    // Create geometry
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
    this.geometry.setAttribute('life', new THREE.BufferAttribute(this.lives, 1));
    
    // Create shader material
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: window.devicePixelRatio },
      },
      vertexShader: `
        attribute float size;
        attribute float life;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vLife;
        uniform float time;
        uniform float pixelRatio;
        
        void main() {
          vColor = color;
          vLife = life;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Size with distance attenuation
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
          gl_PointSize = clamp(gl_PointSize, 2.0, 50.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vLife;
        uniform float time;
        
        void main() {
          // Circular shape with glow
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          // Soft glow
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          glow = pow(glow, 1.5);
          
          // Pulsing
          float pulse = 0.8 + 0.2 * sin(time * 5.0 + vLife * 10.0);
          
          // Final color
          vec3 finalColor = vColor * glow * 1.5;
          float alpha = glow * vLife * pulse;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
  }

  get mesh(): THREE.Points {
    return this.points;
  }

  /**
   * Trigger electron flow for an operation
   */
  triggerOperation(operationType: string): void {
    const pathIds = OPERATION_PATHS[operationType];
    if (!pathIds) {
      console.warn(`Unknown operation type: ${operationType}`);
      return;
    }
    
    // Queue all paths for this operation
    let delay = 0;
    pathIds.forEach(pathId => {
      const path = CPU_PATHS[pathId];
      if (path) {
        setTimeout(() => {
          this.activatePath(pathId);
        }, delay);
        delay += path.flowDuration * 0.5; // Overlap flows slightly
      }
    });
  }

  /**
   * Activate a specific path
   */
  activatePath(pathId: string, options?: Partial<FlowEvent>): void {
    const path = CPU_PATHS[pathId];
    if (!path) {
      console.warn(`Unknown path: ${pathId}`);
      return;
    }
    
    this.activePaths.add(pathId);
    
    const electronCount = options?.electronCount ?? path.electronCount;
    const color = options?.color ?? path.color;
    
    // Spawn electrons along path start
    for (let i = 0; i < electronCount; i++) {
      this.spawnElectron(path, color, i / electronCount);
    }
    
    // Deactivate after flow
    const duration = options?.duration ?? path.flowDuration;
    setTimeout(() => {
      this.activePaths.delete(pathId);
      options?.onComplete?.();
    }, duration + 500);
  }

  /**
   * Spawn a single electron
   */
  private spawnElectron(path: ElectronPath, color: THREE.Color, spawnDelay: number): void {
    if (this.electrons.length >= this.maxElectrons) {
      // Recycle oldest electron
      this.electrons.shift();
    }
    
    const startPos = path.waypoints[0].clone();
    // Add small random offset
    startPos.x += (Math.random() - 0.5) * 0.3;
    startPos.y += (Math.random() - 0.5) * 0.3;
    startPos.z += (Math.random() - 0.5) * 0.3;
    
    const electron: Electron = {
      position: startPos,
      velocity: new THREE.Vector3(),
      pathIndex: 0,
      pathProgress: -spawnDelay * 0.5, // Stagger spawns
      life: 1.0,
      size: 8 + Math.random() * 4,
      pathId: path.id,
    };
    
    this.electrons.push(electron);
  }

  /**
   * Update all electrons
   */
  update(deltaTime: number, time: number): void {
    this.material.uniforms.time.value = time;
    
    const deadIndices: number[] = [];
    
    this.electrons.forEach((electron, index) => {
      const path = CPU_PATHS[electron.pathId];
      if (!path) return;
      
      // Update progress along path
      electron.pathProgress += deltaTime * 2; // Speed factor
      
      if (electron.pathProgress < 0) {
        // Still waiting to spawn
        electron.life = 0;
        return;
      }
      
      // Calculate position along path
      const totalWaypoints = path.waypoints.length;
      const progressPerSegment = 1 / (totalWaypoints - 1);
      const normalizedProgress = Math.min(electron.pathProgress, 1);
      
      const segmentIndex = Math.min(
        Math.floor(normalizedProgress / progressPerSegment),
        totalWaypoints - 2
      );
      const segmentProgress = (normalizedProgress - segmentIndex * progressPerSegment) / progressPerSegment;
      
      // Interpolate between waypoints
      const startWaypoint = path.waypoints[segmentIndex];
      const endWaypoint = path.waypoints[segmentIndex + 1];
      
      if (startWaypoint && endWaypoint) {
        electron.position.lerpVectors(startWaypoint, endWaypoint, segmentProgress);
        
        // Add slight wave motion
        const wave = Math.sin(electron.pathProgress * Math.PI * 4 + index * 0.1) * 0.1;
        electron.position.y += wave;
        electron.position.z += wave * 0.5;
      }
      
      // Update life
      if (electron.pathProgress >= 1) {
        electron.life -= deltaTime * 3; // Fade out at end
        if (electron.life <= 0) {
          deadIndices.push(index);
        }
      } else {
        electron.life = Math.min(1, electron.life + deltaTime * 5); // Fade in
      }
    });
    
    // Remove dead electrons (in reverse order)
    deadIndices.reverse().forEach(i => {
      this.electrons.splice(i, 1);
    });
    
    // Update buffers
    this.updateBuffers();
  }

  /**
   * Update GPU buffers
   */
  private updateBuffers(): void {
    const count = Math.min(this.electrons.length, this.maxElectrons);
    
    for (let i = 0; i < count; i++) {
      const electron = this.electrons[i];
      const path = CPU_PATHS[electron.pathId];
      
      // Position
      this.positions[i * 3] = electron.position.x;
      this.positions[i * 3 + 1] = electron.position.y;
      this.positions[i * 3 + 2] = electron.position.z;
      
      // Color
      const color = path?.color ?? new THREE.Color(0x00AAFF);
      this.colors[i * 3] = color.r;
      this.colors[i * 3 + 1] = color.g;
      this.colors[i * 3 + 2] = color.b;
      
      // Size and life
      this.sizes[i] = electron.size;
      this.lives[i] = Math.max(0, electron.life);
    }
    
    // Clear remaining slots
    for (let i = count; i < this.maxElectrons; i++) {
      this.lives[i] = 0;
    }
    
    // Mark for update
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
    this.geometry.attributes.life.needsUpdate = true;
    
    // Update draw range
    this.geometry.setDrawRange(0, count);
  }

  /**
   * Get active path IDs
   */
  getActivePaths(): string[] {
    return Array.from(this.activePaths);
  }

  /**
   * Get electron count
   */
  getElectronCount(): number {
    return this.electrons.filter(e => e.life > 0).length;
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
    this.electrons = [];
  }
}

export default ElectronFlowSystem;
