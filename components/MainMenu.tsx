import React from 'react';
import { Palette, PenTool, Type, Layout, Play, Trophy } from 'lucide-react';
import { GameMode } from '../types';

interface MainMenuProps {
  onSelectGame: (mode: GameMode) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelectGame }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-6xl mx-auto px-4 animate-in fade-in zoom-in duration-500 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-2xl mb-6 shadow-sm">
          <Trophy className="text-brand-600 w-8 h-8" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
          MASTER <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-type-500">DESAIN</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Gim edukasi interaktif untuk siswa DKV. Latih kepekaan warna, bentuk, tipografi, dan tata letak untuk menjadi desainer profesional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {/* Color Game Card */}
        <button
          onClick={() => onSelectGame('COLOR')}
          className="group relative overflow-hidden bg-white rounded-3xl p-6 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-200/50 border border-slate-100 text-left"
        >
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-brand-50 rounded-full group-hover:bg-brand-100 transition-colors" />
          <div className="relative z-10">
            <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mb-6 text-brand-600 shadow-sm">
              <Palette size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Color Master</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Latih mata Anda mengenali Hue, Saturation, dan Lightness dengan presisi tinggi.
            </p>
            <div className="flex items-center text-brand-600 font-bold text-sm group-hover:gap-2 transition-all">
              Mainkan <Play size={14} className="ml-1 fill-current" />
            </div>
          </div>
        </button>

        {/* Shape Game Card */}
        <button
          onClick={() => onSelectGame('SHAPE')}
          className="group relative overflow-hidden bg-white rounded-3xl p-6 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent-200/50 border border-slate-100 text-left"
        >
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-accent-50 rounded-full group-hover:bg-accent-100 transition-colors" />
          <div className="relative z-10">
            <div className="w-14 h-14 bg-accent-100 rounded-2xl flex items-center justify-center mb-6 text-accent-600 shadow-sm">
              <PenTool size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Shape Master</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Kuasai Bézier curve. Bentuk garis lengkung sempurna dengan Pen Tool.
            </p>
            <div className="flex items-center text-accent-600 font-bold text-sm group-hover:gap-2 transition-all">
              Mainkan <Play size={14} className="ml-1 fill-current" />
            </div>
          </div>
        </button>

        {/* Type Game Card */}
        <button
          onClick={() => onSelectGame('TYPE')}
          className="group relative overflow-hidden bg-white rounded-3xl p-6 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-type-200/50 border border-slate-100 text-left"
        >
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-type-50 rounded-full group-hover:bg-violet-100 transition-colors" />
          <div className="relative z-10">
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mb-6 text-violet-600 shadow-sm">
              <Type size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Type Master</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Pelajari Kerning. Atur jarak antar huruf agar nyaman dibaca dan estetis.
            </p>
            <div className="flex items-center text-violet-600 font-bold text-sm group-hover:gap-2 transition-all">
              Mainkan <Play size={14} className="ml-1 fill-current" />
            </div>
          </div>
        </button>

         {/* Layout Game Card */}
         <button
          onClick={() => onSelectGame('LAYOUT')}
          className="group relative overflow-hidden bg-white rounded-3xl p-6 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-layout-200/50 border border-slate-100 text-left"
        >
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-sky-50 rounded-full group-hover:bg-sky-100 transition-colors" />
          <div className="relative z-10">
            <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mb-6 text-sky-600 shadow-sm">
              <Layout size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Layout Master</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Pahami Padding & Margin. Latih mata untuk keseimbangan tata letak ruang.
            </p>
            <div className="flex items-center text-sky-600 font-bold text-sm group-hover:gap-2 transition-all">
              Mainkan <Play size={14} className="ml-1 fill-current" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MainMenu;