// Arquivo: Frontend/src/components/movie/HeroHeader.tsx

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Play } from "lucide-react"

// (Usamos 'any' por enquanto para simplificar. O ideal
// seria criar uma interface 'MovieDetails' completa)
export function HeroHeader({ movie, isFavorited, onToggleFavorite, isFavLoading }: { movie: any, isFavorited: boolean, onToggleFavorite: () => void, isFavLoading: boolean }) {
  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
  
  return (
    <div className="relative h-[70vh] w-full">
      <img src={backdropUrl} alt={movie.title} className="w-full h-full object-cover brightness-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      
      <div className="absolute bottom-0 left-0 container mx-auto p-4 md:p-8 text-white">
        <h1 className="text-4xl md:text-6xl font-bold max-w-2xl">{movie.title}</h1>
        <div className="flex items-center gap-4 mt-4">
          <Badge variant="destructive" className="text-lg">
            {Math.round((movie.vote_average || 0) * 10)}%
          </Badge>
          <span className="text-lg">{new Date(movie.release_date || "").getFullYear()}</span>
        </div>
        
        <div className="flex items-center gap-2 mt-6">
          <Button size="lg" className="bg-primary/90">
            <Play className="mr-2 h-5 w-5" />
            Play Now
          </Button>
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