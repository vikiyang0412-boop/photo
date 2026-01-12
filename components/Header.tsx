
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="text-2xl font-bold tracking-tight italic text-zinc-900">
        PersonaAI
      </div>
      <div className="flex gap-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600"></div>
      </div>
    </header>
  );
};

export default Header;
