/**
 * Quantum Zoom System
 * 5-level continuous zoom from Python code → Electrons
 * 
 * Level 1: Python Code (high-level)
 * Level 2: Python Bytecode (dis.dis output)
 * Level 3: Pseudo-Assembly (simplified x86-like)
 * Level 4: Logic Gates (AND, OR, NOT visualization)
 * Level 5: Electrons (particle flow)
 */

import * as THREE from 'three';
import gsap from 'gsap';

export enum ZoomLevel {
  PYTHON = 1,
  BYTECODE = 2,
  ASSEMBLY = 3,
  GATES = 4,
  ELECTRONS = 5,
}

export interface ZoomLevelConfig {
  level: ZoomLevel;
  name: string;
  icon: string;
  description: string;
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
  scale: number;
  color: string;
}

export const ZOOM_LEVELS: ZoomLevelConfig[] = [
  {
    level: ZoomLevel.PYTHON,
    name: 'Python Code',
    icon: '🐍',
    description: 'High-level Python source code',
    cameraPosition: new THREE.Vector3(0, 0, 50),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    scale: 1,
    color: '#3572A5',
  },
  {
    level: ZoomLevel.BYTECODE,
    name: 'Bytecode',
    icon: '📦',
    description: 'Python bytecode instructions',
    cameraPosition: new THREE.Vector3(0, 0, 35),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    scale: 0.7,
    color: '#F97316',
  },
  {
    level: ZoomLevel.ASSEMBLY,
    name: 'Assembly',
    icon: '⚙️',
    description: 'Pseudo-assembly operations',
    cameraPosition: new THREE.Vector3(0, 0, 20),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    scale: 0.5,
    color: '#8B5CF6',
  },
  {
    level: ZoomLevel.GATES,
    name: 'Logic Gates',
    icon: '🔌',
    description: 'Digital logic gates',
    cameraPosition: new THREE.Vector3(0, 0, 10),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    scale: 0.3,
    color: '#22C55E',
  },
  {
    level: ZoomLevel.ELECTRONS,
    name: 'Electrons',
    icon: '⚡',
    description: 'Electron particle flow',
    cameraPosition: new THREE.Vector3(0, 0, 5),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    scale: 0.1,
    color: '#00AAFF',
  },
];

// Python to Bytecode mapping
export interface BytecodeInstruction {
  offset: number;
  opcode: string;
  arg: string | number | null;
  description: string;
}

// Bytecode to Assembly mapping
export interface AssemblyInstruction {
  address: string;
  mnemonic: string;
  operands: string;
  description: string;
}

// Assembly to Gates mapping
export interface GateOperation {
  gates: ('AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR')[];
  inputs: string[];
  output: string;
  description: string;
}

export class QuantumZoomSystem {
  private currentLevel: ZoomLevel = ZoomLevel.PYTHON;
  private targetLevel: ZoomLevel = ZoomLevel.PYTHON;
  private zoomProgress: number = 0; // 0-1 between levels
  private isTransitioning: boolean = false;
  
  // Callbacks
  private onLevelChange?: (level: ZoomLevel) => void;
  private onTransitionProgress?: (progress: number, fromLevel: ZoomLevel, toLevel: ZoomLevel) => void;

  constructor() {}

  /**
   * Get current zoom level
   */
  getCurrentLevel(): ZoomLevel {
    return this.currentLevel;
  }

  /**
   * Get level configuration
   */
  getLevelConfig(level: ZoomLevel): ZoomLevelConfig {
    return ZOOM_LEVELS.find(l => l.level === level) || ZOOM_LEVELS[0];
  }

  /**
   * Get all level configurations
   */
  getAllLevels(): ZoomLevelConfig[] {
    return ZOOM_LEVELS;
  }

  /**
   * Zoom to a specific level with animation
   */
  async zoomTo(targetLevel: ZoomLevel, duration: number = 1000): Promise<void> {
    if (this.isTransitioning || targetLevel === this.currentLevel) {
      return;
    }

    this.isTransitioning = true;
    this.targetLevel = targetLevel;
    const startLevel = this.currentLevel;

    return new Promise((resolve) => {
      gsap.to(this, {
        zoomProgress: 1,
        duration: duration / 1000,
        ease: 'power2.inOut',
        onUpdate: () => {
          this.onTransitionProgress?.(this.zoomProgress, startLevel, targetLevel);
        },
        onComplete: () => {
          this.currentLevel = targetLevel;
          this.zoomProgress = 0;
          this.isTransitioning = false;
          this.onLevelChange?.(targetLevel);
          resolve();
        },
      });
    });
  }

  /**
   * Zoom in one level
   */
  async zoomIn(duration: number = 800): Promise<void> {
    if (this.currentLevel < ZoomLevel.ELECTRONS) {
      await this.zoomTo(this.currentLevel + 1 as ZoomLevel, duration);
    }
  }

  /**
   * Zoom out one level
   */
  async zoomOut(duration: number = 800): Promise<void> {
    if (this.currentLevel > ZoomLevel.PYTHON) {
      await this.zoomTo(this.currentLevel - 1 as ZoomLevel, duration);
    }
  }

  /**
   * Handle scroll for continuous zoom
   */
  handleScroll(deltaY: number): void {
    if (this.isTransitioning) return;

    if (deltaY > 0) {
      // Scroll down = zoom in
      this.zoomIn(500);
    } else if (deltaY < 0) {
      // Scroll up = zoom out
      this.zoomOut(500);
    }
  }

  /**
   * Set callbacks
   */
  setCallbacks(callbacks: {
    onLevelChange?: (level: ZoomLevel) => void;
    onTransitionProgress?: (progress: number, fromLevel: ZoomLevel, toLevel: ZoomLevel) => void;
  }): void {
    this.onLevelChange = callbacks.onLevelChange;
    this.onTransitionProgress = callbacks.onTransitionProgress;
  }

  /**
   * Convert Python code to bytecode representation
   */
  static pythonToBytecode(code: string): BytecodeInstruction[] {
    // Simplified bytecode generation (in real implementation, use Pyodide's dis module)
    const instructions: BytecodeInstruction[] = [];
    const lines = code.split('\n').filter(l => l.trim());
    let offset = 0;

    lines.forEach((line) => {
      const trimmed = line.trim();
      
      // Variable assignment: x = 5
      const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
      if (assignMatch) {
        const [, varName, value] = assignMatch;
        
        // Check if it's an operation
        if (value.includes('+')) {
          const [left, right] = value.split('+').map(s => s.trim());
          instructions.push({
            offset: offset++,
            opcode: 'LOAD_NAME',
            arg: left,
            description: `Load ${left} onto stack`,
          });
          instructions.push({
            offset: offset++,
            opcode: 'LOAD_NAME',
            arg: right,
            description: `Load ${right} onto stack`,
          });
          instructions.push({
            offset: offset++,
            opcode: 'BINARY_ADD',
            arg: null,
            description: 'Add top two stack values',
          });
        } else if (value.includes('-')) {
          const [left, right] = value.split('-').map(s => s.trim());
          instructions.push({
            offset: offset++,
            opcode: 'LOAD_NAME',
            arg: left,
            description: `Load ${left} onto stack`,
          });
          instructions.push({
            offset: offset++,
            opcode: 'LOAD_NAME',
            arg: right,
            description: `Load ${right} onto stack`,
          });
          instructions.push({
            offset: offset++,
            opcode: 'BINARY_SUBTRACT',
            arg: null,
            description: 'Subtract top two stack values',
          });
        } else if (value.includes('*')) {
          const [left, right] = value.split('*').map(s => s.trim());
          instructions.push({
            offset: offset++,
            opcode: 'LOAD_NAME',
            arg: left,
            description: `Load ${left} onto stack`,
          });
          instructions.push({
            offset: offset++,
            opcode: 'LOAD_NAME',
            arg: right,
            description: `Load ${right} onto stack`,
          });
          instructions.push({
            offset: offset++,
            opcode: 'BINARY_MULTIPLY',
            arg: null,
            description: 'Multiply top two stack values',
          });
        } else {
          // Simple assignment
          instructions.push({
            offset: offset++,
            opcode: 'LOAD_CONST',
            arg: value,
            description: `Load constant ${value}`,
          });
        }
        
        instructions.push({
          offset: offset++,
          opcode: 'STORE_NAME',
          arg: varName,
          description: `Store in variable ${varName}`,
        });
      }
      
      // Print statement
      if (trimmed.startsWith('print(')) {
        const content = trimmed.match(/print\((.+)\)/)?.[1] || '';
        instructions.push({
          offset: offset++,
          opcode: 'LOAD_NAME',
          arg: 'print',
          description: 'Load print function',
        });
        instructions.push({
          offset: offset++,
          opcode: 'LOAD_NAME',
          arg: content,
          description: `Load ${content}`,
        });
        instructions.push({
          offset: offset++,
          opcode: 'CALL_FUNCTION',
          arg: 1,
          description: 'Call function with 1 argument',
        });
      }
    });

    return instructions;
  }

  /**
   * Convert bytecode to assembly representation
   */
  static bytecodeToAssembly(bytecode: BytecodeInstruction[]): AssemblyInstruction[] {
    const assembly: AssemblyInstruction[] = [];
    let address = 0x0000;

    bytecode.forEach((instr) => {
      switch (instr.opcode) {
        case 'LOAD_CONST':
          assembly.push({
            address: `0x${address.toString(16).padStart(4, '0')}`,
            mnemonic: 'MOV',
            operands: `EAX, ${instr.arg}`,
            description: 'Move immediate value to register',
          });
          address += 4;
          break;
          
        case 'LOAD_NAME':
          assembly.push({
            address: `0x${address.toString(16).padStart(4, '0')}`,
            mnemonic: 'MOV',
            operands: `EAX, [${instr.arg}]`,
            description: `Load ${instr.arg} from memory`,
          });
          address += 4;
          break;
          
        case 'STORE_NAME':
          assembly.push({
            address: `0x${address.toString(16).padStart(4, '0')}`,
            mnemonic: 'MOV',
            operands: `[${instr.arg}], EAX`,
            description: `Store EAX to ${instr.arg}`,
          });
          address += 4;
          break;
          
        case 'BINARY_ADD':
          assembly.push({
            address: `0x${address.toString(16).padStart(4, '0')}`,
            mnemonic: 'ADD',
            operands: 'EAX, EBX',
            description: 'Add EBX to EAX',
          });
          address += 4;
          break;
          
        case 'BINARY_SUBTRACT':
          assembly.push({
            address: `0x${address.toString(16).padStart(4, '0')}`,
            mnemonic: 'SUB',
            operands: 'EAX, EBX',
            description: 'Subtract EBX from EAX',
          });
          address += 4;
          break;
          
        case 'BINARY_MULTIPLY':
          assembly.push({
            address: `0x${address.toString(16).padStart(4, '0')}`,
            mnemonic: 'IMUL',
            operands: 'EAX, EBX',
            description: 'Multiply EAX by EBX',
          });
          address += 4;
          break;
          
        case 'CALL_FUNCTION':
          assembly.push({
            address: `0x${address.toString(16).padStart(4, '0')}`,
            mnemonic: 'CALL',
            operands: 'FUNC_ADDR',
            description: 'Call function',
          });
          address += 4;
          break;
      }
    });

    return assembly;
  }

  /**
   * Convert assembly to gate operations
   */
  static assemblyToGates(assembly: AssemblyInstruction[]): GateOperation[] {
    const gates: GateOperation[] = [];

    assembly.forEach((instr) => {
      switch (instr.mnemonic) {
        case 'ADD':
          // Addition uses XOR and AND gates (half adder, full adder chain)
          gates.push({
            gates: ['XOR', 'AND', 'OR'],
            inputs: ['A[0]', 'B[0]', 'Cin'],
            output: 'Sum[0]',
            description: 'Full adder for bit 0',
          });
          gates.push({
            gates: ['XOR', 'AND', 'OR'],
            inputs: ['A[1]', 'B[1]', 'C0'],
            output: 'Sum[1]',
            description: 'Full adder for bit 1',
          });
          // ... more bits
          break;
          
        case 'SUB':
          // Subtraction: A - B = A + (~B + 1) - uses NOT, XOR, AND, OR
          gates.push({
            gates: ['NOT'],
            inputs: ['B[0..31]'],
            output: '~B',
            description: 'Invert B (ones complement)',
          });
          gates.push({
            gates: ['XOR', 'AND', 'OR'],
            inputs: ['A', '~B', '1'],
            output: 'Result',
            description: 'Add A + ~B + 1 (twos complement)',
          });
          break;
          
        case 'IMUL':
          // Multiplication: series of AND gates and adders
          gates.push({
            gates: ['AND'],
            inputs: ['A[0..31]', 'B[0]'],
            output: 'Partial0',
            description: 'Partial product 0',
          });
          gates.push({
            gates: ['AND'],
            inputs: ['A[0..31]', 'B[1]'],
            output: 'Partial1',
            description: 'Partial product 1 (shifted)',
          });
          gates.push({
            gates: ['XOR', 'AND', 'OR'],
            inputs: ['Partial0', 'Partial1'],
            output: 'Sum',
            description: 'Add partial products',
          });
          break;
          
        case 'MOV':
          // Move is just passing through
          gates.push({
            gates: ['OR'],
            inputs: ['Data', '0'],
            output: 'Output',
            description: 'Pass data through (buffer)',
          });
          break;
      }
    });

    return gates;
  }
}

export default QuantumZoomSystem;
