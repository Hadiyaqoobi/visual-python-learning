"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { chapters } from "@/data/chapters";
import {
  BookOpen,
  Clock,
  ChevronRight,
  Search,
  Filter,
  Cpu,
  Code,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPart, setSelectedPart] = useState<number | null>(null);

  // Group chapters by part
  const parts = chapters.reduce((acc, chapter) => {
    if (!acc[chapter.part]) {
      acc[chapter.part] = {
        name: chapter.partName,
        chapters: [],
      };
    }
    acc[chapter.part].chapters.push(chapter);
    return acc;
  }, {} as Record<number, { name: string; chapters: typeof chapters }>);

  // Filter chapters
  const filteredChapters = chapters.filter((chapter) => {
    const matchesSearch =
      searchQuery === "" ||
      chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chapter.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPart = selectedPart === null || chapter.part === selectedPart;
    return matchesSearch && matchesPart;
  });

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-2">Learn Python + Hardware</h1>
        <p className="text-gray-400">
          Master Python programming while understanding how code runs on real hardware
        </p>
      </div>

      {/* Search and Filter */}
      <div className="max-w-6xl mx-auto mb-8 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPart(null)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              selectedPart === null
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "bg-gray-800/50 text-gray-400 hover:text-white"
            }`}
          >
            All
          </button>
          {Object.entries(parts).map(([partNum, part]) => (
            <button
              key={partNum}
              onClick={() => setSelectedPart(parseInt(partNum))}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                selectedPart === parseInt(partNum)
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "bg-gray-800/50 text-gray-400 hover:text-white"
              }`}
            >
              Part {partNum}
            </button>
          ))}
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="max-w-6xl mx-auto">
        {Object.entries(parts).map(([partNum, part]) => {
          const partChapters = filteredChapters.filter(
            (c) => c.part === parseInt(partNum)
          );
          if (partChapters.length === 0) return null;

          return (
            <div key={partNum} className="mb-12">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-cyan-400">Part {partNum}:</span>
                <span>{part.name}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {partChapters.map((chapter, index) => (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/learn/chapter/${chapter.id}`}>
                      <div
                        className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5 hover:border-cyan-500/50 hover:bg-gray-800/50 transition-all cursor-pointer group"
                        style={{
                          borderLeftColor: chapter.color,
                          borderLeftWidth: "3px",
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{chapter.icon}</span>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">
                                Chapter {chapter.id}
                              </div>
                              <h3 className="font-semibold group-hover:text-cyan-400 transition-colors">
                                {chapter.title}
                              </h3>
                            </div>
                          </div>
                          <ChevronRight
                            size={20}
                            className="text-gray-600 group-hover:text-cyan-400 transition-colors"
                          />
                        </div>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                          {chapter.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {chapter.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen size={12} />
                              {chapter.concepts.length} concepts
                            </span>
                            <span className="flex items-center gap-1">
                              <Code size={12} />
                              {chapter.exercises.length} exercises
                            </span>
                          </div>
                        </div>

                        {/* Hardware indicator */}
                        {chapter.hardwareConnection && (
                          <div className="mt-3 pt-3 border-t border-gray-700/50 flex items-center gap-2 text-xs text-orange-400">
                            <Cpu size={12} />
                            <span>Hardware visualization included</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access to IDE */}
      <div className="max-w-6xl mx-auto mt-12">
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">Want to experiment freely?</h3>
              <p className="text-gray-400 text-sm">
                Open the IDE with hardware visualization to write and test any Python code
              </p>
            </div>
            <Link
              href="/ide"
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Zap size={18} />
              Open IDE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
