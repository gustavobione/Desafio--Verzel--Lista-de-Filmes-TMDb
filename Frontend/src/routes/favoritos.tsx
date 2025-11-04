import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/favoritos')({
  component: FavoritosPage,
})

// NOTA: No futuro, vamos "travar" esta rota
// para que apenas usuários logados possam acessá-la.

function FavoritosPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">Meus Favoritos</h1>
      <p>Aqui ficará a lista de filmes salvos do usuário.</p>
    </div>
  )
}