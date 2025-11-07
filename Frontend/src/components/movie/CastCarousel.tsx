// Arquivo: Frontend/src/components/movie/CastCarousel.tsx

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { User as UserIcon } from "lucide-react"

export function CastCarousel({ credits }: { credits: any }) {
  const cast = credits?.cast.slice(0, 15)
  if (!cast || cast.length === 0) return null

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Elenco Principal</h2>
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {cast.map((person: any) => (
            <CarouselItem key={person.id} className="basis-1/3 md:basis-1/4 lg:basis-1/6">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage 
                    src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : ""} 
                  />
                  <AvatarFallback><UserIcon /></AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium mt-2">{person.name}</p>
                <p className="text-xs text-muted-foreground">{person.character}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  )
}