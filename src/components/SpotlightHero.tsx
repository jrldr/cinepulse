import React from 'react';
import { Info, Play, Star } from 'lucide-react';
import { MediaItem } from '../types/media';

interface SpotlightHeroProps {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
  onWatchTrailer: (item: MediaItem) => void;
}

export const SpotlightHero: React.FC<SpotlightHeroProps> = ({ item, onClick, onWatchTrailer }) => {
  const backdropUrl = item.backdropUrl || item.posterUrl;

  const typeLabel =
    item.mediaType === 'MOVIE' ? 'FEATURED MOVIE' : item.mediaType === 'TV' ? 'FEATURED TV SHOW' : 'FEATURED ANIME';

  return (
    <div
      onClick={() => onClick(item)}
      className="relative w-full h-[280px] sm:h-[360px] rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-purple-500/20 group my-4"
    >
      {backdropUrl ? (
        <img
          src={backdropUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-600">
          No Preview Image
        </div>
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D18] via-[#0A0D18]/60 to-black/30" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex flex-col items-start space-y-2 max-w-2xl">
        <div className="flex items-center space-x-2">
          <span className="bg-purple-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
            {typeLabel}
          </span>
          <div className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded flex items-center space-x-1 border border-white/10">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-white">{item.rating.toFixed(1)}</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-3xl font-black text-white line-clamp-1 group-hover:text-purple-300 transition-colors drop-shadow">
          {item.title}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-xl">
          {item.overview}
        </p>

        <div className="pt-2 flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatchTrailer(item);
            }}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg shadow-purple-900/40 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Watch Trailer</span>
          </button>

          <button
            onClick={() => onClick(item)}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl flex items-center space-x-1.5 active:scale-95 transition-all"
          >
            <Info className="w-4 h-4" />
            <span>Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
