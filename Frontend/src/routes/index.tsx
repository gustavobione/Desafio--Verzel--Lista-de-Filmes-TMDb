import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage, // Liga esta rota ao componente abaixo
})

function HomePage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">Busca de Filmes</h1>
      <p>Aqui ficará a barra de pesquisa (Input do Shadcn).</p>
    </div>
  )
}