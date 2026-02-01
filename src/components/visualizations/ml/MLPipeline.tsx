"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MLPipeline() {
  const [activeStage, setActiveStage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [dataPoint, setDataPoint] = useState({ x: 0, stage: 0 });

  const stages = [
    {
      id: 'raw-data',
      name: 'Raw Data',
      icon: '📊',
      color: '#ef4444',
      description: 'Messy, real-world data with missing values, different scales, and various formats',
      example: {
        before: '["$50,000", null, "Yes", 25]',
        after: null,
      },
      details: [
        'Missing values (nulls, NaN)',
        'Mixed data types (numbers, text)',
        'Different scales ($50k vs 25)',
        'Inconsistent formats',
      ],
    },
    {
      id: 'preprocessing',
      name: 'Preprocessing',
      icon: '🔧',
      color: '#f97316',
      description: 'Clean and transform data into a format ML algorithms can understand',
      example: {
        before: '["$50,000", null, "Yes", 25]',
        after: '[50000, 35000, 1, 25]',
      },
      details: [
        'Handle missing values (imputation)',
        'Encode categories (Yes→1, No→0)',
        'Scale numbers (normalization)',
        'Remove outliers',
      ],
    },
    {
      id: 'feature-engineering',
      name: 'Feature Engineering',
      icon: '⚙️',
      color: '#eab308',
      description: 'Create new features and select the most predictive ones',
      example: {
        before: '[income, age]',
        after: '[income, age, income/age, age²]',
      },
      details: [
        'Create interaction features',
        'Polynomial features',
        'Domain-specific features',
        'Feature selection',
      ],
    },
    {
      id: 'split',
      name: 'Train/Test Split',
      icon: '✂️',
      color: '#22c55e',
      description: 'Separate data to evaluate model on unseen examples',
      example: {
        before: '1000 samples',
        after: '800 train + 200 test',
      },
      details: [
        'Typically 80/20 or 70/30 split',
        'Stratified for classification',
        'Never peek at test data!',
        'Prevents overfitting evaluation',
      ],
    },
    {
      id: 'model',
      name: 'Model Training',
      icon: '🧠',
      color: '#3b82f6',
      description: 'Algorithm learns patterns from training data',
      example: {
        before: 'X_train, y_train',
        after: 'trained model',
      },
      details: [
        'Choose algorithm (RF, SVM, NN...)',
        'Fit on training data only',
        'Model learns parameters',
        'May take seconds to hours',
      ],
    },
    {
      id: 'evaluation',
      name: 'Evaluation',
      icon: '📈',
      color: '#8b5cf6',
      description: 'Measure performance on held-out test data',
      example: {
        before: 'model + X_test',
        after: 'accuracy: 94%',
      },
      details: [
        'Predict on test set',
        'Compare to true labels',
        'Calculate metrics',
        'Confusion matrix, ROC, etc.',
      ],
    },
    {
      id: 'tuning',
      name: 'Hyperparameter Tuning',
      icon: '🎛️',
      color: '#ec4899',
      description: 'Optimize model settings for best performance',
      example: {
        before: 'default params',
        after: 'optimized params → 97%',
      },
      details: [
        'Grid search or random search',
        'Cross-validation',
        'Avoid overfitting to test set',
        'Find best hyperparameters',
      ],
    },
    {
      id: 'deploy',
      name: 'Deployment',
      icon: '🚀',
      color: '#06b6d4',
      description: 'Put model into production to make real predictions',
      example: {
        before: 'trained model',
        after: 'API endpoint / app',
      },
      details: [
        'Save model (pickle, joblib)',
        'Create prediction API',
        'Monitor performance',
        'Retrain periodically',
      ],
    },
  ];

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setActiveStage(s => (s + 1) % stages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  // Animate data flowing through pipeline
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setDataPoint(d => ({
          x: (d.x + 5) % 100,
          stage: activeStage,
        }));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, activeStage]);

  const current = stages[activeStage];

  return (
    <div style={{
      width: '100%', minHeight: '750px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🔄 The Machine Learning Pipeline</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
          Every ML project follows this workflow - from raw data to deployed model
        </p>
      </div>

      {/* Pipeline visualization */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '20px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '16px',
        marginBottom: '24px',
        overflowX: 'auto',
        position: 'relative',
      }}>
        {/* Connection line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '60px',
          right: '60px',
          height: '4px',
          background: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ec4899, #06b6d4)',
          borderRadius: '2px',
          zIndex: 0,
        }} />

        {/* Data flow animation */}
        {isAutoPlaying && (
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 0 20px #fff',
              zIndex: 2,
            }}
            animate={{
              left: `${60 + (activeStage / (stages.length - 1)) * (100 - 120 / 4)}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        )}

        {stages.map((stage, i) => (
          <motion.div
            key={stage.id}
            onClick={() => setActiveStage(i)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              zIndex: 1,
              minWidth: '80px',
            }}
            whileHover={{ scale: 1.1 }}
            animate={activeStage === i ? { scale: 1.1 } : { scale: 1 }}
          >
            <motion.div
              style={{
                width: activeStage === i ? '60px' : '50px',
                height: activeStage === i ? '60px' : '50px',
                borderRadius: '50%',
                background: activeStage === i 
                  ? `linear-gradient(135deg, ${stage.color}, ${stage.color}88)`
                  : 'rgba(30, 41, 59, 0.8)',
                border: `3px solid ${stage.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: activeStage === i ? '24px' : '20px',
                boxShadow: activeStage === i ? `0 0 30px ${stage.color}50` : 'none',
              }}
              animate={activeStage === i ? { 
                boxShadow: [`0 0 20px ${stage.color}50`, `0 0 40px ${stage.color}80`, `0 0 20px ${stage.color}50`]
              } : {}}
              transition={{ duration: 1.5, repeat: activeStage === i ? Infinity : 0 }}
            >
              {stage.icon}
            </motion.div>
            <div style={{ 
              marginTop: '8px', 
              fontSize: '10px', 
              color: activeStage === i ? stage.color : '#64748b',
              fontWeight: activeStage === i ? 'bold' : 'normal',
              textAlign: 'center',
              maxWidth: '70px',
            }}>
              {stage.name}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveStage(s => (s - 1 + stages.length) % stages.length)}
          style={{
            padding: '8px 16px', borderRadius: '8px',
            background: '#475569', border: 'none', color: 'white',
            cursor: 'pointer', fontSize: '14px',
          }}
        >
          ← Previous
        </button>
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          style={{
            padding: '8px 24px', borderRadius: '8px',
            background: isAutoPlaying ? '#ef4444' : '#22c55e',
            border: 'none', color: 'white', cursor: 'pointer',
            fontSize: '14px', fontWeight: 'bold',
          }}
        >
          {isAutoPlaying ? '⏸ Pause' : '▶ Auto Play'}
        </button>
        <button
          onClick={() => setActiveStage(s => (s + 1) % stages.length)}
          style={{
            padding: '8px 16px', borderRadius: '8px',
            background: '#475569', border: 'none', color: 'white',
            cursor: 'pointer', fontSize: '14px',
          }}
        >
          Next →
        </button>
      </div>

      {/* Stage details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{
            background: `${current.color}15`,
            border: `2px solid ${current.color}50`,
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Left side - explanation */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '32px' }}>{current.icon}</span>
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: current.color, margin: 0 }}>
                    Step {activeStage + 1}: {current.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                    {current.description}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '14px', color: '#e2e8f0', marginBottom: '12px' }}>What happens here:</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {current.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{ 
                        color: '#cbd5e1', 
                        fontSize: '14px', 
                        marginBottom: '8px',
                        lineHeight: '1.5',
                      }}
                    >
                      {detail}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right side - transformation example */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <h4 style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>Transformation</h4>
              
              {current.example.before && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Input:</div>
                  <div style={{
                    background: 'rgba(0,0,0,0.4)',
                    padding: '10px',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#94a3b8',
                  }}>
                    {current.example.before}
                  </div>
                </div>
              )}

              {current.example.after && (
                <div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    margin: '8px 0',
                    color: current.color,
                  }}>
                    ↓
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Output:</div>
                  <div style={{
                    background: `${current.color}20`,
                    border: `1px solid ${current.color}50`,
                    padding: '10px',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: current.color,
                  }}>
                    {current.example.after}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress indicator */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '8px', 
        marginTop: '20px' 
      }}>
        {stages.map((stage, i) => (
          <div
            key={i}
            onClick={() => setActiveStage(i)}
            style={{
              width: i === activeStage ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === activeStage ? stage.color : '#475569',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  );
}
