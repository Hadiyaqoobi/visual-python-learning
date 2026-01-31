"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { 
  BookOpen, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  Target,
  Lightbulb,
  Code,
  Play,
  Zap,
  Trophy
} from "lucide-react";
import { Spinner } from "@/components/ui";
import { CodeEditor } from "@/components/ide/CodeEditor";
import { usePython } from "@/hooks/usePython";
import { LessonVisualization } from "@/components/visualizations/LessonVisualization";

interface Exercise {
  id: string;
  number: number;
  title: string;
  prompt: string;
  starterCode: string;
  solution: string;
  hints: string[];
  xpReward: number;
}

interface CodeExample {
  id: string;
  title: string;
  description: string;
  code: string;
}

interface Lesson {
  id: string;
  number: number;
  title: string;
  slug: string;
  content: string;
  objectives: string[];
  keyPoints: string[];
  estimatedTime: number;
  difficulty: string;
  exercises: Exercise[];
  codeExamples: CodeExample[];
  hardwareDemo?: string;
  prevLesson?: { slug: string; title: string };
  nextLesson?: { slug: string; title: string };
  section: {
    chapter: {
      id: string;
      number: number;
      title: string;
    };
  };
}

export default function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"lesson" | "exercises">("lesson");
  const [selectedExample, setSelectedExample] = useState<CodeExample | null>(null);
  const [exampleOutput, setExampleOutput] = useState<string>("");
  const { isReady: isPythonReady, runCode } = usePython();
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await fetch(`/api/curriculum/lessons/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setLesson(data);
          if (data.codeExamples?.length > 0) {
            setSelectedExample(data.codeExamples[0]);
          }
        } else {
          router.push("/learn");
        }
      } catch (error) {
        console.error("Failed to fetch lesson:", error);
        router.push("/learn");
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [slug, router]);

  const handleRunExample = async () => {
    if (!isPythonReady || !selectedExample) return;
    setIsRunning(true);
    setExampleOutput("Running...");
    
    const result = await runCode(selectedExample.code);
    
    if (result.success) {
      setExampleOutput(result.output || "Code executed successfully (no output)");
    } else {
      setExampleOutput(`Error: ${result.error}`);
    }
    setIsRunning(false);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}>
        <div style={{ textAlign: "center" }}>
          <Spinner size="lg" />
          <p style={{ marginTop: "16px", color: "#64748b" }}>Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return null;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        padding: "24px",
        color: "white",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Link href="/learn" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "14px" }}>
              Learn
            </Link>
            <ChevronRight style={{ width: "14px", height: "14px", opacity: 0.6 }} />
            <span style={{ fontSize: "14px", opacity: 0.8 }}>
              Chapter {lesson.section.chapter.number}: {lesson.section.chapter.title}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>
                Lesson {lesson.number}: {lesson.title}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "14px", opacity: 0.9 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Clock style={{ width: "16px", height: "16px" }} />
                  {lesson.estimatedTime} min
                </span>
                <span style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.2)",
                  fontSize: "12px",
                  fontWeight: "600",
                }}>
                  {lesson.difficulty}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link href={`/ide?lesson=${lesson.slug}`} style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "none",
                    background: "white",
                    color: "#6366f1",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <Code style={{ width: "16px", height: "16px" }} />
                  Open IDE
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
          {/* Left Column - Lesson Content */}
          <div>
            {/* Tabs */}
            <div style={{
              display: "flex",
              gap: "8px",
              marginBottom: "20px",
              background: "white",
              padding: "8px",
              borderRadius: "14px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("lesson")}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: "10px",
                  border: "none",
                  background: activeTab === "lesson" 
                    ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" 
                    : "transparent",
                  color: activeTab === "lesson" ? "white" : "#64748b",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <BookOpen style={{ width: "18px", height: "18px" }} />
                Lesson Content
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("exercises")}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: "10px",
                  border: "none",
                  background: activeTab === "exercises" 
                    ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" 
                    : "transparent",
                  color: activeTab === "exercises" ? "white" : "#64748b",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Target style={{ width: "18px", height: "18px" }} />
                Exercises ({lesson.exercises.length})
              </motion.button>
            </div>

            {activeTab === "lesson" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Objectives Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "20px",
                    border: "1px solid #c7d2fe",
                  }}
                >
                  <h3 style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#4f46e5",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}>
                    <Target style={{ width: "18px", height: "18px" }} />
                    Learning Objectives
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {lesson.objectives.map((obj, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{ 
                          fontSize: "14px", 
                          color: "#1e293b", 
                          marginBottom: "8px",
                          lineHeight: "1.5",
                        }}
                      >
                        {obj}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>


                {/* Interactive Visualization */}
                <LessonVisualization lessonSlug={slug} />

                {/* Markdown Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "28px 32px",
                    border: "1px solid #e2e8f0",
                    marginBottom: "20px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="prose" style={{ fontSize: "15px", lineHeight: "1.8", color: "#334155" }}>
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1e293b", marginTop: "28px", marginBottom: "14px", paddingBottom: "8px", borderBottom: "2px solid #e2e8f0" }}>
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", marginTop: "20px", marginBottom: "10px" }}>
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p style={{ marginBottom: "14px", color: "#475569" }}>{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong style={{ color: "#1e293b", fontWeight: "600" }}>{children}</strong>
                        ),
                        code: ({ children, className }) => {
                          const isBlock = className?.includes("language-");
                          if (isBlock) {
                            return (
                              <pre style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", borderRadius: "12px", padding: "20px", overflow: "auto", margin: "20px 0", border: "1px solid #334155" }}>
                                <code style={{ color: "#4ade80", fontFamily: "'Fira Code', monospace", fontSize: "14px", lineHeight: "1.6" }}>
                                  {children}
                                </code>
                              </pre>
                            );
                          }
                          return (
                            <code style={{ background: "#fef3c7", padding: "2px 8px", borderRadius: "6px", fontFamily: "'Fira Code', monospace", fontSize: "13px", color: "#92400e", fontWeight: "500" }}>
                              {children}
                            </code>
                          );
                        },
                        ul: ({ children }) => (
                          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>{children}</ul>
                        ),
                        li: ({ children }) => (
                          <li style={{ marginBottom: "8px", color: "#475569" }}>{children}</li>
                        ),
                      }}
                    >
                      {lesson.content}
                    </ReactMarkdown>
                  </div>
                </motion.div>

                {/* Key Points Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    background: "linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "1px solid #fde047",
                  }}
                >
                  <h3 style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#a16207",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}>
                    <Lightbulb style={{ width: "18px", height: "18px" }} />
                    Key Takeaways
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {lesson.keyPoints.map((point, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        style={{ fontSize: "14px", color: "#713f12", marginBottom: "8px", lineHeight: "1.5" }}
                      >
                        {point}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {lesson.exercises.length === 0 ? (
                  <div style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    background: "white",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                  }}>
                    <Target style={{ width: "48px", height: "48px", color: "#cbd5e1", margin: "0 auto 16px" }} />
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b", marginBottom: "8px" }}>
                      No Exercises Yet
                    </h3>
                    <p style={{ color: "#64748b" }}>Exercises for this lesson are coming soon!</p>
                  </div>
                ) : (
                  lesson.exercises.map((exercise, i) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        background: "white",
                        borderRadius: "16px",
                        padding: "24px",
                        border: "1px solid #e2e8f0",
                        marginBottom: "16px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "700",
                          }}>
                            {exercise.number}
                          </div>
                          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
                            {exercise.title}
                          </h3>
                        </div>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "13px",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                          color: "#15803d",
                          fontWeight: "600",
                        }}>
                          <Zap style={{ width: "14px", height: "14px" }} />
                          +{exercise.xpReward} XP
                        </div>
                      </div>
                      <p style={{ fontSize: "14px", color: "#475569", marginBottom: "18px", lineHeight: "1.6" }}>
                        {exercise.prompt}
                      </p>
                      <Link href={`/ide?exercise=${exercise.id}&lesson=${lesson.slug}`} style={{ textDecoration: "none" }}>
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(99, 102, 241, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px 20px",
                            borderRadius: "10px",
                            border: "none",
                            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          <Code style={{ width: "16px", height: "16px" }} />
                          Start Exercise
                        </motion.button>
                      </Link>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "32px",
                paddingTop: "24px",
                borderTop: "2px solid #e2e8f0",
              }}
            >
              {lesson.prevLesson ? (
                <Link href={`/learn/${lesson.prevLesson.slug}`} style={{ textDecoration: "none" }}>
                  <motion.button
                    whileHover={{ scale: 1.02, x: -4 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "14px 20px",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      background: "white",
                      color: "#1e293b",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <ChevronLeft style={{ width: "20px", height: "20px", color: "#6366f1" }} />
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>Previous</div>
                      <div>{lesson.prevLesson.title}</div>
                    </div>
                  </motion.button>
                </Link>
              ) : <div />}
              {lesson.nextLesson ? (
                <Link href={`/learn/${lesson.nextLesson.slug}`} style={{ textDecoration: "none" }}>
                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "14px 20px",
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
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "11px", opacity: 0.8 }}>Next Lesson</div>
                      <div>{lesson.nextLesson.title}</div>
                    </div>
                    <ChevronRight style={{ width: "20px", height: "20px" }} />
                  </motion.button>
                </Link>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px 24px",
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
                  }}
                >
                  <Trophy style={{ width: "20px", height: "20px" }} />
                  Complete Lesson
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Right Column - Code Examples */}
          <div style={{ position: "sticky", top: "100px", alignSelf: "start" }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                background: "white",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{
                padding: "16px 20px",
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <Code style={{ width: "18px", height: "18px", color: "#4ade80" }} />
                <span style={{ fontSize: "14px", fontWeight: "600", color: "white" }}>
                  Try It Yourself
                </span>
              </div>

              {lesson.codeExamples.length > 0 ? (
                <>
                  <div style={{
                    display: "flex",
                    gap: "6px",
                    padding: "12px",
                    borderBottom: "1px solid #e2e8f0",
                    overflowX: "auto",
                    background: "#f8fafc",
                  }}>
                    {lesson.codeExamples.map((example) => (
                      <motion.button
                        key={example.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setSelectedExample(example); setExampleOutput(""); }}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "8px",
                          border: "none",
                          background: selectedExample?.id === example.id 
                            ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" 
                            : "#e2e8f0",
                          color: selectedExample?.id === example.id ? "white" : "#64748b",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {example.title}
                      </motion.button>
                    ))}
                  </div>

                  {selectedExample && (
                    <>
                      {selectedExample.description && (
                        <div style={{ padding: "12px 16px", background: "#fef3c7", borderBottom: "1px solid #fde68a", fontSize: "13px", color: "#92400e" }}>
                          {selectedExample.description}
                        </div>
                      )}
                      <div style={{ height: "200px" }}>
                        <CodeEditor
                          value={selectedExample.code}
                          onChange={() => {}}
                          theme="vs-dark"
                          height="100%"
                          language="python"
                          fontSize={13}
                          minimap={false}
                          readOnly={true}
                        />
                      </div>
                      <div style={{ padding: "12px", borderTop: "1px solid #e2e8f0" }}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleRunExample}
                          disabled={!isPythonReady || isRunning}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "none",
                            background: isPythonReady 
                              ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" 
                              : "#e2e8f0",
                            color: isPythonReady ? "white" : "#94a3b8",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: isPythonReady ? "pointer" : "not-allowed",
                            boxShadow: isPythonReady ? "0 4px 15px rgba(34, 197, 94, 0.3)" : "none",
                          }}
                        >
                          {isRunning ? <Spinner size="sm" /> : <Play style={{ width: "16px", height: "16px" }} />}
                          Run Code
                        </motion.button>
                      </div>
                      {exampleOutput && (
                        <div style={{ padding: "14px", background: "#0f172a", maxHeight: "150px", overflow: "auto" }}>
                          <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "8px", letterSpacing: "1px" }}>
                            OUTPUT
                          </div>
                          <pre style={{
                            margin: 0,
                            fontFamily: "'Fira Code', monospace",
                            fontSize: "13px",
                            color: exampleOutput.startsWith("Error") ? "#f87171" : "#4ade80",
                            whiteSpace: "pre-wrap",
                          }}>
                            {exampleOutput}
                          </pre>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
                  <Code style={{ width: "32px", height: "32px", margin: "0 auto 12px", opacity: 0.5 }} />
                  <p style={{ fontSize: "13px" }}>No code examples for this lesson</p>
                </div>
              )}
            </motion.div>

            {/* Hardware Demo Hint */}
            {lesson.hardwareDemo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  marginTop: "16px",
                  background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
                  borderRadius: "16px",
                  padding: "18px",
                  border: "1px solid #e9d5ff",
                }}
              >
                <h4 style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#7c3aed",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  Hardware Visualization Tip
                </h4>
                <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "14px", lineHeight: "1.5" }}>
                  {lesson.hardwareDemo}
                </p>
                <Link href={`/ide?lesson=${lesson.slug}`} style={{ textDecoration: "none" }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      border: "none",
                      background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    <Zap style={{ width: "14px", height: "14px" }} />
                    Try Hardware Mode
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
