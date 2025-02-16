import DefaultLayout from "@/layouts/default";
import { useFavorites } from "@/contexts/FavoritesContext";
import MovieCard from "@/components/MovieCard";
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { HeartIcon } from "@/components/icons";
import { Link } from "react-router-dom";

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

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 bg-default-100 dark:bg-default-50 rounded-full flex items-center justify-center mb-6">
        <HeartIcon className="w-8 h-8 text-default-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
      <p className="text-default-500 mb-8 max-w-md">
        Start exploring movies and add them to your favorites to see them here.
      </p>
      <Button 
        as={Link}
        to="/"
        color="primary"
        variant="flat"
        size="lg"
        className="font-medium"
      >
        Explore Movies
      </Button>
    </div>
  );

  return (
    <DefaultLayout>
      <section className="flex flex-col gap-8 py-8 md:py-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">My Favorites</h1>
              {favorites.length > 0 && (
                <p className="text-default-500 mt-1">
                  You have {favorites.length} favorite {favorites.length === 1 ? 'movie' : 'movies'}
                </p>
              )}
            </div>
            {favorites.length > 0 && (
              <Button
                as={Link}
                to="/"
                variant="flat"
                color="primary"
                className="font-medium"
              >
                Add More
              </Button>
            )}
          </div>
        </div>

        {favorites.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {favorites.map((movie) => (
              <motion.div key={movie.id} variants={item}>
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </DefaultLayout>
  );
} 