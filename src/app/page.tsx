"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Play, 
  Cpu, 
  BookOpen, 
  Zap, 
  Code, 
  Eye,
  ChevronRight,
  Sparkles,
  GraduationCap,
  ArrowRight,
  Database,
  Menu,
  X
} from "lucide-react";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close menu when clicking a link
  const handleNavClick = () => setIsMobileMenuOpen(false);

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", overflowX: "hidden" }}>
      {/* Navigation */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "12px 16px" : "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: isMobile ? "36px" : "40px",
              height: isMobile ? "36px" : "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "18px" : "20px",
            }}>
              🐍
            </div>
            <span style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: "700", color: "#1e293b" }}>
              Visual Python
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          {!isMobile && (
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
          )}

          {/* Mobile Hamburger Button */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: "none",
                border: "none",
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isMobileMenuOpen ? (
                <X style={{ width: "24px", height: "24px", color: "#1e293b" }} />
              ) : (
                <Menu style={{ width: "24px", height: "24px", color: "#1e293b" }} />
              )}
            </button>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobile && isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: "white",
                borderTop: "1px solid #e2e8f0",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <Link href="#features" onClick={handleNavClick} style={{
                  textDecoration: "none",
                  color: "#1e293b",
                  fontSize: "16px",
                  fontWeight: "500",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  background: "#f8fafc",
                }}>
                  Features
                </Link>
                <Link href="#how-it-works" onClick={handleNavClick} style={{
                  textDecoration: "none",
                  color: "#1e293b",
                  fontSize: "16px",
                  fontWeight: "500",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  background: "#f8fafc",
                }}>
                  How It Works
                </Link>
                <Link href="#curriculum" onClick={handleNavClick} style={{
                  textDecoration: "none",
                  color: "#1e293b",
                  fontSize: "16px",
                  fontWeight: "500",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  background: "#f8fafc",
                }}>
                  Curriculum
                </Link>
                <Link href="/login" onClick={handleNavClick} style={{
                  textDecoration: "none",
                  color: "#1e293b",
                  fontSize: "16px",
                  fontWeight: "500",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  background: "#f8fafc",
                }}>
                  Sign In
                </Link>
                <Link href="/register" onClick={handleNavClick} style={{ textDecoration: "none", marginTop: "8px" }}>
                  <button style={{
                    width: "100%",
                    padding: "14px 20px",
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}>
                    Get Started Free
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: isMobile ? "100px" : "140px",
        paddingBottom: isMobile ? "60px" : "100px",
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 50%, #ffffff 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decorations - hidden on mobile */}
        {!isMobile && (
          <>
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
          </>
        )}

        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          padding: isMobile ? "0 20px" : "0 24px", 
          position: "relative" 
        }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
            gap: isMobile ? "40px" : "60px", 
            alignItems: "center" 
          }}>
            {/* Left side - Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: isMobile ? "center" : "left" }}
            >
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
                borderRadius: "30px",
                marginBottom: "20px",
                border: "1px solid #c7d2fe",
              }}>
                <Sparkles style={{ width: "16px", height: "16px", color: "#6366f1" }} />
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#4f46e5" }}>
                  Learn Python the Visual Way
                </span>
              </div>

              <h1 style={{
                fontSize: isMobile ? "36px" : "56px",
                fontWeight: "800",
                color: "#0f172a",
                lineHeight: "1.1",
                marginBottom: "20px",
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
                fontSize: isMobile ? "16px" : "18px",
                color: "#475569",
                lineHeight: "1.7",
                marginBottom: "32px",
                maxWidth: isMobile ? "100%" : "500px",
                margin: isMobile ? "0 auto 32px" : "0 0 32px 0",
              }}>
                Watch your code flow through CPU and memory with beautiful animations. 
                Understand how computers really work while learning to code.
              </p>

              <div style={{ 
                display: "flex", 
                gap: "12px", 
                marginBottom: "40px",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "stretch" : "center",
                justifyContent: isMobile ? "center" : "flex-start",
              }}>
                <Link href="/register" style={{ textDecoration: "none" }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      padding: isMobile ? "16px 24px" : "16px 32px",
                      width: isMobile ? "100%" : "auto",
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
                      justifyContent: "center",
                      gap: "10px",
                      padding: isMobile ? "16px 24px" : "16px 32px",
                      width: isMobile ? "100%" : "auto",
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
              <div style={{ 
                display: "flex", 
                gap: isMobile ? "24px" : "40px",
                justifyContent: isMobile ? "center" : "flex-start",
                flexWrap: "wrap",
              }}>
                {[
                  { value: "310+", label: "Lessons" },
                  { value: "309+", label: "Exercises" },
                  { value: "100%", label: "Free" },
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ 
                      fontSize: isMobile ? "24px" : "32px", 
                      fontWeight: "800", 
                      color: "#6366f1" 
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: "14px", color: "#64748b" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right side - Hero Image/Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ display: isMobile ? "block" : "block" }}
            >
              <div style={{
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                borderRadius: isMobile ? "20px" : "24px",
                padding: isMobile ? "16px" : "24px",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                border: "1px solid #334155",
              }}>
                {/* Code Editor Mock */}
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" }} />
                  </div>
                  <pre style={{
                    fontFamily: "'Fira Code', monospace",
                    fontSize: isMobile ? "12px" : "14px",
                    lineHeight: "1.8",
                    margin: 0,
                    overflow: "auto",
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
                  borderRadius: "12px",
                  padding: isMobile ? "12px" : "16px",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: isMobile ? "8px" : "12px",
                }}>
                  {[
                    { label: "CONTROL", value: "FETCH", color: "#f59e0b" },
                    { label: "ALU", value: "5+10=15", color: "#22c55e" },
                    { label: "REG", value: "ACC:15", color: "#a855f7" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        boxShadow: [`0 0 0px ${item.color}`, `0 0 15px ${item.color}`, `0 0 0px ${item.color}`],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      style={{
                        background: `${item.color}20`,
                        borderRadius: "8px",
                        padding: isMobile ? "8px" : "12px",
                        textAlign: "center",
                        border: `1px solid ${item.color}`,
                      }}
                    >
                      <div style={{ 
                        fontSize: isMobile ? "8px" : "10px", 
                        color: item.color, 
                        marginBottom: "2px" 
                      }}>
                        {item.label}
                      </div>
                      <div style={{ 
                        fontSize: isMobile ? "10px" : "12px", 
                        color: "white", 
                        fontFamily: "monospace",
                        fontWeight: "bold",
                      }}>
                        {item.value}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ 
        padding: isMobile ? "60px 20px" : "100px 24px", 
        background: "#ffffff" 
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: isMobile ? "40px" : "60px" }}
          >
            <h2 style={{ 
              fontSize: isMobile ? "28px" : "42px", 
              fontWeight: "800", 
              color: "#0f172a", 
              marginBottom: "16px" 
            }}>
              Why Visual Python?
            </h2>
            <p style={{ 
              fontSize: isMobile ? "15px" : "18px", 
              color: "#64748b", 
              maxWidth: "600px", 
              margin: "0 auto",
              padding: isMobile ? "0 10px" : 0,
            }}>
              Traditional tutorials show you what code does. We show you how it actually works inside the computer.
            </p>
          </motion.div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", 
            gap: isMobile ? "16px" : "32px" 
          }}>
            {[
              {
                icon: <Cpu style={{ width: "24px", height: "24px" }} />,
                title: "Hardware Visualization",
                description: "Watch data flow through CPU components in real-time animations.",
                color: "#6366f1",
                bg: "#eef2ff",
              },
              {
                icon: <Eye style={{ width: "24px", height: "24px" }} />,
                title: "Step-by-Step Execution",
                description: "See the Fetch-Decode-Execute cycle in action.",
                color: "#22c55e",
                bg: "#dcfce7",
              },
              {
                icon: <Database style={{ width: "24px", height: "24px" }} />,
                title: "Memory Visualization",
                description: "See how variables are stored in RAM with real addresses.",
                color: "#f59e0b",
                bg: "#fef3c7",
              },
              {
                icon: <BookOpen style={{ width: "24px", height: "24px" }} />,
                title: "MIT-Based Curriculum",
                description: "Structured curriculum based on MIT's programming course.",
                color: "#ec4899",
                bg: "#fce7f3",
              },
              {
                icon: <Code style={{ width: "24px", height: "24px" }} />,
                title: "Interactive Exercises",
                description: "Practice with coding challenges and earn XP.",
                color: "#8b5cf6",
                bg: "#f3e8ff",
              },
              {
                icon: <Zap style={{ width: "24px", height: "24px" }} />,
                title: "Instant Feedback",
                description: "Run code in your browser. No setup required.",
                color: "#06b6d4",
                bg: "#cffafe",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: isMobile ? "20px" : "32px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{
                  width: isMobile ? "48px" : "56px",
                  height: isMobile ? "48px" : "56px",
                  borderRadius: "14px",
                  background: feature.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: feature.color,
                  marginBottom: "16px",
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  fontSize: isMobile ? "17px" : "20px", 
                  fontWeight: "700", 
                  color: "#1e293b", 
                  marginBottom: "8px" 
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  fontSize: isMobile ? "14px" : "15px", 
                  color: "#64748b", 
                  lineHeight: "1.6" 
                }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{
        padding: isMobile ? "60px 20px" : "100px 24px",
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: isMobile ? "40px" : "60px" }}
          >
            <h2 style={{ 
              fontSize: isMobile ? "28px" : "42px", 
              fontWeight: "800", 
              color: "#0f172a", 
              marginBottom: "16px" 
            }}>
              How It Works
            </h2>
            <p style={{ 
              fontSize: isMobile ? "15px" : "18px", 
              color: "#64748b", 
              maxWidth: "600px", 
              margin: "0 auto" 
            }}>
              Learning to code has never been more intuitive.
            </p>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                step: "1",
                title: "Write Your Code",
                description: "Use our Python editor with syntax highlighting.",
                icon: <Code style={{ width: "20px", height: "20px" }} />,
              },
              {
                step: "2",
                title: "Enable Hardware Mode",
                description: "See CPU, Memory, and Data Flow panels.",
                icon: <Cpu style={{ width: "20px", height: "20px" }} />,
              },
              {
                step: "3",
                title: "Step Through Execution",
                description: "Watch the animation at your own pace.",
                icon: <Play style={{ width: "20px", height: "20px" }} />,
              },
              {
                step: "4",
                title: "Understand Deeply",
                description: "Read explanations for each step.",
                icon: <GraduationCap style={{ width: "20px", height: "20px" }} />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  display: "flex",
                  alignItems: isMobile ? "flex-start" : "center",
                  gap: isMobile ? "16px" : "32px",
                  background: "white",
                  borderRadius: "16px",
                  padding: isMobile ? "20px" : "32px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{
                  width: isMobile ? "48px" : "72px",
                  height: isMobile ? "48px" : "72px",
                  borderRadius: isMobile ? "14px" : "20px",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: isMobile ? "20px" : "28px",
                  fontWeight: "800",
                  flexShrink: 0,
                }}>
                  {item.step}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: isMobile ? "17px" : "22px",
                    fontWeight: "700",
                    color: "#1e293b",
                    marginBottom: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}>
                    {item.icon}
                    {item.title}
                  </h3>
                  <p style={{ 
                    fontSize: isMobile ? "14px" : "16px", 
                    color: "#64748b", 
                    lineHeight: "1.5" 
                  }}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" style={{ 
        padding: isMobile ? "60px 20px" : "100px 24px", 
        background: "#ffffff" 
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: isMobile ? "40px" : "60px" }}
          >
            <h2 style={{ 
              fontSize: isMobile ? "28px" : "42px", 
              fontWeight: "800", 
              color: "#0f172a", 
              marginBottom: "16px" 
            }}>
              Structured Curriculum
            </h2>
            <p style={{ 
              fontSize: isMobile ? "15px" : "18px", 
              color: "#64748b", 
              maxWidth: "600px", 
              margin: "0 auto" 
            }}>
              Based on MIT's programming course by John V. Guttag.
            </p>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
                  padding: isMobile ? "16px" : "24px 28px",
                  background: chapter.status === "available" ? "white" : "#f8fafc",
                  borderRadius: "14px",
                  border: chapter.status === "available" ? "2px solid #6366f1" : "1px solid #e2e8f0",
                  opacity: chapter.status === "available" ? 1 : 0.7,
                  flexWrap: isMobile ? "wrap" : "nowrap",
                  gap: isMobile ? "12px" : "20px",
                }}
              >
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: isMobile ? "12px" : "20px",
                  flex: 1,
                  minWidth: 0,
                }}>
                  <div style={{
                    width: isMobile ? "40px" : "52px",
                    height: isMobile ? "40px" : "52px",
                    borderRadius: "12px",
                    background: chapter.status === "available"
                      ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                      : "#e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: chapter.status === "available" ? "white" : "#94a3b8",
                    fontSize: isMobile ? "16px" : "20px",
                    fontWeight: "700",
                    flexShrink: 0,
                  }}>
                    {chapter.num}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ 
                      fontSize: isMobile ? "15px" : "18px", 
                      fontWeight: "600", 
                      color: "#1e293b",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {isMobile ? chapter.title : `Chapter ${chapter.num}: ${chapter.title}`}
                    </h3>
                    <p style={{ fontSize: isMobile ? "12px" : "14px", color: "#64748b" }}>
                      {chapter.lessons} lessons
                    </p>
                  </div>
                </div>
                {chapter.status === "available" ? (
                  <Link href="/learn" style={{ textDecoration: "none", flexShrink: 0 }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: isMobile ? "10px 16px" : "10px 20px",
                        borderRadius: "10px",
                        border: "none",
                        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        color: "white",
                        fontSize: isMobile ? "13px" : "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Start
                      <ChevronRight style={{ width: "16px", height: "16px" }} />
                    </motion.button>
                  </Link>
                ) : (
                  <span style={{
                    padding: isMobile ? "6px 12px" : "8px 16px",
                    borderRadius: "20px",
                    background: "#f1f5f9",
                    color: "#94a3b8",
                    fontSize: isMobile ? "11px" : "13px",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
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
        padding: isMobile ? "60px 20px" : "100px 24px",
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ 
              fontSize: isMobile ? "28px" : "46px", 
              fontWeight: "800", 
              color: "white", 
              marginBottom: "16px" 
            }}>
              Ready to See Code Differently?
            </h2>
            <p style={{ 
              fontSize: isMobile ? "15px" : "18px", 
              color: "rgba(255,255,255,0.9)", 
              marginBottom: "32px", 
              lineHeight: "1.7" 
            }}>
              Master Python by understanding how computers really work. 
              Start your journey today - completely free.
            </p>
            <Link href="/register" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: isMobile ? "16px 32px" : "18px 36px",
                  borderRadius: "14px",
                  border: "none",
                  background: "white",
                  color: "#6366f1",
                  fontSize: isMobile ? "16px" : "17px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Get Started Free
                <ArrowRight style={{ width: "20px", height: "20px" }} />
              </motion.button>
            </Link>
            <p style={{ marginTop: "16px", fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
              No credit card required
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: isMobile ? "40px 20px 30px" : "60px 24px 40px",
        background: "#0f172a",
        color: "white",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
            gap: isMobile ? "32px" : "60px",
            marginBottom: "32px",
          }}>
            <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}>
                  🐍
                </div>
                <span style={{ fontSize: "18px", fontWeight: "700" }}>Visual Python</span>
              </div>
              <p style={{ 
                fontSize: "13px", 
                color: "#94a3b8", 
                lineHeight: "1.6", 
                maxWidth: "280px" 
              }}>
                Learn Python by seeing how code executes through CPU and memory.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: "13px", fontWeight: "600", marginBottom: "12px", color: "#f1f5f9" }}>
                Platform
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link href="/learn" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px" }}>Curriculum</Link>
                <Link href="/ide" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px" }}>IDE</Link>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "13px", fontWeight: "600", marginBottom: "12px", color: "#f1f5f9" }}>
                Company
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px" }}>About</Link>
                <Link href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px" }}>Contact</Link>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "13px", fontWeight: "600", marginBottom: "12px", color: "#f1f5f9" }}>
                Legal
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px" }}>Privacy</Link>
                <Link href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px" }}>Terms</Link>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid #1e293b",
            paddingTop: "20px",
            textAlign: isMobile ? "center" : "left",
          }}>
            <p style={{ fontSize: "12px", color: "#64748b" }}>
              © 2025 Hadi Yaqoobi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
