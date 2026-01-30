"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { motion } from "framer-motion";
import { Code2, Sparkles, Zap, Binary, Braces, Terminal, Cpu, GitBranch } from "lucide-react";

export default function LoginPage() {
  const floatingIcons = [
    { Icon: Binary, delay: 0, x: "10%", y: "20%" },
    { Icon: Braces, delay: 0.5, x: "85%", y: "15%" },
    { Icon: Terminal, delay: 1, x: "15%", y: "75%" },
    { Icon: Cpu, delay: 1.5, x: "80%", y: "70%" },
    { Icon: GitBranch, delay: 2, x: "50%", y: "85%" },
    { Icon: Code2, delay: 2.5, x: "90%", y: "45%" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute",
          top: "40%",
          left: "30%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
        }}
      />

      {/* Floating code icons */}
      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: x,
            top: y,
          }}
        >
          <Icon style={{ width: "40px", height: "40px", color: "rgba(255,255,255,0.15)" }} />
        </motion.div>
      ))}

      {/* Grid pattern overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      <div style={{ width: "100%", maxWidth: "480px", position: "relative", zIndex: 1 }}>
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: "40px" }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 15 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 15px 40px rgba(99, 102, 241, 0.5), 0 0 0 1px rgba(255,255,255,0.1) inset",
            }}>
              <Code2 style={{ width: "32px", height: "32px", color: "white" }} />
            </div>
            <h1 style={{ 
              fontSize: "36px", 
              fontWeight: "800", 
              color: "white",
              letterSpacing: "-1px",
            }}>
              Visual Python
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ 
              fontSize: "18px", 
              color: "rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Sparkles style={{ width: "20px", height: "20px", color: "#fbbf24" }} />
            See your code come to life
          </motion.p>
        </motion.div>

        {/* Login Form */}
        <LoginForm />

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            marginTop: "40px",
          }}
        >
          {[
            { icon: Terminal, text: "Interactive IDE", color: "#22c55e" },
            { icon: Sparkles, text: "Visual Execution", color: "#f59e0b" },
            { icon: Zap, text: "Instant Feedback", color: "#6366f1" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.05 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "rgba(255,255,255,0.7)",
                fontWeight: "500",
              }}
            >
              <feature.icon style={{ width: "18px", height: "18px", color: feature.color }} />
              {feature.text}
            </motion.div>
          ))}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          style={{
            textAlign: "center",
            marginTop: "48px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
            Trusted by 10,000+ learners worldwide
          </p>
        </motion.div>
      </div>
    </div>
  );
}
