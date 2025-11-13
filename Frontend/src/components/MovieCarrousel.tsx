import { type Movie, MovieCard } from "./MovieCard" 
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

  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          
          <div className="flex gap-2">
            <CarouselPrevious className="relative static translate-y-0" />
            <CarouselNext className="relative static translate-y-0" />
          </div>
        </div>

        <CarouselContent className="-ml-4">
          {movies.map((movie) => (
            <CarouselItem 
              key={movie.id} 
              className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5 xl:basis-1/6"
            >

              <MovieCard 
                movie={movie}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}