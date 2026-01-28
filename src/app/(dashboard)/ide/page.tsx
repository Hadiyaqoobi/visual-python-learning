"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeEditor } from "@/components/ide/CodeEditor";
import { CPUVisualization, CPUState } from "@/components/hardware/CPUVisualization";
import { MemoryVisualization, MemoryState } from "@/components/hardware/MemoryVisualization";
import { VerticalDataFlow } from "@/components/hardware/DataFlowAnimation";
import { ExplanationPanel, ExecutionStep } from "@/components/hardware/ExplanationPanel";
import { Button, Spinner } from "@/components/ui";
import { usePython } from "@/hooks/usePython";
import { 
  parseInstruction, 
  createExecutionPhases, 
  generateAddress, 
  inferType,
} from "@/lib/hardware/execution-orchestrator";
import { Play, RotateCcw, Pause, StepForward, Cpu, Eye, EyeOff, Terminal } from "lucide-react";

const STARTER_CODE = `# 🐍 Welcome to Visual Python!
# Write your code and click Run

x = 5
y = 10
z = x + y

name = "Hadi"
score = 95.5

x = x * 2
total = x + y + z

print(f"Hello {name}!")
print(f"Total: {total}")
`;

export default function IDEPage() {
  const [viewMode, setViewMode] = useState<"simple" | "hardware">("simple");
  const [code, setCode] = useState(STARTER_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(-1);
  const [phases, setPhases] = useState<ExecutionStep[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(2000);
  const [isComplete, setIsComplete] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  
  const [cpuState, setCpuState] = useState<CPUState>({
    isActive: false,
    registers: { PC: "0x0000", IR: "NOP", ACC: "0", R1: "0", R2: "0" },
  });
  const [memoryState, setMemoryState] = useState<MemoryState>({ cells: [] });
  const [currentStep, setCurrentStep] = useState<ExecutionStep | null>(null);
  const [verticalFlowActive, setVerticalFlowActive] = useState(false);
  const [flowColor, setFlowColor] = useState<"blue" | "green" | "purple" | "orange">("blue");
  const [flowValue, setFlowValue] = useState<string>("");
  
  const variablesRef = useRef<Map<string, string>>(new Map());
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const { isLoading: isPythonLoading, isReady: isPythonReady, runCode } = usePython();

  const handleSimpleRun = async () => {
    if (!isPythonReady) return;
    setIsRunning(true);
    setOutput(["▶ Running..."]);
    
    const result = await runCode(code);
    
    if (result.success) {
      const lines = result.output.split("\n").filter(l => l.trim());
      setOutput(lines.length > 0 ? lines : ["✓ Code executed successfully (no output)"]);
    } else {
      setOutput([`❌ Error: ${result.error}`]);
    }
    setIsRunning(false);
  };

  const getExecutableLines = useCallback(() => {
    return code.split("\n")
      .map((line, index) => ({ line, index: index + 1 }))
      .filter(({ line }) => {
        const trimmed = line.trim();
        return trimmed && !trimmed.startsWith("#");
      });
  }, [code]);

  const executePhase = useCallback(() => {
    const executableLines = getExecutableLines();
    
    if (currentLineIndex >= executableLines.length) {
      setIsComplete(true);
      setIsAutoPlaying(false);
      setCpuState(prev => ({ ...prev, isActive: false, activeUnit: null }));
      setVerticalFlowActive(false);
      return;
    }

    const { line, index: lineNumber } = executableLines[currentLineIndex];
    const instruction = parseInstruction(line, lineNumber);
    
    if (currentPhaseIndex === -1 || currentPhaseIndex >= phases.length) {
      const newPhases = createExecutionPhases(instruction, memoryState.cells, variablesRef.current);
      
      if (newPhases.length === 0) {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentPhaseIndex(-1);
        return;
      }
      
      setPhases(newPhases);
      setCurrentPhaseIndex(0);
      return;
    }

    const phase = phases[currentPhaseIndex];
    setCurrentStep(phase);

    switch (phase.phase) {
      case "fetch":
        setCpuState(prev => ({
          ...prev,
          isActive: true,
          activeUnit: "control",
          currentOperation: "FETCH",
          registers: {
            ...prev.registers,
            PC: `0x${(lineNumber * 4).toString(16).padStart(4, "0").toUpperCase()}`,
            IR: instruction.originalCode.trim().slice(0, 15),
          },
        }));
        setFlowColor("blue");
        setVerticalFlowActive(false);
        break;

      case "decode":
        setCpuState(prev => ({ ...prev, activeUnit: "control", currentOperation: "DECODE" }));
        break;

      case "execute":
        if (instruction.type === "operation") {
          let val1 = instruction.operand1 || "0";
          let val2 = instruction.operand2 || "0";
          if (variablesRef.current.has(val1)) val1 = variablesRef.current.get(val1) || val1;
          if (variablesRef.current.has(val2)) val2 = variablesRef.current.get(val2) || val2;
          const num1 = parseFloat(val1) || 0;
          const num2 = parseFloat(val2) || 0;
          let result: number;
          switch (instruction.operator) {
            case "+": result = num1 + num2; break;
            case "-": result = num1 - num2; break;
            case "*": result = num1 * num2; break;
            case "/": result = num2 !== 0 ? num1 / num2 : 0; break;
            default: result = 0;
          }
          setCpuState(prev => ({
            ...prev,
            activeUnit: "alu",
            currentOperation: "EXECUTE",
            aluOperation: { operand1: val1, operand2: val2, operator: instruction.operator, result: String(result) },
            registers: { ...prev.registers, ACC: String(result) },
          }));
          setFlowValue(String(result));
        } else {
          setCpuState(prev => ({
            ...prev,
            activeUnit: "alu",
            currentOperation: "EXECUTE",
            registers: { ...prev.registers, ACC: instruction.value || "0" },
          }));
          setFlowValue(instruction.value || "");
        }
        setFlowColor("green");
        break;

      case "memory":
        setCpuState(prev => ({ ...prev, activeUnit: "registers", currentOperation: "MEMORY" }));
        setVerticalFlowActive(true);
        setFlowColor("purple");
        break;

      case "writeback":
        if (instruction.variable) {
          let finalValue: string;
          if (instruction.type === "operation") {
            let val1 = instruction.operand1 || "0";
            let val2 = instruction.operand2 || "0";
            if (variablesRef.current.has(val1)) val1 = variablesRef.current.get(val1) || val1;
            if (variablesRef.current.has(val2)) val2 = variablesRef.current.get(val2) || val2;
            const num1 = parseFloat(val1) || 0;
            const num2 = parseFloat(val2) || 0;
            let result: number;
            switch (instruction.operator) {
              case "+": result = num1 + num2; break;
              case "-": result = num1 - num2; break;
              case "*": result = num1 * num2; break;
              case "/": result = num2 !== 0 ? num1 / num2 : 0; break;
              default: result = 0;
            }
            finalValue = String(result);
          } else {
            finalValue = instruction.value || "0";
          }
          variablesRef.current.set(instruction.variable, finalValue);
          setMemoryState(prev => {
            const existingIndex = prev.cells.findIndex(c => c.label === instruction.variable);
            const newCells = [...prev.cells];
            if (existingIndex >= 0) {
              newCells[existingIndex] = { ...newCells[existingIndex], value: finalValue, isWriting: true };
            } else {
              newCells.push({
                address: generateAddress(newCells.length),
                value: finalValue,
                label: instruction.variable,
                type: inferType(finalValue),
                isWriting: true,
              });
            }
            return { ...prev, cells: newCells };
          });
          setTimeout(() => {
            setMemoryState(prev => ({
              ...prev,
              cells: prev.cells.map(c => ({ ...c, isWriting: false })),
            }));
          }, 800);
        }
        
        if (instruction.type === "print") {
          const printContent = instruction.originalCode.match(/print\((.+)\)/)?.[1] || "";
          let outputText = printContent;
          
          if (printContent.startsWith('f"') || printContent.startsWith("f'")) {
            outputText = printContent.slice(2, -1);
            variablesRef.current.forEach((value, key) => {
              outputText = outputText.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
            });
          } else if (printContent.startsWith('"') || printContent.startsWith("'")) {
            outputText = printContent.slice(1, -1);
          } else if (variablesRef.current.has(printContent)) {
            outputText = variablesRef.current.get(printContent) || printContent;
          }
          
          setOutput(prev => [...prev, outputText]);
        }
        
        setCpuState(prev => ({ ...prev, activeUnit: null, currentOperation: "WRITEBACK", aluOperation: undefined }));
        setVerticalFlowActive(false);
        break;
    }

    if (currentPhaseIndex < phases.length - 1) {
      setCurrentPhaseIndex(prev => prev + 1);
    } else {
      setCurrentLineIndex(prev => prev + 1);
      setCurrentPhaseIndex(-1);
      setPhases([]);
    }
  }, [currentLineIndex, currentPhaseIndex, phases, memoryState.cells, getExecutableLines]);

  useEffect(() => {
    if (isAutoPlaying && !isComplete) {
      autoPlayRef.current = setTimeout(executePhase, playSpeed);
    }
    return () => { if (autoPlayRef.current) clearTimeout(autoPlayRef.current); };
  }, [isAutoPlaying, isComplete, executePhase, playSpeed, currentPhaseIndex, currentLineIndex]);

  const handleStep = () => { if (!isComplete) executePhase(); };
  const handlePlayPause = () => { setIsAutoPlaying(prev => !prev); };
  
  const handleReset = () => {
    setCurrentLineIndex(0);
    setCurrentPhaseIndex(-1);
    setPhases([]);
    setIsComplete(false);
    setIsAutoPlaying(false);
    setCurrentStep(null);
    setOutput([]);
    setCpuState({ isActive: false, registers: { PC: "0x0000", IR: "NOP", ACC: "0", R1: "0", R2: "0" } });
    setMemoryState({ cells: [] });
    setVerticalFlowActive(false);
    variablesRef.current.clear();
  };

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    handleReset();
  }, []);

  const executableLines = getExecutableLines();
  const currentLine = currentLineIndex >= 0 && currentLineIndex < executableLines.length
    ? executableLines[currentLineIndex] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f8fafc" }}>
      {/* Toolbar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {viewMode === "simple" && (
            <button
              onClick={handleSimpleRun}
              disabled={!isPythonReady || isRunning}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: isPythonReady && !isRunning ? "pointer" : "not-allowed",
                opacity: isPythonReady && !isRunning ? 1 : 0.6,
                boxShadow: "0 2px 8px rgba(34, 197, 94, 0.3)",
              }}
            >
              {isRunning ? <Spinner size="sm" /> : <Play style={{ width: "16px", height: "16px" }} />}
              Run Code
            </button>
          )}

          {viewMode === "hardware" && (
            <>
              <button
                onClick={handleStep}
                disabled={!isPythonReady || isComplete}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: isPythonReady && !isComplete ? "pointer" : "not-allowed",
                  opacity: isPythonReady && !isComplete ? 1 : 0.6,
                  boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                }}
              >
                <StepForward style={{ width: "16px", height: "16px" }} />
                Step
              </button>
              <button
                onClick={handlePlayPause}
                disabled={!isPythonReady || isComplete}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  border: "none",
                  background: isAutoPlaying 
                    ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                    : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: isPythonReady && !isComplete ? "pointer" : "not-allowed",
                  opacity: isPythonReady && !isComplete ? 1 : 0.6,
                  boxShadow: isAutoPlaying 
                    ? "0 2px 8px rgba(245, 158, 11, 0.3)"
                    : "0 2px 8px rgba(34, 197, 94, 0.3)",
                }}
              >
                {isAutoPlaying ? <Pause style={{ width: "16px", height: "16px" }} /> : <Play style={{ width: "16px", height: "16px" }} />}
                {isAutoPlaying ? "Pause" : "Auto Play"}
              </button>
              
              <select
                value={playSpeed}
                onChange={(e) => setPlaySpeed(Number(e.target.value))}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  color: "#334155",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                <option value={3000}>🐢 Slow</option>
                <option value={2000}>🚶 Normal</option>
                <option value={1000}>🏃 Fast</option>
              </select>
            </>
          )}

          <button
            onClick={handleReset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              color: "#64748b",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            <RotateCcw style={{ width: "16px", height: "16px" }} />
            Reset
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => { setViewMode(viewMode === "simple" ? "hardware" : "simple"); handleReset(); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "10px",
              border: viewMode === "hardware" ? "2px solid #6366f1" : "1px solid #e2e8f0",
              background: viewMode === "hardware" ? "#eef2ff" : "#ffffff",
              color: viewMode === "hardware" ? "#4f46e5" : "#64748b",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {viewMode === "hardware" ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Cpu style={{ width: "16px", height: "16px" }} />}
            {viewMode === "hardware" ? "Simple Mode" : "Hardware Mode"}
          </button>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            borderRadius: "20px",
            background: isComplete ? "#dcfce7" : cpuState.isActive ? "#dbeafe" : "#f1f5f9",
            color: isComplete ? "#15803d" : cpuState.isActive ? "#1d4ed8" : "#64748b",
            fontSize: "12px",
            fontWeight: "600",
          }}>
            <span style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: isComplete ? "#22c55e" : cpuState.isActive ? "#3b82f6" : "#94a3b8",
            }} />
            {isComplete ? "✓ Complete" : cpuState.isActive ? "Running..." : "Ready"}
          </div>
        </div>
      </div>

      {isPythonLoading && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 20px",
          background: "#eff6ff",
          borderBottom: "1px solid #bfdbfe",
        }}>
          <Spinner size="sm" />
          <span style={{ color: "#1d4ed8", fontSize: "13px", fontWeight: "500" }}>Loading Python environment...</span>
        </div>
      )}

      {/* Main Content */}
      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        {/* Code Editor */}
        <div style={{
          width: viewMode === "simple" ? "50%" : "320px",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #e2e8f0",
          background: "#1e293b",
          transition: "width 0.3s ease",
        }}>
          <div style={{
            padding: "12px 20px",
            background: "#0f172a",
            borderBottom: "1px solid #334155",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <span style={{ fontSize: "16px" }}>📝</span>
            <span style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: "600" }}>Code Editor</span>
          </div>
          <div style={{ flex: 1 }}>
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              height="100%"
              language="python"
              fontSize={14}
              minimap={false}
            />
          </div>
        </div>

        {/* Simple Mode: Output Panel */}
        {viewMode === "simple" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#ffffff" }}>
            <div style={{
              padding: "12px 20px",
              background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
              <Terminal style={{ width: "18px", height: "18px", color: "#22c55e" }} />
              <span style={{ fontSize: "13px", color: "#334155", fontWeight: "600" }}>Output</span>
            </div>
            <div style={{
              flex: 1,
              padding: "20px",
              fontFamily: "monospace",
              fontSize: "14px",
              overflow: "auto",
              background: "#0f172a",
            }}>
              {output.length === 0 ? (
                <div style={{ color: "#64748b", lineHeight: "1.8" }}>
                  <p>👋 Click <strong style={{ color: "#22c55e" }}>Run Code</strong> to execute your Python code</p>
                  <p style={{ marginTop: "12px", fontSize: "13px" }}>
                    💡 Try <strong style={{ color: "#818cf8" }}>Hardware Mode</strong> to visualize how code executes through CPU & Memory
                  </p>
                </div>
              ) : (
                output.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      color: line.startsWith("❌") ? "#f87171" : line.startsWith("▶") ? "#60a5fa" : "#4ade80",
                      marginBottom: "6px",
                      fontSize: "14px",
                    }}
                  >
                    {line}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Hardware Mode */}
        <AnimatePresence>
          {viewMode === "hardware" && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#f1f5f9" }}
              >
                <div style={{
                  padding: "12px 20px",
                  background: "#ffffff",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Cpu style={{ width: "18px", height: "18px", color: "#6366f1" }} />
                    <span style={{ fontSize: "13px", color: "#334155", fontWeight: "600" }}>Hardware Visualization</span>
                  </div>
                  {currentLine && (
                    <span style={{
                      fontSize: "12px",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      background: "#eef2ff",
                      color: "#4f46e5",
                      fontWeight: "600",
                    }}>
                      Line {currentLine.index}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, overflow: "auto", padding: "20px" }}>
                  <CPUVisualization state={cpuState} />
                  <VerticalDataFlow isActive={verticalFlowActive} value={flowValue} color={flowColor} />
                  <MemoryVisualization state={memoryState} />
                  
                  {output.length > 0 && (
                    <div style={{
                      marginTop: "20px",
                      background: "#ffffff",
                      borderRadius: "16px",
                      border: "2px solid #e2e8f0",
                      padding: "16px",
                    }}>
                      <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "10px", fontWeight: "600", letterSpacing: "0.5px" }}>
                        📤 CONSOLE OUTPUT
                      </div>
                      {output.map((line, i) => (
                        <div key={i} style={{ color: "#059669", fontFamily: "monospace", fontSize: "14px", fontWeight: "600" }}>
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  width: "320px",
                  display: "flex",
                  flexDirection: "column",
                  borderLeft: "1px solid #e2e8f0",
                  background: "#ffffff",
                }}
              >
                <div style={{
                  padding: "12px 20px",
                  background: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}>
                  <span style={{ fontSize: "16px" }}>💡</span>
                  <span style={{ fontSize: "13px", color: "#334155", fontWeight: "600" }}>Explanation</span>
                </div>
                <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
                  <ExplanationPanel
                    step={currentStep}
                    currentLine={currentLine?.index}
                    currentCode={currentLine?.line}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
