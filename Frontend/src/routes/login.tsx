import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/login-form'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { 
    user, 
    loginWithGoogle, 
    loginWithEmail, 
    signUpWithEmail 
  } = useAuth()
  
  const navigate = useNavigate({ from: '/login' })

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate({ to: '/' })
    }
  }, [user, navigate])

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