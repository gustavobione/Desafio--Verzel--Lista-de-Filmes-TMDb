import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

function CastImage({ path, alt }: { path: string | null; alt: string }) {
  const imageUrl = path
    ? `https://image.tmdb.org/t/p/w185${path}`
    : "" // Deixa vazio para o fallback funcionar

  if (path) {
    return (
      <img 
        src={imageUrl} 
        alt={alt}
        className="w-full h-full object-cover"
      />
    )
  }
  

  return (
    <div className="w-full h-full bg-muted flex items-center justify-center">
      <span className="text-xs text-muted-foreground">Sem Foto</span>
    </div>
  )
}

export function CastCarousel({ credits }: { credits: any }) {
  const cast = credits?.cast.slice(0, 15)
  if (!cast || cast.length === 0) return null

  return (
    <section>
      <Carousel 
        opts={{ align: "start", loop: false }} 
        className="w-full"
      >
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Elenco Principal</h2>
          
          <div className="flex gap-2">
            <CarouselPrevious className="relative static translate-y-0" />
            <CarouselNext className="relative static translate-y-0" />
          </div>
        </div>

        <CarouselContent className="-ml-4">
          {cast.map((person: any) => (
            <CarouselItem 
              key={person.id} 
              className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 xl:basis-1/8"
            >
              
              <div className="block text-center">
                
                <div className="aspect-[3/4] w-full rounded-md overflow-hidden bg-muted">
                  <CastImage path={person.profile_path} alt={person.name} />
                </div>
                <p className="text-sm font-semibold mt-2 truncate">{person.name}</p>
                <p className="text-xs text-muted-foreground truncate">{person.character}</p>
              </div>

            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}