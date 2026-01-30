"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Zap, Info, Play, RotateCcw } from "lucide-react";

interface Register {
  name: string;
  value: number;
  description: string;
  color: string;
  purpose: string;
}

const INITIAL_REGISTERS: Register[] = [
  { name: "RAX", value: 0, description: "Accumulator", color: "#FF6B6B", purpose: "Math results, return values" },
  { name: "RBX", value: 0, description: "Base", color: "#4ECDC4", purpose: "General purpose, base pointer" },
  { name: "RCX", value: 0, description: "Counter", color: "#45B7D1", purpose: "Loop counters, shifts" },
  { name: "RDX", value: 0, description: "Data", color: "#96CEB4", purpose: "I/O operations, multiply/divide" },
  { name: "RSI", value: 0, description: "Source Index", color: "#FFEAA7", purpose: "Source for string ops" },
  { name: "RDI", value: 0, description: "Dest Index", color: "#DDA0DD", purpose: "Destination for string ops" },
  { name: "RSP", value: 0x7FFFFF00, description: "Stack Pointer", color: "#FF8C00", purpose: "Top of stack" },
  { name: "RBP", value: 0x7FFFFF00, description: "Base Pointer", color: "#00CED1", purpose: "Stack frame base" },
];

const MEMORY_SPEEDS = [
  { name: "Register", time: "<1 ns", color: "#00FF88", width: 100 },
  { name: "L1 Cache", time: "~1 ns", color: "#00DDFF", width: 85 },
  { name: "L2 Cache", time: "~4 ns", color: "#00AAFF", width: 70 },
  { name: "L3 Cache", time: "~12 ns", color: "#0088FF", width: 55 },
  { name: "RAM", time: "~100 ns", color: "#FF8800", width: 40 },
  { name: "SSD", time: "~100 us", color: "#FF4444", width: 25 },
];

export function RegisterFile3D() {
  const [registers, setRegisters] = useState<Register[]>(INITIAL_REGISTERS);
  const [selectedReg, setSelectedReg] = useState<string>("RAX");
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [showExplanation, setShowExplanation] = useState(true);
  const [inputValue, setInputValue] = useState("");

  const selectedRegister = registers.find(r => r.name === selectedReg);

  const runDemo = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationStep(0);
    
    const steps = [
      { reg: "RAX", value: 5 },
      { reg: "RBX", value: 3 },
      { reg: "RAX", value: 8 },
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setAnimationStep(i + 1);
        setSelectedReg(step.reg);
        setRegisters(prev => prev.map(r => 
          r.name === step.reg ? { ...r, value: step.value } : r
        ));
        if (i === steps.length - 1) {
          setTimeout(() => setIsAnimating(false), 1000);
        }
      }, (i + 1) * 1500);
    });
  };

  const resetRegisters = () => {
    setRegisters(INITIAL_REGISTERS);
    setAnimationStep(0);
    setIsAnimating(false);
  };

  const setRegisterValue = () => {
    if (!selectedReg || !inputValue) return;
    const val = inputValue.startsWith("0x") 
      ? parseInt(inputValue, 16) 
      : parseInt(inputValue);
    if (!isNaN(val)) {
      setRegisters(prev => prev.map(r => 
        r.name === selectedReg ? { ...r, value: val } : r
      ));
      setInputValue("");
    }
  };

  const toHex = (n: number) => "0x" + n.toString(16).toUpperCase().padStart(8, "0");
  const toBinary = (n: number) => {
    const bin = n.toString(2).padStart(32, "0");
    return bin.match(/.{8}/g)?.join(" ") || bin;
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
            background: "linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}
        >
          REGISTER FILE EXPLORER
        </motion.h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          CPU registers are the fastest storage in your computer - tiny memory cells inside the CPU itself
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showExplanation ? "1fr 1fr 320px" : "1fr 1fr", gap: 24 }}>
        <div style={{
          background: "rgba(0, 20, 40, 0.6)",
          borderRadius: 20,
          padding: 20,
          border: "1px solid #00FFFF22",
        }}>
          <h3 style={{ color: "#00FFFF", fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Cpu style={{ width: 18, height: 18 }} />
            x86-64 GENERAL PURPOSE REGISTERS
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {registers.map((reg, i) => (
              <motion.div
                key={reg.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedReg(reg.name)}
                style={{
                  background: selectedReg === reg.name 
                    ? `linear-gradient(135deg, ${reg.color}33, ${reg.color}11)`
                    : "rgba(0, 0, 0, 0.3)",
                  border: `2px solid ${selectedReg === reg.name ? reg.color : "#333"}`,
                  borderRadius: 12,
                  padding: 14,
                  cursor: "pointer",
                  boxShadow: selectedReg === reg.name ? `0 0 20px ${reg.color}44` : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ 
                    color: reg.color, 
                    fontWeight: 700, 
                    fontSize: 16,
                    textShadow: selectedReg === reg.name ? `0 0 10px ${reg.color}` : "none",
                  }}>
                    {reg.name}
                  </span>
                  <span style={{ color: "#666", fontSize: 10 }}>{reg.description}</span>
                </div>
                
                <motion.div
                  key={reg.value}
                  initial={{ scale: 1.2, color: "#00FF88" }}
                  animate={{ scale: 1, color: "#fff" }}
                  style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace" }}
                >
                  {toHex(reg.value)}
                </motion.div>
                
                <div style={{ color: "#555", fontSize: 9, marginTop: 4 }}>
                  {reg.purpose}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 20,
            padding: 20,
            border: `1px solid ${selectedRegister?.color || "#00FFFF"}44`,
            flex: 1,
          }}>
            <h3 style={{ color: selectedRegister?.color || "#00FFFF", fontSize: 14, marginBottom: 16 }}>
              {selectedRegister?.name || "SELECT A REGISTER"}
            </h3>
            
            {selectedRegister && (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: "#666", fontSize: 11, marginBottom: 4 }}>HEXADECIMAL</div>
                  <div style={{ color: "#00FFFF", fontSize: 20, fontWeight: 700 }}>
                    {toHex(selectedRegister.value)}
                  </div>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: "#666", fontSize: 11, marginBottom: 4 }}>DECIMAL</div>
                  <div style={{ color: "#00FF88", fontSize: 20, fontWeight: 700 }}>
                    {selectedRegister.value.toLocaleString()}
                  </div>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: "#666", fontSize: 11, marginBottom: 4 }}>BINARY (32-bit)</div>
                  <div style={{ color: "#FF00FF", fontSize: 10, fontFamily: "monospace", wordBreak: "break-all" }}>
                    {toBinary(selectedRegister.value)}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <input
                    type="text"
                    placeholder="0x or decimal"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "1px solid #333",
                      background: "#0a0a2e",
                      color: "#fff",
                      fontSize: 13,
                      fontFamily: "monospace",
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={setRegisterValue}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: selectedRegister.color,
                      color: "#000",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    SET
                  </motion.button>
                </div>
              </div>
            )}
          </div>

          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 20,
            padding: 20,
            border: "1px solid #FF880044",
          }}>
            <h3 style={{ color: "#FF8800", fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Zap style={{ width: 18, height: 18 }} />
              MEMORY SPEED COMPARISON
            </h3>
            
            {MEMORY_SPEEDS.map((mem, i) => (
              <div key={mem.name} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: mem.color, fontSize: 11, fontWeight: 600 }}>{mem.name}</span>
                  <span style={{ color: "#888", fontSize: 10 }}>{mem.time}</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mem.width}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  style={{
                    height: 6,
                    background: `linear-gradient(90deg, ${mem.color}, ${mem.color}88)`,
                    borderRadius: 3,
                    boxShadow: `0 0 8px ${mem.color}44`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

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
              WHAT ARE REGISTERS?
            </h3>
            
            <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
              Registers are <strong style={{ color: "#00FF88" }}>tiny, ultra-fast storage</strong> built into the CPU. 
              A modern CPU has only <strong style={{ color: "#FF00FF" }}>16 general-purpose registers</strong>, each holding 64 bits.
            </p>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: "#FF8800", fontSize: 13, marginBottom: 8 }}>Why So Few?</h4>
              <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6 }}>
                Speed costs space! Registers use expensive circuits. More registers = slower access + more heat.
              </p>
            </div>

            <div style={{
              background: "linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 170, 255, 0.1))",
              borderRadius: 12,
              padding: 12,
              borderLeft: "3px solid #00FF88",
              marginBottom: 16,
            }}>
              <h4 style={{ color: "#00FF88", fontSize: 12, marginBottom: 6 }}>Python Connection</h4>
              <p style={{ color: "#ccc", fontSize: 11, lineHeight: 1.5 }}>
                When you write <code style={{ background: "#1a1a3e", padding: "2px 6px", borderRadius: 4, color: "#00FFFF" }}>x = 5 + 3</code>, 
                the CPU loads values into registers, adds them in the ALU, and stores the result.
              </p>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={runDemo}
                disabled={isAnimating}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px",
                  borderRadius: 10,
                  border: "none",
                  background: isAnimating ? "#333" : "linear-gradient(135deg, #00FF88, #00AA66)",
                  color: isAnimating ? "#666" : "#000",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: isAnimating ? "not-allowed" : "pointer",
                }}
              >
                <Play style={{ width: 16, height: 16 }} />
                {isAnimating ? "RUNNING..." : "RUN DEMO"}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetRegisters}
                style={{
                  padding: "12px",
                  borderRadius: 10,
                  border: "2px solid #FF444444",
                  background: "transparent",
                  color: "#FF4444",
                  cursor: "pointer",
                }}
              >
                <RotateCcw style={{ width: 16, height: 16 }} />
              </motion.button>
            </div>

            {animationStep > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 16,
                  padding: 12,
                  background: "#0a0a2e",
                  borderRadius: 8,
                  border: "1px solid #00FFFF44",
                }}
              >
                <h4 style={{ color: "#00FFFF", fontSize: 11, marginBottom: 8 }}>EXECUTION TRACE</h4>
                <div style={{ fontSize: 11, fontFamily: "monospace" }}>
                  {animationStep >= 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#FF6B6B", marginBottom: 4 }}>
                      MOV RAX, 5  <span style={{ color: "#666 "}}># Load 5</span>
                    </motion.div>
                  )}
                  {animationStep >= 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#4ECDC4", marginBottom: 4 }}>
                      MOV RBX, 3  <span style={{ color: "#666" }}># Load 3</span>
                    </motion.div>
                  )}
                  {animationStep >= 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#00FF88" }}>
                      ADD RAX, RBX  <span style={{ color: "#666" }}># RAX = 8</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
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
            border: "2px solid #FF00FF44",
            background: showExplanation ? "rgba(255, 0, 255, 0.2)" : "transparent",
            color: "#FF00FF",
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

export default RegisterFile3D;
