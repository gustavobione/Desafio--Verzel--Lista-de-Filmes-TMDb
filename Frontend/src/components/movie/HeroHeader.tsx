// Arquivo: Frontend/src/components/movie/HeroHeader.tsx
// (Atualizado para usar RatingBadge e TrailerDialog)

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { TrailerDialog } from "@/components/TrailerDialog" // <-- 1. Importar o Dialog
import { RatingBadge } from "../RaitingBadge"   // <-- 2. Importar o Badge

export function HeroHeader({ movie, isFavorited, onToggleFavorite, isFavLoading }: { movie: any, isFavorited: boolean, onToggleFavorite: () => void, isFavLoading: boolean }) {
  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
  
  return (
    <div className="relative h-[75vh] w-full">
      <img src={backdropUrl} alt={movie.title} className="w-full h-full object-cover brightness-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      
      <div className="absolute bottom-0 left-0 container mx-[5%] p-4 md:p-8 text-white">
        <h1 className="text-4xl md:text-6xl font-bold max-w-2xl">{movie.title}</h1>
        
        {/* --- MUDANÇA 1: RATING --- */}
        {/* Substituído o <Badge> antigo pelo novo <RatingBadge> */}
        <div className="flex items-center gap-4 mt-4">
          <RatingBadge 
            rating={Math.round((movie.vote_average || 0) * 10)} 
          />
          <span className="text-lg font-semibold">
            {new Date(movie.release_date || "").getFullYear()}
          </span>
        </div>
        
        {/* --- MUDANÇA 2: BOTÕES DE AÇÃO --- */}
        <div className="flex flex-wrap items-center gap-2 mt-8">
          
          {/* Botão "Play Now" substituído por "Assistir Trailer" (usando o Dialog) */}
          <TrailerDialog movieId={movie.id} movieTitle={movie.title} />

          {/* Botão "Favoritar" (a lógica 'onClick' já está correta) */}
          <Button 
            size="lg" 
            variant={isFavorited ? "default" : "outline"} 
            onClick={onToggleFavorite}
            disabled={isFavLoading}
            className="bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white"
          >
            <Heart 
              className="mr-2 h-4 w-4" 
              fill={isFavorited ? "currentColor" : "none"} 
            />
            {isFavLoading ? "Salvando..." : (isFavorited ? "Remover" : "Favoritar")}
          </Button>
        </div>
      </div>
    </div>
  )
}