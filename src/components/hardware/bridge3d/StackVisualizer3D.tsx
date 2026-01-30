"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Info, Layers, ArrowUp, ArrowDown } from "lucide-react";

interface StackFrame {
  id: number;
  name: string;
  variables: { name: string; value: string }[];
  color: string;
}

export function StackVisualizer3D() {
  const [stack, setStack] = useState<StackFrame[]>([
    { id: 0, name: "main()", variables: [{ name: "x", value: "5" }], color: "#00FFFF" }
  ]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const [frameCounter, setFrameCounter] = useState(1);

  const callFunction = () => {
    if (isAnimating || stack.length >= 6) return;
    setIsAnimating(true);
    
    const colors = ["#FF00FF", "#00FF88", "#FF8800", "#FF4444", "#FFEAA7"];
    setTimeout(() => {
      setStack(prev => [...prev, {
        id: frameCounter,
        name: `func_${frameCounter}()`,
        variables: [{ name: "temp", value: String(Math.floor(Math.random() * 100)) }],
        color: colors[stack.length % colors.length],
      }]);
      setFrameCounter(f => f + 1);
      setIsAnimating(false);
    }, 300);
  };

  const returnFromFunction = () => {
    if (isAnimating || stack.length <= 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setStack(prev => prev.slice(0, -1));
      setIsAnimating(false);
    }, 300);
  };

  const runRecursion = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStack([{ id: 0, name: "main()", variables: [{ name: "n", value: "5" }], color: "#00FFFF" }]);
    
    let depth = 0;
    const colors = ["#FF00FF", "#00FF88", "#FF8800", "#FF4444"];
    
    const buildUp = setInterval(() => {
      depth++;
      if (depth <= 4) {
        setStack(prev => [...prev, {
          id: depth,
          name: `factorial(${5 - depth})`,
          variables: [{ name: "n", value: String(5 - depth) }],
          color: colors[depth - 1],
        }]);
      } else {
        clearInterval(buildUp);
        let unwind = 4;
        const unwindInterval = setInterval(() => {
          setStack(prev => prev.slice(0, -1));
          unwind--;
          if (unwind <= 0) {
            clearInterval(unwindInterval);
            setIsAnimating(false);
          }
        }, 600);
      }
    }, 600);
  };

  const reset = () => {
    setStack([{ id: 0, name: "main()", variables: [{ name: "x", value: "5" }], color: "#00FFFF" }]);
    setFrameCounter(1);
    setIsAnimating(false);
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
            background: "linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}
        >
          CALL STACK VISUALIZER
        </motion.h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          Watch function calls push and pop on the stack
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
        <div style={{
          padding: "10px 20px",
          background: "rgba(255, 0, 255, 0.1)",
          border: "1px solid #FF00FF44",
          borderRadius: 12,
        }}>
          <span style={{ color: "#888", fontSize: 11 }}>DEPTH: </span>
          <span style={{ color: "#FF00FF", fontWeight: 700, fontSize: 16 }}>{stack.length}</span>
        </div>
        <div style={{
          padding: "10px 20px",
          background: stack.length >= 6 ? "rgba(255, 68, 68, 0.2)" : "rgba(0, 255, 136, 0.1)",
          border: `1px solid ${stack.length >= 6 ? "#FF4444" : "#00FF88"}44`,
          borderRadius: 12,
        }}>
          <span style={{ color: stack.length >= 6 ? "#FF4444" : "#00FF88", fontWeight: 700, fontSize: 12 }}>
            {stack.length >= 6 ? "⚠️ OVERFLOW RISK!" : "✓ Stack OK"}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showExplanation ? "1fr 280px" : "1fr", gap: 24 }}>
        <div>
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 20,
            padding: 20,
            border: "1px solid #FF00FF44",
            marginBottom: 20,
            minHeight: 350,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Layers style={{ width: 18, height: 18, color: "#FF00FF" }} />
              <h3 style={{ color: "#FF00FF", fontSize: 14, margin: 0 }}>CALL STACK</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column-reverse", gap: 8 }}>
              <AnimatePresence>
                {stack.map((frame, i) => (
                  <motion.div
                    key={frame.id}
                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.8 }}
                    style={{
                      background: `linear-gradient(135deg, ${frame.color}33, ${frame.color}11)`,
                      border: `2px solid ${frame.color}`,
                      borderRadius: 12,
                      padding: 16,
                      boxShadow: i === stack.length - 1 ? `0 0 20px ${frame.color}44` : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ color: frame.color, fontWeight: 700, fontSize: 14 }}>{frame.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      {frame.variables.map((v, vi) => (
                        <div key={vi} style={{
                          padding: "6px 12px",
                          background: "#0a0a2e",
                          borderRadius: 6,
                          fontSize: 11,
                        }}>
                          <span style={{ color: "#888" }}>{v.name} = </span>
                          <span style={{ color: "#00FF88", fontWeight: 600 }}>{v.value}</span>
                        </div>
                      ))}
                    </div>
                    {i === stack.length - 1 && (
                      <div style={{ marginTop: 8, color: "#FFEAA7", fontSize: 10 }}>
                        ← Currently executing
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={callFunction}
              disabled={isAnimating || stack.length >= 6}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "12px 20px",
                borderRadius: 10,
                border: "none",
                background: isAnimating || stack.length >= 6 ? "#333" : "linear-gradient(135deg, #FF00FF, #AA00AA)",
                color: isAnimating || stack.length >= 6 ? "#666" : "#fff",
                fontSize: 12,
                fontWeight: 700,
                cursor: isAnimating || stack.length >= 6 ? "not-allowed" : "pointer",
              }}
            >
              <ArrowUp style={{ width: 16, height: 16 }} />
              CALL
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={returnFromFunction}
              disabled={isAnimating || stack.length <= 1}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "12px 20px",
                borderRadius: 10,
                border: "none",
                background: isAnimating || stack.length <= 1 ? "#333" : "linear-gradient(135deg, #00FF88, #00AA66)",
                color: isAnimating || stack.length <= 1 ? "#666" : "#000",
                fontSize: 12,
                fontWeight: 700,
                cursor: isAnimating || stack.length <= 1 ? "not-allowed" : "pointer",
              }}
            >
              <ArrowDown style={{ width: 16, height: 16 }} />
              RETURN
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runRecursion}
              disabled={isAnimating}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "12px 20px",
                borderRadius: 10,
                border: "2px solid #FF880044",
                background: isAnimating ? "#333" : "transparent",
                color: isAnimating ? "#666" : "#FF8800",
                fontSize: 12,
                fontWeight: 700,
                cursor: isAnimating ? "not-allowed" : "pointer",
              }}
            >
              <Play style={{ width: 16, height: 16 }} />
              factorial(5)
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "12px 20px",
                borderRadius: 10,
                border: "2px solid #FF444444",
                background: "transparent",
                color: "#FF4444",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <RotateCcw style={{ width: 16, height: 16 }} />
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
              border: "1px solid #FF00FF22",
              height: "fit-content",
            }}
          >
            <h3 style={{ color: "#FF00FF", fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Info style={{ width: 20, height: 20 }} />
              THE CALL STACK
            </h3>

            <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
              The call stack tracks function calls. Each call creates a <strong style={{ color: "#FF00FF" }}>stack frame</strong>.
            </p>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: "#00FF88", fontSize: 13, marginBottom: 8 }}>Stack Frame Contains</h4>
              <ul style={{ color: "#aaa", fontSize: 11, lineHeight: 1.8, paddingLeft: 16, margin: 0 }}>
                <li><span style={{ color: "#00FFFF" }}>Local variables</span></li>
                <li><span style={{ color: "#FF8800" }}>Return address</span></li>
              </ul>
            </div>

            <div style={{
              padding: 12,
              background: "linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 170, 255, 0.1))",
              borderRadius: 12,
              borderLeft: "3px solid #00FF88",
            }}>
              <h4 style={{ color: "#00FF88", fontSize: 11, marginBottom: 6 }}>Python Connection</h4>
              <p style={{ color: "#ccc", fontSize: 10, lineHeight: 1.5 }}>
                Python limits recursion to ~1000 calls by default.
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
            border: "2px solid #FF00FF44",
            background: showExplanation ? "rgba(255, 0, 255, 0.2)" : "transparent",
            color: "#FF00FF",
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

export default StackVisualizer3D;
