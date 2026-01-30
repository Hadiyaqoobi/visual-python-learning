// H20: Interactive Mental Model Builder
// Final capstone - build and test your understanding

import React, { useState } from 'react';

interface Concept {
  id: string;
  name: string;
  category: 'digital' | 'cpu' | 'memory' | 'bridge';
  description: string;
  icon: string;
  color: string;
  connections: string[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  concept: string;
}

const CONCEPTS: Concept[] = [
  // Digital Foundations
  { id: 'binary', name: 'Binary', category: 'digital', icon: '01', color: '#3b82f6',
    description: 'All data represented as 0s and 1s', connections: ['gates', 'registers'] },
  { id: 'gates', name: 'Logic Gates', category: 'digital', icon: '⊕', color: '#8b5cf6',
    description: 'AND, OR, NOT - building blocks of computation', connections: ['alu', 'binary'] },
  { id: 'alu', name: 'ALU', category: 'digital', icon: '➕', color: '#ec4899',
    description: 'Arithmetic Logic Unit - performs math and logic', connections: ['gates', 'cpu'] },
  
  // CPU
  { id: 'registers', name: 'Registers', category: 'cpu', icon: '📊', color: '#ef4444',
    description: 'Fastest storage, inside CPU', connections: ['binary', 'cpu', 'cache'] },
  { id: 'cpu', name: 'CPU', category: 'cpu', icon: '🔲', color: '#f97316',
    description: 'Central Processing Unit - the brain', connections: ['alu', 'registers', 'controlunit'] },
  { id: 'controlunit', name: 'Control Unit', category: 'cpu', icon: '🎛️', color: '#eab308',
    description: 'Orchestrates fetch-decode-execute cycle', connections: ['cpu', 'fde'] },
  { id: 'fde', name: 'FDE Cycle', category: 'cpu', icon: '🔄', color: '#84cc16',
    description: 'Fetch-Decode-Execute - how instructions run', connections: ['controlunit', 'ram'] },
  
  // Memory
  { id: 'cache', name: 'Cache', category: 'memory', icon: '⚡', color: '#22c55e',
    description: 'Fast memory between CPU and RAM', connections: ['registers', 'ram'] },
  { id: 'ram', name: 'RAM', category: 'memory', icon: '💾', color: '#14b8a6',
    description: 'Main memory - stores running programs', connections: ['cache', 'fde', 'pyobject'] },
  { id: 'hierarchy', name: 'Memory Hierarchy', category: 'memory', icon: '🔺', color: '#06b6d4',
    description: 'Registers → Cache → RAM → Disk', connections: ['registers', 'cache', 'ram'] },
  
  // Bridge
  { id: 'bytecode', name: 'Bytecode', category: 'bridge', icon: '📝', color: '#0ea5e9',
    description: 'Python compiled to VM instructions', connections: ['python', 'cpu'] },
  { id: 'pyobject', name: 'PyObject', category: 'bridge', icon: '📦', color: '#6366f1',
    description: 'How Python stores all values in memory', connections: ['ram', 'python'] },
  { id: 'stack', name: 'Call Stack', category: 'bridge', icon: '📚', color: '#8b5cf6',
    description: 'Tracks function calls and returns', connections: ['ram', 'python'] },
  { id: 'python', name: 'Python Code', category: 'bridge', icon: '🐍', color: '#a855f7',
    description: 'High-level code you write', connections: ['bytecode', 'pyobject', 'stack'] },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'Why do computers use binary (0 and 1)?',
    options: ['It\'s faster than decimal', 'Electronic circuits have two states (on/off)', 'Binary was invented first', 'It uses less memory'],
    correct: 1,
    explanation: 'Electronic circuits naturally have two states: voltage present (1) or absent (0). This makes binary reliable and easy to implement in hardware.',
    concept: 'binary'
  },
  {
    question: 'What does the ALU do?',
    options: ['Stores data', 'Controls timing', 'Performs arithmetic and logic operations', 'Manages memory'],
    correct: 2,
    explanation: 'The Arithmetic Logic Unit performs all mathematical operations (add, subtract, multiply) and logical operations (AND, OR, comparisons).',
    concept: 'alu'
  },
  {
    question: 'Why are registers faster than RAM?',
    options: ['They\'re bigger', 'They\'re inside the CPU', 'They use better materials', 'They\'re newer technology'],
    correct: 1,
    explanation: 'Registers are physically located inside the CPU chip, so data doesn\'t need to travel far. RAM is separate and requires going through buses.',
    concept: 'registers'
  },
  {
    question: 'What is a cache miss?',
    options: ['CPU crashes', 'Data not found in cache, must fetch from RAM', 'Cache is full', 'Program error'],
    correct: 1,
    explanation: 'A cache miss occurs when requested data isn\'t in the cache. The CPU must then fetch it from slower RAM, taking much longer.',
    concept: 'cache'
  },
  {
    question: 'What happens in the "Fetch" phase of FDE?',
    options: ['Execute the instruction', 'Get the next instruction from memory', 'Store the result', 'Decode the opcode'],
    correct: 1,
    explanation: 'Fetch retrieves the next instruction from memory using the instruction pointer (RIP). The CPU then decodes and executes it.',
    concept: 'fde'
  },
  {
    question: 'What is Python bytecode?',
    options: ['Machine code', 'Binary data', 'Intermediate instructions for Python VM', 'Compressed Python'],
    correct: 2,
    explanation: 'Python compiles your code to bytecode - instructions for the Python Virtual Machine. This bytecode is then interpreted to run on actual hardware.',
    concept: 'bytecode'
  },
  {
    question: 'In Python, what is a PyObject?',
    options: ['A Python file', 'The structure storing any Python value in memory', 'A class definition', 'An import statement'],
    correct: 1,
    explanation: 'Every Python value (int, str, list, etc.) is stored in memory as a PyObject with reference count, type pointer, and the actual data.',
    concept: 'pyobject'
  },
  {
    question: 'What grows when you call nested functions?',
    options: ['RAM size', 'CPU speed', 'The call stack', 'Cache size'],
    correct: 2,
    explanation: 'Each function call pushes a stack frame onto the call stack. Deeply nested or recursive calls can cause stack overflow.',
    concept: 'stack'
  },
];

const CATEGORIES = [
  { id: 'digital', name: 'Digital Foundations', color: '#3b82f6' },
  { id: 'cpu', name: 'CPU Architecture', color: '#f97316' },
  { id: 'memory', name: 'Memory Systems', color: '#22c55e' },
  { id: 'bridge', name: 'Software-Hardware Bridge', color: '#8b5cf6' },
];

export const MentalModelBuilder: React.FC = () => {
  const [view, setView] = useState<'map' | 'quiz' | 'summary'>('map');
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  const concept = selectedConcept ? CONCEPTS.find(c => c.id === selectedConcept) : null;
  const question = QUIZ_QUESTIONS[quizIndex];

  const handleAnswer = (idx: number) => {
    if (showExplanation) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === question.correct && !answeredQuestions.includes(quizIndex)) {
      setScore(s => s + 1);
      setAnsweredQuestions(prev => [...prev, quizIndex]);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizIndex((quizIndex + 1) % QUIZ_QUESTIONS.length);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions([]);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Build Your Mental Model</h2>
        <p className="text-gray-600">
          Review concepts, see how they connect, and test your understanding of how computers work.
        </p>
      </div>

      {/* View tabs */}
      <div className="mb-6 flex gap-2">
        {[
          { id: 'map', label: '🗺️ Concept Map' },
          { id: 'quiz', label: '❓ Quiz' },
          { id: 'summary', label: '📋 Summary' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setView(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-medium ${
              view === tab.id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Concept Map View */}
      {view === 'map' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Concept grid by category */}
          <div className="col-span-2">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="mb-6">
                <h3 className="font-bold mb-2" style={{ color: cat.color }}>{cat.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {CONCEPTS.filter(c => c.category === cat.id).map(c => (
                    <button key={c.id}
                      onClick={() => setSelectedConcept(c.id === selectedConcept ? null : c.id)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all ${
                        selectedConcept === c.id ? 'ring-2 ring-offset-2 scale-105' : 'hover:scale-105'
                      }`}
                      style={{ 
                        backgroundColor: c.color, 
                        color: 'white',
                        ringColor: c.color 
                      }}>
                      <span className="mr-1">{c.icon}</span>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Selected concept details */}
          <div className="col-span-1">
            {concept ? (
              <div className="p-4 rounded-lg text-white" style={{ backgroundColor: concept.color }}>
                <div className="text-3xl mb-2">{concept.icon}</div>
                <h3 className="text-xl font-bold mb-2">{concept.name}</h3>
                <p className="opacity-90 mb-4">{concept.description}</p>
                <div>
                  <span className="text-sm opacity-75">Connects to:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {concept.connections.map(connId => {
                      const conn = CONCEPTS.find(c => c.id === connId);
                      return conn ? (
                        <button key={connId}
                          onClick={() => setSelectedConcept(connId)}
                          className="text-xs px-2 py-1 bg-white/20 rounded hover:bg-white/30">
                          {conn.icon} {conn.name}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
                <p>Click a concept to see details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quiz View */}
      {view === 'quiz' && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <span className="text-gray-600">Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}</span>
            <span className="font-bold text-green-600">Score: {score}/{QUIZ_QUESTIONS.length}</span>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg mb-4">
            <h3 className="text-lg font-bold mb-4">{question.question}</h3>
            <div className="space-y-2">
              {question.options.map((opt, idx) => {
                let style = 'bg-white border-gray-200 hover:border-blue-400';
                if (showExplanation) {
                  if (idx === question.correct) style = 'bg-green-100 border-green-500';
                  else if (idx === selectedAnswer) style = 'bg-red-100 border-red-500';
                }
                return (
                  <button key={idx} onClick={() => handleAnswer(idx)}
                    disabled={showExplanation}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${style}`}>
                    <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {showExplanation && (
            <div className={`p-4 rounded-lg mb-4 ${
              selectedAnswer === question.correct ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
            }`}>
              <h4 className="font-bold mb-1">
                {selectedAnswer === question.correct ? '✓ Correct!' : '✗ Not quite'}
              </h4>
              <p>{question.explanation}</p>
            </div>
          )}

          <div className="flex gap-2">
            {showExplanation && (
              <button onClick={nextQuestion}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Next Question →
              </button>
            )}
            <button onClick={resetQuiz}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              Reset Quiz
            </button>
          </div>
        </div>
      )}

      {/* Summary View */}
      {view === 'summary' && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">🎯 What You've Learned</h3>
            <ul className="space-y-2 text-blue-900">
              <li>✓ Computers use binary because circuits have two states (on/off)</li>
              <li>✓ Logic gates combine to form ALUs that do math</li>
              <li>✓ CPUs execute instructions via fetch-decode-execute cycles</li>
              <li>✓ Memory hierarchy trades speed for size (registers → cache → RAM)</li>
              <li>✓ Python compiles to bytecode, then runs on hardware</li>
              <li>✓ Every Python value is a PyObject in memory</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold text-green-800 mb-2">🔗 The Big Picture</h3>
            <p className="text-green-900">
              When you write <code className="bg-green-200 px-1 rounded">x = 5 + 3</code>, Python compiles it to bytecode, 
              the CPU fetches and decodes instructions, the ALU adds 5+3 using logic gates operating on binary, 
              the result goes through registers and cache to RAM as a PyObject. All layers work together!
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-bold text-yellow-800 mb-2">💡 Why This Matters</h3>
            <p className="text-yellow-900">
              Understanding hardware helps you write better Python: use cache-friendly patterns, 
              avoid stack overflow with deep recursion, understand why some operations are faster,
              and debug memory issues. You now have the mental model to reason about performance!
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="p-3 rounded-lg text-white text-center" style={{ backgroundColor: cat.color }}>
                <div className="font-bold">{cat.name}</div>
                <div className="text-sm opacity-90">{CONCEPTS.filter(c => c.category === cat.id).length} concepts</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalModelBuilder;
