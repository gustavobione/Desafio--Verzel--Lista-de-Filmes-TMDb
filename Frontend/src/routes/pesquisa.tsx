import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useMemo } from 'react'
import { api } from '@/lib/api'
import { MovieCard, type Movie } from '@/components/MovieCard'
import { SearchFilters, type Genre, type Language, type Provider, type Filters } from '@/components/SearchFilters'
import { AppPagination } from '@/components/AppPagination'
import {
  Sheet, SheetContent, SheetTrigger,
} from "@/components/ui/sheet"
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from "@/components/ui/skeleton"

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

const getTodayDate = () => new Date().toISOString().split('T')[0]
const getPastDate = (yearsAgo: number) => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - yearsAgo)
  return date.toISOString().split('T')[0]
}

export const Route = createFileRoute('/pesquisa')({
  loader: async () => {
    try {
      const [genreRes, langRes, providerRes, movieRes] = await Promise.all([
        api.get('/tmdb/genres/'),
        api.get('/tmdb/languages/'),
        api.get('/tmdb/watch-providers/'),
        api.get('/tmdb/discover/', { page: '1', sort_by: 'popularity.desc' })
      ])
      
      // Filtra os provedores para os 8 mais populares (Netflix, Disney, etc.)
      const popularProviderIds = [8, 9, 337, 384, 119, 531, 350, 2];
      
      return {
        genres: genreRes.genres as Genre[],
        languages: langRes as Language[],
        providers: providerRes.results.filter((p: Provider) => popularProviderIds.includes(p.provider_id)) as Provider[],
        initialMovies: movieRes.results as Movie[],
        initialTotalPages: movieRes.total_pages as number,
        initialTotalResults: movieRes.total_results as number,
      }
    } catch (error) {
      console.error("Erro ao carregar dados da página de pesquisa:", error)
      return { genres: [], languages: [], providers: [], initialMovies: [], initialTotalPages: 1, initialTotalResults: 0 }
    }
  },
  component: PesquisaPage,
})

function PesquisaPage() {
  const { 
    genres, 
    languages, 
    providers, 
    initialMovies, 
    initialTotalPages, 
    initialTotalResults 
  } = Route.useLoaderData()
  
  const [results, setResults] = useState(initialMovies)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [totalResults, setTotalResults] = useState(initialTotalResults)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const [filters, setFilters] = useState<Filters>({
    query: "",
    genres: [],
    certifications: [],
    languages: [],
    providers: [],
    releaseDate: {
      searchAll: true,
      from: getPastDate(5), 
      to: getTodayDate(),  
    },
    voteAverage: [0, 10],
    runtime: [0, 360],   
    sortBy: "popularity.desc"
  })

  const debouncedQuery = useDebounce(filters.query, 500)


  useEffect(() => {
    const fetchFilteredMovies = async () => {
      setIsLoading(true)
      
      let endpoint = '/tmdb/discover/' 
      const params: Record<string, string> = {
        page: String(currentPage),
      }

      if (debouncedQuery) {
        endpoint = '/search-tmdb/'
        params.query = debouncedQuery
      } 
      else {
        params.sort_by = filters.sortBy
        if (filters.genres.length > 0) {
          params.with_genres = filters.genres.join(',') // "E"
        }
        if (filters.providers.length > 0) {
          params.with_watch_providers = filters.providers.join('|') // "OU"
        }
        if (filters.languages.length > 0) {
          params.with_original_language = filters.languages.join('|') // "OU"
        }
        if (filters.certifications.length > 0) {
          params.certification_country = 'BR'
          params.certification = filters.certifications.join('|') // "OU"
        }
        if (!filters.releaseDate.searchAll) {
          params['release_date.gte'] = filters.releaseDate.from
          params['release_date.lte'] = filters.releaseDate.to
        }
        if (filters.voteAverage[0] > 0) {
          params['vote_average.gte'] = String(filters.voteAverage[0])
        }
        if (filters.voteAverage[1] < 10) {
          params['vote_average.lte'] = String(filters.voteAverage[1])
        }
        if (filters.runtime[0] > 0) {
          params['with_runtime.gte'] = String(filters.runtime[0])
        }
        if (filters.runtime[1] < 360) {
          params['with_runtime.lte'] = String(filters.runtime[1])
        }
      }
      
      try {
        const res = await api.get(endpoint, params)
        setResults(res.results)
        setTotalPages(Math.min(res.total_pages, 20))
        setTotalResults(res.total_results)
      } catch (error) {
        console.error("Erro ao buscar filmes:", error)
        setResults([])
        setTotalPages(1)
        setTotalResults(0)
      }
      setIsLoading(false)
    }

    fetchFilteredMovies()
    
  }, [debouncedQuery, filters, currentPage]) 

  // 5. Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const filterComponent = useMemo(() => (
    <SearchFilters
      genres={genres}
      languages={languages}
      providers={providers}
      filters={filters}
      setFilters={setFilters}
    />
  ), [genres, languages, providers, filters]);

  return (
    <div className="container max-w-full px-[5%] md:px-[10%] py-8 flex flex-col md:flex-row gap-8">
      
      {/* --- Sidebar de Filtros (Desktop) --- */}
      <aside className="hidden md:block w-full md:w-[300px] lg:w-[350px] flex-shrink-0">
        <div className="sticky top-20 h-[calc(100vh-100px)] overflow-y-auto pr-4">
          {filterComponent}
        </div>
      </aside>

      {/* --- Main Content (Resultados) --- */}
      <main className="flex-grow min-w-0">
        
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
          
          <div>
            {filters.query ? (
              <h2 className="text-2xl font-bold">
                Resultados para: <span className="text-primary">“{filters.query}”</span>
              </h2>
            ) : (
              <h2 className="text-2xl font-bold">Explorar Filmes</h2>
            )}
          </div>
          
          {/* Contador (Direita - APENAS DESKTOP) */}
          {!isLoading && totalResults > 0 && (
            <p className="text-base text-muted-foreground mt-1 sm:mt-0 hidden sm:block">
              <span className="font-semibold text-primary">
                {totalResults >= 10000 ? "+10.000" : totalResults.toLocaleString('pt-BR')}
              </span> 
              {" "}filmes encontrados
            </p>
          )}

          {/* Botão de Filtros Mobile (Direita) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden flex-shrink-0 mt-4 sm:mt-0">
                <Filter className="mr-2 h-4 w-4" />
                Filtros e Busca
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] overflow-y-auto">
              {filterComponent}
            </SheetContent>
          </Sheet>
        </div>

        {/* Contador (APENAS MOBILE) */}
        {!isLoading && totalResults > 0 && (
          <p className="text-base text-muted-foreground mb-4 sm:hidden">
            <span className="font-semibold text-primary">
              {totalResults >= 10000 ? "+10.000" : totalResults.toLocaleString('pt-BR')}
            </span> 
            {" "}filmes encontrados
          </p>
        )}
        
        {/* --- Grid de Resultados --- */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
             {Array.from({ length: 15 }).map((_, i) => (
               <Skeleton key={i} className="aspect-[2/3] w-full rounded-md" />
             ))}
          </div>
        ) : (
          <>
            {results.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-muted/50">
                <p className="text-lg font-medium">Nenhum filme encontrado.</p>
                <p className="text-muted-foreground">Tente ajustar seus filtros ou termo de busca.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {results.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie}
                  />
                ))}
              </div>
            )}
            
            {results.length > 0 && (
              <AppPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}