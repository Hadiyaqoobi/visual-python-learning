"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Info, Database, Search, Edit3 } from "lucide-react";

interface MemoryCell {
  address: number;
  value: number;
  label?: string;
  isHighlighted: boolean;
}

export function RAMExplorer3D() {
  const [memory, setMemory] = useState<MemoryCell[]>(
    Array(64).fill(null).map((_, i) => ({
      address: i * 4,
      value: 0,
      label: undefined,
      isHighlighted: false,
    }))
  );
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [searchAddress, setSearchAddress] = useState("");
  const [newValue, setNewValue] = useState("");
  const [showExplanation, setShowExplanation] = useState(true);

  // Pre-populated variables
  const [variables] = useState([
    { name: "x", address: 0, value: 42 },
    { name: "y", address: 4, value: 17 },
    { name: "sum", address: 8, value: 59 },
    { name: "arr[0]", address: 16, value: 1 },
    { name: "arr[1]", address: 20, value: 2 },
    { name: "arr[2]", address: 24, value: 3 },
  ]);

  useState(() => {
    setMemory(prev => {
      const newMem = [...prev];
      variables.forEach(v => {
        const idx = v.address / 4;
        if (idx < newMem.length) {
          newMem[idx] = { ...newMem[idx], value: v.value, label: v.name };
        }
      });
      return newMem;
    });
  });

  const handleSearch = () => {
    const addr = parseInt(searchAddress, 16) || parseInt(searchAddress);
    if (!isNaN(addr)) {
      const idx = Math.floor(addr / 4);
      if (idx >= 0 && idx < memory.length) {
        setSelectedCell(idx);
        setMemory(prev => prev.map((cell, i) => ({
          ...cell,
          isHighlighted: i === idx,
        })));
      }
    }
  };

  const handleWrite = () => {
    if (selectedCell === null) return;
    const val = parseInt(newValue);
    if (!isNaN(val)) {
      setMemory(prev => prev.map((cell, i) => 
        i === selectedCell ? { ...cell, value: val } : cell
      ));
      setNewValue("");
    }
  };

  const selected = selectedCell !== null ? memory[selectedCell] : null;

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
            background: "linear-gradient(135deg, #FF8800 0%, #00FFFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}
        >
          RAM EXPLORER
        </motion.h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          Explore addressable memory - every byte has a unique address!
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showExplanation ? "1fr 300px" : "1fr", gap: 24 }}>
        <div>
          {/* Search and Controls */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 16,
            padding: 16,
            border: "1px solid #00FFFF22",
            marginBottom: 20,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ color: "#00FFFF", fontSize: 11, display: "block", marginBottom: 6 }}>
                <Search style={{ width: 12, height: 12, display: "inline", marginRight: 4 }} />
                SEARCH ADDRESS
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  placeholder="0x00 or decimal"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #333",
                    background: "#0a0a2e",
                    color: "#00FFFF",
                    fontSize: 13,
                    fontFamily: "monospace",
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "#00FFFF",
                    color: "#000",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  GO
                </motion.button>
              </div>
            </div>

            {selected && (
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ color: "#FF8800", fontSize: 11, display: "block", marginBottom: 6 }}>
                  <Edit3 style={{ width: 12, height: 12, display: "inline", marginRight: 4 }} />
                  WRITE VALUE
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="New value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "1px solid #333",
                      background: "#0a0a2e",
                      color: "#FF8800",
                      fontSize: 13,
                      fontFamily: "monospace",
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWrite}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: "#FF8800",
                      color: "#000",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    WRITE
                  </motion.button>
                </div>
              </div>
            )}
          </div>

          {/* Memory Grid */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 20,
            padding: 20,
            border: "1px solid #FF880044",
            marginBottom: 20,
          }}>
            <h3 style={{ color: "#FF8800", fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Database style={{ width: 18, height: 18 }} />
              MEMORY GRID (256 bytes)
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4 }}>
              {memory.map((cell, i) => (
                <motion.div
                  key={cell.address}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedCell(i)}
                  animate={{
                    boxShadow: selectedCell === i ? "0 0 15px #00FFFF66" : "none",
                  }}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    background: cell.label 
                      ? "linear-gradient(135deg, #00FF8833, #00FF8811)"
                      : selectedCell === i
                        ? "#00FFFF22"
                        : cell.value !== 0 ? "#FF880022" : "#0a0a2e",
                    border: `1px solid ${
                      selectedCell === i ? "#00FFFF" : cell.label ? "#00FF88" : "#333"
                    }`,
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: "#666", fontSize: 8, marginBottom: 2 }}>
                    0x{cell.address.toString(16).padStart(2, "0").toUpperCase()}
                  </div>
                  <div style={{ 
                    color: cell.value !== 0 ? "#fff" : "#444", 
                    fontSize: 11, 
                    fontWeight: 600,
                  }}>
                    {cell.value}
                  </div>
                  {cell.label && (
                    <div style={{ color: "#00FF88", fontSize: 8, marginTop: 2 }}>
                      {cell.label}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Selected Cell Details */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: "linear-gradient(135deg, #00FFFF22, #00FFFF11)",
                borderRadius: 16,
                padding: 20,
                border: "2px solid #00FFFF44",
              }}
            >
              <h3 style={{ color: "#00FFFF", fontSize: 14, marginBottom: 12 }}>SELECTED CELL</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                <div style={{ background: "#0a0a2e", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>ADDRESS</div>
                  <div style={{ color: "#00FFFF", fontSize: 16, fontWeight: 700 }}>
                    0x{selected.address.toString(16).padStart(2, "0").toUpperCase()}
                  </div>
                </div>
                <div style={{ background: "#0a0a2e", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>DECIMAL</div>
                  <div style={{ color: "#FF8800", fontSize: 16, fontWeight: 700 }}>{selected.value}</div>
                </div>
                <div style={{ background: "#0a0a2e", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>HEX VALUE</div>
                  <div style={{ color: "#FF00FF", fontSize: 16, fontWeight: 700 }}>
                    0x{selected.value.toString(16).toUpperCase()}
                  </div>
                </div>
                <div style={{ background: "#0a0a2e", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>BINARY</div>
                  <div style={{ color: "#00FF88", fontSize: 12, fontWeight: 700 }}>
                    {selected.value.toString(2).padStart(8, "0")}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
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
              border: "1px solid #FF880022",
              height: "fit-content",
            }}
          >
            <h3 style={{ color: "#FF8800", fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Info style={{ width: 20, height: 20 }} />
              HOW RAM WORKS
            </h3>

            <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
              RAM is like a giant array of numbered boxes. Each box (byte) has a unique 
              <strong style={{ color: "#00FFFF" }}> address</strong> and stores a 
              <strong style={{ color: "#FF8800" }}> value</strong>.
            </p>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: "#00FF88", fontSize: 13, marginBottom: 8 }}>Addresses</h4>
              <p style={{ color: "#aaa", fontSize: 11, lineHeight: 1.5 }}>
                Addresses are usually shown in hexadecimal (0x00, 0x04, 0x08...). 
                Each int takes 4 bytes, so addresses increment by 4.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: "#FF00FF", fontSize: 13, marginBottom: 8 }}>Variables in Memory</h4>
              <p style={{ color: "#aaa", fontSize: 11, lineHeight: 1.5 }}>
                Green cells show Python variables. <code style={{ color: "#00FF88" }}>x = 42</code> means 
                "store 42 at some address and remember that address as 'x'".
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
                When you create a variable <code style={{ color: "#00FFFF" }}>x = 42</code>, Python:
              </p>
              <ol style={{ color: "#ccc", fontSize: 10, lineHeight: 1.6, paddingLeft: 16, margin: "8px 0 0" }}>
                <li>Finds free memory space</li>
                <li>Stores 42 at that address</li>
                <li>Links name "x" to that address</li>
              </ol>
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

export default RAMExplorer3D;
