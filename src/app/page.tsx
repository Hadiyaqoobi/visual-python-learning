"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Play, 
  Cpu, 
  BookOpen, 
  Zap, 
  Code, 
  Eye,
  ChevronRight,
  CheckCircle,
  Sparkles,
  GraduationCap,
  ArrowRight,
  Monitor,
  Database,
  GitBranch,
  Star
} from "lucide-react";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff" }}>
      {/* Navigation */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}>
              🐍
            </div>
            <span style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b" }}>
              Visual Python
            </span>
          </Link>
          
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <Link href="#features" style={{ textDecoration: "none", color: "#64748b", fontSize: "14px", fontWeight: "500" }}>
              Features
            </Link>
            <Link href="#how-it-works" style={{ textDecoration: "none", color: "#64748b", fontSize: "14px", fontWeight: "500" }}>
              How It Works
            </Link>
            <Link href="#curriculum" style={{ textDecoration: "none", color: "#64748b", fontSize: "14px", fontWeight: "500" }}>
              Curriculum
            </Link>
            <Link href="/login" style={{ textDecoration: "none", color: "#64748b", fontSize: "14px", fontWeight: "500" }}>
              Sign In
            </Link>
            <Link href="/register" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Get Started Free
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: "140px",
        paddingBottom: "100px",
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 50%, #ffffff 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decorations */}
        <div style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
            {/* Left side - Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
                borderRadius: "30px",
                marginBottom: "24px",
                border: "1px solid #c7d2fe",
              }}>
                <Sparkles style={{ width: "16px", height: "16px", color: "#6366f1" }} />
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#4f46e5" }}>
                  Learn Python the Visual Way
                </span>
              </div>

              <h1 style={{
                fontSize: "56px",
                fontWeight: "800",
                color: "#0f172a",
                lineHeight: "1.1",
                marginBottom: "24px",
              }}>
                Master Python by
                <span style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "block",
                }}>
                  Seeing It Execute
                </span>
              </h1>

              <p style={{
                fontSize: "18px",
                color: "#475569",
                lineHeight: "1.7",
                marginBottom: "36px",
                maxWidth: "500px",
              }}>
                Watch your code flow through CPU and memory with beautiful animations. 
                Understand how computers really work while learning to code.
              </p>

              <div style={{ display: "flex", gap: "16px", marginBottom: "48px" }}>
                <Link href="/register" style={{ textDecoration: "none" }}>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(99, 102, 241, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "16px 32px",
                      borderRadius: "14px",
                      border: "none",
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      color: "white",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                      boxShadow: "0 4px 20px rgba(99, 102, 241, 0.25)",
                    }}
                  >
                    Start Learning Free
                    <ArrowRight style={{ width: "18px", height: "18px" }} />
                  </motion.button>
                </Link>
                <Link href="/ide" style={{ textDecoration: "none" }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "16px 32px",
                      borderRadius: "14px",
                      border: "2px solid #e2e8f0",
                      background: "white",
                      color: "#1e293b",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    <Play style={{ width: "18px", height: "18px", color: "#6366f1" }} />
                    Try Demo
                  </motion.button>
                </Link>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: "40px" }}>
                <div>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#6366f1" }}>5+</div>
                  <div style={{ fontSize: "14px", color: "#64748b" }}>Interactive Lessons</div>
                </div>
                <div>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#8b5cf6" }}>13+</div>
                  <div style={{ fontSize: "14px", color: "#64748b" }}>Coding Exercises</div>
                </div>
                <div>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#a855f7" }}>100%</div>
                  <div style={{ fontSize: "14px", color: "#64748b" }}>Free to Start</div>
                </div>
              </div>
            </motion.div>

            {/* Right side - Hero Image/Animation */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div style={{
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                borderRadius: "24px",
                padding: "24px",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                border: "1px solid #334155",
              }}>
                {/* Code Editor Mock */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }} />
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" }} />
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#22c55e" }} />
                  </div>
                  <pre style={{
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "14px",
                    lineHeight: "1.8",
                    margin: 0,
                  }}>
                    <code>
                      <span style={{ color: "#f472b6" }}>x</span>
                      <span style={{ color: "#94a3b8" }}> = </span>
                      <span style={{ color: "#4ade80" }}>5</span>
                      {"\n"}
                      <span style={{ color: "#f472b6" }}>y</span>
                      <span style={{ color: "#94a3b8" }}> = </span>
                      <span style={{ color: "#4ade80" }}>10</span>
                      {"\n"}
                      <span style={{ color: "#f472b6" }}>result</span>
                      <span style={{ color: "#94a3b8" }}> = </span>
                      <span style={{ color: "#f472b6" }}>x</span>
                      <span style={{ color: "#94a3b8" }}> + </span>
                      <span style={{ color: "#f472b6" }}>y</span>
                      {"\n"}
                      <span style={{ color: "#60a5fa" }}>print</span>
                      <span style={{ color: "#94a3b8" }}>(</span>
                      <span style={{ color: "#f472b6" }}>result</span>
                      <span style={{ color: "#94a3b8" }}>)</span>
                    </code>
                  </pre>
                </div>

                {/* CPU Visualization Mock */}
                <div style={{
                  background: "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)",
                  borderRadius: "16px",
                  padding: "16px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "12px",
                }}>
                  <motion.div
                    animate={{ 
                      boxShadow: ["0 0 0px #f59e0b", "0 0 20px #f59e0b", "0 0 0px #f59e0b"],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      background: "rgba(245, 158, 11, 0.2)",
                      borderRadius: "10px",
                      padding: "12px",
                      textAlign: "center",
                      border: "1px solid #f59e0b",
                    }}
                  >
                    <div style={{ fontSize: "10px", color: "#fbbf24", marginBottom: "4px" }}>CONTROL</div>
                    <div style={{ fontSize: "12px", color: "white", fontFamily: "monospace" }}>FETCH</div>
                  </motion.div>
                  <motion.div
                    animate={{ 
                      boxShadow: ["0 0 0px #22c55e", "0 0 20px #22c55e", "0 0 0px #22c55e"],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    style={{
                      background: "rgba(34, 197, 94, 0.2)",
                      borderRadius: "10px",
                      padding: "12px",
                      textAlign: "center",
                      border: "1px solid #22c55e",
                    }}
                  >
                    <div style={{ fontSize: "10px", color: "#4ade80", marginBottom: "4px" }}>ALU</div>
                    <div style={{ fontSize: "14px", color: "white", fontFamily: "monospace", fontWeight: "bold" }}>5 + 10 = 15</div>
                  </motion.div>
                  <motion.div
                    animate={{ 
                      boxShadow: ["0 0 0px #a855f7", "0 0 20px #a855f7", "0 0 0px #a855f7"],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    style={{
                      background: "rgba(168, 85, 247, 0.2)",
                      borderRadius: "10px",
                      padding: "12px",
                      textAlign: "center",
                      border: "1px solid #a855f7",
                    }}
                  >
                    <div style={{ fontSize: "10px", color: "#c084fc", marginBottom: "4px" }}>REGISTERS</div>
                    <div style={{ fontSize: "12px", color: "white", fontFamily: "monospace" }}>ACC: 15</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "100px 24px", background: "#ffffff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h2 style={{ fontSize: "42px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>
              Why Visual Python?
            </h2>
            <p style={{ fontSize: "18px", color: "#64748b", maxWidth: "600px", margin: "0 auto" }}>
              Traditional tutorials show you what code does. We show you how it actually works inside the computer.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {[
              {
                icon: <Cpu style={{ width: "28px", height: "28px" }} />,
                title: "Hardware Visualization",
                description: "Watch data flow through CPU components - Control Unit, ALU, and Registers - in real-time animations.",
                color: "#6366f1",
                bg: "#eef2ff",
              },
              {
                icon: <Eye style={{ width: "28px", height: "28px" }} />,
                title: "Step-by-Step Execution",
                description: "See the Fetch-Decode-Execute cycle in action. Understand what happens at each phase.",
                color: "#22c55e",
                bg: "#dcfce7",
              },
              {
                icon: <Database style={{ width: "28px", height: "28px" }} />,
                title: "Memory Visualization",
                description: "See how variables are stored in RAM, with real memory addresses and type information.",
                color: "#f59e0b",
                bg: "#fef3c7",
              },
              {
                icon: <BookOpen style={{ width: "28px", height: "28px" }} />,
                title: "MIT-Based Curriculum",
                description: "Follow a structured curriculum based on MIT's 'Introduction to Computation and Programming'.",
                color: "#ec4899",
                bg: "#fce7f3",
              },
              {
                icon: <Code style={{ width: "28px", height: "28px" }} />,
                title: "Interactive Exercises",
                description: "Practice with coding challenges that test your understanding. Earn XP as you progress.",
                color: "#8b5cf6",
                bg: "#f3e8ff",
              },
              {
                icon: <Zap style={{ width: "28px", height: "28px" }} />,
                title: "Instant Feedback",
                description: "Run code directly in your browser with Pyodide. No setup required - just start coding.",
                color: "#06b6d4",
                bg: "#cffafe",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  padding: "32px",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: feature.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: feature.color,
                  marginBottom: "20px",
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: "15px", color: "#64748b", lineHeight: "1.6" }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{
        padding: "100px 24px",
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h2 style={{ fontSize: "42px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>
              How It Works
            </h2>
            <p style={{ fontSize: "18px", color: "#64748b", maxWidth: "600px", margin: "0 auto" }}>
              Learning to code has never been more intuitive. Follow these simple steps.
            </p>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {[
              {
                step: "1",
                title: "Write Your Code",
                description: "Use our Python editor with syntax highlighting and auto-completion. Start with simple examples or jump into exercises.",
                icon: <Code style={{ width: "24px", height: "24px" }} />,
              },
              {
                step: "2",
                title: "Enable Hardware Mode",
                description: "Toggle Hardware Mode to see the CPU, Memory, and Data Flow panels appear alongside your code.",
                icon: <Cpu style={{ width: "24px", height: "24px" }} />,
              },
              {
                step: "3",
                title: "Step Through Execution",
                description: "Click 'Step' to execute one phase at a time, or 'Auto' to watch the animation. Control the speed to match your learning pace.",
                icon: <Play style={{ width: "24px", height: "24px" }} />,
              },
              {
                step: "4",
                title: "Understand Deeply",
                description: "Read the explanation panel to understand what's happening at each step. Key concepts are highlighted and explained.",
                icon: <GraduationCap style={{ width: "24px", height: "24px" }} />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "32px",
                  background: "white",
                  borderRadius: "20px",
                  padding: "32px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "28px",
                  fontWeight: "800",
                  flexShrink: 0,
                }}>
                  {item.step}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#1e293b",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}>
                    {item.icon}
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "16px", color: "#64748b", lineHeight: "1.6" }}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" style={{ padding: "100px 24px", background: "#ffffff" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h2 style={{ fontSize: "42px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>
              Structured Curriculum
            </h2>
            <p style={{ fontSize: "18px", color: "#64748b", maxWidth: "600px", margin: "0 auto" }}>
              Based on MIT's renowned "Introduction to Computation and Programming Using Python" by John V. Guttag.
            </p>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { num: 1, title: "Getting Started", lessons: 5, status: "available" },
              { num: 2, title: "Core Elements", lessons: 8, status: "coming" },
              { num: 3, title: "Functions & Scoping", lessons: 6, status: "coming" },
              { num: 4, title: "Structured Types", lessons: 7, status: "coming" },
            ].map((chapter, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "24px 28px",
                  background: chapter.status === "available" ? "white" : "#f8fafc",
                  borderRadius: "16px",
                  border: chapter.status === "available" ? "2px solid #6366f1" : "1px solid #e2e8f0",
                  opacity: chapter.status === "available" ? 1 : 0.7,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: chapter.status === "available"
                      ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                      : "#e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: chapter.status === "available" ? "white" : "#94a3b8",
                    fontSize: "20px",
                    fontWeight: "700",
                  }}>
                    {chapter.num}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
                      Chapter {chapter.num}: {chapter.title}
                    </h3>
                    <p style={{ fontSize: "14px", color: "#64748b" }}>
                      {chapter.lessons} lessons
                    </p>
                  </div>
                </div>
                {chapter.status === "available" ? (
                  <Link href="/learn" style={{ textDecoration: "none" }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 20px",
                        borderRadius: "10px",
                        border: "none",
                        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Start Learning
                      <ChevronRight style={{ width: "16px", height: "16px" }} />
                    </motion.button>
                  </Link>
                ) : (
                  <span style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    background: "#f1f5f9",
                    color: "#94a3b8",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}>
                    Coming Soon
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: "100px 24px",
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-20%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />

        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: "46px", fontWeight: "800", color: "white", marginBottom: "20px" }}>
              Ready to See Code Differently?
            </h2>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.9)", marginBottom: "40px", lineHeight: "1.7" }}>
              Join thousands of learners who are mastering Python by understanding how computers really work. 
              Start your journey today - it's completely free.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <Link href="/register" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "18px 36px",
                    borderRadius: "14px",
                    border: "none",
                    background: "white",
                    color: "#6366f1",
                    fontSize: "17px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Get Started Free
                  <ArrowRight style={{ width: "20px", height: "20px" }} />
                </motion.button>
              </Link>
            </div>
            <p style={{ marginTop: "20px", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
              No credit card required • Start learning in seconds
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "60px 24px 40px",
        background: "#0f172a",
        color: "white",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "60px",
            marginBottom: "40px",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}>
                  🐍
                </div>
                <span style={{ fontSize: "20px", fontWeight: "700" }}>Visual Python</span>
              </div>
              <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.7", maxWidth: "300px" }}>
                Learn Python by seeing how code executes through CPU and memory. 
                A visual approach to understanding programming.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "#f1f5f9" }}>
                Platform
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link href="/learn" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>Curriculum</Link>
                <Link href="/ide" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>IDE</Link>
                <Link href="#features" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>Features</Link>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "#f1f5f9" }}>
                Company
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>About</Link>
                <Link href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>Blog</Link>
                <Link href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>Contact</Link>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "#f1f5f9" }}>
                Legal
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>Privacy Policy</Link>
                <Link href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>Terms of Service</Link>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid #1e293b",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <p style={{ fontSize: "13px", color: "#64748b" }}>
              © 2025 Visual Python Learning. All rights reserved.
            </p>
            <p style={{ fontSize: "13px", color: "#64748b" }}>
              Made with ❤️ for learners everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
