import { type Movie, MovieCard } from "./MovieCard"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "@tanstack/react-router"
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
  // Pega a lógica do "cérebro" (AuthContext)
  const { user, toggleFavorite, favoriteLookup, isFavLoading } = useAuth()
  const navigate = useNavigate()

  // O handler de toggle é o mesmo da Home (redireciona se não logado)
  const handleToggle = (movie: Movie) => {
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    toggleFavorite(movie)
  }

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
        <CarouselContent>
          {movies.map((movie) => (
            <CarouselItem key={movie.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
              <MovieCard 
                movie={movie}
                isFavorited={favoriteLookup.has(movie.id)}
                onToggleFavorite={() => handleToggle(movie)}
                isLoading={isFavLoading}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  )
}