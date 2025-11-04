// Arquivo: Frontend/src/routes/share.$listId.tsx

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/share/$listId')({
  component: SharePage,
})

function SharePage() {
  // Pega o ID da lista diretamente da URL
  const { listId } = Route.useParams()

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">Lista de Favoritos Compartilhada</h1>
      <p>
        Mostrando a lista com o ID: 
        <span className="font-mono bg-gray-200 p-1">{listId}</span>
      </p>
      <p>Aqui vamos carregar e mostrar os filmes dessa lista.</p>
    </div>
  )
}