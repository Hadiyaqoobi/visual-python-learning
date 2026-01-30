"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Info, Code, Cpu, Database, HardDrive } from "lucide-react";

interface TraceStep {
  id: number;
  layer: "python" | "bytecode" | "cpu" | "memory" | "storage";
  action: string;
  detail: string;
  color: string;
}

const TRACE_STEPS: TraceStep[] = [
  { id: 1, layer: "python", action: "Execute: x = 5 + 3", detail: "Python interprets expression", color: "#00FFFF" },
  { id: 2, layer: "bytecode", action: "LOAD_CONST 5", detail: "Push 5 onto stack", color: "#FF00FF" },
  { id: 3, layer: "bytecode", action: "LOAD_CONST 3", detail: "Push 3 onto stack", color: "#FF00FF" },
  { id: 4, layer: "bytecode", action: "BINARY_ADD", detail: "Pop two values, add, push result", color: "#FF00FF" },
  { id: 5, layer: "cpu", action: "MOV RAX, 5", detail: "Load 5 into register", color: "#00FF88" },
  { id: 6, layer: "cpu", action: "MOV RBX, 3", detail: "Load 3 into register", color: "#00FF88" },
  { id: 7, layer: "cpu", action: "ADD RAX, RBX", detail: "ALU performs addition", color: "#00FF88" },
  { id: 8, layer: "memory", action: "Cache lookup", detail: "Check L1 cache for variable", color: "#FF8800" },
  { id: 9, layer: "memory", action: "Store result", detail: "Write 8 to memory location", color: "#FF8800" },
  { id: 10, layer: "python", action: "x = 8", detail: "Variable x now holds 8", color: "#00FFFF" },
];

const LAYERS = [
  { id: "python", name: "Python", icon: <Code size={18} />, color: "#00FFFF" },
  { id: "bytecode", name: "Bytecode", icon: <Code size={18} />, color: "#FF00FF" },
  { id: "cpu", name: "CPU", icon: <Cpu size={18} />, color: "#00FF88" },
  { id: "memory", name: "Memory", icon: <Database size={18} />, color: "#FF8800" },
];

export function SystemTrace3D() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    if (currentStep >= TRACE_STEPS.length) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep(s => s + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep]);

  const reset = () => {
    setIsRunning(false);
    setCurrentStep(0);
  };

  const currentTrace = currentStep > 0 ? TRACE_STEPS[currentStep - 1] : null;

  return (
    <div style={{
      minHeight: "100%",
      background: "linear-gradient(135deg, #0A0A1E 0%, #1A1A3E 50%, #0A0A1E 100%)",
      padding: 24,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 32,
            fontWeight: 700,
            background: "linear-gradient(135deg, #00FFFF 0%, #FF00FF 50%, #00FF88 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}
        >
          COMPLETE SYSTEM TRACE
        </motion.h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          Watch a single Python statement flow through every layer
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
        <div style={{
          padding: "12px 24px",
          background: "rgba(0, 255, 255, 0.1)",
          border: "1px solid #00FFFF44",
          borderRadius: 12,
        }}>
          <span style={{ color: "#888", fontSize: 11 }}>STEP: </span>
          <span style={{ color: "#00FFFF", fontWeight: 700, fontSize: 18 }}>{currentStep}/{TRACE_STEPS.length}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showExplanation ? "1fr 280px" : "1fr", gap: 24 }}>
        <div>
          {/* Code Display */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 16,
            padding: 16,
            border: "1px solid #00FFFF44",
            marginBottom: 20,
            textAlign: "center",
          }}>
            <div style={{ color: "#888", fontSize: 11, marginBottom: 8 }}>PYTHON CODE</div>
            <div style={{ 
              color: "#00FFFF", 
              fontSize: 24, 
              fontWeight: 700,
              fontFamily: "monospace",
            }}>
              x = 5 + 3
            </div>
          </div>

          {/* Layer Visualization */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 20,
            padding: 20,
            border: "1px solid #FF00FF44",
            marginBottom: 20,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {LAYERS.map((layer) => {
                const isActive = currentTrace?.layer === layer.id;
                const stepsInLayer = TRACE_STEPS.filter(s => s.layer === layer.id && TRACE_STEPS.indexOf(s) < currentStep);
                
                return (
                  <motion.div
                    key={layer.id}
                    animate={{
                      scale: isActive ? 1.02 : 1,
                      boxShadow: isActive ? `0 0 20px ${layer.color}44` : "none",
                    }}
                    style={{
                      background: isActive 
                        ? `linear-gradient(135deg, ${layer.color}33, ${layer.color}11)`
                        : stepsInLayer.length > 0 ? `${layer.color}11` : "#1a1a3e",
                      border: `2px solid ${isActive ? layer.color : stepsInLayer.length > 0 ? layer.color + "44" : "#333"}`,
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ color: layer.color }}>{layer.icon}</div>
                      <span style={{ color: layer.color, fontWeight: 700, fontSize: 14 }}>{layer.name}</span>
                      {isActive && (
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          style={{ color: "#00FF88", fontSize: 10, marginLeft: "auto" }}
                        >
                          ● ACTIVE
                        </motion.span>
                      )}
                    </div>
                    
                    {isActive && currentTrace && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                          padding: 10,
                          background: "#0a0a2e",
                          borderRadius: 8,
                          marginTop: 8,
                        }}
                      >
                        <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{currentTrace.action}</div>
                        <div style={{ color: "#888", fontSize: 11, marginTop: 4 }}>{currentTrace.detail}</div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {TRACE_STEPS.map((step, i) => (
                <motion.div
                  key={step.id}
                  animate={{
                    background: i < currentStep ? step.color : "#333",
                  }}
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRunning(!isRunning)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 12,
                border: "none",
                background: isRunning 
                  ? "linear-gradient(135deg, #FF8800, #FF4400)"
                  : "linear-gradient(135deg, #00FF88, #00AA66)",
                color: "#000",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              {isRunning ? "PAUSE" : "START"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 12,
                border: "2px solid #FF444444",
                background: "transparent",
                color: "#FF4444",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={18} />
              RESET
            </motion.button>
          </div>
        </div>

        {/* Explanation */}
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
              <Info size={20} />
              THE FULL STACK
            </h3>

            <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
              A simple Python statement touches <strong style={{ color: "#FF00FF" }}>every layer</strong> of your computer!
            </p>

            {LAYERS.map(layer => (
              <div key={layer.id} style={{ 
                marginBottom: 10, 
                padding: 8, 
                background: `${layer.color}11`, 
                borderRadius: 6, 
                borderLeft: `3px solid ${layer.color}` 
              }}>
                <div style={{ color: layer.color, fontWeight: 700, fontSize: 11 }}>{layer.name.toUpperCase()}</div>
              </div>
            ))}

            <div style={{
              marginTop: 16,
              padding: 12,
              background: "linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 170, 255, 0.1))",
              borderRadius: 12,
              borderLeft: "3px solid #00FF88",
            }}>
              <h4 style={{ color: "#00FF88", fontSize: 11, marginBottom: 6 }}>Key Insight</h4>
              <p style={{ color: "#ccc", fontSize: 10, lineHeight: 1.5 }}>
                Understanding all layers helps you write faster Python code and debug complex issues!
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
          <Info size={16} />
          {showExplanation ? "HIDE" : "SHOW"} GUIDE
        </motion.button>
      </div>
    </div>
  );
}

export default SystemTrace3D;
