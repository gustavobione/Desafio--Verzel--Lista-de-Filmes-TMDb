import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Play } from "lucide-react"

interface TrailerDialogProps {
  movieId: number
  movieTitle: string
}

interface VideoResult {
  key: string
  site: string
}

export function TrailerDialog({ movieId, movieTitle }: TrailerDialogProps) {
  const [videoKey, setVideoKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const fetchTrailer = async () => {
        setIsLoading(true)
        try {
          const video = await api.get(`/tmdb/movie/${movieId}/videos/`) as VideoResult
          if (video && video.site === "YouTube") {
            setVideoKey(video.key)
          }
        } catch (error) {
          console.error("Erro ao buscar trailer:", error)
        }
        setIsLoading(false)
      }
      fetchTrailer()
    }
  }, [isOpen, movieId])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-primary/90">
          <Play className="mr-2 h-5 w-5" />
          Assistir Trailer
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[80vh] w-[80vw] max-w-[1400px] sm:max-w-none p-4 flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{movieTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex-grow w-full h-0">
          {isLoading && <p className="flex-grow w-full h-full flex items-center justify-center">Carregando trailer...</p>}
          {!isLoading && videoKey && (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
              title={movieTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="border-0 rounded-md"
            ></iframe>
          )}
          {!isLoading && !videoKey && (
            <p className="flex-grow w-full h-full flex items-center justify-center">Trailer não disponível.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}