import React, { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck, Calendar, Film, Play, Share2, Star, Tv, X } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { fetchMediaDetails } from '../services/api';
import { MediaDetail, MediaItem } from '../types/media';

interface MediaDetailModalProps {
  mediaId: string | null;
  onClose: () => void;
  onSelectRecommendation: (item: MediaItem) => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  mediaId,
  onClose,
  onSelectRecommendation
}) => {
  const [detail, setDetail] = useState<MediaDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showTrailerVideo, setShowTrailerVideo] = useState<boolean>(false);
  const { isBookmarked, toggleBookmark } = useWatchlist();

  useEffect(() => {
    if (!mediaId) {
      setDetail(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setShowTrailerVideo(false);

    fetchMediaDetails(mediaId).then((res) => {
      if (isMounted) {
        setDetail(res);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [mediaId]);

  if (!mediaId) return null;

  const item = detail?.item;
  const bookmarked = item ? isBookmarked(item.id) : false;

  const handleShare = () => {
    if (!item) return;
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out ${item.title} on CinePulse! Release Date: ${item.releaseDate || 'Worldwide'}. Rating: ${item.rating}/10`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`Check out ${item.title} on CinePulse! ${window.location.href}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0A0D18] border border-purple-500/20 rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {loading || !detail || !item ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4 text-purple-400 min-h-[300px]">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-400">Loading title details online...</p>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1">
            {/* Header Backdrop */}
            <div className="relative h-48 sm:h-64 bg-slate-900 overflow-hidden">
              {showTrailerVideo && detail.trailerYoutubeKey ? (
                <iframe
                  src={`https://www.youtube.com/embed/${detail.trailerYoutubeKey}?autoplay=1`}
                  title="Trailer"
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <>
                  {item.backdropUrl || item.posterUrl ? (
                    <img
                      src={item.backdropUrl || item.posterUrl!}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      No Image Available
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D18] via-black/40 to-black/60" />

                  {/* Play Trailer Floating Overlay */}
                  {detail.trailerYoutubeKey && (
                    <button
                      onClick={() => setShowTrailerVideo(true)}
                      className="absolute inset-0 flex items-center justify-center group"
                    >
                      <div className="w-14 h-14 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Poster & Main Header Info */}
            <div className="px-4 sm:px-6 pb-6 relative z-10 -mt-16 sm:-mt-20">
              <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-5">
                {/* Poster */}
                <div className="w-28 sm:w-36 aspect-[0.68] rounded-2xl bg-slate-800 overflow-hidden shadow-2xl border-2 border-purple-500/40 flex-shrink-0">
                  {item.posterUrl ? (
                    <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">🎬</div>
                  )}
                </div>

                {/* Title & Stats */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-purple-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                      {item.mediaType}
                    </span>
                    <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded flex items-center space-x-1 border border-white/10">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-white">{item.rating.toFixed(1)}</span>
                      <span className="text-[11px] text-slate-400">({item.voteCount})</span>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {item.title}
                  </h2>

                  {item.originalTitle && item.originalTitle !== item.title && (
                    <p className="text-xs text-slate-400 font-medium">Original: {item.originalTitle}</p>
                  )}

                  {/* Genres */}
                  {item.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.genres.map((g, idx) => (
                        <span key={idx} className="bg-[#232A42] text-slate-300 text-[11px] px-2 py-0.5 rounded-lg border border-slate-700/60">
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Release Date, Showing Date & Digital Availability Highlight (Requested Feature!) */}
              <div className="mt-6 p-4 rounded-2xl bg-[#13182A] border border-purple-500/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Release / Showing Date</div>
                    <div className="text-sm font-bold text-slate-100">{detail.theatricalShowingDate || item.releaseDate || 'Worldwide'}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Status & Format</div>
                    <div className="text-sm font-bold text-slate-100">
                      {item.status || 'Released'} {item.runtimeOrEpisodes ? `• ${item.runtimeOrEpisodes}` : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital Availability & Streaming Providers */}
              {detail.watchProviders.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <span>🌐 Digital Availability & Where to Watch</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {detail.watchProviders.map((provider, idx) => (
                      <div
                        key={idx}
                        className="bg-[#1E253B] border border-purple-500/30 px-3 py-1.5 rounded-xl flex items-center space-x-2 shadow-sm"
                      >
                        {provider.logoUrl && (
                          <img src={provider.logoUrl} alt={provider.name} className="w-5 h-5 rounded-full object-cover" />
                        )}
                        <div>
                          <div className="text-xs font-bold text-slate-100">{provider.name}</div>
                          <div className="text-[10px] text-cyan-400 font-semibold">{provider.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-5 flex items-center space-x-3">
                <button
                  onClick={() => {
                    if (detail.trailerYoutubeKey) {
                      setShowTrailerVideo(true);
                    } else {
                      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(item.title + ' trailer')}`, '_blank');
                    }
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-purple-900/30 active:scale-95 transition-all text-sm"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Trailer</span>
                </button>

                <button
                  onClick={() => toggleBookmark(item)}
                  className={`py-2.5 px-4 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all ${
                    bookmarked
                      ? 'bg-purple-900/60 text-purple-300 border border-purple-500/50'
                      : 'bg-[#1E253B] text-slate-200 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {bookmarked ? <BookmarkCheck className="w-4 h-4 text-purple-400" /> : <Bookmark className="w-4 h-4" />}
                  <span>{bookmarked ? 'Saved' : 'Watchlist'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-[#1E253B] text-slate-300 hover:text-white border border-slate-700/60"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Overview */}
              <div className="mt-6 space-y-2">
                <h4 className="text-sm font-bold text-slate-200">Synopsis</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.overview}</p>
              </div>

              {/* Cast Members */}
              {detail.cast.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h4 className="text-sm font-bold text-slate-200">Top Cast & Crew</h4>
                  <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
                    {detail.cast.map((c) => (
                      <div key={c.id} className="flex-shrink-0 w-20 text-center space-y-1">
                        <div className="w-16 h-16 rounded-full bg-slate-800 overflow-hidden mx-auto border border-purple-500/30 shadow-md">
                          {c.profileUrl ? (
                            <img src={c.profileUrl} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-bold">
                              {c.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="text-[11px] font-bold text-slate-200 truncate">{c.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{c.character}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {detail.recommendations.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h4 className="text-sm font-bold text-slate-200">More Like This</h4>
                  <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
                    {detail.recommendations.map((rec) => (
                      <div
                        key={rec.id}
                        onClick={() => onSelectRecommendation(rec)}
                        className="flex-shrink-0 w-28 bg-[#13182A] hover:bg-[#1E253B] rounded-xl overflow-hidden cursor-pointer border border-slate-800 p-1.5 transition-all"
                      >
                        <div className="aspect-[0.68] rounded-lg bg-slate-800 overflow-hidden mb-1">
                          {rec.posterUrl && <img src={rec.posterUrl} alt={rec.title} className="w-full h-full object-cover" />}
                        </div>
                        <div className="text-[11px] font-bold text-slate-200 truncate">{rec.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
