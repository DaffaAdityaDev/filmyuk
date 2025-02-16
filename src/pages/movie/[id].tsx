import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { Button, Card, Image, Modal, ModalContent, ModalBody, useDisclosure, Chip, Spinner } from "@nextui-org/react";
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, TMDB_BACKDROP_SIZE, TMDB_POSTER_SIZE, endpoints } from "@/config/tmdb";
import { MovieDetails, MovieVideo } from "@/types/movie";
import { HeartIcon, PlayIcon, ShareIcon } from "@/components/icons";
import { useFavorites } from "@/contexts/FavoritesContext";
import { motion } from "framer-motion";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [videoLoading, setVideoLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const [movieResponse, videosResponse] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`),
          fetch(`${TMDB_BASE_URL}${endpoints.videos(Number(id))}?api_key=${TMDB_API_KEY}`)
        ]);

        if (!movieResponse.ok || !videosResponse.ok) {
          throw new Error('Failed to fetch movie details');
        }

        const movieData = await movieResponse.json();
        const videosData = await videosResponse.json();

        setMovie(movieData);
        setVideos(videosData.results.filter((video: MovieVideo) => video.type === 'Trailer'));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: movie?.title,
        text: movie?.overview,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const toggleFavorite = () => {
    if (!movie) return;
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center min-h-[70vh]">
          <Spinner size="lg" label="Loading movie details..." />
        </div>
      </DefaultLayout>
    );
  }

  if (error || !movie) {
    return (
      <DefaultLayout>
        <motion.div 
          className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="text-default-500 mb-8">{error || 'Movie not found'}</p>
          <Button 
            color="primary" 
            variant="flat" 
            onClick={() => navigate(-1)}
            className="font-medium"
          >
            Go Back
          </Button>
        </motion.div>
      </DefaultLayout>
    );
  }

  const trailer = videos[0];
  const favorite = isFavorite(movie.id);

  return (
    <DefaultLayout>
      <motion.div 
        className="relative min-h-[calc(100vh-4rem)] text-white rounded-md"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Backdrop Image with Gradient Overlay */}
        <div className="absolute inset-0 overflow-hidden">
      
          <Image
            src={`${TMDB_IMAGE_BASE_URL}/${TMDB_BACKDROP_SIZE}${movie.backdrop_path}`}
            alt={movie.title}
            classNames={{
              wrapper: "w-full h-full",
              img: "w-full h-full object-cover"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/100 opacity-80 z-10 rounded-md" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-8">
          <motion.div 
            className="flex flex-col md:flex-row gap-8"
            variants={fadeIn}
          >
            {/* Movie Poster */}
            <div className="md:w-1/3 group cursor-pointer" onClick={trailer ? onOpen : undefined}>
              <Card className="overflow-hidden">
                {trailer && (
                  <>
                    <div className="absolute top-0 left-0 w-full h-full group-hover:bg-black/50 z-20"/>
                    <div className="flex flex-col items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <PlayIcon className=" text-white z-30" size={100} />
                      <p className="text-white text-2xl font-bold">Watch Trailer</p>
                    </div>
                  </>
                )} 
                <Image
                  src={`${TMDB_IMAGE_BASE_URL}/${TMDB_POSTER_SIZE}${movie.poster_path}`}
                  alt={movie.title}
                  classNames={{
                    wrapper: "w-full aspect-[2/3]",
                    img: "w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  }}
                />
              </Card>
            </div>

            {/* Movie Details */}
            <div className="md:w-2/3">
              <motion.div 
                className="space-y-6"
                variants={stagger}
              >
                {/* Title and Tagline */}
                <motion.div variants={fadeIn}>
                  <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                  {movie.tagline && (
                    <p className="text-xl text-default-200 dark:text-default-600 italic">{movie.tagline}</p>
                  )}
                </motion.div>

                {/* Genres */}
                <motion.div 
                  className="flex flex-wrap gap-2"
                  variants={fadeIn}
                >
                  {movie.genres.map((genre) => (
                    <Chip
                      key={genre.id}
                      variant="flat"
                      classNames={{
                        base: "bg-default-100 dark:bg-default-50",
                        content: "text-black dark:text-white"
                      }}
                    >
                      {genre.name}
                    </Chip>
                  ))}
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex flex-wrap gap-3"
                  variants={fadeIn}
                >
                  
                    <Button
                      color={favorite ? "danger" : "default"}
                      variant="flat"
                      startContent={<HeartIcon className={favorite ? "text-danger fill-current" : "text-white"} />}
                      onClick={toggleFavorite}
                    >
                      <p className="text-white">{favorite ? 'Remove from Favorites' : 'Add to Favorites'}</p>
                    </Button>
              
                  
                  <Button
                    variant="flat"
                    startContent={<ShareIcon className="text-white"/>}
                    onClick={handleShare}

                  >
                    <p className="text-white">Share</p>
                  </Button>

                  {trailer && (
                    <Button
                      color="primary"
                      onClick={onOpen}
                      className="font-medium"
                      startContent={<PlayIcon className="text-white"/>}
                    >
                      Watch Trailer
                    </Button>
                  )}
                </motion.div>

                {/* Overview */}
                <motion.div variants={fadeIn}>
                  <h2 className="text-xl font-semibold mb-3">Overview</h2>
                  <p className="text-default-200 dark:text-default-600 leading-relaxed ">{movie.overview}</p>
                </motion.div>

                {/* Movie Info Grid */}
                <motion.div 
                  className="grid grid-cols-2 sm:grid-cols-4 gap-6"
                  variants={fadeIn}
                >
                  <div>
                    <h3 className="text-default-200 dark:text-default-600 text-sm mb-1">Release Date</h3>
                    <p className="font-medium">
                      {new Date(movie.release_date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-default-200 dark:text-default-600 text-sm mb-1">Runtime</h3>
                    <p className="font-medium">{movie.runtime} minutes</p>
                  </div>
                  <div>
                    <h3 className="text-default-200 dark:text-default-600 text-sm mb-1">Rating</h3>
                    <p className="font-medium flex items-center gap-1">
                      {movie.vote_average.toFixed(1)} <span className="text-yellow-500">⭐</span>
                    </p>
                  </div>
                  <div> 
                    <h3 className="text-default-200 dark:text-default-600 text-sm mb-1">Status</h3>
                    <p className="font-medium">{movie.status}</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Trailer Modal */}
      {trailer && (
        <Modal
          size="5xl"
          isOpen={isOpen}
          onClose={onClose}
          classNames={{
            backdrop: "bg-black/70 backdrop-blur-sm",
            base: "border-none bg-transparent shadow-none",
          }}
          motionProps={{
            variants: {
              enter: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                  ease: "easeOut"
                }
              },
              exit: {
                y: -20,
                opacity: 0,
                transition: {
                  duration: 0.2,
                  ease: "easeIn"
                }
              }
            }
          }}
        >
          <ModalContent className="rounded-md">
            <ModalBody className="p-0 overflow-hidden rounded-md">
              <iframe
                className="w-full aspect-video"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                allowFullScreen
                onLoad={() => setVideoLoading(false)}
              />
              {videoLoading && (
                <div className="flex flex-col justify-center items-center absolute inset-0">
                  <Spinner size="lg" />
                  <p className="text-white">Loading video...</p>
                </div>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </DefaultLayout>
  );
} 