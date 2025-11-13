import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { MovieCard, type Movie } from '@/components/MovieCard'


export const Route = createFileRoute('/share/$listId')({
  loader: async ({ params }) => {
    const { listId } = params
    try {
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          
          {friendsFavorites.map((fav: any) => {
            
            const movie: Movie = {
              id: fav.tmdb_id, 
              tmdb_id: fav.tmdb_id,
              title: fav.title,
              poster_path: fav.poster_path,
              rating: fav.rating, 
              overview: "", 
              vote_average: fav.rating, 
              release_date: "" 
            }
            
            return (
              <MovieCard 
                key={fav.id} 
                movie={movie}

              />
            )
          })}
        </div>
      )}
    </div>
  )
}