"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Info, Box } from "lucide-react";

interface HeapObject {
  id: number;
  type: string;
  value: string;
  address: string;
  size: number;
  color: string;
}

export function HeapVisualizer3D() {
  const [heap, setHeap] = useState<HeapObject[]>([
    { id: 1, type: "int", value: "42", address: "0x1000", size: 28, color: "#00FFFF" },
    { id: 2, type: "str", value: '"Hello"', address: "0x1050", size: 54, color: "#FF00FF" },
    { id: 3, type: "list", value: "[1, 2, 3]", address: "0x1100", size: 88, color: "#00FF88" },
  ]);
  const [nextId, setNextId] = useState(4);
  const [nextAddr, setNextAddr] = useState(0x1200);
  const [showExplanation, setShowExplanation] = useState(true);

  const allocateObject = (type: string) => {
    const configs: Record<string, { value: string; size: number; color: string }> = {
      int: { value: String(Math.floor(Math.random() * 100)), size: 28, color: "#00FFFF" },
      str: { value: `"text_${nextId}"`, size: 50, color: "#FF00FF" },
      list: { value: "[]", size: 56, color: "#00FF88" },
      dict: { value: "{}", size: 64, color: "#FF8800" },
    };

    const config = configs[type];
    setHeap(prev => [...prev, {
      id: nextId,
      type,
      value: config.value,
      address: `0x${nextAddr.toString(16).toUpperCase()}`,
      size: config.size,
      color: config.color,
    }]);
    setNextId(n => n + 1);
    setNextAddr(a => a + config.size + 16);
  };

  const deallocate = (id: number) => {
    setHeap(prev => prev.filter(obj => obj.id !== id));
  };

  const totalMemory = heap.reduce((sum, obj) => sum + obj.size, 0);

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
            background: "linear-gradient(135deg, #00FF88 0%, #FF8800 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}
        >
          HEAP MEMORY VISUALIZER
        </motion.h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          Watch Python objects allocated on the heap
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
        <div style={{
          padding: "10px 20px",
          background: "rgba(0, 255, 136, 0.1)",
          border: "1px solid #00FF8844",
          borderRadius: 12,
        }}>
          <span style={{ color: "#888", fontSize: 11 }}>OBJECTS: </span>
          <span style={{ color: "#00FF88", fontWeight: 700, fontSize: 16 }}>{heap.length}</span>
        </div>
        <div style={{
          padding: "10px 20px",
          background: "rgba(255, 136, 0, 0.1)",
          border: "1px solid #FF880044",
          borderRadius: 12,
        }}>
          <span style={{ color: "#888", fontSize: 11 }}>MEMORY: </span>
          <span style={{ color: "#FF8800", fontWeight: 700, fontSize: 16 }}>{totalMemory} bytes</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showExplanation ? "1fr 280px" : "1fr", gap: 24 }}>
        <div>
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 16,
            padding: 16,
            border: "1px solid #00FF8844",
            marginBottom: 20,
          }}>
            <h3 style={{ color: "#00FF88", fontSize: 14, marginBottom: 12 }}>ALLOCATE NEW OBJECT</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["int", "str", "list", "dict"].map(type => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => allocateObject(type)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "2px solid #00FF8844",
                    background: "transparent",
                    color: "#00FF88",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Plus style={{ width: 14, height: 14 }} />
                  {type}()
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 20,
            padding: 20,
            border: "1px solid #FF880044",
            minHeight: 250,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Box style={{ width: 18, height: 18, color: "#FF8800" }} />
              <h3 style={{ color: "#FF8800", fontSize: 14, margin: 0 }}>HEAP MEMORY</h3>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <AnimatePresence>
                {heap.map((obj) => (
                  <motion.div
                    key={obj.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    layout
                    style={{
                      background: `linear-gradient(135deg, ${obj.color}33, ${obj.color}11)`,
                      border: `2px solid ${obj.color}`,
                      borderRadius: 12,
                      padding: 14,
                      minWidth: 120,
                      position: "relative",
                    }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      onClick={() => deallocate(obj.id)}
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        border: "none",
                        background: "#FF444444",
                        color: "#FF4444",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Trash2 style={{ width: 12, height: 12 }} />
                    </motion.button>

                    <div style={{ color: "#666", fontSize: 9, marginBottom: 6 }}>{obj.address}</div>
                    <span style={{ 
                      color: obj.color, 
                      fontWeight: 700, 
                      fontSize: 12,
                      padding: "2px 8px",
                      background: `${obj.color}22`,
                      borderRadius: 4,
                    }}>
                      {obj.type}
                    </span>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginTop: 8 }}>
                      {obj.value}
                    </div>
                    <div style={{ color: "#666", fontSize: 10, marginTop: 4 }}>
                      {obj.size} bytes
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {heap.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
                Heap is empty. Allocate some objects!
              </div>
            )}
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
              border: "1px solid #FF880022",
              height: "fit-content",
            }}
          >
            <h3 style={{ color: "#FF8800", fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Info style={{ width: 20, height: 20 }} />
              HEAP VS STACK
            </h3>

            <div style={{ marginBottom: 16, padding: 10, background: "#FF880011", borderRadius: 8, borderLeft: "3px solid #FF8800" }}>
              <div style={{ color: "#FF8800", fontWeight: 700, fontSize: 12 }}>HEAP</div>
              <p style={{ color: "#888", fontSize: 11, margin: "4px 0 0" }}>
                Dynamic memory for objects.
              </p>
            </div>

            <div style={{ marginBottom: 16, padding: 10, background: "#FF00FF11", borderRadius: 8, borderLeft: "3px solid #FF00FF" }}>
              <div style={{ color: "#FF00FF", fontWeight: 700, fontSize: 12 }}>STACK</div>
              <p style={{ color: "#888", fontSize: 11, margin: "4px 0 0" }}>
                Function calls and references.
              </p>
            </div>

            <div style={{
              padding: 12,
              background: "linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 170, 255, 0.1))",
              borderRadius: 12,
              borderLeft: "3px solid #00FF88",
            }}>
              <h4 style={{ color: "#00FF88", fontSize: 11, marginBottom: 6 }}>Garbage Collection</h4>
              <p style={{ color: "#ccc", fontSize: 10, lineHeight: 1.5 }}>
                Python automatically frees unused objects when no references point to them!
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
            border: "2px solid #FF880044",
            background: showExplanation ? "rgba(255, 136, 0, 0.2)" : "transparent",
            color: "#FF8800",
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

export default HeapVisualizer3D;
