"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Info, Zap, Clock, Cpu, Database } from "lucide-react";

interface Benchmark {
  id: string;
  name: string;
  description: string;
  code: string;
  metrics: {
    cpuCycles: number;
    cacheHits: number;
    cacheMisses: number;
    memoryAccess: number;
  };
  color: string;
}

const BENCHMARKS: Benchmark[] = [
  {
    id: "sequential",
    name: "Sequential Access",
    description: "Iterate through list in order",
    code: "for i in range(len(arr)):\n    total += arr[i]",
    metrics: { cpuCycles: 1000, cacheHits: 95, cacheMisses: 5, memoryAccess: 100 },
    color: "#00FF88",
  },
  {
    id: "random",
    name: "Random Access",
    description: "Access list elements randomly",
    code: "for i in random_indices:\n    total += arr[i]",
    metrics: { cpuCycles: 3500, cacheHits: 40, cacheMisses: 60, memoryAccess: 100 },
    color: "#FF4444",
  },
  {
    id: "local",
    name: "Local Variables",
    description: "Use local variables in function",
    code: "def fast():\n    x = 0\n    for i in range(1000):\n        x += i",
    metrics: { cpuCycles: 800, cacheHits: 99, cacheMisses: 1, memoryAccess: 20 },
    color: "#00FFFF",
  },
  {
    id: "global",
    name: "Global Variables",
    description: "Use global variables",
    code: "x = 0\nfor i in range(1000):\n    x += i",
    metrics: { cpuCycles: 1500, cacheHits: 85, cacheMisses: 15, memoryAccess: 50 },
    color: "#FF8800",
  },
];

export function PerformanceLab3D() {
  const [selectedBenchmark, setSelectedBenchmark] = useState<string>("sequential");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<typeof BENCHMARKS[0]["metrics"] | null>(null);
  const [showExplanation, setShowExplanation] = useState(true);

  const benchmark = BENCHMARKS.find(b => b.id === selectedBenchmark)!;

  const runBenchmark = () => {
    if (isRunning) return;
    setIsRunning(true);
    setResults(null);

    // Simulate benchmark running
    setTimeout(() => {
      setResults(benchmark.metrics);
      setIsRunning(false);
    }, 1500);
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
            background: "linear-gradient(135deg, #00FF88 0%, #00FFFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}
        >
          PERFORMANCE LAB
        </motion.h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          Compare different coding patterns and see their hardware impact
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showExplanation ? "1fr 280px" : "1fr", gap: 24 }}>
        <div>
          {/* Benchmark Selection */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 16,
            padding: 16,
            border: "1px solid #00FF8844",
            marginBottom: 20,
          }}>
            <h3 style={{ color: "#00FF88", fontSize: 14, marginBottom: 12 }}>SELECT BENCHMARK</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {BENCHMARKS.map((b) => (
                <motion.button
                  key={b.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedBenchmark(b.id); setResults(null); }}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: `2px solid ${selectedBenchmark === b.id ? b.color : "#333"}`,
                    background: selectedBenchmark === b.id ? `${b.color}22` : "transparent",
                    color: selectedBenchmark === b.id ? b.color : "#888",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ marginBottom: 4 }}>{b.name}</div>
                  <div style={{ fontSize: 10, opacity: 0.7 }}>{b.description}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Code Display */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 16,
            padding: 16,
            border: `1px solid ${benchmark.color}44`,
            marginBottom: 20,
          }}>
            <h3 style={{ color: benchmark.color, fontSize: 14, marginBottom: 12 }}>CODE</h3>
            <pre style={{
              background: "#0a0a2e",
              borderRadius: 8,
              padding: 12,
              margin: 0,
              color: "#fff",
              fontSize: 12,
              lineHeight: 1.6,
            }}>
              {benchmark.code}
            </pre>
          </div>

          {/* Results */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 20,
            padding: 20,
            border: "1px solid #FF00FF44",
            marginBottom: 20,
          }}>
            <h3 style={{ color: "#FF00FF", fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Zap size={18} />
              PERFORMANCE METRICS
            </h3>

            {isRunning ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ display: "inline-block" }}
                >
                  <Cpu size={40} style={{ color: "#00FFFF" }} />
                </motion.div>
                <div style={{ color: "#888", marginTop: 12 }}>Running benchmark...</div>
              </div>
            ) : results ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{
                  background: "#0a0a2e",
                  borderRadius: 10,
                  padding: 14,
                  textAlign: "center",
                }}>
                  <Clock size={20} style={{ color: "#00FFFF", marginBottom: 8 }} />
                  <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>CPU CYCLES</div>
                  <div style={{ color: "#00FFFF", fontSize: 20, fontWeight: 700 }}>{results.cpuCycles.toLocaleString()}</div>
                </div>

                <div style={{
                  background: "#0a0a2e",
                  borderRadius: 10,
                  padding: 14,
                  textAlign: "center",
                }}>
                  <Database size={20} style={{ color: "#00FF88", marginBottom: 8 }} />
                  <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>CACHE HIT RATE</div>
                  <div style={{ color: "#00FF88", fontSize: 20, fontWeight: 700 }}>{results.cacheHits}%</div>
                </div>

                <div style={{
                  background: "#0a0a2e",
                  borderRadius: 10,
                  padding: 14,
                  textAlign: "center",
                }}>
                  <Database size={20} style={{ color: "#FF4444", marginBottom: 8 }} />
                  <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>CACHE MISSES</div>
                  <div style={{ color: "#FF4444", fontSize: 20, fontWeight: 700 }}>{results.cacheMisses}%</div>
                </div>

                <div style={{
                  background: "#0a0a2e",
                  borderRadius: 10,
                  padding: 14,
                  textAlign: "center",
                }}>
                  <Zap size={20} style={{ color: "#FF8800", marginBottom: 8 }} />
                  <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>MEMORY ACCESS</div>
                  <div style={{ color: "#FF8800", fontSize: 20, fontWeight: 700 }}>{results.memoryAccess}</div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
                Click RUN to see performance metrics
              </div>
            )}
          </div>

          {/* Run Button */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runBenchmark}
              disabled={isRunning}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 36px",
                borderRadius: 12,
                border: "none",
                background: isRunning ? "#333" : `linear-gradient(135deg, ${benchmark.color}, ${benchmark.color}88)`,
                color: isRunning ? "#666" : "#000",
                fontSize: 14,
                fontWeight: 700,
                cursor: isRunning ? "not-allowed" : "pointer",
              }}
            >
              <Play size={18} />
              {isRunning ? "RUNNING..." : "RUN BENCHMARK"}
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
              border: "1px solid #00FF8822",
              height: "fit-content",
            }}
          >
            <h3 style={{ color: "#00FF88", fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Info size={20} />
              PERFORMANCE TIPS
            </h3>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: "#00FFFF", fontSize: 13, marginBottom: 8 }}>Cache Locality</h4>
              <p style={{ color: "#aaa", fontSize: 11, lineHeight: 1.5 }}>
                Sequential access is faster because adjacent data is loaded into cache together.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: "#FF8800", fontSize: 13, marginBottom: 8 }}>Local Variables</h4>
              <p style={{ color: "#aaa", fontSize: 11, lineHeight: 1.5 }}>
                Local variables are faster because Python caches them in a fast lookup table.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: "#FF4444", fontSize: 13, marginBottom: 8 }}>Avoid Random Access</h4>
              <p style={{ color: "#aaa", fontSize: 11, lineHeight: 1.5 }}>
                Random memory access causes cache misses, which are 100x slower than hits!
              </p>
            </div>

            <div style={{
              padding: 12,
              background: "linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 170, 255, 0.1))",
              borderRadius: 12,
              borderLeft: "3px solid #00FF88",
            }}>
              <h4 style={{ color: "#00FF88", fontSize: 11, marginBottom: 6 }}>Pro Tip</h4>
              <p style={{ color: "#ccc", fontSize: 10, lineHeight: 1.5 }}>
                Use <code style={{ color: "#00FFFF" }}>numpy</code> for fast array operations - 
                it's optimized for cache efficiency!
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
            border: "2px solid #00FF8844",
            background: showExplanation ? "rgba(0, 255, 136, 0.2)" : "transparent",
            color: "#00FF88",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Info size={16} />
          {showExplanation ? "HIDE" : "SHOW"} TIPS
        </motion.button>
      </div>
    </div>
  );
}

export default PerformanceLab3D;
