"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Check, X, Info, RotateCcw, Zap } from "lucide-react";

interface CPUComponent {
  id: string;
  name: string;
  description: string;
  color: string;
  placed: boolean;
  correctSlot: string;
}

interface Slot {
  id: string;
  name: string;
  component: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
}

const COMPONENTS: CPUComponent[] = [
  { id: "alu", name: "ALU", description: "Arithmetic Logic Unit - does math", color: "#00FF88", placed: false, correctSlot: "slot-alu" },
  { id: "cu", name: "Control Unit", description: "Sends control signals", color: "#FF8800", placed: false, correctSlot: "slot-cu" },
  { id: "regs", name: "Registers", description: "Fast temporary storage", color: "#00FFFF", placed: false, correctSlot: "slot-regs" },
  { id: "cache", name: "L1 Cache", description: "Small, fast memory", color: "#FF00FF", placed: false, correctSlot: "slot-cache" },
  { id: "pc", name: "Program Counter", description: "Tracks current instruction", color: "#FFEAA7", placed: false, correctSlot: "slot-pc" },
];

const SLOTS: Slot[] = [
  { id: "slot-cu", name: "Control Unit", component: null, x: 50, y: 20, width: 200, height: 80 },
  { id: "slot-alu", name: "ALU", component: null, x: 50, y: 120, width: 120, height: 100 },
  { id: "slot-regs", name: "Registers", component: null, x: 190, y: 120, width: 120, height: 100 },
  { id: "slot-pc", name: "Program Counter", component: null, x: 50, y: 240, width: 100, height: 60 },
  { id: "slot-cache", name: "Cache", component: null, x: 170, y: 240, width: 140, height: 60 },
];

export function CPUBuilder3D() {
  const [components, setComponents] = useState<CPUComponent[]>(COMPONENTS);
  const [slots, setSlots] = useState<Slot[]>(SLOTS);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const [score, setScore] = useState(0);

  const handleDragStart = (componentId: string) => {
    setDraggedComponent(componentId);
  };

  const handleDrop = (slotId: string) => {
    if (!draggedComponent) return;
    
    const component = components.find(c => c.id === draggedComponent);
    if (!component || component.placed) return;

    const isCorrect = component.correctSlot === slotId;
    
    setComponents(prev => prev.map(c => 
      c.id === draggedComponent ? { ...c, placed: true } : c
    ));
    
    setSlots(prev => prev.map(s => 
      s.id === slotId ? { ...s, component: draggedComponent } : s
    ));

    if (isCorrect) {
      setScore(prev => prev + 20);
    }

    // Check if all placed
    const allPlaced = components.filter(c => c.id !== draggedComponent).every(c => c.placed);
    if (allPlaced) {
      setTimeout(() => setIsComplete(true), 500);
    }

    setDraggedComponent(null);
  };

  const reset = () => {
    setComponents(COMPONENTS);
    setSlots(SLOTS);
    setIsComplete(false);
    setScore(0);
    setDraggedComponent(null);
  };

  const getSlotColor = (slot: Slot) => {
    if (!slot.component) return "#333";
    const comp = components.find(c => c.id === slot.component);
    return comp?.color || "#333";
  };

  return (
    <div style={{
      minHeight: "100%",
      background: "linear-gradient(135deg, #0A0A1E 0%, #1A1A3E 50%, #0A0A1E 100%)",
      padding: 24,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 32,
            fontWeight: 700,
            background: "linear-gradient(135deg, #00FFFF 0%, #FF8800 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}
        >
          CPU BUILDER LAB
        </motion.h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          Drag and drop components to build a CPU! Learn what each part does.
        </p>
      </div>

      {/* Score */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div style={{
          padding: "10px 24px",
          background: "linear-gradient(135deg, #00FF8833, #00FFFF33)",
          border: "1px solid #00FF8844",
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <Zap style={{ width: 18, height: 18, color: "#00FF88" }} />
          <span style={{ color: "#00FF88", fontWeight: 700, fontSize: 16 }}>Score: {score}/100</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showExplanation ? "200px 1fr 280px" : "200px 1fr", gap: 24 }}>
        {/* Components Tray */}
        <div style={{
          background: "rgba(0, 20, 40, 0.6)",
          borderRadius: 16,
          padding: 16,
          border: "1px solid #00FFFF22",
        }}>
          <h3 style={{ color: "#00FFFF", fontSize: 13, marginBottom: 12, textAlign: "center" }}>
            COMPONENTS
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {components.map((comp) => (
              <motion.div
                key={comp.id}
                draggable={!comp.placed}
                onDragStart={() => handleDragStart(comp.id)}
                whileHover={!comp.placed ? { scale: 1.05 } : {}}
                whileTap={!comp.placed ? { scale: 0.95 } : {}}
                style={{
                  background: comp.placed 
                    ? "rgba(0, 0, 0, 0.2)" 
                    : `linear-gradient(135deg, ${comp.color}33, ${comp.color}11)`,
                  border: `2px solid ${comp.placed ? "#333" : comp.color}`,
                  borderRadius: 10,
                  padding: 12,
                  cursor: comp.placed ? "default" : "grab",
                  opacity: comp.placed ? 0.4 : 1,
                }}
              >
                <div style={{ 
                  color: comp.placed ? "#666" : comp.color, 
                  fontWeight: 700, 
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}>
                  {comp.placed && <Check style={{ width: 14, height: 14 }} />}
                  {comp.name}
                </div>
                <div style={{ color: "#666", fontSize: 9, marginTop: 4 }}>
                  {comp.description}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "10px",
              borderRadius: 8,
              border: "2px solid #FF444444",
              background: "transparent",
              color: "#FF4444",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <RotateCcw style={{ width: 14, height: 14 }} />
            RESET
          </motion.button>
        </div>

        {/* CPU Board */}
        <div style={{
          background: "rgba(0, 20, 40, 0.6)",
          borderRadius: 20,
          padding: 20,
          border: "2px solid #FF880044",
          position: "relative",
          minHeight: 350,
        }}>
          <div style={{ 
            position: "absolute", 
            top: 10, 
            left: 10, 
            color: "#FF8800", 
            fontSize: 12, 
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <Cpu style={{ width: 16, height: 16 }} />
            CPU CHIP
          </div>

          {/* Slots */}
          <svg width="100%" height="320" style={{ marginTop: 20 }}>
            {/* Connection lines */}
            <line x1="150" y1="100" x2="110" y2="170" stroke="#333" strokeWidth="2" strokeDasharray="4" />
            <line x1="150" y1="100" x2="250" y2="170" stroke="#333" strokeWidth="2" strokeDasharray="4" />
            <line x1="110" y1="220" x2="100" y2="260" stroke="#333" strokeWidth="2" strokeDasharray="4" />
            <line x1="250" y1="220" x2="240" y2="260" stroke="#333" strokeWidth="2" strokeDasharray="4" />

            {slots.map((slot) => (
              <g key={slot.id}>
                <motion.rect
                  x={slot.x}
                  y={slot.y}
                  width={slot.width}
                  height={slot.height}
                  rx="8"
                  fill={slot.component ? getSlotColor(slot) + "33" : "#1a1a3e"}
                  stroke={slot.component ? getSlotColor(slot) : "#444"}
                  strokeWidth="2"
                  strokeDasharray={slot.component ? "0" : "4"}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(slot.id)}
                  style={{ cursor: "pointer" }}
                  whileHover={{ stroke: "#00FFFF" }}
                />
                <text
                  x={slot.x + slot.width / 2}
                  y={slot.y + slot.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={slot.component ? getSlotColor(slot) : "#666"}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {slot.component 
                    ? components.find(c => c.id === slot.component)?.name 
                    : slot.name}
                </text>
              </g>
            ))}
          </svg>

          {/* Completion message */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(0, 255, 136, 0.95)",
                padding: "20px 40px",
                borderRadius: 16,
                textAlign: "center",
                boxShadow: "0 0 40px rgba(0, 255, 136, 0.5)",
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 700, color: "#000", marginBottom: 8 }}>
                CPU COMPLETE!
              </div>
              <div style={{ fontSize: 14, color: "#333" }}>
                Score: {score}/100
              </div>
            </motion.div>
          )}
        </div>

        {/* Explanation Panel */}
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: "rgba(0, 30, 50, 0.8)",
              borderRadius: 16,
              padding: 20,
              border: "1px solid #00FFFF22",
              height: "fit-content",
            }}
          >
            <h3 style={{ color: "#00FFFF", fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Info style={{ width: 20, height: 20 }} />
              CPU COMPONENTS
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {COMPONENTS.map(comp => (
                <div key={comp.id} style={{
                  padding: 10,
                  background: `${comp.color}11`,
                  borderRadius: 8,
                  borderLeft: `3px solid ${comp.color}`,
                }}>
                  <div style={{ color: comp.color, fontWeight: 700, fontSize: 12 }}>{comp.name}</div>
                  <div style={{ color: "#aaa", fontSize: 10, marginTop: 2 }}>{comp.description}</div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 16,
              padding: 12,
              background: "linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 170, 255, 0.1))",
              borderRadius: 12,
              borderLeft: "3px solid #00FF88",
            }}>
              <h4 style={{ color: "#00FF88", fontSize: 12, marginBottom: 6 }}>Python Connection</h4>
              <p style={{ color: "#ccc", fontSize: 10, lineHeight: 1.5 }}>
                When Python runs your code, all these components work together! 
                The Control Unit fetches instructions, ALU does math, and Registers hold your variables.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowExplanation(!showExplanation)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 10,
            border: "2px solid #00FFFF44",
            background: showExplanation ? "rgba(0, 255, 255, 0.2)" : "transparent",
            color: "#00FFFF",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Info style={{ width: 16, height: 16 }} />
          {showExplanation ? "HIDE" : "SHOW"} GUIDE
        </motion.button>
      </div>
    </div>
  );
}

export default CPUBuilder3D;
