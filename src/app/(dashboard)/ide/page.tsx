"use client";

import { useState, useCallback } from "react";
import { CodeEditor } from "@/components/ide/CodeEditor";
import { VariableViewer } from "@/components/ide/VariableViewer";
import { Button, Badge, Spinner } from "@/components/ui";
import { usePython } from "@/hooks/usePython";
import { 
  Play, 
  RotateCcw, 
  Sun, 
  Moon, 
  Download, 
  Upload
} from "lucide-react";

const STARTER_CODE = `# Visual Python Learning - Interactive IDE
# Run this code to see variables update in real-time!

# Define variables
name = "Hadi"
age = 25
is_student = True

# Create a list
scores = [85, 90, 78, 92, 88]

# Calculate statistics
total = sum(scores)
average = total / len(scores)
highest = max(scores)
lowest = min(scores)

# Print results
print(f"Student: {name}, Age: {age}")
print(f"Scores: {scores}")
print(f"Total: {total}")
print(f"Average: {average:.2f}")
print(f"Highest: {highest}, Lowest: {lowest}")
`;

export default function IDEPage() {
  const [code, setCode] = useState(STARTER_CODE);
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");

  const {
    isLoading: isPythonLoading,
    isReady: isPythonReady,
    isExecuting,
    output,
    variables,
    runCode,
    clearOutput,
  } = usePython();

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "vs-dark" ? "light" : "vs-dark"));
  };

  const handleReset = () => {
    setCode(STARTER_CODE);
    clearOutput();
  };

  const handleRun = async () => {
    await runCode(code);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "code.py";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".py,.txt";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setCode(event.target?.result as string);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="success"
            size="sm"
            onClick={handleRun}
            disabled={!isPythonReady || isExecuting}
          >
            <Play className="w-4 h-4 mr-1" />
            {isExecuting ? "Running..." : "Run"}
          </Button>

          <div className="w-px h-6 bg-slate-600 mx-2" />

          <button 
            onClick={handleReset} 
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded" 
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button 
            onClick={handleDownload} 
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded" 
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>

          <button 
            onClick={handleUpload} 
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded" 
            title="Upload"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="info" size="sm">Python</Badge>
          <span className="text-slate-400 text-sm">main.py</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme} 
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded"
          >
            {theme === "vs-dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Python Loading */}
      {isPythonLoading && (
        <div className="bg-blue-900/50 border-b border-blue-700 px-4 py-2 flex items-center gap-2 flex-shrink-0">
          <Spinner size="sm" variant="primary" />
          <span className="text-blue-300 text-sm">Loading Python environment...</span>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Editor Panel */}
        <div className="w-1/2 h-full flex flex-col min-w-0">
          <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex-shrink-0">
            <span className="text-sm font-medium text-slate-300">Code Editor</span>
          </div>
          <div className="flex-1 min-h-0">
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              theme={theme}
              height="100%"
              language="python"
              fontSize={14}
              minimap={false}
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 h-full flex flex-col border-l border-slate-700 min-w-0">
          {/* Output Panel */}
          <div className="h-1/2 flex flex-col border-b border-slate-700">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 flex-shrink-0">
              <span className="text-sm font-medium text-slate-300">Console Output</span>
              <button 
                onClick={clearOutput} 
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-700"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-sm bg-slate-900">
              {isPythonLoading && (
                <p className="text-blue-400">Loading Python...</p>
              )}
              
              {!isPythonLoading && isPythonReady && output.length === 0 && (
                <p className="text-slate-500 italic">Click "Run" to execute your code...</p>
              )}

              {output.map((line, index) => (
                <div
                  key={index}
                  className={
                    line.startsWith(">>>") ? "text-blue-400" :
                    line.startsWith("---") ? "text-slate-500" :
                    line.startsWith("Error") ? "text-red-400" :
                    "text-green-400"
                  }
                >
                  {line || "\u00A0"}
                </div>
              ))}

              {isExecuting && (
                <div className="flex items-center gap-2 mt-2 text-blue-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  Running...
                </div>
              )}
            </div>
          </div>

          {/* Variables Panel */}
          <div className="h-1/2 flex flex-col">
            <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex-shrink-0">
              <span className="text-sm font-medium text-slate-300">
                Variables {variables.length > 0 && `(${variables.length})`}
              </span>
            </div>
            <div className="flex-1 overflow-auto bg-slate-900">
              <VariableViewer variables={variables} />
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-slate-800 border-t border-slate-700 text-xs text-slate-400 flex-shrink-0">
        <span>Python 3.11 (Pyodide)</span>
        <span className={isPythonReady ? "text-green-400" : "text-amber-400"}>
          {isPythonLoading ? "● Loading..." : isPythonReady ? "● Ready" : "● Error"}
        </span>
      </div>
    </div>
  );
}
