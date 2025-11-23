import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, Home, Hand } from 'lucide-react';
import { TYPE_LEVELS, getReflection } from '../constants';

interface TypeGameProps {
  onBack: () => void;
}

const TypeGame: React.FC<TypeGameProps> = ({ onBack }) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [spacings, setSpacings] = useState<number[]>([]);
  const [selectedGapIndex, setSelectedGapIndex] = useState<number>(0);
  const [score, setScore] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentLevel = TYPE_LEVELS[levelIndex];

  // Initialize spacings with random messiness
  useEffect(() => {
    const initialSpacings = currentLevel.idealSpacings.map(() => Math.floor(Math.random() * 40) + 10);
    setSpacings(initialSpacings);
    setSelectedGapIndex(0);
    setScore(null);
  }, [levelIndex, currentLevel]);

  const handleSpacingChange = (val: number) => {
    const newSpacings = [...spacings];
    newSpacings[selectedGapIndex] = val;
    setSpacings(newSpacings);
  };

  const calculateScore = () => {
    let totalDiff = 0;
    spacings.forEach((s, i) => {
      totalDiff += Math.abs(s - currentLevel.idealSpacings[i]);
    });
    
    // Average error per gap
    const avgDiff = totalDiff / spacings.length;
    
    // Max allowable error per gap is roughly 30px before 0 points
    const calculated = Math.max(0, 100 - (avgDiff * 3)); 
    setScore(Math.round(calculated));
    setTotalScore(prev => prev + Math.round(calculated));
  };

  const nextLevel = () => {
    if (levelIndex < TYPE_LEVELS.length - 1) {
      setLevelIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    const avgScore = Math.round(totalScore / TYPE_LEVELS.length);
    const reflection = getReflection(avgScore);
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 py-8 animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center w-full border border-slate-100">
          <div className="inline-block p-4 rounded-full bg-type-50 mb-6">
            <h2 className="text-6xl font-black text-type-500">{avgScore}</h2>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">{reflection.title}</h3>
          <p className="text-slate-500 mb-8 leading-relaxed">{reflection.message}</p>
          <button onClick={onBack} className="w-full py-4 bg-type-500 hover:bg-type-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            <Home size={20} /> Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 py-8 animate-in slide-in-from-bottom-8 duration-500">
      <div className="w-full flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-type-500 font-semibold transition-colors">
          <ArrowLeft className="mr-2" size={20} /> Menu
        </button>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">Level</span>
          <span className="text-type-500 font-bold text-xl">{levelIndex + 1}/{TYPE_LEVELS.length}</span>
        </div>
      </div>

      <div className="text-center mb-8 max-w-lg">
        <p className="text-slate-500 text-sm">{currentLevel.instruction}</p>
        <p className="text-type-600 text-xs mt-2 font-bold animate-pulse">
           💡 Ketuk area di antara huruf untuk memilihnya, lalu geser slider.
        </p>
      </div>

      {/* Type Canvas */}
      <div className="w-full h-48 md:h-64 bg-white rounded-3xl border border-slate-200 shadow-xl flex items-center justify-center overflow-hidden mb-8 select-none relative px-4">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="flex items-center justify-center flex-wrap" style={{ fontFamily: currentLevel.fontFamily }}>
          {currentLevel.word.split('').map((char, index) => {
             const isLast = index === currentLevel.word.split('').length - 1;
             const spacingVal = isLast ? 0 : (spacings[index] || 0);
             const isSelected = selectedGapIndex === index && !isLast;

             return (
               <React.Fragment key={index}>
                 <span className="text-6xl md:text-8xl text-slate-900 leading-none">{char}</span>
                 {!isLast && (
                   <div 
                     onClick={() => score === null && setSelectedGapIndex(index)}
                     className={`h-24 md:h-32 w-8 mx-1 cursor-pointer flex items-center justify-center group transition-all relative rounded-lg ${isSelected ? 'bg-type-100 ring-2 ring-type-500' : 'hover:bg-slate-50'}`}
                     style={{ marginRight: `${spacingVal}px` }} // Visual margin
                   >
                      {/* Interaction Hit Box */}
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                         {score === null && (
                            <div className={`w-1 h-8 rounded-full transition-colors ${isSelected ? 'bg-type-500' : 'bg-slate-200 group-hover:bg-type-200'}`} />
                         )}
                         {score !== null && (
                           // Show Target hint on result
                           <div 
                             className="absolute h-full border-l-2 border-dashed border-success-400 opacity-60"
                             style={{ left: `calc(50% + ${(currentLevel.idealSpacings[index] || 0) - spacingVal}px)` }}
                           />
                         )}
                      </div>
                   </div>
                 )}
               </React.Fragment>
             );
          })}
        </div>
      </div>

      {/* Control */}
      <div className={`w-full max-w-lg bg-white p-6 rounded-2xl shadow-lg border border-slate-100 transition-opacity ${score !== null ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex justify-between items-center mb-4">
          <label className="text-slate-700 font-bold flex items-center gap-2">
            <Hand size={18} className="text-type-500" />
            Jarak Huruf: <span className="text-type-600 bg-type-50 px-2 py-0.5 rounded ml-1">Celah {selectedGapIndex + 1}</span>
          </label>
          <span className="text-slate-400 font-mono text-sm">{spacings[selectedGapIndex]}px</span>
        </div>
        
        <input 
          type="range" 
          min="-30" 
          max="60" 
          value={spacings[selectedGapIndex] || 0}
          onChange={(e) => handleSpacingChange(Number(e.target.value))}
          className="w-full accent-type-500 h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
           <span>Rapat</span>
           <span>Renggang</span>
        </div>
      </div>

      <div className="mt-8 w-full max-w-lg">
        {score === null ? (
          <button 
            onClick={calculateScore}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-2xl shadow-xl transition-all"
          >
            CEK TIPOGRAFI
          </button>
        ) : (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4">
             <div className={`text-5xl font-black mb-2 ${score >= 90 ? 'text-success-500' : 'text-warn-500'}`}>
                {score}%
             </div>
             <p className="text-slate-400 mb-6 text-sm">{score >= 90 ? "Proporsi sempurna!" : "Garis hijau putus-putus adalah kunci."}</p>
             <button 
                onClick={() => {
                  nextLevel();
                  setScore(null);
                }} 
                className="px-8 py-3 bg-type-500 hover:bg-type-600 text-white font-bold rounded-xl shadow-lg inline-flex items-center"
              >
                Lanjut <ChevronRight className="ml-2" />
              </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default TypeGame;