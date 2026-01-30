"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Info, Clock, Cpu } from "lucide-react";

interface Process {
  id: number;
  name: string;
  color: string;
  state: "running" | "ready" | "blocked" | "completed";
  progress: number;
  totalTime: number;
}

export function OSScheduler3D() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 1, name: "Python.exe", color: "#00FFFF", state: "ready", progress: 0, totalTime: 100 },
    { id: 2, name: "Chrome.exe", color: "#FF00FF", state: "ready", progress: 0, totalTime: 80 },
    { id: 3, name: "VSCode.exe", color: "#00FF88", state: "ready", progress: 0, totalTime: 120 },
    { id: 4, name: "Spotify.exe", color: "#FF8800", state: "ready", progress: 0, totalTime: 60 },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentProcess, setCurrentProcess] = useState<number | null>(null);
  const [timeQuantum] = useState(20);
  const [showExplanation, setShowExplanation] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTick(t => t + 1);
      
      setProcesses(prev => {
        const ready = prev.filter(p => p.state === "ready" || p.state === "running");
        if (ready.length === 0) {
          setIsRunning(false);
          return prev;
        }

        // Round-robin scheduling
        let running = prev.find(p => p.state === "running");
        
        if (!running) {
          // Pick first ready process
          const firstReady = prev.find(p => p.state === "ready");
          if (firstReady) {
            setCurrentProcess(firstReady.id);
            return prev.map(p => 
              p.id === firstReady.id ? { ...p, state: "running" as const } : p
            );
          }
        } else {
          // Increment progress
          const newProgress = running.progress + 5;
          
          if (newProgress >= running.totalTime) {
            // Process completed
            setCurrentProcess(null);
            const updated = prev.map(p => 
              p.id === running!.id ? { ...p, state: "completed" as const, progress: p.totalTime } : p
            );
            // Start next ready process
            const nextReady = updated.find(p => p.state === "ready");
            if (nextReady) {
              setCurrentProcess(nextReady.id);
              return updated.map(p => 
                p.id === nextReady.id ? { ...p, state: "running" as const } : p
              );
            }
            return updated;
          } else if (newProgress % timeQuantum === 0 && newProgress < running.totalTime) {
            // Time slice expired - context switch
            const updated = prev.map(p => 
              p.id === running!.id ? { ...p, state: "ready" as const, progress: newProgress } : p
            );
            // Round-robin: find next ready after current
            const currentIdx = updated.findIndex(p => p.id === running!.id);
            const readyAfter = updated.slice(currentIdx + 1).find(p => p.state === "ready");
            const readyBefore = updated.slice(0, currentIdx).find(p => p.state === "ready");
            const nextReady = readyAfter || readyBefore;
            
            if (nextReady) {
              setCurrentProcess(nextReady.id);
              return updated.map(p => 
                p.id === nextReady.id ? { ...p, state: "running" as const } : p
              );
            }
            return updated;
          } else {
            return prev.map(p => 
              p.id === running!.id ? { ...p, progress: newProgress } : p
            );
          }
        }
        return prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isRunning, timeQuantum]);

  const reset = () => {
    setIsRunning(false);
    setCurrentProcess(null);
    setTick(0);
    setProcesses([
      { id: 1, name: "Python.exe", color: "#00FFFF", state: "ready", progress: 0, totalTime: 100 },
      { id: 2, name: "Chrome.exe", color: "#FF00FF", state: "ready", progress: 0, totalTime: 80 },
      { id: 3, name: "VSCode.exe", color: "#00FF88", state: "ready", progress: 0, totalTime: 120 },
      { id: 4, name: "Spotify.exe", color: "#FF8800", state: "ready", progress: 0, totalTime: 60 },
    ]);
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
            background: "linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}
        >
          OS PROCESS SCHEDULER
        </motion.h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          Watch how the OS shares CPU time between processes
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
        <div style={{
          padding: "10px 20px",
          background: "rgba(0, 255, 255, 0.1)",
          border: "1px solid #00FFFF44",
          borderRadius: 12,
        }}>
          <span style={{ color: "#888", fontSize: 11 }}>TIME QUANTUM: </span>
          <span style={{ color: "#00FFFF", fontWeight: 700, fontSize: 16 }}>{timeQuantum}ms</span>
        </div>
        <div style={{
          padding: "10px 20px",
          background: "rgba(255, 0, 255, 0.1)",
          border: "1px solid #FF00FF44",
          borderRadius: 12,
        }}>
          <span style={{ color: "#888", fontSize: 11 }}>TICK: </span>
          <span style={{ color: "#FF00FF", fontWeight: 700, fontSize: 16 }}>{tick}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showExplanation ? "1fr 280px" : "1fr", gap: 24 }}>
        <div>
          {/* CPU Display */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 16,
            padding: 20,
            border: "1px solid #00FFFF44",
            marginBottom: 20,
            textAlign: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
              <Cpu style={{ width: 20, height: 20, color: "#00FFFF" }} />
              <h3 style={{ color: "#00FFFF", fontSize: 14, margin: 0 }}>CPU</h3>
            </div>
            
            <motion.div
              animate={{
                boxShadow: currentProcess ? `0 0 30px ${processes.find(p => p.id === currentProcess)?.color}66` : "none",
              }}
              style={{
                padding: 20,
                borderRadius: 12,
                background: currentProcess 
                  ? `linear-gradient(135deg, ${processes.find(p => p.id === currentProcess)?.color}44, ${processes.find(p => p.id === currentProcess)?.color}22)`
                  : "#1a1a3e",
                border: `2px solid ${currentProcess ? processes.find(p => p.id === currentProcess)?.color : "#333"}`,
              }}
            >
              {currentProcess ? (
                <div style={{ color: processes.find(p => p.id === currentProcess)?.color, fontWeight: 700, fontSize: 18 }}>
                  {processes.find(p => p.id === currentProcess)?.name}
                </div>
              ) : (
                <div style={{ color: "#666" }}>IDLE</div>
              )}
            </motion.div>
          </div>

          {/* Process Queue */}
          <div style={{
            background: "rgba(0, 20, 40, 0.6)",
            borderRadius: 20,
            padding: 20,
            border: "1px solid #FF00FF44",
            marginBottom: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Clock style={{ width: 18, height: 18, color: "#FF00FF" }} />
              <h3 style={{ color: "#FF00FF", fontSize: 14, margin: 0 }}>PROCESS QUEUE</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {processes.map((proc) => (
                <motion.div
                  key={proc.id}
                  animate={{
                    scale: proc.state === "running" ? 1.02 : 1,
                    boxShadow: proc.state === "running" ? `0 0 15px ${proc.color}44` : "none",
                  }}
                  style={{
                    background: proc.state === "completed" 
                      ? "#1a1a3e" 
                      : `linear-gradient(135deg, ${proc.color}22, ${proc.color}11)`,
                    border: `2px solid ${proc.state === "completed" ? "#333" : proc.color}`,
                    borderRadius: 10,
                    padding: 14,
                    opacity: proc.state === "completed" ? 0.5 : 1,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ color: proc.color, fontWeight: 700, fontSize: 13 }}>{proc.name}</span>
                    <span style={{ 
                      color: proc.state === "running" ? "#00FF88" : proc.state === "completed" ? "#666" : "#FF8800",
                      fontSize: 10,
                      padding: "3px 8px",
                      background: proc.state === "running" ? "#00FF8822" : "transparent",
                      borderRadius: 4,
                      fontWeight: 600,
                    }}>
                      {proc.state.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div style={{ background: "#0a0a2e", borderRadius: 4, height: 8, overflow: "hidden" }}>
                    <motion.div
                      animate={{ width: `${(proc.progress / proc.totalTime) * 100}%` }}
                      style={{
                        height: "100%",
                        background: `linear-gradient(90deg, ${proc.color}, ${proc.color}88)`,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <div style={{ color: "#666", fontSize: 10, marginTop: 4 }}>
                    {proc.progress}/{proc.totalTime}ms
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRunning(!isRunning)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 12,
                border: "none",
                background: isRunning 
                  ? "linear-gradient(135deg, #FF8800, #FF4400)"
                  : "linear-gradient(135deg, #00FF88, #00AA66)",
                color: "#000",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {isRunning ? <Pause style={{ width: 18, height: 18 }} /> : <Play style={{ width: 18, height: 18 }} />}
              {isRunning ? "PAUSE" : "START"}
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
              ROUND-ROBIN SCHEDULING
            </h3>

            <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
              The OS gives each process a <strong style={{ color: "#00FFFF" }}>time slice</strong> (quantum). 
              When it expires, the CPU switches to the next process.
            </p>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: "#FF00FF", fontSize: 13, marginBottom: 8 }}>Context Switch</h4>
              <p style={{ color: "#aaa", fontSize: 11, lineHeight: 1.5 }}>
                When switching processes, the OS saves/restores all registers and state. 
                This has overhead but enables multitasking!
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: "#00FF88", fontSize: 13, marginBottom: 8 }}>Process States</h4>
              <ul style={{ color: "#aaa", fontSize: 11, lineHeight: 1.8, paddingLeft: 16, margin: 0 }}>
                <li><span style={{ color: "#00FF88" }}>Running</span> - On CPU</li>
                <li><span style={{ color: "#FF8800" }}>Ready</span> - Waiting for CPU</li>
                <li><span style={{ color: "#666" }}>Completed</span> - Done</li>
              </ul>
            </div>

            <div style={{
              padding: 12,
              background: "linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 170, 255, 0.1))",
              borderRadius: 12,
              borderLeft: "3px solid #00FF88",
            }}>
              <h4 style={{ color: "#00FF88", fontSize: 11, marginBottom: 6 }}>Python Connection</h4>
              <p style={{ color: "#ccc", fontSize: 10, lineHeight: 1.5 }}>
                Python threads share time via the OS scheduler. The GIL also adds Python-level scheduling 
                for threads within one process!
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

export default OSScheduler3D;
