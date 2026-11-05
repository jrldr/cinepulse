import React, { useEffect, useState } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { MediaCard } from '../components/MediaCard';
import { SpotlightHero } from '../components/SpotlightHero';
import {
  fetchAnimePicks,
  fetchLatestReleases,
  fetchPopular,
  fetchTopRated,
  fetchTrending
} from '../services/api';
import { MediaCategory, MediaItem, MediaType } from '../types/media';

interface HomeViewProps {
  onSelectMedia: (item: MediaItem) => void;
  onWatchTrailer: (item: MediaItem) => void;
  onSeeAllCategory: (mediaType: MediaType, category: MediaCategory) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectMedia,
  onWatchTrailer,
  onSeeAllCategory
}) => {
  const [spotlight, setSpotlight] = useState<MediaItem[]>([]);
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [latest, setLatest] = useState<MediaItem[]>([]);
  const [topRated, setTopRated] = useState<MediaItem[]>([]);
  const [anime, setAnime] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<MediaCategory>('TRENDING');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetchTrending(1),
      fetchLatestReleases(1),
      fetchTopRated(1),
      fetchAnimePicks(1)
    ]).then(([tData, lData, rData, aData]) => {
      if (isMounted) {
        setTrending(tData);
        setLatest(lData);
        setTopRated(rData);
        setAnime(aData);
        setSpotlight(tData.slice(0, 5));
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories: { id: MediaCategory; label: string }[] = [
    { id: 'TRENDING', label: '🔥 Trending' },
    { id: 'LATEST', label: '🍿 Latest & In Theaters' },
    { id: 'MOST_REVIEWED', label: '⭐ Top Rated' },
    { id: 'POPULAR', label: '🌟 Popular' },
    { id: 'UPCOMING', label: '🎬 Upcoming' }
  ];

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center space-y-3 text-purple-400 min-h-[400px]">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Fetching worldwide movies, series & anime online...</p>
      </div>
    );
  }

  const heroItem = spotlight[0] || trending[0];

  return (
    <div className="space-y-8 pb-20">
      {/* Category Pills Header */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategoryFilter(cat.id);
              onSeeAllCategory('ALL', cat.id);
            }}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeCategoryFilter === cat.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                : 'bg-[#13182A] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Hero Spotlight */}
      {heroItem && (
        <SpotlightHero
          item={heroItem}
          onClick={onSelectMedia}
          onWatchTrailer={onWatchTrailer}
        />
      )}

      {/* 🔥 Trending Worldwide Section */}
      {trending.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white flex items-center space-x-2">
                <span>🔥 Trending Worldwide</span>
              </h2>
              <p className="text-xs text-slate-400">Most popular across movies & TV series right now</p>
            </div>
            <button
              onClick={() => onSeeAllCategory('ALL', 'TRENDING')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center space-x-0.5"
            >
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {trending.slice(0, 6).map((item) => (
              <MediaCard key={item.id} item={item} onClick={onSelectMedia} />
            ))}
          </div>
        </section>
      )}

      {/* 🍿 In Theaters & Latest Releases */}
      {latest.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white flex items-center space-x-2">
                <span>🍿 In Theaters & Latest Releases</span>
              </h2>
              <p className="text-xs text-slate-400">Fresh theatrical showings & digital airings</p>
            </div>
            <button
              onClick={() => onSeeAllCategory('MOVIE', 'LATEST')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center space-x-0.5"
            >
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {latest.slice(0, 6).map((item) => (
              <MediaCard key={item.id} item={item} onClick={onSelectMedia} />
            ))}
          </div>
        </section>
      )}

      {/* ⭐ Top Rated & Most Reviewed */}
      {topRated.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white flex items-center space-x-2">
                <span>⭐ Most Reviewed & Top Rated</span>
              </h2>
              <p className="text-xs text-slate-400">Critically acclaimed worldwide titles</p>
            </div>
            <button
              onClick={() => onSeeAllCategory('ALL', 'MOST_REVIEWED')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center space-x-0.5"
            >
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {topRated.slice(0, 6).map((item) => (
              <MediaCard key={item.id} item={item} onClick={onSelectMedia} />
            ))}
          </div>
        </section>
      )}

      {/* ⛩️ Worldwide Anime Hot Picks */}
      {anime.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white flex items-center space-x-2">
                <span>⛩️ Worldwide Anime Hot List</span>
              </h2>
              <p className="text-xs text-slate-400">Top Japanese anime series & movies online</p>
            </div>
            <button
              onClick={() => onSeeAllCategory('ANIME', 'POPULAR')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center space-x-0.5"
            >
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {anime.slice(0, 6).map((item) => (
              <MediaCard key={item.id} item={item} onClick={onSelectMedia} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
