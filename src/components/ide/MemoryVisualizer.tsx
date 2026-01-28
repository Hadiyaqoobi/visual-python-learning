"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Box, List, Hash, Type, ToggleLeft, Braces } from "lucide-react";

export interface Variable {
  name: string;
  value: string;
  type: string;
}

interface MemoryVisualizerProps {
  variables: Variable[];
  className?: string;
}

// Color mapping for different types with actual color values
const typeConfig: Record<string, { bg: string; border: string; text: string; icon: React.ReactNode; label: string }> = {
  int: { 
    bg: "rgba(59, 130, 246, 0.2)", 
    border: "#60a5fa", 
    text: "#60a5fa",
    icon: <Hash className="w-4 h-4" />,
    label: "Integer"
  },
  float: { 
    bg: "rgba(34, 211, 238, 0.2)", 
    border: "#22d3ee", 
    text: "#22d3ee",
    icon: <Hash className="w-4 h-4" />,
    label: "Float"
  },
  str: { 
    bg: "rgba(34, 197, 94, 0.2)", 
    border: "#4ade80", 
    text: "#4ade80",
    icon: <Type className="w-4 h-4" />,
    label: "String"
  },
  bool: { 
    bg: "rgba(251, 191, 36, 0.2)", 
    border: "#fbbf24", 
    text: "#fbbf24",
    icon: <ToggleLeft className="w-4 h-4" />,
    label: "Boolean"
  },
  list: { 
    bg: "rgba(168, 85, 247, 0.2)", 
    border: "#a855f7", 
    text: "#a855f7",
    icon: <List className="w-4 h-4" />,
    label: "List"
  },
  dict: { 
    bg: "rgba(236, 72, 153, 0.2)", 
    border: "#ec4899",
    text: "#ec4899",
    icon: <Braces className="w-4 h-4" />,
    label: "Dictionary"
  },
  tuple: { 
    bg: "rgba(249, 115, 22, 0.2)", 
    border: "#f97316", 
    text: "#f97316",
    icon: <Box className="w-4 h-4" />,
    label: "Tuple"
  },
  NoneType: { 
    bg: "rgba(100, 116, 139, 0.2)", 
    border: "#64748b", 
    text: "#64748b",
    icon: <Box className="w-4 h-4" />,
    label: "None"
  },
};

const defaultConfig = { 
  bg: "rgba(100, 116, 139, 0.2)", 
  border: "#64748b", 
  text: "#64748b",
  icon: <Box className="w-4 h-4" />,
  label: "Object"
};

function generateAddress(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash = hash & hash;
  }
  return `0x${Math.abs(hash).toString(16).padStart(8, '0').slice(0, 8)}`;
}

function parseCollectionValue(value: string, type: string): string[] | null {
  if (type === 'list' || type === 'tuple') {
    try {
      const inner = value.slice(1, -1);
      if (!inner.trim()) return [];
      return inner.split(',').map(v => v.trim());
    } catch {
      return null;
    }
  }
  return null;
}

function MemoryBox({ variable }: { variable: Variable }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = typeConfig[variable.type] || defaultConfig;
  const address = generateAddress(variable.name);
  const collectionItems = parseCollectionValue(variable.value, variable.type);
  const isCollection = collectionItems !== null;

  return (
    <div className="flex items-start gap-3">
      {/* Variable name (pointer) */}
      <div className="flex flex-col items-center">
        <div 
          className="px-3 py-1.5 rounded font-mono text-sm text-white font-medium shadow-lg"
          style={{ backgroundColor: '#334155', border: '1px solid #475569' }}
        >
          {variable.name}
        </div>
        <svg className="w-6 h-8" viewBox="0 0 24 32">
          <line x1="12" y1="0" x2="12" y2="24" stroke="#64748b" strokeWidth="2"/>
          <polygon points="6,24 12,32 18,24" fill="#64748b"/>
        </svg>
      </div>

      {/* Memory box */}
      <div 
        className={cn(
          "flex-1 rounded-lg overflow-hidden shadow-lg",
          isCollection && "cursor-pointer"
        )}
        style={{ 
          backgroundColor: config.bg, 
          border: `2px solid ${config.border}` 
        }}
        onClick={() => isCollection && setIsExpanded(!isExpanded)}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-3 py-2"
          style={{ backgroundColor: config.bg }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: config.text }}>{config.icon}</span>
            <span className="text-xs font-medium" style={{ color: config.text }}>{config.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>{address}</span>
            {isCollection && (
              <span style={{ color: config.text }}>
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </span>
            )}
          </div>
        </div>

        {/* Value */}
        <div className="px-3 py-2" style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}>
          {!isCollection ? (
            <div className="font-mono text-white text-sm break-all">
              {variable.value}
            </div>
          ) : (
            <>
              {!isExpanded ? (
                <div className="font-mono text-white text-sm">
                  {variable.value.length > 50 ? variable.value.slice(0, 50) + '...' : variable.value}
                  <span style={{ color: '#94a3b8' }} className="ml-2">({collectionItems.length} items)</span>
                </div>
              ) : (
                <div className="space-y-1 mt-1">
                  {collectionItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="font-mono text-xs w-8" style={{ color: '#64748b' }}>[{index}]</span>
                      <div 
                        className="flex-1 px-2 py-1 rounded font-mono text-sm text-white"
                        style={{ backgroundColor: 'rgba(51, 65, 85, 0.5)', border: '1px solid #475569' }}
                      >
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function MemoryVisualizer({ variables, className }: MemoryVisualizerProps) {
  const userVariables = variables.filter(v => 
    !v.name.startsWith('_') && 
    v.type !== 'module' &&
    v.type !== 'function' &&
    v.type !== 'type' &&
    !v.name.includes('__')
  );

  if (userVariables.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8", className)} style={{ color: '#64748b' }}>
        <Box className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm">No variables in memory</p>
        <p className="text-xs mt-1">Run your code to see memory visualization</p>
      </div>
    );
  }

  return (
    <div className={cn("p-4 space-y-4 min-h-full", className)} style={{ backgroundColor: '#0f172a' }}>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 pb-3" style={{ borderBottom: '1px solid #334155' }}>
        {Object.entries(typeConfig).slice(0, 6).map(([type, config]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: config.bg, border: `2px solid ${config.border}` }} 
            />
            <span className="text-xs" style={{ color: config.text }}>{type}</span>
          </div>
        ))}
      </div>

      {/* Memory boxes */}
      <div className="space-y-4">
        {userVariables.map((variable, index) => (
          <MemoryBox key={`${variable.name}-${index}`} variable={variable} />
        ))}
      </div>
    </div>
  );
}

export default MemoryVisualizer;
