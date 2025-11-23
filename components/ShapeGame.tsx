import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Repeat, ChevronRight, Home } from 'lucide-react';
import { SHAPE_LEVELS, MAX_ROUNDS, getReflection } from '../constants';
import { Point } from '../types';

interface ShapeGameProps {
  onBack: () => void;
}

const ShapeGame: React.FC<ShapeGameProps> = ({ onBack }) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [p1, setP1] = useState<Point>({ x: 0, y: 0 }); 
  const [p2, setP2] = useState<Point>({ x: 0, y: 0 }); 
  const [dragging, setDragging] = useState<'p1' | 'p2' | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const currentLevel = SHAPE_LEVELS[levelIndex];

  useEffect(() => {
    resetLevel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelIndex]);

  const resetLevel = () => {
    // Start user handles at 1/3 and 2/3 positions linearly
    setP1({ 
      x: currentLevel.p0.x + (currentLevel.p3.x - currentLevel.p0.x) / 3, 
      y: currentLevel.p0.y + (currentLevel.p3.y - currentLevel.p0.y) / 3 
    });
    setP2({ 
      x: currentLevel.p0.x + 2 * (currentLevel.p3.x - currentLevel.p0.x) / 3, 
      y: currentLevel.p0.y + 2 * (currentLevel.p3.y - currentLevel.p0.y) / 3 
    });
    setScore(null);
  };

  const handleMouseDown = (point: 'p1' | 'p2') => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDragging(point);
  };

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragging || !svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    // Scale mouse coordinates to SVG viewbox (600x400)
    const scaleX = 600 / svgRect.width;
    const scaleY = 400 / svgRect.height;

    const x = Math.min(Math.max(0, (clientX - svgRect.left) * scaleX), 600);
    const y = Math.min(Math.max(0, (clientY - svgRect.top) * scaleY), 400);

    if (dragging === 'p1') {
      setP1({ x, y });
    } else {
      setP2({ x, y });
    }
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  const calculateScore = () => {
    const dist1 = Math.sqrt(Math.pow(p1.x - currentLevel.p1.x, 2) + Math.pow(p1.y - currentLevel.p1.y, 2));
    const dist2 = Math.sqrt(Math.pow(p2.x - currentLevel.p2.x, 2) + Math.pow(p2.y - currentLevel.p2.y, 2));
    
    const maxDist = 200; 
    const score1 = Math.max(0, 100 - (dist1 / maxDist) * 100);
    const score2 = Math.max(0, 100 - (dist2 / maxDist) * 100);
    
    const finalScore = Math.round((score1 + score2) / 2);
    setScore(finalScore);
    setTotalScore(prev => prev + finalScore);
  };

  const nextLevel = () => {
    if (levelIndex < SHAPE_LEVELS.length - 1) {
      setLevelIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const targetPath = `M ${currentLevel.p0.x} ${currentLevel.p0.y} C ${currentLevel.p1.x} ${currentLevel.p1.y}, ${currentLevel.p2.x} ${currentLevel.p2.y}, ${currentLevel.p3.x} ${currentLevel.p3.y}`;
  const userPath = `M ${currentLevel.p0.x} ${currentLevel.p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${currentLevel.p3.x} ${currentLevel.p3.y}`;

  // Final Result View
  if (isFinished) {
    const avgScore = Math.round(totalScore / SHAPE_LEVELS.length);
    const reflection = getReflection(avgScore);
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 py-8 animate-in fade-in zoom-in duration-500">
         <div className="bg-white p-8 rounded-3xl shadow-2xl text-center w-full border border-slate-100">
          <div className="inline-block p-4 rounded-full bg-accent-50 mb-6">
            <h2 className="text-6xl font-black text-accent-600">{avgScore}</h2>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">{reflection.title}</h3>
          <p className="text-slate-500 mb-8 leading-relaxed">{reflection.message}</p>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-4 rounded-xl">
               <div className="text-sm text-slate-400">Total Poin</div>
               <div className="font-bold text-slate-800 text-xl">{totalScore}</div>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl">
               <div className="text-sm text-slate-400">Level Selesai</div>
               <div className="font-bold text-slate-800 text-xl">5 / 5</div>
             </div>
          </div>
          <button 
            onClick={onBack}
            className="w-full mt-8 py-4 bg-accent-600 hover:bg-accent-700 text-white font-bold rounded-xl shadow-lg shadow-accent-200 transition-all flex items-center justify-center gap-2"
          >
            <Home size={20} /> Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto px-4 py-8 animate-in slide-in-from-bottom-8 duration-500">
      <div className="w-full flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-accent-600 transition-colors font-semibold"
        >
          <ArrowLeft className="mr-2" size={20} /> Menu
        </button>
        <div className="text-center">
          <div className="text-accent-600 font-bold text-lg">{currentLevel.name}</div>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-slate-400 text-sm font-medium">Level</span>
           <span className="text-accent-600 font-bold text-xl">{levelIndex + 1}/{SHAPE_LEVELS.length}</span>
        </div>
      </div>

      <div className="text-slate-500 text-sm mb-4 text-center">
        {currentLevel.instruction}
      </div>

      <div className="relative w-full max-w-[600px] aspect-[3/2] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden touch-none select-none">
        <svg 
          ref={svgRef}
          viewBox="0 0 600 400" 
          className="w-full h-full cursor-crosshair"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines (aesthetic) */}
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
          </pattern>
          <rect width="600" height="400" fill="url(#grid)" />

          {/* Target Path (Gray dashed) */}
          <path 
            d={targetPath} 
            fill="none" 
            stroke="#94a3b8" 
            strokeWidth="8" 
            strokeLinecap="round"
            strokeDasharray="12,12"
            className="opacity-40"
          />

          {/* User Path */}
          <path 
            d={userPath} 
            fill="none" 
            stroke={score !== null ? (score > 80 ? '#10b981' : '#f59e0b') : '#f43f5e'} 
            strokeWidth="6" 
            strokeLinecap="round"
          />

          {/* Control Lines */}
          <line x1={currentLevel.p0.x} y1={currentLevel.p0.y} x2={p1.x} y2={p1.y} stroke="#cbd5e1" strokeWidth="2" />
          <line x1={currentLevel.p3.x} y1={currentLevel.p3.y} x2={p2.x} y2={p2.y} stroke="#cbd5e1" strokeWidth="2" />

          {/* Anchors */}
          <circle cx={currentLevel.p0.x} cy={currentLevel.p0.y} r="6" fill="#64748b" />
          <circle cx={currentLevel.p3.x} cy={currentLevel.p3.y} r="6" fill="#64748b" />

          {/* Handles */}
          {score === null && (
            <>
              <g 
                onMouseDown={handleMouseDown('p1')} 
                onTouchStart={handleMouseDown('p1')}
                style={{ cursor: 'grab' }}
                className="hover:scale-110 transition-transform origin-center"
              >
                <circle cx={p1.x} cy={p1.y} r="24" fill="rgba(244, 63, 94, 0.1)" />
                <circle cx={p1.x} cy={p1.y} r="10" fill="#f43f5e" stroke="white" strokeWidth="3" className="shadow-md" />
              </g>

              <g 
                onMouseDown={handleMouseDown('p2')} 
                onTouchStart={handleMouseDown('p2')}
                style={{ cursor: 'grab' }}
                className="hover:scale-110 transition-transform origin-center"
              >
                <circle cx={p2.x} cy={p2.y} r="24" fill="rgba(244, 63, 94, 0.1)" />
                <circle cx={p2.x} cy={p2.y} r="10" fill="#f43f5e" stroke="white" strokeWidth="3" className="shadow-md" />
              </g>
            </>
          )}
        </svg>

        {/* Overlay Result */}
        {score !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center shadow-2xl">
              <h3 className="text-slate-500 mb-1 text-sm font-bold uppercase tracking-wide">Akurasi</h3>
              <div className={`text-6xl font-black mb-6 ${score >= 90 ? 'text-success-500' : 'text-warn-500'}`}>
                {score}%
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={resetLevel} 
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold flex items-center transition-colors"
                >
                  <Repeat size={18} className="mr-2"/> Ulang
                </button>
                <button 
                  onClick={() => {
                    nextLevel();
                    setScore(null);
                  }} 
                  className="px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-xl text-sm font-bold flex items-center transition-colors shadow-lg shadow-accent-200"
                >
                  Lanjut <ChevronRight size={18} className="ml-2"/>
                </button>
              </div>
             </div>
          </div>
        )}
      </div>

      <div className="mt-8 w-full max-w-lg">
        {score === null && (
          <button 
            onClick={calculateScore}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-2xl shadow-xl transition-all transform hover:scale-[1.01]"
          >
            BANDINGKAN BENTUK
          </button>
        )}
      </div>
    </div>
  );
};

export default ShapeGame;