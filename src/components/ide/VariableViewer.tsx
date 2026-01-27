"use client";

import { cn } from "@/lib/utils";

export interface Variable {
  name: string;
  value: string;
  type: string;
}

interface VariableViewerProps {
  variables: Variable[];
  className?: string;
}

const typeColors: Record<string, string> = {
  int: "text-blue-400",
  float: "text-blue-400",
  str: "text-green-400",
  bool: "text-amber-400",
  list: "text-purple-400",
  dict: "text-pink-400",
  tuple: "text-cyan-400",
  set: "text-orange-400",
  NoneType: "text-slate-500",
};

export function VariableViewer({ variables, className }: VariableViewerProps) {
  if (variables.length === 0) {
    return (
      <div className={cn("p-4 text-slate-500 text-sm italic", className)}>
        No variables defined yet
      </div>
    );
  }

  return (
    <div className={cn("overflow-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 border-b border-slate-700">
            <th className="px-4 py-2 font-medium">Name</th>
            <th className="px-4 py-2 font-medium">Value</th>
            <th className="px-4 py-2 font-medium">Type</th>
          </tr>
        </thead>
        <tbody>
          {variables.map((variable, index) => (
            <tr
              key={`${variable.name}-${index}`}
              className="border-b border-slate-800 hover:bg-slate-800/50"
            >
              <td className="px-4 py-2 font-mono text-white">
                {variable.name}
              </td>
              <td className="px-4 py-2 font-mono text-slate-300 max-w-xs truncate">
                {variable.value}
              </td>
              <td className={cn("px-4 py-2 font-mono", typeColors[variable.type] || "text-slate-400")}>
                {variable.type}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VariableViewer;
