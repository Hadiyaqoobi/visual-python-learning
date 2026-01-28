"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { BookOpen, Code, Trophy, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "32px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "32px" }}
        >
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
            Welcome back{user?.name ? `, ${user.name}` : ""}! 👋
          </h1>
          <p style={{ fontSize: "16px", color: "#64748b" }}>
            Ready to continue your Python journey?
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginBottom: "32px",
        }}>
          <Link href="/learn" style={{ textDecoration: "none" }}>
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(99, 102, 241, 0.15)" }}
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                borderRadius: "16px",
                padding: "24px",
                color: "white",
                cursor: "pointer",
              }}
            >
              <BookOpen style={{ width: "32px", height: "32px", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                Continue Learning
              </h3>
              <p style={{ fontSize: "14px", opacity: 0.9, marginBottom: "16px" }}>
                Pick up where you left off in the curriculum
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "500" }}>
                Start Chapter 1 <ArrowRight style={{ width: "16px", height: "16px" }} />
              </div>
            </motion.div>
          </Link>

          <Link href="/ide" style={{ textDecoration: "none" }}>
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(34, 197, 94, 0.15)" }}
              style={{
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                borderRadius: "16px",
                padding: "24px",
                color: "white",
                cursor: "pointer",
              }}
            >
              <Code style={{ width: "32px", height: "32px", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                Open IDE
              </h3>
              <p style={{ fontSize: "14px", opacity: 0.9, marginBottom: "16px" }}>
                Write and run Python code with visualizations
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "500" }}>
                Launch IDE <ArrowRight style={{ width: "16px", height: "16px" }} />
              </div>
            </motion.div>
          </Link>

          <Link href="/achievements" style={{ textDecoration: "none" }}>
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(245, 158, 11, 0.15)" }}
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                borderRadius: "16px",
                padding: "24px",
                color: "white",
                cursor: "pointer",
              }}
            >
              <Trophy style={{ width: "32px", height: "32px", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                Achievements
              </h3>
              <p style={{ fontSize: "14px", opacity: 0.9, marginBottom: "16px" }}>
                Track your progress and earn badges
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "500" }}>
                View All <ArrowRight style={{ width: "16px", height: "16px" }} />
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b", marginBottom: "20px" }}>
            Your Progress
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#6366f1" }}>0</div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>Lessons Completed</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#22c55e" }}>0</div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>Exercises Done</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#f59e0b" }}>0</div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>XP Earned</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                <Zap style={{ width: "24px", height: "24px", color: "#ef4444" }} />
                <span style={{ fontSize: "32px", fontWeight: "700", color: "#ef4444" }}>0</span>
              </div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>Day Streak</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
