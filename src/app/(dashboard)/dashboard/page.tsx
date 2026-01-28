"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { BookOpen, Code, Trophy, ArrowRight, Zap, Clock, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

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
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "32px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                Welcome back{user?.name ? `, ${user.name}` : ""}! 
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
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <Clock style={{ width: "18px", height: "18px", color: "#64748b" }} />
              <span style={{ fontSize: "14px", color: "#64748b" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: `${stat.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Icon style={{ width: "22px", height: "22px", color: stat.color }} />
                  </div>
                </div>
                <div style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", marginBottom: "4px" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 style={{ 
            fontSize: "20px", 
            fontWeight: "700", 
            color: "#1e293b", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <Zap style={{ width: "20px", height: "20px", color: "#f59e0b" }} />
            Quick Actions
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}>
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} href={action.href} style={{ textDecoration: "none" }}>
                  <motion.div
                    whileHover={{ 
                      y: -6, 
                      boxShadow: `0 20px 40px ${action.shadowColor}`,
                    }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: action.gradient,
                      borderRadius: "20px",
                      padding: "28px",
                      color: "white",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Background decoration */}
                    <div style={{
                      position: "absolute",
                      top: "-20%",
                      right: "-10%",
                      width: "150px",
                      height: "150px",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "50%",
                    }} />
                    
                    <Icon style={{ width: "36px", height: "36px", marginBottom: "20px" }} />
                    <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>
                      {action.title}
                    </h3>
                    <p style={{ fontSize: "14px", opacity: 0.9, marginBottom: "20px" }}>
                      {action.description}
                    </p>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "8px", 
                      fontSize: "14px", 
                      fontWeight: "600" 
                    }}>
                      Get Started <ArrowRight style={{ width: "16px", height: "16px" }} />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity / Continue Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: "32px" }}
        >
          <h2 style={{ 
            fontSize: "20px", 
            fontWeight: "700", 
            color: "#1e293b", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <BookOpen style={{ width: "20px", height: "20px", color: "#6366f1" }} />
            Continue Where You Left Off
          </h2>
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "24px",
                fontWeight: "800",
              }}>
                1
              </div>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>
                  Chapter 1: Getting Started
                </h3>
                <p style={{ fontSize: "14px", color: "#64748b" }}>
                  5 lessons • Introduction to computation and Python basics
                </p>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "12px",
                }}>
                  <div style={{
                    flex: 1,
                    maxWidth: "200px",
                    height: "8px",
                    background: "#e2e8f0",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      width: "0%",
                      height: "100%",
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      borderRadius: "10px",
                    }} />
                  </div>
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                    0% complete
                  </span>
                </div>
              </div>
            </div>
            <Link href="/learn" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 24px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                }}
              >
                Continue
                <ArrowRight style={{ width: "16px", height: "16px" }} />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
