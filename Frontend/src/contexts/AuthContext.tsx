// Arquivo: Frontend/src/contexts/AuthContext.tsx

import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User as FirebaseUser } from 'firebase/auth'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@/lib/firebase' // Importa do seu firebase.ts

type AuthUser = FirebaseUser | null

// 2. Define os tipos para as novas funções
type EmailPasswordCredentials = {
  email: string
  password: string
}

interface AuthContextType {
  user: AuthUser
  isLoading: boolean
  loginWithGoogle: () => Promise<void> // Renomeado para clareza
  signUpWithEmail: (creds: EmailPasswordCredentials) => Promise<void>
  loginWithEmail: (creds: EmailPasswordCredentials) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setIsLoading(false)
    })
    return unsubscribe
  }, [])

  // Função de Login com Google
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("Erro no login com Google:", error)
      // TODO: Mostrar um Toast de erro para o usuário
    }
  }
  
  // 3. Adiciona a função de REGISTRO com email
  const signUpWithEmail = async ({ email, password }: EmailPasswordCredentials) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Erro ao registrar com email:", error)
      // TODO: Mostrar um Toast de erro
    }
  }

  // 4. Adiciona a função de LOGIN com email
  const loginWithEmail = async ({ email, password }: EmailPasswordCredentials) => {
     try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Erro ao logar com email:", error)
      // TODO: Mostrar um Toast de erro
    }
  }

  // Função de Logout
  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  // 5. Disponibiliza os novos valores
  const value = {
    user,
    isLoading,
    loginWithGoogle, // Nome atualizado
    signUpWithEmail,
    loginWithEmail,
    logout,
  }

  if (isLoading) {
    return <div>Carregando...</div> // TODO: Adicionar um Spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// O Hook 'useAuth' continua o mesmo
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}