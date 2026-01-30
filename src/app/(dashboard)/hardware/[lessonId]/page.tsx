"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Home, CheckCircle, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

// Loading placeholder for 3D components
function LoadingPlaceholder({ text }: { text: string }) {
  return (
    <div style={{
      width: '100%',
      height: '600px',
      background: 'linear-gradient(135deg, #0A0A1E 0%, #1A1A3E 100%)',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        border: '3px solid #1a1a3e',
        borderTopColor: '#00FFFF',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        color: '#00FFFF',
        fontSize: '14px',
      }}>
        {text}
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ============================================
// 3D COMPONENTS (Revolutionary)
// ============================================
const BinaryMatrix3D = dynamic(
  () => import("@/components/hardware/digital3d/BinaryMatrix3D").then(mod => mod.BinaryMatrix3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading Binary Matrix 3D..." /> }
);

const LogicGates3D = dynamic(
  () => import("@/components/hardware/digital3d/LogicGates3D").then(mod => mod.LogicGates3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading Logic Gates 3D..." /> }
);

const CompilerPipeline3D = dynamic(
  () => import("@/components/hardware/bridge3d/CompilerPipeline3D").then(mod => mod.CompilerPipeline3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading Compiler Pipeline 3D..." /> }
);

const StackVisualizer3D = dynamic(
  () => import("@/components/hardware/bridge3d/StackVisualizer3D").then(mod => mod.StackVisualizer3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading Stack Visualizer 3D..." /> }
);

const HeapVisualizer3D = dynamic(
  () => import("@/components/hardware/bridge3d/HeapVisualizer3D").then(mod => mod.HeapVisualizer3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading Heap Visualizer 3D..." /> }
);

const SystemTrace3D = dynamic(
  () => import("@/components/hardware/integration3d/SystemTrace3D").then(mod => mod.SystemTrace3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading System Trace 3D..." /> }
);

const PerformanceLab3D = dynamic(
  () => import("@/components/hardware/integration3d/PerformanceLab3D").then(mod => mod.PerformanceLab3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading Performance Lab 3D..." /> }
);

const HardwareMaster3D = dynamic(
  () => import("@/components/hardware/integration3d/HardwareMaster3D").then(mod => mod.HardwareMaster3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading Hardware Master 3D..." /> }
);

const OSScheduler3D = dynamic(
  () => import("@/components/hardware/bridge3d/OSScheduler3D").then(mod => mod.OSScheduler3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading OS Scheduler 3D..." /> }
);

const MemoryPyramid3D = dynamic(
  () => import("@/components/hardware/memory3d/MemoryPyramid3D").then(mod => mod.MemoryPyramid3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading Memory Pyramid 3D..." /> }
);

const CacheSimulator3D = dynamic(
  () => import("@/components/hardware/memory3d/CacheSimulator3D").then(mod => mod.CacheSimulator3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading Cache Simulator 3D..." /> }
);

const RAMExplorer3D = dynamic(
  () => import("@/components/hardware/memory3d/RAMExplorer3D").then(mod => mod.RAMExplorer3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading RAM Explorer 3D..." /> }
);

const MemoryJourney3D = dynamic(
  () => import("@/components/hardware/memory3d/MemoryJourney3D").then(mod => mod.MemoryJourney3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading Memory Journey 3D..." /> }
);

const ControlUnit3D = dynamic(
  () => import("@/components/hardware/cpu3d/ControlUnit3D").then(mod => mod.ControlUnit3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading Control Unit 3D..." /> }
);

const CPUBuilder3D = dynamic(
  () => import("@/components/hardware/cpu3d/CPUBuilder3D").then(mod => mod.CPUBuilder3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading CPU Builder 3D..." /> }
);

const InstructionDecoder3D = dynamic(
  () => import("@/components/hardware/cpu3d/InstructionDecoder3D").then(mod => mod.InstructionDecoder3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading Instruction Decoder 3D..." /> }
);

const FDECycle3D = dynamic(
  () => import("@/components/hardware/cpu3d/FDECycle3D").then(mod => mod.FDECycle3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading FDE Cycle 3D..." /> }
);

const RegisterFile3D = dynamic(
  () => import("@/components/hardware/digital3d/RegisterFile3D").then(mod => mod.RegisterFile3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading Register File 3D..." /> }
);

const BinaryCalculator3D = dynamic(
  () => import("@/components/hardware/digital3d/BinaryCalculator3D").then(mod => mod.BinaryCalculator3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading Binary Calculator 3D..." /> }
);

const ALUChamber3D = dynamic(
  () => import("@/components/hardware/digital3d/ALUChamber3D").then(mod => mod.ALUChamber3D),
  { ssr: false, loading: () => <LoadingPlaceholder text="Loading ALU Chamber 3D..." /> }
);

// ============================================
// 2D COMPONENTS (Standard)
// ============================================
const AnimatedAdder = dynamic(() => import("@/components/hardware/digital/AnimatedAdder"), { ssr: false });
const RegisterFile = dynamic(() => import("@/components/hardware/digital/RegisterFile"), { ssr: false });

const ControlUnit = dynamic(() => import("@/components/hardware/cpu/ControlUnit"), { ssr: false });
const CPUBuilder = dynamic(() => import("@/components/hardware/cpu/CPUBuilder"), { ssr: false });
const InstructionDecoder = dynamic(() => import("@/components/hardware/cpu/InstructionDecoder"), { ssr: false });
const FDECycle = dynamic(() => import("@/components/hardware/cpu/FDECycle"), { ssr: false });

const MemoryPyramid = dynamic(() => import("@/components/hardware/memory/MemoryPyramid"), { ssr: false });
const CacheSimulator = dynamic(() => import("@/components/hardware/memory/CacheSimulator"), { ssr: false });
const RAMExplorer = dynamic(() => import("@/components/hardware/memory/RAMExplorer"), { ssr: false });
const MemorySystemJourney = dynamic(() => import("@/components/hardware/memory/MemorySystemJourney"), { ssr: false });

const CodeTransformer = dynamic(() => import("@/components/hardware/bridge/CodeTransformer"), { ssr: false });
const VariableMemory = dynamic(() => import("@/components/hardware/bridge/VariableMemory"), { ssr: false });
const CallStackVisualizer = dynamic(() => import("@/components/hardware/bridge/CallStackVisualizer"), { ssr: false });
const CPUExecutionSimulator = dynamic(() => import("@/components/hardware/bridge/CPUExecutionSimulator"), { ssr: false });

const CompleteSystemTrace = dynamic(() => import("@/components/hardware/integration/CompleteSystemTrace"), { ssr: false });
const SideBySideView = dynamic(() => import("@/components/hardware/integration/SideBySideView"), { ssr: false });
const MentalModelBuilder = dynamic(() => import("@/components/hardware/integration/MentalModelBuilder"), { ssr: false });

// ============================================
// LESSON CONFIGURATION
// ============================================
const LESSONS: Record<string, {
  id: string;
  title: string;
  module: string;
  moduleColor: string;
  description: string;
  component: React.ComponentType;
  is3D?: boolean;
  prev?: string;
  next?: string;
}> = {
  h1: {
    id: "H1",
    title: "Binary Matrix 3D",
    module: "Digital Foundations",
    moduleColor: "#3b82f6",
    description: "Interactive 3D binary display with glowing cubes and particle effects",
    component: BinaryMatrix3D,
    is3D: true,
    next: "h2",
  },
  h2: {
    id: "H2",
    title: "Logic Gates 3D Circuit Lab",
    module: "Digital Foundations",
    moduleColor: "#3b82f6",
    description: "3D logic gates with electron flow visualization",
    component: LogicGates3D,
    is3D: true,
    prev: "h1",
    next: "h3",
  },
  h3: {
    id: "H3",
    title: "Binary Calculator 3D",
    module: "Digital Foundations",
    moduleColor: "#3b82f6",
    description: "Watch binary addition with carry propagation in 3D",
    component: BinaryCalculator3D,
    is3D: true,
    prev: "h2",
    next: "h4",
  },
  h4: {
    id: "H4",
    title: "ALU Computation Chamber",
    module: "Digital Foundations",
    moduleColor: "#3b82f6",
    description: "3D ALU with particle data streams and operation visualization",
    component: ALUChamber3D,
    is3D: true,
    prev: "h3",
    next: "h5",
  },
  h5: {
    id: "H5",
    title: "Register File 3D",
    module: "Digital Foundations",
    moduleColor: "#3b82f6",
    description: "CPU registers - the fastest storage in your computer",
    component: RegisterFile3D,
    is3D: true,
    prev: "h4",
    next: "h6",
  },
  h6: {
    id: "H6",
    title: "Control Unit 3D",
    module: "CPU Architecture",
    moduleColor: "#f97316",
    description: "The orchestrator that coordinates all CPU operations",
    component: ControlUnit3D,
    is3D: true,
    prev: "h5",
    next: "h7",
  },
  h7: {
    id: "H7",
    title: "CPU Builder 3D",
    module: "CPU Architecture",
    moduleColor: "#f97316",
    description: "Build a CPU by connecting components together",
    component: CPUBuilder3D,
    is3D: true,
    prev: "h6",
    next: "h8",
  },
  h8: {
    id: "H8",
    title: "Instruction Decoder 3D",
    module: "CPU Architecture",
    moduleColor: "#f97316",
    description: "How the CPU understands machine code instructions",
    component: InstructionDecoder3D,
    is3D: true,
    prev: "h7",
    next: "h9",
  },
  h9: {
    id: "H9",
    title: "FDE Cycle 3D",
    module: "CPU Architecture",
    moduleColor: "#f97316",
    description: "Fetch-Decode-Execute: the heartbeat of the CPU",
    component: FDECycle3D,
    is3D: true,
    prev: "h8",
    next: "h10",
  },
  h10: {
    id: "H10",
    title: "Memory Pyramid 3D",
    module: "Memory Systems",
    moduleColor: "#22c55e",
    description: "The memory hierarchy from registers to disk",
    component: MemoryPyramid3D,
    is3D: true,
    prev: "h9",
    next: "h11",
  },
  h11: {
    id: "H11",
    title: "Cache Simulator 3D",
    module: "Memory Systems",
    moduleColor: "#22c55e",
    description: "Experience cache hits and misses",
    component: CacheSimulator3D,
    is3D: true,
    prev: "h10",
    next: "h12",
  },
  h12: {
    id: "H12",
    title: "RAM Explorer 3D",
    module: "Memory Systems",
    moduleColor: "#22c55e",
    description: "Explore addressable memory like real RAM",
    component: RAMExplorer3D,
    is3D: true,
    prev: "h11",
    next: "h13",
  },
  h13: {
    id: "H13",
    title: "Memory Journey 3D",
    module: "Memory Systems",
    moduleColor: "#22c55e",
    description: "Follow data through the complete memory hierarchy",
    component: MemoryJourney3D,
    is3D: true,
    prev: "h12",
    next: "h14",
  },
  h14: {
    id: "H14",
    title: "Compiler Pipeline 3D",
    module: "Software-Hardware Bridge",
    moduleColor: "#8b5cf6",
    description: "Watch Python transform to machine code",
    component: CompilerPipeline3D,
    is3D: true,
    prev: "h13",
    next: "h15",
  },
  h15: {
    id: "H15",
    title: "Heap Visualizer 3D",
    module: "Software-Hardware Bridge",
    moduleColor: "#8b5cf6",
    description: "See how Python variables live in memory",
    component: HeapVisualizer3D,
    is3D: true,
    prev: "h14",
    next: "h16",
  },
  h16: {
    id: "H16",
    title: "Stack Visualizer 3D",
    module: "Software-Hardware Bridge",
    moduleColor: "#8b5cf6",
    description: "Watch function calls create stack frames",
    component: StackVisualizer3D,
    is3D: true,
    prev: "h15",
    next: "h17",
  },
  h17: {
    id: "H17",
    title: "OS Scheduler 3D",
    module: "Software-Hardware Bridge",
    moduleColor: "#8b5cf6",
    description: "See how the OS manages processes",
    component: OSScheduler3D,
    is3D: true,
    prev: "h16",
    next: "h18",
  },
  h18: {
    id: "H18",
    title: "System Trace 3D",
    module: "Integration & Synthesis",
    moduleColor: "#ec4899",
    description: "Trace an operation through the entire computer",
    component: SystemTrace3D,
    is3D: true,
    prev: "h17",
    next: "h19",
  },
  h19: {
    id: "H19",
    title: "Performance Lab 3D",
    module: "Integration & Synthesis",
    moduleColor: "#ec4899",
    description: "Compare coding patterns and their hardware impact",
    component: PerformanceLab3D,
    is3D: true,
    prev: "h18",
    next: "h20",
  },
  h20: {
    id: "H20",
    title: "Hardware Master Quiz",
    module: "Integration & Synthesis",
    moduleColor: "#ec4899",
    description: "Test your hardware knowledge",
    component: HardwareMaster3D,
    is3D: true,
    prev: "h19",
  },
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function HardwareLessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = (params.lessonId as string)?.toLowerCase();
  const lesson = LESSONS[lessonId];

  const [isComplete, setIsComplete] = useState(false);

  if (!lesson) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0A0A1E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}>
        <h1 style={{ fontSize: 24, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>
          Lesson not found
        </h1>
        <button
          onClick={() => router.push("/hardware")}
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg, #00AAFF, #FF00FF)",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Back to Hardware
        </button>
      </div>
    );
  }

  const LessonComponent = lesson.component;
  const progress = (Object.keys(LESSONS).indexOf(lessonId) + 1) / Object.keys(LESSONS).length * 100;

  // Use dark theme for 3D lessons
  const isDark = lesson.is3D;

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#0A0A1E" : "#f8fafc" }}>
      {/* Header */}
      <div style={{
        background: isDark ? "rgba(10, 10, 30, 0.95)" : "white",
        borderBottom: isDark ? "1px solid rgba(0, 255, 255, 0.1)" : "1px solid #e2e8f0",
        padding: "16px 32px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => router.push("/hardware")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                background: isDark ? "rgba(0, 170, 255, 0.1)" : "#f1f5f9",
                border: isDark ? "1px solid rgba(0, 255, 255, 0.2)" : "none",
                borderRadius: 8,
                cursor: "pointer",
                color: isDark ? "#00FFFF" : "#64748b",
                fontSize: 14,
                fontFamily: isDark ? "'JetBrains Mono', monospace" : "inherit",
              }}
            >
              <Home style={{ width: 16, height: 16 }} />
              All Lessons
            </button>
            
            <div style={{ height: 24, width: 1, background: isDark ? "#1a1a3e" : "#e2e8f0" }} />
            
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  fontSize: 12,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: lesson.moduleColor,
                  color: "white",
                  fontWeight: 500,
                }}>
                  {lesson.module}
                </span>
                <span style={{ fontSize: 12, color: isDark ? "#666" : "#94a3b8" }}>{lesson.id}</span>
                {lesson.is3D && (
                  <span style={{
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: "linear-gradient(135deg, #00AAFF, #FF00FF)",
                    color: "white",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}>
                    <Sparkles style={{ width: 10, height: 10 }} />
                    3D
                  </span>
                )}
              </div>
              <h1 style={{ 
                fontSize: 18, 
                fontWeight: 600, 
                color: isDark ? "#fff" : "#1e293b", 
                margin: "4px 0 0",
                fontFamily: isDark ? "'JetBrains Mono', monospace" : "inherit",
              }}>
                {lesson.title}
              </h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Progress */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 120,
                height: 6,
                background: isDark ? "#1a1a3e" : "#e2e8f0",
                borderRadius: 3,
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: isDark 
                    ? "linear-gradient(90deg, #00AAFF, #FF00FF)" 
                    : lesson.moduleColor,
                  borderRadius: 3,
                  transition: "width 0.3s",
                }} />
              </div>
              <span style={{ fontSize: 12, color: isDark ? "#666" : "#64748b" }}>
                {Math.round(progress)}%
              </span>
            </div>

            {/* Nav buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => lesson.prev && router.push(`/hardware/${lesson.prev}`)}
                disabled={!lesson.prev}
                style={{
                  padding: "8px 16px",
                  background: lesson.prev 
                    ? (isDark ? "rgba(0, 170, 255, 0.1)" : "#f1f5f9")
                    : (isDark ? "#0a0a1e" : "#f8fafc"),
                  border: isDark ? "1px solid rgba(0, 255, 255, 0.2)" : "none",
                  borderRadius: 8,
                  cursor: lesson.prev ? "pointer" : "not-allowed",
                  color: lesson.prev 
                    ? (isDark ? "#00FFFF" : "#64748b")
                    : (isDark ? "#333" : "#cbd5e1"),
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: isDark ? "'JetBrains Mono', monospace" : "inherit",
                }}
              >
                <ArrowLeft style={{ width: 16, height: 16 }} />
                Prev
              </button>
              
              <button
                onClick={() => {
                  setIsComplete(true);
                  if (lesson.next) {
                    setTimeout(() => router.push(`/hardware/${lesson.next}`), 500);
                  }
                }}
                style={{
                  padding: "8px 16px",
                  background: isComplete 
                    ? "#22c55e" 
                    : (isDark ? "linear-gradient(135deg, #00AAFF, #FF00FF)" : lesson.moduleColor),
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontWeight: 500,
                  fontFamily: isDark ? "'JetBrains Mono', monospace" : "inherit",
                  boxShadow: isDark ? "0 0 20px rgba(0, 170, 255, 0.3)" : "none",
                }}
              >
                {isComplete ? (
                  <>
                    <CheckCircle style={{ width: 16, height: 16 }} />
                    Complete!
                  </>
                ) : lesson.next ? (
                  <>
                    Next
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </>
                ) : (
                  "Finish"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div style={{ padding: isDark ? "24px" : "32px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={lessonId}
        >
          <LessonComponent />
        </motion.div>
      </div>
    </div>
  );
}
