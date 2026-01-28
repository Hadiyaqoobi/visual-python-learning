"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  BookOpen, 
  Clock, 
  ChevronRight, 
  ChevronDown,
  GraduationCap, 
  Target,
  Sparkles,
  Trophy,
  Zap,
  CheckCircle,
  Lock
} from "lucide-react";
import { Spinner } from "@/components/ui";

interface Lesson {
  id: string;
  number: number;
  title: string;
  slug: string;
  estimatedTime: number;
  difficulty: string;
}

interface Section {
  id: string;
  number: number;
  title: string;
  lessons: Lesson[];
}

interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  objectives: string[];
  sections: Section[];
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
}

export default function LearnPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChapters() {
      try {
        const res = await fetch("/api/curriculum/chapters");
        const data = await res.json();
        setChapters(data);
        if (data.length > 0) {
          setExpandedChapter(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch chapters:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchChapters();
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
      }}>
        <div style={{ textAlign: "center" }}>
          <Spinner size="lg" />
          <p style={{ marginTop: "16px", color: "#64748b" }}>Loading curriculum...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)" }}>
      {/* Hero Header */}
      <div style={{
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
        padding: "50px 20px",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-30%",
          left: "-5%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}>
                <GraduationCap style={{ width: "32px", height: "32px" }} />
              </div>
              <div>
                <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "4px" }}>
                  Learn Python
                </h1>
                <p style={{ fontSize: "16px", opacity: 0.9 }}>
                  Your journey to Python mastery starts here
                </p>
              </div>
            </div>
            
            <p style={{ 
              fontSize: "15px", 
              opacity: 0.85, 
              maxWidth: "600px", 
              lineHeight: "1.7",
              marginTop: "20px",
            }}>
              Follow our structured curriculum based on MIT's "Introduction to Computation 
              and Programming Using Python". Learn by doing with interactive exercises and 
              visualize how your code executes.
            </p>

            {/* Stats */}
            <div style={{
              display: "flex",
              gap: "24px",
              marginTop: "28px",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "10px",
                backdropFilter: "blur(10px)",
              }}>
                <BookOpen style={{ width: "18px", height: "18px" }} />
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  {chapters.reduce((acc, ch) => acc + ch.totalLessons, 0)} Lessons
                </span>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "10px",
                backdropFilter: "blur(10px)",
              }}>
                <Target style={{ width: "18px", height: "18px" }} />
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  {chapters.length} Chapters
                </span>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "10px",
                backdropFilter: "blur(10px)",
              }}>
                <Zap style={{ width: "18px", height: "18px" }} />
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  Interactive
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Chapters */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
        {chapters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "white",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Sparkles style={{ width: "56px", height: "56px", color: "#6366f1", margin: "0 auto 20px" }} />
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", marginBottom: "10px" }}>
              Content Coming Soon
            </h2>
            <p style={{ color: "#64748b", fontSize: "15px" }}>
              We're preparing amazing lessons for you!
            </p>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                }}
              >
                {/* Chapter Header */}
                <motion.button
                  whileHover={{ backgroundColor: "#fafafa" }}
                  onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                  style={{
                    width: "100%",
                    padding: "24px 28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
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
                      fontSize: "26px",
                      fontWeight: "800",
                      boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                    }}>
                      {chapter.number}
                    </div>
                    <div>
                      <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>
                        Chapter {chapter.number}: {chapter.title}
                      </h2>
                      <p style={{ fontSize: "14px", color: "#64748b", maxWidth: "450px", lineHeight: "1.5" }}>
                        {chapter.description}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ 
                        fontSize: "16px", 
                        fontWeight: "700", 
                        color: "#1e293b",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        justifyContent: "flex-end",
                      }}>
                        <BookOpen style={{ width: "16px", height: "16px", color: "#6366f1" }} />
                        {chapter.totalLessons} lessons
                      </div>
                      <div style={{ 
                        fontSize: "13px", 
                        color: chapter.completedLessons > 0 ? "#22c55e" : "#94a3b8",
                        marginTop: "4px",
                      }}>
                        {chapter.completedLessons} / {chapter.totalLessons} complete
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedChapter === chapter.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: expandedChapter === chapter.id ? "#6366f1" : "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ChevronDown style={{ 
                        width: "20px", 
                        height: "20px", 
                        color: expandedChapter === chapter.id ? "white" : "#64748b" 
                      }} />
                    </motion.div>
                  </div>
                </motion.button>

                {/* Chapter Content */}
                {expandedChapter === chapter.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      borderTop: "1px solid #e2e8f0",
                      background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
                    }}
                  >
                    {/* Objectives */}
                    <div style={{ padding: "20px 28px", borderBottom: "1px solid #e2e8f0" }}>
                      <h3 style={{ 
                        fontSize: "12px", 
                        fontWeight: "700", 
                        color: "#6366f1", 
                        marginBottom: "12px", 
                        letterSpacing: "1px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}>
                        <Target style={{ width: "14px", height: "14px" }} />
                        LEARNING OBJECTIVES
                      </h3>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {chapter.objectives.map((obj, i) => (
                          <motion.span 
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            style={{
                              fontSize: "13px",
                              padding: "8px 14px",
                              background: "white",
                              color: "#4f46e5",
                              borderRadius: "20px",
                              fontWeight: "500",
                              border: "1px solid #c7d2fe",
                              boxShadow: "0 2px 8px rgba(99, 102, 241, 0.08)",
                            }}
                          >
                            ✓ {obj}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Sections and Lessons */}
                    <div style={{ padding: "20px 28px" }}>
                      {chapter.sections.map((section, sIndex) => (
                        <div key={section.id} style={{ marginBottom: sIndex < chapter.sections.length - 1 ? "24px" : 0 }}>
                          <h3 style={{
                            fontSize: "15px",
                            fontWeight: "700",
                            color: "#1e293b",
                            marginBottom: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}>
                            <span style={{
                              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              color: "white",
                              fontWeight: "700",
                            }}>
                              {section.number}
                            </span>
                            {section.title}
                          </h3>

                          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginLeft: "8px" }}>
                            {section.lessons.map((lesson, lIndex) => (
                              <Link
                                key={lesson.id}
                                href={`/learn/${lesson.slug}`}
                                style={{ textDecoration: "none" }}
                              >
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: (sIndex * 0.1) + (lIndex * 0.05) }}
                                  whileHover={{ 
                                    x: 6, 
                                    boxShadow: "0 6px 20px rgba(99, 102, 241, 0.15)",
                                    borderColor: "#6366f1",
                                  }}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "16px 18px",
                                    background: "white",
                                    borderRadius: "12px",
                                    border: "1px solid #e2e8f0",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                  }}
                                >
                                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                    <div style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "10px",
                                      background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}>
                                      <BookOpen style={{ width: "18px", height: "18px", color: "#6366f1" }} />
                                    </div>
                                    <div>
                                      <span style={{ fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>
                                        {lesson.title}
                                      </span>
                                      <div style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: "12px", 
                                        marginTop: "4px" 
                                      }}>
                                        <span style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "4px",
                                          fontSize: "12px",
                                          color: "#64748b",
                                        }}>
                                          <Clock style={{ width: "12px", height: "12px" }} />
                                          {lesson.estimatedTime} min
                                        </span>
                                        <span style={{
                                          fontSize: "11px",
                                          padding: "2px 8px",
                                          borderRadius: "10px",
                                          background: lesson.difficulty === "BEGINNER" ? "#dcfce7" : "#fef3c7",
                                          color: lesson.difficulty === "BEGINNER" ? "#15803d" : "#a16207",
                                          fontWeight: "600",
                                        }}>
                                          {lesson.difficulty}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <ChevronRight style={{ width: "20px", height: "20px", color: "#6366f1" }} />
                                  </div>
                                </motion.div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {/* Coming Soon Chapter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: "white",
                borderRadius: "20px",
                border: "2px dashed #cbd5e1",
                padding: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: 0.7,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  fontSize: "26px",
                  fontWeight: "800",
                }}>
                  2
                </div>
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#64748b", marginBottom: "6px" }}>
                    Chapter 2: Core Elements
                  </h2>
                  <p style={{ fontSize: "14px", color: "#94a3b8" }}>
                    Coming soon - Functions, loops, and more!
                  </p>
                </div>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                background: "#f1f5f9",
                borderRadius: "10px",
                color: "#64748b",
                fontSize: "13px",
                fontWeight: "600",
              }}>
                <Lock style={{ width: "16px", height: "16px" }} />
                Coming Soon
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
