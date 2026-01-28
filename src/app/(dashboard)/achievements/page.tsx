"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Lock, Star, Zap, BookOpen, Target, TrendingUp, Sparkles } from "lucide-react";

interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  iconUrl: string;
  xpReward: number;
  category: string;
  unlocked?: boolean;
  unlockedAt?: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For now, use static achievements data
    const staticAchievements: Achievement[] = [
      {
        id: "1",
        code: "first_lesson",
        title: "First Steps",
        description: "Complete your first lesson",
        iconUrl: "🎯",
        xpReward: 50,
        category: "PROGRESS",
        unlocked: false,
      },
      {
        id: "2",
        code: "first_exercise",
        title: "Problem Solver",
        description: "Complete your first exercise",
        iconUrl: "✅",
        xpReward: 25,
        category: "PROGRESS",
        unlocked: false,
      },
      {
        id: "3",
        code: "chapter_1_complete",
        title: "Chapter 1 Master",
        description: "Complete all lessons in Chapter 1",
        iconUrl: "🏆",
        xpReward: 200,
        category: "PROGRESS",
        unlocked: false,
      },
      {
        id: "4",
        code: "perfect_exercise",
        title: "Perfect Score",
        description: "Get an exercise right on the first try",
        iconUrl: "⭐",
        xpReward: 30,
        category: "MASTERY",
        unlocked: false,
      },
      {
        id: "5",
        code: "streak_3",
        title: "On a Roll",
        description: "Maintain a 3-day learning streak",
        iconUrl: "🔥",
        xpReward: 75,
        category: "STREAK",
        unlocked: false,
      },
      {
        id: "6",
        code: "streak_7",
        title: "Week Warrior",
        description: "Maintain a 7-day learning streak",
        iconUrl: "💪",
        xpReward: 150,
        category: "STREAK",
        unlocked: false,
      },
      {
        id: "7",
        code: "hardware_explorer",
        title: "Hardware Explorer",
        description: "Use Hardware Mode for the first time",
        iconUrl: "🖥️",
        xpReward: 25,
        category: "EXPLORATION",
        unlocked: false,
      },
    ];
    
    setAchievements(staticAchievements);
    setIsLoading(false);
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXP = achievements.filter(a => a.unlocked).reduce((acc, a) => acc + a.xpReward, 0);

  const categories = [
    { name: "PROGRESS", label: "Progress", icon: BookOpen, color: "#6366f1" },
    { name: "MASTERY", label: "Mastery", icon: Star, color: "#f59e0b" },
    { name: "STREAK", label: "Streaks", icon: TrendingUp, color: "#ef4444" },
    { name: "EXPLORATION", label: "Exploration", icon: Sparkles, color: "#8b5cf6" },
  ];

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
      padding: "32px",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "32px" }}
        >
          <h1 style={{ 
            fontSize: "32px", 
            fontWeight: "800", 
            color: "#1e293b", 
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}>
            <Trophy style={{ width: "32px", height: "32px", color: "#f59e0b" }} />
            Achievements
          </h1>
          <p style={{ fontSize: "16px", color: "#64748b" }}>
            Unlock badges as you progress through your learning journey.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "#6366f1" }}>
              {unlockedCount}/{achievements.length}
            </div>
            <div style={{ fontSize: "14px", color: "#64748b" }}>Achievements Unlocked</div>
          </div>
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "#f59e0b" }}>
              {totalXP}
            </div>
            <div style={{ fontSize: "14px", color: "#64748b" }}>XP from Achievements</div>
          </div>
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "#22c55e" }}>
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </div>
            <div style={{ fontSize: "14px", color: "#64748b" }}>Completion Rate</div>
          </div>
        </motion.div>

        {/* Achievement Categories */}
        {categories.map((category, catIndex) => {
          const categoryAchievements = achievements.filter(a => a.category === category.name);
          if (categoryAchievements.length === 0) return null;
          
          const Icon = category.icon;
          
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + catIndex * 0.1 }}
              style={{ marginBottom: "32px" }}
            >
              <h2 style={{ 
                fontSize: "18px", 
                fontWeight: "700", 
                color: "#1e293b", 
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <Icon style={{ width: "20px", height: "20px", color: category.color }} />
                {category.label}
              </h2>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
              }}>
                {categoryAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
                    style={{
                      background: achievement.unlocked ? "white" : "#f8fafc",
                      borderRadius: "16px",
                      padding: "20px",
                      border: achievement.unlocked 
                        ? `2px solid ${category.color}` 
                        : "1px solid #e2e8f0",
                      opacity: achievement.unlocked ? 1 : 0.7,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {!achievement.unlocked && (
                      <div style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                      }}>
                        <Lock style={{ width: "18px", height: "18px", color: "#94a3b8" }} />
                      </div>
                    )}
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "14px",
                        background: achievement.unlocked 
                          ? `${category.color}15`
                          : "#e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "28px",
                        filter: achievement.unlocked ? "none" : "grayscale(1)",
                      }}>
                        {achievement.iconUrl}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          fontSize: "16px", 
                          fontWeight: "600", 
                          color: achievement.unlocked ? "#1e293b" : "#64748b",
                          marginBottom: "4px",
                        }}>
                          {achievement.title}
                        </h3>
                        <p style={{ 
                          fontSize: "13px", 
                          color: "#64748b",
                          marginBottom: "8px",
                        }}>
                          {achievement.description}
                        </p>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: achievement.unlocked ? "#f59e0b" : "#94a3b8",
                        }}>
                          <Zap style={{ width: "14px", height: "14px" }} />
                          +{achievement.xpReward} XP
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
