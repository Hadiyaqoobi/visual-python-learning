"use client";

export interface CodeLine {
  lineNumber: number;
  code: string;
  isExecutable: boolean;
}

export interface VariableState {
  name: string;
  value: string;
  type: string;
}

export interface StepState {
  lineNumber: number;
  variables: VariableState[];
  output: string;
  isComplete: boolean;
}

// Parse code into lines and identify executable lines
export function parseCode(code: string): CodeLine[] {
  const lines = code.split("\n");
  
  return lines.map((line, index) => {
    const trimmed = line.trim();
    const isExecutable = 
      trimmed.length > 0 && 
      !trimmed.startsWith("#") &&
      !trimmed.startsWith('"""') &&
      !trimmed.startsWith("'''");
    
    return {
      lineNumber: index + 1,
      code: line,
      isExecutable,
    };
  });
}

// Generate code to capture variables at each step
export function generateStepperCode(code: string): string {
  const lines = code.split("\n");
  let instrumentedCode = `
__step_output__ = []
__step_variables__ = []

def __capture_state__(line_num):
    import json
    vars_snapshot = {}
    for name, value in list(globals().items()):
        if not name.startswith('_') and not callable(value) and not isinstance(value, type):
            try:
                vars_snapshot[name] = {
                    "name": name,
                    "value": repr(value)[:100],
                    "type": type(value).__name__
                }
            except:
                pass
    __step_variables__.append({"line": line_num, "vars": vars_snapshot})

`;

  // Add capture calls after each executable line
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const isExecutable = 
      trimmed.length > 0 && 
      !trimmed.startsWith("#") &&
      !trimmed.startsWith('"""') &&
      !trimmed.startsWith("'''") &&
      !trimmed.startsWith("def ") &&
      !trimmed.startsWith("class ") &&
      !trimmed.startsWith("if ") &&
      !trimmed.startsWith("elif ") &&
      !trimmed.startsWith("else:") &&
      !trimmed.startsWith("for ") &&
      !trimmed.startsWith("while ") &&
      !trimmed.startsWith("try:") &&
      !trimmed.startsWith("except") &&
      !trimmed.startsWith("finally:");

    instrumentedCode += line + "\n";
    
    if (isExecutable && trimmed.length > 0) {
      // Preserve indentation for the capture call
      const indent = line.match(/^(\s*)/)?.[1] || "";
      instrumentedCode += `${indent}__capture_state__(${index + 1})\n`;
    }
  });

  instrumentedCode += `
__step_variables__
`;

  return instrumentedCode;
}

// Simple step-through execution without full instrumentation
export async function executeWithSteps(
  pyodide: any,
  code: string,
  onStep: (state: StepState) => void
): Promise<void> {
  const lines = code.split("\n");
  let outputBuffer = "";
  
  // Set up output capture
  pyodide.setStdout({
    batched: (text: string) => {
      outputBuffer += text + "\n";
    },
  });

  // Execute line by line for simple cases
  // For complex cases (functions, loops), execute the whole block
  let currentLine = 0;
  let codeBlock = "";
  let blockIndent = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const indent = line.search(/\S|$/);
    
    // Skip empty lines and comments
    if (trimmed.length === 0 || trimmed.startsWith("#")) {
      continue;
    }

    // Check if starting a block (def, if, for, while, class, etc.)
    const isBlockStart = /^(def |class |if |elif |else:|for |while |try:|except|finally:)/.test(trimmed);
    
    if (isBlockStart) {
      // Collect the entire block
      codeBlock = line + "\n";
      blockIndent = indent;
      
      // Continue collecting lines that are part of this block
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j];
        const nextTrimmed = nextLine.trim();
        const nextIndent = nextLine.search(/\S|$/);
        
        if (nextTrimmed.length === 0) {
          codeBlock += nextLine + "\n";
          continue;
        }
        
        if (nextIndent > blockIndent || nextTrimmed.startsWith("elif ") || nextTrimmed.startsWith("else:") || nextTrimmed.startsWith("except") || nextTrimmed.startsWith("finally:")) {
          codeBlock += nextLine + "\n";
          i = j;
        } else {
          i = j - 1;
          break;
        }
      }
      
      // Execute the block
      try {
        await pyodide.runPythonAsync(codeBlock);
      } catch (e) {
        // Error in block
      }
      
      // Capture state after block
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
      
      try {
        const varsJson = await pyodide.runPythonAsync(varsCode);
        const variables = JSON.parse(varsJson);
        
        onStep({
          lineNumber: i + 1,
          variables,
          output: outputBuffer,
          isComplete: false,
        });
      } catch (e) {
        // Continue even if variable capture fails
      }
      
    } else {
      // Single line execution
      try {
        await pyodide.runPythonAsync(line);
        
        // Capture variables
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
        const variables = JSON.parse(varsJson);
        
        onStep({
          lineNumber: i + 1,
          variables,
          output: outputBuffer,
          isComplete: false,
        });
        
      } catch (e) {
        // Error on this line
        onStep({
          lineNumber: i + 1,
          variables: [],
          output: outputBuffer + `\nError: ${e}`,
          isComplete: false,
        });
      }
    }
    
    // Small delay to visualize steps
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Final state
  onStep({
    lineNumber: lines.length,
    variables: [],
    output: outputBuffer,
    isComplete: true,
  });
}
