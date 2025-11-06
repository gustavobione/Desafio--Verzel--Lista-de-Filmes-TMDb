// Arquivo: Frontend/src/routes/login.tsx
// (Este é o "CÉREBRO" - A página "SMART" que contém toda a lógica)

import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/login-form' // <-- Importa o componente "DUMB"

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  // 1. Toda a lógica (hooks) vive aqui, na página
  const { 
    user, 
    loginWithGoogle, 
    loginWithEmail, 
    signUpWithEmail 
  } = useAuth()
  
  const navigate = useNavigate({ from: '/login' })

  // 2. Todo o estado vive aqui
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 3. Todo efeito colateral vive aqui
  useEffect(() => {
    if (user) {
      navigate({ to: '/' })
    }
  }, [user, navigate])

  // 4. Todos os handlers (funções) vivem aqui
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    if (isSignUp) {
      await signUpWithEmail({ email, password })
    } else {
      await loginWithEmail({ email, password })
    }
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    await loginWithGoogle()
    setIsLoading(false)
  }
  
  // 5. A página renderiza o componente "DUMB" e passa
  // toda a lógica e estado para ele via props.
  return (
    <LoginForm 
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      isSignUp={isSignUp}
      setIsSignUp={setIsSignUp}
      isLoading={isLoading}
      handleSubmit={handleSubmit}
      handleGoogleLogin={handleGoogleLogin}
    />
  )
}