// Arquivo: Frontend/src/components/TrailerDialog.tsx

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

  // Busca o trailer QUANDO o modal é aberto
  useEffect(() => {
    if (isOpen) {
      const fetchTrailer = async () => {
        setIsLoading(true)
        try {
          // Chama nossa nova API do backend
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
  }, [isOpen, movieId]) // Depende do 'isOpen'

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* O botão que "abre" o modal */}
        <Button size="lg" className="bg-primary/90">
          <Play className="mr-2 h-5 w-5" />
          Assistir Trailer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-4">
          <DialogTitle>{movieTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex-grow w-full h-full">
          {isLoading && <p className="text-center">Carregando trailer...</p>}
          {!isLoading && videoKey && (
            // O player do YouTube embutido
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
              title={movieTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
          {!isLoading && !videoKey && (
            <p className="text-center p-8">Trailer não disponível.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}