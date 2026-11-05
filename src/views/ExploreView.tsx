import React, { useEffect, useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { MediaCard } from '../components/MediaCard';
import {
  fetchAnimePicks,
  fetchLatestReleases,
  fetchPopular,
  fetchTopRated,
  fetchTrending,
  fetchUpcoming,
  searchWorldwideMedia
} from '../services/api';
import { MediaCategory, MediaItem, MediaType } from '../types/media';

interface ExploreViewProps {
  initialType?: MediaType;
  initialCategory?: MediaCategory;
  onSelectMedia: (item: MediaItem) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  initialType = 'ALL',
  initialCategory = 'TRENDING',
  onSelectMedia
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<MediaType>(initialType);
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory>(initialCategory);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Debounced Search or Category Fetch
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        searchWorldwideMedia(searchQuery).then((res) => {
          if (isMounted) {
            let filtered = res;
            if (selectedType !== 'ALL') {
              filtered = res.filter((i) => i.mediaType === selectedType);
            }
            setItems(filtered);
            setLoading(false);
          }
        });
      } else {
        // Fetch by category / type
        let fetcher: Promise<MediaItem[]>;
        if (selectedType === 'ANIME') {
          fetcher = fetchAnimePicks();
        } else {
          switch (selectedCategory) {
            case 'LATEST':
              fetcher = fetchLatestReleases();
              break;
            case 'MOST_REVIEWED':
              fetcher = fetchTopRated();
              break;
            case 'POPULAR':
              fetcher = fetchPopular();
              break;
            case 'UPCOMING':
              fetcher = fetchUpcoming();
              break;
            default:
              fetcher = fetchTrending();
              break;
          }
        }

        fetcher.then((res) => {
          if (isMounted) {
            let filtered = res;
            if (selectedType !== 'ALL' && selectedType !== 'ANIME') {
              filtered = res.filter((i) => i.mediaType === selectedType);
            }
            setItems(filtered);
            setLoading(false);
          }
        });
      }
    }, searchQuery ? 300 : 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedType, selectedCategory]);

  const mediaTypes: { id: MediaType; label: string }[] = [
    { id: 'ALL', label: 'All Worldwide' },
    { id: 'MOVIE', label: 'Movies' },
    { id: 'TV', label: 'TV Series' },
    { id: 'ANIME', label: 'Anime' }
  ];

  const categories: { id: MediaCategory; label: string }[] = [
    { id: 'TRENDING', label: '🔥 Trending' },
    { id: 'LATEST', label: '🍿 Latest & In Theaters' },
    { id: 'MOST_REVIEWED', label: '⭐ Top Rated' },
    { id: 'POPULAR', label: '🌟 Popular' },
    { id: 'UPCOMING', label: '🎬 Upcoming' }
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Search Input Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-purple-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search movies, TV series, anime worldwide..."
          className="w-full bg-[#13182A] text-white placeholder-slate-400 text-sm font-medium pl-11 pr-10 py-3.5 rounded-2xl border border-purple-500/30 focus:outline-none focus:border-purple-500 shadow-xl"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Media Type Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5 text-purple-400" />
          <span>Type:</span>
        </span>
        {mediaTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedType === type.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-[#13182A] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Category Filters (when not actively searching) */}
      {!searchQuery && selectedType !== 'ANIME' && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Sort:</span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-[#1E253B] text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-sm font-bold text-slate-300">
          {searchQuery ? `Search results for "${searchQuery}"` : `Showing ${selectedType} • ${selectedCategory}`}
        </h2>
        <span className="text-xs text-slate-500 font-medium">{items.length} titles found</span>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center space-y-3 text-purple-400 min-h-[300px]">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Searching online media catalog...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-[#13182A] rounded-2xl border border-slate-800">
          <p className="text-base font-bold text-slate-200">No media titles found</p>
          <p className="text-xs mt-1">Try searching with a different keyword or filter category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} onClick={onSelectMedia} />
          ))}
        </div>
      )}
    </div>
  );
};
