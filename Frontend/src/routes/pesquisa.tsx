// Arquivo: Frontend/src/routes/pesquisa.tsx
// (A PÁGINA "SMART" COMPLETA)

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input' // Para o search-box
import { MovieCard, type Movie } from '@/components/MovieCard'
import { useAuth } from '@/contexts/AuthContext'
import { SearchFilters, type Genre, type Filters } from '@/components/SearchFilters'
import { AppPagination } from '@/components/AppPagination'

// --- Hook de Debounce (para a busca em tempo real) ---
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}
// --- Fim do Hook ---

// 1. O 'loader' busca os dados iniciais (Gêneros e 1ª página de Populares)
export const Route = createFileRoute('/pesquisa')({
  loader: async () => {
    try {
      const [genreRes, movieRes] = await Promise.all([
        api.get('/tmdb/genres/'),
        api.get('/tmdb/discover/', { page: '1', sort_by: 'popularity.desc' })
      ])
      
      return {
        genres: genreRes.genres as Genre[],
        initialMovies: movieRes.results as Movie[],
        initialTotalPages: movieRes.total_pages as number
      }
    } catch (error) {
      console.error("Erro ao carregar dados da página de pesquisa:", error)
      return { genres: [], initialMovies: [], initialTotalPages: 1 }
    }
  },
  component: PesquisaPage,
})

function PesquisaPage() {
  // 2. Pega os dados iniciais do 'loader'
  const { genres, initialMovies, initialTotalPages } = Route.useLoaderData()
  
  // 3. Pega a lógica de favoritos do "Cérebro"
  const { user, toggleFavorite, favoriteLookup, isFavLoading } = useAuth()
  const navigate = useNavigate()

  // 4. ESTADO DA PÁGINA (O CÉREBRO "SMART")
  const [query, setQuery] = useState("") // O texto da barra de busca
  const [results, setResults] = useState(initialMovies)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    genre: "all",
    year: [new Date().getFullYear()], // Começa no ano atual
    rating: "0",
    sortBy: "popularity.desc"
  })

  // 5. LÓGICA DE BUSCA E FILTRO
  const debouncedQuery = useDebounce(query, 500) // 500ms de delay (busca em tempo real)

  // O 'useEffect' re-busca da API sempre que os filtros, a página ou o texto mudam
  useEffect(() => {
    // Não busca na carga inicial (já temos dados do loader)
    if (currentPage === 1 && !debouncedQuery && filters.genre === "all") {
      return
    }

    const fetchFilteredMovies = async () => {
      setIsLoading(true)
      
      const params: Record<string, string> = {
        page: String(currentPage),
      }

      // Adiciona filtros se eles não forem os padrões
      if (debouncedQuery) {
        params.query = debouncedQuery
      } else {
        // Só adiciona filtros de "discover" se não houver "query"
        params.sort_by = filters.sortBy
        if (filters.genre !== "all") {
          params.with_genres = filters.genre
        }
        params.primary_release_year = String(filters.year[0])
        if (filters.rating !== "0") {
          params.vote_average_gte = filters.rating
        }
      }
      
      try {
        // Chama a nova API "discover"
        const res = await api.get('/tmdb/discover/', params)
        setResults(res.results)
        setTotalPages(Math.min(res.total_pages, 20)) // Limita a 20 páginas como pedido
      } catch (error) {
        console.error("Erro ao buscar filmes:", error)
      }
      setIsLoading(false)
    }

    fetchFilteredMovies()
    
  }, [debouncedQuery, filters, currentPage]) // <- Dependências

  // 6. Handlers (passados para os componentes "burros")
  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reseta a paginação
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleToggleFavorite = (movie: Movie) => {
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    toggleFavorite(movie)
  }

  return (
    <div className="container mx-auto">
      
      {/* (Barra de Pesquisa de Texto) */}
      <Input
        type="text"
        placeholder="Pesquisar por nome em tempo real..."
        className="mb-8"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setCurrentPage(1) // Reseta a paginação
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Coluna 1: Filtros (Componente "Burro") */}
        <aside className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Filtros</h2>
          <SearchFilters
            genres={genres}
            filters={filters}
            onFiltersChange={handleFilterChange}
          />
        </aside>

        {/* Coluna 2: Resultados (Componente "Burro") */}
        <main className="md:col-span-3">
          {isLoading ? (
            <p>Carregando...</p> // TODO: Skeleton
          ) : (
            <>
              {/* A Grade de Filmes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie}
                    isFavorited={favoriteLookup.has(movie.id)}
                    onToggleFavorite={() => handleToggleFavorite(movie)}
                    isLoading={isFavLoading}
                  />
                ))}
              </div>
              
              {/* O Componente de Paginação */}
              <AppPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>
    </div>
  )
}