"use client";
import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight,
  Lightbulb, Hand, Cpu, Code2, Briefcase,
  Trophy, Star, Volume2, VolumeX,
  Maximize2, Minimize2, HelpCircle
} from 'lucide-react';

type ExplanationLayer = 1 | 2 | 3 | 4 | 5;

interface LayerConfig {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  component: ReactNode;
}

interface ChallengeItem {
  id: string;
  title: string;
  description: string;
}

interface LessonWrapperProps {
  lessonId: string;
  title: string;
  layers: LayerConfig[];
  challenges?: ChallengeItem[];
}

const LAYER_META = [
  { icon: Lightbulb, color: '#f59e0b', duration: '~5 sec', description: 'Instant intuition through analogy' },
  { icon: Hand, color: '#22c55e', duration: '~30 sec', description: 'Control variables, experiment' },
  { icon: Cpu, color: '#3b82f6', duration: '~2 min', description: 'Accurate step-by-step visualization' },
  { icon: Code2, color: '#8b5cf6', duration: '~1 min', description: 'Python to Hardware mapping' },
  { icon: Briefcase, color: '#ec4899', duration: '~30 sec', description: 'Industry applications' },
];

export function LessonWrapper({ lessonId, title, layers, challenges = [] }: LessonWrapperProps) {
  const [currentLayer, setCurrentLayer] = useState<ExplanationLayer>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [completedLayers, setCompletedLayers] = useState<ExplanationLayer[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);

  const moduleColor = '#f59e0b';

  useEffect(() => {
    const interval = setInterval(() => setTimeSpent(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case ' ': e.preventDefault(); setIsPlaying(prev => !prev); break;
        case 'r': case 'R': handleReset(); break;
        case 'ArrowLeft': goToPreviousLayer(); break;
        case 'ArrowRight': goToNextLayer(); break;
        case '1': case '2': case '3': case '4': case '5':
          setCurrentLayer(parseInt(e.key) as ExplanationLayer); break;
        case 'f': case 'F': toggleFullscreen(); break;
        case 'm': case 'M': setIsMuted(prev => !prev); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLayer]);

  const goToNextLayer = useCallback(() => {
    if (currentLayer < 5) {
      if (!completedLayers.includes(currentLayer)) setCompletedLayers(prev => [...prev, currentLayer]);
      setCurrentLayer((currentLayer + 1) as ExplanationLayer);
    } else {
      if (!completedLayers.includes(5)) setCompletedLayers(prev => [...prev, 5]);
    }
  }, [currentLayer, completedLayers]);

  const goToPreviousLayer = useCallback(() => {
    if (currentLayer > 1) setCurrentLayer((currentLayer - 1) as ExplanationLayer);
  }, [currentLayer]);

  const handleReset = useCallback(() => {
    setCurrentLayer(1);
    setIsPlaying(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const layerConfig = layers[currentLayer - 1];
  const meta = LAYER_META[currentLayer - 1];
  const MetaIcon = meta.icon;
  const progress = (completedLayers.length / 5) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A0A1E 0%, #1A1A3E 50%, #0A0A1E 100%)',
      color: 'white',
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10, 10, 30, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '12px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'linear-gradient(135deg, #f59e0b, #f59e0b88)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px #f59e0b44'
            }}>
              <Cpu style={{ width: 24, height: 24 }} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 1 }}>
                {lessonId}
              </div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{title}</h1>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', fontSize: 12 }}>
              {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
            </div>
            <button onClick={() => setIsMuted(!isMuted)} style={{ padding: 8, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.1)', color: isMuted ? '#ef4444' : 'white', cursor: 'pointer' }}>
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button onClick={toggleFullscreen} style={{ padding: 8, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button onClick={() => setShowHelp(!showHelp)} style={{ padding: 8, borderRadius: 8, border: 'none', background: showHelp ? moduleColor : 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>
              <HelpCircle size={18} />
            </button>
            {challenges.length > 0 && (
              <button onClick={() => setShowChallenges(!showChallenges)} style={{
                padding: '8px 16px', borderRadius: 8, border: 'none',
                background: showChallenges ? 'linear-gradient(135deg, #f59e0b, #eab308)' : 'rgba(255,255,255,0.1)',
                color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12
              }}>
                <Trophy size={14} /> Challenges
              </button>
            )}
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <motion.div animate={{ width: progress + '%' }} style={{ height: '100%', background: 'linear-gradient(90deg, #f59e0b, #00FFFF)', borderRadius: 2 }} />
          </div>
        </div>
      </header>

      {/* Layer tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '16px 24px', background: 'rgba(0,0,0,0.3)' }}>
        {layers.map((layer, idx) => {
          const layerMeta = LAYER_META[idx];
          const LIcon = layerMeta.icon;
          const isActive = currentLayer === layer.id;
          const isComplete = completedLayers.includes(layer.id as ExplanationLayer);
          return (
            <motion.button key={layer.id} onClick={() => setCurrentLayer(layer.id as ExplanationLayer)}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 12,
                border: isActive ? '2px solid ' + layerMeta.color : '2px solid transparent',
                background: isActive ? layerMeta.color + '22' : isComplete ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                color: isActive ? layerMeta.color : isComplete ? '#22c55e' : '#888',
                cursor: 'pointer', position: 'relative'
              }}>
              {isComplete && !isActive && (
                <div style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none"/></svg>
                </div>
              )}
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: isActive ? layerMeta.color : 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: isActive ? 'white' : '#888'
              }}>{layer.id}</div>
              <LIcon size={16} />
            </motion.button>
          );
        })}
      </div>

      {/* Main content */}
      <main style={{ padding: '24px', paddingBottom: 120, minHeight: 'calc(100vh - 280px)' }}>
        <motion.div key={currentLayer} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
            padding: '12px 24px', marginBottom: 24, borderRadius: 12,
            background: 'linear-gradient(135deg, ' + meta.color + '22, ' + meta.color + '11)',
            border: '1px solid ' + meta.color + '44'
          }}>
          <MetaIcon size={20} style={{ color: meta.color }} />
          <div>
            <span style={{ fontSize: 14, fontWeight: 600, color: meta.color }}>
              Layer {currentLayer}: {layerConfig.title}
            </span>
            <span style={{ fontSize: 12, color: '#888', marginLeft: 12 }}>
              {meta.description} - {meta.duration}
            </span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={currentLayer} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.2 }}
            style={{ borderRadius: 16, overflow: 'hidden', background: 'white', color: '#1e293b', border: '1px solid #e2e8f0' }}>
            {layerConfig.component}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer navigation */}
      <footer style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 24px',
        background: 'rgba(10, 10, 30, 0.95)', backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <button onClick={goToPreviousLayer} disabled={currentLayer === 1} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12,
          border: 'none', background: currentLayer > 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
          color: currentLayer > 1 ? 'white' : '#444', cursor: currentLayer > 1 ? 'pointer' : 'not-allowed', fontSize: 14
        }}>
          <ChevronLeft size={18} /> Previous
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setIsPlaying(!isPlaying)} style={{
            width: 56, height: 56, borderRadius: '50%', border: 'none',
            background: 'linear-gradient(135deg, #f59e0b, #f59e0b88)',
            color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px #f59e0b44'
          }}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: 4 }} />}
          </button>
          <button onClick={handleReset} style={{
            width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <RotateCcw size={18} />
          </button>
        </div>
        <button onClick={goToNextLayer} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, border: 'none',
          background: currentLayer < 5 ? 'linear-gradient(135deg, #f59e0b, #f59e0b88)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
          color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600
        }}>
          {currentLayer < 5 ? 'Next Layer' : 'Complete'} <ChevronRight size={18} />
        </button>
      </footer>

      {/* Help modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
            onClick={() => setShowHelp(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'linear-gradient(135deg, #1a1a2e, #2a2a40)', borderRadius: 20, padding: 32, maxWidth: 400, border: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 style={{ margin: '0 0 20px', fontSize: 20 }}>Keyboard Shortcuts</h2>
              {[
                { key: 'Space', action: 'Play/Pause' },
                { key: 'R', action: 'Reset lesson' },
                { key: 'Arrow Keys', action: 'Navigate layers' },
                { key: '1-5', action: 'Jump to layer' },
                { key: 'F', action: 'Fullscreen' },
                { key: 'M', action: 'Mute' },
              ].map(({ key, action }) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <code style={{ padding: '4px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.1)', fontSize: 13 }}>{key}</code>
                  <span style={{ color: '#888' }}>{action}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenges sidebar */}
      <AnimatePresence>
        {showChallenges && (
          <motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 320,
              background: 'linear-gradient(135deg, #1a1a2e, #2a2a40)',
              borderLeft: '1px solid rgba(255,255,255,0.1)', padding: 24, zIndex: 150, overflowY: 'auto'
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Trophy style={{ color: '#f59e0b' }} /> Challenges
              </h2>
              <button onClick={() => setShowChallenges(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 24 }}>x</button>
            </div>
            {challenges.map(ch => (
              <div key={ch.id} style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 12 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: 14 }}>{ch.title}</h3>
                <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{ch.description}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LessonWrapper;
