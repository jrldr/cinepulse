import { MediaDetail, MediaItem, WatchProvider } from '../types/media';

const TVMAZE_BASE_URL = 'https://api.tvmaze.com';

// Cache in-memory during session so page toggles are instant
let inMemoryShows: MediaItem[] = [];

// Helper to strip HTML tags from summaries
const stripHtml = (html: string | null | undefined): string => {
  if (!html) return 'No synopsis available.';
  return html.replace(/<[^>]*>?/gm, '').trim();
};

// Map real TVMaze show object to MediaItem
const mapTvMazeShow = (show: any): MediaItem => {
  const isAnime =
    show.genres?.includes('Anime') ||
    (show.type === 'Animation' && show.language === 'Japanese') ||
    (show.name && /naruto|bleach|titan|demon slayer|jujutsu|dragon ball|one piece|death note|hero academia|evangelion/i.test(show.name));

  const isMovieOrFilm =
    show.type === 'Documentary' ||
    (show.averageRuntime && show.averageRuntime >= 85) ||
    (show.runtime && show.runtime >= 85) ||
    /movie|film|cinema|miniseries/i.test(show.name || '') ||
    (show.summary && /feature film|television film|movie/i.test(show.summary));

  const mediaType: 'MOVIE' | 'TV' | 'ANIME' = isAnime ? 'ANIME' : isMovieOrFilm ? 'MOVIE' : 'TV';

  return {
    id: `show_${show.id}`,
    originalId: show.id,
    title: show.name || 'Untitled',
    originalTitle: show.network?.name || show.webChannel?.name,
    overview: stripHtml(show.summary),
    posterUrl: show.image?.original || show.image?.medium || null,
    backdropUrl: show.image?.original || show.image?.medium || null,
    mediaType,
    rating: show.rating?.average ? Number(show.rating.average.toFixed(1)) : 0,
    voteCount: show.weight ? show.weight * 15 : 120,
    releaseDate: show.premiered || 'Worldwide',
    status: show.status || (show.ended ? 'Ended' : 'Running'),
    genres: show.genres || [],
    runtimeOrEpisodes: show.runtime
      ? `${show.runtime} min`
      : show.averageRuntime
      ? `${show.averageRuntime} min/ep`
      : undefined
  };
};

// Fetch real online shows across multiple pages of TVMaze
export const getAllRealOnlineShows = async (): Promise<MediaItem[]> => {
  if (inMemoryShows.length > 0) return inMemoryShows;

  try {
    const [p0Res, p1Res] = await Promise.all([
      fetch(`${TVMAZE_BASE_URL}/shows?page=0`),
      fetch(`${TVMAZE_BASE_URL}/shows?page=1`)
    ]);

    const [p0, p1] = await Promise.all([p0Res.json(), p1Res.json()]);
    const rawShows = [...(Array.isArray(p0) ? p0 : []), ...(Array.isArray(p1) ? p1 : [])];
    const mapped = rawShows.map(mapTvMazeShow);
    inMemoryShows = mapped;
    return mapped;
  } catch (err) {
    console.error('Failed to load real online shows from TVMaze:', err);
    return [];
  }
};

// 1. Trending Worldwide (Real online titles with highest weight / activity)
export const fetchTrending = async (): Promise<MediaItem[]> => {
  try {
    const shows = await getAllRealOnlineShows();
    return [...shows].sort((a, b) => b.voteCount - a.voteCount);
  } catch (err) {
    console.error('fetchTrending error:', err);
    return [];
  }
};

// 2. Latest & In Theaters / Premiering Online (sorted by premiere date descending)
export const fetchLatestReleases = async (): Promise<MediaItem[]> => {
  try {
    const shows = await getAllRealOnlineShows();
    return [...shows]
      .filter((s) => s.releaseDate && s.releaseDate !== 'Worldwide')
      .sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
  } catch (err) {
    console.error('fetchLatestReleases error:', err);
    return [];
  }
};

// 3. Most Reviewed / Top Rated (sorted by average rating descending)
export const fetchTopRated = async (): Promise<MediaItem[]> => {
  try {
    const shows = await getAllRealOnlineShows();
    return [...shows]
      .filter((s) => s.rating > 0)
      .sort((a, b) => b.rating - a.rating);
  } catch (err) {
    console.error('fetchTopRated error:', err);
    return [];
  }
};

// 4. Popular Worldwide
export const fetchPopular = async (): Promise<MediaItem[]> => {
  try {
    const shows = await getAllRealOnlineShows();
    return [...shows]
      .filter((s) => s.rating >= 7.5)
      .sort((a, b) => b.voteCount - a.voteCount);
  } catch (err) {
    console.error('fetchPopular error:', err);
    return [];
  }
};

// 5. Upcoming Releases
export const fetchUpcoming = async (): Promise<MediaItem[]> => {
  try {
    const shows = await getAllRealOnlineShows();
    const nowStr = new Date().toISOString().slice(0, 10);
    const upcoming = shows.filter((s) => (s.releaseDate || '') >= nowStr || s.status === 'In Development');
    if (upcoming.length > 0) {
      return upcoming;
    }
    // Return newest ongoing releases
    return [...shows]
      .filter((s) => s.status === 'Running')
      .sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
  } catch (err) {
    console.error('fetchUpcoming error:', err);
    return [];
  }
};

// 6. Worldwide Anime Hot Picks (Real online Anime from TVMaze catalog)
export const fetchAnimePicks = async (): Promise<MediaItem[]> => {
  try {
    const shows = await getAllRealOnlineShows();
    const animeList = shows.filter((s) => s.mediaType === 'ANIME');
    if (animeList.length > 0) {
      return [...animeList].sort((a, b) => b.rating - a.rating);
    }

    // Additional query if needed
    const res = await fetch(`${TVMAZE_BASE_URL}/search/shows?q=anime`);
    const data = await res.json();
    return (data || []).map((item: any) => mapTvMazeShow(item.show));
  } catch (err) {
    console.error('fetchAnimePicks error:', err);
    return [];
  }
};

// 7. Real Online Worldwide Search
export const searchWorldwideMedia = async (query: string): Promise<MediaItem[]> => {
  if (!query.trim()) return [];
  try {
    const res = await fetch(`${TVMAZE_BASE_URL}/search/shows?q=${encodeURIComponent(query.trim())}`);
    const data = await res.json();
    return (data || []).map((item: any) => mapTvMazeShow(item.show));
  } catch (err) {
    console.error('searchWorldwideMedia error:', err);
    return [];
  }
};

// 8. Real Online Title Details with Cast, Showing Date, and Digital Availability
export const fetchMediaDetails = async (id: string): Promise<MediaDetail | null> => {
  try {
    const showId = id.replace('show_', '');
    const res = await fetch(`${TVMAZE_BASE_URL}/shows/${showId}?embed[]=cast&embed[]=crew`);
    if (!res.ok) return null;

    const show = await res.json();
    const baseItem = mapTvMazeShow(show);

    // Cast members from real online response
    const rawCast = show._embedded?.cast || [];
    const cast = rawCast.slice(0, 10).map((c: any) => ({
      id: c.person.id,
      name: c.person.name,
      character: c.character?.name || 'Main Cast',
      profileUrl: c.person.image?.medium || c.person.image?.original || null
    }));

    // Real Online Digital Availability & Streaming Providers
    const watchProviders: WatchProvider[] = [];

    if (show.webChannel) {
      watchProviders.push({
        id: show.webChannel.id || 1,
        name: show.webChannel.name,
        logoUrl: null,
        type: 'Digital Streaming'
      });
    }

    if (show.network) {
      watchProviders.push({
        id: show.network.id || 2,
        name: show.network.name,
        logoUrl: null,
        type: 'Broadcast / Cable'
      });
    }

    if (show.officialSite) {
      const siteName = new URL(show.officialSite).hostname.replace('www.', '');
      watchProviders.push({
        id: 99,
        name: `Official Site (${siteName})`,
        logoUrl: null,
        type: 'Official Web Stream'
      });
    }

    if (watchProviders.length === 0) {
      watchProviders.push({
        id: 100,
        name: 'Worldwide Digital Release',
        logoUrl: null,
        type: 'Digital & On-Demand'
      });
    }

    // Related Recommendations from the same genre or network
    const allShows = await getAllRealOnlineShows();
    const primaryGenre = show.genres?.[0];
    const recommendations = allShows
      .filter((s) => s.id !== baseItem.id && (!primaryGenre || s.genres.includes(primaryGenre)))
      .slice(0, 10);

    const showingDate = show.premiered
      ? `${show.premiered} (${show.schedule?.days?.join(', ') || 'Online'})`
      : 'Worldwide Release';

    return {
      item: baseItem,
      cast,
      watchProviders,
      trailerYoutubeKey: null,
      recommendations,
      digitalReleaseDate: show.premiered || 'Available Digitally',
      theatricalShowingDate: showingDate
    };
  } catch (err) {
    console.error('fetchMediaDetails error:', err);
    return null;
  }
};
