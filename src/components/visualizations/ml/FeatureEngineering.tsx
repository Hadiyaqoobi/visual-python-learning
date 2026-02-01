"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeatureEngineering() {
  const [activeExample, setActiveExample] = useState<'datetime' | 'polynomial' | 'interaction' | 'binning'>('datetime');

  const examples = {
    datetime: {
      title: 'DateTime Features',
      icon: '📅',
      color: '#3b82f6',
      description: 'Extract meaningful components from timestamps',
      before: ['2024-03-15 14:30:00', '2024-12-25 09:00:00', '2024-07-04 20:15:00'],
      after: [
        { hour: 14, day_of_week: 4, month: 3, is_weekend: 0, is_holiday: 0 },
        { hour: 9, day_of_week: 2, month: 12, is_weekend: 0, is_holiday: 1 },
        { hour: 20, day_of_week: 3, month: 7, is_weekend: 0, is_holiday: 1 },
      ],
    },
    polynomial: {
      title: 'Polynomial Features',
      icon: '📈',
      color: '#22c55e',
      description: 'Capture non-linear relationships',
      before: ['x = 2', 'x = 3', 'x = 5'],
      after: [
        { x: 2, 'x²': 4, 'x³': 8 },
        { x: 3, 'x²': 9, 'x³': 27 },
        { x: 5, 'x²': 25, 'x³': 125 },
      ],
    },
    interaction: {
      title: 'Interaction Features',
      icon: '🔗',
      color: '#8b5cf6',
      description: 'Combine features to capture joint effects',
      before: ['bedrooms=3, sqft=1500', 'bedrooms=4, sqft=2000', 'bedrooms=2, sqft=1000'],
      after: [
        { bedrooms: 3, sqft: 1500, sqft_per_bed: 500, total_rooms_est: 6 },
        { bedrooms: 4, sqft: 2000, sqft_per_bed: 500, total_rooms_est: 8 },
        { bedrooms: 2, sqft: 1000, sqft_per_bed: 500, total_rooms_est: 4 },
      ],
    },
    binning: {
      title: 'Binning / Discretization',
      icon: '📊',
      color: '#f97316',
      description: 'Convert continuous values to categories',
      before: ['age=22', 'age=35', 'age=58', 'age=71'],
      after: [
        { age: 22, age_group: 'Young (18-30)' },
        { age: 35, age_group: 'Adult (31-50)' },
        { age: 58, age_group: 'Senior (51-65)' },
        { age: 71, age_group: 'Elder (65+)' },
      ],
    },
  };

  const current = examples[activeExample];

  return (
    <div style={{
      width: '100%', minHeight: '700px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>⚙️ Feature Engineering</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
          Transform raw features into powerful predictors
        </p>
      </div>

      {/* Technique selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {(Object.keys(examples) as Array<keyof typeof examples>).map(key => {
          const ex = examples[key];
          return (
            <button
              key={key}
              onClick={() => setActiveExample(key)}
              style={{
                padding: '12px 20px', borderRadius: '12px',
                background: activeExample === key ? ex.color : 'rgba(255,255,255,0.1)',
                border: `2px solid ${ex.color}`,
                color: 'white', cursor: 'pointer', fontSize: '13px',
                display: 'flex', alignItems: 'center', gap: '8px',
                fontWeight: activeExample === key ? 'bold' : 'normal',
              }}
            >
              <span>{ex.icon}</span>
              {ex.title}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeExample}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {/* Description */}
          <div style={{
            background: `${current.color}20`,
            border: `2px solid ${current.color}50`,
            borderRadius: '16px', padding: '20px', marginBottom: '24px',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: '40px', marginBottom: '8px', display: 'block' }}>{current.icon}</span>
            <h3 style={{ color: current.color, fontSize: '20px', marginBottom: '8px' }}>{current.title}</h3>
            <p style={{ color: '#cbd5e1', fontSize: '14px' }}>{current.description}</p>
          </div>

          {/* Before/After transformation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1.5fr', gap: '20px', alignItems: 'center' }}>
            {/* Before */}
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <h4 style={{ color: '#ef4444', marginBottom: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>❌</span> Raw Features
              </h4>
              <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                {current.before.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      padding: '10px',
                      borderRadius: '6px',
                      marginBottom: '8px',
                      color: '#e2e8f0',
                    }}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                color: current.color,
              }}
            >
              <div style={{ fontSize: '32px' }}>→</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
                Feature<br/>Engineering
              </div>
            </motion.div>

            {/* After */}
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <h4 style={{ color: '#22c55e', marginBottom: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✅</span> Engineered Features
              </h4>
              <div style={{ fontSize: '12px' }}>
                {current.after.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      padding: '10px',
                      borderRadius: '6px',
                      marginBottom: '8px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    {Object.entries(item).map(([key, value], j) => (
                      <span key={j} style={{
                        background: `${current.color}30`,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                      }}>
                        <span style={{ color: '#94a3b8' }}>{key}=</span>
                        <span style={{ color: current.color, fontWeight: 'bold' }}>{value}</span>
                      </span>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Code example */}
          <div style={{ marginTop: '24px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '13px' }}>Python Code</h4>
            <pre style={{ 
              fontFamily: 'monospace', 
              fontSize: '12px', 
              color: '#e2e8f0',
              overflow: 'auto',
              margin: 0,
            }}>
              {activeExample === 'datetime' && `# Extract datetime features
df['hour'] = df['timestamp'].dt.hour
df['day_of_week'] = df['timestamp'].dt.dayofweek
df['month'] = df['timestamp'].dt.month
df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)

# Cyclical encoding for hour (captures 23:00 → 0:00 continuity)
df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)`}
              {activeExample === 'polynomial' && `from sklearn.preprocessing import PolynomialFeatures

# Create polynomial features
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X[['x']])

# Result: [x, x², x³] for degree=3
# Captures non-linear relationships like y = ax² + bx + c`}
              {activeExample === 'interaction' && `# Manual interaction features
df['sqft_per_bedroom'] = df['sqft'] / df['bedrooms']
df['price_per_sqft'] = df['price'] / df['sqft']
df['total_rooms_estimate'] = df['bedrooms'] * 2

# Or use sklearn
from sklearn.preprocessing import PolynomialFeatures
poly = PolynomialFeatures(degree=2, interaction_only=True)
X_interactions = poly.fit_transform(X)`}
              {activeExample === 'binning' && `import pandas as pd

# Equal-width binning
df['age_group'] = pd.cut(df['age'], 
    bins=[0, 18, 30, 50, 65, 100],
    labels=['Child', 'Young', 'Adult', 'Senior', 'Elder'])

# Quantile-based binning (equal frequency)
df['income_quartile'] = pd.qcut(df['income'], 
    q=4, 
    labels=['Q1', 'Q2', 'Q3', 'Q4'])`}
            </pre>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Why it matters */}
      <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
        <h4 style={{ color: '#8b5cf6', marginBottom: '8px', fontSize: '14px' }}>💡 Why Feature Engineering Matters</h4>
        <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6' }}>
          {activeExample === 'datetime' && "Raw timestamps are meaningless to models. But 'hour=3am' vs 'hour=3pm' or 'is_holiday=1' reveals patterns like 'people buy more on holidays' or 'traffic is low at night'."}
          {activeExample === 'polynomial' && "Linear models can only find straight-line relationships. But many real patterns are curved (e.g., happiness vs income). Polynomial features let linear models capture these curves!"}
          {activeExample === 'interaction' && "Sometimes the combination matters more than individuals. A 3-bedroom 900sqft house (cramped!) is very different from a 3-bedroom 3000sqft house. sqft_per_bedroom captures this."}
          {activeExample === 'binning' && "Sometimes exact values don't matter—a 41-year-old and 42-year-old behave similarly. Binning groups them, reducing noise and sometimes improving model performance."}
        </p>
      </div>
    </div>
  );
}
