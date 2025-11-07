// Arquivo: Frontend/src/routes/filme.$movieId.tsx
// (Corrigido: arquitetura limpa e sem erros de tipo)

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

// 1. Importa os componentes "burros" que acabamos de criar
import { HeroHeader } from '../components/movie/HeroHeader'
import { CastCarousel } from '../components/movie/CastCarousel'
import { MetadataSidebar } from '../components/movie/MetaDataSidebar'

// 2. CORREÇÃO: Não passamos a string da rota.
// Deixamos o TanStack Router inferir a rota pelo nome do arquivo.
export const Route = createFileRoute('/filme/$movieId')({
  // O 'loader' busca todos os detalhes ANTES da página carregar
  loader: async ({ params }: { params: { movieId: string } }) => {
    try {
      const movieDetails = await api.get(`/tmdb/movie/${params.movieId}/`)
      return movieDetails // Retorna os dados
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error)
      // TODO: Redirecionar para 404
      return null
    }
  },
  component: MovieDetailPage,
})

function MovieDetailPage() {
  // Pega os dados do 'loader' (o filme) e do 'cérebro' (o usuário)
  const movie = Route.useLoaderData()
  const { user, favoriteLookup, toggleFavorite, isFavLoading } = useAuth()
  const navigate = useNavigate()
  
  // Se o filme não carregou, não renderiza nada
  if (!movie) {
    return <div>Filme não encontrado.</div>
  }

  // Lógica "Smart" (a mesma da Home)
  const isFavorited = favoriteLookup.has(movie.id)
  const handleToggle = () => {
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    // O 'loader' do TanStack não retorna a interface 'Movie' completa
    // que o 'toggleFavorite' espera. Precisamos "adaptar" o objeto.
    const moviePayload = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
    }
    toggleFavorite(moviePayload)
  }

  return (
    <div className="flex flex-col">
      {/* --- Renderiza o Componente "Hero" (Burro) --- */}
      <HeroHeader 
        movie={movie} 
        isFavorited={isFavorited} 
        onToggleFavorite={handleToggle} 
        isFavLoading={isFavLoading}
      />
      
      {/* --- Layout Principal (Grid de 2 Colunas) --- */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        
        {/* Coluna Esquerda (Elenco e Sinopse) */}
        <div className="md:col-span-2 space-y-8">
          {/* Componente "Cast" (Burro) */}
          <CastCarousel credits={movie.credits} />

          {/* Sinopse (Descrição) */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Sinopse</h2>
            <p className="text-muted-foreground">{movie.overview}</p>
          </section>
        </div>

        {/* Coluna Direita (Metadata) */}
        <aside className="md:col-span-1">
          {/* Componente "Metadata" (Burro) */}
          <MetadataSidebar movie={movie} />
        </aside>
      </div>
    </div>
  )
}