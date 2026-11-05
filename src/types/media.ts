export type MediaType = 'ALL' | 'MOVIE' | 'TV' | 'ANIME';

export type MediaCategory = 'TRENDING' | 'LATEST' | 'MOST_REVIEWED' | 'POPULAR' | 'UPCOMING';

export interface MediaItem {
  id: string; // e.g. "movie_1234"
  originalId: number;
  title: string;
  originalTitle?: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  mediaType: 'MOVIE' | 'TV' | 'ANIME';
  rating: number;
  voteCount: number;
  releaseDate: string | null; // Showing date / release date
  status?: string;
  genres: string[];
  runtimeOrEpisodes?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
}

export interface WatchProvider {
  id: number;
  name: string;
  logoUrl: string | null;
  type: string; // "Stream", "Rent", "Buy"
}

export interface MediaDetail {
  item: MediaItem;
  cast: CastMember[];
  watchProviders: WatchProvider[];
  trailerYoutubeKey: string | null;
  recommendations: MediaItem[];
  digitalReleaseDate?: string;
  theatricalShowingDate?: string;
}
