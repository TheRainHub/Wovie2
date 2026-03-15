import { promises } from "dns";
import { TMDBMovieListResponse, TMDBMovieDetails, TMDBGenresResponse}

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;


async function tmdbFetch<T>(endpoint: string, params: Record<string, string>): Promise<T>{
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.set('api_key', API_KEY);
    url.searchParams.set('language', 'en-US');
    if(params){
        Object.entries(params).forEach(([key, val]) => 
        url.searchParams.set(key, val));
    }

    const res = await fetch(url.toString());
    if(!res.ok) throw new Error(`TMDB error: ${res.status} ${res.statusText}`);
    return res.json();
}

export async function getMovieDetails(movieId: number) {
  return tmdbFetch<TMDBMovieDetails>(`/movie/${movieId}`, {
    append_to_response: 'credits,videos'
  });
}

export async function getGenres(){
    return tmdbFetch<TMDBGenresResponse>('/genre/movie/list');
}

export function getPosterUrl(path: string | null, size = 'w500'){
    return path ? 'https://image.tmdb.org/t/p/${size}${path}' : null;
}

export function getProfileUrl(path: string | null){
    return path ?  `https://image.tmdb.org/t/p/w185${path}` : null;
}

export function getTrailerUrl(videos: { results: { key: string; site: string; type: string }[] }) {
  const trailer = videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
}