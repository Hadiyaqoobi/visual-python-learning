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
  Lock,
  Sparkles
} from "lucide-react";

const HARDWARE_MODULES = [
  {
    id: 1,
    name: "Digital Foundations",
    description: "Binary, logic gates, ALU, and registers",
    icon: Binary,
    color: "#3b82f6",
    lessons: [
      { id: "H1", title: "Binary Matrix 3D", description: "Floating glowing cubes with particle effects", is3D: true },
      { id: "H2", title: "Logic Gates 3D Circuit Lab", description: "3D gates with electron flow", is3D: true },
      { id: "H3", title: "Binary Calculator 3D", description: "Ripple carry addition animation", is3D: true },
      { id: "H4", title: "ALU Computation Chamber", description: "3D ALU with data particle streams", is3D: true },
      { id: "H5", title: "Register File Explorer", description: "CPU registers and speed comparison", is3D: false },
    ],
  },
  {
    id: 2,
    name: "CPU Architecture",
    description: "Control unit, instruction decoding, FDE cycle",
    icon: Cpu,
    color: "#f97316",
    lessons: [
      { id: "H6", title: "Control Unit Conductor", description: "Control signal orchestration", is3D: false },
      { id: "H7", title: "CPU Builder", description: "Drag-and-drop CPU assembly", is3D: false },
      { id: "H8", title: "Instruction Decoder", description: "Machine code breakdown", is3D: false },
      { id: "H9", title: "Complete FDE Cycle", description: "Fetch-Decode-Execute animation", is3D: false },
    ],
  },
  {
    id: 3,
    name: "Memory Systems",
    description: "Memory hierarchy, cache, RAM",
    icon: HardDrive,
    color: "#22c55e",
    lessons: [
      { id: "H10", title: "Memory Pyramid", description: "Memory hierarchy visualization", is3D: false },
      { id: "H11", title: "Cache Simulator", description: "Cache hit/miss demonstration", is3D: false },
      { id: "H12", title: "RAM Explorer", description: "Address-based memory access", is3D: false },
      { id: "H13", title: "Memory System Journey", description: "Data path through memory levels", is3D: false },
    ],
  },
  {
    id: 4,
    name: "Software-Hardware Bridge",
    description: "How Python code becomes machine operations",
    icon: Code2,
    color: "#8b5cf6",
    lessons: [
      { id: "H14", title: "Code Transformer", description: "Python → Bytecode → Machine code", is3D: false },
      { id: "H15", title: "Variable Memory", description: "How variables are stored in memory", is3D: false },
      { id: "H16", title: "Call Stack Visualizer", description: "Function call stack frames", is3D: false },
      { id: "H17", title: "CPU Execution Simulator", description: "Watch CPU execute your code", is3D: false },
    ],
  },
  {
    id: 5,
    name: "Integration & Synthesis",
    description: "Putting it all together",
    icon: Layers,
    color: "#ec4899",
    lessons: [
      { id: "H18", title: "Complete System Trace", description: "Trace operations through entire system", is3D: false },
      { id: "H19", title: "Side-by-Side View", description: "Python + Hardware comparison", is3D: false },
      { id: "H20", title: "Mental Model Builder", description: "Review concepts and test knowledge", is3D: false },
    ],
  },
];

export default function HardwarePage() {
  const [expandedModule, setExpandedModule] = useState<number | null>(1);
  const [completedLessons] = useState<string[]>([]);

  const totalLessons = HARDWARE_MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
  const total3DLessons = HARDWARE_MODULES.reduce((sum, m) => sum + m.lessons.filter(l => l.is3D).length, 0);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0A0A1E 0%, #1A1A3E 50%, #0A0A1E 100%)" }}>
      {/* Header */}
      <div style={{ padding: "40px 40px 20px", borderBottom: "1px solid rgba(0, 255, 255, 0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "linear-gradient(135deg, #00AAFF 0%, #FF00FF 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 30px rgba(0, 170, 255, 0.5)",
          }}>
            <CircuitBoard style={{ width: 32, height: 32, color: "white" }} />
          </div>
          <div>
            <h1 style={{ 
              fontSize: 32, 
              fontWeight: 700, 
              color: "white", 
              margin: 0,
              fontFamily: "'JetBrains Mono', monospace",
              textShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
            }}>
              Learn Hardware
            </h1>
            <p style={{ color: "#00FFFF", margin: "4px 0 0", fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>
              Revolutionary 3D visualizations of computer architecture
            </p>
          </div>
        </div>

        <p style={{ color: "#888", fontSize: 14, maxWidth: 800, lineHeight: 1.6, marginBottom: 24 }}>
          Experience the fascinating world of computer hardware through stunning 3D visualizations. 
          Watch electrons flow through logic gates, see binary come alive as glowing cubes, and understand 
          how your Python code executes on real hardware.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{
            padding: "12px 20px",
            background: "rgba(0, 170, 255, 0.1)",
            border: "1px solid rgba(0, 255, 255, 0.2)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <Cpu style={{ width: 18, height: 18, color: "#00FFFF" }} />
            <span style={{ color: "white", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
              {totalLessons} Lessons
            </span>
          </div>
          <div style={{
            padding: "12px 20px",
            background: "linear-gradient(135deg, rgba(0, 170, 255, 0.1), rgba(255, 0, 255, 0.1))",
            border: "1px solid rgba(255, 0, 255, 0.2)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <Sparkles style={{ width: 18, height: 18, color: "#FF00FF" }} />
            <span style={{ color: "white", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
              {total3DLessons} Interactive 3D
            </span>
          </div>
          <div style={{
            padding: "12px 20px",
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <CheckCircle style={{ width: 18, height: 18, color: "#22c55e" }} />
            <span style={{ color: "white", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
              {completedLessons.length} Completed
            </span>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div style={{ padding: "24px 40px" }}>
        {HARDWARE_MODULES.map((module, moduleIndex) => {
          const ModuleIcon = module.icon;
          const isExpanded = expandedModule === module.id;
          const completedInModule = module.lessons.filter(l => completedLessons.includes(l.id)).length;

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: moduleIndex * 0.1 }}
              style={{
                marginBottom: 16,
                borderRadius: 16,
                overflow: "hidden",
                border: `1px solid ${module.color}33`,
                background: "rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Module Header */}
              <motion.button
                onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${module.color}33, ${module.color}11)`,
                    border: `2px solid ${module.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 20px ${module.color}44`,
                  }}>
                    <ModuleIcon style={{ width: 24, height: 24, color: module.color }} />
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: 18, 
                      fontWeight: 700, 
                      color: "white", 
                      margin: 0,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      Module {module.id}: {module.name}
                    </h3>
                    <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>
                      {module.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    background: completedInModule > 0 ? "rgba(34, 197, 94, 0.2)" : "rgba(255, 255, 255, 0.1)",
                    color: completedInModule > 0 ? "#22c55e" : "#888",
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {completedInModule}/{module.lessons.length}
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown style={{ width: 24, height: 24, color: "#888" }} />
                  </motion.div>
                </div>
              </motion.button>

              {/* Lessons */}
              <motion.div
                initial={false}
                animate={{
                  height: isExpanded ? "auto" : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ padding: "0 24px 20px" }}>
                  {module.lessons.map((lesson, lessonIndex) => {
                    const isCompleted = completedLessons.includes(lesson.id);

                    return (
                      <Link 
                        key={lesson.id}
                        href={`/hardware/lesson/${lesson.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: lessonIndex * 0.05 }}
                          whileHover={{ 
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            x: 4,
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "16px 20px",
                            borderRadius: 12,
                            marginBottom: 8,
                            border: `1px solid ${lesson.is3D ? '#00FFFF22' : 'rgba(255, 255, 255, 0.1)'}`,
                            background: lesson.is3D 
                              ? "linear-gradient(135deg, rgba(0, 170, 255, 0.05), rgba(255, 0, 255, 0.05))"
                              : "transparent",
                            cursor: "pointer",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: isCompleted 
                                ? "linear-gradient(135deg, #22c55e, #16a34a)"
                                : lesson.is3D
                                  ? "linear-gradient(135deg, #00AAFF22, #FF00FF22)"
                                  : "rgba(255, 255, 255, 0.1)",
                              border: isCompleted 
                                ? "none"
                                : lesson.is3D
                                  ? "1px solid #00FFFF44"
                                  : "1px solid rgba(255, 255, 255, 0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: isCompleted ? "white" : lesson.is3D ? "#00FFFF" : "#888",
                              fontSize: 13,
                              fontWeight: 700,
                              fontFamily: "'JetBrains Mono', monospace",
                            }}>
                              {isCompleted ? <CheckCircle style={{ width: 18, height: 18 }} /> : lesson.id}
                            </div>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <h4 style={{ 
                                  fontSize: 15, 
                                  fontWeight: 600, 
                                  color: "white", 
                                  margin: 0,
                                  fontFamily: "'JetBrains Mono', monospace",
                                }}>
                                  {lesson.title}
                                </h4>
                                {lesson.is3D && (
                                  <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    padding: "2px 8px",
                                    borderRadius: 8,
                                    background: "linear-gradient(135deg, #00AAFF, #FF00FF)",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: "white",
                                  }}>
                                    <Sparkles style={{ width: 10, height: 10 }} />
                                    3D
                                  </div>
                                )}
                              </div>
                              <p style={{ fontSize: 12, color: "#666", margin: "4px 0 0" }}>
                                {lesson.description}
                              </p>
                            </div>
                          </div>

                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              background: lesson.is3D
                                ? "linear-gradient(135deg, #00AAFF, #FF00FF)"
                                : module.color,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: lesson.is3D
                                ? "0 0 20px rgba(0, 170, 255, 0.4)"
                                : `0 0 15px ${module.color}44`,
                            }}
                          >
                            <Play style={{ width: 16, height: 16, color: "white", marginLeft: 2 }} />
                          </motion.div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
