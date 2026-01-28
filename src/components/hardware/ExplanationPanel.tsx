"use client";

import { motion, AnimatePresence } from "framer-motion";

export interface ExecutionStep {
  phase: "fetch" | "decode" | "execute" | "memory" | "writeback";
  title: string;
  description: string;
  details?: string;
  codeHighlight?: string;
}

interface ExplanationPanelProps {
  step: ExecutionStep | null;
  currentLine?: number;
  currentCode?: string;
}

const phaseConfig = {
  fetch: { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", emoji: "📥", label: "FETCH" },
  decode: { color: "#d97706", bg: "#fffbeb", border: "#fde68a", emoji: "🔍", label: "DECODE" },
  execute: { color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", emoji: "⚡", label: "EXECUTE" },
  memory: { color: "#7c3aed", bg: "#faf5ff", border: "#ddd6fe", emoji: "💾", label: "MEMORY" },
  writeback: { color: "#db2777", bg: "#fdf2f8", border: "#fbcfe8", emoji: "✅", label: "WRITE BACK" },
};

const phaseOrder = ["fetch", "decode", "execute", "memory", "writeback"] as const;

export function ExplanationPanel({ step, currentLine, currentCode }: ExplanationPanelProps) {
  if (!step) {
    return (
      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        border: "2px solid #e2e8f0",
        padding: "24px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ fontSize: "48px", marginBottom: "16px" }}
        >
          💡
        </motion.div>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
          Ready to Learn!
        </h3>
        <p style={{ fontSize: "13px", color: "#64748b", maxWidth: "220px", lineHeight: "1.6" }}>
          Click <span style={{ color: "#2563eb", fontWeight: "700" }}>Step</span> to watch your code execute through the CPU, one phase at a time.
        </p>
      </div>
    );
  }

  const config = phaseConfig[step.phase];
  const currentIndex = phaseOrder.indexOf(step.phase);

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: "16px",
      border: "2px solid #e2e8f0",
      overflow: "hidden",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px",
        background: config.bg,
        borderBottom: `2px solid ${config.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              style={{ fontSize: "28px" }}
            >
              {config.emoji}
            </motion.span>
            <div>
              <div style={{ fontSize: "10px", color: config.color, letterSpacing: "1.5px", fontWeight: "700" }}>
                {config.label} PHASE
              </div>
              <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", marginTop: "2px" }}>
                {step.title}
              </div>
            </div>
          </div>
          {currentLine && (
            <div style={{
              background: "white",
              borderRadius: "10px",
              padding: "8px 14px",
              textAlign: "center",
              border: `1px solid ${config.border}`,
            }}>
              <div style={{ fontSize: "9px", color: "#64748b", fontWeight: "600", letterSpacing: "0.5px" }}>LINE</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: config.color, fontFamily: "monospace" }}>
                {currentLine}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "16px", overflow: "auto" }}>
        {/* Current Code */}
        {currentCode && (
          <div style={{
            background: "#0f172a",
            borderRadius: "10px",
            padding: "14px",
            marginBottom: "16px",
          }}>
            <div style={{ fontSize: "9px", color: "#64748b", letterSpacing: "1px", marginBottom: "8px", fontWeight: "600" }}>
              CURRENT INSTRUCTION
            </div>
            <code style={{ fontSize: "14px", fontFamily: "monospace", color: "#4ade80", fontWeight: "600" }}>
              {currentCode.trim()}
            </code>
          </div>
        )}

        {/* Description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={step.description}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: "14px",
              color: "#334155",
              lineHeight: "1.7",
              marginBottom: "16px",
            }}
          >
            {step.description}
          </motion.p>
        </AnimatePresence>

        {/* Details Tip */}
        {step.details && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: config.bg,
              borderRadius: "12px",
              padding: "14px",
              border: `1px solid ${config.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ fontSize: "18px" }}>💡</span>
              <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6" }}>
                {step.details}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Phase Progress */}
      <div style={{
        padding: "14px 16px",
        borderTop: "1px solid #e2e8f0",
        background: "#f8fafc",
      }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {phaseOrder.map((phase, index) => {
            const pConfig = phaseConfig[phase];
            const isActive = index === currentIndex;
            const isPast = index < currentIndex;

            return (
              <div key={phase} style={{ flex: 1, textAlign: "center" }}>
                <motion.div
                  animate={{
                    background: isActive ? pConfig.color : isPast ? "#94a3b8" : "#e2e8f0",
                    boxShadow: isActive ? `0 0 8px ${pConfig.color}50` : "none",
                  }}
                  style={{
                    height: "8px",
                    borderRadius: "4px",
                    marginBottom: "6px",
                  }}
                />
                <span style={{
                  fontSize: "9px",
                  color: isActive ? pConfig.color : isPast ? "#64748b" : "#cbd5e1",
                  fontWeight: isActive ? "700" : "600",
                  letterSpacing: "0.5px",
                }}>
                  {phase.slice(0, 3).toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ExplanationPanel;
