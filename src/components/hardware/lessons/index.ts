// Hardware lessons - 19 lessons with 5-layer explanation system
export { BinaryPlaygroundLesson } from './BinaryPlaygroundLesson';
export { default as L01_BinaryFundamentals } from './L01_BinaryFundamentals';
export { default as L02_LogicGates } from './L02_LogicGates';
export { default as L03_Adders } from './L03_Adders';
export { default as L04_Multiplexers } from './L04_Multiplexers';
export { default as L05_FlipFlops } from './L05_FlipFlops';
export { default as L06_ALU } from './L06_ALU';
export { default as L07_FDECycle } from './L07_FDECycle';
export { default as L08_MemoryHierarchy } from './L08_MemoryHierarchy';
export { default as L09_CacheSystem } from './L09_CacheSystem';
export { default as L10_Pipelining } from './L10_Pipelining';
export { default as L11_BusArchitecture } from './L11_BusArchitecture';
export { default as L12_IOSystems } from './L12_IOSystems';
export { default as L13_Interrupts } from './L13_Interrupts';
export { default as L14_VirtualMemory } from './L14_VirtualMemory';
export { default as L15_InstructionSets } from './L15_InstructionSets';
export { default as L16_GPUArchitecture } from './L16_GPUArchitecture';
export { default as L17_PowerManagement } from './L17_PowerManagement';
export { default as L18_MultiCoreProcessing } from './L18_MultiCoreProcessing';
export { default as L19_SystemIntegration } from './L19_SystemIntegration';

export const FIVE_LAYER_LESSONS = [
  { id: 'l01', title: 'Binary Fundamentals', module: 'Digital Foundations', moduleColor: '#3b82f6' },
  { id: 'l02', title: 'Logic Gates', module: 'Digital Foundations', moduleColor: '#3b82f6' },
  { id: 'l03', title: 'Boolean Algebra', module: 'Digital Foundations', moduleColor: '#3b82f6' },
  { id: 'l04', title: 'Number Systems', module: 'Digital Foundations', moduleColor: '#3b82f6' },
  { id: 'l05', title: 'Memory Organization', module: 'Memory & Cache', moduleColor: '#22c55e' },
  { id: 'l06', title: 'Cache Systems', module: 'Memory & Cache', moduleColor: '#22c55e' },
  { id: 'l07', title: 'Data Types & Representation', module: 'Data & Computation', moduleColor: '#06b6d4' },
  { id: 'l08', title: 'ALU Operations', module: 'Data & Computation', moduleColor: '#06b6d4' },
  { id: 'l09', title: 'CPU Pipeline', module: 'CPU Execution', moduleColor: '#f97316' },
  { id: 'l10', title: 'Branch Prediction', module: 'CPU Execution', moduleColor: '#f97316' },
  { id: 'l11', title: 'Bus Architecture', module: 'System Communication', moduleColor: '#f59e0b' },
  { id: 'l12', title: 'I/O Systems', module: 'System Communication', moduleColor: '#f59e0b' },
  { id: 'l13', title: 'Interrupts', module: 'System Communication', moduleColor: '#f59e0b' },
  { id: 'l14', title: 'Virtual Memory', module: 'Advanced Systems', moduleColor: '#8b5cf6' },
  { id: 'l15', title: 'Instruction Sets', module: 'Advanced Systems', moduleColor: '#8b5cf6' },
  { id: 'l16', title: 'GPU Architecture', module: 'Advanced Systems', moduleColor: '#8b5cf6' },
  { id: 'l17', title: 'Power Management', module: 'Advanced Systems', moduleColor: '#8b5cf6' },
  { id: 'l18', title: 'Multi-Core Processing', module: 'Parallelism & Integration', moduleColor: '#ec4899' },
  { id: 'l19', title: 'System Integration', module: 'Parallelism & Integration', moduleColor: '#ec4899' },
];
