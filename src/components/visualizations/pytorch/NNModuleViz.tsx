"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NNModuleViz() {
  const [layers, setLayers] = useState([
    { type: 'Linear', in: 784, out: 256, params: 784 * 256 + 256 },
    { type: 'ReLU', in: 256, out: 256, params: 0 },
    { type: 'Linear', in: 256, out: 128, params: 256 * 128 + 128 },
    { type: 'ReLU', in: 128, out: 128, params: 0 },
    { type: 'Linear', in: 128, out: 10, params: 128 * 10 + 10 },
  ]);
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);
  const [showCode, setShowCode] = useState(true);

  const totalParams = layers.reduce((sum, l) => sum + l.params, 0);

  const layerColors: Record<string, string> = {
    'Linear': '#3b82f6',
    'ReLU': '#22c55e',
    'Dropout': '#f97316',
    'BatchNorm': '#8b5cf6',
    'Conv2d': '#ec4899',
    'MaxPool2d': '#06b6d4',
  };

  const addLayer = (type: string) => {
    const lastLayer = layers[layers.length - 1];
    const lastOut = lastLayer?.out || 128;
    
    let newLayer;
    if (type === 'Linear') {
      const newOut = Math.max(10, Math.floor(lastOut / 2));
      newLayer = { type: 'Linear', in: lastOut, out: newOut, params: lastOut * newOut + newOut };
    } else if (type === 'ReLU') {
      newLayer = { type: 'ReLU', in: lastOut, out: lastOut, params: 0 };
    } else if (type === 'Dropout') {
      newLayer = { type: 'Dropout', in: lastOut, out: lastOut, params: 0 };
    }
    
    if (newLayer) {
      setLayers([...layers, newLayer]);
    }
  };

  const removeLayer = (index: number) => {
    if (layers.length > 1) {
      setLayers(layers.filter((_, i) => i !== index));
    }
  };

  return (
    <div style={{
      width: '100%', minHeight: '700px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🧱 nn.Module Builder</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
          Build neural network architectures interactively
        </p>
      </div>

      {/* Add layer buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span style={{ color: '#64748b', fontSize: '13px', alignSelf: 'center' }}>Add Layer:</span>
        {['Linear', 'ReLU', 'Dropout'].map(type => (
          <button
            key={type}
            onClick={() => addLayer(type)}
            style={{
              padding: '8px 16px', borderRadius: '8px',
              background: layerColors[type],
              border: 'none', color: 'white', cursor: 'pointer',
              fontSize: '12px', fontWeight: 'bold',
            }}
          >
            + {type}
          </button>
        ))}
      </div>

      {/* Network visualization */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Input */}
          <motion.div
            style={{
              padding: '12px 16px', borderRadius: '8px',
              background: 'rgba(148, 163, 184, 0.3)',
              border: '2px solid #94a3b8',
              textAlign: 'center', minWidth: '70px',
            }}
          >
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>Input</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{layers[0]?.in || 784}</div>
          </motion.div>

          {layers.map((layer, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#64748b' }}>→</span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onMouseEnter={() => setHoveredLayer(i)}
                onMouseLeave={() => setHoveredLayer(null)}
                onClick={() => removeLayer(i)}
                style={{
                  padding: '12px 16px', borderRadius: '8px',
                  background: `${layerColors[layer.type]}${hoveredLayer === i ? '' : '80'}`,
                  border: `2px solid ${layerColors[layer.type]}`,
                  textAlign: 'center', minWidth: '80px',
                  cursor: 'pointer',
                  transform: hoveredLayer === i ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.2s',
                }}
              >
                <div style={{ fontSize: '10px', opacity: 0.8 }}>{layer.type}</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  {layer.type === 'Linear' ? `${layer.in}→${layer.out}` : layer.out}
                </div>
                {layer.params > 0 && (
                  <div style={{ fontSize: '9px', opacity: 0.7 }}>{layer.params.toLocaleString()} params</div>
                )}
              </motion.div>
            </div>
          ))}

          <span style={{ color: '#64748b' }}>→</span>
          
          {/* Output */}
          <motion.div
            style={{
              padding: '12px 16px', borderRadius: '8px',
              background: 'rgba(34, 197, 94, 0.3)',
              border: '2px solid #22c55e',
              textAlign: 'center', minWidth: '70px',
            }}
          >
            <div style={{ fontSize: '10px', color: '#22c55e' }}>Output</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{layers[layers.length - 1]?.out || 10}</div>
          </motion.div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#94a3b8' }}>
          Click a layer to remove it
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{layers.length}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Layers</div>
        </div>
        <div style={{ background: 'rgba(34, 197, 94, 0.2)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{totalParams.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Parameters</div>
        </div>
        <div style={{ background: 'rgba(139, 92, 246, 0.2)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>{(totalParams * 4 / 1024 / 1024).toFixed(2)} MB</div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Memory (float32)</div>
        </div>
      </div>

      {/* Code toggle */}
      <button
        onClick={() => setShowCode(!showCode)}
        style={{
          width: '100%', padding: '10px', borderRadius: '8px',
          background: 'rgba(255,255,255,0.1)', border: '1px solid #334155',
          color: 'white', cursor: 'pointer', marginBottom: '12px',
        }}
      >
        {showCode ? '▼' : '▶'} View PyTorch Code
      </button>

      {showCode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '16px' }}
        >
          <pre style={{ fontFamily: 'monospace', fontSize: '11px', color: '#22c55e', margin: 0, overflow: 'auto' }}>
{`class MyNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.layers = nn.Sequential(
${layers.map((l, i) => {
  if (l.type === 'Linear') return `            nn.Linear(${l.in}, ${l.out}),`;
  if (l.type === 'ReLU') return `            nn.ReLU(),`;
  if (l.type === 'Dropout') return `            nn.Dropout(0.2),`;
  return '';
}).join('\n')}
        )
    
    def forward(self, x):
        return self.layers(x)

model = MyNetwork()
print(f"Total params: {sum(p.numel() for p in model.parameters()):,}")`}
          </pre>
        </motion.div>
      )}
    </div>
  );
}
