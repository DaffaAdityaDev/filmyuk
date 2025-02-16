export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const TMDB_BACKDROP_SIZE = 'original';
export const TMDB_POSTER_SIZE = 'w500';

export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!TMDB_API_KEY) {
  throw new Error('TMDB API key is not defined. Please add it to your .env file.');
}

export const endpoints = {
  trending: '/trending/movie/week',
  discover: '/discover/movie',
  movie: '/movie',
  search: '/search/movie',
  videos: (movieId: number) => `/movie/${movieId}/videos`,
  genres: '/genre/movie/list'
}; 