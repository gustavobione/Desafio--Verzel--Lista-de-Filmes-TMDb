// Arquivo: Frontend/src/components/MovieCarousel.tsx
// (Refatorado V5: "Burro", com setas no topo e usando MovieCard "Smart")

import { type Movie, MovieCard } from "./MovieCard" // <-- Importa o MovieCard V5 (smart)
// REMOVIDOS: useAuth, useNavigate
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface MovieCarouselProps {
  title: string
  movies: Movie[]
}

export function MovieCarousel({ title, movies }: MovieCarouselProps) {
  // REMOVIDOS: useAuth, useNavigate, handleToggle (o MovieCard V5 cuida disso)

  return (
    <div className="w-full">
      {/* 1. O <Carousel> agora envolve TUDO */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        
        {/* 2. O TÍTULO E AS SETAS (no topo, para consistência) */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          
          <div className="flex gap-2">
            <CarouselPrevious className="relative static translate-y-0" />
            <CarouselNext className="relative static translate-y-0" />
          </div>
        </div>

        {/* 3. O CONTEÚDO DO CARROSSEL */}
        {/* '-ml-4' (para compensar o 'pl-4') */}
        <CarouselContent className="-ml-4">
          {movies.map((movie) => (
            <CarouselItem 
              key={movie.id} 
              // 'pl-4' (gap) e 'basis' (tamanho)
              className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5 xl:basis-1/6"
            >
              
              {/* 4. O MovieCard V5 (smart) cuida de si mesmo.
                  Não precisamos passar 'isFavorited' ou 'onToggleFavorite'.
              */}
              <MovieCard 
                movie={movie}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* As setas antigas (flutuantes) foram removidas */}
      </Carousel>
    </div>
  )
}