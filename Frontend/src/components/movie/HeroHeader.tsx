import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  Bookmark, 
  Check, 
  Plus, 
  Trash2, 
  BookmarkCheck 
} from "lucide-react"
import { TrailerDialog } from "@/components/TrailerDialog"
import { RatingBadge } from "@/components/RaitingBadge"
import { useAuth } from "@/contexts/AuthContext"
import type { Movie } from "@/components/MovieCard"
import type { ListType } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function HeroHeader({ movie }: { movie: any }) {
  
  const { 
    user, 
    movieLookup, 
    setMovieStatus, 
    isListLoading 
  } = useAuth()
  
  const navigate = useNavigate()

  const entry = movieLookup.get(movie.id);
  const isFavorited = entry?.is_favorite || false;
  const isWatchLater = entry?.is_watch_later || false;
  const isWatched = entry?.is_watched || false;
  
  let TriggerIcon = Plus
  if (isWatchLater) TriggerIcon = BookmarkCheck
  else if (isWatched) TriggerIcon = Check

  const handleSetStatus = (listType: ListType, status: boolean) => {
    if (!user) {
      navigate({ to: '/login' });
      return;
    }
    const moviePayload: Movie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
    }
    setMovieStatus(moviePayload, listType, status)
  }

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
  
  return (
    <div className="relative h-[75vh] w-full">
      <img src={backdropUrl} alt={movie.title} className="w-full h-full object-cover brightness-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      
      <div className="absolute bottom-0 left-[5%] container mx-auto p-4 md:p-8 md:pb-12 text-white">
        <h1 className="text-4xl md:text-6xl font-bold max-w-2xl">{movie.title}</h1>
        
        <div className="flex items-center gap-4 mt-6">
          <RatingBadge 
            rating={Math.round((movie.vote_average || 0) * 10)} 
          />
          <span className="text-lg font-semibold">
            {new Date(movie.release_date || "").getFullYear()}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-8">
          
          <TrailerDialog movieId={movie.id} movieTitle={movie.title} />

          <Button 
            size="lg" 
            variant={isFavorited ? "default" : "outline"} 
            onClick={() => handleSetStatus('is_favorite', !isFavorited)}
            disabled={isListLoading}
            className={cn(
              "bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white",
              isFavorited && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Heart 
              className="mr-2 h-4 w-4" 
              fill={isFavorited ? "currentColor" : "none"} 
            />
            {isListLoading ? "..." : (isFavorited ? "Favorito" : "Favoritar")}
          </Button>

          {/* Botão "Listas" (Dropdown Separado) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="lg" 
                variant={(isWatchLater || isWatched) ? "default" : "outline"}
                disabled={isListLoading}
                className={cn(
                  "bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10",
                  (isWatchLater || isWatched) && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <TriggerIcon className="mr-2 h-4 w-4" />
                {isListLoading ? "..." : (isWatchLater ? "Salvo" : isWatched ? "Visto" : "Listas")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Mover para...</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => handleSetStatus('is_watch_later', true)} 
                disabled={isWatchLater}
              >
                <Bookmark className="mr-2 h-4 w-4" />
                <span>Assistir Depois</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleSetStatus('is_watched', true)} 
                disabled={isWatched}
              >
                <Check className="mr-2 h-4 w-4" />
                <span>Já Assistido</span>
              </DropdownMenuItem>
              {(isWatchLater || isWatched) && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive-foreground focus:bg-destructive" 
                    onClick={() => handleSetStatus(isWatchLater ? 'is_watch_later' : 'is_watched', false)}
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
  )
}