import DefaultLayout from "@/layouts/default";
import { Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Pagination } from "@nextui-org/react";
import MovieCard from "@/components/MovieCard";
import { motion } from "framer-motion";
import { usePagination } from "@/hooks/usePagination";
import { useState } from "react";
import { useGenres } from "@/hooks/useGenres";

type PaginationType = 'infinite' | 'paginated';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function HomePage() {
  const [paginationType, setPaginationType] = useState<PaginationType>('infinite');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>();
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const { genres } = useGenres();

  // Generate years from 1990 to current year
  const years = Array.from(
    { length: new Date().getFullYear() - 1990 + 1 },
    (_, i) => new Date().getFullYear() - i
  );

  const handlePaginationTypeChange = (type: string) => {
    setPaginationType(type as PaginationType);
  };

  const handleSortByChange = (value: string) => {
    let sortParam = '';
    switch (value) {
      case 'popularity':
        sortParam = 'popularity.desc';
        break;
      case 'vote_average':
        sortParam = 'vote_average.desc';
        break;
      case 'release_date':
        sortParam = 'release_date.desc';
        break;
      case 'title':
        sortParam = 'original_title.asc';
        break;
      default:
        sortParam = 'popularity.desc';
    }
    setSortBy(sortParam);
  };

  const getSortDisplayName = (sortValue: string) => {
    switch (sortValue) {
      case 'popularity.desc':
        return 'Popularity';
      case 'vote_average.desc':
        return 'Rating';
      case 'release_date.desc':
        return 'Release Date';
      case 'original_title.asc':
        return 'Title';
      default:
        return 'Popularity';
    }
  };

  const { 
    movies, 
    loading, 
    error, 
    hasMore,
    currentPage,
    totalPages,
    setPage,
    lastMovieElementRef 
  } = usePagination({ 
    type: paginationType,
    sortBy,
    genreId: selectedGenre,
    year: selectedYear
  });

  const getFilterSummary = () => {
    const filters = [];
    
    filters.push(`sorted by ${getSortDisplayName(sortBy)}`);
    
    if (selectedGenre) {
      const genre = genres.find(g => g.id === selectedGenre);
      if (genre) filters.push(`in ${genre.name}`);
    }
    
    if (selectedYear) {
      filters.push(`from ${selectedYear}`);
    }
    
    return filters.join(' ');
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col gap-8 py-8 md:py-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Discover Movies</h1>
              {movies.length > 0 && (
                <p className="text-default-500 mt-1">
                  Showing {movies.length} movies {getFilterSummary()}
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="flat">
                    Pagination: {paginationType}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Pagination type"
                  onAction={(key) => handlePaginationTypeChange(key as string)}
                >
                  <DropdownItem key="infinite">Infinite Scroll</DropdownItem>
                  <DropdownItem key="paginated">Paginated</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Dropdown>
                <DropdownTrigger>
                  <Button variant="flat">
                    Sort by: {getSortDisplayName(sortBy)}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Sort by"
                  onAction={(key) => handleSortByChange(key as string)}
                >
                  <DropdownItem key="popularity">Popularity</DropdownItem>
                  <DropdownItem key="vote_average">Rating</DropdownItem>
                  <DropdownItem key="release_date">Release Date</DropdownItem>
                  <DropdownItem key="title">Title</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Dropdown>
                <DropdownTrigger>
                  <Button variant="flat">
                    Genre: {selectedGenre ? genres.find(g => g.id === selectedGenre)?.name : 'All'}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Select genre"
                  onAction={(key) => setSelectedGenre(key === 'all' ? undefined : Number(key))}
                  selectionMode="single"
                  selectedKeys={selectedGenre ? [String(selectedGenre)] : ['all']}
                >
                  <>
                    <DropdownItem key="all">All Genres</DropdownItem>
                    {genres.map((genre) => (
                      <DropdownItem key={genre.id.toString()}>{genre.name}</DropdownItem>
                    ))}
                  </>
                </DropdownMenu>
              </Dropdown>

              <Dropdown>
                <DropdownTrigger>
                  <Button variant="flat">
                    Year: {selectedYear || 'All'}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Select year"
                  onAction={(key) => setSelectedYear(key === 'all' ? undefined : Number(key))}
                  selectionMode="single"
                  selectedKeys={selectedYear ? [String(selectedYear)] : ['all']}
                >
                  <>
                    <DropdownItem key="all">All Years</DropdownItem>
                    {years.map((year) => (
                      <DropdownItem key={year.toString()}>{year}</DropdownItem>
                    ))}
                  </>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-danger text-center">{error}</div>
        )}

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {movies.map((movie, index) => (
            <motion.div 
              key={movie.id} 
              variants={item}
              ref={paginationType === 'infinite' && movies.length === index + 1 ? lastMovieElementRef : undefined}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </motion.div>

        {loading && (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        )}

        {paginationType === 'paginated' && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              total={totalPages}
              page={currentPage}
              onChange={setPage}
              showControls
              classNames={{
                wrapper: "gap-1",
                item: "w-8 h-8 text-small",
              }}
            />
          </div>
        )}

        {!loading && !hasMore && movies.length > 0 && (
          <p className="text-center text-default-500 py-8">
            No more movies to load
          </p>
        )}
      </section>
    </DefaultLayout>
  );
}
