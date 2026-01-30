// Hardware Educational Module - Complete 20-Lesson Visual Course

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
  H1: { component: 'BinaryLightShow', module: 'digital', title: 'Binary Light Show' },
  H2: { component: 'LogicGates', module: 'digital', title: 'Logic Gates Playground' },
  H3: { component: 'AnimatedAdder', module: 'digital', title: 'Animated Adder' },
  H4: { component: 'ALUSimulator', module: 'digital', title: 'ALU Simulator' },
  H5: { component: 'RegisterFile', module: 'digital', title: 'Register File Explorer' },
  H6: { component: 'ControlUnit', module: 'cpu', title: 'Control Unit Conductor' },
  H7: { component: 'CPUBuilder', module: 'cpu', title: 'CPU Builder' },
  H8: { component: 'InstructionDecoder', module: 'cpu', title: 'Instruction Decoder' },
  H9: { component: 'FDECycle', module: 'cpu', title: 'Complete FDE Cycle' },
  H10: { component: 'MemoryPyramid', module: 'memory', title: 'Memory Pyramid' },
  H11: { component: 'CacheSimulator', module: 'memory', title: 'Cache Simulator' },
  H12: { component: 'RAMExplorer', module: 'memory', title: 'RAM Explorer' },
  H13: { component: 'MemorySystemJourney', module: 'memory', title: 'Memory System Journey' },
  H14: { component: 'CodeTransformer', module: 'bridge', title: 'Python → Machine Code' },
  H15: { component: 'VariableMemory', module: 'bridge', title: 'Variable Memory Visualizer' },
  H16: { component: 'CallStackVisualizer', module: 'bridge', title: 'Call Stack Visualizer' },
  H17: { component: 'CPUExecutionSimulator', module: 'bridge', title: 'CPU Execution Simulator' },
  H18: { component: 'CompleteSystemTrace', module: 'integration', title: 'Complete System Trace' },
  H19: { component: 'SideBySideView', module: 'integration', title: 'Side-by-Side View' },
  H20: { component: 'MentalModelBuilder', module: 'integration', title: 'Build Your Mental Model' },
};
