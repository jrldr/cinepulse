import React from 'react';
import { Bookmark, Compass, Home } from 'lucide-react';

interface MobileNavBarProps {
  activeTab: 'HOME' | 'EXPLORE' | 'WATCHLIST';
  onTabChange: (tab: 'HOME' | 'EXPLORE' | 'WATCHLIST') => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0D18]/95 backdrop-blur-lg border-t border-purple-500/20 px-6 py-2 flex items-center justify-around shadow-2xl pb-safe">
      <button
        onClick={() => onTabChange('HOME')}
        className={`flex flex-col items-center space-y-1 transition-all ${
          activeTab === 'HOME' ? 'text-purple-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => onTabChange('EXPLORE')}
        className={`flex flex-col items-center space-y-1 transition-all ${
          activeTab === 'EXPLORE' ? 'text-purple-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px]">Search & Explore</span>
      </button>

      <button
        onClick={() => onTabChange('WATCHLIST')}
        className={`flex flex-col items-center space-y-1 transition-all ${
          activeTab === 'WATCHLIST' ? 'text-purple-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Bookmark className="w-5 h-5" />
        <span className="text-[10px]">Watchlist</span>
      </button>
    </div>
  );
};
