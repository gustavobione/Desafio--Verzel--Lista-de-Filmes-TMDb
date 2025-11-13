import { Link } from "@tanstack/react-router"
import type { Movie } from "./MovieCard"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Top10ListProps {
  movies: Movie[]
  title: string
}

export function Top10List({ movies, title }: Top10ListProps) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 gap-1 px-1">
          {movies.slice(0, 10).map((movie, index) => (
            <CarouselItem 
              key={movie.id} 
              className="pl-2 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
            >
              <Link 
                to="/filme/$movieId" 
                params={{ movieId: String(movie.id) }}
                className="group relative aspect-[2/3] rounded-md overflow-hidden transition-transform transform-gpu hover:scale-105 block"
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute -bottom-6 -left-3">
                  <span className="text-9xl font-bold text-background/80 stroke-black group-hover:text-primary transition-colors [text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)]">
                    {index + 1}
                  </span>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  )
}