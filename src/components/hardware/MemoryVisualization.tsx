"use client";

import { motion, AnimatePresence } from "framer-motion";

export interface MemoryCell {
  address: string;
  value: string;
  label?: string;
  type?: string;
  isActive?: boolean;
  isWriting?: boolean;
  isReading?: boolean;
}

export interface MemoryState {
  cells: MemoryCell[];
  activeAddress?: string;
}

interface MemoryVisualizationProps {
  state: MemoryState;
}

const typeStyles: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  int: { bg: "#eff6ff", border: "#3b82f6", text: "#1d4ed8", badge: "#3b82f6" },
  float: { bg: "#faf5ff", border: "#a855f7", text: "#7c3aed", badge: "#a855f7" },
  str: { bg: "#f0fdf4", border: "#22c55e", text: "#15803d", badge: "#22c55e" },
  bool: { bg: "#fff7ed", border: "#f97316", text: "#c2410c", badge: "#f97316" },
  list: { bg: "#fdf2f8", border: "#ec4899", text: "#be185d", badge: "#ec4899" },
};

const defaultStyle = { bg: "#f8fafc", border: "#94a3b8", text: "#475569", badge: "#64748b" };

export function MemoryVisualization({ state }: MemoryVisualizationProps) {
  const { cells } = state;

  return (
    <motion.div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        border: "2px solid #e2e8f0",
        padding: "20px",
        marginTop: "16px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>💾</span>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
            RAM - Memory
          </span>
        </div>
        <span style={{
          fontSize: "11px",
          padding: "4px 12px",
          borderRadius: "20px",
          background: "#f1f5f9",
          color: "#64748b",
          fontWeight: "600",
        }}>
          {cells.length} cell{cells.length !== 1 ? "s" : ""} allocated
        </span>
      </div>

      {/* Memory Cells */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", minHeight: "100px" }}>
        <AnimatePresence mode="popLayout">
          {cells.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px",
                color: "#94a3b8",
                background: "#f8fafc",
                borderRadius: "12px",
                border: "2px dashed #e2e8f0",
              }}
            >
              <span style={{ fontSize: "32px", marginBottom: "8px" }}>📭</span>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Memory is empty</span>
              <span style={{ fontSize: "11px", marginTop: "4px", color: "#94a3b8" }}>Execute code to see memory allocation</span>
            </motion.div>
          ) : (
            cells.map((cell, index) => {
              const style = typeStyles[cell.type || ""] || defaultStyle;
              
              return (
                <motion.div
                  key={cell.address}
                  layout
                  initial={{ opacity: 0, x: -30, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    scale: 1,
                    boxShadow: cell.isWriting 
                      ? `0 0 20px ${style.border}40` 
                      : "0 2px 8px rgba(0,0,0,0.05)"
                  }}
                  exit={{ opacity: 0, x: 30, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 1fr 120px 70px",
                    alignItems: "center",
                    gap: "16px",
                    padding: "14px 18px",
                    borderRadius: "12px",
                    background: style.bg,
                    border: `2px solid ${style.border}`,
                  }}
                >
                  {/* Address */}
                  <div>
                    <div style={{ fontSize: "9px", color: "#64748b", fontWeight: "600", letterSpacing: "0.5px", marginBottom: "2px" }}>
                      ADDRESS
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#334155", fontWeight: "700" }}>
                      {cell.address}
                    </div>
                  </div>

                  {/* Value */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "9px", color: "#64748b", fontWeight: "600", letterSpacing: "0.5px", marginBottom: "2px" }}>
                      VALUE
                    </div>
                    <motion.div
                      key={cell.value}
                      initial={{ scale: 1.3, color: style.badge }}
                      animate={{ scale: 1, color: "#0f172a" }}
                      transition={{ type: "spring", stiffness: 300 }}
                      style={{ fontFamily: "monospace", fontSize: "22px", fontWeight: "700" }}
                    >
                      {cell.value}
                    </motion.div>
                  </div>

                  {/* Variable Name */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "9px", color: "#64748b", fontWeight: "600", letterSpacing: "0.5px", marginBottom: "4px" }}>
                      VARIABLE
                    </div>
                    {cell.label ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "5px 12px",
                          borderRadius: "20px",
                          background: style.badge,
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        → {cell.label}
                      </motion.div>
                    ) : (
                      <span style={{ color: "#cbd5e1", fontSize: "12px" }}>—</span>
                    )}
                  </div>

                  {/* Type */}
                  <div style={{ textAlign: "right" }}>
                    <span style={{
                      fontSize: "10px",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      background: "white",
                      color: style.text,
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      border: `1px solid ${style.border}`,
                    }}>
                      {cell.type || "?"}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      {cells.length > 0 && (
        <div style={{
          marginTop: "16px",
          paddingTop: "14px",
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "center",
        }}>
          {Object.entries(typeStyles).map(([type, style]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "12px",
                height: "12px",
                borderRadius: "4px",
                background: style.bg,
                border: `2px solid ${style.border}`,
              }} />
              <span style={{ fontSize: "11px", color: style.text, fontWeight: "600" }}>{type}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default MemoryVisualization;
