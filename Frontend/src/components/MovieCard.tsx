// Arquivo: Frontend/src/components/MovieCard.tsx
// (Atualizado com o novo RatingCircle estilo "donut")

import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { RatingCircle } from "./RaitingCircle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// (Interface Movie - sem mudanças)
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

// (Interface MovieCardProps - sem mudanças)
interface MovieCardProps {
  movie: Movie
  isFavorited: boolean
  onToggleFavorite: () => void
  isLoading: boolean
}

export function MovieCard({ movie, isFavorited, onToggleFavorite, isLoading }: MovieCardProps) {
  
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image"
  
  const rating = Math.round(((movie.vote_average || movie.rating || 0) * 10))
  const year = new Date(movie.release_date || "").getFullYear() || "N/A"

  return (
    <div className="flex flex-col group">
      
      {/* --- IMAGEM E BOTÕES --- */}
      <div className="relative">
        {/* Link principal (na imagem) */}
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
        
        {/* Círculo de Nota (Renderiza o novo componente) */}
        <RatingCircle rating={rating} />

        {/* Botão de Favorito (sem mudanças) */}
        <Button 
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/75 text-white rounded-full h-8 w-8"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleFavorite()
          }}
          disabled={isLoading}
          aria-label="Favoritar"
        >
          <Heart 
            className="h-4 w-4" 
            fill={isFavorited ? "currentColor" : "none"} 
          />
        </Button>
      </div>
      
      {/* --- TEXTO ABAIXO DA IMAGEM (sem mudanças) --- */}
      <div className="pt-3">
        {/* Título com "Letreiro" (Tooltip) */}
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
        
        {/* Data (da inspiração) */}
        <p className="text-xs text-muted-foreground">
          {year}
        </p>
      </div>
    </div>
  )
}