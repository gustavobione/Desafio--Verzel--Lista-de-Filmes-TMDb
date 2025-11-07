// Arquivo: Frontend/src/components/Navbar.tsx
// (Novo layout inspirado na imagem 'Navbar.png')

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
// Novos ícones inspirados na imagem
import { LogOut, Search, Moon, Sun } from "lucide-react"

// ######################################################################
// COMPONENTE PARA O SELETOR DE TEMA (Inspirado na imagem)
// (Idealmente, isso usaria 'useTheme' do 'next-themes')
// ######################################################################
function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(true) // Começa como escuro (como na imagem)
  
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

  // (Funções handleLogout e getInitials - sem mudanças)
  const handleLogout = async () => { await logout() }
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
      
      {/* Este é o layout de 3 colunas (grid) que corrige a centralização.
        O 'px-4' ou 'px-6' no 'container' dá o "gap" lateral que você queria.
      */}
      <nav className="container max-w-full h-16 grid grid-cols-3 items-center px-[5%] md:px-[10%]">
        
        {/* --- 1. SLOT ESQUERDO (Logo) --- */}
        <div className="justify-self-start">
          <Link to="/" className="text-xl font-bold text-primary">
            Afinna
          </Link>
        </div>

        {/* --- 2. SLOT CENTRAL (Navegação Arredondada) --- */}
        {/* Este é o menu centralizado, inspirado no "LUMIÈRE" */}
        <div className="justify-self-center">
          {/* O 'div' externo cria o fundo arredondado */}
          <div className="hidden md:flex items-center gap-1 rounded-full bg-muted/50 p-1 backdrop-blur-sm">
            <NavigationMenu>
              <NavigationMenuList>
                
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/pesquisa" 
                      // O 'navigationMenuTriggerStyle()' dá o efeito de hover
                      className={navigationMenuTriggerStyle()}
                      // 'activeProps' destaca o link da página atual
                      activeProps={{ className: "bg-background shadow-sm" }}
                    >
                      Pesquisa
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {user && ( // Só mostra "Meus Favoritos" se estiver logado
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

        {/* --- 3. SLOT DIREITO (Ações: Busca, Tema, Auth) --- */}
        <div className="justify-self-end flex items-center gap-2">
          
          {/* Botão de Busca (Ícone) */}
          <Button variant="ghost" size="icon" aria-label="Buscar">
            {/* TODO: Ligar este botão a um Dialog de Busca */}
            <Search className="h-[1.2rem] w-[1.2rem] text-muted-foreground hover:text-primary" />
          </Button>

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