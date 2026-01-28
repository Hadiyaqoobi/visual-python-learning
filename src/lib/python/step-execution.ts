"use client";

export interface Variable {
  name: string;
  value: string;
  type: string;
  isNew?: boolean;
  isUpdated?: boolean;
  previousValue?: string;
}

export interface StepState {
  lineNumber: number;
  lineContent: string;
  variables: Variable[];
  output: string;
  isComplete: boolean;
  error?: string;
}

export interface ParsedLine {
  lineNumber: number;
  content: string;
  isExecutable: boolean;
  indentLevel: number;
}

// Parse code into lines
export function parseCode(code: string): ParsedLine[] {
  const lines = code.split('\n');
  
  return lines.map((content, index) => {
    const trimmed = content.trim();
    const indentLevel = content.search(/\S|$/) / 4; // Assuming 4-space indent
    
    const isExecutable = 
      trimmed.length > 0 &&
      !trimmed.startsWith('#') &&
      !trimmed.startsWith('"""') &&
      !trimmed.startsWith("'''");
    
    return {
      lineNumber: index + 1,
      content,
      isExecutable,
      indentLevel,
    };
  });
}

// Compare two variable states and mark changes
export function compareVariables(
  oldVars: Variable[], 
  newVars: Variable[]
): Variable[] {
  const oldMap = new Map(oldVars.map(v => [v.name, v]));
  
  return newVars.map(newVar => {
    const oldVar = oldMap.get(newVar.name);
    
    if (!oldVar) {
      // New variable
      return { ...newVar, isNew: true, isUpdated: false };
    }
    
    if (oldVar.value !== newVar.value) {
      // Updated variable
      return { 
        ...newVar, 
        isNew: false, 
        isUpdated: true, 
        previousValue: oldVar.value 
      };
    }
    
    // Unchanged variable
    return { ...newVar, isNew: false, isUpdated: false };
  });
}

// Capture variables from Pyodide
export async function captureVariables(pyodide: any): Promise<Variable[]> {
  try {
    const varsCode = `
import json
__vars__ = {}
for name, value in list(globals().items()):
    if not name.startswith('_') and not callable(value) and not isinstance(value, type):
        try:
            __vars__[name] = {
                "name": name, 
                "value": repr(value)[:100], 
                "type": type(value).__name__
            }
        except:
            pass
json.dumps(list(__vars__.values()))
`;
    const varsJson = await pyodide.runPythonAsync(varsCode);
    return JSON.parse(varsJson as string);
  } catch (e) {
    console.error("Failed to capture variables:", e);
    return [];
  }
}

// Step execution class
export class StepExecutor {
  private pyodide: any;
  private lines: ParsedLine[];
  private currentStep: number = 0;
  private previousVariables: Variable[] = [];
  private outputBuffer: string = "";
  private isInitialized: boolean = false;

  constructor(pyodide: any, code: string) {
    this.pyodide = pyodide;
    this.lines = parseCode(code);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    // Reset Python environment
    try {
      await this.pyodide.runPythonAsync(`
# Clear previous variables
for name in list(globals().keys()):
    if not name.startswith('_'):
        try:
            del globals()[name]
        except:
            pass
`);
    } catch (e) {
      // Ignore errors during cleanup
    }

    // Set up output capture
    this.outputBuffer = "";
    this.pyodide.setStdout({
      batched: (text: string) => {
        this.outputBuffer += text + "\n";
      },
    });

    this.currentStep = 0;
    this.previousVariables = [];
    this.isInitialized = true;
  }

  getExecutableLines(): ParsedLine[] {
    return this.lines.filter(l => l.isExecutable);
  }

  getCurrentLineNumber(): number {
    const executableLines = this.getExecutableLines();
    if (this.currentStep >= executableLines.length) {
      return -1;
    }
    return executableLines[this.currentStep].lineNumber;
  }

  getTotalSteps(): number {
    return this.getExecutableLines().length;
  }

  isComplete(): boolean {
    return this.currentStep >= this.getExecutableLines().length;
  }

  async executeStep(): Promise<StepState> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const executableLines = this.getExecutableLines();
    
    if (this.currentStep >= executableLines.length) {
      return {
        lineNumber: -1,
        lineContent: "",
        variables: this.previousVariables.map(v => ({ ...v, isNew: false, isUpdated: false })),
        output: this.outputBuffer,
        isComplete: true,
      };
    }

    const currentLine = executableLines[this.currentStep];
    
    try {
      // Execute the line
      await this.pyodide.runPythonAsync(currentLine.content);
      
      // Capture new variable state
      const newVariables = await captureVariables(this.pyodide);
      
      // Compare with previous state to mark changes
      const markedVariables = compareVariables(this.previousVariables, newVariables);
      
      // Update previous variables for next step
      this.previousVariables = newVariables;
      
      // Move to next step
      this.currentStep++;

      return {
        lineNumber: currentLine.lineNumber,
        lineContent: currentLine.content,
        variables: markedVariables,
        output: this.outputBuffer,
        isComplete: this.currentStep >= executableLines.length,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      return {
        lineNumber: currentLine.lineNumber,
        lineContent: currentLine.content,
        variables: this.previousVariables,
        output: this.outputBuffer,
        isComplete: true,
        error: errorMessage,
      };
    }
  }

  reset(): void {
    this.currentStep = 0;
    this.previousVariables = [];
    this.outputBuffer = "";
    this.isInitialized = false;
  }
}

export default StepExecutor;
