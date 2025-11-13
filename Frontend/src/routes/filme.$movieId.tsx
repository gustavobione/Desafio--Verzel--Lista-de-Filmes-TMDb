import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/lib/api'
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


function MovieDetailPage() {
  const movie = Route.useLoaderData()
  
  if (!movie) {
    return <div>Filme não encontrado.</div>
  }

  return (
    <div className="flex flex-col gap-12">
      
      <section>
        <HeroHeader 
          movie={movie} 
        />
      </section>
      
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