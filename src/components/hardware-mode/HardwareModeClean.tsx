"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Database, Box, Calculator, Zap, 
  ChevronRight, ChevronDown, Info, Clock,
  Layers, HardDrive, ArrowRight, ArrowDown,
  Play, MemoryStick, BookOpen, Lightbulb,
  Code, Binary, CircuitBoard, Activity
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
export interface ExecutionEvent {
  type: 'ASSIGNMENT' | 'ARITHMETIC' | 'COMPARISON' | 'FUNCTION_CALL' | 'LOOP' | 'MEMORY_READ' | 'MEMORY_WRITE' | 'PRINT';
  line: number;
  code: string;
  variable?: string;
  value?: string;
  operator?: string;
  operand1?: string;
  operand2?: string;
}

interface HardwareModeCleanProps {
  executionEvents: ExecutionEvent[];
  currentLine: number;
  isRunning: boolean;
  code: string;
}

// ============================================
// CONSTANTS
// ============================================
const PIPELINE_STAGES = [
  { id: 'fetch', name: 'FETCH', color: '#3B82F6', desc: 'Get instruction from memory' },
  { id: 'decode', name: 'DECODE', color: '#8B5CF6', desc: 'Understand what to do' },
  { id: 'execute', name: 'EXECUTE', color: '#22C55E', desc: 'Do the operation' },
  { id: 'memory', name: 'MEMORY', color: '#F97316', desc: 'Read/write data' },
  { id: 'writeback', name: 'WRITEBACK', color: '#EC4899', desc: 'Save the result' },
];

const MEMORY_LEVELS = [
  { name: 'Registers', size: '~1KB', speed: '1 cycle', speedMs: 50, color: '#22C55E', icon: '⚡' },
  { name: 'L1 Cache', size: '64KB', speed: '4 cycles', speedMs: 100, color: '#84CC16', icon: '🟢' },
  { name: 'L2 Cache', size: '512KB', speed: '12 cycles', speedMs: 200, color: '#EAB308', icon: '🟡' },
  { name: 'L3 Cache', size: '8MB', speed: '40 cycles', speedMs: 400, color: '#F97316', icon: '🟠' },
  { name: 'RAM', size: '16GB', speed: '200 cycles', speedMs: 800, color: '#EF4444', icon: '🔴' },
];

// ============================================
// CPU COMPONENT BOX (2D)
// ============================================
function CPUComponentBox({ 
  name, 
  icon: Icon, 
  color, 
  active, 
  value,
  description,
  size = 'normal',
}: { 
  name: string;
  icon: React.ElementType;
  color: string;
  active: boolean;
  value?: string;
  description: string;
  size?: 'small' | 'normal' | 'large';
}) {
  const sizeStyles = {
    small: { width: '100px', height: '70px', fontSize: '11px' },
    normal: { width: '140px', height: '90px', fontSize: '12px' },
    large: { width: '180px', height: '100px', fontSize: '13px' },
  };
  
  return (
    <motion.div
      animate={{
        boxShadow: active 
          ? `0 0 30px ${color}66, 0 0 60px ${color}33`
          : '0 4px 20px rgba(0,0,0,0.3)',
        scale: active ? 1.02 : 1,
      }}
      transition={{ duration: 0.3 }}
      style={{
        ...sizeStyles[size],
        background: `linear-gradient(135deg, ${color}22, ${color}11)`,
        border: `2px solid ${active ? color : '#333'}`,
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at center, ${color}33, transparent)`,
            pointerEvents: 'none',
          }}
        />
      )}
      
      <Icon 
        size={size === 'small' ? 18 : 24} 
        style={{ color: active ? color : '#666' }} 
      />
      
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: sizeStyles[size].fontSize,
        fontWeight: 'bold',
        color: active ? '#fff' : '#888',
        textAlign: 'center',
      }}>
        {name}
      </div>
      
      <AnimatePresence>
        {active && value && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              color: '#FFD700',
              background: 'rgba(0,0,0,0.5)',
              padding: '2px 8px',
              borderRadius: '4px',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {value}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================
// DATA FLOW ARROW
// ============================================
function DataFlowArrow({ 
  direction = 'right', 
  active, 
  label,
  color = '#00AAFF',
}: { 
  direction?: 'right' | 'down' | 'left' | 'up';
  active: boolean;
  label?: string;
  color?: string;
}) {
  const isHorizontal = direction === 'right' || direction === 'left';
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: isHorizontal ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isHorizontal ? '0 8px' : '8px 0',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        gap: '4px',
        alignItems: 'center',
      }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              opacity: active ? [0.3, 1, 0.3] : 0.2,
              scale: active ? [0.8, 1.2, 0.8] : 1,
            }}
            transition={{
              duration: 0.6,
              repeat: active ? Infinity : 0,
              delay: i * 0.15,
            }}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: active ? color : '#333',
            }}
          />
        ))}
        
        {direction === 'right' && <ChevronRight size={16} style={{ color: active ? color : '#333' }} />}
        {direction === 'down' && <ChevronDown size={16} style={{ color: active ? color : '#333' }} />}
      </div>
      
      {label && (
        <div style={{
          fontSize: '9px',
          color: active ? color : '#444',
          fontFamily: "'JetBrains Mono', monospace",
          marginLeft: isHorizontal ? '4px' : 0,
          marginTop: isHorizontal ? 0 : '4px',
        }}>
          {label}
        </div>
      )}
    </div>
  );
}

// ============================================
// PIPELINE VISUALIZATION
// ============================================
function PipelineVisualization({ activeStage }: { activeStage: number }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #222',
    }}>
      <div style={{
        fontSize: '11px',
        color: '#666',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 'bold',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <Layers size={14} />
        CPU PIPELINE (5-Stage)
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {PIPELINE_STAGES.map((stage, i) => (
          <React.Fragment key={stage.id}>
            <motion.div
              animate={{
                background: i === activeStage 
                  ? `linear-gradient(135deg, ${stage.color}, ${stage.color}88)`
                  : 'rgba(255,255,255,0.05)',
                scale: i === activeStage ? 1.05 : 1,
              }}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: `1px solid ${i === activeStage ? stage.color : '#333'}`,
                textAlign: 'center',
                minWidth: '80px',
              }}
            >
              <div style={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: i === activeStage ? '#fff' : '#555',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {stage.name}
              </div>
              <div style={{
                fontSize: '9px',
                color: i === activeStage ? '#ddd' : '#444',
                marginTop: '4px',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {stage.desc}
              </div>
            </motion.div>
            
            {i < PIPELINE_STAGES.length - 1 && (
              <ChevronRight 
                size={16} 
                style={{ color: i === activeStage ? '#00FFFF' : '#333' }} 
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ============================================
// MEMORY HIERARCHY
// ============================================
function MemoryHierarchy({ activeLevel }: { activeLevel: number }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #222',
    }}>
      <div style={{
        fontSize: '11px',
        color: '#666',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 'bold',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <Database size={14} />
        MEMORY HIERARCHY
        <span style={{ marginLeft: 'auto', color: '#22C55E', fontSize: '9px' }}>
          ⚡ FAST
        </span>
        <span style={{ color: '#EF4444', fontSize: '9px' }}>
          🐢 SLOW
        </span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {MEMORY_LEVELS.map((level, i) => (
          <motion.div
            key={level.name}
            animate={{
              background: i === activeLevel 
                ? `linear-gradient(90deg, ${level.color}33, transparent)`
                : 'transparent',
              borderLeftColor: i === activeLevel ? level.color : '#333',
              x: i === activeLevel ? 4 : 0,
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '6px',
              borderLeft: '3px solid',
            }}
          >
            <span style={{ fontSize: '14px' }}>{level.icon}</span>
            
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: i === activeLevel ? '#fff' : '#666',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {level.name}
              </div>
              <div style={{
                fontSize: '9px',
                color: '#555',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {level.size}
              </div>
            </div>
            
            <div style={{
              fontSize: '10px',
              color: i === activeLevel ? level.color : '#555',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 'bold',
            }}>
              {level.speed}
            </div>
            
            <div style={{
              width: '60px',
              height: '6px',
              background: '#222',
              borderRadius: '3px',
              overflow: 'hidden',
            }}>
              <motion.div
                animate={{
                  width: i === activeLevel ? '100%' : '0%',
                }}
                transition={{ duration: level.speedMs / 1000 }}
                style={{
                  height: '100%',
                  background: level.color,
                  borderRadius: '3px',
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// CPU DIAGRAM (Clean 2D)
// ============================================
function CPUDiagram({ 
  activeComponent,
  currentValues,
}: { 
  activeComponent: string | null;
  currentValues: Record<string, string | undefined>;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #222',
    }}>
      <div style={{
        fontSize: '11px',
        color: '#666',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 'bold',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <Cpu size={14} />
        CPU ARCHITECTURE
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <CPUComponentBox
            name="CONTROL UNIT"
            icon={Cpu}
            color="#F97316"
            active={activeComponent === 'control'}
            value={currentValues.control}
            description="Fetches & decodes"
          />
          
          <DataFlowArrow 
            direction="right" 
            active={activeComponent === 'control' || activeComponent === 'alu'} 
            color="#F97316"
          />
          
          <CPUComponentBox
            name="ALU"
            icon={Calculator}
            color="#22C55E"
            active={activeComponent === 'alu'}
            value={currentValues.alu}
            description="Math & logic"
            size="large"
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '80px' }}>
          <DataFlowArrow 
            direction="down" 
            active={activeComponent === 'registers'} 
            color="#8B5CF6"
          />
          <DataFlowArrow 
            direction="down" 
            active={activeComponent === 'registers' || activeComponent === 'alu'} 
            color="#22C55E"
          />
        </div>
        
        <CPUComponentBox
          name="REGISTERS"
          icon={Box}
          color="#8B5CF6"
          active={activeComponent === 'registers'}
          value={currentValues.registers}
          description="Fast storage (16 regs)"
          size="large"
        />
        
        <DataFlowArrow 
          direction="down" 
          active={activeComponent === 'memory'} 
          label="Data Bus"
          color="#3B82F6"
        />
        
        <CPUComponentBox
          name="MEMORY (RAM)"
          icon={HardDrive}
          color="#3B82F6"
          active={activeComponent === 'memory'}
          value={currentValues.memory}
          description="Main storage"
          size="large"
        />
      </div>
    </div>
  );
}

// ============================================
// CODE PANEL
// ============================================
function CodePanel({ 
  code, 
  currentLine,
  executionEvents,
}: { 
  code: string;
  currentLine: number;
  executionEvents: ExecutionEvent[];
}) {
  const lines = code.split('\n');
  const executedLines = new Set(executionEvents.map(e => e.line));
  
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '12px',
      border: '1px solid #222',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #222',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ fontSize: '16px' }}>🐍</span>
        <span style={{
          fontSize: '11px',
          fontWeight: 'bold',
          color: '#666',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          PYTHON CODE
        </span>
        {currentLine > 0 && (
          <span style={{
            marginLeft: 'auto',
            fontSize: '10px',
            color: '#00FFFF',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            Line {currentLine}
          </span>
        )}
      </div>
      
      <div style={{
        padding: '8px 0',
        maxHeight: '300px',
        overflow: 'auto',
      }}>
        {lines.map((line, i) => {
          const lineNum = i + 1;
          const isComment = line.trim().startsWith('#');
          const isCurrent = lineNum === currentLine;
          const wasExecuted = executedLines.has(lineNum);
          
          return (
            <motion.div
              key={i}
              animate={{
                backgroundColor: isCurrent 
                  ? 'rgba(0,255,255,0.15)'
                  : wasExecuted 
                    ? 'rgba(34,197,94,0.05)'
                    : 'transparent',
              }}
              style={{
                display: 'flex',
                padding: '3px 12px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                borderLeft: isCurrent 
                  ? '3px solid #00FFFF'
                  : wasExecuted
                    ? '3px solid #22C55E55'
                    : '3px solid transparent',
              }}
            >
              <span style={{
                width: '28px',
                color: isCurrent ? '#00FFFF' : '#444',
                textAlign: 'right',
                marginRight: '12px',
                userSelect: 'none',
              }}>
                {lineNum}
              </span>
              <span style={{
                color: isComment 
                  ? '#6B7280' 
                  : isCurrent 
                    ? '#fff'
                    : '#999',
              }}>
                {line || ' '}
              </span>
              {isCurrent && (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    marginLeft: 'auto',
                    fontSize: '10px',
                    color: '#00FFFF',
                  }}
                >
                  ◀ EXECUTING
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// EXPLANATION PANEL
// ============================================
function ExplanationPanel({ 
  event,
  stepNumber,
}: { 
  event: ExecutionEvent | null;
  stepNumber: number;
}) {
  if (!event) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #222',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎯</div>
        <div style={{
          fontSize: '13px',
          color: '#888',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          Click <strong style={{ color: '#22C55E' }}>Step</strong> to start execution
        </div>
        <div style={{
          fontSize: '11px',
          color: '#555',
          marginTop: '8px',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          Watch how your code flows through the CPU!
        </div>
      </div>
    );
  }
  
  const getExplanation = () => {
    switch (event.type) {
      case 'ARITHMETIC':
        return {
          title: 'Arithmetic Operation',
          icon: '🔢',
          color: '#22C55E',
          steps: [
            `1. Load ${event.operand1 || 'value'} from registers`,
            `2. Load ${event.operand2 || 'value'} from registers`,
            `3. ALU computes: ${event.operand1} ${event.operator} ${event.operand2}`,
            `4. Store result in ${event.variable || 'register'}`,
          ],
        };
      case 'ASSIGNMENT':
        if (event.operator) {
          return {
            title: 'Computed Assignment',
            icon: '📝',
            color: '#F97316',
            steps: [
              `1. Fetch operands from memory/registers`,
              `2. ALU performs ${event.operator} operation`,
              `3. Result stored in ${event.variable}`,
            ],
          };
        }
        return {
          title: 'Variable Assignment',
          icon: '📦',
          color: '#8B5CF6',
          steps: [
            `1. Control unit decodes: ${event.code}`,
            `2. Value ${event.value} loaded`,
            `3. Stored in register for ${event.variable}`,
          ],
        };
      case 'MEMORY_READ':
        return {
          title: 'Memory Read',
          icon: '📖',
          color: '#3B82F6',
          steps: [
            '1. Address calculated',
            '2. Check L1 Cache → L2 → L3 → RAM',
            '3. Data loaded into register',
          ],
        };
      case 'MEMORY_WRITE':
        return {
          title: 'Memory Write',
          icon: '💾',
          color: '#3B82F6',
          steps: [
            '1. Data prepared in register',
            '2. Address calculated',
            '3. Written through cache hierarchy',
          ],
        };
      case 'PRINT':
        return {
          title: 'Output Operation',
          icon: '🖥️',
          color: '#EC4899',
          steps: [
            '1. Format string processed',
            '2. I/O system call invoked',
            '3. Output sent to console',
          ],
        };
      default:
        return {
          title: 'Processing',
          icon: '⚙️',
          color: '#666',
          steps: ['Executing instruction...'],
        };
    }
  };
  
  const explanation = getExplanation();
  
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #222',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #222',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${explanation.color}, ${explanation.color}88)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
        }}>
          {explanation.icon}
        </div>
        <div>
          <div style={{
            fontSize: '13px',
            fontWeight: 'bold',
            color: explanation.color,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            Step {stepNumber}: {explanation.title}
          </div>
          <div style={{
            fontSize: '11px',
            color: '#666',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {event.code}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {explanation.steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#888',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <ChevronRight size={14} style={{ color: explanation.color }} />
            {step}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// DYNAMIC EXECUTION CONTEXT - NEW!
// ============================================
function DynamicExecutionContext({ 
  event,
  allEvents,
  pipelineStage,
  memoryLevel,
}: { 
  event: ExecutionEvent | null;
  allEvents: ExecutionEvent[];
  pipelineStage: number;
  memoryLevel: number;
}) {
  // Track variables and their values
  const variableStates = useMemo(() => {
    const vars: Record<string, { value: string; type: string; lastModified: number }> = {};
    allEvents.forEach((e, i) => {
      if (e.variable && e.value) {
        vars[e.variable] = {
          value: e.value,
          type: isNaN(Number(e.value)) ? 'string' : (e.value.includes('.') ? 'float' : 'int'),
          lastModified: i + 1,
        };
      }
    });
    return vars;
  }, [allEvents]);
  
  // Generate dynamic context based on current state
  const getDynamicContext = () => {
    if (!event) {
      return {
        title: "Ready to Execute",
        description: "Click Step to begin executing your Python code. Each step will show you exactly how the CPU processes your instructions.",
        details: [
          "Your code will be broken into individual operations",
          "Watch data flow through CPU components",
          "See how values are stored in registers and memory",
        ],
        color: '#666',
        icon: '🎯',
      };
    }
    
    const stage = PIPELINE_STAGES[pipelineStage];
    const memory = MEMORY_LEVELS[memoryLevel];
    
    // Context based on operation type
    switch (event.type) {
      case 'ASSIGNMENT':
        if (event.operator) {
          // Computed assignment like x = a + b
          return {
            title: `Computing ${event.variable}`,
            description: `The CPU is calculating ${event.operand1} ${event.operator} ${event.operand2} and storing the result in ${event.variable}.`,
            details: [
              `📍 Current Pipeline Stage: ${stage.name} - ${stage.desc}`,
              `🔢 Operation: ${event.operand1} ${event.operator} ${event.operand2}`,
              `📦 Destination: Register for "${event.variable}"`,
              `⚡ This arithmetic operation takes ~1-3 CPU cycles`,
            ],
            color: '#22C55E',
            icon: '🔢',
            bytecode: `LOAD_NAME ${event.operand1}\nLOAD_NAME ${event.operand2}\nBINARY_${event.operator === '+' ? 'ADD' : event.operator === '-' ? 'SUBTRACT' : event.operator === '*' ? 'MULTIPLY' : 'DIVIDE'}\nSTORE_NAME ${event.variable}`,
          };
        }
        // Simple assignment like x = 5
        return {
          title: `Assigning ${event.variable} = ${event.value}`,
          description: `Creating a new variable "${event.variable}" and storing the value ${event.value} in a CPU register.`,
          details: [
            `📍 Current Pipeline Stage: ${stage.name} - ${stage.desc}`,
            `💾 Value: ${event.value} (${isNaN(Number(event.value)) ? 'string' : 'number'})`,
            `📦 Storage: Registers (1 cycle access)`,
            `🐍 In Python, this creates a PyObject in memory`,
          ],
          color: '#8B5CF6',
          icon: '📦',
          bytecode: `LOAD_CONST ${event.value}\nSTORE_NAME ${event.variable}`,
        };
        
      case 'ARITHMETIC':
        return {
          title: `ALU Processing: ${event.operand1} ${event.operator} ${event.operand2}`,
          description: `The Arithmetic Logic Unit (ALU) is performing a ${event.operator === '+' ? 'addition' : event.operator === '-' ? 'subtraction' : event.operator === '*' ? 'multiplication' : 'division'} operation.`,
          details: [
            `📍 Current Pipeline Stage: ${stage.name} - ${stage.desc}`,
            `🔢 Left Operand: ${event.operand1} ${variableStates[event.operand1!] ? `(= ${variableStates[event.operand1!].value})` : ''}`,
            `🔢 Right Operand: ${event.operand2} ${variableStates[event.operand2!] ? `(= ${variableStates[event.operand2!].value})` : ''}`,
            `⚡ Integer ${event.operator === '*' ? 'multiply: 3-4' : event.operator === '/' ? 'divide: 20-40' : 'add/sub: 1'} cycles`,
          ],
          color: '#22C55E',
          icon: '🔢',
          bytecode: `BINARY_${event.operator === '+' ? 'ADD' : event.operator === '-' ? 'SUBTRACT' : event.operator === '*' ? 'MULTIPLY' : 'DIVIDE'}`,
        };
        
      case 'MEMORY_READ':
        return {
          title: `Reading from Memory`,
          description: `The CPU is fetching data from memory. It checks cache levels first for faster access.`,
          details: [
            `📍 Current Pipeline Stage: ${stage.name} - ${stage.desc}`,
            `💾 Memory Level: ${memory.name} (${memory.speed})`,
            `📊 Cache hit = fast, Cache miss = slow (RAM access)`,
            `🔍 Address translation: Virtual → Physical`,
          ],
          color: '#3B82F6',
          icon: '📖',
          bytecode: `LOAD_GLOBAL/LOAD_NAME`,
        };
        
      case 'MEMORY_WRITE':
        return {
          title: `Writing to Memory`,
          description: `The CPU is storing data to memory through the cache hierarchy.`,
          details: [
            `📍 Current Pipeline Stage: ${stage.name} - ${stage.desc}`,
            `💾 Target Level: ${memory.name}`,
            `✍️ Write Policy: Write-back (cached first)`,
            `⏳ May be delayed until cache line eviction`,
          ],
          color: '#3B82F6',
          icon: '💾',
          bytecode: `STORE_NAME/STORE_GLOBAL`,
        };
        
      case 'PRINT':
        return {
          title: `Output: print()`,
          description: `Calling Python's print function to display output to the console.`,
          details: [
            `📍 Current Pipeline Stage: ${stage.name} - ${stage.desc}`,
            `🖥️ I/O operations are SLOW (~1000+ cycles)`,
            `🔄 Involves: System call → Kernel → Device driver`,
            `💡 Buffered output: May not appear immediately`,
          ],
          color: '#EC4899',
          icon: '🖥️',
          bytecode: `LOAD_NAME print\nLOAD_CONST/LOAD_NAME args\nCALL_FUNCTION 1`,
        };
        
      default:
        return {
          title: 'Processing',
          description: 'Executing instruction...',
          details: [`📍 Pipeline Stage: ${stage.name}`],
          color: '#666',
          icon: '⚙️',
        };
    }
  };
  
  const context = getDynamicContext();
  
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #222',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '14px',
        paddingBottom: '12px',
        borderBottom: '1px solid #222',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: `linear-gradient(135deg, ${context.color}, ${context.color}66)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
        }}>
          {context.icon}
        </div>
        <div>
          <div style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: context.color,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {context.title}
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div style={{
        fontSize: '11px',
        color: '#aaa',
        lineHeight: 1.6,
        marginBottom: '14px',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        {context.description}
      </div>
      
      {/* Details */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '14px',
      }}>
        {context.details.map((detail, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              fontSize: '10px',
              color: '#888',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '6px 10px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '6px',
              borderLeft: `2px solid ${context.color}44`,
            }}
          >
            {detail}
          </motion.div>
        ))}
      </div>
      
      {/* Bytecode preview */}
      {context.bytecode && (
        <div style={{
          background: '#0a0a12',
          borderRadius: '8px',
          padding: '10px 12px',
          border: '1px solid #222',
        }}>
          <div style={{
            fontSize: '9px',
            color: '#666',
            marginBottom: '6px',
            fontFamily: "'JetBrains Mono', monospace",
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <Binary size={12} />
            PYTHON BYTECODE
          </div>
          <pre style={{
            margin: 0,
            fontSize: '10px',
            color: '#F97316',
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 1.5,
          }}>
            {context.bytecode}
          </pre>
        </div>
      )}
    </div>
  );
}

// ============================================
// VARIABLE TRACKER - NEW!
// ============================================
function VariableTracker({ events }: { events: ExecutionEvent[] }) {
  const variables = useMemo(() => {
    const vars: Record<string, { value: string; history: string[]; type: string }> = {};
    events.forEach(e => {
      if (e.variable) {
        if (!vars[e.variable]) {
          vars[e.variable] = { value: '', history: [], type: 'unknown' };
        }
        const val = e.value || '?';
        vars[e.variable].value = val;
        vars[e.variable].history.push(val);
        vars[e.variable].type = isNaN(Number(val)) ? 'str' : (val.includes('.') ? 'float' : 'int');
      }
    });
    return vars;
  }, [events]);
  
  if (Object.keys(variables).length === 0) {
    return null;
  }
  
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '12px',
      padding: '14px',
      border: '1px solid #222',
    }}>
      <div style={{
        fontSize: '10px',
        color: '#666',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 'bold',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <Box size={12} />
        VARIABLES IN REGISTERS
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {Object.entries(variables).map(([name, data]) => (
          <div
            key={name}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '6px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#8B5CF6',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {name}
              </span>
              <span style={{
                fontSize: '9px',
                color: '#666',
                fontFamily: "'JetBrains Mono', monospace",
                background: 'rgba(0,0,0,0.3)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}>
                {data.type}
              </span>
            </div>
            <span style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#FFD700',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {data.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// INTERVIEW TIP - DYNAMIC
// ============================================
function InterviewTip({ event, pipelineStage }: { event: ExecutionEvent | null; pipelineStage: number }) {
  const getTip = () => {
    if (!event) {
      return {
        tip: "Memory hierarchy is the #1 topic in hardware interviews. Know your cache sizes (L1: 32KB, L2: 256KB, L3: 8MB) and latencies!",
        category: "General",
      };
    }
    
    const tips: Record<string, { tip: string; category: string }[]> = {
      ARITHMETIC: [
        { tip: "Integer ADD/SUB: 1 cycle. MUL: 3-4 cycles. DIV: 20-40 cycles. This is why compilers convert x/2 to x>>1!", category: "Performance" },
        { tip: "Modern CPUs have multiple ALUs for parallel execution. A single core can do 4-6 operations per cycle!", category: "Architecture" },
        { tip: "Floating-point operations use the FPU, not the integer ALU. They have different latencies.", category: "Hardware" },
      ],
      ASSIGNMENT: [
        { tip: "Python variables are references (pointers). x=5 creates a PyObject, x just points to it.", category: "Python Internals" },
        { tip: "Small integers (-5 to 256) are cached in Python. x=5 and y=5 point to the SAME object!", category: "Python Internals" },
        { tip: "Register allocation is a key compiler optimization. More registers = fewer memory accesses.", category: "Compilers" },
      ],
      MEMORY_READ: [
        { tip: "Cache miss penalty: L1 miss = 10 cycles, L2 miss = 40 cycles, L3 miss = 200 cycles (RAM access).", category: "Performance" },
        { tip: "Spatial locality: accessing arr[i] likely brings arr[i+1] to arr[i+15] into cache (64-byte cache line).", category: "Optimization" },
        { tip: "Temporal locality: recently accessed data is likely to be accessed again. Keep hot data together!", category: "Optimization" },
      ],
      MEMORY_WRITE: [
        { tip: "Write-back caches delay writes for efficiency. Data isn't in RAM until the cache line is evicted.", category: "Architecture" },
        { tip: "False sharing: Two threads writing to different variables in the same cache line = massive slowdown!", category: "Concurrency" },
      ],
      PRINT: [
        { tip: "I/O is 1000x slower than computation. Batch your prints! Don't print in tight loops.", category: "Performance" },
        { tip: "print() involves: Python → C → syscall → kernel → driver → device. Many context switches!", category: "Systems" },
      ],
    };
    
    const eventTips = tips[event.type] || [{ tip: "Understanding the full stack from Python to transistors will set you apart in interviews.", category: "General" }];
    const selectedTip = eventTips[Math.floor(Date.now() / 5000) % eventTips.length];
    
    return selectedTip;
  };
  
  const { tip, category } = getTip();
  
  return (
    <div style={{
      background: 'rgba(34, 197, 94, 0.1)',
      borderRadius: '12px',
      padding: '14px',
      border: '1px solid rgba(34, 197, 94, 0.3)',
    }}>
      <div style={{
        fontSize: '10px',
        color: '#22C55E',
        fontWeight: 'bold',
        marginBottom: '6px',
        fontFamily: "'JetBrains Mono', monospace",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lightbulb size={12} />
          INTERVIEW TIP
        </span>
        <span style={{
          fontSize: '8px',
          color: '#666',
          background: 'rgba(0,0,0,0.3)',
          padding: '2px 6px',
          borderRadius: '4px',
        }}>
          {category}
        </span>
      </div>
      <div style={{
        fontSize: '11px',
        color: '#888',
        lineHeight: 1.5,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        💡 {tip}
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function HardwareModeClean({ 
  executionEvents, 
  currentLine, 
  isRunning, 
  code 
}: HardwareModeCleanProps) {
  const [pipelineStage, setPipelineStage] = useState(0);
  const [memoryLevel, setMemoryLevel] = useState(0);
  
  const latestEvent = executionEvents.length > 0 ? executionEvents[executionEvents.length - 1] : null;
  
  const activeComponent = useMemo(() => {
    if (!latestEvent || !isRunning) return null;
    switch (latestEvent.type) {
      case 'ARITHMETIC': return 'alu';
      case 'ASSIGNMENT': return latestEvent.operator ? 'alu' : 'registers';
      case 'MEMORY_READ':
      case 'MEMORY_WRITE': return 'memory';
      default: return 'control';
    }
  }, [latestEvent, isRunning]);
  
  const currentValues = useMemo(() => {
    if (!latestEvent) return {};
    return {
      control: latestEvent.code?.slice(0, 20),
      alu: latestEvent.operator ? `${latestEvent.operand1} ${latestEvent.operator} ${latestEvent.operand2}` : undefined,
      registers: latestEvent.variable ? `${latestEvent.variable} = ${latestEvent.value || '?'}` : undefined,
      memory: latestEvent.type === 'MEMORY_WRITE' ? 'WRITE' : latestEvent.type === 'MEMORY_READ' ? 'READ' : undefined,
    };
  }, [latestEvent]);
  
  useEffect(() => {
    if (!isRunning) {
      setPipelineStage(0);
      return;
    }
    
    const interval = setInterval(() => {
      setPipelineStage(prev => (prev + 1) % 5);
    }, 600);
    
    return () => clearInterval(interval);
  }, [isRunning]);
  
  useEffect(() => {
    if (!isRunning || !latestEvent) {
      setMemoryLevel(0);
      return;
    }
    
    if (latestEvent.type === 'MEMORY_READ' || latestEvent.type === 'MEMORY_WRITE') {
      let level = 0;
      const interval = setInterval(() => {
        level++;
        if (level > 4) {
          clearInterval(interval);
          setMemoryLevel(0);
        } else {
          setMemoryLevel(level);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isRunning, latestEvent]);

  return (
    <div style={{ 
      display: 'flex',
      width: '100%', 
      height: '100%', 
      background: '#0A0A1E',
      overflow: 'hidden',
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {/* LEFT COLUMN */}
      <div style={{
        width: '280px',
        padding: '16px',
        borderRight: '1px solid #1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflow: 'auto',
      }}>
        <CodePanel 
          code={code} 
          currentLine={currentLine}
          executionEvents={executionEvents}
        />
        
        <ExplanationPanel 
          event={latestEvent}
          stepNumber={executionEvents.length}
        />
      </div>
      
      {/* CENTER COLUMN */}
      <div style={{
        flex: 1,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflow: 'auto',
      }}>
        <CPUDiagram 
          activeComponent={activeComponent}
          currentValues={currentValues}
        />
        
        <PipelineVisualization activeStage={pipelineStage} />
      </div>
      
      {/* RIGHT COLUMN - ENHANCED */}
      <div style={{
        width: '300px',
        padding: '16px',
        borderLeft: '1px solid #1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflow: 'auto',
      }}>
        {/* Dynamic Execution Context - NEW */}
        <DynamicExecutionContext 
          event={latestEvent}
          allEvents={executionEvents}
          pipelineStage={pipelineStage}
          memoryLevel={memoryLevel}
        />
        
        {/* Variable Tracker - NEW */}
        <VariableTracker events={executionEvents} />
        
        <MemoryHierarchy activeLevel={memoryLevel} />
        
        <InterviewTip event={latestEvent} pipelineStage={pipelineStage} />
      </div>
    </div>
  );
}

export default HardwareModeClean;
