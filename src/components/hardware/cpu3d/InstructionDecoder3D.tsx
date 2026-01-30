"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Binary, Info, Play, RotateCcw, Zap } from "lucide-react";

interface Instruction {
  name: string;
  binary: string;
  opcode: string;
  operands: string;
  description: string;
  color: string;
}

const INSTRUCTIONS: Instruction[] = [
  { name: "ADD R1, R2, R3", binary: "0000 0001 0010 0011", opcode: "0000", operands: "R1, R2, R3", description: "Add R2 + R3, store in R1", color: "#00FF88" },
  { name: "SUB R1, R2, R3", binary: "0001 0001 0010 0011", opcode: "0001", operands: "R1, R2, R3", description: "Subtract R2 - R3, store in R1", color: "#FF6B6B" },
  { name: "LOAD R1, [R2]", binary: "0010 0001 0010 0000", opcode: "0010", operands: "R1, [R2]", description: "Load from memory address in R2", color: "#00FFFF" },
  { name: "STORE R1, [R2]", binary: "0011 0001 0010 0000", opcode: "0011", operands: "R1, [R2]", description: "Store R1 to memory address in R2", color: "#FF8800" },
  { name: "JMP label", binary: "0100 0000 1111 1111", opcode: "0100", operands: "address", description: "Jump to address", color: "#FF00FF" },
];

export function InstructionDecoder3D() {
  const [selectedInstruction, setSelectedInstruction] = useState<number>(0);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedParts, setDecodedParts] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(true);

  const decodeInstruction = () => {
    if (isDecoding) return;
    setIsDecoding(true);
    setDecodedParts([]);

    const inst = INSTRUCTIONS[selectedInstruction];
    const parts = ["opcode", "dest", "src1", "src2"];
    
    parts.forEach((part, i) => {
      setTimeout(() => {
        setDecodedParts(prev => [...prev, part]);
        if (i === parts.length - 1) {
          setTimeout(() => setIsDecoding(false), 500);
        }
      }, (i + 1) * 600);
    });
  };

  const reset = () => {
    setDecodedParts([]);
    setIsDecoding(false);
  };

  const inst = INSTRUCTIONS[selectedInstruction];

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
            background: "linear-gradient(135deg, #00FFFF 0%, #00FF88 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}
        >
          INSTRUCTION DECODER
        </motion.h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          See how the CPU breaks down binary instructions into meaningful operations
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showExplanation ? "1fr 300px" : "1fr", gap: 24 }}>
        <div>
          {/* Instruction Selector */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 16,
            padding: 20,
            border: "1px solid #00FFFF22",
            marginBottom: 20,
          }}>
            <h3 style={{ color: "#00FFFF", fontSize: 14, marginBottom: 12 }}>SELECT INSTRUCTION</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {INSTRUCTIONS.map((inst, i) => (
                <motion.button
                  key={inst.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedInstruction(i); reset(); }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: `2px solid ${selectedInstruction === i ? inst.color : "#333"}`,
                    background: selectedInstruction === i ? `${inst.color}22` : "transparent",
                    color: selectedInstruction === i ? inst.color : "#888",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {inst.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Binary Display */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 16,
            padding: 24,
            border: `1px solid ${inst.color}44`,
            marginBottom: 20,
          }}>
            <h3 style={{ color: inst.color, fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Binary style={{ width: 18, height: 18 }} />
              MACHINE CODE
            </h3>

            {/* Binary bits */}
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 20 }}>
              {inst.binary.split(" ").map((nibble, ni) => (
                <div key={ni} style={{ display: "flex", gap: 2 }}>
                  {nibble.split("").map((bit, bi) => (
                    <motion.div
                      key={bi}
                      animate={{
                        background: decodedParts.includes(["opcode", "dest", "src1", "src2"][ni])
                          ? ["#00FFFF", "#FF00FF", "#00FF88", "#FF8800"][ni]
                          : "#1a1a3e",
                        scale: decodedParts.includes(["opcode", "dest", "src1", "src2"][ni]) ? 1.1 : 1,
                      }}
                      style={{
                        width: 32,
                        height: 40,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        fontWeight: 700,
                        color: decodedParts.includes(["opcode", "dest", "src1", "src2"][ni]) ? "#000" : "#00FFFF",
                        border: "1px solid #333",
                      }}
                    >
                      {bit}
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>

            {/* Labels */}
            <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
              {["OPCODE", "DEST", "SRC1", "SRC2"].map((label, i) => (
                <motion.div
                  key={label}
                  animate={{
                    opacity: decodedParts.includes(["opcode", "dest", "src1", "src2"][i]) ? 1 : 0.3,
                  }}
                  style={{
                    width: 70,
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: 600,
                    color: ["#00FFFF", "#FF00FF", "#00FF88", "#FF8800"][i],
                    marginLeft: i > 0 ? 12 : 0,
                  }}
                >
                  {label}
                </motion.div>
              ))}
            </div>

            {/* Decoded Info */}
            {decodedParts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 24,
                  padding: 16,
                  background: "#0a0a2e",
                  borderRadius: 12,
                  border: `1px solid ${inst.color}44`,
                }}
              >
                <div style={{ color: "#888", fontSize: 11, marginBottom: 8 }}>DECODED INSTRUCTION</div>
                <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{inst.name}</div>
                <div style={{ color: inst.color, fontSize: 13 }}>{inst.description}</div>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={decodeInstruction}
              disabled={isDecoding}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 12,
                border: "none",
                background: isDecoding ? "#333" : `linear-gradient(135deg, ${inst.color}, ${inst.color}88)`,
                color: isDecoding ? "#666" : "#000",
                fontSize: 14,
                fontWeight: 700,
                cursor: isDecoding ? "not-allowed" : "pointer",
              }}
            >
              <Play style={{ width: 18, height: 18 }} />
              {isDecoding ? "DECODING..." : "DECODE"}
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
              INSTRUCTION FORMAT
            </h3>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "#00FFFF" }} />
                <span style={{ color: "#00FFFF", fontSize: 12, fontWeight: 600 }}>OPCODE (4 bits)</span>
              </div>
              <p style={{ color: "#aaa", fontSize: 11, lineHeight: 1.5 }}>
                Tells the CPU what operation to perform (ADD, SUB, LOAD, etc.)
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "#FF00FF" }} />
                <span style={{ color: "#FF00FF", fontSize: 12, fontWeight: 600 }}>DEST (4 bits)</span>
              </div>
              <p style={{ color: "#aaa", fontSize: 11, lineHeight: 1.5 }}>
                Destination register where result will be stored
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "#00FF88" }} />
                <span style={{ color: "#00FF88", fontSize: 12, fontWeight: 600 }}>SRC1 (4 bits)</span>
              </div>
              <p style={{ color: "#aaa", fontSize: 11, lineHeight: 1.5 }}>
                First source register or value
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "#FF8800" }} />
                <span style={{ color: "#FF8800", fontSize: 12, fontWeight: 600 }}>SRC2 (4 bits)</span>
              </div>
              <p style={{ color: "#aaa", fontSize: 11, lineHeight: 1.5 }}>
                Second source register or value
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
                <code style={{ background: "#1a1a3e", padding: "2px 4px", borderRadius: 3, color: "#00FFFF" }}>x = a + b</code> 
                becomes machine code like this that the CPU decodes and executes!
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

export default InstructionDecoder3D;
