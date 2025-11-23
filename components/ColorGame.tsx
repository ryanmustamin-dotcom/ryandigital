import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Play, Home } from 'lucide-react';
import { HSL } from '../types';
import { MAX_ROUNDS, getReflection } from '../constants';

interface ColorGameProps {
  onBack: () => void;
}

const ColorGame: React.FC<ColorGameProps> = ({ onBack }) => {
  const [target, setTarget] = useState<HSL>({ h: 0, s: 50, l: 50 });
  const [current, setCurrent] = useState<HSL>({ h: 180, s: 50, l: 50 });
  const [score, setScore] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [gameState, setGameState] = useState<'PLAYING' | 'ROUND_RESULT' | 'FINAL_RESULT'>('PLAYING');

  const generateTarget = useCallback(() => {
    setTarget({
      h: Math.floor(Math.random() * 360),
      s: Math.floor(Math.random() * 60) + 20, 
      l: Math.floor(Math.random() * 60) + 20, 
    });
    setCurrent({
      h: Math.floor(Math.random() * 360),
      s: 50,
      l: 50,
    });
    setScore(null);
    setGameState('PLAYING');
  }, []);

  useEffect(() => {
    generateTarget();
  }, [generateTarget]);

  const calculateScore = () => {
    let hDiff = Math.abs(target.h - current.h);
    if (hDiff > 180) hDiff = 360 - hDiff;
    
    const hScore = Math.max(0, 100 - (hDiff / 180) * 100);
    const sScore = Math.max(0, 100 - Math.abs(target.s - current.s));
    const lScore = Math.max(0, 100 - Math.abs(target.l - current.l));

    const roundScore = (hScore * 0.5) + (sScore * 0.25) + (lScore * 0.25);
    return Math.round(roundScore);
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setTotalScore(prev => prev + finalScore);
    
    if (round >= MAX_ROUNDS) {
      setGameState('FINAL_RESULT');
    } else {
      setGameState('ROUND_RESULT');
    }
  };

  const handleNext = () => {
    setRound(prev => prev + 1);
    generateTarget();
  };

  const hslString = (c: HSL) => `hsl(${c.h}, ${c.s}%, ${c.l}%)`;

  // Final Result Content
  if (gameState === 'FINAL_RESULT') {
    const avgScore = Math.round(totalScore / MAX_ROUNDS);
    const reflection = getReflection(avgScore);

    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 py-8 animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center w-full border border-slate-100">
          <div className="inline-block p-4 rounded-full bg-brand-50 mb-6">
            <h2 className="text-6xl font-black text-brand-600">{avgScore}</h2>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">{reflection.title}</h3>
          <p className="text-slate-500 mb-8 leading-relaxed">
            {reflection.message}
          </p>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-4 rounded-xl">
               <div className="text-sm text-slate-400">Total Poin</div>
               <div className="font-bold text-slate-800 text-xl">{totalScore}</div>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl">
               <div className="text-sm text-slate-400">Ronde</div>
               <div className="font-bold text-slate-800 text-xl">5 / 5</div>
             </div>
          </div>
          <button 
            onClick={onBack}
            className="w-full mt-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-200 transition-all flex items-center justify-center gap-2"
          >
            <Home size={20} /> Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto px-4 py-8 animate-in slide-in-from-bottom-8 duration-500">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-brand-600 transition-colors font-semibold"
        >
          <ArrowLeft className="mr-2" size={20} /> Menu
        </button>
        <div className="flex items-center gap-2">
           <span className="text-slate-400 text-sm font-medium">Level</span>
           <span className="text-brand-600 font-bold text-xl">{round}/{MAX_ROUNDS}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full mb-10 items-center">
        {/* Target */}
        <div className="flex flex-col items-center gap-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Target</div>
          <div 
            className="w-full aspect-square max-w-[280px] rounded-3xl shadow-xl border-8 border-white ring-1 ring-slate-100 relative overflow-hidden transition-all duration-500"
            style={{ backgroundColor: hslString(target) }}
          >
            {gameState !== 'PLAYING' && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                 <span className="bg-white/90 text-slate-900 px-4 py-2 rounded-lg font-mono font-bold text-sm shadow-lg">
                   {hslString(target)}
                 </span>
               </div>
            )}
          </div>
        </div>

        {/* Player */}
        <div className="flex flex-col items-center gap-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Warna Kamu</div>
          <div 
            className="w-full aspect-square max-w-[280px] rounded-3xl shadow-xl border-8 border-white ring-1 ring-slate-100 transition-colors duration-100"
            style={{ backgroundColor: hslString(current) }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className={`w-full max-w-3xl bg-white p-8 rounded-3xl shadow-xl border border-slate-100 transition-all duration-300 ${gameState !== 'PLAYING' ? 'opacity-50 pointer-events-none blur-[1px]' : 'opacity-100'}`}>
        
        {/* Hue */}
        <div className="mb-6">
          <div className="flex justify-between mb-3">
            <label className="text-slate-700 font-bold">Hue</label>
            <span className="text-slate-400 font-mono text-sm">{current.h}°</span>
          </div>
          <div className="relative h-8 w-full rounded-full shadow-inner ring-1 ring-slate-200" style={{ background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }}>
            <input 
              type="range" 
              min="0" 
              max="360" 
              value={current.h} 
              onChange={(e) => setCurrent({...current, h: Number(e.target.value)})}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white border-x border-slate-300 pointer-events-none transform -translate-x-1/2 h-full shadow-sm"
              style={{ left: `${(current.h / 360) * 100}%` }}
            />
          </div>
        </div>

        {/* Saturation */}
        <div className="mb-6">
          <div className="flex justify-between mb-3">
            <label className="text-slate-700 font-bold">Saturation</label>
            <span className="text-slate-400 font-mono text-sm">{current.s}%</span>
          </div>
          <div className="relative h-8 w-full rounded-full shadow-inner ring-1 ring-slate-200" style={{ background: `linear-gradient(to right, hsl(${current.h}, 0%, ${current.l}%), hsl(${current.h}, 100%, ${current.l}%))` }}>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={current.s} 
              onChange={(e) => setCurrent({...current, s: Number(e.target.value)})}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
        </div>

        {/* Lightness */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            <label className="text-slate-700 font-bold">Lightness</label>
            <span className="text-slate-400 font-mono text-sm">{current.l}%</span>
          </div>
          <div className="relative h-8 w-full rounded-full shadow-inner ring-1 ring-slate-200" style={{ background: `linear-gradient(to right, black, hsl(${current.h}, ${current.s}%, 50%), white)` }}>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={current.l} 
              onChange={(e) => setCurrent({...current, l: Number(e.target.value)})}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
        </div>
        
        <button 
          onClick={handleSubmit}
          className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-brand-200 transition-all transform hover:scale-[1.01] active:scale-95"
        >
          COCOKKAN WARNA
        </button>
      </div>

      {/* Round Result Modal */}
      {gameState === 'ROUND_RESULT' && score !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl text-center max-w-sm w-full shadow-2xl transform animate-in zoom-in-95 duration-300 border border-slate-100">
            <h2 className="text-xl font-bold mb-2 text-slate-500">Skor Ronde {round}</h2>
            <div className={`text-6xl font-black mb-4 ${score >= 90 ? 'text-success-500' : score >= 70 ? 'text-warn-500' : 'text-accent-500'}`}>
              {score}
            </div>
            
            <button 
              onClick={handleNext}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Lanjut <Play size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorGame;