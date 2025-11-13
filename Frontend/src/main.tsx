import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'
import { routeTree } from './routeTree.gen'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './components/theme-provider'

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, 
  }
})

function InnerApp() {
  const auth = useAuth() 
  return <RouterProvider router={router} context={{ auth }} /> 
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

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
  interface RouterContext {
    auth: ReturnType<typeof useAuth>
  }
}
