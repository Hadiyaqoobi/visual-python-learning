"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { motion } from "framer-motion";
import { Code2, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <AuthBackground />
      <div style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px 40px 24px",
      }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
            <div style={{ width: "50px", height: "50px", borderRadius: "14px", background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(99, 102, 241, 0.5)" }}>
              <Code2 style={{ width: "26px", height: "26px", color: "white" }} />
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "white" }}>Visual Python</h1>
          </div>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Sparkles style={{ width: "16px", height: "16px", color: "#fbbf24" }} />
            See your code come to life
          </p>
        </motion.div>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <LoginForm />
        </div>
        <p style={{ marginTop: "28px", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Start learning Python visually</p>
      </div>
    </div>
  );
}
