// Arquivo: Frontend/src/routes/favoritos.tsx
// (Página segura, com carregamento de dados)

import { createFileRoute, redirect } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { MovieCard, type Movie } from '@/components/MovieCard'

export const Route = createFileRoute('/favoritos')({
  // 1. ANTES de carregar a página:
  beforeLoad: ({ context, location }: { context: any; location: any }) => {
    // Checa se o usuário está logado (do nosso context)
    if (!context?.auth?.user) {
      // Se não estiver, redireciona para o login
      throw redirect({
        to: '/login',
        search: {
          // Salva a página que ele tentou acessar
          redirect: location.href,
        },
      })
    }
  },
  // 2. CARREGADOR DE DADOS:
  // Roda se o 'beforeLoad' passar.
  loader: async () => {
    try {
      // Chama nossa API segura (o token já vai no 'api.get')
      const favorites = await api.get('/favorites/')
      return favorites as Movie[] // Retorna a lista
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error)
      return [] // Retorna uma lista vazia em caso de erro
    }
  },
  component: FavoritosPage,
})

function FavoritosPage() {
  // 3. Pega os dados que o 'loader' retornou
  const favorites = Route.useLoaderData()

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Meus Favoritos</h1>

      {favorites.length === 0 ? (
        <p>Você ainda não salvou nenhum filme.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* 4. Reutiliza o MovieCard para mostrar a lista */}
          {favorites.map((movie) => (
            // (O 'movie' aqui vem do nosso Backend)
            <MovieCard key={movie.id} movie={{
              ...movie,
              id: movie.tmdb_id! // O MovieCard espera 'id' como TMDb ID
            }} />
          ))}
        </div>
      )}
    </div>
  )
}