import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-auto border-t border-slate-200 bg-white/80 backdrop-blur-sm text-center">
      <div className="container mx-auto px-4">
        <p className="text-slate-600 text-sm font-medium">
          Created by <span className="text-brand-600 font-bold">Ryan Mustami Nugroho</span>
        </p>
        <p className="text-slate-400 text-xs mt-1 font-medium">
          Guru SMK-IT As-Syifa Boarding School. 2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;