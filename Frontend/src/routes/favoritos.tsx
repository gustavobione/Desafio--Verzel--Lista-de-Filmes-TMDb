import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MovieCard, type Movie } from '@/components/MovieCard'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

export const Route = createFileRoute('/favoritos')({
  component: FavoritosPage,
})

function FavoritosPage() {
  const { 
    user,
    isLoading,
    favorites, 
    toggleFavorite, 
    favoriteLookup, 
    isFavLoading 
  } = useAuth()
  
  const navigate = useNavigate()

  // Efeito de redirecionamento se não estiver logado
  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ 
        to: '/login', 
        search: { redirect: '/favoritos' } // Salva onde ele queria ir
      })
    }
  }, [isLoading, user, navigate])

  if (isLoading) {
    return <div>Carregando...</div>
  }

  // 5. Se chegou aqui, o usuário ESTÁ logado
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Meus Favoritos</h1>
      
      {favorites.length === 0 ? (
        <p>Você ainda não salvou nenhum filme.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {favorites.map((fav) => {
            const movie: Movie = {
              id: fav.tmdb_id,
              tmdb_id: fav.tmdb_id,
              title: fav.title,
              poster_path: fav.poster_path,
              rating: fav.rating,
              overview: ""
            }
            
            return (
              <MovieCard 
                key={fav.id}
                movie={movie}
                isFavorited={favoriteLookup.has(movie.id)}
                onToggleFavorite={() => toggleFavorite(movie)}
                isLoading={isFavLoading}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}