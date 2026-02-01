"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { CodeEditor } from "@/components/ide/CodeEditor";
import { CPUVisualization, CPUState } from "@/components/hardware/CPUVisualization";
import { MemoryVisualization, MemoryState } from "@/components/hardware/MemoryVisualization";
import { VerticalDataFlow } from "@/components/hardware/DataFlowAnimation";
import { ExplanationPanel, ExecutionStep } from "@/components/hardware/ExplanationPanel";
import { Spinner } from "@/components/ui";
import { usePython } from "@/hooks/usePython";
import { parseInstruction, createExecutionPhases, generateAddress, inferType } from "@/lib/hardware/execution-orchestrator";
import { 
  Play, RotateCcw, Pause, StepForward, Cpu, Terminal, Sparkles,
  ChevronLeft, ChevronRight, Lightbulb, Target, BookOpen,
  Eye, EyeOff, CheckCircle, X
} from "lucide-react";

const SimpleOutput = dynamic(() => import("@/components/ide/SimpleOutput").then(m => m.SimpleOutput), { ssr: false });

const HardwareModeClean = dynamic(
  () => import("@/components/hardware-mode/HardwareModeClean").then(m => m.HardwareModeClean),
  { ssr: false, loading: () => <div style={{ width: '100%', height: '100%', background: '#0A0A1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner size="lg" /></div> }
);

const DEFAULT_CODE = `# Welcome to Visual Python!
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

interface ExecutionEvent3D {
  type: 'ASSIGNMENT' | 'ARITHMETIC' | 'COMPARISON' | 'FUNCTION_CALL' | 'LOOP' | 'MEMORY_READ' | 'MEMORY_WRITE' | 'PRINT';
  line: number; code: string; variable?: string; value?: string; operator?: string; operand1?: string; operand2?: string;
}

interface Exercise {
  id: string;
  number: number;
  title: string;
  prompt: string;
  starterCode: string | null;
  solution: string | null;
  hints: string[];
  xpReward: number;
  type: string;
  difficulty: string;
}

interface LessonData {
  slug: string;
  title: string;
  exercises: Exercise[];
  codeExamples?: { code: string }[];
}

function IDEPageContent() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"simple" | "hardware" | "hardware3d">("simple");
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(-1);
  const [phases, setPhases] = useState<ExecutionStep[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(2000);
  const [isComplete, setIsComplete] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [execution3DEvents, setExecution3DEvents] = useState<ExecutionEvent3D[]>([]);
  const [simpleVariables, setSimpleVariables] = useState<{name: string; value: string; type: string}[]>([]);
  const [simpleExecutionTime, setSimpleExecutionTime] = useState<number | null>(null);
  const [simpleError, setSimpleError] = useState<string | null>(null);
  const [cpuState, setCpuState] = useState<CPUState>({ isActive: false, registers: { PC: "0x0000", IR: "NOP", ACC: "0", R1: "0", R2: "0" } });
  const [memoryState, setMemoryState] = useState<MemoryState>({ cells: [] });
  const [currentStep, setCurrentStep] = useState<ExecutionStep | null>(null);
  const [verticalFlowActive, setVerticalFlowActive] = useState(false);
  const [flowColor, setFlowColor] = useState<"blue" | "green" | "purple" | "orange">("blue");
  const [flowValue, setFlowValue] = useState<string>("");
  
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(-1);
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  
  const variablesRef = useRef<Map<string, string>>(new Map());
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const { isLoading: isPythonLoading, isReady: isPythonReady, runCode } = usePython();
  const searchParams = useSearchParams();

  useEffect(() => {
    const exerciseId = searchParams.get('exercise');
    const lessonSlug = searchParams.get('lesson');
    
    if (lessonSlug) {
      fetch(`/api/curriculum/lessons/${lessonSlug}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setLessonData(data);
            if (exerciseId && data.exercises) {
              const exerciseIndex = data.exercises.findIndex((e: Exercise) => e.id === exerciseId);
              if (exerciseIndex !== -1) {
                const exercise = data.exercises[exerciseIndex];
                setCurrentExercise(exercise);
                setCurrentExerciseIndex(exerciseIndex);
                if (exercise.starterCode) setCode(exercise.starterCode);
                setRevealedHints([]);
                setShowSolution(false);
                setShowHints(false);
              }
            } else if (data.codeExamples?.[0]?.code) {
              setCode(data.codeExamples[0].code);
            }
          }
        }).catch(console.error);
    } else {
      setLessonData(null);
      setCurrentExercise(null);
      setCurrentExerciseIndex(-1);
    }
  }, [searchParams]);

  const exitExercise = () => {
    setLessonData(null);
    setCurrentExercise(null);
    setCurrentExerciseIndex(-1);
    setCode(DEFAULT_CODE);
    router.push('/ide');
  };

  const handleSimpleRun = async () => {
    if (!isPythonReady) return;
    setIsRunning(true); setOutput([]); setSimpleVariables([]); setSimpleError(null); setSimpleExecutionTime(null);
    const result = await runCode(code);
    if (result.success) {
      const lines = result.output.split("\n").filter(l => l.trim());
      setOutput(lines.length > 0 ? lines : ["Code executed successfully (no output)"]);
      setSimpleExecutionTime(result.executionTime);
      if (result.variables) setSimpleVariables(result.variables);
    } else {
      setOutput([`Error: ${result.error}`]); setSimpleError(result.error || "Unknown error"); setSimpleExecutionTime(result.executionTime);
    }
    setIsRunning(false);
  };

  const getExecutableLines = useCallback(() => {
    const lines = code.split('\n');
    return lines.map((line, index) => ({ line: line.trim(), index: index + 1 })).filter(({ line }) => line && !line.startsWith('#') && !line.startsWith('"""') && !line.startsWith("'''"));
  }, [code]);

  const add3DEvent = useCallback((event: ExecutionEvent3D) => { setExecution3DEvents(prev => [...prev, event]); }, []);

  const executePhase = useCallback(() => {
    const executableLines = getExecutableLines();
    if (currentLineIndex >= executableLines.length) { setIsComplete(true); setIsAutoPlaying(false); return; }
    const lineInfo = executableLines[currentLineIndex];
    if (currentPhaseIndex === -1) {
      const instruction = parseInstruction(lineInfo.line);
      const newPhases = createExecutionPhases(instruction, lineInfo.index);
      setPhases(newPhases);
      setCpuState(prev => ({ ...prev, isActive: true, registers: { ...prev.registers, PC: `0x${(lineInfo.index * 4).toString(16).padStart(4, "0")}`, IR: lineInfo.line.substring(0, 20) } }));
      setCurrentPhaseIndex(0);
      return;
    }
    const phase = phases[currentPhaseIndex];
    if (!phase) return;
    setCurrentStep(phase);
    switch (phase.phase) {
      case "FETCH":
        setCpuState(prev => ({ ...prev, activeUnit: "fetch", currentOperation: "FETCH" }));
        setVerticalFlowActive(true); setFlowColor("blue"); setFlowValue(lineInfo.line); break;
      case "DECODE":
        setCpuState(prev => ({ ...prev, activeUnit: "decode", currentOperation: "DECODE" }));
        setVerticalFlowActive(true); setFlowColor("purple"); setFlowValue("Analyzing..."); break;
      case "EXECUTE":
        setCpuState(prev => ({ ...prev, activeUnit: "alu", currentOperation: "EXECUTE", aluOperation: phase.details.split(":")[0] }));
        setVerticalFlowActive(true); setFlowColor("orange"); setFlowValue("Computing...");
        const parsedInstruction = parseInstruction(lineInfo.line);
        if (parsedInstruction.type === "ASSIGNMENT" || parsedInstruction.type === "ARITHMETIC") {
          add3DEvent({ type: parsedInstruction.type, line: lineInfo.index, code: lineInfo.line, variable: parsedInstruction.variable, value: parsedInstruction.value, operator: parsedInstruction.operator, operand1: parsedInstruction.operand1, operand2: parsedInstruction.operand2 });
        } else if (parsedInstruction.type === "PRINT") {
          add3DEvent({ type: 'PRINT', line: lineInfo.index, code: lineInfo.line, value: parsedInstruction.value });
        }
        break;
      case "MEMORY":
        setCpuState(prev => ({ ...prev, activeUnit: "memory", currentOperation: "MEMORY" }));
        setVerticalFlowActive(true); setFlowColor("green");
        const memInstruction = parseInstruction(lineInfo.line);
        if (memInstruction.variable) {
          const address = generateAddress(memInstruction.variable);
          let value = memInstruction.value || "";
          if (memInstruction.type === "ARITHMETIC" && memInstruction.operand1 && memInstruction.operator && memInstruction.operand2) {
            const op1 = variablesRef.current.get(memInstruction.operand1) || memInstruction.operand1;
            const op2 = variablesRef.current.get(memInstruction.operand2) || memInstruction.operand2;
            const num1 = parseFloat(op1); const num2 = parseFloat(op2);
            if (!isNaN(num1) && !isNaN(num2)) {
              switch (memInstruction.operator) {
                case "+": value = String(num1 + num2); break;
                case "-": value = String(num1 - num2); break;
                case "*": value = String(num1 * num2); break;
                case "/": value = String(num1 / num2); break;
                default: value = `${op1} ${memInstruction.operator} ${op2}`;
              }
            }
          } else if (variablesRef.current.has(value)) { value = variablesRef.current.get(value) || value; }
          variablesRef.current.set(memInstruction.variable, value);
          setFlowValue(`${memInstruction.variable} = ${value}`);
          const type = inferType(value);
          const existingIndex = memoryState.cells.findIndex(c => c.name === memInstruction.variable);
          if (existingIndex >= 0) { setMemoryState(prev => { const newCells = [...prev.cells]; newCells[existingIndex] = { ...newCells[existingIndex], value, isActive: true }; return { cells: newCells }; }); }
          else { setMemoryState(prev => ({ cells: [...prev.cells, { address, name: memInstruction.variable, value, type, isActive: true }] })); }
          setTimeout(() => { setMemoryState(prev => ({ cells: prev.cells.map(c => ({ ...c, isActive: false })) })); }, 500);
          add3DEvent({ type: 'MEMORY_WRITE', line: lineInfo.index, code: lineInfo.line, variable: memInstruction.variable, value });
        }
        break;
      case "WRITEBACK":
        const wbInstruction = parseInstruction(lineInfo.line);
        if (wbInstruction.type === "PRINT") {
          let outputText = wbInstruction.value || "";
          const fStringMatch = outputText.match(/f['"](.*)['"]/);
          if (fStringMatch) { let template = fStringMatch[1]; variablesRef.current.forEach((val, key) => { template = template.replace(new RegExp(`\\{${key}\\}`, 'g'), val); }); outputText = template; }
          else if (variablesRef.current.has(outputText)) outputText = variablesRef.current.get(outputText) || outputText;
          setOutput(prev => [...prev, outputText]);
        }
        setCpuState(prev => ({ ...prev, activeUnit: null, currentOperation: "WRITEBACK", aluOperation: undefined })); setVerticalFlowActive(false); break;
    }
    if (currentPhaseIndex < phases.length - 1) setCurrentPhaseIndex(prev => prev + 1);
    else { setCurrentLineIndex(prev => prev + 1); setCurrentPhaseIndex(-1); setPhases([]); }
  }, [currentLineIndex, currentPhaseIndex, phases, memoryState.cells, getExecutableLines, add3DEvent]);

  useEffect(() => { if (isAutoPlaying && !isComplete) autoPlayRef.current = setTimeout(executePhase, playSpeed); return () => { if (autoPlayRef.current) clearTimeout(autoPlayRef.current); }; }, [isAutoPlaying, isComplete, executePhase, playSpeed, currentPhaseIndex, currentLineIndex]);
  const handleStep = () => { if (!isComplete) executePhase(); };
  const handlePlayPause = () => setIsAutoPlaying(prev => !prev);
  const handleReset = useCallback(() => { setCurrentLineIndex(0); setCurrentPhaseIndex(-1); setPhases([]); setIsComplete(false); setIsAutoPlaying(false); setCurrentStep(null); setOutput([]); setCpuState({ isActive: false, registers: { PC: "0x0000", IR: "NOP", ACC: "0", R1: "0", R2: "0" } }); setMemoryState({ cells: [] }); setVerticalFlowActive(false); setExecution3DEvents([]); setIsRunning(false); variablesRef.current.clear(); setSimpleVariables([]); setSimpleExecutionTime(null); setSimpleError(null); }, []);
  const handleCodeChange = useCallback((newCode: string) => { setCode(newCode); handleReset(); }, [handleReset]);
  const executableLines = getExecutableLines();
  const currentLine = currentLineIndex >= 0 && currentLineIndex < executableLines.length ? executableLines[currentLineIndex] : null;
  const isHardwareMode = viewMode === "hardware" || viewMode === "hardware3d";

  const revealHint = (index: number) => {
    if (!revealedHints.includes(index)) setRevealedHints([...revealedHints, index]);
  };

  const prevExercise = lessonData && currentExerciseIndex > 0 ? lessonData.exercises[currentExerciseIndex - 1] : null;
  const nextExercise = lessonData && currentExerciseIndex < lessonData.exercises.length - 1 ? lessonData.exercises[currentExerciseIndex + 1] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: viewMode === "hardware3d" ? "#0A0A1E" : "#f8fafc" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", background: viewMode === "hardware3d" ? "#0f0f1a" : "#ffffff", borderBottom: viewMode === "hardware3d" ? "1px solid #1a1a2e" : "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {currentExercise && lessonData && (
            <Link href={prevExercise ? `/ide?exercise=${prevExercise.id}&lesson=${lessonData.slug}` : '#'} style={{ textDecoration: "none", pointerEvents: prevExercise ? 'auto' : 'none' }}>
              <button disabled={!prevExercise} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #e2e8f0", background: prevExercise ? "white" : "#f8fafc", color: prevExercise ? "#64748b" : "#cbd5e1", cursor: prevExercise ? "pointer" : "not-allowed" }}>
                <ChevronLeft style={{ width: "16px", height: "16px" }} />
              </button>
            </Link>
          )}
          
          {viewMode === "simple" && <button onClick={handleSimpleRun} disabled={!isPythonReady || isRunning} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", color: "white", fontSize: "13px", fontWeight: "600", cursor: isPythonReady && !isRunning ? "pointer" : "not-allowed", opacity: isPythonReady && !isRunning ? 1 : 0.6 }}>{isRunning ? <Spinner size="sm" /> : <Play style={{ width: "14px", height: "14px" }} />}Run</button>}
          {isHardwareMode && (<><button onClick={handleStep} disabled={!isPythonReady || isComplete} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", border: "none", background: viewMode === "hardware3d" ? "linear-gradient(135deg, #00AAFF 0%, #0066FF 100%)" : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "white", fontSize: "13px", fontWeight: "600", cursor: isPythonReady && !isComplete ? "pointer" : "not-allowed", opacity: isPythonReady && !isComplete ? 1 : 0.6 }}><StepForward style={{ width: "14px", height: "14px" }} />Step</button><button onClick={handlePlayPause} disabled={!isPythonReady || isComplete} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", border: "none", background: isAutoPlaying ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", color: "white", fontSize: "13px", fontWeight: "600", cursor: isPythonReady && !isComplete ? "pointer" : "not-allowed", opacity: isPythonReady && !isComplete ? 1 : 0.6 }}>{isAutoPlaying ? <Pause style={{ width: "14px", height: "14px" }} /> : <Play style={{ width: "14px", height: "14px" }} />}{isAutoPlaying ? "Pause" : "Play"}</button></>)}
          <button onClick={handleReset} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", border: viewMode === "hardware3d" ? "1px solid #333" : "1px solid #e2e8f0", background: viewMode === "hardware3d" ? "#1a1a2e" : "#ffffff", color: viewMode === "hardware3d" ? "#888" : "#64748b", cursor: "pointer" }}><RotateCcw style={{ width: "14px", height: "14px" }} /></button>
          
          {currentExercise && lessonData && (
            nextExercise ? (
              <Link href={`/ide?exercise=${nextExercise.id}&lesson=${lessonData.slug}`} style={{ textDecoration: "none" }}>
                <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", color: "white", cursor: "pointer" }}>
                  <ChevronRight style={{ width: "16px", height: "16px" }} />
                </button>
              </Link>
            ) : (
              <Link href={`/learn/${lessonData.slug}`} style={{ textDecoration: "none" }}>
                <button style={{ display: "flex", alignItems: "center", gap: "4px", padding: "8px 12px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color: "white", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                  <CheckCircle style={{ width: "14px", height: "14px" }} />Done
                </button>
              </Link>
            )
          )}
        </div>

        {/* Center: Exercise info */}
        {currentExercise && lessonData ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: "700" }}>
              {currentExercise.number}
            </div>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>{currentExercise.title}</span>
            <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: "#dcfce7", color: "#15803d", fontWeight: "600" }}>+{currentExercise.xpReward} XP</span>
          </div>
        ) : (
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>Python IDE</span>
        )}

        {/* Right: Lesson link, Exit, Mode toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {currentExercise && lessonData && (
            <>
              <Link href={`/learn/${lessonData.slug}`} style={{ textDecoration: "none" }}>
                <button style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "white", color: "#64748b", fontSize: "12px", cursor: "pointer" }}>
                  <BookOpen style={{ width: "12px", height: "12px" }} />Lesson
                </button>
              </Link>
              <button onClick={exitExercise} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "6px", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer" }} title="Exit exercise">
                <X style={{ width: "14px", height: "14px" }} />
              </button>
            </>
          )}
          <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", border: viewMode === "hardware3d" ? "1px solid #333" : "1px solid #e2e8f0" }}>
            <button onClick={() => { setViewMode("simple"); handleReset(); }} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 10px", border: "none", background: viewMode === "simple" ? "#3b82f6" : (viewMode === "hardware3d" ? "#1a1a2e" : "#fff"), color: viewMode === "simple" ? "#fff" : (viewMode === "hardware3d" ? "#666" : "#64748b"), fontSize: "11px", fontWeight: "600", cursor: "pointer" }}><Terminal style={{ width: "12px", height: "12px" }} />Simple</button>
            <button onClick={() => { setViewMode("hardware"); handleReset(); }} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 10px", border: "none", borderLeft: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", background: viewMode === "hardware" ? "#6366f1" : (viewMode === "hardware3d" ? "#1a1a2e" : "#fff"), color: viewMode === "hardware" ? "#fff" : (viewMode === "hardware3d" ? "#666" : "#64748b"), fontSize: "11px", fontWeight: "600", cursor: "pointer" }}><Cpu style={{ width: "12px", height: "12px" }} />2D</button>
            <button onClick={() => { setViewMode("hardware3d"); handleReset(); }} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 10px", border: "none", background: viewMode === "hardware3d" ? "linear-gradient(135deg, #00AAFF, #FF00FF)" : "#fff", color: viewMode === "hardware3d" ? "#fff" : "#64748b", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}><Sparkles style={{ width: "12px", height: "12px" }} />3D</button>
          </div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: isComplete ? "#22c55e" : cpuState.isActive ? "#3b82f6" : "#94a3b8" }} />
        </div>
      </div>

      {isPythonLoading && <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "#eff6ff", borderBottom: "1px solid #bfdbfe" }}><Spinner size="sm" /><span style={{ color: "#1d4ed8", fontSize: "12px" }}>Loading Python...</span></div>}
      
      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        {/* Code Editor Column */}
        <div style={{ width: viewMode === "simple" ? "50%" : "320px", display: "flex", flexDirection: "column", borderRight: viewMode === "hardware3d" ? "1px solid #1a1a2e" : "1px solid #e2e8f0", background: "#1e293b", transition: "width 0.3s ease" }}>
          
          {/* Exercise Instructions - Always visible when in exercise */}
          {currentExercise && (
            <div style={{ background: "#0f172a", borderBottom: "1px solid #334155" }}>
              {/* Task */}
              <div style={{ padding: "10px 14px", borderBottom: "1px solid #334155" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <Target style={{ width: "12px", height: "12px", color: "#6366f1" }} />
                  <span style={{ fontSize: "10px", fontWeight: "700", color: "#6366f1", letterSpacing: "0.5px" }}>TASK</span>
                </div>
                <p style={{ fontSize: "13px", color: "#e2e8f0", lineHeight: "1.5", margin: 0 }}>{currentExercise.prompt}</p>
              </div>
              
              {/* Hints toggle */}
              {currentExercise.hints && currentExercise.hints.length > 0 && (
                <div style={{ padding: "8px 14px", borderBottom: showHints ? "1px solid #334155" : "none" }}>
                  <button 
                    onClick={() => setShowHints(!showHints)}
                    style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: "600", color: "#fbbf24", padding: 0 }}
                  >
                    <Lightbulb style={{ width: "12px", height: "12px" }} />
                    {showHints ? "Hide Hints" : `Show Hints (${currentExercise.hints.length})`}
                  </button>
                  
                  {showHints && (
                    <div style={{ marginTop: "8px" }}>
                      {currentExercise.hints.map((hint, index) => (
                        <div key={index} style={{ marginBottom: "6px" }}>
                          {revealedHints.includes(index) ? (
                            <div style={{ padding: "6px 10px", background: "#1e293b", borderRadius: "6px", fontSize: "12px", color: "#fde68a", borderLeft: "2px solid #fbbf24" }}>
                              <strong style={{ color: "#fbbf24" }}>#{index + 1}:</strong> {hint}
                            </div>
                          ) : (
                            <button onClick={() => revealHint(index)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 10px", background: "#1e293b", borderRadius: "6px", border: "1px dashed #475569", fontSize: "11px", color: "#94a3b8", cursor: "pointer", width: "100%" }}>
                              <Eye style={{ width: "11px", height: "11px" }} />Reveal Hint {index + 1}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Solution toggle */}
              {currentExercise.solution && (
                <div style={{ padding: "8px 14px" }}>
                  <button 
                    onClick={() => setShowSolution(!showSolution)}
                    style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: "600", color: "#4ade80", padding: 0 }}
                  >
                    {showSolution ? <EyeOff style={{ width: "12px", height: "12px" }} /> : <CheckCircle style={{ width: "12px", height: "12px" }} />}
                    {showSolution ? "Hide Solution" : "Show Solution"}
                  </button>
                  
                  {showSolution && (
                    <pre style={{ marginTop: "8px", padding: "10px", background: "#1e293b", borderRadius: "6px", fontSize: "12px", color: "#4ade80", fontFamily: "'Fira Code', monospace", overflow: "auto", margin: 0, borderLeft: "2px solid #4ade80" }}>{currentExercise.solution}</pre>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Code Editor Header */}
          <div style={{ padding: "8px 14px", background: "#0f172a", borderBottom: "1px solid #334155", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>Code</span>
            {currentLine && <span style={{ marginLeft: "auto", fontSize: "10px", padding: "2px 8px", borderRadius: "10px", background: "#334155", color: "#94a3b8" }}>Line {currentLine.index}</span>}
          </div>
          
          {/* Code Editor */}
          <div style={{ flex: 1 }}><CodeEditor value={code} onChange={handleCodeChange} theme="vs-dark" height="100%" language="python" fontSize={14} minimap={false} /></div>
        </div>

        {viewMode === "simple" && <SimpleOutput output={output} isRunning={isRunning} variables={simpleVariables} executionTime={simpleExecutionTime} error={simpleError} />}
        
        <AnimatePresence>
          {viewMode === "hardware" && (<><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#f1f5f9" }}><div style={{ padding: "8px 16px", background: "#ffffff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}><div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Cpu style={{ width: "16px", height: "16px", color: "#6366f1" }} /><span style={{ fontSize: "12px", color: "#334155", fontWeight: "600" }}>Hardware View</span></div>{currentLine && <span style={{ fontSize: "11px", padding: "2px 10px", borderRadius: "10px", background: "#eef2ff", color: "#4f46e5", fontWeight: "600" }}>Line {currentLine.index}</span>}</div><div style={{ flex: 1, overflow: "auto", padding: "16px" }}><CPUVisualization state={cpuState} /><VerticalDataFlow isActive={verticalFlowActive} value={flowValue} color={flowColor} /><MemoryVisualization state={memoryState} />{output.length > 0 && <div style={{ marginTop: "16px", background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "12px" }}><div style={{ fontSize: "10px", color: "#64748b", marginBottom: "8px", fontWeight: "600" }}>OUTPUT</div>{output.map((line, i) => <div key={i} style={{ color: "#059669", fontFamily: "monospace", fontSize: "13px" }}>{line}</div>)}</div>}</div></motion.div><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "280px", display: "flex", flexDirection: "column", borderLeft: "1px solid #e2e8f0", background: "#ffffff" }}><div style={{ padding: "8px 16px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}><span style={{ fontSize: "13px", fontWeight: "600" }}>Explanation</span></div><div style={{ flex: 1, overflow: "auto", padding: "12px" }}><ExplanationPanel step={currentStep} currentLine={currentLine?.index} currentCode={currentLine?.line} /></div></motion.div></>)}
        </AnimatePresence>
        
        <AnimatePresence>
          {viewMode === "hardware3d" && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#0A0A1E" }}><HardwareModeClean executionEvents={execution3DEvents} currentLine={currentLine?.index || 0} isRunning={isRunning || isAutoPlaying} code={code} />{output.length > 0 && <div style={{ position: "absolute", bottom: "60px", right: "16px", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", borderRadius: "10px", padding: "12px", maxWidth: "280px", border: "1px solid #333" }}><div style={{ fontSize: "10px", color: "#00FFFF", marginBottom: "8px", fontWeight: "600" }}>OUTPUT</div>{output.map((line, i) => <div key={i} style={{ color: "#4ade80", fontFamily: "monospace", fontSize: "12px" }}>{line}</div>)}</div>}</motion.div>)}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function IDEPage() {
  return (<Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}><Spinner size="lg" /></div>}><IDEPageContent /></Suspense>);
}
