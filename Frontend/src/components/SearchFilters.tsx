// Arquivo: Frontend/src/components/SearchFilters.tsx

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// (Definição de tipos que a página "smart" vai nos passar)
export interface Genre { id: number; name: string }
export interface Filters {
  genre: string
  year: number[]
  rating: string
  sortBy: string
}

// (As props que o componente "burro" recebe)
interface SearchFiltersProps {
  genres: Genre[]
  filters: Filters
  onFiltersChange: (key: keyof Filters, value: any) => void
}

export function SearchFilters({ genres, filters, onFiltersChange }: SearchFiltersProps) {
  
  // Opções de nota (baseado na imagem do LUMIÈRE)
  const ratingOptions = [
    { value: "8", label: "4 Estrelas (80%+)" },
    { value: "6", label: "3 Estrelas (60%+)" },
    { value: "4", label: "2 Estrelas (40%+)" },
    { value: "0", label: "Qualquer Nota" },
  ]
  
  // Opções de Ordenação
  const sortOptions = [
    { value: "popularity.desc", label: "Popularidade" },
    { value: "release_date.desc", label: "Mais Recentes" },
    { value: "vote_average.desc", label: "Melhor Avaliados" },
  ]

  return (
    <div className="space-y-6">
      {/* Filtro: Gêneros */}
      <div>
        <Label className="text-base">Gêneros</Label>
        <Select
          value={filters.genre}
          onValueChange={(value) => onFiltersChange('genre', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um gênero" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Gêneros</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre.id} value={String(genre.id)}>
                {genre.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Filtro: Ano de Lançamento (Slider) */}
      <div>
        <Label className="text-base">Ano de Lançamento ({filters.year[0]})</Label>
        <Slider
          min={1980}
          max={2025}
          step={1}
          value={filters.year}
          onValueChange={(value) => onFiltersChange('year', value)}
        />
      </div>

      {/* Filtro: Nota (Radio Group) */}
      <div>
        <Label className="text-base">Nota Mínima</Label>
        <RadioGroup
          value={filters.rating}
          onValueChange={(value) => onFiltersChange('rating', value)}
          className="mt-2 space-y-2"
        >
          {ratingOptions.map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.value} id={`r-${opt.value}`} />
              <Label htmlFor={`r-${opt.value}`} className="font-normal">{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* Filtro: Ordenar Por */}
      <div>
        <Label className="text-base">Ordenar por</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => onFiltersChange('sortBy', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}