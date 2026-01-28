"use client";

import { motion } from "framer-motion";

export interface VariableCardProps {
  name: string;
  value: string;
  type: string;
  memoryAddress?: string;
  isNew?: boolean;
  isUpdated?: boolean;
  previousValue?: string;
}

// Beautiful color themes by type
const typeThemes: Record<string, {
  bg: string;
  bgHover: string;
  border: string;
  borderHover: string;
  text: string;
  valueBg: string;
  icon: string;
  glow: string;
}> = {
  int: {
    bg: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
    bgHover: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
    border: "#3B82F6",
    borderHover: "#2563EB",
    text: "#1D4ED8",
    valueBg: "rgba(59, 130, 246, 0.1)",
    icon: "🔢",
    glow: "0 0 30px rgba(59, 130, 246, 0.4)",
  },
  float: {
    bg: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
    bgHover: "linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)",
    border: "#8B5CF6",
    borderHover: "#7C3AED",
    text: "#6D28D9",
    valueBg: "rgba(139, 92, 246, 0.1)",
    icon: "🎯",
    glow: "0 0 30px rgba(139, 92, 246, 0.4)",
  },
  str: {
    bg: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
    bgHover: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
    border: "#10B981",
    borderHover: "#059669",
    text: "#047857",
    valueBg: "rgba(16, 185, 129, 0.1)",
    icon: "📝",
    glow: "0 0 30px rgba(16, 185, 129, 0.4)",
  },
  bool: {
    bg: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
    bgHover: "linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)",
    border: "#F97316",
    borderHover: "#EA580C",
    text: "#C2410C",
    valueBg: "rgba(249, 115, 22, 0.1)",
    icon: "⚡",
    glow: "0 0 30px rgba(249, 115, 22, 0.4)",
  },
  list: {
    bg: "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)",
    bgHover: "linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)",
    border: "#EC4899",
    borderHover: "#DB2777",
    text: "#BE185D",
    valueBg: "rgba(236, 72, 153, 0.1)",
    icon: "📋",
    glow: "0 0 30px rgba(236, 72, 153, 0.4)",
  },
  tuple: {
    bg: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
    bgHover: "linear-gradient(135deg, #FDE68A 0%, #FCD34D 100%)",
    border: "#F59E0B",
    borderHover: "#D97706",
    text: "#B45309",
    valueBg: "rgba(245, 158, 11, 0.1)",
    icon: "📦",
    glow: "0 0 30px rgba(245, 158, 11, 0.4)",
  },
  dict: {
    bg: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
    bgHover: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
    border: "#0EA5E9",
    borderHover: "#0284C7",
    text: "#0369A1",
    valueBg: "rgba(14, 165, 233, 0.1)",
    icon: "🗂️",
    glow: "0 0 30px rgba(14, 165, 233, 0.4)",
  },
};

const defaultTheme = {
  bg: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
  bgHover: "linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)",
  border: "#64748B",
  borderHover: "#475569",
  text: "#334155",
  valueBg: "rgba(100, 116, 139, 0.1)",
  icon: "📌",
  glow: "0 0 30px rgba(100, 116, 139, 0.4)",
};

function generateAddress(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash = hash & hash;
  }
  return `0x${Math.abs(hash).toString(16).padStart(6, '0').slice(0, 6).toUpperCase()}`;
}

function formatValue(value: string, type: string): string {
  if (type === 'str' && value.length > 20) {
    return value.slice(0, 20) + '...';
  }
  if ((type === 'list' || type === 'tuple' || type === 'dict') && value.length > 25) {
    return value.slice(0, 25) + '...';
  }
  return value;
}

export function VariableCard({
  name,
  value,
  type,
  memoryAddress,
  isNew = false,
  isUpdated = false,
  previousValue,
}: VariableCardProps) {
  const theme = typeThemes[type] || defaultTheme;
  const address = memoryAddress || generateAddress(name);
  const displayValue = formatValue(value, type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        boxShadow: isNew
          ? [
              "0 4px 12px rgba(0,0,0,0.1)",
              theme.glow,
              "0 4px 12px rgba(0,0,0,0.1)",
            ]
          : "0 4px 12px rgba(0,0,0,0.1)",
      }}
      exit={{ opacity: 0, scale: 0.8, y: -20, rotate: -5 }}
      whileHover={{
        scale: 1.02,
        y: -4,
        boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
        boxShadow: isNew ? { duration: 1, times: [0, 0.3, 1] } : { duration: 0.2 },
      }}
      className="rounded-xl overflow-hidden cursor-pointer"
      style={{
        background: theme.bg,
        border: `2px solid ${theme.border}`,
      }}
    >
      {/* Update flash overlay */}
      {isUpdated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.8, times: [0, 0.2, 1] }}
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ backgroundColor: "#FEF3C7" }}
        />
      )}

      <div className="p-4 relative">
        {/* Header: Icon + Name */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{theme.icon}</span>
          <span
            className="font-semibold text-lg tracking-tight"
            style={{ color: theme.text }}
          >
            {name}
          </span>
        </div>

        {/* Value - Large and prominent */}
        <div
          className="rounded-lg py-4 px-3 mb-3"
          style={{ backgroundColor: theme.valueBg }}
        >
          <motion.div
            key={value}
            initial={isUpdated ? { opacity: 0, scale: 1.2 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="font-mono text-2xl md:text-3xl font-bold text-center break-all"
            style={{ color: theme.text }}
          >
            {displayValue}
          </motion.div>

          {/* Previous value indicator */}
          {isUpdated && previousValue && (
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-sm mt-1 line-through opacity-50"
              style={{ color: theme.text }}
            >
              {formatValue(previousValue, type)}
            </motion.div>
          )}
        </div>

        {/* Footer: Type + Address */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-medium uppercase tracking-wider px-2 py-1 rounded-full"
            style={{
              backgroundColor: theme.valueBg,
              color: theme.text,
            }}
          >
            {type}
          </span>
          <span
            className="text-xs font-mono opacity-50"
            style={{ color: theme.text }}
          >
            {address}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default VariableCard;
