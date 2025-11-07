// Arquivo: Frontend/src/components/MovieCard.tsx
// (Atualizado para ser um Link clicável)

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"
import { Link } from "@tanstack/react-router" // <-- 1. Importe o Link

// ... (interface Movie - sem mudanças) ...
export interface Movie {
  id: number // ID do TMDb
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
  isFavorited: boolean
  onToggleFavorite: () => void
  isLoading: boolean
}

export function MovieCard({ movie, isFavorited, onToggleFavorite, isLoading }: MovieCardProps) {
  
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image"
  
  const rating = Math.round(((movie.vote_average || movie.rating || 0) * 10))

  return (
    // 2. Envolvemos o Card inteiro em um <Link>
    // Ele vai para a rota '/filme/' e passa o ID do filme
    <Link 
      to="/filme/$movieId" 
      params={{ movieId: String(movie.id) }}
      className="flex" // (Para o card ocupar o espaço)
    >
      <Card className="flex flex-col relative overflow-hidden w-full transition-transform transform-gpu hover:scale-105">
        
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
          
          <Button 
            variant={isFavorited ? "default" : "outline"} 
            className="w-full mt-4 z-10" // z-10 para ficar acima do Link
            // 3. O 'onClick' do botão precisa parar o clique do Link
            onClick={(e) => {
              e.preventDefault() // Impede a navegação
              e.stopPropagation() // Impede que o Link seja acionado
              onToggleFavorite() // Roda a função de favoritar
            }}
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
    </Link>
  )
}