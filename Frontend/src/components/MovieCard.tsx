// Arquivo: Frontend/src/components/MovieCard.tsx
// (Atualizado com o botão de Favoritar)

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react" // <-- 1. Ícone
import { useAuth } from "@/contexts/AuthContext" // <-- 2. Nosso "cérebro" de login
import { api } from "@/lib/api" // <-- 3. Nosso 'fetch' seguro
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

export interface Movie {
  id: number
  tmdb_id?: number // O ID do TMDb (para o POST)
  title: string
  poster_path: string
  overview: string
  rating?: number
}

interface MovieCardProps {
  movie: Movie
  // TODO: Adicionar um prop 'isFavorited' no futuro
}

export function MovieCard({ movie }: MovieCardProps) {
  const { user } = useAuth() // Pega o usuário logado
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image"

  // 4. A LÓGICA DE FAVORITAR
  const handleFavorite = async () => {
    setIsLoading(true)
    // A. Checa se o usuário está logado
    if (!user) {
      // Se não estiver, redireciona para o login
      navigate({ to: '/login' })
      return
    }

    // B. Se estiver logado, chama nossa API (V2) segura
    try {
      // Monta o payload que nosso backend Django espera
      const payload = {
        tmdb_id: movie.id, // O ID do TMDb
        title: movie.title,
        poster_path: movie.poster_path,
        rating: movie.rating || 7.0, // (TMDb 'rating' é 'vote_average')
      }

      // O 'api.post' já envia o Token do Firebase automaticamente!
      await api.post('/favorites/', payload)

      alert(`${movie.title} salvo nos favoritos!`) // Sucesso!
      // TODO: Mudar o 'alert' por um 'Toast' do Shadcn

    } catch (error) {
      console.error("Erro ao favoritar:", error)
      alert(`Erro ao salvar: ${error}`)
      // TODO: Mudar o 'alert' por um 'Toast'
    }
    setIsLoading(false)
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg h-14 line-clamp-2">{movie.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <img 
          src={posterUrl} 
          alt={movie.title}
          className="rounded-md mb-4 aspect-[2/3] object-cover"
        />
        <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
          {movie.overview}
        </p>

        {/* 5. O BOTÃO DE FAVORITAR */}
        <Button 
          variant="outline" 
          className="w-full mt-4" 
          onClick={handleFavorite}
          disabled={isLoading}
        >
          <Heart className="mr-2 h-4 w-4" />
          {isLoading ? "Salvando..." : "Favoritar"}
        </Button>
      </CardContent>
    </Card>
  )
}