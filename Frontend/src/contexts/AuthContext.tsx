// Arquivo: Frontend/src/contexts/AuthContext.tsx
// (Versão final mesclada: Autenticação + Gerenciamento de Favoritos)

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { User as FirebaseUser } from 'firebase/auth'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@/lib/firebase'
import { api } from '@/lib/api'
import type { Movie } from '@/components/MovieCard' // (Esta interface vem do seu MovieCard)

// Interface para o favorito que VEM DO NOSSO BACKEND
export interface FavoriteFromBackend {
  id: string // O ID do nosso banco (UUID)
  tmdb_id: number
  title: string
  poster_path: string
  rating: number
}

type AuthUser = FirebaseUser | null

type EmailPasswordCredentials = {
  email: string
  password: string
}

// Interface do Contexto (Combina Auth + Favoritos)
interface AuthContextType {
  user: AuthUser
  isLoading: boolean
  loginWithGoogle: () => Promise<void>
  signUpWithEmail: (creds: EmailPasswordCredentials) => Promise<void>
  loginWithEmail: (creds: EmailPasswordCredentials) => Promise<void>
  logout: () => Promise<void>
  
  // --- Props de Favoritos ---
  favorites: FavoriteFromBackend[]
  favoriteLookup: Map<number, string> // O "mapa" para busca rápida
  toggleFavorite: (movie: Movie) => Promise<void> // A função de toggle
  isFavLoading: boolean // O estado de loading do botão
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null)
  const [isLoading, setIsLoading] = useState(true)

  // --- Estado dos Favoritos ---
  const [favorites, setFavorites] = useState<FavoriteFromBackend[]>([])
  const [isFavLoading, setIsFavLoading] = useState(false)

  // "Ouvinte" de Autenticação (Carrega Usuário E Favoritos)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser) {
        // Se o usuário logou, BUSCA OS FAVORITOS DELE
        setIsLoading(true) // (Loading da página)
        try {
          const favs = await api.get('/favorites/')
          setFavorites(favs)
        } catch (error) {
          console.error("Erro ao buscar favoritos no login:", error)
        }
        setIsLoading(false)
      } else {
        // Se o usuário deslogou, LIMPA OS FAVORITOS
        setFavorites([])
        setIsLoading(false)
      }
    })
    return unsubscribe
  }, [])
  
  // "Mapa" de Favoritos (para performance)
  // Mapeia: { 123 (tmdb_id) => "uuid-abc-123" (id_do_banco) }
  const favoriteLookup = useMemo(() => {
    return new Map(favorites.map(fav => [fav.tmdb_id, fav.id]))
  }, [favorites]) // Recalcula SÓ quando a lista 'favorites' mudar

  // Lógica de Toggle (Adicionar/Remover Favorito)
  const toggleFavorite = async (movie: Movie) => {
    if (!user) return // Segurança
    
    setIsFavLoading(true)
    
    const tmdbId = movie.id
    const favoriteId = favoriteLookup.get(tmdbId) // Pega o UUID do banco
    
    try {
      if (favoriteId) {
        // --- JÁ É FAVORITO (LÓGICA DE DELETE) ---
        await api.delete(`/favorites/${favoriteId}/`)
        // Atualiza o estado local (feedback imediato)
        setFavorites(prevFavs => prevFavs.filter(fav => fav.id !== favoriteId))
      
      } else {
        // --- NÃO É FAVORITO (LÓGICA DE POST) ---
        const payload = {
          tmdb_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          // Pega a nota (TMDb usa 'vote_average', nosso backend usa 'rating')
          rating: (movie as any).vote_average || movie.rating || 7.0,
        }
        const newFavorite = await api.post('/favorites/', payload)
        // Atualiza o estado local (feedback imediato)
        setFavorites(prevFavs => [...prevFavs, newFavorite])
      }
    } catch (error) {
      console.error("Erro ao favoritar:", error)
      // TODO: Adicionar Toast de erro
    }
    setIsFavLoading(false)
  }

  // --- Funções de Login (da Versão 1) ---
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      // O 'onAuthStateChanged' vai cuidar de atualizar o 'user' e 'favorites'
    } catch (error) {
      console.error("Erro no login com Google:", error)
      // TODO: Mostrar um Toast de erro para o usuário
    }
  }
  
  const signUpWithEmail = async ({ email, password }: EmailPasswordCredentials) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      // O 'onAuthStateChanged' vai cuidar de atualizar o 'user' e 'favorites'
    } catch (error) {
      console.error("Erro ao registrar com email:", error)
      // TODO: Mostrar um Toast de erro
    }
  }

  const loginWithEmail = async ({ email, password }: EmailPasswordCredentials) => {
     try {
      await signInWithEmailAndPassword(auth, email, password)
      // O 'onAuthStateChanged' vai cuidar de atualizar o 'user' e 'favorites'
    } catch (error) {
      console.error("Erro ao logar com email:", error)
      // TODO: Mostrar um Toast de erro
    }
  }

  // Função de Logout
  const logout = async () => {
    try {
      await signOut(auth)
      // O 'onAuthStateChanged' vai limpar 'user' e 'favorites' automaticamente
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  // Disponibiliza TUDO no contexto
  const value = {
    user,
    isLoading,
    loginWithGoogle,
    signUpWithEmail,
    loginWithEmail,
    logout,
    favorites,
    favoriteLookup,
    toggleFavorite,
    isFavLoading,
  }

  // Não renderiza o app até sabermos se o usuário está logado ou não
  if (isLoading) {
    return <div>Carregando...</div> // TODO: Adicionar um Spinner bonito
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// O Hook 'useAuth' (para consumir o contexto)
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}