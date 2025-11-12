// Arquivo: Frontend/src/components/HeroCarousel.tsx
// (Atualizado para ser "Smart" e ter botões de ação)

import type { Movie } from "./MovieCard"
import { Link, useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/contexts/AuthContext" // <-- 1. Importa o "Cérebro"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { TrailerDialog } from "./TrailerDialog" // <-- 2. Importa o Modal do Trailer
import { Heart } from "lucide-react"
import { RatingBadge } from "./RaitingBadge"

interface HeroCarouselProps {
  movies: Movie[]
}

export function HeroCarousel({ movies }: HeroCarouselProps) {
  // 3. Pega toda a lógica de favoritos do "Cérebro"
  const { user, favoriteLookup, toggleFavorite, isFavLoading } = useAuth()
  const navigate = useNavigate()

  // 4. Handler para favoritar (agora centralizado)
  const handleToggle = (movie: Movie) => {
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    toggleFavorite(movie)
  }

  return (
    <Carousel
      className="w-full -mt-4" // -mt-4 para "puxar" para baixo do header
      opts={{ loop: true }}
    >
      <CarouselContent>
        {movies.map((movie) => {
          // 5. Checa se este filme é favorito (lógica "smart")
          const isFavorited = favoriteLookup.has(movie.id)

          return (
            <CarouselItem key={movie.id}>
              <div className="relative h-[60vh] md:h-[80vh] w-full">
                {/* Imagem de Fundo */}
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover brightness-50"
                />
                {/* Overlay de Gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

                {/* Conteúdo */}
                <div className="absolute bottom-0 left-0 p-8 md:p-16 text-white">
                  <h1 className="text-4xl md:text-6xl font-bold max-w-2xl">
                    {movie.title}
                  </h1>
                  <div className="flex items-center gap-4 mt-4">
                    {/* --- O CÍRCULO DE NOTA ATUALIZADO --- */}
                    {/* (Usamos 'relative' no 'div' pai e 'absolute' no filho 
                  para que ele não afete o alinhamento do ano) */}

                      {/* --- O NOVO BADGE DE NOTA (Retangular) --- */}
                      <RatingBadge
                        rating={Math.round((movie.vote_average || 0) * 10)}
                      />
                    {/* (Adicionamos um 'ml-2' para dar espaço após o círculo) */}
                    <span className="text-lg font-semibold ml-2">
                      {new Date(movie.release_date ?? new Date()).getFullYear()}
                    </span>
                  </div>
                  <p className="mt-4 max-w-2xl text-lg text-gray-300 line-clamp-3">
                    {movie.overview}
                  </p>

                  {/* --- 6. BOTÕES DE AÇÃO ATUALIZADOS --- */}
                  <div className="flex flex-wrap items-center gap-2 mt-6">

                    {/* Botão "Assistir Trailer" (abre o modal) */}
                    <TrailerDialog movieId={movie.id} movieTitle={movie.title} />

                    {/* Botão "Ver Detalhes" (link) */}
                    <Button asChild size="lg" variant="outline" className="bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white">
                      <Link to="/filme/$movieId" params={{ movieId: String(movie.id) }}>
                        Ver Detalhes
                      </Link>
                    </Button>

                    {/* Botão "Favoritar" (lógica 'toggle') */}
                    <Button
                      size="lg"
                      variant={isFavorited ? "default" : "outline"}
                      onClick={() => handleToggle(movie)}
                      disabled={isFavLoading}
                      className="bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white"
                    >
                      <Heart
                        className="mr-2 h-4 w-4"
                        fill={isFavorited ? "currentColor" : "none"}
                      />
                      {isFavLoading ? "Salvando..." : (isFavorited ? "Remover" : "Favoritar")}
                    </Button>
                  </div>

                </div>
              </div>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <div className="hidden md:block">
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
      </div>
    </Carousel>
  )
}