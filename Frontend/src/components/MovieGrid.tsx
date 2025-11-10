// Arquivo: Frontend/src/components/MovieGrid.tsx
// (Grid de filmes com botão "Ver Mais")

import { type Movie, MovieCard } from "./MovieCard"
import { useAuth } from "@/contexts/AuthContext"
import { Link, useNavigate } from "@tanstack/react-router"
import { Button } from "./ui/button"
import { ChevronRight } from "lucide-react"

interface MovieGridProps {
  movies: Movie[]
  // Opcional: Link para onde o "Ver Mais" deve levar
  viewMoreLink?: string 
}

export function MovieGrid({ movies, viewMoreLink }: MovieGridProps) {
  const { user, toggleFavorite, favoriteLookup, isFavLoading } = useAuth()
  const navigate = useNavigate()

  const handleToggle = (movie: Movie) => {
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    toggleFavorite(movie)
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Mostra apenas os 8 primeiros filmes no grid */}
        {movies.slice(0, 15).map((movie) => {
          const isFavorited = favoriteLookup.has(movie.id)
          return (
            <MovieCard 
              key={movie.id} 
              movie={movie}
              isFavorited={isFavorited}
              onToggleFavorite={() => handleToggle(movie)}
              isLoading={isFavLoading}
            />
          )
        })}
      </div>
      
      {/* O Botão "Ver Mais" (que é um Link) */}
      {viewMoreLink && (
        <div className="flex justify-center mt-6">
          <Button asChild variant="outline">
            <Link to={viewMoreLink}>
              Ver Mais <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}