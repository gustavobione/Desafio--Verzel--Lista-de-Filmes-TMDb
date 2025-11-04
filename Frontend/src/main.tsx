import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Importa nosso CSS global (que importa o Tailwind)
import './index.css'

// Importa a árvore de rotas que o TanStack gera automaticamente
import { routeTree } from './routeTree.gen'

// Cria o roteador
const router = createRouter({ routeTree })

// Declara o roteador para o HMR (recarregamento rápido)
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Renderiza o aplicativo
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  )
}