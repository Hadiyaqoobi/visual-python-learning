"use client";

import { useState, useCallback, useEffect } from "react";
import { 
  initPyodide, 
  executePython, 
  isPyodideReady,
  resetPythonEnvironment,
} from "@/lib/python/pyodide";

export interface Variable {
  name: string;
  value: string;
  type: string;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error: string | null;
  executionTime: number;
  variables?: Variable[];
}

export interface UsePythonReturn {
  isLoading: boolean;
  isReady: boolean;
  isExecuting: boolean;
  output: string[];
  error: string | null;
  executionTime: number | null;
  variables: Variable[];
  runCode: (code: string) => Promise<ExecutionResult>;
  clearOutput: () => void;
  resetEnvironment: () => Promise<void>;
}

export function usePython(): UsePythonReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [variables, setVariables] = useState<Variable[]>([]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        setIsLoading(true);
        await initPyodide();
        if (mounted) {
          setIsReady(true);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to initialize Python environment");
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const runCode = useCallback(async (code: string): Promise<ExecutionResult> => {
    setIsExecuting(true);
    setError(null);
    setOutput([">>> Running Python code...", ""]);
    setVariables([]);

    try {
      const result = await executePython(code);
      
      if (result.success) {
        const outputLines = result.output
          .split("\n")
          .filter((line) => line.length > 0);
        
        setOutput([
          ">>> Running Python code...",
          "",
          ...outputLines,
          "",
          `--- Execution complete (${result.executionTime.toFixed(0)}ms) ---`,
        ]);
        setError(null);

        // Capture variables after execution
        try {
          const pyodide = await initPyodide();
          const varsCode = `
import json
__vars__ = {}
for name, value in list(globals().items()):
    if not name.startswith('_') and not callable(value) and not isinstance(value, type):
        try:
            __vars__[name] = {"name": name, "value": repr(value)[:100], "type": type(value).__name__}
        except:
            pass
json.dumps(list(__vars__.values()))
`;
          const varsJson = await pyodide.runPythonAsync(varsCode);
          const capturedVars = JSON.parse(varsJson as string);
          setVariables(capturedVars);
        } catch (e) {
          console.error("Failed to capture variables:", e);
        }

      } else {
        setOutput([
          ">>> Running Python code...",
          "",
          `Error: ${result.error}`,
          "",
          `--- Execution failed (${result.executionTime.toFixed(0)}ms) ---`,
        ]);
        setError(result.error);
      }

      setExecutionTime(result.executionTime);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setOutput([
        ">>> Running Python code...",
        "",
        `Error: ${errorMsg}`,
        "",
        "--- Execution failed ---",
      ]);
      setError(errorMsg);
      
      return {
        success: false,
        output: "",
        error: errorMsg,
        executionTime: 0,
      };
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const clearOutput = useCallback(() => {
    setOutput([]);
    setError(null);
    setExecutionTime(null);
    setVariables([]);
  }, []);

  const resetEnvironment = useCallback(async () => {
    try {
      await resetPythonEnvironment();
      setOutput([">>> Python environment reset", ""]);
      setError(null);
      setVariables([]);
    } catch (err) {
      setError("Failed to reset environment");
    }
  }, []);

  return {
    isLoading,
    isReady,
    isExecuting,
    output,
    error,
    executionTime,
    variables,
    runCode,
    clearOutput,
    resetEnvironment,
  };
}

export default usePython;
