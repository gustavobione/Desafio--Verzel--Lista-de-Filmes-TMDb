// Arquivo: Frontend/src/routes/filme.$movieId.tsx
// (Refatorado V6: A página agora é "Burra" e o Hero é "Smart")

import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/lib/api'
// REMOVIDOS: useAuth, useNavigate, Movie
import { HeroHeader } from '@/components/movie/HeroHeader'
import { CastCarousel } from '@/components/movie/CastCarousel'
import { MetadataSidebar } from '@/components/movie/MetaDataSidebar'

// Loader (sem mudanças)
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

// --- A PÁGINA "BURRA" ---
function MovieDetailPage() {
  const movie = Route.useLoaderData()
  // REMOVIDOS: useAuth, useNavigate, isFavorited, handleToggle
  
  if (!movie) {
    return <div>Filme não encontrado.</div>
  }

  return (
    <div className="flex flex-col gap-12">
      
      {/* 1. HERO HEADER "SMART" (Não precisa mais de props de auth) */}
      <section>
        <HeroHeader 
          movie={movie} 
        />
      </section>
      
      {/* 2. LAYOUT DO CONTEÚDO (sem mudanças) */}
      <div className="container max-w-full px-[5%] md:px-[10%] flex flex-col lg:flex-row gap-8">
        
        <div className="w-full lg:flex-1 min-w-0 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Sinopse</h2>
            <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
          </section>
          <CastCarousel credits={movie.credits} />
        </div>

        <aside className="w-full lg:w-[380px] flex-shrink-0">
          <MetadataSidebar movie={movie} />
        </aside>
      </div>
    </div>
  )
}