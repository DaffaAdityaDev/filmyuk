import { useState, useEffect } from 'react';
import { TMDB_API_KEY, TMDB_BASE_URL, endpoints } from '@/config/tmdb';

interface Genre {
  id: number;
  name: string;
}

export function useGenres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${TMDB_BASE_URL}${endpoints.genres}?api_key=${TMDB_API_KEY}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch genres');
        }

        const data = await response.json();
        setGenres(data.genres);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return { genres, loading, error };
} 