import { createRootRoute, Outlet } from '@tanstack/react-router'

// (Opcional, mas bom para o futuro)
// Aqui você pode adicionar seu componente de Navbar
// import { Navbar } from '@/components/Navbar' 

export const Route = createRootRoute({
  component: () => (
    <>
      {/* <Navbar /> */}
      <div className="p-4">
        <Outlet /> {/* As outras rotas serão renderizadas aqui */}
      </div>
    </>
  ),
})