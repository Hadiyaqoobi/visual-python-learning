// Hardware Educational Module - Complete 20-Lesson Visual Course
// Teaches computer architecture through interactive animations

// Module 1: Digital Foundations (H1-H5)
export * from './digital';

// Module 2: CPU Architecture (H6-H9)  
export * from './cpu';

// Module 3: Memory Systems (H10-H13)
export * from './memory';

// Module 4: Software-Hardware Bridge (H14-H17)
export * from './bridge';

// Module 5: Integration & Synthesis (H18-H20)
export * from './integration';

// Complete lesson registry
export const HardwareLessons = {
  // Module 1: Digital Foundations
  H1: { component: 'BinaryLightShow', module: 'digital', title: 'Binary Light Show' },
  H2: { component: 'LogicGates', module: 'digital', title: 'Logic Gates Playground' },
  H3: { component: 'AnimatedAdder', module: 'digital', title: 'Animated Adder' },
  H4: { component: 'ALUSimulator', module: 'digital', title: 'ALU Simulator' },
  H5: { component: 'RegisterFile', module: 'digital', title: 'Register File Explorer' },
  
  // Module 2: CPU Architecture
  H6: { component: 'ControlUnit', module: 'cpu', title: 'Control Unit Conductor' },
  H7: { component: 'CPUBuilder', module: 'cpu', title: 'CPU Builder' },
  H8: { component: 'InstructionDecoder', module: 'cpu', title: 'Instruction Decoder' },
  H9: { component: 'FDECycle', module: 'cpu', title: 'Complete FDE Cycle' },
  
  // Module 3: Memory Systems
  H10: { component: 'MemoryPyramid', module: 'memory', title: 'Memory Pyramid' },
  H11: { component: 'CacheSimulator', module: 'memory', title: 'Cache Simulator' },
  H12: { component: 'RAMExplorer', module: 'memory', title: 'RAM Explorer' },
  H13: { component: 'MemorySystemJourney', module: 'memory', title: 'Memory System Journey' },
  
  // Module 4: Software-Hardware Bridge
  H14: { component: 'CodeTransformer', module: 'bridge', title: 'Python → Machine Code' },
  H15: { component: 'VariableMemory', module: 'bridge', title: 'Variable Memory Visualizer' },
  H16: { component: 'CallStackVisualizer', module: 'bridge', title: 'Call Stack Visualizer' },
  H17: { component: 'CPUExecutionSimulator', module: 'bridge', title: 'CPU Execution Simulator' },
  
  // Module 5: Integration & Synthesis
  H18: { component: 'CompleteSystemTrace', module: 'integration', title: 'Complete System Trace' },
  H19: { component: 'SideBySideView', module: 'integration', title: 'Side-by-Side View' },
  H20: { component: 'MentalModelBuilder', module: 'integration', title: 'Build Your Mental Model' },
};

// Module metadata
export const HardwareModules = [
  {
    id: 1,
    name: 'Digital Foundations',
    lessons: ['H1', 'H2', 'H3', 'H4', 'H5'],
    description: 'Binary, logic gates, ALU, and registers',
    color: '#3b82f6',
  },
  {
    id: 2,
    name: 'CPU Architecture',
    lessons: ['H6', 'H7', 'H8', 'H9'],
    description: 'Control unit, instruction decoding, FDE cycle',
    color: '#f97316',
  },
  {
    id: 3,
    name: 'Memory Systems',
    lessons: ['H10', 'H11', 'H12', 'H13'],
    description: 'Memory hierarchy, cache, RAM',
    color: '#22c55e',
  },
  {
    id: 4,
    name: 'Software-Hardware Bridge',
    lessons: ['H14', 'H15', 'H16', 'H17'],
    description: 'Python compilation, variables, call stack',
    color: '#8b5cf6',
  },
  {
    id: 5,
    name: 'Integration & Synthesis',
    lessons: ['H18', 'H19', 'H20'],
    description: 'Complete system understanding',
    color: '#ec4899',
  },
];
