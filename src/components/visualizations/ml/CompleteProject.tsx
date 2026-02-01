"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompleteProject() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 'problem',
      title: '1. Define the Problem',
      icon: '🎯',
      color: '#ef4444',
      description: 'What are we predicting? What data do we have?',
      code: `# Problem: Predict customer churn
# Target: Will customer leave? (Yes/No)
# Features: Usage data, demographics, account info

import pandas as pd
df = pd.read_csv('customer_data.csv')
print(f"Shape: {df.shape}")
print(f"Churn rate: {df['churn'].mean():.1%}")`,
      output: 'Shape: (7043, 21)\nChurn rate: 26.5%',
    },
    {
      id: 'explore',
      title: '2. Explore the Data',
      icon: '🔍',
      color: '#f97316',
      description: 'Understand distributions, missing values, correlations',
      code: `# Check for missing values
print(df.isnull().sum())

# Check data types
print(df.dtypes)

# Target distribution
print(df['churn'].value_counts())`,
      output: 'TotalCharges    11 missing\nCustomerID      object\nMonthlyCharges  float64\nchurn: No=5174, Yes=1869',
    },
    {
      id: 'preprocess',
      title: '3. Preprocess Data',
      icon: '🔧',
      color: '#eab308',
      description: 'Handle missing values, encode categories, scale features',
      code: `from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer

# Handle missing values
imputer = SimpleImputer(strategy='median')
df['TotalCharges'] = imputer.fit_transform(df[['TotalCharges']])

# Encode categorical variables
le = LabelEncoder()
df['churn_encoded'] = le.fit_transform(df['churn'])`,
      output: 'Missing values filled: 11 → 0\nCategories encoded: Yes→1, No→0',
    },
    {
      id: 'split',
      title: '4. Split the Data',
      icon: '✂️',
      color: '#22c55e',
      description: 'Create train/test sets for honest evaluation',
      code: `from sklearn.model_selection import train_test_split

X = df.drop(['churn', 'churn_encoded', 'customerID'], axis=1)
y = df['churn_encoded']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"Train: {len(X_train)}, Test: {len(X_test)}")`,
      output: 'Train: 5634, Test: 1409\nStratified split maintains 26.5% churn ratio',
    },
    {
      id: 'baseline',
      title: '5. Train Baseline Model',
      icon: '📊',
      color: '#3b82f6',
      description: 'Start simple to establish a performance baseline',
      code: `from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# Simple baseline
baseline = LogisticRegression(max_iter=1000)
baseline.fit(X_train, y_train)

y_pred = baseline.predict(X_test)
print(f"Baseline Accuracy: {accuracy_score(y_test, y_pred):.1%}")`,
      output: 'Baseline Accuracy: 80.3%\nNot bad! But can we do better?',
    },
    {
      id: 'improve',
      title: '6. Try Better Models',
      icon: '🚀',
      color: '#8b5cf6',
      description: 'Compare multiple algorithms, tune hyperparameters',
      code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

rf = RandomForestClassifier(n_estimators=100, random_state=42)
scores = cross_val_score(rf, X_train, y_train, cv=5)

print(f"RF CV Score: {scores.mean():.1%} (+/- {scores.std()*2:.1%})")

# Fit and predict
rf.fit(X_train, y_train)
print(f"RF Test Accuracy: {rf.score(X_test, y_test):.1%}")`,
      output: 'RF CV Score: 82.1% (+/- 2.3%)\nRF Test Accuracy: 83.7%\n+3.4% improvement!',
    },
    {
      id: 'evaluate',
      title: '7. Final Evaluation',
      icon: '📈',
      color: '#ec4899',
      description: 'Comprehensive metrics, confusion matrix, feature importance',
      code: `from sklearn.metrics import classification_report, confusion_matrix

print(classification_report(y_test, rf.predict(X_test)))

# Feature importance
importance = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)
print(importance.head(5))`,
      output: 'Precision: 0.84, Recall: 0.83, F1: 0.83\nTop features:\n1. TotalCharges\n2. MonthlyCharges\n3. tenure',
    },
    {
      id: 'deploy',
      title: '8. Save & Deploy',
      icon: '🎉',
      color: '#06b6d4',
      description: 'Save model for production use',
      code: `import joblib

# Save the model and preprocessors
joblib.dump(rf, 'churn_model.pkl')
joblib.dump(scaler, 'scaler.pkl')

# Load and use in production
model = joblib.load('churn_model.pkl')
prediction = model.predict(new_customer_data)
print("Model saved and ready for deployment!")`,
      output: '✅ Model saved: churn_model.pkl (2.3 MB)\n✅ Ready to predict on new customers!',
    },
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={{
      width: '100%', minHeight: '750px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🏗️ Complete ML Project</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
          Build a customer churn predictor from scratch
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '24px' }}>
        {steps.map((step, i) => (
          <div
            key={i}
            onClick={() => setCurrentStep(i)}
            style={{
              width: i === currentStep ? '40px' : '24px',
              height: '8px',
              borderRadius: '4px',
              background: completedSteps.includes(i) ? '#22c55e' : i === currentStep ? step.color : '#334155',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {steps.map((step, i) => (
          <motion.div
            key={i}
            onClick={() => setCurrentStep(i)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: i === currentStep ? step.color : 'rgba(255,255,255,0.1)',
              border: `2px solid ${completedSteps.includes(i) ? '#22c55e' : i === currentStep ? step.color : '#334155'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
            }}
            whileHover={{ scale: 1.05 }}
          >
            <span>{completedSteps.includes(i) ? '✅' : step.icon}</span>
            <span style={{ display: i === currentStep ? 'inline' : 'none' }}>{step.title.split('. ')[1]}</span>
          </motion.div>
        ))}
      </div>

      {/* Current step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{
            background: `${currentStepData.color}15`,
            border: `2px solid ${currentStepData.color}50`,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '32px' }}>{currentStepData.icon}</span>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: currentStepData.color }}>
                  {currentStepData.title}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>{currentStepData.description}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
            {/* Code */}
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: '#22c55e' }}>●</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Python Code</span>
              </div>
              <pre style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#e2e8f0',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5',
                margin: 0,
              }}>
                {currentStepData.code}
              </pre>
            </div>

            {/* Output */}
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: '#3b82f6' }}>▶</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Output</span>
              </div>
              <pre style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#22c55e',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
                margin: 0,
              }}>
                {currentStepData.output}
              </pre>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          style={{
            padding: '10px 24px',
            borderRadius: '8px',
            background: currentStep === 0 ? '#334155' : '#475569',
            border: 'none',
            color: 'white',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            opacity: currentStep === 0 ? 0.5 : 1,
          }}
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          style={{
            padding: '10px 24px',
            borderRadius: '8px',
            background: currentStep === steps.length - 1 ? '#22c55e' : currentStepData.color,
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {currentStep === steps.length - 1 ? '🎉 Complete!' : 'Next Step →'}
        </button>
      </div>

      {/* Progress summary */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <span style={{ fontSize: '13px', color: '#94a3b8' }}>
          Progress: {completedSteps.length + (completedSteps.includes(currentStep) ? 0 : 0)}/{steps.length} steps
        </span>
        {completedSteps.length === steps.length && (
          <div style={{ marginTop: '8px', color: '#22c55e', fontWeight: 'bold' }}>
            🎉 Congratulations! You've completed the entire ML workflow!
          </div>
        )}
      </div>
    </div>
  );
}
