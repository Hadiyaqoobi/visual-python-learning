"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Info, Cpu, Zap } from "lucide-react";

type Phase = "idle" | "fetch" | "decode" | "execute" | "complete";

const PHASES = [
  { id: "fetch", name: "FETCH", color: "#00FFFF", description: "Get instruction from memory" },
  { id: "decode", name: "DECODE", color: "#FF00FF", description: "Understand what to do" },
  { id: "execute", name: "EXECUTE", color: "#00FF88", description: "Perform the operation" },
];

export function FDECycle3D() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [speed, setSpeed] = useState(1500);
  const [showExplanation, setShowExplanation] = useState(true);
  const [pc, setPC] = useState(0);
  const [instruction, setInstruction] = useState("");
  const [result, setResult] = useState("");

  const PROGRAM = [
    { inst: "LOAD R1, #5", result: "R1 = 5" },
    { inst: "LOAD R2, #3", result: "R2 = 3" },
    { inst: "ADD R3, R1, R2", result: "R3 = 8" },
    { inst: "STORE R3, [100]", result: "Mem[100] = 8" },
  ];

  useEffect(() => {
    if (!isRunning) return;

    const runCycle = () => {
      // Fetch
      setPhase("fetch");
      setInstruction(PROGRAM[pc % PROGRAM.length].inst);
      
      setTimeout(() => {
        // Decode
        setPhase("decode");
      }, speed);

      setTimeout(() => {
        // Execute
        setPhase("execute");
        setResult(PROGRAM[pc % PROGRAM.length].result);
      }, speed * 2);

      setTimeout(() => {
        // Complete cycle
        setPhase("complete");
        setCycleCount(prev => prev + 1);
        setPC(prev => (prev + 1) % PROGRAM.length);
        
        setTimeout(() => {
          setPhase("idle");
        }, 300);
      }, speed * 3);
    };

    runCycle();
    const interval = setInterval(runCycle, speed * 3.5);
    return () => clearInterval(interval);
  }, [isRunning, speed, pc]);

  const reset = () => {
    setIsRunning(false);
    setPhase("idle");
    setCycleCount(0);
    setPC(0);
    setInstruction("");
    setResult("");
  };

  const getPhaseIndex = () => {
    switch (phase) {
      case "fetch": return 0;
      case "decode": return 1;
      case "execute": return 2;
      default: return -1;
    }
  };

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
          FETCH-DECODE-EXECUTE CYCLE
        </motion.h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          The heartbeat of every CPU - watch instructions flow through the pipeline
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 24 }}>
        <div style={{
          padding: "10px 20px",
          background: "rgba(0, 255, 255, 0.1)",
          border: "1px solid #00FFFF44",
          borderRadius: 12,
        }}>
          <span style={{ color: "#888", fontSize: 11 }}>CYCLES: </span>
          <span style={{ color: "#00FFFF", fontWeight: 700, fontSize: 16 }}>{cycleCount}</span>
        </div>
        <div style={{
          padding: "10px 20px",
          background: "rgba(255, 0, 255, 0.1)",
          border: "1px solid #FF00FF44",
          borderRadius: 12,
        }}>
          <span style={{ color: "#888", fontSize: 11 }}>PC: </span>
          <span style={{ color: "#FF00FF", fontWeight: 700, fontSize: 16 }}>0x{pc.toString(16).padStart(2, "0")}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showExplanation ? "1fr 280px" : "1fr", gap: 24 }}>
        <div>
          {/* FDE Visualization */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 20,
            padding: 24,
            border: "1px solid #00FFFF22",
            marginBottom: 20,
          }}>
            {/* Phase Cards */}
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
              {PHASES.map((p, i) => (
                <motion.div
                  key={p.id}
                  animate={{
                    scale: getPhaseIndex() === i ? 1.1 : 1,
                    boxShadow: getPhaseIndex() === i ? `0 0 30px ${p.color}66` : "none",
                  }}
                  style={{
                    width: 140,
                    padding: 20,
                    borderRadius: 16,
                    background: getPhaseIndex() === i 
                      ? `linear-gradient(135deg, ${p.color}44, ${p.color}22)`
                      : "rgba(0, 0, 0, 0.3)",
                    border: `2px solid ${getPhaseIndex() === i ? p.color : "#333"}`,
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {/* Active indicator */}
                  {getPhaseIndex() === i && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{
                        position: "absolute",
                        top: -8,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: p.color,
                        boxShadow: `0 0 20px ${p.color}`,
                      }}
                    />
                  )}
                  
                  <div style={{ 
                    color: getPhaseIndex() === i ? p.color : "#666", 
                    fontWeight: 700, 
                    fontSize: 14,
                    marginBottom: 8,
                  }}>
                    {p.name}
                  </div>
                  <div style={{ color: "#888", fontSize: 10 }}>{p.description}</div>
                </motion.div>
              ))}
            </div>

            {/* Arrows */}
            <div style={{ display: "flex", justifyContent: "center", gap: 80, marginBottom: 24 }}>
              {[0, 1].map(i => (
                <motion.div
                  key={i}
                  animate={{
                    color: getPhaseIndex() > i ? "#00FF88" : "#333",
                  }}
                  style={{ fontSize: 24 }}
                >
                  →
                </motion.div>
              ))}
            </div>

            {/* Current Instruction */}
            <div style={{
              background: "#0a0a2e",
              borderRadius: 12,
              padding: 16,
              border: "1px solid #333",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>INSTRUCTION</div>
                  <motion.div
                    key={instruction}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ color: "#00FFFF", fontSize: 16, fontWeight: 700 }}
                  >
                    {instruction || "---"}
                  </motion.div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>RESULT</div>
                  <motion.div
                    key={result}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ color: "#00FF88", fontSize: 16, fontWeight: 700 }}
                  >
                    {result || "---"}
                  </motion.div>
                </div>
              </div>

              {/* Program listing */}
              <div style={{ borderTop: "1px solid #333", paddingTop: 12, marginTop: 12 }}>
                <div style={{ color: "#666", fontSize: 10, marginBottom: 8 }}>PROGRAM</div>
                {PROGRAM.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      background: pc === i ? "#00FFFF22" : "transparent",
                      color: pc === i ? "#00FFFF" : "#666",
                      fontSize: 11,
                      marginBottom: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{pc === i ? "→ " : "  "}{line.inst}</span>
                    {pc === i && phase === "execute" && (
                      <span style={{ color: "#00FF88" }}>{line.result}</span>
                    )}
                  </div>
                ))}
              </div>
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
              {isRunning ? <Pause style={{ width: 18, height: 18 }} /> : <Play style={{ width: 18, height: 18 }} />}
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
              <RotateCcw style={{ width: 18, height: 18 }} />
              RESET
            </motion.button>

            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{
                padding: "14px 16px",
                borderRadius: 12,
                border: "2px solid #00FFFF44",
                background: "#0a0a2e",
                color: "#00FFFF",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <option value={2500}>Slow</option>
              <option value={1500}>Normal</option>
              <option value={800}>Fast</option>
            </select>
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
              <Info style={{ width: 20, height: 20 }} />
              THE FDE CYCLE
            </h3>

            <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
              Every CPU continuously repeats this 3-step cycle billions of times per second!
            </p>

            <div style={{ marginBottom: 12, padding: 12, background: "#00FFFF11", borderRadius: 8, borderLeft: "3px solid #00FFFF" }}>
              <div style={{ color: "#00FFFF", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>1. FETCH</div>
              <p style={{ color: "#888", fontSize: 11, margin: 0 }}>
                Read the next instruction from memory using the Program Counter (PC)
              </p>
            </div>

            <div style={{ marginBottom: 12, padding: 12, background: "#FF00FF11", borderRadius: 8, borderLeft: "3px solid #FF00FF" }}>
              <div style={{ color: "#FF00FF", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>2. DECODE</div>
              <p style={{ color: "#888", fontSize: 11, margin: 0 }}>
                Figure out what the instruction means and what signals to send
              </p>
            </div>

            <div style={{ marginBottom: 16, padding: 12, background: "#00FF8811", borderRadius: 8, borderLeft: "3px solid #00FF88" }}>
              <div style={{ color: "#00FF88", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>3. EXECUTE</div>
              <p style={{ color: "#888", fontSize: 11, margin: 0 }}>
                Perform the operation (math, load, store, etc.)
              </p>
            </div>

            <div style={{
              padding: 12,
              background: "linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 170, 255, 0.1))",
              borderRadius: 12,
              borderLeft: "3px solid #00FF88",
            }}>
              <h4 style={{ color: "#00FF88", fontSize: 12, marginBottom: 6 }}>Python Connection</h4>
              <p style={{ color: "#ccc", fontSize: 10, lineHeight: 1.5 }}>
                Your Python program compiles to thousands of instructions. Each one goes through this cycle. 
                A 3GHz CPU does this 3 billion times per second!
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

export default FDECycle3D;
