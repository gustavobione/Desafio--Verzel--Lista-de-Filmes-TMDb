// Arquivo: Frontend/src/routes/index.tsx
// (A nova Home Page "Smart", inspirada no LUMIÈRE)

import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/lib/api'
import type { Movie } from '@/components/MovieCard' // (Importa a interface)
import { HeroCarousel } from '../components/HeroCarrousel'
import { MovieGrid } from '@/components/MovieGrid'
import { CallToAction } from '@/components/CallToAction'
import { Top10List } from '@/components/Top10List'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MovieCarousel } from '@/components/MovieCarrousel'
import { Search, Heart, Share2 } from "lucide-react"

// 1. O 'loader' busca TODOS os dados da Home Page de uma vez
export const Route = createFileRoute('/')({
  loader: async () => {
    try {
      // Carrega os 3 endpoints em paralelo
      const [
        trendingWeekRes,
        popularRes,
        nowPlayingRes,
        topRatedRes,
        upcomingRes,
      ] = await Promise.all([
        api.get('/tmdb/trending/week/'),
        api.get('/tmdb/popular/'),
        api.get('/tmdb/now-playing/'),
        api.get('/tmdb/top-rated/'),
        api.get('/tmdb/upcoming/'),
      ])

      return {
        trendingWeek: trendingWeekRes.results as Movie[],
        popular: popularRes.results as Movie[],
        nowPlaying: nowPlayingRes.results as Movie[],
        topRated: topRatedRes.results as Movie[],
        upcoming: upcomingRes.results as Movie[],
      }
    } catch (error) {
      console.error("Erro ao carregar dados da Home:", error)
      return {
        trendingWeek: [],
        popular: [],
        nowPlaying: [],
        topRated: [],
        upcoming: []
      }
    }
  },
  component: HomePage,
})

function HomePage() {
  // 2. Pega os dados que o 'loader' buscou
  const { popular, nowPlaying, trendingWeek, topRated, upcoming } = Route.useLoaderData()

  // 3. Pega os 5 primeiros filmes "populares" para o Hero
  const heroMovies = trendingWeek.slice(0, 5)

  return (
    // Remove o 'container' daqui para o Hero pegar a tela cheia
    <div className="flex flex-col gap-12 ">

      {/* --- 1. HERO CAROUSEL --- */}
      <section className="-mt-4 -mx-4">
        <HeroCarousel movies={heroMovies} />
      </section>

      {/* --- 2. ABAS (Tabs) --- */}
      <div className="container max-w-full px-[5%] md:px-[10%] space-y-12">
        <section>
          <Top10List title="Top 10 Filmes em Alta Está Semana" movies={trendingWeek} />
        </section>

        {/* --- 3. SEÇÃO DE CTAs (Sempre visível) --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CallToAction
            icon={Search}
            title="Explore o Catálogo"
            description="Use nossos filtros avançados para encontrar exatamente o que você procura."
            buttonText="Ir para a Pesquisa"
            linkTo="/pesquisa"
          />
          <CallToAction
            icon={Heart}
            title="Sua Lista Pessoal"
            description="Acesse sua coleção de filmes salvos. Perfeito para organizar o que você ama."
            buttonText="Ver Meus Favoritos"
            linkTo="/favoritos"
          />
          <CallToAction
            icon={Share2}
            title="Mostre seu Gosto"
            description="Gere um link público da sua lista para mostrar seu incrível repertório de filmes."
            buttonText="Compartilhar Lista"
            linkTo="/favoritos" // (O botão de gerar link está na pág. de favoritos)
          />
        </section>

        <section>
          <Tabs defaultValue="popular" className="w-full">
            <TabsList>
              <TabsTrigger value="popular">Filmes Populares</TabsTrigger>
              <TabsTrigger value="now-playing">Filmes Novos (Em Cartaz)</TabsTrigger>
              <TabsTrigger value="top-rated">Melhor Nota</TabsTrigger>
              <TabsTrigger value="upcoming">Lançando em Breve</TabsTrigger>
            </TabsList>

            {/* Conteúdo: Populares */}
            <TabsContent value="popular" className="mt-6">
              <MovieGrid
                movies={popular}
                viewMoreLink="/pesquisa?sort_by=popularity.desc"
              />
            </TabsContent>

            {/* Conteúdo: Novos */}
            <TabsContent value="now-playing" className="mt-6">
              <MovieGrid
                movies={nowPlaying}
                viewMoreLink="/pesquisa?sort_by=trending.desc"
              />
            </TabsContent>

            {/* Conteúdo: Melhor Nota */}
            <TabsContent value="top-rated" className="mt-6">
              <MovieGrid
                movies={topRated}
                viewMoreLink="/pesquisa?sort_by=vote_average.desc"
              />
            </TabsContent>

            {/* Conteúdo: Lançando em Breve */}
            <TabsContent value="upcoming" className="mt-6">
              <MovieGrid
                movies={upcoming}
              />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  )
}