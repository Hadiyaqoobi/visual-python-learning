"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Home, CheckCircle } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import hardware components
const BinaryLightShow = dynamic(() => import("@/components/hardware/digital/BinaryLightShow"), { ssr: false });
const LogicGates = dynamic(() => import("@/components/hardware/digital/LogicGates"), { ssr: false });
const AnimatedAdder = dynamic(() => import("@/components/hardware/digital/AnimatedAdder"), { ssr: false });
const ALUSimulator = dynamic(() => import("@/components/hardware/digital/ALUSimulator"), { ssr: false });
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

// Lesson metadata
const LESSONS: Record<string, {
  id: string;
  title: string;
  module: string;
  moduleColor: string;
  description: string;
  component: React.ComponentType;
  prev?: string;
  next?: string;
}> = {
  h1: {
    id: "H1",
    title: "Binary Light Show",
    module: "Digital Foundations",
    moduleColor: "#3b82f6",
    description: "Interactive 8-bit LED binary display - learn how computers represent numbers",
    component: BinaryLightShow,
    next: "h2",
  },
  h2: {
    id: "H2",
    title: "Logic Gates Playground",
    module: "Digital Foundations",
    moduleColor: "#3b82f6",
    description: "AND, OR, NOT, XOR - the building blocks of all computation",
    component: LogicGates,
    prev: "h1",
    next: "h3",
  },
  h3: {
    id: "H3",
    title: "Animated Adder",
    module: "Digital Foundations",
    moduleColor: "#3b82f6",
    description: "Watch binary addition with carry propagation",
    component: AnimatedAdder,
    prev: "h2",
    next: "h4",
  },
  h4: {
    id: "H4",
    title: "ALU Simulator",
    module: "Digital Foundations",
    moduleColor: "#3b82f6",
    description: "The Arithmetic Logic Unit - heart of computation",
    component: ALUSimulator,
    prev: "h3",
    next: "h5",
  },
  h5: {
    id: "H5",
    title: "Register File Explorer",
    module: "Digital Foundations",
    moduleColor: "#3b82f6",
    description: "CPU registers - the fastest storage in your computer",
    component: RegisterFile,
    prev: "h4",
    next: "h6",
  },
  h6: {
    id: "H6",
    title: "Control Unit Conductor",
    module: "CPU Architecture",
    moduleColor: "#f97316",
    description: "The orchestrator that coordinates all CPU operations",
    component: ControlUnit,
    prev: "h5",
    next: "h7",
  },
  h7: {
    id: "H7",
    title: "CPU Builder",
    module: "CPU Architecture",
    moduleColor: "#f97316",
    description: "Build a CPU by connecting components together",
    component: CPUBuilder,
    prev: "h6",
    next: "h8",
  },
  h8: {
    id: "H8",
    title: "Instruction Decoder",
    module: "CPU Architecture",
    moduleColor: "#f97316",
    description: "How the CPU understands machine code instructions",
    component: InstructionDecoder,
    prev: "h7",
    next: "h9",
  },
  h9: {
    id: "H9",
    title: "Complete FDE Cycle",
    module: "CPU Architecture",
    moduleColor: "#f97316",
    description: "Fetch-Decode-Execute: the heartbeat of the CPU",
    component: FDECycle,
    prev: "h8",
    next: "h10",
  },
  h10: {
    id: "H10",
    title: "Memory Pyramid",
    module: "Memory Systems",
    moduleColor: "#22c55e",
    description: "The memory hierarchy from registers to disk",
    component: MemoryPyramid,
    prev: "h9",
    next: "h11",
  },
  h11: {
    id: "H11",
    title: "Cache Simulator",
    module: "Memory Systems",
    moduleColor: "#22c55e",
    description: "Experience cache hits and misses",
    component: CacheSimulator,
    prev: "h10",
    next: "h12",
  },
  h12: {
    id: "H12",
    title: "RAM Explorer",
    module: "Memory Systems",
    moduleColor: "#22c55e",
    description: "Explore addressable memory like real RAM",
    component: RAMExplorer,
    prev: "h11",
    next: "h13",
  },
  h13: {
    id: "H13",
    title: "Memory System Journey",
    module: "Memory Systems",
    moduleColor: "#22c55e",
    description: "Follow data through the complete memory hierarchy",
    component: MemorySystemJourney,
    prev: "h12",
    next: "h14",
  },
  h14: {
    id: "H14",
    title: "Code Transformer",
    module: "Software-Hardware Bridge",
    moduleColor: "#8b5cf6",
    description: "Watch Python transform to machine code",
    component: CodeTransformer,
    prev: "h13",
    next: "h15",
  },
  h15: {
    id: "H15",
    title: "Variable Memory",
    module: "Software-Hardware Bridge",
    moduleColor: "#8b5cf6",
    description: "See how Python variables live in memory",
    component: VariableMemory,
    prev: "h14",
    next: "h16",
  },
  h16: {
    id: "H16",
    title: "Call Stack Visualizer",
    module: "Software-Hardware Bridge",
    moduleColor: "#8b5cf6",
    description: "Watch function calls create stack frames",
    component: CallStackVisualizer,
    prev: "h15",
    next: "h17",
  },
  h17: {
    id: "H17",
    title: "CPU Execution Simulator",
    module: "Software-Hardware Bridge",
    moduleColor: "#8b5cf6",
    description: "See Python operations as CPU instructions",
    component: CPUExecutionSimulator,
    prev: "h16",
    next: "h18",
  },
  h18: {
    id: "H18",
    title: "Complete System Trace",
    module: "Integration & Synthesis",
    moduleColor: "#ec4899",
    description: "Trace an operation through the entire computer",
    component: CompleteSystemTrace,
    prev: "h17",
    next: "h19",
  },
  h19: {
    id: "H19",
    title: "Side-by-Side View",
    module: "Integration & Synthesis",
    moduleColor: "#ec4899",
    description: "Python and hardware executing together",
    component: SideBySideView,
    prev: "h18",
    next: "h20",
  },
  h20: {
    id: "H20",
    title: "Mental Model Builder",
    module: "Integration & Synthesis",
    moduleColor: "#ec4899",
    description: "Review and test your hardware knowledge",
    component: MentalModelBuilder,
    prev: "h19",
  },
};

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
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}>
        <h1 style={{ fontSize: 24, color: "#1e293b" }}>Lesson not found</h1>
        <button
          onClick={() => router.push("/hardware")}
          style={{
            padding: "12px 24px",
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Back to Hardware
        </button>
      </div>
    );
  }

  const LessonComponent = lesson.component;
  const progress = (Object.keys(LESSONS).indexOf(lessonId) + 1) / Object.keys(LESSONS).length * 100;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <div style={{
        background: "white",
        borderBottom: "1px solid #e2e8f0",
        padding: "16px 32px",
        position: "sticky",
        top: 0,
        zIndex: 50,
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
                background: "#f1f5f9",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                color: "#64748b",
                fontSize: 14,
              }}
            >
              <Home style={{ width: 16, height: 16 }} />
              All Lessons
            </button>
            
            <div style={{ height: 24, width: 1, background: "#e2e8f0" }} />
            
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
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{lesson.id}</span>
              </div>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b", margin: "4px 0 0" }}>
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
                background: "#e2e8f0",
                borderRadius: 3,
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: lesson.moduleColor,
                  borderRadius: 3,
                  transition: "width 0.3s",
                }} />
              </div>
              <span style={{ fontSize: 12, color: "#64748b" }}>
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
                  background: lesson.prev ? "#f1f5f9" : "#f8fafc",
                  border: "none",
                  borderRadius: 8,
                  cursor: lesson.prev ? "pointer" : "not-allowed",
                  color: lesson.prev ? "#64748b" : "#cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
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
                  background: isComplete ? "#22c55e" : lesson.moduleColor,
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontWeight: 500,
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
      <div style={{ padding: "32px" }}>
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
