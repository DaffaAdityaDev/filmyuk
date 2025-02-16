import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { Pagination, Spinner } from "@nextui-org/react";
import MovieCard from "@/components/MovieCard";
import { usePagination } from "@/hooks/usePagination";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { 
    movies, 
    loading, 
    error, 
    totalPages,
    currentPage,
    setPage
  } = usePagination({ 
    type: 'paginated',
    searchQuery,
    initialPage: Number(searchParams.get("page")) || 1
  });

  // Update URL when page changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (currentPage > 1) {
      params.set("page", String(currentPage));
    } else {
      params.delete("page");
    }
    setSearchParams(params);
  }, [currentPage, setSearchParams, searchParams]);

  return (
    <DefaultLayout>
      <section className="flex flex-col gap-8 py-8 md:py-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Search Movies</h1>
        </div>

        {error && (
          <div className="text-danger text-center">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {movies.length === 0 ? (
              <div className="text-center text-default-500">
                {searchQuery ? (
                  <p>No movies found for "{searchQuery}"</p>
                ) : (
                  <p>Use the search bar above to find movies</p>
                )}
              </div>
            ) : (
              <>
                <div className="text-default-500">
                  Found {totalPages * 20}+ movies for "{searchQuery}"
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </>
            )}

            {totalPages > 1 && (
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
          </>
        )}
      </section>
    </DefaultLayout>
  );
} 