import type { Movie } from "./MovieCard"
import { Link, useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/contexts/AuthContext"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { TrailerDialog } from "./TrailerDialog"
import { RatingBadge } from "./RaitingBadge"
import {
  Heart,
  Bookmark,
  Check,
  Plus,
  Trash2,
  BookmarkCheck,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { ListType } from "@/contexts/AuthContext"

interface HeroCarouselProps {
  movies: Movie[]
}

export function HeroCarousel({ movies }: HeroCarouselProps) {

  const {
    user,
    movieLookup,
    setMovieStatus,
    isListLoading
  } = useAuth()

  const navigate = useNavigate()

  const handleSetStatus = (movie: Movie, listType: ListType, status: boolean) => {
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    setMovieStatus(movie, listType, status)
  }

  return (
    <Carousel
      className="w-full -mt-4"
      opts={{ loop: true }}
    >
      <CarouselContent>
        {movies.map((movie) => {
          const entry = movieLookup.get(movie.id);
          const isFavorited = entry?.is_favorite || false;
          const isWatchLater = entry?.is_watch_later || false;
          const isWatched = entry?.is_watched || false;

          let TriggerIcon = Plus
          if (isWatchLater) TriggerIcon = BookmarkCheck
          else if (isWatched) TriggerIcon = Check

          return (
            <CarouselItem key={movie.id}>
              <div className="relative h-[60vh] md:h-[80vh] w-full">
                {/* ... (Imagem de Fundo e Overlay) ... */}
                <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.title} className="w-full h-full object-cover brightness-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

                {/* Conteúdo */}
                <div className="absolute bottom-0 left-0 p-8 md:p-16 text-white">
                  <h1 className="text-4xl md:text-6xl font-bold max-w-2xl">{movie.title}</h1>

                  {/* ... (RatingBadge e Ano) ... */}
                  <div className="flex items-center gap-4 mt-4">
                    <RatingBadge rating={Math.round((movie.vote_average || 0) * 10)} />
                    <span className="text-lg font-semibold ml-2">{new Date(movie.release_date ?? new Date()).getFullYear()}</span>
                  </div>

                  <p className="mt-4 max-w-2xl text-lg text-gray-300 line-clamp-3">{movie.overview}</p>

                  {/* --- 5. BOTÕES DE AÇÃO --- */}
                  <div className="flex flex-wrap items-center gap-2 mt-6">

                    <TrailerDialog movieId={movie.id} movieTitle={movie.title} />

                    <Button asChild size="lg" variant="outline" className="bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white">
                      <Link to="/filme/$movieId" params={{ movieId: String(movie.id) }}>
                        Ver Detalhes
                      </Link>
                    </Button>

                    {/* Botão "Favoritar" */}
                    <Button
                      size="lg"
                      variant={isFavorited ? "default" : "outline"}
                      onClick={() => handleSetStatus(movie, 'is_favorite', !isFavorited)}
                      disabled={isListLoading}
                      className={cn(
                        "bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white",
                        isFavorited && "bg-primary text-primary-foreground hover:bg-primary/90" // Destaque
                      )}
                    >
                      <Heart
                        className="mr-2 h-4 w-4"
                        fill={isFavorited ? "currentColor" : "none"}
                      />
                      {isListLoading ? "..." : (isFavorited ? "Favorito" : "Favoritar")}
                    </Button>

                    {/* Botão "Listas" */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="lg"
                          variant={(isWatchLater || isWatched) ? "default" : "outline"}
                          disabled={isListLoading}
                          className={cn(
                            "bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10",
                            (isWatchLater || isWatched) && "bg-primary text-primary-foreground hover:bg-primary/90" // Destaque
                          )}
                        >
                          <TriggerIcon className="mr-2 h-4 w-4" />
                          {isListLoading ? "..." : (isWatchLater ? "Salvo" : isWatched ? "Visto" : "Listas")}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuLabel>Mover para...</DropdownMenuLabel>

                        <DropdownMenuItem
                          onClick={() => handleSetStatus(movie, 'is_watch_later', true)}
                          disabled={isWatchLater}
                        >
                          <Bookmark className="mr-2 h-4 w-4" />
                          <span>Assistir Depois</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSetStatus(movie, 'is_watched', true)}
                          disabled={isWatched}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          <span>Já Assistido</span>
                        </DropdownMenuItem>

                        {(isWatchLater || isWatched) && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500"
                              onClick={() => handleSetStatus(movie, isWatchLater ? 'is_watch_later' : 'is_watched', false)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Remover da Lista</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </div>
                </div>
              </div>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <div className="hidden md:block">
        <CarouselPrevious
          className="absolute left-8 top-1/2 -translate-y-1/2"
          aria-label="Slide anterior"
        />
        <CarouselNext
          className="absolute right-8 top-1/2 -translate-y-1/2"
          aria-label="Próximo slide"
        />
      </div>
    </Carousel>
  )
}