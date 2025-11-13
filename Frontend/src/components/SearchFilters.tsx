// Arquivo: Frontend/src/components/SearchFilters.tsx
// (Refatorado V7: Com Accordion, Gêneros (Pills) e Streaming (Grid+Texto))

import { useState } from "react"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { X, Check as CheckIcon, ChevronsUpDown } from "lucide-react"
import { Button } from "./ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


// --- Interfaces (Como você definiu) ---
export interface Genre { id: number; name: string }
export interface Language { iso_639_1: string; english_name: string; name: string }
export interface Provider { provider_id: number; provider_name: string; logo_path: string }

export interface Filters {
  query: string
  genres: number[] 
  certifications: string[] 
  languages: string[]
  providers: number[] // Para streaming
  releaseDate: {
    searchAll: boolean
    from: string // YYYY-MM-DD
    to: string   // YYYY-MM-DD
  }
  voteAverage: [number, number] // 0-10
  runtime: [number, number]     // 0-360
  sortBy: string
}

interface SearchFiltersProps {
  genres: Genre[]
  languages: Language[]
  providers: Provider[]
  filters: Filters
  setFilters: (filters: Filters) => void
}

const CERTIFICATIONS = ["L", "10", "12", "14", "16", "18"]
const PROVIDERS_TRUNCATE_LIMIT = 8 // Mostrar 8 streamings
const GENRES_TRUNCATE_LIMIT = 10    // Mostrar 10 gêneros

// --- Componente de Filtro ---
export function SearchFilters({
  genres,
  languages,
  providers,
  filters,
  setFilters,
}: SearchFiltersProps) {
  
  // --- Estado Interno para "Ver Mais" ---
  const [showAllProviders, setShowAllProviders] = useState(false)
  const [showAllGenres, setShowAllGenres] = useState(false)

  // --- Handlers Auxiliares ---
  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters({ ...filters, [key]: value })
  }
  const toggleArrayFilter = (key: 'genres' | 'certifications' | 'languages' | 'providers', value: any) => {
    const currentArray = filters[key] as any[]
    const exists = currentArray.includes(value)
    const newArray = exists
      ? currentArray.filter((item) => item !== value) // Remove
      : [...currentArray, value] // Adiciona
    updateFilter(key, newArray)
  }
  const updateDate = (field: 'from' | 'to' | 'searchAll', value: any) => {
    setFilters({
      ...filters,
      releaseDate: { ...filters.releaseDate, [field]: value }
    })
  }

  // --- Listas Truncadas ---
  const providersToShow = showAllProviders ? providers : providers.slice(0, PROVIDERS_TRUNCATE_LIMIT)
  const genresToShow = showAllGenres ? genres : genres.slice(0, GENRES_TRUNCATE_LIMIT)

  return (
    // 1. O Layout "Acordeão" (Substitui o scroll feio)
    <Accordion type="multiple" defaultValue={['query', 'sort', 'providers', 'genres']} className="w-full">
      
      {/* 2. Busca de Texto (Sempre visível) */}
      <AccordionItem value="query">
        <AccordionTrigger className="text-base font-semibold">Pesquisar</AccordionTrigger>
        <AccordionContent className="space-y-2 pt-2">
          <Input
            id="search-query"
            type="text"
            placeholder="Ex: Batman, Vingadores..."
            value={filters.query}
            onChange={(e) => updateFilter("query", e.target.value)}
          />
        </AccordionContent>
      </AccordionItem>

      {/* 3. Ordenação (Com A-Z / Z-A) */}
      <AccordionItem value="sort">
        <AccordionTrigger className="text-base font-semibold">Ordenar por</AccordionTrigger>
        <AccordionContent className="pt-2">
          <Select
            value={filters.sortBy}
            onValueChange={(value) => updateFilter("sortBy", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ordenar por..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity.desc">Popularidade (Maior)</SelectItem>
              <SelectItem value="vote_average.desc">Nota (Maior)</SelectItem>
              <SelectItem value="primary_release_date.desc">Lançamento (Novo)</SelectItem>
              <SelectItem value="original_title.asc">Alfabética (A-Z)</SelectItem> 
              <SelectItem value="original_title.desc">Alfabética (Z-A)</SelectItem>
              <SelectItem value="revenue.desc">Bilheteria (Maior)</SelectItem>
            </SelectContent>
          </Select>
        </AccordionContent>
      </AccordionItem>
      
      {/* 4. Onde Assistir (NOVO GRID com Ícone + Texto) */}
      <AccordionItem value="providers">
        <AccordionTrigger className="text-base font-semibold">Onde Assistir (BR)</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <p className="text-xs text-muted-foreground">Filtro "OU" (Ex: Netflix *ou* Max)</p>
          {/* Grid com 3 colunas */}
          <div className="grid grid-cols-3 gap-2">
            {providersToShow.map((p) => (
              <Button
                key={p.provider_id}
                variant="outline"
                // 'data-[state=on]' é usado pelo Tailwind para estilizar o botão pressionado
                data-state={filters.providers.includes(p.provider_id) ? 'on' : 'off'}
                className="h-auto p-2 flex flex-col gap-2 data-[state=on]:border-primary data-[state=on]:bg-primary/10"
                onClick={() => toggleArrayFilter('providers', p.provider_id)}
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} 
                  alt={p.provider_name}
                  className="h-10 w-10 rounded-md" // Imagem maior e de alta qualidade
                />
                <span className="text-xs text-center truncate w-full">{p.provider_name}</span>
              </Button>
            ))}
          </div>
          {providers.length > PROVIDERS_TRUNCATE_LIMIT && (
            <Button variant="link" size="sm" className="p-0" onClick={() => setShowAllProviders(!showAllProviders)}>
              {showAllProviders ? "Ver Menos" : `Ver Mais (${providers.length - PROVIDERS_TRUNCATE_LIMIT})`}
            </Button>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* 5. Gêneros (Pills, Ver Mais) */}
      <AccordionItem value="genres">
        <AccordionTrigger className="text-base font-semibold">Gêneros</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <p className="text-xs text-muted-foreground">Filtro "E" (Ex: Ação *e* Aventura)</p>
          <div className="flex flex-wrap gap-2">
            {genresToShow.map((genre) => {
              const isSelected = filters.genres.includes(genre.id)
              return (
                <Badge
                  key={genre.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${!isSelected && "text-muted-foreground hover:bg-secondary"}`}
                  onClick={() => toggleArrayFilter('genres', genre.id)}
                >
                  {genre.name}
                </Badge>
              )
            })}
          </div>
          {genres.length > GENRES_TRUNCATE_LIMIT && (
            <Button variant="link" size="sm" className="p-0" onClick={() => setShowAllGenres(!showAllGenres)}>
              {showAllGenres ? "Ver Menos" : `Ver Mais (${genres.length - GENRES_TRUNCATE_LIMIT})`}
            </Button>
          )}
        </AccordionContent>
      </AccordionItem>
      
      {/* 6. Datas de Lançamento */}
      <AccordionItem value="dates">
        <AccordionTrigger className="text-base font-semibold">Datas de Lançamento</AccordionTrigger>
        <AccordionContent className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox 
              id="search-all-dates" 
              checked={filters.releaseDate.searchAll}
              onCheckedChange={(checked) => updateDate('searchAll', checked === true)}
            />
            <Label htmlFor="search-all-dates" className="font-normal cursor-pointer">
              Pesquisar todos os lançamentos?
            </Label>
          </div>
          <div className={`grid grid-cols-2 gap-2 ${filters.releaseDate.searchAll ? 'opacity-50 pointer-events-none' : ''}`}>
            <Input type="date" value={filters.releaseDate.from} onChange={(e) => updateDate('from', e.target.value)} />
            <Input type="date" value={filters.releaseDate.to} onChange={(e) => updateDate('to', e.target.value)} />
          </div>
        </AccordionContent>
      </AccordionItem>
      
      {/* 7. Classificação */}
      <AccordionItem value="certifications">
        <AccordionTrigger className="text-base font-semibold">Classificação (Brasil)</AccordionTrigger>
        <AccordionContent className="flex flex-wrap gap-2 pt-2">
          {CERTIFICATIONS.map((cert) => {
            const isSelected = filters.certifications.includes(cert)
            return (
              <Badge
                key={cert}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer w-10 h-10 flex items-center justify-center rounded-full transition-all ${!isSelected && "text-muted-foreground hover:bg-secondary"}`}
                onClick={() => toggleArrayFilter('certifications', cert)}
              >
                {cert}
              </Badge>
            )
          })}
        </AccordionContent>
      </AccordionItem>
      
      {/* 8. Avaliação (Slider Duplo 0-10) */}
      <AccordionItem value="rating">
        <AccordionTrigger className="text-base font-semibold">Avaliação (Nota)</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-muted-foreground">
              {filters.voteAverage[0]} - {filters.voteAverage[1]}
            </span>
          </div>
          <Slider
            min={0} max={10} step={0.5}
            value={filters.voteAverage}
            onValueChange={(value) => updateFilter("voteAverage", value)}
          />
        </AccordionContent>
      </AccordionItem>

      {/* 9. Duração (Slider Duplo 0-360min) */}
      <AccordionItem value="runtime">
        <AccordionTrigger className="text-base font-semibold">Duração (min)</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-muted-foreground">
              {filters.runtime[0]}m - {filters.runtime[1]}m
            </span>
          </div>
          <Slider
            min={0} max={360} step={15}
            value={filters.runtime}
            onValueChange={(value) => updateFilter("runtime", value)}
          />
        </AccordionContent>
      </AccordionItem>
      
      {/* 10. Idioma (Select Pesquisável) */}
      <AccordionItem value="languages">
        <AccordionTrigger className="text-base font-semibold">Idioma Original</AccordionTrigger>
        <AccordionContent className="space-y-2 pt-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                {filters.languages.length > 0 ? `${filters.languages.length} selecionado(s)` : "Selecionar idiomas..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Buscar idioma..." />
                <CommandList>
                  <CommandEmpty>Nenhum idioma encontrado.</CommandEmpty>
                  <CommandGroup>
                    {languages.map((lang) => {
                      const isSelected = filters.languages.includes(lang.iso_639_1)
                      return (
                      <CommandItem
                        key={lang.iso_639_1}
                        value={lang.english_name}
                        onSelect={() => toggleArrayFilter('languages', lang.iso_639_1)}
                      >
                        <CheckIcon className={`mr-2 h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`} />
                        {lang.english_name} ({lang.iso_639_1})
                      </CommandItem>
                    )})}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {/* Mostra os idiomas selecionados */}
          {filters.languages.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {filters.languages.map(langCode => {
                const lang = languages.find(l => l.iso_639_1 === langCode);
                return (
                  <Badge key={langCode} variant="secondary" className="flex items-center gap-1">
                    {lang?.english_name || langCode.toUpperCase()}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter('languages', langCode)} />
                  </Badge>
                )
              })}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

    </Accordion>
  )
}