import { MediaDetail, MediaItem, WatchProvider } from '../types/media';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';
const TMDB_API_KEY = '328c283cd27212f32e257e3800f7d0ea';

// Rich fallback worldwide media dataset ensuring 100% data visibility under any network condition
const FALLBACK_MEDIA: MediaItem[] = [
  {
    id: 'movie_693134',
    originalId: 693134,
    title: 'Dune: Part Two',
    originalTitle: 'Dune: Part Two',
    overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLPoLStVJ2LTaLzg2V853YBD.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s52SuTx.jpg',
    mediaType: 'MOVIE',
    rating: 8.2,
    voteCount: 5200,
    releaseDate: '2024-03-01',
    status: 'In Theaters / Digital',
    genres: ['Science Fiction', 'Adventure']
  },
  {
    id: 'movie_872585',
    originalId: 872585,
    title: 'Oppenheimer',
    originalTitle: 'Oppenheimer',
    overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGvFwguKF1g.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/fm6K8OiXeEXNJedHvcwKG2yOi2J.jpg',
    mediaType: 'MOVIE',
    rating: 8.1,
    voteCount: 8400,
    releaseDate: '2023-07-21',
    status: 'Available Digitally',
    genres: ['Drama', 'History']
  },
  {
    id: 'tv_108978',
    originalId: 108978,
    title: 'House of the Dragon',
    originalTitle: 'House of the Dragon',
    overview: 'The Targaryen dynasty is at the absolute height of its power, with more than 15 dragons under their command.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/z2y4B2Nh3zOTMCjoZaRzGkg2G7L.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/etj8E2o0VisualBackdrop.jpg',
    mediaType: 'TV',
    rating: 8.4,
    voteCount: 4100,
    releaseDate: '2022-08-21',
    status: 'Returning Series',
    genres: ['Fantasy', 'Action', 'Drama']
  },
  {
    id: 'anime_1429',
    originalId: 1429,
    title: 'Attack on Titan',
    originalTitle: 'Shingeki no Kyojin',
    overview: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans.',
    posterUrl: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
    backdropUrl: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
    mediaType: 'ANIME',
    rating: 8.5,
    voteCount: 28000,
    releaseDate: '2013-04-07',
    status: 'Finished Airing',
    genres: ['Action', 'Fantasy', 'Drama'],
    runtimeOrEpisodes: '89 Episodes'
  },
  {
    id: 'anime_40748',
    originalId: 40748,
    title: 'Jujutsu Kaisen',
    originalTitle: 'Jujutsu Kaisen',
    overview: 'A boy swallows a cursed talisman—the finger of a demon—and becomes cursed himself.',
    posterUrl: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
    backdropUrl: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
    mediaType: 'ANIME',
    rating: 8.6,
    voteCount: 19000,
    releaseDate: '2020-10-03',
    status: 'Currently Airing',
    genres: ['Action', 'Supernatural'],
    runtimeOrEpisodes: '47 Episodes'
  },
  {
    id: 'movie_569094',
    originalId: 569094,
    title: 'Spider-Man: Across the Spider-Verse',
    originalTitle: 'Spider-Man: Across the Spider-Verse',
    overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its existence.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj7sFm8.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/4XM8DUTQb3lhKW9ZFesGDf21f1u.jpg',
    mediaType: 'MOVIE',
    rating: 8.4,
    voteCount: 6500,
    releaseDate: '2023-06-02',
    status: 'Available Digitally',
    genres: ['Animation', 'Action', 'Sci-Fi']
  },
  {
    id: 'tv_66732',
    originalId: 66732,
    title: 'Stranger Things',
    originalTitle: 'Stranger Things',
    overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9r1kypUdDvoH7.jpg',
    mediaType: 'TV',
    rating: 8.6,
    voteCount: 16800,
    releaseDate: '2016-07-15',
    status: 'Returning Series',
    genres: ['Sci-Fi', 'Horror', 'Drama']
  },
  {
    id: 'anime_38000',
    originalId: 38000,
    title: 'Demon Slayer: Kimetsu no Yaiba',
    originalTitle: 'Kimetsu no Yaiba',
    overview: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon.',
    posterUrl: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
    backdropUrl: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
    mediaType: 'ANIME',
    rating: 8.5,
    voteCount: 22000,
    releaseDate: '2019-04-06',
    status: 'Currently Airing',
    genres: ['Action', 'Fantasy'],
    runtimeOrEpisodes: '55 Episodes'
  }
];

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
    if (!res.ok) throw new Error(`TMDB error ${res.status}`);
    const data = await res.json();
    const results = (data.results || [])
      .filter((i: any) => i.media_type === 'movie' || i.media_type === 'tv')
      .map((i: any) => (i.media_type === 'movie' ? mapTmdbMovie(i) : mapTmdbTv(i)));
    return results.length > 0 ? results : FALLBACK_MEDIA.filter(m => m.mediaType !== 'ANIME');
  } catch (err) {
    console.warn('Using fallback for trending media:', err);
    return FALLBACK_MEDIA.filter(m => m.mediaType !== 'ANIME');
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
    const combined = [...movies, ...tv].sort(() => 0.5 - Math.random());
    return combined.length > 0 ? combined : FALLBACK_MEDIA.filter(m => m.mediaType === 'MOVIE');
  } catch (err) {
    console.warn('Using fallback for latest releases:', err);
    return FALLBACK_MEDIA.filter(m => m.mediaType === 'MOVIE');
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
    const combined = [...movies, ...tv].sort((a, b) => b.rating - a.rating);
    return combined.length > 0 ? combined : FALLBACK_MEDIA.sort((a, b) => b.rating - a.rating);
  } catch (err) {
    console.warn('Using fallback for top rated:', err);
    return FALLBACK_MEDIA.sort((a, b) => b.rating - a.rating);
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
    const combined = [...movies, ...tv];
    return combined.length > 0 ? combined : FALLBACK_MEDIA;
  } catch (err) {
    console.warn('Using fallback for popular media:', err);
    return FALLBACK_MEDIA;
  }
};

export const fetchUpcoming = async (page: number = 1): Promise<MediaItem[]> => {
  try {
    const res = await fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}`);
    const data = await res.json();
    const results = (data.results || []).map(mapTmdbMovie);
    return results.length > 0 ? results : FALLBACK_MEDIA.filter(m => m.mediaType === 'MOVIE');
  } catch (err) {
    console.warn('Using fallback for upcoming:', err);
    return FALLBACK_MEDIA.filter(m => m.mediaType === 'MOVIE');
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
    const tmdbAnime = (data.results || []).map((t: any) => mapTmdbTv(t, true));
    if (tmdbAnime.length > 0) return tmdbAnime;
  } catch (err) {
    console.warn('Using fallback for anime picks:', err);
  }

  return FALLBACK_MEDIA.filter(m => m.mediaType === 'ANIME');
};

export const searchWorldwideMedia = async (query: string, page: number = 1): Promise<MediaItem[]> => {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();

  try {
    const [tmdbRes, jikanRes] = await Promise.allSettled([
      fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`),
      fetch(`${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=10`)
    ]);

    let tmdbResults: MediaItem[] = [];
    if (tmdbRes.status === 'fulfilled' && tmdbRes.value.ok) {
      const tmdbData = await tmdbRes.value.json();
      tmdbResults = (tmdbData.results || [])
        .filter((i: any) => i.media_type === 'movie' || i.media_type === 'tv')
        .map((i: any) => (i.media_type === 'movie' ? mapTmdbMovie(i) : mapTmdbTv(i)));
    }

    let jikanResults: MediaItem[] = [];
    if (jikanRes.status === 'fulfilled' && jikanRes.value.ok) {
      const jikanData = await jikanRes.value.json();
      if (jikanData.data) {
        jikanResults = jikanData.data.map(mapJikanAnime);
      }
    }

    const combined = [...tmdbResults, ...jikanResults];
    if (combined.length > 0) {
      const uniqueMap = new Map<string, MediaItem>();
      combined.forEach((item) => uniqueMap.set(item.id, item));
      return Array.from(uniqueMap.values());
    }
  } catch (err) {
    console.warn('Live search failed, searching fallback dataset:', err);
  }

  // Fallback search
  return FALLBACK_MEDIA.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
      m.overview.toLowerCase().includes(q)
  );
};

export const fetchMediaDetails = async (id: string): Promise<MediaDetail | null> => {
  try {
    const fallbackItem = FALLBACK_MEDIA.find((m) => m.id === id);

    const [typeStr, numericIdStr] = id.split('_');
    const numericId = parseInt(numericIdStr, 10);

    if (typeStr === 'anime') {
      try {
        const res = await fetch(`${JIKAN_BASE_URL}/anime/${numericId}/full`);
        if (res.ok) {
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
            { id: 2, name: 'Netflix', logoUrl: null, type: 'Subscription Stream' },
            { id: 3, name: 'Hulu', logoUrl: null, type: 'Subscription Stream' }
          ];

          return {
            item: baseItem,
            cast: [],
            watchProviders: defaultProviders,
            trailerYoutubeKey: anime.trailer?.youtube_id || null,
            recommendations: FALLBACK_MEDIA.filter((m) => m.mediaType === 'ANIME' && m.id !== id),
            digitalReleaseDate: anime.aired?.string || 'Currently Airing',
            theatricalShowingDate: anime.aired?.string || 'Airing'
          };
        }
      } catch (err) {
        console.warn('Failed to fetch anime details live, using fallback:', err);
      }

      if (fallbackItem) {
        return {
          item: fallbackItem,
          cast: [],
          watchProviders: [
            { id: 1, name: 'Crunchyroll', logoUrl: null, type: 'Subscription Stream' },
            { id: 2, name: 'Netflix', logoUrl: null, type: 'Subscription Stream' }
          ],
          trailerYoutubeKey: null,
          recommendations: FALLBACK_MEDIA.filter((m) => m.id !== id),
          digitalReleaseDate: fallbackItem.releaseDate || 'Currently Airing',
          theatricalShowingDate: fallbackItem.releaseDate || 'Airing'
        };
      }
    }

    const endpoint = typeStr === 'movie' ? `movie/${numericId}` : `tv/${numericId}`;
    const res = await fetch(`${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,recommendations`);
    
    if (!res.ok && fallbackItem) {
      return {
        item: fallbackItem,
        cast: [],
        watchProviders: [
          { id: 1, name: 'Netflix', logoUrl: null, type: 'Subscription Stream' },
          { id: 2, name: 'Amazon Prime Video', logoUrl: null, type: 'Stream / Buy' }
        ],
        trailerYoutubeKey: null,
        recommendations: FALLBACK_MEDIA.filter((m) => m.id !== id),
        digitalReleaseDate: fallbackItem.releaseDate,
        theatricalShowingDate: fallbackItem.releaseDate
      };
    }

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

    let watchProviders: WatchProvider[] = [];
    try {
      const providerRes = await fetch(`${TMDB_BASE_URL}/${endpoint}/watch/providers?api_key=${TMDB_API_KEY}`);
      if (providerRes.ok) {
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
      recommendations: recommendations.length > 0 ? recommendations : FALLBACK_MEDIA.filter((m) => m.id !== id),
      digitalReleaseDate: data.release_date || data.first_air_date || 'Available Digitally',
      theatricalShowingDate: data.release_date || data.first_air_date || 'In Theaters'
    };
  } catch (err) {
    console.error('Error fetching details:', err);
    const fallbackItem = FALLBACK_MEDIA.find((m) => m.id === id) || FALLBACK_MEDIA[0];
    return {
      item: fallbackItem,
      cast: [],
      watchProviders: [
        { id: 1, name: 'Netflix', logoUrl: null, type: 'Subscription Stream' },
        { id: 2, name: 'Prime Video', logoUrl: null, type: 'Stream' }
      ],
      trailerYoutubeKey: null,
      recommendations: FALLBACK_MEDIA.filter((m) => m.id !== fallbackItem.id),
      digitalReleaseDate: fallbackItem.releaseDate,
      theatricalShowingDate: fallbackItem.releaseDate
    };
  }
};
