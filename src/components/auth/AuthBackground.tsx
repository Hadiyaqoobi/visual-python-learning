"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  path: number;
}

export function AuthBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 3 + 2,
        path: Math.floor(Math.random() * 5),
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "linear-gradient(135deg, #0a0a1a 0%, #0f172a 30%, #1e1b4b 70%, #0f0f2a 100%)",
      overflow: "hidden",
      zIndex: 0,
    }}>
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{
          position: "absolute",
          top: "40%",
          left: "40%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />

      {/* Circuit board pattern */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
        <defs>
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 50 30 M 50 70 L 50 100 M 0 50 L 30 50 M 70 50 L 100 50" stroke="#6366f1" strokeWidth="1" fill="none" />
            <circle cx="50" cy="50" r="4" fill="none" stroke="#6366f1" strokeWidth="1" />
            <circle cx="50" cy="30" r="2" fill="#6366f1" />
            <circle cx="50" cy="70" r="2" fill="#6366f1" />
            <circle cx="30" cy="50" r="2" fill="#6366f1" />
            <circle cx="70" cy="50" r="2" fill="#6366f1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>

      {/* Horizontal circuit lines */}
      {[15, 35, 55, 75, 90].map((top, i) => (
        <div key={`h-${i}`} style={{ position: "absolute", top: `${top}%`, left: 0, right: 0, height: "1px", background: "rgba(99, 102, 241, 0.1)" }}>
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
            style={{
              position: "absolute",
              width: "100px",
              height: "3px",
              background: "linear-gradient(90deg, transparent, #6366f1, #22c55e, transparent)",
              borderRadius: "2px",
              boxShadow: "0 0 20px #6366f1, 0 0 40px #22c55e",
            }}
          />
        </div>
      ))}

      {/* Vertical circuit lines */}
      {[10, 25, 50, 75, 90].map((left, i) => (
        <div key={`v-${i}`} style={{ position: "absolute", left: `${left}%`, top: 0, bottom: 0, width: "1px", background: "rgba(99, 102, 241, 0.1)" }}>
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "linear", delay: i * 0.7 }}
            style={{
              position: "absolute",
              width: "3px",
              height: "80px",
              background: "linear-gradient(180deg, transparent, #8b5cf6, #6366f1, transparent)",
              borderRadius: "2px",
              boxShadow: "0 0 15px #8b5cf6",
            }}
          />
        </div>
      ))}

      {/* CPU/ALU Node - Top Left */}
      <motion.div
        animate={{ 
          boxShadow: [
            "0 0 20px rgba(99, 102, 241, 0.3), inset 0 0 20px rgba(99, 102, 241, 0.1)",
            "0 0 40px rgba(99, 102, 241, 0.5), inset 0 0 30px rgba(99, 102, 241, 0.2)",
            "0 0 20px rgba(99, 102, 241, 0.3), inset 0 0 20px rgba(99, 102, 241, 0.1)",
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "15%",
          left: "8%",
          width: "80px",
          height: "80px",
          border: "2px solid rgba(99, 102, 241, 0.4)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(99, 102, 241, 0.1)",
        }}
      >
        <span style={{ color: "rgba(99, 102, 241, 0.6)", fontSize: "12px", fontWeight: "bold", fontFamily: "monospace" }}>CPU</span>
      </motion.div>

      {/* ALU Node - Bottom Right */}
      <motion.div
        animate={{ 
          boxShadow: [
            "0 0 20px rgba(34, 197, 94, 0.3), inset 0 0 20px rgba(34, 197, 94, 0.1)",
            "0 0 40px rgba(34, 197, 94, 0.5), inset 0 0 30px rgba(34, 197, 94, 0.2)",
            "0 0 20px rgba(34, 197, 94, 0.3), inset 0 0 20px rgba(34, 197, 94, 0.1)",
          ]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        style={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: "80px",
          height: "80px",
          border: "2px solid rgba(34, 197, 94, 0.4)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(34, 197, 94, 0.1)",
        }}
      >
        <span style={{ color: "rgba(34, 197, 94, 0.6)", fontSize: "12px", fontWeight: "bold", fontFamily: "monospace" }}>ALU</span>
      </motion.div>

      {/* Memory Node - Top Right */}
      <motion.div
        animate={{ 
          boxShadow: [
            "0 0 20px rgba(139, 92, 246, 0.3)",
            "0 0 40px rgba(139, 92, 246, 0.5)",
            "0 0 20px rgba(139, 92, 246, 0.3)",
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          position: "absolute",
          top: "25%",
          right: "12%",
          width: "60px",
          height: "40px",
          border: "2px solid rgba(139, 92, 246, 0.4)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(139, 92, 246, 0.1)",
        }}
      >
        <span style={{ color: "rgba(139, 92, 246, 0.6)", fontSize: "10px", fontWeight: "bold", fontFamily: "monospace" }}>MEM</span>
      </motion.div>

      {/* Register Node - Bottom Left */}
      <motion.div
        animate={{ 
          boxShadow: [
            "0 0 15px rgba(251, 191, 36, 0.3)",
            "0 0 30px rgba(251, 191, 36, 0.5)",
            "0 0 15px rgba(251, 191, 36, 0.3)",
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        style={{
          position: "absolute",
          bottom: "30%",
          left: "12%",
          width: "50px",
          height: "50px",
          border: "2px solid rgba(251, 191, 36, 0.4)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(251, 191, 36, 0.1)",
        }}
      >
        <span style={{ color: "rgba(251, 191, 36, 0.6)", fontSize: "9px", fontWeight: "bold", fontFamily: "monospace" }}>REG</span>
      </motion.div>

      {/* Floating electrons */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          animate={{
            x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            opacity: [0.2, 0.8, 0.4, 0.2],
            scale: [1, 1.5, 1, 1],
          }}
          transition={{
            duration: particle.speed + 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.id * 0.2,
          }}
          style={{
            position: "absolute",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: "50%",
            background: particle.id % 3 === 0 ? "#22c55e" : particle.id % 3 === 1 ? "#6366f1" : "#fbbf24",
            boxShadow: `0 0 ${particle.size * 3}px ${particle.id % 3 === 0 ? "#22c55e" : particle.id % 3 === 1 ? "#6366f1" : "#fbbf24"}`,
          }}
        />
      ))}

      {/* Binary code rain effect */}
      {[5, 20, 40, 60, 80, 95].map((left, i) => (
        <motion.div
          key={`binary-${i}`}
          initial={{ y: "-100%" }}
          animate={{ y: "200%" }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear", delay: i }}
          style={{
            position: "absolute",
            left: `${left}%`,
            top: 0,
            fontSize: "10px",
            fontFamily: "monospace",
            color: "rgba(99, 102, 241, 0.2)",
            whiteSpace: "nowrap",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          {Array.from({ length: 20 }, () => Math.round(Math.random())).join("")}
        </motion.div>
      ))}

      {/* Grid overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
      }} />
    </div>
  );
}
