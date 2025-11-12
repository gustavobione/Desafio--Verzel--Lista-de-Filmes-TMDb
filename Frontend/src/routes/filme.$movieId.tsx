// Arquivo: Frontend/src/routes/filme.$movieId.tsx

// ... (imports e 'Route' (loader) - sem mudanças) ...
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import type { Movie } from '@/components/MovieCard'
import { HeroHeader } from '@/components/movie/HeroHeader'
import { CastCarousel } from '@/components/movie/CastCarousel'
import { MetadataSidebar } from '@/components/movie/MetaDataSidebar'

export const Route = createFileRoute('/filme/$movieId')({
  loader: async ({ params }) => { 
    try {
      const movieDetails: any = await api.get(`/tmdb/movie/${params.movieId}/`)
      return movieDetails
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error)
      return null
    }
  },
  component: MovieDetailPage,
})

// --- A PÁGINA "SMART" (com o layout corrigido) ---
function MovieDetailPage() {
  const movie = Route.useLoaderData()
  const { user, favoriteLookup, toggleFavorite, isFavLoading } = useAuth()
  const navigate = useNavigate()
  
  if (!movie) {
    return <div>Filme não encontrado.</div>
  }

  // (Lógica 'isFavorited' e 'handleToggle' - sem mudanças)
  const isFavorited = favoriteLookup.has(movie.id)
  const handleToggle = () => {
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    const moviePayload: Movie = {
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
    <div className="flex flex-col gap-12">
      
      {/* --- 1. HERO HEADER (Full-width - sem mudanças) --- */}
      <section className="-mx-4 -mt-4">
        <HeroHeader 
          movie={movie} 
          isFavorited={isFavorited} 
          onToggleFavorite={handleToggle} 
          isFavLoading={isFavLoading}
        />
      </section>
      
      {/* --- 2. LAYOUT PRINCIPAL (A CORREÇÃO ESTÁ AQUI) --- */}
      {/* - Trocamos 'grid' por 'flex' em telas 'lg' (grandes).
        - 'flex-col' no mobile, 'lg:flex-row' no desktop.
      */}
      <div className="container max-w-full px-[5%] md:px-[10%] flex flex-col lg:flex-row gap-8">
        
        {/* --- 3. COLUNA ESQUERDA (Sinopse e Elenco) --- */}
        {/* - 'lg:flex-1' faz esta coluna "crescer" e ocupar o 
            espaço restante.
          - 'min-w-0' é um truque para o flexbox não quebrar
            com o carrossel.
        */}
        <div className="w-full lg:flex-1 min-w-0 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Sinopse</h2>
            <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
          </section>
          <CastCarousel credits={movie.credits} />
        </div>

        {/* --- 4. COLUNA DIREITA (Sidebar) --- */}
        {/* - 'lg:w-[380px]' dá à sidebar uma largura fixa em 
            telas grandes.
          - 'flex-shrink-0' impede que ela encolha.
          - O 'md:col-span-1' foi removido.
        */}
        <aside className="w-full lg:w-[20%] flex-shrink-0">
          {/* O seu componente <MetadataSidebar> (que tem o bg-muted)
              vai preencher perfeitamente esta <aside> de 380px. */}
          <MetadataSidebar movie={movie} />
        </aside>
      </div>
    </div>
  )
}