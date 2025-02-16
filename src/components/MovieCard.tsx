import { Card, CardBody, Image, Button, Tooltip } from "@nextui-org/react";
import { Movie } from "@/types/movie";
import { TMDB_IMAGE_BASE_URL, TMDB_POSTER_SIZE } from "@/config/tmdb";
import { Link } from "react-router-dom";
import { HeartIcon } from "@/components/icons";
import { useFavorites } from "@/contexts/FavoritesContext";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const favorite = isFavorite(movie.id);

  const imageUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}/${TMDB_POSTER_SIZE}${movie.poster_path}`
    : '/placeholder.jpg';

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (favorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  return (
    
    <Link to={`/movie/${movie.id}`}>
      <Card 
        className="h-full w-full group hover:scale-[1.02] transition-transform duration-200"
        isPressable
      >
        <CardBody className="p-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Image
            alt={movie.title}
            className="w-full object-cover h-[400px] transform group-hover:scale-105 transition-transform duration-200"
            radius="lg"
            shadow="none"
            src={imageUrl}
            width="100%"
          />
          <Tooltip content={favorite ? "Remove from favorites" : "Add to favorites"}>
            <Button
              className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm border-none hover:bg-black/40 z-20"
              color={favorite ? "danger" : "default"}
              isIconOnly
              radius="full"
              size="sm"
              onClick={handleFavoriteClick}
            >
              <HeartIcon 
                className={`${favorite ? "text-danger fill-current" : "text-white group-hover:scale-110 transition-transform"}`}
                size={16}
              />
            </Button>
          </Tooltip>
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="relative z-20">
              <h4 className="font-bold text-xl text-white line-clamp-1">{movie.title}</h4>
              <div className="flex items-center gap-2 text-sm text-white/80 mt-1">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  {movie.vote_average.toFixed(1)} ⭐
                </span>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/100 opacity-80 z-10" />
          </div>
        </CardBody>
      </Card>
    </Link>
  );
} 