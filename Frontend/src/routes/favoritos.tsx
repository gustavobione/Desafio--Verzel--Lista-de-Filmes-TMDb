import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MovieCarousel } from '@/components/MovieCarrousel' 
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Share2 } from 'lucide-react'
import { api } from '@/lib/api'

export const Route = createFileRoute('/favoritos')({
  component: FavoritosPage,

})

function FavoritosPage() {
  const { 
    user,
    isLoading,
    favorites, 
    watchLater,
    watched,
  } = useAuth()
  
  const navigate = useNavigate()

  const [shareLink, setShareLink] = useState("")
  const [isCreatingLink, setIsCreatingLink] = useState(false)

  const handleShare = async () => {
    setIsCreatingLink(true)
    try {
      const response = await api.post('/shared-lists/', {})
      const newLink = `${window.location.origin}/share/${response.id}`
      setShareLink(newLink)
    } catch (error) {
      console.error("Erro ao criar link:", error)
    }
    setIsCreatingLink(false)
  }

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ 
        to: '/login', 
        search: { redirect: '/favoritos' }
      })
    }
  }, [isLoading, user, navigate])

  if (isLoading) {
    return <div>Carregando...</div> 
  }

  return (
    <div className="container max-w-full px-[5%] md:px-[10%] py-8">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Minhas Listas</h1>
        <Button 
          onClick={handleShare} 
          disabled={isCreatingLink || favorites.length === 0}
        >
          <Share2 className="mr-2 h-4 w-4" />
          {isCreatingLink ? "Gerando Link..." : "Compartilhar Favoritos"}
        </Button>
      </div>

      {shareLink && (
        <div className="flex gap-2 mb-6 p-4 bg-muted rounded-lg">
          <Input type="text" readOnly value={shareLink} className="flex-grow bg-white" />
          <Button onClick={() => navigator.clipboard.writeText(shareLink)}>
            Copiar
          </Button>
        </div>
      )}
      
      <div className="flex flex-col gap-12">
        
        {/* --- Lista: Favoritos --- */}
        <section>
          {favorites.length === 0 ? (
            <div className="p-4 rounded-lg bg-muted">
              <h2 className="text-2xl font-semibold mb-4">Meus Favoritos</h2>
              <p>Você ainda não salvou nenhum filme aqui.</p>
            </div>
          ) : (
            <MovieCarousel 
              title="Meus Favoritos" 
              movies={favorites.map(entry => ({
                ...entry,
                id: entry.tmdb_id, 
                vote_average: entry.rating, 
                title: (entry as any).title ?? '',
                poster_path: (entry as any).poster_path ?? '',
                overview: (entry as any).overview ?? '',
              }))} 
            />
          )}
        </section>

        {/* --- Lista: Assistir Depois --- */}
        <section>
          {watchLater.length === 0 ? (
            <div className="p-4 rounded-lg bg-muted">
              <h2 className="text-2xl font-semibold mb-4">Assistir Depois</h2>
              <p>Você ainda não salvou nenhum filme aqui.</p>
            </div>
          ) : (
            <MovieCarousel 
              title="Assistir Depois" 
              movies={watchLater.map(entry => ({
                ...entry,
                id: entry.tmdb_id,
                vote_average: entry.rating,
                title: (entry as any).title ?? '',
                poster_path: (entry as any).poster_path ?? '',
                overview: (entry as any).overview ?? '',
              }))} 
            />
          )}
        </section>

        {/* --- Lista: Já Assistidos --- */}
        <section>
          {watched.length === 0 ? (
            <div className="p-4 rounded-lg bg-muted">
              <h2 className="text-2xl font-semibold mb-4">Já Assistidos</h2>
              <p>Você ainda não marcou filmes como assistidos.</p>
            </div>
          ) : (
            <MovieCarousel 
              title="Já Assistidos" 
              movies={watched.map(entry => ({
                ...entry,
                id: entry.tmdb_id,
                vote_average: entry.rating,
                title: (entry as any).title ?? '',
                poster_path: (entry as any).poster_path ?? '',
                overview: (entry as any).overview ?? '',
              }))} 
            />
          )}
        </section>
      </div>
    </div>
  )
}