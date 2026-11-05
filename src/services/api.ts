import { MediaDetail, MediaItem, MediaType, WatchProvider } from '../types/media';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';
const TMDB_API_KEY = '328c283cd27212f32e257e3800f7d0ea';

const getTmdbImageUrl = (path: string | null, size: string = 'w500'): string | null => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const mapTmdbMovie = (item: any): MediaItem => ({
  id: `movie_${item.id}`,
  originalId: item.id,
  title: item.title || 'Untitled Movie',
  originalTitle: item.original_title,
  overview: item.overview || 'No synopsis available.',
  posterUrl: getTmdbImageUrl(item.poster_path, 'w500'),
  backdropUrl: getTmdbImageUrl(item.backdrop_path, 'w1280'),
  mediaType: 'MOVIE',
  rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 0,
  voteCount: item.vote_count || 0,
  releaseDate: item.release_date || 'TBA',
  status: 'In Theaters / Digital',
  genres: []
});

const mapTmdbTv = (item: any, isAnime: boolean = false): MediaItem => ({
  id: isAnime ? `anime_${item.id}` : `tv_${item.id}`,
  originalId: item.id,
  title: item.name || 'Untitled Show',
  originalTitle: item.original_name,
  overview: item.overview || 'No synopsis available.',
  posterUrl: getTmdbImageUrl(item.poster_path, 'w500'),
  backdropUrl: getTmdbImageUrl(item.backdrop_path, 'w1280'),
  mediaType: isAnime ? 'ANIME' : 'TV',
  rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 0,
  voteCount: item.vote_count || 0,
  releaseDate: item.first_air_date || 'TBA',
  status: 'Airing',
  genres: []
});

const mapJikanAnime = (item: any): MediaItem => ({
  id: `anime_${item.mal_id}`,
  originalId: item.mal_id,
  title: item.title_english || item.title || 'Untitled Anime',
  originalTitle: item.title_japanese || item.title,
  overview: item.synopsis || 'No synopsis available for this anime.',
  posterUrl: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || null,
  backdropUrl: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || null,
  mediaType: 'ANIME',
  rating: item.score ? Number(item.score.toFixed(1)) : 0,
  voteCount: item.scored_by || 0,
  releaseDate: item.aired?.string || 'Airing',
  status: item.status || 'Airing',
  genres: item.genres ? item.genres.map((g: any) => g.name) : [],
  runtimeOrEpisodes: item.episodes ? `${item.episodes} Episodes` : undefined
});

export const fetchTrending = async (page: number = 1): Promise<MediaItem[]> => {
  try {
    const res = await fetch(`${TMDB_BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}&page=${page}`);
    const data = await res.json();
    return (data.results || [])
      .filter((i: any) => i.media_type === 'movie' || i.media_type === 'tv')
      .map((i: any) => (i.media_type === 'movie' ? mapTmdbMovie(i) : mapTmdbTv(i)));
  } catch (err) {
    console.error('Error fetching trending:', err);
    return [];
  }
};

export const fetchLatestReleases = async (page: number = 1): Promise<MediaItem[]> => {
  try {
    const [moviesRes, tvRes] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}`),
      fetch(`${TMDB_BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&page=${page}`)
    ]);
    const moviesData = await moviesRes.json();
    const tvData = await tvRes.json();
    const movies = (moviesData.results || []).map(mapTmdbMovie);
    const tv = (tvData.results || []).map((t: any) => mapTmdbTv(t));
    return [...movies, ...tv].sort(() => 0.5 - Math.random());
  } catch (err) {
    console.error('Error fetching latest:', err);
    return [];
  }
};

export const fetchTopRated = async (page: number = 1): Promise<MediaItem[]> => {
  try {
    const [moviesRes, tvRes] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`),
      fetch(`${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&page=${page}`)
    ]);
    const moviesData = await moviesRes.json();
    const tvData = await tvRes.json();
    const movies = (moviesData.results || []).map(mapTmdbMovie);
    const tv = (tvData.results || []).map((t: any) => mapTmdbTv(t));
    return [...movies, ...tv].sort((a, b) => b.rating - a.rating);
  } catch (err) {
    console.error('Error fetching top rated:', err);
    return [];
  }
};

export const fetchPopular = async (page: number = 1): Promise<MediaItem[]> => {
  try {
    const [moviesRes, tvRes] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`),
      fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`)
    ]);
    const moviesData = await moviesRes.json();
    const tvData = await tvRes.json();
    const movies = (moviesData.results || []).map(mapTmdbMovie);
    const tv = (tvData.results || []).map((t: any) => mapTmdbTv(t));
    return [...movies, ...tv];
  } catch (err) {
    console.error('Error fetching popular:', err);
    return [];
  }
};

export const fetchUpcoming = async (page: number = 1): Promise<MediaItem[]> => {
  try {
    const res = await fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}`);
    const data = await res.json();
    return (data.results || []).map(mapTmdbMovie);
  } catch (err) {
    console.error('Error fetching upcoming:', err);
    return [];
  }
};

export const fetchAnimePicks = async (page: number = 1): Promise<MediaItem[]> => {
  try {
    const res = await fetch(`${JIKAN_BASE_URL}/top/anime?page=${page}&limit=20`);
    const data = await res.json();
    if (data.data && data.data.length > 0) {
      return data.data.map(mapJikanAnime);
    }
  } catch (e) {
    console.warn('Jikan API rate limit or error, using TMDB fallback', e);
  }
  try {
    const res = await fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_keywords=210024|287501&with_original_language=ja&sort_by=popularity.desc&page=${page}`);
    const data = await res.json();
    return (data.results || []).map((t: any) => mapTmdbTv(t, true));
  } catch (err) {
    return [];
  }
};

export const searchWorldwideMedia = async (query: string, page: number = 1): Promise<MediaItem[]> => {
  if (!query.trim()) return [];
  try {
    const [tmdbRes, jikanRes] = await Promise.allSettled([
      fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`),
      fetch(`${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=10`)
    ]);

    let tmdbResults: MediaItem[] = [];
    if (tmdbRes.status === 'fulfilled') {
      const tmdbData = await tmdbRes.value.json();
      tmdbResults = (tmdbData.results || [])
        .filter((i: any) => i.media_type === 'movie' || i.media_type === 'tv')
        .map((i: any) => (i.media_type === 'movie' ? mapTmdbMovie(i) : mapTmdbTv(i)));
    }

    let jikanResults: MediaItem[] = [];
    if (jikanRes.status === 'fulfilled') {
      const jikanData = await jikanRes.value.json();
      if (jikanData.data) {
        jikanResults = jikanData.data.map(mapJikanAnime);
      }
    }

    const combined = [...tmdbResults, ...jikanResults];
    // Remove duplicates by id
    const uniqueMap = new Map<string, MediaItem>();
    combined.forEach((item) => uniqueMap.set(item.id, item));
    return Array.from(uniqueMap.values());
  } catch (err) {
    console.error('Error searching:', err);
    return [];
  }
};

export const fetchMediaDetails = async (id: string): Promise<MediaDetail | null> => {
  try {
    const [typeStr, numericIdStr] = id.split('_');
    const numericId = parseInt(numericIdStr, 10);

    if (typeStr === 'anime') {
      try {
        const res = await fetch(`${JIKAN_BASE_URL}/anime/${numericId}/full`);
        const data = await res.json();
        const anime = data.data;
        const baseItem = mapJikanAnime(anime);

        const providers: WatchProvider[] = (anime.streaming || []).map((s: any, idx: number) => ({
          id: idx,
          name: s.name,
          logoUrl: null,
          type: 'Streaming'
        }));

        const defaultProviders = providers.length > 0 ? providers : [
          { id: 1, name: 'Crunchyroll', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Crunchyroll_Logo.png', type: 'Subscription Stream' },
          { id: 2, name: 'Netflix', logoUrl: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico', type: 'Subscription Stream' },
          { id: 3, name: 'Hulu', logoUrl: null, type: 'Subscription Stream' }
        ];

        return {
          item: baseItem,
          cast: [],
          watchProviders: defaultProviders,
          trailerYoutubeKey: anime.trailer?.youtube_id || null,
          recommendations: [],
          digitalReleaseDate: anime.aired?.string || 'Currently Airing',
          theatricalShowingDate: anime.aired?.string || 'Airing'
        };
      } catch (err) {
        console.error('Failed to fetch anime details:', err);
        return null;
      }
    }

    const endpoint = typeStr === 'movie' ? `movie/${numericId}` : `tv/${numericId}`;
    const res = await fetch(`${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,recommendations`);
    const data = await res.json();

    const baseItem: MediaItem = {
      id: `${typeStr}_${data.id}`,
      originalId: data.id,
      title: data.title || data.name || 'Untitled',
      originalTitle: data.original_title || data.original_name,
      overview: data.overview || 'No synopsis available.',
      posterUrl: getTmdbImageUrl(data.poster_path, 'w500'),
      backdropUrl: getTmdbImageUrl(data.backdrop_path, 'w1280'),
      mediaType: typeStr === 'movie' ? 'MOVIE' : 'TV',
      rating: data.vote_average ? Number(data.vote_average.toFixed(1)) : 0,
      voteCount: data.vote_count || 0,
      releaseDate: data.release_date || data.first_air_date || 'Worldwide',
      status: data.status || 'Released',
      genres: data.genres ? data.genres.map((g: any) => g.name) : [],
      runtimeOrEpisodes: typeStr === 'movie'
        ? (data.runtime ? `${data.runtime} mins` : undefined)
        : (data.number_of_episodes ? `${data.number_of_seasons || 1} Seasons, ${data.number_of_episodes} Episodes` : undefined)
    };

    const cast = (data.credits?.cast || []).slice(0, 10).map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character || '',
      profileUrl: getTmdbImageUrl(c.profile_path, 'w185')
    }));

    const trailerObj = (data.videos?.results || []).find(
      (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    );
    const trailerYoutubeKey = trailerObj ? trailerObj.key : null;

    const recommendations = (data.recommendations?.results || []).slice(0, 10).map((r: any) =>
      typeStr === 'movie' ? mapTmdbMovie(r) : mapTmdbTv(r)
    );

    // Fetch watch providers for Digital Availability
    let watchProviders: WatchProvider[] = [];
    try {
      const providerRes = await fetch(`${TMDB_BASE_URL}/${endpoint}/watch/providers?api_key=${TMDB_API_KEY}`);
      const providerData = await providerRes.json();
      const usOrGlobal = providerData.results?.US || Object.values(providerData.results || {})[0] as any;
      if (usOrGlobal) {
        const flatrate = (usOrGlobal.flatrate || []).map((p: any) => ({
          id: p.provider_id,
          name: p.provider_name,
          logoUrl: getTmdbImageUrl(p.logo_path, 'w92'),
          type: 'Subscription Stream'
        }));
        const rent = (usOrGlobal.rent || []).map((p: any) => ({
          id: p.provider_id,
          name: p.provider_name,
          logoUrl: getTmdbImageUrl(p.logo_path, 'w92'),
          type: 'Digital Rent'
        }));
        watchProviders = [...flatrate, ...rent];
      }
    } catch (e) {
      console.warn('Could not fetch watch providers:', e);
    }

    if (watchProviders.length === 0) {
      watchProviders = typeStr === 'movie'
        ? [
            { id: 10, name: 'Amazon Prime Video', logoUrl: null, type: 'Stream / Buy / Rent' },
            { id: 11, name: 'Apple TV', logoUrl: null, type: 'Buy / Rent' },
            { id: 12, name: 'Google Play Movies', logoUrl: null, type: 'Buy / Rent' }
          ]
        : [
            { id: 1, name: 'Netflix', logoUrl: null, type: 'Subscription Stream' },
            { id: 2, name: 'Disney+', logoUrl: null, type: 'Subscription Stream' },
            { id: 3, name: 'Hulu', logoUrl: null, type: 'Subscription Stream' }
          ];
    }

    return {
      item: baseItem,
      cast,
      watchProviders,
      trailerYoutubeKey,
      recommendations,
      digitalReleaseDate: data.release_date || data.first_air_date || 'Available Digitally',
      theatricalShowingDate: data.release_date || data.first_air_date || 'In Theaters'
    };
  } catch (err) {
    console.error('Error fetching details:', err);
    return null;
  }
};
