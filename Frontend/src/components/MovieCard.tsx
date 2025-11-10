// Arquivo: Frontend/src/components/MovieCard.tsx
// (Refatorado para o design "TMDb/LUMIÈRE")

import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// (Interface - Adicionei 'release_date' que estava faltando na sua)
export interface Movie {
  id: number
  tmdb_id?: number
  title: string
  poster_path: string
  overview: string
  rating?: number
  vote_average?: number
  release_date?: string // <-- Importante (para a data)
  backdrop_path?: string
}

// (Props - sem mudanças)
interface MovieCardProps {
  movie: Movie
  isFavorited: boolean
  onToggleFavorite: () => void
  isLoading: boolean
}

// --- COMPONENTE INTERNO PARA O CÍRCULO DE NOTA ---
// (Inspirado na imagem, Goal 5)
function RatingCircle({ rating }: { rating: number }) {
  // Define a cor da borda baseado na nota
  const colorClass = rating >= 70 ? 'border-green-500' : rating >= 40 ? 'border-yellow-500' : 'border-red-600'
  
  return (
    <div className={cn(
      "absolute bottom-2 left-2 z-10 h-10 w-10 rounded-full",
      "flex items-center justify-center bg-background/70",
      "border-2", 
      colorClass // Aplica a cor da borda
    )}>
      <span className="text-black font-bold text-sm">{rating}</span>
      <span className="text-black text-[8px]">%</span>
    </div>
  )
}
// --- FIM DO COMPONENTE DE NOTA ---


export function MovieCard({ movie, isFavorited, onToggleFavorite, isLoading }: MovieCardProps) {
  
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image"
  
  const rating = Math.round(((movie.vote_average || movie.rating || 0) * 10))
  const year = new Date(movie.release_date || "").getFullYear() || "N/A"

  // (Não usamos mais <Card>. O 'group' é para o hover do título)
  return (
    <div className="flex flex-col group">
      
      {/* --- IMAGEM E BOTÕES (Goals 3, 4, 5) --- */}
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
        
        {/* Círculo de Nota (Goal 5) */}
        <RatingCircle rating={rating} />

        {/* Botão de Favorito (Goal 4: Apenas Ícone) */}
        <Button 
          variant="secondary" // (Pode mudar para 'ghost' se preferir)
          size="icon"
          // Posicionado no top-right
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
      
      {/* --- TEXTO ABAIXO DA IMAGEM (Goals 1, 2, 3) --- */}
      <div className="pt-3">
        {/* Título com "Letreiro" (Tooltip) (Goal 1 & 2) */}
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