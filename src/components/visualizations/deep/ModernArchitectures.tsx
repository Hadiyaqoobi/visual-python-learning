"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ModernArchitectures() {
  const [selected, setSelected] = useState<string>('resnet');

  const architectures = {
    resnet: {
      name: 'ResNet',
      year: 2015,
      innovation: 'Skip Connections',
      keyIdea: 'Add input to output: y = F(x) + x',
      depth: '50-152 layers',
      useCase: 'Image classification',
      color: '#22c55e',
    },
    transformer: {
      name: 'Transformer',
      year: 2017,
      innovation: 'Self-Attention',
      keyIdea: 'Attend to all positions in parallel',
      depth: '12-96 layers',
      useCase: 'NLP, GPT, BERT, ViT',
      color: '#8b5cf6',
    },
    unet: {
      name: 'U-Net',
      year: 2015,
      innovation: 'Encoder-Decoder + Skip',
      keyIdea: 'Downsample then upsample with skips',
      depth: '23 layers',
      useCase: 'Segmentation, diffusion',
      color: '#f97316',
    },
    gan: {
      name: 'GAN',
      year: 2014,
      innovation: 'Adversarial Training',
      keyIdea: 'Generator vs Discriminator',
      depth: 'Variable',
      useCase: 'Image generation',
      color: '#ef4444',
    },
  };

  const current = architectures[selected as keyof typeof architectures];

  return (
    <div style={{
      width: '100%', minHeight: '550px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '16px', padding: '24px', color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🏛️ Modern Architectures</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Revolutionary designs that shaped deep learning</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {Object.entries(architectures).map(([key, arch]) => (
          <button key={key} onClick={() => setSelected(key)}
            style={{
              padding: '10px 20px', borderRadius: '8px',
              background: selected === key ? arch.color : 'transparent',
              border: `2px solid ${arch.color}`,
              color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold',
            }}>
            {arch.name}
          </button>
        ))}
      </div>

      <motion.div key={selected} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: `${current.color}20`, borderRadius: '12px', padding: '24px',
          border: `2px solid ${current.color}`, maxWidth: '500px', margin: '0 auto 24px',
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: current.color }}>{current.name}</h3>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>
            {current.year}
          </div>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Key Innovation</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#e2e8f0' }}>{current.innovation}</div>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Core Idea</div>
          <div style={{ fontSize: '14px', color: '#cbd5e1', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px' }}>
            {current.keyIdea}
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Depth</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{current.depth}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Use Case</div>
            <div style={{ fontSize: '12px' }}>{current.useCase}</div>
          </div>
        </div>
      </motion.div>

      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px' }}>
        <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>Evolution Timeline</div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '4px', background: '#334155', borderRadius: '2px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {[
              { year: 2012, name: 'AlexNet', color: '#3b82f6' },
              { year: 2014, name: 'GAN', color: '#ef4444' },
              { year: 2015, name: 'ResNet', color: '#22c55e' },
              { year: 2017, name: 'Transformer', color: '#8b5cf6' },
              { year: 2020, name: 'ViT', color: '#f97316' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: item.color, marginBottom: '8px' }} />
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>{item.year}</div>
                <div style={{ fontSize: '9px', color: item.color }}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
