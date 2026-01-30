"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Sparkles, Zap, Box, ArrowRight, CheckCircle2, Clock, Code2, AlertCircle } from "lucide-react";

interface Variable {
  name: string;
  value: string;
  type: string;
  isNew?: boolean;
  isUpdated?: boolean;
  previousValue?: string;
}

interface SimpleOutputProps {
  output: string[];
  isRunning: boolean;
  variables: Variable[];
  executionTime?: number | null;
  error?: string | null;
}

const typeColors: Record<string, { bg: string; border: string; text: string; icon: string; glow: string }> = {
  int: { bg: "rgba(59, 130, 246, 0.15)", border: "#3B82F6", text: "#60A5FA", icon: "🔢", glow: "0 0 20px rgba(59, 130, 246, 0.4)" },
  float: { bg: "rgba(139, 92, 246, 0.15)", border: "#8B5CF6", text: "#A78BFA", icon: "🎯", glow: "0 0 20px rgba(139, 92, 246, 0.4)" },
  str: { bg: "rgba(16, 185, 129, 0.15)", border: "#10B981", text: "#34D399", icon: "📝", glow: "0 0 20px rgba(16, 185, 129, 0.4)" },
  bool: { bg: "rgba(249, 115, 22, 0.15)", border: "#F97316", text: "#FB923C", icon: "⚡", glow: "0 0 20px rgba(249, 115, 22, 0.4)" },
  list: { bg: "rgba(236, 72, 153, 0.15)", border: "#EC4899", text: "#F472B6", icon: "📋", glow: "0 0 20px rgba(236, 72, 153, 0.4)" },
  dict: { bg: "rgba(14, 165, 233, 0.15)", border: "#0EA5E9", text: "#38BDF8", icon: "🗂️", glow: "0 0 20px rgba(14, 165, 233, 0.4)" },
  tuple: { bg: "rgba(245, 158, 11, 0.15)", border: "#F59E0B", text: "#FBBF24", icon: "📦", glow: "0 0 20px rgba(245, 158, 11, 0.4)" },
  NoneType: { bg: "rgba(100, 116, 139, 0.15)", border: "#64748B", text: "#94A3B8", icon: "∅", glow: "0 0 20px rgba(100, 116, 139, 0.4)" },
};

const defaultTypeColor = { bg: "rgba(100, 116, 139, 0.15)", border: "#64748B", text: "#94A3B8", icon: "📌", glow: "0 0 20px rgba(100, 116, 139, 0.4)" };

export function SimpleOutput({ 
  output, 
  isRunning, 
  variables,
  executionTime,
  error,
}: SimpleOutputProps) {
  const outputRef = useRef<HTMLDivElement>(null);
  const [showVariables, setShowVariables] = useState(true);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const getTypeColor = (type: string) => typeColors[type] || defaultTypeColor;

  const displayVariables = variables.filter(v => 
    !v.name.startsWith('_') && 
    !['json', 'sys', 'builtins'].includes(v.name) &&
    v.type !== 'module' &&
    v.type !== 'function' &&
    v.type !== 'type'
  );

  const hasCompleted = !isRunning && output.length > 0 && !output.some(l => l.includes("Running"));
  const hasError = error || output.some(l => l.toLowerCase().includes("error"));

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
      overflow: "hidden",
    }}>
      <div style={{
        borderBottom: "1px solid #334155",
        background: "rgba(15, 23, 42, 0.9)",
      }}>
        <button
          onClick={() => setShowVariables(!showVariables)}
          style={{
            width: "100%",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: showVariables ? "1px solid #334155" : "none",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <motion.div
              animate={{ 
                rotate: isRunning ? 360 : 0,
                scale: isRunning ? [1, 1.2, 1] : 1,
              }}
              transition={{ 
                rotate: { duration: 2, repeat: isRunning ? Infinity : 0, ease: "linear" },
                scale: { duration: 0.5, repeat: isRunning ? Infinity : 0 },
              }}
            >
              <Sparkles style={{ width: "18px", height: "18px", color: "#a78bfa" }} />
            </motion.div>
            <span style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: "600" }}>
              Live Variables
            </span>
            {isRunning && (
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  fontSize: "11px",
                  color: "#60a5fa",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  background: "rgba(59, 130, 246, 0.2)",
                }}
              >
                scanning...
              </motion.span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {displayVariables.length > 0 && (
              <motion.span
                key={displayVariables.length}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                style={{
                  padding: "4px 12px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3))",
                  border: "1px solid rgba(139, 92, 246, 0.5)",
                  color: "#a78bfa",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {displayVariables.length}
              </motion.span>
            )}
            <motion.span
              animate={{ rotate: showVariables ? 180 : 0 }}
              style={{ color: "#64748b", fontSize: "12px" }}
            >
              ▼
            </motion.span>
          </div>
        </button>

        <AnimatePresence>
          {showVariables && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ 
                padding: "16px 20px", 
                maxHeight: "200px", 
                overflowY: "auto",
                minHeight: "80px",
              }}>
                {displayVariables.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ 
                      display: "flex", 
                      flexDirection: "column",
                      alignItems: "center", 
                      justifyContent: "center",
                      gap: "12px",
                      padding: "20px",
                      color: "#64748b",
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Box style={{ width: "32px", height: "32px" }} />
                    </motion.div>
                    <span style={{ fontSize: "13px", textAlign: "center" }}>
                      Run your code to see variables appear here
                    </span>
                  </motion.div>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    <AnimatePresence mode="popLayout">
                      {displayVariables.map((variable, index) => {
                        const colors = getTypeColor(variable.type);
                        return (
                          <motion.div
                            key={variable.name}
                            layout
                            initial={{ opacity: 0, scale: 0.5, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.05, type: "spring", stiffness: 200 }}
                            whileHover={{ scale: 1.05, boxShadow: colors.glow }}
                            style={{
                              padding: "10px 14px",
                              borderRadius: "12px",
                              background: colors.bg,
                              border: `2px solid ${colors.border}`,
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              cursor: "default",
                            }}
                          >
                            <span style={{ fontSize: "16px" }}>{colors.icon}</span>
                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                              <span style={{ 
                                color: "#94a3b8", 
                                fontSize: "11px", 
                                fontWeight: "500",
                                fontFamily: "'JetBrains Mono', monospace",
                              }}>
                                {variable.name}
                              </span>
                              <motion.span
                                key={variable.value}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                style={{ 
                                  fontSize: "14px", 
                                  fontWeight: "700",
                                  fontFamily: "'JetBrains Mono', monospace",
                                  color: colors.text,
                                }}
                              >
                                {variable.value.length > 20 ? variable.value.slice(0, 20) + "..." : variable.value}
                              </motion.span>
                            </div>
                            <span style={{
                              fontSize: "9px",
                              color: colors.text,
                              opacity: 0.6,
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: `${colors.border}22`,
                              fontWeight: "600",
                              textTransform: "uppercase",
                            }}>
                              {variable.type}
                            </span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #334155",
          background: "rgba(15, 23, 42, 0.7)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Terminal style={{ width: "18px", height: "18px", color: "#22c55e" }} />
            <span style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: "600" }}>Console Output</span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {isRunning && (
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))",
                  border: "1px solid rgba(59, 130, 246, 0.4)",
                }}
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Zap style={{ width: "12px", height: "12px", color: "#60a5fa" }} />
                </motion.div>
                <span style={{ color: "#60a5fa", fontSize: "11px", fontWeight: "600" }}>Executing...</span>
              </motion.div>
            )}
            
            {hasCompleted && !hasError && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  background: "rgba(34, 197, 94, 0.15)",
                  border: "1px solid rgba(34, 197, 94, 0.4)",
                }}
              >
                <CheckCircle2 style={{ width: "12px", height: "12px", color: "#22c55e" }} />
                <span style={{ color: "#22c55e", fontSize: "11px", fontWeight: "600" }}>Success</span>
              </motion.div>
            )}

            {hasError && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                }}
              >
                <AlertCircle style={{ width: "12px", height: "12px", color: "#ef4444" }} />
                <span style={{ color: "#ef4444", fontSize: "11px", fontWeight: "600" }}>Error</span>
              </motion.div>
            )}
            
            {executionTime && !isRunning && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 10px",
                borderRadius: "8px",
                background: "rgba(100, 116, 139, 0.2)",
              }}>
                <Clock style={{ width: "10px", height: "10px", color: "#94a3b8" }} />
                <span style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "600" }}>{executionTime.toFixed(0)}ms</span>
              </div>
            )}
          </div>
        </div>

        <div ref={outputRef} style={{ flex: 1, padding: "20px", overflowY: "auto", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px" }}>
          {output.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: "20px",
                color: "#64748b",
              }}
            >
              <motion.div animate={{ y: [0, -8, 0], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }}>
                <Code2 style={{ width: "48px", height: "48px" }} />
              </motion.div>
              <div style={{ textAlign: "center" }}>
                <p style={{ marginBottom: "10px", fontSize: "15px", color: "#94a3b8" }}>
                  Click <span style={{ color: "#22c55e", fontWeight: "700", padding: "2px 8px", borderRadius: "6px", background: "rgba(34, 197, 94, 0.15)" }}>Run Code</span> to execute
                </p>
                <p style={{ fontSize: "12px", opacity: 0.6 }}>Output and variables will appear here</p>
              </div>
            </motion.div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <AnimatePresence mode="popLayout">
                {output.map((line, i) => {
                  const isSystem = line.startsWith(">>>") || line.startsWith("---");
                  const isError = line.toLowerCase().includes("error");
                  const isEmpty = line.trim() === "";
                  
                  if (isEmpty) return <div key={i} style={{ height: "8px" }} />;
                  
                  return (
                    <motion.div
                      key={`${i}-${line.slice(0, 20)}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                      style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "4px 0" }}
                    >
                      {!isSystem && (
                        <ArrowRight style={{ width: "14px", height: "14px", color: isError ? "#ef4444" : "#22c55e", marginTop: "2px", flexShrink: 0 }} />
                      )}
                      <span style={{
                        color: isSystem ? "#64748b" : isError ? "#f87171" : "#4ade80",
                        fontStyle: isSystem ? "italic" : "normal",
                        fontSize: isSystem ? "12px" : "14px",
                        wordBreak: "break-word",
                      }}>
                        {line}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SimpleOutput;
