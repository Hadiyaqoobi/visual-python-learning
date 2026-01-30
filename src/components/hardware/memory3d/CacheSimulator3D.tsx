"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Info, Zap, CheckCircle, XCircle } from "lucide-react";

interface CacheLine {
  valid: boolean;
  tag: number;
  data: string;
}

interface AccessResult {
  address: number;
  hit: boolean;
  cacheIndex: number;
}

export function CacheSimulator3D() {
  const [cache, setCache] = useState<CacheLine[]>(
    Array(8).fill(null).map(() => ({ valid: false, tag: 0, data: "---" }))
  );
  const [accessHistory, setAccessHistory] = useState<AccessResult[]>([]);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [currentAccess, setCurrentAccess] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  const accessMemory = (address: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentAccess(address);

    const cacheIndex = address % 8;
    const tag = Math.floor(address / 8);
    
    setTimeout(() => {
      const isHit = cache[cacheIndex].valid && cache[cacheIndex].tag === tag;
      
      if (isHit) {
        setHits(h => h + 1);
      } else {
        setMisses(m => m + 1);
        setCache(prev => {
          const newCache = [...prev];
          newCache[cacheIndex] = {
            valid: true,
            tag: tag,
            data: `Data@${address}`,
          };
          return newCache;
        });
      }

      setAccessHistory(prev => [...prev.slice(-9), { address, hit: isHit, cacheIndex }]);
      
      setTimeout(() => {
        setCurrentAccess(null);
        setIsAnimating(false);
      }, 500);
    }, 800);
  };

  const runDemo = () => {
    if (isAnimating) return;
    const sequence = [0, 1, 2, 3, 0, 1, 4, 0, 1, 2];
    let i = 0;
    
    const runNext = () => {
      if (i < sequence.length) {
        accessMemory(sequence[i]);
        i++;
        setTimeout(runNext, 1500);
      }
    };
    runNext();
  };

  const reset = () => {
    setCache(Array(8).fill(null).map(() => ({ valid: false, tag: 0, data: "---" })));
    setAccessHistory([]);
    setHits(0);
    setMisses(0);
    setCurrentAccess(null);
  };

  const hitRate = hits + misses > 0 ? ((hits / (hits + misses)) * 100).toFixed(1) : "0.0";

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
            background: "linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}
        >
          CACHE SIMULATOR
        </motion.h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          Experience cache hits and misses - see why data locality matters!
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
        <div style={{
          padding: "10px 20px",
          background: "rgba(0, 255, 136, 0.1)",
          border: "1px solid #00FF8844",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <CheckCircle style={{ width: 16, height: 16, color: "#00FF88" }} />
          <span style={{ color: "#00FF88", fontWeight: 700 }}>Hits: {hits}</span>
        </div>
        <div style={{
          padding: "10px 20px",
          background: "rgba(255, 68, 68, 0.1)",
          border: "1px solid #FF444444",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <XCircle style={{ width: 16, height: 16, color: "#FF4444" }} />
          <span style={{ color: "#FF4444", fontWeight: 700 }}>Misses: {misses}</span>
        </div>
        <div style={{
          padding: "10px 20px",
          background: "rgba(0, 255, 255, 0.1)",
          border: "1px solid #00FFFF44",
          borderRadius: 12,
        }}>
          <span style={{ color: "#00FFFF", fontWeight: 700 }}>Hit Rate: {hitRate}%</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showExplanation ? "1fr 280px" : "1fr", gap: 24 }}>
        <div>
          {/* Cache Visualization */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 20,
            padding: 20,
            border: "1px solid #00FFFF22",
            marginBottom: 20,
          }}>
            <h3 style={{ color: "#00FFFF", fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Zap style={{ width: 18, height: 18 }} />
              L1 CACHE (8 lines)
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {cache.map((line, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: currentAccess !== null && (currentAccess % 8) === i ? 1.05 : 1,
                    boxShadow: currentAccess !== null && (currentAccess % 8) === i 
                      ? "0 0 20px #00FFFF66" 
                      : "none",
                  }}
                  style={{
                    background: line.valid 
                      ? "linear-gradient(135deg, #00FF8833, #00FF8811)"
                      : "rgba(0, 0, 0, 0.3)",
                    border: `2px solid ${
                      currentAccess !== null && (currentAccess % 8) === i 
                        ? "#00FFFF" 
                        : line.valid ? "#00FF8844" : "#333"
                    }`,
                    borderRadius: 10,
                    padding: 12,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#666", fontSize: 10 }}>Line {i}</span>
                    <span style={{ 
                      color: line.valid ? "#00FF88" : "#666", 
                      fontSize: 9,
                      padding: "2px 6px",
                      background: line.valid ? "#00FF8822" : "transparent",
                      borderRadius: 4,
                    }}>
                      {line.valid ? "VALID" : "EMPTY"}
                    </span>
                  </div>
                  <div style={{ color: "#888", fontSize: 9, marginBottom: 4 }}>
                    Tag: {line.valid ? line.tag : "-"}
                  </div>
                  <div style={{ 
                    color: line.valid ? "#fff" : "#444", 
                    fontSize: 11, 
                    fontWeight: 600,
                    fontFamily: "monospace",
                  }}>
                    {line.data}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Memory Address Buttons */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 16,
            padding: 16,
            border: "1px solid #FF880044",
            marginBottom: 20,
          }}>
            <h3 style={{ color: "#FF8800", fontSize: 14, marginBottom: 12 }}>ACCESS MEMORY ADDRESS</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Array(16).fill(0).map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => accessMemory(i)}
                  disabled={isAnimating}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    border: `2px solid ${currentAccess === i ? "#00FFFF" : "#333"}`,
                    background: currentAccess === i ? "#00FFFF33" : "#1a1a3e",
                    color: currentAccess === i ? "#00FFFF" : "#888",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: isAnimating ? "not-allowed" : "pointer",
                  }}
                >
                  {i}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Access History */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 16,
            padding: 16,
            border: "1px solid #FF00FF44",
            marginBottom: 20,
          }}>
            <h3 style={{ color: "#FF00FF", fontSize: 14, marginBottom: 12 }}>ACCESS HISTORY</h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", minHeight: 40 }}>
              <AnimatePresence>
                {accessHistory.map((access, i) => (
                  <motion.div
                    key={`${i}-${access.address}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      background: access.hit ? "#00FF8833" : "#FF444433",
                      border: `1px solid ${access.hit ? "#00FF88" : "#FF4444"}`,
                      color: access.hit ? "#00FF88" : "#FF4444",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    [{access.address}] {access.hit ? "HIT" : "MISS"}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runDemo}
              disabled={isAnimating}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
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
              RUN DEMO
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
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
              HOW CACHE WORKS
            </h3>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <CheckCircle style={{ width: 14, height: 14, color: "#00FF88" }} />
                <span style={{ color: "#00FF88", fontSize: 12, fontWeight: 600 }}>CACHE HIT</span>
              </div>
              <p style={{ color: "#aaa", fontSize: 11, lineHeight: 1.5 }}>
                Data found in cache! Super fast (~1ns). The CPU gets data immediately.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <XCircle style={{ width: 14, height: 14, color: "#FF4444" }} />
                <span style={{ color: "#FF4444", fontSize: 12, fontWeight: 600 }}>CACHE MISS</span>
              </div>
              <p style={{ color: "#aaa", fontSize: 11, lineHeight: 1.5 }}>
                Data not in cache. Must fetch from RAM (~100ns). That's 100x slower!
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: "#FF8800", fontSize: 13, marginBottom: 8 }}>Direct Mapping</h4>
              <p style={{ color: "#aaa", fontSize: 11, lineHeight: 1.5 }}>
                Address % 8 = cache line index. Address 0, 8, 16 all map to line 0!
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
                Looping through a list sequentially gives great cache hits. 
                Random access causes misses. This is why <code style={{ color: "#00FFFF" }}>for x in list</code> is fast!
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

export default CacheSimulator3D;
