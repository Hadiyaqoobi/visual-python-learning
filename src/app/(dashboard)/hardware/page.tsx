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
      { id: "H3", title: "Animated Adder", description: "Binary addition with carry propagation", is3D: false },
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
            background: "rgba(255, 0, 255, 0.1)",
            border: "1px solid rgba(255, 0, 255, 0.2)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <Sparkles style={{ width: 18, height: 18, color: "#FF00FF" }} />
            <span style={{ color: "white", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
              {total3DLessons} 3D Experiences
            </span>
          </div>
          <div style={{
            padding: "12px 20px",
            background: "rgba(0, 255, 136, 0.1)",
            border: "1px solid rgba(0, 255, 136, 0.2)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <Layers style={{ width: 18, height: 18, color: "#00FF88" }} />
            <span style={{ color: "white", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
              5 Modules
            </span>
          </div>
          <div style={{
            padding: "12px 20px",
            background: "linear-gradient(135deg, rgba(0, 170, 255, 0.2), rgba(255, 0, 255, 0.2))",
            border: "1px solid rgba(0, 255, 255, 0.3)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <Play style={{ width: 18, height: 18, color: "#00FFFF" }} />
            <span style={{ color: "white", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
              Interactive
            </span>
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
            const has3D = module.lessons.some(l => l.is3D);

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: module.id * 0.1 }}
                style={{
                  background: "rgba(20, 20, 40, 0.8)",
                  borderRadius: 16,
                  border: "1px solid rgba(0, 255, 255, 0.1)",
                  overflow: "hidden",
                  backdropFilter: "blur(10px)",
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
                    background: `linear-gradient(135deg, ${module.color}, ${module.color}88)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 20px ${module.color}44`,
                  }}>
                    <Icon style={{ width: 24, height: 24, color: "white" }} />
                  </div>
                  
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h3 style={{ 
                        fontSize: 18, 
                        fontWeight: 600, 
                        color: "white", 
                        margin: 0,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        Module {module.id}: {module.name}
                      </h3>
                      <span style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 6,
                        background: "rgba(0, 255, 255, 0.1)",
                        color: "#00FFFF",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {module.lessons.length} lessons
                      </span>
                      {has3D && (
                        <span style={{
                          fontSize: 10,
                          padding: "2px 8px",
                          borderRadius: 6,
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
                    <p style={{ fontSize: 13, color: "#666", margin: "4px 0 0" }}>
                      {module.description}
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 13, color: "#666", fontFamily: "'JetBrains Mono', monospace" }}>
                      {moduleCompleted}/{module.lessons.length}
                    </span>
                    {isExpanded ? (
                      <ChevronUp style={{ width: 20, height: 20, color: "#00FFFF" }} />
                    ) : (
                      <ChevronDown style={{ width: 20, height: 20, color: "#666" }} />
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
                      borderTop: "1px solid rgba(0, 255, 255, 0.1)",
                      padding: "16px 24px",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {module.lessons.map((lesson, idx) => {
                        const isCompleted = completedLessons.includes(lesson.id);
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
                              background: lesson.is3D 
                                ? "linear-gradient(135deg, rgba(0, 170, 255, 0.1), rgba(255, 0, 255, 0.1))"
                                : "rgba(30, 30, 50, 0.5)",
                              borderRadius: 10,
                              textDecoration: "none",
                              transition: "all 0.2s",
                              border: lesson.is3D 
                                ? "1px solid rgba(0, 255, 255, 0.2)" 
                                : "1px solid transparent",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = lesson.is3D
                                ? "linear-gradient(135deg, rgba(0, 170, 255, 0.2), rgba(255, 0, 255, 0.2))"
                                : "rgba(40, 40, 70, 0.8)";
                              e.currentTarget.style.borderColor = "rgba(0, 255, 255, 0.3)";
                              e.currentTarget.style.transform = "translateX(4px)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = lesson.is3D
                                ? "linear-gradient(135deg, rgba(0, 170, 255, 0.1), rgba(255, 0, 255, 0.1))"
                                : "rgba(30, 30, 50, 0.5)";
                              e.currentTarget.style.borderColor = lesson.is3D 
                                ? "rgba(0, 255, 255, 0.2)" 
                                : "transparent";
                              e.currentTarget.style.transform = "translateX(0)";
                            }}
                          >
                            <div style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              background: isCompleted 
                                ? "#22c55e" 
                                : lesson.is3D
                                  ? "linear-gradient(135deg, #00AAFF, #FF00FF)"
                                  : `${module.color}40`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: isCompleted || lesson.is3D ? "white" : module.color,
                              fontSize: 14,
                              fontWeight: 600,
                              fontFamily: "'JetBrains Mono', monospace",
                            }}>
                              {isCompleted ? (
                                <CheckCircle style={{ width: 18, height: 18 }} />
                              ) : lesson.is3D ? (
                                <Sparkles style={{ width: 16, height: 16 }} />
                              ) : (
                                idx + 1
                              )}
                            </div>
                            
                            <div style={{ flex: 1 }}>
                              <div style={{ 
                                fontSize: 14, 
                                fontWeight: 500, 
                                color: "white",
                                fontFamily: "'JetBrains Mono', monospace",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}>
                                {lesson.title}
                                {lesson.is3D && (
                                  <span style={{
                                    fontSize: 9,
                                    padding: "1px 6px",
                                    borderRadius: 4,
                                    background: "rgba(255, 0, 255, 0.3)",
                                    color: "#FF88FF",
                                  }}>
                                    3D
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: 12, color: "#666" }}>
                                {lesson.description}
                              </div>
                            </div>

                            <div style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              background: lesson.is3D 
                                ? "linear-gradient(135deg, #00AAFF, #FF00FF)"
                                : module.color,
                              color: "white",
                              fontSize: 11,
                              fontWeight: 600,
                              fontFamily: "'JetBrains Mono', monospace",
                              boxShadow: lesson.is3D ? "0 0 15px rgba(0, 170, 255, 0.4)" : "none",
                            }}>
                              {lesson.is3D ? "EXPLORE →" : "Start →"}
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
      
      {/* Footer info */}
      <div style={{ 
        padding: "30px 40px", 
        borderTop: "1px solid rgba(0, 255, 255, 0.1)",
        textAlign: "center",
      }}>
        <p style={{ 
          color: "#444", 
          fontSize: 12, 
          fontFamily: "'JetBrains Mono', monospace",
          margin: 0,
        }}>
          Built with Three.js • React Three Fiber • WebGL
        </p>
      </div>
    </div>
  );
}
