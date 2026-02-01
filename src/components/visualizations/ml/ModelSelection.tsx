"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModelSelection() {
  const [problemType, setProblemType] = useState<'classification' | 'regression'>('classification');
  const [dataSize, setDataSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [priority, setPriority] = useState<'accuracy' | 'speed' | 'interpretability'>('accuracy');

  const models = {
    classification: [
      { 
        name: 'Logistic Regression', 
        icon: '📈',
        accuracy: 3, speed: 5, interpretability: 5,
        bestFor: 'Linear relationships, baseline model',
        avoid: 'Complex non-linear patterns',
        color: '#3b82f6'
      },
      { 
        name: 'Decision Tree', 
        icon: '🌳',
        accuracy: 3, speed: 4, interpretability: 5,
        bestFor: 'Interpretable rules, feature importance',
        avoid: 'High variance, overfitting',
        color: '#22c55e'
      },
      { 
        name: 'Random Forest', 
        icon: '🌲',
        accuracy: 4, speed: 3, interpretability: 3,
        bestFor: 'Robust performance, handles noise',
        avoid: 'Real-time predictions, memory constraints',
        color: '#10b981'
      },
      { 
        name: 'XGBoost', 
        icon: '🚀',
        accuracy: 5, speed: 3, interpretability: 2,
        bestFor: 'Winning competitions, tabular data',
        avoid: 'Small datasets, need for simplicity',
        color: '#f97316'
      },
      { 
        name: 'SVM', 
        icon: '📐',
        accuracy: 4, speed: 2, interpretability: 2,
        bestFor: 'High-dimensional data, clear margins',
        avoid: 'Large datasets, noisy data',
        color: '#8b5cf6'
      },
      { 
        name: 'Neural Network', 
        icon: '🧠',
        accuracy: 5, speed: 1, interpretability: 1,
        bestFor: 'Complex patterns, lots of data',
        avoid: 'Small data, need interpretability',
        color: '#ec4899'
      },
    ],
    regression: [
      { 
        name: 'Linear Regression', 
        icon: '📉',
        accuracy: 2, speed: 5, interpretability: 5,
        bestFor: 'Linear relationships, coefficients matter',
        avoid: 'Non-linear patterns',
        color: '#3b82f6'
      },
      { 
        name: 'Ridge/Lasso', 
        icon: '📊',
        accuracy: 3, speed: 5, interpretability: 4,
        bestFor: 'Many features, prevent overfitting',
        avoid: 'When all features are important',
        color: '#06b6d4'
      },
      { 
        name: 'Decision Tree', 
        icon: '🌳',
        accuracy: 3, speed: 4, interpretability: 5,
        bestFor: 'Non-linear, interpretable',
        avoid: 'Smooth predictions needed',
        color: '#22c55e'
      },
      { 
        name: 'Random Forest', 
        icon: '🌲',
        accuracy: 4, speed: 3, interpretability: 3,
        bestFor: 'Robust, handles outliers',
        avoid: 'Extrapolation beyond training range',
        color: '#10b981'
      },
      { 
        name: 'XGBoost', 
        icon: '🚀',
        accuracy: 5, speed: 3, interpretability: 2,
        bestFor: 'Best performance on tabular data',
        avoid: 'Simple problems, time constraints',
        color: '#f97316'
      },
      { 
        name: 'Neural Network', 
        icon: '🧠',
        accuracy: 5, speed: 1, interpretability: 1,
        bestFor: 'Complex non-linear patterns',
        avoid: 'Small data, interpretability needs',
        color: '#ec4899'
      },
    ]
  };

  const currentModels = models[problemType];

  const getScore = (model: typeof currentModels[0]) => {
    const weights = {
      accuracy: priority === 'accuracy' ? 3 : 1,
      speed: priority === 'speed' ? 3 : 1,
      interpretability: priority === 'interpretability' ? 3 : 1,
    };
    
    let score = model.accuracy * weights.accuracy + 
                model.speed * weights.speed + 
                model.interpretability * weights.interpretability;
    
    if (dataSize === 'small' && model.name.includes('Neural')) score -= 5;
    if (dataSize === 'large' && model.name === 'SVM') score -= 3;
    if (dataSize === 'small' && model.name.includes('Logistic')) score += 2;
    if (dataSize === 'small' && model.name.includes('Linear Regression')) score += 2;
    
    return score;
  };

  const sortedModels = [...currentModels].sort((a, b) => getScore(b) - getScore(a));
  const topModel = sortedModels[0];

  const renderStars = (count: number, color: string) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} style={{ color: i < count ? color : '#334155', fontSize: '14px' }}>★</span>
    ));
  };

  return (
    <div style={{
      width: '100%', minHeight: '750px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🎯 Model Selection Guide</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
          Choose the right algorithm for your problem
        </p>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '16px', 
        marginBottom: '24px',
        background: 'rgba(0,0,0,0.3)',
        padding: '20px',
        borderRadius: '16px',
      }}>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
            Problem Type
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['classification', 'regression'] as const).map(type => (
              <button
                key={type}
                onClick={() => setProblemType(type)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  background: problemType === type ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                  border: '2px solid #3b82f6',
                  color: 'white', cursor: 'pointer', fontSize: '11px',
                  fontWeight: problemType === type ? 'bold' : 'normal',
                }}
              >
                {type === 'classification' ? '📊 Classify' : '📈 Regress'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
            Dataset Size
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {([
              { id: 'small', label: '<1K' },
              { id: 'medium', label: '1K-100K' },
              { id: 'large', label: '>100K' },
            ] as const).map(size => (
              <button
                key={size.id}
                onClick={() => setDataSize(size.id)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  background: dataSize === size.id ? '#22c55e' : 'rgba(255,255,255,0.1)',
                  border: '2px solid #22c55e',
                  color: 'white', cursor: 'pointer', fontSize: '11px',
                  fontWeight: dataSize === size.id ? 'bold' : 'normal',
                }}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
            Top Priority
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {([
              { id: 'accuracy', label: '🎯 Accuracy' },
              { id: 'speed', label: '⚡ Speed' },
              { id: 'interpretability', label: '🔍 Explain' },
            ] as const).map(p => (
              <button
                key={p.id}
                onClick={() => setPriority(p.id)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  background: priority === p.id ? '#f97316' : 'rgba(255,255,255,0.1)',
                  border: '2px solid #f97316',
                  color: 'white', cursor: 'pointer', fontSize: '10px',
                  fontWeight: priority === p.id ? 'bold' : 'normal',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <motion.div
        key={`${problemType}-${dataSize}-${priority}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: `${topModel.color}20`,
          border: `3px solid ${topModel.color}`,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
          🏆 RECOMMENDED FOR YOUR NEEDS
        </div>
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>{topModel.icon}</div>
        <h3 style={{ fontSize: '24px', color: topModel.color, marginBottom: '8px' }}>{topModel.name}</h3>
        <p style={{ color: '#cbd5e1', fontSize: '14px' }}>{topModel.bestFor}</p>
      </motion.div>

      {/* All models comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        <AnimatePresence>
          {sortedModels.map((model, index) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                background: index === 0 ? `${model.color}15` : 'rgba(0,0,0,0.3)',
                border: index === 0 ? `2px solid ${model.color}` : '1px solid #334155',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>{model.icon}</span>
                  <span style={{ fontWeight: 'bold', color: model.color, fontSize: '14px' }}>{model.name}</span>
                </div>
                {index === 0 && (
                  <span style={{ 
                    background: model.color, 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}>
                    BEST
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px' }}>Accuracy</div>
                  <div>{renderStars(model.accuracy, '#22c55e')}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px' }}>Speed</div>
                  <div>{renderStars(model.speed, '#3b82f6')}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px' }}>Explain</div>
                  <div>{renderStars(model.interpretability, '#f97316')}</div>
                </div>
              </div>

              <div style={{ fontSize: '11px' }}>
                <div style={{ color: '#22c55e', marginBottom: '4px' }}>✓ {model.bestFor}</div>
                <div style={{ color: '#ef4444' }}>✗ {model.avoid}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pro tip */}
      <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', borderLeft: '4px solid #22c55e' }}>
        <h4 style={{ color: '#22c55e', marginBottom: '8px', fontSize: '14px' }}>💡 Pro Tip: Always Start Simple</h4>
        <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6' }}>
          Begin with Logistic/Linear Regression as your baseline. If it performs well enough, you're done! 
          Only add complexity if the simple model fails to meet your requirements.
        </p>
      </div>
    </div>
  );
}
