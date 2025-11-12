// Arquivo: Frontend/src/components/movie/MetadataSidebar.tsx
// (Refatorado V6: Adiciona lógica "Em Cartaz")

import { Badge } from "@/components/ui/badge"
import { 
  MonitorPlay, Tags, Calendar, Clock, Languages, 
  UserSquare, Music, Star, User, Film
} from "lucide-react"
import type { ReactNode } from "react"

// --- Helper 1: Layout da Seção (com Ícone) ---
interface InfoSectionProps {
  icon: React.ElementType
  title: string
  children: ReactNode
}
function InfoSection({ icon: Icon, title, children }: InfoSectionProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{title}</span>
      </h3>
      <div className="pl-6">{children}</div>
    </div>
  )
}

// --- Helper 2: O Card da Equipe (Lateral e Quadrado) ---
function CrewMember({ person }: { person: any }) {
  if (!person) return null;
  const imageUrl = person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : ""
  return (
    <div className="flex items-center gap-3">
      <div className="h-14 w-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={person.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted-foreground/20 flex items-center justify-center">
            <User className="h-6 w-6 text-muted-foreground/50" />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-sm font-semibold truncate">{person.name}</p>
        <p className="text-xs text-muted-foreground truncate">{person.job}</p>
      </div>
    </div>
  )
}

// --- Helper 3: O Gerador de Estrelas (COM PORCENTAGEM) ---
function StarRating({ ratingOutOf10, voteCount }: { ratingOutOf10: number, voteCount: number }) {
  const ratingOutOf5 = ratingOutOf10 / 2;
  const fullStars = Math.floor(ratingOutOf5);
  const partialFill = (ratingOutOf5 - fullStars);
  const partialWidth = Math.round(partialFill * 100);
  const emptyStars = 5 - fullStars - (partialFill > 0 ? 1 : 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="h-5 w-5 text-yellow-400" fill="currentColor" />
        ))}
        {partialFill > 0 && (
          <div className="relative">
            <Star className="h-5 w-5 text-yellow-400/50" />
            <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${partialWidth}%` }}>
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5 text-yellow-400/50" />
        ))}
        <span className="ml-2 font-bold text-lg">{ratingOutOf5.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">/ 5</span>
      </div>
      <span className="text-sm text-muted-foreground pl-6">
        Baseado em {voteCount} votos
      </span>
    </div>
  )
}

// --- Helper 4: A Lógica de "Onde Assistir" (NOVA) ---
function WhereToWatch({ movie }: { movie: any }) {
  const providers = movie["watch/providers"]?.results?.BR?.flatrate || []
  
  // 1. Se tiver em streaming, mostra os ícones
  if (providers.length > 0) {
    return (
      <div className="flex flex-wrap gap-2">
        {providers.map((p: any) => (
          <img 
            key={p.provider_id}
            src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} 
            alt={p.provider_name}
            title={p.provider_name}
            className="h-10 w-10 rounded-md transition-transform hover:scale-110"
          />
        ))}
      </div>
    )
  }
  
  // 2. Se não, checa se está "Em Cartaz"
  const releaseDates = movie.release_dates?.results || []
  const brRelease = releaseDates.find((r: any) => r.iso_3166_1 === 'BR')
  const theatricalRelease = brRelease?.release_dates.find((d: any) => d.type === 3) // 3 = Theatrical
  
  if (theatricalRelease) {
    const releaseDate = new Date(theatricalRelease.release_date)
    
    // --- A CORREÇÃO ESTÁ AQUI ---
    // 1. Crie a data de "30 dias atrás" primeiro
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // 2. Agora compare os dois objetos Date
    if (releaseDate > thirtyDaysAgo) { 
      return (
        <div className="flex items-center gap-2">
          <Film className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground font-semibold">Em cartaz nos cinemas</p>
        </div>
      )
    }
  }

  // 3. Se não for nenhum dos dois
  return (
    <p className="text-sm text-muted-foreground">Não disponível em streaming ou nos cinemas.</p>
  )
}

// --- Componente Principal ---
export function MetadataSidebar({ movie }: { movie: any }) {
  const director = movie.credits?.crew.find((p: any) => p.job === 'Director')
  const composer = movie.credits?.crew.find((p: any) => p.job === 'Original Music Composer')
  
  return (
    <aside className="space-y-8 p-4 rounded-lg bg-muted/50">
      
      {/* 1. Onde Assistir (AGORA COM A NOVA LÓGICA) */}
      <InfoSection icon={MonitorPlay} title="Onde Assistir (BR)">
        <WhereToWatch movie={movie} />
      </InfoSection>

      {/* 2. Nota */}
      <InfoSection icon={Star} title="Nota (TMDb)">
        <StarRating ratingOutOf10={movie.vote_average} voteCount={movie.vote_count} />
      </InfoSection>

      {/* 3. Gêneros */}
      <InfoSection icon={Tags} title="Gêneros">
        <div className="flex flex-wrap gap-2">
          {movie.genres.map((g: any) => (
            <Badge key={g.id} variant="secondary">{g.name}</Badge>
          ))}
        </div>
      </InfoSection>

      {/* 4. Idiomas */}
      <InfoSection icon={Languages} title="Idiomas Disponíveis">
        <div className="flex flex-wrap gap-2">
          {movie.spoken_languages.map((lang: any) => (
            <Badge key={lang.iso_639_1} variant="secondary">{lang.name}</Badge>
          ))}
        </div>
      </InfoSection>

      {/* 5. Duração */}
      <InfoSection icon={Clock} title="Duração">
        <p className="text-sm text-muted-foreground">{movie.runtime} minutos</p>
      </InfoSection>
      
      {/* 6. Lançamento */}
      <InfoSection icon={Calendar} title="Lançamento">
        <p className="text-sm text-muted-foreground">{new Date(movie.release_date || "").toLocaleDateString('pt-BR')}</p>
      </InfoSection>

      {/* 7. SEÇÃO DE DESTAQUE (Equipe) */}

            <InfoSection icon={UserSquare} title="Direção">
              <CrewMember person={director} />
            </InfoSection>

            <InfoSection icon={Music} title="Música">
              <CrewMember person={composer} />
            </InfoSection>

      
    </aside>
  )
}