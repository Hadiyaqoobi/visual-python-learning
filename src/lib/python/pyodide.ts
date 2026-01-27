"use client";

let pyodideInstance: any = null;
let pyodideReady = false;

export interface ExecutionResult {
  success: boolean;
  output: string;
  error: string | null;
  executionTime: number;
}

export async function initPyodide(): Promise<any> {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  // Load Pyodide script
  if (!(window as any).loadPyodide) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Pyodide"));
      document.head.appendChild(script);
    });
  }

  console.log("Loading Pyodide...");
  pyodideInstance = await (window as any).loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
  });
  console.log("Pyodide loaded!");
  pyodideReady = true;
  
  return pyodideInstance;
}

export async function executePython(code: string): Promise<ExecutionResult> {
  const startTime = performance.now();
  
  try {
    const pyodide = await initPyodide();
    
    // Capture stdout
    let output = "";
    pyodide.setStdout({
      batched: (text: string) => {
        output += text + "\n";
      },
    });
    
    console.log("Running code...");
    await pyodide.runPythonAsync(code);
    console.log("Output:", output);
    
    return {
      success: true,
      output: output.trim(),
      error: null,
      executionTime: performance.now() - startTime,
    };
  } catch (error: any) {
    console.error("Error:", error);
    return {
      success: false,
      output: "",
      error: error.message || String(error),
      executionTime: performance.now() - startTime,
    };
  }
}

export function isPyodideReady(): boolean {
  return pyodideReady;
}

export async function resetPythonEnvironment(): Promise<void> {
  // Simple reset - just clear variables
  if (pyodideInstance) {
    try {
      await pyodideInstance.runPythonAsync("pass");
    } catch (e) {
      console.error("Reset error:", e);
    }
  }
}
