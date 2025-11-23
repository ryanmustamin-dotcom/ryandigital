import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import ColorGame from './components/ColorGame';
import ShapeGame from './components/ShapeGame';
import TypeGame from './components/TypeGame';
import LayoutGame from './components/LayoutGame';
import Footer from './components/Footer';
import { GameMode } from './types';

const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>('MENU');

  const renderContent = () => {
    switch (gameMode) {
      case 'COLOR':
        return <ColorGame onBack={() => setGameMode('MENU')} />;
      case 'SHAPE':
        return <ShapeGame onBack={() => setGameMode('MENU')} />;
      case 'TYPE':
        return <TypeGame onBack={() => setGameMode('MENU')} />;
      case 'LAYOUT':
        return <LayoutGame onBack={() => setGameMode('MENU')} />;
      default:
        return <MainMenu onSelectGame={setGameMode} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-200 selection:text-brand-900 overflow-x-hidden">
      {/* Background Blobs (Light Mode) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-60">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px] animate-bounce-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-100 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-violet-100 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 flex-grow flex flex-col justify-center">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
};

export default App;