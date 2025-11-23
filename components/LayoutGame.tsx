import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronRight, Home, GripHorizontal } from 'lucide-react';
import { LAYOUT_LEVELS, getReflection } from '../constants';
import { LayoutElement } from '../types';

interface LayoutGameProps {
  onBack: () => void;
}

const CONTAINER_SIZE = 350;

const LayoutGame: React.FC<LayoutGameProps> = ({ onBack }) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [elements, setElements] = useState<LayoutElement[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLevel = LAYOUT_LEVELS[levelIndex];

  useEffect(() => {
    // Deep copy to avoid mutating constant
    setElements(JSON.parse(JSON.stringify(currentLevel.elements)));
    setScore(null);
  }, [levelIndex, currentLevel]);

  // Touch/Mouse Handlers
  const handleStart = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    if (score !== null) return;
    setDraggingId(id);
    e.stopPropagation(); // Prevent page scroll on touch start if needed (though passive helps)
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingId || !containerRef.current || score !== null) return;

    // Get input coordinates
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setElements(prev => prev.map(el => {
      if (el.id === draggingId) {
        // Center the element on the finger/cursor
        let newX = x - (el.width / 2);
        let newY = y - (el.height / 2);

        // Constrain to container
        newX = Math.max(0, Math.min(newX, CONTAINER_SIZE - el.width));
        newY = Math.max(0, Math.min(newY, CONTAINER_SIZE - el.height));

        return { ...el, startX: newX, startY: newY };
      }
      return el;
    }));
  };

  const handleEnd = () => {
    setDraggingId(null);
  };

  const calculateScore = () => {
    let totalDist = 0;
    
    elements.forEach(el => {
      // Find original target from constant
      const target = currentLevel.elements.find(t => t.id === el.id);
      if (target) {
        const dist = Math.sqrt(
          Math.pow(el.startX - target.targetX, 2) + 
          Math.pow(el.startY - target.targetY, 2)
        );
        totalDist += dist;
      }
    });

    // Normalize score. 
    // Average distance of 5px = 100%. 
    // Average distance of 100px = 0%.
    const avgDist = totalDist / elements.length;
    const calculated = Math.max(0, 100 - (avgDist));
    
    setScore(Math.round(calculated));
    setTotalScore(prev => prev + Math.round(calculated));
  };

  const nextLevel = () => {
    if (levelIndex < LAYOUT_LEVELS.length - 1) {
      setLevelIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    const avgScore = Math.round(totalScore / LAYOUT_LEVELS.length);
    const reflection = getReflection(avgScore);
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 py-8 animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center w-full border border-slate-100">
          <div className="inline-block p-4 rounded-full bg-layout-50 mb-6">
            <h2 className="text-6xl font-black text-layout-500">{avgScore}</h2>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">{reflection.title}</h3>
          <p className="text-slate-500 mb-8 leading-relaxed">{reflection.message}</p>
          <button onClick={onBack} className="w-full py-4 bg-layout-500 hover:bg-layout-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            <Home size={20} /> Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  // Render Grid Overlay
  const renderGrid = () => {
    if (currentLevel.gridType === 'thirds') {
      return (
        <>
          <div className="absolute top-0 left-1/3 w-px h-full bg-layout-300 opacity-30 dashed" />
          <div className="absolute top-0 left-2/3 w-px h-full bg-layout-300 opacity-30 dashed" />
          <div className="absolute top-1/3 left-0 w-full h-px bg-layout-300 opacity-30 dashed" />
          <div className="absolute top-2/3 left-0 w-full h-px bg-layout-300 opacity-30 dashed" />
        </>
      );
    }
    if (currentLevel.gridType === 'center') {
      return (
        <>
          <div className="absolute top-0 left-1/2 w-px h-full bg-layout-300 opacity-30 dashed" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-layout-300 opacity-30 dashed" />
        </>
      );
    }
    if (currentLevel.gridType === 'columns') {
       return (
        <div className="absolute inset-0 grid grid-cols-4 gap-2 px-2 pointer-events-none">
            <div className="bg-layout-50 opacity-20 h-full"></div>
            <div className="bg-layout-50 opacity-20 h-full"></div>
            <div className="bg-layout-50 opacity-20 h-full"></div>
            <div className="bg-layout-50 opacity-20 h-full"></div>
        </div>
       );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 py-8 animate-in slide-in-from-bottom-8 duration-500 select-none">
      <div className="w-full flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-layout-500 font-semibold transition-colors">
          <ArrowLeft className="mr-2" size={20} /> Menu
        </button>
        <div className="text-center">
             <h2 className="text-xl font-bold text-layout-500">{currentLevel.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">Level</span>
          <span className="text-layout-500 font-bold text-xl">{levelIndex + 1}/{LAYOUT_LEVELS.length}</span>
        </div>
      </div>

      <div className="text-center mb-6">
          <p className="text-slate-500 text-sm mb-1">{currentLevel.instruction}</p>
          <p className="text-xs text-layout-500 font-bold">👆 Geser elemen di bawah ini ke posisi yang tepat.</p>
      </div>

      {/* Editor Container */}
      <div 
        className="relative bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden touch-none"
        style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        {/* Grid Overlay (Always visible faintly, or only on result? Let's show faintly for help, strong for result) */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${score !== null ? 'opacity-100' : 'opacity-0'}`}>
            {renderGrid()}
        </div>

        {elements.map(el => (
          <div
            key={el.id}
            onMouseDown={(e) => handleStart(el.id, e)}
            onTouchStart={(e) => handleStart(el.id, e)}
            className={`absolute flex items-center justify-center rounded-lg shadow-md cursor-move transition-shadow ${el.color} ${score !== null ? 'opacity-50 grayscale' : 'hover:shadow-xl hover:ring-2 ring-layout-300'}`}
            style={{
              width: el.width,
              height: el.height,
              left: el.startX,
              top: el.startY,
              zIndex: draggingId === el.id ? 50 : 10
            }}
          >
            {el.type === 'box' && <GripHorizontal className="text-white/50" />}
            {el.type === 'text' && <div className="w-3/4 h-2 bg-white/30 rounded-full"></div>}
            {el.label && <span className="absolute -top-6 text-xs font-bold text-slate-400 bg-white px-2 py-0.5 rounded shadow-sm whitespace-nowrap pointer-events-none">{el.label}</span>}
          </div>
        ))}

        {/* Target Ghosts (Result Only) */}
        {score !== null && currentLevel.elements.map(target => (
            <div 
                key={`target-${target.id}`}
                className="absolute border-2 border-dashed border-success-500 rounded-lg flex items-center justify-center pointer-events-none z-0"
                style={{
                    width: target.width,
                    height: target.height,
                    left: target.targetX,
                    top: target.targetY
                }}
            >
                <span className="text-xs text-success-600 font-bold bg-white px-1">Target</span>
            </div>
        ))}

      </div>

      <div className="mt-8 w-full max-w-lg">
        {score === null ? (
          <button 
            onClick={calculateScore}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-2xl shadow-xl transition-all"
          >
            VALIDASI POSISI
          </button>
        ) : (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4">
             <div className={`text-5xl font-black mb-2 ${score >= 90 ? 'text-success-500' : 'text-warn-500'}`}>
                {score}%
             </div>
             <p className="text-slate-400 mb-6 text-sm">{score >= 90 ? "Komposisi Mantap!" : "Perhatikan garis bantu hijau."}</p>
             <button 
                onClick={() => {
                  nextLevel();
                  setScore(null);
                }} 
                className="px-8 py-3 bg-layout-500 hover:bg-layout-600 text-white font-bold rounded-xl shadow-lg inline-flex items-center"
              >
                Lanjut <ChevronRight className="ml-2" />
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayoutGame;