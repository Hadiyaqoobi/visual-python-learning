"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui";
import { 
  Code2, 
  BookOpen, 
  Trophy, 
  Flame, 
  ArrowRight,
  Play,
  Clock,
  Target
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const quickActions = [
    {
      title: "Python IDE",
      description: "Write and run Python code",
      href: "/ide",
      icon: Code2,
      color: "bg-blue-600",
    },
    {
      title: "Continue Learning",
      description: "Pick up where you left off",
      href: "/learn",
      icon: BookOpen,
      color: "bg-green-600",
    },
    {
      title: "Practice",
      description: "Solve coding challenges",
      href: "/practice",
      icon: Target,
      color: "bg-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.firstName || "Learner"}! 👋
          </h1>
          <p className="text-slate-400">
            Ready to continue your Python journey?
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={logout} 
          className="text-slate-300 border-slate-600 hover:bg-slate-800"
        >
          Sign Out
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <Trophy className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{user.totalXp}</p>
              <p className="text-slate-400 text-sm">Total XP</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-600/20 rounded-lg">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{user.streak}</p>
              <p className="text-slate-400 text-sm">Day Streak</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{user.currentChapter}/24</p>
              <p className="text-slate-400 text-sm">Chapters Done</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-600/20 rounded-lg">
              <Clock className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">12h</p>
              <p className="text-slate-400 text-sm">Time Learned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {quickActions.map((action) => (
          <Link key={action.title} href={action.href}>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-colors cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className={`p-3 ${action.color} rounded-lg`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">
                {action.title}
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Continue Learning Section */}
      <h2 className="text-xl font-semibold text-white mb-4">Continue Learning</h2>
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-400">{user.currentChapter}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Chapter {user.currentChapter}: Variables and Data Types
              </h3>
              <p className="text-slate-400 text-sm">
                Learn how Python stores and manipulates data
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex-1 max-w-xs bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "35%" }} />
                </div>
                <span className="text-sm text-slate-400">35% complete</span>
              </div>
            </div>
          </div>
          <Link href="/learn">
            <Button leftIcon={<Play className="w-4 h-4" />}>
              Continue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
