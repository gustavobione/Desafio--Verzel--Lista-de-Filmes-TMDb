import type { Movie } from "./MovieCard"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"

interface HeroCarouselProps {
  movies: Movie[]
}

export function HeroCarousel({ movies }: HeroCarouselProps) {
  return (
    <Carousel 
      className="w-full -mt-4" // -mt-4 para "puxar" para baixo do header
      opts={{ loop: true }}
      // (Você pode adicionar Autoplay aqui depois, se quiser)
    >
      <CarouselContent>
        {movies.map((movie) => (
          <CarouselItem key={movie.id}>
            <div className="relative h-[60vh] md:h-[80vh] w-full">
              {/* Imagem de Fundo */}
              <img
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
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
                  <Badge variant="destructive" className="text-lg">
                    {Math.round((movie.vote_average || 0) * 10)}%
                  </Badge>
                  <span className="text-lg">
                    {new Date(movie.release_date ?? new Date()).getFullYear()}
                  </span>
                </div>
                <p className="mt-4 max-w-2xl text-lg text-gray-300 line-clamp-3">
                  {movie.overview}
                </p>
                {/* TODO: Adicionar botões de "Ver Detalhes" e "Favoritar" aqui */}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:block">
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
      </div>
    </Carousel>
  )
}