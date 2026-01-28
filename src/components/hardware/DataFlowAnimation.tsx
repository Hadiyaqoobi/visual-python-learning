"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DataFlowProps {
  isActive: boolean;
  value?: string;
  color?: "blue" | "green" | "purple" | "orange";
  className?: string;
}

const colorStyles = {
  blue: { bg: "bg-blue-500", glow: "shadow-blue-500/50", text: "text-blue-400" },
  green: { bg: "bg-green-500", glow: "shadow-green-500/50", text: "text-green-400" },
  purple: { bg: "bg-purple-500", glow: "shadow-purple-500/50", text: "text-purple-400" },
  orange: { bg: "bg-orange-500", glow: "shadow-orange-500/50", text: "text-orange-400" },
};

export function VerticalDataFlow({
  isActive,
  value,
  color = "blue",
  className,
}: DataFlowProps) {
  const styles = colorStyles[color];

  return (
    <div className={cn("flex justify-center py-2", className)}>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 60 }}
            exit={{ opacity: 0, height: 0 }}
            className="relative flex flex-col items-center"
          >
            {/* Line */}
            <div className="w-0.5 h-full bg-slate-600 relative overflow-hidden">
              <motion.div
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className={cn("absolute w-full h-1/2", styles.bg)}
              />
            </div>

            {/* Arrow */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn("w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent", 
                color === "blue" && "border-t-blue-500",
                color === "green" && "border-t-green-500",
                color === "purple" && "border-t-purple-500",
                color === "orange" && "border-t-orange-500"
              )}
            />

            {/* Value Badge */}
            {value && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 left-4 px-2 py-1 rounded text-xs font-mono font-bold shadow-lg",
                  styles.bg, styles.glow, "text-white"
                )}
              >
                {value}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DataFlowAnimation({ isActive, value, color = "blue", className }: DataFlowProps) {
  return <VerticalDataFlow isActive={isActive} value={value} color={color} className={className} />;
}

export default DataFlowAnimation;
