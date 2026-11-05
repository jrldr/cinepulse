import React from 'react';
import { Bookmark, Compass, Download, Film, Home, Search } from 'lucide-react';

interface HeaderProps {
  activeTab: 'HOME' | 'EXPLORE' | 'WATCHLIST';
  onTabChange: (tab: 'HOME' | 'EXPLORE' | 'WATCHLIST') => void;
  onSearchFocus?: () => void;
  onInstallClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onSearchFocus,
  onInstallClick
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0A0D18]/90 backdrop-blur-md border-b border-purple-500/10 px-4 sm:px-8 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <div
        onClick={() => onTabChange('HOME')}
        className="flex items-center space-x-2.5 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform">
          <Film className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg sm:text-xl font-black text-white tracking-tight">CinePulse</span>
          <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-500/20">
            Web App
          </span>
        </div>
      </div>

      {/* Desktop / Tablet Nav Tabs */}
      <nav className="hidden md:flex items-center space-x-1 bg-[#13182A] p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => onTabChange('HOME')}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'HOME' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onTabChange('EXPLORE')}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'EXPLORE' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Explore & Search</span>
        </button>

        <button
          onClick={() => onTabChange('WATCHLIST')}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'WATCHLIST' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>My Watchlist</span>
        </button>
      </nav>

      {/* Header Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            onTabChange('EXPLORE');
            if (onSearchFocus) onSearchFocus();
          }}
          className="flex items-center space-x-2 bg-[#13182A] hover:bg-[#1E253B] text-slate-300 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-800 transition-all active:scale-95"
        >
          <Search className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline">Search media...</span>
        </button>

        {onInstallClick && (
          <button
            onClick={onInstallClick}
            className="flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-purple-900/30 transition-all active:scale-95"
            title="Install App"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Install App</span>
          </button>
        )}
      </div>
    </header>
  );
};
