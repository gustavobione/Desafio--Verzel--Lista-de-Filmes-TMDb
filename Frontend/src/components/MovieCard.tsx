import { Link, useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Heart, Bookmark, Check, Plus, Trash2, BookmarkCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RatingCircle } from "./RaitingCircle"
import { useAuth } from "@/contexts/AuthContext"
import type { ListType } from "@/contexts/AuthContext"

export interface Movie {
  id: number
  tmdb_id?: number
  title: string
  poster_path: string
  overview: string
  rating?: number
  vote_average?: number
  release_date?: string
  backdrop_path?: string
}


interface MovieCardProps {
  movie: Movie
}

// ---  FAVORITOS ---
function FavoriteActionButton({ movie }: { movie: Movie }) {
  const navigate = useNavigate()
  const { user, movieLookup, setMovieStatus, isListLoading } = useAuth()
  
  const entry = movieLookup.get(movie.id)
  const isFavorited = entry?.is_favorite || false
  
  const handleToggleFavorite = () => {
    if (!user) {
      navigate({ to: '/login' });
      return;
    }
    setMovieStatus(movie, 'is_favorite', !isFavorited)
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="secondary"
            size="icon"
            className={cn(
              "absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/75 text-white rounded-full h-8 w-8",
              isFavorited && "bg-primary text-primary-foreground hover:bg-primary/90" // Destaque
            )}
            disabled={isListLoading}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleFavorite(); }}
            aria-label="Favoritar"
          >
            <Heart className="h-4 w-4" fill={isFavorited ? "currentColor" : "none"} />
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>{isFavorited ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ---  LISTAS ---
function ListActionButton({ movie }: { movie: Movie }) {
  const navigate = useNavigate()
  const { user, movieLookup, setMovieStatus, isListLoading } = useAuth()
  
  const entry = movieLookup.get(movie.id)
  const isWatchLater = entry?.is_watch_later || false
  const isWatched = entry?.is_watched || false

  const handleAction = (listType: ListType, status: boolean) => {
    if (!user) {
      navigate({ to: '/login' });
      return;
    }
    setMovieStatus(movie, listType, status)
  }

  let TriggerIcon = Plus
  let triggerTooltip = "Adicionar a uma lista"
  if (isWatchLater) {
    TriggerIcon = BookmarkCheck
    triggerTooltip = "Salvo para Assistir Depois"
  } else if (isWatched) {
    TriggerIcon = Check
    triggerTooltip = "Marcado como Assistido"
  }

  return (
    <DropdownMenu>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary"
                size="icon"
                className={cn(
                  "absolute top-12 right-2 z-10 bg-black/50 hover:bg-black/75 text-white rounded-full h-8 w-8", // <-- Posição (abaixo)
                  (isWatchLater || isWatched) && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                disabled={isListLoading}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                aria-label={triggerTooltip}
              >
                <TriggerIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent><p>{triggerTooltip}</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent align="end" onClick={(e) => e.preventDefault()}>
        <DropdownMenuLabel>Mover para...</DropdownMenuLabel>

        <DropdownMenuItem 
          onClick={() => handleAction('is_watch_later', true)}
          disabled={isWatchLater}
        >
          <Bookmark className="mr-2 h-4 w-4" />
          <span>Assistir Depois</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => handleAction('is_watched', true)}
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
              onClick={() => handleAction(isWatchLater ? 'is_watch_later' : 'is_watched', false)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Remover da Lista</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


// --- O MOVIECARD PRINCIPAL ---
export function MovieCard({ movie }: MovieCardProps) {
  
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image"
  
  const rating = Math.round(((movie.vote_average || movie.rating || 0) * 10))
  const year = new Date(movie.release_date || "").getFullYear() || "N/A"

  return (
    <div className="flex flex-col group">
      <div className="relative">
        <Link 
          to="/filme/$movieId" 
          params={{ movieId: String(movie.id) }}
          className="block w-full"
        >
          <img 
            src={posterUrl} 
            alt={movie.title}
            className="rounded-md w-full h-full aspect-[2/3] object-cover transition-transform transform-gpu group-hover:scale-105"
          />
        </Link>
        
        <RatingCircle rating={rating} />
        
        <FavoriteActionButton movie={movie} />
        <ListActionButton movie={movie} />

      </div>
      
      <div className="pt-3">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link 
                to="/filme/$movieId" 
                params={{ movieId: String(movie.id) }}
              >
                <h3 className="font-semibold text-sm truncate hover:text-primary">
                  {movie.title}
                </h3>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{movie.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className="text-xs text-muted-foreground">{year}</p>
      </div>
    </div>
  )
}