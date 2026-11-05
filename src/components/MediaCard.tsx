import React from 'react';
import { Bookmark, BookmarkCheck, Star } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { MediaItem } from '../types/media';

interface MediaCardProps {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onClick }) => {
  const { isBookmarked, toggleBookmark } = useWatchlist();
  const bookmarked = isBookmarked(item.id);

  const year = item.releaseDate ? item.releaseDate.substring(0, 4) : 'Worldwide';

  const typeColor =
    item.mediaType === 'MOVIE'
      ? 'bg-purple-600 text-white'
      : item.mediaType === 'TV'
      ? 'bg-cyan-600 text-white'
      : 'bg-pink-600 text-white';

  const typeLabel =
    item.mediaType === 'MOVIE' ? 'MOVIE' : item.mediaType === 'TV' ? 'TV SHOW' : 'ANIME';

  return (
    <div
      onClick={() => onClick(item)}
      className="group relative bg-[#13182A] hover:bg-[#1E253B] border border-slate-800/80 hover:border-purple-500/50 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-purple-900/20 transition-all duration-200 flex flex-col"
    >
      {/* Poster Container */}
      <div className="relative aspect-[0.68] bg-[#1E253B] overflow-hidden">
        {item.posterUrl ? (
          <img
            src={item.posterUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-slate-500">
            <span className="text-3xl mb-1">🎬</span>
            <span className="text-xs text-center line-clamp-2">{item.title}</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Rating Badge */}
        <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 flex items-center space-x-1 shadow">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-white">{item.rating.toFixed(1)}</span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(item);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all shadow ${
            bookmarked ? 'bg-purple-600 text-white' : 'bg-black/60 text-slate-300 hover:text-white'
          }`}
          title={bookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          {bookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>

        {/* Type Tag */}
        <div className="absolute bottom-2 left-2">
          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wide ${typeColor}`}>
            {typeLabel}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <h3 className="text-xs font-bold text-slate-100 group-hover:text-purple-400 line-clamp-1 transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
          <span>{year}</span>
          {item.voteCount > 0 && <span>{item.voteCount.toLocaleString()} votes</span>}
        </div>
      </div>
    </div>
  );
};
