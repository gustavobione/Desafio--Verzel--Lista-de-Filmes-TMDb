import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from '@/lib/utils'

interface LoginFormProps {
  email: string
  setEmail: (value: string) => void
  password: string
  setPassword: (value: string) => void
  isSignUp: boolean
  setIsSignUp: (value: boolean) => void
  isLoading: boolean
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleGoogleLogin: () => void
}

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  isSignUp,
  setIsSignUp,
  isLoading,
  handleSubmit,
  handleGoogleLogin,
}: LoginFormProps) {

  return (
    <div className={cn("flex flex-grow items-center justify-center w-full py-12 bg-muted/30")}>
      <Card className="overflow-hidden p-0 shadow-lg w-full max-w-4xl">
        <CardContent className="grid p-0 md:grid-cols-2">

          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  {isSignUp ? "Crie sua conta" : "Bem-vindo de volta"}
                </h1>
                <p className="text-muted-foreground text-balance">
                  {isSignUp
                    ? "Insira seus dados para se registrar"
                    : "Faça login na sua conta"
                  }
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  disabled={isLoading} 
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  {!isSignUp && (
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Esqueceu sua senha?
                    </a>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  disabled={isLoading} 
                />
              </Field>

              <Field>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Carregando..." : (isSignUp ? "Registrar" : "Login")}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Ou continue com
              </FieldSeparator>

              <Field>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full bg-white text-black hover:bg-gray-100 hover:text-black"
                  onClick={handleGoogleLogin} 
                  disabled={isLoading}
                >
                  <img
                    src="/google-icon.svg"
                    alt="Google"
                    className="mr-2 h-5 w-5"
                  />
                  Login com Google
                </Button>
              </Field>

              <FieldDescription className="text-center">
                {isSignUp ? "Já tem uma conta? " : "Não tem uma conta? "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)} 
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                  disabled={isLoading}
                >
                  {isSignUp ? "Faça login" : "Registre-se"}
                </button>
              </FieldDescription>
            </FieldGroup>
          </form>
          
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2070&auto=format&fit=crop"
              alt="Sala de cinema"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}