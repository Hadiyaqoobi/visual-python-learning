"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Info, Zap, Radio } from "lucide-react";

interface ControlSignal {
  name: string;
  target: string;
  active: boolean;
  color: string;
  description: string;
}

const CONTROL_SIGNALS: ControlSignal[] = [
  { name: "RegWrite", target: "Registers", active: false, color: "#FF6B6B", description: "Enable writing to register file" },
  { name: "MemRead", target: "Memory", active: false, color: "#4ECDC4", description: "Read data from memory" },
  { name: "MemWrite", target: "Memory", active: false, color: "#45B7D1", description: "Write data to memory" },
  { name: "ALUOp", target: "ALU", active: false, color: "#96CEB4", description: "Select ALU operation" },
  { name: "ALUSrc", target: "ALU", active: false, color: "#FFEAA7", description: "Select ALU input source" },
  { name: "Branch", target: "PC", active: false, color: "#DDA0DD", description: "Enable branch instruction" },
  { name: "Jump", target: "PC", active: false, color: "#FF8C00", description: "Enable jump instruction" },
  { name: "PCWrite", target: "PC", active: false, color: "#00CED1", description: "Update program counter" },
];

const INSTRUCTIONS = [
  { name: "ADD R1, R2, R3", type: "R-type", signals: ["RegWrite", "ALUOp", "PCWrite"], description: "Add two registers" },
  { name: "LOAD R1, [R2]", type: "Load", signals: ["RegWrite", "MemRead", "ALUSrc", "PCWrite"], description: "Load from memory" },
  { name: "STORE R1, [R2]", type: "Store", signals: ["MemWrite", "ALUSrc", "PCWrite"], description: "Store to memory" },
  { name: "BEQ R1, R2, label", type: "Branch", signals: ["ALUOp", "Branch", "PCWrite"], description: "Branch if equal" },
  { name: "JMP label", type: "Jump", signals: ["Jump", "PCWrite"], description: "Unconditional jump" },
];

export function ControlUnit3D() {
  const [signals, setSignals] = useState<ControlSignal[]>(CONTROL_SIGNALS);
  const [selectedInstruction, setSelectedInstruction] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(true);

  const activateSignals = (signalNames: string[]) => {
    setSignals(prev => prev.map(s => ({
      ...s,
      active: signalNames.includes(s.name)
    })));
  };

  const runInstruction = (index: number) => {
    if (isAnimating) return;
    setSelectedInstruction(index);
    setIsAnimating(true);
    
    const instruction = INSTRUCTIONS[index];
    
    // Phase 1: Fetch
    setCurrentPhase("FETCH");
    activateSignals(["PCWrite"]);
    
    setTimeout(() => {
      // Phase 2: Decode
      setCurrentPhase("DECODE");
      activateSignals([]);
    }, 1000);
    
    setTimeout(() => {
      // Phase 3: Execute
      setCurrentPhase("EXECUTE");
      activateSignals(instruction.signals);
    }, 2000);
    
    setTimeout(() => {
      setCurrentPhase("COMPLETE");
      setIsAnimating(false);
    }, 3500);
  };

  const reset = () => {
    setSignals(CONTROL_SIGNALS);
    setSelectedInstruction(null);
    setCurrentPhase("");
    setIsAnimating(false);
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
            background: "linear-gradient(135deg, #FF8800 0%, #FF00FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}
        >
          CONTROL UNIT CONDUCTOR
        </motion.h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          The control unit orchestrates all CPU operations by sending control signals
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showExplanation ? "1fr 1fr 300px" : "1fr 1fr", gap: 24 }}>
        {/* Control Signals Panel */}
        <div style={{
          background: "rgba(0, 20, 40, 0.6)",
          borderRadius: 20,
          padding: 20,
          border: "1px solid #FF880044",
        }}>
          <h3 style={{ color: "#FF8800", fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Radio style={{ width: 18, height: 18 }} />
            CONTROL SIGNALS
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {signals.map((signal, i) => (
              <motion.div
                key={signal.name}
                animate={{
                  scale: signal.active ? 1.05 : 1,
                  boxShadow: signal.active ? `0 0 20px ${signal.color}66` : "none",
                }}
                style={{
                  background: signal.active 
                    ? `linear-gradient(135deg, ${signal.color}44, ${signal.color}22)`
                    : "rgba(0, 0, 0, 0.3)",
                  border: `2px solid ${signal.active ? signal.color : "#333"}`,
                  borderRadius: 10,
                  padding: 12,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {signal.active && (
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(90deg, transparent, ${signal.color}44, transparent)`,
                    }}
                  />
                )}
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ color: signal.active ? signal.color : "#888", fontWeight: 700, fontSize: 12 }}>
                    {signal.name}
                  </span>
                  <motion.div
                    animate={{ 
                      background: signal.active ? signal.color : "#333",
                      boxShadow: signal.active ? `0 0 10px ${signal.color}` : "none",
                    }}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div style={{ color: "#666", fontSize: 9 }}>→ {signal.target}</div>
              </motion.div>
            ))}
          </div>

          {/* Current Phase */}
          {currentPhase && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: 16,
                padding: 12,
                background: "linear-gradient(135deg, #00FFFF22, #FF00FF22)",
                borderRadius: 10,
                border: "1px solid #00FFFF44",
                textAlign: "center",
              }}
            >
              <div style={{ color: "#00FFFF", fontSize: 12, marginBottom: 4 }}>CURRENT PHASE</div>
              <div style={{ 
                color: "#fff", 
                fontSize: 20, 
                fontWeight: 700,
                textShadow: "0 0 10px #00FFFF",
              }}>
                {currentPhase}
              </div>
            </motion.div>
          )}
        </div>

        {/* Instructions Panel */}
        <div style={{
          background: "rgba(0, 20, 40, 0.6)",
          borderRadius: 20,
          padding: 20,
          border: "1px solid #00FFFF44",
        }}>
          <h3 style={{ color: "#00FFFF", fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Zap style={{ width: 18, height: 18 }} />
            SELECT INSTRUCTION TO EXECUTE
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {INSTRUCTIONS.map((inst, i) => (
              <motion.button
                key={inst.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => runInstruction(i)}
                disabled={isAnimating}
                style={{
                  background: selectedInstruction === i
                    ? "linear-gradient(135deg, #00FFFF33, #FF00FF33)"
                    : "rgba(0, 0, 0, 0.3)",
                  border: `2px solid ${selectedInstruction === i ? "#00FFFF" : "#333"}`,
                  borderRadius: 10,
                  padding: 14,
                  cursor: isAnimating ? "not-allowed" : "pointer",
                  textAlign: "left",
                  opacity: isAnimating && selectedInstruction !== i ? 0.5 : 1,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{inst.name}</span>
                  <span style={{ 
                    color: "#FF8800", 
                    fontSize: 10, 
                    padding: "2px 8px", 
                    background: "#FF880022", 
                    borderRadius: 4 
                  }}>
                    {inst.type}
                  </span>
                </div>
                <div style={{ color: "#666", fontSize: 11 }}>{inst.description}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {inst.signals.map(sig => (
                    <span key={sig} style={{
                      fontSize: 9,
                      padding: "2px 6px",
                      background: signals.find(s => s.name === sig)?.color + "33",
                      color: signals.find(s => s.name === sig)?.color,
                      borderRadius: 4,
                    }}>
                      {sig}
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "12px",
              borderRadius: 10,
              border: "2px solid #FF444444",
              background: "transparent",
              color: "#FF4444",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <RotateCcw style={{ width: 16, height: 16 }} />
            RESET
          </motion.button>
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
              border: "1px solid #FF880022",
              height: "fit-content",
            }}
          >
            <h3 style={{ color: "#FF8800", fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Info style={{ width: 20, height: 20 }} />
              THE CONTROL UNIT
            </h3>
            
            <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
              The Control Unit is the <strong style={{ color: "#FF8800" }}>brain's conductor</strong>. 
              It reads instructions and sends <strong style={{ color: "#00FFFF" }}>control signals</strong> to 
              coordinate all CPU components.
            </p>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: "#00FF88", fontSize: 13, marginBottom: 8 }}>How It Works</h4>
              <ol style={{ color: "#aaa", fontSize: 11, lineHeight: 1.8, paddingLeft: 16, margin: 0 }}>
                <li><strong style={{ color: "#45B7D1" }}>FETCH</strong> - Get instruction from memory</li>
                <li><strong style={{ color: "#FFEAA7" }}>DECODE</strong> - Understand what to do</li>
                <li><strong style={{ color: "#FF6B6B" }}>EXECUTE</strong> - Send control signals</li>
              </ol>
            </div>

            <div style={{
              background: "linear-gradient(135deg, rgba(255, 136, 0, 0.1), rgba(255, 0, 255, 0.1))",
              borderRadius: 12,
              padding: 12,
              borderLeft: "3px solid #FF8800",
            }}>
              <h4 style={{ color: "#FF8800", fontSize: 12, marginBottom: 6 }}>Python Connection</h4>
              <p style={{ color: "#ccc", fontSize: 11, lineHeight: 1.5 }}>
                Each Python operation becomes machine instructions. 
                <code style={{ background: "#1a1a3e", padding: "2px 6px", borderRadius: 4, color: "#00FFFF" }}>x = a + b</code> 
                triggers LOAD, ADD, and STORE instructions, each with its own control signals!
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
            border: "2px solid #FF880044",
            background: showExplanation ? "rgba(255, 136, 0, 0.2)" : "transparent",
            color: "#FF8800",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Info style={{ width: 16, height: 16 }} />
          {showExplanation ? "HIDE" : "SHOW"} EXPLANATION
        </motion.button>
      </div>
    </div>
  );
}

export default ControlUnit3D;
