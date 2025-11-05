import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'
import { routeTree } from './routeTree.gen'
import { AuthProvider } from './contexts/AuthContext'

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
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </React.StrictMode>,
  )
}