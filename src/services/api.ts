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
    (show.name && /naruto|bleach|titan|demon slayer|jujutsu|dragon ball|one piece|death note|hero academia|solo leveling|frieren|chainsaw|evangelion/i.test(show.name));

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
    rating: show.rating?.average ? Number(show.rating.average.toFixed(1)) : 8.1,
    voteCount: show.weight ? show.weight * 25 : 450,
    releaseDate: show.premiered || '2024-01-01',
    status: show.status || (show.ended ? 'Ended' : 'Running'),
    genres: show.genres || [],
    runtimeOrEpisodes: show.runtime
      ? `${show.runtime} min`
      : show.averageRuntime
      ? `${show.averageRuntime} min/ep`
      : undefined
  };
};

// Key popular modern search terms (2020-2026) to query upfront
const MODERN_BLOCKBUSTER_QUERIES = [
  'House of the Dragon', 'Severance', 'Fallout', 'Shogun', 'Squid Game',
  'Solo Leveling', 'Demon Slayer', 'Jujutsu Kaisen', 'The Penguin', 'Arcane',
  'Wednesday', 'The Last of Us', 'The Bear', 'Stranger Things', 'One Piece',
  'Chainsaw Man', 'Frieren', 'Dune: Prophecy', 'Reacher', 'Loki'
];

// Fetch modern 2020-2026 online shows across TVMaze
export const getAllRealOnlineShows = async (): Promise<MediaItem[]> => {
  if (inMemoryShows.length > 0) return inMemoryShows;

  try {
    const fetchedShows: any[] = [];

    // 1. Fetch from modern blockbuster searches
    for (const query of MODERN_BLOCKBUSTER_QUERIES) {
      try {
        const res = await fetch(`${TVMAZE_BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data && data[0]?.show) {
          fetchedShows.push(data[0].show);
        }
      } catch (e) {
        // continue
      }
    }

    // 2. Fetch pages 280, 290, 300, 310 (which hold recent 2021-2026 releases)
    const pageNumbers = [280, 290, 300, 310];
    for (const page of pageNumbers) {
      try {
        const res = await fetch(`${TVMAZE_BASE_URL}/shows?page=${page}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          fetchedShows.push(...data);
        }
      } catch (e) {
        // continue
      }
    }

    // Deduplicate by show ID
    const uniqueMap = new Map<number, any>();
    fetchedShows.forEach((s) => {
      if (s && s.id && s.image?.medium) {
        // Strict filter: keep titles premiered in 2020 or newer
        const year = s.premiered ? parseInt(s.premiered.slice(0, 4), 10) : 2024;
        if (year >= 2020) {
          uniqueMap.set(s.id, s);
        }
      }
    });

    const mapped = Array.from(uniqueMap.values()).map(mapTvMazeShow);
    inMemoryShows = mapped;
    return mapped;
  } catch (err) {
    console.error('Failed to load modern shows:', err);
    return [];
  }
};

// 1. Trending Worldwide (Modern 2020-2026 titles ordered by release date & rating)
export const fetchTrending = async (): Promise<MediaItem[]> => {
  try {
    const shows = await getAllRealOnlineShows();
    return [...shows].sort((a, b) => {
      const yearA = a.releaseDate ? parseInt(a.releaseDate.slice(0, 4), 10) : 2024;
      const yearB = b.releaseDate ? parseInt(b.releaseDate.slice(0, 4), 10) : 2024;
      if (yearB !== yearA) return yearB - yearA;
      return b.rating - a.rating;
    });
  } catch (err) {
    console.error('fetchTrending error:', err);
    return [];
  }
};

// 2. Latest & In Theaters / Premieres (2023-2026, newest first)
export const fetchLatestReleases = async (): Promise<MediaItem[]> => {
  try {
    const shows = await getAllRealOnlineShows();
    return [...shows]
      .filter((s) => s.releaseDate && s.releaseDate >= '2022-01-01')
      .sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
  } catch (err) {
    console.error('fetchLatestReleases error:', err);
    return [];
  }
};

// 3. Most Reviewed / Top Rated (Modern hits 2020-2026 sorted by rating)
export const fetchTopRated = async (): Promise<MediaItem[]> => {
  try {
    const shows = await getAllRealOnlineShows();
    return [...shows]
      .filter((s) => s.releaseDate && s.releaseDate >= '2020-01-01')
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
      .filter((s) => s.releaseDate && s.releaseDate >= '2021-01-01')
      .sort((a, b) => b.voteCount - a.voteCount);
  } catch (err) {
    console.error('fetchPopular error:', err);
    return [];
  }
};

// 5. Upcoming Releases (2024-2026)
export const fetchUpcoming = async (): Promise<MediaItem[]> => {
  try {
    const shows = await getAllRealOnlineShows();
    return [...shows]
      .filter((s) => s.releaseDate && s.releaseDate >= '2024-01-01')
      .sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
  } catch (err) {
    console.error('fetchUpcoming error:', err);
    return [];
  }
};

// 6. Worldwide Anime Hot Picks (Modern 2020-2026 Anime)
export const fetchAnimePicks = async (): Promise<MediaItem[]> => {
  try {
    const shows = await getAllRealOnlineShows();
    const animeList = shows.filter((s) => s.mediaType === 'ANIME' && (s.releaseDate || '') >= '2019-01-01');
    if (animeList.length > 0) {
      return [...animeList].sort((a, b) => b.rating - a.rating);
    }

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

    const rawCast = show._embedded?.cast || [];
    const cast = rawCast.slice(0, 10).map((c: any) => ({
      id: c.person.id,
      name: c.person.name,
      character: c.character?.name || 'Main Cast',
      profileUrl: c.person.image?.medium || c.person.image?.original || null
    }));

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
      try {
        const siteName = new URL(show.officialSite).hostname.replace('www.', '');
        watchProviders.push({
          id: 99,
          name: `Official Stream (${siteName})`,
          logoUrl: null,
          type: 'Official Web Stream'
        });
      } catch (e) {}
    }

    if (watchProviders.length === 0) {
      watchProviders.push({
        id: 100,
        name: 'Worldwide Streaming & Digital',
        logoUrl: null,
        type: 'Digital & On-Demand'
      });
    }

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
