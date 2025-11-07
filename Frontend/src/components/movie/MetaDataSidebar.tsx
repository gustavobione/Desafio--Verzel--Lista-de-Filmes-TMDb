// Arquivo: Frontend/src/components/movie/MetadataSidebar.tsx

import { Badge } from "@/components/ui/badge"

export function MetadataSidebar({ movie }: { movie: any }) {
  const providers = movie["watch/providers"]?.results?.BR?.flatrate || []
  
  return (
    <aside className="space-y-6 p-4 rounded-lg bg-muted/50">
      <div>
        <h3 className="font-semibold mb-2">Onde Assistir (BR)</h3>
        {providers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {providers.map((p: any) => (
              <img 
                key={p.provider_id}
                src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} 
                alt={p.provider_name}
                title={p.provider_name}
                className="h-10 w-10 rounded-md"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Não disponível em streaming.</p>
        )}
      </div>
      <div>
        <h3 className="font-semibold mb-2">Gêneros</h3>
        <div className="flex flex-wrap gap-2">
          {movie.genres.map((g: any) => (
            <Badge key={g.id} variant="secondary">{g.name}</Badge>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Ano de Lançamento</h3>
        <p className="text-sm text-muted-foreground">{new Date(movie.release_date || "").getFullYear()}</p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Duração</h3>
        <p className="text-sm text-muted-foreground">{movie.runtime} minutos</p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Nota (TMDb)</h3>
        <p className="text-sm text-muted-foreground">{Math.round(movie.vote_average * 10)}%</p>
      </div>
    </aside>
  )
}