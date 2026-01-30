"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Cpu, 
  Binary, 
  CircuitBoard, 
  HardDrive, 
  Code2, 
  Layers,
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle,
  Lock
} from "lucide-react";

const HARDWARE_MODULES = [
  {
    id: 1,
    name: "Digital Foundations",
    description: "Binary, logic gates, ALU, and registers",
    icon: Binary,
    color: "#3b82f6",
    lessons: [
      { id: "H1", title: "Binary Light Show", description: "Interactive 8-bit LED binary display", component: "BinaryLightShow" },
      { id: "H2", title: "Logic Gates Playground", description: "AND, OR, NOT, XOR gate simulator", component: "LogicGates" },
      { id: "H3", title: "Animated Adder", description: "Binary addition with carry propagation", component: "AnimatedAdder" },
      { id: "H4", title: "ALU Simulator", description: "Arithmetic Logic Unit operations", component: "ALUSimulator" },
      { id: "H5", title: "Register File Explorer", description: "CPU registers and speed comparison", component: "RegisterFile" },
    ],
  },
  {
    id: 2,
    name: "CPU Architecture",
    description: "Control unit, instruction decoding, FDE cycle",
    icon: Cpu,
    color: "#f97316",
    lessons: [
      { id: "H6", title: "Control Unit Conductor", description: "Control signal orchestration", component: "ControlUnit" },
      { id: "H7", title: "CPU Builder", description: "Drag-and-drop CPU assembly", component: "CPUBuilder" },
      { id: "H8", title: "Instruction Decoder", description: "Machine code breakdown", component: "InstructionDecoder" },
      { id: "H9", title: "Complete FDE Cycle", description: "Fetch-Decode-Execute animation", component: "FDECycle" },
    ],
  },
  {
    id: 3,
    name: "Memory Systems",
    description: "Memory hierarchy, cache, RAM",
    icon: HardDrive,
    color: "#22c55e",
    lessons: [
      { id: "H10", title: "Memory Pyramid", description: "Memory hierarchy visualization", component: "MemoryPyramid" },
      { id: "H11", title: "Cache Simulator", description: "Cache hit/miss demonstration", component: "CacheSimulator" },
      { id: "H12", title: "RAM Explorer", description: "Address-based memory access", component: "RAMExplorer" },
      { id: "H13", title: "Memory System Journey", description: "Data path through memory levels", component: "MemorySystemJourney" },
    ],
  },
  {
    id: 4,
    name: "Software-Hardware Bridge",
    description: "How Python code becomes machine operations",
    icon: Code2,
    color: "#8b5cf6",
    lessons: [
      { id: "H14", title: "Code Transformer", description: "Python → Bytecode → Machine code", component: "CodeTransformer" },
      { id: "H15", title: "Variable Memory", description: "How variables are stored in memory", component: "VariableMemory" },
      { id: "H16", title: "Call Stack Visualizer", description: "Function call stack frames", component: "CallStackVisualizer" },
      { id: "H17", title: "CPU Execution Simulator", description: "Watch CPU execute your code", component: "CPUExecutionSimulator" },
    ],
  },
  {
    id: 5,
    name: "Integration & Synthesis",
    description: "Putting it all together",
    icon: Layers,
    color: "#ec4899",
    lessons: [
      { id: "H18", title: "Complete System Trace", description: "Trace operations through entire system", component: "CompleteSystemTrace" },
      { id: "H19", title: "Side-by-Side View", description: "Python + Hardware comparison", component: "SideBySideView" },
      { id: "H20", title: "Mental Model Builder", description: "Review concepts and test knowledge", component: "MentalModelBuilder" },
    ],
  },
];

export default function HardwarePage() {
  const [expandedModule, setExpandedModule] = useState<number | null>(1);
  const [completedLessons] = useState<string[]>([]);

  const totalLessons = HARDWARE_MODULES.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)" }}>
      {/* Header */}
      <div style={{ padding: "40px 40px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <CircuitBoard style={{ width: 32, height: 32, color: "white" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "white", margin: 0 }}>
              Learn Hardware
            </h1>
            <p style={{ color: "#a5b4fc", margin: "4px 0 0", fontSize: 16 }}>
              Understand how computers actually work
            </p>
          </div>
        </div>

        <p style={{ color: "#c7d2fe", fontSize: 15, maxWidth: 800, lineHeight: 1.6, marginBottom: 24 }}>
          Explore the fascinating world of computer hardware through interactive visualizations. 
          See how binary becomes logic, logic becomes computation, and Python code executes on real hardware.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{
            padding: "12px 20px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <Cpu style={{ width: 18, height: 18, color: "#f97316" }} />
            <span style={{ color: "white", fontWeight: 600 }}>{totalLessons} Lessons</span>
          </div>
          <div style={{
            padding: "12px 20px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <Layers style={{ width: 18, height: 18, color: "#22c55e" }} />
            <span style={{ color: "white", fontWeight: 600 }}>5 Modules</span>
          </div>
          <div style={{
            padding: "12px 20px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <Play style={{ width: 18, height: 18, color: "#8b5cf6" }} />
            <span style={{ color: "white", fontWeight: 600 }}>Interactive</span>
          </div>
        </div>
      </div>

      {/* Module List */}
      <div style={{ padding: "30px 40px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 900 }}>
          {HARDWARE_MODULES.map((module) => {
            const Icon = module.icon;
            const isExpanded = expandedModule === module.id;
            const moduleCompleted = module.lessons.filter(l => completedLessons.includes(l.id)).length;

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: module.id * 0.1 }}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.1)",
                  overflow: "hidden",
                }}
              >
                {/* Module Header */}
                <button
                  onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                  style={{
                    width: "100%",
                    padding: "20px 24px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: module.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Icon style={{ width: 24, height: 24, color: "white" }} />
                  </div>
                  
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 600, color: "white", margin: 0 }}>
                        Module {module.id}: {module.name}
                      </h3>
                      <span style={{
                        fontSize: 12,
                        padding: "2px 8px",
                        borderRadius: 6,
                        background: "rgba(255,255,255,0.1)",
                        color: "#a5b4fc",
                      }}>
                        {module.lessons.length} lessons
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: "#a5b4fc", margin: "4px 0 0" }}>
                      {module.description}
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 14, color: "#a5b4fc" }}>
                      {moduleCompleted}/{module.lessons.length}
                    </span>
                    {isExpanded ? (
                      <ChevronUp style={{ width: 20, height: 20, color: "#a5b4fc" }} />
                    ) : (
                      <ChevronDown style={{ width: 20, height: 20, color: "#a5b4fc" }} />
                    )}
                  </div>
                </button>

                {/* Lessons */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.1)",
                      padding: "16px 24px",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {module.lessons.map((lesson, idx) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        const isLocked = false;
                        const lessonHref = "/hardware/" + lesson.id.toLowerCase();

                        return (
                          <Link
                            key={lesson.id}
                            href={lessonHref}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              padding: "14px 16px",
                              background: "rgba(255,255,255,0.03)",
                              borderRadius: 10,
                              textDecoration: "none",
                              transition: "all 0.2s",
                              border: "1px solid transparent",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                              e.currentTarget.style.borderColor = "transparent";
                            }}
                          >
                            <div style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              background: isCompleted ? "#22c55e" : module.color + "40",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: isCompleted ? "white" : module.color,
                              fontSize: 14,
                              fontWeight: 600,
                            }}>
                              {isCompleted ? (
                                <CheckCircle style={{ width: 18, height: 18 }} />
                              ) : isLocked ? (
                                <Lock style={{ width: 16, height: 16 }} />
                              ) : (
                                idx + 1
                              )}
                            </div>
                            
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 15, fontWeight: 500, color: "white" }}>
                                {lesson.title}
                              </div>
                              <div style={{ fontSize: 13, color: "#a5b4fc" }}>
                                {lesson.description}
                              </div>
                            </div>

                            <div style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              background: module.color,
                              color: "white",
                              fontSize: 12,
                              fontWeight: 500,
                            }}>
                              Start →
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
