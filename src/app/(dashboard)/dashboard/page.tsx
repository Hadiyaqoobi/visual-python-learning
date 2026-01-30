"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { BookOpen, Code, Trophy, ArrowRight, Zap, Clock, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { VIPWelcomeModal } from "@/components/ui/VIPWelcomeModal";

export default function DashboardPage() {
  const { user } = useAuth();

  const quickActions = [
    {
      href: "/learn",
      icon: BookOpen,
      title: "Continue Learning",
      description: "Pick up where you left off",
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      shadowColor: "rgba(99, 102, 241, 0.3)",
    },
    {
      href: "/ide",
      icon: Code,
      title: "Open IDE",
      description: "Write and visualize code",
      gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      shadowColor: "rgba(34, 197, 94, 0.3)",
    },
    {
      href: "/achievements",
      icon: Trophy,
      title: "Achievements",
      description: "View your badges",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      shadowColor: "rgba(245, 158, 11, 0.3)",
    },
  ];

  const stats = [
    { label: "Lessons Completed", value: "0", icon: BookOpen, color: "#6366f1" },
    { label: "Exercises Done", value: "0", icon: Target, color: "#22c55e" },
    { label: "XP Earned", value: user?.totalXp || 0, icon: Zap, color: "#f59e0b" },
    { label: "Day Streak", value: user?.currentStreak || 0, icon: TrendingUp, color: "#ef4444" },
  ];

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
      padding: "32px",
    }}>
      {/* VIP Welcome Modal - Only shows for Sahar on first login */}
      {user?.email && <VIPWelcomeModal userEmail={user.email} />}

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "32px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ 
                fontSize: "32px", 
                fontWeight: "800", 
                color: "#1e293b", 
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}>
                Welcome back{user?.username ? `, ${user.username}` : ""}! 
                <span style={{ fontSize: "32px" }}>👋</span>
              </h1>
              <p style={{ fontSize: "16px", color: "#64748b" }}>
                Ready to continue your Python journey?
              </p>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}>
              <Clock style={{ width: "18px", height: "18px", color: "#6366f1" }} />
              <span style={{ fontSize: "14px", color: "#64748b" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
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
              }}>
                <stat.icon style={{ width: "24px", height: "24px", color: stat.color }} />
              </div>
              <div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b" }}>{stat.value}</div>
                <div style={{ fontSize: "13px", color: "#64748b" }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>
            Quick Actions
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}>
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href} style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: `0 20px 40px ${action.shadowColor}` }}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "28px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: action.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    boxShadow: `0 8px 20px ${action.shadowColor}`,
                  }}>
                    <action.icon style={{ width: "28px", height: "28px", color: "white" }} />
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>
                    {action.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "12px" }}>
                    {action.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6366f1", fontWeight: "600", fontSize: "14px" }}>
                    Get Started <ArrowRight style={{ width: "16px", height: "16px" }} />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: "32px" }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>
            Continue Where You Left Off
          </h2>
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <BookOpen style={{ width: "32px", height: "32px", color: "white" }} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
              Start Your First Lesson
            </h3>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
              Begin with Chapter 1 and learn the fundamentals of Python programming
            </p>
            <Link href="/learn" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "14px 32px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "white",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)",
                }}
              >
                Browse Chapters
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
