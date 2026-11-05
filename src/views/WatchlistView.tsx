import React, { useState } from 'react';
import { Bookmark, Film } from 'lucide-react';
import { MediaCard } from '../components/MediaCard';
import { useWatchlist } from '../context/WatchlistContext';
import { MediaItem, MediaType } from '../types/media';

interface WatchlistViewProps {
  onSelectMedia: (item: MediaItem) => void;
  onExploreClick: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({ onSelectMedia, onExploreClick }) => {
  const { watchlist } = useWatchlist();
  const [filter, setFilter] = useState<MediaType>('ALL');

  const filteredWatchlist =
    filter === 'ALL' ? watchlist : watchlist.filter((item) => item.mediaType === filter);

  const filterTabs: { id: MediaType; label: string }[] = [
    { id: 'ALL', label: `All (${watchlist.length})` },
    { id: 'MOVIE', label: 'Movies' },
    { id: 'TV', label: 'TV Series' },
    { id: 'ANIME', label: 'Anime' }
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
            <Bookmark className="w-6 h-6 text-purple-400 fill-purple-400" />
            <span>My Saved Watchlist</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Saved titles stored locally on your device</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === tab.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-[#13182A] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Grid or Empty State */}
      {filteredWatchlist.length === 0 ? (
        <div className="p-12 text-center bg-[#13182A] rounded-2xl border border-slate-800/80 max-w-md mx-auto my-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-600/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Your watchlist is empty</h3>
            <p className="text-xs text-slate-400">
              Bookmark movies, TV series, or anime from the Home or Search pages to save them here.
            </p>
          </div>
          <button
            onClick={onExploreClick}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-purple-900/40 transition-all active:scale-95"
          >
            Discover Media Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredWatchlist.map((item) => (
            <MediaCard key={item.id} item={item} onClick={onSelectMedia} />
          ))}
        </div>
      )}
    </div>
  );
};
