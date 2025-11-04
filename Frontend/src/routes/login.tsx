import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="container mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <p className="text-center text-gray-500">
        Entre com sua conta do Google para salvar seus filmes favoritos.
      </p>
      {/* O botão de login do Firebase/Shadcn virá aqui */}
    </div>
  )
}
