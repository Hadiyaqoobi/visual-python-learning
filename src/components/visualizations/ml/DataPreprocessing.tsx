"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DataPreprocessing() {
  const [activeTab, setActiveTab] = useState<'missing' | 'encoding' | 'scaling'>('missing');
  const [scalingMethod, setScalingMethod] = useState<'none' | 'standard' | 'minmax'>('none');
  const [imputeMethod, setImputeMethod] = useState<'mean' | 'median' | 'mode'>('mean');

  // Sample data for demonstrations
  const rawData = [
    { id: 1, age: 25, salary: 50000, city: 'NYC', purchased: 'Yes' },
    { id: 2, age: null, salary: 60000, city: 'LA', purchased: 'No' },
    { id: 3, age: 35, salary: null, city: 'NYC', purchased: 'Yes' },
    { id: 4, age: 45, salary: 80000, city: 'Chicago', purchased: 'No' },
    { id: 5, age: 30, salary: 55000, city: 'LA', purchased: 'Yes' },
  ];

  // Calculate statistics
  const ages = rawData.map(d => d.age).filter(a => a !== null) as number[];
  const salaries = rawData.map(d => d.salary).filter(s => s !== null) as number[];
  
  const meanAge = Math.round(ages.reduce((a, b) => a + b, 0) / ages.length);
  const medianAge = ages.sort((a, b) => a - b)[Math.floor(ages.length / 2)];
  const modeAge = 25; // Simplified
  
  const meanSalary = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);

  const getImputedValue = (field: string) => {
    if (field === 'age') {
      return imputeMethod === 'mean' ? meanAge : imputeMethod === 'median' ? medianAge : modeAge;
    }
    return meanSalary;
  };

  // Scaling calculations
  const ageMin = Math.min(...ages);
  const ageMax = Math.max(...ages);
  const ageStd = Math.sqrt(ages.reduce((sum, a) => sum + Math.pow(a - meanAge, 2), 0) / ages.length);
  
  const salaryMin = Math.min(...salaries);
  const salaryMax = Math.max(...salaries);
  const salaryMean = meanSalary;
  const salaryStd = Math.sqrt(salaries.reduce((sum, s) => sum + Math.pow(s - salaryMean, 2), 0) / salaries.length);

  const scaleValue = (value: number, min: number, max: number, mean: number, std: number) => {
    if (scalingMethod === 'none') return value;
    if (scalingMethod === 'minmax') return ((value - min) / (max - min)).toFixed(3);
    if (scalingMethod === 'standard') return ((value - mean) / std).toFixed(2);
    return value;
  };

  // Encoding
  const cityEncoding: Record<string, number[]> = {
    'NYC': [1, 0, 0],
    'LA': [0, 1, 0],
    'Chicago': [0, 0, 1],
  };

  const purchasedEncoding: Record<string, number> = {
    'Yes': 1,
    'No': 0,
  };

  const tabs = [
    { id: 'missing', label: 'Missing Values', icon: '❓', color: '#ef4444' },
    { id: 'encoding', label: 'Encoding', icon: '🔤', color: '#3b82f6' },
    { id: 'scaling', label: 'Scaling', icon: '📏', color: '#22c55e' },
  ];

  return (
    <div style={{
      width: '100%', minHeight: '700px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🔧 Data Preprocessing</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
          Transform raw data into a format ML algorithms can understand
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              padding: '12px 24px', borderRadius: '12px',
              background: activeTab === tab.id ? tab.color : 'rgba(255,255,255,0.1)',
              border: `2px solid ${tab.color}`,
              color: 'white', cursor: 'pointer', fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'missing' && (
          <motion.div
            key="missing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '2px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px', padding: '20px', marginBottom: '20px'
            }}>
              <h3 style={{ color: '#ef4444', marginBottom: '12px', fontSize: '18px' }}>
                ❓ Handling Missing Values
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
                Real data often has missing values. We need to decide: delete the rows, or fill them in (imputation)?
                The choice depends on why data is missing and how much is missing.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
              {(['mean', 'median', 'mode'] as const).map(method => (
                <button
                  key={method}
                  onClick={() => setImputeMethod(method)}
                  style={{
                    padding: '8px 20px', borderRadius: '8px',
                    background: imputeMethod === method ? '#ef4444' : 'transparent',
                    border: '2px solid #ef4444',
                    color: 'white', cursor: 'pointer', fontSize: '13px',
                  }}
                >
                  Fill with {method.charAt(0).toUpperCase() + method.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Before */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '14px' }}>❌ Before (Raw Data)</h4>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #334155' }}>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#94a3b8' }}>Age</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#94a3b8' }}>Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawData.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ 
                          padding: '8px',
                          color: row.age === null ? '#ef4444' : '#e2e8f0',
                          fontWeight: row.age === null ? 'bold' : 'normal',
                        }}>
                          {row.age === null ? 'NULL ⚠️' : row.age}
                        </td>
                        <td style={{ 
                          padding: '8px',
                          color: row.salary === null ? '#ef4444' : '#e2e8f0',
                          fontWeight: row.salary === null ? 'bold' : 'normal',
                        }}>
                          {row.salary === null ? 'NULL ⚠️' : `$${row.salary.toLocaleString()}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* After */}
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                <h4 style={{ color: '#22c55e', marginBottom: '12px', fontSize: '14px' }}>✅ After ({imputeMethod} imputation)</h4>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #334155' }}>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#94a3b8' }}>Age</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#94a3b8' }}>Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawData.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '8px' }}>
                          {row.age === null ? (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              style={{ color: '#22c55e', fontWeight: 'bold' }}
                            >
                              {getImputedValue('age')} ✓
                            </motion.span>
                          ) : row.age}
                        </td>
                        <td style={{ padding: '8px' }}>
                          {row.salary === null ? (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              style={{ color: '#22c55e', fontWeight: 'bold' }}
                            >
                              ${getImputedValue('salary').toLocaleString()} ✓
                            </motion.span>
                          ) : `$${row.salary.toLocaleString()}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ color: '#94a3b8', marginBottom: '8px', fontSize: '13px' }}>📊 Calculated Statistics</h4>
              <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
                <span><strong>Mean Age:</strong> {meanAge}</span>
                <span><strong>Median Age:</strong> {medianAge}</span>
                <span><strong>Mean Salary:</strong> ${meanSalary.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'encoding' && (
          <motion.div
            key="encoding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.1)', 
              border: '2px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '16px', padding: '20px', marginBottom: '20px'
            }}>
              <h3 style={{ color: '#3b82f6', marginBottom: '12px', fontSize: '18px' }}>
                🔤 Encoding Categorical Variables
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
                ML algorithms only understand numbers. We need to convert text categories like "NYC" or "Yes" 
                into numerical representations.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Label Encoding */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ color: '#f97316', marginBottom: '12px', fontSize: '14px' }}>
                  Label Encoding (Binary)
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '12px' }}>
                  For yes/no or two-category variables
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>Yes</div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>text</div>
                  </div>
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{ fontSize: '24px', color: '#3b82f6' }}
                  >
                    →
                  </motion.div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '24px', fontWeight: 'bold', 
                      color: '#22c55e',
                      background: 'rgba(34, 197, 94, 0.2)',
                      padding: '8px 16px', borderRadius: '8px'
                    }}>1</div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>number</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', marginTop: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>No</div>
                  </div>
                  <div style={{ fontSize: '24px', color: '#3b82f6' }}>→</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '24px', fontWeight: 'bold', 
                      color: '#ef4444',
                      background: 'rgba(239, 68, 68, 0.2)',
                      padding: '8px 16px', borderRadius: '8px'
                    }}>0</div>
                  </div>
                </div>
              </div>

              {/* One-Hot Encoding */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ color: '#8b5cf6', marginBottom: '12px', fontSize: '14px' }}>
                  One-Hot Encoding (Multiple Categories)
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '12px' }}>
                  For 3+ categories - creates binary columns
                </p>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #334155' }}>
                      <th style={{ padding: '8px', color: '#94a3b8' }}>City</th>
                      <th style={{ padding: '8px', color: '#94a3b8' }}>→</th>
                      <th style={{ padding: '8px', color: '#3b82f6' }}>NYC</th>
                      <th style={{ padding: '8px', color: '#22c55e' }}>LA</th>
                      <th style={{ padding: '8px', color: '#f97316' }}>Chicago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['NYC', 'LA', 'Chicago'].map((city, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>{city}</td>
                        <td style={{ padding: '8px', color: '#8b5cf6' }}>→</td>
                        {cityEncoding[city].map((val, j) => (
                          <td key={j} style={{ 
                            padding: '8px', textAlign: 'center',
                            color: val === 1 ? '#22c55e' : '#64748b',
                            fontWeight: val === 1 ? 'bold' : 'normal',
                          }}>
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', borderLeft: '3px solid #8b5cf6' }}>
              <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
                <strong>⚠️ Why not just use 1, 2, 3?</strong> Because the model would think Chicago (3) is 
                "greater than" NYC (1), implying an order that doesn't exist!
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'scaling' && (
          <motion.div
            key="scaling"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div style={{ 
              background: 'rgba(34, 197, 94, 0.1)', 
              border: '2px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '16px', padding: '20px', marginBottom: '20px'
            }}>
              <h3 style={{ color: '#22c55e', marginBottom: '12px', fontSize: '18px' }}>
                📏 Feature Scaling
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
                Features on different scales can cause problems. Age (25-45) vs Salary ($50,000-$80,000) - 
                the model might think salary is more important just because the numbers are bigger!
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
              {([
                { id: 'none', label: 'No Scaling', color: '#64748b' },
                { id: 'standard', label: 'StandardScaler (z-score)', color: '#3b82f6' },
                { id: 'minmax', label: 'MinMaxScaler (0-1)', color: '#22c55e' },
              ] as const).map(method => (
                <button
                  key={method.id}
                  onClick={() => setScalingMethod(method.id)}
                  style={{
                    padding: '8px 16px', borderRadius: '8px',
                    background: scalingMethod === method.id ? method.color : 'transparent',
                    border: `2px solid ${method.color}`,
                    color: 'white', cursor: 'pointer', fontSize: '12px',
                  }}
                >
                  {method.label}
                </button>
              ))}
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #334155' }}>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#94a3b8' }}>Original Age</th>
                    <th style={{ padding: '10px', textAlign: 'center', color: '#94a3b8' }}>→</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#22c55e' }}>Scaled Age</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#94a3b8' }}>Original Salary</th>
                    <th style={{ padding: '10px', textAlign: 'center', color: '#94a3b8' }}>→</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#22c55e' }}>Scaled Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {[25, 35, 45, 30].map((age, i) => {
                    const salary = [50000, 60000, 80000, 55000][i];
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '10px' }}>{age}</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#22c55e' }}>→</td>
                        <td style={{ padding: '10px', color: '#22c55e', fontWeight: 'bold' }}>
                          {scaleValue(age, ageMin, ageMax, meanAge, ageStd)}
                        </td>
                        <td style={{ padding: '10px' }}>${salary.toLocaleString()}</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#22c55e' }}>→</td>
                        <td style={{ padding: '10px', color: '#22c55e', fontWeight: 'bold' }}>
                          {scaleValue(salary, salaryMin, salaryMax, salaryMean, salaryStd)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', padding: '12px', borderLeft: '3px solid #3b82f6' }}>
                <h4 style={{ fontSize: '13px', color: '#3b82f6', marginBottom: '4px' }}>StandardScaler</h4>
                <code style={{ fontSize: '12px', color: '#94a3b8' }}>z = (x - mean) / std</code>
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  Centers data around 0, most values between -3 and +3
                </p>
              </div>
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', padding: '12px', borderLeft: '3px solid #22c55e' }}>
                <h4 style={{ fontSize: '13px', color: '#22c55e', marginBottom: '4px' }}>MinMaxScaler</h4>
                <code style={{ fontSize: '12px', color: '#94a3b8' }}>x' = (x - min) / (max - min)</code>
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  Scales all values to range [0, 1]
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
