import React, { createContext, useContext, useEffect, useState } from 'react';
import { MediaItem } from '../types/media';

interface WatchlistContextType {
  watchlist: MediaItem[];
  toggleBookmark: (item: MediaItem) => void;
  isBookmarked: (id: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

const STORAGE_KEY = 'cinepulse_watchlist_v1';

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to save watchlist to localStorage:', e);
    }
  }, [watchlist]);

  const toggleBookmark = (item: MediaItem) => {
    setWatchlist((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        return [item, ...prev];
      }
    });
  };

  const isBookmarked = (id: string) => {
    return watchlist.some((item) => item.id === id);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, toggleBookmark, isBookmarked }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
