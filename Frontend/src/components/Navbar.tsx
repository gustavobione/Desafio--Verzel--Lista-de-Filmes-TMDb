// Arquivo: Frontend/src/components/Navbar.tsx
// (Versão final refinada, inspirada no "LUMIÈRE")

import * as React from "react"
import { Link } from "@tanstack/react-router"
import { useAuth } from "@/contexts/AuthContext"

// --- Componentes Shadcn ---
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User as UserIcon, Moon, Sun } from "lucide-react"

// ######################################################################
// COMPONENTE PARA O SELETOR DE TEMA
// (Placeholder - como você forneceu)
// ######################################################################
function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(true) // Começa como escuro
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => setIsDark(!isDark)}
      aria-label="Togglear tema"
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-muted-foreground hover:text-primary" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-muted-foreground hover:text-primary" />
      )}
    </Button>
  )
}
// ######################################################################


export function Navbar() {
  const { user, logout, isLoading } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  // (Usando sua lógica 'getInitials' mais robusta)
  const getInitials = () => {
    if (!user) return ""
    const source = user.displayName || user.email || ""
    const parts = source.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return ""
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      
      {/* Layout de 3 colunas (Grid) com 'gap' lateral (px-4 ou px-6) */}
      <nav className="container max-w-full h-16 grid grid-cols-3 items-center px-4 md:px-[10%]">
        
        {/* --- 1. SLOT ESQUERDO (Logo) --- */}
        <div className="justify-self-start">
          <Link to="/" className="text-xl font-bold text-primary">
            Afinna
          </Link>
        </div>

        {/* --- 2. SLOT CENTRAL (Navegação Arredondada) --- */}
        <div className="justify-self-center">
          <div className="hidden md:flex items-center gap-4 rounded-md bg-muted/50 p-2">
            <NavigationMenu>
              <NavigationMenuList className="flex flex-row gap-2">
                
                {/* Link "Início" (para a Home /) */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/" 
                      className={navigationMenuTriggerStyle()}
                      // Destaque quando a rota é exatamente "/"
                      activeProps={{ className: "bg-background shadow-sm" }}
                      activeOptions={{ exact: true }}
                    >
                      Início
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Link "Pesquisa" (para /pesquisa) */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/pesquisa" 
                      className={navigationMenuTriggerStyle()}
                      activeProps={{ className: "bg-background shadow-sm" }}
                    >
                      Pesquisa
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Link "Meus Favoritos" (só para logados) */}
                {user && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/favoritos" 
                        className={navigationMenuTriggerStyle()}
                        activeProps={{ className: "bg-background shadow-sm" }}
                      >
                        Meus Favoritos
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}

              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* --- 3. SLOT DIREITO (Ações: Tema + Auth) --- */}
        {/* (Removi o ícone de Busca daqui para limpar a UI) */}
        <div className="justify-self-end flex items-center gap-2">
          
          {/* Botão de Tema */}
          <ThemeToggle />

          {/* Lógica de Autenticação (Login ou Avatar) */}
          {isLoading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={user.photoURL || ""} 
                      alt={user.displayName || user.email!} 
                    />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.displayName || "Usuário"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}