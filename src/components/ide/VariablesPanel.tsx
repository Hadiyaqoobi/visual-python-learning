"use client";

import { AnimatePresence, motion } from "framer-motion";
import { VariableCard } from "./VariableCard";
import { Sparkles } from "lucide-react";

export interface Variable {
  name: string;
  value: string;
  type: string;
  isNew?: boolean;
  isUpdated?: boolean;
  previousValue?: string;
}

interface VariablesPanelProps {
  variables: Variable[];
  className?: string;
}

export function VariablesPanel({ variables, className = "" }: VariablesPanelProps) {
  // Filter out internal variables
  const displayVariables = variables.filter(
    (v) =>
      !v.name.startsWith("_") &&
      v.type !== "module" &&
      v.type !== "function" &&
      v.type !== "type" &&
      !v.name.includes("__")
  );

  // Empty state
  if (displayVariables.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 h-full bg-gradient-to-b from-slate-50 to-slate-100 ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3 
            }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-lg">
              <Sparkles className="w-10 h-10 text-blue-500" />
            </div>
          </motion.div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No Variables Yet
          </h3>
          <p className="text-slate-500 text-sm max-w-xs">
            Click <span className="font-medium text-blue-600">Step</span> or{" "}
            <span className="font-medium text-green-600">Play</span> to execute
            your code and watch variables come to life!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`h-full bg-gradient-to-b from-slate-50 to-slate-100 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 py-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-semibold text-slate-700">
              Variables in Memory
            </span>
          </div>
          <motion.span
            key={displayVariables.length}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-sm font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700"
          >
            {displayVariables.length} variable{displayVariables.length !== 1 ? "s" : ""}
          </motion.span>
        </div>
      </motion.div>

      {/* Variables Grid */}
      <div className="p-4">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {displayVariables.map((variable) => (
              <VariableCard
                key={variable.name}
                name={variable.name}
                value={variable.value}
                type={variable.type}
                isNew={variable.isNew}
                isUpdated={variable.isUpdated}
                previousValue={variable.previousValue}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="px-4 pb-4"
      >
        <div className="flex flex-wrap gap-2 justify-center pt-4 border-t border-slate-200">
          {[
            { type: "int", icon: "🔢", color: "#3B82F6" },
            { type: "str", icon: "📝", color: "#10B981" },
            { type: "float", icon: "🎯", color: "#8B5CF6" },
            { type: "bool", icon: "⚡", color: "#F97316" },
            { type: "list", icon: "📋", color: "#EC4899" },
          ].map((item) => (
            <div
              key={item.type}
              className="flex items-center gap-1.5 text-xs text-slate-600"
            >
              <span>{item.icon}</span>
              <span style={{ color: item.color }} className="font-medium">
                {item.type}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default VariablesPanel;
