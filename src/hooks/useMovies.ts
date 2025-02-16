import { useState, useEffect } from 'react';
import { TMDB_API_KEY, TMDB_BASE_URL, endpoints } from '@/config/tmdb';
import { Movie, TMDBResponse } from '@/types/movie';

export const useMovies = (page: number = 1, searchQuery: string = '') => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoint = searchQuery
          ? `${TMDB_BASE_URL}${endpoints.search}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${page}`
          : `${TMDB_BASE_URL}${endpoints.trending}?api_key=${TMDB_API_KEY}&page=${page}`;

        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data: TMDBResponse<Movie> = await response.json();
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, searchQuery]);

  return { movies, loading, error, totalPages };
}; 