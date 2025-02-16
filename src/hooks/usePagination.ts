import { useState, useEffect, useCallback, useRef } from 'react';
import { Movie, TMDBResponse } from '@/types/movie';
import { TMDB_API_KEY, TMDB_BASE_URL, endpoints } from '@/config/tmdb';

type PaginationType = 'infinite' | 'paginated';

interface UsePaginationOptions {
  type: PaginationType;
  searchQuery?: string;
  initialPage?: number;
  sortBy?: string;
  genreId?: number;
  year?: number;
}

interface UsePaginationReturn {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  hasMore: boolean;
  currentPage: number;
  setPage: (page: number) => void;
  loadMore: () => void;
  lastMovieElementRef?: (node: HTMLElement | null) => void;
}

export function usePagination({ 
  type = 'paginated', 
  searchQuery = '', 
  initialPage = 1,
  sortBy = 'popularity.desc',
  genreId,
  year
}: UsePaginationOptions): UsePaginationReturn {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  
  // For infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const lastMovieElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchMovies = useCallback(async (page: number, shouldAppend: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      let endpoint;
      if (searchQuery) {
        endpoint = `${TMDB_BASE_URL}${endpoints.search}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${page}`;
      } else {
        endpoint = `${TMDB_BASE_URL}${endpoints.discover}?api_key=${TMDB_API_KEY}&page=${page}&sort_by=${sortBy}`;
        
        // Add genre filter if provided
        if (genreId) {
          endpoint += `&with_genres=${genreId}`;
        }

        // Add year filter if provided
        if (year) {
          endpoint += `&primary_release_year=${year}`;
        }
      }

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data: TMDBResponse<Movie> = await response.json();
      
      setMovies(prev => shouldAppend ? [...prev, ...data.results] : data.results);
      setTotalPages(data.total_pages);
      setHasMore(page < data.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy, genreId, year]);

  // Handle page changes
  useEffect(() => {
    if (type === 'paginated') {
      fetchMovies(currentPage);
    } else if (type === 'infinite' && currentPage === 1) {
      fetchMovies(currentPage);
    } else if (type === 'infinite' && currentPage > 1) {
      fetchMovies(currentPage, true);
    }
  }, [currentPage, type, fetchMovies]);

  // Reset when any filter changes
  useEffect(() => {
    setMovies([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [searchQuery, sortBy, genreId, year]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  return {
    movies,
    loading,
    error,
    totalPages,
    hasMore,
    currentPage,
    setPage,
    loadMore,
    ...(type === 'infinite' ? { lastMovieElementRef } : {})
  };
} 