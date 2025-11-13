// Arquivo: Frontend/src/contexts/AuthContext.tsx
// (Refatorado V4: Lógica booleana de múltiplas listas)

import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react'
import type { User as FirebaseUser } from 'firebase/auth'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@/lib/firebase'
import { api } from '@/lib/api'
import type { Movie } from '@/components/MovieCard' // Importa a interface do card

// --- 1. DEFINIÇÃO DE TIPOS ---

// O 'list_type' DEVE ser idêntico ao do seu backend Django
export type ListType = 'is_favorite' | 'is_watch_later' | 'is_watched'

// A interface do objeto que vem do nosso Backend
export interface UserMovieEntry {
  id: string // UUID do banco
  tmdb_id: number
  is_favorite: boolean
  is_watch_later: boolean
  is_watched: boolean
  title: string
  poster_path: string
  rating: number
}

type AuthUser = FirebaseUser | null

type EmailPasswordCredentials = {
  email: string
  password: string
}

// 2. A NOVA INTERFACE DO CONTEXTO
interface AuthContextType {
  user: AuthUser
  isLoading: boolean
  loginWithGoogle: () => Promise<void>
  signUpWithEmail: (creds: EmailPasswordCredentials) => Promise<void>
  loginWithEmail: (creds: EmailPasswordCredentials) => Promise<void>
  logout: () => Promise<void>
  
  // --- LÓGICA DE LISTAS ATUALIZADA ---
  favorites: UserMovieEntry[]
  watchLater: UserMovieEntry[]
  watched: UserMovieEntry[]
  
  // Um "mapa" para checar rapidamente o status de um filme (pelo tmdb_id)
  movieLookup: Map<number, UserMovieEntry> 
  
  // A nova função de ação "smart"
  setMovieStatus: (movie: Movie, listType: ListType, status: boolean) => Promise<void>
  isListLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // 3. ESTADO PRINCIPAL: UMA ÚNICA LISTA COM TUDO
  const [allEntries, setAllEntries] = useState<UserMovieEntry[]>([])
  
  const [isListLoading, setIsListLoading] = useState(false)

  // 4. OUVINTE DE AUTH (Atualizado)
  // Busca TODAS as entradas quando o usuário faz login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser) {
        setIsLoading(true)
        try {
          // Chama a nova rota GET /api/movies/
          const entries = await api.get('/movies/')
          setAllEntries(entries as UserMovieEntry[])
        } catch (error) {
          console.error("Erro ao buscar listas do usuário:", error)
          setAllEntries([])
        }
        setIsLoading(false)
      } else {
        // Se o usuário deslogou, LIMPA TUDO
        setAllEntries([])
        setIsLoading(false)
      }
    })
    return unsubscribe
  }, [])
  
  // 5. ESTADOS DERIVADOS (As 3 Listas que você quer)
  // 'useMemo' recalcula as listas apenas quando 'allEntries' muda
  const favorites = useMemo(() => 
    allEntries.filter(e => e.is_favorite), 
    [allEntries]
  )
  const watchLater = useMemo(() => 
    allEntries.filter(e => e.is_watch_later), 
    [allEntries]
  )
  const watched = useMemo(() => 
    allEntries.filter(e => e.is_watched), 
    [allEntries]
  )

  // O "Mapa" de busca (tmdb_id -> entrada inteira)
  const movieLookup = useMemo(() => {
    // Garante que 'allEntries' seja um array antes de mapear
    const entries = allEntries || []; 
    return new Map(entries.map(entry => [entry.tmdb_id, entry]))
  }, [allEntries])

  // 6. A NOVA FUNÇÃO DE AÇÃO "SMART"
  // Atualiza o status de um filme (chama POST /api/movie-status/)
  const setMovieStatus = async (movie: Movie, listType: ListType, status: boolean) => {
    if (!user) return
    setIsListLoading(true)
    
    try {
      const payload = {
        tmdb_id: movie.id,
        list_type: listType, // 'is_favorite', 'is_watched', etc.
        status: status,      // true ou false
        // Envia os dados do filme, caso seja a 1ª vez
        movie_data: { 
          title: movie.title,
          poster_path: movie.poster_path,
          rating: (movie as any).vote_average || movie.rating || 7.0,
        }
      }
      
      // Chama a nova API "smart"
      const updatedEntry = await api.post('/movie-status/', payload)

      // 7. LÓGICA DE FEEDBACK IMEDIATO (Otimista)
      setAllEntries(prevEntries => {
        // Remove a versão antiga da lista
        const otherEntries = prevEntries.filter(e => e.tmdb_id !== movie.id)
        
        if (updatedEntry.status === 'deleted') {
          // O backend limpou a entrada (tudo é false), então removemos
          return otherEntries
        } else {
          // Adiciona a nova versão atualizada
          return [...otherEntries, updatedEntry]
        }
      })
      
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      // TODO: Adicionar Toast de erro
    }
    setIsListLoading(false)
  }
  // --- Funções de Login (sem mudança) ---
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("Erro no login com Google:", error)
    }
  }
  
  const signUpWithEmail = async ({ email, password }: EmailPasswordCredentials) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Erro ao registrar com email:", error)
    }
  }

  const loginWithEmail = async ({ email, password }: EmailPasswordCredentials) => {
     try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Erro ao logar com email:", error)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      // (o 'onAuthStateChanged' vai limpar 'user' e 'allEntries')
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  // 7. Disponibiliza TUDO no contexto
  const value = {
    user,
    isLoading,
    loginWithGoogle,
    signUpWithEmail,
    loginWithEmail,
    logout,
    
    // --- Novas props ---
    favorites,
    watchLater,
    watched,
    movieLookup,
    setMovieStatus, // <-- A nova função
    isListLoading,
  }

  if (isLoading) {
    return <div>Carregando...</div>
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