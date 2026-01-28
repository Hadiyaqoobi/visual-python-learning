"use client";

import { CPUState } from "@/components/hardware/CPUVisualization";
import { MemoryState, MemoryCell } from "@/components/hardware/MemoryVisualization";
import { ExecutionStep } from "@/components/hardware/ExplanationPanel";

export interface HardwareState {
  cpu: CPUState;
  memory: MemoryState;
  currentStep: ExecutionStep | null;
  dataFlow: {
    active: boolean;
    from: "code" | "cpu" | "alu" | "memory";
    to: "cpu" | "alu" | "memory" | "registers";
    value?: string;
    color?: "blue" | "green" | "purple" | "orange";
  };
  verticalFlow: {
    active: boolean;
    value?: string;
    direction: "up" | "down";
    color?: "blue" | "green" | "purple" | "orange";
  };
}

export interface ParsedInstruction {
  type: "assignment" | "operation" | "print" | "other";
  variable?: string;
  value?: string;
  operator?: string;
  operand1?: string;
  operand2?: string;
  originalCode: string;
  lineNumber: number;
}

// Parse a line of Python code into an instruction
export function parseInstruction(code: string, lineNumber: number): ParsedInstruction {
  const trimmed = code.trim();
  
  // Skip comments and empty lines
  if (trimmed.startsWith("#") || trimmed === "") {
    return { type: "other", originalCode: code, lineNumber };
  }

  // Print statement
  if (trimmed.startsWith("print(")) {
    return { type: "print", originalCode: code, lineNumber };
  }

  // Assignment with operation: x = 5 + 3 or x = y * 2
  const opMatch = trimmed.match(/^(\w+)\s*=\s*(.+?)\s*([\+\-\*\/])\s*(.+)$/);
  if (opMatch) {
    return {
      type: "operation",
      variable: opMatch[1],
      operand1: opMatch[2].trim(),
      operator: opMatch[3],
      operand2: opMatch[4].trim(),
      originalCode: code,
      lineNumber,
    };
  }

  // Simple assignment: x = 5 or x = "hello" or x = True
  const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
  if (assignMatch) {
    return {
      type: "assignment",
      variable: assignMatch[1],
      value: assignMatch[2].trim(),
      originalCode: code,
      lineNumber,
    };
  }

  return { type: "other", originalCode: code, lineNumber };
}

// Determine the type of a value
export function inferType(value: string): string {
  if (value === "True" || value === "False") return "bool";
  if (value.startsWith('"') || value.startsWith("'")) return "str";
  if (value.startsWith("[")) return "list";
  if (value.includes(".")) return "float";
  if (/^\d+$/.test(value)) return "int";
  return "unknown";
}

// Generate a memory address
export function generateAddress(index: number): string {
  const base = 0x1000 + index * 4;
  return `0x${base.toString(16).toUpperCase()}`;
}

// Create execution phases for an instruction
export function createExecutionPhases(
  instruction: ParsedInstruction,
  currentMemory: MemoryCell[],
  variables: Map<string, string>
): ExecutionStep[] {
  const phases: ExecutionStep[] = [];

  if (instruction.type === "other") {
    return phases;
  }

  // Phase 1: FETCH
  phases.push({
    phase: "fetch",
    title: "Fetching Instruction",
    description: `The CPU reads the instruction "${instruction.originalCode.trim()}" from program memory and loads it into the Instruction Register (IR).`,
    details: "The Program Counter (PC) points to this line. The CPU fetches the instruction bytes and increments PC to the next line.",
    codeHighlight: instruction.originalCode,
  });

  // Phase 2: DECODE
  if (instruction.type === "assignment") {
    phases.push({
      phase: "decode",
      title: "Decoding Assignment",
      description: `The Control Unit decodes this as an assignment operation. Variable "${instruction.variable}" will be assigned the value ${instruction.value}.`,
      details: `The decoder identifies: Variable name = "${instruction.variable}", Value = ${instruction.value}, Type = ${inferType(instruction.value || "")}`,
    });
  } else if (instruction.type === "operation") {
    phases.push({
      phase: "decode",
      title: "Decoding Operation",
      description: `The Control Unit decodes this as an arithmetic operation: ${instruction.operand1} ${instruction.operator} ${instruction.operand2}, result stored in "${instruction.variable}".`,
      details: `The decoder sends operands to the ALU and prepares the ${instruction.operator === "+" ? "addition" : instruction.operator === "-" ? "subtraction" : instruction.operator === "*" ? "multiplication" : "division"} circuit.`,
    });
  } else if (instruction.type === "print") {
    phases.push({
      phase: "decode",
      title: "Decoding Print Statement",
      description: "The Control Unit recognizes this as an output operation. It will read values from memory and send them to the output buffer.",
      details: "Print statements trigger memory reads for any variables referenced, then format and output the result.",
    });
  }

  // Phase 3: EXECUTE
  if (instruction.type === "operation") {
    // Resolve operand values
    let val1 = instruction.operand1 || "0";
    let val2 = instruction.operand2 || "0";
    
    // Check if operands are variables
    if (variables.has(val1)) {
      val1 = variables.get(val1) || val1;
    }
    if (variables.has(val2)) {
      val2 = variables.get(val2) || val2;
    }

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

    phases.push({
      phase: "execute",
      title: "ALU Performing Calculation",
      description: `The Arithmetic Logic Unit (ALU) computes ${val1} ${instruction.operator} ${val2} = ${result}`,
      details: `The ALU's ${instruction.operator === "+" ? "adder" : instruction.operator === "-" ? "subtractor" : instruction.operator === "*" ? "multiplier" : "divider"} circuit processes the operands and produces the result.`,
    });
  } else if (instruction.type === "assignment") {
    phases.push({
      phase: "execute",
      title: "Preparing Value",
      description: `The CPU prepares the value ${instruction.value} to be stored in memory.`,
      details: `For ${inferType(instruction.value || "")}, the value is converted to binary representation for storage.`,
    });
  } else if (instruction.type === "print") {
    phases.push({
      phase: "execute",
      title: "Formatting Output",
      description: "The CPU formats the output string by reading variable values from memory.",
      details: "Each variable reference triggers a memory read, then values are formatted into the output string.",
    });
  }

  // Phase 4: MEMORY
  if (instruction.type === "assignment" || instruction.type === "operation") {
    const existingCell = currentMemory.find(c => c.label === instruction.variable);
    const address = existingCell?.address || generateAddress(currentMemory.length);

    phases.push({
      phase: "memory",
      title: existingCell ? "Updating Memory" : "Allocating Memory",
      description: existingCell 
        ? `Updating the value at address ${address} where "${instruction.variable}" is stored.`
        : `Allocating new memory at address ${address} for variable "${instruction.variable}".`,
      details: existingCell
        ? "The memory controller locates the existing address and prepares to overwrite the stored value."
        : "The memory manager finds the next available memory location and reserves it for this variable.",
    });
  }

  // Phase 5: WRITEBACK
  if (instruction.type === "assignment" || instruction.type === "operation") {
    phases.push({
      phase: "writeback",
      title: "Writing to Memory",
      description: `The computed value is written to memory and the variable "${instruction.variable}" now points to this location.`,
      details: "The data travels from the CPU through the data bus to RAM, where it's stored at the allocated address.",
    });
  } else if (instruction.type === "print") {
    phases.push({
      phase: "writeback",
      title: "Output Complete",
      description: "The formatted string is sent to the console output buffer.",
      details: "The output system receives the formatted data and displays it to the user.",
    });
  }

  return phases;
}

// Initial hardware state
export function createInitialHardwareState(): HardwareState {
  return {
    cpu: {
      isActive: false,
      registers: {
        PC: "0x0000",
        IR: "NOP",
        ACC: "0",
        R1: "0",
        R2: "0",
      },
    },
    memory: {
      cells: [],
    },
    currentStep: null,
    dataFlow: {
      active: false,
      from: "code",
      to: "cpu",
    },
    verticalFlow: {
      active: false,
      direction: "down",
    },
  };
}

export default {
  parseInstruction,
  inferType,
  generateAddress,
  createExecutionPhases,
  createInitialHardwareState,
};
