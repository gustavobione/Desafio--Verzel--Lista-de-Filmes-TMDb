// Arquivo: Frontend/src/components/MovieCard.tsx
// (Atualizado com o Badge de nota)

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge" // <-- 1. Importe o Badge
import { Heart } from "lucide-react"

export interface Movie {
  id: number // ID do TMDb
  tmdb_id?: number
  title: string
  poster_path: string
  overview: string
  rating?: number
  vote_average?: number // O TMDb usa isso
  release_date?: string;
}

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

  // 2. Calcula a nota (ex: 8.234 -> 82%)
  const rating = Math.round(((movie.vote_average || movie.rating || 0) * 10))

  return (
    // 3. Adiciona 'relative' para o Badge funcionar
    <Card className="flex flex-col relative overflow-hidden">
      
      {/* 4. O Badge da Nota */}
      <Badge 
        variant={rating > 70 ? "default" : "secondary"}
        className="absolute top-2 right-2 z-10"
      >
        {rating}%
      </Badge>

      <CardHeader className="pt-2">
        <CardTitle className="text-lg h-14 line-clamp-2 pt-4">{movie.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <img 
          src={posterUrl} 
          alt={movie.title}
          className="rounded-md mb-4 aspect-[2/3] object-cover"
        />
        {/* Podemos esconder a 'overview' no carrossel, se preferir */}
        {/* <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
          {movie.overview}
        </p> */}
        
        <Button 
          variant={isFavorited ? "default" : "outline"} 
          className="w-full mt-4" 
          onClick={onToggleFavorite}
          disabled={isLoading}
        >
          <Heart 
            className="mr-2 h-4 w-4" 
            fill={isFavorited ? "currentColor" : "none"}
          />
          {isLoading ? "Salvando..." : (isFavorited ? "Remover" : "Favoritar")}
        </Button>
      </CardContent>
    </Card>
  )
}