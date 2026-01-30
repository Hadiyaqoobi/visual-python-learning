"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Cpu, BookOpen, Rocket } from "lucide-react";

interface VIPWelcomeModalProps {
  userEmail: string;
}

const VIP_EMAIL = "saharnikzad187@gmail.com";

export function VIPWelcomeModal({ userEmail }: VIPWelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (userEmail?.toLowerCase() === VIP_EMAIL) {
      const hasSeenWelcome = localStorage.getItem(`vip_welcome_shown`);
      if (!hasSeenWelcome) {
        setTimeout(() => setIsOpen(true), 500);
      }
    }
  }, [userEmail]);

  const handleClose = () => {
    localStorage.setItem(`vip_welcome_shown`, "true");
    setIsOpen(false);
  };

  if (!userEmail || userEmail.toLowerCase() !== VIP_EMAIL) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(12px)",
            padding: "20px",
          }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
              borderRadius: "28px",
              padding: "48px",
              maxWidth: "550px",
              width: "100%",
              position: "relative",
              border: "1px solid rgba(99, 102, 241, 0.4)",
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.5), 0 0 120px rgba(99, 102, 241, 0.3)",
            }}
          >
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X style={{ width: "20px", height: "20px", color: "rgba(255,255,255,0.7)" }} />
            </button>

            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "100px",
                height: "100px",
                margin: "0 auto 32px",
                borderRadius: "28px",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 25px 50px rgba(99, 102, 241, 0.5)",
              }}
            >
              <Sparkles style={{ width: "50px", height: "50px", color: "white" }} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: "36px",
                fontWeight: "800",
                textAlign: "center",
                marginBottom: "12px",
                background: "linear-gradient(135deg, #fff 0%, #c7d2fe 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome Sahar! ✨
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: "18px",
                lineHeight: "1.8",
                textAlign: "center",
                color: "rgba(255,255,255,0.9)",
                marginBottom: "36px",
              }}
            >
              This platform was built, customized and personalized just for you. 
              Using MIT-level curriculum, revolutionary visualizations, and a passion 
              to help you master Python. You're not just learning to code—you're 
              experiencing how computers truly think. Enjoy your journey!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "32px",
                marginBottom: "36px",
              }}
            >
              {[
                { icon: BookOpen, label: "310 Lessons" },
                { icon: Cpu, label: "3D Visualizations" },
                { icon: Rocket, label: "MIT Curriculum" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: "rgba(99, 102, 241, 0.2)",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <item.icon style={{ width: "26px", height: "26px", color: "#a5b4fc" }} />
                  </div>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: "500" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              style={{
                width: "100%",
                padding: "20px",
                fontSize: "18px",
                fontWeight: "700",
                color: "white",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                boxShadow: "0 15px 35px rgba(99, 102, 241, 0.4)",
              }}
            >
              Begin My Journey
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
