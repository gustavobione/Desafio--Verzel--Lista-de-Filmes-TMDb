import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: HomePage,
})

interface MovieResult {
  id: number
  title: string
  poster_path: string
  overview: string
}

function HomePage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<MovieResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!query) return
    
    setIsLoading(true)
    try {
      // A chamada da API é a mesma, mas agora usa 'fetch'
      const response = await api.get('/search-tmdb/', {
        query: query
      })
      
      // 2. MUDANÇA: O 'response' já é o objeto 'data'
      setResults(response.results) 
    } catch (error) {
      console.error("Erro ao buscar filmes:", error)
      // TODO: Mostrar um Toast de erro
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

      {/* --- Exibição dos Resultados (sem mudanças) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((movie) => (
          <Card key={movie.id}>
            <CardHeader>
              <CardTitle className="text-lg">{movie.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                className="rounded-md mb-4"
              />
              <p className="text-sm text-muted-foreground line-clamp-3">
                {movie.overview}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}