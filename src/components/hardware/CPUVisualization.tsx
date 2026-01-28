"use client";

import { motion } from "framer-motion";

export interface CPUState {
  isActive: boolean;
  currentOperation?: string;
  activeUnit?: "control" | "alu" | "registers" | null;
  registers: {
    PC: string;
    IR: string;
    ACC: string;
    R1: string;
    R2: string;
  };
  aluOperation?: {
    operand1?: string;
    operand2?: string;
    operator?: string;
    result?: string;
  };
}

interface CPUVisualizationProps {
  state: CPUState;
}

export function CPUVisualization({ state }: CPUVisualizationProps) {
  const { isActive, activeUnit, registers, aluOperation, currentOperation } = state;

  return (
    <motion.div
      animate={{
        boxShadow: isActive
          ? "0 0 30px rgba(99, 102, 241, 0.2)"
          : "0 4px 15px rgba(0,0,0,0.2)",
      }}
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        border: isActive ? "2px solid #6366f1" : "2px solid #e2e8f0",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <motion.div
            animate={{
              backgroundColor: isActive ? "#22c55e" : "#cbd5e1",
              boxShadow: isActive ? "0 0 8px #22c55e" : "none",
            }}
            style={{ width: "10px", height: "10px", borderRadius: "50%" }}
          />
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", letterSpacing: "0.5px" }}>
            ⚡ CPU - Central Processing Unit
          </span>
        </div>
        {currentOperation && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              fontSize: "11px",
              fontWeight: "700",
              padding: "6px 14px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              color: "white",
            }}
          >
            {currentOperation}
          </motion.span>
        )}
      </div>

      {/* CPU Components */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
        {/* Control Unit */}
        <motion.div
          animate={{
            borderColor: activeUnit === "control" ? "#f59e0b" : "#e2e8f0",
            backgroundColor: activeUnit === "control" ? "#fffbeb" : "#f8fafc",
          }}
          style={{
            borderRadius: "12px",
            border: "2px solid",
            padding: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span style={{ fontSize: "18px" }}>🎛️</span>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#b45309" }}>CONTROL UNIT</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ background: "#fef3c7", borderRadius: "8px", padding: "10px", border: "1px solid #fde68a" }}>
              <div style={{ fontSize: "9px", color: "#92400e", marginBottom: "4px", fontWeight: "600", letterSpacing: "0.5px" }}>
                PROGRAM COUNTER
              </div>
              <motion.div
                key={registers.PC}
                initial={{ color: "#f59e0b" }}
                animate={{ color: "#1e293b" }}
                style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: "700" }}
              >
                {registers.PC}
              </motion.div>
            </div>
            <div style={{ background: "#fef3c7", borderRadius: "8px", padding: "10px", border: "1px solid #fde68a" }}>
              <div style={{ fontSize: "9px", color: "#92400e", marginBottom: "4px", fontWeight: "600", letterSpacing: "0.5px" }}>
                INSTRUCTION
              </div>
              <motion.div
                key={registers.IR}
                initial={{ color: "#f59e0b" }}
                animate={{ color: "#1e293b" }}
                style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: "700", wordBreak: "break-all" }}
              >
                {registers.IR || "NOP"}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ALU */}
        <motion.div
          animate={{
            borderColor: activeUnit === "alu" ? "#10b981" : "#e2e8f0",
            backgroundColor: activeUnit === "alu" ? "#ecfdf5" : "#f8fafc",
          }}
          style={{
            borderRadius: "12px",
            border: "2px solid",
            padding: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span style={{ fontSize: "18px" }}>🔢</span>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#047857" }}>ALU</span>
          </div>

          <div style={{
            background: "#d1fae5",
            borderRadius: "8px",
            padding: "14px",
            minHeight: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #a7f3d0",
          }}>
            {aluOperation?.operator ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ textAlign: "center" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ 
                    background: "#10b981", 
                    padding: "4px 10px", 
                    borderRadius: "6px", 
                    fontFamily: "monospace", 
                    fontWeight: "700", 
                    color: "white", 
                    fontSize: "14px" 
                  }}>
                    {aluOperation.operand1}
                  </span>
                  <span style={{ color: "#047857", fontWeight: "700", fontSize: "18px" }}>{aluOperation.operator}</span>
                  <span style={{ 
                    background: "#10b981", 
                    padding: "4px 10px", 
                    borderRadius: "6px", 
                    fontFamily: "monospace", 
                    fontWeight: "700", 
                    color: "white", 
                    fontSize: "14px" 
                  }}>
                    {aluOperation.operand2}
                  </span>
                </div>
                {aluOperation.result && (
                  <motion.div
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{
                      fontSize: "28px",
                      fontFamily: "monospace",
                      fontWeight: "700",
                      color: "#047857",
                    }}
                  >
                    = {aluOperation.result}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <span style={{ color: "#6b7280", fontSize: "12px" }}>⏳ Waiting for operation...</span>
            )}
          </div>
        </motion.div>

        {/* Registers */}
        <motion.div
          animate={{
            borderColor: activeUnit === "registers" ? "#8b5cf6" : "#e2e8f0",
            backgroundColor: activeUnit === "registers" ? "#faf5ff" : "#f8fafc",
          }}
          style={{
            borderRadius: "12px",
            border: "2px solid",
            padding: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span style={{ fontSize: "18px" }}>📦</span>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#7c3aed" }}>REGISTERS</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { name: "ACC", label: "Accumulator", value: registers.ACC },
              { name: "R1", label: "Register 1", value: registers.R1 },
              { name: "R2", label: "Register 2", value: registers.R2 },
            ].map((reg) => (
              <div key={reg.name} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#ede9fe",
                borderRadius: "6px",
                padding: "8px 10px",
                border: "1px solid #ddd6fe",
              }}>
                <div>
                  <div style={{ fontSize: "8px", color: "#7c3aed", fontWeight: "600" }}>{reg.label}</div>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#5b21b6" }}>{reg.name}</div>
                </div>
                <motion.div
                  key={reg.value}
                  initial={{ scale: 1.2, color: "#8b5cf6" }}
                  animate={{ scale: 1, color: "#1e293b" }}
                  style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: "700" }}
                >
                  {reg.value || "0"}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Data Bus */}
      <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ flex: 1, height: "2px", background: "linear-gradient(90deg, transparent, #6366f1, transparent)" }} />
        <span style={{ fontSize: "9px", color: "#6366f1", letterSpacing: "2px", fontWeight: "700" }}>DATA BUS</span>
        <div style={{ flex: 1, height: "2px", background: "linear-gradient(90deg, transparent, #6366f1, transparent)" }} />
      </div>
    </motion.div>
  );
}

export default CPUVisualization;
