"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { 
  BarChart3, 
  BookOpen, 
  Target, 
  Zap, 
  Clock, 
  TrendingUp,
  Calendar,
  CheckCircle
} from "lucide-react";

export default function ProgressPage() {
  const { user } = useAuth();

  const weeklyData = [
    { day: "Mon", lessons: 0, minutes: 0 },
    { day: "Tue", lessons: 0, minutes: 0 },
    { day: "Wed", lessons: 0, minutes: 0 },
    { day: "Thu", lessons: 0, minutes: 0 },
    { day: "Fri", lessons: 0, minutes: 0 },
    { day: "Sat", lessons: 0, minutes: 0 },
    { day: "Sun", lessons: 0, minutes: 0 },
  ];

  const stats = [
    { label: "Total XP", value: user?.totalXp || 0, icon: Zap, color: "#f59e0b" },
    { label: "Lessons Completed", value: 0, icon: BookOpen, color: "#6366f1" },
    { label: "Exercises Done", value: 0, icon: Target, color: "#22c55e" },
    { label: "Time Spent", value: "0h", icon: Clock, color: "#8b5cf6" },
  ];

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
      padding: "32px",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "32px" }}
        >
          <h1 style={{ 
            fontSize: "32px", 
            fontWeight: "800", 
            color: "#1e293b", 
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}>
            <BarChart3 style={{ width: "32px", height: "32px", color: "#6366f1" }} />
            Your Progress
          </h1>
          <p style={{ fontSize: "16px", color: "#64748b" }}>
            Track your learning journey and see how far you've come.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: `${stat.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}>
                  <Icon style={{ width: "24px", height: "24px", color: stat.color }} />
                </div>
                <div style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", marginBottom: "4px" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            marginBottom: "32px",
          }}
        >
          <h2 style={{ 
            fontSize: "20px", 
            fontWeight: "700", 
            color: "#1e293b", 
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <Calendar style={{ width: "22px", height: "22px", color: "#6366f1" }} />
            This Week's Activity
          </h2>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "200px" }}>
            {weeklyData.map((day, index) => (
              <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "48px",
                  height: `${Math.max(day.minutes * 2, 20)}px`,
                  background: day.minutes > 0 
                    ? "linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)"
                    : "#e2e8f0",
                  borderRadius: "8px 8px 4px 4px",
                  transition: "height 0.3s ease",
                }} />
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>{day.day}</span>
              </div>
            ))}
          </div>

          <div style={{ 
            marginTop: "24px", 
            padding: "16px", 
            background: "#f8fafc", 
            borderRadius: "12px",
            textAlign: "center",
          }}>
            <p style={{ color: "#64748b", fontSize: "14px" }}>
              🎯 Start learning to see your activity here!
            </p>
          </div>
        </motion.div>

        {/* Learning Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            borderRadius: "20px",
            padding: "28px",
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                <TrendingUp style={{ width: "24px", height: "24px" }} />
                Learning Streak
              </h2>
              <p style={{ fontSize: "14px", opacity: 0.9 }}>
                Keep learning daily to build your streak!
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "56px", fontWeight: "800" }}>
                {user?.currentStreak || 0}
              </div>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>days</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
