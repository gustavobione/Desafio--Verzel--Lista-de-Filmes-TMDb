// Arquivo: Frontend/src/components/MovieCard.tsx
// (Este é o componente "DUMB" - Apenas UI)

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

// Esta interface será usada pelo AuthContext e pelas páginas
export interface Movie {
  id: number // ID do TMDb
  tmdb_id?: number
  title: string
  poster_path: string
  overview: string
  rating?: number
  vote_average?: number // O TMDb usa isso
}

interface MovieCardProps {
  movie: Movie
  isFavorited: boolean       // Prop: Está favoritado?
  onToggleFavorite: () => void // Prop: O que fazer ao clicar?
  isLoading: boolean         // Prop: O botão está carregando?
}

export function MovieCard({ movie, isFavorited, onToggleFavorite, isLoading }: MovieCardProps) {
  
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image"

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg h-14 line-clamp-2">{movie.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <img 
          src={posterUrl} 
          alt={movie.title}
          className="rounded-md mb-4 aspect-[2/3] object-cover"
        />
        <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
          {movie.overview}
        </p>
        
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