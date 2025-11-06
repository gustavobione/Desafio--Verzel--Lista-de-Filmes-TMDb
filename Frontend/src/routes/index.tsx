// Arquivo: Frontend/src/routes/index.tsx
// (Página "SMART", mas com lógica centralizada)

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { api } from '@/lib/api' 
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MovieCard, type Movie } from '@/components/MovieCard'
import { useAuth } from '@/contexts/AuthContext' // <-- 1. Importa o "Cérebro"

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  // 2. Pega a lógica de favoritos do "Cérebro"
  const { 
    user, 
    toggleFavorite, 
    favoriteLookup, 
    isFavLoading 
  } = useAuth()
  
  const navigate = useNavigate()

  // Estados de pesquisa (continuam locais da página)
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!query) return
    setSearchLoading(true)
    try {
      const response = await api.get('/search-tmdb/', { query: query })
      setSearchResults(response.results)
    } catch (error) {
      console.error("Erro ao buscar filmes:", error)
    }
    setSearchLoading(false)
  }

  // 3. O Handler de Toggle agora é SIMPLES
  const handleToggle = (movie: Movie) => {
    // Se não estiver logado, redireciona
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    // Se estiver logado, chama a função do "Cérebro"
    toggleFavorite(movie)
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Busca de Filmes (TMDb)</h1>
      
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input 
          type="text"
          placeholder="Digite o nome de um filme..."
          className="flex-grow"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" disabled={searchLoading}>
          {searchLoading ? "Buscando..." : "Buscar"}
        </Button>
      </form>

      {/* 4. Renderização passa as props do "Cérebro" */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {searchResults.map((movie) => {
          // Checa o status no "mapa" vindo do "Cérebro"
          const isFavorited = favoriteLookup.has(movie.id)
          
          return (
            <MovieCard 
              key={movie.id} 
              movie={movie}
              isFavorited={isFavorited}
              onToggleFavorite={() => handleToggle(movie)} // Passa o handler simples
              isLoading={isFavLoading} // Passa o loading global
            />
          )
        })}
      </div>
    </div>
  )
}