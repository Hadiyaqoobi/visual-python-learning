"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const AIJourney = dynamic(() => import('./ml/AIJourney'), { ssr: false });
const HowAILearns = dynamic(() => import('./ml/HowAILearns'), { ssr: false });
const SupervisedLearning3D = dynamic(() => import('./ml/SupervisedLearning3D'), { ssr: false });
const UnsupervisedClustering3D = dynamic(() => import('./ml/UnsupervisedClustering3D'), { ssr: false });
const ConfusionMatrix3D = dynamic(() => import('./ml/ConfusionMatrix3D'), { ssr: false });
const TrainTestSplit3D = dynamic(() => import('./ml/TrainTestSplit3D'), { ssr: false });
const OverfittingUnderfitting3D = dynamic(() => import('./ml/OverfittingUnderfitting3D'), { ssr: false });

const VISUALIZATIONS: Record<string, React.ComponentType> = {
  'what-is-machine-learning': AIJourney,
  'ml-types-supervised-unsupervised-reinforcement': SupervisedLearning3D,
  'features-and-labels': HowAILearns,
  'training-validation-test-sets': TrainTestSplit3D,
  'overfitting-and-underfitting': OverfittingUnderfitting3D,
  'model-evaluation-metrics': ConfusionMatrix3D,
  'clustering-algorithms': UnsupervisedClustering3D,
};

interface LessonVisualizationProps {
  lessonSlug: string;
}

export function LessonVisualization({ lessonSlug }: LessonVisualizationProps) {
  const VisualizationComponent = VISUALIZATIONS[lessonSlug];
  
  if (!VisualizationComponent) {
    return null;
  }
  
  return (
    <div style={{
      marginBottom: '24px',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ fontSize: '20px' }}>🎮</span>
        <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
          Interactive Visualization
        </span>
        <span style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '11px',
          color: 'white',
        }}>
          Learn by seeing
        </span>
      </div>
      <div style={{ 
        maxHeight: '700px',
        overflow: 'auto',
      }}>
        <Suspense fallback={
          <div style={{
            height: '400px',
            background: '#1a1a2e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid rgba(139, 92, 246, 0.3)',
                borderTopColor: '#8b5cf6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 12px',
              }} />
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading visualization...</p>
            </div>
          </div>
        }>
          <VisualizationComponent />
        </Suspense>
      </div>
    </div>
  );
}
