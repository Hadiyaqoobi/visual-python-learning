"use client";

import dynamic from 'next/dynamic';
import { useState, Suspense } from 'react';

const AIJourney = dynamic(() => import('@/components/visualizations/ml/AIJourney'), { ssr: false });
const HowAILearns = dynamic(() => import('@/components/visualizations/ml/HowAILearns'), { ssr: false });
const SupervisedLearning3D = dynamic(() => import('@/components/visualizations/ml/SupervisedLearning3D'), { ssr: false });
const UnsupervisedClustering3D = dynamic(() => import('@/components/visualizations/ml/UnsupervisedClustering3D'), { ssr: false });
const ConfusionMatrix3D = dynamic(() => import('@/components/visualizations/ml/ConfusionMatrix3D'), { ssr: false });
const TrainTestSplit3D = dynamic(() => import('@/components/visualizations/ml/TrainTestSplit3D'), { ssr: false });
const OverfittingUnderfitting3D = dynamic(() => import('@/components/visualizations/ml/OverfittingUnderfitting3D'), { ssr: false });

export default function TestMLViz() {
  const [activeViz, setActiveViz] = useState('aijourney');

  const vizzes = [
    { id: 'aijourney', name: '🚀 AI Journey', desc: 'Complete interactive experience', featured: true },
    { id: 'howailearns', name: '🧠 How AI Learns', desc: 'Step-by-step breakdown' },
    { id: 'supervised', name: 'Supervised', desc: 'Labeled data' },
    { id: 'unsupervised', name: 'Clustering', desc: 'Find patterns' },
    { id: 'confusion', name: 'Confusion Matrix', desc: 'Measure accuracy' },
    { id: 'split', name: 'Train/Test Split', desc: 'Prepare data' },
    { id: 'overfit', name: 'Overfitting', desc: 'Model complexity' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a1a', padding: '32px' }}>
      <h1 style={{ 
        fontSize: '36px', 
        fontWeight: 'bold', 
        color: 'white', 
        marginBottom: '8px', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        🤖 Machine Learning Visualizations
      </h1>
      <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '24px' }}>
        Interactive visualizations to understand how AI actually works
      </p>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {vizzes.map(viz => (
          <button
            key={viz.id}
            onClick={() => setActiveViz(viz.id)}
            style={{
              padding: viz.featured ? '14px 24px' : '12px 20px',
              borderRadius: '12px',
              fontWeight: 500,
              backgroundColor: activeViz === viz.id ? '#3b82f6' : viz.featured ? 'rgba(139, 92, 246, 0.3)' : '#1e293b',
              color: 'white',
              border: activeViz === viz.id ? '2px solid #60a5fa' : viz.featured ? '2px solid #8b5cf6' : '2px solid #334155',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: viz.featured && activeViz !== viz.id ? '0 0 20px rgba(139, 92, 246, 0.3)' : 'none'
            }}
          >
            <div style={{ fontSize: viz.featured ? '15px' : '14px' }}>{viz.name}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{viz.desc}</div>
          </button>
        ))}
      </div>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Suspense fallback={
          <div style={{ 
            height: '600px', 
            backgroundColor: '#1e293b', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white' 
          }}>
            Loading visualization...
          </div>
        }>
          {activeViz === 'aijourney' && <AIJourney />}
          {activeViz === 'howailearns' && <HowAILearns />}
          {activeViz === 'supervised' && <SupervisedLearning3D />}
          {activeViz === 'unsupervised' && <UnsupervisedClustering3D />}
          {activeViz === 'confusion' && <ConfusionMatrix3D />}
          {activeViz === 'split' && <TrainTestSplit3D />}
          {activeViz === 'overfit' && <OverfittingUnderfitting3D />}
        </Suspense>
      </div>
    </div>
  );
}
