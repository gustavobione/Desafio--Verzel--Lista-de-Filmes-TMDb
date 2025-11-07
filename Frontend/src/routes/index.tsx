// Arquivo: Frontend/src/routes/index.tsx
// (A nova Home Page "Smart", inspirada no LUMIÈRE)

import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/lib/api' 
import type { Movie } from '@/components/MovieCard' // (Importa a interface)
import { HeroCarousel } from '../components/HeroCarrousel'
import { MovieCarousel } from '../components/MovieCarrousel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 1. O 'loader' busca TODOS os dados da Home Page de uma vez
export const Route = createFileRoute('/')({
  loader: async () => {
    try {
      // Carrega os 3 endpoints em paralelo
      const [popularRes, nowPlayingRes] = await Promise.all([
        api.get('/tmdb/popular/'),
        api.get('/tmdb/now-playing/')
      ])
      
      return {
        popular: popularRes.results as Movie[],
        nowPlaying: nowPlayingRes.results as Movie[],
      }
    } catch (error) {
      console.error("Erro ao carregar dados da Home:", error)
      return { popular: [], nowPlaying: [] }
    }
  },
  component: HomePage,
})

function HomePage() {
  // 2. Pega os dados que o 'loader' buscou
  const { popular, nowPlaying } = Route.useLoaderData()

  // 3. Pega os 5 primeiros filmes "populares" para o Hero
  const heroMovies = popular.slice(0, 5)
  
  return (
    // Remove o 'container' daqui para o Hero pegar a tela cheia
    <div className="flex flex-col gap-12">
      
      {/* --- 1. HERO CAROUSEL --- */}
      <section className="-mx-4 -mt-4"> {/* Remove os paddings do 'main' */}
        <HeroCarousel movies={heroMovies} />
      </section>

      {/* --- 2. ABAS (Tabs) --- */}
      <section className="container mx-auto">
        <Tabs defaultValue="popular" className="w-full">
          <TabsList>
            <TabsTrigger value="popular">Filmes Populares</TabsTrigger>
            <TabsTrigger value="now-playing">Filmes Novos (Em Cartaz)</TabsTrigger>
          </TabsList>
          
          {/* Conteúdo da Aba 1 */}
          <TabsContent value="popular" className="mt-4">
            <MovieCarousel title="" movies={popular} />
          </TabsContent>
          
          {/* Conteúdo da Aba 2 */}
          <TabsContent value="now-playing" className="mt-4">
            <MovieCarousel title="" movies={nowPlaying} />
          </TabsContent>
        </Tabs>
      </section>

      {/* (Aqui você pode adicionar mais MovieCarousels no futuro, 
         ex: "Top Rated", "Upcoming", etc,
         apenas adicionando mais endpoints no Backend e no loader)
      */}
      
    </div>
  )
}