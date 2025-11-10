import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MovieCard, type Movie } from '@/components/MovieCard'
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
    toggleFavorite, 
    favoriteLookup, 
    isFavLoading 
  } = useAuth()
  
  const navigate = useNavigate()

  // 5. Estados para o link de compartilhamento
  const [shareLink, setShareLink] = useState("")
  const [isCreatingLink, setIsCreatingLink] = useState(false)

  // 6. Lógica para criar o link
  const handleShare = async () => {
    setIsCreatingLink(true)
    try {
      // Chama a API V2 segura (POST) que você testou
      const response = await api.post('/shared-lists/', {})
      
      // Monta a URL completa do frontend (localhost)
      const newLink = `${window.location.origin}/share/${response.id}`
      setShareLink(newLink)

    } catch (error) {
      console.error("Erro ao criar link:", error)
      // TODO: Adicionar Toast de erro
    }
    setIsCreatingLink(false)
  }

  // Efeito de redirecionamento se não estiver logado
  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ 
        to: '/login', 
        search: { redirect: '/favoritos' } // Salva onde ele queria ir
      })
    }
  }, [isLoading, user, navigate])

  if (isLoading) {
    return <div>Carregando...</div>
  }

  // 5. Se chegou aqui, o usuário ESTÁ logado
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meus Favoritos</h1>
        
        {/* 7. O Botão de Compartilhar */}
        <Button 
          onClick={handleShare} 
          disabled={isCreatingLink || favorites.length === 0}
        >
          <Share2 className="mr-2 h-4 w-4" />
          {isCreatingLink ? "Gerando..." : "Compartilhar Lista"}
        </Button>
      </div>

      {/* 8. Campo para mostrar o link gerado */}
      {shareLink && (
        <div className="flex gap-2 mb-6 p-4 bg-muted rounded-lg">
          <Input 
            type="text" 
            readOnly 
            value={shareLink} 
            className="flex-grow bg-white"
          />
          <Button onClick={() => navigator.clipboard.writeText(shareLink)}>
            Copiar
          </Button>
        </div>
      )}
      
      {favorites.length === 0 ? (
        <p>Você ainda não salvou nenhum filme.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {favorites.map((fav) => {
            const movie: Movie = {
              id: fav.tmdb_id,
              tmdb_id: fav.tmdb_id,
              title: fav.title,
              poster_path: fav.poster_path,
              rating: fav.rating,
              overview: "" 
            }
            return (
              <MovieCard 
                key={fav.id}
                movie={movie}
                isFavorited={favoriteLookup.has(movie.id)}
                onToggleFavorite={() => toggleFavorite(movie)}
                isLoading={isFavLoading}
                
              />
            )
          })}
        </div>
      )}
    </div>
  )
}