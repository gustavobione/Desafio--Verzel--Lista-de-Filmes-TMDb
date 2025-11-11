// Arquivo: Frontend/src/components/MovieGrid.tsx
// (Refatorado com a lógica "Ver Mais" incremental)

import { useState } from 'react' // <-- 1. Importar useState
import { type Movie, MovieCard } from "./MovieCard"
import { useAuth } from "@/contexts/AuthContext"
import { Link, useNavigate } from "@tanstack/react-router"
import { Button } from "./ui/button"
import { ChevronDown, ChevronRight } from "lucide-react" // <-- 2. Importar ícones

interface MovieGridProps {
  movies: Movie[]
  viewMoreLink?: string 
}

const MOVIES_PER_CHUNK = 5; // O número de filmes para mostrar por linha/clique
const MAX_MOVIES_SHOWN = 20; // O limite máximo de filmes (4 linhas de 5)

export function MovieGrid({ movies, viewMoreLink }: MovieGridProps) {
  const { user, toggleFavorite, favoriteLookup, isFavLoading } = useAuth()
  const navigate = useNavigate()

  // 3. Adiciona estado interno para controlar a visibilidade
  // Começa mostrando apenas o primeiro "chunk" (5 filmes)
  const [visibleCount, setVisibleCount] = useState(MOVIES_PER_CHUNK)

  const handleToggle = (movie: Movie) => {
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    toggleFavorite(movie)
  }

  // 4. Lógica para os botões "Ver Mais"
  const totalMovies = movies.length
  // Pega apenas os filmes que devem estar visíveis
  const moviesToShow = movies.slice(0, visibleCount)

  // Condição 1: Ainda podemos carregar mais (ex: 5, 10, 15)
  const canLoadMore = visibleCount < totalMovies && visibleCount < MAX_MOVIES_SHOWN
  
  // Condição 2: Atingimos o limite (20) E existe um link para a pesquisa
  const reachedMaxLimit = (visibleCount >= totalMovies || visibleCount >= MAX_MOVIES_SHOWN) 
                         && viewMoreLink

  const handleShowMore = () => {
    // Adiciona mais 5 filmes à contagem
    setVisibleCount(prevCount => prevCount + MOVIES_PER_CHUNK)
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* 5. Mostra apenas a fatia 'moviesToShow' */}
        {moviesToShow.map((movie) => {
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
      
      {/* 6. Lógica de Botões (como você pediu) */}
      <div className="flex justify-center mt-8">
        
        {/* Botão 1: "Carregar mais 5" (mostra 10, 15, 20) */}
        {canLoadMore && (
          <Button variant="outline" onClick={handleShowMore}>
            Ver Mais <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        )}

        {/* Botão 2: "Ver mais na Pesquisa" (só aparece no final) */}
        {reachedMaxLimit && (
          <Button asChild variant="outline">
            <Link to={viewMoreLink}>
              Ver todos na Pesquisa <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        )}
        
        {/* Se 'canLoadMore' e 'reachedMaxLimit' forem falsos 
            (ex: a lista tem só 3 filmes), nenhum botão aparece. */}
            
      </div>
    </div>
  )
}