// Arquivo: Frontend/src/routes/share.$listId.tsx
// (Atualizado para ser "inteligente" e permitir favoritar)

import { createFileRoute, useNavigate } from '@tanstack/react-router' // 1. Importar useNavigate
import { api } from '@/lib/api'
import { MovieCard, type Movie } from '@/components/MovieCard'
import { useAuth } from '@/contexts/AuthContext' // 2. Importar o "Cérebro"

export const Route = createFileRoute('/share/$listId')({
  // O loader continua o mesmo: busca a lista PÚBLICA do amigo
  loader: async ({ params }) => {
    const { listId } = params
    try {
      const sharedMovies = await api.get(`/public-list/${listId}/`)
      return sharedMovies as Movie[]
    } catch (error) {
      console.error("Erro ao carregar lista pública:", error)
      return []
    }
  },
  component: SharePage,
})

function SharePage() {
  // 3. Pega a lista do *amigo* (vinda do loader)
  const friendsFavorites = Route.useLoaderData()

  // 4. Pega o "cérebro" do *convidado/usuário logado*
  const { 
    user, 
    toggleFavorite, 
    favoriteLookup, 
    isFavLoading 
  } = useAuth()
  
  const navigate = useNavigate()

  // 5. O handler é o mesmo da index.tsx!
  // Ele decide o que fazer quando o botão é clicado.
  const handleToggle = (movie: Movie) => {
    // AÇÃO #1: Se for um convidado, redireciona para o login
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    // AÇÃO #2: Se estiver logado, chama a função do "Cérebro"
    toggleFavorite(movie)
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Lista de Favoritos Compartilhada</h1>
      
      {friendsFavorites.length === 0 ? (
        <p>Esta lista não foi encontrada ou está vazia.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {/* 6. Mapeia a lista do *amigo* */}
          {friendsFavorites.map((fav) => {
            
            // Adapta o 'fav' (do backend) para o tipo 'Movie'
            const movie: Movie = {
              id: fav.tmdb_id ?? 0, // Passa o ID do TMDb como 'id' com fallback para 0
              tmdb_id: fav.tmdb_id,
              title: fav.title,
              poster_path: fav.poster_path,
              rating: fav.rating,
              overview: "" // Não temos overview na lista de favoritos
            }
            
            // 7. Checa se o filme está no 'favoriteLookup' DO *convidado*
            const isFavoritedByGuest = favoriteLookup.has(movie.id)
            
            return (
              <MovieCard 
                key={fav.id} // O ID do banco (UUID)
                movie={movie}
                // Passa os status/handlers do *convidado*
                isFavorited={isFavoritedByGuest}
                onToggleFavorite={() => handleToggle(movie)}
                isLoading={isFavLoading}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}