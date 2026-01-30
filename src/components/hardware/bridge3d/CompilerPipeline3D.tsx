"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Info, Code, Cpu, Binary, FileCode } from "lucide-react";

type Stage = "source" | "tokens" | "ast" | "bytecode" | "machine";

const STAGES = [
  { id: "source", name: "Source", icon: <Code size={18} />, color: "#00FFFF" },
  { id: "tokens", name: "Tokens", icon: <FileCode size={18} />, color: "#FF00FF" },
  { id: "ast", name: "AST", icon: <FileCode size={18} />, color: "#FF8800" },
  { id: "bytecode", name: "Bytecode", icon: <Binary size={18} />, color: "#00FF88" },
  { id: "machine", name: "Machine", icon: <Cpu size={18} />, color: "#FF4444" },
];

const CODE_TRANSFORMATIONS: Record<Stage, string> = {
  source: `x = 5 + 3
print(x)`,
  tokens: `NAME 'x'
EQUAL '='
NUMBER '5'
PLUS '+'
NUMBER '3'
NEWLINE
NAME 'print'
LPAREN '('
NAME 'x'
RPAREN ')'`,
  ast: `Module
└── Assign
│   ├── target: Name('x')
│   └── value: BinOp
│       ├── left: Num(5)
│       ├── op: Add
│       └── right: Num(3)
└── Call(print, [x])`,
  bytecode: `LOAD_CONST    5
LOAD_CONST    3
BINARY_ADD
STORE_NAME    x
LOAD_NAME     print
LOAD_NAME     x
CALL_FUNCTION 1`,
  machine: `MOV RAX, 5
MOV RBX, 3
ADD RAX, RBX
MOV [x], RAX
CALL _print`,
};

export function CompilerPipeline3D() {
  const [currentStage, setCurrentStage] = useState<Stage>("source");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  const runPipeline = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentStage("source");

    const stages: Stage[] = ["source", "tokens", "ast", "bytecode", "machine"];
    let i = 0;

    const interval = setInterval(() => {
      i++;
      if (i < stages.length) {
        setCurrentStage(stages[i]);
      } else {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 1200);
  };

  const reset = () => {
    setCurrentStage("source");
    setIsAnimating(false);
  };

  const getStageIndex = () => STAGES.findIndex(s => s.id === currentStage);

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
          COMPILER PIPELINE
        </motion.h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          Watch Python code transform into machine instructions
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showExplanation ? "1fr 280px" : "1fr", gap: 24 }}>
        <div>
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 20,
            padding: 20,
            border: "1px solid #00FFFF22",
            marginBottom: 20,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              {STAGES.map((stage, i) => (
                <div key={stage.id} style={{ display: "flex", alignItems: "center" }}>
                  <motion.div
                    animate={{
                      scale: currentStage === stage.id ? 1.15 : 1,
                      boxShadow: currentStage === stage.id ? `0 0 20px ${stage.color}66` : "none",
                    }}
                    onClick={() => !isAnimating && setCurrentStage(stage.id as Stage)}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 12,
                      background: getStageIndex() >= i
                        ? `linear-gradient(135deg, ${stage.color}44, ${stage.color}22)`
                        : "#1a1a3e",
                      border: `2px solid ${getStageIndex() >= i ? stage.color : "#333"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: getStageIndex() >= i ? stage.color : "#666",
                      cursor: isAnimating ? "default" : "pointer",
                    }}
                  >
                    {stage.icon}
                  </motion.div>
                  {i < STAGES.length - 1 && (
                    <motion.div
                      animate={{ color: getStageIndex() > i ? "#00FF88" : "#333" }}
                      style={{ margin: "0 6px", fontSize: 18 }}
                    >
                      →
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {STAGES.map((stage, i) => (
                <div key={stage.id} style={{ textAlign: "center", width: 60 }}>
                  <div style={{ 
                    color: getStageIndex() >= i ? stage.color : "#666", 
                    fontSize: 10, 
                    fontWeight: 600 
                  }}>
                    {stage.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 20,
            padding: 20,
            border: `2px solid ${STAGES[getStageIndex()].color}44`,
            marginBottom: 20,
          }}>
            <h3 style={{ color: STAGES[getStageIndex()].color, fontSize: 14, marginBottom: 12 }}>
              {STAGES[getStageIndex()].name.toUpperCase()}
            </h3>

            <motion.pre
              key={currentStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: "#0a0a2e",
                borderRadius: 12,
                padding: 16,
                margin: 0,
                color: "#fff",
                fontSize: 12,
                lineHeight: 1.6,
                overflow: "auto",
                maxHeight: 250,
                border: `1px solid ${STAGES[getStageIndex()].color}33`,
              }}
            >
              {CODE_TRANSFORMATIONS[currentStage]}
            </motion.pre>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runPipeline}
              disabled={isAnimating}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 12,
                border: "none",
                background: isAnimating ? "#333" : "linear-gradient(135deg, #00FF88, #00AA66)",
                color: isAnimating ? "#666" : "#000",
                fontSize: 14,
                fontWeight: 700,
                cursor: isAnimating ? "not-allowed" : "pointer",
              }}
            >
              <Play style={{ width: 18, height: 18 }} />
              {isAnimating ? "COMPILING..." : "RUN"}
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
              COMPILATION STEPS
            </h3>

            <div style={{ marginBottom: 10, padding: 8, background: "#00FFFF11", borderRadius: 6, borderLeft: "3px solid #00FFFF" }}>
              <div style={{ color: "#00FFFF", fontWeight: 700, fontSize: 11 }}>1. TOKENIZE</div>
              <p style={{ color: "#888", fontSize: 10, margin: "2px 0 0" }}>Break into tokens</p>
            </div>

            <div style={{ marginBottom: 10, padding: 8, background: "#FF00FF11", borderRadius: 6, borderLeft: "3px solid #FF00FF" }}>
              <div style={{ color: "#FF00FF", fontWeight: 700, fontSize: 11 }}>2. PARSE</div>
              <p style={{ color: "#888", fontSize: 10, margin: "2px 0 0" }}>Build syntax tree</p>
            </div>

            <div style={{ marginBottom: 10, padding: 8, background: "#00FF8811", borderRadius: 6, borderLeft: "3px solid #00FF88" }}>
              <div style={{ color: "#00FF88", fontWeight: 700, fontSize: 11 }}>3. BYTECODE</div>
              <p style={{ color: "#888", fontSize: 10, margin: "2px 0 0" }}>Generate .pyc</p>
            </div>

            <div style={{ marginBottom: 16, padding: 8, background: "#FF444411", borderRadius: 6, borderLeft: "3px solid #FF4444" }}>
              <div style={{ color: "#FF4444", fontWeight: 700, fontSize: 11 }}>4. EXECUTE</div>
              <p style={{ color: "#888", fontSize: 10, margin: "2px 0 0" }}>Run on CPU</p>
            </div>

            <div style={{
              padding: 12,
              background: "linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 170, 255, 0.1))",
              borderRadius: 12,
              borderLeft: "3px solid #00FF88",
            }}>
              <h4 style={{ color: "#00FF88", fontSize: 11, marginBottom: 6 }}>Python Connection</h4>
              <p style={{ color: "#ccc", fontSize: 10, lineHeight: 1.5 }}>
                Check <code style={{ color: "#00FFFF" }}>__pycache__</code> for compiled .pyc files!
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

export default CompilerPipeline3D;
