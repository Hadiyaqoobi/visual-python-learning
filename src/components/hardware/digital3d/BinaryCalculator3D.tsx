"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Zap, Info, Binary } from "lucide-react";

interface BitState {
  value: 0 | 1;
  isCarry: boolean;
  isActive: boolean;
  isResult: boolean;
}

export function BinaryCalculator3D() {
  const [numberA, setNumberA] = useState(5);
  const [numberB, setNumberB] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [bits, setBits] = useState<{ a: BitState[]; b: BitState[]; result: BitState[]; carry: BitState[] }>({
    a: [], b: [], result: [], carry: []
  });
  const [speed, setSpeed] = useState(1000);
  const [showExplanation, setShowExplanation] = useState(true);

  const toBinary = (num: number): BitState[] => {
    const binary = num.toString(2).padStart(8, '0');
    return binary.split('').map(b => ({
      value: parseInt(b) as 0 | 1,
      isCarry: false,
      isActive: false,
      isResult: false,
    }));
  };

  useEffect(() => {
    setBits({
      a: toBinary(numberA),
      b: toBinary(numberB),
      result: Array(8).fill(null).map(() => ({ value: 0 as 0 | 1, isCarry: false, isActive: false, isResult: false })),
      carry: Array(9).fill(null).map(() => ({ value: 0 as 0 | 1, isCarry: false, isActive: false, isResult: false })),
    });
    setCurrentStep(-1);
  }, [numberA, numberB]);

  const animateStep = useCallback(() => {
    if (currentStep >= 7) {
      setIsAnimating(false);
      return;
    }

    const step = currentStep + 1;
    const bitIndex = 7 - step;
    
    setBits(prev => {
      const newBits = JSON.parse(JSON.stringify(prev));
      const a = prev.a[bitIndex].value;
      const b = prev.b[bitIndex].value;
      const carryIn = step > 0 ? prev.carry[bitIndex + 1].value : 0;
      
      const sum = a + b + carryIn;
      const resultBit = (sum % 2) as 0 | 1;
      const carryOut = (sum >= 2 ? 1 : 0) as 0 | 1;
      
      newBits.a = prev.a.map((bit: BitState, i: number) => ({ ...bit, isActive: i === bitIndex }));
      newBits.b = prev.b.map((bit: BitState, i: number) => ({ ...bit, isActive: i === bitIndex }));
      newBits.result = prev.result.map((bit: BitState, i: number) => ({
        ...bit,
        value: i === bitIndex ? resultBit : bit.value,
        isActive: i === bitIndex,
        isResult: i >= bitIndex,
      }));
      newBits.carry = prev.carry.map((bit: BitState, i: number) => ({
        ...bit,
        value: i === bitIndex ? carryOut : bit.value,
        isCarry: i === bitIndex && carryOut === 1,
        isActive: i === bitIndex,
      }));
      
      return newBits;
    });
    
    setCurrentStep(step);
  }, [currentStep]);

  useEffect(() => {
    if (isAnimating && currentStep < 7) {
      const timer = setTimeout(animateStep, speed);
      return () => clearTimeout(timer);
    } else if (currentStep >= 7) {
      setIsAnimating(false);
    }
  }, [isAnimating, currentStep, animateStep, speed]);

  const startAnimation = () => {
    setBits({
      a: toBinary(numberA),
      b: toBinary(numberB),
      result: Array(8).fill(null).map(() => ({ value: 0 as 0 | 1, isCarry: false, isActive: false, isResult: false })),
      carry: Array(9).fill(null).map(() => ({ value: 0 as 0 | 1, isCarry: false, isActive: false, isResult: false })),
    });
    setCurrentStep(-1);
    setIsAnimating(true);
  };

  useEffect(() => {
    if (isAnimating && currentStep === -1) {
      const timer = setTimeout(animateStep, speed);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, currentStep, animateStep, speed]);

  const reset = () => {
    setIsAnimating(false);
    setCurrentStep(-1);
    setBits({
      a: toBinary(numberA),
      b: toBinary(numberB),
      result: Array(8).fill(null).map(() => ({ value: 0 as 0 | 1, isCarry: false, isActive: false, isResult: false })),
      carry: Array(9).fill(null).map(() => ({ value: 0 as 0 | 1, isCarry: false, isActive: false, isResult: false })),
    });
  };

  const BitCell = ({ bit, index }: { bit: BitState; index: number }) => (
    <motion.div
      animate={{
        scale: bit.isActive ? 1.15 : 1,
        boxShadow: bit.isActive 
          ? '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4)'
          : bit.isResult 
            ? '0 0 20px rgba(0, 255, 136, 0.5)'
            : '0 0 10px rgba(0, 255, 255, 0.2)',
      }}
      transition={{ duration: 0.3 }}
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: bit.isActive 
          ? 'linear-gradient(135deg, #00FFFF 0%, #00AAFF 100%)'
          : bit.isResult
            ? 'linear-gradient(135deg, #00FF88 0%, #00AA66 100%)'
            : bit.isCarry
              ? 'linear-gradient(135deg, #FF8800 0%, #FF4400 100%)'
              : 'linear-gradient(135deg, #1a1a3e 0%, #0a0a2e 100%)',
        border: `2px solid ${bit.isActive ? '#00FFFF' : bit.isResult ? '#00FF88' : '#333366'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        position: 'relative',
      }}
    >
      <motion.span
        key={bit.value}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: bit.isActive || bit.isResult || bit.isCarry ? '#000' : '#00FFFF',
        }}
      >
        {bit.value}
      </motion.span>
      <span style={{ position: 'absolute', bottom: -16, fontSize: 8, color: '#666' }}>
        2^{7 - index}
      </span>
    </motion.div>
  );

  return (
    <div style={{
      minHeight: '100%',
      background: 'linear-gradient(135deg, #0A0A1E 0%, #1A1A3E 50%, #0A0A1E 100%)',
      padding: 24,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 32,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 8,
          }}
        >
          BINARY CALCULATOR 3D
        </motion.h1>
        <p style={{ color: '#888', fontSize: 14 }}>
          Watch how computers add numbers bit by bit using ripple carry addition
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showExplanation ? '1fr 350px' : '1fr', gap: 24 }}>
        {/* Main Calculator */}
        <div>
          {/* Input Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 32 }}>
            <div style={{
              background: 'rgba(0, 20, 40, 0.8)',
              borderRadius: 16,
              padding: 16,
              border: '1px solid #00FFFF33',
              textAlign: 'center',
            }}>
              <label style={{ color: '#00FFFF', fontSize: 11, display: 'block', marginBottom: 8 }}>NUMBER A</label>
              <input
                type="range"
                min={0}
                max={127}
                value={numberA}
                onChange={(e) => setNumberA(parseInt(e.target.value))}
                disabled={isAnimating}
                style={{ width: 120 }}
              />
              <div style={{ color: 'white', fontSize: 28, fontWeight: 700 }}>{numberA}</div>
              <div style={{ color: '#666', fontSize: 10 }}>{numberA.toString(2).padStart(8, '0')}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <motion.div
                animate={{ boxShadow: isAnimating ? ['0 0 20px #00FF88', '0 0 40px #00FF88', '0 0 20px #00FF88'] : '0 0 20px #00FFFF44' }}
                transition={{ duration: 1, repeat: isAnimating ? Infinity : 0 }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00FF88 0%, #00AA66 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#000',
                }}
              >
                +
              </motion.div>
            </div>

            <div style={{
              background: 'rgba(0, 20, 40, 0.8)',
              borderRadius: 16,
              padding: 16,
              border: '1px solid #FF00FF33',
              textAlign: 'center',
            }}>
              <label style={{ color: '#FF00FF', fontSize: 11, display: 'block', marginBottom: 8 }}>NUMBER B</label>
              <input
                type="range"
                min={0}
                max={127}
                value={numberB}
                onChange={(e) => setNumberB(parseInt(e.target.value))}
                disabled={isAnimating}
                style={{ width: 120 }}
              />
              <div style={{ color: 'white', fontSize: 28, fontWeight: 700 }}>{numberB}</div>
              <div style={{ color: '#666', fontSize: 10 }}>{numberB.toString(2).padStart(8, '0')}</div>
            </div>
          </div>

          {/* Binary Addition Visualization */}
          <div style={{
            background: 'rgba(0, 20, 40, 0.6)',
            borderRadius: 20,
            padding: 24,
            border: '1px solid #00FFFF22',
            marginBottom: 24,
          }}>
            {/* Carry Row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
              <div style={{ width: 60 }} />
              {bits.carry.slice(0, 8).map((bit, i) => (
                <AnimatePresence key={i}>
                  {bit.value === 1 ? (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      style={{
                        width: 48,
                        height: 20,
                        borderRadius: 6,
                        background: 'linear-gradient(135deg, #FF8800 0%, #FF4400 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#000',
                        boxShadow: '0 0 15px rgba(255, 136, 0, 0.6)',
                      }}
                    >
                      CARRY
                    </motion.div>
                  ) : (
                    <div style={{ width: 48, height: 20 }} />
                  )}
                </AnimatePresence>
              ))}
            </div>

            {/* Number A Row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 6, alignItems: 'center' }}>
              <div style={{ width: 60, textAlign: 'right', color: '#00FFFF', fontSize: 13 }}>A:</div>
              {bits.a.map((bit, i) => <BitCell key={`a-${i}`} bit={bit} index={i} />)}
              <div style={{ width: 60, textAlign: 'left', color: '#888', fontSize: 13, marginLeft: 12 }}>= {numberA}</div>
            </div>

            {/* Number B Row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 12, alignItems: 'center' }}>
              <div style={{ width: 60, textAlign: 'right', color: '#FF00FF', fontSize: 13 }}>B:</div>
              {bits.b.map((bit, i) => <BitCell key={`b-${i}`} bit={bit} index={i} />)}
              <div style={{ width: 60, textAlign: 'left', color: '#888', fontSize: 13, marginLeft: 12 }}>= {numberB}</div>
            </div>

            {/* Divider */}
            <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #00FF88, transparent)', margin: '12px 60px', borderRadius: 2 }} />

            {/* Result Row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12, alignItems: 'center' }}>
              <div style={{ width: 60, textAlign: 'right', color: '#00FF88', fontSize: 13 }}>Sum:</div>
              {bits.result.map((bit, i) => <BitCell key={`r-${i}`} bit={bit} index={i} />)}
              <motion.div
                animate={{ opacity: currentStep >= 7 ? 1 : 0.3, scale: currentStep >= 7 ? 1 : 0.9 }}
                style={{ width: 60, textAlign: 'left', color: '#00FF88', fontSize: 22, fontWeight: 700, marginLeft: 12 }}
              >
                = {numberA + numberB}
              </motion.div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startAnimation}
              disabled={isAnimating}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 12,
                border: 'none',
                background: isAnimating ? '#333' : 'linear-gradient(135deg, #00FF88 0%, #00AA66 100%)',
                color: isAnimating ? '#666' : '#000',
                fontSize: 14,
                fontWeight: 700,
                cursor: isAnimating ? 'not-allowed' : 'pointer',
                boxShadow: isAnimating ? 'none' : '0 0 25px rgba(0, 255, 136, 0.4)',
              }}
            >
              <Play style={{ width: 18, height: 18 }} />
              {isAnimating ? 'ADDING...' : 'START'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 12,
                border: '2px solid #00FFFF44',
                background: 'transparent',
                color: '#00FFFF',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <RotateCcw style={{ width: 18, height: 18 }} />
              RESET
            </motion.button>

            <select
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              style={{
                padding: '12px 16px',
                borderRadius: 12,
                border: '2px solid #00FFFF44',
                background: '#0a0a2e',
                color: '#00FFFF',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              <option value={1500}>Slow</option>
              <option value={1000}>Normal</option>
              <option value={500}>Fast</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExplanation(!showExplanation)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 12,
                border: '2px solid #FF00FF44',
                background: showExplanation ? 'rgba(255, 0, 255, 0.2)' : 'transparent',
                color: '#FF00FF',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Info style={{ width: 18, height: 18 }} />
              {showExplanation ? 'HIDE' : 'SHOW'} INFO
            </motion.button>
          </div>

          {/* Step Progress */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
            {Array(8).fill(0).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  background: currentStep >= i ? 'linear-gradient(135deg, #00FF88 0%, #00FFFF 100%)' : '#1a1a3e',
                  scale: currentStep === i ? 1.3 : 1,
                }}
                style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #00FFFF44' }}
              />
            ))}
          </div>
        </div>

        {/* Explanation Panel */}
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'rgba(0, 30, 50, 0.8)',
              borderRadius: 16,
              padding: 20,
              border: '1px solid #00FFFF22',
              height: 'fit-content',
            }}
          >
            <h3 style={{ color: '#00FFFF', fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Binary style={{ width: 20, height: 20 }} />
              HOW BINARY ADDITION WORKS
            </h3>
            
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: '#00FF88', fontSize: 13, marginBottom: 8 }}>What is Binary?</h4>
              <p style={{ color: '#aaa', fontSize: 12, lineHeight: 1.6 }}>
                Computers only understand 1s and 0s (binary). Each digit is called a <strong style={{ color: '#00FFFF' }}>bit</strong>. 
                8 bits make a <strong style={{ color: '#FF00FF' }}>byte</strong>.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: '#FF8800', fontSize: 13, marginBottom: 8 }}>The Addition Rules</h4>
              <div style={{ background: '#0a0a2e', borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 11 }}>
                <div style={{ color: '#00FF88' }}>0 + 0 = 0</div>
                <div style={{ color: '#00FF88' }}>0 + 1 = 1</div>
                <div style={{ color: '#00FF88' }}>1 + 0 = 1</div>
                <div style={{ color: '#FF8800' }}>1 + 1 = 0 (carry 1)</div>
                <div style={{ color: '#FF00FF' }}>1 + 1 + 1 = 1 (carry 1)</div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: '#FF00FF', fontSize: 13, marginBottom: 8 }}>Ripple Carry</h4>
              <p style={{ color: '#aaa', fontSize: 12, lineHeight: 1.6 }}>
                Just like decimal addition, when the sum is too big (≥2 in binary), we carry to the next position. 
                This "ripples" from right to left.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 170, 255, 0.1))',
              borderRadius: 12,
              padding: 12,
              borderLeft: '3px solid #00FF88',
            }}>
              <h4 style={{ color: '#00FF88', fontSize: 12, marginBottom: 6 }}>Python Connection</h4>
              <p style={{ color: '#ccc', fontSize: 11, lineHeight: 1.5 }}>
                When you write <code style={{ background: '#1a1a3e', padding: '2px 6px', borderRadius: 4, color: '#00FFFF' }}>x = 5 + 3</code>, 
                the CPU performs exactly this binary addition in its ALU!
              </p>
            </div>

            {currentStep >= 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  marginTop: 16,
                  padding: 12,
                  background: '#0a0a2e',
                  borderRadius: 8,
                  border: '1px solid #00FFFF44',
                }}
              >
                <h4 style={{ color: '#00FFFF', fontSize: 12, marginBottom: 8 }}>Current Step: Bit {7 - currentStep}</h4>
                <p style={{ color: '#888', fontSize: 11 }}>
                  Adding bit position 2^{7 - currentStep} ({Math.pow(2, 7 - currentStep)} in decimal)
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default BinaryCalculator3D;
