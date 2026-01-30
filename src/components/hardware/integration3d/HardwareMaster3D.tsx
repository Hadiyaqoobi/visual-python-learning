"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Check, Info, Cpu, Database, Code, Zap } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  topic: string;
  color: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Which is the fastest type of memory?",
    options: ["RAM", "L1 Cache", "Registers", "SSD"],
    correct: 2,
    explanation: "Registers are inside the CPU and have <1ns access time!",
    topic: "Memory Hierarchy",
    color: "#00FFFF",
  },
  {
    id: 2,
    question: "What does the ALU do?",
    options: ["Store data", "Perform arithmetic", "Fetch instructions", "Manage memory"],
    correct: 1,
    explanation: "The Arithmetic Logic Unit performs all math and logic operations.",
    topic: "CPU Architecture",
    color: "#00FF88",
  },
  {
    id: 3,
    question: "What causes a cache miss?",
    options: ["Data is in cache", "Data is not in cache", "CPU is idle", "Memory is full"],
    correct: 1,
    explanation: "A cache miss occurs when requested data isn't in the cache, requiring slower RAM access.",
    topic: "Cache",
    color: "#FF8800",
  },
  {
    id: 4,
    question: "What is the FDE cycle?",
    options: ["File-Data-Execute", "Fetch-Decode-Execute", "Fast-Direct-Efficient", "Function-Define-Export"],
    correct: 1,
    explanation: "Fetch-Decode-Execute is the basic CPU cycle that runs billions of times per second.",
    topic: "CPU Cycle",
    color: "#FF00FF",
  },
  {
    id: 5,
    question: "Why are local variables faster than globals in Python?",
    options: ["Less memory", "Cached in fast lookup table", "Smaller size", "Compiled differently"],
    correct: 1,
    explanation: "Python stores local variables in a fast array (LOAD_FAST) vs dictionary lookup for globals.",
    topic: "Python Optimization",
    color: "#00FFFF",
  },
  {
    id: 6,
    question: "What happens during a context switch?",
    options: ["CPU shuts down", "OS saves/restores process state", "Memory is cleared", "Cache is emptied"],
    correct: 1,
    explanation: "The OS saves all registers and state of current process, then loads another process.",
    topic: "OS Scheduling",
    color: "#FF4444",
  },
];

export function HardwareMaster3D() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  const question = QUIZ_QUESTIONS[currentQuestion];

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === question.correct) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsComplete(true);
    }
  };

  const restart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsComplete(false);
  };

  const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  if (isComplete) {
    return (
      <div style={{
        minHeight: "100%",
        background: "linear-gradient(135deg, #0A0A1E 0%, #1A1A3E 50%, #0A0A1E 100%)",
        padding: 24,
        fontFamily: "'JetBrains Mono', monospace",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: "rgba(0, 20, 40, 0.8)",
            borderRadius: 24,
            padding: 40,
            textAlign: "center",
            border: `2px solid ${percentage >= 80 ? "#00FF88" : percentage >= 50 ? "#FF8800" : "#FF4444"}`,
            maxWidth: 500,
          }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Trophy size={64} style={{ color: percentage >= 80 ? "#FFD700" : "#888", marginBottom: 20 }} />
          </motion.div>
          
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            color: percentage >= 80 ? "#00FF88" : percentage >= 50 ? "#FF8800" : "#FF4444",
            marginBottom: 16,
          }}>
            {percentage >= 80 ? "HARDWARE MASTER!" : percentage >= 50 ? "GOOD EFFORT!" : "KEEP LEARNING!"}
          </h1>
          
          <div style={{ fontSize: 48, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            {score}/{QUIZ_QUESTIONS.length}
          </div>
          <div style={{ fontSize: 18, color: "#888", marginBottom: 24 }}>
            {percentage}% Correct
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
            {QUIZ_QUESTIONS.map((_, i) => (
              <Star
                key={i}
                size={24}
                fill={i < score ? "#FFD700" : "transparent"}
                style={{ color: i < score ? "#FFD700" : "#333" }}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={restart}
            style={{
              padding: "14px 36px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #00FF88, #00AA66)",
              color: "#000",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            TRY AGAIN
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100%",
      background: "linear-gradient(135deg, #0A0A1E 0%, #1A1A3E 50%, #0A0A1E 100%)",
      padding: 24,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 32,
            fontWeight: 700,
            background: "linear-gradient(135deg, #FFD700 0%, #FF8800 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}
        >
          HARDWARE MASTER QUIZ
        </motion.h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          Test your knowledge of computer hardware!
        </p>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
        <div style={{
          padding: "10px 20px",
          background: "rgba(255, 215, 0, 0.1)",
          border: "1px solid #FFD70044",
          borderRadius: 12,
        }}>
          <span style={{ color: "#888", fontSize: 11 }}>QUESTION: </span>
          <span style={{ color: "#FFD700", fontWeight: 700, fontSize: 16 }}>{currentQuestion + 1}/{QUIZ_QUESTIONS.length}</span>
        </div>
        <div style={{
          padding: "10px 20px",
          background: "rgba(0, 255, 136, 0.1)",
          border: "1px solid #00FF8844",
          borderRadius: 12,
        }}>
          <span style={{ color: "#888", fontSize: 11 }}>SCORE: </span>
          <span style={{ color: "#00FF88", fontWeight: 700, fontSize: 16 }}>{score}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showExplanation ? "1fr 280px" : "1fr", gap: 24 }}>
        <div>
          {/* Question Card */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: "rgba(0, 20, 40, 0.6)",
              borderRadius: 20,
              padding: 24,
              border: `2px solid ${question.color}44`,
              marginBottom: 20,
            }}
          >
            <div style={{ 
              display: "inline-block",
              padding: "4px 12px", 
              background: `${question.color}22`, 
              borderRadius: 20,
              color: question.color,
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 16,
            }}>
              {question.topic}
            </div>
            
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600, marginBottom: 24, lineHeight: 1.4 }}>
              {question.question}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {question.options.map((option, i) => {
                const isSelected = selectedAnswer === i;
                const isCorrect = i === question.correct;
                const showCorrect = showResult && isCorrect;
                const showWrong = showResult && isSelected && !isCorrect;

                return (
                  <motion.button
                    key={i}
                    whileHover={!showResult ? { scale: 1.02 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(i)}
                    disabled={showResult}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      border: `2px solid ${showCorrect ? "#00FF88" : showWrong ? "#FF4444" : isSelected ? question.color : "#333"}`,
                      background: showCorrect ? "#00FF8822" : showWrong ? "#FF444422" : isSelected ? `${question.color}22` : "transparent",
                      color: showCorrect ? "#00FF88" : showWrong ? "#FF4444" : "#fff",
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: showResult ? "default" : "pointer",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: showCorrect ? "#00FF88" : showWrong ? "#FF4444" : "#333",
                      color: showCorrect || showWrong ? "#000" : "#888",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                    }}>
                      {showCorrect ? <Check size={16} /> : String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 20,
                  padding: 16,
                  background: selectedAnswer === question.correct ? "#00FF8822" : "#FF444422",
                  borderRadius: 12,
                  borderLeft: `3px solid ${selectedAnswer === question.correct ? "#00FF88" : "#FF4444"}`,
                }}
              >
                <div style={{ color: selectedAnswer === question.correct ? "#00FF88" : "#FF4444", fontWeight: 700, marginBottom: 8 }}>
                  {selectedAnswer === question.correct ? "✓ Correct!" : "✗ Incorrect"}
                </div>
                <div style={{ color: "#ccc", fontSize: 13 }}>{question.explanation}</div>
              </motion.div>
            )}
          </motion.div>

          {/* Next Button */}
          {showResult && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextQuestion}
                style={{
                  padding: "14px 36px",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg, #00FFFF, #00AAFF)",
                  color: "#000",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {currentQuestion < QUIZ_QUESTIONS.length - 1 ? "NEXT QUESTION →" : "SEE RESULTS"}
              </motion.button>
            </div>
          )}
        </div>

        {/* Side Panel */}
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: "rgba(0, 30, 50, 0.8)",
              borderRadius: 16,
              padding: 20,
              border: "1px solid #FFD70022",
              height: "fit-content",
            }}
          >
            <h3 style={{ color: "#FFD700", fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Trophy size={20} />
              YOUR PROGRESS
            </h3>

            {/* Progress dots */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {QUIZ_QUESTIONS.map((q, i) => (
                <div
                  key={i}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: i < currentQuestion 
                      ? "#00FF8833" 
                      : i === currentQuestion 
                        ? `${q.color}44`
                        : "#1a1a3e",
                    border: `2px solid ${i < currentQuestion ? "#00FF88" : i === currentQuestion ? q.color : "#333"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: i <= currentQuestion ? "#fff" : "#666",
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: "#00FF88", fontSize: 13, marginBottom: 8 }}>Topics Covered</h4>
              <ul style={{ color: "#aaa", fontSize: 11, lineHeight: 1.8, paddingLeft: 16, margin: 0 }}>
                <li>Memory Hierarchy</li>
                <li>CPU Architecture</li>
                <li>Cache Operations</li>
                <li>OS Scheduling</li>
                <li>Python Optimization</li>
              </ul>
            </div>

            <div style={{
              padding: 12,
              background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 136, 0, 0.1))",
              borderRadius: 12,
              borderLeft: "3px solid #FFD700",
            }}>
              <h4 style={{ color: "#FFD700", fontSize: 11, marginBottom: 6 }}>Master Level</h4>
              <p style={{ color: "#ccc", fontSize: 10, lineHeight: 1.5 }}>
                Score 80% or higher to earn the Hardware Master badge!
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowExplanation(!showExplanation)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 10,
            border: "2px solid #FFD70044",
            background: showExplanation ? "rgba(255, 215, 0, 0.2)" : "transparent",
            color: "#FFD700",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Info size={16} />
          {showExplanation ? "HIDE" : "SHOW"} PROGRESS
        </motion.button>
      </div>
    </div>
  );
}

export default HardwareMaster3D;
