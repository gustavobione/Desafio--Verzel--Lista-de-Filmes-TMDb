import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'
import { routeTree } from './routeTree.gen'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './components/theme-provider'

// Cria o roteador
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, 
  }
})

function InnerApp() {
  const auth = useAuth() // Pega o contexto
  return <RouterProvider router={router} context={{ auth }} /> // Injeta no roteador
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider> 
          <InnerApp />
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>,
  )
}

// Declara o roteador para o HMR (recarregamento rápido)
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
  interface RouterContext {
    auth: ReturnType<typeof useAuth>
  }
}
