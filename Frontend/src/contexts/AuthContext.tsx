import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react'
import type { User as FirebaseUser } from 'firebase/auth'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@/lib/firebase'
import { api } from '@/lib/api'
import type { Movie } from '@/components/MovieCard' 

export type ListType = 'is_favorite' | 'is_watch_later' | 'is_watched'


export interface UserMovieEntry {
  id: string 
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

interface AuthContextType {
  user: AuthUser
  isLoading: boolean
  loginWithGoogle: () => Promise<void>
  signUpWithEmail: (creds: EmailPasswordCredentials) => Promise<void>
  loginWithEmail: (creds: EmailPasswordCredentials) => Promise<void>
  logout: () => Promise<void>
  favorites: UserMovieEntry[]
  watchLater: UserMovieEntry[]
  watched: UserMovieEntry[]
  movieLookup: Map<number, UserMovieEntry> 
  setMovieStatus: (movie: Movie, listType: ListType, status: boolean) => Promise<void>
  isListLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const [allEntries, setAllEntries] = useState<UserMovieEntry[]>([])
  
  const [isListLoading, setIsListLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser) {
        setIsLoading(true)
        try {
          const entries = await api.get('/movies/')
          setAllEntries(entries as UserMovieEntry[])
        } catch (error) {
          console.error("Erro ao buscar listas do usuário:", error)
          setAllEntries([])
        }
        setIsLoading(false)
      } else {
        setAllEntries([])
        setIsLoading(false)
      }
    })
    return unsubscribe
  }, [])

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

  const movieLookup = useMemo(() => {
    const entries = allEntries || []; 
    return new Map(entries.map(entry => [entry.tmdb_id, entry]))
  }, [allEntries])

  const setMovieStatus = async (movie: Movie, listType: ListType, status: boolean) => {
    if (!user) return
    setIsListLoading(true)
    
    try {
      const payload = {
        tmdb_id: movie.id,
        list_type: listType,
        status: status,      
        movie_data: { 
          title: movie.title,
          poster_path: movie.poster_path,
          rating: (movie as any).vote_average || movie.rating || 7.0,
        }
      }
      

      const updatedEntry = await api.post('/movie-status/', payload)


      setAllEntries(prevEntries => {

        const otherEntries = prevEntries.filter(e => e.tmdb_id !== movie.id)
        
        if (updatedEntry.status === 'deleted') {
          return otherEntries
        } else {
          return [...otherEntries, updatedEntry]
        }
      })
      
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
    setIsListLoading(false)
  }
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
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const value = {
    user,
    isLoading,
    loginWithGoogle,
    signUpWithEmail,
    loginWithEmail,
    logout,
    favorites,
    watchLater,
    watched,
    movieLookup,
    setMovieStatus,
    isListLoading,
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}