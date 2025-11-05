// Arquivo: Frontend/src/routes/index.tsx (Refatorado)

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { api } from '@/lib/api' 
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MovieCard, type Movie } from '@/components/MovieCard'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!query) return
    setIsLoading(true)
    try {
      const response = await api.get(`/search-tmdb/?query=${query}`)
      setResults(response.results)
    } catch (error) {
      console.error("Erro ao buscar filmes:", error)
    }
    setIsLoading(false)
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Buscando..." : "Buscar"}
        </Button>
      </form>

      {/* --- 3. Renderização Limpa --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}