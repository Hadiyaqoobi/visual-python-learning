"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Info, ArrowDown, Cpu, Database, HardDrive } from "lucide-react";

type JourneyStep = "idle" | "cpu" | "l1" | "l2" | "l3" | "ram" | "ssd" | "found";

const JOURNEY_STEPS = [
  { id: "cpu", name: "CPU Request", color: "#FF00FF", icon: <Cpu size={20} />, time: "0 ns" },
  { id: "l1", name: "L1 Cache", color: "#00FF88", icon: <Database size={20} />, time: "~1 ns" },
  { id: "l2", name: "L2 Cache", color: "#00FFFF", icon: <Database size={20} />, time: "~4 ns" },
  { id: "l3", name: "L3 Cache", color: "#00AAFF", icon: <Database size={20} />, time: "~12 ns" },
  { id: "ram", name: "RAM", color: "#FF8800", icon: <Database size={20} />, time: "~100 ns" },
  { id: "ssd", name: "SSD", color: "#FF4444", icon: <HardDrive size={20} />, time: "~100 μs" },
];

export function MemoryJourney3D() {
  const [currentStep, setCurrentStep] = useState<JourneyStep>("idle");
  const [foundAt, setFoundAt] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [scenario, setScenario] = useState<"l1hit" | "l3hit" | "rammiss">("l1hit");
  const [showExplanation, setShowExplanation] = useState(true);
  const [totalTime, setTotalTime] = useState("0 ns");

  const scenarios = {
    l1hit: { stopAt: "l1", description: "Data in L1 Cache (best case)", time: "~1 ns" },
    l3hit: { stopAt: "l3", description: "Data in L3 Cache (common)", time: "~12 ns" },
    rammiss: { stopAt: "ram", description: "Cache miss - fetch from RAM", time: "~100 ns" },
  };

  const runJourney = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep("cpu");
    setFoundAt(null);

    const steps: JourneyStep[] = ["cpu", "l1", "l2", "l3", "ram", "ssd"];
    const stopAt = scenarios[scenario].stopAt;
    let stepIndex = 0;

    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setCurrentStep(steps[stepIndex]);
        if (steps[stepIndex] === stopAt) {
          setTimeout(() => {
            setFoundAt(stopAt);
            setCurrentStep("found");
            setTotalTime(scenarios[scenario].time);
            setIsRunning(false);
          }, 600);
          clearInterval(interval);
        }
      }
    }, 800);
  };

  const reset = () => {
    setCurrentStep("idle");
    setFoundAt(null);
    setIsRunning(false);
    setTotalTime("0 ns");
  };

  const getStepStatus = (stepId: string) => {
    const steps = ["cpu", "l1", "l2", "l3", "ram", "ssd"];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(stepId);
    
    if (foundAt === stepId) return "found";
    if (stepIndex < currentIndex) return "passed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <div style={{
      minHeight: "100%",
      background: "linear-gradient(135deg, #0A0A1E 0%, #1A1A3E 50%, #0A0A1E 100%)",
      padding: 24,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 32,
            fontWeight: 700,
            background: "linear-gradient(135deg, #00FFFF 0%, #FF8800 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}
        >
          MEMORY JOURNEY
        </motion.h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          Follow data as it travels through the memory hierarchy
        </p>
      </div>

      {/* Time Display */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <motion.div
          animate={{ scale: foundAt ? [1, 1.1, 1] : 1 }}
          style={{
            padding: "12px 32px",
            background: foundAt ? "linear-gradient(135deg, #00FF8833, #00FFFF33)" : "rgba(0, 0, 0, 0.3)",
            border: `2px solid ${foundAt ? "#00FF88" : "#333"}`,
            borderRadius: 16,
            textAlign: "center",
          }}
        >
          <div style={{ color: "#666", fontSize: 11, marginBottom: 4 }}>TOTAL ACCESS TIME</div>
          <div style={{ color: foundAt ? "#00FF88" : "#888", fontSize: 28, fontWeight: 700 }}>{totalTime}</div>
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showExplanation ? "1fr 280px" : "1fr", gap: 24 }}>
        <div>
          {/* Scenario Selector */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 16,
            padding: 16,
            border: "1px solid #FF00FF44",
            marginBottom: 20,
          }}>
            <h3 style={{ color: "#FF00FF", fontSize: 14, marginBottom: 12 }}>SELECT SCENARIO</h3>
            <div style={{ display: "flex", gap: 8 }}>
              {Object.entries(scenarios).map(([key, val]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setScenario(key as any); reset(); }}
                  disabled={isRunning}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 10,
                    border: `2px solid ${scenario === key ? "#FF00FF" : "#333"}`,
                    background: scenario === key ? "#FF00FF22" : "transparent",
                    color: scenario === key ? "#FF00FF" : "#888",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: isRunning ? "not-allowed" : "pointer",
                    textAlign: "center",
                  }}
                >
                  <div style={{ marginBottom: 4 }}>{val.description}</div>
                  <div style={{ color: "#00FF88", fontSize: 13, fontWeight: 700 }}>{val.time}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Journey Visualization */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 20,
            padding: 24,
            border: "1px solid #00FFFF22",
            marginBottom: 20,
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              {JOURNEY_STEPS.map((step, i) => {
                const status = getStepStatus(step.id);
                return (
                  <div key={step.id} style={{ width: "100%", maxWidth: 400 }}>
                    <motion.div
                      animate={{
                        scale: status === "active" ? 1.05 : 1,
                        boxShadow: status === "active" 
                          ? `0 0 30px ${step.color}66` 
                          : status === "found"
                            ? `0 0 40px #00FF8866`
                            : "none",
                      }}
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        background: status === "found"
                          ? "linear-gradient(135deg, #00FF8844, #00FF8822)"
                          : status === "active"
                            ? `linear-gradient(135deg, ${step.color}44, ${step.color}22)`
                            : status === "passed"
                              ? "#FF444422"
                              : "#1a1a3e",
                        border: `2px solid ${
                          status === "found" ? "#00FF88" 
                          : status === "active" ? step.color 
                          : status === "passed" ? "#FF4444" 
                          : "#333"
                        }`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ 
                          color: status === "found" ? "#00FF88" : status === "active" ? step.color : "#666" 
                        }}>
                          {step.icon}
                        </div>
                        <div>
                          <div style={{ 
                            color: status === "found" ? "#00FF88" : status === "active" ? step.color : "#888",
                            fontWeight: 700,
                            fontSize: 14,
                          }}>
                            {step.name}
                          </div>
                          <div style={{ color: "#666", fontSize: 11 }}>{step.time}</div>
                        </div>
                      </div>
                      
                      <div style={{
                        padding: "4px 12px",
                        borderRadius: 8,
                        background: status === "found" ? "#00FF88" : status === "passed" ? "#FF4444" : "transparent",
                        color: status === "found" || status === "passed" ? "#000" : "#666",
                        fontSize: 10,
                        fontWeight: 700,
                      }}>
                        {status === "found" ? "DATA FOUND!" : status === "passed" ? "MISS" : status === "active" ? "CHECKING..." : "WAITING"}
                      </div>
                    </motion.div>
                    
                    {i < JOURNEY_STEPS.length - 1 && (
                      <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                        <motion.div
                          animate={{
                            color: getStepStatus(JOURNEY_STEPS[i + 1].id) !== "pending" ? "#00FFFF" : "#333",
                          }}
                        >
                          <ArrowDown size={20} />
                        </motion.div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runJourney}
              disabled={isRunning}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 12,
                border: "none",
                background: isRunning ? "#333" : "linear-gradient(135deg, #00FF88, #00AA66)",
                color: isRunning ? "#666" : "#000",
                fontSize: 14,
                fontWeight: 700,
                cursor: isRunning ? "not-allowed" : "pointer",
              }}
            >
              <Play style={{ width: 18, height: 18 }} />
              {isRunning ? "SEARCHING..." : "START JOURNEY"}
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
              THE DATA JOURNEY
            </h3>

            <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
              When the CPU needs data, it searches through each memory level until found. 
              This is called the <strong style={{ color: "#00FF88" }}>memory access path</strong>.
            </p>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: "#FF8800", fontSize: 13, marginBottom: 8 }}>Time Comparison</h4>
              <ul style={{ color: "#aaa", fontSize: 11, lineHeight: 1.8, paddingLeft: 16, margin: 0 }}>
                <li><span style={{ color: "#00FF88" }}>L1 Hit</span>: 1ns = 1 second</li>
                <li><span style={{ color: "#00FFFF" }}>L3 Hit</span>: 12ns = 12 seconds</li>
                <li><span style={{ color: "#FF8800" }}>RAM</span>: 100ns = 1.5 minutes</li>
                <li><span style={{ color: "#FF4444" }}>SSD</span>: 100μs = 1 day!</li>
              </ul>
            </div>

            <div style={{
              padding: 12,
              background: "linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 170, 255, 0.1))",
              borderRadius: 12,
              borderLeft: "3px solid #00FF88",
            }}>
              <h4 style={{ color: "#00FF88", fontSize: 12, marginBottom: 6 }}>Python Connection</h4>
              <p style={{ color: "#ccc", fontSize: 10, lineHeight: 1.5 }}>
                Accessing <code style={{ color: "#00FFFF" }}>list[0]</code> after <code style={{ color: "#00FFFF" }}>list[1]</code> is 
                fast because both are likely in cache. Random access is slower due to cache misses!
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

export default MemoryJourney3D;
