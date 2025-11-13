// Arquivo: Frontend/src/routes/share.$listId.tsx
// (Refatorado V4: Grid responsivo e usando MovieCard "Smart")

import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { MovieCard, type Movie } from '@/components/MovieCard'
// Não precisamos de useAuth ou useNavigate aqui, o MovieCard cuida disso.

export const Route = createFileRoute('/share/$listId')({
  // O loader busca a lista PÚBLICA
  loader: async ({ params }) => {
    const { listId } = params
    try {
      // Retorna uma lista de UserMovieEntry (do backend)
      const sharedMovies = await api.get(`/public-list/${listId}/`)
      return sharedMovies
    } catch (error) {
      console.error("Erro ao carregar lista pública:", error)
      return []
    }
  },
  component: SharePage,
})

function SharePage() {
  // 1. Pega a lista do *amigo* (vinda do loader)
  // O tipo é 'any' ou a interface do backend, vamos mapear abaixo
  const friendsFavorites = Route.useLoaderData()

  return (
    <div className="container max-w-full px-[5%] md:px-[10%] py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">Lista Compartilhada</h1>
        <p className="text-muted-foreground">
          Veja os filmes que foram selecionados nesta lista. 
          Clique no coração ou no menu para salvar na sua própria conta.
        </p>
      </div>
      
      {friendsFavorites.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-muted/50">
          <p className="text-lg font-medium">Esta lista não foi encontrada ou está vazia.</p>
        </div>
      ) : (
        // 2. O GRID RESPONSIVO
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          
          {friendsFavorites.map((fav: any) => {
            
            // 3. Adapta o objeto do backend para a interface 'Movie'
            const movie: Movie = {
              id: fav.tmdb_id, // O ID do filme (TMDb)
              tmdb_id: fav.tmdb_id,
              title: fav.title,
              poster_path: fav.poster_path,
              rating: fav.rating, // O rating que veio do banco
              // Campos opcionais que podem não vir na lista pública:
              overview: "", 
              vote_average: fav.rating, 
              release_date: "" // Data não é crítica na lista compacta
            }
            
            return (
              <MovieCard 
                key={fav.id} // O ID único da entrada no banco
                movie={movie}
                // NÃO passamos mais 'isFavorited' ou handlers.
                // O MovieCard V6 conecta-se ao AuthContext do USUÁRIO ATUAL
                // para saber se ELE tem esse filme.
              />
            )
          })}
        </div>
      )}
    </div>
  )
}