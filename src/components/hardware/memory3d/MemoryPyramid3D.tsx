"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Info, Zap, HardDrive, Cpu, Database } from "lucide-react";

interface MemoryLevel {
  name: string;
  size: string;
  speed: string;
  latency: string;
  color: string;
  width: number;
  icon: React.ReactNode;
  description: string;
}

const MEMORY_LEVELS: MemoryLevel[] = [
  { name: "Registers", size: "~1 KB", speed: "< 1 ns", latency: "1 cycle", color: "#00FF88", width: 15, icon: <Cpu size={16} />, description: "Inside CPU, fastest possible" },
  { name: "L1 Cache", size: "32-64 KB", speed: "~1 ns", latency: "4 cycles", color: "#00FFFF", width: 25, icon: <Zap size={16} />, description: "Per-core, split I/D cache" },
  { name: "L2 Cache", size: "256-512 KB", speed: "~4 ns", latency: "12 cycles", color: "#00AAFF", width: 40, icon: <Zap size={16} />, description: "Per-core, unified cache" },
  { name: "L3 Cache", size: "8-32 MB", speed: "~12 ns", latency: "40 cycles", color: "#0066FF", width: 55, icon: <Zap size={16} />, description: "Shared across all cores" },
  { name: "RAM (DDR5)", size: "16-64 GB", speed: "~100 ns", latency: "200 cycles", color: "#FF8800", width: 75, icon: <Database size={16} />, description: "Main memory, volatile" },
  { name: "SSD (NVMe)", size: "256 GB - 2 TB", speed: "~100 μs", latency: "100K cycles", color: "#FF4444", width: 90, icon: <HardDrive size={16} />, description: "Fast storage, persistent" },
  { name: "HDD", size: "1-10 TB", speed: "~10 ms", latency: "10M cycles", color: "#AA4444", width: 100, icon: <HardDrive size={16} />, description: "Slow storage, cheap" },
];

export function MemoryPyramid3D() {
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [showDataFlow, setShowDataFlow] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  const selected = MEMORY_LEVELS[selectedLevel];

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
            background: "linear-gradient(135deg, #00FF88 0%, #00FFFF 50%, #FF8800 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}
        >
          MEMORY HIERARCHY PYRAMID
        </motion.h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          Explore the trade-off between speed, size, and cost in computer memory
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showExplanation ? "1fr 300px" : "1fr", gap: 24 }}>
        <div>
          {/* Pyramid Visualization */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 20,
            padding: 24,
            border: "1px solid #00FFFF22",
            marginBottom: 20,
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              {MEMORY_LEVELS.map((level, i) => (
                <motion.div
                  key={level.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedLevel(i)}
                  style={{
                    width: `${level.width}%`,
                    padding: "12px 16px",
                    background: selectedLevel === i
                      ? `linear-gradient(135deg, ${level.color}44, ${level.color}22)`
                      : `linear-gradient(135deg, ${level.color}22, ${level.color}11)`,
                    border: `2px solid ${selectedLevel === i ? level.color : level.color + "44"}`,
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: selectedLevel === i ? `0 0 20px ${level.color}44` : "none",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Animated glow for selected */}
                  {selectedLevel === i && (
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "50%",
                        height: "100%",
                        background: `linear-gradient(90deg, transparent, ${level.color}33, transparent)`,
                      }}
                    />
                  )}
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 8, zIndex: 1 }}>
                    <span style={{ color: level.color }}>{level.icon}</span>
                    <span style={{ color: selectedLevel === i ? level.color : "#888", fontWeight: 600, fontSize: 13 }}>
                      {level.name}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 16, zIndex: 1 }}>
                    <span style={{ color: "#666", fontSize: 11 }}>{level.size}</span>
                    <span style={{ color: level.color, fontSize: 11, fontWeight: 600 }}>{level.speed}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Labels */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, padding: "0 20px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "#00FF88", fontSize: 12, fontWeight: 700 }}>⚡ FASTER</div>
                <div style={{ color: "#666", fontSize: 10 }}>Lower latency</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "#00FF88", fontSize: 12, fontWeight: 700 }}>💰 EXPENSIVE</div>
                <div style={{ color: "#666", fontSize: 10 }}>Cost per GB</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "#FF4444", fontSize: 12, fontWeight: 700 }}>📦 SMALLER</div>
                <div style={{ color: "#666", fontSize: 10 }}>Capacity</div>
              </div>
            </div>
          </div>

          {/* Selected Level Details */}
          <motion.div
            key={selectedLevel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: `linear-gradient(135deg, ${selected.color}22, ${selected.color}11)`,
              borderRadius: 16,
              padding: 20,
              border: `2px solid ${selected.color}44`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `${selected.color}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: selected.color,
              }}>
                {selected.icon}
              </div>
              <div>
                <div style={{ color: selected.color, fontSize: 20, fontWeight: 700 }}>{selected.name}</div>
                <div style={{ color: "#888", fontSize: 12 }}>{selected.description}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              <div style={{ background: "#0a0a2e", borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>SIZE</div>
                <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{selected.size}</div>
              </div>
              <div style={{ background: "#0a0a2e", borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>SPEED</div>
                <div style={{ color: selected.color, fontSize: 14, fontWeight: 700 }}>{selected.speed}</div>
              </div>
              <div style={{ background: "#0a0a2e", borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>LATENCY</div>
                <div style={{ color: "#FF8800", fontSize: 14, fontWeight: 700 }}>{selected.latency}</div>
              </div>
              <div style={{ background: "#0a0a2e", borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>LEVEL</div>
                <div style={{ color: "#FF00FF", fontSize: 14, fontWeight: 700 }}>{selectedLevel + 1} of 7</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Explanation Panel */}
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
              MEMORY HIERARCHY
            </h3>

            <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
              Computers use a <strong style={{ color: "#00FF88" }}>hierarchy of memory</strong> because 
              fast memory is expensive and slow memory is cheap. Data moves between levels automatically.
            </p>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: "#FF8800", fontSize: 13, marginBottom: 8 }}>The Trade-off</h4>
              <ul style={{ color: "#aaa", fontSize: 11, lineHeight: 1.8, paddingLeft: 16, margin: 0 }}>
                <li><strong style={{ color: "#00FF88" }}>Fast</strong> = Small + Expensive</li>
                <li><strong style={{ color: "#FF4444" }}>Slow</strong> = Large + Cheap</li>
                <li>CPU needs data <strong style={{ color: "#00FFFF" }}>NOW</strong></li>
              </ul>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: "#FF00FF", fontSize: 13, marginBottom: 8 }}>How It Works</h4>
              <p style={{ color: "#aaa", fontSize: 11, lineHeight: 1.6 }}>
                CPU first checks L1 cache. If data not found (cache miss), it checks L2, then L3, then RAM. 
                Each level is ~10x slower but ~10x bigger!
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
                When you access a variable in Python, the CPU checks each cache level. 
                Frequently used data stays in fast cache - this is why loops are fast after the first iteration!
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

export default MemoryPyramid3D;
