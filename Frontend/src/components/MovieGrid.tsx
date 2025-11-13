// Arquivo: Frontend/src/components/MovieGrid.tsx
// (Refatorado V3: "Burro", para usar o MovieCard "Smart")

import { useState } from 'react'
import { type Movie, MovieCard } from "./MovieCard" // <-- Importa o MovieCard V3 (smart)
import { Link } from "@tanstack/react-router"
import { Button } from "./ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"

// REMOVEMOS: useAuth, useNavigate

interface MovieGridProps {
  movies: Movie[]
  viewMoreLink?: string 
}

const MOVIES_PER_CHUNK = 5; 
const MAX_MOVIES_SHOWN = 20;

export function MovieGrid({ movies, viewMoreLink }: MovieGridProps) {
  // REMOVEMOS: useAuth, useNavigate, e handleToggle

  const [visibleCount, setVisibleCount] = useState(MOVIES_PER_CHUNK)

  const totalMovies = movies.length
  const moviesToShow = movies.slice(0, visibleCount)

  const canLoadMore = visibleCount < totalMovies && visibleCount < MAX_MOVIES_SHOWN
  const reachedMaxLimit = (visibleCount >= totalMovies || visibleCount >= MAX_MOVIES_SHOWN) 
                         && viewMoreLink

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + MOVIES_PER_CHUNK)
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {moviesToShow.map((movie) => {
          // O MovieCard V3 (smart) cuida de si mesmo.
          // Não precisamos passar 'isFavorited' ou 'onToggleFavorite'.
          return (
            <MovieCard 
              key={movie.id} 
              movie={movie}
            />
          )
        })}
      </div>
      
      <div className="flex justify-center mt-8">
        {canLoadMore && (
          <Button variant="outline" onClick={handleShowMore}>
            Ver Mais <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        )}
        {reachedMaxLimit && (
          <Button asChild variant="outline">
            {/* Adicionado '!' para garantir que 'viewMoreLink' existe */}
            <Link to={viewMoreLink!}>
              Ver todos na Pesquisa <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}