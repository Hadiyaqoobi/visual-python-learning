"use client";
import React, { useState } from 'react';

interface CPUComponent {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  placed: boolean;
  correctSlot: string;
}

interface Slot {
  id: string;
  name: string;
  x: number;
  y: number;
  accepts: string[];
  filled: string | null;
}

const INITIAL_COMPONENTS: CPUComponent[] = [
  { id: 'alu', name: 'ALU', description: 'Performs calculations', color: '#22c55e', icon: '➕', placed: false, correctSlot: 'slot-alu' },
  { id: 'registers', name: 'Registers', description: 'Fast storage', color: '#ef4444', icon: '📊', placed: false, correctSlot: 'slot-registers' },
  { id: 'control', name: 'Control Unit', description: 'Orchestrates operations', color: '#8b5cf6', icon: '🎛️', placed: false, correctSlot: 'slot-control' },
  { id: 'pc', name: 'Program Counter', description: 'Tracks instruction address', color: '#f97316', icon: '📍', placed: false, correctSlot: 'slot-pc' },
  { id: 'cache', name: 'L1 Cache', description: 'Fast memory buffer', color: '#eab308', icon: '⚡', placed: false, correctSlot: 'slot-cache' },
  { id: 'decoder', name: 'Decoder', description: 'Interprets instructions', color: '#ec4899', icon: '🔍', placed: false, correctSlot: 'slot-decoder' },
];

const SLOTS: Slot[] = [
  { id: 'slot-control', name: 'Control Unit', x: 50, y: 10, accepts: ['control'], filled: null },
  { id: 'slot-decoder', name: 'Decoder', x: 50, y: 30, accepts: ['decoder'], filled: null },
  { id: 'slot-pc', name: 'Program Counter', x: 15, y: 20, accepts: ['pc'], filled: null },
  { id: 'slot-registers', name: 'Registers', x: 85, y: 20, accepts: ['registers'], filled: null },
  { id: 'slot-alu', name: 'ALU', x: 50, y: 55, accepts: ['alu'], filled: null },
  { id: 'slot-cache', name: 'Cache', x: 50, y: 80, accepts: ['cache'], filled: null },
];

export function CPUBuilder() {
  const [components, setComponents] = useState<CPUComponent[]>(INITIAL_COMPONENTS);
  const [slots, setSlots] = useState<Slot[]>(SLOTS);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const allPlaced = components.every(c => c.placed);
  const placedCount = components.filter(c => c.placed).length;

  const handleDragStart = (componentId: string) => {
    setDraggedComponent(componentId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (slotId: string) => {
    if (!draggedComponent) return;
    const slot = slots.find(s => s.id === slotId);
    const component = components.find(c => c.id === draggedComponent);
    if (!slot || !component) return;

    if (slot.filled) {
      setMessage({ text: 'Slot already filled!', type: 'error' });
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    if (!slot.accepts.includes(draggedComponent)) {
      setMessage({ text: `${component.name} doesn't belong here!`, type: 'error' });
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    setComponents(prev => prev.map(c => c.id === draggedComponent ? { ...c, placed: true } : c));
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, filled: draggedComponent } : s));
    setMessage({ text: `${component.name} placed!`, type: 'success' });
    setTimeout(() => setMessage(null), 2000);
    setDraggedComponent(null);
  };

  const reset = () => {
    setComponents(INITIAL_COMPONENTS);
    setSlots(SLOTS);
    setMessage(null);
  };

  const autoComplete = () => {
    setComponents(prev => prev.map(c => ({ ...c, placed: true })));
    setSlots(prev => prev.map(s => {
      const comp = INITIAL_COMPONENTS.find(c => c.correctSlot === s.id);
      return comp ? { ...s, filled: comp.id } : s;
    }));
  };

  const getComponentInSlot = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot?.filled) return null;
    return components.find(c => c.id === slot.filled);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">CPU Builder</h2>
        <p className="text-gray-600">Drag and drop components to build a CPU!</p>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-600">Progress: {placedCount}/{components.length}</span>
          <div className="w-48 bg-gray-200 rounded-full h-2 mt-1">
            <div className="bg-green-500 rounded-full h-2 transition-all" style={{ width: `${(placedCount / components.length) * 100}%` }} />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="px-3 py-1 bg-gray-200 rounded text-sm">Reset</button>
          <button onClick={autoComplete} className="px-3 py-1 bg-green-500 text-white rounded text-sm">Auto Complete</button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <h3 className="font-bold text-gray-700 mb-3">Components</h3>
          <div className="space-y-2">
            {components.filter(c => !c.placed).map(comp => (
              <div
                key={comp.id}
                draggable
                onDragStart={() => handleDragStart(comp.id)}
                className="p-3 rounded-lg cursor-move hover:scale-105 transition-all text-white"
                style={{ backgroundColor: comp.color }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{comp.icon}</span>
                  <span className="font-bold">{comp.name}</span>
                </div>
                <p className="text-xs mt-1 opacity-90">{comp.description}</p>
              </div>
            ))}
            {components.filter(c => !c.placed).length === 0 && (
              <div className="text-center text-gray-400 py-4">All placed! 🎉</div>
            )}
          </div>
        </div>

        <div className="col-span-3">
          <div className="bg-gray-900 rounded-xl p-6 relative" style={{ minHeight: '350px' }}>
            <h3 className="text-white font-bold mb-4 text-center">CPU Architecture</h3>
            <div className="absolute bottom-4 left-4 right-4 h-8 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-gray-400 text-sm">↔ Memory Bus ↔</span>
            </div>
            {slots.map(slot => {
              const comp = getComponentInSlot(slot.id);
              return (
                <div
                  key={slot.id}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(slot.id)}
                  className={`absolute w-28 h-16 rounded-lg border-2 border-dashed transition-all flex items-center justify-center ${
                    comp ? 'border-transparent' : 'border-gray-600 hover:border-gray-400'
                  }`}
                  style={{
                    left: `${slot.x}%`,
                    top: `${slot.y}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: comp?.color || 'transparent',
                  }}
                >
                  {comp ? (
                    <div className="text-center text-white p-2">
                      <span className="text-xl">{comp.icon}</span>
                      <div className="text-xs font-bold">{comp.name}</div>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-xs text-center p-2">{slot.name}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {allPlaced && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h4 className="font-bold text-green-800">🎉 CPU Complete!</h4>
          <p className="text-green-700">All components are in place. The CPU is ready to execute instructions!</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <h4 className="font-bold text-yellow-800">💡 Key Insight</h4>
        <p className="text-yellow-900">
          A CPU is like a tiny city: Control Unit is city hall, ALU is the factory, 
          Registers are local storage, and Cache is a nearby warehouse.
        </p>
      </div>
    </div>
  );
}

export default CPUBuilder;
